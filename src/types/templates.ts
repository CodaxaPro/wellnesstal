/**
 * Template System Type Definitions
 * Comprehensive type system for multi-tenant SaaS template engine
 */

// Industry-specific template types
export type IndustryType = 
  | 'wellness' 
  | 'restaurant' 
  | 'healthcare' 
  | 'education'
  | 'ecommerce'
  | 'hospitality'
  | 'fitness'
  | 'beauty'
  | 'consulting'
  | 'real-estate'
  | 'automotive'
  | 'legal'
  | 'finance'
  | 'nonprofit'
  | 'custom';

// Template complexity levels
export type TemplateComplexity = 'basic' | 'professional' | 'enterprise' | 'custom';

// Field types for dynamic forms
export type FieldType = 
  | 'text' | 'textarea' | 'email' | 'url' | 'phone'
  | 'number' | 'currency' | 'percentage'  
  | 'date' | 'datetime' | 'time'
  | 'select' | 'multiselect' | 'radio' | 'checkbox'
  | 'file' | 'image' | 'color'
  | 'toggle' | 'range'
  | 'json' | 'markdown' | 'code';

// Validation rules
export interface ValidationRule {
  type: 'regex' | 'custom' | 'range' | 'length' | 'required';
  value?: any;
  message?: string;
}

// Conditional logic for fields
export interface ConditionalRule {
  field: string;
  operator: '==' | '!=' | '>' | '<' | 'includes' | 'excludes';
  value: any;
}

// Select options for dropdowns
export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

// Dynamic field configuration
export interface FieldConfig {
  key: string;           // "name", "price", "category"
  label: string;         // "Service Name", "Price", "Category"
  type: FieldType;       // "text", "number", "select", etc.
  required: boolean;
  validation?: ValidationRule[];
  
  // UI Properties
  placeholder?: string;
  helpText?: string;
  group?: string;        // Form group/section
  order: number;         // Display order
  
  // Conditional Logic
  showIf?: ConditionalRule;
  requiredIf?: ConditionalRule;
  
  // Field-specific config
  options?: SelectOption[];  // For select, radio, checkbox
  min?: number;             // For number, text length
  max?: number;
  format?: string;          // For dates, currencies
}

// Entity configuration (Services, Products, Patients, etc.)
export interface EntityConfig {
  name: string;           // "Services", "Products", "Patients"
  singular: string;       // "Service", "Product", "Patient"  
  plural: string;         // "Services", "Products", "Patients"
  icon: string;          // Lucide icon name
  color: string;         // Primary color
  
  // Fields Configuration
  fields: FieldConfig[];
  
  // CRUD Permissions
  permissions: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    bulk: boolean;
  };
  
  // Relationships
  relationships?: {
    belongsTo?: string[];   // ["categories", "users"]
    hasMany?: string[];     // ["orders", "reviews"]
  };
}

// Theme configuration
export interface ThemeConfig {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  
  // Brand
  logo?: string;
  favicon?: string;
  brandName?: string;
  
  // Typography  
  fontFamily: string;
  fontSize: {
    sm: string;
    base: string;
    lg: string;
    xl: string;
  };
  
  // Spacing & Layout
  borderRadius: string;
  spacing: 'compact' | 'comfortable' | 'spacious';
  
  // Dark mode support
  darkMode: boolean;
}

// Navigation item
export interface NavigationItem {
  key: string;
  label: string;
  icon: string;
  href: string;
  children?: NavigationItem[];
  badge?: string | number;
  permissions?: string[];
}

// Dashboard widget
export interface DashboardWidget {
  id: string;
  title: string;
  type: 'stats' | 'chart' | 'table' | 'custom';
  size: 'sm' | 'md' | 'lg' | 'xl';
  position: { x: number; y: number };
  config: Record<string, any>;
}

// Layout configuration
export interface LayoutConfig {
  sidebar: {
    position: 'left' | 'right';
    collapsible: boolean;
    defaultCollapsed: boolean;
  };
  
