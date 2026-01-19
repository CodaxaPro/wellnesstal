// ContentButton.tsx
// Button component with variants and states

import React from 'react';

import type { ButtonConfig } from './content.types';

interface ContentButtonProps {
  config: ButtonConfig;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export function ContentButton({ config, isSelected, onSelect }: ContentButtonProps) {
  const {
    id,
    text,
    href,
    variant,
    size,
    backgroundColor,
    textColor,
    borderColor,
    fontSize,
    fontWeight,
    paddingX,
    paddingY,
    borderRadius,
    icon,
    iconPosition = 'left',
  } = config;

  const sizeStyles = {
    sm: { fontSize: 14, paddingX: 12, paddingY: 6 },
    md: { fontSize: 16, paddingX: 16, paddingY: 10 },
    lg: { fontSize: 18, paddingX: 24, paddingY: 12 },
    xl: { fontSize: 20, paddingX: 32, paddingY: 16 },
  };

  const baseStyle: React.CSSProperties = {
    fontSize: `${fontSize || sizeStyles[size].fontSize}px`,
    fontWeight,
    paddingLeft: `${paddingX || sizeStyles[size].paddingX}px`,
    paddingRight: `${paddingX || sizeStyles[size].paddingX}px`,
    paddingTop: `${paddingY || sizeStyles[size].paddingY}px`,
    paddingBottom: `${paddingY || sizeStyles[size].paddingY}px`,
    borderRadius: `${borderRadius}px`,
    backgroundColor,
    color: textColor,
    border: borderColor ? `2px solid ${borderColor}` : 'none',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect?.(id);
  };

  const wrapperClass = `${isSelected ? 'ring-2 ring-yellow-400' : ''} hover:opacity-90 transition-all`;

  const content = (
    <>
      {icon && iconPosition === 'left' && <span>{icon}</span>}
      {text}
      {icon && iconPosition === 'right' && <span>{icon}</span>}
    </>
  );

  if (href) {
    return (
      <a href={href} className={wrapperClass} style={baseStyle} onClick={handleClick}>
        {content}
      </a>
    );
  }

  return (
    <button className={wrapperClass} style={baseStyle} onClick={handleClick}>
      {content}
    </button>
  );
}