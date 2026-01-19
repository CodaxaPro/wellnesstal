// ContentImage.tsx
// Image component with aspect ratio and effects

import React from 'react';

import type { ImageConfig } from './content.types';

interface ContentImageProps {
  config: ImageConfig;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export function ContentImage({ config, isSelected, onSelect }: ContentImageProps) {
  const {
    id,
    src,
    alt,
    width = '100%',
    height = 'auto',
    aspectRatio,
    objectFit,
    borderRadius = 0,
    opacity = 1,
    filter,
  } = config;

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    aspectRatio,
    objectFit,
    borderRadius: `${borderRadius}px`,
    opacity,
    filter,
    cursor: 'pointer',
  };

  return (
    <img
      src={src || 'https://via.placeholder.com/400x300?text=Image'}
      alt={alt}
      className={`${isSelected ? 'ring-2 ring-yellow-400' : ''} transition-all`}
      style={style}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
    />
  );
}