'use client'

import { ContactSettings, ContactStyles, TextStyle } from '../types'
import { StyleEditor } from '../StyleEditor'

interface StylesTabProps {
  settings: ContactSettings
  handleResetStyles: () => void
  expandedStyleEditors: { [key: string]: boolean }
  toggleStyleEditor: (key: string) => void
  updateStyleField: (styleKey: keyof ContactStyles, field: keyof TextStyle, value: string) => void
}

export function StylesTab({
  settings,
  handleResetStyles,
  expandedStyleEditors,
  toggleStyleEditor,
  updateStyleField
}: StylesTabProps) {
  return (
    <div className="space-y-6">
      {/* Reset Button */}
      <div className="flex justify-between items-center">
        <h3
          className="text-lg font-semibold"
          style={{
            color: settings.styles?.sectionTitle?.color,
            fontFamily: settings.styles?.sectionTitle?.fontFamily
          }}
        >
          Design-Einstellungen
        </h3>
        <button
          onClick={handleResetStyles}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sage-700 bg-sage-100 rounded-lg hover:bg-sage-200 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Orijinale Dön
        </button>
      </div>

      <div className="bg-sage-50 border border-sage-200 rounded-xl p-4 mb-6">
        <div className="flex items-start space-x-3">
          <div className="text-sage-600">💡</div>
          <div>
            <h4 className="text-sm font-medium text-sage-900">Hinweis</h4>
            <p className="text-sm text-sage-700 mt-1">
              Hier können Sie das Erscheinungsbild der Kontaktseite anpassen. Die Änderungen werden sofort in der Vorschau angezeigt.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Seitenlayout</h4>

        <StyleEditor
          styleKey="pageTitle"
          label="Seitentitel"
          style={settings.styles?.pageTitle}
          expandedStyleEditors={expandedStyleEditors}
          toggleStyleEditor={toggleStyleEditor}
          updateStyleField={updateStyleField}
        />

        <StyleEditor
          styleKey="sectionTitle"
          label="Abschnittstitel"
          style={settings.styles?.sectionTitle}
          expandedStyleEditors={expandedStyleEditors}
          toggleStyleEditor={toggleStyleEditor}
          updateStyleField={updateStyleField}
        />
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Navigation</h4>

        <StyleEditor
          styleKey="tabActive"
          label="Aktiver Tab"
          style={settings.styles?.tabActive}
          showBackground
          expandedStyleEditors={expandedStyleEditors}
          toggleStyleEditor={toggleStyleEditor}
          updateStyleField={updateStyleField}
        />

        <StyleEditor
          styleKey="tabInactive"
          label="Inaktiver Tab"
          style={settings.styles?.tabInactive}
          expandedStyleEditors={expandedStyleEditors}
          toggleStyleEditor={toggleStyleEditor}
          updateStyleField={updateStyleField}
        />
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Formularelemente</h4>

        <StyleEditor
          styleKey="label"
          label="Label-Text"
          style={settings.styles?.label}
          expandedStyleEditors={expandedStyleEditors}
          toggleStyleEditor={toggleStyleEditor}
          updateStyleField={updateStyleField}
        />

        <StyleEditor
          styleKey="input"
          label="Eingabefelder"
          style={settings.styles?.input}
          showBorder
          expandedStyleEditors={expandedStyleEditors}
          toggleStyleEditor={toggleStyleEditor}
          updateStyleField={updateStyleField}
        />

        <StyleEditor
          styleKey="helpText"
          label="Hilfetext"
          style={settings.styles?.helpText}
          expandedStyleEditors={expandedStyleEditors}
          toggleStyleEditor={toggleStyleEditor}
          updateStyleField={updateStyleField}
        />
      </div>

      <div className="space-y-4 pt-4 border-t">
        <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Aktionen</h4>

        <StyleEditor
          styleKey="saveButton"
          label="Speichern-Button"
          style={settings.styles?.saveButton}
          showBackground
          expandedStyleEditors={expandedStyleEditors}
          toggleStyleEditor={toggleStyleEditor}
          updateStyleField={updateStyleField}
        />
      </div>
    </div>
  )
}
