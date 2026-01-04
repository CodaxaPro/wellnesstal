'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { PricingContent } from '../types'
import { getDefaultPricingContent } from './pricing/defaults'
import { ContentIcon, PackagesIcon, LayoutIcon, BackgroundIcon, AdvancedIcon } from './pricing/shared/TabIcons'
import ContentTab from './pricing/ContentTab'
import PackagesTab from './pricing/PackagesTab'
import LayoutTab from './pricing/LayoutTab'
import BackgroundTab from './pricing/BackgroundTab'
import AdvancedTab from './pricing/AdvancedTab'

interface PricingBlockEditorProps {
  content: PricingContent
  onChange: (content: PricingContent) => void
}

type TabType = 'content' | 'packages' | 'layout' | 'background' | 'advanced'

const tabs: { id: TabType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'content', label: 'İçerik', icon: ContentIcon },
  { id: 'packages', label: 'Paketler', icon: PackagesIcon },
  { id: 'layout', label: 'Düzen', icon: LayoutIcon },
  { id: 'background', label: 'Arkaplan', icon: BackgroundIcon },
  { id: 'advanced', label: 'Gelişmiş', icon: AdvancedIcon }
]

export default function PricingBlockEditor({ content, onChange }: PricingBlockEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const [localContent, setLocalContent] = useState<PricingContent>(() => {
    const defaults = getDefaultPricingContent()
    return deepMerge(defaults as unknown as Record<string, unknown>, (content || {}) as unknown as Record<string, unknown>) as unknown as PricingContent
  })

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  // Sync external changes
  useEffect(() => {
    if (content && !isInitialMount.current) {
      const defaults = getDefaultPricingContent()
      setLocalContent(deepMerge(defaults as unknown as Record<string, unknown>, content as unknown as Record<string, unknown>) as unknown as PricingContent)
    }
    isInitialMount.current = false
  }, [content])

  // Debounced onChange
  const debouncedOnChange = useCallback((newContent: PricingContent) => {
    if (isInitialMount.current) return
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    timeoutRef.current = setTimeout(() => {
      onChange(newContent)
    }, 300)
  }, [onChange])

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const updateContent = useCallback((updates: Partial<PricingContent>) => {
    setLocalContent(prev => {
      const newContent = { ...prev, ...updates }
      debouncedOnChange(newContent)
      return newContent
    })
  }, [debouncedOnChange])

  const renderTabContent = () => {
    switch (activeTab) {
      case 'content':
        return <ContentTab content={localContent} updateContent={updateContent} />
      case 'packages':
        return <PackagesTab content={localContent} updateContent={updateContent} />
      case 'layout':
        return <LayoutTab content={localContent} updateContent={updateContent} />
      case 'background':
        return <BackgroundTab content={localContent} updateContent={updateContent} />
      case 'advanced':
        return <AdvancedTab content={localContent} updateContent={updateContent} />
      default:
        return null
    }
  }

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-sm">💰</span>
          <div>
            <h2 className="font-semibold text-slate-800 text-sm">Pricing Block Editor</h2>
            <p className="text-[10px] text-slate-500">Fiyatlandırma bölümünü düzenle</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200">
        <div className="flex">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 px-2 text-xs font-medium transition-all relative ${
                  activeTab === tab.id
                    ? 'text-sage-600 bg-sage-50'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-sage-600' : 'text-slate-400'}`} />
                  <span>{tab.label}</span>
                </div>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-500" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {renderTabContent()}
      </div>

      {/* Footer Stats */}
      <div className="bg-white border-t border-slate-200 px-4 py-2">
        <div className="flex items-center justify-between text-[10px] text-slate-500">
          <span>{localContent.packages?.length || 0} paket</span>
          <span>Layout: {localContent.layout || 'grid'}</span>
          <span>{localContent.billingToggle?.enabled ? 'Billing Toggle Aktif' : ''}</span>
        </div>
      </div>
    </div>
  )
}

// Deep merge utility
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const output = { ...target }

  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] })
        } else {
          output[key] = deepMerge(target[key] as Record<string, unknown>, source[key] as Record<string, unknown>)
        }
      } else if (source[key] !== undefined) {
        Object.assign(output, { [key]: source[key] })
      }
    })
  }

  return output
}

function isObject(item: unknown): item is Record<string, unknown> {
  return item !== null && typeof item === 'object' && !Array.isArray(item)
}
