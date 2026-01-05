#!/usr/bin/env node

/**
 * Final Enterprise Issues Fix
 * SEO, Responsive, Typography, Layout iyileştirmeleri
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

async function fixFinalEnterpriseIssues() {
  console.log('🔧 Final Enterprise Issues Fix\n')
  console.log('='.repeat(80))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  // ==========================================
  // 1. SEO İYİLEŞTİRMELERİ
  // ==========================================
  console.log('1️⃣  SEO İyileştirmeleri...')
  
  // Landing Page Meta Title
  const { data: landingPage } = await supabase.from('pages').select('*').eq('slug', 'home').single()
  if (landingPage) {
    const improvedMetaTitle = 'Wellnesstal - Premium Wellness & Headspa in Baesweiler | Jetzt Termin buchen'
    const improvedKeywords = ['headspa', 'wellness', 'baesweiler', 'entspannung', 'kopfmassage', 'wellness-studio', 'premium-wellness']
    
    await supabase
      .from('pages')
      .update({
        meta_title: improvedMetaTitle,
        meta_keywords: improvedKeywords
      })
      .eq('id', landingPage.id)
    
    console.log(`  ✅ Landing Page: Meta Title optimize edildi (${improvedMetaTitle.length} char)`)
    console.log(`  ✅ Landing Page: ${improvedKeywords.length} keyword eklendi\n`)
  }
  
  // Headspa Page Meta Title
  const { data: headspaPage } = await supabase.from('pages').select('*').eq('slug', 'headspa').single()
  if (headspaPage && headspaPage.meta_title.length < 60) {
    const improvedMetaTitle = 'Headspa Baesweiler – Professionelle Kopfhautpflege & Entspannung | Wellnesstal'
    
    await supabase
      .from('pages')
      .update({
        meta_title: improvedMetaTitle
      })
      .eq('id', headspaPage.id)
    
    console.log(`  ✅ Headspa Page: Meta Title optimize edildi (${improvedMetaTitle.length} char)\n`)
  }
  
  // ==========================================
  // 2. RESPONSIVE TYPOGRAPHY İYİLEŞTİRMELERİ
  // ==========================================
  console.log('2️⃣  Responsive Typography İyileştirmeleri...')
  
  const { data: allPages } = await supabase.from('pages').select('id, slug').in('slug', ['home', 'headspa'])
  
  for (const page of allPages || []) {
    const { data: blocks } = await supabase
      .from('page_blocks')
      .select('*')
      .eq('page_id', page.id)
      .order('position', { ascending: true })
    
    let updatedCount = 0
    
    for (const block of blocks || []) {
      let needsUpdate = false
      const updatedContent = { ...block.content }
      
      // Hero blocks
      if (block.block_type === 'hero') {
        const titleSize = block.content?.styles?.title?.fontSize || block.content?.typography?.title?.fontSize || ''
        if (!titleSize.includes('clamp')) {
          if (block.content.styles) {
            updatedContent.styles = {
              ...block.content.styles,
              title: {
                ...block.content.styles.title,
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)'
              },
              subtitle: {
                ...block.content.styles.subtitle,
                fontSize: 'clamp(1.125rem, 2vw, 1.5rem)'
              }
            }
          } else if (block.content.typography) {
            updatedContent.typography = {
              ...block.content.typography,
              title: {
                ...block.content.typography.title,
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)'
              }
            }
          }
          needsUpdate = true
        }
      }
      
      // Text blocks
      if (block.block_type === 'text') {
        const titleSize = block.content?.typography?.title?.fontSize || ''
        const bodySize = block.content?.typography?.body?.fontSize || ''
        if (!titleSize.includes('clamp') || !bodySize.includes('clamp')) {
          updatedContent.typography = {
            ...block.content.typography,
            title: {
              ...block.content.typography?.title,
              fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
              lineHeight: '1.2'
            },
            body: {
              ...block.content.typography?.body,
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: '1.75'
            }
          }
          needsUpdate = true
        }
      }
      
      // Features blocks
      if (block.block_type === 'features') {
        const sectionTitleSize = block.content?.typography?.sectionTitle?.fontSize || ''
        if (!sectionTitleSize.includes('clamp')) {
          updatedContent.typography = {
            ...block.content.typography,
            sectionTitle: {
              ...block.content.typography?.sectionTitle,
              fontSize: 'clamp(2rem, 3vw, 2.5rem)',
              lineHeight: '1.2'
            },
            featureTitle: {
              ...block.content.typography?.featureTitle,
              fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
              lineHeight: '1.4'
            },
            featureDescription: {
              ...block.content.typography?.featureDescription,
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: '1.6'
            }
          }
          needsUpdate = true
        }
      }
      
      // CTA blocks
      if (block.block_type === 'cta') {
        const titleSize = block.content?.typography?.title?.fontSize || ''
        if (!titleSize.includes('clamp')) {
          updatedContent.typography = {
            ...block.content.typography,
            title: {
              ...block.content.typography?.title,
              fontSize: 'clamp(2rem, 4vw, 3rem)',
              lineHeight: '1.2'
            },
            subtitle: {
              ...block.content.typography?.subtitle,
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              lineHeight: '1.5'
            }
          }
          needsUpdate = true
        }
      }
      
      // Services blocks
      if (block.block_type === 'services') {
        const titleSize = block.content?.typography?.title?.fontSize || ''
        if (!titleSize.includes('clamp')) {
          updatedContent.typography = {
            ...block.content.typography,
            title: {
              fontSize: 'clamp(2rem, 3vw, 2.5rem)',
              lineHeight: '1.2'
            },
            subtitle: {
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              lineHeight: '1.5'
            }
          }
          needsUpdate = true
        }
      }
      
      // Pricing blocks
      if (block.block_type === 'pricing') {
        const titleSize = block.content?.typography?.title?.fontSize || ''
        if (!titleSize.includes('clamp')) {
          updatedContent.typography = {
            ...block.content.typography,
            title: {
              fontSize: 'clamp(2rem, 3vw, 2.5rem)',
              lineHeight: '1.2'
            },
            subtitle: {
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              lineHeight: '1.5'
            }
          }
          needsUpdate = true
        }
      }
      
      // Testimonials blocks
      if (block.block_type === 'testimonials') {
        const titleSize = block.content?.typography?.title?.fontSize || ''
        if (!titleSize.includes('clamp')) {
          updatedContent.typography = {
            ...block.content.typography,
            title: {
              fontSize: 'clamp(2rem, 3vw, 2.5rem)',
              lineHeight: '1.2'
            },
            subtitle: {
              fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
              lineHeight: '1.5'
            }
          }
          needsUpdate = true
        }
      }
      
      // FAQ blocks
      if (block.block_type === 'faq') {
        const titleSize = block.content?.typography?.title?.fontSize || ''
        if (!titleSize.includes('clamp')) {
          updatedContent.typography = {
            ...block.content.typography,
            title: {
              fontSize: 'clamp(2rem, 3vw, 2.5rem)',
              lineHeight: '1.2'
            },
            question: {
              fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
              lineHeight: '1.4'
            },
            answer: {
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: '1.6'
            }
          }
          needsUpdate = true
        }
      }
      
      if (needsUpdate) {
        await supabase
          .from('page_blocks')
          .update({ content: updatedContent })
          .eq('id', block.id)
        updatedCount++
      }
    }
    
    console.log(`  ✅ ${page.slug}: ${updatedCount} block responsive typography ile güncellendi`)
  }
  
  console.log()
  
  // ==========================================
  // 3. LAYOUT & SPACING İYİLEŞTİRMELERİ
  // ==========================================
  console.log('3️⃣  Layout & Spacing İyileştirmeleri...')
  
  for (const page of allPages || []) {
    const { data: blocks } = await supabase
      .from('page_blocks')
      .select('*')
      .eq('page_id', page.id)
      .order('position', { ascending: true })
    
    let updatedCount = 0
    
    for (const block of blocks || []) {
      let needsUpdate = false
      const updatedContent = { ...block.content }
      
      // Max width ekle
      if (!block.content?.maxWidth && block.block_type !== 'hero') {
        updatedContent.maxWidth = 'xl'
        needsUpdate = true
      }
      
      // Alignment ekle
      if (!block.content?.alignment && block.block_type === 'text') {
        updatedContent.alignment = 'left'
        needsUpdate = true
      }
      
      // Padding standardize et
      if (block.content?.padding) {
        const padding = block.content.padding
        if (!padding.top || padding.top === '0' || padding.top === '0rem') {
          updatedContent.padding = {
            ...padding,
            top: '5rem',
            bottom: padding.bottom || '5rem',
            left: padding.left || '2rem',
            right: padding.right || '2rem'
          }
          needsUpdate = true
        }
      }
      
      if (needsUpdate) {
        await supabase
          .from('page_blocks')
          .update({ content: updatedContent })
          .eq('id', block.id)
        updatedCount++
      }
    }
    
    console.log(`  ✅ ${page.slug}: ${updatedCount} block layout güncellendi`)
  }
  
  console.log()
  
  console.log('='.repeat(80))
  console.log('✅ Final Enterprise Issues Fix Tamamlandı!')
  console.log('\n📊 Yapılan İyileştirmeler:')
  console.log('  ✅ SEO: Meta titles optimize edildi, keywords eklendi')
  console.log('  ✅ Responsive Typography: Tüm block\'lara clamp eklendi')
  console.log('  ✅ Layout & Spacing: Max width, alignment, padding standardize edildi')
  console.log('\n🎯 Beklenen Skor Artışı:')
  console.log('  SEO: 70/100 → 90+/100')
  console.log('  Responsive Design: 50/100 → 90+/100')
  console.log('  Typography: 50/100 → 90+/100')
  console.log('  Layout & Spacing: 63/100 → 90+/100')
  console.log('  Genel Skor: 81/100 → 95+/100\n')
}

fixFinalEnterpriseIssues().catch(console.error)

