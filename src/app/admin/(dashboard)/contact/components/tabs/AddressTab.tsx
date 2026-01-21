'use client'

import { ContactSettings } from '../types'

interface AddressTabProps {
  settings: ContactSettings
  handleInputChange: (section: keyof ContactSettings, field: string, value: string | number | boolean | string[]) => void
}

export function AddressTab({ settings, handleInputChange }: AddressTabProps) {
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
          Straße und Hausnummer
        </label>
        <input
          type="text"
          value={settings.address.street}
          onChange={(e) => handleInputChange('address', 'street', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Reyplatz 10"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{
              color: settings.styles?.label?.color,
              fontFamily: settings.styles?.label?.fontFamily
            }}
          >
            Postleitzahl
          </label>
          <input
            type="text"
            value={settings.address.postalCode}
            onChange={(e) => handleInputChange('address', 'postalCode', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            placeholder="52499"
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
            Stadt
          </label>
          <input
            type="text"
            value={settings.address.city}
            onChange={(e) => handleInputChange('address', 'city', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            placeholder="Baesweiler"
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
            Land
          </label>
          <input
            type="text"
            value={settings.address.country}
            onChange={(e) => handleInputChange('address', 'country', e.target.value)}
            className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            placeholder="Deutschland"
            style={{
              borderColor: settings.styles?.input?.borderColor,
              color: settings.styles?.input?.color
            }}
          />
        </div>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Google Maps URL
        </label>
        <input
          type="url"
          value={settings.address.googleMapsUrl}
          onChange={(e) => handleInputChange('address', 'googleMapsUrl', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="https://maps.google.com/?q=..."
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
          Link zu Ihrem Standort auf Google Maps
        </p>
      </div>
    </div>
  )
}
