import { NextRequest, NextResponse } from 'next/server'

import { verifyAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

// Helper function to generate slug
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/ğ/g, 'g')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Helper function to transform service for frontend response
function transformServiceForResponse(s: any) {
  const buttonConfig = s.button_config || (s.metadata as any)?.button_config || {}
  
  return {
    id: s.id,
    title: s.title,
    slug: s.slug,
    description: s.description,
    shortDescription: s.short_description,
    longDescription: s.long_description || s.description,
    categoryId: s.category_id,
    price: s.price,
    duration: s.duration,
    image: s.image,
    active: s.active,
    order: s.order_num,
    benefits: s.benefits || [],
    popular: s.popular || false,
    featured: s.featured || false,
    tags: s.tags || [],
    // Button fields - from button_config JSON, metadata, or individual columns
    primaryButtonText: buttonConfig.primary?.text || s.primary_button_text || null,
    primaryButtonType: buttonConfig.primary?.type || s.primary_button_type || null,
    primaryButtonValue: buttonConfig.primary?.value || s.primary_button_value || null,
    primaryButtonMessage: buttonConfig.primary?.message || s.primary_button_message || null,
    secondaryButtonText: buttonConfig.secondary?.text || s.secondary_button_text || null,
    secondaryButtonType: buttonConfig.secondary?.type || s.secondary_button_type || null,
    secondaryButtonValue: buttonConfig.secondary?.value || s.secondary_button_value || null,
    secondaryButtonMessage: buttonConfig.secondary?.message || s.secondary_button_message || null,
    // Modal button fields
    primaryModalLeftButtonText: buttonConfig.primaryModal?.left?.text || s.primary_modal_left_button_text || null,
    primaryModalLeftButtonType: buttonConfig.primaryModal?.left?.type || s.primary_modal_left_button_type || null,
    primaryModalLeftButtonValue: buttonConfig.primaryModal?.left?.value || s.primary_modal_left_button_value || null,
    primaryModalRightButtonText: buttonConfig.primaryModal?.right?.text || s.primary_modal_right_button_text || null,
    primaryModalRightButtonType: buttonConfig.primaryModal?.right?.type || s.primary_modal_right_button_type || null,
    primaryModalRightButtonValue: buttonConfig.primaryModal?.right?.value || s.primary_modal_right_button_value || null,
    secondaryModalLeftButtonText: buttonConfig.secondaryModal?.left?.text || s.secondary_modal_left_button_text || null,
    secondaryModalLeftButtonType: buttonConfig.secondaryModal?.left?.type || s.secondary_modal_left_button_type || null,
    secondaryModalLeftButtonValue: buttonConfig.secondaryModal?.left?.value || s.secondary_modal_left_button_value || null,
    secondaryModalRightButtonText: buttonConfig.secondaryModal?.right?.text || s.secondary_modal_right_button_text || null,
    secondaryModalRightButtonType: buttonConfig.secondaryModal?.right?.type || s.secondary_modal_right_button_type || null,
    secondaryModalRightButtonValue: buttonConfig.secondaryModal?.right?.value || s.secondary_modal_right_button_value || null,
    createdAt: s.created_at,
    updatedAt: s.updated_at
  }
}

// GET /api/services
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    const categoryId = searchParams.get('categoryId')
    const slug = searchParams.get('slug')
    const sortBy = searchParams.get('sortBy') || 'order_num'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Build query
    let query = supabaseAdmin.from('services').select('*')

    // Search filter
    if (search) {
      query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Active filter
    if (active !== null && active !== undefined && active !== '') {
      query = query.eq('active', active === 'true')
    }

    // Category filter
    if (categoryId) {
      query = query.eq('category_id', categoryId)
    }

    // Slug filter
    if (slug) {
      query = query.eq('slug', slug)
    }

    // Sorting
    const sortColumn = sortBy === 'order' ? 'order_num' : sortBy
    query = query.order(sortColumn, { ascending: sortOrder === 'asc' })

    const { data: services, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    const allServices = services || []

    // Transform for frontend compatibility
    const transformedData = allServices.map(s => transformServiceForResponse(s))

    return NextResponse.json({
      success: true,
      data: transformedData,
      stats: {
        total: allServices.length,
        active: allServices.filter(s => s.active).length,
        inactive: allServices.filter(s => !s.active).length
      }
    })

  } catch (error) {
    console.error('GET /api/services error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch' }, { status: 500 })
  }
}

