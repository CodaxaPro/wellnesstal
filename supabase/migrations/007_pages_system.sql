-- =============================================
-- ENTERPRISE PAGE SYSTEM
-- Modular block-based page management
-- =============================================

-- Pages table
CREATE TABLE IF NOT EXISTS pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  template VARCHAR(50) DEFAULT 'default',

  -- SEO fields
  meta_title VARCHAR(255),
  meta_description TEXT,
  meta_keywords TEXT[],
  og_image VARCHAR(500),
  canonical_url VARCHAR(500),
  no_index BOOLEAN DEFAULT FALSE,
  no_follow BOOLEAN DEFAULT FALSE,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  published_at TIMESTAMP WITH TIME ZONE,

  -- Author tracking
  created_by VARCHAR(255),
  updated_by VARCHAR(255)
);

-- Page blocks table
CREATE TABLE IF NOT EXISTS page_blocks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_id UUID NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  block_type VARCHAR(50) NOT NULL,

  -- Block content (flexible JSON structure)
  content JSONB DEFAULT '{}',

  -- Block settings
  position INTEGER DEFAULT 0,
  visible BOOLEAN DEFAULT TRUE,

  -- Styling overrides
  custom_styles JSONB DEFAULT '{}',

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Block types reference table (for admin UI)
CREATE TABLE IF NOT EXISTS block_types (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon VARCHAR(50),
  category VARCHAR(50) DEFAULT 'content',
  default_content JSONB DEFAULT '{}',
  schema JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0
);

-- Insert default block types
INSERT INTO block_types (id, name, description, icon, category, default_content, sort_order) VALUES
('hero', 'Hero Banner', 'Full-width hero section with title, subtitle, image and CTA', 'photo', 'header',
  '{"title": "Başlık", "subtitle": "Alt başlık", "image": "", "ctaText": "Detaylı Bilgi", "ctaLink": "#", "backgroundType": "image"}', 1),

('text', 'Metin Bloğu', 'Rich text content section', 'align-left', 'content',
  '{"title": "Bölüm Başlığı", "content": "İçerik metni buraya gelecek...", "alignment": "left"}', 2),

('features', 'Özellikler', 'Feature cards in grid layout', 'grid-3x3', 'content',
  '{"title": "Özelliklerimiz", "features": [{"title": "Özellik 1", "description": "Açıklama", "icon": "star"}]}', 3),

('gallery', 'Galeri', 'Image gallery with lightbox', 'images', 'media',
  '{"title": "Galeri", "images": [], "columns": 3}', 4),

('services', 'Hizmetler', 'Service cards with pricing', 'briefcase', 'content',
  '{"title": "Hizmetlerimiz", "services": [], "showPrices": true, "layout": "grid"}', 5),

('pricing', 'Fiyat Tablosu', 'Pricing table with packages', 'currency-euro', 'content',
  '{"title": "Fiyatlarımız", "packages": []}', 6),

('testimonials', 'Müşteri Yorumları', 'Customer testimonials carousel', 'chat-bubble', 'social',
  '{"title": "Müşteri Yorumları", "testimonials": []}', 7),

('contact', 'İletişim', 'Contact form and information', 'envelope', 'forms',
  '{"title": "İletişim", "showForm": true, "showMap": false, "showInfo": true}', 8),

('cta', 'Call to Action', 'CTA banner with button', 'megaphone', 'conversion',
  '{"title": "Harekete Geçin", "subtitle": "Hemen randevu alın", "buttonText": "Randevu Al", "buttonLink": "#", "backgroundColor": "sage"}', 9),

('faq', 'SSS', 'Frequently asked questions accordion', 'question-mark-circle', 'content',
  '{"title": "Sıkça Sorulan Sorular", "items": [{"question": "Soru?", "answer": "Cevap"}]}', 10),

('video', 'Video', 'Embedded video section', 'play', 'media',
  '{"title": "Video", "videoUrl": "", "provider": "youtube"}', 11),

('team', 'Ekip', 'Team members grid', 'users', 'content',
  '{"title": "Ekibimiz", "members": []}', 12),

