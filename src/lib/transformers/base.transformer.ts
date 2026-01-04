/**
 * Base Transformer Engine
 * High-performance, type-safe transformation utilities
 *
 * Performance Target: <1ms per object (20 fields)
 * Memory Target: <10MB overhead
 */

import type {
  FieldMapping,
  Transformer,
  InverseTransformer,
  BatchTransformer,
  TransformOptions,
  TransformError,
} from '../types'

// ============================================
// CORE TRANSFORMER FUNCTIONS
// ============================================

/**
 * Creates a high-performance transformer function
 * Uses pre-compiled field mappings for O(1) lookups
 *
 * @example
 * ```ts
 * const transformer = createTransformer<DBPage, APIPage>({
 *   id: 'id',
 *   metaTitle: 'meta_title',
 *   createdAt: 'created_at'
 * })
 * const apiPage = transformer(dbPage)
 * ```
 */
export function createTransformer<
  TFrom extends Record<string, any>,
  TTo extends Record<string, any>
>(mapping: FieldMapping<TFrom, TTo>): Transformer<TFrom, TTo> {
  // Pre-compile mapping keys for performance
  const keys = Object.keys(mapping) as Array<keyof TTo>
  const keyCount = keys.length

  return (data: TFrom): TTo => {
    if (!data || typeof data !== 'object') {
      throw new Error('Invalid input: expected object')
    }

    const result = {} as TTo

    // Direct field access - fastest approach
    for (let i = 0; i < keyCount; i++) {
      const toKey = keys[i]
      const fromKey = mapping[toKey] as keyof TFrom
      result[toKey] = data[fromKey] as TTo[typeof toKey]
    }

    return result
  }
}

/**
 * Creates an inverse transformer (API → Database)
 * Handles partial updates gracefully
 *
 * @example
 * ```ts
 * const inverseTransformer = createInverseTransformer<DBPage, APIPage>({
 *   id: 'id',
 *   metaTitle: 'meta_title'
 * })
 * const dbUpdate = inverseTransformer({ metaTitle: 'New Title' })
 * // Result: { meta_title: 'New Title' }
 * ```
 */
export function createInverseTransformer<
  TFrom extends Record<string, any>,
  TTo extends Record<string, any>
>(mapping: FieldMapping<TFrom, TTo>): InverseTransformer<TFrom, TTo> {
  // Pre-compile inverse mapping for performance
  const inverseMap = new Map<keyof TTo, keyof TFrom>()
  const keys = Object.keys(mapping) as Array<keyof TTo>

  for (let i = 0; i < keys.length; i++) {
    const toKey = keys[i]
    const fromKey = mapping[toKey]
    inverseMap.set(toKey, fromKey as keyof TFrom)
  }

  return (data: Partial<TTo>): Partial<TFrom> => {
    if (!data || typeof data !== 'object') {
      return {}
    }

    const result: Partial<TFrom> = {}
    const dataKeys = Object.keys(data) as Array<keyof TTo>

    for (let i = 0; i < dataKeys.length; i++) {
      const toKey = dataKeys[i]
      const fromKey = inverseMap.get(toKey)

      if (fromKey !== undefined) {
        result[fromKey] = data[toKey] as any
      }
    }

    return result
  }
}

/**
 * Transforms an array of items in batch
 * Optimized for large datasets
 *
 * @example
 * ```ts
 * const pages = transformMany(dbPages, pageTransformer)
 * ```
 */
export function transformMany<TFrom, TTo>(
  items: TFrom[],
  transformer: Transformer<TFrom, TTo>
): TTo[] {
  if (!Array.isArray(items)) {
    throw new Error('Invalid input: expected array')
  }

  const length = items.length
  const result = new Array<TTo>(length)

  for (let i = 0; i < length; i++) {
    result[i] = transformer(items[i])
  }

  return result
}

/**
 * Creates a batch transformer function
 * Pre-binds transformer for reuse
 */
