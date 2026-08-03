import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import JsonLd from '@/components/luxury/JsonLd'
import PackageLanding from '@/components/luxury/PackageLanding'
import { getSite } from '@/lib/content'
import { getPackagePage, PACKAGE_SLUGS } from '@/lib/landing-pages'
import { pageMetadata } from '@/lib/seo-meta'
import { packagePageSchemas } from '@/lib/schema'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return PACKAGE_SLUGS.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = getPackagePage(slug)
  if (!page) return {}

  return pageMetadata({
    title: page.seo.title,
    description: page.seo.description,
    path: page.path,
    ogImage: `/images/services/${slug}.jpg`,
    ogAlt: page.hero.eyebrow,
  })
}

export default async function PackagePage({ params }: Props) {
  const { slug } = await params
  const page = getPackagePage(slug)
  if (!page) notFound()

  const site = getSite()

  return (
    <>
      <JsonLd data={packagePageSchemas(site, page)} />
      <main id="main">
        <PackageLanding site={site} page={page} />
      </main>
    </>
  )
}
