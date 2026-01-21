'use client'

import { useState, useEffect, useCallback, useMemo, useRef } from 'react'

import { SEOContent, SEORobotsDirectives, SEOOpenGraph, SEOTwitterCard, SchemaLocalBusiness } from '../types'

import LocalBusinessEditor from './seo/LocalBusinessEditor'

interface SEOBlockEditorProps {
  content: SEOContent
  onUpdate: (content: Partial<SEOContent>) => void
}

// Default values
const defaultContent: SEOContent = {
  useGlobalSEO: false,
  title: '',
  titleTemplate: '%s | Wellnesstal',
  description: '',
  keywords: [],
  author: 'Wellnesstal',
  canonicalUrl: '',
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    maxSnippet: -1,
    maxImagePreview: 'large',
    maxVideoPreview: -1
  },
  openGraph: {
    enabled: true,
    type: 'website',
    siteName: 'Wellnesstal',
    locale: 'de_DE'
  },
  twitter: {
    enabled: true,
    cardType: 'summary_large_image'
  },
  schema: {
    localBusiness: {
      enabled: true,
      '@type': 'DaySpa',
      name: 'Wellnesstal',
      priceRange: '€€'
    }
  },
  sitemap: {
    include: true,
    priority: 0.8,
    changeFrequency: 'weekly'
  }
}

// SEO Score Calculator
function calculateSEOScore(content: SEOContent): {
  score: number
  titleScore: number
  descriptionScore: number
  socialScore: number
  schemaScore: number
  technicalScore: number
  issues: { type: 'error' | 'warning' | 'info', message: string }[]
} {
  const issues: { type: 'error' | 'warning' | 'info', message: string }[] = []
  let titleScore = 0
  let descriptionScore = 0
  let socialScore = 0
  let schemaScore = 0
  let technicalScore = 0

  // Title analysis (30 points max)
  const titleLength = content.title?.length || 0
  if (titleLength === 0) {
    issues.push({ type: 'error', message: 'Title eksik - mutlaka ekleyin' })
  } else if (titleLength < 30) {
    issues.push({ type: 'warning', message: 'Title çok kısa (min. 30 karakter önerilir)' })
    titleScore = 15
  } else if (titleLength > 60) {
    issues.push({ type: 'warning', message: 'Title çok uzun (max. 60 karakter önerilir)' })
    titleScore = 20
  } else {
    titleScore = 30
  }

  // Description analysis (25 points max)
  const descLength = content.description?.length || 0
  if (descLength === 0) {
    issues.push({ type: 'error', message: 'Description eksik - mutlaka ekleyin' })
  } else if (descLength < 120) {
    issues.push({ type: 'warning', message: 'Description çok kısa (min. 120 karakter önerilir)' })
    descriptionScore = 12
  } else if (descLength > 160) {
    issues.push({ type: 'warning', message: 'Description çok uzun (max. 160 karakter önerilir)' })
    descriptionScore = 18
  } else {
    descriptionScore = 25
  }

  // Social media (15 points max)
  if (content.openGraph?.enabled) {
    socialScore += 5
    if (content.openGraph.image?.url) {
socialScore += 5
}
  } else {
    issues.push({ type: 'warning', message: 'Open Graph etkin değil - sosyal paylaşımlar için açın' })
  }
  if (content.twitter?.enabled) {
    socialScore += 5
  }

  // Schema.org (20 points max)
  if (content.schema?.localBusiness?.enabled) {
    schemaScore += 10
    if (content.schema.localBusiness.address) {
schemaScore += 5
}
    if (content.schema.localBusiness.telephone) {
schemaScore += 5
}
  } else {
    issues.push({ type: 'info', message: 'LocalBusiness schema ekleyin - Google haritada görünüm için' })
  }

  // Technical (10 points max)
  if (content.robots?.index && content.robots?.follow) {
    technicalScore += 5
  }
  if (content.canonicalUrl) {
    technicalScore += 5
  } else {
    issues.push({ type: 'info', message: 'Canonical URL ekleyin - duplicate content önlemek için' })
  }

  const score = titleScore + descriptionScore + socialScore + schemaScore + technicalScore

  return {
    score,
    titleScore,
    descriptionScore,
    socialScore,
    schemaScore,
    technicalScore,
    issues
  }
}

// Character Counter Component
function CharCounter({ current, min, max, optimal }: { current: number, min: number, max: number, optimal?: { min: number, max: number } }) {
  let color = 'text-slate-500'
  if (current < min) {
color = 'text-red-500'
} else if (current > max) {
color = 'text-orange-500'
} else if (optimal && current >= optimal.min && current <= optimal.max) {
color = 'text-green-500'
}

  return (
    <span className={`text-xs ${color}`}>
      {current} / {max} karakter
      {optimal && <span className="text-slate-400"> (ideal: {optimal.min}-{optimal.max})</span>}
    </span>
  )
}

// Google SERP Preview
function SERPPreview({ title, description, url }: { title: string, description: string, url: string }) {
  const displayUrl = url || 'wellnesstal.de/sayfa'
  const displayTitle = title.slice(0, 60) || 'Sayfa Başlığı'
  const displayDesc = description.slice(0, 160) || 'Sayfa açıklaması burada görünecek...'

  return (
    <div className="bg-white p-4 rounded-xl border border-slate-200">
      <p className="text-xs text-slate-500 mb-2">Google Arama Sonucu Önizlemesi</p>
      <div className="font-sans">
        <p className="text-sm text-green-700 mb-1">{displayUrl}</p>
        <h3 className="text-xl text-blue-800 hover:underline cursor-pointer mb-1">
          {displayTitle}
        </h3>
        <p className="text-sm text-slate-600 leading-relaxed">
          {displayDesc}
        </p>
      </div>
    </div>
  )
}

