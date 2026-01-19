# Component Documentation

## ErrorBoundary

Catches React errors and displays fallback UI.

**Usage:**

```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary'

;<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

**Props:**

- `children`: ReactNode - Components to wrap
- `fallback?`: ReactNode - Custom fallback UI
- `onError?`: (error: Error, errorInfo: ErrorInfo) => void - Error handler

## BlockRenderer

Renders page blocks dynamically.

**Usage:**

```tsx
import BlockRenderer from '@/components/blocks/BlockRenderer'

;<BlockRenderer blocks={blocks} />
```

**Props:**

- `blocks`: PageBlock[] - Array of blocks to render
- `isEditing?`: boolean - Edit mode
- `onBlockUpdate?`: (blockId: string, content: Record<string, any>) => void

## Blocks

### HeroBlock

Hero section with title, description, buttons, and image/video.

### PricingBlock

Pricing table with packages and features.

### FeaturesBlock

Feature grid with icons and descriptions.

### TestimonialsBlock

Customer testimonials carousel.

### ContactBlock

Contact form and information.

### SEOBlock

SEO metadata and structured data.

## Utilities

### Logger

Centralized logging system.

**Usage:**

```tsx
import { logger } from '@/lib/logger'

logger.info('Message', { context })
logger.error('Error', error, { context })
```

### Rate Limiter

Rate limiting for API routes.

**Usage:**

```tsx
import { rateLimit, apiRateLimiter } from '@/lib/rate-limit'

const result = await rateLimit(request, apiRateLimiter)
if (!result.allowed) {
  return new Response('Rate limited', { status: 429 })
}
```

### Monitoring

Performance monitoring and health checks.

**Usage:**

```tsx
import { monitoring } from '@/lib/monitoring'

monitoring.trackMetric('operation.duration', 100, 'ms')
monitoring.trackAPICall('/api/endpoint', 50, 200)
```
