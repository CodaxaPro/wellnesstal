'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Testimonial {
  id: string
  name: string
  location: string
  avatar: string
  rating: number
  service: string
  text: string
  verified: boolean
  source: 'Google' | 'Facebook' | 'Direct'
  date: string
  active: boolean
  order: number
}

export default function TestimonialsManagement() {
  const router = useRouter()
  const [testimonials, setTestimonials] = useState<Testimonial[]>([
    {
      id: '1',
      name: 'Sarah Müller',
      location: 'Baesweiler',
      avatar: 'SM',
      rating: 5,
      service: 'Premium Headspa',
      text: 'Absolut entspannende Erfahrung! Die Headspa-Behandlung war genau das, was ich nach einem stressigen Arbeitstag gebraucht habe. Das Team ist sehr professionell und die Atmosphäre lädt zum Abschalten ein.',
      verified: true,
      source: 'Google',
      date: 'vor 2 Wochen',
      active: true,
      order: 1
    },
    {
      id: '2',
      name: 'Michael Klein',
      location: 'Düsseldorf',
      avatar: 'MK',
      rating: 5,
      service: 'Wellness Massage',
      text: 'Die Atmosphäre ist wunderbar entspannend und die Behandlungen sind erstklassig. Meine Verspannungen sind wie weggeblasen. Ich komme regelmäßig hierher und kann Wellnesstal nur empfehlen!',
      verified: true,
      source: 'Google',
      date: 'vor 1 Woche',
      active: true,
      order: 2
    },
    {
      id: '3',
      name: 'Anna Berg',
      location: 'Bonn',
      avatar: 'AB',
      rating: 5,
      service: 'Aromatherapie',
      text: 'Endlich ein Ort, wo ich komplett abschalten kann. Die Aromatherapie-Behandlung war ein Traum - die Düfte waren himmlisch und ich bin völlig entspannt nach Hause gefahren.',
      verified: true,
      source: 'Facebook',
      date: 'vor 3 Tagen',
      active: true,
      order: 3
    },
    {
      id: '4',
      name: 'Thomas Schmidt',
      location: 'Baesweiler',
      avatar: 'TS',
      rating: 4,
      service: 'Gesichtspflege',
      text: 'Als Mann war ich zunächst skeptisch, aber das Team hat mich sofort wohlgefühlt. Die Gesichtsbehandlung war fantastisch und meine Haut fühlt sich seitdem viel besser an.',
      verified: false,
      source: 'Direct',
      date: 'vor 4 Tagen',
      active: false,
      order: 4
    },
    {
      id: '5',
      name: 'Lisa Wagner',
      location: 'Leverkusen',
      avatar: 'LW',
      rating: 5,
      service: 'Premium Headspa',
      text: 'Ich war zum ersten Mal bei einer Headspa-Behandlung und bin total begeistert! Die Kopfhautmassage war so entspannend und die verwendeten Öle haben einen tollen Duft.',
      verified: true,
      source: 'Google',
      date: 'vor 5 Tagen',
      active: true,
      order: 5
    }
  ])

  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all')
  const [filterSource, setFilterSource] = useState<'all' | 'Google' | 'Facebook' | 'Direct'>('all')

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
    }
  }, [router])

  const filteredTestimonials = testimonials.filter(testimonial => {
    if (filterStatus !== 'all' && testimonial.active !== (filterStatus === 'active')) {
      return false
    }
    if (filterSource !== 'all' && testimonial.source !== filterSource) {
      return false
    }
    return true
  })

  const handleEdit = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial)
    setIsEditModalOpen(true)
  }

  const handleDelete = async (testimonialId: string) => {
    if (window.confirm('Bu müşteri yorumunu silmek istediğinizden emin misiniz?')) {
      setTestimonials(testimonials.filter(t => t.id !== testimonialId))
    }
  }

  const handleToggleActive = (testimonialId: string) => {
    setTestimonials(testimonials.map(testimonial => 
      testimonial.id === testimonialId 
        ? { ...testimonial, active: !testimonial.active }
        : testimonial
    ))
  }

  const handleToggleVerified = (testimonialId: string) => {
    setTestimonials(testimonials.map(testimonial => 
      testimonial.id === testimonialId 
        ? { ...testimonial, verified: !testimonial.verified }
        : testimonial
    ))
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Google':
        return '🌐'
      case 'Facebook':
        return '📘'
      case 'Direct':
        return '💬'
      default:
        return '📝'
    }
  }

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <span key={i} className={`text-sm ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}>
        ⭐
      </span>
    ))
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
              <h1 className="text-2xl font-bold text-charcoal">Müşteri Yorumları</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setEditingTestimonial(null)
                  setIsEditModalOpen(true)
                }}
                className="bg-sage-500 hover:bg-forest-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Yeni Yorum
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
            <div className="text-2xl font-bold text-charcoal">{testimonials.length}</div>
            <div className="text-gray-custom text-sm">Toplam Yorum</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-green-600">{testimonials.filter(t => t.active).length}</div>
            <div className="text-gray-custom text-sm">Aktif Yorum</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-blue-600">{testimonials.filter(t => t.verified).length}</div>
            <div className="text-gray-custom text-sm">Doğrulanmış</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-soft">
            <div className="text-2xl font-bold text-yellow-600">
              {(testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)}
            </div>
            <div className="text-gray-custom text-sm">Ortalama Puan</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 shadow-soft mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Status</label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value as any)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="all">Alle</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Inaktif</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">Kaynak</label>
                <select
                  value={filterSource}
                  onChange={(e) => setFilterSource(e.target.value as any)}
                  className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                >
                  <option value="all">Alle Quellen</option>
                  <option value="Google">Google</option>
                  <option value="Facebook">Facebook</option>
                  <option value="Direct">Direkt</option>
                </select>
              </div>
            </div>
            
            <div className="text-sm text-gray-custom">
              {filteredTestimonials.length} von {testimonials.length} Bewertungen
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTestimonials.map((testimonial) => (
            <div key={testimonial.id} className={`bg-white rounded-2xl p-6 shadow-soft border-2 transition-all duration-300 hover:shadow-medium ${
              testimonial.active ? 'border-transparent' : 'border-gray-200 opacity-75'
            }`}>
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-sage-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-charcoal">{testimonial.name}</h3>
                      {testimonial.verified && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          ✓ Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-custom">{testimonial.location} • {testimonial.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{getSourceIcon(testimonial.source)}</span>
                  <div className="flex items-center">
                    {renderStars(testimonial.rating)}
                  </div>
                </div>
              </div>

              {/* Service Badge */}
              <div className="mb-4">
                <span className="inline-block bg-sage-100 text-sage-700 px-3 py-1 rounded-full text-sm font-medium">
                  {testimonial.service}
                </span>
              </div>

              {/* Review Text */}
              <p className="text-gray-700 leading-relaxed mb-6 line-clamp-4">
                "{testimonial.text}"
              </p>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleToggleActive(testimonial.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      testimonial.active 
                        ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                    }`}
                  >
                    {testimonial.active ? 'Aktif' : 'Inaktif'}
                  </button>
                  
                  <button
                    onClick={() => handleToggleVerified(testimonial.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                      testimonial.verified 
                        ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {testimonial.verified ? 'Verified' : 'Unverified'}
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(testimonial)}
                    className="p-2 text-sage-600 hover:text-forest-600 hover:bg-sage-50 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTestimonials.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">Keine Bewertungen gefunden</h3>
            <p className="text-gray-custom">Versuchen Sie, die Filter zu ändern oder fügen Sie eine neue Bewertung hinzu.</p>
          </div>
        )}
      </main>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-charcoal">
                  {editingTestimonial ? 'Yorum Düzenle' : 'Yeni Yorum Ekle'}
                </h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <form className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={editingTestimonial?.name || ''}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="z.B. Sarah Müller"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Standort
                  </label>
                  <input
                    type="text"
                    defaultValue={editingTestimonial?.location || ''}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="z.B. Baesweiler"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Hizmet
                  </label>
                  <select
                    defaultValue={editingTestimonial?.service || ''}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    <option>Premium Headspa</option>
                    <option>Aromatherapie</option>
                    <option>Wellness Massage</option>
                    <option>Gesichtspflege</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Bewertung
                  </label>
                  <select
                    defaultValue={editingTestimonial?.rating.toString() || '5'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    <option value="5">5 Sterne</option>
                    <option value="4">4 Sterne</option>
                    <option value="3">3 Sterne</option>
                    <option value="2">2 Sterne</option>
                    <option value="1">1 Stern</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Yorum Metni
                </label>
                <textarea
                  rows={4}
                  defaultValue={editingTestimonial?.text || ''}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  placeholder="Müşteri yorumu..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Kaynak
                  </label>
                  <select
                    defaultValue={editingTestimonial?.source || 'Direct'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  >
                    <option value="Google">Google</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Direct">Direkt</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Datum
                  </label>
                  <input
                    type="text"
                    defaultValue={editingTestimonial?.date || 'vor 1 Tag'}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                    placeholder="z.B. vor 2 Wochen"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={editingTestimonial?.verified || false}
                    className="rounded border-gray-300 text-sage-600 shadow-sm focus:border-sage-300 focus:ring focus:ring-sage-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-charcoal">Verified</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={editingTestimonial?.active ?? true}
                    className="rounded border-gray-300 text-sage-600 shadow-sm focus:border-sage-300 focus:ring focus:ring-sage-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-charcoal">Aktif</span>
                </label>
              </div>

              <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-6 py-3 border border-gray-300 rounded-xl text-charcoal hover:bg-gray-50 transition-colors"
                >
                  İptal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false)
                  }}
                  className="px-6 py-3 bg-sage-500 hover:bg-forest-600 text-white rounded-xl transition-colors"
                >
                  {editingTestimonial ? 'Güncelle' : 'Oluştur'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}