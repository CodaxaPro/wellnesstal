// utils/elementFinders.ts
// Element Finder Utilities

import type { ContentComponent } from '../../content.types';
import type { SectionConfig, ContainerConfig, StackConfig, GridConfig } from '../../primitives.types';

// PageSection type'ını buraya kopyalayalım (geçici)
interface PageSection {
  section: SectionConfig;
  container: ContainerConfig;
  stacks: StackConfig[];
  grids: GridConfig[];
}

/**
 * ID'ye göre element bul (recursive)
 * Stack içindeki nested element'leri de bulur
 */
export function findElementById(
  id: string,
  elements: (StackConfig | ContentComponent)[]
): StackConfig | ContentComponent | null {
  for (const element of elements) {
    // Direkt match
    if (element.id === id) {
      return element;
    }
    
    // Stack ise children'ı kontrol et (recursive)
    if (element.type === 'stack' && 'children' in element) {
      const found = findElementById(id, element.children);
      if (found) {
return found;
}
    }
  }
  
  return null;
}

/**
 * Element'in parent'ını bul
 */
export function findParentElement(
  id: string,
  sections: PageSection[]
): StackConfig | GridConfig | null {
  for (const pageSection of sections) {
    // Stack'lerde ara
    for (const stack of pageSection.stacks) {
      if (stack.children.some((child: StackConfig | ContentComponent) => child.id === id)) {
        return stack;
      }
      
      // Nested stack'lerde ara
      const parent = findParentInStack(id, stack);
      if (parent) {
return parent;
}
    }
    
    // Grid'lerde ara
    for (const grid of pageSection.grids) {
      if (grid.children.some((child: ContentComponent) => child.id === id)) {
        return grid;
      }
    }
  }
  
  return null;
}

/**
 * Stack içinde parent bul (recursive helper)
 */
function findParentInStack(
  id: string,
  stack: StackConfig
): StackConfig | null {
  for (const child of stack.children) {
    if (child.type === 'stack') {
      // Bu stack parent mı?
      if (child.children.some((c: StackConfig | ContentComponent) => c.id === id)) {
        return child;
      }
      
      // Daha derine in
      const found = findParentInStack(id, child);
      if (found) {
return found;
}
    }
  }
  
  return null;
}

/**
 * Element'in path'ini bul (breadcrumb için)
 */
export function getElementPath(
  id: string,
  sections: PageSection[]
): string[] {
  const path: string[] = [];
  
  for (const pageSection of sections) {
    // Section
    if (pageSection.section.id === id) {
      return [pageSection.section.id];
    }
    
    // Container
    if (pageSection.container.id === id) {
      return [pageSection.section.id, pageSection.container.id];
    }
    
    // Stack'lerde ara
    for (const stack of pageSection.stacks) {
      const stackPath = getPathInStack(id, stack, [
        pageSection.section.id,
        pageSection.container.id,
      ]);
      if (stackPath.length > 0) {
return stackPath;
}
    }
    
    // Grid'lerde ara
    for (const grid of pageSection.grids) {
      if (grid.id === id) {
        return [pageSection.section.id, pageSection.container.id, grid.id];
      }
      
      for (const child of grid.children) {
        if (child.id === id) {
          return [pageSection.section.id, pageSection.container.id, grid.id, child.id];
        }
      }
    }
  }
  
  return path;
}

/**
 * Stack içinde path bul (recursive helper)
 */
function getPathInStack(
  id: string,
  stack: StackConfig,
  parentPath: string[]
): string[] {
  const currentPath = [...parentPath, stack.id];
  
  // Stack'in kendisi mi?
  if (stack.id === id) {
    return currentPath;
  }
  
  // Children'da ara
  for (const child of stack.children) {
    if (child.id === id) {
      return [...currentPath, child.id];
    }
    
    if (child.type === 'stack') {
      const found = getPathInStack(id, child, currentPath);
      if (found.length > 0) {
return found;
}
    }
  }
  
  return [];
}

/**
 * Element'in section'ını bul
 */
export function findElementSection(
  id: string,
  sections: PageSection[]
): PageSection | null {
  for (const pageSection of sections) {
    // Section'ın kendisi mi?
    if (pageSection.section.id === id) {
      return pageSection;
    }
    
    // Container mı?
    if (pageSection.container.id === id) {
      return pageSection;
    }
    
    // Stack'lerde var mı?
    const stackElement = findElementById(id, pageSection.stacks);
    if (stackElement) {
return pageSection;
}
    
    // Grid'lerde var mı?
    for (const grid of pageSection.grids) {
      if (grid.id === id || grid.children.some((c: ContentComponent) => c.id === id)) {
        return pageSection;
      }
    }
  }
  
  return null;
}

/**
 * Element'in derinlik seviyesini bul
 */
export function getElementDepth(
  id: string,
  sections: PageSection[]
): number {
  const path = getElementPath(id, sections);
  return path.length;
}

/**
 * Element'in siblings'larını bul
 */
export function getElementSiblings(
  id: string,
  sections: PageSection[]
): (StackConfig | ContentComponent)[] {
  const parent = findParentElement(id, sections);
  
  if (!parent) {
return [];
}
  
  return parent.children.filter((child: StackConfig | ContentComponent) => child.id !== id);
}