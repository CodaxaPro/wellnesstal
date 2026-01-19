'use client'

import { FAQContent, FAQSectionHeader } from '../../types'

import { FAQ_LAYOUT_OPTIONS, MAX_WIDTH_OPTIONS } from './defaults'

interface ContentTabProps {
  content: FAQContent
  updateContent: (updates: Partial<FAQContent>) => void
}

const defaultHeader: FAQSectionHeader = {
  title: 'Sikca Sorulan Sorular',
  subtitle: '',
  description: '',
  alignment: 'center',
  badge: {
    enabled: false,
    text: 'SSS',
    backgroundColor: '#f0fdf4',
    textColor: '#15803d'
  }
}

export default function ContentTab({ content, updateContent }: ContentTabProps) {
  const header = content.header || defaultHeader

  const updateHeader = (updates: Partial<FAQSectionHeader>) => {
    updateContent({
      header: { ...header, ...updates }
    })
  }

  return (
    <div className="space-y-6">
      {/* Layout Selection */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-sage-100 rounded-lg flex items-center justify-center text-sage-600">L</span>
          Layout Tipi
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {FAQ_LAYOUT_OPTIONS.map(layout => (
            <button
              key={layout.id}
              onClick={() => updateContent({ layout: layout.id as FAQContent['layout'] })}
              className={`p-3 rounded-xl border text-center transition-all ${
                content.layout === layout.id
                  ? 'border-sage-500 bg-sage-50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <span className="text-xl block mb-1">{layout.icon}</span>
              <span className="text-xs font-medium text-slate-700 block">{layout.label}</span>
              <span className="text-[10px] text-slate-500">{layout.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Section Header */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">H</span>
          Bolum Basligi
        </h3>

        <div className="space-y-4">
          {/* Badge */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <label className="flex items-center gap-2 mb-3">
              <input
                type="checkbox"
                checked={header.badge?.enabled ?? false}
                onChange={(e) => updateHeader({
                  badge: { ...header.badge!, enabled: e.target.checked }
                })}
                className="rounded border-slate-300 text-sage-500"
              />
              <span className="text-sm text-slate-700">Badge Goster</span>
            </label>

            {header.badge?.enabled && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1.5">Badge Metni</label>
                  <input
                    type="text"
                    value={header.badge?.text ?? ''}
                    onChange={(e) => updateHeader({
                      badge: { ...header.badge!, text: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    placeholder="SSS"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Arkaplan</label>
                    <input
                      type="color"
                      value={header.badge?.backgroundColor ?? '#f0fdf4'}
                      onChange={(e) => updateHeader({
                        badge: { ...header.badge!, backgroundColor: e.target.value }
                      })}
                      className="w-full h-9 rounded border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Metin</label>
                    <input
                      type="color"
                      value={header.badge?.textColor ?? '#15803d'}
                      onChange={(e) => updateHeader({
                        badge: { ...header.badge!, textColor: e.target.value }
                      })}
                      className="w-full h-9 rounded border border-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Baslik</label>
            <input
              type="text"
              value={header.title ?? ''}
              onChange={(e) => updateHeader({ title: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="Sikca Sorulan Sorular"
            />
          </div>

          {/* Subtitle */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Alt Baslik</label>
            <input
              type="text"
              value={header.subtitle ?? ''}
              onChange={(e) => updateHeader({ subtitle: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="Merak ettiginiz her seyin cevabi burada"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Aciklama</label>
            <textarea
              value={header.description ?? ''}
              onChange={(e) => updateHeader({ description: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none"
              rows={2}
              placeholder="Opsiyonel aciklama metni..."
            />
          </div>

          {/* Alignment */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Hizalama</label>
            <div className="flex gap-2">
              {(['left', 'center', 'right'] as const).map(align => (
                <button
                  key={align}
                  onClick={() => updateHeader({ alignment: align })}
                  className={`flex-1 py-2 rounded-lg text-sm transition-colors ${
                    header.alignment === align
                      ? 'bg-sage-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {align === 'left' ? 'Sol' : align === 'center' ? 'Orta' : 'Sag'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Header Typography */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">T</span>
          Baslik Tipografisi
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Baslik Boyutu</label>
              <select
                value={header.typography?.titleSize ?? '2.25rem'}
                onChange={(e) => updateHeader({
                  typography: { ...header.typography, titleSize: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="1.5rem">Kucuk (1.5rem)</option>
                <option value="1.875rem">Orta (1.875rem)</option>
                <option value="2.25rem">Buyuk (2.25rem)</option>
                <option value="3rem">Cok Buyuk (3rem)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Baslik Rengi</label>
              <input
                type="color"
                value={header.typography?.titleColor ?? '#1e293b'}
                onChange={(e) => updateHeader({
                  typography: { ...header.typography, titleColor: e.target.value }
                })}
                className="w-full h-9 rounded border border-slate-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Alt Baslik Boyutu</label>
              <select
                value={header.typography?.subtitleSize ?? '1.125rem'}
                onChange={(e) => updateHeader({
                  typography: { ...header.typography, subtitleSize: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="0.875rem">Kucuk (0.875rem)</option>
                <option value="1rem">Normal (1rem)</option>
                <option value="1.125rem">Orta (1.125rem)</option>
                <option value="1.25rem">Buyuk (1.25rem)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Alt Baslik Rengi</label>
              <input
                type="color"
                value={header.typography?.subtitleColor ?? '#64748b'}
                onChange={(e) => updateHeader({
                  typography: { ...header.typography, subtitleColor: e.target.value }
                })}
                className="w-full h-9 rounded border border-slate-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Container Settings */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">C</span>
          Konteyner Ayarlari
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-2">Maksimum Genislik</label>
            <div className="grid grid-cols-3 gap-2">
              {MAX_WIDTH_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => updateContent({ maxWidth: opt.id as FAQContent['maxWidth'] })}
                  className={`py-2 rounded-lg text-xs font-medium transition-colors ${
                    content.maxWidth === opt.id
                      ? 'bg-sage-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Ust Padding</label>
              <input
                type="text"
                value={content.padding?.top ?? '4rem'}
                onChange={(e) => updateContent({
                  padding: { ...content.padding!, top: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="4rem"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Alt Padding</label>
              <input
                type="text"
                value={content.padding?.bottom ?? '4rem'}
                onChange={(e) => updateContent({
                  padding: { ...content.padding!, bottom: e.target.value }
                })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="4rem"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Sorular Arasi Bosluk</label>
            <input
              type="text"
              value={content.itemGap ?? '1rem'}
              onChange={(e) => updateContent({ itemGap: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="1rem"
            />
          </div>
        </div>
      </div>

      {/* Footer Settings */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-slate-600">F</span>
          Alt Bilgi
        </h3>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1.5">Footer Metni</label>
          <input
            type="text"
            value={content.footerText ?? ''}
            onChange={(e) => updateContent({ footerText: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            placeholder="Daha fazla soru icin iletisime gecin..."
          />
        </div>
      </div>
    </div>
  )
}
