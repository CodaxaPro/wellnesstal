'use client'

import Link from 'next/link'

import type { GuideHubContent, GuidePageContent } from '@/lib/landing-pages'
import type { SiteContent } from '@/lib/content'
import { getBookingUrl, getGutscheinUrl } from '@/lib/content'

import LuxuryButton from './LuxuryButton'
import { Reveal } from './Reveal'

type ArticleProps = {
  site: SiteContent
  page: GuidePageContent
}

type HubProps = {
  site: SiteContent
  hub: GuideHubContent
}

export function GuideHubLanding({ site, hub }: HubProps) {
  const bookingUrl = getBookingUrl({ channel: 'guide', slug: 'hub' })

  return (
    <>
      <section className="section-space bg-beige pt-32 md:pt-36">
        <div className="container-luxury max-w-3xl mx-auto text-center">
          <Reveal>
            <p className="eyebrow-luxury mb-4">{hub.hero.eyebrow}</p>
            <h1 className="headline-lg mb-6">{hub.hero.headline}</h1>
            <p className="body-luxury text-base md:text-lg">{hub.hero.subline}</p>
          </Reveal>
        </div>
      </section>

      <section className="section-space bg-ivory border-t border-stone/60">
        <div className="container-luxury">
          <Reveal className="max-w-2xl mx-auto text-center mb-6">
            <p className="eyebrow-luxury mb-4">{hub.articles.eyebrow}</p>
            <h2 className="headline-lg mb-4">{hub.articles.headline}</h2>
            <p className="body-luxury">{hub.articles.intro}</p>
          </Reveal>
          <div className="grid sm:grid-cols-2 gap-6 mt-14 max-w-3xl mx-auto">
            {hub.articles.items.map((item, i) => (
              <Reveal key={item.slug} delay={i * 0.08}>
                <Link href={`/ratgeber/${item.slug}`} className="group block glass border border-stone/60 p-10 h-full hover:border-gold/40 transition-colors">
                  <h3 className="font-display text-xl text-ink group-hover:text-gold transition-colors mb-3">{item.label}</h3>
                  <p className="body-luxury text-sm">{item.hint}</p>
                  <span className="inline-block mt-8 eyebrow-luxury !text-charcoal/40 group-hover:!text-gold transition-colors">Lesen →</span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-beige border-t border-stone/60">
        <div className="container-luxury max-w-2xl mx-auto text-center">
          <Reveal>
            <h2 className="headline-md mb-6">{hub.closing.headline}</h2>
            <p className="body-luxury mb-10">{hub.closing.text}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <LuxuryButton href={bookingUrl}>{hub.closing.cta}</LuxuryButton>
              <LuxuryButton href={getGutscheinUrl({ channel: 'guide', slug: 'hub' })} variant="outline">Gutschein bestellen</LuxuryButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

export default function GuideLanding({ site, page }: ArticleProps) {
  const bookingUrl = getBookingUrl({ channel: 'guide', slug: page.slug })
  const gutscheinUrl = getGutscheinUrl({ channel: 'guide', slug: page.slug })
  const primaryHref = page.closing.href ?? bookingUrl
  const secondaryHref = page.closing.secondaryHref
  const secondaryCta = page.closing.secondaryCta

  return (
    <>
      <section className="section-space bg-beige pt-32 md:pt-36">
        <div className="container-luxury max-w-3xl">
          <Reveal>
            <p className="eyebrow-luxury mb-4">{page.hero.eyebrow}</p>
            <h1 className="headline-lg mb-6">{page.hero.headline}</h1>
            <p className="body-luxury text-base md:text-lg">{page.hero.subline}</p>
          </Reveal>
        </div>
      </section>

      <article className="section-space bg-ivory border-t border-stone/60">
        <div className="container-luxury max-w-3xl mx-auto space-y-16">
          {page.sections.map((section, i) => (
            <Reveal key={section.title} delay={i * 0.05}>
              <h2 className="font-display text-2xl md:text-3xl text-ink mb-6">{section.title}</h2>
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="body-luxury text-base md:text-lg mb-4">{p}</p>
              ))}
              {section.bullets && (
                <ul className="mt-6 space-y-3">
                  {section.bullets.map((b) => (
                    <li key={b.slice(0, 30)} className="flex gap-4 body-luxury border-l border-gold pl-6 py-1">{b}</li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
      </article>

      {page.keyTakeaways && (
        <section className="section-space bg-beige border-t border-stone/60">
          <div className="container-luxury max-w-3xl mx-auto">
            <Reveal>
              <h2 className="headline-md mb-8 text-center">{page.keyTakeaways.headline}</h2>
              <ul className="space-y-4">
                {page.keyTakeaways.items.map((item) => (
                  <li key={item} className="body-luxury border-l border-gold pl-6 py-1">{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>
      )}

      <section className="section-space bg-ivory border-t border-stone/60">
        <div className="container-luxury max-w-3xl mx-auto">
          <Reveal className="text-center mb-12">
            <p className="eyebrow-luxury mb-4">Weiterlesen</p>
          </Reveal>
          <div className="grid sm:grid-cols-3 gap-6">
            {page.relatedLinks.map((link, i) => (
              <Reveal key={link.href} delay={i * 0.06}>
                <Link href={link.href} className="group block border border-stone/60 p-6 hover:border-gold/40 transition-colors">
                  <h3 className="font-display text-base text-ink group-hover:text-gold transition-colors mb-2">{link.label}</h3>
                  <p className="body-luxury text-xs">{link.hint}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-space bg-beige border-t border-stone/60">
        <div className="container-luxury max-w-3xl mx-auto">
          <Reveal className="text-center mb-14">
            <p className="eyebrow-luxury mb-4">Fragen</p>
            <h2 className="headline-md">Häufig gefragt</h2>
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
              <LuxuryButton href={primaryHref}>{page.closing.cta}</LuxuryButton>
              {secondaryCta && secondaryHref && (
                <LuxuryButton href={secondaryHref === 'gutschein' ? gutscheinUrl : secondaryHref} variant="outline">
                  {secondaryCta}
                </LuxuryButton>
              )}
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
