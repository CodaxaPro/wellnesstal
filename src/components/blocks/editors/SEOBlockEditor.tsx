'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { SEOContent, SEORobotsDirectives, SEOOpenGraph, SEOTwitterCard, SEOSchemaSettings, SchemaLocalBusiness } from '../types'
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
    if (content.openGraph.image?.url) socialScore += 5
  } else {
    issues.push({ type: 'warning', message: 'Open Graph etkin değil - sosyal paylaşımlar için açın' })
  }
  if (content.twitter?.enabled) {
    socialScore += 5
  }

  // Schema.org (20 points max)
  if (content.schema?.localBusiness?.enabled) {
    schemaScore += 10
    if (content.schema.localBusiness.address) schemaScore += 5
    if (content.schema.localBusiness.telephone) schemaScore += 5
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
  if (current < min) color = 'text-red-500'
  else if (current > max) color = 'text-orange-500'
  else if (optimal && current >= optimal.min && current <= optimal.max) color = 'text-green-500'

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
  const textColor = type === 'facebook' ? 'text-slate-900' : 'text-white'

  return (
    <div className={`${bgColor} p-4 rounded-xl`}>
      <p className="text-xs text-slate-500 mb-2">
        {type === 'facebook' ? 'Facebook' : 'Twitter/X'} Paylaşım Önizlemesi
      </p>
      <div className={`bg-white rounded-lg overflow-hidden shadow-sm ${type === 'twitter' ? 'border border-slate-200' : ''}`}>
        {image ? (
          <div className="h-40 bg-slate-200 flex items-center justify-center">
            <img src={image} alt="OG Image" className="w-full h-full object-cover" />
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
    if (s >= 80) return { bg: 'bg-green-500', text: 'text-green-600', ring: 'ring-green-200' }
    if (s >= 60) return { bg: 'bg-yellow-500', text: 'text-yellow-600', ring: 'ring-yellow-200' }
    if (s >= 40) return { bg: 'bg-orange-500', text: 'text-orange-600', ring: 'ring-orange-200' }
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
  const [expandedSections, setExpandedSections] = useState<string[]>(['meta', 'preview'])
  const [activeTab, setActiveTab] = useState<'meta' | 'social' | 'schema' | 'technical'>('meta')
  const [keywordInput, setKeywordInput] = useState('')

  // Debounced update
  useEffect(() => {
    const timer = setTimeout(() => {
      onUpdate(localContent)
    }, 300)
    return () => clearTimeout(timer)
  }, [localContent, onUpdate])

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

  // Toggle section
  const toggleSection = (section: string) => {
    setExpandedSections(prev =>
      prev.includes(section) ? prev.filter(s => s !== section) : [...prev, section]
    )
  }

  // Add keyword
  const addKeyword = () => {
    if (keywordInput.trim() && !localContent.keywords?.includes(keywordInput.trim())) {
      updateContent({ keywords: [...(localContent.keywords || []), keywordInput.trim()] })
      setKeywordInput('')
    }
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
          {/* SEO Score Card */}
          <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">📊</span>
              <h3 className="font-semibold text-slate-800">SEO Skor</h3>
            </div>
            <SEOScoreDisplay score={seoScore} issues={true} />
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
                  onChange={(e) => updateContent({ title: e.target.value })}
                  placeholder="Sayfa başlığınızı girin..."
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  maxLength={70}
                />
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
                  <input
                    type="text"
                    value={keywordInput}
                    onChange={(e) => setKeywordInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
                    placeholder="Anahtar kelime ekle..."
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
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
                  url={localContent.canonicalUrl || ''}
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
                        placeholder={localContent.title}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-slate-600 mb-1">OG Image URL</label>
                      <input
                        type="url"
                        value={localContent.openGraph?.image?.url || ''}
                        onChange={(e) => updateOpenGraph({ image: { ...localContent.openGraph?.image, url: e.target.value } })}
                        placeholder="https://example.com/image.jpg"
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm"
                      />
                      <p className="text-xs text-slate-500 mt-1">Önerilen: 1200x630px</p>
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
                  value={localContent.canonicalUrl || ''}
                  onChange={(e) => updateContent({ canonicalUrl: e.target.value })}
                  placeholder="https://wellnesstal.de/sayfa"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg"
                />
                <p className="text-xs text-slate-500 mt-1">Duplicate content'i önlemek için</p>
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
