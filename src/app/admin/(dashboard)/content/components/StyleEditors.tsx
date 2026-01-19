'use client'

import { fontFamilies, fontWeights, fontSizes } from './constants'

interface StyleEditorProps {
  fieldName: string
  label: string
  hasBackground?: boolean
  hasBorder?: boolean
  editingContent: any
  currentDefaults: any
  expandedStyleFields: string[]
  toggleStyleField: (fieldName: string) => void
  updateStyleField: (fieldName: string, styleKey: string, value: string) => void
  resetFieldToDefault: (fieldName: string) => void
  resetStylePropertyToDefault: (fieldName: string, propertyName: string) => void
  isStylePropertyChanged: (fieldName: string, propertyName: string) => boolean
}

export function StyleEditor({
  fieldName,
  label,
  hasBackground = false,
  hasBorder = false,
  editingContent,
  currentDefaults,
  expandedStyleFields,
  toggleStyleField,
  updateStyleField,
  resetFieldToDefault,
  resetStylePropertyToDefault,
  isStylePropertyChanged
}: StyleEditorProps) {
  const styles = editingContent?.styles?.[fieldName] || {}
  const isExpanded = expandedStyleFields.includes(fieldName)
  const hasChanges = currentDefaults?.styles?.[fieldName] &&
    JSON.stringify(styles) !== JSON.stringify(currentDefaults.styles[fieldName])

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => toggleStyleField(fieldName)}
        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
          isExpanded ? 'text-sage-600' : 'text-gray-500 hover:text-sage-600'
        }`}
      >
        <svg
          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {label}
        {hasChanges && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
      </button>

      {isExpanded && (
        <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
          {/* Reset Button */}
          {currentDefaults && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => resetFieldToDefault(fieldName)}
                className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Orijinale Dön
              </button>
            </div>
          )}

          {/* Typography Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Font Family */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-600">Font Ailesi</label>
                {isStylePropertyChanged(fieldName, 'fontFamily') && (
                  <button
                    type="button"
                    onClick={() => resetStylePropertyToDefault(fieldName, 'fontFamily')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <select
                value={styles.fontFamily || 'system-ui'}
                onChange={(e) => updateStyleField(fieldName, 'fontFamily', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              >
                {fontFamilies.map(font => (
                  <option key={font.value} value={font.value}>{font.label}</option>
                ))}
              </select>
            </div>

            {/* Font Size */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-600">Font Boyutu</label>
                {isStylePropertyChanged(fieldName, 'fontSize') && (
                  <button
                    type="button"
                    onClick={() => resetStylePropertyToDefault(fieldName, 'fontSize')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <select
                value={styles.fontSize || '16px'}
                onChange={(e) => updateStyleField(fieldName, 'fontSize', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              >
                {fontSizes.map(size => (
                  <option key={size.value} value={size.value}>{size.label}</option>
                ))}
              </select>
            </div>

            {/* Font Weight */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-600">Font Kalınlığı</label>
                {isStylePropertyChanged(fieldName, 'fontWeight') && (
                  <button
                    type="button"
                    onClick={() => resetStylePropertyToDefault(fieldName, 'fontWeight')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <select
                value={styles.fontWeight || '400'}
                onChange={(e) => updateStyleField(fieldName, 'fontWeight', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              >
                {fontWeights.map(weight => (
                  <option key={weight.value} value={weight.value}>{weight.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Color Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Text Color */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-600">Metin Rengi</label>
                {isStylePropertyChanged(fieldName, 'color') && (
                  <button
                    type="button"
                    onClick={() => resetStylePropertyToDefault(fieldName, 'color')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.color || '#2C2C2C'}
                  onChange={(e) => updateStyleField(fieldName, 'color', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={styles.color || '#2C2C2C'}
                  onChange={(e) => updateStyleField(fieldName, 'color', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                  placeholder="#2C2C2C"
                />
              </div>
            </div>

            {/* Background Color */}
            {hasBackground && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-600">Arka Plan Rengi</label>
                  {isStylePropertyChanged(fieldName, 'backgroundColor') && (
                    <button
                      type="button"
                      onClick={() => resetStylePropertyToDefault(fieldName, 'backgroundColor')}
                      className="text-amber-500 hover:text-amber-600 transition-colors"
                      title="Orijinale Dön"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.backgroundColor || '#9CAF88'}
                    onChange={(e) => updateStyleField(fieldName, 'backgroundColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.backgroundColor || '#9CAF88'}
                    onChange={(e) => updateStyleField(fieldName, 'backgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                    placeholder="#9CAF88"
                  />
                </div>
              </div>
            )}

            {/* Border Color */}
            {hasBorder && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-gray-600">Kenarlık Rengi</label>
                  {isStylePropertyChanged(fieldName, 'borderColor') && (
                    <button
                      type="button"
                      onClick={() => resetStylePropertyToDefault(fieldName, 'borderColor')}
                      className="text-amber-500 hover:text-amber-600 transition-colors"
                      title="Orijinale Dön"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={styles.borderColor || '#9CAF88'}
                    onChange={(e) => updateStyleField(fieldName, 'borderColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={styles.borderColor || '#9CAF88'}
                    onChange={(e) => updateStyleField(fieldName, 'borderColor', e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                    placeholder="#9CAF88"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Live Preview */}
          <div className="pt-3 border-t border-gray-200">
            <label className="block text-xs font-medium text-gray-600 mb-2">Önizleme</label>
            <div
              className={`p-3 rounded-lg ${hasBackground ? '' : 'bg-white border border-gray-200'}`}
              style={{
                fontFamily: styles.fontFamily || 'system-ui',
                fontSize: styles.fontSize || '16px',
                fontWeight: styles.fontWeight || '400',
                color: styles.color || '#2C2C2C',
                backgroundColor: hasBackground ? (styles.backgroundColor || '#9CAF88') : undefined,
                borderColor: hasBorder ? (styles.borderColor || '#9CAF88') : undefined,
                borderWidth: hasBorder ? '2px' : undefined,
                borderStyle: hasBorder ? 'solid' : undefined,
              }}
            >
              {editingContent?.[fieldName] || 'Örnek metin'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

interface IconStyleEditorProps {
  fieldName: string
  label: string
  editingContent: any
  currentDefaults: any
  expandedStyleFields: string[]
  toggleStyleField: (fieldName: string) => void
  updateStyleField: (fieldName: string, styleKey: string, value: string) => void
  resetFieldToDefault: (fieldName: string) => void
  resetStylePropertyToDefault: (fieldName: string, propertyName: string) => void
  isStylePropertyChanged: (fieldName: string, propertyName: string) => boolean
}

export function IconStyleEditor({
  fieldName,
  label,
  editingContent,
  currentDefaults,
  expandedStyleFields,
  toggleStyleField,
  updateStyleField,
  resetFieldToDefault,
  resetStylePropertyToDefault,
  isStylePropertyChanged
}: IconStyleEditorProps) {
  const styles = editingContent?.styles?.[fieldName] || {}
  const isExpanded = expandedStyleFields.includes(fieldName)
  const hasChanges = currentDefaults?.styles?.[fieldName] &&
    JSON.stringify(styles) !== JSON.stringify(currentDefaults.styles[fieldName])

  return (
    <div className="mt-2">
      <button
        type="button"
        onClick={() => toggleStyleField(fieldName)}
        className={`flex items-center gap-2 text-sm font-medium transition-colors ${
          isExpanded ? 'text-sage-600' : 'text-gray-500 hover:text-sage-600'
        }`}
      >
        <svg
          className={`h-4 w-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
        {label}
        {hasChanges && <span className="w-2 h-2 bg-amber-500 rounded-full" />}
      </button>

      {isExpanded && (
        <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-4">
          {/* Reset Button */}
          {currentDefaults && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => resetFieldToDefault(fieldName)}
                className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700 font-medium"
              >
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Orijinale Dön
              </button>
            </div>
          )}

          {/* Color Controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Background Color */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-600">Arka Plan Rengi</label>
                {isStylePropertyChanged(fieldName, 'backgroundColor') && (
                  <button
                    type="button"
                    onClick={() => resetStylePropertyToDefault(fieldName, 'backgroundColor')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.backgroundColor || '#9CAF88'}
                  onChange={(e) => updateStyleField(fieldName, 'backgroundColor', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={styles.backgroundColor || '#9CAF88'}
                  onChange={(e) => updateStyleField(fieldName, 'backgroundColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                  placeholder="#9CAF88"
                />
              </div>
            </div>

            {/* Icon Color */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-gray-600">İkon Rengi</label>
                {isStylePropertyChanged(fieldName, 'iconColor') && (
                  <button
                    type="button"
                    onClick={() => resetStylePropertyToDefault(fieldName, 'iconColor')}
                    className="text-amber-500 hover:text-amber-600 transition-colors"
                    title="Orijinale Dön"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={styles.iconColor || '#FFFFFF'}
                  onChange={(e) => updateStyleField(fieldName, 'iconColor', e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={styles.iconColor || '#FFFFFF'}
                  onChange={(e) => updateStyleField(fieldName, 'iconColor', e.target.value)}
                  className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="pt-3 border-t border-gray-200">
            <label className="block text-xs font-medium text-gray-600 mb-2">Önizleme</label>
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: styles.backgroundColor || '#9CAF88',
                }}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: styles.iconColor || '#FFFFFF' }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <span className="text-sm text-gray-500">Örnek ikon görünümü</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
