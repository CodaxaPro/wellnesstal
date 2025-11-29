'use client'

import { useState } from 'react'
import { Category } from '../types'

interface CategoriesListProps {
  categories: Category[]
  isLoading: boolean
  selectedCategories: string[]
  onSelectCategory: (categoryId: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onEdit: (category: Category) => void
  onDelete: (categoryId: string) => void
  onToggleActive: (categoryId: string) => void
  onReorder: (newOrder: { id: string; order: number }[]) => void
}

export default function CategoriesList({
  categories,
  isLoading,
  selectedCategories,
  onSelectCategory,
  onSelectAll,
  onEdit,
  onDelete,
  onToggleActive,
  onReorder
}: CategoriesListProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, categoryId: string) => {
    setDraggedItem(categoryId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, categoryId: string) => {
    e.preventDefault()
    setDragOverItem(categoryId)
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverItem(null)
  }

  const handleDrop = (e: React.DragEvent, targetCategoryId: string) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem === targetCategoryId) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    const draggedIndex = categories.findIndex(cat => cat.id === draggedItem)
    const targetIndex = categories.findIndex(cat => cat.id === targetCategoryId)
    
    if (draggedIndex === -1 || targetIndex === -1) return

    // Create new order
    const reorderedCategories = [...categories]
    const [removed] = reorderedCategories.splice(draggedIndex, 1)
    reorderedCategories.splice(targetIndex, 0, removed)

    // Generate new order values
    const newOrder = reorderedCategories.map((cat, index) => ({
      id: cat.id,
      order: index + 1
    }))

    onReorder(newOrder)
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleDeleteClick = (categoryId: string, categoryName: string) => {
    if (window.confirm(`"${categoryName}" kategorisini silmek istediğinizden emin misiniz?`)) {
      onDelete(categoryId)
    }
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Kategoriler yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-charcoal mb-2">Henüz kategori yok</h3>
          <p className="text-gray-600">İlk kategoriyi oluşturarak başlayın.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-charcoal">
          Kategoriler ({categories.length})
        </h2>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedCategories.length === categories.length && categories.length > 0}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="rounded border-gray-300 text-sage-600"
            />
            <span className="text-sm text-gray-600">Tümünü Seç</span>
          </label>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left w-12">
                <input
                  type="checkbox"
                  checked={selectedCategories.length === categories.length && categories.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-sage-600"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sıra
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {categories.map((category) => (
              <tr
                key={category.id}
                draggable
                onDragStart={(e) => handleDragStart(e, category.id)}
                onDragOver={(e) => handleDragOver(e, category.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, category.id)}
                className={`hover:bg-gray-50 transition-colors cursor-move ${
                  selectedCategories.includes(category.id) ? 'bg-sage-50' : ''
                } ${
                  dragOverItem === category.id ? 'border-t-2 border-sage-500' : ''
                } ${
                  draggedItem === category.id ? 'opacity-50' : ''
                }`}
              >
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={(e) => onSelectCategory(category.id, e.target.checked)}
                    className="rounded border-gray-300 text-sage-600"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">{category.order}</span>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div 
                      className="h-8 w-8 rounded-lg flex items-center justify-center mr-3"
                      style={{ backgroundColor: category.color }}
                    >
                      {category.icon ? (
                        <span className="text-white text-sm">{category.icon}</span>
                      ) : (
                        <span className="text-white text-sm">#</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-charcoal">{category.name}</div>
                      {category.description && (
                        <div className="text-sm text-gray-500">{category.description}</div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => onToggleActive(category.id)}
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                      category.active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-red-100 text-red-800 hover:bg-red-200'
                    }`}
                  >
                    {category.active ? 'Aktif' : 'Pasif'}
                  </button>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <button
                      onClick={() => onEdit(category)}
                      className="text-sage-600 hover:text-forest-600 transition-colors"
                      title="Düzenle"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteClick(category.id, category.name)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                      title="Sil"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}