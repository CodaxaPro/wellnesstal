# 🔄 Otomatik Senkronizasyon Durumu

## ✅ EVET - Sistem Otomatik Olarak Supabase'e Kaydediyor!

### 📝 **Editor'daki Tüm Değişiklikler Otomatik Kaydediliyor**

#### 1. **Metin ve İçerik Değişiklikleri**
- ✅ **Otomatik kayıt**: Editor'da yaptığınız her değişiklik **2 saniye sonra** otomatik olarak Supabase'e kaydediliyor
- ✅ **Debounce mekanizması**: Sürekli yazarken her tuş vuruşu için kayıt yapmıyor, 2 saniye bekleyip tek seferde kaydediyor
- ✅ **Retry mekanizması**: Eğer kayıt başarısız olursa, 3 kez daha deniyor
- ✅ **Sayfa kapanırken kayıt**: Browser kapanırken bile değişiklikler kaydediliyor (`keepalive: true`)

**Nasıl Çalışıyor:**
```typescript
// useAutoSave.ts - Her içerik değişikliğinde otomatik kayıt
useEffect(() => {
  debouncedSave() // 2 saniye sonra kaydet
}, [content])
```

#### 2. **Resim Yüklemeleri**
- ✅ **Otomatik Supabase Storage'a yükleniyor**: Resim seçtiğinizde `/api/upload` veya `/api/media` endpoint'leri otomatik çalışıyor
- ✅ **Database'e kaydediliyor**: Resim yüklendikten sonra URL'i otomatik olarak ilgili blok içeriğine ekleniyor
- ✅ **Public URL alınıyor**: Yüklenen resimler için otomatik public URL oluşturuluyor

**Nasıl Çalışıyor:**
```typescript
// Resim seçildiğinde
const response = await fetch('/api/media', {
  method: 'POST',
  body: formData // Resim dosyası
})
// → Supabase Storage'a yüklenir
// → Database'e kaydedilir
// → URL otomatik olarak içeriğe eklenir
```

#### 3. **Blok Güncellemeleri**
- ✅ **PUT `/api/pages/blocks`**: Blok içeriği değiştirildiğinde otomatik güncelleniyor
- ✅ **Deep merge**: Mevcut veriler korunuyor, sadece değişen kısımlar güncelleniyor
- ✅ **Conflict resolution**: Eski güncellemeler yeni verileri silmiyor (timestamp kontrolü)

---

## ⚠️ ÖNEMLİ: Local vs Production Farkı

### **SORUN:** Local ve Production Farklı Supabase Projeleri Kullanıyor Olabilir!

**Durum:**
- 🏠 **Local ortam** (localhost:3000): `.env.local` dosyasındaki `NEXT_PUBLIC_SUPABASE_URL` kullanıyor
- 🌐 **Production ortam** (canlı site): Vercel'deki environment variable'daki `NEXT_PUBLIC_SUPABASE_URL` kullanıyor

**Bu Ne Demek?**
- ✅ Local'de yaptığınız değişiklikler → **Local Supabase'e** otomatik kaydediliyor
- ✅ Production'da yaptığınız değişiklikler → **Production Supabase'e** otomatik kaydediliyor
- ❌ **AMA** Local ve Production Supabase'leri **farklı projeler** ise, aralarında **otomatik senkronizasyon YOK!**

---

## 🔍 Nasıl Kontrol Edilir?

### 1. **Hangi Supabase Kullanılıyor Kontrolü**

**Local için:**
```bash
# .env.local dosyasını kontrol edin
cat .env.local | grep SUPABASE_URL
```

**Production için:**
```bash
# Vercel Dashboard > Settings > Environment Variables
# veya
vercel env ls
```

### 2. **Senkronizasyon Kontrol Scripti**

```bash
# check-sync.mjs scriptini çalıştırın
node check-sync.mjs
```

Bu script:
- Local ve Production database'lerini karşılaştırır
- Farklılıkları gösterir
- Hangi ortamın güncel olduğunu belirtir

---

## 🛠️ Çözüm: Senkronizasyon Nasıl Yapılır?

### **Seçenek 1: Aynı Supabase Projesini Kullanın (Önerilen)**

**Avantajları:**
- ✅ Local ve Production otomatik senkronize
- ✅ Tek bir veritabanı yönetimi
- ✅ Basit yapı

**Nasıl Yapılır:**
1. `.env.local` dosyasındaki Supabase URL'i kopyalayın
2. Vercel Dashboard > Settings > Environment Variables
3. Production için **aynı URL'i** kullanın
4. Deploy edin

**⚠️ Dikkat:** Production verileri kaybolabilir! Önce backup alın.

---

### **Seçenek 2: Manuel Senkronizasyon**

Eğer Local ve Production'ı ayrı tutmak istiyorsanız:

**Local → Production:**
```bash
# 1. Local database'den export al
# Supabase Dashboard > Table Editor > Export

# 2. Production database'e import et
# Supabase Dashboard (Production) > SQL Editor > Import
```

**Production → Local:**
```bash
# 1. Production database'den export al
# 2. Local database'e import et
```

---

## 📊 Otomatik Senkronizasyon Özeti

| İşlem Tipi | Local → Supabase | Production → Supabase | Local ↔ Production |
|------------|------------------|----------------------|-------------------|
| **Metin Değişiklikleri** | ✅ Otomatik | ✅ Otomatik | ❌ Otomatik DEĞİL |
| **Resim Yüklemeleri** | ✅ Otomatik | ✅ Otomatik | ❌ Otomatik DEĞİL |
| **Blok Güncellemeleri** | ✅ Otomatik | ✅ Otomatik | ❌ Otomatik DEĞİL |
| **Sayfa Oluşturma** | ✅ Otomatik | ✅ Otomatik | ❌ Otomatik DEĞİL |

---

## 💡 Öneriler

1. **Development için:** Local ve Production ayrı Supabase kullanın
2. **Production'a geçerken:** Önce Local'de test edin, sonra Production'a deploy edin
3. **Senkronizasyon için:** `check-sync.mjs` scriptini düzenli çalıştırın
4. **Backup:** Production verilerini düzenli yedekleyin

---

## 🔧 Sorun Giderme

### Problem: Local'de yaptığım değişiklikler Production'da görünmüyor

**Çözüm:**
1. Local ve Production farklı Supabase kullanıyor olabilir
2. `check-sync.mjs` çalıştırın
3. Production'a deploy edin: `git push origin main`

### Problem: Resimler yüklenmiyor

**Kontrol:**
1. Supabase Storage bucket'ı var mı? (`wellnesstal`)
2. Environment variables doğru mu?
3. Admin token doğru mu?

### Problem: Değişiklikler kayboluyor

**Kontrol:**
1. Auto-save çalışıyor mu? (Console'da hata var mı?)
2. Network tab'de kayıt request'i gidiyor mu?
3. Supabase'de veri var mı? (Table Editor'de kontrol edin)

---

## 📞 Daha Fazla Bilgi

- `SYNC_LOCAL_PRODUCTION.md` - Detaylı senkronizasyon rehberi
- `check-sync.mjs` - Senkronizasyon kontrol scripti
- `ENTERPRISE_SYNC_ANALYSIS.md` - Teknik detaylar

