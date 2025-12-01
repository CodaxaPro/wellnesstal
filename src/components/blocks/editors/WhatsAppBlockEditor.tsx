'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { WhatsAppContent } from '../types'
import {
  BasicTab,
  AppearanceTab,
  MessageTab,
  DisplayTab,
  AvailabilityTab,
  CtaTab,
  WHATSAPP_TABS,
  defaultWhatsAppContent
} from './whatsapp'

interface WhatsAppBlockEditorProps {
  content: Record<string, unknown>
  onUpdate: (content: Record<string, unknown>) => void
}

// Deep merge utility
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }
  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        target[key] !== null &&
        !Array.isArray(target[key])
      ) {
        result[key] = deepMerge(target[key] as Record<string, any>, source[key] as Record<string, any>) as T[Extract<keyof T, string>]
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>]
      }
    }
  }
  return result
}

export default function WhatsAppBlockEditor({ content: initialContent, onUpdate }: WhatsAppBlockEditorProps) {
  const [activeTab, setActiveTab] = useState('basic')

  // Merge initial content with defaults
  const mergedContent = deepMerge(defaultWhatsAppContent, initialContent as Partial<WhatsAppContent>)
  const [content, setContent] = useState<WhatsAppContent>(mergedContent)

  // Debounce ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null)

  // Debounced update
  const debouncedUpdate = useCallback((newContent: WhatsAppContent) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onUpdate(newContent as unknown as Record<string, unknown>)
    }, 300)
  }, [onUpdate])

  // Update content handler
  const updateContent = useCallback((updates: Partial<WhatsAppContent>) => {
    setContent(prev => {
      const newContent = deepMerge(prev, updates)
      debouncedUpdate(newContent)
      return newContent
    })
  }, [debouncedUpdate])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // Render current tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicTab content={content} updateContent={updateContent} />
      case 'appearance':
        return <AppearanceTab content={content} updateContent={updateContent} />
      case 'message':
        return <MessageTab content={content} updateContent={updateContent} />
      case 'display':
        return <DisplayTab content={content} updateContent={updateContent} />
      case 'availability':
        return <AvailabilityTab content={content} updateContent={updateContent} />
      case 'cta':
        return <CtaTab content={content} updateContent={updateContent} />
      default:
        return null
    }
  }

  return (
    <div className="whatsapp-block-editor">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {WHATSAPP_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-green-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span className="w-6 h-6 flex items-center justify-center bg-slate-200 rounded text-xs font-bold">
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>

      {/* Preview Section */}
      <div className="mt-8 p-6 bg-slate-50 rounded-xl">
        <h4 className="text-sm font-medium text-slate-700 mb-4">Buton Onizlemesi</h4>
        <div className="flex items-center justify-center min-h-[120px] bg-white rounded-lg border border-slate-200 relative overflow-hidden">
          {/* Preview Container */}
          <div className={`absolute ${content.basic.position === 'bottom-right' ? 'right-4' : 'left-4'} bottom-4 flex flex-col items-center`}>
            {/* CTA Bubble Preview */}
            {content.ctaBubble.enabled && (
              <div
                className="mb-2 p-3 rounded-xl shadow-lg max-w-[180px] relative"
                style={{ backgroundColor: content.ctaBubble.backgroundColor }}
              >
                <h5
                  className="font-semibold text-xs mb-0.5"
                  style={{ color: content.ctaBubble.titleColor }}
                >
                  {content.ctaBubble.title}
                </h5>
                <p
                  className="text-[10px] leading-relaxed"
                  style={{ color: content.ctaBubble.textColor }}
                >
                  {content.ctaBubble.message}
                </p>
                <div
                  className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
                  style={{ borderTopColor: content.ctaBubble.backgroundColor }}
                />
              </div>
            )}

            {/* Button Preview */}
            {content.basic.useOriginalStyle ? (
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg relative">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                {content.availability.showIndicator && (
                  <div
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                    style={{ backgroundColor: content.availability.mode === 'always-online' ? content.availability.onlineColor : content.availability.offlineColor }}
                  />
                )}
              </div>
            ) : (
              <div
                className={`flex items-center justify-center relative transition-all ${
                  content.appearance.size === 'small' ? 'w-10 h-10' :
                  content.appearance.size === 'medium' ? 'w-12 h-12' : 'w-14 h-14'
                } ${
                  content.appearance.borderRadius === 'full' ? 'rounded-full' :
                  content.appearance.borderRadius === 'rounded' ? 'rounded-xl' : 'rounded-lg'
                }`}
                style={{
                  backgroundColor: content.appearance.buttonColor,
                  boxShadow: content.appearance.shadow ? '0 4px 15px rgba(0,0,0,0.2)' : 'none'
                }}
              >
                <svg
                  className={
                    content.appearance.size === 'small' ? 'w-5 h-5' :
                    content.appearance.size === 'medium' ? 'w-6 h-6' : 'w-7 h-7'
                  }
                  fill={content.appearance.iconColor}
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
                {content.availability.showIndicator && (
                  <div
                    className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white"
                    style={{ backgroundColor: content.availability.mode === 'always-online' ? content.availability.onlineColor : content.availability.offlineColor }}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Gercek gorunum sayfa onizlemesinde gorunecektir
        </p>
      </div>
    </div>
  )
}
