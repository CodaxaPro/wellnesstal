'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { FooterBlockContent } from '../FooterBlock'

interface FooterBlockEditorProps {
  content: FooterBlockContent
  onUpdate: (content: FooterBlockContent) => void
}

// Style interface
interface TextStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
}

// Default styles - original footer colors
const defaultStyles = {
  brandName: {
    fontFamily: 'system-ui',
    fontSize: '30px',
    fontWeight: '700',
    color: '#9CAF88'
  },
  description: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#D1D5DB'
  },
  sectionTitle: {
    fontFamily: 'system-ui',
    fontSize: '18px',
    fontWeight: '600',
    color: '#9CAF88'
  },
  link: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#D1D5DB'
  },
  newsletterTitle: {
    fontFamily: 'system-ui',
    fontSize: '20px',
    fontWeight: '600',
    color: '#FFFFFF'
  },
  copyright: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '400',
    color: '#9CA3AF'
  }
}

const defaultContent: FooterBlockContent = {
  useGlobalFooter: true,  // Default: use homepage footer
  brandName: 'Wellnesstal',
  brandEmoji: '🌿',
  description: 'Ihre Oase der Entspannung im Herzen von Baesweiler. Professionelle Wellness-Behandlungen für Körper und Seele.',
  socialMedia: {
    instagram: 'https://instagram.com/wellnesstal',
    facebook: 'https://facebook.com/wellnesstal',
    whatsapp: 'https://wa.me/491733828581'
  },
  newsletter: {
    enabled: true,
    title: 'Newsletter abonnieren',
    subtitle: 'Bleiben Sie auf dem Laufenden über neue Behandlungen, Angebote und Wellness-Tipps.',
    placeholder: 'Ihre E-Mail-Adresse',
    buttonText: 'Anmelden',
    disclaimer: 'Kein Spam. Jederzeit abmeldbar.'
  },
  quickLinks: [
    { label: 'Start', href: '#home' },
    { label: 'Leistungen', href: '#services' },
    { label: 'Über uns', href: '#about' },
    { label: 'Kontakt', href: '#contact' }
  ],
  legalLinks: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'AGB', href: '/agb' },
    { label: 'Widerrufsrecht', href: '/widerruf' }
  ],
  services: [
    { label: 'Premium Headspa', href: '/services/headspa' },
    { label: 'Aromatherapie', href: '/services/aromatherapie' },
    { label: 'Wellness Massage', href: '/services/massage' },
    { label: 'Gesichtspflege', href: '/services/gesichtspflege' }
  ],
  copyright: '© 2024 Wellnesstal. Alle Rechte vorbehalten.',
  styles: defaultStyles,
  contact: {
    businessName: 'Wellnesstal',
    phone: '+49 1733828581',
    email: 'info@wellnesstal.de',
    address: {
      street: 'Reyplatz 10',
      city: 'Baesweiler',
      postalCode: '52499',
      country: 'Deutschland'
    },
    openingHours: {
      monday: { open: '09:00', close: '19:00', closed: false },
      tuesday: { open: '09:00', close: '19:00', closed: false },
      wednesday: { open: '09:00', close: '19:00', closed: false },
      thursday: { open: '09:00', close: '19:00', closed: false },
      friday: { open: '09:00', close: '19:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '', close: '', closed: true }
    }
  }
}

