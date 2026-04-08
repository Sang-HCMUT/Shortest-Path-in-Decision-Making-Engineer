import React from 'react';
import { getStraightPath, BaseEdge, EdgeLabelRenderer, useInternalNode } from '@xyflow/react';
import { getEdgeParams } from '../utils/edgeUtils';

export default function FloatingEdge({ id, source, target, markerEnd, style, label, animated }) {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);

  if (!sourceNode || !targetNode || !sourceNode.measured || !targetNode.measured) {
    return null;
  }

  const { sx, sy, tx, ty } = getEdgeParams(sourceNode, targetNode);

  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX: sx,
    sourceY: sy,
    targetX: tx,
    targetY: ty,
  });

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} className={animated ? 'react-flow__edge-path animated' : ''}/>
      {label && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: 'all',
              backgroundColor: '#ffffff',
              padding: '2px 6px',
              borderRadius: '4px',
              border: '1px solid #e2e8f0',
              fontWeight: 600,
              fontSize: '13px',
              color: '#334155',
            }}
            className="nodrag nopan"
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
