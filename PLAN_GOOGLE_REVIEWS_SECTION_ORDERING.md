# Enterprise Plan: Google Reviews & Dynamic Section Ordering

## Genel Bakış

Bu plan iki enterprise özelliği kapsar:
1. **Dinamik Bölüm Sıralama Sistemi** - Anasayfa bölümlerini sürükle-bırak ile yönet
2. **Google Yorumları Bölümü** - Müşteri yorumlarını göster ve yönet

---

## BÖLÜM 1: Dinamik Bölüm Sıralama Sistemi

### 1.1 Veritabanı Şeması

```sql
-- Supabase migration: 004_section_ordering.sql
CREATE TABLE homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key VARCHAR(50) UNIQUE NOT NULL,
  section_name VARCHAR(100) NOT NULL,
  section_icon VARCHAR(10),
  position INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Varsayılan bölümler
INSERT INTO homepage_sections (section_key, section_name, section_icon, position, enabled) VALUES
  ('landing-hero', 'Landing Hero', '🎯', 1, true),
  ('hero', 'Hero Section', '🏠', 2, true),
  ('services', 'Hizmetler', '🏥', 3, true),
  ('google-reviews', 'Google Yorumları', '⭐', 4, true),
  ('testimonials', 'Müşteri Yorumları', '💬', 5, true),
  ('about', 'Hakkımızda', '👥', 6, true),
  ('contact', 'İletişim', '📞', 7, true);
```

### 1.2 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/sections` | Tüm bölümleri getir (sıralı) |
| PUT | `/api/sections/reorder` | Sıralamayı güncelle |
| PATCH | `/api/sections/[id]` | Bölümü aç/kapa |

### 1.3 Admin Panel UI

**Konum:** `src/app/admin/sections/page.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  📱 Sayfa Bölümleri Yönetimi                           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ≡  🎯 Landing Hero                    ✅ ON  ↕  │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ≡  🏠 Hero Section                    ✅ ON  ↕  │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ≡  🏥 Hizmetler                       ✅ ON  ↕  │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ≡  ⭐ Google Yorumları                ✅ ON  ↕  │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ≡  💬 Müşteri Yorumları               ❌ OFF ↕  │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ≡  👥 Hakkımızda                      ✅ ON  ↕  │   │
│  └─────────────────────────────────────────────────┘   │
│  ┌─────────────────────────────────────────────────┐   │
│  │ ≡  📞 İletişim                        ✅ ON  ↕  │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  [💾 Kaydet]                      [↻ Sıfırla]          │
└─────────────────────────────────────────────────────────┘
```

**Özellikler:**
- Sürükle-bırak sıralama (react-beautiful-dnd veya @dnd-kit)
- Toggle ile bölüm aç/kapa
- Anlık önizleme
- Değişiklikleri kaydet/iptal

### 1.4 Homepage Dinamik Render

```typescript
// src/app/page.tsx
const sectionComponents: Record<string, React.ComponentType> = {
  'landing-hero': LandingHeroSection,
  'hero': HeroSection,
  'services': ServicesSection,
  'google-reviews': GoogleReviewsSection,
  'testimonials': TestimonialsSection,
  'about': AboutSection,
  'contact': ContactSection,
}

// Fetch section order and render dynamically
{sections
  .filter(s => s.enabled)
  .sort((a, b) => a.position - b.position)
  .map(section => {
    const Component = sectionComponents[section.section_key]
    return Component ? <Component key={section.id} /> : null
  })}
```

---

## BÖLÜM 2: Google Yorumları Sistemi

### 2.1 Veritabanı Şeması

```sql
-- Supabase migration: 005_google_reviews.sql
CREATE TABLE google_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_name VARCHAR(100) NOT NULL,
  reviewer_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  review_date TIMESTAMP,
  source VARCHAR(50) DEFAULT 'google',
  verified BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Google Reviews bölüm ayarları (content tablosuna)
-- section: 'google-reviews-section'
```

### 2.2 API Endpoints

| Method | Endpoint | Açıklama |
|--------|----------|----------|
| GET | `/api/reviews` | Aktif yorumları getir |
| GET | `/api/reviews?all=true` | Tüm yorumları getir (admin) |
| POST | `/api/reviews` | Yeni yorum ekle |
| PUT | `/api/reviews/[id]` | Yorumu güncelle |
| DELETE | `/api/reviews/[id]` | Yorumu sil |
| PUT | `/api/reviews/reorder` | Sıralamayı güncelle |

### 2.3 Admin Panel - Yorumlar Yönetimi

**Konum:** `src/app/admin/reviews/page.tsx`

