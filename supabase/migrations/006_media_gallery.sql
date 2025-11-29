-- =====================================================
-- MEDIA GALLERY - Enterprise Media Management
-- =====================================================

-- Media Files Table
CREATE TABLE IF NOT EXISTS media_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  file_path TEXT NOT NULL,
  thumbnail_path TEXT,
  medium_path TEXT,
  large_path TEXT,
  file_size INTEGER NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  width INTEGER,
  height INTEGER,
  alt_text VARCHAR(500),
  category VARCHAR(100) DEFAULT 'general',
  tags TEXT[],
  blur_hash VARCHAR(100),
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Media Categories Table
CREATE TABLE IF NOT EXISTS media_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  icon VARCHAR(50) DEFAULT '📁',
  color VARCHAR(20) DEFAULT '#6B7280',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_files_category ON media_files(category);
CREATE INDEX IF NOT EXISTS idx_media_files_created_at ON media_files(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_files_is_featured ON media_files(is_featured);

-- Insert default categories
INSERT INTO media_categories (name, slug, icon, color, sort_order) VALUES
  ('Genel', 'general', '📁', '#6B7280', 1),
  ('Hero Görselleri', 'hero', '🖼️', '#3B82F6', 2),
  ('Hizmetler', 'services', '✨', '#10B981', 3),
  ('Ekip', 'team', '👥', '#8B5CF6', 4),
  ('Galeri', 'gallery', '📷', '#F59E0B', 5),
  ('Logo & Marka', 'branding', '🎨', '#EC4899', 6)
ON CONFLICT (slug) DO NOTHING;

-- Enable RLS
ALTER TABLE media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE media_categories ENABLE ROW LEVEL SECURITY;

-- Policies for public read access
CREATE POLICY "Public can view media files" ON media_files
  FOR SELECT USING (true);

CREATE POLICY "Public can view media categories" ON media_categories
  FOR SELECT USING (true);

-- Policies for authenticated write access
CREATE POLICY "Authenticated users can insert media" ON media_files
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Authenticated users can update media" ON media_files
  FOR UPDATE USING (true);

CREATE POLICY "Authenticated users can delete media" ON media_files
  FOR DELETE USING (true);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_media_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER media_files_updated_at
  BEFORE UPDATE ON media_files
  FOR EACH ROW
  EXECUTE FUNCTION update_media_updated_at();
