/**
 * Image Utility Functions
 * 
 * Resim URL'lerini normalize eder ve güvenilir görüntüleme sağlar
 */

/**
 * Resim URL'ini normalize eder
 * - Supabase URL'lerini olduğu gibi kullan (direkt çalışır)
 * - Relative URL'leri Supabase URL'e çevir
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) {
return ''
}
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://rtudfkccbzbblfmeoyop.supabase.co'
  
  // Zaten tam URL ise olduğu gibi dön
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // Relative URL'leri Supabase Storage URL'e çevir
  if (url.startsWith('/uploads/') || url.startsWith('/media/')) {
    const path = url.substring(1) // Remove leading /
    return `${supabaseUrl}/storage/v1/object/public/wellnesstal/${path}`
  }
  
  return url
}

/**
 * Güvenilir resim component props'u oluşturur
 */
export function getImageProps(url: string | null | undefined, alt: string = '') {
  const normalizedUrl = normalizeImageUrl(url)
  
  return {
    src: normalizedUrl,
    alt,
    onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      console.error('Image load error:', normalizedUrl)
      // Fallback to placeholder
      const target = e.target as HTMLImageElement
      target.src = `https://via.placeholder.com/800x400/9CAF88/FFFFFF?text=${encodeURIComponent(alt || 'Image')}`
    },
    loading: 'lazy' as const,
    decoding: 'async' as const
  }
}

