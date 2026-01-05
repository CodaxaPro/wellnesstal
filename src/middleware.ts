import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Enterprise Security Headers
 */
const securityHeaders = {
  'X-DNS-Prefetch-Control': 'on',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload',
  'X-Frame-Options': 'SAMEORIGIN',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: https: blob:",
    "font-src 'self' data: https://fonts.gstatic.com",
    "connect-src 'self' https://*.supabase.co https://*.supabase.in",
    "frame-src 'self' https://www.youtube.com https://player.vimeo.com https://book.timify.com https://*.timify.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests"
  ].join('; ')
}

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Apply security headers
  Object.entries(securityHeaders).forEach(([key, value]) => {
    res.headers.set(key, value)
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Tenant path'leri koru
  if (req.nextUrl.pathname.startsWith('/tenant')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', req.url))
    }

    // tenant_id kontrolü
    const tenantId = session.user.user_metadata?.tenant_id
    if (!tenantId) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  // Login/Register - already logged in ise tenant dashboard'a
  if (req.nextUrl.pathname === '/login' || req.nextUrl.pathname === '/register') {
    if (session && session.user.user_metadata?.tenant_id) {
      return NextResponse.redirect(new URL('/tenant/dashboard', req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    '/tenant/:path*',
    '/login',
    '/register',
    '/((?!api|_next/static|_next/image|favicon.ico).*)'
  ]
}
