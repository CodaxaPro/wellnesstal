'use client'

import { useState } from 'react'

import { CategoryBulkOperation } from '../types'

interface CategoryBulkActionsProps {
  selectedCategories: string[]
  onBulkAction: (operation: CategoryBulkOperation) => Promise<boolean>
  onClearSelection: () => void
  isLoading: boolean
}

export default function CategoryBulkActions({
  selectedCategories,
  onBulkAction,
  onClearSelection,
  isLoading
}: CategoryBulkActionsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [pendingAction, setPendingAction] = useState<'activate' | 'deactivate' | 'delete' | null>(null)

  const handleActionClick = (action: 'activate' | 'deactivate' | 'delete') => {
    setPendingAction(action)
    setIsModalOpen(true)
  }

  const handleConfirmAction = async () => {
    if (!pendingAction || selectedCategories.length === 0) {
return
}

    const operation: CategoryBulkOperation = {
      action: pendingAction,
      categoryIds: selectedCategories
    }

    const success = await onBulkAction(operation)
    
    if (success) {
      setIsModalOpen(false)
      setPendingAction(null)
      onClearSelection()
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setPendingAction(null)
  }

  const getActionText = (action: string) => {
    switch (action) {
      case 'activate': return 'aktif yap'
      case 'deactivate': return 'pasif yap'
      case 'delete': return 'sil'
      default: return ''
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'activate': return 'bg-green-500 hover:bg-green-600'
      case 'deactivate': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'delete': return 'bg-red-500 hover:bg-red-600'
      default: return 'bg-gray-500'
    }
  }

  const getConfirmationMessage = () => {
    if (!pendingAction) {
return ''
}
    
    const count = selectedCategories.length
    const actionText = getActionText(pendingAction)
    
    if (pendingAction === 'delete') {
      return `${count} kategoriyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz ve bu kategorilere ait tüm hizmetler "Kategorisiz" durumuna geçecektir.`
    }
    
    return `${count} kategoriyi ${actionText} istediğinizden emin misiniz?`
  }

  if (selectedCategories.length === 0) {
    return null
  }

  return (
    <>
      {/* Bulk Actions Bar */}
      <div className="bg-sage-100 border-l-4 border-sage-500 p-4 mb-6 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sage-800 font-medium">
              {selectedCategories.length} kategori seçildi
            </span>
            <div className="flex space-x-2">
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
      </div>

      {/* Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                pendingAction === 'delete' ? 'bg-red-100' : 'bg-sage-100'
              }`}>
                {pendingAction === 'delete' ? (
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
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
                  pendingAction ? getActionColor(pendingAction) : 'bg-gray-500'
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