'use client'

import { WhatsAppSettings } from '../types'

interface AvailabilityTabProps {
  settings: WhatsAppSettings
  updateAvailability: (field: keyof WhatsAppSettings['availability'], value: any) => void
}

export function AvailabilityTab({ settings, updateAvailability }: AvailabilityTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Verfügbarkeitsmodus
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { value: 'always-online', label: 'Immer Online', icon: '🟢', desc: 'Immer als online anzeigen' },
            { value: 'always-offline', label: 'Immer Offline', icon: '🔴', desc: 'Immer als offline anzeigen' },
            { value: 'based-on-hours', label: 'Nach Öffnungszeiten', icon: '🕐', desc: 'Status basierend auf Öffnungszeiten' },
            { value: 'manual', label: 'Manuell', icon: '✋', desc: 'Manuell ein-/ausschalten' }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => updateAvailability('mode', option.value)}
              className={`p-4 border-2 rounded-xl text-left transition-all ${
                settings.availability.mode === option.value
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{option.icon}</span>
                <div>
                  <div className="font-medium text-charcoal">{option.label}</div>
                  <div className="text-xs text-gray-500">{option.desc}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {settings.availability.mode === 'manual' && (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div>
            <h4 className="font-medium text-charcoal">Manueller Status</h4>
            <p className="text-sm text-gray-500">Aktuellen Online-Status festlegen</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.availability.manualStatus}
              onChange={(e) => updateAvailability('manualStatus', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-red-400 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-medium text-charcoal">Status-Indikator anzeigen</h4>
          <p className="text-sm text-gray-500">Grüner/roter Punkt am Button</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.availability.showIndicator}
            onChange={(e) => updateAvailability('showIndicator', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      {/* Colors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Online Farbe
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.availability.onlineColor}
              onChange={(e) => updateAvailability('onlineColor', e.target.value)}
              className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={settings.availability.onlineColor}
              onChange={(e) => updateAvailability('onlineColor', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Offline Farbe
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="color"
              value={settings.availability.offlineColor}
              onChange={(e) => updateAvailability('offlineColor', e.target.value)}
              className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
            />
            <input
              type="text"
              value={settings.availability.offlineColor}
              onChange={(e) => updateAvailability('offlineColor', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Offline Nachricht
        </label>
        <textarea
          rows={2}
          value={settings.availability.offlineMessage}
          onChange={(e) => updateAvailability('offlineMessage', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Nachricht, wenn offline..."
        />
      </div>
    </div>
  )
}
