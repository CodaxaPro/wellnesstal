'use client'

import React from 'react'

import Image from 'next/image'

import {
  BlockProps,
  TeamContent,
  TeamMember,
  TeamCardStyle,
  TeamImageStyle,
  TeamSocialStyle,
  TeamTypography,
  TeamBackground,
  TeamAnimations,
  TeamResponsive
} from './types'

// Default values
const defaultCardStyle: TeamCardStyle = {
  backgroundColor: '#ffffff',
  borderStyle: 'solid',
  borderWidth: 1,
  borderColor: '#e2e8f0',
  borderRadius: '1rem',
  shadow: 'md',
  hoverEffect: 'lift',
  hoverTransitionDuration: 300,
  padding: '1.5rem',
  contentAlignment: 'center'
}

const defaultImageStyle: TeamImageStyle = {
  shape: 'circle',
  size: 'lg',
  borderWidth: 0,
  grayscale: false,
  grayscaleHover: false,
  hoverScale: 1.05,
  objectFit: 'cover',
  showInitials: true,
  initialsBackgroundColor: '#86a789',
  initialsTextColor: '#ffffff'
}

const defaultSocialStyle: TeamSocialStyle = {
  showSocial: true,
  position: 'below-info',
  iconSize: 'md',
  iconColor: '#64748b',
  iconHoverColor: '#86a789',
  gap: '0.75rem'
}

const defaultTypography: TeamTypography = {
  name: { fontSize: '1.25rem', fontWeight: '600', color: '#1e293b', lineHeight: '1.4' },
  role: { fontSize: '0.95rem', fontWeight: '500', color: '#86a789', lineHeight: '1.5' },
  bio: { fontSize: '0.875rem', fontWeight: '400', color: '#64748b', lineHeight: '1.6', maxLines: 3 },
  quote: { fontSize: '0.875rem', fontWeight: '400', fontStyle: 'italic', color: '#64748b', lineHeight: '1.5', borderColor: '#86a789', borderWidth: '2px' }
}

const defaultAnimations: TeamAnimations = {
  enabled: true,
  type: 'fade',
  stagger: true,
  staggerDelay: 100,
  duration: 500,
  hoverEffects: true
}

const defaultResponsive: TeamResponsive = {
  desktop: { columns: 3, gap: '2rem', padding: '4rem' },
  tablet: { columns: 2, gap: '1.5rem', padding: '3rem' },
  mobile: { columns: 1, gap: '1rem', padding: '2rem' }
}

