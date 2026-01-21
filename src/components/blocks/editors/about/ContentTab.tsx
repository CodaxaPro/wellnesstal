'use client'

import { AboutContent, AboutStat } from '../../types'

interface ContentTabProps {
  content: AboutContent
  updateContent: (updates: Partial<AboutContent>) => void
}

export default function ContentTab({ content, updateContent }: ContentTabProps) {
  const updateStat = (index: number, field: 'label' | 'value', value: string) => {
    const newStats = [...(content.stats || [])]
    if (!newStats[index]) {
      newStats[index] = { label: '', value: '' }
    }
    newStats[index] = { ...newStats[index], [field]: value }
    updateContent({ stats: newStats })
  }

  const addStat = () => {
    const newStat: AboutStat = { label: 'Stat Label', value: '100+' }
    updateContent({ stats: [...(content.stats || []), newStat] })
  }

  const removeStat = (index: number) => {
    const newStats = (content.stats || []).filter((_, i) => i !== index)
    updateContent({ stats: newStats })
  }

  // Unused functions - kept for future use
  // const updateImage = (index: number, field: 'url' | 'alt', value: string) => {
  //   const newImages = [...(content.images || [])]
  //   if (!newImages[index]) {
  //     newImages[index] = { url: '', alt: '' }
  //   }
  //   newImages[index] = { ...newImages[index], [field]: value }
  //   updateContent({ images: newImages })
  // }

  // const addImage = () => {
  //   const newImage: AboutImage = { url: '', alt: '' }
  //   updateContent({ images: [...(content.images || []), newImage] })
  // }

  // const removeImage = (index: number) => {
  //   const newImages = (content.images || []).filter((_, i) => i !== index)
  //   updateContent({ images: newImages })
  // }

  return (
    <div className="space-y-6">
      {/* Header Content */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">Bölüm Başlığı</h3>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Badge</label>
          <input
            type="text"
            value={content.badge || ''}
            onChange={(e) => updateContent({ badge: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            placeholder="✨ Über WellnessTal Studio"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Başlık</label>
          <input
            type="text"
            value={content.title || ''}
            onChange={(e) => updateContent({ title: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            placeholder="Ihre Wellness-Oase im Herzen von Baesweiler"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Vurgulu Metin (Başlığın son kelimesi)</label>
          <input
            type="text"
            value={content.highlightedText || ''}
            onChange={(e) => updateContent({ highlightedText: e.target.value })}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            placeholder="Baesweiler"
          />
        </div>

        <div>
          <label className="block text-xs text-slate-500 mb-1">Açıklama</label>
          <textarea
            value={content.description || ''}
            onChange={(e) => updateContent({ description: e.target.value })}
            rows={4}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
            placeholder="Seit über 5 Jahren widmen wir uns..."
          />
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-slate-700">
            İstatistikler ({(content.stats || []).length})
          </h3>
          <button
            type="button"
            onClick={addStat}
            className="px-3 py-1.5 bg-sage-500 text-white text-sm rounded-lg hover:bg-sage-600 transition-colors"
          >
            + Ekle
          </button>
        </div>

        <div className="space-y-2">
          {(content.stats || []).map((stat, index) => (
            <div key={index} className="flex gap-2 items-center p-2 border border-slate-200 rounded-lg">
              <input
                type="text"
                value={stat.value}
                onChange={(e) => updateStat(index, 'value', e.target.value)}
                className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm"
                placeholder="500+"
              />
              <input
                type="text"
                value={stat.label}
                onChange={(e) => updateStat(index, 'label', e.target.value)}
                className="flex-1 px-2 py-1.5 border border-slate-200 rounded text-sm"
                placeholder="Zufriedene Kunden"
              />
              <button
                type="button"
                onClick={() => removeStat(index)}
                className="p-1.5 text-red-600 hover:text-red-800"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-4">
        <h3 className="text-sm font-semibold text-slate-700">Butonlar</h3>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs text-slate-500 mb-1">Birincil Buton Metni</label>
            <input
              type="text"
              value={content.primaryButton || ''}
              onChange={(e) => updateContent({ primaryButton: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="Persönliche Beratung"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">Birincil Buton Link</label>
            <input
              type="text"
              value={content.primaryButtonLink || ''}
              onChange={(e) => updateContent({ primaryButtonLink: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="#contact"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">İkincil Buton Metni</label>
            <input
              type="text"
              value={content.secondaryButton || ''}
              onChange={(e) => updateContent({ secondaryButton: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="Mehr erfahren"
            />
          </div>
          <div>
            <label className="block text-xs text-slate-500 mb-1">İkincil Buton Link</label>
            <input
              type="text"
              value={content.secondaryButtonLink || ''}
              onChange={(e) => updateContent({ secondaryButtonLink: e.target.value })}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm"
              placeholder="#contact"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

