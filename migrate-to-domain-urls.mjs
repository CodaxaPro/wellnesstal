#!/usr/bin/env node

/**
 * Migrate Image URLs to Own Domain
 * 
 * Supabase Storage URL'lerini kendi domain'imizden proxy URL'lerine çevirir
 * Örnek: 
 * https://...supabase.co/storage/... → https://www.wellnesstal.de/api/images/uploads/...
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
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.wellnesstal.de'

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase URL veya Key bulunamadı!')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function migrateUrls() {
  console.log('🔄 URL Migrasyonu Başlatılıyor...\n')
  console.log(`📍 Domain: ${siteUrl}`)
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
    
    let migratedCount = 0
    
    for (const block of blocks || []) {
      const content = typeof block.content === 'string' 
        ? JSON.parse(block.content) 
        : block.content
      
      let updated = false
      const newContent = JSON.parse(JSON.stringify(content))
      
      // URL dönüştürme fonksiyonu
      function convertUrl(url) {
        if (!url || typeof url !== 'string') return url
        
        // Supabase Storage URL'ini tespit et
        if (url.includes('/storage/v1/object/public/wellnesstal/')) {
          // Path'i çıkar
          const pathMatch = url.match(/\/storage\/v1\/object\/public\/wellnesstal\/(.+)$/)
          if (pathMatch && pathMatch[1]) {
            const path = pathMatch[1]
            // Kendi domain'inden proxy URL'e çevir
            const newUrl = `${siteUrl}/api/images/${path}`
            updated = true
            return newUrl
          }
        }
        
        // Eski Supabase URL formatını da kontrol et
        if (url.includes('supabase.co') && url.includes('wellnesstal')) {
          const pathMatch = url.match(/wellnesstal\/(.+)$/)
          if (pathMatch && pathMatch[1]) {
            const path = pathMatch[1]
            const newUrl = `${siteUrl}/api/images/${path}`
            updated = true
            return newUrl
          }
        }
        
        return url
      }
      
      // Image URL'lerini dönüştür
      if (newContent.image?.url) {
        const convertedUrl = convertUrl(newContent.image.url)
        if (convertedUrl !== newContent.image.url) {
          newContent.image.url = convertedUrl
          console.log(`✅ Block ${block.id} (${block.block_type}): Image URL dönüştürüldü`)
          console.log(`   Eski: ${content.image.url.substring(0, 80)}...`)
          console.log(`   Yeni: ${convertedUrl.substring(0, 80)}...`)
        }
      }
      
      // Images array'i kontrol et (gallery için)
      if (Array.isArray(newContent.images)) {
        newContent.images = newContent.images.map((img, index) => {
          if (img.url) {
            const convertedUrl = convertUrl(img.url)
            if (convertedUrl !== img.url) {
              updated = true
              console.log(`✅ Block ${block.id} (${block.block_type}): Image ${index + 1} URL dönüştürüldü`)
              return { ...img, url: convertedUrl }
            }
          }
          return img
        })
      }
      
      // Tüm content'i recursive olarak kontrol et
      function convertUrlsInObject(obj) {
        for (const key in obj) {
          if (obj[key] && typeof obj[key] === 'object') {
            if (Array.isArray(obj[key])) {
              obj[key] = obj[key].map(item => {
                if (typeof item === 'object') {
                  convertUrlsInObject(item)
                }
                return item
              })
            } else {
              convertUrlsInObject(obj[key])
            }
          } else if (typeof obj[key] === 'string' && (key === 'url' || key.endsWith('Url') || key.endsWith('_url'))) {
            const convertedUrl = convertUrl(obj[key])
            if (convertedUrl !== obj[key]) {
              obj[key] = convertedUrl
              updated = true
            }
          }
        }
      }
      
      convertUrlsInObject(newContent)
      
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
          migratedCount++
        }
      }
    }
    
    // Media files tablosunu da güncelle
    console.log('\n📸 Media Files tablosu güncelleniyor...\n')
    
    // convertUrl fonksiyonunu tekrar tanımla (scope dışında)
    function convertMediaUrl(url) {
      if (!url || typeof url !== 'string') return url
      
      if (url.includes('/storage/v1/object/public/wellnesstal/')) {
        const pathMatch = url.match(/\/storage\/v1\/object\/public\/wellnesstal\/(.+)$/)
        if (pathMatch && pathMatch[1]) {
          return `${siteUrl}/api/images/${pathMatch[1]}`
        }
      }
      
      if (url.includes('supabase.co') && url.includes('wellnesstal')) {
        const pathMatch = url.match(/wellnesstal\/(.+)$/)
        if (pathMatch && pathMatch[1]) {
          return `${siteUrl}/api/images/${pathMatch[1]}`
        }
      }
      
      return url
    }
    
    const { data: mediaFiles, error: mediaError } = await supabase
      .from('media_files')
      .select('id, file_path')
    
    if (!mediaError && mediaFiles) {
      let mediaCount = 0
      for (const media of mediaFiles) {
        const convertedUrl = convertMediaUrl(media.file_path)
        if (convertedUrl !== media.file_path) {
          const { error: updateError } = await supabase
            .from('media_files')
            .update({ 
              file_path: convertedUrl,
              updated_at: new Date().toISOString()
            })
            .eq('id', media.id)
          
          if (!updateError) {
            mediaCount++
            console.log(`✅ Media File ${media.id} güncellendi`)
          }
        }
      }
      console.log(`📸 ${mediaCount} media file güncellendi`)
    }
    
    console.log('\n' + '=' .repeat(60))
    console.log('📊 ÖZET')
    console.log('=' .repeat(60))
    console.log(`✅ Dönüştürülen block'lar: ${migratedCount}`)
    console.log(`🌐 Yeni URL formatı: ${siteUrl}/api/images/...`)
    console.log('\n✅ Migrasyon tamamlandı!')
    
  } catch (error) {
    console.error('❌ Hata:', error)
    process.exit(1)
  }
}

migrateUrls().catch(console.error)

