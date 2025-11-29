'use client'

import { WhatsAppSettings } from '../types'

interface CtaTabProps {
  settings: WhatsAppSettings
  updateCtaBubble: (field: keyof WhatsAppSettings['ctaBubble'], value: any) => void
}

export function CtaTab({ settings, updateCtaBubble }: CtaTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
        <div>
          <h4 className="font-medium text-charcoal">CTA Bubble aktivieren</h4>
          <p className="text-sm text-gray-500">Aufmerksamkeitsstarke Nachrichtenblase</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.ctaBubble.enabled}
            onChange={(e) => updateCtaBubble('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      {settings.ctaBubble.enabled && (
        <>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Titel
            </label>
            <input
              type="text"
              value={settings.ctaBubble.title}
              onChange={(e) => updateCtaBubble('title', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Bubble Titel..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Nachricht
            </label>
            <textarea
              rows={3}
              value={settings.ctaBubble.message}
              onChange={(e) => updateCtaBubble('message', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Bubble Nachricht..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Hintergrundfarbe
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.ctaBubble.backgroundColor}
                  onChange={(e) => updateCtaBubble('backgroundColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.ctaBubble.backgroundColor}
                  onChange={(e) => updateCtaBubble('backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Titel Farbe
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.ctaBubble.titleColor}
                  onChange={(e) => updateCtaBubble('titleColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.ctaBubble.titleColor}
                  onChange={(e) => updateCtaBubble('titleColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Text Farbe
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.ctaBubble.textColor}
                  onChange={(e) => updateCtaBubble('textColor', e.target.value)}
                  className="w-12 h-12 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={settings.ctaBubble.textColor}
                  onChange={(e) => updateCtaBubble('textColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Anzeige Verzögerung (ms)
            </label>
            <input
              type="number"
              value={settings.ctaBubble.showAfterDelay}
              onChange={(e) => updateCtaBubble('showAfterDelay', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min="0"
              step="500"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
              <h4 className="font-medium text-charcoal">Schließbar</h4>
              <p className="text-sm text-gray-500">Besucher können die Bubble schließen</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.ctaBubble.dismissable}
                onChange={(e) => updateCtaBubble('dismissable', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </>
      )}
    </div>
  )
}
