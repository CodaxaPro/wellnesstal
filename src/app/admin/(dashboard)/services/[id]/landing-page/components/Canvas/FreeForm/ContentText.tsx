// ContentText.tsx
// Paragraph/Text component

import React from 'react';

import type { TextConfig } from './content.types';

interface ContentTextProps {
  config: TextConfig;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export function ContentText({ config, isSelected, onSelect }: ContentTextProps) {
  const {
    id,
    text,
    fontSize,
    fontWeight,
    lineHeight = 1.6,
    color,
    textAlign,
    marginTop = 0,
    marginBottom = 0,
    maxWidth,
  } = config;

  const style: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight,
    lineHeight,
    color,
    textAlign,
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    maxWidth: maxWidth ? `${maxWidth}px` : undefined,
    cursor: 'pointer',
  };

  return (
    <p
      className={`${isSelected ? 'ring-2 ring-yellow-400' : ''} transition-all`}
      style={style}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
    >
      {text}
    </p>
  );
}