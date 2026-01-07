import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

function loadEnvFile() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf-8')
    const envVars = {}
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        envVars[match[1].trim()] = match[2].trim()
      }
    })
    return envVars
  } catch (error) {
    return null
  }
}

const envVars = loadEnvFile()
if (!envVars) {
  console.error('❌ .env.local dosyası bulunamadı')
  process.exit(1)
}

const supabase = createClient(
  envVars['NEXT_PUBLIC_SUPABASE_URL'],
  envVars['SUPABASE_SERVICE_ROLE_KEY']
)

async function listPages() {
  const { data: pages } = await supabase
    .from('pages')
    .select('id, slug, title, status')
    .order('slug')
  
  console.log('📄 TÜM SAYFALAR:\n')
  pages?.forEach(page => {
    console.log(`  - ${page.slug} (${page.title}) [${page.status}]`)
  })
  
  // Headspa benzeri sayfalar
  const headspaPages = pages?.filter(p => 
    p.slug.toLowerCase().includes('headspa') || 
    p.slug.toLowerCase().includes('head')
  )
  
  // Gutschein benzeri sayfalar
  const gutscheinPages = pages?.filter(p => 
    p.slug.toLowerCase().includes('gutschein') || 
    p.slug.toLowerCase().includes('gutch')
  )
  
  console.log('\n🔍 HEADSPA BENZERİ SAYFALAR:')
  headspaPages?.forEach(page => {
    console.log(`  - ${page.slug} (${page.title})`)
  })
  
  console.log('\n🔍 GUTSCHEIN BENZERİ SAYFALAR:')
  gutscheinPages?.forEach(page => {
    console.log(`  - ${page.slug} (${page.title})`)
  })
}

listPages().catch(console.error)

