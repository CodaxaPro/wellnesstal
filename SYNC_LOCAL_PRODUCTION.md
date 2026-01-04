# Local ve Production Senkronizasyon Rehberi

## Sorun: Local ve Canlı Ortamlar Senkronize Değil

### Olası Nedenler:

1. **Farklı Supabase Projeleri Kullanılıyor**
   - Local: `.env.local` dosyasındaki `NEXT_PUBLIC_SUPABASE_URL`
   - Production: Vercel/Deployment platform'daki environment variables

2. **Database Migration'lar Production'da Çalıştırılmamış**
   - Local'de migration'lar çalıştırılmış ama production'da yok

3. **Environment Variables Eksik veya Yanlış**
   - Production'da gerekli env variables ayarlanmamış

4. **Cache Sorunları**
   - Next.js build cache'i eski verileri gösteriyor

## Çözüm Adımları

### 1. Environment Variables Kontrolü

**Local (.env.local):**
```bash
NEXT_PUBLIC_SUPABASE_URL=your_local_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_local_service_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_local_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3001
```

**Production (Vercel/Deployment):**
- Vercel Dashboard > Project > Settings > Environment Variables
- Aynı değerleri production Supabase projesi için ayarlayın

### 2. Database Migration'ları Production'a Uygulama

```bash
# Production Supabase'e migration'ları çalıştır
# Supabase Dashboard > SQL Editor'de migration dosyalarını çalıştırın

# Veya Supabase CLI kullanarak:
supabase db push --db-url "your_production_db_url"
```

### 3. Veri Senkronizasyonu

**Seçenek 1: Production'dan Local'e (Önerilen)**
```bash
# Production database'den veri çek
# Supabase Dashboard > Table Editor'den export al
# Local database'e import et
```

**Seçenek 2: Local'den Production'a**
```bash
# Dikkat: Bu production verilerini siler!
# Sadece test/development için kullanın
```

### 4. Build ve Deploy

```bash
# Local'de test et
npm run build
npm run start

# Production'a deploy et
git push origin main  # Vercel otomatik deploy eder
# veya
vercel --prod
```

### 5. Cache Temizleme

```bash
# Local
rm -rf .next
npm run build

# Production (Vercel)
# Vercel Dashboard > Deployments > Redeploy
```

## Kontrol Scripti

`check-sync.mjs` scriptini çalıştırarak local ve production durumunu kontrol edin.

## Önemli Notlar

⚠️ **Production database'i değiştirmeden önce mutlaka backup alın!**

✅ **Her migration'dan sonra production'da test edin**

✅ **Environment variables'ları asla git'e commit etmeyin**

