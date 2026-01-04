/**
 * API Types (camelCase)
 * Modern SaaS standard response types
 *
 * These types represent what the API returns to frontend.
 * All field names are in camelCase for JavaScript/TypeScript consistency.
 */

// ============================================
// PAGES SYSTEM
// ============================================

export interface APIPage {
  id: string
  slug: string
  title: string
  status: 'draft' | 'published' | 'archived'
  templateType: string
  metaTitle: string | null
  metaDescription: string | null
  metaKeywords: string[] | null
  ogImage: string | null
  canonicalUrl: string | null
  noIndex: boolean
  noFollow: boolean
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  createdBy: string | null
  updatedBy: string | null
  blocks?: APIPageBlock[]
}

export interface APIPageBlock {
  id: string
  pageId: string
  blockType: string
  content: Record<string, any>
  position: number
  visible: boolean
  customStyles: Record<string, any>
  createdAt: string
  updatedAt: string
}

export interface APIBlockType {
  id: string
  name: string
  description: string | null
  icon: string | null
  category: string
  defaultContent: Record<string, any>
  schema: Record<string, any> | null
  isActive: boolean
  sortOrder: number
}

// ============================================
// SERVICES & CATEGORIES
// ============================================

export interface APIService {
  id: string
  title: string
  slug: string
  description: string | null
  shortDescription: string | null
  categoryId: string | null
  price: number | null
  duration: number | null
  image: string | null
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
  category?: APICategory
}

export interface APICategory {
  id: string
  name: string
  description: string | null
  slug: string
  color: string
  icon: string | null
  order: number
  active: boolean
  serviceCount: number
  createdAt: string
  updatedAt: string
}

// ============================================
// TESTIMONIALS & REVIEWS
// ============================================

export interface APITestimonial {
  id: string
  name: string
  rating: number
  comment: string
  service: string | null
  avatar: string | null
  active: boolean
  createdAt: string
}

export interface APIGoogleReview {
  id: string
  reviewerName: string
  reviewerAvatar: string | null
  rating: number
  reviewText: string
  reviewDate: string
  source: string
  verified: boolean
  active: boolean
  position: number
  createdAt: string
  updatedAt: string
}

// ============================================
// ADMIN & AUTH
// ============================================

export interface APIAdminUser {
  id: string
  username: string
  email: string
  role: 'admin' | 'editor'
  createdAt: string
  updatedAt: string
  // Note: password_hash is NEVER exposed in API
}

export interface APIAuthResponse {
  success: boolean
  token?: string
  user?: APIAdminUser
  error?: string
}

// ============================================
// CONTENT MANAGEMENT
// ============================================

export interface APIContent {
  id: string
  section: string
  title: string | null
  description: string | null
  content: Record<string, any>
  defaults: Record<string, any> | null
  lastUpdated: string
  updatedBy: string | null
}

export interface APIHomepageSection {
  id: string
  sectionKey: string
  sectionName: string
  sectionIcon: string | null
  content: Record<string, any>
  order: number
  visible: boolean
  createdAt: string
  updatedAt: string
}

// ============================================
// MEDIA MANAGEMENT
// ============================================

export interface APIMediaFile {
  id: string
  fileName: string
  originalName: string
  filePath: string
  thumbnailPath: string | null
  mediumPath: string | null
  largePath: string | null
  fileSize: number
  mimeType: string
  width: number | null
  height: number | null
  altText: string | null
  categoryId: string | null
  blurHash: string | null
  isFeatured: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
  category?: APIMediaCategory
}

export interface APIMediaCategory {
  id: string
  name: string
  slug: string
  description: string | null
  createdAt: string
  updatedAt: string
}

// ============================================
// MULTI-TENANCY (Future)
// ============================================

export interface APITenant {
  id: string
  name: string
  slug: string
  domain: string | null
  settings: Record<string, any> | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export interface APITenantUser {
  id: string
  tenantId: string
  userId: string
  role: string
  createdAt: string
}

// ============================================
// API RESPONSE WRAPPERS
// ============================================

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  code?: string
  details?: any
}

export interface APIPaginatedResponse<T = any> extends APIResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
  hasMore?: boolean
}

export interface APIListResponse<T = any> extends APIResponse {
  data: {
    items: T[]
    total: number
    limit: number
    offset: number
  }
}

// ============================================
// QUERY & FILTER TYPES
// ============================================

export interface PaginationQuery {
  limit?: number
  offset?: number
}

export interface PageQuery extends PaginationQuery {
  slug?: string
  id?: string
  status?: 'draft' | 'published' | 'all'
  withBlocks?: boolean
}

export interface ServiceQuery extends PaginationQuery {
  categoryId?: string
  active?: boolean
  search?: string
}

export interface MediaQuery extends PaginationQuery {
  categoryId?: string
  mimeType?: string
  isFeatured?: boolean
  search?: string
}

// ============================================
// CREATE/UPDATE INPUT TYPES
// ============================================

export interface CreatePageInput {
  title: string
  slug?: string
  status?: 'draft' | 'published'
  template?: string
  metaTitle?: string
  metaDescription?: string
}

export interface UpdatePageInput {
  id: string
  title?: string
  slug?: string
  status?: 'draft' | 'published' | 'archived'
  templateType?: string
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string[]
  ogImage?: string
  canonicalUrl?: string
  noIndex?: boolean
  noFollow?: boolean
}

export interface CreateServiceInput {
  title: string
  slug?: string
  description?: string
  shortDescription?: string
  categoryId?: string
  price?: number
  duration?: number
  image?: string
  active?: boolean
  order?: number
}

export interface UpdateServiceInput {
  id: string
  title?: string
  slug?: string
  description?: string
  shortDescription?: string
  categoryId?: string
  price?: number
  duration?: number
  image?: string
  active?: boolean
  order?: number
}

export interface CreateBlockInput {
  pageId: string
  blockType: string
  content?: Record<string, any>
  position?: number
  visible?: boolean
  customStyles?: Record<string, any>
}

export interface UpdateBlockInput {
  id: string
  content?: Record<string, any>
  position?: number
  visible?: boolean
  customStyles?: Record<string, any>
}

// ============================================
// REORDER OPERATIONS
// ============================================

export interface ReorderItem {
  id: string
  position: number
}

export interface ReorderRequest {
  reorder: true
  items: ReorderItem[]
}

// ============================================
// TYPE GUARDS
// ============================================

export function isAPIResponse<T>(obj: any): obj is APIResponse<T> {
  return obj && typeof obj === 'object' && 'success' in obj
}

export function isAPIPaginatedResponse<T>(obj: any): obj is APIPaginatedResponse<T> {
  return isAPIResponse(obj) && 'total' in obj && 'limit' in obj && 'offset' in obj
}

// ============================================
// STATUS ENUMS
// ============================================

export type PageStatus = 'draft' | 'published' | 'archived'
export type AdminRole = 'admin' | 'editor'
export type ReviewSource = 'google' | 'facebook' | 'direct'

// ============================================
// EXPORTS
// ============================================

export type {
  // Convenience re-exports
  APIResponse as Response,
  APIPaginatedResponse as PaginatedResponse,
  APIListResponse as ListResponse,
}
