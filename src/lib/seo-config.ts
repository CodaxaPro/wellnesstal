/** Shared SEO route constants — safe to import from next.config.ts */
export const LOCATION_SLUGS = [
  'aachen',
  'baesweiler',
  'wurselen',
  'herzogenrath',
  'eschweiler',
  'alsdorf',
  'stolberg',
  'ubach-palenberg',
  'geilenkirchen',
  'heinsberg',
] as const

export const INTENT_TYPES = ['kopfmassage', 'wellness', 'entspannung', 'geschenk'] as const

export type LocationSlug = (typeof LOCATION_SLUGS)[number]
export type IntentType = (typeof INTENT_TYPES)[number]
export type IntentSlug = `${IntentType}-${LocationSlug}`

export const INTENT_TYPE_LABELS: Record<IntentType, string> = {
  kopfmassage: 'Kopfmassage',
  wellness: 'Wellness',
  entspannung: 'Entspannung',
  geschenk: 'Geschenk',
}

export const INTENT_TYPE_HINTS: Record<IntentType, string> = {
  kopfmassage: '45–90 Min. Ritual',
  wellness: 'Ohne Therme',
  entspannung: 'Stille suchen',
  geschenk: 'Gutschein verschenken',
}

export function getAllIntentSlugs(): IntentSlug[] {
  return INTENT_TYPES.flatMap((type) =>
    LOCATION_SLUGS.map((city) => `${type}-${city}` as IntentSlug),
  )
}

export function parseIntentSlug(slug: string): { type: IntentType; citySlug: LocationSlug } | null {
  for (const type of INTENT_TYPES) {
    const prefix = `${type}-`
    if (slug.startsWith(prefix)) {
      const citySlug = slug.slice(prefix.length)
      if ((LOCATION_SLUGS as readonly string[]).includes(citySlug)) {
        return { type, citySlug: citySlug as LocationSlug }
      }
    }
  }
  return null
}

export function getIntentPath(type: IntentType, citySlug: LocationSlug): string {
  return `/${type}-${citySlug}`
}

export function getIntentRewrites() {
  return getAllIntentSlugs().map((slug) => ({
    source: `/${slug}`,
    destination: `/intent/${slug}`,
  }))
}

/** SEO alias URLs for Gutschein keywords → canonical pages */
export function getGiftSeoRewrites() {
  const wellnessGutscheinCity = LOCATION_SLUGS.map((city) => ({
    source: `/wellness-gutschein-${city}`,
    destination: `/intent/geschenk-${city}`,
  }))

  const aliases: { source: string; destination: string }[] = [
    { source: '/wellness-gutschein', destination: '/gutschein/wellness-geschenk' },
    { source: '/wellness-gutschein-nrw', destination: '/gutschein/wellness-nrw' },
    { source: '/geschenkgutschein', destination: '/gutschein' },
    { source: '/geschenkgutscheine', destination: '/gutschein' },
    { source: '/gutschein-online', destination: '/gutschein/online' },
    { source: '/gutschein-online-kaufen', destination: '/gutschein/online' },
    { source: '/gutschein-kaufen', destination: '/gutschein/online' },
    { source: '/gutschein-bestellen', destination: '/gutschein/online' },
    { source: '/e-gutschein', destination: '/gutschein/online' },
    { source: '/digitaler-gutschein', destination: '/gutschein/online' },
    { source: '/online-gutschein', destination: '/gutschein/online' },
    { source: '/pdf-gutschein', destination: '/gutschein/online' },
    { source: '/gutschein-sofort', destination: '/gutschein/last-minute' },
    { source: '/sofort-gutschein', destination: '/gutschein/last-minute' },
    { source: '/kopfmassage-gutschein', destination: '/gutschein/kopfmassage' },
    { source: '/massage-gutschein', destination: '/gutschein/massage' },
    { source: '/massage-geschenk', destination: '/gutschein/massage' },
    { source: '/entspannung-gutschein', destination: '/gutschein/entspannung' },
    { source: '/relax-gutschein', destination: '/gutschein/entspannung' },
    { source: '/head-spa-gutschein', destination: '/gutschein/head-spa' },
    { source: '/japanese-head-spa-gutschein', destination: '/gutschein/head-spa' },
    { source: '/scalp-spa-gutschein', destination: '/gutschein/head-spa' },
    { source: '/geschenkidee', destination: '/gutschein/geschenkidee' },
    { source: '/geschenkideen', destination: '/gutschein/geschenkidee' },
    { source: '/zeit-schenken', destination: '/gutschein/zeit-schenken' },
    { source: '/wellness-geschenk', destination: '/gutschein/wellness-geschenk' },
    { source: '/wellness-geschenkidee', destination: '/gutschein/geschenkidee' },
    { source: '/geschenk-fuer-mama', destination: '/gutschein/fuer-mama' },
    { source: '/geschenk-fuer-papa', destination: '/gutschein/fuer-papa' },
    { source: '/geschenk-fuer-oma', destination: '/gutschein/fuer-oma' },
    { source: '/geschenk-fuer-opa', destination: '/gutschein/fuer-opa' },
    { source: '/geschenk-fuer-freund', destination: '/gutschein/fuer-freund' },
    { source: '/luxus-geschenk', destination: '/gutschein/luxus' },
    { source: '/premium-geschenk', destination: '/gutschein/luxus' },
    { source: '/erlebnisgutschein', destination: '/gutschein/wellness-geschenk' },
  ]

  return [...wellnessGutscheinCity, ...aliases]
}

/** Spa keyword aliases → head-spa location or geschenk intent */
export function getSpaSeoRewrites() {
  const spaCity = LOCATION_SLUGS.flatMap((city) => [
    { source: `/spa-${city}`, destination: `/locations/${city}` },
    { source: `/spa-gutschein-${city}`, destination: `/intent/geschenk-${city}` },
  ])

  return [
    ...spaCity,
    { source: '/spa-gutschein', destination: '/gutschein/head-spa' },
  ]
}
