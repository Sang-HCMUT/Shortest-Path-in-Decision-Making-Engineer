import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import GraphCanvas from './components/GraphCanvas';
import ControlPanel from './components/ControlPanel';

function App() {
  return (
    <div className="flex h-screen w-full bg-slate-950 font-sans text-slate-200 overflow-hidden">
      <div className="flex-1 relative h-full">
        <ReactFlowProvider>
          <GraphCanvas />
        </ReactFlowProvider>
      </div>
      {/* Tách bạch rõ rệt thanh công cụ bên phải, nền đặc không dùng blur nữa để tránh lỗi hiển thị */}
      <div className="w-[420px] h-full flex-none bg-[#0f172a] border-l border-slate-800 z-50 shadow-2xl relative flex flex-col">
        <ControlPanel />
      </div>
    </div>
  );
}

export default App;
