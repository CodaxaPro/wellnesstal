'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
  ContactSettings,
  ContactStyles,
  TextStyle,
  defaultContent,
  defaultStyles,
  tabs,
  BusinessTab,
  ContactTab,
  AddressTab,
  HoursTab,
  SocialTab,
  SeoTab,
  NotificationsTab,
  StylesTab
} from './components'

export default function ContactSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<ContactSettings>(defaultContent)
  const [defaults, setDefaults] = useState<ContactSettings>(defaultContent)

  const [activeTab, setActiveTab] = useState('business')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Style editor expansion states
  const [expandedStyleEditors, setExpandedStyleEditors] = useState<{[key: string]: boolean}>({})

  // Toggle style editor expansion
  const toggleStyleEditor = (key: string) => {
    setExpandedStyleEditors(prev => ({ ...prev, [key]: !prev[key] }))
  }

  // Fetch settings from API on load
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/content?section=contact-settings')
        const data = await response.json()
        if (data.success && data.data?.content) {
          // Deep merge with defaults
          const fetchedContent = data.data.content
          const mergedStyles = {
            ...defaultStyles,
            ...fetchedContent.styles
          }
          setSettings({
            ...defaultContent,
            ...fetchedContent,
            styles: mergedStyles
          })

          // Set defaults from API or use local defaults
          if (data.data.defaults) {
            setDefaults({
              ...defaultContent,
              ...data.data.defaults,
              styles: {
                ...defaultStyles,
                ...data.data.defaults.styles
              }
            })
          }
        }
      } catch (error) {
        console.error('Failed to fetch contact settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [router])

  const handleInputChange = (section: keyof ContactSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...(prev[section] as any),
        [field]: value
      }
    }))
    setHasChanges(true)
  }

  const handleOpeningHoursChange = (day: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: {
          ...prev.openingHours[day],
          [field]: value
        }
      }
    }))
    setHasChanges(true)
  }

  const handleKeywordChange = (keywords: string) => {
    const keywordArray = keywords.split(',').map(k => k.trim()).filter(k => k.length > 0)
    setSettings(prev => ({
      ...prev,
      seo: {
        ...prev.seo,
        keywords: keywordArray
      }
    }))
    setHasChanges(true)
  }

  // Update style field
  const updateStyleField = (styleKey: keyof ContactStyles, field: keyof TextStyle, value: string) => {
    setSettings(prev => ({
      ...prev,
      styles: {
        ...prev.styles,
        [styleKey]: {
          ...(prev.styles?.[styleKey] || {}),
          [field]: value
        }
      }
    }))
    setHasChanges(true)
  }

  // Reset all to defaults
  const handleResetAll = () => {
    if (confirm('Alle Einstellungen auf Original zurücksetzen?')) {
      setSettings(defaults)
      setHasChanges(true)
      setSaveMessage({ type: 'success', text: 'Auf Original zurückgesetzt. Bitte speichern.' })
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  // Reset styles to defaults
  const handleResetStyles = () => {
    if (confirm('Alle Design-Einstellungen auf Original zurücksetzen?')) {
      setSettings(prev => ({
        ...prev,
        styles: defaults.styles || defaultStyles
      }))
      setHasChanges(true)
      setSaveMessage({ type: 'success', text: 'Design auf Original zurückgesetzt. Bitte speichern.' })
      setTimeout(() => setSaveMessage(null), 3000)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const token = localStorage.getItem('adminToken')
      if (!token) {
        setSaveMessage({ type: 'error', text: 'Nicht autorisiert. Bitte erneut anmelden.' })
        router.push('/admin')
        return
      }

      // Save contact-settings to API
      const settingsResponse = await fetch('/api/content', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'contact-settings',
          content: settings
        })
      })

      if (!settingsResponse.ok) {
        throw new Error('Failed to save settings')
      }

      // Sync contact section for homepage
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'contact',
          content: {
            businessName: settings.businessInfo.name,
            phone: settings.contact.phone,
            email: settings.contact.email,
            address: {
              street: settings.address.street,
              city: settings.address.city,
              postalCode: settings.address.postalCode,
              country: settings.address.country
            },
            openingHours: settings.openingHours
          }
        })
      })

      // Sync footer section for homepage
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'footer',
          content: {
            description: settings.businessInfo.description,
            socialMedia: {
              instagram: settings.socialMedia.instagram,
              facebook: settings.socialMedia.facebook,
              whatsapp: settings.socialMedia.whatsapp
            },
            copyright: `© ${new Date().getFullYear()} ${settings.businessInfo.name}. Alle Rechte vorbehalten.`
          }
        })
      })

      // Sync meta/SEO section
      await fetch('/api/content', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'meta',
          content: {
            siteTitle: settings.seo.metaTitle,
            siteDescription: settings.seo.metaDescription,
            keywords: settings.seo.keywords.join(', '),
            ogImage: '/images/og-wellnesstal.jpg'
          }
        })
      })

      setHasChanges(false)
      setSaveMessage({ type: 'success', text: 'Einstellungen erfolgreich gespeichert!' })

      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(null), 3000)

    } catch (error: any) {
      console.error('Save error:', error)
      const errorMessage = error?.message || 'Fehler beim Speichern. Bitte versuchen Sie es erneut.'
      setSaveMessage({ type: 'error', text: errorMessage })
      
      // If unauthorized, redirect to login
      if (errorMessage.includes('Unauthorized') || errorMessage.includes('401')) {
        setTimeout(() => router.push('/admin'), 2000)
      }
    } finally {
      setIsSaving(false)
    }
  }

  // Common props for style editors
  const styleEditorProps = {
    expandedStyleEditors,
    toggleStyleEditor,
    updateStyleField
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'business':
        return (
          <BusinessTab
            settings={settings}
            handleInputChange={handleInputChange}
            {...styleEditorProps}
          />
        )
      case 'contact':
        return (
          <ContactTab
            settings={settings}
            handleInputChange={handleInputChange}
          />
        )
      case 'address':
        return (
          <AddressTab
            settings={settings}
            handleInputChange={handleInputChange}
          />
        )
      case 'hours':
        return (
          <HoursTab
            settings={settings}
            handleOpeningHoursChange={handleOpeningHoursChange}
          />
        )
      case 'social':
        return (
          <SocialTab
            settings={settings}
            handleInputChange={handleInputChange}
          />
        )
      case 'seo':
        return (
          <SeoTab
            settings={settings}
            handleInputChange={handleInputChange}
            handleKeywordChange={handleKeywordChange}
          />
        )
      case 'notifications':
        return (
          <NotificationsTab
            settings={settings}
            handleInputChange={handleInputChange}
          />
        )
      case 'styles':
        return (
          <StylesTab
            settings={settings}
            handleResetStyles={handleResetStyles}
            {...styleEditorProps}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-sage-600 hover:text-forest-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m0 7h18" />
                </svg>
              </Link>
              <h1
                className="text-2xl font-bold"
                style={{
                  color: settings.styles?.pageTitle?.color,
                  fontFamily: settings.styles?.pageTitle?.fontFamily
                }}
              >
                Kontakt Einstellungen
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              {/* Reset All Button */}
              <button
                onClick={handleResetAll}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sage-700 bg-sage-100 rounded-lg hover:bg-sage-200 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Orijinale Dön
              </button>

              {saveMessage && (
                <span className={`text-sm font-medium ${
                  saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {saveMessage.text}
                </span>
              )}
              {hasChanges && !saveMessage && (
                <span className="text-sm text-sage-600 font-medium">
                  Nicht gespeicherte Änderungen
                </span>
              )}

              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  hasChanges && !isSaving
                    ? 'hover:shadow-medium hover:-translate-y-1'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                style={hasChanges && !isSaving ? {
                  backgroundColor: settings.styles?.saveButton?.backgroundColor,
                  color: settings.styles?.saveButton?.color,
                  fontFamily: settings.styles?.saveButton?.fontFamily
                } : undefined}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Speichern...
                  </>
                ) : (
                  <>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Speichern
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-soft sticky top-8">
              <h2
                className="text-lg font-semibold mb-4"
                style={{
                  color: settings.styles?.sectionTitle?.color,
                  fontFamily: settings.styles?.sectionTitle?.fontFamily
                }}
              >
                Einstellungen
              </h2>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200"
                    style={activeTab === tab.id ? {
                      backgroundColor: settings.styles?.tabActive?.backgroundColor,
                      color: settings.styles?.tabActive?.color,
                      fontWeight: settings.styles?.tabActive?.fontWeight as any
                    } : {
                      color: settings.styles?.tabInactive?.color
                    }}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-500"></div>
                  <span className="ml-3 text-gray-500">Einstellungen werden geladen...</span>
                </div>
              ) : (
                renderActiveTab()
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
