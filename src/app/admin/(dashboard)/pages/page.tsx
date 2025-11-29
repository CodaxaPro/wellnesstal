'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Page {
  id: string
  slug: string
  title: string
  status: 'draft' | 'published' | 'archived'
  template: string
  meta_title?: string
  meta_description?: string
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
  const [stats, setStats] = useState<PageStats>({ total: 0, published: 0, drafts: 0 })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newPageForm, setNewPageForm] = useState({
    title: '',
    slug: '',
    template: 'default',
    meta_description: '',
    status: 'draft' as 'draft' | 'published'
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetchPages()
  }, [selectedStatus])

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const params = new URLSearchParams()
      if (selectedStatus !== 'all') {
        params.set('status', selectedStatus)
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
        setNewPageForm({ title: '', slug: '', template: 'default', meta_description: '', status: 'draft' })
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
          <div className="text-sm text-slate-400 ml-auto">
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
                    <span className="inline-flex px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-100 text-slate-600">
                      {page.template}
                    </span>
                  </td>
                  <td className="px-6 py-4">
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
    </div>
  )
}
