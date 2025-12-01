'use client'

import { FeaturesContent, FeaturesCardStyles, FeaturesIconStyles } from '../../types'

interface CardStyleTabProps {
  content: FeaturesContent
  updateContent: (updates: Partial<FeaturesContent>) => void
}

export default function CardStyleTab({ content, updateContent }: CardStyleTabProps) {
  const updateCardStyles = (updates: Partial<FeaturesCardStyles>) => {
    updateContent({ cardStyles: { ...content.cardStyles, ...updates } })
  }

  const updateIconStyles = (updates: Partial<FeaturesIconStyles>) => {
    updateContent({ iconStyles: { ...content.iconStyles, ...updates } })
  }

  return (
    <div className="space-y-6">
      {/* Card Background */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Kart Arkaplanı</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Normal</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.cardStyles?.backgroundColor || '#ffffff'}
                onChange={(e) => updateCardStyles({ backgroundColor: e.target.value })}
                className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.cardStyles?.backgroundColor || '#ffffff'}
                onChange={(e) => updateCardStyles({ backgroundColor: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Hover</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.cardStyles?.backgroundHover || '#f8fafc'}
                onChange={(e) => updateCardStyles({ backgroundHover: e.target.value })}
                className="w-12 h-12 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.cardStyles?.backgroundHover || '#f8fafc'}
                onChange={(e) => updateCardStyles({ backgroundHover: e.target.value })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>
        </div>
        {/* Quick Colors */}
        <div className="flex gap-2 mt-3">
          {['#ffffff', '#f8fafc', '#f1f5f9', '#fef3c7', '#dbeafe', '#dcfce7', '#fae8ff'].map(color => (
            <button
              key={color}
              onClick={() => updateCardStyles({ backgroundColor: color })}
              className={`w-8 h-8 rounded-lg border transition-all ${
                content.cardStyles?.backgroundColor === color ? 'ring-2 ring-sage-500 ring-offset-2' : 'border-slate-200'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Card Border */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Kart Kenarlık</label>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Stil</label>
            <select
              value={content.cardStyles?.borderStyle || 'solid'}
              onChange={(e) => updateCardStyles({ borderStyle: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              <option value="none">Yok</option>
              <option value="solid">Düz</option>
              <option value="dashed">Kesikli</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Kalınlık: {content.cardStyles?.borderWidth || 1}px</label>
            <input
              type="range"
              min="0"
              max="4"
              value={content.cardStyles?.borderWidth || 1}
              onChange={(e) => updateCardStyles({ borderWidth: parseInt(e.target.value) })}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Renk</label>
            <input
              type="color"
              value={content.cardStyles?.borderColor || '#e2e8f0'}
              onChange={(e) => updateCardStyles({ borderColor: e.target.value })}
              className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs text-slate-500 mb-2">Köşe Yuvarlaklığı</label>
          <div className="grid grid-cols-6 gap-2">
            {['0', '0.25rem', '0.5rem', '0.75rem', '1rem', '1.5rem'].map(radius => (
              <button
                key={radius}
                onClick={() => updateCardStyles({ borderRadius: radius })}
                className={`p-2 rounded-lg border text-center text-xs transition-all ${
                  content.cardStyles?.borderRadius === radius
                    ? 'border-sage-500 bg-sage-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {radius}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Card Shadow */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Gölge</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">Normal</label>
            <div className="grid grid-cols-3 gap-2">
              {['none', 'sm', 'md', 'lg', 'xl', '2xl'].map(shadow => (
                <button
                  key={shadow}
                  onClick={() => updateCardStyles({ shadow: shadow as any })}
                  className={`p-2 rounded-lg border text-center text-xs transition-all ${
                    content.cardStyles?.shadow === shadow
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {shadow}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-2">Hover</label>
            <div className="grid grid-cols-3 gap-2">
              {['none', 'sm', 'md', 'lg', 'xl', '2xl'].map(shadow => (
                <button
                  key={shadow}
                  onClick={() => updateCardStyles({ shadowHover: shadow as any })}
                  className={`p-2 rounded-lg border text-center text-xs transition-all ${
                    content.cardStyles?.shadowHover === shadow
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {shadow}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Hover Effect */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Hover Efekti</label>
        <div className="grid grid-cols-3 gap-3">
          {[
            { id: 'none', label: 'Yok', icon: '—' },
            { id: 'lift', label: 'Kaldır', icon: '↑' },
            { id: 'scale', label: 'Büyüt', icon: '⊕' },
            { id: 'glow', label: 'Işıltı', icon: '✨' },
            { id: 'border-color', label: 'Kenarlık', icon: '◻' },
            { id: 'bg-color', label: 'Arkaplan', icon: '■' },
          ].map(effect => (
            <button
              key={effect.id}
              onClick={() => updateCardStyles({ hoverEffect: effect.id as any })}
              className={`p-3 rounded-xl border-2 transition-all ${
                content.cardStyles?.hoverEffect === effect.id
                  ? 'border-sage-500 bg-sage-50'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-xl text-center">{effect.icon}</div>
              <div className="text-xs text-slate-600 text-center mt-1">{effect.label}</div>
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-xs text-slate-500 mb-1">
            Geçiş Süresi: {content.cardStyles?.hoverTransitionDuration || 300}ms
          </label>
          <input
            type="range"
            min="100"
            max="800"
            step="50"
            value={content.cardStyles?.hoverTransitionDuration || 300}
            onChange={(e) => updateCardStyles({ hoverTransitionDuration: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
          />
        </div>
      </div>

      {/* Card Padding */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Kart İç Boşluk</label>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">Yatay (X)</label>
            <select
              value={content.cardStyles?.paddingX || '1.5rem'}
              onChange={(e) => updateCardStyles({ paddingX: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0.5rem', '1rem', '1.5rem', '2rem', '2.5rem', '3rem'].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-2">Dikey (Y)</label>
            <select
              value={content.cardStyles?.paddingY || '2rem'}
              onChange={(e) => updateCardStyles({ paddingY: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            >
              {['0.5rem', '1rem', '1.5rem', '2rem', '2.5rem', '3rem'].map(val => (
                <option key={val} value={val}>{val}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-xs text-slate-500 mb-2">İçerik Boşluğu (Gap)</label>
          <select
            value={content.cardStyles?.contentGap || '1rem'}
            onChange={(e) => updateCardStyles({ contentGap: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          >
            {['0.5rem', '0.75rem', '1rem', '1.25rem', '1.5rem', '2rem'].map(val => (
              <option key={val} value={val}>{val}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Icon Styles */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">İkon Stilleri</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.iconStyles?.showIcons ?? true}
              onChange={(e) => updateIconStyles({ showIcons: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">İkonları Göster</span>
          </label>
        </div>

        {content.iconStyles?.showIcons && (
          <div className="space-y-4">
            {/* Icon Position */}
            <div>
              <label className="block text-xs text-slate-500 mb-2">Konum</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'top', label: 'Üstte' },
                  { id: 'left', label: 'Solda' },
                  { id: 'right', label: 'Sağda' },
                  { id: 'inline-title', label: 'Başlıkla' },
                ].map(pos => (
                  <button
                    key={pos.id}
                    onClick={() => updateIconStyles({ position: pos.id as any })}
                    className={`p-2 rounded-lg border text-center text-xs transition-all ${
                      content.iconStyles?.position === pos.id
                        ? 'border-sage-500 bg-sage-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Icon Size & Shape */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-2">Boyut</label>
                <div className="grid grid-cols-4 gap-2">
                  {['sm', 'md', 'lg', 'xl'].map(size => (
                    <button
                      key={size}
                      onClick={() => updateIconStyles({ size: size as any })}
                      className={`p-2 rounded-lg border text-center text-xs transition-all ${
                        content.iconStyles?.size === size
                          ? 'border-sage-500 bg-sage-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {size.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2">Şekil</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'circle', label: '●' },
                    { id: 'square', label: '■' },
                    { id: 'rounded', label: '◼' },
                    { id: 'none', label: '—' },
                  ].map(shape => (
                    <button
                      key={shape.id}
                      onClick={() => updateIconStyles({ shape: shape.id as any })}
                      className={`p-2 rounded-lg border text-center text-xl transition-all ${
                        content.iconStyles?.shape === shape.id
                          ? 'border-sage-500 bg-sage-50'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {shape.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Icon Colors */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Arkaplan Rengi</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.iconStyles?.backgroundColor || '#10b981'}
                    onChange={(e) => updateIconStyles({ backgroundColor: e.target.value })}
                    className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <div className="flex gap-1">
                    {['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#1e293b'].map(color => (
                      <button
                        key={color}
                        onClick={() => updateIconStyles({ backgroundColor: color })}
                        className="w-7 h-7 rounded-md border border-slate-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">İkon Rengi</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.iconStyles?.iconColor || '#ffffff'}
                    onChange={(e) => updateIconStyles({ iconColor: e.target.value })}
                    className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <div className="flex gap-1">
                    {['#ffffff', '#000000', '#10b981', '#3b82f6', '#f59e0b'].map(color => (
                      <button
                        key={color}
                        onClick={() => updateIconStyles({ iconColor: color })}
                        className="w-7 h-7 rounded-md border border-slate-200"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Icon Shadow & Border */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-2">Gölge</label>
                <select
                  value={content.iconStyles?.shadow || 'none'}
                  onChange={(e) => updateIconStyles({ shadow: e.target.value as any })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="none">Yok</option>
                  <option value="sm">Küçük</option>
                  <option value="md">Orta</option>
                  <option value="lg">Büyük</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2">Kenarlık</label>
                <input
                  type="number"
                  value={content.iconStyles?.borderWidth || 0}
                  onChange={(e) => updateIconStyles({ borderWidth: parseInt(e.target.value) })}
                  min="0"
                  max="4"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2">Kenarlık Rengi</label>
                <input
                  type="color"
                  value={content.iconStyles?.borderColor || 'transparent'}
                  onChange={(e) => updateIconStyles({ borderColor: e.target.value })}
                  className="w-full h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
              </div>
            </div>

            {/* Icon Hover Animation */}
            <div>
              <label className="block text-xs text-slate-500 mb-2">Hover Animasyonu</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'none', label: 'Yok' },
                  { id: 'bounce', label: 'Zıpla' },
                  { id: 'rotate', label: 'Döndür' },
                  { id: 'scale', label: 'Büyüt' },
                  { id: 'shake', label: 'Salla' },
                ].map(anim => (
                  <button
                    key={anim.id}
                    onClick={() => updateIconStyles({ hoverAnimation: anim.id as any })}
                    className={`p-2 rounded-lg border text-center text-xs transition-all ${
                      content.iconStyles?.hoverAnimation === anim.id
                        ? 'border-sage-500 bg-sage-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {anim.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Card Style Presets */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Hazır Stiller</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: 'Minimal',
              cardStyles: {
                backgroundColor: '#ffffff',
                borderStyle: 'none' as const,
                borderWidth: 0,
                shadow: 'none' as const,
                hoverEffect: 'none' as const
              }
            },
            {
              label: 'Modern',
              cardStyles: {
                backgroundColor: '#ffffff',
                borderStyle: 'solid' as const,
                borderWidth: 1,
                borderColor: '#e2e8f0',
                shadow: 'sm' as const,
                shadowHover: 'md' as const,
                hoverEffect: 'lift' as const,
                borderRadius: '1rem'
              }
            },
            {
              label: 'Glassmorphism',
              cardStyles: {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                borderStyle: 'solid' as const,
                borderWidth: 1,
                borderColor: 'rgba(255, 255, 255, 0.5)',
                shadow: 'lg' as const,
                borderRadius: '1.5rem'
              }
            },
            {
              label: 'Bold',
              cardStyles: {
                backgroundColor: '#1e293b',
                borderStyle: 'none' as const,
                shadow: 'xl' as const,
                hoverEffect: 'scale' as const,
                borderRadius: '0.5rem'
              }
            },
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => updateContent({ cardStyles: { ...content.cardStyles, ...preset.cardStyles } })}
              className="p-4 rounded-xl border border-slate-200 hover:border-sage-500 hover:bg-sage-50 transition-all text-center"
            >
              <div className="text-sm font-medium text-slate-700">{preset.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
