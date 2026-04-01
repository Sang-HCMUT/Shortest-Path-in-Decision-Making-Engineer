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
    <div className={`relative w-[60px] h-[60px] flex items-center justify-center rounded-full border-[3px] shadow-lg transition-all ${
        isPath ? 'border-emerald-500 bg-emerald-400 text-slate-900 shadow-[0_0_15px_rgba(16,185,129,0.8)] font-black scale-110' :
        selected ? 'border-cyan-400 bg-cyan-950/80 shadow-[0_0_10px_rgba(6,182,212,0.5)] text-white font-bold' : 
        'border-slate-500 bg-slate-800 text-slate-200 font-bold'
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
