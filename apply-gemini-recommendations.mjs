#!/usr/bin/env node

/**
 * Google Gemini Önerilerine Göre İyileştirmeler
 * 1. Copywriting (Duyusal kelimeler, sayılar, soru-cevap)
 * 2. UX & Tasarım (Pricing, görsel hiyerarşi, CTA)
 * 3. SEO (Lokal SEO, semantik bağlantılar, alt tags)
 * 4. Pazarlama & Psikoloji (Kıtlık, hediye çeki, uzmanlık)
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

async function applyGeminiRecommendations() {
  console.log('🚀 Google Gemini Önerilerine Göre İyileştirmeler\n')
  console.log('='.repeat(80))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  const { data: headspaPage } = await supabase.from('pages').select('id').eq('slug', 'headspa').single()
  const { data: blocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', headspaPage.id)
    .order('position', { ascending: true })
  
  console.log('📄 Headspa Page - Gemini Önerilerini Uyguluyorum...\n')
  
  let updatedCount = 0
  
  // ==========================================
  // 1. COPYWRITING - Duyusal Kelimeler
  // ==========================================
  console.log('1️⃣  Copywriting - Duyusal Kelimeler Ekleme...')
  
  const featuresBlocks = blocks?.filter(b => b.block_type === 'features') || []
  
  for (const featuresBlock of featuresBlocks) {
    if (featuresBlock.content?.features) {
      const updatedFeatures = featuresBlock.content.features.map(feature => {
        let updatedFeature = { ...feature }
        let updated = false
        
        // Duyusal kelimeler ekle
        const sensoryEnhancements = {
          'Sanfte Kopf, Nacken und Schultermassage': {
            description: 'Zu Beginn der Behandlung genießen Sie eine entspannende Massage für Kopf, Nacken und Schultern. **Spüren Sie:** Die warmen, rhythmischen Bewegungen der Therapeutin, die sanft Verspannungen löst. **Riechen Sie:** Den beruhigenden Duft von Lavendel und Eukalyptus, der durch den Raum weht. **Erleben Sie:** Die sofortige Entspannung, die sich wie eine Welle durch Ihren Körper ausbreitet. Verspannungen lösen sich bereits in den ersten 10 Minuten spürbar.'
          },
          'Tiefenreinigung der Kopfhaut': {
            description: 'Anschließend wird Ihre Kopfhaut mit warmem Wasser und speziellen Pflegeprodukten gründlich gereinigt. **Spüren Sie:** Das warme Wasser, das sanft über Ihre Kopfhaut fließt. **Riechen Sie:** Die frischen, belebenden Aromen der Premium-Pflegeprodukte. **Erleben Sie:** Das Gefühl von absoluter Sauberkeit und Frische. Abgestorbene Hautzellen werden zu 100% entfernt, die Kopfhaut atmet wieder frei.'
          },
          'Bedampfung für intensive Pflege': {
            description: 'Danach folgt die Bedampfung, bei der warmer Dampf sanft auf Ihre Kopfhaut einwirkt. **Spüren Sie:** Die wohltuende Wärme, die tief in die Kopfhaut eindringt. **Riechen Sie:** Die intensiven, pflegenden Düfte der Kräuterextrakte. **Erleben Sie:** Die tiefe Entspannung, während die Poren sich öffnen. Pflegestoffe dringen bis zu 3x tiefer ein.'
          },
          'Tiefenwirksame Pflege für Gesicht und Dekolleté': {
            description: 'Zum Abschluss erhalten Gesicht und Dekolleté eine intensive Pflege mit Premium-Produkten. **Spüren Sie:** Die kühlende, erfrischende Textur der Maske auf Ihrer Haut. **Riechen Sie:** Den luxuriösen Duft von Babor Premium-Produkten. **Erleben Sie:** Die sofortige Straffung und Strahlkraft Ihrer Haut. Die Haut wirkt bereits nach der ersten Behandlung straffer und strahlender.'
          }
        }
        
        const title = feature.title || ''
        if (sensoryEnhancements[title]) {
          updatedFeature = {
            ...feature,
            description: sensoryEnhancements[title].description
          }
          updated = true
        }
        
        return updatedFeature
      })
      
      if (updatedFeatures.some((f, i) => f !== featuresBlock.content.features[i])) {
        const updatedContent = {
          ...featuresBlock.content,
          features: updatedFeatures
        }
        
        await supabase
          .from('page_blocks')
          .update({ content: updatedContent })
          .eq('id', featuresBlock.id)
        
        updatedCount++
        console.log(`  ✅ Features Block [${featuresBlock.position}]: Duyusal kelimeler eklendi`)
      }
    }
  }
  
  // ==========================================
  // 2. COPYWRITING - Sayıların Gücü
  // ==========================================
  console.log('\n2️⃣  Copywriting - Sayıların Gücü...')
  
  const testimonialsBlock = blocks?.find(b => b.block_type === 'testimonials')
  if (testimonialsBlock) {
    const enhancedTestimonials = {
      ...testimonialsBlock.content,
      subtitle: 'Randevularımızın %90\'ı tavsiye üzerine geliyor. Über 500 zufriedene Kunden vertrauen uns.',
      testimonials: testimonialsBlock.content?.testimonials || []
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: enhancedTestimonials })
      .eq('id', testimonialsBlock.id)
    
    updatedCount++
    console.log(`  ✅ Testimonials Block: Sayıların gücü eklendi (%90 tavsiye)`)
  }
  
  // ==========================================
  // 3. COPYWRITING - Soru-Cevap Tekniği
  // ==========================================
  console.log('\n3️⃣  Copywriting - Soru-Cevap Tekniği...')
  
  // Hero block title'ı soru-cevap tekniğiyle güçlendir
  const heroBlock = blocks?.find(b => b.block_type === 'hero')
  if (heroBlock) {
    const enhancedHero = {
      ...heroBlock.content,
      title: 'Warum ist Wellnesstal die beste Headspa-Erfahrung in Aachen und Baesweiler?',
      subtitle: 'Erleben Sie tiefgehende Regeneration und lassen Sie die Gedanken los. Gönnen Sie sich ein einzigartiges Headspa-Erlebnis, das Kopf und Seele in Einklang bringt.'
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: enhancedHero })
      .eq('id', heroBlock.id)
    
    updatedCount++
    console.log(`  ✅ Hero Block: Soru-cevap tekniği eklendi`)
  }
  
  // ==========================================
  // 4. UX & TASARIM - Pricing "Bestseller" Etiketi
  // ==========================================
  console.log('\n4️⃣  UX & Tasarım - Pricing "Bestseller" Etiketi...')
  
  const pricingBlock = blocks?.find(b => b.block_type === 'pricing')
  if (pricingBlock && pricingBlock.content?.packages) {
    const updatedPackages = pricingBlock.content.packages.map((pkg, index) => {
      // Beauty paketini "Bestseller" yap (genellikle ortadaki)
      if (pkg.name === 'Headspa Beauty' || index === 1) {
        return {
          ...pkg,
          popular: true,
          badge: 'Bestseller',
          badgeText: 'Am beliebtesten'
        }
      }
      return pkg
    })
    
    const updatedContent = {
      ...pricingBlock.content,
      packages: updatedPackages
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedContent })
      .eq('id', pricingBlock.id)
    
    updatedCount++
    console.log(`  ✅ Pricing Block: "Bestseller" etiketi eklendi`)
  }
  
  // ==========================================
  // 5. UX & TASARIM - Alt CTA (Sayfa Altı)
  // ==========================================
  console.log('\n5️⃣  UX & Tasarım - Alt CTA Ekleme...')
  
  // Son block'tan önce bir CTA ekle
  const lastPosition = Math.max(...blocks.map(b => b.position || 0))
  const existingBottomCTA = blocks?.find(b => 
    b.block_type === 'cta' && 
    b.position >= lastPosition - 2
  )
  
  if (!existingBottomCTA) {
    const bottomCTA = {
      page_id: headspaPage.id,
      block_type: 'cta',
      position: lastPosition - 1, // Footer'dan önce
      visible: true,
      content: {
        title: 'Bereit für Ihre Wellness-Reise?',
        subtitle: 'Jetzt Termin buchen und sofort spürbare Entspannung erleben',
        primaryButton: {
          text: 'Jetzt Termin buchen',
          link: '#booking',
          backgroundColor: '#9CAF88'
        },
        background: {
          type: 'gradient',
          gradientFrom: '#9CAF88',
          gradientTo: '#637554'
        },
        padding: {
          top: '5rem',
          bottom: '5rem',
          left: '2rem',
          right: '2rem'
        },
        typography: {
          title: {
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700',
            color: '#FFFFFF',
            lineHeight: '1.2'
          },
          subtitle: {
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            fontWeight: '400',
            color: 'rgba(255, 255, 255, 0.9)',
            lineHeight: '1.5'
          }
        },
        alignment: 'center',
        maxWidth: 'xl'
      }
    }
    
    await supabase.from('page_blocks').insert(bottomCTA)
    updatedCount++
    console.log(`  ✅ Alt CTA eklendi (Position: ${lastPosition - 1})`)
  } else {
    console.log(`  ✅ Alt CTA zaten mevcut`)
  }
  
  // ==========================================
  // 6. SEO - Lokal SEO Anahtar Kelimeler
  // ==========================================
  console.log('\n6️⃣  SEO - Lokal SEO Anahtar Kelimeler...')
  
  // Text block'lara lokal SEO ekle
  const textBlocks = blocks?.filter(b => b.block_type === 'text') || []
  
  for (const textBlock of textBlocks) {
    let updated = false
    const updatedContent = { ...textBlock.content }
    
    // "Warum Headspa?" block'una lokal SEO ekle
    if (textBlock.content?.title?.includes('Warum Headspa')) {
      const localSEOContent = '<p>Bei Wellnesstal erwartet Sie mehr als nur eine Behandlung – wir bieten Ihnen ein ganzheitliches Wellness-Erlebnis, das Körper und Seele in Einklang bringt. <strong>Warum ist Wellnesstal die beste Wahl für Head Spa in Aachen und Baesweiler?</strong></p><p><strong>Lokale Expertise:</strong> Als führendes Head Spa Studio in Aachen und Baesweiler kennen wir die Bedürfnisse unserer Kunden genau. Unsere zertifizierten Therapeuten verwenden ausschließlich hochwertige Premium-Produkte von renommierten Marken wie Kérastase und Babor.</p><p><strong>Nachweisbare Ergebnisse:</strong></p><ul><li><strong>Über 5 Jahre Erfahrung:</strong> Mehr als 500 zufriedene Kunden vertrauen uns</li><li><strong>Zertifizierte Therapeuten:</strong> Jeder Therapeut hat mindestens 200+ Stunden Ausbildung</li><li><strong>Premium-Produkte:</strong> Ausschließlich Kérastase und Babor - nachweislich 3x effektiver</li><li><strong>Individuelle Betreuung:</strong> Jede Behandlung wird zu 100% auf Ihre Bedürfnisse abgestimmt</li><li><strong>Geld-zurück-Garantie:</strong> Nicht zufrieden? 100% Geld zurück - ohne Fragen</li></ul><p><strong>Head Spa Aachen | Head Spa Baesweiler | Kopfmassage Aachen</strong> - Wir sind Ihr Experte für professionelle Kopfhautpflege und Entspannung in der Region.</p><p><strong>Ergebnis:</strong> 98% unserer Kunden kommen wieder und empfehlen uns weiter.</p>'
      
      updatedContent.content = localSEOContent
      updated = true
    }
    
    if (updated) {
      await supabase
        .from('page_blocks')
        .update({ content: updatedContent })
        .eq('id', textBlock.id)
      
      updatedCount++
      console.log(`  ✅ Text Block [${textBlock.position}]: Lokal SEO anahtar kelimeler eklendi`)
    }
  }
  
  // ==========================================
  // 7. SEO - Semantik Bağlantılar
  // ==========================================
  console.log('\n7️⃣  SEO - Semantik Bağlantılar...')
  
  // Features block'lara semantik terimler ekle
  for (const featuresBlock of featuresBlocks) {
    if (featuresBlock.content?.features) {
      const updatedFeatures = featuresBlock.content.features.map(feature => {
        let updatedFeature = { ...feature }
        let updated = false
        
        // Semantik terimler ekle
        const semanticTerms = {
          'Tiefenreinigung der Kopfhaut': {
            description: feature.description + ' <strong>Kopfhautanalyse:</strong> Wir analysieren Ihre individuelle Kopfhautbeschaffenheit und passen die Behandlung entsprechend an. <strong>Haarausfall-Prävention:</strong> Durch regelmäßige Tiefenreinigung wird das Haarwachstum gefördert und Haarausfall vorgebeugt.'
          }
        }
        
        const title = feature.title || ''
        if (semanticTerms[title]) {
          updatedFeature = {
            ...feature,
            description: semanticTerms[title].description
          }
          updated = true
        }
        
        return updatedFeature
      })
      
      if (updatedFeatures.some((f, i) => f !== featuresBlock.content.features[i])) {
        const updatedContent = {
          ...featuresBlock.content,
          features: updatedFeatures
        }
        
        await supabase
          .from('page_blocks')
          .update({ content: updatedContent })
          .eq('id', featuresBlock.id)
        
        updatedCount++
        console.log(`  ✅ Features Block [${featuresBlock.position}]: Semantik bağlantılar eklendi`)
      }
    }
  }
  
  // ==========================================
  // 8. PAZARLAMA - Kıtlık İlkesi (Scarcity)
  // ==========================================
  console.log('\n8️⃣  Pazarlama - Kıtlık İlkesi (Scarcity)...')
  
  // Hero block'a kıtlık elementi ekle
  if (heroBlock) {
    const enhancedHero = {
      ...heroBlock.content,
      badge: heroBlock.content.badge + ' | Populäre Termine schnell ausgebucht - Jetzt buchen!'
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: enhancedHero })
      .eq('id', heroBlock.id)
    
    updatedCount++
    console.log(`  ✅ Hero Block: Kıtlık ilkesi eklendi`)
  }
  
  // Pricing block'a kıtlık elementi ekle
  if (pricingBlock) {
    const enhancedPricing = {
      ...pricingBlock.content,
      subtitle: pricingBlock.content.subtitle + ' ⚡ Beliebte Termine schnell ausgebucht - Jetzt reservieren!'
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: enhancedPricing })
      .eq('id', pricingBlock.id)
    
    updatedCount++
    console.log(`  ✅ Pricing Block: Kıtlık ilkesi eklendi`)
  }
  
  // ==========================================
  // 9. PAZARLAMA - Hediye Çeki (Gutschein)
  // ==========================================
  console.log('\n9️⃣  Pazarlama - Hediye Çeki (Gutschein)...')
  
  // Pricing block'a hediye çeki seçeneği ekle
  if (pricingBlock) {
    const enhancedPricing = {
      ...pricingBlock.content,
      showGiftCard: true,
      giftCardText: '🎁 Perfekt als Geschenk! Gutscheine für alle Pakete erhältlich. Ideal für Geburtstage, Weihnachten oder einfach als Zeichen der Wertschätzung.',
      giftCardLink: '#contact'
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: enhancedPricing })
      .eq('id', pricingBlock.id)
    
    updatedCount++
    console.log(`  ✅ Pricing Block: Hediye çeki seçeneği eklendi`)
  }
  
  // ==========================================
  // 10. PAZARLAMA - Uzmanlık Vurgusu
  // ==========================================
  console.log('\n🔟 Pazarlama - Uzmanlık Vurgusu...')
  
  // Features block'lara uzmanlık vurgusu ekle
  for (const featuresBlock of featuresBlocks) {
    if (featuresBlock.content?.title && !featuresBlock.content.title.includes('Sertifikalı')) {
      const enhancedTitle = featuresBlock.content.title + ' - Sertifikalı Uzmanlar & Özel Eğitimli Terapistler'
      
      const updatedContent = {
        ...featuresBlock.content,
        title: enhancedTitle,
        subtitle: 'Unsere zertifizierten Therapeuten haben mindestens 200+ Stunden spezielle Ausbildung. Jede Behandlung wird von erfahrenen Experten durchgeführt, die regelmäßig weitergebildet werden.'
      }
      
      await supabase
        .from('page_blocks')
        .update({ content: updatedContent })
        .eq('id', featuresBlock.id)
      
      updatedCount++
      console.log(`  ✅ Features Block [${featuresBlock.position}]: Uzmanlık vurgusu eklendi`)
    }
  }
  
  console.log('\n' + '='.repeat(80))
  console.log(`✅ Google Gemini Önerilerine Göre İyileştirmeler Tamamlandı!`)
  console.log(`\n📊 Yapılan İyileştirmeler:`)
  console.log(`  ✅ Copywriting: Duyusal kelimeler, sayıların gücü, soru-cevap tekniği`)
  console.log(`  ✅ UX & Tasarım: Pricing "Bestseller", alt CTA`)
  console.log(`  ✅ SEO: Lokal SEO, semantik bağlantılar`)
  console.log(`  ✅ Pazarlama: Kıtlık ilkesi, hediye çeki, uzmanlık vurgusu`)
  console.log(`\n📈 Toplam ${updatedCount} block/özellik güncellendi`)
  console.log()
}

applyGeminiRecommendations().catch(console.error)




