import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Load env manually
const envContent = readFileSync('.env.local', 'utf-8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length > 0) {
    envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
  }
})

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY']

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

async function runMigrations() {
  console.log('🚀 Running Supabase migrations...\n')
  console.log('URL:', supabaseUrl)
  console.log('')

  try {
    // Test connection first
    console.log('🔗 Testing connection...')
    const { data: testData, error: testError } = await supabase
      .from('content')
      .select('section')
      .limit(1)

    if (testError) {
      console.log('⚠️  Connection test warning:', testError.message)
    } else {
      console.log('✅ Connection successful\n')
    }

    // Step 1: Check if homepage_sections table exists
    console.log('📦 Checking homepage_sections table...')
    const { data: sectionsCheck, error: sectionsError } = await supabase
      .from('homepage_sections')
      .select('id')
      .limit(1)

    if (sectionsError && sectionsError.code === '42P01') {
      console.log('❌ Table homepage_sections does not exist.')
      console.log('   Need to create table first...\n')
      return { needsTableCreation: true }
    } else if (sectionsError) {
      console.log('⚠️  Error:', sectionsError.message)
    } else {
      console.log('✅ Table exists, inserting data...\n')

      // Insert sections
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
          console.log(`   ⚠️  ${section.section_key}: ${error.message}`)
        } else {
          console.log(`   ✅ ${section.section_name}`)
        }
      }
    }

    // Step 2: Check if google_reviews table exists
    console.log('\n📦 Checking google_reviews table...')
    const { data: reviewsCheck, error: reviewsError } = await supabase
      .from('google_reviews')
      .select('id')
      .limit(1)

    if (reviewsError && reviewsError.code === '42P01') {
      console.log('❌ Table google_reviews does not exist.')
      console.log('   Need to create table first...\n')
      return { needsTableCreation: true }
    } else if (reviewsError) {
      console.log('⚠️  Error:', reviewsError.message)
    } else {
      console.log('✅ Table exists, inserting data...\n')

      // Insert reviews
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
          .insert(review)

        if (error && !error.message.includes('duplicate')) {
          console.log(`   ⚠️  ${review.reviewer_name}: ${error.message}`)
        } else {
          console.log(`   ✅ ${review.reviewer_name}`)
        }
      }
    }

    // Step 3: Insert Google Reviews section settings
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
      console.log(`   ⚠️  ${contentError.message}`)
    } else {
      console.log('   ✅ Google Reviews section settings saved')
    }

    console.log('\n✅ Migration completed successfully!')

  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

runMigrations()
