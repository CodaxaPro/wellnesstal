'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { BlockProps, TestimonialsContent } from './types'

// Style interfaces - Ana sayfadaki ile aynı
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

interface TestimonialsBlockStyles {
  badge?: StyleConfig
  sectionTitle?: StyleConfig
  highlightedText?: StyleConfig
  description?: StyleConfig
  statsValue?: StyleConfig
  statsLabel?: StyleConfig
}

// Default styles - Ana sayfadaki ile aynı
const defaultStyles: TestimonialsBlockStyles = {
  badge: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '14px',
    fontWeight: '500',
    color: '#637554',
    backgroundColor: '#eef1ea'
  },
  sectionTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '48px',
    fontWeight: '700',
    color: '#2C2C2C'
  },
  highlightedText: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '48px',
    fontWeight: '700',
    color: '#9CAF88'
  },
  description: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '20px',
    fontWeight: '400',
    color: '#666666'
  },
  statsValue: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '36px',
    fontWeight: '700',
    color: '#9CAF88'
  },
  statsLabel: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '16px',
    fontWeight: '500',
    color: '#666666'
  }
}

export default function TestimonialsBlock({ block }: BlockProps) {
  const content = block.content as TestimonialsContent & {
    badge?: string
    sectionTitle?: string
    highlightedText?: string
    description?: string
    autoSlideDelay?: number
    showRatings?: boolean
    maxDisplayCount?: number
    stats?: StatItem[]
    styles?: TestimonialsBlockStyles
  }
  
  const testimonials = content.testimonials || []
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(content.autoPlay !== false)

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || testimonials.length === 0 || content.autoPlay === false) return

    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, content.autoSlideDelay || 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, testimonials.length, content.autoSlideDelay])

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

  // Get testimonial avatar initials
  const getAvatarInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase()
  }

  // Merge styles with defaults
  const styles = {
    badge: { ...defaultStyles.badge, ...content.styles?.badge },
    sectionTitle: { ...defaultStyles.sectionTitle, ...content.styles?.sectionTitle },
    highlightedText: { ...defaultStyles.highlightedText, ...content.styles?.highlightedText },
    description: { ...defaultStyles.description, ...content.styles?.description },
    statsValue: { ...defaultStyles.statsValue, ...content.styles?.statsValue },
    statsLabel: { ...defaultStyles.statsLabel, ...content.styles?.statsLabel }
  }

  const badge = content.badge || '💬 Kundenstimmen'
  const sectionTitle = content.sectionTitle || content.title || 'Was unsere Kunden'
  const highlightedText = content.highlightedText || 'sagen'
  const description = content.description || content.subtitle || 'Echte Bewertungen von zufriedenen Kunden - Ihre Meinung ist uns wichtig'
  
  // Default stats - Ana sayfadaki gibi
  const defaultStats = [
    { value: '500+', label: 'Zufriedene Kunden' },
    { value: '4.9', label: '⭐ Google Bewertung' },
    { value: '98%', label: 'Weiterempfehlung' },
    { value: '5J', label: 'Erfahrung' }
  ]
  const stats = content.stats && content.stats.length > 0 ? content.stats : defaultStats

  const sectionBgColor = content.background?.color || '#F7F5F3'

  if (testimonials.length === 0) {
    return (
      <section className="py-20 lg:py-32" style={{ backgroundColor: sectionBgColor }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-400">Henüz yorum eklenmedi</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 lg:py-32" style={{ backgroundColor: sectionBgColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header - Ana sayfadaki gibi */}
        <div className="text-center mb-16">
          {/* Badge */}
          <div
            className="inline-block px-4 py-2 rounded-full mb-4"
            style={{
              fontFamily: styles.badge?.fontFamily,
              fontSize: styles.badge?.fontSize,
              fontWeight: styles.badge?.fontWeight as any,
              color: styles.badge?.color,
              backgroundColor: styles.badge?.backgroundColor
            }}
          >
            {badge}
          </div>
          
          {/* Section Title */}
          <h2 className="mb-6">
            <span
              style={{
                fontFamily: styles.sectionTitle?.fontFamily,
                fontSize: styles.sectionTitle?.fontSize,
                fontWeight: styles.sectionTitle?.fontWeight as any,
                color: styles.sectionTitle?.color
              }}
            >
              {sectionTitle}{' '}
            </span>
            <span
              style={{
                fontFamily: styles.highlightedText?.fontFamily,
                fontSize: styles.highlightedText?.fontSize,
                fontWeight: styles.highlightedText?.fontWeight as any,
                color: styles.highlightedText?.color
              }}
            >
              {highlightedText}
            </span>
            </h2>
          
          {/* Description */}
          <p
            className="max-w-3xl mx-auto"
            style={{
              fontFamily: styles.description?.fontFamily,
              fontSize: styles.description?.fontSize,
              fontWeight: styles.description?.fontWeight as any,
              color: styles.description?.color
            }}
          >
            {description}
          </p>
        </div>

        {/* Main Testimonial Display - Ana sayfadaki gibi */}
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
                    {testimonials[currentTestimonial]?.avatar ? (
                      <div className="relative w-full h-full rounded-full overflow-hidden">
                        <Image
                          src={testimonials[currentTestimonial].avatar!}
                          alt={testimonials[currentTestimonial]?.name || 'Testimonial'}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      getAvatarInitials(testimonials[currentTestimonial]?.name || '')
            )}
          </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xl font-bold text-charcoal">
                        {testimonials[currentTestimonial]?.name || 'Anonym'}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-custom">
                      {testimonials[currentTestimonial]?.role && (
                        <>
                          <span>📍 {testimonials[currentTestimonial].role}</span>
                          {testimonials[currentTestimonial]?.company && (
                            <>
                              <span>•</span>
                              <span className="text-sage-600 font-medium">{testimonials[currentTestimonial].company}</span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Rating */}
                {testimonials[currentTestimonial]?.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <svg key={i} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Testimonial Text */}
              <blockquote className="text-lg lg:text-xl text-gray-700 leading-relaxed italic mb-8 font-light">
                "{testimonials[currentTestimonial]?.content || 'Kein Text verfügbar'}"
              </blockquote>
            </div>
          </div>

          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
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
            </>
          )}
        </div>

        {/* Testimonial Dots */}
        {testimonials.length > 1 && (
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
                )}

        {/* Smaller Testimonial Cards - Ana sayfadaki gibi */}
        {testimonials.length > 1 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials
              .filter((_, index) => index !== currentTestimonial)
              .slice(0, 3)
              .map((testimonial, index) => {
                const originalIndex = testimonials.findIndex(t => t.id === testimonial.id)
                return (
                  <div 
                    key={testimonial.id}
                    className="bg-white p-6 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300 cursor-pointer hover:-translate-y-1"
                    onClick={() => goToTestimonial(originalIndex)}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-sage-400 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                  {testimonial.avatar ? (
                          <div className="relative w-full h-full rounded-full overflow-hidden">
                      <Image
                        src={testimonial.avatar}
                        alt={testimonial.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                          getAvatarInitials(testimonial.name)
                        )}
                      </div>
                      <div>
                        <h4 className="font-semibold text-charcoal text-sm">{testimonial.name}</h4>
                        {testimonial.role && (
                          <p className="text-xs text-gray-custom">{testimonial.role}</p>
                        )}
                      </div>
                    </div>
                    
                    {testimonial.rating && (
                      <div className="flex mb-3">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                    </div>
                  )}
                    
                    <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                      {testimonial.content && testimonial.content.length > 100 
                        ? `${testimonial.content.substring(0, 100)}...` 
                        : (testimonial.content || '')}
                    </p>
                    
                    {testimonial.company && (
                      <div className="mt-3 text-xs text-sage-600 font-medium">
                        {testimonial.company}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        )}

        {/* Stats Section - Ana sayfadaki gibi */}
        <div className="mt-16 bg-white rounded-3xl p-8 lg:p-12 shadow-large">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div
                  className="text-3xl lg:text-4xl font-bold text-sage-600 mb-2"
                  style={{
                    fontFamily: styles.statsValue?.fontFamily || defaultStyles.statsValue?.fontFamily,
                    fontSize: styles.statsValue?.fontSize || defaultStyles.statsValue?.fontSize,
                    fontWeight: (styles.statsValue?.fontWeight as any) || defaultStyles.statsValue?.fontWeight,
                    color: styles.statsValue?.color || defaultStyles.statsValue?.color
                  }}
                >
                  {stat.value}
                </div>
                <div
                  className="text-gray-custom font-medium"
                  style={{
                    fontFamily: styles.statsLabel?.fontFamily || defaultStyles.statsLabel?.fontFamily,
                    fontSize: styles.statsLabel?.fontSize || defaultStyles.statsLabel?.fontSize,
                    fontWeight: (styles.statsLabel?.fontWeight as any) || defaultStyles.statsLabel?.fontWeight,
                    color: styles.statsLabel?.color || defaultStyles.statsLabel?.color
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
