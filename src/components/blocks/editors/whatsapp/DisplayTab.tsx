'use client'

import { WhatsAppContent } from '../../types'

interface DisplayTabProps {
  content: WhatsAppContent
  updateContent: (updates: Partial<WhatsAppContent>) => void
}

export default function DisplayTab({ content, updateContent }: DisplayTabProps) {
  const updateDisplay = (field: keyof WhatsAppContent['display'], value: any) => {
    updateContent({
      display: { ...content.display, [field]: value }
    })
  }

  return (
    <div className="space-y-6">
      {/* Device Visibility */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700">Cihaz Gorunurlugu</h4>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <div>
            <span className="font-medium text-slate-700">Mobilde Goster</span>
            <p className="text-xs text-slate-500">Telefon ve tabletlerde gorunur</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={content.display.showOnMobile}
              onChange={(e) => updateDisplay('showOnMobile', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
          </label>
        </div>

        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
          <div>
            <span className="font-medium text-slate-700">Masaustunde Goster</span>
            <p className="text-xs text-slate-500">Bilgisayarlarda gorunur</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={content.display.showOnDesktop}
              onChange={(e) => updateDisplay('showOnDesktop', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
          </label>
        </div>
      </div>

      {/* Page Visibility */}
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
        <div>
          <h4 className="font-medium text-slate-800">Tum Sayfalarda Goster</h4>
          <p className="text-sm text-slate-500">Butonu tum sayfalarda goster</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={content.display.showOnAllPages}
            onChange={(e) => updateDisplay('showOnAllPages', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
        </label>
      </div>

      {/* Timing */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700">Zamanlama</h4>

        <div>
          <label className="block text-xs text-slate-600 mb-1">
            Gosterme Gecikmesi (ms)
          </label>
          <input
            type="number"
            value={content.display.showAfterDelay}
            onChange={(e) => updateDisplay('showAfterDelay', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            min={0}
            step={500}
          />
          <p className="text-xs text-slate-500 mt-1">
            Sayfa yüklendikten sonra butonun gorunmesi icin beklenecek sure
          </p>
        </div>

        <div>
          <label className="block text-xs text-slate-600 mb-1">
            Scroll Sonrasi Goster (px)
          </label>
          <input
            type="number"
            value={content.display.showAfterScroll}
            onChange={(e) => updateDisplay('showAfterScroll', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            min={0}
            step={50}
          />
          <p className="text-xs text-slate-500 mt-1">
            Kullanici belirtilen piksel kadar kaydirdiktan sonra goster (0 = hemen)
          </p>
        </div>
      </div>
    </div>
  )
}
