'use client'

import { ContentSection } from '../types'
import { StyleEditor } from '../StyleEditors'

interface TestimonialsEditorProps {
  section: ContentSection
  isEditing: boolean
  editingContent: any
  currentDefaults: any
  expandedStyleFields: string[]
  toggleStyleField: (fieldName: string) => void
  updateStyleField: (fieldName: string, styleKey: string, value: string) => void
  resetFieldToDefault: (fieldName: string) => void
  resetStylePropertyToDefault: (fieldName: string, propertyName: string) => void
  isStylePropertyChanged: (fieldName: string, propertyName: string) => boolean
  resetAllToDefaults: () => void
  updateField: (field: string, value: any) => void
  updateNestedField: (parent: string, field: string, value: any) => void
}

export function TestimonialsEditor({
  section,
  isEditing,
  editingContent,
  currentDefaults,
  expandedStyleFields,
  toggleStyleField,
  updateStyleField,
  resetFieldToDefault,
  resetStylePropertyToDefault,
  isStylePropertyChanged,
  resetAllToDefaults,
  updateField,
  updateNestedField
}: TestimonialsEditorProps) {
  const content = isEditing ? editingContent : section.content

  const renderStyleEditor = (fieldName: string, label: string, hasBackground = false, hasBorder = false) => (
    <StyleEditor
      fieldName={fieldName}
      label={label}
      hasBackground={hasBackground}
      hasBorder={hasBorder}
      editingContent={editingContent}
      currentDefaults={currentDefaults}
      expandedStyleFields={expandedStyleFields}
      toggleStyleField={toggleStyleField}
      updateStyleField={updateStyleField}
      resetFieldToDefault={resetFieldToDefault}
      resetStylePropertyToDefault={resetStylePropertyToDefault}
      isStylePropertyChanged={isStylePropertyChanged}
    />
  )

  return (
    <div className="space-y-6">
      {/* Reset All Button */}
      {isEditing && currentDefaults && (
        <div className="flex justify-end pb-4 border-b border-gray-200">
          <button
            type="button"
            onClick={resetAllToDefaults}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Tümünü Orijinale Dön
          </button>
        </div>
      )}

      {/* Section Header */}
      <div className="p-4 bg-sage-50 rounded-xl border border-sage-200">
        <h3 className="text-lg font-semibold text-charcoal mb-4">Bölüm Başlığı</h3>

        {/* Badge */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-charcoal mb-2">Badge Metni</label>
          <input
            type="text"
            value={content.badge || ''}
            onChange={(e) => updateField('badge', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('badge', 'Badge Stili', true)}
        </div>

        {/* Section Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-charcoal mb-2">Ana Başlık</label>
          <input
            type="text"
            value={content.sectionTitle || ''}
            onChange={(e) => updateField('sectionTitle', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('sectionTitle', 'Başlık Stili')}
        </div>

        {/* Highlighted Text */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-charcoal mb-2">Vurgulanan Metin</label>
          <input
            type="text"
            value={content.highlightedText || ''}
            onChange={(e) => updateField('highlightedText', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('highlightedText', 'Vurgulanan Metin Stili')}
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Açıklama</label>
          <textarea
            rows={3}
            value={content.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('description', 'Açıklama Stili')}
        </div>
      </div>

      {/* Slider Settings */}
      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
        <h3 className="text-lg font-semibold text-charcoal mb-4">Slider Ayarları</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Otomatik Geçiş Süresi (ms)</label>
            <input
              type="number"
              value={content.autoSlideDelay || 5000}
              onChange={(e) => updateField('autoSlideDelay', parseInt(e.target.value))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Maksimum Gösterim Sayısı</label>
            <input
              type="number"
              value={content.maxDisplayCount || 5}
              onChange={(e) => updateField('maxDisplayCount', parseInt(e.target.value))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-charcoal">İstatistikler</h3>
          {isEditing && currentDefaults?.stats && (
            <button
              type="button"
              onClick={() => {
                updateField('stats', currentDefaults.stats)
                if (currentDefaults.styles?.statsValue) {
                  updateNestedField('styles', 'statsValue', currentDefaults.styles.statsValue)
                }
                if (currentDefaults.styles?.statsLabel) {
                  updateNestedField('styles', 'statsLabel', currentDefaults.styles.statsLabel)
                }
              }}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-amber-600 hover:text-amber-700 bg-white hover:bg-amber-100 rounded-lg border border-amber-200 transition-colors"
            >
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Orijinale Dön
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(content.stats || []).map((stat: any, index: number) => (
            <div key={index} className="p-4 bg-white rounded-xl border border-amber-100">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-700 font-semibold text-sm">
                  {index + 1}
                </span>
                <span className="text-sm font-medium text-charcoal">İstatistik {index + 1}</span>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Değer</label>
                  <input
                    type="text"
                    value={stat.value || ''}
                    onChange={(e) => {
                      const newStats = [...(content.stats || [])]
                      newStats[index] = { ...newStats[index], value: e.target.value }
                      updateField('stats', newStats)
                    }}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="500+"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Açıklama</label>
                  <input
                    type="text"
                    value={stat.label || ''}
                    onChange={(e) => {
                      const newStats = [...(content.stats || [])]
                      newStats[index] = { ...newStats[index], label: e.target.value }
                      updateField('stats', newStats)
                    }}
                    disabled={!isEditing}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                    placeholder="Zufriedene Kunden"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {isEditing && (
          <div className="mt-4 pt-4 border-t border-amber-200 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-600 mb-2 font-medium">Değer Stili</p>
              {renderStyleEditor('statsValue', 'İstatistik Değeri')}
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-2 font-medium">Etiket Stili</p>
              {renderStyleEditor('statsLabel', 'İstatistik Etiketi')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
