#!/usr/bin/env node

/**
 * Headspa Sayfası Pricing Block Düzeltme Scripti
 * 
 * Production database'deki headspa sayfasının pricing block'undaki
 * Türkçe metinleri ("Seç", "/ay") Almanca'ya çevirir.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Environment variables'ları yükle
function loadEnvFile() {
  try {
    const envPath = join(__dirname, '.env.local')
    const envContent = readFileSync(envPath, 'utf-8')
    const envVars = {}
    
    envContent.split('\n').forEach(line => {
      const trimmed = line.trim()
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=')
        if (key && valueParts.length) {
          const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
          envVars[key.trim()] = value
        }
      }
    })
    
    return envVars
  } catch (error) {
    console.error('❌ .env.local dosyası bulunamadı!')
    return null
  }
}

async function fixHeadspaPricing() {
  console.log('🔧 Headspa Pricing Block Düzeltme\n')
  console.log('=' .repeat(50))
  
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
  
  // Pricing block'unu bul
  console.log('💰 Pricing block\'unu buluyorum...')
  const { data: blocks, error: blocksError } = await supabase
    .from('page_blocks')
    .select('id, block_type, content')
    .eq('page_id', page.id)
    .eq('block_type', 'pricing')
  
  if (blocksError) {
    console.error(`❌ Block'lar alınamadı: ${blocksError.message}`)
    return
  }
  
  if (!blocks || blocks.length === 0) {
    console.log('⚠️  Pricing block bulunamadı!')
    return
  }
  
  console.log(`✅ ${blocks.length} pricing block bulundu\n`)
  
  // Her pricing block'u düzelt
  for (const block of blocks) {
    console.log(`🔧 Block ${block.id} düzeltiliyor...`)
    
    const content = block.content || {}
    const packages = content.packages || []
    
    let updated = false
    
    // Paketleri düzelt
    for (const pkg of packages) {
      // "Seç" -> "Jetzt buchen"
      if (pkg.ctaText === 'Seç' || pkg.ctaText === 'Seç') {
        pkg.ctaText = 'Jetzt buchen'
        updated = true
        console.log(`   ✅ ${pkg.name}: "Seç" -> "Jetzt buchen"`)
      }
      
      // "/ay" -> boş string veya "/Monat"
      if (pkg.period === 'ay' || pkg.period === '/ay') {
        pkg.period = ''
        updated = true
        console.log(`   ✅ ${pkg.name}: period "ay" -> ""`)
      }
      
      // Period'da "/ay" varsa temizle
      if (typeof pkg.period === 'string' && pkg.period.includes('ay')) {
        pkg.period = pkg.period.replace(/\/?ay/g, '').trim()
        updated = true
        console.log(`   ✅ ${pkg.name}: period temizlendi`)
      }
    }
    
    if (updated) {
      // Database'i güncelle
      const { error: updateError } = await supabase
        .from('page_blocks')
        .update({ 
          content: content,
          updated_at: new Date().toISOString()
        })
        .eq('id', block.id)
      
      if (updateError) {
        console.error(`   ❌ Güncelleme hatası: ${updateError.message}`)
      } else {
        console.log(`   ✅ Block güncellendi!\n`)
      }
    } else {
      console.log(`   ℹ️  Değişiklik gerekmedi\n`)
    }
  }
  
  console.log('=' .repeat(50))
  console.log('✅ Düzeltme tamamlandı!\n')
  console.log('💡 Şimdi production\'a deploy edin:')
  console.log('   git add .')
  console.log('   git commit -m "Fix: Headspa pricing block Turkish text"')
  console.log('   git push')
}

fixHeadspaPricing().catch(console.error)

