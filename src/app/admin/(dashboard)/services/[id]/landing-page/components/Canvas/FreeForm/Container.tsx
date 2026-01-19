// Container.tsx
// Enhanced Container component with full styling support and visual indicators

import React from 'react';

import type { ContainerConfig } from './primitives.types';

interface ContainerProps {
  config: ContainerConfig;
  children: React.ReactNode;
}

export function Container({ config, children }: ContainerProps) {
  const {
    variant = 'standard',
    maxWidth = 1200,
    minWidth,
    width = 'auto',
    minHeight,
    maxHeight,
    
    // Spacing
    padding,
    paddingX = 24,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
    
    // Margins
    margin = 'auto',
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    
    // Visual
    background,
    border,
    shadow,
    
    // Alignment
    horizontalAlign = 'center',
    verticalAlign,
    
    // Advanced
    overflow = 'visible',
    overflowX,
    overflowY,
    zIndex,
    opacity = 1,
  } = config;

  // Calculate padding
  const computedPaddingTop = paddingTop ?? paddingY ?? padding ?? 0;
  const computedPaddingBottom = paddingBottom ?? paddingY ?? padding ?? 0;
  const computedPaddingLeft = paddingLeft ?? paddingX ?? padding ?? paddingX;
  const computedPaddingRight = paddingRight ?? paddingX ?? padding ?? paddingX;

  // Calculate margins
  const computedMarginTop = marginTop ?? 0;
  const computedMarginBottom = marginBottom ?? 0;
  const computedMarginLeft = marginLeft ?? (margin === 'auto' ? 'auto' : 0);
  const computedMarginRight = marginRight ?? (margin === 'auto' ? 'auto' : 0);

  // Background styles
  const getBackgroundStyle = (): React.CSSProperties => {
    if (!background || background.type === 'none') {
      return {};
    }

    if (background.type === 'color') {
      return { backgroundColor: background.color };
    }

    if (background.type === 'gradient') {
      return { backgroundImage: background.gradient };
    }

    if (background.type === 'image' && background.image) {
      return {
        backgroundImage: `url(${background.image})`,
        backgroundSize: background.imageSize || 'cover',
        backgroundPosition: background.imagePosition || 'center',
        backgroundRepeat: background.imageRepeat || 'no-repeat',
      };
    }

    return {};
  };

  // Border styles
  const getBorderStyle = (): React.CSSProperties => {
    if (!border?.enabled) {
      return {};
    }

    const style: React.CSSProperties = {
      borderWidth: `${border.width}px`,
      borderStyle: border.style,
      borderColor: border.color,
    };

    // Per-corner radius
    if (border.radiusTopLeft !== undefined || 
        border.radiusTopRight !== undefined || 
        border.radiusBottomLeft !== undefined || 
        border.radiusBottomRight !== undefined) {
      style.borderRadius = `${border.radiusTopLeft ?? border.radius}px ${border.radiusTopRight ?? border.radius}px ${border.radiusBottomRight ?? border.radius}px ${border.radiusBottomLeft ?? border.radius}px`;
    } else {
      style.borderRadius = `${border.radius}px`;
    }

    return style;
  };

  // Shadow styles
  const getShadowStyle = (): string => {
    if (!shadow?.enabled) {
      return 'none';
    }

    const insetStr = shadow.inset ? 'inset ' : '';
    return `${insetStr}${shadow.offsetX}px ${shadow.offsetY}px ${shadow.blur}px ${shadow.spread}px ${shadow.color}`;
  };

  // Alignment styles
  const getAlignmentStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {};

    if (horizontalAlign === 'left') {
      style.marginLeft = computedMarginLeft;
      style.marginRight = 'auto';
    } else if (horizontalAlign === 'right') {
      style.marginLeft = 'auto';
      style.marginRight = computedMarginRight;
    } else {
      style.marginLeft = computedMarginLeft;
      style.marginRight = computedMarginRight;
    }

    if (verticalAlign === 'top') {
      style.display = 'flex';
      style.alignItems = 'flex-start';
    } else if (verticalAlign === 'middle') {
      style.display = 'flex';
      style.alignItems = 'center';
    } else if (verticalAlign === 'bottom') {
      style.display = 'flex';
      style.alignItems = 'flex-end';
    }

    return style;
  };

  const style: React.CSSProperties = {
    // Layout
    maxWidth: typeof maxWidth === 'number' ? `${maxWidth}px` : maxWidth,
    minWidth: minWidth ? `${minWidth}px` : undefined,
    width,
    minHeight: minHeight ? `${minHeight}px` : undefined,
    maxHeight: maxHeight ? `${maxHeight}px` : undefined,
    
    // Spacing
    paddingTop: `${computedPaddingTop}px`,
    paddingBottom: `${computedPaddingBottom}px`,
    paddingLeft: `${computedPaddingLeft}px`,
    paddingRight: `${computedPaddingRight}px`,
    marginTop: `${computedMarginTop}px`,
    marginBottom: `${computedMarginBottom}px`,
    
    // Visual
    ...getBackgroundStyle(),
    ...getBorderStyle(),
    ...getAlignmentStyle(),
    boxShadow: getShadowStyle(),
    
    // Advanced
    overflow: overflowX || overflowY ? undefined : overflow,
    overflowX,
    overflowY,
    zIndex,
    opacity,
    
    // Box model
    boxSizing: 'border-box',
    position: 'relative',
  };

  // Visual indicator for editing mode
  const containerLabel = `Container (${variant}, ${maxWidth}px)`;

  return (
    <div 
      style={style}
      data-container-id={config.id}
      data-container-variant={variant}
      title={containerLabel}
    >
      {children}
    </div>
  );
}