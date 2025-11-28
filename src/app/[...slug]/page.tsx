import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import PageRenderer from '@/components/PageRenderer'
import { Page } from '@/types/pages'

interface PageProps {
  params: Promise<{
    slug: string[]
  }>
}

// Mock data - In production, this would fetch from your database
async function getPageBySlug(slug: string): Promise<Page | null> {
  // Simulate API call
  const PAGES: Page[] = [
    {
      id: '1',
      slug: 'aromatherapie-koeln',
      title: 'Aromatherapie in Köln',
      metaDescription: 'Professionelle Aromatherapie-Behandlungen in Köln. Entspannung durch ätherische Öle.',
      metaTitle: 'Aromatherapie Köln | Wellnesstal',
      status: 'published',
      templateType: 'service',
      content: {
        hero: {
          title: 'Aromatherapie',
          subtitle: 'Entspannung durch die Kraft ätherischer Öle',
          image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1200',
          ctaText: 'Termin buchen',
          ctaLink: 'tel:+4922112345678',
          backgroundType: 'image'
        },
        sections: [
          {
            id: '1',
            type: 'text',
            title: 'Was ist Aromatherapie?',
            content: {
              content: 'Aromatherapie nutzt natürliche Pflanzenextrakte zur Förderung von Gesundheit und Wohlbefinden. Diese ganzheitliche Heilmethode wird seit Jahrhunderten verwendet, um Körper, Geist und Seele in Einklang zu bringen.',
              layout: 'single',
              alignment: 'left'
            },
            orderIndex: 1,
            visible: true
          },
          {
            id: '2',
            type: 'features',
            title: 'Ihre Vorteile',
            content: {
              features: [
                { title: 'Stressabbau', description: 'Reduziert Stress und fördert tiefe Entspannung' },
                { title: 'Besserer Schlaf', description: 'Verbessert die Schlafqualität natürlich' },
                { title: 'Emotionale Balance', description: 'Unterstützt emotionales Wohlbefinden' },
                { title: 'Natürliche Heilung', description: '100% natürliche ätherische Öle' }
              ]
            },
            orderIndex: 2,
            visible: true
          }
        ]
      },
      seo: {
        metaTitle: 'Aromatherapie Köln | Wellnesstal',
        metaDescription: 'Professionelle Aromatherapie-Behandlungen in Köln. Entspannung durch ätherische Öle.',
        keywords: ['aromatherapie', 'köln', 'ätherische öle', 'entspannung', 'wellness'],
        noIndex: false,
        noFollow: false
      },
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
      publishedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: '2',
      slug: 'ueber-wellnesstal',
      title: 'Über Wellnesstal',
      metaDescription: 'Erfahren Sie mehr über Wellnesstal - Ihre Wellness-Oase im Herzen von Köln.',
      metaTitle: 'Über uns | Wellnesstal',
      status: 'published',
      templateType: 'about',
      content: {
        hero: {
          title: 'Über Wellnesstal',
          subtitle: 'Ihre Oase der Entspannung seit 2019',
          image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200',
          backgroundType: 'image'
        },
        sections: [
          {
            id: '1',
            type: 'text',
            title: 'Unsere Geschichte',
            content: {
              content: 'Wellnesstal wurde 2019 mit der Vision gegründet, Menschen einen Ort der Ruhe und Regeneration zu bieten. Unser erfahrenes Team von zertifizierten Therapeuten bringt jahrelange Expertise mit.',
              layout: 'single',
              alignment: 'left'
            },
            orderIndex: 1,
            visible: true
          }
        ]
      },
      seo: {
        metaTitle: 'Über uns | Wellnesstal',
        metaDescription: 'Erfahren Sie mehr über Wellnesstal - Ihre Wellness-Oase im Herzen von Köln.',
        keywords: ['wellnesstal', 'über uns', 'wellness köln', 'spa'],
        noIndex: false,
        noFollow: false
      },
      createdAt: '2024-01-14T15:30:00Z',
      updatedAt: '2024-01-14T15:30:00Z',
      publishedAt: '2024-01-14T15:30:00Z'
    }
  ]

  return PAGES.find(page => page.slug === slug && page.status === 'published') || null
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const slugPath = slug.join('/')
  const page = await getPageBySlug(slugPath)

  if (!page) {
    return {
      title: 'Seite nicht gefunden | Wellnesstal',
      description: 'Die angeforderte Seite konnte nicht gefunden werden.'
    }
  }

  return {
    title: page.seo.metaTitle || page.metaTitle,
    description: page.seo.metaDescription || page.metaDescription,
    keywords: page.seo.keywords?.join(', '),
    openGraph: {
      title: page.seo.metaTitle || page.metaTitle,
      description: page.seo.metaDescription || page.metaDescription,
      images: page.seo.ogImage ? [page.seo.ogImage] : undefined,
    },
    robots: {
      index: !page.seo.noIndex,
      follow: !page.seo.noFollow,
    },
    alternates: {
      canonical: page.seo.canonicalUrl,
    },
  }
}

// Generate static params for static generation (optional)
export async function generateStaticParams() {
  // In production, fetch all published page slugs from database
  const pages = [
    { slug: ['aromatherapie-koeln'] },
    { slug: ['ueber-wellnesstal'] }
  ]
  
  return pages
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params
  const slugPath = slug.join('/')
  const page = await getPageBySlug(slugPath)

  // If page not found or not published, return 404
  if (!page || page.status !== 'published') {
    notFound()
  }

  // Render the page using PageRenderer component
  return <PageRenderer page={page} />
}