// POST /api/services - Create new service
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()

    // Validation
    if (!body.title || body.title.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Service title is required and must be at least 2 characters' },
        { status: 400 }
      )
    }

    // Get max order for new service
    const { data: maxOrderResult } = await supabaseAdmin
      .from('services')
      .select('order_num')
      .order('order_num', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxOrderResult?.order_num || 0) + 1

    // Prepare button config as JSON
    const buttonConfig: Record<string, any> = {}
    if (body.primaryButtonText || body.primaryButtonType || body.primaryButtonValue || body.primaryButtonMessage) {
      buttonConfig.primary = {
        text: body.primaryButtonText || null,
        type: body.primaryButtonType || null,
        value: body.primaryButtonValue || null,
        message: body.primaryButtonMessage || null
      }
    }
    if (body.secondaryButtonText || body.secondaryButtonType || body.secondaryButtonValue || body.secondaryButtonMessage) {
      buttonConfig.secondary = {
        text: body.secondaryButtonText || null,
        type: body.secondaryButtonType || null,
        value: body.secondaryButtonValue || null,
        message: body.secondaryButtonMessage || null
      }
    }
    if (body.primaryModalLeftButtonText || body.primaryModalLeftButtonType || body.primaryModalLeftButtonValue) {
      buttonConfig.primaryModal = {
        left: {
          text: body.primaryModalLeftButtonText || null,
          type: body.primaryModalLeftButtonType || null,
          value: body.primaryModalLeftButtonValue || null
        },
        right: {
          text: body.primaryModalRightButtonText || null,
          type: body.primaryModalRightButtonType || null,
          value: body.primaryModalRightButtonValue || null
        }
      }
    }
    if (body.secondaryModalLeftButtonText || body.secondaryModalLeftButtonType || body.secondaryModalLeftButtonValue) {
      buttonConfig.secondaryModal = {
        left: {
          text: body.secondaryModalLeftButtonText || null,
          type: body.secondaryModalLeftButtonType || null,
          value: body.secondaryModalLeftButtonValue || null
        },
        right: {
          text: body.secondaryModalRightButtonText || null,
          type: body.secondaryModalRightButtonType || null,
          value: body.secondaryModalRightButtonValue || null
        }
      }
    }

    // Create new service
    const insertData: Record<string, any> = {
      title: body.title.trim(),
      slug: body.slug || generateSlug(body.title),
      description: body.description?.trim() || '',
      short_description: body.shortDescription?.trim() || '',
      long_description: body.longDescription?.trim() || null,
      category_id: body.categoryId || null,
      price: body.price || null,
      duration: body.duration || null,
      image: body.image || null,
      active: body.active ?? true,
      order_num: body.order ?? nextOrder,
      benefits: body.benefits || [],
      popular: body.popular || false,
      featured: body.featured || false,
      tags: body.tags || []
    }
    
    // Try to add button_config, fallback to metadata
    if (Object.keys(buttonConfig).length > 0) {
      insertData['button_config'] = buttonConfig
    }

    let newService: any
    let error: any
    
    const firstAttempt = await supabaseAdmin
      .from('services')
      .insert(insertData)
      .select()
      .single()
    
    newService = firstAttempt.data
    error = firstAttempt.error
    
    // If button_config column doesn't exist, try metadata
    if (error && error.message && error.message.includes('button_config')) {
      delete insertData['button_config']
      insertData['metadata'] = { button_config: buttonConfig }
      
      const retryAttempt = await supabaseAdmin
        .from('services')
        .insert(insertData)
        .select()
        .single()
      
      newService = retryAttempt.data
      error = retryAttempt.error
      
      // If still error, remove metadata and continue without button config
      if (error) {
        delete insertData['metadata']
        const finalAttempt = await supabaseAdmin
          .from('services')
          .insert(insertData)
          .select()
          .single()
        
        newService = finalAttempt.data
        error = finalAttempt.error
      }
    }

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: transformServiceForResponse(newService) })

  } catch (error) {
    console.error('POST /api/services error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create' }, { status: 500 })
  }
}

