'use client'

import { WhatsAppSettings } from '../types'

interface DisplayTabProps {
  settings: WhatsAppSettings
  updateDisplay: (field: keyof WhatsAppSettings['display'], value: any) => void
}

export function DisplayTab({ settings, updateDisplay }: DisplayTabProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-charcoal">Auf Mobilgeräten anzeigen</h4>
            <p className="text-sm text-gray-500">Button auf Smartphones und Tablets</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.display.showOnMobile}
              onChange={(e) => updateDisplay('showOnMobile', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-charcoal">Auf Desktop anzeigen</h4>
            <p className="text-sm text-gray-500">Button auf Computern</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.display.showOnDesktop}
              onChange={(e) => updateDisplay('showOnDesktop', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <h4 className="font-medium text-charcoal">Auf allen Seiten anzeigen</h4>
            <p className="text-sm text-gray-500">Button auf jeder Seite der Website</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.display.showOnAllPages}
              onChange={(e) => updateDisplay('showOnAllPages', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Verzögerung vor Anzeige (ms)
        </label>
        <input
          type="number"
          value={settings.display.showAfterDelay}
          onChange={(e) => updateDisplay('showAfterDelay', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          min="0"
          step="500"
        />
        <p className="text-sm text-gray-500 mt-2">
          0 = Sofort anzeigen. Button erscheint nach dieser Verzögerung.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Nach Scroll-Prozentsatz anzeigen (%)
        </label>
        <input
          type="number"
          value={settings.display.showAfterScroll}
          onChange={(e) => updateDisplay('showAfterScroll', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          min="0"
          max="100"
        />
        <p className="text-sm text-gray-500 mt-2">
          0 = Sofort anzeigen. Button erscheint nach diesem Scroll-Prozentsatz.
        </p>
      </div>
    </div>
  )
}
