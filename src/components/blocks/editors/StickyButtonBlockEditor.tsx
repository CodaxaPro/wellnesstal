'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

import { StickyButtonContent } from '../StickyButtonBlock'

interface StickyButtonBlockEditorProps {
  content: Record<string, unknown>
  onUpdate: (content: Record<string, unknown>) => void
}

const defaultContent: StickyButtonContent = {
  enabled: true,
  text: 'Şimdi Randevu Al',
  link: '#booking',
  icon: 'calendar',
  iconPosition: 'left',
  display: {
    showAfterScroll: 30,
    showAfterDelay: 0,
    showOnMobile: true,
    showOnDesktop: true,
    excludedPages: []
  },
  position: 'bottom-center',
  offsetX: 0,
  offsetY: 24,
  style: {
    backgroundColor: '#9CAF88',
    textColor: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    paddingX: 32,
    paddingY: 16,
    borderRadius: '0.75rem',
    shadow: 'xl',
    hoverEffect: 'scale',
    hoverBackgroundColor: '#166534',
    hoverScale: 1.05
  },
  animation: {
    enabled: true,
    type: 'fade',
    duration: 300
  },
  responsive: {
    mobile: {
      fontSize: '0.875rem',
      paddingX: 24,
      paddingY: 12
    }
  }
}

// Deep merge utility
function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target }
  for (const key in source) {
    if (source[key] !== undefined) {
      if (
        typeof source[key] === 'object' &&
        source[key] !== null &&
        !Array.isArray(source[key]) &&
        typeof target[key] === 'object' &&
        target[key] !== null &&
        !Array.isArray(target[key])
      ) {
        result[key] = deepMerge(target[key] as Record<string, any>, source[key] as Record<string, any>) as T[Extract<keyof T, string>]
      } else {
        result[key] = source[key] as T[Extract<keyof T, string>]
      }
    }
  }
  return result
}

const STICKY_BUTTON_TABS = [
  { id: 'basic', label: 'Temel', icon: '⚙️' },
  { id: 'display', label: 'Görünüm', icon: '👁️' },
  { id: 'style', label: 'Stil', icon: '🎨' },
  { id: 'animation', label: 'Animasyon', icon: '✨' }
]

