'use client'

import React, { useState, useEffect } from 'react'
import { BlockProps, WhatsAppContent } from './types'

// Size classes
const sizeClasses = {
  small: 'w-10 h-10',
  medium: 'w-14 h-14',
  large: 'w-16 h-16'
}

const iconSizes = {
  small: 'w-5 h-5',
  medium: 'w-7 h-7',
  large: 'w-8 h-8'
}

const borderRadiusClasses = {
  full: 'rounded-full',
  rounded: 'rounded-xl',
  square: 'rounded-lg'
}

// Default content
const defaultContent: WhatsAppContent = {
  basic: {
    enabled: true,
    phoneNumber: '+90 555 123 4567',
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
    defaultMessage: 'Merhaba, web sitenizden ulasiyorum.',
    tooltipText: 'WhatsApp ile yazin',
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
    offlineMessage: 'Su anda cevrimdisi - En kisa surede donecegiz.'
  },
  ctaBubble: {
    enabled: false,
    title: 'Sorulariniz mi var?',
    message: 'WhatsApp uzerinden bize yazin - yardimci olmaktan mutluluk duyariz!',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    titleColor: '#25D366',
    showAfterDelay: 3000,
    dismissable: true
  }
}

export default function WhatsAppBlock({ block }: BlockProps) {
  const rawContent = block.content as Partial<WhatsAppContent>

  // Deep merge with defaults
  const content: WhatsAppContent = {
    basic: { ...defaultContent.basic, ...rawContent?.basic },
    appearance: { ...defaultContent.appearance, ...rawContent?.appearance },
    message: { ...defaultContent.message, ...rawContent?.message },
    display: { ...defaultContent.display, ...rawContent?.display },
    availability: { ...defaultContent.availability, ...rawContent?.availability },
    ctaBubble: { ...defaultContent.ctaBubble, ...rawContent?.ctaBubble }
  }

  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [showCtaBubble, setShowCtaBubble] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [ctaDismissed, setCtaDismissed] = useState(false)

  // Check if online based on availability settings
  const isOnline = content.availability.mode === 'always-online' ||
    (content.availability.mode === 'manual' && content.availability.manualStatus)

  useEffect(() => {
    if (!content.basic.enabled) return

    // Show after delay
    const delayTimer = setTimeout(() => {
      setIsVisible(true)
    }, content.display.showAfterDelay)

    // Show tooltip on load
    if (content.message.showTooltipOnLoad && content.message.autoShowTooltipAfter > 0) {
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(true)
      }, content.message.autoShowTooltipAfter)
      return () => {
        clearTimeout(delayTimer)
        clearTimeout(tooltipTimer)
      }
    }

    return () => clearTimeout(delayTimer)
  }, [content.basic.enabled, content.display.showAfterDelay, content.message.showTooltipOnLoad, content.message.autoShowTooltipAfter])

  // Show CTA bubble
  useEffect(() => {
    if (!content.ctaBubble.enabled || ctaDismissed) return

    const timer = setTimeout(() => {
      setShowCtaBubble(true)
    }, content.ctaBubble.showAfterDelay)

    return () => clearTimeout(timer)
  }, [content.ctaBubble.enabled, content.ctaBubble.showAfterDelay, ctaDismissed])

  if (!content.basic.enabled || !isVisible) return null

  const handleClick = () => {
    const phoneNumber = content.basic.phoneNumber.replace(/[^0-9+]/g, '')
    const message = encodeURIComponent(content.message.defaultMessage)
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  const handleDismissCtaBubble = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCtaDismissed(true)
    setShowCtaBubble(false)
  }

  // Position classes
  const positionClasses = content.basic.position === 'bottom-right'
    ? 'right-6'
    : 'left-6'

  // Original style render
  if (content.basic.useOriginalStyle) {
    return (
      <div className={`fixed bottom-6 ${positionClasses} z-50`}>
        <button
          onClick={handleClick}
          className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-all duration-300 relative group"
          aria-label="WhatsApp ile iletisime gecin"
        >
          <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
          </svg>
          <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75"></span>
          {content.availability.showIndicator && (
            <div
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
              style={{ backgroundColor: isOnline ? content.availability.onlineColor : content.availability.offlineColor }}
            >
              <div
                className="w-full h-full rounded-full animate-pulse"
                style={{ backgroundColor: isOnline ? content.availability.onlineColor : content.availability.offlineColor }}
              />
            </div>
          )}
        </button>
      </div>
    )
  }

  return (
    <div className={`fixed bottom-6 ${positionClasses} z-50 flex flex-col items-center`}>
      {/* CTA Bubble */}
      {showCtaBubble && content.ctaBubble.enabled && !ctaDismissed && (
        <div
          className="mb-3 p-4 rounded-2xl shadow-xl max-w-xs relative animate-fade-in-up"
          style={{ backgroundColor: content.ctaBubble.backgroundColor }}
        >
          {content.ctaBubble.dismissable && (
            <button
              onClick={handleDismissCtaBubble}
              className="absolute -top-2 -right-2 w-6 h-6 bg-gray-200 hover:bg-gray-300 rounded-full flex items-center justify-center text-gray-600 text-sm transition-colors"
            >
              x
            </button>
          )}
          <h4
            className="font-semibold text-sm mb-1"
            style={{ color: content.ctaBubble.titleColor }}
          >
            {content.ctaBubble.title}
          </h4>
          <p
            className="text-xs leading-relaxed"
            style={{ color: content.ctaBubble.textColor }}
          >
            {content.ctaBubble.message}
          </p>
          <div
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent"
            style={{ borderTopColor: content.ctaBubble.backgroundColor }}
          />
        </div>
      )}

      {/* Tooltip */}
      {showTooltip && !showCtaBubble && content.message.tooltipText && (
        <div className="mb-2 bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs whitespace-nowrap animate-fade-in">
          {content.message.tooltipText}
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => {
          setIsHovered(true)
          if (content.message.tooltipDelay === 0) {
            setShowTooltip(true)
          } else {
            setTimeout(() => setShowTooltip(true), content.message.tooltipDelay)
          }
        }}
        onMouseLeave={() => {
          setIsHovered(false)
          if (!content.message.showTooltipOnLoad) {
            setShowTooltip(false)
          }
        }}
        className={`${sizeClasses[content.appearance.size]} ${borderRadiusClasses[content.appearance.borderRadius]} flex items-center justify-center text-white relative transition-all duration-300 transform hover:scale-110`}
        style={{
          backgroundColor: isHovered ? content.appearance.buttonHoverColor : content.appearance.buttonColor,
          boxShadow: content.appearance.shadow ? '0 10px 25px -5px rgba(0, 0, 0, 0.2)' : 'none'
        }}
        aria-label="WhatsApp ile iletisime gecin"
      >
        <svg
          className={iconSizes[content.appearance.size]}
          fill={content.appearance.iconColor}
          viewBox="0 0 24 24"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>

        {/* Pulse Animation */}
        {content.appearance.pulseAnimation && (
          <span
            className={`absolute inset-0 ${borderRadiusClasses[content.appearance.borderRadius]} animate-ping opacity-75`}
            style={{ backgroundColor: content.appearance.buttonColor }}
          />
        )}

        {/* Online Indicator */}
        {content.availability.showIndicator && (
          <div
            className="absolute -top-1 -right-1 w-4 h-4 rounded-full border-2 border-white flex items-center justify-center"
            style={{ backgroundColor: isOnline ? content.availability.onlineColor : content.availability.offlineColor }}
          >
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ backgroundColor: isOnline ? content.availability.onlineColor : content.availability.offlineColor }}
            />
          </div>
        )}
      </button>
    </div>
  )
}
