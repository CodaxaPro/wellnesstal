'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { AboutContent } from '../types'
import { getDefaultAboutContent } from './about/defaults'
import { ContentTab, TypographyTab, ImagesTab, BackgroundTab, AdvancedTab } from './about'
import { ContentIcon, TypographyIcon, ImagesIcon, BackgroundIcon, AdvancedIcon } from './about/shared/TabIcons'

type TabType = 'content' | 'typography' | 'images' | 'background' | 'advanced'

interface AboutBlockEditorProps {
  content: AboutContent
  onUpdate: (content: Partial<AboutContent>) => void
}

export default function AboutBlockEditor({ content, onUpdate }: AboutBlockEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const [localContent, setLocalContent] = useState<AboutContent>(() => ({
    ...getDefaultAboutContent(),
    ...content,
    stats: content.stats || [],
    images: content.images || []
  }))

  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
  }, [content])

  const debouncedUpdate = useCallback((newContent: AboutContent) => {
    if (isInitialMount.current) return
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      onUpdate(newContent)
    }, 300)
  }, [onUpdate])

  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  const updateContent = (updates: Partial<AboutContent>) => {
    const newContent = { ...localContent, ...updates }
    setLocalContent(newContent)
    debouncedUpdate(newContent)
  }

  const tabs = [
    { id: 'content' as TabType, label: 'İçerik', Icon: ContentIcon },
    { id: 'typography' as TabType, label: 'Tipografi', Icon: TypographyIcon },
    { id: 'images' as TabType, label: 'Görseller', Icon: ImagesIcon },
    { id: 'background' as TabType, label: 'Arkaplan', Icon: BackgroundIcon },
    { id: 'advanced' as TabType, label: 'Gelişmiş', Icon: AdvancedIcon },
  ]

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Tab Navigation */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-4">
        <div className="flex gap-1 overflow-x-auto py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-sage-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.Icon />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && (
          <ContentTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'typography' && (
          <TypographyTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'images' && (
          <ImagesTab content={localContent} updateContent={updateContent} />
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

