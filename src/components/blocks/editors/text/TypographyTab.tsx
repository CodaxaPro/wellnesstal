'use client'

import { TextContent, TextTypography } from '../../types'

interface TypographyTabProps {
  content: TextContent
  updateContent: (updates: Partial<TextContent>) => void
}

export default function TypographyTab({ content, updateContent }: TypographyTabProps) {
  const updateTypography = (section: keyof TextTypography, updates: Record<string, any>) => {
    updateContent({
      typography: {
        ...content.typography,
        [section]: { ...content.typography?.[section], ...updates }
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Title Typography */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Başlık Stili</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.typography?.title?.enabled ?? true}
              onChange={(e) => updateTypography('title', { enabled: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>

        {content.typography?.title?.enabled && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Font Boyutu</label>
              <select
                value={content.typography?.title?.fontSize || '2rem'}
                onChange={(e) => updateTypography('title', { fontSize: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {['1.25rem', '1.5rem', '1.75rem', '2rem', '2.5rem', '3rem', '3.5rem', '4rem'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Font Ağırlığı</label>
              <select
                value={content.typography?.title?.fontWeight || '700'}
                onChange={(e) => updateTypography('title', { fontWeight: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {['400', '500', '600', '700', '800', '900'].map(weight => (
                  <option key={weight} value={weight}>{weight}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Satır Yüksekliği</label>
              <select
                value={content.typography?.title?.lineHeight || '1.2'}
                onChange={(e) => updateTypography('title', { lineHeight: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {['1', '1.1', '1.2', '1.3', '1.4', '1.5'].map(lh => (
                  <option key={lh} value={lh}>{lh}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Harf Aralığı</label>
              <select
                value={content.typography?.title?.letterSpacing || '-0.02em'}
                onChange={(e) => updateTypography('title', { letterSpacing: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="-0.05em">Çok Dar</option>
                <option value="-0.02em">Dar</option>
                <option value="0">Normal</option>
                <option value="0.02em">Geniş</option>
                <option value="0.05em">Çok Geniş</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Renk</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={content.typography?.title?.color || '#1e293b'}
                  onChange={(e) => updateTypography('title', { color: e.target.value })}
                  className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={content.typography?.title?.color || '#1e293b'}
                  onChange={(e) => updateTypography('title', { color: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Alt Boşluk</label>
              <select
                value={content.typography?.title?.marginBottom || '1rem'}
                onChange={(e) => updateTypography('title', { marginBottom: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {['0.5rem', '1rem', '1.5rem', '2rem', '2.5rem', '3rem'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Subtitle Typography */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Alt Başlık Stili</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.typography?.subtitle?.enabled ?? true}
              onChange={(e) => updateTypography('subtitle', { enabled: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>

        {content.typography?.subtitle?.enabled && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Font Boyutu</label>
              <select
                value={content.typography?.subtitle?.fontSize || '1.25rem'}
                onChange={(e) => updateTypography('subtitle', { fontSize: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {['1rem', '1.125rem', '1.25rem', '1.5rem', '1.75rem'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Font Ağırlığı</label>
              <select
                value={content.typography?.subtitle?.fontWeight || '400'}
                onChange={(e) => updateTypography('subtitle', { fontWeight: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {['300', '400', '500', '600'].map(weight => (
                  <option key={weight} value={weight}>{weight}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Renk</label>
              <input
                type="color"
                value={content.typography?.subtitle?.color || '#64748b'}
                onChange={(e) => updateTypography('subtitle', { color: e.target.value })}
                className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Alt Boşluk</label>
              <select
                value={content.typography?.subtitle?.marginBottom || '1.5rem'}
                onChange={(e) => updateTypography('subtitle', { marginBottom: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {['0.5rem', '1rem', '1.5rem', '2rem'].map(size => (
                  <option key={size} value={size}>{size}</option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Body Typography */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Metin Stili</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font Boyutu</label>
            <select
              value={content.typography?.body?.fontSize || '1.125rem'}
              onChange={(e) => updateTypography('body', { fontSize: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0.875rem', '1rem', '1.125rem', '1.25rem', '1.375rem', '1.5rem'].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font Ağırlığı</label>
            <select
              value={content.typography?.body?.fontWeight || '400'}
              onChange={(e) => updateTypography('body', { fontWeight: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['300', '400', '500'].map(weight => (
                <option key={weight} value={weight}>{weight}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Satır Yüksekliği</label>
            <select
              value={content.typography?.body?.lineHeight || '1.75'}
              onChange={(e) => updateTypography('body', { lineHeight: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['1.4', '1.5', '1.6', '1.75', '1.8', '2'].map(lh => (
                <option key={lh} value={lh}>{lh}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Paragraf Aralığı</label>
            <select
              value={content.typography?.body?.paragraphSpacing || '1.5rem'}
              onChange={(e) => updateTypography('body', { paragraphSpacing: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['1rem', '1.25rem', '1.5rem', '2rem', '2.5rem'].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div className="col-span-2">
            <label className="block text-xs text-slate-500 mb-1">Metin Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.typography?.body?.color || '#374151'}
                onChange={(e) => updateTypography('body', { color: e.target.value })}
                className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <div className="flex gap-1">
                {['#1e293b', '#374151', '#4b5563', '#64748b', '#94a3b8'].map(color => (
                  <button
                    key={color}
                    onClick={() => updateTypography('body', { color })}
                    className="w-8 h-8 rounded-md border border-slate-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Drop Cap */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="text-sm font-semibold text-slate-700">Drop Cap (İlk Harf Büyük)</label>
            <p className="text-xs text-slate-500">Paragrafın ilk harfi büyük gösterilir</p>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.typography?.dropCap?.enabled ?? false}
              onChange={(e) => updateTypography('dropCap', { enabled: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>

        {content.typography?.dropCap?.enabled && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Satır Sayısı</label>
              <select
                value={content.typography?.dropCap?.lines || 3}
                onChange={(e) => updateTypography('dropCap', { lines: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value={2}>2 Satır</option>
                <option value={3}>3 Satır</option>
                <option value={4}>4 Satır</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Font Ağırlığı</label>
              <select
                value={content.typography?.dropCap?.fontWeight || '700'}
                onChange={(e) => updateTypography('dropCap', { fontWeight: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {['400', '500', '600', '700', '800'].map(weight => (
                  <option key={weight} value={weight}>{weight}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Renk</label>
              <input
                type="color"
                value={content.typography?.dropCap?.color || '#10b981'}
                onChange={(e) => updateTypography('dropCap', { color: e.target.value })}
                className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Link Styles */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Link Stili</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Link Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.typography?.links?.color || '#10b981'}
                onChange={(e) => updateTypography('links', { color: e.target.value })}
                className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <div className="flex gap-1">
                {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444'].map(color => (
                  <button
                    key={color}
                    onClick={() => updateTypography('links', { color })}
                    className="w-6 h-6 rounded-md border border-slate-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Hover Rengi</label>
            <input
              type="color"
              value={content.typography?.links?.hoverColor || '#059669'}
              onChange={(e) => updateTypography('links', { hoverColor: e.target.value })}
              className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Alt Çizgi</label>
            <select
              value={content.typography?.links?.decoration || 'underline'}
              onChange={(e) => updateTypography('links', { decoration: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="none">Yok</option>
              <option value="underline">Alt Çizgi</option>
              <option value="dotted">Noktalı</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Hover Alt Çizgi</label>
            <select
              value={content.typography?.links?.hoverDecoration || 'none'}
              onChange={(e) => updateTypography('links', { hoverDecoration: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="none">Yok</option>
              <option value="underline">Alt Çizgi</option>
              <option value="dotted">Noktalı</option>
            </select>
          </div>
        </div>
      </div>

      {/* Typography Presets */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Hazır Stiller</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              label: 'Blog',
              typography: {
                title: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2' },
                body: { fontSize: '1.125rem', lineHeight: '1.8' }
              }
            },
            {
              label: 'Minimal',
              typography: {
                title: { fontSize: '1.5rem', fontWeight: '500', lineHeight: '1.3' },
                body: { fontSize: '1rem', lineHeight: '1.7' }
              }
            },
            {
              label: 'Dramatik',
              typography: {
                title: { fontSize: '3.5rem', fontWeight: '800', lineHeight: '1.1', letterSpacing: '-0.03em' },
                body: { fontSize: '1.25rem', lineHeight: '1.6' }
              }
            },
          ].map((preset, index) => (
            <button
              key={index}
              onClick={() => updateContent({
                typography: { ...content.typography, ...preset.typography } as TextTypography
              })}
              className="p-3 rounded-xl border border-slate-200 hover:border-sage-500 hover:bg-sage-50 transition-all text-center"
            >
              <div className="text-sm font-medium text-slate-700">{preset.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
