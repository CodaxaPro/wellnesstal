'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'

import type { SiteContent } from '@/lib/content'
import { getBookingUrl } from '@/lib/content'

import LuxuryButton from './LuxuryButton'

type Service = SiteContent['services'][number]

export default function ServiceCard({ service }: { service: Service }) {
  const reduce = useReducedMotion()

  return (
    <motion.article
      className={`group relative flex h-full flex-col ${
        service.featured ? 'lg:-mt-4 lg:mb-4' : ''
      }`}
      whileHover={reduce ? undefined : { y: -6 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`card-depth relative flex h-full flex-col overflow-hidden border bg-stone/20 transition-[border-color,box-shadow] duration-700 group-hover:border-gold/40 ${
          service.featured ? 'border-gold/50' : 'border-stone/80'
        }`}
      >
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src={service.image}
            alt={service.name}
            fill
            className="object-cover transition-transform duration-[1.6s] ease-luxury group-hover:scale-[1.06]"
            sizes="(max-width:1024px) 100vw, 33vw"
          />
          <div className="glass-reflection pointer-events-none absolute inset-0" aria-hidden />
          {service.featured && (
            <span className="absolute top-6 left-6 eyebrow-luxury bg-ink/90 text-ivory px-4 py-2 backdrop-blur-sm">
              Signature
            </span>
          )}
        </div>

        <div className="relative flex flex-1 flex-col p-8 md:p-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-0 transition-opacity duration-700 group-hover:opacity-100" />
          <p className="eyebrow-luxury mb-3">{service.duration}</p>
          <h3 className="headline-md mb-3">{service.name}</h3>
          <p className="body-luxury mb-8 flex-1">{service.description}</p>
          <p className="font-display mb-8 text-4xl text-ink">
            {service.price}
            <span className="text-xl"> €</span>
          </p>
          <LuxuryButton href={getBookingUrl({ channel: 'home' })}>Wunschtermin finden</LuxuryButton>
          <Link
            href={`/headspa/${service.id}`}
            className="mt-4 block text-center eyebrow-luxury !text-charcoal/50 hover:!text-gold transition-colors"
          >
            Ritual entdecken →
          </Link>
        </div>
      </div>
    </motion.article>
  )
}
