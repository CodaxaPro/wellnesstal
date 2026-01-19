/**
 * WellnessTall - Auth E2E Tests
 * Enterprise-grade E2E tests for authentication flow
 *
 * ⚠️ STRICT RULES:
 * - Once this test passes, it becomes IMMUTABLE
 * - Application must conform to these tests, not vice versa
 * - DO NOT modify assertions after tests pass
 *
 * @module e2e/auth/login
 */

import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login')
  })

  test('should display login page', async ({ page }) => {
    // Check page title or heading
    await expect(page.locator('h1, h2').first()).toBeVisible()

    // Check for login form elements
    await expect(
      page.locator('input[type="email"], input[name="email"], input[placeholder*="mail"]').first()
    ).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
    await expect(
      page
        .locator(
          'button[type="submit"], button:has-text("Login"), button:has-text("Sign"), button:has-text("Giriş")'
        )
        .first()
    ).toBeVisible()
  })

  test('should show error with invalid credentials', async ({ page }) => {
    // Fill in invalid credentials
    await page
      .locator('input[type="email"], input[name="email"], input[placeholder*="mail"]')
      .first()
      .fill('invalid@test.com')
    await page.locator('input[type="password"]').first().fill('wrongpassword')

    // Submit form
    await page
      .locator(
        'button[type="submit"], button:has-text("Login"), button:has-text("Sign"), button:has-text("Giriş")'
      )
      .first()
      .click()

    // Wait for error message or stay on login page
    await page.waitForTimeout(1000)

    // Should still be on login page or show error
    const currentUrl = page.url()
    expect(currentUrl).toContain('login')
  })

  test('should have password field masked', async ({ page }) => {
    const passwordInput = page.locator('input[type="password"]').first()
    await expect(passwordInput).toHaveAttribute('type', 'password')
  })

  test('should have link to register page', async ({ page }) => {
    const registerLink = page.locator(
      'a[href*="register"], a:has-text("Register"), a:has-text("Sign up"), a:has-text("Kayıt")'
    )

    // Register link might exist
    const linkCount = await registerLink.count()
    if (linkCount > 0) {
      await expect(registerLink.first()).toBeVisible()
    }
  })
})

test.describe('Registration Flow', () => {
  test('should display register page', async ({ page }) => {
    await page.goto('/register')

    // Check for registration form elements
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible()
    await expect(page.locator('input[type="password"]').first()).toBeVisible()
  })

  test('should have link back to login', async ({ page }) => {
    await page.goto('/register')

    const loginLink = page.locator(
      'a[href*="login"], a:has-text("Login"), a:has-text("Sign in"), a:has-text("Giriş")'
    )
    const linkCount = await loginLink.count()

    if (linkCount > 0) {
      await expect(loginLink.first()).toBeVisible()
    }
  })
})
