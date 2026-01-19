import { FlatCompat } from '@eslint/eslintrc'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

export default [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  ...compat.config({
    extends: ['prettier'],
  }),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    rules: {
      // Enterprise: Code Quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-arrow-callback': 'error',
      'prefer-template': 'error',
      'object-shorthand': 'error',
      'no-unused-vars': 'off', // TypeScript handles this
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],

      // Enterprise: TypeScript Strict
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'off', // Requires type info, can be slow
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-unnecessary-condition': 'off', // Requires type info, can be slow
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',

      // Enterprise: React Best Practices
      'react/react-in-jsx-scope': 'off', // Next.js doesn't need this
      'react/prop-types': 'off', // TypeScript handles this
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/no-array-index-key': 'warn',
      'react/no-danger': 'warn',
      'react/no-deprecated': 'warn',
      'react/no-unescaped-entities': 'error',
      'react/self-closing-comp': 'error',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react/jsx-fragments': ['error', 'syntax'],

      // Enterprise: Next.js Best Practices
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-img-element': 'warn',
      '@next/next/no-sync-scripts': 'error',
      '@next/next/no-before-interactive-script-outside-document': 'error',
      '@next/next/no-css-tags': 'error',
      '@next/next/no-head-import-in-document': 'error',
      '@next/next/no-page-custom-font': 'warn',

      // Enterprise: Import Organization
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'next/**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'before',
            },
          ],
          pathGroupsExcludedImportTypes: ['react', 'next'],
        },
      ],
      'import/no-duplicates': 'error',
      'import/no-unresolved': 'off', // TypeScript handles this
      'import/no-cycle': ['error', { maxDepth: 3 }],
      'import/no-self-import': 'error',
      'import/no-useless-path-segments': 'error',

      // Enterprise: Security
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',

      // Enterprise: Performance
      'no-await-in-loop': 'warn',
      'no-promise-executor-return': 'error',
      'require-atomic-updates': 'error',

      // Enterprise: Code Style
      'eqeqeq': ['error', 'always', { null: 'ignore' }],
      'curly': ['error', 'all'],
      'brace-style': ['error', '1tbs', { allowSingleLine: false }],
      'comma-dangle': 'off', // Prettier handles this
      'comma-spacing': 'off', // Prettier handles this
      'comma-style': 'error',
      'eol-last': 'off', // Prettier handles this
      'indent': 'off', // Prettier handles this
      'key-spacing': 'off', // Prettier handles this
      'keyword-spacing': 'off', // Prettier handles this
      'no-multi-spaces': 'off', // Prettier handles this
      'no-trailing-spaces': 'off', // Prettier handles this
      'object-curly-spacing': 'off', // Prettier handles this
      'quotes': 'off', // Prettier handles this
      'semi': 'off', // Prettier handles this
      'space-before-blocks': 'off', // Prettier handles this
      'space-before-function-paren': 'off', // Prettier handles this
      'space-in-parens': 'off', // Prettier handles this
      'space-infix-ops': 'off', // Prettier handles this
      'space-unary-ops': 'off', // Prettier handles this
      'spaced-comment': ['error', 'always'],
      'arrow-spacing': 'off', // Prettier handles this
      'block-spacing': 'off', // Prettier handles this
      'computed-property-spacing': 'off', // Prettier handles this
      'func-call-spacing': 'off', // Prettier handles this
      'no-whitespace-before-property': 'off', // Prettier handles this
      'rest-spread-spacing': 'off', // Prettier handles this
      'template-curly-spacing': 'off', // Prettier handles this
      'yield-star-spacing': 'off', // Prettier handles this

      // Enterprise: Accessibility (if eslint-plugin-jsx-a11y is available)
      // 'jsx-a11y/alt-text': 'error',
      // 'jsx-a11y/anchor-has-content': 'error',
      // 'jsx-a11y/anchor-is-valid': 'error',
      // 'jsx-a11y/aria-props': 'error',
      // 'jsx-a11y/aria-proptypes': 'error',
      // 'jsx-a11y/aria-unsupported-elements': 'error',
      // 'jsx-a11y/role-has-required-aria-props': 'error',
      // 'jsx-a11y/role-supports-aria-props': 'error',
    },
  },
  {
    ignores: [
      '.next/**',
      'out/**',
      'node_modules/**',
      '*.config.js',
      '*.config.ts',
      'public/**',
      '.turbo/**',
      'dist/**',
      'build/**',
      'coverage/**',
      '.vercel/**',
      'supabase/migrations/**',
    ],
  },
]

