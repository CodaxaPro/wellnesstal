import type { SiteContent } from '@/lib/content'

import LuxuryButton from './LuxuryButton'

type Props = {
  site: SiteContent
  theme?: 'dark' | 'light'
}

export default function BookingPanel({ site, theme = 'dark' }: Props) {
  const { brand } = site
  const isDark = theme === 'dark'

  return (
    <div
      className={`p-10 md:p-16 text-center border ${
        isDark ? 'glass !bg-ivory/95 border-stone/40' : 'glass border-stone/60 bg-ivory'
      }`}
    >
      <p className="eyebrow-luxury mb-6">Online-Termin</p>
      <h3 className="headline-md mb-4">Verfügbarkeit live ansehen</h3>
      <p className="body-luxury mb-10 max-w-lg mx-auto">
        Wähle dein Paket, Datum und Uhrzeit — direkt in unserem Buchungssystem. Alle Schritte und Buttons
        sind dort zuverlässig sichtbar.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <LuxuryButton href={brand.bookingUrl}>Wunschtermin finden</LuxuryButton>
        <LuxuryButton href={brand.phoneHref} variant="outline">
          {brand.phone}
        </LuxuryButton>
      </div>

      <p className="body-luxury text-sm opacity-60 mt-8 max-w-md mx-auto">
        Du wirst zu unserem sicheren Buchungssystem auf treuepay.de weitergeleitet.
      </p>
    </div>
  )
}
