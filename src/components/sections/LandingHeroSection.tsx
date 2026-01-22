'use client'

import { useState, useEffect } from 'react'

// Style interfaces
interface TextStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
}

interface LandingHeroStyles {
  badge?: TextStyle
  mainTitle?: TextStyle
  highlightedText?: TextStyle
  description?: TextStyle
  primaryButton?: TextStyle
  secondaryButton?: TextStyle
}

interface LandingHeroContent {
  badge: string
  mainTitle: string
  highlightedText: string
  description: string
  primaryButton: string
  primaryButtonLink: string
  secondaryButton: string
  secondaryButtonLink: string
  styles?: LandingHeroStyles
}

// Default styles - HeroSection ile AYNI renkler - Tailwind config'den
const defaultLandingHeroStyles: LandingHeroStyles = {
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
  description: {
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
  }
}

const defaultLandingHeroContent: LandingHeroContent = {
  badge: 'Wellnesstal Studio',
  mainTitle: 'Ihre Wellness-Oase für',
  highlightedText: 'Körper & Seele',
  description: 'Entdecken Sie unsere exklusiven Wellness-Behandlungen und finden Sie Ihre innere Balance in entspannter Atmosphäre.',
  primaryButton: 'Services entdecken',
  primaryButtonLink: '#services',
  secondaryButton: 'Termin buchen',
  secondaryButtonLink: '#contact',
  styles: defaultLandingHeroStyles
}

