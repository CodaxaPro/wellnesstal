/**
 * Enterprise Rate Limiting
 * In-memory rate limiting for API routes
 */

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  max: number // Maximum number of requests per window
  message?: string // Custom error message
  skipSuccessfulRequests?: boolean // Don't count successful requests
  skipFailedRequests?: boolean // Don't count failed requests
}

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

class RateLimiter {
  private store: RateLimitStore = {}
  private config: RateLimitConfig

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: config.windowMs || 60000, // Default 1 minute
      max: config.max || 100, // Default 100 requests
      message: config.message || 'Too many requests, please try again later.',
      skipSuccessfulRequests: config.skipSuccessfulRequests || false,
      skipFailedRequests: config.skipFailedRequests || false
    }
  }

  private getKey(identifier: string): string {
    return `ratelimit:${identifier}`
  }

  private cleanup(): void {
    const now = Date.now()
    Object.keys(this.store).forEach(key => {
      if (this.store[key].resetTime < now) {
        delete this.store[key]
      }
    })
  }

  check(identifier: string): { allowed: boolean; remaining: number; resetTime: number } {
    // Cleanup expired entries periodically
    if (Math.random() < 0.01) { // 1% chance to cleanup
      this.cleanup()
    }

    const key = this.getKey(identifier)
    const now = Date.now()
    const entry = this.store[key]

    if (!entry || entry.resetTime < now) {
      // Create new entry
      this.store[key] = {
        count: 1,
        resetTime: now + this.config.windowMs
      }
      return {
        allowed: true,
        remaining: this.config.max - 1,
        resetTime: now + this.config.windowMs
      }
    }

    // Increment count
    entry.count++

    if (entry.count > this.config.max) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime
      }
    }

    return {
      allowed: true,
      remaining: this.config.max - entry.count,
      resetTime: entry.resetTime
    }
  }

  reset(identifier: string): void {
    const key = this.getKey(identifier)
    delete this.store[key]
  }

  getRemaining(identifier: string): number {
    const key = this.getKey(identifier)
    const entry = this.store[key]
    if (!entry || entry.resetTime < Date.now()) {
      return this.config.max
    }
    return Math.max(0, this.config.max - entry.count)
  }
}

// Create rate limiters for different use cases
export const apiRateLimiter = new RateLimiter({
  windowMs: 60000, // 1 minute
  max: 100, // 100 requests per minute
  message: 'API rate limit exceeded. Please try again later.'
})

export const authRateLimiter = new RateLimiter({
  windowMs: 900000, // 15 minutes
  max: 5, // 5 login attempts per 15 minutes
  message: 'Too many login attempts. Please try again later.'
})

export const uploadRateLimiter = new RateLimiter({
  windowMs: 3600000, // 1 hour
  max: 50, // 50 uploads per hour
  message: 'Upload rate limit exceeded. Please try again later.'
})

/**
 * Get client identifier from request
 */
export function getClientIdentifier(request: Request): string {
  // Try to get IP from headers (Vercel, Cloudflare, etc.)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIp = request.headers.get('x-real-ip')
  const ip = forwarded?.split(',')[0] || realIp || 'unknown'

  // Use IP + user agent for better identification
  const userAgent = request.headers.get('user-agent') || 'unknown'
  return `${ip}:${userAgent.slice(0, 50)}`
}

/**
 * Rate limit middleware for Next.js API routes
 */
export async function rateLimit(
  request: Request,
  limiter: RateLimiter = apiRateLimiter
): Promise<{ allowed: boolean; remaining: number; resetTime: number }> {
  const identifier = getClientIdentifier(request)
  return limiter.check(identifier)
}

