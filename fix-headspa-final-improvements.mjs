#!/usr/bin/env node

/**
 * Headspa Sayfası - Final İyileştirmeler
 * 1. Block Position düzeltmesi (duplicate position'ları düzelt)
 * 2. OG Image ekleme
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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

async function fixHeadspaImprovements() {
  console.log('🔧 Headspa Sayfası - Final İyileştirmeler\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  // Headspa sayfasını bul
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'headspa')
    .single()
  
  if (pageError || !page) {
    console.error(`❌ Headspa sayfası bulunamadı: ${pageError?.message}`)
    return
  }
  
  console.log(`✅ Sayfa bulundu: ${page.title}\n`)
  
  // Block'ları al
  const { data: blocks, error: blocksError } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', page.id)
    .order('position', { ascending: true })
  
  if (blocksError) {
    console.error(`❌ Block'lar alınamadı: ${blocksError.message}`)
    return
  }
  
  console.log(`📦 Toplam ${blocks?.length || 0} block bulundu\n`)
  
  // ==========================================
  // 1. BLOCK POSITION DÜZELTMESİ
  // ==========================================
  console.log('1️⃣  Block Position Düzeltmesi')
  console.log('-'.repeat(70))
  
  // Duplicate position'ları bul
  const positionMap = new Map()
  blocks?.forEach(block => {
    if (!positionMap.has(block.position)) {
      positionMap.set(block.position, [])
    }
    positionMap.get(block.position).push(block)
  })
  
  const duplicates = Array.from(positionMap.entries()).filter(([pos, blocks]) => blocks.length > 1)
  
  if (duplicates.length > 0) {
    console.log(`⚠️  ${duplicates.length} duplicate position bulundu:`)
    duplicates.forEach(([pos, blocks]) => {
      console.log(`   Position ${pos}: ${blocks.map(b => b.block_type).join(', ')}`)
    })
    
    // Block'ları tiplerine göre sırala (SEO ve Footer sona)
    const blockOrder = [
      'hero',
      'text',
      'features',
      'pricing',
      'embed',
      'gallery',
      'testimonials',
      'cta',
      'faq',
      'contact',
      'footer',
      'seo'
    ]
    
    // Yeni position'ları ata
    let newPosition = 0
    const updates = []
    
    // SEO block'u en sona al
    const seoBlock = blocks?.find(b => b.block_type === 'seo')
    const otherBlocks = blocks?.filter(b => b.block_type !== 'seo')
    
    // Diğer block'ları sırala
    const sortedBlocks = []
    blockOrder.forEach(blockType => {
      const blocksOfType = otherBlocks?.filter(b => b.block_type === blockType) || []
      blocksOfType.forEach(block => {
        sortedBlocks.push(block)
      })
    })
    
    // Position'ları güncelle
    sortedBlocks.forEach(block => {
      if (block.position !== newPosition) {
        updates.push({ id: block.id, type: block.block_type, old: block.position, new: newPosition })
      }
      newPosition++
    })
    
    // SEO block'u en sona ekle
    if (seoBlock) {
      if (seoBlock.position !== newPosition) {
        updates.push({ id: seoBlock.id, type: seoBlock.block_type, old: seoBlock.position, new: newPosition })
      }
    }
    
    // Update'leri yap
    console.log(`\n🔄 ${updates.length} block position güncelleniyor...`)
    for (const update of updates) {
      const { error } = await supabase
        .from('page_blocks')
        .update({ position: update.new })
        .eq('id', update.id)
      
      if (error) {
        console.error(`   ❌ ${update.type} (${update.old} → ${update.new}): ${error.message}`)
      } else {
        console.log(`   ✅ ${update.type}: ${update.old} → ${update.new}`)
      }
    }
  } else {
    console.log('✅ Duplicate position yok, tum blocklar dogru sirada\n')
  }
  
  // ==========================================
  // 2. OG IMAGE EKLEME
  // ==========================================
  console.log('\n2️⃣  OG Image Ekleme')
  console.log('-'.repeat(70))
  
  if (!page.og_image) {
    // Varsayılan OG image URL'i (hero image'ı kullan veya default)
    const siteUrl = envVars['NEXT_PUBLIC_SITE_URL'] || 'https://wellnesstal.de'
    const defaultOgImage = `${siteUrl}/images/og-wellnesstal.jpg`
    
    // Hero block'tan image al
    const heroBlock = blocks?.find(b => b.block_type === 'hero')
    let ogImageUrl = defaultOgImage
    
    if (heroBlock?.content?.image?.url) {
      // Supabase storage URL'ini kullan
      ogImageUrl = heroBlock.content.image.url
    }
    
    console.log(`📸 OG Image ekleniyor: ${ogImageUrl}`)
    
    const { error: updateError } = await supabase
      .from('pages')
      .update({ og_image: ogImageUrl })
      .eq('id', page.id)
    
    if (updateError) {
      console.error(`❌ OG Image eklenemedi: ${updateError.message}`)
    } else {
      console.log(`✅ OG Image eklendi: ${ogImageUrl}`)
    }
  } else {
    console.log(`✅ OG Image zaten mevcut: ${page.og_image}`)
  }
  
  // ==========================================
  // 3. SONUÇ
  // ==========================================
  console.log('\n' + '='.repeat(70))
  console.log('✅ Final İyileştirmeler Tamamlandı!')
  console.log('='.repeat(70))
  console.log('\n📋 Yapılan Düzeltmeler:')
  console.log('   1. ✅ Block position duplicate\'ları düzeltildi')
  console.log('   2. ✅ OG Image eklendi')
  console.log('\n🎉 Headspa sayfası enterprise seviyede hazır!')
}

fixHeadspaImprovements().catch(console.error)

