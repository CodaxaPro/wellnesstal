'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { TeamContent } from '../types'
import { ContentTab, MembersTab, StyleTab, BackgroundTab, AdvancedTab, defaultTeamContent } from './team'

interface TeamBlockEditorProps {
  content: Record<string, unknown>
  onUpdate: (content: Record<string, unknown>) => void
}

// Deep merge utility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target } as any
  for (const key in source) {
    if (source[key] !== undefined) {
      const sourceValue = source[key]
      if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)) {
        output[key] = deepMerge(target[key as keyof T] || ({} as any), sourceValue as any)
      } else {
        output[key] = sourceValue
      }
    }
  }
  return output
}

type TabType = 'content' | 'members' | 'style' | 'background' | 'advanced'

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'content', label: 'Icerik', icon: 'C' },
  { id: 'members', label: 'Uyeler', icon: 'U' },
  { id: 'style', label: 'Stil', icon: 'S' },
  { id: 'background', label: 'Arkaplan', icon: 'B' },
  { id: 'advanced', label: 'Gelismis', icon: 'G' }
]

export default function TeamBlockEditor({ content, onUpdate }: TeamBlockEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const [localContent, setLocalContent] = useState<TeamContent>(() =>
    deepMerge(defaultTeamContent, content as Partial<TeamContent>)
  )
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialMount = useRef(true)

  // Sync local state when prop content changes
  useEffect(() => {
    setLocalContent(deepMerge(defaultTeamContent, content as Partial<TeamContent>))
  }, [content])

  // Debounced update to parent
  const updateContent = useCallback((updates: Partial<TeamContent>) => {
    const newContent = { ...localContent, ...updates }
    setLocalContent(newContent)

    // Debounce parent update
    if (isInitialMount.current) return
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onUpdate(newContent)
    }, 300)
  }, [localContent, onUpdate])

  useEffect(() => {
    isInitialMount.current = false
  }, [])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div className="h-full flex flex-col">
      {/* Tab Navigation */}
      <div className="flex-shrink-0 border-b border-slate-200 bg-white">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === tab.id
                  ? 'border-sage-500 text-sage-700 bg-sage-50/50'
                  : 'border-transparent text-slate-600 hover:text-slate-800 hover:bg-slate-50'
              }`}
            >
              <span className="w-5 h-5 rounded bg-slate-100 flex items-center justify-center text-xs font-bold">
                {tab.icon}
              </span>
              <span>{tab.label}</span>
              {tab.id === 'members' && localContent.members && localContent.members.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-sage-100 text-sage-700 rounded-full">
                  {localContent.members.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-50">
        {activeTab === 'content' && (
          <ContentTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'members' && (
          <MembersTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'style' && (
          <StyleTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'background' && (
          <BackgroundTab content={localContent} updateContent={updateContent} />
        )}
        {activeTab === 'advanced' && (
          <AdvancedTab content={localContent} updateContent={updateContent} />
        )}
      </div>

      {/* Stats Bar */}
      <div className="flex-shrink-0 px-4 py-2 bg-white border-t border-slate-200 text-xs text-slate-500 flex items-center gap-4">
        <span>{localContent.members?.length || 0} ekip uyesi</span>
        <span>Layout: {localContent.layout || 'grid'}</span>
        {localContent.showBio !== false && <span>Bio aktif</span>}
        {localContent.showSocial !== false && <span>Sosyal aktif</span>}
        {localContent.animations?.enabled !== false && <span>Animasyon</span>}
      </div>
    </div>
  )
}
