'use client';

import { useEffect } from 'react';

import { useContentStore } from '../store/useContentStore';

export function useEditableClick() {
  const { isEditMode, setActiveField } = useContentStore();

  useEffect(() => {
    if (!isEditMode) {
return;
}

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Find closest editable element
      const editable = target.closest('[data-editable="true"]');
      
      if (editable) {
        e.preventDefault();
        e.stopPropagation();
        
        const path = editable.getAttribute('data-path');
        const type = editable.getAttribute('data-type');
        
        if (path) {
          console.log('Clicked editable:', path, type);
          setActiveField(path);
        }
      }
    };

    document.addEventListener('click', handleClick, true);
    
    return () => {
      document.removeEventListener('click', handleClick, true);
    };
  }, [isEditMode, setActiveField]);
}