```
┌─────────────────────────────────────────────────────────────────┐
│  ⭐ Google Yorumları Yönetimi                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  [Genel Ayarlar]  [Yorumlar]  [Görünüm]                        │
│  ─────────────────────────────────────────────────────────────  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  GENEL AYARLAR                                          │   │
│  │                                                         │   │
│  │  Bölüm Başlığı: [Google'da Bizi Değerlendirin    ]     │   │
│  │  Alt Başlık:    [500+ mutlu müşteri...           ]     │   │
│  │                                                         │   │
│  │  ⭐ Minimum Puan Filtresi                               │   │
│  │  [1⭐] [2⭐] [3⭐] [4⭐✓] [5⭐]                          │   │
│  │  (Sadece 4+ yıldız yorumlar gösterilir)                │   │
│  │                                                         │   │
│  │  Gösterilecek Yorum Sayısı: [6    ]                    │   │
│  │  Otomatik Kaydırma (ms):    [5000 ]                    │   │
│  │                                                         │   │
│  │  [✓] Ortalama Puanı Göster                             │   │
│  │  [✓] Toplam Yorum Sayısını Göster                      │   │
│  │  [✓] Google Badge Göster                               │   │
│  │  [✓] "Tüm Yorumları Gör" Butonu                        │   │
│  │                                                         │   │
│  │  Google İşletme Linki:                                 │   │
│  │  [https://g.page/r/xxx/review                    ]     │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  YORUMLAR                               [+ Yorum Ekle]  │   │
│  │                                                         │   │
│  │  ┌───────────────────────────────────────────────────┐ │   │
│  │  │ ≡  👤 Ahmet Y.        ⭐⭐⭐⭐⭐  ✅ Aktif  [✏️][🗑] │ │   │
│  │  │    "Harika bir deneyimdi, kesinlikle..."          │ │   │
│  │  └───────────────────────────────────────────────────┘ │   │
│  │  ┌───────────────────────────────────────────────────┐ │   │
│  │  │ ≡  👤 Fatma K.        ⭐⭐⭐⭐⭐  ✅ Aktif  [✏️][🗑] │ │   │
│  │  │    "Profesyonel ekip, temiz ortam..."             │ │   │
│  │  └───────────────────────────────────────────────────┘ │   │
│  │  ┌───────────────────────────────────────────────────┐ │   │
│  │  │ ≡  👤 Mehmet S.       ⭐⭐⭐⭐    ❌ Gizli  [✏️][🗑] │ │   │
│  │  │    "İyi hizmet ama bekleme süresi..."             │ │   │
│  │  └───────────────────────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [💾 Kaydet]                                                    │
└─────────────────────────────────────────────────────────────────┘
```

### 2.4 Yorum Ekleme Modal

```
┌─────────────────────────────────────────────────────────┐
│  ➕ Yeni Google Yorumu Ekle                      [✕]   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  İsim:                                                  │
│  [Ahmet Yılmaz                                    ]    │
│                                                         │
│  Puan:                                                  │
│  [⭐] [⭐] [⭐] [⭐] [⭐]  ← Tıkla                       │
│                                                         │
│  Yorum:                                                 │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Mükemmel bir deneyimdi. Personel çok           │   │
│  │ ilgili ve profesyonel. Kesinlikle tavsiye      │   │
│  │ ederim!                                         │   │
│  └─────────────────────────────────────────────────┘   │
│                                                         │
│  Tarih:                                                 │
│  [2024-01-15                                      ]    │
│                                                         │
│  Avatar (opsiyonel):                                   │
│  [URL veya yükle...                               ]    │
│                                                         │
│  [✓] Doğrulanmış Yorum                                 │
│  [✓] Aktif (Sitede Göster)                             │
│                                                         │
│              [İptal]  [💾 Kaydet]                       │
└─────────────────────────────────────────────────────────┘
```

### 2.5 Frontend Bileşeni

**Konum:** `src/components/sections/GoogleReviewsSection.tsx`

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│           ⭐ GOOGLE'DA BİZİ DEĞERLENDİRİN                      │
│              500+ mutlu müşteriye katılın                       │
│                                                                 │
│     ┌────────────┐                                              │
│     │  ⭐ 4.9    │  523 Değerlendirme                          │
│     │  Google    │                                              │
│     └────────────┘                                              │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │  👤 Ahmet   │  │  👤 Fatma   │  │  👤 Ali     │             │
│  │  ⭐⭐⭐⭐⭐   │  │  ⭐⭐⭐⭐⭐   │  │  ⭐⭐⭐⭐⭐   │             │
│  │  "Harika    │  │  "Çok       │  │  "Profesyo- │             │
│  │  deneyim,   │  │  memnun     │  │  nel ekip,  │             │
│  │  kesinlikle │  │  kaldım..." │  │  temiz..."  │             │
│  │  tavsiye.." │  │             │  │             │             │
│  │  📅 2 gün   │  │  📅 1 hafta │  │  📅 2 hafta │             │
│  └─────────────┘  └─────────────┘  └─────────────┘             │
│                                                                 │
│               ○ ○ ● ○ ○  (carousel dots)                       │
│                                                                 │
│         [🔗 Tüm Google Yorumlarını Gör →]                      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## BÖLÜM 3: Dosya Yapısı

