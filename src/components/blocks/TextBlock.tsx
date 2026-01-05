'use client'

import { useState, useEffect, useRef } from 'react'
import { BlockProps, TextContent } from './types'
import Image from 'next/image'

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
    if (content.maxWidth === 'custom' && content.customMaxWidth) {
      return ''
    }
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
      default:
        return {}
    }
  }

  // Get border styles
  const getBorderStyles = (): React.CSSProperties => {
    if (!content.border?.enabled) return {}
    return {
      borderTopWidth: content.border.thickness || 1,
      borderTopStyle: content.border.style || 'solid',
      borderTopColor: content.border.color || '#e2e8f0',
      paddingTop: content.border.marginTop || '2rem'
    }
  }

  // Get container styles
  const getContainerStyles = (): React.CSSProperties => {
    const styles: React.CSSProperties = {
      padding: content.containerPadding || '2rem',
      backgroundColor: content.containerBackground || '#ffffff',
      borderRadius: content.containerBorderRadius || '0.75rem'
    }

    switch (content.containerStyle) {
      case 'card':
        styles.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
        break
      case 'bordered':
        styles.border = '2px solid #e2e8f0'
        break
      case 'shadow':
        styles.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        break
      case 'outlined':
        styles.border = '3px solid #64748b'
        break
    }

    return styles
  }

  // Render divider
  const renderDivider = (divider?: any) => {
    if (!divider || !divider.enabled) return null
    return (
      <div
        style={{
          borderTopWidth: divider.thickness || 1,
          borderTopStyle: divider.style || 'solid',
          borderTopColor: divider.color || '#e2e8f0',
          marginTop: divider.marginTop || '2rem',
          marginBottom: divider.marginBottom || '2rem',
          width: divider.width || '100%'
        }}
      />
    )
  }

  // Render images
  const renderImages = () => {
    if (!content.images || content.images.length === 0) return null

    const images = content.images.map((image, index) => {
      // Width handling - convert "full" to Tailwind class or use as style
      const widthClass = image.width === 'full' || image.width === '100%' 
        ? 'w-full' 
        : image.width?.startsWith('w-') 
          ? image.width 
          : 'w-full'
      
      // For split layouts, image should fill container
      const isSplitLayout = content.layoutType === 'image-left' || content.layoutType === 'image-right'
      
      const imgElement = (
        <div
          className={`relative ${isSplitLayout ? 'w-full h-full' : widthClass} ${isSplitLayout ? '' : (image.height === 'auto' || !image.height ? 'h-auto' : image.height)} overflow-hidden`}
          style={{
            borderRadius: isSplitLayout ? '0' : (image.borderRadius || '0.75rem'),
            boxShadow: image.shadow === 'none' ? 'none' : image.shadow ? `var(--shadow-${image.shadow})` : undefined,
            aspectRatio: isSplitLayout ? undefined : (image.aspectRatio || '16/9'),
            maxWidth: isSplitLayout ? '100%' : (image.width && !image.width.startsWith('w-') && image.width !== 'full' ? image.width : undefined),
            minHeight: isSplitLayout ? '100%' : undefined
          }}
        >
          <Image
            src={image.url}
            alt={image.alt || `Image ${index + 1}`}
            fill
            className={`object-${image.objectFit || 'cover'}`}
          />
        </div>
      )

      const wrapper = (
        <div
          key={image.id || index}
          className="mb-4"
          style={{
            textAlign: image.alignment || 'center',
            marginBottom: index < content.images!.length - 1 ? content.imageSpacing || '2rem' : '0'
          }}
        >
          {image.link ? (
            <a href={image.link} className="inline-block">
              {imgElement}
            </a>
          ) : (
            imgElement
          )}
          {image.caption && (
            <p className="text-sm text-slate-600 mt-2 italic text-center">{image.caption}</p>
          )}
        </div>
      )

      return wrapper
    })

    return <div className="text-block-images">{images}</div>
  }

  // Render title based on position
  const renderTitle = () => {
    if (content.showTitle === false || !content.title) return null

    const titleParts = content.title.split(' ')
    const lastWord = titleParts[titleParts.length - 1]
    const restOfTitle = titleParts.slice(0, -1).join(' ')

    const highlightWord = content.highlightedText || (content.useAutoHighlight !== false ? lastWord : null)

    const titleElement = (
      <h2 className="text-title mb-6 leading-tight">
        {highlightWord && content.title.includes(highlightWord) ? (
          <>
            <span style={getTitleStyles()}>
              {content.title.substring(0, content.title.lastIndexOf(highlightWord))}
            </span>
            <span style={{
              ...getTitleStyles(),
              color: content.typography?.highlightedText?.color || '#9CAF88',
              fontWeight: content.typography?.highlightedText?.fontWeight || content.typography?.title?.fontWeight || '700'
            }}>
              {highlightWord}
            </span>
          </>
        ) : (
          <span style={getTitleStyles()}>{content.title}</span>
        )}
      </h2>
    )

    // Position-based rendering
    if (content.titlePosition === 'center') {
      return <div className="text-center mb-6">{titleElement}</div>
    }
    
    // top (default)
    return titleElement
  }

  // Get title styles
  const getTitleStyles = (): React.CSSProperties => {
    return {
      fontFamily: content.typography?.title?.fontFamily || "'Poppins', sans-serif",
      fontSize: content.typography?.title?.fontSize || '2rem',
      fontWeight: content.typography?.title?.fontWeight || '700',
      lineHeight: content.typography?.title?.lineHeight || '1.2',
      letterSpacing: content.typography?.title?.letterSpacing || '-0.02em',
      color: content.typography?.title?.color || '#2C2C2C',
      marginBottom: content.typography?.title?.marginBottom || '1.5rem'
    }
  }

  // Get subtitle styles
  const getSubtitleStyles = (): React.CSSProperties => {
    return {
      fontFamily: content.typography?.subtitle?.fontFamily || "'Poppins', sans-serif",
      fontSize: content.typography?.subtitle?.fontSize || '1.25rem',
      fontWeight: content.typography?.subtitle?.fontWeight || '400',
      lineHeight: content.typography?.subtitle?.lineHeight || '1.5',
      color: content.typography?.subtitle?.color || '#64748b',
      marginBottom: content.typography?.subtitle?.marginBottom || '1.5rem'
    }
  }

  // Render content based on type
  const renderContent = () => {
    const bodyStyles: React.CSSProperties = {
      fontFamily: content.typography?.body?.fontFamily || "'Poppins', sans-serif",
      fontSize: content.typography?.body?.fontSize || '1.125rem',
      fontWeight: content.typography?.body?.fontWeight || '400',
      lineHeight: content.typography?.body?.lineHeight || '1.75',
      letterSpacing: content.typography?.body?.letterSpacing || '0',
      color: content.typography?.body?.color || '#666666',
      marginBottom: content.typography?.body?.marginBottom || '0'
    }

    switch (content.contentType) {
      case 'quote':
        return renderQuote(bodyStyles)
      case 'callout':
        return renderCallout(bodyStyles)
      case 'list':
        return renderList(bodyStyles)
      case 'code':
        return renderCode(bodyStyles)
      default:
        return renderParagraph(bodyStyles)
    }
  }

  // Render paragraph
  const renderParagraph = (bodyStyles: React.CSSProperties) => {
    if (content.columns > 1) {
      const columnClass = content.columns === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'
      return (
        <div className={`grid grid-cols-1 ${columnClass} gap-${content.columnGap?.replace('rem', '') || '2'}`} style={{ gap: content.columnGap || '2rem' }}>
          {content.content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-body" style={bodyStyles}>
              {paragraph}
            </p>
          ))}
        </div>
      )
    }

    // Parse HTML and apply proper paragraph spacing
    const processedContent = content.content
      .replace(/<p>/g, '<p style="margin-bottom: 1rem;">')
      .replace(/<p style="margin-bottom: 1rem;">/g, '<p style="margin-bottom: 1rem;">') // Avoid double styling
      .replace(/<p\s+style="[^"]*">/g, (match) => {
        // If p tag already has style, add margin-bottom if not present
        if (!match.includes('margin-bottom')) {
          return match.replace('style="', 'style="margin-bottom: 1rem; ')
        }
        return match
      })

    return (
      <div 
        className="text-block-html-content"
        style={{
          ...bodyStyles,
          ...(content.typography?.body?.paragraphSpacing ? {
            // Apply paragraph spacing via CSS
          } : {})
        }}
        dangerouslySetInnerHTML={{ __html: processedContent }}
      />
    )
  }

  // Render quote
  const renderQuote = (bodyStyles: React.CSSProperties) => {
    const qs = content.quoteStyles
    return (
      <blockquote
        className={`border-l-4 ${qs?.style === 'large' ? 'border-sage-500' : 'border-slate-300'} pl-6 py-4 my-6`}
        style={{
          backgroundColor: qs?.backgroundColor || 'transparent',
          borderRadius: qs?.borderRadius || '0.5rem',
          fontStyle: 'italic'
        }}
      >
        <div
          className={`text-body ${qs?.style === 'large' ? 'text-2xl font-medium italic' : 'text-lg italic'}`}
          style={{
            ...bodyStyles,
            color: qs?.textColor || bodyStyles.color
          }}
        >
          {content.content}
        </div>
        {(content.quoteAuthor || content.quoteRole) && (
          <footer className="mt-4 text-sm text-slate-500">
            {content.quoteAuthor && <cite className="font-semibold">{content.quoteAuthor}</cite>}
            {content.quoteRole && <span className="ml-2">— {content.quoteRole}</span>}
          </footer>
        )}
      </blockquote>
    )
  }

  // Render callout
  const renderCallout = (bodyStyles: React.CSSProperties) => {
    return (
      <div
        className="p-6 rounded-xl bg-amber-50 border-l-4 border-amber-400 my-6"
        style={{
          backgroundColor: content.typography?.callout?.backgroundColor || '#fef3c7',
          borderColor: content.typography?.callout?.borderColor || '#fbbf24'
        }}
      >
        <div className="text-body" style={bodyStyles}>
          {content.content}
        </div>
      </div>
    )
  }

  // Render list
  const renderList = (bodyStyles: React.CSSProperties) => {
    const items = content.listItems || content.content.split('\n').filter(line => line.trim())
    const listType = content.listType || 'bullet'

    return (
      <ul
        className={`${
          listType === 'numbered' ? 'list-decimal' :
          listType === 'check' ? 'list-none' :
          'list-disc'
        } space-y-2 my-6`}
        style={{
          paddingLeft: listType === 'check' ? '0' : '1.5rem',
          ...bodyStyles
        }}
      >
        {items.map((item, index) => (
          <li key={index} className="text-body">
            {typeof item === 'string' ? item : item.text}
          </li>
        ))}
      </ul>
    )
  }

  // Render code
  const renderCode = (bodyStyles: React.CSSProperties) => {
    return (
      <pre
        className={`p-4 rounded-lg overflow-x-auto my-6 ${
          content.codeTheme === 'dark' ? 'bg-slate-900 text-slate-100' : 'bg-slate-100 text-slate-900'
        }`}
        style={{
          fontFamily: 'monospace',
          ...bodyStyles
        }}
      >
        <code>{content.content}</code>
      </pre>
    )
  }

  // Render CTA button
  const renderCTA = () => {
    const btn = content.ctaButton
    if (!btn || !btn.enabled) return null

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

  // Render inner content (reusable)
  const renderInnerContent = () => {
    return (
      <>
        {/* Top Divider */}
        {renderDivider(content.topDivider)}

        {/* Container wrapper if style is set */}
        {(content.containerStyle && content.containerStyle !== 'none') ? (
          <div style={getContainerStyles()}>
            {/* Images at top */}
            {(content.imagePosition === 'top') && renderImages()}

            {/* Enterprise Layout: Image-Left or Image-Right */}
            {content.layoutType === 'image-left' || content.layoutType === 'image-right' ? (
              <div className={`grid ${content.layoutType === 'image-left' ? 'md:grid-cols-[1fr_1fr]' : 'md:grid-cols-[1fr_1fr]'} gap-0 items-stretch`} style={{ minHeight: '500px' }}>
                {/* Image */}
                <div className={`${content.layoutType === 'image-left' ? 'order-1' : 'order-2'} relative`} style={{ minHeight: '500px', width: '100%' }}>
                  {content.images && content.images.length > 0 && (
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={content.images[0].url}
                        alt={content.images[0].alt || 'Image'}
                        fill
                        className="object-cover"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
                {/* Content */}
                <div className={`${getAlignmentClass()} text-content ${content.layoutType === 'image-left' ? 'order-2' : 'order-1'} flex flex-col justify-center`} style={{ 
                  backgroundColor: '#ffffff',
                  padding: '3rem 2rem'
                }}>
                  {renderTitle()}
                  {content.showSubtitle && content.subtitle && (
                    <p className="text-subtitle" style={getSubtitleStyles()}>{content.subtitle}</p>
                  )}
                  {renderContent()}
                  {renderCTA()}
                </div>
              </div>
            ) : (
              <>
                {/* Images at top */}
                {(content.imagePosition === 'top' || content.imagePosition === 'full-width') && renderImages()}

                <div className={`${getAlignmentClass()} text-content`}>
                  {renderTitle()}

                  {/* Subtitle */}
                  {content.showSubtitle && content.subtitle && (
                    <p className="text-subtitle" style={getSubtitleStyles()}>{content.subtitle}</p>
                  )}

                  {/* Enterprise Layout: Image-Left or Image-Right (inline) */}
                  {(content.imagePosition === 'left' || content.imagePosition === 'right') ? (
                    <div className={`grid ${content.imagePosition === 'left' ? 'md:grid-cols-[1fr_2fr]' : 'md:grid-cols-[2fr_1fr]'} gap-8 lg:gap-12 items-start`}>
                      <div className={content.imagePosition === 'left' ? 'order-1' : 'order-2'}>
                        {renderImages()}
                      </div>
                      <div className={`${content.imagePosition === 'left' ? 'order-2' : 'order-1'}`}>
                        {renderContent()}
                        {renderCTA()}
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Images inline-left or inline-right */}
                      {(content.imagePosition === 'inline-left' || content.imagePosition === 'inline-right' || content.imagePosition === 'inline-center') && (
                        <div
                          className={`flex ${content.imagePosition === 'inline-left' ? 'flex-row' : content.imagePosition === 'inline-right' ? 'flex-row-reverse' : 'flex-col'}`}
                          style={{ gap: content.imageSpacing || '2rem', alignItems: 'center', marginBottom: content.imageSpacing || '2rem' }}
                        >
                          <div style={{ flex: content.imagePosition === 'inline-center' ? '1' : '0 0 auto' }}>
                            {renderImages()}
                          </div>
                          <div style={{ flex: '1' }}>
                            {renderContent()}
                          </div>
                        </div>
                      )}

                      {/* Regular content (if not inline/split image) */}
                      {!['left', 'right', 'inline-left', 'inline-right', 'inline-center'].includes(content.imagePosition || 'none') && (
                        <>
                          {renderContent()}
                        </>
                      )}

                      {renderCTA()}
                    </>
                  )}
                </div>

                {/* Images at bottom */}
                {(content.imagePosition === 'bottom') && renderImages()}
              </>
            )}
          </div>
        ) : (
          <>
            {/* Enterprise Layout: Image-Left or Image-Right (no container) */}
            {content.layoutType === 'image-left' || content.layoutType === 'image-right' ? (
              <div className={`grid ${content.layoutType === 'image-left' ? 'md:grid-cols-[1fr_1fr]' : 'md:grid-cols-[1fr_1fr]'} gap-0 items-stretch`} style={{ minHeight: '500px' }}>
                <div className={`${content.layoutType === 'image-left' ? 'order-1' : 'order-2'} relative`} style={{ minHeight: '500px', width: '100%' }}>
                  {content.images && content.images.length > 0 && (
                    <div className="absolute inset-0 w-full h-full">
                      <Image
                        src={content.images[0].url}
                        alt={content.images[0].alt || 'Image'}
                        fill
                        className="object-cover"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}
                </div>
                <div className={`${getAlignmentClass()} text-content ${content.layoutType === 'image-left' ? 'order-2' : 'order-1'} flex flex-col justify-center`} style={{ 
                  backgroundColor: '#ffffff',
                  padding: '3rem 2rem'
                }}>
                  {renderTitle()}
                  {content.showSubtitle && content.subtitle && (
                    <p className="text-subtitle" style={getSubtitleStyles()}>{content.subtitle}</p>
                  )}
                  {renderContent()}
                  {renderCTA()}
                </div>
              </div>
            ) : (
              <>
                {/* Images at top */}
                {(content.imagePosition === 'top' || content.imagePosition === 'full-width') && renderImages()}

                {/* Full-width images are outside container */}
                {content.imagePosition === 'full-width' ? null : (
                  <div className={`${getAlignmentClass()} text-content`}>
                    {renderTitle()}

                    {content.showSubtitle && content.subtitle && (
                      <p className="text-subtitle" style={getSubtitleStyles()}>{content.subtitle}</p>
                    )}

                    {/* Enterprise Layout: Image-Left or Image-Right (inline) */}
                    {(content.imagePosition === 'left' || content.imagePosition === 'right') ? (
                      <div className={`grid ${content.imagePosition === 'left' ? 'md:grid-cols-[1fr_2fr]' : 'md:grid-cols-[2fr_1fr]'} gap-8 lg:gap-12 items-start`}>
                        <div className={content.imagePosition === 'left' ? 'order-1' : 'order-2'}>
                          {renderImages()}
                        </div>
                        <div className={content.imagePosition === 'left' ? 'order-2' : 'order-1'}>
                          {renderContent()}
                          {renderCTA()}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Images inline-left or inline-right */}
                        {(content.imagePosition === 'inline-left' || content.imagePosition === 'inline-right' || content.imagePosition === 'inline-center') && (
                          <div
                            className={`flex ${content.imagePosition === 'inline-left' ? 'flex-row' : content.imagePosition === 'inline-right' ? 'flex-row-reverse' : 'flex-col'}`}
                            style={{ gap: content.imageSpacing || '2rem', alignItems: 'center', marginBottom: content.imageSpacing || '2rem' }}
                          >
                            <div style={{ flex: content.imagePosition === 'inline-center' ? '1' : '0 0 auto' }}>
                              {renderImages()}
                            </div>
                            <div style={{ flex: '1' }}>
                              {renderContent()}
                            </div>
                          </div>
                        )}

                        {/* Regular content */}
                        {!['left', 'right', 'inline-left', 'inline-right', 'inline-center'].includes(content.imagePosition || 'none') && (
                          <>
                            {renderContent()}
                          </>
                        )}

                        {renderCTA()}
                      </>
                    )}
                  </div>
                )}

                {/* Images at bottom */}
                {(content.imagePosition === 'bottom') && renderImages()}
              </>
            )}
          </>
        )}

        {/* Bottom Divider */}
        {renderDivider(content.bottomDivider)}
      </>
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
    /* Paragraph spacing */
    .text-block-${block.id} .text-block-html-content p {
      margin-bottom: ${content.typography?.body?.paragraphSpacing || '1rem'};
      line-height: ${content.typography?.body?.lineHeight || '1.75'};
    }
    .text-block-${block.id} .text-block-html-content p:last-child {
      margin-bottom: 0;
    }
    .text-block-${block.id} .text-block-html-content ul,
    .text-block-${block.id} .text-block-html-content ol {
      margin-bottom: ${content.typography?.body?.paragraphSpacing || '1rem'};
    }
    .text-block-${block.id} .text-block-html-content ul li,
    .text-block-${block.id} .text-block-html-content ol li {
      margin-bottom: 0.5rem;
    }
    .text-block-${block.id} .text-block-html-content strong {
      font-weight: 600;
      color: ${content.typography?.body?.color || '#666666'};
    }
    /* Center Content Wrapper Styles */
    .center-content-wrapper {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
    }
    .center-block {
      background-color: ${content.wrapperBackground || '#ffffff'};
      padding: ${content.wrapperPadding || '2rem'};
      border-radius: ${content.containerBorderRadius || '0.75rem'};
    }
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
      {/* Background image overlay */}
      {content.background?.type === 'image' && content.background.imageOverlayOpacity && (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: content.background.imageOverlayColor || '#000000',
            opacity: (content.background.imageOverlayOpacity || 0) / 100
          }}
        />
      )}

      {/* Content Wrapper - center-content-wrapper / center-block */}
      {content.contentWrapper === 'center-content-wrapper' || content.contentWrapper === 'center-block' ? (
        <div className={`center-content-wrapper ${content.contentWrapper === 'center-block' ? 'center-block' : ''}`}>
          <div
            className={`${getMaxWidthClass()} mx-auto relative text-inner`}
            style={{
              paddingLeft: padding.left,
              paddingRight: padding.right,
              ...getBorderStyles(),
              ...(content.contentWrapper === 'center-block' ? {
                padding: content.wrapperPadding || '2rem',
                backgroundColor: content.wrapperBackground || 'transparent',
                borderRadius: content.containerBorderRadius || '0.75rem'
              } : {}),
              ...(content.maxWidth === 'custom' && content.customMaxWidth ? {
                maxWidth: content.customMaxWidth
              } : {})
            }}
          >
            {renderInnerContent()}
          </div>
        </div>
      ) : (
        <div
          className={`${getMaxWidthClass()} mx-auto relative text-inner`}
          style={{
            paddingLeft: padding.left,
            paddingRight: padding.right,
            ...getBorderStyles(),
            ...(content.maxWidth === 'custom' && content.customMaxWidth ? {
              maxWidth: content.customMaxWidth
            } : {})
          }}
        >
          {renderInnerContent()}
        </div>
      )}
    </section>
    </>
  )
}
