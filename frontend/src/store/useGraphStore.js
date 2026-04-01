import { create } from 'zustand';
import { applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

const useGraphStore = create((set, get) => ({
  mode: 'shortestPath', // 'shortestPath' or 'maxFlow'
  setMode: (mode) => set({ mode }),

  nodes: [],
  edges: [],
  source: null,
  target: null,
  
  shortestPath: [],
  calculationSteps: [],
  shortestDistance: null,
  
  maxFlowValue: null,
  maxFlowDistribution: null,
  
  isCalculating: false,
  
  history: [],
  
  saveStateToHistory: () => set((state) => {
    const newHistory = [...state.history, { nodes: state.nodes, edges: state.edges }];
    if (newHistory.length > 50) newHistory.shift();
    return { history: newHistory };
  }),
  
  undoGraph: () => set((state) => {
    if (state.history.length === 0) return state;
    const newHistory = [...state.history];
    const previousState = newHistory.pop();
    return { 
      nodes: previousState.nodes, 
      edges: previousState.edges, 
      history: newHistory,
      shortestPath: [],
      maxFlowValue: null,
      maxFlowDistribution: null,
      shortestDistance: null,
      calculationSteps: []
    };
  }),

  onNodesChange: (changes) => set({ nodes: applyNodeChanges(changes, get().nodes) }),
  onEdgesChange: (changes) => set({ edges: applyEdgeChanges(changes, get().edges) }),
  
  onNodesDelete: () => get().saveStateToHistory(),
  onEdgesDelete: () => get().saveStateToHistory(),
  
  addNode: (node) => {
    get().saveStateToHistory();
    set((state) => ({ nodes: [...state.nodes, node] }));
  },
  addEdge: (edge) => {
    get().saveStateToHistory();
    set((state) => ({ edges: [...state.edges, edge] }));
  },

  setSource: (source) => set({ source }),
  setTarget: (target) => set({ target }),
  
  setResult: (path, distance, steps) => set({ 
    shortestPath: path, 
    shortestDistance: distance, 
    calculationSteps: steps,
    isCalculating: false 
  }),

  setMaxFlowResult: (flow, steps, distribution) => set({
    maxFlowValue: flow,
    calculationSteps: steps,
    maxFlowDistribution: distribution,
    isCalculating: false
  }),
  
  setIsCalculating: (isCalculating) => set({ isCalculating }),
  
  // Khôi phục toàn bộ đồ thị
  clearGraph: () => {
    get().saveStateToHistory();
    set({ 
      nodes: [], 
      edges: [], 
      source: null, 
      target: null, 
      shortestPath: [], 
      shortestDistance: null, 
      calculationSteps: [],
      maxFlowValue: null,
      maxFlowDistribution: null
    });
  },
  
  resetResult: () => set({ 
    shortestPath: [], 
    calculationSteps: [],
    shortestDistance: null, 
    maxFlowValue: null,
    maxFlowDistribution: null,
    isCalculating: false
  })
}));

export default useGraphStore;
