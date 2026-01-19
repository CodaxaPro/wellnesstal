'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { GalleryContent } from '../types'

import {
  ImagesTab,
  LayoutTab,
  StyleTab,
  LightboxTab,
  GALLERY_TABS,
  defaultGalleryContent
} from './gallery'

interface GalleryBlockEditorProps {
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

export default function GalleryBlockEditor({ content: initialContent, onUpdate }: GalleryBlockEditorProps) {
  const [activeTab, setActiveTab] = useState('images')

  // Merge initial content with defaults
  const mergedContent = deepMerge(defaultGalleryContent, initialContent as Partial<GalleryContent>)
  const [content, setContent] = useState<GalleryContent>(mergedContent)

  // Debounce ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  // Debounced update
  const debouncedUpdate = useCallback((newContent: GalleryContent) => {
    if (isInitialMount.current) {
return
}
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onUpdate(newContent as unknown as Record<string, unknown>)
    }, 300)
  }, [onUpdate])

  // Update content handler
  const updateContent = useCallback((updates: Partial<GalleryContent>) => {
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
      case 'images':
        return <ImagesTab content={content} updateContent={updateContent} />
      case 'layout':
        return <LayoutTab content={content} updateContent={updateContent} />
      case 'style':
        return <StyleTab content={content} updateContent={updateContent} />
      case 'lightbox':
        return <LightboxTab content={content} updateContent={updateContent} />
      default:
        return null
    }
  }

  return (
    <div className="gallery-block-editor">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {GALLERY_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-sage-600 shadow-sm'
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

      {/* Stats Bar */}
      <div className="mt-6 p-4 bg-slate-50 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Gorsel:</span>
            <span className="font-medium text-slate-700">{content.images.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Kolon:</span>
            <span className="font-medium text-slate-700">{content.layout.columns}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Duzenleme:</span>
            <span className="font-medium text-slate-700 capitalize">{content.layout.type}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {content.lightbox.enabled && (
            <span className="px-2 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-medium">
              Lightbox Aktif
            </span>
          )}
          {content.filter.enabled && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              Filtre Aktif
            </span>
          )}
        </div>
      </div>

      {/* Mini Preview */}
      {content.images.filter(img => img.url && img.url.trim() !== '').length > 0 && (
        <div className="mt-4 p-4 bg-slate-50 rounded-xl">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Hizli Onizleme</h4>
          <div
            className="grid gap-2 max-w-md mx-auto"
            style={{
              gridTemplateColumns: `repeat(${Math.min(content.layout.columns, 4)}, 1fr)`,
              gap: `${Math.min(content.layout.gap, 8)}px`
            }}
          >
            {content.images.filter(img => img.url && img.url.trim() !== '').slice(0, 8).map((image) => (
              <div
                key={image.id}
                className="bg-slate-200 overflow-hidden"
                style={{
                  borderRadius: `${Math.min(content.style.borderRadius, 8)}px`,
                  aspectRatio: content.layout.aspectRatio === 'square' ? '1/1' :
                    content.layout.aspectRatio === '4:3' ? '4/3' :
                    content.layout.aspectRatio === '16:9' ? '16/9' :
                    content.layout.aspectRatio === '3:2' ? '3/2' : '1/1'
                }}
              >
                <img
                  src={image.url}
                  alt={image.alt || ''}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          {content.images.filter(img => img.url && img.url.trim() !== '').length > 8 && (
            <p className="text-center text-xs text-slate-400 mt-2">
              +{content.images.filter(img => img.url && img.url.trim() !== '').length - 8} daha fazla gorsel
            </p>
          )}
        </div>
      )}
    </div>
  )
}
