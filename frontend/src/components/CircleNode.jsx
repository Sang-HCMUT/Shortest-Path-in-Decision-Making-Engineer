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
    <div className={`relative w-[60px] h-[60px] flex items-center justify-center rounded-full border-[3px] transition-all bg-white ${
        isPath ? 'border-green-600 text-green-700 bg-green-50 font-bold shadow-md scale-105' :
        selected ? 'border-blue-600 text-blue-700 bg-blue-50 font-bold shadow-md' : 
        'border-gray-400 text-gray-800 font-bold hover:border-gray-500 shadow-sm'
      }`}
    >
      {/* 12 Handles bao quanh viền để tạo cảm giác kéo thả không giới hạn (Floating edges) */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30 * Math.PI) / 180;
        // Đặt tâm handle chính xác trên viền (Bán kính hình tròn là 30)
        const radius = 30;
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