export function createBatchTransformer<TFrom, TTo>(
  transformer: Transformer<TFrom, TTo>
): BatchTransformer<TFrom, TTo> {
  return (items: TFrom[]) => transformMany(items, transformer)
}

// ============================================
// ADVANCED TRANSFORMATION
// ============================================

/**
 * Transforms with custom options
 * Handles null/undefined values, field exclusions, custom transforms
 */
export function transformWithOptions<TFrom extends Record<string, any>, TTo extends Record<string, any>>(
  data: TFrom,
  mapping: FieldMapping<TFrom, TTo>,
  options: TransformOptions = {}
): TTo {
  const {
    includeNull = true,
    includeUndefined = false,
    customTransformers = {},
    exclude = [],
    include = [],
  } = options

  const result = {} as TTo
  const keys = Object.keys(mapping) as Array<keyof TTo>
  const excludeSet = new Set(exclude)

  for (const toKey of keys) {
    // Skip excluded fields
    if (excludeSet.has(toKey as string)) {
      continue
    }

    const fromKey = mapping[toKey] as keyof TFrom
    let value = data[fromKey]

    // Apply custom transformer if exists
    const customTransform = customTransformers[toKey as string]
    if (customTransform) {
      value = customTransform(value)
    }

    // Handle null/undefined based on options
    const isIncludedField = include.includes(toKey as string)
    if (value === null) {
      if (includeNull || isIncludedField) {
        result[toKey] = value as TTo[typeof toKey]
      }
      continue
    }

    if (value === undefined) {
      if (includeUndefined || isIncludedField) {
        result[toKey] = value as TTo[typeof toKey]
      }
      continue
    }

    result[toKey] = value as TTo[typeof toKey]
  }

  return result
}

/**
 * Safe transformer that never throws
 * Returns null on error instead
 */
export function createSafeTransformer<TFrom extends Record<string, any>, TTo extends Record<string, any>>(
  mapping: FieldMapping<TFrom, TTo>
): (data: TFrom | null | undefined) => TTo | null {
  const transformer = createTransformer(mapping)

  return (data: TFrom | null | undefined): TTo | null => {
    if (!data) return null

    try {
      return transformer(data)
    } catch (error) {
      console.error('Transformation error:', error)
      return null
    }
  }
}

// ============================================
// NESTED OBJECT TRANSFORMATION
// ============================================

/**
 * Deep merge two objects recursively
 * Used for merging default values with API data
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const output = { ...target }

  for (const key in source) {
    const sourceValue = source[key]
    const targetValue = target[key]

    if (isObject(sourceValue) && isObject(targetValue)) {
      output[key] = deepMerge(targetValue, sourceValue) as T[Extract<keyof T, string>]
    } else if (sourceValue !== undefined) {
      output[key] = sourceValue as T[Extract<keyof T, string>]
    }
  }

  return output
}

/**
 * Check if value is a plain object
 */
function isObject(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
}

/**
 * Transform nested objects recursively
 * Useful for transforming JSONB content fields
 */
export function transformNested<T>(
  data: Record<string, any>,
  keyTransform: (key: string) => string
): T {
  if (!isObject(data)) {
    return data as T
  }

  const result: Record<string, any> = {}

  for (const [key, value] of Object.entries(data)) {
    const transformedKey = keyTransform(key)

    if (Array.isArray(value)) {
      result[transformedKey] = value.map(item =>
        isObject(item) ? transformNested(item, keyTransform) : item
      )
    } else if (isObject(value)) {
      result[transformedKey] = transformNested(value, keyTransform)
    } else {
      result[transformedKey] = value
    }
  }

  return result as T
}

// ============================================
// CASE CONVERSION UTILITIES
// ============================================

/**
 * Convert snake_case to camelCase
 * Performance optimized - no regex
 */
