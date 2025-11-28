import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./src/__tests__/setup.ts'],
    include: [
      'src/__tests__/**/*.{test,spec}.{ts,tsx}',
      'src/**/*.{test,spec}.{ts,tsx}'
    ],
    exclude: [
      'node_modules',
      'dist',
      '.next',
      'e2e/**/*'
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      include: [
        'src/app/api/**/*.ts',
        'src/app/**/hooks/**/*.{ts,tsx}',
        'src/app/**/store/**/*.{ts,tsx}',
        'src/lib/**/*.ts',
        'src/contexts/**/*.tsx',
        'src/components/**/*.tsx'
      ],
      exclude: [
        'src/__tests__/**',
        'src/**/*.d.ts',
        'src/types/**',
        'node_modules/**'
      ],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80
        }
      }
    },
    testTimeout: 10000,
    hookTimeout: 10000
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})
