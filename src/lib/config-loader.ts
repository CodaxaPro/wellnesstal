/**
 * Template Configuration Loader
 * Loads, validates, and manages template configurations from JSON files
 */

import { TemplateConfig, IndustryType, TemplateComplexity, ValidationResult } from '../types/templates';

// Configuration cache for performance
const configCache = new Map<string, TemplateConfig>();
const cacheTimeout = 1000 * 60 * 5; // 5 minutes cache
const cacheTimestamps = new Map<string, number>();

/**
 * Template Config Loader Class
 */
export class ConfigLoader {
  private basePath: string;

  constructor(basePath: string = '/templates') {
    this.basePath = basePath;
  }

  /**
   * Load template configuration from JSON file
   */
  async loadTemplate(templateId: string): Promise<TemplateConfig> {
    // Check cache first
    const cached = this.getFromCache(templateId);
    if (cached) {
      return cached;
    }

    try {
      const configPath = `${this.basePath}/${templateId}/config.json`;
      const response = await fetch(configPath);
      
      if (!response.ok) {
        throw new Error(`Failed to load template ${templateId}: ${response.statusText}`);
      }

      const config: TemplateConfig = await response.json();
      
      // Validate configuration
      const validation = this.validateConfig(config);
      if (!validation.valid) {
        throw new Error(`Invalid template config for ${templateId}: ${validation.errors.join(', ')}`);
      }

      // Cache the config
      this.setCache(templateId, config);
      
      return config;
    } catch (error) {
      console.error(`Error loading template ${templateId}:`, error);
      throw error;
    }
  }

  /**
   * Load multiple templates
   */
  async loadTemplates(templateIds: string[]): Promise<Record<string, TemplateConfig>> {
    const results: Record<string, TemplateConfig> = {};
    
    await Promise.allSettled(
      templateIds.map(async (id) => {
        try {
          results[id] = await this.loadTemplate(id);
        } catch (error) {
          console.error(`Failed to load template ${id}:`, error);
        }
      })
    );

    return results;
  }

  /**
   * Load all templates for a specific industry
   */
  async loadIndustryTemplates(industry: IndustryType): Promise<TemplateConfig[]> {
    const availableTemplates = await this.getAvailableTemplates();
    const industryTemplates = availableTemplates.filter(t => t.industry === industry);
    
    const configs: TemplateConfig[] = [];
    
    for (const template of industryTemplates) {
      try {
        const config = await this.loadTemplate(template.id);
        configs.push(config);
      } catch (error) {
        console.error(`Failed to load industry template ${template.id}:`, error);
      }
    }

    return configs;
  }

  /**
   * Get list of available templates
   */
  async getAvailableTemplates(): Promise<Array<{id: string, industry: IndustryType, complexity: TemplateComplexity}>> {
    try {
      const response = await fetch(`${this.basePath}/index.json`);
      if (!response.ok) {
        // Fallback to predefined list if index.json doesn't exist
        return this.getDefaultTemplateList();
      }
      return await response.json();
    } catch (error) {
      console.error('Error loading template index:', error);
      return this.getDefaultTemplateList();
    }
  }

