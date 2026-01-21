'use client'

import { useState, useEffect, useRef, CSSProperties } from 'react'

import { BlockProps, CTAContent } from './types'

// Default content for backwards compatibility
const getDefaultContent = (): CTAContent => ({
  layout: 'centered',
  alignment: 'center',
  verticalAlignment: 'center',
  minHeight: '300px',
  maxWidth: 'xl',
  padding: { top: '4rem', bottom: '4rem', left: '2rem', right: '2rem' },
  margin: { top: '0', bottom: '0' },
  title: 'Harekete Gecin',
  subtitle: 'Sizin icin en uygun cozumu sunuyoruz',
  primaryButton: {
    text: 'Hemen Baslayın',
    link: '/iletisim',
    style: 'primary',
    size: 'lg',
    backgroundColor: '#ffffff',
    textColor: '#059669',
    borderRadius: '0.75rem',
    shadow: 'lg',
    hoverEffect: 'scale'
  },
  buttonLayout: 'horizontal',
  buttonGap: '1rem',
  buttonAlignment: 'center',
  typography: {
    title: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2', letterSpacing: '-0.02em', color: '#ffffff' },
    subtitle: { fontSize: '1.25rem', fontWeight: '400', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)', maxWidth: '600px' }
  },
  background: {
    type: 'gradient',
    gradientFrom: '#059669',
    gradientTo: '#065f46',
    gradientDirection: 'to-br'
  },
  animations: {
    enabled: true,
    titleAnimation: 'fade',
    subtitleAnimation: 'fade',
    buttonAnimation: 'slide-up',
    decorationAnimation: 'fade',
    staggerDelay: 100,
    duration: 600,
    delay: 0,
    triggerOnScroll: true
  },
  responsive: {
    desktop: { titleSize: '2.5rem', subtitleSize: '1.25rem', buttonSize: 'lg', padding: '4rem' },
    tablet: { titleSize: '2rem', subtitleSize: '1.125rem', buttonSize: 'md', padding: '3rem' },
    mobile: { titleSize: '1.75rem', subtitleSize: '1rem', buttonSize: 'md', layout: 'stacked', textAlign: 'center', hideDecoration: true, padding: '2rem' }
  },
  showBadge: false,
  showSubtitle: true,
  showDescription: false,
  showSecondaryButton: false,
  showDecoration: false
})

