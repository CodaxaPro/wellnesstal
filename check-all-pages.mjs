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

async function checkAllPages() {
  console.log('🔍 Tüm sayfaları kontrol ediyorum...\n')

  const { data: pages, error } = await supabase
    .from('pages')
    .select('id, slug, title, status, active')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('❌ Hata:', error)
    return
  }

  console.log(`📄 Toplam ${pages.length} sayfa bulundu:\n`)
  pages.forEach((page, index) => {
    console.log(`${index + 1}. ${page.title} (${page.slug})`)
    console.log(`   ID: ${page.id}`)
    console.log(`   Status: ${page.status}`)
    console.log(`   Active: ${page.active}`)
    console.log('')
  })

  // Home page'i ara
  const homePage = pages.find(p => p.slug === 'home' || p.slug === 'index' || p.title?.toLowerCase() === 'home')
  if (homePage) {
    console.log('✅ Home page bulundu:', homePage.slug)
  } else {
    console.log('❌ Home page bulunamadı!')
  }
}

checkAllPages().catch(console.error)
