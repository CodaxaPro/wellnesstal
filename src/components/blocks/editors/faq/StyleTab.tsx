'use client'

import { FAQContent, FAQAccordionStyle, FAQCardStyle, FAQTypography } from '../../types'

import { EXPAND_ICON_OPTIONS, SHADOW_OPTIONS, HOVER_EFFECT_OPTIONS, FAQ_STYLE_PRESETS } from './defaults'

interface StyleTabProps {
  content: FAQContent
  updateContent: (updates: Partial<FAQContent>) => void
}

const defaultAccordionStyle: FAQAccordionStyle = {
  backgroundColor: '#ffffff',
  borderColor: '#e2e8f0',
  borderWidth: 1,
  borderRadius: '0.75rem',
  shadow: 'sm',
  gap: '0.75rem',
  questionPadding: '1rem 1.25rem',
  questionBorderRadius: '0.75rem',
  answerPadding: '0 1.25rem 1rem',
  expandIcon: 'chevron',
  expandIconPosition: 'right',
  expandIconColor: '#64748b',
  openBackgroundColor: '#ffffff',
  openBorderColor: '#86a789',
  openShadow: 'md'
}

const defaultCardStyle: FAQCardStyle = {
  backgroundColor: '#ffffff',
  borderColor: '#e2e8f0',
  borderWidth: 1,
  borderRadius: '1rem',
  shadow: 'md',
  padding: '1.5rem',
  hoverEffect: 'lift',
  hoverBorderColor: '#86a789'
}

const defaultTypography: FAQTypography = {
  question: {
    fontSize: '1rem',
    fontWeight: '500',
    lineHeight: '1.5',
    color: '#1e293b'
  },
  answer: {
    fontSize: '0.95rem',
    fontWeight: '400',
    lineHeight: '1.7',
    color: '#64748b'
  }
}