export default function TeamBlock({ block }: BlockProps) {
  const content = block.content as TeamContent
  const members = content.members || []

  // Merge with defaults
  const cardStyle = { ...defaultCardStyle, ...content.cardStyle }
  const imageStyle = { ...defaultImageStyle, ...content.imageStyle }
  const socialStyle = { ...defaultSocialStyle, ...content.socialStyle }
  const typography = {
    name: { ...defaultTypography.name, ...content.typography?.name },
    role: { ...defaultTypography.role, ...content.typography?.role },
    bio: { ...defaultTypography.bio, ...content.typography?.bio },
    quote: { ...defaultTypography.quote, ...content.typography?.quote }
  }
  const animations = { ...defaultAnimations, ...content.animations }
  const responsive = {
    desktop: { ...defaultResponsive.desktop, ...content.responsive?.desktop },
    tablet: { ...defaultResponsive.tablet, ...content.responsive?.tablet },
    mobile: { ...defaultResponsive.mobile, ...content.responsive?.mobile }
  }
  const background: TeamBackground = content.background || { type: 'solid', color: '#f8fafc' }
  const header = content.header || {}

  // Visibility controls
  const showBio = content.showBio !== false
  const showSocial = content.showSocial !== false
  const showDepartment = content.showDepartment === true
  const showQuote = content.showQuote === true

  // Helper function to check if a color is dark
  const isColorDark = (color: string): boolean => {
    if (!color) {
return false
}
    // Remove # if present
    const hex = color.replace('#', '')
    if (hex.length !== 6) {
return false
}
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance < 0.5
  }

  // Get auto-contrasting quote color based on card background
  const getQuoteColor = (cardBgColor?: string): string => {
    // If typography.quote.color is explicitly set, use it
    if (typography.quote?.color && typography.quote.color !== '#64748b') {
      return typography.quote.color
    }
    // Auto-detect based on card background
    const bgColor = cardBgColor || cardStyle.backgroundColor || '#ffffff'
    if (isColorDark(bgColor)) {
      return '#cbd5e1' // Light color for dark backgrounds
    }
    return typography.quote?.color || '#64748b' // Default for light backgrounds
  }

  // Helper functions
  const getShadowClass = (shadow?: string): string => {
    const shadowMap: Record<string, string> = {
      none: '',
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
      '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
    }
    return shadowMap[shadow || 'md'] || shadowMap.md
  }

  const getImageSizeValue = (size?: string): string => {
    const sizeMap: Record<string, string> = {
      sm: '80px',
      md: '120px',
      lg: '160px',
      xl: '200px',
      full: '100%'
    }
    return sizeMap[size || 'lg'] || sizeMap.lg
  }

  const getBackgroundStyle = (): React.CSSProperties => {
    if (background.type === 'solid') {
      return { backgroundColor: background.color || '#f8fafc' }
    }
    if (background.type === 'gradient') {
      const direction = background.gradientDirection === 'to-r' ? 'to right' :
        background.gradientDirection === 'to-l' ? 'to left' :
        background.gradientDirection === 'to-t' ? 'to top' :
        background.gradientDirection === 'to-b' ? 'to bottom' :
        background.gradientDirection === 'to-br' ? 'to bottom right' :
        background.gradientDirection === 'to-bl' ? 'to bottom left' :
        background.gradientDirection === 'to-tr' ? 'to top right' : 'to top left'
      const via = background.gradientVia ? `, ${background.gradientVia}` : ''
      return {
        background: `linear-gradient(${direction}, ${background.gradientFrom || '#f8fafc'}${via}, ${background.gradientTo || '#f1f5f9'})`
      }
    }
    if (background.type === 'image' && background.imageUrl) {
      return {
        backgroundImage: `url(${background.imageUrl})`,
        backgroundSize: background.imageSize || 'cover',
        backgroundPosition: background.imagePosition || 'center',
        backgroundRepeat: 'no-repeat'
      }
    }
    return {}
  }

  const getAnimationStyle = (index: number): React.CSSProperties => {
    if (!animations.enabled || animations.type === 'none') {
return {}
}

    const baseDelay = animations.delay || 0
    const staggerDelay = animations.stagger ? (animations.staggerDelay || 100) * index : 0
    const totalDelay = baseDelay + staggerDelay
    const duration = animations.duration || 500

    const animationNames: Record<string, string> = {
      fade: 'team-fade',
      'slide-up': 'team-slideUp',
      'slide-left': 'team-slideLeft',
      'slide-right': 'team-slideRight',
      zoom: 'team-zoom',
      flip: 'team-flip'
    }

    const animationName = animationNames[animations.type || 'fade'] || 'team-fade'

    return {
      opacity: 0,
      animation: `${animationName} ${duration}ms ease-out ${totalDelay}ms forwards`
    }
  }

  const getAnimationKeyframes = (): string => {
    if (!animations.enabled || animations.type === 'none') {
return ''
}
    return `
      @keyframes team-fade {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes team-slideUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes team-slideLeft {
        from { opacity: 0; transform: translateX(30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes team-slideRight {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes team-zoom {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes team-flip {
        from { opacity: 0; transform: perspective(400px) rotateY(-90deg); }
        to { opacity: 1; transform: perspective(400px) rotateY(0); }
      }
    `
  }

  const getResponsiveStyles = (): string => {
    return `
      .team-grid-${block.id} {
        display: grid;
        grid-template-columns: repeat(${responsive.desktop.columns}, 1fr);
        gap: ${responsive.desktop.gap};
      }
      @media (max-width: 1024px) {
        .team-grid-${block.id} {
          grid-template-columns: repeat(${responsive.tablet.columns}, 1fr);
          gap: ${responsive.tablet.gap};
        }
      }
      @media (max-width: 640px) {
        .team-grid-${block.id} {
          grid-template-columns: repeat(${responsive.mobile.columns}, 1fr);
          gap: ${responsive.mobile.gap};
        }
      }
    `
  }

  const getHoverStyles = (): string => {
    if (!animations.hoverEffects) {
return ''
}

    const transitionDuration = cardStyle.hoverTransitionDuration || 300
    let hoverStyles = ''

    if (cardStyle.hoverEffect === 'lift') {
      hoverStyles = `
        .team-card-${block.id}:hover {
          transform: translateY(-8px);
          box-shadow: ${getShadowClass(cardStyle.shadowHover || 'xl')};
        }
      `
    } else if (cardStyle.hoverEffect === 'scale') {
      hoverStyles = `
        .team-card-${block.id}:hover {
          transform: scale(1.03);
        }
      `
    } else if (cardStyle.hoverEffect === 'glow') {
      hoverStyles = `
        .team-card-${block.id}:hover {
          box-shadow: 0 0 30px rgba(134, 167, 137, 0.4);
        }
      `
    } else if (cardStyle.hoverEffect === 'border-color') {
      hoverStyles = `
        .team-card-${block.id}:hover {
          border-color: #86a789;
        }
      `
    } else if (cardStyle.hoverEffect === 'bg-color') {
      hoverStyles = `
        .team-card-${block.id}:hover {
          background-color: ${cardStyle.backgroundHover || '#f8fafc'};
        }
      `
    }

    // Image hover effects
    const imageHoverStyles = `
      .team-card-${block.id}:hover .team-image {
        transform: scale(${imageStyle.hoverScale || 1.05});
        ${imageStyle.grayscaleHover === true && imageStyle.grayscale ? 'filter: grayscale(0);' : ''}
      }
    `

    return `
      .team-card-${block.id} {
        transition: all ${transitionDuration}ms ease;
      }
      .team-card-${block.id} .team-image {
        transition: all ${transitionDuration}ms ease;
      }
      ${hoverStyles}
      ${imageHoverStyles}
    `
  }

  const getMaxWidthClass = (maxWidth?: string): string => {
    const widthMap: Record<string, string> = {
      sm: '672px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
      full: '100%'
    }
    return widthMap[maxWidth || 'xl'] || widthMap.xl
  }

  const renderMemberImage = (member: TeamMember) => {
    const imageSize = getImageSizeValue(imageStyle.size)
    const borderRadius = imageStyle.shape === 'circle' ? '50%' :
      imageStyle.shape === 'rounded' ? '1rem' :
      imageStyle.shape === 'hexagon' ? '0' : '0'

    const imageContainerStyle: React.CSSProperties = {
      width: imageStyle.size === 'full' ? '100%' : imageSize,
      height: imageStyle.size === 'full' ? '200px' : imageSize,
      borderRadius,
      overflow: 'hidden',
      border: imageStyle.borderWidth ? `${imageStyle.borderWidth}px solid ${imageStyle.borderColor || '#e2e8f0'}` : undefined,
      margin: cardStyle.contentAlignment === 'center' ? '0 auto' : undefined,
      position: 'relative' as const,
      flexShrink: 0
    }

    // Per-member image settings (override global settings)
    const memberImageSettings = member.imageSettings || {}
    const objectFit = memberImageSettings.objectFit || imageStyle.objectFit || 'cover'
    const objectPosition = memberImageSettings.position || imageStyle.objectPosition || 'center'
    const scale = memberImageSettings.scale || 1
    const grayscale = memberImageSettings.grayscale ?? imageStyle.grayscale
    const brightness = memberImageSettings.brightness ?? 100
    const contrast = memberImageSettings.contrast ?? 100

    // Build filter string
    const filters: string[] = []
    if (grayscale) {
filters.push('grayscale(100%)')
}
    if (brightness !== 100) {
filters.push(`brightness(${brightness}%)`)
}
    if (contrast !== 100) {
filters.push(`contrast(${contrast}%)`)
}
    const filterString = filters.length > 0 ? filters.join(' ') : undefined

    const imageStyle2: React.CSSProperties = {
      filter: filterString,
      objectFit: objectFit as React.CSSProperties['objectFit'],
      objectPosition,
      transform: scale !== 1 ? `scale(${scale})` : undefined
    }

    if (member.image) {
      return (
        <div style={imageContainerStyle} className="team-image">
          <Image
            src={member.image}
            alt={member.name}
            fill
            style={imageStyle2}
          />
          {/* Overlay on hover */}
          {imageStyle.overlayOnHover && (
            <div
              className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity"
              style={{ backgroundColor: imageStyle.overlayColor || 'rgba(0,0,0,0.3)' }}
            />
          )}
        </div>
      )
    }

    // Initials fallback
    return (
      <div
        style={{
          ...imageContainerStyle,
          background: `linear-gradient(135deg, ${imageStyle.initialsBackgroundColor || '#86a789'}, #2d5a3d)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        className="team-image"
      >
        <span
          style={{
            color: imageStyle.initialsTextColor || '#ffffff',
            fontSize: imageStyle.size === 'sm' ? '1.5rem' : imageStyle.size === 'md' ? '2rem' : '2.5rem',
            fontWeight: 'bold'
          }}
        >
          {member.name.charAt(0).toUpperCase()}
        </span>
      </div>
    )
  }

  const renderSocialLinks = (member: TeamMember) => {
    if (!showSocial || !member.social) {
return null
}

    const socialLinks = Object.entries(member.social).filter(([, value]) => value)
    if (socialLinks.length === 0) {
return null
}

    const iconSizeMap: Record<string, string> = { sm: '16px', md: '20px', lg: '24px' }
    const iconSize = iconSizeMap[socialStyle.iconSize || 'md']

    return (
      <div
        className="flex items-center justify-center"
        style={{
          gap: socialStyle.gap || '0.75rem',
          marginTop: socialStyle.position === 'below-info' ? '1rem' : undefined
        }}
      >
        {socialLinks.map(([platform, url]) => {
          const icons: Record<string, React.ReactNode> = {
            linkedin: (
              <svg style={{ width: iconSize, height: iconSize }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            ),
            twitter: (
              <svg style={{ width: iconSize, height: iconSize }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            ),
            instagram: (
              <svg style={{ width: iconSize, height: iconSize }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            ),
            email: (
              <svg style={{ width: iconSize, height: iconSize }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            ),
            github: (
              <svg style={{ width: iconSize, height: iconSize }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            ),
            website: (
              <svg style={{ width: iconSize, height: iconSize }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            )
          }

          const href = platform === 'email' ? `mailto:${url}` : platform === 'phone' ? `tel:${url}` : url

          return (
            <a
              key={platform}
              href={href as string}
              target={platform !== 'email' && platform !== 'phone' ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="social-icon"
              style={{
                color: socialStyle.iconColor || '#64748b',
                transition: 'color 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = socialStyle.iconHoverColor || '#86a789'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = socialStyle.iconColor || '#64748b'
              }}
            >
              {icons[platform] || icons.website}
            </a>
          )
        })}
      </div>
    )
  }

  const renderMemberCard = (member: TeamMember, index: number) => {
    const cardStyles: React.CSSProperties = {
      backgroundColor: member.style?.cardBackgroundColor || cardStyle.backgroundColor,
      borderRadius: cardStyle.borderRadius,
      border: cardStyle.borderStyle !== 'none'
        ? `${cardStyle.borderWidth}px ${cardStyle.borderStyle} ${cardStyle.borderColor}`
        : undefined,
      boxShadow: getShadowClass(cardStyle.shadow),
      padding: cardStyle.padding,
      textAlign: cardStyle.contentAlignment as React.CSSProperties['textAlign'],
      ...getAnimationStyle(index)
    }

    return (
      <div
        key={member.id}
        className={`team-card-${block.id}`}
        style={cardStyles}
      >
        {/* Member Badge */}
        {member.badge?.enabled && (
          <div
            className="absolute"
            style={{
              top: '0.5rem',
              [member.badge.position?.includes('left') ? 'left' : 'right']: '0.5rem',
              backgroundColor: member.badge.backgroundColor || '#86a789',
              color: member.badge.textColor || '#ffffff',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: '500'
            }}
          >
            {member.badge.text}
          </div>
        )}

        {/* Image */}
        <div style={{ marginBottom: '1rem' }}>
          {renderMemberImage(member)}
        </div>

        {/* Info */}
        <div>
          {/* Name */}
          <h3
            style={{
              fontSize: typography.name.fontSize,
              fontWeight: typography.name.fontWeight,
              color: member.style?.nameColor || typography.name.color,
              lineHeight: typography.name.lineHeight,
              marginBottom: '0.25rem'
            }}
          >
            {member.name}
          </h3>

          {/* Role */}
          <p
            style={{
              fontSize: typography.role.fontSize,
              fontWeight: typography.role.fontWeight,
              color: member.style?.roleColor || typography.role.color,
              lineHeight: typography.role.lineHeight,
              textTransform: typography.role.textTransform,
              marginBottom: showBio || showDepartment ? '0.75rem' : '0'
            }}
          >
            {member.role}
          </p>

          {/* Department */}
          {showDepartment && member.department && (
            <p
              style={{
                fontSize: '0.8rem',
                color: '#94a3b8',
                marginBottom: '0.5rem'
              }}
            >
              {member.department}
            </p>
          )}

          {/* Bio */}
          {showBio && member.bio && (
            <p
              style={{
                fontSize: typography.bio.fontSize,
                fontWeight: typography.bio.fontWeight,
                color: typography.bio.color,
                lineHeight: typography.bio.lineHeight,
                display: '-webkit-box',
                WebkitLineClamp: typography.bio.maxLines,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {member.bio}
            </p>
          )}

          {/* Quote */}
          {showQuote && member.quote && (
            <p
              style={{
                fontSize: typography.quote?.fontSize || '0.875rem',
                fontWeight: typography.quote?.fontWeight || '400',
                fontStyle: (typography.quote?.fontStyle || 'italic') as React.CSSProperties['fontStyle'],
                color: getQuoteColor(member.style?.cardBackgroundColor || cardStyle.backgroundColor),
                lineHeight: typography.quote?.lineHeight || '1.5',
                marginTop: '0.75rem',
                paddingLeft: '1rem',
                borderLeft: `${typography.quote?.borderWidth || '2px'} solid ${typography.quote?.borderColor || '#86a789'}`
              }}
            >
              &ldquo;{member.quote}&rdquo;
            </p>
          )}

          {/* Social Links */}
          {renderSocialLinks(member)}
        </div>
      </div>
    )
  }

  const renderCTA = () => {
    if (!content.cta?.enabled) {
return null
}

    return (
      <div
        className="mt-12 text-center p-8 rounded-2xl"
        style={{
          backgroundColor: content.cta.backgroundColor || '#f0fdf4'
        }}
      >
        {content.cta.title && (
          <h3 className="text-2xl font-bold text-slate-800 mb-2">{content.cta.title}</h3>
        )}
        {content.cta.subtitle && (
          <p className="text-slate-600 mb-4">{content.cta.subtitle}</p>
        )}
        {content.cta.buttonText && content.cta.buttonLink && (
          <a
            href={content.cta.buttonLink}
            className={`inline-block px-6 py-3 rounded-lg font-medium transition-colors ${
              content.cta.buttonStyle === 'primary'
                ? 'bg-sage-600 text-white hover:bg-sage-700'
                : content.cta.buttonStyle === 'outline'
                ? 'border-2 border-sage-600 text-sage-600 hover:bg-sage-50'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
          >
            {content.cta.buttonText}
          </a>
        )}
      </div>
    )
  }

  // Dynamic styles
  const dynamicStyles = `${getResponsiveStyles()}${getAnimationKeyframes()}${getHoverStyles()}`

  return (
    <>
      {dynamicStyles && (
        <style
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: dynamicStyles }}
        />
      )}
      <section
        id={content.sectionId}
        className={content.customClass}
        style={{
          ...getBackgroundStyle(),
          paddingTop: content.padding?.top || '4rem',
          paddingBottom: content.padding?.bottom || '4rem',
          position: 'relative'
        }}
      >
        {/* Background overlay */}
        {background.type === 'image' && background.overlayEnabled && (
          <div
            className="absolute inset-0"
            style={{
              backgroundColor: background.overlayColor || '#000000',
              opacity: background.overlayOpacity || 0.5
            }}
          />
        )}

        <div
          className="mx-auto px-4 sm:px-6 lg:px-8 relative"
          style={{ maxWidth: getMaxWidthClass(content.maxWidth) }}
        >
          {/* Section Header */}
          {(header.title || content.title || header.subtitle || content.subtitle) && (
            <div
              className="mb-12"
              style={{ textAlign: header.alignment || 'center' }}
            >
              {/* Badge */}
              {header.badge?.enabled && (
                <span
                  className="inline-block mb-4 px-4 py-1.5 rounded-full text-sm font-medium"
                  style={{
                    backgroundColor: header.badge.backgroundColor || '#f0fdf4',
                    color: header.badge.textColor || '#166534'
                  }}
                >
                  {header.badge.text}
                </span>
              )}

              {/* Title */}
              {(header.title || content.title) && (
                <h2
                  style={{
                    fontSize: header.typography?.titleSize || '2.5rem',
                    fontWeight: header.typography?.titleWeight || '700',
                    color: header.typography?.titleColor || '#1e293b',
                    marginBottom: '0.75rem',
                    lineHeight: '1.2'
                  }}
                >
                  {header.title || content.title}
                </h2>
              )}

              {/* Subtitle */}
              {(header.subtitle || content.subtitle) && (
                <p
                  style={{
                    fontSize: header.typography?.subtitleSize || '1.125rem',
                    color: header.typography?.subtitleColor || '#64748b',
                    maxWidth: '42rem',
                    margin: header.alignment === 'center' ? '0 auto' : undefined
                  }}
                >
                  {header.subtitle || content.subtitle}
                </p>
              )}

              {/* Description */}
              {header.description && (
                <p
                  className="mt-4"
                  style={{
                    fontSize: header.typography?.descriptionSize || '1rem',
                    color: header.typography?.descriptionColor || '#94a3b8',
                    maxWidth: '48rem',
                    margin: header.alignment === 'center' ? '0 auto' : undefined
                  }}
                >
                  {header.description}
                </p>
              )}
            </div>
          )}

          {/* Members Grid */}
          {members.length > 0 ? (
            <div className={`team-grid-${block.id}`}>
              {members.map((member, index) => renderMemberCard(member, index))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white rounded-xl">
              <p className="text-gray-400">Henuz ekip uyesi eklenmedi</p>
            </div>
          )}

          {/* CTA Section */}
          {renderCTA()}
        </div>
      </section>
    </>
  )
}
