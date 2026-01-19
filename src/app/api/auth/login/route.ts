import { NextRequest, NextResponse } from 'next/server'

import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

import { logger } from '@/lib/logger'
import { authRateLimiter, rateLimit } from '@/lib/rate-limit'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret'

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const rateLimitResult = await rateLimit(request, authRateLimiter)
    if (!rateLimitResult.allowed) {
      logger.warn('Rate limit exceeded for login', {
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime
      })
      return NextResponse.json(
        { success: false, error: 'Too many login attempts. Please try again later.' },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
          }
        }
      )
    }

    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email ve şifre gereklidir' },
        { status: 400 }
      )
    }

    // Get admin user from database
    const { data: adminUser, error: fetchError } = await supabase
      .from('admin_users')
      .select('id, username, email, role, password_hash')
      .eq('email', email)
      .single()

    if (fetchError || !adminUser) {
      logger.warn('Login attempt with invalid email', { email })
      return NextResponse.json(
        { success: false, error: 'Geçersiz email veya şifre' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, adminUser.password_hash)
    if (!isValidPassword) {
      logger.warn('Login attempt with invalid password', { email, userId: adminUser.id })
      return NextResponse.json(
        { success: false, error: 'Geçersiz email veya şifre' },
        { status: 401 }
      )
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role || 'admin'
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    logger.info('Successful login', { email, userId: adminUser.id })

    return NextResponse.json({
      success: true,
      token,
      user: {
        id: adminUser.id,
        username: adminUser.username || adminUser.email.split('@')[0],
        email: adminUser.email,
        role: adminUser.role
      }
    })
  } catch (error) {
    logger.error('Login error', error as Error)
    return NextResponse.json(
      { success: false, error: 'Giriş yapılırken bir hata oluştu' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ message: 'Login endpoint' })
}