export function snakeToCamel(str: string): string {
  if (!str || typeof str !== 'string') return str

  let result = ''
  let capitalizeNext = false
  const length = str.length

  for (let i = 0; i < length; i++) {
    const char = str[i]

    if (char === '_') {
      capitalizeNext = true
      continue
    }

    if (capitalizeNext) {
      result += char.toUpperCase()
      capitalizeNext = false
    } else {
      result += char
    }
  }

  return result
}

/**
 * Convert camelCase to snake_case
 * Performance optimized - no regex
 */
export function camelToSnake(str: string): string {
  if (!str || typeof str !== 'string') return str

  let result = ''
  const length = str.length

  for (let i = 0; i < length; i++) {
    const char = str[i]
    const code = char.charCodeAt(0)

    // Check if uppercase letter (A-Z = 65-90)
    if (code >= 65 && code <= 90) {
      if (i > 0) result += '_'
      result += char.toLowerCase()
    } else {
      result += char
    }
  }

  return result
}

/**
 * Transform all keys in object from snake_case to camelCase
 * Handles nested objects and arrays
 */
export function transformKeysToCamel<T>(data: Record<string, any>): T {
  return transformNested(data, snakeToCamel)
}

/**
 * Transform all keys in object from camelCase to snake_case
 * Handles nested objects and arrays
 */
export function transformKeysToSnake<T>(data: Record<string, any>): T {
  return transformNested(data, camelToSnake)
}

// ============================================
// PERFORMANCE UTILITIES
// ============================================

/**
 * Measure transformer performance
 * Returns execution time in milliseconds
 */
export function measureTransformPerformance<TFrom, TTo>(
  transformer: Transformer<TFrom, TTo>,
  data: TFrom,
  iterations: number = 1000
): number {
  const start = performance.now()

  for (let i = 0; i < iterations; i++) {
    transformer(data)
  }

  const end = performance.now()
  return (end - start) / iterations
}

/**
 * Benchmark transformer against target
 * Warns if performance is below target (<1ms)
 */
export function benchmarkTransformer<TFrom, TTo>(
  name: string,
  transformer: Transformer<TFrom, TTo>,
  testData: TFrom,
  targetMs: number = 1
): void {
  const avgTime = measureTransformPerformance(transformer, testData)

  console.log(`[Transformer Benchmark] ${name}`)
  console.log(`  Average time: ${avgTime.toFixed(4)}ms`)
  console.log(`  Target: ${targetMs}ms`)

  if (avgTime > targetMs) {
    console.warn(`  ⚠️  Performance below target! (${(avgTime / targetMs).toFixed(2)}x slower)`)
  } else {
    console.log(`  ✅ Performance OK (${(targetMs / avgTime).toFixed(2)}x faster than target)`)
  }
}

// ============================================
// TYPE GUARDS
// ============================================

/**
 * Check if object has all required fields
 */
export function hasRequiredFields<T extends Record<string, any>>(
  data: any,
  requiredFields: Array<keyof T>
): data is T {
  if (!data || typeof data !== 'object') return false

  for (const field of requiredFields) {
    if (!(field in data)) return false
  }

  return true
}

/**
 * Validate transformed data structure
 */
export function validateTransformedData<T>(
  data: any,
  requiredFields: string[]
): T {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid transformed data: not an object')
  }

  for (const field of requiredFields) {
    if (!(field in data)) {
      throw new Error(`Missing required field: ${field}`)
    }
  }

  return data as T
}

// ============================================
// EXPORTS
// ============================================

export default {
  createTransformer,
  createInverseTransformer,
  transformMany,
  createBatchTransformer,
  transformWithOptions,
  createSafeTransformer,
  deepMerge,
  transformNested,
  snakeToCamel,
  camelToSnake,
  transformKeysToCamel,
  transformKeysToSnake,
  measureTransformPerformance,
  benchmarkTransformer,
  hasRequiredFields,
  validateTransformedData,
}
