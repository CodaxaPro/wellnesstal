import type { NextConfig } from 'next'

import { getGiftSeoRewrites, getIntentRewrites, getSpaSeoRewrites } from './src/lib/seo-config'
import { getCustomMoneyRewrites } from './src/lib/custom-money-pages'

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async rewrites() {
    return [
      {
        source: '/head-spa-:slug',
        destination: '/locations/:slug',
      },
      ...getIntentRewrites(),
      ...getCustomMoneyRewrites(),
      ...getGiftSeoRewrites(),
      ...getSpaSeoRewrites(),
    ]
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https:",
              "media-src 'self' https://assets.mixkit.co https:",
              "frame-src 'self' https://treuepay.de https://*.treuepay.de",
              "connect-src 'self' https://treuepay.de https://*.treuepay.de",
            ].join('; '),
          },
        ],
      },
    ]
  },
}

export default nextConfig
