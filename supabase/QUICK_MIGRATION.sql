-- =====================================================
-- WELLNESSTAL QUICK MIGRATION
-- Homepage Sections + Google Reviews
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/rtudfkccbzbblfmeoyop/sql/new
-- =====================================================

-- 1. HOMEPAGE SECTIONS TABLE
CREATE TABLE IF NOT EXISTS homepage_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_key VARCHAR(50) UNIQUE NOT NULL,
  section_name VARCHAR(100) NOT NULL,
  section_icon VARCHAR(10),
  position INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. GOOGLE REVIEWS TABLE
CREATE TABLE IF NOT EXISTS google_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reviewer_name VARCHAR(100) NOT NULL,
  reviewer_avatar TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT NOT NULL,
  review_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  source VARCHAR(50) DEFAULT 'google',
  verified BOOLEAN DEFAULT true,
  active BOOLEAN DEFAULT true,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_homepage_sections_position ON homepage_sections(position);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_enabled ON homepage_sections(enabled);
CREATE INDEX IF NOT EXISTS idx_google_reviews_active ON google_reviews(active);
CREATE INDEX IF NOT EXISTS idx_google_reviews_rating ON google_reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_google_reviews_position ON google_reviews(position);

-- 4. RLS POLICIES
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Public read access" ON homepage_sections;
DROP POLICY IF EXISTS "Service role full access" ON homepage_sections;
DROP POLICY IF EXISTS "Public read access" ON google_reviews;
DROP POLICY IF EXISTS "Service role full access" ON google_reviews;

-- Create policies
CREATE POLICY "Public read access" ON homepage_sections FOR SELECT USING (true);
CREATE POLICY "Service role full access" ON homepage_sections FOR ALL USING (true);
CREATE POLICY "Public read access" ON google_reviews FOR SELECT USING (active = true);
CREATE POLICY "Service role full access" ON google_reviews FOR ALL USING (true);

-- 5. SEED HOMEPAGE SECTIONS
INSERT INTO homepage_sections (section_key, section_name, section_icon, position, enabled) VALUES
  ('landing-hero', 'Landing Hero', '🎯', 1, true),
  ('hero', 'Hero Section', '🏠', 2, true),
  ('services', 'Hizmetler', '🏥', 3, true),
  ('google-reviews', 'Google Yorumları', '⭐', 4, true),
  ('testimonials', 'Müşteri Yorumları', '💬', 5, true),
  ('about', 'Hakkımızda', '👥', 6, true),
  ('contact', 'İletişim', '📞', 7, true)
ON CONFLICT (section_key) DO NOTHING;

-- 6. SEED GOOGLE REVIEWS
INSERT INTO google_reviews (reviewer_name, rating, review_text, review_date, verified, active, position) VALUES
  ('Ahmet Y.', 5, 'Harika bir deneyimdi! Personel çok ilgili ve profesyonel. Kesinlikle tavsiye ederim.', NOW() - INTERVAL '2 days', true, true, 1),
  ('Fatma K.', 5, 'Çok memnun kaldım. Temiz ortam, güler yüzlü ekip. Tekrar geleceğim.', NOW() - INTERVAL '5 days', true, true, 2),
  ('Mehmet S.', 5, 'Profesyonel hizmet, uygun fiyat. 5 yıldızı hak ediyorlar.', NOW() - INTERVAL '1 week', true, true, 3),
  ('Ayşe D.', 4, 'Genel olarak memnunum. Randevu sistemi çok pratik.', NOW() - INTERVAL '2 weeks', true, true, 4),
  ('Ali R.', 5, 'Beklentilerimin üzerinde bir hizmet aldım. Teşekkürler!', NOW() - INTERVAL '3 weeks', true, true, 5),
  ('Zeynep T.', 5, 'Uzman kadro ve modern ekipmanlar. Güvenle tercih edebilirsiniz.', NOW() - INTERVAL '1 month', true, true, 6)
ON CONFLICT DO NOTHING;

-- 7. GOOGLE REVIEWS SECTION SETTINGS
INSERT INTO content (section, title, description, content, defaults)
VALUES (
  'google-reviews-section',
  'Google Yorumları',
  'Google yorumları bölümü ayarları',
  '{
    "badge": "Google Yorumları",
    "sectionTitle": "Müşterilerimiz",
    "highlightedText": "Ne Diyor?",
    "description": "Google üzerinden bizi değerlendiren müşterilerimizin yorumları",
    "displayCount": 6,
    "minRating": 4,
    "showAverageRating": true,
    "averageRating": 4.9,
    "totalReviewCount": 127,
    "autoSlideDelay": 5000,
    "showVerifiedBadge": true,
    "showGoogleBadge": true,
    "googleBusinessUrl": "",
    "cta": {
      "title": "Siz de değerlendirin!",
      "description": "Deneyiminizi paylaşın",
      "buttonText": "Google''da Değerlendir",
      "buttonUrl": ""
    },
    "styles": {
      "badgeColor": "#4285F4",
      "starColor": "#FBBC04",
      "backgroundColor": "#FFFFFF",
      "cardBackgroundColor": "#F9FAFB"
    }
  }',
  '{
    "badge": "Google Yorumları",
    "sectionTitle": "Müşterilerimiz",
    "highlightedText": "Ne Diyor?",
    "description": "Google üzerinden bizi değerlendiren müşterilerimizin yorumları",
    "displayCount": 6,
    "minRating": 4,
    "showAverageRating": true,
    "averageRating": 4.9,
    "totalReviewCount": 127,
    "autoSlideDelay": 5000,
    "showVerifiedBadge": true,
    "showGoogleBadge": true,
    "googleBusinessUrl": "",
    "cta": {
      "title": "Siz de değerlendirin!",
      "description": "Deneyiminizi paylaşın",
      "buttonText": "Google''da Değerlendir",
      "buttonUrl": ""
    },
    "styles": {
      "badgeColor": "#4285F4",
      "starColor": "#FBBC04",
      "backgroundColor": "#FFFFFF",
      "cardBackgroundColor": "#F9FAFB"
    }
  }'
)
ON CONFLICT (section) DO NOTHING;

-- Done!
SELECT 'Migration completed successfully!' as status;
