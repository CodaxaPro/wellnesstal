import { NextRequest } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { supabaseAdmin } from './supabase-server'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  console.warn('WARNING: JWT_SECRET is not set. Using fallback for development only.')
}

export interface JWTPayload {
  userId: string
  username: string
  role: string
  iat?: number
  exp?: number
}

// Verify JWT token from request
export async function verifyToken(request: NextRequest): Promise<JWTPayload | null> {
  try {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, JWT_SECRET || 'dev-fallback-secret') as JWTPayload
    return decoded
  } catch (error) {
    console.error('Token verification error:', error)
    return null
  }
}

// Verify admin access
export async function verifyAdmin(request: NextRequest): Promise<boolean> {
  const payload = await verifyToken(request)
  return payload?.role === 'admin'
}

// Generate JWT token
export function generateToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET || 'dev-fallback-secret', { expiresIn: '7d' })
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

// Get admin user from database
export async function getAdminUser(username: string) {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('*')
    .eq('username', username)
    .single()

  if (error) {
    console.error('Error fetching admin user:', error)
    return null
  }

  return data
}
