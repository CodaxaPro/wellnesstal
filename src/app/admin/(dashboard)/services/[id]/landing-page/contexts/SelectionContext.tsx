// src/app/admin/services/[id]/landing-page/contexts/SelectionContext.tsx

'use client'

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react'

// Types
export interface Bounds {
  x: number
  y: number
  width: number
  height: number
}
type SectionType = 'header' | 'hero' | 'features' | null

interface SelectionState {
  selectedSection: SectionType
  selectedElement: string | null // e.g., 'hero.title', 'features.0.icon'
  hoveredElement: string | null
  selectionPath: string[] // e.g., ['hero', 'title']
  selectionBounds: Bounds | null // NEW: Selection bounds for visual feedback
  isResizing: boolean // NEW: Resize state
}

interface SelectionContextType {
  state: SelectionState

  // Actions
  select: (section: SectionType, element?: string) => void
  deselect: () => void
  hover: (element: string | null) => void

  // NEW: Bounds management
  setBounds: (bounds: Bounds | null) => void
  getBounds: () => Bounds | null

  // NEW: Resize state
  setResizing: (isResizing: boolean) => void

  // Queries
  isSelected: (section: SectionType, element?: string) => boolean
  isHovered: (element: string) => boolean
  getSelectionPath: () => string[]
}

// Context
const SelectionContext = createContext<SelectionContextType | null>(null)

// Provider Props
interface SelectionProviderProps {
  children: React.ReactNode
}

// Provider Component
export function SelectionProvider({ children }: SelectionProviderProps) {
  const [state, setState] = useState<SelectionState>({
    selectedSection: null,
    selectedElement: null,
    hoveredElement: null,
    selectionPath: [],
    selectionBounds: null,
    isResizing: false,
  })

  // Select element or section
  const select = useCallback((section: SectionType, element?: string) => {
    const path: string[] = []

    if (section) {
      path.push(section)
    }

    if (element) {
      // Split element path (e.g., 'title' or 'buttons.0')
      path.push(...element.split('.'))
    }

    setState(prev => ({
      ...prev,
      selectedSection: section,
      selectedElement: element || null,
      hoveredElement: null,
      selectionPath: path,
    }))
  }, [])

  // Deselect everything
  const deselect = useCallback(() => {
    setState({
      selectedSection: null,
      selectedElement: null,
      hoveredElement: null,
      selectionPath: [],
      selectionBounds: null,
      isResizing: false,
    })
  }, [])

  // Set hover state
  const hover = useCallback((element: string | null) => {
    setState(prev => ({
      ...prev,
      hoveredElement: element
    }))
  }, [])

  // NEW: Set selection bounds
  const setBounds = useCallback((bounds: Bounds | null) => {
    setState(prev => ({
      ...prev,
      selectionBounds: bounds,
    }))
  }, [])

  // NEW: Get selection bounds
  const getBounds = useCallback(() => {
    return state.selectionBounds
  }, [state.selectionBounds])

  // NEW: Set resize state
  const setResizing = useCallback((isResizing: boolean) => {
    setState(prev => ({
      ...prev,
      isResizing,
    }))
  }, [])

  // Check if element is selected
  const isSelected = useCallback((section: SectionType, element?: string) => {
    if (!section) {
return false
}

    if (element) {
      return state.selectedSection === section && state.selectedElement === element
    }

    return state.selectedSection === section
  }, [state.selectedSection, state.selectedElement])

  // Check if element is hovered
  const isHovered = useCallback((element: string) => {
    return state.hoveredElement === element
  }, [state.hoveredElement])

  // Get current selection path
  const getSelectionPath = useCallback(() => {
    return state.selectionPath
  }, [state.selectionPath])

  // Context value
  const value = useMemo(() => ({
    state,
    select,
    deselect,
    hover,
    setBounds,
    getBounds,
    setResizing,
    isSelected,
    isHovered,
    getSelectionPath
  }), [state, select, deselect, hover, setBounds, getBounds, setResizing, isSelected, isHovered, getSelectionPath])

  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  )
}

// Hook
export function useSelection() {
  const context = useContext(SelectionContext)
  if (!context) {
    throw new Error('useSelection must be used within SelectionProvider')
  }
  return context
}
