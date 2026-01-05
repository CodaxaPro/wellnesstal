'use client'

import { AboutContent } from '../../types'

interface BackgroundTabProps {
  content: AboutContent
  updateContent: (updates: Partial<AboutContent>) => void
}

export default function BackgroundTab({ content, updateContent }: BackgroundTabProps) {
  const backgroundColors = [
    { value: '#FFFFFF', label: 'White' },
    { value: '#F7F5F3', label: 'Cream' },
    { value: '#f8fafc', label: 'Slate 50' },
    { value: '#eef1ea', label: 'Sage 100' },
    { value: '#f7f8f5', label: 'Sage 50' },
  ]

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <label className="block text-sm font-semibold text-slate-700 mb-4">Bölüm Arkaplanı</label>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">Hızlı Renkler</label>
            <div className="flex gap-2 flex-wrap">
              {backgroundColors.map(color => (
                <button
                  key={color.value}
                  onClick={() => updateContent({ background: { ...content.background, color: color.value } })}
                  className={`px-3 py-2 rounded-lg border text-xs transition-all ${
                    content.background?.color === color.value
                      ? 'border-sage-500 bg-sage-50 text-sage-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                >
                  {color.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Özel Renk</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.background?.color || '#FFFFFF'}
                onChange={(e) => updateContent({ background: { ...content.background, color: e.target.value } })}
                className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.background?.color || '#FFFFFF'}
                onChange={(e) => updateContent({ background: { ...content.background, color: e.target.value } })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

