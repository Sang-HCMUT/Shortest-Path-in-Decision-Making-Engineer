import React from 'react';
import { useViewport } from '@xyflow/react';
import useGraphStore from '../store/useGraphStore';

const MinCutLineOverlay = () => {
  const { x, y, zoom } = useViewport();
  const minCutEdges = useGraphStore(state => state.minCutEdges);
  const nodes = useGraphStore(state => state.nodes);
  const mode = useGraphStore(state => state.mode);

  if (mode !== 'maxFlow' || !minCutEdges || minCutEdges.length === 0) return null;

  const points = [];
  
  // 1. Thu thập trung điểm của các cạnh cut
  minCutEdges.forEach(edgeId => {
    const [sourceId, targetId] = edgeId.split('-');
    const source = nodes.find(n => n.id === sourceId);
    const target = nodes.find(n => n.id === targetId);

    if (source && target) {
      // Tâm của node (giả định hình tròn 60x60)
      const sx = source.position.x + (source.measured?.width || 60) / 2;
      const sy = source.position.y + (source.measured?.height || 60) / 2;
      
      const tx = target.position.x + (target.measured?.width || 60) / 2;
      const ty = target.position.y + (target.measured?.height || 60) / 2;
      
      const midX = (sx + tx) / 2;
      const midY = (sy + ty) / 2;
      
      // Vector nối 2 tâm node để tính đường vuông góc
      const dx = tx - sx;
      const dy = ty - sy;
      
      points.push({ id: edgeId, x: midX, y: midY, dx, dy });
    }
  });

  if (points.length === 0) return null;

  // 2. Sắp xếp các điểm để nối thành đường mượt mà
  // Tính trục chính phân bổ của các điểm
  const xs = points.map(p => p.x);
  const ys = points.map(p => p.y);
  const rangeX = Math.max(...xs) - Math.min(...xs);
  const rangeY = Math.max(...ys) - Math.min(...ys);

  // Sắp xếp theo trục có độ trải dài lớn hơn
  if (rangeX > rangeY) {
    points.sort((a, b) => a.x - b.x);
  } else {
    points.sort((a, b) => a.y - b.y);
  }

  // 3. Tính toán Line (Spline b-curve or extension bounds)
  const EXTENSION = 80; // Độ vuốt dài về 2 ranh giới (vượt ra ngoài viền node)

  let pathD = '';

  if (points.length === 1) {
      // Chỉ có 1 cạnh cắt: Vẽ đoạn thẳng vuông góc đi qua trung điểm
      const p = points[0];
      const len = Math.sqrt(p.dx * p.dx + p.dy * p.dy) || 1;
      const nx = -p.dy / len;
      const ny = p.dx / len;
      
      const x1 = p.x + nx * EXTENSION;
      const y1 = p.y + ny * EXTENSION;
      const x2 = p.x - nx * EXTENSION;
      const y2 = p.y - ny * EXTENSION;
      
      pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
  } else {
      // Nối qua các điểm trung gian
      
      // Mở rộng điểm kéo dài đầu tiên (vươn khỏi điểm đầu)
      const p0 = points[0];
      const p1 = points[1];
      const len0 = Math.sqrt(Math.pow(p0.x - p1.x, 2) + Math.pow(p0.y - p1.y, 2)) || 1;
      const dir0x = (p0.x - p1.x) / len0;
      const dir0y = (p0.y - p1.y) / len0;
      
      const startX = p0.x + dir0x * EXTENSION;
      const startY = p0.y + dir0y * EXTENSION;
      
      pathD += `M ${startX} ${startY} `;
      
      // Nối lần lượt các trung điểm
      points.forEach((p) => {
        pathD += `L ${p.x} ${p.y} `;
      });
      
      // Mở rộng điểm cuối cùng vươn ra khỏi bìa
      const pn = points[points.length - 1];
      const pn_1 = points[points.length - 2];
      const lenn = Math.sqrt(Math.pow(pn.x - pn_1.x, 2) + Math.pow(pn.y - pn_1.y, 2)) || 1;
      const dirnx = (pn.x - pn_1.x) / lenn;
      const dirny = (pn.y - pn_1.y) / lenn;
      
      const endX = pn.x + dirnx * EXTENSION;
      const endY = pn.y + dirny * EXTENSION;
      
      pathD += `L ${endX} ${endY}`;
  }

  // Chú ý zIndex=1 đè lên background nhưng < edge (để user dễ click dây hơn, or =100 to overlap all)
  // Thực ra min cut path là boundary divider nên đè lên edge thì đẹp hơn (giống nhát cắt dao mổ)
  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 10 }}>
       <g transform={`translate(${x},${y}) scale(${zoom})`}>
          {/* Lớp nền đen nhòe để chữ/line nổi khối */}
          <path 
             d={pathD} 
             stroke="rgba(0, 0, 0, 0.4)" 
             strokeWidth={8} 
             strokeLinecap="round"
             strokeLinejoin="round" 
             fill="none" 
             style={{ filter: 'blur(3px)' }}
          />
          {/* Lớp màu vàng chính thức */}
          <path 
             d={pathD} 
             stroke="#fbbf24" // Màu vàng kim (Gold)
             strokeWidth={6} 
             strokeDasharray="14,10" 
             strokeLinecap="round"
             strokeLinejoin="round" 
             fill="none" 
          />
       </g>
    </svg>
  );
};

export default MinCutLineOverlay;
