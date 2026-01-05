'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Client component to handle hash-based scrolling on page load
 * This ensures that when a user visits a URL with a hash (e.g., /headspa#pricing),
 * the page scrolls to the correct element after it's rendered
 */
export default function HashScrollHandler() {
  const pathname = usePathname()

  useEffect(() => {
    // Wait for page to render, then handle hash scrolling
    const handleHashScroll = () => {
      if (typeof window === 'undefined') return

      const hash = window.location.hash
      if (!hash) return

      // Remove the # character
      const id = hash.substring(1)
      if (!id) return

      // Wait for content to render, then scroll
      // Try multiple times with increasing delays to handle slow rendering
      const attemptScroll = (attempt = 0) => {
        const element = document.getElementById(id)
        if (element) {
          // Scroll with smooth behavior
          element.scrollIntoView({ behavior: 'smooth', block: 'start' })
        } else if (attempt < 5) {
          // Retry up to 5 times with increasing delays
          setTimeout(() => attemptScroll(attempt + 1), 200 * (attempt + 1))
        }
      }

      // Start scrolling after initial delay
      setTimeout(() => attemptScroll(), 100)
    }

    // Handle hash scroll on pathname change
    handleHashScroll()

    // Also handle it when hash changes (in case user clicks a hash link on the same page)
    const handleHashChange = () => {
      handleHashScroll()
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [pathname])

  return null
}

