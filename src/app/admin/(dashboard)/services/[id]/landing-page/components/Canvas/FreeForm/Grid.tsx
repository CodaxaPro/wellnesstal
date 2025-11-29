// Grid.tsx
// CSS Grid layout component with full control

import React from 'react';
import type { GridConfig } from './primitives.types';

interface GridProps {
  config: GridConfig;
  children: React.ReactNode;
}

export function Grid({ config, children }: GridProps) {
  const {
    columns = 3,
    gap = 24,
    rowGap,
    columnGap,
    align,
    justify,
    padding,
    paddingX,
    paddingY,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  } = config;

  // Calculate padding
  const computedPaddingTop = paddingTop ?? paddingY ?? padding ?? 0;
  const computedPaddingBottom = paddingBottom ?? paddingY ?? padding ?? 0;
  const computedPaddingLeft = paddingLeft ?? paddingX ?? padding ?? 0;
  const computedPaddingRight = paddingRight ?? paddingX ?? padding ?? 0;

  const style: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    gap: rowGap !== undefined || columnGap !== undefined 
      ? undefined 
      : `${gap}px`,
    rowGap: rowGap !== undefined ? `${rowGap}px` : undefined,
    columnGap: columnGap !== undefined ? `${columnGap}px` : undefined,
    alignItems: align,
    justifyContent: justify,
    paddingTop: `${computedPaddingTop}px`,
    paddingBottom: `${computedPaddingBottom}px`,
    paddingLeft: `${computedPaddingLeft}px`,
    paddingRight: `${computedPaddingRight}px`,
    boxSizing: 'border-box',
    width: '100%',
  };

  const gridLabel = `Grid (${columns} columns, ${gap}px gap)`;

  return (
    <div 
      style={style}
      data-grid-id={config.id}
      data-grid-columns={columns}
      title={gridLabel}
    >
      {children}
    </div>
  );
}