'use client'

import { useState, useEffect } from 'react'

interface MediaFile {
  id: string
  file_name: string
  original_name: string
  file_path: string
  thumbnail_path: string | null
  alt_text: string | null
  category: string
}

interface GalleryContent {
  title: string
  subtitle: string
  showCategories: boolean
  columns: number
  maxImages: number
}

const defaultContent: GalleryContent = {
  title: 'Galeri',
  subtitle: 'Stüdyomuzdan kareler',
  showCategories: true,
  columns: 4,
  maxImages: 12
}

export default function GallerySection() {
  const [content, setContent] = useState<GalleryContent>(defaultContent)
  const [images, setImages] = useState<MediaFile[]>([])
  const [categories, setCategories] = useState<string[]>(['all'])
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState<MediaFile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content?section=gallery-section')
        const data = await response.json()
        if (data.success && data.data?.content) {
          setContent({ ...defaultContent, ...data.data.content })
        }
      } catch (error) {
        console.error('Failed to fetch gallery content:', error)
      }
    }
    fetchContent()
  }, [])

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/media?limit=${content.maxImages}&category=${activeCategory === 'all' ? '' : activeCategory}`)
        const data = await response.json()
        if (data.success) {
          setImages(data.data)

          // Extract unique categories
          const uniqueCategories = [...new Set(data.data.map((img: MediaFile) => img.category))] as string[]
          setCategories(['all', ...uniqueCategories])
        }
      } catch (error) {
        console.error('Failed to fetch images:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchImages()
  }, [content.maxImages, activeCategory])

  const filteredImages = activeCategory === 'all'
    ? images
    : images.filter(img => img.category === activeCategory)

  const categoryLabels: Record<string, string> = {
    'all': 'Tümü',
    'general': 'Genel',
    'hero': 'Hero',
    'services': 'Hizmetler',
    'team': 'Ekip',
    'gallery': 'Galeri',
    'branding': 'Marka'
  }

  if (images.length === 0 && !loading) {
    return null // Don't show section if no images
  }

  return (
    <section id="galeri" className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-charcoal mb-4">
            {content.title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        </div>

        {/* Category Filter */}
        {content.showCategories && categories.length > 2 && (
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-sage-500 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-sage-100 hover:text-sage-700'
                }`}
              >
                {categoryLabels[category] || category}
              </button>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500" />
          </div>
        )}

        {/* Image Grid */}
        {!loading && (
          <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${content.columns} gap-4`}>
            {filteredImages.map((image, index) => (
              <div
                key={image.id}
                className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                onClick={() => setSelectedImage(image)}
                style={{
                  animationDelay: `${index * 100}ms`
                }}
              >
                <img
                  src={image.thumbnail_path || image.file_path}
                  alt={image.alt_text || image.original_name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium truncate">
                      {image.alt_text || image.original_name}
                    </p>
                  </div>

                  {/* Zoom Icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <img
              src={selectedImage.file_path}
              alt={selectedImage.alt_text || selectedImage.original_name}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />

            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              <p className="text-lg font-medium">
                {selectedImage.alt_text || selectedImage.original_name}
              </p>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
