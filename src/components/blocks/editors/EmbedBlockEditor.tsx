'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { getDefaultEmbedContent } from '../EmbedBlock'
import { EmbedContent, EmbedProviderType, EmbedAspectRatio } from '../types'

interface EmbedBlockEditorProps {
  content: EmbedContent
  onUpdate: (content: EmbedContent) => void
}

type TabType = 'content' | 'frame' | 'header' | 'advanced'

// Provider options with icons
const providerOptions: { value: EmbedProviderType; label: string; icon: string }[] = [
  { value: 'custom', label: 'Özel HTML/JS Kodu', icon: '💻' },
  { value: 'iframe', label: 'Iframe URL', icon: '🔗' },
  { value: 'youtube', label: 'YouTube', icon: '📺' },
  { value: 'vimeo', label: 'Vimeo', icon: '🎬' },
  { value: 'google-maps', label: 'Google Maps', icon: '🗺️' },
  { value: 'instagram', label: 'Instagram', icon: '📷' },
  { value: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { value: 'facebook', label: 'Facebook', icon: '👥' },
  { value: 'tiktok', label: 'TikTok', icon: '🎵' },
  { value: 'spotify', label: 'Spotify', icon: '🎧' },
  { value: 'soundcloud', label: 'SoundCloud', icon: '🔊' },
  { value: 'calendly', label: 'Calendly', icon: '📅' },
  { value: 'typeform', label: 'Typeform', icon: '📋' },
  { value: 'codepen', label: 'CodePen', icon: '✏️' },
  { value: 'figma', label: 'Figma', icon: '🎨' },
  { value: 'loom', label: 'Loom', icon: '🎥' },
]

// Aspect ratio options
const aspectRatioOptions: { value: EmbedAspectRatio; label: string }[] = [
  { value: '16:9', label: '16:9 (Video)' },
  { value: '4:3', label: '4:3 (Klasik)' },
  { value: '1:1', label: '1:1 (Kare)' },
  { value: '9:16', label: '9:16 (Dikey)' },
  { value: '21:9', label: '21:9 (Geniş)' },
  { value: 'auto', label: 'Otomatik' },
  { value: 'custom', label: 'Özel' },
]

// Max width options
const maxWidthOptions = [
  { value: 'sm', label: 'Küçük (640px)' },
  { value: 'md', label: 'Orta (768px)' },
  { value: 'lg', label: 'Geniş (1024px)' },
  { value: 'xl', label: 'Çok Geniş (1280px)' },
  { value: '2xl', label: '2XL (1536px)' },
  { value: '3xl', label: '3XL (1792px)' },
  { value: 'full', label: 'Tam Genişlik' },
  { value: 'custom', label: 'Özel' },
]

// Shadow options
const shadowOptions = [
  { value: 'none', label: 'Yok' },
  { value: 'sm', label: 'Küçük' },
  { value: 'md', label: 'Orta' },
  { value: 'lg', label: 'Büyük' },
  { value: 'xl', label: 'Çok Büyük' },
  { value: '2xl', label: 'Ekstra Büyük' },
]

export default function EmbedBlockEditor({ content, onUpdate }: EmbedBlockEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('content')
  const [localContent, setLocalContent] = useState<EmbedContent>(() => ({
    ...getDefaultEmbedContent(),
    ...content
  }))

  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  // Update local state when parent content changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    const contentStr = JSON.stringify(content)
    const localStr = JSON.stringify(localContent)
    if (contentStr !== localStr) {
      setLocalContent({
        ...getDefaultEmbedContent(),
        ...content
      })
    }
  }, [content])

  // Debounced update to parent
  const debouncedUpdate = useCallback((newContent: EmbedContent) => {
    if (isInitialMount.current) {
return
}
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onUpdate(newContent)
    }, 500)
  }, [onUpdate])

  // Handle content updates
  const updateContent = useCallback((updates: Partial<EmbedContent>) => {
    setLocalContent(prev => {
      const newContent = { ...prev, ...updates }
      debouncedUpdate(newContent)
      return newContent
    })
  }, [debouncedUpdate])

  // Update nested object
  const updateNestedContent = useCallback((
    key: keyof EmbedContent,
    nestedKey: string,
    value: any
  ) => {
    setLocalContent(prev => {
      const currentObj = (prev[key] as Record<string, any>) || {}
      const newContent = {
        ...prev,
        [key]: {
          ...currentObj,
          [nestedKey]: value
        }
      }
      debouncedUpdate(newContent)
      return newContent
    })
  }, [debouncedUpdate])

  // Cleanup
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  const tabs = [
    { id: 'content' as TabType, label: 'İçerik', icon: '📝' },
    { id: 'frame' as TabType, label: 'Çerçeve', icon: '🖼️' },
    { id: 'header' as TabType, label: 'Başlık', icon: '📰' },
    { id: 'advanced' as TabType, label: 'Gelişmiş', icon: '⚙️' },
  ]

  // Render Content Tab
  const renderContentTab = () => (
    <div className="space-y-6">
      {/* Provider Selection */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">
          Embed Tipi
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {providerOptions.map(option => (
            <button
              key={option.value}
              onClick={() => updateContent({ provider: option.value })}
              className={`p-3 rounded-lg border text-sm font-medium transition-all flex flex-col items-center gap-1 ${
                localContent.provider === option.value
                  ? 'bg-sage-50 border-sage-500 text-sage-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              <span className="text-xl">{option.icon}</span>
              <span className="text-xs text-center">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Embed Code/URL Input */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        {localContent.provider === 'custom' ? (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Embed Kodu (HTML/JavaScript)
            </label>
            <textarea
              value={localContent.embedCode || ''}
              onChange={(e) => updateContent({ embedCode: e.target.value })}
              placeholder="<iframe src=&quot;...&quot;></iframe> veya özel HTML/JS kodu yapıştırın"
              rows={8}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg font-mono text-sm focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-y"
            />
            <p className="mt-2 text-xs text-slate-500">
              YouTube, Google Maps, Instagram veya herhangi bir embed kodunu buraya yapıştırabilirsiniz.
            </p>
          </div>
        ) : (
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {localContent.provider === 'youtube' ? 'YouTube Video URL' :
               localContent.provider === 'vimeo' ? 'Vimeo Video URL' :
               localContent.provider === 'google-maps' ? 'Google Maps Embed URL' :
               localContent.provider === 'spotify' ? 'Spotify URL' :
               'Embed URL'}
            </label>
            <input
              type="url"
              value={localContent.embedUrl || ''}
              onChange={(e) => updateContent({ embedUrl: e.target.value })}
              placeholder={
                localContent.provider === 'youtube' ? 'https://www.youtube.com/watch?v=...' :
                localContent.provider === 'google-maps' ? 'https://www.google.com/maps/embed?...' :
                'https://...'
              }
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
          </div>
        )}
      </div>

      {/* YouTube Specific Settings */}
      {localContent.provider === 'youtube' && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h4 className="text-sm font-semibold text-slate-700 mb-3">YouTube Ayarları</h4>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localContent.providerSettings?.youtube?.autoplay || false}
                onChange={(e) => updateContent({
                  providerSettings: {
                    ...localContent.providerSettings,
                    youtube: {
                      ...localContent.providerSettings?.youtube,
                      autoplay: e.target.checked
                    }
                  }
                })}
                className="w-4 h-4 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
              />
              <span className="text-sm text-slate-600">Otomatik oynat</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localContent.providerSettings?.youtube?.muted || false}
                onChange={(e) => updateContent({
                  providerSettings: {
                    ...localContent.providerSettings,
                    youtube: {
                      ...localContent.providerSettings?.youtube,
                      muted: e.target.checked
                    }
                  }
                })}
                className="w-4 h-4 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
              />
              <span className="text-sm text-slate-600">Sessiz başlat</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localContent.providerSettings?.youtube?.loop || false}
                onChange={(e) => updateContent({
                  providerSettings: {
                    ...localContent.providerSettings,
                    youtube: {
                      ...localContent.providerSettings?.youtube,
                      loop: e.target.checked
                    }
                  }
                })}
                className="w-4 h-4 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
              />
              <span className="text-sm text-slate-600">Döngü</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localContent.providerSettings?.youtube?.controls !== false}
                onChange={(e) => updateContent({
                  providerSettings: {
                    ...localContent.providerSettings,
                    youtube: {
                      ...localContent.providerSettings?.youtube,
                      controls: e.target.checked
                    }
                  }
                })}
                className="w-4 h-4 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
              />
              <span className="text-sm text-slate-600">Kontroller</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localContent.providerSettings?.youtube?.enablePrivacyMode || false}
                onChange={(e) => updateContent({
                  providerSettings: {
                    ...localContent.providerSettings,
                    youtube: {
                      ...localContent.providerSettings?.youtube,
                      enablePrivacyMode: e.target.checked
                    }
                  }
                })}
                className="w-4 h-4 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
              />
              <span className="text-sm text-slate-600">Gizlilik modu</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localContent.providerSettings?.youtube?.showRelated === false}
                onChange={(e) => updateContent({
                  providerSettings: {
                    ...localContent.providerSettings,
                    youtube: {
                      ...localContent.providerSettings?.youtube,
                      showRelated: !e.target.checked
                    }
                  }
                })}
                className="w-4 h-4 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
              />
              <span className="text-sm text-slate-600">İlgili videoları gizle</span>
            </label>
          </div>

          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Başlangıç Süresi (saniye)
            </label>
            <input
              type="number"
              min="0"
              value={localContent.providerSettings?.youtube?.startTime || 0}
              onChange={(e) => updateContent({
                providerSettings: {
                  ...localContent.providerSettings,
                  youtube: {
                    ...localContent.providerSettings?.youtube,
                    startTime: parseInt(e.target.value) || 0
                  }
                }
              })}
              className="w-32 px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500"
            />
          </div>
        </div>
      )}

      {/* Click to Load */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localContent.clickToLoad || false}
            onChange={(e) => updateContent({ clickToLoad: e.target.checked })}
            className="w-5 h-5 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
          />
          <div>
            <span className="text-sm font-medium text-slate-700">Tıkla ve Yükle</span>
            <p className="text-xs text-slate-500">Kullanıcı tıklayana kadar embed yüklenmez (performans için)</p>
          </div>
        </label>

        {localContent.clickToLoad && (
          <div className="mt-3 ml-8">
            <input
              type="text"
              value={localContent.clickToLoadText || ''}
              onChange={(e) => updateContent({ clickToLoadText: e.target.value })}
              placeholder="Görüntülemek için tıklayın"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500"
            />
          </div>
        )}
      </div>
    </div>
  )

  // Render Frame Tab
  const renderFrameTab = () => (
    <div className="space-y-6">
      {/* Aspect Ratio */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">En-Boy Oranı</label>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {aspectRatioOptions.map(option => (
            <button
              key={option.value}
              onClick={() => updateNestedContent('frame', 'aspectRatio', option.value)}
              className={`p-2 rounded-lg border text-sm font-medium transition-all ${
                localContent.frame?.aspectRatio === option.value
                  ? 'bg-sage-50 border-sage-500 text-sage-700'
                  : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {localContent.frame?.aspectRatio === 'custom' && (
          <div className="mt-3">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Özel Oran (örn: 2:1 veya 400px)
            </label>
            <input
              type="text"
              value={localContent.frame?.customAspectRatio || ''}
              onChange={(e) => updateNestedContent('frame', 'customAspectRatio', e.target.value)}
              placeholder="56.25%"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500"
            />
          </div>
        )}

        {localContent.frame?.aspectRatio === 'auto' && (
          <div className="mt-3">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Sabit Yükseklik
            </label>
            <input
              type="text"
              value={localContent.frame?.height || '400px'}
              onChange={(e) => updateNestedContent('frame', 'height', e.target.value)}
              placeholder="400px"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500"
            />
          </div>
        )}
      </div>

      {/* Container Width */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Konteyner Genişliği</label>
        <select
          value={localContent.container?.maxWidth || 'xl'}
          onChange={(e) => updateNestedContent('container', 'maxWidth', e.target.value)}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500"
        >
          {maxWidthOptions.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        {localContent.container?.maxWidth === 'custom' && (
          <div className="mt-3">
            <input
              type="text"
              value={localContent.container?.customMaxWidth || ''}
              onChange={(e) => updateNestedContent('container', 'customMaxWidth', e.target.value)}
              placeholder="1200px"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500"
            />
          </div>
        )}

        {/* Alignment */}
        <div className="mt-4">
          <label className="block text-xs font-medium text-slate-600 mb-2">Hizalama</label>
          <div className="flex gap-2">
            {['left', 'center', 'right'].map(align => (
              <button
                key={align}
                onClick={() => updateNestedContent('container', 'alignment', align)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                  localContent.container?.alignment === align
                    ? 'bg-sage-50 border-sage-500 text-sage-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {align === 'left' ? 'Sol' : align === 'center' ? 'Orta' : 'Sağ'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Border & Shadow */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Çerçeve & Gölge</h4>

        {/* Border Radius */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-1">Köşe Yuvarlaklığı</label>
          <input
            type="text"
            value={localContent.frame?.borderRadius || '12px'}
            onChange={(e) => updateNestedContent('frame', 'borderRadius', e.target.value)}
            placeholder="12px"
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500"
          />
        </div>

        {/* Shadow */}
        <div className="mb-4">
          <label className="block text-xs font-medium text-slate-600 mb-2">Gölge</label>
          <div className="grid grid-cols-3 gap-2">
            {shadowOptions.map(opt => (
              <button
                key={opt.value}
                onClick={() => updateNestedContent('frame', 'shadow', opt.value)}
                className={`py-2 rounded-lg border text-xs font-medium transition-all ${
                  localContent.frame?.shadow === opt.value
                    ? 'bg-sage-50 border-sage-500 text-sage-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Border Enable */}
        <label className="flex items-center gap-2 cursor-pointer mb-3">
          <input
            type="checkbox"
            checked={localContent.frame?.borderEnabled || false}
            onChange={(e) => updateNestedContent('frame', 'borderEnabled', e.target.checked)}
            className="w-4 h-4 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
          />
          <span className="text-sm text-slate-600">Kenarlık Ekle</span>
        </label>

        {localContent.frame?.borderEnabled && (
          <div className="grid grid-cols-3 gap-3 ml-6">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Kalınlık</label>
              <input
                type="number"
                min="1"
                max="10"
                value={localContent.frame?.borderWidth || 1}
                onChange={(e) => updateNestedContent('frame', 'borderWidth', parseInt(e.target.value))}
                className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Renk</label>
              <input
                type="color"
                value={localContent.frame?.borderColor || '#e5e7eb'}
                onChange={(e) => updateNestedContent('frame', 'borderColor', e.target.value)}
                className="w-full h-8 rounded border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Stil</label>
              <select
                value={localContent.frame?.borderStyle || 'solid'}
                onChange={(e) => updateNestedContent('frame', 'borderStyle', e.target.value)}
                className="w-full px-2 py-1 border border-slate-200 rounded text-sm"
              >
                <option value="solid">Düz</option>
                <option value="dashed">Kesikli</option>
                <option value="dotted">Noktalı</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Padding */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Boşluklar (Padding)</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Üst</label>
            <input
              type="text"
              value={localContent.container?.padding?.top || '64px'}
              onChange={(e) => updateContent({
                container: {
                  ...localContent.container,
                  padding: { ...localContent.container?.padding, top: e.target.value }
                }
              })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Alt</label>
            <input
              type="text"
              value={localContent.container?.padding?.bottom || '64px'}
              onChange={(e) => updateContent({
                container: {
                  ...localContent.container,
                  padding: { ...localContent.container?.padding, bottom: e.target.value }
                }
              })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Sol</label>
            <input
              type="text"
              value={localContent.container?.padding?.left || '16px'}
              onChange={(e) => updateContent({
                container: {
                  ...localContent.container,
                  padding: { ...localContent.container?.padding, left: e.target.value }
                }
              })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Sağ</label>
            <input
              type="text"
              value={localContent.container?.padding?.right || '16px'}
              onChange={(e) => updateContent({
                container: {
                  ...localContent.container,
                  padding: { ...localContent.container?.padding, right: e.target.value }
                }
              })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )

  // Render Header Tab
  const renderHeaderTab = () => (
    <div className="space-y-6">
      {/* Enable Header */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={localContent.header?.enabled || false}
            onChange={(e) => updateContent({
              header: {
                ...localContent.header,
                enabled: e.target.checked
              }
            })}
            className="w-5 h-5 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
          />
          <div>
            <span className="text-sm font-medium text-slate-700">Bölüm Başlığı Göster</span>
          </div>
        </label>
      </div>

      {localContent.header?.enabled && (
        <>
          {/* Title & Subtitle */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Başlık</label>
                <input
                  type="text"
                  value={localContent.header?.title || localContent.title || ''}
                  onChange={(e) => updateContent({
                    header: { ...localContent.header, title: e.target.value },
                    title: e.target.value
                  })}
                  placeholder="Bölüm başlığı"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Alt Başlık</label>
                <input
                  type="text"
                  value={localContent.header?.subtitle || localContent.subtitle || ''}
                  onChange={(e) => updateContent({
                    header: { ...localContent.header, subtitle: e.target.value },
                    subtitle: e.target.value
                  })}
                  placeholder="Alt başlık veya açıklama"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500"
                />
              </div>

              {/* Alignment */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Hizalama</label>
                <div className="flex gap-2">
                  {['left', 'center', 'right'].map(align => (
                    <button
                      key={align}
                      onClick={() => updateContent({
                        header: { ...localContent.header, alignment: align as 'left' | 'center' | 'right' }
                      })}
                      className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-all ${
                        localContent.header?.alignment === align
                          ? 'bg-sage-50 border-sage-500 text-sage-700'
                          : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {align === 'left' ? 'Sol' : align === 'center' ? 'Orta' : 'Sağ'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Badge */}
          <div className="bg-white rounded-xl p-4 border border-slate-200">
            <label className="flex items-center gap-2 cursor-pointer mb-3">
              <input
                type="checkbox"
                checked={localContent.header?.badge?.enabled || false}
                onChange={(e) => updateContent({
                  header: {
                    ...localContent.header,
                    badge: { ...localContent.header?.badge, enabled: e.target.checked }
                  }
                })}
                className="w-4 h-4 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
              />
              <span className="text-sm font-medium text-slate-700">Rozet Göster</span>
            </label>

            {localContent.header?.badge?.enabled && (
              <div className="ml-6 space-y-3">
                <input
                  type="text"
                  value={localContent.header?.badge?.text || ''}
                  onChange={(e) => updateContent({
                    header: {
                      ...localContent.header,
                      badge: { ...localContent.header?.badge, text: e.target.value }
                    }
                  })}
                  placeholder="Rozet metni"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Arkaplan</label>
                    <input
                      type="color"
                      value={localContent.header?.badge?.backgroundColor || '#9CAF88'}
                      onChange={(e) => updateContent({
                        header: {
                          ...localContent.header,
                          badge: { ...localContent.header?.badge, backgroundColor: e.target.value }
                        }
                      })}
                      className="w-full h-8 rounded border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Metin Rengi</label>
                    <input
                      type="color"
                      value={localContent.header?.badge?.textColor || '#ffffff'}
                      onChange={(e) => updateContent({
                        header: {
                          ...localContent.header,
                          badge: { ...localContent.header?.badge, textColor: e.target.value }
                        }
                      })}
                      className="w-full h-8 rounded border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Caption */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <label className="flex items-center gap-3 cursor-pointer mb-3">
          <input
            type="checkbox"
            checked={localContent.caption?.enabled || false}
            onChange={(e) => updateContent({
              caption: { ...localContent.caption, enabled: e.target.checked }
            })}
            className="w-5 h-5 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
          />
          <div>
            <span className="text-sm font-medium text-slate-700">Alt Yazı Göster</span>
          </div>
        </label>

        {localContent.caption?.enabled && (
          <div className="ml-8 space-y-3">
            <input
              type="text"
              value={localContent.caption?.text || ''}
              onChange={(e) => updateContent({
                caption: { ...localContent.caption, text: e.target.value }
              })}
              placeholder="Alt yazı metni"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
            <div className="flex gap-2">
              {['left', 'center', 'right'].map(align => (
                <button
                  key={align}
                  onClick={() => updateContent({
                    caption: { ...localContent.caption, alignment: align as 'left' | 'center' | 'right' }
                  })}
                  className={`flex-1 py-2 rounded-lg border text-xs font-medium transition-all ${
                    localContent.caption?.alignment === align
                      ? 'bg-sage-50 border-sage-500 text-sage-700'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {align === 'left' ? 'Sol' : align === 'center' ? 'Orta' : 'Sağ'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )

  // Render Advanced Tab
  const renderAdvancedTab = () => (
    <div className="space-y-6">
      {/* Security Settings */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Güvenlik Ayarları</h4>

        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localContent.security?.lazyLoad || false}
              onChange={(e) => updateNestedContent('security', 'lazyLoad', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <div>
              <span className="text-sm text-slate-600">Lazy Load</span>
              <p className="text-xs text-slate-400">Performans için görünür olunca yükle</p>
            </div>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localContent.security?.sandboxEnabled || false}
              onChange={(e) => updateNestedContent('security', 'sandboxEnabled', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <div>
              <span className="text-sm text-slate-600">Sandbox Modu</span>
              <p className="text-xs text-slate-400">Güvenlik için iframe izinlerini kısıtla</p>
            </div>
          </label>

          {localContent.security?.sandboxEnabled && (
            <div className="ml-6 grid grid-cols-2 gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localContent.security?.allowScripts !== false}
                  onChange={(e) => updateNestedContent('security', 'allowScripts', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-sage-500"
                />
                <span className="text-xs text-slate-600">Script'ler</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localContent.security?.allowSameOrigin !== false}
                  onChange={(e) => updateNestedContent('security', 'allowSameOrigin', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-sage-500"
                />
                <span className="text-xs text-slate-600">Same Origin</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localContent.security?.allowForms !== false}
                  onChange={(e) => updateNestedContent('security', 'allowForms', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-sage-500"
                />
                <span className="text-xs text-slate-600">Formlar</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localContent.security?.allowPopups !== false}
                  onChange={(e) => updateNestedContent('security', 'allowPopups', e.target.checked)}
                  className="w-4 h-4 rounded border-slate-300 text-sage-500"
                />
                <span className="text-xs text-slate-600">Popup'lar</span>
              </label>
            </div>
          )}
        </div>
      </div>

      {/* Loading Settings */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Yükleme Ayarları</h4>

        <div className="space-y-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localContent.loading?.showLoadingSpinner || false}
              onChange={(e) => updateNestedContent('loading', 'showLoadingSpinner', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-sm text-slate-600">Yükleme spinner'ı göster</span>
          </label>

          {localContent.loading?.showLoadingSpinner && (
            <div className="ml-6">
              <label className="block text-xs font-medium text-slate-600 mb-1">Spinner Rengi</label>
              <input
                type="color"
                value={localContent.loading?.spinnerColor || '#9CAF88'}
                onChange={(e) => updateNestedContent('loading', 'spinnerColor', e.target.value)}
                className="w-16 h-8 rounded border border-slate-200"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Yükleme Metni</label>
            <input
              type="text"
              value={localContent.loading?.placeholderText || ''}
              onChange={(e) => updateNestedContent('loading', 'placeholderText', e.target.value)}
              placeholder="İçerik yükleniyor..."
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localContent.loading?.fallbackEnabled || false}
              onChange={(e) => updateNestedContent('loading', 'fallbackEnabled', e.target.checked)}
              className="w-4 h-4 rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-sm text-slate-600">Hata durumunda fallback göster</span>
          </label>

          {localContent.loading?.fallbackEnabled && (
            <div className="ml-6">
              <label className="block text-xs font-medium text-slate-600 mb-1">Hata Metni</label>
              <input
                type="text"
                value={localContent.loading?.fallbackText || ''}
                onChange={(e) => updateNestedContent('loading', 'fallbackText', e.target.value)}
                placeholder="İçerik yüklenemedi"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          )}
        </div>
      </div>

      {/* Background */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Arkaplan</h4>

        <div className="space-y-3">
          <select
            value={localContent.background?.type || 'none'}
            onChange={(e) => updateContent({
              background: { ...localContent.background, type: e.target.value as any }
            })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          >
            <option value="none">Yok</option>
            <option value="solid">Düz Renk</option>
            <option value="gradient">Gradient</option>
          </select>

          {localContent.background?.type === 'solid' && (
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Renk</label>
              <input
                type="color"
                value={localContent.background?.color || '#ffffff'}
                onChange={(e) => updateContent({
                  background: { ...localContent.background, color: e.target.value }
                })}
                className="w-full h-10 rounded border border-slate-200"
              />
            </div>
          )}

          {localContent.background?.type === 'gradient' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Başlangıç</label>
                <input
                  type="color"
                  value={localContent.background?.gradientFrom || '#f8fafc'}
                  onChange={(e) => updateContent({
                    background: { ...localContent.background, gradientFrom: e.target.value }
                  })}
                  className="w-full h-8 rounded border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Bitiş</label>
                <input
                  type="color"
                  value={localContent.background?.gradientTo || '#f1f5f9'}
                  onChange={(e) => updateContent({
                    background: { ...localContent.background, gradientTo: e.target.value }
                  })}
                  className="w-full h-8 rounded border border-slate-200"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Class & Section ID */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h4 className="text-sm font-semibold text-slate-700 mb-3">Özel Ayarlar</h4>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Section ID</label>
            <input
              type="text"
              value={localContent.sectionId || ''}
              onChange={(e) => updateContent({ sectionId: e.target.value })}
              placeholder="ornek-section"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
            <p className="mt-1 text-xs text-slate-400">Sayfa içi navigasyon için (# ile erişim)</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Özel CSS Class</label>
            <input
              type="text"
              value={localContent.customClass || ''}
              onChange={(e) => updateContent({ customClass: e.target.value })}
              placeholder="my-custom-class"
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* Tab Navigation */}
      <div className="flex-shrink-0 bg-white border-b border-slate-200 px-4">
        <div className="flex gap-1 overflow-x-auto py-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-sage-500 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'content' && renderContentTab()}
        {activeTab === 'frame' && renderFrameTab()}
        {activeTab === 'header' && renderHeaderTab()}
        {activeTab === 'advanced' && renderAdvancedTab()}
      </div>

      {/* Footer Status */}
      <div className="flex-shrink-0 px-4 py-2 bg-white border-t border-slate-200">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-sage-500" />
            <span>{providerOptions.find(p => p.value === localContent.provider)?.label || 'Embed'}</span>
          </div>
          <div className="flex items-center gap-4">
            <span>Oran: {localContent.frame?.aspectRatio || '16:9'}</span>
            <span>Genişlik: {localContent.container?.maxWidth || 'xl'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
