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
import FloatingEdge from './FloatingEdge';

const nodeTypes = { circle: CircleNode };
const edgeTypes = { floating: FloatingEdge };

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
      // DEFAULT STYLE - Enterprise Light Mode
      let style = { stroke: '#94a3b8', strokeWidth: 1.5 };
      let label = e.data?.weight !== undefined ? String(e.data.weight) : (e.label || "1");
      let animated = false;
      let markerEnd = { type: MarkerType.ArrowClosed, color: '#94a3b8', width: 15, height: 15 };
      
      if (mode === 'shortestPath') {
        const sourceIdx = shortestPath.indexOf(e.source);
        const targetIdx = shortestPath.indexOf(e.target);
        if (sourceIdx !== -1 && targetIdx !== -1 && Math.abs(sourceIdx - targetIdx) === 1) {
          animated = true;
          style = { stroke: '#2563eb', strokeWidth: 2.5 };
          markerEnd = { type: MarkerType.ArrowClosed, color: '#2563eb', width: 20, height: 20 };
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
            const strokeWidth = Math.max(1.5, ratio * 4.5);
            style = { stroke: '#059669', strokeWidth: strokeWidth };
            markerEnd = { type: MarkerType.ArrowClosed, color: '#059669', width: 20, height: 20 };
          }
        }
      }

      return { 
        ...e, 
        type: 'floating',
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
        type: 'floating',
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#94a3b8',
          width: 15,
          height: 15
        },
        style: { stroke: '#94a3b8', strokeWidth: 1.5 },
        labelStyle: { fill: '#334155', fontWeight: 600, fontSize: 13 },
        labelBgStyle: { fill: '#ffffff', fillOpacity: 1, stroke: '#e2e8f0', strokeWidth: 1, rx: 4, ry: 4 },
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
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesDelete={onNodesDelete}
        onEdgesDelete={onEdgesDelete}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        connectionLineType="straight"
        connectionLineStyle={{ stroke: '#94a3b8', strokeWidth: 1.5 }}
        fitView
        colorMode="dark"
        className="react-flow-dark"
      >
        <Background color="#cbd5e1" variant="dots" gap={20} size={1.5} />
        <Controls className="bg-white border-slate-200 shadow-sm rounded-md" />
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
