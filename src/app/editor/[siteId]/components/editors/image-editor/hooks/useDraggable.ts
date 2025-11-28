import { useState, useEffect } from 'react';

interface Position {
  top: number;
  left: number;
}

interface UseDraggableProps {
  initialPosition: Position;
}

export function useDraggable({ initialPosition }: UseDraggableProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState<Position>(initialPosition);

  useEffect(() => {
    setPosition(initialPosition);
  }, [initialPosition.top, initialPosition.left]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.left,
        y: e.clientY - position.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          top: Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 100)),
          left: Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 1200)),
        });
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  return {
    position,
    isDragging,
    handleMouseDown,
  };
}