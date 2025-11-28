# 🗄️ Supabase Veritabanı Kurulum Rehberi

Bu rehber, Wellnesstal projesini Supabase veritabanına bağlamak için gerekli adımları açıklar.

---

## 📋 Önkoşullar

- [Supabase](https://supabase.com) hesabı
- Mevcut proje: `https://rtudfkccbzbblfmeoyop.supabase.co`

---

## 🚀 Kurulum Adımları

### 1. Supabase Dashboard'a Giriş

1. [Supabase Dashboard](https://app.supabase.com) adresine gidin
2. Projenizi seçin (rtudfkccbzbblfmeoyop)

### 2. SQL Migration'ları Çalıştırın

**SQL Editor'a gidin:** Supabase Dashboard > SQL Editor > New Query

Aşağıdaki dosyaları sırasıyla çalıştırın:

#### Adım 2.1: Tablo Yapısı
```
supabase/migrations/001_initial_schema.sql
```
Bu dosyayı kopyalayıp SQL Editor'a yapıştırın ve "Run" butonuna tıklayın.

#### Adım 2.2: Seed Data (Kategoriler, Servisler)
```
supabase/migrations/002_seed_data.sql
```

#### Adım 2.3: Content Data
```
supabase/migrations/003_seed_content.sql
```

### 3. Service Role Key'i Alın

1. Supabase Dashboard > Settings > API
2. **service_role** (secret) key'i kopyalayın
3. `.env.local` dosyasına ekleyin:

```env
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### 4. Admin Şifresini Ayarlayın

`.env.local` dosyasında admin şifresini değiştirin:

```env
ADMIN_PASSWORD="yeni-guclu-sifreniz"
```

İlk girişte bu şifre ile giriş yapın, sistem otomatik olarak bcrypt hash'i veritabanına kaydedecektir.

---

## 📊 Oluşturulan Tablolar

| Tablo | Açıklama |
|-------|----------|
| `admin_users` | Admin kullanıcıları |
| `categories` | Hizmet kategorileri |
| `services` | Hizmetler |
| `content` | Dinamik sayfa içerikleri |
| `pages` | Sayfalar |
| `testimonials` | Müşteri yorumları |

---

## 🔐 Güvenlik Özellikleri

### Row Level Security (RLS)
- ✅ Tüm tablolarda RLS aktif
- ✅ Public okuma erişimi (categories, services, content)
- ✅ Authenticated yazma erişimi (service role ile)

### Triggers
- ✅ `updated_at` otomatik güncelleme
- ✅ Service sayısı otomatik hesaplama (kategori değişikliklerinde)

---

## 🧪 Test Etme

Kurulum tamamlandıktan sonra:

```bash
# Development server'ı başlat
npm run dev

# API'leri test et
curl http://localhost:3001/api/categories
curl http://localhost:3001/api/services
curl http://localhost:3001/api/content
```

---

## ⚠️ Önemli Notlar

1. **Production'da JWT_SECRET'ı değiştirin!**
   ```env
   JWT_SECRET="cok-guclu-ve-uzun-bir-secret-key-production-icin"
   ```

2. **Service Role Key'i asla client-side'da kullanmayın!**
   Bu key sadece server-side API route'larında kullanılmalıdır.

3. **Mevcut content.json dosyası backup olarak kalıyor.**
   Supabase'e bağlanamazsa sistem otomatik olarak dosyaya fallback yapar.

---

## 🔄 Migration Sonrası

Tablolar oluşturulduktan sonra:

1. Admin paneline giriş yapın (`/admin`)
2. Kategorileri ve servisleri kontrol edin
3. İçerik bölümlerini düzenleyin

Tüm verileriniz artık Supabase'de güvenle saklanıyor! 🎉
