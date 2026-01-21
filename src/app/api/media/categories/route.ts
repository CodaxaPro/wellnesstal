import { NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase-server'

// GET - List all media categories
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('media_categories')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || []
    })

  } catch (error) {
    console.error('GET /api/media/categories error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
