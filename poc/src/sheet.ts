import { Graph, topsort } from "@jcel/topsort";
import { compile } from "@jcel/utils";
import { Cell } from "./cell";

type CellId = `${string}/${string}`;

export class Sheet {
  private graph = new Graph<CellId>();
  private cells = new Map<CellId, Cell>();

  private createContextForCell(id: CellId) {
    return {
      cell: new Proxy([], {
        get: (_, x) => {
          if (typeof x === "string") {
            return new Proxy([], {
              get: (_, y) => {
                if (typeof y === "string") {
                  const cell = this.getCell(`${x}/${y}`);

                  if (cell) {
                    const target: CellId = `${x}/${y}`;

                    // Create a new edge between the nodes if needed
                    if (!this.graph.hasEdge(target, id)) {
                      this.graph.createEdge(target, id);
                    }

                    return cell.value;
                  }
                }
              },
              set: (_, y, value) => {
                if (typeof y === "string") {
                  const target: CellId = `${x}/${y}`;
                  let cell = this.getCell(target);

                  // Create a new cell if it does not exist
                  if (!cell) {
                    cell = this.createCell(target);
                  }
                  
                  // Update the value of the cell
                  // TODO: Should this cause a propogation of updates?
                  cell.value = value;

                  return true;
                }
                return false;
              }
            });
          }
        },
      }),
    };
  }

  private async propogateUpdates(entry: CellId, skipEntry = true) {
    const updateQueue = topsort(this.graph, entry);

    if (skipEntry) {
      updateQueue.shift();
    }

    for (const id of updateQueue) {
      const cell = this.cells.get(id);

      if (!cell) {
        throw new Error(`Failed to update cell. Cell ${id} does not exist`);
      }

      if (cell.formula) {
        cell.value = await cell.formula();
      }

      // TODO: Check for graph edge updates (this may occur if a cell has conditional logic to access another cells value)
    }
  }

  public createCell(id: CellId) {
    const cell = new Cell();
    this.cells.set(id, cell);
    this.graph.createNode(id);
    return cell;
  }

  public async setCellValue(id: CellId, value: string | number) {
    if (!this.cells.has(id)) {
      throw new Error(`Failed to set cell value. Cell ${id} does not exist`);
    }

    this.cells.get(id)!.value = value;

    await this.propogateUpdates(id);
  }

  public async setCellFormula(id: CellId, forumla: string) {
    if (!this.cells.has(id)) {
      throw new Error(`Failed to set cell formula. Cell ${id} does not exist`);
    }

    const cell = this.cells.get(id)!;
  
    // TODO: Fix build to allow return outside of function
    // const src = await build(forumla);
    const src = `return (async () => { ${forumla} })()`;
    cell.formula = compile(src, this.createContextForCell(id));

    cell.value = await cell.formula();

    await this.propogateUpdates(id);
  }

  public getCell(id: CellId) {
    return this.cells.get(id);
  }
}
