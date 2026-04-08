import { Position } from '@xyflow/react';

// Get the center of a node
function getNodeCenter(node) {
  if (!node || !node.measured) {
    // fallback if no measured dimensions yet
    return {
      x: node.position.x + 30, // assuming 60x60 node
      y: node.position.y + 30,
    };
  }
  return {
    x: node.position.x + node.measured.width / 2,
    y: node.position.y + node.measured.height / 2,
  };
}

// Calculate the intersection of a line from source center to target center
// with a circle of a given radius (30px for our 60x60 nodes).
export function getEdgeParams(source, target) {
  const sourceIntersection = getNodeIntersection(source, target);
  const targetIntersection = getNodeIntersection(target, source);

  return {
    sx: sourceIntersection.x,
    sy: sourceIntersection.y,
    tx: targetIntersection.x,
    ty: targetIntersection.y,
  };
}

// Calculate intersection point on the border of a circular node
export function getNodeIntersection(intersectionNode, targetNode) {
  const { measured, position } = intersectionNode;

  // Defaults assuming 60x60 if unmeasured
  const width = measured?.width || 60;
  const height = measured?.height || 60;
  
  const intersectionNodePosition = {
    x: position.x + width / 2,
    y: position.y + height / 2,
  };
  const targetPosition = getNodeCenter(targetNode);

  const dx = targetPosition.x - intersectionNodePosition.x;
  const dy = targetPosition.y - intersectionNodePosition.y;
  
  // Angle from intersection node center to target node center
  const angle = Math.atan2(dy, dx);
  
  // Assuming perfectly circular node, radius = width / 2
  const radius = width / 2;

  // The point exactly on the border
  const x = intersectionNodePosition.x + Math.cos(angle) * radius;
  const y = intersectionNodePosition.y + Math.sin(angle) * radius;

  return { x, y };
}
