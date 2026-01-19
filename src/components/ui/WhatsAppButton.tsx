'use client'

import { useState, useEffect } from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

// WhatsApp Settings Interface
interface WhatsAppSettings {
  basic: {
    enabled: boolean
    phoneNumber: string
    useOriginalStyle: boolean
    position: 'bottom-right' | 'bottom-left'
  }
  appearance: {
    buttonColor: string
    buttonHoverColor: string
    iconColor: string
    size: 'small' | 'medium' | 'large'
    shadow: boolean
    pulseAnimation: boolean
    borderRadius: 'full' | 'rounded' | 'square'
  }
  message: {
    defaultMessage: string
    tooltipText: string
    tooltipDelay: number
    showTooltipOnLoad: boolean
    autoShowTooltipAfter: number
  }
  display: {
    showOnMobile: boolean
    showOnDesktop: boolean
    showOnAllPages: boolean
    excludedPages: string[]
    showAfterDelay: number
    showAfterScroll: number
  }
  availability: {
    mode: 'always-online' | 'always-offline' | 'based-on-hours' | 'manual'
    manualStatus: boolean
    showIndicator: boolean
    onlineColor: string
    offlineColor: string
    offlineMessage: string
  }
  ctaBubble: {
    enabled: boolean
    title: string
    message: string
    backgroundColor: string
    textColor: string
    titleColor: string
    showAfterDelay: number
    dismissable: boolean
  }
}

// Default settings (original style)
const defaultSettings: WhatsAppSettings = {
  basic: {
    enabled: true,
    phoneNumber: '+49 1733828581',
    useOriginalStyle: false,
    position: 'bottom-right'
  },
  appearance: {
    buttonColor: '#25D366',
    buttonHoverColor: '#128C7E',
    iconColor: '#FFFFFF',
    size: 'medium',
    shadow: true,
    pulseAnimation: true,
    borderRadius: 'full'
  },
  message: {
    defaultMessage: 'Hallo, ich interessiere mich für eine Wellness-Behandlung bei Wellnesstal.',
    tooltipText: 'WhatsApp Nachricht senden',
    tooltipDelay: 0,
    showTooltipOnLoad: false,
    autoShowTooltipAfter: 0
  },
  display: {
    showOnMobile: true,
    showOnDesktop: true,
    showOnAllPages: true,
    excludedPages: [],
    showAfterDelay: 0,
    showAfterScroll: 0
  },
  availability: {
    mode: 'always-online',
    manualStatus: true,
    showIndicator: true,
    onlineColor: '#22C55E',
    offlineColor: '#EF4444',
    offlineMessage: 'Derzeit offline - Wir antworten so schnell wie möglich.'
  },
  ctaBubble: {
    enabled: false,
    title: 'Haben Sie Fragen?',
    message: 'Schreiben Sie uns auf WhatsApp - wir helfen Ihnen gerne!',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    titleColor: '#25D366',
    showAfterDelay: 3000,
    dismissable: true
  }
}

// Opening hours type (for based-on-hours mode)
interface OpeningHours {
  [key: string]: { open: string; close: string; closed: boolean }
}

