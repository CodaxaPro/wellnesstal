'use client';

import { useEffect, useState } from 'react';

import { createPortal } from 'react-dom';

import { useContentStore } from '../store/useContentStore';

interface EditableWrapperProps {
  path: string;
  targetSelector: string;
  type?: 'text' | 'richtext' | 'image';
}

export default function EditableWrapper({ 
  path, 
  targetSelector,
  type = 'text',
}: EditableWrapperProps) {
  const { isEditMode, activeField, setActiveField } = useContentStore();
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isEditMode) {
return;
}

    const updatePosition = () => {
      const el = document.querySelector(targetSelector);
      if (!el) {
return;
}
      
      const rect = el.getBoundingClientRect();
      setPosition({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('resize', updatePosition);
    };
  }, [isEditMode, targetSelector]);

  const handleClick = () => {
    setActiveField(path);
  };

  if (!isEditMode || activeField !== null || !mounted) {
return null;
}

  const overlay = (
    <div
      onClick={handleClick}
      className="cursor-pointer hover:bg-purple-500/30 transition-colors"
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`,
        width: `${position.width}px`,
        height: `${position.height}px`,
        zIndex: 9999,
        backgroundColor: 'rgba(147, 51, 234, 0.15)',
        border: '2px dashed rgba(147, 51, 234, 0.6)',
        pointerEvents: 'auto',
      }}
      data-path={path}
      data-type={type}
      title={`Düzenle: ${path}`}
    />
  );

  return createPortal(overlay, document.body);
}