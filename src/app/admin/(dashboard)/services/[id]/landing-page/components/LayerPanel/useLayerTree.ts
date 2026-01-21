// useLayerTree.ts
// Custom Hook - PageSections'ı LayerNode tree'ye dönüştürür

import { useMemo, useState, useCallback } from 'react';

import type { PageSection } from '../Canvas/FreeForm/PageBuilder/usePageBuilder';
import type { ContainerConfig, StackConfig, GridConfig } from '../Canvas/FreeForm/primitives.types';

import type { LayerNode } from './layer.types';
import { isContentComponent, isStackConfig } from './layer.types';

interface UseLayerTreeReturn {
  tree: LayerNode[];
  expandedIds: Set<string>;
  toggleExpand: (id: string) => void;
  expandAll: () => void;
  collapseAll: () => void;
  findNode: (id: string) => LayerNode | null;
}

export function useLayerTree(sections: PageSection[]): UseLayerTreeReturn {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const tree = useMemo(() => {
    return sections.map(pageSection => convertPageSectionToNode(pageSection, 0, null));
  }, [sections]);

  const toggleExpand = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const allIds = new Set<string>();
    const collectIds = (nodes: LayerNode[]) => {
      nodes.forEach(node => {
        if (node.children.length > 0) {
          allIds.add(node.id);
          collectIds(node.children);
        }
      });
    };
    collectIds(tree);
    setExpandedIds(allIds);
  }, [tree]);

  const collapseAll = useCallback(() => {
    setExpandedIds(new Set());
  }, []);

  const findNode = useCallback((id: string): LayerNode | null => {
    const search = (nodes: LayerNode[]): LayerNode | null => {
      for (const node of nodes) {
        if (node.id === id) {
return node;
}
        const found = search(node.children);
        if (found) {
return found;
}
      }
      return null;
    };
    return search(tree);
  }, [tree]);

  return {
    tree,
    expandedIds,
    toggleExpand,
    expandAll,
    collapseAll,
    findNode,
  };
}

// ============================================================================
// CONVERTER FUNCTIONS
// ============================================================================

/**
 * PageSection → LayerNode (Section with all children)
 */
function convertPageSectionToNode(
  pageSection: PageSection,
  depth: number,
  parentId: string | null
): LayerNode {
  const containerNode = convertContainerToNode(
    pageSection.container,
    depth + 1,
    pageSection.section.id,
    pageSection
  );

  return {
    id: pageSection.section.id,
    type: 'section',
    label: `Section ${pageSection.section.id.slice(0, 8)}`,
    depth,
    isExpanded: true,
    ...(parentId && { parentId }),
    children: [containerNode],
  };
}

/**
 * Container → LayerNode (with stacks and grids)
 */
function convertContainerToNode(
  container: ContainerConfig,
  depth: number,
  parentId: string,
  pageSection: PageSection
): LayerNode {
  const children: LayerNode[] = [];

  // Add all stacks
  pageSection.stacks.forEach(stack => {
    children.push(convertStackToNode(stack, depth + 1, container.id));
  });

  // Add all grids
  pageSection.grids.forEach(grid => {
    children.push(convertGridToNode(grid, depth + 1, container.id));
  });

  return {
    id: container.id,
    type: 'container',
    label: `Container (${container.variant})`,
    depth,
    isExpanded: true,
    parentId,
    children,
  };
}

/**
 * Stack → LayerNode (recursive for nested stacks)
 */
function convertStackToNode(
  stack: StackConfig,
  depth: number,
  parentId: string
): LayerNode {
  const children: LayerNode[] = [];

  stack.children.forEach(child => {
    if (isStackConfig(child)) {
      // Nested stack
      children.push(convertStackToNode(child, depth + 1, stack.id));
    } else if (isContentComponent(child)) {
      // Content component
      children.push(convertContentToNode(child, depth + 1, stack.id));
    }
  });

  return {
    id: stack.id,
    type: 'stack',
    label: `Stack (${stack.direction})`,
    depth,
    isExpanded: true,
    parentId,
    children,
  };
}

/**
 * Grid → LayerNode
 */
function convertGridToNode(
  grid: GridConfig,
  depth: number,
  parentId: string
): LayerNode {
  const children = grid.children.map(content =>
    convertContentToNode(content, depth + 1, grid.id)
  );

  return {
    id: grid.id,
    type: 'grid',
    label: `Grid (${grid.columns} cols)`,
    depth,
    isExpanded: true,
    parentId,
    children,
  };
}

/**
 * Content Component → LayerNode
 */
function convertContentToNode(
  content: any,
  depth: number,
  parentId: string
): LayerNode {
  const typeLabels: Record<string, string> = {
    heading: 'Heading',
    text: 'Text',
    button: 'Button',
    image: 'Image',
    spacer: 'Spacer',
  };

  // Get text preview for label
  let label = typeLabels[content.type] || content.type;
  if (content.text) {
    const preview = content.text.substring(0, 20);
    label = `${label}: ${preview}${content.text.length > 20 ? '...' : ''}`;
  }

  return {
    id: content.id,
    type: content.type as LayerNode['type'],
    label,
    depth,
    isExpanded: false,
    parentId,
    children: [],
  };
}
