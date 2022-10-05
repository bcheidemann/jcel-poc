export class Graph<Node> extends Map<Node, Set<Node>> {

  /// Private Helper Methods

  private assertHasNodes(...nodes: Node[]) {
    for (const node of nodes) {
      if (!this.has(node)) {
        throw new Error(`Node ${node} not found in graph`);
      }
    }
  }

  private assertNotHasNodes(...nodes: Node[]) {
    for (const node of nodes) {
      if (this.has(node)) {
        throw new Error(`Node ${node} already exists in the graph`);
      }
    }
  }

  private assertHasEdge(from: Node, to: Node) {
    // Assert that both nodes exist
    this.assertHasNodes(from, to);

    // Assert that the edge exists
    if (!this.get(from)!.has(to)) {
      throw new Error(`Edge ${from} -> ${to} not found in graph`);
    }
  }

  private assertNotHasEdge(from: Node, to: Node) {
    // If the from node doesn't exist, then the edge doesn't exist
    if (!this.has(from)) {
      return;
    }

    // Assert that the edge doesn't exist
    if (this.get(from)!.has(to)) {
      throw new Error(`Edge ${from} -> ${to} already exists in graph`);
    }
  }

  /// Public Methods

  /**
   * Creates a new node in the graph.
   * 
   * @param node The node to be created
   */
  public createNode(node: Node) {
    // Assert that the node doesn't already exist
    this.assertNotHasNodes(node);

    // Create the node
    this.set(node, new Set());
  }

  /**
   * Removes a node and all corresponding edges from the graph.
   * 
   * @param node The node to be removed
   */
  public removeNode(node: Node) {
    // Assert that the node exists
    this.assertHasNodes(node);

    // Delete all edges that start from this node
    this.delete(node);
    
    // Delete all edges that point to this node
    this.forEach((to) => {
      to.delete(node);
    });
  }

  public createEdge(from: Node, to: Node) {
    // Assert that the edge exists
    this.assertNotHasEdge(from, to);
    
    // Create the edge
    this.get(from)!.add(to);
  }
  
  public removeEdge(from: Node, to: Node) {
    // Assert that the edge doesn't exist
    this.assertHasEdge(from, to);

    // Remove the edge
    this.get(from)!.delete(to);
  }

  public hasEdge(from: Node, to: Node) {
    return Boolean(this.get(from)?.has(to));
  }
}
