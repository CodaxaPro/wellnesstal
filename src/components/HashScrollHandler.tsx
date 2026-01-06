'use client'

import { useEffect, useLayoutEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Client component to handle hash-based scrolling on page load
 * This ensures that when a user visits a URL with a hash (e.g., /headspa#pricing),
 * the page scrolls to the correct element after it's rendered
 */
export default function HashScrollHandler() {
  const pathname = usePathname()

  // Use useLayoutEffect for immediate execution before paint
  useLayoutEffect(() => {
    // Immediate scroll attempt (before React hydration completes)
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (hash) {
      const id = hash.substring(1)
      if (id) {
        // Try immediate scroll (for fast-rendering pages)
        const tryScroll = () => {
          const element = document.getElementById(id)
          if (element) {
            const rect = element.getBoundingClientRect()
            if (rect.width > 0 && rect.height > 0) {
              // Element is visible, scroll immediately
              window.scrollTo({
                top: window.pageYOffset + rect.top,
                behavior: 'instant'
              })
              return true
            }
          }
          return false
        }
        
        // Try multiple times with short delays
        if (!tryScroll()) {
          setTimeout(() => tryScroll(), 50)
          setTimeout(() => tryScroll(), 150)
          setTimeout(() => tryScroll(), 300)
        }
      }
    }
  }, [])

  useEffect(() => {
    // Wait for page to render, then handle hash scrolling
    const handleHashScroll = () => {
      if (typeof window === 'undefined') return

      const hash = window.location.hash
      if (!hash) return

      // Remove the # character
      const id = hash.substring(1)
      if (!id) return

      console.log('[HashScrollHandler] Attempting to scroll to:', id)

      // Wait for content to render, then scroll
      // Try multiple times with increasing delays to handle slow rendering (especially for hero blocks with animations)
      const attemptScroll = (attempt = 0) => {
        const element = document.getElementById(id)
        
        if (element) {
          // Check if element is visible (not just in DOM, but actually rendered)
          const rect = element.getBoundingClientRect()
          const isVisible = rect.width > 0 && rect.height > 0
          
          console.log(`[HashScrollHandler] Attempt ${attempt}: Element found, visible: ${isVisible}`, {
            width: rect.width,
            height: rect.height,
            top: rect.top
          })
          
          if (isVisible) {
            // Calculate scroll position with offset for fixed headers
            const elementTop = element.getBoundingClientRect().top + window.pageYOffset
            const offset = 0 // No offset needed for hero blocks
            
            // Use both scrollIntoView and window.scrollTo for maximum compatibility
            setTimeout(() => {
              // Method 1: scrollIntoView
              element.scrollIntoView({ behavior: 'smooth', block: 'start' })
              
              // Method 2: window.scrollTo (fallback)
              setTimeout(() => {
                window.scrollTo({
                  top: elementTop - offset,
                  behavior: 'smooth'
                })
              }, 100)
              
              console.log('[HashScrollHandler] Scrolled to element')
            }, 200)
          } else if (attempt < 20) {
            // Element exists but not visible yet (likely still animating), retry
            setTimeout(() => attemptScroll(attempt + 1), 250)
          } else {
            console.warn(`[HashScrollHandler] Element found but not visible after ${attempt} attempts`)
          }
        } else if (attempt < 20) {
          // Retry up to 20 times with increasing delays (for slow-rendering hero blocks)
          if (attempt % 3 === 0) {
            console.log(`[HashScrollHandler] Attempt ${attempt}: Element not found, retrying...`)
          }
          setTimeout(() => attemptScroll(attempt + 1), 400)
        } else {
          // Final attempt: try to find element by any means
          console.warn(`[HashScrollHandler] Could not find element with id: ${id} after ${attempt} attempts`)
          // Try querySelector as fallback
          const fallbackElement = document.querySelector(`[id="${id}"]`) || document.querySelector(`#${id}`)
          if (fallbackElement) {
            console.log('[HashScrollHandler] Found element via querySelector fallback')
            fallbackElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      }

      // Start scrolling after initial delay (increased for hero blocks with animations)
      // Also wait for Next.js hydration to complete
      setTimeout(() => {
        // Wait for DOM to be ready
        if (document.readyState === 'complete') {
          attemptScroll()
        } else {
          window.addEventListener('load', () => {
            setTimeout(() => attemptScroll(), 500)
          })
        }
      }, 500)
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

