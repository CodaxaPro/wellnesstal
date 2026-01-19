'use client'

import { useState, useEffect } from 'react'

import { BlockProps } from './types'

export interface StickyButtonContent {
  enabled: boolean
  
  // Button content
  text: string
  link: string
  icon?: string
  iconPosition?: 'left' | 'right'
  
  // Display rules
  display: {
    showAfterScroll: number // percentage (0-100)
    showAfterDelay: number // milliseconds
    showOnMobile: boolean
    showOnDesktop: boolean
    excludedPages: string[] // page slugs
  }
  
  // Position
  position: 'bottom-left' | 'bottom-center' | 'bottom-right'
  offsetX: number // pixels
  offsetY: number // pixels
  
  // Styling
  style: {
    backgroundColor: string
    textColor: string
    fontSize: string
    fontWeight: string
    paddingX: number
    paddingY: number
    borderRadius: string
    shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
    hoverEffect: 'scale' | 'lift' | 'glow' | 'none'
    hoverBackgroundColor?: string
    hoverScale?: number
  }
  
  // Animation
  animation: {
    enabled: boolean
    type: 'fade' | 'slide' | 'bounce' | 'none'
    duration: number
  }
  
  // Responsive
  responsive: {
    mobile: {
      fontSize: string
      paddingX: number
      paddingY: number
    }
  }
}

const defaultContent: StickyButtonContent = {
  enabled: true,
  text: 'Şimdi Randevu Al',
  link: '#booking',
  icon: 'calendar',
  iconPosition: 'left',
  display: {
    showAfterScroll: 30,
    showAfterDelay: 0,
    showOnMobile: true,
    showOnDesktop: true,
    excludedPages: []
  },
  position: 'bottom-center',
  offsetX: 0,
  offsetY: 24,
  style: {
    backgroundColor: '#9CAF88', // sage-500
    textColor: '#ffffff',
    fontSize: '1rem',
    fontWeight: '600',
    paddingX: 32,
    paddingY: 16,
    borderRadius: '0.75rem',
    shadow: 'xl',
    hoverEffect: 'scale',
    hoverBackgroundColor: '#166534', // forest-600
    hoverScale: 1.05
  },
  animation: {
    enabled: true,
    type: 'fade',
    duration: 300
  },
  responsive: {
    mobile: {
      fontSize: '0.875rem',
      paddingX: 24,
      paddingY: 12
    }
  }
}

