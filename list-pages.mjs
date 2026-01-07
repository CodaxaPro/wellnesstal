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
const supabase = createClient(
  envVars['NEXT_PUBLIC_SUPABASE_URL'],
  envVars['SUPABASE_SERVICE_ROLE_KEY']
)

async function listPages() {
  const { data: pages } = await supabase
    .from('pages')
    .select('id, slug, title')
    .order('slug')
  
  console.log('📄 Tüm Sayfalar:\n')
  pages?.forEach(page => {
    console.log(`  - ${page.slug} (${page.title})`)
  })
  
  // Gutschein benzeri sayfaları bul
  const gutscheinPages = pages?.filter(p => 
    p.slug.toLowerCase().includes('gutschein') || 
    p.slug.toLowerCase().includes('gutch')
  )
  
  if (gutscheinPages?.length > 0) {
    console.log('\n🎁 Gutschein benzeri sayfalar:')
    gutscheinPages.forEach(page => {
      console.log(`  - ${page.slug} (${page.title})`)
    })
  }
}

listPages().catch(console.error)
