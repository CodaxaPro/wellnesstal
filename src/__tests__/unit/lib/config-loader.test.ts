/**
 * WellnessTall - ConfigLoader Tests
 * Enterprise-grade unit tests for Template Configuration Loader
 *
 * ⚠️ STRICT RULES:
 * - Once this test passes, it becomes IMMUTABLE
 * - ConfigLoader must conform to these tests, not vice versa
 * - DO NOT modify assertions after tests pass
 *
 * @module tests/lib/config-loader
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { ConfigLoader } from '@/lib/config-loader'
import type { TemplateConfig } from '@/types/templates'

// Valid template config for testing
const createValidConfig = (overrides = {}): TemplateConfig => ({
  id: 'test-template',
  name: 'Test Template',
  industry: 'wellness',
  version: '1.0.0',
  description: 'Test template description',
  complexity: 'professional',
  entities: {
    primary: {
      name: 'Service',
      singular: 'Service',
      plural: 'Services',
      icon: 'spa',
      color: '#4F46E5',
      fields: [
        {
          key: 'name',
          label: 'Name',
          type: 'text',
          required: true,
          order: 0
        },
        {
          key: 'price',
          label: 'Price',
          type: 'number',
          required: true,
          order: 1
        }
      ],
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
      primaryColor: '#4F46E5',
      secondaryColor: '#10B981',
      accentColor: '#F59E0B',
      fontFamily: 'Inter',
      borderRadius: 'rounded-lg'
    },
    layout: {
      sidebarPosition: 'left',
      contentWidth: 'max-w-6xl'
    }
  },
  features: {
    enabled: ['crud', 'search']
  },
  ...overrides
} as TemplateConfig)

describe('ConfigLoader', () => {
  let loader: ConfigLoader

  beforeEach(() => {
    loader = new ConfigLoader('/templates')
    loader.clearCache()
  })

  // ============================================
  // VALIDATION - CONFIG
  // ============================================
  describe('validateConfig', () => {
    it('should validate a valid config', () => {
      const config = createValidConfig()
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(true)
      expect(result.errors).toEqual([])
    })

    it('should fail validation without id', () => {
      const config = createValidConfig({ id: undefined })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Template ID is required')
    })

    it('should fail validation without name', () => {
      const config = createValidConfig({ name: undefined })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Template name is required')
    })

    it('should fail validation without industry', () => {
      const config = createValidConfig({ industry: undefined })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Template industry is required')
    })

    it('should fail validation without version', () => {
      const config = createValidConfig({ version: undefined })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Template version is required')
    })

    it('should fail validation without primary entity', () => {
      const config = createValidConfig({
        entities: { primary: undefined }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Primary entity is required')
    })

    it('should fail validation without theme', () => {
      const config = createValidConfig({
        ui: { theme: undefined, layout: {} }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Theme configuration is required')
    })

    it('should fail validation without layout', () => {
      const config = createValidConfig({
        ui: { theme: { primaryColor: '#000', secondaryColor: '#fff', fontFamily: 'Inter' }, layout: undefined }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Layout configuration is required')
    })

    it('should validate secondary entity if present', () => {
      const config = createValidConfig({
        entities: {
          primary: createValidConfig().entities.primary,
          secondary: {
            name: 'Category',
            singular: 'Category',
            plural: 'Categories',
            icon: 'folder',
            color: '#10B981',
            fields: [
              { key: 'name', label: 'Name', type: 'text', required: true, order: 0 }
            ],
            permissions: {
              create: true,
              read: true,
              update: true,
              delete: true,
              bulk: true
            }
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(true)
    })

    it('should validate additional entities if present', () => {
      const config = createValidConfig({
        entities: {
          primary: createValidConfig().entities.primary,
          additional: [
            {
              name: 'Tag',
              singular: 'Tag',
              plural: 'Tags',
              icon: 'tag',
              color: '#F59E0B',
              fields: [
                { key: 'name', label: 'Name', type: 'text', required: true, order: 0 }
              ],
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true,
                bulk: true
              }
            }
          ]
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(true)
    })
  })

  // ============================================
  // VALIDATION - ENTITY
  // ============================================
  describe('Entity Validation', () => {
    it('should fail without entity name', () => {
      const config = createValidConfig({
        entities: {
          primary: {
            ...createValidConfig().entities.primary,
            name: undefined
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Entity name is required'))).toBe(true)
    })

    it('should fail without entity singular', () => {
      const config = createValidConfig({
        entities: {
          primary: {
            ...createValidConfig().entities.primary,
            singular: undefined
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Entity singular name is required'))).toBe(true)
    })

    it('should fail without entity plural', () => {
      const config = createValidConfig({
        entities: {
          primary: {
            ...createValidConfig().entities.primary,
            plural: undefined
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Entity plural name is required'))).toBe(true)
    })

    it('should fail without entity icon', () => {
      const config = createValidConfig({
        entities: {
          primary: {
            ...createValidConfig().entities.primary,
            icon: undefined
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Entity icon is required'))).toBe(true)
    })

    it('should fail without entity color', () => {
      const config = createValidConfig({
        entities: {
          primary: {
            ...createValidConfig().entities.primary,
            color: undefined
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Entity color is required'))).toBe(true)
    })

    it('should fail if fields is not array', () => {
      const config = createValidConfig({
        entities: {
          primary: {
            ...createValidConfig().entities.primary,
            fields: 'not-array' as any
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Entity fields must be an array'))).toBe(true)
    })

    it('should fail if field missing key', () => {
      const config = createValidConfig({
        entities: {
          primary: {
            ...createValidConfig().entities.primary,
            fields: [
              { label: 'Name', type: 'text', required: true, order: 0 }
            ]
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Field key is required'))).toBe(true)
    })

    it('should fail if field missing label', () => {
      const config = createValidConfig({
        entities: {
          primary: {
            ...createValidConfig().entities.primary,
            fields: [
              { key: 'name', type: 'text', required: true, order: 0 }
            ]
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Field label is required'))).toBe(true)
    })

    it('should fail if field missing type', () => {
      const config = createValidConfig({
        entities: {
          primary: {
            ...createValidConfig().entities.primary,
            fields: [
              { key: 'name', label: 'Name', required: true, order: 0 }
            ]
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Field type is required'))).toBe(true)
    })

    it('should fail if field required is not boolean', () => {
      const config = createValidConfig({
        entities: {
          primary: {
            ...createValidConfig().entities.primary,
            fields: [
              { key: 'name', label: 'Name', type: 'text', required: 'yes' as any, order: 0 }
            ]
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Field required must be boolean'))).toBe(true)
    })

    it('should fail if field order is not number', () => {
      const config = createValidConfig({
        entities: {
          primary: {
            ...createValidConfig().entities.primary,
            fields: [
              { key: 'name', label: 'Name', type: 'text', required: true, order: '0' as any }
            ]
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Field order must be number'))).toBe(true)
    })

    it('should fail without permissions', () => {
      const config = createValidConfig({
        entities: {
          primary: {
            ...createValidConfig().entities.primary,
            permissions: undefined
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Entity permissions are required'))).toBe(true)
    })

    it('should fail if permission is not boolean', () => {
      const config = createValidConfig({
        entities: {
          primary: {
            ...createValidConfig().entities.primary,
            permissions: {
              create: 'yes' as any,
              read: true,
              update: true,
              delete: true,
              bulk: true
            }
          }
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('Permission create must be boolean'))).toBe(true)
    })
  })

  // ============================================
  // VALIDATION - THEME
  // ============================================
  describe('Theme Validation', () => {
    it('should fail without primaryColor', () => {
      const config = createValidConfig({
        ui: {
          theme: {
            secondaryColor: '#10B981',
            fontFamily: 'Inter'
          },
          layout: {}
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Primary color is required')
    })

    it('should fail without secondaryColor', () => {
      const config = createValidConfig({
        ui: {
          theme: {
            primaryColor: '#4F46E5',
            fontFamily: 'Inter'
          },
          layout: {}
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Secondary color is required')
    })

    it('should fail without fontFamily', () => {
      const config = createValidConfig({
        ui: {
          theme: {
            primaryColor: '#4F46E5',
            secondaryColor: '#10B981'
          },
          layout: {}
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors).toContain('Font family is required')
    })

    it('should validate hex colors', () => {
      const config = createValidConfig({
        ui: {
          theme: {
            primaryColor: '#4F46E5',
            secondaryColor: '#10B981',
            accentColor: '#F59E0B',
            fontFamily: 'Inter'
          },
          layout: {}
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(true)
    })

    it('should validate rgb colors', () => {
      const config = createValidConfig({
        ui: {
          theme: {
            primaryColor: 'rgb(79, 70, 229)',
            secondaryColor: 'rgb(16, 185, 129)',
            fontFamily: 'Inter'
          },
          layout: {}
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(true)
    })

    it('should validate named colors', () => {
      const config = createValidConfig({
        ui: {
          theme: {
            primaryColor: 'blue',
            secondaryColor: 'green',
            fontFamily: 'Inter'
          },
          layout: {}
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(true)
    })

    it('should fail with invalid color format', () => {
      const config = createValidConfig({
        ui: {
          theme: {
            primaryColor: 'not-a-color-123!@#',
            secondaryColor: '#10B981',
            fontFamily: 'Inter'
          },
          layout: {}
        }
      })
      const result = loader.validateConfig(config)

      expect(result.valid).toBe(false)
      expect(result.errors.some(e => e.includes('not a valid CSS color'))).toBe(true)
    })
  })

  // ============================================
  // MERGE WITH CUSTOMIZATIONS
  // ============================================
  describe('mergeWithCustomizations', () => {
    it('should merge branding customizations', () => {
      const baseConfig = createValidConfig()
      const customizations = {
        branding: {
          primaryColor: '#FF0000',
          secondaryColor: '#00FF00',
          companyName: 'WellnessTal',
          logo: '/logo.png'
        }
      }

      const merged = loader.mergeWithCustomizations(baseConfig, customizations)

      expect(merged.ui.theme.primaryColor).toBe('#FF0000')
      expect(merged.ui.theme.secondaryColor).toBe('#00FF00')
      expect(merged.ui.theme.brandName).toBe('WellnessTal')
      expect(merged.ui.theme.logo).toBe('/logo.png')
    })

    it('should not modify original config', () => {
      const baseConfig = createValidConfig()
      const originalColor = baseConfig.ui.theme.primaryColor

      loader.mergeWithCustomizations(baseConfig, {
        branding: { primaryColor: '#FF0000' }
      })

      expect(baseConfig.ui.theme.primaryColor).toBe(originalColor)
    })

    it('should handle partial branding', () => {
      const baseConfig = createValidConfig()
      const originalSecondary = baseConfig.ui.theme.secondaryColor

      const merged = loader.mergeWithCustomizations(baseConfig, {
        branding: { primaryColor: '#FF0000' }
      })

      expect(merged.ui.theme.primaryColor).toBe('#FF0000')
      expect(merged.ui.theme.secondaryColor).toBe(originalSecondary)
    })

    it('should handle empty customizations', () => {
      const baseConfig = createValidConfig()
      const merged = loader.mergeWithCustomizations(baseConfig, {})

      expect(merged).toEqual(baseConfig)
    })
  })

  // ============================================
  // CACHE MANAGEMENT
  // ============================================
  describe('Cache Management', () => {
    it('should clear specific cache', () => {
      // This is testing the clearCache method exists and works
      expect(() => loader.clearCache('test-template')).not.toThrow()
    })

    it('should clear all cache', () => {
      expect(() => loader.clearCache()).not.toThrow()
    })
  })

  // ============================================
  // DEFAULT TEMPLATE LIST
  // ============================================
  describe('getAvailableTemplates', () => {
    it('should return default templates on error', async () => {
      // When fetch fails, should return default list
      const templates = await loader.getAvailableTemplates()

      expect(Array.isArray(templates)).toBe(true)
      expect(templates.length).toBeGreaterThan(0)
    })

    it('should include wellness templates', async () => {
      const templates = await loader.getAvailableTemplates()
      const wellnessTemplates = templates.filter(t => t.industry === 'wellness')

      expect(wellnessTemplates.length).toBeGreaterThan(0)
    })

    it('should include restaurant templates', async () => {
      const templates = await loader.getAvailableTemplates()
      const restaurantTemplates = templates.filter(t => t.industry === 'restaurant')

      expect(restaurantTemplates.length).toBeGreaterThan(0)
    })

    it('should include ecommerce templates', async () => {
      const templates = await loader.getAvailableTemplates()
      const ecommerceTemplates = templates.filter(t => t.industry === 'ecommerce')

      expect(ecommerceTemplates.length).toBeGreaterThan(0)
    })

    it('should include healthcare templates', async () => {
      const templates = await loader.getAvailableTemplates()
      const healthcareTemplates = templates.filter(t => t.industry === 'healthcare')

      expect(healthcareTemplates.length).toBeGreaterThan(0)
    })

    it('should have proper template structure', async () => {
      const templates = await loader.getAvailableTemplates()
      const template = templates[0]

      expect(template).toHaveProperty('id')
      expect(template).toHaveProperty('industry')
      expect(template).toHaveProperty('complexity')
    })

    it('should have valid complexity values', async () => {
      const templates = await loader.getAvailableTemplates()
      const validComplexities = ['basic', 'professional', 'enterprise', 'custom']

      templates.forEach(template => {
        expect(validComplexities).toContain(template.complexity)
      })
    })
  })
})
