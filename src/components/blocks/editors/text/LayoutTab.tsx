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
      {/* Content Wrapper - Merkezleme */}
      <div className="p-4 bg-gradient-to-br from-sage-50 to-sage-100 rounded-xl border-2 border-sage-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">🎯 İçerik Merkezleme (Deluxe Style)</label>
        <p className="text-xs text-slate-600 mb-4">İçeriği merkeze almak için wrapper seçin</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'none', label: 'Yok', icon: '⬜', desc: 'Normal düzen' },
            { id: 'center-content-wrapper', label: 'Merkez Wrapper', icon: '🎯', desc: 'center-content-wrapper' },
            { id: 'center-block', label: 'Merkez Blok', icon: '▦', desc: 'center-block (arkaplanlı)' },
          ].map(wrapper => (
            <button
              key={wrapper.id}
              onClick={() => updateContent({ contentWrapper: wrapper.id as any })}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                (content.contentWrapper || 'none') === wrapper.id
                  ? 'border-sage-500 bg-white shadow-md'
                  : 'border-slate-200 bg-white hover:border-sage-300'
              }`}
              title={wrapper.desc}
            >
              <div className="text-2xl mb-2">{wrapper.icon}</div>
              <div className="text-sm font-medium text-slate-700">{wrapper.label}</div>
              <div className="text-xs text-slate-500 mt-1">{wrapper.desc}</div>
            </button>
          ))}
        </div>
        {(content.contentWrapper === 'center-block') && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Wrapper Padding</label>
              <input
                type="text"
                value={content.wrapperPadding || '2rem'}
                onChange={(e) => updateContent({ wrapperPadding: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="2rem"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Arkaplan Rengi</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={content.wrapperBackground || '#ffffff'}
                  onChange={(e) => updateContent({ wrapperBackground: e.target.value })}
                  className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={content.wrapperBackground || '#ffffff'}
                  onChange={(e) => updateContent({ wrapperBackground: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Container Width - İçerik Genişliği */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">📏 İçerik Genişliği</label>
        <p className="text-xs text-slate-500 mb-4">Metin bloğunun genişliğini ayarlayın</p>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'sm', label: 'Dar', width: '640px', icon: '▢' },
            { id: 'md', label: 'Orta', width: '768px', icon: '▣' },
            { id: 'lg', label: 'Geniş', width: '1024px', icon: '▬' },
            { id: 'xl', label: 'XL', width: '1280px', icon: '▭' },
            { id: '2xl', label: '2XL', width: '1536px', icon: '⬓' },
            { id: 'full', label: 'Tam Genişlik', width: '100%', icon: '⬛' },
          ].map(size => (
            <button
              key={size.id}
              onClick={() => updateContent({ maxWidth: size.id as any })}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                (content.maxWidth || 'lg') === size.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title={`${size.label}: ${size.width}`}
            >
              <div className="text-2xl mb-1">{size.icon}</div>
              <div className="text-xs font-medium text-slate-700">{size.label}</div>
              <div className="text-xs text-slate-500 mt-0.5">{size.width}</div>
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

      {/* Image Position - Görsel Konumu */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-2">🖼️ Görsel Konumu</label>
        <p className="text-xs text-slate-500 mb-4">Eklerseniz görselin metne göre konumunu seçin</p>
        <div className="grid grid-cols-4 gap-3">
          {[
            { id: 'none', label: 'Yok', icon: '❌', desc: 'Görsel gösterme' },
            { id: 'left', label: 'Sol (Split)', icon: '⬅️', desc: 'Resim sol, metin sağ (grid)' },
            { id: 'right', label: 'Sağ (Split)', icon: '➡️', desc: 'Metin sol, resim sağ (grid)' },
            { id: 'top', label: 'Üstte', icon: '⬆️', desc: 'Metnin üstünde' },
            { id: 'bottom', label: 'Altta', icon: '⬇️', desc: 'Metnin altında' },
            { id: 'inline-left', label: 'İnline Sol', icon: '⬅️📝', desc: 'Metin yanında sol' },
            { id: 'inline-right', label: 'İnline Sağ', icon: '📝➡️', desc: 'Metin yanında sağ' },
            { id: 'full-width', label: 'Tam Genişlik', icon: '↔️', desc: 'Tam genişlik' },
          ].map(pos => (
            <button
              key={pos.id}
              onClick={() => {
                const updates: any = { imagePosition: pos.id }
                // Enterprise layout'u güncelle
                if (pos.id === 'left') {
                  updates.layoutType = 'image-left'
                } else if (pos.id === 'right') {
                  updates.layoutType = 'image-right'
                } else if (pos.id === 'none') {
                  updates.layoutType = 'default'
                }
                updateContent(updates)
              }}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                (content.imagePosition || 'none') === pos.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title={pos.desc}
            >
              <div className="text-2xl mb-1">{pos.icon}</div>
              <div className="text-xs font-medium">{pos.label}</div>
            </button>
          ))}
        </div>
        {(content.images || []).length === 0 && (content.imagePosition || 'none') !== 'none' && (
          <p className="text-xs text-amber-600 mt-2">
            ⚠️ Görsel eklemek için İçerik sekmesine gidin
          </p>
        )}
        {(content.imagePosition || 'none') !== 'none' && (
          <div className="mt-3">
            <label className="block text-xs text-slate-500 mb-1">Görsel-Metin Arası Boşluk</label>
            <input
              type="text"
              value={content.imageSpacing || '2rem'}
              onChange={(e) => updateContent({ imageSpacing: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="2rem"
            />
          </div>
        )}
      </div>

      {/* Container Style */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Konteyner Stili</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'none', label: 'Yok', icon: '⬜', desc: 'Normal' },
            { id: 'box', label: 'Kutu', icon: '📦', desc: 'Basit kutu' },
            { id: 'card', label: 'Kart', icon: '🃏', desc: 'Gölgeli kart' },
            { id: 'bordered', label: 'Kenarlıklı', icon: '▦', desc: 'Kenarlık' },
            { id: 'shadow', label: 'Gölgeli', icon: '💫', desc: 'Sadece gölge' },
            { id: 'outlined', label: 'Çerçeveli', icon: '⬛', desc: 'Kalın çerçeve' },
          ].map(style => (
            <button
              key={style.id}
              onClick={() => updateContent({ containerStyle: style.id as any })}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                (content.containerStyle || 'none') === style.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
              title={style.desc}
            >
              <div className="text-2xl mb-1">{style.icon}</div>
              <div className="text-xs font-medium">{style.label}</div>
            </button>
          ))}
        </div>
        {(content.containerStyle || 'none') !== 'none' && (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Padding</label>
              <input
                type="text"
                value={content.containerPadding || '2rem'}
                onChange={(e) => updateContent({ containerPadding: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="2rem"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Border Radius</label>
              <input
                type="text"
                value={content.containerBorderRadius || '0.75rem'}
                onChange={(e) => updateContent({ containerBorderRadius: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="0.75rem"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-xs text-slate-500 mb-1">Arkaplan Rengi</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={content.containerBackground || '#ffffff'}
                  onChange={(e) => updateContent({ containerBackground: e.target.value })}
                  className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={content.containerBackground || '#ffffff'}
                  onChange={(e) => updateContent({ containerBackground: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  placeholder="#ffffff"
                />
              </div>
            </div>
          </div>
        )}
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
