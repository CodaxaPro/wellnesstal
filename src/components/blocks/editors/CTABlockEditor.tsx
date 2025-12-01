'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { CTAContent } from '../types'
import { getDefaultCTAContent } from './cta/defaults'
import ContentTab from './cta/ContentTab'
import ButtonTab from './cta/ButtonTab'
import LayoutTab from './cta/LayoutTab'
import BackgroundTab from './cta/BackgroundTab'
import AdvancedTab from './cta/AdvancedTab'
import { ContentIcon, ButtonIcon, LayoutIcon, BackgroundIcon, AdvancedIcon } from './cta/shared/TabIcons'

interface CTABlockEditorProps {
  content: CTAContent
  onUpdate: (content: CTAContent) => void
}

type TabType = 'content' | 'button' | 'layout' | 'background' | 'advanced'

export default function CTABlockEditor({ content, onUpdate }: CTABlockEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const [localContent, setLocalContent] = useState<CTAContent>(() => ({
    ...getDefaultCTAContent(),
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
        ...getDefaultCTAContent(),
        ...content
      })
    }
  }, [content])

  // Debounced update to parent
  const debouncedUpdate = useCallback((newContent: CTAContent) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onUpdate(newContent)
    }, 500)
  }, [onUpdate])

  // Handle content updates
  const updateContent = useCallback((updates: Partial<CTAContent>) => {
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
    { id: 'content' as TabType, label: 'Icerik', Icon: ContentIcon },
    { id: 'button' as TabType, label: 'Buton', Icon: ButtonIcon },
    { id: 'layout' as TabType, label: 'Duzen', Icon: LayoutIcon },
    { id: 'background' as TabType, label: 'Arkaplan', Icon: BackgroundIcon },
    { id: 'advanced' as TabType, label: 'Gelismis', Icon: AdvancedIcon },
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
        {activeTab === 'button' && (
          <ButtonTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'layout' && (
          <LayoutTab content={localContent} updateContent={updateContent} />
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
              localContent.layout === 'centered' ? 'bg-blue-500' :
              localContent.layout === 'split-left' || localContent.layout === 'split-right' ? 'bg-green-500' :
              localContent.layout === 'card' ? 'bg-purple-500' :
              localContent.layout === 'banner' ? 'bg-orange-500' :
              'bg-gray-500'
            }`} />
            <span className="capitalize">{localContent.layout}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>BG: {localContent.background.type}</span>
            <span>Buton: {localContent.primaryButton.size}</span>
            {localContent.showSecondaryButton && (
              <span className="px-2 py-0.5 bg-sage-100 text-sage-700 rounded">
                2 Buton
              </span>
            )}
            {localContent.animations.enabled && (
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded">
                Animasyon
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
