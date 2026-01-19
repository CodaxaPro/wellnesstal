'use client'

import { FeaturesContent, FeaturesLayoutType } from '../../types'

interface LayoutTabProps {
  content: FeaturesContent
  updateContent: (updates: Partial<FeaturesContent>) => void
}

export default function LayoutTab({ content, updateContent }: LayoutTabProps) {
  const layouts: { id: FeaturesLayoutType; label: string; icon: string; description: string }[] = [
    { id: 'grid', label: 'Grid', icon: '⊞', description: 'Standart ızgara düzeni' },
    { id: 'list', label: 'Liste', icon: '☰', description: 'Tek sütun liste' },
    { id: 'carousel', label: 'Carousel', icon: '◀▶', description: 'Kaydırmalı görünüm' },
    { id: 'masonry', label: 'Masonry', icon: '▦', description: 'Pinterest tarzı' },
    { id: 'zigzag', label: 'Zigzag', icon: '⟿', description: 'Alternatif sıralama' },
    { id: 'centered-stack', label: 'Ortalı', icon: '▣', description: 'Tek sütun ortalı' },
    { id: 'icon-left', label: 'İkon Solda', icon: '◧', description: 'Yatay ikonlu' },
    { id: 'icon-top', label: 'İkon Üstte', icon: '◫', description: 'Dikey ikonlu' },
  ]

  return (
    <div className="space-y-6">
      {/* Layout Selection */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Düzen Tipi</label>
        <div className="grid grid-cols-4 gap-3">
          {layouts.map(layout => (
            <button
              key={layout.id}
              onClick={() => updateContent({ layout: layout.id })}
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
        {content.layout === 'zigzag' && (
          <div className="mt-4 p-3 bg-sage-50 border border-sage-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg className="w-5 h-5 text-sage-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-sm text-sage-700">
                <p className="font-medium mb-1">Zigzag Düzeni Aktif</p>
                <p className="text-xs text-sage-600">
                  Resimler otomatik olarak sağa-sola yerleşir. Her özellik için resim eklemek için özellik kartındaki resim butonunu kullanın.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Columns (for grid layout) */}
      {(content.layout === 'grid' || content.layout === 'icon-top' || content.layout === 'icon-left') && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-4">Sütun Sayısı</label>
          <div className="grid grid-cols-5 gap-3">
            {[2, 3, 4, 5, 6].map(num => (
              <button
                key={num}
                onClick={() => updateContent({ columns: num as any })}
                className={`p-3 rounded-xl border-2 transition-all ${
                  content.columns === num
                    ? 'border-sage-500 bg-sage-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-lg font-bold text-center">{num}</div>
                <div className="text-xs text-slate-500 text-center">sütun</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Carousel Settings */}
      {content.layout === 'carousel' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Carousel Ayarları</label>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Görünen Slide</label>
              <select
                value={content.carousel?.slidesPerView || 3}
                onChange={(e) => updateContent({
                  carousel: { ...content.carousel!, slidesPerView: parseInt(e.target.value) }
                })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {[1, 2, 3, 4, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Otomatik Geçiş (ms)</label>
              <input
                type="number"
                value={content.carousel?.autoPlayInterval || 5000}
                onChange={(e) => updateContent({
                  carousel: { ...content.carousel!, autoPlayInterval: parseInt(e.target.value) }
                })}
                min="1000"
                step="500"
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-4">
            {[
              { key: 'autoPlay', label: 'Otomatik Oynat' },
              { key: 'loop', label: 'Döngü' },
              { key: 'showDots', label: 'Noktaları Göster' },
              { key: 'showArrows', label: 'Okları Göster' },
            ].map(item => (
              <label key={item.key} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={(content.carousel as any)?.[item.key] ?? true}
                  onChange={(e) => updateContent({
                    carousel: { ...content.carousel!, [item.key]: e.target.checked }
                  })}
                  className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                />
                <span className="text-sm text-slate-600">{item.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Grid Gap */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Boşluk (Gap)</label>
        <div className="grid grid-cols-6 gap-2">
          {['0.5rem', '1rem', '1.5rem', '2rem', '2.5rem', '3rem'].map(gap => (
            <button
              key={gap}
              onClick={() => updateContent({ gridGap: gap })}
              className={`p-2 rounded-lg border text-center transition-all ${
                content.gridGap === gap
                  ? 'border-sage-500 bg-sage-50 text-sage-700'
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              <div className="text-sm font-medium">{gap}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Alignment */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Hizalama</label>
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'start', label: 'Üst', icon: '⬆' },
            { id: 'center', label: 'Orta', icon: '⬌' },
            { id: 'end', label: 'Alt', icon: '⬇' },
            { id: 'stretch', label: 'Esnet', icon: '↕' },
          ].map(align => (
            <button
              key={align.id}
              onClick={() => updateContent({ alignItems: align.id as any })}
              className={`p-3 rounded-xl border-2 transition-all ${
                content.alignItems === align.id
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

      {/* Container Width */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Container Genişliği</label>
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
              placeholder="örn: 1400px"
              className="w-full px-4 py-2 border border-slate-200 rounded-lg"
            />
          </div>
        )}
      </div>

      {/* Section Padding */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Section Padding</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Üst</label>
            <select
              value={content.padding?.top || '5rem'}
              onChange={(e) => updateContent({ padding: { ...content.padding!, top: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0', '1rem', '2rem', '3rem', '4rem', '5rem', '6rem', '8rem'].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Alt</label>
            <select
              value={content.padding?.bottom || '5rem'}
              onChange={(e) => updateContent({ padding: { ...content.padding!, bottom: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0', '1rem', '2rem', '3rem', '4rem', '5rem', '6rem', '8rem'].map(val => (
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
              {['0', '1rem', '1.5rem', '2rem', '3rem', '4rem'].map(val => (
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
              {['0', '1rem', '1.5rem', '2rem', '3rem', '4rem'].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Header Settings */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Başlık Alanı</label>

        <div className="space-y-4">
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
                checked={content.showSubtitle ?? true}
                onChange={(e) => updateContent({ showSubtitle: e.target.checked })}
                className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
              />
              <span className="text-sm text-slate-600">Alt Başlık Göster</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={content.showDivider ?? false}
                onChange={(e) => updateContent({ showDivider: e.target.checked })}
                className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
              />
              <span className="text-sm text-slate-600">Ayırıcı Göster</span>
            </label>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Başlık Hizalama</label>
            <div className="flex gap-2">
              {[
                { id: 'left', label: 'Sol', icon: '◀' },
                { id: 'center', label: 'Orta', icon: '◆' },
                { id: 'right', label: 'Sağ', icon: '▶' },
              ].map(align => (
                <button
                  key={align.id}
                  onClick={() => updateContent({ headerAlignment: align.id as any })}
                  className={`flex-1 p-2 rounded-lg border transition-all ${
                    content.headerAlignment === align.id
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="text-center">
                    <span className="text-lg">{align.icon}</span>
                    <div className="text-xs text-slate-600 mt-1">{align.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
