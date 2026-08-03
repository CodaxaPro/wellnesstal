import type { Metadata } from 'next'

import { GuideHubLanding } from '@/components/luxury/GuideLanding'
import { getSite } from '@/lib/content'
import { getGuideHub } from '@/lib/landing-pages'
import { pageMetadata } from '@/lib/seo-meta'

const hub = getGuideHub()

export const metadata: Metadata = pageMetadata({
  title: hub.seo.title,
  description: hub.seo.description,
  path: '/ratgeber',
  ogImage: '/images/experience.jpg',
  ogAlt: 'Head Spa Ratgeber Wellnesstal',
})

export default function RatgeberPage() {
  const site = getSite()

  return (
    <main id="main">
      <GuideHubLanding site={site} hub={hub} />
    </main>
  )
}
