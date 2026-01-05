#!/usr/bin/env node

/**
 * Text Block Typography Uyumluluğu
 * Yazı tiplerini diğer block'larla uyumlu hale getir
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

async function fixTextBlockTypography() {
  console.log('🔤 Text Block Typography Uyumluluğu\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  // Headspa Page
  const { data: headspaPage } = await supabase.from('pages').select('id').eq('slug', 'headspa').single()
  const { data: headspaTextBlocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', headspaPage.id)
    .eq('block_type', 'text')
    .order('position', { ascending: true })
  
  console.log(`📄 Headspa Page - ${headspaTextBlocks?.length || 0} text block\n`)
  
  let fixedCount = 0
  
  for (const block of headspaTextBlocks || []) {
    const needsUpdate = !block.content?.typography?.title?.fontSize?.includes('clamp') ||
                        !block.content?.typography?.body?.fontSize?.includes('clamp')
    
    if (needsUpdate) {
      const updatedContent = {
        ...block.content,
        typography: {
          ...block.content.typography,
          title: {
            ...block.content.typography?.title,
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', // Diğer section'larla uyumlu
            fontWeight: '700',
            color: '#2C2C2C', // Accent color
            lineHeight: '1.2',
            letterSpacing: '-0.02em'
          },
          body: {
            ...block.content.typography?.body,
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', // Responsive
            fontWeight: '400',
            color: '#666666', // Gray
            lineHeight: '1.75',
            letterSpacing: '0'
          }
        }
      }
      
      await supabase
        .from('page_blocks')
        .update({ content: updatedContent })
        .eq('id', block.id)
      
      console.log(`✅ Block ${block.position} (${block.content?.title?.substring(0, 40)}...):`)
      console.log(`   Title: clamp(1.75rem, 3vw, 2.5rem)`)
      console.log(`   Body: clamp(1rem, 1.5vw, 1.125rem)`)
      console.log()
      
      fixedCount++
    }
  }
  
  // Landing Page
  const { data: landingPage } = await supabase.from('pages').select('id').eq('slug', 'home').single()
  const { data: landingTextBlocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', landingPage.id)
    .eq('block_type', 'text')
    .order('position', { ascending: true })
  
  console.log(`📄 Landing Page - ${landingTextBlocks?.length || 0} text block\n`)
  
  for (const block of landingTextBlocks || []) {
    const needsUpdate = !block.content?.typography?.title?.fontSize?.includes('clamp') ||
                        !block.content?.typography?.body?.fontSize?.includes('clamp')
    
    if (needsUpdate) {
      const updatedContent = {
        ...block.content,
        typography: {
          ...block.content.typography,
          title: {
            ...block.content.typography?.title,
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: '700',
            color: '#2C2C2C',
            lineHeight: '1.2',
            letterSpacing: '-0.02em'
          },
          body: {
            ...block.content.typography?.body,
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            fontWeight: '400',
            color: '#666666',
            lineHeight: '1.75',
            letterSpacing: '0'
          }
        }
      }
      
      await supabase
        .from('page_blocks')
        .update({ content: updatedContent })
        .eq('id', block.id)
      
      console.log(`✅ Block ${block.position} (${block.content?.title?.substring(0, 40)}...):`)
      console.log(`   Title: clamp(1.75rem, 3vw, 2.5rem)`)
      console.log(`   Body: clamp(1rem, 1.5vw, 1.125rem)`)
      console.log()
      
      fixedCount++
    }
  }
  
  console.log('='.repeat(70))
  console.log(`✅ Toplam ${fixedCount} text block typography güncellendi!`)
  console.log('\n📊 Yapılan Düzeltmeler:')
  console.log('  ✅ Responsive typography (clamp) eklendi')
  console.log('  ✅ Font sizes diğer block\'larla uyumlu')
  console.log('  ✅ Font weights optimize edildi')
  console.log('  ✅ Colors brand colors ile uyumlu')
  console.log('  ✅ Line heights optimize edildi')
  console.log('\n🌐 Sayfalar: http://localhost:3001/ & http://localhost:3001/headspa\n')
}

fixTextBlockTypography().catch(console.error)

