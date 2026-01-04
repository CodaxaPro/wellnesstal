'use client'

import { useState, useEffect, useRef } from 'react'
import { ServicesContent, ServiceItem } from '../types'

interface ServicesBlockEditorProps {
  content: ServicesContent
  onUpdate: (content: Partial<ServicesContent>) => void
}

export default function ServicesBlockEditor({ content, onUpdate }: ServicesBlockEditorProps) {
  const [localContent, setLocalContent] = useState<ServicesContent>(content)

  const isInitialMount = useRef(true)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }
    const timer = setTimeout(() => {
      onUpdate(localContent)
    }, 300)
    return () => clearTimeout(timer)
  }, [localContent, onUpdate])

  const updateService = (index: number, updates: Partial<ServiceItem>) => {
    const newServices = [...localContent.services]
    newServices[index] = { ...newServices[index], ...updates }
    setLocalContent({ ...localContent, services: newServices })
  }

  const addService = () => {
    const newService: ServiceItem = {
      id: `service-${Date.now()}`,
      title: 'Yeni Hizmet',
      description: 'Hizmet açıklaması',
      price: '€50',
      duration: '60 Min'
    }
    setLocalContent({
      ...localContent,
      services: [...localContent.services, newService]
    })
  }

  const removeService = (index: number) => {
    const newServices = localContent.services.filter((_, i) => i !== index)
    setLocalContent({ ...localContent, services: newServices })
  }

  const moveService = (index: number, direction: 'up' | 'down') => {
    const newServices = [...localContent.services]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newServices.length) return

    [newServices[index], newServices[targetIndex]] = [newServices[targetIndex], newServices[index]]
    setLocalContent({ ...localContent, services: newServices })
  }

  return (
    <div className="space-y-6">
      {/* Block Title */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Block Başlığı
        </label>
        <input
          type="text"
          value={localContent.title || ''}
          onChange={(e) => setLocalContent({ ...localContent, title: e.target.value })}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Unsere Leistungen"
        />
      </div>

      {/* Layout Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Layout
        </label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setLocalContent({ ...localContent, layout: 'grid' })}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
              localContent.layout === 'grid'
                ? 'border-sage-500 bg-sage-50 text-sage-700'
                : 'border-slate-300 hover:border-sage-300'
            }`}
          >
            📊 Grid Layout
          </button>
          <button
            type="button"
            onClick={() => setLocalContent({ ...localContent, layout: 'list' })}
            className={`flex-1 py-2 px-4 rounded-lg border-2 transition-colors ${
              localContent.layout === 'list'
                ? 'border-sage-500 bg-sage-50 text-sage-700'
                : 'border-slate-300 hover:border-sage-300'
            }`}
          >
            📋 List Layout
          </button>
        </div>
      </div>

      {/* Show Prices Toggle */}
      <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
        <input
          type="checkbox"
          id="showPrices"
          checked={localContent.showPrices !== false}
          onChange={(e) => setLocalContent({ ...localContent, showPrices: e.target.checked })}
          className="w-5 h-5 text-sage-600 rounded focus:ring-sage-500"
        />
        <label htmlFor="showPrices" className="text-sm font-medium text-slate-700">
          Fiyatları göster
        </label>
      </div>

      {/* Services List */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-800">
            Hizmetler ({localContent.services.length})
          </h3>
          <button
            type="button"
            onClick={addService}
            className="px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
          >
            + Hizmet Ekle
          </button>
        </div>

        {localContent.services.map((service, index) => (
          <div key={service.id} className="p-4 border-2 border-slate-200 rounded-xl space-y-3 bg-white">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  value={service.title}
                  onChange={(e) => updateService(index, { title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                  placeholder="Hizmet adı"
                />
                <textarea
                  value={service.description}
                  onChange={(e) => updateService(index, { description: e.target.value })}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                  placeholder="Hizmet açıklaması"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={service.price || ''}
                    onChange={(e) => updateService(index, { price: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                    placeholder="€50"
                  />
                  <input
                    type="text"
                    value={service.duration || ''}
                    onChange={(e) => updateService(index, { duration: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                    placeholder="60 Min"
                  />
                  <input
                    type="text"
                    value={service.image || ''}
                    onChange={(e) => updateService(index, { image: e.target.value })}
                    className="px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sage-500"
                    placeholder="Resim URL"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => moveService(index, 'up')}
                  disabled={index === 0}
                  className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveService(index, 'down')}
                  disabled={index === localContent.services.length - 1}
                  className="p-2 text-slate-600 hover:text-slate-900 disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeService(index)}
                  className="p-2 text-red-600 hover:text-red-800"
                >
                  🗑️
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