('stats', 'İstatistikler', 'Statistics/numbers showcase', 'chart-bar', 'content',
  '{"title": "", "stats": [{"value": "100+", "label": "Mutlu Müşteri"}]}', 13),

('divider', 'Ayırıcı', 'Visual divider/spacer', 'minus', 'layout',
  '{"height": 60, "showLine": false}', 14)

ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  default_content = EXCLUDED.default_content;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_page_blocks_page_id ON page_blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_page_blocks_position ON page_blocks(page_id, position);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers
DROP TRIGGER IF EXISTS update_pages_updated_at ON pages;
CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_page_blocks_updated_at ON page_blocks;
CREATE TRIGGER update_page_blocks_updated_at
  BEFORE UPDATE ON page_blocks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE block_types ENABLE ROW LEVEL SECURITY;

-- Policies: Public can read published pages
CREATE POLICY "Public can read published pages" ON pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read blocks of published pages" ON page_blocks
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM pages WHERE pages.id = page_blocks.page_id AND pages.status = 'published')
  );

CREATE POLICY "Public can read block types" ON block_types
  FOR SELECT USING (is_active = TRUE);

-- Policies: Authenticated users can manage all
CREATE POLICY "Authenticated users can manage pages" ON pages
  FOR ALL USING (TRUE);

CREATE POLICY "Authenticated users can manage page blocks" ON page_blocks
  FOR ALL USING (TRUE);

-- Insert sample page
INSERT INTO pages (slug, title, status, meta_title, meta_description, template) VALUES
('masaj-terapi', 'Masaj Terapi', 'published', 'Masaj Terapi | Wellnesstal', 'Profesyonel masaj terapi hizmetleri', 'service')
ON CONFLICT (slug) DO NOTHING;

-- Get the page ID and insert sample blocks
DO $$
DECLARE
  page_uuid UUID;
BEGIN
  SELECT id INTO page_uuid FROM pages WHERE slug = 'masaj-terapi';

  IF page_uuid IS NOT NULL THEN
    -- Hero block
    INSERT INTO page_blocks (page_id, block_type, content, position) VALUES
    (page_uuid, 'hero', '{
      "title": "Masaj Terapi",
      "subtitle": "Profesyonel masaj hizmetleri ile kendinizi yenileyin",
      "image": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1200",
      "ctaText": "Randevu Al",
      "ctaLink": "tel:+4922112345678",
      "backgroundType": "image"
    }', 0)
    ON CONFLICT DO NOTHING;

    -- Text block
    INSERT INTO page_blocks (page_id, block_type, content, position) VALUES
    (page_uuid, 'text', '{
      "title": "Masaj Terapinin Faydaları",
      "content": "Masaj terapi, kas gerginliğini azaltır, kan dolaşımını iyileştirir ve stres seviyelerini düşürür. Uzman terapistlerimiz size özel bir deneyim sunmaktadır.",
      "alignment": "center"
    }', 1)
    ON CONFLICT DO NOTHING;

    -- Features block
    INSERT INTO page_blocks (page_id, block_type, content, position) VALUES
    (page_uuid, 'features', '{
      "title": "Neden Bizi Seçmelisiniz?",
      "features": [
        {"title": "Uzman Terapistler", "description": "Sertifikalı ve deneyimli ekip", "icon": "star"},
        {"title": "Doğal Ürünler", "description": "Organik yağlar ve kremler", "icon": "leaf"},
        {"title": "Rahat Ortam", "description": "Huzurlu ve hijyenik mekan", "icon": "home"},
        {"title": "Esnek Saatler", "description": "Size uygun randevu imkanı", "icon": "clock"}
      ]
    }', 2)
    ON CONFLICT DO NOTHING;

    -- CTA block
    INSERT INTO page_blocks (page_id, block_type, content, position) VALUES
    (page_uuid, 'cta', '{
      "title": "Hemen Randevu Alın",
      "subtitle": "İlk seansınızda %20 indirim fırsatı",
      "buttonText": "Randevu Al",
      "buttonLink": "tel:+4922112345678",
      "backgroundColor": "sage"
    }', 3)
    ON CONFLICT DO NOTHING;
  END IF;
END $$;
