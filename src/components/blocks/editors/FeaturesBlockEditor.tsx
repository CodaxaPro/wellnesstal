'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { FeaturesContent } from '../types'

// Import modular components
import {
  LayoutTab,
  FeaturesTab,
  CardStyleTab,
  BackgroundTab,
  AdvancedTab,
  LayoutIcon,
  FeaturesIcon,
  CardStyleIcon,
  BackgroundIcon,
  AdvancedIcon,
  getDefaultFeaturesContent
} from './features'

interface FeaturesBlockEditorProps {
  content: FeaturesContent
  onUpdate: (content: FeaturesContent) => void
}

type TabType = 'layout' | 'features' | 'card-style' | 'background' | 'advanced'

export default function FeaturesBlockEditor({ content, onUpdate }: FeaturesBlockEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('layout')
  const [localContent, setLocalContent] = useState<FeaturesContent>(() => ({
    ...getDefaultFeaturesContent(),
    ...content
  }))

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  // Only sync from props on initial mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
  }, [content])

  // Debounced save to parent
  const debouncedUpdate = useCallback((newContent: FeaturesContent) => {
    if (isInitialMount.current) return
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      onUpdate(newContent)
    }, 300)
  }, [onUpdate])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  const updateContent = (updates: Partial<FeaturesContent>) => {
    const newContent = { ...localContent, ...updates }
    setLocalContent(newContent)
    debouncedUpdate(newContent)
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'layout', label: 'Düzen', icon: <LayoutIcon /> },
    { id: 'features', label: 'Özellikler', icon: <FeaturesIcon /> },
    { id: 'card-style', label: 'Kart Stili', icon: <CardStyleIcon /> },
    { id: 'background', label: 'Arkaplan', icon: <BackgroundIcon /> },
    { id: 'advanced', label: 'Gelişmiş', icon: <AdvancedIcon /> },
  ]

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-sage-700 shadow-sm'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="min-h-[400px]">
        {activeTab === 'layout' && (
          <LayoutTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'features' && (
          <FeaturesTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'card-style' && (
          <CardStyleTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'background' && (
          <BackgroundTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'advanced' && (
          <AdvancedTab content={localContent} updateContent={updateContent} />
        )}
      </div>
    </div>
  )
}
