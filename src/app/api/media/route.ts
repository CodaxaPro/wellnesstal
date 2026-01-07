import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { verifyAdmin } from '@/lib/auth'

// Media file interface
interface MediaFile {
  id: string
  file_name: string
  original_name: string
  file_path: string
  thumbnail_path: string | null
  medium_path: string | null
  large_path: string | null
  file_size: number
  mime_type: string
  width: number | null
  height: number | null
  alt_text: string | null
  category: string
  tags: string[] | null
  blur_hash: string | null
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

// GET - List all media files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabaseAdmin
      .from('media_files')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (category && category !== 'all') {
      query = query.eq('category', category)
    }

    if (search) {
      query = query.or(`original_name.ilike.%${search}%,alt_text.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json(
        { success: false, error: 'Database error' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: data || [],
      total: count || 0,
      limit,
      offset
    })

  } catch (error) {
    console.error('GET /api/media error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Upload new media file
export async function POST(request: NextRequest) {
  try {
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const category = formData.get('category') as string || 'general'
    const altText = formData.get('alt_text') as string || ''

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml']
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Invalid file type. Allowed: JPG, PNG, WebP, GIF, SVG' },
        { status: 400 }
      )
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: 'File too large. Max size: 10MB' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${timestamp}-${randomStr}.${extension}`
    const filePath = `media/${category}/${fileName}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('wellnesstal')
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '31536000', // 1 year cache
        upsert: false
      })

    if (uploadError) {
      console.error('Upload error:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Failed to upload file' },
        { status: 500 }
      )
    }

    // Use our own domain URL (proxy through /api/images)
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wellnesstal.de'
    const proxyUrl = `${siteUrl}/api/images/${filePath}`

    // Save to database
    const { data: mediaFile, error: dbError } = await supabaseAdmin
      .from('media_files')
      .insert({
        file_name: fileName,
        original_name: file.name,
        file_path: proxyUrl, // Kendi domain'imizden
        thumbnail_path: publicUrl, // For now, same as original
        medium_path: publicUrl,
        large_path: publicUrl,
        file_size: file.size,
        mime_type: file.type,
        alt_text: altText || file.name.split('.')[0],
        category: category
      })
      .select()
      .single()

    if (dbError) {
      console.error('Database error:', dbError)
      // Clean up uploaded file
      await supabaseAdmin.storage.from('wellnesstal').remove([filePath])
      return NextResponse.json(
        { success: false, error: 'Failed to save media info' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: mediaFile
    })

  } catch (error) {
    console.error('POST /api/media error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete media file(s)
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
    const ids = searchParams.get('ids') // For bulk delete

    const idsToDelete = ids ? ids.split(',') : id ? [id] : []

    if (idsToDelete.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No file ID(s) provided' },
        { status: 400 }
      )
    }

    // Get file paths before deleting
    const { data: files } = await supabaseAdmin
      .from('media_files')
      .select('id, file_path, file_name')
      .in('id', idsToDelete)

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Files not found' },
        { status: 404 }
      )
    }

    // Delete from storage
    const storagePaths = files.map(f => {
      // Extract path from full URL
      const url = new URL(f.file_path)
      const pathParts = url.pathname.split('/storage/v1/object/public/wellnesstal/')
      return pathParts[1] || ''
    }).filter(p => p)

    if (storagePaths.length > 0) {
      await supabaseAdmin.storage.from('wellnesstal').remove(storagePaths)
    }

    // Delete from database
    const { error: deleteError } = await supabaseAdmin
      .from('media_files')
      .delete()
      .in('id', idsToDelete)

    if (deleteError) {
      console.error('Delete error:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Failed to delete files' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: `${idsToDelete.length} file(s) deleted`
    })

  } catch (error) {
    console.error('DELETE /api/media error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update media file metadata
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
    const { id, alt_text, category, is_featured, tags } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'File ID is required' },
        { status: 400 }
      )
    }

    const updateObj: Record<string, any> = {}
    if (alt_text !== undefined) updateObj.alt_text = alt_text
    if (category !== undefined) updateObj.category = category
    if (is_featured !== undefined) updateObj.is_featured = is_featured
    if (tags !== undefined) updateObj.tags = tags

    const { data, error } = await supabaseAdmin
      .from('media_files')
      .update(updateObj)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Update error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update file' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data
    })

  } catch (error) {
    console.error('PUT /api/media error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
