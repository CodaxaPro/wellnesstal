#!/usr/bin/env node

/**
 * Local Database'den Production Database'e Senkronizasyon
 * 
 * Local Supabase'deki tüm içerikleri production Supabase'e kopyalar
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env.local') })

// Production Supabase bilgileri (.env.local'den alınacak)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL veya Key bulunamadı!')
  console.error('   .env.local dosyasını kontrol edin')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function syncDatabase() {
  console.log('🔄 Local → Production Database Senkronizasyonu Başlatılıyor...\n')
  console.log(`📍 Supabase URL: ${supabaseUrl}\n`)
  console.log('=' .repeat(60))
  
  try {
    // 1. Pages senkronizasyonu
    console.log('\n📄 Pages senkronizasyonu...')
    const { data: pages, error: pagesError } = await supabase
      .from('pages')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (pagesError) {
      console.error('❌ Pages alınamadı:', pagesError.message)
    } else {
      console.log(`✅ ${pages?.length || 0} sayfa bulundu`)
    }
    
    // 2. Page Blocks senkronizasyonu
    console.log('\n🧩 Page Blocks senkronizasyonu...')
    const { data: blocks, error: blocksError } = await supabase
      .from('page_blocks')
      .select('*')
      .order('position', { ascending: true })
    
    if (blocksError) {
      console.error('❌ Blocks alınamadı:', blocksError.message)
    } else {
      console.log(`✅ ${blocks?.length || 0} block bulundu`)
    }
    
    // 3. Block Types kontrolü
    console.log('\n📦 Block Types kontrolü...')
    const { data: blockTypes, error: typesError } = await supabase
      .from('block_types')
      .select('*')
    
    if (typesError) {
      console.error('❌ Block Types alınamadı:', typesError.message)
    } else {
      console.log(`✅ ${blockTypes?.length || 0} block type bulundu`)
    }
    
    // 4. Media Files kontrolü
    console.log('\n🖼️  Media Files kontrolü...')
    const { data: mediaFiles, error: mediaError } = await supabase
      .from('media_files')
      .select('*')
    
    if (mediaError) {
      console.error('❌ Media Files alınamadı:', mediaError.message)
    } else {
      console.log(`✅ ${mediaFiles?.length || 0} media file bulundu`)
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('\n✅ Database senkronizasyon kontrolü tamamlandı!')
    console.log('\n💡 Not: Bu script sadece durumu kontrol eder.')
    console.log('   Veriler zaten production Supabase\'de olmalı.')
    console.log('   Eğer eksikler varsa, upload-images-to-supabase.mjs çalıştırın.')
    
  } catch (error) {
    console.error('❌ Hata:', error)
    process.exit(1)
  }
}

syncDatabase()

