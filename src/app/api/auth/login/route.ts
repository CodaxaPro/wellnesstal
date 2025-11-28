import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase-server'
import { generateToken, verifyPassword, hashPassword } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      )
    }

    // Get user from database
    const { data: user, error } = await supabaseAdmin
      .from('admin_users')
      .select('*')
      .eq('username', username)
      .single()

    if (error || !user) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, user.password_hash)

    if (!isValidPassword) {
      // Fallback for initial setup - check against env variable
      const envPassword = process.env.ADMIN_PASSWORD
      if (!envPassword || password !== envPassword) {
        return NextResponse.json(
          { success: false, error: 'Invalid credentials' },
          { status: 401 }
        )
      }

      // If using env password, update the hash in database for future logins
      const newHash = await hashPassword(password)
      await supabaseAdmin
        .from('admin_users')
        .update({ password_hash: newHash })
        .eq('id', user.id)
    }

    // Generate JWT token
    const token = generateToken({
      userId: user.id,
      username: user.username,
      role: user.role
    })

    // Return user data (without password)
    const { password_hash, ...userWithoutPassword } = user

    return NextResponse.json({
      success: true,
      data: {
        user: {
          id: userWithoutPassword.id,
          username: userWithoutPassword.username,
          email: userWithoutPassword.email,
          role: userWithoutPassword.role
        },
        token
      },
      message: 'Login successful'
    })

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { message: 'Auth endpoint. Use POST to login.' },
    { status: 200 }
  )
}
