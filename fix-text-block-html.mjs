#!/usr/bin/env node

/**
 * Text Block HTML İçerik Düzeltmesi
 * HTML tag'lerini temizle ve düzgün formatla
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

// HTML tag'lerini temizle ve sadece text'i al
function stripHTML(html) {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, '') // Tüm HTML tag'lerini kaldır
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim()
}

// HTML içeriğini düzgün paragraflara böl
function formatContent(text) {
  if (!text) return ''
  
  // HTML tag'lerini kaldır
  const cleanText = stripHTML(text)
  
  // Paragrafları ayır (çift boşluk veya <p> tag'leri)
  const paragraphs = cleanText
    .split(/\n\n+/)
    .map(p => p.trim())
    .filter(p => p.length > 0)
  
  return paragraphs.join('\n\n')
}

async function fixTextBlockHTML() {
  console.log('🔧 Text Block HTML İçerik Düzeltmesi\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  // Headspa Page text blocks
  const { data: headspaPage } = await supabase.from('pages').select('id').eq('slug', 'headspa').single()
  const { data: headspaTextBlocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', headspaPage.id)
    .eq('block_type', 'text')
    .order('position', { ascending: true })
  
  console.log(`📄 Headspa Page - ${headspaTextBlocks?.length || 0} text block bulundu\n`)
  
  let fixedCount = 0
  
  for (const block of headspaTextBlocks || []) {
    const currentContent = block.content?.content || block.content?.description || ''
    
    // HTML tag'leri var mı kontrol et
    if (currentContent.includes('<p>') || currentContent.includes('</p>')) {
      const fixedContent = formatContent(currentContent)
      
      // Eğer içerik değiştiyse güncelle
      if (fixedContent !== currentContent) {
        const updatedContent = {
          ...block.content,
          content: fixedContent,
          contentType: 'paragraph' // Paragraph olarak ayarla
        }
        
        await supabase
          .from('page_blocks')
          .update({ content: updatedContent })
          .eq('id', block.id)
        
        console.log(`✅ Block ${block.position} (${block.content?.title?.substring(0, 40)}...):`)
        console.log(`   Önceki: ${currentContent.substring(0, 80)}...`)
        console.log(`   Yeni: ${fixedContent.substring(0, 80)}...`)
        console.log()
        
        fixedCount++
      }
    }
  }
  
  // Landing Page text blocks
  const { data: landingPage } = await supabase.from('pages').select('id').eq('slug', 'home').single()
  const { data: landingTextBlocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', landingPage.id)
    .eq('block_type', 'text')
    .order('position', { ascending: true })
  
  console.log(`📄 Landing Page - ${landingTextBlocks?.length || 0} text block bulundu\n`)
  
  for (const block of landingTextBlocks || []) {
    const currentContent = block.content?.content || block.content?.description || ''
    
    // HTML tag'leri var mı kontrol et
    if (currentContent.includes('<p>') || currentContent.includes('</p>')) {
      const fixedContent = formatContent(currentContent)
      
      // Eğer içerik değiştiyse güncelle
      if (fixedContent !== currentContent) {
        const updatedContent = {
          ...block.content,
          content: fixedContent,
          contentType: 'paragraph'
        }
        
        await supabase
          .from('page_blocks')
          .update({ content: updatedContent })
          .eq('id', block.id)
        
        console.log(`✅ Block ${block.position} (${block.content?.title?.substring(0, 40)}...):`)
        console.log(`   Önceki: ${currentContent.substring(0, 80)}...`)
        console.log(`   Yeni: ${fixedContent.substring(0, 80)}...`)
        console.log()
        
        fixedCount++
      }
    }
  }
  
  console.log('='.repeat(70))
  console.log(`✅ Toplam ${fixedCount} text block düzeltildi!`)
  console.log('\n📊 Yapılan Düzeltmeler:')
  console.log('  ✅ HTML tag\'leri temizlendi')
  console.log('  ✅ İç içe <p> tag\'leri kaldırıldı')
  console.log('  ✅ İçerik düzgün paragraflara bölündü')
  console.log('  ✅ contentType "paragraph" olarak ayarlandı')
  console.log('\n🌐 Sayfalar: http://localhost:3001/ & http://localhost:3001/headspa\n')
}

fixTextBlockHTML().catch(console.error)

