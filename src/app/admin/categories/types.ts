export interface Category {
  id: string
  name: string
  description?: string
  slug: string
  color: string
  icon?: string
  order: number
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export interface CategoryFilters {
  search: string
  active?: boolean
  sortBy: 'name' | 'order' | 'createdAt'
  sortOrder: 'asc' | 'desc'
}

export interface CategoryFormData {
  name: string
  description: string
  color: string
  icon: string
  active: boolean
  order: number
}

export interface CategoryResponse {
  success: boolean
  data?: Category | Category[]
  error?: string
  stats?: {
    total: number
    active: number
    inactive: number
  }
}

export interface CategoryBulkOperation {
  action: 'activate' | 'deactivate' | 'delete' | 'reorder'
  categoryIds: string[]
  newOrder?: { id: string; order: number }[]
}