import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import JsonLd from '@/components/luxury/JsonLd'
import GuideLanding from '@/components/luxury/GuideLanding'
import { getSite } from '@/lib/content'
import { getGuidePage, GUIDE_SLUGS } from '@/lib/landing-pages'
import { pageMetadata } from '@/lib/seo-meta'
import { guidePageSchemas } from '@/lib/schema'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return GUIDE_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getGuidePage(slug)
  if (!page) return {}

  return pageMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: page.path,
  })
}

export default async function GuideArticlePage({ params }: Props) {
  const { slug } = await params
  const page = getGuidePage(slug)
  if (!page) notFound()

  return (
    <>
      <JsonLd data={guidePageSchemas(page)} />
      <main id="main">
        <GuideLanding site={getSite()} page={page} />
      </main>
    </>
  )
}
