'use client'

import { WhatsAppContent } from '../../types'
import { SIZE_OPTIONS, BORDER_RADIUS_OPTIONS } from './defaults'

interface AppearanceTabProps {
  content: WhatsAppContent
  updateContent: (updates: Partial<WhatsAppContent>) => void
}

export default function AppearanceTab({ content, updateContent }: AppearanceTabProps) {
  const updateAppearance = (field: keyof WhatsAppContent['appearance'], value: any) => {
    updateContent({
      appearance: { ...content.appearance, [field]: value }
    })
  }

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700">Renkler</h4>
        <div className="space-y-4">
          {/* Button Color */}
          <div>
            <label className="block text-xs text-slate-600 mb-1">Buton Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.appearance.buttonColor}
                onChange={(e) => updateAppearance('buttonColor', e.target.value)}
                className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.appearance.buttonColor}
                onChange={(e) => updateAppearance('buttonColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="#25D366"
              />
            </div>
          </div>

          {/* Hover Color */}
          <div>
            <label className="block text-xs text-slate-600 mb-1">Hover Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.appearance.buttonHoverColor}
                onChange={(e) => updateAppearance('buttonHoverColor', e.target.value)}
                className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.appearance.buttonHoverColor}
                onChange={(e) => updateAppearance('buttonHoverColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="#20BA5A"
              />
            </div>
          </div>

          {/* Icon Color */}
          <div>
            <label className="block text-xs text-slate-600 mb-1">Ikon Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.appearance.iconColor}
                onChange={(e) => updateAppearance('iconColor', e.target.value)}
                className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.appearance.iconColor}
                onChange={(e) => updateAppearance('iconColor', e.target.value)}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="#FFFFFF"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Boyut</label>
        <div className="grid grid-cols-3 gap-3">
          {SIZE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateAppearance('size', option.id)}
              className={`p-3 border-2 rounded-xl text-center transition-all ${
                content.appearance.size === option.id
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Kose Yuvarlatligi</label>
        <div className="grid grid-cols-3 gap-3">
          {BORDER_RADIUS_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateAppearance('borderRadius', option.id)}
              className={`p-3 border-2 rounded-xl text-center transition-all ${
                content.appearance.borderRadius === option.id
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700">Efektler</h4>

        {/* Shadow */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <div>
            <span className="font-medium text-slate-700">Golge</span>
            <p className="text-xs text-slate-500">Butona golge efekti ekle</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={content.appearance.shadow}
              onChange={(e) => updateAppearance('shadow', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        {/* Pulse Animation */}
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <div>
            <span className="font-medium text-slate-700">Nabiz Animasyonu</span>
            <p className="text-xs text-slate-500">Dikkat cekici titresim efekti</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={content.appearance.pulseAnimation}
              onChange={(e) => updateAppearance('pulseAnimation', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </div>
    </div>
  )
}
