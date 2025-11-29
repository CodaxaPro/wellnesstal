// primitives.types.ts
// Professional Container System Types - Webflow/Framer/Figma Style

// Import ContentComponent from content.types
import type { 
  HeadingConfig, 
  TextConfig, 
  ButtonConfig, 
  ImageConfig, 
  SpacerConfig 
} from './content.types';

export type ContentComponent = 
  | HeadingConfig 
  | TextConfig 
  | ButtonConfig 
  | ImageConfig 
  | SpacerConfig;

// ============================================================================
// SPACING SYSTEM (8pt Grid)
// ============================================================================

export type SpacingValue = 0 | 4 | 8 | 12 | 16 | 20 | 24 | 28 | 32 | 40 | 48 | 56 | 64 | 80 | 96 | 120 | 160;

export const SPACING_SCALE: Record<string, SpacingValue> = {
  none: 0,
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
  '4xl': 64,
  '5xl': 80,
  '6xl': 96,
  '7xl': 120,
  '8xl': 160,
};

// ============================================================================
// SECTION (Full-width background layer)
// ============================================================================

export interface SectionConfig {
  id: string;
  type: 'section';
  
  // Layout
  width: '100%';
  minHeight?: number | 'auto';
  maxHeight?: number;
  
  // Spacing
  paddingTop: SpacingValue;
  paddingBottom: SpacingValue;
  
  // Visual
  background?: {
    type: 'color' | 'gradient' | 'image';
    color?: string;
    gradient?: string;
    image?: string;
    overlay?: string;
  };
  
  // Content
  children: ContainerConfig[];
}

// ============================================================================
// CONTAINER (Max-width, centered content limiter) - ENHANCED
// ============================================================================

export type ContainerVariant = 'standard' | 'narrow' | 'wide' | 'fluid' | 'custom';

export interface ContainerBackground {
  type: 'none' | 'color' | 'gradient' | 'image';
  color?: string;
  gradient?: string;
  image?: string;
  imageSize?: 'cover' | 'contain' | 'auto';
  imagePosition?: string;
  imageRepeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y';
}

export interface ContainerBorder {
  enabled: boolean;
  width: number;
  style: 'none' | 'solid' | 'dashed' | 'dotted' | 'double';
  color: string;
  radius: number;
  // Per-corner control
  radiusTopLeft?: number;
  radiusTopRight?: number;
  radiusBottomLeft?: number;
  radiusBottomRight?: number;
}

export interface ContainerShadow {
  enabled: boolean;
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
  inset?: boolean;
}

export interface ContainerConfig {
  id: string;
  type: 'container';
  
  // Layout Variant
  variant: ContainerVariant;
  
  // Width Control
  maxWidth: 940 | 1200 | 1400 | 1600 | number;
  minWidth?: number;
  width?: '100%' | 'auto';
  
  // Height Control
  minHeight?: number;
  maxHeight?: number;
  
  // Spacing - All sides
  paddingTop?: SpacingValue;
  paddingBottom?: SpacingValue;
  paddingLeft?: SpacingValue;
  paddingRight?: SpacingValue;
  paddingX?: SpacingValue;
  paddingY?: SpacingValue;
  padding?: SpacingValue;
  
  // Margins
  marginTop?: SpacingValue;
  marginBottom?: SpacingValue;
  marginLeft?: SpacingValue | 'auto';
  marginRight?: SpacingValue | 'auto';
  margin?: 'auto' | SpacingValue;
  
  // Visual Styling
  background?: ContainerBackground;
  border?: ContainerBorder;
  shadow?: ContainerShadow;
  
  // Alignment
  horizontalAlign?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  
  // Advanced
  overflow?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowX?: 'visible' | 'hidden' | 'scroll' | 'auto';
  overflowY?: 'visible' | 'hidden' | 'scroll' | 'auto';
  zIndex?: number;
  opacity?: number;
  
  // Display
  display?: 'block' | 'flex' | 'grid';
  
