/**
 * Transformer Utility Types
 * Type utilities for building type-safe transformers
 */

// ============================================
// FIELD MAPPING TYPES
// ============================================

/**
 * Maps fields from source type to target type
 * Used by createTransformer to define field mappings
 */
export type FieldMapping<TFrom, TTo> = {
  [K in keyof TTo]: keyof TFrom
}

/**
 * Inverse field mapping (swaps From and To)
 * Used by createInverseTransformer
 */
export type InverseFieldMapping<TFrom, TTo> = {
  [K in keyof TFrom]: keyof TTo
}

// ============================================
// TRANSFORMER FUNCTION TYPES
// ============================================

/**
 * Generic transformer function type
 * Transforms from database type to API type
 */
export type Transformer<TFrom, TTo> = (data: TFrom) => TTo

/**
 * Inverse transformer function type
 * Transforms from API type to database type (for writes)
 */
export type InverseTransformer<TFrom, TTo> = (data: Partial<TTo>) => Partial<TFrom>

/**
 * Batch transformer function type
 * Transforms array of items
 */
export type BatchTransformer<TFrom, TTo> = (data: TFrom[]) => TTo[]

// ============================================
// PARTIAL TRANSFORMATION TYPES
// ============================================

/**
 * Allows partial transformation where not all fields are required
 */
export type PartialTransformer<TFrom, TTo> = (data: Partial<TFrom>) => Partial<TTo>

/**
 * Nullable transformer - handles null/undefined inputs
 */
export type NullableTransformer<TFrom, TTo> = (data: TFrom | null | undefined) => TTo | null

// ============================================
// NESTED OBJECT TRANSFORMATION
// ============================================

/**
 * For transforming nested objects recursively
 */
export type DeepTransformer<TFrom, TTo> = {
  [K in keyof TTo]: TTo[K] extends object
    ? DeepTransformer<TFrom[FieldMapping<TFrom, TTo>[K]], TTo[K]>
    : Transformer<TFrom[FieldMapping<TFrom, TTo>[K]], TTo[K]>
}

// ============================================
// TRANSFORMATION OPTIONS
// ============================================

export interface TransformOptions {
  /**
   * Whether to include null values in output
   * @default true
   */
  includeNull?: boolean

  /**
   * Whether to include undefined values in output
   * @default false
   */
  includeUndefined?: boolean

  /**
   * Custom field transformers
   */
  customTransformers?: Record<string, (value: any) => any>

  /**
   * Fields to exclude from transformation
   */
  exclude?: string[]

  /**
   * Fields to always include even if null/undefined
   */
  include?: string[]
}

// ============================================
// VALIDATION TYPES
// ============================================

/**
 * Ensures all keys in target exist in source mapping
 */
export type ValidateMapping<TFrom, TTo, TMapping extends FieldMapping<TFrom, TTo>> = {
  [K in keyof TTo]: TMapping[K] extends keyof TFrom ? TMapping[K] : never
}

/**
 * Checks if transformation is complete (all fields mapped)
 */
export type IsCompleteMapping<TFrom, TTo, TMapping extends FieldMapping<TFrom, TTo>> = {
  [K in keyof TTo]: K extends keyof TMapping ? true : false
}

// ============================================
// TRANSFORMER REGISTRY
// ============================================

/**
 * Registry of all transformers for a given entity
 */
export interface TransformerRegistry<TFrom, TTo> {
  toAPI: Transformer<TFrom, TTo>
  toDatabase: InverseTransformer<TFrom, TTo>
  toAPIMany: BatchTransformer<TFrom, TTo>
  toAPINullable: NullableTransformer<TFrom, TTo>
}

// ============================================
// TYPE UTILITIES
// ============================================

/**
 * Extracts keys that are timestamps (end with _at or At)
 */
export type TimestampKeys<T> = {
  [K in keyof T]: K extends `${string}_at` | `${string}At`
    ? T[K] extends string | null | undefined
      ? K
      : never
    : never
}[keyof T]

/**
 * Extracts keys that are IDs (end with _id or Id)
 */
export type IdKeys<T> = {
  [K in keyof T]: K extends `${string}_id` | `${string}Id`
    ? T[K] extends string | null | undefined
      ? K
      : never
    : never
}[keyof T]

/**
 * snake_case to camelCase type transformation
 * Example: 'created_at' -> 'createdAt'
 */
export type SnakeToCamel<S extends string> = S extends `${infer T}_${infer U}`
  ? `${T}${Capitalize<SnakeToCamel<U>>}`
  : S

/**
 * camelCase to snake_case type transformation
 * Example: 'createdAt' -> 'created_at'
 */
export type CamelToSnake<S extends string> = S extends `${infer T}${infer U}`
  ? U extends Uncapitalize<U>
    ? `${T}${CamelToSnake<U>}`
    : `${T}_${Lowercase<U>}${CamelToSnake<U>}`
  : S

// ============================================
// PERFORMANCE TYPES
// ============================================

export interface TransformPerformanceMetrics {
  transformCount: number
  totalTime: number
  averageTime: number
  maxTime: number
  minTime: number
}

export interface TransformerBenchmark {
  name: string
  objectSize: number
  iterations: number
  metrics: TransformPerformanceMetrics
}

// ============================================
// ERROR TYPES
// ============================================

export class TransformError extends Error {
  constructor(
    message: string,
    public field?: string,
    public value?: any,
    public originalError?: Error
  ) {
    super(message)
    this.name = 'TransformError'
  }
}

export class MissingFieldError extends TransformError {
  constructor(field: string) {
    super(`Required field "${field}" is missing`, field)
    this.name = 'MissingFieldError'
  }
}

export class InvalidTypeError extends TransformError {
  constructor(field: string, expectedType: string, actualType: string) {
    super(
      `Field "${field}" expected type ${expectedType}, got ${actualType}`,
      field
    )
    this.name = 'InvalidTypeError'
  }
}
