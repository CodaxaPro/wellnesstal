'use client'

import { useEffect, useState } from 'react'
import Head from 'next/head'
import Script from 'next/script'
import { BlockProps, SEOContent, SEOSchemaSettings, SchemaLocalBusiness, SchemaOrganization, SchemaWebPage, SchemaFAQ, SchemaBreadcrumb, SchemaService, SchemaEvent } from './types'

// Default SEO Content
const defaultSEOContent: SEOContent = {
  useGlobalSEO: true,
  title: 'Wellnesstal - Ihre Wellness Oase',
  titleTemplate: '%s | Wellnesstal',
  description: 'WellnessTal ist ein Premium-Headspa- und Wellnesszentrum in Baesweiler und Umgebung (Aachen, Köln, Düsseldorf). Japanisches Head Spa, Aromatherapie-Massagen und professionelle Gesichtsbehandlungen.',
  keywords: ['wellness', 'spa', 'massage', 'entspannung', 'baesweiler'],
  author: 'Wellnesstal',
  canonicalUrl: '',
  robots: {
    index: true,
    follow: true,
    noarchive: false,
    nosnippet: false,
    noimageindex: false,
    maxSnippet: -1,
    maxImagePreview: 'large',
    maxVideoPreview: -1
  },
  openGraph: {
    enabled: true,
    type: 'website',
    siteName: 'Wellnesstal',
    locale: 'de_DE'
  },
  twitter: {
    enabled: true,
    cardType: 'summary_large_image'
  },
  schema: {
    localBusiness: {
      enabled: true,
      '@type': 'DaySpa',
      name: 'Wellnesstal',
      description: 'WellnessTal ist ein Premium-Headspa- und Wellnesszentrum, das in Baesweiler und Umgebung (Aachen, Köln, Düsseldorf) Dienstleistungen anbietet. Unser Expertenteam bietet Japanisches Head Spa (Kopfhaut-Detox), Aromatherapie-Massagen und professionelle Gesichtsbehandlungen. Wir verbinden modernste Techniken für geistige und körperliche Reinigung mit einer entspannenden Atmosphäre. Belohnen Sie sich und vereinbaren Sie noch heute einen Termin.',
      priceRange: '€€',
      currenciesAccepted: 'EUR'
    }
  },
  sitemap: {
    include: true,
    priority: 0.8,
    changeFrequency: 'weekly'
  }
}

// Helper to generate robots meta content
function generateRobotsContent(robots: SEOContent['robots']): string {
  const directives: string[] = []

  if (robots.index) {
    directives.push('index')
  } else {
    directives.push('noindex')
  }

  if (robots.follow) {
    directives.push('follow')
  } else {
    directives.push('nofollow')
  }

  if (robots.noarchive) directives.push('noarchive')
  if (robots.nosnippet) directives.push('nosnippet')
  if (robots.noimageindex) directives.push('noimageindex')
  if (robots.notranslate) directives.push('notranslate')

  if (robots.maxSnippet !== undefined && robots.maxSnippet !== -1) {
    directives.push(`max-snippet:${robots.maxSnippet}`)
  }
  if (robots.maxImagePreview && robots.maxImagePreview !== 'large') {
    directives.push(`max-image-preview:${robots.maxImagePreview}`)
  }
  if (robots.maxVideoPreview !== undefined && robots.maxVideoPreview !== -1) {
    directives.push(`max-video-preview:${robots.maxVideoPreview}`)
  }

  return directives.join(', ')
}

