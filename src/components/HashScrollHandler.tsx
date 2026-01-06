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
    // Safety check: ensure we're in browser
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false
    }
    
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
        // Calculate absolute position - use getBoundingClientRect which is more reliable
        const scrollY = window.pageYOffset || window.scrollY || 0
        // rect.top is relative to viewport, so add current scroll to get absolute position
        const elementAbsoluteTop = rect.top + scrollY
        
        // Target scroll position: scroll to element's top
        // If rect.top is negative, element is above viewport, so we need to scroll up
        // If rect.top is positive, element is below viewport, so we need to scroll down
        const targetScroll = elementAbsoluteTop
        
        // Only scroll if we're not already at the target position
        const currentScroll = scrollY
        const scrollDifference = Math.abs(targetScroll - currentScroll)
        
        // If element is already at the top of viewport (within 50px), don't scroll
        if (rect.top >= -10 && rect.top < 50 && scrollDifference < 50) {
          console.log(`[HashScrollHandler] ✅ Already at #${id} (current: ${currentScroll}, target: ${targetScroll}, rect.top: ${rect.top})`)
          hasScrolledRef.current = true
          return true
        }
        
        console.log(`[HashScrollHandler] 📍 Scrolling to #${id}: current=${currentScroll}, target=${targetScroll}, rect.top=${rect.top}, diff=${scrollDifference}`)
        
        // Safety check for scrollTo
        if (typeof window.scrollTo === 'function') {
          try {
            // Method 1: Direct scroll to position (most reliable)
            window.scrollTo({ top: targetScroll, behavior: 'instant' })
          } catch (e) {
            // Fallback for older browsers
            window.scrollTo(0, targetScroll)
          }
        } else if (window.scroll) {
          // Fallback method
          window.scroll(0, targetScroll)
        }
        
        // Method 2: scrollIntoView (as backup)
        if (typeof (element as HTMLElement).scrollIntoView === 'function') {
          try {
            (element as HTMLElement).scrollIntoView({ behavior: 'instant', block: 'start' })
          } catch (e) {
            (element as HTMLElement).scrollIntoView(true)
          }
        }
        
        // Method 3: Smooth scroll after instant (for better UX)
        if (typeof window.scrollTo === 'function') {
          setTimeout(() => {
            try {
              window.scrollTo({ top: targetScroll, behavior: 'smooth' })
            } catch (e) {
              window.scrollTo(0, targetScroll)
            }
          }, 50)
        }
        
        console.log(`[HashScrollHandler] ✅ Scrolled to #${id} at position ${targetScroll}`)
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
      if (attempt === 50 && typeof window.scrollTo === 'function') {
        try {
          window.scrollTo({ top: 0, behavior: 'instant' })
        } catch (e) {
          window.scrollTo(0, 0)
        }
      }
    }
    
    return false
  }

  // Use useLayoutEffect for immediate execution before paint
  useLayoutEffect(() => {
    // Safety check: only run in browser
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }
    
    hasScrolledRef.current = false
    
    // Immediate scroll attempt (before React hydration completes)
    const hash = window.location.hash
    if (hash) {
      const id = hash.substring(1)
      if (id) {
        console.log(`[HashScrollHandler] 🎯 Starting aggressive scroll to #${id}`)
        
        // Wait a tiny bit to ensure DOM is ready
        requestAnimationFrame(() => {
          // Try immediately
          forceScrollToHash(id, 0)
          
          // Try with multiple delays
          setTimeout(() => forceScrollToHash(id, 0), 50)
          setTimeout(() => forceScrollToHash(id, 0), 150)
          setTimeout(() => forceScrollToHash(id, 0), 300)
          setTimeout(() => forceScrollToHash(id, 0), 500)
          setTimeout(() => forceScrollToHash(id, 0), 1000)
        })
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

