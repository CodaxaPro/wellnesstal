'use client'

import { TestimonialsContent } from '../../types'

interface AdvancedTabProps {
  content: TestimonialsContent
  updateContent: (updates: Partial<TestimonialsContent>) => void
}

export default function AdvancedTab({ content, updateContent }: AdvancedTabProps) {
  return (
    <div className="space-y-6">
      {/* Auto-Play Settings */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">Carousel Ayarları</h3>
        
        <div>
          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-700">Otomatik Oynatma</span>
            <input
              type="checkbox"
              checked={content.autoPlay !== false}
              onChange={(e) => updateContent({ autoPlay: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-2">
            Otomatik Geçiş Süresi: {content.autoSlideDelay || 5000}ms
          </label>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={content.autoSlideDelay || 5000}
            onChange={(e) => updateContent({ autoSlideDelay: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-sage-500"
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>1s</span>
            <span>10s</span>
          </div>
        </div>

        <div>
          <label className="flex items-center justify-between">
            <span className="text-sm text-slate-700">Puanları Göster</span>
            <input
              type="checkbox"
              checked={content.showRatings !== false}
              onChange={(e) => updateContent({ showRatings: e.target.checked })}
              className="rounded border-slate-300 text-sage-500 focus:ring-sage-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-2">
            Maksimum Gösterim Sayısı: {content.maxDisplayCount || 5}
          </label>
          <input
            type="number"
            min="1"
            max="10"
            value={content.maxDisplayCount || 5}
            onChange={(e) => updateContent({ maxDisplayCount: parseInt(e.target.value) || 5 })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Layout Settings */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">Düzen Ayarları</h3>
        
        <div>
          <label className="block text-xs text-slate-500 mb-2">Layout Tipi</label>
          <div className="grid grid-cols-2 gap-2">
            {['carousel', 'grid'].map(layout => (
              <button
                key={layout}
                onClick={() => updateContent({ layout: layout as any })}
                className={`p-3 rounded-lg border text-sm transition-all ${
                  (content.layout || 'carousel') === layout
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                {layout === 'carousel' ? '🎠 Carousel' : '📊 Grid'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

