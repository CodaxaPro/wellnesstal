# 🚀 Production Deployment Rehberi

Bu rehber, local ortamı production Supabase ile çalıştırmak ve Vercel'e deploy etmek için adım adım talimatlar içerir.

---

## 📋 Ön Gereksinimler

- ✅ Git kurulu ve yapılandırılmış
- ✅ Vercel hesabı ve proje bağlantısı
- ✅ Production Supabase projesi ve API key'leri
- ✅ Node.js >= 18.0.0

---

## 🎯 1. Local Ortamı Production Supabase'e Bağlama

### Adım 1: Production Supabase Bilgilerini Alın

1. [Supabase Dashboard](https://app.supabase.com) → Projenizi seçin
2. **Settings > API** bölümüne gidin
3. Aşağıdaki bilgileri not edin:
   - **Project URL** (örn: `https://rtudfkccbzbblfmeoyop.supabase.co`)
   - **anon public** key
   - **service_role** key (secret)

### Adım 2: .env.local Dosyası Oluşturun

```bash
# Template dosyasını kopyalayın
cp .env.production.example .env.local

# .env.local dosyasını düzenleyin
nano .env.local  # veya tercih ettiğiniz editör
```

### Adım 3: Production Değerlerini Girin

`.env.local` dosyasına production Supabase bilgilerini girin:

```env
# Supabase Configuration (Production)
NEXT_PUBLIC_SUPABASE_URL=https://rtudfkccbzbblfmeoyop.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<production-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<production-service-role-key>

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://www.wellnesstal.de

# Admin Configuration
ADMIN_PASSWORD=<güçlü-şifre>

# JWT Secret
JWT_SECRET=<güçlü-random-string>
```

⚠️ **ÖNEMLİ:**

- `.env.local` dosyasını **asla Git'e commit etmeyin!** (zaten .gitignore'da)
- Bu dosya sadece local development için

### Adım 4: Local'i Test Edin

```bash
# Dependencies'leri yükleyin (ilk kez)
npm install

# Development server'ı başlatın
npm run dev
```

Tarayıcıda http://localhost:3001 açılmalı ve production Supabase verilerini göstermeli.

---

## 🔄 2. Git Workflow

### Adım 1: Değişiklikleri Kontrol Edin

```bash
# Mevcut durumu göster
git status

# Değişiklikleri görüntüle
git diff
```

### Adım 2: Değişiklikleri Commit Edin

```bash
# Tüm değişiklikleri stage'e al
git add .

# Commit oluştur
git commit -m "feat: açıklayıcı commit mesajı"

# Örnek commit mesajları:
# "feat: yeni özellik eklendi"
# "fix: bug düzeltildi"
# "refactor: kod iyileştirmesi"
# "style: tasarım güncellemesi"
```

### Adım 3: Production'a Push Edin

```bash
# Main branch'e push et
git push origin main
```

✅ **Otomatik Deployment:** Vercel, `main` branch'e push yaptığınızda otomatik olarak deploy başlatır.

---

## 🚀 3. Vercel Deployment

### Otomatik Deployment (Önerilen)

Vercel zaten Git ile entegre edilmiş durumda:

1. `git push origin main` yaptığınızda
2. Vercel otomatik olarak build başlatır
3. Build tamamlandığında production'a deploy edilir

**Deployment Durumunu Kontrol:**

