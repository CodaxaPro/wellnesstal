'use client'

import { useState } from 'react'

import { Trash2, GripVertical, Star, Pin, Plus, ChevronDown, ChevronUp, FolderPlus } from 'lucide-react'

import { FAQContent, FAQItem, FAQCategory } from '../../types'

interface ItemsTabProps {
  content: FAQContent
  updateContent: (updates: Partial<FAQContent>) => void
}

const generateId = () => Math.random().toString(36).substring(2, 9)

export default function ItemsTab({ content, updateContent }: ItemsTabProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null)
  const [showCategoryForm, setShowCategoryForm] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  const items = content.items || []
  const categories = content.categories || []

  // Item Management
  const addItem = () => {
    const newItem: FAQItem = {
      id: generateId(),
      question: 'Yeni Soru',
      answer: 'Cevap metni buraya...',
      order: items.length
    }
    updateContent({
      items: [...items, newItem]
    })
    setExpandedItem(newItem.id)
  }

  const updateItem = (id: string, updates: Partial<FAQItem>) => {
    updateContent({
      items: items.map(item => item.id === id ? { ...item, ...updates } : item)
    })
  }

  const removeItem = (id: string) => {
    updateContent({
      items: items.filter(item => item.id !== id)
    })
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= items.length) {
return
}

    const newItems = [...items]
    const [removed] = newItems.splice(index, 1)
    newItems.splice(newIndex, 0, removed)

    // Update order values
    newItems.forEach((item, i) => {
      item.order = i
    })

    updateContent({ items: newItems })
  }

  const duplicateItem = (item: FAQItem) => {
    const newItem: FAQItem = {
      ...item,
      id: generateId(),
      question: `${item.question} (Kopya)`,
      order: items.length
    }
    updateContent({
      items: [...items, newItem]
    })
  }

  // Category Management
  const addCategory = () => {
    if (!newCategoryName.trim()) {
return
}

    const newCategory: FAQCategory = {
      id: generateId(),
      name: newCategoryName.trim(),
      order: categories.length
    }
    updateContent({
      categories: [...categories, newCategory]
    })
    setNewCategoryName('')
    setShowCategoryForm(false)
  }

  const removeCategory = (id: string) => {
    // Remove category and clear categoryId from items
    updateContent({
      categories: categories.filter(cat => cat.id !== id),
      items: items.map(item => item.categoryId === id ? { ...item, categoryId: undefined } : item)
    })
  }

  return (
    <div className="space-y-6">
      {/* Categories Section */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-6 h-6 bg-amber-100 rounded-lg flex items-center justify-center text-amber-600">K</span>
            Kategoriler
          </h3>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.showCategories ?? false}
              onChange={(e) => updateContent({ showCategories: e.target.checked })}
              className="rounded border-slate-300 text-sage-500"
            />
            <span className="text-xs text-slate-600">Aktif</span>
          </label>
        </div>

        {content.showCategories && (
          <div className="space-y-3">
            {/* Category List */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <div
                    key={cat.id}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg"
                  >
                    <span className="text-sm text-slate-700">{cat.name}</span>
                    <button
                      onClick={() => removeCategory(cat.id)}
                      className="text-slate-400 hover:text-red-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add Category */}
            {showCategoryForm ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                  placeholder="Kategori adi..."
                  autoFocus
                  onKeyDown={(e) => e.key === 'Enter' && addCategory()}
                />
                <button
                  onClick={addCategory}
                  className="px-4 py-2 bg-sage-500 text-white rounded-lg text-sm hover:bg-sage-600"
                >
                  Ekle
                </button>
                <button
                  onClick={() => {
 setShowCategoryForm(false); setNewCategoryName('') 
}}
                  className="px-4 py-2 bg-slate-100 text-slate-600 rounded-lg text-sm hover:bg-slate-200"
                >
                  Iptal
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCategoryForm(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-sage-600 hover:text-sage-700"
              >
                <FolderPlus className="w-4 h-4" />
                Kategori Ekle
              </button>
            )}
          </div>
        )}
      </div>

      {/* FAQ Items */}
      <div className="bg-white rounded-xl p-4 border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
            <span className="w-6 h-6 bg-sage-100 rounded-lg flex items-center justify-center text-sage-600">S</span>
            Sorular ({items.length})
          </h3>
          <button
            onClick={addItem}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-sage-500 text-white text-sm rounded-lg hover:bg-sage-600 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Soru Ekle
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400 text-sm">Henuz soru eklenmedi</p>
            <button
              onClick={addItem}
              className="mt-2 text-sage-600 text-sm hover:text-sage-700"
            >
              Ilk soruyu ekle
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={`border rounded-xl overflow-hidden transition-all ${
                  expandedItem === item.id
                    ? 'border-sage-300 shadow-sm'
                    : 'border-slate-200'
                }`}
              >
                {/* Item Header */}
                <div
                  className="flex items-center gap-2 p-3 bg-slate-50 cursor-pointer"
                  onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                >
                  <GripVertical className="w-4 h-4 text-slate-400" />

                  {/* Order Controls */}
                  <div className="flex flex-col">
                    <button
                      onClick={(e) => {
 e.stopPropagation(); moveItem(index, 'up') 
}}
                      className="p-0.5 hover:bg-slate-200 rounded disabled:opacity-30"
                      disabled={index === 0}
                    >
                      <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                    <button
                      onClick={(e) => {
 e.stopPropagation(); moveItem(index, 'down') 
}}
                      className="p-0.5 hover:bg-slate-200 rounded disabled:opacity-30"
                      disabled={index === items.length - 1}
                    >
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                  </div>

                  <span className="text-xs text-slate-400 w-6">#{index + 1}</span>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-700 truncate">
                      {item.question || 'Basliksiz Soru'}
                    </p>
                  </div>

                  {/* Badges */}
                  <div className="flex items-center gap-1.5">
                    {item.pinned && (
                      <Pin className="w-3.5 h-3.5 text-blue-500 fill-blue-500" />
                    )}
                    {item.featured && (
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    )}
                  </div>

                  {/* Expand Icon */}
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform ${
                      expandedItem === item.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>

                {/* Item Content */}
                {expandedItem === item.id && (
                  <div className="p-4 space-y-4 border-t border-slate-200">
                    {/* Question */}
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Soru</label>
                      <input
                        type="text"
                        value={item.question ?? ''}
                        onChange={(e) => updateItem(item.id, { question: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        placeholder="Soru metni..."
                      />
                    </div>

                    {/* Answer */}
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Cevap</label>
                      <textarea
                        value={item.answer ?? ''}
                        onChange={(e) => updateItem(item.id, { answer: e.target.value })}
                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm resize-none"
                        rows={4}
                        placeholder="Cevap metni..."
                      />
                    </div>

                    {/* Category Selection */}
                    {content.showCategories && categories.length > 0 && (
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1.5">Kategori</label>
                        <select
                          value={item.categoryId || ''}
                          onChange={(e) => updateItem(item.id, { categoryId: e.target.value || undefined })}
                          className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
                        >
                          <option value="">Kategori secin...</option>
                          {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Options Row */}
                    <div className="flex flex-wrap gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.featured ?? false}
                          onChange={(e) => updateItem(item.id, { featured: e.target.checked })}
                          className="rounded border-slate-300 text-amber-500"
                        />
                        <span className="text-sm text-slate-600">One Cikan</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={item.pinned ?? false}
                          onChange={(e) => updateItem(item.id, { pinned: e.target.checked })}
                          className="rounded border-slate-300 text-blue-500"
                        />
                        <span className="text-sm text-slate-600">Sabitlenmis</span>
                      </label>
                    </div>

                    {/* Related Links */}
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1.5">Ilgili Baglantilar</label>
                      <div className="space-y-2">
                        {(item.relatedLinks || []).map((link, linkIndex) => (
                          <div key={linkIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={link.text ?? ''}
                              onChange={(e) => {
                                const newLinks = [...(item.relatedLinks || [])]
                                newLinks[linkIndex] = { ...newLinks[linkIndex], text: e.target.value }
                                updateItem(item.id, { relatedLinks: newLinks })
                              }}
                              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                              placeholder="Link metni"
                            />
                            <input
                              type="text"
                              value={link.url ?? ''}
                              onChange={(e) => {
                                const newLinks = [...(item.relatedLinks || [])]
                                newLinks[linkIndex] = { ...newLinks[linkIndex], url: e.target.value }
                                updateItem(item.id, { relatedLinks: newLinks })
                              }}
                              className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm"
                              placeholder="URL"
                            />
                            <button
                              onClick={() => {
                                const newLinks = (item.relatedLinks || []).filter((_, i) => i !== linkIndex)
                                updateItem(item.id, { relatedLinks: newLinks })
                              }}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                        <button
                          onClick={() => {
                            const newLinks = [...(item.relatedLinks || []), { text: '', url: '' }]
                            updateItem(item.id, { relatedLinks: newLinks })
                          }}
                          className="text-sm text-sage-600 hover:text-sage-700"
                        >
                          + Baglanti Ekle
                        </button>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between pt-3 border-t border-slate-100">
                      <button
                        onClick={() => duplicateItem(item)}
                        className="text-sm text-slate-500 hover:text-slate-700"
                      >
                        Kopyala
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                        Sil
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Add New Button */}
        {items.length > 0 && (
          <button
            onClick={addItem}
            className="w-full mt-4 py-3 border-2 border-dashed border-slate-300 rounded-xl text-sm text-slate-600 hover:border-sage-400 hover:text-sage-600 transition-colors"
          >
            + Yeni Soru Ekle
          </button>
        )}
      </div>
    </div>
  )
}
