'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'

interface DashboardStats {
  totalServices: number
  activeTestimonials: number
  monthlyViews: number
  totalMedia: number
}

interface HomepageSection {
  id: string
  section_key: string
  section_name: string
  section_icon: string | null
  position: number
  enabled: boolean
}

interface MediaFile {
  id: string
  file_name: string
  original_name: string
  file_path: string
  thumbnail_path: string | null
  file_size: number
  category: string
  created_at: string
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    activeTestimonials: 0,
    monthlyViews: 1248,
    totalMedia: 0
  })
  const [sections, setSections] = useState<HomepageSection[]>([])
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sectionsRes = await fetch('/api/sections')
        const sectionsData = await sectionsRes.json()
        if (sectionsData.success) {
setSections(sectionsData.data)
}

        const mediaRes = await fetch('/api/media?limit=6')
        const mediaData = await mediaRes.json()
        if (mediaData.success) {
          setMediaFiles(mediaData.data)
          setStats(prev => ({ ...prev, totalMedia: mediaData.total || mediaData.data.length }))
        }

        const servicesRes = await fetch('/api/services')
        const servicesData = await servicesRes.json()
        if (servicesData.success) {
          setStats(prev => ({ ...prev, totalServices: servicesData.data?.length || 0 }))
        }
      } catch (error) {
        console.error('Failed to fetch:', error)
      }
    }
    fetchData()
  }, [])

  const toggleSection = async (id: string, enabled: boolean) => {
    const token = localStorage.getItem('adminToken')
    try {
      const response = await fetch('/api/sections', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ id, enabled })
      })
      if (response.ok) {
        setSections(prev => prev.map(s => s.id === id ? { ...s, enabled } : s))
      }
    } catch (error) {
      console.error('Failed to toggle:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) {
return `${bytes} B`
}
    if (bytes < 1024 * 1024) {
return `${(bytes / 1024).toFixed(1)} KB`
}
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const statsCards = [
    { title: 'Toplam Hizmet', value: stats.totalServices, icon: '✨', color: 'from-emerald-400 to-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Medya Dosyası', value: stats.totalMedia, icon: '🖼️', color: 'from-orange-400 to-orange-600', bg: 'bg-orange-50' },
    { title: 'Aktif Bölüm', value: sections.filter(s => s.enabled).length, icon: '📋', color: 'from-purple-400 to-purple-600', bg: 'bg-purple-50' },
    { title: 'Aylık Görüntülenme', value: stats.monthlyViews.toLocaleString(), icon: '👁️', color: 'from-blue-400 to-blue-600', bg: 'bg-blue-50' }
  ]

  const quickActions = [
    { title: 'Yeni Hizmet', href: '/admin/services', icon: '✨', color: 'bg-emerald-100 hover:bg-emerald-200 text-emerald-700 border-emerald-200' },
    { title: 'Medya Yükle', href: '/admin/media', icon: '📷', color: 'bg-orange-100 hover:bg-orange-200 text-orange-700 border-orange-200' },
    { title: 'İçerik Düzenle', href: '/admin/content', icon: '📝', color: 'bg-blue-100 hover:bg-blue-200 text-blue-700 border-blue-200' },
    { title: 'Bölüm Sırala', href: '/admin/sections', icon: '📋', color: 'bg-purple-100 hover:bg-purple-200 text-purple-700 border-purple-200' }
  ]

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 mb-2">Dashboard</h1>
        <p className="text-slate-500">Wellnesstal yönetim paneline hoş geldiniz</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center text-2xl`}>
                {stat.icon}
              </div>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`} />
            </div>
            <p className="text-slate-500 text-sm mb-1">{stat.title}</p>
            <p className="text-2xl lg:text-3xl font-bold text-slate-800">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">Hızlı İşlemler</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              href={action.href}
              className={`flex items-center gap-3 p-4 rounded-xl border ${action.color} transition-all duration-300`}
            >
              <span className="text-2xl">{action.icon}</span>
              <span className="font-medium">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Sections */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span className="text-purple-500">📋</span> Sayfa Bölümleri
            </h2>
            <Link href="/admin/sections" className="text-sm text-sage-600 hover:text-sage-700 flex items-center gap-1">
              Tümü →
            </Link>
          </div>
          <div className="p-4 space-y-2 max-h-[400px] overflow-y-auto">
            {sections.sort((a, b) => a.position - b.position).map((section) => (
              <div
                key={section.id}
                className={`flex items-center justify-between p-3 rounded-xl transition-all ${
                  section.enabled ? 'bg-emerald-50 border border-emerald-200' : 'bg-slate-50 border border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{section.section_icon || '📄'}</span>
                  <div>
                    <p className={`font-medium ${section.enabled ? 'text-slate-800' : 'text-slate-400'}`}>
                      {section.section_name}
                    </p>
                    <p className="text-xs text-slate-400">{section.section_key}</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={section.enabled}
                    onChange={(e) => toggleSection(section.id, e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:ring-2 peer-focus:ring-sage-300 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all after:shadow-sm peer-checked:bg-sage-500" />
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Media */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span className="text-orange-500">🖼️</span> Son Medyalar
            </h2>
            <Link href="/admin/media" className="text-sm text-sage-600 hover:text-sage-700 flex items-center gap-1">
              Tümü →
            </Link>
          </div>
          <div className="p-4">
            {mediaFiles.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {mediaFiles.map((file) => (
                  <div key={file.id} className="group relative aspect-square rounded-xl overflow-hidden bg-slate-100">
                    <img
                      src={file.thumbnail_path || file.file_path}
                      alt={file.original_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-white text-xs font-medium truncate">{file.original_name}</p>
                        <p className="text-white/70 text-xs">{formatFileSize(file.file_size)}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl">
                  🖼️
                </div>
                <p className="text-slate-400 mb-4">Henüz medya yok</p>
                <Link
                  href="/admin/media"
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  + Medya Yükle
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-6 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800">Son Aktiviteler</h2>
        </div>
        <div className="p-4 space-y-3">
          {[
            { action: 'Yeni hizmet eklendi', time: '2 saat önce', icon: '✨', color: 'bg-emerald-100' },
            { action: 'Medya dosyası yüklendi', time: '4 saat önce', icon: '📷', color: 'bg-orange-100' },
            { action: 'İçerik güncellendi', time: '1 gün önce', icon: '📝', color: 'bg-blue-100' },
            { action: 'Yeni yorum eklendi', time: '2 gün önce', icon: '💬', color: 'bg-purple-100' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <div className={`w-10 h-10 ${activity.color} rounded-xl flex items-center justify-center text-lg`}>
                {activity.icon}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-700">{activity.action}</p>
                <p className="text-xs text-slate-400">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
