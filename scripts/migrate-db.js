const { Client } = require('pg');

// Pooler connection (IPv4 compatible)
// Connection string - Update with your database password before running
const connectionString = process.env.DATABASE_URL || 'postgresql://postgres.rtudfkccbzbblfmeoyop:[YOUR-PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres';

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    console.log('🔄 Supabase\'e bağlanılıyor...');
    await client.connect();
    console.log('✅ Bağlantı başarılı!\n');

    // Step 1: Drop existing tables (in correct order due to foreign keys)
    console.log('🗑️ ADIM 1: Mevcut tablolar siliniyor...');
    await client.query(`
      DROP TABLE IF EXISTS services CASCADE;
      DROP TABLE IF EXISTS categories CASCADE;
      DROP TABLE IF EXISTS testimonials CASCADE;
      DROP TABLE IF EXISTS content CASCADE;
      DROP TABLE IF EXISTS pages CASCADE;
      DROP TABLE IF EXISTS admin_users CASCADE;
    `);
    console.log('✅ Eski tablolar silindi!\n');

    // Step 2: Create Tables
    console.log('📦 ADIM 2: Tablolar oluşturuluyor...');
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`);

    // Admin Users
    await client.query(`
      CREATE TABLE admin_users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(20) DEFAULT 'admin',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('   ✓ admin_users tablosu oluşturuldu');

    // Categories
    await client.query(`
      CREATE TABLE categories (
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
    `);
    console.log('   ✓ categories tablosu oluşturuldu');

    // Services
    await client.query(`
      CREATE TABLE services (
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
    `);
    console.log('   ✓ services tablosu oluşturuldu');

    // Content
    await client.query(`
      CREATE TABLE content (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        section VARCHAR(100) UNIQUE NOT NULL,
        title VARCHAR(200),
        description TEXT,
        content JSONB NOT NULL DEFAULT '{}',
        defaults JSONB,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_by VARCHAR(100) DEFAULT 'Admin'
      );
    `);
    console.log('   ✓ content tablosu oluşturuldu');

    // Pages
    await client.query(`
      CREATE TABLE pages (
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
    `);
    console.log('   ✓ pages tablosu oluşturuldu');

    // Testimonials
    await client.query(`
      CREATE TABLE testimonials (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) NOT NULL,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5),
        comment TEXT NOT NULL,
        service VARCHAR(200),
        avatar TEXT,
        active BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);
    console.log('   ✓ testimonials tablosu oluşturuldu');
    console.log('✅ Tüm tablolar oluşturuldu!\n');

    // Step 3: Create Indexes
    console.log('📇 ADIM 3: İndeksler oluşturuluyor...');
    await client.query(`
      CREATE INDEX idx_categories_active ON categories(active);
      CREATE INDEX idx_categories_order ON categories(order_num);
      CREATE INDEX idx_services_active ON services(active);
      CREATE INDEX idx_services_category ON services(category_id);
      CREATE INDEX idx_services_order ON services(order_num);
      CREATE INDEX idx_content_section ON content(section);
      CREATE INDEX idx_pages_status ON pages(status);
      CREATE INDEX idx_pages_slug ON pages(slug);
    `);
    console.log('✅ İndeksler oluşturuldu!\n');

    // Step 4: Create Triggers
    console.log('⚡ ADIM 4: Trigger\'lar oluşturuluyor...');
    await client.query(`
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
      END;
      $$ language 'plpgsql';
    `);

    await client.query(`
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
    `);
    console.log('✅ Trigger\'lar oluşturuldu!\n');

    // Step 5: Enable RLS
    console.log('🔐 ADIM 5: Row Level Security etkinleştiriliyor...');
    await client.query(`
      ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
      ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
      ALTER TABLE services ENABLE ROW LEVEL SECURITY;
      ALTER TABLE content ENABLE ROW LEVEL SECURITY;
      ALTER TABLE pages ENABLE ROW LEVEL SECURITY;
      ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
    `);

    await client.query(`
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
    `);
    console.log('✅ RLS politikaları oluşturuldu!\n');

    // Step 6: Insert Seed Data - Admin User
    console.log('👤 ADIM 6: Admin kullanıcı ekleniyor...');
    await client.query(`
      INSERT INTO admin_users (username, email, password_hash, role)
      VALUES (
        'admin',
        'admin@wellnesstal.de',
        '$2b$10$rOzJqQZQZQZQZQZQZQZQZOeKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq',
        'admin'
      );
    `);
    console.log('✅ Admin kullanıcı eklendi!\n');

    // Step 7: Insert Seed Data - Categories
    console.log('📁 ADIM 7: Kategoriler ekleniyor...');
    await client.query(`
      INSERT INTO categories (name, description, slug, color, icon, order_num, active, service_count)
      VALUES
        ('Spa Tedavileri', 'Rahatlatıcı spa ve wellness tedavileri', 'spa-tedavileri', '#10B981', '🌿', 1, true, 1),
        ('Masaj Terapileri', 'Profesyonel masaj ve terapi hizmetleri', 'masaj-terapileri', '#059669', '💆', 2, true, 2),
        ('Güzellik Bakımı', 'Yüz ve vücut güzellik bakım hizmetleri', 'guzellik-bakimi', '#E11D48', '✨', 3, false, 1);
    `);
    console.log('✅ Kategoriler eklendi!\n');

    // Step 8: Insert Seed Data - Services
    console.log('🛠️ ADIM 8: Servisler ekleniyor...');
    await client.query(`
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
        );
    `);
    console.log('✅ Servisler eklendi!\n');

    // Step 9: Insert Seed Data - Testimonials
    console.log('💬 ADIM 9: Yorumlar ekleniyor...');
    await client.query(`
      INSERT INTO testimonials (name, rating, comment, service, active)
      VALUES
        ('Maria S.', 5, 'Fantastische Erfahrung! Das Head Spa war unglaublich entspannend.', 'Premium Head Spa', true),
        ('Thomas K.', 5, 'Die beste Massage, die ich je hatte. Sehr professionell!', 'Aromatherapie Massage', true),
        ('Anna M.', 4, 'Tolle Atmosphäre und freundliches Personal.', 'Hot Stone Therapie', true);
    `);
    console.log('✅ Yorumlar eklendi!\n');

    // Step 10: Insert Seed Data - Content
    console.log('📝 ADIM 10: İçerikler ekleniyor...');
    await client.query(`
      INSERT INTO content (section, title, description, content, updated_by)
      VALUES
        ('hero', 'Ana Sayfa Hero', 'Hero bölümü', '{"mainTitle": "Wellness & Entspannung in Baesweiler", "subtitle": "Entdecken Sie professionelle Headspa-Behandlungen", "badge": "🌿 Willkommen"}'::jsonb, 'Admin'),
        ('about', 'Über Uns', 'Hakkımızda', '{"title": "Ihre Wellness-Oase", "description": "Seit über 5 Jahren widmen wir uns Ihrem Wohlbefinden."}'::jsonb, 'Admin'),
        ('contact', 'Kontakt', 'İletişim', '{"phone": "+49 1733828581", "email": "info@wellnesstal.de"}'::jsonb, 'Admin'),
        ('footer', 'Footer', 'Alt bilgi', '{"copyright": "© 2025 Wellnesstal"}'::jsonb, 'Admin'),
        ('meta', 'SEO', 'Meta bilgileri', '{"siteTitle": "Wellnesstal - Premium Wellness"}'::jsonb, 'Admin');
    `);
    console.log('✅ İçerikler eklendi!\n');

    // Verify
    console.log('🔍 ADIM 11: Doğrulama yapılıyor...');
    const tables = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    console.log('Tablolar:', tables.rows.map(r => r.table_name).join(', '));

    const categoriesCount = await client.query('SELECT COUNT(*) FROM categories');
    const servicesCount = await client.query('SELECT COUNT(*) FROM services');
    const contentCount = await client.query('SELECT COUNT(*) FROM content');
    const testimonialsCount = await client.query('SELECT COUNT(*) FROM testimonials');
    const adminCount = await client.query('SELECT COUNT(*) FROM admin_users');

    console.log(`\n📊 Kayıt Sayıları:`);
    console.log(`   - Admin Users: ${adminCount.rows[0].count}`);
    console.log(`   - Categories: ${categoriesCount.rows[0].count}`);
    console.log(`   - Services: ${servicesCount.rows[0].count}`);
    console.log(`   - Content: ${contentCount.rows[0].count}`);
    console.log(`   - Testimonials: ${testimonialsCount.rows[0].count}`);

    console.log('\n✅✅✅ TÜM MİGRASYON BAŞARIYLA TAMAMLANDI! ✅✅✅\n');

    await client.end();
  } catch (err) {
    console.error('❌ Hata:', err.message);
    console.error(err);
    await client.end();
    process.exit(1);
  }
}

run();
