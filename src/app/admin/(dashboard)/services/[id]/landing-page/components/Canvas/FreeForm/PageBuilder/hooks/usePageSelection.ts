// hooks/usePageSelection.ts
// Selection Management Hook

import { useState, useCallback } from 'react';

import type { ContentComponent } from '../../content.types';
import type { SectionConfig, ContainerConfig, StackConfig, GridConfig } from '../../primitives.types';
import { findElementById } from '../utils/elementFinders';

// PageSection type'ını buraya kopyala (geçici)
interface PageSection {
  section: SectionConfig;
  container: ContainerConfig;
  stacks: StackConfig[];
  grids: GridConfig[];
}

export type ElementType = 'section' | 'container' | 'stack' | 'grid' | 'content';

interface UsePageSelectionReturn {
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  getSelectedElementType: () => ElementType | null;
  getSelectedElement: () => SectionConfig | ContainerConfig | StackConfig | GridConfig | ContentComponent | null;
}

export function usePageSelection(sections: PageSection[]): UsePageSelectionReturn {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /**
   * Seçili element'in type'ını bul
   */
  const getSelectedElementType = useCallback((): ElementType | null => {
    if (!selectedId) {
return null;
}

    for (const pageSection of sections) {
      // Section mi?
      if (pageSection.section.id === selectedId) {
return 'section';
}
      
      // Container mı?
      if (pageSection.container.id === selectedId) {
return 'container';
}

      // Stack mı?
      const stackElement = findElementById(selectedId, pageSection.stacks);
      if (stackElement) {
        return stackElement.type === 'stack' ? 'stack' : 'content';
      }

      // Grid'lerde ara
      for (const grid of pageSection.grids) {
        if (grid.id === selectedId) {
return 'grid';
}
        
        const gridContent = findElementById(selectedId, grid.children);
        if (gridContent) {
return 'content';
}
      }
    }
    
    return null;
  }, [selectedId, sections]);

  /**
   * Seçili element'i getir
   */
  const getSelectedElement = useCallback((): 
    SectionConfig | ContainerConfig | StackConfig | GridConfig | ContentComponent | null => {
    if (!selectedId) {
return null;
}

    for (const pageSection of sections) {
      // Section
      if (pageSection.section.id === selectedId) {
return pageSection.section;
}
      
      // Container
      if (pageSection.container.id === selectedId) {
return pageSection.container;
}

      // Stack'lerde ara
      const stackElement = findElementById(selectedId, pageSection.stacks);
      if (stackElement) {
return stackElement;
}

      // Grid'lerde ara
      for (const grid of pageSection.grids) {
        if (grid.id === selectedId) {
return grid;
}
        
        const gridContent = findElementById(selectedId, grid.children);
        if (gridContent) {
return gridContent;
}
      }
    }
    
    return null;
  }, [selectedId, sections]);

  return {
    selectedId,
    setSelectedId,
    getSelectedElementType,
    getSelectedElement,
  };
}