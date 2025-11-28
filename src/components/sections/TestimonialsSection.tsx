'use client'

import { useState, useEffect } from 'react'

interface StyleConfig {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
}

interface StatItem {
  value: string
  label: string
}

interface SectionContent {
  badge: string
  sectionTitle: string
  highlightedText: string
  description: string
  autoSlideDelay: number
  showRatings: boolean
  maxDisplayCount: number
  stats?: StatItem[]
  styles?: {
    badge?: StyleConfig
    sectionTitle?: StyleConfig
    highlightedText?: StyleConfig
    description?: StyleConfig
    statsValue?: StyleConfig
    statsLabel?: StyleConfig
  }
}

const defaultSectionContent: SectionContent = {
  badge: '💬 Kundenstimmen',
  sectionTitle: 'Was unsere Kunden',
  highlightedText: 'sagen',
  description: 'Echte Bewertungen von zufriedenen Kunden - Ihre Meinung ist uns wichtig',
  autoSlideDelay: 5000,
  showRatings: true,
  maxDisplayCount: 5,
  stats: [
    { value: '500+', label: 'Zufriedene Kunden' },
    { value: '4.9', label: '⭐ Google Bewertung' },
    { value: '98%', label: 'Weiterempfehlung' },
    { value: '5J', label: 'Erfahrung' }
  ],
  styles: {
    badge: {
      fontFamily: 'system-ui',
      fontSize: '14px',
      fontWeight: '500',
      color: '#637554',
      backgroundColor: '#eef1ea'
    },
    sectionTitle: {
      fontFamily: 'system-ui',
      fontSize: '48px',
      fontWeight: '700',
      color: '#2C2C2C'
    },
    highlightedText: {
      fontFamily: 'system-ui',
      fontSize: '48px',
      fontWeight: '700',
      color: '#9CAF88'
    },
    description: {
      fontFamily: 'system-ui',
      fontSize: '20px',
      fontWeight: '400',
      color: '#666666'
    },
    statsValue: {
      fontFamily: 'system-ui',
      fontSize: '36px',
      fontWeight: '700',
      color: '#9CAF88'
    },
    statsLabel: {
      fontFamily: 'system-ui',
      fontSize: '16px',
      fontWeight: '500',
      color: '#666666'
    }
  }
}

