'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { TextContent } from '../types'
import { getDefaultTextContent } from './text/defaults'
import LayoutTab from './text/LayoutTab'
import ContentTab from './text/ContentTab'
import TypographyTab from './text/TypographyTab'
import BackgroundTab from './text/BackgroundTab'
import AdvancedTab from './text/AdvancedTab'
import { LayoutIcon, ContentIcon, TypographyIcon, BackgroundIcon, AdvancedIcon } from './text/shared/TabIcons'

interface TextBlockEditorProps {
  content: TextContent
  onUpdate: (content: TextContent) => void
}

type TabType = 'layout' | 'content' | 'typography' | 'background' | 'advanced'

export default function TextBlockEditor({ content, onUpdate }: TextBlockEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const [localContent, setLocalContent] = useState<TextContent>(() => ({
    ...getDefaultTextContent(),
    ...content
  }))

  // Debounce ref for parent updates
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  // Update local state when parent content changes (e.g., from database)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    // Only update if content is substantially different
    const contentStr = JSON.stringify(content)
    const localStr = JSON.stringify(localContent)
    if (contentStr !== localStr) {
      setLocalContent({
        ...getDefaultTextContent(),
        ...content
      })
    }
  }, [content])

  // Debounced update to parent
  const debouncedUpdate = useCallback((newContent: TextContent) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onUpdate(newContent)
    }, 500)
  }, [onUpdate])

  // Handle content updates
  const updateContent = useCallback((updates: Partial<TextContent>) => {
    setLocalContent(prev => {
      const newContent = { ...prev, ...updates }
      debouncedUpdate(newContent)
      return newContent
    })
  }, [debouncedUpdate])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const tabs = [
    { id: 'content' as TabType, label: 'İçerik', Icon: ContentIcon },
    { id: 'layout' as TabType, label: 'Düzen', Icon: LayoutIcon },
    { id: 'typography' as TabType, label: 'Tipografi', Icon: TypographyIcon },
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
        {activeTab === 'layout' && (
          <LayoutTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'typography' && (
          <TypographyTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'background' && (
          <BackgroundTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'advanced' && (
          <AdvancedTab content={localContent} updateContent={updateContent} />
        )}
      </div>

      {/* Footer Status */}
      <div className="flex-shrink-0 px-4 py-2 bg-white border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className={`inline-block w-2 h-2 rounded-full ${
              localContent.contentType === 'paragraph' ? 'bg-blue-500' :
              localContent.contentType === 'quote' ? 'bg-purple-500' :
              localContent.contentType === 'list' ? 'bg-green-500' :
              localContent.contentType === 'code' ? 'bg-orange-500' :
              'bg-yellow-500'
            }`} />
            <span>
              {localContent.contentType === 'paragraph' ? 'Paragraf' :
               localContent.contentType === 'quote' ? 'Alıntı' :
               localContent.contentType === 'list' ? 'Liste' :
               localContent.contentType === 'code' ? 'Kod' : 'Callout'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span>Düzen: {localContent.layout}</span>
            <span>Max: {localContent.maxWidth}</span>
            {localContent.stylePreset !== 'custom' && (
              <span className="px-2 py-0.5 bg-sage-100 text-sage-700 rounded">
                {localContent.stylePreset}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
