import { HeroContent } from '../../types'

interface StyleTabProps {
  content: HeroContent
  updateContent: (u: Partial<HeroContent>) => void
  updateNestedContent: (key: keyof HeroContent, nestedKey: string, value: any) => void
}

export default function StyleTab({
  content,
  updateContent,
  updateNestedContent
}: StyleTabProps) {
  return (
    <div className="space-y-6">
      {/* Background Type */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Arkaplan Tipi</label>
        <div className="grid grid-cols-5 gap-2">
          {[
            { id: 'solid', label: 'Düz Renk', icon: '⬜' },
            { id: 'gradient', label: 'Gradient', icon: '🌈' },
            { id: 'image', label: 'Görsel', icon: '🖼️' },
            { id: 'video', label: 'Video', icon: '🎬' },
            { id: 'pattern', label: 'Desen', icon: '⚡' },
          ].map(type => (
            <button
              key={type.id}
              onClick={() => updateContent({ backgroundType: type.id as any })}
              className={`p-3 rounded-xl border-2 transition-all ${
                content.backgroundType === type.id
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
      {content.backgroundType === 'solid' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Arkaplan Rengi</label>
          <div className="flex gap-4">
            <input
              type="color"
              value={content.backgroundColor || '#f8fafc'}
              onChange={(e) => updateContent({ backgroundColor: e.target.value })}
              className="w-16 h-16 rounded-xl border border-slate-200 cursor-pointer"
            />
            <div className="flex-1">
              <input
                type="text"
                value={content.backgroundColor || '#f8fafc'}
                onChange={(e) => updateContent({ backgroundColor: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 font-mono"
              />
              <div className="flex gap-2 mt-2">
                {['#f8fafc', '#faf5ff', '#f0fdf4', '#fff1f2', '#fefce8'].map(color => (
                  <button
                    key={color}
                    onClick={() => updateContent({ backgroundColor: color })}
                    className="w-8 h-8 rounded-lg border border-slate-200"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gradient */}
      {content.backgroundType === 'gradient' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Gradient Ayarları</label>

          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Başlangıç</label>
              <input
                type="color"
                value={content.gradientColors?.from || '#10b981'}
                onChange={(e) => updateContent({ gradientColors: { ...content.gradientColors, from: e.target.value, to: content.gradientColors?.to || '#3b82f6', direction: content.gradientColors?.direction || 'to-r' } })}
                className="w-full h-12 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Orta (Opsiyonel)</label>
              <input
                type="color"
                value={content.gradientColors?.via || ''}
                onChange={(e) => updateContent({ gradientColors: { ...content.gradientColors!, via: e.target.value } })}
                className="w-full h-12 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Bitiş</label>
              <input
                type="color"
                value={content.gradientColors?.to || '#3b82f6'}
                onChange={(e) => updateContent({ gradientColors: { ...content.gradientColors!, to: e.target.value } })}
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
                  onClick={() => updateContent({ gradientColors: { ...content.gradientColors!, direction: dir.id as any } })}
                  className={`p-2 rounded-lg border text-xl transition-all ${
                    content.gradientColors?.direction === dir.id
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
            className="mt-4 h-20 rounded-xl"
            style={{
              background: `linear-gradient(${
                content.gradientColors?.direction?.replace('to-', 'to ').replace('-', ' ') || 'to right'
              }, ${content.gradientColors?.from || '#10b981'}${content.gradientColors?.via ? `, ${content.gradientColors.via}` : ''}, ${content.gradientColors?.to || '#3b82f6'})`
            }}
          />
        </div>
      )}

      {/* Background Overlay */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold text-slate-700">Arkaplan Overlay</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.backgroundOverlay?.enabled || false}
              onChange={(e) => updateContent({
                backgroundOverlay: {
                  enabled: e.target.checked,
                  color: content.backgroundOverlay?.color || '#000000',
                  opacity: content.backgroundOverlay?.opacity || 30,
                  blendMode: content.backgroundOverlay?.blendMode || 'normal'
                }
              })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>
        {content.backgroundOverlay?.enabled && (
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Renk</label>
              <input
                type="color"
                value={content.backgroundOverlay.color}
                onChange={(e) => updateContent({ backgroundOverlay: { ...content.backgroundOverlay!, color: e.target.value } })}
                className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Opaklık: {content.backgroundOverlay.opacity}%</label>
              <input
                type="range"
                min="0"
                max="100"
                value={content.backgroundOverlay.opacity}
                onChange={(e) => updateContent({ backgroundOverlay: { ...content.backgroundOverlay!, opacity: parseInt(e.target.value) } })}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Karışım</label>
              <select
                value={content.backgroundOverlay.blendMode}
                onChange={(e) => updateContent({ backgroundOverlay: { ...content.backgroundOverlay!, blendMode: e.target.value as any } })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
              >
                <option value="normal">Normal</option>
                <option value="multiply">Multiply</option>
                <option value="overlay">Overlay</option>
                <option value="darken">Darken</option>
                <option value="lighten">Lighten</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Info about typography */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <div className="flex items-start gap-3">
          <span className="text-xl">💡</span>
          <div>
            <h4 className="font-medium text-blue-700">Tipografi Ayarları</h4>
            <p className="text-sm text-blue-600 mt-1">
              Başlık ve alt başlık stilleri artık <strong>İçerik</strong> sekmesinde,
              her metin alanının hemen altında bulunuyor. Böylece içeriği düzenlerken
              aynı anda stilini de ayarlayabilirsiniz.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
