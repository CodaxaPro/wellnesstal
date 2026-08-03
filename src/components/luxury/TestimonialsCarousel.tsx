'use client'

import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

import type { TestimonialsContent } from '@/lib/content'

/** Fixed card size — all reviews share identical dimensions */
const CARD_CLASS =
  'h-[22rem] w-[17.5rem] sm:h-[23rem] sm:w-[18.5rem] lg:h-[24rem] lg:w-[20rem]'

type Props = {
  data: TestimonialsContent
  reviewsUrl: string
  reviewsCta: string
  theme?: 'light' | 'ivory'
}

function fadeClass(theme: 'light' | 'ivory') {
  return theme === 'light' ? 'from-beige' : 'from-ivory'
}

function Stars({ count }: { count: number }) {
  return (
    <p className="text-gold text-xs tracking-[0.2em] mb-5 shrink-0" aria-label={`${count} von 5 Sternen`}>
      {'★'.repeat(count)}
    </p>
  )
}

function ReviewCard({
  name,
  location,
  text,
  rating,
  theme,
  expanded,
  onToggle,
}: Omit<TestimonialsContent['items'][number], 'id'> & {
  theme: 'light' | 'ivory'
  expanded: boolean
  onToggle: () => void
}) {
  const long = text.length > 160
  const cardBg = theme === 'light' ? 'bg-ivory' : 'bg-beige/50'

  return (
    <article
      className={`${CARD_CLASS} flex shrink-0 snap-center flex-col p-7 md:p-8 border border-stone/70 ${cardBg} shadow-[0_1px_0_rgba(255,255,255,0.6)_inset] transition-[border-color,box-shadow] duration-500 hover:border-gold/35`}
    >
      <Stars count={rating} />

      <blockquote
        className={`font-display text-[1.05rem] leading-[1.65] text-ink/90 min-h-0 flex-1 ${
          expanded
            ? 'overflow-y-auto overscroll-contain pr-0.5'
            : 'line-clamp-[6] overflow-hidden'
        }`}
      >
        &ldquo;{text}&rdquo;
      </blockquote>

      <div className="mt-3 h-7 shrink-0 flex items-center">
        {long ? (
          <button
            type="button"
            onClick={onToggle}
            className="eyebrow-luxury !text-[10px] !text-gold hover:!text-ink transition-colors duration-300"
          >
            {expanded ? 'Weniger anzeigen' : 'Mehr anzeigen'}
          </button>
        ) : null}
      </div>

      <footer className="mt-auto shrink-0 pt-4 border-t border-stone/50 eyebrow-luxury !text-[10px] !text-charcoal/55 truncate">
        {name}
        {location ? ` · ${location}` : ''}
      </footer>
    </article>
  )
}

export default function TestimonialsCarousel({ data, reviewsUrl, reviewsCta, theme = 'ivory' }: Props) {
  const reduce = useReducedMotion()
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const syncControls = useCallback(() => {
    const el = trackRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft < maxScroll - 8)

    const cards = Array.from(el.children) as HTMLElement[]
    if (!cards.length) return
    const center = el.scrollLeft + el.clientWidth / 2
    let nearest = 0
    let minDist = Infinity
    cards.forEach((card, i) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2
      const dist = Math.abs(center - cardCenter)
      if (dist < minDist) {
        minDist = dist
        nearest = i
      }
    })
    setActiveIndex(nearest)
  }, [])

  useEffect(() => {
    const el = trackRef.current
    if (!el) return
    syncControls()
    el.addEventListener('scroll', syncControls, { passive: true })
    window.addEventListener('resize', syncControls)
    return () => {
      el.removeEventListener('scroll', syncControls)
      window.removeEventListener('resize', syncControls)
    }
  }, [syncControls, data.items.length])

  const scrollByCard = (dir: -1 | 1) => {
    const el = trackRef.current
    if (!el) return
    setExpandedId(null)
    const card = el.children[0] as HTMLElement | undefined
    const gap = 20
    const step = card ? card.offsetWidth + gap : el.clientWidth * 0.85
    el.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' })
  }

  const trackHeight = 'h-[22rem] sm:h-[23rem] lg:h-[24rem]'

  return (
    <div className="relative mt-12 md:mt-16">
      <div className={`relative overflow-hidden ${trackHeight}`}>
        <div
          className={`pointer-events-none absolute inset-y-0 left-0 z-10 w-10 md:w-14 bg-gradient-to-r ${fadeClass(theme)} to-transparent`}
          aria-hidden
        />
        <div
          className={`pointer-events-none absolute inset-y-0 right-0 z-10 w-10 md:w-14 bg-gradient-to-l ${fadeClass(theme)} to-transparent`}
          aria-hidden
        />

        <div
          ref={trackRef}
          className={`testimonials-track flex h-full flex-nowrap items-stretch gap-5 overflow-x-auto overflow-y-hidden overscroll-x-contain py-1 px-1 snap-x snap-mandatory scroll-smooth touch-pan-x`}
          role="region"
          aria-roledescription="Karussell"
          aria-label="Google-Bewertungen"
        >
          {data.items.map((item) => (
            <ReviewCard
              key={item.id}
              {...item}
              theme={theme}
              expanded={expandedId === item.id}
              onToggle={() => setExpandedId((cur) => (cur === item.id ? null : item.id))}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 md:mt-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center justify-center sm:justify-start gap-3">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={!canPrev}
            aria-label="Vorherige Bewertung"
            className="flex h-11 w-11 items-center justify-center border border-stone/80 bg-ivory text-ink transition-all duration-300 hover:border-gold/50 hover:text-gold disabled:opacity-25 disabled:pointer-events-none"
          >
            ←
          </button>
          <span className="eyebrow-luxury !text-charcoal/45 tabular-nums min-w-[4.5rem] text-center">
            {activeIndex + 1} / {data.items.length}
          </span>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={!canNext}
            aria-label="Nächste Bewertung"
            className="flex h-11 w-11 items-center justify-center border border-stone/80 bg-ivory text-ink transition-all duration-300 hover:border-gold/50 hover:text-gold disabled:opacity-25 disabled:pointer-events-none"
          >
            →
          </button>
        </div>

        <Link
          href={reviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="eyebrow-luxury text-center sm:text-right hover:text-gold transition-colors duration-300 underline underline-offset-4"
        >
          {reviewsCta}
        </Link>
      </div>
    </div>
  )
}
