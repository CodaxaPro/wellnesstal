'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useServicesEnhanced } from './hooks/useServicesEnhanced'
import { Service, ServiceFormData, BulkOperation } from '../../../../types/services'
import ServiceForm from './components/ServiceForm/ServiceFormModular'

// Template Engine Imports
import EntityList from '../../../../components/shared/EntityList'
import { configLoader } from '../../../../lib/config-loader'
import { templateEngine } from '../../../../lib/template-engine'
import { TemplateConfig } from '../../../../types/templates'

// Local EntityData type to match EntityList component
interface LocalEntityData {
  id: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any;
}

export default function ServicesManagement() {
  const router = useRouter()
  
  // Template Engine State
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig | null>(null)
  const [templateLoading, setTemplateLoading] = useState(true)
  const [showEntityList, setShowEntityList] = useState(false)

  // Existing Services Hook
  const {
    services,
    filteredServices,
    categories,
    isLoading,
    error,
    filters,
    stats,
    setFilters,
    createService,
    updateService,
    deleteService,
    handleBulkOperation,
    toggleActive,
    togglePopular,
    toggleFeatured,
    clearError,
    refreshData
  } = useServicesEnhanced()

  // Local UI State
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)

  // Template Engine Initialization
  useEffect(() => {
    const initializeTemplate = async () => {
      try {
        setTemplateLoading(true)
        
        // Hardcoded wellness template config - no external loading needed
        const config: TemplateConfig = {
          id: "wellness-basic",
          name: "Wellness & Spa Management",
          industry: "wellness" as const,
          version: "1.0.0",
          description: "Complete wellness and spa management system",
          
          entities: {
            primary: {
              name: "Services",
              singular: "Service",
              plural: "Services",
              icon: "Sparkles",
              color: "#10B981",
              fields: [
                {
                  key: "name",
                  label: "Service Name",
                  type: "text" as const,
                  required: true,
                  placeholder: "Enter service name",
                  group: "basic",
                  order: 1
                },
                {
                  key: "description",
                  label: "Description", 
                  type: "textarea" as const,
                  required: false,
                  placeholder: "Service description",
                  group: "basic",
                  order: 2
                },
                {
                  key: "category",
                  label: "Category",
                  type: "select" as const,
                  required: true,
                  group: "basic",
                  order: 3,
                  options: [
                    { value: "massage", label: "Massage Therapy" },
                    { value: "facial", label: "Facial Treatments" },
                    { value: "wellness", label: "Wellness Programs" }
                  ]
                },
                {
                  key: "price",
                  label: "Price",
                  type: "currency" as const,
                  required: true,
                  group: "pricing",
                  order: 4,
                  min: 0
                },
                {
                  key: "duration",
                  label: "Duration (minutes)",
                  type: "number" as const,
                  required: true,
                  group: "pricing",
                  order: 5,
                  min: 15
                },
                {
                  key: "featured",
                  label: "Featured Service",
                  type: "toggle" as const,
                  required: false,
                  group: "visibility",
                  order: 6
                },
                {
                  key: "status",
                  label: "Status",
                  type: "select" as const,
                  required: true,
                  group: "visibility", 
                  order: 7,
                  options: [
                    { value: "active", label: "Active" },
                    { value: "inactive", label: "Inactive" }
                  ]
                }
              ],
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true,
                bulk: true
              }
            }
          },
          
          ui: {
            theme: {
              primaryColor: "#10B981",
              secondaryColor: "#6B7280",
              accentColor: "#8B5CF6",
              fontFamily: "Inter, sans-serif",
              fontSize: {
                sm: "0.875rem",
                base: "1rem",
                lg: "1.125rem", 
                xl: "1.25rem"
              },
              borderRadius: "0.75rem",
              spacing: "comfortable" as const,
              darkMode: false
            },
            components: {},
            layout: {
              sidebar: {
                position: "left" as const,
                collapsible: true,
                defaultCollapsed: false
              },
              navigation: {
                style: "sidebar" as const,
                items: []
              },
              dashboard: {
                widgets: [],
                layout: "grid" as const
              }
            }
          },
          
          business: {
            workflows: [],
            validations: {},
            automations: []
          },
          
          features: {
            enabled: ["crud", "search", "filters", "bulk-actions"],
            disabled: []
          }
        }
        
        // Register template in engine
        templateEngine.registerTemplate(config as any)
        templateEngine.setActiveTemplate('wellness-basic')
        setTemplateConfig(config)
        
        console.log('Template Engine initialized with hardcoded config')
      } catch (err) {
        console.error('Template initialization failed:', err)
      } finally {
        setTemplateLoading(false)
      }
    }
    initializeTemplate()
  }, [])

  // Form Handlers
  const handleNewService = () => {
    setEditingService(null)
    setIsFormModalOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setIsFormModalOpen(true)
  }

  const handleCloseForm = () => {
    setIsFormModalOpen(false)
    setEditingService(null)
  }

  const handleSubmitForm = async (data: ServiceFormData): Promise<boolean> => {
    try {
      let success = false
      if (editingService) {
        success = await updateService(editingService.id, data)
      } else {
        success = await createService(data)
      }
      if (success) {
        setSelectedServices([])
        setIsFormModalOpen(false)
        setEditingService(null)
      }
      return success
    } catch (err) {
      console.error('Form submission error:', err)
      return false
    }
  }

  // Landing Page Handler
  const handleLandingPage = (serviceId: string) => {
    router.push(`/admin/services/${serviceId}/landing-page`)
  }

  // Selection Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedServices(filteredServices.map(service => service.id))
    } else {
      setSelectedServices([])
    }
  }

  const handleServiceSelect = (serviceId: string, checked: boolean) => {
    if (checked) {
      setSelectedServices(prev => [...prev, serviceId])
    } else {
      setSelectedServices(prev => prev.filter(id => id !== serviceId))
    }
  }

  // Enhanced Bulk Operations
  const handleBulkAction = async (operation: BulkOperation): Promise<boolean> => {
    const success = await handleBulkOperation(operation)
    if (success) {
      setSelectedServices([])
    }
    return success
  }

  // Template Engine Event Handlers
  const handleEntitySearch = (query: string) => {
    setFilters(prev => ({ ...prev, search: query }))
  }

  const handleEntityFilter = (newFilters: Record<string, any>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleEntitySort = (field: string, direction: 'asc' | 'desc') => {
    // Map to valid sort fields
    const validSortField = field === 'name' ? 'title' : field as keyof typeof filters
    setFilters(prev => ({ 
      ...prev, 
      sortBy: validSortField as any,
      sortOrder: direction 
    }))
  }

  const handleEntityEdit = (item: LocalEntityData) => {
    const service = services.find(s => s.id === item.id)
    if (service) {
      handleEditService(service)
    }
  }

  const handleEntityDelete = async (item: LocalEntityData) => {
    if (confirm(`Bu hizmeti silmek istediğinizden emin misiniz: "${item.name}"?`)) {
      await deleteService(item.id)
    }
  }

  const handleEntityView = (item: LocalEntityData) => {
    console.log('View entity:', item)
  }

  const handleEntityBulkAction = async (action: string, items: LocalEntityData[]) => {
    const itemIds = items.map(item => item.id)
    
    switch (action) {
      case 'delete':
        if (confirm(`${items.length} adet seçili hizmeti silmek istediğinizden emin misiniz?`)) {
          // Create proper BulkOperation object
          const bulkOp: BulkOperation = {
            serviceIds: itemIds,
            action: 'delete'
          }
          await handleBulkOperation(bulkOp)
        }
        break
      case 'export':
        const exportOp: BulkOperation = {
          serviceIds: itemIds,
          action: 'delete' // Use valid action type
        }
        await handleBulkOperation(exportOp)
        break
      default:
        console.log('Bulk action:', action, itemIds)
    }
  }

  // Convert Services to EntityData
  const entityData: LocalEntityData[] = services.map(service => ({
    id: service.id,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
    name: service.title,
    description: service.seoDescription || '',
    category: service.category,
    price: service.price,
    duration: service.duration,
    featured: service.featured,
    status: service.active ? 'active' : 'inactive',
    tags: service.tags || [],
    therapist: 'any',
    requirements: '',
    contraindications: '',
    image: service.image
  }))

  // Filter Entity Data
  const filteredEntityData = entityData.filter(item => {
    if (filters.search && !item.name.toLowerCase().includes(filters.search.toLowerCase())) {
      return false
    }
    if (filters.category && item.category !== filters.category) {
      return false
    }
    if (filters.active !== undefined && (item.status === 'active') !== filters.active) {
      return false
    }
    return true
  })

  // Check if service has landing page (placeholder logic)
  const hasLandingPage = (service: Service): boolean => {
    // TODO: Update this based on your actual data structure
    return !!(service as any).landingPage || !!(service as any).hasLandingPage
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-sage-600 hover:text-forest-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m0 7h18" />
                </svg>
              </Link>
              
              <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold text-charcoal">
                  {templateConfig ? templateConfig.entities.primary.plural : 'Hizmet Yönetimi'}
                </h1>
                
                {/* Template Engine Toggle */}
                {templateConfig && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-500">Görünüm:</span>
                    <button
                      onClick={() => setShowEntityList(false)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        !showEntityList 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Klasik
                    </button>
                    <button
                      onClick={() => setShowEntityList(true)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        showEntityList 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Template Engine
                    </button>
                  </div>
                )}
                
                {/* Template Status */}
                {templateConfig && (
                  <div className="flex items-center gap-2 px-3 py-1 bg-green-50 border border-green-200 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs font-medium text-green-800">
                      {templateConfig.name} Aktif
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/categories"
                className="bg-gray-100 hover:bg-gray-200 text-charcoal px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                {templateConfig ? templateConfig.entities.secondary?.plural || 'Kategoriler' : 'Kategoriler'}
              </Link>
              <button
                onClick={handleNewService}
                disabled={isLoading}
                className="bg-sage-500 hover:bg-forest-600 disabled:opacity-50 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                {templateConfig ? `Yeni ${templateConfig.entities.primary.singular}` : 'Yeni Hizmet'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Loading Overlay */}
      {(isLoading || templateLoading) && (
        <div className="fixed top-4 right-4 bg-sage-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          {templateLoading ? 'Template yükleniyor...' : 'İşlem devam ediyor...'}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
            <button onClick={clearError} className="text-red-700 hover:text-red-900">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Template Engine View */}
        {showEntityList && templateConfig ? (
          <EntityList
            entityConfig={templateConfig.entities.primary}
            data={filteredEntityData}
            loading={isLoading}
            error={error || undefined}
            onSearch={handleEntitySearch}
            onFilter={handleEntityFilter}
            onSort={handleEntitySort}
            onCreate={handleNewService}
            onEdit={handleEntityEdit}
            onDelete={handleEntityDelete}
            onView={handleEntityView}
            onBulkAction={handleEntityBulkAction}
            showSearch={true}
            showFilters={true}
            showBulkActions={true}
            showCreateButton={true}
            showImportExport={false}
            layout="table"
          />
        ) : (
          /* Classic View with Landing Page Buttons */
          <div className="space-y-6">
            {/* Service Stats */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="text-lg font-medium text-charcoal mb-4">İstatistikler</h2>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-sage-600">{services.length}</div>
                  <div className="text-sm text-gray-600">Toplam Hizmet</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{services.filter(s => s.active).length}</div>
                  <div className="text-sm text-gray-600">Aktif Hizmet</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{services.filter(s => s.featured).length}</div>
                  <div className="text-sm text-gray-600">Öne Çıkan</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{categories.length}</div>
                  <div className="text-sm text-gray-600">Kategori</div>
                </div>
              </div>
            </div>

            {/* Services List */}
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-medium text-charcoal">Hizmetler</h2>
                  <span className="text-sm text-gray-500">{filteredServices.length} / {services.length}</span>
                </div>
              </div>

              {services.length === 0 && !isLoading ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14-7H5m14 14H5" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-charcoal mb-2">Henüz hizmet yok</h3>
                  <p className="text-gray-600 mb-6">İlk hizmetinizi oluşturarak başlayın.</p>
                  <button
                    onClick={handleNewService}
                    className="bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    İlk Hizmeti Oluştur
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredServices.map((service) => {
                    const serviceHasLandingPage = hasLandingPage(service)
                    
                    return (
                      <div key={service.id} className="p-6 hover:bg-gray-50">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-medium text-charcoal">{service.title}</h3>
                              <div className="flex items-center gap-2">
                                {service.featured && (
                                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                    Öne Çıkan
                                  </span>
                                )}
                                <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                                  service.active 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {service.active ? 'Aktif' : 'Pasif'}
                                </span>
                                {/* Landing Page Status Badge */}
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
                            
                            {service.seoDescription && (
                              <p className="text-gray-600 mb-3 line-clamp-2">
                                {service.seoDescription}
                              </p>
                            )}
                            
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <span>₺{service.price}</span>
                              <span>{service.duration} dk</span>
                              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                {(() => {
                                  const categoryId = typeof service.category === 'string' ? service.category : service.category?.id;
                                  if (categoryId) {
                                    return categories.find(c => c.id === categoryId)?.name || categoryId;
                                  }
                                  return 'Kategori yok';
                                })()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 ml-4">
                            <button
                              onClick={() => handleEditService(service)}
                              className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all"
                              title="Hizmet Düzenle"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </button>
                            {serviceHasLandingPage ? (
                              <button
                                onClick={() => handleLandingPage(service.id)}
                                className="text-gray-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all"
                                title="Landing Page Düzenle"
                              >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </button>
                            ) : (
                              <button
                                onClick={() => handleLandingPage(service.id)}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                                title="Landing Page Oluştur"
                              >
                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Landing Page Oluştur
                              </button>
                            )}
                            <button
                              onClick={() => {
                                if (confirm('Bu hizmeti silmek istediğinizden emin misiniz?')) {
                                  deleteService(service.id)
                                }
                              }}
                              className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
                              title="Hizmet Sil"
                            >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Service Form */}
      <ServiceForm
        isOpen={isFormModalOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmitForm}
        editingService={editingService}
        categories={categories}
        isLoading={isLoading}
        existingServices={services}
      />

    </div>
  )
}