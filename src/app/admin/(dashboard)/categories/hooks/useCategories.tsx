'use client'

import { useCallback, useEffect, useState } from 'react'

import { Category, CategoryFilters, CategoryFormData, CategoryResponse } from '../types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string>('')

  const [filters, setFilters] = useState<CategoryFilters>({
    search: '',
    sortBy: 'order',
    sortOrder: 'asc'
  })

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  })

  // Fetch categories from API
  const fetchCategories = useCallback(async (authToken?: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const headers: HeadersInit = {}
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const params = new URLSearchParams()
      if (filters.search) {
params.append('search', filters.search)
}
      if (filters.active !== undefined) {
params.append('active', filters.active.toString())
}
      if (filters.sortBy) {
params.append('sortBy', filters.sortBy)
}
      if (filters.sortOrder) {
params.append('sortOrder', filters.sortOrder)
}

      const response = await fetch(`/api/categories?${params}`, { headers })
      const data: CategoryResponse = await response.json()

      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data)
        if (data.stats) {
          setStats(data.stats)
        }
      } else {
        setError(data.error || 'Failed to fetch categories')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching categories:', err)
    } finally {
      setIsLoading(false)
    }
  }, [filters.search, filters.active, filters.sortBy, filters.sortOrder])

  // Initialize token
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      setToken(adminToken)
      void fetchCategories(adminToken)
    } else {
      void fetchCategories()
    }
  }, [fetchCategories])

  // Client-side filtering
  const applyFilters = useCallback(() => {
    let filtered = [...categories]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(category =>
        category.name.toLowerCase().includes(searchTerm) ||
        category.description?.toLowerCase().includes(searchTerm)
      )
    }

    // Active filter
    if (filters.active !== undefined) {
      filtered = filtered.filter(category => category.active === filters.active)
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal: string | number | Date
      let bVal: string | number | Date

      switch (filters.sortBy) {
        case 'name':
          aVal = a.name
          bVal = b.name
          break
        case 'createdAt':
          aVal = new Date(a.createdAt || 0)
          bVal = new Date(b.createdAt || 0)
          break
        case 'order':
        default:
          aVal = a.order
          bVal = b.order
          break
      }

      if (filters.sortOrder === 'desc') {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      } else {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      }
    })

    setFilteredCategories(filtered)
  }, [categories, filters])

  // Apply filters when categories or filters change
  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Create category
  const createCategory = async (categoryData: CategoryFormData): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/categories', {
        method: 'POST',
        headers,
        body: JSON.stringify(categoryData)
      })

      const data: CategoryResponse = await response.json()

      if (data.success && data.data && !Array.isArray(data.data)) {
        setCategories(prev => [...prev, data.data as Category])
        return true
      } else {
        setError(data.error || 'Failed to create category')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error creating category:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Update category
  const updateCategory = async (id: string, categoryData: Partial<CategoryFormData>): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/categories', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ id, ...categoryData })
      })

      const data: CategoryResponse = await response.json()

      if (data.success && data.data && !Array.isArray(data.data)) {
        setCategories(prev => prev.map(cat =>
          cat.id === id ? data.data as Category : cat
        ))
        return true
      } else {
        setError(data.error || 'Failed to update category')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error updating category:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Delete category
  const deleteCategory = async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const headers: HeadersInit = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/categories?id=${id}`, {
        method: 'DELETE',
        headers
      })

      const data: CategoryResponse = await response.json()

      if (data.success) {
        setCategories(prev => prev.filter(cat => cat.id !== id))
        return true
      } else {
        setError(data.error || 'Failed to delete category')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error deleting category:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle category active status
  const toggleActive = async (id: string): Promise<boolean> => {
    const category = categories.find(cat => cat.id === id)
    if (!category) {
return false
}

    return await updateCategory(id, { active: !category.active })
  }

  // Reorder categories
  const reorderCategories = async (newOrder: { id: string; order: number }[]): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/categories/reorder', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ newOrder })
      })

      const data: CategoryResponse = await response.json()

      if (data.success) {
        await fetchCategories(token)
        return true
      } else {
        setError(data.error || 'Failed to reorder categories')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error reordering categories:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    // State
    categories,
    filteredCategories,
    isLoading,
    error,
    filters,
    stats,

    // Actions
    setFilters,
    fetchCategories: () => fetchCategories(token),
    createCategory,
    updateCategory,
    deleteCategory,
    toggleActive,
    reorderCategories,

    // Utilities
    clearError: () => setError(null)
  }
}
