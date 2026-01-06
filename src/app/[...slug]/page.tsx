import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import HashScrollHandler from '@/components/HashScrollHandler'

// Force dynamic rendering - pages should always be fresh
export const dynamic = 'force-dynamic'
export const revalidate = 0

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

// Create Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Fetch page by slug from database
async function getPageBySlug(slug: string) {
  try {
    // First try to get from database
    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (error || !page) {
      return null
    }

    // Get blocks for this page
    const { data: blocks } = await supabase
      .from('page_blocks')
      .select('*')
      .eq('page_id', page.id)
      .eq('visible', true)
      .order('position', { ascending: true })

    return {
      ...page,
      blocks: blocks || []
    }
  } catch (error) {
    console.error('Error fetching page:', error)
    return null
  }
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

  // Check if page has an SEO block
  const { data: seoBlock } = await supabase
    .from('page_blocks')
    .select('content')
    .eq('page_id', page.id)
    .eq('block_type', 'seo')
    .single()

  let seoContent = null

  if (seoBlock?.content) {
    // Check if using global SEO or custom SEO
    if (seoBlock.content.useGlobalSEO) {
      // Fetch global SEO settings from content table
      const { data: globalSeo } = await supabase
        .from('content')
        .select('content')
        .eq('section', 'seo-settings')
        .single()

      seoContent = globalSeo?.content
    } else {
      // Use page-specific SEO block content
      seoContent = seoBlock.content
    }
  }

  // Build metadata using SEO block if available, otherwise fallback to page table
  // Enterprise SEO: Optimized for Google, Bing, Yandex, and AI crawlers
  if (seoContent && !seoContent.useGlobalSEO) {
    const canonicalUrl = seoContent.canonicalUrl || page.canonical_url || `${process.env.NEXT_PUBLIC_SITE_URL || 'https://wellnesstal.de'}/${page.slug}`
    
    const metadata: Metadata = {
      title: seoContent.title || page.meta_title || page.title,
      description: seoContent.description || page.meta_description,
      keywords: seoContent.keywords?.join(', ') || page.meta_keywords?.join(', '),
      authors: seoContent.author ? [{ name: seoContent.author }] : undefined,
      robots: {
        index: seoContent.robots?.index ?? !page.no_index,
        follow: seoContent.robots?.follow ?? !page.no_follow,
        noarchive: seoContent.robots?.noarchive,
        nosnippet: seoContent.robots?.nosnippet,
        noimageindex: seoContent.robots?.noimageindex,
        'max-snippet': seoContent.robots?.maxSnippet,
        'max-image-preview': seoContent.robots?.maxImagePreview,
        'max-video-preview': seoContent.robots?.maxVideoPreview,
        // Enterprise: Google, Bing, Yandex specific directives
        googleBot: {
          index: seoContent.robots?.index ?? !page.no_index,
          follow: seoContent.robots?.follow ?? !page.no_follow,
          'max-video-preview': seoContent.robots?.maxVideoPreview,
          'max-image-preview': seoContent.robots?.maxImagePreview,
          'max-snippet': seoContent.robots?.maxSnippet,
        },
      },
      alternates: {
        canonical: canonicalUrl,
      },
      // Enterprise: Additional metadata for AI crawlers and search engines
      metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://wellnesstal.de'),
      applicationName: seoContent.openGraph?.siteName || 'Wellnesstal',
      referrer: 'origin-when-cross-origin',
      formatDetection: {
        email: false,
        address: false,
        telephone: false,
      },
    }

    // Add OpenGraph if enabled (Critical for Facebook, LinkedIn, AI crawlers)
    if (seoContent.openGraph?.enabled) {
      metadata.openGraph = {
        type: seoContent.openGraph.type || 'website',
        title: seoContent.openGraph.title || seoContent.title || page.meta_title || page.title,
        description: seoContent.openGraph.description || seoContent.description || page.meta_description,
        siteName: seoContent.openGraph.siteName || 'Wellnesstal',
        locale: seoContent.openGraph.locale || 'de_DE',
        url: canonicalUrl,
        images: seoContent.openGraph.image?.url ? [{
          url: seoContent.openGraph.image.url,
          width: seoContent.openGraph.image.width || 1200,
          height: seoContent.openGraph.image.height || 630,
          alt: seoContent.openGraph.image.alt || seoContent.title || page.title,
          // Enterprise: Additional OG image properties for better AI understanding
          type: 'image/jpeg',
        }] : (page.og_image ? [{
          url: page.og_image,
          alt: seoContent.title || page.title,
        }] : undefined),
        // Enterprise: Additional OG properties for AI crawlers
        ...(seoContent.openGraph.type === 'article' && {
          publishedTime: seoContent.openGraph.publishedTime,
          modifiedTime: seoContent.openGraph.modifiedTime,
          authors: seoContent.openGraph.authors,
          section: seoContent.openGraph.section,
          tags: seoContent.keywords,
        }),
      }
    }

    // Add Twitter Card if enabled (Critical for Twitter/X and AI crawlers)
    if (seoContent.twitter?.enabled) {
      metadata.twitter = {
        card: seoContent.twitter.cardType || 'summary_large_image',
        title: seoContent.twitter.title || seoContent.title || page.meta_title || page.title,
        description: seoContent.twitter.description || seoContent.description || page.meta_description,
        site: seoContent.twitter.site,
        creator: seoContent.twitter.creator,
        images: seoContent.twitter.image?.url ? [seoContent.twitter.image.url] :
                (seoContent.openGraph?.image?.url ? [seoContent.openGraph.image.url] :
                 (page.og_image ? [page.og_image] : undefined)),
        // Enterprise: Additional Twitter properties
        ...(seoContent.twitter.cardType === 'summary_large_image' && {
          'image:alt': seoContent.openGraph?.image?.alt || seoContent.title || page.title,
        }),
      }
    }

    // Enterprise: Additional metadata for AI crawlers and search engines
    metadata.other = {
      // AI crawler hints
      'ai:description': seoContent.description || page.meta_description || '',
      'ai:keywords': seoContent.keywords?.join(', ') || page.meta_keywords?.join(', ') || '',
      // Bing specific
      'msapplication-TileColor': '#9CAF88',
      'theme-color': '#9CAF88',
      // Apple specific
      'apple-mobile-web-app-title': seoContent.title || page.title,
      // Additional search engine hints
      'geo.region': 'DE-NW',
      'geo.placename': 'Baesweiler',
      'geo.position': '50.9375;6.9603',
      'ICBM': '50.9375, 6.9603',
    }

    return metadata
  }

  // Fallback to original page table metadata if no SEO block or using global SEO
  return {
    title: page.meta_title || page.title,
    description: page.meta_description,
    keywords: page.meta_keywords?.join(', '),
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description,
      images: page.og_image ? [page.og_image] : undefined,
    },
    robots: {
      index: !page.no_index,
      follow: !page.no_follow,
    },
    alternates: {
      canonical: page.canonical_url,
    },
  }
}

// Generate static params for known pages
export async function generateStaticParams() {
  try {
    const { data: pages } = await supabase
      .from('pages')
      .select('slug')
      .eq('status', 'published')

    if (pages) {
      return pages.map(page => ({
        slug: page.slug.split('/')
      }))
    }
  } catch (error) {
    console.error('Error generating static params:', error)
  }

  return []
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
      <BlockRenderer blocks={page.blocks} />
    </main>
  )
}
