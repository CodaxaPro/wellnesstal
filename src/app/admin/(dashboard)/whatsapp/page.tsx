'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

import {
  WhatsAppSettings,
  defaultSettings,
  tabs,
  WhatsAppPreview,
  BasicTab,
  AppearanceTab,
  MessageTab,
  DisplayTab,
  AvailabilityTab,
  CtaTab
} from './components'

export default function WhatsAppSettingsPage() {
  const router = useRouter()
  const [settings, setSettings] = useState<WhatsAppSettings>(defaultSettings)
  const [activeTab, setActiveTab] = useState('basic')
  const [hasChanges, setHasChanges] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Fetch settings from API on load
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }

    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/content?section=whatsapp-settings')
        const data = await response.json()
        if (data.success && data.data?.content) {
          setSettings(prev => ({
            ...prev,
            ...data.data.content
          }))
        }
      } catch (error) {
        console.error('Failed to fetch WhatsApp settings:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [router])

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

      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          section: 'whatsapp-settings',
          content: settings
        })
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to save settings')
      }

      setHasChanges(false)
      setSaveMessage({ type: 'success', text: 'Einstellungen erfolgreich gespeichert!' })
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

  const updateBasic = (field: keyof WhatsAppSettings['basic'], value: any) => {
    setSettings(prev => ({
      ...prev,
      basic: { ...prev.basic, [field]: value }
    }))
    setHasChanges(true)
  }

  const updateAppearance = (field: keyof WhatsAppSettings['appearance'], value: any) => {
    setSettings(prev => ({
      ...prev,
      appearance: { ...prev.appearance, [field]: value }
    }))
    setHasChanges(true)
  }

  const updateMessage = (field: keyof WhatsAppSettings['message'], value: any) => {
    setSettings(prev => ({
      ...prev,
      message: { ...prev.message, [field]: value }
    }))
    setHasChanges(true)
  }

  const updateDisplay = (field: keyof WhatsAppSettings['display'], value: any) => {
    setSettings(prev => ({
      ...prev,
      display: { ...prev.display, [field]: value }
    }))
    setHasChanges(true)
  }

  const updateAvailability = (field: keyof WhatsAppSettings['availability'], value: any) => {
    setSettings(prev => ({
      ...prev,
      availability: { ...prev.availability, [field]: value }
    }))
    setHasChanges(true)
  }

  const updateCtaBubble = (field: keyof WhatsAppSettings['ctaBubble'], value: any) => {
    setSettings(prev => ({
      ...prev,
      ctaBubble: { ...prev.ctaBubble, [field]: value }
    }))
    setHasChanges(true)
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicTab settings={settings} updateBasic={updateBasic} />
      case 'appearance':
        return <AppearanceTab settings={settings} updateAppearance={updateAppearance} />
      case 'message':
        return <MessageTab settings={settings} updateMessage={updateMessage} />
      case 'display':
        return <DisplayTab settings={settings} updateDisplay={updateDisplay} />
      case 'availability':
        return <AvailabilityTab settings={settings} updateAvailability={updateAvailability} />
      case 'cta':
        return <CtaTab settings={settings} updateCtaBubble={updateCtaBubble} />
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
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-2xl">💬</span>
                <h1 className="text-2xl font-bold text-charcoal">WhatsApp Button</h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {saveMessage && (
                <span className={`text-sm font-medium ${
                  saveMessage.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {saveMessage.text}
                </span>
              )}
              {hasChanges && !saveMessage && (
                <span className="text-sm text-orange-600 font-medium">
                  Nicht gespeicherte Änderungen
                </span>
              )}

              <button
                onClick={handleSave}
                disabled={!hasChanges || isSaving}
                className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 ${
                  hasChanges && !isSaving
                    ? 'bg-green-500 hover:bg-green-600 text-white hover:shadow-medium hover:-translate-y-1'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
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
              <h2 className="text-lg font-semibold text-charcoal mb-4">Einstellungen</h2>
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-green-100 text-green-700 font-medium'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-charcoal'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span className="text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>

              {/* Preview */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-charcoal mb-4">Vorschau</h3>
                <div className="bg-gray-100 rounded-xl p-6 flex items-center justify-center min-h-[200px] relative overflow-hidden">
                  {settings.basic.enabled ? (
                    <WhatsAppPreview settings={settings} />
                  ) : (
                    <div className="text-center text-gray-500">
                      <span className="text-3xl">🚫</span>
                      <p className="text-sm mt-2">Button deaktiviert</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-soft p-8">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
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
