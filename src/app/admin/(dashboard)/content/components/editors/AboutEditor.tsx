'use client'

import { ContentSection } from '../types'
import { StyleEditor } from '../StyleEditors'

interface AboutEditorProps {
  section: ContentSection
  isEditing: boolean
  editingContent: any
  setEditingContent: (updater: any) => void
  currentDefaults: any
  expandedStyleFields: string[]
  toggleStyleField: (fieldName: string) => void
  updateStyleField: (fieldName: string, styleKey: string, value: string) => void
  resetFieldToDefault: (fieldName: string) => void
  resetStylePropertyToDefault: (fieldName: string, propertyName: string) => void
  isStylePropertyChanged: (fieldName: string, propertyName: string) => boolean
  resetAllToDefaults: () => void
  updateField: (field: string, value: any) => void
  uploadingImage: number | null
  deletingImage: number | null
  handleImageUpload: (index: number, file: File) => void
  handleImageDelete: (index: number) => void
}

export function AboutEditor({
  section,
  isEditing,
  editingContent,
  setEditingContent,
  currentDefaults,
  expandedStyleFields,
  toggleStyleField,
  updateStyleField,
  resetFieldToDefault,
  resetStylePropertyToDefault,
  isStylePropertyChanged,
  resetAllToDefaults,
  updateField,
  uploadingImage,
  deletingImage,
  handleImageUpload,
  handleImageDelete
}: AboutEditorProps) {
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

  const updateImageField = (index: number, field: string, value: string) => {
    setEditingContent((prev: any) => {
      const images = [...(prev.images || [])]
      if (!images[index]) {
        images[index] = { url: '', alt: '' }
      }
      images[index] = { ...images[index], [field]: value }
      return { ...prev, images }
    })
  }

  const updateStatField = (index: number, field: string, value: string) => {
    setEditingContent((prev: any) => {
      const stats = [...(prev.stats || [])]
      if (!stats[index]) {
        stats[index] = { label: '', value: '' }
      }
      stats[index] = { ...stats[index], [field]: value }
      return { ...prev, stats }
    })
  }

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

      {/* Title */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Başlık</label>
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => updateField('title', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
        {isEditing && renderStyleEditor('title', 'Başlık')}
      </div>

      {/* Highlighted Text */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Vurgulanan Metin (Son Kelime)</label>
        <p className="text-xs text-gray-500 mb-2">Başlığın son kelimesi otomatik olarak bu stille görüntülenir</p>
        {isEditing && renderStyleEditor('highlightedText', 'Vurgulanan Metin')}
      </div>

      {/* Description */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Açıklama</label>
        <textarea
          rows={4}
          value={content.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
        {isEditing && renderStyleEditor('description', 'Açıklama')}
      </div>

      {/* Stats */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-4">İstatistikler</label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Stat 1 */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="block text-xs font-medium text-gray-500 mb-1">İstatistik 1 - Değer</label>
            <input
              type="text"
              value={content.stats?.[0]?.value || ''}
              onChange={(e) => updateStatField(0, 'value', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100 mb-2"
            />
            <label className="block text-xs font-medium text-gray-500 mb-1">İstatistik 1 - Etiket</label>
            <input
              type="text"
              value={content.stats?.[0]?.label || ''}
              onChange={(e) => updateStatField(0, 'label', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          {/* Stat 2 */}
          <div className="p-4 bg-gray-50 rounded-xl">
            <label className="block text-xs font-medium text-gray-500 mb-1">İstatistik 2 - Değer</label>
            <input
              type="text"
              value={content.stats?.[1]?.value || ''}
              onChange={(e) => updateStatField(1, 'value', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100 mb-2"
            />
            <label className="block text-xs font-medium text-gray-500 mb-1">İstatistik 2 - Etiket</label>
            <input
              type="text"
              value={content.stats?.[1]?.label || ''}
              onChange={(e) => updateStatField(1, 'label', e.target.value)}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>
        {isEditing && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Images Section */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal">Görseller</label>
            <p className="text-xs text-gray-500 mt-1">Über Uns bölümünde gösterilen 4 görsel - Max 5MB - JPG, PNG, WebP, GIF</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:border-sage-200 transition-colors">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-sage-100 text-sage-700 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-charcoal">Görsel {index + 1}</span>
                </div>
                {content.images?.[index]?.url && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    content.images[index].url.startsWith('/uploads/')
                      ? 'bg-green-100 text-green-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {content.images[index].url.startsWith('/uploads/') ? 'Yüklendi' : 'Harici'}
                  </span>
                )}
              </div>

              {/* Image Preview with Actions */}
              <div className="mb-3 relative group">
                {content.images?.[index]?.url ? (
                  <>
                    <img
                      src={content.images[index].url}
                      alt={content.images[index]?.alt || `Görsel ${index + 1}`}
                      className="w-full h-36 object-cover rounded-lg border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Görsel+Yüklenemedi'
                      }}
                    />
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                        <label className="cursor-pointer bg-white hover:bg-gray-100 text-charcoal p-2 rounded-lg transition-colors">
                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/gif"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0]
                              if (file) handleImageUpload(index, file)
                            }}
                            disabled={uploadingImage === index}
                          />
                          {uploadingImage === index ? (
                            <div className="animate-spin h-5 w-5 border-2 border-sage-500 border-t-transparent rounded-full"></div>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          )}
                        </label>
                        <button
                          type="button"
                          onClick={() => handleImageDelete(index)}
                          disabled={deletingImage === index}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {deletingImage === index ? (
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <label className={`w-full h-36 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors ${
                    isEditing
                      ? 'border-sage-300 hover:border-sage-500 hover:bg-sage-50'
                      : 'border-gray-200 bg-gray-100 cursor-not-allowed'
                  }`}>
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(index, file)
                      }}
                      disabled={!isEditing || uploadingImage === index}
                    />
                    {uploadingImage === index ? (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin h-8 w-8 border-3 border-sage-500 border-t-transparent rounded-full mb-2"></div>
                        <span className="text-xs text-sage-600">Yükleniyor...</span>
                      </div>
                    ) : (
                      <>
                        <svg className="h-8 w-8 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        <span className="text-xs text-gray-500">
                          {isEditing ? 'Görsel yükle' : 'Görsel yok'}
                        </span>
                      </>
                    )}
                  </label>
                )}
              </div>

              {/* URL Input & Alt Text */}
              <div className="space-y-2">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Görsel URL
                    {isEditing && (
                      <span className="text-gray-400 font-normal ml-1">(veya yukarıdan yükleyin)</span>
                    )}
                  </label>
                  <input
                    type="text"
                    value={content.images?.[index]?.url || ''}
                    onChange={(e) => updateImageField(index, 'url', e.target.value)}
                    disabled={!isEditing}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">Alt Metin (SEO)</label>
                  <input
                    type="text"
                    value={content.images?.[index]?.alt || ''}
                    onChange={(e) => updateImageField(index, 'alt', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Görsel açıklaması..."
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
