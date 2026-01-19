import { NextRequest, NextResponse } from 'next/server'

import { verifyAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

// Types
interface ReorderRequest {
  newOrder: { id: string; order: number }[]
}

// PUT - Reorder categories
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

    const { data: existingCategories, error: fetchError } = await supabaseAdmin
      .from('categories')
      .select('id')
      .in('id', providedIds)

    if (fetchError) {
      console.error('Supabase fetch error:', fetchError)
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }

    const existingIds = (existingCategories || []).map(cat => cat.id)
    const invalidIds = providedIds.filter(id => !existingIds.includes(id))

    if (invalidIds.length > 0) {
      return NextResponse.json(
        { success: false, error: `Invalid category IDs: ${invalidIds.join(', ')}` },
        { status: 400 }
      )
    }

    // Validate order values
    const orders = body.newOrder.map(item => item.order)
    const hasValidOrders = orders.every(order =>
      typeof order === 'number' && order > 0
    )

    if (!hasValidOrders) {
      return NextResponse.json(
        { success: false, error: 'All order values must be positive numbers' },
        { status: 400 }
      )
    }

    // Update the order for each category
    const updates = body.newOrder.map(({ id, order }) =>
      supabaseAdmin
        .from('categories')
        .update({ order_num: order })
        .eq('id', id)
    )

    await Promise.all(updates)

    return NextResponse.json({
      success: true,
      message: 'Categories reordered successfully'
    })

  } catch (error) {
    console.error('PUT /api/categories/reorder error:', error)
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
