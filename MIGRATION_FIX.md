# 🔧 Migration Hatası Düzeltme

## Hata Mesajı

```
ERROR: 22P02: invalid input syntax for type uuid: "PAGE_ID" 
LINE 131: SELECT id, page_id, content, updated_at FROM page_blocks WHERE page_id = 'PAGE_ID' ORDER BY position;
```

## Sorun

Bu hata, migration dosyasının **sonuna** eklenen bir örnek sorgudan kaynaklanıyor. Migration dosyası sadece **130. satıra kadar** olmalı.

## Çözüm

1. **Supabase SQL Editor'da:**
   - Migration dosyasını tekrar açın
   - **131. satırdaki sorguyu silin:**
     ```sql
     SELECT id, page_id, content, updated_at FROM page_blocks WHERE page_id = 'PAGE_ID' ORDER BY position;
     ```
   - Bu satır migration dosyasının bir parçası değil!

2. **Sadece 130. satıra kadar olan SQL'i çalıştırın:**
   - Migration dosyası `ON CONFLICT (slug) DO UPDATE SET...` ile bitmeli
   - Sonrasında sadece yorum satırları olmalı

3. **Veya temiz migration SQL'i kullanın:**

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
  IF TG_OP = 'INSERT' AND NEW.category_id IS NOT NULL THEN
    UPDATE page_categories 
    SET page_count = (
      SELECT COUNT(*) FROM pages WHERE category_id = NEW.category_id AND status != 'archived'
    )
    WHERE id = NEW.category_id;
  END IF;
  
  IF TG_OP = 'UPDATE' THEN
    IF OLD.category_id IS NOT NULL THEN
      UPDATE page_categories 
      SET page_count = (
        SELECT COUNT(*) FROM pages WHERE category_id = OLD.category_id AND status != 'archived'
      )
      WHERE id = OLD.category_id;
    END IF;
    
    IF NEW.category_id IS NOT NULL AND NEW.category_id != OLD.category_id THEN
      UPDATE page_categories 
      SET page_count = (
        SELECT COUNT(*) FROM pages WHERE category_id = NEW.category_id AND status != 'archived'
      )
      WHERE id = NEW.category_id;
    END IF;
  END IF;
  
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

DROP POLICY IF EXISTS "Public can read active page categories" ON page_categories;
CREATE POLICY "Public can read active page categories" ON page_categories
  FOR SELECT USING (active = TRUE);

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

## Önemli Notlar

- ✅ Migration dosyası **130. satırda** bitmeli
- ❌ **131. satırdaki SELECT sorgusunu çalıştırmayın** - bu bir örnek sorgu
- ✅ Migration başarılı olduktan sonra sayfayı yenileyin (F5)

## Migration Başarı Kontrolü

Migration başarılı olduktan sonra:
1. Table Editor'da `page_categories` tablosunu kontrol edin
2. 6 varsayılan kategori görünmeli
3. `/admin/pages` sayfasında kategori özellikleri çalışmalı

