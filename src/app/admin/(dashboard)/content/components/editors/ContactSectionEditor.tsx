'use client'

import { ContentSection } from '../types'
import { StyleEditor, IconStyleEditor } from '../StyleEditors'

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
  resetNestedContentToDefault
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
    if (!isEditing || !isNestedContentChanged(path)) return null
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
        <h3 className="text-lg font-semibold text-charcoal mb-2">Contact Section Stilleri</h3>
        <p className="text-sm text-gray-600">Ana sayfadaki İletişim bölümünün içerik ve görsel ayarları</p>
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
  )
}
