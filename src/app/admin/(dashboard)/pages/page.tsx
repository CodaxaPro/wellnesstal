'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'

interface PageCategory {
  id: string
  name: string
  slug: string
  color: string
  icon: string
}

interface Page {
  id: string
  slug: string
  title: string
  status: 'draft' | 'published' | 'archived'
  template: string
  meta_title?: string
  meta_description?: string
  category_id?: string
  page_categories?: PageCategory
  active?: boolean
  created_at: string
  updated_at: string
  published_at?: string
}

interface PageStats {
  total: number
  published: number
  drafts: number
}

export default function PagesManagement() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [categories, setCategories] = useState<PageCategory[]>([])
  const [stats, setStats] = useState<PageStats>({ total: 0, published: 0, drafts: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false)
  const [newPageForm, setNewPageForm] = useState({
    title: '',
    slug: '',
    template: 'default',
    meta_description: '',
    status: 'draft' as 'draft' | 'published',
    category_id: ''
  })
  const [newCategoryForm, setNewCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    color: '#9CAF88',
    icon: '📄'
  })
  const [editingCategory, setEditingCategory] = useState<PageCategory | null>(null)
  const [saving, setSaving] = useState(false)
  const [savingCategory, setSavingCategory] = useState(false)

  useEffect(() => {
    fetchCategories()
    fetchPages()
    // Check and run migration if needed
    checkAndRunMigration()
  }, [selectedStatus, selectedCategory])

  const checkAndRunMigration = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      if (!token) return

      // Check if active column exists by trying to fetch a page with active field
      const response = await fetch('/api/pages/migrate-active', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()
      
      if (!data.success && data.sql) {
        // Migration needed - show instructions
        console.log('Migration gerekli:', data.message)
        // Optionally show a toast or modal with instructions
      }
    } catch (error) {
      // Silent fail - migration check is optional
      console.log('Migration check failed (non-critical):', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/pages/categories')
      const data = await response.json()
      if (data.success) {
        setCategories(data.data || [])
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const params = new URLSearchParams()
      if (selectedStatus !== 'all') {
        params.set('status', selectedStatus)
      }
      if (selectedCategory !== 'all') {
        params.set('categoryId', selectedCategory)
      }

      const response = await fetch(`/api/pages?${params}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        const data = await response.json()
        const pagesList = data.data.pages || []
        setPages(pagesList)

        const published = pagesList.filter((p: Page) => p.status === 'published').length
        const drafts = pagesList.filter((p: Page) => p.status === 'draft').length
        setStats({ total: pagesList.length, published, drafts })
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newPageForm)
      })

      if (response.ok) {
        const data = await response.json()
        setIsCreateModalOpen(false)
        setNewPageForm({ title: '', slug: '', template: 'default', meta_description: '', status: 'draft', category_id: '' })
        // Navigate to page editor
        router.push(`/admin/pages/${data.data.id}/edit`)
      } else {
        const error = await response.json()
        alert(`Hata: ${error.error}`)
      }
    } catch (error) {
      alert('Sayfa oluşturulurken hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  const handleDuplicatePage = async (pageId: string, title: string) => {
    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ duplicate: pageId })
      })

      if (response.ok) {
        const data = await response.json()
        fetchPages()
        // Navigate to the duplicated page editor
        router.push(`/admin/pages/${data.data.id}/edit`)
      } else {
        const error = await response.json()
        alert(`Hata: ${error.error}`)
      }
    } catch (error) {
      alert('Sayfa çoğaltılırken hata oluştu')
    }
  }

  const handleDeletePage = async (pageId: string, title: string) => {
    if (!confirm(`"${title}" sayfasını silmek istediğinizden emin misiniz?`)) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/pages?id=${pageId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        fetchPages()
      }
    } catch (error) {
      alert('Sayfa silinirken hata oluştu')
    }
  }

  const handleToggleStatus = async (page: Page) => {
    const newStatus = page.status === 'published' ? 'draft' : 'published'

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/pages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: page.id, status: newStatus })
      })

      if (response.ok) {
        fetchPages()
      }
    } catch (error) {
      alert('Durum güncellenirken hata oluştu')
    }
  }

  const handleToggleActive = async (page: Page) => {
    const newActive = !(page.active !== false) // Default to true if undefined

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch('/api/pages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ id: page.id, active: newActive })
      })

      if (response.ok) {
        fetchPages()
        toast.success(newActive ? 'Sayfa aktif edildi' : 'Sayfa pasif edildi')
      } else {
        const errorData = await response.json()
        toast.error(errorData.error || 'Güncelleme başarısız')
      }
    } catch (error) {
      toast.error('Aktif/pasif durumu güncellenirken hata oluştu')
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/ğ/g, 'g').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sayfa Yönetimi</h1>
          <p className="text-slate-500 mt-1">Tüm sayfalarınızı yönetin ve düzenleyin</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              const token = localStorage.getItem('adminToken')
              if (!token) {
                toast.error('Giriş yapmanız gerekiyor')
                return
              }
              
              const run = confirm(
                'Migration çalıştırılacak. Active kolonu eklenecek.\n\n' +
                'Devam etmek istiyor musunuz?'
              )
              
              if (!run) return
              
              try {
                const response = await fetch('/api/pages/migrate-active', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                  }
                })
                
                const data = await response.json()
                
                if (data.success) {
                  toast.success('✅ Migration başarıyla tamamlandı!')
                  fetchPages()
                } else if (data.dashboardUrl) {
                  const open = confirm(
                    `Migration manuel olarak çalıştırılmalı.\n\n` +
                    `Supabase Dashboard açılsın mı?\n\n` +
                    `SQL:\n${data.sql?.substring(0, 150)}...`
                  )
                  if (open) {
                    window.open(data.dashboardUrl, '_blank')
                    toast.info('Supabase Dashboard açıldı. SQL Editor\'da migration\'ı çalıştırın.')
                  }
                } else {
                  toast.error(data.error || 'Migration başarısız')
                }
              } catch (error) {
                toast.error('Migration çalıştırılırken hata oluştu')
              }
            }}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            title="Active kolonu migration'ını çalıştır"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Migration Çalıştır
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-forest-600 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-sage-500/20"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Yeni Sayfa
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.total}</p>
              <p className="text-slate-500 text-sm">Toplam Sayfa</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.published}</p>
              <p className="text-slate-500 text-sm">Yayında</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200/60">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-6 h-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-800">{stats.drafts}</p>
              <p className="text-slate-500 text-sm">Taslak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-200/60 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Durum:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            >
              <option value="all">Tümü</option>
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Kategori:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-sage-500 focus:border-transparent"
            >
              <option value="all">Tümü</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => {
                setEditingCategory(null)
                setNewCategoryForm({ name: '', slug: '', description: '', color: '#9CAF88', icon: '📄' })
                setIsCategoryModalOpen(true)
              }}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Kategori Ekle
            </button>
            <button
              onClick={() => {
                setEditingCategory(null)
                setIsCategoryModalOpen(true)
              }}
              className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors flex items-center gap-2"
              title="Kategorileri Yönet"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
          </div>
          <div className="text-sm text-slate-400">
            {pages.length} sayfa bulundu
          </div>
        </div>
      </div>

      {/* Pages Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Sayfa</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kategori</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Şablon</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Durum</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Güncelleme</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-500 uppercase tracking-wider">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div>
                      <div className="font-medium text-slate-800">{page.title}</div>
                      <div className="text-sm text-slate-400">/{page.slug}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {page.page_categories ? (
                      <span 
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg text-white"
                        style={{ backgroundColor: page.page_categories.color || '#9CAF88' }}
                      >
                        <span>{page.page_categories.icon}</span>
                        {page.page_categories.name}
                      </span>
                    ) : (
                      <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-400">
                        Kategori yok
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600">
                      {page.template}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleStatus(page)}
                        className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                          page.status === 'published'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                        }`}
                      >
                        {page.status === 'published' ? 'Yayında' : 'Taslak'}
                      </button>
                      <button
                        onClick={() => handleToggleActive(page)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors ${
                          page.active !== false
                            ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                        title={page.active !== false ? 'Aktif - Pasif yap' : 'Pasif - Aktif yap'}
                      >
                        {page.active !== false ? (
                          <>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Aktif
                          </>
                        ) : (
                          <>
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                            </svg>
                            Pasif
                          </>
                        )}
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(page.updated_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/${page.slug}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Önizle"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDuplicatePage(page.id, page.title)}
                        className="p-2 text-slate-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-all"
                        title="Çoğalt"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <Link
                        href={`/admin/pages/${page.id}/edit`}
                        className="p-2 text-slate-400 hover:text-sage-600 hover:bg-sage-50 rounded-lg transition-all"
                        title="Düzenle"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>
                      <button
                        onClick={() => handleDeletePage(page.id, page.title)}
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Sil"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {pages.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800 mb-2">Henüz sayfa yok</h3>
            <p className="text-slate-500 mb-6">İlk sayfanızı oluşturarak başlayın</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 bg-sage-500 hover:bg-forest-600 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              İlk Sayfayı Oluştur
            </button>
          </div>
        )}
      </div>

      {/* Create Page Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">Yeni Sayfa Oluştur</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreatePage} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Sayfa Başlığı *
                </label>
                <input
                  type="text"
                  value={newPageForm.title}
                  onChange={(e) => {
                    const title = e.target.value
                    setNewPageForm(prev => ({
                      ...prev,
                      title,
                      slug: prev.slug === '' || prev.slug === generateSlug(prev.title) ? generateSlug(title) : prev.slug
                    }))
                  }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Örn: Masaj Terapi"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  URL Slug *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">
                    /
                  </span>
                  <input
                    type="text"
                    value={newPageForm.slug}
                    onChange={(e) => setNewPageForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-r-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="masaj-terapi"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kategori
                </label>
                <select
                  value={newPageForm.category_id}
                  onChange={(e) => setNewPageForm(prev => ({ ...prev, category_id: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Şablon
                </label>
                <select
                  value={newPageForm.template}
                  onChange={(e) => setNewPageForm(prev => ({ ...prev, template: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="default">Varsayılan</option>
                  <option value="service">Hizmet Sayfası</option>
                  <option value="landing">Landing Page</option>
                  <option value="about">Hakkında</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Meta Açıklama
                </label>
                <textarea
                  rows={3}
                  value={newPageForm.meta_description}
                  onChange={(e) => setNewPageForm(prev => ({ ...prev, meta_description: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="SEO için kısa açıklama..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-forest-600 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                >
                  {saving ? 'Oluşturuluyor...' : 'Oluştur ve Düzenle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Management Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-800">
                  {editingCategory ? 'Kategori Düzenle' : 'Kategori Yönetimi'}
                </h2>
                <button
                  onClick={() => {
                    setIsCategoryModalOpen(false)
                    setEditingCategory(null)
                    setNewCategoryForm({ name: '', slug: '', description: '', color: '#9CAF88', icon: '📄' })
                  }}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* Categories List */}
              {!editingCategory && (
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">Mevcut Kategoriler</h3>
                    <button
                      onClick={() => {
                        setEditingCategory(null)
                        setNewCategoryForm({ name: '', slug: '', description: '', color: '#9CAF88', icon: '📄' })
                      }}
                      className="px-3 py-1.5 text-sm bg-sage-500 hover:bg-sage-600 text-white rounded-lg transition-colors"
                    >
                      + Yeni Ekle
                    </button>
                  </div>
                  <div className="space-y-2">
                    {categories.map((cat) => (
                      <div
                        key={cat.id}
                        className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{cat.icon}</span>
                          <div>
                            <div className="font-medium text-slate-800">{cat.name}</div>
                            <div className="text-sm text-slate-500">/{cat.slug}</div>
                          </div>
                          <span
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: cat.color }}
                          />
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setEditingCategory(cat)
                              setNewCategoryForm({
                                name: cat.name,
                                slug: cat.slug,
                                description: (cat as any).description || '',
                                color: cat.color,
                                icon: cat.icon
                              })
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                            title="Düzenle"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={async () => {
                              if (!confirm(`"${cat.name}" kategorisini silmek istediğinizden emin misiniz?`)) {
                                return
                              }
                              try {
                                const token = localStorage.getItem('adminToken')
                                const response = await fetch(`/api/pages/categories?id=${cat.id}`, {
                                  method: 'DELETE',
                                  headers: { 'Authorization': `Bearer ${token}` }
                                })
                                const data = await response.json()
                                if (data.success) {
                                  await fetchCategories()
                                } else {
                                  alert(`Hata: ${data.error}`)
                                }
                              } catch (error) {
                                alert('Kategori silinirken hata oluştu')
                              }
                            }}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                            title="Sil"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                    {categories.length === 0 && (
                      <div className="text-center py-8 text-slate-500">
                        Henüz kategori yok. Yeni kategori ekleyin.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Category Form */}
              {(editingCategory || categories.length === 0) && (
                <form onSubmit={async (e) => {
                  e.preventDefault()
                  setSavingCategory(true)
                  try {
                    const token = localStorage.getItem('adminToken')
                    const url = editingCategory
                      ? '/api/pages/categories'
                      : '/api/pages/categories'
                    const method = editingCategory ? 'PUT' : 'POST'
                    const body = editingCategory
                      ? { id: editingCategory.id, ...newCategoryForm }
                      : newCategoryForm

                    const response = await fetch(url, {
                      method,
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                      },
                      body: JSON.stringify(body)
                    })
                    const data = await response.json()
                    if (data.success) {
                      setEditingCategory(null)
                      setNewCategoryForm({ name: '', slug: '', description: '', color: '#9CAF88', icon: '📄' })
                      await fetchCategories()
                      if (categories.length === 0) {
                        setIsCategoryModalOpen(false)
                      }
                    } else {
                      alert(`Hata: ${data.error}`)
                    }
                  } catch (error) {
                    alert('Kategori kaydedilirken hata oluştu')
                  } finally {
                    setSavingCategory(false)
                  }
                }} className="p-6 space-y-5 border-t border-slate-200">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Kategori Adı *
                </label>
                <input
                  type="text"
                  value={newCategoryForm.name}
                  onChange={(e) => {
                    const name = e.target.value
                    setNewCategoryForm(prev => ({
                      ...prev,
                      name,
                      slug: prev.slug === '' || prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug
                    }))
                  }}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Örn: Hizmetler"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Slug *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-200 bg-slate-50 text-slate-500 text-sm">
                    /
                  </span>
                  <input
                    type="text"
                    value={newCategoryForm.slug}
                    onChange={(e) => setNewCategoryForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="flex-1 px-4 py-3 border border-slate-200 rounded-r-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="hizmetler"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Renk
                  </label>
                  <input
                    type="color"
                    value={newCategoryForm.color}
                    onChange={(e) => setNewCategoryForm(prev => ({ ...prev, color: e.target.value }))}
                    className="w-full h-12 border border-slate-200 rounded-xl cursor-pointer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    İkon
                  </label>
                  <input
                    type="text"
                    value={newCategoryForm.icon}
                    onChange={(e) => setNewCategoryForm(prev => ({ ...prev, icon: e.target.value }))}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent text-2xl text-center"
                    placeholder="📄"
                    maxLength={2}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  rows={2}
                  value={newCategoryForm.description}
                  onChange={(e) => setNewCategoryForm(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Kategori açıklaması..."
                />
              </div>

                  <div className="flex justify-end gap-3 pt-4">
                    {editingCategory && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCategory(null)
                          setNewCategoryForm({ name: '', slug: '', description: '', color: '#9CAF88', icon: '📄' })
                        }}
                        className="px-5 py-2.5 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
                      >
                        İptal
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={savingCategory}
                      className="px-5 py-2.5 bg-gradient-to-r from-sage-500 to-sage-600 hover:from-sage-600 hover:to-forest-600 text-white rounded-xl font-medium transition-all disabled:opacity-50"
                    >
                      {savingCategory ? (editingCategory ? 'Kaydediliyor...' : 'Oluşturuluyor...') : (editingCategory ? 'Kaydet' : 'Oluştur')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
