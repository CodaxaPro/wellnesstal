/**
 * WellnessTall - useWizardStore Tests
 * Enterprise-grade unit tests for Wizard Store
 *
 * ⚠️ STRICT RULES:
 * - Once this test passes, it becomes IMMUTABLE
 * - Store must conform to these tests, not vice versa
 * - DO NOT modify assertions after tests pass
 *
 * @module tests/stores/useWizardStore
 */

import { describe, it, expect, beforeEach } from 'vitest'
import { useWizardStore } from '@/app/wizard/store/useWizardStore'

describe('useWizardStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useWizardStore.getState().reset()
  })

  // ============================================
  // INITIAL STATE
  // ============================================
  describe('Initial State', () => {
    it('should have null mode initially', () => {
      const state = useWizardStore.getState()
      expect(state.mode).toBeNull()
    })

    it('should have "mode" as initial step', () => {
      const state = useWizardStore.getState()
      expect(state.currentStep).toBe('mode')
    })

    it('should have null category initially', () => {
      const state = useWizardStore.getState()
      expect(state.category).toBeNull()
    })

    it('should have null theme initially', () => {
      const state = useWizardStore.getState()
      expect(state.theme).toBeNull()
    })

    it('should have empty customization object initially', () => {
      const state = useWizardStore.getState()
      expect(state.customization).toEqual({})
    })
  })

  // ============================================
  // MODE ACTIONS
  // ============================================
  describe('setMode', () => {
    it('should set mode to "ai"', () => {
      useWizardStore.getState().setMode('ai')
      expect(useWizardStore.getState().mode).toBe('ai')
    })

    it('should set mode to "manual"', () => {
      useWizardStore.getState().setMode('manual')
      expect(useWizardStore.getState().mode).toBe('manual')
    })

    it('should advance step to "category" after setting mode', () => {
      useWizardStore.getState().setMode('ai')
      expect(useWizardStore.getState().currentStep).toBe('category')
    })

    it('should set mode to null', () => {
      useWizardStore.getState().setMode('ai')
      useWizardStore.getState().setMode(null)
      expect(useWizardStore.getState().mode).toBeNull()
    })
  })

  // ============================================
  // STEP ACTIONS
  // ============================================
  describe('setStep', () => {
    it('should set step to "category"', () => {
      useWizardStore.getState().setStep('category')
      expect(useWizardStore.getState().currentStep).toBe('category')
    })

    it('should set step to "theme"', () => {
      useWizardStore.getState().setStep('theme')
      expect(useWizardStore.getState().currentStep).toBe('theme')
    })

    it('should set step to "customize"', () => {
      useWizardStore.getState().setStep('customize')
      expect(useWizardStore.getState().currentStep).toBe('customize')
    })

    it('should set step to "preview"', () => {
      useWizardStore.getState().setStep('preview')
      expect(useWizardStore.getState().currentStep).toBe('preview')
    })

    it('should not affect other state when changing step', () => {
      useWizardStore.getState().setMode('ai')
      useWizardStore.getState().setCategory('wellness')
      useWizardStore.getState().setStep('theme')

      expect(useWizardStore.getState().mode).toBe('ai')
      expect(useWizardStore.getState().category).toBe('wellness')
    })
  })

  // ============================================
  // DATA ACTIONS
  // ============================================
  describe('setCategory', () => {
    it('should set category', () => {
      useWizardStore.getState().setCategory('wellness')
      expect(useWizardStore.getState().category).toBe('wellness')
    })

    it('should overwrite existing category', () => {
      useWizardStore.getState().setCategory('wellness')
      useWizardStore.getState().setCategory('restaurant')
      expect(useWizardStore.getState().category).toBe('restaurant')
    })
  })

  describe('setTheme', () => {
    it('should set theme', () => {
      useWizardStore.getState().setTheme('modern')
      expect(useWizardStore.getState().theme).toBe('modern')
    })

    it('should overwrite existing theme', () => {
      useWizardStore.getState().setTheme('modern')
      useWizardStore.getState().setTheme('classic')
      expect(useWizardStore.getState().theme).toBe('classic')
    })
  })

  describe('setCustomization', () => {
    it('should add single customization', () => {
      useWizardStore.getState().setCustomization('header', 'classic')
      expect(useWizardStore.getState().customization).toEqual({ header: 'classic' })
    })

    it('should add multiple customizations', () => {
      useWizardStore.getState().setCustomization('header', 'classic')
      useWizardStore.getState().setCustomization('hero', 'split')
      useWizardStore.getState().setCustomization('footer', 'four-column')

      expect(useWizardStore.getState().customization).toEqual({
        header: 'classic',
        hero: 'split',
        footer: 'four-column'
      })
    })

    it('should overwrite existing customization key', () => {
      useWizardStore.getState().setCustomization('header', 'classic')
      useWizardStore.getState().setCustomization('header', 'modern')
      expect(useWizardStore.getState().customization.header).toBe('modern')
    })

    it('should handle complex values', () => {
      const complexValue = { variant: 'split', color: '#000' }
      useWizardStore.getState().setCustomization('hero', complexValue)
      expect(useWizardStore.getState().customization.hero).toEqual(complexValue)
    })
  })

  // ============================================
  // RESET ACTION
  // ============================================
  describe('reset', () => {
    it('should reset all state to initial values', () => {
      // Set various values
      useWizardStore.getState().setMode('ai')
      useWizardStore.getState().setStep('preview')
      useWizardStore.getState().setCategory('wellness')
      useWizardStore.getState().setTheme('modern')
      useWizardStore.getState().setCustomization('header', 'classic')

      // Reset
      useWizardStore.getState().reset()

      // Verify all reset
      const state = useWizardStore.getState()
      expect(state.mode).toBeNull()
      expect(state.currentStep).toBe('mode')
      expect(state.category).toBeNull()
      expect(state.theme).toBeNull()
      expect(state.customization).toEqual({})
    })
  })

  // ============================================
  // FULL WORKFLOW
  // ============================================
  describe('Full Workflow', () => {
    it('should complete full wizard flow', () => {
      const store = useWizardStore.getState()

      // Step 1: Select mode
      store.setMode('manual')
      expect(useWizardStore.getState().currentStep).toBe('category')

      // Step 2: Select category
      store.setCategory('wellness')
      store.setStep('theme')
      expect(useWizardStore.getState().currentStep).toBe('theme')

      // Step 3: Select theme
      store.setTheme('modern')
      store.setStep('customize')
      expect(useWizardStore.getState().currentStep).toBe('customize')

      // Step 4: Customize
      store.setCustomization('header', 'modern')
      store.setCustomization('hero', 'centered')
      store.setCustomization('footer', 'three-column')
      store.setStep('preview')

      // Verify final state
      const finalState = useWizardStore.getState()
      expect(finalState.mode).toBe('manual')
      expect(finalState.category).toBe('wellness')
      expect(finalState.theme).toBe('modern')
      expect(finalState.currentStep).toBe('preview')
      expect(finalState.customization).toEqual({
        header: 'modern',
        hero: 'centered',
        footer: 'three-column'
      })
    })
  })
})
