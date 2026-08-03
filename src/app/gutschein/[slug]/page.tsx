import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import JsonLd from '@/components/luxury/JsonLd'
import GiftLanding from '@/components/luxury/GiftLanding'
import { getSite } from '@/lib/content'
import { GIFT_SLUGS, getGiftPage } from '@/lib/landing-pages'
import { pageMetadata } from '@/lib/seo-meta'
import { giftPageSchemas } from '@/lib/schema'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return GIFT_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getGiftPage(slug)
  if (!page) return {}

  return pageMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: page.path,
    ogImage: '/images/experience.jpg',
    ogAlt: page.hero.eyebrow,
  })
}

export default async function GiftSubPage({ params }: Props) {
  const { slug } = await params
  const page = getGiftPage(slug)
  if (!page) notFound()

  const site = getSite()

  return (
    <>
      <JsonLd data={giftPageSchemas(site, page)} />
      <main id="main">
        <GiftLanding site={site} page={page} />
      </main>
    </>
  )
}
