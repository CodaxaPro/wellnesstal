'use client'

import { useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

// Style interface
interface TextStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
}

interface HeroStyles {
  badge?: TextStyle
  mainTitle?: TextStyle
  highlightedText?: TextStyle
  subtitle?: TextStyle
  primaryButton?: TextStyle
  secondaryButton?: TextStyle
  trustIndicator?: TextStyle
}

interface HeroImage {
  url: string
  alt: string
}

interface HeroImageStyles {
  borderRadius?: string
  boxShadow?: string
  opacity?: string
  hoverScale?: string
  brightness?: string
  contrast?: string
  saturation?: string
  overlayOpacity?: string
  overlayColor?: string
}

interface ImageFloatingElements {
  statusBadge?: {
    enabled?: boolean
    text?: string
    position?: {
      vertical: 'top' | 'center' | 'bottom'
      horizontal: 'left' | 'center' | 'right'
    }
  }
  premiumCard?: {
    enabled?: boolean
    emoji?: string
    title?: string
    subtitle?: string
    position?: {
      vertical: 'top' | 'center' | 'bottom'
      horizontal: 'left' | 'center' | 'right'
    }
  }
  reviewsBadge?: {
    enabled?: boolean
    rating?: string
    text?: string
    position?: {
      vertical: 'top' | 'center' | 'bottom'
      horizontal: 'left' | 'center' | 'right'
    }
  }
}

interface HeroContent {
  mainTitle: string
  subtitle: string
  primaryButton: string
  primaryButtonLink: string
  secondaryButton: string
  secondaryButtonLink: string
  trustIndicator?: string
  trustIndicatorSubtext?: string
  trustIndicatorSecondary?: string
  trustIndicatorSecondarySubtext?: string
  badge: string
  image?: HeroImage
  imageStyles?: HeroImageStyles
  imageFloatingElements?: ImageFloatingElements
  styles?: HeroStyles
}

// Default image
const defaultImage: HeroImage = {
  url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
  alt: 'Entspannende Spa-Behandlung bei Wellnesstal'
}

// Default image styles
const defaultImageStyles: HeroImageStyles = {
  borderRadius: '24px',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  opacity: '100',
  hoverScale: '105',
  brightness: '100',
  contrast: '100',
  saturation: '100',
  overlayOpacity: '20',
  overlayColor: '#2C2C2C'
}

// Orijinal stiller - Tailwind class'larından alındı
const defaultStyles: HeroStyles = {
  badge: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '500',
    color: '#637554',      // sage-700
    backgroundColor: '#eef1ea'  // sage-100
  },
  mainTitle: {
    fontFamily: 'system-ui',
    fontSize: '72px',
    fontWeight: '700',
    color: '#2C2C2C'       // charcoal
  },
  highlightedText: {
    fontFamily: 'system-ui',
    fontSize: '72px',
    fontWeight: '700',
    color: '#9CAF88'       // sage-500
  },
  subtitle: {
    fontFamily: 'system-ui',
    fontSize: '24px',
    fontWeight: '400',
    color: '#666666'       // gray-custom
  },
  primaryButton: {
    fontFamily: 'system-ui',
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#9CAF88'  // sage-500
  },
  secondaryButton: {
    fontFamily: 'system-ui',
    fontSize: '18px',
    fontWeight: '600',
    color: '#9CAF88',      // sage-500
    borderColor: '#9CAF88' // sage-500
  },
  trustIndicator: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2C2C2C'       // charcoal
  }
}

const defaultContent: HeroContent = {
  mainTitle: 'Wellness & Entspannung in Baesweiler',
  subtitle: 'Entdecken Sie professionelle Headspa-Behandlungen und Wellness-Therapien für Ihr körperliches und seelisches Wohlbefinden.',
  primaryButton: 'Jetzt anrufen',
  primaryButtonLink: 'tel:+491733828581',
  secondaryButton: 'Leistungen entdecken',
  secondaryButtonLink: '#services',
  trustIndicator: '500+ zufriedene Kunden',
  trustIndicatorSubtext: '⭐ 4.9/5 Bewertungen',
  trustIndicatorSecondary: 'Kostenlose Beratung',
  trustIndicatorSecondarySubtext: 'Unverbindlich & persönlich',
  badge: '🌿 Willkommen in Baesweiler',
  image: defaultImage,
  imageStyles: defaultImageStyles,
  styles: defaultStyles
}

