# 🚀 Page Categories Migration - Hemen Çalıştır

## Hızlı Yol (Supabase SQL Editor)

1. **Supabase Dashboard'a gidin:**
   - https://supabase.com/dashboard
   - Projenizi seçin

2. **SQL Editor'ı açın:**
   - Sol menüden **SQL Editor** tıklayın
   - **New Query** butonuna tıklayın

3. **Aşağıdaki SQL'i kopyalayıp yapıştırın:**

```sql
-- =============================================
-- PAGE CATEGORIES SYSTEM
-- Enterprise category management for pages
-- =============================================

-- Page categories table
CREATE TABLE IF NOT EXISTS page_categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  color VARCHAR(20) DEFAULT '#9CAF88',
  icon VARCHAR(50),
  order_num INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  page_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add category_id to pages table
ALTER TABLE pages 
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES page_categories(id) ON DELETE SET NULL;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_page_categories_slug ON page_categories(slug);
CREATE INDEX IF NOT EXISTS idx_page_categories_active ON page_categories(active);
CREATE INDEX IF NOT EXISTS idx_page_categories_order ON page_categories(order_num);
CREATE INDEX IF NOT EXISTS idx_pages_category_id ON pages(category_id);

-- Trigger for updated_at
DROP TRIGGER IF EXISTS update_page_categories_updated_at ON page_categories;
CREATE TRIGGER update_page_categories_updated_at
  BEFORE UPDATE ON page_categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to update page_count
CREATE OR REPLACE FUNCTION update_page_category_count()
RETURNS TRIGGER AS $$
BEGIN
  -- Update count when page is added
  IF TG_OP = 'INSERT' AND NEW.category_id IS NOT NULL THEN
    UPDATE page_categories 
    SET page_count = (
      SELECT COUNT(*) FROM pages WHERE category_id = NEW.category_id AND status != 'archived'
    )
    WHERE id = NEW.category_id;
  END IF;
  
  -- Update count when page is updated
  IF TG_OP = 'UPDATE' THEN
    -- Old category count
    IF OLD.category_id IS NOT NULL THEN
      UPDATE page_categories 
      SET page_count = (
        SELECT COUNT(*) FROM pages WHERE category_id = OLD.category_id AND status != 'archived'
      )
      WHERE id = OLD.category_id;
    END IF;
    
    -- New category count
    IF NEW.category_id IS NOT NULL AND NEW.category_id != OLD.category_id THEN
      UPDATE page_categories 
      SET page_count = (
        SELECT COUNT(*) FROM pages WHERE category_id = NEW.category_id AND status != 'archived'
      )
      WHERE id = NEW.category_id;
    END IF;
  END IF;
  
  -- Update count when page is deleted
  IF TG_OP = 'DELETE' AND OLD.category_id IS NOT NULL THEN
    UPDATE page_categories 
    SET page_count = (
      SELECT COUNT(*) FROM pages WHERE category_id = OLD.category_id AND status != 'archived'
    )
    WHERE id = OLD.category_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for page_count updates
DROP TRIGGER IF EXISTS update_page_category_count_on_insert ON pages;
CREATE TRIGGER update_page_category_count_on_insert
  AFTER INSERT ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_page_category_count();

DROP TRIGGER IF EXISTS update_page_category_count_on_update ON pages;
CREATE TRIGGER update_page_category_count_on_update
  AFTER UPDATE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_page_category_count();

DROP TRIGGER IF EXISTS update_page_category_count_on_delete ON pages;
CREATE TRIGGER update_page_category_count_on_delete
  AFTER DELETE ON pages
  FOR EACH ROW
  EXECUTE FUNCTION update_page_category_count();

-- RLS Policies
ALTER TABLE page_categories ENABLE ROW LEVEL SECURITY;

-- Public can read active categories
DROP POLICY IF EXISTS "Public can read active page categories" ON page_categories;
CREATE POLICY "Public can read active page categories" ON page_categories
  FOR SELECT USING (active = TRUE);

-- Authenticated users can manage all
DROP POLICY IF EXISTS "Authenticated users can manage page categories" ON page_categories;
CREATE POLICY "Authenticated users can manage page categories" ON page_categories
  FOR ALL USING (TRUE);

-- Seed default categories
INSERT INTO page_categories (name, slug, description, color, icon, order_num, active) VALUES
  ('Genel', 'genel', 'Genel sayfalar', '#9CAF88', '📄', 1, true),
  ('Hizmetler', 'hizmetler', 'Hizmet sayfaları', '#3b82f6', '💼', 2, true),
  ('Hakkında', 'hakkimizda', 'Hakkımızda sayfaları', '#10b981', '👥', 3, true),
  ('İletişim', 'iletisim', 'İletişim sayfaları', '#f59e0b', '📞', 4, true),
  ('Blog', 'blog', 'Blog yazıları', '#8b5cf6', '📝', 5, true),
  ('Landing', 'landing', 'Landing sayfaları', '#ec4899', '🎯', 6, true)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  color = EXCLUDED.color,
  icon = EXCLUDED.icon;
```

4. **Run butonuna tıklayın** (veya Cmd/Ctrl + Enter)

5. **Başarı mesajını bekleyin:**
   - "Success. No rows returned" veya benzer bir mesaj görmelisiniz

6. **Kontrol edin:**
   - Table Editor'da `page_categories` tablosunun göründüğünü kontrol edin
   - 6 varsayılan kategori eklendiğini kontrol edin

7. **Sayfayı yenileyin:**
   - Tarayıcıda F5'e basın
   - `/admin/pages` sayfasına gidin
   - Kategori özellikleri artık çalışacak! ✅

## Sorun Giderme

### "relation already exists" hatası
- Tablo zaten var, bu normal. Migration'ı tekrar çalıştırabilirsiniz.

### "function does not exist" hatası
- `update_updated_at_column` fonksiyonu eksik olabilir
- Önce `001_initial_schema.sql` migration'ını çalıştırın

### "permission denied" hatası
- Supabase projenizde admin yetkileriniz olduğundan emin olun

## Migration Başarılı Oldu mu?

Migration başarılı olduktan sonra:
- ✅ `page_categories` tablosu oluşturuldu
- ✅ `pages` tablosuna `category_id` kolonu eklendi
- ✅ 6 varsayılan kategori eklendi
- ✅ Trigger'lar ve fonksiyonlar oluşturuldu
- ✅ RLS politikaları ayarlandı

Artık kategori özellikleri çalışıyor! 🎉

