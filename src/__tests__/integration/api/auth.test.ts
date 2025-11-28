/**
 * WellnessTall - Auth API Tests
 * Enterprise-grade integration tests
 *
 * ⚠️ STRICT RULES:
 * - Once this test passes, it becomes IMMUTABLE
 * - API must conform to these tests, not vice versa
 * - DO NOT modify assertions after tests pass
 *
 * @module tests/api/auth
 */

import { describe, it, expect } from 'vitest'

const API_BASE = 'http://localhost:3001/api'

describe('Auth API', () => {
  // ============================================
  // POST /api/auth/login
  // ============================================
  describe('POST /api/auth/login', () => {
    it('should login with valid credentials', async () => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: 'wellnesstal2024'
        })
      })

      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data).toHaveProperty('user')
      expect(data).toHaveProperty('token')
    })

    it('should return user object with required fields', async () => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: 'wellnesstal2024'
        })
      })

      const data = await response.json()

      expect(data.user).toHaveProperty('id')
      expect(data.user).toHaveProperty('username')
      expect(data.user).toHaveProperty('role')
      expect(data.user.role).toBe('admin')
    })

    it('should return JWT token', async () => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: 'wellnesstal2024'
        })
      })

      const data = await response.json()

      expect(data.token).toBeTruthy()
      expect(typeof data.token).toBe('string')
    })

    it('should reject invalid username', async () => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'invalid',
          password: 'wellnesstal2024'
        })
      })

      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid credentials')
    })

    it('should reject invalid password', async () => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: 'admin',
          password: 'wrongpassword'
        })
      })

      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid credentials')
    })

    it('should reject empty credentials', async () => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: '',
          password: ''
        })
      })

      const data = await response.json()

      expect(response.status).toBe(401)
      expect(data.success).toBe(false)
    })
  })
})
