/**
 * WellnessTall - Categories API Tests
 * Enterprise-grade integration tests
 *
 * ⚠️ STRICT RULES:
 * - Once this test passes, it becomes IMMUTABLE
 * - API must conform to these tests, not vice versa
 * - DO NOT modify assertions after tests pass
 *
 * @module tests/api/categories
 */

import { describe, it, expect, beforeEach } from 'vitest'

import { resetMockData } from '../../mocks/handlers'

const API_BASE = 'http://localhost:3001/api'

describe('Categories API', () => {
  beforeEach(() => {
    resetMockData()
  })

  // ============================================
  // GET /api/categories
  // ============================================
  describe('GET /api/categories', () => {
    it('should return all categories', async () => {
      const response = await fetch(`${API_BASE}/categories`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data.length).toBeGreaterThan(0)
    })

    it('should return categories with correct structure', async () => {
      const response = await fetch(`${API_BASE}/categories`)
      const data = await response.json()

      const category = data.data[0]
      expect(category).toHaveProperty('id')
      expect(category).toHaveProperty('name')
      expect(category).toHaveProperty('slug')
      expect(category).toHaveProperty('description')
      expect(category).toHaveProperty('order')
      expect(category).toHaveProperty('active')
      expect(category).toHaveProperty('serviceCount')
      expect(category).toHaveProperty('createdAt')
      expect(category).toHaveProperty('updatedAt')
    })

    it('should return stats object', async () => {
      const response = await fetch(`${API_BASE}/categories`)
      const data = await response.json()

      expect(data).toHaveProperty('stats')
      expect(data.stats).toHaveProperty('total')
      expect(data.stats).toHaveProperty('active')
      expect(data.stats).toHaveProperty('inactive')
      expect(data.stats).toHaveProperty('totalServices')
    })

    it('should filter categories by active status', async () => {
      const response = await fetch(`${API_BASE}/categories?active=true`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.every((c: { active: boolean }) => c.active === true)).toBe(true)
    })

    it('should search categories by name', async () => {
      const response = await fetch(`${API_BASE}/categories?search=head`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.length).toBeGreaterThan(0)
      expect(data.data[0].name.toLowerCase()).toContain('head')
    })

    it('should sort categories by specified field', async () => {
      const response = await fetch(`${API_BASE}/categories?sort=name&order=asc`)
      const data = await response.json()

      expect(response.status).toBe(200)
      const names = data.data.map((c: { name: string }) => c.name)
      const sortedNames = [...names].sort()
      expect(names).toEqual(sortedNames)
    })

    it('should sort categories in descending order', async () => {
      const response = await fetch(`${API_BASE}/categories?sort=name&order=desc`)
      const data = await response.json()

      expect(response.status).toBe(200)
      const names = data.data.map((c: { name: string }) => c.name)
      const sortedNames = [...names].sort().reverse()
      expect(names).toEqual(sortedNames)
    })
  })

  // ============================================
  // GET /api/categories/:id
  // ============================================
  describe('GET /api/categories/:id', () => {
    it('should return a single category by id', async () => {
      const response = await fetch(`${API_BASE}/categories/category-1`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('category-1')
    })

    it('should return 404 for non-existent category', async () => {
      const response = await fetch(`${API_BASE}/categories/non-existent`)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Category not found')
    })
  })

  // ============================================
  // POST /api/categories
  // ============================================
  describe('POST /api/categories', () => {
    it('should create a new category', async () => {
      const newCategory = {
        name: 'New Category',
        slug: 'new-category',
        description: 'A brand new category',
        order: 5,
        active: true
      }

      const response = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      })

      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('id')
      expect(data.data.name).toBe(newCategory.name)
      expect(data.data.serviceCount).toBe(0)
      expect(data.data).toHaveProperty('createdAt')
      expect(data.data).toHaveProperty('updatedAt')
    })

    it('should initialize serviceCount to 0', async () => {
      const newCategory = {
        name: 'Zero Services Category',
        slug: 'zero-services',
        description: 'Category with no services',
        order: 10,
        active: true
      }

      const response = await fetch(`${API_BASE}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      })

      const data = await response.json()

      expect(data.data.serviceCount).toBe(0)
    })
  })

  // ============================================
  // PUT /api/categories/:id
  // ============================================
  describe('PUT /api/categories/:id', () => {
    it('should update an existing category', async () => {
      const updates = {
        name: 'Updated Category Name',
        description: 'Updated description'
      }

      const response = await fetch(`${API_BASE}/categories/category-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(updates.name)
      expect(data.data.description).toBe(updates.description)
    })

    it('should return 404 for non-existent category', async () => {
      const response = await fetch(`${API_BASE}/categories/non-existent`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test' })
      })

      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Category not found')
    })
  })

  // ============================================
  // DELETE /api/categories/:id
  // ============================================
  describe('DELETE /api/categories/:id', () => {
    it('should delete an existing category', async () => {
      const response = await fetch(`${API_BASE}/categories/category-1`, {
        method: 'DELETE'
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)

      // Verify deletion
      const verifyResponse = await fetch(`${API_BASE}/categories/category-1`)
      expect(verifyResponse.status).toBe(404)
    })

    it('should return 404 for non-existent category', async () => {
      const response = await fetch(`${API_BASE}/categories/non-existent`, {
        method: 'DELETE'
      })

      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Category not found')
    })
  })

  // ============================================
  // PUT /api/categories/reorder
  // ============================================
  describe('PUT /api/categories/reorder', () => {
    it('should reorder categories', async () => {
      const reorderData = {
        orderedIds: ['category-2', 'category-1']
      }

      const response = await fetch(`${API_BASE}/categories/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reorderData)
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)

      // Verify new order
      const cat1 = data.data.find((c: { id: string }) => c.id === 'category-1')
      const cat2 = data.data.find((c: { id: string }) => c.id === 'category-2')

      expect(cat2.order).toBe(0)
      expect(cat1.order).toBe(1)
    })
  })
})
