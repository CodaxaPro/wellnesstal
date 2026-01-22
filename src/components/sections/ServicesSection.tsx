'use client'

import { useState, useEffect } from 'react'

interface Service {
  id: string
  title: string
  shortDescription: string
  longDescription: string
  duration: string
  price: string
  benefits: string[]
  popular: boolean
  active: boolean
  order: number
  image: string
  // Button fields
  primaryButtonText?: string
  primaryButtonType?: string
  primaryButtonValue?: string
  primaryButtonMessage?: string
  secondaryButtonText?: string
  secondaryButtonType?: string
  secondaryButtonValue?: string
  secondaryButtonMessage?: string
  // Modal button fields
  primaryModalLeftButtonText?: string
  primaryModalLeftButtonType?: string
  primaryModalLeftButtonValue?: string
  primaryModalRightButtonText?: string
  primaryModalRightButtonType?: string
  primaryModalRightButtonValue?: string
  secondaryModalLeftButtonText?: string
  secondaryModalLeftButtonType?: string
  secondaryModalLeftButtonValue?: string
  secondaryModalRightButtonText?: string
  secondaryModalRightButtonType?: string
  secondaryModalRightButtonValue?: string
}

interface SectionContent {
  badge: string
  sectionTitle: string
  highlightedText: string
  description: string
  cta: {
    visible: boolean
    title: string
    description: string
    primaryButtonText: string
    primaryButtonType: 'phone' | 'whatsapp' | 'url' | 'email'
    primaryButtonLink: string
    secondaryButtonText: string
    secondaryButtonType: 'phone' | 'whatsapp' | 'url' | 'email'
    secondaryButtonLink: string
  }
  styles?: {
    badge?: { color?: string; backgroundColor?: string }
    sectionTitle?: { color?: string; fontSize?: string }
    highlightedText?: { color?: string }
    description?: { color?: string }
    ctaTitle?: { color?: string }
    ctaDescription?: { color?: string }
  }
}

const defaultSectionContent: SectionContent = {
  badge: '✨ Unsere Expertise',
  sectionTitle: 'Professionelle',
  highlightedText: 'Wellness-Behandlungen',
  description: 'Entdecken Sie unser vielfältiges Angebot an entspannenden und regenerierenden Behandlungen, individuell auf Ihre Bedürfnisse abgestimmt.',
  cta: {
    visible: true,
    title: 'Nicht sicher, welche Behandlung zu Ihnen passt?',
    description: 'Unsere Wellness-Experten beraten Sie gerne kostenlos und unverbindlich. Gemeinsam finden wir die perfekte Behandlung für Ihre Bedürfnisse.',
    primaryButtonText: 'Kostenlose Beratung',
    primaryButtonType: 'phone',
    primaryButtonLink: '+491733828581',
    secondaryButtonText: 'WhatsApp Nachricht',
    secondaryButtonType: 'whatsapp',
    secondaryButtonLink: '+491733828581'
  }
}

