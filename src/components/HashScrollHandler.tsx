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
      // Try multiple times with increasing delays to handle slow rendering (especially for hero blocks with animations)
      const attemptScroll = (attempt = 0) => {
        const element = document.getElementById(id)
        if (element) {
          // Small delay to ensure element is fully rendered
          setTimeout(() => {
            // Scroll with smooth behavior
            element.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }, 100)
        } else if (attempt < 10) {
          // Retry up to 10 times with increasing delays (for slow-rendering hero blocks)
          setTimeout(() => attemptScroll(attempt + 1), 300 * (attempt + 1))
        } else {
          // Final attempt: try to find element by any means
          console.warn(`[HashScrollHandler] Could not find element with id: ${id} after ${attempt} attempts`)
        }
      }

      // Start scrolling after initial delay (increased for hero blocks)
      setTimeout(() => attemptScroll(), 200)
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

