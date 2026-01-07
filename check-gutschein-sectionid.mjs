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

async function checkGutschein() {
  console.log('🔍 Gutschein sayfası kontrol ediliyor...\n')
  
  // Tüm sayfaları listele
  const { data: allPages } = await supabase
    .from('pages')
    .select('id, slug, title')
    .order('slug')
  
  console.log('📄 Tüm sayfalar:')
  allPages?.forEach(page => {
    console.log(`  - ${page.slug} (${page.title})`)
  })
  
  // Gutschein benzeri sayfaları bul
  const gutscheinPages = allPages?.filter(p => 
    p.slug.toLowerCase().includes('gutschein') || 
    p.slug.toLowerCase().includes('gutch') ||
    p.slug.toLowerCase() === 'gutschein'
  )
  
  console.log('\n🎁 Gutschein benzeri sayfalar:')
  if (gutscheinPages?.length > 0) {
    gutscheinPages.forEach(page => {
      console.log(`  - ${page.slug} (${page.title})`)
    })
  } else {
    console.log('  ❌ Gutschein sayfası bulunamadı!')
  }
  
  // Eğer gutschein sayfası varsa, Hero block'unu kontrol et
  const gutscheinPage = allPages?.find(p => 
    p.slug.toLowerCase() === 'gutschein' || 
    p.slug.toLowerCase().includes('gutschein')
  )
  
  if (gutscheinPage) {
    console.log(`\n📦 ${gutscheinPage.slug} sayfasının Hero block'u kontrol ediliyor...`)
    
    const { data: heroBlock } = await supabase
      .from('page_blocks')
      .select('id, block_type, content')
      .eq('page_id', gutscheinPage.id)
      .eq('block_type', 'hero')
      .single()
    
    if (heroBlock) {
      console.log('\n✅ Hero block bulundu!')
      console.log('📋 Content:')
      console.log(JSON.stringify(heroBlock.content, null, 2))
      
      const sectionId = heroBlock.content?.sectionId
      console.log(`\n🔍 sectionId: ${sectionId || '❌ YOK!'}`)
      
      if (!sectionId || sectionId !== 'gutschein') {
        console.log('\n⚠️  sectionId eksik veya yanlış! Düzeltiliyor...')
        
        const updatedContent = {
          ...heroBlock.content,
          sectionId: 'gutschein'
        }
        
        const { error } = await supabase
          .from('page_blocks')
          .update({ content: updatedContent })
          .eq('id', heroBlock.id)
        
        if (error) {
          console.error('❌ Güncelleme hatası:', error.message)
        } else {
          console.log('✅ sectionId güncellendi: gutschein')
        }
      } else {
        console.log('✅ sectionId doğru ayarlanmış: gutschein')
      }
    } else {
      console.log('❌ Hero block bulunamadı!')
    }
  }
}

checkGutschein().catch(console.error)