const ServicesSection = () => {
  const [activeService, setActiveService] = useState<string | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [sectionContent, setSectionContent] = useState<SectionContent>(defaultSectionContent)
  const [modalContent, setModalContent] = useState<{
    title: string
    content: string
    leftButton: {text: string, type: string, value: string}
    rightButton: {text: string, type: string, value: string}
  } | null>(null)

  // Generate button href based on type and value
  const generateButtonHref = (type: string, value: string, message?: string, serviceName?: string) => {
    switch (type) {
      case 'phone':
        return `tel:${value.replace(/\s/g, '')}`
      case 'whatsapp':
        const whatsappMessage = message || (serviceName ?
          `Hallo, ich interessiere mich für ${serviceName}` :
          'Hallo, ich hätte gerne eine Beratung')
        return `https://wa.me/${value.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(whatsappMessage)}`
      case 'email':
        return `mailto:${value}`
      case 'url':
      case 'link':
        if (!value || value.trim() === '') {
          return '#'
        }
        // Ensure URL has protocol
        const trimmedValue = value.trim()
        if (trimmedValue.startsWith('http://') || trimmedValue.startsWith('https://')) {
          return trimmedValue
        }
        return `https://${trimmedValue}`
      case 'page':
        return '#' // Will be handled by click handler
      default:
        return '#'
    }
  }

  // Handle page/modal button clicks
  const handleModalButton = (title: string, content: string, service: Service, buttonType: 'primary' | 'secondary') => {
    const modalData = {
      title,
      content,
      leftButton: buttonType === 'primary' ? {
        text: service.primaryModalLeftButtonText || 'Jetzt anrufen',
        type: service.primaryModalLeftButtonType || 'phone',
        value: service.primaryModalLeftButtonValue || '+491733828581'
      } : {
        text: service.secondaryModalLeftButtonText || 'Jetzt anrufen',
        type: service.secondaryModalLeftButtonType || 'phone',
        value: service.secondaryModalLeftButtonValue || '+491733828581'
      },
      rightButton: buttonType === 'primary' ? {
        text: service.primaryModalRightButtonText || 'WhatsApp schreiben',
        type: service.primaryModalRightButtonType || 'whatsapp',
        value: service.primaryModalRightButtonValue || '+491733828581'
      } : {
        text: service.secondaryModalRightButtonText || 'WhatsApp schreiben',
        type: service.secondaryModalRightButtonType || 'whatsapp',
        value: service.secondaryModalRightButtonValue || '+491733828581'
      }
    }
    setModalContent(modalData)
  }

  // Load services and section content from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch services and section content in parallel
        const [servicesResponse, sectionResponse] = await Promise.all([
          fetch('/api/services?active=true'),
          fetch('/api/content?section=services-section')
        ])

        const servicesData = await servicesResponse.json()
        const sectionData = await sectionResponse.json()

        if (servicesData.success) {
          // Sort by order and filter active services
          const activeServices = servicesData.data
            .filter((service: Service) => service.active)
            .sort((a: Service, b: Service) => a.order - b.order)
          setServices(activeServices)
        }

        if (sectionData.success && sectionData.data?.content) {
          const ctaData = sectionData.data.content.cta || {}
          const apiContent = sectionData.data.content

          setSectionContent({
            // Only use API content if it exists and is not empty, otherwise use empty string
            badge: apiContent.badge && apiContent.badge.trim() !== '' ? apiContent.badge : '',
            sectionTitle: apiContent.sectionTitle && apiContent.sectionTitle.trim() !== '' ? apiContent.sectionTitle : '',
            highlightedText: apiContent.highlightedText && apiContent.highlightedText.trim() !== '' ? apiContent.highlightedText : '',
            description: apiContent.description && apiContent.description.trim() !== '' ? apiContent.description : '',
            images: apiContent.images || [],
            cta: {
              visible: ctaData.visible !== false,
              title: ctaData.title && ctaData.title.trim() !== '' ? ctaData.title : '',
              description: ctaData.description && ctaData.description.trim() !== '' ? ctaData.description : '',
              primaryButtonText: ctaData.primaryButtonText && ctaData.primaryButtonText.trim() !== '' ? ctaData.primaryButtonText : '',
              primaryButtonType: (ctaData.primaryButtonType as 'phone' | 'whatsapp' | 'url' | 'email') || defaultSectionContent.cta.primaryButtonType,
              primaryButtonLink: ctaData.primaryButtonLink && ctaData.primaryButtonLink.trim() !== '' ? ctaData.primaryButtonLink : '',
              secondaryButtonText: ctaData.secondaryButtonText && ctaData.secondaryButtonText.trim() !== '' ? ctaData.secondaryButtonText : '',
              secondaryButtonType: (ctaData.secondaryButtonType as 'phone' | 'whatsapp' | 'url' | 'email') || defaultSectionContent.cta.secondaryButtonType,
              secondaryButtonLink: ctaData.secondaryButtonLink && ctaData.secondaryButtonLink.trim() !== '' ? ctaData.secondaryButtonLink : ''
            },
            styles: apiContent.styles || {}
          })
        }
      } catch (error) {
        console.error('Error fetching data:', error)
        // Fallback to empty array and default content if API fails
        setServices([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Generate gradient colors based on service index
  const getGradientColors = (index: number) => {
    const gradients = [
      'from-sage-400 to-forest-500',
      'from-earth-400 to-sage-500',
      'from-sage-500 to-earth-400',
      'from-forest-400 to-sage-600',
      'from-sage-300 to-forest-400',
      'from-earth-300 to-sage-400'
    ]
    return gradients[index % gradients.length]
  }

  // Service icon mapping - fallback icons for different services
  const getServiceIcon = (title: string) => {
    switch (title.toLowerCase()) {
      case 'premium headspa':
      case 'headspa':
        return (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )
      case 'aromatherapie':
        return (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )
      case 'wellness massage':
      case 'massage':
        return (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        )
      case 'gesichtspflege':
      case 'facial':
        return (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )
      default:
        return (
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
    }
  }

  // Check if image URL is valid (not default or empty)
  const hasValidImage = (imageUrl: string) => {
    return imageUrl &&
           imageUrl !== '/images/default-service.jpg' &&
           (imageUrl.startsWith('http') || imageUrl.startsWith('data:image/'))
  }

  if (isLoading) {
    return (
      <section id="services" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {sectionContent.badge && sectionContent.badge.trim() !== '' && (
              <div
                className="inline-block bg-sage-100 text-sage-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
                style={{
                  color: sectionContent.styles?.badge?.color,
                  backgroundColor: sectionContent.styles?.badge?.backgroundColor
                }}
              >
                {sectionContent.badge}
              </div>
            )}
            {(sectionContent.sectionTitle || sectionContent.highlightedText) && (
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-6"
                style={{ color: sectionContent.styles?.sectionTitle?.color }}
              >
                {sectionContent.sectionTitle && sectionContent.sectionTitle.trim() !== '' && (
                  <>
                    {sectionContent.sectionTitle}{' '}
                  </>
                )}
                {sectionContent.highlightedText && sectionContent.highlightedText.trim() !== '' && (
                  <span
                    className="text-sage-500"
                    style={{ color: sectionContent.styles?.highlightedText?.color }}
                  >
                    {sectionContent.highlightedText}
                  </span>
                )}
              </h2>
            )}
            {sectionContent.description && sectionContent.description.trim() !== '' && (
              <p
                className="text-xl text-gray-custom max-w-3xl mx-auto leading-relaxed"
                style={{ color: sectionContent.styles?.description?.color }}
              >
                {sectionContent.description}
              </p>
            )}
          </div>

          {/* Loading Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-100 rounded-3xl p-8 animate-pulse">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-2xl" />
                    <div>
                      <div className="h-6 bg-gray-200 rounded w-32 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-24" />
                    </div>
                  </div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-6" />
                <div className="flex gap-3">
                  <div className="h-12 bg-gray-200 rounded-xl flex-1" />
                  <div className="h-12 bg-gray-200 rounded-xl flex-1" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (services.length === 0) {
    return (
      <section id="services" className="py-20 lg:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            {sectionContent.badge && sectionContent.badge.trim() !== '' && (
              <div
                className="inline-block bg-sage-100 text-sage-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
                style={{
                  color: sectionContent.styles?.badge?.color,
                  backgroundColor: sectionContent.styles?.badge?.backgroundColor
                }}
              >
                {sectionContent.badge}
              </div>
            )}
            {(sectionContent.sectionTitle || sectionContent.highlightedText) && (
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-6"
                style={{ color: sectionContent.styles?.sectionTitle?.color }}
              >
                {sectionContent.sectionTitle && sectionContent.sectionTitle.trim() !== '' && (
                  <>
                    {sectionContent.sectionTitle}{' '}
                  </>
                )}
                {sectionContent.highlightedText && sectionContent.highlightedText.trim() !== '' && (
                  <span
                    className="text-sage-500"
                    style={{ color: sectionContent.styles?.highlightedText?.color }}
                  >
                    {sectionContent.highlightedText}
                  </span>
                )}
              </h2>
            )}
            {sectionContent.description && sectionContent.description.trim() !== '' && (
              <p
                className="text-xl text-gray-custom max-w-3xl mx-auto leading-relaxed"
                style={{ color: sectionContent.styles?.description?.color }}
              >
                Unsere Hizmetler werden gerade aktualisiert. Bitte kontaktieren Sie uns für weitere Informationen.
              </p>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="services" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-16">
          <div className="text-center mb-6">
            {sectionContent.badge && sectionContent.badge.trim() !== '' && (
              <div
                className="inline-block bg-sage-100 text-sage-700 px-4 py-2 rounded-full text-sm font-medium mb-4"
                style={{
                  color: sectionContent.styles?.badge?.color,
                  backgroundColor: sectionContent.styles?.badge?.backgroundColor
                }}
              >
                {sectionContent.badge}
              </div>
            )}
            {(sectionContent.sectionTitle || sectionContent.highlightedText) && (
              <h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-charcoal mb-6"
                style={{ color: sectionContent.styles?.sectionTitle?.color }}
              >
                {sectionContent.sectionTitle && sectionContent.sectionTitle.trim() !== '' && (
                  <>
                    {sectionContent.sectionTitle}{' '}
                  </>
                )}
                {sectionContent.highlightedText && sectionContent.highlightedText.trim() !== '' && (
                  <span
                    className="text-sage-500"
                    style={{ color: sectionContent.styles?.highlightedText?.color }}
                  >
                    {sectionContent.highlightedText}
                  </span>
                )}
              </h2>
            )}
          </div>
          {sectionContent.description && sectionContent.description.trim() !== '' && (
            <p
              className="text-xl text-gray-custom max-w-3xl mx-auto leading-relaxed text-left"
              style={{ color: sectionContent.styles?.description?.color }}
            >
              {sectionContent.description}
            </p>
          )}
        </div>

        {/* Image Gallery */}
        {sectionContent.images && sectionContent.images.length > 0 && (
          <div className="mb-16">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {sectionContent.images.map((image, index) => {
                const imageUrl = typeof image === 'string' ? image : image.url
                const imageAlt = typeof image === 'string' ? `Resim ${index + 1}` : (image.alt || `Resim ${index + 1}`)

                // Skip rendering if URL is empty or invalid
                if (!imageUrl || imageUrl.trim() === '') {
                  return null
                }

                return (
                  <div
                    key={index}
                    className="relative aspect-square rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl bg-white border border-gray-200"
                  >
                    <img
                      src={imageUrl}
                      alt={imageAlt}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110 p-4"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect fill="%23ddd" width="400" height="400"/%3E%3Ctext fill="%23999" font-family="sans-serif" font-size="16" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EGörsel Yüklenemedi%3C/text%3E%3C/svg%3E'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {services.map((service, index) => (
            <div
              key={service.id}
              className={`group relative bg-white rounded-3xl p-8 shadow-soft hover:shadow-large transition-all duration-500 cursor-pointer border border-transparent hover:border-sage-200 ${
                activeService === service.id ? 'ring-2 ring-sage-500 shadow-large' : ''
              }`}
              onMouseEnter={() => setActiveService(service.id)}
              onMouseLeave={() => setActiveService(null)}
            >
              {/* Popular Badge */}
              {service.popular && (
                <div className="absolute -top-3 left-8">
                  <div className="bg-sage-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                    ⭐ Beliebt
                  </div>
                </div>
              )}

              {/* Service Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {/* Image or Gradient Icon Container */}
                  {hasValidImage(service.image) ? (
                    <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-medium group-hover:scale-110 transition-transform duration-300">
                      <img
                        src={service.image}
                        alt={service.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to gradient if image fails to load
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                          const container = target.parentElement
                          if (container) {
                            container.className = `w-16 h-16 bg-gradient-to-br ${getGradientColors(index)} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-medium`
                            container.innerHTML = `<div>${getServiceIcon(service.title)}</div>`
                          }
                        }}
                      />
                    </div>
                  ) : (
                    <div className={`w-16 h-16 bg-gradient-to-br ${getGradientColors(index)} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 transition-transform duration-300 shadow-medium`}>
                      {getServiceIcon(service.title)}
                    </div>
                  )}

                  <div>
                    <h3 className="text-2xl font-bold text-charcoal group-hover:text-sage-600 transition-colors">
                      {service.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-gray-custom">{service.duration}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="text-sm font-semibold text-sage-600">{service.price}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Description */}
              <div
                className="text-gray-custom leading-relaxed mb-6"
                dangerouslySetInnerHTML={{
                  __html: activeService === service.id ? service.longDescription : service.shortDescription
                }}
              />

              {/* Benefits */}
              {activeService === service.id && service.benefits && service.benefits.length > 0 && (
                <div className="mb-6 animate-fade-in">
                  <h4 className="font-semibold text-charcoal mb-3">Ihre Vorteile:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {service.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-sage-500 rounded-full" />
                        <span className="text-sm text-gray-custom">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons - Dynamic */}
              <div className="flex flex-col sm:flex-row gap-3">
                {/* Primary Button */}
                {service.primaryButtonText && service.primaryButtonValue && (
                  service.primaryButtonType === 'page' ? (
                    <button
                      onClick={() => handleModalButton(service.title, service.primaryButtonValue || '', service, 'primary')}
                      className="flex-1 bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-medium hover:-translate-y-1 text-center"
                    >
                      {service.primaryButtonText}
                    </button>
                  ) : (
                    <a
                      href={generateButtonHref(
                        service.primaryButtonType || '',
                        service.primaryButtonValue,
                        service.primaryButtonMessage,
                        service.title
                      )}
                      target={service.primaryButtonType === 'link' ? '_blank' : '_self'}
                      rel={service.primaryButtonType === 'link' ? 'noopener noreferrer' : undefined}
                      className="flex-1 bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-medium hover:-translate-y-1 text-center"
                    >
                      {service.primaryButtonText}
                    </a>
                  )
                )}

                {/* Secondary Button */}
                {service.secondaryButtonText && service.secondaryButtonValue && (
                  service.secondaryButtonType === 'page' ? (
                    <button
                      onClick={() => handleModalButton(service.title, service.secondaryButtonValue || '', service, 'secondary')}
                      className="flex-1 border-2 border-sage-500 text-sage-500 hover:bg-sage-500 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 text-center"
                    >
                      {service.secondaryButtonText}
                    </button>
                  ) : (
                    <a
                      href={generateButtonHref(
                        service.secondaryButtonType || '',
                        service.secondaryButtonValue,
                        service.secondaryButtonMessage,
                        service.title
                      )}
                      target={service.secondaryButtonType === 'link' ? '_blank' : '_self'}
                      rel={service.secondaryButtonType === 'link' ? 'noopener noreferrer' : undefined}
                      className="flex-1 border-2 border-sage-500 text-sage-500 hover:bg-sage-500 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 text-center"
                    >
                      {service.secondaryButtonText}
                    </a>
                  )
                )}

                {/* Fallback buttons if no custom buttons configured */}
                {(!service.primaryButtonText || !service.primaryButtonValue) && (
                  <>
                    <a
                      href="tel:+491733828581"
                      className="flex-1 bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-medium hover:-translate-y-1 text-center"
                    >
                      Jetzt buchen
                    </a>
                    <a
                      href="#"
                      className="flex-1 border-2 border-sage-500 text-sage-500 hover:bg-sage-500 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 text-center"
                    >
                      Mehr Details
                    </a>
                  </>
                )}
              </div>

              {/* Hover Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-sage-50 to-earth-50 rounded-3xl opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10" />
            </div>
          ))}
        </div>

        {/* CTA Section - Only render if visible */}
        {sectionContent.cta.visible && (
        <div className="mt-16 text-center">
          <div className="bg-sage-50 rounded-3xl p-8 lg:p-12">
            <h3
              className="text-2xl lg:text-3xl font-bold text-charcoal mb-4"
              style={{ color: sectionContent.styles?.ctaTitle?.color }}
            >
              {sectionContent.cta.title}
            </h3>
            <p
              className="text-gray-custom mb-8 max-w-2xl mx-auto"
              style={{ color: sectionContent.styles?.ctaDescription?.color }}
            >
              {sectionContent.cta.description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={generateButtonHref(sectionContent.cta.primaryButtonType, sectionContent.cta.primaryButtonLink)}
                target={sectionContent.cta.primaryButtonType === 'url' ? '_blank' : '_self'}
                rel={sectionContent.cta.primaryButtonType === 'url' ? 'noopener noreferrer' : undefined}
                className="bg-sage-500 hover:bg-forest-600 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-medium hover:-translate-y-1 flex items-center justify-center gap-2"
              >
                {sectionContent.cta.primaryButtonType === 'phone' && (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                )}
                {sectionContent.cta.primaryButtonType === 'whatsapp' && (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                )}
                {sectionContent.cta.primaryButtonType === 'email' && (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                {sectionContent.cta.primaryButtonType === 'url' && (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )}
                {sectionContent.cta.primaryButtonText}
              </a>
              <a
                href={generateButtonHref(sectionContent.cta.secondaryButtonType, sectionContent.cta.secondaryButtonLink)}
                target={sectionContent.cta.secondaryButtonType === 'url' ? '_blank' : '_self'}
                rel={sectionContent.cta.secondaryButtonType === 'url' ? 'noopener noreferrer' : undefined}
                className="border-2 border-sage-500 text-sage-500 hover:bg-sage-500 hover:text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2"
              >
                {sectionContent.cta.secondaryButtonType === 'phone' && (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                )}
                {sectionContent.cta.secondaryButtonType === 'whatsapp' && (
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                )}
                {sectionContent.cta.secondaryButtonType === 'email' && (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )}
                {sectionContent.cta.secondaryButtonType === 'url' && (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                )}
                {sectionContent.cta.secondaryButtonText}
              </a>
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Modal for page content */}
      {modalContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-charcoal">
                  {modalContent.title}
                </h2>
                <button
                  onClick={() => setModalContent(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6">
              <div
                className="prose prose-sage max-w-none"
                dangerouslySetInnerHTML={{ __html: modalContent.content }}
              />

              {/* Contact buttons in modal */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row gap-3">
                  <a
                    href={generateButtonHref(modalContent.leftButton.type, modalContent.leftButton.value, undefined, modalContent.title)}
                    target={modalContent.leftButton.type === 'link' ? '_blank' : '_self'}
                    rel={modalContent.leftButton.type === 'link' ? 'noopener noreferrer' : undefined}
                    className="flex-1 bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 text-center"
                  >
                    {modalContent.leftButton.text}
                  </a>
                  <a
                    href={generateButtonHref(modalContent.rightButton.type, modalContent.rightButton.value, undefined, modalContent.title)}
                    target={modalContent.rightButton.type === 'link' ? '_blank' : '_self'}
                    rel={modalContent.rightButton.type === 'link' ? 'noopener noreferrer' : undefined}
                    className="flex-1 border-2 border-sage-500 text-sage-500 hover:bg-sage-500 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 text-center"
                  >
                    {modalContent.rightButton.text}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}

export default ServicesSection
