import { GraphData, GraphNode, GraphLink } from '../types/graph';

export function convertToGraphFormat(jsonData: any): GraphData {
  const nodes: GraphNode[] = [];
  const links: GraphLink[] = [];

  // Always add a root node
  nodes.push({
    id: 'root',
    name: 'Self',
    group: 'root',
    value: 20,
    x: 0,
    y: 0,
    z: 0
  });

  // Simple test data to verify graph is working
  const testCategories = ['Category1', 'Category2', 'Category3'];
  
  testCategories.forEach((cat, index) => {
    // Add category node
    nodes.push({
      id: cat,
      name: cat,
      group: 'category',
      value: 15,
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100
    });

    // Link to root
    links.push({
      source: 'root',
      target: cat,
      value: 2
    });

    // Add some child nodes
    for (let i = 0; i < 3; i++) {
      const childId = `${cat}_child_${i}`;
      nodes.push({
        id: childId,
        name: `Child ${i}`,
        group: 'leaf',
        value: 10,
        x: Math.random() * 200,
        y: Math.random() * 200,
        z: Math.random() * 200
      });

      links.push({
        source: cat,
        target: childId,
        value: 1
      });
    }
  });

  console.log('Generated test graph data:', { nodes: nodes.length, links: links.length });
  return { nodes, links };
}