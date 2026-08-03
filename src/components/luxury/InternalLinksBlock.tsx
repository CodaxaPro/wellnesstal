'use client'

import Link from 'next/link'

import type { InternalLinkBlock } from '@/lib/money-page-types'

import { Reveal } from './Reveal'

export default function InternalLinksBlock({ block }: { block: InternalLinkBlock }) {
  return (
    <section className="section-space bg-ivory border-t border-stone/60">
      <div className="container-luxury max-w-4xl mx-auto">
        <Reveal className="text-center mb-10">
          <p className="eyebrow-luxury mb-4">Weiterlesen</p>
          <h2 className="headline-md">{block.heading}</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 gap-4">
          {block.links.map((link, i) => (
            <Reveal key={link.href} delay={i * 0.04}>
              <Link
                href={link.href}
                className="block glass border border-stone/60 p-5 hover:border-gold/40 transition-colors group h-full"
              >
                <p className="font-display text-lg text-ink group-hover:text-gold transition-colors mb-1">
                  {link.label}
                </p>
                <p className="body-luxury text-sm opacity-60">{link.hint}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
