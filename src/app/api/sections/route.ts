import { NextRequest, NextResponse } from 'next/server'

import { verifyAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

// Types
interface HomepageSection {
  id: string
  section_key: string
  section_name: string
  section_icon: string | null
  position: number
  enabled: boolean
  created_at: string
  updated_at: string
}

interface SectionResponse {
  success: boolean
  data?: HomepageSection | HomepageSection[]
  error?: string
}

// GET - Fetch all sections ordered by position
export async function GET() {
  try {
    const { data: sections, error } = await supabaseAdmin
      .from('homepage_sections')
      .select('*')
      .order('position', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }

    const response: SectionResponse = {
      success: true,
      data: sections || []
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('GET /api/sections error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new section
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { section_key, section_name, section_icon, enabled = true } = body

    if (!section_key || !section_name) {
      return NextResponse.json(
        { success: false, error: 'section_key and section_name are required' },
        { status: 400 }
      )
    }

    // Check if section_key already exists
    const { data: existing } = await supabaseAdmin
      .from('homepage_sections')
      .select('id')
      .eq('section_key', section_key)
      .single()

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Section with this key already exists' },
        { status: 409 }
      )
    }

    // Get max position
    const { data: maxPosResult } = await supabaseAdmin
      .from('homepage_sections')
      .select('position')
      .order('position', { ascending: false })
      .limit(1)
      .single()

    const newPosition = (maxPosResult?.position || 0) + 1

    // Insert new section
    const { data: newSection, error } = await supabaseAdmin
      .from('homepage_sections')
      .insert({
        section_key,
        section_name,
        section_icon: section_icon || '📄',
        position: newPosition,
        enabled
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: newSection })

  } catch (error) {
    console.error('POST /api/sections error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update a section (enable/disable)
export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, enabled } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Section ID is required' },
        { status: 400 }
      )
    }

    // Check if section exists
    const { data: existing } = await supabaseAdmin
      .from('homepage_sections')
      .select('id')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 }
      )
    }

    // Update section
    const updateObj: Record<string, any> = {}
    if (enabled !== undefined) {
updateObj.enabled = enabled
}
    if (body.section_name) {
updateObj.section_name = body.section_name
}
    if (body.section_icon) {
updateObj.section_icon = body.section_icon
}

    const { data: updated, error } = await supabaseAdmin
      .from('homepage_sections')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: updated })

  } catch (error) {
    console.error('PUT /api/sections error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a section
export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Section ID is required' },
        { status: 400 }
      )
    }

    // Check if section exists
    const { data: existing } = await supabaseAdmin
      .from('homepage_sections')
      .select('id, position')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Section not found' },
        { status: 404 }
      )
    }

    // Delete the section
    const { error } = await supabaseAdmin
      .from('homepage_sections')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }

    // Reorder remaining sections
    const { data: remaining } = await supabaseAdmin
      .from('homepage_sections')
      .select('id, position')
      .order('position', { ascending: true })

    if (remaining && remaining.length > 0) {
      for (let i = 0; i < remaining.length; i++) {
        await supabaseAdmin
          .from('homepage_sections')
          .update({ position: i + 1 })
          .eq('id', remaining[i].id)
      }
    }

    return NextResponse.json({ success: true, message: 'Section deleted' })

  } catch (error) {
    console.error('DELETE /api/sections error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
