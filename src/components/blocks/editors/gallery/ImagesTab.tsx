'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { GalleryContent, GalleryImage } from '../../types'

interface ImagesTabProps {
  content: GalleryContent
  updateContent: (updates: Partial<GalleryContent>) => void
}

export default function ImagesTab({ content, updateContent }: ImagesTabProps) {
  const [uploading, setUploading] = useState(false)
  const [editingImage, setEditingImage] = useState<string | null>(null)
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle image upload
  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    setUploading(true)
    const newImages: GalleryImage[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const formData = new FormData()
        formData.append('file', file)
        formData.append('category', 'gallery')
        formData.append('alt_text', file.name.split('.')[0])

        const token = localStorage.getItem('adminToken')
        const response = await fetch('/api/media', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        })

        if (response.ok) {
          const data = await response.json()
          newImages.push({
            id: crypto.randomUUID(),
            url: data.data.file_path,  // API returns file_path, not url
            alt: file.name.split('.')[0],
            caption: '',
            category: ''
          })
        }
      }

      if (newImages.length > 0) {
        updateContent({
          images: [...content.images, ...newImages]
        })
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Gorsel yuklenirken hata olustu')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  // Delete image
  const handleDeleteImage = (imageId: string) => {
    if (!confirm('Bu gorseli silmek istediginizden emin misiniz?')) return
    updateContent({
      images: content.images.filter(img => img.id !== imageId)
    })
  }

  // Update image details
  const handleUpdateImage = (imageId: string, updates: Partial<GalleryImage>) => {
    updateContent({
      images: content.images.map(img =>
        img.id === imageId ? { ...img, ...updates } : img
      )
    })
  }

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newImages = [...content.images]
    const draggedItem = newImages[draggedIndex]
    newImages.splice(draggedIndex, 1)
    newImages.splice(index, 0, draggedItem)

    updateContent({ images: newImages })
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  // Get unique categories
  const existingCategories = [...new Set(content.images.map(img => img.category).filter(Boolean))]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Galeri Basligi
        </label>
        <input
          type="text"
          value={content.title || ''}
          onChange={(e) => updateContent({ title: e.target.value })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Galeri Basligi"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Alt Baslik
        </label>
        <input
          type="text"
          value={content.subtitle || ''}
          onChange={(e) => updateContent({ subtitle: e.target.value })}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
          placeholder="Alt baslik (opsiyonel)"
        />
      </div>

      {/* Upload Area */}
      <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center hover:border-sage-500 transition-colors">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => handleImageUpload(e.target.files)}
          className="hidden"
          id="gallery-upload"
        />
        <label htmlFor="gallery-upload" className="cursor-pointer">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            {uploading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sage-500"></div>
            ) : (
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            )}
          </div>
          <p className="text-slate-600 font-medium mb-1">
            {uploading ? 'Yukleniyor...' : 'Gorsel yuklemek icin tiklayin'}
          </p>
          <p className="text-sm text-slate-400">
            veya dosyalari surukleyip birakin (Coklu secim desteklenir)
          </p>
        </label>
      </div>

      {/* Images Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-slate-700">
            Gorseller ({content.images.length})
          </h4>
          {content.images.length > 0 && (
            <p className="text-xs text-slate-400">Siralamak icin surukleyin</p>
          )}
        </div>

        {content.images.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl">
            <p className="text-slate-400">Henuz gorsel eklenmedi</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {content.images.map((image, index) => (
              <div
                key={image.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`relative group rounded-xl overflow-hidden bg-slate-100 aspect-square cursor-move ${
                  draggedIndex === index ? 'opacity-50 scale-95' : ''
                } transition-all`}
              >
                {image.url && image.url.trim() !== '' ? (
                  <Image
                    src={image.url}
                    alt={image.alt || ''}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => setEditingImage(image.id)}
                    className="p-2 bg-white rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
                    title="Duzenle"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="p-2 bg-red-500 rounded-lg text-white hover:bg-red-600 transition-colors"
                    title="Sil"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Index badge */}
                <div className="absolute top-2 left-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center text-white text-xs font-medium">
                  {index + 1}
                </div>

                {/* Category badge */}
                {image.category && (
                  <div className="absolute top-2 right-2 px-2 py-1 bg-sage-500 rounded-full text-white text-xs">
                    {image.category}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Image Modal */}
      {editingImage && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Gorsel Duzenle</h3>
              <button
                onClick={() => setEditingImage(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {(() => {
              const image = content.images.find(img => img.id === editingImage)
              if (!image) return null

              return (
                <div className="p-6 space-y-4">
                  {/* Preview */}
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100">
                    {image.url && image.url.trim() !== '' ? (
                      <Image
                        src={image.url}
                        alt={image.alt || ''}
                        fill
                        className="object-contain"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-slate-400">
                        <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Alt Text */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Alt Metin
                    </label>
                    <input
                      type="text"
                      value={image.alt || ''}
                      onChange={(e) => handleUpdateImage(image.id, { alt: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      placeholder="Gorsel aciklamasi"
                    />
                  </div>

                  {/* Caption */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Aciklama (Caption)
                    </label>
                    <textarea
                      value={image.caption || ''}
                      onChange={(e) => handleUpdateImage(image.id, { caption: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                      rows={2}
                      placeholder="Gorsel altinda gosterilecek metin"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Kategori
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={image.category || ''}
                        onChange={(e) => handleUpdateImage(image.id, { category: e.target.value })}
                        className="flex-1 px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                        placeholder="Kategori adi"
                        list="category-suggestions"
                      />
                      <datalist id="category-suggestions">
                        {existingCategories.map(cat => (
                          <option key={cat} value={cat} />
                        ))}
                      </datalist>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      onClick={() => setEditingImage(null)}
                      className="px-6 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600 transition-colors"
                    >
                      Tamam
                    </button>
                  </div>
                </div>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