  // Content
  children: (StackConfig | GridConfig | ContentComponent)[];
}

// Container Presets
export const CONTAINER_PRESETS: Record<ContainerVariant, Partial<ContainerConfig>> = {
  standard: {
    maxWidth: 1200,
    paddingX: 24,
  },
  narrow: {
    maxWidth: 940,
    paddingX: 24,
  },
  wide: {
    maxWidth: 1600,
    paddingX: 32,
  },
  fluid: {
    maxWidth: 9999,
    paddingX: 40,
  },
  custom: {
    // User-defined
  },
};

// ============================================================================
// STACK (Flexbox layout - vertical or horizontal)
// ============================================================================

export type StackDirection = 'vertical' | 'horizontal';
export type StackAlign = 'start' | 'center' | 'end' | 'stretch' | 'baseline';
export type StackJustify = 'start' | 'center' | 'end' | 'space-between' | 'space-around' | 'space-evenly';

export interface StackConfig {
  id: string;
  type: 'stack';
  
  // Layout
  direction: StackDirection;
  gap: SpacingValue;
  
  // Alignment
  align?: StackAlign;
  justify?: StackJustify;
  
  // Spacing
  padding?: SpacingValue;
  paddingX?: SpacingValue;
  paddingY?: SpacingValue;
  paddingTop?: SpacingValue;
  paddingBottom?: SpacingValue;
  paddingLeft?: SpacingValue;
  paddingRight?: SpacingValue;
  
  // Sizing
  width?: 'fill' | 'hug' | 'fixed';
  height?: 'fill' | 'hug' | 'fixed';
  fixedWidth?: number;
  fixedHeight?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  
  // Visual
  background?: ContainerBackground;
  border?: ContainerBorder;
  shadow?: ContainerShadow;
  borderRadius?: number;
  
  // Wrapping
  wrap?: boolean;
  
  // Content - NESTED STACK + CONTENT SUPPORT
  children: (StackConfig | ContentComponent)[];
}

// ============================================================================
// GRID (CSS Grid layout)
// ============================================================================

export interface GridConfig {
  id: string;
  type: 'grid';
  
  // Layout
  columns: number;
  gap: SpacingValue;
  rowGap?: SpacingValue;
  columnGap?: SpacingValue;
  
  // Alignment
  align?: StackAlign;
  justify?: StackJustify;
  
  // Spacing
  padding?: SpacingValue;
  paddingX?: SpacingValue;
  paddingY?: SpacingValue;
  paddingTop?: SpacingValue;
  paddingBottom?: SpacingValue;
  paddingLeft?: SpacingValue;
  paddingRight?: SpacingValue;
  
  // Content - Only content components, no nesting
  children: ContentComponent[];
}

// ============================================================================
// RESIZE BEHAVIORS
// ============================================================================

export type ResizeBehavior = 'fill' | 'hug' | 'fixed';

export interface ResizeConfig {
  width: ResizeBehavior;
  height: ResizeBehavior;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
}

// ============================================================================
// COMPLETE PAGE STRUCTURE
// ============================================================================

export interface PageStructure {
  sections: SectionConfig[];
}

// ============================================================================
// HELPER TYPES
// ============================================================================

export type LayoutElement = SectionConfig | ContainerConfig | StackConfig | GridConfig | ContentComponent;

export interface LayoutHierarchy {
  element: LayoutElement;
  parent: LayoutElement | null;
  children: LayoutElement[];
  depth: number;
}

// ============================================================================
// VISUAL HIERARCHY (For better selection/editing)
// ============================================================================

export interface ElementVisualState {
  id: string;
  isHovered: boolean;
  isSelected: boolean;
  isParentSelected: boolean;
  depth: number;
  label: string;
}

// Border colors for visual hierarchy
export const ELEMENT_COLORS = {
  section: '#3b82f6',      // Blue
  container: '#10b981',    // Green
  stack: '#8b5cf6',        // Purple
  grid: '#f59e0b',         // Amber
  content: '#fbbf24',      // Yellow
} as const;