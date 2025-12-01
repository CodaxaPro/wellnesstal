'use client'

import { FeaturesContent, FeaturesBackground, FeaturesTypography } from '../../types'

interface BackgroundTabProps {
  content: FeaturesContent
  updateContent: (updates: Partial<FeaturesContent>) => void
}

export default function BackgroundTab({ content, updateContent }: BackgroundTabProps) {
  const updateBackground = (updates: Partial<FeaturesBackground>) => {
    updateContent({ background: { ...content.background, ...updates } })
  }

  const updateTypography = (section: keyof FeaturesTypography, updates: Record<string, any>) => {
    updateContent({
      typography: {
        ...content.typography,
        [section]: { ...content.typography?.[section], ...updates }
      }
    })
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
                {['#ffffff', '#f8fafc', '#f0fdf4', '#fef3c7', '#dbeafe', '#fae8ff', '#1e293b'].map(color => (
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
              { id: 'waves', label: 'Dalgalar', preview: '〰' },
              { id: 'geometric', label: 'Geometrik', preview: '◆◇' },
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
        </div>
      )}

      {/* Section Title Typography */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Bölüm Başlığı Stili</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font Boyutu</label>
            <select
              value={content.typography?.sectionTitle?.fontSize || '2.5rem'}
              onChange={(e) => updateTypography('sectionTitle', { fontSize: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['1.5rem', '1.875rem', '2rem', '2.25rem', '2.5rem', '3rem', '3.5rem', '4rem'].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font Ağırlığı</label>
            <select
              value={content.typography?.sectionTitle?.fontWeight || '700'}
              onChange={(e) => updateTypography('sectionTitle', { fontWeight: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['400', '500', '600', '700', '800', '900'].map(weight => (
                <option key={weight} value={weight}>{weight}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Renk</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.typography?.sectionTitle?.color || '#1e293b'}
                onChange={(e) => updateTypography('sectionTitle', { color: e.target.value })}
                className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.typography?.sectionTitle?.color || '#1e293b'}
                onChange={(e) => updateTypography('sectionTitle', { color: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Alt Boşluk</label>
            <select
              value={content.typography?.sectionTitle?.marginBottom || '1rem'}
              onChange={(e) => updateTypography('sectionTitle', { marginBottom: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0.5rem', '1rem', '1.5rem', '2rem', '2.5rem', '3rem'].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Section Subtitle Typography */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Bölüm Alt Başlık Stili</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font Boyutu</label>
            <select
              value={content.typography?.sectionSubtitle?.fontSize || '1.125rem'}
              onChange={(e) => updateTypography('sectionSubtitle', { fontSize: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0.875rem', '1rem', '1.125rem', '1.25rem', '1.5rem'].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font Ağırlığı</label>
            <select
              value={content.typography?.sectionSubtitle?.fontWeight || '400'}
              onChange={(e) => updateTypography('sectionSubtitle', { fontWeight: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['300', '400', '500', '600'].map(weight => (
                <option key={weight} value={weight}>{weight}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Renk</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.typography?.sectionSubtitle?.color || '#64748b'}
                onChange={(e) => updateTypography('sectionSubtitle', { color: e.target.value })}
                className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.typography?.sectionSubtitle?.color || '#64748b'}
                onChange={(e) => updateTypography('sectionSubtitle', { color: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Max Genişlik</label>
            <select
              value={content.typography?.sectionSubtitle?.maxWidth || '600px'}
              onChange={(e) => updateTypography('sectionSubtitle', { maxWidth: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['400px', '500px', '600px', '700px', '800px', '100%'].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Feature Title Typography */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Özellik Başlık Stili</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font Boyutu</label>
            <select
              value={content.typography?.featureTitle?.fontSize || '1.25rem'}
              onChange={(e) => updateTypography('featureTitle', { fontSize: e.target.value })}
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
              value={content.typography?.featureTitle?.fontWeight || '600'}
              onChange={(e) => updateTypography('featureTitle', { fontWeight: e.target.value })}
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
              value={content.typography?.featureTitle?.color || '#1e293b'}
              onChange={(e) => updateTypography('featureTitle', { color: e.target.value })}
              className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Satır Yüksekliği</label>
            <select
              value={content.typography?.featureTitle?.lineHeight || '1.4'}
              onChange={(e) => updateTypography('featureTitle', { lineHeight: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['1.2', '1.3', '1.4', '1.5', '1.6'].map(lh => (
                <option key={lh} value={lh}>{lh}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Feature Description Typography */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Özellik Açıklama Stili</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font Boyutu</label>
            <select
              value={content.typography?.featureDescription?.fontSize || '1rem'}
              onChange={(e) => updateTypography('featureDescription', { fontSize: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0.875rem', '1rem', '1.125rem'].map(size => (
                <option key={size} value={size}>{size}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Font Ağırlığı</label>
            <select
              value={content.typography?.featureDescription?.fontWeight || '400'}
              onChange={(e) => updateTypography('featureDescription', { fontWeight: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['300', '400', '500'].map(weight => (
                <option key={weight} value={weight}>{weight}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Renk</label>
            <input
              type="color"
              value={content.typography?.featureDescription?.color || '#64748b'}
              onChange={(e) => updateTypography('featureDescription', { color: e.target.value })}
              className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Satır Yüksekliği</label>
            <select
              value={content.typography?.featureDescription?.lineHeight || '1.6'}
              onChange={(e) => updateTypography('featureDescription', { lineHeight: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['1.4', '1.5', '1.6', '1.7', '1.8'].map(lh => (
                <option key={lh} value={lh}>{lh}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}
