'use client'

import { useEffect, useState, useRef } from 'react'
import { BlockProps, HeroContent, HeroButton, ContentAlignment, HeroElementAlignments } from './types'

export default function HeroBlock({ block }: BlockProps) {
  const content = block.content as HeroContent
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef<HTMLElement>(null)

  // Animation on scroll into view
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (heroRef.current) {
      observer.observe(heroRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Defaults
  const layout = content.layout || 'split-right'
  const contentAlignment = content.contentAlignment || 'left'
  const verticalAlignment = content.verticalAlignment || 'center'
  const minHeight = content.minHeight || '600px'
  const animations = content.animations || { enabled: true, titleAnimation: 'slide-up', subtitleAnimation: 'fade', imageAnimation: 'fade', buttonAnimation: 'slide-up', staggerDelay: 100, duration: 600 }
  const responsive = content.responsive || { mobileLayout: 'stacked', mobileTextAlign: 'center', mobileImagePosition: 'top', tabletLayout: 'stacked', hideOnMobile: [], mobileMinHeight: '500px' }

  // Background styles
  const getBackgroundStyle = () => {
    const style: React.CSSProperties = {}

    switch (content.backgroundType) {
      case 'solid':
        style.backgroundColor = content.backgroundColor || '#f8fafc'
        break
      case 'gradient':
        if (content.gradientColors) {
          const direction = content.gradientColors.direction?.replace('to-', 'to ').replace('-', ' ') || 'to right'
          style.background = `linear-gradient(${direction}, ${content.gradientColors.from}${content.gradientColors.via ? `, ${content.gradientColors.via}` : ''}, ${content.gradientColors.to})`
        }
        break
      case 'image':
        if (content.backgroundImage) {
          style.backgroundImage = `url(${content.backgroundImage})`
          style.backgroundSize = 'cover'
          style.backgroundPosition = 'center'
        }
        break
      case 'pattern':
        // Pattern background support
        const patternColor = content.backgroundColor || '#e2e8f0'
        const bgColor = content.backgroundColor || '#ffffff'
        switch (content.backgroundPattern) {
          case 'dots':
            style.backgroundColor = bgColor
            style.backgroundImage = `radial-gradient(${patternColor} 1.5px, transparent 1.5px)`
            style.backgroundSize = '20px 20px'
            break
          case 'grid':
            style.backgroundColor = bgColor
            style.backgroundImage = `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`
            style.backgroundSize = '30px 30px'
            break
          case 'waves':
            style.backgroundColor = bgColor
            style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='${encodeURIComponent(patternColor)}' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
            break
          case 'geometric':
            style.backgroundColor = bgColor
            style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(patternColor)}' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            break
          default:
            style.backgroundColor = bgColor
        }
        break
      case 'video':
        // Video background is handled separately in layout
        style.backgroundColor = content.backgroundColor || '#000000'
        break
    }

    return style
  }

  // Layout classes
  const getLayoutClasses = () => {
    switch (layout) {
      case 'full-width':
        return 'flex flex-col items-center justify-center text-center'
      case 'split-left':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'
      case 'split-right':
        return 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'
      case 'centered':
        return 'flex flex-col items-center text-center max-w-4xl mx-auto'
      case 'overlay':
        return 'flex flex-col items-center justify-center text-center relative'
      case 'minimal':
        return 'flex flex-col items-center text-center max-w-3xl mx-auto'
      default:
        return 'grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12'
    }
  }

  // Content alignment classes (global fallback)
  const getAlignmentClasses = () => {
    const alignMap = {
      left: 'text-left items-start',
      center: 'text-center items-center',
      right: 'text-right items-end'
    }
    return alignMap[contentAlignment] || 'text-left items-start'
  }

  // Element-level alignment classes
  const getElementAlignmentClasses = (element: keyof HeroElementAlignments): string => {
    const elementAlignments = content.elementAlignments || {
      badge: contentAlignment,
      title: contentAlignment,
      subtitle: contentAlignment,
      description: contentAlignment,
      buttons: contentAlignment,
      trustIndicator: contentAlignment
    }
    const alignment = elementAlignments[element] || contentAlignment
    const alignMap = {
      left: 'text-left justify-start',
      center: 'text-center justify-center',
      right: 'text-right justify-end'
    }
    return alignMap[alignment] || 'text-left justify-start'
  }

  // Element flex alignment classes for wrapper divs
  const getElementFlexAlignment = (element: keyof HeroElementAlignments): string => {
    const elementAlignments = content.elementAlignments || {
      badge: contentAlignment,
      title: contentAlignment,
      subtitle: contentAlignment,
      description: contentAlignment,
      buttons: contentAlignment,
      trustIndicator: contentAlignment
    }
    const alignment = elementAlignments[element] || contentAlignment
    const alignMap = {
      left: 'items-start',
      center: 'items-center',
      right: 'items-end'
    }
    return alignMap[alignment] || 'items-start'
  }

  // Vertical alignment classes
  const getVerticalClasses = () => {
    const vMap = {
      top: 'justify-start',
      center: 'justify-center',
      bottom: 'justify-end'
    }
    return vMap[verticalAlignment] || 'justify-center'
  }

  // Animation classes
  const getAnimationClasses = (type: string, delay: number = 0) => {
    if (!animations?.enabled || !isVisible) return 'opacity-0'

    const baseStyle = {
      animationDelay: `${delay}ms`,
      animationDuration: `${animations.duration || 600}ms`,
      animationFillMode: 'forwards'
    }

    switch (type) {
      case 'fade':
        return 'animate-fadeIn'
      case 'slide-up':
        return 'animate-slideUp'
      case 'slide-down':
        return 'animate-slideDown'
      case 'slide-left':
        return 'animate-slideLeft'
      case 'slide-right':
        return 'animate-slideRight'
      case 'zoom':
        return 'animate-zoomIn'
      case 'bounce':
        return 'animate-bounce'
      default:
        return ''
    }
  }

  // Get aspect ratio CSS value
  const getAspectRatio = (): string | undefined => {
    const styles = content.imageStyles || {}
    if (styles.sizeMode !== 'aspect-ratio') return undefined

    const aspectRatio = styles.aspectRatio || 'auto'
    if (aspectRatio === 'auto') return undefined
    if (aspectRatio === 'custom') return styles.customAspectRatio || '16/9'

    // Convert ratio format (16:9 -> 16/9)
    return aspectRatio.replace(':', '/')
  }

  // Get image container styles based on sizeMode
  const getImageContainerStyles = (): React.CSSProperties => {
    const styles = content.imageStyles || {}
    const sizeMode = styles.sizeMode || 'auto'
    const containerStyles: React.CSSProperties = {
      width: '100%' // Default width
    }

    // Container width from settings
    if (styles.containerWidth === 'custom' && styles.customContainerWidth) {
      containerStyles.maxWidth = styles.customContainerWidth
      containerStyles.margin = '0 auto'
    } else if (styles.containerWidth && styles.containerWidth !== 'full') {
      // Tailwind max-w values in pixels
      const maxWidthMap: Record<string, string> = {
        'max-w-lg': '512px',
        'max-w-xl': '576px',
        'max-w-2xl': '672px',
        'max-w-3xl': '768px',
        'max-w-4xl': '896px',
        'max-w-5xl': '1024px',
        'max-w-6xl': '1152px',
        'max-w-7xl': '1280px'
      }
      containerStyles.maxWidth = maxWidthMap[styles.containerWidth] || '100%'
      containerStyles.margin = '0 auto'
    }

    // Apply based on size mode
    if (sizeMode === 'aspect-ratio') {
      const aspectRatio = getAspectRatio()
      if (aspectRatio) {
        containerStyles.aspectRatio = aspectRatio
      }
      containerStyles.overflow = 'hidden'
    } else if (sizeMode === 'fixed') {
      if (styles.width) containerStyles.width = styles.width
      if (styles.height) containerStyles.height = styles.height
      if (styles.maxWidth) containerStyles.maxWidth = styles.maxWidth
      if (styles.maxHeight) containerStyles.maxHeight = styles.maxHeight
      containerStyles.overflow = 'hidden'
    } else if (sizeMode === 'responsive') {
      // Responsive uses CSS variables, width is controlled via classes
      containerStyles.overflow = 'hidden'
    }

    return containerStyles
  }

  // Image styles
  const getImageStyles = (): React.CSSProperties => {
    const styles = content.imageStyles || {}
    const sizeMode = styles.sizeMode || 'auto'

    const imageStyles: React.CSSProperties = {
      borderRadius: styles.borderRadius || '16px',
      boxShadow: styles.boxShadow || 'none',
      opacity: (styles.opacity || 100) / 100,
      filter: `brightness(${styles.brightness || 100}%) contrast(${styles.contrast || 100}%) saturate(${styles.saturation || 100}%) blur(${styles.blur || 0}px)`,
      objectFit: (styles.objectFit as React.CSSProperties['objectFit']) || 'cover',
      objectPosition: styles.objectPosition || 'center',
      transition: 'transform 0.3s ease',
      display: 'block' // Prevent inline gap
    }

    // Apply dimensions based on size mode
    if (sizeMode === 'fixed') {
      imageStyles.width = styles.width || '100%'
      imageStyles.height = styles.height || 'auto'
      if (styles.maxWidth) imageStyles.maxWidth = styles.maxWidth
      if (styles.maxHeight) imageStyles.maxHeight = styles.maxHeight
    } else if (sizeMode === 'aspect-ratio') {
      // Fill the container with aspect ratio
      imageStyles.width = '100%'
      imageStyles.height = '100%'
      imageStyles.objectFit = (styles.objectFit as React.CSSProperties['objectFit']) || 'cover'
    } else if (sizeMode === 'responsive') {
      // Responsive mode - inherits from CSS variables
      imageStyles.width = '100%'
      imageStyles.height = 'auto'
    } else {
      // auto mode - natural sizing
      imageStyles.width = '100%'
      imageStyles.height = 'auto'
    }

    return imageStyles
  }

  // Get responsive image class names and CSS variables
  const getResponsiveImageClasses = (): string => {
    const styles = content.imageStyles || {}
    if (styles.sizeMode !== 'responsive') return ''
    return 'hero-image-responsive'
  }

  // Get responsive CSS variables
  const getResponsiveCSSVars = (): React.CSSProperties => {
    const styles = content.imageStyles || {}
    if (styles.sizeMode !== 'responsive') return {}

    return {
      '--hero-img-mobile-w': styles.mobileWidth || '100%',
      '--hero-img-mobile-h': styles.mobileHeight || 'auto',
      '--hero-img-tablet-w': styles.tabletWidth || '100%',
      '--hero-img-tablet-h': styles.tabletHeight || 'auto',
      '--hero-img-desktop-w': styles.width || '100%',
      '--hero-img-desktop-h': styles.height || 'auto'
    } as React.CSSProperties
  }

  // Button styles
  const getButtonStyles = (button: HeroButton): React.CSSProperties => {
    const baseStyles: React.CSSProperties = {
      borderRadius: button.borderRadius || '12px',
      transition: 'all 0.3s ease'
    }

    if (button.backgroundColor) {
      baseStyles.backgroundColor = button.backgroundColor
    }
    if (button.textColor) {
      baseStyles.color = button.textColor
    }
    if (button.borderColor) {
      baseStyles.borderColor = button.borderColor
    }

    return baseStyles
  }

  const getButtonClasses = (button: HeroButton) => {
    const sizeMap = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    }

    const styleMap = {
      primary: 'bg-sage-500 hover:bg-sage-600 text-white shadow-lg hover:shadow-xl',
      secondary: 'bg-white hover:bg-slate-50 text-slate-800 shadow-md',
      outline: 'border-2 border-sage-500 text-sage-600 hover:bg-sage-50',
      ghost: 'text-slate-600 hover:text-slate-800 hover:bg-slate-100'
    }

    const hoverMap = {
      scale: 'hover:scale-105',
      glow: 'hover:shadow-2xl hover:shadow-sage-500/30',
      slide: 'hover:-translate-y-1',
      none: ''
    }

    return `
      inline-flex items-center justify-center font-medium rounded-xl transition-all duration-300
      ${sizeMap[button.size] || sizeMap.md}
      ${styleMap[button.style] || styleMap.primary}
      ${hoverMap[button.hoverEffect || 'scale']}
    `
  }

  // Render title with highlight
  const renderTitle = (darkMode: boolean = false) => {
    if (!content.title) return null

    const titleStyles: React.CSSProperties = {
      fontSize: content.titleStyles?.fontSize || undefined,
      fontWeight: content.titleStyles?.fontWeight || '700',
      lineHeight: content.titleStyles?.lineHeight || '1.1',
      letterSpacing: content.titleStyles?.letterSpacing || undefined,
      color: content.titleStyles?.color || (darkMode ? '#ffffff' : undefined)
    }

    const titleClass = `text-4xl md:text-5xl lg:text-6xl font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`

    if (!content.titleHighlight || !content.titleHighlight.words?.length) {
      return (
        <h1 className={titleClass} style={titleStyles}>
          {content.title}
        </h1>
      )
    }

    const words = content.title.split(' ')
    const highlightIndices = content.titleHighlight.words

    return (
      <h1 className={titleClass} style={titleStyles}>
        {words.map((word, index) => {
          const isHighlighted = highlightIndices.includes(index)
          if (!isHighlighted) return <span key={index}>{word} </span>

          const highlightStyle = (() => {
            switch (content.titleHighlight?.style) {
              case 'background':
                return { backgroundColor: content.titleHighlight.color, padding: '0 8px', borderRadius: '4px' }
              case 'underline':
                return { textDecoration: 'underline', textDecorationColor: content.titleHighlight.color, textUnderlineOffset: '4px' }
              case 'gradient':
                return {
                  background: `linear-gradient(90deg, ${content.titleHighlight.color}, #3b82f6)`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }
              default:
                return { color: content.titleHighlight?.color }
            }
          })()

          return (
            <span key={index} style={highlightStyle as React.CSSProperties}>
              {word}{' '}
            </span>
          )
        })}
      </h1>
    )
  }

  // Background video (for backgroundType: 'video')
  const renderBackgroundVideo = () => {
    if (content.backgroundType !== 'video' || !content.video?.url) return null

    const { url, provider, autoplay = true, muted = true, loop = true, controls = false, poster } = content.video

    // YouTube background
    if (provider === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('/').pop()
        : new URLSearchParams(new URL(url).search).get('v')

      return (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&controls=0&playlist=${videoId}&showinfo=0&rel=0&modestbranding=1`}
            className="absolute top-1/2 left-1/2 w-[200%] h-[200%] -translate-x-1/2 -translate-y-1/2"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ pointerEvents: 'none' }}
          />
          {content.backgroundOverlay?.enabled && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundColor: content.backgroundOverlay.color,
                opacity: content.backgroundOverlay.opacity / 100
              }}
            />
          )}
        </div>
      )
    }

    // Direct video background
    return (
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          src={url}
          poster={poster}
          autoPlay={autoplay}
          muted={muted}
          loop={loop}
          playsInline
          className="w-full h-full object-cover"
        />
        {content.backgroundOverlay?.enabled && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: content.backgroundOverlay.color,
              opacity: content.backgroundOverlay.opacity / 100
            }}
          />
        )}
      </div>
    )
  }

  // Video embed
  const renderVideo = () => {
    if (!content.video?.url) return null

    const { url, provider, autoplay, muted, loop, controls, poster } = content.video

    // YouTube
    if (provider === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
      const videoId = url.includes('youtu.be')
        ? url.split('/').pop()
        : new URLSearchParams(new URL(url).search).get('v')

      return (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=${autoplay ? 1 : 0}&mute=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}&playlist=${videoId}`}
          className="w-full h-full absolute inset-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )
    }

    // Vimeo
    if (provider === 'vimeo' || url.includes('vimeo.com')) {
      const videoId = url.split('/').pop()
      return (
        <iframe
          src={`https://player.vimeo.com/video/${videoId}?autoplay=${autoplay ? 1 : 0}&muted=${muted ? 1 : 0}&loop=${loop ? 1 : 0}&controls=${controls ? 1 : 0}`}
          className="w-full h-full absolute inset-0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
        />
      )
    }

    // Direct video
    return (
      <video
        src={url}
        poster={poster}
        autoPlay={autoplay}
        muted={muted}
        loop={loop}
        controls={controls}
        className="w-full h-full object-cover absolute inset-0"
      />
    )
  }

  // Check if layout uses dark overlay (needs light text)
  const isDarkOverlay = layout === 'full-width' || layout === 'overlay'

  // Get mobile text alignment class
  const getMobileTextAlignClass = () => {
    const mobileAlign = responsive.mobileTextAlign || 'center'
    return `hero-mobile-text-${mobileAlign} hero-mobile-items-${mobileAlign === 'left' ? 'start' : mobileAlign === 'right' ? 'end' : 'center'}`
  }

  // Content Section - accepts darkMode prop for text colors
  const ContentSection = ({ darkMode = false }: { darkMode?: boolean }) => (
    <div className={`flex flex-col ${getVerticalClasses()} gap-6 w-full ${getMobileTextAlignClass()}`}>
      {/* Badge */}
      {content.badge?.text && (
        <div className={`flex w-full ${getElementAlignmentClasses('badge')}`}>
          <div
            className={`inline-flex items-center gap-2 ${
              animations?.enabled && isVisible ? getAnimationClasses('fade', 0) : 'opacity-0'
            } ${content.badge.animation === 'pulse' ? 'animate-pulse' : ''} ${content.badge.animation === 'bounce' ? 'animate-bounce' : ''}`}
            style={{
              backgroundColor: content.badge.backgroundColor || '#10b981',
              color: content.badge.textColor || '#ffffff',
              fontSize: content.badge.fontSize || '0.75rem',
              fontWeight: content.badge.fontWeight || '600',
              borderRadius: content.badge.borderRadius || '9999px',
              paddingLeft: content.badge.paddingX || '1rem',
              paddingRight: content.badge.paddingX || '1rem',
              paddingTop: content.badge.paddingY || '0.375rem',
              paddingBottom: content.badge.paddingY || '0.375rem',
              animationDelay: '0ms'
            }}
          >
            {content.badge.icon && <span>{content.badge.icon}</span>}
            {content.badge.text}
          </div>
        </div>
      )}

      {/* Title */}
      <div
        className={`w-full ${getElementAlignmentClasses('title')} ${animations?.enabled && isVisible ? getAnimationClasses(animations.titleAnimation || 'slide-up', animations.staggerDelay || 100) : 'opacity-0'}`}
        style={{ animationDelay: `${animations?.staggerDelay || 100}ms` }}
      >
        {renderTitle(darkMode)}
      </div>

      {/* Subtitle */}
      {content.subtitle && (
        <div className={`w-full ${getElementAlignmentClasses('subtitle')}`}>
          <p
            className={`text-lg md:text-xl max-w-2xl ${
              darkMode ? 'text-white/90' : 'text-slate-600'
            } ${
              animations?.enabled && isVisible ? getAnimationClasses(animations.subtitleAnimation || 'fade', (animations.staggerDelay || 100) * 2) : 'opacity-0'
            }`}
            style={{
              animationDelay: `${(animations?.staggerDelay || 100) * 2}ms`,
              fontSize: content.subtitleStyles?.fontSize || undefined,
              fontWeight: content.subtitleStyles?.fontWeight || undefined,
              lineHeight: content.subtitleStyles?.lineHeight || '1.6',
              color: content.subtitleStyles?.color || (darkMode ? 'rgba(255,255,255,0.9)' : undefined)
            }}
          >
            {content.subtitle}
          </p>
        </div>
      )}

      {/* Description */}
      {content.description && (
        <div className={`w-full ${getElementAlignmentClasses('description')}`}>
          <p
            className={`${
              darkMode ? 'text-white/80' : 'text-slate-500'
            } ${
              animations?.enabled && isVisible ? getAnimationClasses('fade', (animations.staggerDelay || 100) * 2.5) : 'opacity-0'
            }`}
            style={{
              animationDelay: `${(animations?.staggerDelay || 100) * 2.5}ms`,
              fontSize: content.descriptionStyles?.fontSize || '1rem',
              fontWeight: content.descriptionStyles?.fontWeight || '400',
              lineHeight: content.descriptionStyles?.lineHeight || '1.6',
              color: content.descriptionStyles?.color || (darkMode ? 'rgba(255,255,255,0.8)' : '#64748b'),
              maxWidth: content.descriptionStyles?.maxWidth || '36rem'
            }}
          >
            {content.description}
          </p>
        </div>
      )}

      {/* Buttons */}
      {content.buttons && content.buttons.length > 0 && (
        <div className={`w-full flex ${getElementAlignmentClasses('buttons')}`}>
          <div
            className={`flex flex-wrap gap-4 mt-2 ${
              animations?.enabled && isVisible ? getAnimationClasses(animations.buttonAnimation || 'slide-up', (animations.staggerDelay || 100) * 3) : 'opacity-0'
            }`}
            style={{ animationDelay: `${(animations?.staggerDelay || 100) * 3}ms` }}
          >
            {content.buttons.map((button, index) => (
              <a
                key={index}
                href={button.link || '#'}
                className={getButtonClasses(button)}
                style={getButtonStyles(button)}
              >
                {button.iconPosition === 'left' && button.icon && <span className="mr-2">{button.icon}</span>}
                {button.text}
                {button.iconPosition === 'right' && button.icon && <span className="ml-2">{button.icon}</span>}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Legacy CTA support */}
      {!content.buttons?.length && content.ctaText && (
        <div className={`w-full flex ${getElementAlignmentClasses('buttons')}`}>
          <div
            className={`mt-2 ${
              animations?.enabled && isVisible ? getAnimationClasses('slide-up', (animations.staggerDelay || 100) * 3) : 'opacity-0'
            }`}
            style={{ animationDelay: `${(animations?.staggerDelay || 100) * 3}ms` }}
          >
            <a
              href={content.ctaLink || '#'}
              className="inline-block bg-sage-500 hover:bg-sage-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              {content.ctaText}
            </a>
          </div>
        </div>
      )}

      {/* Trust Indicator */}
      {content.trustIndicator?.enabled && content.trustIndicator.items?.length > 0 && (
        <div className={`w-full flex ${getElementAlignmentClasses('trustIndicator')}`}>
          <div
            className={`flex flex-wrap items-center gap-4 mt-4 text-sm ${
              darkMode ? 'text-white/70' : 'text-slate-500'
            } ${
              animations?.enabled && isVisible ? getAnimationClasses('fade', (animations.staggerDelay || 100) * 4) : 'opacity-0'
            }`}
            style={{ animationDelay: `${(animations?.staggerDelay || 100) * 4}ms` }}
          >
            {content.trustIndicator.items.map((item, index) => (
              <span key={index} className="flex items-center gap-2">
                {item.content}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )

  // Media Section
  const MediaSection = () => {
    if (content.mediaType === 'none' || layout === 'minimal') return null

    if (content.mediaType === 'video' && content.video?.url) {
      return (
        <div
          className={`relative overflow-hidden rounded-2xl aspect-video ${
            animations?.enabled && isVisible ? getAnimationClasses(animations.imageAnimation || 'fade', (animations.staggerDelay || 100) * 2) : 'opacity-0'
          }`}
          style={{
            animationDelay: `${(animations?.staggerDelay || 100) * 2}ms`,
            ...getImageContainerStyles()
          }}
        >
          {renderVideo()}
        </div>
      )
    }

    // Image
    const imageUrl = content.image?.url || (content as any).image
    if (!imageUrl) return null

    const containerStyles = getImageContainerStyles()
    const imageStyles = getImageStyles()
    const responsiveClasses = getResponsiveImageClasses()
    const responsiveCSSVars = getResponsiveCSSVars()

    return (
      <div
        className={`relative overflow-hidden group ${
          animations?.enabled && isVisible ? getAnimationClasses(animations.imageAnimation || 'fade', (animations.staggerDelay || 100) * 2) : 'opacity-0'
        }`}
        style={{
          animationDelay: `${(animations?.staggerDelay || 100) * 2}ms`,
          ...containerStyles,
          ...responsiveCSSVars
        }}
      >
        <img
          src={imageUrl}
          alt={content.image?.alt || content.title || 'Hero image'}
          className={`group-hover:scale-105 transition-transform duration-500 ${responsiveClasses}`}
          style={imageStyles}
        />
        {/* Image Overlay */}
        {(content.imageStyles?.overlayOpacity ?? 0) > 0 && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: content.imageStyles.overlayColor || '#000000',
              opacity: content.imageStyles.overlayOpacity / 100,
              borderRadius: content.imageStyles.borderRadius || '24px'
            }}
          />
        )}
      </div>
    )
  }

  // Get image URL helper
  const getImageUrl = () => content.image?.url || (content as any).image

  // Render based on layout type
  const renderLayout = () => {
    switch (layout) {
      // Full-width: Clean, immersive full-screen hero with centered content
      case 'full-width':
        const hasFullWidthImage = !!getImageUrl()
        return (
          <section
            ref={heroRef}
            className="relative overflow-hidden flex items-center justify-center"
            style={{
              minHeight: minHeight || '100vh',
              paddingTop: content.padding?.top || '100px',
              paddingBottom: content.padding?.bottom || '100px',
              paddingLeft: content.padding?.left || '24px',
              paddingRight: content.padding?.right || '24px'
            }}
          >
            {/* Background Image with Ken Burns effect */}
            {hasFullWidthImage && (
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={getImageUrl()}
                  alt={content.image?.alt || ''}
                  className="w-full h-full transform scale-105 animate-slow-zoom"
                  style={{
                    objectFit: content.imageStyles?.objectFit || 'cover',
                    objectPosition: content.imageStyles?.objectPosition || 'center',
                    filter: `brightness(${content.imageStyles?.brightness || 90}%)`,
                  }}
                />
                {/* Gradient overlay from bottom */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${content.backgroundOverlay?.color || 'rgba(0,0,0,0.7)'} 0%, transparent 50%, ${content.backgroundOverlay?.color || 'rgba(0,0,0,0.3)'} 100%)`,
                  }}
                />
              </div>
            )}
            {/* Background color/gradient fallback */}
            {!hasFullWidthImage && (
              <div className="absolute inset-0 z-0" style={getBackgroundStyle()} />
            )}
            {/* Decorative elements */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white/10 to-transparent z-5" />
            {/* Content - Centered */}
            <div
              className="relative z-10 text-center mx-auto px-6"
              style={{ maxWidth: content.maxWidth || '900px' }}
            >
              <ContentSection darkMode={hasFullWidthImage} />
            </div>
            {/* Scroll indicator */}
            {hasFullWidthImage && (
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
                <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2">
                  <div className="w-1 h-3 bg-white/70 rounded-full animate-scroll-down" />
                </div>
              </div>
            )}
          </section>
        )

      // Overlay: Glassmorphism card with content, image behind
      case 'overlay':
        const hasOverlayImage = !!getImageUrl()
        return (
          <section
            ref={heroRef}
            className="relative overflow-hidden flex items-center"
            style={{
              minHeight,
              paddingTop: content.padding?.top || '80px',
              paddingBottom: content.padding?.bottom || '80px',
              paddingLeft: content.padding?.left || '24px',
              paddingRight: content.padding?.right || '24px'
            }}
          >
            {/* Background Image with blur effect */}
            {hasOverlayImage && (
              <div className="absolute inset-0 z-0">
                <img
                  src={getImageUrl()}
                  alt={content.image?.alt || ''}
                  className="w-full h-full"
                  style={{
                    objectFit: content.imageStyles?.objectFit || 'cover',
                    objectPosition: content.imageStyles?.objectPosition || 'center',
                    filter: 'blur(2px) brightness(70%)',
                    transform: 'scale(1.05)'
                  }}
                />
                {/* Gradient overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(135deg, ${content.backgroundOverlay?.color || 'rgba(0,0,0,0.6)'} 0%, transparent 60%)`,
                  }}
                />
              </div>
            )}
            {!hasOverlayImage && (
              <div className="absolute inset-0 z-0" style={getBackgroundStyle()} />
            )}

            {/* Content Container - Left aligned with glass card */}
            <div
              className="relative z-10 w-full mx-auto px-4 lg:px-8"
              style={{ maxWidth: content.maxWidth || '1400px' }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Glass Card with Content */}
                <div
                  className="backdrop-blur-xl rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/20"
                  style={{
                    background: hasOverlayImage
                      ? 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)'
                      : 'rgba(255,255,255,0.95)',
                  }}
                >
                  <ContentSection darkMode={hasOverlayImage} />
                </div>

                {/* Right side - could show featured image or decorative element */}
                {hasOverlayImage && (
                  <div className="hidden lg:flex items-center justify-center">
                    <div className="relative">
                      {/* Decorative circles */}
                      <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
                      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
                      {/* Stats or highlights could go here */}
                      <div className="relative backdrop-blur-sm bg-white/10 rounded-2xl p-6 border border-white/20">
                        <div className="text-center text-white">
                          <div className="text-4xl font-bold mb-2">Premium</div>
                          <div className="text-white/80">Hizmet Kalitesi</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        )

      // Centered: Content first, then image below (stacked)
      case 'centered':
        return (
          <section
            ref={heroRef}
            className="relative overflow-hidden"
            style={{
              minHeight,
              ...getBackgroundStyle(),
              paddingTop: content.padding?.top || '80px',
              paddingBottom: content.padding?.bottom || '80px',
              paddingLeft: content.padding?.left || '24px',
              paddingRight: content.padding?.right || '24px'
            }}
          >
            {content.backgroundOverlay?.enabled && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: content.backgroundOverlay.color,
                  opacity: content.backgroundOverlay.opacity / 100,
                  mixBlendMode: content.backgroundOverlay.blendMode as any
                }}
              />
            )}
            <div
              className="relative z-10 flex flex-col items-center text-center mx-auto gap-12"
              style={{ maxWidth: content.maxWidth || '1400px' }}
            >
              <div className="max-w-3xl">
                <ContentSection />
              </div>
              {getImageUrl() && (
                <div
                  className={`w-full ${
                    animations?.enabled && isVisible ? getAnimationClasses(animations.imageAnimation || 'fade', (animations.staggerDelay || 100) * 2) : 'opacity-0'
                  } ${getResponsiveImageClasses()}`}
                  style={{
                    animationDelay: `${(animations?.staggerDelay || 100) * 2}ms`,
                    ...getImageContainerStyles(),
                    ...getResponsiveCSSVars()
                  }}
                >
                  <img
                    src={getImageUrl()}
                    alt={content.image?.alt || content.title || 'Hero image'}
                    className="rounded-2xl shadow-2xl"
                    style={getImageStyles()}
                  />
                </div>
              )}
            </div>
          </section>
        )

      // Minimal: Only content, no image
      case 'minimal':
        return (
          <section
            ref={heroRef}
            className="relative overflow-hidden flex items-center justify-center"
            style={{
              minHeight,
              ...getBackgroundStyle(),
              paddingTop: content.padding?.top || '80px',
              paddingBottom: content.padding?.bottom || '80px',
              paddingLeft: content.padding?.left || '24px',
              paddingRight: content.padding?.right || '24px'
            }}
          >
            {content.backgroundOverlay?.enabled && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: content.backgroundOverlay.color,
                  opacity: content.backgroundOverlay.opacity / 100,
                  mixBlendMode: content.backgroundOverlay.blendMode as any
                }}
              />
            )}
            <div
              className="relative z-10 text-center max-w-3xl mx-auto"
              style={{ maxWidth: content.maxWidth || '800px' }}
            >
              <ContentSection />
            </div>
          </section>
        )

      // Split layouts (left/right)
      default:
        const hasVideoBackground = content.backgroundType === 'video' && content.video?.url
        return (
          <section
            ref={heroRef}
            className="relative overflow-hidden"
            style={{
              minHeight,
              ...getBackgroundStyle(),
              paddingTop: content.padding?.top || '80px',
              paddingBottom: content.padding?.bottom || '80px',
              paddingLeft: content.padding?.left || '24px',
              paddingRight: content.padding?.right || '24px'
            }}
          >
            {/* Video background */}
            {hasVideoBackground && renderBackgroundVideo()}

            {/* Background overlay (for non-video backgrounds) */}
            {!hasVideoBackground && content.backgroundOverlay?.enabled && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: content.backgroundOverlay.color,
                  opacity: content.backgroundOverlay.opacity / 100,
                  mixBlendMode: content.backgroundOverlay.blendMode as any
                }}
              />
            )}
            <div
              className={`relative z-10 max-w-7xl mx-auto h-full grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center ${
                responsive.mobileImagePosition === 'top' ? '' : 'flex-col-reverse'
              }`}
              style={{ maxWidth: content.maxWidth || '1400px' }}
            >
              {layout === 'split-left' ? (
                <>
                  <div className={`flex items-center justify-center ${
                    responsive.mobileImagePosition === 'hidden' ? 'hidden lg:flex' : ''
                  } ${responsive.mobileImagePosition === 'bottom' ? 'order-2 lg:order-1' : ''}`}>
                    <MediaSection />
                  </div>
                  <div className={responsive.mobileImagePosition === 'bottom' ? 'order-1 lg:order-2' : ''}>
                    <ContentSection darkMode={!!hasVideoBackground} />
                  </div>
                </>
              ) : (
                <>
                  <ContentSection darkMode={!!hasVideoBackground} />
                  <div className={`flex items-center justify-center ${
                    responsive.mobileImagePosition === 'hidden' ? 'hidden lg:flex' : ''
                  }`}>
                    <MediaSection />
                  </div>
                </>
              )}
            </div>
          </section>
        )
    }
  }

  return (
    <>
      {renderLayout()}

      {/* Custom CSS for animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes zoomIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.6s ease forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.6s ease forwards;
        }
        .animate-slideLeft {
          animation: slideLeft 0.6s ease forwards;
        }
        .animate-slideRight {
          animation: slideRight 0.6s ease forwards;
        }
        .animate-zoomIn {
          animation: zoomIn 0.6s ease forwards;
        }
        /* Full-width layout animations */
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        .animate-slow-zoom {
          animation: slowZoom 20s ease-in-out infinite alternate;
        }
        @keyframes scrollDown {
          0% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(8px); }
        }
        .animate-scroll-down {
          animation: scrollDown 1.5s ease-in-out infinite;
        }
        /* Responsive image dimensions */
        .hero-image-responsive {
          width: var(--hero-img-desktop-w, 100%);
          height: var(--hero-img-desktop-h, auto);
        }
        @media (max-width: 1024px) {
          .hero-image-responsive {
            width: var(--hero-img-tablet-w, 100%);
            height: var(--hero-img-tablet-h, auto);
          }
        }
        @media (max-width: 768px) {
          .hero-image-responsive {
            width: var(--hero-img-mobile-w, 100%);
            height: var(--hero-img-mobile-h, auto);
          }
        }
        /* Responsive hero min-height */
        .hero-responsive-height {
          min-height: var(--hero-desktop-height, 600px);
        }
        @media (max-width: 1024px) {
          .hero-responsive-height {
            min-height: var(--hero-tablet-height, 500px);
          }
        }
        @media (max-width: 768px) {
          .hero-responsive-height {
            min-height: var(--hero-mobile-height, 400px);
          }
        }
        /* Responsive text alignment */
        @media (max-width: 768px) {
          .hero-mobile-text-left { text-align: left !important; }
          .hero-mobile-text-center { text-align: center !important; }
          .hero-mobile-text-right { text-align: right !important; }
          .hero-mobile-items-start { align-items: flex-start !important; justify-content: flex-start !important; }
          .hero-mobile-items-center { align-items: center !important; justify-content: center !important; }
          .hero-mobile-items-end { align-items: flex-end !important; justify-content: flex-end !important; }
        }
      `}</style>
    </>
  )
}
