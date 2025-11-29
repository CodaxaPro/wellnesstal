import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import BlockRenderer from '@/components/blocks/BlockRenderer'

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
      <BlockRenderer blocks={page.blocks} />
    </main>
  )
}
