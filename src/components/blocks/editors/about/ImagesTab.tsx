'use client'

import { AboutContent, AboutImage } from '../../types'

interface ImagesTabProps {
  content: AboutContent
  updateContent: (updates: Partial<AboutContent>) => void
}

export default function ImagesTab({ content, updateContent }: ImagesTabProps) {
  const updateImage = (index: number, field: 'url' | 'alt', value: string) => {
    const newImages = [...(content.images || [])]
    if (!newImages[index]) {
      newImages[index] = { url: '', alt: '' }
    }
    newImages[index] = { ...newImages[index], [field]: value }
    updateContent({ images: newImages })
  }

  const addImage = () => {
    const newImage: AboutImage = { url: '', alt: '' }
    updateContent({ images: [...(content.images || []), newImage] })
  }

  const removeImage = (index: number) => {
    const newImages = (content.images || []).filter((_, i) => i !== index)
    updateContent({ images: newImages })
  }

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...(content.images || [])]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newImages.length) return

    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]]
    updateContent({ images: newImages })
  }

  return (
    <div className="space-y-6">
      <div className="p-4 bg-white rounded-xl border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-semibold text-slate-700">
            Görseller ({(content.images || []).length} / 4 önerilir)
          </h3>
          <button
            type="button"
            onClick={addImage}
            className="px-3 py-1.5 bg-sage-500 text-white text-sm rounded-lg hover:bg-sage-600 transition-colors"
          >
            + Ekle
          </button>
        </div>

        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {(content.images || []).map((image, index) => (
            <div key={index} className="p-3 border border-slate-200 rounded-lg space-y-2 bg-slate-50">
              <div className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Görsel URL</label>
                    <input
                      type="text"
                      value={image.url}
                      onChange={(e) => updateImage(index, 'url', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                      placeholder="https://..."
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Alt Text</label>
                    <input
                      type="text"
                      value={image.alt}
                      onChange={(e) => updateImage(index, 'alt', e.target.value)}
                      className="w-full px-2 py-1.5 border border-slate-200 rounded text-sm"
                      placeholder="Görsel açıklaması"
                    />
                  </div>
                  {image.url && (
                    <div className="relative w-full h-32 rounded-lg overflow-hidden border border-slate-200">
                      <img
                        src={image.url}
                        alt={image.alt || 'Preview'}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 text-xs"
                    title="Yukarı"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === (content.images || []).length - 1}
                    className="p-1 text-slate-600 hover:text-slate-900 disabled:opacity-30 text-xs"
                    title="Aşağı"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="p-1 text-red-600 hover:text-red-800 text-xs"
                    title="Sil"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

