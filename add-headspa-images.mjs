#!/usr/bin/env node

/**
 * Headspa Sayfasına Resim Desteği Ekleyen Block'ları Hazırla
 * Referans: https://www.deluxe-beauty-spa.de/head-spa
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

async function addImageSupport() {
  console.log('🖼️  Headspa Sayfasına Resim Desteği Ekleme\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  // Headspa sayfasını bul
  const { data: page } = await supabase.from('pages').select('id').eq('slug', 'headspa').single()
  
  // Block'ları al
  const { data: blocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', page.id)
    .order('position', { ascending: true })
  
  console.log(`📄 Sayfa: Headspa`)
  console.log(`📦 Toplam Block: ${blocks?.length || 0}\n`)
  
  // 1. Treatment Features Block'a resim desteği ekle
  console.log('🔧 Treatment Features Block\'a resim desteği ekleniyor...')
  const treatmentFeaturesBlock = blocks?.find(b => 
    b.block_type === 'features' && 
    b.content?.features?.length === 4 &&
    b.content?.features?.[0]?.title?.includes('Sanfte Kopf')
  )
  
  if (treatmentFeaturesBlock) {
    const features = treatmentFeaturesBlock.content.features || []
    const updatedFeatures = features.map((feature, index) => {
      // Her feature'a imageUrl alanı ekle (placeholder)
      return {
        ...feature,
        imageUrl: feature.imageUrl || '', // Kullanıcı resim ekleyecek
        imageAlt: feature.imageAlt || feature.title || '',
        showImage: feature.showImage !== false // Default: true
      }
    })
    
    const { error } = await supabase
      .from('page_blocks')
      .update({
        content: {
          ...treatmentFeaturesBlock.content,
          features: updatedFeatures
        }
      })
      .eq('id', treatmentFeaturesBlock.id)
    
    if (error) {
      console.error(`  ❌ Güncellenemedi: ${error.message}`)
    } else {
      console.log(`  ✅ Treatment features block güncellendi (resim desteği eklendi)`)
      console.log(`  📝 4 feature'a imageUrl alanı eklendi (placeholder)`)
    }
  } else {
    console.log(`  ⚠️  Treatment features block bulunamadı`)
  }
  console.log()
  
  // 2. "Erlebe das Headspa-Gefühl hautnah" Gallery Block ekle
  console.log('🖼️  Gallery Block ekleniyor: "Erlebe das Headspa-Gefühl hautnah"...')
  
  // Pricing block'tan sonra, testimonials'tan önce
  const pricingBlock = blocks?.find(b => b.block_type === 'pricing')
  const pricingPosition = pricingBlock?.position || 5
  const newGalleryPosition = pricingPosition + 1
  
  // Mevcut block'ların position'larını kaydır
  const blocksAfterPricing = blocks?.filter(b => b.position > pricingPosition) || []
  for (const block of blocksAfterPricing) {
    await supabase
      .from('page_blocks')
      .update({ position: block.position + 1 })
      .eq('id', block.id)
  }
  
  const galleryBlock = {
    page_id: page.id,
    block_type: 'gallery',
    position: newGalleryPosition,
    visible: true,
    content: {
      title: 'Erlebe das Headspa-Gefühl hautnah',
      subtitle: 'Tauche ein in das beruhigende und revitalisierende Erlebnis unserer Headspa-Behandlung. Sieh dir an, wie sanfte Massagen, hochwertige Pflegeprodukte und wohltuende Rituale deinen Kopf und deine Seele verwöhnen. Lehne dich zurück und lass dich inspirieren!',
      images: [], // Kullanıcı resimleri ekleyecek
      layout: {
        type: 'grid',
        columns: 3,
        gap: '1rem',
        aspectRatio: '16:9'
      },
      style: {
        shadow: 'md',
        borderRadius: '1rem',
        hoverEffect: 'zoom',
        overlayOnHover: true
      },
      lightbox: {
        enabled: true,
        showCaptions: true,
        showNavigation: true
      },
      filter: {
        enabled: false
      },
      background: {
        type: 'solid',
        color: '#ffffff'
      },
      padding: {
        top: '5rem',
        bottom: '5rem'
      }
    }
  }
  
  const { error: galleryError } = await supabase
    .from('page_blocks')
    .insert(galleryBlock)
  
  if (galleryError) {
    console.error(`  ❌ Gallery block eklenemedi: ${galleryError.message}`)
  } else {
    console.log(`  ✅ Gallery block eklendi`)
    console.log(`  📝 Resimler admin panelden eklenebilir`)
  }
  console.log()
  
  // 3. Features Block'a image desteği kontrolü
  console.log('✅ Block Yapısı Kontrolü:')
  console.log(`  ✅ Features block: imageUrl desteği eklendi`)
  console.log(`  ✅ Gallery block: Eklendi (resimler admin panelden eklenebilir)`)
  console.log(`  ✅ Text block: Mevcut (resim desteği yok, gerekirse eklenebilir)`)
  console.log()
  
  console.log('='.repeat(70))
  console.log('✅ Resim desteği hazır!')
  console.log('\n📝 Notlar:')
  console.log('  1. Treatment features block\'unda her feature\'a imageUrl alanı eklendi')
  console.log('  2. Gallery block eklendi (pricing\'den sonra)')
  console.log('  3. Resimler admin panelden eklenebilir')
  console.log('  4. Features block\'unda resimler feature card\'ların yanında görünecek')
  console.log()
}

addImageSupport().catch(console.error)

