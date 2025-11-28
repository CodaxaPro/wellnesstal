import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

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
    '/register'
  ]
}