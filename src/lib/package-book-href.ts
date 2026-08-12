/**
 * Package CTAs → TreuePay book deep link.
 * Falls back to site booking URL when bookSlug is missing.
 */
export function packageBookHref(
  bookSlug: string | null | undefined,
  fallbackBookingUrl?: string,
): string {
  const slug = typeof bookSlug === 'string' ? bookSlug.trim() : ''
  if (!slug) {
    const fallback = typeof fallbackBookingUrl === 'string' ? fallbackBookingUrl.trim() : ''
    return fallback || 'https://treuepay.de/booking?orgSlug=wellnesstal'
  }
  return `https://treuepay.de/wellnesstal/book/${slug}`
}
