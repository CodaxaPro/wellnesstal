'use client'

import type { ServiceFilters as ServiceFiltersType } from '../../../../types/services'

interface Category {
  id: string
  name: string
  color: string
  icon?: string
}

interface ServiceFiltersProps {
  filters: ServiceFiltersType
  categories: Category[]
  onFiltersChange: (filters: ServiceFiltersType) => void
  resultCount: number
  totalCount: number
}

export default function ServiceFilters({
  filters,
  categories,
  onFiltersChange,
  resultCount,
  totalCount
}: ServiceFiltersProps) {
  
  const handleFilterChange = (key: keyof ServiceFiltersType, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: undefined,
      active: undefined,
      popular: undefined,
      featured: undefined,
      sortBy: 'order',
      sortOrder: 'asc'
    })
  }

  const hasActiveFilters = filters.search || 
    filters.category || 
    filters.active !== undefined || 
    filters.popular !== undefined || 
    filters.featured !== undefined

  return (
    <div className="bg-white rounded-2xl shadow-soft p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-charcoal">Filtreler</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-sage-600 hover:text-forest-600 transition-colors"
          >
            Filtreleri Temizle
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Search */}
        <div className="lg:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Arama
          </label>
          <div className="relative">
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Hizmet ara..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kategori
          </label>
          <select
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          >
            <option value="">Tüm Kategoriler</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Durum
          </label>
          <select
            value={filters.active === undefined ? 'all' : filters.active ? 'active' : 'inactive'}
            onChange={(e) => {
              const value = e.target.value
              handleFilterChange('active', value === 'all' ? undefined : value === 'active')
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="active">Aktif</option>
            <option value="inactive">Pasif</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Popular Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Popüler
          </label>
          <select
            value={filters.popular === undefined ? 'all' : filters.popular ? 'popular' : 'not_popular'}
            onChange={(e) => {
              const value = e.target.value
              handleFilterChange('popular', value === 'all' ? undefined : value === 'popular')
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          >
            <option value="all">Tümü</option>
            <option value="popular">Popüler</option>
            <option value="not_popular">Popüler Değil</option>
          </select>
        </div>

        {/* Featured Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Öne Çıkan
          </label>
          <select
            value={filters.featured === undefined ? 'all' : filters.featured ? 'featured' : 'not_featured'}
            onChange={(e) => {
              const value = e.target.value
              handleFilterChange('featured', value === 'all' ? undefined : value === 'featured')
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          >
            <option value="all">Tümü</option>
            <option value="featured">Öne Çıkan</option>
            <option value="not_featured">Normal</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sıralama
          </label>
          <select
            value={`${filters.sortBy}-${filters.sortOrder}`}
            onChange={(e) => {
              const [sortBy, sortOrder] = e.target.value.split('-') as [
                NonNullable<ServiceFiltersType['sortBy']>,
                NonNullable<ServiceFiltersType['sortOrder']>
              ]
              handleFilterChange('sortBy', sortBy)
              handleFilterChange('sortOrder', sortOrder)
            }}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          >
            <option value="order-asc">Sıralama (1-9)</option>
            <option value="order-desc">Sıralama (9-1)</option>
            <option value="title-asc">Başlık (A-Z)</option>
            <option value="title-desc">Başlık (Z-A)</option>
            <option value="createdAt-desc">Yeni Eklenen</option>
            <option value="createdAt-asc">Eski Eklenen</option>
            <option value="price-asc">Fiyat (Düşük-Yüksek)</option>
            <option value="price-desc">Fiyat (Yüksek-Düşük)</option>
            <option value="viewCount-desc">Görüntülenme (Çok-Az)</option>
            <option value="clickCount-desc">Tıklanma (Çok-Az)</option>
          </select>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => handleFilterChange('popular', true)}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            filters.popular === true
              ? 'bg-yellow-100 text-yellow-800 border border-yellow-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          Popüler
        </button>
        <button
          onClick={() => handleFilterChange('featured', true)}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            filters.featured === true
              ? 'bg-purple-100 text-purple-800 border border-purple-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          Öne Çıkan
        </button>
        <button
          onClick={() => handleFilterChange('active', true)}
          className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
            filters.active === true
              ? 'bg-green-100 text-green-800 border border-green-300'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-300'
          }`}
        >
          Aktif
        </button>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="text-sm text-gray-600">
          <span className="font-medium">{resultCount}</span> / {totalCount} hizmet gösteriliyor
        </div>
        
        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2">
            {filters.search && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-sage-100 text-sage-800 rounded-full">
                Arama: "{filters.search}"
                <button
                  onClick={() => handleFilterChange('search', '')}
                  className="ml-1 hover:text-sage-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.category && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-sage-100 text-sage-800 rounded-full">
                Kategori: {categories.find(c => c.id === filters.category)?.name}
                <button
                  onClick={() => handleFilterChange('category', undefined)}
                  className="ml-1 hover:text-sage-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.active !== undefined && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-sage-100 text-sage-800 rounded-full">
                {filters.active ? 'Aktif' : 'Pasif'}
                <button
                  onClick={() => handleFilterChange('active', undefined)}
                  className="ml-1 hover:text-sage-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.popular !== undefined && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-sage-100 text-sage-800 rounded-full">
                {filters.popular ? 'Popüler' : 'Popüler Değil'}
                <button
                  onClick={() => handleFilterChange('popular', undefined)}
                  className="ml-1 hover:text-sage-900"
                >
                  ×
                </button>
              </span>
            )}
            {filters.featured !== undefined && (
              <span className="inline-flex items-center px-2 py-1 text-xs bg-sage-100 text-sage-800 rounded-full">
                {filters.featured ? 'Öne Çıkan' : 'Normal'}
                <button
                  onClick={() => handleFilterChange('featured', undefined)}
                  className="ml-1 hover:text-sage-900"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}