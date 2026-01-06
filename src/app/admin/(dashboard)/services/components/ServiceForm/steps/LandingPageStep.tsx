'use client'

import { useState } from 'react'

interface LandingPageStepProps {
  formData: any
  onInputChange: (field: string, value: any) => void
}

export default function LandingPageStep({
  formData,
  onInputChange
}: LandingPageStepProps) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)

  // Handle long description change
  const handleLongDescriptionChange = (value: string) => {
    onInputChange('longDescription', value)
  }

  // Handle benefits array change
  const handleBenefitsChange = (benefits: string[]) => {
    onInputChange('benefits', benefits)
  }

  // Handle features array change
  const handleFeaturesChange = (features: any[]) => {
    onInputChange('features', features)
  }

  // Handle images array change
  const handleImagesChange = (images: string[]) => {
    onInputChange('images', images)
  }

  // Handle SEO data change
  const handleSeoChange = (field: string, value: any) => {
    const currentSeo = formData.seo || {}
    onInputChange('seo', {
      ...currentSeo,
      [field]: value
    })
  }

  // Add new benefit
  const addBenefit = () => {
    const currentBenefits = Array.isArray(formData.benefits) ? formData.benefits : []
    handleBenefitsChange([...currentBenefits, ''])
  }

  // Remove benefit
  const removeBenefit = (index: number) => {
    const currentBenefits = Array.isArray(formData.benefits) ? formData.benefits : []
    handleBenefitsChange(currentBenefits.filter((_: string, i: number) => i !== index))
  }

  // Update benefit
  const updateBenefit = (index: number, value: string) => {
    const currentBenefits = Array.isArray(formData.benefits) ? formData.benefits : []
    const updatedBenefits = [...currentBenefits]
    updatedBenefits[index] = value
    handleBenefitsChange(updatedBenefits)
  }

  // Add new feature
  const addFeature = () => {
    const currentFeatures = Array.isArray(formData.features) ? formData.features : []
    handleFeaturesChange([...currentFeatures, { title: '', description: '', icon: '✨' }])
  }

  // Remove feature
  const removeFeature = (index: number) => {
    const currentFeatures = Array.isArray(formData.features) ? formData.features : []
    handleFeaturesChange(currentFeatures.filter((_: any, i: number) => i !== index))
  }

  // Update feature
  const updateFeature = (index: number, field: string, value: string) => {
    const currentFeatures = Array.isArray(formData.features) ? formData.features : []
    const updatedFeatures = [...currentFeatures]
    updatedFeatures[index] = { ...updatedFeatures[index], [field]: value }
    handleFeaturesChange(updatedFeatures)
  }

  // Add new image
  const addImage = () => {
    const currentImages = Array.isArray(formData.images) ? formData.images : [formData.image].filter(Boolean)
    const newImageUrl = prompt('Resim URL\'sini girin:')
    if (newImageUrl) {
      handleImagesChange([...currentImages, newImageUrl])
    }
  }

  // Remove image
  const removeImage = (index: number) => {
    const currentImages = Array.isArray(formData.images) ? formData.images : []
    if (currentImages.length > 1) { // Keep at least one image
      handleImagesChange(currentImages.filter((_: string, i: number) => i !== index))
    }
  }

  const benefits = Array.isArray(formData.benefits) ? formData.benefits : []
  const features = Array.isArray(formData.features) ? formData.features : []
  const images = formData.images || [formData.image].filter(Boolean)
  const seo = formData.seo || {}

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-charcoal mb-2">Landing Page İçeriği</h3>
        <p className="text-gray-custom">Service'iniz için detaylı landing page içeriğini oluşturun</p>
      </div>

      {/* Long Description */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-charcoal">
          Detaylı Açıklama *
        </label>
        <textarea
          value={formData.longDescription || ''}
          onChange={(e) => handleLongDescriptionChange(e.target.value)}
          rows={6}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent resize-none"
          placeholder="Service'iniz hakkında detaylı bilgi verin. Müşterilerin merak edebileceği tüm detayları ekleyin..."
        />
        <p className="text-xs text-gray-500">
          Bu açıklama landing page'de detay bölümünde gösterilecek. Satır başı için Enter kullanabilirsiniz.
        </p>
      </div>

      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-charcoal">
            Fotoğraf Galerisi
          </label>
          <button
            type="button"
            onClick={addImage}
            className="text-sm text-sage-600 hover:text-sage-700 font-medium"
          >
            + Fotoğraf Ekle
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image: string, index: number) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Service image ${index + 1}`}
                className="w-full h-24 object-cover rounded-lg border border-gray-200"
              />
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-sage-500 text-white text-xs px-2 py-1 rounded">
                  Ana Resim
                </div>
              )}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          İlk resim ana resim olarak kullanılacak. Diğerleri galeri olarak gösterilecek.
        </p>
      </div>

      {/* Benefits */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-charcoal">
            Faydalar
          </label>
          <button
            type="button"
            onClick={addBenefit}
            className="text-sm text-sage-600 hover:text-sage-700 font-medium"
          >
            + Fayda Ekle
          </button>
        </div>
        
        <div className="space-y-3">
          {benefits.map((benefit: string, index: number) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={benefit}
                onChange={(e) => updateBenefit(index, e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                placeholder="Fayda açıklaması..."
              />
              <button
                type="button"
                onClick={() => removeBenefit(index)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
          {benefits.length === 0 && (
            <p className="text-gray-500 text-sm italic">Henüz fayda eklenmemiş. + Fayda Ekle butonuna tıklayın.</p>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-charcoal">
            Özellikler
          </label>
          <button
            type="button"
            onClick={addFeature}
            className="text-sm text-sage-600 hover:text-sage-700 font-medium"
          >
            + Özellik Ekle
          </button>
        </div>
        
        <div className="space-y-4">
          {features.map((feature: any, index: number) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start gap-3 mb-3">
                <input
                  type="text"
                  value={feature.icon || ''}
                  onChange={(e) => updateFeature(index, 'icon', e.target.value)}
                  className="w-16 px-3 py-2 border border-gray-200 rounded text-center"
                  placeholder="🎯"
                />
                <div className="flex-1">
                  <input
                    type="text"
                    value={feature.title || ''}
                    onChange={(e) => updateFeature(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg font-medium"
                    placeholder="Özellik başlığı..."
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-500 hover:text-red-700 p-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
              <textarea
                value={feature.description || ''}
                onChange={(e) => updateFeature(index, 'description', e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                placeholder="Özellik açıklaması..."
              />
            </div>
          ))}
          {features.length === 0 && (
            <p className="text-gray-500 text-sm italic">Henüz özellik eklenmemiş. + Özellik Ekle butonuna tıklayın.</p>
          )}
        </div>
      </div>

      {/* SEO Settings */}
      <div className="space-y-4 border-t pt-6">
        <h4 className="text-md font-semibold text-charcoal">SEO Ayarları</h4>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              SEO Başlık
            </label>
            <input
              type="text"
              value={seo.title || ''}
              onChange={(e) => handleSeoChange('title', e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              placeholder={`${formData.title || ''} | Wellnesstal`}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              SEO Açıklama
            </label>
            <textarea
              value={seo.description || ''}
              onChange={(e) => handleSeoChange('description', e.target.value)}
              rows={2}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              placeholder={formData.shortDescription || ''}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Anahtar Kelimeler
            </label>
            <input
              type="text"
              value={(seo.keywords || []).join(', ')}
              onChange={(e) => handleSeoChange('keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              placeholder="wellness, massage, baesweiler, spa"
            />
            <p className="text-xs text-gray-500 mt-1">Virgülle ayırın</p>
          </div>
        </div>
      </div>
    </div>
  )
}