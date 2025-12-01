'use client'

import { WhatsAppContent } from '../../types'

interface MessageTabProps {
  content: WhatsAppContent
  updateContent: (updates: Partial<WhatsAppContent>) => void
}

export default function MessageTab({ content, updateContent }: MessageTabProps) {
  const updateMessage = (field: keyof WhatsAppContent['message'], value: any) => {
    updateContent({
      message: { ...content.message, [field]: value }
    })
  }

  return (
    <div className="space-y-6">
      {/* Default Message */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Varsayilan Mesaj
        </label>
        <textarea
          value={content.message.defaultMessage}
          onChange={(e) => updateMessage('defaultMessage', e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows={3}
          placeholder="Merhaba, web sitenizden ulasiyorum..."
        />
        <p className="text-sm text-slate-500 mt-2">
          WhatsApp acildiginda otomatik doldurulacak mesaj
        </p>
      </div>

      {/* Tooltip Text */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tooltip Metni
        </label>
        <input
          type="text"
          value={content.message.tooltipText}
          onChange={(e) => updateMessage('tooltipText', e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          placeholder="WhatsApp ile yazin"
        />
        <p className="text-sm text-slate-500 mt-2">
          Butonun uzerine gelince gosterilecek metin
        </p>
      </div>

      {/* Tooltip Delay */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tooltip Gecikmesi (ms)
        </label>
        <input
          type="number"
          value={content.message.tooltipDelay}
          onChange={(e) => updateMessage('tooltipDelay', parseInt(e.target.value) || 0)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          min={0}
          step={100}
        />
      </div>

      {/* Show Tooltip on Load */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
        <div>
          <h4 className="font-medium text-slate-800">Sayfa Yuklendiginde Goster</h4>
          <p className="text-sm text-slate-500">Tooltip otomatik olarak gosterilsin</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={content.message.showTooltipOnLoad}
            onChange={(e) => updateMessage('showTooltipOnLoad', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      {/* Auto Show After */}
      {content.message.showTooltipOnLoad && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Otomatik Gosterme Gecikmesi (ms)
          </label>
          <input
            type="number"
            value={content.message.autoShowTooltipAfter}
            onChange={(e) => updateMessage('autoShowTooltipAfter', parseInt(e.target.value) || 0)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            min={0}
            step={500}
          />
        </div>
      )}
    </div>
  )
}