export default function StickyButtonBlock({ block }: BlockProps) {
  const rawContent = block.content as Partial<StickyButtonContent>
  const content: StickyButtonContent = {
    ...defaultContent,
    ...rawContent,
    display: { ...defaultContent.display, ...rawContent.display },
    style: { ...defaultContent.style, ...rawContent.style },
    animation: { ...defaultContent.animation, ...rawContent.animation },
    responsive: { ...defaultContent.responsive, ...rawContent.responsive }
  }

  const [isVisible, setIsVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [hasReachedTarget, setHasReachedTarget] = useState(false)

  // Check if button should be shown
  useEffect(() => {
    if (!content.enabled) {
return
}

    // Check device type
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkDevice()
    window.addEventListener('resize', checkDevice)

    // Check excluded pages
    const pathname = window.location.pathname
    const isExcluded = content.display.excludedPages.some(page => 
      pathname.includes(page)
    )
    if (isExcluded) {
      setIsVisible(false)
      return () => window.removeEventListener('resize', checkDevice)
    }

    // Check device visibility
    if ((isMobile && !content.display.showOnMobile) || 
        (!isMobile && !content.display.showOnDesktop)) {
      setIsVisible(false)
      return () => window.removeEventListener('resize', checkDevice)
    }

    // Handle scroll-based display
    if (content.display.showAfterScroll > 0) {
      const handleScroll = () => {
        const scrollPercent =
          (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

        if (scrollPercent >= content.display.showAfterScroll && !hasScrolled) {
          setHasScrolled(true)
          if (content.display.showAfterDelay > 0) {
            setTimeout(() => setIsVisible(true), content.display.showAfterDelay)
          } else {
            setIsVisible(true)
          }
        }
      }

      window.addEventListener('scroll', handleScroll)
      handleScroll() // Check initial scroll position
      return () => {
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', checkDevice)
      }
    }

    // Handle delay-based display
    if (content.display.showAfterDelay > 0 && content.display.showAfterScroll === 0) {
      const timer = setTimeout(() => setIsVisible(true), content.display.showAfterDelay)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('resize', checkDevice)
      }
    }

    // Show immediately if no rules
    if (content.display.showAfterScroll === 0 && content.display.showAfterDelay === 0) {
      setIsVisible(true)
    }

    return () => window.removeEventListener('resize', checkDevice)
  }, [
    content.enabled,
    content.display.showAfterScroll,
    content.display.showAfterDelay,
    content.display.excludedPages,
    content.display.showOnMobile,
    content.display.showOnDesktop,
    hasScrolled,
    isMobile
  ])

  // Check if target is in viewport (for hiding button after scroll)
  useEffect(() => {
    if (!content.link.startsWith('#') || hasReachedTarget) {
return
}

    const targetId = content.link.substring(1)
    const checkTargetVisibility = () => {
      const element = document.getElementById(targetId)
      if (!element) {
return
}

      const rect = element.getBoundingClientRect()
      const isInViewport = rect.top >= 0 && rect.top <= window.innerHeight * 0.3
      
      if (isInViewport) {
        setHasReachedTarget(true)
        setIsVisible(false)
      }
    }

    // Check immediately
    checkTargetVisibility()

    // Listen for scroll events to detect when target is reached
    window.addEventListener('scroll', checkTargetVisibility, { passive: true })
    window.addEventListener('resize', checkTargetVisibility, { passive: true })

    return () => {
      window.removeEventListener('scroll', checkTargetVisibility)
      window.removeEventListener('resize', checkTargetVisibility)
    }
  }, [content.link, hasReachedTarget])

  if (!content.enabled || !isVisible || hasReachedTarget) {
return null
}

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (content.link.startsWith('#')) {
      e.preventDefault()
      const targetId = content.link.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        // Scroll to target
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        
        // Set a timeout to check if target was reached (fallback mechanism)
        // This ensures the button disappears even if IntersectionObserver-like behavior fails
        const checkAfterScroll = () => {
          setTimeout(() => {
            const rect = element.getBoundingClientRect()
            const isInViewport = rect.top >= 0 && rect.top <= window.innerHeight * 0.3
            if (isInViewport) {
              setHasReachedTarget(true)
              setIsVisible(false)
            }
          }, 800) // Wait for smooth scroll to complete (typically 500-700ms)
        }
        checkAfterScroll()
      }
    }
  }

  // Position classes
  const positionClasses = {
    'bottom-left': 'left-6',
    'bottom-center': 'left-1/2 -translate-x-1/2',
    'bottom-right': 'right-6'
  }

  // Shadow classes
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    '2xl': 'shadow-2xl'
  }

  // Hover effects
  const hoverClasses = {
    scale: 'hover:scale-105',
    lift: 'hover:-translate-y-1',
    glow: 'hover:shadow-2xl hover:ring-2 hover:ring-offset-2',
    none: ''
  }

  // Animation classes
  const animationClasses = {
    fade: content.animation.enabled ? 'transition-opacity duration-300' : '',
    slide: content.animation.enabled ? 'transition-all duration-300 transform' : '',
    bounce: content.animation.enabled ? 'transition-all duration-300 animate-bounce' : '',
    none: ''
  }

  const positionClass = positionClasses[content.position]
  const shadowClass = shadowClasses[content.style.shadow]
  const hoverClass = hoverClasses[content.style.hoverEffect]
  const animationClass = animationClasses[content.animation.type]

  // Responsive styles
  const isMobileView = typeof window !== 'undefined' && window.innerWidth < 768
  const fontSize = isMobileView ? content.responsive.mobile.fontSize : content.style.fontSize
  const paddingX = isMobileView ? content.responsive.mobile.paddingX : content.style.paddingX
  const paddingY = isMobileView ? content.responsive.mobile.paddingY : content.style.paddingY

  // Icon rendering
  const renderIcon = () => {
    if (!content.icon) {
return null
}

    const iconSize = isMobileView ? 18 : 20

    if (content.icon === 'calendar') {
      return (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      )
    }

    if (content.icon === 'arrow-right') {
      return (
        <svg
          className="w-5 h-5 flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )
    }

    return null
  }

  return (
    <div
      className={`fixed bottom-6 ${positionClass} z-40 transition-all duration-${content.animation.duration} ${animationClass} ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
      style={{
        transform: content.position === 'bottom-center' ? 'translateX(-50%)' : undefined,
        left: content.position === 'bottom-left' ? `${content.offsetX}px` : undefined,
        right: content.position === 'bottom-right' ? `${content.offsetX}px` : undefined,
        bottom: `${content.offsetY}px`,
        maxWidth: 'calc(100vw - 2rem)',
        padding: '0 1rem'
      }}
    >
      <a
        href={content.link}
        onClick={handleClick}
        className={`inline-flex items-center justify-center gap-2 ${shadowClass} ${hoverClass} active:scale-95 transition-all duration-300 transform whitespace-nowrap`}
        style={{
          backgroundColor: content.style.backgroundColor,
          color: content.style.textColor,
          fontSize,
          fontWeight: content.style.fontWeight,
          paddingLeft: `${paddingX}px`,
          paddingRight: `${paddingX}px`,
          paddingTop: `${paddingY}px`,
          paddingBottom: `${paddingY}px`,
          borderRadius: content.style.borderRadius,
          boxShadow: content.style.shadow !== 'none' 
            ? '0 10px 25px -5px rgba(156, 175, 136, 0.4), 0 10px 10px -5px rgba(156, 175, 136, 0.2)'
            : undefined
        }}
        onMouseEnter={(e) => {
          if (content.style.hoverBackgroundColor) {
            e.currentTarget.style.backgroundColor = content.style.hoverBackgroundColor
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = content.style.backgroundColor
        }}
      >
        {content.iconPosition === 'left' && renderIcon()}
        <span>{content.text}</span>
        {content.iconPosition === 'right' && renderIcon()}
      </a>
    </div>
  )
}

