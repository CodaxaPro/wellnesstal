import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

async function checkHomepageTestimonial() {
  console.log('🔍 Ana sayfadaki testimonial block\'unu kontrol ediyorum...\n')

  // Home page'i bul
  const { data: homePage, error: pageError } = await supabase
    .from('pages')
    .select('id, slug, title')
    .or('slug.eq.home,slug.eq.index')
    .limit(1)
    .single()

  if (pageError || !homePage) {
    console.log('❌ Home page bulunamadı!')
    console.log('   Error:', pageError)
    return
  }

  console.log('✅ Home page bulundu:')
  console.log('   ID:', homePage.id)
  console.log('   Slug:', homePage.slug)
  console.log('   Title:', homePage.title)

  // Home page'in block'larını getir
  const { data: blocks, error: blocksError } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', homePage.id)
    .order('position', { ascending: true })

  if (blocksError) {
    console.log('❌ Block\'lar getirilemedi:', blocksError)
    return
  }

  console.log(`\n📦 Toplam ${blocks.length} block bulundu:`)
  blocks.forEach((block, index) => {
    console.log(`\n   Block ${index + 1}:`)
    console.log(`     ID: ${block.id}`)
    console.log(`     Type: ${block.block_type}`)
    console.log(`     Visible: ${block.visible !== false}`)
    console.log(`     Position: ${block.position}`)
  })

  // Testimonial block'u bul
  const testimonialBlocks = blocks.filter(b => b.block_type === 'testimonials')
  console.log(`\n⭐ Testimonial block sayısı: ${testimonialBlocks.length}`)

  if (testimonialBlocks.length > 0) {
    testimonialBlocks.forEach((block, index) => {
      console.log(`\n   Testimonial Block ${index + 1}:`)
      console.log(`     ID: ${block.id}`)
      console.log(`     Visible: ${block.visible !== false}`)
      console.log(`     Content has testimonials: ${!!block.content?.testimonials}`)
      console.log(`     Testimonials count: ${block.content?.testimonials?.length || 0}`)
    })
  } else {
    console.log('\n⚠️  Testimonial block bulunamadı!')
    console.log('   Home page\'e testimonial block eklenmesi gerekiyor.')
  }
}

checkHomepageTestimonial().catch(console.error)
