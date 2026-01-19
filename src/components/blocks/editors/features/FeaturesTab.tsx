'use client'

import { FeaturesContent, FeatureItem } from '../../types'

import { getDefaultFeatureItem } from './defaults'
import FeatureItemEditor from './shared/FeatureItemEditor'

interface FeaturesTabProps {
  content: FeaturesContent
  updateContent: (updates: Partial<FeaturesContent>) => void
}

export default function FeaturesTab({ content, updateContent }: FeaturesTabProps) {
  const addFeature = () => {
    const newFeature = getDefaultFeatureItem()
    updateContent({ features: [...content.features, newFeature] })
  }

  const updateFeature = (index: number, updates: Partial<FeatureItem>) => {
    const newFeatures = [...content.features]
    const currentFeature = newFeatures[index]

    // Deep merge for nested objects like image
    const mergedUpdates: Partial<FeatureItem> = { ...updates }

    // If updating image, merge with existing image object (if it exists)
    if (updates.image) {
      if (currentFeature.image) {
        // Merge with existing image - preserve all properties
        mergedUpdates.image = {
          ...currentFeature.image,
          ...updates.image
        }
      } else {
        // Use new image directly if no existing image
        mergedUpdates.image = updates.image
      }
    }

    newFeatures[index] = { ...currentFeature, ...mergedUpdates }
    updateContent({ features: newFeatures })
  }

  const deleteFeature = (index: number) => {
    const newFeatures = content.features.filter((_, i) => i !== index)
    updateContent({ features: newFeatures })
  }

  const moveFeature = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= content.features.length) {
return
}
    const newFeatures = [...content.features]
    const [movedItem] = newFeatures.splice(fromIndex, 1)
    newFeatures.splice(toIndex, 0, movedItem)
    updateContent({ features: newFeatures })
  }

  const duplicateFeature = (index: number) => {
    const feature = content.features[index]
    // Create unique ID with timestamp and random number to avoid collisions
    const uniqueId = `feature-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const duplicated = {
      ...feature,
      id: uniqueId,
      title: `${feature.title} (Kopya)`
    }
    const newFeatures = [...content.features]
    newFeatures.splice(index + 1, 0, duplicated)
    updateContent({ features: newFeatures })
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-700">Özellikler</h3>
          <p className="text-xs text-slate-500">{content.features.length} özellik tanımlı</p>
        </div>
        <button
          onClick={addFeature}
          className="flex items-center gap-2 px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Özellik Ekle
        </button>
      </div>

      {/* Visibility Controls */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Görünürlük Ayarları</label>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.showIcons ?? true}
              onChange={(e) => updateContent({ showIcons: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-sm text-slate-600">İkonları Göster</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.showDescriptions ?? true}
              onChange={(e) => updateContent({ showDescriptions: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-sm text-slate-600">Açıklamaları Göster</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={content.showLinks ?? false}
              onChange={(e) => updateContent({ showLinks: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
            <span className="text-sm text-slate-600">Linkleri Göster</span>
          </label>
        </div>
      </div>

      {/* Feature List */}
      <div className="space-y-3">
        {content.features.length === 0 ? (
          <div className="p-8 border-2 border-dashed border-slate-200 rounded-xl text-center">
            <div className="text-4xl mb-3">📦</div>
            <h4 className="font-medium text-slate-700 mb-1">Henüz özellik eklenmedi</h4>
            <p className="text-sm text-slate-500 mb-4">İlk özelliğinizi ekleyerek başlayın</p>
            <button
              onClick={addFeature}
              className="px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
            >
              İlk Özelliği Ekle
            </button>
          </div>
        ) : (
          content.features.map((feature, index) => {
            // Ensure unique key - use id if exists, otherwise create stable key from index
            const uniqueKey = feature.id || `feature-${index}-${feature.title?.substring(0, 10) || 'item'}`
            return (
            <div key={uniqueKey} className="group relative">
              <FeatureItemEditor
                key={uniqueKey}
                feature={feature}
                index={index}
                onUpdate={updateFeature}
                onDelete={deleteFeature}
                onMoveUp={index > 0 ? () => moveFeature(index, index - 1) : undefined}
                onMoveDown={index < content.features.length - 1 ? () => moveFeature(index, index + 1) : undefined}
                showAdvanced={content.showLinks}
              />

              {/* Quick Actions Overlay */}
              <div className="absolute -right-2 top-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => duplicateFeature(index)}
                  className="p-1.5 bg-white rounded-full shadow-md text-slate-400 hover:text-sage-500 border border-slate-200"
                  title="Kopyala"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
            </div>
            )
          })
        )}
      </div>

      {/* Bulk Actions */}
      {content.features.length > 1 && (
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
          <label className="block text-sm font-semibold text-slate-700 mb-3">Toplu İşlemler</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                const reversed = [...content.features].reverse()
                updateContent({ features: reversed })
              }}
              className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:border-sage-500 transition-colors"
            >
              Sırayı Ters Çevir
            </button>
            <button
              onClick={() => {
                const sorted = [...content.features].sort((a, b) => a.title.localeCompare(b.title))
                updateContent({ features: sorted })
              }}
              className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:border-sage-500 transition-colors"
            >
              Alfabetik Sırala
            </button>
            <button
              onClick={() => {
                const visible = content.features.map(f => ({ ...f, visible: true }))
                updateContent({ features: visible })
              }}
              className="px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg hover:border-sage-500 transition-colors"
            >
              Tümünü Göster
            </button>
            <button
              onClick={() => {
                if (confirm('Tüm özellikleri silmek istediğinizden emin misiniz?')) {
                  updateContent({ features: [] })
                }
              }}
              className="px-3 py-1.5 text-sm bg-red-50 border border-red-200 text-red-600 rounded-lg hover:border-red-500 transition-colors"
            >
              Tümünü Sil
            </button>
          </div>
        </div>
      )}

      {/* Quick Add Templates */}
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-3">Hızlı Şablonlar</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            {
              label: 'Spa/Wellness',
              features: [
                { title: 'Doğal Ürünler', description: 'Organik ve doğal bakım ürünleri', icon: 'leaf' },
                { title: 'Uzman Kadro', description: 'Sertifikalı terapistler', icon: 'user' },
                { title: 'Hijyen', description: 'Steril ortam garantisi', icon: 'shield' },
                { title: 'Randevu', description: 'Online randevu sistemi', icon: 'calendar' },
              ]
            },
            {
              label: 'E-Ticaret',
              features: [
                { title: 'Hızlı Kargo', description: '24 saat içinde teslimat', icon: 'package' },
                { title: 'Güvenli Ödeme', description: '3D Secure alışveriş', icon: 'lock' },
                { title: 'İade Garantisi', description: '14 gün iade hakkı', icon: 'checkCircle' },
                { title: '7/24 Destek', description: 'Canlı destek hattı', icon: 'messageCircle' },
              ]
            },
            {
              label: 'Kurumsal',
              features: [
                { title: 'Deneyim', description: '20+ yıllık tecrübe', icon: 'award' },
                { title: 'Kalite', description: 'ISO sertifikalı süreçler', icon: 'star' },
                { title: 'Global', description: '50+ ülkede hizmet', icon: 'globe' },
                { title: 'İnovasyon', description: 'R&D yatırımları', icon: 'zap' },
              ]
            },
            {
              label: 'Sağlık',
              features: [
                { title: 'Uzman Doktorlar', description: 'Alanında uzman kadro', icon: 'heart' },
                { title: 'Modern Cihazlar', description: 'Son teknoloji ekipman', icon: 'activity' },
                { title: 'Hasta Güvenliği', description: 'Uluslararası standartlar', icon: 'shieldCheck' },
                { title: 'Randevu', description: 'Online randevu al', icon: 'clock' },
              ]
            },
          ].map((template, idx) => (
            <button
              key={idx}
              onClick={() => {
                const newFeatures = template.features.map((f, i) => ({
                  ...getDefaultFeatureItem(),
                  id: `feature-${Date.now()}-${i}`,
                  title: f.title,
                  description: f.description,
                  icon: f.icon,
                  iconConfig: {
                    type: 'preset' as const,
                    value: f.icon,
                    backgroundColor: '#10b981',
                    iconColor: '#ffffff',
                    size: 'md' as const,
                    shape: 'circle' as const,
                    shadow: 'none' as const
                  }
                }))
                updateContent({ features: [...content.features, ...newFeatures] })
              }}
              className="p-3 rounded-xl border border-slate-200 hover:border-sage-500 hover:bg-sage-50 transition-all text-center"
            >
              <div className="text-sm font-medium text-slate-700">{template.label}</div>
              <div className="text-xs text-slate-500 mt-1">{template.features.length} özellik</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
