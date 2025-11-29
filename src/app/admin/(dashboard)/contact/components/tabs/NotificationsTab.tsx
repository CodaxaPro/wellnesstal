'use client'

import { ContactSettings } from '../types'

interface NotificationsTabProps {
  settings: ContactSettings
  handleInputChange: (section: keyof ContactSettings, field: string, value: any) => void
}

export function NotificationsTab({ settings, handleInputChange }: NotificationsTabProps) {
  return (
    <div className="space-y-6">
      <h3
        className="text-lg font-semibold mb-4"
        style={{
          color: settings.styles?.sectionTitle?.color,
          fontFamily: settings.styles?.sectionTitle?.fontFamily
        }}
      >
        Benachrichtigungseinstellungen
      </h3>

      <div className="space-y-4">
        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => handleInputChange('notifications', 'emailNotifications', e.target.checked)}
            className="rounded border-gray-300 text-sage-600"
          />
          <div>
            <div
              className="font-medium"
              style={{
                color: settings.styles?.label?.color,
                fontFamily: settings.styles?.label?.fontFamily
              }}
            >
              E-Mail-Benachrichtigungen
            </div>
            <div
              className="text-sm"
              style={{
                color: settings.styles?.helpText?.color,
                fontFamily: settings.styles?.helpText?.fontFamily
              }}
            >
              Erhalten Sie E-Mails für neue Kontaktanfragen
            </div>
          </div>
        </label>

        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={settings.notifications.smsNotifications}
            onChange={(e) => handleInputChange('notifications', 'smsNotifications', e.target.checked)}
            className="rounded border-gray-300 text-sage-600"
          />
          <div>
            <div
              className="font-medium"
              style={{
                color: settings.styles?.label?.color,
                fontFamily: settings.styles?.label?.fontFamily
              }}
            >
              SMS-Benachrichtigungen
            </div>
            <div
              className="text-sm"
              style={{
                color: settings.styles?.helpText?.color,
                fontFamily: settings.styles?.helpText?.fontFamily
              }}
            >
              Erhalten Sie SMS für dringende Anfragen
            </div>
          </div>
        </label>

        <label className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
          <input
            type="checkbox"
            checked={settings.notifications.bookingConfirmations}
            onChange={(e) => handleInputChange('notifications', 'bookingConfirmations', e.target.checked)}
            className="rounded border-gray-300 text-sage-600"
          />
          <div>
            <div
              className="font-medium"
              style={{
                color: settings.styles?.label?.color,
                fontFamily: settings.styles?.label?.fontFamily
              }}
            >
              Buchungsbestätigungen
            </div>
            <div
              className="text-sm"
              style={{
                color: settings.styles?.helpText?.color,
                fontFamily: settings.styles?.helpText?.fontFamily
              }}
            >
              Automatische Bestätigungen für Terminbuchungen senden
            </div>
          </div>
        </label>
      </div>
    </div>
  )
}
