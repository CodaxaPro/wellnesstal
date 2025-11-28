/**
 * WellnessTall MSW Handlers
 * Mock API responses for testing
 *
 * ⚠️ STRICT RULES:
 * - These handlers define expected API behavior
 * - API implementation MUST match these handlers
 * - Once tests pass, handlers become immutable
 */

import { http, HttpResponse } from 'msw'

const API_BASE = 'http://localhost:3001/api'

// Mock data stores
let mockServices = [
  {
    id: 'service-1',
    name: 'Head Spa Treatment',
    slug: 'head-spa-treatment',
    description: 'Relaxing head spa treatment',
    price: 89,
    duration: 60,
    active: true,
    categoryId: 'category-1',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'service-2',
    name: 'Full Body Massage',
    slug: 'full-body-massage',
    description: 'Full body relaxation massage',
    price: 120,
    duration: 90,
    active: true,
    categoryId: 'category-2',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z'
  }
]

let mockCategories = [
  {
    id: 'category-1',
    name: 'Head Spa',
    slug: 'head-spa',
    description: 'Head spa services',
    order: 0,
    active: true,
    serviceCount: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'category-2',
    name: 'Massage',
    slug: 'massage',
    description: 'Massage services',
    order: 1,
    active: true,
    serviceCount: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
]

let mockPages = [
  {
    id: 'page-1',
    title: 'About Us',
    slug: 'about-us',
    status: 'published',
    template: 'about',
    content: { hero: null, sections: [] },
    seo: { title: 'About Us', description: 'About WellnessTal' },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
]

export const handlers = [
  // ============================================
  // AUTH ENDPOINTS
  // ============================================
  http.post(`${API_BASE}/auth/login`, async ({ request }) => {
    const body = await request.json() as { username: string; password: string }

    if (body.username === 'admin' && body.password === 'wellnesstal2024') {
      return HttpResponse.json({
        success: true,
        user: {
          id: 'user-1',
          username: 'admin',
          role: 'admin',
          tenantId: 'tenant-1'
        },
        token: 'mock-jwt-token'
      })
    }

    return HttpResponse.json(
      { success: false, error: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  // ============================================
  // SERVICES ENDPOINTS
  // ============================================
  http.get(`${API_BASE}/services`, ({ request }) => {
    const url = new URL(request.url)
    const active = url.searchParams.get('active')
    const categoryId = url.searchParams.get('categoryId')
    const search = url.searchParams.get('search')

    let filtered = [...mockServices]

    if (active !== null) {
      filtered = filtered.filter(s => s.active === (active === 'true'))
    }

    if (categoryId) {
      filtered = filtered.filter(s => s.categoryId === categoryId)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(s =>
        s.name.toLowerCase().includes(searchLower) ||
        s.description.toLowerCase().includes(searchLower)
      )
    }

    return HttpResponse.json({
      success: true,
      data: filtered,
      total: filtered.length
    })
  }),

  http.get(`${API_BASE}/services/:id`, ({ params }) => {
    const service = mockServices.find(s => s.id === params.id)

    if (!service) {
      return HttpResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({ success: true, data: service })
  }),

  http.post(`${API_BASE}/services`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newService = {
      id: `service-${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockServices.push(newService as typeof mockServices[0])

    return HttpResponse.json({ success: true, data: newService }, { status: 201 })
  }),

  http.put(`${API_BASE}/services/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    const index = mockServices.findIndex(s => s.id === params.id)

    if (index === -1) {
      return HttpResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    mockServices[index] = {
      ...mockServices[index],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return HttpResponse.json({ success: true, data: mockServices[index] })
  }),

  http.delete(`${API_BASE}/services/:id`, ({ params }) => {
    const index = mockServices.findIndex(s => s.id === params.id)

    if (index === -1) {
      return HttpResponse.json(
        { success: false, error: 'Service not found' },
        { status: 404 }
      )
    }

    mockServices.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),

  // ============================================
  // CATEGORIES ENDPOINTS
  // ============================================
  http.get(`${API_BASE}/categories`, ({ request }) => {
    const url = new URL(request.url)
    const active = url.searchParams.get('active')
    const search = url.searchParams.get('search')
    const sort = url.searchParams.get('sort') || 'order'
    const order = url.searchParams.get('order') || 'asc'

    let filtered = [...mockCategories]

    if (active !== null) {
      filtered = filtered.filter(c => c.active === (active === 'true'))
    }

    if (search) {
      const searchLower = search.toLowerCase()
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(searchLower) ||
        c.description.toLowerCase().includes(searchLower)
      )
    }

    // Sorting
    filtered.sort((a, b) => {
      const aVal = a[sort as keyof typeof a]
      const bVal = b[sort as keyof typeof b]
      if (order === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      }
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    })

    return HttpResponse.json({
      success: true,
      data: filtered,
      stats: {
        total: mockCategories.length,
        active: mockCategories.filter(c => c.active).length,
        inactive: mockCategories.filter(c => !c.active).length,
        totalServices: mockCategories.reduce((sum, c) => sum + c.serviceCount, 0)
      }
    })
  }),

  // IMPORTANT: reorder must come BEFORE :id routes
  http.put(`${API_BASE}/categories/reorder`, async ({ request }) => {
    const body = await request.json() as { orderedIds: string[] }

    body.orderedIds.forEach((id, index) => {
      const cat = mockCategories.find(c => c.id === id)
      if (cat) {
        cat.order = index
      }
    })

    return HttpResponse.json({ success: true, data: mockCategories })
  }),

  http.get(`${API_BASE}/categories/:id`, ({ params }) => {
    const category = mockCategories.find(c => c.id === params.id)

    if (!category) {
      return HttpResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({ success: true, data: category })
  }),

  http.post(`${API_BASE}/categories`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newCategory = {
      id: `category-${Date.now()}`,
      serviceCount: 0,
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockCategories.push(newCategory as typeof mockCategories[0])

    return HttpResponse.json({ success: true, data: newCategory }, { status: 201 })
  }),

  http.put(`${API_BASE}/categories/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    const index = mockCategories.findIndex(c => c.id === params.id)

    if (index === -1) {
      return HttpResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    mockCategories[index] = {
      ...mockCategories[index],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return HttpResponse.json({ success: true, data: mockCategories[index] })
  }),

  http.delete(`${API_BASE}/categories/:id`, ({ params }) => {
    const index = mockCategories.findIndex(c => c.id === params.id)

    if (index === -1) {
      return HttpResponse.json(
        { success: false, error: 'Category not found' },
        { status: 404 }
      )
    }

    mockCategories.splice(index, 1)
    return HttpResponse.json({ success: true })
  }),

  // ============================================
  // PAGES ENDPOINTS
  // ============================================
  http.get(`${API_BASE}/pages`, ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const template = url.searchParams.get('template')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')

    let filtered = [...mockPages]

    if (status) {
      filtered = filtered.filter(p => p.status === status)
    }

    if (template) {
      filtered = filtered.filter(p => p.template === template)
    }

    const start = (page - 1) * limit
    const paged = filtered.slice(start, start + limit)

    return HttpResponse.json({
      success: true,
      data: paged,
      pagination: {
        page,
        limit,
        total: filtered.length,
        totalPages: Math.ceil(filtered.length / limit)
      }
    })
  }),

  http.get(`${API_BASE}/pages/:id`, ({ params }) => {
    const page = mockPages.find(p => p.id === params.id)

    if (!page) {
      return HttpResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    return HttpResponse.json({ success: true, data: page })
  }),

  http.post(`${API_BASE}/pages`, async ({ request }) => {
    const body = await request.json() as Record<string, unknown>

    // Check slug uniqueness
    if (mockPages.some(p => p.slug === body.slug)) {
      return HttpResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 400 }
      )
    }

    const newPage = {
      id: `page-${Date.now()}`,
      status: 'draft',
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    mockPages.push(newPage as typeof mockPages[0])

    return HttpResponse.json({ success: true, data: newPage }, { status: 201 })
  }),

  http.put(`${API_BASE}/pages/:id`, async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    const index = mockPages.findIndex(p => p.id === params.id)

    if (index === -1) {
      return HttpResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    // Check slug uniqueness (excluding current page)
    if (body.slug && mockPages.some(p => p.slug === body.slug && p.id !== params.id)) {
      return HttpResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 400 }
      )
    }

    mockPages[index] = {
      ...mockPages[index],
      ...body,
      updatedAt: new Date().toISOString()
    }

    return HttpResponse.json({ success: true, data: mockPages[index] })
  }),

  http.delete(`${API_BASE}/pages/:id`, ({ params }) => {
    const index = mockPages.findIndex(p => p.id === params.id)

    if (index === -1) {
      return HttpResponse.json(
        { success: false, error: 'Page not found' },
        { status: 404 }
      )
    }

    mockPages.splice(index, 1)
    return HttpResponse.json({ success: true })
  })
]

// Helper to reset mock data between tests
export const resetMockData = () => {
  mockServices = [
    {
      id: 'service-1',
      name: 'Head Spa Treatment',
      slug: 'head-spa-treatment',
      description: 'Relaxing head spa treatment',
      price: 89,
      duration: 60,
      active: true,
      categoryId: 'category-1',
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'service-2',
      name: 'Full Body Massage',
      slug: 'full-body-massage',
      description: 'Full body relaxation massage',
      price: 120,
      duration: 90,
      active: true,
      categoryId: 'category-2',
      createdAt: '2024-01-02T00:00:00.000Z',
      updatedAt: '2024-01-02T00:00:00.000Z'
    }
  ]

  mockCategories = [
    {
      id: 'category-1',
      name: 'Head Spa',
      slug: 'head-spa',
      description: 'Head spa services',
      order: 0,
      active: true,
      serviceCount: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    },
    {
      id: 'category-2',
      name: 'Massage',
      slug: 'massage',
      description: 'Massage services',
      order: 1,
      active: true,
      serviceCount: 1,
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]

  mockPages = [
    {
      id: 'page-1',
      title: 'About Us',
      slug: 'about-us',
      status: 'published',
      template: 'about',
      content: { hero: null, sections: [] },
      seo: { title: 'About Us', description: 'About WellnessTal' },
      createdAt: '2024-01-01T00:00:00.000Z',
      updatedAt: '2024-01-01T00:00:00.000Z'
    }
  ]
}
