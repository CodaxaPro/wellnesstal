-- =============================================
-- SEO BLOCK TYPE
-- Enterprise SEO Management Block
-- The Ultimate SEO Solution for Pages
-- =============================================

INSERT INTO block_types (id, name, description, icon, category, default_content, sort_order) VALUES
('seo', 'SEO', 'Sayfa SEO ayarlari - meta etiketler, Open Graph, Twitter Cards, JSON-LD Schema ve daha fazlasi', 'magnifying-glass', 'technical',
  '{
    "useGlobalSEO": false,
    "title": "",
    "titleTemplate": "%s | Wellnesstal",
    "description": "",
    "keywords": [],
    "author": "Wellnesstal",
    "canonicalUrl": "",
    "robots": {
      "index": true,
      "follow": true,
      "noarchive": false,
      "nosnippet": false,
      "noimageindex": false,
      "maxSnippet": -1,
      "maxImagePreview": "large",
      "maxVideoPreview": -1
    },
    "openGraph": {
      "enabled": true,
      "type": "website",
      "siteName": "Wellnesstal",
      "locale": "de_DE"
    },
    "twitter": {
      "enabled": true,
      "cardType": "summary_large_image"
    },
    "schema": {
      "localBusiness": {
        "enabled": true,
        "@type": "DaySpa",
        "name": "Wellnesstal",
        "description": "Ihre Oase der Entspannung im Herzen von Koeln. Professionelle Wellness-Behandlungen fuer Koerper und Seele.",
        "priceRange": "EUR",
        "currenciesAccepted": "EUR"
      },
      "organization": {
        "enabled": false,
        "@type": "Organization",
        "name": "Wellnesstal"
      },
      "webPage": {
        "enabled": true,
        "@type": "WebPage"
      },
      "breadcrumb": {
        "enabled": true,
        "autoGenerate": true
      }
    },
    "sitemap": {
      "include": true,
      "priority": 0.8,
      "changeFrequency": "weekly"
    }
  }'::jsonb,
  20
)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon,
  category = EXCLUDED.category,
  default_content = EXCLUDED.default_content,
  sort_order = EXCLUDED.sort_order;

-- =============================================
-- GLOBAL SEO SETTINGS (in site_content table)
-- =============================================

INSERT INTO site_content (section, content) VALUES
('seo-settings', '{
  "siteName": "Wellnesstal",
  "siteUrl": "https://wellnesstal.de",
  "defaultLanguage": "de",
  "separator": " | ",
  "defaultImage": "",
  "twitterHandle": "@wellnesstal",
  "facebookAppId": "",
  "googleSiteVerification": "",
  "bingSiteVerification": "",
  "defaultDescription": "Ihre Oase der Entspannung im Herzen von Koeln. Professionelle Wellness-Behandlungen fuer Koerper und Seele.",
  "defaultKeywords": ["wellness", "spa", "massage", "entspannung", "koeln", "beauty", "gesundheit"],
  "defaultSchema": {
    "type": "LocalBusiness",
    "businessType": "DaySpa",
    "name": "Wellnesstal",
    "priceRange": "EUR"
  }
}'::jsonb)
ON CONFLICT (section) DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = NOW();

-- Add comment
COMMENT ON COLUMN site_content.section IS 'seo-settings: Global SEO ayarlari - site geneli varsayilan degerler';
