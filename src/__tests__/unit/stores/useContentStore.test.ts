/**
 * WellnessTall - useContentStore Tests
 * Enterprise-grade unit tests for Content Store
 *
 * ⚠️ STRICT RULES:
 * - Once this test passes, it becomes IMMUTABLE
 * - Store must conform to these tests, not vice versa
 * - DO NOT modify assertions after tests pass
 *
 * @module tests/stores/useContentStore
 */

import { describe, it, expect, beforeEach } from 'vitest'

import { useContentStore, getSectionById, getSectionsByType } from '@/app/editor/[siteId]/store/useContentStore'

describe('useContentStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useContentStore.getState().resetContent()
    useContentStore.getState().setEditMode(false)
    useContentStore.getState().setActiveField(null)
  })

  // ============================================
  // INITIAL STATE
  // ============================================
  describe('Initial State', () => {
    it('should have default businessName', () => {
      const state = useContentStore.getState()
      expect(state.content.businessName).toBe('Your Business')
    })

    it('should have empty sections array', () => {
      const state = useContentStore.getState()
      expect(state.content.sections).toEqual([])
    })

    it('should have edit mode disabled', () => {
      const state = useContentStore.getState()
      expect(state.isEditMode).toBe(false)
    })

    it('should have null activeField', () => {
      const state = useContentStore.getState()
      expect(state.activeField).toBeNull()
    })
  })

  // ============================================
  // EDIT MODE
  // ============================================
  describe('setEditMode', () => {
    it('should enable edit mode', () => {
      useContentStore.getState().setEditMode(true)
      expect(useContentStore.getState().isEditMode).toBe(true)
    })

    it('should disable edit mode', () => {
      useContentStore.getState().setEditMode(true)
      useContentStore.getState().setEditMode(false)
      expect(useContentStore.getState().isEditMode).toBe(false)
    })
  })

  // ============================================
  // ACTIVE FIELD
  // ============================================
  describe('setActiveField', () => {
    it('should set active field', () => {
      useContentStore.getState().setActiveField('hero.title')
      expect(useContentStore.getState().activeField).toBe('hero.title')
    })

    it('should clear active field', () => {
      useContentStore.getState().setActiveField('hero.title')
      useContentStore.getState().setActiveField(null)
      expect(useContentStore.getState().activeField).toBeNull()
    })
  })

  // ============================================
  // ADD SECTION
  // ============================================
  describe('addSection', () => {
    it('should add a hero section', () => {
      useContentStore.getState().addSection('hero', 'split')
      const sections = useContentStore.getState().content.sections

      expect(sections.length).toBe(1)
      expect(sections[0]?.type).toBe('hero')
      expect(sections[0]?.variant).toBe('split')
      expect(sections[0]?.visible).toBe(true)
    })

    it('should generate unique id for section', () => {
      useContentStore.getState().addSection('hero', 'split')
      const section = useContentStore.getState().content.sections[0]

      expect(section?.id).toBeTruthy()
      expect(section?.id).toMatch(/^hero-/)
    })

    it('should add section with default content', () => {
      useContentStore.getState().addSection('hero', 'centered')
      const section = useContentStore.getState().content.sections[0]

      expect(section?.content).toHaveProperty('title')
      expect(section?.content).toHaveProperty('subtitle')
      expect(section?.content).toHaveProperty('ctaText')
    })

    it('should add section at end by default', () => {
      useContentStore.getState().addSection('header', 'classic')
      useContentStore.getState().addSection('hero', 'split')
      useContentStore.getState().addSection('footer', 'three-column')

      const sections = useContentStore.getState().content.sections
      expect(sections[0]?.type).toBe('header')
      expect(sections[1]?.type).toBe('hero')
      expect(sections[2]?.type).toBe('footer')
    })

    it('should add section after specified id', () => {
      useContentStore.getState().addSection('header', 'classic')
      const headerId = useContentStore.getState().content.sections[0]?.id

      useContentStore.getState().addSection('footer', 'three-column')
      useContentStore.getState().addSection('hero', 'split', headerId)

      const sections = useContentStore.getState().content.sections
      expect(sections[0]?.type).toBe('header')
      expect(sections[1]?.type).toBe('hero')
      expect(sections[2]?.type).toBe('footer')
    })

    it('should update order after adding section', () => {
      useContentStore.getState().addSection('header', 'classic')
      useContentStore.getState().addSection('hero', 'split')
      useContentStore.getState().addSection('footer', 'four-column')

      const sections = useContentStore.getState().content.sections
      expect(sections[0]?.order).toBe(0)
      expect(sections[1]?.order).toBe(1)
      expect(sections[2]?.order).toBe(2)
    })
  })

  // ============================================
  // REMOVE SECTION
  // ============================================
  describe('removeSection', () => {
    it('should remove section by id', () => {
      useContentStore.getState().addSection('header', 'classic')
      useContentStore.getState().addSection('hero', 'split')

      const heroId = useContentStore.getState().content.sections[1]?.id
      if (heroId) {
        useContentStore.getState().removeSection(heroId)
      }

      const sections = useContentStore.getState().content.sections
      expect(sections.length).toBe(1)
      expect(sections[0]?.type).toBe('header')
    })

    it('should update order after removal', () => {
      useContentStore.getState().addSection('header', 'classic')
      useContentStore.getState().addSection('hero', 'split')
      useContentStore.getState().addSection('footer', 'four-column')

      const heroId = useContentStore.getState().content.sections[1]?.id
      if (heroId) {
        useContentStore.getState().removeSection(heroId)
      }

      const sections = useContentStore.getState().content.sections
      expect(sections[0]?.order).toBe(0)
      expect(sections[1]?.order).toBe(1)
    })

    it('should handle removing non-existent section', () => {
      useContentStore.getState().addSection('header', 'classic')
      useContentStore.getState().removeSection('non-existent')

      expect(useContentStore.getState().content.sections.length).toBe(1)
    })
  })

  // ============================================
  // DUPLICATE SECTION
  // ============================================
  describe('duplicateSection', () => {
    it('should duplicate section', () => {
      useContentStore.getState().addSection('hero', 'split')
      const heroId = useContentStore.getState().content.sections[0]?.id

      if (heroId) {
        useContentStore.getState().duplicateSection(heroId)
      }

      const sections = useContentStore.getState().content.sections
      expect(sections.length).toBe(2)
      expect(sections[0]?.type).toBe('hero')
      expect(sections[1]?.type).toBe('hero')
    })

    it('should create new id for duplicate', async () => {
      useContentStore.getState().addSection('hero', 'split')
      const originalId = useContentStore.getState().content.sections[0]?.id

      if (!originalId) {
        throw new Error('Original section not found')
      }

      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 5))

      useContentStore.getState().duplicateSection(originalId)

      const sections = useContentStore.getState().content.sections
      expect(sections[1]?.id).not.toBe(originalId)
    })

    it('should copy content to duplicate', () => {
      useContentStore.getState().addSection('hero', 'split')
      useContentStore.getState().updateContent('hero.title', 'Custom Title')

      const heroId = useContentStore.getState().content.sections[0]?.id
      if (heroId) {
        useContentStore.getState().duplicateSection(heroId)
      }

      const sections = useContentStore.getState().content.sections
      expect(sections[1]?.content['title']).toBe('Custom Title')
    })

    it('should insert duplicate after original', () => {
      useContentStore.getState().addSection('header', 'classic')
      useContentStore.getState().addSection('hero', 'split')
      useContentStore.getState().addSection('footer', 'four-column')

      const heroId = useContentStore.getState().content.sections[1]?.id
      if (heroId) {
        useContentStore.getState().duplicateSection(heroId)
      }

      const sections = useContentStore.getState().content.sections
      expect(sections[1]?.type).toBe('hero')
      expect(sections[2]?.type).toBe('hero')
      expect(sections[3]?.type).toBe('footer')
    })
  })

  // ============================================
  // TOGGLE VISIBILITY
  // ============================================
  describe('toggleSectionVisibility', () => {
    it('should toggle section visibility off', () => {
      useContentStore.getState().addSection('hero', 'split')
      const heroId = useContentStore.getState().content.sections[0]?.id

      if (heroId) {
        useContentStore.getState().toggleSectionVisibility(heroId)
      }

      expect(useContentStore.getState().content.sections[0]?.visible).toBe(false)
    })

    it('should toggle section visibility on', () => {
      useContentStore.getState().addSection('hero', 'split')
      const heroId = useContentStore.getState().content.sections[0]?.id

      if (heroId) {
        useContentStore.getState().toggleSectionVisibility(heroId)
        useContentStore.getState().toggleSectionVisibility(heroId)
      }

      expect(useContentStore.getState().content.sections[0]?.visible).toBe(true)
    })
  })

  // ============================================
  // REORDER SECTIONS
  // ============================================
  describe('reorderSections', () => {
    it('should reorder sections', () => {
      useContentStore.getState().addSection('header', 'classic')
      useContentStore.getState().addSection('hero', 'split')
      useContentStore.getState().addSection('footer', 'four-column')

      const sections = useContentStore.getState().content.sections
      if (sections[0] && sections[1] && sections[2]) {
        const reordered = [sections[2], sections[0], sections[1]]

        useContentStore.getState().reorderSections(reordered)

        const newSections = useContentStore.getState().content.sections
        expect(newSections[0]?.type).toBe('footer')
        expect(newSections[1]?.type).toBe('header')
        expect(newSections[2]?.type).toBe('hero')
      }
    })

    it('should update order values after reorder', () => {
      useContentStore.getState().addSection('header', 'classic')
      useContentStore.getState().addSection('hero', 'split')

      const sections = useContentStore.getState().content.sections
      if (sections[0] && sections[1]) {
        const reordered = [sections[1], sections[0]]

        useContentStore.getState().reorderSections(reordered)

        const newSections = useContentStore.getState().content.sections
        expect(newSections[0]?.order).toBe(0)
        expect(newSections[1]?.order).toBe(1)
      }
    })
  })

  // ============================================
  // UPDATE CONTENT
  // ============================================
  describe('updateContent', () => {
    it('should update businessName', () => {
      useContentStore.getState().updateContent('businessName', 'WellnessTal')
      expect(useContentStore.getState().content.businessName).toBe('WellnessTal')
    })

    it('should update section content field', () => {
      useContentStore.getState().addSection('hero', 'split')
      useContentStore.getState().updateContent('hero.title', 'New Title')

      const section = useContentStore.getState().content.sections[0]
      expect(section?.content['title']).toBe('New Title')
    })

    it('should update multiple fields', () => {
      useContentStore.getState().addSection('hero', 'split')
      useContentStore.getState().updateContent('hero.title', 'Title')
      useContentStore.getState().updateContent('hero.subtitle', 'Subtitle')

      const section = useContentStore.getState().content.sections[0]
      expect(section?.content['title']).toBe('Title')
      expect(section?.content['subtitle']).toBe('Subtitle')
    })
  })

  // ============================================
  // RESET CONTENT
  // ============================================
  describe('resetContent', () => {
    it('should reset to default content', () => {
      useContentStore.getState().addSection('hero', 'split')
      useContentStore.getState().updateContent('businessName', 'Custom')

      useContentStore.getState().resetContent()

      const state = useContentStore.getState()
      expect(state.content.businessName).toBe('Your Business')
      expect(state.content.sections).toEqual([])
    })
  })

  // ============================================
  // LOAD FROM WIZARD
  // ============================================
  describe('loadFromWizard', () => {
    it('should load content from wizard data', () => {
      const wizardData = {
        customization: {
          header: 'classic',
          hero: 'split',
          footer: 'four-column'
        },
        content: {
          businessName: 'WellnessTal',
          hero: {
            title: 'Welcome',
            subtitle: 'Premium Spa'
          }
        }
      }

      useContentStore.getState().loadFromWizard(wizardData)

      const state = useContentStore.getState()
      expect(state.content.businessName).toBe('WellnessTal')
      expect(state.content.sections.length).toBe(3)
    })

    it('should create sections from customization', () => {
      const wizardData = {
        customization: {
          header: 'modern',
          hero: 'centered',
          cta: 'simple'
        },
        content: {}
      }

      useContentStore.getState().loadFromWizard(wizardData)

      const sections = useContentStore.getState().content.sections
      expect(sections.find(s => s.type === 'header')).toBeTruthy()
      expect(sections.find(s => s.type === 'hero')).toBeTruthy()
      expect(sections.find(s => s.type === 'cta')).toBeTruthy()
    })

    it('should not create sections for missing customization keys', () => {
      const wizardData = {
        customization: {
          header: 'classic'
        },
        content: {}
      }

      useContentStore.getState().loadFromWizard(wizardData)

      const sections = useContentStore.getState().content.sections
      expect(sections.length).toBe(1)
      expect(sections[0]?.type).toBe('header')
    })

    it('should handle invalid wizard data', () => {
      const initialSections = useContentStore.getState().content.sections

      useContentStore.getState().loadFromWizard(null as any)

      expect(useContentStore.getState().content.sections).toEqual(initialSections)
    })

    it('should handle wizard data without customization', () => {
      const initialSections = useContentStore.getState().content.sections

      useContentStore.getState().loadFromWizard({ content: {} } as any)

      expect(useContentStore.getState().content.sections).toEqual(initialSections)
    })
  })

  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  describe('Helper Functions', () => {
    describe('getSectionById', () => {
      it('should find section by id', () => {
        useContentStore.getState().addSection('hero', 'split')
        const sections = useContentStore.getState().content.sections
        const heroId = sections[0]?.id

        if (!heroId) {
          throw new Error('Hero section not found')
        }

        const found = getSectionById(sections, heroId)
        expect(found).toBeTruthy()
        expect(found?.type).toBe('hero')
      })

      it('should return undefined for non-existent id', () => {
        useContentStore.getState().addSection('hero', 'split')
        const sections = useContentStore.getState().content.sections

        const found = getSectionById(sections, 'non-existent')
        expect(found).toBeUndefined()
      })
    })

    describe('getSectionsByType', () => {
      it('should find all sections of type', () => {
        useContentStore.getState().addSection('hero', 'split')
        useContentStore.getState().addSection('hero', 'centered')
        useContentStore.getState().addSection('footer', 'four-column')

        const sections = useContentStore.getState().content.sections
        const heroes = getSectionsByType(sections, 'hero')

        expect(heroes.length).toBe(2)
        expect(heroes.every(s => s.type === 'hero')).toBe(true)
      })

      it('should return empty array for non-existent type', () => {
        useContentStore.getState().addSection('hero', 'split')
        const sections = useContentStore.getState().content.sections

        const services = getSectionsByType(sections, 'services')
        expect(services).toEqual([])
      })
    })
  })
})