// Social Media Preview
function SocialPreview({ type, title, description, image, siteName }: {
  type: 'facebook' | 'twitter'
  title: string
  description: string
  image?: string
  siteName?: string
}) {
  const bgColor = type === 'facebook' ? 'bg-[#f0f2f5]' : 'bg-black'
  const [imageError, setImageError] = useState(false)
  const hasValidImage = image?.trim() && !imageError

  // Reset error state when image URL changes
  useEffect(() => {
    setImageError(false)
  }, [image])

  return (
    <div className={`${bgColor} p-4 rounded-xl`}>
      <p className="text-xs text-slate-500 mb-2">
        {type === 'facebook' ? 'Facebook' : 'Twitter/X'} Paylaşım Önizlemesi
      </p>
      <div className={`bg-white rounded-lg overflow-hidden shadow-sm ${type === 'twitter' ? 'border border-slate-200' : ''}`}>
        {hasValidImage ? (
          <div className="h-40 bg-slate-200 flex items-center justify-center relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="OG Image"
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              onLoad={() => setImageError(false)}
            />
          </div>
        ) : (
          <div className="h-40 bg-gradient-to-br from-sage-100 to-sage-200 flex items-center justify-center">
            <span className="text-4xl">🖼️</span>
          </div>
        )}
        <div className="p-3">
          {siteName && <p className="text-xs text-slate-500 uppercase">{siteName}</p>}
          <h4 className="font-semibold text-slate-900 line-clamp-2">{title || 'Başlık'}</h4>
          <p className="text-sm text-slate-600 line-clamp-2 mt-1">{description || 'Açıklama'}</p>
        </div>
      </div>
    </div>
  )
}

