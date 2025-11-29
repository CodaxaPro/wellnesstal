'use client'

import { useState } from 'react'
import Image from 'next/image'
import { BlockProps, GalleryContent } from './types'

export default function GalleryBlock({ block }: BlockProps) {
  const content = block.content as GalleryContent
  const images = content.images || []
  const columns = content.columns || 3
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
  }[columns]

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-12 text-center">
            {content.title}
          </h2>
        )}

        {images.length > 0 ? (
          <div className={`grid grid-cols-1 ${gridCols} gap-4`}>
            {images.map((image, index) => (
              <div
                key={image.id || index}
                className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group"
                onClick={() => content.showLightbox !== false && setLightboxImage(image.url)}
              >
                <Image
                  src={image.url}
                  alt={image.alt || `Gallery image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <svg
                    className="w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-400">Henüz görsel eklenmedi</p>
          </div>
        )}

        {/* Lightbox */}
        {lightboxImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setLightboxImage(null)}
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
              <Image
                src={lightboxImage}
                alt="Lightbox image"
                fill
                className="object-contain"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
