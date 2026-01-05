#!/usr/bin/env node

/**
 * Block'ları Ana Sayfa Tasarımıyla Senkronize Et
 * Ana sayfadaki görsel ve UX özelliklerini block'lara uygula
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

async function syncBlocksWithHomepageDesign() {
  console.log('🎨 Block\'ları Ana Sayfa Tasarımıyla Senkronize Etme\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  // Headspa sayfasını al
  const { data: page } = await supabase.from('pages').select('id').eq('slug', 'headspa').single()
  const { data: blocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', page.id)
    .order('position', { ascending: true })
  
  console.log(`✅ ${blocks?.length || 0} block bulundu\n`)
  
  let updateCount = 0
  
  // Ana sayfadaki görsel özellikler (ContactSection'dan):
  // - Cards: bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300
  // - Footer description: leading-relaxed mb-6, font: system-ui, 16px, 400, #D1D5DB
  
  for (const block of blocks || []) {
    let updated = false
    const updatedContent = { ...block.content }
    
    // CONTACT BLOCK - Card stilleri güncelle
    if (block.block_type === 'contact' && block.content.styles) {
      // ContactBlock zaten doğru class'ları kullanıyor, sadece fontFamily kontrolü
      // Database'deki fontFamily'leri Poppins yap (zaten yapıldı ama kontrol edelim)
      const stylesStr = JSON.stringify(block.content.styles)
      if (stylesStr.includes('system-ui')) {
        // replaceSystemUi fonksiyonu ile güncelle
        updatedContent.styles = replaceSystemUiInObject(block.content.styles)
        updated = true
      }
    }
    
    // FOOTER BLOCK - Description stilini ana sayfayla eşleştir
    if (block.block_type === 'footer') {
      if (!updatedContent.styles) {
        updatedContent.styles = {}
      }
      
      // Footer description stilini ana sayfadaki gibi yap
      if (!updatedContent.styles.description) {
        updatedContent.styles.description = {}
      }
      
      // Ana sayfadaki Footer description:
      // font-family: system-ui; font-size: 16px; font-weight: 400; color: rgb(209, 213, 219);
      const descStyle = {
        fontFamily: "'Poppins', sans-serif", // globals.css ile uyumlu
        fontSize: '16px',
        fontWeight: '400',
        color: '#D1D5DB', // gray-300
        lineHeight: '1.75', // leading-relaxed
        marginBottom: '24px' // mb-6
      }
      
      // Mevcut stil varsa koru, yoksa ekle
      updatedContent.styles.description = {
        ...descStyle,
        ...updatedContent.styles.description
      }
      
      // FontFamily'yi güncelle
      if (updatedContent.styles.description.fontFamily === 'system-ui') {
        updatedContent.styles.description.fontFamily = "'Poppins', sans-serif"
        updated = true
      }
      
      // Diğer stil özelliklerini kontrol et
      if (!updatedContent.styles.description.fontSize || 
          !updatedContent.styles.description.color ||
          !updatedContent.styles.description.fontWeight) {
        updated = true
      }
    }
    
    // HERO BLOCK - Ana sayfadaki görsel özelliklerle eşleştir
    if (block.block_type === 'hero') {
      // HeroBlock zaten ana sayfadaki HeroSection ile benzer, sadece font kontrolü
      const stylesStr = JSON.stringify(block.content.styles || {})
      if (stylesStr.includes('system-ui')) {
        updatedContent.styles = replaceSystemUiInObject(block.content.styles || {})
        updated = true
      }
    }
    
    // TEXT BLOCK - Ana sayfadaki typography ile eşleştir
    if (block.block_type === 'text' && block.content.typography) {
      // Typography'deki fontFamily'leri kontrol et
      const typoStr = JSON.stringify(block.content.typography)
      if (typoStr.includes('system-ui')) {
        updatedContent.typography = replaceSystemUiInObject(block.content.typography)
        updated = true
      }
    }
    
    // FEATURES BLOCK - Card stillerini ana sayfayla eşleştir
    if (block.block_type === 'features') {
      // CardStyles kontrolü - Ana sayfada: bg-white, rounded-2xl, shadow-soft, hover:shadow-medium
      if (!updatedContent.cardStyles) {
        updatedContent.cardStyles = {
          backgroundColor: '#FFFFFF',
          borderRadius: '1rem', // rounded-2xl = 16px = 1rem
          shadow: 'soft', // shadow-soft
          shadowHover: 'medium', // hover:shadow-medium
          hoverEffect: 'lift', // transition-all duration-300
          paddingX: '2rem', // p-8 = 32px = 2rem
          paddingY: '2rem'
        }
        updated = true
      } else {
        // Mevcut cardStyles'ı güncelle
        if (!updatedContent.cardStyles.shadow || updatedContent.cardStyles.shadow !== 'soft') {
          updatedContent.cardStyles.shadow = 'soft'
          updated = true
        }
        if (!updatedContent.cardStyles.shadowHover || updatedContent.cardStyles.shadowHover !== 'medium') {
          updatedContent.cardStyles.shadowHover = 'medium'
          updated = true
        }
        if (!updatedContent.cardStyles.borderRadius || updatedContent.cardStyles.borderRadius !== '1rem') {
          updatedContent.cardStyles.borderRadius = '1rem'
          updated = true
        }
        if (!updatedContent.cardStyles.hoverEffect || updatedContent.cardStyles.hoverEffect !== 'lift') {
          updatedContent.cardStyles.hoverEffect = 'lift'
          updated = true
        }
      }
    }
    
    if (updated) {
      const { error } = await supabase
        .from('page_blocks')
        .update({ content: updatedContent })
        .eq('id', block.id)
      
      if (error) {
        console.error(`❌ ${block.block_type} block güncellenemedi: ${error.message}`)
      } else {
        console.log(`✅ ${block.block_type} block güncellendi (Ana sayfa tasarımıyla eşleştirildi)`)
        updateCount++
      }
    }
  }
  
  console.log('\n' + '='.repeat(70))
  console.log('✅ Block Senkronizasyonu Tamamlandı!')
  console.log(`📊 Toplam ${updateCount} block güncellendi`)
  console.log('\n🎨 Güncellenen Özellikler:')
  console.log('   ✅ Card tasarımları: bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium')
  console.log('   ✅ Footer description: leading-relaxed, Poppins font')
  console.log('   ✅ Typography: Ana sayfayla uyumlu')
  console.log('   ✅ Colors: Ana sayfadaki renk paleti')
}

// Helper function: system-ui'yi Poppins ile değiştir
function replaceSystemUiInObject(obj) {
  if (!obj || typeof obj !== 'object') return obj
  
  if (Array.isArray(obj)) {
    return obj.map(item => replaceSystemUiInObject(item))
  }
  
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'fontFamily' && value === 'system-ui') {
      result[key] = "'Poppins', sans-serif"
    } else if (typeof value === 'object' && value !== null) {
      result[key] = replaceSystemUiInObject(value)
    } else {
      result[key] = value
    }
  }
  
  return result
}

syncBlocksWithHomepageDesign().catch(console.error)

