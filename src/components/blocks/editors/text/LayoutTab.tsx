'use client'

import { TextContent, TextLayoutType } from '../../types'
import { LAYOUT_OPTIONS } from './defaults'

interface LayoutTabProps {
  content: TextContent
  updateContent: (updates: Partial<TextContent>) => void
}

export default function LayoutTab({ content, updateContent }: LayoutTabProps) {
  return (
    <div className="space-y-6">
      {/* Layout Selection */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Düzen Tipi</label>
        <div className="grid grid-cols-4 gap-3">
          {LAYOUT_OPTIONS.map(layout => (
            <button
              key={layout.id}
              onClick={() => updateContent({ layout: layout.id as TextLayoutType })}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                content.layout === layout.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-2">{layout.icon}</div>
              <div className="text-sm font-medium text-slate-700">{layout.label}</div>
              <div className="text-xs text-slate-500 mt-1">{layout.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Text Alignment */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Metin Hizalama</label>
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'left', label: 'Sola', icon: '⬅' },
            { id: 'center', label: 'Ortala', icon: '⬌' },
            { id: 'right', label: 'Sağa', icon: '➡' },
            { id: 'justify', label: 'İki Yana', icon: '☰' },
          ].map(align => (
            <button
              key={align.id}
              onClick={() => updateContent({ alignment: align.id as any })}
              className={`p-3 rounded-xl border-2 transition-all ${
                content.alignment === align.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xl text-center">{align.icon}</div>
              <div className="text-xs text-slate-600 text-center mt-1">{align.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Sütun Sayısı</label>
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map(num => (
            <button
              key={num}
              onClick={() => updateContent({ columns: num as 1 | 2 | 3 })}
              className={`p-4 rounded-xl border-2 transition-all ${
                content.columns === num
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex justify-center gap-1 mb-2">
                {Array.from({ length: num }).map((_, i) => (
                  <div key={i} className="w-4 h-8 bg-slate-300 rounded" />
                ))}
              </div>
              <div className="text-sm font-medium text-center">{num} Sütun</div>
            </button>
          ))}
        </div>

        {content.columns > 1 && (
          <div className="mt-4">
            <label className="block text-xs text-slate-500 mb-2">Sütun Aralığı</label>
            <div className="grid grid-cols-4 gap-2">
              {['1rem', '1.5rem', '2rem', '3rem'].map(gap => (
                <button
                  key={gap}
                  onClick={() => updateContent({ columnGap: gap })}
                  className={`p-2 rounded-lg border text-center text-sm transition-all ${
                    content.columnGap === gap
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {gap}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Container Width */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">İçerik Genişliği</label>
        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'sm', label: 'Küçük', width: '640px' },
            { id: 'md', label: 'Orta', width: '768px' },
            { id: 'lg', label: 'Geniş', width: '1024px' },
            { id: 'xl', label: 'XL', width: '1280px' },
            { id: '2xl', label: '2XL', width: '1536px' },
            { id: 'full', label: 'Tam', width: '100%' },
          ].map(size => (
            <button
              key={size.id}
              onClick={() => updateContent({ maxWidth: size.id as any })}
              className={`p-2 rounded-lg border transition-all ${
                content.maxWidth === size.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-sm font-medium text-slate-700">{size.label}</div>
              <div className="text-xs text-slate-500">{size.width}</div>
            </button>
          ))}
        </div>

        {content.maxWidth === 'custom' && (
          <div className="mt-3">
            <input
              type="text"
              value={content.customMaxWidth || ''}
              onChange={(e) => updateContent({ customMaxWidth: e.target.value })}
              placeholder="örn: 900px"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Section Padding */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">İç Boşluk (Padding)</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Üst</label>
            <select
              value={content.padding?.top || '3rem'}
              onChange={(e) => updateContent({ padding: { ...content.padding!, top: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0', '1rem', '2rem', '3rem', '4rem', '5rem', '6rem'].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Alt</label>
            <select
              value={content.padding?.bottom || '3rem'}
              onChange={(e) => updateContent({ padding: { ...content.padding!, bottom: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0', '1rem', '2rem', '3rem', '4rem', '5rem', '6rem'].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Sol</label>
            <select
              value={content.padding?.left || '1.5rem'}
              onChange={(e) => updateContent({ padding: { ...content.padding!, left: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0', '1rem', '1.5rem', '2rem', '3rem'].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Sağ</label>
            <select
              value={content.padding?.right || '1.5rem'}
              onChange={(e) => updateContent({ padding: { ...content.padding!, right: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0', '1rem', '1.5rem', '2rem', '3rem'].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Margin */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Dış Boşluk (Margin)</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Üst</label>
            <select
              value={content.margin?.top || '0'}
              onChange={(e) => updateContent({ margin: { ...content.margin!, top: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0', '1rem', '2rem', '3rem', '4rem', '5rem'].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Alt</label>
            <select
              value={content.margin?.bottom || '0'}
              onChange={(e) => updateContent({ margin: { ...content.margin!, bottom: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0', '1rem', '2rem', '3rem', '4rem', '5rem'].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Visibility Controls */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Görünürlük</label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.showTitle ?? true}
              onChange={(e) => updateContent({ showTitle: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-sm text-slate-600">Başlık Göster</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.showSubtitle ?? false}
              onChange={(e) => updateContent({ showSubtitle: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-sm text-slate-600">Alt Başlık Göster</span>
          </label>
        </div>
      </div>
    </div>
  )
}
