'use client'

import { useEffect, useState } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Template Engine imports
import EntityList, { EntityData } from '../../../../components/shared/EntityList'
import { templateEngine } from '../../../../lib/template-engine'
import { EntityConfig, TemplateConfig } from '../../../../types/templates'

import { CategoryFormData } from './types'

// EntityList component

// Types
interface Category extends EntityData {
  id: string
  name: string
  description: string
  color: string
  icon: string
  active: boolean
  order: number
  serviceCount: number
  createdAt: string
  updatedAt: string
}

interface AdminUser {
  username: string
  email: string
  role: string
}

// CategoryForm Component
interface CategoryFormProps {
  category: Category | null
  onSubmit: (data: CategoryFormData) => void
  onCancel: () => void
  loading: boolean
  templateConfig: TemplateConfig | null
}

function CategoryForm({ category, onSubmit, onCancel, loading, templateConfig }: CategoryFormProps) {
  const [formData, setFormData] = useState({
    name: category?.name || '',
    description: category?.description || '',
    color: category?.color || '#8B5CF6',
    icon: category?.icon || 'FolderOpen',
    active: category?.active ?? true,
    order: category?.order || 1
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category Name *
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter category name..."
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Category description..."
        />
      </div>

      {/* Color and Icon Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Color
          </label>
          <input
            type="color"
            value={formData.color}
            onChange={(e) => handleChange('color', e.target.value)}
            className="w-full h-10 rounded-lg border border-gray-300"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Icon
          </label>
          <input
            type="text"
            value={formData.icon}
            onChange={(e) => handleChange('icon', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Icon name..."
          />
        </div>
      </div>

      {/* Active and Order Row */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(e) => handleChange('active', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm font-medium text-gray-700">Active</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Display Order
          </label>
          <input
            type="number"
            min="1"
            value={formData.order}
            onChange={(e) => handleChange('order', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: templateConfig?.ui.theme.primaryColor || '#3B82F6' }}
        >
          {loading ? 'Saving...' : (category ? 'Update' : 'Create')}
        </button>
      </div>
    </form>
  )
}

export default function CategoriesManagement() {
  const router = useRouter()
  const [user, setUser] = useState<AdminUser | null>(null)

  // Template Engine State
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig | null>(null)
  const [templateLoading, setTemplateLoading] = useState(true)
  const [entityConfig, setEntityConfig] = useState<EntityConfig | null>(null)

  // Data State
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Form Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  // Template Engine Initialization
  useEffect(() => {
    const initializeTemplate = async () => {
      try {
        setTemplateLoading(true)

        // Same config as dashboard for consistency
        const config: TemplateConfig = {
          id: "wellness-basic",
          name: "Wellness & Spa Management",
          industry: "wellness" as const,
          version: "1.0.0",
          description: "Complete wellness and spa management system",

          entities: {
            primary: {
              name: "Services",
              singular: "Service",
              plural: "Services",
              icon: "Sparkles",
              color: "#10B981",
              fields: [],
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true,
                bulk: true
              }
            },
            secondary: {
              name: "Categories",
              singular: "Category",
              plural: "Categories",
              icon: "FolderOpen",
              color: "#8B5CF6",
              fields: [
                {
                  key: "name",
                  label: templateConfig?.industry === 'wellness' ? "Category Name" :
                         templateConfig?.industry === 'restaurant' ? "Menu Category" :
                         templateConfig?.industry === 'healthcare' ? "Service Category" : "Category Name",
                  type: "text",
                  required: true,
                  order: 1,
                  placeholder: "Enter category name..."
                },
                {
                  key: "description",
                  label: "Description",
                  type: "textarea",
                  required: false,
                  order: 2,
                  placeholder: "Category description..."
                },
                {
                  key: "color",
                  label: "Category Color",
                  type: "color",
                  required: false,
                  order: 3
                },
                {
                  key: "icon",
                  label: "Icon",
                  type: "text",
                  required: false,
                  order: 4,
                  placeholder: "Icon name..."
                },
                {
                  key: "active",
                  label: "Active Status",
                  type: "toggle",
                  required: true,
                  order: 5
                },
                {
                  key: "order",
                  label: "Display Order",
                  type: "number",
                  required: false,
                  order: 6
                }
              ],
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true,
                bulk: true
              }
            }
          },

          ui: {
            theme: {
              primaryColor: "#10B981",
              secondaryColor: "#6B7280",
              accentColor: "#8B5CF6",
              fontFamily: "Inter, sans-serif",
              fontSize: {
                sm: "0.875rem",
                base: "1rem",
                lg: "1.125rem",
                xl: "1.25rem"
              },
              borderRadius: "0.75rem",
              spacing: "comfortable" as const,
              darkMode: false,
              brandName: "Wellnesstal Studio"
            },
            components: {},
            layout: {
              sidebar: {
                position: "left" as const,
                collapsible: true,
                defaultCollapsed: false
              },
              navigation: {
                style: "sidebar" as const,
                items: []
              },
              dashboard: {
                widgets: [],
                layout: "grid" as const
              }
            }
          },

          business: {
            workflows: [],
            validations: {},
            automations: []
          },

          features: {
            enabled: ["dashboard", "admin-panel", "analytics"],
            disabled: []
          }
        }

        templateEngine.registerTemplate(config as Parameters<typeof templateEngine.registerTemplate>[0])
        templateEngine.setActiveTemplate('wellness-basic')
        setTemplateConfig(config)
        if (config.entities.secondary) {
          setEntityConfig(config.entities.secondary)
        }

      } catch (err) {
        console.error('Categories template initialization failed:', err)
        setError('Template initialization failed')
      } finally {
        setTemplateLoading(false)
      }
    }

    void initializeTemplate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    const userData = localStorage.getItem('adminUser')

    if (!token || !userData) {
      router.push('/admin')
      return
    }

    setUser(JSON.parse(userData))
  }, [router])

  // Fetch categories data from API
  useEffect(() => {
    void fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)

      // Real API call to categories endpoint
      const response = await fetch('/api/categories?includeServiceCount=true')
      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch categories')
      }

      setCategories(result.data || [])

    } catch (err) {
      console.error('Failed to fetch categories:', err)
      setError(err instanceof Error ? err.message : 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleFormSubmit = async (formData: CategoryFormData) => {
    try {
      setLoading(true)

      const apiData = {
        name: formData.name,
        description: formData.description || '',
        color: formData.color,
        icon: formData.icon,
        active: formData.active,
        order: formData.order
      }

      if (editingCategory) {
        // Update existing category via API
        const response = await fetch('/api/categories', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer valid-admin-token' // In real app, use actual token
          },
          body: JSON.stringify({
            id: editingCategory.id,
            ...apiData
          })
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to update category')
        }

        // Update local state
        setCategories(prev =>
          prev.map(cat => cat.id === editingCategory.id ? result.data : cat)
        )

        // eslint-disable-next-line no-console
        console.log('Category updated successfully')
      } else {
        // Create new category via API
        const response = await fetch('/api/categories', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer valid-admin-token' // In real app, use actual token
          },
          body: JSON.stringify(apiData)
        })

        const result = await response.json()

        if (!response.ok || !result.success) {
          throw new Error(result.error || 'Failed to create category')
        }

        // Add to local state
        setCategories(prev => [...prev, result.data])
        // eslint-disable-next-line no-console
        console.log('Category created successfully')
      }

      setIsFormModalOpen(false)
      setEditingCategory(null)

    } catch (err) {
      console.error('Form submission failed:', err)
      setError(err instanceof Error ? err.message : 'Failed to save category')
    } finally {
      setLoading(false)
    }
  }

  // CRUD Operations
  const handleCreate = () => {
    setEditingCategory(null)
    setIsFormModalOpen(true)
  }

  const handleEdit = (category: EntityData) => {
    setEditingCategory(category as Category)
    setIsFormModalOpen(true)
  }

  const handleDelete = async (category: EntityData) => {
    // eslint-disable-next-line no-alert
    if (!confirm(`Are you sure you want to delete "${(category as Category).name}"?`)) {
      return
    }

    try {
      setLoading(true)

      // Delete via API
      const response = await fetch(`/api/categories?id=${category.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': 'Bearer valid-admin-token' // In real app, use actual token
        }
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        if (result.code === 'CATEGORY_HAS_SERVICES') {
          setError(`Cannot delete category: ${result.error}`)
          return
        }
        throw new Error(result.error || 'Failed to delete category')
      }

      // Remove from local state
      setCategories(prev => prev.filter(cat => cat.id !== category.id))

      // eslint-disable-next-line no-console
      console.log('Category deleted successfully')

    } catch (err) {
      console.error('Failed to delete category:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete category')
    } finally {
      setLoading(false)
    }
  }

  const handleView = (category: EntityData) => {
    // Navigate to category detail view or open modal
    // eslint-disable-next-line no-console
    console.log('Viewing category:', (category as Category).name)
  }

  const handleBulkAction = async (action: string, items: EntityData[]) => {
    try {
      setLoading(true)

      switch (action) {
        case 'delete':
          // Mock bulk delete
          await new Promise<void>(resolve => {
            setTimeout(() => {
              resolve()
            }, 1000)
          })
          const idsToDelete = items.map(item => item.id)
          setCategories(prev => prev.filter(cat => !idsToDelete.includes(cat.id)))
          // eslint-disable-next-line no-console
          console.log(`Deleted ${items.length} categories`)
          break

        case 'export':
          // Mock export
          // eslint-disable-next-line no-console
          console.log(`Exporting ${items.length} categories`)
          break

        default:
          // eslint-disable-next-line no-console
          console.log(`Bulk action: ${action} on ${items.length} items`)
      }

    } catch (err) {
      console.error('Bulk action failed:', err)
      setError('Bulk action failed')
    } finally {
      setLoading(false)
    }
  }

  // Search and Filter handlers - API based
  const handleSearch = async (query: string) => {
    try {
      setLoading(true)
      const response = await fetch(`/api/categories?search=${encodeURIComponent(query)}&includeServiceCount=true`)
      const result = await response.json()

      if (result.success) {
        setCategories(result.data || [])
      }
    } catch (err) {
      console.error('Search failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFilter = async (filters: Record<string, unknown>) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('includeServiceCount', 'true')

      Object.entries(filters).forEach(([key, value]) => {
        if (value !== '' && value !== null && value !== undefined) {
          params.append(key, String(value))
        }
      })

      const response = await fetch(`/api/categories?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setCategories(result.data || [])
      }
    } catch (err) {
      console.error('Filter failed:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSort = async (field: string, direction: 'asc' | 'desc') => {
    try {
      setLoading(true)
      const response = await fetch(`/api/categories?sortBy=${field}&sortOrder=${direction}&includeServiceCount=true`)
      const result = await response.json()

      if (result.success) {
        setCategories(result.data || [])
      }
    } catch (err) {
      console.error('Sort failed:', err)
      // Fallback to local sort if API fails
      const sortedCategories = [...categories].sort((a, b) => {
        const aValue = a[field as keyof Category] as string | number | undefined
        const bValue = b[field as keyof Category] as string | number | undefined

        if (aValue === undefined || bValue === undefined) {
          return 0
        }

        if (direction === 'asc') {
          return aValue > bValue ? 1 : -1
        } else {
          return aValue < bValue ? 1 : -1
        }
      })

      setCategories(sortedCategories)
    } finally {
      setLoading(false)
    }
  }

  // Apply template colors to CSS variables
  useEffect(() => {
    if (templateConfig) {
      document.documentElement.style.setProperty('--template-primary', templateConfig.ui.theme.primaryColor)
      document.documentElement.style.setProperty('--template-secondary', templateConfig.ui.theme.secondaryColor)
      document.documentElement.style.setProperty('--template-accent', templateConfig.ui.theme.accentColor)
    }
  }, [templateConfig])

  if (!user) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500" />
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-cream ${templateConfig ? `template-${templateConfig.industry}` : ''}`}>
      {/* Template Loading */}
      {templateLoading && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
          Template wird geladen...
        </div>
      )}

      {/* Header */}
      <header className="bg-white shadow-soft">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="text-2xl font-bold mr-8" style={{ color: templateConfig?.ui.theme.primaryColor || '#6B8A3A' }}>
                🌿 {templateConfig?.ui.theme.brandName || 'Wellnesstal'}
              </Link>
              <nav className="hidden md:flex space-x-8">
                <Link href="/admin/dashboard" className="text-sage-600 hover:text-forest-600 transition-colors">
                  <svg className="h-6 w-6 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m0 7h18" />
                  </svg>
                  Dashboard
                </Link>
                <span className="text-charcoal font-medium">
                  {templateConfig?.entities.secondary?.plural || 'Categories'} Management
                </span>
                {templateConfig && (
                  <span className="text-sm text-gray-500">
                    Template: {templateConfig.name} • {templateConfig.industry}
                  </span>
                )}
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-custom">
                Welcome, <span className="font-medium text-charcoal">{user.username}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Template Status Badge */}
        {templateConfig && (
          <div className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-full">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-green-800">
              {templateConfig.entities.secondary?.name} Management • Template: {templateConfig.name} v{templateConfig.version}
            </span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
            <div className="flex items-center">
              <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
            <button onClick={() => setError(null)} className="text-red-700 hover:text-red-900">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* EntityList Component */}
        {entityConfig && (
          <div className="bg-white rounded-2xl shadow-soft p-6">
            <EntityList
              entityConfig={entityConfig}
              data={categories}
              loading={loading}
              {...(error ? { error } : {})}
              onSearch={(query) => void handleSearch(query)}
              onFilter={(filters) => void handleFilter(filters)}
              onSort={(field, direction) => void handleSort(field, direction)}
              onCreate={handleCreate}
              onEdit={handleEdit}
              onDelete={(category) => void handleDelete(category)}
              onView={handleView}
              onBulkAction={(action, items) => void handleBulkAction(action, items)}
              showSearch
              showFilters
              showBulkActions
              showCreateButton
              showImportExport={false}
              layout="table"
            />
          </div>
        )}

        {/* Category Form Modal */}
        {isFormModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingCategory ? 'Edit Category' : `New ${entityConfig?.singular || 'Category'}`}
                </h3>
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <CategoryForm
                category={editingCategory}
                onSubmit={(formData) => void handleFormSubmit(formData)}
                onCancel={() => setIsFormModalOpen(false)}
                loading={loading}
                templateConfig={templateConfig}
              />
            </div>
          </div>
        )}

      </main>
    </div>
  )
}
