'use client'

import { StyleEditor } from '../StyleEditors'
import { ContentSection } from '../types'

interface FooterEditorProps {
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
  updateField: (field: string, value: any) => void
  updateNestedField: (parent: string, field: string, value: any) => void
  setSaveMessage: (msg: { type: 'success' | 'error', text: string } | null) => void
}

export function FooterEditor({
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
  updateField,
  updateNestedField,
  setSaveMessage
}: FooterEditorProps) {
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

  const updateNewsletterField = (field: string, value: any) => {
    setEditingContent((prev: any) => ({
      ...prev,
      newsletter: {
        ...prev.newsletter,
        [field]: value
      }
    }))
  }

  const updateQuickLink = (index: number, field: string, value: string) => {
    setEditingContent((prev: any) => {
      const links = [...(prev.quickLinks || [])]
      if (!links[index]) {
links[index] = { label: '', href: '' }
}
      links[index][field] = value
      return { ...prev, quickLinks: links }
    })
  }

  const updateLegalLink = (index: number, field: string, value: string) => {
    setEditingContent((prev: any) => {
      const links = [...(prev.legalLinks || [])]
      if (!links[index]) {
links[index] = { label: '', href: '' }
}
      links[index][field] = value
      return { ...prev, legalLinks: links }
    })
  }

  const addLegalLink = () => {
    setEditingContent((prev: any) => ({
      ...prev,
      legalLinks: [...(prev.legalLinks || []), { label: '', href: '' }]
    }))
  }

  const removeLegalLink = (index: number) => {
    setEditingContent((prev: any) => {
      const links = [...(prev.legalLinks || [])]
      links.splice(index, 1)
      return { ...prev, legalLinks: links }
    })
  }

  const updateServiceLink = (index: number, field: string, value: string) => {
    setEditingContent((prev: any) => {
      const links = [...(prev.services || [])]
      if (!links[index]) {
links[index] = { label: '', href: '' }
}
      links[index][field] = value
      return { ...prev, services: links }
    })
  }

  const addServiceLink = () => {
    setEditingContent((prev: any) => ({
      ...prev,
      services: [...(prev.services || []), { label: '', href: '' }]
    }))
  }

  const removeServiceLink = (index: number) => {
    setEditingContent((prev: any) => {
      const links = [...(prev.services || [])]
      links.splice(index, 1)
      return { ...prev, services: links }
    })
  }

  return (
    <div className="space-y-6">
      {/* Reset All Button */}
      {isEditing && currentDefaults && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => {
              if (confirm('Tüm footer içeriği ve stilleri varsayılana döndürülecek. Devam etmek istiyor musunuz?')) {
                setEditingContent({ ...currentDefaults })
                setSaveMessage({ type: 'success', text: 'Tümü varsayılana sıfırlandı' })
                setTimeout(() => setSaveMessage(null), 2000)
              }
            }}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Tümünü Orijinale Dön
          </button>
        </div>
      )}

      {/* Brand Section */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
          Marka Bilgileri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Marka Emojisi</label>
            <input
              type="text"
              value={content.brandEmoji || ''}
              onChange={(e) => updateField('brandEmoji', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50 text-2xl text-center"
              maxLength={4}
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-charcoal mb-2">Marka Adı</label>
            <input
              type="text"
              value={content.brandName || ''}
              onChange={(e) => updateField('brandName', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>
        {isEditing && renderStyleEditor('brandName', 'Marka Adı Stili')}
      </div>

      {/* Description */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Footer Açıklaması</label>
        <textarea
          rows={3}
          value={content.description || ''}
          onChange={(e) => updateField('description', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
        {isEditing && renderStyleEditor('description', 'Açıklama Stili')}
      </div>

      {/* Social Media */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
          Sosyal Medya Linkleri
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs">I</span>
              Instagram
            </label>
            <input
              type="url"
              value={content.socialMedia?.instagram || ''}
              onChange={(e) => updateNestedField('socialMedia', 'instagram', e.target.value)}
              disabled={!isEditing}
              placeholder="https://instagram.com/..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs">f</span>
              Facebook
            </label>
            <input
              type="url"
              value={content.socialMedia?.facebook || ''}
              onChange={(e) => updateNestedField('socialMedia', 'facebook', e.target.value)}
              disabled={!isEditing}
              placeholder="https://facebook.com/..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-charcoal mb-2 flex items-center gap-2">
              <span className="w-6 h-6 bg-green-500 rounded-lg flex items-center justify-center text-white text-xs">W</span>
              WhatsApp
            </label>
            <input
              type="url"
              value={content.socialMedia?.whatsapp || ''}
              onChange={(e) => updateNestedField('socialMedia', 'whatsapp', e.target.value)}
              disabled={!isEditing}
              placeholder="https://wa.me/..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>

      {/* Newsletter Settings */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
            Newsletter Bölümü
          </h3>
          {isEditing && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={content.newsletter?.enabled !== false}
                onChange={(e) => updateNewsletterField('enabled', e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-sage-500 focus:ring-sage-500"
              />
              <span className="text-sm text-gray-600">Aktif</span>
            </label>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Başlık</label>
            <input
              type="text"
              value={content.newsletter?.title || ''}
              onChange={(e) => updateNewsletterField('title', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Buton Metni</label>
            <input
              type="text"
              value={content.newsletter?.buttonText || ''}
              onChange={(e) => updateNewsletterField('buttonText', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-charcoal mb-2">Alt Yazı</label>
            <textarea
              rows={2}
              value={content.newsletter?.subtitle || ''}
              onChange={(e) => updateNewsletterField('subtitle', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Placeholder</label>
            <input
              type="text"
              value={content.newsletter?.placeholder || ''}
              onChange={(e) => updateNewsletterField('placeholder', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Uyarı Metni</label>
            <input
              type="text"
              value={content.newsletter?.disclaimer || ''}
              onChange={(e) => updateNewsletterField('disclaimer', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>
        {isEditing && renderStyleEditor('newsletterTitle', 'Newsletter Başlık Stili')}
      </div>

      {/* Quick Links */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
              Navigasyon Linkleri
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Footer'da "Navigation" bölümünde görünen hızlı linkleri düzenleyin. Bu linkler otomatik olarak footer'da görünür.
            </p>
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={() => {
                setEditingContent((prev: any) => ({
                  ...prev,
                  quickLinks: [...(prev.quickLinks || []), { label: '', href: '' }]
                }))
              }}
              className="px-3 py-1.5 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors text-sm"
            >
              + Link Ekle
            </button>
          )}
        </div>
        <div className="space-y-3">
          {(content.quickLinks || []).map((link: any, index: number) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <input
                  type="text"
                  value={link.label || ''}
                  onChange={(e) => updateQuickLink(index, 'label', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Link Metni (örn: Start)"
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                />
                <input
                  type="text"
                  value={link.href || ''}
                  onChange={(e) => updateQuickLink(index, 'href', e.target.value)}
                  disabled={!isEditing}
                  placeholder="#section veya /sayfa"
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50 font-mono text-sm"
                />
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingContent((prev: any) => {
                      const links = [...(prev.quickLinks || [])]
                      links.splice(index, 1)
                      return { ...prev, quickLinks: links }
                    })
                  }}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          {(!content.quickLinks || content.quickLinks.length === 0) && (
            <p className="text-sm text-gray-500 italic">Henüz navigasyon linki eklenmemiş. "+ Link Ekle" butonuna tıklayarak ekleyebilirsiniz.</p>
          )}
        </div>
        {isEditing && renderStyleEditor('link', 'Link Stili')}
      </div>

      {/* Services Links */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
              Leistungen (Servisler)
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Footer'da "Leistungen" bölümünde görünen servis linklerini düzenleyin. Bu linkler otomatik olarak footer'da görünür.
            </p>
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={addServiceLink}
              className="px-3 py-1.5 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors text-sm"
            >
              + Link Ekle
            </button>
          )}
        </div>
        <div className="space-y-3">
          {(content.services || []).map((link: any, index: number) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <input
                  type="text"
                  value={link.label || ''}
                  onChange={(e) => updateServiceLink(index, 'label', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Servis Adı (örn: Premium Headspa)"
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                />
                <input
                  type="text"
                  value={link.href || ''}
                  onChange={(e) => updateServiceLink(index, 'href', e.target.value)}
                  disabled={!isEditing}
                  placeholder="/services/headspa"
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50 font-mono text-sm"
                />
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => removeServiceLink(index)}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          {(!content.services || content.services.length === 0) && (
            <p className="text-sm text-gray-500 italic">Henüz servis linki eklenmemiş. "+ Link Ekle" butonuna tıklayarak ekleyebilirsiniz.</p>
          )}
        </div>
      </div>

      {/* Legal Links */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-charcoal flex items-center gap-2">
              Yasal Linkler
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Footer'ın alt kısmında görünen yasal linkleri düzenleyin (Impressum, Datenschutz, AGB, vb.). Bu linkler otomatik olarak footer'da görünür.
            </p>
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={addLegalLink}
              className="px-3 py-1.5 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors text-sm"
            >
              + Link Ekle
            </button>
          )}
        </div>
        <div className="space-y-3">
          {(content.legalLinks || []).map((link: any, index: number) => (
            <div key={index} className="flex gap-3 items-center">
              <div className="grid grid-cols-2 gap-3 flex-1">
                <input
                  type="text"
                  value={link.label || ''}
                  onChange={(e) => updateLegalLink(index, 'label', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Link Metni (örn: Impressum)"
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
                />
                <input
                  type="text"
                  value={link.href || ''}
                  onChange={(e) => updateLegalLink(index, 'href', e.target.value)}
                  disabled={!isEditing}
                  placeholder="/impressum"
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50 font-mono text-sm"
                />
              </div>
              {isEditing && (
                <button
                  type="button"
                  onClick={() => removeLegalLink(index)}
                  className="px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          ))}
          {(!content.legalLinks || content.legalLinks.length === 0) && (
            <p className="text-sm text-gray-500 italic">Henüz yasal link eklenmemiş. "+ Link Ekle" butonuna tıklayarak ekleyebilirsiniz.</p>
          )}
        </div>
      </div>

      {/* Copyright */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Copyright Metni</label>
        <input
          type="text"
          value={content.copyright || ''}
          onChange={(e) => updateField('copyright', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
        {isEditing && renderStyleEditor('copyright', 'Copyright Stili')}
      </div>

      {/* Section Title Style */}
      {isEditing && (
        <div className="p-4 bg-white rounded-xl border border-gray-200">
          <h3 className="text-lg font-semibold text-charcoal mb-4 flex items-center gap-2">
            Bölüm Başlıkları Stili
            <span className="text-xs font-normal text-gray-500">(Navigation, Leistungen, Kontakt)</span>
          </h3>
          {renderStyleEditor('sectionTitle', 'Bölüm Başlığı')}
        </div>
      )}
    </div>
  )
}
