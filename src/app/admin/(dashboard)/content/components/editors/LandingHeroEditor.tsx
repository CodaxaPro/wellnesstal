'use client'

import { StyleEditor } from '../StyleEditors'
import { ContentSection } from '../types'

interface LandingHeroEditorProps {
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
}

export function LandingHeroEditor({
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
  updateField
}: LandingHeroEditorProps) {
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

      {/* Badge */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Badge Metni</label>
        <input
          type="text"
          value={content.badge || ''}
          onChange={(e) => updateField('badge', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
        {isEditing && renderStyleEditor('badge', 'Badge', true)}
      </div>

      {/* Main Title */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Ana Başlık</label>
        <input
          type="text"
          value={content.mainTitle || ''}
          onChange={(e) => updateField('mainTitle', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
        {isEditing && renderStyleEditor('mainTitle', 'Ana Başlık')}
      </div>

      {/* Highlighted Text */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Vurgulanan Metin (Renkli)</label>
        <input
          type="text"
          value={content.highlightedText || ''}
          onChange={(e) => updateField('highlightedText', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
        {isEditing && renderStyleEditor('highlightedText', 'Vurgulanan Metin')}
      </div>

      {/* Description */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Açıklama</label>
        <textarea
          rows={3}
          value={content.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
        {isEditing && renderStyleEditor('description', 'Açıklama')}
      </div>

      {/* Primary Button */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Ana Buton</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Metin</label>
            <input
              type="text"
              value={content.primaryButton || ''}
              onChange={(e) => updateField('primaryButton', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
            <input
              type="text"
              value={content.primaryButtonLink || ''}
              onChange={(e) => updateField('primaryButtonLink', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>
        {isEditing && renderStyleEditor('primaryButton', 'Ana Buton', true)}
      </div>

      {/* Secondary Button */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">İkincil Buton</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Metin</label>
            <input
              type="text"
              value={content.secondaryButton || ''}
              onChange={(e) => updateField('secondaryButton', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Link</label>
            <input
              type="text"
              value={content.secondaryButtonLink || ''}
              onChange={(e) => updateField('secondaryButtonLink', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>
        {isEditing && renderStyleEditor('secondaryButton', 'İkincil Buton', false, true)}
      </div>
    </div>
  )
}
