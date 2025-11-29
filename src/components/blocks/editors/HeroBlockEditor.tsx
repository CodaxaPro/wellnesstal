'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { HeroContent, HeroButton } from '../types'

// Import modular components
import {
  LayoutTab,
  ContentTab,
  MediaTab,
  StyleTab,
  AdvancedTab,
  LayoutIcon,
  ContentIcon,
  MediaIcon,
  StyleIcon,
  AdvancedIcon,
  getDefaultContent
} from './hero'

interface HeroBlockEditorProps {
  content: HeroContent
  onUpdate: (content: HeroContent) => void
}

type TabType = 'layout' | 'content' | 'media' | 'style' | 'advanced'

export default function HeroBlockEditor({ content, onUpdate }: HeroBlockEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('layout')
  const [localContent, setLocalContent] = useState<HeroContent>(() => ({
    ...getDefaultContent(),
    ...content
  }))
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Debounce timer ref
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  // Only sync from props on initial mount, not on every content change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    // Don't sync from props after initial mount - we manage local state
  }, [content])

  // Debounced save to parent
  const debouncedUpdate = useCallback((newContent: HeroContent) => {
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

  const updateContent = (updates: Partial<HeroContent>) => {
    const newContent = { ...localContent, ...updates }
    setLocalContent(newContent)
    debouncedUpdate(newContent)
  }

  const updateNestedContent = (key: keyof HeroContent, nestedKey: string, value: any) => {
    const current = localContent[key] as Record<string, any> || {}
    updateContent({ [key]: { ...current, [nestedKey]: value } } as any)
  }

  // Image upload handler
  const handleImageUpload = async (file: File) => {
    if (!file) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', 'hero')
      formData.append('alt_text', localContent.title || 'Hero Image')

      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        updateContent({
          image: {
            url: data.data.file_path,
            alt: data.data.alt_text || '',
            focalPoint: { x: 50, y: 50 }
          }
        })
      } else {
        alert('Görsel yüklenirken hata oluştu')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Görsel yüklenirken hata oluştu')
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDeleteImage = () => {
    updateContent({ image: undefined })
  }

  // Button handlers
  const addButton = () => {
    const newButton: HeroButton = {
      text: 'Yeni Buton',
      link: '#',
      style: 'secondary',
      size: 'md',
      hoverEffect: 'scale'
    }
    updateContent({ buttons: [...(localContent.buttons || []), newButton] })
  }

  const updateButton = (index: number, updates: Partial<HeroButton>) => {
    const buttons = [...(localContent.buttons || [])]
    buttons[index] = { ...buttons[index], ...updates }
    updateContent({ buttons })
  }

  const removeButton = (index: number) => {
    const buttons = (localContent.buttons || []).filter((_, i) => i !== index)
    updateContent({ buttons })
  }

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'layout', label: 'Düzen', icon: <LayoutIcon /> },
    { id: 'content', label: 'İçerik', icon: <ContentIcon /> },
    { id: 'media', label: 'Medya', icon: <MediaIcon /> },
    { id: 'style', label: 'Stil', icon: <StyleIcon /> },
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
        {activeTab === 'content' && (
          <ContentTab
            content={localContent}
            updateContent={updateContent}
            addButton={addButton}
            updateButton={updateButton}
            removeButton={removeButton}
          />
        )}
        {activeTab === 'media' && (
          <MediaTab
            content={localContent}
            updateContent={updateContent}
            updateNestedContent={updateNestedContent}
            handleImageUpload={handleImageUpload}
            handleDeleteImage={handleDeleteImage}
            uploading={uploading}
          />
        )}
        {activeTab === 'style' && (
          <StyleTab
            content={localContent}
            updateContent={updateContent}
            updateNestedContent={updateNestedContent}
          />
        )}
        {activeTab === 'advanced' && (
          <AdvancedTab
            content={localContent}
            updateContent={updateContent}
            updateNestedContent={updateNestedContent}
          />
        )}
      </div>
    </div>
  )
}
