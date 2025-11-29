import pg from 'pg'
const { Client } = pg

// Supabase database password - YOU NEED TO PROVIDE THIS
// Get from: Supabase Dashboard > Settings > Database > Connection string
const DB_PASSWORD = process.env.DB_PASSWORD || process.argv[2]

if (!DB_PASSWORD || DB_PASSWORD === 'undefined') {
  console.log('❌ Veritabanı şifresi gerekli!')
  console.log('')
  console.log('Kullanım:')
  console.log('  node create-tables.mjs YOUR_PASSWORD')
  console.log('')
  console.log('Şifreyi almak için:')
  console.log('  1. https://supabase.com/dashboard/project/rtudfkccbzbblfmeoyop/settings/database')
  console.log('  2. "Database password" bölümünden şifreyi kopyalayın')
  console.log('')
  process.exit(1)
}

// Direct database connection
const connectionString = `postgresql://postgres:${DB_PASSWORD}@db.rtudfkccbzbblfmeoyop.supabase.co:5432/postgres`

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false }
})

async function run() {
  try {
    console.log('🔄 Supabase veritabanına bağlanılıyor...')
    await client.connect()
    console.log('✅ Bağlantı başarılı!\n')

    // 1. homepage_sections tablosu
    console.log('📦 homepage_sections tablosu oluşturuluyor...')
    await client.query(`
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
    `)
    console.log('   ✅ homepage_sections oluşturuldu')

    // 2. google_reviews tablosu
    console.log('📦 google_reviews tablosu oluşturuluyor...')
    await client.query(`
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
    `)
    console.log('   ✅ google_reviews oluşturuldu')

    // 3. İndeksler
    console.log('📇 İndeksler oluşturuluyor...')
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_homepage_sections_position ON homepage_sections(position);
      CREATE INDEX IF NOT EXISTS idx_homepage_sections_enabled ON homepage_sections(enabled);
      CREATE INDEX IF NOT EXISTS idx_google_reviews_active ON google_reviews(active);
      CREATE INDEX IF NOT EXISTS idx_google_reviews_rating ON google_reviews(rating DESC);
      CREATE INDEX IF NOT EXISTS idx_google_reviews_position ON google_reviews(position);
    `)
    console.log('   ✅ İndeksler oluşturuldu')

    // 4. RLS
    console.log('🔐 RLS politikaları ayarlanıyor...')
    await client.query(`ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;`)
    await client.query(`ALTER TABLE google_reviews ENABLE ROW LEVEL SECURITY;`)

    await client.query(`DROP POLICY IF EXISTS "Public read access" ON homepage_sections;`)
    await client.query(`DROP POLICY IF EXISTS "Service role full access" ON homepage_sections;`)
    await client.query(`DROP POLICY IF EXISTS "Public read access" ON google_reviews;`)
    await client.query(`DROP POLICY IF EXISTS "Service role full access" ON google_reviews;`)

    await client.query(`CREATE POLICY "Public read access" ON homepage_sections FOR SELECT USING (true);`)
    await client.query(`CREATE POLICY "Service role full access" ON homepage_sections FOR ALL USING (true);`)
    await client.query(`CREATE POLICY "Public read access" ON google_reviews FOR SELECT USING (active = true);`)
    await client.query(`CREATE POLICY "Service role full access" ON google_reviews FOR ALL USING (true);`)
    console.log('   ✅ RLS politikaları oluşturuldu')

    // 5. Varsayılan bölümler
    console.log('📝 Varsayılan bölümler ekleniyor...')
    await client.query(`
      INSERT INTO homepage_sections (section_key, section_name, section_icon, position, enabled) VALUES
        ('landing-hero', 'Landing Hero', '🎯', 1, true),
        ('hero', 'Hero Section', '🏠', 2, true),
        ('services', 'Hizmetler', '🏥', 3, true),
        ('google-reviews', 'Google Yorumları', '⭐', 4, true),
        ('testimonials', 'Müşteri Yorumları', '💬', 5, true),
        ('about', 'Hakkımızda', '👥', 6, true),
        ('contact', 'İletişim', '📞', 7, true)
      ON CONFLICT (section_key) DO NOTHING;
    `)
    console.log('   ✅ Bölümler eklendi')

    // 6. Örnek yorumlar
    console.log('📝 Örnek yorumlar ekleniyor...')
    await client.query(`
      INSERT INTO google_reviews (reviewer_name, rating, review_text, review_date, verified, active, position) VALUES
        ('Ahmet Y.', 5, 'Harika bir deneyimdi! Personel çok ilgili ve profesyonel. Kesinlikle tavsiye ederim.', NOW() - INTERVAL '2 days', true, true, 1),
        ('Fatma K.', 5, 'Çok memnun kaldım. Temiz ortam, güler yüzlü ekip. Tekrar geleceğim.', NOW() - INTERVAL '5 days', true, true, 2),
        ('Mehmet S.', 5, 'Profesyonel hizmet, uygun fiyat. 5 yıldızı hak ediyorlar.', NOW() - INTERVAL '1 week', true, true, 3),
        ('Ayşe D.', 4, 'Genel olarak memnunum. Randevu sistemi çok pratik.', NOW() - INTERVAL '2 weeks', true, true, 4),
        ('Ali R.', 5, 'Beklentilerimin üzerinde bir hizmet aldım. Teşekkürler!', NOW() - INTERVAL '3 weeks', true, true, 5),
        ('Zeynep T.', 5, 'Uzman kadro ve modern ekipmanlar. Güvenle tercih edebilirsiniz.', NOW() - INTERVAL '1 month', true, true, 6)
      ON CONFLICT DO NOTHING;
    `)
    console.log('   ✅ Yorumlar eklendi')

    // Doğrulama
    const sectionsCount = await client.query('SELECT COUNT(*) FROM homepage_sections')
    const reviewsCount = await client.query('SELECT COUNT(*) FROM google_reviews')

    console.log('\n📊 Sonuç:')
    console.log(`   - Homepage Sections: ${sectionsCount.rows[0].count} kayıt`)
    console.log(`   - Google Reviews: ${reviewsCount.rows[0].count} kayıt`)

    console.log('\n✅✅✅ TABLOLAR BAŞARIYLA OLUŞTURULDU! ✅✅✅\n')

    await client.end()
  } catch (err) {
    console.error('❌ Hata:', err.message)
    await client.end()
    process.exit(1)
  }
}

run()
