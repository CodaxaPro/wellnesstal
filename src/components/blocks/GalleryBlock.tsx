'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { BlockProps, GalleryContent, GalleryImage } from './types'
import { normalizeImageUrl } from '@/lib/image-utils'

// Default values for enterprise gallery
const defaultLayout = {
  type: 'grid' as const,
  columns: 3 as const,
  gap: 16,
  aspectRatio: 'square' as const,
  mobileColumns: 2 as const
}

const defaultStyle = {
  borderRadius: 12,
  shadow: 'md' as const,
  hoverEffect: 'zoom' as const,
  showCaption: true,
  captionPosition: 'overlay' as const,
  overlayColor: '#000000',
  overlayOpacity: 50  // 0-100 scale
}

const defaultLightbox = {
  enabled: true,
  showThumbnails: true,
  showCounter: true,
  showCaption: true,
  backgroundColor: 'rgba(0,0,0,0.95)',
  closeOnOverlayClick: true
}

const defaultFilter = {
  enabled: false,
  categories: [] as string[],
  showAllButton: true,
  allButtonText: 'Tümü'
}

export default function GalleryBlock({ block }: BlockProps) {
  const content = block.content as GalleryContent

  // Merge with defaults (enterprise structure with legacy fallback)
  const layout = content.layout || { ...defaultLayout, columns: content.columns || 3 }
  const style = content.style || defaultStyle
  const lightbox = content.lightbox || { ...defaultLightbox, enabled: content.showLightbox !== false }
  const filter = content.filter || defaultFilter

  // State
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [currentSlide, setCurrentSlide] = useState(0)

  // Filter images with valid URLs
  const validImages = useMemo(() =>
    (content.images || []).filter(img => img.url && img.url.trim() !== ''),
    [content.images]
  )

  // Get unique categories
  const categories = useMemo(() => {
    if (!filter.enabled) return []
    const cats = [...new Set(validImages.map(img => img.category).filter(Boolean))] as string[]
    return cats
  }, [validImages, filter.enabled])

  // Filter by category
  const filteredImages = useMemo(() => {
    if (!activeCategory || !filter.enabled) return validImages
    return validImages.filter(img => img.category === activeCategory)
  }, [validImages, activeCategory, filter.enabled])

  // Style helpers
  const getShadowClass = () => {
    const shadows = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    }
    return shadows[style.shadow] || ''
  }

  const getHoverClass = () => {
    const hovers = {
      none: '',
      zoom: 'group-hover:scale-110',
      fade: 'group-hover:opacity-80',
      'slide-up': '',
      overlay: ''
    }
    return hovers[style.hoverEffect] || ''
  }

  const getAspectRatio = () => {
    const ratios = {
      square: '1/1',
      '4:3': '4/3',
      '16:9': '16/9',
      '3:2': '3/2',
      original: 'auto'
    }
    return ratios[layout.aspectRatio] || '1/1'
  }

  const getGridCols = () => {
    const cols = {
      2: 'md:grid-cols-2',
      3: 'md:grid-cols-3',
      4: 'md:grid-cols-4',
      5: 'md:grid-cols-5',
      6: 'md:grid-cols-6'
    }
    return cols[layout.columns] || 'md:grid-cols-3'
  }

  const getMobileCols = () => {
    return layout.mobileColumns === 1 ? 'grid-cols-1' : 'grid-cols-2'
  }

  // Lightbox handlers
  const openLightbox = (index: number) => {
    if (lightbox.enabled) {
      setLightboxIndex(index)
    }
  }

  const closeLightbox = () => setLightboxIndex(null)

  const nextImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length)
    }
  }

  const prevImage = () => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length)
    }
  }

  // Render grid layout
  const renderGridLayout = () => (
    <div
      className={`grid ${getMobileCols()} ${getGridCols()}`}
      style={{ gap: `${layout.gap}px` }}
    >
      {filteredImages.map((image, index) => (
        <div
          key={image.id || index}
          className={`relative overflow-hidden cursor-pointer group ${getShadowClass()}`}
          style={{
            borderRadius: `${style.borderRadius}px`,
            aspectRatio: getAspectRatio()
          }}
          onClick={() => openLightbox(index)}
        >
          <Image
            src={image.url}
            alt={image.alt || `Gallery image ${index + 1}`}
            fill
            className={`object-cover transition-all duration-500 ${getHoverClass()}`}
          />

          {/* Hover Overlay */}
          {style.hoverEffect !== 'none' && (
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center"
              style={{
                backgroundColor: style.overlayColor,
                opacity: 0
              }}
            >
              <div
                className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
                style={{ backgroundColor: `${style.overlayColor}${Math.round((style.overlayOpacity / 100) * 255).toString(16).padStart(2, '0')}` }}
              />
              {lightbox.enabled && (
                <svg
                  className="w-10 h-10 text-white relative z-10 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              )}
            </div>
          )}

          {/* Caption - Overlay Position */}
          {style.showCaption && image.caption && style.captionPosition === 'overlay' && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm">{image.caption}</p>
            </div>
          )}

          {/* Category Badge */}
          {image.category && (
            <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700">
              {image.category}
            </div>
          )}
        </div>
      ))}
    </div>
  )

  // Deterministic height generator for masonry layout (avoids hydration mismatch)
  const getMasonryHeight = (imageId: string, index: number): number => {
    // Use a simple hash based on image id or index for consistent heights
    let hash = 0
    const str = imageId || `img-${index}`
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    // Generate height between 300 and 500
    return 300 + (Math.abs(hash) % 200)
  }

  // Render masonry layout
  const renderMasonryLayout = () => {
    const columnCount = layout.columns
    const columns: GalleryImage[][] = Array.from({ length: columnCount }, () => [])

    filteredImages.forEach((image, index) => {
      columns[index % columnCount].push(image)
    })

    return (
      <div
        className="flex"
        style={{ gap: `${layout.gap}px` }}
      >
        {columns.map((column, colIndex) => (
          <div
            key={colIndex}
            className="flex-1 flex flex-col"
            style={{ gap: `${layout.gap}px` }}
          >
            {column.map((image, index) => {
              const globalIndex = filteredImages.findIndex(img => img.id === image.id)
              return (
                <div
                  key={image.id || index}
                  className={`relative overflow-hidden cursor-pointer group ${getShadowClass()}`}
                  style={{ borderRadius: `${style.borderRadius}px` }}
                  onClick={() => openLightbox(globalIndex)}
                >
                  <Image
                    src={normalizeImageUrl(image.url)}
                    alt={image.alt || `Gallery image ${index + 1}`}
                    width={400}
                    height={getMasonryHeight(image.id, globalIndex)}
                    className={`w-full h-auto object-cover transition-all duration-500 ${getHoverClass()}`}
                  />

                  {/* Hover Overlay */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center"
                    style={{ backgroundColor: `${style.overlayColor}${Math.round((style.overlayOpacity / 100) * 255).toString(16).padStart(2, '0')}` }}
                  >
                    {lightbox.enabled && (
                      <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    )}
                  </div>

                  {/* Caption */}
                  {style.showCaption && image.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-sm">{image.caption}</p>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        ))}
      </div>
    )
  }

  // Render slider layout
  const renderSliderLayout = () => {
    return (
      <div className="relative">
        <div className="overflow-hidden rounded-xl">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {filteredImages.map((image, index) => (
              <div
                key={image.id || index}
                className="min-w-full relative cursor-pointer"
                style={{ aspectRatio: getAspectRatio() }}
                onClick={() => openLightbox(index)}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover"
                />
                {style.showCaption && image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <p className="text-white text-lg">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Slider Navigation */}
        {filteredImages.length > 1 && (
          <>
            <button
              onClick={() => setCurrentSlide((currentSlide - 1 + filteredImages.length) % filteredImages.length)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => setCurrentSlide((currentSlide + 1) % filteredImages.length)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
            >
              <svg className="w-6 h-6 text-slate-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-4">
              {filteredImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    currentSlide === index ? 'bg-sage-500 w-6' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  // Render justified layout
  const renderJustifiedLayout = () => (
    <div
      className="flex flex-wrap"
      style={{ gap: `${layout.gap}px` }}
    >
      {filteredImages.map((image, index) => (
        <div
          key={image.id || index}
          className={`relative overflow-hidden cursor-pointer group ${getShadowClass()} flex-grow`}
          style={{
            borderRadius: `${style.borderRadius}px`,
            height: '250px',
            minWidth: '200px',
            maxWidth: '400px'
          }}
          onClick={() => openLightbox(index)}
        >
          <Image
            src={image.url}
            alt={image.alt || `Gallery image ${index + 1}`}
            fill
            className={`object-cover transition-all duration-500 ${getHoverClass()}`}
          />

          {/* Hover Overlay */}
          <div
            className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100 flex items-center justify-center"
            style={{ backgroundColor: `${style.overlayColor}${Math.round(style.overlayOpacity * 255).toString(16).padStart(2, '0')}` }}
          >
            {lightbox.enabled && (
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
              </svg>
            )}
          </div>

          {/* Caption */}
          {style.showCaption && image.caption && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-sm">{image.caption}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  )

  // Render layout based on type
  const renderLayout = () => {
    switch (layout.type) {
      case 'masonry':
        return renderMasonryLayout()
      case 'slider':
        return renderSliderLayout()
      case 'justified':
        return renderJustifiedLayout()
      default:
        return renderGridLayout()
    }
  }

  return (
    <section
      className="py-16"
      style={{ backgroundColor: content.backgroundColor || '#ffffff' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(content.title || content.subtitle) && (
          <div className="text-center mb-12">
            {content.title && (
              <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-4">
                {content.title}
              </h2>
            )}
            {content.subtitle && (
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                {content.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Category Filter */}
        {filter.enabled && categories.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {filter.showAllButton && (
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === null
                    ? 'bg-sage-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {filter.allButtonText || 'Tümü'}
              </button>
            )}
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-sage-500 text-white shadow-md'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {/* Gallery Content */}
        {filteredImages.length > 0 ? (
          renderLayout()
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <svg className="w-16 h-16 text-slate-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-400">Henüz görsel eklenmedi</p>
          </div>
        )}

        {/* Enterprise Lightbox */}
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
          <div
            className="fixed inset-0 z-50 flex flex-col"
            style={{ backgroundColor: lightbox.backgroundColor }}
            onClick={lightbox.closeOnOverlayClick ? closeLightbox : undefined}
          >
            {/* Lightbox Header */}
            <div className="flex items-center justify-between p-4">
              {lightbox.showCounter && (
                <span className="text-white/80 text-sm">
                  {lightboxIndex + 1} / {filteredImages.length}
                </span>
              )}
              <div className="flex-1" />
              <button
                onClick={closeLightbox}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Main Image */}
            <div
              className="flex-1 flex items-center justify-center px-4"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={prevImage}
                className="absolute left-4 p-3 text-white/80 hover:text-white bg-black/30 rounded-full transition-colors"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <div className="relative max-w-5xl max-h-[70vh] w-full h-full">
                <Image
                  src={filteredImages[lightboxIndex].url}
                  alt={filteredImages[lightboxIndex].alt || 'Lightbox image'}
                  fill
                  className="object-contain"
                />
              </div>

              <button
                onClick={nextImage}
                className="absolute right-4 p-3 text-white/80 hover:text-white bg-black/30 rounded-full transition-colors"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {/* Caption */}
            {lightbox.showCaption && filteredImages[lightboxIndex].caption && (
              <div className="text-center py-4">
                <p className="text-white text-lg">{filteredImages[lightboxIndex].caption}</p>
              </div>
            )}

            {/* Thumbnails */}
            {lightbox.showThumbnails && filteredImages.length > 1 && (
              <div className="flex justify-center gap-2 p-4 overflow-x-auto">
                {filteredImages.map((image, index) => (
                  <button
                    key={image.id || index}
                    onClick={(e) => {
                      e.stopPropagation()
                      setLightboxIndex(index)
                    }}
                    className={`relative w-16 h-16 rounded-lg overflow-hidden transition-all ${
                      lightboxIndex === index
                        ? 'ring-2 ring-white scale-110'
                        : 'opacity-50 hover:opacity-80'
                    }`}
                  >
                    <Image
                      src={normalizeImageUrl(image.url)}
                      alt={image.alt || `Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
