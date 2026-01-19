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

  // Simple scroll function
  const scrollToHash = (id: string) => {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false
    }

    // Try multiple ways to find element
    let element: HTMLElement | null = null
    
    element = document.getElementById(id)
    if (!element) {
      element = document.querySelector(`section[id="${id}"]`) as HTMLElement
    }
    if (!element) {
      element = document.querySelector(`[id="${id}"]`) as HTMLElement
    }

    if (element) {
      console.log(`[HashScrollHandler] ✅ Found element #${id}, scrolling...`)
      // Use instant scroll for better performance with mouse scrolling
      // Only use smooth for programmatic navigation
      element.scrollIntoView({ behavior: 'auto', block: 'start' })
      return true
    } else {
      console.warn(`[HashScrollHandler] ⚠️ Element #${id} not found`)
    }

    return false
  }

  // Use useLayoutEffect for immediate execution
  useLayoutEffect(() => {
    if (typeof window === 'undefined') {
return
}

    const hash = window.location.hash
    if (hash) {
      const id = hash.substring(1)
      if (id) {
        // Try immediately
        scrollToHash(id)
        
      // Try with delays - elements might render slowly
      setTimeout(() => scrollToHash(id), 100)
      setTimeout(() => scrollToHash(id), 300)
      setTimeout(() => scrollToHash(id), 500)
      setTimeout(() => scrollToHash(id), 1000)
      setTimeout(() => scrollToHash(id), 2000)
      setTimeout(() => scrollToHash(id), 3000)
      }
    }
  }, [pathname])

  useEffect(() => {
    if (typeof window === 'undefined') {
return
}

    const hash = window.location.hash
    if (hash) {
      const id = hash.substring(1)
      if (id) {
        // Try when DOM is ready
        const tryScroll = () => {
          scrollToHash(id)
        }

        if (document.readyState === 'complete' || document.readyState === 'interactive') {
          tryScroll()
        } else {
          window.addEventListener('load', tryScroll, { once: true })
        }

        // Try with delays - elements might render slowly
        setTimeout(() => scrollToHash(id), 100)
        setTimeout(() => scrollToHash(id), 300)
        setTimeout(() => scrollToHash(id), 500)
        setTimeout(() => scrollToHash(id), 1000)
        setTimeout(() => scrollToHash(id), 2000)
        setTimeout(() => scrollToHash(id), 3000)
        setTimeout(() => scrollToHash(id), 5000)
      }
    }

    // Handle hash changes
    const handleHashChange = () => {
      const newHash = window.location.hash
      if (newHash) {
        const newId = newHash.substring(1)
        if (newId) {
          scrollToHash(newId)
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
