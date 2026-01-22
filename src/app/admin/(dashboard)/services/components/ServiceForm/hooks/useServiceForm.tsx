'use client'

import { useState, useEffect } from 'react'

import type { ButtonType, Service, ServiceFormData } from '@/types/services'

interface UseServiceFormProps {
  editingService?: Service | null
  existingServices: Service[]
  isOpen: boolean
}

interface UseServiceFormReturn {
  // Form state
  formData: ServiceFormData
  errors: Partial<ServiceFormData>
  gradientColor: string

  // Form actions
  handleInputChange: (field: keyof ServiceFormData, value: any) => void
  setGradientColor: (color: string) => void

  // Validation
  validateStep: (step: number) => boolean
  validateForm: () => boolean

  // Form processing
  processFormData: () => ServiceFormData & { gradientColor: string }
  resetForm: () => void
}

export function useServiceForm({
  editingService,
  existingServices,
  isOpen
}: UseServiceFormProps): UseServiceFormReturn {

  const [formData, setFormData] = useState<ServiceFormData>({
    title: '',
    shortDescription: '',
    longDescription: '',
    duration: '',
    price: '',
    benefits: '',
    popular: false,
    active: true,
    featured: false,
    order: 0,
    category: '',
    tags: '',
    image: '/images/default-service.jpg',

    // Button configs
    primaryButtonText: 'Jetzt buchen',
    primaryButtonType: 'phone',
    primaryButtonValue: '',
    primaryButtonMessage: '',
    secondaryButtonText: 'Mehr Details',
    secondaryButtonType: 'page',
    secondaryButtonValue: '',
    secondaryButtonMessage: '',

    // Modal buttons
    primaryModalLeftButtonText: 'Jetzt anrufen',
    primaryModalLeftButtonType: 'phone',
    primaryModalLeftButtonValue: '',
    primaryModalRightButtonText: 'WhatsApp schreiben',
    primaryModalRightButtonType: 'whatsapp',
    primaryModalRightButtonValue: '',
    secondaryModalLeftButtonText: 'Jetzt anrufen',
    secondaryModalLeftButtonType: 'phone',
    secondaryModalLeftButtonValue: '',
    secondaryModalRightButtonText: 'WhatsApp schreiben',
    secondaryModalRightButtonType: 'whatsapp',
    secondaryModalRightButtonValue: ''
  })

  const [errors, setErrors] = useState<Partial<ServiceFormData>>({})
  const [gradientColor, setGradientColor] = useState('from-sage-400 to-forest-500')

  // Initialize form data when modal opens or editing service changes
  useEffect(() => {
    if (isOpen) {
      if (editingService) {
        setFormData({
          title: editingService.title,
          shortDescription: editingService.shortDescription,
          longDescription: editingService.longDescription,
          duration: editingService.duration,
          price: typeof editingService.price === 'number' ? String(editingService.price) : (editingService.price || ''),
          benefits: Array.isArray(editingService.benefits)
            ? editingService.benefits.join(', ')
            : editingService.benefits,
          popular: editingService.popular,
          active: editingService.active,
          featured: editingService.featured || false,
          order: editingService.order,
          category: editingService.category?.id || '',
          tags: Array.isArray(editingService.tags)
            ? editingService.tags.join(', ')
            : editingService.tags || '',
          image: editingService.image,

          // Button configs - preserve all existing values
          primaryButtonText: editingService.primaryButtonText || 'Jetzt buchen',
          primaryButtonType: (editingService.primaryButtonType as ButtonType) || 'phone',
          primaryButtonValue: editingService.primaryButtonValue || '',
          primaryButtonMessage: editingService.primaryButtonMessage || '',
          secondaryButtonText: editingService.secondaryButtonText || 'Mehr Details',
          secondaryButtonType: (editingService.secondaryButtonType as ButtonType) || 'page',
          secondaryButtonValue: editingService.secondaryButtonValue || '',
          secondaryButtonMessage: editingService.secondaryButtonMessage || '',

          // Modal buttons - preserve all existing values
          primaryModalLeftButtonText: editingService.primaryModalLeftButtonText || 'Jetzt anrufen',
          primaryModalLeftButtonType: (editingService.primaryModalLeftButtonType as ButtonType) || 'phone',
          primaryModalLeftButtonValue: editingService.primaryModalLeftButtonValue || '',
          primaryModalRightButtonText: editingService.primaryModalRightButtonText || 'WhatsApp schreiben',
          primaryModalRightButtonType: (editingService.primaryModalRightButtonType as ButtonType) || 'whatsapp',
          primaryModalRightButtonValue: editingService.primaryModalRightButtonValue || '',
          secondaryModalLeftButtonText: editingService.secondaryModalLeftButtonText || 'Jetzt anrufen',
          secondaryModalLeftButtonType: (editingService.secondaryModalLeftButtonType as ButtonType) || 'phone',
          secondaryModalLeftButtonValue: editingService.secondaryModalLeftButtonValue || '',
          secondaryModalRightButtonText: editingService.secondaryModalRightButtonText || 'WhatsApp schreiben',
          secondaryModalRightButtonType: (editingService.secondaryModalRightButtonType as ButtonType) || 'whatsapp',
          secondaryModalRightButtonValue: editingService.secondaryModalRightButtonValue || ''
        })
        setGradientColor((editingService as any).gradientColor || 'from-sage-400 to-forest-500')
      } else {
        resetForm()
      }
      setErrors({})
    }
  }, [isOpen, editingService, existingServices])

  // Handle input changes
  const handleInputChange = (field: keyof ServiceFormData, value: any) => {
    setFormData((prev: ServiceFormData) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev: Partial<ServiceFormData>) => ({ ...prev, [field]: undefined }))
    }
  }

  // Validation function for specific steps
  const validateStep = (step: number): boolean => {
    const newErrors: Partial<ServiceFormData> = {}

    if (step === 1) {
      if (!formData.title?.trim()) {
newErrors.title = 'Hizmet adı gereklidir'
}
      if (!formData.shortDescription?.trim()) {
newErrors.shortDescription = 'Kısa açıklama gereklidir'
}
      if (!formData.longDescription?.trim()) {
newErrors.longDescription = 'Detaylı açıklama gereklidir'
}
      if (!formData.duration?.trim()) {
newErrors.duration = 'Süre gereklidir'
}
      const priceValue = typeof formData.price === 'string' ? formData.price.trim() : String(formData.price || '').trim()
      if (!priceValue) {
        newErrors.price = 'Fiyat gereklidir'
      }
    }

    if (step === 3) {
      if (!formData.primaryButtonText?.trim()) {
newErrors.primaryButtonText = 'Primary button text gereklidir'
}
      if (!formData.secondaryButtonText?.trim()) {
newErrors.secondaryButtonText = 'Secondary button text gereklidir'
}

      if (formData.primaryButtonType !== 'page' && !formData.primaryButtonValue?.trim()) {
        newErrors.primaryButtonValue = 'Primary button value gereklidir'
      }

      if (formData.secondaryButtonType !== 'page' && !formData.secondaryButtonValue?.trim()) {
        newErrors.secondaryButtonValue = 'Secondary button value gereklidir'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Full form validation
  const validateForm = (): boolean => {
    return validateStep(1) && validateStep(3)
  }

  // Process form data for submission
  const processFormData = () => {
    const processed = {
      ...formData,
      benefits: typeof formData.benefits === 'string'
        ? formData.benefits.split(',').map((b: string) => b.trim()).filter(Boolean)
        : formData.benefits,
      tags: typeof formData.tags === 'string'
        ? formData.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : (formData.tags || []),
      gradientColor
    }

    return processed
  }

  // Reset form to initial state
  const resetForm = () => {
    const maxOrder = Math.max(...existingServices.map(s => s.order), 0)

    setFormData({
      title: '',
      shortDescription: '',
      longDescription: '',
      duration: '',
      price: '',
      benefits: '',
      popular: false,
      active: true,
      featured: false,
      order: maxOrder + 1,
      category: '',
      tags: '',
      image: '/images/default-service.jpg',

      primaryButtonText: 'Jetzt buchen',
      primaryButtonType: 'phone',
      primaryButtonValue: '',
      primaryButtonMessage: '',
      secondaryButtonText: 'Mehr Details',
      secondaryButtonType: 'page',
      secondaryButtonValue: '',
      secondaryButtonMessage: '',

      primaryModalLeftButtonText: 'Jetzt anrufen',
      primaryModalLeftButtonType: 'phone',
      primaryModalLeftButtonValue: '',
      primaryModalRightButtonText: 'WhatsApp schreiben',
      primaryModalRightButtonType: 'whatsapp',
      primaryModalRightButtonValue: '',
      secondaryModalLeftButtonText: 'Jetzt anrufen',
      secondaryModalLeftButtonType: 'phone',
      secondaryModalLeftButtonValue: '',
      secondaryModalRightButtonText: 'WhatsApp schreiben',
      secondaryModalRightButtonType: 'whatsapp',
      secondaryModalRightButtonValue: ''
    })

    setGradientColor('from-sage-400 to-forest-500')
    setErrors({})
  }

  return {
    // Form state
    formData,
    errors,
    gradientColor,

    // Form actions
    handleInputChange,
    setGradientColor,

    // Validation
    validateStep,
    validateForm,

    // Form processing
    processFormData,
    resetForm
  }
}
