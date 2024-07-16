import { useCallback, useRef, useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';
import gsap from 'gsap';

// graph utils
import { genRandomTree, getColor, nodePaint, layoutGraph } from '../../utils';

const Graph = () => {
  const graphRef = useRef();
  const [graphData, setGraphData] = useState(() => genRandomTree(300));

  const updateGraphPositions = useCallback(
    (positions) => {
      const newPositions = {};
      Object.keys(positions).forEach((key) => {
        const [id, axis] = key.split('-');
        if (!newPositions[id]) newPositions[id] = {};
        newPositions[id][axis] = positions[key];
      });

      const updatedNodes = graphData.nodes.map((node) => ({
        ...node,
        x: newPositions[node.id]?.x ?? node.x,
        y: newPositions[node.id]?.y ?? node.y,
        fx: newPositions[node.id]?.x ?? node.x,
        fy: newPositions[node.id]?.y ?? node.y,
      }));

      const updatedLinks = graphData.links.map((link) => ({
        ...link,
        source: {
          ...link.source,
          x: newPositions[link.source.id]?.x ?? link.source.x,
          y: newPositions[link.source.id]?.y ?? link.source.y,
        },
        target: {
          ...link.target,
          x: newPositions[link.target.id]?.x ?? link.target.x,
          y: newPositions[link.target.id]?.y ?? link.target.y,
        },
      }));

      setGraphData({ nodes: updatedNodes, links: updatedLinks });
    },
    [graphData, setGraphData]
  );

  const handleNodeDrag = useCallback(
    (node) => {
      const updatedNodes = graphData.nodes.map((n) =>
        n.id === node.id
          ? { ...n, x: node.x, y: node.y, fx: node.x, fy: node.y }
          : n
      );

      const updatedLinks = graphData.links.map((link) => ({
        ...link,
        source:
          link.source.id === node.id
            ? { ...link.source, x: node.x, y: node.y }
            : link.source,
        target:
          link.target.id === node.id
            ? { ...link.target, x: node.x, y: node.y }
            : link.target,
      }));

      setGraphData({ nodes: updatedNodes, links: updatedLinks });
    },
    [graphData, setGraphData]
  );

  const handleNodeDragEnd = useCallback(
    (node) => {
      const updatedNodes = graphData.nodes.map((n) =>
        n.id === node.id ? { ...n, fx: node.x, fy: node.y } : n
      );

      setGraphData({ ...graphData, nodes: updatedNodes });
    },
    [graphData, setGraphData]
  );

  const onGraphAnimation = async () => {
    const { nodes } = graphData;

    const startPositions = nodes.reduce((acc, { id, x, y }) => {
      acc[`${id}-x`] = x;
      acc[`${id}-y`] = y;
      return acc;
    }, {});

    const endPositions = await layoutGraph(graphData);

    gsap.to(startPositions, {
      ...endPositions,
      onUpdate: () => updateGraphPositions(startPositions),
      onComplete: () => {
        graphRef.current.zoomToFit(500, 10);
      },
    });
  };

  return (
    <div className="graph-page">
      <div className="graph-container">
        <ForceGraph2D
          className="graph"
          nodeLabel="graph"
          backgroundColor="inherit"
          ref={graphRef}
          d3AlphaDecay={0.03}
          graphData={graphData}
          nodeCanvasObject={(node, ctx) =>
            nodePaint(node, getColor(node.i), ctx)
          }
          nodePointerAreaPaint={nodePaint}
          onNodeDrag={handleNodeDrag}
          onNodeDragEnd={handleNodeDragEnd}
          nodeRelSize={150}
          nodeColor={'lightblue'}
        />
      </div>
      <button className="graph-layout-btn" onClick={onGraphAnimation}>
        Layout
      </button>
    </div>
  );
};

export default Graph;
