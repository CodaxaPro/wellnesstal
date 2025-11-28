import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Server-side Supabase client with service role key for admin operations
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Database types
export interface DBCategory {
  id: string
  name: string
  description: string | null
  slug: string
  color: string
  icon: string | null
  order_num: number
  active: boolean
  service_count: number
  created_at: string
  updated_at: string
}

export interface DBService {
  id: string
  title: string
  slug: string
  description: string | null
  short_description: string | null
  category_id: string | null
  price: number | null
  duration: number | null
  image: string | null
  active: boolean
  order_num: number
  created_at: string
  updated_at: string
}

export interface DBContent {
  id: string
  section: string
  title: string
  description: string | null
  content: Record<string, any>
  defaults: Record<string, any> | null
  last_updated: string
  updated_by: string
}

export interface DBAdminUser {
  id: string
  username: string
  email: string
  password_hash: string
  role: string
  created_at: string
  updated_at: string
}
