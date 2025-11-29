-- =====================================================
-- HOMEPAGE SECTIONS TABLE (Dynamic Section Ordering)
-- =====================================================
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

-- Index for ordering
CREATE INDEX IF NOT EXISTS idx_homepage_sections_position ON homepage_sections(position);
CREATE INDEX IF NOT EXISTS idx_homepage_sections_enabled ON homepage_sections(enabled);

-- Trigger for updated_at
CREATE TRIGGER update_homepage_sections_updated_at
  BEFORE UPDATE ON homepage_sections
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON homepage_sections FOR SELECT USING (true);
CREATE POLICY "Service role full access" ON homepage_sections FOR ALL USING (true);

-- Seed default sections
INSERT INTO homepage_sections (section_key, section_name, section_icon, position, enabled) VALUES
  ('landing-hero', 'Landing Hero', '🎯', 1, true),
  ('hero', 'Hero Section', '🏠', 2, true),
  ('services', 'Hizmetler', '🏥', 3, true),
  ('google-reviews', 'Google Yorumları', '⭐', 4, true),
  ('testimonials', 'Müşteri Yorumları', '💬', 5, true),
  ('about', 'Hakkımızda', '👥', 6, true),
  ('contact', 'İletişim', '📞', 7, true)
ON CONFLICT (section_key) DO NOTHING;
