import type { Metadata } from 'next'

import { getSite } from '@/lib/content'
import { pageMetadata } from '@/lib/seo-meta'

const site = getSite()

export const metadata: Metadata = pageMetadata({
  title: `Datenschutz | ${site.brand.name}`,
  description: `Datenschutzerklärung — ${site.brand.name}. Informationen zu Hosting, Terminbuchung, Gutscheinen und Ihren Rechten.`,
  path: '/datenschutz',
})

export default function DatenschutzPage() {
  const { brand } = site

  return (
    <main id="main" className="pt-32 pb-24">
      <div className="container-luxury max-w-3xl">
        <h1 className="headline-lg mb-12">Datenschutzerklärung</h1>
        <section className="body-luxury space-y-10">
          <div>
            <h2 className="headline-md text-lg mb-3">1. Verantwortlicher</h2>
            <p>
              Wellnesstal, {brand.address.street}, {brand.address.postalCode} {brand.address.city}
              <br />
              E-Mail:{' '}
              <a href={`mailto:${brand.email}`} className="hover:text-gold transition-colors">
                {brand.email}
              </a>
            </p>
          </div>
          <div>
            <h2 className="headline-md text-lg mb-3">2. Hosting</h2>
            <p>
              Diese Website wird bei Vercel Inc. gehostet. Beim Aufruf der Seite werden technisch notwendige Server-Logfiles (z. B. IP-Adresse, Zeitstempel, Browsertyp) verarbeitet.
            </p>
          </div>
          <div>
            <h2 className="headline-md text-lg mb-3">3. Terminbuchung & Gutscheine</h2>
            <p>
              Für Online-Termine und Gutscheine nutzen wir Treuepay. Wenn Sie einen Termin buchen oder einen Gutschein erwerben, werden Ihre Daten auf den Servern von Treuepay verarbeitet. Es gelten die Datenschutzbestimmungen von Treuepay.
            </p>
          </div>
          <div>
            <h2 className="headline-md text-lg mb-3">4. Kontaktaufnahme</h2>
            <p>
              Wenn Sie uns per E-Mail oder Telefon kontaktieren, verarbeiten wir Ihre Angaben zur Bearbeitung der Anfrage. Die Daten werden gelöscht, sobald die Anfrage abgeschlossen ist, sofern keine gesetzlichen Aufbewahrungspflichten bestehen.
            </p>
          </div>
          <div>
            <h2 className="headline-md text-lg mb-3">5. Ihre Rechte</h2>
            <p>
              Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Wenden Sie sich dazu an {brand.email}. Sie haben zudem das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren.
            </p>
          </div>
          <div>
            <h2 className="headline-md text-lg mb-3">6. Stand</h2>
            <p>Juli 2026</p>
          </div>
        </section>
      </div>
    </main>
  )
}