// Generate LocalBusiness JSON-LD
function generateLocalBusinessSchema(data: SchemaLocalBusiness): object {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': data['@type'] || 'LocalBusiness',
    name: data.name
  }

  if (data.description) schema.description = data.description
  if (data.url) schema.url = data.url
  if (data.telephone) schema.telephone = data.telephone
  if (data.email) schema.email = data.email
  if (data.logo) schema.logo = data.logo
  if (data.image) schema.image = data.image
  if (data.priceRange) schema.priceRange = data.priceRange
  if (data.currenciesAccepted) schema.currenciesAccepted = data.currenciesAccepted
  if (data.paymentAccepted) schema.paymentAccepted = data.paymentAccepted

  if (data.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      addressRegion: data.address.addressRegion,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry
    }
  }

  if (data.geo) {
    schema.geo = {
      '@type': 'GeoCoordinates',
      latitude: data.geo.latitude,
      longitude: data.geo.longitude
    }
  }

  if (data.openingHoursSpecification) {
    schema.openingHoursSpecification = data.openingHoursSpecification.map(spec => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: spec.dayOfWeek,
      opens: spec.opens,
      closes: spec.closes
    }))
  }

  if (data.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.aggregateRating.ratingValue,
      reviewCount: data.aggregateRating.reviewCount,
      bestRating: data.aggregateRating.bestRating || 5,
      worstRating: data.aggregateRating.worstRating || 1
    }
  }

  if (data.review && data.review.length > 0) {
    schema.review = data.review.map(r => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: r.author },
      datePublished: r.datePublished,
      reviewBody: r.reviewBody,
      reviewRating: {
        '@type': 'Rating',
        ratingValue: r.reviewRating.ratingValue,
        bestRating: r.reviewRating.bestRating || 5,
        worstRating: r.reviewRating.worstRating || 1
      }
    }))
  }

  if (data.sameAs) schema.sameAs = data.sameAs
  if (data.hasMap) schema.hasMap = data.hasMap

  if (data.availableService) {
    schema.hasOfferCatalog = {
      '@type': 'OfferCatalog',
      name: 'Services',
      itemListElement: data.availableService.map(s => ({
        '@type': 'Offer',
        itemOffered: {
          '@type': 'Service',
          name: s.name,
          description: s.description
        }
      }))
    }
  }

  return schema
}

// Generate Organization JSON-LD
function generateOrganizationSchema(data: SchemaOrganization): object {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': data['@type'] || 'Organization',
    name: data.name
  }

  if (data.legalName) schema.legalName = data.legalName
  if (data.description) schema.description = data.description
  if (data.url) schema.url = data.url
  if (data.logo) schema.logo = data.logo
  if (data.foundingDate) schema.foundingDate = data.foundingDate

  if (data.founder) {
    schema.founder = {
      '@type': 'Person',
      name: data.founder.name
    }
  }

  if (data.address) {
    schema.address = {
      '@type': 'PostalAddress',
      streetAddress: data.address.streetAddress,
      addressLocality: data.address.addressLocality,
      postalCode: data.address.postalCode,
      addressCountry: data.address.addressCountry
    }
  }

  if (data.contactPoint) {
    schema.contactPoint = data.contactPoint.map(cp => ({
      '@type': 'ContactPoint',
      telephone: cp.telephone,
      contactType: cp.contactType,
      areaServed: cp.areaServed,
      availableLanguage: cp.availableLanguage
    }))
  }

  if (data.sameAs) schema.sameAs = data.sameAs

  return schema
}

// Generate WebPage JSON-LD
function generateWebPageSchema(data: SchemaWebPage): object {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': data['@type'] || 'WebPage'
  }

  if (data.name) schema.name = data.name
  if (data.description) schema.description = data.description
  if (data.url) schema.url = data.url
  if (data.datePublished) schema.datePublished = data.datePublished
  if (data.dateModified) schema.dateModified = data.dateModified

  if (data.author) {
    schema.author = {
      '@type': data.author['@type'],
      name: data.author.name,
      url: data.author.url
    }
  }

  if (data.publisher) {
    schema.publisher = {
      '@type': 'Organization',
      name: data.publisher.name,
      logo: data.publisher.logo ? {
        '@type': 'ImageObject',
        url: data.publisher.logo
      } : undefined
    }
  }

  return schema
}

// Generate FAQ JSON-LD
function generateFAQSchema(data: SchemaFAQ): object {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: data.questions.map(q => ({
      '@type': 'Question',
      name: q.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: q.answer
      }
    }))
  }
}

// Generate BreadcrumbList JSON-LD
function generateBreadcrumbSchema(data: SchemaBreadcrumb, currentUrl?: string): object {
  let items = data.items || []

  // Auto-generate from URL if enabled
  if (data.autoGenerate && currentUrl) {
    const url = new URL(currentUrl)
    const pathParts = url.pathname.split('/').filter(Boolean)
    items = [
      { name: 'Home', url: url.origin }
    ]
    let currentPath = url.origin
    pathParts.forEach(part => {
      currentPath += '/' + part
      items.push({
        name: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
        url: currentPath
      })
    })
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  }
}

