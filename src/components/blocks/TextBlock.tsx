'use client'

import { useState, useEffect, useRef } from 'react'
import { BlockProps, TextContent } from './types'

export default function TextBlock({ block }: BlockProps) {
  const content = block.content as TextContent
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

  // Get animation styles
  const getAnimationStyles = (): React.CSSProperties => {
    if (!animations.enabled) return {}

    const duration = animations.duration || 500
    const delay = animations.delay || 0

    let transform = 'translate(0, 0) scale(1)'
    if (!isVisible) {
      switch (animations.type) {
        case 'fade': transform = 'translate(0, 0) scale(1)'; break
        case 'slide-up': transform = 'translate(0, 30px) scale(1)'; break
        case 'slide-left': transform = 'translate(-30px, 0) scale(1)'; break
        case 'slide-right': transform = 'translate(30px, 0) scale(1)'; break
        case 'zoom': transform = 'translate(0, 0) scale(0.9)'; break
        default: transform = 'translate(0, 20px) scale(1)'
      }
    }

    return {
      opacity: isVisible ? 1 : 0,
      transform,
      transition: `all ${duration}ms ease`,
      transitionDelay: `${delay}ms`
    }
  }

  // Get max width class
  const getMaxWidthClass = () => {
    const widthMap: Record<string, string> = {
      sm: 'max-w-2xl',
      md: 'max-w-3xl',
      lg: 'max-w-4xl',
      xl: 'max-w-5xl',
      '2xl': 'max-w-6xl',
      full: 'max-w-full'
    }
    return widthMap[content.maxWidth || 'lg'] || 'max-w-4xl'
  }

  // Get alignment class
  const getAlignmentClass = () => {
    const alignMap: Record<string, string> = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify'
    }
    return alignMap[content.alignment || 'left'] || 'text-left'
  }

  // Get background styles
  const getBackgroundStyles = (): React.CSSProperties => {
    // Apply stylePreset overrides
    if (content.stylePreset === 'problem') {
      return { backgroundColor: '#f7f5f3' } // cream background
    }
    if (content.stylePreset === 'solution') {
      return { backgroundColor: '#ffffff' } // white background
    }

    if (!content.background || content.background.type === 'none') return {}

    switch (content.background.type) {
      case 'solid':
        return { backgroundColor: content.background.color || '#ffffff' }
      case 'gradient':
        const direction = content.background.gradientDirection?.replace('to-', 'to ').replace('-', ' ') || 'to right'
        const via = content.background.gradientVia ? `, ${content.background.gradientVia}` : ''
        return {
          background: `linear-gradient(${direction}, ${content.background.gradientFrom || '#10b981'}${via}, ${content.background.gradientTo || '#3b82f6'})`
        }
      case 'image':
        return {
          backgroundImage: `url(${content.background.imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }
      case 'pattern':
        const patternOpacity = (content.background.patternOpacity || 10) / 100
        const patternColor = `rgba(0, 0, 0, ${patternOpacity})`
        const bgColor = content.background.color || '#ffffff'
        switch (content.background.pattern) {
          case 'dots':
            return {
              backgroundColor: bgColor,
              backgroundImage: `radial-gradient(${patternColor} 1.5px, transparent 1.5px)`,
              backgroundSize: '20px 20px'
            }
          case 'grid':
            return {
              backgroundColor: bgColor,
              backgroundImage: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`,
              backgroundSize: '20px 20px'
            }
          case 'lines':
            return {
              backgroundColor: bgColor,
              backgroundImage: `repeating-linear-gradient(45deg, ${patternColor}, ${patternColor} 1px, transparent 1px, transparent 10px)`
            }
          case 'waves':
            return {
              backgroundColor: bgColor,
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='rgba(0,0,0,${patternOpacity})' d='M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")`,
              backgroundRepeat: 'repeat-x',
              backgroundSize: '100% auto',
              backgroundPosition: 'bottom'
            }
          default:
            return { backgroundColor: bgColor }
        }
      default:
        return {}
    }
  }

  // Get border styles
  const getBorderStyles = (): React.CSSProperties => {
    if (!content.border?.enabled) return {}

    const sides = content.border.sides || { top: true, right: true, bottom: true, left: true }
    const width = content.border.width || 1
    const color = content.border.color || '#e2e8f0'
    const style = content.border.style || 'solid'

    return {
      borderTop: sides.top ? `${width}px ${style} ${color}` : 'none',
      borderRight: sides.right ? `${width}px ${style} ${color}` : 'none',
      borderBottom: sides.bottom ? `${width}px ${style} ${color}` : 'none',
      borderLeft: sides.left ? `${width}px ${style} ${color}` : 'none',
      borderRadius: content.border.radius || '0'
    }
  }

  // Get title styles
  const getTitleStyles = (): React.CSSProperties => {
    const t = content.typography?.title
    if (!t) return {}
    
    // Apply stylePreset overrides
    if (content.stylePreset === 'problem' || content.stylePreset === 'solution') {
      return {
        fontSize: '2.5rem',
        fontWeight: '700',
        lineHeight: '1.2',
        letterSpacing: '-0.02em',
        color: '#2C2C2C', // charcoal
        marginBottom: '1.5rem'
      }
    }
    
    return {
      fontSize: t.fontSize || '2rem',
      fontWeight: t.fontWeight || '700',
      lineHeight: t.lineHeight || '1.2',
      letterSpacing: t.letterSpacing || '-0.02em',
      color: t.color || '#1e293b',
      marginBottom: t.marginBottom || '1rem'
    }
  }

  // Get subtitle styles
  const getSubtitleStyles = (): React.CSSProperties => {
    const s = content.typography?.subtitle
    if (!s) return {}
    return {
      fontSize: s.fontSize || '1.25rem',
      fontWeight: s.fontWeight || '400',
      lineHeight: s.lineHeight || '1.5',
      color: s.color || '#64748b',
      marginBottom: s.marginBottom || '1.5rem'
    }
  }

  // Get body styles
  const getBodyStyles = (): React.CSSProperties => {
    const b = content.typography?.body
    if (!b) return {}
    
    // Apply stylePreset overrides
    if (content.stylePreset === 'problem' || content.stylePreset === 'solution') {
      return {
        fontSize: '1.125rem',
        fontWeight: '400',
        lineHeight: '1.75',
        letterSpacing: '0',
        color: '#666666' // gray-custom
      }
    }
    
    return {
      fontSize: b.fontSize || '1.125rem',
      fontWeight: b.fontWeight || '400',
      lineHeight: b.lineHeight || '1.75',
      letterSpacing: b.letterSpacing || '0',
      color: b.color || '#374151'
    }
  }

  // Render divider
  const renderDivider = (divider: typeof content.topDivider) => {
    if (!divider?.enabled) return null

    const dividerStyle: React.CSSProperties = {
      width: divider.width || '100%',
      height: `${divider.thickness || 1}px`,
      backgroundColor: divider.color || '#e2e8f0',
      marginTop: divider.marginTop || '0',
      marginBottom: divider.marginBottom || '0',
      borderStyle: divider.style === 'dashed' ? 'dashed' : divider.style === 'dotted' ? 'dotted' : 'solid',
      borderWidth: divider.style !== 'solid' ? `${divider.thickness || 1}px 0 0 0` : 0,
      borderColor: divider.color || '#e2e8f0'
    }

    if (divider.style === 'gradient') {
      dividerStyle.background = `linear-gradient(to right, transparent, ${divider.color || '#e2e8f0'}, transparent)`
      dividerStyle.borderWidth = 0
    }

    return <div className="mx-auto" style={dividerStyle} />
  }

  // Render quote content
  const renderQuote = () => {
    const qs = content.quoteStyles
    const quoteStyle: React.CSSProperties = {
      borderLeftWidth: qs?.style === 'bordered' || qs?.style === 'simple' ? '4px' : 0,
      borderLeftColor: qs?.borderColor || '#10b981',
      backgroundColor: qs?.style === 'background' ? (qs?.backgroundColor || '#f0fdf4') : 'transparent',
      padding: qs?.style === 'background' || qs?.style === 'bordered' ? '1.5rem' : '0 0 0 1.5rem',
      borderRadius: qs?.style === 'background' ? '0.75rem' : '0'
    }

    return (
      <blockquote style={quoteStyle} className="relative text-body">
        {(qs?.style === 'large' || qs?.style === 'icon') && qs?.quoteIcon !== 'none' && (
          <div className="absolute -top-4 -left-2 text-6xl opacity-20" style={{ color: qs?.iconColor || '#10b981' }}>
            "
          </div>
        )}
        <p
          className={`text-body ${qs?.style === 'large' ? 'text-2xl font-medium italic' : 'text-lg italic'}`}
          style={getBodyStyles()}
        >
          {content.content}
        </p>
        {(content.quoteAuthor || content.quoteRole) && (
          <footer className="mt-4">
            {content.quoteAuthor && (
              <cite className="not-italic font-semibold text-slate-700">{content.quoteAuthor}</cite>
            )}
            {content.quoteRole && (
              <span className="block text-sm" style={{ color: qs?.authorColor || '#64748b' }}>
                {content.quoteRole}
              </span>
            )}
          </footer>
        )}
      </blockquote>
    )
  }

  // Render list content
  const renderList = () => {
    if (!content.listItems?.length) return null

    const ListTag = content.listType === 'numbered' ? 'ol' : 'ul'
    const listClass = content.listType === 'numbered' ? 'list-decimal' :
                      content.listType === 'check' ? 'list-none' : 'list-disc'

    return (
      <ListTag className={`${listClass} list-inside space-y-2 text-body`} style={getBodyStyles()}>
        {content.listItems.map((item, index) => (
          <li key={item.id || index} className={`flex items-start gap-3 ${item.checked === false ? 'opacity-50' : ''}`}>
            {content.listType === 'check' && (
              <span style={{ color: content.listIconColor || '#10b981' }}>
                {item.checked ? '✓' : '○'}
              </span>
            )}
            {content.listType === 'icon' && (
              <span style={{ color: content.listIconColor || '#10b981' }}>★</span>
            )}
            <span className={item.checked ? 'line-through' : ''}>{item.content}</span>
          </li>
        ))}
      </ListTag>
    )
  }

  // Render code content
  const renderCode = () => {
    const isDark = content.codeTheme === 'dark'
    return (
      <pre
        className={`p-4 rounded-xl overflow-x-auto ${isDark ? 'bg-slate-900 text-green-400' : 'bg-slate-100 text-slate-800'}`}
      >
        <code className="text-sm font-mono whitespace-pre-wrap">{content.content}</code>
      </pre>
    )
  }

  // Render callout content
  const renderCallout = () => {
    const borderColor = content.quoteStyles?.borderColor || '#3b82f6'
    const bgColor = content.quoteStyles?.backgroundColor || '#eff6ff'

    return (
      <div
        className="p-4 rounded-xl border-l-4 text-body"
        style={{
          borderLeftColor: borderColor,
          backgroundColor: bgColor
        }}
      >
        <p className="text-body" style={getBodyStyles()}>{content.content}</p>
      </div>
    )
  }

  // Render paragraph content with drop cap
  const renderParagraph = () => {
    const paragraphs = content.content?.split('\n\n') || []
    const dropCap = content.typography?.dropCap

    return (
      <div
        className="space-y-6 text-body"
        style={{
          columnCount: content.columns || 1,
          columnGap: content.columnGap || '2rem'
        }}
      >
        {paragraphs.map((para, index) => (
          <p key={index} style={getBodyStyles()} className="break-inside-avoid text-body">
            {index === 0 && dropCap?.enabled && para.length > 0 ? (
              <>
                <span
                  className="float-left mr-2"
                  style={{
                    fontSize: dropCap.fontSize || '4rem',
                    fontWeight: dropCap.fontWeight || '700',
                    color: dropCap.color || '#10b981',
                    lineHeight: 0.8,
                    marginRight: dropCap.marginRight || '0.5rem'
                  }}
                >
                  {para.charAt(0)}
                </span>
                {para.slice(1)}
              </>
            ) : (
              para
            )}
          </p>
        ))}
      </div>
    )
  }

  // Render content based on type
  const renderContent = () => {
    switch (content.contentType) {
      case 'quote':
        return renderQuote()
      case 'list':
        return renderList()
      case 'code':
        return renderCode()
      case 'callout':
        return renderCallout()
      case 'paragraph':
      default:
        return renderParagraph()
    }
  }

  // Render CTA button
  const renderCTA = () => {
    if (!content.ctaButton?.enabled) return null

    const btn = content.ctaButton
    const sizeClasses = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg'
    }

    const styleClasses = {
      primary: `bg-sage-500 hover:bg-sage-600 text-white`,
      secondary: `bg-slate-500 hover:bg-slate-600 text-white`,
      outline: `border-2 border-sage-500 text-sage-500 hover:bg-sage-50`,
      ghost: `text-sage-500 hover:bg-sage-50`,
      link: `text-sage-500 hover:underline`
    }

    const alignClass = {
      left: 'justify-start',
      center: 'justify-center',
      right: 'justify-end'
    }[btn.alignment || 'left']

    return (
      <div className={`flex mt-8 ${alignClass}`}>
        <a
          href={btn.link || '#'}
          className={`inline-flex items-center gap-2 font-medium transition-all ${sizeClasses[btn.size || 'md']} ${styleClasses[btn.style || 'primary']}`}
          style={{
            backgroundColor: btn.style === 'primary' || btn.style === 'secondary' ? btn.backgroundColor : undefined,
            color: btn.style === 'primary' || btn.style === 'secondary' ? btn.textColor : undefined,
            borderRadius: btn.borderRadius || '0.5rem'
          }}
        >
          {btn.icon && btn.iconPosition === 'left' && <span>{btn.icon}</span>}
          {btn.text || 'Daha Fazla'}
          {btn.icon && btn.iconPosition === 'right' && <span>{btn.icon}</span>}
        </a>
      </div>
    )
  }

  // Main render
  const padding = content.padding || { top: '3rem', bottom: '3rem', left: '1.5rem', right: '1.5rem' }
  const margin = content.margin || { top: '0', bottom: '0' }

  // Responsive CSS
  const responsiveStyles = `
    .text-block-${block.id} .text-title {
      font-size: ${responsive.mobile?.titleSize || '1.5rem'};
    }
    .text-block-${block.id} .text-body {
      font-size: ${responsive.mobile?.bodySize || '1rem'};
    }
    @media (min-width: 768px) {
      .text-block-${block.id} .text-title {
        font-size: ${responsive.tablet?.titleSize || '1.75rem'};
      }
      .text-block-${block.id} .text-body {
        font-size: ${responsive.tablet?.bodySize || '1rem'};
      }
    }
    @media (min-width: 1024px) {
      .text-block-${block.id} .text-title {
        font-size: ${responsive.desktop?.titleSize || content.typography?.title?.fontSize || '2rem'};
      }
      .text-block-${block.id} .text-body {
        font-size: ${responsive.desktop?.bodySize || content.typography?.body?.fontSize || '1.125rem'};
      }
    }
    ${responsive.mobileAlignment ? `
      @media (max-width: 767px) {
        .text-block-${block.id} .text-content {
          text-align: ${responsive.mobileAlignment};
        }
      }
    ` : ''}
    ${responsive.mobilePadding ? `
      @media (max-width: 767px) {
        .text-block-${block.id} .text-inner {
          padding-left: ${responsive.mobilePadding} !important;
          padding-right: ${responsive.mobilePadding} !important;
        }
      }
    ` : ''}
    ${content.typography?.links?.color ? `
      .text-block-${block.id} a {
        color: ${content.typography.links.color};
        text-decoration: ${content.typography.links.decoration || 'underline'};
      }
      .text-block-${block.id} a:hover {
        color: ${content.typography.links.hoverColor || content.typography.links.color};
        text-decoration: ${content.typography.links.hoverDecoration || 'none'};
      }
    ` : ''}
  `

  return (
    <>
      <style>{responsiveStyles}</style>
      <section
        ref={sectionRef}
        className={`text-block-${block.id} ${content.customClass || ''}`}
        style={{
          ...getBackgroundStyles(),
          ...getAnimationStyles(),
          paddingTop: padding.top,
          paddingBottom: padding.bottom,
          marginTop: margin.top,
          marginBottom: margin.bottom
        }}
      >
      {/* Image overlay for background image */}
      {content.background?.type === 'image' && content.background.imageOverlayOpacity && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: content.background.imageOverlayColor || '#000000',
            opacity: (content.background.imageOverlayOpacity || 0) / 100
          }}
        />
      )}

      <div
        className={`${getMaxWidthClass()} mx-auto relative text-inner`}
        style={{
          paddingLeft: padding.left,
          paddingRight: padding.right,
          ...getBorderStyles()
        }}
      >
        {/* Top Divider */}
        {renderDivider(content.topDivider)}

        <div className={`${getAlignmentClass()} text-content`}>
          {/* Title */}
          {content.showTitle !== false && content.title && (
            <h2 className="text-title" style={getTitleStyles()}>{content.title}</h2>
          )}

          {/* Subtitle */}
          {content.showSubtitle && content.subtitle && (
            <p className="text-subtitle" style={getSubtitleStyles()}>{content.subtitle}</p>
          )}

          {/* Main Content */}
          {renderContent()}

          {/* CTA Button */}
          {renderCTA()}
        </div>

        {/* Bottom Divider */}
        {renderDivider(content.bottomDivider)}
      </div>
    </section>
    </>
  )
}
