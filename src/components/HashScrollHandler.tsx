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
          // Check if element is visible (not just in DOM, but actually rendered)
          const rect = element.getBoundingClientRect()
          const isVisible = rect.width > 0 && rect.height > 0
          
          if (isVisible) {
            // Small delay to ensure element is fully rendered and animations are complete
            setTimeout(() => {
              // Scroll with smooth behavior
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 150)
          } else if (attempt < 15) {
            // Element exists but not visible yet (likely still animating), retry
            setTimeout(() => attemptScroll(attempt + 1), 200)
          }
        } else if (attempt < 15) {
          // Retry up to 15 times with increasing delays (for slow-rendering hero blocks)
          setTimeout(() => attemptScroll(attempt + 1), 300 * (attempt + 1))
        } else {
          // Final attempt: try to find element by any means
          console.warn(`[HashScrollHandler] Could not find element with id: ${id} after ${attempt} attempts`)
        }
      }

      // Start scrolling after initial delay (increased for hero blocks with animations)
      setTimeout(() => attemptScroll(), 300)
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

