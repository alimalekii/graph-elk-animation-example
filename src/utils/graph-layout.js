import ELK from 'elkjs/lib/elk.bundled.js';

const GRAPH_LAYOUTS = [
  { 'elk.algorithm': 'layered' },
  { 'elk.algorithm': 'box' },
  { 'elk.algorithm': 'mrtree' },
  { 'elk.algorithm': 'rectpacking' },
];

const handleGraphStructureToELK = (graph) => {
  const { nodes, links } = graph;
  const graphId = 'graph';
  const layoutOptions =
    GRAPH_LAYOUTS[Math.floor(Math.random() * GRAPH_LAYOUTS.length)];
  const children = nodes.map((nod) => ({ id: nod.id, width: 30, height: 30 }));
  const edges = links.map((link) => ({
    id: link.id,
    sources: [link.source.id],
    targets: [link.target.id],
  }));

  return {
    id: graphId,
    layoutOptions,
    children,
    edges,
  };
};

const handleGraphNodePositions = (graph) => {
  const endPositions = graph.children.reduce((acc, { id, x, y }) => {
    acc[`${id}-x`] = x;
    acc[`${id}-y`] = y;
    return acc;
  }, {});

  return endPositions;
};

export const layoutGraph = async (graph) => {
  const elk = new ELK();
  let ELKGraph = handleGraphStructureToELK(graph);

  try {
    ELKGraph = await elk.layout(ELKGraph);
  } catch (error) {
    console.error('Error during graph layout:', error);
    throw error;
  }

  const positions = handleGraphNodePositions(ELKGraph);
  return positions;
};

export default layoutGraph;
