'use client'

import { useState, useCallback, useEffect, useRef } from 'react'

import { SchemaLocalBusiness } from '../../types'

interface LocalBusinessEditorProps {
  data: SchemaLocalBusiness
  onUpdate: (data: Partial<SchemaLocalBusiness>) => void
}

// Business Type Options
const BUSINESS_TYPES = [
  { value: 'LocalBusiness', label: 'LocalBusiness (Genel)' },
  { value: 'HealthAndBeautyBusiness', label: 'HealthAndBeautyBusiness' },
  { value: 'DaySpa', label: 'DaySpa (Onerilen)' },
  { value: 'BeautySalon', label: 'BeautySalon' },
  { value: 'HealthClub', label: 'HealthClub' },
  { value: 'MedicalSpa', label: 'MedicalSpa' },
] as const

// Days of week for opening hours
const DAYS_OF_WEEK = [
  { value: 'Monday', label: 'Pazartesi' },
  { value: 'Tuesday', label: 'Sali' },
  { value: 'Wednesday', label: 'Carsamba' },
  { value: 'Thursday', label: 'Persembe' },
  { value: 'Friday', label: 'Cuma' },
  { value: 'Saturday', label: 'Cumartesi' },
  { value: 'Sunday', label: 'Pazar' },
] as const

// Payment methods
const PAYMENT_METHODS = [
  'Cash', 'Credit Card', 'Debit Card', 'PayPal', 'Apple Pay', 'Google Pay', 'Bank Transfer', 'Invoice'
]

// Default amenities for wellness/spa
const DEFAULT_AMENITIES = [
  'Free WiFi', 'Parking', 'Wheelchair Accessible', 'Air Conditioning',
  'Sauna', 'Steam Room', 'Jacuzzi', 'Relaxation Room', 'Locker Room',
  'Shower', 'Towel Service', 'Robe Service', 'Tea/Coffee', 'Water'
]

// Collapsible Section Component
function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = false,
  badge
}: {
  title: string
  icon: string
  children: React.ReactNode
  defaultOpen?: boolean
  badge?: string
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">{icon}</span>
          <span className="font-medium text-slate-800">{title}</span>
          {badge && (
            <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
              {badge}
            </span>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="p-4 bg-white border-t border-slate-200">
          {children}
        </div>
      )}
    </div>
  )
}

// Form Input Component
function FormInput({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  helpText,
  required
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  type?: 'text' | 'email' | 'tel' | 'url' | 'number'
  helpText?: string
  required?: boolean
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        type={type}
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      {helpText && <p className="text-xs text-slate-500 mt-1">{helpText}</p>}
    </div>
  )
}

// Form Select Component
function FormSelect({
  label,
  value,
  onChange,
  options,
  helpText
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  helpText?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {helpText && <p className="text-xs text-slate-500 mt-1">{helpText}</p>}
    </div>
  )
}

// Form Textarea Component
function FormTextarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
  helpText,
  maxLength
}: {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  rows?: number
  helpText?: string
  maxLength?: number
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      />
      {helpText && (
        <div className="flex justify-between mt-1">
          <p className="text-xs text-slate-500">{helpText}</p>
          {maxLength && (
            <p className="text-xs text-slate-400">{value?.length || 0}/{maxLength}</p>
          )}
        </div>
      )}
    </div>
  )
}

