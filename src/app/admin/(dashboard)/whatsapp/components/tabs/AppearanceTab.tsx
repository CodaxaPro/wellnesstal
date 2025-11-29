'use client'

import { WhatsAppSettings } from '../types'

interface AppearanceTabProps {
  settings: WhatsAppSettings
  updateAppearance: (field: keyof WhatsAppSettings['appearance'], value: any) => void
}

export function AppearanceTab({ settings, updateAppearance }: AppearanceTabProps) {
  if (settings.basic.useOriginalStyle) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start space-x-3">
            <div className="text-yellow-600">⚠️</div>
            <div>
              <h4 className="text-sm font-medium text-yellow-900">Originalstil aktiv</h4>
              <p className="text-sm text-yellow-700 mt-1">
                Sie verwenden den Originalstil. Um Anpassungen vorzunehmen, deaktivieren Sie bitte &quot;Originalstil verwenden&quot; in den Grundeinstellungen.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Button Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Button Farbe
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.appearance.buttonColor}
              onChange={(e) => updateAppearance('buttonColor', e.target.value)}
              className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={settings.appearance.buttonColor}
              onChange={(e) => updateAppearance('buttonColor', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Hover Farbe
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.appearance.buttonHoverColor}
              onChange={(e) => updateAppearance('buttonHoverColor', e.target.value)}
              className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={settings.appearance.buttonHoverColor}
              onChange={(e) => updateAppearance('buttonHoverColor', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Icon Farbe
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.appearance.iconColor}
              onChange={(e) => updateAppearance('iconColor', e.target.value)}
              className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={settings.appearance.iconColor}
              onChange={(e) => updateAppearance('iconColor', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Size */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Button Größe
        </label>
        <div className="grid grid-cols-3 gap-4">
          {['small', 'medium', 'large'].map((size) => (
            <button
              key={size}
              onClick={() => updateAppearance('size', size)}
              className={`p-4 border-2 rounded-xl text-center transition-all ${
                settings.appearance.size === size
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <span className="text-sm font-medium capitalize">
                {size === 'small' ? 'Klein' : size === 'medium' ? 'Mittel' : 'Groß'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Border Radius */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Eckenradius
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { value: 'full', label: 'Rund', icon: '⚫' },
            { value: 'rounded', label: 'Abgerundet', icon: '🔲' },
            { value: 'square', label: 'Eckig', icon: '⬛' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateAppearance('borderRadius', option.value)}
              className={`p-4 border-2 rounded-xl text-center transition-all ${
                settings.appearance.borderRadius === option.value
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-charcoal">Schatten</h4>
            <p className="text-sm text-gray-500">Button-Schatten anzeigen</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.appearance.shadow}
              onChange={(e) => updateAppearance('shadow', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-charcoal">Puls-Animation</h4>
            <p className="text-sm text-gray-500">Aufmerksamkeit erregende Animation</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.appearance.pulseAnimation}
              onChange={(e) => updateAppearance('pulseAnimation', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </div>
    </div>
  )
}
