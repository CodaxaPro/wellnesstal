import { createClient } from '@supabase/supabase-js'
import { config } from 'dotenv'
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

async function checkHeroBlock() {
  console.log('🔍 Gutschein sayfası Hero block kontrol ediliyor...\n')
  
  const { data: page } = await supabase
    .from('pages')
    .select('id, slug')
    .eq('slug', 'gutschein')
    .single()
  
  if (!page) {
    console.error('❌ Gutschein sayfası bulunamadı')
    return
  }
  
  console.log(`✅ Sayfa bulundu: ${page.slug} (ID: ${page.id})\n`)
  
  const { data: heroBlock } = await supabase
    .from('page_blocks')
    .select('id, block_type, content')
    .eq('page_id', page.id)
    .eq('block_type', 'hero')
    .single()
  
  if (!heroBlock) {
    console.error('❌ Hero block bulunamadı')
    return
  }
  
  console.log('📦 Hero Block Content:')
  console.log(JSON.stringify(heroBlock.content, null, 2))
  console.log('\n')
  
  const sectionId = heroBlock.content?.sectionId
  console.log(`🔍 sectionId: ${sectionId || '❌ YOK!'}`)
  
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
    console.log('✅ sectionId doğru ayarlanmış')
  }
}

checkHeroBlock().catch(console.error)
