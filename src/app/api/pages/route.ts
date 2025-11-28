import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { Page, CreatePageForm, UpdatePageForm, pageTemplates } from '@/types/pages'

// Mock data - In production, this would come from a database
let PAGES: Page[] = [
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

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
  } catch {
    return null
  }
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// GET /api/pages - Get all pages
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const template = searchParams.get('template')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let filteredPages = [...PAGES]

    // Filter by status
    if (status && status !== 'all') {
      filteredPages = filteredPages.filter(p => p.status === status)
    }

    // Filter by template
    if (template && template !== 'all') {
      filteredPages = filteredPages.filter(p => p.templateType === template)
    }

    // Sort by updated date (newest first)
    filteredPages.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())

    // Pagination
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedPages = filteredPages.slice(startIndex, endIndex)

    return NextResponse.json({
      success: true,
      data: {
        pages: paginatedPages,
        total: filteredPages.length,
        page,
        limit,
        totalPages: Math.ceil(filteredPages.length / limit)
      }
    })

  } catch (error) {
    console.error('Pages GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

// POST /api/pages - Create new page
export async function POST(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData: CreatePageForm = await request.json()

    // Validate required fields
    if (!formData.title || !formData.templateType) {
      return NextResponse.json(
        { success: false, error: 'Title and template are required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const slug = formData.slug || generateSlug(formData.title)

    // Check if slug already exists
    const existingPage = PAGES.find(p => p.slug === slug)
    if (existingPage) {
      return NextResponse.json(
        { success: false, error: 'A page with this slug already exists' },
        { status: 409 }
      )
    }

    // Get template
    const template = pageTemplates.find(t => t.id === formData.templateType)
    if (!template) {
      return NextResponse.json(
        { success: false, error: 'Invalid template type' },
        { status: 400 }
      )
    }

    // Create new page
    const newPage: Page = {
      id: Date.now().toString(),
      slug,
      title: formData.title,
      metaDescription: formData.metaDescription || '',
      metaTitle: formData.title,
      status: formData.status || 'draft',
      templateType: formData.templateType as any,
      content: template.defaultContent,
      seo: {
        metaTitle: formData.title,
        metaDescription: formData.metaDescription || '',
        keywords: [],
        noIndex: formData.status === 'draft',
        noFollow: false
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: formData.status === 'published' ? new Date().toISOString() : undefined
    }

    PAGES.push(newPage)

    return NextResponse.json({
      success: true,
      data: newPage,
      message: 'Page created successfully'
    })

  } catch (error) {
    console.error('Pages POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create page' },
      { status: 500 }
    )
  }
}

// PUT /api/pages - Update page
export async function PUT(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, ...updateData }: UpdatePageForm & { id: string } = await request.json()

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Page ID is required' },
        { status: 400 }
      )
    }

    const pageIndex = PAGES.findIndex(page => page.id === id)
    if (pageIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    // If slug is being updated, check for conflicts
    if (updateData.slug && updateData.slug !== PAGES[pageIndex].slug) {
      const existingPage = PAGES.find(p => p.slug === updateData.slug && p.id !== id)
      if (existingPage) {
        return NextResponse.json(
          { success: false, error: 'A page with this slug already exists' },
          { status: 409 }
        )
      }
    }

    // Update page
    const updatedPage = {
      ...PAGES[pageIndex],
      ...updateData,
      updatedAt: new Date().toISOString(),
      publishedAt: updateData.status === 'published' && PAGES[pageIndex].status !== 'published' 
        ? new Date().toISOString() 
        : PAGES[pageIndex].publishedAt
    }

    // Ensure SEO fields are properly typed
    if (updatedPage.seo) {
      updatedPage.seo = {
        metaTitle: updatedPage.seo.metaTitle || updatedPage.metaTitle,
        metaDescription: updatedPage.seo.metaDescription || updatedPage.metaDescription,
        keywords: updatedPage.seo.keywords || [],
        ogImage: updatedPage.seo.ogImage,
        canonicalUrl: updatedPage.seo.canonicalUrl,
        noIndex: updatedPage.seo.noIndex || false,
        noFollow: updatedPage.seo.noFollow || false
      }
    }

    PAGES[pageIndex] = updatedPage as Page

    return NextResponse.json({
      success: true,
      data: PAGES[pageIndex],
      message: 'Page updated successfully'
    })

  } catch (error) {
    console.error('Pages PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update page' },
      { status: 500 }
    )
  }
}

// DELETE /api/pages - Delete page
export async function DELETE(request: NextRequest) {
  try {
    const user = verifyToken(request)
    if (!user || (user as any).role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Page ID is required' },
        { status: 400 }
      )
    }

    const pageIndex = PAGES.findIndex(page => page.id === id)
    if (pageIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    PAGES.splice(pageIndex, 1)

    return NextResponse.json({
      success: true,
      message: 'Page deleted successfully'
    })

  } catch (error) {
    console.error('Pages DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete page' },
      { status: 500 }
    )
  }
}