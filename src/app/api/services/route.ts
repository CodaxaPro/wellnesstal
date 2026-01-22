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
    const transformedData = allServices.map(s => ({
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
      // Button fields
      primaryButtonText: s.primary_button_text,
      primaryButtonType: s.primary_button_type,
      primaryButtonValue: s.primary_button_value,
      primaryButtonMessage: s.primary_button_message,
      secondaryButtonText: s.secondary_button_text,
      secondaryButtonType: s.secondary_button_type,
      secondaryButtonValue: s.secondary_button_value,
      secondaryButtonMessage: s.secondary_button_message,
      // Modal button fields
      primaryModalLeftButtonText: s.primary_modal_left_button_text,
      primaryModalLeftButtonType: s.primary_modal_left_button_type,
      primaryModalLeftButtonValue: s.primary_modal_left_button_value,
      primaryModalRightButtonText: s.primary_modal_right_button_text,
      primaryModalRightButtonType: s.primary_modal_right_button_type,
      primaryModalRightButtonValue: s.primary_modal_right_button_value,
      secondaryModalLeftButtonText: s.secondary_modal_left_button_text,
      secondaryModalLeftButtonType: s.secondary_modal_left_button_type,
      secondaryModalLeftButtonValue: s.secondary_modal_left_button_value,
      secondaryModalRightButtonText: s.secondary_modal_right_button_text,
      secondaryModalRightButtonType: s.secondary_modal_right_button_type,
      secondaryModalRightButtonValue: s.secondary_modal_right_button_value,
      createdAt: s.created_at,
      updatedAt: s.updated_at
    }))

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

    // Create new service
    const { data: newService, error } = await supabaseAdmin
      .from('services')
      .insert({
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
        tags: body.tags || [],
        // Button fields
        primary_button_text: body.primaryButtonText || null,
        primary_button_type: body.primaryButtonType || null,
        primary_button_value: body.primaryButtonValue || null,
        primary_button_message: body.primaryButtonMessage || null,
        secondary_button_text: body.secondaryButtonText || null,
        secondary_button_type: body.secondaryButtonType || null,
        secondary_button_value: body.secondaryButtonValue || null,
        secondary_button_message: body.secondaryButtonMessage || null,
        // Modal button fields
        primary_modal_left_button_text: body.primaryModalLeftButtonText || null,
        primary_modal_left_button_type: body.primaryModalLeftButtonType || null,
        primary_modal_left_button_value: body.primaryModalLeftButtonValue || null,
        primary_modal_right_button_text: body.primaryModalRightButtonText || null,
        primary_modal_right_button_type: body.primaryModalRightButtonType || null,
        primary_modal_right_button_value: body.primaryModalRightButtonValue || null,
        secondary_modal_left_button_text: body.secondaryModalLeftButtonText || null,
        secondary_modal_left_button_type: body.secondaryModalLeftButtonType || null,
        secondary_modal_left_button_value: body.secondaryModalLeftButtonValue || null,
        secondary_modal_right_button_text: body.secondaryModalRightButtonText || null,
        secondary_modal_right_button_type: body.secondaryModalRightButtonType || null,
        secondary_modal_right_button_value: body.secondaryModalRightButtonValue || null
      })
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    // Transform for frontend
    const transformed = {
      id: newService.id,
      title: newService.title,
      slug: newService.slug,
      description: newService.description,
      shortDescription: newService.short_description,
      longDescription: newService.long_description || newService.description,
      categoryId: newService.category_id,
      price: newService.price,
      duration: newService.duration,
      image: newService.image,
      active: newService.active,
      order: newService.order_num,
      benefits: newService.benefits || [],
      popular: newService.popular || false,
      featured: newService.featured || false,
      tags: newService.tags || [],
      // Button fields
      primaryButtonText: newService.primary_button_text,
      primaryButtonType: newService.primary_button_type,
      primaryButtonValue: newService.primary_button_value,
      primaryButtonMessage: newService.primary_button_message,
      secondaryButtonText: newService.secondary_button_text,
      secondaryButtonType: newService.secondary_button_type,
      secondaryButtonValue: newService.secondary_button_value,
      secondaryButtonMessage: newService.secondary_button_message,
      // Modal button fields
      primaryModalLeftButtonText: newService.primary_modal_left_button_text,
      primaryModalLeftButtonType: newService.primary_modal_left_button_type,
      primaryModalLeftButtonValue: newService.primary_modal_left_button_value,
      primaryModalRightButtonText: newService.primary_modal_right_button_text,
      primaryModalRightButtonType: newService.primary_modal_right_button_type,
      primaryModalRightButtonValue: newService.primary_modal_right_button_value,
      secondaryModalLeftButtonText: newService.secondary_modal_left_button_text,
      secondaryModalLeftButtonType: newService.secondary_modal_left_button_type,
      secondaryModalLeftButtonValue: newService.secondary_modal_left_button_value,
      secondaryModalRightButtonText: newService.secondary_modal_right_button_text,
      secondaryModalRightButtonType: newService.secondary_modal_right_button_type,
      secondaryModalRightButtonValue: newService.secondary_modal_right_button_value,
      createdAt: newService.created_at,
      updatedAt: newService.updated_at
    }

    return NextResponse.json({ success: true, data: transformed })

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
    // Button fields - only update if they exist in the request
    // Note: These columns may not exist in the database yet, so we'll skip them if they cause errors
    const buttonFields: Record<string, any> = {}
    if (updateData['primaryButtonText'] !== undefined) {
      buttonFields['primary_button_text'] = updateData['primaryButtonText'] || null
    }
    if (updateData['primaryButtonType'] !== undefined) {
      buttonFields['primary_button_type'] = updateData['primaryButtonType'] || null
    }
    if (updateData['primaryButtonValue'] !== undefined) {
      buttonFields['primary_button_value'] = updateData['primaryButtonValue'] || null
    }
    if (updateData['primaryButtonMessage'] !== undefined) {
      buttonFields['primary_button_message'] = updateData['primaryButtonMessage'] || null
    }
    if (updateData['secondaryButtonText'] !== undefined) {
      buttonFields['secondary_button_text'] = updateData['secondaryButtonText'] || null
    }
    if (updateData['secondaryButtonType'] !== undefined) {
      buttonFields['secondary_button_type'] = updateData['secondaryButtonType'] || null
    }
    if (updateData['secondaryButtonValue'] !== undefined) {
      buttonFields['secondary_button_value'] = updateData['secondaryButtonValue'] || null
    }
    if (updateData['secondaryButtonMessage'] !== undefined) {
      buttonFields['secondary_button_message'] = updateData['secondaryButtonMessage'] || null
    }
    // Modal button fields
    if (updateData['primaryModalLeftButtonText'] !== undefined) {
      buttonFields['primary_modal_left_button_text'] = updateData['primaryModalLeftButtonText'] || null
    }
    if (updateData['primaryModalLeftButtonType'] !== undefined) {
      buttonFields['primary_modal_left_button_type'] = updateData['primaryModalLeftButtonType'] || null
    }
    if (updateData['primaryModalLeftButtonValue'] !== undefined) {
      buttonFields['primary_modal_left_button_value'] = updateData['primaryModalLeftButtonValue'] || null
    }
    if (updateData['primaryModalRightButtonText'] !== undefined) {
      buttonFields['primary_modal_right_button_text'] = updateData['primaryModalRightButtonText'] || null
    }
    if (updateData['primaryModalRightButtonType'] !== undefined) {
      buttonFields['primary_modal_right_button_type'] = updateData['primaryModalRightButtonType'] || null
    }
    if (updateData['primaryModalRightButtonValue'] !== undefined) {
      buttonFields['primary_modal_right_button_value'] = updateData['primaryModalRightButtonValue'] || null
    }
    if (updateData['secondaryModalLeftButtonText'] !== undefined) {
      buttonFields['secondary_modal_left_button_text'] = updateData['secondaryModalLeftButtonText'] || null
    }
    if (updateData['secondaryModalLeftButtonType'] !== undefined) {
      buttonFields['secondary_modal_left_button_type'] = updateData['secondaryModalLeftButtonType'] || null
    }
    if (updateData['secondaryModalLeftButtonValue'] !== undefined) {
      buttonFields['secondary_modal_left_button_value'] = updateData['secondaryModalLeftButtonValue'] || null
    }
    if (updateData['secondaryModalRightButtonText'] !== undefined) {
      buttonFields['secondary_modal_right_button_text'] = updateData['secondaryModalRightButtonText'] || null
    }
    if (updateData['secondaryModalRightButtonType'] !== undefined) {
      buttonFields['secondary_modal_right_button_type'] = updateData['secondaryModalRightButtonType'] || null
    }
    if (updateData['secondaryModalRightButtonValue'] !== undefined) {
      buttonFields['secondary_modal_right_button_value'] = updateData['secondaryModalRightButtonValue'] || null
    }
    
    // Only add button fields to updateObj if they exist (columns may not exist in DB yet)
    // We'll try to update them, but if they fail, we'll continue without them
    Object.assign(updateObj, buttonFields)

    // Try to update, but if button fields cause errors, retry without them
    let updated: any
    let error: any
    
    // First attempt: try with all fields including button fields
    const firstAttempt = await supabaseAdmin
      .from('services')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single()
    
    updated = firstAttempt.data
    error = firstAttempt.error
    
    // If error and it's related to button columns, retry without button fields
    if (error && error.message && (
      error.message.includes('button') || 
      error.message.includes('column') ||
      error.code === '42703' // PostgreSQL undefined column error
    )) {
      console.warn('Button columns may not exist, retrying without button fields:', error.message)
      
      // Remove button fields and retry
      const updateObjWithoutButtons = { ...updateObj }
      Object.keys(updateObjWithoutButtons).forEach(key => {
        if (key.includes('button')) {
          delete updateObjWithoutButtons[key]
        }
      })
      
      const retryAttempt = await supabaseAdmin
        .from('services')
        .update(updateObjWithoutButtons)
        .eq('id', id)
        .select()
        .single()
      
      updated = retryAttempt.data
      error = retryAttempt.error
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

    // Transform for frontend
    const transformed = {
      id: updated.id,
      title: updated.title,
      slug: updated.slug,
      description: updated.description,
      shortDescription: updated.short_description,
      longDescription: updated.long_description || updated.description,
      categoryId: updated.category_id,
      price: updated.price,
      duration: updated.duration,
      image: updated.image,
      active: updated.active,
      order: updated.order_num,
      benefits: updated.benefits || [],
      popular: updated.popular || false,
      featured: updated.featured || false,
      tags: updated.tags || [],
      // Button fields
      primaryButtonText: updated.primary_button_text,
      primaryButtonType: updated.primary_button_type,
      primaryButtonValue: updated.primary_button_value,
      primaryButtonMessage: updated.primary_button_message,
      secondaryButtonText: updated.secondary_button_text,
      secondaryButtonType: updated.secondary_button_type,
      secondaryButtonValue: updated.secondary_button_value,
      secondaryButtonMessage: updated.secondary_button_message,
      // Modal button fields
      primaryModalLeftButtonText: updated.primary_modal_left_button_text,
      primaryModalLeftButtonType: updated.primary_modal_left_button_type,
      primaryModalLeftButtonValue: updated.primary_modal_left_button_value,
      primaryModalRightButtonText: updated.primary_modal_right_button_text,
      primaryModalRightButtonType: updated.primary_modal_right_button_type,
      primaryModalRightButtonValue: updated.primary_modal_right_button_value,
      secondaryModalLeftButtonText: updated.secondary_modal_left_button_text,
      secondaryModalLeftButtonType: updated.secondary_modal_left_button_type,
      secondaryModalLeftButtonValue: updated.secondary_modal_left_button_value,
      secondaryModalRightButtonText: updated.secondary_modal_right_button_text,
      secondaryModalRightButtonType: updated.secondary_modal_right_button_type,
      secondaryModalRightButtonValue: updated.secondary_modal_right_button_value,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    }

    return NextResponse.json({ success: true, data: transformed })

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
