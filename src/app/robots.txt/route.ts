import { NextResponse } from 'next/server'

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// Enterprise robots.txt Generator
// Optimized for all search engines: Google, Bing, Yandex, Baidu
// AI crawlers: ChatGPT, Perplexity, Claude, etc.
export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : 'https://wellnesstal.de'
  const sitemapUrl = `${baseUrl}/sitemap.xml`

  // Fetch global SEO settings for robots.txt customization
  let customRules = ''
  try {
    const { data: seoSettings } = await supabase
      .from('content')
      .select('content')
      .eq('section', 'seo-settings')
      .single()

    if (seoSettings?.content?.robotsTxt) {
      customRules = seoSettings.content.robotsTxt
    }
  } catch (e) {
    // Ignore errors, use defaults
  }

  // Enterprise robots.txt with support for all major crawlers
  const robotsTxt = `# robots.txt for ${baseUrl}
# Enterprise SEO - Optimized for all search engines and AI crawlers
# Generated automatically - Updated: ${new Date().toISOString()}

# ============================================
# GOOGLE BOT (Primary Search Engine)
# ============================================
User-agent: Googlebot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /editor/
Crawl-delay: 0

# ============================================
# BING BOT (Microsoft Search)
# ============================================
User-agent: Bingbot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /editor/
Crawl-delay: 0

# ============================================
# YANDEX BOT (Russian Search Engine)
# ============================================
User-agent: Yandex
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /editor/
Crawl-delay: 0

# ============================================
# BAIDU SPIDER (Chinese Search Engine)
# ============================================
User-agent: Baiduspider
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /editor/
Crawl-delay: 0

# ============================================
# AI CRAWLERS (ChatGPT, Perplexity, Claude, etc.)
# ============================================
User-agent: GPTBot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /editor/

User-agent: ChatGPT-User
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /editor/

User-agent: CCBot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /editor/

User-agent: anthropic-ai
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /editor/

User-agent: Claude-Web
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /editor/

User-agent: PerplexityBot
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /editor/

User-agent: Applebot-Extended
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /editor/

# ============================================
# SOCIAL MEDIA CRAWLERS
# ============================================
User-agent: facebookexternalhit
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: Twitterbot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: LinkedInBot
Allow: /
Disallow: /admin/
Disallow: /api/

User-agent: WhatsApp
Allow: /
Disallow: /admin/
Disallow: /api/

# ============================================
# DEFAULT RULES (All other bots)
# ============================================
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /editor/
Disallow: /wizard/

# ============================================
# SITEMAP (Critical for SEO)
# ============================================
Sitemap: ${sitemapUrl}

# ============================================
# CUSTOM RULES (from SEO settings)
# ============================================
${customRules}
`

  return new NextResponse(robotsTxt, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
      'X-Robots-Tag': 'noindex' // Don't index robots.txt itself
    }
  })
}

