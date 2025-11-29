import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

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

// GET /api/pages/blocks - Get blocks for a page or block types
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pageId = searchParams.get('pageId')
    const getTypes = searchParams.get('types') === 'true'

    // Get available block types
    if (getTypes) {
      const { data: blockTypes, error } = await supabase
        .from('block_types')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error

      return NextResponse.json({
        success: true,
        data: blockTypes || []
      })
    }

    // Get blocks for a specific page
    if (pageId) {
      const { data: blocks, error } = await supabase
        .from('page_blocks')
        .select('*')
        .eq('page_id', pageId)
        .order('position', { ascending: true })

      if (error) throw error

      return NextResponse.json({
        success: true,
        data: blocks || []
      })
    }

    return NextResponse.json(
      { success: false, error: 'pageId or types parameter required' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Blocks GET error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blocks' },
      { status: 500 }
    )
  }
}

// POST /api/pages/blocks - Create new block
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
    const { page_id, block_type, content = {}, position, visible = true, custom_styles = {} } = body

    if (!page_id || !block_type) {
      return NextResponse.json(
        { success: false, error: 'page_id and block_type are required' },
        { status: 400 }
      )
    }

    // Get default content from block type if content is empty
    let finalContent = content
    if (Object.keys(content).length === 0) {
      const { data: blockType } = await supabase
        .from('block_types')
        .select('default_content')
        .eq('id', block_type)
        .single()

      if (blockType?.default_content) {
        finalContent = blockType.default_content
      }
    }

    // Calculate position if not provided
    let finalPosition = position
    if (finalPosition === undefined) {
      const { data: lastBlock } = await supabase
        .from('page_blocks')
        .select('position')
        .eq('page_id', page_id)
        .order('position', { ascending: false })
        .limit(1)
        .single()

      finalPosition = lastBlock ? lastBlock.position + 1 : 0
    }

    const { data: block, error } = await supabase
      .from('page_blocks')
      .insert({
        page_id,
        block_type,
        content: finalContent,
        position: finalPosition,
        visible,
        custom_styles
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: block,
      message: 'Block created successfully'
    })

  } catch (error) {
    console.error('Blocks POST error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create block' },
      { status: 500 }
    )
  }
}

// PUT /api/pages/blocks - Update block or reorder blocks
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

    // Batch reorder blocks
    if (body.reorder && Array.isArray(body.blocks)) {
      const updates = body.blocks.map((block: { id: string; position: number }) =>
        supabase
          .from('page_blocks')
          .update({ position: block.position })
          .eq('id', block.id)
      )

      await Promise.all(updates)

      return NextResponse.json({
        success: true,
        message: 'Blocks reordered successfully'
      })
    }

    // Single block update
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Block ID is required' },
        { status: 400 }
      )
    }

    const { data: block, error } = await supabase
      .from('page_blocks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: block,
      message: 'Block updated successfully'
    })

  } catch (error) {
    console.error('Blocks PUT error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update block' },
      { status: 500 }
    )
  }
}

// DELETE /api/pages/blocks - Delete block
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
        { success: false, error: 'Block ID is required' },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from('page_blocks')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: 'Block deleted successfully'
    })

  } catch (error) {
    console.error('Blocks DELETE error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete block' },
      { status: 500 }
    )
  }
}