export default function CtaBlock({ block }: BlockProps) {
  // Merge with defaults for backwards compatibility
  const rawContent = block.content as Partial<CTAContent>
  const content: CTAContent = {
    ...getDefaultContent(),
    ...rawContent,
    // Handle legacy content
    title: rawContent.title || (rawContent as any).buttonText ? rawContent.title || 'Harekete Gecin' : getDefaultContent().title,
    primaryButton: {
      ...getDefaultContent().primaryButton,
      ...rawContent.primaryButton,
      text: rawContent.primaryButton?.text || (rawContent as any).buttonText || 'Hemen Baslayın',
      link: rawContent.primaryButton?.link || (rawContent as any).buttonLink || '/iletisim'
    }
  }

  const {
    layout,
    alignment,
    minHeight,
    maxWidth,
    customMaxWidth,
    padding,
    margin,
    badge,
    title,
    titleHighlight,
    subtitle,
    description,
    primaryButton,
    secondaryButton,
    buttonLayout,
    buttonGap,
    buttonAlignment,
    decoration,
    typography,
    background,
    border,
    boxShadow,
    animations,
    responsive,
    showBadge,
    showSubtitle,
    showDescription,
    showSecondaryButton,
    showDecoration,
    customClass,
    urgency,
    trustElements
  } = content

  // Animation state
  const [isVisible, setIsVisible] = useState(!animations.triggerOnScroll)
  const sectionRef = useRef<HTMLElement>(null)

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (!animations.enabled || !animations.triggerOnScroll) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2, rootMargin: '50px' }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [animations.enabled, animations.triggerOnScroll])

  // Background styles
  const getBackgroundStyles = (): CSSProperties => {
    const style: CSSProperties = {}

    switch (background.type) {
      case 'solid':
        style.backgroundColor = background.color || '#059669'
        break

      case 'gradient':
        const dir = background.gradientDirection?.replace('to-', 'to ') || 'to bottom right'
        const via = background.gradientVia ? `, ${background.gradientVia}` : ''

        if (background.gradientType === 'radial') {
          style.background = `radial-gradient(circle, ${background.gradientFrom} 0%${via} 50%, ${background.gradientTo} 100%)`
        } else if (background.gradientType === 'conic') {
          style.background = `conic-gradient(from 0deg, ${background.gradientFrom}${via}, ${background.gradientTo})`
        } else {
          style.background = `linear-gradient(${dir}, ${background.gradientFrom}${via}, ${background.gradientTo})`
        }
        break

      case 'image':
        style.backgroundImage = `url(${background.imageUrl})`
        style.backgroundPosition = background.imagePosition || 'center'
        style.backgroundSize = background.imageSize || 'cover'
        style.backgroundRepeat = background.imageRepeat ? 'repeat' : 'no-repeat'
        break

      case 'pattern':
        const patternOpacity = (background.patternOpacity || 10) / 100
        const patternColor = background.patternColor || '#ffffff'
        const baseColor = background.color || '#059669'
        const patternSize = background.patternSize === 'sm' ? 10 : background.patternSize === 'lg' ? 30 : 20

        style.backgroundColor = baseColor

        switch (background.pattern) {
          case 'dots':
            style.backgroundImage = `radial-gradient(circle, ${patternColor}${Math.round(patternOpacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px)`
            style.backgroundSize = `${patternSize}px ${patternSize}px`
            break
          case 'grid':
            style.backgroundImage = `
              linear-gradient(${patternColor}${Math.round(patternOpacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px),
              linear-gradient(90deg, ${patternColor}${Math.round(patternOpacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px)
            `
            style.backgroundSize = `${patternSize}px ${patternSize}px`
            break
          case 'lines':
            style.backgroundImage = `repeating-linear-gradient(45deg, ${patternColor}${Math.round(patternOpacity * 255).toString(16).padStart(2, '0')}, ${patternColor}${Math.round(patternOpacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px, transparent ${patternSize}px)`
            break
          case 'diagonal':
            style.backgroundImage = `repeating-linear-gradient(-45deg, ${patternColor}${Math.round(patternOpacity * 255).toString(16).padStart(2, '0')}, ${patternColor}${Math.round(patternOpacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px, transparent ${patternSize}px)`
            break
          case 'waves':
            style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='${encodeURIComponent(patternColor)}' fill-opacity='${patternOpacity}' fill-rule='evenodd'/%3E%3C/svg%3E")`
            break
          case 'geometric':
            style.backgroundImage = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='${encodeURIComponent(patternColor)}' fill-opacity='${patternOpacity}'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            break
        }
        break
    }

    return style
  }

  // Animation helpers
  const getAnimationTransform = (type: string): string => {
    if (isVisible) {
return 'translate(0, 0) scale(1)'
}
    switch (type) {
      case 'fade': return 'translate(0, 0) scale(1)'
      case 'slide-up': return 'translate(0, 30px) scale(1)'
      case 'slide-down': return 'translate(0, -30px) scale(1)'
      case 'slide-left': return 'translate(-30px, 0) scale(1)'
      case 'slide-right': return 'translate(30px, 0) scale(1)'
      case 'zoom': return 'translate(0, 0) scale(0.8)'
      case 'bounce': return 'translate(0, 20px) scale(1)'
      case 'scale': return 'translate(0, 0) scale(0.9)'
      default: return 'translate(0, 0) scale(1)'
    }
  }

  const getElementStyle = (animationType: string, delay: number = 0): CSSProperties => ({
    opacity: isVisible ? 1 : 0,
    transform: getAnimationTransform(animationType),
    transition: `opacity ${animations.duration}ms ease-out ${delay}ms, transform ${animations.duration}ms ease-out ${delay}ms`
  })

  // Max width classes (unused but kept for future use)
  // const maxWidthClass: Record<string, string> = {
  //   sm: 'max-w-sm',
  //   md: 'max-w-md',
  //   lg: 'max-w-lg',
  //   xl: 'max-w-xl',
  //   '2xl': 'max-w-2xl',
  //   full: 'max-w-full',
  //   custom: ''
  // }

  // Shadow classes
  const shadowClass: Record<string, string> = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  }

  // Button hover effect styles
  const getButtonHoverClass = (effect: string | undefined): string => {
    switch (effect) {
      case 'scale': return 'hover:scale-105'
      case 'lift': return 'hover:-translate-y-1'
      case 'glow': return 'hover:shadow-lg hover:shadow-current/25'
      case 'slide': return 'hover:translate-x-1'
      default: return ''
    }
  }

  // Button animation class
  const getButtonAnimationClass = (anim: string | undefined): string => {
    switch (anim) {
      case 'pulse': return 'animate-pulse'
      case 'bounce': return 'animate-bounce'
      case 'shake': return 'animate-[shake_0.5s_ease-in-out_infinite]'
      default: return ''
    }
  }

  // Render title with highlights
  const renderTitle = () => {
    if (!titleHighlight?.enabled || !titleHighlight.words?.length) {
      return title
    }

    const words = title.split(' ')
    return words.map((word, index) => {
      const isHighlighted = titleHighlight.words.includes(index)
      if (!isHighlighted) {
return <span key={index}>{word} </span>
}

      const highlightStyle: CSSProperties = {}
      switch (titleHighlight.style) {
        case 'color':
          highlightStyle.color = titleHighlight.color
          break
        case 'background':
          highlightStyle.backgroundColor = titleHighlight.color
          highlightStyle.padding = '0 0.25em'
          highlightStyle.borderRadius = '0.25em'
          break
        case 'underline':
          highlightStyle.textDecoration = 'underline'
          highlightStyle.textDecorationColor = titleHighlight.color
          highlightStyle.textUnderlineOffset = '0.2em'
          break
        case 'gradient':
          highlightStyle.backgroundImage = `linear-gradient(90deg, ${titleHighlight.gradientFrom || titleHighlight.color}, ${titleHighlight.gradientTo || titleHighlight.color})`
          highlightStyle.WebkitBackgroundClip = 'text'
          highlightStyle.WebkitTextFillColor = 'transparent'
          highlightStyle.backgroundClip = 'text'
          break
      }

      return <span key={index} style={highlightStyle}>{word} </span>
    })
  }

  // Render badge
  const renderBadge = () => {
    if (!showBadge || !badge?.text) {
return null
}

    const badgeAnimClass = badge.animation === 'pulse' ? 'animate-pulse' :
                           badge.animation === 'bounce' ? 'animate-bounce' :
                           badge.animation === 'glow' ? 'animate-[glow_2s_ease-in-out_infinite]' : ''

    return (
      <div
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${badgeAnimClass}`}
        style={{
          backgroundColor: badge.backgroundColor,
          color: badge.textColor,
          border: badge.borderColor ? `1px solid ${badge.borderColor}` : undefined,
          borderRadius: badge.borderRadius,
          ...getElementStyle(animations.titleAnimation, 0)
        }}
      >
        {badge.icon && <span>{badge.icon}</span>}
        {badge.text}
      </div>
    )
  }

  // Render urgency element
  const renderUrgency = () => {
    if (!urgency?.enabled) {
return null
}

    return (
      <div
        className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium mb-4"
        style={{
          backgroundColor: urgency.badgeColor || '#ef4444',
          color: '#ffffff'
        }}
      >
        {urgency.type === 'countdown' && <span>⏰</span>}
        {urgency.type === 'limited' && <span>🔥</span>}
        {urgency.text}
      </div>
    )
  }

  // Render trust elements
  const renderTrustElements = () => {
    if (!trustElements?.enabled || !trustElements.items?.length) {
return null
}

    return (
      <div
        className={`flex ${trustElements.layout === 'stacked' ? 'flex-col' : 'flex-row flex-wrap'} items-center gap-4 mt-6`}
        style={getElementStyle(animations.buttonAnimation, animations.staggerDelay * 4)}
      >
        {trustElements.items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm opacity-80">
            {item.type === 'icon' && <span className="text-lg">{item.content}</span>}
            {item.type === 'text' && <span>{item.content}</span>}
            {item.type === 'image' && <img src={item.content} alt="" className="h-6 w-auto" />}
          </div>
        ))}
      </div>
    )
  }

  // Render decoration
  const renderDecoration = () => {
    if (!showDecoration || !decoration?.enabled) {
return null
}

    const decorStyle: CSSProperties = {
      position: 'absolute',
      opacity: (decoration.opacity ?? 100) / 100,
      filter: decoration.blur ? `blur(${decoration.blur}px)` : undefined,
      ...getElementStyle(animations.decorationAnimation, animations.staggerDelay * 2)
    }

    // Position
    if (decoration.position === 'left') {
      decorStyle.left = '5%'
      decorStyle.top = '50%'
      decorStyle.transform = isVisible ? 'translateY(-50%)' : 'translateY(-50%) scale(0.8)'
    } else if (decoration.position === 'right') {
      decorStyle.right = '5%'
      decorStyle.top = '50%'
      decorStyle.transform = isVisible ? 'translateY(-50%)' : 'translateY(-50%) scale(0.8)'
    } else {
      decorStyle.left = '50%'
      decorStyle.top = '50%'
      decorStyle.transform = isVisible ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) scale(0.8)'
      decorStyle.zIndex = 0
    }

    // Animation class
    const animClass = decoration.animation === 'float' ? 'animate-[float_3s_ease-in-out_infinite]' :
                      decoration.animation === 'pulse' ? 'animate-pulse' :
                      decoration.animation === 'rotate' ? 'animate-[spin_10s_linear_infinite]' :
                      decoration.animation === 'bounce' ? 'animate-bounce' : ''

    if (decoration.type === 'image' && decoration.imageUrl) {
      return (
        <img
          src={decoration.imageUrl}
          alt={decoration.imageAlt || ''}
          className={`pointer-events-none ${animClass}`}
          style={{ ...decorStyle, maxWidth: '40%', height: 'auto' }}
        />
      )
    }

    if (decoration.type === 'icon' && decoration.icon) {
      return (
        <div
          className={`pointer-events-none flex items-center justify-center ${animClass}`}
          style={{
            ...decorStyle,
            fontSize: decoration.iconSize || '4rem',
            color: decoration.iconColor || 'rgba(255, 255, 255, 0.3)'
          }}
        >
          {decoration.icon}
        </div>
      )
    }

    if (decoration.type === 'shape') {
      const shapeStyle: CSSProperties = {
        ...decorStyle,
        width: decoration.shapeSize || '200px',
        height: decoration.shapeSize || '200px',
        backgroundColor: decoration.shapeColor || 'rgba(255, 255, 255, 0.1)'
      }

      if (decoration.shape === 'circle') {
        shapeStyle.borderRadius = '50%'
      } else if (decoration.shape === 'blob') {
        shapeStyle.borderRadius = '30% 70% 70% 30% / 30% 30% 70% 70%'
      } else if (decoration.shape === 'square') {
        shapeStyle.borderRadius = '0.5rem'
      }

      return <div className={`pointer-events-none ${animClass}`} style={shapeStyle} />
    }

    return null
  }

  // Layout classes
  const getLayoutClasses = (): string => {
    switch (layout) {
      case 'split-left':
      case 'split-right':
        return 'flex flex-col md:flex-row items-center gap-8 md:gap-12'
      case 'banner':
        return 'flex flex-col md:flex-row items-center justify-between gap-6'
      case 'card':
        return 'rounded-2xl overflow-hidden'
      default:
        return ''
    }
  }

  // Content alignment classes
  const getAlignmentClasses = (): string => {
    const alignMap: Record<string, string> = {
      left: 'text-left items-start',
      center: 'text-center items-center',
      right: 'text-right items-end'
    }
    return alignMap[alignment] || 'text-center items-center'
  }

  // Responsive CSS
  const responsiveStyles = `
    /* Mobile First */
    .cta-block-${block.id} {
      padding: ${responsive.mobile.padding || padding.top};
      text-align: ${responsive.mobile.textAlign || 'center'};
    }
    .cta-block-${block.id} .cta-title {
      font-size: ${responsive.mobile.titleSize};
    }
    .cta-block-${block.id} .cta-subtitle {
      font-size: ${responsive.mobile.subtitleSize};
    }
    .cta-block-${block.id} .cta-buttons {
      flex-direction: ${responsive.mobile.layout === 'stacked' ? 'column' : 'row'};
    }
    .cta-block-${block.id} .cta-primary-btn {
      padding: ${responsive.mobile.buttonSize === 'sm' ? '0.5rem 1rem' :
                 responsive.mobile.buttonSize === 'lg' ? '1rem 2rem' : '0.75rem 1.5rem'};
      font-size: ${responsive.mobile.buttonSize === 'sm' ? '0.875rem' :
                   responsive.mobile.buttonSize === 'lg' ? '1.125rem' : '1rem'};
    }

    /* Tablet */
    @media (min-width: 768px) {
      .cta-block-${block.id} {
        padding: ${responsive.tablet.padding || padding.top};
      }
      .cta-block-${block.id} .cta-title {
        font-size: ${responsive.tablet.titleSize};
      }
      .cta-block-${block.id} .cta-subtitle {
        font-size: ${responsive.tablet.subtitleSize};
      }
      .cta-block-${block.id} .cta-buttons {
        flex-direction: ${responsive.tablet.layout === 'stacked' ? 'column' : 'row'};
      }
      .cta-block-${block.id} .cta-primary-btn {
        padding: ${responsive.tablet.buttonSize === 'sm' ? '0.5rem 1rem' :
                   responsive.tablet.buttonSize === 'lg' ? '1rem 2rem' : '0.75rem 1.5rem'};
        font-size: ${responsive.tablet.buttonSize === 'sm' ? '0.875rem' :
                     responsive.tablet.buttonSize === 'lg' ? '1.125rem' : '1rem'};
      }
    }

    /* Desktop */
    @media (min-width: 1024px) {
      .cta-block-${block.id} {
        padding: ${responsive.desktop.padding || padding.top};
      }
      .cta-block-${block.id} .cta-title {
        font-size: ${responsive.desktop.titleSize || typography.title.fontSize};
      }
      .cta-block-${block.id} .cta-subtitle {
        font-size: ${responsive.desktop.subtitleSize || typography.subtitle.fontSize};
      }
      .cta-block-${block.id} .cta-primary-btn {
        padding: ${responsive.desktop.buttonSize === 'sm' ? '0.5rem 1rem' :
                   responsive.desktop.buttonSize === 'xl' ? '1.25rem 2.5rem' :
                   responsive.desktop.buttonSize === 'lg' ? '1rem 2rem' : '0.75rem 1.5rem'};
        font-size: ${responsive.desktop.buttonSize === 'sm' ? '0.875rem' :
                     responsive.desktop.buttonSize === 'xl' ? '1.25rem' :
                     responsive.desktop.buttonSize === 'lg' ? '1.125rem' : '1rem'};
      }
    }

    ${responsive.mobile.hideDecoration ? `
      @media (max-width: 767px) {
        .cta-block-${block.id} .cta-decoration {
          display: none;
        }
      }
    ` : ''}
    /* Button Hover Styles */
    ${primaryButton.hoverBackgroundColor ? `
      .cta-block-${block.id} .cta-primary-btn:hover {
        background-color: ${primaryButton.hoverBackgroundColor} !important;
      }
    ` : ''}
    ${primaryButton.hoverTextColor ? `
      .cta-block-${block.id} .cta-primary-btn:hover {
        color: ${primaryButton.hoverTextColor} !important;
      }
    ` : ''}
    ${secondaryButton?.hoverColor ? `
      .cta-block-${block.id} .cta-secondary-btn:hover {
        color: ${secondaryButton.hoverColor} !important;
        border-color: ${secondaryButton.hoverColor} !important;
      }
    ` : ''}
  `

  return (
    <>
      <style>{responsiveStyles}</style>
      <section
        ref={sectionRef}
        className={`cta-block-${block.id} relative overflow-hidden ${shadowClass[boxShadow || 'none']} ${customClass || ''} ${getLayoutClasses()}`}
        style={{
          ...getBackgroundStyles(),
          minHeight,
          paddingTop: padding.top,
          paddingBottom: padding.bottom,
          paddingLeft: padding.left,
          paddingRight: padding.right,
          marginTop: margin.top,
          marginBottom: margin.bottom,
          borderRadius: border?.enabled ? border.radius : undefined,
          borderWidth: border?.enabled ? `${border.width}px` : undefined,
          borderStyle: border?.enabled ? border.style : undefined,
          borderColor: border?.enabled ? border.color : undefined
        }}
      >
        {/* Overlay */}
        {background.overlayEnabled && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: background.overlayColor,
              opacity: (background.overlayOpacity || 20) / 100,
              mixBlendMode: background.overlayBlendMode || 'normal'
            }}
          />
        )}

        {/* Decoration */}
        {showDecoration && <div className="cta-decoration">{renderDecoration()}</div>}

        {/* Content */}
        <div
          className={`relative z-10 mx-auto px-4 sm:px-6 lg:px-8 flex flex-col ${getAlignmentClasses()} ${
            layout === 'split-left' ? 'md:flex-row md:items-center' :
            layout === 'split-right' ? 'md:flex-row-reverse md:items-center' : ''
          }`}
          style={{
            maxWidth: maxWidth === 'custom' ? customMaxWidth : undefined
          }}
        >
          {/* Text Content */}
          <div className={`flex-1 flex flex-col ${getAlignmentClasses()}`}>
            {/* Badge */}
            {renderBadge()}

            {/* Urgency */}
            {renderUrgency()}

            {/* Title */}
            <h2
              className="cta-title font-bold mb-4"
              style={{
                ...typography.title,
                ...getElementStyle(animations.titleAnimation, animations.delay)
              }}
            >
              {renderTitle()}
            </h2>

            {/* Subtitle */}
            {showSubtitle && subtitle && (
              <p
                className="cta-subtitle mb-6"
                style={{
                  ...typography.subtitle,
                  ...getElementStyle(animations.subtitleAnimation, animations.delay + animations.staggerDelay)
                }}
              >
                {subtitle}
              </p>
            )}

            {/* Description */}
            {showDescription && description && (
              <p
                className="mb-6"
                style={{
                  ...typography.description,
                  ...getElementStyle(animations.subtitleAnimation, animations.delay + animations.staggerDelay * 2)
                }}
              >
                {description}
              </p>
            )}

            {/* Buttons */}
            <div
              className={`cta-buttons flex ${
                buttonLayout === 'vertical' ? 'flex-col' :
                buttonLayout === 'stacked' ? 'flex-col sm:flex-row' : 'flex-row'
              } ${
                buttonAlignment === 'center' ? 'justify-center' :
                buttonAlignment === 'right' ? 'justify-end' : 'justify-start'
              }`}
              style={{
                gap: buttonGap,
                ...getElementStyle(animations.buttonAnimation, animations.delay + animations.staggerDelay * 3)
              }}
            >
              {/* Primary Button */}
              <a
                href={primaryButton.link || '#'}
                className={`cta-primary-btn inline-flex items-center justify-center font-medium transition-all duration-300 ${
                  getButtonHoverClass(primaryButton.hoverEffect)
                } ${getButtonAnimationClass(primaryButton.animation)} ${shadowClass[primaryButton.shadow || 'none']} ${
                  primaryButton.style === 'outline' ? 'border-2' :
                  primaryButton.style === 'ghost' ? 'bg-transparent hover:bg-white/10' :
                  primaryButton.style === 'gradient' ? 'bg-gradient-to-r' : ''
                }`}
                style={{
                  backgroundColor: primaryButton.style === 'outline' || primaryButton.style === 'ghost'
                    ? 'transparent'
                    : primaryButton.style === 'gradient'
                      ? undefined
                      : primaryButton.backgroundColor,
                  backgroundImage: primaryButton.style === 'gradient'
                    ? `linear-gradient(to right, ${primaryButton.backgroundColor || '#059669'}, ${primaryButton.borderColor || '#047857'})`
                    : undefined,
                  color: primaryButton.textColor,
                  borderRadius: primaryButton.borderRadius,
                  borderWidth: primaryButton.style === 'outline' ? `${primaryButton.borderWidth || 2}px` : primaryButton.borderWidth ? `${primaryButton.borderWidth}px` : '0',
                  borderStyle: 'solid',
                  borderColor: primaryButton.style === 'outline' || primaryButton.style === 'ghost'
                    ? primaryButton.borderColor || primaryButton.textColor
                    : primaryButton.borderColor || 'transparent',
                  padding: primaryButton.size === 'sm' ? '0.5rem 1rem' :
                           primaryButton.size === 'md' ? '0.75rem 1.5rem' :
                           primaryButton.size === 'lg' ? '1rem 2rem' : '1.25rem 2.5rem',
                  fontSize: primaryButton.size === 'sm' ? '0.875rem' :
                            primaryButton.size === 'md' ? '1rem' :
                            primaryButton.size === 'lg' ? '1.125rem' : '1.25rem'
                }}
              >
                {primaryButton.icon && primaryButton.iconPosition === 'left' && (
                  <span className="mr-2">{primaryButton.icon}</span>
                )}
                {primaryButton.text}
                {primaryButton.icon && primaryButton.iconPosition === 'right' && (
                  <span className="ml-2">{primaryButton.icon}</span>
                )}
              </a>

              {/* Secondary Button */}
              {showSecondaryButton && secondaryButton?.text && (
                <a
                  href={secondaryButton.link || '#'}
                  className={`cta-secondary-btn inline-flex items-center justify-center font-medium transition-all duration-300 ${
                    secondaryButton.style === 'outline' ? 'border-2' :
                    secondaryButton.style === 'link' ? 'underline underline-offset-4' : ''
                  }`}
                  style={{
                    color: secondaryButton.textColor,
                    borderColor: secondaryButton.borderColor,
                    backgroundColor: 'transparent',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '0.5rem'
                  }}
                >
                  {secondaryButton.icon && secondaryButton.iconPosition === 'left' && (
                    <span className="mr-2">{secondaryButton.icon}</span>
                  )}
                  {secondaryButton.text}
                  {secondaryButton.icon && secondaryButton.iconPosition === 'right' && (
                    <span className="ml-2">{secondaryButton.icon}</span>
                  )}
                </a>
              )}
            </div>

            {/* Trust Elements */}
            {renderTrustElements()}
          </div>
        </div>
      </section>
    </>
  )
}
