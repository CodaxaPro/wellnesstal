'use client'

import { TeamContent, TeamAnimations, TeamResponsive, TeamCTA, TeamCarouselSettings } from '../../types'

import { ANIMATION_TYPE_OPTIONS, CTA_BUTTON_STYLE_OPTIONS } from './defaults'

interface AdvancedTabProps {
  content: TeamContent
  updateContent: (updates: Partial<TeamContent>) => void
}

export default function AdvancedTab({ content, updateContent }: AdvancedTabProps) {
  const animations = content.animations || { enabled: true }
  const responsive = content.responsive || {
    desktop: { columns: 3, gap: '2rem', padding: '4rem' },
    tablet: { columns: 2, gap: '1.5rem', padding: '3rem' },
    mobile: { columns: 1, gap: '1rem', padding: '2rem' }
  }
  const cta = content.cta || { enabled: false }
  const carousel = content.carousel || {}

  const updateAnimations = (updates: Partial<TeamAnimations>) => {
    updateContent({ animations: { ...animations, ...updates } })
  }

  const updateResponsive = (breakpoint: 'desktop' | 'tablet' | 'mobile', updates: Record<string, string | number | boolean>) => {
    updateContent({
      responsive: {
        ...responsive,
        [breakpoint]: { ...responsive[breakpoint], ...updates }
      }
    })
  }

  const updateCTA = (updates: Partial<TeamCTA>) => {
    updateContent({ cta: { ...cta, ...updates } })
  }

  const updateCarousel = (updates: Partial<TeamCarouselSettings>) => {
    updateContent({ carousel: { ...carousel, ...updates } })
  }

  return (
    <div className="space-y-6">
      {/* Animations */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Animasyonlar</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={animations.enabled !== false}
              onChange={(e) => updateAnimations({ enabled: e.target.checked })}
              className="w-4 h-4 text-sage-600 rounded"
            />
            <span className="text-sm text-slate-700">Animasyonlari Etkinlestir</span>
          </label>

          {animations.enabled !== false && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Animasyon Tipi</label>
                  <select
                    value={animations.type || 'fade'}
                    onChange={(e) => updateAnimations({ type: e.target.value as TeamAnimations['type'] })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    {ANIMATION_TYPE_OPTIONS.map((option) => (
                      <option key={option.id} value={option.id}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Sure (ms)</label>
                  <input
                    type="number"
                    value={animations.duration || 500}
                    onChange={(e) => updateAnimations({ duration: parseInt(e.target.value) })}
                    min={100}
                    max={2000}
                    step={50}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Gecikme (ms)</label>
                  <input
                    type="number"
                    value={animations.delay || 0}
                    onChange={(e) => updateAnimations({ delay: parseInt(e.target.value) })}
                    min={0}
                    max={2000}
                    step={50}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Stagger Gecikme (ms)</label>
                  <input
                    type="number"
                    value={animations.staggerDelay || 100}
                    onChange={(e) => updateAnimations({ staggerDelay: parseInt(e.target.value) })}
                    min={0}
                    max={500}
                    step={25}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animations.stagger !== false}
                    onChange={(e) => updateAnimations({ stagger: e.target.checked })}
                    className="w-4 h-4 text-sage-600 rounded"
                  />
                  <span className="text-sm text-slate-700">Stagger (Sirayla Animasyon)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animations.triggerOnScroll !== false}
                    onChange={(e) => updateAnimations({ triggerOnScroll: e.target.checked })}
                    className="w-4 h-4 text-sage-600 rounded"
                  />
                  <span className="text-sm text-slate-700">Scroll'da Tetikle</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={animations.hoverEffects !== false}
                    onChange={(e) => updateAnimations({ hoverEffects: e.target.checked })}
                    className="w-4 h-4 text-sage-600 rounded"
                  />
                  <span className="text-sm text-slate-700">Hover Efektleri</span>
                </label>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Responsive Settings */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Responsive Ayarlar</h3>
        <div className="space-y-4">
          {/* Desktop */}
          <div>
            <h4 className="text-xs font-medium text-slate-500 uppercase mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Desktop
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Kolon</label>
                <select
                  value={responsive.desktop.columns}
                  onChange={(e) => updateResponsive('desktop', { columns: parseInt(e.target.value) })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                >
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Aralik</label>
                <input
                  type="text"
                  value={responsive.desktop.gap}
                  onChange={(e) => updateResponsive('desktop', { gap: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Padding</label>
                <input
                  type="text"
                  value={responsive.desktop.padding}
                  onChange={(e) => updateResponsive('desktop', { padding: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div>
            <h4 className="text-xs font-medium text-slate-500 uppercase mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Tablet
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Kolon</label>
                <select
                  value={responsive.tablet.columns}
                  onChange={(e) => updateResponsive('tablet', { columns: parseInt(e.target.value) })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                >
                  {[1, 2, 3, 4].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Aralik</label>
                <input
                  type="text"
                  value={responsive.tablet.gap}
                  onChange={(e) => updateResponsive('tablet', { gap: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Padding</label>
                <input
                  type="text"
                  value={responsive.tablet.padding}
                  onChange={(e) => updateResponsive('tablet', { padding: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                />
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div>
            <h4 className="text-xs font-medium text-slate-500 uppercase mb-2 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobile
            </h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Kolon</label>
                <select
                  value={responsive.mobile.columns}
                  onChange={(e) => updateResponsive('mobile', { columns: parseInt(e.target.value) })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                >
                  {[1, 2].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Aralik</label>
                <input
                  type="text"
                  value={responsive.mobile.gap}
                  onChange={(e) => updateResponsive('mobile', { gap: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Padding</label>
                <input
                  type="text"
                  value={responsive.mobile.padding}
                  onChange={(e) => updateResponsive('mobile', { padding: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Carousel Settings (shown only when layout is carousel) */}
      {content.layout === 'carousel' && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Carousel Ayarlari</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Gorunen Slide</label>
                <input
                  type="number"
                  value={carousel.slidesPerView || 3}
                  onChange={(e) => updateCarousel({ slidesPerView: parseInt(e.target.value) })}
                  min={1}
                  max={6}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Oto-Play Suresi (ms)</label>
                <input
                  type="number"
                  value={carousel.autoPlayInterval || 5000}
                  onChange={(e) => updateCarousel({ autoPlayInterval: parseInt(e.target.value) })}
                  min={1000}
                  max={15000}
                  step={500}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={carousel.autoPlay !== false}
                  onChange={(e) => updateCarousel({ autoPlay: e.target.checked })}
                  className="w-4 h-4 text-sage-600 rounded"
                />
                <span className="text-sm text-slate-700">Otomatik Oynat</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={carousel.loop !== false}
                  onChange={(e) => updateCarousel({ loop: e.target.checked })}
                  className="w-4 h-4 text-sage-600 rounded"
                />
                <span className="text-sm text-slate-700">Dongu (Loop)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={carousel.showDots !== false}
                  onChange={(e) => updateCarousel({ showDots: e.target.checked })}
                  className="w-4 h-4 text-sage-600 rounded"
                />
                <span className="text-sm text-slate-700">Noktalari Goster</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={carousel.showArrows !== false}
                  onChange={(e) => updateCarousel({ showArrows: e.target.checked })}
                  className="w-4 h-4 text-sage-600 rounded"
                />
                <span className="text-sm text-slate-700">Oklari Goster</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={carousel.pauseOnHover !== false}
                  onChange={(e) => updateCarousel({ pauseOnHover: e.target.checked })}
                  className="w-4 h-4 text-sage-600 rounded"
                />
                <span className="text-sm text-slate-700">Hover'da Durdur</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Ekibe Katil CTA</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={cta.enabled === true}
              onChange={(e) => updateCTA({ enabled: e.target.checked })}
              className="w-4 h-4 text-sage-600 rounded"
            />
            <span className="text-sm text-slate-700">CTA Bolumu Goster</span>
          </label>

          {cta.enabled && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Baslik</label>
                <input
                  type="text"
                  value={cta.title || ''}
                  onChange={(e) => updateCTA({ title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="Ekibimize Katilin!"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Alt Baslik</label>
                <input
                  type="text"
                  value={cta.subtitle || ''}
                  onChange={(e) => updateCTA({ subtitle: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="Kariyer firsatlari icin basvurun"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Buton Metni</label>
                  <input
                    type="text"
                    value={cta.buttonText || ''}
                    onChange={(e) => updateCTA({ buttonText: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    placeholder="Basvur"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">Buton Linki</label>
                  <input
                    type="text"
                    value={cta.buttonLink || ''}
                    onChange={(e) => updateCTA({ buttonLink: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    placeholder="/kariyer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Buton Stili</label>
                <select
                  value={cta.buttonStyle || 'primary'}
                  onChange={(e) => updateCTA({ buttonStyle: e.target.value as TeamCTA['buttonStyle'] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {CTA_BUTTON_STYLE_OPTIONS.map((option) => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Section ID */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Diger Ayarlar</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Section ID (Navigasyon icin)</label>
            <input
              type="text"
              value={content.sectionId || ''}
              onChange={(e) => updateContent({ sectionId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="ekip"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Ozel CSS Sinifi</label>
            <input
              type="text"
              value={content.customClass || ''}
              onChange={(e) => updateContent({ customClass: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="my-custom-class"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
