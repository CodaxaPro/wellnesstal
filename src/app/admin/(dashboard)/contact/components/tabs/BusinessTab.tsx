'use client'

import { StyleEditor } from '../StyleEditor'
import { ContactSettings, ContactStyles, TextStyle } from '../types'

interface BusinessTabProps {
  settings: ContactSettings
  handleInputChange: (section: keyof ContactSettings, field: string, value: any) => void
  expandedStyleEditors: { [key: string]: boolean }
  toggleStyleEditor: (key: string) => void
  updateStyleField: (styleKey: keyof ContactStyles, field: keyof TextStyle, value: string) => void
}

export function BusinessTab({
  settings,
  handleInputChange,
  expandedStyleEditors,
  toggleStyleEditor,
  updateStyleField
}: BusinessTabProps) {
  return (
    <div className="space-y-6">
      {/* Live Preview Card */}
      <div className="bg-gradient-to-br from-sage-50 to-white p-6 rounded-2xl border border-sage-200">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">👁️</span>
          <span className="text-sm font-medium text-sage-700">Live-Vorschau</span>
        </div>
        <div className="space-y-2">
          <h3 style={{
            fontFamily: settings.styles?.businessName?.fontFamily,
            fontSize: settings.styles?.businessName?.fontSize,
            fontWeight: settings.styles?.businessName?.fontWeight as any,
            color: settings.styles?.businessName?.color
          }}>
            {settings.businessInfo.name}
          </h3>
          <p style={{
            fontFamily: settings.styles?.tagline?.fontFamily,
            fontSize: settings.styles?.tagline?.fontSize,
            fontWeight: settings.styles?.tagline?.fontWeight as any,
            color: settings.styles?.tagline?.color
          }}>
            {settings.businessInfo.tagline}
          </p>
          <p style={{
            fontFamily: settings.styles?.description?.fontFamily,
            fontSize: settings.styles?.description?.fontSize,
            fontWeight: settings.styles?.description?.fontWeight as any,
            color: settings.styles?.description?.color
          }}>
            {settings.businessInfo.description}
          </p>
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
          Geschäftsname
        </label>
        <input
          type="text"
          value={settings.businessInfo.name}
          onChange={(e) => handleInputChange('businessInfo', 'name', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
        <StyleEditor
          styleKey="businessName"
          label="Geschäftsname Stil"
          style={settings.styles?.businessName}
          expandedStyleEditors={expandedStyleEditors}
          toggleStyleEditor={toggleStyleEditor}
          updateStyleField={updateStyleField}
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
          Tagline
        </label>
        <input
          type="text"
          value={settings.businessInfo.tagline}
          onChange={(e) => handleInputChange('businessInfo', 'tagline', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="z.B. Premium Wellness & Headspa in Baesweiler"
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
        <StyleEditor
          styleKey="tagline"
          label="Tagline Stil"
          style={settings.styles?.tagline}
          expandedStyleEditors={expandedStyleEditors}
          toggleStyleEditor={toggleStyleEditor}
          updateStyleField={updateStyleField}
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
          Beschreibung
        </label>
        <textarea
          rows={4}
          value={settings.businessInfo.description}
          onChange={(e) => handleInputChange('businessInfo', 'description', e.target.value)}
          className="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Kurze Beschreibung Ihres Unternehmens..."
          style={{
            borderColor: settings.styles?.input?.borderColor,
            color: settings.styles?.input?.color
          }}
        />
        <StyleEditor
          styleKey="description"
          label="Beschreibung Stil"
          style={settings.styles?.description}
          expandedStyleEditors={expandedStyleEditors}
          toggleStyleEditor={toggleStyleEditor}
          updateStyleField={updateStyleField}
        />
      </div>
    </div>
  )
}