export default function LandingHeroSection() {
  const [landingHeroContent, setLandingHeroContent] = useState<LandingHeroContent>(defaultLandingHeroContent)
  const [landingHeroLoading, setLandingHeroLoading] = useState(true)
  const [primaryBtnHover, setPrimaryBtnHover] = useState(false)
  const [secondaryBtnHover, setSecondaryBtnHover] = useState(false)

  // Fetch landing-hero content from API
  useEffect(() => {
    const fetchLandingHeroContent = async () => {
      try {
        const response = await fetch('/api/content?section=landing-hero')
        const data = await response.json()
        if (data.success && data.data?.content) {
          const apiContent = data.data.content
          setLandingHeroContent({
            ...defaultLandingHeroContent,
            ...apiContent,
            // Deep merge styles
            styles: {
              ...defaultLandingHeroStyles,
              ...apiContent.styles,
              badge: { ...defaultLandingHeroStyles.badge, ...apiContent.styles?.badge },
              mainTitle: { ...defaultLandingHeroStyles.mainTitle, ...apiContent.styles?.mainTitle },
              highlightedText: { ...defaultLandingHeroStyles.highlightedText, ...apiContent.styles?.highlightedText },
              description: { ...defaultLandingHeroStyles.description, ...apiContent.styles?.description },
              primaryButton: { ...defaultLandingHeroStyles.primaryButton, ...apiContent.styles?.primaryButton },
              secondaryButton: { ...defaultLandingHeroStyles.secondaryButton, ...apiContent.styles?.secondaryButton },
            }
          })
        }
      } catch (error) {
        console.error('Failed to fetch landing hero content:', error)
      } finally {
        setLandingHeroLoading(false)
      }
    }

    fetchLandingHeroContent()
  }, [])

  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {landingHeroLoading ? (
          <div className="text-center animate-pulse">
            <div className="h-8 bg-sage-200 rounded-full w-48 mx-auto mb-6" />
            <div className="h-16 bg-sage-200 rounded w-3/4 mx-auto mb-4" />
            <div className="h-16 bg-sage-300 rounded w-1/2 mx-auto mb-8" />
            <div className="h-6 bg-sage-200 rounded w-2/3 mx-auto mb-12" />
            <div className="flex justify-center gap-6 mb-16">
              <div className="h-14 bg-sage-300 rounded-xl w-48" />
              <div className="h-14 bg-sage-200 rounded-xl w-40" />
            </div>
          </div>
        ) : (
          <div className="text-center">
            {/* Badge with dynamic styles */}
            <div
              className="inline-block px-4 py-2 rounded-full mb-6"
              style={{
                fontFamily: landingHeroContent.styles?.badge?.fontFamily || defaultLandingHeroStyles.badge?.fontFamily,
                fontSize: landingHeroContent.styles?.badge?.fontSize || defaultLandingHeroStyles.badge?.fontSize,
                fontWeight: landingHeroContent.styles?.badge?.fontWeight || defaultLandingHeroStyles.badge?.fontWeight,
                color: landingHeroContent.styles?.badge?.color || defaultLandingHeroStyles.badge?.color,
                backgroundColor: landingHeroContent.styles?.badge?.backgroundColor || defaultLandingHeroStyles.badge?.backgroundColor,
              }}
            >
              ✨ {landingHeroContent.badge}
            </div>

            {/* Main Title with dynamic styles */}
            <h1 className="mb-8 leading-normal sm:leading-tight break-words">
              <span
                className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-2 sm:mb-0"
                style={{
                  fontFamily: landingHeroContent.styles?.mainTitle?.fontFamily || defaultLandingHeroStyles.mainTitle?.fontFamily,
                  fontSize: landingHeroContent.styles?.mainTitle?.fontSize ? `clamp(1.875rem, 4vw, ${landingHeroContent.styles.mainTitle.fontSize})` : 'clamp(1.875rem, 4vw, 4.5rem)',
                  fontWeight: landingHeroContent.styles?.mainTitle?.fontWeight || defaultLandingHeroStyles.mainTitle?.fontWeight,
                  color: landingHeroContent.styles?.mainTitle?.color || defaultLandingHeroStyles.mainTitle?.color,
                }}
              >
                {landingHeroContent.mainTitle}
              </span>
              <span
                className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl mt-2 sm:mt-0"
                style={{
                  fontFamily: landingHeroContent.styles?.highlightedText?.fontFamily || defaultLandingHeroStyles.highlightedText?.fontFamily,
                  fontSize: landingHeroContent.styles?.highlightedText?.fontSize ? `clamp(1.875rem, 4vw, ${landingHeroContent.styles.highlightedText.fontSize})` : 'clamp(1.875rem, 4vw, 4.5rem)',
                  fontWeight: landingHeroContent.styles?.highlightedText?.fontWeight || defaultLandingHeroStyles.highlightedText?.fontWeight,
                  color: landingHeroContent.styles?.highlightedText?.color || defaultLandingHeroStyles.highlightedText?.color,
                }}
              >
                {landingHeroContent.highlightedText}
              </span>
            </h1>

            {/* Description with dynamic styles */}
            <p
              className="max-w-4xl mx-auto mb-12 leading-relaxed"
              style={{
                fontFamily: landingHeroContent.styles?.description?.fontFamily || defaultLandingHeroStyles.description?.fontFamily,
                fontSize: landingHeroContent.styles?.description?.fontSize || defaultLandingHeroStyles.description?.fontSize,
                fontWeight: landingHeroContent.styles?.description?.fontWeight || defaultLandingHeroStyles.description?.fontWeight,
                color: landingHeroContent.styles?.description?.color || defaultLandingHeroStyles.description?.color,
              }}
            >
              {landingHeroContent.description}
            </p>

            {/* Buttons with dynamic styles */}
            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
              <a
                href={landingHeroContent.primaryButtonLink}
                className={`px-8 py-4 rounded-xl transition-all duration-300 ${primaryBtnHover ? 'shadow-medium -translate-y-2' : ''}`}
                onMouseEnter={() => setPrimaryBtnHover(true)}
                onMouseLeave={() => setPrimaryBtnHover(false)}
                style={{
                  fontFamily: landingHeroContent.styles?.primaryButton?.fontFamily || defaultLandingHeroStyles.primaryButton?.fontFamily,
                  fontSize: landingHeroContent.styles?.primaryButton?.fontSize || defaultLandingHeroStyles.primaryButton?.fontSize,
                  fontWeight: landingHeroContent.styles?.primaryButton?.fontWeight || defaultLandingHeroStyles.primaryButton?.fontWeight,
                  color: landingHeroContent.styles?.primaryButton?.color || defaultLandingHeroStyles.primaryButton?.color,
                  backgroundColor: primaryBtnHover
                    ? '#6B8A3A' // forest-600 hover color
                    : (landingHeroContent.styles?.primaryButton?.backgroundColor || defaultLandingHeroStyles.primaryButton?.backgroundColor),
                }}
              >
                {landingHeroContent.primaryButton}
              </a>
              <a
                href={landingHeroContent.secondaryButtonLink}
                className={`border-2 px-8 py-4 rounded-xl transition-all duration-300 ${secondaryBtnHover ? 'shadow-medium -translate-y-2' : ''}`}
                onMouseEnter={() => setSecondaryBtnHover(true)}
                onMouseLeave={() => setSecondaryBtnHover(false)}
                style={{
                  fontFamily: landingHeroContent.styles?.secondaryButton?.fontFamily || defaultLandingHeroStyles.secondaryButton?.fontFamily,
                  fontSize: landingHeroContent.styles?.secondaryButton?.fontSize || defaultLandingHeroStyles.secondaryButton?.fontSize,
                  fontWeight: landingHeroContent.styles?.secondaryButton?.fontWeight || defaultLandingHeroStyles.secondaryButton?.fontWeight,
                  color: secondaryBtnHover
                    ? '#FFFFFF'
                    : (landingHeroContent.styles?.secondaryButton?.color || defaultLandingHeroStyles.secondaryButton?.color),
                  borderColor: landingHeroContent.styles?.secondaryButton?.borderColor || defaultLandingHeroStyles.secondaryButton?.borderColor,
                  backgroundColor: secondaryBtnHover
                    ? (landingHeroContent.styles?.secondaryButton?.borderColor || defaultLandingHeroStyles.secondaryButton?.borderColor)
                    : 'transparent',
                }}
              >
                {landingHeroContent.secondaryButton}
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
