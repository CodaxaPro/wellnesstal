'use client'

import { FAQContent, FAQAnimations, FAQResponsive, FAQSearchConfig, FAQHelpfulVotes, FAQContactCTA } from '../../types'
import {
  ANIMATION_TYPE_OPTIONS,
  EXPAND_ANIMATION_OPTIONS,
  CATEGORY_STYLE_OPTIONS,
  HELPFUL_STYLE_OPTIONS,
  CTA_BUTTON_STYLE_OPTIONS
} from './defaults'

interface AdvancedTabProps {
  content: FAQContent
  updateContent: (updates: Partial<FAQContent>) => void
}

const defaultAnimations: FAQAnimations = {
  enabled: true,
  type: 'fade',
  expandAnimation: 'smooth',
  expandDuration: 300,
  stagger: true,
  staggerDelay: 100,
  duration: 500,
  triggerOnScroll: true,
  hoverEffects: true
}

const defaultResponsive: FAQResponsive = {
  desktop: { columns: 2, gap: '1.5rem', padding: '4rem' },
  tablet: { columns: 2, gap: '1rem', padding: '3rem' },
  mobile: { columns: 1, gap: '1rem', padding: '2rem' }
}

const defaultSearch: FAQSearchConfig = {
  enabled: false,
  placeholder: 'Soru ara...',
  position: 'above-items',
  searchInAnswers: true,
  highlightMatches: false,
  noResultsText: 'Aradiginiz kriterlere uygun soru bulunamadi.'
}

const defaultHelpfulVotes: FAQHelpfulVotes = {
  enabled: false,
  position: 'bottom',
  text: 'Bu cevap faydali oldu mu?',
  yesText: 'Evet',
  noText: 'Hayir',
  showCounts: false,
  style: 'buttons'
}

const defaultContactCTA: FAQContactCTA = {
  enabled: false,
  title: 'Sorunuz mu var?',
  subtitle: 'Aradiginiz cevabi bulamadiysan bizimle iletisime gecin.',
  buttonText: 'Iletisime Gec',
  buttonLink: '/iletisim',
  buttonStyle: 'primary'
}

