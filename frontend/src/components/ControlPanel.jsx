import React, { useState } from 'react';
import useGraphStore from '../store/useGraphStore';
import { Play, RotateCcw, PlusCircle, Trash2, MapPin, Activity, Undo2 } from 'lucide-react';

const ControlPanel = () => {
  const mode = useGraphStore(state => state.mode);
  const setMode = useGraphStore(state => state.setMode);
  
  const nodes = useGraphStore(state => state.nodes);
  const edges = useGraphStore(state => state.edges);
  const source = useGraphStore(state => state.source);
  const target = useGraphStore(state => state.target);
  const setSource = useGraphStore(state => state.setSource);
  const setTarget = useGraphStore(state => state.setTarget);
  const setResult = useGraphStore(state => state.setResult);
  const setMaxFlowResult = useGraphStore(state => state.setMaxFlowResult);
  const setIsCalculating = useGraphStore(state => state.setIsCalculating);
  const clearGraph = useGraphStore(state => state.clearGraph);
  const resetResult = useGraphStore(state => state.resetResult);
  const addNode = useGraphStore(state => state.addNode);
  const undoGraph = useGraphStore(state => state.undoGraph);
  const history = useGraphStore(state => state.history);

  const [error, setError] = useState(null);
  const [nodeName, setNodeName] = useState('');

  const handleAddNode = () => {
    if (!nodeName.trim()) return;
    const newNodeId = nodeName.trim().toUpperCase();
    if (nodes.find(n => n.id === newNodeId)) {
      setError(`Node [${newNodeId}] đã tồn tại!`);
      return;
    }
    setError(null);
    const newNode = {
      id: newNodeId,
      position: { x: Math.random() * 400 + 100, y: Math.random() * 400 + 100 },
      data: { label: newNodeId },
      type: 'circle',
    };
    addNode(newNode);
    setNodeName('');
  };

  const handleRun = async () => {
    if (!source || !target) {
      setError("Vui lòng chọn Điểm bắt đầu và Điểm đích.");
      return;
    }
    if (source === target) {
      setError("Điểm xuất phát và Điểm đến phải khác nhau.");
      return;
    }
    if (nodes.length < 2) {
      setError("Đồ thị phải có ít nhất 2 Nút để giải.");
      return;
    }

    setError(null);
    setIsCalculating(true);
    resetResult();

    try {
      const payload = {
        source,
        target,
        directed: mode === 'maxFlow' ? true : false,
        nodes: nodes.map(n => n.id),
        edges: edges.map(e => ({
          source: e.source,
          target: e.target,
          weight: parseFloat(e.data?.weight || e.label || 1),
          capacity: parseFloat(e.data?.capacity || e.data?.weight || e.label || 1)
        }))
      };

      const baseUrl = 'https://shortest-path-in-decision-making-engineer.onrender.com';
      const endpoint = mode === 'maxFlow' 
        ? `${baseUrl}/api/v1/max-flow/calculate`
        : `${baseUrl}/api/v1/shortest-path/calculate`;

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const resData = await res.json();
      
      if (resData.status === 'success') {
        if (mode === 'maxFlow') {
          const { max_flow, flow_distribution, calculation_steps } = resData.data;
          setMaxFlowResult(max_flow, calculation_steps, flow_distribution);
        } else {
          const { shortest_distance, path, calculation_steps } = resData.data;
          setResult(path, shortest_distance, calculation_steps);
        }
      } else {
        setError(resData.message || "Có lỗi xảy ra từ máy chủ.");
        setIsCalculating(false);
      }
    } catch (err) {
      setError("Không thể kết nối đến Backend API. Hãy chắc chắn Server đã chạy.");
      setIsCalculating(false);
    }
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    resetResult();
    setError(null);
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 text-slate-200">
      <div className="p-6 border-b border-slate-800 bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-400 to-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.4)] flex items-center justify-center">
             <Activity className="text-white" size={24} />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-white tracking-tight drop-shadow-md">Transshipment & Shortest Path</h2>
            <p className="text-xs text-slate-400 font-medium tracking-wide">Network Graph Solver</p>
          </div>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex bg-slate-800/50 p-1 rounded-xl border border-slate-700 mt-6 shadow-inner">
          <button 
            onClick={() => handleModeChange('shortestPath')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === 'shortestPath' ? 'bg-cyan-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-300'}`}
          >
            SHORTEST PATH
          </button>
          <button 
            onClick={() => handleModeChange('maxFlow')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === 'maxFlow' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-300'}`}
          >
            MAX FLOW
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
        {/* Section: Xây dựng Đồ thị */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 font-bold text-xs text-cyan-400">1</div>
             <h3 className="text-sm font-bold text-slate-300">XÂY DỰNG ĐỒ THỊ</h3>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">TÊN NÚT (NODE)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all text-white placeholder-slate-600"
                  placeholder="Ví dụ: A, B, S, T..."
                  value={nodeName}
                  onChange={e => setNodeName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddNode()}
                />
                <button 
                  onClick={handleAddNode}
                  className="bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded-lg transition-colors shadow-lg shadow-cyan-900/50"
                  title="Thêm Nút"
                >
                  <PlusCircle size={20} />
                </button>
              </div>
            </div>
            <div className="bg-cyan-950/30 border border-cyan-900/50 p-2.5 rounded-lg">
              <p className="text-xs text-cyan-300 leading-relaxed font-medium">
                Tạo 2 đỉnh trở lên. Chọn chế độ <b>{mode === 'maxFlow' ? 'Max Flow' : 'Shortest Path'}</b>, sau đó kéo đường thẳng giữa 2 đỉnh và nhập {mode === 'maxFlow' ? 'sức chứa' : 'khoảng cách'} cho nó!
              </p>
              <div className="mt-2 text-[11px] text-cyan-400/80 bg-cyan-950/50 p-2 rounded flex flex-col gap-1 border border-cyan-800/30">
                 <b>Mẹo Vẽ Đồ Thị:</b>
                 <ul className="list-disc pl-4">
                   <li>Click vào nút hoặc đường cung, rồi bấm phím <b>Delete</b> hoặc <b>Backspace</b> để Xóa.</li>
                   <li>Bấm và giữ chuột vào viền Node để kéo mũi tên sang Node khác.</li>
                 </ul>
              </div>
            </div>
          </div>
          
          {nodes.length > 0 && (
            <div className="flex gap-2">
              <button 
                onClick={clearGraph}
                className="flex-1 py-2.5 px-4 rounded-lg border border-red-500/40 bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:border-red-500/60 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                title="Xóa trống đồ thị hiện tại"
              >
                <Trash2 size={16} /> LÀM LẠI
              </button>
              
              <button 
                onClick={undoGraph}
                disabled={history.length === 0}
                className={`py-2.5 px-4 rounded-lg border transition-colors text-sm font-bold flex items-center justify-center gap-2 
                  ${history.length > 0 
                    ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 hover:border-yellow-500/60' 
                    : 'border-slate-700 bg-slate-800 text-slate-600 cursor-not-allowed'}`}
                title="Hoàn tác thao tác lưới gần nhất (Chỉ áp dụng: Thêm/Xoá Node/Cung)"
              >
                <Undo2 size={16} /> HOÀN TÁC
              </button>
            </div>
          )}
        </div>

        {/* Section: Giải Thuật */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 font-bold text-xs text-emerald-400">2</div>
             <h3 className="text-sm font-bold text-slate-300">THUẬT TOÁN</h3>
          </div>
          
          <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">ĐỈNH BẮT ĐẦU (SOURCE)</label>
              <select 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white cursor-pointer hover:bg-slate-900 transition-colors"
                value={source || ''}
                onChange={e => setSource(e.target.value)}
              >
                <option value="" disabled className="text-slate-500">-- Chọn đỉnh --</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">ĐỈNH ĐÍCH (SINK/TARGET)</label>
              <select 
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-white cursor-pointer hover:bg-slate-900 transition-colors"
                value={target || ''}
                onChange={e => setTarget(e.target.value)}
              >
                <option value="" disabled className="text-slate-500">-- Chọn đỉnh --</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </div>

            {error && (
              <div className="bg-red-950/50 border border-red-500/50 text-red-300 text-xs p-3 rounded-lg flex items-start gap-2">
                <span className="font-bold">!</span> {error}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleRun}
                className={`flex-1 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 text-white ${mode === 'maxFlow' ? 'bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.3)]' : 'bg-emerald-600 hover:bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]'}`}
              >
                <Play size={18} fill="currentColor" /> BẮT ĐẦU TÍNH
              </button>
            </div>
          </div>
        </div>

        {/* Section: Kết quả */}
        <div className="space-y-4 pb-10">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 font-bold text-xs text-yellow-400">3</div>
             <h3 className="text-sm font-bold text-slate-300">KẾT QUẢ KHOA HỌC</h3>
          </div>
          <ResultPanel mode={mode} />
        </div>

      </div>
    </div>
  );
};

const ResultPanel = ({ mode }) => {
  const shortestDistance = useGraphStore(state => state.shortestDistance);
  const shortestPath = useGraphStore(state => state.shortestPath);
  const maxFlowValue = useGraphStore(state => state.maxFlowValue);
  const steps = useGraphStore(state => state.calculationSteps);

  if ((mode === 'shortestPath' && shortestDistance === null) || 
      (mode === 'maxFlow' && maxFlowValue === null)) {
    return (
      <div className="text-center p-8 bg-slate-800/30 border border-dashed border-slate-700 rounded-xl text-slate-500 text-sm font-medium">
        (Kết quả sẽ hiển thị ở đây)
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
      {mode === 'shortestPath' ? (
        <>
          <div className="bg-emerald-950/80 border border-emerald-500/50 rounded-xl p-5 relative overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <p className="text-xs font-bold text-emerald-400/80 mb-1 tracking-wider uppercase">TỔNG KHOẢNG CÁCH NGẮN NHẤT</p>
            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-300 to-green-500">{shortestDistance}</p>
          </div>
          
          <div className="bg-slate-800/80 rounded-xl p-5 border border-slate-700 relative shadow-inner">
            <p className="text-xs font-bold text-slate-400 tracking-wider mb-3 uppercase">LỘ TRÌNH ĐI</p>
            <div className="flex flex-wrap items-center gap-2">
              {shortestPath.map((nodeId, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-3.5 py-1.5 bg-cyan-950 border border-cyan-500/50 text-cyan-300 rounded-lg text-sm font-bold shadow-lg">
                    {nodeId}
                  </span>
                  {idx < shortestPath.length - 1 && (
                    <span className="text-slate-600 font-black text-lg">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-indigo-950/80 border border-indigo-500/50 rounded-xl p-5 relative overflow-hidden shadow-[0_0_20px_rgba(79,70,229,0.15)]">
            <p className="text-xs font-bold text-indigo-400/80 mb-1 tracking-wider uppercase">TỔNG LUỒNG CỰC ĐẠI (MAX FLOW)</p>
            <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-indigo-300 to-purple-500">{maxFlowValue}</p>
          </div>
          <div className="text-xs text-slate-400 italic">
            Ghi chú: Lượng hàng phân bổ chi tiết đã được tô màu xanh hiển thị trên các cung tương ứng ở đồ thị bên cạnh.
          </div>
        </>
      )}

      {steps && steps.length > 0 && (
        <div className="bg-black/40 rounded-xl p-4 border border-slate-800/80 font-mono">
           <p className="text-[10px] font-bold text-slate-500 tracking-widest mb-3 uppercase">TERMINAL LOGS</p>
           <div className="h-40 overflow-y-auto text-[11px] leading-relaxed text-emerald-400 custom-scrollbar pr-2 space-y-1.5">
             {steps.map((step, i) => (
               <div key={i} className="hover:text-emerald-300 transition-colors border-l-2 border-emerald-500/30 pl-2">
                 {step}
               </div>
             ))}
           </div>
        </div>
      )}
    </div>
  );
}

export default ControlPanel;
