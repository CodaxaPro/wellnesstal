'use client'

import Image from 'next/image'
import Link from 'next/link'

import type { SiteContent } from '@/lib/content'
import { getTestimonials } from '@/lib/content'
import { INTENT_BY_TYPE, LOCAL_SEO_LINKS } from '@/lib/landing-pages'

import BookingPanel from './BookingPanel'
import LuxuryButton from './LuxuryButton'
import ServiceCard from './ServiceCard'
import TestimonialsCarousel from './TestimonialsCarousel'
import { Reveal } from './Reveal'

export function ExperienceSection({ site }: { site: SiteContent }) {
  const { experience, media } = site
  return (
    <section id="experience" className="section-space bg-ivory">
      <div className="container-luxury grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
        <Reveal className="lg:col-span-5 lg:sticky lg:top-32">
          <div className="line-luxury mb-8" />
          <p className="eyebrow-luxury mb-4">{experience.title}</p>
          <h2 className="headline-lg">{experience.headline}</h2>
        </Reveal>
        <div className="lg:col-span-7 space-y-10">
          <Reveal delay={0.05}>
            <div className="relative aspect-[16/11] overflow-hidden bg-stone">
              <Image
                src={media.experience}
                alt="Wellnesstal Studio — japanisches Head Spa"
                fill
                className="object-cover"
                sizes="(max-width:1024px) 100vw, 50vw"
              />
            </div>
          </Reveal>
          {experience.paragraphs.map((p, i) => (
            <Reveal key={p} delay={0.1 + i * 0.1}>
              <p className="body-luxury text-base md:text-lg">{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function BenefitsSection({ site }: { site: SiteContent }) {
  return (
    <section id="benefits" className="section-space bg-beige">
      <div className="container-luxury">
        <Reveal className="text-center max-w-2xl mx-auto mb-20">
          <p className="eyebrow-luxury mb-4">Vorteile</p>
          <h2 className="headline-lg">Mehr als Entspannung</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-stone">
          {site.benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.08} className="bg-beige p-10 md:p-12">
              <span className="font-display text-4xl text-gold/40">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="headline-md mt-6 mb-4">{b.title}</h3>
              <p className="body-luxury">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PainSection({ site }: { site: SiteContent }) {
  const { pain } = site
  return (
    <section id="pain" className="section-space bg-beige border-t border-stone/60">
      <div className="container-luxury grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow-luxury mb-4">{pain.eyebrow}</p>
          <h2 className="headline-lg">{pain.headline}</h2>
        </Reveal>
        <Reveal className="lg:col-span-7 space-y-6" delay={0.1}>
          {pain.paragraphs.map((p) => (
            <p key={p} className="body-luxury text-base md:text-lg">{p}</p>
          ))}
          <p className="font-display text-2xl md:text-3xl font-light text-ink pt-4">{pain.closing}</p>
          <div className="pt-6">
            <LuxuryButton href={pain.ctaHref}>{pain.cta}</LuxuryButton>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function ExpertSection({ site }: { site: SiteContent }) {
  const { expert, media } = site
  const imageSrc = media.team ?? media.experience
  const displayName = expert.name || expert.teamLabel

  return (
    <section id="expert" className="section-space bg-ink text-ivory">
      <div className="container-luxury grid lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        <Reveal className="lg:col-span-6">
          <p className="eyebrow-luxury !text-gold mb-4">{expert.eyebrow}</p>
          <h2 className="headline-lg text-ivory mb-6">{expert.headline}</h2>
          {displayName ? (
            <p className="font-display text-2xl text-ivory mb-2">{displayName}</p>
          ) : null}
          {expert.role ? (
            <p className="eyebrow-luxury !text-ivory/50 mb-8">{expert.role}</p>
          ) : null}
          <p className="body-luxury !text-ivory/70 text-base md:text-lg mb-10">{expert.text}</p>
          <ul className="space-y-5">
            {expert.points.map((point) => (
              <li key={point} className="flex gap-4 body-luxury !text-ivory/80">
                <span className="text-gold shrink-0">✓</span>
                {point}
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal className="lg:col-span-6" delay={0.1}>
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src={imageSrc} alt="Wellnesstal Head Spa Team" fill className="object-cover" sizes="50vw" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function ServicesSection({ site }: { site: SiteContent }) {
  return (
    <section id="services" className="section-space bg-ivory">
      <div className="container-luxury">
        <Reveal className="mb-20">
          <p className="eyebrow-luxury mb-4">Behandlungen</p>
          <h2 className="headline-lg">Wähle dein Ritual</h2>
        </Reveal>
        <div className="grid lg:grid-cols-3 gap-8 lg:gap-6">
          {site.services.map((svc, i) => (
            <Reveal key={svc.id} delay={i * 0.12}>
              <ServiceCard service={svc} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProductsSection({ site }: { site: SiteContent }) {
  return (
    <section id="products" className="section-space bg-ivory">
      <div className="container-luxury grid lg:grid-cols-2 gap-16 items-center">
        <Reveal>
          <p className="eyebrow-luxury mb-4">{site.products.title}</p>
          <h2 className="headline-lg mb-8">Handverlesene Marken</h2>
          <p className="body-luxury max-w-md">Nur Produkte, die unseren Standards entsprechen — im Studio und für deine Pflege zuhause.</p>
        </Reveal>
        <div className="space-y-8">
          {site.products.brands.map((b, i) => (
            <Reveal key={b.name} delay={i * 0.1} className="border-l border-gold pl-8 py-4">
              <h3 className="headline-md mb-2">{b.name}</h3>
              <p className="body-luxury">{b.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function GiftSection({ site }: { site: SiteContent }) {
  const occasions = [
    { href: '/gutschein/online', label: 'Online' },
    { href: '/gutschein/kopfmassage', label: 'Kopfmassage' },
    { href: '/gutschein/geschenkidee', label: 'Geschenkidee' },
    { href: '/gutschein/fuer-mama', label: 'Für Mama' },
    { href: '/gutschein/fuer-papa', label: 'Für Papa' },
    { href: '/gutschein/last-minute', label: 'Last Minute' },
    { href: '/gutschein/danke', label: 'Danke sagen' },
    { href: '/gutschein/hochzeit', label: 'Hochzeit' },
    { href: '/gutschein/silberhochzeit', label: 'Silberhochzeit' },
    { href: '/gutschein/jubilaeum', label: 'Jubiläum' },
    { href: '/gutschein/abschied', label: 'Abschied' },
    { href: '/gutschein/firmen-geschenk', label: 'Firma' },
    { href: '/gutschein/team-geschenk', label: 'Team' },
    { href: '/gutschein/muttertag', label: 'Muttertag' },
    { href: '/gutschein/geburtstag', label: 'Geburtstag' },
    { href: '/gutschein/freundin', label: 'Freundin' },
    { href: '/gutschein/vatertag', label: 'Vatertag' },
    { href: '/gutschein/weihnachten', label: 'Weihnachten' },
    { href: '/gutschein/nikolaus', label: 'Nikolaus' },
    { href: '/gutschein/wellness-nrw', label: 'Wellness NRW' },
  ]

  return (
    <section id="gift" className="section-space bg-stone">
      <div className="container-luxury text-center max-w-2xl mx-auto">
        <Reveal>
          <p className="eyebrow-luxury mb-4">Geschenk</p>
          <h2 className="headline-lg mb-6">Verschenke Stille — nicht Dinge</h2>
          <p className="body-luxury mb-10">
            Berührung, Ruhe, Reinheit. Ein Gutschein für unser Head Spa Ritual — das bedeutungsvollste Geschenk der Entspannung.
          </p>
          <LuxuryButton href="/gutschein">Gutschein bestellen</LuxuryButton>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-10">
            {occasions.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="body-luxury text-sm underline underline-offset-4 opacity-70 hover:opacity-100 hover:text-gold transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

export function TestimonialsSection({ site }: { site: SiteContent }) {
  const { reviews } = site
  const testimonials = getTestimonials()
  return (
    <section id="testimonials" className="section-space bg-ivory">
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
          reviewsUrl={reviews.url}
          reviewsCta={reviews.cta}
          theme="ivory"
        />
      </div>
    </section>
  )
}

export function FaqSection({ site }: { site: SiteContent }) {
  return (
    <section id="faq" className="section-space bg-beige">
      <div className="container-luxury max-w-3xl">
        <Reveal className="mb-16 text-center">
          <p className="eyebrow-luxury mb-4">FAQ</p>
          <h2 className="headline-lg">Häufige Fragen</h2>
        </Reveal>
        <dl className="space-y-0">
          {site.faq.map((item, i) => (
            <Reveal key={item.q} delay={i * 0.06}>
              <div className="py-8 border-t border-stone">
                <dt className="headline-md text-lg mb-3">{item.q}</dt>
                <dd className="body-luxury">{item.a}</dd>
              </div>
            </Reveal>
          ))}
        </dl>
        {'faqMore' in site && site.faqMore ? (
          <Reveal delay={0.2} className="mt-12 text-center">
            <Link href={site.faqMore.href} className="body-luxury hover:text-gold transition-colors underline underline-offset-4">
              {site.faqMore.text}
            </Link>
          </Reveal>
        ) : null}
      </div>
    </section>
  )
}

export function InstagramSection({ site }: { site: SiteContent }) {
  return (
    <section id="instagram" className="section-space bg-ivory">
      <div className="container-luxury text-center">
        <Reveal>
          <p className="eyebrow-luxury mb-4">Instagram</p>
          <h2 className="headline-lg mb-6">{site.instagram.handle}</h2>
          <Link href={site.instagram.url} target="_blank" rel="noopener noreferrer" className="body-luxury hover:text-gold transition-colors">
            Folge unserer Reise
          </Link>
        </Reveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-16">
          {site.media.instagram.map((src, i) => (
            <Reveal key={src} delay={i * 0.05} className="group aspect-square relative bg-stone overflow-hidden">
              <Image
                src={src}
                alt={`Wellnesstal Instagram ${i + 1}`}
                fill
                className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-105"
                sizes="25vw"
              />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function LocationSection({ site }: { site: SiteContent }) {
  const { brand } = site
  return (
    <section id="location" className="section-space bg-stone">
      <div className="container-luxury grid lg:grid-cols-2 gap-16">
        <Reveal>
          <p className="eyebrow-luxury mb-4">Standort</p>
          <h2 className="headline-lg mb-8">Dein privates Refugium</h2>
          <address className="body-luxury not-italic space-y-2 mb-8">
            <p>{brand.address.street}</p>
            <p>{brand.address.postalCode} {brand.address.city}</p>
          </address>
          <p className="body-luxury space-y-1 mb-8">
            <a href={brand.phoneHref} className="hover:text-gold transition-colors">{brand.phone}</a>
            <br />
            <a href={`mailto:${brand.email}`} className="hover:text-gold transition-colors">{brand.email}</a>
          </p>
          <p className="body-luxury text-sm opacity-70">
            {brand.hours.weekdays}<br />{brand.hours.saturday}<br />{brand.hours.sunday}
          </p>
          <div className="mt-10">
            <LuxuryButton href={brand.mapsUrl}>Route planen</LuxuryButton>
          </div>
        </Reveal>
        <Reveal delay={0.15} className="relative aspect-[4/3] bg-ink/5 overflow-hidden">
          <Image src={site.media.location} alt="Wellnesstal Studio Baesweiler" fill className="object-cover" sizes="50vw" />
        </Reveal>
      </div>
    </section>
  )
}

export function BookingSection({ site }: { site: SiteContent }) {
  return (
    <section id="booking" className="section-space bg-ink">
      <div className="container-luxury">
        <Reveal className="text-center mb-16 max-w-2xl mx-auto">
          <p className="eyebrow-luxury !text-gold mb-4">Reservierung</p>
          <h2 className="headline-lg text-ivory mb-4">Dein Termin</h2>
          <p className="body-luxury !text-ivory/60">Wähle dein Ritual — Verfügbarkeit wird sofort angezeigt.</p>
        </Reveal>
        <Reveal delay={0.1}>
          <BookingPanel site={site} theme="dark" />
        </Reveal>
      </div>
    </section>
  )
}

export function LocalSeoSection({ site }: { site: SiteContent }) {
  if (!('localSeo' in site) || !site.localSeo) return null
  return (
    <section className="py-16 bg-beige/50 border-t border-stone/60">
      <div className="container-luxury text-center">
        <p className="eyebrow-luxury mb-6">{site.localSeo.headline}</p>
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-3 mb-8">
          {LOCAL_SEO_LINKS.map((city) => (
            <Link
              key={city.slug}
              href={`/head-spa-${city.slug}`}
              className="body-luxury text-sm underline underline-offset-4 opacity-80 hover:opacity-100 hover:text-gold transition-colors"
            >
              Head Spa {city.label}
            </Link>
          ))}
        </div>
        <p className="body-luxury text-sm max-w-3xl mx-auto leading-loose opacity-60">
          {site.localSeo.cities.join(' · ')}
        </p>
        <div className="mt-12 max-w-4xl mx-auto">
          <p className="eyebrow-luxury !text-charcoal/50 mb-6">Kopfmassage · Wellness · Entspannung · Geschenk — in deiner Stadt</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {INTENT_BY_TYPE.map((group) => (
              <div key={group.type}>
                <p className="font-display text-sm text-ink mb-3">{group.label}</p>
                <ul className="space-y-1.5">
                  {group.links.map((link) => (
                    <li key={link.slug}>
                      <Link
                        href={link.path}
                        className="body-luxury text-xs underline underline-offset-2 opacity-70 hover:opacity-100 hover:text-gold transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-8">
          <Link href="/ratgeber" className="eyebrow-luxury !text-charcoal/50 hover:!text-gold transition-colors">
            Head Spa Ratgeber →
          </Link>
        </p>
      </div>
    </section>
  )
}
