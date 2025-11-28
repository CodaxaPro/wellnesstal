'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { href: '#home', label: 'Start' },
    { href: '#services', label: 'Leistungen' },
    { href: '#about', label: 'Über uns' },
    { href: '#contact', label: 'Kontakt' },
  ]

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-medium' 
          : 'bg-white shadow-soft'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 lg:h-18">
          {/* Logo */}
          <Link 
            href="/" 
            className="text-2xl lg:text-3xl font-bold text-forest-600 hover:text-sage-500 transition-colors"
          >
            🌿 Wellnesstal
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-charcoal hover:text-sage-500 font-medium transition-colors duration-300 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-sage-500 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
            
            {/* CTA Button */}
            <Link 
              href="tel:+4922112345678"
              className="bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-medium hover:-translate-y-1 flex items-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Termin vereinbaren
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden text-charcoal hover:text-sage-500 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menu öffnen"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? 'max-h-96 py-4' : 'max-h-0'
        }`}>
          <div className="flex flex-col space-y-4 bg-white rounded-xl p-4 shadow-medium mt-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-charcoal hover:text-sage-500 font-medium transition-colors py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link 
              href="tel:+4922112345678"
              className="bg-sage-500 text-white px-6 py-3 rounded-xl font-semibold text-center hover:bg-forest-600 transition-colors mt-4"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Termin vereinbaren
            </Link>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header