export default function StyleTab({ content, updateContent }: StyleTabProps) {
  const accordionStyle = content.accordionStyle || defaultAccordionStyle
  const cardStyle = content.cardStyle || defaultCardStyle
  const typography = content.typography || defaultTypography

  const updateAccordionStyle = (updates: Partial<FAQAccordionStyle>) => {
    updateContent({
      accordionStyle: { ...accordionStyle, ...updates }
    })
  }

  const updateCardStyle = (updates: Partial<FAQCardStyle>) => {
    updateContent({
      cardStyle: { ...cardStyle, ...updates }
    })
  }

  const updateTypography = (section: 'question' | 'answer', updates: Partial<FAQTypography['question']>) => {
    updateContent({
      typography: {
        ...typography,
        [section]: { ...typography[section], ...updates }
      }
    })
  }

  const applyPreset = (presetId: string) => {
    const preset = FAQ_STYLE_PRESETS.find(p => p.id === presetId)
    if (preset) {
      updateContent(preset.value)
    }
  }

  const isAccordionLayout = content.layout === 'accordion' || content.layout === 'accordion-multi'
  const isCardLayout = content.layout === 'cards' || content.layout === 'grid'

  return (
    <div className="space-y-6">
      {/* Style Presets */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-violet-100 rounded-lg flex items-center justify-center text-violet-600">P</span>
          Stil Presetleri
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {FAQ_STYLE_PRESETS.map(preset => (
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

      {/* Accordion Style (when layout is accordion) */}
      {isAccordionLayout && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-sage-100 rounded-lg flex items-center justify-center text-sage-600">A</span>
            Accordion Stili
          </h3>

          <div className="space-y-4">
            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Arkaplan</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={accordionStyle.backgroundColor ?? '#ffffff'}
                    onChange={(e) => updateAccordionStyle({ backgroundColor: e.target.value })}
                    className="w-10 h-9 rounded border border-slate-200"
                  />
                  <input
                    type="text"
                    value={accordionStyle.backgroundColor ?? '#ffffff'}
                    onChange={(e) => updateAccordionStyle({ backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Kenarlik</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={accordionStyle.borderColor ?? '#e2e8f0'}
                    onChange={(e) => updateAccordionStyle({ borderColor: e.target.value })}
                    className="w-10 h-9 rounded border border-slate-200"
                  />
                  <input
                    type="text"
                    value={accordionStyle.borderColor ?? '#e2e8f0'}
                    onChange={(e) => updateAccordionStyle({ borderColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Border and Radius */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Kose Yuvarlikligi</label>
                <input
                  type="text"
                  value={accordionStyle.borderRadius ?? '0.75rem'}
                  onChange={(e) => updateAccordionStyle({ borderRadius: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Kenarlik Kalinligi</label>
                <input
                  type="number"
                  value={accordionStyle.borderWidth ?? 1}
                  onChange={(e) => updateAccordionStyle({ borderWidth: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  min={0}
                  max={5}
                />
              </div>
            </div>

            {/* Shadow and Gap */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Golge</label>
                <select
                  value={accordionStyle.shadow ?? 'sm'}
                  onChange={(e) => updateAccordionStyle({ shadow: e.target.value as FAQAccordionStyle['shadow'] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {SHADOW_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Sorular Arasi Bosluk</label>
                <input
                  type="text"
                  value={accordionStyle.gap ?? '0.75rem'}
                  onChange={(e) => updateAccordionStyle({ gap: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Expand Icon */}
            <div className="p-3 bg-slate-50 rounded-lg">
              <label className="block text-xs font-medium text-slate-600 mb-2">Expand Ikonu</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Ikon Tipi</label>
                  <select
                    value={accordionStyle.expandIcon ?? 'chevron'}
                    onChange={(e) => updateAccordionStyle({ expandIcon: e.target.value as FAQAccordionStyle['expandIcon'] })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    {EXPAND_ICON_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Pozisyon</label>
                  <select
                    value={accordionStyle.expandIconPosition ?? 'right'}
                    onChange={(e) => updateAccordionStyle({ expandIconPosition: e.target.value as 'left' | 'right' })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    <option value="left">Sol</option>
                    <option value="right">Sag</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Ikon Rengi</label>
                  <input
                    type="color"
                    value={accordionStyle.expandIconColor ?? '#64748b'}
                    onChange={(e) => updateAccordionStyle({ expandIconColor: e.target.value })}
                    className="w-full h-9 rounded border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Ikon Boyutu</label>
                  <input
                    type="text"
                    value={accordionStyle.expandIconSize ?? '1.25rem'}
                    onChange={(e) => updateAccordionStyle({ expandIconSize: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Open State */}
            <div className="p-3 bg-slate-50 rounded-lg">
              <label className="block text-xs font-medium text-slate-600 mb-2">Acik Durum Stili</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Arkaplan</label>
                  <input
                    type="color"
                    value={accordionStyle.openBackgroundColor ?? '#ffffff'}
                    onChange={(e) => updateAccordionStyle({ openBackgroundColor: e.target.value })}
                    className="w-full h-9 rounded border border-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-500 mb-1">Kenarlik</label>
                  <input
                    type="color"
                    value={accordionStyle.openBorderColor ?? '#86a789'}
                    onChange={(e) => updateAccordionStyle({ openBorderColor: e.target.value })}
                    className="w-full h-9 rounded border border-slate-200"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-[10px] text-slate-500 mb-1">Golge</label>
                  <select
                    value={accordionStyle.openShadow ?? 'md'}
                    onChange={(e) => updateAccordionStyle({ openShadow: e.target.value as FAQAccordionStyle['openShadow'] })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  >
                    {SHADOW_OPTIONS.map(opt => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Card Style (when layout is cards/grid) */}
      {isCardLayout && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">K</span>
            Kart Stili
          </h3>

          <div className="space-y-4">
            {/* Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Arkaplan</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={cardStyle.backgroundColor ?? '#ffffff'}
                    onChange={(e) => updateCardStyle({ backgroundColor: e.target.value })}
                    className="w-10 h-9 rounded border border-slate-200"
                  />
                  <input
                    type="text"
                    value={cardStyle.backgroundColor ?? '#ffffff'}
                    onChange={(e) => updateCardStyle({ backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Kenarlik</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={cardStyle.borderColor ?? '#e2e8f0'}
                    onChange={(e) => updateCardStyle({ borderColor: e.target.value })}
                    className="w-10 h-9 rounded border border-slate-200"
                  />
                  <input
                    type="text"
                    value={cardStyle.borderColor ?? '#e2e8f0'}
                    onChange={(e) => updateCardStyle({ borderColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Border and Radius */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Kose Yuvarlikligi</label>
                <input
                  type="text"
                  value={cardStyle.borderRadius ?? '1rem'}
                  onChange={(e) => updateCardStyle({ borderRadius: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Padding</label>
                <input
                  type="text"
                  value={cardStyle.padding ?? '1.5rem'}
                  onChange={(e) => updateCardStyle({ padding: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Shadow and Hover */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Golge</label>
                <select
                  value={cardStyle.shadow ?? 'md'}
                  onChange={(e) => updateCardStyle({ shadow: e.target.value as FAQCardStyle['shadow'] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {SHADOW_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Hover Efekti</label>
                <select
                  value={cardStyle.hoverEffect ?? 'lift'}
                  onChange={(e) => updateCardStyle({ hoverEffect: e.target.value as FAQCardStyle['hoverEffect'] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  {HOVER_EFFECT_OPTIONS.map(opt => (
                    <option key={opt.id} value={opt.id}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hover Border Color */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Hover Kenarlik Rengi</label>
              <input
                type="color"
                value={cardStyle.hoverBorderColor ?? '#86a789'}
                onChange={(e) => updateCardStyle({ hoverBorderColor: e.target.value })}
                className="w-full h-9 rounded border border-slate-200"
              />
            </div>
          </div>
        </div>
      )}

      {/* Typography */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">T</span>
          Tipografi
        </h3>

        <div className="space-y-4">
          {/* Question Typography */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <label className="block text-xs font-medium text-slate-600 mb-3">Soru Stili</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Boyut</label>
                <select
                  value={typography.question?.fontSize ?? '1rem'}
                  onChange={(e) => updateTypography('question', { fontSize: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="0.875rem">Kucuk</option>
                  <option value="1rem">Normal</option>
                  <option value="1.125rem">Orta</option>
                  <option value="1.25rem">Buyuk</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Kalinlik</label>
                <select
                  value={typography.question?.fontWeight ?? '500'}
                  onChange={(e) => updateTypography('question', { fontWeight: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="400">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">Semi Bold</option>
                  <option value="700">Bold</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Renk</label>
                <input
                  type="color"
                  value={typography.question?.color ?? '#1e293b'}
                  onChange={(e) => updateTypography('question', { color: e.target.value })}
                  className="w-full h-9 rounded border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Line Height</label>
                <input
                  type="text"
                  value={typography.question?.lineHeight ?? '1.5'}
                  onChange={(e) => updateTypography('question', { lineHeight: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Answer Typography */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <label className="block text-xs font-medium text-slate-600 mb-3">Cevap Stili</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Boyut</label>
                <select
                  value={typography.answer?.fontSize ?? '0.95rem'}
                  onChange={(e) => updateTypography('answer', { fontSize: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="0.875rem">Kucuk</option>
                  <option value="0.95rem">Normal</option>
                  <option value="1rem">Orta</option>
                  <option value="1.125rem">Buyuk</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Kalinlik</label>
                <select
                  value={typography.answer?.fontWeight ?? '400'}
                  onChange={(e) => updateTypography('answer', { fontWeight: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="300">Light</option>
                  <option value="400">Normal</option>
                  <option value="500">Medium</option>
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Renk</label>
                <input
                  type="color"
                  value={typography.answer?.color ?? '#64748b'}
                  onChange={(e) => updateTypography('answer', { color: e.target.value })}
                  className="w-full h-9 rounded border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-500 mb-1">Line Height</label>
                <input
                  type="text"
                  value={typography.answer?.lineHeight ?? '1.7'}
                  onChange={(e) => updateTypography('answer', { lineHeight: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