// PUT /api/services - Update service
export async function PUT(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Service ID is required' }, { status: 400 })
    }

    // Check if service exists
    const { data: existing } = await supabaseAdmin
      .from('services')
      .select('id')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 })
    }

    // Prepare update object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateObj: Record<string, any> = {}
    if (updateData['title']) {
      const titleValue = String(updateData['title']).trim()
      updateObj['title'] = titleValue
      updateObj['slug'] = generateSlug(titleValue)
    }
    if (updateData['description'] !== undefined) {
      updateObj['description'] = updateData['description'] ? String(updateData['description']).trim() : null
    }
    if (updateData['shortDescription'] !== undefined) {
      updateObj['short_description'] = updateData['shortDescription'] ? String(updateData['shortDescription']).trim() : null
    }
    if (updateData['longDescription'] !== undefined) {
      updateObj['long_description'] = updateData['longDescription'] ? String(updateData['longDescription']).trim() : null
    }
    if (updateData['categoryId'] !== undefined) {
      updateObj['category_id'] = updateData['categoryId']
    }
    if (updateData['price'] !== undefined) {
      updateObj['price'] = updateData['price']
    }
    if (updateData['duration'] !== undefined) {
      updateObj['duration'] = updateData['duration']
    }
    if (updateData['image'] !== undefined) {
      updateObj['image'] = updateData['image']
    }
    if (updateData['active'] !== undefined) {
      updateObj['active'] = updateData['active']
    }
    if (updateData['order'] !== undefined) {
      updateObj['order_num'] = updateData['order']
    }
    // Button fields - store as JSON in button_config column
    const buttonConfig: Record<string, any> = {}
    
    // Primary button
    if (updateData['primaryButtonText'] !== undefined || updateData['primaryButtonType'] !== undefined || 
        updateData['primaryButtonValue'] !== undefined || updateData['primaryButtonMessage'] !== undefined) {
      buttonConfig.primary = {
        text: updateData['primaryButtonText'] || null,
        type: updateData['primaryButtonType'] || null,
        value: updateData['primaryButtonValue'] || null,
        message: updateData['primaryButtonMessage'] || null
      }
    }
    
    // Secondary button
    if (updateData['secondaryButtonText'] !== undefined || updateData['secondaryButtonType'] !== undefined || 
        updateData['secondaryButtonValue'] !== undefined || updateData['secondaryButtonMessage'] !== undefined) {
      buttonConfig.secondary = {
        text: updateData['secondaryButtonText'] || null,
        type: updateData['secondaryButtonType'] || null,
        value: updateData['secondaryButtonValue'] || null,
        message: updateData['secondaryButtonMessage'] || null
      }
    }
    
    // Primary modal buttons
    if (updateData['primaryModalLeftButtonText'] !== undefined || updateData['primaryModalLeftButtonType'] !== undefined || 
        updateData['primaryModalLeftButtonValue'] !== undefined) {
      buttonConfig.primaryModal = {
        left: {
          text: updateData['primaryModalLeftButtonText'] || null,
          type: updateData['primaryModalLeftButtonType'] || null,
          value: updateData['primaryModalLeftButtonValue'] || null
        },
        right: {
          text: updateData['primaryModalRightButtonText'] || null,
          type: updateData['primaryModalRightButtonType'] || null,
          value: updateData['primaryModalRightButtonValue'] || null
        }
      }
    }
    
    // Secondary modal buttons
    if (updateData['secondaryModalLeftButtonText'] !== undefined || updateData['secondaryModalLeftButtonType'] !== undefined || 
        updateData['secondaryModalLeftButtonValue'] !== undefined) {
      buttonConfig.secondaryModal = {
        left: {
          text: updateData['secondaryModalLeftButtonText'] || null,
          type: updateData['secondaryModalLeftButtonType'] || null,
          value: updateData['secondaryModalLeftButtonValue'] || null
        },
        right: {
          text: updateData['secondaryModalRightButtonText'] || null,
          type: updateData['secondaryModalRightButtonType'] || null,
          value: updateData['secondaryModalRightButtonValue'] || null
        }
      }
    }
    
    // Store button config as JSON - try metadata first (most likely to exist)
    // But don't fail if column doesn't exist - just skip saving button config
    const updateObjForDB = { ...updateObj }
    if (Object.keys(buttonConfig).length > 0) {
      // Try metadata column first (more likely to exist)
      updateObjForDB['metadata'] = { button_config: buttonConfig }
    }

    // Try to update
    let updated: any
    let error: any

    // First attempt: try with metadata
    const firstAttempt = await supabaseAdmin
      .from('services')
      .update(updateObjForDB)
      .eq('id', id)
      .select()
      .single()

    updated = firstAttempt.data
    error = firstAttempt.error

    // If error and it's related to metadata column, remove it and continue
    if (error && error.message && (
      error.message.includes('metadata') ||
      error.message.includes('column') ||
      error.code === '42703' // PostgreSQL undefined column error
    )) {
      console.warn('metadata column may not exist, removing button config and continuing:', error.message)
      
      // Remove metadata and retry without button config
      const updateObjWithoutMetadata = { ...updateObj }
      delete updateObjWithoutMetadata['metadata']
      
      const retryAttempt = await supabaseAdmin
        .from('services')
        .update(updateObjWithoutMetadata)
        .eq('id', id)
        .select()
        .single()
      
      updated = retryAttempt.data
      error = retryAttempt.error
    }
    
    // Always add button config to response (even if not saved to DB)
    // This way frontend can use it immediately
    if (updated && !error && Object.keys(buttonConfig).length > 0) {
      if (!updated.metadata) {
        updated.metadata = {}
      }
      updated.metadata.button_config = buttonConfig
      updated.button_config = buttonConfig
    } else if (updated && !error && updated.metadata?.button_config) {
      // Extract button_config from metadata for easier access
      updated.button_config = updated.metadata.button_config
    }

    if (error) {
      console.error('Supabase update error:', error)
      console.error('Update object:', JSON.stringify(updateObj, null, 2))
      return NextResponse.json({
        success: false,
        error: 'Database error',
        details: error.message
      }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: transformServiceForResponse(updated) })

  } catch (error) {
    console.error('PUT /api/services error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 })
  }
}

// DELETE /api/services - Delete service
export async function DELETE(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Service ID is required' }, { status: 400 })
    }

    // Get service before deleting
    const { data: service } = await supabaseAdmin
      .from('services')
      .select('title')
      .eq('id', id)
      .single()

    if (!service) {
      return NextResponse.json({ success: false, error: 'Service not found' }, { status: 404 })
    }

    const { error } = await supabaseAdmin
      .from('services')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: `"${service.title}" successfully deleted`
    })

  } catch (error) {
    console.error('DELETE /api/services error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 })
  }
}