  /**
   * Validate template configuration
   */
  validateConfig(config: TemplateConfig): ValidationResult {
    const errors: string[] = [];

    // Required fields
    if (!config.id) {
errors.push('Template ID is required');
}
    if (!config.name) {
errors.push('Template name is required');
}
    if (!config.industry) {
errors.push('Template industry is required');
}
    if (!config.version) {
errors.push('Template version is required');
}

    // Entity validation
    if (!config.entities.primary) {
      errors.push('Primary entity is required');
    } else {
      const primaryValidation = this.validateEntityConfig(config.entities.primary, 'primary');
      errors.push(...primaryValidation.errors);
    }

    // Validate secondary entity if exists
    if (config.entities.secondary) {
      const secondaryValidation = this.validateEntityConfig(config.entities.secondary, 'secondary');
      errors.push(...secondaryValidation.errors);
    }

    // Validate additional entities
    if (config.entities.additional) {
      config.entities.additional.forEach((entity, index) => {
        const entityValidation = this.validateEntityConfig(entity, `additional[${index}]`);
        errors.push(...entityValidation.errors);
      });
    }

    // UI configuration validation
    if (!config.ui?.theme) {
      errors.push('Theme configuration is required');
    } else {
      const themeValidation = this.validateThemeConfig(config.ui.theme);
      errors.push(...themeValidation.errors);
    }

    // Layout validation
    if (!config.ui?.layout) {
      errors.push('Layout configuration is required');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate entity configuration
   */
  private validateEntityConfig(entity: any, context: string): ValidationResult {
    const errors: string[] = [];

    if (!entity.name) {
errors.push(`${context}: Entity name is required`);
}
    if (!entity.singular) {
errors.push(`${context}: Entity singular name is required`);
}
    if (!entity.plural) {
errors.push(`${context}: Entity plural name is required`);
}
    if (!entity.icon) {
errors.push(`${context}: Entity icon is required`);
}
    if (!entity.color) {
errors.push(`${context}: Entity color is required`);
}

    // Fields validation
    if (!Array.isArray(entity.fields)) {
      errors.push(`${context}: Entity fields must be an array`);
    } else {
      entity.fields.forEach((field: any, index: number) => {
        if (!field.key) {
errors.push(`${context}.fields[${index}]: Field key is required`);
}
        if (!field.label) {
errors.push(`${context}.fields[${index}]: Field label is required`);
}
        if (!field.type) {
errors.push(`${context}.fields[${index}]: Field type is required`);
}
        if (typeof field.required !== 'boolean') {
          errors.push(`${context}.fields[${index}]: Field required must be boolean`);
        }
        if (typeof field.order !== 'number') {
          errors.push(`${context}.fields[${index}]: Field order must be number`);
        }
      });
    }

    // Permissions validation
    if (!entity.permissions) {
      errors.push(`${context}: Entity permissions are required`);
    } else {
      const requiredPermissions = ['create', 'read', 'update', 'delete', 'bulk'];
      requiredPermissions.forEach(perm => {
        if (typeof entity.permissions[perm] !== 'boolean') {
          errors.push(`${context}: Permission ${perm} must be boolean`);
        }
      });
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Validate theme configuration
   */
  private validateThemeConfig(theme: any): ValidationResult {
    const errors: string[] = [];

    if (!theme.primaryColor) {
errors.push('Primary color is required');
}
    if (!theme.secondaryColor) {
errors.push('Secondary color is required');
}
    if (!theme.fontFamily) {
errors.push('Font family is required');
}
    
    // Validate colors are valid CSS colors
    const colorFields = ['primaryColor', 'secondaryColor', 'accentColor'];
    colorFields.forEach(field => {
      if (theme[field] && !this.isValidColor(theme[field])) {
        errors.push(`${field} is not a valid CSS color`);
      }
    });

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Check if string is valid CSS color
   */
  private isValidColor(color: string): boolean {
    // Simple color validation - hex, rgb, hsl, named colors
    const colorRegex = /^(#[0-9A-Fa-f]{3,8}|rgb\(.*\)|rgba\(.*\)|hsl\(.*\)|hsla\(.*\)|[a-zA-Z]+)$/;
    return colorRegex.test(color);
  }

  /**
   * Cache management
   */
  private getFromCache(templateId: string): TemplateConfig | null {
    const cached = configCache.get(templateId);
    const timestamp = cacheTimestamps.get(templateId);
    
    if (cached && timestamp && (Date.now() - timestamp < cacheTimeout)) {
      return cached;
    }
    
    // Clear expired cache
    if (cached) {
      configCache.delete(templateId);
      cacheTimestamps.delete(templateId);
    }
    
    return null;
  }

  private setCache(templateId: string, config: TemplateConfig): void {
    configCache.set(templateId, config);
    cacheTimestamps.set(templateId, Date.now());
  }

  /**
   * Clear cache for specific template or all
   */
  clearCache(templateId?: string): void {
    if (templateId) {
      configCache.delete(templateId);
      cacheTimestamps.delete(templateId);
    } else {
      configCache.clear();
      cacheTimestamps.clear();
    }
  }

  /**
   * Get default template list when index.json is not available
   */
  private getDefaultTemplateList(): Array<{id: string, industry: IndustryType, complexity: TemplateComplexity}> {
    return [
      // Wellness templates
      { id: 'wellness-basic', industry: 'wellness', complexity: 'basic' },
      { id: 'wellness-spa', industry: 'wellness', complexity: 'professional' },
      { id: 'wellness-clinic', industry: 'wellness', complexity: 'professional' },
      { id: 'wellness-fitness', industry: 'wellness', complexity: 'professional' },

      // Restaurant templates
      { id: 'restaurant-basic', industry: 'restaurant', complexity: 'basic' },
      { id: 'restaurant-fastfood', industry: 'restaurant', complexity: 'professional' },
      { id: 'restaurant-finedining', industry: 'restaurant', complexity: 'enterprise' },
      { id: 'restaurant-cafe', industry: 'restaurant', complexity: 'professional' },

      // E-commerce templates
      { id: 'ecommerce-basic', industry: 'ecommerce', complexity: 'basic' },
      { id: 'ecommerce-fashion', industry: 'ecommerce', complexity: 'professional' },
      { id: 'ecommerce-electronics', industry: 'ecommerce', complexity: 'professional' },
      { id: 'ecommerce-marketplace', industry: 'ecommerce', complexity: 'enterprise' },

      // Healthcare templates
      { id: 'healthcare-clinic', industry: 'healthcare', complexity: 'professional' },
      { id: 'healthcare-hospital', industry: 'healthcare', complexity: 'enterprise' },
      { id: 'healthcare-dental', industry: 'healthcare', complexity: 'professional' },
      { id: 'healthcare-veterinary', industry: 'healthcare', complexity: 'professional' },

      // Education templates
      { id: 'education-basic', industry: 'education', complexity: 'basic' },
      { id: 'education-university', industry: 'education', complexity: 'enterprise' },
      { id: 'education-training', industry: 'education', complexity: 'professional' },

      // Other industries
      { id: 'fitness-gym', industry: 'fitness', complexity: 'professional' },
      { id: 'beauty-salon', industry: 'beauty', complexity: 'professional' },
      { id: 'consulting-basic', industry: 'consulting', complexity: 'basic' },
      { id: 'realestate-agency', industry: 'real-estate', complexity: 'professional' },
    ];
  }

  /**
   * Merge template config with tenant customizations
   */
  mergeWithCustomizations(
    baseConfig: TemplateConfig, 
    customizations: any
  ): TemplateConfig {
    const merged = JSON.parse(JSON.stringify(baseConfig)); // Deep clone

    if (customizations.branding) {
      // Apply branding customizations
      if (customizations.branding.primaryColor) {
        merged.ui.theme.primaryColor = customizations.branding.primaryColor;
      }
      if (customizations.branding.secondaryColor) {
        merged.ui.theme.secondaryColor = customizations.branding.secondaryColor;
      }
      if (customizations.branding.companyName) {
        merged.ui.theme.brandName = customizations.branding.companyName;
      }
      if (customizations.branding.logo) {
        merged.ui.theme.logo = customizations.branding.logo;
      }
    }

    if (customizations.fields && Array.isArray(customizations.fields)) {
      // Apply field customizations
      customizations.fields.forEach((override: any) => {
        this.applyFieldOverride(merged, override);
      });
    }

    return merged;
  }

  /**
   * Apply field override to template config
   */
  private applyFieldOverride(config: TemplateConfig, override: any): void {
    let entity;
    
    // Find the entity
    if (override.entityKey === 'primary') {
      entity = config.entities.primary;
    } else if (override.entityKey === 'secondary') {
      entity = config.entities.secondary;
    } else if (config.entities.additional) {
      entity = config.entities.additional.find(e => e.name.toLowerCase() === override.entityKey);
    }

    if (!entity) {
return;
}

    // Find the field
    const fieldIndex = entity.fields.findIndex(f => f.key === override.fieldKey);

    switch (override.action) {
      case 'modify':
        if (fieldIndex >= 0) {
          entity.fields[fieldIndex] = { ...entity.fields[fieldIndex], ...override.override };
        }
        break;
      
      case 'hide':
        if (fieldIndex >= 0) {
          entity.fields.splice(fieldIndex, 1);
        }
        break;
      
      case 'add':
        entity.fields.push(override.override);
        break;
      
      case 'require':
        if (fieldIndex >= 0) {
          entity.fields[fieldIndex].required = true;
        }
        break;
      
      case 'optional':
        if (fieldIndex >= 0) {
          entity.fields[fieldIndex].required = false;
        }
        break;
    }
  }

  /**
   * Generate template config from schema (for template builder)
   */
  generateConfigFromSchema(schema: any): TemplateConfig {
    // This would be used by a template builder UI
    // Convert form builder schema to TemplateConfig
    
    const config: TemplateConfig = {
      id: schema.id || 'custom-template',
      name: schema.name || 'Custom Template',
      industry: schema.industry || 'custom',
      version: '1.0.0',
      description: schema.description || 'Custom generated template',
      
      entities: {
        primary: {
          name: schema.primaryEntity?.name || 'Items',
          singular: schema.primaryEntity?.singular || 'Item',
          plural: schema.primaryEntity?.plural || 'Items',
          icon: schema.primaryEntity?.icon || 'Package',
          color: schema.primaryEntity?.color || '#3B82F6',
          fields: schema.primaryEntity?.fields || [],
          permissions: {
            create: true,
            read: true,
            update: true,
            delete: true,
            bulk: true
          }
        }
      },
      
      ui: {
        theme: {
          primaryColor: schema.theme?.primaryColor || '#3B82F6',
          secondaryColor: schema.theme?.secondaryColor || '#6B7280',
          accentColor: schema.theme?.accentColor || '#10B981',
          fontFamily: schema.theme?.fontFamily || 'Inter, sans-serif',
          fontSize: {
            sm: '0.875rem',
            base: '1rem',
            lg: '1.125rem',
            xl: '1.25rem'
          },
          borderRadius: '0.5rem',
          spacing: 'comfortable',
          darkMode: false
        },
        components: {},
        layout: {
          sidebar: {
            position: 'left',
            collapsible: true,
            defaultCollapsed: false
          },
          navigation: {
            style: 'sidebar',
            items: []
          },
          dashboard: {
            widgets: [],
            layout: 'grid'
          }
        }
      },
      
      business: {
        workflows: [],
        validations: {},
        automations: []
      },
      
      features: {
        enabled: ['crud', 'search', 'filters'],
        disabled: []
      }
    };

    return config;
  }
}

// Default config loader instance
export const configLoader = new ConfigLoader();

// Export default instance
export default configLoader;