// Generate Service JSON-LD
function generateServiceSchema(data: SchemaService): object[] {
  return data.services.map(service => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: service.name,
    description: service.description,
    provider: service.provider ? {
      '@type': 'LocalBusiness',
      name: service.provider
    } : undefined,
    serviceType: service.serviceType,
    areaServed: service.areaServed,
    offers: service.offers ? {
      '@type': 'Offer',
      price: service.offers.price,
      priceCurrency: service.offers.priceCurrency,
      availability: service.offers.availability ? `https://schema.org/${service.offers.availability}` : undefined
    } : undefined
  }))
}

// Generate Event JSON-LD
function generateEventSchema(data: SchemaEvent): object[] {
  return data.events.map(event => ({
    '@context': 'https://schema.org',
    '@type': event['@type'] || 'Event',
    name: event.name,
    description: event.description,
    startDate: event.startDate,
    endDate: event.endDate,
    location: event.location ? {
      '@type': 'Place',
      name: event.location.name,
      address: event.location.address
    } : undefined,
    organizer: event.organizer ? {
      '@type': 'Organization',
      name: event.organizer.name,
      url: event.organizer.url
    } : undefined,
    offers: event.offers ? {
      '@type': 'Offer',
      price: event.offers.price,
      priceCurrency: event.offers.priceCurrency,
      availability: `https://schema.org/${event.offers.availability}`,
      url: event.offers.url
    } : undefined,
    image: event.image,
    eventStatus: event.eventStatus ? `https://schema.org/${event.eventStatus}` : undefined,
    eventAttendanceMode: event.eventAttendanceMode ? `https://schema.org/${event.eventAttendanceMode}` : undefined
  }))
}

