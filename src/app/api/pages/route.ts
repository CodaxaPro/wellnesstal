import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

// GET /api/pages - Get all pages or single page by slug
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const slug = searchParams.get('slug')
    const id = searchParams.get('id')
    const status = searchParams.get('status')
    const withBlocks = searchParams.get('withBlocks') === 'true'
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Single page by slug (for frontend)
    if (slug) {
      const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      if (error || !page) {
        return NextResponse.json(
          { success: false, error: 'Page not found' },
          { status: 404 }
        )
      }

      // Get blocks for this page
      const { data: blocks } = await supabase
        .from('page_blocks')
        .select('*')
        .eq('page_id', page.id)
        .eq('visible', true)
        .order('position', { ascending: true })

      return NextResponse.json({
        success: true,
        data: { ...page, blocks: blocks || [] }
      })
    }

    // Single page by ID (for admin)
    if (id) {
      const { data: page, error } = await supabase
        .from('pages')
        .select('*')
        .eq('id', id)
        .single()

      if (error || !page) {
        return NextResponse.json(
          { success: false, error: 'Page not found' },
          { status: 404 }
        )
      }

      if (withBlocks) {
        const { data: blocks } = await supabase
          .from('page_blocks')
          .select('*')
          .eq('page_id', page.id)
          .order('position', { ascending: true })

        return NextResponse.json({
          success: true,
          data: { ...page, blocks: blocks || [] }
        })
      }

      return NextResponse.json({ success: true, data: page })
    }

    // List all pages (for admin)
    let query = supabase
      .from('pages')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    const { data: pages, error, count } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: {
        pages: pages || [],
        total: count || 0,
        limit,
        offset
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
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { title, slug, status = 'draft', template = 'default', meta_title, meta_description } = body

    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const finalSlug = slug || title
      .toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    // Check if slug exists
    const { data: existing } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', finalSlug)
      .single()

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'A page with this slug already exists' },
        { status: 409 }
      )
    }

    const { data: page, error } = await supabase
      .from('pages')
      .insert({
        title,
        slug: finalSlug,
        status,
        template,
        meta_title: meta_title || title,
        meta_description,
        published_at: status === 'published' ? new Date().toISOString() : null,
        created_by: (user as any).username
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: page,
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
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Page ID is required' },
        { status: 400 }
      )
    }

    // Check slug uniqueness if updating slug
    if (updateData.slug) {
      const { data: existing } = await supabase
        .from('pages')
        .select('id')
        .eq('slug', updateData.slug)
        .neq('id', id)
        .single()

      if (existing) {
        return NextResponse.json(
          { success: false, error: 'A page with this slug already exists' },
          { status: 409 }
        )
      }
    }

    // Handle publish timestamp
    if (updateData.status === 'published') {
      const { data: currentPage } = await supabase
        .from('pages')
        .select('status, published_at')
        .eq('id', id)
        .single()

      if (currentPage?.status !== 'published' && !currentPage?.published_at) {
        updateData.published_at = new Date().toISOString()
      }
    }

    updateData.updated_by = (user as any).username

    const { data: page, error } = await supabase
      .from('pages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: page,
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
    if (!user) {
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

    // Blocks will be deleted automatically due to CASCADE
    const { error } = await supabase
      .from('pages')
      .delete()
      .eq('id', id)

    if (error) {
      throw error
    }

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
