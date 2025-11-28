'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface WhatsAppSettings {
  basic: {
    enabled: boolean
    phoneNumber: string
    useOriginalStyle: boolean
    position: 'bottom-right' | 'bottom-left'
  }
  appearance: {
    buttonColor: string
    buttonHoverColor: string
    iconColor: string
    size: 'small' | 'medium' | 'large'
    shadow: boolean
    pulseAnimation: boolean
    borderRadius: 'full' | 'rounded' | 'square'
  }
  message: {
    defaultMessage: string
    tooltipText: string
    tooltipDelay: number
    showTooltipOnLoad: boolean
    autoShowTooltipAfter: number
  }
  display: {
    showOnMobile: boolean
    showOnDesktop: boolean
    showOnAllPages: boolean
    excludedPages: string[]
    showAfterDelay: number
    showAfterScroll: number
  }
  availability: {
    mode: 'always-online' | 'always-offline' | 'based-on-hours' | 'manual'
    manualStatus: boolean
    showIndicator: boolean
    onlineColor: string
    offlineColor: string
    offlineMessage: string
  }
  ctaBubble: {
    enabled: boolean
    title: string
    message: string
    backgroundColor: string
    textColor: string
    titleColor: string
    showAfterDelay: number
    dismissable: boolean
  }
}

const defaultSettings: WhatsAppSettings = {
  basic: {
    enabled: true,
    phoneNumber: '+49 221 12345678',
    useOriginalStyle: false,
    position: 'bottom-right'
  },
  appearance: {
    buttonColor: '#25D366',
    buttonHoverColor: '#128C7E',
    iconColor: '#FFFFFF',
    size: 'medium',
    shadow: true,
    pulseAnimation: true,
    borderRadius: 'full'
  },
  message: {
    defaultMessage: 'Hallo, ich interessiere mich für eine Wellness-Behandlung bei Wellnesstal.',
    tooltipText: 'WhatsApp Nachricht senden',
    tooltipDelay: 0,
    showTooltipOnLoad: false,
    autoShowTooltipAfter: 0
  },
  display: {
    showOnMobile: true,
    showOnDesktop: true,
    showOnAllPages: true,
    excludedPages: [],
    showAfterDelay: 0,
    showAfterScroll: 0
  },
  availability: {
    mode: 'always-online',
    manualStatus: true,
    showIndicator: true,
    onlineColor: '#22C55E',
    offlineColor: '#EF4444',
    offlineMessage: 'Derzeit offline - Wir antworten so schnell wie möglich.'
  },
  ctaBubble: {
    enabled: false,
    title: 'Haben Sie Fragen?',
    message: 'Schreiben Sie uns auf WhatsApp - wir helfen Ihnen gerne!',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    titleColor: '#25D366',
    showAfterDelay: 3000,
    dismissable: true
  }
}

