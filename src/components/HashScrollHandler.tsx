'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

/**
 * Client component to handle hash-based scrolling on page load
 * This ensures that when a user visits a URL with a hash (e.g., /headspa#pricing),
 * the page scrolls to the correct element after it's rendered
 */
export default function HashScrollHandler() {
  const pathname = usePathname()
  const hasScrolledRef = useRef(false)

  // Aggressive scroll function - tries multiple methods
  const forceScrollToHash = (id: string, attempt = 0) => {
    // Stop after too many attempts
    if (attempt > 50) {
      console.warn(`[HashScrollHandler] ❌ Max attempts reached for #${id}`)
      return false
    }
    
    // Try multiple selectors
    const element = document.getElementById(id) || 
                   document.querySelector(`[id="${id}"]`) ||
                   document.querySelector(`#${id}`) ||
                   document.querySelector(`[data-section="${id}"]`) as HTMLElement
    
    if (element) {
      const rect = element.getBoundingClientRect()
      const isVisible = rect.width > 0 && rect.height > 0
      
      if (isVisible) {
        // Calculate absolute position using multiple methods
        const elementTop = (element as HTMLElement).offsetTop || 
                          (element as HTMLElement).getBoundingClientRect().top + window.pageYOffset ||
                          (element as HTMLElement).scrollTop ||
                          0
        
        // Method 1: Direct scroll to position (most reliable)
        window.scrollTo({ top: elementTop, behavior: 'instant' })
        
        // Method 2: scrollIntoView
        (element as HTMLElement).scrollIntoView({ behavior: 'instant', block: 'start' })
        
        // Method 3: Smooth scroll after instant (for better UX)
        setTimeout(() => {
          window.scrollTo({ top: elementTop, behavior: 'smooth' })
        }, 50)
        
        console.log(`[HashScrollHandler] ✅ Scrolled to #${id} at position ${elementTop}`)
        hasScrolledRef.current = true
        return true
      } else if (attempt < 50) {
        // Element exists but not visible yet, retry
        setTimeout(() => forceScrollToHash(id, attempt + 1), 50)
      }
    } else if (attempt < 50) {
      // Element not found, retry with shorter delay
      setTimeout(() => forceScrollToHash(id, attempt + 1), 50)
    } else {
      console.warn(`[HashScrollHandler] ❌ Could not find element #${id} after ${attempt} attempts`)
      // Last resort: try to scroll to top of page (maybe element is at top)
      if (attempt === 50) {
        window.scrollTo({ top: 0, behavior: 'instant' })
      }
    }
    
    return false
  }

  // Use useLayoutEffect for immediate execution before paint
  useLayoutEffect(() => {
    hasScrolledRef.current = false
    
    // Immediate scroll attempt (before React hydration completes)
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (hash) {
      const id = hash.substring(1)
      if (id) {
        console.log(`[HashScrollHandler] 🎯 Starting aggressive scroll to #${id}`)
        
        // Try immediately
        forceScrollToHash(id, 0)
        
        // Try with multiple delays
        setTimeout(() => forceScrollToHash(id, 0), 50)
        setTimeout(() => forceScrollToHash(id, 0), 150)
        setTimeout(() => forceScrollToHash(id, 0), 300)
        setTimeout(() => forceScrollToHash(id, 0), 500)
        setTimeout(() => forceScrollToHash(id, 0), 1000)
      }
    }
  }, [pathname])

  useEffect(() => {
    // Reset scroll flag on pathname change
    hasScrolledRef.current = false
    
    const hash = typeof window !== 'undefined' ? window.location.hash : ''
    if (!hash) return

    const id = hash.substring(1)
    if (!id) return

    console.log(`[HashScrollHandler] 🔄 useEffect: Starting scroll to #${id}`)

    // Wait for DOM to be fully ready
    const startScrolling = () => {
      // Try immediately
      forceScrollToHash(id, 0)
      
      // Try with delays to catch late-rendering elements
      const delays = [100, 200, 300, 500, 800, 1200, 2000]
      delays.forEach(delay => {
        setTimeout(() => {
          if (!hasScrolledRef.current) {
            forceScrollToHash(id, 0)
          }
        }, delay)
      })
    }

    // Start when DOM is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      startScrolling()
    } else {
      window.addEventListener('load', startScrolling, { once: true })
      // Also try immediately
      startScrolling()
    }

    // Handle hash changes
    const handleHashChange = () => {
      hasScrolledRef.current = false
      const newHash = window.location.hash
      if (newHash) {
        const newId = newHash.substring(1)
        if (newId) {
          console.log(`[HashScrollHandler] 🔄 Hash changed to #${newId}`)
          forceScrollToHash(newId, 0)
        }
      }
    }

    window.addEventListener('hashchange', handleHashChange)

    return () => {
      window.removeEventListener('hashchange', handleHashChange)
    }
  }, [pathname])

  return null
}

