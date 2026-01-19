import { NextRequest, NextResponse } from 'next/server'

import { verifyAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

// Types
interface ReorderRequest {
  newOrder: { id: string; position: number }[]
}

// PUT - Reorder sections
export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body: ReorderRequest = await request.json()

    if (!body.newOrder || !Array.isArray(body.newOrder)) {
      return NextResponse.json(
        { success: false, error: 'Invalid reorder data' },
        { status: 400 }
      )
    }

    // Validate that all provided IDs exist
    const providedIds = body.newOrder.map(item => item.id)

    const { data: existingSections, error: fetchError } = await supabaseAdmin
      .from('homepage_sections')
      .select('id')
      .in('id', providedIds)

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }

    const existingIds = (existingSections || []).map(s => s.id)
    const invalidIds = providedIds.filter(id => !existingIds.includes(id))

    if (invalidIds.length > 0) {
      return NextResponse.json(
        { success: false, error: `Invalid section IDs: ${invalidIds.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate position values
    const positions = body.newOrder.map(item => item.position)
    const hasValidPositions = positions.every(pos =>
      typeof pos === 'number' && pos > 0
    )

    if (!hasValidPositions) {
      return NextResponse.json(
        { success: false, error: 'All position values must be positive numbers' },
        { status: 400 }
      )
    }

    // Update the position for each section
    const updates = body.newOrder.map(({ id, position }) =>
      supabaseAdmin
        .from('homepage_sections')
        .update({ position })
        .eq('id', id)
    )

    await Promise.all(updates)

    // Fetch updated sections
    const { data: updatedSections } = await supabaseAdmin
      .from('homepage_sections')
      .select('*')
      .order('position', { ascending: true })

    return NextResponse.json({
      success: true,
      message: 'Sections reordered successfully',
      data: updatedSections
    })

  } catch (error) {
    console.error('PUT /api/sections/reorder error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle other methods
export async function GET() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function POST() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}

export async function DELETE() {
  return NextResponse.json(
    { success: false, error: 'Method not allowed' },
    { status: 405 }
  )
}
