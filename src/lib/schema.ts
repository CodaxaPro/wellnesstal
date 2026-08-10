import type { HeadspaContent, SiteContent } from './content'
import { getTestimonials } from './content'
import type { GiftPageContent, GuidePageContent, LocationPageContent, PackagePageContent, PartnerPageContent } from './landing-pages'
import { INTENT_TYPE_LABELS, parseIntentSlug } from './seo-config'
import { SITE_URL } from './seo-meta'

const PROVIDER = (site: SiteContent) => ({
  '@type': 'HealthAndBeautyBusiness' as const,
  name: site.brand.name,
  url: SITE_URL,
  telephone: site.brand.phone,
  address: {
    '@type': 'PostalAddress' as const,
    streetAddress: site.brand.address.street,
    addressLocality: site.brand.address.city,
    postalCode: site.brand.address.postalCode,
    addressCountry: 'DE',
  },
})

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  }
}

export function webPageSchema(title: string, description: string, path: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: `${SITE_URL}${path}`,
    inLanguage: 'de-DE',
    isPartOf: { '@type': 'WebSite', name: 'Wellnesstal', url: SITE_URL },
  }
}

export function localBusinessSchema(site: SiteContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HealthAndBeautyBusiness',
    name: site.brand.name,
    description: site.seo.description,
    url: SITE_URL,
    telephone: site.brand.phone,
    email: site.brand.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.brand.address.street,
      addressLocality: site.brand.address.city,
      postalCode: site.brand.address.postalCode,
      addressCountry: 'DE',
    },
    priceRange: '€€€',
    image: `${SITE_URL}/images/hero.jpeg`,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      bestRating: '5',
      reviewCount: getTestimonials().items.length,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '19:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '10:00',
        closes: '16:00',
      },
    ],
    sameAs: [site.brand.instagram, site.reviews.url],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Head Spa Behandlungen',
      itemListElement: site.services.map((s) => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.description,
        },
        price: s.price,
        priceCurrency: 'EUR',
      })),
    },
  }
}

export function headspaFaqSchema(headspa: HeadspaContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: headspa.faq.items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
}

export function headspaServiceSchema(site: SiteContent, headspa: HeadspaContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Japanese Head Spa Baesweiler',
    description: headspa.seo.description,
    provider: {
      '@type': 'HealthAndBeautyBusiness',
      name: site.brand.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.brand.address.street,
        addressLocality: site.brand.address.city,
        postalCode: site.brand.address.postalCode,
        addressCountry: 'DE',
      },
    },
    areaServed: headspa.localSeo.cities.map((city) => ({
      '@type': 'City',
      name: city,
    })),
    offers: headspa.packages.items.map((pkg) => ({
      '@type': 'Offer',
      name: pkg.name,
      price: pkg.price,
      priceCurrency: 'EUR',
      description: pkg.tagline,
    })),
  }
}

export function giftFaqSchema(page: GiftPageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
}

export function giftProductSchema(site: SiteContent, page: GiftPageContent) {
  const partnerPrices = page.partnerPackages?.map((p) => p.price)
  const lowPrice = partnerPrices?.length
    ? Math.min(...partnerPrices)
    : Math.min(...site.services.map((s) => s.price))
  const highPrice = partnerPrices?.length
    ? Math.max(...partnerPrices)
    : Math.max(...site.services.map((s) => s.price))
  const offerCount = partnerPrices?.length ?? site.services.length
  const pageUrl = `${SITE_URL}${page.path}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: page.seo.title.replace(/\s*\|\s*Wellnesstal.*$/i, '').trim() || page.hero.eyebrow,
    description: page.seo.description,
    url: pageUrl,
    brand: {
      '@type': 'Brand',
      name: site.brand.name,
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice,
      highPrice,
      priceCurrency: 'EUR',
      offerCount,
      url: pageUrl,
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.7',
      bestRating: '5',
      reviewCount: getTestimonials().items.length,
    },
  }
}

export function locationFaqSchema(page: LocationPageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  }
}

export function locationServiceSchema(site: SiteContent, page: LocationPageContent) {
  const parsed = parseIntentSlug(page.slug)
  const serviceName = parsed
    ? `${INTENT_TYPE_LABELS[parsed.type]} ${page.city}`
    : `Head Spa ${page.city}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: serviceName,
    description: page.seo.description,
    provider: PROVIDER(site),
    areaServed: {
      '@type': 'City',
      name: page.city,
    },
    offers: site.services.map((s) => ({
      '@type': 'Offer',
      name: s.name,
      price: s.price,
      priceCurrency: 'EUR',
      description: s.description,
      url: site.brand.bookingUrl,
    })),
  }
}

export function locationPageSchemas(site: SiteContent, page: LocationPageContent) {
  const parsed = parseIntentSlug(page.slug)
  const crumbs = parsed
    ? [
        { name: 'Start', path: '/' },
        { name: INTENT_TYPE_LABELS[parsed.type], path: page.path },
      ]
    : [
        { name: 'Start', path: '/' },
        { name: page.hero.eyebrow || `Head Spa ${page.city}`, path: page.path },
      ]

  return [
    webPageSchema(page.seo.title, page.seo.description, page.path),
    breadcrumbSchema(crumbs),
    localBusinessSchema(site),
    locationFaqSchema(page),
    locationServiceSchema(site, page),
    ...pageReviewSchemas(site, page),
  ]
}

