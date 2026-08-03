import type { Metadata } from 'next'

import JsonLd from '@/components/luxury/JsonLd'
import GiftLanding from '@/components/luxury/GiftLanding'
import { getSite } from '@/lib/content'
import { getGiftHub } from '@/lib/landing-pages'
import { pageMetadata } from '@/lib/seo-meta'
import { giftPageSchemas } from '@/lib/schema'

export async function generateMetadata(): Promise<Metadata> {
  const hub = getGiftHub()
  return pageMetadata({
    title: hub.seo.title,
    description: hub.seo.description,
    path: '/gutschein',
    ogImage: '/images/experience.jpg',
    ogAlt: 'Wellness Gutschein Wellnesstal',
  })
}

export default function GutscheinPage() {
  const site = getSite()
  const hub = getGiftHub()

  return (
    <>
      <JsonLd data={giftPageSchemas(site, hub)} />
      <main id="main">
        <GiftLanding site={site} page={hub} showOccasions />
      </main>
    </>
  )
}
