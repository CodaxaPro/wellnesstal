# ⚡ Hızlı Setup Rehberi - Production'a Hazır

Bu rehber, local ortamı production Supabase ile çalışacak şekilde hızlıca yapılandırmanızı sağlar.

---

## 🎯 Tek Komutla Setup

### 1. Otomatik Setup Script'i Çalıştırın

```bash
# Setup script'ini çalıştırın
bash scripts/setup-production-env.sh
```

Script size sırayla sorular soracak ve `.env.local` dosyasını oluşturacak.

---

## 📝 Manuel Setup (Alternatif)

### Adım 1: .env.local Dosyası Oluşturun

```bash
# .env.local dosyası oluşturun
touch .env.local
```

### Adım 2: Production Değerlerini Ekleyin

`.env.local` dosyasını açın ve aşağıdaki içeriği ekleyin:

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

**Bu bilgileri nereden bulabilirsiniz?**

1. **Supabase Keys:** [Supabase Dashboard](https://app.supabase.com) → Settings → API
2. **JWT Secret:** Güçlü bir random string oluşturun:
   ```bash
   openssl rand -hex 32
   ```

---

## 🚀 Hızlı Başlatma

### 1. Dependencies Yükleyin

```bash
npm install
```

### 2. Development Server'ı Başlatın

```bash
npm run dev
```

✅ Tarayıcıda http://localhost:3001 açılmalı ve production Supabase verilerini göstermeli!

---

## 🔄 Deploy Etme

### Otomatik Deploy (Önerilen)

```bash
# Tüm değişiklikleri commit ve push et
git add .
git commit -m "feat: değişiklik açıklaması"
git push origin main
```

✅ Vercel otomatik olarak deploy edecek!

### Hızlı Deploy Script'i

```bash
# package.json'daki deploy script'i kullanın
npm run deploy
```

Veya commit mesajı ile:

```bash
npm run deploy:msg
```

---

## ✅ Kontrol Listesi

Setup tamamlandıktan sonra kontrol edin:

- [ ] `.env.local` dosyası oluşturuldu
- [ ] `npm install` çalıştırıldı
- [ ] `npm run dev` başarılı
- [ ] http://localhost:3001 açılıyor
- [ ] Production Supabase verileri görünüyor
- [ ] Admin panel çalışıyor (`/admin`)

---

## 🐛 Sorun Giderme

### "Environment variables not found" hatası

**Çözüm:**
- `.env.local` dosyasının proje root'unda olduğundan emin olun
- Development server'ı yeniden başlatın: `Ctrl+C` sonra `npm run dev`

### "Cannot connect to Supabase" hatası

**Çözüm:**
- `.env.local` dosyasındaki Supabase URL ve key'leri kontrol edin
- Supabase Dashboard'dan bilgileri doğrulayın

### Git push çalışmıyor

**Çözüm:**
```bash
# Remote'u kontrol edin
git remote -v

# Eğer yoksa ekleyin
git remote add origin https://github.com/CodaxaPro/wellnesstal.git
```

---

## 📚 Detaylı Dokümantasyon

Daha fazla bilgi için:

- [Deployment Guide](./DEPLOYMENT_GUIDE.md) - Detaylı deployment rehberi
- [Environment Setup](./ENV_SETUP.md) - Environment variables detayları
- [Supabase Setup](./SUPABASE_SETUP.md) - Supabase kurulum rehberi

---

## 🎉 Hazır!

Artık local ortamınız production Supabase ile çalışıyor. 

Her değişiklik yaptığınızda:
1. `git add .`
2. `git commit -m "feat: açıklama"`
3. `git push origin main`

Vercel otomatik deploy edecek! 🚀

