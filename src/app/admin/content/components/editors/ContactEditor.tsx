'use client'

import { ContentSection } from '../types'

interface ContactEditorProps {
  section: ContentSection
  isEditing: boolean
  editingContent: any
  updateField: (field: string, value: any) => void
  updateNestedField: (parent: string, field: string, value: any) => void
}

export function ContactEditor({
  section,
  isEditing,
  editingContent,
  updateField,
  updateNestedField
}: ContactEditorProps) {
  const content = isEditing ? editingContent : section.content

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">İşletme Adı</label>
          <input
            type="text"
            value={content.businessName || ''}
            onChange={(e) => updateField('businessName', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">Telefon</label>
          <input
            type="text"
            value={content.phone || ''}
            onChange={(e) => updateField('phone', e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">E-Mail</label>
        <input
          type="email"
          value={content.email || ''}
          onChange={(e) => updateField('email', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
      </div>

      <div>
        <h3 className="text-lg font-semibold text-charcoal mb-4">Adres Bilgileri</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Sokak</label>
            <input
              type="text"
              value={content.address?.street || ''}
              onChange={(e) => updateNestedField('address', 'street', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Şehir</label>
            <input
              type="text"
              value={content.address?.city || ''}
              onChange={(e) => updateNestedField('address', 'city', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Posta Kodu</label>
            <input
              type="text"
              value={content.address?.postalCode || ''}
              onChange={(e) => updateNestedField('address', 'postalCode', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">Ülke</label>
            <input
              type="text"
              value={content.address?.country || ''}
              onChange={(e) => updateNestedField('address', 'country', e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
