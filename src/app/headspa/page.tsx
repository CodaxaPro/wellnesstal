import type { Metadata } from 'next'

import HeadspaLanding from '@/components/luxury/headspa/HeadspaLanding'
import { getHeadspa, getSite } from '@/lib/content'
import { pageMetadata } from '@/lib/seo-meta'
import { headspaFaqSchema, headspaServiceSchema } from '@/lib/schema'

const headspa = getHeadspa()

export const metadata: Metadata = pageMetadata({
  title: headspa.seo.title,
  description: headspa.seo.description,
  path: '/headspa',
  ogImage: '/images/hero.jpeg',
  ogAlt: 'Head Spa Wellnesstal Baesweiler',
})

export default function HeadspaPage() {
  const site = getSite()
  const faqSchema = headspaFaqSchema(headspa)
  const serviceSchema = headspaServiceSchema(site, headspa)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }} />
      <main id="main">
        <HeadspaLanding site={site} headspa={headspa} />
      </main>
    </>
  )
}
