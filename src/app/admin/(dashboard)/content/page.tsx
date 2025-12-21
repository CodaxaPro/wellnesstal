'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Import types and constants
import { ContentSection } from './components/types'
import { contentTabs } from './components/constants'

// Import editor components
import {
  HeaderEditor,
  LandingHeroEditor,
  HeroEditor,
  ServicesSectionEditor,
  AboutEditor,
  ContactSectionEditor,
  ContactEditor,
  FooterEditor,
  MetaEditor,
  TestimonialsEditor
} from './components/editors'

export default function ContentManagement() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('header')
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

  const isStylePropertyChanged = (fieldName: string, propertyName: string) => {
    if (!currentDefaults?.styles?.[fieldName]) return false
    const currentValue = editingContent?.styles?.[fieldName]?.[propertyName]
    const defaultValue = currentDefaults.styles[fieldName][propertyName]
    return currentValue !== undefined && currentValue !== defaultValue
  }

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

  const resetNestedContentToDefault = (path: string) => {
    if (!currentDefaults) return
    const pathParts = path.split('.')
    let defaultValue: any = currentDefaults
    for (const part of pathParts) {
      defaultValue = defaultValue?.[part]
    }
    if (defaultValue === undefined) return
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
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: section.id,
          section: section.section,
          content: editingContent
        })
      })
      const data = await response.json()
      if (data.success) {
        await fetchContent()
        setIsEditing(false)
        setEditingContent(null)
        setSaveMessage({ type: 'success', text: 'İçerik başarıyla kaydedildi!' })
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
    setEditingContent((prev: any) => ({ ...prev, [field]: value }))
  }

  const updateNestedField = (parent: string, field: string, value: any) => {
    setEditingContent((prev: any) => {
      const currentParent = prev[parent] || {}
      return { ...prev, [parent]: { ...currentParent, [field]: value } }
    })
  }

  // Image upload handlers
  const handleImageUpload = async (index: number, file: File) => {
    setUploadingImage(index)
    setSaveMessage(null)
    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'about')
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      const data = await response.json()
      if (data.success) {
        setEditingContent((prev: any) => {
          const images = [...(prev.images || [])]
          if (!images[index]) images[index] = { url: '', alt: '' }
          images[index] = { ...images[index], url: data.data.url }
          return { ...prev, images }
        })
        setSaveMessage({ type: 'success', text: `Görsel ${index + 1} başarıyla yüklendi!` })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Yükleme başarısız' })
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Yükleme sırasında bir hata oluştu' })
    } finally {
      setUploadingImage(null)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleImageDelete = async (index: number) => {
    const imageUrl = editingContent?.images?.[index]?.url
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      setEditingContent((prev: any) => {
        const images = [...(prev.images || [])]
        if (images[index]) images[index] = { url: '', alt: images[index]?.alt || '' }
        return { ...prev, images }
      })
      setSaveMessage({ type: 'success', text: `Görsel ${index + 1} kaldırıldı` })
      setTimeout(() => setSaveMessage(null), 2000)
      return
    }
    if (!confirm(`Görsel ${index + 1} silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?`)) return
    setDeletingImage(index)
    setSaveMessage(null)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setEditingContent((prev: any) => {
          const images = [...(prev.images || [])]
          if (images[index]) images[index] = { url: '', alt: images[index]?.alt || '' }
          return { ...prev, images }
        })
        setSaveMessage({ type: 'success', text: `Görsel ${index + 1} başarıyla silindi!` })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Silme başarısız' })
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Silme sırasında bir hata oluştu' })
    } finally {
      setDeletingImage(null)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleHeroImageUpload = async (file: File) => {
    setUploadingHeroImage(true)
    setSaveMessage(null)
    try {
      const token = localStorage.getItem('adminToken')
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'hero')
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      })
      const data = await response.json()
      if (data.success) {
        setEditingContent((prev: any) => ({ ...prev, image: { ...prev.image, url: data.data.url } }))
        setSaveMessage({ type: 'success', text: 'Hero görseli başarıyla yüklendi!' })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Yükleme başarısız' })
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Yükleme sırasında bir hata oluştu' })
    } finally {
      setUploadingHeroImage(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleHeroImageDelete = async () => {
    const imageUrl = editingContent?.image?.url
    if (!imageUrl || !imageUrl.startsWith('/uploads/')) {
      setEditingContent((prev: any) => ({ ...prev, image: { ...prev.image, url: '' } }))
      setSaveMessage({ type: 'success', text: 'Hero görseli kaldırıldı' })
      setTimeout(() => setSaveMessage(null), 2000)
      return
    }
    if (!confirm('Hero görseli silinecek. Bu işlem geri alınamaz. Devam etmek istiyor musunuz?')) return
    setDeletingHeroImage(true)
    setSaveMessage(null)
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/upload?url=${encodeURIComponent(imageUrl)}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await response.json()
      if (data.success) {
        setEditingContent((prev: any) => ({ ...prev, image: { ...prev.image, url: '' } }))
        setSaveMessage({ type: 'success', text: 'Hero görseli başarıyla silindi!' })
      } else {
        setSaveMessage({ type: 'error', text: data.error || 'Silme başarısız' })
      }
    } catch (error) {
      setSaveMessage({ type: 'error', text: 'Silme sırasında bir hata oluştu' })
    } finally {
      setDeletingHeroImage(false)
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  // Common props for all editors
  const commonEditorProps = {
    isEditing,
    editingContent,
    currentDefaults,
    expandedStyleFields,
    toggleStyleField,
    updateStyleField,
    resetFieldToDefault,
    resetStylePropertyToDefault,
    isStylePropertyChanged,
    resetAllToDefaults,
    updateField
  }

  const renderEditor = () => {
    const section = getCurrentSection()
    if (!section) return null

    switch (activeTab) {
      case 'header':
        return (
          <HeaderEditor
            section={section}
            {...commonEditorProps}
            setEditingContent={setEditingContent}
          />
        )
      case 'landing-hero':
        return <LandingHeroEditor section={section} {...commonEditorProps} />
      case 'hero':
        return (
          <HeroEditor
            section={section}
            {...commonEditorProps}
            setEditingContent={setEditingContent}
            uploadingHeroImage={uploadingHeroImage}
            deletingHeroImage={deletingHeroImage}
            handleHeroImageUpload={handleHeroImageUpload}
            handleHeroImageDelete={handleHeroImageDelete}
            setSaveMessage={setSaveMessage}
          />
        )
      case 'services-section':
        return (
          <ServicesSectionEditor
            section={section}
            {...commonEditorProps}
            updateNestedField={updateNestedField}
          />
        )
      case 'about':
        return (
          <AboutEditor
            section={section}
            {...commonEditorProps}
            setEditingContent={setEditingContent}
            uploadingImage={uploadingImage}
            deletingImage={deletingImage}
            handleImageUpload={handleImageUpload}
            handleImageDelete={handleImageDelete}
          />
        )
      case 'contact-section':
        return (
          <ContactSectionEditor
            section={section}
            {...commonEditorProps}
            setEditingContent={setEditingContent}
            isNestedContentChanged={isNestedContentChanged}
            resetNestedContentToDefault={resetNestedContentToDefault}
          />
        )
      case 'contact':
        return (
          <ContactEditor
            section={section}
            isEditing={isEditing}
            editingContent={editingContent}
            updateField={updateField}
            updateNestedField={updateNestedField}
          />
        )
      case 'footer':
        return (
          <FooterEditor
            section={section}
            {...commonEditorProps}
            setEditingContent={setEditingContent}
            updateNestedField={updateNestedField}
            setSaveMessage={setSaveMessage}
          />
        )
      case 'meta':
        return (
          <MetaEditor
            section={section}
            isEditing={isEditing}
            editingContent={editingContent}
            updateField={updateField}
          />
        )
      case 'testimonials-section':
        return (
          <TestimonialsEditor
            section={section}
            {...commonEditorProps}
            updateNestedField={updateNestedField}
          />
        )
      default:
        return null
    }
  }

  const renderPreview = () => {
    const section = getCurrentSection()
    if (!section) return null
    const content = section.content

    switch (activeTab) {
      case 'header':
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">Logo:</span><span className="font-medium">{content.logoEmoji} {content.logoText}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Nav Links:</span><span className="font-medium">{content.navItems?.map((item: any) => item.label).join(' • ')}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">CTA:</span><span className="font-medium">{content.ctaButtonText}</span></div>
          </div>
        )
      case 'landing-hero':
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">Badge:</span><span className="font-medium">{content.badge}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">MainTitle:</span><span className="font-medium">{content.mainTitle}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Highlighted:</span><span className="font-medium text-sage-500">{content.highlightedText}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Description:</span><span className="font-medium text-right max-w-md">{content.description}</span></div>
          </div>
        )
      case 'hero':
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">MainTitle:</span><span className="font-medium">{content.mainTitle}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Subtitle:</span><span className="font-medium text-right max-w-md">{content.subtitle}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">TrustIndicator:</span><span className="font-medium">{content.trustIndicator}</span></div>
          </div>
        )
      case 'services-section':
      case 'testimonials-section':
        return (
          <div className="space-y-4">
            <div className="flex justify-between"><span className="text-gray-500">Badge:</span><span className="font-medium">{content.badge}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Başlık:</span><span className="font-medium">{content.sectionTitle} <span className="text-sage-500">{content.highlightedText}</span></span></div>
            <div className="flex justify-between"><span className="text-gray-500">Açıklama:</span><span className="font-medium text-right max-w-md">{content.description}</span></div>
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
                {contentTabs.map((tab) => (
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