export default function LocalBusinessEditor({ data, onUpdate }: LocalBusinessEditorProps) {
  const [activeTab, setActiveTab] = useState<'basic' | 'address' | 'hours' | 'social' | 'services' | 'amenities'>('basic')
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Local copy of data to avoid sending many partial updates; we debounce
  // and send the full local object to parent. This reduces races and missing fields.
  const [local, setLocal] = useState<SchemaLocalBusiness>(data || ({} as SchemaLocalBusiness))
  const isInitialMount = useRef(true)

  // Validation functions
  const validateUrl = (url: string): string | null => {
    if (!url) {
return null
}
    try {
      new URL(url)
      return null
    } catch {
      return 'Geçerli bir URL girin'
    }
  }

  const validateEmail = (email: string): string | null => {
    if (!email) {
return null
}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email) ? null : 'Geçerli bir e-posta adresi girin'
  }

  const validatePhone = (phone: string): string | null => {
    if (!phone) {
return null
}
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
    return phoneRegex.test(phone.replace(/\s/g, '')) ? null : 'Geçerli bir telefon numarası girin'
  }

  // Keep local in sync when parent `data` changes (e.g., on fetch/refresh)
  useEffect(() => {
    setLocal(data || ({} as SchemaLocalBusiness))
  }, [data])

  // Debounced full update to parent
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    const t = setTimeout(() => {
      try {
 console.debug('[debug][LocalBusinessEditor] debounced full onUpdate', { preview: { name: local.name, description: local.description } }) 
} catch (e) {}
      onUpdate(local)
    }, 300)
    return () => clearTimeout(t)
  }, [JSON.stringify(local)])

  const patchLocal = useCallback((updates: Partial<SchemaLocalBusiness>) => {
    setLocal(prev => ({ ...prev, ...updates }))
  }, [])

  // Update nested address
  const updateAddress = useCallback((field: string, value: string) => {
    const next = {
      address: {
        streetAddress: local.address?.streetAddress || '',
        addressLocality: local.address?.addressLocality || '',
        postalCode: local.address?.postalCode || '',
        addressCountry: local.address?.addressCountry || 'Germany',
        ...local.address,
        [field]: value
      }
    }
    try {
 console.debug('[debug][LocalBusinessEditor] updateAddress', { field, value, payloadPreview: { streetAddress: next.address.streetAddress, addressLocality: next.address.addressLocality } }) 
} catch (e) {}
    setLocal(prev => ({ ...prev, ...next }))
  }, [])

  // Update geo coordinates
  const updateGeo = useCallback((field: 'latitude' | 'longitude', value: number) => {
    const next = { geo: { latitude: local.geo?.latitude || 0, longitude: local.geo?.longitude || 0, ...(local.geo || {}), [field]: value } }
    try {
 console.debug('[debug][LocalBusinessEditor] updateGeo', { field, value, payload: next }) 
} catch (e) {}
    setLocal(prev => ({ ...prev, ...next }))
  }, [])

  // Update aggregate rating
  const updateRating = useCallback((field: string, value: number) => {
    const next = { aggregateRating: { ratingValue: local.aggregateRating?.ratingValue || 0, reviewCount: local.aggregateRating?.reviewCount || 0, ...(local.aggregateRating || {}), [field]: value } }
    try {
 console.debug('[debug][LocalBusinessEditor] updateRating', { field, value, payload: next }) 
} catch (e) {}
    setLocal(prev => ({ ...prev, ...next }))
  }, [])

  // Update opening hours
  const updateOpeningHours = useCallback((index: number, field: string, value: string | string[]) => {
    const hours = [...(local.openingHoursSpecification || [])]
    if (hours[index]) {
      hours[index] = { ...hours[index], [field]: value }
    }
    try {
 console.debug('[debug][LocalBusinessEditor] updateOpeningHours', { index, field, value, payloadPreview: hours[index] }) 
} catch (e) {}
    setLocal(prev => ({ ...prev, openingHoursSpecification: hours }))
  }, [])

  // Add opening hours entry
  const addOpeningHours = useCallback(() => {
    const hours = [...(local.openingHoursSpecification || [])]
    hours.push({ dayOfWeek: 'Monday', opens: '09:00', closes: '18:00' })
    try {
 console.debug('[debug][LocalBusinessEditor] addOpeningHours', { payload: hours }) 
} catch (e) {}
    setLocal(prev => ({ ...prev, openingHoursSpecification: hours }))
  }, [])

  // Remove opening hours entry
  const removeOpeningHours = useCallback((index: number) => {
    const hours = [...(local.openingHoursSpecification || [])]
    hours.splice(index, 1)
    setLocal(prev => ({ ...prev, openingHoursSpecification: hours }))
  }, [])

  // Update sameAs (social links)
  const updateSameAs = useCallback((index: number, value: string) => {
    setLocal(prev => {
      const links = [...(prev.sameAs || [])]
      links[index] = value
      return { ...prev, sameAs: links }
    })
  }, [])

  // Add social link
  const addSocialLink = useCallback(() => {
    setLocal(prev => ({
      ...prev,
      sameAs: [...(prev.sameAs || []), '']
    }))
  }, [])

  // Remove social link
  const removeSocialLink = useCallback((index: number) => {
    setLocal(prev => {
      const links = [...(prev.sameAs || [])]
      links.splice(index, 1)
      return { ...prev, sameAs: links }
    })
  }, [])

  // Update services
  const updateService = useCallback((index: number, field: string, value: string) => {
    const services = [...(local.availableService || [])]
    if (services[index]) {
      if (field === 'price' || field === 'priceCurrency') {
        services[index] = {
          ...services[index],
          offers: {
            price: services[index].offers?.price || '',
            priceCurrency: services[index].offers?.priceCurrency || 'EUR',
            [field]: value
          }
        }
      } else {
        services[index] = { ...services[index], [field]: value }
      }
    }
    setLocal(prev => ({ ...prev, availableService: services }))
  }, [])

  // Add service
  const addService = useCallback(() => {
    const services = [...(local.availableService || [])]
    services.push({
      '@type': 'Service',
      name: '',
      description: '',
      offers: {
        price: '',
        priceCurrency: 'EUR'
      }
    })
    setLocal(prev => ({ ...prev, availableService: services }))
  }, [])

  // Remove service
  const removeService = useCallback((index: number) => {
    const services = [...(local.availableService || [])]
    services.splice(index, 1)
    setLocal(prev => ({ ...prev, availableService: services }))
  }, [])

  // Update amenities
  const updateAmenity = useCallback((index: number, field: 'name' | 'value', newValue: string | boolean) => {
    const amenities = [...(local.amenityFeature || [])]
    if (amenities[index]) {
      amenities[index] = { ...amenities[index], [field]: newValue }
    }
    setLocal(prev => ({ ...prev, amenityFeature: amenities }))
  }, [])

  // Add amenity
  const addAmenity = useCallback((name?: string) => {
    const amenities = [...(local.amenityFeature || [])]
    amenities.push({
      name: name || '',
      value: true
    })
    setLocal(prev => ({ ...prev, amenityFeature: amenities }))
  }, [])

  // Remove amenity
  const removeAmenity = useCallback((index: number) => {
    const amenities = [...(local.amenityFeature || [])]
    amenities.splice(index, 1)
    setLocal(prev => ({ ...prev, amenityFeature: amenities }))
  }, [])

  // Update payment methods
  const updatePaymentAccepted = useCallback((method: string, checked: boolean) => {
    let methods = [...(local.paymentAccepted || [])]
    if (checked) {
      methods.push(method)
    } else {
      methods = methods.filter(m => m !== method)
    }
    setLocal(prev => ({ ...prev, paymentAccepted: methods }))
  }, [])

  // Update images
  const updateImages = useCallback((index: number, value: string) => {
    const images = [...(local.image || [])]
    images[index] = value
    setLocal(prev => ({ ...prev, image: images.filter(i => i) }))
  }, [])

  const addImage = useCallback(() => {
    const images = [...(local.image || []), '']
    setLocal(prev => ({ ...prev, image: images }))
  }, [])

  const removeImage = useCallback((index: number) => {
    const images = [...(local.image || [])]
    images.splice(index, 1)
    setLocal(prev => ({ ...prev, image: images }))
  }, [])

  // Tab Navigation
  const tabs = [
    { id: 'basic', label: 'Temel Bilgiler', icon: '📋' },
    { id: 'address', label: 'Adres & Konum', icon: '📍' },
    { id: 'hours', label: 'Calisma Saatleri', icon: '🕐' },
    { id: 'social', label: 'Sosyal Medya', icon: '🔗' },
    { id: 'services', label: 'Hizmetler', icon: '💆' },
    { id: 'amenities', label: 'Olanaklar', icon: '✨' },
  ] as const

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-1 p-1 bg-slate-100 rounded-xl overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
            }`}
          >
            <span>{tab.icon}</span>
            <span className="whitespace-nowrap">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Basic Info Tab */}
      {activeTab === 'basic' && (
        <div className="space-y-4">
          <CollapsibleSection title="Isletme Bilgileri" icon="🏢" defaultOpen>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormSelect
                  label="Isletme Tipi"
                  value={local['@type'] || 'DaySpa'}
                  onChange={(v) => patchLocal({ '@type': v as any })}
                  options={BUSINESS_TYPES.map(t => ({ value: t.value, label: t.label }))}
                  helpText="Google'da dogru kategoride gorunmek icin"
                />
                <FormSelect
                  label="Fiyat Araligi"
                  value={local.priceRange || ''}
                  onChange={(v) => patchLocal({ priceRange: v })}
                  options={[
                    { value: '', label: 'Secin...' },
                    { value: '€', label: '€ (Ekonomik)' },
                    { value: '€€', label: '€€ (Orta)' },
                    { value: '€€€', label: '€€€ (Luks)' },
                    { value: '€€€€', label: '€€€€ (Premium)' },
                  ]}
                />
              </div>

              <FormInput
                label="Isletme Adi"
                value={local.name || ''}
                onChange={(v) => patchLocal({ name: v })}
                placeholder="Wellnesstal"
                required
              />

              <FormTextarea
                label="Isletme Aciklamasi"
                value={local.description || ''}
                onChange={(v) => patchLocal({ description: v })}
                placeholder="Ihre Oase der Entspannung..."
                rows={3}
                maxLength={500}
                helpText="Google arama sonuclarinda gorunecek aciklama"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <FormInput
                    label="Telefon"
                    value={local.telephone || ''}
                    onChange={(v) => {
                      patchLocal({ telephone: v })
                      const error = validatePhone(v)
                      setErrors(prev => ({ ...prev, telephone: error || '' }))
                    }}
                    placeholder="+49 1733828581"
                    type="tel"
                    required
                  />
                  {errors.telephone && (
                    <p className="text-xs text-red-500 mt-1">{errors.telephone}</p>
                  )}
                </div>
                <div>
                  <FormInput
                    label="E-posta"
                    value={local.email || ''}
                    onChange={(v) => {
                      patchLocal({ email: v })
                      const error = validateEmail(v)
                      setErrors(prev => ({ ...prev, email: error || '' }))
                    }}
                    placeholder="info@wellnesstal.de"
                    type="email"
                  />
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <FormInput
                  label="Website URL"
                  value={local.url || ''}
                  onChange={(v) => {
                    patchLocal({ url: v })
                    const error = validateUrl(v)
                    setErrors(prev => ({ ...prev, url: error || '' }))
                  }}
                  placeholder="https://wellnesstal.de"
                  type="url"
                />
                {errors.url && (
                  <p className="text-xs text-red-500 mt-1">{errors.url}</p>
                )}
                {!errors.url && local.url && (
                  <p className="text-xs text-green-600 mt-1">✓ Geçerli URL</p>
                )}
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Logo & Gorseller" icon="🖼️" defaultOpen={false}>
            <div className="space-y-4">
              <FormInput
                label="Logo URL"
                value={local.logo || ''}
                onChange={(v) => patchLocal({ logo: v })}
                placeholder="https://wellnesstal.de/logo.png"
                type="url"
                helpText="Kare format, min. 112x112px onerilen"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Isletme Gorselleri
                </label>
                {(local.image || []).map((img, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="url"
                      value={img}
                      onChange={(e) => updateImages(i, e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                    />
                    <button
                      onClick={() => removeImage(i)}
                      className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      Sil
                    </button>
                  </div>
                ))}
                <button
                  onClick={addImage}
                  className="text-sm text-indigo-600 hover:text-indigo-700"
                >
                  + Gorsel Ekle
                </button>
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Degerlendirme (Google Stars)" icon="⭐" defaultOpen={false} badge="Onemli">
            <div className="space-y-4">
              <div className="p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                <strong>Not:</strong> Bu degerler Google Business Profile'dan gelen verilerle eslesmelidir.
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Ortalama Puan (1-5)"
                  value={local.aggregateRating?.ratingValue?.toString() || ''}
                  onChange={(v) => updateRating('ratingValue', parseFloat(v) || 0)}
                  placeholder="4.8"
                  type="number"
                  helpText="Ornek: 4.8"
                />
                <FormInput
                  label="Toplam Yorum Sayisi"
                  value={local.aggregateRating?.reviewCount?.toString() || ''}
                  onChange={(v) => updateRating('reviewCount', parseInt(v) || 0)}
                  placeholder="127"
                  type="number"
                  helpText="Ornek: 127"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="En Yuksek Puan"
                  value={local.aggregateRating?.bestRating?.toString() || '5'}
                  onChange={(v) => updateRating('bestRating', parseInt(v) || 5)}
                  placeholder="5"
                  type="number"
                />
                <FormInput
                  label="En Dusuk Puan"
                  value={local.aggregateRating?.worstRating?.toString() || '1'}
                  onChange={(v) => updateRating('worstRating', parseInt(v) || 1)}
                  placeholder="1"
                  type="number"
                />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Odeme Yontemleri" icon="💳" defaultOpen={false}>
            <div className="space-y-4">
              <FormInput
                label="Kabul Edilen Para Birimleri"
                value={local.currenciesAccepted || ''}
                onChange={(v) => patchLocal({ currenciesAccepted: v })}
                placeholder="EUR"
                helpText="Ornek: EUR, USD"
              />

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Odeme Yontemleri
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PAYMENT_METHODS.map(method => (
                    <label key={method} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={local.paymentAccepted?.includes(method) || false}
                        onChange={(e) => updatePaymentAccepted(method, e.target.checked)}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm text-slate-700">{method}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Address Tab */}
      {activeTab === 'address' && (
        <div className="space-y-4">
          <CollapsibleSection title="Fiziksel Adres" icon="🏠" defaultOpen>
            <div className="space-y-4">
              <FormInput
                label="Sokak Adresi"
                value={local.address?.streetAddress || ''}
                onChange={(v) => updateAddress('streetAddress', v)}
                placeholder="Reyplatz 10"
                required
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Sehir"
                  value={local.address?.addressLocality || ''}
                  onChange={(v) => updateAddress('addressLocality', v)}
                  placeholder="Baesweiler"
                  required
                />
                <FormInput
                  label="Bolge/Eyalet"
                  value={local.address?.addressRegion || ''}
                  onChange={(v) => updateAddress('addressRegion', v)}
                  placeholder="Nordrhein-Westfalen"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Posta Kodu"
                  value={local.address?.postalCode || ''}
                  onChange={(v) => updateAddress('postalCode', v)}
                  placeholder="52499"
                  required
                />
                <FormInput
                  label="Ulke"
                  value={local.address?.addressCountry || ''}
                  onChange={(v) => updateAddress('addressCountry', v)}
                  placeholder="Germany"
                  required
                />
              </div>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Harita Koordinatlari (Geo)" icon="🗺️" defaultOpen={false} badge="Google Maps">
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800">
                <strong>Ipucu:</strong> Google Maps'te isletmenizi bulun, sag tikla ve "Koordinatlari kopyala" secin.
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormInput
                  label="Enlem (Latitude)"
                  value={local.geo?.latitude?.toString() || ''}
                  onChange={(v) => updateGeo('latitude', parseFloat(v) || 0)}
                  placeholder="50.937531"
                  type="number"
                  helpText="Ornek: 50.937531"
                />
                <FormInput
                  label="Boylam (Longitude)"
                  value={local.geo?.longitude?.toString() || ''}
                  onChange={(v) => updateGeo('longitude', parseFloat(v) || 0)}
                  placeholder="6.960279"
                  type="number"
                  helpText="Ornek: 6.960279"
                />
              </div>

              <FormInput
                label="Google Maps URL"
                value={local.hasMap || ''}
                onChange={(v) => patchLocal({ hasMap: v })}
                placeholder="https://maps.google.com/?q=..."
                type="url"
                helpText="Google Maps'te isletme sayfanizin linki"
              />
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Opening Hours Tab */}
      {activeTab === 'hours' && (
        <div className="space-y-4">
          <CollapsibleSection title="Calisma Saatleri" icon="🕐" defaultOpen>
            <div className="space-y-4">
              <div className="p-3 bg-green-50 rounded-lg text-sm text-green-800">
                <strong>Oneri:</strong> Google Business Profile'daki saatlerle ayni olmali.
              </div>

              {(local.openingHoursSpecification || []).map((hours, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Zaman Dilimi {index + 1}</span>
                    <button
                      onClick={() => removeOpeningHours(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Kaldir
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Gunler</label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS_OF_WEEK.map(day => {
                        const isSelected = Array.isArray(hours.dayOfWeek)
                          ? hours.dayOfWeek.includes(day.value)
                          : hours.dayOfWeek === day.value
                        return (
                          <button
                            key={day.value}
                            onClick={() => {
                              let newDays: string | string[]
                              if (Array.isArray(hours.dayOfWeek)) {
                                if (isSelected) {
                                  newDays = hours.dayOfWeek.filter(d => d !== day.value)
                                } else {
                                  newDays = [...hours.dayOfWeek, day.value]
                                }
                              } else {
                                if (isSelected) {
                                  newDays = []
                                } else {
                                  newDays = [hours.dayOfWeek, day.value].filter(Boolean)
                                }
                              }
                              updateOpeningHours(index, 'dayOfWeek', newDays.length === 1 ? newDays[0] : newDays)
                            }}
                            className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
                              isSelected
                                ? 'bg-indigo-500 text-white'
                                : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {day.label}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Acilis</label>
                      <input
                        type="time"
                        value={hours.opens || '09:00'}
                        onChange={(e) => updateOpeningHours(index, 'opens', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Kapanis</label>
                      <input
                        type="time"
                        value={hours.closes || '18:00'}
                        onChange={(e) => updateOpeningHours(index, 'closes', e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addOpeningHours}
                className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
              >
                + Zaman Dilimi Ekle
              </button>

              <div className="p-3 bg-slate-100 rounded-lg">
                <p className="text-xs text-slate-600">
                  <strong>Ornek:</strong> Pazartesi-Cuma 09:00-18:00 icin bir zaman dilimi, Cumartesi 10:00-16:00 icin ayri bir zaman dilimi olusturun.
                </p>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className="space-y-4">
          <CollapsibleSection title="Sosyal Medya & Web Profilleri" icon="🔗" defaultOpen>
            <div className="space-y-4">
              <div className="p-3 bg-purple-50 rounded-lg text-sm text-purple-800">
                <strong>Onerilir:</strong> Tum aktif sosyal medya profillerinizi ekleyin. Bu Google'in isletmenizi dogrulamasina yardimci olur.
              </div>

              {(local.sameAs || []).map((link, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="url"
                    value={link}
                    onChange={(e) => updateSameAs(index, e.target.value)}
                    placeholder="https://instagram.com/wellnesstal"
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => removeSocialLink(index)}
                    className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    Sil
                  </button>
                </div>
              ))}

              <button
                onClick={addSocialLink}
                className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
              >
                + Sosyal Medya Linki Ekle
              </button>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                <div>- Instagram</div>
                <div>- Facebook</div>
                <div>- Twitter/X</div>
                <div>- LinkedIn</div>
                <div>- YouTube</div>
                <div>- TikTok</div>
                <div>- Pinterest</div>
                <div>- Yelp</div>
              </div>
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="space-y-4">
          <CollapsibleSection title="Sunulan Hizmetler" icon="💆" defaultOpen>
            <div className="space-y-4">
              <div className="p-3 bg-pink-50 rounded-lg text-sm text-pink-800">
                <strong>SEO Avantaji:</strong> Hizmetlerinizi eklemek, Google'da aranabilirliginizi arttirir.
              </div>

              {(local.availableService || []).map((service, index) => (
                <div key={index} className="p-4 bg-slate-50 rounded-lg space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-700">Hizmet {index + 1}</span>
                    <button
                      onClick={() => removeService(index)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Kaldir
                    </button>
                  </div>

                  <FormInput
                    label="Hizmet Adi"
                    value={service.name || ''}
                    onChange={(v) => updateService(index, 'name', v)}
                    placeholder="Klasik Masaj"
                    required
                  />

                  <FormTextarea
                    label="Aciklama"
                    value={service.description || ''}
                    onChange={(v) => updateService(index, 'description', v)}
                    placeholder="Geleneksel masaj teknikleriyle..."
                    rows={2}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormInput
                      label="Fiyat"
                      value={service.offers?.price || ''}
                      onChange={(v) => updateService(index, 'price', v)}
                      placeholder="89.00"
                    />
                    <FormSelect
                      label="Para Birimi"
                      value={service.offers?.priceCurrency || 'EUR'}
                      onChange={(v) => updateService(index, 'priceCurrency', v)}
                      options={[
                        { value: 'EUR', label: 'EUR (€)' },
                        { value: 'USD', label: 'USD ($)' },
                        { value: 'GBP', label: 'GBP (£)' },
                        { value: 'CHF', label: 'CHF (Fr.)' },
                      ]}
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addService}
                className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
              >
                + Hizmet Ekle
              </button>
            </div>
          </CollapsibleSection>
        </div>
      )}

      {/* Amenities Tab */}
      {activeTab === 'amenities' && (
        <div className="space-y-4">
          <CollapsibleSection title="Isletme Olanaklari" icon="✨" defaultOpen>
            <div className="space-y-4">
              <div className="p-3 bg-teal-50 rounded-lg text-sm text-teal-800">
                <strong>Ipucu:</strong> Musterilerin aradigi ozellikleri ekleyin (WiFi, Otopark, Engelli Erisimi vs.)
              </div>

              {/* Quick Add Common Amenities */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hizli Ekle</label>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_AMENITIES.filter(a =>
                    !local.amenityFeature?.some(af => af.name === a)
                  ).slice(0, 8).map(amenity => (
                    <button
                      key={amenity}
                      onClick={() => addAmenity(amenity)}
                      className="px-3 py-1 text-xs bg-slate-100 hover:bg-indigo-100 text-slate-700 hover:text-indigo-700 rounded-full transition-colors"
                    >
                      + {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current Amenities */}
              {(local.amenityFeature || []).map((amenity, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <input
                    type="checkbox"
                    checked={amenity.value}
                    onChange={(e) => updateAmenity(index, 'value', e.target.checked)}
                    className="w-5 h-5 text-green-600 rounded"
                  />
                  <input
                    type="text"
                    value={amenity.name}
                    onChange={(e) => updateAmenity(index, 'name', e.target.value)}
                    placeholder="Ozellik adi"
                    className="flex-1 px-3 py-1.5 border border-slate-300 rounded-lg text-sm"
                  />
                  <button
                    onClick={() => removeAmenity(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}

              <button
                onClick={() => addAmenity()}
                className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
              >
                + Ozel Ozellik Ekle
              </button>
            </div>
          </CollapsibleSection>
        </div>
      )}
    </div>
  )
}
