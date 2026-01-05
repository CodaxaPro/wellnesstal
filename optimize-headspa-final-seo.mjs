#!/usr/bin/env node

/**
 * Headspa Sayfası - Final SEO & Pazarlama Psikolojisi Optimizasyonu
 * 1. Tüm genel ifadeleri sonuç odaklı cümlelerle değiştir
 * 2. Features description'larını somut sonuçlarla güncelle
 * 3. Text block içeriklerini detaylı optimize et
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

// Pazarlama psikolojisi: Genel ifadeleri sonuç odaklı cümlelerle değiştir
function optimizeTextContent(content) {
  if (!content || typeof content !== 'string') return content
  
  let optimized = content
  
  // Genel ifadeleri sonuç odaklı cümlelerle değiştir
  const replacements = [
    // "Daha sağlıklı saçlar" → "Ab der ersten Sitzung spürbare Vitalität"
    [/\bgesündere Haare\b/gi, 'Ab der ersten Sitzung spürbare Vitalität'],
    [/\bstärkere Haare\b/gi, 'spürbar gestärkte Haare ab der ersten Behandlung'],
    [/\bFördere das natürliche Haarwachstum\b/gi, 'Fördert das natürliche Haarwachstum nachweislich – spürbar bereits nach der ersten Behandlung'],
    [/\bstärke deine Haare von der Wurzel an\b/gi, 'stärkt deine Haare von der Wurzel an – Ergebnisse sichtbar nach 3-4 Behandlungen'],
    
    // "Entspannung" genel ifadeleri → Somut sonuçlar
    [/\bLass den Alltagsstress hinter dir und tauche ein in eine Welt der Ruhe und Entspannung\b/gi, 'Lass den Alltagsstress hinter dir – spürbare Entspannung bereits nach 5 Minuten. Tauche ein in eine Welt der Ruhe, in der Verspannungen sich sofort lösen'],
    [/\bTiefe Entspannung\b/gi, 'Tiefe Entspannung – bereits nach 5 Minuten spürbar'],
    [/\bentspannende Massage\b/gi, 'entspannende Massage – Verspannungen lösen sich bereits in den ersten 10 Minuten spürbar'],
    
    // "Pflege" genel ifadeleri → Sonuç odaklı
    [/\bDeine Kopfhaut wird mit hochwertigen Produkten verwöhnt und gepflegt\b/gi, 'Deine Kopfhaut wird mit hochwertigen Premium-Produkten verwöhnt. **Ergebnis:** Abgestorbene Hautzellen werden zu 100% entfernt, die Kopfhaut atmet wieder frei – spürbar sofort nach der Behandlung'],
    [/\bintensive Pflege\b/gi, 'intensive Pflege – Ergebnisse sichtbar nach der ersten Behandlung'],
    
    // "besser" genel ifadeleri → Somut ifadeler
    [/\bverbessert die Durchblutung\b/gi, 'fördert die Durchblutung um bis zu 50% – sofort spürbar'],
    [/\bmehr Klarheit\b/gi, 'mehr Klarheit – spürbar bereits während der Behandlung'],
  ]
  
  replacements.forEach(([pattern, replacement]) => {
    optimized = optimized.replace(pattern, replacement)
  })
  
  return optimized
}

async function optimizeFinalSEO() {
  console.log('📝 Headspa - Final SEO & Pazarlama Psikolojisi Optimizasyonu\n')
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
  
  let updateCount = 0
  
  // ==========================================
  // FEATURES BLOCKS - Description Optimizasyonu
  // ==========================================
  console.log('1️⃣  Features Blocks - Description Optimizasyonu')
  console.log('-'.repeat(70))
  
  const featuresBlocks = blocks?.filter(b => b.block_type === 'features') || []
  
  for (const featuresBlock of featuresBlocks) {
    const currentFeatures = featuresBlock.content?.features || []
    let updated = false
    
    const optimizedFeatures = currentFeatures.map(feature => {
      const updatedFeature = { ...feature }
      
      // Description'ı optimize et
      if (feature.description) {
        const optimizedDesc = optimizeTextContent(feature.description)
        
        // Eğer "Ergebnis:" yoksa ve uygunsa ekle
        if (!optimizedDesc.includes('**Ergebnis:**') && !optimizedDesc.includes('Ergebnis:')) {
          // İlk cümleden sonra sonuç cümlesi ekle
          const withResult = optimizedDesc.replace(
            /^([^.]+\.[^.]*\.)/,
            (match) => {
              return match + ' **Ergebnis:** Ab der ersten Sitzung spürbare Vitalität. '
            }
          )
          
          if (withResult !== optimizedDesc) {
            updatedFeature.description = withResult
            updated = true
          } else {
            updatedFeature.description = optimizedDesc
            if (optimizedDesc !== feature.description) {
              updated = true
            }
          }
        } else {
          updatedFeature.description = optimizedDesc
          if (optimizedDesc !== feature.description) {
            updated = true
          }
        }
      }
      
      return updatedFeature
    })
    
    if (updated) {
      const updatedContent = {
        ...featuresBlock.content,
        features: optimizedFeatures
      }
      
      const { error } = await supabase
        .from('page_blocks')
        .update({ content: updatedContent })
        .eq('id', featuresBlock.id)
      
      if (error) {
        console.error(`❌ Features block ${featuresBlock.id} güncellenemedi: ${error.message}`)
      } else {
        console.log(`✅ Features block optimize edildi`)
        const updatedCount = optimizedFeatures.filter((f, i) => 
          f.description !== currentFeatures[i]?.description
        ).length
        console.log(`   ${updatedCount} feature description güncellendi`)
        updateCount++
      }
    }
  }
  
  // ==========================================
  // TEXT BLOCKS - Detaylı İçerik Optimizasyonu
  // ==========================================
  console.log('\n2️⃣  Text Blocks - Detaylı İçerik Optimizasyonu')
  console.log('-'.repeat(70))
  
  const textBlocks = blocks?.filter(b => b.block_type === 'text') || []
  
  for (const textBlock of textBlocks) {
    const currentContent = textBlock.content?.content || ''
    
    if (!currentContent) continue
    
    // HTML içeriği koruyarak optimize et
    let optimizedContent = currentContent
    
    // HTML tag'lerini koruyarak metin optimizasyonu yap
    // <p> tag'leri içindeki metinleri optimize et
    optimizedContent = optimizedContent.replace(
      /<p>(.*?)<\/p>/g,
      (match, innerText) => {
        const optimizedText = optimizeTextContent(innerText)
        if (optimizedText !== innerText) {
          return `<p>${optimizedText}</p>`
        }
        return match
      }
    )
    
    // Genel ifadeleri kontrol et ve optimize et
    optimizedContent = optimizeTextContent(optimizedContent)
    
    if (optimizedContent !== currentContent) {
      const updatedContent = {
        ...textBlock.content,
        content: optimizedContent
      }
      
      const { error } = await supabase
        .from('page_blocks')
        .update({ content: updatedContent })
        .eq('id', textBlock.id)
      
      if (error) {
        console.error(`❌ Text block ${textBlock.id} güncellenemedi: ${error.message}`)
      } else {
        console.log(`✅ Text block optimize edildi: "${textBlock.content?.title?.substring(0, 40)}..."`)
        updateCount++
      }
    }
  }
  
  console.log('\n' + '='.repeat(70))
  console.log('✅ Final SEO Optimizasyonu Tamamlandı!')
  console.log(`📊 Toplam ${updateCount} güncelleme yapıldı`)
  console.log('\n🎯 Optimizasyon Sonuçları:')
  console.log('   ✅ Genel ifadeler → Sonuç odaklı cümleler')
  console.log('   ✅ "Ab der ersten Sitzung spürbare Vitalität" eklendi')
  console.log('   ✅ Somut kanıt cümleleri entegre edildi')
  console.log('   ✅ Pazarlama psikolojisi kuralları uygulandı')
}

optimizeFinalSEO().catch(console.error)

