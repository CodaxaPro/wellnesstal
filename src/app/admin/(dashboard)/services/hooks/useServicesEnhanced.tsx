'use client'

import { useState, useEffect } from 'react'

import { Service, ServiceFilters, ServiceResponse, ServiceFormData, BulkOperation, ServiceStats } from '../../../../types/services'
import { Category } from '../../categories/types'

export function useServicesEnhanced() {
  // Core state
  const [services, setServices] = useState<Service[]>([])
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [token, setToken] = useState<string>('')
  
  const [filters, setFilters] = useState<ServiceFilters>({
    search: '',
    category: undefined,
    active: undefined,
    popular: undefined,
    featured: undefined,
    sortBy: 'order',
    sortOrder: 'asc'
  })
  
  const [stats, setStats] = useState<ServiceStats>({
    total: 0,
    active: 0,
    inactive: 0,
    popular: 0,
    featured: 0,
    byCategory: {}
  })

  // Initialize token and load data
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      setToken(adminToken)
      Promise.all([
        fetchServices(adminToken),
        fetchCategories(adminToken)
      ])
    } else {
      Promise.all([
        fetchServices(),
        fetchCategories()
      ])
    }
  }, [])

  // Apply filters when services, categories or filters change
  useEffect(() => {
    applyFilters()
  }, [services, categories, filters])

  // Fetch services from API
  const fetchServices = async (authToken?: string) => {
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
      if (filters.category) {
params.append('category', filters.category)
}
      if (filters.active !== undefined) {
params.append('active', filters.active.toString())
}
      if (filters.popular !== undefined) {
params.append('popular', filters.popular.toString())
}
      if (filters.featured !== undefined) {
params.append('featured', filters.featured.toString())
}
      if (filters.sortBy) {
params.append('sortBy', filters.sortBy)
}
      if (filters.sortOrder) {
params.append('sortOrder', filters.sortOrder)
}

      const response = await fetch(`/api/services?${params}`, { headers })
      const data: ServiceResponse = await response.json()

      if (data.success && Array.isArray(data.data)) {
        setServices(data.data)
        if (data.stats) {
          setStats(data.stats)
        }
      } else {
        setError(data.error || 'Failed to fetch services')
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error fetching services:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Fetch categories from API
  const fetchCategories = async (authToken?: string) => {
    try {
      const headers: HeadersInit = {}
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`
      }

      const response = await fetch('/api/categories', { headers })
      const data = await response.json()

      if (data.success && Array.isArray(data.data)) {
        setCategories(data.data.filter((cat: Category) => cat.active))
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  // Client-side filtering with category support
  const applyFilters = () => {
    let filtered = [...services]

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      filtered = filtered.filter(service =>
        service.title.toLowerCase().includes(searchTerm) ||
        service.shortDescription.toLowerCase().includes(searchTerm) ||
        service.longDescription.toLowerCase().includes(searchTerm) ||
        service.benefits.some(benefit => benefit.toLowerCase().includes(searchTerm)) ||
        service.category?.name.toLowerCase().includes(searchTerm)
      )
    }

    // Category filter
    if (filters.category) {
      filtered = filtered.filter(service => service.category?.id === filters.category)
    }

    // Status filters
    if (filters.active !== undefined) {
      filtered = filtered.filter(service => service.active === filters.active)
    }
    if (filters.popular !== undefined) {
      filtered = filtered.filter(service => service.popular === filters.popular)
    }
    if (filters.featured !== undefined) {
      filtered = filtered.filter(service => service.featured === filters.featured)
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal: any, bVal: any

      switch (filters.sortBy) {
        case 'title':
          aVal = a.title
          bVal = b.title
          break
        case 'createdAt':
          aVal = new Date(a.createdAt || 0)
          bVal = new Date(b.createdAt || 0)
          break
        case 'price':
          aVal = parseFloat(a.price.replace(/[^\d.,]/g, '').replace(',', '.'))
          bVal = parseFloat(b.price.replace(/[^\d.,]/g, '').replace(',', '.'))
          break
        case 'viewCount':
          aVal = a.viewCount || 0
          bVal = b.viewCount || 0
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

    setFilteredServices(filtered)
  }

  // Create service with category support
  const createService = async (serviceData: ServiceFormData): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // Convert form data to service format - fix benefits handling
      const benefits = Array.isArray(serviceData.benefits) 
        ? serviceData.benefits 
        : typeof serviceData.benefits === 'string' 
          ? serviceData.benefits.split(',').map((b: string) => b.trim()).filter(Boolean)
          : []

      const requestData = {
        ...serviceData,
        benefits,
        order: services.length + 1
      }

      const response = await fetch('/api/services', {
        method: 'POST',
        headers,
        body: JSON.stringify(requestData)
      })

      const data = await response.json()

      if (data.success && data.data) {
        setServices(prev => [...prev, data.data])
        return true
      } else {
        setError(data.error || 'Failed to create service')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error creating service:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Update service with category support
  const updateService = async (id: string, serviceData: Partial<ServiceFormData>): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/services', {
        method: 'PUT',
        headers,
        body: JSON.stringify({ id, ...serviceData })
      })

      const data = await response.json()

      if (data.success && data.data) {
        setServices(prev => prev.map(s => 
          s.id === id ? data.data : s
        ))
        return true
      } else {
        setError(data.error || 'Failed to update service')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error updating service:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Delete service
  const deleteService = async (id: string): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const headers: HeadersInit = {}
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`/api/services?id=${id}`, {
        method: 'DELETE',
        headers
      })

      const data = await response.json()

      if (data.success) {
        setServices(prev => prev.filter(s => s.id !== id))
        return true
      } else {
        setError(data.error || 'Failed to delete service')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error deleting service:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Bulk operations with category support
  const handleBulkOperation = async (operation: BulkOperation): Promise<boolean> => {
    setIsLoading(true)
    setError(null)

    try {
      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch('/api/services/bulk', {
        method: 'POST',
        headers,
        body: JSON.stringify(operation)
      })

      const data = await response.json()

      if (data.success) {
        // Refresh services data
        await fetchServices(token)
        return true
      } else {
        setError(data.error || 'Bulk operation failed')
        return false
      }
    } catch (err) {
      setError('Network error occurred')
      console.error('Error in bulk operation:', err)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle service status
  const toggleActive = async (id: string): Promise<boolean> => {
    const service = services.find(s => s.id === id)
    if (!service) {
return false
}

    return await updateService(id, { active: !service.active })
  }

  const togglePopular = async (id: string): Promise<boolean> => {
    const service = services.find(s => s.id === id)
    if (!service) {
return false
}

    return await updateService(id, { popular: !service.popular })
  }

  const toggleFeatured = async (id: string): Promise<boolean> => {
    const service = services.find(s => s.id === id)
    if (!service) {
return false
}

    return await updateService(id, { featured: !service.featured })
  }

  // Get category by ID
  const getCategoryById = (id: string): Category | undefined => {
    return categories.find(cat => cat.id === id)
  }

  // Get services by category
  const getServicesByCategory = (categoryId: string): Service[] => {
    return services.filter(service => service.category?.id === categoryId)
  }

  return {
    // State
    services,
    filteredServices,
    categories,
    isLoading,
    error,
    filters,
    stats,

    // Actions
    setFilters,
    fetchServices: () => fetchServices(token),
    fetchCategories: () => fetchCategories(token),
    createService,
    updateService,
    deleteService,
    handleBulkOperation,
    toggleActive,
    togglePopular,
    toggleFeatured,

    // Utilities
    clearError: () => setError(null),
    getCategoryById,
    getServicesByCategory,
    refreshData: () => {
      fetchServices(token)
      fetchCategories(token)
    }
  }
}