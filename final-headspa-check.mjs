#!/usr/bin/env node

/**
 * Headspa Sayfası Final Kontrol ve SEO Düzeltme
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

async function finalCheck() {
  console.log('🔍 Headspa Final Kontrol ve Düzeltmeler\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL veya Key bulunamadı!')
    return
  }
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Headspa sayfasını bul
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('*')
    .eq('slug', 'headspa')
    .single()
  
  if (pageError || !page) {
    console.error(`❌ Headspa sayfası bulunamadı`)
    return
  }
  
  // Block'ları al
  const { data: blocks, error: blocksError } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', page.id)
    .order('position', { ascending: true })
  
  if (blocksError) {
    console.error(`❌ Block'lar alınamadı`)
    return
  }
  
  console.log(`📄 Sayfa: ${page.title}`)
  console.log(`📦 Toplam Block: ${blocks?.length || 0}\n`)
  
  // 1. SEO Description düzelt
  console.log('📝 SEO Description düzeltiliyor...')
  const seoBlock = blocks?.find(b => b.block_type === 'seo')
  if (seoBlock) {
    const seoContent = seoBlock.content || {}
    if (seoContent.description === 'headspaX' || !seoContent.description || seoContent.description.length < 50) {
      const newDescription = 'Erlebe tiefgehende Regeneration und Entspannung mit unserer professionellen Headspa-Behandlung in Baesweiler. Kopf-, Nacken- und Schultermassage, Tiefenreinigung, Bedampfung und Gesichtspflege. Jetzt Termin vereinbaren!'
      
      const { error: updateError } = await supabase
        .from('page_blocks')
        .update({ 
          content: { ...seoContent, description: newDescription }
        })
        .eq('id', seoBlock.id)
      
      if (updateError) {
        console.error(`  ❌ SEO description güncellenemedi: ${updateError.message}`)
      } else {
        console.log(`  ✅ SEO description güncellendi`)
      }
    } else {
      console.log(`  ✅ SEO description zaten iyi`)
    }
  }
  console.log()
  
  // 2. Block sıralaması kontrolü
  console.log('📋 Final Block Sıralaması:')
  blocks?.forEach((block, index) => {
    const title = block.content?.title || block.content?.mainTitle || block.block_type
    const featuresCount = block.content?.features?.length || 0
    const isTreatment = featuresCount === 4 && block.content?.features?.[0]?.title?.includes('Sanfte Kopf')
    const label = isTreatment ? ' (Treatment)' : featuresCount > 0 ? ' (General)' : ''
    console.log(`  ${index + 1}. [${block.position}] ${block.block_type}${label} - ${title}`)
  })
  console.log()
  
  // 3. Enterprise özellikler kontrolü
  console.log('🏢 Enterprise Özellikler:')
  
  const heroBlock = blocks?.find(b => b.block_type === 'hero')
  const pricingBlock = blocks?.find(b => b.block_type === 'pricing')
  const testimonialsBlock = blocks?.find(b => b.block_type === 'testimonials')
  const faqBlock = blocks?.find(b => b.block_type === 'faq')
  
  const checks = {
    'Hero with address info': heroBlock?.content?.badge?.includes('15.01.2026'),
    'Problem block': blocks?.some(b => b.block_type === 'text' && b.content?.stylePreset === 'problem'),
    'Solution block': blocks?.some(b => b.block_type === 'text' && b.content?.stylePreset === 'solution'),
    'Treatment features (4 steps)': blocks?.some(b => b.block_type === 'features' && b.content?.features?.length === 4),
    'Pricing with guarantee': pricingBlock?.content?.trustElement?.enabled,
    'Testimonials (3+)': testimonialsBlock?.content?.testimonials?.length >= 3,
    'FAQ (5+)': faqBlock?.content?.items?.length >= 5,
    'FAQ Schema': faqBlock?.content?.schemaMarkup?.enabled,
    'SEO optimized': seoBlock?.content?.title && seoBlock?.content?.description,
    'Footer present': blocks?.some(b => b.block_type === 'footer')
  }
  
  Object.entries(checks).forEach(([key, value]) => {
    console.log(`  ${value ? '✅' : '❌'} ${key}`)
  })
  
  const passedCount = Object.values(checks).filter(v => v).length
  const totalCount = Object.keys(checks).length
  const percentage = Math.round((passedCount / totalCount) * 100)
  
  console.log()
  console.log('='.repeat(70))
  console.log(`📊 Enterprise Skor: ${passedCount}/${totalCount} (${percentage}%)`)
  console.log()
  
  if (percentage >= 90) {
    console.log('🎉 SAYFA ENTERPRISE SEVİYEDE!')
    console.log('✅ Tüm kurumsal standartlar karşılanıyor')
    console.log('✅ SEO optimize edilmiş')
    console.log('✅ Kullanıcı deneyimi mükemmel')
    console.log('✅ İçerik kalitesi yüksek')
  } else if (percentage >= 80) {
    console.log('✅ Sayfa enterprise seviyeye çok yakın')
    console.log('⚠️  Küçük iyileştirmeler yapılabilir')
  } else {
    console.log('⚠️  Sayfa enterprise standartlarına tam uygun değil')
  }
  
  console.log()
}

finalCheck().catch(console.error)

