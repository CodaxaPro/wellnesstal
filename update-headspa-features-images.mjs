#!/usr/bin/env node

/**
 * Headspa Treatment Features Block'una Resim Yapısını Güncelle
 * Referans sayfaya göre: Her treatment feature'ın yanında resim olmalı
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
    return null
  }
}

async function updateFeaturesImages() {
  console.log('🖼️  Treatment Features Block Resim Yapısı Güncelleme\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  const { data: page } = await supabase.from('pages').select('id').eq('slug', 'headspa').single()
  const { data: blocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', page.id)
    .order('position', { ascending: true })
  
  // Treatment Features Block'u bul
  const treatmentFeaturesBlock = blocks?.find(b => 
    b.block_type === 'features' && 
    b.content?.features?.length === 4 &&
    b.content?.features?.[0]?.title?.includes('Sanfte Kopf')
  )
  
  if (!treatmentFeaturesBlock) {
    console.log('❌ Treatment features block bulunamadı')
    return
  }
  
  console.log('✅ Treatment features block bulundu\n')
  
  // Features'ları güncelle - image yapısını düzelt
  const features = treatmentFeaturesBlock.content.features || []
  const updatedFeatures = features.map((feature, index) => {
    // FeatureImage yapısına göre güncelle
    const imageUrl = feature.imageUrl || feature.image?.url || ''
    
    return {
      ...feature,
      // Eski imageUrl'yi image objesine taşı
      image: imageUrl ? {
        url: imageUrl,
        alt: feature.imageAlt || feature.title || '',
        aspectRatio: '16:9',
        objectFit: 'cover',
        borderRadius: '1rem'
      } : undefined,
      // Eski alanları temizle
      imageUrl: undefined,
      imageAlt: undefined,
      showImage: undefined
    }
  })
  
  // Layout'u image-friendly yap
  const updatedContent = {
    ...treatmentFeaturesBlock.content,
    features: updatedFeatures,
    // Layout'u zigzag yap (resim ve içerik yan yana)
    layout: 'zigzag',
    // Icon'ları gizle, resimler gösterilsin
    showIcons: false,
    iconStyles: {
      ...treatmentFeaturesBlock.content.iconStyles,
      showIcons: false
    }
  }
  
  const { error } = await supabase
    .from('page_blocks')
    .update({ content: updatedContent })
    .eq('id', treatmentFeaturesBlock.id)
  
  if (error) {
    console.error(`❌ Güncellenemedi: ${error.message}`)
  } else {
    console.log('✅ Treatment features block güncellendi')
    console.log('  📝 Layout: zigzag (resim ve içerik yan yana)')
    console.log('  📝 Icon\'lar gizlendi (resimler gösterilecek)')
    console.log('  📝 Her feature\'a image objesi eklendi')
    console.log('  📝 Resimler admin panelden eklenebilir')
  }
  
  console.log()
  console.log('='.repeat(70))
  console.log('✅ Resim yapısı hazır!')
  console.log('\n📝 Kullanım:')
  console.log('  1. Admin panelden treatment features block\'unu aç')
  console.log('  2. Her feature için "Image" alanına resim ekle')
  console.log('  3. Resimler otomatik olarak feature card\'ların yanında görünecek')
  console.log()
}

updateFeaturesImages().catch(console.error)

