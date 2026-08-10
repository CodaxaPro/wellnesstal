'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { PackagePageContent } from '@/lib/landing-pages'
import { PACKAGE_SLUGS } from '@/lib/landing-pages'
import type { SiteContent } from '@/lib/content'
import { getBookingUrl, getGutscheinUrl } from '@/lib/content'

import LuxuryButton from './LuxuryButton'
import { Reveal } from './Reveal'

type Props = {
  site: SiteContent
  page: PackagePageContent
}

const serviceImages: Record<string, string> = {
  basic: '/images/services/basic.jpg',
  beauty: '/images/services/beauty.jpg',
  deluxe: '/images/services/deluxe.jpg',
}

export default function PackageLanding({ site, page }: Props) {
  const bookingUrl = getBookingUrl({ channel: 'package', slug: page.slug })
  const gutscheinUrl = getGutscheinUrl({ channel: 'package', slug: page.slug })
  const heroImage = serviceImages[page.serviceId] ?? site.media.experience

  return (
    <>
      <section className="relative min-h-[85svh] flex items-end bg-ink overflow-hidden">
        <Image src={heroImage} alt="" fill className="object-cover opacity-45" priority sizes="100vw" />
        <div className="video-overlay absolute inset-0" />
        <div className="relative z-10 w-full pb-20 md:pb-28 pt-28 md:pt-32">
          <div className="container-luxury max-w-3xl">
            <Reveal>
              <p className="eyebrow-luxury !text-gold mb-4 md:mb-6">{page.hero.eyebrow}</p>
              <h1 className="headline-hero text-ivory">{page.hero.headline}</h1>
              <p className="mt-5 md:mt-6 body-luxury !text-ivory/75 text-base md:text-lg max-w-xl">{page.hero.subline}</p>
              <p className="mt-4 md:mt-5 eyebrow-luxury !text-ivory/50">{page.hero.trust}</p>
              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4">
                <LuxuryButton href={bookingUrl}>{page.closing.cta}</LuxuryButton>
                <LuxuryButton
                  href={gutscheinUrl}
                  variant="outline"
                  className="!border-ivory/30 !text-ivory hover:!bg-ivory hover:!text-ink"
                >
                  Gutschein verschenken
                </LuxuryButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="py-6 bg-gold/10 border-b border-gold/20">
        <div className="container-luxury flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-center sm:text-left">
          <p className="font-display text-3xl text-ink">{page.price}€</p>
          <p className="body-luxury text-sm opacity-70">{page.duration} · {site.brand.address.city}</p>
        </div>
      </section>

      <section className="section-space bg-ivory">
        <div className="container-luxury grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow-luxury mb-4">{page.essence.eyebrow}</p>
            <h2 className="headline-lg">{page.essence.headline}</h2>
          </Reveal>
          <Reveal className="lg:col-span-7 space-y-6" delay={0.1}>
            {page.essence.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="body-luxury text-base md:text-lg">{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section-space bg-beige border-t border-stone/60">
        <div className="container-luxury">
          <Reveal className="max-w-2xl mx-auto text-center mb-16 md:mb-20">
            <p className="eyebrow-luxury mb-4">{page.emotions.eyebrow}</p>
            <h2 className="headline-lg">{page.emotions.headline}</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-stone">
            {page.emotions.items.map((item, i) => (
              <Reveal key={item.word} delay={i * 0.06} className="bg-beige p-10 md:p-12">
                <p className="eyebrow-luxury !text-gold mb-3">{item.word}</p>
                <h3 className="font-display text-xl md:text-2xl font-light text-ink mb-4">{item.headline}</h3>
                <p className="body-luxury text-sm md:text-base">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-ivory border-t border-stone/60">
        <div className="container-luxury grid lg:grid-cols-12 gap-12 lg:gap-20">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow-luxury mb-4">{page.includes.eyebrow}</p>
            <h2 className="headline-lg mb-8">{page.includes.headline}</h2>
            <ul className="space-y-4">
              {page.includes.items.map((item) => (
                <li key={item} className="flex gap-4 body-luxury border-l border-gold pl-6 py-1">{item}</li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <p className="eyebrow-luxury mb-4">{page.forWhom.eyebrow}</p>
            <h2 className="headline-lg mb-10">{page.forWhom.headline}</h2>
            <div className="grid sm:grid-cols-2 gap-8">
              {page.forWhom.items.map((item) => (
                <div key={item.title} className="border-l border-stone pl-6">
                  <h3 className="font-display text-lg text-ink mb-2">{item.title}</h3>
                  <p className="body-luxury text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-space bg-beige border-t border-stone/60">
        <div className="container-luxury max-w-3xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="eyebrow-luxury mb-4">{page.journey.eyebrow}</p>
            <h2 className="headline-lg">{page.journey.headline}</h2>
          </Reveal>
          <ol className="space-y-10">
            {page.journey.steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.08} className="flex gap-8 md:gap-12">
                <span className="font-display text-4xl md:text-5xl text-gold/40 shrink-0">{step.num}</span>
                <div>
                  <h3 className="font-display text-xl md:text-2xl text-ink mb-2">{step.title}</h3>
                  <p className="body-luxury">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section-space bg-ivory border-t border-stone/60">
        <div className="container-luxury">
          <Reveal className="max-w-2xl mx-auto text-center mb-14">
            <p className="eyebrow-luxury mb-4">Andere Pakete</p>
            <h2 className="headline-md">Finde deine Tiefe der Entspannung</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PACKAGE_SLUGS.filter((s) => s !== page.slug).map((slug, i) => {
              const svc = site.services.find((s) => s.id === slug)
              if (!svc) return null
              return (
                <Reveal key={slug} delay={i * 0.08}>
                  <Link href={`/headspa/${slug}`} className="group block glass border border-stone/60 p-8 hover:border-gold/40 transition-colors">
                    <h3 className="font-display text-xl text-ink group-hover:text-gold transition-colors mb-2">{svc.name}</h3>
                    <p className="font-display text-3xl text-ink mb-3">{svc.price}€</p>
                    <p className="body-luxury text-sm">{svc.duration}</p>
                    <span className="inline-block mt-6 eyebrow-luxury !text-charcoal/40 group-hover:!text-gold transition-colors">Entdecken →</span>
                  </Link>
                </Reveal>
              )
            })}
            <Reveal delay={0.16}>
              <Link href="/headspa" className="group block glass border border-stone/60 p-8 hover:border-gold/40 transition-colors h-full flex flex-col justify-center">
                <h3 className="font-display text-xl text-ink group-hover:text-gold transition-colors mb-2">Alle Pakete</h3>
                <p className="body-luxury text-sm">Head Spa Übersicht</p>
                <span className="inline-block mt-6 eyebrow-luxury !text-charcoal/40 group-hover:!text-gold transition-colors">Zur Übersicht →</span>
              </Link>
            </Reveal>
            <Reveal delay={0.2}>
              <Link href="/headspa/partner" className="group block glass border border-stone/60 p-8 hover:border-gold/40 transition-colors h-full flex flex-col justify-center">
                <h3 className="font-display text-xl text-ink group-hover:text-gold transition-colors mb-2">Zu zweit</h3>
                <p className="body-luxury text-sm">Partner-Termin ab 178€</p>
                <span className="inline-block mt-6 eyebrow-luxury !text-charcoal/40 group-hover:!text-gold transition-colors">Partner entdecken →</span>
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section-space bg-beige border-t border-stone/60">
        <div className="container-luxury max-w-3xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="eyebrow-luxury mb-4">Fragen</p>
            <h2 className="headline-lg">{page.hero.eyebrow}</h2>
          </Reveal>
          <dl className="space-y-8">
            {page.faq.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.06} className="border-b border-stone/60 pb-8 last:border-0">
                <dt className="font-display text-lg text-ink mb-3">{item.q}</dt>
                <dd className="body-luxury">{item.a}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      <section className="section-space bg-ink text-ivory">
        <div className="container-luxury max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="headline-lg text-ivory mb-6">{page.closing.headline}</h2>
            <p className="body-luxury !text-ivory/70 mb-10">{page.closing.text}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LuxuryButton href={bookingUrl}>{page.closing.cta}</LuxuryButton>
              <LuxuryButton href={gutscheinUrl} variant="outline" className="!border-ivory/30 !text-ivory hover:!bg-ivory hover:!text-ink">
                Gutschein bestellen
              </LuxuryButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
