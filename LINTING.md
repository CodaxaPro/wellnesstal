# 🎯 Enterprise Linting & Code Quality Guide

## 📋 Overview

Bu proje enterprise seviyede linting ve code quality standartları kullanmaktadır.

## 🛠️ Tools

- **ESLint**: Code linting ve best practices
- **TypeScript**: Type safety ve strict checking
- **Prettier**: Code formatting
- **Next.js**: Framework-specific linting

## 📜 Commands

### Linting
```bash
# Lint tüm dosyaları
npm run lint

# Lint ve otomatik düzelt
npm run lint:fix

# Strict linting (0 warning)
npm run lint:strict
```

### Type Checking
```bash
# TypeScript type check
npm run type-check

# Type check watch mode
npm run type-check:watch
```

### Formatting
```bash
# Tüm dosyaları formatla
npm run format

# Format kontrolü (değişiklik yapmadan)
npm run format:check
```

### Code Quality (All-in-One)
```bash
# Tüm kontrolleri çalıştır (lint + type-check + format check)
npm run code-quality

# Tüm kontrolleri çalıştır ve otomatik düzelt
npm run code-quality:fix
```

## 🔧 Configuration Files

- `eslint.config.js` - ESLint kuralları
- `.eslintignore` - Lint edilmeyecek dosyalar
- `.prettierrc` - Prettier format ayarları
- `.prettierignore` - Format edilmeyecek dosyalar
- `tsconfig.json` - TypeScript strict ayarları

## 📏 Enterprise Rules

### TypeScript Strict Rules
- ✅ `strict: true` - Tüm strict checks aktif
- ✅ `noUnusedLocals` - Kullanılmayan local değişkenler
- ✅ `noUnusedParameters` - Kullanılmayan parametreler
- ✅ `noImplicitReturns` - Implicit return kontrolü
- ✅ `noFallthroughCasesInSwitch` - Switch case fallthrough kontrolü
- ✅ `noUncheckedIndexedAccess` - Index access safety
- ✅ `noImplicitOverride` - Override keyword zorunluluğu
- ✅ `exactOptionalPropertyTypes` - Optional property type precision

### ESLint Rules
- ✅ **Code Quality**: no-console, no-debugger, no-var, prefer-const
- ✅ **TypeScript**: no-explicit-any, no-floating-promises, await-thenable
- ✅ **React**: hooks rules, jsx-key, no-array-index-key
- ✅ **Next.js**: no-html-link-for-pages, no-img-element, no-sync-scripts
- ✅ **Import Organization**: Auto-sorted imports with groups
- ✅ **Security**: no-eval, no-implied-eval, no-script-url
- ✅ **Performance**: no-await-in-loop, require-atomic-updates

### Prettier Rules
- ✅ Single quotes
- ✅ No semicolons
- ✅ 2 space indentation
- ✅ Trailing commas
- ✅ 100 character line width
- ✅ LF line endings

## 🚀 Pre-commit Hooks (Recommended)

Git commit öncesi otomatik kontrol için:

```bash
# Husky ve lint-staged kurulumu (opsiyonel)
npm install --save-dev husky lint-staged

# Husky init
npx husky init

# Pre-commit hook ekle
echo "npm run code-quality:fix" > .husky/pre-commit
```

## 📝 Best Practices

1. **Her commit öncesi**: `npm run code-quality:fix` çalıştırın
2. **CI/CD**: Build öncesi `npm run code-quality` çalıştırın
3. **IDE Setup**: VSCode settings.json kullanarak otomatik format on save
4. **Import Order**: Import'lar otomatik sıralanır (react → next → internal)

## ⚠️ Important Notes

- Build sırasında lint ve type errors **artık ignore edilmiyor**
- Production build'lerde tüm kontroller zorunlu
- Unused variables `_` prefix ile ignore edilebilir: `const _unused = value`

## 🔍 Troubleshooting

### Lint errors çok fazla?
```bash
# Otomatik düzeltilebilenleri düzelt
npm run lint:fix
npm run format
```

### Type errors?
```bash
# Type check detaylı çıktı
npm run type-check
```

### Import order sorunları?
ESLint otomatik düzeltir, `npm run lint:fix` çalıştırın.

## 📚 Resources

- [ESLint Rules](https://eslint.org/docs/rules/)
- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [Next.js ESLint](https://nextjs.org/docs/app/building-your-application/configuring/eslint)

