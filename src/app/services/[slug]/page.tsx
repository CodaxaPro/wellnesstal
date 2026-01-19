'use client'

import { useState, useEffect, use } from 'react'

import PageLoader from '@/components/ui/PageLoader'

interface ServicePageProps {
  params: Promise<{
    slug: string
  }>
}

// Service type extended for landing page
interface ServiceLandingPage {
  id: string
  title: string
  slug: string
  shortDescription: string
  longDescription: string
  price: string
  duration: string
  category: string
  images: string[]
  benefits: string[]
  features: {
    title: string
    description: string
    icon: string
  }[]
  seo: {
    title: string
    description: string
    keywords: string[]
  }
  active: boolean
  createdAt: string
  updatedAt: string
}

export default function ServiceLandingPage({ params }: ServicePageProps) {
  const resolvedParams = use(params)
  const [service, setService] = useState<ServiceLandingPage | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchService() {
      try {
        const response = await fetch(`/api/services?slug=${resolvedParams.slug}`)
        const result = await response.json()
        
        if (result.success && result.data) {
          setService(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch service:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchService()
  }, [resolvedParams.slug])

  if (loading) {
    return <PageLoader brandName="WellnessTal" />
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-charcoal mb-4">Service nicht gefunden</h1>
          <a href="/" className="text-sage-600 hover:text-forest-600">Zurück zur Startseite</a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero Section */}
      <section className="relative bg-white overflow-hidden">
        <div className="absolute inset-0">
          {service.images?.[0] && (
            <img 
              src={service.images[0]} 
              alt={service.title}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-40" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center text-white">
            {/* Breadcrumb */}
            <nav className="mb-8">
              <a href="/" className="text-white/80 hover:text-white">Start</a>
              <span className="mx-2">/</span>
              <a href="/#services" className="text-white/80 hover:text-white">Services</a>
              <span className="mx-2">/</span>
              <span>{service.title}</span>
            </nav>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              {service.title}
            </h1>
            
            <p className="text-xl lg:text-2xl max-w-3xl mx-auto mb-8 text-white/90">
              {service.shortDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-8">
              <div className="flex items-center text-white/90">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {service.duration}
              </div>
              <div className="hidden sm:block w-1 h-1 bg-white/50 rounded-full" />
              <div className="flex items-center text-white/90">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
                ab {service.price}€
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="tel:+491733828581"
                className="bg-sage-500 hover:bg-forest-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-medium hover:-translate-y-1"
              >
                Jetzt buchen
              </a>
              <button 
                className="border-2 border-white text-white hover:bg-white hover:text-charcoal px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300"
                onClick={() => {
                  const element = document.getElementById('details')
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth' })
                  }
                }}
              >
                Mehr erfahren
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Details */}
      <section id="details" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div className="inline-block bg-sage-100 text-sage-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
                {service.category}
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-6">
                Über diese Behandlung
              </h2>
              
              {service.longDescription && (
                <div className="text-lg text-gray-custom leading-relaxed space-y-4">
                  {service.longDescription.split('\n')
                    .filter(paragraph => paragraph.trim())
                    .map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {service.images?.slice(1, 5).map((image, index) => (
                <div key={index} className="aspect-square rounded-2xl overflow-hidden">
                  <img 
                    src={image} 
                    alt={`${service.title} ${index + 2}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      {service.benefits && service.benefits.length > 0 && (
        <section className="py-20 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-6">
                Ihre Vorteile
              </h2>
              <p className="text-xl text-gray-custom max-w-3xl mx-auto">
                Entdecken Sie die vielfältigen Vorteile unserer {service.title} Behandlung
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <svg className="h-8 w-8 text-sage-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-lg font-medium text-charcoal">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features */}
      {service.features && service.features.length > 0 && (
        <section className="py-20 lg:py-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-6">
                Was Sie erwartet
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-6">
                  <div className="w-12 h-12 bg-sage-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">{feature.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-charcoal mb-3">{feature.title}</h3>
                    <p className="text-gray-custom leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-sage-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-6">
            Bereit für Entspannung?
          </h2>
          <p className="text-xl text-gray-custom max-w-3xl mx-auto mb-12">
            Buchen Sie jetzt Ihre {service.title} Behandlung und gönnen Sie sich eine Auszeit vom Alltag
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <a 
              href="tel:+491733828581"
              className="bg-sage-500 hover:bg-forest-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 hover:shadow-medium hover:-translate-y-1 flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Telefon: +49 1733828581
            </a>
            <a 
              href="https://wa.me/491733828581"
              className="border-2 border-sage-500 text-sage-500 hover:bg-sage-500 hover:text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
              </svg>
              WhatsApp
            </a>
          </div>
          
          <div className="mt-12 p-8 bg-white rounded-2xl shadow-soft">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-sage-600 mb-2">{service.duration.replace(' Min', '')}</div>
                <div className="text-sm text-gray-custom">Minuten</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-sage-600 mb-2">ab {service.price}€</div>
                <div className="text-sm text-gray-custom">Preis</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-sage-600 mb-2">5★</div>
                <div className="text-sm text-gray-custom">Bewertung</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}