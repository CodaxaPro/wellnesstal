'use client'

import { useState } from 'react'

import type { BulkOperation } from '../../../../types/services'

interface Category {
  id: string
  name: string
  color: string
  icon?: string
}

interface ServiceBulkActionsProps {
  selectedServices: string[]
  categories: Category[]
  onBulkAction: (operation: BulkOperation) => Promise<boolean>
  onClearSelection: () => void
  isLoading: boolean
}

export default function ServiceBulkActions({
  selectedServices,
  categories,
  onBulkAction,
  onClearSelection,
  isLoading
}: ServiceBulkActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<BulkOperation | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string>('')

  const handleActionClick = (action: BulkOperation['action'], data?: any) => {
    const operation: BulkOperation = {
      action,
      serviceIds: selectedServices,
      data
    }
    setPendingAction(operation)
    setIsModalOpen(true)
  }

  const handleConfirmAction = async () => {
    if (!pendingAction || selectedServices.length === 0) {
return
}

    const success = await onBulkAction(pendingAction)
    
    if (success) {
      setIsModalOpen(false)
      setPendingAction(null)
      setSelectedCategory('')
      onClearSelection()
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setPendingAction(null)
    setSelectedCategory('')
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'activate': return 'aktif yap'
      case 'deactivate': return 'pasif yap'
      case 'delete': return 'sil'
      case 'update_category': return 'kategori değiştir'
      case 'mark_featured': return 'öne çıkar'
      default: return ''
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'activate': return 'bg-green-500 hover:bg-green-600'
      case 'deactivate': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'delete': return 'bg-red-500 hover:bg-red-600'
      case 'update_category': return 'bg-blue-500 hover:bg-blue-600'
      case 'mark_featured': return 'bg-purple-500 hover:bg-purple-600'
      default: return 'bg-gray-500'
    }
  }

  const getConfirmationMessage = () => {
    if (!pendingAction) {
return ''
}
    
    const count = selectedServices.length
    const actionText = getActionText(pendingAction.action)
    
    if (pendingAction.action === 'delete') {
      return `${count} hizmeti silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`
    }
    
    if (pendingAction.action === 'update_category') {
      const categoryName = categories.find(c => c.id === pendingAction.data?.category)?.name || 'Seçilen kategori'
      return `${count} hizmetin kategorisini "${categoryName}" olarak değiştirmek istediğinizden emin misiniz?`
    }
    
    return `${count} hizmeti ${actionText} istediğinizden emin misiniz?`
  }

  if (selectedServices.length === 0) {
    return null
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="bg-sage-100 border-l-4 border-sage-500 p-4 mb-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sage-800 font-medium">
              {selectedServices.length} hizmet seçildi
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleActionClick('activate')}
                disabled={isLoading}
                className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Aktif Yap
              </button>
              <button
                onClick={() => handleActionClick('deactivate')}
                disabled={isLoading}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Pasif Yap
              </button>
              <button
                onClick={() => handleActionClick('mark_featured', { featured: true })}
                disabled={isLoading}
                className="bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Öne Çıkar
              </button>
              <button
                onClick={() => handleActionClick('delete')}
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
          <button
            onClick={onClearSelection}
            disabled={isLoading}
            className="text-sage-600 hover:text-sage-800 disabled:opacity-50 transition-colors"
          >
            Seçimi Temizle
          </button>
        </div>

        {/* Category Change Section */}
        {categories.length > 0 && (
          <div className="mt-4 pt-4 border-t border-sage-200">
            <div className="flex items-center space-x-4">
              <span className="text-sage-700 text-sm font-medium">Kategori Değiştir:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border border-sage-300 rounded text-sm focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              >
                <option value="">Kategori seç...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleActionClick('update_category', { category: selectedCategory })}
                disabled={isLoading || !selectedCategory}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white px-3 py-1 rounded text-sm transition-colors"
              >
                Uygula
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                pendingAction?.action === 'delete' ? 'bg-red-100' : 'bg-sage-100'
              }`}>
                {pendingAction?.action === 'delete' ? (
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                ) : pendingAction?.action === 'update_category' ? (
                  <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              <h3 className="text-lg font-semibold text-charcoal">
                Toplu İşlem Onayı
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              {getConfirmationMessage()}
            </p>

            {/* Category Preview for update_category action */}
            {pendingAction?.action === 'update_category' && pendingAction.data?.category && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                {(() => {
                  const category = categories.find(c => c.id === pendingAction.data?.category)
                  return category ? (
                    <div className="flex items-center">
                      <div
                        className="h-6 w-6 rounded-md flex items-center justify-center mr-2"
                        style={{ backgroundColor: category.color }}
                      >
                        <span className="text-white text-xs">{category.icon || '#'}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    </div>
                  ) : null
                })()}
              </div>
            )}
            
            <div className="flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                disabled={isLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleConfirmAction}
                disabled={isLoading}
                className={`px-4 py-2 rounded-lg text-white font-medium transition-colors disabled:opacity-50 ${
                  pendingAction ? getActionColor(pendingAction.action) : 'bg-gray-500'
                }`}
              >
                {isLoading ? 'İşleniyor...' : 'Onayla'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}