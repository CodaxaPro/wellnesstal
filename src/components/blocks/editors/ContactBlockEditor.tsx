'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { ContactBlockContent } from '../ContactBlock'

interface ContactBlockEditorProps {
  content: ContactBlockContent
  onUpdate: (content: ContactBlockContent) => void
}

const defaultContent: ContactBlockContent = {
  useGlobalContact: true,
  brandName: 'WellnessTal Studio',
  badge: '📞 Kontakt',
  sectionTitle: 'Bereit für Ihre',
  highlightedText: 'Auszeit',
  description: 'Vereinbaren Sie noch heute Ihren Termin oder lassen Sie sich unverbindlich beraten.',
  cards: {
    phone: { title: 'Telefonisch', description: 'Rufen Sie uns direkt an für eine schnelle Terminbuchung' },
    whatsapp: { title: 'WhatsApp', description: 'Schreiben Sie uns eine Nachricht - wir antworten schnell', linkText: 'Nachricht senden' },
    email: { title: 'E-Mail', description: 'Senden Sie uns Ihre Anfrage per E-Mail' }
  },
  map: { buttonText: 'In Google Maps öffnen' },
  openingHoursLabels: { title: 'Öffnungszeiten', todayLabel: 'Heute', closedLabel: 'Geschlossen' },
  contact: {
    businessName: 'WellnessTal Studio',
    phone: '+49 1733828581',
    email: 'info@wellnesstal.de',
    address: { street: 'Reyplatz 10', city: 'Baesweiler', postalCode: '52499', country: 'Deutschland' },
    openingHours: {
      monday: { open: '09:00', close: '19:00', closed: false },
      tuesday: { open: '09:00', close: '19:00', closed: false },
      wednesday: { open: '09:00', close: '19:00', closed: false },
      thursday: { open: '09:00', close: '19:00', closed: false },
      friday: { open: '09:00', close: '19:00', closed: false },
      saturday: { open: '10:00', close: '16:00', closed: false },
      sunday: { open: '', close: '', closed: true }
    }
  },
  googleMapsUrl: ''
}

