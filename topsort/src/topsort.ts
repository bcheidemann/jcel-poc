import { Graph } from "./graph";

export function topsort<Node>(graph: Graph<Node>, entry: Node) {
  const visited = new Set<Node>();
  const sorted = new Array<Node>();

  function visit(node: Node) {
    if (visited.has(node)) {
      return;
    }

    visited.add(node);

    for (const child of graph.get(node)!) {
      visit(child);
    }

    sorted.unshift(node);
  }

  visit(entry);

  return sorted;
}
