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

async function checkGutscheinBlocks() {
  console.log('🔍 Gutschein sayfası ve blokları kontrol ediliyor...\n')
  
  // Tüm sayfaları listele
  const { data: allPages } = await supabase
    .from('pages')
    .select('id, slug, title')
    .order('slug')
  
  console.log('📄 Tüm sayfalar:')
  allPages?.forEach(page => {
    console.log(`  - ${page.slug} (${page.title})`)
  })
  
  // Gutschein sayfasını bul
  const gutscheinPage = allPages?.find(p => 
    p.slug.toLowerCase() === 'gutschein' || 
    p.slug.toLowerCase().includes('gutschein')
  )
  
  if (!gutscheinPage) {
    console.error('\n❌ Gutschein sayfası bulunamadı!')
    return
  }
  
  console.log(`\n✅ Gutschein sayfası bulundu: ${gutscheinPage.slug} (ID: ${gutscheinPage.id})\n`)
  
  // Tüm blokları getir
  const { data: blocks } = await supabase
    .from('page_blocks')
    .select('id, block_type, content, position')
    .eq('page_id', gutscheinPage.id)
    .eq('visible', true)
    .order('position', { ascending: true })
  
  if (!blocks || blocks.length === 0) {
    console.error('❌ Blok bulunamadı!')
    return
  }
  
  console.log(`📦 Toplam ${blocks.length} blok bulundu:\n`)
  
  blocks.forEach((block, index) => {
    const sectionId = block.content?.sectionId
    console.log(`${index + 1}. ${block.block_type.toUpperCase()}`)
    console.log(`   Position: ${block.position}`)
    console.log(`   sectionId: ${sectionId || '❌ YOK!'}`)
    console.log('')
  })
  
  // Hero block kontrolü
  const heroBlock = blocks.find(b => b.block_type === 'hero')
  if (heroBlock) {
    const sectionId = heroBlock.content?.sectionId
    if (!sectionId || sectionId !== 'gutschein') {
      console.log('⚠️  Hero block sectionId eksik veya yanlış! Düzeltiliyor...')
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
        console.log('✅ Hero block sectionId güncellendi: gutschein\n')
      }
    } else {
      console.log('✅ Hero block sectionId doğru: gutschein\n')
    }
  } else {
    console.log('⚠️  Hero block bulunamadı!\n')
  }
  
  // Pricing block kontrolü
  const pricingBlock = blocks.find(b => b.block_type === 'pricing')
  if (pricingBlock) {
    const sectionId = pricingBlock.content?.sectionId
    if (!sectionId || sectionId !== 'pricing') {
      console.log('⚠️  Pricing block sectionId eksik veya yanlış! Düzeltiliyor...')
      const updatedContent = {
        ...pricingBlock.content,
        sectionId: 'pricing'
      }
      const { error } = await supabase
        .from('page_blocks')
        .update({ content: updatedContent })
        .eq('id', pricingBlock.id)
      if (error) {
        console.error('❌ Güncelleme hatası:', error.message)
      } else {
        console.log('✅ Pricing block sectionId güncellendi: pricing\n')
      }
    } else {
      console.log('✅ Pricing block sectionId doğru: pricing\n')
    }
  } else {
    console.log('⚠️  Pricing block bulunamadı!\n')
  }
}

checkGutscheinBlocks().catch(console.error)

