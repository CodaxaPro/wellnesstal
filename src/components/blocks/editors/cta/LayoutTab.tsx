'use client'

import { CTAContent, CTADecoration } from '../../types'
import { CTA_LAYOUT_OPTIONS } from './defaults'

interface LayoutTabProps {
  content: CTAContent
  updateContent: (updates: Partial<CTAContent>) => void
}

export default function LayoutTab({ content, updateContent }: LayoutTabProps) {
  const updateDecoration = (updates: Partial<CTADecoration>) => {
    updateContent({
      decoration: { ...content.decoration, ...updates } as CTADecoration
    })
  }

  return (
    <div className="space-y-6">
      {/* Layout Selection */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Duzen Tipi</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CTA_LAYOUT_OPTIONS.map(layout => (
            <button
              key={layout.id}
              onClick={() => updateContent({ layout: layout.id as any })}
              className={`p-4 rounded-xl border-2 transition-all text-center ${
                content.layout === layout.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-2xl mb-2 block">{layout.icon}</span>
              <span className="text-sm font-medium text-slate-700 block">{layout.label}</span>
              <span className="text-xs text-slate-500">{layout.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Alignment */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Hizalama</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">Yatay Hizalama</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'left', label: 'Sol', icon: '◀' },
                { id: 'center', label: 'Orta', icon: '⬜' },
                { id: 'right', label: 'Sag', icon: '▶' }
              ].map(align => (
                <button
                  key={align.id}
                  onClick={() => updateContent({ alignment: align.id as any })}
                  className={`p-3 rounded-lg text-center transition-all ${
                    content.alignment === align.id
                      ? 'bg-sage-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="block text-lg mb-1">{align.icon}</span>
                  <span className="text-xs">{align.label}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-2">Dikey Hizalama</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'top', label: 'Ust', icon: '▲' },
                { id: 'center', label: 'Orta', icon: '⬜' },
                { id: 'bottom', label: 'Alt', icon: '▼' }
              ].map(align => (
                <button
                  key={align.id}
                  onClick={() => updateContent({ verticalAlignment: align.id as any })}
                  className={`p-3 rounded-lg text-center transition-all ${
                    content.verticalAlignment === align.id
                      ? 'bg-sage-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="block text-lg mb-1">{align.icon}</span>
                  <span className="text-xs">{align.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Container Settings */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Container Ayarlari</label>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Minimum Yukseklik</label>
              <select
                value={content.minHeight}
                onChange={(e) => updateContent({ minHeight: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="auto">Otomatik</option>
                <option value="200px">200px</option>
                <option value="300px">300px</option>
                <option value="400px">400px</option>
                <option value="500px">500px</option>
                <option value="100vh">Tam Ekran</option>
                <option value="50vh">Yarım Ekran</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Maksimum Genislik</label>
              <select
                value={content.maxWidth}
                onChange={(e) => updateContent({ maxWidth: e.target.value as any })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="sm">SM (640px)</option>
                <option value="md">MD (768px)</option>
                <option value="lg">LG (1024px)</option>
                <option value="xl">XL (1280px)</option>
                <option value="2xl">2XL (1536px)</option>
                <option value="full">Tam Genislik</option>
                <option value="custom">Ozel</option>
              </select>
            </div>
          </div>

          {content.maxWidth === 'custom' && (
            <div>
              <label className="block text-xs text-slate-500 mb-1">Ozel Genislik</label>
              <input
                type="text"
                value={content.customMaxWidth || ''}
                onChange={(e) => updateContent({ customMaxWidth: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="1200px, 80%, vb."
              />
            </div>
          )}
        </div>
      </div>

      {/* Padding */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Ic Bosluk (Padding)</label>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Ust</label>
            <select
              value={content.padding.top}
              onChange={(e) => updateContent({ padding: { ...content.padding, top: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="0">0</option>
              <option value="1rem">1rem (16px)</option>
              <option value="2rem">2rem (32px)</option>
              <option value="3rem">3rem (48px)</option>
              <option value="4rem">4rem (64px)</option>
              <option value="5rem">5rem (80px)</option>
              <option value="6rem">6rem (96px)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Alt</label>
            <select
              value={content.padding.bottom}
              onChange={(e) => updateContent({ padding: { ...content.padding, bottom: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="0">0</option>
              <option value="1rem">1rem (16px)</option>
              <option value="2rem">2rem (32px)</option>
              <option value="3rem">3rem (48px)</option>
              <option value="4rem">4rem (64px)</option>
              <option value="5rem">5rem (80px)</option>
              <option value="6rem">6rem (96px)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Sol</label>
            <select
              value={content.padding.left}
              onChange={(e) => updateContent({ padding: { ...content.padding, left: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="0">0</option>
              <option value="1rem">1rem (16px)</option>
              <option value="2rem">2rem (32px)</option>
              <option value="3rem">3rem (48px)</option>
              <option value="4rem">4rem (64px)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Sag</label>
            <select
              value={content.padding.right}
              onChange={(e) => updateContent({ padding: { ...content.padding, right: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="0">0</option>
              <option value="1rem">1rem (16px)</option>
              <option value="2rem">2rem (32px)</option>
              <option value="3rem">3rem (48px)</option>
              <option value="4rem">4rem (64px)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Margin */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Dis Bosluk (Margin)</label>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Ust Margin</label>
            <select
              value={content.margin.top}
              onChange={(e) => updateContent({ margin: { ...content.margin, top: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="0">0</option>
              <option value="1rem">1rem</option>
              <option value="2rem">2rem</option>
              <option value="3rem">3rem</option>
              <option value="4rem">4rem</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Alt Margin</label>
            <select
              value={content.margin.bottom}
              onChange={(e) => updateContent({ margin: { ...content.margin, bottom: e.target.value } })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="0">0</option>
              <option value="1rem">1rem</option>
              <option value="2rem">2rem</option>
              <option value="3rem">3rem</option>
              <option value="4rem">4rem</option>
            </select>
          </div>
        </div>
      </div>

      {/* Decoration Element */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Dekorasyon Ogesi</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.showDecoration}
              onChange={(e) => updateContent({ showDecoration: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Goster</span>
          </label>
        </div>

        {content.showDecoration && (
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">Tip</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'image', label: 'Gorsel' },
                  { id: 'icon', label: 'Icon' },
                  { id: 'shape', label: 'Sekil' },
                  { id: 'illustration', label: 'Illustrasyon' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => updateDecoration({ type: type.id as any })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.decoration?.type === type.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {content.decoration?.type === 'image' && (
              <div>
                <label className="block text-xs text-slate-500 mb-1">Gorsel URL</label>
                <input
                  type="text"
                  value={content.decoration?.imageUrl || ''}
                  onChange={(e) => updateDecoration({ imageUrl: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="https://..."
                />
              </div>
            )}

            {content.decoration?.type === 'icon' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Icon</label>
                  <input
                    type="text"
                    value={content.decoration?.icon || ''}
                    onChange={(e) => updateDecoration({ icon: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                    placeholder="star, heart, check"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Icon Rengi</label>
                  <input
                    type="color"
                    value={content.decoration?.iconColor || '#ffffff'}
                    onChange={(e) => updateDecoration({ iconColor: e.target.value })}
                    className="w-full h-10 rounded border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>
            )}

            {content.decoration?.type === 'shape' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-500 mb-2">Sekil</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'circle', label: '●' },
                      { id: 'square', label: '■' },
                      { id: 'blob', label: '◉' },
                      { id: 'triangle', label: '▲' }
                    ].map(shape => (
                      <button
                        key={shape.id}
                        onClick={() => updateDecoration({ shape: shape.id as any })}
                        className={`p-2 rounded-lg text-lg transition-all ${
                          content.decoration?.shape === shape.id
                            ? 'bg-sage-500 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {shape.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-slate-500 mb-1">Sekil Rengi</label>
                  <input
                    type="color"
                    value={content.decoration?.shapeColor || 'rgba(255,255,255,0.1)'}
                    onChange={(e) => updateDecoration({ shapeColor: e.target.value })}
                    className="w-full h-10 rounded border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-2">Pozisyon</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'left', label: 'Sol' },
                    { id: 'right', label: 'Sag' },
                    { id: 'background', label: 'Arka' }
                  ].map(pos => (
                    <button
                      key={pos.id}
                      onClick={() => updateDecoration({ position: pos.id as any })}
                      className={`p-2 rounded-lg text-xs font-medium transition-all ${
                        content.decoration?.position === pos.id
                          ? 'bg-sage-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2">Animasyon</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: 'Yok' },
                    { id: 'float', label: 'Float' },
                    { id: 'pulse', label: 'Pulse' },
                    { id: 'rotate', label: 'Rotate' },
                    { id: 'bounce', label: 'Bounce' }
                  ].map(anim => (
                    <button
                      key={anim.id}
                      onClick={() => updateDecoration({ animation: anim.id as any })}
                      className={`p-2 rounded-lg text-xs font-medium transition-all ${
                        content.decoration?.animation === anim.id
                          ? 'bg-sage-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {anim.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Opaklık: {content.decoration?.opacity ?? 100}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={content.decoration?.opacity ?? 100}
                  onChange={(e) => updateDecoration({ opacity: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Blur: {content.decoration?.blur ?? 0}px
                </label>
                <input
                  type="range"
                  min="0"
                  max="20"
                  value={content.decoration?.blur ?? 0}
                  onChange={(e) => updateDecoration({ blur: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Box Shadow */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Kutu Golgesi</label>
        <div className="grid grid-cols-6 gap-2">
          {['none', 'sm', 'md', 'lg', 'xl', '2xl'].map(shadow => (
            <button
              key={shadow}
              onClick={() => updateContent({ boxShadow: shadow as any })}
              className={`p-3 rounded-lg text-center transition-all ${
                content.boxShadow === shadow
                  ? 'bg-sage-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span className="text-xs font-medium">{shadow === 'none' ? 'Yok' : shadow.toUpperCase()}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