const HeroSection = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [content, setContent] = useState<HeroContent>(defaultContent)
  const [loading, setLoading] = useState(true)
  const [primaryBtnHover, setPrimaryBtnHover] = useState(false)
  const [secondaryBtnHover, setSecondaryBtnHover] = useState(false)
  const [imageHover, setImageHover] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    // Fetch content from API
    const fetchContent = async () => {
      try {
        const response = await fetch('/api/content?section=hero')
        const data = await response.json()
        if (data.success && data.data?.content) {
          const apiContent = data.data.content
          setContent({
            ...defaultContent,
            ...apiContent,
            // Deep merge image
            image: {
              ...defaultImage,
              ...apiContent.image,
            },
            // Deep merge image styles
            imageStyles: {
              ...defaultImageStyles,
              ...apiContent.imageStyles,
            },
            // Deep merge styles
            styles: {
              ...defaultStyles,
              ...apiContent.styles,
              badge: { ...defaultStyles.badge, ...apiContent.styles?.badge },
              mainTitle: { ...defaultStyles.mainTitle, ...apiContent.styles?.mainTitle },
              highlightedText: { ...defaultStyles.highlightedText, ...apiContent.styles?.highlightedText },
              subtitle: { ...defaultStyles.subtitle, ...apiContent.styles?.subtitle },
              primaryButton: { ...defaultStyles.primaryButton, ...apiContent.styles?.primaryButton },
              secondaryButton: { ...defaultStyles.secondaryButton, ...apiContent.styles?.secondaryButton },
              trustIndicator: { ...defaultStyles.trustIndicator, ...apiContent.styles?.trustIndicator },
            }
          })
        }
      } catch (error) {
        console.error('Failed to fetch hero content:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchContent()
  }, [])

  // Show loading skeleton while fetching
  if (loading) {
    return (
      <section id="home" className="bg-cream-gradient py-20 lg:py-32 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="animate-pulse">
              <div className="h-8 bg-sage-200 rounded-full w-48 mb-6" />
              <div className="h-16 bg-sage-200 rounded w-full mb-4" />
              <div className="h-16 bg-sage-200 rounded w-3/4 mb-6" />
              <div className="h-6 bg-sage-200 rounded w-full mb-2" />
              <div className="h-6 bg-sage-200 rounded w-2/3 mb-8" />
              <div className="flex gap-4">
                <div className="h-14 bg-sage-300 rounded-xl w-40" />
                <div className="h-14 bg-sage-200 rounded-xl w-48" />
              </div>
            </div>
            <div className="h-96 lg:h-[600px] bg-sage-200 rounded-3xl animate-pulse" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="home" className="bg-cream-gradient py-20 lg:py-32 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className={`transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="mb-6">
              <span
                className="inline-block px-4 py-2 rounded-full mb-4"
                style={{
                  fontFamily: content.styles?.badge?.fontFamily || defaultStyles.badge?.fontFamily,
                  fontSize: content.styles?.badge?.fontSize || defaultStyles.badge?.fontSize,
                  fontWeight: content.styles?.badge?.fontWeight || defaultStyles.badge?.fontWeight,
                  color: content.styles?.badge?.color || defaultStyles.badge?.color,
                  backgroundColor: content.styles?.badge?.backgroundColor || defaultStyles.badge?.backgroundColor,
                }}
              >
                {content.badge}
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6">
              <span
                style={{
                  fontFamily: content.styles?.mainTitle?.fontFamily || defaultStyles.mainTitle?.fontFamily,
                  fontWeight: content.styles?.mainTitle?.fontWeight || defaultStyles.mainTitle?.fontWeight,
                  color: content.styles?.mainTitle?.color || defaultStyles.mainTitle?.color,
                }}
              >
                {content.mainTitle.split(' ').slice(0, 2).join(' ')}
              </span>
              <br />
              <span
                className="relative"
                style={{
                  fontFamily: content.styles?.highlightedText?.fontFamily || defaultStyles.highlightedText?.fontFamily,
                  fontWeight: content.styles?.highlightedText?.fontWeight || defaultStyles.highlightedText?.fontWeight,
                  color: content.styles?.highlightedText?.color || defaultStyles.highlightedText?.color,
                }}
              >
                {content.mainTitle.split(' ').slice(2, 3).join(' ') || 'Entspannung'}
                <svg
                  className="absolute -bottom-2 left-0 w-full h-3"
                  style={{ color: `${content.styles?.highlightedText?.color || defaultStyles.highlightedText?.color}40` }}
                  viewBox="0 0 200 12"
                  fill="currentColor"
                  preserveAspectRatio="none"
                >
                  <path d="M0,7 Q50,0 100,7 T200,7 L200,12 L0,12 Z" />
                </svg>
              </span>
              <br />
              <span
                style={{
                  fontFamily: content.styles?.mainTitle?.fontFamily || defaultStyles.mainTitle?.fontFamily,
                  fontWeight: content.styles?.mainTitle?.fontWeight || defaultStyles.mainTitle?.fontWeight,
                  color: content.styles?.mainTitle?.color || defaultStyles.mainTitle?.color,
                }}
              >
                {content.mainTitle.split(' ').slice(3).join(' ') || 'in Baesweiler'}
              </span>
            </h1>

            <p
              className="text-xl lg:text-2xl leading-relaxed mb-8 max-w-lg"
              style={{
                fontFamily: content.styles?.subtitle?.fontFamily || defaultStyles.subtitle?.fontFamily,
                fontWeight: content.styles?.subtitle?.fontWeight || defaultStyles.subtitle?.fontWeight,
                color: content.styles?.subtitle?.color || defaultStyles.subtitle?.color,
              }}
            >
              {content.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <Link
                href={content.primaryButtonLink}
                className={`group px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${primaryBtnHover ? 'shadow-medium -translate-y-2' : ''}`}
                onMouseEnter={() => setPrimaryBtnHover(true)}
                onMouseLeave={() => setPrimaryBtnHover(false)}
                style={{
                  fontFamily: content.styles?.primaryButton?.fontFamily || defaultStyles.primaryButton?.fontFamily,
                  fontSize: content.styles?.primaryButton?.fontSize || defaultStyles.primaryButton?.fontSize,
                  fontWeight: content.styles?.primaryButton?.fontWeight || defaultStyles.primaryButton?.fontWeight,
                  color: content.styles?.primaryButton?.color || defaultStyles.primaryButton?.color,
                  backgroundColor: primaryBtnHover
                    ? '#6B8A3A' // forest-600 hover color
                    : (content.styles?.primaryButton?.backgroundColor || defaultStyles.primaryButton?.backgroundColor),
                }}
              >
                <svg className={`h-5 w-5 transition-transform ${primaryBtnHover ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {content.primaryButton}
              </Link>

              <Link
                href={content.secondaryButtonLink}
                className={`group border-2 px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${secondaryBtnHover ? 'shadow-medium -translate-y-2' : ''}`}
                onMouseEnter={() => setSecondaryBtnHover(true)}
                onMouseLeave={() => setSecondaryBtnHover(false)}
                style={{
                  fontFamily: content.styles?.secondaryButton?.fontFamily || defaultStyles.secondaryButton?.fontFamily,
                  fontSize: content.styles?.secondaryButton?.fontSize || defaultStyles.secondaryButton?.fontSize,
                  fontWeight: content.styles?.secondaryButton?.fontWeight || defaultStyles.secondaryButton?.fontWeight,
                  color: secondaryBtnHover
                    ? '#FFFFFF'
                    : (content.styles?.secondaryButton?.color || defaultStyles.secondaryButton?.color),
                  borderColor: content.styles?.secondaryButton?.borderColor || defaultStyles.secondaryButton?.borderColor,
                  backgroundColor: secondaryBtnHover
                    ? (content.styles?.secondaryButton?.borderColor || defaultStyles.secondaryButton?.borderColor)
                    : 'transparent',
                }}
              >
                <svg className={`h-5 w-5 transition-transform ${secondaryBtnHover ? 'translate-y-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
                {content.secondaryButton}
              </Link>
            </div>

            {/* Trust Indicators */}
            {(content.trustIndicator || content.trustIndicatorSecondary) && (
              <div className="flex items-center gap-8">
                {content.trustIndicator && (
                  <div className="flex items-center gap-2">
                    <div className="flex -space-x-2">
                      {['🙋🏻‍♀️', '🙋🏻‍♂️', '🙋🏼‍♀️', '🙋🏽‍♂️'].map((emoji, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white"
                          style={{ backgroundColor: content.styles?.badge?.backgroundColor || defaultStyles.badge?.backgroundColor }}
                        >
                          <span className="text-sm">{emoji}</span>
                        </div>
                      ))}
                    </div>
                    <div className="text-sm">
                      <div
                        style={{
                          fontFamily: content.styles?.trustIndicator?.fontFamily || defaultStyles.trustIndicator?.fontFamily,
                          fontWeight: content.styles?.trustIndicator?.fontWeight || defaultStyles.trustIndicator?.fontWeight,
                          color: content.styles?.trustIndicator?.color || defaultStyles.trustIndicator?.color,
                        }}
                      >
                        {content.trustIndicator}
                      </div>
                      {content.trustIndicatorSubtext && (
                        <div className="text-xs" style={{ color: content.styles?.subtitle?.color || defaultStyles.subtitle?.color }}>
                          {content.trustIndicatorSubtext}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {content.trustIndicator && content.trustIndicatorSecondary && (
                  <div className="hidden sm:block w-px h-12 bg-gray-200" />
                )}

                {content.trustIndicatorSecondary && (
                  <div className="text-sm">
                    <div
                      style={{
                        fontFamily: content.styles?.trustIndicator?.fontFamily || defaultStyles.trustIndicator?.fontFamily,
                        fontWeight: content.styles?.trustIndicator?.fontWeight || defaultStyles.trustIndicator?.fontWeight,
                        color: content.styles?.trustIndicator?.color || defaultStyles.trustIndicator?.color,
                      }}
                    >
                      {content.trustIndicatorSecondary}
                    </div>
                    {content.trustIndicatorSecondarySubtext && (
                      <div className="text-xs" style={{ color: content.styles?.subtitle?.color || defaultStyles.subtitle?.color }}>
                        {content.trustIndicatorSecondarySubtext}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Image Content */}
          <div className={`transition-all duration-1000 delay-300 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            <div className="relative">
              {/* Main Image */}
              <div
                className="relative h-96 lg:h-[600px] overflow-hidden group"
                style={{
                  borderRadius: content.imageStyles?.borderRadius || defaultImageStyles.borderRadius,
                  boxShadow: content.imageStyles?.boxShadow || defaultImageStyles.boxShadow,
                }}
                onMouseEnter={() => setImageHover(true)}
                onMouseLeave={() => setImageHover(false)}
              >
                <Image
                  src={content.image?.url || defaultImage.url}
                  alt={content.image?.alt || defaultImage.alt}
                  fill
                  className="object-cover transition-all duration-700"
                  style={{
                    opacity: parseInt(content.imageStyles?.opacity || defaultImageStyles.opacity || '100') / 100,
                    transform: imageHover
                      ? `scale(${parseInt(content.imageStyles?.hoverScale || defaultImageStyles.hoverScale || '105') / 100})`
                      : 'scale(1)',
                    filter: `brightness(${content.imageStyles?.brightness || defaultImageStyles.brightness}%) contrast(${content.imageStyles?.contrast || defaultImageStyles.contrast}%) saturate(${content.imageStyles?.saturation || defaultImageStyles.saturation}%)`,
                  }}
                  priority
                />

                {/* Gradient Overlay - Dynamic */}
                <div
                  className="absolute inset-0 bg-gradient-to-t to-transparent transition-opacity duration-300"
                  style={{
                    background: `linear-gradient(to top, ${content.imageStyles?.overlayColor || defaultImageStyles.overlayColor}${Math.round((parseInt(content.imageStyles?.overlayOpacity || defaultImageStyles.overlayOpacity || '20') / 100) * 255).toString(16).padStart(2, '0')}, transparent)`,
                  }}
                 />

                {/* Status Badge */}
                {(() => {
                  const statusBadge = content.imageFloatingElements?.statusBadge
                  const isEnabled = statusBadge?.enabled !== false
                  if (!isEnabled) return null

                  const text = statusBadge?.text || 'Jetzt geöffnet'
                  const position = statusBadge?.position || { vertical: 'top', horizontal: 'left' }
                  const getPositionClasses = (pos: typeof position) => {
                    const v = pos.vertical === 'top' ? 'top-6' : pos.vertical === 'bottom' ? 'bottom-6' : 'top-1/2 -translate-y-1/2'
                    const h = pos.horizontal === 'left' ? 'left-6' : pos.horizontal === 'right' ? 'right-6' : 'left-1/2 -translate-x-1/2'
                    return `${v} ${h}`
                  }

                  return (
                    <div className={`absolute ${getPositionClasses(position)} bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-medium`}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-sm font-medium text-charcoal">{text}</span>
                      </div>
                    </div>
                  )
                })()}
              </div>

              {/* Premium Card */}
              {(() => {
                const premiumCard = content.imageFloatingElements?.premiumCard
                const isEnabled = premiumCard?.enabled !== false
                if (!isEnabled) return null

                const emoji = premiumCard?.emoji || '🧘🏻‍♀️'
                const title = premiumCard?.title || 'Premium Headspa'
                const subtitle = premiumCard?.subtitle || '90 Min • ab 85€'
                const position = premiumCard?.position || { vertical: 'bottom', horizontal: 'left' }
                const getPositionClasses = (pos: typeof position, useNegative = true) => {
                  const v = pos.vertical === 'top' ? (useNegative ? '-top-6' : 'top-6') : pos.vertical === 'bottom' ? (useNegative ? '-bottom-6' : 'bottom-6') : 'top-1/2 -translate-y-1/2'
                  const h = pos.horizontal === 'left' ? (useNegative ? '-left-6' : 'left-6') : pos.horizontal === 'right' ? (useNegative ? '-right-6' : 'right-6') : 'left-1/2 -translate-x-1/2'
                  return `${v} ${h}`
                }

                return (
                  <div className={`absolute ${getPositionClasses(position)} bg-white p-4 rounded-2xl shadow-medium max-w-xs`}>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-wellness-gradient rounded-full flex items-center justify-center">
                        <span className="text-white text-xl">{emoji}</span>
                      </div>
                      <div>
                        {title && <div className="font-semibold text-charcoal">{title}</div>}
                        {subtitle && <div className="text-sm text-gray-custom">{subtitle}</div>}
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Reviews Badge */}
              {(() => {
                const reviewsBadge = content.imageFloatingElements?.reviewsBadge
                const isEnabled = reviewsBadge?.enabled !== false
                if (!isEnabled) return null

                const rating = reviewsBadge?.rating || '4.9'
                const text = reviewsBadge?.text || 'Google Reviews'
                const position = reviewsBadge?.position || { vertical: 'top', horizontal: 'right' }
                const getPositionClasses = (pos: typeof position, useNegative = true) => {
                  const v = pos.vertical === 'top' ? (useNegative ? '-top-6' : 'top-6') : pos.vertical === 'bottom' ? (useNegative ? '-bottom-6' : 'bottom-6') : 'top-1/2 -translate-y-1/2'
                  const h = pos.horizontal === 'left' ? (useNegative ? '-left-6' : 'left-6') : pos.horizontal === 'right' ? (useNegative ? '-right-6' : 'right-6') : 'left-1/2 -translate-x-1/2'
                  return `${v} ${h}`
                }

                return (
                  <div className={`absolute ${getPositionClasses(position)} bg-sage-500 text-white p-4 rounded-2xl shadow-medium`}>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{rating}</div>
                      {text && <div className="text-xs opacity-90">{text}</div>}
                      <div className="flex gap-1 mt-1 justify-center">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              })()}

              {/* Decorative Elements */}
              <div className="absolute -z-10 top-20 -left-20 w-40 h-40 bg-sage-200 rounded-full opacity-20 animate-float" />
              <div className="absolute -z-10 bottom-20 -right-20 w-32 h-32 bg-earth-200 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}} />
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center gap-2 animate-bounce">
          <span className="text-sm text-gray-custom">Scrollen Sie nach unten</span>
          <svg className="h-6 w-6 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
