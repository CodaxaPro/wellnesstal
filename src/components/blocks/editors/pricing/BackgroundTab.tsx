'use client'

import { PricingContent, PricingBackground } from '../../types'

interface BackgroundTabProps {
  content: PricingContent
  updateContent: (updates: Partial<PricingContent>) => void
}

const defaultBackground: PricingBackground = {
  type: 'solid',
  color: '#ffffff'
}

export default function BackgroundTab({ content, updateContent }: BackgroundTabProps) {
  const background = content.background || defaultBackground

  const updateBackground = (updates: Partial<PricingBackground>) => {
    updateContent({
      background: { ...background, ...updates }
    })
  }

  return (
    <div className="space-y-6">
      {/* Background Type */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-sage-100 rounded-lg flex items-center justify-center text-sage-600">🎨</span>
          Arkaplan Tipi
        </h3>

        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'solid', label: 'Düz Renk', icon: '◼️' },
            { id: 'gradient', label: 'Gradient', icon: '🌈' },
            { id: 'image', label: 'Görsel', icon: '🖼️' },
            { id: 'pattern', label: 'Desen', icon: '🔲' }
          ].map(type => (
            <button
              key={type.id}
              onClick={() => updateBackground({ type: type.id as 'solid' | 'gradient' | 'image' | 'pattern' })}
              className={`p-3 rounded-xl border text-center transition-all ${
                background.type === type.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xl block mb-1">{type.icon}</span>
              <span className="text-[10px] font-medium text-slate-700">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Solid Color */}
      {background.type === 'solid' && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Düz Renk</h3>
          <div className="flex gap-3">
            <input
              type="color"
              value={background.color ?? '#ffffff'}
              onChange={(e) => updateBackground({ color: e.target.value })}
              className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
            />
            <input
              type="text"
              value={background.color ?? '#ffffff'}
              onChange={(e) => updateBackground({ color: e.target.value })}
              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
            />
          </div>

          {/* Quick Colors */}
          <div className="mt-4">
            <p className="text-xs text-slate-500 mb-2">Hızlı Seçim</p>
            <div className="flex flex-wrap gap-2">
              {[
                { color: '#ffffff', label: 'Beyaz' },
                { color: '#f8fafc', label: 'Slate 50' },
                { color: '#f1f5f9', label: 'Slate 100' },
                { color: '#f0fdf4', label: 'Green 50' },
                { color: '#ecfdf5', label: 'Emerald 50' },
                { color: '#f0fdfa', label: 'Teal 50' },
                { color: '#1e293b', label: 'Dark' }
              ].map(item => (
                <button
                  key={item.color}
                  onClick={() => updateBackground({ color: item.color })}
                  className="w-8 h-8 rounded-lg border border-slate-200 hover:scale-110 transition-transform"
                  style={{ backgroundColor: item.color }}
                  title={item.label}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gradient */}
      {background.type === 'gradient' && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Gradient</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Başlangıç</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={background.gradientFrom ?? '#f0fdf4'}
                    onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                    className="w-10 h-9 rounded border border-slate-200"
                  />
                  <input
                    type="text"
                    value={background.gradientFrom ?? '#f0fdf4'}
                    onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Orta (Opsiyonel)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={background.gradientVia ?? '#ffffff'}
                    onChange={(e) => updateBackground({ gradientVia: e.target.value })}
                    className="w-10 h-9 rounded border border-slate-200"
                  />
                  <input
                    type="text"
                    value={background.gradientVia ?? ''}
                    onChange={(e) => updateBackground({ gradientVia: e.target.value })}
                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs"
                    placeholder="Boş bırakın"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Bitiş</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={background.gradientTo ?? '#ecfeff'}
                    onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                    className="w-10 h-9 rounded border border-slate-200"
                  />
                  <input
                    type="text"
                    value={background.gradientTo ?? '#ecfeff'}
                    onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                    className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Yön</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'to-r', label: '→' },
                  { id: 'to-l', label: '←' },
                  { id: 'to-t', label: '↑' },
                  { id: 'to-b', label: '↓' },
                  { id: 'to-br', label: '↘' },
                  { id: 'to-bl', label: '↙' },
                  { id: 'to-tr', label: '↗' },
                  { id: 'to-tl', label: '↖' }
                ].map(dir => (
                  <button
                    key={dir.id}
                    onClick={() => updateBackground({ gradientDirection: dir.id as 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl' })}
                    className={`py-2 rounded-lg text-lg ${
                      background.gradientDirection === dir.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {dir.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div
              className="h-20 rounded-lg border border-slate-200"
              style={{
                background: `linear-gradient(${
                  background.gradientDirection?.replace('to-', 'to ') || 'to bottom right'
                }, ${background.gradientFrom ?? '#f0fdf4'}${
                  background.gradientVia ? `, ${background.gradientVia}` : ''
                }, ${background.gradientTo ?? '#ecfeff'})`
              }}
            />
          </div>
        </div>
      )}

      {/* Image */}
      {background.type === 'image' && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Görsel</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Görsel URL</label>
              <input
                type="text"
                value={background.imageUrl ?? ''}
                onChange={(e) => updateBackground({ imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Pozisyon</label>
                <select
                  value={background.imagePosition ?? 'center'}
                  onChange={(e) => updateBackground({ imagePosition: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="center">Orta</option>
                  <option value="top">Üst</option>
                  <option value="bottom">Alt</option>
                  <option value="left">Sol</option>
                  <option value="right">Sağ</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Boyut</label>
                <select
                  value={background.imageSize ?? 'cover'}
                  onChange={(e) => updateBackground({ imageSize: e.target.value as 'cover' | 'contain' | 'auto' })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pattern */}
      {background.type === 'pattern' && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4">Desen</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Desen Tipi</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'dots', label: 'Noktalar' },
                  { id: 'grid', label: 'Grid' },
                  { id: 'lines', label: 'Çizgiler' },
                  { id: 'waves', label: 'Dalgalar' }
                ].map(pattern => (
                  <button
                    key={pattern.id}
                    onClick={() => updateBackground({ pattern: pattern.id as 'dots' | 'grid' | 'lines' | 'waves' })}
                    className={`py-2 rounded-lg text-xs ${
                      background.pattern === pattern.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 hover:bg-slate-200'
                    }`}
                  >
                    {pattern.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Desen Rengi</label>
                <input
                  type="color"
                  value={background.patternColor ?? '#e2e8f0'}
                  onChange={(e) => updateBackground({ patternColor: e.target.value })}
                  className="w-full h-9 rounded border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Opaklık (%)</label>
                <input
                  type="number"
                  value={background.patternOpacity ?? 10}
                  onChange={(e) => updateBackground({ patternOpacity: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  min={0}
                  max={100}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">🔳</span>
          Overlay
        </h3>

        <label className="flex items-center gap-2 mb-4">
          <input
            type="checkbox"
            checked={background.overlayEnabled ?? false}
            onChange={(e) => updateBackground({ overlayEnabled: e.target.checked })}
            className="rounded border-slate-300 text-sage-500"
          />
          <span className="text-sm text-slate-700">Overlay Aktif</span>
        </label>

        {background.overlayEnabled && (
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Renk</label>
              <input
                type="color"
                value={background.overlayColor ?? '#000000'}
                onChange={(e) => updateBackground({ overlayColor: e.target.value })}
                className="w-full h-9 rounded border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Opaklık (%)</label>
              <input
                type="number"
                value={background.overlayOpacity ?? 20}
                onChange={(e) => updateBackground({ overlayOpacity: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                min={0}
                max={100}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
