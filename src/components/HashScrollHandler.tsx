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
    
    // Try multiple selectors - prioritize hero blocks (section elements)
    let element: HTMLElement | null = null
    
    // Method 1: Try section with id (most likely for hero blocks)
    element = document.querySelector(`section[id="${id}"]`) as HTMLElement
    
    // Method 2: Try section#id
    if (!element) {
      element = document.querySelector(`section#${id}`) as HTMLElement
    }
    
    // Method 3: Try getElementById
    if (!element) {
      element = document.getElementById(id)
    }
    
    // Method 4: Try any element with id attribute
    if (!element) {
      element = document.querySelector(`[id="${id}"]`) as HTMLElement
    }
    
    // Method 5: Try data-section attribute
    if (!element) {
      element = document.querySelector(`[data-section="${id}"]`) as HTMLElement
    }
    
    // Debug: Log what we found
    if (element) {
      console.log(`[HashScrollHandler] 🔍 Found element #${id}:`, {
        tagName: element.tagName,
        id: element.id,
        className: element.className,
        offsetTop: element.offsetTop,
        getBoundingClientRect: element.getBoundingClientRect()
      })
    } else {
      console.warn(`[HashScrollHandler] ⚠️ Element #${id} not found, attempt ${attempt}`)
    }
    
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
        
        // For hero blocks, always scroll to top (even if already visible)
        // This ensures the page starts at the hero section when hash is present
        const isHeroBlock = element.tagName === 'SECTION' || 
                           element.classList.contains('hero') ||
                           element.closest('section')?.id === id ||
                           (element as HTMLElement).classList.contains('bg-cream-gradient') // Hero block has this class
        
        // For hero blocks, always scroll to ensure it's at the very top
        if (isHeroBlock) {
          console.log(`[HashScrollHandler] 🎯 Hero block detected (#${id}), forcing scroll to top`)
          
          // Calculate hero block's absolute position using multiple methods
          const heroElement = element as HTMLElement
          const heroOffsetTop = heroElement.offsetTop || 0
          const heroRectTop = rect.top + scrollY
          const heroScrollTop = heroElement.scrollTop || 0
          
          // Use the most accurate position
          // offsetTop is usually most reliable for absolute positioning
          let heroTop = heroOffsetTop
          
          // If offsetTop is 0 but we're not at top, use rect calculation
          if (heroOffsetTop === 0 && scrollY > 0) {
            heroTop = heroRectTop
          }
          
          // Ensure we don't scroll to negative position
          heroTop = Math.max(0, heroTop)
          
          console.log(`[HashScrollHandler] 📊 Hero position: offsetTop=${heroOffsetTop}, rectTop=${heroRectTop}, scrollY=${scrollY}, final=${heroTop}`)
          
          // Method 1: Direct scroll to calculated position
          if (typeof window.scrollTo === 'function') {
            try {
              window.scrollTo({ top: heroTop, behavior: 'instant' })
            } catch (e) {
              window.scrollTo(0, heroTop)
            }
          }
          
          // Method 2: scrollIntoView (more reliable for getting element to top)
          if (typeof heroElement.scrollIntoView === 'function') {
            try {
              heroElement.scrollIntoView({ behavior: 'instant', block: 'start', inline: 'nearest' })
            } catch (e) {
              heroElement.scrollIntoView(true)
            }
          }
          
          // Method 3: Smooth scroll after instant (for better UX)
          setTimeout(() => {
            if (typeof window.scrollTo === 'function') {
              try {
                window.scrollTo({ top: heroTop, behavior: 'smooth' })
              } catch (e) {
                window.scrollTo(0, heroTop)
              }
            }
          }, 100)
          
          console.log(`[HashScrollHandler] ✅ Scrolled hero block #${id} to position ${heroTop}`)
          hasScrolledRef.current = true
          return true
        }
        
        // For non-hero blocks, only scroll if not already at target
        if (rect.top >= -10 && rect.top < 10 && scrollDifference < 10) {
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
      console.warn('[HashScrollHandler] ⚠️ Not in browser environment')
      return
    }
    
    hasScrolledRef.current = false
    
    // Immediate scroll attempt (before React hydration completes)
    const hash = window.location.hash
    console.log(`[HashScrollHandler] 🔍 useLayoutEffect: hash="${hash}", pathname="${pathname}"`)
    
    if (hash) {
      const id = hash.substring(1)
      if (id) {
        console.log(`[HashScrollHandler] 🎯 Starting aggressive scroll to #${id}`)
        
        // Try immediately (don't wait for requestAnimationFrame)
        forceScrollToHash(id, 0)
        
        // Wait a tiny bit to ensure DOM is ready, then try again
        requestAnimationFrame(() => {
          forceScrollToHash(id, 0)
        })
        
        // Try with multiple delays
        setTimeout(() => forceScrollToHash(id, 0), 50)
        setTimeout(() => forceScrollToHash(id, 0), 100)
        setTimeout(() => forceScrollToHash(id, 0), 200)
        setTimeout(() => forceScrollToHash(id, 0), 300)
        setTimeout(() => forceScrollToHash(id, 0), 500)
        setTimeout(() => forceScrollToHash(id, 0), 800)
        setTimeout(() => forceScrollToHash(id, 0), 1200)
      } else {
        console.log('[HashScrollHandler] ⚠️ Hash is empty after substring')
      }
    } else {
      console.log('[HashScrollHandler] ℹ️ No hash in URL')
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