export default function WhatsAppSettings() {
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

  const tabs = [
    { id: 'basic', label: 'Grundeinstellungen', icon: '⚙️' },
    { id: 'appearance', label: 'Erscheinungsbild', icon: '🎨' },
    { id: 'message', label: 'Nachrichten', icon: '💬' },
    { id: 'display', label: 'Anzeige', icon: '👁️' },
    { id: 'availability', label: 'Verfügbarkeit', icon: '🟢' },
    { id: 'cta', label: 'CTA Bubble', icon: '💭' }
  ]

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage(null)

    try {
      const response = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'whatsapp-settings',
          content: settings
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save settings')
      }

      setHasChanges(false)
      setSaveMessage({ type: 'success', text: 'Einstellungen erfolgreich gespeichert!' })
      setTimeout(() => setSaveMessage(null), 3000)

    } catch (error) {
      console.error('Save error:', error)
      setSaveMessage({ type: 'error', text: 'Fehler beim Speichern. Bitte versuchen Sie es erneut.' })
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

  // Preview Component
  const WhatsAppPreview = () => {
    const sizeClasses = {
      small: 'w-10 h-10',
      medium: 'w-14 h-14',
      large: 'w-16 h-16'
    }

    const iconSizes = {
      small: 'w-5 h-5',
      medium: 'w-7 h-7',
      large: 'w-8 h-8'
    }

    const borderRadiusClasses = {
      full: 'rounded-full',
      rounded: 'rounded-xl',
      square: 'rounded-lg'
    }

    const isOnline = settings.availability.mode === 'always-online' ||
      (settings.availability.mode === 'manual' && settings.availability.manualStatus)

    if (settings.basic.useOriginalStyle) {
      // Original Style Preview
      return (
        <div className="relative">
          <div className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg relative">
            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
            </svg>
            <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-center">Orijinal Stil</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center">
        {/* Tooltip Preview - Only show when CTA bubble is not visible */}
        {settings.message.tooltipText && !settings.ctaBubble.enabled && (
          <div className="bg-gray-800 text-white px-2 py-1 rounded-md text-[10px] whitespace-nowrap mb-2 max-w-[140px] truncate">
            {settings.message.tooltipText}
          </div>
        )}

        {/* CTA Bubble Preview - Scaled down for preview area */}
        {settings.ctaBubble.enabled && (
          <div
            className="p-2 rounded-lg shadow-lg max-w-[160px] mb-2 relative"
            style={{ backgroundColor: settings.ctaBubble.backgroundColor }}
          >
            <h4 className="font-semibold text-xs mb-0.5 truncate" style={{ color: settings.ctaBubble.titleColor }}>
              {settings.ctaBubble.title}
            </h4>
            <p className="text-[10px] line-clamp-2" style={{ color: settings.ctaBubble.textColor }}>
              {settings.ctaBubble.message}
            </p>
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent"
              style={{ borderTopColor: settings.ctaBubble.backgroundColor }}></div>
          </div>
        )}

        {/* Button Preview */}
        <div
          className={`${sizeClasses[settings.appearance.size]} ${borderRadiusClasses[settings.appearance.borderRadius]} flex items-center justify-center text-white relative transition-all duration-300`}
          style={{
            backgroundColor: settings.appearance.buttonColor,
            boxShadow: settings.appearance.shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.2)' : 'none'
          }}
        >
          <svg
            className={iconSizes[settings.appearance.size]}
            fill={settings.appearance.iconColor}
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>

          {/* Pulse Animation */}
          {settings.appearance.pulseAnimation && (
            <span
              className={`absolute inset-0 ${borderRadiusClasses[settings.appearance.borderRadius]} animate-ping opacity-75`}
              style={{ backgroundColor: settings.appearance.buttonColor }}
            ></span>
          )}

          {/* Online Indicator */}
          {settings.availability.showIndicator && (
            <div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
              style={{ backgroundColor: isOnline ? settings.availability.onlineColor : settings.availability.offlineColor }}
            >
              <div
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: isOnline ? settings.availability.onlineColor : settings.availability.offlineColor }}
              ></div>
            </div>
          )}
        </div>
      </div>
    )
  }

  const renderBasicTab = () => (
    <div className="space-y-6">
      {/* Enabled Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-medium text-charcoal">WhatsApp Button aktivieren</h4>
          <p className="text-sm text-gray-500">Button auf der Website anzeigen</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.basic.enabled}
            onChange={(e) => updateBasic('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      {/* Use Original Style */}
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
        <div>
          <h4 className="font-medium text-charcoal">Originalstil verwenden</h4>
          <p className="text-sm text-gray-500">Standard WhatsApp Button ohne Anpassungen</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.basic.useOriginalStyle}
            onChange={(e) => updateBasic('useOriginalStyle', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          WhatsApp Telefonnummer
        </label>
        <input
          type="tel"
          value={settings.basic.phoneNumber}
          onChange={(e) => updateBasic('phoneNumber', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="+49 221 12345678"
        />
        <p className="text-sm text-gray-500 mt-2">
          Mit Ländervorwahl eingeben (z.B. +49 für Deutschland)
        </p>
      </div>

      {/* Position */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Button Position
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => updateBasic('position', 'bottom-right')}
            className={`p-4 border-2 rounded-xl text-center transition-all ${
              settings.basic.position === 'bottom-right'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">↘️</div>
            <span className="text-sm font-medium">Unten rechts</span>
          </button>
          <button
            onClick={() => updateBasic('position', 'bottom-left')}
            className={`p-4 border-2 rounded-xl text-center transition-all ${
              settings.basic.position === 'bottom-left'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">↙️</div>
            <span className="text-sm font-medium">Unten links</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderAppearanceTab = () => (
    <div className="space-y-6">
      {settings.basic.useOriginalStyle ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-600">⚠️</div>
            <div>
              <h4 className="text-sm font-medium text-yellow-900">Originalstil aktiv</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Sie verwenden den Originalstil. Um Anpassungen vorzunehmen, deaktivieren Sie bitte &quot;Originalstil verwenden&quot; in den Grundeinstellungen.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Button Colors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Button Farbe
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.appearance.buttonColor}
                  onChange={(e) => updateAppearance('buttonColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.appearance.buttonColor}
                  onChange={(e) => updateAppearance('buttonColor', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Hover Farbe
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.appearance.buttonHoverColor}
                  onChange={(e) => updateAppearance('buttonHoverColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.appearance.buttonHoverColor}
                  onChange={(e) => updateAppearance('buttonHoverColor', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Icon Farbe
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.appearance.iconColor}
                  onChange={(e) => updateAppearance('iconColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.appearance.iconColor}
                  onChange={(e) => updateAppearance('iconColor', e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Size */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Button Größe
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['small', 'medium', 'large'].map((size) => (
                <button
                  key={size}
                  onClick={() => updateAppearance('size', size)}
                  className={`p-4 border-2 rounded-xl text-center transition-all ${
                    settings.appearance.size === size
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="text-sm font-medium capitalize">
                    {size === 'small' ? 'Klein' : size === 'medium' ? 'Mittel' : 'Groß'}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Border Radius */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Eckenradius
            </label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'full', label: 'Rund', icon: '⚫' },
                { value: 'rounded', label: 'Abgerundet', icon: '🔲' },
                { value: 'square', label: 'Eckig', icon: '⬛' }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateAppearance('borderRadius', option.value)}
                  className={`p-4 border-2 rounded-xl text-center transition-all ${
                    settings.appearance.borderRadius === option.value
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <span className="text-sm font-medium">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-charcoal">Schatten</h4>
                <p className="text-sm text-gray-500">Button-Schatten anzeigen</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.appearance.shadow}
                  onChange={(e) => updateAppearance('shadow', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h4 className="font-medium text-charcoal">Puls-Animation</h4>
                <p className="text-sm text-gray-500">Aufmerksamkeit erregende Animation</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.appearance.pulseAnimation}
                  onChange={(e) => updateAppearance('pulseAnimation', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
              </label>
            </div>
          </div>
        </>
      )}
    </div>
  )

  const renderMessageTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Standard Nachricht
        </label>
        <textarea
          rows={4}
          value={settings.message.defaultMessage}
          onChange={(e) => updateMessage('defaultMessage', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Nachricht, die beim Öffnen von WhatsApp vorausgefüllt wird..."
        />
        <p className="text-sm text-gray-500 mt-2">
          Diese Nachricht wird automatisch eingefügt, wenn der Kunde auf den Button klickt.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Tooltip Text
        </label>
        <input
          type="text"
          value={settings.message.tooltipText}
          onChange={(e) => updateMessage('tooltipText', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Text, der beim Hover angezeigt wird..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Tooltip Verzögerung (ms)
        </label>
        <input
          type="number"
          value={settings.message.tooltipDelay}
          onChange={(e) => updateMessage('tooltipDelay', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          min="0"
          step="100"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-medium text-charcoal">Tooltip beim Laden anzeigen</h4>
          <p className="text-sm text-gray-500">Tooltip automatisch beim Seitenaufruf anzeigen</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.message.showTooltipOnLoad}
            onChange={(e) => updateMessage('showTooltipOnLoad', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Tooltip nach X ms automatisch anzeigen
        </label>
        <input
          type="number"
          value={settings.message.autoShowTooltipAfter}
          onChange={(e) => updateMessage('autoShowTooltipAfter', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          min="0"
          step="500"
        />
        <p className="text-sm text-gray-500 mt-2">
          0 = Deaktiviert. Tooltip wird nach dieser Zeit automatisch angezeigt.
        </p>
      </div>
    </div>
  )

  const renderDisplayTab = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-charcoal">Auf Mobilgeräten anzeigen</h4>
            <p className="text-sm text-gray-500">Button auf Smartphones und Tablets</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.display.showOnMobile}
              onChange={(e) => updateDisplay('showOnMobile', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-charcoal">Auf Desktop anzeigen</h4>
            <p className="text-sm text-gray-500">Button auf Computern</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.display.showOnDesktop}
              onChange={(e) => updateDisplay('showOnDesktop', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-charcoal">Auf allen Seiten anzeigen</h4>
            <p className="text-sm text-gray-500">Button auf jeder Seite der Website</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.display.showOnAllPages}
              onChange={(e) => updateDisplay('showOnAllPages', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Verzögerung vor Anzeige (ms)
        </label>
        <input
          type="number"
          value={settings.display.showAfterDelay}
          onChange={(e) => updateDisplay('showAfterDelay', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          min="0"
          step="500"
        />
        <p className="text-sm text-gray-500 mt-2">
          0 = Sofort anzeigen. Button erscheint nach dieser Verzögerung.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Nach Scroll-Prozentsatz anzeigen (%)
        </label>
        <input
          type="number"
          value={settings.display.showAfterScroll}
          onChange={(e) => updateDisplay('showAfterScroll', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          min="0"
          max="100"
        />
        <p className="text-sm text-gray-500 mt-2">
          0 = Sofort anzeigen. Button erscheint nach diesem Scroll-Prozentsatz.
        </p>
      </div>
    </div>
  )

  const renderAvailabilityTab = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Verfügbarkeitsmodus
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { value: 'always-online', label: 'Immer Online', icon: '🟢', desc: 'Immer als online anzeigen' },
            { value: 'always-offline', label: 'Immer Offline', icon: '🔴', desc: 'Immer als offline anzeigen' },
            { value: 'based-on-hours', label: 'Nach Öffnungszeiten', icon: '🕐', desc: 'Status basierend auf Öffnungszeiten' },
            { value: 'manual', label: 'Manuell', icon: '✋', desc: 'Manuell ein-/ausschalten' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateAvailability('mode', option.value)}
              className={`p-4 border-2 rounded-xl text-left transition-all ${
                settings.availability.mode === option.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <div className="font-medium text-charcoal">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {settings.availability.mode === 'manual' && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div>
            <h4 className="font-medium text-charcoal">Manueller Status</h4>
            <p className="text-sm text-gray-500">Aktuellen Online-Status festlegen</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.availability.manualStatus}
              onChange={(e) => updateAvailability('manualStatus', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-red-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-medium text-charcoal">Status-Indikator anzeigen</h4>
          <p className="text-sm text-gray-500">Grüner/roter Punkt am Button</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.availability.showIndicator}
            onChange={(e) => updateAvailability('showIndicator', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Online Farbe
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.availability.onlineColor}
              onChange={(e) => updateAvailability('onlineColor', e.target.value)}
              className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={settings.availability.onlineColor}
              onChange={(e) => updateAvailability('onlineColor', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Offline Farbe
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.availability.offlineColor}
              onChange={(e) => updateAvailability('offlineColor', e.target.value)}
              className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={settings.availability.offlineColor}
              onChange={(e) => updateAvailability('offlineColor', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Offline Nachricht
        </label>
        <textarea
          rows={2}
          value={settings.availability.offlineMessage}
          onChange={(e) => updateAvailability('offlineMessage', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Nachricht, wenn offline..."
        />
      </div>
    </div>
  )

  const renderCtaTab = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-medium text-charcoal">CTA Bubble aktivieren</h4>
          <p className="text-sm text-gray-500">Aufmerksamkeitsstarke Nachrichtenblase</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.ctaBubble.enabled}
            onChange={(e) => updateCtaBubble('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      {settings.ctaBubble.enabled && (
        <>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Titel
            </label>
            <input
              type="text"
              value={settings.ctaBubble.title}
              onChange={(e) => updateCtaBubble('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Bubble Titel..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Nachricht
            </label>
            <textarea
              rows={3}
              value={settings.ctaBubble.message}
              onChange={(e) => updateCtaBubble('message', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Bubble Nachricht..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Hintergrundfarbe
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.ctaBubble.backgroundColor}
                  onChange={(e) => updateCtaBubble('backgroundColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.ctaBubble.backgroundColor}
                  onChange={(e) => updateCtaBubble('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Titel Farbe
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.ctaBubble.titleColor}
                  onChange={(e) => updateCtaBubble('titleColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.ctaBubble.titleColor}
                  onChange={(e) => updateCtaBubble('titleColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Text Farbe
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.ctaBubble.textColor}
                  onChange={(e) => updateCtaBubble('textColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.ctaBubble.textColor}
                  onChange={(e) => updateCtaBubble('textColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Anzeige Verzögerung (ms)
            </label>
            <input
              type="number"
              value={settings.ctaBubble.showAfterDelay}
              onChange={(e) => updateCtaBubble('showAfterDelay', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
              step="500"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-charcoal">Schließbar</h4>
              <p className="text-sm text-gray-500">Besucher können die Bubble schließen</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.ctaBubble.dismissable}
                onChange={(e) => updateCtaBubble('dismissable', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </>
      )}
    </div>
  )

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
                    <WhatsAppPreview />
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
                <>
                  {activeTab === 'basic' && renderBasicTab()}
                  {activeTab === 'appearance' && renderAppearanceTab()}
                  {activeTab === 'message' && renderMessageTab()}
                  {activeTab === 'display' && renderDisplayTab()}
                  {activeTab === 'availability' && renderAvailabilityTab()}
                  {activeTab === 'cta' && renderCtaTab()}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
