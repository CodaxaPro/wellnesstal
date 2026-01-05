#!/usr/bin/env node

/**
 * Headspa Sayfası Block Sıralamasını Düzenle
 * Enterprise seviyede doğru sıralama
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
function loadEnvFile() {
  try {
    const envPath = join(__dirname, '.env.local')
    const envContent = readFileSync(envPath, 'utf-8')
    const envVars = {}
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length > 0) {
          const value = valueParts.join('=').replace(/^["']|["']$/g, '')
          envVars[key.trim()] = value.trim()
        }
      }
    })
    
    return envVars
  } catch (error) {
    console.error('❌ .env.local dosyası okunamadı:', error.message)
    return null
  }
}

async function fixBlockOrder() {
  console.log('🔧 Headspa Block Sıralaması Düzenleme\n')
  console.log('='.repeat(60))
  
  const envVars = loadEnvFile()
  if (!envVars) {
    return
  }
  
  const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL veya Key bulunamadı!')
    return
  }
  
  console.log(`✅ Supabase URL: ${supabaseUrl}\n`)
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Headspa sayfasını bul
  console.log('📄 Headspa sayfasını buluyorum...')
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('id, title, slug')
    .eq('slug', 'headspa')
    .single()
  
  if (pageError || !page) {
    console.error(`❌ Headspa sayfası bulunamadı: ${pageError?.message}`)
    return
  }
  
  console.log(`✅ Sayfa bulundu: ${page.title} (${page.slug})\n`)
  
  // Mevcut blockları al
  console.log('📦 Mevcut blockları kontrol ediyorum...')
  const { data: existingBlocks, error: blocksError } = await supabase
    .from('page_blocks')
    .select('id, block_type, position, content, visible')
    .eq('page_id', page.id)
    .order('position', { ascending: true })
  
  if (blocksError) {
    console.error(`❌ Block'lar alınamadı: ${blocksError.message}`)
    return
  }
  
  console.log(`✅ ${existingBlocks?.length || 0} block bulundu\n`)
  
  // Mevcut blockları göster
  console.log('📋 Mevcut Block Sıralaması:')
  existingBlocks?.forEach((block, index) => {
    const title = block.content?.title || block.content?.mainTitle || block.block_type
    console.log(`  ${index + 1}. [${block.position}] ${block.block_type} - ${title}`)
  })
  console.log()
  
  // Enterprise sıralama (referans sayfaya göre)
  const enterpriseOrder = [
    'hero',                    // 0 - Hero with new address info
    'text',                    // 1 - Problem block
    'text',                    // 2 - Solution block
    'features',                // 3 - Treatment features (4 detailed steps)
    'features',                // 4 - General features (if exists)
    'pricing',                 // 5 - Pricing packages
    'testimonials',            // 6 - Customer reviews
    'faq',                     // 7 - FAQ section
    'footer',                  // 8 - Footer
    'seo'                      // 9 - SEO block
  ]
  
  // Block'ları tiplerine göre grupla
  const blocksByType = {}
  existingBlocks?.forEach(block => {
    if (!blocksByType[block.block_type]) {
      blocksByType[block.block_type] = []
    }
    blocksByType[block.block_type].push(block)
  })
  
  // Text block'ları içeriklerine göre ayır (problem/solution)
  const problemBlock = existingBlocks?.find(b => 
    b.block_type === 'text' && 
    (b.content?.stylePreset === 'problem' || 
     b.content?.title?.includes('Kopf voller Gedanken'))
  )
  
  const solutionBlock = existingBlocks?.find(b => 
    b.block_type === 'text' && 
    (b.content?.stylePreset === 'solution' || 
     b.content?.title?.includes('Mehr als nur Entspannung'))
  )
  
  // Treatment features block'u bul (4 işlem açıklaması olan)
  const treatmentFeaturesBlock = existingBlocks?.find(b => 
    b.block_type === 'features' && 
    b.content?.features?.length === 4 &&
    b.content?.features?.[0]?.title?.includes('Sanfte Kopf')
  )
  
  // General features block'u bul
  const generalFeaturesBlock = existingBlocks?.find(b => 
    b.block_type === 'features' && 
    b.id !== treatmentFeaturesBlock?.id
  )
  
  // Yeni sıralama oluştur
  const orderedBlocks = []
  let position = 0
  
  // 1. Hero
  const heroBlock = existingBlocks?.find(b => b.block_type === 'hero')
  if (heroBlock) {
    orderedBlocks.push({ ...heroBlock, newPosition: position++ })
  }
  
  // 2. Problem Text Block
  if (problemBlock) {
    orderedBlocks.push({ ...problemBlock, newPosition: position++ })
  }
  
  // 3. Solution Text Block
  if (solutionBlock) {
    orderedBlocks.push({ ...solutionBlock, newPosition: position++ })
  }
  
  // 4. Treatment Features Block (4 işlem açıklaması)
  if (treatmentFeaturesBlock) {
    orderedBlocks.push({ ...treatmentFeaturesBlock, newPosition: position++ })
  }
  
  // 5. General Features Block (varsa)
  if (generalFeaturesBlock) {
    orderedBlocks.push({ ...generalFeaturesBlock, newPosition: position++ })
  }
  
  // 6. Pricing Block
  const pricingBlock = existingBlocks?.find(b => b.block_type === 'pricing')
  if (pricingBlock) {
    orderedBlocks.push({ ...pricingBlock, newPosition: position++ })
  }
  
  // 7. Testimonials Block
  const testimonialsBlock = existingBlocks?.find(b => b.block_type === 'testimonials')
  if (testimonialsBlock) {
    orderedBlocks.push({ ...testimonialsBlock, newPosition: position++ })
  }
  
  // 8. FAQ Block
  const faqBlock = existingBlocks?.find(b => b.block_type === 'faq')
  if (faqBlock) {
    orderedBlocks.push({ ...faqBlock, newPosition: position++ })
  }
  
  // 9. Footer Block
  const footerBlock = existingBlocks?.find(b => b.block_type === 'footer')
  if (footerBlock) {
    orderedBlocks.push({ ...footerBlock, newPosition: position++ })
  }
  
  // 10. SEO Block
  const seoBlock = existingBlocks?.find(b => b.block_type === 'seo')
  if (seoBlock) {
    orderedBlocks.push({ ...seoBlock, newPosition: position++ })
  }
  
  // Diğer block'lar (varsa)
  existingBlocks?.forEach(block => {
    if (!orderedBlocks.find(b => b.id === block.id)) {
      orderedBlocks.push({ ...block, newPosition: position++ })
    }
  })
  
  console.log('📋 Yeni Enterprise Block Sıralaması:')
  orderedBlocks.forEach((block, index) => {
    const title = block.content?.title || block.content?.mainTitle || block.block_type
    console.log(`  ${index + 1}. [${block.newPosition}] ${block.block_type} - ${title}`)
  })
  console.log()
  
  // Position'ları güncelle
  console.log('🔄 Block position\'larını güncelliyorum...')
  let updateCount = 0
  
  for (const block of orderedBlocks) {
    if (block.position !== block.newPosition) {
      const { error: updateError } = await supabase
        .from('page_blocks')
        .update({ position: block.newPosition })
        .eq('id', block.id)
      
      if (updateError) {
        console.error(`❌ Block ${block.id} güncellenemedi: ${updateError.message}`)
      } else {
        updateCount++
        console.log(`  ✅ ${block.block_type} block position: ${block.position} → ${block.newPosition}`)
      }
    }
  }
  
  console.log()
  console.log('='.repeat(60))
  console.log(`✅ ${updateCount} block position güncellendi!`)
  console.log(`📦 Toplam block sayısı: ${orderedBlocks.length}`)
  console.log('\n🎉 Enterprise block sıralaması tamamlandı!')
}

fixBlockOrder().catch(console.error)

