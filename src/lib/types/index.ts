/**
 * Type System Exports
 * Central export point for all type definitions
 */

// ============================================
// DATABASE TYPES (snake_case)
// ============================================

export type {
  // Pages System
  DBPage,
  DBPageBlock,
  DBBlockType,

  // Services & Categories
  DBService,
  DBCategory,

  // Testimonials & Reviews
  DBTestimonial,
  DBGoogleReview,

  // Admin & Auth
  DBAdminUser,

  // Content Management
  DBContent,
  DBHomepageSection,

  // Media Management
  DBMediaFile,
  DBMediaCategory,

  // Multi-tenancy
  DBTenant,
  DBTenantUser,

  // Utilities
  DatabaseTables,
  TableName,
} from './database.types'

// ============================================
// API TYPES (camelCase)
// ============================================

export type {
  // Pages System
  APIPage,
  APIPageBlock,
  APIBlockType,

  // Services & Categories
  APIService,
  APICategory,

  // Testimonials & Reviews
  APITestimonial,
  APIGoogleReview,

  // Admin & Auth
  APIAdminUser,
  APIAuthResponse,

  // Content Management
  APIContent,
  APIHomepageSection,

  // Media Management
  APIMediaFile,
  APIMediaCategory,

  // Multi-tenancy
  APITenant,
  APITenantUser,

  // Response Wrappers
  APIResponse,
  APIPaginatedResponse,
  APIListResponse,
  Response,
  PaginatedResponse,
  ListResponse,

  // Query Types
  PaginationQuery,
  PageQuery,
  ServiceQuery,
  MediaQuery,

  // Input Types
  CreatePageInput,
  UpdatePageInput,
  CreateServiceInput,
  UpdateServiceInput,
  CreateBlockInput,
  UpdateBlockInput,

  // Reorder Types
  ReorderItem,
  ReorderRequest,

  // Status Types
  PageStatus,
  AdminRole,
  ReviewSource,
} from './api.types'

// Type guards
export { isAPIResponse, isAPIPaginatedResponse } from './api.types'

// ============================================
// TRANSFORMER TYPES
// ============================================

export type {
  // Mapping Types
  FieldMapping,
  InverseFieldMapping,

  // Transformer Function Types
  Transformer,
  InverseTransformer,
  BatchTransformer,
  PartialTransformer,
  NullableTransformer,
  DeepTransformer,

  // Options
  TransformOptions,

  // Validation Types
  ValidateMapping,
  IsCompleteMapping,

  // Registry
  TransformerRegistry,

  // Utilities
  TimestampKeys,
  IdKeys,
  SnakeToCamel,
  CamelToSnake,

  // Performance
  TransformPerformanceMetrics,
  TransformerBenchmark,
} from './transformers.types'

// Error classes
export {
  TransformError,
  MissingFieldError,
  InvalidTypeError,
} from './transformers.types'

// ============================================
// RE-EXPORTS FOR CONVENIENCE
// ============================================

// Most commonly used types
export type {
  APIPage as Page,
  APIService as Service,
  APICategory as Category,
  APIContent as Content,
  APIMediaFile as MediaFile,
  APIAdminUser as AdminUser,
} from './api.types'
