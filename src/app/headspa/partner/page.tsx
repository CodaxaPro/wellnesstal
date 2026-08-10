import type { Metadata } from 'next'

import JsonLd from '@/components/luxury/JsonLd'
import PartnerLanding from '@/components/luxury/PartnerLanding'
import { getSite } from '@/lib/content'
import { getPartnerPage } from '@/lib/landing-pages'
import { pageMetadata } from '@/lib/seo-meta'
import { partnerPageSchemas } from '@/lib/schema'

const page = getPartnerPage()

export const metadata: Metadata = pageMetadata({
  title: page.seo.title,
  description: page.seo.description,
  path: page.path,
  ogImage: '/images/experience.jpg',
  ogAlt: page.hero.eyebrow,
})

export default function PartnerHeadSpaPage() {
  const site = getSite()

  return (
    <>
      <JsonLd data={partnerPageSchemas(site, page)} />
      <main id="main">
        <PartnerLanding site={site} page={page} />
      </main>
    </>
  )
}
