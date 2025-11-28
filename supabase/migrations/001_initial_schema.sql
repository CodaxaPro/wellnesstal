-- Wellnesstal Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- ADMIN USERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CATEGORIES TABLE
-- =====================================================
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

-- =====================================================
-- SERVICES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price DECIMAL(10, 2),
  duration INTEGER, -- in minutes
  image TEXT,
  active BOOLEAN DEFAULT true,
  order_num INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- CONTENT TABLE (for dynamic page content)
-- =====================================================
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

-- =====================================================
-- PAGES TABLE
-- =====================================================
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

-- =====================================================
-- TESTIMONIALS TABLE
-- =====================================================
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

-- =====================================================
-- INDEXES for better performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(order_num);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(active);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_order ON services(order_num);
CREATE INDEX IF NOT EXISTS idx_content_section ON content(section);
CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status);
CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);

-- =====================================================
-- TRIGGERS for updated_at
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at
  BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_pages_updated_at
  BEFORE UPDATE ON pages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: Update category service count
-- =====================================================
CREATE OR REPLACE FUNCTION update_category_service_count()
RETURNS TRIGGER AS $$
BEGIN
  -- On INSERT
  IF TG_OP = 'INSERT' AND NEW.category_id IS NOT NULL THEN
    UPDATE categories SET service_count = service_count + 1 WHERE id = NEW.category_id;
  END IF;

  -- On DELETE
  IF TG_OP = 'DELETE' AND OLD.category_id IS NOT NULL THEN
    UPDATE categories SET service_count = service_count - 1 WHERE id = OLD.category_id;
  END IF;

  -- On UPDATE (category changed)
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

CREATE TRIGGER trigger_update_category_service_count
  AFTER INSERT OR UPDATE OR DELETE ON services
  FOR EACH ROW EXECUTE FUNCTION update_category_service_count();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE content ENABLE ROW LEVEL SECURITY;
ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Public read access for content, categories, services, testimonials
CREATE POLICY "Public read access" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read access" ON services FOR SELECT USING (true);
CREATE POLICY "Public read access" ON content FOR SELECT USING (true);
CREATE POLICY "Public read access" ON testimonials FOR SELECT USING (active = true);
CREATE POLICY "Public read access" ON pages FOR SELECT USING (status = 'published');

-- Authenticated write access (using service role key bypasses RLS)
CREATE POLICY "Service role full access" ON categories FOR ALL USING (true);
CREATE POLICY "Service role full access" ON services FOR ALL USING (true);
CREATE POLICY "Service role full access" ON content FOR ALL USING (true);
CREATE POLICY "Service role full access" ON pages FOR ALL USING (true);
CREATE POLICY "Service role full access" ON testimonials FOR ALL USING (true);
CREATE POLICY "Service role full access" ON admin_users FOR ALL USING (true);
