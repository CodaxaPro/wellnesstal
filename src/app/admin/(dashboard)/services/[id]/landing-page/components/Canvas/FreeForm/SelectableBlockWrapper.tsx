// SelectableBlockWrapper.tsx - FİNAL VERSİYON

import React, { useState } from 'react';

import type { ContainerConfig, GridConfig, LayoutElement, StackConfig } from './primitives.types';

interface SelectableBlockWrapperProps {
  element: LayoutElement;
  selectedId: string | null;
  onSelect: (id: string) => void;
  children: React.ReactNode;
}

const ELEMENT_COLORS = {
  section: {
    border: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.05)',
    label: 'Section',
  },
  container: {
    border: '#10b981',
    bg: 'rgba(16, 185, 129, 0.05)',
    label: 'Container',
  },
  stack: {
    border: '#8b5cf6',
    bg: 'rgba(139, 92, 246, 0.05)',
    label: 'Stack',
  },
  grid: {
    border: '#f59e0b',
    bg: 'rgba(245, 158, 11, 0.05)',
    label: 'Grid',
  },
};

export function SelectableBlockWrapper({ element, selectedId, onSelect, children }: SelectableBlockWrapperProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isSelected = element.id === selectedId;

  const elementType = element.type as 'section' | 'container' | 'stack' | 'grid';
  const colors = ELEMENT_COLORS[elementType];

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(element.id);
  };

  const getElementLabel = (): string => {
    if (elementType === 'section') {
      return `Section`;
    }
    if (elementType === 'container') {
      const container = element as ContainerConfig;
      return `Container (${container.variant || 'standard'}, ${container.maxWidth}px)`;
    }
    if (elementType === 'stack') {
      const stack = element as StackConfig;
      return `Stack (${stack.direction})`;
    }
    if (elementType === 'grid') {
      const grid = element as GridConfig;
      return `Grid (${grid.columns} columns, ${grid.gap}px gap)`;
    }
    return colors.label;
  };

  const wrapperStyle: React.CSSProperties = {
    position: 'relative',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    outline: isSelected ? `3px solid ${colors.border}` : isHovered ? `2px solid ${colors.border}` : 'none',
    outlineOffset: isSelected ? '2px' : '1px',
    backgroundColor: isSelected ? colors.bg : isHovered ? colors.bg : 'transparent',
  };

  return (
    <div
      style={wrapperStyle}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-element-id={element.id}
      data-element-type={elementType}
    >
      {/* Hover/Selected Label */}
      {(isHovered || isSelected) && (
        <div
          style={{
            position: 'absolute',
            top: '-24px',
            left: '0',
            backgroundColor: colors.border,
            color: 'white',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '11px',
            fontWeight: 600,
            fontFamily: 'monospace',
            zIndex: 1000,
            pointerEvents: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          {getElementLabel()}
        </div>
      )}

      {/* Corner Indicator (when selected) */}
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '8px',
            height: '8px',
            backgroundColor: colors.border,
            borderRadius: '0 0 4px 0',
            zIndex: 999,
            pointerEvents: 'none',
          }}
        />
      )}

      {children}
    </div>
  );
}
