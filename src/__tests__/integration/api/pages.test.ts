/**
 * WellnessTall - Pages API Tests
 * Enterprise-grade integration tests
 *
 * ⚠️ STRICT RULES:
 * - Once this test passes, it becomes IMMUTABLE
 * - API must conform to these tests, not vice versa
 * - DO NOT modify assertions after tests pass
 *
 * @module tests/api/pages
 */

import { describe, it, expect, beforeEach } from 'vitest'

import { resetMockData } from '../../mocks/handlers'

const API_BASE = 'http://localhost:3001/api'

describe('Pages API', () => {
  beforeEach(() => {
    resetMockData()
  })

  // ============================================
  // GET /api/pages
  // ============================================
  describe('GET /api/pages', () => {
    it('should return all pages with pagination', async () => {
      const response = await fetch(`${API_BASE}/pages`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data).toHaveProperty('pagination')
    })

    it('should return pages with correct structure', async () => {
      const response = await fetch(`${API_BASE}/pages`)
      const data = await response.json()

      const page = data.data[0]
      expect(page).toHaveProperty('id')
      expect(page).toHaveProperty('title')
      expect(page).toHaveProperty('slug')
      expect(page).toHaveProperty('status')
      expect(page).toHaveProperty('template')
      expect(page).toHaveProperty('content')
      expect(page).toHaveProperty('seo')
      expect(page).toHaveProperty('createdAt')
      expect(page).toHaveProperty('updatedAt')
    })

    it('should return pagination object', async () => {
      const response = await fetch(`${API_BASE}/pages`)
      const data = await response.json()

      expect(data.pagination).toHaveProperty('page')
      expect(data.pagination).toHaveProperty('limit')
      expect(data.pagination).toHaveProperty('total')
      expect(data.pagination).toHaveProperty('totalPages')
    })

    it('should filter pages by status', async () => {
      const response = await fetch(`${API_BASE}/pages?status=published`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.every((p: { status: string }) => p.status === 'published')).toBe(true)
    })

    it('should filter pages by template', async () => {
      const response = await fetch(`${API_BASE}/pages?template=about`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.every((p: { template: string }) => p.template === 'about')).toBe(true)
    })

    it('should paginate results', async () => {
      const response = await fetch(`${API_BASE}/pages?page=1&limit=5`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.pagination.page).toBe(1)
      expect(data.pagination.limit).toBe(5)
      expect(data.data.length).toBeLessThanOrEqual(5)
    })
  })

  // ============================================
  // GET /api/pages/:id
  // ============================================
  describe('GET /api/pages/:id', () => {
    it('should return a single page by id', async () => {
      const response = await fetch(`${API_BASE}/pages/page-1`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('page-1')
    })

    it('should return page with SEO data', async () => {
      const response = await fetch(`${API_BASE}/pages/page-1`)
      const data = await response.json()

      expect(data.data.seo).toHaveProperty('title')
      expect(data.data.seo).toHaveProperty('description')
    })

    it('should return 404 for non-existent page', async () => {
      const response = await fetch(`${API_BASE}/pages/non-existent`)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Page not found')
    })
  })

  // ============================================
  // POST /api/pages
  // ============================================
  describe('POST /api/pages', () => {
    it('should create a new page', async () => {
      const newPage = {
        title: 'New Page',
        slug: 'new-page',
        template: 'custom',
        content: {
          hero: null,
          sections: []
        },
        seo: {
          title: 'New Page | WellnessTal',
          description: 'A brand new page'
        }
      }

      const response = await fetch(`${API_BASE}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPage)
      })

      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('id')
      expect(data.data.title).toBe(newPage.title)
      expect(data.data.status).toBe('draft')
      expect(data.data).toHaveProperty('createdAt')
      expect(data.data).toHaveProperty('updatedAt')
    })

    it('should default status to draft', async () => {
      const newPage = {
        title: 'Draft Page',
        slug: 'draft-page',
        template: 'custom',
        content: { hero: null, sections: [] },
        seo: { title: 'Draft', description: 'Draft page' }
      }

      const response = await fetch(`${API_BASE}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPage)
      })

      const data = await response.json()

      expect(data.data.status).toBe('draft')
    })

    it('should reject duplicate slug', async () => {
      const newPage = {
        title: 'Duplicate Slug Page',
        slug: 'about-us', // Already exists
        template: 'custom',
        content: { hero: null, sections: [] },
        seo: { title: 'Test', description: 'Test' }
      }

      const response = await fetch(`${API_BASE}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPage)
      })

      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Slug already exists')
    })
  })

  // ============================================
  // PUT /api/pages/:id
  // ============================================
  describe('PUT /api/pages/:id', () => {
    it('should update an existing page', async () => {
      const updates = {
        title: 'Updated Page Title',
        status: 'published'
      }

      const response = await fetch(`${API_BASE}/pages/page-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.title).toBe(updates.title)
      expect(data.data.status).toBe(updates.status)
    })

    it('should update SEO data', async () => {
      const updates = {
        seo: {
          title: 'Updated SEO Title',
          description: 'Updated SEO description'
        }
      }

      const response = await fetch(`${API_BASE}/pages/page-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      expect(data.data.seo.title).toBe(updates.seo.title)
      expect(data.data.seo.description).toBe(updates.seo.description)
    })

    it('should reject duplicate slug on update', async () => {
      // First create a new page
      await fetch(`${API_BASE}/pages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Test Page',
          slug: 'test-page',
          template: 'custom',
          content: { hero: null, sections: [] },
          seo: { title: 'Test', description: 'Test' }
        })
      })

      // Try to update page-1 with existing slug
      const response = await fetch(`${API_BASE}/pages/page-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: 'test-page' })
      })

      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Slug already exists')
    })

    it('should return 404 for non-existent page', async () => {
      const response = await fetch(`${API_BASE}/pages/non-existent`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'Test' })
      })

      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Page not found')
    })
  })

  // ============================================
  // DELETE /api/pages/:id
  // ============================================
  describe('DELETE /api/pages/:id', () => {
    it('should delete an existing page', async () => {
      const response = await fetch(`${API_BASE}/pages/page-1`, {
        method: 'DELETE'
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)

      // Verify deletion
      const verifyResponse = await fetch(`${API_BASE}/pages/page-1`)
      expect(verifyResponse.status).toBe(404)
    })

    it('should return 404 for non-existent page', async () => {
      const response = await fetch(`${API_BASE}/pages/non-existent`, {
        method: 'DELETE'
      })

      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Page not found')
    })
  })
})
