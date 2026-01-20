'use client'

import { useState, useEffect } from 'react'

import { CategoryFormData, Category } from '../types'

interface CategoryFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CategoryFormData) => Promise<boolean>
  editingCategory?: Category | null
  isLoading: boolean
  existingCategories: Category[]
}

const PREDEFINED_COLORS = [
  { name: 'Sage', value: '#10B981' },
  { name: 'Forest', value: '#059669' },
  { name: 'Earth', value: '#92400E' },
  { name: 'Ocean', value: '#0EA5E9' },
  { name: 'Sunset', value: '#F59E0B' },
  { name: 'Rose', value: '#E11D48' },
  { name: 'Lavender', value: '#8B5CF6' },
  { name: 'Charcoal', value: '#374151' }
]

const PREDEFINED_ICONS = [
  '🌿', '💆', '🧘', '💅', '✨', '🌸', '🏥', '💊', 
  '🍽️', '☕', '🍕', '🥗', '🛍️', '👕', '📱', '🎨'
]

export default function CategoryForm({
  isOpen,
  onClose,
  onSubmit,
  editingCategory,
  isLoading,
  existingCategories
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    description: '',
    color: PREDEFINED_COLORS[0]?.value || '#10B981',
    icon: PREDEFINED_ICONS[0] || '🌿',
    active: true,
    order: 0
  })

  const [errors, setErrors] = useState<Partial<Record<keyof CategoryFormData, string>>>({})
  const [showCustomColorInput, setShowCustomColorInput] = useState(false)

  // Initialize form when modal opens or editing category changes
  useEffect(() => {
    if (isOpen) {
      if (editingCategory) {
        setFormData({
          name: editingCategory.name,
          description: editingCategory.description || '',
          color: editingCategory.color,
          icon: editingCategory.icon || PREDEFINED_ICONS[0] || '🌿',
          active: editingCategory.active,
          order: editingCategory.order
        })
      } else {
        // New category - set order to next available
        const maxOrder = Math.max(...existingCategories.map(cat => cat.order), 0)
        setFormData({
          name: '',
          description: '',
          color: PREDEFINED_COLORS[0]?.value || '#10B981',
          icon: PREDEFINED_ICONS[0] || '🌿',
          active: true,
          order: maxOrder + 1
        })
      }
      setErrors({})
      setShowCustomColorInput(false)
    }
  }, [isOpen, editingCategory, existingCategories])

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CategoryFormData, string>> = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Kategori adı gereklidir'
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Kategori adı en az 2 karakter olmalıdır'
    } else {
      // Check for duplicate names
      const isDuplicate = existingCategories.some(cat => 
        cat.name.toLowerCase() === formData.name.trim().toLowerCase() &&
        cat.id !== editingCategory?.id
      )
      if (isDuplicate) {
        newErrors.name = 'Bu kategori adı zaten kullanılıyor'
      }
    }

    // Color validation
    if (!formData.color) {
      newErrors.color = 'Renk seçimi gereklidir'
    }

    // Order validation
    if (typeof formData.order !== 'number' || formData.order < 1) {
      newErrors.order = 'Sıralama 1\'den büyük olmalıdır'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const success = await onSubmit({
      ...formData,
      name: formData.name.trim(),
      description: formData.description.trim()
    })

    if (success) {
      onClose()
    }
  }

  const handleInputChange = (field: keyof CategoryFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleColorSelect = (color: string) => {
    handleInputChange('color', color)
    setShowCustomColorInput(false)
  }

  if (!isOpen) {
return null
}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-charcoal">
              {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori Ekle'}
            </h2>
            <button
              onClick={onClose}
              disabled={isLoading}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Category Name */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Kategori Adı *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-200'
              }`}
              placeholder="Örn: Spa Tedavileri, Masaj, Güzellik"
              disabled={isLoading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Açıklama
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              placeholder="Kategori hakkında kısa açıklama (isteğe bağlı)"
              disabled={isLoading}
            />
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Kategori Rengi *
            </label>
            <div className="space-y-4">
              {/* Predefined Colors */}
              <div className="grid grid-cols-4 gap-3">
                {PREDEFINED_COLORS.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleColorSelect(color.value)}
                    className={`h-12 rounded-xl transition-all ${
                      formData.color === color.value
                        ? 'ring-2 ring-sage-500 ring-offset-2'
                        : 'hover:ring-2 hover:ring-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                    disabled={isLoading}
                  />
                ))}
              </div>

              {/* Custom Color */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowCustomColorInput(!showCustomColorInput)}
                  className="text-sm text-sage-600 hover:text-forest-600 transition-colors"
                  disabled={isLoading}
                >
                  Özel renk seç
                </button>
                {showCustomColorInput && (
                  <div className="mt-2 flex items-center space-x-3">
                    <input
                      type="color"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="h-10 w-16 border border-gray-200 rounded-lg cursor-pointer"
                      disabled={isLoading}
                    />
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => handleInputChange('color', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="#000000"
                      disabled={isLoading}
                    />
                  </div>
                )}
              </div>
            </div>
            {errors.color && (
              <p className="mt-1 text-sm text-red-600">{errors.color}</p>
            )}
          </div>

          {/* Icon Selection */}
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Kategori İkonu
            </label>
            <div className="grid grid-cols-8 gap-3">
              {PREDEFINED_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => handleInputChange('icon', icon)}
                  className={`h-12 w-12 rounded-xl border-2 transition-all flex items-center justify-center text-xl ${
                    formData.icon === icon
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-gray-200 hover:border-sage-300'
                  }`}
                  disabled={isLoading}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* Order and Status */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Sıralama *
              </label>
              <input
                type="number"
                min="1"
                value={formData.order}
                onChange={(e) => handleInputChange('order', parseInt(e.target.value) || 1)}
                className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
                  errors.order ? 'border-red-300' : 'border-gray-200'
                }`}
                disabled={isLoading}
              />
              {errors.order && (
                <p className="mt-1 text-sm text-red-600">{errors.order}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-2">
                Durum
              </label>
              <label className="flex items-center mt-3">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => handleInputChange('active', e.target.checked)}
                  className="rounded border-gray-300 text-sage-600 shadow-sm focus:border-sage-300 focus:ring focus:ring-sage-200 focus:ring-opacity-50"
                  disabled={isLoading}
                />
                <span className="ml-2 text-sm text-charcoal">Aktif</span>
              </label>
            </div>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="font-medium text-charcoal mb-3">Önizleme</h4>
            <div className="flex items-center space-x-3">
              <div
                className="h-10 w-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: formData.color }}
              >
                <span className="text-white text-lg">{formData.icon}</span>
              </div>
              <div>
                <div className="font-medium text-charcoal">
                  {formData.name || 'Kategori Adı'}
                </div>
                {formData.description && (
                  <div className="text-sm text-gray-600">{formData.description}</div>
                )}
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 rounded-xl text-charcoal hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-sage-500 hover:bg-forest-600 disabled:opacity-50 text-white rounded-xl transition-colors"
            >
              {isLoading ? 'Kaydediliyor...' : (editingCategory ? 'Güncelle' : 'Oluştur')}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}