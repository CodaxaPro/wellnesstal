'use client'

import { useState } from 'react'

import { BlockProps, AboutContent } from './types'

// Default styles - Ana sayfadaki ile aynı
const defaultStyles = {
  badge: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '14px',
    fontWeight: '500',
    color: '#637554',
    backgroundColor: '#eef1ea'
  },
  title: {
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
    fontSize: '30px',
    fontWeight: '700',
    color: '#9CAF88'
  },
  statsLabel: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '16px',
    fontWeight: '400',
    color: '#666666'
  },
  primaryButton: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#9CAF88'
  },
  secondaryButton: {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '18px',
    fontWeight: '600',
    color: '#9CAF88',
    borderColor: '#9CAF88'
  }
}

// Default content
const defaultContent: AboutContent = {
  badge: '✨ Über WellnessTal Studio',
  title: 'Ihre Wellness-Oase im Herzen von Baesweiler',
  description: 'Seit über 5 Jahren widmen wir uns mit Leidenschaft Ihrem Wohlbefinden. Unser erfahrenes Team aus zertifizierten Wellness-Therapeuten bietet Ihnen individuelle Behandlungen in entspannter Atmosphäre.',
  stats: [
    { label: 'Zufriedene Kunden', value: '500+' },
    { label: 'Jahre Erfahrung', value: '5+' }
  ],
  primaryButton: 'Persönliche Beratung',
  primaryButtonLink: '#contact',
  secondaryButton: 'Mehr erfahren',
  secondaryButtonLink: '#contact',
  images: [
    { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Wellness Studio Innenbereich' },
    { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Entspannende Behandlung' },
    { url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Wellness Produkte' },
    { url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Entspannte Kundin' }
  ]
}

export default function AboutBlock({ block }: BlockProps) {
  const content = { ...defaultContent, ...block.content } as AboutContent
  const [primaryBtnHover, setPrimaryBtnHover] = useState(false)
  const [secondaryBtnHover, setSecondaryBtnHover] = useState(false)

  // Merge styles with defaults
  const styles = {
    badge: { ...defaultStyles.badge, ...content.styles?.badge },
    title: { ...defaultStyles.title, ...content.styles?.title },
    highlightedText: { ...defaultStyles.highlightedText, ...content.styles?.highlightedText },
    description: { ...defaultStyles.description, ...content.styles?.description },
    statsValue: { ...defaultStyles.statsValue, ...content.styles?.statsValue },
    statsLabel: { ...defaultStyles.statsLabel, ...content.styles?.statsLabel },
    primaryButton: { ...defaultStyles.primaryButton, ...content.styles?.primaryButton },
    secondaryButton: { ...defaultStyles.secondaryButton, ...content.styles?.secondaryButton }
  }

  const badge = content.badge || defaultContent.badge
  const title = content.title || defaultContent.title || ''
  const description = content.description || defaultContent.description
  const stats = content.stats || defaultContent.stats || []
  const images = content.images || defaultContent.images || []
  const sectionBgColor = content.background?.color || '#FFFFFF'

  return (
    <section id="about" className="py-20 lg:py-32" style={{ backgroundColor: sectionBgColor }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div>
            {/* Badge */}
            <div
              className="inline-block px-4 py-2 rounded-full mb-6"
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

            {/* Title - Ana sayfadaki gibi */}
            <h2 className="mb-6 leading-tight">
              {title ? (
                <>
                  <span
                    style={{
                      fontFamily: styles.title?.fontFamily,
                      fontSize: styles.title?.fontSize,
                      fontWeight: styles.title?.fontWeight as any,
                      color: styles.title?.color
                    }}
                  >
                    {title.split(' ').slice(0, -1).join(' ')}{' '}
                  </span>
                  <span
                    style={{
                      fontFamily: styles.highlightedText?.fontFamily,
                      fontSize: styles.highlightedText?.fontSize,
                      fontWeight: styles.highlightedText?.fontWeight as any,
                      color: styles.highlightedText?.color
                    }}
                  >
                    {content.highlightedText || title.split(' ').slice(-1)[0]}
                  </span>
                </>
              ) : (
                <span
                  style={{
                    fontFamily: styles.title?.fontFamily,
                    fontSize: styles.title?.fontSize,
                    fontWeight: styles.title?.fontWeight as any,
                    color: styles.title?.color
                  }}
                >
                  {defaultContent.title}
                </span>
              )}
            </h2>

            {/* Description */}
            <p
              className="leading-relaxed mb-8"
              style={{
                fontFamily: styles.description?.fontFamily,
                fontSize: styles.description?.fontSize,
                fontWeight: styles.description?.fontWeight as any,
                color: styles.description?.color
              }}
            >
              {description}
            </p>

            {/* Stats */}
            {stats.length > 0 && (
              <div className="grid grid-cols-2 gap-6 mb-8">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className="text-center p-6 rounded-2xl"
                    style={{ backgroundColor: `${styles.statsValue?.color || '#9CAF88'}10` }}
                  >
                    <div
                      className="mb-2"
                      style={{
                        fontFamily: styles.statsValue?.fontFamily,
                        fontSize: styles.statsValue?.fontSize,
                        fontWeight: styles.statsValue?.fontWeight as any,
                        color: styles.statsValue?.color
                      }}
                    >
                      {stat.value}
                    </div>
                    <div
                      style={{
                        fontFamily: styles.statsLabel?.fontFamily,
                        fontSize: styles.statsLabel?.fontSize,
                        fontWeight: styles.statsLabel?.fontWeight as any,
                        color: styles.statsLabel?.color
                      }}
                    >
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              {content.primaryButton && (
                <a
                  href={content.primaryButtonLink || '#contact'}
                  className={`px-8 py-4 rounded-xl transition-all duration-300 text-center ${primaryBtnHover ? 'shadow-medium -translate-y-1' : ''}`}
                  onMouseEnter={() => setPrimaryBtnHover(true)}
                  onMouseLeave={() => setPrimaryBtnHover(false)}
                  style={{
                    fontFamily: styles.primaryButton?.fontFamily,
                    fontSize: styles.primaryButton?.fontSize,
                    fontWeight: styles.primaryButton?.fontWeight as any,
                    color: styles.primaryButton?.color,
                    backgroundColor: primaryBtnHover
                      ? '#6B8A3A'
                      : (styles.primaryButton?.backgroundColor || '#9CAF88')
                  }}
                >
                  {content.primaryButton}
                </a>
              )}
              {content.secondaryButton && (
                <a
                  href={content.secondaryButtonLink || '#contact'}
                  className={`border-2 px-8 py-4 rounded-xl transition-all duration-300 text-center ${secondaryBtnHover ? 'shadow-medium -translate-y-1' : ''}`}
                  onMouseEnter={() => setSecondaryBtnHover(true)}
                  onMouseLeave={() => setSecondaryBtnHover(false)}
                  style={{
                    fontFamily: styles.secondaryButton?.fontFamily,
                    fontSize: styles.secondaryButton?.fontSize,
                    fontWeight: styles.secondaryButton?.fontWeight as any,
                    color: secondaryBtnHover
                      ? '#FFFFFF'
                      : (styles.secondaryButton?.color || '#9CAF88'),
                    borderColor: styles.secondaryButton?.borderColor || '#9CAF88',
                    backgroundColor: secondaryBtnHover
                      ? (styles.secondaryButton?.borderColor || '#9CAF88')
                      : 'transparent'
                  }}
                >
                  {content.secondaryButton}
                </a>
              )}
            </div>
          </div>

          {/* Right Column - Images - Ana sayfadaki gibi */}
          {images.length > 0 && (
            <div className="relative">
              <div className="grid grid-cols-2 gap-4">
                {images.slice(0, 4).map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={image.alt || `About image ${index + 1}`}
                    className={`rounded-2xl shadow-medium h-48 w-full object-cover ${
                      index === 1 ? 'mt-8' : index === 2 ? '-mt-8' : ''
                    }`}
                  />
                ))}
              </div>

              {/* Decorative Elements - Ana sayfadaki gibi */}
              <div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20"
                style={{ backgroundColor: `${styles.statsValue?.color || '#9CAF88'}30` }}
               />
              <div
                className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full opacity-20"
                style={{ backgroundColor: `${styles.highlightedText?.color || '#9CAF88'}30` }}
               />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

