'use client'

import type { ServiceFormData } from '@/types/services'

interface VisualStyleStepProps {
  formData: ServiceFormData
  gradientColor: string
  onInputChange: (field: keyof ServiceFormData, value: any) => void
  onGradientColorChange: (color: string) => void
}

export default function VisualStyleStep({
  formData,
  gradientColor,
  onInputChange,
  onGradientColorChange
}: VisualStyleStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-charcoal mb-4">Görsel ve Stil</h3>

      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Hizmet Görseli
        </label>

        {/* Current Image Preview */}
        {formData.image && formData.image !== '/images/default-service.jpg' && (
          <div className="relative w-32 h-32 mb-4 rounded-xl overflow-hidden border border-gray-200">
            <img
              src={formData.image}
              alt="Service preview"
              className="w-full h-full object-cover"
              onError={() => onInputChange('image', '/images/default-service.jpg')}
            />
            <button
              type="button"
              onClick={() => onInputChange('image', '/images/default-service.jpg')}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    if (file.size > 5 * 1024 * 1024) {
                      alert('Dosya boyutu 5MB\'den küçük olmalıdır')
                      return
                    }
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      onInputChange('image', reader.result as string)
                    }
                    reader.readAsDataURL(file)
                  }
                }}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-sage-500 transition-colors">
                <svg className="h-8 w-8 mx-auto mb-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p className="text-sm font-medium text-gray-700">Dosya Seç</p>
                <p className="text-xs text-gray-400">PNG, JPG, WebP (max 5MB)</p>
              </div>
            </label>
          </div>

          {/* URL Input */}
          <div className="relative">
            <input
              type="url"
              value={formData.image === '/images/default-service.jpg' ? '' : formData.image}
              onChange={(e) => onInputChange('image', e.target.value || '/images/default-service.jpg')}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              placeholder="Veya URL girin: https://example.com/image.jpg"
            />
          </div>

          {/* Stock Image Suggestions */}
          <div className="bg-gray-50 p-4 rounded-xl">
            <h4 className="font-medium text-charcoal mb-3">Önerilen Wellness Görselleri</h4>
            <div className="grid grid-cols-4 gap-2">
              {[
                'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
                'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=400',
                'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=400',
                'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400'
              ].map((url, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => onInputChange('image', url)}
                  className="relative h-16 rounded-lg overflow-hidden hover:ring-2 hover:ring-sage-500 transition-all"
                >
                  <img src={url} alt={`Suggestion ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Gradient Color Selector */}
        <div className="bg-sage-50 p-4 rounded-xl mt-4">
          <label className="block text-sm font-medium text-charcoal mb-3">
            Görsel yoksa kullanılacak renk
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { name: 'Sage-Forest', value: 'from-sage-400 to-forest-500' },
              { name: 'Earth-Sage', value: 'from-earth-400 to-sage-500' },
              { name: 'Sage-Earth', value: 'from-sage-500 to-earth-400' },
              { name: 'Forest-Sage', value: 'from-forest-400 to-sage-600' },
              { name: 'Light Sage', value: 'from-sage-300 to-forest-400' },
              { name: 'Warm Earth', value: 'from-earth-300 to-sage-400' }
            ].map((gradient) => (
              <button
                key={gradient.value}
                type="button"
                onClick={() => onGradientColorChange(gradient.value)}
                className={`h-16 rounded-xl bg-gradient-to-br ${gradient.value} border-2 transition-all ${
                  gradientColor === gradient.value
                    ? 'border-sage-600 ring-2 ring-sage-200'
                    : 'border-gray-200 hover:border-sage-400'
                }`}
                title={gradient.name}
              />
            ))}
          </div>

          {/* Preview */}
          <div className="mt-3 flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradientColor} flex items-center justify-center text-white`}>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-sm text-gray-600">Görsel yoksa bu renk kullanılacak</span>
          </div>
        </div>
      </div>
    </div>
  )
}