// The SEO Block Component
export default function SEOBlock({ block }: BlockProps) {
  const [globalSEOData, setGlobalSEOData] = useState<any>(null)
  const [globalContactData, setGlobalContactData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  const content = block.content as SEOContent
  const useGlobalSEO = content?.useGlobalSEO !== false

  // Fetch global SEO settings if enabled
  useEffect(() => {
    if (useGlobalSEO) {
      setIsLoading(true)
      Promise.all([
        fetch('/api/content?section=seo-settings').then(r => r.json()),
        fetch('/api/content?section=contact').then(r => r.json())
      ])
        .then(([seoRes, contactRes]) => {
          if (seoRes.success && seoRes.data?.content) {
            setGlobalSEOData(seoRes.data.content)
          }
          if (contactRes.success && contactRes.data?.content) {
            setGlobalContactData(contactRes.data.content)
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false))
    }
  }, [useGlobalSEO])

  // Merge content with defaults
  const seoContent: SEOContent = {
    ...defaultSEOContent,
    ...content,
    robots: { ...defaultSEOContent.robots, ...content?.robots },
    openGraph: { ...defaultSEOContent.openGraph, ...content?.openGraph },
    twitter: { ...defaultSEOContent.twitter, ...content?.twitter },
    schema: { ...defaultSEOContent.schema, ...content?.schema },
    sitemap: { ...defaultSEOContent.sitemap, ...content?.sitemap }
  }

  // Apply global settings if enabled
  if (useGlobalSEO && globalSEOData) {
    // Merge global settings
    if (globalSEOData.title) seoContent.title = globalSEOData.title
    if (globalSEOData.description) seoContent.description = globalSEOData.description
    if (globalSEOData.siteName) {
      seoContent.openGraph.siteName = globalSEOData.siteName
      seoContent.titleTemplate = `%s | ${globalSEOData.siteName}`
    }
    if (globalSEOData.defaultImage) {
      seoContent.openGraph.image = { url: globalSEOData.defaultImage }
      seoContent.twitter.image = { url: globalSEOData.defaultImage }
    }
    if (globalSEOData.twitterHandle) seoContent.twitter.site = globalSEOData.twitterHandle
  }

  // Apply contact data to LocalBusiness schema
  if (useGlobalSEO && globalContactData && seoContent.schema.localBusiness?.enabled) {
    const lb = seoContent.schema.localBusiness
    if (globalContactData.businessName) lb.name = globalContactData.businessName
    if (globalContactData.phone) lb.telephone = globalContactData.phone
    if (globalContactData.email) lb.email = globalContactData.email
    if (globalContactData.address) {
      lb.address = {
        streetAddress: globalContactData.address.street,
        addressLocality: globalContactData.address.city,
        postalCode: globalContactData.address.postalCode,
        addressCountry: globalContactData.address.country || 'DE'
      }
    }
  }

  // Generate title with template
  const finalTitle = seoContent.titleTemplate
    ? seoContent.titleTemplate.replace('%s', seoContent.title)
    : seoContent.title

  // Generate all JSON-LD schemas
  const schemas: object[] = []

  if (seoContent.schema.localBusiness?.enabled) {
    schemas.push(generateLocalBusinessSchema(seoContent.schema.localBusiness))
  }
  if (seoContent.schema.organization?.enabled) {
    schemas.push(generateOrganizationSchema(seoContent.schema.organization))
  }
  if (seoContent.schema.webPage?.enabled) {
    schemas.push(generateWebPageSchema(seoContent.schema.webPage))
  }
  if (seoContent.schema.faq?.enabled && seoContent.schema.faq.questions.length > 0) {
    schemas.push(generateFAQSchema(seoContent.schema.faq))
  }
  if (seoContent.schema.breadcrumb?.enabled) {
    schemas.push(generateBreadcrumbSchema(seoContent.schema.breadcrumb, seoContent.canonicalUrl))
  }
  if (seoContent.schema.service?.enabled) {
    schemas.push(...generateServiceSchema(seoContent.schema.service))
  }
  if (seoContent.schema.event?.enabled) {
    schemas.push(...generateEventSchema(seoContent.schema.event))
  }

  // This is a head-only block, it doesn't render visible content
  // But Next.js 13+ App Router uses metadata differently
  // We'll render a hidden div with data and use a script to update head

  return (
    <>
      {/* JSON-LD Structured Data - Critical for Google, Bing, and AI crawlers */}
      {schemas.map((schema, index) => (
        <Script
          key={`schema-${index}`}
          id={`schema-${index}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          strategy="afterInteractive"
        />
      ))}

      {/* AI & Search Engine Optimization Meta Tags */}
      {/* These help ChatGPT, Perplexity, Claude, and other AI crawlers understand content */}
      <Script
        id="seo-meta-injector"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              // Ensure meta tags are set for AI crawlers
              if (typeof document !== 'undefined') {
                const title = ${JSON.stringify(finalTitle)};
                const description = ${JSON.stringify(seoContent.description || '')};
                const keywords = ${JSON.stringify(seoContent.keywords?.join(', ') || '')};
                
                // Update or create title
                if (title) {
                  document.title = title;
                  let titleMeta = document.querySelector('meta[property="og:title"]');
                  if (!titleMeta) {
                    titleMeta = document.createElement('meta');
                    titleMeta.setAttribute('property', 'og:title');
                    document.head.appendChild(titleMeta);
                  }
                  titleMeta.setAttribute('content', title);
                }
                
                // Update or create description
                if (description) {
                  let descMeta = document.querySelector('meta[name="description"]');
                  if (!descMeta) {
                    descMeta = document.createElement('meta');
                    descMeta.setAttribute('name', 'description');
                    document.head.appendChild(descMeta);
                  }
                  descMeta.setAttribute('content', description);
                  
                  // OG description
                  let ogDesc = document.querySelector('meta[property="og:description"]');
                  if (!ogDesc) {
                    ogDesc = document.createElement('meta');
                    ogDesc.setAttribute('property', 'og:description');
                    document.head.appendChild(ogDesc);
                  }
                  ogDesc.setAttribute('content', description);
                }
                
                // Keywords
                if (keywords) {
                  let keywordsMeta = document.querySelector('meta[name="keywords"]');
                  if (!keywordsMeta) {
                    keywordsMeta = document.createElement('meta');
                    keywordsMeta.setAttribute('name', 'keywords');
                    document.head.appendChild(keywordsMeta);
                  }
                  keywordsMeta.setAttribute('content', keywords);
                }
              }
            })();
          `
        }}
      />

      {/* Hidden SEO data container for AI crawlers and debugging */}
      <div
        data-seo-block="true"
        data-title={finalTitle}
        data-description={seoContent.description}
        data-keywords={seoContent.keywords?.join(', ')}
        data-canonical={seoContent.canonicalUrl}
        data-robots-index={seoContent.robots?.index}
        data-robots-follow={seoContent.robots?.follow}
        style={{ display: 'none' }}
        aria-hidden="true"
      >
        {/* SEO Block Active - AI crawlers can read this structured data */}
      </div>

      {/*
        Note: In Next.js App Router, meta tags are set using generateMetadata.
        This block provides JSON-LD structured data which is critical for:
        - Google Rich Results
        - Bing Search
        - AI crawlers (ChatGPT, Perplexity, Claude)
        - Social media platforms
      */}
    </>
  )
}

// Export content type for editor
export type { SEOContent }
