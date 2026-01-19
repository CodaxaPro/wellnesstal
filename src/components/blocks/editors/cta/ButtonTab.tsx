'use client'

import { CTAContent, CTAButton, CTASecondaryButton } from '../../types'

import { BUTTON_STYLE_OPTIONS, BUTTON_SIZE_OPTIONS, HOVER_EFFECT_OPTIONS } from './defaults'

interface ButtonTabProps {
  content: CTAContent
  updateContent: (updates: Partial<CTAContent>) => void
}

export default function ButtonTab({ content, updateContent }: ButtonTabProps) {
  const updatePrimaryButton = (updates: Partial<CTAButton>) => {
    updateContent({
      primaryButton: { ...content.primaryButton, ...updates }
    })
  }

  const updateSecondaryButton = (updates: Partial<CTASecondaryButton>) => {
    updateContent({
      secondaryButton: { ...content.secondaryButton, ...updates } as CTASecondaryButton
    })
  }

  return (
    <div className="space-y-6">
      {/* Primary Button */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Ana Buton</label>

        <div className="space-y-4">
          {/* Text & Link */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Buton Metni</label>
              <input
                type="text"
                value={content.primaryButton.text}
                onChange={(e) => updatePrimaryButton({ text: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="Hemen Baslayın"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1">Link</label>
              <input
                type="text"
                value={content.primaryButton.link}
                onChange={(e) => updatePrimaryButton({ link: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="/iletisim"
              />
            </div>
          </div>

          {/* Style & Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-2">Stil</label>
              <div className="grid grid-cols-3 gap-2">
                {BUTTON_STYLE_OPTIONS.map(style => (
                  <button
                    key={style.id}
                    onClick={() => updatePrimaryButton({ style: style.id as any })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.primaryButton.style === style.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">Boyut</label>
              <div className="grid grid-cols-4 gap-2">
                {BUTTON_SIZE_OPTIONS.map(size => (
                  <button
                    key={size.id}
                    onClick={() => updatePrimaryButton({ size: size.id as any })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.primaryButton.size === size.id
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

          {/* Colors */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <label className="block text-xs font-medium text-slate-600 mb-3">Renkler</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Arkaplan</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.primaryButton.backgroundColor || '#ffffff'}
                    onChange={(e) => updatePrimaryButton({ backgroundColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.primaryButton.backgroundColor || '#ffffff'}
                    onChange={(e) => updatePrimaryButton({ backgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Metin</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.primaryButton.textColor || '#059669'}
                    onChange={(e) => updatePrimaryButton({ textColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.primaryButton.textColor || '#059669'}
                    onChange={(e) => updatePrimaryButton({ textColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Hover Arkaplan</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.primaryButton.hoverBackgroundColor || '#f0fdf4'}
                    onChange={(e) => updatePrimaryButton({ hoverBackgroundColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.primaryButton.hoverBackgroundColor || '#f0fdf4'}
                    onChange={(e) => updatePrimaryButton({ hoverBackgroundColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Hover Metin</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.primaryButton.hoverTextColor || '#047857'}
                    onChange={(e) => updatePrimaryButton({ hoverTextColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.primaryButton.hoverTextColor || '#047857'}
                    onChange={(e) => updatePrimaryButton({ hoverTextColor: e.target.value })}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Border */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <label className="block text-xs font-medium text-slate-600 mb-3">Cerceve</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Renk</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.primaryButton.borderColor || '#ffffff'}
                    onChange={(e) => updatePrimaryButton({ borderColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Kalinlik</label>
                <input
                  type="number"
                  value={content.primaryButton.borderWidth || 0}
                  onChange={(e) => updatePrimaryButton({ borderWidth: parseInt(e.target.value) })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  min="0"
                  max="5"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Kose Yuvarlama</label>
                <select
                  value={content.primaryButton.borderRadius || '0.75rem'}
                  onChange={(e) => updatePrimaryButton({ borderRadius: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                >
                  <option value="0">Kare</option>
                  <option value="0.25rem">XS</option>
                  <option value="0.5rem">S</option>
                  <option value="0.75rem">M</option>
                  <option value="1rem">L</option>
                  <option value="1.5rem">XL</option>
                  <option value="9999px">Tam</option>
                </select>
              </div>
            </div>
          </div>

          {/* Effects */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <label className="block text-xs font-medium text-slate-600 mb-3">Efektler</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-2">Golge</label>
                <div className="grid grid-cols-3 gap-2">
                  {['none', 'sm', 'md', 'lg', 'xl'].map(shadow => (
                    <button
                      key={shadow}
                      onClick={() => updatePrimaryButton({ shadow: shadow as any })}
                      className={`p-2 rounded-lg text-xs font-medium transition-all ${
                        content.primaryButton.shadow === shadow
                          ? 'bg-sage-500 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {shadow === 'none' ? 'Yok' : shadow.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2">Hover Efekti</label>
                <div className="grid grid-cols-3 gap-2">
                  {HOVER_EFFECT_OPTIONS.map(effect => (
                    <button
                      key={effect.id}
                      onClick={() => updatePrimaryButton({ hoverEffect: effect.id as any })}
                      className={`p-2 rounded-lg text-xs font-medium transition-all ${
                        content.primaryButton.hoverEffect === effect.id
                          ? 'bg-sage-500 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {effect.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Icon */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <label className="block text-xs font-medium text-slate-600 mb-3">Icon</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Icon Adi</label>
                <input
                  type="text"
                  value={content.primaryButton.icon || ''}
                  onChange={(e) => updatePrimaryButton({ icon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="arrow-right, check, star"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2">Pozisyon</label>
                <div className="flex gap-2">
                  {[
                    { id: 'left', label: 'Sol' },
                    { id: 'right', label: 'Sag' }
                  ].map(pos => (
                    <button
                      key={pos.id}
                      onClick={() => updatePrimaryButton({ iconPosition: pos.id as any })}
                      className={`flex-1 p-2 rounded-lg text-xs font-medium transition-all ${
                        content.primaryButton.iconPosition === pos.id
                          ? 'bg-sage-500 text-white'
                          : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Animation */}
          <div>
            <label className="block text-xs text-slate-500 mb-2">Buton Animasyonu</label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: 'none', label: 'Yok' },
                { id: 'pulse', label: 'Pulse' },
                { id: 'bounce', label: 'Bounce' },
                { id: 'shake', label: 'Shake' }
              ].map(anim => (
                <button
                  key={anim.id}
                  onClick={() => updatePrimaryButton({ animation: anim.id as any })}
                  className={`p-2 rounded-lg text-xs font-medium transition-all ${
                    content.primaryButton.animation === anim.id
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
      </div>

      {/* Secondary Button */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Ikincil Buton</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.showSecondaryButton}
              onChange={(e) => updateContent({ showSecondaryButton: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Goster</span>
          </label>
        </div>

        {content.showSecondaryButton && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Buton Metni</label>
                <input
                  type="text"
                  value={content.secondaryButton?.text || ''}
                  onChange={(e) => updateSecondaryButton({ text: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="Daha Fazla Bilgi"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Link</label>
                <input
                  type="text"
                  value={content.secondaryButton?.link || ''}
                  onChange={(e) => updateSecondaryButton({ link: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="#"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-500 mb-2">Stil</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'outline', label: 'Outline' },
                  { id: 'ghost', label: 'Ghost' },
                  { id: 'link', label: 'Link' },
                  { id: 'text', label: 'Text' }
                ].map(style => (
                  <button
                    key={style.id}
                    onClick={() => updateSecondaryButton({ style: style.id as any })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.secondaryButton?.style === style.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {style.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Metin Rengi</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.secondaryButton?.textColor || '#ffffff'}
                    onChange={(e) => updateSecondaryButton({ textColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Cerceve Rengi</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.secondaryButton?.borderColor || '#ffffff'}
                    onChange={(e) => updateSecondaryButton({ borderColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Hover Rengi</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.secondaryButton?.hoverColor || '#f0fdf4'}
                    onChange={(e) => updateSecondaryButton({ hoverColor: e.target.value })}
                    className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Icon</label>
                <input
                  type="text"
                  value={content.secondaryButton?.icon || ''}
                  onChange={(e) => updateSecondaryButton({ icon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="arrow-right"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-2">Icon Pozisyonu</label>
                <div className="flex gap-2">
                  {[
                    { id: 'left', label: 'Sol' },
                    { id: 'right', label: 'Sag' }
                  ].map(pos => (
                    <button
                      key={pos.id}
                      onClick={() => updateSecondaryButton({ iconPosition: pos.id as any })}
                      className={`flex-1 p-2 rounded-lg text-xs font-medium transition-all ${
                        content.secondaryButton?.iconPosition === pos.id
                          ? 'bg-sage-500 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {pos.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Button Layout */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Buton Duzeni</label>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">Yerlestirme</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'horizontal', label: 'Yan Yana' },
                { id: 'vertical', label: 'Alt Alta' },
                { id: 'stacked', label: 'Katmanli' }
              ].map(layout => (
                <button
                  key={layout.id}
                  onClick={() => updateContent({ buttonLayout: layout.id as any })}
                  className={`p-3 rounded-lg text-xs font-medium transition-all ${
                    content.buttonLayout === layout.id
                      ? 'bg-sage-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {layout.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1">Buton Arası Bosluk</label>
              <select
                value={content.buttonGap || '1rem'}
                onChange={(e) => updateContent({ buttonGap: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="0.5rem">XS (8px)</option>
                <option value="0.75rem">S (12px)</option>
                <option value="1rem">M (16px)</option>
                <option value="1.5rem">L (24px)</option>
                <option value="2rem">XL (32px)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-2">Hizalama</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'left', label: 'Sol' },
                  { id: 'center', label: 'Orta' },
                  { id: 'right', label: 'Sag' }
                ].map(align => (
                  <button
                    key={align.id}
                    onClick={() => updateContent({ buttonAlignment: align.id as any })}
                    className={`p-2 rounded-lg text-xs font-medium transition-all ${
                      content.buttonAlignment === align.id
                        ? 'bg-sage-500 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {align.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Button Preview */}
      <div className="p-4 bg-slate-100 rounded-xl">
        <label className="block text-xs text-slate-500 mb-3">Onizleme</label>
        <div
          className={`flex ${
            content.buttonLayout === 'vertical' ? 'flex-col' :
            content.buttonLayout === 'stacked' ? 'flex-col sm:flex-row' : 'flex-row'
          } ${
            content.buttonAlignment === 'center' ? 'justify-center' :
            content.buttonAlignment === 'right' ? 'justify-end' : 'justify-start'
          }`}
          style={{ gap: content.buttonGap || '1rem' }}
        >
          <button
            style={{
              backgroundColor: content.primaryButton.backgroundColor,
              color: content.primaryButton.textColor,
              borderRadius: content.primaryButton.borderRadius,
              borderWidth: content.primaryButton.borderWidth ? `${content.primaryButton.borderWidth}px` : '0',
              borderColor: content.primaryButton.borderColor,
              borderStyle: 'solid',
              padding: content.primaryButton.size === 'sm' ? '8px 16px' :
                       content.primaryButton.size === 'md' ? '12px 24px' :
                       content.primaryButton.size === 'lg' ? '16px 32px' : '20px 40px',
              fontSize: content.primaryButton.size === 'sm' ? '0.875rem' :
                        content.primaryButton.size === 'md' ? '1rem' :
                        content.primaryButton.size === 'lg' ? '1.125rem' : '1.25rem',
              fontWeight: 500,
              boxShadow: content.primaryButton.shadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.05)' :
                         content.primaryButton.shadow === 'md' ? '0 4px 6px rgba(0,0,0,0.1)' :
                         content.primaryButton.shadow === 'lg' ? '0 10px 15px rgba(0,0,0,0.1)' :
                         content.primaryButton.shadow === 'xl' ? '0 20px 25px rgba(0,0,0,0.1)' : 'none'
            }}
            className="transition-all"
          >
            {content.primaryButton.icon && content.primaryButton.iconPosition === 'left' && (
              <span className="mr-2">{content.primaryButton.icon}</span>
            )}
            {content.primaryButton.text}
            {content.primaryButton.icon && content.primaryButton.iconPosition === 'right' && (
              <span className="ml-2">{content.primaryButton.icon}</span>
            )}
          </button>

          {content.showSecondaryButton && content.secondaryButton && (
            <button
              style={{
                color: content.secondaryButton.textColor,
                borderColor: content.secondaryButton.borderColor,
                borderWidth: content.secondaryButton.style === 'outline' ? '2px' : '0',
                borderStyle: 'solid',
                padding: '12px 24px',
                backgroundColor: 'transparent',
                fontWeight: 500
              }}
              className="transition-all rounded-lg"
            >
              {content.secondaryButton.icon && content.secondaryButton.iconPosition === 'left' && (
                <span className="mr-2">{content.secondaryButton.icon}</span>
              )}
              {content.secondaryButton.text}
              {content.secondaryButton.icon && content.secondaryButton.iconPosition === 'right' && (
                <span className="ml-2">{content.secondaryButton.icon}</span>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
