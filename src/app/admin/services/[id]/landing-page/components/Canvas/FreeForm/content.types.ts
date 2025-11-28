// content.types.ts
// Content component types

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
export type TextAlign = 'left' | 'center' | 'right' | 'justify';
export type FontWeight = 300 | 400 | 500 | 600 | 700 | 800 | 900;

// ============================================================================
// HEADING COMPONENT
// ============================================================================

export interface HeadingConfig {
  id: string;
  type: 'heading';
  
  // Content
  text: string;
  level: HeadingLevel;
  
  // Typography
  fontSize: number;
  fontWeight: FontWeight;
  lineHeight?: number;
  letterSpacing?: number;
  
  // Style
  color: string;
  textAlign: TextAlign;
  
  // Spacing
  marginTop?: number;
  marginBottom?: number;
}

// ============================================================================
// TEXT (PARAGRAPH) COMPONENT
// ============================================================================

export interface TextConfig {
  id: string;
  type: 'text';
  
  // Content
  text: string;
  
  // Typography
  fontSize: number;
  fontWeight: FontWeight;
  lineHeight?: number;
  
  // Style
  color: string;
  textAlign: TextAlign;
  
  // Spacing
  marginTop?: number;
  marginBottom?: number;
  
  // Max width for readability
  maxWidth?: number;
}

// ============================================================================
// BUTTON COMPONENT
// ============================================================================

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

export interface ButtonConfig {
  id: string;
  type: 'button';
  
  // Content
  text: string;
  href?: string;
  
  // Style
  variant: ButtonVariant;
  size: ButtonSize;
  
  // Colors
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  
  // Hover state
  hoverBackgroundColor?: string;
  hoverTextColor?: string;
  
  // Typography
  fontSize: number;
  fontWeight: FontWeight;
  
  // Dimensions
  paddingX: number;
  paddingY: number;
  borderRadius: number;
  
  // Icon
  icon?: string;
  iconPosition?: 'left' | 'right';
}

// ============================================================================
// IMAGE COMPONENT
// ============================================================================

export type ImageFit = 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';

export interface ImageConfig {
  id: string;
  type: 'image';
  
  // Content
  src: string;
  alt: string;
  
  // Dimensions
  width?: number | 'auto' | '100%';
  height?: number | 'auto';
  aspectRatio?: string; // e.g., "16/9", "4/3", "1/1"
  
  // Style
  objectFit: ImageFit;
  borderRadius?: number;
  
  // Effects
  opacity?: number;
  filter?: string; // CSS filter
}

// ============================================================================
// SPACER COMPONENT
// ============================================================================

export interface SpacerConfig {
  id: string;
  type: 'spacer';
  
  height: number;
}

// ============================================================================
// UNION TYPE
// ============================================================================

export type ContentComponent = 
  | HeadingConfig 
  | TextConfig 
  | ButtonConfig 
  | ImageConfig 
  | SpacerConfig;