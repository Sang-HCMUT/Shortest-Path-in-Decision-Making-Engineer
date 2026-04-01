import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import GraphCanvas from './components/GraphCanvas';
import ControlPanel from './components/ControlPanel';

function App() {
  return (
    <div className="flex h-screen w-full bg-slate-50 font-sans text-slate-800 overflow-hidden">
      <div className="flex-1 relative h-full">
        <ReactFlowProvider>
          <GraphCanvas />
        </ReactFlowProvider>
      </div>
      {/* Thanh công cụ chuyên nghiệp */}
      <div className="w-[420px] h-full flex-none bg-white border-l border-slate-200 z-50 shadow-sm relative flex flex-col">
        <ControlPanel />
      </div>
    </div>
  );
}

export default App;
