// Text Editor Configuration Types

export type TabType = 'format' | 'style' | 'advanced' | 'settings';

export interface TextConfig {
  // Content
  content: string;
  html: string;
  
  // Font
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  lineHeight: number;
  letterSpacing: number;
  
  // Colors
  textColor: string;
  backgroundColor: string;
  
  // Alignment
  textAlign: 'left' | 'center' | 'right' | 'justify';
  
  // Transform
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  
  // Decoration
  textDecoration: 'none' | 'underline' | 'line-through' | 'overline';
  
  // Shadow
  textShadowX: number;
  textShadowY: number;
  textShadowBlur: number;
  textShadowColor: string;
  
  // Gradient
  hasGradient: boolean;
  gradientColor1: string;
  gradientColor2: string;
  gradientAngle: number;
  
  // Outline
  hasOutline: boolean;
  outlineWidth: number;
  outlineColor: string;
  
  // Advanced
  hasDropCap: boolean;
  wordSpacing: number;
  textIndent: number;
  
  // Animation
  entrance: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'typewriter' | 'bounce';
  hover: 'none' | 'glow' | 'lift' | 'color-shift' | 'scale';
  duration: number;
  
  // Settings
  autoSave: boolean;
  spellCheck: boolean;
  showWordCount: boolean;
  showReadingTime: boolean;
}

export const DEFAULT_TEXT_CONFIG: TextConfig = {
  content: '',
  html: '',
  fontFamily: 'Inter',
  fontSize: 16,
  fontWeight: 400,
  lineHeight: 1.5,
  letterSpacing: 0,
  textColor: '#000000',
  backgroundColor: 'transparent',
  textAlign: 'left',
  textTransform: 'none',
  textDecoration: 'none',
  textShadowX: 0,
  textShadowY: 0,
  textShadowBlur: 0,
  textShadowColor: '#000000',
  hasGradient: false,
  gradientColor1: '#9333EA',
  gradientColor2: '#EC4899',
  gradientAngle: 90,
  hasOutline: false,
  outlineWidth: 1,
  outlineColor: '#000000',
  hasDropCap: false,
  wordSpacing: 0,
  textIndent: 0,
  entrance: 'fade',
  hover: 'none',
  duration: 0.5,
  autoSave: true,
  spellCheck: true,
  showWordCount: true,
  showReadingTime: true,
};

export const FONT_FAMILIES = [
  { value: 'Inter', label: 'Inter', category: 'Sans Serif' },
  { value: 'Roboto', label: 'Roboto', category: 'Sans Serif' },
  { value: 'Open Sans', label: 'Open Sans', category: 'Sans Serif' },
  { value: 'Lato', label: 'Lato', category: 'Sans Serif' },
  { value: 'Montserrat', label: 'Montserrat', category: 'Sans Serif' },
  { value: 'Poppins', label: 'Poppins', category: 'Sans Serif' },
  { value: 'Raleway', label: 'Raleway', category: 'Sans Serif' },
  { value: 'Playfair Display', label: 'Playfair Display', category: 'Serif' },
  { value: 'Merriweather', label: 'Merriweather', category: 'Serif' },
  { value: 'Georgia', label: 'Georgia', category: 'Serif' },
  { value: 'Courier New', label: 'Courier New', category: 'Monospace' },
  { value: 'JetBrains Mono', label: 'JetBrains Mono', category: 'Monospace' },
  { value: 'Dancing Script', label: 'Dancing Script', category: 'Handwriting' },
  { value: 'Pacifico', label: 'Pacifico', category: 'Handwriting' },
  { value: 'Bebas Neue', label: 'Bebas Neue', category: 'Display' },
];

export const TEXT_COLORS = [
  '#000000', '#FFFFFF', '#9333EA', '#EC4899', '#F97316',
  '#EAB308', '#10B981', '#06B6D4', '#3B82F6', '#6366F1',
  '#8B5CF6', '#A855F7', '#D946EF', '#E11D48', '#F43F5E',
  '#DC2626', '#EA580C', '#CA8A04', '#65A30D', '#059669',
  '#0891B2', '#2563EB',
];

export const HIGHLIGHT_COLORS = [
  'transparent', '#FEF3C7', '#FEE2E2', '#DBEAFE', '#D1FAE5',
  '#E9D5FF', '#FCE7F3', '#FFE4E6', '#F3E8FF', '#FED7AA',
  '#FEF9C3', '#CFFAFE', '#BFDBFE',
];

export interface TextStats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTime: number; // minutes
}