'use client'

import { ContactSettings } from '../types'

interface SeoTabProps {
  settings: ContactSettings
  handleInputChange: (section: keyof ContactSettings, field: string, value: any) => void
  handleKeywordChange: (keywords: string) => void
}

export function SeoTab({ settings, handleInputChange, handleKeywordChange }: SeoTabProps) {
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
          Meta Titel
        </label>
        <input
          type="text"
          value={settings.seo.metaTitle}
          onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Wellnesstal - Premium Wellness & Headspa in Baesweiler"
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
          {settings.seo.metaTitle.length}/60 Zeichen (optimal: 50-60)
        </p>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Meta Beschreibung
        </label>
        <textarea
          rows={3}
          value={settings.seo.metaDescription}
          onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Entspannung und Wellness in Baesweiler. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden."
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
          {settings.seo.metaDescription.length}/160 Zeichen (optimal: 120-160)
        </p>
      </div>

      <div>
        <label
          className="block text-sm font-medium mb-2"
          style={{
            color: settings.styles?.label?.color,
            fontFamily: settings.styles?.label?.fontFamily
          }}
        >
          Schlüsselwörter
        </label>
        <input
          type="text"
          value={settings.seo.keywords.join(', ')}
          onChange={(e) => handleKeywordChange(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="wellness, headspa, massage, baesweiler, entspannung"
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
          Trennen Sie Keywords mit Kommas (empfohlen: 5-10 Keywords)
        </p>
      </div>
    </div>
  )
}
