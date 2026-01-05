#!/usr/bin/env node

/**
 * Headspa Sayfası - Meta Keywords ve Title Optimizasyonu
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

async function optimizeMetaAndKeywords() {
  console.log('📝 Headspa - Meta Keywords & Title Optimizasyonu\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'headspa')
    .single()
  
  if (pageError || !page) {
    console.error(`❌ Headspa sayfası bulunamadı: ${pageError?.message}`)
    return
  }
  
  // Meta Title Optimizasyonu (CTR için)
  const optimizedTitle = 'Japanisches Head Spa Baesweiler & Aachen – Kopfmassage & Entspannung | Wellnesstal'
  
  // Keywords Optimizasyonu - Yerel SEO anahtar kelimeleri ekle
  const currentKeywords = page.meta_keywords || []
  const newKeywords = [
    'japanisches head spa',
    'japanisches head spa baesweiler',
    'japanisches head spa aachen',
    'kopfmassage baesweiler',
    'kopfmassage aachen',
    'aachen wellness',
    'wellness baesweiler',
    'headspa baesweiler',
    'headspa aachen',
    'japanese headspa',
    'kopfhautpflege baesweiler',
    'entspannung baesweiler',
    'entspannung aachen',
    'professionelle kopfmassage',
    'headspa behandlung'
  ]
  
  // Mevcut keywords'leri koru, yeni olanları ekle
  const allKeywords = [...new Set([...currentKeywords, ...newKeywords])]
  
  // Meta Title güncelle
  const { error: titleError } = await supabase
    .from('pages')
    .update({ 
      meta_title: optimizedTitle,
      meta_keywords: allKeywords
    })
    .eq('id', page.id)
  
  if (titleError) {
    console.error(`❌ Meta title/keywords güncellenemedi: ${titleError.message}`)
    return
  }
  
  console.log('✅ Meta title güncellendi:')
  console.log('   Yeni:', optimizedTitle)
  console.log('\n✅ Meta keywords güncellendi:')
  console.log('   Toplam', allKeywords.length, 'keyword')
  console.log('   Yeni eklenenler:', newKeywords.filter(k => !currentKeywords.includes(k)).join(', '))
  
  console.log('\n' + '='.repeat(70))
  console.log('✅ Meta & Keywords Optimizasyonu Tamamlandı!')
}

optimizeMetaAndKeywords().catch(console.error)

