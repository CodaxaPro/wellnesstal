'use client'

import { CTAContent, CTABackground, CTABorderSettings, CTATypography } from '../../types'
import { BACKGROUND_TYPE_OPTIONS, PATTERN_OPTIONS, GRADIENT_DIRECTION_OPTIONS } from './defaults'

interface BackgroundTabProps {
  content: CTAContent
  updateContent: (updates: Partial<CTAContent>) => void
}

export default function BackgroundTab({ content, updateContent }: BackgroundTabProps) {
  const updateBackground = (updates: Partial<CTABackground>) => {
    updateContent({
      background: { ...content.background, ...updates }
    })
  }

  const updateBorder = (updates: Partial<CTABorderSettings>) => {
    updateContent({
      border: { ...content.border, ...updates } as CTABorderSettings
    })
  }

  const updateTypography = (key: 'title' | 'subtitle' | 'description', updates: Partial<CTATypography['title']>) => {
    updateContent({
      typography: {
        ...content.typography,
        [key]: { ...content.typography[key], ...updates }
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Background Type */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Arkaplan Tipi</label>
        <div className="grid grid-cols-5 gap-2">
          {BACKGROUND_TYPE_OPTIONS.map(type => (
            <button
              key={type.id}
              onClick={() => updateBackground({ type: type.id as any })}
              className={`p-3 rounded-lg text-center transition-all ${
                content.background.type === type.id
                  ? 'bg-sage-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="text-lg block mb-1">{type.icon}</span>
              <span className="text-xs">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Solid Color */}
      {content.background.type === 'solid' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-4">Duz Renk</label>
          <div className="flex gap-4">
            <input
              type="color"
              value={content.background.color || '#059669'}
              onChange={(e) => updateBackground({ color: e.target.value })}
              className="w-16 h-16 rounded-lg border border-slate-200 cursor-pointer"
            />
            <div className="flex-1">
              <label className="block text-xs text-slate-500 mb-1">HEX Kodu</label>
              <input
                type="text"
                value={content.background.color || '#059669'}
                onChange={(e) => updateBackground({ color: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          {/* Quick Colors */}
          <div className="mt-4">
            <label className="block text-xs text-slate-500 mb-2">Hazir Renkler</label>
            <div className="grid grid-cols-8 gap-2">
              {[
                '#059669', '#047857', '#065f46', // Sage/Greens
                '#1f2937', '#374151', '#4b5563', // Grays
                '#dc2626', '#ea580c', // Reds/Oranges
                '#2563eb', '#7c3aed', // Blues/Purples
                '#f9fafb', '#ffffff'  // Light
              ].map(color => (
                <button
                  key={color}
                  onClick={() => updateBackground({ color })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    content.background.color === color
                      ? 'border-sage-500 ring-2 ring-sage-200'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gradient */}
      {content.background.type === 'gradient' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-4">Gradient Ayarlari</label>

          <div className="space-y-4">
            {/* Gradient Colors */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Baslangic</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.background.gradientFrom || '#059669'}
                    onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.background.gradientFrom || '#059669'}
                    onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                    className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Orta (Opsiyonel)</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.background.gradientVia || '#047857'}
                    onChange={(e) => updateBackground({ gradientVia: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.background.gradientVia || ''}
                    onChange={(e) => updateBackground({ gradientVia: e.target.value })}
                    className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs font-mono"
                    placeholder="Bos bırakın"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Bitis</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.background.gradientTo || '#065f46'}
                    onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.background.gradientTo || '#065f46'}
                    onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                    className="flex-1 px-2 py-1 border border-slate-200 rounded text-xs font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Gradient Direction */}
            <div>
              <label className="block text-xs text-slate-500 mb-2">Yon</label>
              <div className="grid grid-cols-9 gap-2">
                {GRADIENT_DIRECTION_OPTIONS.map(dir => (
                  <button
                    key={dir.id}
                    onClick={() => updateBackground({ gradientDirection: dir.id as any })}
                    title={dir.title}
                    className={`p-2 rounded-lg text-lg transition-all ${
                      content.background.gradientDirection === dir.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {dir.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Type */}
            <div>
              <label className="block text-xs text-slate-500 mb-2">Gradient Tipi</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'linear', label: 'Linear' },
                  { id: 'radial', label: 'Radial' },
                  { id: 'conic', label: 'Conic' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => updateBackground({ gradientType: type.id as any })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.background.gradientType === type.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div
              className="h-20 rounded-lg"
              style={{
                background: content.background.gradientType === 'radial'
                  ? `radial-gradient(circle, ${content.background.gradientFrom} 0%, ${content.background.gradientVia || content.background.gradientFrom} 50%, ${content.background.gradientTo} 100%)`
                  : content.background.gradientType === 'conic'
                  ? `conic-gradient(from 0deg, ${content.background.gradientFrom}, ${content.background.gradientVia || content.background.gradientFrom}, ${content.background.gradientTo})`
                  : `linear-gradient(${content.background.gradientDirection?.replace('to-', 'to ')}, ${content.background.gradientFrom}, ${content.background.gradientVia ? content.background.gradientVia + ',' : ''} ${content.background.gradientTo})`
              }}
            />
          </div>
        </div>
      )}

      {/* Image Background */}
      {content.background.type === 'image' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-4">Gorsel Arkaplan</label>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Gorsel URL</label>
              <input
                type="text"
                value={content.background.imageUrl || ''}
                onChange={(e) => updateBackground({ imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Pozisyon</label>
                <select
                  value={content.background.imagePosition || 'center'}
                  onChange={(e) => updateBackground({ imagePosition: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="center">Orta</option>
                  <option value="top">Ust</option>
                  <option value="bottom">Alt</option>
                  <option value="left">Sol</option>
                  <option value="right">Sag</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Boyut</label>
                <select
                  value={content.background.imageSize || 'cover'}
                  onChange={(e) => updateBackground({ imageSize: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
            </div>

            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={content.background.imageRepeat ?? false}
                onChange={(e) => updateBackground({ imageRepeat: e.target.checked })}
                className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
              />
              <span className="text-sm text-slate-600">Tekrarla</span>
            </label>
          </div>
        </div>
      )}

      {/* Pattern */}
      {content.background.type === 'pattern' && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-4">Desen Ayarlari</label>

          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">Desen Tipi</label>
              <div className="grid grid-cols-6 gap-2">
                {PATTERN_OPTIONS.map(pattern => (
                  <button
                    key={pattern.id}
                    onClick={() => updateBackground({ pattern: pattern.id as any })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.background.pattern === pattern.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pattern.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Desen Rengi</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.background.patternColor || '#ffffff'}
                    onChange={(e) => updateBackground({ patternColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.background.patternColor || '#ffffff'}
                    onChange={(e) => updateBackground({ patternColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Opaklik: {content.background.patternOpacity ?? 10}%
                </label>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={content.background.patternOpacity ?? 10}
                  onChange={(e) => updateBackground({ patternOpacity: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">Desen Boyutu</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'sm', label: 'Kucuk' },
                  { id: 'md', label: 'Orta' },
                  { id: 'lg', label: 'Buyuk' }
                ].map(size => (
                  <button
                    key={size.id}
                    onClick={() => updateBackground({ patternSize: size.id as any })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.background.patternSize === size.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {(content.background.type === 'image' || content.background.type === 'video') && (
        <div className="p-4 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <label className="text-sm font-semibold text-slate-700">Overlay</label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={content.background.overlayEnabled ?? false}
                onChange={(e) => updateBackground({ overlayEnabled: e.target.checked })}
                className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
              />
              <span className="text-xs text-slate-500">Aktif</span>
            </label>
          </div>

          {content.background.overlayEnabled && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Renk</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={content.background.overlayColor || '#000000'}
                      onChange={(e) => updateBackground({ overlayColor: e.target.value })}
                      className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={content.background.overlayColor || '#000000'}
                      onChange={(e) => updateBackground({ overlayColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">
                    Opaklik: {content.background.overlayOpacity ?? 20}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={content.background.overlayOpacity ?? 20}
                    onChange={(e) => updateBackground({ overlayOpacity: parseInt(e.target.value) })}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-500 mb-2">Blend Mode</label>
                <select
                  value={content.background.overlayBlendMode || 'normal'}
                  onChange={(e) => updateBackground({ overlayBlendMode: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="multiply">Multiply</option>
                  <option value="overlay">Overlay</option>
                  <option value="darken">Darken</option>
                  <option value="lighten">Lighten</option>
                  <option value="screen">Screen</option>
                </select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Border */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Cerceve</label>
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
                  <option value="solid">Solid</option>
                  <option value="dashed">Dashed</option>
                  <option value="dotted">Dotted</option>
                  <option value="double">Double</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Kalinlik</label>
                <input
                  type="number"
                  value={content.border?.width || 1}
                  onChange={(e) => updateBorder({ width: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  min="0"
                  max="10"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Renk</label>
                <input
                  type="color"
                  value={content.border?.color || '#e5e7eb'}
                  onChange={(e) => updateBorder({ color: e.target.value })}
                  className="w-full h-10 rounded border border-slate-200 cursor-pointer"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-1">Kose Yuvarlama</label>
              <select
                value={content.border?.radius || '1rem'}
                onChange={(e) => updateBorder({ radius: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="0">Kare</option>
                <option value="0.25rem">XS</option>
                <option value="0.5rem">S</option>
                <option value="0.75rem">M</option>
                <option value="1rem">L</option>
                <option value="1.5rem">XL</option>
                <option value="2rem">2XL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">Kenarlar</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'top', label: 'Ust' },
                  { id: 'right', label: 'Sag' },
                  { id: 'bottom', label: 'Alt' },
                  { id: 'left', label: 'Sol' }
                ].map(side => (
                  <label key={side.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={content.border?.sides?.[side.id as keyof typeof content.border.sides] ?? true}
                      onChange={(e) => updateBorder({
                        sides: {
                          top: content.border?.sides?.top ?? true,
                          right: content.border?.sides?.right ?? true,
                          bottom: content.border?.sides?.bottom ?? true,
                          left: content.border?.sides?.left ?? true,
                          [side.id]: e.target.checked
                        }
                      })}
                      className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                    />
                    <span className="text-xs text-slate-600">{side.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Typography Colors */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Metin Renkleri</label>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Baslik Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.typography.title.color || '#ffffff'}
                onChange={(e) => updateTypography('title', { color: e.target.value })}
                className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.typography.title.color || '#ffffff'}
                onChange={(e) => updateTypography('title', { color: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-1">Alt Baslik Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.typography.subtitle.color || 'rgba(255,255,255,0.9)'}
                onChange={(e) => updateTypography('subtitle', { color: e.target.value })}
                className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.typography.subtitle.color || 'rgba(255,255,255,0.9)'}
                onChange={(e) => updateTypography('subtitle', { color: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
