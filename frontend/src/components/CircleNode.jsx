import React from 'react';
import { Handle, Position } from '@xyflow/react';

const CircleNode = ({ data, selected }) => {
  const isPath = data.isPath;
  
  // Style Handle nay hoàn toàn vô hình (opacity=0) nhưng vẫn giữ được khu vực kết nối bám quanh viền
  const handleStyle = { 
    width: 25, 
    height: 25, 
    background: 'transparent',
    border: 'none',
    zIndex: -1, 
    opacity: 0, 
    minWidth: 25, 
    minHeight: 25 
  };

  return (
    <div className={`relative w-[60px] h-[60px] flex items-center justify-center rounded-full border-[2px] transition-all bg-white ${
        isPath ? 'border-emerald-600 text-emerald-700 bg-emerald-50 font-black scale-105 shadow-sm' :
        selected ? 'border-blue-500 text-blue-700 bg-blue-50 font-bold shadow-md' : 
        'border-slate-300 text-slate-700 font-semibold hover:border-slate-400 shadow-sm'
      }`}
    >
      {/* 4 Handles ẩn bám quanh viền node. Người dùng chỉ kéo từ viền là đi */}
      <Handle type="source" position={Position.Top} id="top" style={{...handleStyle, top: -10}} />
      <Handle type="source" position={Position.Bottom} id="bottom" style={{...handleStyle, bottom: -10}} />
      <Handle type="source" position={Position.Left} id="left" style={{...handleStyle, left: -10}} />
      <Handle type="source" position={Position.Right} id="right" style={{...handleStyle, right: -10}} />
      
      <div className="text-base pointer-events-none">{data.label}</div>
    </div>
  );
};

export default CircleNode;
