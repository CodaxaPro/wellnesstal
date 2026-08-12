'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

/**
 * Mobile-only sticky bottom CTA. Hidden while hero or booking section is in view.
 */
export default function StickyBookCta({
  href,
  label = 'Wunschtermin finden',
}: {
  href: string
  label?: string
}) {
  const [heroInView, setHeroInView] = useState(true)
  const [bookingInView, setBookingInView] = useState(false)
  const target = href.trim()

  useEffect(() => {
    if (!target || target === '#') return
    if (typeof IntersectionObserver === 'undefined') return

    const hero = document.getElementById('landing-slot-hero')
    const booking =
      document.getElementById('landing-slot-booking') ?? document.getElementById('buchung')

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id
          if (id === 'landing-slot-hero') {
            setHeroInView(entry.isIntersecting)
          }
          if (id === 'landing-slot-booking' || id === 'buchung') {
            setBookingInView(entry.isIntersecting)
          }
        }
      },
      { root: null, threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    if (hero) io.observe(hero)
    if (booking) io.observe(booking)
    return () => io.disconnect()
  }, [target])

  if (!target || target === '#') return null
  if (heroInView || bookingInView) return null

  const className =
    'pointer-events-auto inline-flex min-h-12 w-full max-w-lg touch-manipulation items-center justify-center bg-ink px-5 text-sm font-semibold uppercase tracking-luxury text-ivory shadow-lg ring-1 ring-black/10'

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 md:hidden"
      role="region"
      aria-label={label}
    >
      {target.startsWith('http') ? (
        <a href={target} className={className} rel="noopener noreferrer">
          {label}
        </a>
      ) : (
        <Link href={target} className={className}>
          {label}
        </Link>
      )}
    </div>
  )
}
