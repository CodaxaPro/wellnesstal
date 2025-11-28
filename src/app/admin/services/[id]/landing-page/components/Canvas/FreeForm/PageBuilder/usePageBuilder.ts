// usePageBuilder.ts
// Main PageBuilder Hook - Orchestrator

import { useHistory } from './useHistory';
import { usePageCRUD } from './hooks/usePageCRUD';
import { usePageStorage } from './hooks/usePageStorage';
import { usePageSelection } from './hooks/usePageSelection';
import type { PageSection } from './types';

// Re-export types (backward compatibility)
export type { PageSection } from './types';
export type { ElementType } from './hooks/usePageSelection';
export type { SaveStatus } from './hooks/usePageStorage';

export function usePageBuilder() {
  // ============================================================================
  // HOOKS
  // ============================================================================

  // History management (undo/redo)
  const {
    state: sections,
    setState: setSections,
    undo,
    redo,
    canUndo,
    canRedo,
    initialize,
  } = useHistory<PageSection[]>([]); // ✅ Generic type ekle

  // Selection management
  const {
    selectedId,
    setSelectedId,
    getSelectedElementType,
    getSelectedElement,
  } = usePageSelection(sections);

  // CRUD operations (with selection context)
  const {
    handleAddSection,
    handleAddStack,
    handleAddGrid,
    handleAddContent,
    handleDelete,
    handleDuplicate,
    handleMove,
    handleUpdate,
  } = usePageCRUD(sections, setSections, selectedId);

  // Storage (save/load/export/import)
  const {
    saveStatus,
    isSaving,
    lastSaved,
    handleManualSave,
    handleExport,
    handleImport,
  } = usePageStorage(sections, initialize);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    sections,
    selectedId,
    setSelectedId,
    saveStatus,
    isSaving,
    lastSaved,

    // Save/Load
    handleManualSave,
    handleExport,
    handleImport,

    // Helpers
    getSelectedElementType,
    getSelectedElement,

    // CRUD
    handleAddSection,
    handleAddStack,
    handleAddGrid,
    handleAddContent,
    handleDelete,
    handleDuplicate,
    handleMove,
    handleUpdate,

    // Undo/Redo
    undo,
    redo,
    canUndo,
    canRedo,
  };
}