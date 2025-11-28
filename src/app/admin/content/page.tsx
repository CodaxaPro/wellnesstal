'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ContentSection {
  id: string
  section: string
  title: string
  description: string
  content: any
  defaults?: any
  lastUpdated: string
  updatedBy: string
}

interface TextStyle {
  fontFamily: string
  fontSize: string
  fontWeight: string
  color: string
  backgroundColor?: string
  borderColor?: string
}

// Font options
const fontFamilies = [
  { value: 'system-ui', label: 'System UI' },
  { value: 'Inter, sans-serif', label: 'Inter' },
  { value: 'Georgia, serif', label: 'Georgia (Serif)' },
  { value: 'Playfair Display, serif', label: 'Playfair Display' },
  { value: 'Roboto, sans-serif', label: 'Roboto' },
  { value: 'Open Sans, sans-serif', label: 'Open Sans' },
  { value: 'Lato, sans-serif', label: 'Lato' },
  { value: 'Montserrat, sans-serif', label: 'Montserrat' },
]

const fontWeights = [
  { value: '300', label: 'Light (300)' },
  { value: '400', label: 'Normal (400)' },
  { value: '500', label: 'Medium (500)' },
  { value: '600', label: 'Semibold (600)' },
  { value: '700', label: 'Bold (700)' },
  { value: '800', label: 'Extra Bold (800)' },
]

const fontSizes = [
  { value: '12px', label: '12px' },
  { value: '14px', label: '14px' },
  { value: '16px', label: '16px' },
  { value: '18px', label: '18px' },
  { value: '20px', label: '20px' },
  { value: '24px', label: '24px' },
  { value: '28px', label: '28px' },
  { value: '32px', label: '32px' },
  { value: '36px', label: '36px' },
  { value: '42px', label: '42px' },
  { value: '48px', label: '48px' },
  { value: '56px', label: '56px' },
  { value: '64px', label: '64px' },
  { value: '72px', label: '72px' },
  { value: '80px', label: '80px' },
]