  navigation: {
    style: 'tabs' | 'pills' | 'sidebar' | 'topbar';
    items: NavigationItem[];
  };
  
  dashboard: {
    widgets: DashboardWidget[];
    layout: 'grid' | 'masonry' | 'flex';
  };
}

// Component overrides
export interface ComponentOverrides {
  // Custom components for specific templates
  [componentName: string]: {
    component: string;      // Component path
    props?: Record<string, any>;
    replace?: boolean;      // Replace or extend
  };
}

// Workflow configuration
export interface WorkflowConfig {
  id: string;
  name: string;
  trigger: string;
  actions: WorkflowAction[];
}

export interface WorkflowAction {
  type: string;
  config: Record<string, any>;
}

// Validation rules collection
export interface ValidationRules {
  [entityKey: string]: {
    [fieldKey: string]: ValidationRule[];
  };
}

// Automation rule
export interface AutomationRule {
  id: string;
  name: string;
  condition: ConditionalRule[];
  action: WorkflowAction;
  enabled: boolean;
}

// Main template configuration
export interface TemplateConfig {
  id: string;
  name: string;
  industry: IndustryType;
  version: string;
  description: string;
  
  // Entity Configuration
  entities: {
    primary: EntityConfig;      // Services, Products, etc.
    secondary?: EntityConfig;   // Categories, etc.
    additional?: EntityConfig[]; // Custom entities
  };
  
  // UI Configuration
  ui: {
    theme: ThemeConfig;
    components: ComponentOverrides;
    layout: LayoutConfig;
  };
  
  // Business Logic
  business: {
    workflows: WorkflowConfig[];
    validations: ValidationRules;
    automations: AutomationRule[];
  };
  
  // Features
  features: {
    enabled: string[];
    disabled: string[];
    premium?: string[];
  };
}

// Validation result
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Predefined template IDs for known industries
export type WellnessTemplateId = 
  | 'wellness-basic'
  | 'wellness-spa' 
  | 'wellness-clinic'
  | 'wellness-fitness';

export type RestaurantTemplateId = 
  | 'restaurant-basic'
  | 'restaurant-fastfood'
  | 'restaurant-finedining'
  | 'restaurant-cafe';

export type EcommerceTemplateId = 
  | 'ecommerce-basic'
  | 'ecommerce-fashion'
  | 'ecommerce-electronics'
  | 'ecommerce-marketplace';

export type HealthcareTemplateId = 
  | 'healthcare-clinic'
  | 'healthcare-hospital'
  | 'healthcare-dental'
  | 'healthcare-veterinary';

// Combined template ID type
export type KnownTemplateId = 
  | WellnessTemplateId 
  | RestaurantTemplateId 
  | EcommerceTemplateId 
  | HealthcareTemplateId;

// Template marketplace metadata
export interface TemplateMarketplace {
  id: string;
  name: string;
  description: string;
  industry: IndustryType;
  complexity: TemplateComplexity;
  
  // Marketplace info
  price: {
    monthly: number;
    yearly: number;
    setup?: number;
  };
  
  // Features & selling points
  features: string[];
  highlights: string[];
  screenshots: string[];
  demoUrl?: string;
  
  // Stats & social proof
  stats: {
    downloads: number;
    activeUsers: number;
    rating: number;
    reviews: number;
  };
  
  // Technical requirements
  requirements: {
    minUsers: number;
    maxUsers?: number;
    storage: string;
    integrations: string[];
  };
  
  // Support & documentation
  support: {
    documentation: string;
    videoTutorials: string[];
    support: 'community' | 'email' | 'phone' | 'premium';
  };
}

// Customer tenant configuration
export interface TenantConfig {
  id: string;
  subdomain: string;
  templateId: string;
  customDomain?: string;
  
  // Branding overrides
  branding: {
    companyName: string;
    logo?: string;
    favicon?: string;
    primaryColor?: string;
    secondaryColor?: string;
  };
  
