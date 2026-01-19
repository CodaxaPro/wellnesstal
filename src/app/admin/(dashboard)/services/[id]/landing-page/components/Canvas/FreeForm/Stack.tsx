// Stack.tsx
import React from 'react';

import type { StackConfig } from './primitives.types';

interface StackProps {
  config: StackConfig;
  children: React.ReactNode;
}

export function Stack({ config, children }: StackProps) {
  const {
    direction,
    gap,
    align = 'start',
    justify = 'start',
    padding,
    paddingX,
    paddingY,
    width = 'hug',
    height = 'hug',
    fixedWidth,
    fixedHeight,
  } = config;

  const computedPadding = padding !== undefined ? padding : 0;
  const computedPaddingX = paddingX !== undefined ? paddingX : computedPadding;
  const computedPaddingY = paddingY !== undefined ? paddingY : computedPadding;

  const sizeStyles: React.CSSProperties = {};
  
  if (width === 'fill') {
    sizeStyles.width = '100%';
  } else if (width === 'fixed' && fixedWidth) {
    sizeStyles.width = `${fixedWidth}px`;
  }

  if (height === 'fill') {
    sizeStyles.height = '100%';
  } else if (height === 'fixed' && fixedHeight) {
    sizeStyles.height = `${fixedHeight}px`;
  }

  const alignItems: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    stretch: 'stretch',
  };

  const justifyContent: Record<string, string> = {
    start: 'flex-start',
    center: 'center',
    end: 'flex-end',
    'space-between': 'space-between',
    'space-around': 'space-around',
    'space-evenly': 'space-evenly',
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: `${gap}px`,
        alignItems: alignItems[align],
        justifyContent: justifyContent[justify],
        paddingLeft: `${computedPaddingX}px`,
        paddingRight: `${computedPaddingX}px`,
        paddingTop: `${computedPaddingY}px`,
        paddingBottom: `${computedPaddingY}px`,
        ...sizeStyles,
      }}
    >
      {children}
    </div>
  );
}