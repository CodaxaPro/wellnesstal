'use client'

import type { EeatBlock as EeatContent } from '@/lib/money-page-types'

import { Reveal } from './Reveal'

export default function EeatBlock({ block }: { block: EeatContent }) {
  return (
    <section className="section-space bg-stone/40 border-y border-stone/60">
      <div className="container-luxury max-w-3xl">
        <Reveal>
          <p className="eyebrow-luxury mb-4">Expertise & Vertrauen</p>
          <h2 className="headline-md mb-8">{block.heading}</h2>
          <div className="space-y-5 mb-10">
            {block.paragraphs.map((p) => (
              <p key={p.slice(0, 48)} className="body-luxury text-base md:text-lg leading-relaxed">
                {p}
              </p>
            ))}
          </div>
          <dl className="grid sm:grid-cols-2 gap-6">
            {block.credentials.map((c) => (
              <div key={c.label} className="glass border border-stone/60 p-5">
                <dt className="eyebrow-luxury !text-gold mb-2">{c.label}</dt>
                <dd className="body-luxury text-sm">{c.text}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
