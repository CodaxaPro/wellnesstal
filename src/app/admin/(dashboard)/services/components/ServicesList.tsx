'use client'

import { useState } from 'react'

import { Service, ServiceCategory } from '../../../../types/services'

interface ServicesListProps {
  services: Service[]
  categories: Category[]
  isLoading: boolean
  selectedServices: string[]
  onSelectService: (serviceId: string, checked: boolean) => void
  onSelectAll: (checked: boolean) => void
  onEdit: (service: Service) => void
  onDelete: (serviceId: string) => void
  onToggleActive: (serviceId: string) => void
  onTogglePopular: (serviceId: string) => void
  onToggleFeatured: (serviceId: string) => void
  onReorder: (newOrder: { id: string; order: number }[]) => void
  onLandingPage: (serviceId: string) => void // New prop for landing page
}

interface Category {
  id: string
  name: string
  color: string
  icon?: string
}

export default function ServicesList({
  services,
  categories,
  isLoading,
  selectedServices,
  onSelectService,
  onSelectAll,
  onEdit,
  onDelete,
  onToggleActive,
  onTogglePopular,
  onToggleFeatured,
  onReorder,
  onLandingPage
}: ServicesListProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null)
  const [dragOverItem, setDragOverItem] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, serviceId: string) => {
    setDraggedItem(serviceId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, serviceId: string) => {
    e.preventDefault()
    setDragOverItem(serviceId)
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOverItem(null)
  }

  const handleDrop = (e: React.DragEvent, targetServiceId: string) => {
    e.preventDefault()
    
    if (!draggedItem || draggedItem === targetServiceId) {
      setDraggedItem(null)
      setDragOverItem(null)
      return
    }

    const draggedIndex = services.findIndex(service => service.id === draggedItem)
    const targetIndex = services.findIndex(service => service.id === targetServiceId)
    
    if (draggedIndex === -1 || targetIndex === -1) {
return
}

    // Create new order
    const reorderedServices = [...services]
    const [removed] = reorderedServices.splice(draggedIndex, 1)
    reorderedServices.splice(targetIndex, 0, removed)

    // Generate new order values
    const newOrder = reorderedServices.map((service, index) => ({
      id: service.id,
      order: index + 1
    }))

    onReorder(newOrder)
    setDraggedItem(null)
    setDragOverItem(null)
  }

  const handleDeleteClick = (serviceId: string, serviceTitle: string) => {
    if (window.confirm(`"${serviceTitle}" hizmetini silmek istediğinizden emin misiniz?`)) {
      onDelete(serviceId)
    }
  }

  const getCategoryById = (categoryId?: string): Category | undefined => {
    if (!categoryId) {
return undefined
}
    return categories.find(cat => cat.id === categoryId)
  }

  // Check if service has landing page (placeholder logic - update based on your data structure)
  const hasLandingPage = (service: Service): boolean => {
    // TODO: Update this based on your actual data structure
    return !!(service as any).landingPage || !!(service as any).hasLandingPage
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500 mx-auto" />
          <p className="mt-4 text-gray-600">Hizmetler yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-soft p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-charcoal mb-2">Henüz hizmet yok</h3>
          <p className="text-gray-600">İlk hizmeti oluşturarak başlayın.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-charcoal">
          Hizmetler ({services.length})
        </h2>
        <div className="flex items-center space-x-2">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedServices.length === services.length && services.length > 0}
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
                  checked={selectedServices.length === services.length && services.length > 0}
                  onChange={(e) => onSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-sage-600"
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sıra
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hizmet
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kategori
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Süre & Fiyat
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Etiketler
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map((service) => {
              const category = getCategoryById(service.category?.id)
              const serviceHasLandingPage = hasLandingPage(service)
              
              return (
                <tr
                  key={service.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, service.id)}
                  onDragOver={(e) => handleDragOver(e, service.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, service.id)}
                  className={`hover:bg-gray-50 transition-colors cursor-move ${
                    selectedServices.includes(service.id) ? 'bg-sage-50' : ''
                  } ${
                    dragOverItem === service.id ? 'border-t-2 border-sage-500' : ''
                  } ${
                    draggedItem === service.id ? 'opacity-50' : ''
                  }`}
                >
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedServices.includes(service.id)}
                      onChange={(e) => onSelectService(service.id, e.target.checked)}
                      className="rounded border-gray-300 text-sage-600"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                      <span className="text-sm font-medium text-gray-900">{service.order}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-sage-100 rounded-lg flex items-center justify-center mr-4">
                        {service.image && service.image !== '/images/default-service.jpg' ? (
                          <img 
                            src={service.image} 
                            alt={service.title}
                            className="h-12 w-12 rounded-lg object-cover"
                          />
                        ) : (
                          <span className="text-sage-600 text-xl">🌿</span>
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-charcoal">{service.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{service.shortDescription}</div>
                        {/* Landing Page Status Indicator */}
                        <div className="flex items-center mt-1">
                          {serviceHasLandingPage ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              Landing Page Hazır
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                              Landing Page Eksik
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {category ? (
                      <div className="flex items-center">
                        <div
                          className="h-6 w-6 rounded-md flex items-center justify-center mr-2"
                          style={{ backgroundColor: category.color }}
                        >
                          <span className="text-white text-xs">{category.icon || '#'}</span>
                        </div>
                        <span className="text-sm text-gray-900">{category.name}</span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">Kategorisiz</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-charcoal">{service.duration}</div>
                    <div className="text-sm font-semibold text-sage-600">{service.price}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => onToggleActive(service.id)}
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                        service.active
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {service.active ? 'Aktif' : 'Pasif'}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {service.popular && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          ⭐ Popüler
                        </span>
                      )}
                      {service.featured && (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                          🔥 Öne Çıkan
                        </span>
                      )}
                      <div className="flex space-x-1">
                        <button
                          onClick={() => onTogglePopular(service.id)}
                          className="text-xs text-gray-400 hover:text-yellow-600 transition-colors"
                          title={service.popular ? 'Popüler kaldır' : 'Popüler yap'}
                        >
                          ⭐
                        </button>
                        <button
                          onClick={() => onToggleFeatured(service.id)}
                          className="text-xs text-gray-400 hover:text-purple-600 transition-colors"
                          title={service.featured ? 'Öne çıkandan kaldır' : 'Öne çıkar'}
                        >
                          🔥
                        </button>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onEdit(service)}
                        className="text-sage-600 hover:text-forest-600 transition-colors"
                        title="Hizmet Düzenle"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => onLandingPage(service.id)}
                        className={`transition-colors ${
                          serviceHasLandingPage 
                            ? 'text-blue-600 hover:text-blue-800' 
                            : 'text-orange-600 hover:text-orange-800'
                        }`}
                        title={serviceHasLandingPage ? 'Landing Page Düzenle' : 'Landing Page Oluştur'}
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDeleteClick(service.id, service.title)}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Hizmet Sil"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}