function pageReviewSchemas(site: SiteContent, page: LocationPageContent) {
  const fromQuotes = page.localProof.quotes.map((q) => ({
    '@context': 'https://schema.org',
    '@type': 'Review' as const,
    author: { '@type': 'Person' as const, name: q.name },
    reviewBody: q.text,
    reviewRating: {
      '@type': 'Rating' as const,
      ratingValue: '5',
      bestRating: '5',
    },
    itemReviewed: {
      '@type': 'HealthAndBeautyBusiness' as const,
      name: site.brand.name,
      url: SITE_URL,
    },
  }))

  const fromTestimonials = getTestimonials().items.slice(0, 3).map((t) => ({
    '@context': 'https://schema.org',
    '@type': 'Review' as const,
    author: { '@type': 'Person' as const, name: t.name },
    reviewBody: t.text,
    reviewRating: {
      '@type': 'Rating' as const,
      ratingValue: '5',
      bestRating: '5',
    },
    itemReviewed: {
      '@type': 'HealthAndBeautyBusiness' as const,
      name: site.brand.name,
      url: SITE_URL,
    },
  }))

  return [...fromQuotes, ...fromTestimonials]
}

export function packageFaqSchema(page: PackagePageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function packageOfferSchema(site: SiteContent, page: PackagePageContent) {
  const service = site.services.find((s) => s.id === page.serviceId)
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: page.hero.eyebrow,
    description: page.seo.description,
    provider: {
      '@type': 'HealthAndBeautyBusiness',
      name: site.brand.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.brand.address.street,
        addressLocality: site.brand.address.city,
        postalCode: site.brand.address.postalCode,
        addressCountry: 'DE',
      },
    },
    offers: {
      '@type': 'Offer',
      name: service?.name ?? page.hero.eyebrow,
      price: page.price,
      priceCurrency: 'EUR',
      description: service?.description,
      url: site.brand.bookingUrl,
    },
  }
}

export function guideFaqSchema(page: GuidePageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function guideArticleSchema(page: GuidePageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: page.hero.headline,
    description: page.seo.description,
    url: `${SITE_URL}${page.path}`,
    inLanguage: 'de-DE',
    author: { '@type': 'Organization', name: 'Wellnesstal' },
    publisher: {
      '@type': 'Organization',
      name: 'Wellnesstal',
      url: SITE_URL,
    },
    mainEntityOfPage: `${SITE_URL}${page.path}`,
  }
}

export function guidePageSchemas(page: GuidePageContent) {
  return [
    webPageSchema(page.seo.title, page.seo.description, page.path),
    breadcrumbSchema([
      { name: 'Start', path: '/' },
      { name: 'Ratgeber', path: '/ratgeber' },
      { name: page.hero.headline.slice(0, 60), path: page.path },
    ]),
    guideArticleSchema(page),
    guideFaqSchema(page),
  ]
}

export function giftPageSchemas(site: SiteContent, page: GiftPageContent) {
  const crumbName =
    page.seo.title.replace(/\s*\|\s*Wellnesstal.*$/i, '').trim() || page.hero.eyebrow
  return [
    webPageSchema(page.seo.title, page.seo.description, page.path),
    breadcrumbSchema([
      { name: 'Start', path: '/' },
      { name: 'Gutschein', path: '/gutschein' },
      { name: crumbName, path: page.path },
    ]),
    localBusinessSchema(site),
    giftFaqSchema(page),
    giftProductSchema(site, page),
  ]
}

export function packagePageSchemas(site: SiteContent, page: PackagePageContent) {
  return [
    webPageSchema(page.seo.title, page.seo.description, page.path),
    breadcrumbSchema([
      { name: 'Start', path: '/' },
      { name: 'Head Spa', path: '/headspa' },
      { name: page.hero.eyebrow, path: page.path },
    ]),
    localBusinessSchema(site),
    packageFaqSchema(page),
    packageOfferSchema(site, page),
  ]
}

export function partnerFaqSchema(page: PartnerPageContent) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: page.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  }
}

export function partnerServiceSchema(site: SiteContent, page: PartnerPageContent) {
  const prices = page.partnerPackages.map((p) => p.price)
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Head Spa Partner-Termin für 2 Personen',
    description: page.seo.description,
    provider: PROVIDER(site),
    areaServed: {
      '@type': 'City',
      name: site.brand.address.city,
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      priceCurrency: 'EUR',
      offerCount: page.partnerPackages.length,
      url: `${SITE_URL}${page.path}`,
      availability: 'https://schema.org/InStock',
    },
  }
}

export function partnerPageSchemas(site: SiteContent, page: PartnerPageContent) {
  return [
    webPageSchema(page.seo.title, page.seo.description, page.path),
    breadcrumbSchema([
      { name: 'Start', path: '/' },
      { name: 'Head Spa', path: '/headspa' },
      { name: 'Partner / Zu zweit', path: page.path },
    ]),
    localBusinessSchema(site),
    partnerFaqSchema(page),
    partnerServiceSchema(site, page),
  ]
}
