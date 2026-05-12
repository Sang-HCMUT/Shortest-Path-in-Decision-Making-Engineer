import React, { useState } from 'react';
import useGraphStore from '../store/useGraphStore';

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
      setError(`Lỗi: Đỉnh [${newNodeId}] đã tồn tại.`);
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
      setError("Vui lòng chọn Điểm bắt đầu và Điểm kết thúc.");
      return;
    }
    if (source === target) {
      setError("Điểm xuất phát và Điểm đến phải khác nhau.");
      return;
    }
    if (nodes.length < 2) {
      setError("Cần ít nhất 2 đỉnh để thực hiện thuật toán.");
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
          const { max_flow, flow_distribution, calculation_steps, min_cut_edges } = resData.data;
          setMaxFlowResult(max_flow, calculation_steps, flow_distribution, min_cut_edges);
        } else {
          const { shortest_distance, path, calculation_steps } = resData.data;
          setResult(path, shortest_distance, calculation_steps);
        }
      } else {
        setError(resData.message || "Đã xảy ra lỗi từ phía máy chủ.");
        setIsCalculating(false);
      }
    } catch (err) {
      setError("Lỗi kết nối máy chủ API. Vui lòng kiểm tra lại mạng.");
      setIsCalculating(false);
    }
  };

  const handleModeChange = (e) => {
    setMode(e.target.value);
    resetResult();
    setError(null);
  };

  return (
    <div className="h-full flex flex-col bg-gray-100 font-sans text-[13px]">
      <div className="bg-gray-200 p-3 border-b border-gray-300">
        <h2 className="font-bold text-gray-800 m-0 uppercase">Công cụ Phân tích Đồ thị</h2>
        <div className="mt-2 flex items-center">
          <label className="mr-2 font-semibold">Chế độ giải:</label>
          <select 
            value={mode} 
            onChange={handleModeChange}
            className="border border-gray-300 rounded px-2 py-1 bg-white flex-1 focus:outline-none focus:border-blue-500"
          >
            <option value="shortestPath">Tìm Đường đi ngắn nhất</option>
            <option value="maxFlow">Tìm Luồng cực đại</option>
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        <div className="border border-gray-300 bg-white mb-3 rounded shadow-sm">
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 font-bold text-gray-700">
            1. Thiết lập Đồ thị
          </div>
          <div className="p-3">
            <div className="mb-3">
              <label className="block mb-1 text-gray-700 font-semibold">Tên Đỉnh mới:</label>
              <div className="flex">
                <input 
                  type="text" 
                  className="flex-1 border border-gray-300 rounded-l px-2 py-1 focus:outline-none focus:border-blue-500"
                  placeholder="Vd: A, B..."
                  value={nodeName}
                  onChange={e => setNodeName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddNode()}
                />
                <button 
                  onClick={handleAddNode}
                  className="bg-blue-600 text-white px-3 py-1 border border-blue-600 rounded-r hover:bg-blue-700 transition-colors"
                >
                  Thêm
                </button>
              </div>
            </div>
            
            <div className="text-gray-600 text-[12px] mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded leading-tight">
              <b>Gợi ý:</b> Thêm đỉnh, sau đó kéo mũi tên giữa 2 đỉnh để tạo Cung. 
              Nhấn phím Delete/Backspace để xóa đỉnh hoặc cung đang chọn.
            </div>

            <div className="flex gap-2">
              <button 
                onClick={undoGraph}
                disabled={history.length === 0}
                className="flex-1 py-1.5 px-2 border border-gray-300 rounded bg-gray-50 hover:bg-gray-200 disabled:opacity-50 transition-colors"
              >
                Hoàn tác
              </button>
              <button 
                onClick={clearGraph}
                className="flex-1 py-1.5 px-2 border border-red-300 text-red-700 rounded bg-red-50 hover:bg-red-100 transition-colors"
              >
                Xóa lưới đồ thị
              </button>
            </div>
          </div>
        </div>

        <div className="border border-gray-300 bg-white mb-3 rounded shadow-sm">
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 font-bold text-gray-700">
            2. Thông số Thuật toán
          </div>
          <div className="p-3">
            <div className="mb-2">
              <label className="block mb-1 text-gray-700 font-semibold">Đỉnh xuất phát (Source):</label>
              <select 
                className="w-full border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                value={source || ''}
                onChange={e => setSource(e.target.value)}
              >
                <option value="" disabled>-- Chọn --</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </div>

            <div className="mb-3">
              <label className="block mb-1 text-gray-700 font-semibold">Đỉnh kết thúc (Target):</label>
              <select 
                className="w-full border border-gray-300 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-blue-500"
                value={target || ''}
                onChange={e => setTarget(e.target.value)}
              >
                <option value="" disabled>-- Chọn --</option>
                {nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </div>

            {error && (
              <div className="mb-3 p-2 bg-red-100 border border-red-300 text-red-800 rounded font-semibold">
                {error}
              </div>
            )}

            <button 
              onClick={handleRun}
              className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded border border-green-700 hover:bg-green-700 transition-colors shadow-sm"
            >
              Chạy Thuật toán
            </button>
          </div>
        </div>

        <div className="border border-gray-300 bg-white mb-3 rounded shadow-sm">
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 font-bold text-gray-700">
            3. Kết quả Phân tích
          </div>
          <div className="p-3">
            <ResultPanel mode={mode} />
          </div>
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
      <div className="text-gray-500 italic text-center py-6 border border-dashed border-gray-300 rounded bg-gray-50">
        Chưa có kết quả tính toán.
      </div>
    );
  }

  return (
    <div>
      {mode === 'shortestPath' ? (
        <div className="mb-3">
          <p className="font-semibold text-gray-700 mb-1">Tổng chi phí ngắn nhất:</p>
          <div className="p-2 bg-blue-50 border border-blue-200 text-blue-800 font-bold text-xl rounded text-center">
            {shortestDistance}
          </div>
          
          <p className="font-semibold text-gray-700 mt-3 mb-1">Lộ trình:</p>
          <div className="p-2 border border-gray-300 bg-gray-50 rounded font-mono font-bold text-gray-800 text-center">
            {shortestPath.join(' → ')}
          </div>
        </div>
      ) : (
        <div className="mb-3">
          <p className="font-semibold text-gray-700 mb-1">Luồng cực đại (Max Flow):</p>
          <div className="p-2 bg-green-50 border border-green-200 text-green-800 font-bold text-xl rounded text-center">
            {maxFlowValue}
          </div>
          <p className="text-[11px] text-gray-500 italic mt-1 text-center">
            Chi tiết luồng được hiển thị trên các cạnh của đồ thị.
          </p>
        </div>
      )}

      {steps && steps.length > 0 && (
        <div className="mt-4">
          <p className="font-semibold text-gray-700 mb-1">Nhật ký thực thi (Execution Logs):</p>
          <div className="h-40 overflow-y-auto p-2 bg-gray-900 text-green-400 font-mono text-[11px] rounded border border-gray-800 custom-scrollbar leading-relaxed">
            {steps.map((step, i) => (
              <div key={i} className="mb-1 border-l-2 border-gray-700 pl-2">{step}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ControlPanel;
