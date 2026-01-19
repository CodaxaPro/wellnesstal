// LayerPanel.tsx
'use client';

import React, { useEffect, useRef } from 'react';

import type { LayerPanelProps } from './layer.types';
import { LayerTreeItem } from './LayerTreeItem';
import { useLayerTree } from './useLayerTree';

export function LayerPanel({
  sections,
  selectedId,
  onSelect,
  onRename,
  onDelete,
  onDuplicate,
}: LayerPanelProps) {
  const { tree, expandedIds, toggleExpand, expandAll, collapseAll, findNode } = useLayerTree(sections);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Update isExpanded based on expandedIds
  const updateNodeExpansion = (nodes: typeof tree): typeof tree => {
    return nodes.map(node => ({
      ...node,
      isExpanded: expandedIds.has(node.id),
      children: updateNodeExpansion(node.children),
    }));
  };

  const treeWithExpansion = updateNodeExpansion(tree);

  // Expand all parents of selected node
  useEffect(() => {
    if (selectedId) {
      const selectedNode = findNode(selectedId);
      if (selectedNode) {
        // Collect all parent IDs
        const parentsToExpand: string[] = [];
        let currentParentId = selectedNode.parentId;
        
        while (currentParentId) {
          parentsToExpand.push(currentParentId);
          const parentNode = findNode(currentParentId);
          currentParentId = parentNode?.parentId;
        }
        
        // Expand all parents
        parentsToExpand.forEach(parentId => {
          if (!expandedIds.has(parentId)) {
            toggleExpand(parentId);
          }
        });
      }
    }
  }, [selectedId, findNode, expandedIds, toggleExpand]);

  // Auto-scroll to selected item - FORCE VERSION (3 METHODS)
  useEffect(() => {
    if (selectedId && scrollContainerRef.current) {
      setTimeout(() => {
        const container = scrollContainerRef.current;
        if (!container) {
return;
}
        
        const selectedElement = container.querySelector(
          `[data-node-id="${selectedId}"]`
        ) as HTMLElement;
        
        if (selectedElement) {
          // FORCE: Birden fazla yöntem dene
          
          // Method 1: scrollTop
          const rect = selectedElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const offset = rect.top - containerRect.top + container.scrollTop;
          
          container.scrollTop = offset - 100; // 100px padding
          
          console.log('Method 1 - scrollTop:', container.scrollTop);
          
          // Method 2: scrollIntoView (backup)
          setTimeout(() => {
            const currentContainer = scrollContainerRef.current;
            if (!currentContainer) {
return;
}
            
            if (currentContainer.scrollTop === 0) {
              console.log('Method 1 failed, trying scrollIntoView...');
              selectedElement.scrollIntoView({
                block: 'center',
                behavior: 'auto' // instant!
              });
              console.log('Method 2 - After scrollIntoView:', currentContainer.scrollTop);
            }
          }, 100);
          
          // Method 3: Manual animation (last resort)
          setTimeout(() => {
            const currentContainer = scrollContainerRef.current;
            if (!currentContainer) {
return;
}
            
            if (currentContainer.scrollTop === 0) {
              console.log('Method 2 failed, trying manual scroll...');
              const start = 0;
              const target = offset - 100;
              const duration = 300;
              const startTime = performance.now();
              
              function animate(currentTime: number) {
                if (!currentContainer) {
return;
}
                
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                currentContainer.scrollTop = start + (target - start) * progress;
                
                if (progress < 1) {
                  requestAnimationFrame(animate);
                } else {
                  console.log('Method 3 - Final scrollTop:', currentContainer.scrollTop);
                }
              }
              
              requestAnimationFrame(animate);
            }
          }, 200);
        }
      }, 350);
    }
  }, [selectedId, expandedIds]);

  return (
    <div className="w-[300px] h-full bg-white border-r border-gray-200 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-700">Layers</h2>
        
        <div className="flex gap-1">
          <button
            onClick={expandAll}
            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
            title="Expand All"
          >
            ⊕
          </button>
          <button
            onClick={collapseAll}
            className="px-2 py-1 text-xs text-gray-600 hover:bg-gray-100 rounded"
            title="Collapse All"
          >
            ⊖
          </button>
        </div>
      </div>

      {/* Tree Content */}
      <div 
        ref={scrollContainerRef} 
        className="flex-1 overflow-y-scroll relative"
      >
        {treeWithExpansion.length === 0 ? (
          <div className="p-4 text-center text-sm text-gray-500">
            <p className="mb-2">🏗️</p>
            <p>No sections yet</p>
            <p className="text-xs mt-1">Add a section to get started</p>
          </div>
        ) : (
          <div className="py-2">
            {treeWithExpansion.map((node) => (
              <LayerTreeItem
                key={node.id}
                node={node}
                selectedId={selectedId}
                isSelected={selectedId === node.id}
                onSelect={onSelect}
                onToggleExpand={toggleExpand}
                onRename={onRename}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="px-4 py-2 border-t border-gray-200 text-xs text-gray-500">
        {sections.length} section{sections.length !== 1 ? 's' : ''}
        {selectedId && (
          <span className="ml-2">• 1 selected</span>
        )}
      </div>
    </div>
  );
}