'use client'

import { ContentSection } from '../types'
import { StyleEditor } from '../StyleEditors'

interface ServicesSectionEditorProps {
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

export function ServicesSectionEditor({
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
}: ServicesSectionEditorProps) {
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

      {/* CTA Section */}
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200">
        <h3 className="text-lg font-semibold text-charcoal mb-4">CTA Bölümü (Alt Kısım)</h3>

        {/* CTA Title */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-charcoal mb-2">CTA Başlık</label>
          <input
            type="text"
            value={content.cta?.title || ''}
            onChange={(e) => updateNestedField('cta', 'title', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('ctaTitle', 'CTA Başlık Stili')}
        </div>

        {/* CTA Description */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-charcoal mb-2">CTA Açıklama</label>
          <textarea
            rows={2}
            value={content.cta?.description || ''}
            onChange={(e) => updateNestedField('cta', 'description', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
          {isEditing && renderStyleEditor('ctaDescription', 'CTA Açıklama Stili')}
        </div>

        {/* CTA Buttons */}
        <div className="space-y-4">
          {/* Primary Button */}
          <div className="p-3 bg-white rounded-lg border border-amber-100">
            <h4 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-sage-500 rounded-full"></span>
              Ana Buton
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Buton Metni</label>
                <input
                  type="text"
                  value={content.cta?.primaryButtonText || ''}
                  onChange={(e) => updateNestedField('cta', 'primaryButtonText', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="Kostenlose Beratung"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Buton Tipi</label>
                <select
                  value={content.cta?.primaryButtonType || 'phone'}
                  onChange={(e) => updateNestedField('cta', 'primaryButtonType', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                >
                  <option value="phone">📞 Telefon</option>
                  <option value="whatsapp">💬 WhatsApp</option>
                  <option value="url">🔗 URL Link</option>
                  <option value="email">✉️ E-posta</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {content.cta?.primaryButtonType === 'phone' && '📞 Telefon Numarası'}
                  {content.cta?.primaryButtonType === 'whatsapp' && '💬 WhatsApp Numarası (ülke kodu ile)'}
                  {content.cta?.primaryButtonType === 'url' && '🔗 URL Adresi'}
                  {content.cta?.primaryButtonType === 'email' && '✉️ E-posta Adresi'}
                  {!content.cta?.primaryButtonType && '📞 Telefon Numarası'}
                </label>
                <input
                  type="text"
                  value={content.cta?.primaryButtonLink || ''}
                  onChange={(e) => updateNestedField('cta', 'primaryButtonLink', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder={
                    content.cta?.primaryButtonType === 'whatsapp' ? '+49123456789' :
                    content.cta?.primaryButtonType === 'url' ? 'https://example.com' :
                    content.cta?.primaryButtonType === 'email' ? 'info@example.com' :
                    '+49 221 12345678'
                  }
                />
              </div>
            </div>
          </div>

          {/* Secondary Button */}
          <div className="p-3 bg-white rounded-lg border border-amber-100">
            <h4 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full"></span>
              İkincil Buton
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Buton Metni</label>
                <input
                  type="text"
                  value={content.cta?.secondaryButtonText || ''}
                  onChange={(e) => updateNestedField('cta', 'secondaryButtonText', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder="WhatsApp Nachricht"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Buton Tipi</label>
                <select
                  value={content.cta?.secondaryButtonType || 'whatsapp'}
                  onChange={(e) => updateNestedField('cta', 'secondaryButtonType', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                >
                  <option value="phone">📞 Telefon</option>
                  <option value="whatsapp">💬 WhatsApp</option>
                  <option value="url">🔗 URL Link</option>
                  <option value="email">✉️ E-posta</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  {content.cta?.secondaryButtonType === 'phone' && '📞 Telefon Numarası'}
                  {content.cta?.secondaryButtonType === 'whatsapp' && '💬 WhatsApp Numarası (ülke kodu ile)'}
                  {content.cta?.secondaryButtonType === 'url' && '🔗 URL Adresi'}
                  {content.cta?.secondaryButtonType === 'email' && '✉️ E-posta Adresi'}
                  {!content.cta?.secondaryButtonType && '💬 WhatsApp Numarası (ülke kodu ile)'}
                </label>
                <input
                  type="text"
                  value={content.cta?.secondaryButtonLink || ''}
                  onChange={(e) => updateNestedField('cta', 'secondaryButtonLink', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                  placeholder={
                    content.cta?.secondaryButtonType === 'phone' ? '+49 221 12345678' :
                    content.cta?.secondaryButtonType === 'url' ? 'https://example.com' :
                    content.cta?.secondaryButtonType === 'email' ? 'info@example.com' :
                    '+49123456789'
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
