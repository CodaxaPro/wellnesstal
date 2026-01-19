/**
 * Enterprise Monitoring & Observability
 * Performance monitoring, analytics, and health checks
 */

interface PerformanceMetric {
  name: string
  value: number
  unit: string
  timestamp: number
  tags?: Record<string, string>
}

interface HealthCheck {
  service: string
  status: 'healthy' | 'degraded' | 'down'
  timestamp: number
  details?: Record<string, any>
}

class Monitoring {
  private metrics: PerformanceMetric[] = []
  private healthChecks: HealthCheck[] = []

  /**
   * Track performance metric
   */
  trackMetric(name: string, value: number, unit: string = 'ms', tags?: Record<string, string>) {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags
    }

    this.metrics.push(metric)

    // Keep only last 1000 metrics
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000)
    }

    // TODO: Send to monitoring service (DataDog, New Relic, etc.)
    // if (typeof window !== 'undefined' && window.DD_RUM) {
    //   window.DD_RUM.addAction(name, { value, unit, ...tags })
    // }
  }

  /**
   * Track page load performance
   */
  trackPageLoad() {
    if (typeof window === 'undefined') {
return
}

    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      
      if (navigation) {
        this.trackMetric('page.load.time', navigation.loadEventEnd - navigation.fetchStart, 'ms')
        this.trackMetric('page.dom.content.loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart, 'ms')
        this.trackMetric('page.first.byte', navigation.responseStart - navigation.fetchStart, 'ms')
      }

      // Web Vitals
      if ('PerformanceObserver' in window) {
        try {
          const observer = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
              if (entry.entryType === 'largest-contentful-paint') {
                const lcp = entry as PerformanceEntry & { renderTime?: number; loadTime?: number }
                this.trackMetric('web.vitals.lcp', (lcp.renderTime || lcp.loadTime || 0), 'ms')
              }
              if (entry.entryType === 'first-input') {
                const fid = entry as PerformanceEntry & { processingStart?: number; startTime?: number }
                this.trackMetric('web.vitals.fid', (fid.processingStart || fid.startTime || 0), 'ms')
              }
            }
          })
          observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input'] })
        } catch (e) {
          // PerformanceObserver not supported
        }
      }
    })
  }

  /**
   * Track API call performance
   */
  trackAPICall(endpoint: string, duration: number, status: number) {
    this.trackMetric('api.call.duration', duration, 'ms', {
      endpoint,
      status: status.toString()
    })
  }

  /**
   * Track error
   */
  trackError(error: Error, context?: Record<string, any>) {
    this.trackMetric('error.count', 1, 'count', {
      error: error.name,
      message: error.message,
      ...context
    })

    // TODO: Send to error tracking service
  }

  /**
   * Health check
   */
  async checkHealth(service: string): Promise<HealthCheck> {
    const startTime = Date.now()
    let status: 'healthy' | 'degraded' | 'down' = 'healthy'
    let details: Record<string, any> = {}

    try {
      // Check database connection
      if (service === 'database') {
        // TODO: Implement actual database health check
        status = 'healthy'
        details = { responseTime: Date.now() - startTime }
      }

      // Check API
      if (service === 'api') {
        status = 'healthy'
        details = { responseTime: Date.now() - startTime }
      }
    } catch (error) {
      status = 'down'
      details = { error: (error as Error).message }
    }

    const healthCheck: HealthCheck = {
      service,
      status,
      timestamp: Date.now(),
      details
    }

    this.healthChecks.push(healthCheck)
    return healthCheck
  }

  /**
   * Get metrics summary
   */
  getMetricsSummary(metricName?: string): {
    count: number
    average: number
    min: number
    max: number
  } {
    const filtered = metricName
      ? this.metrics.filter(m => m.name === metricName)
      : this.metrics

    if (filtered.length === 0) {
      return { count: 0, average: 0, min: 0, max: 0 }
    }

    const values = filtered.map(m => m.value)
    const sum = values.reduce((a, b) => a + b, 0)
    const average = sum / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)

    return { count: filtered.length, average, min, max }
  }

  /**
   * Get all health checks
   */
  getHealthChecks(): HealthCheck[] {
    return [...this.healthChecks]
  }
}

// Export singleton instance
export const monitoring = new Monitoring()

// Initialize page load tracking (only on client-side)
if (typeof window !== 'undefined') {
  // Use setTimeout to ensure DOM is ready
  setTimeout(() => {
    monitoring.trackPageLoad()
  }, 0)
}