```
src/
├── app/
│   ├── admin/
│   │   ├── sections/                    # YENİ: Bölüm sıralama
│   │   │   ├── page.tsx
│   │   │   └── components/
│   │   │       ├── types.ts
│   │   │       ├── SectionList.tsx
│   │   │       └── SectionItem.tsx
│   │   │
│   │   └── reviews/                     # YENİ: Yorum yönetimi
│   │       ├── page.tsx
│   │       └── components/
│   │           ├── types.ts
│   │           ├── constants.ts
│   │           ├── ReviewList.tsx
│   │           ├── ReviewItem.tsx
│   │           ├── ReviewForm.tsx
│   │           ├── ReviewSettings.tsx
│   │           └── index.ts
│   │
│   ├── api/
│   │   ├── sections/                    # YENİ
│   │   │   ├── route.ts                 # GET, POST
│   │   │   └── reorder/
│   │   │       └── route.ts             # PUT
│   │   │
│   │   └── reviews/                     # YENİ
│   │       ├── route.ts                 # GET, POST
│   │       ├── [id]/
│   │       │   └── route.ts             # PUT, DELETE
│   │       └── reorder/
│   │           └── route.ts             # PUT
│   │
│   └── page.tsx                         # GÜNCELLE: Dinamik render
│
├── components/
│   └── sections/
│       └── GoogleReviewsSection.tsx     # YENİ
│
└── supabase/
    └── migrations/
        ├── 004_section_ordering.sql     # YENİ
        └── 005_google_reviews.sql       # YENİ
```

---

## BÖLÜM 4: Uygulama Adımları

### Faz 1: Veritabanı (30 dk)
1. [ ] `homepage_sections` tablosu oluştur
2. [ ] `google_reviews` tablosu oluştur
3. [ ] Varsayılan verileri ekle
4. [ ] RLS politikalarını ayarla

### Faz 2: API Endpoints (1 saat)
5. [ ] `/api/sections` - GET, POST
6. [ ] `/api/sections/reorder` - PUT
7. [ ] `/api/reviews` - GET, POST
8. [ ] `/api/reviews/[id]` - PUT, DELETE
9. [ ] `/api/reviews/reorder` - PUT

### Faz 3: Admin Panel - Bölümler (1.5 saat)
10. [ ] `admin/sections/page.tsx` oluştur
11. [ ] Sürükle-bırak sıralama
12. [ ] Toggle aç/kapa
13. [ ] Kaydet/İptal işlevleri

### Faz 4: Admin Panel - Yorumlar (2 saat)
14. [ ] `admin/reviews/page.tsx` oluştur
15. [ ] Tab yapısı (Ayarlar, Yorumlar, Görünüm)
16. [ ] Yorum listesi ve sıralama
17. [ ] Yorum ekleme/düzenleme modal
18. [ ] Puan filtresi ayarları
19. [ ] Görünüm ayarları

### Faz 5: Frontend (1.5 saat)
20. [ ] `GoogleReviewsSection.tsx` bileşeni
21. [ ] Carousel/slider işlevi
22. [ ] Responsive tasarım
23. [ ] Google badge ve istatistikler

### Faz 6: Homepage Entegrasyonu (1 saat)
24. [ ] `page.tsx` dinamik render
25. [ ] Section order fetch
26. [ ] Conditional rendering
27. [ ] Loading states

### Faz 7: Test ve Polish (30 dk)
28. [ ] Build test
29. [ ] Responsive test
30. [ ] Edge case handling

---

## BÖLÜM 5: Enterprise Özellikler

### Bölüm Sıralama
- ✅ Sürükle-bırak sıralama
- ✅ Bölüm aç/kapa
- ✅ Anlık önizleme
- ✅ Değişiklik takibi
- ✅ Geri alma

### Google Yorumları
- ✅ Manuel yorum girişi
- ✅ Puana göre filtreleme (1-5 yıldız)
- ✅ Yorum sıralama
- ✅ Aktif/pasif yönetimi
- ✅ Ortalama puan hesaplama
- ✅ Carousel/slider görünüm
- ✅ Google badge
- ✅ CTA butonu (Google'a yönlendirme)
- ✅ Responsive tasarım
- ✅ Stil özelleştirme

---

## Onay Bekleniyor

Bu plan onaylandığında implementasyona başlanacaktır.
