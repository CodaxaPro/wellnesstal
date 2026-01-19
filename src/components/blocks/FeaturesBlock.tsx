'use client'

import { useState, useEffect, useRef } from 'react'

import Image from 'next/image'

import { normalizeImageUrl, getImageProps } from '@/lib/image-utils'

import { PRESET_ICONS } from './editors/features/defaults'
import { BlockProps, FeaturesContent, FeatureItem } from './types'

// Shadow class mapping
const shadowClasses: Record<string, string> = {
  none: '',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
  '2xl': 'shadow-2xl',
}

// Icon size mapping
const iconSizes: Record<string, { container: string; icon: number }> = {
  sm: { container: 'w-10 h-10', icon: 16 },
  md: { container: 'w-12 h-12', icon: 20 },
  lg: { container: 'w-14 h-14', icon: 24 },
  xl: { container: 'w-16 h-16', icon: 28 },
}

// Max width mapping
const maxWidthClasses: Record<string, string> = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
}

function FeatureIcon({
  name,
  size = 24,
  color = 'currentColor'
}: {
  name: string
  size?: number
  color?: string
}) {
  const path = PRESET_ICONS[name]
  if (!path) {
return null
}

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d={path} />
    </svg>
  )
}

function FeatureCard({
  feature,
  content,
  index,
  isVisible
}: {
  feature: FeatureItem
  content: FeaturesContent
  index: number
  isVisible: boolean
}) {
  const cardStyles = content.cardStyles || {}
  const iconStyles = content.iconStyles || {}
  const typography = content.typography || {}
  const animations = content.animations || {}

  // Don't render if not visible
  if (feature.visible === false) {
return null
}

  // Get icon name
  const iconName = feature.iconConfig?.value || feature.icon || 'star'
  const iconBg = feature.iconConfig?.backgroundColor || iconStyles.backgroundColor || '#10b981'
  const iconColor = feature.iconConfig?.iconColor || iconStyles.iconColor || '#ffffff'
  const iconSize = iconStyles.size || 'md'

  // Get animation transform based on type
  const getAnimationTransform = () => {
    if (isVisible) {
return 'translate(0, 0) scale(1) rotateX(0deg)'
}

    switch (animations.type) {
      case 'fade': return 'translate(0, 0) scale(1)'
      case 'slide-up': return 'translate(0, 30px) scale(1)'
      case 'slide-left': return 'translate(-30px, 0) scale(1)'
      case 'slide-right': return 'translate(30px, 0) scale(1)'
      case 'zoom': return 'translate(0, 0) scale(0.8)'
      case 'flip': return 'translate(0, 0) scale(1) rotateX(90deg)'
      default: return 'translate(0, 20px) scale(1)'
    }
  }

  // Build inline styles
  const cardStyle: React.CSSProperties = {
    backgroundColor: feature.styles?.backgroundColor || cardStyles.backgroundColor || '#ffffff',
    borderStyle: cardStyles.borderStyle || 'solid',
    borderWidth: cardStyles.borderWidth || 1,
    borderColor: feature.styles?.borderColor || cardStyles.borderColor || '#e2e8f0',
    borderRadius: feature.styles?.borderRadius || cardStyles.borderRadius || '1rem',
    padding: `${cardStyles.paddingY || '2rem'} ${cardStyles.paddingX || '1.5rem'}`,
    transition: `all ${animations.duration || 500}ms ease`,
    opacity: isVisible ? 1 : 0,
    transform: getAnimationTransform(),
  }

  // Animation delay for stagger effect
  const animationDelay = animations.stagger
    ? `${index * (animations.staggerDelay || 100)}ms`
    : '0ms'

  // Icon shadow class
  const iconShadowClass = shadowClasses[iconStyles.shadow || 'none']

  // Icon container style
  const iconContainerStyle: React.CSSProperties = {
    backgroundColor: iconBg,
    borderWidth: iconStyles.borderWidth || 0,
    borderColor: iconStyles.borderColor || 'transparent',
    borderStyle: 'solid',
  }

  // Content gap style
  const contentGap = cardStyles.contentGap || '1rem'

  // Get icon shape class
  const iconShapeClass = {
    circle: 'rounded-full',
    square: 'rounded-none',
    rounded: 'rounded-xl',
    none: '',
  }[iconStyles.shape || 'circle']

  // Icon hover animation class
  const iconHoverAnimationMap: Record<string, string> = {
    none: '',
    bounce: 'group-hover:animate-bounce',
    pulse: 'group-hover:animate-pulse',
    spin: 'group-hover:animate-spin',
    wiggle: 'group-hover:animate-wiggle',
    scale: 'group-hover:scale-110',
    rotate: 'group-hover:rotate-12',
    shake: 'group-hover:animate-pulse', // fallback for shake
  }
  const iconHoverClass = iconHoverAnimationMap[iconStyles.hoverAnimation || animations.iconAnimation || 'none'] || ''

  // Hover effect class
  const hoverEffectMap: Record<string, string> = {
    none: '',
    lift: 'hover:-translate-y-2',
    scale: 'hover:scale-105',
    glow: 'hover:ring-4 hover:ring-sage-200',
    'border-color': 'hover:border-sage-500',
    'bg-color': 'hover:bg-sage-50',
  }
  const hoverEffectClass = hoverEffectMap[cardStyles.hoverEffect || 'lift'] || ''

  return (
    <div
      className={`group relative feature-card ${shadowClasses[cardStyles.shadow || 'sm']} hover:${shadowClasses[cardStyles.shadowHover || 'md']} ${hoverEffectClass} transition-all duration-300`}
      style={{
        ...cardStyle,
        transitionDelay: animationDelay,
      }}
    >
      {/* Badge */}
      {feature.badge && feature.badge.position !== 'inline' && (
        <div
          className={`absolute text-xs font-medium px-2 py-1 rounded-full ${
            feature.badge.position === 'top-left' ? 'top-3 left-3' :
            feature.badge.position === 'top-right' ? 'top-3 right-3' : ''
          }`}
          style={{
            backgroundColor: feature.badge.backgroundColor || '#10b981',
            color: feature.badge.textColor || '#ffffff',
          }}
        >
          {feature.badge.text}
        </div>
      )}

      {/* Icon - Top Position */}
      {content.showIcons !== false && iconStyles.position === 'top' && iconStyles.showIcons !== false && (
        <div className="flex justify-center feature-icon-wrapper" style={{ marginBottom: contentGap }}>
          <div
            className={`feature-icon flex items-center justify-center ${iconSizes[iconSize].container} ${iconShapeClass} ${iconHoverClass} ${iconShadowClass} transition-transform`}
            style={iconContainerStyle}
          >
            <FeatureIcon
              name={iconName}
              size={iconSizes[iconSize].icon}
              color={iconColor}
            />
          </div>
        </div>
      )}

      {/* Content Container for icon-left/right layouts */}
      <div className={`feature-card-content ${
        iconStyles.position === 'left' || iconStyles.position === 'right'
          ? 'flex items-start'
          : ''
      } ${iconStyles.position === 'right' ? 'flex-row-reverse' : ''}`}
        style={{ gap: iconStyles.position === 'left' || iconStyles.position === 'right' ? contentGap : undefined }}
      >
        {/* Icon - Left/Right Position */}
        {content.showIcons !== false && (iconStyles.position === 'left' || iconStyles.position === 'right') && iconStyles.showIcons !== false && (
          <div
            className={`feature-icon flex-shrink-0 flex items-center justify-center ${iconSizes[iconSize].container} ${iconShapeClass} ${iconHoverClass} ${iconShadowClass} transition-transform`}
            style={iconContainerStyle}
          >
            <FeatureIcon
              name={iconName}
              size={iconSizes[iconSize].icon}
              color={iconColor}
            />
          </div>
        )}

        <div className={`flex-1 ${iconStyles.position === 'top' ? 'text-center' : ''}`}>
          {/* Title with inline icon */}
          <div className={`flex items-center gap-2 ${iconStyles.position === 'top' ? 'justify-center' : ''}`}>
            {content.showIcons !== false && iconStyles.position === 'inline-title' && iconStyles.showIcons !== false && (
              <div
                className={`feature-icon flex-shrink-0 flex items-center justify-center ${iconSizes[iconSize].container} ${iconShapeClass} ${iconShadowClass}`}
                style={iconContainerStyle}
              >
                <FeatureIcon
                  name={iconName}
                  size={iconSizes[iconSize].icon}
                  color={iconColor}
                />
              </div>
            )}
            <h3
              className="font-semibold"
              style={{
                fontSize: typography.featureTitle?.fontSize || '1.25rem',
                fontWeight: typography.featureTitle?.fontWeight || '600',
                color: feature.styles?.textColor || typography.featureTitle?.color || '#1e293b',
                lineHeight: typography.featureTitle?.lineHeight || '1.4',
              }}
            >
              {feature.title}
            </h3>
            {/* Inline badge */}
            {feature.badge && feature.badge.position === 'inline' && (
              <span
                className="text-xs font-medium px-2 py-0.5 rounded-full"
                style={{
                  backgroundColor: feature.badge.backgroundColor || '#10b981',
                  color: feature.badge.textColor || '#ffffff',
                }}
              >
                {feature.badge.text}
              </span>
            )}
          </div>

          {/* Description */}
          {content.showDescriptions !== false && feature.description && (
            <p
              className="mt-2"
              style={{
                fontSize: typography.featureDescription?.fontSize || '1rem',
                fontWeight: typography.featureDescription?.fontWeight || '400',
                color: typography.featureDescription?.color || '#64748b',
                lineHeight: typography.featureDescription?.lineHeight || '1.6',
              }}
            >
              {feature.description}
            </p>
          )}

          {/* Features List (Checkmark List) */}
          {feature.showFeaturesList !== false && feature.featuresList && feature.featuresList.length > 0 && (
            <ul className="mt-4 space-y-2">
              {feature.featuresList.filter(item => item.enabled !== false).map((item, idx) => (
                <li key={item.id || idx} className="flex items-start gap-2">
                  <svg
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    style={{ color: '#9CAF88' }}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span
                    style={{
                      fontSize: typography.featureDescription?.fontSize || '1rem',
                      fontWeight: typography.featureDescription?.fontWeight || '400',
                      color: typography.featureDescription?.color || '#64748b',
                      lineHeight: typography.featureDescription?.lineHeight || '1.6',
                    }}
                  >
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/* Link/CTA */}
          {content.showLinks && feature.link?.enabled && (
            <a
              href={feature.link.url}
              target={feature.link.openInNewTab ? '_blank' : undefined}
              rel={feature.link.openInNewTab ? 'noopener noreferrer' : undefined}
              className={`inline-flex items-center gap-1 mt-4 ${
                feature.link.style === 'button'
                  ? 'px-4 py-2 bg-sage-500 text-white rounded-lg hover:bg-sage-600'
                  : 'text-sage-600 hover:text-sage-700'
              } font-medium transition-colors`}
            >
              {feature.link.text || 'Daha Fazla'}
              {feature.link.style === 'arrow' && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              )}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// Carousel Component
function FeaturesCarousel({
  features,
  content
}: {
  features: FeatureItem[]
  content: FeaturesContent
}) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const carousel = content.carousel || {
    autoPlay: false,
    autoPlayInterval: 5000,
    showDots: true,
    showArrows: true,
    slidesPerView: 3,
    loop: true
  }

  const visibleFeatures = features.filter(f => f.visible !== false)
  const totalSlides = Math.ceil(visibleFeatures.length / carousel.slidesPerView)

  // Auto play
  useEffect(() => {
    if (!carousel.autoPlay) {
return
}

    const interval = setInterval(() => {
      setCurrentSlide(prev => {
        if (carousel.loop) {
          return (prev + 1) % totalSlides
        }
        return prev < totalSlides - 1 ? prev + 1 : prev
      })
    }, carousel.autoPlayInterval)

    return () => clearInterval(interval)
  }, [carousel.autoPlay, carousel.autoPlayInterval, carousel.loop, totalSlides])

  const goToSlide = (index: number) => setCurrentSlide(index)

  const goNext = () => {
    if (carousel.loop) {
      setCurrentSlide((prev) => (prev + 1) % totalSlides)
    } else if (currentSlide < totalSlides - 1) {
      setCurrentSlide(prev => prev + 1)
    }
  }

  const goPrev = () => {
    if (carousel.loop) {
      setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
    } else if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1)
    }
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => (
            <div
              key={slideIndex}
              className="w-full flex-shrink-0 grid gap-6"
              style={{
                gridTemplateColumns: `repeat(${carousel.slidesPerView}, 1fr)`,
                padding: '0 1rem',
              }}
            >
              {visibleFeatures
                .slice(slideIndex * carousel.slidesPerView, (slideIndex + 1) * carousel.slidesPerView)
                .map((feature, index) => (
                  <FeatureCard
                    key={feature.id || index}
                    feature={feature}
                    content={content}
                    index={index}
                    isVisible
                  />
                ))}
            </div>
          ))}
        </div>
      </div>

      {/* Arrows */}
      {carousel.showArrows && totalSlides > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors z-10"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={goNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-slate-50 transition-colors z-10"
          >
            <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {carousel.showDots && totalSlides > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                currentSlide === index ? 'bg-sage-500 w-8' : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default function FeaturesBlock({ block }: BlockProps) {
  const content = block.content as FeaturesContent
  const features = content.features || []
  const columns = content.columns || content.responsive?.desktop || 3
  const typography = content.typography || {}
  const background = content.background || {}
  const animations = content.animations || {}
  const responsive = content.responsive || {}

  // Visibility tracking for scroll animations
  const [isVisible, setIsVisible] = useState(!animations.triggerOnScroll)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!animations.enabled || !animations.triggerOnScroll) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [animations.enabled, animations.triggerOnScroll])

  // Get grid columns class based on layout
  const getGridClass = () => {
    if (content.layout === 'list' || content.layout === 'centered-stack') {
      return 'grid-cols-1'
    }

    const desktop = content.responsive?.desktop || columns || 3
    const tablet = content.responsive?.tablet || 2
    const mobile = content.responsive?.mobile || 1

    return `grid-cols-${mobile} md:grid-cols-${tablet} lg:grid-cols-${desktop}`
  }

  // Build background style
  const getBackgroundStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {}

    switch (background.type) {
      case 'solid':
        style.backgroundColor = background.color || '#ffffff'
        break
      case 'gradient':
        const direction = background.gradientDirection?.replace('to-', 'to ').replace('-', ' ') || 'to right'
        style.background = `linear-gradient(${direction}, ${background.gradientFrom || '#10b981'}${
          background.gradientVia ? `, ${background.gradientVia}` : ''
        }, ${background.gradientTo || '#3b82f6'})`
        break
      case 'image':
        if (background.imageUrl) {
          style.backgroundImage = `url(${background.imageUrl})`
          style.backgroundSize = 'cover'
          style.backgroundPosition = 'center'
        }
        break
      case 'pattern':
        const patternColor = background.color || '#e2e8f0'
        style.backgroundColor = '#ffffff'
        switch (background.pattern) {
          case 'dots':
            style.backgroundImage = `radial-gradient(${patternColor} 1.5px, transparent 1.5px)`
            style.backgroundSize = '20px 20px'
            break
          case 'grid':
            style.backgroundImage = `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`
            style.backgroundSize = '20px 20px'
            break
          case 'waves':
            style.backgroundImage = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='${encodeURIComponent(patternColor)}' fill-opacity='0.4' d='M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`
            style.backgroundRepeat = 'repeat-x'
            style.backgroundSize = '100% auto'
            style.backgroundPosition = 'bottom'
            break
          case 'geometric':
            style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(patternColor)}' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            break
        }
        break
    }

    return style
  }

  // Header alignment class
  const headerAlignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[content.headerAlignment || 'center']

  // Render zigzag layout
  const renderZigzag = () => {
    const visibleFeatures = features.filter(f => f.visible !== false)
    return (
      <div className="space-y-12">
        {visibleFeatures.map((feature, index) => {
          // Determine image position: use feature.image.position if set, otherwise auto (based on index)
          let imagePosition: 'left' | 'right'
          const explicitPosition = feature.image?.position

          if (explicitPosition === 'left') {
            imagePosition = 'left'
          } else if (explicitPosition === 'right') {
            imagePosition = 'right'
          } else {
            // Auto: alternate based on index
            imagePosition = index % 2 === 1 ? 'right' : 'left'
          }


          return (
          <div
            key={feature.id || index}
            className="flex flex-col lg:flex-row items-center gap-8"
            style={{
              flexDirection: imagePosition === 'right' ? 'row-reverse' : 'row'
            }}
          >
            {/* Image */}
            {feature.image?.url && (
              <div className="flex-1">
                <div
                  className="relative w-full rounded-xl overflow-hidden"
                  style={{
                    aspectRatio: feature.image.aspectRatio === '16:9' ? '16/9' :
                                 feature.image.aspectRatio === '4:3' ? '4/3' :
                                 feature.image.aspectRatio === '1:1' ? '1/1' :
                                 feature.image.aspectRatio === '3:2' ? '3/2' : 'auto',
                    borderRadius: feature.image.borderRadius || '1rem'
                  }}
                >
                  <Image
                    src={normalizeImageUrl(feature.image.url)}
                    alt={feature.image.alt || feature.title}
                    fill
                    className={`object-${feature.image.objectFit || 'cover'}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    onError={(e) => {
                      console.error('Image load error:', normalizeImageUrl(feature.image.url))
                      const target = e.target as HTMLImageElement
                      target.src = `https://via.placeholder.com/800x450/9CAF88/FFFFFF?text=${encodeURIComponent(feature.image.alt || feature.title || 'Image')}`
                    }}
                  />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="flex-1">
              <FeatureCard
                feature={feature}
                content={{ ...content, cardStyles: { ...content.cardStyles, shadow: 'none' as const } }}
                index={index}
                isVisible={isVisible}
              />
            </div>
          </div>
          )
        })}
      </div>
    )
  }

  // Render masonry layout
  const renderMasonry = () => {
    const visibleFeatures = features.filter(f => f.visible !== false)
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
        {visibleFeatures.map((feature, index) => (
          <div key={feature.id || index} className="break-inside-avoid">
            <FeatureCard
              feature={feature}
              content={content}
              index={index}
              isVisible={isVisible}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <section
      ref={sectionRef}
      className={`relative ${content.customClass || ''}`}
      style={{
        ...getBackgroundStyle(),
        paddingTop: content.padding?.top || '5rem',
        paddingBottom: content.padding?.bottom || '5rem',
        paddingLeft: content.padding?.left || '1.5rem',
        paddingRight: content.padding?.right || '1.5rem',
      }}
    >
      {/* Background Overlay for images */}
      {background.type === 'image' && background.imageOverlayOpacity && background.imageOverlayOpacity > 0 && (
        <div
          className="absolute inset-0 bg-black"
          style={{ opacity: background.imageOverlayOpacity / 100 }}
        />
      )}

      <div
        className={`relative mx-auto ${maxWidthClasses[content.maxWidth || 'xl']}`}
        style={content.maxWidth === 'custom' && content.customMaxWidth ? { maxWidth: content.customMaxWidth } : {}}
      >
        {/* Section Header */}
        {(content.showTitle !== false && content.title) || (content.showSubtitle !== false && content.subtitle) ? (
          <div className={`mb-12 ${headerAlignClass}`}>
            {content.showTitle !== false && content.title && (
              <h2
                style={{
                  fontSize: typography.sectionTitle?.fontSize || '2.5rem',
                  fontWeight: typography.sectionTitle?.fontWeight || '700',
                  color: typography.sectionTitle?.color || '#1e293b',
                  marginBottom: typography.sectionTitle?.marginBottom || '1rem',
                }}
              >
                {content.title}
              </h2>
            )}

            {content.showSubtitle !== false && content.subtitle && (
              <p
                className={`${content.headerAlignment === 'center' ? 'mx-auto' : ''}`}
                style={{
                  fontSize: typography.sectionSubtitle?.fontSize || '1.125rem',
                  fontWeight: typography.sectionSubtitle?.fontWeight || '400',
                  color: typography.sectionSubtitle?.color || '#64748b',
                  maxWidth: typography.sectionSubtitle?.maxWidth || '600px',
                }}
              >
                {content.subtitle}
              </p>
            )}

            {content.showDivider && (
              <div
                className={`h-1 w-24 rounded-full mt-6 ${content.headerAlignment === 'center' ? 'mx-auto' : content.headerAlignment === 'right' ? 'ml-auto' : ''}`}
                style={{ backgroundColor: content.dividerColor || '#10b981' }}
              />
            )}
          </div>
        ) : null}

        {/* Features - Different layouts */}
        {content.layout === 'carousel' ? (
          <FeaturesCarousel features={features} content={content} />
        ) : content.layout === 'zigzag' ? (
          renderZigzag()
        ) : content.layout === 'masonry' ? (
          renderMasonry()
        ) : (
          <>
            {/* Responsive gap CSS */}
            <style>{`
              .features-grid-${block.id} {
                gap: ${responsive.mobileGap || content.gridGap || '1rem'};
              }
              @media (min-width: 768px) {
                .features-grid-${block.id} {
                  gap: ${responsive.tabletGap || content.gridGap || '1.5rem'};
                }
              }
              @media (min-width: 1024px) {
                .features-grid-${block.id} {
                  gap: ${responsive.desktopGap || content.gridGap || '2rem'};
                }
              }
              ${responsive.mobileHideIcons ? `
                @media (max-width: 767px) {
                  .features-grid-${block.id} .feature-icon {
                    display: none !important;
                  }
                }
              ` : ''}
              ${responsive.mobileStackIcons ? `
                @media (max-width: 767px) {
                  .features-grid-${block.id} .feature-card-content {
                    flex-direction: column;
                    text-align: center;
                  }
                  .features-grid-${block.id} .feature-icon-wrapper {
                    justify-content: center;
                    margin-bottom: 1rem;
                  }
                }
              ` : ''}
              ${responsive.mobileCardStyle === 'compact' ? `
                @media (max-width: 767px) {
                  .features-grid-${block.id} .feature-card {
                    padding: 1rem !important;
                  }
                }
              ` : ''}
              ${responsive.mobileCardStyle === 'minimal' ? `
                @media (max-width: 767px) {
                  .features-grid-${block.id} .feature-card {
                    padding: 0.75rem !important;
                    border: none !important;
                    box-shadow: none !important;
                  }
                }
              ` : ''}
            `}</style>
            <div
              className={`grid ${getGridClass()} features-grid-${block.id}`}
              style={{
                alignItems: content.alignItems || 'stretch',
              }}
            >
              {features.filter(f => f.visible !== false).map((feature, index) => (
                <FeatureCard
                  key={feature.id || index}
                  feature={feature}
                  content={content}
                  index={index}
                  isVisible={isVisible}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
