'use client'

import { TextContent, TextBackground, TextBorderSettings, TextDivider } from '../../types'

interface BackgroundTabProps {
  content: TextContent
  updateContent: (updates: Partial<TextContent>) => void
}

export default function BackgroundTab({ content, updateContent }: BackgroundTabProps) {
  const updateBackground = (updates: Partial<TextBackground>) => {
    updateContent({ background: { ...content.background, ...updates } })
  }

  const updateBorder = (updates: Partial<TextBorderSettings>) => {
    updateContent({ border: { ...content.border, ...updates } })
  }

  const updateDivider = (type: 'topDivider' | 'bottomDivider', updates: Partial<TextDivider>) => {
    updateContent({ [type]: { ...content[type], ...updates } })
  }

  return (
    <div className="space-y-6">
      {/* Background Type */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Arkaplan Tipi</label>
        <div className="grid grid-cols-5 gap-3">
          {[
            { id: 'none', label: 'Yok', icon: '⬜' },
            { id: 'solid', label: 'Düz Renk', icon: '■' },
            { id: 'gradient', label: 'Gradient', icon: '🌈' },
            { id: 'image', label: 'Görsel', icon: '🖼️' },
            { id: 'pattern', label: 'Desen', icon: '⚡' },
          ].map(type => (
            <button
              key={type.id}
              onClick={() => updateBackground({ type: type.id as any })}
              className={`p-3 rounded-xl border-2 transition-all text-center ${
                content.background?.type === type.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-1">{type.icon}</div>
              <div className="text-xs font-medium">{type.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Solid Color */}
      {content.background?.type === 'solid' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Arkaplan Rengi</label>
          <div className="flex gap-4">
            <input
              type="color"
              value={content.background.color || '#ffffff'}
              onChange={(e) => updateBackground({ color: e.target.value })}
              className="w-16 h-16 rounded-xl border border-slate-200 cursor-pointer"
            />
            <div className="flex-1">
              <input
                type="text"
                value={content.background.color || '#ffffff'}
                onChange={(e) => updateBackground({ color: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 font-mono"
              />
              <div className="flex gap-2 mt-2">
                {['#ffffff', '#f8fafc', '#f1f5f9', '#f0fdf4', '#fef3c7', '#dbeafe', '#fae8ff'].map(color => (
                  <button
                    key={color}
                    onClick={() => updateBackground({ color })}
                    className={`w-8 h-8 rounded-lg border transition-all ${
                      content.background?.color === color ? 'ring-2 ring-sage-500 ring-offset-2' : 'border-slate-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gradient */}
      {content.background?.type === 'gradient' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-4">Gradient Ayarları</label>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Başlangıç</label>
              <input
                type="color"
                value={content.background.gradientFrom || '#10b981'}
                onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                className="w-full h-12 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Orta (Opsiyonel)</label>
              <input
                type="color"
                value={content.background.gradientVia || '#ffffff'}
                onChange={(e) => updateBackground({ gradientVia: e.target.value })}
                className="w-full h-12 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Bitiş</label>
              <input
                type="color"
                value={content.background.gradientTo || '#3b82f6'}
                onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                className="w-full h-12 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Yön</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'to-r', label: '→' },
                { id: 'to-l', label: '←' },
                { id: 'to-t', label: '↑' },
                { id: 'to-b', label: '↓' },
                { id: 'to-br', label: '↘' },
                { id: 'to-bl', label: '↙' },
                { id: 'to-tr', label: '↗' },
                { id: 'to-tl', label: '↖' },
              ].map(dir => (
                <button
                  key={dir.id}
                  onClick={() => updateBackground({ gradientDirection: dir.id as any })}
                  className={`p-2 rounded-lg border text-xl transition-all ${
                    content.background?.gradientDirection === dir.id
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {dir.label}
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          <div
            className="mt-4 h-16 rounded-xl"
            style={{
              background: `linear-gradient(${
                content.background?.gradientDirection?.replace('to-', 'to ').replace('-', ' ') || 'to right'
              }, ${content.background?.gradientFrom || '#10b981'}${content.background?.gradientVia ? `, ${content.background.gradientVia}` : ''}, ${content.background?.gradientTo || '#3b82f6'})`
            }}
          />
        </div>
      )}

      {/* Image Background */}
      {content.background?.type === 'image' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
          <label className="block text-sm font-semibold text-slate-700">Arkaplan Görseli</label>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Görsel URL</label>
            <input
              type="text"
              value={content.background.imageUrl || ''}
              onChange={(e) => updateBackground({ imageUrl: e.target.value })}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-slate-200 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">
                Overlay Opaklığı: {content.background.imageOverlayOpacity || 0}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={content.background.imageOverlayOpacity || 0}
                onChange={(e) => updateBackground({ imageOverlayOpacity: parseInt(e.target.value) })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Overlay Rengi</label>
              <input
                type="color"
                value={content.background.imageOverlayColor || '#000000'}
                onChange={(e) => updateBackground({ imageOverlayColor: e.target.value })}
                className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Pattern */}
      {content.background?.type === 'pattern' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-4">Desen Seçimi</label>
          <div className="grid grid-cols-4 gap-3">
            {[
              { id: 'dots', label: 'Noktalar', preview: '•••' },
              { id: 'grid', label: 'Izgara', preview: '▦' },
              { id: 'lines', label: 'Çizgiler', preview: '|||' },
              { id: 'waves', label: 'Dalgalar', preview: '〰' },
            ].map(pattern => (
              <button
                key={pattern.id}
                onClick={() => updateBackground({ pattern: pattern.id as any })}
                className={`p-4 rounded-xl border-2 transition-all text-center ${
                  content.background?.pattern === pattern.id
                    ? 'border-sage-500 bg-sage-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="text-2xl mb-1">{pattern.preview}</div>
                <div className="text-xs font-medium">{pattern.label}</div>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="block text-xs text-slate-500 mb-1">
              Desen Opaklığı: {content.background?.patternOpacity || 10}%
            </label>
            <input
              type="range"
              min="5"
              max="50"
              value={content.background?.patternOpacity || 10}
              onChange={(e) => updateBackground({ patternOpacity: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
            />
          </div>
        </div>
      )}

      {/* Border */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Kenarlık</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.border?.enabled ?? false}
              onChange={(e) => updateBorder({ enabled: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>

        {content.border?.enabled && (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Stil</label>
                <select
                  value={content.border?.style || 'solid'}
                  onChange={(e) => updateBorder({ style: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="solid">Düz</option>
                  <option value="dashed">Kesikli</option>
                  <option value="dotted">Noktalı</option>
                  <option value="double">Çift</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Kalınlık: {content.border?.width || 1}px</label>
                <input
                  type="range"
                  min="1"
                  max="8"
                  value={content.border?.width || 1}
                  onChange={(e) => updateBorder({ width: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Renk</label>
                <input
                  type="color"
                  value={content.border?.color || '#e2e8f0'}
                  onChange={(e) => updateBorder({ color: e.target.value })}
                  className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">Köşe Yuvarlaklığı</label>
              <div className="grid grid-cols-6 gap-2">
                {['0', '0.25rem', '0.5rem', '0.75rem', '1rem', '1.5rem'].map(radius => (
                  <button
                    key={radius}
                    onClick={() => updateBorder({ radius })}
                    className={`p-2 rounded-lg border text-center text-xs transition-all ${
                      content.border?.radius === radius
                        ? 'border-sage-500 bg-sage-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {radius}
                  </button>
                ))}
              </div>
            </div>

            {/* Border Sides */}
            <div>
              <label className="block text-xs text-slate-500 mb-2">Kenarlık Tarafları</label>
              <div className="flex gap-3">
                {[
                  { key: 'top', label: 'Üst' },
                  { key: 'right', label: 'Sağ' },
                  { key: 'bottom', label: 'Alt' },
                  { key: 'left', label: 'Sol' },
                ].map(side => (
                  <label key={side.key} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={content.border?.sides?.[side.key as keyof typeof content.border.sides] ?? true}
                      onChange={(e) => updateBorder({
                        sides: { ...content.border?.sides, [side.key]: e.target.checked }
                      })}
                      className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                    />
                    <span className="text-sm text-slate-600">{side.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Top Divider */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Üst Ayırıcı</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.topDivider?.enabled ?? false}
              onChange={(e) => updateDivider('topDivider', { enabled: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>

        {content.topDivider?.enabled && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Stil</label>
              <select
                value={content.topDivider?.style || 'solid'}
                onChange={(e) => updateDivider('topDivider', { style: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="solid">Düz</option>
                <option value="dashed">Kesikli</option>
                <option value="dotted">Noktalı</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Genişlik</label>
              <select
                value={content.topDivider?.width || '100%'}
                onChange={(e) => updateDivider('topDivider', { width: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="25%">25%</option>
                <option value="50%">50%</option>
                <option value="75%">75%</option>
                <option value="100%">100%</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Renk</label>
              <input
                type="color"
                value={content.topDivider?.color || '#e2e8f0'}
                onChange={(e) => updateDivider('topDivider', { color: e.target.value })}
                className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Divider */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Alt Ayırıcı</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.bottomDivider?.enabled ?? false}
              onChange={(e) => updateDivider('bottomDivider', { enabled: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>

        {content.bottomDivider?.enabled && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Stil</label>
              <select
                value={content.bottomDivider?.style || 'solid'}
                onChange={(e) => updateDivider('bottomDivider', { style: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="solid">Düz</option>
                <option value="dashed">Kesikli</option>
                <option value="dotted">Noktalı</option>
                <option value="gradient">Gradient</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Genişlik</label>
              <select
                value={content.bottomDivider?.width || '100%'}
                onChange={(e) => updateDivider('bottomDivider', { width: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="25%">25%</option>
                <option value="50%">50%</option>
                <option value="75%">75%</option>
                <option value="100%">100%</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Renk</label>
              <input
                type="color"
                value={content.bottomDivider?.color || '#e2e8f0'}
                onChange={(e) => updateDivider('bottomDivider', { color: e.target.value })}
                className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
