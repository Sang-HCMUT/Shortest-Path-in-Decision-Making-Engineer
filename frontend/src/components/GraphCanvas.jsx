import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MarkerType,
  Position,
  ConnectionMode
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import useGraphStore from '../store/useGraphStore';
import CircleNode from './CircleNode';

const nodeTypes = { circle: CircleNode };

const GraphCanvas = () => {
  const nodes = useGraphStore(state => state.nodes);
  const edges = useGraphStore(state => state.edges);
  const onNodesChange = useGraphStore(state => state.onNodesChange);
  const onEdgesChange = useGraphStore(state => state.onEdgesChange);
  const onNodesDelete = useGraphStore(state => state.onNodesDelete);
  const onEdgesDelete = useGraphStore(state => state.onEdgesDelete);
  const addEdgeToStore = useGraphStore(state => state.addEdge);
  
  const mode = useGraphStore(state => state.mode);
  const shortestPath = useGraphStore(state => state.shortestPath);
  const maxFlowDistribution = useGraphStore(state => state.maxFlowDistribution);

  // Compute styled nodes
  const styledNodes = useMemo(() => {
    return nodes.map(n => ({
      ...n,
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      data: {
        ...n.data,
        isPath: mode === 'shortestPath' && shortestPath.includes(n.id)
      }
    }));
  }, [nodes, shortestPath, mode]);

  // Compute styled edges
  const styledEdges = useMemo(() => {
    return edges.map(e => {
      // DEFAULT STYLE
      let style = { stroke: '#64748b', strokeWidth: 2 };
      let label = e.data?.weight !== undefined ? String(e.data.weight) : (e.label || "1");
      let animated = false;
      let markerEnd = { type: MarkerType.ArrowClosed, color: '#64748b' };
      
      if (mode === 'shortestPath') {
        const sourceIdx = shortestPath.indexOf(e.source);
        const targetIdx = shortestPath.indexOf(e.target);
        if (sourceIdx !== -1 && targetIdx !== -1 && Math.abs(sourceIdx - targetIdx) === 1) {
          animated = true;
          style = { stroke: '#4ade80', strokeWidth: 4, filter: 'drop-shadow(0 0 5px rgba(74, 222, 128, 0.8))' };
          markerEnd = { type: MarkerType.ArrowClosed, color: '#4ade80' };
        }
      } else if (mode === 'maxFlow') {
        // Show capacity globally if we have it, else weight
        const cap = e.data?.capacity !== undefined ? e.data.capacity : (e.data?.weight || e.label || 1);
        label = `${cap}`;
        
        if (maxFlowDistribution) {
          // Check if this edge has flow mapping
          const dist = maxFlowDistribution[`${e.source}-${e.target}`];
          if (dist && dist.flow > 0) {
            label = `${dist.flow} / ${dist.capacity}`;
            animated = true;
            // Width by relative flow
            const ratio = dist.flow / dist.capacity;
            const strokeWidth = Math.max(3, ratio * 7);
            style = { stroke: '#818cf8', strokeWidth: strokeWidth, filter: 'drop-shadow(0 0 5px rgba(129, 140, 248, 0.8))' };
            markerEnd = { type: MarkerType.ArrowClosed, color: '#818cf8' };
          }
        }
      }

      return { 
        ...e, 
        label,
        animated, 
        style,
        markerEnd
      };
    });
  }, [edges, shortestPath, maxFlowDistribution, mode]);

  const onConnect = useCallback((params) => {
    const promptText = mode === 'maxFlow' 
      ? 'Nhập Sức chứa tối đa (Capacity) cho tuyến đường này (Ví dụ: 50):'
      : 'Nhập Khoảng cách / Trọng số cho đường này (Ví dụ: 5):';
      
    const valInput = window.prompt(promptText, "1");
    if (valInput !== null && valInput.trim() !== '') {
      const val = parseFloat(valInput);
      if (isNaN(val) || val < 0) {
        alert("Giá trị phải là một số >= 0!");
        return;
      }
      const newEdge = {
        ...params,
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        label: `${val}`,
        data: { weight: val, capacity: val },
        type: 'default',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#64748b',
        },
        style: { stroke: '#64748b', strokeWidth: 2 },
        labelStyle: { fill: '#f8fafc', fontWeight: 700, fontSize: 13 },
        labelBgStyle: { fill: '#334155', fillOpacity: 0.9, rx: 6, ry: 6 },
        labelBgPadding: [8, 4],
      };
      addEdgeToStore(newEdge);
    }
  }, [addEdgeToStore, mode]);

  return (
    <div className="h-full w-full bg-[#0a0f1d] absolute inset-0">
      <ReactFlow
        nodes={styledNodes}
        edges={styledEdges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        fitView
        colorMode="dark"
        className="react-flow-dark"
      >
        <Background color="#334155" variant="dots" gap={20} size={1.5} />
        <Controls />
      </ReactFlow>
      
      {nodes.length === 0 && (
         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none text-slate-500 text-center bg-slate-900/80 p-6 rounded-2xl border border-slate-800 backdrop-blur-md">
            <h3 className="text-xl font-medium mb-2 text-slate-300">Chưa có dữ liệu đồ thị</h3>
            <p className="text-sm text-slate-400">Sử dụng Bảng điều khiển để tạo Node, sau đó kéo thả giữa các Node để tạo Cung.</p>
         </div>
      )}
    </div>
  );
};

export default GraphCanvas;
