'use client'

import { PricingContent, PricingPackageStyle, PricingResponsive } from '../../types'
import { PRICING_LAYOUT_OPTIONS, SHADOW_OPTIONS, HOVER_EFFECT_OPTIONS } from './defaults'

interface LayoutTabProps {
  content: PricingContent
  updateContent: (updates: Partial<PricingContent>) => void
}

const defaultPackageStyle: PricingPackageStyle = {
  backgroundColor: '#ffffff',
  borderColor: '#e2e8f0',
  borderWidth: 1,
  borderRadius: '1rem',
  shadowSize: 'md',
  hoverEffect: 'lift'
}

const defaultResponsive: PricingResponsive = {
  desktop: { columns: 3, gap: '2rem', padding: '4rem' },
  tablet: { columns: 2, gap: '1.5rem', padding: '3rem' },
  mobile: { columns: 1, gap: '1rem', padding: '2rem', stackPackages: true }
}

const defaultPadding = { top: '4rem', bottom: '4rem' }

export default function LayoutTab({ content, updateContent }: LayoutTabProps) {
  const packageStyle = content.defaultPackageStyle || defaultPackageStyle
  const responsive = content.responsive || defaultResponsive
  const padding = content.padding || defaultPadding

  const updateDefaultStyle = (updates: Partial<PricingPackageStyle>) => {
    updateContent({
      defaultPackageStyle: { ...packageStyle, ...updates }
    })
  }

  const updateResponsive = (
    breakpoint: 'desktop' | 'tablet' | 'mobile',
    updates: Partial<PricingResponsive[typeof breakpoint]>
  ) => {
    updateContent({
      responsive: {
        ...responsive,
        [breakpoint]: { ...responsive[breakpoint], ...updates }
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Layout Type */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-sage-100 rounded-lg flex items-center justify-center text-sage-600">📐</span>
          Düzen Tipi
        </h3>

        <div className="grid grid-cols-3 gap-3">
          {PRICING_LAYOUT_OPTIONS.map(layout => (
            <button
              key={layout.id}
              onClick={() => updateContent({ layout: layout.id as PricingContent['layout'] })}
              className={`p-3 rounded-xl border text-center transition-all ${
                content.layout === layout.id
                  ? 'border-sage-500 bg-sage-50 shadow-sm'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <span className="text-2xl block mb-1">{layout.icon}</span>
              <span className="text-xs font-medium text-slate-700">{layout.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Container Settings */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">📦</span>
          Konteyner
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Maksimum Genişlik</label>
            <div className="flex gap-2">
              {(['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const).map(size => (
                <button
                  key={size}
                  onClick={() => updateContent({ maxWidth: size })}
                  className={`flex-1 py-2 rounded-lg text-xs font-medium uppercase ${
                    content.maxWidth === size
                      ? 'bg-sage-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Üst Padding</label>
              <input
                type="text"
                value={padding.top}
                onChange={(e) => updateContent({ padding: { ...padding, top: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Alt Padding</label>
              <input
                type="text"
                value={padding.bottom}
                onChange={(e) => updateContent({ padding: { ...padding, bottom: e.target.value } })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1.5">Paket Arası Boşluk</label>
            <input
              type="text"
              value={content.packageGap ?? '2rem'}
              onChange={(e) => updateContent({ packageGap: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="2rem"
            />
          </div>
        </div>
      </div>

      {/* Default Package Style */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">🎨</span>
          Varsayılan Paket Stili
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Arkaplan</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={content.defaultPackageStyle?.backgroundColor ?? '#ffffff'}
                  onChange={(e) => updateDefaultStyle({ backgroundColor: e.target.value })}
                  className="w-10 h-9 rounded border border-slate-200"
                />
                <input
                  type="text"
                  value={content.defaultPackageStyle?.backgroundColor ?? '#ffffff'}
                  onChange={(e) => updateDefaultStyle({ backgroundColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Kenarlık</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={content.defaultPackageStyle?.borderColor ?? '#e2e8f0'}
                  onChange={(e) => updateDefaultStyle({ borderColor: e.target.value })}
                  className="w-10 h-9 rounded border border-slate-200"
                />
                <input
                  type="text"
                  value={content.defaultPackageStyle?.borderColor ?? '#e2e8f0'}
                  onChange={(e) => updateDefaultStyle({ borderColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Köşe Yuvarlaklığı</label>
              <input
                type="text"
                value={content.defaultPackageStyle?.borderRadius ?? '1rem'}
                onChange={(e) => updateDefaultStyle({ borderRadius: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Kenarlık Kalınlığı</label>
              <input
                type="number"
                value={content.defaultPackageStyle?.borderWidth ?? 1}
                onChange={(e) => updateDefaultStyle({ borderWidth: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                min={0}
                max={10}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Gölge</label>
              <select
                value={content.defaultPackageStyle?.shadowSize ?? 'md'}
                onChange={(e) => updateDefaultStyle({ shadowSize: e.target.value as 'none' | 'sm' | 'md' | 'lg' | 'xl' })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {SHADOW_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Hover Efekti</label>
              <select
                value={content.defaultPackageStyle?.hoverEffect ?? 'lift'}
                onChange={(e) => updateDefaultStyle({ hoverEffect: e.target.value as 'none' | 'lift' | 'scale' | 'glow' | 'border' })}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              >
                {HOVER_EFFECT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Fiyat Rengi</label>
              <input
                type="color"
                value={content.defaultPackageStyle?.priceColor ?? '#059669'}
                onChange={(e) => updateDefaultStyle({ priceColor: e.target.value })}
                className="w-full h-9 rounded border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Check İkonu</label>
              <input
                type="color"
                value={content.defaultPackageStyle?.checkmarkColor ?? '#059669'}
                onChange={(e) => updateDefaultStyle({ checkmarkColor: e.target.value })}
                className="w-full h-9 rounded border border-slate-200"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">Özellik Metni</label>
              <input
                type="color"
                value={content.defaultPackageStyle?.featureTextColor ?? '#4b5563'}
                onChange={(e) => updateDefaultStyle({ featureTextColor: e.target.value })}
                className="w-full h-9 rounded border border-slate-200"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Settings */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <span className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600">📱</span>
          Responsive Ayarları
        </h3>

        {/* Desktop */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-xs font-medium text-slate-600 mb-3">🖥️ Desktop (1024px+)</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Kolon</label>
              <select
                value={responsive.desktop.columns}
                onChange={(e) => updateResponsive('desktop', { columns: parseInt(e.target.value) as 1 | 2 | 3 | 4 })}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Boşluk</label>
              <input
                type="text"
                value={responsive.desktop.gap}
                onChange={(e) => updateResponsive('desktop', { gap: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Padding</label>
              <input
                type="text"
                value={responsive.desktop.padding}
                onChange={(e) => updateResponsive('desktop', { padding: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* Tablet */}
        <div className="mb-4 p-3 bg-slate-50 rounded-lg">
          <p className="text-xs font-medium text-slate-600 mb-3">📱 Tablet (768px+)</p>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Kolon</label>
              <select
                value={responsive.tablet.columns}
                onChange={(e) => updateResponsive('tablet', { columns: parseInt(e.target.value) as 1 | 2 | 3 })}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Boşluk</label>
              <input
                type="text"
                value={responsive.tablet.gap}
                onChange={(e) => updateResponsive('tablet', { gap: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Padding</label>
              <input
                type="text"
                value={responsive.tablet.padding}
                onChange={(e) => updateResponsive('tablet', { padding: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
              />
            </div>
          </div>
        </div>

        {/* Mobile */}
        <div className="p-3 bg-slate-50 rounded-lg">
          <p className="text-xs font-medium text-slate-600 mb-3">📱 Mobil</p>
          <div className="grid grid-cols-3 gap-3 mb-3">
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Kolon</label>
              <select
                value={responsive.mobile.columns}
                onChange={(e) => updateResponsive('mobile', { columns: parseInt(e.target.value) as 1 | 2 })}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Boşluk</label>
              <input
                type="text"
                value={responsive.mobile.gap}
                onChange={(e) => updateResponsive('mobile', { gap: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-500 mb-1">Padding</label>
              <input
                type="text"
                value={responsive.mobile.padding}
                onChange={(e) => updateResponsive('mobile', { padding: e.target.value })}
                className="w-full px-2 py-1.5 border border-slate-200 rounded text-xs"
              />
            </div>
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={responsive.mobile.stackPackages}
              onChange={(e) => updateResponsive('mobile', { stackPackages: e.target.checked })}
              className="rounded border-slate-300 text-sage-500"
            />
            <span className="text-xs text-slate-600">Paketleri Alt Alta Göster</span>
          </label>
        </div>
      </div>
    </div>
  )
}
