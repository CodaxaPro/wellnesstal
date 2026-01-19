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

// GET /api/pages/categories - Get all categories
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') !== 'false'

    // Check if table exists first
    let query = supabase
      .from('page_categories')
      .select('*')
      .order('order_num', { ascending: true })

    if (activeOnly) {
      query = query.eq('active', true)
    }

    const { data: categories, error } = await query

    // If table doesn't exist, return empty array instead of error
    if (error) {
      // Check if error is about table not existing
      if (error.message?.includes('does not exist') || error.message?.includes('relation') || error.code === '42P01') {
        console.log('page_categories table does not exist yet, returning empty array')
        return NextResponse.json({
          success: true,
          data: [],
          message: 'Categories table not found. Please run migration 014_page_categories.sql'
        })
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      data: categories || []
    })

  } catch (error: any) {
    console.error('Categories GET error:', error)
    // If it's a table not found error, return empty array
    if (error?.message?.includes('does not exist') || error?.message?.includes('relation') || error?.code === '42P01') {
      return NextResponse.json({
        success: true,
        data: [],
        message: 'Categories table not found. Please run migration 014_page_categories.sql'
      })
    }
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/pages/categories - Create new category
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
    const { name, slug, description, color, icon, order_num, active = true } = body

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: 'Name and slug are required' },
        { status: 400 }
      )
    }

    // Check if table exists first
    try {
      const { data: existing, error: checkError } = await supabase
        .from('page_categories')
        .select('id')
        .eq('slug', slug)
        .single()

      if (checkError && !checkError.message?.includes('does not exist') && !checkError.message?.includes('relation') && checkError.code !== '42P01') {
        // Real error, not table missing
        if (existing) {
          return NextResponse.json(
            { success: false, error: 'A category with this slug already exists' },
            { status: 409 }
          )
        }
      } else if (checkError && (checkError.message?.includes('does not exist') || checkError.message?.includes('relation') || checkError.code === '42P01')) {
        return NextResponse.json(
          { success: false, error: 'Categories table not found. Please run migration 014_page_categories.sql in Supabase SQL Editor' },
          { status: 503 }
        )
      } else if (existing) {
        return NextResponse.json(
          { success: false, error: 'A category with this slug already exists' },
          { status: 409 }
        )
      }
    } catch (e: any) {
      if (e?.message?.includes('does not exist') || e?.message?.includes('relation') || e?.code === '42P01') {
        return NextResponse.json(
          { success: false, error: 'Categories table not found. Please run migration 014_page_categories.sql in Supabase SQL Editor' },
          { status: 503 }
        )
      }
      throw e
    }

    // Get max order_num if not provided
    let finalOrderNum = order_num
    if (finalOrderNum === undefined) {
      try {
        const { data: maxOrder, error: maxOrderError } = await supabase
          .from('page_categories')
          .select('order_num')
          .order('order_num', { ascending: false })
          .limit(1)
          .single()

        if (maxOrderError && (maxOrderError.message?.includes('does not exist') || maxOrderError.message?.includes('relation') || maxOrderError.code === '42P01')) {
          return NextResponse.json(
            { success: false, error: 'Categories table not found. Please run migration 014_page_categories.sql in Supabase SQL Editor' },
            { status: 503 }
          )
        }
        finalOrderNum = maxOrder ? maxOrder.order_num + 1 : 0
      } catch (e: any) {
        if (e?.message?.includes('does not exist') || e?.message?.includes('relation') || e?.code === '42P01') {
          return NextResponse.json(
            { success: false, error: 'Categories table not found. Please run migration 014_page_categories.sql in Supabase SQL Editor' },
            { status: 503 }
          )
        }
        throw e
      }
    }

    const { data: category, error } = await supabase
      .from('page_categories')
      .insert({
        name,
        slug,
        description,
        color: color || '#9CAF88',
        icon: icon || '📄',
        order_num: finalOrderNum,
        active
      })
      .select()
      .single()

    if (error) {
      if (error.message?.includes('does not exist') || error.message?.includes('relation') || error.code === '42P01') {
        return NextResponse.json(
          { success: false, error: 'Categories table not found. Please run migration 014_page_categories.sql in Supabase SQL Editor' },
          { status: 503 }
        )
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category created successfully'
    })

  } catch (error: any) {
    console.error('Categories POST error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create category' },
      { status: 500 }
    )
  }
}

// PUT /api/pages/categories - Update category
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
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Check slug uniqueness if updating slug
    if (updateData.slug) {
      try {
        const { data: existing, error: checkError } = await supabase
          .from('page_categories')
          .select('id')
          .eq('slug', updateData.slug)
          .neq('id', id)
          .single()

        if (checkError && (checkError.message?.includes('does not exist') || checkError.message?.includes('relation') || checkError.code === '42P01')) {
          return NextResponse.json(
            { success: false, error: 'Categories table not found. Please run migration 014_page_categories.sql in Supabase SQL Editor' },
            { status: 503 }
          )
        }
        if (existing) {
          return NextResponse.json(
            { success: false, error: 'A category with this slug already exists' },
            { status: 409 }
          )
        }
      } catch (e: any) {
        if (e?.message?.includes('does not exist') || e?.message?.includes('relation') || e?.code === '42P01') {
          return NextResponse.json(
            { success: false, error: 'Categories table not found. Please run migration 014_page_categories.sql in Supabase SQL Editor' },
            { status: 503 }
          )
        }
        throw e
      }
    }

    const { data: category, error } = await supabase
      .from('page_categories')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      if (error.message?.includes('does not exist') || error.message?.includes('relation') || error.code === '42P01') {
        return NextResponse.json(
          { success: false, error: 'Categories table not found. Please run migration 014_page_categories.sql in Supabase SQL Editor' },
          { status: 503 }
        )
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      data: category,
      message: 'Category updated successfully'
    })

  } catch (error: any) {
    console.error('Categories PUT error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/pages/categories - Delete category
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
        { success: false, error: 'Category ID is required' },
        { status: 400 }
      )
    }

    // Check if category has pages
    try {
      const { data: pages, error: pagesError } = await supabase
        .from('pages')
        .select('id')
        .eq('category_id', id)
        .limit(1)

      if (pagesError && !pagesError.message?.includes('does not exist') && !pagesError.message?.includes('relation') && pagesError.code !== '42P01') {
        throw pagesError
      }

      if (pages && pages.length > 0) {
        return NextResponse.json(
          { success: false, error: 'Cannot delete category with existing pages. Please reassign or delete pages first.' },
          { status: 409 }
        )
      }
    } catch (e: any) {
      if (e?.message?.includes('does not exist') || e?.message?.includes('relation') || e?.code === '42P01') {
        return NextResponse.json(
          { success: false, error: 'Categories table not found. Please run migration 014_page_categories.sql in Supabase SQL Editor' },
          { status: 503 }
        )
      }
      throw e
    }

    const { error } = await supabase
      .from('page_categories')
      .delete()
      .eq('id', id)

    if (error) {
      if (error.message?.includes('does not exist') || error.message?.includes('relation') || error.code === '42P01') {
        return NextResponse.json(
          { success: false, error: 'Categories table not found. Please run migration 014_page_categories.sql in Supabase SQL Editor' },
          { status: 503 }
        )
      }
      throw error
    }

    return NextResponse.json({
      success: true,
      message: 'Category deleted successfully'
    })

  } catch (error: any) {
    console.error('Categories DELETE error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete category' },
      { status: 500 }
    )
  }
}

