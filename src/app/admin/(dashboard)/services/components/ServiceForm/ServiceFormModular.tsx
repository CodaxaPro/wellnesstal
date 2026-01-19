'use client'

import { useState, useEffect } from 'react'

import type { ServiceFormData, Service } from '../../../../../types/services'

import { useServiceForm } from './hooks/useServiceForm'
import StepNavigation from './shared/StepNavigation'
import BasicInfoStep from './steps/BasicInfoStep'
import ButtonConfigStep from './steps/ButtonConfigStep'
import FinalSettingsStep from './steps/FinalSettingsStep'
import VisualStyleStep from './steps/VisualStyleStep'

interface Category {
  id: string
  name: string
  color: string
  icon?: string
}

interface ServiceFormModularProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: ServiceFormData) => Promise<boolean>
  editingService?: Service | null
  categories: Category[]
  isLoading: boolean
  existingServices: Service[]
}

export default function ServiceFormModular({
  isOpen,
  onClose,
  onSubmit,
  editingService,
  categories: initialCategories,
  isLoading,
  existingServices
}: ServiceFormModularProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState(initialCategories)

  // Update categories when prop changes
  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  const {
    formData,
    errors,
    gradientColor,
    handleInputChange,
    setGradientColor,
    validateStep,
    validateForm,
    processFormData,
    resetForm
  } = useServiceForm({
    editingService,
    existingServices,
    isOpen
  })

  const steps = [
    { number: 1, title: 'Temel Bilgiler', icon: '📝' },
    { number: 2, title: 'Görsel & Stil', icon: '🎨' },
    { number: 3, title: 'Button Ayarları', icon: '🔗' },
    { number: 4, title: 'Son Ayarlar', icon: '⚙️' }
  ]

  // Category management
  const handleCategoriesUpdate = (updatedCategories: Category[]) => {
    setCategories(updatedCategories)
  }

  // Navigation handlers
  const handleNext = () => {
    if (currentStep === 1 && !validateStep(1)) {
      return // Validation failed, don't proceed
    }
    
    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber)
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Only allow submit on step 4
    if (currentStep !== 4) {
      handleNext()
      return
    }
    
    if (!validateForm()) {
      setCurrentStep(1) // Go to first step if validation fails
      return
    }

    setIsSubmitting(true)

    try {
      const processedData = processFormData()
      const success = await onSubmit(processedData)
      
      if (success) {
        resetForm()
        setCurrentStep(1)
        onClose()
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm()
      setCurrentStep(1)
      onClose()
    }
  }

  if (!isOpen) {
return null
}

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-charcoal">
              {editingService ? 'Hizmet Düzenle' : 'Yeni Hizmet Ekle'}
            </h2>
            <button
              onClick={handleClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Step Navigation */}
          <StepNavigation
            steps={steps}
            currentStep={currentStep}
            onStepClick={handleStepClick}
            isSubmitting={isSubmitting}
          />
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {/* Step Content */}
          {currentStep === 1 && (
            <BasicInfoStep
              formData={formData}
              errors={errors}
              categories={categories}
              onInputChange={handleInputChange}
              onCategoriesUpdate={handleCategoriesUpdate}
            />
          )}

          {currentStep === 2 && (
            <VisualStyleStep
              formData={formData}
              gradientColor={gradientColor}
              onInputChange={handleInputChange}
              onGradientColorChange={setGradientColor}
            />
          )}

          {currentStep === 3 && (
            <ButtonConfigStep
              formData={formData}
              onInputChange={handleInputChange}
            />
          )}

          {currentStep === 4 && (
            <FinalSettingsStep
              formData={formData}
              categories={categories}
              onInputChange={handleInputChange}
            />
          )}

          {/* Navigation Footer */}
          <div className="flex justify-between items-center pt-6 mt-6 border-t border-gray-200">
            <div className="flex space-x-4">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isSubmitting}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-charcoal hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  Önceki
                </button>
              )}
            </div>

            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Adım {currentStep} / 4</span>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={isSubmitting}
                className="px-6 py-3 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50"
              >
                İptal
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-sage-500 hover:bg-forest-600 disabled:opacity-50 text-white rounded-xl transition-colors flex items-center gap-2"
              >
                {isSubmitting && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                {currentStep < 4 ? 'Sonraki' : (isSubmitting ? 'Kaydediliyor...' : (editingService ? 'Güncelle' : 'Oluştur'))}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}