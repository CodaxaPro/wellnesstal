'use client'

import { WhatsAppContent } from '../../types'

import { POSITION_OPTIONS } from './defaults'

interface BasicTabProps {
  content: WhatsAppContent
  updateContent: (updates: Partial<WhatsAppContent>) => void
}

export default function BasicTab({ content, updateContent }: BasicTabProps) {
  const updateBasic = (field: keyof WhatsAppContent['basic'], value: any) => {
    updateContent({
      basic: { ...content.basic, [field]: value }
    })
  }

  return (
    <div className="space-y-6">
      {/* Info message - always uses homepage settings */}
      <div className="p-5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border-2 border-green-200">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center text-white text-2xl shadow-lg flex-shrink-0">
            🏠
          </div>
          <div>
            <h3 className="font-semibold text-slate-800 mb-1">Anasayfa WhatsApp Ayarları Kullanılıyor</h3>
            <p className="text-sm text-slate-600">
              Bu WhatsApp bloğu, anasayfadaki WhatsApp ayarlarını kullanır. Ayarları değiştirmek için <a href="/admin/pages" className="text-green-600 hover:underline font-medium">Admin → Sayfalar → Home</a> sayfasındaki WhatsApp bloğunu düzenleyin.
            </p>
          </div>
        </div>
      </div>
      {/* Enabled Toggle */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
        <div>
          <h4 className="font-medium text-slate-800">WhatsApp Butonu Aktif</h4>
          <p className="text-sm text-slate-500">Butonu web sitesinde goster</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={content.basic.enabled}
            onChange={(e) => updateBasic('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
        </label>
      </div>

      {/* Use Original Style */}
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
        <div>
          <h4 className="font-medium text-slate-800">Orijinal Stil Kullan</h4>
          <p className="text-sm text-slate-500">Standart WhatsApp butonu, ozellestirme olmadan</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={content.basic.useOriginalStyle}
            onChange={(e) => updateBasic('useOriginalStyle', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
        </label>
      </div>

      {/* Phone Number */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          WhatsApp Telefon Numarasi
        </label>
        <input
          type="tel"
          value={content.basic.phoneNumber}
          onChange={(e) => updateBasic('phoneNumber', e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="+90 555 123 4567"
        />
        <p className="text-sm text-slate-500 mt-2">
          Ulke kodu ile birlikte girin (ornek: +90 Turkiye icin)
        </p>
      </div>

      {/* Position */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Buton Konumu
        </label>
        <div className="grid grid-cols-2 gap-4">
          {POSITION_OPTIONS.map((option) => (
            <button
              key={option.id}
              onClick={() => updateBasic('position', option.id)}
              className={`p-4 border-2 rounded-xl text-center transition-all ${
                content.basic.position === option.id
                  ? 'border-green-500 bg-green-50 text-green-700'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="text-2xl mb-2">{option.icon}</div>
              <span className="text-sm font-medium">{option.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
