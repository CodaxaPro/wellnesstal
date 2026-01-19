// src/app/editor/[siteId]/components/editors/text-editor/utils/styleHelpers.ts

import { TextConfig } from '../types/textConfig.types';

/**
 * Generate CSS style object from text config
 */
export function getTextStyle(config: TextConfig): React.CSSProperties {
  const style: React.CSSProperties = {
    fontFamily: config.fontFamily,
    fontSize: `${config.fontSize}px`,
    fontWeight: config.fontWeight,
    lineHeight: config.lineHeight,
    letterSpacing: `${config.letterSpacing}px`,
    textAlign: config.textAlign,
    textTransform: config.textTransform,
    textDecoration: config.textDecoration,
    wordSpacing: `${config.wordSpacing}px`,
    textIndent: `${config.textIndent}px`,
  };

  // Text color (gradient or solid)
  if (config.hasGradient) {
    style.backgroundImage = `linear-gradient(${config.gradientAngle}deg, ${config.gradientColor1}, ${config.gradientColor2})`;
    style.WebkitBackgroundClip = 'text';
    style.WebkitTextFillColor = 'transparent';
    style.backgroundClip = 'text';
  } else {
    style.color = config.textColor;
  }

  // Background color
  if (config.backgroundColor !== 'transparent') {
    style.backgroundColor = config.backgroundColor;
  }

  // Text shadow
  if (config.textShadowX !== 0 || config.textShadowY !== 0 || config.textShadowBlur !== 0) {
    style.textShadow = `${config.textShadowX}px ${config.textShadowY}px ${config.textShadowBlur}px ${config.textShadowColor}`;
  }

  // Text outline
  if (config.hasOutline) {
    style.WebkitTextStroke = `${config.outlineWidth}px ${config.outlineColor}`;
  }

  return style;
}

/**
 * Generate CSS class string from config
 */
export function getTextClassName(config: TextConfig): string {
  const classes: string[] = [];

  if (config.hasDropCap) {
    classes.push('drop-cap');
  }

  return classes.join(' ');
}

/**
 * Generate gradient CSS
 */
export function generateGradientCSS(color1: string, color2: string, angle: number): string {
  return `linear-gradient(${angle}deg, ${color1}, ${color2})`;
}

/**
 * Generate text shadow CSS
 */
export function generateTextShadowCSS(x: number, y: number, blur: number, color: string): string {
  if (x === 0 && y === 0 && blur === 0) {
return 'none';
}
  return `${x}px ${y}px ${blur}px ${color}`;
}

/**
 * Get font weight label
 */
export function getFontWeightLabel(weight: number): string {
  const weights: Record<number, string> = {
    100: 'Thin',
    200: 'Extra Light',
    300: 'Light',
    400: 'Regular',
    500: 'Medium',
    600: 'Semi Bold',
    700: 'Bold',
    800: 'Extra Bold',
    900: 'Black',
  };
  return weights[weight] || 'Regular';
}

/**
 * Convert hex to rgba
 */
export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Get contrast color (black or white)
 */
export function getContrastColor(hexColor: string): string {
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 128 ? '#000000' : '#FFFFFF';
}

/**
 * Generate CSS for drop cap
 */
export function getDropCapCSS(): string {
  return `
    .drop-cap::first-letter {
      float: left;
      font-size: 3.5em;
      line-height: 0.9;
      margin: 0.1em 0.1em 0 0;
      font-weight: bold;
    }
  `;
}

/**
 * Export text as styled HTML
 */
export function exportAsHTML(content: string, config: TextConfig): string {
  const style = getTextStyle(config);
  const styleString = Object.entries(style)
    .map(([key, value]) => {
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssKey}: ${value}`;
    })
    .join('; ');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Text</title>
</head>
<body>
  <div style="${styleString}">
    ${content}
  </div>
</body>
</html>
  `.trim();
}