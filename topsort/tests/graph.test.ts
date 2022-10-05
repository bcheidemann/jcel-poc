import { Graph } from "../src/graph";

describe("Graph", () => {
  describe("createNode", () => {
    it("Should create a new node in the graph", () => {;
      const graph = new Graph<string>();

      graph.createNode("A");

      expect(graph.has("A")).toBe(true);
    });

    it("Should throw an error if the node already exists", () => {
      const graph = new Graph<string>();

      graph.createNode("A");

      expect(() => {
        graph.createNode("A");
      }).toThrow();
    });
  });

  describe("removeNode", () => {
    it("Should remove a node and all corresponding edges from the graph", () => {
      const graph = new Graph<string>();

      graph.createNode("A");
      graph.createNode("B");
      graph.createNode("C");
      graph.createEdge("A", "B");
      graph.createEdge("C", "A");

      graph.removeNode("A");

      expect(graph.has("A")).toBe(false);
      expect(graph.has("B")).toBe(true);
      expect(graph.has("C")).toBe(true);
      expect(graph.get("C")!.has("A")).toBe(false);
    });

    it("Should throw an error if the node doesn't exist", () => {
      const graph = new Graph<string>();

      expect(() => {
        graph.removeNode("A");
      }).toThrow();
    });
  });

  describe("createEdge", () => {
    it("Should create an edge between two nodes", () => {
      const graph = new Graph<string>();

      graph.createNode("A");
      graph.createNode("B");
      graph.createEdge("A", "B");

      expect(graph.get("A")!.has("B")).toBe(true);
    });

    it("Should throw an error if the edge already exists", () => {
      const graph = new Graph<string>();

      graph.createNode("A");
      graph.createNode("B");
      graph.createEdge("A", "B");

      expect(() => {
        graph.createEdge("A", "B");
      }).toThrow();
    });
  });

  describe("removeEdge", () => {
    it("Should remove an edge between two nodes", () => {
      const graph = new Graph<string>();

      graph.createNode("A");
      graph.createNode("B");
      graph.createEdge("A", "B");
      graph.removeEdge("A", "B");

      expect(graph.get("A")!.has("B")).toBe(false);
    });

    it("Should throw an error if the edge doesn't exist", () => {
      const graph = new Graph<string>();

      graph.createNode("A");
      graph.createNode("B");

      expect(() => {
        graph.removeEdge("A", "B");
      }).toThrow();
    });
  });
});
