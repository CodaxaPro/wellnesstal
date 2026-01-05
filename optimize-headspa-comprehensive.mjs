#!/usr/bin/env node

/**
 * Comprehensive Head Spa Landing Page SEO & Content Optimization
 */

import { createClient } from '@supabase/supabase-js'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config({ path: join(__dirname, '.env.local') })

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

const BAESWEILER_ADDRESS = {
  street: 'Kaiserstraße 42', // TODO: Update with actual address
  city: 'Baesweiler',
  postalCode: '52499',
  country: 'Deutschland'
}

const CTA_VARIATIONS = [
  'Jetzt Paket wählen',
  'Verfügbarkeit prüfen',
  'Dein Wellness-Moment buchen',
  'Kostenlose Beratung anfragen'
]

async function optimizeHeadspaComprehensive() {
  console.log('🚀 Comprehensive Head Spa Optimization\n')
  console.log('=' .repeat(60))
  
  const { data: page } = await supabase
    .from('pages')
    .select('id, slug, title')
    .eq('slug', 'headspa')
    .single()
  
  if (!page) {
    console.error('❌ Page not found')
    return
  }
  
  const { data: blocks } = await supabase
    .from('page_blocks')
    .select('id, block_type, content, position')
    .eq('page_id', page.id)
    .order('position')
  
  if (!blocks) return
  
  const updates = []
  const ctaPositions = []
  
  // First pass: collect CTA positions
  blocks.forEach(block => {
    if (block.block_type === 'cta') {
      ctaPositions.push(block.position)
    }
  })
  
  // Process blocks
  for (const block of blocks) {
    const content = typeof block.content === 'string' 
      ? JSON.parse(block.content) 
      : block.content
    
    let newContent = JSON.parse(JSON.stringify(content))
    let updated = false
    
    switch (block.block_type) {
      case 'text':
        updated = optimizeTextBlock(newContent)
        break
      case 'cta':
        const ctaIndex = ctaPositions.indexOf(block.position)
        updated = optimizeCTABlock(newContent, ctaIndex)
        break
      case 'faq':
        updated = optimizeFAQBlock(newContent)
        break
      case 'footer':
        updated = optimizeFooterBlock(newContent)
        break
      case 'gallery':
        // Check if empty - would need to hide or add images
        break
    }
    
    if (updated) {
      updates.push({ id: block.id, type: block.block_type, content: newContent })
    }
  }
  
  // Apply updates
  console.log(`\n🔄 Applying ${updates.length} updates...\n`)
  
  for (const update of updates) {
    const { error } = await supabase
      .from('page_blocks')
      .update({ content: update.content, updated_at: new Date().toISOString() })
      .eq('id', update.id)
    
    if (error) {
      console.error(`❌ ${update.type}:`, error.message)
    } else {
      console.log(`✅ ${update.type} updated`)
    }
  }
  
  console.log('\n✅ Optimization complete!')
}

function optimizeTextBlock(content) {
  let updated = false
  
  // Fix title - remove Aachen
  if (content.title) {
    const newTitle = content.title
      .replace(/Aachen\s*&\s*Baesweiler/gi, 'Baesweiler')
      .replace(/in Aachen & Baesweiler/gi, 'in Baesweiler')
      .replace(/Köln/gi, 'Baesweiler')
    if (newTitle !== content.title) {
      content.title = newTitle
      updated = true
      console.log(`   📝 Title fixed: "${newTitle.substring(0, 60)}..."`)
    }
  }
  
  // Fix content
  if (content.content) {
    let text = content.content
    const original = text
    
    // Remove Aachen references
    text = text.replace(/Aachen/gi, 'Baesweiler')
    text = text.replace(/Köln/gi, 'Baesweiler')
    text = text.replace(/Musterstraße 123/gi, BAESWEILER_ADDRESS.street)
    
    if (text !== original) {
      content.content = text
      updated = true
    }
  }
  
  return updated
}

function optimizeCTABlock(content, index) {
  let updated = false
  const currentText = content.buttonText || content.primaryButton?.text || ''
  
  // Only change if it's the default "Jetzt Termin buchen"
  if (currentText === 'Jetzt Termin buchen' || currentText === 'Termin Buchen') {
    if (index < CTA_VARIATIONS.length) {
      const newText = CTA_VARIATIONS[index]
      if (content.buttonText) {
        content.buttonText = newText
      } else if (content.primaryButton) {
        content.primaryButton.text = newText
      }
      updated = true
      console.log(`   ✏️  CTA ${index + 1}: "${newText}"`)
    }
  }
  
  return updated
}

function optimizeFAQBlock(content) {
  let updated = false
  
  // Remove duplicates
  if (content.items && Array.isArray(content.items)) {
    const seen = new Set()
    const unique = []
    
    for (const item of content.items) {
      const key = item.question?.toLowerCase().trim()
      if (key && !seen.has(key)) {
        seen.add(key)
        unique.push(item)
      }
    }
    
    if (unique.length !== content.items.length) {
      content.items = unique
      updated = true
      console.log(`   🗑️  Removed ${content.items.length - unique.length} duplicate FAQ`)
    }
    
    // Fix location in answers
    for (const item of unique) {
      if (item.answer) {
        const newAnswer = item.answer
          .replace(/Köln/gi, 'Baesweiler')
          .replace(/Aachen/gi, 'Baesweiler')
        if (newAnswer !== item.answer) {
          item.answer = newAnswer
          updated = true
        }
      }
    }
  }
  
  return updated
}

function optimizeFooterBlock(content) {
  let updated = false
  
  if (content.contact?.address) {
    if (content.contact.address.city !== BAESWEILER_ADDRESS.city ||
        content.contact.address.street === 'Musterstraße 123') {
      content.contact.address = { ...content.contact.address, ...BAESWEILER_ADDRESS }
      updated = true
      console.log(`   📍 Address: ${BAESWEILER_ADDRESS.street}, ${BAESWEILER_ADDRESS.city}`)
    }
  }
  
  if (content.description) {
    const newDesc = content.description
      .replace(/Köln/gi, 'Baesweiler')
    if (newDesc !== content.description) {
      content.description = newDesc
      updated = true
    }
  }
  
  return updated
}

optimizeHeadspaComprehensive().catch(console.error)

