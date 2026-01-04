'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { FAQContent } from '../types'
import { ContentTab, ItemsTab, StyleTab, BackgroundTab, AdvancedTab } from './faq'

interface FAQBlockEditorProps {
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

// Default FAQ Content
const defaultContent: FAQContent = {
  layout: 'accordion',
  maxWidth: 'lg',
  header: {
    title: 'Sikca Sorulan Sorular',
    subtitle: 'Merak ettiginiz her seyin cevabi burada',
    alignment: 'center'
  },
  items: [],
  showCategories: false,
  categories: [],
  padding: { top: '4rem', bottom: '4rem' },
  itemGap: '1rem',
  accordionSettings: {
    allowMultipleOpen: false,
    collapseOthersOnOpen: true
  },
  accordionStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: '0.75rem',
    shadow: 'sm',
    expandIcon: 'chevron',
    expandIconPosition: 'right',
    expandIconColor: '#64748b',
    openBackgroundColor: '#ffffff',
    openBorderColor: '#86a789',
    openShadow: 'md'
  },
  cardStyle: {
    backgroundColor: '#ffffff',
    borderColor: '#e2e8f0',
    borderWidth: 1,
    borderRadius: '1rem',
    shadow: 'md',
    padding: '1.5rem',
    hoverEffect: 'lift'
  },
  typography: {
    question: {
      fontSize: '1rem',
      fontWeight: '500',
      lineHeight: '1.5',
      color: '#1e293b'
    },
    answer: {
      fontSize: '0.95rem',
      fontWeight: '400',
      lineHeight: '1.7',
      color: '#64748b'
    }
  },
  background: {
    type: 'solid',
    color: '#f8fafc'
  },
  animations: {
    enabled: true,
    type: 'fade',
    expandAnimation: 'smooth',
    expandDuration: 300,
    stagger: true,
    staggerDelay: 100,
    hoverEffects: true
  },
  search: {
    enabled: false
  },
  helpfulVotes: {
    enabled: false
  },
  contactCTA: {
    enabled: false
  },
  schemaMarkup: {
    enabled: false
  }
}

type TabType = 'content' | 'items' | 'style' | 'background' | 'advanced'

const tabs: { id: TabType; label: string; icon: string }[] = [
  { id: 'content', label: 'Icerik', icon: 'C' },
  { id: 'items', label: 'Sorular', icon: 'S' },
  { id: 'style', label: 'Stil', icon: 'T' },
  { id: 'background', label: 'Arkaplan', icon: 'B' },
  { id: 'advanced', label: 'Gelismis', icon: 'G' }
]

export default function FAQBlockEditor({ content, onUpdate }: FAQBlockEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const [localContent, setLocalContent] = useState<FAQContent>(() =>
    deepMerge(defaultContent, content as Partial<FAQContent>)
  )
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isInitialMount = useRef(true)

  // Sync local state when prop content changes
  useEffect(() => {
    setLocalContent(deepMerge(defaultContent, content as Partial<FAQContent>))
  }, [content])

  // Debounced update to parent
  const updateContent = useCallback((updates: Partial<FAQContent>) => {
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
              {tab.id === 'items' && localContent.items && localContent.items.length > 0 && (
                <span className="ml-1 px-1.5 py-0.5 text-xs bg-sage-100 text-sage-700 rounded-full">
                  {localContent.items.length}
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
        {activeTab === 'items' && (
          <ItemsTab content={localContent} updateContent={updateContent} />
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
        <span>{localContent.items?.length || 0} soru</span>
        <span>Layout: {localContent.layout}</span>
        {localContent.showCategories && localContent.categories && (
          <span>{localContent.categories.length} kategori</span>
        )}
        {localContent.search?.enabled && <span>Arama aktif</span>}
        {localContent.schemaMarkup?.enabled && <span>SEO Schema</span>}
      </div>
    </div>
  )
}
