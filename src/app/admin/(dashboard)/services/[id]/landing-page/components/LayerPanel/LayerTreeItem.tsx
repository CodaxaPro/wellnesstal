// LayerTreeItem.tsx
// Recursive Tree Item Component

'use client';

import React, { useState } from 'react';
import type { LayerTreeItemProps } from './layer.types';
import { getLayerIcon, getLayerColor } from './layer.types';

export function LayerTreeItem({
  node,
  selectedId,
  isSelected,
  onSelect,
  onToggleExpand,
  onRename,
  onDelete,
  onDuplicate,
}: LayerTreeItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(node.label);
  const [isHovered, setIsHovered] = useState(false);

  const hasChildren = node.children.length > 0;
  const indent = node.depth * 16; // 16px per level

  // Handle rename
  const handleRenameStart = () => {
    setIsEditing(true);
    setEditValue(node.label);
  };

  const handleRenameSave = () => {
    if (onRename && editValue.trim()) {
      onRename(node.id, editValue.trim());
    }
    setIsEditing(false);
  };

  const handleRenameCancel = () => {
    setEditValue(node.label);
    setIsEditing(false);
  };

  // Handle keyboard in edit mode
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRenameSave();
    } else if (e.key === 'Escape') {
      handleRenameCancel();
    }
  };

  return (
    <div>
      {/* Item Row */}
      <div
        data-node-id={node.id}
        className={`
          flex items-center gap-1 py-1 px-2 cursor-pointer
          hover:bg-gray-100 transition-colors
          ${isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''}
        `}
        style={{ paddingLeft: `${indent + 8}px` }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => onSelect(node.id)}
      >
        {/* Expand/Collapse Arrow */}
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
            className="w-4 h-4 flex items-center justify-center hover:bg-gray-200 rounded text-gray-600"
          >
            {node.isExpanded ? '▼' : '▶'}
          </button>
        ) : (
          <div className="w-4" /> // Spacer
        )}

        {/* Icon */}
        <span className="text-sm">{getLayerIcon(node.type)}</span>

        {/* Label (Editable or Static) */}
        {isEditing ? (
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleRenameSave}
            onClick={(e) => e.stopPropagation()}
            className="flex-1 px-1 py-0 text-sm border border-blue-400 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <span
            className={`flex-1 text-sm truncate ${getLayerColor(node.type)}`}
            onDoubleClick={handleRenameStart}
            title={node.label}
          >
            {node.label}
          </span>
        )}

        {/* Actions (Show on hover) */}
        {isHovered && !isEditing && (
          <div className="flex items-center gap-1 ml-auto" onClick={(e) => e.stopPropagation()}>
            {/* Rename */}
            {onRename && (
              <button
                onClick={handleRenameStart}
                className="p-1 hover:bg-gray-200 rounded text-gray-600 text-xs"
                title="Rename (Double-click)"
              >
                ✏️
              </button>
            )}

            {/* Duplicate */}
            {onDuplicate && (
              <button
                onClick={() => onDuplicate(node.id)}
                className="p-1 hover:bg-gray-200 rounded text-gray-600 text-xs"
                title="Duplicate"
              >
                📋
              </button>
            )}

            {/* Delete */}
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm(`Delete ${node.label}?`)) {
                    onDelete(node.id);
                  }
                }}
                className="p-1 hover:bg-red-100 rounded text-red-600 text-xs"
                title="Delete"
              >
                🗑️
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recursive Children */}
      {hasChildren && node.isExpanded && (
        <div>
          {node.children.map((child) => (
            <LayerTreeItem
              key={child.id}
              node={child}
              selectedId={selectedId}
              isSelected={selectedId === child.id}
              onSelect={onSelect}
              onToggleExpand={onToggleExpand}
              onRename={onRename}
              onDelete={onDelete}
              onDuplicate={onDuplicate}
            />
          ))}
        </div>
      )}
    </div>
  );
}