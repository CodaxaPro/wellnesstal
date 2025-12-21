'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BlockProps } from './types'

interface NavItem {
  href: string
  label: string
  icon?: string
  iconColor?: string
  color?: string
  hoverColor?: string
  fontSize?: string
  fontWeight?: string
  badge?: string
  badgeColor?: string
}

interface HeaderBlockContent {
  logoText: string
  logoEmoji: string
  navItems: NavItem[]
  ctaButtonText: string
  ctaButtonType: 'phone' | 'whatsapp' | 'url' | 'email'
  ctaButtonLink: string
  ctaButtonVisible: boolean
  ctaButtonIcon?: string
  ctaButtonIconColor?: string
  ctaButtonBgColor?: string
  ctaButtonTextColor?: string
}

// SVG Icon component that can be colored
const NavIcon = ({ icon, color }: { icon: string; color?: string }) => {
  const iconStyle = { color: color || 'currentColor' }
  const className = "h-4 w-4"

  // Map emoji/icon codes to SVG icons
  const svgIcons: Record<string, JSX.Element> = {
    '🏠': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    '💆': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
    '👥': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    '📞': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
    '🎁': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
      </svg>
    ),
    '💰': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    '📍': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    '⭐': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    '❤️': (
      <svg className={className} style={iconStyle} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ),
    '✨': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    '🌿': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    '💬': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    '📧': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    '🔗': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
    ),
    '📱': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    '🛒': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    '📋': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    '💎': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    '🎯': (
      <svg className={className} style={iconStyle} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  }

  // If we have a matching SVG, use it
  if (svgIcons[icon]) {
    return svgIcons[icon]
  }

  // Otherwise show the emoji as-is (can't be colored)
  return <span className="text-sm">{icon}</span>
}

const defaultContent: HeaderBlockContent = {
  logoText: 'Wellnesstal',
  logoEmoji: '🌿',
  navItems: [
    { href: '#home', label: 'Start' },
    { href: '#services', label: 'Leistungen' },
    { href: '#about', label: 'Über uns' },
    { href: '#contact', label: 'Kontakt' },
  ],
  ctaButtonText: 'Termin vereinbaren',
  ctaButtonType: 'phone',
  ctaButtonLink: '+4922112345678',
  ctaButtonVisible: true
}

