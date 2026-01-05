# Production CSP Kontrol Listesi

## ✅ Local'de Çalışıyor
- `/headspa` sayfasındaki booking iframe'i çalışıyor
- `/gutschein` sayfasındaki studiobookr iframe'i çalışıyor

## ❌ Production'da Çalışmıyor
- İframe'ler production'da yüklenmiyor

## 🔍 Kontrol Adımları

### 1. Production'da CSP Header'ını Kontrol Et

Production URL'inizde şu komutu çalıştırın:

```bash
curl -I https://your-production-url.com/headspa | grep -i "content-security-policy"
```

Veya tarayıcıda:
- DevTools → Network → Sayfayı yenileyin
- İlk isteği seçin → Headers → Response Headers
- `Content-Security-Policy` header'ını kontrol edin

**Beklenen `frame-src` değeri:**
```
frame-src 'self' https://www.youtube.com https://player.vimeo.com https://book.timify.com https://*.timify.com https://www.studiobookr.com https://*.studiobookr.com https://studiobookr.com
```

### 2. Vercel Deployment Kontrolü

1. **Vercel Dashboard'a gidin**
2. **Settings → Security → Headers** bölümünü kontrol edin
3. Vercel'de ekstra CSP header'ı varsa, onu kaldırın veya middleware ile uyumlu hale getirin

### 3. Production Build Kontrolü

```bash
# Local'de production build test edin
npm run build
npm run start

# Sonra test edin
curl -I http://localhost:3000/headspa | grep -i "content-security-policy"
```

### 4. Vercel Cache Temizleme

Vercel'de cache sorunu olabilir:

1. **Vercel Dashboard → Deployments**
2. Son deployment'ı seçin
3. **Redeploy** yapın (Clear Cache ile)

### 5. Environment Variables Kontrolü

Production'da environment variable'lar doğru mu kontrol edin:

- `NEXT_PUBLIC_SITE_URL` doğru mu?
- Supabase URL'leri doğru mu?

## 🛠️ Çözüm Önerileri

### Eğer CSP Header Production'da Farklıysa:

1. **Vercel'de Headers Override Varsa:**
   - Vercel Dashboard → Settings → Security → Headers
   - Custom headers'ı kontrol edin ve kaldırın

2. **Middleware Cache Sorunu:**
   - Vercel'de "Clear Cache" ile redeploy yapın
   - Veya `vercel.json` dosyası oluşturup headers'ı orada da tanımlayın

3. **Next.js Config'de Headers Ekleme (Backup):**
   - `next.config.ts` dosyasına `headers()` fonksiyonu ekleyebiliriz
   - Ama middleware zaten var, bu gereksiz olabilir

## 📝 Kontrol Komutları

```bash
# Production URL'inizi test edin
PROD_URL="https://your-production-url.com"

# CSP Header kontrolü
curl -I $PROD_URL/headspa | grep -i "content-security-policy"

# Frame-src özellikle kontrol
curl -I $PROD_URL/headspa | grep -i "content-security-policy" | grep -o "frame-src[^;]*"

# Gutschein sayfası kontrolü
curl -I $PROD_URL/gutschein | grep -i "content-security-policy" | grep -o "frame-src[^;]*"
```

## ✅ Beklenen Sonuç

Production'da CSP header'ında şu domainler olmalı:
- ✅ `https://book.timify.com`
- ✅ `https://*.timify.com`
- ✅ `https://www.studiobookr.com`
- ✅ `https://*.studiobookr.com`
- ✅ `https://studiobookr.com`

## 🚨 Eğer Hala Sorun Varsa

1. Production'da CSP header'ının tam içeriğini paylaşın
2. Tarayıcı konsolundaki tam hata mesajını paylaşın
3. Vercel Dashboard'da Security headers ayarlarını kontrol edin

