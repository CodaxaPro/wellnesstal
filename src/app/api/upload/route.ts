import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { verifyAdmin } from '@/lib/auth'

// Allowed image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// POST - Upload image (requires authentication)
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
        { success: false, error: 'Datei zu groß. Maximum: 5MB' },
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

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', sanitizedFolder)
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true })
    }

    // Save file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const filepath = path.join(uploadDir, filename)
    await writeFile(filepath, buffer)

    // Return public URL
    const publicUrl = `/uploads/${sanitizedFolder}/${filename}`

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename,
        size: file.size,
        type: file.type
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

// DELETE - Remove image (requires authentication)
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

    // Security check - only allow deleting from uploads folder
    if (!fileUrl.startsWith('/uploads/')) {
      return NextResponse.json(
        { success: false, error: 'Ungültiger Dateipfad' },
        { status: 400 }
      )
    }

    // Additional security: prevent path traversal
    if (fileUrl.includes('..')) {
      return NextResponse.json(
        { success: false, error: 'Invalid file path' },
        { status: 400 }
      )
    }

    // Construct file path
    const filepath = path.join(process.cwd(), 'public', fileUrl)

    // Check if file exists
    if (!existsSync(filepath)) {
      return NextResponse.json(
        { success: false, error: 'Datei nicht gefunden' },
        { status: 404 }
      )
    }

    // Delete file
    await unlink(filepath)

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