export default function FooterBlockEditor({ content, onUpdate }: FooterBlockEditorProps) {
  // Merge with defaults
  const mergedContent: FooterBlockContent = {
    ...defaultContent,
    ...content,
    socialMedia: { ...defaultContent.socialMedia, ...content?.socialMedia },
    newsletter: { ...defaultContent.newsletter, ...content?.newsletter },
    quickLinks: content?.quickLinks || defaultContent.quickLinks,
    legalLinks: content?.legalLinks || defaultContent.legalLinks,
    services: content?.services || defaultContent.services,
    contact: {
      ...defaultContent.contact,
      ...content?.contact,
      address: { ...defaultContent.contact.address, ...content?.contact?.address },
      openingHours: { ...defaultContent.contact.openingHours, ...content?.contact?.openingHours }
    },
    styles: {
      ...defaultStyles,
      ...content?.styles,
      brandName: { ...defaultStyles.brandName, ...content?.styles?.brandName },
      description: { ...defaultStyles.description, ...content?.styles?.description },
      sectionTitle: { ...defaultStyles.sectionTitle, ...content?.styles?.sectionTitle },
      link: { ...defaultStyles.link, ...content?.styles?.link },
      newsletterTitle: { ...defaultStyles.newsletterTitle, ...content?.styles?.newsletterTitle },
      copyright: { ...defaultStyles.copyright, ...content?.styles?.copyright },
    }
  }

  const [localContent, setLocalContent] = useState<FooterBlockContent>(mergedContent)
  const [expandedSections, setExpandedSections] = useState<string[]>(['brand'])
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  // Debounced update
  const debouncedUpdate = useCallback((newContent: FooterBlockContent) => {
    if (isInitialMount.current) return
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onUpdate(newContent)
    }, 300)
  }, [onUpdate])

  useEffect(() => {
    isInitialMount.current = false
  }, [])

  // Update local and trigger debounced save
  const updateContent = useCallback((updates: Partial<FooterBlockContent>) => {
    setLocalContent(prev => {
      const newContent = { ...prev, ...updates }
      debouncedUpdate(newContent)
      return newContent
    })
  }, [debouncedUpdate])

  // Toggle section
  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    )
  }

  // Update nested fields
  const updateNestedField = (parent: string, field: string, value: any) => {
    setLocalContent(prev => {
      const newContent = {
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [field]: value
        }
      }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Update newsletter field
  const updateNewsletterField = (field: string, value: any) => {
    setLocalContent(prev => {
      const newContent = {
        ...prev,
        newsletter: {
          ...prev.newsletter,
          [field]: value
        }
      }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Update contact field
  const updateContactField = (field: string, value: any) => {
    setLocalContent(prev => {
      const newContent = {
        ...prev,
        contact: {
          ...prev.contact,
          [field]: value
        }
      }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Update contact address field
  const updateAddressField = (field: string, value: any) => {
    setLocalContent(prev => {
      const newContent = {
        ...prev,
        contact: {
          ...prev.contact,
          address: {
            ...prev.contact.address,
            [field]: value
          }
        }
      }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Update opening hours
  const updateOpeningHours = (day: string, field: string, value: any) => {
    setLocalContent(prev => {
      const newContent = {
        ...prev,
        contact: {
          ...prev.contact,
          openingHours: {
            ...prev.contact.openingHours,
            [day]: {
              ...(prev.contact.openingHours as any)[day],
              [field]: value
            }
          }
        }
      }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Update quick link
  const updateQuickLink = (index: number, field: string, value: string) => {
    setLocalContent(prev => {
      const links = [...(prev.quickLinks || [])]
      if (!links[index]) links[index] = { label: '', href: '' }
      links[index] = { ...links[index], [field]: value }
      const newContent = { ...prev, quickLinks: links }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Add quick link
  const addQuickLink = () => {
    setLocalContent(prev => {
      const links = [...(prev.quickLinks || []), { label: '', href: '' }]
      const newContent = { ...prev, quickLinks: links }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Remove quick link
  const removeQuickLink = (index: number) => {
    setLocalContent(prev => {
      const links = (prev.quickLinks || []).filter((_, i) => i !== index)
      const newContent = { ...prev, quickLinks: links }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Update legal link
  const updateLegalLink = (index: number, field: string, value: string) => {
    setLocalContent(prev => {
      const links = [...(prev.legalLinks || [])]
      if (!links[index]) links[index] = { label: '', href: '' }
      links[index] = { ...links[index], [field]: value }
      const newContent = { ...prev, legalLinks: links }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Add legal link
  const addLegalLink = () => {
    setLocalContent(prev => {
      const links = [...(prev.legalLinks || []), { label: '', href: '' }]
      const newContent = { ...prev, legalLinks: links }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Remove legal link
  const removeLegalLink = (index: number) => {
    setLocalContent(prev => {
      const links = (prev.legalLinks || []).filter((_, i) => i !== index)
      const newContent = { ...prev, legalLinks: links }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Update service
  const updateService = (index: number, field: string, value: string) => {
    setLocalContent(prev => {
      const services = [...(prev.services || [])]
      if (!services[index]) services[index] = { label: '', href: '' }
      services[index] = { ...services[index], [field]: value }
      const newContent = { ...prev, services }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Add service
  const addService = () => {
    setLocalContent(prev => {
      const services = [...(prev.services || []), { label: '', href: '' }]
      const newContent = { ...prev, services }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Remove service
  const removeService = (index: number) => {
    setLocalContent(prev => {
      const services = (prev.services || []).filter((_, i) => i !== index)
      const newContent = { ...prev, services }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Update style
  const updateStyle = (styleName: string, property: string, value: string) => {
    setLocalContent(prev => {
      const newContent = {
        ...prev,
        styles: {
          ...prev.styles,
          [styleName]: {
            ...(prev.styles as any)?.[styleName],
            [property]: value
          }
        }
      }
      debouncedUpdate(newContent)
      return newContent
    })
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // Section header component
  const SectionHeader = ({ title, section, icon, color }: { title: string; section: string; icon: string; color: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
        expandedSections.includes(section)
          ? `bg-${color}-50 border-2 border-${color}-200`
          : 'bg-slate-50 hover:bg-slate-100 border-2 border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-gradient-to-br from-${color}-400 to-${color}-600 text-white`}>
          {icon}
        </span>
        <span className="font-semibold text-slate-800">{title}</span>
      </div>
      <svg
        className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${expandedSections.includes(section) ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )

  const days = [
    { key: 'monday', label: 'Pazartesi' },
    { key: 'tuesday', label: 'Salı' },
    { key: 'wednesday', label: 'Çarşamba' },
    { key: 'thursday', label: 'Perşembe' },
    { key: 'friday', label: 'Cuma' },
    { key: 'saturday', label: 'Cumartesi' },
    { key: 'sunday', label: 'Pazar' }
  ]

  // Check if using global footer
  const useGlobalFooter = localContent.useGlobalFooter !== false

  return (
    <div className="space-y-4">
      {/* Global Footer Toggle */}
      <div className="p-5 bg-gradient-to-r from-sage-50 to-emerald-50 rounded-2xl border-2 border-sage-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-sage-400 to-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
              🔗
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Footer Kaynağı</h3>
              <p className="text-sm text-slate-500">
                {useGlobalFooter
                  ? 'Anasayfa footer\'ı kullanılıyor - tüm değişiklikler otomatik yansır'
                  : 'Bu sayfaya özel footer içeriği'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${useGlobalFooter ? 'text-sage-600' : 'text-slate-400'}`}>
              Global
            </span>
            <button
              onClick={() => updateContent({ useGlobalFooter: !useGlobalFooter })}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                useGlobalFooter ? 'bg-sage-500' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                useGlobalFooter ? 'left-8' : 'left-1'
              }`} />
            </button>
            <span className={`text-sm font-medium ${!useGlobalFooter ? 'text-amber-600' : 'text-slate-400'}`}>
              Özel
            </span>
          </div>
        </div>

        {/* Info message when using global footer */}
        {useGlobalFooter && (
          <div className="mt-4 p-4 bg-white/80 rounded-xl border border-sage-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-sage-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-slate-700 font-medium">Anasayfa Footer'ı Kullanılıyor</p>
                <p className="text-xs text-slate-500 mt-1">
                  Footer içeriğini düzenlemek için <a href="/admin/content" className="text-sage-600 hover:underline font-medium">Admin → İçerik → Footer</a> sayfasını ziyaret edin.
                  Orada yaptığınız değişiklikler bu sayfada da otomatik olarak görünecektir.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Show custom fields only when not using global footer */}
      {!useGlobalFooter && (
        <>
          {/* Brand Section */}
          <div className="space-y-3">
            <SectionHeader title="Marka Bilgileri" section="brand" icon="🏢" color="sage" />
        {expandedSections.includes('brand') && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Emoji</label>
                <input
                  type="text"
                  value={localContent.brandEmoji || ''}
                  onChange={(e) => updateContent({ brandEmoji: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent text-2xl text-center"
                  maxLength={4}
                />
              </div>
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-slate-700 mb-2">Marka Adı</label>
                <input
                  type="text"
                  value={localContent.brandName || ''}
                  onChange={(e) => updateContent({ brandName: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Açıklama</label>
              <textarea
                rows={3}
                value={localContent.description || ''}
                onChange={(e) => updateContent({ description: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>

            {/* Brand Style */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-3">
              <p className="text-sm font-medium text-slate-600">Marka Stili</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Font Size</label>
                  <input
                    type="text"
                    value={localContent.styles?.brandName?.fontSize || '30px'}
                    onChange={(e) => updateStyle('brandName', 'fontSize', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Font Weight</label>
                  <select
                    value={localContent.styles?.brandName?.fontWeight || '700'}
                    onChange={(e) => updateStyle('brandName', 'fontWeight', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="400">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Renk</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localContent.styles?.brandName?.color || '#9CAF88'}
                      onChange={(e) => updateStyle('brandName', 'color', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      value={localContent.styles?.brandName?.color || '#9CAF88'}
                      onChange={(e) => updateStyle('brandName', 'color', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Social Media Section */}
      <div className="space-y-3">
        <SectionHeader title="Sosyal Medya" section="social" icon="📱" color="blue" />
        {expandedSections.includes('social') && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <span className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs">📷</span>
                  Instagram
                </label>
                <input
                  type="url"
                  value={localContent.socialMedia?.instagram || ''}
                  onChange={(e) => updateNestedField('socialMedia', 'instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">f</span>
                  Facebook
                </label>
                <input
                  type="url"
                  value={localContent.socialMedia?.facebook || ''}
                  onChange={(e) => updateNestedField('socialMedia', 'facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                  <span className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center text-white text-xs">💬</span>
                  WhatsApp
                </label>
                <input
                  type="url"
                  value={localContent.socialMedia?.whatsapp || ''}
                  onChange={(e) => updateNestedField('socialMedia', 'whatsapp', e.target.value)}
                  placeholder="https://wa.me/..."
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Newsletter Section */}
      <div className="space-y-3">
        <SectionHeader title="Newsletter" section="newsletter" icon="📧" color="amber" />
        {expandedSections.includes('newsletter') && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localContent.newsletter?.enabled !== false}
                  onChange={(e) => updateNewsletterField('enabled', e.target.checked)}
                  className="w-5 h-5 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                />
                <span className="text-sm font-medium text-slate-700">Newsletter Bölümünü Göster</span>
              </label>
            </div>

            {localContent.newsletter?.enabled !== false && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Başlık</label>
                    <input
                      type="text"
                      value={localContent.newsletter?.title || ''}
                      onChange={(e) => updateNewsletterField('title', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Buton Metni</label>
                    <input
                      type="text"
                      value={localContent.newsletter?.buttonText || ''}
                      onChange={(e) => updateNewsletterField('buttonText', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Alt Yazı</label>
                  <textarea
                    rows={2}
                    value={localContent.newsletter?.subtitle || ''}
                    onChange={(e) => updateNewsletterField('subtitle', e.target.value)}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Placeholder</label>
                    <input
                      type="text"
                      value={localContent.newsletter?.placeholder || ''}
                      onChange={(e) => updateNewsletterField('placeholder', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Uyarı Metni</label>
                    <input
                      type="text"
                      value={localContent.newsletter?.disclaimer || ''}
                      onChange={(e) => updateNewsletterField('disclaimer', e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Quick Links Section */}
      <div className="space-y-3">
        <SectionHeader title="Navigasyon Linkleri" section="quicklinks" icon="🔗" color="indigo" />
        {expandedSections.includes('quicklinks') && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
            {(localContent.quickLinks || []).map((link, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={link.label || ''}
                    onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                    placeholder="Link Metni"
                    className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={link.href || ''}
                    onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                    placeholder="#section veya /sayfa"
                    className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
                <button
                  onClick={() => removeQuickLink(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={addQuickLink}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-sage-400 hover:text-sage-600 transition-colors"
            >
              + Link Ekle
            </button>
          </div>
        )}
      </div>

      {/* Services Section */}
      <div className="space-y-3">
        <SectionHeader title="Hizmetler" section="services" icon="⭐" color="emerald" />
        {expandedSections.includes('services') && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
            {(localContent.services || []).map((service, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={service.label || ''}
                    onChange={(e) => updateService(index, 'label', e.target.value)}
                    placeholder="Hizmet Adı"
                    className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={service.href || ''}
                    onChange={(e) => updateService(index, 'href', e.target.value)}
                    placeholder="/services/hizmet-adi"
                    className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
                <button
                  onClick={() => removeService(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={addService}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-sage-400 hover:text-sage-600 transition-colors"
            >
              + Hizmet Ekle
            </button>
          </div>
        )}
      </div>

      {/* Legal Links Section */}
      <div className="space-y-3">
        <SectionHeader title="Yasal Linkler" section="legallinks" icon="📜" color="slate" />
        {expandedSections.includes('legallinks') && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
            {(localContent.legalLinks || []).map((link, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex-1 grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={link.label || ''}
                    onChange={(e) => updateLegalLink(index, 'label', e.target.value)}
                    placeholder="Link Metni"
                    className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={link.href || ''}
                    onChange={(e) => updateLegalLink(index, 'href', e.target.value)}
                    placeholder="/sayfa-adi"
                    className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono text-sm"
                  />
                </div>
                <button
                  onClick={() => removeLegalLink(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={addLegalLink}
              className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 hover:border-sage-400 hover:text-sage-600 transition-colors"
            >
              + Link Ekle
            </button>
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="space-y-3">
        <SectionHeader title="İletişim Bilgileri" section="contact" icon="📞" color="rose" />
        {expandedSections.includes('contact') && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">İşletme Adı</label>
                <input
                  type="text"
                  value={localContent.contact?.businessName || ''}
                  onChange={(e) => updateContactField('businessName', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Telefon</label>
                <input
                  type="tel"
                  value={localContent.contact?.phone || ''}
                  onChange={(e) => updateContactField('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">E-posta</label>
              <input
                type="email"
                value={localContent.contact?.email || ''}
                onChange={(e) => updateContactField('email', e.target.value)}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>

            {/* Address */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-3">
              <p className="text-sm font-medium text-slate-600">Adres</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-500 mb-1">Sokak/Cadde</label>
                  <input
                    type="text"
                    value={localContent.contact?.address?.street || ''}
                    onChange={(e) => updateAddressField('street', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Posta Kodu</label>
                  <input
                    type="text"
                    value={localContent.contact?.address?.postalCode || ''}
                    onChange={(e) => updateAddressField('postalCode', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Şehir</label>
                  <input
                    type="text"
                    value={localContent.contact?.address?.city || ''}
                    onChange={(e) => updateAddressField('city', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Ülke</label>
                  <input
                    type="text"
                    value={localContent.contact?.address?.country || ''}
                    onChange={(e) => updateAddressField('country', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>
            </div>

            {/* Opening Hours */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-3">
              <p className="text-sm font-medium text-slate-600">Çalışma Saatleri</p>
              {days.map(day => (
                <div key={day.key} className="flex items-center gap-3">
                  <span className="w-24 text-sm text-slate-600">{day.label}</span>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={(localContent.contact?.openingHours as any)?.[day.key]?.closed !== true}
                      onChange={(e) => updateOpeningHours(day.key, 'closed', !e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                    />
                    <span className="text-xs text-slate-500">Açık</span>
                  </label>
                  {(localContent.contact?.openingHours as any)?.[day.key]?.closed !== true && (
                    <>
                      <input
                        type="time"
                        value={(localContent.contact?.openingHours as any)?.[day.key]?.open || '09:00'}
                        onChange={(e) => updateOpeningHours(day.key, 'open', e.target.value)}
                        className="px-2 py-1 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                      />
                      <span className="text-slate-400">-</span>
                      <input
                        type="time"
                        value={(localContent.contact?.openingHours as any)?.[day.key]?.close || '19:00'}
                        onChange={(e) => updateOpeningHours(day.key, 'close', e.target.value)}
                        className="px-2 py-1 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Styles Section */}
      <div className="space-y-3">
        <SectionHeader title="Stil Ayarları" section="styles" icon="🎨" color="violet" />
        {expandedSections.includes('styles') && (
          <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
            {/* Description Style */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-3">
              <p className="text-sm font-medium text-slate-600">Açıklama Stili</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Font Size</label>
                  <input
                    type="text"
                    value={localContent.styles?.description?.fontSize || '16px'}
                    onChange={(e) => updateStyle('description', 'fontSize', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Font Weight</label>
                  <select
                    value={localContent.styles?.description?.fontWeight || '400'}
                    onChange={(e) => updateStyle('description', 'fontWeight', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="400">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-500 mb-1">Renk</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localContent.styles?.description?.color || '#D1D5DB'}
                      onChange={(e) => updateStyle('description', 'color', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      value={localContent.styles?.description?.color || '#D1D5DB'}
                      onChange={(e) => updateStyle('description', 'color', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Title Style */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-3">
              <p className="text-sm font-medium text-slate-600">Bölüm Başlıkları (Navigation, Leistungen, Kontakt)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Font Size</label>
                  <input
                    type="text"
                    value={localContent.styles?.sectionTitle?.fontSize || '18px'}
                    onChange={(e) => updateStyle('sectionTitle', 'fontSize', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Font Weight</label>
                  <select
                    value={localContent.styles?.sectionTitle?.fontWeight || '600'}
                    onChange={(e) => updateStyle('sectionTitle', 'fontWeight', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="400">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-500 mb-1">Renk</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localContent.styles?.sectionTitle?.color || '#9CAF88'}
                      onChange={(e) => updateStyle('sectionTitle', 'color', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      value={localContent.styles?.sectionTitle?.color || '#9CAF88'}
                      onChange={(e) => updateStyle('sectionTitle', 'color', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Link Style */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-3">
              <p className="text-sm font-medium text-slate-600">Link Stili</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Font Size</label>
                  <input
                    type="text"
                    value={localContent.styles?.link?.fontSize || '16px'}
                    onChange={(e) => updateStyle('link', 'fontSize', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Font Weight</label>
                  <select
                    value={localContent.styles?.link?.fontWeight || '400'}
                    onChange={(e) => updateStyle('link', 'fontWeight', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="400">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-500 mb-1">Renk</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localContent.styles?.link?.color || '#D1D5DB'}
                      onChange={(e) => updateStyle('link', 'color', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      value={localContent.styles?.link?.color || '#D1D5DB'}
                      onChange={(e) => updateStyle('link', 'color', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Newsletter Title Style */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-3">
              <p className="text-sm font-medium text-slate-600">Newsletter Başlık Stili</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Font Size</label>
                  <input
                    type="text"
                    value={localContent.styles?.newsletterTitle?.fontSize || '20px'}
                    onChange={(e) => updateStyle('newsletterTitle', 'fontSize', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Font Weight</label>
                  <select
                    value={localContent.styles?.newsletterTitle?.fontWeight || '600'}
                    onChange={(e) => updateStyle('newsletterTitle', 'fontWeight', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="400">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-500 mb-1">Renk</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localContent.styles?.newsletterTitle?.color || '#FFFFFF'}
                      onChange={(e) => updateStyle('newsletterTitle', 'color', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      value={localContent.styles?.newsletterTitle?.color || '#FFFFFF'}
                      onChange={(e) => updateStyle('newsletterTitle', 'color', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright Style */}
            <div className="p-3 bg-slate-50 rounded-xl space-y-3">
              <p className="text-sm font-medium text-slate-600">Copyright Stili</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Font Size</label>
                  <input
                    type="text"
                    value={localContent.styles?.copyright?.fontSize || '14px'}
                    onChange={(e) => updateStyle('copyright', 'fontSize', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Font Weight</label>
                  <select
                    value={localContent.styles?.copyright?.fontWeight || '400'}
                    onChange={(e) => updateStyle('copyright', 'fontWeight', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  >
                    <option value="400">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs text-slate-500 mb-1">Renk</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={localContent.styles?.copyright?.color || '#9CA3AF'}
                      onChange={(e) => updateStyle('copyright', 'color', e.target.value)}
                      className="w-10 h-10 rounded-lg cursor-pointer border border-slate-200"
                    />
                    <input
                      type="text"
                      value={localContent.styles?.copyright?.color || '#9CA3AF'}
                      onChange={(e) => updateStyle('copyright', 'color', e.target.value)}
                      className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
        </>
      )}
    </div>
  )
}
