'use client'

import { FAQBackground, FAQContent } from '../../types'

import { BACKGROUND_TYPE_OPTIONS, GRADIENT_DIRECTION_OPTIONS, PATTERN_OPTIONS } from './defaults'

interface BackgroundTabProps {
  content: FAQContent
  updateContent: (updates: Partial<FAQContent>) => void
}

const defaultBackground: FAQBackground = {
  type: 'solid',
  color: '#f8fafc'
}

export default function BackgroundTab({ content, updateContent }: BackgroundTabProps) {
  const background = content.background || defaultBackground

  const updateBackground = (updates: Partial<FAQBackground>) => {
    updateContent({
      background: { ...background, ...updates }
    })
  }

  return (
    <div className="space-y-6">
      {/* Background Type */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-sage-100 rounded-lg flex items-center justify-center text-sage-600">BG</span>
          Arkaplan Tipi
        </h3>

        <div className="grid grid-cols-5 gap-2">
          {BACKGROUND_TYPE_OPTIONS.map(type => (
            <button
              key={type.id}
              onClick={() => updateBackground({ type: type.id as FAQBackground['type'] })}
              className={`p-3 rounded-xl border text-center transition-all ${
                background.type === type.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-xl block mb-1">{type.icon}</span>
              <span className="text-[10px] font-medium text-slate-600">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Solid Color */}
      {background.type === 'solid' && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">C</span>
            Duz Renk
          </h3>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Arkaplan Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={background.color ?? '#f8fafc'}
                onChange={(e) => updateBackground({ color: e.target.value })}
                className="w-12 h-10 rounded border border-slate-200"
              />
              <input
                type="text"
                value={background.color ?? '#f8fafc'}
                onChange={(e) => updateBackground({ color: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          {/* Quick Colors */}
          <div className="mt-4">
            <label className="block text-xs font-medium text-slate-600 mb-2">Hizli Renkler</label>
            <div className="flex flex-wrap gap-2">
              {[
                '#ffffff', '#f8fafc', '#f1f5f9', '#e2e8f0',
                '#f0fdf4', '#fef3c7', '#fef2f2', '#f0f9ff'
              ].map(color => (
                <button
                  key={color}
                  onClick={() => updateBackground({ color })}
                  className={`w-8 h-8 rounded-lg border-2 transition-all ${
                    background.color === color
                      ? 'border-sage-500 scale-110'
                      : 'border-transparent hover:border-slate-300'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Gradient */}
      {background.type === 'gradient' && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">G</span>
            Gradient
          </h3>

          <div className="space-y-4">
            {/* Direction */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Yon</label>
              <div className="grid grid-cols-4 gap-2">
                {GRADIENT_DIRECTION_OPTIONS.map(dir => (
                  <button
                    key={dir.id}
                    onClick={() => {
                      const value = dir.id as FAQBackground['gradientDirection']
                      if (value) {
                        updateBackground({ gradientDirection: value })
                      }
                    }}
                    className={`py-2 rounded-lg text-xs transition-colors ${
                      background.gradientDirection === dir.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {dir.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Baslangic</label>
                <input
                  type="color"
                  value={background.gradientFrom ?? '#f0fdf4'}
                  onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                  className="w-full h-10 rounded border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Orta (Opsiyonel)</label>
                <input
                  type="color"
                  value={background.gradientVia ?? '#ffffff'}
                  onChange={(e) => updateBackground({ gradientVia: e.target.value })}
                  className="w-full h-10 rounded border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Bitis</label>
                <input
                  type="color"
                  value={background.gradientTo ?? '#f8fafc'}
                  onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                  className="w-full h-10 rounded border border-slate-200"
                />
              </div>
            </div>

            {/* Preview */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Onizleme</label>
              <div
                className="h-16 rounded-lg border border-slate-200"
                style={{
                  background: background.gradientVia
                    ? `linear-gradient(${background.gradientDirection?.replace('to-', 'to ').replace('-', ' ') || 'to bottom'}, ${background.gradientFrom}, ${background.gradientVia}, ${background.gradientTo})`
                    : `linear-gradient(${background.gradientDirection?.replace('to-', 'to ').replace('-', ' ') || 'to bottom'}, ${background.gradientFrom}, ${background.gradientTo})`
                }}
              />
            </div>

            {/* Preset Gradients */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Hazir Gradientler</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { from: '#f0fdf4', to: '#f8fafc', name: 'Sage' },
                  { from: '#fef3c7', to: '#ffffff', name: 'Amber' },
                  { from: '#f0f9ff', to: '#f8fafc', name: 'Blue' },
                  { from: '#fef2f2', to: '#ffffff', name: 'Rose' }
                ].map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => updateBackground({
                      gradientFrom: preset.from,
                      gradientTo: preset.to
                    })}
                    className="h-10 rounded-lg border border-slate-200 hover:border-sage-400 transition-colors"
                    style={{
                      background: `linear-gradient(to right, ${preset.from}, ${preset.to})`
                    }}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image */}
      {background.type === 'image' && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">I</span>
            Arkaplan Resmi
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Resim URL</label>
              <input
                type="text"
                value={background.imageUrl ?? ''}
                onChange={(e) => updateBackground({ imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="https://example.com/image.jpg"
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
                  <option value="top">Ust</option>
                  <option value="bottom">Alt</option>
                  <option value="left">Sol</option>
                  <option value="right">Sag</option>
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

            {/* Overlay */}
            <div className="p-3 bg-slate-50 rounded-lg">
              <label className="flex items-center gap-2 mb-3">
                <input
                  type="checkbox"
                  checked={background.overlayEnabled ?? false}
                  onChange={(e) => updateBackground({ overlayEnabled: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500"
                />
                <span className="text-sm text-slate-700">Overlay Ekle</span>
              </label>

              {background.overlayEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Overlay Rengi</label>
                    <input
                      type="color"
                      value={background.overlayColor ?? '#000000'}
                      onChange={(e) => updateBackground({ overlayColor: e.target.value })}
                      className="w-full h-9 rounded border border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1.5">Opaklik</label>
                    <input
                      type="range"
                      value={(background.overlayOpacity ?? 0.5) * 100}
                      onChange={(e) => updateBackground({ overlayOpacity: parseInt(e.target.value) / 100 })}
                      className="w-full"
                      min={0}
                      max={100}
                    />
                    <span className="text-xs text-slate-500">{Math.round((background.overlayOpacity ?? 0.5) * 100)}%</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pattern */}
      {background.type === 'pattern' && (
        <div className="bg-white rounded-xl p-4 border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
            <span className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">P</span>
            Pattern
          </h3>

          <div className="space-y-4">
            {/* Base Color */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Temel Renk</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={background.color ?? '#f8fafc'}
                  onChange={(e) => updateBackground({ color: e.target.value })}
                  className="w-12 h-10 rounded border border-slate-200"
                />
                <input
                  type="text"
                  value={background.color ?? '#f8fafc'}
                  onChange={(e) => updateBackground({ color: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>

            {/* Pattern Type */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Pattern Tipi</label>
              <div className="grid grid-cols-4 gap-2">
                {PATTERN_OPTIONS.map(pattern => (
                  <button
                    key={pattern.id}
                    onClick={() => {
                      const value = pattern.id as FAQBackground['pattern']
                      if (value) {
                        updateBackground({ pattern: value })
                      }
                    }}
                    className={`py-3 rounded-lg text-sm transition-colors ${
                      background.pattern === pattern.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {pattern.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Pattern Color & Opacity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Pattern Rengi</label>
                <input
                  type="color"
                  value={background.patternColor ?? '#e2e8f0'}
                  onChange={(e) => updateBackground({ patternColor: e.target.value })}
                  className="w-full h-9 rounded border border-slate-200"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1.5">Opaklik</label>
                <input
                  type="range"
                  value={(background.patternOpacity ?? 0.5) * 100}
                  onChange={(e) => updateBackground({ patternOpacity: parseInt(e.target.value) / 100 })}
                  className="w-full"
                  min={0}
                  max={100}
                />
                <span className="text-xs text-slate-500">{Math.round((background.patternOpacity ?? 0.5) * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
