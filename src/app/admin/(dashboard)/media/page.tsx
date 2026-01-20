'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface MediaFile {
  id: string
  file_name: string
  original_name: string
  file_path: string
  thumbnail_path: string | null
  file_size: number
  mime_type: string
  width: number | null
  height: number | null
  alt_text: string | null
  category: string
  is_featured: boolean
  created_at: string
}

interface MediaCategory {
  id: string
  name: string
  slug: string
  icon: string
  color: string
}

const COLUMN_OPTIONS = [2, 3, 4, 5, 6]

export default function MediaGalleryPage() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropZoneRef = useRef<HTMLDivElement>(null)

  // Data states
  const [files, setFiles] = useState<MediaFile[]>([])
  const [categories, setCategories] = useState<MediaCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  // UI states
  const [columns, setColumns] = useState(4)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [isDragging, setIsDragging] = useState(false)

  // Modal states
  const [lightboxFile, setLightboxFile] = useState<MediaFile | null>(null)
  const [editFile, setEditFile] = useState<MediaFile | null>(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Edit form state
  const [editForm, setEditForm] = useState({
    alt_text: '',
    category: 'general'
  })

  // Fetch data
  const fetchFiles = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== 'all') {
params.set('category', selectedCategory)
}
      if (searchQuery) {
params.set('search', searchQuery)
}

      const response = await fetch(`/api/media?${params}`)
      const data = await response.json()
      if (data.success) {
        setFiles(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch files:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedCategory, searchQuery])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/media/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data)
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }
    fetchCategories()
  }, [router])

  useEffect(() => {
    fetchFiles()
  }, [fetchFiles])

  // File upload handler
  const handleFileUpload = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
