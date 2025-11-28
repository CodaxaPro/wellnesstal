// useHistory.ts
// Undo/Redo History Management Hook

import { useState, useCallback, useRef } from 'react';

interface UseHistoryReturn<T> {
  state: T;
  setState: (newStateOrUpdater: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
  initialize: (newState: T) => void;
}

const MAX_HISTORY = 50;

export function useHistory<T>(initialState: T): UseHistoryReturn<T> {
  const [history, setHistory] = useState<T[]>([initialState]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isUndoRedoAction = useRef(false);
  const hasBeenInitialized = useRef(false);

  const state = history[currentIndex] ?? initialState;
  
  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const initialize = useCallback((newState: T) => {
    if (hasBeenInitialized.current) return;
    
    hasBeenInitialized.current = true;
    setHistory([newState]);
    setCurrentIndex(0);
  }, []);

  const setState = useCallback((newStateOrUpdater: T | ((prev: T) => T)) => {
    if (isUndoRedoAction.current) {
      isUndoRedoAction.current = false;
      return;
    }

    const currentState = history[currentIndex] ?? initialState;
    
    const newState = typeof newStateOrUpdater === 'function'
      ? (newStateOrUpdater as (prev: T) => T)(currentState)
      : newStateOrUpdater;

    const newHistory = [...history.slice(0, currentIndex + 1), newState];
    
    const finalHistory = newHistory.length > MAX_HISTORY 
      ? newHistory.slice(1) 
      : newHistory;
    
    const newIndex = newHistory.length > MAX_HISTORY 
      ? MAX_HISTORY - 1 
      : currentIndex + 1;

    setHistory(finalHistory);
    setCurrentIndex(newIndex);
  }, [history, currentIndex, initialState]);

  const undo = useCallback(() => {
    if (canUndo) {
      isUndoRedoAction.current = true;
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canUndo]);

  const redo = useCallback(() => {
    if (canRedo) {
      isUndoRedoAction.current = true;
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canRedo]);

  const clear = useCallback(() => {
    const currentState = state ?? initialState;
    setHistory([currentState]);
    setCurrentIndex(0);
  }, [state, initialState]);

  return {
    state,
    setState,
    undo,
    redo,
    canUndo,
    canRedo,
    clear,
    initialize,
  };
}