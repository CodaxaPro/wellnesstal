'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { BlockProps, HeroContent, HeroTextStyle } from './types'

// Default styles
const defaultStyles = {
  badge: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '500',
    color: '#637554',
    backgroundColor: '#eef1ea'
  },
  mainTitle: {
    fontFamily: 'system-ui',
    fontSize: '72px',
    fontWeight: '700',
    color: '#2C2C2C'
  },
  highlightedText: {
    fontFamily: 'system-ui',
    fontSize: '72px',
    fontWeight: '700',
    color: '#9CAF88'
  },
  subtitle: {
    fontFamily: 'system-ui',
    fontSize: '24px',
    fontWeight: '400',
    color: '#666666'
  },
  description: {
    fontFamily: 'system-ui',
    fontSize: '18px',
    fontWeight: '400',
    color: '#666666'
  },
  primaryButton: {
    fontFamily: 'system-ui',
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#9CAF88'
  },
  secondaryButton: {
    fontFamily: 'system-ui',
    fontSize: '18px',
    fontWeight: '600',
    color: '#9CAF88',
    borderColor: '#9CAF88'
  },
  trustIndicator: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '600',
    color: '#2C2C2C'
  }
}

const defaultImageStyles = {
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

export default function HeroBlock({ block }: BlockProps) {
  const content = block.content as HeroContent
  const [isVisible, setIsVisible] = useState(false)
  const [primaryBtnHover, setPrimaryBtnHover] = useState(false)
  const [secondaryBtnHover, setSecondaryBtnHover] = useState(false)
  const [imageHover, setImageHover] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const styles = content.styles || {}
  const imageStyles = content.imageStyles || defaultImageStyles

  // Helper function to safely get string value (handle both string and object)
  const getStringValue = (value: any): string => {
    if (typeof value === 'string') return value
    if (typeof value === 'object' && value !== null && 'text' in value) return value.text || ''
    if (typeof value === 'object' && value !== null && typeof value.toString === 'function') return value.toString()
    return ''
  }

  // Safely extract string values
  const badge = getStringValue(content.badge)
  const mainTitle = getStringValue(content.mainTitle)
  const subtitle = getStringValue(content.subtitle)
  const description = getStringValue(content.description)
  const primaryButton = getStringValue(content.primaryButton)
  const secondaryButton = getStringValue(content.secondaryButton)
  const trustIndicator = getStringValue(content.trustIndicator)
  const trustIndicatorSubtext = getStringValue(content.trustIndicatorSubtext)
  const trustIndicatorSecondary = getStringValue(content.trustIndicatorSecondary)
  const trustIndicatorSecondarySubtext = getStringValue(content.trustIndicatorSecondarySubtext)

  // Helper function to get position classes for floating elements
  const getPositionClasses = (position: { vertical: 'top' | 'center' | 'bottom', horizontal: 'left' | 'center' | 'right' }, useNegative = false) => {
    let verticalClass = ''
    let horizontalClass = ''
    let transformClass = ''
    
    // Vertical positioning
    if (position.vertical === 'top') {
      verticalClass = useNegative ? '-top-6' : 'top-6'
    } else if (position.vertical === 'center') {
      verticalClass = 'top-1/2'
      transformClass = '-translate-y-1/2'
    } else {
      verticalClass = useNegative ? '-bottom-6' : 'bottom-6'
    }
    
    // Horizontal positioning
    if (position.horizontal === 'left') {
      horizontalClass = useNegative ? '-left-6' : 'left-6'
    } else if (position.horizontal === 'center') {
      horizontalClass = 'left-1/2'
      transformClass = transformClass ? `${transformClass} -translate-x-1/2` : '-translate-x-1/2'
    } else {
      horizontalClass = useNegative ? '-right-6' : 'right-6'
    }
    
    return `${verticalClass} ${horizontalClass} ${transformClass}`.trim()
  }

  return (
    <section id={content.sectionId || 'home'} className="bg-cream-gradient py-20 lg:py-32 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className={`transition-all duration-1000 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}>
            {/* Badge */}
            {content.badgeEnabled !== false && badge && (
              <div className="mb-6">
                <span
                  className="inline-block px-4 py-2 rounded-full mb-4"
                  style={{
                    fontFamily: styles.badge?.fontFamily || defaultStyles.badge.fontFamily,
                    fontSize: styles.badge?.fontSize || defaultStyles.badge.fontSize,
                    fontWeight: styles.badge?.fontWeight || defaultStyles.badge.fontWeight,
                    color: styles.badge?.color || defaultStyles.badge.color,
                    backgroundColor: styles.badge?.backgroundColor || defaultStyles.badge.backgroundColor,
                  }}
                >
                  {badge}
                </span>
              </div>
            )}
            
            {/* Main Title with Highlighted Words */}
            {mainTitle && (() => {
              const words = mainTitle.split(' ')
              const highlightedIndices = content.highlightedWordIndices || []
              
              // Eğer hiç vurgulanan kelime yoksa, eski davranışı koru (3. kelime)
              const defaultHighlightIndex = highlightedIndices.length === 0 ? 2 : null
              
              return (
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-tight mb-6">
                  {words.map((word, index) => {
                    const isHighlighted = highlightedIndices.includes(index) || (defaultHighlightIndex !== null && index === defaultHighlightIndex)
                    
                    if (isHighlighted) {
                      return (
                        <span key={index} className="relative inline-block">
                          <span
                            style={{
                              fontFamily: styles.highlightedText?.fontFamily || defaultStyles.highlightedText.fontFamily,
                              fontWeight: styles.highlightedText?.fontWeight || defaultStyles.highlightedText.fontWeight,
                              color: styles.highlightedText?.color || defaultStyles.highlightedText.color,
                            }}
                          >
                            {word}
                          </span>
                          <svg
                            className="absolute -bottom-2 left-0 w-full h-3"
                            style={{ color: `${styles.highlightedText?.color || defaultStyles.highlightedText.color}40` }}
                            viewBox="0 0 200 12"
                            fill="currentColor"
                            preserveAspectRatio="none"
                          >
                            <path d="M0,7 Q50,0 100,7 T200,7 L200,12 L0,12 Z" />
                          </svg>
                          {index < words.length - 1 && ' '}
                        </span>
                      )
                    } else {
                      return (
                        <span
                          key={index}
                          style={{
                            fontFamily: styles.mainTitle?.fontFamily || defaultStyles.mainTitle.fontFamily,
                            fontWeight: styles.mainTitle?.fontWeight || defaultStyles.mainTitle.fontWeight,
                            color: styles.mainTitle?.color || defaultStyles.mainTitle.color,
                          }}
                        >
                          {word}{index < words.length - 1 && ' '}
                        </span>
                      )
                    }
                  })}
                </h1>
              )
            })()}

            {/* Subtitle */}
            {subtitle && (
              <p
                className="text-xl lg:text-2xl leading-relaxed mb-8 max-w-lg"
                style={{
                  fontFamily: styles.subtitle?.fontFamily || defaultStyles.subtitle.fontFamily,
                  fontWeight: styles.subtitle?.fontWeight || defaultStyles.subtitle.fontWeight,
                  color: styles.subtitle?.color || defaultStyles.subtitle.color,
                }}
              >
                {subtitle}
              </p>
            )}

            {/* Description */}
            {description && (
              <div
                className="text-lg leading-relaxed mb-8 max-w-2xl prose prose-lg"
                style={{
                  fontFamily: styles.description?.fontFamily || defaultStyles.description.fontFamily,
                  fontWeight: styles.description?.fontWeight || defaultStyles.description.fontWeight,
                  color: styles.description?.color || defaultStyles.description.color,
                }}
              >
                <style dangerouslySetInnerHTML={{ __html: `
                  .hero-description p {
                    margin: 0.75rem 0;
                  }
                  .hero-description p[data-spacing="compact"] {
                    margin: 0.25rem 0;
                  }
                  .hero-description p[data-spacing="normal"] {
                    margin: 0.75rem 0;
                  }
                  .hero-description p[data-spacing="relaxed"] {
                    margin: 1.25rem 0;
                  }
                  .hero-description ul {
                    list-style-type: disc;
                    padding-left: 1.5rem;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                  }
                  .hero-description ul[data-marker="check"],
                  .hero-description ul[data-marker="arrow"],
                  .hero-description ul[data-marker="arrow-right"],
                  .hero-description ul[data-marker="star"],
                  .hero-description ul[data-marker="diamond"],
                  .hero-description ul[data-marker="dash"],
                  .hero-description ul[data-marker="dot"] {
                    list-style: none;
                    padding-left: 0;
                  }
                  .hero-description ul[data-marker="check"] li::before { content: "✓"; position: absolute; left: 0; color: #637554; font-weight: bold; }
                  .hero-description ul[data-marker="check-circle"] li::before { 
                    content: "✓"; 
                    position: absolute; 
                    left: 0; 
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 1.2em;
                    height: 1.2em;
                    border-radius: 50%;
                    background-color: #9CAF88;
                    color: white;
                    font-size: 0.8em;
                    font-weight: bold;
                  }
                  .hero-description ul[data-marker="arrow"] li::before { content: "→"; position: absolute; left: 0; color: #637554; font-weight: bold; }
                  .hero-description ul[data-marker="arrow-right"] li::before { content: "▶"; position: absolute; left: 0; color: #637554; font-weight: bold; }
                  .hero-description ul[data-marker="star"] li::before { content: "★"; position: absolute; left: 0; color: #637554; font-weight: bold; }
                  .hero-description ul[data-marker="diamond"] li::before { content: "◆"; position: absolute; left: 0; color: #637554; font-weight: bold; }
                  .hero-description ul[data-marker="dash"] li::before { content: "—"; position: absolute; left: 0; color: #637554; font-weight: bold; }
                  .hero-description ul[data-marker="dot"] li::before { content: "•"; position: absolute; left: 0; color: #637554; font-weight: bold; }
                  .hero-description ul[data-marker="check"] li,
                  .hero-description ul[data-marker="check-circle"] li,
                  .hero-description ul[data-marker="arrow"] li,
                  .hero-description ul[data-marker="arrow-right"] li,
                  .hero-description ul[data-marker="star"] li,
                  .hero-description ul[data-marker="diamond"] li,
                  .hero-description ul[data-marker="dash"] li,
                  .hero-description ul[data-marker="dot"] li {
                    position: relative;
                    padding-left: 1.5rem;
                    margin-left: 0;
                  }
                  .hero-description ol {
                    list-style-type: decimal;
                    padding-left: 1.5rem;
                    margin-top: 0.5rem;
                    margin-bottom: 0.5rem;
                  }
                  .hero-description li {
                    margin-top: 0.25rem;
                    margin-bottom: 0.25rem;
                  }
                  .hero-description a {
                    color: #637554;
                    text-decoration: underline;
                    transition: color 0.2s;
                  }
                  .hero-description a:hover {
                    color: #9CAF88;
                  }
                `}} />
                <div className="hero-description" dangerouslySetInnerHTML={{ __html: description }} />
              </div>
            )}

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              {primaryButton && (
                <Link
                  href={content.primaryButtonLink || '#'}
                  className={`group px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${primaryBtnHover ? 'shadow-medium -translate-y-2' : ''}`}
                  onMouseEnter={() => setPrimaryBtnHover(true)}
                  onMouseLeave={() => setPrimaryBtnHover(false)}
                  style={{
                    fontFamily: styles.primaryButton?.fontFamily || defaultStyles.primaryButton.fontFamily,
                    fontSize: styles.primaryButton?.fontSize || defaultStyles.primaryButton.fontSize,
                    fontWeight: styles.primaryButton?.fontWeight || defaultStyles.primaryButton.fontWeight,
                    color: styles.primaryButton?.color || defaultStyles.primaryButton.color,
                    backgroundColor: primaryBtnHover
                      ? '#6B8A3A'
                      : (styles.primaryButton?.backgroundColor || defaultStyles.primaryButton.backgroundColor),
                  }}
                >
                  {content.primaryButtonIcon ? (
                    <>
                      {content.primaryButtonIconPosition === 'right' ? (
                        <>
                          {primaryButton}
                          <div 
                            className={`h-5 w-5 transition-transform ${primaryBtnHover ? 'scale-110' : ''}`}
                            dangerouslySetInnerHTML={{ __html: content.primaryButtonIcon }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          />
                        </>
                      ) : (
                        <>
                          <div 
                            className={`h-5 w-5 transition-transform ${primaryBtnHover ? 'scale-110' : ''}`}
                            dangerouslySetInnerHTML={{ __html: content.primaryButtonIcon }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          />
                          {primaryButton}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <svg className={`h-5 w-5 transition-transform ${primaryBtnHover ? 'scale-110' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {primaryButton}
                    </>
                  )}
                </Link>
              )}

              {secondaryButton && (
                <Link
                  href={content.secondaryButtonLink || '#'}
                  className={`group border-2 px-8 py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 ${secondaryBtnHover ? 'shadow-medium -translate-y-2' : ''}`}
                  onMouseEnter={() => setSecondaryBtnHover(true)}
                  onMouseLeave={() => setSecondaryBtnHover(false)}
                  style={{
                    fontFamily: styles.secondaryButton?.fontFamily || defaultStyles.secondaryButton.fontFamily,
                    fontSize: styles.secondaryButton?.fontSize || defaultStyles.secondaryButton.fontSize,
                    fontWeight: styles.secondaryButton?.fontWeight || defaultStyles.secondaryButton.fontWeight,
                    color: secondaryBtnHover
                      ? '#FFFFFF'
                      : (styles.secondaryButton?.color || defaultStyles.secondaryButton.color),
                    borderColor: styles.secondaryButton?.borderColor || defaultStyles.secondaryButton.borderColor,
                    backgroundColor: secondaryBtnHover
                      ? (styles.secondaryButton?.borderColor || defaultStyles.secondaryButton.borderColor)
                      : 'transparent',
                  }}
                >
                  {content.secondaryButtonIcon ? (
                    <>
                      {content.secondaryButtonIconPosition === 'right' ? (
                        <>
                          {secondaryButton}
                          <div 
                            className={`h-5 w-5 transition-transform ${secondaryBtnHover ? 'scale-110' : ''}`}
                            dangerouslySetInnerHTML={{ __html: content.secondaryButtonIcon }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          />
                        </>
                      ) : (
                        <>
                          <div 
                            className={`h-5 w-5 transition-transform ${secondaryBtnHover ? 'scale-110' : ''}`}
                            dangerouslySetInnerHTML={{ __html: content.secondaryButtonIcon }}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          />
                          {secondaryButton}
                        </>
                      )}
                    </>
                  ) : (
                    <>
                      <svg className={`h-5 w-5 transition-transform ${secondaryBtnHover ? 'translate-y-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      {secondaryButton}
                    </>
                  )}
                </Link>
              )}
            </div>

            {/* Trust Indicator */}
            {trustIndicator && (
              <div className="flex items-center gap-8">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {['🙋🏻‍♀️', '🙋🏻‍♂️', '🙋🏼‍♀️', '🙋🏽‍♂️'].map((emoji, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-white"
                        style={{ backgroundColor: styles.badge?.backgroundColor || defaultStyles.badge.backgroundColor }}
                      >
                        <span className="text-sm">{emoji}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div
                      style={{
                        fontFamily: styles.trustIndicator?.fontFamily || defaultStyles.trustIndicator.fontFamily,
                        fontWeight: styles.trustIndicator?.fontWeight || defaultStyles.trustIndicator.fontWeight,
                        color: styles.trustIndicator?.color || defaultStyles.trustIndicator.color,
                      }}
                    >
                      {trustIndicator}
                    </div>
                    {trustIndicatorSubtext && (
                      <div className="text-xs" style={{ color: styles.subtitle?.color || defaultStyles.subtitle.color }}>
                        {trustIndicatorSubtext}
                      </div>
                    )}
                  </div>
                </div>

                {(trustIndicatorSecondary || trustIndicatorSecondarySubtext) && (
                  <>
                    <div className="hidden sm:block w-px h-12 bg-gray-200"></div>

                    <div className="text-sm">
                      {trustIndicatorSecondary && (
                        <div
                          style={{
                            fontFamily: styles.trustIndicator?.fontFamily || defaultStyles.trustIndicator.fontFamily,
                            fontWeight: styles.trustIndicator?.fontWeight || defaultStyles.trustIndicator.fontWeight,
                            color: styles.trustIndicator?.color || defaultStyles.trustIndicator.color,
                          }}
                        >
                          {trustIndicatorSecondary}
                        </div>
                      )}
                      {trustIndicatorSecondarySubtext && (
                        <div className="text-xs" style={{ color: styles.subtitle?.color || defaultStyles.subtitle.color }}>
                          {trustIndicatorSecondarySubtext}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Image Content */}
          {content.image?.url && (
            <div className={`transition-all duration-1000 delay-300 transform ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="relative">
                <div
                  className="relative h-96 lg:h-[600px] overflow-hidden group"
                  style={{
                    borderRadius: imageStyles.borderRadius || defaultImageStyles.borderRadius,
                    boxShadow: imageStyles.boxShadow || defaultImageStyles.boxShadow,
                  }}
                  onMouseEnter={() => setImageHover(true)}
                  onMouseLeave={() => setImageHover(false)}
                >
                  <Image
                    src={content.image.url}
                    alt={content.image.alt || 'Hero görsel'}
                    fill
                    sizes="100vw"
                    className="object-cover transition-all duration-700"
                    style={{
                      opacity: parseInt(imageStyles.opacity || defaultImageStyles.opacity) / 100,
                      transform: imageHover
                        ? `scale(${parseInt(imageStyles.hoverScale || defaultImageStyles.hoverScale) / 100})`
                        : 'scale(1)',
                      filter: `brightness(${imageStyles.brightness || defaultImageStyles.brightness}%) contrast(${imageStyles.contrast || defaultImageStyles.contrast}%) saturate(${imageStyles.saturation || defaultImageStyles.saturation}%)`,
                    }}
                    priority
                  />

                  {/* Gradient Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t to-transparent transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(to top, ${imageStyles.overlayColor || defaultImageStyles.overlayColor}${Math.round((parseInt(imageStyles.overlayOpacity || defaultImageStyles.overlayOpacity) / 100) * 255).toString(16).padStart(2, '0')}, transparent)`,
                    }}
                  ></div>
                  
                  {/* Status Badge - Inside image container */}
                  {(() => {
                    // Use editable values if available, otherwise use original hardcoded values
                    const statusBadge = content.imageFloatingElements?.statusBadge
                    const isEnabled = statusBadge?.enabled !== false
                    const shouldShow = content.imageFloatingElements ? isEnabled : true // Default to true if not defined
                    
                    if (!shouldShow) return null
                    
                    const text = statusBadge?.text || 'Jetzt geöffnet'
                    // Use custom position if set, otherwise use original hardcoded position
                    const position = statusBadge?.position
                    const positionClass = position ? getPositionClasses(position, false) : 'top-6 left-6'
                    
                    return (
                      <div className={`absolute ${positionClass} bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-medium`}>
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span className="text-sm font-medium text-charcoal">{text}</span>
                        </div>
                      </div>
                    )
                  })()}
                </div>

                {/* Premium Card - Outside image container, inside parent relative div */}
                {(() => {
                  const premiumCard = content.imageFloatingElements?.premiumCard
                  const isEnabled = premiumCard?.enabled !== false
                  const shouldShow = content.imageFloatingElements ? isEnabled : true // Default to true if not defined
                  
                  if (!shouldShow) return null
                  
                  const emoji = premiumCard?.emoji || '🧘🏻‍♀️'
                  const title = premiumCard?.title || 'Premium Headspa'
                  const subtitle = premiumCard?.subtitle || '90 Min • ab 85€'
                  // Use custom position if set, otherwise use original hardcoded position
                  const position = premiumCard?.position
                  const positionClass = position ? getPositionClasses(position, true) : '-bottom-6 -left-6'
                  
                  return (
                    <div className={`absolute ${positionClass} bg-white p-4 rounded-2xl shadow-medium max-w-xs`}>
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

                {/* Reviews Badge - Outside image container, inside parent relative div */}
                {(() => {
                  const reviewsBadge = content.imageFloatingElements?.reviewsBadge
                  const isEnabled = reviewsBadge?.enabled !== false
                  const shouldShow = content.imageFloatingElements ? isEnabled : true // Default to true if not defined
                  
                  if (!shouldShow) return null
                  
                  const rating = reviewsBadge?.rating || '4.9'
                  const text = reviewsBadge?.text || 'Google Reviews'
                  // Use custom position if set, otherwise use original hardcoded position
                  const position = reviewsBadge?.position
                  const positionClass = position ? getPositionClasses(position, true) : '-top-6 -right-6'
                  
                  return (
                    <div className={`absolute ${positionClass} bg-sage-500 text-white p-4 rounded-2xl shadow-medium`}>
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
                <div className="absolute -z-10 top-20 -left-20 w-40 h-40 bg-sage-200 rounded-full opacity-20 animate-float"></div>
                <div className="absolute -z-10 bottom-20 -right-20 w-32 h-32 bg-earth-200 rounded-full opacity-20 animate-float" style={{animationDelay: '1s'}}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll Indicator */}
      {content.scrollIndicator?.enabled !== false && (() => {
        const position = content.scrollIndicator?.position || { vertical: 'bottom', horizontal: 'center' }
        const text = content.scrollIndicator?.text || 'Scrollen Sie nach unten'
        
        // Position classes - build dynamically to handle center positioning correctly
        let verticalClass = ''
        let horizontalClass = ''
        let transformClass = ''
        
        // Vertical positioning
        if (position.vertical === 'top') {
          verticalClass = 'top-8'
        } else if (position.vertical === 'center') {
          verticalClass = 'top-1/2'
          transformClass = transformClass ? `${transformClass} -translate-y-1/2` : '-translate-y-1/2'
        } else {
          verticalClass = 'bottom-8'
        }
        
        // Horizontal positioning
        if (position.horizontal === 'left') {
          horizontalClass = 'left-8'
        } else if (position.horizontal === 'center') {
          horizontalClass = 'left-1/2'
          transformClass = transformClass ? `${transformClass} -translate-x-1/2` : '-translate-x-1/2'
        } else {
          horizontalClass = 'right-8'
        }
        
        // Combine all classes
        const positionClasses = `${verticalClass} ${horizontalClass} ${transformClass}`.trim()
        
        return (
          <div className={`absolute ${positionClasses}`}>
            <div className="flex flex-col items-center gap-2 animate-bounce">
              {text && (
                <span className="text-sm text-gray-custom">{text}</span>
              )}
              <svg className="h-6 w-6 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        )
      })()}
    </section>
  )
}

