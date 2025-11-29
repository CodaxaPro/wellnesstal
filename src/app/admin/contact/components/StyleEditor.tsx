'use client'

import { TextStyle, ContactStyles } from './types'
import { defaultStyles } from './constants'

interface StyleEditorProps {
  styleKey: keyof ContactStyles
  label: string
  style?: TextStyle
  showBackground?: boolean
  showBorder?: boolean
  expandedStyleEditors: { [key: string]: boolean }
  toggleStyleEditor: (key: string) => void
  updateStyleField: (styleKey: keyof ContactStyles, field: keyof TextStyle, value: string) => void
}

export function StyleEditor({
  styleKey,
  label,
  style,
  showBackground = false,
  showBorder = false,
  expandedStyleEditors,
  toggleStyleEditor,
  updateStyleField
}: StyleEditorProps) {
  const isExpanded = expandedStyleEditors[styleKey] || false
  const currentStyle = style || defaultStyles[styleKey] || {}

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={() => toggleStyleEditor(styleKey)}
        className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-lg">🎨</span>
          <span className="font-medium text-charcoal">{label}</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isExpanded && (
        <div className="p-4 space-y-4 bg-white">
          {/* Preview */}
          <div className="p-3 bg-gray-50 rounded-lg border">
            <p className="text-xs text-gray-500 mb-2">Vorschau:</p>
            <span style={{
              fontFamily: currentStyle.fontFamily,
              fontSize: currentStyle.fontSize,
              fontWeight: currentStyle.fontWeight as any,
              color: currentStyle.color,
              backgroundColor: showBackground ? currentStyle.backgroundColor : undefined,
              padding: showBackground ? '4px 8px' : undefined,
              borderRadius: showBackground ? '4px' : undefined
            }}>
              Beispieltext
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Font Size */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Schriftgröße</label>
              <select
                value={currentStyle.fontSize || '16px'}
                onChange={(e) => updateStyleField(styleKey, 'fontSize', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="12px">12px</option>
                <option value="14px">14px</option>
                <option value="16px">16px</option>
                <option value="18px">18px</option>
                <option value="20px">20px</option>
                <option value="24px">24px</option>
                <option value="30px">30px</option>
                <option value="36px">36px</option>
                <option value="48px">48px</option>
              </select>
            </div>

            {/* Font Weight */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Schriftstärke</label>
              <select
                value={currentStyle.fontWeight || '400'}
                onChange={(e) => updateStyleField(styleKey, 'fontWeight', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
              >
                <option value="300">Light (300)</option>
                <option value="400">Normal (400)</option>
                <option value="500">Medium (500)</option>
                <option value="600">Semibold (600)</option>
                <option value="700">Bold (700)</option>
              </select>
            </div>

            {/* Text Color */}
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Textfarbe</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentStyle.color || '#2C2C2C'}
                  onChange={(e) => updateStyleField(styleKey, 'color', e.target.value)}
                  className="w-10 h-10 rounded-lg border cursor-pointer"
                />
                <input
                  type="text"
                  value={currentStyle.color || '#2C2C2C'}
                  onChange={(e) => updateStyleField(styleKey, 'color', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                />
              </div>
            </div>

            {/* Background Color (optional) */}
            {showBackground && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Hintergrundfarbe</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentStyle.backgroundColor || '#FFFFFF'}
                    onChange={(e) => updateStyleField(styleKey, 'backgroundColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentStyle.backgroundColor || '#FFFFFF'}
                    onChange={(e) => updateStyleField(styleKey, 'backgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
            )}

            {/* Border Color (optional) */}
            {showBorder && (
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Rahmenfarbe</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={currentStyle.borderColor || '#E5E7EB'}
                    onChange={(e) => updateStyleField(styleKey, 'borderColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border cursor-pointer"
                  />
                  <input
                    type="text"
                    value={currentStyle.borderColor || '#E5E7EB'}
                    onChange={(e) => updateStyleField(styleKey, 'borderColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
