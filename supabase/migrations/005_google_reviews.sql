-- =====================================================
-- GOOGLE REVIEWS TABLE
-- =====================================================
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_google_reviews_active ON google_reviews(active);
CREATE INDEX IF NOT EXISTS idx_google_reviews_rating ON google_reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_google_reviews_position ON google_reviews(position);

-- Trigger for updated_at
CREATE TRIGGER update_google_reviews_updated_at
  BEFORE UPDATE ON google_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON google_reviews FOR SELECT USING (active = true);
CREATE POLICY "Service role full access" ON google_reviews FOR ALL USING (true);

-- =====================================================
-- GOOGLE REVIEWS SETTINGS (in content table)
-- =====================================================
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

-- Seed sample reviews
INSERT INTO google_reviews (reviewer_name, rating, review_text, review_date, verified, active, position) VALUES
  ('Ahmet Y.', 5, 'Harika bir deneyimdi! Personel çok ilgili ve profesyonel. Kesinlikle tavsiye ederim.', NOW() - INTERVAL '2 days', true, true, 1),
  ('Fatma K.', 5, 'Çok memnun kaldım. Temiz ortam, güler yüzlü ekip. Tekrar geleceğim.', NOW() - INTERVAL '5 days', true, true, 2),
  ('Mehmet S.', 5, 'Profesyonel hizmet, uygun fiyat. 5 yıldızı hak ediyorlar.', NOW() - INTERVAL '1 week', true, true, 3),
  ('Ayşe D.', 4, 'Genel olarak memnunum. Randevu sistemi çok pratik.', NOW() - INTERVAL '2 weeks', true, true, 4),
  ('Ali R.', 5, 'Beklentilerimin üzerinde bir hizmet aldım. Teşekkürler!', NOW() - INTERVAL '3 weeks', true, true, 5),
  ('Zeynep T.', 5, 'Uzman kadro ve modern ekipmanlar. Güvenle tercih edebilirsiniz.', NOW() - INTERVAL '1 month', true, true, 6)
ON CONFLICT DO NOTHING;
