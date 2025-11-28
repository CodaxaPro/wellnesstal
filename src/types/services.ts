// Enhanced Service Types - src/types/services.ts

// Base Service Interface - Mevcut API + Tüm gelişmiş özellikler
export interface Service {
  id: string
  title: string
  shortDescription: string
  longDescription: string
  duration: string
  price: string
  benefits: string[]
  popular: boolean
  active: boolean
  order: number
  image: string
  createdAt: string
  updatedAt: string
  
  // Mevcut button configurations
  primaryButtonText?: string
  primaryButtonType?: ButtonType
  primaryButtonValue?: string
  primaryButtonMessage?: string
  secondaryButtonText?: string
  secondaryButtonType?: ButtonType
  secondaryButtonValue?: string
  secondaryButtonMessage?: string
  
  // Mevcut modal button configurations
  secondaryModalLeftButtonText?: string
  secondaryModalLeftButtonType?: ButtonType
  secondaryModalLeftButtonValue?: string
  secondaryModalRightButtonText?: string
  secondaryModalRightButtonType?: ButtonType
  secondaryModalRightButtonValue?: string
  
  // Primary modal buttons (eksik olanlar)
  primaryModalLeftButtonText?: string
  primaryModalLeftButtonType?: ButtonType
  primaryModalLeftButtonValue?: string
  primaryModalRightButtonText?: string
  primaryModalRightButtonType?: ButtonType
  primaryModalRightButtonValue?: string
  
  // Gelişmiş özellikler
  tags?: string[]
  featured?: boolean
  slug?: string
  seoTitle?: string
  seoDescription?: string
  category?: ServiceCategory
  
  // Analytics data
  viewCount?: number
  clickCount?: number
  conversionRate?: number
  lastViewed?: string
}

// Service Categories
export interface ServiceCategory {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  color: string
  order: number
  active: boolean
  serviceCount: number
  createdAt: string
}

// Service Templates
export interface ServiceTemplate {
  id: string
  name: string
  description: string
  category: string
  templateData: Partial<Service>
  previewImage: string
  tags: string[]
  usageCount: number
  createdAt: string
  updatedAt: string
}

// Button Types
export type ButtonType = 'phone' | 'whatsapp' | 'page' | 'link' | 'email'

// Search and Filter Options
export interface ServiceFilters {
  search?: string
  category?: string
  tags?: string[]
  active?: boolean
  popular?: boolean
  featured?: boolean
  priceRange?: {
    min: number
    max: number
  }
  sortBy?: 'title' | 'createdAt' | 'updatedAt' | 'order' | 'viewCount' | 'clickCount' | 'price'
  sortOrder?: 'asc' | 'desc'
  limit?: number
  offset?: number
}

// Bulk Operations
export interface BulkOperation {
  action: 'activate' | 'deactivate' | 'delete' | 'update_category' | 'update_tags' | 'mark_featured'
  serviceIds: string[]
  data?: {
    category?: string
    tags?: string[]
    featured?: boolean
    [key: string]: any
  }
}

// API Response Types
export interface ServiceResponse {
  success: boolean
  data: Service[]
  count: number
  stats?: ServiceStats
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  message?: string
  error?: string
}

// Service Stats
export interface ServiceStats {
  total: number
  active: number
  inactive: number
  popular: number
  featured: number
  byCategory?: {
    [categoryId: string]: {
      name: string
      count: number
      percentage: number
    }
  }
  topPerformers?: {
    serviceId: string
    title: string
    viewCount: number
    clickCount: number
    conversionRate: number
  }[]
  recentActivity?: {
    date: string
    action: string
    service: string
    user: string
  }[]
}

// Service Analytics
export interface ServiceAnalytics {
  serviceId: string
  period: 'day' | 'week' | 'month' | 'year'
  metrics: {
    views: number
    clicks: number
    conversions: number
    conversionRate: number
    averageTimeOnPage: number
    bounceRate: number
  }
  chartData: {
    date: string
    views: number
    clicks: number
    conversions: number
  }[]
  topReferrers: {
    source: string
    count: number
  }[]
  deviceBreakdown: {
    desktop: number
    mobile: number
    tablet: number
  }
}

// DÜZELTME: Basitleştirilmiş Form Types
export interface ServiceFormData {
  // Basic info
  title: string
  shortDescription: string
  longDescription: string
  duration: string
  price: string
  benefits: string[] | string  // Hem array hem string kabul et
  
  // Settings
  popular?: boolean
  active?: boolean
  featured?: boolean
  order?: number
  
  // SEO & Organization
  category?: string
  tags?: string[] | string
  seoTitle?: string
  seoDescription?: string
  slug?: string
  
  // Media
  image?: string
  gallery?: string[]
  
  // Simplified Button Configuration - Mevcut sistemle uyumlu
  primaryButtonText?: string
  primaryButtonType?: ButtonType
  primaryButtonValue?: string
  primaryButtonMessage?: string
  
  secondaryButtonText?: string
  secondaryButtonType?: ButtonType
  secondaryButtonValue?: string
  secondaryButtonMessage?: string
  
  // Modal buttons - optional
  primaryModalLeftButtonText?: string
  primaryModalLeftButtonType?: ButtonType
  primaryModalLeftButtonValue?: string
  primaryModalRightButtonText?: string
  primaryModalRightButtonType?: ButtonType
  primaryModalRightButtonValue?: string
  
  secondaryModalLeftButtonText?: string
  secondaryModalLeftButtonType?: ButtonType
  secondaryModalLeftButtonValue?: string
  secondaryModalRightButtonText?: string
  secondaryModalRightButtonType?: ButtonType
  secondaryModalRightButtonValue?: string
}

// Validation
export interface ServiceValidationError {
  field: string
  message: string
  code: string
}

export interface ServiceValidationResult {
  valid: boolean
  errors: ServiceValidationError[]
  warnings?: ServiceValidationError[]
}

// Export/Import
export interface ServiceExportData {
  services: Service[]
  categories: ServiceCategory[]
  templates: ServiceTemplate[]
  exportDate: string
  version: string
}

// Service History/Versioning
export interface ServiceVersion {
  id: string
  serviceId: string
  version: number
  data: Service
  changedBy: string
  changeType: 'created' | 'updated' | 'deleted' | 'restored'
  changes: {
    field: string
    oldValue: any
    newValue: any
  }[]
  createdAt: string
}

// Drag & Drop
export interface DragDropResult {
  sourceIndex: number
  destinationIndex: number
  serviceId: string
}

// Dashboard Types
export interface ServiceDashboardData {
  services: Service[]
  stats: ServiceStats
  recentActivity: ServiceVersion[]
  analytics: ServiceAnalytics[]
  categories: ServiceCategory[]
  templates: ServiceTemplate[]
}