import { NextRequest, NextResponse } from 'next/server'

import { verifyAdmin } from '@/lib/auth'
import { supabaseAdmin } from '@/lib/supabase-server'

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB (artırıldı)
const STORAGE_BUCKET = 'wellnesstal'

// POST - Upload image to Supabase Storage (requires authentication)
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string || 'general'

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Keine Datei hochgeladen' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: 'Ungültiger Dateityp. Erlaubt: JPG, PNG, WebP, GIF' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { success: false, error: `Datei zu groß. Maximum: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      )
    }

    // Sanitize folder name
    const sanitizedFolder = folder.replace(/[^a-zA-Z0-9-_]/g, '')

    // Create unique filename
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const filename = `${timestamp}-${randomStr}.${ext}`
    const filePath = `uploads/${sanitizedFolder}/${filename}`

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, buffer, {
        contentType: file.type,
        cacheControl: '31536000', // 1 year cache
        upsert: true // Overwrite if exists
      })

    if (uploadError) {
      console.error('Supabase Storage upload error:', uploadError)
      return NextResponse.json(
        { success: false, error: 'Fehler beim Hochladen zu Supabase Storage' },
        { status: 500 }
      )
    }

    // /uploads/ formatında URL döndür
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wellnesstal.de'
    const urlPath = filePath.replace('uploads/', '') // 'uploads/about/file.jpg' → 'about/file.jpg'
    const ownDomainUrl = `${siteUrl}/uploads/${urlPath}`

    return NextResponse.json({
      success: true,
      data: {
        url: ownDomainUrl, // wellnesstal.de/uploads/about/... formatında
        filename,
        size: file.size,
        type: file.type,
        path: filePath
      }
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { success: false, error: 'Fehler beim Hochladen' },
      { status: 500 }
    )
  }
}

// DELETE - Remove image from Supabase Storage (requires authentication)
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAdmin = await verifyAdmin(request)
    if (!isAdmin) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - Admin access required' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(request.url)
    const fileUrl = searchParams.get('url')

    if (!fileUrl) {
      return NextResponse.json(
        { success: false, error: 'Keine Datei-URL angegeben' },
        { status: 400 }
      )
    }

    // Extract path from Supabase Storage URL
    let filePath = ''
    
    // If it's a Supabase Storage URL, extract the path
    if (fileUrl.includes('/storage/v1/object/public/')) {
      const urlParts = fileUrl.split('/storage/v1/object/public/wellnesstal/')
      if (urlParts.length > 1) {
        filePath = urlParts[1]
      }
    } else if (fileUrl.startsWith('/uploads/')) {
      // Legacy local path
      filePath = fileUrl.replace('/uploads/', 'uploads/')
    } else {
      return NextResponse.json(
        { success: false, error: 'Ungültiger Dateipfad' },
        { status: 400 }
      )
    }

    if (!filePath || filePath.includes('..')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file path' },
        { status: 400 }
      )
    }

    // Delete from Supabase Storage
    const { error: deleteError } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .remove([filePath])

    if (deleteError) {
      console.error('Supabase Storage delete error:', deleteError)
      return NextResponse.json(
        { success: false, error: 'Fehler beim Löschen aus Supabase Storage' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Datei erfolgreich gelöscht'
    })
  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { success: false, error: 'Fehler beim Löschen' },
      { status: 500 }
    )
  }
}
