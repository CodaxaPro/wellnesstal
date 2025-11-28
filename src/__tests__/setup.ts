/**
 * WellnessTall Test Setup
 * Enterprise-grade test configuration
 *
 * ⚠️ STRICT RULES:
 * - Once a test passes, it becomes immutable
 * - API must conform to tests, not vice versa
 * - Shared helpers must not be modified after creation
 */

import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll, vi } from 'vitest'

// Polyfill localStorage for MSW
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  key: vi.fn(),
  length: 0
}
Object.defineProperty(global, 'localStorage', { value: localStorageMock })

// Import MSW after localStorage polyfill
const { server } = await import('./mocks/server')

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn()
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  useParams: () => ({})
}))

// Mock Next.js cookies
vi.mock('next/headers', () => ({
  cookies: () => ({
    get: vi.fn(),
    set: vi.fn(),
    delete: vi.fn()
  }),
  headers: () => new Headers()
}))

// Mock Supabase client
vi.mock('@/lib/supabase', () => ({
  createClient: () => ({
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
    },
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: null, error: null }),
      order: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis()
    }))
  })
}))

// Setup MSW server
beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

afterEach(() => {
  server.resetHandlers()
  vi.clearAllMocks()
})

afterAll(() => {
  server.close()
})

// Global test utilities
export const TEST_CONFIG = {
  API_BASE_URL: 'http://localhost:3001',
  TEST_TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3
}

// Test data factory
export const createTestService = (overrides = {}) => ({
  id: 'service-1',
  name: 'Test Service',
  slug: 'test-service',
  description: 'Test service description',
  price: 100,
  duration: 60,
  active: true,
  categoryId: 'category-1',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

export const createTestCategory = (overrides = {}) => ({
  id: 'category-1',
  name: 'Test Category',
  slug: 'test-category',
  description: 'Test category description',
  order: 0,
  active: true,
  serviceCount: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

export const createTestPage = (overrides = {}) => ({
  id: 'page-1',
  title: 'Test Page',
  slug: 'test-page',
  status: 'draft' as const,
  template: 'custom' as const,
  content: {
    hero: null,
    sections: []
  },
  seo: {
    title: 'Test Page',
    description: 'Test page description'
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  ...overrides
})

export const createTestUser = (overrides = {}) => ({
  id: 'user-1',
  email: 'test@wellnesstal.de',
  role: 'admin',
  tenantId: 'tenant-1',
  ...overrides
})
