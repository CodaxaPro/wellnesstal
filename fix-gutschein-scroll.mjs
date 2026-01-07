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

async function fixGutscheinScroll() {
  console.log('🔧 Gutschein sayfası scroll sorununu düzeltiliyor...\n')
  
  // Gutschein sayfasını bul (farklı slug'ları dene)
  let gutscheinPage = null
  
  const possibleSlugs = ['gutschein', 'Gutschein', 'GUTSCHEIN']
  
  for (const slug of possibleSlugs) {
    const { data: page } = await supabase
      .from('pages')
      .select('id, slug, title')
      .eq('slug', slug)
      .maybeSingle()
    
    if (page) {
      gutscheinPage = page
      break
    }
  }
  
  // Eğer bulunamadıysa, tüm sayfaları listele
  if (!gutscheinPage) {
    console.log('⚠️  Gutschein sayfası bulunamadı. Tüm sayfalar listeleniyor...\n')
    const { data: allPages } = await supabase
      .from('pages')
      .select('id, slug, title')
      .order('slug')
    
    console.log('📄 Tüm sayfalar:')
    allPages?.forEach(page => {
      console.log(`  - ${page.slug} (${page.title})`)
    })
    
    // Gutschein benzeri sayfaları bul
    const gutscheinLike = allPages?.filter(p => 
      p.slug.toLowerCase().includes('gutschein') || 
      p.slug.toLowerCase().includes('gutch') ||
      p.slug.toLowerCase().includes('gift')
    )
    
    if (gutscheinLike && gutscheinLike.length > 0) {
      console.log('\n🎁 Gutschein benzeri sayfalar bulundu:')
      gutscheinLike.forEach(page => {
        console.log(`  - ${page.slug} (${page.title})`)
      })
      gutscheinPage = gutscheinLike[0]
      console.log(`\n✅ İlk eşleşen sayfa kullanılıyor: ${gutscheinPage.slug}\n`)
    } else {
      console.error('\n❌ Gutschein sayfası bulunamadı!')
      return
    }
  }
  
  console.log(`✅ Gutschein sayfası bulundu: ${gutscheinPage.slug} (ID: ${gutscheinPage.id})\n`)
  
  // Tüm blokları getir
  const { data: blocks } = await supabase
    .from('page_blocks')
    .select('id, block_type, content, position, visible')
    .eq('page_id', gutscheinPage.id)
    .eq('visible', true)
    .order('position', { ascending: true })
  
  if (!blocks || blocks.length === 0) {
    console.error('❌ Blok bulunamadı!')
    return
  }
  
  console.log(`📦 Toplam ${blocks.length} blok bulundu:\n`)
  
  let fixedCount = 0
  
  // Her bloğu kontrol et ve düzelt
  for (const block of blocks) {
    const sectionId = block.content?.sectionId
    const blockType = block.block_type
    
    console.log(`🔍 ${blockType.toUpperCase()} (Position: ${block.position})`)
    console.log(`   Mevcut sectionId: ${sectionId || '❌ YOK!'}`)
    
    // Her block type için beklenen sectionId
    let expectedSectionId = null
    
    if (blockType === 'hero') {
      expectedSectionId = 'gutschein'
    } else if (blockType === 'pricing') {
      expectedSectionId = 'pricing'
    } else if (blockType === 'features') {
      expectedSectionId = 'features'
    } else if (blockType === 'testimonials') {
      expectedSectionId = 'testimonials'
    } else if (blockType === 'contact') {
      expectedSectionId = 'contact'
    } else if (blockType === 'booking') {
      expectedSectionId = 'booking'
    }
    
    // Eğer beklenen sectionId varsa ve mevcut sectionId yanlışsa, düzelt
    if (expectedSectionId && (!sectionId || sectionId !== expectedSectionId)) {
      console.log(`   ⚠️  sectionId düzeltiliyor: "${expectedSectionId}"`)
      
      const updatedContent = {
        ...block.content,
        sectionId: expectedSectionId
      }
      
      const { error } = await supabase
        .from('page_blocks')
        .update({ content: updatedContent })
        .eq('id', block.id)
      
      if (error) {
        console.error(`   ❌ Güncelleme hatası: ${error.message}`)
      } else {
        console.log(`   ✅ sectionId güncellendi: "${expectedSectionId}"`)
        fixedCount++
      }
    } else if (expectedSectionId && sectionId === expectedSectionId) {
      console.log(`   ✅ sectionId doğru: "${sectionId}"`)
    } else if (!expectedSectionId) {
      console.log(`   ℹ️  Bu block type için sectionId gerekmiyor`)
    }
    
    console.log('')
  }
  
  console.log('='.repeat(70))
  console.log(`✅ Toplam ${fixedCount} blok düzeltildi!`)
  console.log('\n💡 Şimdi sayfayı yenileyin ve scroll\'un çalışıp çalışmadığını test edin.')
  console.log('   Test URL: http://localhost:3001/gutschein#gutschein')
  console.log('   Test URL: http://localhost:3001/gutschein#pricing')
}

fixGutscheinScroll().catch(console.error)

