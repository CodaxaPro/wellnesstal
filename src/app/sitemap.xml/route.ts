import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Enterprise Sitemap Generator
// Automatically includes all published pages
// Optimized for Google, Bing, Yandex, and AI crawlers (ChatGPT, Perplexity, etc.)
export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'https://wellnesstal.de'

    // Fetch all published and active pages (automatically included when status = 'published' and active = true)
    const { data: pages, error } = await supabase
      .from('pages')
      .select('id, slug, updated_at, published_at, meta_title, meta_description, created_at')
      .eq('status', 'published')
      .eq('active', true) // Only include active pages
      .order('updated_at', { ascending: false })

    if (error) {
      console.error('Error fetching pages for sitemap:', error)
      return new NextResponse('Error generating sitemap', { status: 500 })
    }

    // Fetch SEO blocks for all pages to get sitemap settings
    const pageIds = (pages || []).map(p => p.id)
    let seoBlocks: any[] = []
    if (pageIds.length > 0) {
      const { data } = await supabase
        .from('page_blocks')
        .select('page_id, content')
        .eq('block_type', 'seo')
        .in('page_id', pageIds)
      seoBlocks = data || []
    }

    // Create a map of page_id -> SEO settings
    const seoSettingsMap = new Map()
    seoBlocks?.forEach(block => {
      if (block.content?.sitemap) {
        seoSettingsMap.set(block.page_id, block.content.sitemap)
      }
    })

    // Fetch images from blocks for image sitemap support
    const { data: imageBlocks } = await supabase
      .from('page_blocks')
      .select('page_id, content, block_type')
      .in('page_id', pageIds)
      .in('block_type', ['hero', 'gallery', 'image'])

    // Create image map: page_id -> images[]
    const pageImagesMap = new Map<string, string[]>()
    imageBlocks?.forEach(block => {
      const images: string[] = []
      if (block.content?.image) images.push(block.content.image)
      if (block.content?.images && Array.isArray(block.content.images)) {
        images.push(...block.content.images.filter((img: any) => typeof img === 'string' || img?.url))
      }
      if (block.content?.backgroundImage) images.push(block.content.backgroundImage)
      if (images.length > 0) {
        pageImagesMap.set(block.page_id, images.map(img => typeof img === 'string' ? img : img.url).filter(Boolean))
      }
    })

    // Add homepage (always highest priority) - automatically included
    const homepageLastmod = new Date().toISOString()
    const homepageEntry = `  <url>
    <loc>${escapeXml(baseUrl)}</loc>
    <lastmod>${homepageLastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`

    // Build sitemap entries for pages (automatically included when published)
    // ✅ TÜM YENİ VE ESKİ SAYFALAR OTOMATİK EKLENİYOR
    const pageEntries = (pages || [])
      .filter(page => {
        // Skip pages without slug
        if (!page.slug || page.slug.trim() === '') {
          console.warn(`Skipping page ${page.id} - no slug`)
          return false
        }
        
        // Check if page should be excluded from sitemap (via SEOBlock settings)
        const seoSettings = seoSettingsMap.get(page.id)
        if (seoSettings?.include === false) {
          return false
        }
        // ✅ Automatically include ALL published pages (new and old) unless explicitly excluded
        return true
      })
      .map(page => {
        // Get SEO block settings
        const seoSettings = seoSettingsMap.get(page.id)
        const priority = seoSettings?.priority ?? 0.8
        const changeFreq = seoSettings?.changeFrequency ?? 'weekly'
        // Use published_at if available, otherwise updated_at, fallback to created_at
        const lastmod = seoSettings?.lastModified || page.published_at || page.updated_at || page.created_at
        const lastmodDate = lastmod ? new Date(lastmod).toISOString() : new Date().toISOString()

        // Clean slug (remove leading/trailing slashes)
        const cleanSlug = page.slug.trim().replace(/^\/+|\/+$/g, '')
        const url = cleanSlug ? `${baseUrl}/${cleanSlug}` : baseUrl
        
        // Get images for this page (for image sitemap support)
        const images = pageImagesMap.get(page.id) || []
        const imageTags = images.slice(0, 10).map(img => {
          const imageUrl = img.startsWith('http') ? img : `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`
          return `    <image:image>
      <image:loc>${escapeXml(imageUrl)}</image:loc>
    </image:image>`
        }).join('\n')

        // Build URL entry with optional images
        let urlEntry = `  <url>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${lastmodDate}</lastmod>
    <changefreq>${changeFreq}</changefreq>
    <priority>${priority.toFixed(1)}</priority>`
        
        if (imageTags) {
          urlEntry += `\n${imageTags}`
        }
        
        urlEntry += `\n  </url>`
        
        return urlEntry
      })
      .join('\n')

    const sitemapEntries = homepageEntry + (pageEntries ? '\n' + pageEntries : '')

    // Generate XML
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml"
        xmlns:mobile="http://www.google.com/schemas/sitemap-mobile/1.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${sitemapEntries}
</urlset>`

    return new NextResponse(sitemap, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400'
      }
    })

  } catch (error) {
    console.error('Sitemap generation error:', error)
    return new NextResponse('Error generating sitemap', { status: 500 })
  }
}

// Escape XML special characters
function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

