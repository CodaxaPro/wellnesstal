'use client'

import { ContentSection } from '../types'

interface MetaEditorProps {
  section: ContentSection
  isEditing: boolean
  editingContent: any
  updateField: (field: string, value: any) => void
}

export function MetaEditor({
  section,
  isEditing,
  editingContent,
  updateField
}: MetaEditorProps) {
  const content = isEditing ? editingContent : section.content

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">Site Başlığı</label>
        <input
          type="text"
          value={content.siteTitle || ''}
          onChange={(e) => updateField('siteTitle', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">Site Açıklaması</label>
        <textarea
          rows={3}
          value={content.siteDescription || ''}
          onChange={(e) => updateField('siteDescription', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">Anahtar Kelimeler (virgülle ayırın)</label>
        <input
          type="text"
          value={content.keywords || ''}
          onChange={(e) => updateField('keywords', e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent disabled:bg-gray-50"
        />
      </div>
    </div>
  )
}
