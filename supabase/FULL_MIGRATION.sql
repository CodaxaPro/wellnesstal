-- =====================================================
-- WELLNESSTAL - FULL DATABASE MIGRATION
-- Supabase SQL Editor'da çalıştırın
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. TABLOLAR
-- =====================================================

-- Admin Users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  slug VARCHAR(100) UNIQUE NOT NULL,
  color VARCHAR(20) DEFAULT '#10B981',
  icon VARCHAR(10),
  order_num INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  service_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Services
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10, 2),
  duration INTEGER,
  image TEXT,
  active BOOLEAN DEFAULT true,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content
CREATE TABLE IF NOT EXISTS content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(200),
  description TEXT,
  content JSONB NOT NULL DEFAULT '{}',
  defaults JSONB,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_by VARCHAR(100) DEFAULT 'Admin'
);

-- Pages
CREATE TABLE IF NOT EXISTS pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  template_type VARCHAR(50) DEFAULT 'custom',
  meta_description TEXT,
  status VARCHAR(20) DEFAULT 'draft',
  content JSONB DEFAULT '{}',
  seo JSONB DEFAULT '{}',
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  service VARCHAR(200),
  avatar TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Homepage Sections (Dynamic Section Ordering)
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

-- Google Reviews
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

-- =====================================================
-- 2. INDEXES
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_num);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_num);
CREATE INDEX IF NOT EXISTS idx_content_section ON content(section);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_position ON homepage_sections(position);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_enabled ON homepage_sections(enabled);
CREATE INDEX IF NOT EXISTS idx_google_reviews_active ON google_reviews(active);
CREATE INDEX IF NOT EXISTS idx_google_reviews_rating ON google_reviews(rating DESC);
CREATE INDEX IF NOT EXISTS idx_google_reviews_position ON google_reviews(position);

-- =====================================================
-- 3. TRIGGERS
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_services_updated_at ON services;
CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_homepage_sections_updated_at ON homepage_sections;
CREATE TRIGGER update_homepage_sections_updated_at
  BEFORE UPDATE ON homepage_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_google_reviews_updated_at ON google_reviews;
CREATE TRIGGER update_google_reviews_updated_at
  BEFORE UPDATE ON google_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Service count trigger
CREATE OR REPLACE FUNCTION update_category_service_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.category_id IS NOT NULL THEN
    UPDATE categories SET service_count = service_count + 1 WHERE id = NEW.category_id;
  END IF;
  IF TG_OP = 'DELETE' AND OLD.category_id IS NOT NULL THEN
    UPDATE categories SET service_count = service_count - 1 WHERE id = OLD.category_id;
  END IF;
  IF TG_OP = 'UPDATE' THEN
    IF OLD.category_id IS DISTINCT FROM NEW.category_id THEN
      IF OLD.category_id IS NOT NULL THEN
        UPDATE categories SET service_count = service_count - 1 WHERE id = OLD.category_id;
      END IF;
      IF NEW.category_id IS NOT NULL THEN
        UPDATE categories SET service_count = service_count + 1 WHERE id = NEW.category_id;
      END IF;
    END IF;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_update_category_service_count ON services;
CREATE TRIGGER trigger_update_category_service_count
  AFTER INSERT OR UPDATE OR DELETE ON services
  FOR EACH ROW EXECUTE FUNCTION update_category_service_count();

-- =====================================================
-- 4. ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access" ON categories;
DROP POLICY IF EXISTS "Public read access" ON services;
DROP POLICY IF EXISTS "Public read access" ON content;
DROP POLICY IF EXISTS "Public read access" ON testimonials;
DROP POLICY IF EXISTS "Public read access" ON pages;
DROP POLICY IF EXISTS "Service role full access" ON categories;
DROP POLICY IF EXISTS "Service role full access" ON services;
DROP POLICY IF EXISTS "Service role full access" ON content;
DROP POLICY IF EXISTS "Service role full access" ON pages;
DROP POLICY IF EXISTS "Service role full access" ON testimonials;
DROP POLICY IF EXISTS "Service role full access" ON admin_users;
DROP POLICY IF EXISTS "Public read access" ON homepage_sections;
DROP POLICY IF EXISTS "Service role full access" ON homepage_sections;
DROP POLICY IF EXISTS "Public read access" ON google_reviews;
DROP POLICY IF EXISTS "Service role full access" ON google_reviews;

