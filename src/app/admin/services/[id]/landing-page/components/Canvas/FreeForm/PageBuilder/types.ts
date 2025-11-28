// types.ts
// PageBuilder Core Types

import type { 
  SectionConfig,
  ContainerConfig,
  StackConfig,
  GridConfig
} from '../primitives.types';

/**
 * Page Section Structure
 */
export interface PageSection {
  section: SectionConfig;
  container: ContainerConfig;
  stacks: StackConfig[];
  grids: GridConfig[];
}

/**
 * Library Context - Hangi componentler eklenebilir
 */
export type LibraryContext = 'section' | 'stack' | 'grid' | 'content';