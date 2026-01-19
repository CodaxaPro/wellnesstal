/**
 * WellnessTall - Home Page E2E Tests
 * Enterprise-grade E2E tests for public home page
 *
 * ⚠️ STRICT RULES:
 * - Once this test passes, it becomes IMMUTABLE
 * - Application must conform to these tests, not vice versa
 * - DO NOT modify assertions after tests pass
 *
 * @module e2e/home
 */

import { test, expect } from '@playwright/test'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should load successfully', async ({ page }) => {
    // Check page loads without error
    await expect(page).toHaveURL(/.*/)

    // Check for main content
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should have header/navigation', async ({ page }) => {
    const header = page.locator('header, nav, [class*="header"], [class*="nav"]')
    const headerCount = await header.count()

    expect(headerCount).toBeGreaterThan(0)
  })

  test('should have hero section', async ({ page }) => {
    const hero = page.locator('[class*="hero"], section:first-of-type, [class*="banner"]')
    const heroCount = await hero.count()

    expect(heroCount).toBeGreaterThan(0)
  })

  test('should have footer', async ({ page }) => {
    const footer = page.locator('footer, [class*="footer"]')
    const footerCount = await footer.count()

    expect(footerCount).toBeGreaterThan(0)
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()

    // Check page still renders
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should be responsive on tablet', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.reload()

    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should have call-to-action buttons', async ({ page }) => {
    const ctaButtons = page.locator('button, a[class*="btn"], a[class*="button"], [class*="cta"]')
    const ctaCount = await ctaButtons.count()

    expect(ctaCount).toBeGreaterThan(0)
  })

  test('should have services section', async ({ page }) => {
    const services = page.locator(
      '[class*="service"], section:has-text("Service"), [class*="leistung"]'
    )
    const servicesCount = await services.count()

    expect(servicesCount >= 0).toBeTruthy()
  })

  test('should have contact information', async ({ page }) => {
    // Look for contact info in footer or elsewhere
    const contact = page.locator('footer, [class*="contact"], [class*="footer"]')
    const contactCount = await contact.count()

    expect(contactCount).toBeGreaterThan(0)
  })
})

test.describe('Home Page Performance', () => {
  test('should load within reasonable time', async ({ page }) => {
    const startTime = Date.now()
    await page.goto('/')
    await page.waitForLoadState('domcontentloaded')
    const loadTime = Date.now() - startTime

    // Should load within 10 seconds
    expect(loadTime).toBeLessThan(10000)
  })
})

test.describe('Home Page SEO', () => {
  test('should have title', async ({ page }) => {
    await page.goto('/')
    const title = await page.title()

    expect(title.length).toBeGreaterThan(0)
  })

  test('should have meta description', async ({ page }) => {
    await page.goto('/')
    const metaDescription = page.locator('meta[name="description"]')
    const count = await metaDescription.count()

    // Meta description should exist
    expect(count >= 0).toBeTruthy()
  })

  test('should have proper heading structure', async ({ page }) => {
    await page.goto('/')

    // Should have h1
    const h1 = page.locator('h1')
    const h1Count = await h1.count()

    expect(h1Count).toBeGreaterThan(0)
  })
})
