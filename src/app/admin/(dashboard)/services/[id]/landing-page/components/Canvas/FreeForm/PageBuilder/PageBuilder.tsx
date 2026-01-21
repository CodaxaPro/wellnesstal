// PageBuilder.tsx
// Main Page Builder Component - Koordinatör

'use client';

import { useEffect, useState } from 'react';

import { LayerPanel } from '../../../LayerPanel/LayerPanel';
import { ComponentLibrary } from '../ComponentLibrary';
import type { ContentComponent } from '../content.types';
import { PrimitivePropertiesPanel } from '../PrimitivePropertiesPanel';
import type { GridConfig, SectionConfig, StackConfig } from '../primitives.types';

import { PageRenderer } from './PageRenderer';
import type { LibraryContext } from './types';
import { usePageBuilder } from './usePageBuilder';

export function PageBuilder() {
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [_libraryContext, setLibraryContext] = useState<LibraryContext>('section');

  const {
    sections,
    selectedId,
    setSelectedId,
    saveStatus,
    lastSaved,
    handleManualSave,
    handleExport,
    handleImport,
    getSelectedElementType,
    getSelectedElement,
    handleAddSection,
    handleAddStack,
    handleAddGrid,
    handleAddContent,
    handleDelete,
    handleDuplicate,
    handleMove,
    handleUpdate,
    undo,
    redo,
    canUndo,
    canRedo,
  } = usePageBuilder();

  // ============================================================================
  // KEYBOARD SHORTCUTS
  // ============================================================================

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) {
undo();
}
        return;
      }

      // Ctrl/Cmd + Shift + Z = Redo
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        if (canRedo) {
redo();
}
        return;
      }

      // Ctrl/Cmd + S = Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        handleManualSave();
        return;
      }

      // Delete = Delete selected
      if (e.key === 'Delete' && selectedId) {
        e.preventDefault();
        handleDelete(selectedId);
        return;
      }

      // Ctrl/Cmd + D = Duplicate
      if ((e.ctrlKey || e.metaKey) && e.key === 'd' && selectedId) {
        e.preventDefault();
        handleDuplicate(selectedId);
        return;
      }

      // Ctrl/Cmd + Arrow Up = Move up
      if (e.key === 'ArrowUp' && selectedId && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleMove(selectedId, 'up');
        return;
      }

      // Ctrl/Cmd + Arrow Down = Move down
      if (e.key === 'ArrowDown' && selectedId && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleMove(selectedId, 'down');
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    canUndo,
    canRedo,
    undo,
    redo,
    handleManualSave,
    handleDelete,
    handleDuplicate,
    handleMove,
    selectedId,
  ]);

  // ============================================================================
  // SMART ADD LOGIC
  // ============================================================================

  const handleSmartAdd = () => {
    const selectedType = getSelectedElementType();

    if (!selectedType) {
      setLibraryContext('section');
      setIsLibraryOpen(true);
      return;
    }

    if (selectedType === 'section' || selectedType === 'container') {
      setLibraryContext('stack');
      setIsLibraryOpen(true);
      return;
    }

    if (selectedType === 'stack' || selectedType === 'grid' || selectedType === 'content') {
      setLibraryContext('content');
      setIsLibraryOpen(true);
      return;
    }
  };

  const getSmartAddButtonText = () => {
    const selectedType = getSelectedElementType();
    if (!selectedType) {
return '+ Add Section';
}
    if (selectedType === 'section' || selectedType === 'container') {
return '+ Add Stack/Grid';
}
    if (selectedType === 'stack' || selectedType === 'grid' || selectedType === 'content') {
return '+ Add Content';
}
    return '+';
  };

  const formatLastSaved = () => {
    if (!lastSaved) {
return 'Never';
}
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastSaved.getTime()) / 1000);

    if (diff < 60) {
return 'Just now';
}
    if (diff < 3600) {
return `${Math.floor(diff / 60)}m ago`;
}
    if (diff < 86400) {
return `${Math.floor(diff / 3600)}h ago`;
}
    return lastSaved.toLocaleDateString();
  };

  // ============================================================================
  // LIBRARY HANDLERS
  // ============================================================================

  const handleAddSectionFromLibrary = (newSection: SectionConfig) => {
    handleAddSection(newSection);
    setIsLibraryOpen(false);
  };

  const handleAddStackFromLibrary = (newStack: StackConfig) => {
    handleAddStack(newStack);
    setIsLibraryOpen(false);
  };

  const handleAddGridFromLibrary = (newGrid: GridConfig) => {
    handleAddGrid(newGrid);
    setIsLibraryOpen(false);
  };

  const handleAddContentFromLibrary = (newContent: ContentComponent) => {
    handleAddContent(newContent);
    setIsLibraryOpen(false);
  };

  // ============================================================================
  // SAFETY CHECKS
  // ============================================================================

  const hasLoadedSections = Array.isArray(sections) && sections.length > 0;
  const safeSections = sections || [];

  // ============================================================================
  // RENDER
  // ============================================================================

  return (
    <div className="flex gap-0 h-full">
      {/* LEFT: Layer Panel */}
      {hasLoadedSections && (
        <LayerPanel
          sections={safeSections}
          selectedId={selectedId}
          onSelect={setSelectedId}
          onDelete={handleDelete}
          onDuplicate={handleDuplicate}
        />
      )}

      {!hasLoadedSections && (
        <div className="w-[300px] h-full bg-white border-r border-gray-200 flex items-center justify-center">
          <div className="text-center text-gray-500 text-sm">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
            <p>Loading layers...</p>
          </div>
        </div>
      )}

      {/* CENTER: Canvas */}
      <div className="flex-1 relative overflow-auto bg-gray-50 p-8">
        {/* Toolbar - Save Status & Undo/Redo */}
        <div className="fixed top-20 left-[316px] bg-white border border-gray-200 rounded-lg shadow-sm px-4 py-2 z-50 flex items-center gap-3">
          <div className="flex items-center gap-2">
            {saveStatus === 'saving' && (
              <>
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="text-sm text-gray-600">Saving...</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="text-sm text-gray-600">Saved {formatLastSaved()}</span>
              </>
            )}
            {saveStatus === 'unsaved' && (
              <>
                <div className="w-2 h-2 bg-orange-500 rounded-full" />
                <span className="text-sm text-gray-600">Unsaved changes</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 border-l border-gray-200 pl-3">
            {/* Undo/Redo Buttons */}
            <button
              onClick={undo}
              disabled={!canUndo}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Undo (Ctrl+Z)"
            >
              ↩
            </button>
            <button
              onClick={redo}
              disabled={!canRedo}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
              title="Redo (Ctrl+Shift+Z)"
            >
              ↪
            </button>

            <div className="w-px h-4 bg-gray-300 mx-1" />

            <button
              onClick={handleManualSave}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition"
              title="Save Now (Ctrl+S)"
            >
              Save
            </button>
            <button
              onClick={handleExport}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition"
              title="Export as JSON"
            >
              Export
            </button>
            <label className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs rounded transition cursor-pointer">
              Import
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Selection Toolbar */}
        {selectedId && (
          <div className="fixed top-20 right-96 bg-black text-white px-3 py-2 rounded-lg z-50 text-xs font-mono flex items-center gap-2 shadow-lg">
            <span className="opacity-70">Selected:</span>
            <span className="font-bold">{selectedId}</span>
            <div className="flex gap-1 ml-3 border-l border-gray-600 pl-3">
              <button
                onClick={() => handleMove(selectedId, 'up')}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition"
                title="Move Up (Ctrl+↑)"
              >
                ↑
              </button>
              <button
                onClick={() => handleMove(selectedId, 'down')}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 rounded text-xs transition"
                title="Move Down (Ctrl+↓)"
              >
                ↓
              </button>
              <button
                onClick={() => handleDuplicate(selectedId)}
                className="px-2 py-1 bg-blue-600 hover:bg-blue-500 rounded text-xs transition"
                title="Duplicate (Ctrl+D)"
              >
                ⎘
              </button>
              <button
                onClick={() => handleDelete(selectedId)}
                className="px-2 py-1 bg-red-600 hover:bg-red-500 rounded text-xs transition"
                title="Delete (Del)"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Smart Add Button */}
        <button
          onClick={handleSmartAdd}
          className="fixed bottom-8 right-96 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-xl flex items-center justify-center text-sm font-semibold z-40 px-6 py-3 transition-all hover:scale-105"
          title={getSmartAddButtonText()}
        >
          {getSmartAddButtonText()}
        </button>

        {/* Page Renderer */}
        {hasLoadedSections ? (
          <PageRenderer
            sections={safeSections}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
              <p className="text-lg font-medium">Loading your page...</p>
              <p className="text-sm mt-2">Please wait...</p>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: Properties Panel */}
      <div className="w-80 bg-white border-l border-gray-200 overflow-auto shadow-lg">
        <PrimitivePropertiesPanel selectedElement={getSelectedElement()} onUpdate={handleUpdate} />
      </div>

      {/* Component Library Modal */}
      <ComponentLibrary
        isOpen={isLibraryOpen}
        onClose={() => setIsLibraryOpen(false)}
        onAddSection={handleAddSectionFromLibrary}
        onAddStack={handleAddStackFromLibrary}
        onAddGrid={handleAddGridFromLibrary}
        onAddContent={handleAddContentFromLibrary}
      />
    </div>
  );
}
