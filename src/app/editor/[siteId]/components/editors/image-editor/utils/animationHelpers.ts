import { ImageConfig } from '../types/imageConfig.types';

/**
 * Get Framer Motion easing curve based on config
 */
export function getEasingCurve(easing: ImageConfig['easing']): [number, number, number, number] {
  const easings: Record<string, [number, number, number, number]> = {
    'ease': [0.25, 0.1, 0.25, 1],
    'linear': [0, 0, 1, 1],
    'ease-in-out': [0.42, 0, 0.58, 1],
    'spring': [0.25, 0.1, 0.25, 1],
  };
  return easings[easing] || [0.25, 0.1, 0.25, 1];
}

/**
 * Get entrance animation initial state
 */
export function getEntranceAnimation(entrance: ImageConfig['entrance']) {
  const animations = {
    'none': {},
    'fade': { opacity: 0, scale: 0.95 },
    'slide-up': { opacity: 0, y: 50 },
    'slide-down': { opacity: 0, y: -50 },
    'slide-left': { opacity: 0, x: 50 },
    'slide-right': { opacity: 0, x: -50 },
    'zoom': { opacity: 0, scale: 0.8 },
    'bounce': { opacity: 0, scale: 0.5, y: -50 },
  };
  return animations[entrance] || {};
}

/**
 * Get hover animation state
 */
export function getHoverAnimation(hover: ImageConfig['hover']) {
  const animations = {
    'none': {},
    'zoom': { scale: 1.05 },
    'tilt': { rotate: 2, scale: 1.03 },
    'lift': { y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' },
    'glow': { filter: 'brightness(1.1) drop-shadow(0 0 20px rgba(168, 85, 247, 0.4))' },
    'brightness': { filter: 'brightness(1.15)' },
  };
  return animations[hover] || {};
}

/**
 * Tab definitions with icons
 */
export const TAB_DEFINITIONS = [
  { id: 'source' as const, label: 'Source', icon: '🖼️' },
  { id: 'crop' as const, label: 'Transform', icon: '✂️' },
  { id: 'adjust' as const, label: 'Adjust', icon: '🎨' },
  { id: 'effects' as const, label: 'Effects', icon: '✨' },
  { id: 'position' as const, label: 'Position', icon: '📐' },
  { id: 'animate' as const, label: 'Animate', icon: '🎬' },
  { id: 'performance' as const, label: 'Performance', icon: '🚀' },
  { id: 'seo' as const, label: 'SEO', icon: '🏷️' },
];