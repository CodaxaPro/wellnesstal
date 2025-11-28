/**
 * WellnessTall - Services API Tests
 * Enterprise-grade integration tests
 *
 * ⚠️ STRICT RULES:
 * - Once this test passes, it becomes IMMUTABLE
 * - API must conform to these tests, not vice versa
 * - DO NOT modify assertions after tests pass
 *
 * @module tests/api/services
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { resetMockData } from '../../mocks/handlers'

const API_BASE = 'http://localhost:3001/api'

describe('Services API', () => {
  beforeEach(() => {
    resetMockData()
  })

  // ============================================
  // GET /api/services
  // ============================================
  describe('GET /api/services', () => {
    it('should return all services', async () => {
      const response = await fetch(`${API_BASE}/services`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(Array.isArray(data.data)).toBe(true)
      expect(data.data.length).toBeGreaterThan(0)
    })

    it('should return services with correct structure', async () => {
      const response = await fetch(`${API_BASE}/services`)
      const data = await response.json()

      const service = data.data[0]
      expect(service).toHaveProperty('id')
      expect(service).toHaveProperty('name')
      expect(service).toHaveProperty('slug')
      expect(service).toHaveProperty('description')
      expect(service).toHaveProperty('price')
      expect(service).toHaveProperty('duration')
      expect(service).toHaveProperty('active')
      expect(service).toHaveProperty('categoryId')
      expect(service).toHaveProperty('createdAt')
      expect(service).toHaveProperty('updatedAt')
    })

    it('should filter services by active status', async () => {
      const response = await fetch(`${API_BASE}/services?active=true`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.every((s: { active: boolean }) => s.active === true)).toBe(true)
    })

    it('should filter services by categoryId', async () => {
      const response = await fetch(`${API_BASE}/services?categoryId=category-1`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.every((s: { categoryId: string }) => s.categoryId === 'category-1')).toBe(true)
    })

    it('should search services by name', async () => {
      const response = await fetch(`${API_BASE}/services?search=head`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.data.length).toBeGreaterThan(0)
      expect(data.data[0].name.toLowerCase()).toContain('head')
    })

    it('should return total count', async () => {
      const response = await fetch(`${API_BASE}/services`)
      const data = await response.json()

      expect(data).toHaveProperty('total')
      expect(typeof data.total).toBe('number')
    })
  })

  // ============================================
  // GET /api/services/:id
  // ============================================
  describe('GET /api/services/:id', () => {
    it('should return a single service by id', async () => {
      const response = await fetch(`${API_BASE}/services/service-1`)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.id).toBe('service-1')
    })

    it('should return 404 for non-existent service', async () => {
      const response = await fetch(`${API_BASE}/services/non-existent`)
      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Service not found')
    })
  })

  // ============================================
  // POST /api/services
  // ============================================
  describe('POST /api/services', () => {
    it('should create a new service', async () => {
      const newService = {
        name: 'New Wellness Service',
        slug: 'new-wellness-service',
        description: 'A brand new wellness service',
        price: 150,
        duration: 45,
        active: true,
        categoryId: 'category-1'
      }

      const response = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      })

      const data = await response.json()

      expect(response.status).toBe(201)
      expect(data.success).toBe(true)
      expect(data.data).toHaveProperty('id')
      expect(data.data.name).toBe(newService.name)
      expect(data.data.price).toBe(newService.price)
      expect(data.data).toHaveProperty('createdAt')
      expect(data.data).toHaveProperty('updatedAt')
    })

    it('should generate id and timestamps automatically', async () => {
      const newService = {
        name: 'Auto ID Service',
        slug: 'auto-id-service',
        description: 'Service with auto-generated fields',
        price: 100,
        duration: 30,
        active: true,
        categoryId: 'category-2'
      }

      const response = await fetch(`${API_BASE}/services`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newService)
      })

      const data = await response.json()

      expect(data.data.id).toBeTruthy()
      expect(data.data.id).toMatch(/^service-/)
      expect(new Date(data.data.createdAt).getTime()).not.toBeNaN()
      expect(new Date(data.data.updatedAt).getTime()).not.toBeNaN()
    })
  })

  // ============================================
  // PUT /api/services/:id
  // ============================================
  describe('PUT /api/services/:id', () => {
    it('should update an existing service', async () => {
      const updates = {
        name: 'Updated Service Name',
        price: 200
      }

      const response = await fetch(`${API_BASE}/services/service-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data.name).toBe(updates.name)
      expect(data.data.price).toBe(updates.price)
    })

    it('should update updatedAt timestamp', async () => {
      const originalResponse = await fetch(`${API_BASE}/services/service-1`)
      const originalData = await originalResponse.json()
      const originalUpdatedAt = originalData.data.updatedAt

      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10))

      const response = await fetch(`${API_BASE}/services/service-1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Time Test' })
      })

      const data = await response.json()

      expect(new Date(data.data.updatedAt).getTime()).toBeGreaterThan(
        new Date(originalUpdatedAt).getTime()
      )
    })

    it('should return 404 for non-existent service', async () => {
      const response = await fetch(`${API_BASE}/services/non-existent`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Test' })
      })

      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Service not found')
    })
  })

  // ============================================
  // DELETE /api/services/:id
  // ============================================
  describe('DELETE /api/services/:id', () => {
    it('should delete an existing service', async () => {
      const response = await fetch(`${API_BASE}/services/service-1`, {
        method: 'DELETE'
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)

      // Verify deletion
      const verifyResponse = await fetch(`${API_BASE}/services/service-1`)
      expect(verifyResponse.status).toBe(404)
    })

    it('should return 404 for non-existent service', async () => {
      const response = await fetch(`${API_BASE}/services/non-existent`, {
        method: 'DELETE'
      })

      const data = await response.json()

      expect(response.status).toBe(404)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Service not found')
    })
  })
})
