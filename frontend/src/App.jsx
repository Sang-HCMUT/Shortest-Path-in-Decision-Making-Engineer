import React from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import GraphCanvas from './components/GraphCanvas';
import ControlPanel from './components/ControlPanel';

function App() {
  React.useEffect(() => {
    // Gọi API để đánh thức backend (Khắc phục vấn đề sleep của gói Render Free)
    const pingBackend = () => {
      fetch('https://shortest-path-in-decision-making-engineer.onrender.com/')
        .catch(err => console.log('Ping backend:', err));
    };
    
    pingBackend(); // Gọi ngay khi mở trang
    
    // Gọi định kỳ mỗi 10 phút (600000ms) để giữ backend không bị sleep
    const interval = setInterval(pingBackend, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

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
