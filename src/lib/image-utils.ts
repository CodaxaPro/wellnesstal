/**
 * Image Utility Functions
 * 
 * Resim URL'lerini normalize eder ve güvenilir görüntüleme sağlar
 */

/**
 * Resim URL'ini normalize eder
 * - Supabase URL'lerini kendi domain'e çevirir
 * - Relative URL'leri full URL'e çevirir
 */
export function normalizeImageUrl(url: string | null | undefined): string {
  if (!url) return ''
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
                  (typeof window !== 'undefined' ? window.location.origin : 'https://www.wellnesstal.de')
  
  // Eğer zaten kendi domain'imizden ise, olduğu gibi dön
  if (url.includes('wellnesstal.de/api/images/') || url.includes('localhost:3001/api/images/')) {
    return url
  }
  
  // Supabase URL'ini kendi domain'e çevir
  if (url.includes('/storage/v1/object/public/wellnesstal/')) {
    const pathMatch = url.match(/\/storage\/v1\/object\/public\/wellnesstal\/(.+)$/)
    if (pathMatch && pathMatch[1]) {
      return `${siteUrl}/api/images/${pathMatch[1]}`
    }
  }
  
  // Relative URL'leri full URL'e çevir
  if (url.startsWith('/uploads/') || url.startsWith('/media/')) {
    return `${siteUrl}/api/images${url}`
  }
  
  // Diğer durumlarda olduğu gibi dön
  return url
}

/**
 * Güvenilir resim component props'u oluşturur
 */
export function getImageProps(url: string | null | undefined, alt: string = '') {
  const normalizedUrl = normalizeImageUrl(url)
  
  return {
    src: normalizedUrl,
    alt: alt,
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

