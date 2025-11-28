'use client'

import { ServiceFormData } from '../../../../../../types/services'

interface Category {
  id: string
  name: string
  color: string
  icon?: string
}

interface FinalSettingsStepProps {
  formData: ServiceFormData
  categories: Category[]
  onInputChange: (field: keyof ServiceFormData, value: any) => void
}

export default function FinalSettingsStep({
  formData,
  categories,
  onInputChange
}: FinalSettingsStepProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-charcoal mb-4">Son Ayarlar</h3>
      
      <div className="bg-sage-50 p-6 rounded-xl">
        <h4 className="font-medium text-charcoal mb-4">Hizmet Durumu ve Özellikler</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => onInputChange('popular', e.target.checked)}
                className="rounded border-gray-300 text-sage-600 shadow-sm focus:border-sage-300 focus:ring focus:ring-sage-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-charcoal">Popüler olarak işaretle</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => onInputChange('featured', e.target.checked)}
                className="rounded border-gray-300 text-sage-600 shadow-sm focus:border-sage-300 focus:ring focus:ring-sage-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-charcoal">Öne çıkan hizmet</span>
            </label>

            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => onInputChange('active', e.target.checked)}
                className="rounded border-gray-300 text-sage-600 shadow-sm focus:border-sage-300 focus:ring focus:ring-sage-200 focus:ring-opacity-50"
              />
              <span className="ml-2 text-sm text-charcoal">Aktif hizmet</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-charcoal mb-2">
              Sıralama
            </label>
            <input
              type="number"
              value={formData.order || ''}
              onChange={(e) => onInputChange('order', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              min="1"
            />
            <p className="text-xs text-gray-500 mt-1">
              Düşük numara üstte görünür
            </p>
          </div>
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Etiketler (virgülle ayırın)
        </label>
        <input
          type="text"
          value={formData.tags || ''}
          onChange={(e) => onInputChange('tags', e.target.value)}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="wellness, massage, relaxation, premium"
        />
        <p className="text-xs text-gray-500 mt-1">
          Etiketler arama için kullanılır
        </p>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h4 className="font-medium text-charcoal mb-4">Özet</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Hizmet:</span>
            <span className="ml-2 font-medium">{formData.title || 'Henüz girilmedi'}</span>
          </div>
          <div>
            <span className="text-gray-500">Kategori:</span>
            <span className="ml-2 font-medium">
              {formData.category ? categories.find(c => c.id === formData.category)?.name || 'Bilinmeyen' : 'Seçilmedi'}
            </span>
          </div>
          <div>
            <span className="text-gray-500">Süre:</span>
            <span className="ml-2 font-medium">{formData.duration || 'Henüz girilmedi'}</span>
          </div>
          <div>
            <span className="text-gray-500">Fiyat:</span>
            <span className="ml-2 font-medium">{formData.price || 'Henüz girilmedi'}</span>
          </div>
          <div className="col-span-2">
            <span className="text-gray-500">Durum:</span>
            <span className="ml-2">
              {formData.active ? (
                <span className="text-green-600">✓ Aktif</span>
              ) : (
                <span className="text-red-600">✗ Pasif</span>
              )}
              {formData.popular && <span className="ml-2 text-yellow-600">⭐ Popüler</span>}
              {formData.featured && <span className="ml-2 text-purple-600">🔥 Öne çıkan</span>}
            </span>
          </div>
        </div>

        {/* Button Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h5 className="text-sm font-medium text-charcoal mb-2">Button Konfigürasyonu</h5>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="bg-sage-50 p-3 rounded-lg">
              <div className="font-medium text-sage-800 mb-1">Primary Button</div>
              <div className="text-gray-600">
                "{formData.primaryButtonText}" ({formData.primaryButtonType})
              </div>
              {formData.primaryButtonValue && (
                <div className="text-gray-500 truncate mt-1">
                  {formData.primaryButtonValue}
                </div>
              )}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="font-medium text-gray-800 mb-1">Secondary Button</div>
              <div className="text-gray-600">
                "{formData.secondaryButtonText}" ({formData.secondaryButtonType})
              </div>
              {formData.secondaryButtonValue && (
                <div className="text-gray-500 truncate mt-1">
                  {formData.secondaryButtonValue}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Benefits Summary */}
        {formData.benefits && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-charcoal mb-2">Faydalar</h5>
            <div className="flex flex-wrap gap-1">
              {(typeof formData.benefits === 'string' 
                ? formData.benefits.split(',').map(b => b.trim()).filter(Boolean)
                : formData.benefits
              ).map((benefit, index) => (
                <span 
                  key={index}
                  className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                >
                  {benefit}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tags Summary */}
        {formData.tags && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h5 className="text-sm font-medium text-charcoal mb-2">Etiketler</h5>
            <div className="flex flex-wrap gap-1">
              {(typeof formData.tags === 'string'
                ? formData.tags.split(',').map(t => t.trim()).filter(Boolean)
                : formData.tags
              ).map((tag, index) => (
                <span 
                  key={index}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Final Validation Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Son Kontrol</h3>
            <div className="mt-1 text-sm text-yellow-700">
              <ul className="list-disc list-inside space-y-1">
                <li>Hizmet adı, açıklama, süre ve fiyat bilgilerini kontrol edin</li>
                <li>Button konfigürasyonlarının doğru olduğundan emin olun</li>
                <li>Kategori seçimi yapıldığından emin olun</li>
                <li>Görsel yüklendiğini veya varsayılan renk seçildiğini kontrol edin</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}