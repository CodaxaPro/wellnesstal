#!/usr/bin/env node

/**
 * Check All Images - Sistemik Kontrol
 * 
 * Tüm block'lardaki resimleri kontrol eder ve sorunları raporlar
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

async function checkAllImages() {
  console.log('🔍 Tüm Resimler Kontrol Ediliyor...\n')
  console.log('=' .repeat(60))
  
  const issues = []
  const fixed = []
  
  try {
    // Tüm block'ları al
    const { data: blocks, error: blocksError } = await supabase
      .from('page_blocks')
      .select('id, block_type, content, page_id')
      .order('page_id')
    
    if (blocksError) {
      console.error('❌ Block\'lar alınamadı:', blocksError.message)
      return
    }
    
    console.log(`📊 Toplam ${blocks?.length || 0} block bulundu\n`)
    
    for (const block of blocks || []) {
      const content = typeof block.content === 'string' 
        ? JSON.parse(block.content) 
        : block.content
      
      let hasImage = false
      let imageUrls = []
      
      // Image URL'lerini bul
      function findImageUrls(obj, path = '') {
        if (!obj || typeof obj !== 'object') return
        
        if (Array.isArray(obj)) {
          obj.forEach((item, index) => {
            findImageUrls(item, `${path}[${index}]`)
          })
        } else {
          for (const key in obj) {
            const value = obj[key]
            const currentPath = path ? `${path}.${key}` : key
            
            if (key === 'url' || key === 'imageUrl' || key.endsWith('Url') || key.endsWith('_url')) {
              if (typeof value === 'string' && (value.includes('image') || value.includes('.jpg') || value.includes('.png') || value.includes('.jpeg') || value.includes('.webp'))) {
                imageUrls.push({
                  path: currentPath,
                  url: value,
                  blockId: block.id,
                  blockType: block.block_type
                })
                hasImage = true
              }
            } else if (key === 'images' && Array.isArray(value)) {
              value.forEach((img, index) => {
                if (img.url) {
                  imageUrls.push({
                    path: `${currentPath}[${index}].url`,
                    url: img.url,
                    blockId: block.id,
                    blockType: block.block_type
                  })
                  hasImage = true
                }
              })
            } else if (typeof value === 'object' && value !== null) {
              findImageUrls(value, currentPath)
            }
          }
        }
      }
      
      findImageUrls(content)
      
      // Her URL'i kontrol et
      for (const img of imageUrls) {
        // URL formatını kontrol et
        const isOwnDomain = img.url.includes('wellnesstal.de/api/images/')
        const isSupabase = img.url.includes('supabase.co/storage/')
        const isRelative = img.url.startsWith('/')
        const isLocalhost = img.url.includes('localhost')
        
        // Sorun tespiti
        if (!isOwnDomain) {
          issues.push({
            blockId: block.id,
            blockType: block.block_type,
            path: img.path,
            url: img.url,
            issue: isSupabase ? 'Supabase URL (kendi domain olmalı)' : 
                   isRelative ? 'Relative URL (full URL olmalı)' :
                   isLocalhost ? 'Localhost URL (production URL olmalı)' :
                   'Bilinmeyen format'
          })
        }
        
        // URL'yi düzelt
        if (isSupabase) {
          // Supabase URL'ini kendi domain'e çevir
          const pathMatch = img.url.match(/\/storage\/v1\/object\/public\/wellnesstal\/(.+)$/)
          if (pathMatch && pathMatch[1]) {
            const newUrl = `${siteUrl}/api/images/${pathMatch[1]}`
            
            // Update content
            const newContent = JSON.parse(JSON.stringify(content))
            const pathParts = img.path.split('.')
            let target = newContent
            for (let i = 0; i < pathParts.length - 1; i++) {
              const part = pathParts[i]
              const arrayMatch = part.match(/^(.+)\[(\d+)\]$/)
              if (arrayMatch) {
                target = target[arrayMatch[1]][parseInt(arrayMatch[2])]
              } else {
                target = target[part]
              }
            }
            const lastPart = pathParts[pathParts.length - 1]
            const arrayMatch = lastPart.match(/^(.+)\[(\d+)\]\.(.+)$/)
            if (arrayMatch) {
              target[arrayMatch[1]][parseInt(arrayMatch[2])][arrayMatch[3]] = newUrl
            } else {
              target[lastPart] = newUrl
            }
            
            // Update database
            const { error } = await supabase
              .from('page_blocks')
              .update({ 
                content: newContent,
                updated_at: new Date().toISOString()
              })
              .eq('id', block.id)
            
            if (!error) {
              fixed.push({
                blockId: block.id,
                blockType: block.block_type,
                oldUrl: img.url,
                newUrl: newUrl
              })
            }
          }
        } else if (isRelative && img.url.startsWith('/uploads/')) {
          // Relative URL'yi düzelt
          const newUrl = `${siteUrl}/api/images${img.url}`
          
          // Update logic similar to above
          const newContent = JSON.parse(JSON.stringify(content))
          const pathParts = img.path.split('.')
          let target = newContent
          for (let i = 0; i < pathParts.length - 1; i++) {
            const part = pathParts[i]
            const arrayMatch = part.match(/^(.+)\[(\d+)\]$/)
            if (arrayMatch) {
              target = target[arrayMatch[1]][parseInt(arrayMatch[2])]
            } else {
              target = target[part]
            }
          }
          const lastPart = pathParts[pathParts.length - 1]
          const arrayMatch = lastPart.match(/^(.+)\[(\d+)\]\.(.+)$/)
          if (arrayMatch) {
            target[arrayMatch[1]][parseInt(arrayMatch[2])][arrayMatch[3]] = newUrl
          } else {
            target[lastPart] = newUrl
          }
          
          const { error } = await supabase
            .from('page_blocks')
            .update({ 
              content: newContent,
              updated_at: new Date().toISOString()
            })
            .eq('id', block.id)
          
          if (!error) {
            fixed.push({
              blockId: block.id,
              blockType: block.block_type,
              oldUrl: img.url,
              newUrl: newUrl
            })
          }
        }
      }
    }
    
    // Rapor
    console.log('\n' + '=' .repeat(60))
    console.log('📊 SORUN RAPORU')
    console.log('=' .repeat(60))
    
    if (issues.length === 0) {
      console.log('✅ Tüm resimler doğru formatta!')
    } else {
      console.log(`⚠️  ${issues.length} sorunlu resim bulundu:\n`)
      issues.forEach((issue, index) => {
        console.log(`${index + 1}. Block: ${issue.blockId} (${issue.blockType})`)
        console.log(`   Path: ${issue.path}`)
        console.log(`   Sorun: ${issue.issue}`)
        console.log(`   URL: ${issue.url.substring(0, 80)}...`)
        console.log('')
      })
    }
    
    if (fixed.length > 0) {
      console.log('\n' + '=' .repeat(60))
      console.log('🔧 DÜZELTILEN RESİMLER')
      console.log('=' .repeat(60))
      fixed.forEach((fix, index) => {
        console.log(`${index + 1}. Block: ${fix.blockId} (${fix.blockType})`)
        console.log(`   Eski: ${fix.oldUrl.substring(0, 60)}...`)
        console.log(`   Yeni: ${fix.newUrl.substring(0, 60)}...`)
        console.log('')
      })
    }
    
    console.log('=' .repeat(60))
    console.log(`\n✅ Toplam: ${issues.length} sorun, ${fixed.length} düzeltildi`)
    
  } catch (error) {
    console.error('❌ Hata:', error)
    process.exit(1)
  }
}

checkAllImages().catch(console.error)

