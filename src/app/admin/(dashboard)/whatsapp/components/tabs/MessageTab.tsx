'use client'

import { WhatsAppSettings } from '../types'

interface MessageTabProps {
  settings: WhatsAppSettings
  updateMessage: (field: keyof WhatsAppSettings['message'], value: any) => void
}

export function MessageTab({ settings, updateMessage }: MessageTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Standard Nachricht
        </label>
        <textarea
          rows={4}
          value={settings.message.defaultMessage}
          onChange={(e) => updateMessage('defaultMessage', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Nachricht, die beim Öffnen von WhatsApp vorausgefüllt wird..."
        />
        <p className="text-sm text-gray-500 mt-2">
          Diese Nachricht wird automatisch eingefügt, wenn der Kunde auf den Button klickt.
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Tooltip Text
        </label>
        <input
          type="text"
          value={settings.message.tooltipText}
          onChange={(e) => updateMessage('tooltipText', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="Text, der beim Hover angezeigt wird..."
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Tooltip Verzögerung (ms)
        </label>
        <input
          type="number"
          value={settings.message.tooltipDelay}
          onChange={(e) => updateMessage('tooltipDelay', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          min="0"
          step="100"
        />
      </div>

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-medium text-charcoal">Tooltip beim Laden anzeigen</h4>
          <p className="text-sm text-gray-500">Tooltip automatisch beim Seitenaufruf anzeigen</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.message.showTooltipOnLoad}
            onChange={(e) => updateMessage('showTooltipOnLoad', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Tooltip nach X ms automatisch anzeigen
        </label>
        <input
          type="number"
          value={settings.message.autoShowTooltipAfter}
          onChange={(e) => updateMessage('autoShowTooltipAfter', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          min="0"
          step="500"
        />
        <p className="text-sm text-gray-500 mt-2">
          0 = Deaktiviert. Tooltip wird nach dieser Zeit automatisch angezeigt.
        </p>
      </div>
    </div>
  )
}
