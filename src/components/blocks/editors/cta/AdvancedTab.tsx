'use client'

import { CTAContent, CTAAnimations, CTAResponsive, CTATypography } from '../../types'
import { getDefaultCTAContent, CTA_STYLE_PRESETS, ANIMATION_OPTIONS } from './defaults'

interface AdvancedTabProps {
  content: CTAContent
  updateContent: (updates: Partial<CTAContent>) => void
}

export default function AdvancedTab({ content, updateContent }: AdvancedTabProps) {
  const updateAnimations = (updates: Partial<CTAAnimations>) => {
    updateContent({
      animations: { ...content.animations, ...updates }
    })
  }

  const updateResponsive = (
    breakpoint: 'desktop' | 'tablet' | 'mobile',
    updates: Partial<CTAResponsive['desktop'] | CTAResponsive['tablet'] | CTAResponsive['mobile']>
  ) => {
    updateContent({
      responsive: {
        ...content.responsive,
        [breakpoint]: { ...content.responsive[breakpoint], ...updates }
      }
    })
  }

  const updateTypography = (
    key: 'title' | 'subtitle' | 'description',
    updates: Record<string, string | undefined>
  ) => {
    updateContent({
      typography: {
        ...content.typography,
        [key]: { ...content.typography[key], ...updates }
      }
    })
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
              checked={content.animations.enabled}
              onChange={(e) => updateAnimations({ enabled: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>

        {content.animations.enabled && (
          <div className="space-y-4">
            {/* Title Animation */}
            <div>
              <label className="block text-xs text-slate-500 mb-2">Baslik Animasyonu</label>
              <div className="grid grid-cols-4 gap-2">
                {ANIMATION_OPTIONS.map(anim => (
                  <button
                    key={anim.id}
                    onClick={() => updateAnimations({ titleAnimation: anim.id as any })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.animations.titleAnimation === anim.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {anim.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitle Animation */}
            <div>
              <label className="block text-xs text-slate-500 mb-2">Alt Baslik Animasyonu</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'none', label: 'Yok' },
                  { id: 'fade', label: 'Fade' },
                  { id: 'slide-up', label: 'Yukarı' },
                  { id: 'slide-down', label: 'Asağı' },
                  { id: 'zoom', label: 'Zoom' }
                ].map(anim => (
                  <button
                    key={anim.id}
                    onClick={() => updateAnimations({ subtitleAnimation: anim.id as any })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.animations.subtitleAnimation === anim.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {anim.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Button Animation */}
            <div>
              <label className="block text-xs text-slate-500 mb-2">Buton Animasyonu</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'none', label: 'Yok' },
                  { id: 'fade', label: 'Fade' },
                  { id: 'slide-up', label: 'Yukarı' },
                  { id: 'bounce', label: 'Bounce' },
                  { id: 'scale', label: 'Scale' }
                ].map(anim => (
                  <button
                    key={anim.id}
                    onClick={() => updateAnimations({ buttonAnimation: anim.id as any })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.animations.buttonAnimation === anim.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {anim.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Decoration Animation */}
            {content.showDecoration && (
              <div>
                <label className="block text-xs text-slate-500 mb-2">Dekorasyon Animasyonu</label>
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { id: 'none', label: 'Yok' },
                    { id: 'fade', label: 'Fade' },
                    { id: 'slide', label: 'Slide' },
                    { id: 'zoom', label: 'Zoom' },
                    { id: 'parallax', label: 'Parallax' }
                  ].map(anim => (
                    <button
                      key={anim.id}
                      onClick={() => updateAnimations({ decorationAnimation: anim.id as any })}
                      className={`p-2 rounded-lg text-xs font-medium transition-all ${
                        content.animations.decorationAnimation === anim.id
                          ? 'bg-sage-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {anim.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Timing */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Sure: {content.animations.duration}ms
                </label>
                <input
                  type="range"
                  min="200"
                  max="2000"
                  step="100"
                  value={content.animations.duration}
                  onChange={(e) => updateAnimations({ duration: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Gecikme: {content.animations.delay}ms
                </label>
                <input
                  type="range"
                  min="0"
                  max="1000"
                  step="50"
                  value={content.animations.delay}
                  onChange={(e) => updateAnimations({ delay: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Kademeli: {content.animations.staggerDelay}ms
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="25"
                  value={content.animations.staggerDelay}
                  onChange={(e) => updateAnimations({ staggerDelay: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
            </div>

            {/* Options */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.animations.triggerOnScroll}
                  onChange={(e) => updateAnimations({ triggerOnScroll: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                />
                <span className="text-sm text-slate-600">Scroll ile Tetikle</span>
              </label>
            </div>

            {/* Background Animation */}
            <div>
              <label className="block text-xs text-slate-500 mb-2">Arkaplan Animasyonu</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'Yok' },
                  { id: 'gradient-shift', label: 'Gradient Kayma' },
                  { id: 'parallax', label: 'Parallax' },
                  { id: 'pulse', label: 'Pulse' }
                ].map(anim => (
                  <button
                    key={anim.id}
                    onClick={() => updateAnimations({ backgroundAnimation: anim.id as any })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.animations.backgroundAnimation === anim.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {anim.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Typography */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Tipografi</label>

        <div className="space-y-4">
          {/* Title Typography */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <label className="block text-xs font-medium text-slate-600 mb-3">Baslik</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Font Boyutu</label>
                <select
                  value={content.typography.title.fontSize}
                  onChange={(e) => updateTypography('title', { fontSize: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="1.5rem">1.5rem (24px)</option>
                  <option value="2rem">2rem (32px)</option>
                  <option value="2.5rem">2.5rem (40px)</option>
                  <option value="3rem">3rem (48px)</option>
                  <option value="3.5rem">3.5rem (56px)</option>
                  <option value="4rem">4rem (64px)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Font Kalinligi</label>
                <select
                  value={content.typography.title.fontWeight}
                  onChange={(e) => updateTypography('title', { fontWeight: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="400">Normal (400)</option>
                  <option value="500">Medium (500)</option>
                  <option value="600">Semibold (600)</option>
                  <option value="700">Bold (700)</option>
                  <option value="800">Extrabold (800)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Satir Yuksekligi</label>
                <select
                  value={content.typography.title.lineHeight}
                  onChange={(e) => updateTypography('title', { lineHeight: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="1">1</option>
                  <option value="1.1">1.1</option>
                  <option value="1.2">1.2</option>
                  <option value="1.3">1.3</option>
                  <option value="1.4">1.4</option>
                  <option value="1.5">1.5</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Harf Araligi</label>
                <select
                  value={content.typography.title.letterSpacing}
                  onChange={(e) => updateTypography('title', { letterSpacing: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="-0.05em">-0.05em</option>
                  <option value="-0.02em">-0.02em</option>
                  <option value="0">Normal</option>
                  <option value="0.02em">0.02em</option>
                  <option value="0.05em">0.05em</option>
                </select>
              </div>
            </div>
            <div className="mt-3">
              <label className="block text-xs text-slate-500 mb-2">Metin Donusumu</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'Normal' },
                  { id: 'uppercase', label: 'BUYUK' },
                  { id: 'lowercase', label: 'kucuk' },
                  { id: 'capitalize', label: 'Baslık' }
                ].map(transform => (
                  <button
                    key={transform.id}
                    onClick={() => updateTypography('title', { textTransform: transform.id as any })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.typography.title.textTransform === transform.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {transform.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Subtitle Typography */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <label className="block text-xs font-medium text-slate-600 mb-3">Alt Baslik</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Font Boyutu</label>
                <select
                  value={content.typography.subtitle.fontSize}
                  onChange={(e) => updateTypography('subtitle', { fontSize: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="1rem">1rem (16px)</option>
                  <option value="1.125rem">1.125rem (18px)</option>
                  <option value="1.25rem">1.25rem (20px)</option>
                  <option value="1.5rem">1.5rem (24px)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Max Genislik</label>
                <select
                  value={content.typography.subtitle.maxWidth}
                  onChange={(e) => updateTypography('subtitle', { maxWidth: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="400px">400px</option>
                  <option value="500px">500px</option>
                  <option value="600px">600px</option>
                  <option value="700px">700px</option>
                  <option value="100%">Tam</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Settings */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Responsive Ayarlari</label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Desktop */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span>🖥️</span> Masaustu
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Baslik Boyutu</label>
                <select
                  value={content.responsive.desktop.titleSize}
                  onChange={(e) => updateResponsive('desktop', { titleSize: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['2rem', '2.5rem', '3rem', '3.5rem', '4rem'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Alt Baslik Boyutu</label>
                <select
                  value={content.responsive.desktop.subtitleSize}
                  onChange={(e) => updateResponsive('desktop', { subtitleSize: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['1rem', '1.125rem', '1.25rem', '1.5rem'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Buton Boyutu</label>
                <select
                  value={content.responsive.desktop.buttonSize}
                  onChange={(e) => updateResponsive('desktop', { buttonSize: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="sm">Kucuk</option>
                  <option value="md">Orta</option>
                  <option value="lg">Buyuk</option>
                  <option value="xl">Cok Buyuk</option>
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
                <label className="block text-xs text-slate-500 mb-1">Baslik Boyutu</label>
                <select
                  value={content.responsive.tablet.titleSize}
                  onChange={(e) => updateResponsive('tablet', { titleSize: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['1.5rem', '1.75rem', '2rem', '2.5rem', '3rem'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Alt Baslik Boyutu</label>
                <select
                  value={content.responsive.tablet.subtitleSize}
                  onChange={(e) => updateResponsive('tablet', { subtitleSize: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['0.875rem', '1rem', '1.125rem', '1.25rem'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Duzen</label>
                <select
                  value={content.responsive.tablet.layout || 'original'}
                  onChange={(e) => updateResponsive('tablet', { layout: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="original">Orijinal</option>
                  <option value="stacked">Yiğilmis</option>
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
                <label className="block text-xs text-slate-500 mb-1">Baslik Boyutu</label>
                <select
                  value={content.responsive.mobile.titleSize}
                  onChange={(e) => updateResponsive('mobile', { titleSize: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['1.25rem', '1.5rem', '1.75rem', '2rem'].map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Metin Hizalama</label>
                <select
                  value={content.responsive.mobile.textAlign}
                  onChange={(e) => updateResponsive('mobile', { textAlign: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="left">Sol</option>
                  <option value="center">Orta</option>
                  <option value="right">Sag</option>
                </select>
              </div>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.responsive.mobile.hideDecoration}
                  onChange={(e) => updateResponsive('mobile', { hideDecoration: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                />
                <span className="text-xs text-slate-600">Dekorasyonu Gizle</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Style Presets */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Hazir Sablonlar</label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {Object.entries(CTA_STYLE_PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => {
                updateContent(preset.settings)
              }}
              className="p-4 rounded-xl border-2 border-slate-200 hover:border-sage-300 transition-all text-left"
            >
              <div className="text-sm font-medium text-slate-700">{preset.label}</div>
              <div className="text-xs text-slate-500 mt-1">{preset.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom CSS Class */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Ozel CSS Sinifi</label>
        <input
          type="text"
          value={content.customClass || ''}
          onChange={(e) => updateContent({ customClass: e.target.value })}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm"
          placeholder="my-custom-cta"
        />
        <p className="text-xs text-slate-500 mt-2">
          Ozel stiller icin ekstra CSS sinifi ekleyebilirsiniz.
        </p>
      </div>

      {/* Reset All */}
      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-red-700">Tumunu Sifirla</h4>
            <p className="text-sm text-red-600">Tum ayarlari varsayilana dondur</p>
          </div>
          <button
            onClick={() => {
              if (confirm('Tum ayarlari sifirlamak istediğinizden emin misiniz?')) {
                const defaults = getDefaultCTAContent()
                updateContent(defaults)
              }
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Sifirla
          </button>
        </div>
      </div>
    </div>
  )
}
