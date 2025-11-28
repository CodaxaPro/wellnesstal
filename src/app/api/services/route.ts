import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { verifyAdmin } from '@/lib/auth'

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
      categoryId: s.category_id,
      price: s.price,
      duration: s.duration,
      image: s.image,
      active: s.active,
      order: s.order_num,
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
        category_id: body.categoryId || null,
        price: body.price || null,
        duration: body.duration || null,
        image: body.image || null,
        active: body.active ?? true,
        order_num: body.order ?? nextOrder
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
      categoryId: newService.category_id,
      price: newService.price,
      duration: newService.duration,
      image: newService.image,
      active: newService.active,
      order: newService.order_num,
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
    const updateObj: Record<string, any> = {}
    if (updateData.title) {
      updateObj.title = updateData.title.trim()
      updateObj.slug = generateSlug(updateData.title)
    }
    if (updateData.description !== undefined) updateObj.description = updateData.description?.trim()
    if (updateData.shortDescription !== undefined) updateObj.short_description = updateData.shortDescription?.trim()
    if (updateData.categoryId !== undefined) updateObj.category_id = updateData.categoryId
    if (updateData.price !== undefined) updateObj.price = updateData.price
    if (updateData.duration !== undefined) updateObj.duration = updateData.duration
    if (updateData.image !== undefined) updateObj.image = updateData.image
    if (updateData.active !== undefined) updateObj.active = updateData.active
    if (updateData.order !== undefined) updateObj.order_num = updateData.order

    const { data: updated, error } = await supabaseAdmin
      .from('services')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ success: false, error: 'Database error' }, { status: 500 })
    }

    // Transform for frontend
    const transformed = {
      id: updated.id,
      title: updated.title,
      slug: updated.slug,
      description: updated.description,
      shortDescription: updated.short_description,
      categoryId: updated.category_id,
      price: updated.price,
      duration: updated.duration,
      image: updated.image,
      active: updated.active,
      order: updated.order_num,
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
