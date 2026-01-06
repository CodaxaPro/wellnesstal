'use client'

import { ContactSettings } from '../types'

interface SocialTabProps {
  settings: ContactSettings
  handleInputChange: (section: keyof ContactSettings, field: string, value: any) => void
}

export function SocialTab({ settings, handleInputChange }: SocialTabProps) {
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
          Instagram URL
        </label>
        <input
          type="url"
          value={settings.socialMedia.instagram}
          onChange={(e) => handleInputChange('socialMedia', 'instagram', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="https://instagram.com/wellnesstal"
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
          Facebook URL
        </label>
        <input
          type="url"
          value={settings.socialMedia.facebook}
          onChange={(e) => handleInputChange('socialMedia', 'facebook', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="https://facebook.com/wellnesstal"
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
          WhatsApp Business URL
        </label>
        <input
          type="url"
          value={settings.socialMedia.whatsapp}
          onChange={(e) => handleInputChange('socialMedia', 'whatsapp', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="https://wa.me/491733828581"
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
          Website URL
        </label>
        <input
          type="url"
          value={settings.socialMedia.website}
          onChange={(e) => handleInputChange('socialMedia', 'website', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="https://wellnesstal.de"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
      </div>
    </div>
  )
}
