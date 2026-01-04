/**
 * Database Types (snake_case)
 * Generated from Supabase schema
 *
 * These types represent the exact structure of database tables.
 * DO NOT USE these types in frontend code - use api.types.ts instead.
 */

// ============================================
// PAGES SYSTEM
// ============================================

export interface DBPage {
  id: string
  slug: string
  title: string
  status: 'draft' | 'published' | 'archived'
  template: string
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[] | null
  og_image: string | null
  canonical_url: string | null
  no_index: boolean
  no_follow: boolean
  created_at: string
  updated_at: string
  published_at: string | null
  created_by: string | null
  updated_by: string | null
}

export interface DBPageBlock {
  id: string
  page_id: string
  block_type: string
  content: Record<string, any>
  position: number
  visible: boolean
  custom_styles: Record<string, any>
  created_at: string
  updated_at: string
}

export interface DBBlockType {
  id: string
  name: string
  description: string | null
  icon: string | null
  category: string
  default_content: Record<string, any>
  schema: Record<string, any> | null
  is_active: boolean
  sort_order: number
}

// ============================================
// SERVICES & CATEGORIES
// ============================================

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

// ============================================
// TESTIMONIALS & REVIEWS
// ============================================

export interface DBTestimonial {
  id: string
  name: string
  rating: number
  comment: string
  service: string | null
  avatar: string | null
  active: boolean
  created_at: string
}

export interface DBGoogleReview {
  id: string
  reviewer_name: string
  reviewer_avatar: string | null
  rating: number
  review_text: string
  review_date: string
  source: string
  verified: boolean
  active: boolean
  position: number
  created_at: string
  updated_at: string
}

// ============================================
// ADMIN & AUTH
// ============================================

export interface DBAdminUser {
  id: string
  username: string
  email: string
  password_hash: string
  role: 'admin' | 'editor'
  created_at: string
  updated_at: string
}

// ============================================
// CONTENT MANAGEMENT
// ============================================

export interface DBContent {
  id: string
  section: string
  title: string | null
  description: string | null
  content: Record<string, any>
  defaults: Record<string, any> | null
  last_updated: string
  updated_by: string | null
}

export interface DBHomepageSection {
  id: string
  section_key: string
  section_name: string
  section_icon: string | null
  content: Record<string, any>
  order_num: number
  visible: boolean
  created_at: string
  updated_at: string
}

// ============================================
// MEDIA MANAGEMENT
// ============================================

export interface DBMediaFile {
  id: string
  file_name: string
  original_name: string
  file_path: string
  thumbnail_path: string | null
  medium_path: string | null
  large_path: string | null
  file_size: number
  mime_type: string
  width: number | null
  height: number | null
  alt_text: string | null
  category_id: string | null
  blur_hash: string | null
  is_featured: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export interface DBMediaCategory {
  id: string
  name: string
  slug: string
  description: string | null
  created_at: string
  updated_at: string
}

// ============================================
// MULTI-TENANCY (Future)
// ============================================

export interface DBTenant {
  id: string
  name: string
  slug: string
  domain: string | null
  settings: Record<string, any> | null
  active: boolean
  created_at: string
  updated_at: string
}

export interface DBTenantUser {
  id: string
  tenant_id: string
  user_id: string
  role: string
  created_at: string
}

// ============================================
// TYPE UTILITIES
// ============================================

export type DatabaseTables = {
  pages: DBPage
  page_blocks: DBPageBlock
  block_types: DBBlockType
  services: DBService
  categories: DBCategory
  testimonials: DBTestimonial
  google_reviews: DBGoogleReview
  admin_users: DBAdminUser
  content: DBContent
  homepage_sections: DBHomepageSection
  media_files: DBMediaFile
  media_categories: DBMediaCategory
  tenants: DBTenant
  tenant_users: DBTenantUser
}

export type TableName = keyof DatabaseTables
