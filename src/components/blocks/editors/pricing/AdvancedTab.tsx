'use client'

import { PricingContent, PricingAnimations, PricingFAQ, PricingComparisonTable } from '../../types'

import { PRICING_STYLE_PRESETS } from './defaults'

interface AdvancedTabProps {
  content: PricingContent
  updateContent: (updates: Partial<PricingContent>) => void
}

const defaultAnimations: PricingAnimations = {
  enabled: true,
  type: 'fadeUp',
  duration: 500,
  stagger: 100,
  hoverEffects: true
}

const defaultFAQ: PricingFAQ = {
  enabled: false,
  title: 'Sıkça Sorulan Sorular',
  items: [],
  layout: 'accordion'
}

const defaultComparisonTable: PricingComparisonTable = {
  enabled: false,
  title: 'Paketleri Karşılaştır',
  showIcons: true,
  highlightDifferences: false
}

export default function AdvancedTab({ content, updateContent }: AdvancedTabProps) {
  const animations = content.animations || defaultAnimations
  const faq = content.faq || defaultFAQ
  const comparisonTable = content.comparisonTable || defaultComparisonTable

  const updateAnimations = (updates: Partial<PricingAnimations>) => {
    updateContent({
      animations: { ...animations, ...updates }
    })
  }

  const updateFAQ = (updates: Partial<PricingFAQ>) => {
    updateContent({
      faq: { ...faq, ...updates }
    })
  }

  const updateComparisonTable = (updates: Partial<PricingComparisonTable>) => {
    updateContent({
      comparisonTable: { ...comparisonTable, ...updates }
    })
  }

  // FAQ Item Management
  const addFAQItem = () => {
    const currentItems = content.faq?.items ?? []
    updateFAQ({
      items: [...currentItems, { question: 'Yeni Soru', answer: 'Cevap metni...' }]
    })
  }

  const updateFAQItem = (index: number, updates: { question?: string; answer?: string }) => {
    const currentItems = content.faq?.items ?? []
    updateFAQ({
      items: currentItems.map((item, i) => i === index ? { ...item, ...updates } : item)
    })
  }

  const removeFAQItem = (index: number) => {
    const currentItems = content.faq?.items ?? []
    updateFAQ({
      items: currentItems.filter((_, i) => i !== index)
    })
  }

  const applyPreset = (presetId: string) => {
    const preset = PRICING_STYLE_PRESETS.find(p => p.id === presetId)
    if (preset) {
      updateContent(preset.value)
    }
  }

  return (
    <div className="space-y-6">
      {/* Style Presets */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600">🎨</span>
          Stil Presetleri
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {PRICING_STYLE_PRESETS.map(preset => (
            <button
              key={preset.id}
              onClick={() => applyPreset(preset.id)}
              className="p-3 rounded-xl border border-slate-200 hover:border-sage-400 hover:bg-sage-50 transition-all text-left group"
            >
              <span className="text-lg mb-1 block">{preset.icon}</span>
              <span className="text-sm font-medium text-slate-700 block">{preset.name}</span>
              <span className="text-[10px] text-slate-500">{preset.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Animations */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">✨</span>
          Animasyonlar
        </h3>

        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.animations?.enabled ?? true}
              onChange={(e) => updateAnimations({ enabled: e.target.checked })}
              className="rounded border-slate-300 text-sage-500"
            />
            <span className="text-sm text-slate-700">Animasyonlar Aktif</span>
          </label>

          {content.animations?.enabled !== false && (
            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Animasyon Tipi</label>
                <select
                  value={content.animations?.type ?? 'fadeUp'}
                  onChange={(e) => updateAnimations({ type: e.target.value as 'fadeUp' | 'fadeIn' | 'slideIn' | 'scale' | 'none' })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="fadeUp">Fade Up</option>
                  <option value="fadeIn">Fade In</option>
                  <option value="slideIn">Slide In</option>
                  <option value="scale">Scale</option>
                  <option value="none">Yok</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Gecikme (ms)</label>
                <input
                  type="number"
                  value={content.animations?.delay ?? 0}
                  onChange={(e) => updateAnimations({ delay: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  min={0}
                  max={2000}
                  step={50}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Süre (ms)</label>
                <input
                  type="number"
                  value={content.animations?.duration ?? 500}
                  onChange={(e) => updateAnimations({ duration: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  min={100}
                  max={3000}
                  step={100}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Stagger (ms)</label>
                <input
                  type="number"
                  value={content.animations?.stagger ?? 100}
                  onChange={(e) => updateAnimations({ stagger: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  min={0}
                  max={500}
                  step={25}
                />
              </div>
            </div>
          )}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.animations?.hoverEffects ?? true}
              onChange={(e) => updateAnimations({ hoverEffects: e.target.checked })}
              className="rounded border-slate-300 text-sage-500"
            />
            <span className="text-sm text-slate-700">Hover Efektleri</span>
          </label>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">📊</span>
          Karşılaştırma Tablosu
        </h3>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={content.comparisonTable?.enabled ?? false}
            onChange={(e) => updateComparisonTable({ enabled: e.target.checked })}
            className="rounded border-slate-300 text-sage-500"
          />
          <span className="text-sm text-slate-700">Karşılaştırma Tablosu Göster</span>
        </label>

        {content.comparisonTable?.enabled && (
          <div className="space-y-4 p-3 bg-slate-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Tablo Başlığı</label>
              <input
                type="text"
                value={content.comparisonTable?.title ?? 'Paketleri Karşılaştır'}
                onChange={(e) => updateComparisonTable({ title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.comparisonTable?.showIcons ?? true}
                  onChange={(e) => updateComparisonTable({ showIcons: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500"
                />
                <span className="text-xs text-slate-700">İkonlar Göster</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.comparisonTable?.highlightDifferences ?? false}
                  onChange={(e) => updateComparisonTable({ highlightDifferences: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500"
                />
                <span className="text-xs text-slate-700">Farkları Vurgula</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">❓</span>
          SSS (FAQ) Bölümü
        </h3>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={content.faq?.enabled ?? false}
            onChange={(e) => updateFAQ({ enabled: e.target.checked })}
            className="rounded border-slate-300 text-sage-500"
          />
          <span className="text-sm text-slate-700">FAQ Bölümü Göster</span>
        </label>

        {content.faq?.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">FAQ Başlığı</label>
              <input
                type="text"
                value={content.faq?.title ?? 'Sıkça Sorulan Sorular'}
                onChange={(e) => updateFAQ({ title: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>

            {/* FAQ Items */}
            <div className="space-y-3">
              {(content.faq?.items ?? []).map((item, index) => (
                <div key={index} className="p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={item.question ?? ''}
                        onChange={(e) => updateFAQItem(index, { question: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-medium"
                        placeholder="Soru..."
                      />
                      <textarea
                        value={item.answer ?? ''}
                        onChange={(e) => updateFAQItem(index, { answer: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none"
                        rows={2}
                        placeholder="Cevap..."
                      />
                    </div>
                    <button
                      onClick={() => removeFAQItem(index)}
                      className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={addFAQItem}
                className="w-full py-2.5 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-600 hover:border-sage-400 hover:text-sage-600 transition-colors"
              >
                + Soru Ekle
              </button>
            </div>

            {/* FAQ Layout */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Layout</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'accordion', label: 'Accordion' },
                  { id: 'list', label: 'Liste' }
                ].map(layout => (
                  <button
                    key={layout.id}
                    onClick={() => updateFAQ({ layout: layout.id as 'accordion' | 'list' })}
                    className={`py-2 rounded-lg text-sm ${
                      (content.faq?.layout ?? 'accordion') === layout.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {layout.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Custom CSS */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-slate-700 rounded-lg flex items-center justify-center text-white text-xs">{'</>'}</span>
          Özel CSS
        </h3>

        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">CSS Sınıfı</label>
            <input
              type="text"
              value={content.customClass ?? ''}
              onChange={(e) => updateContent({ customClass: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              placeholder="custom-pricing-section"
            />
          </div>
          <p className="text-[10px] text-slate-500">
            Özel stil uygulamak için CSS sınıfı ekleyebilirsiniz.
          </p>
        </div>
      </div>

      {/* Section ID */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">#</span>
          Bölüm ID
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Section ID</label>
          <input
            type="text"
            value={content.sectionId ?? ''}
            onChange={(e) => updateContent({ sectionId: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
            placeholder="pricing"
          />
          <p className="text-[10px] text-slate-500 mt-1">
            Sayfa içi navigasyon için kullanılır (örn: #pricing)
          </p>
        </div>
      </div>
    </div>
  )
}
