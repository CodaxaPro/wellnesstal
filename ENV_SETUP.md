# 🔐 Environment Variables Kurulum Rehberi

Bu dosya, Wellnesstal projesi için gerekli environment variables'ları açıklar.

## 📋 Gerekli Environment Variables

`.env.local` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:

```env
# Supabase Configuration
# Bu değerleri almak için: https://app.supabase.com/project/YOUR_PROJECT/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3001

# Admin Configuration
ADMIN_PASSWORD=your-secure-admin-password-here

# JWT Secret (production için güçlü bir random string kullanın)
JWT_SECRET=your-jwt-secret-here

# Optional: Unsplash API (admin panelde görsel arama için)
UNSPLASH_ACCESS_KEY=your-unsplash-key-here
```

## 🚀 Kurulum Adımları

### 1. Supabase Keys'i Alın

1. [Supabase Dashboard](https://app.supabase.com) adresine gidin
2. Projenizi seçin
3. **Settings > API** bölümüne gidin
4. Aşağıdaki değerleri kopyalayın:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key (secret) → `SUPABASE_SERVICE_ROLE_KEY`

### 2. Local Development

```bash
# .env.local dosyası oluşturun
cp .env.example .env.local  # Eğer .env.example varsa
# veya manuel olarak oluşturun

# Değerleri doldurun
nano .env.local  # veya tercih ettiğiniz editör
```

### 3. Production (Vercel)

Vercel Dashboard'da environment variables'ları ayarlayın:

1. [Vercel Dashboard](https://vercel.com/dashboard) > Projeniz > Settings > Environment Variables
2. Her bir değişkeni ekleyin:
   - **Production** environment için
   - **Preview** environment için (opsiyonel)
   - **Development** environment için (opsiyonel)

**Önemli:** Production'da `NEXT_PUBLIC_SITE_URL` değerini production domain'inize göre ayarlayın:
```env
NEXT_PUBLIC_SITE_URL=https://www.wellnesstal.de
```

## 🔒 Güvenlik Notları

1. **`.env.local` dosyasını asla commit etmeyin!** (zaten .gitignore'da)
2. **`SUPABASE_SERVICE_ROLE_KEY`** sadece server-side kullanılmalıdır
3. **Production'da `JWT_SECRET`** için güçlü bir random string kullanın
4. **`ADMIN_PASSWORD`** için güçlü bir şifre seçin

## ✅ Kontrol

Environment variables'ların doğru ayarlandığını kontrol etmek için:

```bash
# Development server'ı başlatın
npm run dev

# Console'da hata olmamalı
# Eğer Supabase bağlantı hatası varsa, environment variables'ları kontrol edin
```

## 📚 İlgili Dokümantasyon

- [Supabase Setup Guide](./SUPABASE_SETUP.md)
- [Vercel Deployment Status](./VERCEL_DEPLOYMENT_STATUS.md)
- [Sync Local Production](./SYNC_LOCAL_PRODUCTION.md)

