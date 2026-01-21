'use client'

import { useCallback, useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import toast from 'react-hot-toast'

interface HomepageSection {
  id: string
  section_key: string
  section_name: string
  section_icon: string | null
  position: number
  enabled: boolean
  created_at: string
  updated_at: string
}

const ICON_OPTIONS = ['📄', '🏠', '✨', '💬', '👥', '📞', '🎯', '💎', '🌿', '⭐', '📱', '🔥']

export default function SectionsPage() {
  const router = useRouter()
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  const [originalSections, setOriginalSections] = useState<HomepageSection[]>([])

  // Modal states
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    section_key: '',
    section_name: '',
    section_icon: '📄'
  })

  const fetchSections = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/sections')
      const data = await response.json()
      if (data.success) {
        setSections(data.data)
        setOriginalSections(JSON.parse(JSON.stringify(data.data)))
      }
    } catch (error) {
      console.error('Failed to fetch sections:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }
    void fetchSections()
  }, [router, fetchSections])

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const newSections = [...sections]
    const newIndex = direction === 'up' ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= newSections.length) {
return
}

    // Swap positions
    const temp = newSections[index]
    const targetSection = newSections[newIndex]
    if (temp && targetSection) {
      newSections[index] = targetSection
      newSections[newIndex] = temp
    }

    // Update position numbers
    newSections.forEach((section, i) => {
      section.position = i + 1
    })

    setSections(newSections)
    setHasChanges(true)
  }

  const toggleSection = async (id: string, enabled: boolean) => {
    const token = localStorage.getItem('adminToken')

    try {
      const response = await fetch('/api/sections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id, enabled })
      })

      if (response.ok) {
        setSections(prev => prev.map(s =>
          s.id === id ? { ...s, enabled } : s
        ))
      }
    } catch (error) {
      console.error('Failed to toggle section:', error)
    }
  }

  const saveOrder = async () => {
    const token = localStorage.getItem('adminToken')
    setSaving(true)

    try {
      const newOrder = sections.map((section, index) => ({
        id: section.id,
        position: index + 1
      }))

      const response = await fetch('/api/sections/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newOrder })
      })

      if (response.ok) {
        setHasChanges(false)
        setOriginalSections(JSON.parse(JSON.stringify(sections)))
      }
    } catch (error) {
      console.error('Failed to save order:', error)
    } finally {
      setSaving(false)
    }
  }

  const resetOrder = () => {
    setSections(JSON.parse(JSON.stringify(originalSections)))
    setHasChanges(false)
  }

  // Delete section
  const deleteSection = async (id: string) => {
    const token = localStorage.getItem('adminToken')

    try {
      const response = await fetch(`/api/sections?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setSections(prev => prev.filter(s => s.id !== id))
        setShowDeleteConfirm(null)
      }
    } catch (error) {
      console.error('Failed to delete section:', error)
    }
  }

  // Add new section
  const addSection = async () => {
    const token = localStorage.getItem('adminToken')

    if (!formData.section_key || !formData.section_name) {
      toast.error('Section key ve name gerekli!')
      return
    }

    try {
      const response = await fetch('/api/sections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (data.success) {
        setSections(prev => [...prev, data.data])
        setShowAddModal(false)
        setFormData({ section_key: '', section_name: '', section_icon: '📄' })
        toast.success('Section başarıyla eklendi')
      } else {
        toast.error(data.error || 'Hata oluştu')
      }
    } catch (error) {
      console.error('Failed to add section:', error)
    }
  }

  // Update section
  const updateSection = async () => {
    const token = localStorage.getItem('adminToken')

    if (!editingSection) {
return
}

    try {
      const response = await fetch('/api/sections', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          id: editingSection.id,
          section_name: formData.section_name,
          section_icon: formData.section_icon
        })
      })

      if (response.ok) {
        setSections(prev => prev.map(s =>
          s.id === editingSection.id
            ? { ...s, section_name: formData.section_name, section_icon: formData.section_icon }
            : s
        ))
        setShowEditModal(false)
        setEditingSection(null)
        setFormData({ section_key: '', section_name: '', section_icon: '📄' })
      }
    } catch (error) {
      console.error('Failed to update section:', error)
    }
  }

  const openEditModal = (section: HomepageSection) => {
    setEditingSection(section)
    setFormData({
      section_key: section.section_key,
      section_name: section.section_name,
      section_icon: section.section_icon || '📄'
    })
    setShowEditModal(true)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="text-2xl font-bold text-sage-600 mr-8">
                Wellnesstal
              </Link>
              <nav className="hidden md:flex space-x-8">
                <span className="text-charcoal font-medium">Sayfa Bölümleri</span>
              </nav>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-charcoal mb-2">
              Sayfa Bölümleri Yönetimi
            </h1>
            <p className="text-gray-custom">
              Anasayfa bölümlerini sıralayın, düzenleyin veya silin.
            </p>
          </div>
          <button
            onClick={() => {
              setFormData({ section_key: '', section_name: '', section_icon: '📄' })
              setShowAddModal(true)
            }}
            className="px-4 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Yeni Bölüm Ekle
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
          <div className="flex items-start">
            <div className="text-blue-500 mr-3">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-blue-800">Nasıl Çalışır?</h4>
              <p className="text-sm text-blue-700 mt-1">
                Yukarı/aşağı oklarıyla bölümleri sıralayın. Toggle ile bölümleri gizleyin/gösterin.
                Düzenle ve Sil butonlarıyla bölümleri yönetin.
              </p>
            </div>
          </div>
        </div>

        {/* Sections List */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="divide-y divide-gray-100">
            {sections.map((section, index) => (
              <div
                key={section.id}
                className={`flex items-center justify-between p-4 transition-colors ${
                  !section.enabled ? 'bg-gray-50 opacity-60' : 'hover:bg-gray-50'
                }`}
              >
                {/* Left: Drag Handle + Icon + Name */}
                <div className="flex items-center space-x-4">
                  <div className="text-gray-400 cursor-move">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
                    </svg>
                  </div>

                  <span className="text-2xl">{section.section_icon || '📄'}</span>

                  <div>
                    <h3 className="font-medium text-charcoal">{section.section_name}</h3>
                    <p className="text-xs text-gray-500">{section.section_key}</p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center space-x-3">
                  {/* Position Badge */}
                  <span className="text-sm text-gray-400 w-8 text-center">
                    #{section.position}
                  </span>

                  {/* Edit Button */}
                  <button
                    onClick={() => openEditModal(section)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setShowDeleteConfirm(section.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>

                  {/* Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={(e) => void toggleSection(section.id, e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500" />
                  </label>

                  {/* Move Buttons */}
                  <div className="flex flex-col space-y-1">
                    <button
                      onClick={() => moveSection(index, 'up')}
                      disabled={index === 0}
                      className={`p-1 rounded transition-colors ${
                        index === 0
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveSection(index, 'down')}
                      disabled={index === sections.length - 1}
                      className={`p-1 rounded transition-colors ${
                        index === sections.length - 1
                          ? 'text-gray-300 cursor-not-allowed'
                          : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        {hasChanges && (
          <div className="mt-6 flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center text-yellow-800">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span className="font-medium">Kaydedilmemiş değişiklikler var</span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={resetOrder}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Sıfırla
              </button>
              <button
                onClick={() => void saveOrder()}
                disabled={saving}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {saving ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </div>
          </div>
        )}

        {/* Preview */}
        <div className="mt-8 bg-white rounded-2xl shadow-soft p-6">
          <h2 className="text-lg font-semibold text-charcoal mb-4">Önizleme (Aktif Bölümler)</h2>
          <div className="space-y-2">
            {sections
              .filter(s => s.enabled)
              .map((section, index) => (
                <div
                  key={section.id}
                  className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <span className="text-green-600 font-medium mr-3">{index + 1}.</span>
                  <span className="mr-2">{section.section_icon}</span>
                  <span className="text-green-800">{section.section_name}</span>
                </div>
              ))}
          </div>
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-charcoal mb-4">Yeni Bölüm Ekle</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Key (örn: my-section)
                </label>
                <input
                  type="text"
                  value={formData.section_key}
                  onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="landing-hero"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bölüm Adı
                </label>
                <input
                  type="text"
                  value={formData.section_name}
                  onChange={(e) => setFormData({ ...formData, section_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Ana Hero Bölümü"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, section_icon: icon })}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-colors ${
                        formData.section_icon === icon
                          ? 'border-sage-500 bg-sage-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => void addSection()}
                className="px-6 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-lg font-medium transition-colors"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingSection && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-charcoal mb-4">Bölümü Düzenle</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Section Key (değiştirilemez)
                </label>
                <input
                  type="text"
                  value={formData.section_key}
                  disabled
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bölüm Adı
                </label>
                <input
                  type="text"
                  value={formData.section_name}
                  onChange={(e) => setFormData({ ...formData, section_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Icon
                </label>
                <div className="flex flex-wrap gap-2">
                  {ICON_OPTIONS.map((icon) => (
                    <button
                      key={icon}
                      onClick={() => setFormData({ ...formData, section_icon: icon })}
                      className={`w-10 h-10 text-xl rounded-lg border-2 transition-colors ${
                        formData.section_icon === icon
                          ? 'border-sage-500 bg-sage-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {icon}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowEditModal(false)
                  setEditingSection(null)
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => void updateSection()}
                className="px-6 py-2 bg-sage-500 hover:bg-sage-600 text-white rounded-lg font-medium transition-colors"
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold text-charcoal mb-2">Bölümü Sil</h3>
            <p className="text-gray-600 mb-6">
              Bu bölümü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  if (showDeleteConfirm) {
                    void deleteSection(showDeleteConfirm)
                  }
                }}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors"
              >
                Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
