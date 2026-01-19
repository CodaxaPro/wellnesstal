// Layer Panel için type definitions

import type { PageSection } from '../Canvas/FreeForm/PageBuilder/usePageBuilder';
import type { 
  SectionConfig, 
  ContainerConfig, 
  StackConfig, 
  GridConfig,
  ContentComponent 
} from '../Canvas/FreeForm/primitives.types';

/**
 * Tree node yapısı - Recursive
 */
export interface LayerNode {
  id: string;
  type: 'section' | 'container' | 'stack' | 'grid' | 'heading' | 'text' | 'button' | 'image' | 'spacer';
  label: string;
  depth: number;
  isExpanded: boolean;
  children: LayerNode[];
  parentId?: string;
}

/**
 * Layer Panel Props
 */
export interface LayerPanelProps {
  sections: PageSection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRename?: (id: string, newLabel: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

/**
 * Layer Tree Item Props
 */
export interface LayerTreeItemProps {
  node: LayerNode;
  selectedId: string | null;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onToggleExpand: (id: string) => void;
  onRename?: (id: string, newLabel: string) => void;
  onDelete?: (id: string) => void;
  onDuplicate?: (id: string) => void;
}

/**
 * Type guards
 */
export function isContentComponent(item: any): item is ContentComponent {
  return item && typeof item === 'object' && 'type' in item && 
         ['heading', 'text', 'button', 'image', 'spacer'].includes(item.type);
}

export function isStackConfig(item: any): item is StackConfig {
  return item && typeof item === 'object' && item.type === 'stack';
}

export function isGridConfig(item: any): item is GridConfig {
  return item && typeof item === 'object' && item.type === 'grid';
}

export function isContainerConfig(item: any): item is ContainerConfig {
  return item && typeof item === 'object' && item.type === 'container';
}

/**
 * Helper: Get icon by type
 */
export function getLayerIcon(type: LayerNode['type']): string {
  const icons: Record<LayerNode['type'], string> = {
    section: '📄',
    container: '📦',
    stack: '📚',
    grid: '🔲',
    heading: '📝',
    text: '📃',
    button: '🔘',
    image: '🖼️',
    spacer: '↕️',
  };
  return icons[type] || '❓';
}

/**
 * Helper: Get color by type
 */
export function getLayerColor(type: LayerNode['type']): string {
  const colors: Record<LayerNode['type'], string> = {
    section: 'text-blue-600',
    container: 'text-green-600',
    stack: 'text-purple-600',
    grid: 'text-orange-600',
    heading: 'text-gray-700',
    text: 'text-gray-600',
    button: 'text-indigo-600',
    image: 'text-pink-600',
    spacer: 'text-gray-400',
  };
  return colors[type] || 'text-gray-500';
}