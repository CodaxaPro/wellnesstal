// Section.tsx
import React from 'react';
import type { SectionConfig } from './primitives.types';

interface SectionProps {
  config: SectionConfig;
  children: React.ReactNode;
}

export function Section({ config, children }: SectionProps) {
  const {
    paddingTop,
    paddingBottom,
    background,
    minHeight = 'auto',
    maxHeight,
  } = config;

  const backgroundStyle: React.CSSProperties = {};
  
  if (background) {
    switch (background.type) {
      case 'color':
        backgroundStyle.backgroundColor = background.color;
        break;
      case 'gradient':
        backgroundStyle.background = background.gradient;
        break;
      case 'image':
        backgroundStyle.backgroundImage = `url(${background.image})`;
        backgroundStyle.backgroundSize = 'cover';
        backgroundStyle.backgroundPosition = 'center';
        break;
    }
  }

  return (
    <section
      style={{
        width: '100%',
        position: 'relative',
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        minHeight: minHeight === 'auto' ? 'auto' : `${minHeight}px`,
        maxHeight: maxHeight ? `${maxHeight}px` : undefined,
        ...backgroundStyle,
      }}
    >
      {background?.type === 'image' && background.overlay && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: background.overlay,
            pointerEvents: 'none',
          }}
        />
      )}
      {children}
    </section>
  );
}