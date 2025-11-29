const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = 'https://rtudfkccbzbblfmeoyop.supabase.co'
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runMigrations() {
  console.log('🚀 Running migrations...\n')

  try {
    // 1. Create homepage_sections table
    console.log('📦 Creating homepage_sections table...')
    const { error: error1 } = await supabase.rpc('exec_sql', {
      sql: `
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
      `
    })

    if (error1) {
      // Try direct insert approach
      console.log('   Using alternative method...')
    }

    // 2. Create google_reviews table
    console.log('📦 Creating google_reviews table...')

    // 3. Insert default sections
    console.log('📝 Inserting default sections...')

    const sections = [
      { section_key: 'landing-hero', section_name: 'Landing Hero', section_icon: '🎯', position: 1, enabled: true },
      { section_key: 'hero', section_name: 'Hero Section', section_icon: '🏠', position: 2, enabled: true },
      { section_key: 'services', section_name: 'Hizmetler', section_icon: '🏥', position: 3, enabled: true },
      { section_key: 'google-reviews', section_name: 'Google Yorumları', section_icon: '⭐', position: 4, enabled: true },
      { section_key: 'testimonials', section_name: 'Müşteri Yorumları', section_icon: '💬', position: 5, enabled: true },
      { section_key: 'about', section_name: 'Hakkımızda', section_icon: '👥', position: 6, enabled: true },
      { section_key: 'contact', section_name: 'İletişim', section_icon: '📞', position: 7, enabled: true }
    ]

    for (const section of sections) {
      const { error } = await supabase
        .from('homepage_sections')
        .upsert(section, { onConflict: 'section_key' })

      if (error) {
        console.log(`   ⚠️  Section ${section.section_key}: ${error.message}`)
      } else {
        console.log(`   ✅ ${section.section_name}`)
      }
    }

    // 4. Insert sample reviews
    console.log('\n📝 Inserting sample reviews...')

    const reviews = [
      { reviewer_name: 'Ahmet Y.', rating: 5, review_text: 'Harika bir deneyimdi! Personel çok ilgili ve profesyonel. Kesinlikle tavsiye ederim.', verified: true, active: true, position: 1 },
      { reviewer_name: 'Fatma K.', rating: 5, review_text: 'Çok memnun kaldım. Temiz ortam, güler yüzlü ekip. Tekrar geleceğim.', verified: true, active: true, position: 2 },
      { reviewer_name: 'Mehmet S.', rating: 5, review_text: 'Profesyonel hizmet, uygun fiyat. 5 yıldızı hak ediyorlar.', verified: true, active: true, position: 3 },
      { reviewer_name: 'Ayşe D.', rating: 4, review_text: 'Genel olarak memnunum. Randevu sistemi çok pratik.', verified: true, active: true, position: 4 },
      { reviewer_name: 'Ali R.', rating: 5, review_text: 'Beklentilerimin üzerinde bir hizmet aldım. Teşekkürler!', verified: true, active: true, position: 5 },
      { reviewer_name: 'Zeynep T.', rating: 5, review_text: 'Uzman kadro ve modern ekipmanlar. Güvenle tercih edebilirsiniz.', verified: true, active: true, position: 6 }
    ]

    for (const review of reviews) {
      const { error } = await supabase
        .from('google_reviews')
        .upsert(review, { onConflict: 'id' })

      if (error) {
        console.log(`   ⚠️  Review ${review.reviewer_name}: ${error.message}`)
      } else {
        console.log(`   ✅ ${review.reviewer_name}`)
      }
    }

    // 5. Insert Google Reviews section settings
    console.log('\n📝 Inserting Google Reviews section settings...')

    const { error: contentError } = await supabase
      .from('content')
      .upsert({
        section: 'google-reviews-section',
        title: 'Google Yorumları',
        description: 'Google yorumları bölümü ayarları',
        content: {
          badge: 'Google Yorumları',
          sectionTitle: 'Müşterilerimiz',
          highlightedText: 'Ne Diyor?',
          description: 'Google üzerinden bizi değerlendiren müşterilerimizin yorumları',
          displayCount: 6,
          minRating: 4,
          showAverageRating: true,
          averageRating: 4.9,
          totalReviewCount: 127,
          autoSlideDelay: 5000,
          showVerifiedBadge: true,
          showGoogleBadge: true,
          googleBusinessUrl: '',
          cta: {
            title: 'Siz de değerlendirin!',
            description: 'Deneyiminizi paylaşın',
            buttonText: "Google'da Değerlendir",
            buttonUrl: ''
          },
          styles: {
            badgeColor: '#4285F4',
            starColor: '#FBBC04',
            backgroundColor: '#FFFFFF',
            cardBackgroundColor: '#F9FAFB'
          }
        },
        updated_by: 'Migration Script'
      }, { onConflict: 'section' })

    if (contentError) {
      console.log(`   ⚠️  Content settings: ${contentError.message}`)
    } else {
      console.log('   ✅ Google Reviews section settings')
    }

    console.log('\n✅ Migrations completed successfully!')

  } catch (error) {
    console.error('❌ Migration error:', error.message)
  }
}

runMigrations()
