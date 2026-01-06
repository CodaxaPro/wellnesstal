import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'
import { apiRateLimiter, rateLimit } from '@/lib/rate-limit'
import { logger } from '@/lib/logger'

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

// Deep merge helper: merges source into target but skips empty-string/null/undefined
function deepMerge(target: any, source: any): any {
  const out: any = { ...(target || {}) }
  if (!source || typeof source !== 'object') return out
  
  // Fields that should always be updated, even if empty (user explicitly cleared them)
  const alwaysUpdateFields = ['title', 'subtitle', 'description', 'mainTitle', 'badge', 'primaryButton', 'primaryButtonLink', 'secondaryButton', 'secondaryButtonLink', 'trustIndicator', 'trustIndicatorSubtext', 'trustIndicatorSecondary', 'trustIndicatorSecondarySubtext']
  
  // Array fields that should always be preserved (even if empty)
  const alwaysUpdateArrays = ['buttons', 'hideOnMobile']
  
  // Nested object fields that should be fully merged (preserve all nested properties)
  const nestedObjectFields = [
    'titleHighlight', 'titleStyles',
    'image', 'video', 'imageStyles', 'gradientColors', 'backgroundOverlay',
    'animations', 'responsive', 'elementAlignments', 'trustIndicator', 'padding', 'scrollIndicator', 'imageFloatingElements'
  ]
  
  for (const key of Object.keys(source)) {
    const s = source[key]
    
    // Special handling: Always update array fields (descriptions, buttons, etc.)
    if (alwaysUpdateArrays.includes(key) && Array.isArray(s)) {
      out[key] = s // Always preserve arrays, even if empty
      continue
    }
    
    // Special handling: Always update these fields if they exist in source (even if empty or null)
    // This allows users to explicitly clear fields like subtitle, buttons, etc.
    if (alwaysUpdateFields.includes(key)) {
      out[key] = s // Always preserve, even if empty string or null
      continue
    }
    
    // Skip null/undefined for other fields (but not for alwaysUpdateFields above)
    if (s === null || s === undefined) {
      continue
    }
    
    // Special handling: Deep merge nested objects to preserve all properties
    if (nestedObjectFields.includes(key) && typeof s === 'object' && s !== null && !Array.isArray(s)) {
      out[key] = deepMerge((target || {})[key] || {}, s)
      continue
    }
    
    // Skip empty strings for other fields (to avoid accidental overwrites)
    if (s === '') {
      continue
    }
    
    if (typeof s === 'object' && s !== null && !Array.isArray(s)) {
      out[key] = deepMerge((target || {})[key], s)
    } else {
      out[key] = s
    }
  }
  return out
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
  const startTime = Date.now()
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, apiRateLimiter)
    if (!rateLimitResult.allowed) {
      logger.warn('API rate limit exceeded', {
        endpoint: '/api/pages/blocks',
        method: 'POST',
        remaining: rateLimitResult.remaining
      })
      return NextResponse.json(
        { success: false, error: 'Too many requests, please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '100',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString()
          }
        }
      )
    }

    const user = verifyToken(request)
    if (!user) {
      logger.warn('Unauthorized block creation attempt')
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    logger.debug('Block creation request', {
      page_id: body.page_id,
      block_type: body.block_type
    })
    // Extract an optional client-supplied timestamp (same logic as POST)
    const incomingTsRaw = (body && (body.clientUpdatedAt || body._clientUpdatedAt)) || (body?.content?._meta?.clientUpdatedAt)
    const incomingTs = incomingTsRaw ? Number(incomingTsRaw) : null

    // Extract an optional client-supplied timestamp to guard against
    // older/stale updates overwriting newer content. Clients send
    // `clientUpdatedAt` as a numeric epoch millis value when updating.
    const { page_id, block_type, content = {}, position, visible = true, custom_styles = {} } = body

    if (!page_id || !block_type) {
      logger.warn('Block creation failed: missing required fields', {
        hasPageId: !!page_id,
        hasBlockType: !!block_type
      })
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
    if (finalPosition === undefined || finalPosition === null) {
      const { data: lastBlocks, error: positionError } = await supabase
        .from('page_blocks')
        .select('position')
        .eq('page_id', page_id)
        .order('position', { ascending: false })
        .limit(1)

      if (positionError) {
        logger.warn('Error fetching last block position', positionError, { page_id })
      }

      const lastBlock = lastBlocks && lastBlocks.length > 0 ? lastBlocks[0] : null
      finalPosition = lastBlock && typeof lastBlock.position === 'number' 
        ? lastBlock.position + 1 
        : 0
      
      logger.debug('Calculated block position', {
        page_id,
        finalPosition,
        lastBlockPosition: lastBlock?.position
      })
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

    if (error) {
      logger.error('Database error creating block', error as Error, {
        page_id,
        block_type
      })
      throw error
    }

    logger.info('Block created successfully', {
      blockId: block.id,
      page_id,
      block_type,
      duration: Date.now() - startTime
    })

    return NextResponse.json({
      success: true,
      data: block,
      message: 'Block created successfully'
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    logger.error('Blocks POST error', error as Error, {
      errorMessage,
      duration: Date.now() - startTime
    })
    
    return NextResponse.json(
      { 
        success: false, 
        error: errorMessage || 'Failed to create block',
        details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
      },
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
    const { id, clientUpdatedAt, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Block ID is required' },
        { status: 400 }
      )
    }

    // Extract client timestamp for conflict resolution
    const incomingTsRaw = clientUpdatedAt || updateData.content?._meta?.clientUpdatedAt
    const incomingTs = incomingTsRaw ? Number(incomingTsRaw) : null

    // Debug: log incoming update payload to help track persistence issues
    console.log('[DEBUG] PUT /api/pages/blocks - incoming updateData:', JSON.stringify(updateData).slice(0, 10000))

    // If content is provided, fetch existing block and deep-merge to avoid
    // accidental overwrites with empty/default values coming from client mounts.
    if (updateData.content) {
      try {
        const { data: existing } = await supabase
          .from('page_blocks')
          .select('content')
          .eq('id', id)
          .single()

        // If both client and stored have timestamps, ignore the incoming
        // update when it's older or equal to the stored value.
        const existingTsRaw = existing?.content?._meta?.clientUpdatedAt
        const existingTs = existingTsRaw ? Number(existingTsRaw) : null
        if (incomingTs && existingTs && incomingTs <= existingTs) {
          console.log('[DEBUG] PUT /api/pages/blocks - incoming update older than stored; skipping update for id:', id, 'incomingTs:', incomingTs, 'existingTs:', existingTs)
          return NextResponse.json({ success: true, data: existing, message: 'No update: older client timestamp' })
        }

        // Deep merge to preserve all fields
        const merged = deepMerge(existing?.content || {}, updateData.content)
        
        // CRITICAL: Ensure buttons array is fully preserved with all properties
        if (updateData.content?.buttons !== undefined) {
          merged.buttons = updateData.content.buttons
        }
        
        // stamp merged content with the incoming timestamp (or now)
        merged._meta = merged._meta || {}
        merged._meta.clientUpdatedAt = incomingTs || Date.now()

        updateData.content = merged
        console.log('[DEBUG] PUT /api/pages/blocks - merged content preview:', JSON.stringify(updateData.content).slice(0, 2000))
        // If merged content is identical to existing content, skip the DB update
        try {
          if (existing && JSON.stringify(existing.content || {}) === JSON.stringify(merged || {})) {
            console.log('[DEBUG] PUT /api/pages/blocks - no changes detected, skipping update for id:', id)
            return NextResponse.json({ success: true, data: existing, message: 'No changes' })
          }
        } catch (e) {
          // If stringify fails, continue to update
        }
      } catch (e) {
        console.log('[DEBUG] PUT /api/pages/blocks - could not fetch existing block for merge', e)
      }
    }

    const { data: block, error } = await supabase
      .from('page_blocks')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    // Debug: log result of update
    console.log('[DEBUG] PUT /api/pages/blocks - result block id:', id, 'error:', error ? error.message : null)
    if (block) {
      try {
        console.log('[DEBUG] PUT /api/pages/blocks - saved content preview:', JSON.stringify(block.content).slice(0, 2000))
      } catch (e) {
        console.log('[DEBUG] PUT /api/pages/blocks - saved content (non-serializable)')
      }
    }
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
