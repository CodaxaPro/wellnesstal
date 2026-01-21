import { NextRequest, NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase-server'

const STORAGE_BUCKET = 'wellnesstal'

/**
 * Image Proxy Route
 *
 * Resimleri kendi domain'imizden serve eder
 * Örnek: /api/images/uploads/hero/image.jpg
 * → Supabase Storage'dan çeker ve döner
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Path'i birleştir: ['uploads', 'hero', 'image.jpg'] → 'uploads/hero/image.jpg'
    const imagePath = params.path.join('/')

    // Security check: sadece uploads ve media klasörlerine izin ver
    if (!imagePath.startsWith('uploads/') && !imagePath.startsWith('media/')) {
      return NextResponse.json(
        { error: 'Invalid image path' },
        { status: 400 }
      )
    }

    // Supabase Storage'dan resmi çek
    const { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .download(imagePath)

    if (error || !data) {
      console.error('Supabase Storage download error:', error)
      return NextResponse.json(
        { error: 'Image not found' },
        { status: 404 }
      )
    }

    // Buffer'a çevir
    const arrayBuffer = await data.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Content type belirle
    const extension = imagePath.split('.').pop()?.toLowerCase() || 'jpg'
    const contentTypeMap: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      webp: 'image/webp',
      gif: 'image/gif',
      svg: 'image/svg+xml'
    }
    const contentType = contentTypeMap[extension] || 'image/jpeg'

    // Cache headers (1 yıl cache)
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Image proxy error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