const TestimonialsSection = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [sectionContent, setSectionContent] = useState<SectionContent>(defaultSectionContent)
  const [loading, setLoading] = useState(true)

  // Fetch section content from API
  useEffect(() => {
    const fetchSectionContent = async () => {
      try {
        const response = await fetch('/api/content?section=testimonials-section')
        const data = await response.json()
        if (data.success && data.data?.content) {
          setSectionContent({
            ...defaultSectionContent,
            ...data.data.content,
            styles: {
              ...defaultSectionContent.styles,
              ...data.data.content.styles
            }
          })
        }
      } catch (error) {
        console.error('Failed to fetch testimonials section content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSectionContent()
  }, [])

  const testimonials = [
    {
      id: 1,
      name: "Sarah Müller",
      location: "Köln",
      avatar: "SM",
      rating: 5,
      date: "vor 2 Wochen",
      service: "Premium Headspa",
      text: "Absolut entspannende Erfahrung! Die Headspa-Behandlung war genau das, was ich nach einem stressigen Arbeitstag gebraucht habe. Das Team ist sehr professionell und die Atmosphäre lädt zum Abschalten ein. Ich komme definitiv wieder!",
      verified: true,
      source: "Google"
    },
    {
      id: 2,
      name: "Michael Klein",
      location: "Düsseldorf", 
      avatar: "MK",
      rating: 5,
      date: "vor 1 Woche",
      service: "Wellness Massage",
      text: "Die Atmosphäre ist wunderbar entspannend und die Behandlungen sind erstklassig. Meine Verspannungen sind wie weggeblasen. Ich komme regelmäßig hierher und kann Wellnesstal nur empfehlen! Beste Wellness-Oase in Köln.",
      verified: true,
      source: "Google"
    },
    {
      id: 3,
      name: "Anna Berg",
      location: "Bonn",
      avatar: "AB",
      rating: 5,
      date: "vor 3 Tagen",
      service: "Aromatherapie",
      text: "Endlich ein Ort, wo ich komplett abschalten kann. Die Aromatherapie-Behandlung war ein Traum - die Düfte waren himmlisch und ich bin völlig entspannt nach Hause gefahren. Vielen Dank für diese wundervolle Erfahrung!",
      verified: true,
      source: "Facebook"
    },
    {
      id: 4,
      name: "Thomas Schmidt",
      location: "Köln",
      avatar: "TS",
      rating: 5,
      date: "vor 4 Tagen",
      service: "Gesichtspflege",
      text: "Als Mann war ich zunächst skeptisch, aber das Team hat mich sofort wohlgefühlt. Die Gesichtsbehandlung war fantastisch und meine Haut fühlt sich seitdem viel besser an. Sehr professionell und diskret!",
      verified: true,
      source: "Google"
    },
    {
      id: 5,
      name: "Lisa Wagner",
      location: "Leverkusen",
      avatar: "LW",
      rating: 5,
      date: "vor 5 Tagen",
      service: "Premium Headspa",
      text: "Ich war zum ersten Mal bei einer Headspa-Behandlung und bin total begeistert! Die Kopfhautmassage war so entspannend und die verwendeten Öle haben einen tollen Duft. Kann ich nur weiterempfehlen!",
      verified: true,
      source: "Google"
    }
  ]

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, sectionContent.autoSlideDelay)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length, sectionContent.autoSlideDelay])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoPlaying(false)
  }

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index)
    setIsAutoPlaying(false)
  }

  if (loading) {
    return (
      <section className="py-20 lg:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-pulse">
            <div className="h-8 bg-sage-200 rounded-full w-40 mx-auto mb-4"></div>
            <div className="h-12 bg-sage-200 rounded w-80 mx-auto mb-6"></div>
            <div className="h-6 bg-sage-100 rounded w-96 mx-auto"></div>
          </div>
          <div className="relative max-w-4xl mx-auto mb-12 animate-pulse">
            <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-large">
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-sage-200 rounded-full"></div>
                  <div>
                    <div className="h-6 bg-sage-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-sage-100 rounded w-48"></div>
                  </div>
                </div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-5 h-5 bg-sage-200 rounded"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                <div className="h-5 bg-sage-100 rounded w-full"></div>
                <div className="h-5 bg-sage-100 rounded w-full"></div>
                <div className="h-5 bg-sage-100 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 lg:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="inline-block px-4 py-2 rounded-full mb-4"
            style={{
              fontFamily: sectionContent.styles?.badge?.fontFamily,
              fontSize: sectionContent.styles?.badge?.fontSize,
              fontWeight: sectionContent.styles?.badge?.fontWeight as any,
              color: sectionContent.styles?.badge?.color,
              backgroundColor: sectionContent.styles?.badge?.backgroundColor
            }}
          >
            {sectionContent.badge}
          </div>
          <h2 className="mb-6">
            <span
              style={{
                fontFamily: sectionContent.styles?.sectionTitle?.fontFamily,
                fontSize: sectionContent.styles?.sectionTitle?.fontSize,
                fontWeight: sectionContent.styles?.sectionTitle?.fontWeight as any,
                color: sectionContent.styles?.sectionTitle?.color
              }}
            >
              {sectionContent.sectionTitle}{' '}
            </span>
            <span
              style={{
                fontFamily: sectionContent.styles?.highlightedText?.fontFamily,
                fontSize: sectionContent.styles?.highlightedText?.fontSize,
                fontWeight: sectionContent.styles?.highlightedText?.fontWeight as any,
                color: sectionContent.styles?.highlightedText?.color
              }}
            >
              {sectionContent.highlightedText}
            </span>
          </h2>
          <p
            className="max-w-3xl mx-auto"
            style={{
              fontFamily: sectionContent.styles?.description?.fontFamily,
              fontSize: sectionContent.styles?.description?.fontSize,
              fontWeight: sectionContent.styles?.description?.fontWeight as any,
              color: sectionContent.styles?.description?.color
            }}
          >
            {sectionContent.description}
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto mb-12">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-large relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-sage-100 rounded-full -translate-y-16 translate-x-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-earth-100 rounded-full translate-y-12 -translate-x-12 opacity-50"></div>

            {/* Quote Icon */}
            <div className="absolute top-8 left-8 text-6xl text-sage-200 font-serif">"</div>

            <div className="relative z-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-sage-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-medium">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-charcoal">
                        {testimonials[currentTestimonial].name}
                      </h3>
                      {testimonials[currentTestimonial].verified && (
                        <div className="flex items-center bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">
                          <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          Verifiziert
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-custom">
                      <span>📍 {testimonials[currentTestimonial].location}</span>
                      <span>•</span>
                      <span>{testimonials[currentTestimonial].date}</span>
                      <span>•</span>
                      <span className="text-sage-600 font-medium">{testimonials[currentTestimonial].service}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500 ml-2">
                    {testimonials[currentTestimonial].source}
                  </span>
                </div>
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed italic mb-8 font-light">
                {testimonials[currentTestimonial].text}
              </blockquote>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-sage-50 rounded-full shadow-medium flex items-center justify-center text-sage-600 hover:text-sage-700 transition-all duration-300 hover:scale-110"
            aria-label="Vorheriges Testimonial"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white hover:bg-sage-50 rounded-full shadow-medium flex items-center justify-center text-sage-600 hover:text-sage-700 transition-all duration-300 hover:scale-110"
            aria-label="Nächstes Testimonial"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Testimonial Dots */}
        <div className="flex justify-center gap-3 mb-12">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToTestimonial(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentTestimonial 
                  ? 'bg-sage-500 w-8' 
                  : 'bg-sage-200 hover:bg-sage-300'
              }`}
              aria-label={`Zu Testimonial ${index + 1} springen`}
            />
          ))}
        </div>

        {/* Smaller Testimonial Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.filter((_, index) => index !== currentTestimonial).slice(0, 3).map((testimonial, index) => (
            <div 
              key={testimonial.id}
              className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer hover:-translate-y-1"
              onClick={() => goToTestimonial(testimonials.findIndex(t => t.id === testimonial.id))}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-sage-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-semibold text-charcoal text-sm">{testimonial.name}</h4>
                  <p className="text-xs text-gray-custom">{testimonial.location}</p>
                </div>
              </div>
              
              <div className="flex mb-3">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              
              <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                {testimonial.text.length > 100 ? `${testimonial.text.substring(0, 100)}...` : testimonial.text}
              </p>
              
              <div className="mt-3 text-xs text-sage-600 font-medium">
                {testimonial.service}
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-3xl p-8 lg:p-12 shadow-large">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {(sectionContent.stats || defaultSectionContent.stats)?.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className="text-3xl lg:text-4xl font-bold text-sage-600 mb-2"
                  style={{
                    fontFamily: sectionContent.styles?.statsValue?.fontFamily || defaultSectionContent.styles?.statsValue?.fontFamily,
                    fontSize: sectionContent.styles?.statsValue?.fontSize || undefined,
                    fontWeight: sectionContent.styles?.statsValue?.fontWeight as any || undefined,
                    color: sectionContent.styles?.statsValue?.color || undefined
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-gray-custom font-medium"
                  style={{
                    fontFamily: sectionContent.styles?.statsLabel?.fontFamily || defaultSectionContent.styles?.statsLabel?.fontFamily,
                    fontSize: sectionContent.styles?.statsLabel?.fontSize || undefined,
                    fontWeight: sectionContent.styles?.statsLabel?.fontWeight as any || undefined,
                    color: sectionContent.styles?.statsLabel?.color || undefined
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection