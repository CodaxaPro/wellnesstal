'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { LocationPageContent, RelatedLink } from '@/lib/landing-pages'
import type { SiteContent } from '@/lib/content'
import { getBookingUrl, getGutscheinUrl } from '@/lib/content'
import type { LongFormOverlay } from '@/lib/money-page-types'
import { trackingFromPageSlug } from '@/lib/tracking'

import LongFormMoneySections from './LongFormMoneySections'
import LuxuryButton from './LuxuryButton'
import { Reveal } from './Reveal'

type Props = {
  site: SiteContent
  page: LocationPageContent
  relatedLinks?: RelatedLink[]
  /** SEO money-page article — replaces thin essence/emotions on intent URLs only */
  longForm?: LongFormOverlay
}

export default function LocationLanding({ site, page, relatedLinks, longForm }: Props) {
  const tracking = trackingFromPageSlug(page.slug)
  const bookingUrl = getBookingUrl(tracking)
  const gutscheinUrl = getGutscheinUrl(
    page.slug.startsWith('geschenk-') ? tracking : { channel: 'gift', slug: page.slug },
  )
  const primaryCtaUrl = page.slug.startsWith('geschenk-') ? gutscheinUrl : bookingUrl
  const faq = longForm?.faqExtensions?.length
    ? [...page.faq, ...longForm.faqExtensions]
    : page.faq

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[85svh] flex items-end bg-ink overflow-hidden">
        <Image
          src={site.media.location}
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
                <LuxuryButton href={primaryCtaUrl}>{page.closing.cta}</LuxuryButton>
                <LuxuryButton
                  href="#ritual"
                  variant="outline"
                  className="!border-ivory/30 !text-ivory hover:!bg-ivory hover:!text-ink"
                >
                  {longForm ? 'Mehr erfahren' : 'Ritual entdecken'}
                </LuxuryButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Local strip */}
      <section className="py-6 bg-gold/10 border-b border-gold/20">
        <div className="container-luxury flex flex-col md:flex-row md:items-center justify-between gap-4 text-center md:text-left">
          <p className="body-luxury text-sm">
            <span className="font-medium text-ink">{page.city}</span>
            <span className="opacity-60"> · {page.distance}</span>
          </p>
          <p className="body-luxury text-sm opacity-70">
            {site.brand.address.street}, {site.brand.address.postalCode} {site.brand.address.city}
          </p>
        </div>
      </section>

      {longForm ? (
        <LongFormMoneySections
          longForm={longForm}
          bookingUrl={bookingUrl}
          gutscheinUrl={gutscheinUrl}
          sectionId="ritual"
        />
      ) : (
        <>
          {/* Essence */}
          <section id="ritual" className="section-space bg-ivory">
            <div className="container-luxury grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
              <Reveal className="lg:col-span-5">
                <div className="relative aspect-[4/5] overflow-hidden bg-stone">
                  <Image
                    src={site.media.experience}
                    alt={`Head Spa ${page.city}`}
                    fill
                    className="object-cover"
                    sizes="40vw"
                  />
                </div>
              </Reveal>
              <Reveal className="lg:col-span-7" delay={0.1}>
                <p className="eyebrow-luxury mb-4">{page.essence.eyebrow}</p>
                <h2 className="headline-lg mb-8">{page.essence.headline}</h2>
                <div className="space-y-6">
                  {page.essence.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)} className="body-luxury text-base md:text-lg">
                      {p}
                    </p>
                  ))}
                </div>
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
        </>
      )}

      {/* Local proof */}
      <section className="section-space bg-ink text-ivory">
        <div className="container-luxury">
          <Reveal className="max-w-2xl mx-auto text-center mb-14">
            <p className="eyebrow-luxury !text-gold mb-4">{page.localProof.eyebrow}</p>
            <h2 className="headline-lg text-ivory">{page.localProof.headline}</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {page.localProof.quotes.map((quote, i) => (
              <Reveal key={quote.name} delay={i * 0.08} className="border border-ivory/10 p-10">
                <blockquote className="font-display text-xl font-light leading-relaxed mb-6">
                  „{quote.text}"
                </blockquote>
                <p className="body-luxury !text-ivory/50 text-sm">
                  — {quote.name}, {quote.location}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

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
            <h2 className="headline-lg">Head Spa in {page.city} — dein Ritual</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {site.services.map((pkg, i) => (
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
                <LuxuryButton href={bookingUrl} className="w-full justify-center">
                  Termin buchen
                </LuxuryButton>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Nearby + gift crosslink */}
      <section className="section-space bg-ivory border-t border-stone/60">
        <div className="container-luxury max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="eyebrow-luxury mb-4">Region</p>
            <h2 className="headline-md mb-6">Gut erreichbar aus der gesamten Region</h2>
            <p className="body-luxury mb-8">
              {page.nearby.join(' · ')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LuxuryButton href={bookingUrl}>Wunschtermin finden</LuxuryButton>
              <LuxuryButton href={gutscheinUrl} variant="outline">
                Gutschein verschenken
              </LuxuryButton>
            </div>
            <p className="mt-10 body-luxury text-sm">
              Mehr über Head Spa:{' '}
              <Link href="/headspa" className="underline hover:text-gold transition-colors">
                Ritual entdecken
              </Link>
            </p>
          </Reveal>
        </div>
      </section>

      {relatedLinks && relatedLinks.length > 0 && !longForm?.internalLinks?.links?.length && (
        <section className="section-space bg-beige border-t border-stone/60">
          <div className="container-luxury max-w-4xl mx-auto">
            <Reveal className="text-center mb-12">
              <p className="eyebrow-luxury mb-4">Mehr entdecken</p>
              <h2 className="headline-md">Passend zu {page.city}</h2>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {relatedLinks.map((link, i) => (
                <Reveal key={link.href} delay={i * 0.05}>
                  <Link
                    href={link.href}
                    className="block glass border border-stone/60 p-6 hover:border-gold/40 transition-colors group"
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
      )}

      {/* FAQ */}
      <section className="section-space bg-beige border-t border-stone/60">
        <div className="container-luxury max-w-3xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="eyebrow-luxury mb-4">Fragen</p>
            <h2 className="headline-lg">
              {longForm ? page.hero.eyebrow : `Head Spa ${page.city}`}
            </h2>
          </Reveal>
          <dl className="space-y-8">
            {faq.map((item, i) => (
              <Reveal key={item.q} delay={i * 0.06} className="border-b border-stone/60 pb-8 last:border-0">
                <dt className="font-display text-lg text-ink mb-3">{item.q}</dt>
                <dd className="body-luxury">{item.a}</dd>
              </Reveal>
            ))}
          </dl>
        </div>
      </section>

      {/* Closing */}
      <section className="section-space bg-ink text-ivory">
        <div className="container-luxury max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="headline-lg text-ivory mb-6">{page.closing.headline}</h2>
            <p className="body-luxury !text-ivory/70 mb-10">{page.closing.text}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LuxuryButton href={bookingUrl}>{page.closing.cta}</LuxuryButton>
              <LuxuryButton
                href={gutscheinUrl}
                variant="outline"
                className="!border-ivory/30 !text-ivory hover:!bg-ivory hover:!text-ink"
              >
                Gutschein verschenken
              </LuxuryButton>
            </div>
            <p className="body-luxury !text-ivory/40 text-sm mt-8">
              {site.brand.address.street} · {site.brand.address.postalCode} {site.brand.address.city}
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
