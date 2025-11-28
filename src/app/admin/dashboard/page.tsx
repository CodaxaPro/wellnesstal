'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// Template Engine imports
import { templateEngine } from '../../../lib/template-engine'
import { TemplateConfig } from '../../../types/templates'

interface DashboardStats {
  totalServices: number
  activeTestimonials: number
  monthlyViews: number
  contactRequests: number
}

interface AdminUser {
  username: string
  email: string
  role: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 4,
    activeTestimonials: 5,
    monthlyViews: 1248,
    contactRequests: 23
  })

  // Template Engine State
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig | null>(null)
  const [templateLoading, setTemplateLoading] = useState(true)

  // Template Engine Initialization
  useEffect(() => {
    const initializeTemplate = async () => {
      try {
        setTemplateLoading(true)
        
        const config: TemplateConfig = {
          id: "wellness-basic",
          name: "Wellness & Spa Management",
          industry: "wellness" as const,
          version: "1.0.0",
          description: "Complete wellness and spa management system",
          
          entities: {
            primary: {
              name: "Services",
              singular: "Service",
              plural: "Services",
              icon: "Sparkles",
              color: "#10B981",
              fields: [],
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true,
                bulk: true
              }
            },
            secondary: {
              name: "Categories", 
              singular: "Category",
              plural: "Categories",
              icon: "FolderOpen",
              color: "#8B5CF6",
              fields: [],
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true,
                bulk: true
              }
            },
            additional: [
              {
                name: "Therapists",
                singular: "Therapist", 
                plural: "Therapists",
                icon: "Users",
                color: "#F59E0B",
                fields: [],
                permissions: {
                  create: true,
                  read: true,
                  update: true,
                  delete: true,
                  bulk: true
                }
              }
            ]
          },
          
          ui: {
            theme: {
              primaryColor: "#10B981",
              secondaryColor: "#6B7280",
              accentColor: "#8B5CF6",
              fontFamily: "Inter, sans-serif",
              fontSize: {
                sm: "0.875rem",
                base: "1rem",
                lg: "1.125rem", 
                xl: "1.25rem"
              },
              borderRadius: "0.75rem",
              spacing: "comfortable" as const,
              darkMode: false,
              brandName: "Wellnesstal Studio"
            },
            components: {},
            layout: {
              sidebar: {
                position: "left" as const,
                collapsible: true,
                defaultCollapsed: false
              },
              navigation: {
                style: "sidebar" as const,
                items: []
              },
              dashboard: {
                widgets: [],
                layout: "grid" as const
              }
            }
          },
          
          business: {
            workflows: [],
            validations: {},
            automations: []
          },
          
          features: {
            enabled: ["dashboard", "admin-panel", "analytics"],
            disabled: []
          }
        }
        
        templateEngine.registerTemplate(config as any)
        templateEngine.setActiveTemplate('wellness-basic')
        setTemplateConfig(config)
        
      } catch (err) {
        console.error('Dashboard template initialization failed:', err)
      } finally {
        setTemplateLoading(false)
      }
    }
    
    initializeTemplate()
  }, [])

  useEffect(() => {
    // ESKİ SİSTEM - localStorage kontrolü
    const token = localStorage.getItem('adminToken')
    const userData = localStorage.getItem('adminUser')
    
    if (!token || !userData) {
      router.push('/admin')
      return
    }

    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    if (templateConfig) {
      document.documentElement.style.setProperty('--template-primary', templateConfig.ui.theme.primaryColor)
      document.documentElement.style.setProperty('--template-secondary', templateConfig.ui.theme.secondaryColor)
      document.documentElement.style.setProperty('--template-accent', templateConfig.ui.theme.accentColor)
    }
  }, [templateConfig])

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminUser')
    router.push('/admin')
  }

  const getMenuItems = () => {
    if (!templateConfig) return []
    
    return [
      {
        title: templateConfig.entities.primary.plural,
        description: `${templateConfig.entities.primary.plural} bilgilerini düzenle`,
        icon: (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        ),
        href: '/admin/services',
        color: 'bg-template-primary',
        stats: stats.totalServices,
        entityKey: 'primary'
      },
      {
        title: templateConfig.entities.secondary?.plural || 'Categories',
        description: `${templateConfig.entities.secondary?.plural || 'Kategori'} yönetimi`,
        icon: (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
        ),
        href: '/admin/categories',
        color: 'bg-purple-500',
        stats: 5,
        entityKey: 'secondary'
      },
      {
        title: 'Müşteri Yorumları',
        description: `${templateConfig.industry === 'wellness' ? 'Wellness' : 'Customer'} testimonial yönetimi`,
        icon: (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        ),
        href: '/admin/testimonials',
        color: 'bg-green-500',
        stats: stats.activeTestimonials
      },
      {
        title: templateConfig.entities.additional?.[0]?.plural || 'Team',
        description: `${templateConfig.entities.additional?.[0]?.plural || 'Team'} yönetimi`,
        icon: (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        ),
        href: '/admin/team',
        color: 'bg-yellow-500',
        stats: '3 active'
      },
      {
        title: 'İçerik Yönetimi',
        description: 'Sayfa içeriklerini düzenle',
        icon: (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        ),
        href: '/admin/content',
        color: 'bg-indigo-500',
        stats: '6 sayfa'
      },
      {
        title: 'Medya Galerisi',
        description: 'Görselleri yönet',
        icon: (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        ),
        href: '/admin/media',
        color: 'bg-orange-500',
        stats: '24 dosya'
      },
      {
        title: 'İletişim Ayarları',
        description: 'İletişim bilgilerini düzenle',
        icon: (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        ),
        href: '/admin/contact',
        color: 'bg-teal-500',
        stats: 'Güncel'
      },
      {
        title: 'WhatsApp Ayarları',
        description: 'WhatsApp butonu kurumsal ayarları',
        icon: (
          <svg className="h-8 w-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
        ),
        href: '/admin/whatsapp',
        color: 'bg-green-500',
        stats: 'Enterprise'
      },
      {
        title: 'İstatistikler',
        description: 'Site analitikleri',
        icon: (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        ),
        href: '/admin/analytics',
        color: 'bg-red-500',
        stats: stats.monthlyViews
      }
    ]
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500"></div>
      </div>
    )
  }

  const menuItems = getMenuItems()

  return (
    <div className={`min-h-screen bg-cream ${templateConfig ? `template-${templateConfig.industry}` : ''}`}>
      {templateLoading && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Template wird geladen...
        </div>
      )}

      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold mr-8" style={{ color: templateConfig?.ui.theme.primaryColor || '#6B8A3A' }}>
                🌿 {templateConfig?.ui.theme.brandName || 'Wellnesstal'}
              </Link>
              <nav className="hidden md:flex space-x-8">
                <span className="text-charcoal font-medium">Admin Panel</span>
                {templateConfig && (
                  <span className="text-sm text-gray-500">
                    Template: {templateConfig.name} • {templateConfig.industry}
                  </span>
                )}
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-custom">
                Willkommen, <span className="font-medium text-charcoal">{user.username}</span>
              </div>
              <Link
                href="/"
                target="_blank"
                className="text-sage-600 hover:text-forest-600 transition-colors"
                title="Website ansehen"
                style={{ color: templateConfig?.ui.theme.primaryColor }}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Abmelden
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">
            Dashboard - {templateConfig?.name || 'Admin Panel'}
          </h1>
          <p className="text-gray-custom">
            Verwalten Sie Ihre {templateConfig?.ui.theme.brandName || 'Wellnesstal'} Website-Inhalte
          </p>
          
          {templateConfig && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-green-800">
                Template: {templateConfig.name} v{templateConfig.version} • Industry: {templateConfig.industry}
              </span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${templateConfig?.ui.theme.primaryColor}20` }}
              >
                <svg 
                  className="h-6 w-6"
                  style={{ color: templateConfig?.ui.theme.primaryColor }}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-custom">
                  Aktive {templateConfig?.entities.primary.plural || 'Services'}
                </p>
                <p className="text-2xl font-bold text-charcoal">{stats.totalServices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${templateConfig?.ui.theme.accentColor}20` }}
              >
                <svg 
                  className="h-6 w-6"
                  style={{ color: templateConfig?.ui.theme.accentColor }}
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-custom">
                  {templateConfig?.entities.secondary?.plural || 'Categories'}
                </p>
                <p className="text-2xl font-bold text-charcoal">5</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-custom">
                  {templateConfig?.industry === 'wellness' ? 'Patient Reviews' : 
                   templateConfig?.industry === 'restaurant' ? 'Customer Reviews' : 
                   templateConfig?.industry === 'healthcare' ? 'Patient Testimonials' : 'Reviews'}
                </p>
                <p className="text-2xl font-bold text-charcoal">{stats.activeTestimonials}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-custom">Monatliche Besucher</p>
                <p className="text-2xl font-bold text-charcoal">{stats.monthlyViews.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300`}>
                  {item.icon}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-charcoal">{item.stats}</div>
                </div>
              </div>
              <h3 
                className="text-xl font-semibold text-charcoal mb-2 group-hover:transition-colors"
                style={{ 
                  '--hover-color': templateConfig?.ui.theme.primaryColor 
                } as React.CSSProperties}
              >
                {item.title}
              </h3>
              <p className="text-gray-custom text-sm leading-relaxed">
                {item.description}
              </p>
              <div 
                className="mt-4 flex items-center transition-colors"
                style={{ 
                  color: templateConfig?.ui.theme.primaryColor || '#9CAF88'
                }}
              >
                <span className="text-sm font-medium">Verwalten</span>
                <svg className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 bg-white rounded-2xl p-6 shadow-soft">
          <h2 className="text-xl font-semibold text-charcoal mb-6">
            Letzte Aktivitäten
          </h2>
          <div className="space-y-4">
            {[
              { 
                action: templateConfig?.industry === 'wellness' ? 'Neue Wellness-Bewertung hinzugefügt' : 
                        templateConfig?.industry === 'restaurant' ? 'Neue Restaurant-Bewertung hinzugefügt' :
                        'Neuer Testimonial hinzugefügt', 
                user: 'System', 
                time: '2 Stunden', 
                type: 'success' 
              },
              { 
                action: `${templateConfig?.entities.primary.singular || 'Service'} "${
                  templateConfig?.industry === 'wellness' ? 'Premium Headspa' :
                  templateConfig?.industry === 'restaurant' ? 'Signature Burger' :
                  templateConfig?.industry === 'healthcare' ? 'Consultation' : 'Premium Service'
                }" aktualisiert`, 
                user: 'Admin', 
                time: '5 Stunden', 
                type: 'info' 
              },
              { 
                action: templateConfig?.industry === 'wellness' ? 'Termin-Anfrage erhalten' :
                        templateConfig?.industry === 'restaurant' ? 'Tisch-Reservierung erhalten' :
                        'Kontaktanfrage erhalten', 
                user: 'Website', 
                time: '1 Tag', 
                type: 'warning' 
              },
              { 
                action: `${templateConfig?.entities.additional?.[0]?.singular || 'Team Member'} Profil aktualisiert`, 
                user: 'Admin', 
                time: '2 Tage', 
                type: 'info' 
              }
            ].map((activity, index) => (
              <div key={index} className="flex items-center p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  activity.type === 'success' ? 'bg-green-100 text-green-600' :
                  activity.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                  'bg-blue-100 text-blue-600'
                }`}>
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm font-medium text-charcoal">{activity.action}</p>
                  <p className="text-xs text-gray-custom">von {activity.user} • vor {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {templateConfig && (
        <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-lg text-xs text-gray-600 z-40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>
              Dashboard Template: <strong>{templateConfig.name}</strong> v{templateConfig.version}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}