// SEO Score Display
function SEOScoreDisplay({ score, issues }: { score: ReturnType<typeof calculateSEOScore>, issues?: boolean }) {
  const getColor = (s: number) => {
    if (s >= 80) {
return { bg: 'bg-green-500', text: 'text-green-600', ring: 'ring-green-200' }
}
    if (s >= 60) {
return { bg: 'bg-yellow-500', text: 'text-yellow-600', ring: 'ring-yellow-200' }
}
    if (s >= 40) {
return { bg: 'bg-orange-500', text: 'text-orange-600', ring: 'ring-orange-200' }
}
    return { bg: 'bg-red-500', text: 'text-red-600', ring: 'ring-red-200' }
  }

  const colors = getColor(score.score)

  return (
    <div className="space-y-4">
      {/* Main Score */}
      <div className="flex items-center gap-6">
        <div className={`relative w-24 h-24 rounded-full ${colors.ring} ring-8`}>
          <svg className="w-24 h-24 transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              className="text-slate-200"
            />
            <circle
              cx="48"
              cy="48"
              r="40"
              stroke="currentColor"
              strokeWidth="8"
              fill="none"
              strokeDasharray={`${(score.score / 100) * 251.2} 251.2`}
              className={colors.text}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-2xl font-bold ${colors.text}`}>{score.score}</span>
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Title</span>
            <span className="font-medium">{score.titleScore}/30</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Description</span>
            <span className="font-medium">{score.descriptionScore}/25</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Sosyal Medya</span>
            <span className="font-medium">{score.socialScore}/15</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Schema.org</span>
            <span className="font-medium">{score.schemaScore}/20</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Teknik</span>
            <span className="font-medium">{score.technicalScore}/10</span>
          </div>
        </div>
      </div>

      {/* Issues */}
      {issues && score.issues.length > 0 && (
        <div className="space-y-2 pt-4 border-t">
          {score.issues.map((issue, i) => (
            <div
              key={i}
              className={`flex items-start gap-2 p-2 rounded-lg text-sm ${
                issue.type === 'error' ? 'bg-red-50 text-red-700' :
                issue.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                'bg-blue-50 text-blue-700'
              }`}
            >
              <span>
                {issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️'}
              </span>
              <span>{issue.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Main Editor Component
export default function SEOBlockEditor({ content, onUpdate }: SEOBlockEditorProps) {
  const [localContent, setLocalContent] = useState<SEOContent>({
    ...defaultContent,
    ...content
  })
  // const [, setExpandedSections] = useState<string[]>(['meta', 'preview'])
  const [activeTab, setActiveTab] = useState<'meta' | 'social' | 'schema' | 'technical' | 'advanced'>('meta')
  const [keywordInput, setKeywordInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const localContentRef = useRef(localContent)
  const onUpdateRef = useRef(onUpdate)
  const isInitialMount = useRef(true)

  // Keep refs in sync
  useEffect(() => {
    localContentRef.current = localContent
    onUpdateRef.current = onUpdate
  })

  // Sync localContent when content prop changes (e.g., from server/API refresh)
  useEffect(() => {
    if (isInitialMount.current) {
      return // Skip on initial mount
    }

    try {
      const incomingStr = JSON.stringify({ ...defaultContent, ...content })
      const currentStr = JSON.stringify(localContent)
      if (incomingStr !== currentStr) {
        // Content prop changed, update local state
        const merged = { ...defaultContent, ...content }
        setLocalContent(merged)
        // Reset lastSaved to avoid false dirty state
        lastSavedRef.current = JSON.stringify(merged)
      }
    } catch (e) {
      // If stringify fails, update anyway
      setLocalContent({ ...defaultContent, ...content })
    }
  }, [JSON.stringify(content)]) // Deep comparison via JSON

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastSavedRef = useRef<string | null>(null)

  // Debounced update with deep comparison to avoid excessive updates
  // Skip the very first effect run to avoid overwriting server state with defaults on mount
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      // Initialize lastSaved with current content to avoid false dirty state
      try {
        lastSavedRef.current = JSON.stringify(localContent)
      } catch (e) {}
      return
    }

    // Check if content actually changed
    try {
      const currentStr = JSON.stringify(localContent)
      if (lastSavedRef.current === currentStr) {
        return // No changes, skip update
      }
    } catch (e) {
      // If stringify fails, proceed with update
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      try {
        // Validate before saving
        const validationErrors: Record<string, string> = {}

        // Validate canonical URL
        if (localContent.canonicalUrl) {
          const urlError = validateUrl(localContent['canonicalUrl'] || '')
          if (urlError) {
            validationErrors['canonicalUrl'] = urlError
}
        }

        // Validate OG Image
        if (localContent.openGraph?.image?.url) {
          const imageError = validateImageUrl(localContent.openGraph.image.url)
          if (imageError) {
validationErrors['ogImage'] = imageError
}
        }

        // Validate Twitter Image
        if (localContent.twitter?.image?.url) {
          const imageError = validateImageUrl(localContent.twitter.image.url)
          if (imageError) {
validationErrors['twitterImage'] = imageError
}
        }

        setErrors(validationErrors)

        // Only save if no validation errors
        if (Object.keys(validationErrors).length === 0) {
          setSaveStatus('saving')
          console.debug('[debug][SEOBlockEditor] debounced onUpdate', {
            keys: Object.keys(localContent || {}),
            preview: {
              title: localContent.title,
              meta_description: localContent.description,
            }
          })
          onUpdateRef.current(localContent)
          // Mark as saved
          try {
            lastSavedRef.current = JSON.stringify(localContent)
            setSaveStatus('saved')
            setTimeout(() => setSaveStatus('idle'), 2000)
          } catch (e) {
            setSaveStatus('error')
          }
        } else {
          setSaveStatus('error')
        }
      } catch (e) {
        console.error('[debug][SEOBlockEditor] onUpdate error', e)
        setSaveStatus('error')
      }
      debounceTimerRef.current = null
    }, 300) // 300ms - fast enough to save frequently, slow enough to debounce

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }
    }
  }, [JSON.stringify(localContent)]) // Deep comparison via JSON

  // Flush pending changes on unmount (when switching blocks)
  // Only flush if there are actual unsaved changes
  useEffect(() => {
    return () => {
      // Clear debounce timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
        debounceTimerRef.current = null
      }

      // Flush pending changes if they exist
      try {
        const currentStr = JSON.stringify(localContentRef.current)
        if (lastSavedRef.current !== currentStr) {
          // There are unsaved changes, flush them immediately
          console.debug('[debug][SEOBlockEditor] flushing pending changes on unmount')
          onUpdateRef.current(localContentRef.current)
        }
      } catch (e) {
        // If comparison fails, flush anyway to be safe
        console.debug('[debug][SEOBlockEditor] flushing on unmount (comparison failed)')
        onUpdateRef.current(localContentRef.current)
      }
    }
  }, []) // Only run on unmount

  // Save data when page is about to refresh/close
  // NOTE: disabled beforeunload auto-save; rely on explicit save or debounced saves

  const updateContent = useCallback((updates: Partial<SEOContent>) => {
    setLocalContent(prev => ({ ...prev, ...updates }))
  }, [])

  const updateRobots = useCallback((updates: Partial<SEORobotsDirectives>) => {
    setLocalContent(prev => ({
      ...prev,
      robots: { ...prev.robots, ...updates }
    }))
  }, [])

  const updateOpenGraph = useCallback((updates: Partial<SEOOpenGraph>) => {
    setLocalContent(prev => ({
      ...prev,
      openGraph: { ...prev.openGraph, ...updates }
    }))
  }, [])

  const updateTwitter = useCallback((updates: Partial<SEOTwitterCard>) => {
    setLocalContent(prev => ({
      ...prev,
      twitter: { ...prev.twitter, ...updates }
    }))
  }, [])

  const updateLocalBusiness = useCallback((updates: Partial<SchemaLocalBusiness>) => {
    setLocalContent(prev => ({
      ...prev,
      schema: {
        ...prev.schema,
        localBusiness: { ...prev.schema?.localBusiness, ...updates } as SchemaLocalBusiness
      }
    }))
  }, [])

  // Calculate SEO score
  const seoScore = useMemo(() => calculateSEOScore(localContent), [localContent])

  // Toggle section - unused for now
  // const toggleSection = (section: string) => {
  //   setExpandedSections(prev =>
  //     prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
  //   )
  // }

  // Validation functions
  // const validateEmail = (email: string): string | null => {
  //   if (!email) return null
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  //   return emailRegex.test(email) ? null : 'Geçerli bir e-posta adresi giriniz'
  // }

  // const validatePhone = (phone: string): string | null => {
  //   if (!phone) return null
  //   const phoneRegex = /^[\d\s\-\+\(\)]+$/
  //   return phoneRegex.test(phone) ? null : 'Geçerli bir telefon numarası giriniz'
  // }

  const validateUrl = (url: string): string | null => {
    if (!url) {
return null
}
    try {
      new URL(url)
      return null
    } catch {
      return 'Geçerli bir URL girin (örn: https://example.com)'
    }
  }

  // const validateEmail = (email: string): string | null => {
  //   if (!email) {
  //     return null
  //   }
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  //   return emailRegex.test(email) ? null : 'Geçerli bir e-posta adresi girin'
  // }

  // const validatePhone = (phone: string): string | null => {
  //   if (!phone) {
  //     return null
  //   }
  //   const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/
  //   return phoneRegex.test(phone.replace(/\s/g, '')) ? null : 'Geçerli bir telefon numarası girin'
  // }

  const validateImageUrl = (url: string): string | null => {
    if (!url) {
return null
}
    const urlError = validateUrl(url)
    if (urlError) {
return urlError
}
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
    const hasImageExt = imageExtensions.some(ext => url.toLowerCase().includes(ext))
    if (!hasImageExt) {
      return 'Geçerli bir görsel URL\'si girin (jpg, png, gif, webp, svg)'
    }
    return null
  }

  // Add keyword with validation
  const addKeyword = () => {
    const trimmed = keywordInput.trim()
    if (!trimmed) {
      setErrors(prev => ({ ...prev, keyword: 'Anahtar kelime boş olamaz' }))
      return
    }
    if (localContent.keywords?.includes(trimmed)) {
      setErrors(prev => ({ ...prev, keyword: 'Bu anahtar kelime zaten ekli' }))
      return
    }
    if (localContent.keywords && localContent.keywords.length >= 10) {
      setErrors(prev => ({ ...prev, keyword: 'Maksimum 10 anahtar kelime ekleyebilirsiniz' }))
      return
    }
    updateContent({ keywords: [...(localContent.keywords || []), trimmed] })
    setKeywordInput('')
    setErrors(prev => ({ ...prev, keyword: '' }))
  }

  // Remove keyword
  const removeKeyword = (keyword: string) => {
    updateContent({ keywords: localContent.keywords?.filter(k => k !== keyword) })
  }

  const useGlobalSEO = localContent.useGlobalSEO

  return (
    <div className="space-y-4">
      {/* Global SEO Toggle */}
      <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg">
              🔍
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">SEO Kaynağı</h3>
              <p className="text-sm text-slate-500">
                {useGlobalSEO
                  ? 'Global SEO ayarları kullanılıyor'
                  : 'Bu sayfaya özel SEO ayarları'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`text-sm font-medium ${useGlobalSEO ? 'text-indigo-600' : 'text-slate-400'}`}>
              Global
            </span>
            <button
              onClick={() => updateContent({ useGlobalSEO: !useGlobalSEO })}
              className={`relative w-14 h-7 rounded-full transition-colors duration-300 ${
                useGlobalSEO ? 'bg-indigo-500' : 'bg-slate-300'
              }`}
            >
              <div className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${
                useGlobalSEO ? 'left-8' : 'left-1'
              }`} />
            </button>
            <span className={`text-sm font-medium ${!useGlobalSEO ? 'text-purple-600' : 'text-slate-400'}`}>
              Özel
            </span>
          </div>
        </div>
      </div>

      {/* Custom SEO Settings */}
      {!useGlobalSEO && (
        <>
          {/* Save Status Indicator */}
          {saveStatus !== 'idle' && (
            <div className={`p-3 rounded-xl border ${
              saveStatus === 'saving' ? 'bg-blue-50 border-blue-200 text-blue-700' :
              saveStatus === 'saved' ? 'bg-green-50 border-green-200 text-green-700' :
              'bg-red-50 border-red-200 text-red-700'
            }`}>
              <div className="flex items-center gap-2">
                {saveStatus === 'saving' && <span className="animate-spin">⏳</span>}
                {saveStatus === 'saved' && <span>✓</span>}
                {saveStatus === 'error' && <span>✗</span>}
                <span className="text-sm font-medium">
                  {saveStatus === 'saving' && 'Kaydediliyor...'}
                  {saveStatus === 'saved' && 'Başarıyla kaydedildi!'}
                  {saveStatus === 'error' && 'Kaydetme hatası - Lütfen formu kontrol edin'}
                </span>
              </div>
            </div>
          )}

          {/* SEO Score Card */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📊</span>
              <h3 className="font-semibold text-slate-800">SEO Skor</h3>
            </div>
            <SEOScoreDisplay score={seoScore} issues />
          </div>

          {/* Tabs */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            {[
              { id: 'meta', label: 'Meta', icon: '📝' },
              { id: 'social', label: 'Sosyal', icon: '📱' },
              { id: 'schema', label: 'Schema', icon: '🏢' },
              { id: 'technical', label: 'Teknik', icon: '⚙️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Meta Tab */}
          {activeTab === 'meta' && (
            <div className="space-y-4">
              {/* Title */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sayfa Başlığı (Title) *
                </label>
                <input
                  type="text"
                  value={localContent.title || ''}
                  onChange={(e) => {
                    updateContent({ title: e.target.value })
                    setErrors(prev => ({ ...prev, title: '' }))
                  }}
                  placeholder="Sayfa başlığınızı girin..."
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                    errors.title ? 'border-red-300' : 'border-slate-300'
                  }`}
                  maxLength={70}
                  required
                />
                {errors.title && (
                  <p className="text-xs text-red-500 mt-1">{errors.title}</p>
                )}
                <div className="flex justify-between mt-2">
                  <CharCounter current={localContent.title?.length || 0} min={30} max={60} optimal={{ min: 50, max: 60 }} />
                  <span className={`text-xs ${(localContent.title?.length || 0) >= 30 && (localContent.title?.length || 0) <= 60 ? 'text-green-500' : 'text-orange-500'}`}>
                    {(localContent.title?.length || 0) >= 30 && (localContent.title?.length || 0) <= 60 ? '✓ İdeal uzunluk' : 'Uzunluğu ayarlayın'}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Meta Açıklama (Description) *
                </label>
                <textarea
                  value={localContent.description || ''}
                  onChange={(e) => updateContent({ description: e.target.value })}
                  placeholder="Sayfa açıklamanızı girin..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  rows={3}
                  maxLength={200}
                />
                <div className="flex justify-between mt-2">
                  <CharCounter current={localContent.description?.length || 0} min={120} max={160} optimal={{ min: 140, max: 155 }} />
                  <span className={`text-xs ${(localContent.description?.length || 0) >= 120 && (localContent.description?.length || 0) <= 160 ? 'text-green-500' : 'text-orange-500'}`}>
                    {(localContent.description?.length || 0) >= 120 && (localContent.description?.length || 0) <= 160 ? '✓ İdeal uzunluk' : 'Uzunluğu ayarlayın'}
                  </span>
                </div>
              </div>

              {/* Keywords */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Anahtar Kelimeler
                </label>
                <div className="flex gap-2 mb-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={keywordInput}
                      onChange={(e) => {
                        setKeywordInput(e.target.value)
                        setErrors(prev => ({ ...prev, keyword: '' }))
                      }}
                      onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                      placeholder="Anahtar kelime ekle..."
                      className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                        errors.keyword ? 'border-red-300' : 'border-slate-300'
                      }`}
                    />
                    {errors.keyword && (
                      <p className="text-xs text-red-500 mt-1">{errors.keyword}</p>
                    )}
                  </div>
                  <button
                    onClick={addKeyword}
                    className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                  >
                    Ekle
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {localContent.keywords?.map((keyword, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm"
                    >
                      {keyword}
                      <button
                        onClick={() => removeKeyword(keyword)}
                        className="ml-1 text-indigo-500 hover:text-indigo-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* SERP Preview */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <SERPPreview
                  title={localContent.title || ''}
                  description={localContent.description || ''}
                  url={localContent['canonicalUrl'] || ''}
                />
              </div>
            </div>
          )}

          {/* Social Tab */}
          {activeTab === 'social' && (
            <div className="space-y-4">
              {/* Open Graph */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">📘</span>
                    <h4 className="font-medium text-slate-800">Open Graph (Facebook/LinkedIn)</h4>
                  </div>
                  <button
                    onClick={() => updateOpenGraph({ enabled: !localContent.openGraph?.enabled })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      localContent.openGraph?.enabled ? 'bg-blue-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      localContent.openGraph?.enabled ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                {localContent.openGraph?.enabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">OG Title (boş = meta title)</label>
                      <input
                        type="text"
                        value={localContent.openGraph?.title || ''}
                        onChange={(e) => updateOpenGraph({ title: e.target.value })}
                        placeholder={localContent.title || 'Sayfa başlığı'}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        maxLength={95}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {localContent.openGraph?.title?.length || 0}/95 karakter
                        {localContent.openGraph?.title && localContent.openGraph.title.length > 95 && (
                          <span className="text-red-500"> - Çok uzun!</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">OG Description (boş = meta description)</label>
                      <textarea
                        value={localContent.openGraph?.description || ''}
                        onChange={(e) => updateOpenGraph({ description: e.target.value })}
                        placeholder={localContent.description || 'Sayfa açıklaması'}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        rows={2}
                        maxLength={200}
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        {localContent.openGraph?.description?.length || 0}/200 karakter
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">OG Image Width (px)</label>
                      <input
                        type="number"
                        value={localContent.openGraph?.image?.width || 1200}
                        onChange={(e) => updateOpenGraph({
                          image: {
                            ...localContent.openGraph?.image,
                            url: localContent.openGraph?.image?.url || '',
                            width: parseInt(e.target.value) || 1200
                          }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        min={200}
                        max={2400}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">OG Image Height (px)</label>
                      <input
                        type="number"
                        value={localContent.openGraph?.image?.height || 630}
                        onChange={(e) => updateOpenGraph({
                          image: {
                            ...localContent.openGraph?.image,
                            url: localContent.openGraph?.image?.url || '',
                            height: parseInt(e.target.value) || 630
                          }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        min={200}
                        max={2400}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">OG Image Alt Text</label>
                      <input
                        type="text"
                        value={localContent.openGraph?.image?.alt || ''}
                        onChange={(e) => updateOpenGraph({
                          image: {
                            ...localContent.openGraph?.image,
                            url: localContent.openGraph?.image?.url || '',
                            alt: e.target.value
                          }
                        })}
                        placeholder="Görsel açıklaması"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        maxLength={125}
                      />
                      <p className="text-xs text-slate-500 mt-1">Erişilebilirlik için önemli</p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">OG Type</label>
                      <select
                        value={localContent.openGraph?.type || 'website'}
                        onChange={(e) => updateOpenGraph({ type: e.target.value as any })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="website">Website (Genel)</option>
                        <option value="article">Article (Makale/Blog)</option>
                        <option value="product">Product (Ürün)</option>
                        <option value="video">Video</option>
                        <option value="book">Book (Kitap)</option>
                        <option value="profile">Profile (Profil)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Locale</label>
                      <select
                        value={localContent.openGraph?.locale || 'de_DE'}
                        onChange={(e) => updateOpenGraph({ locale: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="de_DE">de_DE (Almanca - Almanya)</option>
                        <option value="en_US">en_US (İngilizce - ABD)</option>
                        <option value="en_GB">en_GB (İngilizce - İngiltere)</option>
                        <option value="tr_TR">tr_TR (Türkçe - Türkiye)</option>
                        <option value="fr_FR">fr_FR (Fransızca - Fransa)</option>
                        <option value="es_ES">es_ES (İspanyolca - İspanya)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">OG Image URL</label>
                      <input
                        type="url"
                        value={localContent.openGraph?.image?.url || ''}
                        onChange={(e) => {
                          const url = e.target.value
                          updateOpenGraph({ image: { ...localContent.openGraph?.image, url } })
                          const error = validateImageUrl(url)
                          setErrors(prev => ({ ...prev, ogImage: error || '' }))
                        }}
                        placeholder="https://example.com/image.jpg"
                        className={`w-full px-3 py-2 border rounded-lg text-sm ${
                          errors['ogImage'] ? 'border-red-300' : 'border-slate-300'
                        }`}
                      />
                      {errors['ogImage'] && (
                        <p className="text-xs text-red-500 mt-1">{errors['ogImage']}</p>
                      )}
                      <p className="text-xs text-slate-500 mt-1">
                        Önerilen: 1200x630px (Facebook/LinkedIn için ideal)
                        {localContent.openGraph?.image?.url && (
                          <span className="block mt-1 text-green-600">✓ Görsel URL doğrulandı</span>
                        )}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Site Adı</label>
                      <input
                        type="text"
                        value={localContent.openGraph?.siteName || ''}
                        onChange={(e) => updateOpenGraph({ siteName: e.target.value })}
                        placeholder="Wellnesstal"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Twitter Card */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🐦</span>
                    <h4 className="font-medium text-slate-800">Twitter Card</h4>
                  </div>
                  <button
                    onClick={() => updateTwitter({ enabled: !localContent.twitter?.enabled })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      localContent.twitter?.enabled ? 'bg-sky-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      localContent.twitter?.enabled ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                {localContent.twitter?.enabled && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">Card Tipi</label>
                      <select
                        value={localContent.twitter?.cardType || 'summary_large_image'}
                        onChange={(e) => updateTwitter({ cardType: e.target.value as any })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary Large Image (Önerilen)</option>
                        <option value="app">App</option>
                        <option value="player">Player</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">@site</label>
                      <input
                        type="text"
                        value={localContent.twitter?.site || ''}
                        onChange={(e) => updateTwitter({ site: e.target.value })}
                        placeholder="@wellnesstal"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Social Previews */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SocialPreview
                  type="facebook"
                  title={localContent.openGraph?.title || localContent.title || ''}
                  description={localContent.openGraph?.description || localContent.description || ''}
                  image={localContent.openGraph?.image?.url}
                  siteName={localContent.openGraph?.siteName}
                />
                <SocialPreview
                  type="twitter"
                  title={localContent.twitter?.title || localContent.title || ''}
                  description={localContent.twitter?.description || localContent.description || ''}
                  image={localContent.twitter?.image?.url || localContent.openGraph?.image?.url}
                />
              </div>
            </div>
          )}

          {/* Schema Tab */}
          {activeTab === 'schema' && (
            <div className="space-y-4">
              {/* LocalBusiness Schema Toggle */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🏢</span>
                    <div>
                      <h4 className="font-medium text-slate-800">LocalBusiness Schema</h4>
                      <p className="text-xs text-slate-500">Google Maps & sag panel icin kritik</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateLocalBusiness({ enabled: !localContent.schema?.localBusiness?.enabled })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      localContent.schema?.localBusiness?.enabled ? 'bg-green-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      localContent.schema?.localBusiness?.enabled ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                {/* Enterprise LocalBusiness Editor */}
                {localContent.schema?.localBusiness?.enabled && (
                  <LocalBusinessEditor
                    data={localContent.schema.localBusiness}
                    onUpdate={updateLocalBusiness}
                  />
                )}
              </div>

              {/* FAQ Schema */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">❓</span>
                    <div>
                      <h4 className="font-medium text-slate-800">FAQ Schema</h4>
                      <p className="text-xs text-slate-500">Google'da FAQ snippet'leri için</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateContent({
                      schema: {
                        ...localContent.schema,
                        faq: {
                          enabled: !localContent.schema?.faq?.enabled,
                          questions: localContent.schema?.faq?.questions || []
                        }
                      }
                    })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      localContent.schema?.faq?.enabled ? 'bg-green-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      localContent.schema?.faq?.enabled ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                {localContent.schema?.faq?.enabled && (
                  <div className="space-y-3 mt-4">
                    {(localContent.schema.faq?.questions || []).map((q, i) => (
                      <div key={i} className="p-3 bg-slate-50 rounded-lg space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-slate-700">Soru {i + 1}</span>
                          <button
                            onClick={() => updateContent({
                              schema: {
                                ...localContent.schema,
                                faq: {
                                  ...localContent.schema.faq,
                                  enabled: localContent.schema.faq?.enabled ?? true,
                                  questions: (localContent.schema.faq?.questions || []).filter((_, idx) => idx !== i)
                                }
                              }
                            })}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Sil
                          </button>
                        </div>
                        <input
                          type="text"
                          value={q.question || ''}
                          onChange={(e) => {
                            const questions = [...(localContent.schema.faq?.questions || [])]
                            questions[i] = { ...questions[i], question: e.target.value, answer: questions[i]?.answer || '' }
                            updateContent({
                              schema: {
                                ...localContent.schema,
                                faq: { ...localContent.schema.faq, enabled: localContent.schema.faq?.enabled ?? true, questions }
                              }
                            })
                          }}
                          placeholder="Soru..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                        />
                        <textarea
                          value={q.answer || ''}
                          onChange={(e) => {
                            const questions = [...(localContent.schema.faq?.questions || [])]
                            questions[i] = { ...questions[i], answer: e.target.value, question: questions[i]?.question || '' }
                            updateContent({
                              schema: {
                                ...localContent.schema,
                                faq: { ...localContent.schema.faq, enabled: localContent.schema.faq?.enabled ?? true, questions }
                              }
                            })
                          }}
                          placeholder="Cevap..."
                          className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                          rows={2}
                        />
                      </div>
                    ))}
                    <button
                      onClick={() => updateContent({
                        schema: {
                          ...localContent.schema,
                          faq: {
                            ...localContent.schema.faq,
                            enabled: localContent.schema.faq?.enabled ?? true,
                            questions: [...(localContent.schema.faq?.questions || []), { question: '', answer: '' }]
                          }
                        }
                      })}
                      className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                    >
                      + Soru Ekle
                    </button>
                  </div>
                )}
              </div>

              {/* Breadcrumb Schema */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🍞</span>
                    <div>
                      <h4 className="font-medium text-slate-800">Breadcrumb Schema</h4>
                      <p className="text-xs text-slate-500">Sayfa hiyerarşisi için</p>
                    </div>
                  </div>
                  <button
                    onClick={() => updateContent({
                      schema: {
                        ...localContent.schema,
                        breadcrumb: {
                          enabled: !localContent.schema?.breadcrumb?.enabled,
                          autoGenerate: localContent.schema?.breadcrumb?.autoGenerate ?? true,
                          items: localContent.schema?.breadcrumb?.items || []
                        }
                      }
                    })}
                    className={`relative w-12 h-6 rounded-full transition-colors ${
                      localContent.schema?.breadcrumb?.enabled ? 'bg-green-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      localContent.schema?.breadcrumb?.enabled ? 'left-7' : 'left-1'
                    }`} />
                  </button>
                </div>

                {localContent.schema?.breadcrumb?.enabled && (
                  <div className="space-y-3 mt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={localContent.schema.breadcrumb.autoGenerate ?? true}
                        onChange={(e) => updateContent({
                          schema: {
                            ...localContent.schema,
                            breadcrumb: {
                              ...localContent.schema.breadcrumb,
                              enabled: localContent.schema.breadcrumb?.enabled ?? true,
                              autoGenerate: e.target.checked
                            }
                          }
                        })}
                        className="w-4 h-4 text-indigo-600 rounded"
                      />
                      <span className="text-sm text-slate-700">URL'den otomatik oluştur</span>
                    </label>
                    {!localContent.schema.breadcrumb.autoGenerate && (
                      <div className="space-y-2">
                        {(localContent.schema.breadcrumb.items || []).map((item, i) => (
                          <div key={i} className="flex gap-2">
                            <input
                              type="text"
                              value={item.name || ''}
                              onChange={(e) => {
                                const items = [...(localContent.schema.breadcrumb?.items || [])]
                                items[i] = { ...items[i], name: e.target.value, url: items[i]?.url || '' }
                                updateContent({
                                  schema: {
                                    ...localContent.schema,
                                    breadcrumb: {
                                      ...localContent.schema.breadcrumb,
                                      enabled: localContent.schema.breadcrumb?.enabled ?? true,
                                      autoGenerate: localContent.schema.breadcrumb?.autoGenerate ?? true,
                                      items
                                    }
                                  }
                                })
                              }}
                              placeholder="Ad"
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                            <input
                              type="url"
                              value={item.url || ''}
                              onChange={(e) => {
                                const items = [...(localContent.schema.breadcrumb?.items || [])]
                                items[i] = { ...items[i], url: e.target.value, name: items[i]?.name || '' }
                                updateContent({
                                  schema: {
                                    ...localContent.schema,
                                    breadcrumb: {
                                      ...localContent.schema.breadcrumb,
                                      enabled: localContent.schema.breadcrumb?.enabled ?? true,
                                      autoGenerate: localContent.schema.breadcrumb?.autoGenerate ?? true,
                                      items
                                    }
                                  }
                                })
                              }}
                              placeholder="URL"
                              className="flex-1 px-3 py-2 border border-slate-300 rounded-lg text-sm"
                            />
                            <button
                              onClick={() => updateContent({
                                schema: {
                                  ...localContent.schema,
                                  breadcrumb: {
                                    ...localContent.schema.breadcrumb,
                                    enabled: localContent.schema.breadcrumb?.enabled ?? true,
                                    autoGenerate: localContent.schema.breadcrumb?.autoGenerate ?? true,
                                    items: (localContent.schema.breadcrumb?.items || []).filter((_, idx) => idx !== i)
                                  }
                                }
                              })}
                              className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              Sil
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => updateContent({
                            schema: {
                              ...localContent.schema,
                              breadcrumb: {
                                ...localContent.schema.breadcrumb,
                                enabled: localContent.schema.breadcrumb?.enabled ?? true,
                                autoGenerate: localContent.schema.breadcrumb?.autoGenerate ?? true,
                                items: [...(localContent.schema.breadcrumb?.items || []), { name: '', url: '' }]
                              }
                            }
                          })}
                          className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-indigo-500 hover:text-indigo-600 transition-colors"
                        >
                          + Breadcrumb Ekle
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Schema JSON Preview */}
              {localContent.schema?.localBusiness?.enabled && (
                <div className="p-4 bg-slate-900 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-slate-400">JSON-LD Onizleme (Tam Schema)</p>
                    <button
                      onClick={() => {
                        const schema = {
                          '@context': 'https://schema.org',
                          '@type': localContent.schema?.localBusiness?.['@type'],
                          name: localContent.schema?.localBusiness?.name,
                          description: localContent.schema?.localBusiness?.description,
                          url: localContent.schema?.localBusiness?.url,
                          telephone: localContent.schema?.localBusiness?.telephone,
                          email: localContent.schema?.localBusiness?.email,
                          logo: localContent.schema?.localBusiness?.logo,
                          image: localContent.schema?.localBusiness?.image,
                          priceRange: localContent.schema?.localBusiness?.priceRange,
                          currenciesAccepted: localContent.schema?.localBusiness?.currenciesAccepted,
                          paymentAccepted: localContent.schema?.localBusiness?.paymentAccepted?.join(', '),
                          address: localContent.schema?.localBusiness?.address ? {
                            '@type': 'PostalAddress',
                            ...localContent.schema.localBusiness.address
                          } : undefined,
                          geo: localContent.schema?.localBusiness?.geo ? {
                            '@type': 'GeoCoordinates',
                            ...localContent.schema.localBusiness.geo
                          } : undefined,
                          openingHoursSpecification: localContent.schema?.localBusiness?.openingHoursSpecification?.map(h => ({
                            '@type': 'OpeningHoursSpecification',
                            ...h
                          })),
                          aggregateRating: localContent.schema?.localBusiness?.aggregateRating ? {
                            '@type': 'AggregateRating',
                            ...localContent.schema.localBusiness.aggregateRating
                          } : undefined,
                          sameAs: localContent.schema?.localBusiness?.sameAs,
                          hasMap: localContent.schema?.localBusiness?.hasMap,
                          amenityFeature: localContent.schema?.localBusiness?.amenityFeature?.map(a => ({
                            '@type': 'LocationFeatureSpecification',
                            name: a.name,
                            value: a.value
                          })),
                          makesOffer: localContent.schema?.localBusiness?.availableService?.map(s => ({
                            '@type': 'Offer',
                            itemOffered: {
                              '@type': 'Service',
                              name: s.name,
                              description: s.description
                            },
                            price: s.offers?.price,
                            priceCurrency: s.offers?.priceCurrency
                          }))
                        }
                        // Remove undefined values
                        const cleanSchema = JSON.parse(JSON.stringify(schema))
                        navigator.clipboard.writeText(JSON.stringify(cleanSchema, null, 2))
                        alert('JSON-LD kopyalandi!')
                      }}
                      className="text-xs text-indigo-400 hover:text-indigo-300"
                    >
                      Kopyala
                    </button>
                  </div>
                  <pre className="text-xs text-green-400 overflow-x-auto max-h-96">
                    {JSON.stringify({
                      '@context': 'https://schema.org',
                      '@type': localContent.schema?.localBusiness?.['@type'],
                      name: localContent.schema?.localBusiness?.name,
                      description: localContent.schema?.localBusiness?.description,
                      url: localContent.schema?.localBusiness?.url,
                      telephone: localContent.schema?.localBusiness?.telephone,
                      email: localContent.schema?.localBusiness?.email,
                      logo: localContent.schema?.localBusiness?.logo,
                      priceRange: localContent.schema?.localBusiness?.priceRange,
                      address: localContent.schema?.localBusiness?.address ? {
                        '@type': 'PostalAddress',
                        streetAddress: localContent.schema?.localBusiness?.address?.streetAddress,
                        addressLocality: localContent.schema?.localBusiness?.address?.addressLocality,
                        addressRegion: localContent.schema?.localBusiness?.address?.addressRegion,
                        postalCode: localContent.schema?.localBusiness?.address?.postalCode,
                        addressCountry: localContent.schema?.localBusiness?.address?.addressCountry
                      } : undefined,
                      geo: localContent.schema?.localBusiness?.geo ? {
                        '@type': 'GeoCoordinates',
                        latitude: localContent.schema?.localBusiness?.geo?.latitude,
                        longitude: localContent.schema?.localBusiness?.geo?.longitude
                      } : undefined,
                      aggregateRating: localContent.schema?.localBusiness?.aggregateRating ? {
                        '@type': 'AggregateRating',
                        ratingValue: localContent.schema?.localBusiness?.aggregateRating?.ratingValue,
                        reviewCount: localContent.schema?.localBusiness?.aggregateRating?.reviewCount
                      } : undefined,
                      openingHoursSpecification: localContent.schema?.localBusiness?.openingHoursSpecification,
                      sameAs: localContent.schema?.localBusiness?.sameAs,
                      amenityFeature: localContent.schema?.localBusiness?.amenityFeature?.filter(a => a.value),
                      hasOfferCatalog: localContent.schema?.localBusiness?.availableService?.length ? {
                        '@type': 'OfferCatalog',
                        itemListElement: localContent.schema?.localBusiness?.availableService
                      } : undefined
                    }, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Technical Tab */}
          {activeTab === 'technical' && (
            <div className="space-y-4">
              {/* Robots */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🤖</span>
                  <h4 className="font-medium text-slate-800">Robots Direktifleri</h4>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localContent.robots?.index}
                      onChange={(e) => updateRobots({ index: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-sm text-slate-700">index (arama sonuçlarında göster)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localContent.robots?.follow}
                      onChange={(e) => updateRobots({ follow: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-sm text-slate-700">follow (linkleri takip et)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localContent.robots?.noarchive}
                      onChange={(e) => updateRobots({ noarchive: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-sm text-slate-700">noarchive</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localContent.robots?.nosnippet}
                      onChange={(e) => updateRobots({ nosnippet: e.target.checked })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-sm text-slate-700">nosnippet</span>
                  </label>
                </div>
              </div>

              {/* Canonical URL */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Canonical URL
                </label>
                <input
                  type="url"
                  value={localContent['canonicalUrl'] || ''}
                  onChange={(e) => {
                    const url = e.target.value
                    updateContent({ canonicalUrl: url })
                    const error = validateUrl(url)
                    setErrors(prev => ({ ...prev, canonicalUrl: error || '' }))
                  }}
                  placeholder="https://wellnesstal.de/sayfa"
                  className={`w-full px-4 py-2 border rounded-lg ${
                    errors['canonicalUrl'] ? 'border-red-300' : 'border-slate-300'
                  }`}
                />
                {errors['canonicalUrl'] && (
                  <p className="text-xs text-red-500 mt-1">{errors['canonicalUrl']}</p>
                )}
                {!errors['canonicalUrl'] && localContent['canonicalUrl'] && (
                  <p className="text-xs text-green-600 mt-1">✓ Geçerli URL</p>
                )}
                <p className="text-xs text-slate-500 mt-1">Duplicate content'i önlemek için - Sayfa URL'inizi girin</p>
              </div>

              {/* Sitemap */}
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xl">🗺️</span>
                  <h4 className="font-medium text-slate-800">Sitemap Ayarları</h4>
                </div>
                <div className="space-y-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={localContent.sitemap?.include}
                      onChange={(e) => updateContent({
                        sitemap: { ...localContent.sitemap!, include: e.target.checked }
                      })}
                      className="w-4 h-4 text-indigo-600 rounded"
                    />
                    <span className="text-sm text-slate-700">Sitemap'e dahil et</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Öncelik</label>
                      <select
                        value={localContent.sitemap?.priority || 0.8}
                        onChange={(e) => updateContent({
                          sitemap: { ...localContent.sitemap!, priority: parseFloat(e.target.value) }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="1.0">1.0 (En Yüksek)</option>
                        <option value="0.8">0.8</option>
                        <option value="0.6">0.6</option>
                        <option value="0.4">0.4</option>
                        <option value="0.2">0.2 (En Düşük)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Güncelleme Sıklığı</label>
                      <select
                        value={localContent.sitemap?.changeFrequency || 'weekly'}
                        onChange={(e) => updateContent({
                          sitemap: { ...localContent.sitemap!, changeFrequency: e.target.value as any }
                        })}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      >
                        <option value="always">Her Zaman</option>
                        <option value="hourly">Saatlik</option>
                        <option value="daily">Günlük</option>
                        <option value="weekly">Haftalık</option>
                        <option value="monthly">Aylık</option>
                        <option value="yearly">Yıllık</option>
                        <option value="never">Asla</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
