import { ImageConfig } from '../types/imageConfig.types';

/**
 * Generate CSS filter string from image config
 */
export function getFilterStyle(config: ImageConfig): React.CSSProperties {
  const filters: string[] = [];

  // Adjustments
  if (config.brightness !== 0) {
    filters.push(`brightness(${1 + config.brightness / 100})`);
  }
  if (config.contrast !== 0) {
    filters.push(`contrast(${1 + config.contrast / 100})`);
  }
  if (config.saturation !== 0) {
    filters.push(`saturate(${1 + config.saturation / 100})`);
  }
  if (config.blur > 0) {
    filters.push(`blur(${config.blur}px)`);
  }
  if (config.hue !== 0) {
    filters.push(`hue-rotate(${config.hue}deg)`);
  }
  if (config.grayscale) {
    filters.push('grayscale(100%)');
  }
  if (config.sepia) {
    filters.push('sepia(100%)');
  }
  if (config.invert) {
    filters.push('invert(100%)');
  }

  // Preset filters
  const filterPresets: Record<string, string> = {
    vibrant: 'saturate(1.4) contrast(1.1)',
    warm: 'sepia(0.3) saturate(1.2)',
    cool: 'hue-rotate(180deg) saturate(0.8)',
    bw: 'grayscale(100%) contrast(1.2)',
    vintage: 'sepia(0.5) contrast(0.9) brightness(1.1)',
    cinematic: 'contrast(1.2) saturate(0.8) brightness(0.95)',
    dramatic: 'contrast(1.4) saturate(1.3) brightness(0.9)',
    soft: 'contrast(0.85) saturate(0.9) brightness(1.05)',
  };

  if (config.filter && config.filter !== 'none' && filterPresets[config.filter]) {
    const preset = filterPresets[config.filter]
    if (preset) {
      filters.push(preset)
    }
  }

  return {
    filter: filters.length > 0 ? filters.join(' ') : 'none',
    opacity: config.opacity / 100,
    transform: `rotate(${config.rotate}deg) scaleX(${config.flipH ? -1 : 1}) scaleY(${config.flipV ? -1 : 1})`,
    objectFit: config.objectFit,
    objectPosition: config.objectPosition,
    boxShadow: `${config.shadowX}px ${config.shadowY}px ${config.shadowBlur}px ${config.shadowColor}`,
  };
}

/**
 * Preset filter definitions
 */
export const FILTER_PRESETS = [
  { id: 'none', label: 'None', preview: 'Original' },
  { id: 'vibrant', label: 'Vibrant', preview: 'Saturate++' },
  { id: 'warm', label: 'Warm', preview: 'Sepia' },
  { id: 'cool', label: 'Cool', preview: 'Blue' },
  { id: 'bw', label: 'B&W', preview: 'Grayscale' },
  { id: 'vintage', label: 'Vintage', preview: 'Retro' },
  { id: 'cinematic', label: 'Cinematic', preview: 'Film' },
  { id: 'dramatic', label: 'Dramatic', preview: 'High Contrast' },
  { id: 'soft', label: 'Soft', preview: 'Gentle' },
] as const;
