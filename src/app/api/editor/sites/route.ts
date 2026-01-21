import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env['NEXT_PUBLIC_SUPABASE_URL']
const supabaseKey = process.env['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

const supabase = createClient(supabaseUrl, supabaseKey)

// GET /api/editor/sites?siteId=xxx - Get editor site data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const siteId = searchParams.get('siteId')

    if (!siteId) {
      return NextResponse.json(
        { success: false, error: 'siteId is required' },
        { status: 400 }
      )
    }

    // Try to find in pages table with slug pattern: editor-{siteId}
    const slug = `editor-${siteId}`
    const { data: page, error } = await supabase
      .from('pages')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error && error.code !== 'PGRST116') { // PGRST116 = not found
      console.error('Error fetching editor site:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to fetch site data' },
        { status: 500 }
      )
    }

    if (!page) {
      return NextResponse.json({
        success: true,
        data: null,
        message: 'Site not found'
      })
    }

    // Return the stored data
    return NextResponse.json({
      success: true,
      data: {
        siteId,
        ...page.content,
        id: page.id,
        updatedAt: page.updated_at
      }
    })

  } catch (error) {
    console.error('GET /api/editor/sites error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch site data' },
      { status: 500 }
    )
  }
}

// POST /api/editor/sites - Create or update editor site data
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { siteId, ...siteData } = body

    if (!siteId) {
      return NextResponse.json(
        { success: false, error: 'siteId is required' },
        { status: 400 }
      )
    }

    const slug = `editor-${siteId}`
    const now = new Date().toISOString()

    // Check if page exists
    const { data: existing } = await supabase
      .from('pages')
      .select('id')
      .eq('slug', slug)
      .single()

    if (existing) {
      // Update existing
      const { data: updated, error: updateError } = await supabase
        .from('pages')
        .update({
          content: {
            ...siteData,
            siteId,
            updatedAt: now
          },
          updated_at: now
        })
        .eq('id', existing.id)
        .select()
        .single()

      if (updateError) {
        console.error('Error updating editor site:', updateError)
        return NextResponse.json(
          { success: false, error: 'Failed to update site data' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          siteId,
          ...updated.content,
          id: updated.id,
          updatedAt: updated.updated_at
        },
        message: 'Site data updated successfully'
      })
    } else {
      // Create new
      const { data: created, error: createError } = await supabase
        .from('pages')
        .insert({
          slug,
          title: `Editor Site: ${siteId}`,
          template_type: 'editor',
          status: 'draft',
          content: {
            ...siteData,
            siteId,
            createdAt: now,
            updatedAt: now
          },
          created_at: now,
          updated_at: now
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating editor site:', createError)
        return NextResponse.json(
          { success: false, error: 'Failed to create site data' },
          { status: 500 }
        )
      }

      return NextResponse.json({
        success: true,
        data: {
          siteId,
          ...created.content,
          id: created.id,
          updatedAt: created.updated_at
        },
        message: 'Site data created successfully'
      })
    }

  } catch (error) {
    console.error('POST /api/editor/sites error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save site data' },
      { status: 500 }
    )
  }
}

// PUT /api/editor/sites - Update editor site data (same as POST, but explicit)
export async function PUT(request: NextRequest) {
  return POST(request)
}

