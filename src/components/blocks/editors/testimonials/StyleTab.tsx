'use client'

import { TestimonialsContent } from '../../types'

interface StyleTabProps {
  content: TestimonialsContent
  updateContent: (updates: Partial<TestimonialsContent>) => void
}

export default function StyleTab({ content, updateContent }: StyleTabProps) {
  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Ana Kart Stili</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">Arkaplan Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.cardStyles?.mainCardBackground || '#ffffff'}
                onChange={(e) => updateContent({ 
                  cardStyles: { ...content.cardStyles, mainCardBackground: e.target.value } 
                })}
                className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.cardStyles?.mainCardBackground || '#ffffff'}
                onChange={(e) => updateContent({ 
                  cardStyles: { ...content.cardStyles, mainCardBackground: e.target.value } 
                })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Köşe Yuvarlaklığı</label>
            <div className="grid grid-cols-6 gap-2">
              {['0.75rem', '1rem', '1.5rem', '1.75rem', '2rem', '3rem'].map(radius => (
                <button
                  key={radius}
                  onClick={() => updateContent({ 
                    cardStyles: { ...content.cardStyles, mainCardRadius: radius } 
                  })}
                  className={`p-2 rounded-lg border text-center text-xs transition-all ${
                    content.cardStyles?.mainCardRadius === radius
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {radius}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Küçük Kartlar Stili</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-slate-500 mb-2">Arkaplan Rengi</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={content.cardStyles?.smallCardBackground || '#ffffff'}
                onChange={(e) => updateContent({ 
                  cardStyles: { ...content.cardStyles, smallCardBackground: e.target.value } 
                })}
                className="w-12 h-10 rounded-lg border border-slate-200 cursor-pointer"
              />
              <input
                type="text"
                value={content.cardStyles?.smallCardBackground || '#ffffff'}
                onChange={(e) => updateContent({ 
                  cardStyles: { ...content.cardStyles, smallCardBackground: e.target.value } 
                })}
                className="flex-1 px-3 py-2 border border-slate-200 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-500 mb-2">Köşe Yuvarlaklığı</label>
            <div className="grid grid-cols-6 gap-2">
              {['0.5rem', '0.75rem', '1rem', '1.25rem', '1.5rem', '2rem'].map(radius => (
                <button
                  key={radius}
                  onClick={() => updateContent({ 
                    cardStyles: { ...content.cardStyles, smallCardRadius: radius } 
                  })}
                  className={`p-2 rounded-lg border text-center text-xs transition-all ${
                    content.cardStyles?.smallCardRadius === radius
                      ? 'border-sage-500 bg-sage-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {radius}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

