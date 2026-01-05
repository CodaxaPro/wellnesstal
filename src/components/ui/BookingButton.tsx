'use client'

import { useState } from 'react'

interface BookingButtonProps {
  text?: string
  link?: string
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showIcon?: boolean
}

export default function BookingButton({
  text = 'Jetzt Termin buchen',
  link = '#booking',
  onClick,
  variant = 'primary',
  size = 'lg',
  className = '',
  showIcon = true
}: BookingButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault()
      onClick()
      return
    }

    // Scroll to booking section if link starts with #
    if (link.startsWith('#')) {
      e.preventDefault()
      const targetId = link.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        // Fallback: try to find booking widget
        const bookingSection = document.querySelector('[data-booking-section]')
        if (bookingSection) {
          bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }
  }

  const baseClasses = 'inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2'
  
  const variantClasses = {
    primary: 'bg-sage-500 text-white hover:bg-forest-600 shadow-lg hover:shadow-xl hover:-translate-y-1',
    secondary: 'bg-forest-600 text-white hover:bg-forest-700 shadow-lg hover:shadow-xl hover:-translate-y-1',
    outline: 'bg-transparent text-sage-500 border-2 border-sage-500 hover:bg-sage-50 hover:border-forest-600'
  }

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const iconSize = size === 'sm' ? 18 : size === 'md' ? 20 : 24

  return (
    <a
      href={link}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      aria-label={text}
    >
      {showIcon && (
        <svg
          className={`transition-transform duration-300 ${isHovered ? 'scale-110' : ''}`}
          width={iconSize}
          height={iconSize}
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
      )}
      <span>{text}</span>
      {variant === 'primary' && (
        <svg
          className={`transition-transform duration-300 ${isHovered ? 'translate-x-1' : ''}`}
          width={iconSize}
          height={iconSize}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      )}
    </a>
  )
}

