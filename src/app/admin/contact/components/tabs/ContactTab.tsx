'use client'

import { ContactSettings } from '../types'

interface ContactTabProps {
  settings: ContactSettings
  handleInputChange: (section: keyof ContactSettings, field: string, value: any) => void
}

export function ContactTab({ settings, handleInputChange }: ContactTabProps) {
  return (
    <div className="space-y-6">
      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Telefonnummer
        </label>
        <input
          type="tel"
          value={settings.contact.phone}
          onChange={(e) => handleInputChange('contact', 'phone', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="+49 221 12345678"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          E-Mail-Adresse
        </label>
        <input
          type="email"
          value={settings.contact.email}
          onChange={(e) => handleInputChange('contact', 'email', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="info@wellnesstal.de"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          WhatsApp Nummer
        </label>
        <input
          type="tel"
          value={settings.contact.whatsapp}
          onChange={(e) => handleInputChange('contact', 'whatsapp', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="+49 221 12345678"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
        <p
          className="text-sm mt-2"
          style={{
            color: settings.styles?.helpText?.color,
            fontFamily: settings.styles?.helpText?.fontFamily
          }}
        >
          Diese Nummer wird für den WhatsApp-Button verwendet
        </p>
      </div>
    </div>
  )
}
