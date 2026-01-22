'use client'

import { StyleEditor } from '../StyleEditors'
import { ContentSection } from '../types'

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
  uploadingImage?: number | null
  deletingImage?: number | null
  handleImageUpload?: (index: number, file: File) => void
  handleImageDelete?: (index: number) => void
  setSaveMessage?: (msg: { type: 'success' | 'error', text: string } | null) => void
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
  updateNestedField,
  uploadingImage,
  deletingImage,
  handleImageUpload,
  handleImageDelete,
  setSaveMessage
}: ServicesSectionEditorProps) {
  const content = isEditing ? editingContent : section.content
  const images = content.images || []

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
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-charcoal">CTA Bölümü (Alt Kısım)</h3>
          {/* CTA Visibility Toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <span className="text-sm text-gray-600">
              {content.cta?.visible !== false ? 'Aktif' : 'Pasif'}
            </span>
            <div className="relative">
              <input
                type="checkbox"
                checked={content.cta?.visible !== false}
                onChange={(e) => updateNestedField('cta', 'visible', e.target.checked)}
                disabled={!isEditing}
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full transition-colors ${
                content.cta?.visible !== false ? 'bg-sage-500' : 'bg-gray-300'
              } ${!isEditing ? 'opacity-50' : ''}`} />
              <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                content.cta?.visible !== false ? 'translate-x-5' : 'translate-x-0'
              }`} />
            </div>
          </label>
        </div>

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
              <span className="w-2 h-2 bg-sage-500 rounded-full" />
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
                    content.cta?.primaryButtonType === 'whatsapp' ? '+491733828581' :
                    content.cta?.primaryButtonType === 'url' ? 'https://example.com' :
                    content.cta?.primaryButtonType === 'email' ? 'info@wellnesstal.de' :
                    '+49 1733828581'
                  }
                />
              </div>
            </div>
          </div>

          {/* Secondary Button */}
          <div className="p-3 bg-white rounded-lg border border-amber-100">
            <h4 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full" />
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
                    content.cta?.secondaryButtonType === 'phone' ? '+49 1733828581' :
                    content.cta?.secondaryButtonType === 'url' ? 'https://example.com' :
                    content.cta?.secondaryButtonType === 'email' ? 'info@wellnesstal.de' :
                    '+491733828581'
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Section */}
      <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-charcoal">Resim Galerisi</h3>
            <p className="text-xs text-gray-500 mt-1">Bölümde gösterilecek resimleri ekleyin - Max 5MB - JPG, PNG, WebP, GIF</p>
          </div>
        </div>

        {/* Image Grid */}
        {images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
            {images.map((image: any, index: number) => {
              // Handle both string and object formats
              const imageUrl = typeof image === 'string' ? image : (image?.url || '')
              const imageAlt = typeof image === 'string' ? `Resim ${index + 1}` : (image?.alt || `Resim ${index + 1}`)

              if (!imageUrl) return null

              return (
                <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-sage-500 transition-all bg-white">
                  <img
                    src={imageUrl}
                    alt={imageAlt}
                    className="w-full h-full object-contain p-4"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="300" height="300"%3E%3Crect fill="%23ddd" width="300" height="300"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="14" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yüklenemedi%3C/text%3E%3C/svg%3E'
                    }}
                  />
                {isEditing && (
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (handleImageDelete) {
                          handleImageDelete(index)
                        } else {
                          const newImages = images.filter((_: any, i: number) => i !== index)
                          updateField('images', newImages)
                        }
                      }}
                      disabled={deletingImage === index}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                      {deletingImage === index ? (
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                      ) : (
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                      <span className="text-sm">Sil</span>
                    </button>
                  </div>
                )}
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {index + 1}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Upload Zone */}
        {isEditing && (
          <label className={`block w-full border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
            uploadingImage !== null
              ? 'border-sage-400 bg-sage-50'
              : 'border-sage-300 hover:border-sage-500 hover:bg-sage-50'
          }`}>
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(e) => {
                const files = Array.from(e.target.files || [])
                if (files.length === 0) return

                files.forEach((file, fileIndex) => {
                  if (handleImageUpload) {
                    handleImageUpload(images.length + fileIndex, file)
                  } else {
                    // Fallback: Direct URL input
                    const reader = new FileReader()
                    reader.onload = (event) => {
                      const newImages = [...images, { url: event.target?.result, alt: file.name }]
                      updateField('images', newImages)
                    }
                    reader.readAsDataURL(file)
                  }
                })
              }}
              disabled={uploadingImage !== null}
            />
            {uploadingImage !== null ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin h-10 w-10 border-3 border-sage-500 border-t-transparent rounded-full mb-2" />
                <span className="text-sm text-sage-600">Yükleniyor...</span>
              </div>
            ) : (
              <>
                <svg className="h-12 w-12 text-sage-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm text-sage-600 font-medium">
                  Resim ekle (birden fazla seçebilirsiniz)
                </span>
                <span className="text-xs text-gray-400 mt-1 block">veya URL girin</span>
              </>
            )}
          </label>
        )}

        {/* URL Input for Manual Image Addition */}
        {isEditing && (
          <div className="mt-4">
            <label className="block text-xs font-medium text-gray-600 mb-1">Resim URL'si Ekle</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const url = (e.target as HTMLInputElement).value.trim()
                    if (url) {
                      const newImages = [...images, { url, alt: '' }]
                      updateField('images', newImages)
                      ;(e.target as HTMLInputElement).value = ''
                    }
                  }
                }}
              />
              <button
                type="button"
                onClick={(e) => {
                  const input = (e.currentTarget.previousElementSibling as HTMLInputElement)
                  const url = input.value.trim()
                  if (url) {
                    const newImages = [...images, { url, alt: '' }]
                    updateField('images', newImages)
                    input.value = ''
                  }
                }}
                className="px-4 py-2 bg-sage-500 hover:bg-forest-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Ekle
              </button>
            </div>
          </div>
        )}

        {/* Image Count */}
        {images.length > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Toplam {images.length} resim
          </div>
        )}
      </div>
    </div>
  )
}
