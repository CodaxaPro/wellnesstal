import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'

const STORAGE_BUCKET = 'wellnesstal'

/**
 * Media Route - /media/[...path]
 * 
 * Resimleri /media/ formatında serve eder
 * Örnek: /media/hero/image.jpg
 * → Supabase Storage'dan çeker ve döner
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    // Next.js 15 - params bir Promise
    const resolvedParams = await params
    // Path'i birleştir: ['hero', 'image.jpg'] → 'media/hero/image.jpg'
    const pathParts = resolvedParams.path
    const imagePath = `media/${pathParts.join('/')}`

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

    // Cache headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Media route error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

