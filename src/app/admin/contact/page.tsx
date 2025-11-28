'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Text style interface
interface TextStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
}

// Contact Settings Styles
interface ContactStyles {
  pageTitle?: TextStyle
  sectionTitle?: TextStyle
  tabActive?: TextStyle
  tabInactive?: TextStyle
  label?: TextStyle
  input?: TextStyle
  saveButton?: TextStyle
  helpText?: TextStyle
  businessName?: TextStyle
  tagline?: TextStyle
  description?: TextStyle
}

interface ContactSettings {
  businessInfo: {
    name: string
    tagline: string
    description: string
  }
  contact: {
    phone: string
    email: string
    whatsapp: string
  }
  address: {
    street: string
    city: string
    postalCode: string
    country: string
    googleMapsUrl: string
  }
  openingHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  socialMedia: {
    instagram: string
    facebook: string
    whatsapp: string
    website: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    bookingConfirmations: boolean
  }
  styles?: ContactStyles
}

// Default styles
const defaultStyles: ContactStyles = {
  pageTitle: {
    fontFamily: 'system-ui',
    fontSize: '24px',
    fontWeight: '700',
    color: '#2C2C2C'
  },
  sectionTitle: {
    fontFamily: 'system-ui',
    fontSize: '18px',
    fontWeight: '600',
    color: '#2C2C2C'
  },
  tabActive: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '500',
    color: '#637554',
    backgroundColor: '#eef1ea'
  },
  tabInactive: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '400',
    color: '#6B7280'
  },
  label: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '500',
    color: '#2C2C2C'
  },
  input: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#2C2C2C',
    borderColor: '#E5E7EB'
  },
  saveButton: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#9CAF88'
  },
  helpText: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '400',
    color: '#6B7280'
  },
  businessName: {
    fontFamily: 'system-ui',
    fontSize: '20px',
    fontWeight: '700',
    color: '#9CAF88'
  },
  tagline: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '500',
    color: '#2C2C2C'
  },
  description: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#666666'
  }
}

