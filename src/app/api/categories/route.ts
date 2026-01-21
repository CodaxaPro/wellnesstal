import { NextRequest, NextResponse } from 'next/server'

import { verifyAdmin } from '@/lib/auth'
import { DBCategory, supabaseAdmin } from '@/lib/supabase-server'

// Types
interface CategoryResponse {
  success: boolean
  data?: DBCategory | DBCategory[]
  error?: string
  stats?: {
    total: number
    active: number
    inactive: number
    totalServices: number
  }
}

// Helper function to generate slug
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/ä/g, 'ae')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// GET - Fetch categories with filtering and sorting
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const active = searchParams.get('active')
    const sortBy = searchParams.get('sortBy') || 'order_num'
    const sortOrder = searchParams.get('sortOrder') || 'asc'

    // Build query
    let query = supabaseAdmin.from('categories').select('*')

    // Search filter
    if (search) {
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }

    // Active filter
    if (active !== null && active !== '') {
      query = query.eq('active', active === 'true')
    }

    // Sorting
    const sortColumn = sortBy === 'order' ? 'order_num' : sortBy === 'serviceCount' ? 'service_count' : sortBy
    query = query.order(sortColumn, { ascending: sortOrder === 'asc' })

    const { data: categories, error } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }

    // Calculate stats
    const allCategories = categories || []
    const stats = {
      total: allCategories.length,
      active: allCategories.filter(cat => cat.active).length,
      inactive: allCategories.filter(cat => !cat.active).length,
      totalServices: allCategories.reduce((sum, cat) => sum + (cat.service_count || 0), 0)
    }

    // Transform data for frontend compatibility
    const transformedData = allCategories.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      slug: cat.slug,
      color: cat.color,
      icon: cat.icon,
      order: cat.order_num,
      active: cat.active,
      serviceCount: cat.service_count,
      createdAt: cat.created_at,
      updatedAt: cat.updated_at
    }))

    const response: CategoryResponse = {
      success: true,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: transformedData as any,
      stats
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('GET /api/categories error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create new category
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

    // Validation
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Kategori adı gereklidir ve en az 2 karakter olmalıdır' },
        { status: 400 }
      )
    }

    // Check for duplicate names
    const { data: existing } = await supabaseAdmin
      .from('categories')
      .select('id')
      .ilike('name', body.name.trim())
      .single()

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Bu kategori adı zaten kullanılıyor' },
        { status: 400 }
      )
    }

    // Create new category
    const { data: newCategory, error } = await supabaseAdmin
      .from('categories')
      .insert({
        name: body.name.trim(),
        description: body.description?.trim() || '',
        slug: generateSlug(body.name),
        color: body.color || '#10B981',
        icon: body.icon || '🌿',
        order_num: body.order || 0,
        active: body.active ?? true,
        service_count: 0
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

    // Transform for frontend
    const transformed = {
      id: newCategory.id,
      name: newCategory.name,
      description: newCategory.description,
      slug: newCategory.slug,
      color: newCategory.color,
      icon: newCategory.icon,
      order: newCategory.order_num,
      active: newCategory.active,
      serviceCount: newCategory.service_count,
      createdAt: newCategory.created_at,
      updatedAt: newCategory.updated_at
    }

    return NextResponse.json({ success: true, data: transformed })

  } catch (error) {
    console.error('POST /api/categories error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update category
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
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Check if category exists
    const { data: existing } = await supabaseAdmin
      .from('categories')
      .select('id')
      .eq('id', id)
      .single()

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Kategori bulunamadı' },
        { status: 404 }
      )
    }

    // Validation for name if provided
    if (updateData['name']) {
      const nameValue = String(updateData['name']).trim()
      if (nameValue.length < 2) {
        return NextResponse.json(
          { success: false, error: 'Kategori adı en az 2 karakter olmalıdır' },
          { status: 400 }
        )
      }

      // Check for duplicate names (excluding current)
      const { data: duplicate } = await supabaseAdmin
        .from('categories')
        .select('id')
        .ilike('name', nameValue)
        .neq('id', id)
        .single()

      if (duplicate) {
        return NextResponse.json(
          { success: false, error: 'Bu kategori adı zaten kullanılıyor' },
          { status: 400 }
        )
      }
    }

    // Prepare update object
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateObj: Record<string, any> = {}
    if (updateData['name']) {
      updateObj['name'] = String(updateData['name']).trim()
      updateObj['slug'] = generateSlug(String(updateData['name']))
    }
    if (updateData['description'] !== undefined) {
      updateObj['description'] = updateData['description'] ? String(updateData['description']).trim() : null
    }
    if (updateData['color'] !== undefined) {
      updateObj['color'] = updateData['color']
    }
    if (updateData['icon'] !== undefined) {
      updateObj['icon'] = updateData['icon']
    }
    if (updateData['order'] !== undefined) {
      updateObj['order_num'] = updateData['order']
    }
    if (updateData['active'] !== undefined) {
      updateObj['active'] = updateData['active']
    }

    const { data: updated, error } = await supabaseAdmin
      .from('categories')
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

    // Transform for frontend
    const transformed = {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      slug: updated.slug,
      color: updated.color,
      icon: updated.icon,
      order: updated.order_num,
      active: updated.active,
      serviceCount: updated.service_count,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at
    }

    return NextResponse.json({ success: true, data: transformed })

  } catch (error) {
    console.error('PUT /api/categories error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete category
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
    const force = searchParams.get('force') === 'true'

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Get category with service count
    const { data: category, error: fetchError } = await supabaseAdmin
      .from('categories')
      .select('*')
      .eq('id', id)
      .single()

    if (fetchError || !category) {
      return NextResponse.json(
        { success: false, error: 'Kategori bulunamadı' },
        { status: 404 }
      )
    }

    // Check service count
    if (!force && (category.service_count || 0) > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Bu kategoride ${category.service_count} hizmet bulunuyor. Önce hizmetleri başka kategorilere taşıyın veya silin.`,
          code: 'CATEGORY_HAS_SERVICES',
          data: {
            categoryId: id,
            categoryName: category.name,
            serviceCount: category.service_count
          }
        },
        { status: 400 }
      )
    }

    // Delete category
    const { error: deleteError } = await supabaseAdmin
      .from('categories')
      .delete()
      .eq('id', id)

    if (deleteError) {
      console.error('Supabase delete error:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `"${category.name}" kategorisi başarıyla silindi.`
    })

  } catch (error) {
    console.error('DELETE /api/categories error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
