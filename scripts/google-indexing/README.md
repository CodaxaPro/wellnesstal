# Google Indexing — Rehber & Scriptler (Wellnesstal)

> **Önemli uyarı (Google politikası):** [Indexing API](https://developers.google.com/search/docs/indexing-api/overview) resmi olarak yalnızca **JobPosting** ve **BroadcastEvent** yapılandırılmış verisi olan sayfalar içindir. Head Spa landing sayfaları bu kapsamda değildir — API istekleri **reddedilebilir**, yok sayılabilir veya erişim iptal edilebilir.
>
> **Wellnesstal için birincil yöntem:** Sitemap (109 URL — GSC’ye gönderildi) + iç linkleme + organik tarama. Indexing API’yi denemeden önce `audit-seo.mjs` ile teknik engelleri temizleyin.

---

## 1. Risk ve engel kontrolleri

### 1.1 robots.txt — Disallow var mı?

**Manuel:**
```bash
curl -s https://www.wellnesstal.de/robots.txt
```

Beklenen (Wellnesstal):
```
User-Agent: *
Allow: /
Sitemap: https://www.wellnesstal.de/sitemap.xml
```

**Kontrol:** `Disallow:` satırı yoksa tüm sayfalar taranabilir. `Disallow: /headspa` gibi bir kural varsa o path indexlenmez.

**Otomatik (tüm urls.txt):**
```bash
cd scripts/google-indexing
node generate-urls.mjs   # urls.txt oluştur
node audit-seo.mjs       # robots + noindex + canonical
```

### 1.2 noindex — meta ve HTTP header

| Engel | Nerede | Nasıl test |
|-------|--------|------------|
| `<meta name="robots" content="noindex">` | HTML `<head>` | `audit-seo.mjs` veya aşağıdaki curl |
| `X-Robots-Tag: noindex` | HTTP response header | `curl -sI URL \| grep -i x-robots` |

**Tek URL:**
```bash
curl -sI "https://www.wellnesstal.de/headspa" | grep -i x-robots
curl -s "https://www.wellnesstal.de/headspa" | grep -i 'name="robots"'
```

**Toplu:** `node audit-seo.mjs` (109 URL, ~2 dk)

Wellnesstal durumu: `layout.tsx` → `robots: { index: true, follow: true }` — noindex yok.

### 1.3 Canonical (self-referencing)

Her sayfa kendi URL’sini canonical olarak işaretlemeli.

**Tek URL:**
```bash
curl -s "https://www.wellnesstal.de/headspa" | grep -i 'rel="canonical"'
```

Beklenen: `href="https://www.wellnesstal.de/headspa"`

**Toplu:** `audit-seo.mjs` canonical mismatch raporlar.

Wellnesstal: `pageMetadata()` → `alternates.canonical` ile ayarlı.

---

## 2. Google Cloud & Search Console

### 2.0 Search Console API (URL Inspection — zorunlu)

Indexing API ayrı; **dizine eklenmeyenleri okumak** için Search Console API gerekir:

1. Bu linke tıkla (proje `wellnesstal-indexing`):  
   https://console.developers.google.com/apis/api/searchconsole.googleapis.com/overview?project=1091329953734
2. **Enable** / **Etkinleştir**
3. Birkaç dakika bekle, sonra:

```bash
cd scripts/google-indexing
npm run gsc          # öncelikli URL’ler
npm run gsc:all      # tüm urls.txt
```

Service account zaten GSC Owner ise (Indexing API 200 dönüyorsa) ek adım gerekmez.

### 2.1 Google Cloud Console — Indexing API

1. [console.cloud.google.com](https://console.cloud.google.com) → **New Project** (ör. `wellnesstal-indexing`)
2. **APIs & Services → Library** → **Web Search Indexing API** → **Enable**
3. **APIs & Services → Credentials → Create Credentials → Service account**
   - Name: `indexing-wellnesstal`
   - Role: gerek yok (GSC ownership ayrı)
4. Service account satırı → **Keys → Add key → JSON** → indir
5. Dosyayı kaydet:
   ```
   scripts/google-indexing/service-account.json
   ```
   ⚠️ Bu dosyayı **asla git’e commit etmeyin** (`.gitignore`’da).

### 2.2 Search Console — Service Account’u Owner yap

1. [search.google.com/search-console](https://search.google.com/search-console)
2. Property: `https://www.wellnesstal.de`
3. **Settings → Users and permissions → Add user**
4. Service account e-postası (JSON içindeki `client_email`, örn. `indexing-wellnesstal@....iam.gserviceaccount.com`)
5. Permission: **Owner** (Indexing API için gerekli)

Doğrulama: birkaç dakika bekleyin, sonra dry-run:
```bash
cd scripts/google-indexing
npm install
npm run verify-gcp
npm run gsc
npm run index:dry
npm run index    # gerçek API (politika uyarısını okuyun)
```

---

## 3. Script kullanımı

```bash
cd scripts/google-indexing
npm install
node generate-urls.mjs    # 109 URL → urls.txt
node audit-seo.mjs        # önce SEO audit
DRY_RUN=1 node index.js   # API çağrısı yok, parse testi
node index.js             # Indexing API gönderimi (1.5s aralık)
```

**Ortam değişkenleri:**

| Değişken | Varsayılan | Açıklama |
|----------|------------|----------|
| `GOOGLE_SERVICE_ACCOUNT_KEY` | `./service-account.json` | JSON anahtar yolu |
| `URLS_FILE` | `./urls.txt` | URL listesi |
| `REQUEST_DELAY_MS` | `1500` | İstekler arası bekleme |
| `DRY_RUN` | — | `1` = API yok |

---

## 4. Wellnesstal önerilen sıra

1. ✅ Sitemap GSC’de (109 URL) — **yapıldı**
2. `node audit-seo.mjs` — teknik engel yok mu?
3. 3–7 gün GSC **Pages** raporunu izle
4. Indexing API — **yalnızca** Google reddetmezse / JobPosting sayfaları için
5. GSC **URL Inspection** → öncelikli 5–10 URL manuel “Request indexing” (günlük kota sınırlı)

---

## Dosyalar

| Dosya | Açıklama |
|-------|----------|
| `index.js` | Indexing API gönderici |
| `audit-seo.mjs` | robots / noindex / canonical audit |
| `generate-urls.mjs` | sitemap ile aynı 109 URL |
| `urls.txt` | URL listesi (generate ile üretilir) |
| `service-account.json` | Sizin ekleyeceğiniz GCP anahtarı (gitignore) |
