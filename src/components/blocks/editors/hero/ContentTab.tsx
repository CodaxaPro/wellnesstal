import { HeroContent, HeroButton, HeroElementAlignments, ContentAlignment } from '../../types'
import AlignmentSelector from './shared/AlignmentSelector'

interface ContentTabProps {
  content: HeroContent
  updateContent: (u: Partial<HeroContent>) => void
  addButton: () => void
  updateButton: (index: number, updates: Partial<HeroButton>) => void
  removeButton: (index: number) => void
}

export default function ContentTab({
  content,
  updateContent,
  addButton,
  updateButton,
  removeButton
}: ContentTabProps) {
  // Helper to update element alignment
  const updateElementAlignment = (element: keyof HeroElementAlignments, value: ContentAlignment) => {
    const currentAlignments = content.elementAlignments || {
      badge: 'left',
      title: 'left',
      subtitle: 'left',
      description: 'left',
      buttons: 'left',
      trustIndicator: 'left'
    }
    updateContent({
      elementAlignments: {
        ...currentAlignments,
        [element]: value
      }
    })
  }
  return (
    <div className="space-y-6">
      {/* Badge */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">Badge</label>
            <AlignmentSelector
              value={content.elementAlignments?.badge || 'left'}
              onChange={(v) => updateElementAlignment('badge', v)}
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!content.badge?.text}
              onChange={(e) => updateContent({
                badge: e.target.checked ? { text: 'Yeni', backgroundColor: '#10b981', textColor: '#ffffff' } : undefined
              })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>
        {content.badge && (
          <div className="space-y-3">
            <input
              type="text"
              value={content.badge.text || ''}
              onChange={(e) => updateContent({ badge: { ...content.badge!, text: e.target.value } })}
              placeholder="Badge metni..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500"
            />

            {/* Badge Styles Panel */}
            <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg border border-amber-100">
              <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
                <span>🏷️</span> Badge Stili
              </h4>

              {/* Colors Row */}
              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Arkaplan</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={content.badge.backgroundColor || '#10b981'}
                      onChange={(e) => updateContent({ badge: { ...content.badge!, backgroundColor: e.target.value } })}
                      className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={content.badge.backgroundColor || '#10b981'}
                      onChange={(e) => updateContent({ badge: { ...content.badge!, backgroundColor: e.target.value } })}
                      className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg font-mono bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Metin Rengi</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={content.badge.textColor || '#ffffff'}
                      onChange={(e) => updateContent({ badge: { ...content.badge!, textColor: e.target.value } })}
                      className="w-8 h-8 rounded-lg border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={content.badge.textColor || '#ffffff'}
                      onChange={(e) => updateContent({ badge: { ...content.badge!, textColor: e.target.value } })}
                      className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg font-mono bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Typography Row */}
              <div className="grid grid-cols-4 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Boyut</label>
                  <select
                    value={content.badge.fontSize || '0.75rem'}
                    onChange={(e) => updateContent({ badge: { ...content.badge!, fontSize: e.target.value } })}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="0.625rem">XS</option>
                    <option value="0.75rem">SM</option>
                    <option value="0.875rem">MD</option>
                    <option value="1rem">LG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Kalınlık</label>
                  <select
                    value={content.badge.fontWeight || '600'}
                    onChange={(e) => updateContent({ badge: { ...content.badge!, fontWeight: e.target.value } })}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="400">Normal</option>
                    <option value="500">Medium</option>
                    <option value="600">Semibold</option>
                    <option value="700">Bold</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Köşe</label>
                  <select
                    value={content.badge.borderRadius || '9999px'}
                    onChange={(e) => updateContent({ badge: { ...content.badge!, borderRadius: e.target.value } })}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="0.25rem">Keskin</option>
                    <option value="0.5rem">Yumuşak</option>
                    <option value="0.75rem">Yuvarlak</option>
                    <option value="9999px">Hap</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Animasyon</label>
                  <select
                    value={content.badge.animation || 'none'}
                    onChange={(e) => updateContent({ badge: { ...content.badge!, animation: e.target.value as any } })}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="none">Yok</option>
                    <option value="pulse">Nabız</option>
                    <option value="bounce">Zıplama</option>
                  </select>
                </div>
              </div>

              {/* Padding Row */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Yatay Boşluk</label>
                  <select
                    value={content.badge.paddingX || '1rem'}
                    onChange={(e) => updateContent({ badge: { ...content.badge!, paddingX: e.target.value } })}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="0.5rem">Dar</option>
                    <option value="0.75rem">Normal</option>
                    <option value="1rem">Geniş</option>
                    <option value="1.5rem">Çok Geniş</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Dikey Boşluk</label>
                  <select
                    value={content.badge.paddingY || '0.375rem'}
                    onChange={(e) => updateContent({ badge: { ...content.badge!, paddingY: e.target.value } })}
                    className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                  >
                    <option value="0.25rem">Dar</option>
                    <option value="0.375rem">Normal</option>
                    <option value="0.5rem">Geniş</option>
                    <option value="0.75rem">Çok Geniş</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">Ana Başlık</label>
          <AlignmentSelector
            value={content.elementAlignments?.title || 'left'}
            onChange={(v) => updateElementAlignment('title', v)}
          />
        </div>
        <textarea
          value={content.title || ''}
          onChange={(e) => updateContent({ title: e.target.value })}
          rows={2}
          placeholder="Ana başlık..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 text-lg"
        />

        {/* Title Typography */}
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
          <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
            <span>🎨</span> Başlık Stili
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Boyut</label>
              <select
                value={content.titleStyles?.fontSize || ''}
                onChange={(e) => updateContent({ titleStyles: { ...content.titleStyles, fontSize: e.target.value } as any })}
                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="">Varsayılan</option>
                <option value="2rem">Küçük</option>
                <option value="2.5rem">Orta-Küçük</option>
                <option value="3rem">Orta</option>
                <option value="3.5rem">Orta-Büyük</option>
                <option value="4rem">Büyük</option>
                <option value="5rem">Çok Büyük</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Kalınlık</label>
              <select
                value={content.titleStyles?.fontWeight || '700'}
                onChange={(e) => updateContent({ titleStyles: { ...content.titleStyles, fontWeight: e.target.value } as any })}
                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="400">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
                <option value="700">Bold</option>
                <option value="800">Extra Bold</option>
                <option value="900">Black</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Satır Aralığı</label>
              <select
                value={content.titleStyles?.lineHeight || '1.1'}
                onChange={(e) => updateContent({ titleStyles: { ...content.titleStyles, lineHeight: e.target.value } as any })}
                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="1">Sıkı</option>
                <option value="1.1">Normal</option>
                <option value="1.2">Rahat</option>
                <option value="1.4">Geniş</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Renk</label>
              <div className="flex gap-1">
                <input
                  type="color"
                  value={content.titleStyles?.color || '#1e293b'}
                  onChange={(e) => updateContent({ titleStyles: { ...content.titleStyles, color: e.target.value } as any })}
                  className="w-10 h-8 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={content.titleStyles?.color || ''}
                  onChange={(e) => updateContent({ titleStyles: { ...content.titleStyles, color: e.target.value } as any })}
                  placeholder="#1e293b"
                  className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg font-mono bg-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Title Highlight */}
        <div className="mt-3 p-3 bg-slate-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-slate-600">Kelime Vurgulama</label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={!!content.titleHighlight}
                onChange={(e) => updateContent({
                  titleHighlight: e.target.checked ? { words: [2], color: '#10b981', style: 'color' } : undefined
                })}
                className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
              />
              <span className="text-xs text-slate-500">Aktif</span>
            </label>
          </div>
          {content.titleHighlight && (
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Kelime Sırası</label>
                <input
                  type="text"
                  value={content.titleHighlight.words?.join(', ') || ''}
                  onChange={(e) => updateContent({
                    titleHighlight: {
                      ...content.titleHighlight!,
                      words: e.target.value.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n))
                    }
                  })}
                  placeholder="2, 3"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Renk</label>
                <input
                  type="color"
                  value={content.titleHighlight.color || '#10b981'}
                  onChange={(e) => updateContent({ titleHighlight: { ...content.titleHighlight!, color: e.target.value } })}
                  className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Stil</label>
                <select
                  value={content.titleHighlight.style || 'color'}
                  onChange={(e) => updateContent({ titleHighlight: { ...content.titleHighlight!, style: e.target.value as any } })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="color">Renk</option>
                  <option value="background">Arkaplan</option>
                  <option value="underline">Altı Çizili</option>
                  <option value="gradient">Gradient</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtitle */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">Alt Başlık</label>
          <AlignmentSelector
            value={content.elementAlignments?.subtitle || 'left'}
            onChange={(v) => updateElementAlignment('subtitle', v)}
          />
        </div>
        <textarea
          value={content.subtitle || ''}
          onChange={(e) => updateContent({ subtitle: e.target.value })}
          rows={2}
          placeholder="Alt başlık..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500"
        />

        {/* Subtitle Typography */}
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
          <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
            <span>🎨</span> Alt Başlık Stili
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Boyut</label>
              <select
                value={content.subtitleStyles?.fontSize || ''}
                onChange={(e) => updateContent({ subtitleStyles: { ...content.subtitleStyles, fontSize: e.target.value } as any })}
                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="">Varsayılan</option>
                <option value="1rem">Küçük</option>
                <option value="1.125rem">Orta-Küçük</option>
                <option value="1.25rem">Orta</option>
                <option value="1.5rem">Büyük</option>
                <option value="1.75rem">Çok Büyük</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Kalınlık</label>
              <select
                value={content.subtitleStyles?.fontWeight || '400'}
                onChange={(e) => updateContent({ subtitleStyles: { ...content.subtitleStyles, fontWeight: e.target.value } as any })}
                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Satır Aralığı</label>
              <select
                value={content.subtitleStyles?.lineHeight || '1.6'}
                onChange={(e) => updateContent({ subtitleStyles: { ...content.subtitleStyles, lineHeight: e.target.value } as any })}
                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="1.4">Sıkı</option>
                <option value="1.6">Normal</option>
                <option value="1.8">Rahat</option>
                <option value="2">Geniş</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Renk</label>
              <div className="flex gap-1">
                <input
                  type="color"
                  value={content.subtitleStyles?.color || '#64748b'}
                  onChange={(e) => updateContent({ subtitleStyles: { ...content.subtitleStyles, color: e.target.value } as any })}
                  className="w-10 h-8 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={content.subtitleStyles?.color || ''}
                  onChange={(e) => updateContent({ subtitleStyles: { ...content.subtitleStyles, color: e.target.value } as any })}
                  placeholder="#64748b"
                  className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg font-mono bg-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">Açıklama</label>
          <AlignmentSelector
            value={content.elementAlignments?.description || 'left'}
            onChange={(v) => updateElementAlignment('description', v)}
          />
        </div>
        <textarea
          value={content.description || ''}
          onChange={(e) => updateContent({ description: e.target.value })}
          rows={3}
          placeholder="Daha uzun açıklama metni..."
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500"
        />

        {/* Description Typography */}
        <div className="mt-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
          <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
            <span>📝</span> Açıklama Stili
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Boyut</label>
              <select
                value={content.descriptionStyles?.fontSize || ''}
                onChange={(e) => updateContent({ descriptionStyles: { ...content.descriptionStyles, fontSize: e.target.value } as any })}
                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="">Varsayılan</option>
                <option value="0.875rem">Küçük</option>
                <option value="1rem">Normal</option>
                <option value="1.125rem">Orta</option>
                <option value="1.25rem">Büyük</option>
                <option value="1.5rem">Çok Büyük</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Kalınlık</label>
              <select
                value={content.descriptionStyles?.fontWeight || '400'}
                onChange={(e) => updateContent({ descriptionStyles: { ...content.descriptionStyles, fontWeight: e.target.value } as any })}
                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="300">Light</option>
                <option value="400">Normal</option>
                <option value="500">Medium</option>
                <option value="600">Semibold</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Satır Aralığı</label>
              <select
                value={content.descriptionStyles?.lineHeight || '1.6'}
                onChange={(e) => updateContent({ descriptionStyles: { ...content.descriptionStyles, lineHeight: e.target.value } as any })}
                className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
              >
                <option value="1.4">Sıkı</option>
                <option value="1.6">Normal</option>
                <option value="1.8">Geniş</option>
                <option value="2">Çok Geniş</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Renk</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={content.descriptionStyles?.color || '#64748b'}
                  onChange={(e) => updateContent({ descriptionStyles: { ...content.descriptionStyles, color: e.target.value } as any })}
                  className="w-10 h-8 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={content.descriptionStyles?.color || ''}
                  onChange={(e) => updateContent({ descriptionStyles: { ...content.descriptionStyles, color: e.target.value } as any })}
                  placeholder="#64748b"
                  className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg font-mono bg-white"
                />
              </div>
            </div>
          </div>
          <div className="mt-3">
            <label className="block text-xs text-slate-500 mb-1">Maksimum Genişlik</label>
            <select
              value={content.descriptionStyles?.maxWidth || ''}
              onChange={(e) => updateContent({ descriptionStyles: { ...content.descriptionStyles, maxWidth: e.target.value } as any })}
              className="w-full px-2 py-1.5 text-sm border border-slate-200 rounded-lg bg-white"
            >
              <option value="">Sınırsız</option>
              <option value="32rem">Dar (32rem)</option>
              <option value="42rem">Orta (42rem)</option>
              <option value="56rem">Geniş (56rem)</option>
              <option value="72rem">Çok Geniş (72rem)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">Butonlar</label>
            <AlignmentSelector
              value={content.elementAlignments?.buttons || 'left'}
              onChange={(v) => updateElementAlignment('buttons', v)}
            />
          </div>
          <button
            onClick={addButton}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-sage-600 hover:text-sage-700 hover:bg-sage-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Buton Ekle
          </button>
        </div>

        <div className="space-y-4">
          {(content.buttons || []).map((button, index) => (
            <div key={index} className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-medium text-slate-500">Buton {index + 1}</span>
                <button
                  onClick={() => removeButton(index)}
                  className="p-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Metin</label>
                  <input
                    type="text"
                    value={button.text}
                    onChange={(e) => updateButton(index, { text: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Link</label>
                  <input
                    type="text"
                    value={button.link}
                    onChange={(e) => updateButton(index, { link: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Stil</label>
                  <select
                    value={button.style}
                    onChange={(e) => updateButton(index, { style: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  >
                    <option value="primary">Primary</option>
                    <option value="secondary">Secondary</option>
                    <option value="outline">Outline</option>
                    <option value="ghost">Ghost</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Boyut</label>
                  <select
                    value={button.size}
                    onChange={(e) => updateButton(index, { size: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  >
                    <option value="sm">Küçük</option>
                    <option value="md">Orta</option>
                    <option value="lg">Büyük</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Hover Efekti</label>
                  <select
                    value={button.hoverEffect || 'scale'}
                    onChange={(e) => updateButton(index, { hoverEffect: e.target.value as any })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                  >
                    <option value="none">Yok</option>
                    <option value="scale">Büyüme</option>
                    <option value="glow">Parlama</option>
                    <option value="slide">Kayma</option>
                  </select>
                </div>
              </div>

              {/* Custom Colors */}
              <div className="mt-3 pt-3 border-t border-slate-200">
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Arkaplan</label>
                    <input
                      type="color"
                      value={button.backgroundColor || '#10b981'}
                      onChange={(e) => updateButton(index, { backgroundColor: e.target.value })}
                      className="w-full h-8 rounded-lg border border-slate-200 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Metin</label>
                    <input
                      type="color"
                      value={button.textColor || '#ffffff'}
                      onChange={(e) => updateButton(index, { textColor: e.target.value })}
                      className="w-full h-8 rounded-lg border border-slate-200 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Köşe</label>
                    <select
                      value={button.borderRadius || '12px'}
                      onChange={(e) => updateButton(index, { borderRadius: e.target.value })}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                    >
                      <option value="0px">Keskin</option>
                      <option value="8px">Hafif</option>
                      <option value="12px">Orta</option>
                      <option value="9999px">Yuvarlak</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Trust Indicator */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-slate-700">Güven Göstergesi</label>
            <AlignmentSelector
              value={content.elementAlignments?.trustIndicator || 'left'}
              onChange={(v) => updateElementAlignment('trustIndicator', v)}
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.trustIndicator?.enabled || false}
              onChange={(e) => updateContent({
                trustIndicator: {
                  enabled: e.target.checked,
                  items: content.trustIndicator?.items || [{ type: 'text', content: '⭐ 500+ Mutlu Müşteri' }],
                  layout: 'inline'
                }
              })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>
        {content.trustIndicator?.enabled && (
          <div className="space-y-3">
            {content.trustIndicator.items.map((item, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={item.content}
                  onChange={(e) => {
                    const items = [...content.trustIndicator!.items]
                    items[index] = { ...items[index], content: e.target.value }
                    updateContent({ trustIndicator: { ...content.trustIndicator!, items } })
                  }}
                  className="flex-1 px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500"
                />
                <button
                  onClick={() => {
                    const items = content.trustIndicator!.items.filter((_, i) => i !== index)
                    updateContent({ trustIndicator: { ...content.trustIndicator!, items } })
                  }}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
            <button
              onClick={() => {
                const items = [...content.trustIndicator!.items, { type: 'text' as const, content: '' }]
                updateContent({ trustIndicator: { ...content.trustIndicator!, items } })
              }}
              className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-500 hover:border-sage-500 hover:text-sage-600 text-sm"
            >
              + Ekle
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
