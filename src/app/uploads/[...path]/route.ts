import { NextRequest, NextResponse } from 'next/server'

import { supabaseAdmin } from '@/lib/supabase-server'

const STORAGE_BUCKET = 'wellnesstal'

/**
 * Uploads Route - /uploads/[...path]
 *
 * Resimleri /uploads/ formatında serve eder
 * Örnek: /uploads/about/image.jpg
 * → Supabase Storage'dan çeker ve döner
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Next.js 15 - params bir Promise
    const resolvedParams = await params
    // Path'i birleştir: ['about', 'image.jpg'] → 'uploads/about/image.jpg'
    // veya ['hero', 'image.jpg'] → önce uploads/hero/ sonra media/hero/ kontrol et
    const pathParts = resolvedParams.path
    let imagePath = `uploads/${pathParts.join('/')}`

    // Önce uploads/ klasöründe kontrol et, yoksa media/ klasöründe dene
    let { data, error } = await supabaseAdmin.storage
      .from(STORAGE_BUCKET)
      .download(imagePath)

    // Eğer uploads/ klasöründe yoksa, media/ klasöründe dene
    if (error && pathParts.length > 0) {
      const mediaPath = `media/${pathParts.join('/')}`
      const mediaResult = await supabaseAdmin.storage
        .from(STORAGE_BUCKET)
        .download(mediaPath)

      if (!mediaResult.error && mediaResult.data) {
        imagePath = mediaPath
        data = mediaResult.data
        error = null
      }
    }

    // data ve error yukarıda zaten kontrol edildi
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

    // Cache headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Uploads route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

