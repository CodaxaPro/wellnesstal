#!/usr/bin/env node

/**
 * Fix Image URLs in Database
 * 
 * Yanlış birleştirilmiş URL'leri düzeltir
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL veya Key bulunamadı!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function fixImageUrls() {
  console.log('🔧 Resim URL\'lerini Düzeltme Başlatılıyor...\n')
  console.log('=' .repeat(60))
  
  try {
    // Tüm block'ları al
    const { data: blocks, error: blocksError } = await supabase
      .from('page_blocks')
      .select('id, block_type, content')
    
    if (blocksError) {
      console.error('❌ Block\'lar alınamadı:', blocksError.message)
      return
    }
    
    console.log(`📊 Toplam ${blocks?.length || 0} block bulundu\n`)
    
    let fixedCount = 0
    
    for (const block of blocks || []) {
      const content = typeof block.content === 'string' 
        ? JSON.parse(block.content) 
        : block.content
      
      let updated = false
      let newContent = JSON.parse(JSON.stringify(content)) // Deep copy
      
      // URL düzeltme fonksiyonu
      function fixUrl(url) {
        if (!url || typeof url !== 'string') return url
        
        // Çiftleşmiş URL'leri düzelt
        const baseUrl = `${supabaseUrl}/storage/v1/object/public/wellnesstal`
        const doublePattern = new RegExp(`${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}${baseUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
        
        if (doublePattern.test(url)) {
          // Çiftleşmiş URL'i düzelt
          url = url.replace(doublePattern, baseUrl)
          updated = true
        }
        
        // Localhost URL'lerini production URL'lerine çevir
        if (url.includes('localhost:3001')) {
          url = url.replace(/http:\/\/localhost:3001\/uploads\//g, `${baseUrl}/uploads/`)
          updated = true
        }
        
        // Relative path'leri düzelt
        if (url.startsWith('/uploads/')) {
          url = `${baseUrl}${url}`
          updated = true
        }
        
        return url
      }
      
      // Image URL'lerini düzelt
      if (newContent.image?.url) {
        const fixedUrl = fixUrl(newContent.image.url)
        if (fixedUrl !== newContent.image.url) {
          newContent.image.url = fixedUrl
          console.log(`✅ Block ${block.id} (${block.block_type}): Image URL düzeltildi`)
          console.log(`   Eski: ${content.image.url.substring(0, 100)}...`)
          console.log(`   Yeni: ${fixedUrl.substring(0, 100)}...`)
        }
      }
      
      // Images array'i kontrol et (gallery için)
      if (Array.isArray(newContent.images)) {
        newContent.images = newContent.images.map((img, index) => {
          if (img.url) {
            const fixedUrl = fixUrl(img.url)
            if (fixedUrl !== img.url) {
              updated = true
              console.log(`✅ Block ${block.id} (${block.block_type}): Image ${index + 1} URL düzeltildi`)
              return { ...img, url: fixedUrl }
            }
          }
          return img
        })
      }
      
      // Tüm content'i recursive olarak kontrol et
      function fixUrlsInObject(obj) {
        for (const key in obj) {
          if (obj[key] && typeof obj[key] === 'object') {
            if (Array.isArray(obj[key])) {
              obj[key] = obj[key].map(item => {
                if (typeof item === 'object') {
                  fixUrlsInObject(item)
                }
                return item
              })
            } else {
              fixUrlsInObject(obj[key])
            }
          } else if (typeof obj[key] === 'string' && (key === 'url' || key.endsWith('Url'))) {
            const fixedUrl = fixUrl(obj[key])
            if (fixedUrl !== obj[key]) {
              obj[key] = fixedUrl
              updated = true
            }
          }
        }
      }
      
      fixUrlsInObject(newContent)
      
      // Eğer değişiklik varsa güncelle
      if (updated) {
        const { error: updateError } = await supabase
          .from('page_blocks')
          .update({ 
            content: newContent,
            updated_at: new Date().toISOString()
          })
          .eq('id', block.id)
        
        if (updateError) {
          console.error(`❌ Block ${block.id} güncellenemedi:`, updateError.message)
        } else {
          fixedCount++
        }
      }
    }
    
    console.log('\n' + '=' .repeat(60))
    console.log('📊 ÖZET')
    console.log('=' .repeat(60))
    console.log(`✅ Düzeltilen block'lar: ${fixedCount}`)
    console.log('\n✅ İşlem tamamlandı!')
    
  } catch (error) {
    console.error('❌ Hata:', error)
    process.exit(1)
  }
}

fixImageUrls().catch(console.error)

