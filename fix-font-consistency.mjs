#!/usr/bin/env node

/**
 * Font Tutarlılık Düzeltmesi
 * Tüm block'larda system-ui yerine Poppins kullanılacak
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

// Font değiştirme fonksiyonu
function replaceSystemUiWithPoppins(obj) {
  if (!obj || typeof obj !== 'object') return obj
  
  if (Array.isArray(obj)) {
    return obj.map(item => replaceSystemUiWithPoppins(item))
  }
  
  const result = {}
  for (const [key, value] of Object.entries(obj)) {
    if (key === 'fontFamily' && value === 'system-ui') {
      result[key] = "'Poppins', sans-serif"
    } else if (typeof value === 'object' && value !== null) {
      result[key] = replaceSystemUiWithPoppins(value)
    } else {
      result[key] = value
    }
  }
  
  return result
}

async function fixFontConsistency() {
  console.log('🔤 Font Tutarlılık Düzeltmesi\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  // Tüm sayfaları al
  const { data: pages } = await supabase.from('pages').select('id, slug, title')
  
  if (!pages || pages.length === 0) {
    console.log('❌ Sayfa bulunamadı')
    return
  }
  
  let totalUpdated = 0
  
  for (const page of pages) {
    console.log(`\n📄 ${page.title} (${page.slug})`)
    console.log('-'.repeat(70))
    
    const { data: blocks } = await supabase
      .from('page_blocks')
      .select('*')
      .eq('page_id', page.id)
    
    if (!blocks || blocks.length === 0) continue
    
    let pageUpdated = 0
    
    for (const block of blocks) {
      const originalContent = JSON.stringify(block.content)
      const updatedContent = replaceSystemUiWithPoppins(block.content)
      const updatedContentStr = JSON.stringify(updatedContent)
      
      if (originalContent !== updatedContentStr) {
        const { error } = await supabase
          .from('page_blocks')
          .update({ content: updatedContent })
          .eq('id', block.id)
        
        if (error) {
          console.error(`  ❌ Block ${block.block_type} güncellenemedi: ${error.message}`)
        } else {
          console.log(`  ✅ ${block.block_type} block güncellendi`)
          pageUpdated++
          totalUpdated++
        }
      }
    }
    
    if (pageUpdated === 0) {
      console.log('  ✅ Font zaten tutarlı')
    }
  }
  
  console.log('\n' + '='.repeat(70))
  console.log('✅ Font Tutarlılık Düzeltmesi Tamamlandı!')
  console.log(`📊 Toplam ${totalUpdated} block güncellendi`)
  console.log('\n💡 Tüm block\'larda artık Poppins kullanılıyor (globals.css ile uyumlu)')
}

fixFontConsistency().catch(console.error)