-- Create policies
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON services FOR SELECT USING (true);
CREATE POLICY "Public read access" ON content FOR SELECT USING (true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON pages FOR SELECT USING (status = 'published');

CREATE POLICY "Service role full access" ON categories FOR ALL USING (true);
CREATE POLICY "Service role full access" ON services FOR ALL USING (true);
CREATE POLICY "Service role full access" ON content FOR ALL USING (true);
CREATE POLICY "Service role full access" ON pages FOR ALL USING (true);
CREATE POLICY "Service role full access" ON testimonials FOR ALL USING (true);
CREATE POLICY "Service role full access" ON admin_users FOR ALL USING (true);
CREATE POLICY "Public read access" ON homepage_sections FOR SELECT USING (true);
CREATE POLICY "Service role full access" ON homepage_sections FOR ALL USING (true);
CREATE POLICY "Public read access" ON google_reviews FOR SELECT USING (active = true);
CREATE POLICY "Service role full access" ON google_reviews FOR ALL USING (true);

-- =====================================================
-- 5. SEED DATA - Admin User
-- =====================================================
INSERT INTO admin_users (username, email, password_hash, role)
VALUES (
  'admin',
  'admin@wellnesstal.de',
  '$2b$10$rOzJqQZQZQZQZQZQZQZQZOeKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq',
  'admin'
) ON CONFLICT (username) DO NOTHING;

-- =====================================================
-- 6. SEED DATA - Categories
-- =====================================================
INSERT INTO categories (name, description, slug, color, icon, order_num, active, service_count)
VALUES
  ('Spa Tedavileri', 'Rahatlatıcı spa ve wellness tedavileri', 'spa-tedavileri', '#10B981', '🌿', 1, true, 1),
  ('Masaj Terapileri', 'Profesyonel masaj ve terapi hizmetleri', 'masaj-terapileri', '#059669', '💆', 2, true, 2),
  ('Güzellik Bakımı', 'Yüz ve vücut güzellik bakım hizmetleri', 'guzellik-bakimi', '#E11D48', '✨', 3, false, 1)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 7. SEED DATA - Services
-- =====================================================
INSERT INTO services (title, slug, description, short_description, category_id, price, duration, image, active, order_num)
VALUES
  (
    'Premium Head Spa',
    'premium-head-spa',
    'Luxuriöse Kopfhautbehandlung für ultimative Entspannung',
    'Entspannende Kopfhautbehandlung',
    (SELECT id FROM categories WHERE slug = 'spa-tedavileri'),
    89.00, 60,
    'https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800',
    true, 1
  ),
  (
    'Aromatherapie Massage',
    'aromatherapie-massage',
    'Ganzheitliche Massage mit ätherischen Ölen',
    'Massage mit ätherischen Ölen',
    (SELECT id FROM categories WHERE slug = 'masaj-terapileri'),
    75.00, 45,
    'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800',
    true, 2
  ),
  (
    'Hot Stone Therapie',
    'hot-stone-therapie',
    'Entspannende Wärmetherapie mit heißen Steinen',
    'Wärmetherapie mit heißen Steinen',
    (SELECT id FROM categories WHERE slug = 'masaj-terapileri'),
    95.00, 75,
    'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?w=800',
    true, 3
  ),
  (
    'Gesichtsbehandlung Deluxe',
    'gesichtsbehandlung-deluxe',
    'Premium Gesichtspflege für strahlende Haut',
    'Premium Gesichtspflege',
    (SELECT id FROM categories WHERE slug = 'guzellik-bakimi'),
    120.00, 90,
    'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800',
    false, 4
  )
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 8. SEED DATA - Testimonials
-- =====================================================
INSERT INTO testimonials (name, rating, comment, service, active)
VALUES
  ('Maria S.', 5, 'Fantastische Erfahrung! Das Head Spa war unglaublich entspannend.', 'Premium Head Spa', true),
  ('Thomas K.', 5, 'Die beste Massage, die ich je hatte. Sehr professionell!', 'Aromatherapie Massage', true),
  ('Anna M.', 4, 'Tolle Atmosphäre und freundliches Personal.', 'Hot Stone Therapie', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 9. SEED DATA - Content
-- =====================================================
INSERT INTO content (section, title, description, content, updated_by)
VALUES
  ('hero', 'Ana Sayfa Hero', 'Hero bölümü', '{"mainTitle": "Wellness & Entspannung in Baesweiler", "subtitle": "Entdecken Sie professionelle Headspa-Behandlungen", "badge": "🌿 Willkommen"}'::jsonb, 'Admin'),
  ('about', 'Über Uns', 'Hakkımızda', '{"title": "Ihre Wellness-Oase", "description": "Seit über 5 Jahren widmen wir uns Ihrem Wohlbefinden."}'::jsonb, 'Admin'),
  ('contact', 'Kontakt', 'İletişim', '{"phone": "+49 1733828581", "email": "info@wellnesstal.de"}'::jsonb, 'Admin'),
  ('footer', 'Footer', 'Alt bilgi', '{"copyright": "© 2025 Wellnesstal"}'::jsonb, 'Admin'),
  ('meta', 'SEO', 'Meta bilgileri', '{"siteTitle": "Wellnesstal - Premium Wellness"}'::jsonb, 'Admin')
ON CONFLICT (section) DO NOTHING;

-- =====================================================
-- 10. SEED DATA - Homepage Sections
-- =====================================================
INSERT INTO homepage_sections (section_key, section_name, section_icon, position, enabled) VALUES
  ('landing-hero', 'Landing Hero', '🎯', 1, true),
  ('hero', 'Hero Section', '🏠', 2, true),
  ('services', 'Hizmetler', '🏥', 3, true),
  ('google-reviews', 'Google Yorumları', '⭐', 4, true),
  ('testimonials', 'Müşteri Yorumları', '💬', 5, true),
  ('about', 'Hakkımızda', '👥', 6, true),
  ('contact', 'İletişim', '📞', 7, true)
ON CONFLICT (section_key) DO NOTHING;

-- =====================================================
-- 11. SEED DATA - Google Reviews
-- =====================================================
INSERT INTO google_reviews (reviewer_name, rating, review_text, review_date, verified, active, position) VALUES
  ('Ahmet Y.', 5, 'Harika bir deneyimdi! Personel çok ilgili ve profesyonel. Kesinlikle tavsiye ederim.', NOW() - INTERVAL '2 days', true, true, 1),
  ('Fatma K.', 5, 'Çok memnun kaldım. Temiz ortam, güler yüzlü ekip. Tekrar geleceğim.', NOW() - INTERVAL '5 days', true, true, 2),
  ('Mehmet S.', 5, 'Profesyonel hizmet, uygun fiyat. 5 yıldızı hak ediyorlar.', NOW() - INTERVAL '1 week', true, true, 3),
  ('Ayşe D.', 4, 'Genel olarak memnunum. Randevu sistemi çok pratik.', NOW() - INTERVAL '2 weeks', true, true, 4),
  ('Ali R.', 5, 'Beklentilerimin üzerinde bir hizmet aldım. Teşekkürler!', NOW() - INTERVAL '3 weeks', true, true, 5),
  ('Zeynep T.', 5, 'Uzman kadro ve modern ekipmanlar. Güvenle tercih edebilirsiniz.', NOW() - INTERVAL '1 month', true, true, 6)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 12. SEED DATA - Google Reviews Section Settings
-- =====================================================
INSERT INTO content (section, title, description, content, defaults, updated_by)
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
  }',
  'Admin'
)
ON CONFLICT (section) DO NOTHING;

-- =====================================================
-- DONE! ✅
-- =====================================================
SELECT 'Migration completed successfully!' as status;
