'use client'

import { TextContent, TextAnimations, TextResponsive } from '../../types'

import { getDefaultTextContent, TEXT_STYLE_PRESETS } from './defaults'

interface AdvancedTabProps {
  content: TextContent
  updateContent: (updates: Partial<TextContent>) => void
}

export default function AdvancedTab({ content, updateContent }: AdvancedTabProps) {
  const updateAnimations = (updates: Partial<TextAnimations>) => {
    updateContent({ animations: { ...content.animations, ...updates } })
  }

  const updateResponsive = (updates: Partial<TextResponsive>) => {
    updateContent({ responsive: { ...content.responsive, ...updates } })
  }

  return (
    <div className="space-y-6">
      {/* Animations */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Animasyonlar</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.animations?.enabled ?? true}
              onChange={(e) => updateAnimations({ enabled: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>

        {content.animations?.enabled && (
          <div className="space-y-4">
            {/* Animation Type */}
            <div>
              <label className="block text-xs text-slate-500 mb-2">Animasyon Tipi</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'Yok' },
                  { id: 'fade', label: 'Fade' },
                  { id: 'slide-up', label: 'Yukarı' },
                  { id: 'slide-left', label: 'Soldan' },
                  { id: 'slide-right', label: 'Sağdan' },
                  { id: 'zoom', label: 'Zoom' },
                  { id: 'typewriter', label: 'Daktilo' },
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => updateAnimations({ type: type.id as any })}
                    className={`p-2 rounded-lg border text-center text-xs transition-all ${
                      content.animations?.type === type.id
                        ? 'border-sage-500 bg-sage-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Timing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Süre: {content.animations?.duration || 500}ms
                </label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={content.animations?.duration || 500}
                  onChange={(e) => updateAnimations({ duration: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Gecikme: {content.animations?.delay || 0}ms
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="100"
                  value={content.animations?.delay || 0}
                  onChange={(e) => updateAnimations({ delay: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.animations?.triggerOnScroll ?? true}
                  onChange={(e) => updateAnimations({ triggerOnScroll: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                />
                <span className="text-sm text-slate-600">Scroll ile Tetikle</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.animations?.staggerParagraphs ?? false}
                  onChange={(e) => updateAnimations({ staggerParagraphs: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                />
                <span className="text-sm text-slate-600">Paragrafları Kademeli</span>
              </label>
            </div>

            {content.animations?.staggerParagraphs && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Kademeli Gecikme: {content.animations?.staggerDelay || 100}ms
                </label>
                <input
                  type="range"
                  min="50"
                  max="500"
                  step="50"
                  value={content.animations?.staggerDelay || 100}
                  onChange={(e) => updateAnimations({ staggerDelay: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Responsive Settings */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Responsive Ayarları</label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Desktop */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span>🖥️</span> Masaüstü
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Başlık Boyutu</label>
                <select
                  value={content.responsive?.desktop?.titleSize || '2rem'}
                  onChange={(e) => updateResponsive({
                    desktop: { ...content.responsive?.desktop, titleSize: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['1.5rem', '1.75rem', '2rem', '2.5rem', '3rem', '3.5rem'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Metin Boyutu</label>
                <select
                  value={content.responsive?.desktop?.bodySize || '1.125rem'}
                  onChange={(e) => updateResponsive({
                    desktop: { ...content.responsive?.desktop, bodySize: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['1rem', '1.125rem', '1.25rem', '1.375rem'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span>📱</span> Tablet
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Başlık Boyutu</label>
                <select
                  value={content.responsive?.tablet?.titleSize || '1.75rem'}
                  onChange={(e) => updateResponsive({
                    tablet: { ...content.responsive?.tablet, titleSize: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['1.25rem', '1.5rem', '1.75rem', '2rem', '2.5rem'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Metin Boyutu</label>
                <select
                  value={content.responsive?.tablet?.bodySize || '1rem'}
                  onChange={(e) => updateResponsive({
                    tablet: { ...content.responsive?.tablet, bodySize: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['0.875rem', '1rem', '1.125rem'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span>📱</span> Mobil
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Başlık Boyutu</label>
                <select
                  value={content.responsive?.mobile?.titleSize || '1.5rem'}
                  onChange={(e) => updateResponsive({
                    mobile: { ...content.responsive?.mobile, titleSize: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['1.25rem', '1.5rem', '1.75rem', '2rem'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Metin Boyutu</label>
                <select
                  value={content.responsive?.mobile?.bodySize || '1rem'}
                  onChange={(e) => updateResponsive({
                    mobile: { ...content.responsive?.mobile, bodySize: e.target.value }
                  })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['0.875rem', '1rem', '1.125rem'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Hizalama</label>
                <select
                  value={content.responsive?.mobileAlignment || 'left'}
                  onChange={(e) => updateResponsive({ mobileAlignment: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="left">Sol</option>
                  <option value="center">Orta</option>
                  <option value="right">Sağ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Padding</label>
                <select
                  value={content.responsive?.mobilePadding || '1rem'}
                  onChange={(e) => updateResponsive({ mobilePadding: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['0.5rem', '1rem', '1.5rem', '2rem'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Style Presets */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Hazır Şablonlar</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(TEXT_STYLE_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => {
                updateContent({
                  stylePreset: key as any,
                  ...(preset.settings as Partial<TextContent>)
                })
              }}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                content.stylePreset === key
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              } ${key === 'about' ? 'ring-2 ring-sage-200' : ''}`}
            >
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-slate-700">{preset.label}</div>
                {key === 'about' && (
                  <span className="px-2 py-0.5 bg-sage-500 text-white text-xs rounded-full">Öncelik</span>
                )}
              </div>
              <div className="text-xs text-slate-500 mt-1">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom CSS Class */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Özel CSS Sınıfı</label>
        <input
          type="text"
          value={content.customClass || ''}
          onChange={(e) => updateContent({ customClass: e.target.value })}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm"
          placeholder="my-custom-class"
        />
        <p className="text-xs text-slate-500 mt-2">
          Özel stiller için ekstra CSS sınıfı ekleyebilirsiniz.
        </p>
      </div>

      {/* Reset All */}
      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-red-700">Tümünü Sıfırla</h4>
            <p className="text-sm text-red-600">Tüm ayarları varsayılana döndür</p>
          </div>
          <button
            onClick={() => {
              if (confirm('Tüm ayarları sıfırlamak istediğinizden emin misiniz?')) {
                const defaults = getDefaultTextContent()
                updateContent(defaults)
              }
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Sıfırla
          </button>
        </div>
      </div>
    </div>
  )
}