const WhatsAppButton = () => {
  const [isHovered, setIsHovered] = useState(false)
  const [settings, setSettings] = useState<WhatsAppSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [showButton, setShowButton] = useState(false)
  const [showCtaBubble, setShowCtaBubble] = useState(false)
  const [ctaBubbleDismissed, setCtaBubbleDismissed] = useState(false)
  const [isOnline, setIsOnline] = useState(true)
  const [openingHours, setOpeningHours] = useState<OpeningHours | null>(null)
  const [tooltipVisible, setTooltipVisible] = useState(false)
  const pathname = usePathname()

  // Fetch WhatsApp settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/content?section=whatsapp-settings')
        const data = await response.json()
        if (data.success && data.data?.content) {
          setSettings({
            ...defaultSettings,
            ...data.data.content,
            basic: { ...defaultSettings.basic, ...data.data.content.basic },
            appearance: { ...defaultSettings.appearance, ...data.data.content.appearance },
            message: { ...defaultSettings.message, ...data.data.content.message },
            display: { ...defaultSettings.display, ...data.data.content.display },
            availability: { ...defaultSettings.availability, ...data.data.content.availability },
            ctaBubble: { ...defaultSettings.ctaBubble, ...data.data.content.ctaBubble }
          })
        }
      } catch (error) {
        console.error('Failed to fetch WhatsApp settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  // Fetch opening hours for based-on-hours mode
  useEffect(() => {
    if (settings.availability.mode === 'based-on-hours') {
      const fetchOpeningHours = async () => {
        try {
          const response = await fetch('/api/content?section=contact-settings')
          const data = await response.json()
          if (data.success && data.data?.content?.openingHours) {
            setOpeningHours(data.data.content.openingHours)
          }
        } catch (error) {
          console.error('Failed to fetch opening hours:', error)
        }
      }
      fetchOpeningHours()
    }
  }, [settings.availability.mode])

  // Calculate online status
  useEffect(() => {
    const calculateOnlineStatus = () => {
      const { mode, manualStatus } = settings.availability

      switch (mode) {
        case 'always-online':
          setIsOnline(true)
          break
        case 'always-offline':
          setIsOnline(false)
          break
        case 'manual':
          setIsOnline(manualStatus)
          break
        case 'based-on-hours':
          if (openingHours) {
            const now = new Date()
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
            const today = days[now.getDay()]
            const todayHours = openingHours[today]

            if (todayHours?.closed) {
              setIsOnline(false)
            } else if (todayHours?.open && todayHours?.close) {
              const currentTime = now.getHours() * 60 + now.getMinutes()
              const [openHour, openMin] = todayHours.open.split(':').map(Number)
              const [closeHour, closeMin] = todayHours.close.split(':').map(Number)
              const openTime = openHour * 60 + openMin
              const closeTime = closeHour * 60 + closeMin
              setIsOnline(currentTime >= openTime && currentTime <= closeTime)
            } else {
              setIsOnline(false)
            }
          }
          break
      }
    }

    calculateOnlineStatus()
    // Update status every minute for based-on-hours mode
    const interval = setInterval(calculateOnlineStatus, 60000)
    return () => clearInterval(interval)
  }, [settings.availability, openingHours])

  // Handle display rules (delay, scroll, excluded pages)
  useEffect(() => {
    if (loading) {
return
}

    // Check if button should be shown
    const { showOnAllPages, excludedPages, showAfterDelay, showAfterScroll, showOnMobile, showOnDesktop } = settings.display

    // Check device type
    const isMobile = window.innerWidth < 768
    if ((isMobile && !showOnMobile) || (!isMobile && !showOnDesktop)) {
      setShowButton(false)
      return
    }

    // Check excluded pages
    if (!showOnAllPages || excludedPages.some(page => pathname.startsWith(page))) {
      setShowButton(false)
      return
    }

    // Handle scroll-based display
    if (showAfterScroll > 0) {
      const handleScroll = () => {
        const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        if (scrollPercent >= showAfterScroll) {
          setShowButton(true)
        }
      }
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll', handleScroll)
    }

    // Handle delay-based display
    if (showAfterDelay > 0) {
      const timer = setTimeout(() => setShowButton(true), showAfterDelay)
      return () => clearTimeout(timer)
    }

    // Show immediately
    setShowButton(true)
  }, [loading, settings.display, pathname])

  // Handle CTA bubble display
  useEffect(() => {
    if (loading || !settings.ctaBubble.enabled || ctaBubbleDismissed) {
return
}

    const timer = setTimeout(() => {
      setShowCtaBubble(true)
    }, settings.ctaBubble.showAfterDelay)

    return () => clearTimeout(timer)
  }, [loading, settings.ctaBubble.enabled, settings.ctaBubble.showAfterDelay, ctaBubbleDismissed])

  // Handle tooltip auto-show
  useEffect(() => {
    if (loading) {
return
}

    if (settings.message.showTooltipOnLoad) {
      setTooltipVisible(true)
    } else if (settings.message.autoShowTooltipAfter > 0) {
      const timer = setTimeout(() => setTooltipVisible(true), settings.message.autoShowTooltipAfter)
      return () => clearTimeout(timer)
    }
  }, [loading, settings.message.showTooltipOnLoad, settings.message.autoShowTooltipAfter])

  // Don't render if not enabled or not visible
  if (!settings.basic.enabled || !showButton) {
return null
}

  // Format phone number for WhatsApp link
  const formattedPhone = settings.basic.phoneNumber.replace(/[^0-9]/g, '')
  const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(settings.message.defaultMessage)}`

  // Get size classes
  const getSizeClasses = () => {
    switch (settings.appearance.size) {
      case 'small': return { button: 'w-12 h-12', icon: 'w-6 h-6', indicator: 'w-3 h-3' }
      case 'large': return { button: 'w-16 h-16', icon: 'w-8 h-8', indicator: 'w-5 h-5' }
      default: return { button: 'w-14 h-14', icon: 'w-7 h-7', indicator: 'w-4 h-4' }
    }
  }

  // Get border radius classes
  const getBorderRadiusClass = () => {
    switch (settings.appearance.borderRadius) {
      case 'rounded': return 'rounded-2xl'
      case 'square': return 'rounded-lg'
      default: return 'rounded-full'
    }
  }

  // Get position classes
  const getPositionClasses = () => {
    return settings.basic.position === 'bottom-left' ? 'left-6' : 'right-6'
  }

  const sizes = getSizeClasses()
  const borderRadius = getBorderRadiusClass()
  const positionClass = getPositionClasses()

  // ============================================
  // ORIGINAL STYLE RENDER
  // If useOriginalStyle is true, render the original unchanged component
  // ============================================
  if (settings.basic.useOriginalStyle) {
    const originalPhoneNumber = formattedPhone || "491733828581"
    const originalMessage = settings.message.defaultMessage || "Hallo, ich interessiere mich für eine Wellness-Behandlung bei Wellnesstal."

    return (
      <div className="fixed bottom-6 right-6 z-50">
        {/* Tooltip */}
        <div className={`absolute bottom-16 right-0 bg-charcoal text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}>
          WhatsApp Nachricht senden
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-charcoal" />
        </div>

        {/* WhatsApp Button */}
        <Link
          href={`https://wa.me/${originalPhoneNumber}?text=${encodeURIComponent(originalMessage)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-14 h-14 bg-green-500 hover:bg-green-600 rounded-full flex items-center justify-center text-white shadow-large hover:shadow-xl transition-all duration-300 hover:scale-110"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          aria-label="WhatsApp Kontakt"
        >
          {/* WhatsApp Icon */}
          <svg
            className="w-7 h-7"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>

          {/* Pulse Animation */}
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
        </Link>
      </div>
    )
  }

  // ============================================
  // CUSTOMIZED STYLE RENDER
  // Render with all customizations from settings
  // ============================================
  return (
    <div className={`fixed bottom-6 ${positionClass} z-50`}>
      {/* CTA Bubble - Hide when hovering (tooltip takes priority) */}
      {showCtaBubble && settings.ctaBubble.enabled && !isHovered && (
        <div
          className={`absolute bottom-20 ${settings.basic.position === 'bottom-left' ? 'left-0' : 'right-0'} w-64 sm:w-72 rounded-2xl shadow-large transition-all duration-300 animate-fade-in pointer-events-auto`}
          style={{ backgroundColor: settings.ctaBubble.backgroundColor }}
        >
          <div className="p-4 pr-10">
            {settings.ctaBubble.dismissable && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setShowCtaBubble(false)
                  setCtaBubbleDismissed(true)
                }}
                className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors z-10"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <h4
              className="font-semibold text-base mb-1 leading-tight"
              style={{ color: settings.ctaBubble.titleColor }}
            >
              {settings.ctaBubble.title}
            </h4>
            <p
              className="text-sm leading-snug"
              style={{ color: settings.ctaBubble.textColor }}
            >
              {settings.ctaBubble.message}
            </p>
          </div>
          {/* Arrow */}
          <div
            className={`absolute -bottom-2 ${settings.basic.position === 'bottom-left' ? 'left-6' : 'right-6'} w-4 h-4 rotate-45`}
            style={{ backgroundColor: settings.ctaBubble.backgroundColor }}
          />
        </div>
      )}

      {/* Tooltip - Only show when hovering, hide when CTA bubble is visible */}
      <div className={`absolute bottom-16 ${settings.basic.position === 'bottom-left' ? 'left-0' : 'right-0'} bg-charcoal text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-300 ${
        isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
      }`}>
        {!isOnline ? settings.availability.offlineMessage : settings.message.tooltipText}
        <div className={`absolute top-full ${settings.basic.position === 'bottom-left' ? 'left-4' : 'right-4'} w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-charcoal`} />
      </div>

      {/* WhatsApp Button */}
      <Link
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={`group relative ${sizes.button} ${borderRadius} flex items-center justify-center transition-all duration-300 hover:scale-110`}
        style={{
          backgroundColor: isHovered ? settings.appearance.buttonHoverColor : settings.appearance.buttonColor,
          color: settings.appearance.iconColor,
          boxShadow: settings.appearance.shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.2), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' : 'none'
        }}
        onMouseEnter={() => {
          setIsHovered(true)
          setTooltipVisible(true)
        }}
        onMouseLeave={() => {
          setIsHovered(false)
          if (!settings.message.showTooltipOnLoad) {
            setTooltipVisible(false)
          }
        }}
        aria-label="WhatsApp Kontakt"
      >
        {/* WhatsApp Icon */}
        <svg
          className={sizes.icon}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>

        {/* Pulse Animation */}
        {settings.appearance.pulseAnimation && (
          <span
            className={`absolute inset-0 ${borderRadius} animate-ping opacity-75`}
            style={{ backgroundColor: settings.appearance.buttonColor }}
          />
        )}
      </Link>
    </div>
  )
}

export default WhatsAppButton
