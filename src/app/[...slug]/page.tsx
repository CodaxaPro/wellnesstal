import { notFound } from 'next/navigation'

import { Metadata } from 'next'

import BlockRenderer from '@/components/blocks/BlockRenderer'
import HashScrollHandler from '@/components/HashScrollHandler'
import { getStaticContentSection, getStaticPageBySlug, getStaticPageSlugs } from '@/lib/static-content'

export const dynamic = 'force-static'

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

async function getPageBySlug(slug: string) {
  return getStaticPageBySlug(slug)
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const slugPath = slug.join('/')
  const page = await getPageBySlug(slugPath)

  if (!page) {
    return {
      title: 'Sayfa Bulunamadı | Wellnesstal',
      description: 'Aradığınız sayfa bulunamadı.'
    }
  }

  // SEO from page blocks or meta fields
  const seoBlock = page.blocks?.find((b) => b.block_type === 'seo')
  let seoContent: Record<string, unknown> | null = seoBlock?.content ?? null

  if (seoContent?.useGlobalSEO) {
    seoContent = getStaticContentSection('seo-settings')?.content ?? null
  }

  const siteUrl = process.env['NEXT_PUBLIC_SITE_URL'] || 'https://wellnesstal.de'
  const canonicalUrl =
    (seoContent?.canonicalUrl as string | undefined) ||
    `${siteUrl}/${page.slug}`

  if (seoContent && !seoContent.useGlobalSEO) {
    const keywords = seoContent.keywords as string[] | undefined
    const robots = seoContent.robots as Record<string, boolean> | undefined
    const openGraph = seoContent.openGraph as Record<string, unknown> | undefined
    const twitter = seoContent.twitter as Record<string, unknown> | undefined
    const ogImage = openGraph?.image as { url?: string; alt?: string } | undefined

    return {
      title: (seoContent.title as string) || page.meta_title || page.title,
      description: (seoContent.description as string) || page.meta_description,
      keywords: keywords?.join(', ') || page.meta_keywords?.join(', '),
      metadataBase: new URL(siteUrl),
      alternates: { canonical: canonicalUrl },
      openGraph: openGraph?.enabled
        ? {
            title: (openGraph.title as string) || page.meta_title || page.title,
            description: (openGraph.description as string) || page.meta_description,
            url: canonicalUrl,
            images: ogImage?.url ? [{ url: ogImage.url, alt: ogImage.alt || page.title }] : undefined,
          }
        : undefined,
      twitter: twitter?.enabled
        ? {
            card: (twitter.cardType as 'summary_large_image') || 'summary_large_image',
            title: (twitter.title as string) || page.meta_title || page.title,
            description: (twitter.description as string) || page.meta_description,
          }
        : undefined,
      robots: {
        index: robots?.index ?? true,
        follow: robots?.follow ?? true,
      },
    }
  }

  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
    keywords: page.meta_keywords?.join(', '),
    metadataBase: new URL(siteUrl),
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description,
      images: page.og_image ? [page.og_image] : undefined,
    },
    alternates: { canonical: canonicalUrl },
  }
}

export async function generateStaticParams() {
  return getStaticPageSlugs().map((slug) => ({
    slug: slug.split('/'),
  }))
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const slugPath = slug.join('/')
  const page = await getPageBySlug(slugPath)

  // If page not found, return 404
  if (!page) {
    notFound()
  }

  return (
    <main className="min-h-screen">
      <HashScrollHandler />
      <BlockRenderer blocks={page.blocks} pageSlug={slugPath} />
    </main>
  )
}
