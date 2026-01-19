'use client'

import { TeamContent, TeamBackground } from '../../types'

import {
  BACKGROUND_TYPE_OPTIONS,
  GRADIENT_DIRECTION_OPTIONS,
  PATTERN_OPTIONS
} from './defaults'

interface BackgroundTabProps {
  content: TeamContent
  updateContent: (updates: Partial<TeamContent>) => void
}

export default function BackgroundTab({ content, updateContent }: BackgroundTabProps) {
  const background = content.background || { type: 'solid', color: '#f8fafc' }

  const updateBackground = (updates: Partial<TeamBackground>) => {
    updateContent({ background: { ...background, ...updates } })
  }

  return (
    <div className="space-y-6">
      {/* Background Type */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Arkaplan Tipi</h3>
        <div className="grid grid-cols-5 gap-2">
          {BACKGROUND_TYPE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateBackground({ type: option.id as TeamBackground['type'] })}
              className={`p-3 rounded-lg border transition-all text-center ${
                background.type === option.id
                  ? 'border-sage-500 bg-sage-50 text-sage-700'
                  : 'border-slate-200 hover:border-slate-300 text-slate-600'
              }`}
            >
              <div className="text-lg font-bold mb-1">{option.icon}</div>
              <div className="text-xs">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Solid Color */}
      {background.type === 'solid' && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Duz Renk</h3>
          <div className="flex gap-3">
            <input
              type="color"
              value={background.color || '#f8fafc'}
              onChange={(e) => updateBackground({ color: e.target.value })}
              className="w-16 h-16 rounded-lg border border-slate-200 cursor-pointer"
            />
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-600 mb-1">Renk Kodu</label>
              <input
                type="text"
                value={background.color || '#f8fafc'}
                onChange={(e) => updateBackground({ color: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
              {/* Quick Colors */}
              <div className="flex gap-2 mt-2">
                {['#ffffff', '#f8fafc', '#f1f5f9', '#f0fdf4', '#fef3c7', '#fce7f3', '#0f172a'].map((color) => (
                  <button
                    key={color}
                    onClick={() => updateBackground({ color })}
                    className={`w-8 h-8 rounded-lg border-2 transition-all ${
                      background.color === color ? 'border-sage-500 scale-110' : 'border-slate-200'
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
      {background.type === 'gradient' && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Gradient</h3>
          <div className="space-y-4">
            {/* Gradient Colors */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Baslangic</label>
                <input
                  type="color"
                  value={background.gradientFrom || '#f8fafc'}
                  onChange={(e) => updateBackground({ gradientFrom: e.target.value })}
                  className="w-full h-12 rounded border border-slate-200 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Orta (Opsiyonel)</label>
                <input
                  type="color"
                  value={background.gradientVia || '#ffffff'}
                  onChange={(e) => updateBackground({ gradientVia: e.target.value })}
                  className="w-full h-12 rounded border border-slate-200 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Bitis</label>
                <input
                  type="color"
                  value={background.gradientTo || '#f1f5f9'}
                  onChange={(e) => updateBackground({ gradientTo: e.target.value })}
                  className="w-full h-12 rounded border border-slate-200 cursor-pointer"
                />
              </div>
            </div>

            {/* Gradient Direction */}
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Yon</label>
              <div className="grid grid-cols-4 gap-2">
                {GRADIENT_DIRECTION_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => updateBackground({ gradientDirection: option.id as TeamBackground['gradientDirection'] })}
                    className={`py-2 text-xs rounded-lg border transition-colors ${
                      background.gradientDirection === option.id
                        ? 'bg-sage-500 text-white border-sage-500'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Gradient Preview */}
            <div
              className="h-20 rounded-lg border border-slate-200"
              style={{
                background: `linear-gradient(${
                  background.gradientDirection === 'to-r' ? 'to right' :
                  background.gradientDirection === 'to-l' ? 'to left' :
                  background.gradientDirection === 'to-t' ? 'to top' :
                  background.gradientDirection === 'to-b' ? 'to bottom' :
                  background.gradientDirection === 'to-br' ? 'to bottom right' :
                  background.gradientDirection === 'to-bl' ? 'to bottom left' :
                  background.gradientDirection === 'to-tr' ? 'to top right' : 'to top left'
                }, ${background.gradientFrom || '#f8fafc'}${background.gradientVia ? `, ${background.gradientVia}` : ''}, ${background.gradientTo || '#f1f5f9'})`
              }}
            />
          </div>
        </div>
      )}

      {/* Image Background */}
      {background.type === 'image' && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Resim Arkaplan</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Resim URL</label>
              <input
                type="text"
                value={background.imageUrl || ''}
                onChange={(e) => updateBackground({ imageUrl: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="https://..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Boyut</label>
                <select
                  value={background.imageSize || 'cover'}
                  onChange={(e) => updateBackground({ imageSize: e.target.value as TeamBackground['imageSize'] })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="cover">Cover</option>
                  <option value="contain">Contain</option>
                  <option value="auto">Auto</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Pozisyon</label>
                <input
                  type="text"
                  value={background.imagePosition || 'center'}
                  onChange={(e) => updateBackground({ imagePosition: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="center"
                />
              </div>
            </div>

            {/* Overlay */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer mb-3">
                <input
                  type="checkbox"
                  checked={background.overlayEnabled === true}
                  onChange={(e) => updateBackground({ overlayEnabled: e.target.checked })}
                  className="w-4 h-4 text-sage-600 rounded"
                />
                <span className="text-sm text-slate-700">Overlay Ekle</span>
              </label>
              {background.overlayEnabled && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Overlay Rengi</label>
                    <input
                      type="color"
                      value={background.overlayColor || '#000000'}
                      onChange={(e) => updateBackground({ overlayColor: e.target.value })}
                      className="w-full h-10 rounded border border-slate-200 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      Opaklık: {Math.round((background.overlayOpacity || 0.5) * 100)}%
                    </label>
                    <input
                      type="range"
                      value={(background.overlayOpacity || 0.5) * 100}
                      onChange={(e) => updateBackground({ overlayOpacity: parseInt(e.target.value) / 100 })}
                      min={0}
                      max={100}
                      className="w-full"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Pattern Background */}
      {background.type === 'pattern' && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Pattern</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-2">Pattern Tipi</label>
              <div className="grid grid-cols-5 gap-2">
                {PATTERN_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => updateBackground({ pattern: option.id as TeamBackground['pattern'] })}
                    className={`py-2 text-xs rounded-lg border transition-colors ${
                      background.pattern === option.id
                        ? 'bg-sage-500 text-white border-sage-500'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Pattern Rengi</label>
                <input
                  type="color"
                  value={background.patternColor || '#e2e8f0'}
                  onChange={(e) => updateBackground({ patternColor: e.target.value })}
                  className="w-full h-10 rounded border border-slate-200 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">
                  Opaklık: {Math.round((background.patternOpacity || 0.5) * 100)}%
                </label>
                <input
                  type="range"
                  value={(background.patternOpacity || 0.5) * 100}
                  onChange={(e) => updateBackground({ patternOpacity: parseInt(e.target.value) / 100 })}
                  min={0}
                  max={100}
                  className="w-full"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
