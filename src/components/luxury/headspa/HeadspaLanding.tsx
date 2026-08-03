'use client'

import Image from 'next/image'

import type { HeadspaContent } from '@/lib/content'
import type { SiteContent } from '@/lib/content'

import LuxuryButton from '../LuxuryButton'
import BookingPanel from '../BookingPanel'
import TestimonialsCarousel from '../TestimonialsCarousel'
import { getTestimonials } from '@/lib/content'
import { Reveal } from '../Reveal'

type Props = { site: SiteContent; headspa: HeadspaContent }

const phaseImages = [
  '/images/services/basic.jpg',
  '/images/ritual-poster.jpg',
  '/images/services/deluxe.jpg',
  '/images/services/beauty.jpg',
]

export default function HeadspaLanding({ site, headspa }: Props) {
  const { brand, media } = site
  const testimonials = getTestimonials()
  const serviceImages: Record<string, string> = Object.fromEntries(
    site.services.map((s) => [s.id, s.image]),
  )

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90svh] flex items-end bg-ink overflow-hidden">
        <Image src={media.heroPoster} alt="" fill className="object-cover opacity-50" priority sizes="100vw" />
        <div className="video-overlay absolute inset-0" />
        <div className="relative z-10 w-full pb-20 md:pb-28 pt-28 md:pt-32">
          <div className="container-luxury max-w-3xl">
            <Reveal>
              <p className="eyebrow-luxury !text-gold mb-4 md:mb-6">{headspa.hero.eyebrow}</p>
              <h1 className="headline-hero text-ivory">{headspa.hero.title}</h1>
              <p className="mt-5 md:mt-6 body-luxury !text-ivory/75 text-base md:text-lg max-w-xl">{headspa.hero.subtitle}</p>
              <p className="mt-4 md:mt-5 eyebrow-luxury !text-ivory/50">{headspa.hero.trust}</p>
              <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-4">
                <LuxuryButton href={brand.bookingUrl}>{headspa.hero.ctaPrimary}</LuxuryButton>
                <LuxuryButton href="#ablauf" variant="outline" className="!border-ivory/30 !text-ivory hover:!bg-ivory hover:!text-ink">
                  {headspa.hero.ctaSecondary}
                </LuxuryButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pain */}
      <section className="section-space bg-ivory">
        <div className="container-luxury grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow-luxury mb-4">{headspa.pain.eyebrow}</p>
            <h2 className="headline-lg">{headspa.pain.headline}</h2>
          </Reveal>
          <Reveal className="lg:col-span-7 space-y-6" delay={0.1}>
            {headspa.pain.paragraphs.map((p) => (
              <p key={p} className="body-luxury text-base md:text-lg">{p}</p>
            ))}
            <p className="font-display text-2xl md:text-3xl font-light text-ink pt-4">{headspa.pain.closing}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-space bg-beige">
        <div className="container-luxury">
          <Reveal className="max-w-3xl mx-auto text-center mb-20">
            <p className="eyebrow-luxury mb-4">{headspa.promise.eyebrow}</p>
            <h2 className="headline-lg mb-8">{headspa.promise.headline}</h2>
            <p className="body-luxury text-base md:text-lg">{headspa.promise.text}</p>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-px bg-stone">
            {headspa.stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.08} className="bg-beige p-12 text-center">
                <p className="font-display text-5xl md:text-6xl text-ink mb-3">{s.value}</p>
                <p className="eyebrow-luxury !text-charcoal/60">{s.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Personalization — pattern from Aoyama, Esthetique, Haru (18/50 sites) */}
      <section className="section-space bg-ivory border-t border-stone/60">
        <div className="container-luxury grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <Reveal className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-stone">
              <Image src={media.experience} alt="Personalisiertes Head Spa Ritual" fill className="object-cover" sizes="40vw" />
            </div>
          </Reveal>
          <Reveal className="lg:col-span-7" delay={0.1}>
            <p className="eyebrow-luxury mb-4">{headspa.personalization.eyebrow}</p>
            <h2 className="headline-lg mb-6">{headspa.personalization.headline}</h2>
            <p className="body-luxury text-base md:text-lg mb-10">{headspa.personalization.text}</p>
            <ul className="space-y-4">
              {headspa.personalization.points.map((point) => (
                <li key={point} className="flex gap-4 body-luxury border-l border-gold pl-6 py-1">
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* First visit — reduces intangibility anxiety */}
      <section className="section-space bg-beige border-t border-stone/60">
        <div className="container-luxury max-w-3xl mx-auto">
          <Reveal className="text-center mb-16">
            <p className="eyebrow-luxury mb-4">{headspa.firstVisit.eyebrow}</p>
            <h2 className="headline-lg">{headspa.firstVisit.headline}</h2>
          </Reveal>
          <ol className="space-y-8">
            {headspa.firstVisit.steps.map((step, i) => (
              <Reveal key={step} delay={i * 0.06}>
                <li className="flex gap-6 items-start">
                  <span className="font-display text-3xl text-gold/50 shrink-0 w-10">{String(i + 1).padStart(2, '0')}</span>
                  <p className="body-luxury text-base md:text-lg pt-1">{step}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* Phases */}
      <section id="ablauf" className="section-space bg-ivory">
        <div className="container-luxury">
          <Reveal className="max-w-2xl mb-20">
            <p className="eyebrow-luxury mb-4">{headspa.phases.eyebrow}</p>
            <h2 className="headline-lg mb-6">{headspa.phases.headline}</h2>
            <p className="body-luxury">{headspa.phases.intro}</p>
          </Reveal>
          <div className="space-y-24 md:space-y-32">
            {headspa.phases.items.map((phase, i) => (
              <Reveal key={phase.num}>
                <div className={`grid lg:grid-cols-12 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? '' : ''}`}>
                  <div className={`lg:col-span-5 ${i % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                      <Image src={phaseImages[i] ?? media.experience} alt={phase.title} fill className="object-cover" sizes="(max-width:1024px) 100vw, 40vw" />
                    </div>
                  </div>
                  <div className={`lg:col-span-7 ${i % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <span className="font-display text-5xl text-gold/40">{phase.num}</span>
                    <h3 className="headline-md mt-4 mb-6">{phase.title}</h3>
                    <p className="body-luxury text-base md:text-lg mb-8">{phase.text}</p>
                    <ul className="space-y-3">
                      {phase.benefits.map((b) => (
                        <li key={b} className="flex gap-3 body-luxury text-sm md:text-base">
                          <span className="text-gold shrink-0">—</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="section-space bg-ink text-ivory">
        <div className="container-luxury">
          <Reveal className="text-center max-w-2xl mx-auto mb-20">
            <p className="eyebrow-luxury !text-gold mb-4">{headspa.outcomes.eyebrow}</p>
            <h2 className="headline-lg text-ivory">{headspa.outcomes.headline}</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-ivory/10">
            {headspa.outcomes.items.map((item, i) => (
              <Reveal key={item.title} delay={i * 0.06} className="bg-ink p-10 md:p-12">
                <h3 className="headline-md text-lg text-ivory mb-4">{item.title}</h3>
                <p className="body-luxury !text-ivory/65">{item.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="pakete" className="section-space bg-beige">
        <div className="container-luxury">
          <Reveal className="max-w-2xl mb-16">
            <p className="eyebrow-luxury mb-4">{headspa.packages.eyebrow}</p>
            <h2 className="headline-lg mb-6">{headspa.packages.headline}</h2>
            <p className="body-luxury">{headspa.packages.intro}</p>
          </Reveal>

          <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
            {headspa.packages.items.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 0.1}>
                <article
                  className={`card-depth flex h-full flex-col border bg-stone/20 p-8 md:p-10 ${
                    pkg.featured ? 'border-gold/50 lg:-mt-4' : 'border-stone/80'
                  }`}
                >
                  {pkg.featured && (
                    <span className="eyebrow-luxury bg-ink text-ivory px-4 py-2 self-start mb-6">Beliebt</span>
                  )}
                  <div className="relative aspect-[4/3] overflow-hidden mb-8 -mx-2 md:-mx-4">
                    <Image
                      src={serviceImages[pkg.id] ?? media.experience}
                      alt={pkg.name}
                      fill
                      className="object-cover"
                      sizes="33vw"
                    />
                  </div>
                  <p className="eyebrow-luxury mb-2">{pkg.duration}</p>
                  <h3 className="headline-md mb-3">{pkg.name}</h3>
                  <p className="body-luxury mb-6">{pkg.tagline}</p>
                  <p className="font-display text-4xl text-ink mb-8">
                    {pkg.price}<span className="text-xl"> €</span>
                  </p>
                  <ul className="space-y-3 mb-10 flex-1">
                    {pkg.includes.map((inc) => (
                      <li key={inc} className="flex gap-3 body-luxury text-sm">
                        <span className="text-gold shrink-0">✓</span>
                        {inc}
                      </li>
                    ))}
                  </ul>
                  <LuxuryButton href={brand.bookingUrl}>Jetzt buchen</LuxuryButton>
                </article>
              </Reveal>
            ))}
          </div>

          {/* Partner */}
          <Reveal className="mt-24 md:mt-32 pt-16 border-t border-stone">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              <div>
                <p className="eyebrow-luxury mb-4">{headspa.packages.partner.eyebrow}</p>
                <h3 className="headline-md mb-4">{headspa.packages.partner.headline}</h3>
                <p className="body-luxury mb-4">{headspa.packages.partner.text}</p>
                <p className="body-luxury text-sm opacity-70">{headspa.packages.partner.note}</p>
                <div className="mt-8">
                  <LuxuryButton href={headspa.packages.partner.whatsapp}>WhatsApp Kontakt</LuxuryButton>
                </div>
              </div>
              <div className="space-y-4">
                {headspa.packages.partner.items.map((p) => (
                  <div key={p.name} className="flex justify-between items-baseline gap-4 py-6 border-b border-stone">
                    <div>
                      <p className="headline-md text-lg">{p.name}</p>
                      <p className="body-luxury text-sm">{p.duration}</p>
                    </div>
                    <p className="font-display text-3xl text-ink shrink-0">{p.price} €</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Video */}
      <section className="section-space bg-ivory overflow-hidden">
        <div className="container-luxury grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <p className="eyebrow-luxury mb-4">{headspa.experience.eyebrow}</p>
            <h2 className="headline-lg mb-6">{headspa.experience.headline}</h2>
            <p className="body-luxury">{headspa.experience.text}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[9/16] max-w-md mx-auto lg:ml-auto overflow-hidden bg-ink shadow-2xl">
              <video autoPlay muted loop playsInline poster={media.ritualPoster} className="h-full w-full object-cover">
                <source src={media.ritualVideo} type="video/mp4" />
              </video>
              <div className="video-overlay absolute inset-0 opacity-40" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Expertise — founder/trust pattern Royal, Aoyama */}
      <section className="section-space bg-ink text-ivory">
        <div className="container-luxury grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          <Reveal className="lg:col-span-6">
            <p className="eyebrow-luxury !text-gold mb-4">{headspa.expertise.eyebrow}</p>
            <h2 className="headline-lg text-ivory mb-6">{headspa.expertise.headline}</h2>
            {'name' in headspa.expertise && headspa.expertise.name ? (
              <p className="font-display text-2xl text-ivory mb-2">{headspa.expertise.name}</p>
            ) : 'teamLabel' in headspa.expertise && headspa.expertise.teamLabel ? (
              <p className="font-display text-2xl text-ivory mb-2">{headspa.expertise.teamLabel}</p>
            ) : null}
            {'role' in headspa.expertise && headspa.expertise.role ? (
              <p className="eyebrow-luxury !text-ivory/50 mb-8">{headspa.expertise.role}</p>
            ) : null}
            <p className="body-luxury !text-ivory/70 text-base md:text-lg mb-10">{headspa.expertise.text}</p>
            <ul className="space-y-5">
              {headspa.expertise.points.map((point) => (
                <li key={point} className="flex gap-4 body-luxury !text-ivory/80">
                  <span className="text-gold shrink-0">✓</span>
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="lg:col-span-6" delay={0.1}>
            <div className="relative aspect-[4/5] overflow-hidden">
              <Image
                src={'image' in headspa.expertise && headspa.expertise.image ? headspa.expertise.image : media.ritualPoster}
                alt="Wellnesstal Head Spa Studio"
                fill
                className="object-cover"
                sizes="50vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="section-space bg-beige">
        <div className="container-luxury">
          <Reveal className="mb-6">
            <p className="eyebrow-luxury mb-4">{testimonials.eyebrow}</p>
            <h2 className="headline-lg">{testimonials.headline}</h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="eyebrow-luxury !text-charcoal/50 mb-4">{testimonials.rating}</p>
          </Reveal>
          <TestimonialsCarousel
            data={testimonials}
            reviewsUrl={site.reviews.url}
            reviewsCta={site.reviews.cta}
            theme="light"
          />
        </div>
      </section>

      {/* Gift */}
      <section className="section-space bg-stone">
        <div className="container-luxury text-center max-w-2xl mx-auto">
          <Reveal>
            <p className="eyebrow-luxury mb-4">{headspa.gift.eyebrow}</p>
            <h2 className="headline-lg mb-6">{headspa.gift.headline}</h2>
            <p className="body-luxury mb-10">{headspa.gift.text}</p>
            <LuxuryButton href="/gutschein">{headspa.gift.cta}</LuxuryButton>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section-space bg-ivory">
        <div className="container-luxury max-w-3xl">
          <Reveal className="mb-16 text-center">
            <p className="eyebrow-luxury mb-4">{headspa.faq.eyebrow}</p>
            <h2 className="headline-lg">{headspa.faq.headline}</h2>
          </Reveal>
          <dl>
            {headspa.faq.items.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.05}>
                <div className="py-8 border-t border-stone">
                  <dt className="headline-md text-lg mb-3">{item.q}</dt>
                  <dd className="body-luxury">{item.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="section-space bg-ink">
        <div className="container-luxury text-center max-w-2xl mx-auto">
          <Reveal>
            <p className="eyebrow-luxury !text-gold mb-4">{headspa.closing.eyebrow}</p>
            <h2 className="headline-lg text-ivory mb-6">{headspa.closing.headline}</h2>
            <p className="body-luxury !text-ivory/60 mb-12">{headspa.closing.text}</p>
            <LuxuryButton href={brand.bookingUrl}>{headspa.closing.cta}</LuxuryButton>
          </Reveal>
        </div>
      </section>

      {/* Booking */}
      <section id="buchung" className="section-space bg-beige pb-32">
        <div className="container-luxury">
          <Reveal className="text-center mb-12">
            <p className="eyebrow-luxury mb-4">{headspa.booking.eyebrow}</p>
            <h2 className="headline-lg">{headspa.booking.headline}</h2>
            <p className="body-luxury mt-4">{brand.address.street}, {brand.address.postalCode} {brand.address.city}</p>
            <p className="body-luxury mt-3 text-sm opacity-70">{headspa.booking.microcopy}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <BookingPanel site={site} theme="light" />
          </Reveal>
        </div>
      </section>

      {/* Local SEO — pattern Royal, House of Headspa (19/50) */}
      <section className="py-16 bg-stone/50 border-t border-stone">
        <div className="container-luxury text-center">
          <p className="eyebrow-luxury mb-6">{headspa.localSeo.headline}</p>
          <p className="body-luxury text-sm max-w-3xl mx-auto leading-loose opacity-80">
            {headspa.localSeo.cities.join(' · ')}
          </p>
        </div>
      </section>
    </>
  )
}
