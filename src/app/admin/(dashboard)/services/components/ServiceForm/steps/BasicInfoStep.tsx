'use client'

import { useState } from 'react'

import { ServiceFormData } from '../../../../../../types/services'
import CategoryManager from '../shared/CategoryManager'

interface Category {
  id: string
  name: string
  color: string
  icon?: string
  serviceCount?: number
  active?: boolean
  order?: number
}

interface BasicInfoStepProps {
  formData: ServiceFormData
  errors: Partial<ServiceFormData>
  categories: Category[]
  onInputChange: (field: keyof ServiceFormData, value: any) => void
  onCategoriesUpdate: (categories: Category[]) => void
}

export default function BasicInfoStep({
  formData,
  errors,
  categories,
  onInputChange,
  onCategoriesUpdate
}: BasicInfoStepProps) {
  const [isCategoryManagerOpen, setIsCategoryManagerOpen] = useState(false)

  const handleCategoryCreated = (newCategory: Category) => {
    const updatedCategories = [...categories, newCategory]
    onCategoriesUpdate(updatedCategories)
    // Auto-select the newly created category
    onInputChange('category', newCategory.id)
  }

  const handleCategoryUpdated = (updatedCategory: Category) => {
    const updatedCategories = categories.map(cat => 
      cat.id === updatedCategory.id ? updatedCategory : cat
    )
    onCategoriesUpdate(updatedCategories)
  }

  const handleCategoryDeleted = (categoryId: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId)
    onCategoriesUpdate(updatedCategories)
    // If deleted category was selected, clear selection
    if (formData.category === categoryId) {
      onInputChange('category', '')
    }
  }

  const handleCategorySelected = (categoryId: string) => {
    onInputChange('category', categoryId)
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-charcoal mb-4">Temel Bilgiler</h3>
      
      {/* Service Name & Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Hizmet Adı *
          </label>
          <input
            type="text"
            value={formData.title || ''}
            onChange={(e) => onInputChange('title', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
              errors.title ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="z.B. Premium Headspa"
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Kategori
          </label>
          <div className="flex gap-2">
            <select
              value={formData.category || ''}
              onChange={(e) => onInputChange('category', e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            >
              <option value="">Kategori seç...</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setIsCategoryManagerOpen(true)}
              className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-charcoal rounded-xl font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
              title="Kategori yönetimi"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Yönet
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Yeni kategori eklemek için "Yönet" butonuna tıklayın
          </p>
        </div>
      </div>

      {/* Descriptions */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Kısa Açıklama *
        </label>
        <input
          type="text"
          value={formData.shortDescription || ''}
          onChange={(e) => onInputChange('shortDescription', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
            errors.shortDescription ? 'border-red-300' : 'border-gray-200'
          }`}
          placeholder="Entspannende Kopfhaut-Massagen..."
        />
        {errors.shortDescription && <p className="mt-1 text-sm text-red-600">{errors.shortDescription}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Detaylı Açıklama *
        </label>
        <textarea
          rows={8}
          value={formData.longDescription || ''}
          onChange={(e) => onInputChange('longDescription', e.target.value)}
          className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
            errors.longDescription ? 'border-red-300' : 'border-gray-200'
          }`}
          placeholder="Detaylı hizmet açıklaması yazın... HTML etiketleri de kullanabilirsiniz: <strong>, <em>, <ul><li>"
        />
        {errors.longDescription && <p className="mt-1 text-sm text-red-600">{errors.longDescription}</p>}
        <p className="text-xs text-gray-500 mt-1">
          HTML etiketleri kullanarak içeriği biçimlendirebilirsiniz (strong, em, ul, li)
        </p>
      </div>

      {/* Duration & Price */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Süre *
          </label>
          <input
            type="text"
            value={formData.duration || ''}
            onChange={(e) => onInputChange('duration', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
              errors.duration ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="90 Min"
          />
          {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Fiyat *
          </label>
          <input
            type="text"
            value={formData.price || ''}
            onChange={(e) => onInputChange('price', e.target.value)}
            className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent ${
              errors.price ? 'border-red-300' : 'border-gray-200'
            }`}
            placeholder="ab 85€"
          />
          {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
        </div>
      </div>

      {/* Benefits */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Faydalar * (virgülle ayırın)
        </label>
        <input
          type="text"
          value={formData.benefits || ''}
          onChange={(e) => onInputChange('benefits', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Stressabbau, Bessere Durchblutung, Tiefe Entspannung"
        />
        <p className="text-xs text-gray-500 mt-1">
          Her faydayı virgülle ayırın
        </p>
      </div>

      {/* CategoryManager Modal */}
      <CategoryManager
        isOpen={isCategoryManagerOpen}
        onClose={() => setIsCategoryManagerOpen(false)}
        categories={categories}
        onCategoryCreated={handleCategoryCreated}
        onCategoryUpdated={handleCategoryUpdated}
        onCategoryDeleted={handleCategoryDeleted}
        onCategorySelected={handleCategorySelected}
      />
    </div>
  )
}