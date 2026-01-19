// ContentHeading.tsx
// Heading component with full typography control

import React from 'react';

import type { HeadingConfig } from './content.types';

interface ContentHeadingProps {
  config: HeadingConfig;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export function ContentHeading({ config, isSelected, onSelect }: ContentHeadingProps) {
  const {
    id,
    text,
    level,
    fontSize,
    fontWeight,
    lineHeight = 1.2,
    letterSpacing,
    color,
    textAlign,
    marginTop = 0,
    marginBottom = 0,
  } = config;

  const style: React.CSSProperties = {
    fontSize: `${fontSize}px`,
    fontWeight,
    lineHeight,
    letterSpacing: letterSpacing ? `${letterSpacing}px` : undefined,
    color,
    textAlign,
    marginTop: `${marginTop}px`,
    marginBottom: `${marginBottom}px`,
    cursor: 'pointer',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(id);
  };

  const className = `${isSelected ? 'ring-2 ring-yellow-400' : ''} transition-all`;

  // Render correct heading level
  switch (level) {
    case 'h1':
      return <h1 className={className} style={style} onClick={handleClick}>{text}</h1>;
    case 'h2':
      return <h2 className={className} style={style} onClick={handleClick}>{text}</h2>;
    case 'h3':
      return <h3 className={className} style={style} onClick={handleClick}>{text}</h3>;
    case 'h4':
      return <h4 className={className} style={style} onClick={handleClick}>{text}</h4>;
    case 'h5':
      return <h5 className={className} style={style} onClick={handleClick}>{text}</h5>;
    case 'h6':
      return <h6 className={className} style={style} onClick={handleClick}>{text}</h6>;
    default:
      return <h2 className={className} style={style} onClick={handleClick}>{text}</h2>;
  }
}