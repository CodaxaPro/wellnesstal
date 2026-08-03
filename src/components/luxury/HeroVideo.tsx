'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

import type { SiteContent } from '@/lib/content'
import { getBookingUrl } from '@/lib/content'

import LuxuryButton from './LuxuryButton'
import { FadeIn } from './Reveal'

export default function HeroVideo({ site }: { site: SiteContent }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const { hero, media } = site

  const videoType = media.heroVideo.endsWith('.mov') || media.heroVideo.endsWith('.MOV')
    ? 'video/quicktime'
    : 'video/mp4'

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[600px] overflow-hidden bg-ink">
      <motion.div className="absolute inset-0" style={reduce ? undefined : { y }}>
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={media.heroPoster}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          aria-hidden
        >
          <source src={media.heroVideo} type={videoType} />
        </video>
        <div className="video-overlay absolute inset-0" />
      </motion.div>

      <motion.div
        className="relative z-10 flex h-full flex-col justify-end pb-20 md:pb-28 lg:pb-32"
        style={reduce ? undefined : { opacity }}
      >
        <div className="container-luxury">
          <FadeIn className="max-w-3xl">
            <p className="eyebrow-luxury !text-gold mb-4 md:mb-6">{hero.eyebrow}</p>
            <h1 className="headline-hero text-ivory">{hero.title}</h1>
            <p className="mt-5 md:mt-6 max-w-xl body-luxury !text-ivory/75 text-base md:text-lg">{hero.subtitle}</p>
            {'trust' in hero && hero.trust ? (
              <p className="mt-4 md:mt-5 eyebrow-luxury !text-ivory/50">{hero.trust}</p>
            ) : null}
            <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4">
              <LuxuryButton href={hero.ctaPrimaryHref ?? getBookingUrl()}>{hero.ctaPrimary}</LuxuryButton>
              <LuxuryButton
                href={hero.ctaSecondaryHref ?? '/headspa'}
                variant="outline"
                className="!border-ivory/30 !text-ivory hover:!bg-ivory hover:!text-ink"
              >
                {hero.ctaSecondary}
              </LuxuryButton>
            </div>
          </FadeIn>
        </div>
      </motion.div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3">
        <span className="eyebrow-luxury !text-ivory/50 !text-[9px]">Scroll</span>
        <motion.div
          animate={reduce ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="w-px h-12 bg-gradient-to-b from-transparent via-ivory/50 to-transparent"
        />
      </div>
    </section>
  )
}
