'use client'

import { WhatsAppSettings } from '../types'

interface BasicTabProps {
  settings: WhatsAppSettings
  updateBasic: (field: keyof WhatsAppSettings['basic'], value: any) => void
}

export function BasicTab({ settings, updateBasic }: BasicTabProps) {
  return (
    <div className="space-y-6">
      {/* Enabled Toggle */}
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-medium text-charcoal">WhatsApp Button aktivieren</h4>
          <p className="text-sm text-gray-500">Button auf der Website anzeigen</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.basic.enabled}
            onChange={(e) => updateBasic('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      {/* Use Original Style */}
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
        <div>
          <h4 className="font-medium text-charcoal">Originalstil verwenden</h4>
          <p className="text-sm text-gray-500">Standard WhatsApp Button ohne Anpassungen</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.basic.useOriginalStyle}
            onChange={(e) => updateBasic('useOriginalStyle', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          WhatsApp Telefonnummer
        </label>
        <input
          type="tel"
          value={settings.basic.phoneNumber}
          onChange={(e) => updateBasic('phoneNumber', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="+49 221 12345678"
        />
        <p className="text-sm text-gray-500 mt-2">
          Mit Ländervorwahl eingeben (z.B. +49 für Deutschland)
        </p>
      </div>

      {/* Position */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Button Position
        </label>
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => updateBasic('position', 'bottom-right')}
            className={`p-4 border-2 rounded-xl text-center transition-all ${
              settings.basic.position === 'bottom-right'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">↘️</div>
            <span className="text-sm font-medium">Unten rechts</span>
          </button>
          <button
            onClick={() => updateBasic('position', 'bottom-left')}
            className={`p-4 border-2 rounded-xl text-center transition-all ${
              settings.basic.position === 'bottom-left'
                ? 'border-green-500 bg-green-50 text-green-700'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="text-2xl mb-2">↙️</div>
            <span className="text-sm font-medium">Unten links</span>
          </button>
        </div>
      </div>
    </div>
  )
}
