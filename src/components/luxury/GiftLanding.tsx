'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { GiftPageContent } from '@/lib/landing-pages'
import type { SiteContent } from '@/lib/content'
import { getGutscheinUrl, getTestimonials } from '@/lib/content'
import { trackingFromPageSlug } from '@/lib/tracking'

import LuxuryButton from './LuxuryButton'
import { Reveal } from './Reveal'

type Props = {
  site: SiteContent
  page: GiftPageContent
  showOccasions?: boolean
}

export default function GiftLanding({ site, page, showOccasions = false }: Props) {
  const tracking = trackingFromPageSlug(page.slug === 'hub' ? 'gift-hub' : page.slug)
  const gutscheinUrl = getGutscheinUrl({ channel: 'gift', slug: page.slug === 'hub' ? undefined : page.slug })
  const testimonials = getTestimonials()
  const featuredReview = testimonials.items[0]

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85svh] flex items-end bg-ink overflow-hidden">
        <Image
          src={site.media.experience}
          alt=""
          fill
          className="object-cover opacity-45"
          priority
          sizes="100vw"
        />
        <div className="video-overlay absolute inset-0" />
        <div className="relative z-10 w-full pb-20 md:pb-28 pt-28 md:pt-32">
          <div className="container-luxury max-w-3xl">
            <Reveal>
              <p className="eyebrow-luxury !text-gold mb-4 md:mb-6">{page.hero.eyebrow}</p>
              <h1 className="headline-hero text-ivory">{page.hero.headline}</h1>
              <p className="mt-5 md:mt-6 body-luxury !text-ivory/75 text-base md:text-lg max-w-xl">
                {page.hero.subline}
              </p>
              <p className="mt-4 md:mt-5 eyebrow-luxury !text-ivory/50">{page.hero.trust}</p>
              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4">
                <LuxuryButton href={gutscheinUrl}>{page.closing.cta}</LuxuryButton>
                {page.secondaryCta && (
                  <LuxuryButton href={page.secondaryCta.href} variant="outline">
                    {page.secondaryCta.label}
                  </LuxuryButton>
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Essence */}
      <section id="was-du-schenkst" className="section-space bg-ivory">
        <div className="container-luxury grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow-luxury mb-4">{page.essence.eyebrow}</p>
            <h2 className="headline-lg">{page.essence.headline}</h2>
          </Reveal>
          <Reveal className="lg:col-span-7 space-y-6" delay={0.1}>
            {page.essence.paragraphs.map((p) => (
              <p key={p.slice(0, 40)} className="body-luxury text-base md:text-lg">
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </section>

      {/* Emotions */}
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

      {/* Recipients */}
      {page.recipients && (
        <section className="section-space bg-ivory border-t border-stone/60">
          <div className="container-luxury">
            <Reveal className="max-w-2xl mx-auto text-center mb-16">
              <p className="eyebrow-luxury mb-4">{page.recipients.eyebrow}</p>
              <h2 className="headline-lg">{page.recipients.headline}</h2>
            </Reveal>
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 max-w-4xl mx-auto">
              {page.recipients.items.map((item, i) => (
                <Reveal key={item.title} delay={i * 0.08} className="border-l border-gold pl-8 py-2">
                  <h3 className="font-display text-xl text-ink mb-3">{item.title}</h3>
                  <p className="body-luxury">{item.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Occasions hub grid */}
      {showOccasions && page.occasions && (
        <section className="section-space bg-beige border-t border-stone/60">
          <div className="container-luxury">
            <Reveal className="max-w-2xl mx-auto text-center mb-6">
              <p className="eyebrow-luxury mb-4">{page.occasions.eyebrow}</p>
              <h2 className="headline-lg mb-4">{page.occasions.headline}</h2>
              <p className="body-luxury">{page.occasions.intro}</p>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-14 max-w-5xl mx-auto">
              {page.occasions.items.map((item, i) => (
                <Reveal key={item.slug} delay={i * 0.05}>
                  <Link
                    href={`/gutschein/${item.slug}`}
                    className="group block glass border border-stone/60 p-8 h-full hover:border-gold/40 transition-colors"
                  >
                    <h3 className="font-display text-lg text-ink group-hover:text-gold transition-colors mb-2">
                      {item.label}
                    </h3>
                    <p className="body-luxury text-sm">{item.hint}</p>
                    <span className="inline-block mt-6 eyebrow-luxury !text-charcoal/40 group-hover:!text-gold transition-colors">
                      Entdecken →
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Journey */}
      <section className="section-space bg-ivory border-t border-stone/60">
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

      {/* Packages */}
      <section className="section-space bg-beige border-t border-stone/60">
        <div className="container-luxury">
          <Reveal className="max-w-2xl mx-auto text-center mb-14">
            <p className="eyebrow-luxury mb-4">Pakete</p>
            <h2 className="headline-lg">Wähle die Tiefe der Entspannung</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {page.partnerPackages
              ? page.partnerPackages.map((pkg, i) => (
                  <Reveal
                    key={pkg.name}
                    delay={i * 0.08}
                    className={`glass border p-8 text-center ${pkg.featured ? 'border-gold/60 ring-1 ring-gold/20' : 'border-stone/60'}`}
                  >
                    {pkg.featured && <p className="eyebrow-luxury !text-gold mb-3">Beliebt</p>}
                    <h3 className="font-display text-xl text-ink mb-2">{pkg.name}</h3>
                    <p className="font-display text-4xl text-ink mb-4">{pkg.price}€</p>
                    <p className="body-luxury text-sm mb-2">{pkg.tagline}</p>
                    <p className="body-luxury text-xs opacity-60 mb-6">{pkg.duration}</p>
                    <LuxuryButton href={gutscheinUrl} className="w-full justify-center">
                      Gutschein bestellen
                    </LuxuryButton>
                  </Reveal>
                ))
              : site.services.map((pkg, i) => (
                  <Reveal
                    key={pkg.id}
                    delay={i * 0.08}
                    className={`glass border p-8 text-center ${pkg.featured ? 'border-gold/60 ring-1 ring-gold/20' : 'border-stone/60'}`}
                  >
                    {pkg.featured && <p className="eyebrow-luxury !text-gold mb-3">Beliebt</p>}
                    <h3 className="font-display text-xl text-ink mb-2">{pkg.name}</h3>
                    <p className="font-display text-4xl text-ink mb-4">{pkg.price}€</p>
                    <p className="body-luxury text-sm mb-2">{pkg.description}</p>
                    <p className="body-luxury text-xs opacity-60 mb-6">{pkg.duration}</p>
                    <LuxuryButton href={gutscheinUrl} className="w-full justify-center">
                      Gutschein bestellen
                    </LuxuryButton>
                  </Reveal>
                ))}
          </div>
        </div>
      </section>

      {/* Review */}
      {featuredReview && (
        <section className="section-space bg-ink text-ivory">
          <div className="container-luxury max-w-3xl mx-auto text-center">
            <Reveal>
              <p className="eyebrow-luxury !text-gold mb-8">Stimmen unserer Gäste</p>
              <blockquote className="font-display text-2xl md:text-3xl font-light leading-relaxed mb-8">
                „{featuredReview.text}"
              </blockquote>
              <p className="body-luxury !text-ivory/60">
                — {featuredReview.name}
                {featuredReview.location ? `, ${featuredReview.location}` : ''}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="section-space bg-ivory border-t border-stone/60">
        <div className="container-luxury max-w-3xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="eyebrow-luxury mb-4">Fragen</p>
            <h2 className="headline-lg">Alles Wichtige zum Gutschein</h2>
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

      {page.relatedLinks && page.relatedLinks.length > 0 && (
        <section className="section-space bg-beige border-t border-stone/60">
          <div className="container-luxury max-w-4xl mx-auto">
            <Reveal className="text-center mb-12">
              <p className="eyebrow-luxury mb-4">Weiter</p>
              <h2 className="headline-md">Passende Gutscheine & Seiten</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 gap-6">
              {page.relatedLinks.map((link, i) => (
                <Reveal key={link.href} delay={i * 0.06}>
                  <Link
                    href={link.href}
                    className="group block border border-stone/60 p-6 hover:border-gold/40 transition-colors h-full"
                  >
                    <h3 className="font-display text-lg text-ink group-hover:text-gold transition-colors mb-2">
                      {link.label}
                    </h3>
                    <p className="body-luxury text-sm">{link.hint}</p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Closing */}
      <section className="section-space bg-beige border-t border-stone/60">
        <div className="container-luxury max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="headline-lg mb-6">{page.closing.headline}</h2>
            <p className="body-luxury mb-10">{page.closing.text}</p>
            <LuxuryButton href={gutscheinUrl}>{page.closing.cta}</LuxuryButton>
            {page.secondaryCta && (
              <div className="mt-6">
                <LuxuryButton href={page.secondaryCta.href} variant="outline">
                  {page.secondaryCta.label}
                </LuxuryButton>
                {page.secondaryCta.text && (
                  <p className="body-luxury text-sm opacity-60 mt-4 max-w-md mx-auto">{page.secondaryCta.text}</p>
                )}
              </div>
            )}
            <p className="body-luxury text-sm opacity-60 mt-8 max-w-md mx-auto">
              Du wirst zu unserem sicheren Gutschein-Shop auf treuepay.de weitergeleitet.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
