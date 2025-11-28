'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

interface MediaFile {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  width?: number
  height?: number
  alt: string
  url: string
  uploadedAt: string
  usedIn: string[]
  category: 'hero' | 'services' | 'gallery' | 'testimonials' | 'other'
}

export default function MediaManagement() {
  const router = useRouter()
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([
    {
      id: '1',
      filename: 'headspa-treatment.jpg',
      originalName: 'headspa-treatment.jpg',
      mimeType: 'image/jpeg',
      size: 245678,
      width: 1200,
      height: 800,
      alt: 'Premium Headspa Treatment',
      url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200',
      uploadedAt: '2024-01-15T10:00:00Z',
      usedIn: ['Hero Section', 'Services'],
      category: 'hero'
    },
    {
      id: '2',
      filename: 'spa-interior.jpg',
      originalName: 'spa-interior.jpg',
      mimeType: 'image/jpeg',
      size: 312456,
      width: 1200,
      height: 800,
      alt: 'Wellnesstal Spa Interior',
      url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200',
      uploadedAt: '2024-01-14T15:30:00Z',
      usedIn: ['About Section'],
      category: 'gallery'
    },
    {
      id: '3',
      filename: 'aromatherapy-oils.jpg',
      originalName: 'aromatherapy-oils.jpg',
      mimeType: 'image/jpeg',
      size: 189234,
      width: 800,
      height: 600,
      alt: 'Aromatherapy Essential Oils',
      url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800',
      uploadedAt: '2024-01-13T11:20:00Z',
      usedIn: ['Services'],
      category: 'services'
    },
    {
      id: '4',
      filename: 'massage-stones.jpg',
      originalName: 'massage-stones.jpg',
      mimeType: 'image/jpeg',
      size: 456789,
      width: 1000,
      height: 667,
      alt: 'Hot Stone Massage Setup',
      url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1000',
      uploadedAt: '2024-01-12T09:15:00Z',
      usedIn: ['Gallery'],
      category: 'gallery'
    },
    {
      id: '5',
      filename: 'facial-treatment.jpg',
      originalName: 'facial-treatment.jpg',
      mimeType: 'image/jpeg',
      size: 234567,
      width: 900,
      height: 600,
      alt: 'Professional Facial Treatment',
      url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=900',
      uploadedAt: '2024-01-11T14:45:00Z',
      usedIn: ['Services'],
      category: 'services'
    }
  ])

  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
    }
  }, [router])

  const categories = [
    { value: 'all', label: 'Alle Kategorien', count: mediaFiles.length },
    { value: 'hero', label: 'Hero Bilder', count: mediaFiles.filter(f => f.category === 'hero').length },
    { value: 'services', label: 'Service Bilder', count: mediaFiles.filter(f => f.category === 'services').length },
    { value: 'gallery', label: 'Galerie', count: mediaFiles.filter(f => f.category === 'gallery').length },
    { value: 'testimonials', label: 'Testimonials', count: mediaFiles.filter(f => f.category === 'testimonials').length },
    { value: 'other', label: 'Sonstige', count: mediaFiles.filter(f => f.category === 'other').length }
  ]

  const filteredFiles = selectedCategory === 'all' 
    ? mediaFiles 
    : mediaFiles.filter(file => file.category === selectedCategory)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDelete = (fileId: string) => {
    if (window.confirm('Bu medya dosyasını silmek istediğinizden emin misiniz?')) {
      setMediaFiles(mediaFiles.filter(f => f.id !== fileId))
      setSelectedFiles(selectedFiles.filter(id => id !== fileId))
    }
  }

  const handleBulkDelete = () => {
    if (selectedFiles.length === 0) return
    if (window.confirm(`${selectedFiles.length} dosyayı silmek istediğinizden emin misiniz?`)) {
      setMediaFiles(mediaFiles.filter(f => !selectedFiles.includes(f.id)))
      setSelectedFiles([])
    }
  }

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    )
  }

  const totalSize = mediaFiles.reduce((acc, file) => acc + file.size, 0)

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-sage-600 hover:text-forest-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m0 7h18" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-charcoal">Medya Galerisi</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {selectedFiles.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {selectedFiles.length} Löschen
                </button>
              )}
              
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="bg-sage-500 hover:bg-forest-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Medya Yükle
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-charcoal">{mediaFiles.length}</div>
            <div className="text-gray-custom text-sm">Toplam Dosya</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-blue-600">{formatFileSize(totalSize)}</div>
            <div className="text-gray-custom text-sm">Toplam Boyut</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-green-600">{mediaFiles.filter(f => f.usedIn.length > 0).length}</div>
            <div className="text-gray-custom text-sm">Kullanılan</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-purple-600">{mediaFiles.filter(f => f.mimeType.startsWith('image/')).length}</div>
            <div className="text-gray-custom text-sm">Görsel Dosya</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl p-6 shadow-soft mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Kategorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label} ({category.count})
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode */}
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Ansicht</label>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      viewMode === 'grid' 
                        ? 'bg-sage-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`px-4 py-2 text-sm font-medium transition-colors ${
                      viewMode === 'list' 
                        ? 'bg-sage-500 text-white' 
                        : 'bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-custom">
              {filteredFiles.length} von {mediaFiles.length} Dateien
            </div>
          </div>
        </div>

        {/* Media Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFiles.map((file) => (
              <div key={file.id} className="bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-medium transition-all duration-300 group">
                {/* Image */}
                <div className="relative aspect-video bg-gray-100">
                  <Image
                    src={file.url}
                    alt={file.alt}
                    fill
                    className="object-cover"
                  />
                  
                  {/* Overlay Controls */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex space-x-2">
                      <button
                        onClick={() => toggleFileSelection(file.id)}
                        className={`p-2 rounded-full text-white transition-colors ${
                          selectedFiles.includes(file.id) ? 'bg-sage-500' : 'bg-black bg-opacity-50 hover:bg-sage-500'
                        }`}
                        title="Auswählen"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => navigator.clipboard.writeText(file.url)}
                        className="p-2 bg-black bg-opacity-50 hover:bg-blue-500 rounded-full text-white transition-colors"
                        title="URL kopieren"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(file.id)}
                        className="p-2 bg-black bg-opacity-50 hover:bg-red-500 rounded-full text-white transition-colors"
                        title="Löschen"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* File Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-charcoal text-sm truncate flex-1 mr-2">
                      {file.originalName}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      file.category === 'hero' ? 'bg-blue-100 text-blue-800' :
                      file.category === 'services' ? 'bg-green-100 text-green-800' :
                      file.category === 'gallery' ? 'bg-purple-100 text-purple-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {file.category}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-custom space-y-1">
                    <div>{file.width}×{file.height}px</div>
                    <div>{formatFileSize(file.size)}</div>
                    {file.usedIn.length > 0 && (
                      <div className="text-sage-600">
                        Verwendet in: {file.usedIn.join(', ')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedFiles.length === filteredFiles.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedFiles(filteredFiles.map(f => f.id))
                          } else {
                            setSelectedFiles([])
                          }
                        }}
                        className="rounded border-gray-300 text-sage-600"
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Datei
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Kategorie
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Größe
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Verwendet
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aktionen
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredFiles.map((file) => (
                    <tr key={file.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedFiles.includes(file.id)}
                          onChange={() => toggleFileSelection(file.id)}
                          className="rounded border-gray-300 text-sage-600"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-12 w-16 bg-gray-100 rounded-lg overflow-hidden mr-4 flex-shrink-0">
                            <Image
                              src={file.url}
                              alt={file.alt}
                              width={64}
                              height={48}
                              className="object-cover w-full h-full"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-charcoal">{file.originalName}</div>
                            <div className="text-sm text-gray-custom">{file.width}×{file.height}px</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          file.category === 'hero' ? 'bg-blue-100 text-blue-800' :
                          file.category === 'services' ? 'bg-green-100 text-green-800' :
                          file.category === 'gallery' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {file.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-custom">
                        {formatFileSize(file.size)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-custom">
                        {file.usedIn.length > 0 ? file.usedIn.join(', ') : 'Nicht verwendet'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => navigator.clipboard.writeText(file.url)}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                            title="URL kopieren"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(file.id)}
                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                            title="Löschen"
                          >
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📁</div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">Keine Medien gefunden</h3>
            <p className="text-gray-custom">Versuchen Sie, die Filter zu ändern oder laden Sie neue Medien hoch.</p>
          </div>
        )}
      </main>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-charcoal">Medien hochladen</h2>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-sage-400 transition-colors">
                <svg className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <h3 className="text-lg font-medium text-charcoal mb-2">Dateien hochladen</h3>
                <p className="text-gray-custom mb-4">Ziehen Sie Dateien hierher oder klicken Sie zum Auswählen</p>
                <button className="bg-sage-500 hover:bg-forest-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                  Dateien auswählen
                </button>
                <p className="text-xs text-gray-400 mt-4">
                  Unterstützte Formate: JPG, PNG, GIF, WebP (max. 10MB)
                </p>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-charcoal mb-2">Kategorie</label>
                <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent">
                  <option value="gallery">Galerie</option>
                  <option value="services">Services</option>
                  <option value="hero">Hero</option>
                  <option value="testimonials">Testimonials</option>
                  <option value="other">Sonstige</option>
                </select>
              </div>

              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-charcoal hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-6 py-3 bg-sage-500 hover:bg-forest-600 text-white rounded-xl transition-colors"
                >
                  Hochladen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}