export default function AdvancedTab({ content, updateContent }: AdvancedTabProps) {
  const animations = content.animations || defaultAnimations
  const responsive = content.responsive || defaultResponsive
  const search = content.search || defaultSearch
  const helpfulVotes = content.helpfulVotes || defaultHelpfulVotes
  const contactCTA = content.contactCTA || defaultContactCTA

  const updateAnimations = (updates: Partial<FAQAnimations>) => {
    updateContent({
      animations: { ...animations, ...updates }
    })
  }

  const updateResponsive = (
    breakpoint: 'desktop' | 'tablet' | 'mobile',
    updates: Partial<FAQResponsive[typeof breakpoint]>
  ) => {
    updateContent({
      responsive: {
        ...responsive,
        [breakpoint]: { ...responsive[breakpoint], ...updates }
      }
    })
  }

  const updateSearch = (updates: Partial<FAQSearchConfig>) => {
    updateContent({
      search: { ...search, ...updates }
    })
  }

  const updateHelpfulVotes = (updates: Partial<FAQHelpfulVotes>) => {
    updateContent({
      helpfulVotes: { ...helpfulVotes, ...updates }
    })
  }

  const updateContactCTA = (updates: Partial<FAQContactCTA>) => {
    updateContent({
      contactCTA: { ...contactCTA, ...updates }
    })
  }

  const isGridLayout = content.layout === 'grid' || content.layout === 'cards'

  return (
    <div className="space-y-6">
      {/* Search Settings */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">S</span>
          Arama
        </h3>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={search.enabled}
            onChange={(e) => updateSearch({ enabled: e.target.checked })}
            className="rounded border-slate-300 text-sage-500"
          />
          <span className="text-sm text-slate-700">Arama Aktif</span>
        </label>

        {search.enabled && (
          <div className="space-y-4 p-3 bg-slate-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Placeholder</label>
              <input
                type="text"
                value={search.placeholder ?? ''}
                onChange={(e) => updateSearch({ placeholder: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Pozisyon</label>
              <select
                value={search.position ?? 'above-items'}
                onChange={(e) => updateSearch({ position: e.target.value as FAQSearchConfig['position'] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="above-items">Sorularin Ustunde</option>
                <option value="in-header">Baslikta</option>
                <option value="sticky">Yapiskan</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={search.searchInAnswers ?? true}
                  onChange={(e) => updateSearch({ searchInAnswers: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500"
                />
                <span className="text-xs text-slate-600">Cevaplarda da Ara</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={search.highlightMatches ?? false}
                  onChange={(e) => updateSearch({ highlightMatches: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500"
                />
                <span className="text-xs text-slate-600">Eslesmeleri Vurgula</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Sonuc Bulunamadi Metni</label>
              <input
                type="text"
                value={search.noResultsText ?? ''}
                onChange={(e) => updateSearch({ noResultsText: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>
        )}
      </div>

      {/* Category Settings */}
      {content.showCategories && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">K</span>
            Kategori Gorunumu
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Kategori Stili</label>
            <div className="grid grid-cols-4 gap-2">
              {CATEGORY_STYLE_OPTIONS.map(style => (
                <button
                  key={style.id}
                  onClick={() => updateContent({ categoryStyle: style.id as FAQContent['categoryStyle'] })}
                  className={`py-2 rounded-lg text-sm transition-colors ${
                    content.categoryStyle === style.id
                      ? 'bg-sage-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Animations */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">A</span>
          Animasyonlar
        </h3>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={animations.enabled}
            onChange={(e) => updateAnimations({ enabled: e.target.checked })}
            className="rounded border-slate-300 text-sage-500"
          />
          <span className="text-sm text-slate-700">Animasyonlar Aktif</span>
        </label>

        {animations.enabled && (
          <div className="space-y-4 p-3 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Giris Animasyonu</label>
                <select
                  value={animations.type ?? 'fade'}
                  onChange={(e) => updateAnimations({ type: e.target.value as FAQAnimations['type'] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {ANIMATION_TYPE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Acilis Animasyonu</label>
                <select
                  value={animations.expandAnimation ?? 'smooth'}
                  onChange={(e) => updateAnimations({ expandAnimation: e.target.value as FAQAnimations['expandAnimation'] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {EXPAND_ANIMATION_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Sure (ms)</label>
                <input
                  type="number"
                  value={animations.duration ?? 500}
                  onChange={(e) => updateAnimations({ duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  min={100}
                  max={2000}
                  step={50}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Gecikme (ms)</label>
                <input
                  type="number"
                  value={animations.delay ?? 0}
                  onChange={(e) => updateAnimations({ delay: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  min={0}
                  max={1000}
                  step={50}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={animations.stagger ?? true}
                  onChange={(e) => updateAnimations({ stagger: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500"
                />
                <span className="text-xs text-slate-600">Sirali Animasyon</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={animations.hoverEffects ?? true}
                  onChange={(e) => updateAnimations({ hoverEffects: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500"
                />
                <span className="text-xs text-slate-600">Hover Efektleri</span>
              </label>
            </div>

            {animations.stagger && (
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Stagger Gecikme (ms)</label>
                <input
                  type="number"
                  value={animations.staggerDelay ?? 100}
                  onChange={(e) => updateAnimations({ staggerDelay: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  min={0}
                  max={500}
                  step={25}
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Responsive Settings (for grid layouts) */}
      {isGridLayout && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">R</span>
            Responsive Ayarlari
          </h3>

          {/* Desktop */}
          <div className="mb-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-medium text-slate-600 mb-3">Desktop</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Kolon</label>
                <select
                  value={responsive.desktop.columns}
                  onChange={(e) => updateResponsive('desktop', { columns: parseInt(e.target.value) as 1 | 2 | 3 })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                  <option value={3}>3</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Bosluk</label>
                <input
                  type="text"
                  value={responsive.desktop.gap}
                  onChange={(e) => updateResponsive('desktop', { gap: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Padding</label>
                <input
                  type="text"
                  value={responsive.desktop.padding}
                  onChange={(e) => updateResponsive('desktop', { padding: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                />
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div className="mb-4 p-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-medium text-slate-600 mb-3">Tablet</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Kolon</label>
                <select
                  value={responsive.tablet.columns}
                  onChange={(e) => updateResponsive('tablet', { columns: parseInt(e.target.value) as 1 | 2 })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                >
                  <option value={1}>1</option>
                  <option value={2}>2</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Bosluk</label>
                <input
                  type="text"
                  value={responsive.tablet.gap}
                  onChange={(e) => updateResponsive('tablet', { gap: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Padding</label>
                <input
                  type="text"
                  value={responsive.tablet.padding}
                  onChange={(e) => updateResponsive('tablet', { padding: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                />
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <p className="text-xs font-medium text-slate-600 mb-3">Mobil</p>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Kolon</label>
                <select
                  value={responsive.mobile.columns}
                  onChange={(e) => updateResponsive('mobile', { columns: parseInt(e.target.value) as 1 })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                >
                  <option value={1}>1</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Bosluk</label>
                <input
                  type="text"
                  value={responsive.mobile.gap}
                  onChange={(e) => updateResponsive('mobile', { gap: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Padding</label>
                <input
                  type="text"
                  value={responsive.mobile.padding}
                  onChange={(e) => updateResponsive('mobile', { padding: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Votes */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center text-green-600">V</span>
          Faydali Oylamasi
        </h3>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={helpfulVotes.enabled}
            onChange={(e) => updateHelpfulVotes({ enabled: e.target.checked })}
            className="rounded border-slate-300 text-sage-500"
          />
          <span className="text-sm text-slate-700">Oylama Aktif</span>
        </label>

        {helpfulVotes.enabled && (
          <div className="space-y-4 p-3 bg-slate-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Soru Metni</label>
              <input
                type="text"
                value={helpfulVotes.text ?? ''}
                onChange={(e) => updateHelpfulVotes({ text: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Evet Metni</label>
                <input
                  type="text"
                  value={helpfulVotes.yesText ?? ''}
                  onChange={(e) => updateHelpfulVotes({ yesText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Hayir Metni</label>
                <input
                  type="text"
                  value={helpfulVotes.noText ?? ''}
                  onChange={(e) => updateHelpfulVotes({ noText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Stil</label>
                <select
                  value={helpfulVotes.style ?? 'buttons'}
                  onChange={(e) => updateHelpfulVotes({ style: e.target.value as FAQHelpfulVotes['style'] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {HELPFUL_STYLE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <label className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  checked={helpfulVotes.showCounts ?? false}
                  onChange={(e) => updateHelpfulVotes({ showCounts: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500"
                />
                <span className="text-xs text-slate-600">Sayilari Goster</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* Contact CTA */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-sage-100 rounded-lg flex items-center justify-center text-sage-600">C</span>
          Iletisim CTA
        </h3>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={contactCTA.enabled}
            onChange={(e) => updateContactCTA({ enabled: e.target.checked })}
            className="rounded border-slate-300 text-sage-500"
          />
          <span className="text-sm text-slate-700">Iletisim Bolumu Goster</span>
        </label>

        {contactCTA.enabled && (
          <div className="space-y-4 p-3 bg-slate-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Baslik</label>
              <input
                type="text"
                value={contactCTA.title ?? ''}
                onChange={(e) => updateContactCTA({ title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Alt Baslik</label>
              <input
                type="text"
                value={contactCTA.subtitle ?? ''}
                onChange={(e) => updateContactCTA({ subtitle: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Buton Metni</label>
                <input
                  type="text"
                  value={contactCTA.buttonText ?? ''}
                  onChange={(e) => updateContactCTA({ buttonText: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Buton Link</label>
                <input
                  type="text"
                  value={contactCTA.buttonLink ?? ''}
                  onChange={(e) => updateContactCTA({ buttonLink: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Buton Stili</label>
                <select
                  value={contactCTA.buttonStyle ?? 'primary'}
                  onChange={(e) => updateContactCTA({ buttonStyle: e.target.value as FAQContactCTA['buttonStyle'] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {CTA_BUTTON_STYLE_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Arkaplan Rengi</label>
                <input
                  type="color"
                  value={contactCTA.backgroundColor ?? '#f0fdf4'}
                  onChange={(e) => updateContactCTA({ backgroundColor: e.target.value })}
                  className="w-full h-9 rounded border border-slate-200"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* SEO Settings */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">SEO</span>
          SEO Ayarlari
        </h3>

        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.schemaMarkup?.enabled ?? false}
              onChange={(e) => updateContent({
                schemaMarkup: { ...content.schemaMarkup, enabled: e.target.checked }
              })}
              className="rounded border-slate-300 text-sage-500"
            />
            <span className="text-sm text-slate-700">FAQ Schema Markup (SEO)</span>
          </label>
          <p className="text-[10px] text-slate-500">
            Google icin FAQ yapilandirilmis veri ekler. Arama sonuclarinda zengin snippet gosterir.
          </p>
        </div>
      </div>

      {/* Custom CSS & Section ID */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-slate-700 rounded-lg flex items-center justify-center text-white text-xs">{'</>'}</span>
          Ozel Ayarlar
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Section ID</label>
            <input
              type="text"
              value={content.sectionId ?? ''}
              onChange={(e) => updateContent({ sectionId: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              placeholder="faq"
            />
            <p className="text-[10px] text-slate-500 mt-1">Sayfa ici navigasyon icin (orn: #faq)</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Ozel CSS Sinifi</label>
            <input
              type="text"
              value={content.customClass ?? ''}
              onChange={(e) => updateContent({ customClass: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              placeholder="custom-faq-section"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
