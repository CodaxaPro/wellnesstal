import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import JsonLd from '@/components/luxury/JsonLd'
import LocationLanding from '@/components/luxury/LocationLanding'
import { getSite } from '@/lib/content'
import { getLocationPage, getLocationRelatedLinks, LOCATION_SLUGS } from '@/lib/landing-pages'
import { pageMetadata } from '@/lib/seo-meta'
import { locationPageSchemas } from '@/lib/schema'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return LOCATION_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getLocationPage(slug)
  if (!page) return {}

  return pageMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: page.path,
    ogImage: '/images/location.jpg',
    ogAlt: `Head Spa ${page.city}`,
  })
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params
  const page = getLocationPage(slug)
  if (!page) notFound()

  const site = getSite()

  return (
    <>
      <JsonLd data={locationPageSchemas(site, page)} />
      <main id="main">
        <LocationLanding
          site={site}
          page={page}
          relatedLinks={getLocationRelatedLinks(slug as (typeof LOCATION_SLUGS)[number])}
        />
      </main>
    </>
  )
}
