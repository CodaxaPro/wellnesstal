import type { Metadata } from 'next'

import { getSite } from '@/lib/content'
import { pageMetadata } from '@/lib/seo-meta'

const site = getSite()

export const metadata: Metadata = pageMetadata({
  title: `Impressum | ${site.brand.name}`,
  description: `Impressum und Kontakt — ${site.brand.name}, ${site.brand.address.street}, ${site.brand.address.postalCode} ${site.brand.address.city}.`,
  path: '/impressum',
})

export default function ImpressumPage() {
  const { brand } = site

  return (
    <main id="main" className="pt-32 pb-24">
      <div className="container-luxury max-w-3xl">
        <h1 className="headline-lg mb-12">Impressum</h1>
        <section className="body-luxury space-y-10">
          <div>
            <h2 className="headline-md text-lg mb-3">Angaben gemäß § 5 TMG</h2>
            <p>
              Wellnesstal
              <br />
              {brand.address.street}
              <br />
              {brand.address.postalCode} {brand.address.city}
              <br />
              {brand.address.country}
            </p>
            <p className="mt-4 text-sm opacity-70">
              Früher auch bekannt als Deluxe Beauty / Deluxe Hair Beauty — heute spezialisiert auf
              japanisches Head Spa.{' '}
              <a href="/geschichte" className="underline hover:text-gold transition-colors">
                Unsere Geschichte
              </a>
            </p>
          </div>
          <div>
            <h2 className="headline-md text-lg mb-3">Kontakt</h2>
            <p>
              Telefon:{' '}
              <a href={brand.phoneHref} className="hover:text-gold transition-colors">
                {brand.phone}
              </a>
              <br />
              E-Mail:{' '}
              <a href={`mailto:${brand.email}`} className="hover:text-gold transition-colors">
                {brand.email}
              </a>
            </p>
          </div>
          <div>
            <h2 className="headline-md text-lg mb-3">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              Wellnesstal
              <br />
              {brand.address.street}, {brand.address.postalCode} {brand.address.city}
            </p>
          </div>
          <div>
            <h2 className="headline-md text-lg mb-3">Haftungsausschluss</h2>
            <p className="space-y-4">
              <span className="block">
                Die Inhalte dieser Website wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.
              </span>
              <span className="block">
                Als Diensteanbieter sind wir gemäß § 7 Abs. 1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich.
              </span>
            </p>
          </div>
          <div>
            <h2 className="headline-md text-lg mb-3">Online-Streitbeilegung</h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit:{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-gold transition-colors underline underline-offset-4"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
