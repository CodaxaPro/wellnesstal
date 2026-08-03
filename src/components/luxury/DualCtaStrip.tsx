import LuxuryButton from './LuxuryButton'

type Props = {
  bookingUrl: string
  gutscheinUrl: string
  variant?: 'light' | 'dark'
  className?: string
}

export default function DualCtaStrip({
  bookingUrl,
  gutscheinUrl,
  variant = 'light',
  className = '',
}: Props) {
  const outline =
    variant === 'dark'
      ? '!border-ivory/30 !text-ivory hover:!bg-ivory hover:!text-ink'
      : undefined

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      <LuxuryButton href={bookingUrl}>Termin buchen</LuxuryButton>
      <LuxuryButton href={gutscheinUrl} variant="outline" className={outline}>
        Gutschein kaufen
      </LuxuryButton>
    </div>
  )
}
