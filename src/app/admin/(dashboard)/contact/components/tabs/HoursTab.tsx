'use client'

import { dayNames } from '../constants'
import { ContactSettings } from '../types'

interface HoursTabProps {
  settings: ContactSettings
  handleOpeningHoursChange: (day: string, field: string, value: any) => void
}

export function HoursTab({ settings, handleOpeningHoursChange }: HoursTabProps) {
  return (
    <div className="space-y-6">
      <h3
        className="text-lg font-semibold mb-4"
        style={{
          color: settings.styles?.sectionTitle?.color,
          fontFamily: settings.styles?.sectionTitle?.fontFamily
        }}
      >
        Öffnungszeiten verwalten
      </h3>

      <div className="space-y-4">
        {dayNames.map((day) => (
          <div key={day.key} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
            <div
              className="w-24 text-sm font-medium"
              style={{
                color: settings.styles?.label?.color,
                fontFamily: settings.styles?.label?.fontFamily
              }}
            >
              {day.label}
            </div>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.openingHours[day.key]?.closed || false}
                onChange={(e) => handleOpeningHoursChange(day.key, 'closed', e.target.checked)}
                className="rounded border-gray-300 text-sage-600 mr-2"
              />
              <span className="text-sm">Geschlossen</span>
            </label>

            {!settings.openingHours[day.key]?.closed && (
              <>
                <div className="flex items-center space-x-2">
                  <input
                    type="time"
                    value={settings.openingHours[day.key]?.open || '09:00'}
                    onChange={(e) => handleOpeningHoursChange(day.key, 'open', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 text-sm"
                  />
                  <span className="text-gray-400">-</span>
                  <input
                    type="time"
                    value={settings.openingHours[day.key]?.close || '19:00'}
                    onChange={(e) => handleOpeningHoursChange(day.key, 'close', e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 text-sm"
                  />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-start space-x-3">
          <div className="text-blue-600">ℹ️</div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Hinweis</h4>
            <p className="text-sm text-blue-700 mt-1">
              Diese Öffnungszeiten werden auf Ihrer Website und in den Kontaktinformationen angezeigt.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
