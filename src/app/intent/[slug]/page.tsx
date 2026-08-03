import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import JsonLd from '@/components/luxury/JsonLd'
import LocationLanding from '@/components/luxury/LocationLanding'
import { getSite } from '@/lib/content'
import {
  CUSTOM_MONEY_SLUGS,
  getCustomMoneyShell,
  isCustomMoneySlug,
} from '@/lib/custom-money-pages'
import { getIntentPage, getIntentRelatedLinks } from '@/lib/landing-pages'
import { getIntentLongForm } from '@/lib/longform-registry'
import { locationPageSchemas } from '@/lib/schema'
import { pageMetadata } from '@/lib/seo-meta'
import { getAllIntentSlugs, type IntentSlug } from '@/lib/seo-config'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return [
    ...getAllIntentSlugs().map((slug) => ({ slug })),
    ...CUSTOM_MONEY_SLUGS.map((slug) => ({ slug })),
  ]
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = isCustomMoneySlug(slug) ? getCustomMoneyShell(slug) : getIntentPage(slug)
  if (!page) return {}

  const longForm = getIntentLongForm(slug)
  const title = longForm?.seo?.title ?? page.seo.title
  const description = longForm?.seo?.description ?? page.seo.description

  return pageMetadata({
    title,
    description,
    path: page.path,
    ogImage: '/images/experience.jpg',
    ogAlt: page.hero.eyebrow,
  })
}

export default async function IntentPage({ params }: Props) {
  const { slug } = await params
  const page = isCustomMoneySlug(slug) ? getCustomMoneyShell(slug) : getIntentPage(slug)
  if (!page) notFound()

  const site = getSite()
  const longForm = getIntentLongForm(slug)
  const pageForSchema = {
    ...page,
    seo: longForm?.seo ? { ...page.seo, ...longForm.seo } : page.seo,
    faq: longForm?.faqExtensions?.length
      ? [...page.faq, ...longForm.faqExtensions]
      : page.faq,
  }

  return (
    <>
      <JsonLd data={locationPageSchemas(site, pageForSchema)} />
      <main id="main">
        <LocationLanding
          site={site}
          page={page}
          relatedLinks={
            isCustomMoneySlug(slug) ? undefined : getIntentRelatedLinks(slug as IntentSlug)
          }
          longForm={longForm}
        />
      </main>
    </>
  )
}
