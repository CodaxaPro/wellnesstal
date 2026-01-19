'use client'

import { GalleryContent } from '../../types'

interface LightboxTabProps {
  content: GalleryContent
  updateContent: (updates: Partial<GalleryContent>) => void
}

export default function LightboxTab({ content, updateContent }: LightboxTabProps) {
  const updateLightbox = (field: keyof GalleryContent['lightbox'], value: any) => {
    updateContent({
      lightbox: { ...content.lightbox, [field]: value }
    })
  }

  const updateFilter = (field: keyof GalleryContent['filter'], value: any) => {
    updateContent({
      filter: { ...content.filter, [field]: value }
    })
  }

  // Get unique categories from images
  const imageCategories = [...new Set(content.images.map(img => img.category).filter(Boolean))] as string[]

  return (
    <div className="space-y-6">
      {/* Lightbox Settings */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">L</span>
          Lightbox Ayarlari
        </h4>

        {/* Enable Lightbox */}
        <div className="flex items-center justify-between p-4 bg-sage-50 border border-sage-200 rounded-xl">
          <div>
            <span className="font-medium text-slate-800">Lightbox Aktif</span>
            <p className="text-xs text-slate-500">Gorsellere tiklandiginda buyuk gorun</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={content.lightbox.enabled}
              onChange={(e) => updateLightbox('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500" />
          </label>
        </div>

        {content.lightbox.enabled && (
          <>
            {/* Show Thumbnails */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-medium text-slate-700">Kucuk Resimler</span>
                <p className="text-xs text-slate-500">Lightbox altinda thumbnail goster</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.lightbox.showThumbnails}
                  onChange={(e) => updateLightbox('showThumbnails', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500" />
              </label>
            </div>

            {/* Show Counter */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-medium text-slate-700">Sayac Goster</span>
                <p className="text-xs text-slate-500">1/10 gibi gorsel sayaci</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.lightbox.showCounter}
                  onChange={(e) => updateLightbox('showCounter', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500" />
              </label>
            </div>

            {/* Show Caption in Lightbox */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-medium text-slate-700">Aciklama Goster</span>
                <p className="text-xs text-slate-500">Lightbox'ta gorsel aciklamasi</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.lightbox.showCaption}
                  onChange={(e) => updateLightbox('showCaption', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500" />
              </label>
            </div>

            {/* Close on Overlay Click */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-medium text-slate-700">Tikla Kapat</span>
                <p className="text-xs text-slate-500">Dis alana tiklaninca kapat</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.lightbox.closeOnOverlayClick}
                  onChange={(e) => updateLightbox('closeOnOverlayClick', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500" />
              </label>
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Arkaplan Rengi
              </label>
              <input
                type="text"
                value={content.lightbox.backgroundColor}
                onChange={(e) => updateLightbox('backgroundColor', e.target.value)}
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent font-mono text-sm"
                placeholder="rgba(0,0,0,0.9)"
              />
            </div>
          </>
        )}
      </div>

      {/* Filter Settings */}
      <div className="space-y-4 pt-6 border-t border-slate-200">
        <h4 className="text-sm font-medium text-slate-700 flex items-center gap-2">
          <span className="w-6 h-6 bg-slate-100 rounded flex items-center justify-center text-xs">F</span>
          Filtre Ayarlari
        </h4>

        {/* Enable Filter */}
        <div className="flex items-center justify-between p-4 bg-sage-50 border border-sage-200 rounded-xl">
          <div>
            <span className="font-medium text-slate-800">Filtre Aktif</span>
            <p className="text-xs text-slate-500">Kategorilere gore filtreleme</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={content.filter.enabled}
              onChange={(e) => updateFilter('enabled', e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500" />
          </label>
        </div>

        {content.filter.enabled && (
          <>
            {/* Show All Button */}
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div>
                <span className="font-medium text-slate-700">Tumu Butonu</span>
                <p className="text-xs text-slate-500">Tum gorselleri gosteren buton</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={content.filter.showAllButton}
                  onChange={(e) => updateFilter('showAllButton', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-sage-500" />
              </label>
            </div>

            {/* All Button Text */}
            {content.filter.showAllButton && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tumu Buton Metni
                </label>
                <input
                  type="text"
                  value={content.filter.allButtonText}
                  onChange={(e) => updateFilter('allButtonText', e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Tumu"
                />
              </div>
            )}

            {/* Categories Info */}
            <div className="p-4 bg-slate-100 rounded-xl">
              <h5 className="text-sm font-medium text-slate-700 mb-2">Mevcut Kategoriler</h5>
              {imageCategories.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {imageCategories.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 bg-white rounded-full text-sm text-slate-600 border border-slate-200"
                    >
                      {cat}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">
                  Henuz kategori eklenmedi. Gorseller sekmesinden gorsel duzenleyerek kategori ekleyebilirsiniz.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Lightbox Preview */}
      {content.lightbox.enabled && (
        <div className="p-4 bg-slate-50 rounded-xl">
          <h4 className="text-sm font-medium text-slate-700 mb-3">Lightbox Onizlemesi</h4>
          <div
            className="relative rounded-lg overflow-hidden p-8 flex items-center justify-center min-h-[200px]"
            style={{ backgroundColor: content.lightbox.backgroundColor }}
          >
            {/* Close button */}
            <button className="absolute top-4 right-4 text-white/70 hover:text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Sample image */}
            <div className="w-48 h-36 bg-white/10 rounded-lg flex items-center justify-center">
              <span className="text-white/50 text-sm">Gorsel</span>
            </div>

            {/* Counter */}
            {content.lightbox.showCounter && (
              <div className="absolute top-4 left-4 text-white/70 text-sm">
                1 / 10
              </div>
            )}

            {/* Caption */}
            {content.lightbox.showCaption && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-white text-sm">Gorsel Aciklamasi</p>
              </div>
            )}

            {/* Thumbnails */}
            {content.lightbox.showThumbnails && (
              <div className="absolute bottom-20 left-0 right-0 flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className={`w-12 h-12 rounded-lg ${i === 1 ? 'ring-2 ring-white' : 'opacity-50'} bg-white/20`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
