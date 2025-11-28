import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { verifyAdmin } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

// File path for fallback (existing content.json)
const DATA_FILE_PATH = path.join(process.cwd(), 'data', 'content.json')

// Read content from JSON file (fallback)
function readContentFromFile(): any[] {
  try {
    if (!fs.existsSync(DATA_FILE_PATH)) {
      return []
    }
    const fileContent = fs.readFileSync(DATA_FILE_PATH, 'utf-8')
    return JSON.parse(fileContent)
  } catch (error) {
    console.error('Error reading content file:', error)
    return []
  }
}

// GET /api/content - Get all content or specific section
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')

    // Try Supabase first
    let query = supabaseAdmin.from('content').select('*')

    if (section) {
      query = query.eq('section', section)
    }

    const { data: dbContent, error } = await query

    // If Supabase works and has data
    if (!error && dbContent && dbContent.length > 0) {
      // Transform for frontend compatibility
      const transformedData = dbContent.map(c => ({
        id: c.id,
        section: c.section,
        title: c.title,
        description: c.description,
        content: c.content,
        defaults: c.defaults,
        lastUpdated: c.last_updated,
        updatedBy: c.updated_by
      }))

      if (section) {
        return NextResponse.json({ success: true, data: transformedData[0] })
      }
      return NextResponse.json({ success: true, data: transformedData })
    }

    // Fallback to file-based content
    console.log('Falling back to file-based content')
    const fileContent = readContentFromFile()

    if (section) {
      const content = fileContent.find((c: any) => c.section === section)
      if (!content) {
        return NextResponse.json(
          { success: false, error: 'Section not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({ success: true, data: content })
    }

    return NextResponse.json({ success: true, data: fileContent })

  } catch (error) {
    console.error('GET /api/content error:', error)

    // Final fallback to file
    try {
      const fileContent = readContentFromFile()
      const { searchParams } = new URL(request.url)
      const section = searchParams.get('section')

      if (section) {
        const content = fileContent.find((c: any) => c.section === section)
        return NextResponse.json({ success: true, data: content || null })
      }
      return NextResponse.json({ success: true, data: fileContent })
    } catch {
      return NextResponse.json(
        { success: false, error: 'Failed to fetch content' },
        { status: 500 }
      )
    }
  }
}

// PUT /api/content - Update a content section
export async function PUT(request: NextRequest) {
  try {
    // Verify admin for write operations
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { id, section, content } = await request.json()

    if (!id && !section) {
      return NextResponse.json(
        { success: false, error: 'ID or section is required' },
        { status: 400 }
      )
    }

    // Try to update in Supabase
    let query = supabaseAdmin.from('content')

    // Find the record first
    const findQuery = id
      ? supabaseAdmin.from('content').select('*').eq('id', id).single()
      : supabaseAdmin.from('content').select('*').eq('section', section).single()

    const { data: existing, error: findError } = await findQuery

    if (findError || !existing) {
      // If not found in Supabase, try to insert (migration from file)
      if (section) {
        const { data: inserted, error: insertError } = await supabaseAdmin
          .from('content')
          .upsert({
            section,
            title: section,
            description: '',
            content,
            last_updated: new Date().toISOString(),
            updated_by: 'Admin'
          }, { onConflict: 'section' })
          .select()
          .single()

        if (!insertError && inserted) {
          return NextResponse.json({
            success: true,
            data: {
              id: inserted.id,
              section: inserted.section,
              title: inserted.title,
              description: inserted.description,
              content: inserted.content,
              lastUpdated: inserted.last_updated,
              updatedBy: inserted.updated_by
            },
            message: 'Content created successfully'
          })
        }
      }

      return NextResponse.json(
        { success: false, error: 'Content section not found' },
        { status: 404 }
      )
    }

    // Update existing record
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('content')
      .update({
        content,
        last_updated: new Date().toISOString(),
        updated_by: 'Admin'
      })
      .eq('id', existing.id)
      .select()
      .single()

    if (updateError) {
      console.error('Supabase update error:', updateError)
      return NextResponse.json(
        { success: false, error: 'Failed to update content' },
        { status: 500 }
      )
    }

    // Transform for frontend
    const transformed = {
      id: updated.id,
      section: updated.section,
      title: updated.title,
      description: updated.description,
      content: updated.content,
      defaults: updated.defaults,
      lastUpdated: updated.last_updated,
      updatedBy: updated.updated_by
    }

    return NextResponse.json({
      success: true,
      data: transformed,
      message: 'Content updated successfully'
    })

  } catch (error) {
    console.error('PUT /api/content error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    )
  }
}
