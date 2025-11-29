'use client'

import { ContentSection } from '../types'
import { StyleEditor } from '../StyleEditors'

interface HeroEditorProps {
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
  uploadingHeroImage: boolean
  deletingHeroImage: boolean
  handleHeroImageUpload: (file: File) => void
  handleHeroImageDelete: () => void
  setSaveMessage: (msg: { type: 'success' | 'error', text: string } | null) => void
}

export function HeroEditor({
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
  uploadingHeroImage,
  deletingHeroImage,
  handleHeroImageUpload,
  handleHeroImageDelete,
  setSaveMessage
}: HeroEditorProps) {
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

  const updateImageStyleField = (field: string, value: string) => {
    setEditingContent((prev: any) => ({
      ...prev,
      imageStyles: {
        ...prev.imageStyles,
        [field]: value
      }
    }))
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

      {/* Highlighted Text (3rd word in title) */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Vurgulanan Metin (Başlığın 3. Kelimesi)</label>
        <p className="text-xs text-gray-500 mb-2">Ana başlığın 3. kelimesi otomatik olarak bu stille görüntülenir</p>
        {isEditing && renderStyleEditor('highlightedText', 'Vurgulanan Metin')}
      </div>

      {/* Subtitle */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Alt Başlık</label>
        <textarea
          rows={3}
          value={content.subtitle || ''}
          onChange={(e) => updateField('subtitle', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
        {isEditing && renderStyleEditor('subtitle', 'Alt Başlık')}
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

      {/* Trust Indicator */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Güven Göstergesi</label>
        <input
          type="text"
          value={content.trustIndicator || ''}
          onChange={(e) => updateField('trustIndicator', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
        {isEditing && renderStyleEditor('trustIndicator', 'Güven Göstergesi')}
      </div>

      {/* Enterprise Hero Image Section */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal">Hero Görseli</label>
            <p className="text-xs text-gray-500 mt-1">Hero bölümünde gösterilen ana görsel - Max 5MB - JPG, PNG, WebP, GIF</p>
          </div>
          {content.image?.url && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              content.image.url.startsWith('/uploads/')
                ? 'bg-green-100 text-green-700'
                : 'bg-blue-100 text-blue-700'
            }`}>
              {content.image.url.startsWith('/uploads/') ? 'Yüklendi' : 'Harici'}
            </span>
          )}
        </div>

        {/* Image Preview with Actions */}
        <div className="mb-4 relative group">
          {content.image?.url ? (
            <>
              <img
                src={content.image.url}
                alt={content.image?.alt || 'Hero görsel'}
                className="w-full h-48 object-cover rounded-xl border border-gray-200"
                style={{
                  borderRadius: content.imageStyles?.borderRadius || '24px',
                  filter: `brightness(${content.imageStyles?.brightness || 100}%) contrast(${content.imageStyles?.contrast || 100}%) saturate(${content.imageStyles?.saturation || 100}%)`,
                  opacity: parseInt(content.imageStyles?.opacity || '100') / 100,
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x400?text=Görsel+Yüklenemedi'
                }}
              />
              {/* Overlay Actions */}
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-3">
                  {/* Upload New */}
                  <label className="cursor-pointer bg-white hover:bg-gray-100 text-charcoal px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleHeroImageUpload(file)
                      }}
                      disabled={uploadingHeroImage}
                    />
                    {uploadingHeroImage ? (
                      <div className="animate-spin h-5 w-5 border-2 border-sage-500 border-t-transparent rounded-full"></div>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                    <span className="text-sm font-medium">Değiştir</span>
                  </label>
                  {/* Delete */}
                  <button
                    type="button"
                    onClick={handleHeroImageDelete}
                    disabled={deletingHeroImage}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50"
                  >
                    {deletingHeroImage ? (
                      <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    )}
                    <span className="text-sm font-medium">Sil</span>
                  </button>
                </div>
              )}
            </>
          ) : (
            /* Empty State - Upload Zone */
            <label className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${
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
                  if (file) handleHeroImageUpload(file)
                }}
                disabled={!isEditing || uploadingHeroImage}
              />
              {uploadingHeroImage ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin h-10 w-10 border-3 border-sage-500 border-t-transparent rounded-full mb-2"></div>
                  <span className="text-sm text-sage-600">Yükleniyor...</span>
                </div>
              ) : (
                <>
                  <svg className="h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm text-gray-500 font-medium">
                    {isEditing ? 'Hero görseli yükle' : 'Görsel yok'}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">veya URL girin</span>
                </>
              )}
            </label>
          )}
        </div>

        {/* URL & Alt Text Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Görsel URL
              {isEditing && <span className="text-gray-400 font-normal ml-1">(veya yukarıdan yükleyin)</span>}
            </label>
            <input
              type="text"
              value={content.image?.url || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                image: { ...prev.image, url: e.target.value }
              }))}
              disabled={!isEditing}
              placeholder="https://..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Alt Metin (SEO)</label>
            <input
              type="text"
              value={content.image?.alt || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                image: { ...prev.image, alt: e.target.value }
              }))}
              disabled={!isEditing}
              placeholder="Görsel açıklaması..."
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-100"
            />
          </div>
        </div>

        {/* Image Effects Section */}
        {isEditing && (
          <div className="mt-4 p-4 bg-gradient-to-r from-purple-50 to-sage-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">✨</span>
              <h4 className="text-sm font-semibold text-charcoal">Görsel Efektleri</h4>
            </div>

            {/* Border Radius & Shadow */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Köşe Yuvarlaklığı</label>
                <select
                  value={content.imageStyles?.borderRadius || '24px'}
                  onChange={(e) => updateImageStyleField('borderRadius', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="0px">Keskin (0px)</option>
                  <option value="8px">Hafif (8px)</option>
                  <option value="16px">Orta (16px)</option>
                  <option value="24px">Yuvarlak (24px)</option>
                  <option value="32px">Çok Yuvarlak (32px)</option>
                  <option value="9999px">Tam Yuvarlak</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Gölge</label>
                <select
                  value={content.imageStyles?.boxShadow || '0 25px 50px -12px rgba(0, 0, 0, 0.25)'}
                  onChange={(e) => updateImageStyleField('boxShadow', e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="none">Gölge Yok</option>
                  <option value="0 4px 6px -1px rgba(0, 0, 0, 0.1)">Hafif</option>
                  <option value="0 10px 15px -3px rgba(0, 0, 0, 0.1)">Orta</option>
                  <option value="0 25px 50px -12px rgba(0, 0, 0, 0.25)">Büyük</option>
                  <option value="0 35px 60px -15px rgba(0, 0, 0, 0.3)">Ekstra Büyük</option>
                </select>
              </div>
            </div>

            {/* Opacity & Hover Scale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Opaklık: {content.imageStyles?.opacity || 100}%
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={content.imageStyles?.opacity || 100}
                  onChange={(e) => updateImageStyleField('opacity', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Hover Zoom: {content.imageStyles?.hoverScale || 105}%
                </label>
                <input
                  type="range"
                  min="100"
                  max="120"
                  value={content.imageStyles?.hoverScale || 105}
                  onChange={(e) => updateImageStyleField('hoverScale', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
                />
              </div>
            </div>

            {/* Color Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Parlaklık: {content.imageStyles?.brightness || 100}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={content.imageStyles?.brightness || 100}
                  onChange={(e) => updateImageStyleField('brightness', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-yellow-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Kontrast: {content.imageStyles?.contrast || 100}%
                </label>
                <input
                  type="range"
                  min="50"
                  max="150"
                  value={content.imageStyles?.contrast || 100}
                  onChange={(e) => updateImageStyleField('contrast', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Doygunluk: {content.imageStyles?.saturation || 100}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="200"
                  value={content.imageStyles?.saturation || 100}
                  onChange={(e) => updateImageStyleField('saturation', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-500"
                />
              </div>
            </div>

            {/* Overlay Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Overlay Opaklığı: {content.imageStyles?.overlayOpacity || 20}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="80"
                  value={content.imageStyles?.overlayOpacity || 20}
                  onChange={(e) => updateImageStyleField('overlayOpacity', e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-gray-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Overlay Rengi</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={content.imageStyles?.overlayColor || '#2C2C2C'}
                    onChange={(e) => updateImageStyleField('overlayColor', e.target.value)}
                    className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.imageStyles?.overlayColor || '#2C2C2C'}
                    onChange={(e) => updateImageStyleField('overlayColor', e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono"
                  />
                </div>
              </div>
            </div>

            {/* Reset Image Styles Button */}
            {currentDefaults?.imageStyles && (
              <div className="mt-4 pt-4 border-t border-purple-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setEditingContent((prev: any) => ({
                      ...prev,
                      imageStyles: { ...currentDefaults.imageStyles }
                    }))
                    setSaveMessage({ type: 'success', text: 'Görsel efektleri varsayılana sıfırlandı' })
                    setTimeout(() => setSaveMessage(null), 2000)
                  }}
                  className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 font-medium"
                >
                  <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Efektleri Sıfırla
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
