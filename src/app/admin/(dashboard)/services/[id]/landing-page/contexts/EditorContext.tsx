'use client'

import React, { createContext, useContext, ReactNode } from 'react'

// Minimal EditorContext - sadece page.tsx uyumluluğu için
interface LandingPageData {
  header: any
  hero: any
  features: any
}

interface EditorContextType {
  data: LandingPageData
  updateData: (section: string, newData: any) => void
}

const EditorContext = createContext<EditorContextType | undefined>(undefined)

interface EditorProviderProps {
  children: ReactNode
  initialData: LandingPageData
  onSave?: (data: LandingPageData) => Promise<void>
}

export function EditorProvider({ children, initialData, onSave }: EditorProviderProps) {
  const updateData = (section: string, newData: any) => {
    console.log('updateData called:', section, newData)
  }

  const value = {
    data: initialData,
    updateData,
  }

  return <EditorContext.Provider value={value}>{children}</EditorContext.Provider>
}

export function useEditor() {
  const context = useContext(EditorContext)
  if (context === undefined) {
    throw new Error('useEditor must be used within EditorProvider')
  }
  return context
}