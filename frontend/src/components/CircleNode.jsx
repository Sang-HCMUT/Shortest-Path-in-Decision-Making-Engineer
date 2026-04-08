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
      {/* 12 Handles bao quanh viền để tạo cảm giác kéo thả không giới hạn (Floating edges) */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        // Bán kính hình tròn là 30. Ta đặt handle cách tâm 32px để dễ kéo từ viền
        const radius = 32;
        const x = 30 + radius * Math.cos(angle);
        const y = 30 + radius * Math.sin(angle);
        return (
          <Handle
            key={i}
            type="source"
            position={Position.Right}
            id={`h${i}`}
            style={{
              ...handleStyle,
              position: 'absolute',
              left: x - 10,
              top: y - 10,
              width: 20,
              height: 20
            }}
          />
        );
      })}
      
      <div className="text-base pointer-events-none">{data.label}</div>
    </div>
  );
};

export default CircleNode;