// Basic Tab
function BasicTab({ content, updateContent }: { content: StickyButtonContent; updateContent: (updates: Partial<StickyButtonContent>) => void }) {
  return (
    <div className="space-y-6">
      {/* Enabled Toggle */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Butonu Aktif Et</span>
          <input
            type="checkbox"
            checked={content.enabled}
            onChange={(e) => updateContent({ enabled: e.target.checked })}
            className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
          />
        </label>
      </div>

      {/* Button Text */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Buton Metni</label>
        <input
          type="text"
          value={content.text}
          onChange={(e) => updateContent({ text: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          placeholder="Şimdi Randevu Al"
        />
      </div>

      {/* Link */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Link / URL</label>
        <input
          type="text"
          value={content.link}
          onChange={(e) => updateContent({ link: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          placeholder="#booking veya /contact"
        />
        <p className="text-xs text-slate-500 mt-1"># ile başlarsa sayfa içi scroll yapar</p>
      </div>

      {/* Icon */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Icon</label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Icon Tipi</label>
            <select
              value={content.icon || 'calendar'}
              onChange={(e) => updateContent({ icon: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="calendar">📅 Calendar</option>
              <option value="arrow-right">➡️ Arrow Right</option>
              <option value="">Icon Yok</option>
            </select>
          </div>
          {content.icon && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">Icon Pozisyonu</label>
              <select
                value={content.iconPosition || 'left'}
                onChange={(e) => updateContent({ iconPosition: e.target.value as 'left' | 'right' })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="left">Sol</option>
                <option value="right">Sağ</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Display Tab
function DisplayTab({ content, updateContent }: { content: StickyButtonContent; updateContent: (updates: Partial<StickyButtonContent>) => void }) {
  const updateDisplay = (updates: Partial<StickyButtonContent['display']>) => {
    updateContent({
      display: { ...content.display, ...updates }
    })
  }

  return (
    <div className="space-y-6">
      {/* Position */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Pozisyon</label>
        <div className="grid grid-cols-3 gap-2">
          {(['bottom-left', 'bottom-center', 'bottom-right'] as const).map((pos) => (
            <button
              key={pos}
              onClick={() => updateContent({ position: pos })}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                content.position === pos
                  ? 'bg-sage-500 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {pos === 'bottom-left' ? 'Sol Alt' : pos === 'bottom-center' ? 'Orta Alt' : 'Sağ Alt'}
            </button>
          ))}
        </div>
      </div>

      {/* Offset */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Offset (Piksel)</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">X Ekseni</label>
            <input
              type="number"
              value={content.offsetX}
              onChange={(e) => updateContent({ offsetX: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Y Ekseni (Alt)</label>
            <input
              type="number"
              value={content.offsetY}
              onChange={(e) => updateContent({ offsetY: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Show After Scroll */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Scroll Sonrası Göster (%)
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={content.display.showAfterScroll}
          onChange={(e) => updateDisplay({ showAfterScroll: parseInt(e.target.value) })}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-slate-500 mt-1">
          <span>0% (Hemen)</span>
          <span className="font-semibold text-sage-600">{content.display.showAfterScroll}%</span>
          <span>100%</span>
        </div>
        <p className="text-xs text-slate-500 mt-2">
          Kullanıcı sayfanın %{content.display.showAfterScroll}'ini scroll ettikten sonra buton görünür
        </p>
      </div>

      {/* Show After Delay */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Gecikme (Saniye)
        </label>
        <input
          type="number"
          min="0"
          max="60"
          value={content.display.showAfterDelay / 1000}
          onChange={(e) => updateDisplay({ showAfterDelay: (parseInt(e.target.value) || 0) * 1000 })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
        />
        <p className="text-xs text-slate-500 mt-1">
          Scroll şartı sağlandıktan sonra kaç saniye beklesin
        </p>
      </div>

      {/* Device Visibility */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Cihaz Görünürlüğü</label>
        <div className="space-y-2">
          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-700">Mobil Cihazlarda Göster</span>
            <input
              type="checkbox"
              checked={content.display.showOnMobile}
              onChange={(e) => updateDisplay({ showOnMobile: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
          </label>
          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-700">Masaüstünde Göster</span>
            <input
              type="checkbox"
              checked={content.display.showOnDesktop}
              onChange={(e) => updateDisplay({ showOnDesktop: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
          </label>
        </div>
      </div>

      {/* Excluded Pages */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">
          Hariç Tutulan Sayfalar
        </label>
        <input
          type="text"
          value={content.display.excludedPages.join(', ')}
          onChange={(e) => updateDisplay({ 
            excludedPages: e.target.value.split(',').map(s => s.trim()).filter(Boolean) 
          })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          placeholder="ana-sayfa, iletisim (virgülle ayırın)"
        />
        <p className="text-xs text-slate-500 mt-1">
          Bu sayfalarda buton gösterilmez
        </p>
      </div>
    </div>
  )
}

// Style Tab
function StyleTab({ content, updateContent }: { content: StickyButtonContent; updateContent: (updates: Partial<StickyButtonContent>) => void }) {
  const updateStyle = (updates: Partial<StickyButtonContent['style']>) => {
    updateContent({
      style: { ...content.style, ...updates }
    })
  }

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Renkler</label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Arkaplan Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.style.backgroundColor}
                onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.style.backgroundColor}
                onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Metin Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.style.textColor}
                onChange={(e) => updateStyle({ textColor: e.target.value })}
                className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.style.textColor}
                onChange={(e) => updateStyle({ textColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Hover Arkaplan Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.style.hoverBackgroundColor || '#166534'}
                onChange={(e) => updateStyle({ hoverBackgroundColor: e.target.value })}
                className="w-12 h-10 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.style.hoverBackgroundColor || '#166534'}
                onChange={(e) => updateStyle({ hoverBackgroundColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Tipografi</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font Boyutu</label>
            <select
              value={content.style.fontSize}
              onChange={(e) => updateStyle({ fontSize: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="0.75rem">12px (Küçük)</option>
              <option value="0.875rem">14px</option>
              <option value="1rem">16px (Normal)</option>
              <option value="1.125rem">18px</option>
              <option value="1.25rem">20px (Büyük)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font Kalınlığı</label>
            <select
              value={content.style.fontWeight}
              onChange={(e) => updateStyle({ fontWeight: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="400">Normal</option>
              <option value="500">Medium</option>
              <option value="600">Semi Bold</option>
              <option value="700">Bold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Padding */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Padding</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Yatay (X)</label>
            <input
              type="number"
              min="8"
              max="64"
              value={content.style.paddingX}
              onChange={(e) => updateStyle({ paddingX: parseInt(e.target.value) || 32 })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Dikey (Y)</label>
            <input
              type="number"
              min="8"
              max="64"
              value={content.style.paddingY}
              onChange={(e) => updateStyle({ paddingY: parseInt(e.target.value) || 16 })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>

      {/* Border Radius */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Köşe Yuvarlaklığı</label>
        <input
          type="text"
          value={content.style.borderRadius}
          onChange={(e) => updateStyle({ borderRadius: e.target.value })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
          placeholder="0.75rem"
        />
      </div>

      {/* Shadow */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Gölge</label>
        <select
          value={content.style.shadow}
          onChange={(e) => updateStyle({ shadow: e.target.value as StickyButtonContent['style']['shadow'] })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
        >
          <option value="none">Gölge Yok</option>
          <option value="sm">Küçük</option>
          <option value="md">Orta</option>
          <option value="lg">Büyük</option>
          <option value="xl">Çok Büyük</option>
          <option value="2xl">Ekstra Büyük</option>
        </select>
      </div>

      {/* Hover Effect */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">Hover Efekti</label>
        <select
          value={content.style.hoverEffect}
          onChange={(e) => updateStyle({ hoverEffect: e.target.value as StickyButtonContent['style']['hoverEffect'] })}
          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
        >
          <option value="none">Yok</option>
          <option value="scale">Büyüt (Scale)</option>
          <option value="lift">Yukarı Kaldır</option>
          <option value="glow">Parlama</option>
        </select>
        {content.style.hoverEffect === 'scale' && (
          <div className="mt-3">
            <label className="block text-xs text-slate-500 mb-1">Hover Scale</label>
            <input
              type="number"
              min="1"
              max="1.2"
              step="0.05"
              value={content.style.hoverScale || 1.05}
              onChange={(e) => updateStyle({ hoverScale: parseFloat(e.target.value) || 1.05 })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        )}
      </div>

      {/* Mobile Responsive */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Mobil Responsive</label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font Boyutu</label>
            <select
              value={content.responsive.mobile.fontSize}
              onChange={(e) => updateContent({
                responsive: {
                  ...content.responsive,
                  mobile: { ...content.responsive.mobile, fontSize: e.target.value }
                }
              })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="0.75rem">12px</option>
              <option value="0.875rem">14px</option>
              <option value="1rem">16px</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Padding X</label>
            <input
              type="number"
              min="8"
              max="48"
              value={content.responsive.mobile.paddingX}
              onChange={(e) => updateContent({
                responsive: {
                  ...content.responsive,
                  mobile: { ...content.responsive.mobile, paddingX: parseInt(e.target.value) || 24 }
                }
              })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Padding Y</label>
            <input
              type="number"
              min="8"
              max="48"
              value={content.responsive.mobile.paddingY}
              onChange={(e) => updateContent({
                responsive: {
                  ...content.responsive,
                  mobile: { ...content.responsive.mobile, paddingY: parseInt(e.target.value) || 12 }
                }
              })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

// Animation Tab
function AnimationTab({ content, updateContent }: { content: StickyButtonContent; updateContent: (updates: Partial<StickyButtonContent>) => void }) {
  const updateAnimation = (updates: Partial<StickyButtonContent['animation']>) => {
    updateContent({
      animation: { ...content.animation, ...updates }
    })
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="flex items-center justify-between">
          <span className="text-sm font-semibold text-slate-700">Animasyonu Aktif Et</span>
          <input
            type="checkbox"
            checked={content.animation.enabled}
            onChange={(e) => updateAnimation({ enabled: e.target.checked })}
            className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
          />
        </label>
      </div>

      {content.animation.enabled && (
        <>
          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">Animasyon Tipi</label>
            <select
              value={content.animation.type}
              onChange={(e) => updateAnimation({ type: e.target.value as StickyButtonContent['animation']['type'] })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="none">Yok</option>
              <option value="fade">Fade In</option>
              <option value="slide">Slide Up</option>
              <option value="bounce">Bounce</option>
            </select>
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Süre (Milisaniye)
            </label>
            <input
              type="number"
              min="100"
              max="2000"
              step="100"
              value={content.animation.duration}
              onChange={(e) => updateAnimation({ duration: parseInt(e.target.value) || 300 })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>
        </>
      )}
    </div>
  )
}

export default function StickyButtonBlockEditor({ content: initialContent, onUpdate }: StickyButtonBlockEditorProps) {
  const [activeTab, setActiveTab] = useState('basic')

  // Merge initial content with defaults
  const mergedContent = deepMerge(defaultContent, initialContent as Partial<StickyButtonContent>)
  const [content, setContent] = useState<StickyButtonContent>(mergedContent)

  // Debounce ref
  const debounceRef = useRef<NodeJS.Timeout | null>(null)
  const isInitialMount = useRef(true)

  // Debounced update
  const debouncedUpdate = useCallback((newContent: StickyButtonContent) => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }
    debounceRef.current = setTimeout(() => {
      onUpdate(newContent as unknown as Record<string, unknown>)
    }, 300)
  }, [onUpdate])

  // Update content handler
  const updateContent = useCallback((updates: Partial<StickyButtonContent>) => {
    setContent(prev => {
      const newContent = deepMerge(prev, updates)
      debouncedUpdate(newContent)
      return newContent
    })
  }, [debouncedUpdate])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // Render current tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return <BasicTab content={content} updateContent={updateContent} />
      case 'display':
        return <DisplayTab content={content} updateContent={updateContent} />
      case 'style':
        return <StyleTab content={content} updateContent={updateContent} />
      case 'animation':
        return <AnimationTab content={content} updateContent={updateContent} />
      default:
        return null
    }
  }

  return (
    <div className="sticky-button-block-editor">
      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-slate-100 p-1 rounded-xl overflow-x-auto">
        {STICKY_BUTTON_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-sage-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <span className="w-6 h-6 flex items-center justify-center bg-slate-200 rounded text-xs font-bold">
              {tab.icon}
            </span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {renderTabContent()}
      </div>

      {/* Preview Section */}
      <div className="mt-8 p-6 bg-slate-50 rounded-xl">
        <h4 className="text-sm font-medium text-slate-700 mb-4">Buton Önizlemesi</h4>
        <div className="flex items-center justify-center min-h-[120px] bg-white rounded-lg border border-slate-200 relative overflow-hidden">
          <div className={`absolute ${content.position === 'bottom-left' ? 'left-4' : content.position === 'bottom-right' ? 'right-4' : 'left-1/2 -translate-x-1/2'} bottom-4`}>
            <a
              href={content.link}
              className={`inline-flex items-center justify-center gap-2 transition-all ${
                content.style.shadow === 'xl' ? 'shadow-xl' :
                content.style.shadow === 'lg' ? 'shadow-lg' :
                content.style.shadow === 'md' ? 'shadow-md' :
                content.style.shadow === 'sm' ? 'shadow-sm' : ''
              }`}
              style={{
                backgroundColor: content.style.backgroundColor,
                color: content.style.textColor,
                fontSize: content.style.fontSize,
                fontWeight: content.style.fontWeight,
                paddingLeft: `${content.style.paddingX}px`,
                paddingRight: `${content.style.paddingX}px`,
                paddingTop: `${content.style.paddingY}px`,
                paddingBottom: `${content.style.paddingY}px`,
                borderRadius: content.style.borderRadius
              }}
            >
              {content.icon && content.iconPosition === 'left' && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
              <span>{content.text}</span>
              {content.icon && content.iconPosition === 'right' && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              )}
            </a>
          </div>
        </div>
        <p className="text-xs text-slate-500 mt-2 text-center">
          Gerçek görünüm sayfa önizlemesinde görünecektir
        </p>
      </div>
    </div>
  )
}

