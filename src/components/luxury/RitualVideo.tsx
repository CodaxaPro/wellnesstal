'use client'

import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

import type { SiteContent } from '@/lib/content'

import { Reveal } from './Reveal'

export default function RitualVideo({ site }: { site: SiteContent }) {
  const ref = useRef<HTMLElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const videoScale = useTransform(scrollYProgress, [0, 1], [1.08, 1])
  const videoY = useTransform(scrollYProgress, [0, 1], ['-4%', '4%'])

  const { ritual, media } = site

  return (
    <section id="ritual" ref={ref} className="section-space bg-beige overflow-hidden">
      <div className="container-luxury">
        <Reveal className="mb-16 md:mb-24 text-center max-w-3xl mx-auto">
          <p className="eyebrow-luxury mb-4">{ritual.title}</p>
          <h2 className="headline-lg">Fünf Momente der Stille</h2>
        </Reveal>

        <div className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <Reveal className="lg:col-span-5 lg:sticky lg:top-28">
            <div className="relative aspect-[3/4] overflow-hidden bg-ink shadow-2xl">
              <motion.div
                className="absolute inset-0"
                style={reduce ? undefined : { scale: videoScale, y: videoY }}
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  poster={media.ritualPoster}
                  className="h-full w-full object-cover"
                  aria-label="Signature Ritual — Wellnesstal Head Spa"
                >
                  <source src={media.ritualVideo} type="video/mp4" />
                </video>
              </motion.div>
              <div className="video-overlay absolute inset-0 opacity-60" />
              <div className="absolute inset-x-0 bottom-0 p-8 md:p-10">
                <p className="eyebrow-luxury !text-gold mb-3">Das Ritual</p>
                <p className="font-display text-2xl md:text-3xl font-light text-ivory leading-snug">
                  Jeder Schritt ist komponiert — wie eine Zeremonie.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            {ritual.steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.08}>
                <div className="grid md:grid-cols-12 gap-4 md:gap-6 py-10 md:py-12 border-t border-stone items-baseline first:border-t-0 lg:first:border-t lg:first:pt-0">
                  <span className="md:col-span-2 font-display text-5xl text-gold/50 tabular-nums">{step.num}</span>
                  <h3 className="md:col-span-3 headline-md">{step.title}</h3>
                  <p className="md:col-span-7 body-luxury">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
