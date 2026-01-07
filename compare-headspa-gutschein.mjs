import { createClient } from '@supabase/supabase-js'
import fs from 'fs'

function loadEnvFile() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf-8')
    const envVars = {}
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/)
      if (match) {
        envVars[match[1].trim()] = match[2].trim()
      }
    })
    return envVars
  } catch (error) {
    return null
  }
}

const envVars = loadEnvFile()
if (!envVars) {
  console.error('❌ .env.local dosyası bulunamadı')
  process.exit(1)
}

const supabase = createClient(
  envVars['NEXT_PUBLIC_SUPABASE_URL'],
  envVars['SUPABASE_SERVICE_ROLE_KEY']
)

async function comparePages() {
  console.log('🔍 Headspa ve Gutschein sayfalarını karşılaştırılıyor...\n')
  
  // Headspa sayfası
  const { data: headspaPage } = await supabase
    .from('pages')
    .select('id, slug, title')
    .eq('slug', 'headspa')
    .single()
  
  // Gutschein sayfası
  const { data: gutscheinPage } = await supabase
    .from('pages')
    .select('id, slug, title')
    .or('slug.eq.gutschein,slug.ilike.%gutschein%')
    .maybeSingle()
  
  if (!headspaPage) {
    console.error('❌ Headspa sayfası bulunamadı!')
    return
  }
  
  if (!gutscheinPage) {
    console.error('❌ Gutschein sayfası bulunamadı!')
    return
  }
  
  console.log(`✅ Headspa: ${headspaPage.slug} (ID: ${headspaPage.id})`)
  console.log(`✅ Gutschein: ${gutscheinPage.slug} (ID: ${gutscheinPage.id})\n`)
  
  // Headspa blokları
  const { data: headspaBlocks } = await supabase
    .from('page_blocks')
    .select('id, block_type, content, position, visible')
    .eq('page_id', headspaPage.id)
    .eq('visible', true)
    .order('position', { ascending: true })
  
  // Gutschein blokları
  const { data: gutscheinBlocks } = await supabase
    .from('page_blocks')
    .select('id, block_type, content, position, visible')
    .eq('page_id', gutscheinPage.id)
    .eq('visible', true)
    .order('position', { ascending: true })
  
  console.log('📦 HEADSPA BLOCKLARI:')
  console.log('='.repeat(70))
  headspaBlocks?.forEach((block, index) => {
    const sectionId = block.content?.sectionId
    console.log(`${index + 1}. ${block.block_type.toUpperCase()}`)
    console.log(`   Position: ${block.position}`)
    console.log(`   sectionId: ${sectionId || '❌ YOK!'}`)
    if (block.block_type === 'hero') {
      console.log(`   Hero Content Keys: ${Object.keys(block.content || {}).join(', ')}`)
    }
    console.log('')
  })
  
  console.log('\n📦 GUTSCHEIN BLOCKLARI:')
  console.log('='.repeat(70))
  gutscheinBlocks?.forEach((block, index) => {
    const sectionId = block.content?.sectionId
    console.log(`${index + 1}. ${block.block_type.toUpperCase()}`)
    console.log(`   Position: ${block.position}`)
    console.log(`   sectionId: ${sectionId || '❌ YOK!'}`)
    if (block.block_type === 'hero') {
      console.log(`   Hero Content Keys: ${Object.keys(block.content || {}).join(', ')}`)
    }
    console.log('')
  })
  
  // Hero block karşılaştırması
  const headspaHero = headspaBlocks?.find(b => b.block_type === 'hero')
  const gutscheinHero = gutscheinBlocks?.find(b => b.block_type === 'hero')
  
  console.log('\n🔍 HERO BLOCK KARŞILAŞTIRMASI:')
  console.log('='.repeat(70))
  console.log('HEADSPA Hero:')
  console.log(`  sectionId: ${headspaHero?.content?.sectionId || '❌ YOK!'}`)
  console.log(`  Content: ${JSON.stringify(headspaHero?.content?.sectionId ? { sectionId: headspaHero.content.sectionId } : 'NO SECTIONID', null, 2)}`)
  
  console.log('\nGUTSCHEIN Hero:')
  console.log(`  sectionId: ${gutscheinHero?.content?.sectionId || '❌ YOK!'}`)
  console.log(`  Content: ${JSON.stringify(gutscheinHero?.content?.sectionId ? { sectionId: gutscheinHero.content.sectionId } : 'NO SECTIONID', null, 2)}`)
  
  // Pricing block karşılaştırması
  const headspaPricing = headspaBlocks?.find(b => b.block_type === 'pricing')
  const gutscheinPricing = gutscheinBlocks?.find(b => b.block_type === 'pricing')
  
  console.log('\n🔍 PRICING BLOCK KARŞILAŞTIRMASI:')
  console.log('='.repeat(70))
  console.log('HEADSPA Pricing:')
  console.log(`  sectionId: ${headspaPricing?.content?.sectionId || '❌ YOK!'}`)
  
  console.log('\nGUTSCHEIN Pricing:')
  console.log(`  sectionId: ${gutscheinPricing?.content?.sectionId || '❌ YOK!'}`)
  
  // Gutschein hero block'u düzelt
  if (gutscheinHero && (!gutscheinHero.content?.sectionId || gutscheinHero.content.sectionId !== 'gutschein')) {
    console.log('\n🔧 Gutschein Hero block sectionId düzeltiliyor...')
    const updatedContent = {
      ...gutscheinHero.content,
      sectionId: 'gutschein'
    }
    const { error } = await supabase
      .from('page_blocks')
      .update({ content: updatedContent })
      .eq('id', gutscheinHero.id)
    if (error) {
      console.error('❌ Güncelleme hatası:', error.message)
    } else {
      console.log('✅ Gutschein Hero block sectionId güncellendi: gutschein')
    }
  }
  
  // Gutschein pricing block'u düzelt
  if (gutscheinPricing && (!gutscheinPricing.content?.sectionId || gutscheinPricing.content.sectionId !== 'pricing')) {
    console.log('\n🔧 Gutschein Pricing block sectionId düzeltiliyor...')
    const updatedContent = {
      ...gutscheinPricing.content,
      sectionId: 'pricing'
    }
    const { error } = await supabase
      .from('page_blocks')
      .update({ content: updatedContent })
      .eq('id', gutscheinPricing.id)
    if (error) {
      console.error('❌ Güncelleme hatası:', error.message)
    } else {
      console.log('✅ Gutschein Pricing block sectionId güncellendi: pricing')
    }
  }
}

comparePages().catch(console.error)

