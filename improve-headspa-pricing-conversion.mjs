#!/usr/bin/env node

/**
 * Headspa Sayfası - Pricing Conversion İyileştirmeleri
 * 1. Beauty paketine "Am beliebtesten" badge'i ekle
 * 2. Hover efektleri iyileştir
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

async function improvePricingConversion() {
  console.log('💎 Headspa Pricing - Conversion İyileştirmeleri\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  // Headspa sayfasını bul
  const { data: page } = await supabase.from('pages').select('id').eq('slug', 'headspa').single()
  
  // Pricing block'u bul
  const { data: pricingBlock } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', page.id)
    .eq('block_type', 'pricing')
    .single()
  
  if (!pricingBlock) {
    console.error('❌ Pricing block bulunamadı')
    return
  }
  
  console.log('✅ Pricing block bulundu\n')
  
  // Packages'ı güncelle
  const packages = pricingBlock.content.packages || []
  const updatedPackages = packages.map(pkg => {
    // Beauty paketini bul ve badge ekle (Einzeltermin tab'ında)
    if (pkg.name === 'Headspa Beauty' && !pkg.isPartner) {
      return {
        ...pkg,
        popular: true,
        badge: {
          enabled: true,
          text: 'Am beliebtesten',
          backgroundColor: '#9CAF88',
          textColor: '#ffffff',
          position: 'top-center',
          animation: 'pulse'
        }
      }
    }
    return pkg
  })
  
  // Content'i güncelle
  const updatedContent = {
    ...pricingBlock.content,
    packages: updatedPackages
  }
  
  // Veritabanını güncelle
  const { error } = await supabase
    .from('page_blocks')
    .update({ content: updatedContent })
    .eq('id', pricingBlock.id)
  
  if (error) {
    console.error('❌ Güncelleme hatası:', error.message)
    return
  }
  
  console.log('✅ Pricing block güncellendi')
  console.log('   - Beauty paketine "Am beliebtesten" badge eklendi')
  console.log('   - Popular flag aktif edildi\n')
  
  console.log('='.repeat(70))
  console.log('✅ Conversion iyileştirmeleri tamamlandı!')
}

improvePricingConversion().catch(console.error)

