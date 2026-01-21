import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

import { logger } from '@/lib/logger'
import { apiRateLimiter, rateLimit } from '@/lib/rate-limit'

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to verify JWT token
function verifyToken(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader?.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.substring(7)
  try {
    return jwt.verify(token, process.env['JWT_SECRET'] || 'fallback-secret')
  } catch {
    return null
  }
}

// GET /api/pages - Get all pages or single page by slug
export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, apiRateLimiter)
    if (!rateLimitResult.allowed) {
      logger.warn('API rate limit exceeded', {
        endpoint: '/api/pages',
        remaining: rateLimitResult.remaining
      })
      return NextResponse.json(
        { error: 'Too many requests, please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      )
    }
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
        .eq('active', true) // Only show active pages
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

        // Debug: log brief preview of blocks returned for troubleshooting
        try {
          // eslint-disable-next-line no-console
          console.log('[DEBUG] GET /api/pages - returning blocks preview:', blocks?.map(b => ({ id: b.id, title: b.content?.title || null })).slice(0, 20))
        } catch (_e) {
          // eslint-disable-next-line no-console
          console.log('[DEBUG] GET /api/pages - blocks preview unavailable')
        }

        return NextResponse.json({
          success: true,
          data: { ...page, blocks: blocks || [] }
        })
      }

      return NextResponse.json({ success: true, data: page })
    }

    // List all pages (for admin)
    const categoryId = searchParams.get('categoryId')
    const categorySlug = searchParams.get('categorySlug')

    // Build base query
    let query = supabase
      .from('pages')
      .select('*', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (status && status !== 'all') {
      query = query.eq('status', status)
    }

    // Filter by category ID
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    // Filter by category slug
    if (categorySlug && !categoryId) {
      try {
        const { data: category } = await supabase
          .from('page_categories')
          .select('id')
          .eq('slug', categorySlug)
          .eq('active', true)
          .single()

        if (category) {
          query = query.eq('category_id', category.id)
        }
      } catch (_e) {
        // Category filter failed, continue without filter
      }
    }

    // Execute query
    const { data: pages, error, count } = await query

    if (error) {
      throw error
    }

    // Fetch categories separately and merge (more reliable than join)
    let pagesWithCategories = pages || []
    if (pages && pages.length > 0) {
      try {
        const { data: allCategories } = await supabase
          .from('page_categories')
          .select('id, name, slug, color, icon')

        if (allCategories && allCategories.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const categoryMap = new Map(allCategories.map((c: any) => [c.id, c]))
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pagesWithCategories = pages.map((page: any) => ({
            ...page,
            page_categories: page.category_id ? categoryMap.get(page.category_id) || null : null
          }))
        } else {
          // No categories exist yet, just return pages without category data
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          pagesWithCategories = pages.map((page: any) => ({
            ...page,
            page_categories: null
          }))
        }
      } catch (_e) {
        // Categories table might not exist yet, that's okay - return pages without category data
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        pagesWithCategories = pages.map((page: any) => ({
          ...page,
          page_categories: null
        }))
      }
    }

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: {
        pages: pagesWithCategories || [],
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

// Helper function to generate unique slug
async function generateUniqueSlug(baseSlug: string): Promise<string> {
  let finalSlug = baseSlug
  let counter = 1

  while (true) {
    // eslint-disable-next-line no-await-in-loop
    const { data: existing } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', finalSlug)
      .single()

    if (!existing) {
      return finalSlug
    }

    // Try with -copy, -copy-2, -copy-3, etc.
    if (counter === 1) {
      finalSlug = `${baseSlug}-copy`
    } else {
      finalSlug = `${baseSlug}-copy-${counter}`
    }
    counter++

    // Safety limit
    if (counter > 100) {
      finalSlug = `${baseSlug}-copy-${Date.now()}`
      break
    }
  }

  return finalSlug
}

// POST /api/pages - Create new page or duplicate existing page
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
    const { duplicate, title, slug, status = 'draft', template = 'default', meta_title, meta_description, category_id, active } = body

    // Handle duplicate page
    if (duplicate) {
      const sourcePageId = duplicate

      // Fetch source page with blocks
      const { data: sourcePage, error: fetchError } = await supabase
        .from('pages')
        .select('*')
        .eq('id', sourcePageId)
        .single()

      if (fetchError || !sourcePage) {
        return NextResponse.json(
          { success: false, error: 'Source page not found' },
          { status: 404 }
        )
      }

      // Fetch source page blocks
      const { data: sourceBlocks } = await supabase
        .from('page_blocks')
        .select('*')
        .eq('page_id', sourcePageId)
        .order('position', { ascending: true })

      // Generate unique slug
      const baseSlug = sourcePage.slug || sourcePage.title
        .toLowerCase()
        .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()

      const uniqueSlug = await generateUniqueSlug(baseSlug)

      // Create new page
      const newTitle = title || `${sourcePage.title} (Copy)`
      const { data: newPage, error: createError } = await supabase
        .from('pages')
        .insert({
          title: newTitle,
          slug: uniqueSlug,
          status: 'draft', // Always create duplicates as draft
          template: sourcePage.template || 'default',
          meta_title: sourcePage.meta_title || newTitle,
          meta_description: sourcePage.meta_description || null,
          category_id: sourcePage.category_id || null,
          published_at: null,
          created_by: (user as Record<string, unknown>)?.['username'] as string || 'Admin'
        })
        .select()
        .single()

      if (createError) {
        throw createError
      }

      // Duplicate blocks
      if (sourceBlocks && sourceBlocks.length > 0) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const newBlocks = sourceBlocks.map((block: any, index: number) => ({
          page_id: newPage.id,
          block_type: block.block_type,
          content: block.content,
          position: index,
          visible: block.visible !== false
        }))

        const { error: blocksError } = await supabase
          .from('page_blocks')
          .insert(newBlocks)

        if (blocksError) {
          console.error('Error duplicating blocks:', blocksError)
          // Continue even if blocks fail - page is created
        }
      }

      // Fetch category separately if needed
      let pageWithCategory = newPage
      if (newPage?.category_id) {
        try {
          const { data: category } = await supabase
            .from('page_categories')
            .select('id, name, slug, color, icon')
            .eq('id', newPage.category_id)
            .single()

          if (category) {
            pageWithCategory = { ...newPage, page_categories: category }
          }
        } catch (_e) {
          // Category fetch failed, continue without category
        }
      }

      return NextResponse.json({
        success: true,
        data: pageWithCategory || newPage,
        message: 'Page duplicated successfully'
      })
    }

    // Regular page creation
    if (!title) {
      return NextResponse.json(
        { success: false, error: 'Title is required' },
        { status: 400 }
      )
    }

    // Generate slug if not provided
    const baseSlug = slug || title
      .toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()

    const finalSlug = await generateUniqueSlug(baseSlug)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const insertData: any = {
      title,
      slug: finalSlug,
      status,
      template,
      meta_title: meta_title || title,
      meta_description,
      category_id: category_id || null,
      published_at: status === 'published' ? new Date().toISOString() : null,
      created_by: (user as Record<string, unknown>)?.['username'] as string || 'Admin'
    }

    // Add active field if provided, default to true for published pages
    if (active !== undefined) {
      insertData.active = active
    } else if (status === 'published') {
      insertData.active = true
    }

    const { data: page, error } = await supabase
      .from('pages')
      .insert(insertData)
      .select()
      .single()

    // Fetch category separately if needed
    let pageWithCategory = page
    if (page && category_id) {
      try {
        const { data: category } = await supabase
          .from('page_categories')
          .select('id, name, slug, color, icon')
          .eq('id', category_id)
          .single()

        if (category) {
          pageWithCategory = { ...page, page_categories: category }
        }
      } catch (_e) {
        // Category fetch failed, continue without category
      }
    }

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: pageWithCategory || page,
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
        // eslint-disable-next-line require-atomic-updates
        updateData.published_at = new Date().toISOString()
      }
    }

    // eslint-disable-next-line require-atomic-updates
    updateData.updated_by = (user as Record<string, unknown>)?.['username'] as string || 'Admin'

    // Remove undefined values to avoid Supabase errors
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key]
      }
    })

    const { data: page, error } = await supabase
      .from('pages')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    // If error is about missing column (active), try without it
    if (error?.message?.includes('active')) {
      console.warn('Active column not found, attempting update without it')
      const { active: _active, ...updateDataWithoutActive } = updateData
      const { data: pageRetry, error: retryError } = await supabase
        .from('pages')
        .update(updateDataWithoutActive)
        .eq('id', id)
        .select()
        .single()

      if (retryError) {
        throw retryError
      }

      // Return page with active set to true (default) if column doesn't exist
      const pageWithDefaultActive = { ...pageRetry, active: true }

      // Fetch category separately if needed
      let pageWithCategory = pageWithDefaultActive
      if (pageWithDefaultActive && (updateDataWithoutActive.category_id !== undefined || pageWithDefaultActive.category_id)) {
        try {
          const categoryId = updateDataWithoutActive.category_id || pageWithDefaultActive.category_id
          if (categoryId) {
            const { data: category } = await supabase
              .from('page_categories')
              .select('id, name, slug, color, icon')
              .eq('id', categoryId)
              .single()

            if (category) {
              pageWithCategory = { ...pageWithDefaultActive, page_categories: category }
            }
          } else {
            pageWithCategory = { ...pageWithDefaultActive, page_categories: null }
          }
        } catch (_e) {
          // Category fetch failed, continue without category
        }
      }

      return NextResponse.json({
        success: true,
        data: pageWithCategory || pageWithDefaultActive,
        message: 'Page updated successfully (active column not available - please run migration)'
      })
    }

    // Fetch category separately if needed
    let pageWithCategory = page
    if (page && (updateData.category_id !== undefined || page.category_id)) {
      try {
        const categoryId = updateData.category_id || page.category_id
        if (categoryId) {
          const { data: category } = await supabase
            .from('page_categories')
            .select('id, name, slug, color, icon')
            .eq('id', categoryId)
            .single()

          if (category) {
            pageWithCategory = { ...page, page_categories: category }
          }
        } else {
          pageWithCategory = { ...page, page_categories: null }
        }
      } catch (_e) {
        // Category fetch failed, continue without category
      }
    }

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: pageWithCategory || page,
      message: 'Page updated successfully'
    })

  } catch (error: unknown) {
    const errorObj = error instanceof Error ? error : { message: 'Unknown error', stack: undefined }
    console.error('Pages PUT error:', errorObj.message)

    // Check if error is about missing column
    if (errorObj.message && (errorObj.message.includes('active') || errorObj.message.includes('column') || errorObj.message.includes('does not exist'))) {
      return NextResponse.json(
        {
          success: false,
          error: 'Active column not found. Please run migration: supabase/migrations/016_add_pages_active_field.sql',
          details: errorObj.message
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: errorObj.message || 'Failed to update page',
        details: process.env['NODE_ENV'] === 'development' ? errorObj.stack : undefined
      },
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
