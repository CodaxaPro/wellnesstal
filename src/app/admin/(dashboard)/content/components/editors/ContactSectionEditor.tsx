'use client'

import { StyleEditor, IconStyleEditor } from '../StyleEditors'
import { ContentSection } from '../types'

interface ContactSectionEditorProps {
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
  isNestedContentChanged: (path: string) => boolean
  resetNestedContentToDefault: (path: string) => void
  updateNestedField: (parent: string, field: string, value: any) => void
}

export function ContactSectionEditor({
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
  isNestedContentChanged,
  resetNestedContentToDefault,
  updateNestedField
}: ContactSectionEditorProps) {
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

  const renderIconStyleEditor = (fieldName: string, label: string) => (
    <IconStyleEditor
      fieldName={fieldName}
      label={label}
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

  const ResetButton = ({ path }: { path: string }) => {
    if (!isEditing || !isNestedContentChanged(path)) {
return null
}
    return (
      <button
        type="button"
        onClick={() => resetNestedContentToDefault(path)}
        className="text-amber-500 hover:text-amber-600 transition-colors"
        title="Orijinale Dön"
      >
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </button>
    )
  }

  return (
    <div className="space-y-6">
      {/* Reset All Button */}
      {isEditing && currentDefaults && (
        <div className="flex justify-end pb-4 border-b border-gray-200">
          <button
            type="button"
            onClick={resetAllToDefaults}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-sage-600 hover:text-sage-700 bg-sage-50 hover:bg-sage-100 rounded-lg transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Orijinale Dön
          </button>
        </div>
      )}

      {/* Section Header */}
      <div className="bg-sage-50 border border-sage-200 rounded-xl p-4 mb-6">
        <h3 className="text-lg font-semibold text-charcoal mb-2">Kontakt Bölümü</h3>
        <p className="text-sm text-gray-600">Ana sayfadaki İletişim bölümünün içerik ve görsel ayarları</p>
      </div>

      {/* ============================================ */}
      {/* ENTERPRISE: İŞLETME BİLGİLERİ */}
      {/* ============================================ */}
      <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border-2 border-blue-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">🏢</div>
          <div>
            <h3 className="text-xl font-bold text-charcoal">İşletme Bilgileri</h3>
            <p className="text-sm text-gray-600">Bu bilgiler ContactSection ve Footer'da görünür</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              İşletme Adı
              <span className="ml-2 text-xs font-normal text-gray-500">(ContactSection başlığında görünür)</span>
            </label>
            <input
              type="text"
              value={content.businessInfo?.name || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, name: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="WellnessTal Studio"
            />
            <p className="mt-1 text-xs text-gray-500">Ana sayfadaki ContactSection'da harita üzerinde görünen isim</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Tagline
              <span className="ml-2 text-xs font-normal text-gray-500">(Alt başlık)</span>
            </label>
            <input
              type="text"
              value={content.businessInfo?.tagline || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, tagline: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="Premium Wellness & Headspa in Baesweiler"
            />
            <p className="mt-1 text-xs text-gray-500">İşletme adının altında görünen kısa açıklama</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Açıklama
              <span className="ml-2 text-xs font-normal text-gray-500">(Detaylı açıklama)</span>
            </label>
            <textarea
              rows={3}
              value={content.businessInfo?.description || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                businessInfo: { ...prev.businessInfo, description: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="Ihre Oase der Entspannung im Herzen von Baesweiler..."
            />
            <p className="mt-1 text-xs text-gray-500">Footer'da görünen işletme açıklaması</p>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* ENTERPRISE: İLETİŞİM BİLGİLERİ */}
      {/* ============================================ */}
      <div className="mt-6 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">📞</div>
          <div>
            <h3 className="text-xl font-bold text-charcoal">İletişim Bilgileri</h3>
            <p className="text-sm text-gray-600">ContactSection kartlarında ve Footer'da görünür</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Telefon
              <span className="ml-2 text-xs font-normal text-gray-500">(Telefon kartında görünür)</span>
            </label>
            <input
              type="tel"
              value={content.contact?.phone || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                contact: { ...prev.contact, phone: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="+49 1733828581"
            />
            <p className="mt-1 text-xs text-gray-500">ContactSection'daki telefon kartında tıklanabilir link olarak görünür</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              E-Mail
              <span className="ml-2 text-xs font-normal text-gray-500">(E-Mail kartında görünür)</span>
            </label>
            <input
              type="email"
              value={content.contact?.email || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                contact: { ...prev.contact, email: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="info@wellnesstal.de"
            />
            <p className="mt-1 text-xs text-gray-500">ContactSection'daki e-mail kartında mailto: linki olarak görünür</p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              WhatsApp
              <span className="ml-2 text-xs font-normal text-gray-500">(WhatsApp kartında görünür)</span>
            </label>
            <input
              type="text"
              value={content.contact?.whatsapp || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                contact: { ...prev.contact, whatsapp: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="+49 1733828581"
            />
            <p className="mt-1 text-xs text-gray-500">ContactSection'daki WhatsApp kartında wa.me linki olarak görünür</p>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* ENTERPRISE: ADRES BİLGİLERİ */}
      {/* ============================================ */}
      <div className="mt-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border-2 border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">📍</div>
          <div>
            <h3 className="text-xl font-bold text-charcoal">Adres Bilgileri</h3>
            <p className="text-sm text-gray-600">ContactSection haritasında ve Footer'da görünür</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Sokak ve Numara
              <span className="ml-2 text-xs font-normal text-gray-500">(Harita üzerinde görünür)</span>
            </label>
            <input
              type="text"
              value={content.address?.street || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                address: { ...prev.address, street: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="Reyplatz 10"
            />
            <p className="mt-1 text-xs text-gray-500">ContactSection haritasında "Sokak, Posta Kodu Şehir" formatında görünür</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Posta Kodu</label>
              <input
                type="text"
                value={content.address?.postalCode || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  address: { ...prev.address, postalCode: e.target.value }
                }))}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="52499"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Şehir</label>
              <input
                type="text"
                value={content.address?.city || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  address: { ...prev.address, city: e.target.value }
                }))}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Baesweiler"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-charcoal mb-2">Ülke</label>
              <input
                type="text"
                value={content.address?.country || ''}
                onChange={(e) => setEditingContent((prev: any) => ({
                  ...prev,
                  address: { ...prev.address, country: e.target.value }
                }))}
                disabled={!isEditing}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
                placeholder="Deutschland"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Google Maps URL
              <span className="ml-2 text-xs font-normal text-gray-500">(Harita butonunda kullanılır)</span>
            </label>
            <input
              type="url"
              value={content.address?.googleMapsUrl || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                address: { ...prev.address, googleMapsUrl: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="https://maps.google.com/?q=..."
            />
            <p className="mt-1 text-xs text-gray-500">ContactSection haritasındaki "In Google Maps öffnen" butonuna tıklandığında açılır</p>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* ENTERPRISE: AÇILIŞ SAATLERİ */}
      {/* ============================================ */}
      <div className="mt-6 p-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border-2 border-amber-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-amber-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">🕐</div>
          <div>
            <h3 className="text-xl font-bold text-charcoal">Açılış Saatleri</h3>
            <p className="text-sm text-gray-600">ContactSection'da haftalık açılış saatleri tablosu olarak görünür</p>
          </div>
        </div>

        <div className="space-y-3">
          {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
            const dayLabels: Record<string, string> = {
              monday: 'Montag',
              tuesday: 'Dienstag',
              wednesday: 'Mittwoch',
              thursday: 'Donnerstag',
              friday: 'Freitag',
              saturday: 'Samstag',
              sunday: 'Sonntag'
            }
            return (
              <div key={day} className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-200">
                <div className="w-24 text-sm font-medium text-charcoal">{dayLabels[day]}</div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={content.openingHours?.[day]?.closed || false}
                    onChange={(e) => setEditingContent((prev: any) => ({
                      ...prev,
                      openingHours: {
                        ...prev.openingHours,
                        [day]: { ...prev.openingHours?.[day], closed: e.target.checked }
                      }
                    }))}
                    disabled={!isEditing}
                    className="rounded border-gray-300 text-amber-600"
                  />
                  <span className="text-sm text-gray-600">Geschlossen</span>
                </label>
                {!content.openingHours?.[day]?.closed && (
                  <div className="flex items-center gap-2">
                    <input
                      type="time"
                      value={content.openingHours?.[day]?.open || '09:00'}
                      onChange={(e) => setEditingContent((prev: any) => ({
                        ...prev,
                        openingHours: {
                          ...prev.openingHours,
                          [day]: { ...prev.openingHours?.[day], open: e.target.value }
                        }
                      }))}
                      disabled={!isEditing}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                    <span className="text-gray-400">-</span>
                    <input
                      type="time"
                      value={content.openingHours?.[day]?.close || '19:00'}
                      onChange={(e) => setEditingContent((prev: any) => ({
                        ...prev,
                        openingHours: {
                          ...prev.openingHours,
                          [day]: { ...prev.openingHours?.[day], close: e.target.value }
                        }
                      }))}
                      disabled={!isEditing}
                      className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>
        <p className="mt-3 text-xs text-gray-500">Bu saatler ContactSection'da "Öffnungszeiten" tablosunda görünür. Bugün olan gün vurgulanır.</p>
      </div>

      {/* ============================================ */}
      {/* ENTERPRISE: SOSYAL MEDYA */}
      {/* ============================================ */}
      <div className="mt-6 p-6 bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl border-2 border-pink-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-pink-500 rounded-xl flex items-center justify-center text-white text-xl font-bold">📱</div>
          <div>
            <h3 className="text-xl font-bold text-charcoal">Sosyal Medya</h3>
            <p className="text-sm text-gray-600">Footer'da sosyal medya ikonları olarak görünür</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Instagram URL
              <span className="ml-2 text-xs font-normal text-gray-500">(Footer'da Instagram ikonu)</span>
            </label>
            <input
              type="url"
              value={content.socialMedia?.instagram || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, instagram: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="https://instagram.com/wellnesstal"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Facebook URL
              <span className="ml-2 text-xs font-normal text-gray-500">(Footer'da Facebook ikonu)</span>
            </label>
            <input
              type="url"
              value={content.socialMedia?.facebook || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, facebook: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="https://facebook.com/wellnesstal"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              WhatsApp Business URL
              <span className="ml-2 text-xs font-normal text-gray-500">(Footer'da WhatsApp ikonu)</span>
            </label>
            <input
              type="url"
              value={content.socialMedia?.whatsapp || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, whatsapp: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="https://wa.me/491733828581"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-charcoal mb-2">
              Website URL
              <span className="ml-2 text-xs font-normal text-gray-500">(Footer'da website linki)</span>
            </label>
            <input
              type="url"
              value={content.socialMedia?.website || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                socialMedia: { ...prev.socialMedia, website: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50"
              placeholder="https://wellnesstal.de"
            />
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-500">Bu linkler Footer'ın alt kısmında sosyal medya ikonları olarak görünür</p>
      </div>

      {/* ============================================ */}
      {/* GÖRÜNÜM AYARLARI */}
      {/* ============================================ */}
      <div className="mt-8 pt-8 border-t-2 border-gray-300">
        <div className="bg-sage-50 border border-sage-200 rounded-xl p-4 mb-6">
          <h3 className="text-lg font-semibold text-charcoal mb-2">Görünüm Ayarları</h3>
          <p className="text-sm text-gray-600">ContactSection'ın görsel stilleri ve metin içerikleri</p>
        </div>

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

      {/* Section Title */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Bölüm Başlığı</label>
        <input
          type="text"
          value={content.sectionTitle || ''}
          onChange={(e) => updateField('sectionTitle', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
        {isEditing && renderStyleEditor('sectionTitle', 'Bölüm Başlığı')}
      </div>

      {/* Highlighted Text */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <label className="block text-sm font-semibold text-charcoal mb-2">Vurgulanan Metin</label>
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

      {/* Cards Section */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <h4 className="text-md font-semibold text-charcoal mb-4">Kart İçerikleri</h4>

        {/* Phone Card */}
        <div className="p-3 bg-gray-50 rounded-lg mb-3">
          <h5 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-sage-500 rounded-full flex items-center justify-center text-white text-xs">P</span>
            Telefon Kartı
          </h5>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-500">Başlık</label>
              <ResetButton path="cards.phone.title" />
            </div>
            <input
              type="text"
              value={content.cards?.phone?.title || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                cards: { ...prev.cards, phone: { ...prev.cards?.phone, title: e.target.value } }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
            />
            {isEditing && renderStyleEditor('phoneCardTitle', 'Telefon Başlık Stili')}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-500">Açıklama</label>
              <ResetButton path="cards.phone.description" />
            </div>
            <input
              type="text"
              value={content.cards?.phone?.description || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                cards: { ...prev.cards, phone: { ...prev.cards?.phone, description: e.target.value } }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
            />
            {isEditing && renderStyleEditor('phoneCardDescription', 'Telefon Açıklama Stili')}
          </div>
          {isEditing && renderIconStyleEditor('phoneCardIcon', 'Telefon İkon Renkleri')}
        </div>

        {/* WhatsApp Card */}
        <div className="p-3 bg-gray-50 rounded-lg mb-3">
          <h5 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">W</span>
            WhatsApp Kartı
          </h5>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-500">Başlık</label>
              <ResetButton path="cards.whatsapp.title" />
            </div>
            <input
              type="text"
              value={content.cards?.whatsapp?.title || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                cards: { ...prev.cards, whatsapp: { ...prev.cards?.whatsapp, title: e.target.value } }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
            />
            {isEditing && renderStyleEditor('whatsappCardTitle', 'WhatsApp Başlık Stili')}
          </div>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-500">Açıklama</label>
              <ResetButton path="cards.whatsapp.description" />
            </div>
            <input
              type="text"
              value={content.cards?.whatsapp?.description || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                cards: { ...prev.cards, whatsapp: { ...prev.cards?.whatsapp, description: e.target.value } }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
            />
            {isEditing && renderStyleEditor('whatsappCardDescription', 'WhatsApp Açıklama Stili')}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-500">Link Metni</label>
              <ResetButton path="cards.whatsapp.linkText" />
            </div>
            <input
              type="text"
              value={content.cards?.whatsapp?.linkText || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                cards: { ...prev.cards, whatsapp: { ...prev.cards?.whatsapp, linkText: e.target.value } }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
            />
            {isEditing && renderStyleEditor('whatsappCardLink', 'WhatsApp Link Stili')}
          </div>
          {isEditing && renderIconStyleEditor('whatsappCardIcon', 'WhatsApp İkon Renkleri')}
        </div>

        {/* Email Card */}
        <div className="p-3 bg-gray-50 rounded-lg mb-3">
          <h5 className="text-sm font-semibold text-charcoal mb-3 flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">E</span>
            E-Mail Kartı
          </h5>
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-500">Başlık</label>
              <ResetButton path="cards.email.title" />
            </div>
            <input
              type="text"
              value={content.cards?.email?.title || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                cards: { ...prev.cards, email: { ...prev.cards?.email, title: e.target.value } }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
            />
            {isEditing && renderStyleEditor('emailCardTitle', 'E-Mail Başlık Stili')}
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-500">Açıklama</label>
              <ResetButton path="cards.email.description" />
            </div>
            <input
              type="text"
              value={content.cards?.email?.description || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                cards: { ...prev.cards, email: { ...prev.cards?.email, description: e.target.value } }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
            />
            {isEditing && renderStyleEditor('emailCardDescription', 'E-Mail Açıklama Stili')}
          </div>
          {isEditing && renderIconStyleEditor('emailCardIcon', 'E-Mail İkon Renkleri')}
        </div>
      </div>

      {/* Map Section */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <h4 className="text-md font-semibold text-charcoal mb-4">Harita Bölümü</h4>
        <div className="flex items-center justify-between mb-1">
          <label className="block text-xs font-medium text-gray-500">Harita Butonu Metni</label>
          <ResetButton path="map.buttonText" />
        </div>
        <input
          type="text"
          value={content.map?.buttonText || ''}
          onChange={(e) => setEditingContent((prev: any) => ({
            ...prev,
            map: { ...prev.map, buttonText: e.target.value }
          }))}
          disabled={!isEditing}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
        />
        {isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {renderStyleEditor('mapTitle', 'Harita Başlığı')}
            {renderStyleEditor('mapAddress', 'Harita Adresi')}
            {renderStyleEditor('mapButton', 'Harita Butonu', true)}
          </div>
        )}
      </div>

      {/* Opening Hours Section */}
      <div className="p-4 bg-white rounded-xl border border-gray-200">
        <h4 className="text-md font-semibold text-charcoal mb-4">Açılış Saatleri Bölümü</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-500">Başlık</label>
              <ResetButton path="openingHours.title" />
            </div>
            <input
              type="text"
              value={content.openingHours?.title || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                openingHours: { ...prev.openingHours, title: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-500">"Bugün" Etiketi</label>
              <ResetButton path="openingHours.todayLabel" />
            </div>
            <input
              type="text"
              value={content.openingHours?.todayLabel || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                openingHours: { ...prev.openingHours, todayLabel: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-medium text-gray-500">"Kapalı" Etiketi</label>
              <ResetButton path="openingHours.closedLabel" />
            </div>
            <input
              type="text"
              value={content.openingHours?.closedLabel || ''}
              onChange={(e) => setEditingContent((prev: any) => ({
                ...prev,
                openingHours: { ...prev.openingHours, closedLabel: e.target.value }
              }))}
              disabled={!isEditing}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg disabled:bg-gray-100"
            />
          </div>
        </div>
        {isEditing && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            {renderStyleEditor('openingHoursTitle', 'Açılış Saatleri Başlığı')}
            {renderStyleEditor('dayLabel', 'Gün Etiketi')}
            {renderStyleEditor('timeLabel', 'Saat Etiketi')}
            {renderStyleEditor('todayBadge', 'Bugün Badge', true)}
            {renderStyleEditor('todayHighlight', 'Bugün Vurgusu', true)}
          </div>
        )}
      </div>
      </div>

    </div>
  )
}
