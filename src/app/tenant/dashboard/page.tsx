'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface DashboardStats {
  totalServices: number
  activeTestimonials: number
  monthlyViews: number
  contactRequests: number
}

export default function TenantDashboard() {
  const router = useRouter()
  const { user, tenantId, signOut, loading } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    totalServices: 0,
    activeTestimonials: 0,
    monthlyViews: 0,
    contactRequests: 0
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  if (loading || !user) {
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
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-forest-600 mr-8">
                🌿 Tenant Portal
              </Link>
              <nav className="hidden md:flex space-x-8">
                <span className="text-charcoal font-medium">Dashboard</span>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-custom">
                Willkommen, <span className="font-medium text-charcoal">{user.email}</span>
              </div>
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-charcoal mb-2">
            Tenant Dashboard
          </h1>
          <p className="text-gray-custom">
            Verwalten Sie Ihre Landing Pages und Services
          </p>
          
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-medium text-blue-800">
              Tenant ID: {tenantId?.substring(0, 8)}...
            </span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-custom">Aktive Services</p>
                <p className="text-2xl font-bold text-charcoal">{stats.totalServices}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-custom">Landing Pages</p>
                <p className="text-2xl font-bold text-charcoal">0</p>
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
                <p className="text-sm font-medium text-gray-custom">Reviews</p>
                <p className="text-2xl font-bold text-charcoal">{stats.activeTestimonials}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-soft">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

        {/* Management Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/tenant/services"
            className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-charcoal">{stats.totalServices}</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2 group-hover:text-green-600 transition-colors">
              Services
            </h3>
            <p className="text-gray-custom text-sm leading-relaxed">
              Verwalten Sie Ihre Services und Angebote
            </p>
            <div className="mt-4 flex items-center text-green-600 transition-colors">
              <span className="text-sm font-medium">Verwalten</span>
              <svg className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/tenant/landing-pages"
            className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-purple-500 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-charcoal">0</div>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2 group-hover:text-purple-600 transition-colors">
              Landing Pages
            </h3>
            <p className="text-gray-custom text-sm leading-relaxed">
              Erstellen und bearbeiten Sie Landing Pages
            </p>
            <div className="mt-4 flex items-center text-purple-600 transition-colors">
              <span className="text-sm font-medium">Verwalten</span>
              <svg className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>

          <Link
            href="/tenant/settings"
            className="bg-white rounded-2xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-14 h-14 bg-gray-500 rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-semibold text-charcoal mb-2 group-hover:text-gray-600 transition-colors">
              Einstellungen
            </h3>
            <p className="text-gray-custom text-sm leading-relaxed">
              Konto und Unternehmenseinstellungen
            </p>
            <div className="mt-4 flex items-center text-gray-600 transition-colors">
              <span className="text-sm font-medium">Verwalten</span>
              <svg className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}