  // Feature toggles
  features: {
    enabled: string[];
    disabled: string[];
    limits: Record<string, number>; // e.g., maxServices: 100
  };
  
  // Custom configurations
  customizations: {
    fields: CustomFieldOverride[];
    workflows: CustomWorkflow[];
    integrations: IntegrationConfig[];
  };
  
  // Subscription info
  subscription: {
    plan: string;
    status: 'active' | 'suspended' | 'cancelled';
    validUntil: string;
    limits: SubscriptionLimits;
  };
}

// Custom field overrides for specific tenants
export interface CustomFieldOverride {
  entityKey: string;
  fieldKey: string;
  override: Partial<FieldConfig>;
  action: 'modify' | 'hide' | 'add' | 'require' | 'optional';
}

// Custom workflows for specific tenants
export interface CustomWorkflow {
  id: string;
  name: string;
  entityKey: string;
  trigger: WorkflowTrigger;
  actions: CustomWorkflowAction[];
  enabled: boolean;
}

export interface WorkflowTrigger {
  event: 'create' | 'update' | 'delete' | 'status_change' | 'scheduled';
  conditions?: ConditionalRule[];
}

export interface CustomWorkflowAction {
  type: 'email' | 'webhook' | 'update_field' | 'create_record' | 'api_call';
  config: Record<string, any>;
  delay?: number; // seconds
}

// Integration configurations
export interface IntegrationConfig {
  id: string;
  name: string;
  type: 'webhook' | 'api' | 'email' | 'sms' | 'payment' | 'analytics';
  enabled: boolean;
  config: Record<string, any>;
  
  // Trigger conditions
  triggers: {
    events: string[];
    entities: string[];
    conditions?: ConditionalRule[];
  };
}

// Subscription limits per plan
export interface SubscriptionLimits {
  maxRecords: {
    [entityKey: string]: number;
  };
  maxUsers: number;
  maxStorage: number; // MB
  maxApiCalls: number; // per month
  maxCustomFields: number;
  maxIntegrations: number;
  supportLevel: 'basic' | 'standard' | 'premium';
}

// Generic entity data type based on template configuration
export type EntityData<T extends EntityConfig = EntityConfig> = {
  id?: string;
  createdAt?: string;
  updatedAt?: string;
} & {
  [K in T['fields'][number]['key']]: any;
};

// Type guards for template identification
export function isWellnessTemplate(templateId: string): templateId is WellnessTemplateId {
  return templateId.startsWith('wellness-');
}

export function isRestaurantTemplate(templateId: string): templateId is RestaurantTemplateId {
  return templateId.startsWith('restaurant-');
}

export function isEcommerceTemplate(templateId: string): templateId is EcommerceTemplateId {
  return templateId.startsWith('ecommerce-');
}

export function isHealthcareTemplate(templateId: string): templateId is HealthcareTemplateId {
  return templateId.startsWith('healthcare-');
}

// Default configurations for common field types
export const DEFAULT_FIELD_CONFIGS: Record<string, Partial<FieldConfig>> = {
  name: {
    type: 'text',
    required: true,
    validation: [{ type: 'length', value: { min: 2, max: 100 }, message: 'Name must be 2-100 characters' }]
  },
  
  email: {
    type: 'email',
    required: true,
    validation: [{ type: 'regex', value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Invalid email format' }]
  },
  
  phone: {
    type: 'phone',
    required: false,
    validation: [{ type: 'regex', value: /^\+?[\d\s\-\(\)]+$/, message: 'Invalid phone format' }]
  },
  
  price: {
    type: 'currency',
    required: false,
    min: 0,
    max: 999999.99
  },
  
  description: {
    type: 'textarea',
    required: false,
    max: 1000,
    placeholder: 'Enter description...'
  },
  
  status: {
    type: 'select',
    required: true,
    options: [
      { value: 'active', label: 'Active' },
      { value: 'inactive', label: 'Inactive' },
      { value: 'draft', label: 'Draft' }
    ]
  }
} as const;