'use client'

import { FeaturesContent, FeaturesAnimations, FeaturesResponsive } from '../../types'
import { getDefaultFeaturesContent } from './defaults'

interface AdvancedTabProps {
  content: FeaturesContent
  updateContent: (updates: Partial<FeaturesContent>) => void
}

export default function AdvancedTab({ content, updateContent }: AdvancedTabProps) {
  const updateAnimations = (updates: Partial<FeaturesAnimations>) => {
    updateContent({ animations: { ...content.animations, ...updates } })
  }

  const updateResponsive = (updates: Partial<FeaturesResponsive>) => {
    updateContent({ responsive: { ...content.responsive, ...updates } })
  }

  return (
    <div className="space-y-6">
      {/* Animations */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-semibold text-slate-700">Animasyonlar</label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.animations?.enabled ?? true}
              onChange={(e) => updateAnimations({ enabled: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-xs text-slate-500">Aktif</span>
          </label>
        </div>

        {content.animations?.enabled && (
          <div className="space-y-4">
            {/* Animation Type */}
            <div>
              <label className="block text-xs text-slate-500 mb-2">Animasyon Tipi</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'none', label: 'Yok' },
                  { id: 'fade', label: 'Fade' },
                  { id: 'slide-up', label: 'Yukarı' },
                  { id: 'slide-left', label: 'Soldan' },
                  { id: 'slide-right', label: 'Sağdan' },
                  { id: 'zoom', label: 'Zoom' },
                  { id: 'flip', label: 'Flip' },
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => updateAnimations({ type: type.id as any })}
                    className={`p-2 rounded-lg border text-center text-xs transition-all ${
                      content.animations?.type === type.id
                        ? 'border-sage-500 bg-sage-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Stagger */}
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.animations?.stagger ?? true}
                  onChange={(e) => updateAnimations({ stagger: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                />
                <span className="text-sm text-slate-600">Kademeli Animasyon</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={content.animations?.triggerOnScroll ?? true}
                  onChange={(e) => updateAnimations({ triggerOnScroll: e.target.checked })}
                  className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
                />
                <span className="text-sm text-slate-600">Scroll ile Tetikle</span>
              </label>
            </div>

            {/* Timing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Gecikme: {content.animations?.staggerDelay || 100}ms
                </label>
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="50"
                  value={content.animations?.staggerDelay || 100}
                  onChange={(e) => updateAnimations({ staggerDelay: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">
                  Süre: {content.animations?.duration || 500}ms
                </label>
                <input
                  type="range"
                  min="200"
                  max="1500"
                  step="100"
                  value={content.animations?.duration || 500}
                  onChange={(e) => updateAnimations({ duration: parseInt(e.target.value) })}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
            </div>

            {/* Icon Animation */}
            <div>
              <label className="block text-xs text-slate-500 mb-2">İkon Animasyonu</label>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { id: 'none', label: 'Yok' },
                  { id: 'bounce', label: 'Zıpla' },
                  { id: 'pulse', label: 'Nabız' },
                  { id: 'spin', label: 'Döndür' },
                  { id: 'wiggle', label: 'Salla' },
                ].map(anim => (
                  <button
                    key={anim.id}
                    onClick={() => updateAnimations({ iconAnimation: anim.id as any })}
                    className={`p-2 rounded-lg border text-center text-xs transition-all ${
                      content.animations?.iconAnimation === anim.id
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

      {/* Responsive Settings */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Responsive Ayarları</label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Desktop */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span>🖥️</span> Masaüstü
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Sütun</label>
                <select
                  value={content.responsive?.desktop || 3}
                  onChange={(e) => updateResponsive({ desktop: parseInt(e.target.value) as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Gap</label>
                <select
                  value={content.responsive?.desktopGap || '2rem'}
                  onChange={(e) => updateResponsive({ desktopGap: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['1rem', '1.5rem', '2rem', '2.5rem', '3rem'].map(gap => (
                    <option key={gap} value={gap}>{gap}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tablet */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span>📱</span> Tablet
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Sütun</label>
                <select
                  value={content.responsive?.tablet || 2}
                  onChange={(e) => updateResponsive({ tablet: parseInt(e.target.value) as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {[1, 2, 3, 4].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Gap</label>
                <select
                  value={content.responsive?.tabletGap || '1.5rem'}
                  onChange={(e) => updateResponsive({ tabletGap: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['0.5rem', '1rem', '1.5rem', '2rem'].map(gap => (
                    <option key={gap} value={gap}>{gap}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="p-3 bg-slate-50 rounded-lg">
            <h4 className="text-xs font-semibold text-slate-600 mb-3 flex items-center gap-2">
              <span>📱</span> Mobil
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-500 mb-1">Sütun</label>
                <select
                  value={content.responsive?.mobile || 1}
                  onChange={(e) => updateResponsive({ mobile: parseInt(e.target.value) as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {[1, 2].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Gap</label>
                <select
                  value={content.responsive?.mobileGap || '1rem'}
                  onChange={(e) => updateResponsive({ mobileGap: e.target.value })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  {['0.5rem', '0.75rem', '1rem', '1.5rem'].map(gap => (
                    <option key={gap} value={gap}>{gap}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-500 mb-1">Kart Stili</label>
                <select
                  value={content.responsive?.mobileCardStyle || 'full'}
                  onChange={(e) => updateResponsive({ mobileCardStyle: e.target.value as any })}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg"
                >
                  <option value="full">Tam</option>
                  <option value="compact">Kompakt</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Options */}
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.responsive?.mobileStackIcons ?? false}
              onChange={(e) => updateResponsive({ mobileStackIcons: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-sm text-slate-600">Mobilde İkonları Üstte</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.responsive?.mobileHideIcons ?? false}
              onChange={(e) => updateResponsive({ mobileHideIcons: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-sm text-slate-600">Mobilde İkonları Gizle</span>
          </label>
        </div>
      </div>

      {/* Header Content */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Başlık İçeriği</label>

        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Bölüm Başlığı</label>
            <input
              type="text"
              value={content.title || ''}
              onChange={(e) => updateContent({ title: e.target.value })}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg"
              placeholder="Özelliklerimiz"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Alt Başlık</label>
            <textarea
              value={content.subtitle || ''}
              onChange={(e) => updateContent({ subtitle: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg resize-none"
              placeholder="Size sunduğumuz avantajları keşfedin..."
            />
          </div>
        </div>
      </div>

      {/* Presets */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Hazır Şablonlar</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: 'Minimal',
              preset: {
                layout: 'grid' as const,
                columns: 3,
                cardStyles: {
                  backgroundColor: 'transparent',
                  borderStyle: 'none' as const,
                  shadow: 'none' as const,
                  hoverEffect: 'none' as const
                },
                iconStyles: {
                  showIcons: true,
                  position: 'top' as const,
                  shape: 'none' as const
                }
              }
            },
            {
              label: 'Modern Card',
              preset: {
                layout: 'grid' as const,
                columns: 3,
                cardStyles: {
                  backgroundColor: '#ffffff',
                  borderStyle: 'solid' as const,
                  borderWidth: 1,
                  borderColor: '#e2e8f0',
                  borderRadius: '1rem',
                  shadow: 'sm' as const,
                  shadowHover: 'lg' as const,
                  hoverEffect: 'lift' as const
                }
              }
            },
            {
              label: 'Icon Left',
              preset: {
                layout: 'icon-left' as const,
                columns: 2,
                iconStyles: {
                  showIcons: true,
                  position: 'left' as const,
                  size: 'lg' as const,
                  shape: 'circle' as const
                }
              }
            },
            {
              label: 'Centered',
              preset: {
                layout: 'centered-stack' as const,
                headerAlignment: 'center' as const,
                cardStyles: {
                  backgroundColor: '#ffffff',
                  borderRadius: '1.5rem',
                  shadow: 'md' as const
                }
              }
            },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => updateContent(item.preset as any)}
              className="p-4 rounded-xl border border-slate-200 hover:border-sage-500 hover:bg-sage-50 transition-all text-center"
            >
              <div className="text-sm font-medium text-slate-700">{item.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom CSS Class */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Özel CSS Sınıfı</label>
        <input
          type="text"
          value={content.customClass || ''}
          onChange={(e) => updateContent({ customClass: e.target.value })}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg font-mono text-sm"
          placeholder="my-custom-class"
        />
        <p className="text-xs text-slate-500 mt-2">
          Özel stiller için ekstra CSS sınıfı ekleyebilirsiniz.
        </p>
      </div>

      {/* Reset All */}
      <div className="p-4 bg-red-50 rounded-xl border border-red-200">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-red-700">Tümünü Sıfırla</h4>
            <p className="text-sm text-red-600">Tüm ayarları varsayılana döndür</p>
          </div>
          <button
            onClick={() => {
              if (confirm('Tüm ayarları sıfırlamak istediğinizden emin misiniz?')) {
                const defaults = getDefaultFeaturesContent()
                updateContent(defaults)
              }
            }}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
          >
            Sıfırla
          </button>
        </div>
      </div>
    </div>
  )
}