export default function HeaderBlock({ block }: BlockProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [hoveredNavIndex, setHoveredNavIndex] = useState<number | null>(null)

  // Merge block content with defaults
  const content = block.content as HeaderBlockContent
  const headerContent: HeaderBlockContent = {
    logoText: content?.logoText || defaultContent.logoText,
    logoEmoji: content?.logoEmoji || defaultContent.logoEmoji,
    navItems: content?.navItems || defaultContent.navItems,
    ctaButtonText: content?.ctaButtonText || defaultContent.ctaButtonText,
    ctaButtonType: content?.ctaButtonType || defaultContent.ctaButtonType,
    ctaButtonLink: content?.ctaButtonLink || defaultContent.ctaButtonLink,
    ctaButtonVisible: content?.ctaButtonVisible !== false,
    ctaButtonIcon: content?.ctaButtonIcon,
    ctaButtonIconColor: content?.ctaButtonIconColor,
    ctaButtonBgColor: content?.ctaButtonBgColor,
    ctaButtonTextColor: content?.ctaButtonTextColor
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Generate CTA button href based on type
  const generateCtaHref = () => {
    const { ctaButtonType, ctaButtonLink } = headerContent
    switch (ctaButtonType) {
      case 'phone':
        return `tel:${ctaButtonLink.replace(/\s/g, '')}`
      case 'whatsapp':
        const cleanNumber = ctaButtonLink.replace(/[^0-9]/g, '')
        return `https://wa.me/${cleanNumber}`
      case 'email':
        return `mailto:${ctaButtonLink}`
      case 'url':
        return ctaButtonLink.startsWith('http') ? ctaButtonLink : `https://${ctaButtonLink}`
      default:
        return `tel:${ctaButtonLink.replace(/\s/g, '')}`
    }
  }

  // Get CTA button icon based on type or custom setting
  const getCtaIcon = () => {
    const iconType = headerContent.ctaButtonIcon || headerContent.ctaButtonType

    switch (iconType) {
      case 'phone':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        )
      case 'whatsapp':
        return (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        )
      case 'email':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        )
      case 'link':
      case 'url':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
          </svg>
        )
      case 'calendar':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )
      case 'star':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        )
      case 'heart':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        )
      case 'gift':
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
          </svg>
        )
      default:
        return (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
        )
    }
  }

  // Get nav item style
  const getNavItemStyle = (item: NavItem, index: number) => {
    const isHovered = hoveredNavIndex === index
    return {
      color: isHovered ? (item.hoverColor || '#9CAF88') : (item.color || undefined),
      fontSize: item.fontSize || undefined,
      fontWeight: item.fontWeight || '500'
    }
  }

  // CTA button style
  const ctaButtonStyle = {
    backgroundColor: headerContent.ctaButtonBgColor || undefined,
    color: headerContent.ctaButtonTextColor || undefined
  }

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-medium'
            : 'bg-white shadow-soft'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 lg:h-18">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl lg:text-3xl font-bold text-forest-600 hover:text-sage-500 transition-colors"
            >
              {headerContent.logoEmoji} {headerContent.logoText}
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              {headerContent.navItems.map((item, index) => (
                <Link
                  key={item.href + index}
                  href={item.href}
                  className="font-medium transition-colors duration-300 relative group flex items-center gap-1.5"
                  style={getNavItemStyle(item, index)}
                  onMouseEnter={() => setHoveredNavIndex(index)}
                  onMouseLeave={() => setHoveredNavIndex(null)}
                >
                  {item.icon && (
                    <NavIcon icon={item.icon} color={item.iconColor} />
                  )}
                  {item.label}
                  {item.badge && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full ml-1"
                      style={{
                        backgroundColor: item.badgeColor || '#9CAF88',
                        color: '#fff'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                  <span
                    className="absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full"
                    style={{ backgroundColor: item.hoverColor || '#9CAF88' }}
                  ></span>
                </Link>
              ))}

              {/* CTA Button */}
              {headerContent.ctaButtonVisible && (
                <Link
                  href={generateCtaHref()}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-medium hover:-translate-y-1 flex items-center gap-2 ${
                    !headerContent.ctaButtonBgColor ? 'bg-sage-500 hover:bg-forest-600 text-white' : ''
                  }`}
                  style={headerContent.ctaButtonBgColor ? ctaButtonStyle : undefined}
                >
                  <span style={{ color: headerContent.ctaButtonIconColor || undefined }}>
                    {getCtaIcon()}
                  </span>
                  {headerContent.ctaButtonText}
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-charcoal hover:text-sage-500 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Menu öffnen"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
            isMobileMenuOpen ? 'max-h-[500px] py-4' : 'max-h-0'
          }`}>
            <div className="flex flex-col space-y-4 bg-white rounded-xl p-4 shadow-medium mt-2">
              {headerContent.navItems.map((item, index) => (
                <Link
                  key={item.href + index}
                  href={item.href}
                  className="font-medium transition-colors py-2 flex items-center gap-2"
                  style={{
                    color: item.color || undefined,
                    fontSize: item.fontSize || undefined,
                    fontWeight: item.fontWeight || '500'
                  }}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon && (
                    <NavIcon icon={item.icon} color={item.iconColor} />
                  )}
                  {item.label}
                  {item.badge && (
                    <span
                      className="text-[10px] px-1.5 py-0.5 rounded-full"
                      style={{
                        backgroundColor: item.badgeColor || '#9CAF88',
                        color: '#fff'
                      }}
                    >
                      {item.badge}
                    </span>
                  )}
                </Link>
              ))}
              {headerContent.ctaButtonVisible && (
                <Link
                  href={generateCtaHref()}
                  className={`px-6 py-3 rounded-xl font-semibold text-center transition-colors mt-4 flex items-center justify-center gap-2 ${
                    !headerContent.ctaButtonBgColor ? 'bg-sage-500 hover:bg-forest-600 text-white' : ''
                  }`}
                  style={headerContent.ctaButtonBgColor ? ctaButtonStyle : undefined}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span style={{ color: headerContent.ctaButtonIconColor || undefined }}>
                    {getCtaIcon()}
                  </span>
                  {headerContent.ctaButtonText}
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
      {/* Spacer to prevent content from going behind fixed header */}
      <div className="h-16 lg:h-18" />
    </>
  )
}