export default function ContentManagement() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('landing-hero')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [contentSections, setContentSections] = useState<ContentSection[]>([])
  const [editingContent, setEditingContent] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [expandedStyleFields, setExpandedStyleFields] = useState<string[]>([])
  const [currentDefaults, setCurrentDefaults] = useState<any>(null)
  const [uploadingImage, setUploadingImage] = useState<number | null>(null)
  const [deletingImage, setDeletingImage] = useState<number | null>(null)
  const [uploadingHeroImage, setUploadingHeroImage] = useState(false)
  const [deletingHeroImage, setDeletingHeroImage] = useState(false)

  const tabs = [
    { id: 'landing-hero', label: 'Landing Hero', icon: '✨' },
    { id: 'hero', label: 'Hero Section', icon: '🏠' },
    { id: 'services-section', label: 'Leistungen Bölümü', icon: '💆' },
    { id: 'about', label: 'Über Uns', icon: '👥' },
    { id: 'contact-section', label: 'Kontakt Bölümü', icon: '📍' },
    { id: 'contact', label: 'Kontakt Daten', icon: '📞' },
    { id: 'footer', label: 'Footer', icon: '🦶' },
    { id: 'meta', label: 'SEO Meta', icon: '🔍' },
    { id: 'testimonials-section', label: 'Kundenstimmen', icon: '💬' }
  ]

  // Fetch content from API
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    fetchContent()
  }, [router])

  const fetchContent = async (): Promise<ContentSection[]> => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/content')
      const data = await response.json()
      if (data.success) {
        setContentSections(data.data)
        return data.data
      }
      return []
    } catch (error) {
      console.error('Failed to fetch content:', error)
      return []
    } finally {
      setIsLoading(false)
    }
  }

  const getCurrentSection = () => {
    return contentSections.find(section => section.section === activeTab)
  }

  const startEditing = async () => {
    // Refetch to ensure we have the latest data before editing
    const freshData = await fetchContent()
    const section = freshData.find(s => s.section === activeTab)
    if (section) {
      setEditingContent(JSON.parse(JSON.stringify(section.content)))
      setCurrentDefaults(section.defaults ? JSON.parse(JSON.stringify(section.defaults)) : null)
      setExpandedStyleFields([])
      setIsEditing(true)
    }
  }

  const toggleStyleField = (fieldName: string) => {
    setExpandedStyleFields(prev =>
      prev.includes(fieldName)
        ? prev.filter(f => f !== fieldName)
        : [...prev, fieldName]
    )
  }

  const updateStyleField = (fieldName: string, styleKey: string, value: string) => {
    setEditingContent((prev: any) => ({
      ...prev,
      styles: {
        ...prev.styles,
        [fieldName]: {
          ...prev.styles?.[fieldName],
          [styleKey]: value
        }
      }
    }))
  }

  const resetFieldToDefault = (fieldName: string) => {
    if (!currentDefaults) return

    setEditingContent((prev: any) => ({
      ...prev,
      [fieldName]: currentDefaults[fieldName],
      styles: {
        ...prev.styles,
        [fieldName]: currentDefaults.styles?.[fieldName]
      }
    }))
    setSaveMessage({ type: 'success', text: `"${fieldName}" varsayılan değere sıfırlandı` })
    setTimeout(() => setSaveMessage(null), 2000)
  }

  // Reset individual style property to default
  const resetStylePropertyToDefault = (fieldName: string, propertyName: string) => {
    if (!currentDefaults?.styles?.[fieldName]) return

    const defaultValue = currentDefaults.styles[fieldName][propertyName]
    if (defaultValue === undefined) return

    setEditingContent((prev: any) => ({
      ...prev,
      styles: {
        ...prev.styles,
        [fieldName]: {
          ...prev.styles?.[fieldName],
          [propertyName]: defaultValue
        }
      }
    }))
  }

  // Check if a style property differs from default
  const isStylePropertyChanged = (fieldName: string, propertyName: string) => {
    if (!currentDefaults?.styles?.[fieldName]) return false
    const currentValue = editingContent?.styles?.[fieldName]?.[propertyName]
    const defaultValue = currentDefaults.styles[fieldName][propertyName]
    return currentValue !== undefined && currentValue !== defaultValue
  }

  // Check if a nested content field differs from default (for cards, map, openingHours)
  const isNestedContentChanged = (path: string) => {
    if (!currentDefaults) return false
    const pathParts = path.split('.')
    let currentValue: any = editingContent
    let defaultValue: any = currentDefaults

    for (const part of pathParts) {
      currentValue = currentValue?.[part]
      defaultValue = defaultValue?.[part]
    }

    return currentValue !== undefined && currentValue !== defaultValue
  }

  // Reset a nested content field to its default value
  const resetNestedContentToDefault = (path: string) => {
    if (!currentDefaults) return
    const pathParts = path.split('.')
    let defaultValue: any = currentDefaults

    for (const part of pathParts) {
      defaultValue = defaultValue?.[part]
    }

    if (defaultValue === undefined) return

    // Build the nested update
    setEditingContent((prev: any) => {
      const newContent = JSON.parse(JSON.stringify(prev))
      let target = newContent
      for (let i = 0; i < pathParts.length - 1; i++) {
        if (!target[pathParts[i]]) target[pathParts[i]] = {}
        target = target[pathParts[i]]
      }
      target[pathParts[pathParts.length - 1]] = defaultValue
      return newContent
    })
  }

  const resetAllToDefaults = () => {
    if (!currentDefaults) return

    if (confirm('Tüm değerler varsayılana dönecek. Emin misiniz?')) {
      setEditingContent(JSON.parse(JSON.stringify(currentDefaults)))
      setSaveMessage({ type: 'success', text: 'Tüm değerler varsayılana sıfırlandı' })
      setTimeout(() => setSaveMessage(null), 2000)
    }
  }

  const cancelEditing = () => {
    setEditingContent(null)
    setIsEditing(false)
    setSaveMessage(null)
  }

  const handleSave = async () => {
    const section = getCurrentSection()
    if (!section || !editingContent) return

    setIsSaving(true)
    setSaveMessage(null)

    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: section.id,
          section: section.section,
          content: editingContent
        })
      })

      const data = await response.json()

      if (data.success) {
        // Refetch content to ensure preview shows latest data
        await fetchContent()
        setIsEditing(false)
        setEditingContent(null)
        setSaveMessage({ type: 'success', text: 'Içerik başarıyla kaydedildi!' })

        // Clear message after 3 seconds
        setTimeout(() => setSaveMessage(null), 3000)
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Kaydetme başarısız' })
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Bir hata oluştu' })
    } finally {
      setIsSaving(false)
    }
  }

  const updateField = (field: string, value: any) => {
    setEditingContent((prev: any) => ({
      ...prev,
      [field]: value
    }))
  }

  const updateNestedField = (parent: string, field: string, value: any) => {
    setEditingContent((prev: any) => {
      const currentParent = prev[parent] || {}
      return {
        ...prev,
        [parent]: {
          ...currentParent,
          [field]: value
        }
      }
    })
  }

  // Style Editor Component
  const renderStyleEditor = (fieldName: string, label: string, hasBackground = false, hasBorder = false) => {
    const styles = editingContent?.styles?.[fieldName] || {}
    const isExpanded = expandedStyleFields.includes(fieldName)
    const hasChanges = currentDefaults?.styles?.[fieldName] &&
      JSON.stringify(styles) !== JSON.stringify(currentDefaults.styles[fieldName])

    return (
      <div className="mt-2">
        <button
          type="button"
          onClick={() => toggleStyleField(fieldName)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isExpanded ? 'text-sage-600' : 'text-gray-500 hover:text-sage-600'
          }`}
        >
          <svg
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {label}
          {hasChanges && <span className="w-2 h-2 bg-amber-500 rounded-full"></span>}
        </button>

        {isExpanded && (
          <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
            {/* Reset Button */}
            {currentDefaults && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => resetFieldToDefault(fieldName)}
                  className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Orijinale Dön
                </button>
              </div>
            )}

            {/* Typography Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Font Family */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-600">Font Ailesi</label>
                  {isStylePropertyChanged(fieldName, 'fontFamily') && (
                    <button
                      type="button"
                      onClick={() => resetStylePropertyToDefault(fieldName, 'fontFamily')}
                      className="text-amber-500 hover:text-amber-600 transition-colors"
                      title="Orijinale Dön"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                </div>
                <select
                  value={styles.fontFamily || 'system-ui'}
                  onChange={(e) => updateStyleField(fieldName, 'fontFamily', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  {fontFamilies.map(font => (
                    <option key={font.value} value={font.value}>{font.label}</option>
                  ))}
                </select>
              </div>

              {/* Font Size */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-600">Font Boyutu</label>
                  {isStylePropertyChanged(fieldName, 'fontSize') && (
                    <button
                      type="button"
                      onClick={() => resetStylePropertyToDefault(fieldName, 'fontSize')}
                      className="text-amber-500 hover:text-amber-600 transition-colors"
                      title="Orijinale Dön"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                </div>
                <select
                  value={styles.fontSize || '16px'}
                  onChange={(e) => updateStyleField(fieldName, 'fontSize', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  {fontSizes.map(size => (
                    <option key={size.value} value={size.value}>{size.label}</option>
                  ))}
                </select>
              </div>

              {/* Font Weight */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-600">Font Kalınlığı</label>
                  {isStylePropertyChanged(fieldName, 'fontWeight') && (
                    <button
                      type="button"
                      onClick={() => resetStylePropertyToDefault(fieldName, 'fontWeight')}
                      className="text-amber-500 hover:text-amber-600 transition-colors"
                      title="Orijinale Dön"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                </div>
                <select
                  value={styles.fontWeight || '400'}
                  onChange={(e) => updateStyleField(fieldName, 'fontWeight', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  {fontWeights.map(weight => (
                    <option key={weight.value} value={weight.value}>{weight.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Color Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Text Color */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-600">Metin Rengi</label>
                  {isStylePropertyChanged(fieldName, 'color') && (
                    <button
                      type="button"
                      onClick={() => resetStylePropertyToDefault(fieldName, 'color')}
                      className="text-amber-500 hover:text-amber-600 transition-colors"
                      title="Orijinale Dön"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.color || '#2C2C2C'}
                    onChange={(e) => updateStyleField(fieldName, 'color', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.color || '#2C2C2C'}
                    onChange={(e) => updateStyleField(fieldName, 'color', e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                    placeholder="#2C2C2C"
                  />
                </div>
              </div>

              {/* Background Color */}
              {hasBackground && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-600">Arka Plan Rengi</label>
                    {isStylePropertyChanged(fieldName, 'backgroundColor') && (
                      <button
                        type="button"
                        onClick={() => resetStylePropertyToDefault(fieldName, 'backgroundColor')}
                        className="text-amber-500 hover:text-amber-600 transition-colors"
                        title="Orijinale Dön"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={styles.backgroundColor || '#9CAF88'}
                      onChange={(e) => updateStyleField(fieldName, 'backgroundColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={styles.backgroundColor || '#9CAF88'}
                      onChange={(e) => updateStyleField(fieldName, 'backgroundColor', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                      placeholder="#9CAF88"
                    />
                  </div>
                </div>
              )}

              {/* Border Color */}
              {hasBorder && (
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-gray-600">Kenarlık Rengi</label>
                    {isStylePropertyChanged(fieldName, 'borderColor') && (
                      <button
                        type="button"
                        onClick={() => resetStylePropertyToDefault(fieldName, 'borderColor')}
                        className="text-amber-500 hover:text-amber-600 transition-colors"
                        title="Orijinale Dön"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={styles.borderColor || '#9CAF88'}
                      onChange={(e) => updateStyleField(fieldName, 'borderColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={styles.borderColor || '#9CAF88'}
                      onChange={(e) => updateStyleField(fieldName, 'borderColor', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                      placeholder="#9CAF88"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Live Preview */}
            <div className="pt-3 border-t border-gray-200">
              <label className="block text-xs font-medium text-gray-600 mb-2">Önizleme</label>
              <div
                className={`p-3 rounded-lg ${hasBackground ? '' : 'bg-white border border-gray-200'}`}
                style={{
                  fontFamily: styles.fontFamily || 'system-ui',
                  fontSize: styles.fontSize || '16px',
                  fontWeight: styles.fontWeight || '400',
                  color: styles.color || '#2C2C2C',
                  backgroundColor: hasBackground ? (styles.backgroundColor || '#9CAF88') : undefined,
                  borderColor: hasBorder ? (styles.borderColor || '#9CAF88') : undefined,
                  borderWidth: hasBorder ? '2px' : undefined,
                  borderStyle: hasBorder ? 'solid' : undefined,
                }}
              >
                {editingContent?.[fieldName] || 'Örnek metin'}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Icon Style Editor Component - for card icons
  const renderIconStyleEditor = (fieldName: string, label: string) => {
    const styles = editingContent?.styles?.[fieldName] || {}
    const isExpanded = expandedStyleFields.includes(fieldName)
    const hasChanges = currentDefaults?.styles?.[fieldName] &&
      JSON.stringify(styles) !== JSON.stringify(currentDefaults.styles[fieldName])

    return (
      <div className="mt-2">
        <button
          type="button"
          onClick={() => toggleStyleField(fieldName)}
          className={`flex items-center gap-2 text-sm font-medium transition-colors ${
            isExpanded ? 'text-sage-600' : 'text-gray-500 hover:text-sage-600'
          }`}
        >
          <svg
            className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
          {label}
          {hasChanges && <span className="w-2 h-2 bg-amber-500 rounded-full"></span>}
        </button>

        {isExpanded && (
          <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
            {/* Reset Button */}
            {currentDefaults && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => resetFieldToDefault(fieldName)}
                  className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Orijinale Dön
                </button>
              </div>
            )}

            {/* Color Controls */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Background Color */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-600">Arka Plan Rengi</label>
                  {isStylePropertyChanged(fieldName, 'backgroundColor') && (
                    <button
                      type="button"
                      onClick={() => resetStylePropertyToDefault(fieldName, 'backgroundColor')}
                      className="text-amber-500 hover:text-amber-600 transition-colors"
                      title="Orijinale Dön"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.backgroundColor || '#9CAF88'}
                    onChange={(e) => updateStyleField(fieldName, 'backgroundColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.backgroundColor || '#9CAF88'}
                    onChange={(e) => updateStyleField(fieldName, 'backgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                    placeholder="#9CAF88"
                  />
                </div>
              </div>

              {/* Icon Color */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-600">İkon Rengi</label>
                  {isStylePropertyChanged(fieldName, 'iconColor') && (
                    <button
                      type="button"
                      onClick={() => resetStylePropertyToDefault(fieldName, 'iconColor')}
                      className="text-amber-500 hover:text-amber-600 transition-colors"
                      title="Orijinale Dön"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.iconColor || '#FFFFFF'}
                    onChange={(e) => updateStyleField(fieldName, 'iconColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.iconColor || '#FFFFFF'}
                    onChange={(e) => updateStyleField(fieldName, 'iconColor', e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                    placeholder="#FFFFFF"
                  />
                </div>
              </div>
            </div>

            {/* Live Preview */}
            <div className="pt-3 border-t border-gray-200">
              <label className="block text-xs font-medium text-gray-600 mb-2">Önizleme</label>
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: styles.backgroundColor || '#9CAF88',
                  }}
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: styles.iconColor || '#FFFFFF' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="text-sm text-gray-500">Örnek ikon görünümü</span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderLandingHeroEditor = (section: ContentSection) => {
    const content = isEditing ? editingContent : section.content

    return (
      <div className="space-y-6">
        {/* Reset All Button */}
        {isEditing && currentDefaults && (
          <div className="flex justify-end pb-4 border-b border-gray-200">
            <button
              type="button"
              onClick={resetAllToDefaults}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tümünü Orijinale Dön
            </button>
          </div>
        )}

        {/* Badge */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Badge Metni</label>
          <input
            type="text"
            value={content.badge || ''}
            onChange={(e) => updateField('badge', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('badge', 'Badge', true)}
        </div>

        {/* Main Title */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Ana Başlık</label>
          <input
            type="text"
            value={content.mainTitle || ''}
            onChange={(e) => updateField('mainTitle', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('mainTitle', 'Ana Başlık')}
        </div>

        {/* Highlighted Text */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Vurgulanan Metin (Renkli)</label>
          <input
            type="text"
            value={content.highlightedText || ''}
            onChange={(e) => updateField('highlightedText', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('highlightedText', 'Vurgulanan Metin')}
        </div>

        {/* Description */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Açıklama</label>
          <textarea
            rows={3}
            value={content.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('description', 'Açıklama')}
        </div>

        {/* Primary Button */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Ana Buton</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Metin</label>
              <input
                type="text"
                value={content.primaryButton || ''}
                onChange={(e) => updateField('primaryButton', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
              <input
                type="text"
                value={content.primaryButtonLink || ''}
                onChange={(e) => updateField('primaryButtonLink', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
          {isEditing && renderStyleEditor('primaryButton', 'Ana Buton', true)}
        </div>

        {/* Secondary Button */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">İkincil Buton</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Metin</label>
              <input
                type="text"
                value={content.secondaryButton || ''}
                onChange={(e) => updateField('secondaryButton', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
              <input
                type="text"
                value={content.secondaryButtonLink || ''}
                onChange={(e) => updateField('secondaryButtonLink', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
          {isEditing && renderStyleEditor('secondaryButton', 'İkincil Buton', false, true)}
        </div>
      </div>
    )
  }

  const renderHeroEditor = (section: ContentSection) => {
    const content = isEditing ? editingContent : section.content

    return (
      <div className="space-y-6">
        {/* Reset All Button */}
        {isEditing && currentDefaults && (
          <div className="flex justify-end pb-4 border-b border-gray-200">
            <button
              type="button"
              onClick={resetAllToDefaults}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tümünü Orijinale Dön
            </button>
          </div>
        )}

        {/* Badge */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Badge Metni</label>
          <input
            type="text"
            value={content.badge || ''}
            onChange={(e) => updateField('badge', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('badge', 'Badge', true)}
        </div>

        {/* Main Title */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Ana Başlık</label>
          <input
            type="text"
            value={content.mainTitle || ''}
            onChange={(e) => updateField('mainTitle', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('mainTitle', 'Ana Başlık')}
        </div>

        {/* Highlighted Text (3rd word in title) */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Vurgulanan Metin (Başlığın 3. Kelimesi)</label>
          <p className="text-xs text-gray-500 mb-2">Ana başlığın 3. kelimesi otomatik olarak bu stille görüntülenir</p>
          {isEditing && renderStyleEditor('highlightedText', 'Vurgulanan Metin')}
        </div>

        {/* Subtitle */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Alt Başlık</label>
          <textarea
            rows={3}
            value={content.subtitle || ''}
            onChange={(e) => updateField('subtitle', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('subtitle', 'Alt Başlık')}
        </div>

        {/* Primary Button */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Ana Buton</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Metin</label>
              <input
                type="text"
                value={content.primaryButton || ''}
                onChange={(e) => updateField('primaryButton', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
              <input
                type="text"
                value={content.primaryButtonLink || ''}
                onChange={(e) => updateField('primaryButtonLink', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
          {isEditing && renderStyleEditor('primaryButton', 'Ana Buton', true)}
        </div>

        {/* Secondary Button */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">İkincil Buton</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Metin</label>
              <input
                type="text"
                value={content.secondaryButton || ''}
                onChange={(e) => updateField('secondaryButton', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
              <input
                type="text"
                value={content.secondaryButtonLink || ''}
                onChange={(e) => updateField('secondaryButtonLink', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
          {isEditing && renderStyleEditor('secondaryButton', 'İkincil Buton', false, true)}
        </div>

        {/* Trust Indicator */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Güven Göstergesi</label>
          <input
            type="text"
            value={content.trustIndicator || ''}
            onChange={(e) => updateField('trustIndicator', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('trustIndicator', 'Güven Göstergesi')}
        </div>

        {/* Enterprise Hero Image Section */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal">🖼️ Hero Görseli</label>
              <p className="text-xs text-gray-500 mt-1">Hero bölümünde gösterilen ana görsel • Max 5MB • JPG, PNG, WebP, GIF</p>
            </div>
            {content.image?.url && (
              <span className={`text-xs px-2 py-1 rounded-full ${
                content.image.url.startsWith('/uploads/')
                  ? 'bg-green-100 text-green-700'
                  : 'bg-blue-100 text-blue-700'
              }`}>
                {content.image.url.startsWith('/uploads/') ? '📁 Yüklendi' : '🔗 Harici'}
              </span>
            )}
          </div>

          {/* Image Preview with Actions */}
          <div className="mb-4 relative group">
            {content.image?.url ? (
              <>
                <img
                  src={content.image.url}
                  alt={content.image?.alt || 'Hero görsel'}
                  className="w-full h-48 object-cover rounded-xl border border-gray-200"
                  style={{
                    borderRadius: content.imageStyles?.borderRadius || '24px',
                    filter: `brightness(${content.imageStyles?.brightness || 100}%) contrast(${content.imageStyles?.contrast || 100}%) saturate(${content.imageStyles?.saturation || 100}%)`,
                    opacity: parseInt(content.imageStyles?.opacity || '100') / 100,
                  }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Görsel+Yüklenemedi'
                  }}
                />
                {/* Overlay Actions */}
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                    {/* Upload New */}
                    <label className="cursor-pointer bg-white hover:bg-gray-100 text-charcoal px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleHeroImageUpload(file)
                        }}
                        disabled={uploadingHeroImage}
                      />
                      {uploadingHeroImage ? (
                        <div className="animate-spin h-5 w-5 border-2 border-sage-500 border-t-transparent rounded-full"></div>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                      <span className="text-sm font-medium">Değiştir</span>
                    </label>
                    {/* Delete */}
                    <button
                      type="button"
                      onClick={handleHeroImageDelete}
                      disabled={deletingHeroImage}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {deletingHeroImage ? (
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                      ) : (
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      <span className="text-sm font-medium">Sil</span>
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State - Upload Zone */
              <label className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
                isEditing
                  ? 'border-sage-300 hover:border-sage-500 hover:bg-sage-50'
                  : 'border-gray-200 bg-gray-100 cursor-not-allowed'
              }`}>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleHeroImageUpload(file)
                  }}
                  disabled={!isEditing || uploadingHeroImage}
                />
                {uploadingHeroImage ? (
                  <div className="flex flex-col items-center">
                    <div className="animate-spin h-10 w-10 border-3 border-sage-500 border-t-transparent rounded-full mb-2"></div>
                    <span className="text-sm text-sage-600">Yükleniyor...</span>
                  </div>
                ) : (
                  <>
                    <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm text-gray-500 font-medium">
                      {isEditing ? 'Hero görseli yükle' : 'Görsel yok'}
                    </span>
                    <span className="text-xs text-gray-400 mt-1">veya URL girin</span>
                  </>
                )}
              </label>
            )}
          </div>

          {/* URL & Alt Text Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Görsel URL
                {isEditing && <span className="text-gray-400 font-normal ml-1">(veya yukarıdan yükleyin)</span>}
              </label>
              <input
                type="text"
                value={content.image?.url || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  image: { ...prev.image, url: e.target.value }
                }))}
                disabled={!isEditing}
                placeholder="https://..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Alt Metin (SEO)</label>
              <input
                type="text"
                value={content.image?.alt || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  image: { ...prev.image, alt: e.target.value }
                }))}
                disabled={!isEditing}
                placeholder="Görsel açıklaması..."
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Image Effects Section */}
          {isEditing && (
            <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-sage-50 rounded-xl border border-purple-100">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">✨</span>
                <h4 className="text-sm font-semibold text-charcoal">Görsel Efektleri</h4>
              </div>

              {/* Border Radius & Shadow */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Köşe Yuvarlaklığı</label>
                  <select
                    value={content.imageStyles?.borderRadius || '24px'}
                    onChange={(e) => updateImageStyleField('borderRadius', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    <option value="0px">Keskin (0px)</option>
                    <option value="8px">Hafif (8px)</option>
                    <option value="16px">Orta (16px)</option>
                    <option value="24px">Yuvarlak (24px)</option>
                    <option value="32px">Çok Yuvarlak (32px)</option>
                    <option value="9999px">Tam Yuvarlak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Gölge</label>
                  <select
                    value={content.imageStyles?.boxShadow || '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}
                    onChange={(e) => updateImageStyleField('boxShadow', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    <option value="none">Gölge Yok</option>
                    <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1)">Hafif</option>
                    <option value="0 10px 15px -3px rgba(0, 0, 0, 0.1)">Orta</option>
                    <option value="0 25px 50px -12px rgba(0, 0, 0, 0.25)">Büyük</option>
                    <option value="0 35px 60px -15px rgba(0, 0, 0, 0.3)">Ekstra Büyük</option>
                  </select>
                </div>
              </div>

              {/* Opacity & Hover Scale */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Opaklık: {content.imageStyles?.opacity || 100}%
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={content.imageStyles?.opacity || 100}
                    onChange={(e) => updateImageStyleField('opacity', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Hover Zoom: {content.imageStyles?.hoverScale || 105}%
                  </label>
                  <input
                    type="range"
                    min="100"
                    max="120"
                    value={content.imageStyles?.hoverScale || 105}
                    onChange={(e) => updateImageStyleField('hoverScale', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                  />
                </div>
              </div>

              {/* Color Filters */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Parlaklık: {content.imageStyles?.brightness || 100}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={content.imageStyles?.brightness || 100}
                    onChange={(e) => updateImageStyleField('brightness', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Kontrast: {content.imageStyles?.contrast || 100}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="150"
                    value={content.imageStyles?.contrast || 100}
                    onChange={(e) => updateImageStyleField('contrast', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Doygunluk: {content.imageStyles?.saturation || 100}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={content.imageStyles?.saturation || 100}
                    onChange={(e) => updateImageStyleField('saturation', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
                </div>
              </div>

              {/* Overlay Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">
                    Overlay Opaklığı: {content.imageStyles?.overlayOpacity || 20}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="80"
                    value={content.imageStyles?.overlayOpacity || 20}
                    onChange={(e) => updateImageStyleField('overlayOpacity', e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Overlay Rengi</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={content.imageStyles?.overlayColor || '#2C2C2C'}
                      onChange={(e) => updateImageStyleField('overlayColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={content.imageStyles?.overlayColor || '#2C2C2C'}
                      onChange={(e) => updateImageStyleField('overlayColor', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Reset Image Styles Button */}
              {currentDefaults?.imageStyles && (
                <div className="mt-4 pt-4 border-t border-purple-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingContent((prev: any) => ({
                        ...prev,
                        imageStyles: { ...currentDefaults.imageStyles }
                      }))
                      setSaveMessage({ type: 'success', text: 'Görsel efektleri varsayılana sıfırlandı' })
                      setTimeout(() => setSaveMessage(null), 2000)
                    }}
                    className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Efektleri Sıfırla
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const updateImageField = (index: number, field: string, value: string) => {
    setEditingContent((prev: any) => {
      const images = [...(prev.images || [])]
      if (!images[index]) {
        images[index] = { url: '', alt: '' }
      }
      images[index] = { ...images[index], [field]: value }
      return { ...prev, images }
    })
  }

  const updateStatField = (index: number, field: string, value: string) => {
    setEditingContent((prev: any) => {
      const stats = [...(prev.stats || [])]
      if (!stats[index]) {
        stats[index] = { label: '', value: '' }
      }
      stats[index] = { ...stats[index], [field]: value }
      return { ...prev, stats }
    })
  }

  // Image upload handler
  const handleImageUpload = async (index: number, file: File) => {
    setUploadingImage(index)
    setSaveMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'about')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        // Update the image URL in editingContent
        setEditingContent((prev: any) => {
          const images = [...(prev.images || [])]
          if (!images[index]) {
            images[index] = { url: '', alt: '' }
          }
          images[index] = { ...images[index], url: data.data.url }
          return { ...prev, images }
        })
        setSaveMessage({ type: 'success', text: `Görsel ${index + 1} başarıyla yüklendi!` })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Yükleme başarısız' })
      }
    } catch (error) {
      console.error('Upload error:', error)
      setSaveMessage({ type: 'error', text: 'Yükleme sırasında bir hata oluştu' })
    } finally {
      setUploadingImage(null)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  // Image delete handler
  const handleImageDelete = async (index: number) => {
    const imageUrl = editingContent?.images?.[index]?.url

    // If it's an external URL (Unsplash etc.), just clear it
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      setEditingContent((prev: any) => {
        const images = [...(prev.images || [])]
        if (images[index]) {
          images[index] = { url: '', alt: images[index]?.alt || '' }
        }
        return { ...prev, images }
      })
      setSaveMessage({ type: 'success', text: `Görsel ${index + 1} kaldırıldı` })
      setTimeout(() => setSaveMessage(null), 2000)
      return
    }

    // Confirm deletion for uploaded files
    if (!confirm(`Görsel ${index + 1} silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?`)) {
      return
    }

    setDeletingImage(index)
    setSaveMessage(null)

    try {
      const response = await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        // Clear the image URL in editingContent
        setEditingContent((prev: any) => {
          const images = [...(prev.images || [])]
          if (images[index]) {
            images[index] = { url: '', alt: images[index]?.alt || '' }
          }
          return { ...prev, images }
        })
        setSaveMessage({ type: 'success', text: `Görsel ${index + 1} başarıyla silindi!` })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Silme başarısız' })
      }
    } catch (error) {
      console.error('Delete error:', error)
      setSaveMessage({ type: 'error', text: 'Silme sırasında bir hata oluştu' })
    } finally {
      setDeletingImage(null)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  // Hero image upload handler
  const handleHeroImageUpload = async (file: File) => {
    setUploadingHeroImage(true)
    setSaveMessage(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'hero')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (data.success) {
        setEditingContent((prev: any) => ({
          ...prev,
          image: {
            ...prev.image,
            url: data.data.url
          }
        }))
        setSaveMessage({ type: 'success', text: 'Hero görseli başarıyla yüklendi!' })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Yükleme başarısız' })
      }
    } catch (error) {
      console.error('Upload error:', error)
      setSaveMessage({ type: 'error', text: 'Yükleme sırasında bir hata oluştu' })
    } finally {
      setUploadingHeroImage(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  // Hero image delete handler
  const handleHeroImageDelete = async () => {
    const imageUrl = editingContent?.image?.url

    // If it's an external URL, just clear it
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      setEditingContent((prev: any) => ({
        ...prev,
        image: {
          ...prev.image,
          url: ''
        }
      }))
      setSaveMessage({ type: 'success', text: 'Hero görseli kaldırıldı' })
      setTimeout(() => setSaveMessage(null), 2000)
      return
    }

    // Confirm deletion for uploaded files
    if (!confirm('Hero görseli silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?')) {
      return
    }

    setDeletingHeroImage(true)
    setSaveMessage(null)

    try {
      const response = await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE'
      })

      const data = await response.json()

      if (data.success) {
        setEditingContent((prev: any) => ({
          ...prev,
          image: {
            ...prev.image,
            url: ''
          }
        }))
        setSaveMessage({ type: 'success', text: 'Hero görseli başarıyla silindi!' })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Silme başarısız' })
      }
    } catch (error) {
      console.error('Delete error:', error)
      setSaveMessage({ type: 'error', text: 'Silme sırasında bir hata oluştu' })
    } finally {
      setDeletingHeroImage(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  // Update image style field
  const updateImageStyleField = (field: string, value: string) => {
    setEditingContent((prev: any) => ({
      ...prev,
      imageStyles: {
        ...prev.imageStyles,
        [field]: value
      }
    }))
  }

  // Services Section Editor
  const renderServicesSectionEditor = (section: ContentSection) => {
    const content = isEditing ? editingContent : section.content
    return (
      <div className="space-y-6">
        {/* Reset All Button */}
        {isEditing && currentDefaults && (
          <div className="flex justify-end pb-4 border-b border-gray-200">
            <button
              type="button"
              onClick={resetAllToDefaults}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tümünü Orijinale Dön
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="p-4 bg-sage-50 rounded-xl border border-sage-200">
          <h3 className="text-lg font-semibold text-charcoal mb-4">📝 Bölüm Başlığı</h3>

          {/* Badge */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-charcoal mb-2">Badge Metni</label>
            <input
              type="text"
              value={content.badge || ''}
              onChange={(e) => updateField('badge', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
            {isEditing && renderStyleEditor('badge', 'Badge Stili', true)}
          </div>

          {/* Section Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-charcoal mb-2">Ana Başlık</label>
            <input
              type="text"
              value={content.sectionTitle || ''}
              onChange={(e) => updateField('sectionTitle', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
            {isEditing && renderStyleEditor('sectionTitle', 'Başlık Stili')}
          </div>

          {/* Highlighted Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-charcoal mb-2">Vurgulanan Metin</label>
            <input
              type="text"
              value={content.highlightedText || ''}
              onChange={(e) => updateField('highlightedText', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
            {isEditing && renderStyleEditor('highlightedText', 'Vurgulanan Metin Stili')}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Açıklama</label>
            <textarea
              rows={3}
              value={content.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
            {isEditing && renderStyleEditor('description', 'Açıklama Stili')}
          </div>
        </div>

        {/* CTA Section */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <h3 className="text-lg font-semibold text-charcoal mb-4">📢 CTA Bölümü (Alt Kısım)</h3>

          {/* CTA Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-charcoal mb-2">CTA Başlık</label>
            <input
              type="text"
              value={content.cta?.title || ''}
              onChange={(e) => updateNestedField('cta', 'title', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
            {isEditing && renderStyleEditor('ctaTitle', 'CTA Başlık Stili')}
          </div>

          {/* CTA Description */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-charcoal mb-2">CTA Açıklama</label>
            <textarea
              rows={2}
              value={content.cta?.description || ''}
              onChange={(e) => updateNestedField('cta', 'description', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
            {isEditing && renderStyleEditor('ctaDescription', 'CTA Açıklama Stili')}
          </div>

          {/* CTA Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Ana Buton Metni</label>
              <input
                type="text"
                value={content.cta?.primaryButtonText || ''}
                onChange={(e) => updateNestedField('cta', 'primaryButtonText', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">İkincil Buton Metni</label>
              <input
                type="text"
                value={content.cta?.secondaryButtonText || ''}
                onChange={(e) => updateNestedField('cta', 'secondaryButtonText', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderAboutEditor = (section: ContentSection) => {
    const content = isEditing ? editingContent : section.content
    return (
      <div className="space-y-6">
        {/* Reset All Button */}
        {isEditing && currentDefaults && (
          <div className="flex justify-end pb-4 border-b border-gray-200">
            <button
              type="button"
              onClick={resetAllToDefaults}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tümünü Orijinale Dön
            </button>
          </div>
        )}

        {/* Badge */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Badge Metni</label>
          <input
            type="text"
            value={content.badge || ''}
            onChange={(e) => updateField('badge', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('badge', 'Badge', true)}
        </div>

        {/* Title */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Başlık</label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => updateField('title', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('title', 'Başlık')}
        </div>

        {/* Highlighted Text (last word in title) */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Vurgulanan Metin (Son Kelime)</label>
          <p className="text-xs text-gray-500 mb-2">Başlığın son kelimesi otomatik olarak bu stille görüntülenir</p>
          {isEditing && renderStyleEditor('highlightedText', 'Vurgulanan Metin')}
        </div>

        {/* Description */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Açıklama</label>
          <textarea
            rows={4}
            value={content.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('description', 'Açıklama')}
        </div>

        {/* Stats */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-4">İstatistikler</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Stat 1 */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block text-xs font-medium text-gray-500 mb-1">İstatistik 1 - Değer</label>
              <input
                type="text"
                value={content.stats?.[0]?.value || ''}
                onChange={(e) => updateStatField(0, 'value', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100 mb-2"
              />
              <label className="block text-xs font-medium text-gray-500 mb-1">İstatistik 1 - Etiket</label>
              <input
                type="text"
                value={content.stats?.[0]?.label || ''}
                onChange={(e) => updateStatField(0, 'label', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
            {/* Stat 2 */}
            <div className="p-4 bg-gray-50 rounded-xl">
              <label className="block text-xs font-medium text-gray-500 mb-1">İstatistik 2 - Değer</label>
              <input
                type="text"
                value={content.stats?.[1]?.value || ''}
                onChange={(e) => updateStatField(1, 'value', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100 mb-2"
              />
              <label className="block text-xs font-medium text-gray-500 mb-1">İstatistik 2 - Etiket</label>
              <input
                type="text"
                value={content.stats?.[1]?.label || ''}
                onChange={(e) => updateStatField(1, 'label', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>
          {isEditing && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-2 font-medium">Değer Stili</p>
                {renderStyleEditor('statsValue', 'İstatistik Değeri')}
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-2 font-medium">Etiket Stili</p>
                {renderStyleEditor('statsLabel', 'İstatistik Etiketi')}
              </div>
            </div>
          )}
        </div>

        {/* Primary Button */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Ana Buton</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Metin</label>
              <input
                type="text"
                value={content.primaryButton || ''}
                onChange={(e) => updateField('primaryButton', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
              <input
                type="text"
                value={content.primaryButtonLink || ''}
                onChange={(e) => updateField('primaryButtonLink', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
          {isEditing && renderStyleEditor('primaryButton', 'Ana Buton', true)}
        </div>

        {/* Secondary Button */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">İkincil Buton</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Metin</label>
              <input
                type="text"
                value={content.secondaryButton || ''}
                onChange={(e) => updateField('secondaryButton', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
              <input
                type="text"
                value={content.secondaryButtonLink || ''}
                onChange={(e) => updateField('secondaryButtonLink', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
          {isEditing && renderStyleEditor('secondaryButton', 'İkincil Buton', false, true)}
        </div>

        {/* Images Section - Enterprise Grade */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal">🖼️ Görseller</label>
              <p className="text-xs text-gray-500 mt-1">Über Uns bölümünde gösterilen 4 görsel • Max 5MB • JPG, PNG, WebP, GIF</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-sage-200 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="w-8 h-8 bg-sage-100 text-sage-700 rounded-full flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-charcoal">Görsel {index + 1}</span>
                  </div>
                  {/* Upload Status Badge */}
                  {content.images?.[index]?.url && (
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      content.images[index].url.startsWith('/uploads/')
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {content.images[index].url.startsWith('/uploads/') ? '📁 Yüklendi' : '🔗 Harici'}
                    </span>
                  )}
                </div>

                {/* Image Preview with Actions */}
                <div className="mb-3 relative group">
                  {content.images?.[index]?.url ? (
                    <>
                      <img
                        src={content.images[index].url}
                        alt={content.images[index]?.alt || `Görsel ${index + 1}`}
                        className="w-full h-36 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Görsel+Yüklenemedi'
                        }}
                      />
                      {/* Overlay Actions */}
                      {isEditing && (
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                          {/* Upload New */}
                          <label className="cursor-pointer bg-white hover:bg-gray-100 text-charcoal p-2 rounded-lg transition-colors">
                            <input
                              type="file"
                              accept="image/jpeg,image/png,image/webp,image/gif"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(index, file)
                              }}
                              disabled={uploadingImage === index}
                            />
                            {uploadingImage === index ? (
                              <div className="animate-spin h-5 w-5 border-2 border-sage-500 border-t-transparent rounded-full"></div>
                            ) : (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            )}
                          </label>
                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleImageDelete(index)}
                            disabled={deletingImage === index}
                            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                          >
                            {deletingImage === index ? (
                              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                            ) : (
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Empty State - Upload Zone */
                    <label className={`w-full h-36 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                      isEditing
                        ? 'border-sage-300 hover:border-sage-500 hover:bg-sage-50'
                        : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                    }`}>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(index, file)
                        }}
                        disabled={!isEditing || uploadingImage === index}
                      />
                      {uploadingImage === index ? (
                        <div className="flex flex-col items-center">
                          <div className="animate-spin h-8 w-8 border-3 border-sage-500 border-t-transparent rounded-full mb-2"></div>
                          <span className="text-xs text-sage-600">Yükleniyor...</span>
                        </div>
                      ) : (
                        <>
                          <svg className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                          <span className="text-xs text-gray-500">
                            {isEditing ? 'Görsel yükle' : 'Görsel yok'}
                          </span>
                        </>
                      )}
                    </label>
                  )}
                </div>

                {/* URL Input & Alt Text */}
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Görsel URL
                      {isEditing && (
                        <span className="text-gray-400 font-normal ml-1">(veya yukarıdan yükleyin)</span>
                      )}
                    </label>
                    <input
                      type="text"
                      value={content.images?.[index]?.url || ''}
                      onChange={(e) => updateImageField(index, 'url', e.target.value)}
                      disabled={!isEditing}
                      placeholder="https://..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Alt Metin (SEO)</label>
                    <input
                      type="text"
                      value={content.images?.[index]?.alt || ''}
                      onChange={(e) => updateImageField(index, 'alt', e.target.value)}
                      disabled={!isEditing}
                      placeholder="Görsel açıklaması..."
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Contact Section Editor - Ana sayfadaki İletişim bölümü için
  const renderContactSectionEditor = (section: ContentSection) => {
    const content = isEditing ? editingContent : section.content
    return (
      <div className="space-y-6">
        {/* Reset All Button */}
        {isEditing && currentDefaults && (
          <div className="flex justify-end pb-4 border-b border-gray-200">
            <button
              type="button"
              onClick={resetAllToDefaults}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sage-600 hover:text-sage-700 bg-sage-50 hover:bg-sage-100 rounded-lg transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Orijinale Dön
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="bg-sage-50 border border-sage-200 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-charcoal mb-2">📍 Contact Section Stilleri</h3>
          <p className="text-sm text-gray-600">Ana sayfadaki İletişim bölümünün içerik ve görsel ayarları</p>
        </div>

        {/* Badge */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Badge Metni</label>
          <input
            type="text"
            value={content.badge || ''}
            onChange={(e) => updateField('badge', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('badge', 'Badge', true)}
        </div>

        {/* Section Title */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Bölüm Başlığı</label>
          <input
            type="text"
            value={content.sectionTitle || ''}
            onChange={(e) => updateField('sectionTitle', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('sectionTitle', 'Bölüm Başlığı')}
        </div>

        {/* Highlighted Text */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Vurgulanan Metin</label>
          <input
            type="text"
            value={content.highlightedText || ''}
            onChange={(e) => updateField('highlightedText', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('highlightedText', 'Vurgulanan Metin')}
        </div>

        {/* Description */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">Açıklama</label>
          <textarea
            rows={3}
            value={content.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('description', 'Açıklama')}
        </div>

        {/* Cards Section */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h4 className="text-md font-semibold text-charcoal mb-4">📇 Kart İçerikleri</h4>

          {/* Phone Card */}
          <div className="p-3 bg-gray-50 rounded-lg mb-3">
            <h5 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center text-white text-xs">📞</span>
              Telefon Kartı
            </h5>

            {/* Phone Title */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500">Başlık</label>
                {isEditing && isNestedContentChanged('cards.phone.title') && (
                  <button
                    type="button"
                    onClick={() => resetNestedContentToDefault('cards.phone.title')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={content.cards?.phone?.title || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  cards: { ...prev.cards, phone: { ...prev.cards?.phone, title: e.target.value } }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
              />
              {isEditing && renderStyleEditor('phoneCardTitle', 'Telefon Başlık Stili')}
            </div>

            {/* Phone Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500">Açıklama</label>
                {isEditing && isNestedContentChanged('cards.phone.description') && (
                  <button
                    type="button"
                    onClick={() => resetNestedContentToDefault('cards.phone.description')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={content.cards?.phone?.description || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  cards: { ...prev.cards, phone: { ...prev.cards?.phone, description: e.target.value } }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
              />
              {isEditing && renderStyleEditor('phoneCardDescription', 'Telefon Açıklama Stili')}
            </div>

            {/* Phone Icon Style */}
            {isEditing && renderIconStyleEditor('phoneCardIcon', 'Telefon İkon Renkleri')}
          </div>

          {/* WhatsApp Card */}
          <div className="p-3 bg-gray-50 rounded-lg mb-3">
            <h5 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">💬</span>
              WhatsApp Kartı
            </h5>

            {/* WhatsApp Title */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500">Başlık</label>
                {isEditing && isNestedContentChanged('cards.whatsapp.title') && (
                  <button
                    type="button"
                    onClick={() => resetNestedContentToDefault('cards.whatsapp.title')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={content.cards?.whatsapp?.title || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  cards: { ...prev.cards, whatsapp: { ...prev.cards?.whatsapp, title: e.target.value } }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
              />
              {isEditing && renderStyleEditor('whatsappCardTitle', 'WhatsApp Başlık Stili')}
            </div>

            {/* WhatsApp Description */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500">Açıklama</label>
                {isEditing && isNestedContentChanged('cards.whatsapp.description') && (
                  <button
                    type="button"
                    onClick={() => resetNestedContentToDefault('cards.whatsapp.description')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={content.cards?.whatsapp?.description || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  cards: { ...prev.cards, whatsapp: { ...prev.cards?.whatsapp, description: e.target.value } }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
              />
              {isEditing && renderStyleEditor('whatsappCardDescription', 'WhatsApp Açıklama Stili')}
            </div>

            {/* WhatsApp Link Text */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500">Link Metni</label>
                {isEditing && isNestedContentChanged('cards.whatsapp.linkText') && (
                  <button
                    type="button"
                    onClick={() => resetNestedContentToDefault('cards.whatsapp.linkText')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={content.cards?.whatsapp?.linkText || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  cards: { ...prev.cards, whatsapp: { ...prev.cards?.whatsapp, linkText: e.target.value } }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
              />
              {isEditing && renderStyleEditor('whatsappCardLink', 'WhatsApp Link Stili')}
            </div>

            {/* WhatsApp Icon Style */}
            {isEditing && renderIconStyleEditor('whatsappCardIcon', 'WhatsApp İkon Renkleri')}
          </div>

          {/* Email Card */}
          <div className="p-3 bg-gray-50 rounded-lg mb-3">
            <h5 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✉️</span>
              E-Mail Kartı
            </h5>

            {/* Email Title */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500">Başlık</label>
                {isEditing && isNestedContentChanged('cards.email.title') && (
                  <button
                    type="button"
                    onClick={() => resetNestedContentToDefault('cards.email.title')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={content.cards?.email?.title || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  cards: { ...prev.cards, email: { ...prev.cards?.email, title: e.target.value } }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
              />
              {isEditing && renderStyleEditor('emailCardTitle', 'E-Mail Başlık Stili')}
            </div>

            {/* Email Description */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500">Açıklama</label>
                {isEditing && isNestedContentChanged('cards.email.description') && (
                  <button
                    type="button"
                    onClick={() => resetNestedContentToDefault('cards.email.description')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={content.cards?.email?.description || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  cards: { ...prev.cards, email: { ...prev.cards?.email, description: e.target.value } }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
              />
              {isEditing && renderStyleEditor('emailCardDescription', 'E-Mail Açıklama Stili')}
            </div>

            {/* Email Icon Style */}
            {isEditing && renderIconStyleEditor('emailCardIcon', 'E-Mail İkon Renkleri')}
          </div>
        </div>

        {/* Map Section */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h4 className="text-md font-semibold text-charcoal mb-4">🗺️ Harita Bölümü</h4>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-500">Harita Butonu Metni</label>
            {isEditing && isNestedContentChanged('map.buttonText') && (
              <button
                type="button"
                onClick={() => resetNestedContentToDefault('map.buttonText')}
                className="text-amber-500 hover:text-amber-600 transition-colors"
                title="Orijinale Dön"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            )}
          </div>
          <input
            type="text"
            value={content.map?.buttonText || ''}
            onChange={(e) => setEditingContent((prev: any) => ({
              ...prev,
              map: { ...prev.map, buttonText: e.target.value }
            }))}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
          />
          {isEditing && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {renderStyleEditor('mapTitle', 'Harita Başlığı')}
              {renderStyleEditor('mapAddress', 'Harita Adresi')}
              {renderStyleEditor('mapButton', 'Harita Butonu', true)}
            </div>
          )}
        </div>

        {/* Opening Hours Section */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h4 className="text-md font-semibold text-charcoal mb-4">🕐 Açılış Saatleri Bölümü</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500">Başlık</label>
                {isEditing && isNestedContentChanged('openingHours.title') && (
                  <button
                    type="button"
                    onClick={() => resetNestedContentToDefault('openingHours.title')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={content.openingHours?.title || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  openingHours: { ...prev.openingHours, title: e.target.value }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500">"Bugün" Etiketi</label>
                {isEditing && isNestedContentChanged('openingHours.todayLabel') && (
                  <button
                    type="button"
                    onClick={() => resetNestedContentToDefault('openingHours.todayLabel')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={content.openingHours?.todayLabel || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  openingHours: { ...prev.openingHours, todayLabel: e.target.value }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-500">"Kapalı" Etiketi</label>
                {isEditing && isNestedContentChanged('openingHours.closedLabel') && (
                  <button
                    type="button"
                    onClick={() => resetNestedContentToDefault('openingHours.closedLabel')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <input
                type="text"
                value={content.openingHours?.closedLabel || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  openingHours: { ...prev.openingHours, closedLabel: e.target.value }
                }))}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
              />
            </div>
          </div>
          {isEditing && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              {renderStyleEditor('openingHoursTitle', 'Açılış Saatleri Başlığı')}
              {renderStyleEditor('dayLabel', 'Gün Etiketi')}
              {renderStyleEditor('timeLabel', 'Saat Etiketi')}
              {renderStyleEditor('todayBadge', 'Bugün Badge', true)}
              {renderStyleEditor('todayHighlight', 'Bugün Vurgusu', true)}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderContactEditor = (section: ContentSection) => {
    const content = isEditing ? editingContent : section.content
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">İşletme Adı</label>
            <input
              type="text"
              value={content.businessName || ''}
              onChange={(e) => updateField('businessName', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Telefon</label>
            <input
              type="text"
              value={content.phone || ''}
              onChange={(e) => updateField('phone', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">E-Mail</label>
          <input
            type="email"
            value={content.email || ''}
            onChange={(e) => updateField('email', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div>
          <h3 className="text-lg font-semibold text-charcoal mb-4">Adres Bilgileri</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Sokak</label>
              <input
                type="text"
                value={content.address?.street || ''}
                onChange={(e) => updateNestedField('address', 'street', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Şehir</label>
              <input
                type="text"
                value={content.address?.city || ''}
                onChange={(e) => updateNestedField('address', 'city', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Posta Kodu</label>
              <input
                type="text"
                value={content.address?.postalCode || ''}
                onChange={(e) => updateNestedField('address', 'postalCode', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Ülke</label>
              <input
                type="text"
                value={content.address?.country || ''}
                onChange={(e) => updateNestedField('address', 'country', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderFooterEditor = (section: ContentSection) => {
    const content = isEditing ? editingContent : section.content

    // Helper to update nested newsletter field
    const updateNewsletterField = (field: string, value: any) => {
      setEditingContent((prev: any) => ({
        ...prev,
        newsletter: {
          ...prev.newsletter,
          [field]: value
        }
      }))
    }

    // Helper to update quick links
    const updateQuickLink = (index: number, field: string, value: string) => {
      setEditingContent((prev: any) => {
        const links = [...(prev.quickLinks || [])]
        if (!links[index]) links[index] = { label: '', href: '' }
        links[index][field] = value
        return { ...prev, quickLinks: links }
      })
    }

    // Helper to update legal links
    const updateLegalLink = (index: number, field: string, value: string) => {
      setEditingContent((prev: any) => {
        const links = [...(prev.legalLinks || [])]
        if (!links[index]) links[index] = { label: '', href: '' }
        links[index][field] = value
        return { ...prev, legalLinks: links }
      })
    }

    return (
      <div className="space-y-6">
        {/* Reset All Button */}
        {isEditing && currentDefaults && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                if (confirm('Tüm footer içeriği ve stilleri varsayılana döndürülecek. Devam etmek istiyor musunuz?')) {
                  setEditingContent({ ...currentDefaults })
                  setSaveMessage({ type: 'success', text: 'Tümü varsayılana sıfırlandı' })
                  setTimeout(() => setSaveMessage(null), 2000)
                }
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tümünü Orijinale Dön
            </button>
          </div>
        )}

        {/* Brand Section */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            🏷️ Marka Bilgileri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Marka Emojisi</label>
              <input
                type="text"
                value={content.brandEmoji || '🌿'}
                onChange={(e) => updateField('brandEmoji', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50 text-2xl text-center"
                maxLength={4}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-2">Marka Adı</label>
              <input
                type="text"
                value={content.brandName || ''}
                onChange={(e) => updateField('brandName', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
          {isEditing && renderStyleEditor('brandName', 'Marka Adı Stili')}
        </div>

        {/* Description */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">📝 Footer Açıklaması</label>
          <textarea
            rows={3}
            value={content.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('description', 'Açıklama Stili')}
        </div>

        {/* Social Media */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            📱 Sosyal Medya Linkleri
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs">📷</span>
                Instagram
              </label>
              <input
                type="url"
                value={content.socialMedia?.instagram || ''}
                onChange={(e) => updateNestedField('socialMedia', 'instagram', e.target.value)}
                disabled={!isEditing}
                placeholder="https://instagram.com/..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">f</span>
                Facebook
              </label>
              <input
                type="url"
                value={content.socialMedia?.facebook || ''}
                onChange={(e) => updateNestedField('socialMedia', 'facebook', e.target.value)}
                disabled={!isEditing}
                placeholder="https://facebook.com/..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
                <span className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center text-white text-xs">💬</span>
                WhatsApp
              </label>
              <input
                type="url"
                value={content.socialMedia?.whatsapp || ''}
                onChange={(e) => updateNestedField('socialMedia', 'whatsapp', e.target.value)}
                disabled={!isEditing}
                placeholder="https://wa.me/..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Newsletter Settings */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
              📧 Newsletter Bölümü
            </h3>
            {isEditing && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.newsletter?.enabled !== false}
                  onChange={(e) => updateNewsletterField('enabled', e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-sage-500 focus:ring-sage-500"
                />
                <span className="text-sm text-gray-600">Aktif</span>
              </label>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Başlık</label>
              <input
                type="text"
                value={content.newsletter?.title || ''}
                onChange={(e) => updateNewsletterField('title', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Buton Metni</label>
              <input
                type="text"
                value={content.newsletter?.buttonText || ''}
                onChange={(e) => updateNewsletterField('buttonText', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-charcoal mb-2">Alt Yazı</label>
              <textarea
                rows={2}
                value={content.newsletter?.subtitle || ''}
                onChange={(e) => updateNewsletterField('subtitle', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Placeholder</label>
              <input
                type="text"
                value={content.newsletter?.placeholder || ''}
                onChange={(e) => updateNewsletterField('placeholder', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Uyarı Metni</label>
              <input
                type="text"
                value={content.newsletter?.disclaimer || ''}
                onChange={(e) => updateNewsletterField('disclaimer', e.target.value)}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
          {isEditing && renderStyleEditor('newsletterTitle', 'Newsletter Başlık Stili')}
        </div>

        {/* Quick Links */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            🔗 Navigasyon Linkleri
          </h3>
          <div className="space-y-3">
            {(content.quickLinks || []).map((link: any, index: number) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={link.label || ''}
                  onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Link Metni"
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                />
                <input
                  type="text"
                  value={link.href || ''}
                  onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                  disabled={!isEditing}
                  placeholder="#section veya /sayfa"
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50 font-mono text-sm"
                />
              </div>
            ))}
          </div>
          {isEditing && renderStyleEditor('link', 'Link Stili')}
        </div>

        {/* Legal Links */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            ⚖️ Yasal Linkler
          </h3>
          <div className="space-y-3">
            {(content.legalLinks || []).map((link: any, index: number) => (
              <div key={index} className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  value={link.label || ''}
                  onChange={(e) => updateLegalLink(index, 'label', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Link Metni"
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                />
                <input
                  type="text"
                  value={link.href || ''}
                  onChange={(e) => updateLegalLink(index, 'href', e.target.value)}
                  disabled={!isEditing}
                  placeholder="/sayfa-adi"
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50 font-mono text-sm"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <label className="block text-sm font-semibold text-charcoal mb-2">©️ Copyright Metni</label>
          <input
            type="text"
            value={content.copyright || ''}
            onChange={(e) => updateField('copyright', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('copyright', 'Copyright Stili')}
        </div>

        {/* Section Title Style */}
        {isEditing && (
          <div className="p-4 bg-white rounded-xl border border-gray-200">
            <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
              🎨 Bölüm Başlıkları Stili
              <span className="text-xs font-normal text-gray-500">(Navigation, Leistungen, Kontakt)</span>
            </h3>
            {renderStyleEditor('sectionTitle', 'Bölüm Başlığı')}
          </div>
        )}
      </div>
    )
  }

  const renderMetaEditor = (section: ContentSection) => {
    const content = isEditing ? editingContent : section.content
    return (
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Site Başlığı</label>
          <input
            type="text"
            value={content.siteTitle || ''}
            onChange={(e) => updateField('siteTitle', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Site Açıklaması</label>
          <textarea
            rows={3}
            value={content.siteDescription || ''}
            onChange={(e) => updateField('siteDescription', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Anahtar Kelimeler (virgülle ayırın)</label>
          <input
            type="text"
            value={content.keywords || ''}
            onChange={(e) => updateField('keywords', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>
      </div>
    )
  }

  // Testimonials Section Editor
  const renderTestimonialsSectionEditor = (section: ContentSection) => {
    const content = isEditing ? editingContent : section.content
    return (
      <div className="space-y-6">
        {/* Reset All Button */}
        {isEditing && currentDefaults && (
          <div className="flex justify-end pb-4 border-b border-gray-200">
            <button
              type="button"
              onClick={resetAllToDefaults}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Tümünü Orijinale Dön
            </button>
          </div>
        )}

        {/* Section Header */}
        <div className="p-4 bg-sage-50 rounded-xl border border-sage-200">
          <h3 className="text-lg font-semibold text-charcoal mb-4">📝 Bölüm Başlığı</h3>

          {/* Badge */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-charcoal mb-2">Badge Metni</label>
            <input
              type="text"
              value={content.badge || ''}
              onChange={(e) => updateField('badge', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
            {isEditing && renderStyleEditor('badge', 'Badge Stili', true)}
          </div>

          {/* Section Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-charcoal mb-2">Ana Başlık</label>
            <input
              type="text"
              value={content.sectionTitle || ''}
              onChange={(e) => updateField('sectionTitle', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
            {isEditing && renderStyleEditor('sectionTitle', 'Başlık Stili')}
          </div>

          {/* Highlighted Text */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-charcoal mb-2">Vurgulanan Metin</label>
            <input
              type="text"
              value={content.highlightedText || ''}
              onChange={(e) => updateField('highlightedText', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
            {isEditing && renderStyleEditor('highlightedText', 'Vurgulanan Metin Stili')}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Açıklama</label>
            <textarea
              rows={3}
              value={content.description || ''}
              onChange={(e) => updateField('description', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
            {isEditing && renderStyleEditor('description', 'Açıklama Stili')}
          </div>
        </div>

        {/* Slider Settings */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <h3 className="text-lg font-semibold text-charcoal mb-4">⚙️ Slider Ayarları</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Otomatik Geçiş Süresi (ms)</label>
              <input
                type="number"
                value={content.autoSlideDelay || 5000}
                onChange={(e) => updateField('autoSlideDelay', parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">Maksimum Gösterim Sayısı</label>
              <input
                type="number"
                value={content.maxDisplayCount || 5}
                onChange={(e) => updateField('maxDisplayCount', parseInt(e.target.value))}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
              />
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-charcoal">📊 İstatistikler</h3>
            {isEditing && currentDefaults?.stats && (
              <button
                type="button"
                onClick={() => {
                  updateField('stats', currentDefaults.stats)
                  if (currentDefaults.styles?.statsValue) {
                    updateNestedField('styles', 'statsValue', currentDefaults.styles.statsValue)
                  }
                  if (currentDefaults.styles?.statsLabel) {
                    updateNestedField('styles', 'statsLabel', currentDefaults.styles.statsLabel)
                  }
                }}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 bg-white hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Orijinale Dön
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(content.stats || []).map((stat: any, index: number) => (
              <div key={index} className="p-4 bg-white rounded-xl border border-amber-100">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-semibold text-sm">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-charcoal">İstatistik {index + 1}</span>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Değer</label>
                    <input
                      type="text"
                      value={stat.value || ''}
                      onChange={(e) => {
                        const newStats = [...(content.stats || [])]
                        newStats[index] = { ...newStats[index], value: e.target.value }
                        updateField('stats', newStats)
                      }}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="500+"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Açıklama</label>
                    <input
                      type="text"
                      value={stat.label || ''}
                      onChange={(e) => {
                        const newStats = [...(content.stats || [])]
                        newStats[index] = { ...newStats[index], label: e.target.value }
                        updateField('stats', newStats)
                      }}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                      placeholder="Zufriedene Kunden"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats Style Editors */}
          {isEditing && (
            <div className="mt-4 pt-4 border-t border-amber-200">
              {renderStyleEditor('statsValue', 'İstatistik Değer Stili')}
              {renderStyleEditor('statsLabel', 'İstatistik Açıklama Stili')}
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderEditor = () => {
    const section = getCurrentSection()
    if (!section) return null

    switch (activeTab) {
      case 'landing-hero':
        return renderLandingHeroEditor(section)
      case 'hero':
        return renderHeroEditor(section)
      case 'services-section':
        return renderServicesSectionEditor(section)
      case 'about':
        return renderAboutEditor(section)
      case 'contact-section':
        return renderContactSectionEditor(section)
      case 'contact':
        return renderContactEditor(section)
      case 'footer':
        return renderFooterEditor(section)
      case 'meta':
        return renderMetaEditor(section)
      case 'testimonials-section':
        return renderTestimonialsSectionEditor(section)
      default:
        return null
    }
  }

  const renderPreview = () => {
    const section = getCurrentSection()
    if (!section) return null

    const content = section.content

    switch (activeTab) {
      case 'landing-hero':
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">Badge:</span><span className="font-medium">{content.badge}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">MainTitle:</span><span className="font-medium">{content.mainTitle}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Highlighted:</span><span className="font-medium text-sage-500">{content.highlightedText}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Description:</span><span className="font-medium text-right max-w-md">{content.description}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">PrimaryButton:</span><span className="font-medium">{content.primaryButton}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">SecondaryButton:</span><span className="font-medium">{content.secondaryButton}</span></div>
          </div>
        )
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">MainTitle:</span><span className="font-medium">{content.mainTitle}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Subtitle:</span><span className="font-medium text-right max-w-md">{content.subtitle}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">PrimaryButton:</span><span className="font-medium">{content.primaryButton}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">SecondaryButton:</span><span className="font-medium">{content.secondaryButton}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">TrustIndicator:</span><span className="font-medium">{content.trustIndicator}</span></div>
          </div>
        )
      case 'services-section':
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">Badge:</span><span className="font-medium">{content.badge}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Başlık:</span><span className="font-medium">{content.sectionTitle} <span className="text-sage-500">{content.highlightedText}</span></span></div>
            <div className="flex justify-between"><span className="text-gray-500">Açıklama:</span><span className="font-medium text-right max-w-md">{content.description}</span></div>
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-semibold text-charcoal mb-2">CTA Bölümü:</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">CTA Başlık:</span> {content.cta?.title}</div>
                <div><span className="text-gray-500">CTA Açıklama:</span> {content.cta?.description}</div>
              </div>
            </div>
          </div>
        )
      case 'contact-section':
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">Badge:</span><span className="font-medium">{content.badge}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Başlık:</span><span className="font-medium">{content.sectionTitle} <span className="text-sage-500">{content.highlightedText}</span>?</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Açıklama:</span><span className="font-medium text-right max-w-md">{content.description}</span></div>
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-semibold text-charcoal mb-2">Kartlar:</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div><span className="text-gray-500">Telefon:</span> {content.cards?.phone?.title}</div>
                <div><span className="text-gray-500">WhatsApp:</span> {content.cards?.whatsapp?.title}</div>
                <div><span className="text-gray-500">E-Mail:</span> {content.cards?.email?.title}</div>
              </div>
            </div>
          </div>
        )
      case 'testimonials-section':
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">Badge:</span><span className="font-medium">{content.badge}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Başlık:</span><span className="font-medium">{content.sectionTitle} <span className="text-sage-500">{content.highlightedText}</span></span></div>
            <div className="flex justify-between"><span className="text-gray-500">Açıklama:</span><span className="font-medium text-right max-w-md">{content.description}</span></div>
            <div className="border-t pt-4 mt-4">
              <h4 className="text-sm font-semibold text-charcoal mb-2">Slider Ayarları:</h4>
              <div className="space-y-2 text-sm">
                <div><span className="text-gray-500">Otomatik Geçiş:</span> {content.autoSlideDelay}ms</div>
                <div><span className="text-gray-500">Max Gösterim:</span> {content.maxDisplayCount}</div>
              </div>
            </div>
          </div>
        )
      default:
        return (
          <pre className="text-sm bg-gray-50 p-4 rounded-xl overflow-auto max-h-64">
            {JSON.stringify(content, null, 2)}
          </pre>
        )
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    )
  }

  const currentSection = getCurrentSection()

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/admin/dashboard" className="text-sage-600 hover:text-forest-600 mr-4">
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <h1 className="text-2xl font-bold text-charcoal">İçerik Yönetimi</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Save Message */}
        {saveMessage && (
          <div className={`mb-6 p-4 rounded-xl ${saveMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {saveMessage.text}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-soft p-4">
              <h2 className="text-lg font-semibold text-charcoal mb-4">İçerik Bölümleri</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      if (isEditing) {
                        if (confirm('Kaydedilmemiş değişiklikler var. Devam etmek istiyor musunuz?')) {
                          cancelEditing()
                          setActiveTab(tab.id)
                        }
                      } else {
                        setActiveTab(tab.id)
                      }
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === tab.id
                        ? 'bg-sage-100 text-sage-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              {currentSection && (
                <>
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-charcoal">{currentSection.title}</h2>
                      <p className="text-gray-500 text-sm">{currentSection.description}</p>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      <div>Son güncelleme</div>
                      <div className="font-medium">{new Date(currentSection.lastUpdated).toLocaleDateString('de-DE')}</div>
                      <div>von {currentSection.updatedBy}</div>
                    </div>
                  </div>

                  {!isEditing && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                      <h3 className="text-lg font-semibold text-charcoal mb-4">Önizleme</h3>
                      {renderPreview()}
                    </div>
                  )}

                  {isEditing && renderEditor()}

                  <div className="flex gap-4 mt-6">
                    {!isEditing ? (
                      <button
                        onClick={startEditing}
                        className="flex items-center gap-2 bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-xl font-medium transition-all"
                      >
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Düzenle
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="flex items-center gap-2 bg-sage-500 hover:bg-forest-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-medium transition-all"
                        >
                          {isSaving ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                              Kaydediliyor...
                            </>
                          ) : (
                            <>
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Kaydet
                            </>
                          )}
                        </button>
                        <button
                          onClick={cancelEditing}
                          className="px-6 py-3 border border-gray-200 rounded-xl font-medium text-gray-600 hover:bg-gray-50 transition-all"
                        >
                          İptal
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
