'use client'

import { WhatsAppContent } from '../../types'

interface CtaTabProps {
  content: WhatsAppContent
  updateContent: (updates: Partial<WhatsAppContent>) => void
}

export default function CtaTab({ content, updateContent }: CtaTabProps) {
  const updateCtaBubble = (field: keyof WhatsAppContent['ctaBubble'], value: any) => {
    updateContent({
      ctaBubble: { ...content.ctaBubble, [field]: value }
    })
  }

  return (
    <div className="space-y-6">
      {/* Enable CTA Bubble */}
      <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
        <div>
          <h4 className="font-medium text-slate-800">CTA Balonu Aktif</h4>
          <p className="text-sm text-slate-500">WhatsApp butonunun uzerinde bilgi balonu goster</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={content.ctaBubble.enabled}
            onChange={(e) => updateCtaBubble('enabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
        </label>
      </div>

      {content.ctaBubble.enabled && (
        <>
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Baslik
            </label>
            <input
              type="text"
              value={content.ctaBubble.title}
              onChange={(e) => updateCtaBubble('title', e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Sorulariniz mi var?"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Mesaj
            </label>
            <textarea
              value={content.ctaBubble.message}
              onChange={(e) => updateCtaBubble('message', e.target.value)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={2}
              placeholder="WhatsApp uzerinden bize yazin..."
            />
          </div>

          {/* Colors */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-slate-700">Renkler</h4>
            <div className="space-y-4">
              {/* Background Color */}
              <div>
                <label className="block text-xs text-slate-600 mb-1">Arkaplan</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.ctaBubble.backgroundColor}
                    onChange={(e) => updateCtaBubble('backgroundColor', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.ctaBubble.backgroundColor}
                    onChange={(e) => updateCtaBubble('backgroundColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {/* Title Color */}
              <div>
                <label className="block text-xs text-slate-600 mb-1">Baslik Rengi</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.ctaBubble.titleColor}
                    onChange={(e) => updateCtaBubble('titleColor', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.ctaBubble.titleColor}
                    onChange={(e) => updateCtaBubble('titleColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="#000000"
                  />
                </div>
              </div>

              {/* Text Color */}
              <div>
                <label className="block text-xs text-slate-600 mb-1">Metin Rengi</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={content.ctaBubble.textColor}
                    onChange={(e) => updateCtaBubble('textColor', e.target.value)}
                    className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={content.ctaBubble.textColor}
                    onChange={(e) => updateCtaBubble('textColor', e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="#000000"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Show After Delay */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gosterme Gecikmesi (ms)
            </label>
            <input
              type="number"
              value={content.ctaBubble.showAfterDelay}
              onChange={(e) => updateCtaBubble('showAfterDelay', parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              min={0}
              step={500}
            />
            <p className="text-sm text-slate-500 mt-2">
              Balonun gorunmesi icin beklenecek sure (milisaniye)
            </p>
          </div>

          {/* Dismissable */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <div>
              <h4 className="font-medium text-slate-800">Kapatilabilir</h4>
              <p className="text-sm text-slate-500">Kullanici balonu kapatabilsin</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={content.ctaBubble.dismissable}
                onChange={(e) => updateCtaBubble('dismissable', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
            </label>
          </div>
        </>
      )}

      {/* Preview */}
      {content.ctaBubble.enabled && (
        <div className="mt-6 p-4 bg-slate-100 rounded-xl">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Onizleme</h4>
          <div className="flex justify-center">
            <div
              className="p-4 rounded-2xl shadow-lg max-w-xs relative"
              style={{ backgroundColor: content.ctaBubble.backgroundColor }}
            >
              <h4
                className="font-semibold text-sm mb-1"
                style={{ color: content.ctaBubble.titleColor }}
              >
                {content.ctaBubble.title}
              </h4>
              <p
                className="text-xs leading-relaxed"
                style={{ color: content.ctaBubble.textColor }}
              >
                {content.ctaBubble.message}
              </p>
              <div
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
                style={{ borderTopColor: content.ctaBubble.backgroundColor }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
