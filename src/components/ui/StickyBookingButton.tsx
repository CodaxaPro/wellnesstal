'use client'

import { useState, useEffect } from 'react'

interface StickyBookingButtonProps {
  text?: string
  link?: string
  showAfterScroll?: number // percentage of page scrolled (0-100)
  className?: string
}

export default function StickyBookingButton({
  text = 'Şimdi Randevu Al',
  link = '#booking',
  showAfterScroll = 30, // Show after 30% scroll
  className = ''
}: StickyBookingButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent =
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100

      if (scrollPercent >= showAfterScroll && !hasScrolled) {
        setIsVisible(true)
        setHasScrolled(true)
      }
    }

    window.addEventListener('scroll', handleScroll)
    // Check initial scroll position
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [showAfterScroll, hasScrolled])

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (link.startsWith('#')) {
      e.preventDefault()
      const targetId = link.substring(1)
      const element = document.getElementById(targetId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  if (!isVisible) return null

  return (
    <div
      className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-40 transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      } ${className}`}
      style={{
        maxWidth: 'calc(100vw - 2rem)',
        padding: '0 1rem'
      }}
    >
      <a
        href={link}
        onClick={handleClick}
        className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-sage-500 text-white font-semibold rounded-xl shadow-xl hover:bg-forest-600 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 transform text-sm sm:text-base"
        style={{
          boxShadow: '0 10px 25px -5px rgba(156, 175, 136, 0.4), 0 10px 10px -5px rgba(156, 175, 136, 0.2)'
        }}
      >
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
        <span className="whitespace-nowrap">{text}</span>
      </a>
    </div>
  )
}

