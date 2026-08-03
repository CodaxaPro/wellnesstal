import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/lib/seo-meta'

const baseUrl = SITE_URL

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