export default function ContactBlockEditor({ content, onUpdate }: ContactBlockEditorProps) {
  const [localContent, setLocalContent] = useState<ContactBlockContent>(() => ({
    ...defaultContent,
    ...content,
    cards: { ...defaultContent.cards, ...content?.cards },
    map: { ...defaultContent.map, ...content?.map },
    openingHoursLabels: { ...defaultContent.openingHoursLabels, ...content?.openingHoursLabels },
    contact: {
      ...defaultContent.contact,
      ...content?.contact,
      address: { ...defaultContent.contact?.address, ...content?.contact?.address },
      openingHours: { ...defaultContent.contact?.openingHours, ...content?.contact?.openingHours }
    }
  }))

  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  // Debounced update
  const debouncedUpdate = useCallback((newContent: ContactBlockContent) => {
    if (isInitialMount.current) return
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => onUpdate(newContent), 300)
  }, [onUpdate])

  useEffect(() => {
    isInitialMount.current = false
  }, [])

  // Update content
  const updateContent = (updates: Partial<ContactBlockContent>) => {
    const newContent = { ...localContent, ...updates }
    setLocalContent(newContent)
    debouncedUpdate(newContent)
  }

  // Update nested field
  const updateNestedField = (parent: string, field: string, value: any) => {
    const parentObj = (localContent as any)[parent] || {}
    updateContent({ [parent]: { ...parentObj, [field]: value } })
  }

  // Toggle section
  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    )
  }

  // Section header component
  const SectionHeader = ({ title, section, icon, color }: { title: string; section: string; icon: string; color: string }) => (
    <button
      onClick={() => toggleSection(section)}
      className={`w-full flex items-center justify-between p-4 bg-gradient-to-r from-${color}-50 to-${color}-100/50 rounded-xl border border-${color}-200 hover:from-${color}-100 hover:to-${color}-200/50 transition-all duration-300`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="font-semibold text-slate-700">{title}</span>
      </div>
      <svg
        className={`w-5 h-5 text-slate-500 transition-transform duration-300 ${expandedSections.includes(section) ? 'rotate-180' : ''}`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  )

  // Check if using global contact
  const useGlobalContact = localContent.useGlobalContact !== false

  // Days mapping
  const days = [
    { key: 'monday', label: 'Pazartesi' },
    { key: 'tuesday', label: 'Salı' },
    { key: 'wednesday', label: 'Çarşamba' },
    { key: 'thursday', label: 'Perşembe' },
    { key: 'friday', label: 'Cuma' },
    { key: 'saturday', label: 'Cumartesi' },
    { key: 'sunday', label: 'Pazar' }
  ]

  return (
    <div className="space-y-4">
      {/* Global Contact Toggle */}
      <div className="p-5 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border-2 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
              📞
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Kontakt Kaynağı</h3>
              <p className="text-sm text-slate-500">
                {useGlobalContact
                  ? 'Anasayfa kontakt bölümü kullanılıyor - tüm değişiklikler otomatik yansır'
                  : 'Bu sayfaya özel kontakt içeriği'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${useGlobalContact ? 'text-blue-600' : 'text-slate-400'}`}>
              Global
            </span>
            <button
              onClick={() => updateContent({ useGlobalContact: !useGlobalContact })}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                useGlobalContact ? 'bg-blue-500' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                useGlobalContact ? 'left-8' : 'left-1'
              }`} />
            </button>
            <span className={`text-sm font-medium ${!useGlobalContact ? 'text-amber-600' : 'text-slate-400'}`}>
              Özel
            </span>
          </div>
        </div>

        {/* Info message when using global contact */}
        {useGlobalContact && (
          <div className="mt-4 p-4 bg-white/80 rounded-xl border border-blue-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-slate-700 font-medium">Anasayfa Kontakt Bölümü Kullanılıyor</p>
                <p className="text-xs text-slate-500 mt-1">
                  Kontakt içeriğini düzenlemek için <a href="/admin/content" className="text-blue-600 hover:underline font-medium">Admin → İçerik → Kontakt Bölümü</a> sayfasını ziyaret edin.
                  Orada yaptığınız değişiklikler bu sayfada da otomatik olarak görünecektir.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Show custom fields only when not using global contact */}
      {!useGlobalContact && (
        <>
          {/* Brand Name */}
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">Marka Adı (Harita Üstünde)</label>
            <input
              type="text"
              value={localContent.brandName || ''}
              onChange={(e) => updateContent({ brandName: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Wellnesstal Studio"
            />
          </div>

          {/* Section Texts */}
          <div className="space-y-3">
            <SectionHeader title="Bölüm Metinleri" section="texts" icon="📝" color="blue" />
            {expandedSections.includes('texts') && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Badge</label>
                  <input
                    type="text"
                    value={localContent.badge || ''}
                    onChange={(e) => updateContent({ badge: e.target.value })}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                    placeholder="📞 Kontakt"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Başlık</label>
                    <input
                      type="text"
                      value={localContent.sectionTitle || ''}
                      onChange={(e) => updateContent({ sectionTitle: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                      placeholder="Bereit für Ihre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Vurgulanan Metin</label>
                    <input
                      type="text"
                      value={localContent.highlightedText || ''}
                      onChange={(e) => updateContent({ highlightedText: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                      placeholder="Auszeit"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Açıklama</label>
                  <textarea
                    value={localContent.description || ''}
                    onChange={(e) => updateContent({ description: e.target.value })}
                    rows={2}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl"
                    placeholder="Vereinbaren Sie noch heute Ihren Termin..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Contact Cards */}
          <div className="space-y-3">
            <SectionHeader title="İletişim Kartları" section="cards" icon="📇" color="green" />
            {expandedSections.includes('cards') && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-6">
                {/* Phone Card */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-sage-500 rounded-full flex items-center justify-center text-white text-sm">📞</span>
                    Telefon Kartı
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Başlık</label>
                      <input
                        type="text"
                        value={localContent.cards?.phone?.title || ''}
                        onChange={(e) => updateContent({
                          cards: { ...localContent.cards, phone: { ...localContent.cards?.phone, title: e.target.value } }
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Açıklama</label>
                      <input
                        type="text"
                        value={localContent.cards?.phone?.description || ''}
                        onChange={(e) => updateContent({
                          cards: { ...localContent.cards, phone: { ...localContent.cards?.phone, description: e.target.value } }
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* WhatsApp Card */}
                <div className="p-4 bg-green-50 rounded-xl">
                  <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm">💬</span>
                    WhatsApp Kartı
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Başlık</label>
                      <input
                        type="text"
                        value={localContent.cards?.whatsapp?.title || ''}
                        onChange={(e) => updateContent({
                          cards: { ...localContent.cards, whatsapp: { ...localContent.cards?.whatsapp, title: e.target.value } }
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Açıklama</label>
                      <input
                        type="text"
                        value={localContent.cards?.whatsapp?.description || ''}
                        onChange={(e) => updateContent({
                          cards: { ...localContent.cards, whatsapp: { ...localContent.cards?.whatsapp, description: e.target.value } }
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Link Metni</label>
                      <input
                        type="text"
                        value={localContent.cards?.whatsapp?.linkText || ''}
                        onChange={(e) => updateContent({
                          cards: { ...localContent.cards, whatsapp: { ...localContent.cards?.whatsapp, linkText: e.target.value } }
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Email Card */}
                <div className="p-4 bg-blue-50 rounded-xl">
                  <h4 className="font-medium text-slate-700 mb-3 flex items-center gap-2">
                    <span className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm">✉️</span>
                    E-Mail Kartı
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Başlık</label>
                      <input
                        type="text"
                        value={localContent.cards?.email?.title || ''}
                        onChange={(e) => updateContent({
                          cards: { ...localContent.cards, email: { ...localContent.cards?.email, title: e.target.value } }
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Açıklama</label>
                      <input
                        type="text"
                        value={localContent.cards?.email?.description || ''}
                        onChange={(e) => updateContent({
                          cards: { ...localContent.cards, email: { ...localContent.cards?.email, description: e.target.value } }
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-3">
            <SectionHeader title="İletişim Bilgileri" section="contact" icon="📍" color="purple" />
            {expandedSections.includes('contact') && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Firma Adı</label>
                    <input
                      type="text"
                      value={localContent.contact?.businessName || ''}
                      onChange={(e) => updateContent({
                        contact: { ...localContent.contact!, businessName: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Telefon</label>
                    <input
                      type="text"
                      value={localContent.contact?.phone || ''}
                      onChange={(e) => updateContent({
                        contact: { ...localContent.contact!, phone: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">E-Mail</label>
                    <input
                      type="email"
                      value={localContent.contact?.email || ''}
                      onChange={(e) => updateContent({
                        contact: { ...localContent.contact!, email: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="p-4 bg-slate-50 rounded-xl">
                  <h4 className="font-medium text-slate-700 mb-3">Adres</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Sokak</label>
                      <input
                        type="text"
                        value={localContent.contact?.address?.street || ''}
                        onChange={(e) => updateContent({
                          contact: {
                            ...localContent.contact!,
                            address: { ...localContent.contact?.address!, street: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Şehir</label>
                      <input
                        type="text"
                        value={localContent.contact?.address?.city || ''}
                        onChange={(e) => updateContent({
                          contact: {
                            ...localContent.contact!,
                            address: { ...localContent.contact?.address!, city: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Posta Kodu</label>
                      <input
                        type="text"
                        value={localContent.contact?.address?.postalCode || ''}
                        onChange={(e) => updateContent({
                          contact: {
                            ...localContent.contact!,
                            address: { ...localContent.contact?.address!, postalCode: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Ülke</label>
                      <input
                        type="text"
                        value={localContent.contact?.address?.country || ''}
                        onChange={(e) => updateContent({
                          contact: {
                            ...localContent.contact!,
                            address: { ...localContent.contact?.address!, country: e.target.value }
                          }
                        })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Google Maps URL */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Google Maps URL</label>
                  <input
                    type="url"
                    value={localContent.googleMapsUrl || ''}
                    onChange={(e) => updateContent({ googleMapsUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Opening Hours */}
          <div className="space-y-3">
            <SectionHeader title="Çalışma Saatleri" section="hours" icon="🕐" color="amber" />
            {expandedSections.includes('hours') && (
              <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
                {/* Labels */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Başlık</label>
                    <input
                      type="text"
                      value={localContent.openingHoursLabels?.title || ''}
                      onChange={(e) => updateContent({
                        openingHoursLabels: { ...localContent.openingHoursLabels, title: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Bugün Etiketi</label>
                    <input
                      type="text"
                      value={localContent.openingHoursLabels?.todayLabel || ''}
                      onChange={(e) => updateContent({
                        openingHoursLabels: { ...localContent.openingHoursLabels, todayLabel: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Kapalı Etiketi</label>
                    <input
                      type="text"
                      value={localContent.openingHoursLabels?.closedLabel || ''}
                      onChange={(e) => updateContent({
                        openingHoursLabels: { ...localContent.openingHoursLabels, closedLabel: e.target.value }
                      })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    />
                  </div>
                </div>

                {/* Days */}
                <div className="space-y-2">
                  {days.map(({ key, label }) => {
                    const dayData = localContent.contact?.openingHours?.[key] || { open: '09:00', close: '19:00', closed: false }
                    return (
                      <div key={key} className="flex items-center gap-4 p-3 bg-slate-50 rounded-lg">
                        <span className="w-24 font-medium text-sm text-slate-700">{label}</span>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={dayData.closed}
                            onChange={(e) => updateContent({
                              contact: {
                                ...localContent.contact!,
                                openingHours: {
                                  ...localContent.contact?.openingHours,
                                  [key]: { ...dayData, closed: e.target.checked }
                                }
                              }
                            })}
                            className="w-4 h-4 rounded border-slate-300"
                          />
                          <span className="text-sm text-slate-600">Kapalı</span>
                        </label>
                        {!dayData.closed && (
                          <>
                            <input
                              type="time"
                              value={dayData.open || '09:00'}
                              onChange={(e) => updateContent({
                                contact: {
                                  ...localContent.contact!,
                                  openingHours: {
                                    ...localContent.contact?.openingHours,
                                    [key]: { ...dayData, open: e.target.value }
                                  }
                                }
                              })}
                              className="px-2 py-1 border border-slate-200 rounded text-sm"
                            />
                            <span className="text-slate-400">-</span>
                            <input
                              type="time"
                              value={dayData.close || '19:00'}
                              onChange={(e) => updateContent({
                                contact: {
                                  ...localContent.contact!,
                                  openingHours: {
                                    ...localContent.contact?.openingHours,
                                    [key]: { ...dayData, close: e.target.value }
                                  }
                                }
                              })}
                              className="px-2 py-1 border border-slate-200 rounded text-sm"
                            />
                          </>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Map Button */}
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <label className="block text-sm font-medium text-slate-700 mb-2">Harita Buton Metni</label>
            <input
              type="text"
              value={localContent.map?.buttonText || ''}
              onChange={(e) => updateContent({ map: { ...localContent.map, buttonText: e.target.value } })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl"
              placeholder="In Google Maps öffnen"
            />
          </div>
        </>
      )}
    </div>
  )
}
