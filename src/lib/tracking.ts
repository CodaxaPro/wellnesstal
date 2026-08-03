/** UTM tracking for Treuepay booking & Gutschein conversion attribution */

export type TrackingChannel =
  | 'home'
  | 'intent'
  | 'location'
  | 'gift'
  | 'guide'
  | 'package'
  | 'headspa'
  | 'floating'
  | 'header'
  | 'site'

export type TrackingContext = {
  channel: TrackingChannel
  slug?: string
}

export function withUtm(baseUrl: string, ctx?: TrackingContext): string {
  if (!ctx) return baseUrl

  try {
    const url = new URL(baseUrl)
    url.searchParams.set('utm_source', 'wellnesstal.de')
    url.searchParams.set('utm_medium', ctx.channel)
    url.searchParams.set('utm_campaign', ctx.slug ?? ctx.channel)
    return url.toString()
  } catch {
    return baseUrl
  }
}

/** Infer tracking context from a landing page slug */
export function trackingFromPageSlug(slug: string): TrackingContext {
  const intentPrefixes = ['kopfmassage-', 'wellness-', 'entspannung-', 'geschenk-']
  if (intentPrefixes.some((p) => slug.startsWith(p))) {
    return { channel: 'intent', slug }
  }
  return { channel: 'location', slug }
}
