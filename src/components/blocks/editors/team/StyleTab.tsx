'use client'

import { TeamContent, TeamCardStyle, TeamImageStyle, TeamSocialStyle, TeamTypography } from '../../types'

import {
  IMAGE_SHAPE_OPTIONS,
  IMAGE_SIZE_OPTIONS,
  SHADOW_OPTIONS,
  HOVER_EFFECT_OPTIONS,
  SOCIAL_POSITION_OPTIONS,
  ICON_SIZE_OPTIONS
} from './defaults'

interface StyleTabProps {
  content: TeamContent
  updateContent: (updates: Partial<TeamContent>) => void
}

// Default typography
const defaultTypography: TeamTypography = {
  name: { fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', lineHeight: '1.4' },
  role: { fontSize: '0.95rem', fontWeight: '500', color: '#86a789', lineHeight: '1.5' },
  bio: { fontSize: '0.875rem', fontWeight: '400', color: '#64748b', lineHeight: '1.6', maxLines: 3 },
  quote: { fontSize: '0.875rem', fontWeight: '400', fontStyle: 'italic', color: '#64748b', lineHeight: '1.5', borderColor: '#86a789', borderWidth: '2px' }
}

export default function StyleTab({ content, updateContent }: StyleTabProps) {
  const cardStyle = content.cardStyle || {}
  const imageStyle = content.imageStyle || {}
  const socialStyle = content.socialStyle || {}
  const typography: TeamTypography = {
    name: { ...defaultTypography.name, ...content.typography?.name },
    role: { ...defaultTypography.role, ...content.typography?.role },
    bio: { ...defaultTypography.bio, ...content.typography?.bio },
    quote: { ...defaultTypography.quote, ...content.typography?.quote }
  }

  const updateCardStyle = (updates: Partial<TeamCardStyle>) => {
    updateContent({ cardStyle: { ...cardStyle, ...updates } })
  }

  const updateImageStyle = (updates: Partial<TeamImageStyle>) => {
    updateContent({ imageStyle: { ...imageStyle, ...updates } })
  }

  const updateSocialStyle = (updates: Partial<TeamSocialStyle>) => {
    updateContent({ socialStyle: { ...socialStyle, ...updates } })
  }

  const updateTypography = (section: keyof TeamTypography, updates: Record<string, string | number | undefined>) => {
    updateContent({
      typography: {
        ...typography,
        [section]: {
          ...(typography[section] || {}),
          ...updates
        }
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Card Style */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Kart Stili</h3>
        <div className="space-y-4">
          {/* Background Color */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Arkaplan Rengi</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={cardStyle.backgroundColor || '#ffffff'}
                  onChange={(e) => updateCardStyle({ backgroundColor: e.target.value })}
                  className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={cardStyle.backgroundColor || '#ffffff'}
                  onChange={(e) => updateCardStyle({ backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Hover Arkaplan</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={cardStyle.backgroundHover || '#f8fafc'}
                  onChange={(e) => updateCardStyle({ backgroundHover: e.target.value })}
                  className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={cardStyle.backgroundHover || '#f8fafc'}
                  onChange={(e) => updateCardStyle({ backgroundHover: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          {/* Border */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Border Stili</label>
              <select
                value={cardStyle.borderStyle || 'solid'}
                onChange={(e) => updateCardStyle({ borderStyle: e.target.value as TeamCardStyle['borderStyle'] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                <option value="none">Yok</option>
                <option value="solid">Solid</option>
                <option value="dashed">Dashed</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Border Kalinligi</label>
              <input
                type="number"
                value={cardStyle.borderWidth ?? 1}
                onChange={(e) => updateCardStyle({ borderWidth: parseInt(e.target.value) })}
                min={0}
                max={10}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Border Rengi</label>
              <input
                type="color"
                value={cardStyle.borderColor || '#e2e8f0'}
                onChange={(e) => updateCardStyle({ borderColor: e.target.value })}
                className="w-full h-10 rounded border border-slate-200 cursor-pointer"
              />
            </div>
          </div>

          {/* Border Radius & Shadow */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Kose Yuvarlakligi</label>
              <input
                type="text"
                value={cardStyle.borderRadius || '1rem'}
                onChange={(e) => updateCardStyle({ borderRadius: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="1rem"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Golge</label>
              <select
                value={cardStyle.shadow || 'md'}
                onChange={(e) => updateCardStyle({ shadow: e.target.value as TeamCardStyle['shadow'] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {SHADOW_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Hover Effect */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Hover Efekti</label>
              <select
                value={cardStyle.hoverEffect || 'lift'}
                onChange={(e) => updateCardStyle({ hoverEffect: e.target.value as TeamCardStyle['hoverEffect'] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {HOVER_EFFECT_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Gecis Suresi (ms)</label>
              <input
                type="number"
                value={cardStyle.hoverTransitionDuration ?? 300}
                onChange={(e) => updateCardStyle({ hoverTransitionDuration: parseInt(e.target.value) })}
                min={0}
                max={2000}
                step={50}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          {/* Padding & Alignment */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Padding</label>
              <input
                type="text"
                value={cardStyle.padding || '1.5rem'}
                onChange={(e) => updateCardStyle({ padding: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                placeholder="1.5rem"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Icerik Hizalama</label>
              <div className="flex gap-2">
                {(['left', 'center', 'right'] as const).map((align) => (
                  <button
                    key={align}
                    onClick={() => updateCardStyle({ contentAlignment: align })}
                    className={`flex-1 py-2 text-sm rounded-lg border transition-colors ${
                      cardStyle.contentAlignment === align
                        ? 'bg-sage-500 text-white border-sage-500'
                        : 'bg-white text-slate-600 border-slate-200'
                    }`}
                  >
                    {align === 'left' ? 'Sol' : align === 'center' ? 'Orta' : 'Sag'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Style */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Resim Stili</h3>
        <div className="space-y-4">
          {/* Shape & Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Sekil</label>
              <select
                value={imageStyle.shape || 'circle'}
                onChange={(e) => updateImageStyle({ shape: e.target.value as TeamImageStyle['shape'] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {IMAGE_SHAPE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Boyut</label>
              <select
                value={imageStyle.size || 'lg'}
                onChange={(e) => updateImageStyle({ size: e.target.value as TeamImageStyle['size'] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {IMAGE_SIZE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Border */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Border Kalinligi</label>
              <input
                type="number"
                value={imageStyle.borderWidth ?? 0}
                onChange={(e) => updateImageStyle({ borderWidth: parseInt(e.target.value) })}
                min={0}
                max={10}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Border Rengi</label>
              <input
                type="color"
                value={imageStyle.borderColor || '#e2e8f0'}
                onChange={(e) => updateImageStyle({ borderColor: e.target.value })}
                className="w-full h-10 rounded border border-slate-200 cursor-pointer"
              />
            </div>
          </div>

          {/* Effects */}
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={imageStyle.grayscale === true}
                onChange={(e) => updateImageStyle({ grayscale: e.target.checked })}
                className="w-4 h-4 text-sage-600 rounded"
              />
              <span className="text-sm text-slate-700">Siyah-Beyaz</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={imageStyle.grayscaleHover === true}
                onChange={(e) => updateImageStyle({ grayscaleHover: e.target.checked })}
                className="w-4 h-4 text-sage-600 rounded"
              />
              <span className="text-sm text-slate-700">Hover'da Renkli</span>
            </label>
          </div>

          {/* Hover Scale */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Hover Zoom: {(imageStyle.hoverScale || 1.05).toFixed(2)}x
            </label>
            <input
              type="range"
              value={(imageStyle.hoverScale || 1.05) * 100}
              onChange={(e) => updateImageStyle({ hoverScale: parseInt(e.target.value) / 100 })}
              min={100}
              max={130}
              className="w-full"
            />
          </div>

          {/* Initials Style */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Baş Harf Arkaplan</label>
              <input
                type="color"
                value={imageStyle.initialsBackgroundColor || '#86a789'}
                onChange={(e) => updateImageStyle({ initialsBackgroundColor: e.target.value })}
                className="w-full h-10 rounded border border-slate-200 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Baş Harf Rengi</label>
              <input
                type="color"
                value={imageStyle.initialsTextColor || '#ffffff'}
                onChange={(e) => updateImageStyle({ initialsTextColor: e.target.value })}
                className="w-full h-10 rounded border border-slate-200 cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Social Style */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Sosyal Medya Stili</h3>
        <div className="space-y-4">
          {/* Position & Size */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Pozisyon</label>
              <select
                value={socialStyle.position || 'below-info'}
                onChange={(e) => updateSocialStyle({ position: e.target.value as TeamSocialStyle['position'] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {SOCIAL_POSITION_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Ikon Boyutu</label>
              <select
                value={socialStyle.iconSize || 'md'}
                onChange={(e) => updateSocialStyle({ iconSize: e.target.value as TeamSocialStyle['iconSize'] })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {ICON_SIZE_OPTIONS.map((option) => (
                  <option key={option.id} value={option.id}>{option.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Ikon Rengi</label>
              <input
                type="color"
                value={socialStyle.iconColor || '#64748b'}
                onChange={(e) => updateSocialStyle({ iconColor: e.target.value })}
                className="w-full h-10 rounded border border-slate-200 cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Hover Rengi</label>
              <input
                type="color"
                value={socialStyle.iconHoverColor || '#86a789'}
                onChange={(e) => updateSocialStyle({ iconHoverColor: e.target.value })}
                className="w-full h-10 rounded border border-slate-200 cursor-pointer"
              />
            </div>
          </div>

          {/* Gap */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">Ikon Araligi</label>
            <input
              type="text"
              value={socialStyle.gap || '0.75rem'}
              onChange={(e) => updateSocialStyle({ gap: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="0.75rem"
            />
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Tipografi</h3>
        <div className="space-y-4">
          {/* Name Typography */}
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-2 uppercase">Isim</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Boyut</label>
                <input
                  type="text"
                  value={typography.name?.fontSize || '1.25rem'}
                  onChange={(e) => updateTypography('name', { fontSize: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Kalinlik</label>
                <select
                  value={typography.name?.fontWeight || '600'}
                  onChange={(e) => updateTypography('name', { fontWeight: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                >
                  <option value="400">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">SemiBold</option>
                  <option value="700">Bold</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Renk</label>
                <input
                  type="color"
                  value={typography.name?.color || '#1e293b'}
                  onChange={(e) => updateTypography('name', { color: e.target.value })}
                  className="w-full h-8 rounded border border-slate-200 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Role Typography */}
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-2 uppercase">Pozisyon</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Boyut</label>
                <input
                  type="text"
                  value={typography.role?.fontSize || '0.95rem'}
                  onChange={(e) => updateTypography('role', { fontSize: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Kalinlik</label>
                <select
                  value={typography.role?.fontWeight || '500'}
                  onChange={(e) => updateTypography('role', { fontWeight: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                >
                  <option value="400">Normal</option>
                  <option value="500">Medium</option>
                  <option value="600">SemiBold</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Renk</label>
                <input
                  type="color"
                  value={typography.role?.color || '#86a789'}
                  onChange={(e) => updateTypography('role', { color: e.target.value })}
                  className="w-full h-8 rounded border border-slate-200 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Bio Typography */}
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-2 uppercase">Biyografi</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Boyut</label>
                <input
                  type="text"
                  value={typography.bio?.fontSize || '0.875rem'}
                  onChange={(e) => updateTypography('bio', { fontSize: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Satir Sayisi</label>
                <input
                  type="number"
                  value={typography.bio?.maxLines || 3}
                  onChange={(e) => updateTypography('bio', { maxLines: parseInt(e.target.value) })}
                  min={1}
                  max={10}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Renk</label>
                <input
                  type="color"
                  value={typography.bio?.color || '#64748b'}
                  onChange={(e) => updateTypography('bio', { color: e.target.value })}
                  className="w-full h-8 rounded border border-slate-200 cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Quote Typography */}
          <div>
            <h4 className="text-xs font-medium text-slate-500 mb-2 uppercase">Alinti</h4>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Boyut</label>
                <input
                  type="text"
                  value={typography.quote?.fontSize || '0.875rem'}
                  onChange={(e) => updateTypography('quote', { fontSize: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Stil</label>
                <select
                  value={typography.quote?.fontStyle || 'italic'}
                  onChange={(e) => updateTypography('quote', { fontStyle: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italik</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Renk</label>
                <input
                  type="color"
                  value={typography.quote?.color || '#64748b'}
                  onChange={(e) => updateTypography('quote', { color: e.target.value })}
                  className="w-full h-8 rounded border border-slate-200 cursor-pointer"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div>
                <label className="block text-xs text-slate-600 mb-1">Border Rengi</label>
                <input
                  type="color"
                  value={typography.quote?.borderColor || '#86a789'}
                  onChange={(e) => updateTypography('quote', { borderColor: e.target.value })}
                  className="w-full h-8 rounded border border-slate-200 cursor-pointer"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">Border Kalinligi</label>
                <input
                  type="text"
                  value={typography.quote?.borderWidth || '2px'}
                  onChange={(e) => updateTypography('quote', { borderWidth: e.target.value })}
                  className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                  placeholder="2px"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