return
}

    const token = localStorage.getItem('adminToken')
    setUploading(true)
    setUploadProgress(0)

    const totalFiles = fileList.length
    let uploadedCount = 0

    for (const file of Array.from(fileList)) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('category', selectedCategory === 'all' ? 'general' : selectedCategory)

      try {
        const response = await fetch('/api/media', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        })

        const data = await response.json()
        if (data.success) {
          setFiles(prev => [data.data, ...prev])
        }
      } catch (error) {
        console.error('Upload failed:', error)
      }

      uploadedCount++
      setUploadProgress(Math.round((uploadedCount / totalFiles) * 100))
    }

    setUploading(false)
    setShowUploadModal(false)
    setUploadProgress(0)
  }

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileUpload(e.dataTransfer.files)
  }

  // Selection handlers
  const toggleSelection = (id: string) => {
    const newSelection = new Set(selectedFiles)
    if (newSelection.has(id)) {
      newSelection.delete(id)
    } else {
      newSelection.add(id)
    }
    setSelectedFiles(newSelection)
  }

  const selectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(files.map(f => f.id)))
    }
  }

  // Delete handler
  const handleDelete = async () => {
    if (selectedFiles.size === 0) {
return
}

    const token = localStorage.getItem('adminToken')
    const ids = Array.from(selectedFiles).join(',')

    try {
      const response = await fetch(`/api/media?ids=${ids}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setFiles(prev => prev.filter(f => !selectedFiles.has(f.id)))
        setSelectedFiles(new Set())
        setShowDeleteConfirm(false)
      }
    } catch (error) {
      console.error('Delete failed:', error)
    }
  }

  // Edit handler
  const handleEdit = async () => {
    if (!editFile) {
return
}

    const token = localStorage.getItem('adminToken')

    try {
      const response = await fetch('/api/media', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editFile.id,
          alt_text: editForm.alt_text,
          category: editForm.category
        })
      })

      if (response.ok) {
        const data = await response.json()
        setFiles(prev => prev.map(f => f.id === editFile.id ? data.data : f))
        setEditFile(null)
      }
    } catch (error) {
      console.error('Edit failed:', error)
    }
  }

  // Open edit modal
  const openEditModal = (file: MediaFile) => {
    setEditFile(file)
    setEditForm({
      alt_text: file.alt_text || '',
      category: file.category
    })
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
return `${bytes} B`
}
    if (bytes < 1024 * 1024) {
return `${(bytes / 1024).toFixed(1)} KB`
}
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  // Get grid class based on columns
  const getGridClass = () => {
    switch (columns) {
      case 2: return 'grid-cols-2'
      case 3: return 'grid-cols-2 md:grid-cols-3'
      case 4: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      case 5: return 'grid-cols-2 md:grid-cols-3 lg:grid-cols-5'
      case 6: return 'grid-cols-2 md:grid-cols-4 lg:grid-cols-6'
      default: return 'grid-cols-4'
    }
  }

  if (loading && files.length === 0) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-soft sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="text-2xl font-bold text-sage-600 mr-8">
                Wellnesstal
              </Link>
              <span className="text-charcoal font-medium">Medya Galerisi</span>
            </div>
            <Link
              href="/admin/dashboard"
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-charcoal">Medya Galerisi</h1>
            <p className="text-gray-500 mt-1">{files.length} dosya</p>
          </div>
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-6 py-3 bg-sage-500 hover:bg-sage-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Görsel Ekle
          </button>
        </div>

        {/* Filters & Controls */}
        <div className="bg-white rounded-2xl shadow-soft p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Kategori:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
              >
                <option value="all">Tümü</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            {/* Column Selector */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Görünüm:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                {COLUMN_OPTIONS.map(col => (
                  <button
                    key={col}
                    onClick={() => setColumns(col)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      columns === col
                        ? 'bg-white text-sage-600 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {col}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Selection Actions */}
          {selectedFiles.size > 0 && (
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={selectAll}
                className="text-sm text-sage-600 hover:text-sage-700"
              >
                {selectedFiles.size === files.length ? 'Seçimi Kaldır' : 'Tümünü Seç'}
              </button>
              <span className="text-sm text-gray-500">{selectedFiles.size} seçili</span>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="ml-auto px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Seçilenleri Sil
              </button>
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        <div className={`grid ${getGridClass()} gap-4`}>
          {files.map((file) => (
            <div
              key={file.id}
              className={`group relative bg-white rounded-2xl overflow-hidden shadow-soft transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                selectedFiles.has(file.id) ? 'ring-2 ring-sage-500 ring-offset-2' : ''
              }`}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-3 left-3 z-10">
                <label className="relative flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedFiles.has(file.id)}
                    onChange={() => toggleSelection(file.id)}
                    className="sr-only peer"
                  />
                  <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                    selectedFiles.has(file.id)
                      ? 'bg-sage-500 border-sage-500'
                      : 'bg-white/80 border-gray-300 opacity-0 group-hover:opacity-100'
                  }`}>
                    {selectedFiles.has(file.id) && (
                      <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </label>
              </div>

              {/* Image Container with Effects */}
              <div
                className="aspect-square relative overflow-hidden cursor-pointer"
                onClick={() => setLightboxFile(file)}
              >
                {/* Blur Placeholder Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-sage-100 to-sage-200 animate-pulse" />

                {/* Actual Image */}
                <img
                  src={file.thumbnail_path || file.file_path}
                  alt={file.alt_text || file.original_name}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                  onLoad={(e) => {
                    const target = e.target as HTMLImageElement
                    target.previousElementSibling?.classList.add('hidden')
                  }}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Hover Actions */}
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="flex items-center justify-between text-white">
                    <span className="text-sm font-medium truncate max-w-[60%]">
                      {file.original_name}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          openEditModal(file)
                        }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                        title="Düzenle"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setLightboxFile(file)
                        }}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                        title="Büyüt"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* File Info */}
              <div className="p-3">
                <p className="text-sm font-medium text-charcoal truncate">{file.original_name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-gray-400">{formatFileSize(file.file_size)}</span>
                  <span className="text-xs px-2 py-0.5 bg-gray-100 rounded-full text-gray-500">
                    {file.category}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {files.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">Henüz görsel yok</h3>
            <p className="text-gray-500 mb-6">İlk görselinizi yükleyin</p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="px-6 py-3 bg-sage-500 hover:bg-sage-600 text-white rounded-xl font-medium transition-colors"
            >
              Görsel Yükle
            </button>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-charcoal">Görsel Yükle</h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Drop Zone */}
              <div
                ref={dropZoneRef}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragging
                    ? 'border-sage-500 bg-sage-50'
                    : 'border-gray-300 hover:border-sage-400'
                }`}
              >
                {uploading ? (
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto">
                      <svg className="animate-spin h-16 w-16 text-sage-500" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-sage-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-500">Yükleniyor... %{uploadProgress}</p>
                  </div>
                ) : (
                  <>
                    <div className="w-16 h-16 mx-auto mb-4 bg-sage-100 rounded-full flex items-center justify-center">
                      <svg className="h-8 w-8 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <p className="text-charcoal font-medium mb-2">
                      Görselleri buraya sürükleyin
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      veya bilgisayarınızdan seçin
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleFileUpload(e.target.files)}
                      className="hidden"
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-lg font-medium transition-colors"
                    >
                      Dosya Seç
                    </button>
                    <p className="text-xs text-gray-400 mt-4">
                      JPG, PNG, WebP, GIF, SVG - Max 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxFile && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
          onClick={() => setLightboxFile(null)}
        >
          <button
            onClick={() => setLightboxFile(null)}
            className="absolute top-4 right-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div
            className="max-w-5xl max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={lightboxFile.file_path}
              alt={lightboxFile.alt_text || lightboxFile.original_name}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg">
              <p className="text-white font-medium">{lightboxFile.original_name}</p>
              <p className="text-white/70 text-sm">{formatFileSize(lightboxFile.file_size)}</p>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              const currentIndex = files.findIndex(f => f.id === lightboxFile.id)
              const prevIndex = currentIndex > 0 ? currentIndex - 1 : files.length - 1
              const prevFile = files[prevIndex]
              if (prevFile) setLightboxFile(prevFile)
            }}
            className="absolute left-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              const currentIndex = files.findIndex(f => f.id === lightboxFile.id)
              const nextIndex = currentIndex < files.length - 1 ? currentIndex + 1 : 0
              const nextFile = files[nextIndex]
              if (nextFile) setLightboxFile(nextFile)
            }}
            className="absolute right-4 p-3 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}

      {/* Edit Modal */}
      {editFile && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-charcoal">Görsel Düzenle</h3>
            </div>

            <div className="p-6 space-y-4">
              {/* Preview */}
              <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={editFile.thumbnail_path || editFile.file_path}
                  alt={editFile.alt_text || ''}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alt Text (SEO)
                </label>
                <input
                  type="text"
                  value={editForm.alt_text}
                  onChange={(e) => setEditForm({ ...editForm, alt_text: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Görsel açıklaması..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.slug}>{cat.icon} {cat.name}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setEditFile(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleEdit}
                className="px-6 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-xl font-medium transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-charcoal mb-2">Görselleri Sil</h3>
              <p className="text-gray-500 mb-6">
                {selectedFiles.size} görsel kalıcı olarak silinecek. Bu işlem geri alınamaz.
              </p>
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  onClick={handleDelete}
                  className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
