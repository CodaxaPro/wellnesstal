'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'

import type { SiteContent } from '@/lib/content'

import LuxuryButton from './LuxuryButton'

const menuSections = [
  {
    title: 'Erlebnis',
    links: [
      { label: 'Philosophie', href: '/#experience' },
      { label: 'Signature Ritual', href: '/#ritual' },
      { label: 'Vorteile', href: '/#benefits' },
    ],
  },
  {
    title: 'Behandlungen',
    links: [
      { label: 'Head Spa — Übersicht', href: '/headspa' },
      { label: 'Zu zweit — Partner', href: '/headspa/partner' },
      { label: 'Headspa Basic — 89€', href: '/headspa#pakete' },
      { label: 'Headspa Beauty — 119€', href: '/headspa#pakete' },
      { label: 'Headspa Deluxe — 149€', href: '/headspa#pakete' },
    ],
  },
  {
    title: 'Mehr',
    links: [
      { label: 'Gutschein', href: '/gutschein' },
      { label: 'Gutschein zu zweit', href: '/gutschein/paar' },
      { label: 'Head Spa Aachen', href: '/headspa-aachen' },
      { label: 'Standort', href: '/#location' },
      { label: 'FAQ', href: '/headspa#faq' },
    ],
  },
]

export default function LuxuryHeader({ site }: { site: SiteContent }) {
  const pathname = usePathname()
  const isHome = pathname === '/'
  const bookHref = site.brand.bookingUrl
  const [scrolled, setScrolled] = useState(!isHome)
  const [menuOpen, setMenuOpen] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (!isHome) {
      setScrolled(true)
      return
    }
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [isHome])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ${
          scrolled || menuOpen || !isHome
            ? 'glass py-4'
            : 'bg-gradient-to-b from-ink/70 via-ink/30 to-transparent py-5 md:py-6'
        }`}
        style={{ transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)' }}
      >
        <div className="container-luxury flex items-center justify-between">
          <Link
            href="/"
            className={`font-display text-xl md:text-2xl tracking-tight transition-colors ${
              menuOpen || scrolled || !isHome ? 'text-ink' : 'text-ivory'
            }`}
          >
            {site.brand.name}
          </Link>

          <nav className="hidden lg:flex items-center gap-12">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className={`eyebrow-luxury !tracking-wide transition-colors hover:text-gold ${
                scrolled || !isHome ? 'text-ink' : 'text-ivory/90'
              }`}
              aria-expanded={menuOpen}
              aria-controls="mega-menu"
            >
              Menu
            </button>
            <Link
              href="/headspa"
              className={`eyebrow-luxury !tracking-wide transition-colors hover:text-gold ${
                scrolled || !isHome ? 'text-ink' : 'text-ivory/90'
              }`}
            >
              Head Spa
            </Link>
            <Link
              href="/headspa/partner"
              className={`eyebrow-luxury !tracking-wide transition-colors hover:text-gold ${
                scrolled || !isHome ? 'text-ink' : 'text-ivory/90'
              }`}
            >
              Zu zweit
            </Link>
            <Link
              href="/gutschein"
              className={`eyebrow-luxury !tracking-wide transition-colors hover:text-gold ${
                scrolled || !isHome ? 'text-ink' : 'text-ivory/90'
              }`}
            >
              Gutschein
            </Link>
            <a
              href={bookHref}
              className={`btn-luxury !py-3 !px-8 ${
                scrolled || !isHome ? 'btn-luxury-primary' : 'border border-ivory/40 text-ivory hover:bg-ivory hover:text-ink'
              }`}
              rel="noopener noreferrer"
            >
              <span>Wunschtermin finden</span>
            </a>
          </nav>

          <button
            type="button"
            className={`lg:hidden eyebrow-luxury ${scrolled || menuOpen || !isHome ? 'text-ink' : 'text-ivory'}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Menü schließen' : 'Menü öffnen'}
          >
            {menuOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mega-menu"
            role="dialog"
            aria-modal="true"
            initial={reduce ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-40 bg-ivory pt-28 pb-12 overflow-y-auto"
          >
            <div className="container-luxury grid md:grid-cols-3 gap-16">
              {menuSections.map((col) => (
                <div key={col.title}>
                  <p className="eyebrow-luxury mb-8">{col.title}</p>
                  <ul className="space-y-4">
                    {col.links.map((l) => (
                      <li key={l.label}>
                        <Link
                          href={l.href}
                          className="headline-md hover:text-gold transition-colors duration-500"
                          onClick={() => setMenuOpen(false)}
                        >
                          {l.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="container-luxury mt-16">
              <LuxuryButton href={bookHref} onClick={() => setMenuOpen(false)}>
                Wunschtermin finden
              </LuxuryButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
