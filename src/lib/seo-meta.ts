import type { Metadata } from 'next'

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.wellnesstal.de'

export function pageMetadata(seo: {
  title: string
  description: string
  path: string
  ogImage?: string
  ogAlt?: string
}): Metadata {
  const canonical = `${SITE_URL}${seo.path}`

  return {
    title: seo.title,
    description: seo.description,
    alternates: { canonical },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      locale: 'de_DE',
      type: 'website',
      ...(seo.ogImage && {
        images: [{ url: seo.ogImage, width: 1200, height: 630, alt: seo.ogAlt ?? seo.title }],
      }),
    },
  }
}
