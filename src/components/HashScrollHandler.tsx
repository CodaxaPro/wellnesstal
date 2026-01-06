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

  // Aggressive scroll function
  const forceScrollToHash = (id: string, attempt = 0) => {
    if (hasScrolledRef.current && attempt > 5) return // Stop after successful scroll
    
    const element = document.getElementById(id)
    
    if (element) {
      const rect = element.getBoundingClientRect()
      const isVisible = rect.width > 0 && rect.height > 0
      
      if (isVisible) {
        // Calculate absolute position
        const elementTop = element.offsetTop || (rect.top + window.pageYOffset)
        
        // Force scroll - multiple methods
        window.scrollTo({ top: elementTop, behavior: 'instant' })
        element.scrollIntoView({ behavior: 'instant', block: 'start' })
        
        // Also try smooth after instant
        setTimeout(() => {
          window.scrollTo({ top: elementTop, behavior: 'smooth' })
        }, 100)
        
        console.log(`[HashScrollHandler] ✅ Scrolled to #${id} at position ${elementTop}`)
        hasScrolledRef.current = true
        return true
      } else if (attempt < 30) {
        // Element exists but not visible yet, retry
        setTimeout(() => forceScrollToHash(id, attempt + 1), 100)
      }
    } else if (attempt < 30) {
      // Element not found, retry
      setTimeout(() => forceScrollToHash(id, attempt + 1), 100)
    } else {
      // Try alternative selectors
      const fallback = document.querySelector(`[id="${id}"]`) || 
                      document.querySelector(`#${id}`) ||
                      document.querySelector(`[data-section="${id}"]`)
      
      if (fallback) {
        const fallbackTop = (fallback as HTMLElement).offsetTop || 
                          ((fallback as HTMLElement).getBoundingClientRect().top + window.pageYOffset)
        window.scrollTo({ top: fallbackTop, behavior: 'instant' })
        console.log(`[HashScrollHandler] ✅ Scrolled to #${id} via fallback selector`)
        hasScrolledRef.current = true
      } else {
        console.warn(`[HashScrollHandler] ❌ Could not find element #${id} after ${attempt} attempts`)
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

