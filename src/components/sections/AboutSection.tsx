'use client'

import { useState, useEffect } from 'react'

// Style interfaces
interface AboutTextStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
}

interface AboutStyles {
  badge?: AboutTextStyle
  title?: AboutTextStyle
  highlightedText?: AboutTextStyle
  description?: AboutTextStyle
  statsValue?: AboutTextStyle
  statsLabel?: AboutTextStyle
  primaryButton?: AboutTextStyle
  secondaryButton?: AboutTextStyle
}

interface AboutImage {
  url: string
  alt: string
}

interface AboutContent {
  badge: string
  title: string
  description: string
  stats: Array<{ label: string; value: string }>
  primaryButton: string
  primaryButtonLink: string
  secondaryButton: string
  secondaryButtonLink: string
  images: AboutImage[]
  styles?: AboutStyles
}

// Contact content interface for fallback phone
interface ContactContent {
  phone: string
}

// Default styles - Tailwind config'den exact renkler
const defaultAboutStyles: AboutStyles = {
  badge: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '500',
    color: '#637554',      // sage-700
    backgroundColor: '#eef1ea'  // sage-100
  },
  title: {
    fontFamily: 'system-ui',
    fontSize: '48px',
    fontWeight: '700',
    color: '#2C2C2C'       // charcoal
  },
  highlightedText: {
    fontFamily: 'system-ui',
    fontSize: '48px',
    fontWeight: '700',
    color: '#9CAF88'       // sage-500
  },
  description: {
    fontFamily: 'system-ui',
    fontSize: '20px',
    fontWeight: '400',
    color: '#666666'       // gray-custom
  },
  statsValue: {
    fontFamily: 'system-ui',
    fontSize: '30px',
    fontWeight: '700',
    color: '#9CAF88'       // sage-500
  },
  statsLabel: {
    fontFamily: 'system-ui',
    fontSize: '16px',
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

const defaultAboutContent: AboutContent = {
  badge: 'Über Wellnesstal Studio',
  title: 'Ihre Wellness-Oase im Herzen von Baesweiler',
  description: 'Seit über 5 Jahren widmen wir uns mit Leidenschaft Ihrem Wohlbefinden. Unser erfahrenes Team aus zertifizierten Wellness-Therapeuten bietet Ihnen individuelle Behandlungen in entspannter Atmosphäre.',
  stats: [
    { label: 'Zufriedene Kunden', value: '500+' },
    { label: 'Jahre Erfahrung', value: '5+' }
  ],
  primaryButton: 'Persönliche Beratung',
  primaryButtonLink: 'tel:+491733828581',
  secondaryButton: 'Mehr erfahren',
  secondaryButtonLink: '#contact',
  images: [
    { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Wellness Studio Innenbereich' },
    { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Entspannende Behandlung' },
    { url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Wellness Produkte' },
    { url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Entspannte Kundin' }
  ],
  styles: defaultAboutStyles
}

const defaultContactContent: ContactContent = {
  phone: '+49 221 12345678'
}

export default function AboutSection() {
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAboutContent)
  const [aboutLoading, setAboutLoading] = useState(true)
  const [contactContent, setContactContent] = useState<ContactContent>(defaultContactContent)
  const [aboutPrimaryBtnHover, setAboutPrimaryBtnHover] = useState(false)
  const [aboutSecondaryBtnHover, setAboutSecondaryBtnHover] = useState(false)

  // Fetch about content from API
  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch('/api/content?section=about')
        const data = await response.json()
        if (data.success && data.data?.content) {
          const apiContent = data.data.content
          setAboutContent({
            ...defaultAboutContent,
            ...apiContent,
            // Ensure images array exists
            images: apiContent.images || defaultAboutContent.images,
            // Deep merge styles
            styles: {
              ...defaultAboutStyles,
              ...apiContent.styles,
              badge: { ...defaultAboutStyles.badge, ...apiContent.styles?.badge },
              title: { ...defaultAboutStyles.title, ...apiContent.styles?.title },
              highlightedText: { ...defaultAboutStyles.highlightedText, ...apiContent.styles?.highlightedText },
              description: { ...defaultAboutStyles.description, ...apiContent.styles?.description },
              statsValue: { ...defaultAboutStyles.statsValue, ...apiContent.styles?.statsValue },
              statsLabel: { ...defaultAboutStyles.statsLabel, ...apiContent.styles?.statsLabel },
              primaryButton: { ...defaultAboutStyles.primaryButton, ...apiContent.styles?.primaryButton },
              secondaryButton: { ...defaultAboutStyles.secondaryButton, ...apiContent.styles?.secondaryButton },
            }
          })
        }
      } catch (error) {
        console.error('Failed to fetch about content:', error)
      } finally {
        setAboutLoading(false)
      }
    }

    fetchAboutContent()
  }, [])

  // Fetch contact content for phone fallback
  useEffect(() => {
    const fetchContactContent = async () => {
      try {
        const response = await fetch('/api/content?section=contact')
        const data = await response.json()
        if (data.success && data.data?.content?.phone) {
          setContactContent({
            phone: data.data.content.phone
          })
        }
      } catch (error) {
        console.error('Failed to fetch contact content:', error)
      }
    }

    fetchContactContent()
  }, [])

  return (
    <section id="about" className="py-20 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {aboutLoading ? (
            <div className="animate-pulse">
              <div className="h-8 bg-sage-200 rounded-full w-48 mb-6"></div>
              <div className="h-12 bg-sage-200 rounded w-full mb-4"></div>
              <div className="h-12 bg-sage-200 rounded w-3/4 mb-6"></div>
              <div className="h-6 bg-sage-200 rounded w-full mb-2"></div>
              <div className="h-6 bg-sage-200 rounded w-full mb-2"></div>
              <div className="h-6 bg-sage-200 rounded w-2/3 mb-8"></div>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="h-28 bg-sage-100 rounded-2xl"></div>
                <div className="h-28 bg-sage-100 rounded-2xl"></div>
              </div>
              <div className="flex gap-4">
                <div className="h-14 bg-sage-300 rounded-xl w-40"></div>
                <div className="h-14 bg-sage-200 rounded-xl w-40"></div>
              </div>
            </div>
          ) : (
          <div>
            {/* Badge with dynamic styles */}
            <div
              className="inline-block px-4 py-2 rounded-full mb-6"
              style={{
                fontFamily: aboutContent.styles?.badge?.fontFamily || defaultAboutStyles.badge?.fontFamily,
                fontSize: aboutContent.styles?.badge?.fontSize || defaultAboutStyles.badge?.fontSize,
                fontWeight: aboutContent.styles?.badge?.fontWeight || defaultAboutStyles.badge?.fontWeight,
                color: aboutContent.styles?.badge?.color || defaultAboutStyles.badge?.color,
                backgroundColor: aboutContent.styles?.badge?.backgroundColor || defaultAboutStyles.badge?.backgroundColor,
              }}
            >
              ✨ {aboutContent.badge}
            </div>

            {/* Title with dynamic styles */}
            <h2 className="mb-6 leading-tight">
              <span
                style={{
                  fontFamily: aboutContent.styles?.title?.fontFamily || defaultAboutStyles.title?.fontFamily,
                  fontSize: aboutContent.styles?.title?.fontSize || defaultAboutStyles.title?.fontSize,
                  fontWeight: aboutContent.styles?.title?.fontWeight || defaultAboutStyles.title?.fontWeight,
                  color: aboutContent.styles?.title?.color || defaultAboutStyles.title?.color,
                }}
              >
                {aboutContent.title.split(' ').slice(0, -1).join(' ')}{' '}
              </span>
              <span
                style={{
                  fontFamily: aboutContent.styles?.highlightedText?.fontFamily || defaultAboutStyles.highlightedText?.fontFamily,
                  fontSize: aboutContent.styles?.highlightedText?.fontSize || defaultAboutStyles.highlightedText?.fontSize,
                  fontWeight: aboutContent.styles?.highlightedText?.fontWeight || defaultAboutStyles.highlightedText?.fontWeight,
                  color: aboutContent.styles?.highlightedText?.color || defaultAboutStyles.highlightedText?.color,
                }}
              >
                {aboutContent.title.split(' ').slice(-1)[0]}
              </span>
            </h2>

            {/* Description with dynamic styles */}
            <p
              className="leading-relaxed mb-8"
              style={{
                fontFamily: aboutContent.styles?.description?.fontFamily || defaultAboutStyles.description?.fontFamily,
                fontSize: aboutContent.styles?.description?.fontSize || defaultAboutStyles.description?.fontSize,
                fontWeight: aboutContent.styles?.description?.fontWeight || defaultAboutStyles.description?.fontWeight,
                color: aboutContent.styles?.description?.color || defaultAboutStyles.description?.color,
              }}
            >
              {aboutContent.description}
            </p>

            {/* Stats with dynamic styles */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div
                className="text-center p-6 rounded-2xl"
                style={{ backgroundColor: `${aboutContent.styles?.statsValue?.color || defaultAboutStyles.statsValue?.color}10` }}
              >
                <div
                  className="mb-2"
                  style={{
                    fontFamily: aboutContent.styles?.statsValue?.fontFamily || defaultAboutStyles.statsValue?.fontFamily,
                    fontSize: aboutContent.styles?.statsValue?.fontSize || defaultAboutStyles.statsValue?.fontSize,
                    fontWeight: aboutContent.styles?.statsValue?.fontWeight || defaultAboutStyles.statsValue?.fontWeight,
                    color: aboutContent.styles?.statsValue?.color || defaultAboutStyles.statsValue?.color,
                  }}
                >
                  {aboutContent.stats[0]?.value || '500+'}
                </div>
                <div
                  style={{
                    fontFamily: aboutContent.styles?.statsLabel?.fontFamily || defaultAboutStyles.statsLabel?.fontFamily,
                    fontSize: aboutContent.styles?.statsLabel?.fontSize || defaultAboutStyles.statsLabel?.fontSize,
                    fontWeight: aboutContent.styles?.statsLabel?.fontWeight || defaultAboutStyles.statsLabel?.fontWeight,
                    color: aboutContent.styles?.statsLabel?.color || defaultAboutStyles.statsLabel?.color,
                  }}
                >
                  {aboutContent.stats[0]?.label || 'Zufriedene Kunden'}
                </div>
              </div>
              <div
                className="text-center p-6 rounded-2xl"
                style={{ backgroundColor: `${aboutContent.styles?.statsValue?.color || defaultAboutStyles.statsValue?.color}10` }}
              >
                <div
                  className="mb-2"
                  style={{
                    fontFamily: aboutContent.styles?.statsValue?.fontFamily || defaultAboutStyles.statsValue?.fontFamily,
                    fontSize: aboutContent.styles?.statsValue?.fontSize || defaultAboutStyles.statsValue?.fontSize,
                    fontWeight: aboutContent.styles?.statsValue?.fontWeight || defaultAboutStyles.statsValue?.fontWeight,
                    color: aboutContent.styles?.statsValue?.color || defaultAboutStyles.statsValue?.color,
                  }}
                >
                  {aboutContent.stats[1]?.value || '5+'}
                </div>
                <div
                  style={{
                    fontFamily: aboutContent.styles?.statsLabel?.fontFamily || defaultAboutStyles.statsLabel?.fontFamily,
                    fontSize: aboutContent.styles?.statsLabel?.fontSize || defaultAboutStyles.statsLabel?.fontSize,
                    fontWeight: aboutContent.styles?.statsLabel?.fontWeight || defaultAboutStyles.statsLabel?.fontWeight,
                    color: aboutContent.styles?.statsLabel?.color || defaultAboutStyles.statsLabel?.color,
                  }}
                >
                  {aboutContent.stats[1]?.label || 'Jahre Erfahrung'}
                </div>
              </div>
            </div>

            {/* Buttons with dynamic styles and hover */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={aboutContent.primaryButtonLink || `tel:${contactContent.phone.replace(/\s/g, '')}`}
                className={`px-8 py-4 rounded-xl transition-all duration-300 text-center ${aboutPrimaryBtnHover ? 'shadow-medium -translate-y-1' : ''}`}
                onMouseEnter={() => setAboutPrimaryBtnHover(true)}
                onMouseLeave={() => setAboutPrimaryBtnHover(false)}
                style={{
                  fontFamily: aboutContent.styles?.primaryButton?.fontFamily || defaultAboutStyles.primaryButton?.fontFamily,
                  fontSize: aboutContent.styles?.primaryButton?.fontSize || defaultAboutStyles.primaryButton?.fontSize,
                  fontWeight: aboutContent.styles?.primaryButton?.fontWeight || defaultAboutStyles.primaryButton?.fontWeight,
                  color: aboutContent.styles?.primaryButton?.color || defaultAboutStyles.primaryButton?.color,
                  backgroundColor: aboutPrimaryBtnHover
                    ? '#6B8A3A' // forest-600 hover color
                    : (aboutContent.styles?.primaryButton?.backgroundColor || defaultAboutStyles.primaryButton?.backgroundColor),
                }}
              >
                {aboutContent.primaryButton}
              </a>
              <a
                href={aboutContent.secondaryButtonLink || '#contact'}
                className={`border-2 px-8 py-4 rounded-xl transition-all duration-300 text-center ${aboutSecondaryBtnHover ? 'shadow-medium -translate-y-1' : ''}`}
                onMouseEnter={() => setAboutSecondaryBtnHover(true)}
                onMouseLeave={() => setAboutSecondaryBtnHover(false)}
                style={{
                  fontFamily: aboutContent.styles?.secondaryButton?.fontFamily || defaultAboutStyles.secondaryButton?.fontFamily,
                  fontSize: aboutContent.styles?.secondaryButton?.fontSize || defaultAboutStyles.secondaryButton?.fontSize,
                  fontWeight: aboutContent.styles?.secondaryButton?.fontWeight || defaultAboutStyles.secondaryButton?.fontWeight,
                  color: aboutSecondaryBtnHover
                    ? '#FFFFFF'
                    : (aboutContent.styles?.secondaryButton?.color || defaultAboutStyles.secondaryButton?.color),
                  borderColor: aboutContent.styles?.secondaryButton?.borderColor || defaultAboutStyles.secondaryButton?.borderColor,
                  backgroundColor: aboutSecondaryBtnHover
                    ? (aboutContent.styles?.secondaryButton?.borderColor || defaultAboutStyles.secondaryButton?.borderColor)
                    : 'transparent',
                }}
              >
                {aboutContent.secondaryButton}
              </a>
            </div>
          </div>
          )}

          {/* Images from API */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img
                src={aboutContent.images?.[0]?.url || defaultAboutContent.images[0].url}
                alt={aboutContent.images?.[0]?.alt || defaultAboutContent.images[0].alt}
                className="rounded-2xl shadow-medium h-48 w-full object-cover"
              />
              <img
                src={aboutContent.images?.[1]?.url || defaultAboutContent.images[1].url}
                alt={aboutContent.images?.[1]?.alt || defaultAboutContent.images[1].alt}
                className="rounded-2xl shadow-medium h-48 w-full object-cover mt-8"
              />
              <img
                src={aboutContent.images?.[2]?.url || defaultAboutContent.images[2].url}
                alt={aboutContent.images?.[2]?.alt || defaultAboutContent.images[2].alt}
                className="rounded-2xl shadow-medium h-48 w-full object-cover -mt-8"
              />
              <img
                src={aboutContent.images?.[3]?.url || defaultAboutContent.images[3].url}
                alt={aboutContent.images?.[3]?.alt || defaultAboutContent.images[3].alt}
                className="rounded-2xl shadow-medium h-48 w-full object-cover"
              />
            </div>

            {/* Decorative Elements */}
            <div
              className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20"
              style={{ backgroundColor: `${aboutContent.styles?.statsValue?.color || defaultAboutStyles.statsValue?.color}30` }}
            ></div>
            <div
              className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full opacity-20"
              style={{ backgroundColor: `${aboutContent.styles?.highlightedText?.color || defaultAboutStyles.highlightedText?.color}30` }}
            ></div>
          </div>
        </div>
      </div>
    </section>
  )
}
