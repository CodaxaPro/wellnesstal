'use client'

import { CTAContent, CTABadge, CTATitleHighlight } from '../../types'

interface ContentTabProps {
  content: CTAContent
  updateContent: (updates: Partial<CTAContent>) => void
}

export default function ContentTab({ content, updateContent }: ContentTabProps) {
  const updateBadge = (updates: Partial<CTABadge>) => {
    updateContent({
      badge: { ...content.badge, ...updates } as CTABadge
    })
  }

  const updateTitleHighlight = (updates: Partial<CTATitleHighlight>) => {
    updateContent({
      titleHighlight: { ...content.titleHighlight, ...updates } as CTATitleHighlight
    })
  }

  return (
    <div className="space-y-6">
      {/* Badge Section */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Badge / Etiket</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.showBadge}
              onChange={(e) => updateContent({ showBadge: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Goster</span>
          </label>
        </div>

        {content.showBadge && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Badge Metni</label>
              <input
                type="text"
                value={content.badge?.text || ''}
                onChange={(e) => updateBadge({ text: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Yeni, Ozel Teklif, vb."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Arkaplan</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.badge?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateBadge({ backgroundColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.badge?.backgroundColor || '#ffffff'}
                    onChange={(e) => updateBadge({ backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Metin Rengi</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.badge?.textColor || '#059669'}
                    onChange={(e) => updateBadge({ textColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.badge?.textColor || '#059669'}
                    onChange={(e) => updateBadge({ textColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Cerceve Rengi</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.badge?.borderColor || '#059669'}
                    onChange={(e) => updateBadge({ borderColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.badge?.borderColor || '#059669'}
                    onChange={(e) => updateBadge({ borderColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Kose Yuvarlama</label>
                <select
                  value={content.badge?.borderRadius || '9999px'}
                  onChange={(e) => updateBadge({ borderRadius: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="0">Kare</option>
                  <option value="0.25rem">Hafif</option>
                  <option value="0.5rem">Orta</option>
                  <option value="0.75rem">Yuvarlak</option>
                  <option value="9999px">Tam Yuvarlak</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">Animasyon</label>
              <div className="flex gap-2">
                {[
                  { id: 'none', label: 'Yok' },
                  { id: 'pulse', label: 'Pulse' },
                  { id: 'bounce', label: 'Bounce' },
                  { id: 'glow', label: 'Glow' }
                ].map(anim => (
                  <button
                    key={anim.id}
                    onClick={() => updateBadge({ animation: anim.id as any })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      content.badge?.animation === anim.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {anim.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Icon (opsiyonel)</label>
              <input
                type="text"
                value={content.badge?.icon || ''}
                onChange={(e) => updateBadge({ icon: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="star, sparkles, bell vb."
              />
            </div>
          </div>
        )}
      </div>

      {/* Title Section */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Baslik</label>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Baslik Metni</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => updateContent({ title: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg text-lg font-semibold"
              placeholder="CTA Basliginiz"
            />
          </div>

          {/* Title Highlight */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-slate-600">Kelime Vurgulama</span>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.titleHighlight?.enabled ?? false}
                  onChange={(e) => updateTitleHighlight({ enabled: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                />
                <span className="text-xs text-slate-500">Aktif</span>
              </label>
            </div>

            {content.titleHighlight?.enabled && (
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Vurgulanacak Kelimeler (index: 0, 1, 2...)</label>
                  <input
                    type="text"
                    value={content.titleHighlight?.words?.join(', ') || ''}
                    onChange={(e) => {
                      const words = e.target.value.split(',').map(w => parseInt(w.trim())).filter(n => !isNaN(n))
                      updateTitleHighlight({ words })
                    }}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    placeholder="0, 2, 4"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Vurgu Stili</label>
                    <select
                      value={content.titleHighlight?.style || 'color'}
                      onChange={(e) => updateTitleHighlight({ style: e.target.value as any })}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    >
                      <option value="color">Renk</option>
                      <option value="background">Arkaplan</option>
                      <option value="underline">Alt Cizgi</option>
                      <option value="gradient">Gradient</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Vurgu Rengi</label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={content.titleHighlight?.color || '#059669'}
                        onChange={(e) => updateTitleHighlight({ color: e.target.value })}
                        className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                      />
                      <input
                        type="text"
                        value={content.titleHighlight?.color || '#059669'}
                        onChange={(e) => updateTitleHighlight({ color: e.target.value })}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                      />
                    </div>
                  </div>
                </div>

                {content.titleHighlight?.style === 'gradient' && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Gradient Baslangic</label>
                      <input
                        type="color"
                        value={content.titleHighlight?.gradientFrom || '#059669'}
                        onChange={(e) => updateTitleHighlight({ gradientFrom: e.target.value })}
                        className="w-full h-10 rounded border border-slate-200 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1">Gradient Bitis</label>
                      <input
                        type="color"
                        value={content.titleHighlight?.gradientTo || '#10b981'}
                        onChange={(e) => updateTitleHighlight({ gradientTo: e.target.value })}
                        className="w-full h-10 rounded border border-slate-200 cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Subtitle Section */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Alt Baslik</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.showSubtitle}
              onChange={(e) => updateContent({ showSubtitle: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Goster</span>
          </label>
        </div>

        {content.showSubtitle && (
          <textarea
            value={content.subtitle || ''}
            onChange={(e) => updateContent({ subtitle: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm"
            placeholder="Alt baslik veya aciklama metni"
          />
        )}
      </div>

      {/* Description Section */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Ek Aciklama</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.showDescription}
              onChange={(e) => updateContent({ showDescription: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Goster</span>
          </label>
        </div>

        {content.showDescription && (
          <textarea
            value={content.description || ''}
            onChange={(e) => updateContent({ description: e.target.value })}
            rows={2}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg text-sm"
            placeholder="Detayli aciklama (opsiyonel)"
          />
        )}
      </div>

      {/* Urgency Section */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Aciliyet / Kıtlık</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.urgency?.enabled ?? false}
              onChange={(e) => updateContent({
                urgency: { ...content.urgency, enabled: e.target.checked } as any
              })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>

        {content.urgency?.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">Tip</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'countdown', label: 'Geri Sayım' },
                  { id: 'limited', label: 'Sınırlı Stok' },
                  { id: 'badge', label: 'Badge' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => updateContent({
                      urgency: { ...content.urgency, type: type.id } as any
                    })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.urgency?.type === type.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Metin</label>
              <input
                type="text"
                value={content.urgency?.text || ''}
                onChange={(e) => updateContent({
                  urgency: { ...content.urgency, text: e.target.value } as any
                })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Son 24 Saat!, Sadece 5 adet kaldi!, vb."
              />
            </div>

            {content.urgency?.type === 'countdown' && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">Bitis Tarihi</label>
                <input
                  type="datetime-local"
                  value={content.urgency?.endDate || ''}
                  onChange={(e) => updateContent({
                    urgency: { ...content.urgency, endDate: e.target.value } as any
                  })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-slate-500 mb-1">Badge Rengi</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={content.urgency?.badgeColor || '#ef4444'}
                  onChange={(e) => updateContent({
                    urgency: { ...content.urgency, badgeColor: e.target.value } as any
                  })}
                  className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={content.urgency?.badgeColor || '#ef4444'}
                  onChange={(e) => updateContent({
                    urgency: { ...content.urgency, badgeColor: e.target.value } as any
                  })}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Trust Elements Section */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Guven Ogeleri</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.trustElements?.enabled ?? false}
              onChange={(e) => updateContent({
                trustElements: { ...content.trustElements, enabled: e.target.checked, items: content.trustElements?.items || [], layout: content.trustElements?.layout || 'inline' }
              })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>

        {content.trustElements?.enabled && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">Duzenleme</label>
              <div className="flex gap-2">
                {[
                  { id: 'inline', label: 'Yan Yana' },
                  { id: 'stacked', label: 'Alt Alta' }
                ].map(layout => (
                  <button
                    key={layout.id}
                    onClick={() => updateContent({
                      trustElements: { ...content.trustElements, layout: layout.id as any, items: content.trustElements?.items || [], enabled: true }
                    })}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      content.trustElements?.layout === layout.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {layout.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-xs text-slate-500">Ogeler</label>
              {(content.trustElements?.items || []).map((item, index) => (
                <div key={index} className="flex gap-2">
                  <select
                    value={item.type}
                    onChange={(e) => {
                      const items = [...(content.trustElements?.items || [])]
                      items[index] = { ...item, type: e.target.value as any }
                      updateContent({ trustElements: { ...content.trustElements, items, enabled: true, layout: content.trustElements?.layout || 'inline' } })
                    }}
                    className="w-24 px-2 py-1.5 border border-slate-200 rounded text-xs"
                  >
                    <option value="icon">Icon</option>
                    <option value="text">Metin</option>
                    <option value="image">Gorsel</option>
                  </select>
                  <input
                    type="text"
                    value={item.content}
                    onChange={(e) => {
                      const items = [...(content.trustElements?.items || [])]
                      items[index] = { ...item, content: e.target.value }
                      updateContent({ trustElements: { ...content.trustElements, items, enabled: true, layout: content.trustElements?.layout || 'inline' } })
                    }}
                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs"
                    placeholder={item.type === 'icon' ? 'check, star, shield' : item.type === 'image' ? 'URL' : 'Metin'}
                  />
                  <button
                    onClick={() => {
                      const items = [...(content.trustElements?.items || [])]
                      items.splice(index, 1)
                      updateContent({ trustElements: { ...content.trustElements, items, enabled: true, layout: content.trustElements?.layout || 'inline' } })
                    }}
                    className="px-2 py-1.5 bg-red-100 text-red-600 rounded hover:bg-red-200 text-xs"
                  >
                    Sil
                  </button>
                </div>
              ))}
              <button
                onClick={() => {
                  const items = [...(content.trustElements?.items || []), { type: 'icon' as const, content: 'check' }]
                  updateContent({ trustElements: { ...content.trustElements, items, enabled: true, layout: content.trustElements?.layout || 'inline' } })
                }}
                className="w-full py-2 border-2 border-dashed border-slate-300 rounded-lg text-sm text-slate-500 hover:border-sage-500 hover:text-sage-600 transition-colors"
              >
                + Oge Ekle
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
