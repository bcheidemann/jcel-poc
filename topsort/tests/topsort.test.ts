import { Graph } from "../src/graph";
import { topsort } from "../src/topsort";

describe("topsort", () => {
  const anyNode = expect.any(String);

  it("should sort a simple linear graph", () => {
    const graph = new Graph<string>();

    graph.createNode("A");
    graph.createNode("B");
    graph.createNode("C");
    graph.createEdge("A", "B");
    graph.createEdge("B", "C");

    const sorted = topsort(graph, "A");

    expect(sorted).toEqual(["A", "B", "C"]);
  });

  it("should ignore upstream nodes", () => {
    const graph = new Graph<string>();

    graph.createNode("A");
    graph.createNode("B");
    graph.createNode("C");
    graph.createEdge("A", "B");
    graph.createEdge("B", "C");

    const sorted = topsort(graph, "B");

    expect(sorted).toEqual(["B", "C"]);
  });

  it("should handle a single circular dependency", () => {
    const graph = new Graph<string>();

    graph.createNode("A");
    graph.createNode("B");
    graph.createNode("C");
    graph.createEdge("A", "B");
    graph.createEdge("B", "C");
    graph.createEdge("C", "A");

    const sorted = topsort(graph, "A");

    expect(sorted).toEqual(["A", "B", "C"]);
  });

  it("should handle a multiple circular dependencies", () => {
    const graph = new Graph<string>();

    graph.createNode("A");
    graph.createNode("B");
    graph.createNode("C");
    graph.createEdge("A", "B");
    graph.createEdge("B", "C");
    graph.createEdge("B", "A");
    graph.createEdge("C", "A");

    const sorted = topsort(graph, "A");

    expect(sorted).toEqual(["A", "B", "C"]);
  });

  it("should sort a simple branching graph", () => {
    const graph = new Graph<string>();

    graph.createNode("A");
    graph.createNode("B");
    graph.createNode("C");
    graph.createNode("D");
    graph.createEdge("A", "B");
    graph.createEdge("A", "C");
    graph.createEdge("B", "D");
    graph.createEdge("C", "D");

    const sorted = topsort(graph, "A");

    expect(sorted).toEqual(["A", anyNode, anyNode, "D"]);
    expect(sorted.includes("B")).toBe(true);
    expect(sorted.includes("C")).toBe(true);
  });

  it("should sort a complex branching graph", () => {
    const graph = new Graph<string>();

    graph.createNode("A");
    graph.createNode("B");
    graph.createNode("C");
    graph.createNode("D");
    graph.createNode("E");
    graph.createNode("F");
    graph.createNode("G");

    graph.createEdge("A", "B");
    graph.createEdge("A", "C");

    graph.createEdge("B", "D");
    graph.createEdge("B", "E");

    graph.createEdge("C", "D");
    graph.createEdge("C", "E");

    graph.createEdge("D", "E");
    graph.createEdge("D", "F");

    graph.createEdge("E", "F");

    graph.createEdge("F", "G");

    const sorted = topsort(graph, "A");

    expect(sorted).toEqual(["A", anyNode, anyNode, "D", "E", "F", "G"]);
    expect(sorted.includes("B")).toBe(true);
    expect(sorted.includes("C")).toBe(true);
  });
});
