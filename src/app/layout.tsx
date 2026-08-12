import type { Metadata } from 'next'

import FloatingBook from '@/components/luxury/FloatingBook'
import LuxuryFooter from '@/components/luxury/Footer'
import LuxuryHeader from '@/components/luxury/Header'
import MetaPixel from '@/components/MetaPixel'
import MobileBookBar from '@/components/luxury/MobileBookBar'
import { getSite } from '@/lib/content'
import { localBusinessSchema } from '@/lib/schema'

import './globals.css'

const site = getSite()

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.wellnesstal.de'),
  title: site.seo.title,
  description: site.seo.description,
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    locale: 'de_DE',
    type: 'website',
    images: [{ url: '/images/hero.jpeg', width: 1200, height: 630, alt: 'Wellnesstal Premium Head Spa' }],
  },
  twitter: { card: 'summary_large_image', title: site.seo.title, description: site.seo.description },
  robots: { index: true, follow: true },
  verification: {
    google: 'J7xXJRHklUwd6zqfezVUw8xGLBJitgKPEubhB58fcFg',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = localBusinessSchema(site)

  return (
    <html lang="de">
      <head>
        <meta name="google-site-verification" content="J7xXJRHklUwd6zqfezVUw8xGLBJitgKPEubhB58fcFg" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </head>
      <body className="pb-20 md:pb-0">
        <MetaPixel />
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-ink focus:text-ivory focus:px-4 focus:py-2">
          Zum Inhalt springen
        </a>
        <LuxuryHeader site={site} />
        {children}
        <LuxuryFooter site={site} />
        <FloatingBook />
        <MobileBookBar />
      </body>
    </html>
  )
}
