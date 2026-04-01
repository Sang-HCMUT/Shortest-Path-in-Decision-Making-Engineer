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
    <div className="h-full flex flex-col bg-slate-50 text-slate-800">
      <div className="p-6 border-b border-slate-200 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
             <Activity className="text-blue-600" size={24} />
          </div>
          <div>
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Transshipment & Shortest Path</h2>
            <p className="text-xs text-slate-500 font-medium tracking-wide">Network Graph Solver</p>
          </div>
        </div>
        
        {/* Mode Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 mt-6 box-border">
          <button 
            onClick={() => handleModeChange('shortestPath')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === 'shortestPath' ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            SHORTEST PATH
          </button>
          <button 
            onClick={() => handleModeChange('maxFlow')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${mode === 'maxFlow' ? 'bg-white text-emerald-700 shadow-sm border border-slate-200' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
          >
            MAX FLOW
          </button>
        </div>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-8 custom-scrollbar">
        {/* Section: Xây dựng Đồ thị */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-300 font-bold text-xs text-slate-600">1</div>
             <h3 className="text-sm font-bold text-slate-700">XÂY DỰNG ĐỒ THỊ</h3>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1">TÊN NÚT (NODE)</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all text-slate-900 placeholder-slate-400"
                  placeholder="Ví dụ: A, B, S, T..."
                  value={nodeName}
                  onChange={e => setNodeName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddNode()}
                />
                <button 
                  onClick={handleAddNode}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors shadow-sm"
                  title="Thêm Nút"
                >
                  <PlusCircle size={20} />
                </button>
              </div>
            </div>
            <div className="bg-blue-50/50 border border-blue-200 p-3 rounded-lg">
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                Tạo 2 đỉnh trở lên. Chọn chế độ <b>{mode === 'maxFlow' ? 'Max Flow' : 'Shortest Path'}</b>, sau đó kéo đường thẳng giữa 2 đỉnh và nhập {mode === 'maxFlow' ? 'sức chứa' : 'khoảng cách'} cho nó!
              </p>
              <div className="mt-2 text-[11px] text-blue-700 bg-white p-2 rounded flex flex-col gap-1 border border-blue-100 shadow-sm">
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
                className="flex-1 py-2.5 px-4 rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm font-bold flex items-center justify-center gap-2"
                title="Xóa trống đồ thị hiện tại"
              >
                <Trash2 size={16} /> LÀM LẠI
              </button>
              
              <button 
                onClick={undoGraph}
                disabled={history.length === 0}
                className={`py-2.5 px-4 rounded-lg border transition-colors text-sm font-bold flex items-center justify-center gap-2 
                  ${history.length > 0 
                    ? 'border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100' 
                    : 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'}`}
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
             <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-300 font-bold text-xs text-slate-600">2</div>
             <h3 className="text-sm font-bold text-slate-700">THUẬT TOÁN</h3>
          </div>
          
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">ĐỈNH BẮT ĐẦU (SOURCE)</label>
              <select 
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 cursor-pointer hover:bg-slate-100/50 transition-colors"
                value={source || ''}
                onChange={e => setSource(e.target.value)}
              >
                <option value="" disabled className="text-slate-400">-- Chọn đỉnh --</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2">ĐỈNH ĐÍCH (SINK/TARGET)</label>
              <select 
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-slate-900 cursor-pointer hover:bg-slate-100/50 transition-colors"
                value={target || ''}
                onChange={e => setTarget(e.target.value)}
              >
                <option value="" disabled className="text-slate-400">-- Chọn đỉnh --</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg flex items-start gap-2">
                <span className="font-bold">!</span> {error}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button 
                onClick={handleRun}
                className={`flex-1 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 transform active:scale-95 text-white shadow-sm ${mode === 'maxFlow' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                <Play size={18} fill="currentColor" /> BẮT ĐẦU TÍNH
              </button>
            </div>
          </div>
        </div>

        {/* Section: Kết quả */}
        <div className="space-y-4 pb-10">
          <div className="flex items-center gap-2 mb-2">
             <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center border border-slate-300 font-bold text-xs text-slate-600">3</div>
             <h3 className="text-sm font-bold text-slate-700">KẾT QUẢ KHOA HỌC</h3>
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
      <div className="text-center p-8 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-slate-400 text-sm font-medium">
        (Kết quả sẽ hiển thị ở đây)
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-5 duration-500 ease-out">
      {mode === 'shortestPath' ? (
        <>
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 relative overflow-hidden">
            <p className="text-xs font-bold text-slate-500 mb-1 tracking-wider uppercase">TỔNG KHOẢNG CÁCH NGẮN NHẤT</p>
            <p className="text-5xl font-black text-blue-600">{shortestDistance}</p>
          </div>
          
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative">
            <p className="text-xs font-bold text-slate-500 tracking-wider mb-3 uppercase">LỘ TRÌNH ĐI</p>
            <div className="flex flex-wrap items-center gap-2">
              {shortestPath.map((nodeId, idx) => (
                <React.Fragment key={idx}>
                  <span className="px-3.5 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-sm font-bold">
                    {nodeId}
                  </span>
                  {idx < shortestPath.length - 1 && (
                    <span className="text-slate-400 font-black text-lg">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl p-5 relative overflow-hidden">
            <p className="text-xs font-bold text-slate-500 mb-1 tracking-wider uppercase">TỔNG LUỒNG CỰC ĐẠI (MAX FLOW)</p>
            <p className="text-5xl font-black text-emerald-600">{maxFlowValue}</p>
          </div>
          <div className="text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-200">
            Ghi chú: Lượng hàng phân bổ chi tiết đã được tô màu đánh dấu trên các cung đồ thị bên cạnh.
          </div>
        </>
      )}

      {steps && steps.length > 0 && (
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 font-mono">
           <p className="text-[10px] font-bold text-slate-400 tracking-widest mb-3 uppercase">CHI TIẾT MÔ PHỎNG</p>
           <div className="h-40 overflow-y-auto text-[11px] leading-relaxed text-slate-600 custom-scrollbar pr-2 space-y-1.5">
             {steps.map((step, i) => (
               <div key={i} className="hover:text-slate-900 transition-colors border-l-2 border-slate-300 pl-2">
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
