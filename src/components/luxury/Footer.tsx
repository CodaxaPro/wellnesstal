import Link from 'next/link'

import type { SiteContent } from '@/lib/content'
import { INTENT_BY_TYPE, LOCAL_SEO_LINKS } from '@/lib/landing-pages'

export default function LuxuryFooter({ site }: { site: SiteContent }) {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink text-ivory/70 py-20 md:py-24">
      <div className="container-luxury">
        <div className="grid md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-4">
            <p className="font-display text-3xl text-ivory mb-6">{site.brand.name}</p>
            <p className="body-luxury !text-ivory/50 max-w-sm">{site.seo.description}</p>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow-luxury !text-gold mb-6">Navigation</p>
            <ul className="space-y-3 text-sm">
              {['experience', 'services', 'ritual', 'booking', 'location'].map((id) => (
                <li key={id}>
                  <Link href={`/#${id}`} className="hover:text-ivory transition-colors capitalize">
                    {id === 'experience' ? 'Philosophie' : id === 'services' ? 'Behandlungen' : id === 'ritual' ? 'Ritual' : id === 'booking' ? 'Termin' : 'Standort'}
                  </Link>
                </li>
              ))}
              <li><Link href="/headspa" className="hover:text-ivory transition-colors">Head Spa</Link></li>
              <li><Link href="/gutschein" className="hover:text-ivory transition-colors">Gutschein</Link></li>
              <li><Link href="/ratgeber" className="hover:text-ivory transition-colors">Ratgeber</Link></li>
              <li><Link href="/geschichte" className="hover:text-ivory transition-colors">Unsere Geschichte</Link></li>
              <li><Link href="/deluxe-beauty-baesweiler" className="hover:text-ivory transition-colors">Deluxe Beauty</Link></li>
              <li><Link href="/deluxe-hair-beauty" className="hover:text-ivory transition-colors">Deluxe Hair Beauty</Link></li>
            </ul>
            <p className="eyebrow-luxury !text-gold mb-4 mt-8">Head Spa · Region</p>
            <ul className="space-y-2 text-sm">
              {LOCAL_SEO_LINKS.map((city) => (
                <li key={city.slug}>
                  <Link href={`/head-spa-${city.slug}`} className="hover:text-ivory transition-colors">
                    Head Spa {city.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-5">
            <p className="eyebrow-luxury !text-gold mb-6">In deiner Stadt</p>
            <div className="grid sm:grid-cols-2 gap-8">
              {INTENT_BY_TYPE.map((group) => (
                <div key={group.type}>
                  <p className="text-xs uppercase tracking-luxury text-gold/80 mb-3">{group.label}</p>
                  <ul className="space-y-1.5 text-sm">
                    {group.links.map((link) => (
                      <li key={link.slug}>
                        <Link href={link.path} className="hover:text-ivory transition-colors">
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-12 gap-8 mb-16 pt-8 border-t border-ivory/10">
          <div className="md:col-span-4">
            <p className="eyebrow-luxury !text-gold mb-4">Kontakt</p>
            <p className="body-luxury !text-ivory/50 text-sm leading-relaxed">
              {site.brand.address.street}<br />
              {site.brand.address.postalCode} {site.brand.address.city}<br />
              <a href={site.brand.phoneHref} className="hover:text-ivory">{site.brand.phone}</a>
            </p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-4 pt-8 border-t border-ivory/10 text-[10px] uppercase tracking-luxury">
          <span>© {year} {site.brand.name}</span>
          <div className="flex gap-8">
            <Link href="/impressum" className="hover:text-ivory">Impressum</Link>
            <Link href="/datenschutz" className="hover:text-ivory">Datenschutz</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
