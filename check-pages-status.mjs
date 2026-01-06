import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL veya Key bulunamadı!')
  console.error('Lütfen .env.local dosyasını kontrol edin.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function checkPages() {
  console.log('🔍 Sayfa Durumu Kontrolü\n')
  console.log('='.repeat(70))

  // Check headspa page
  console.log('\n📄 Headspa Sayfası:')
  const { data: headspa, error: headspaError } = await supabase
    .from('pages')
    .select('id, slug, title, status, created_at, updated_at')
    .eq('slug', 'headspa')
    .single()

  if (headspaError || !headspa) {
    console.log('  ❌ Sayfa bulunamadı!')
    console.log(`  Hata: ${headspaError?.message || 'Bilinmeyen hata'}`)
  } else {
    console.log(`  ✅ Sayfa bulundu:`)
    console.log(`     ID: ${headspa.id}`)
    console.log(`     Title: ${headspa.title}`)
    console.log(`     Status: ${headspa.status} ${headspa.status !== 'published' ? '⚠️' : '✅'}`)
    console.log(`     Created: ${headspa.created_at}`)
    console.log(`     Updated: ${headspa.updated_at}`)
    
    if (headspa.status !== 'published') {
      console.log(`\n  ⚠️  UYARI: Sayfa 'published' durumunda değil!`)
      console.log(`     Sayfa görünür olması için status='published' olmalı.`)
    }
  }

  // Check gutschein page
  console.log('\n📄 Gutschein Sayfası:')
  const { data: gutschein, error: gutscheinError } = await supabase
    .from('pages')
    .select('id, slug, title, status, created_at, updated_at')
    .eq('slug', 'gutschein')
    .single()

  if (gutscheinError || !gutschein) {
    console.log('  ❌ Sayfa bulunamadı!')
    console.log(`  Hata: ${gutscheinError?.message || 'Bilinmeyen hata'}`)
  } else {
    console.log(`  ✅ Sayfa bulundu:`)
    console.log(`     ID: ${gutschein.id}`)
    console.log(`     Title: ${gutschein.title}`)
    console.log(`     Status: ${gutschein.status} ${gutschein.status !== 'published' ? '⚠️' : '✅'}`)
    console.log(`     Created: ${gutschein.created_at}`)
    console.log(`     Updated: ${gutschein.updated_at}`)
    
    if (gutschein.status !== 'published') {
      console.log(`\n  ⚠️  UYARI: Sayfa 'published' durumunda değil!`)
      console.log(`     Sayfa görünür olması için status='published' olmalı.`)
    }
  }

  // List all pages
  console.log('\n📋 Tüm Sayfalar:')
  const { data: allPages, error: allPagesError } = await supabase
    .from('pages')
    .select('slug, title, status')
    .order('slug')

  if (allPagesError) {
    console.log(`  ❌ Sayfalar alınamadı: ${allPagesError.message}`)
  } else {
    console.log(`  Toplam ${allPages?.length || 0} sayfa bulundu:\n`)
    allPages?.forEach(page => {
      const statusIcon = page.status === 'published' ? '✅' : page.status === 'draft' ? '📝' : '📦'
      console.log(`  ${statusIcon} ${page.slug.padEnd(20)} - ${page.title.padEnd(40)} [${page.status}]`)
    })
  }

  console.log('\n' + '='.repeat(70))
  console.log('\n💡 İpucu:')
  console.log('   Sayfaların görünür olması için status="published" olmalı.')
  console.log('   Admin panelinden sayfaları düzenleyerek status\'u "published" yapabilirsiniz.')
  console.log('   Veya bu scripti çalıştırarak otomatik olarak publish edebilirsiniz:\n')
  console.log('   node check-pages-status.mjs --publish\n')
}

async function publishPages() {
  console.log('🚀 Sayfaları Publish Ediyorum...\n')
  console.log('='.repeat(70))

  // Publish headspa
  const { data: headspa, error: headspaError } = await supabase
    .from('pages')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('slug', 'headspa')
    .select()

  if (headspaError) {
    console.log(`❌ Headspa sayfası publish edilemedi: ${headspaError.message}`)
  } else if (headspa && headspa.length > 0) {
    console.log(`✅ Headspa sayfası publish edildi`)
  } else {
    console.log(`⚠️  Headspa sayfası bulunamadı`)
  }

  // Publish gutschein
  const { data: gutschein, error: gutscheinError } = await supabase
    .from('pages')
    .update({ status: 'published', published_at: new Date().toISOString() })
    .eq('slug', 'gutschein')
    .select()

  if (gutscheinError) {
    console.log(`❌ Gutschein sayfası publish edilemedi: ${gutscheinError.message}`)
  } else if (gutschein && gutschein.length > 0) {
    console.log(`✅ Gutschein sayfası publish edildi`)
  } else {
    console.log(`⚠️  Gutschein sayfası bulunamadı`)
  }

  console.log('\n' + '='.repeat(70))
  console.log('\n✅ İşlem tamamlandı!')
}

// Main
const args = process.argv.slice(2)
if (args.includes('--publish')) {
  publishPages().catch(console.error)
} else {
  checkPages().catch(console.error)
}

