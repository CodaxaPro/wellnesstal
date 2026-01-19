/**
 * Template Engine Core - SaaS Multi-Template System
 * Bu dosya tüm template'leri yönetir ve industry-specific logic'i handle eder
 */

export interface TemplateConfig {
  id: string;
  name: string;
  industry: string;
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

export type FieldType = 
  | 'text' | 'textarea' | 'email' | 'url' | 'phone'
  | 'number' | 'currency' | 'percentage'  
  | 'date' | 'datetime' | 'time'
  | 'select' | 'multiselect' | 'radio' | 'checkbox'
  | 'file' | 'image' | 'color'
  | 'toggle' | 'range'
  | 'json' | 'markdown' | 'code';

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

export interface ComponentOverrides {
  // Custom components for specific templates
  [componentName: string]: {
    component: string;      // Component path
    props?: Record<string, any>;
    replace?: boolean;      // Replace or extend
  };
}

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

export interface NavigationItem {
  key: string;
  label: string;
  icon: string;
  href: string;
  children?: NavigationItem[];
  badge?: string | number;
  permissions?: string[];
}

export interface DashboardWidget {
  id: string;
  title: string;
  type: 'stats' | 'chart' | 'table' | 'custom';
  size: 'sm' | 'md' | 'lg' | 'xl';
  position: { x: number; y: number };
  config: Record<string, any>;
}

// Core Template Engine Class
export class TemplateEngine {
  private templates: Map<string, TemplateConfig> = new Map();
  private activeTemplate: string | null = null;

  /**
   * Register a template configuration
   */
  registerTemplate(config: TemplateConfig): void {
    this.templates.set(config.id, config);
  }

  /**
   * Set active template for current session
   */
  setActiveTemplate(templateId: string): void {
    if (!this.templates.has(templateId)) {
      throw new Error(`Template ${templateId} not found`);
    }
    this.activeTemplate = templateId;
  }

  /**
   * Get current active template configuration
   */
  getActiveTemplate(): TemplateConfig | null {
    if (!this.activeTemplate) {
return null;
}
    return this.templates.get(this.activeTemplate) || null;
  }

  /**
   * Get all registered templates
   */
  getTemplates(): TemplateConfig[] {
    return Array.from(this.templates.values());
  }

  /**
   * Get template by industry
   */
  getTemplatesByIndustry(industry: string): TemplateConfig[] {
    return this.getTemplates().filter(t => t.industry === industry);
  }

  /**
   * Generate entity API endpoints based on template config
   */
  getEntityEndpoints(entityKey: string): {
    list: string;
    create: string;
    update: string;
    delete: string;
    bulk: string;
  } {
    const template = this.getActiveTemplate();
    if (!template) {
throw new Error('No active template');
}

    const entity = this.getEntityConfig(entityKey);
    if (!entity) {
throw new Error(`Entity ${entityKey} not found`);
}

    const basePath = `/api/${entityKey}`;
    
    return {
      list: `${basePath}`,
      create: `${basePath}`,
      update: `${basePath}/[id]`,
      delete: `${basePath}/[id]`,
      bulk: `${basePath}/bulk`
    };
  }

  /**
   * Get entity configuration by key
   */
  getEntityConfig(entityKey: string): EntityConfig | null {
    const template = this.getActiveTemplate();
    if (!template) {
return null;
}

    // Check primary entity
    if (template.entities.primary && entityKey === 'primary') {
      return template.entities.primary;
    }

    // Check secondary entity  
    if (template.entities.secondary && entityKey === 'secondary') {
      return template.entities.secondary;
    }

    // Check additional entities
    if (template.entities.additional) {
      return template.entities.additional.find(e => e.name.toLowerCase() === entityKey) || null;
    }

    return null;
  }

  /**
   * Validate data against template field configurations
   */
  validateEntityData(entityKey: string, data: Record<string, any>): ValidationResult {
    const entity = this.getEntityConfig(entityKey);
    if (!entity) {
return { valid: false, errors: ['Entity not found'] };
}

    const errors: string[] = [];

    for (const field of entity.fields) {
      const value = data[field.key];

      // Required field validation
      if (field.required && (!value || value === '')) {
        errors.push(`${field.label} is required`);
        continue;
      }

      // Skip validation if field is empty and not required
      if (!value && !field.required) {
continue;
}

      // Type-specific validation
      errors.push(...this.validateFieldValue(field, value));
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate individual field value
   */
  private validateFieldValue(field: FieldConfig, value: any): string[] {
    const errors: string[] = [];

    switch (field.type) {
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${field.label} must be a valid email`);
        }
        break;

      case 'url':
        try {
          new URL(value);
        } catch {
          errors.push(`${field.label} must be a valid URL`);
        }
        break;

      case 'number':
      case 'currency':
        if (isNaN(Number(value))) {
          errors.push(`${field.label} must be a number`);
        } else {
          if (field.min !== undefined && Number(value) < field.min) {
            errors.push(`${field.label} must be at least ${field.min}`);
          }
          if (field.max !== undefined && Number(value) > field.max) {
            errors.push(`${field.label} must be at most ${field.max}`);
          }
        }
        break;

      case 'text':
      case 'textarea':
        if (field.min && value.length < field.min) {
          errors.push(`${field.label} must be at least ${field.min} characters`);
        }
        if (field.max && value.length > field.max) {
          errors.push(`${field.label} must be at most ${field.max} characters`);
        }
        break;
    }

    // Custom validation rules
    if (field.validation) {
      for (const rule of field.validation) {
        if (!this.runValidationRule(rule, value)) {
          errors.push(rule.message || `${field.label} is invalid`);
        }
      }
    }

    return errors;
  }

  /**
   * Run custom validation rule
   */
  private runValidationRule(rule: ValidationRule, value: any): boolean {
    // Implementation will depend on rule type
    // This is a placeholder for now
    return true;
  }
}

// Supporting types and interfaces
export interface ValidationRule {
  type: 'regex' | 'custom' | 'range' | 'length';
  value?: any;
  message?: string;
}

export interface ConditionalRule {
  field: string;
  operator: '==' | '!=' | '>' | '<' | 'includes' | 'excludes';
  value: any;
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  group?: string;
}

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

export interface ValidationRules {
  [entityKey: string]: {
    [fieldKey: string]: ValidationRule[];
  };
}

export interface AutomationRule {
  id: string;
  name: string;
  condition: ConditionalRule[];
  action: WorkflowAction;
  enabled: boolean;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

// Global template engine instance
export const templateEngine = new TemplateEngine();

// Export default instance
export default templateEngine;