// Default content
const defaultContent: ContactSettings = {
  businessInfo: {
    name: 'Wellnesstal',
    tagline: 'Premium Wellness & Headspa in Baesweiler',
    description: 'Ihre Oase der Entspannung im Herzen von Köln. Professionelle Wellness-Behandlungen für Körper und Seele.'
  },
  contact: {
    phone: '+49 1733828581',
    email: 'info@wellnesstal.de',
    whatsapp: '+49 1733828581'
  },
  address: {
    street: 'Reyplatz 10',
    city: 'Baesweiler',
    postalCode: '52499',
    country: 'Almanya',
    googleMapsUrl: 'https://maps.google.com/?q=Wellnesstal+Baesweiler'
  },
  openingHours: {
    monday: { open: '09:00', close: '19:00', closed: false },
    tuesday: { open: '09:00', close: '19:00', closed: false },
    wednesday: { open: '09:00', close: '19:00', closed: false },
    thursday: { open: '09:00', close: '19:00', closed: false },
    friday: { open: '09:00', close: '19:00', closed: false },
    saturday: { open: '10:00', close: '16:00', closed: false },
    sunday: { open: '', close: '', closed: true }
  },
  socialMedia: {
    instagram: 'https://instagram.com/wellnesstal',
    facebook: 'https://facebook.com/wellnesstal',
    whatsapp: 'https://wa.me/491733828581',
    website: 'https://wellnesstal.de'
  },
  seo: {
    metaTitle: 'Wellnesstal - Premium Wellness & Headspa in Baesweiler',
    metaDescription: 'Entspannung und Wellness in Köln. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden. Jetzt Termin vereinbaren!',
    keywords: ['wellness', 'headspa', 'massage', 'köln', 'entspannung', 'aromatherapie', 'spa']
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    bookingConfirmations: true
  },
  styles: defaultStyles
}

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

  const tabs = [
    { id: 'business', label: 'Geschäftsinformationen', icon: '🏢' },
    { id: 'contact', label: 'Kontaktdaten', icon: '📞' },
    { id: 'address', label: 'Adresse & Standort', icon: '📍' },
    { id: 'hours', label: 'Öffnungszeiten', icon: '🕐' },
    { id: 'social', label: 'Social Media', icon: '📱' },
    { id: 'seo', label: 'SEO Einstellungen', icon: '🔍' },
    { id: 'notifications', label: 'Benachrichtigungen', icon: '🔔' },
    { id: 'styles', label: 'Design Einstellungen', icon: '🎨' }
  ]

  const dayNames = [
    { key: 'monday', label: 'Montag' },
    { key: 'tuesday', label: 'Dienstag' },
    { key: 'wednesday', label: 'Mittwoch' },
    { key: 'thursday', label: 'Donnerstag' },
    { key: 'friday', label: 'Freitag' },
    { key: 'saturday', label: 'Samstag' },
    { key: 'sunday', label: 'Sonntag' }
  ]

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
      // Save contact-settings to API
      const settingsResponse = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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

    } catch (error) {
      console.error('Save error:', error)
      setSaveMessage({ type: 'error', text: 'Fehler beim Speichern. Bitte versuchen Sie es erneut.' })
    } finally {
      setIsSaving(false)
    }
  }

  // Reusable Style Editor Component
  const StyleEditor = ({
    styleKey,
    label,
    style,
    showBackground = false,
    showBorder = false
  }: {
    styleKey: keyof ContactStyles
    label: string
    style?: TextStyle
    showBackground?: boolean
    showBorder?: boolean
  }) => {
    const isExpanded = expandedStyleEditors[styleKey] || false
    const currentStyle = style || defaultStyles[styleKey] || {}

    return (
      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <button
          onClick={() => toggleStyleEditor(styleKey)}
          className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-lg">🎨</span>
            <span className="font-medium text-charcoal">{label}</span>
          </div>
          <svg
            className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {isExpanded && (
          <div className="p-4 space-y-4 bg-white">
            {/* Preview */}
            <div className="p-3 bg-gray-50 rounded-lg border">
              <p className="text-xs text-gray-500 mb-2">Vorschau:</p>
              <span style={{
                fontFamily: currentStyle.fontFamily,
                fontSize: currentStyle.fontSize,
                fontWeight: currentStyle.fontWeight as any,
                color: currentStyle.color,
                backgroundColor: showBackground ? currentStyle.backgroundColor : undefined,
                padding: showBackground ? '4px 8px' : undefined,
                borderRadius: showBackground ? '4px' : undefined
              }}>
                Beispieltext
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Font Size */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Schriftgröße</label>
                <select
                  value={currentStyle.fontSize || '16px'}
                  onChange={(e) => updateStyleField(styleKey, 'fontSize', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="12px">12px</option>
                  <option value="14px">14px</option>
                  <option value="16px">16px</option>
                  <option value="18px">18px</option>
                  <option value="20px">20px</option>
                  <option value="24px">24px</option>
                  <option value="30px">30px</option>
                  <option value="36px">36px</option>
                  <option value="48px">48px</option>
                </select>
              </div>

              {/* Font Weight */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Schriftstärke</label>
                <select
                  value={currentStyle.fontWeight || '400'}
                  onChange={(e) => updateStyleField(styleKey, 'fontWeight', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                >
                  <option value="300">Light (300)</option>
                  <option value="400">Normal (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                </select>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Textfarbe</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentStyle.color || '#2C2C2C'}
                    onChange={(e) => updateStyleField(styleKey, 'color', e.target.value)}
                    className="w-10 h-10 rounded-lg border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentStyle.color || '#2C2C2C'}
                    onChange={(e) => updateStyleField(styleKey, 'color', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              {/* Background Color (optional) */}
              {showBackground && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Hintergrundfarbe</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentStyle.backgroundColor || '#FFFFFF'}
                      onChange={(e) => updateStyleField(styleKey, 'backgroundColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={currentStyle.backgroundColor || '#FFFFFF'}
                      onChange={(e) => updateStyleField(styleKey, 'backgroundColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              )}

              {/* Border Color (optional) */}
              {showBorder && (
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Rahmenfarbe</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={currentStyle.borderColor || '#E5E7EB'}
                      onChange={(e) => updateStyleField(styleKey, 'borderColor', e.target.value)}
                      className="w-10 h-10 rounded-lg border cursor-pointer"
                    />
                    <input
                      type="text"
                      value={currentStyle.borderColor || '#E5E7EB'}
                      onChange={(e) => updateStyleField(styleKey, 'borderColor', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderBusinessTab = () => (
    <div className="space-y-6">
      {/* Live Preview Card */}
      <div className="bg-gradient-to-br from-sage-50 to-white p-6 rounded-2xl border border-sage-200">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">👁️</span>
          <span className="text-sm font-medium text-sage-700">Live-Vorschau</span>
        </div>
        <div className="space-y-2">
          <h3 style={{
            fontFamily: settings.styles?.businessName?.fontFamily,
            fontSize: settings.styles?.businessName?.fontSize,
            fontWeight: settings.styles?.businessName?.fontWeight as any,
            color: settings.styles?.businessName?.color
          }}>
            {settings.businessInfo.name}
          </h3>
          <p style={{
            fontFamily: settings.styles?.tagline?.fontFamily,
            fontSize: settings.styles?.tagline?.fontSize,
            fontWeight: settings.styles?.tagline?.fontWeight as any,
            color: settings.styles?.tagline?.color
          }}>
            {settings.businessInfo.tagline}
          </p>
          <p style={{
            fontFamily: settings.styles?.description?.fontFamily,
            fontSize: settings.styles?.description?.fontSize,
            fontWeight: settings.styles?.description?.fontWeight as any,
            color: settings.styles?.description?.color
          }}>
            {settings.businessInfo.description}
          </p>
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Geschäftsname
        </label>
        <input
          type="text"
          value={settings.businessInfo.name}
          onChange={(e) => handleInputChange('businessInfo', 'name', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
        <StyleEditor
          styleKey="businessName"
          label="Geschäftsname Stil"
          style={settings.styles?.businessName}
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Tagline
        </label>
        <input
          type="text"
          value={settings.businessInfo.tagline}
          onChange={(e) => handleInputChange('businessInfo', 'tagline', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="z.B. Premium Wellness & Headspa in Köln"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
        <StyleEditor
          styleKey="tagline"
          label="Tagline Stil"
          style={settings.styles?.tagline}
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Beschreibung
        </label>
        <textarea
          rows={4}
          value={settings.businessInfo.description}
          onChange={(e) => handleInputChange('businessInfo', 'description', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Kurze Beschreibung Ihres Unternehmens..."
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
        <StyleEditor
          styleKey="description"
          label="Beschreibung Stil"
          style={settings.styles?.description}
        />
      </div>
    </div>
  )

  const renderContactTab = () => (
    <div className="space-y-6">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Telefonnummer
        </label>
        <input
          type="tel"
          value={settings.contact.phone}
          onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="+49 221 12345678"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          E-Mail-Adresse
        </label>
        <input
          type="email"
          value={settings.contact.email}
          onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="info@wellnesstal.de"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          WhatsApp Nummer
        </label>
        <input
          type="tel"
          value={settings.contact.whatsapp}
          onChange={(e) => handleInputChange('contact', 'whatsapp', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="+49 221 12345678"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
        <p
          className="text-sm mt-2"
          style={{
            color: settings.styles?.helpText?.color,
            fontFamily: settings.styles?.helpText?.fontFamily
          }}
        >
          Diese Nummer wird für den WhatsApp-Button verwendet
        </p>
      </div>
    </div>
  )

  const renderAddressTab = () => (
    <div className="space-y-6">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Straße und Hausnummer
        </label>
        <input
          type="text"
          value={settings.address.street}
          onChange={(e) => handleInputChange('address', 'street', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Musterstraße 123"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{
              color: settings.styles?.label?.color,
              fontFamily: settings.styles?.label?.fontFamily
            }}
          >
            Postleitzahl
          </label>
          <input
            type="text"
            value={settings.address.postalCode}
            onChange={(e) => handleInputChange('address', 'postalCode', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            placeholder="50667"
            style={{
              borderColor: settings.styles?.input?.borderColor,
              color: settings.styles?.input?.color
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{
              color: settings.styles?.label?.color,
              fontFamily: settings.styles?.label?.fontFamily
            }}
          >
            Stadt
          </label>
          <input
            type="text"
            value={settings.address.city}
            onChange={(e) => handleInputChange('address', 'city', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            placeholder="Köln"
            style={{
              borderColor: settings.styles?.input?.borderColor,
              color: settings.styles?.input?.color
            }}
          />
        </div>

        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{
              color: settings.styles?.label?.color,
              fontFamily: settings.styles?.label?.fontFamily
            }}
          >
            Land
          </label>
          <input
            type="text"
            value={settings.address.country}
            onChange={(e) => handleInputChange('address', 'country', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            placeholder="Deutschland"
            style={{
              borderColor: settings.styles?.input?.borderColor,
              color: settings.styles?.input?.color
            }}
          />
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Google Maps URL
        </label>
        <input
          type="url"
          value={settings.address.googleMapsUrl}
          onChange={(e) => handleInputChange('address', 'googleMapsUrl', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="https://maps.google.com/?q=..."
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
        <p
          className="text-sm mt-2"
          style={{
            color: settings.styles?.helpText?.color,
            fontFamily: settings.styles?.helpText?.fontFamily
          }}
        >
          Link zu Ihrem Standort auf Google Maps
        </p>
      </div>
    </div>
  )

  const renderHoursTab = () => (
    <div className="space-y-6">
      <h3
        className="text-lg font-semibold mb-4"
        style={{
          color: settings.styles?.sectionTitle?.color,
          fontFamily: settings.styles?.sectionTitle?.fontFamily
        }}
      >
        Öffnungszeiten verwalten
      </h3>

      <div className="space-y-4">
        {dayNames.map((day) => (
          <div key={day.key} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <div
              className="w-24 text-sm font-medium"
              style={{
                color: settings.styles?.label?.color,
                fontFamily: settings.styles?.label?.fontFamily
              }}
            >
              {day.label}
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.openingHours[day.key]?.closed || false}
                onChange={(e) => handleOpeningHoursChange(day.key, 'closed', e.target.checked)}
                className="rounded border-gray-300 text-sage-600 mr-2"
              />
              <span className="text-sm">Geschlossen</span>
            </label>

            {!settings.openingHours[day.key]?.closed && (
              <>
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={settings.openingHours[day.key]?.open || '09:00'}
                    onChange={(e) => handleOpeningHoursChange(day.key, 'open', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 text-sm"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="time"
                    value={settings.openingHours[day.key]?.close || '19:00'}
                    onChange={(e) => handleOpeningHoursChange(day.key, 'close', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 text-sm"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600">ℹ️</div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Hinweis</h4>
            <p className="text-sm text-blue-700 mt-1">
              Diese Öffnungszeiten werden auf Ihrer Website und in den Kontaktinformationen angezeigt.
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSocialTab = () => (
    <div className="space-y-6">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Instagram URL
        </label>
        <input
          type="url"
          value={settings.socialMedia.instagram}
          onChange={(e) => handleInputChange('socialMedia', 'instagram', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="https://instagram.com/wellnesstal"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Facebook URL
        </label>
        <input
          type="url"
          value={settings.socialMedia.facebook}
          onChange={(e) => handleInputChange('socialMedia', 'facebook', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="https://facebook.com/wellnesstal"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          WhatsApp Business URL
        </label>
        <input
          type="url"
          value={settings.socialMedia.whatsapp}
          onChange={(e) => handleInputChange('socialMedia', 'whatsapp', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="https://wa.me/4922112345678"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Website URL
        </label>
        <input
          type="url"
          value={settings.socialMedia.website}
          onChange={(e) => handleInputChange('socialMedia', 'website', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="https://wellnesstal.de"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
      </div>
    </div>
  )

  const renderSeoTab = () => (
    <div className="space-y-6">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Meta Titel
        </label>
        <input
          type="text"
          value={settings.seo.metaTitle}
          onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Wellnesstal - Premium Wellness & Headspa in Köln"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
        <p
          className="text-sm mt-2"
          style={{
            color: settings.styles?.helpText?.color,
            fontFamily: settings.styles?.helpText?.fontFamily
          }}
        >
          {settings.seo.metaTitle.length}/60 Zeichen (optimal: 50-60)
        </p>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Meta Beschreibung
        </label>
        <textarea
          rows={3}
          value={settings.seo.metaDescription}
          onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Entspannung und Wellness in Köln. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden."
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
        <p
          className="text-sm mt-2"
          style={{
            color: settings.styles?.helpText?.color,
            fontFamily: settings.styles?.helpText?.fontFamily
          }}
        >
          {settings.seo.metaDescription.length}/160 Zeichen (optimal: 120-160)
        </p>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Schlüsselwörter
        </label>
        <input
          type="text"
          value={settings.seo.keywords.join(', ')}
          onChange={(e) => handleKeywordChange(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="wellness, headspa, massage, köln, entspannung"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
        <p
          className="text-sm mt-2"
          style={{
            color: settings.styles?.helpText?.color,
            fontFamily: settings.styles?.helpText?.fontFamily
          }}
        >
          Trennen Sie Keywords mit Kommas (empfohlen: 5-10 Keywords)
        </p>
      </div>
    </div>
  )

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <h3
        className="text-lg font-semibold mb-4"
        style={{
          color: settings.styles?.sectionTitle?.color,
          fontFamily: settings.styles?.sectionTitle?.fontFamily
        }}
      >
        Benachrichtigungseinstellungen
      </h3>

      <div className="space-y-4">
        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
            className="rounded border-gray-300 text-sage-600"
          />
          <div>
            <div
              className="font-medium"
              style={{
                color: settings.styles?.label?.color,
                fontFamily: settings.styles?.label?.fontFamily
              }}
            >
              E-Mail-Benachrichtigungen
            </div>
            <div
              className="text-sm"
              style={{
                color: settings.styles?.helpText?.color,
                fontFamily: settings.styles?.helpText?.fontFamily
              }}
            >
              Erhalten Sie E-Mails für neue Kontaktanfragen
            </div>
          </div>
        </label>

        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={settings.notifications.smsNotifications}
            onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
            className="rounded border-gray-300 text-sage-600"
          />
          <div>
            <div
              className="font-medium"
              style={{
                color: settings.styles?.label?.color,
                fontFamily: settings.styles?.label?.fontFamily
              }}
            >
              SMS-Benachrichtigungen
            </div>
            <div
              className="text-sm"
              style={{
                color: settings.styles?.helpText?.color,
                fontFamily: settings.styles?.helpText?.fontFamily
              }}
            >
              Erhalten Sie SMS für dringende Anfragen
            </div>
          </div>
        </label>

        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={settings.notifications.bookingConfirmations}
            onChange={(e) => handleInputChange('notifications', 'bookingConfirmations', e.target.checked)}
            className="rounded border-gray-300 text-sage-600"
          />
          <div>
            <div
              className="font-medium"
              style={{
                color: settings.styles?.label?.color,
                fontFamily: settings.styles?.label?.fontFamily
              }}
            >
              Buchungsbestätigungen
            </div>
            <div
              className="text-sm"
              style={{
                color: settings.styles?.helpText?.color,
                fontFamily: settings.styles?.helpText?.fontFamily
              }}
            >
              Automatische Bestätigungen für Terminbuchungen senden
            </div>
          </div>
        </label>
      </div>
    </div>
  )

  const renderStylesTab = () => (
    <div className="space-y-6">
      {/* Reset Button */}
      <div className="flex justify-between items-center">
        <h3
          className="text-lg font-semibold"
          style={{
            color: settings.styles?.sectionTitle?.color,
            fontFamily: settings.styles?.sectionTitle?.fontFamily
          }}
        >
          Design-Einstellungen
        </h3>
        <button
          onClick={handleResetStyles}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sage-700 bg-sage-100 rounded-lg hover:bg-sage-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Orijinale Dön
        </button>
      </div>

      <div className="bg-sage-50 border border-sage-200 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="text-sage-600">💡</div>
          <div>
            <h4 className="text-sm font-medium text-sage-900">Hinweis</h4>
            <p className="text-sm text-sage-700 mt-1">
              Hier können Sie das Erscheinungsbild der Kontaktseite anpassen. Die Änderungen werden sofort in der Vorschau angezeigt.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Seitenlayout</h4>

        <StyleEditor
          styleKey="pageTitle"
          label="Seitentitel"
          style={settings.styles?.pageTitle}
        />

        <StyleEditor
          styleKey="sectionTitle"
          label="Abschnittstitel"
          style={settings.styles?.sectionTitle}
        />
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Navigation</h4>

        <StyleEditor
          styleKey="tabActive"
          label="Aktiver Tab"
          style={settings.styles?.tabActive}
          showBackground
        />

        <StyleEditor
          styleKey="tabInactive"
          label="Inaktiver Tab"
          style={settings.styles?.tabInactive}
        />
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Formularelemente</h4>

        <StyleEditor
          styleKey="label"
          label="Label-Text"
          style={settings.styles?.label}
        />

        <StyleEditor
          styleKey="input"
          label="Eingabefelder"
          style={settings.styles?.input}
          showBorder
        />

        <StyleEditor
          styleKey="helpText"
          label="Hilfetext"
          style={settings.styles?.helpText}
        />
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Aktionen</h4>

        <StyleEditor
          styleKey="saveButton"
          label="Speichern-Button"
          style={settings.styles?.saveButton}
          showBackground
        />
      </div>
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
                <>
                  {activeTab === 'business' && renderBusinessTab()}
                  {activeTab === 'contact' && renderContactTab()}
                  {activeTab === 'address' && renderAddressTab()}
                  {activeTab === 'hours' && renderHoursTab()}
                  {activeTab === 'social' && renderSocialTab()}
                  {activeTab === 'seo' && renderSeoTab()}
                  {activeTab === 'notifications' && renderNotificationsTab()}
                  {activeTab === 'styles' && renderStylesTab()}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
