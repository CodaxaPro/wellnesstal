'use client'

import { useState } from 'react'

interface Category {
  id: string
  name: string
  color: string
  icon?: string
  serviceCount?: number
  active?: boolean
  order?: number
}

interface CategoryManagerProps {
  isOpen: boolean
  onClose: () => void
  categories: Category[]
  onCategoryCreated: (category: Category) => void
  onCategoryUpdated: (category: Category) => void
  onCategoryDeleted: (categoryId: string) => void
  onCategorySelected?: (categoryId: string) => void
}

interface CategoryFormData {
  name: string
  description: string
  color: string
  icon: string
  active: boolean
}

export default function CategoryManager({
  isOpen,
  onClose,
  categories,
  onCategoryCreated,
  onCategoryUpdated,
  onCategoryDeleted,
  onCategorySelected
}: CategoryManagerProps) {
  const [currentView, setCurrentView] = useState<'list' | 'create' | 'edit'>('list')
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: '#10B981',
    icon: '🌿',
    active: true
  })

  const predefinedColors = [
    '#10B981', '#059669', '#E11D48', '#DC2626',
    '#7C3AED', '#5B21B6', '#EA580C', '#D97706',
    '#0EA5E9', '#0284C7', '#EC4899', '#DB2777'
  ]

  const predefinedIcons = [
    '🌿', '💆', '✨', '🧘', '💅', '🌸',
    '🏃', '🍃', '⭐', '💎', '🔥', '❤️'
  ]

  const handleInputChange = (field: keyof CategoryFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      color: '#10B981',
      icon: '🌿',
      active: true
    })
    setError('')
  }

  const handleCreateNew = () => {
    resetForm()
    setCurrentView('create')
    setEditingCategory(null)
  }

  const handleEdit = (category: Category) => {
    setFormData({
      name: category.name,
      description: '',
      color: category.color,
      icon: category.icon || '🌿',
      active: category.active ?? true
    })
    setEditingCategory(category)
    setCurrentView('edit')
    setError('')
  }

  const handleDelete = async (category: Category) => {
    if (category.serviceCount && category.serviceCount > 0) {
      setError(`Bu kategoride ${category.serviceCount} hizmet bulunuyor. Önce hizmetleri başka kategorilere taşıyın.`)
      return
    }

    if (!window.confirm(`"${category.name}" kategorisini silmek istediğinizden emin misiniz?`)) {
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/categories?id=${category.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer valid-admin-token' }
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Kategori silinemedi')
      }

      onCategoryDeleted(category.id)
      setError('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Kategori adı gereklidir')
      return
    }

    const isDuplicate = categories.some(cat => 
      cat.name.toLowerCase() === formData.name.trim().toLowerCase() &&
      cat.id !== editingCategory?.id
    )
    
    if (isDuplicate) {
      setError('Bu kategori adı zaten kullanılıyor')
      return
    }

    setIsLoading(true)
    try {
      const url = '/api/categories'
      const method = editingCategory ? 'PUT' : 'POST'
      
      const payload = editingCategory 
        ? { id: editingCategory.id, ...formData }
        : { 
            ...formData, 
            order: Math.max(...categories.map(c => c.order || 0), 0) + 1 
          }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer valid-admin-token'
        },
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Kategori kaydedilemedi')
      }

      const result = await response.json()
      
      if (editingCategory) {
        onCategoryUpdated(result.data)
      } else {
        onCategoryCreated(result.data)
        if (onCategorySelected) {
          onCategorySelected(result.data.id)
        }
      }

      resetForm()
      setCurrentView('list')
      setEditingCategory(null)
      setError('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackToList = () => {
    setCurrentView('list')
    setEditingCategory(null)
    resetForm()
    setError('')
  }

  const handleCategorySelect = (categoryId: string) => {
    if (onCategorySelected) {
      onCategorySelected(categoryId)
      onClose()
    }
  }

  if (!isOpen) {
return null
}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[60]">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentView !== 'list' && (
                <button
                  onClick={handleBackToList}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m0 7h18" />
                  </svg>
                </button>
              )}
              <h3 className="text-xl font-semibold text-charcoal">
                {currentView === 'list' && 'Kategori Yönetimi'}
                {currentView === 'create' && 'Yeni Kategori'}
                {currentView === 'edit' && 'Kategori Düzenle'}
              </h3>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {error && (
            <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {currentView === 'list' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <p className="text-gray-600">Mevcut kategorileri yönetin veya yeni kategori oluşturun</p>
                <button
                  onClick={handleCreateNew}
                  className="bg-sage-500 hover:bg-forest-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Yeni Kategori
                </button>
              </div>

              <div className="space-y-2">
                {categories.map((category) => (
                  <div key={category.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 rounded-md flex items-center justify-center text-white" style={{ backgroundColor: category.color }}>
                        {category.icon || '#'}
                      </div>
                      <div>
                        <div className="font-medium text-charcoal">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.serviceCount || 0} hizmet</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {onCategorySelected && (
                        <button onClick={() => handleCategorySelect(category.id)} className="text-sage-600 hover:text-forest-600 text-sm font-medium">
                          Seç
                        </button>
                      )}
                      <button onClick={() => handleEdit(category)} className="text-gray-600 hover:text-gray-800">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => handleDelete(category)} disabled={isLoading} className="text-red-600 hover:text-red-800 disabled:opacity-50">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {(currentView === 'create' || currentView === 'edit') && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Kategori Adı *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="z.B. Spa Tedavileri"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Açıklama</label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Kategori açıklaması..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Renk</label>
                <div className="grid grid-cols-6 gap-2">
                  {predefinedColors.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleInputChange('color', color)}
                      className={`w-10 h-10 rounded-lg border-2 ${formData.color === color ? 'border-gray-400' : 'border-gray-200'}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">İkon</label>
                <div className="grid grid-cols-6 gap-2">
                  {predefinedIcons.map((icon) => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => handleInputChange('icon', icon)}
                      className={`w-10 h-10 rounded-lg border-2 flex items-center justify-center text-xl ${
                        formData.icon === icon ? 'border-sage-500 bg-sage-50' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => handleInputChange('active', e.target.checked)}
                    className="rounded border-gray-300 text-sage-600"
                  />
                  <span className="ml-2 text-sm text-charcoal">Aktif kategori</span>
                </label>

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={handleBackToList}
                    disabled={isLoading}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-charcoal hover:bg-gray-50 disabled:opacity-50"
                  >
                    İptal
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="px-4 py-2 bg-sage-500 hover:bg-forest-600 disabled:opacity-50 text-white rounded-lg flex items-center gap-2"
                  >
                    {isLoading && (
                      <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    {isLoading ? 'Kaydediliyor...' : (editingCategory ? 'Güncelle' : 'Oluştur')}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}