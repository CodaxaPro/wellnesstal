'use client'

import { WhatsAppContent } from '../../types'

import { AVAILABILITY_MODE_OPTIONS } from './defaults'

interface AvailabilityTabProps {
  content: WhatsAppContent
  updateContent: (updates: Partial<WhatsAppContent>) => void
}

export default function AvailabilityTab({ content, updateContent }: AvailabilityTabProps) {
  const updateAvailability = (field: keyof WhatsAppContent['availability'], value: any) => {
    updateContent({
      availability: { ...content.availability, [field]: value }
    })
  }

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Musaitlik Modu
        </label>
        <div className="space-y-2">
          {AVAILABILITY_MODE_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateAvailability('mode', option.id)}
              className={`w-full p-3 border-2 rounded-xl text-left transition-all ${
                content.availability.mode === option.id
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Manual Status */}
      {content.availability.mode === 'manual' && (
        <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
          <div>
            <h4 className="font-medium text-slate-800">Cevrimici Durumu</h4>
            <p className="text-sm text-slate-500">Manuel olarak cevrimici/cevrimdisi ayarla</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={content.availability.manualStatus}
              onChange={(e) => updateAvailability('manualStatus', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
          </label>
        </div>
      )}

      {/* Show Indicator */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
        <div>
          <h4 className="font-medium text-slate-800">Durum Gostergesi</h4>
          <p className="text-sm text-slate-500">Cevrimici/cevrimdisi noktasi goster</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={content.availability.showIndicator}
            onChange={(e) => updateAvailability('showIndicator', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
        </label>
      </div>

      {/* Indicator Colors */}
      {content.availability.showIndicator && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-700">Gosterge Renkleri</h4>
          <div className="space-y-4">
            {/* Online Color */}
            <div>
              <label className="block text-xs text-slate-600 mb-1">Cevrimici Rengi</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={content.availability.onlineColor}
                  onChange={(e) => updateAvailability('onlineColor', e.target.value)}
                  className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={content.availability.onlineColor}
                  onChange={(e) => updateAvailability('onlineColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="#10B981"
                />
              </div>
            </div>

            {/* Offline Color */}
            <div>
              <label className="block text-xs text-slate-600 mb-1">Cevrimdisi Rengi</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={content.availability.offlineColor}
                  onChange={(e) => updateAvailability('offlineColor', e.target.value)}
                  className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={content.availability.offlineColor}
                  onChange={(e) => updateAvailability('offlineColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="#EF4444"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Offline Message */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Cevrimdisi Mesaji
        </label>
        <textarea
          value={content.availability.offlineMessage}
          onChange={(e) => updateAvailability('offlineMessage', e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows={2}
          placeholder="Su anda cevrimdisiyiz..."
        />
      </div>
    </div>
  )
}
