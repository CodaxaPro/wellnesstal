'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Page, pageTemplates } from '@/types/pages'

interface PageStats {
  total: number
  published: number
  drafts: number
  templates: { [key: string]: number }
}

export default function PagesManagement() {
  const router = useRouter()
  const [pages, setPages] = useState<Page[]>([])
  const [stats, setStats] = useState<PageStats>({
    total: 0,
    published: 0,
    drafts: 0,
    templates: {}
  })
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedTemplate, setSelectedTemplate] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newPageForm, setNewPageForm] = useState({
    title: '',
    slug: '',
    templateType: 'service',
    metaDescription: '',
    status: 'draft' as 'draft' | 'published'
  })

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
      return
    }
    fetchPages()
  }, [router, selectedStatus, selectedTemplate])

  const fetchPages = async () => {
    try {
      const token = localStorage.getItem('adminToken')
      const params = new URLSearchParams({
        status: selectedStatus !== 'all' ? selectedStatus : '',
        template: selectedTemplate !== 'all' ? selectedTemplate : '',
        limit: '50'
      })

      const response = await fetch(`/api/pages?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setPages(data.data.pages)
        
        // Calculate stats
        const allPages = data.data.pages
        const published = allPages.filter((p: Page) => p.status === 'published').length
        const drafts = allPages.filter((p: Page) => p.status === 'draft').length
        
        const templates: { [key: string]: number } = {}
        allPages.forEach((p: Page) => {
          templates[p.templateType] = (templates[p.templateType] || 0) + 1
        })

        setStats({
          total: allPages.length,
          published,
          drafts,
          templates
        })
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePage = async (e: React.FormEvent) => {
    e.preventDefault()
    
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
        setIsCreateModalOpen(false)
        setNewPageForm({
          title: '',
          slug: '',
          templateType: 'service',
          metaDescription: '',
          status: 'draft'
        })
        fetchPages()
      } else {
        const error = await response.json()
        alert(`Fehler: ${error.error}`)
      }
    } catch (error) {
      alert('Fehler beim Erstellen der Seite')
    }
  }

  const handleDeletePage = async (pageId: string, title: string) => {
    if (!confirm(`Sind Sie sicher, dass Sie die Seite "${title}" löschen möchten?`)) {
      return
    }

    try {
      const token = localStorage.getItem('adminToken')
      const response = await fetch(`/api/pages?id=${pageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchPages()
      }
    } catch (error) {
      alert('Fehler beim Löschen der Seite')
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
        body: JSON.stringify({
          id: page.id,
          status: newStatus
        })
      })

      if (response.ok) {
        fetchPages()
      }
    } catch (error) {
      alert('Fehler beim Aktualisieren des Status')
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/ä/g, 'ae')
      .replace(/ö/g, 'oe')
      .replace(/ü/g, 'ue')
      .replace(/ß/g, 'ss')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
  }

  const handleTitleChange = (title: string) => {
    setNewPageForm(prev => ({
      ...prev,
      title,
      slug: prev.slug === '' ? generateSlug(title) : prev.slug
    }))
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    )
  }

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
              <h1 className="text-2xl font-bold text-charcoal">Seiten Verwaltung</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-sage-500 hover:bg-forest-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Neue Seite
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
            <div className="text-2xl font-bold text-charcoal">{stats.total}</div>
            <div className="text-gray-custom text-sm">Gesamt Seiten</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-green-600">{stats.published}</div>
            <div className="text-gray-custom text-sm">Veröffentlicht</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-orange-600">{stats.drafts}</div>
            <div className="text-gray-custom text-sm">Entwürfe</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-blue-600">{Object.keys(stats.templates).length}</div>
            <div className="text-gray-custom text-sm">Templates</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-soft mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="all">Alle Status</option>
                  <option value="published">Veröffentlicht</option>
                  <option value="draft">Entwürfe</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Template</label>
                <select
                  value={selectedTemplate}
                  onChange={(e) => setSelectedTemplate(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="all">Alle Templates</option>
                  <option value="service">Service</option>
                  <option value="about">Über Uns</option>
                  <option value="landing">Landing Page</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-custom">
              {pages.length} Seiten gefunden
            </div>
          </div>
        </div>

        {/* Pages Table */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Seite
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Template
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Erstellt
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aktionen
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pages.map((page) => (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-charcoal">{page.title}</div>
                        <div className="text-sm text-gray-custom">/{page.slug}</div>
                        {page.metaDescription && (
                          <div className="text-xs text-gray-400 mt-1 line-clamp-1">
                            {page.metaDescription}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        page.templateType === 'service' ? 'bg-blue-100 text-blue-800' :
                        page.templateType === 'about' ? 'bg-purple-100 text-purple-800' :
                        page.templateType === 'landing' ? 'bg-green-100 text-green-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {page.templateType}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(page)}
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full transition-colors ${
                          page.status === 'published' 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                        }`}
                      >
                        {page.status === 'published' ? 'Veröffentlicht' : 'Entwurf'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-custom">
                      {new Date(page.createdAt).toLocaleDateString('de-DE')}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/${page.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                          title="Vorschau"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/admin/pages/${page.id}/edit`}
                          className="p-2 text-gray-400 hover:text-sage-600 transition-colors"
                          title="Bearbeiten"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <button
                          onClick={() => handleDeletePage(page.id, page.title)}
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

        {pages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">Keine Seiten gefunden</h3>
            <p className="text-gray-custom mb-6">Erstellen Sie Ihre erste Seite, um zu beginnen.</p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
            >
              Erste Seite erstellen
            </button>
          </div>
        )}
      </main>

      {/* Create Page Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-charcoal">Neue Seite erstellen</h2>
                <button
                  onClick={() => setIsCreateModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form onSubmit={handleCreatePage} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Seitentitel *
                </label>
                <input
                  type="text"
                  value={newPageForm.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="z.B. Aromatherapie in Köln"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  URL Slug *
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                    wellnesstal.de/
                  </span>
                  <input
                    type="text"
                    value={newPageForm.slug}
                    onChange={(e) => setNewPageForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="flex-1 px-4 py-3 border border-gray-200 rounded-r-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="aromatherapie-koeln"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Template *
                </label>
                <select
                  value={newPageForm.templateType}
                  onChange={(e) => setNewPageForm(prev => ({ ...prev, templateType: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  {pageTemplates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name} - {template.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Meta Beschreibung
                </label>
                <textarea
                  rows={3}
                  value={newPageForm.metaDescription}
                  onChange={(e) => setNewPageForm(prev => ({ ...prev, metaDescription: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Kurze Beschreibung für Suchmaschinen..."
                />
                <p className="text-sm text-gray-500 mt-2">
                  {newPageForm.metaDescription.length}/160 Zeichen
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Status
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="draft"
                      checked={newPageForm.status === 'draft'}
                      onChange={(e) => setNewPageForm(prev => ({ ...prev, status: e.target.value as 'draft' }))}
                      className="text-sage-600 focus:ring-sage-500"
                    />
                    <span className="ml-2 text-sm">Entwurf</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="published"
                      checked={newPageForm.status === 'published'}
                      onChange={(e) => setNewPageForm(prev => ({ ...prev, status: e.target.value as 'published' }))}
                      className="text-sage-600 focus:ring-sage-500"
                    />
                    <span className="ml-2 text-sm">Veröffentlichen</span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-charcoal hover:bg-gray-50 transition-colors"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-sage-500 hover:bg-forest-600 text-white rounded-xl transition-colors"
                >
                  Seite erstellen
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}