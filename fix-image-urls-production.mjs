#!/usr/bin/env node

/**
 * Production Image URL Fix Script
 * 
 * Database'deki localhost:3001 URL'lerini production domain'e günceller
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Environment variables'ları yükle
dotenv.config({ path: join(__dirname, '.env.local') })

const PRODUCTION_DOMAIN = 'https://wellnesstal.de'
const LOCALHOST_PATTERN = /http:\/\/localhost:3001/g
const LOCALHOST_PATTERN_ALT = /http:\/\/127\.0\.0\.1:3001/g

async function fixImageUrls() {
  console.log('🚀 Production Image URL Güncelleme Scripti\n')
  console.log('=' .repeat(60))
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL veya Key bulunamadı!')
    console.error('   .env.local dosyasını kontrol edin')
    process.exit(1)
  }
  
  console.log(`✅ Supabase URL: ${supabaseUrl}`)
  console.log(`✅ Production Domain: ${PRODUCTION_DOMAIN}\n`)
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Tüm page_blocks'u getir
  const { data: blocks, error: blocksError } = await supabase
    .from('page_blocks')
    .select('id, page_id, block_type, content')
  
  if (blocksError) {
    console.error('❌ Block\'lar getirilemedi:', blocksError.message)
    process.exit(1)
  }
  
  if (!blocks || blocks.length === 0) {
    console.log('⚠️  Hiç block bulunamadı')
    return
  }
  
  console.log(`📊 Toplam ${blocks.length} block kontrol ediliyor...\n`)
  
  let updatedCount = 0
  const updates = []
  
  for (const block of blocks) {
    const content = typeof block.content === 'string' 
      ? JSON.parse(block.content) 
      : block.content
    
    const contentStr = JSON.stringify(content)
    
    if (contentStr.includes('localhost:3001') || contentStr.includes('127.0.0.1:3001')) {
      // URL'leri güncelle
      const updatedContentStr = contentStr
        .replace(LOCALHOST_PATTERN, PRODUCTION_DOMAIN)
        .replace(LOCALHOST_PATTERN_ALT, PRODUCTION_DOMAIN)
      
      const updatedContent = JSON.parse(updatedContentStr)
      
      updates.push({
        id: block.id,
        content: updatedContent
      })
      
      updatedCount++
      console.log(`✅ Block ${block.id} (${block.block_type}): Güncellenecek`)
    }
  }
  
  console.log(`\n📊 ${updatedCount} block güncellenecek\n`)
  
  if (updatedCount === 0) {
    console.log('✅ Güncellenecek URL bulunamadı!')
    return
  }
  
  // Güncellemeleri uygula
  console.log('🔄 Güncellemeler uygulanıyor...\n')
  
  let successCount = 0
  let errorCount = 0
  
  for (const update of updates) {
    const { error } = await supabase
      .from('page_blocks')
      .update({ 
        content: update.content,
        updated_at: new Date().toISOString()
      })
      .eq('id', update.id)
    
    if (error) {
      console.error(`❌ Block ${update.id} güncellenemedi:`, error.message)
      errorCount++
    } else {
      successCount++
    }
  }
  
  console.log('\n' + '=' .repeat(60))
  console.log('📊 ÖZET')
  console.log('=' .repeat(60))
  console.log(`✅ Başarılı: ${successCount}`)
  console.log(`❌ Hatalı: ${errorCount}`)
  console.log(`📊 Toplam: ${updatedCount}`)
  console.log('\n✅ Güncelleme tamamlandı!')
}

fixImageUrls().catch(console.error)