- [Vercel Dashboard](https://vercel.com/treuepays-projects/wellnesstal)
- Deployment'ları gerçek zamanlı takip edebilirsiniz

### Manuel Deployment (Opsiyonel)

```bash
# Vercel CLI ile manuel deploy
vercel --prod

# Veya preview deployment
vercel
```

### Environment Variables Kontrolü

Vercel Dashboard'da production environment variables'ların ayarlı olduğundan emin olun:

1. [Vercel Dashboard](https://vercel.com/dashboard) → Projeniz
2. **Settings > Environment Variables**
3. Şu değişkenlerin **Production** için ayarlı olduğunu kontrol edin:

```
✅ NEXT_PUBLIC_SUPABASE_URL
✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
✅ SUPABASE_SERVICE_ROLE_KEY
✅ NEXT_PUBLIC_SITE_URL
✅ ADMIN_PASSWORD
✅ JWT_SECRET
```

---

## 📊 4. Deployment Sonrası Kontroller

### 1. Production Site Kontrolü

```bash
# Ana sayfa
https://www.wellnesstal.de

# Admin panel
https://www.wellnesstal.de/admin

# Editor
https://www.wellnesstal.de/editor/[siteId]
```

### 2. Build Logs Kontrolü

Vercel Dashboard > Deployments > [Latest] > Build Logs

Hata varsa buradan görebilirsiniz.

### 3. Function Logs

Vercel Dashboard > Projeniz > Functions sekmesinden API route loglarını görebilirsiniz.

---

## 🔧 5. Hızlı Deployment Komutları

```bash
# Tüm değişiklikleri deploy et (kısa yol)
git add . && git commit -m "feat: güncelleme" && git push origin main

# Veya script kullanın
npm run deploy
```

Deployment script'i eklemek için `package.json`'a ekleyin:

```json
"scripts": {
  "deploy": "git add . && git commit -m 'deploy: auto commit' && git push origin main"
}
```

---

## 🐛 Sorun Giderme

### Problem: Local'de production veriler görünmüyor

**Çözüm:**

1. `.env.local` dosyasının doğru Supabase URL'ini içerdiğinden emin olun
2. Browser cache'ini temizleyin
3. Development server'ı yeniden başlatın: `npm run dev`

### Problem: Git push çalışmıyor

**Çözüm:**

```bash
# Remote'u kontrol edin
git remote -v

# Eğer yoksa ekleyin
git remote add origin https://github.com/CodaxaPro/wellnesstal.git

# Branch'i kontrol edin
git branch

# Main branch'te olduğunuzdan emin olun
git checkout main
```

### Problem: Vercel deployment başarısız

**Kontrol Edin:**

1. ✅ Build logs'da hata var mı?
2. ✅ Environment variables doğru mu?
3. ✅ Node.js version uyumlu mu? (>= 18.0.0)
4. ✅ Dependencies yüklenmiş mi? (`npm install` çalıştırın)

### Problem: Production'da değişiklikler görünmüyor

**Çözüm:**

1. Deployment tamamlandı mı kontrol edin
2. Browser cache'ini temizleyin (Ctrl+Shift+R / Cmd+Shift+R)
3. CDN cache'i için birkaç dakika bekleyin
4. Vercel Dashboard'da deployment'ın başarılı olduğunu kontrol edin

---

## 📝 Deployment Checklist

Her deployment öncesi:

- [ ] `.env.local` production Supabase bilgilerini içeriyor
- [ ] Tüm değişiklikler commit edildi
- [ ] `npm run build` local'de başarılı
- [ ] `npm run lint` hata vermiyor
- [ ] Vercel environment variables doğru
- [ ] Git branch `main`
- [ ] Deployment sonrası production site test edildi

---

## 🎯 Özet: Hızlı Başlangıç

```bash
# 1. Environment setup
cp .env.production.example .env.local
# .env.local dosyasını düzenleyin

# 2. Development server'ı başlatın
npm install
npm run dev

# 3. Değişiklikleri deploy edin
git add .
git commit -m "feat: değişiklik açıklaması"
git push origin main

# 4. Vercel otomatik deploy edecek!
# Dashboard'dan takip edin: https://vercel.com/dashboard
```

---

## 📚 İlgili Dokümantasyon

- [Environment Variables Setup](./ENV_SETUP.md)
- [Supabase Setup](./SUPABASE_SETUP.md)
- [Vercel Deployment Status](./VERCEL_DEPLOYMENT_STATUS.md)
- [Local-Production Sync](./SYNC_LOCAL_PRODUCTION.md)
- [Otomatik Senkronizasyon](./OTOMATIK_SENKRONIZASYON_DURUMU.md)

---

**Son Güncelleme:** 2026-01-06
