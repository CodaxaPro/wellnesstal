// ContentSpacer.tsx
// Spacer component for vertical spacing

import React from 'react';
import type { SpacerConfig } from './content.types';

interface ContentSpacerProps {
  config: SpacerConfig;
  isSelected?: boolean;
  onSelect?: (id: string) => void;
}

export function ContentSpacer({ config, isSelected, onSelect }: ContentSpacerProps) {
  const { id, height } = config;

  return (
    <div
      className={`${isSelected ? 'ring-2 ring-yellow-400 bg-yellow-50' : 'bg-transparent'} transition-all`}
      style={{
        height: `${height}px`,
        cursor: 'pointer',
        minHeight: '8px',
      }}
      onClick={(e: React.MouseEvent) => {
        e.stopPropagation();
        onSelect?.(id);
      }}
    >
      {isSelected && (
        <div className="flex items-center justify-center h-full text-xs text-gray-400">
          Spacer: {height}px
        </div>
      )}
    </div>
  );
}