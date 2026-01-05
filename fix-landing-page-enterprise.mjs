#!/usr/bin/env node

/**
 * Landing Page - Enterprise Seviye İyileştirmeleri
 * Yazılar, Font Uyumluluğu, Renkler, Tüm Alanlar
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

async function fixLandingPage() {
  console.log('🔧 Landing Page - Enterprise İyileştirmeleri\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  const { data: page } = await supabase.from('pages').select('id').eq('slug', 'home').single()
  const { data: blocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', page.id)
    .order('position', { ascending: true })
  
  console.log('📄 Sayfa: Landing Page (Home)')
  console.log(`📦 Mevcut Block: ${blocks?.length || 0}\n`)
  
  // ==========================================
  // 1. TÜM BLOCK'LARA RESPONSIVE TİPOGRAFİ EKLE
  // ==========================================
  console.log('1️⃣  Tüm block\'lara responsive typography ekleniyor...')
  
  let updatedBlocks = 0
  
  for (const block of blocks || []) {
    let needsUpdate = false
    const updatedContent = { ...block.content }
    
    // Hero block
    if (block.block_type === 'hero') {
      if (!block.content?.styles?.title?.fontSize?.includes('clamp')) {
        updatedContent.styles = {
          ...block.content.styles,
          title: {
            ...block.content.styles?.title,
            fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
            fontWeight: '700',
            lineHeight: '1.1'
          },
          subtitle: {
            ...block.content.styles?.subtitle,
            fontSize: 'clamp(1.125rem, 2vw, 1.5rem)',
            fontWeight: '400',
            lineHeight: '1.6'
          }
        }
        needsUpdate = true
      }
    }
    
    // Text blocks
    if (block.block_type === 'text') {
      if (!block.content?.typography?.title?.fontSize?.includes('clamp')) {
        updatedContent.typography = {
          title: {
            fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
            fontWeight: '700',
            color: '#2C2C2C',
            lineHeight: '1.2'
          },
          content: {
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            fontWeight: '400',
            color: '#666666',
            lineHeight: '1.6'
          }
        }
        needsUpdate = true
      }
    }
    
    // Features blocks
    if (block.block_type === 'features') {
      if (!block.content?.typography?.sectionTitle?.fontSize?.includes('clamp')) {
        updatedContent.typography = {
          ...block.content.typography,
          sectionTitle: {
            ...block.content.typography?.sectionTitle,
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: '700',
            color: '#2C2C2C'
          },
          featureTitle: {
            ...block.content.typography?.featureTitle,
            fontSize: 'clamp(1.25rem, 2vw, 1.5rem)',
            fontWeight: '600',
            color: '#2C2C2C'
          },
          featureDescription: {
            ...block.content.typography?.featureDescription,
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            fontWeight: '400',
            color: '#666666'
          }
        }
        needsUpdate = true
      }
    }
    
    // CTA blocks
    if (block.block_type === 'cta') {
      if (!block.content?.typography?.title?.fontSize?.includes('clamp')) {
        updatedContent.typography = {
          ...block.content.typography,
          title: {
            ...block.content.typography?.title,
            fontSize: 'clamp(2rem, 4vw, 3rem)',
            fontWeight: '700',
            color: '#FFFFFF'
          },
          subtitle: {
            ...block.content.typography?.subtitle,
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            fontWeight: '400',
            color: 'rgba(255, 255, 255, 0.9)'
          }
        }
        needsUpdate = true
      }
    }
    
    // Services block
    if (block.block_type === 'services') {
      if (!block.content?.typography?.title?.fontSize?.includes('clamp')) {
        updatedContent.typography = {
          title: {
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: '700',
            color: '#2C2C2C'
          },
          subtitle: {
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            fontWeight: '400',
            color: '#666666'
          }
        }
        needsUpdate = true
      }
    }
    
    // Testimonials block
    if (block.block_type === 'testimonials') {
      if (!block.content?.typography?.title?.fontSize?.includes('clamp')) {
        updatedContent.typography = {
          title: {
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: '700',
            color: '#2C2C2C'
          },
          subtitle: {
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            fontWeight: '400',
            color: '#666666'
          }
        }
        needsUpdate = true
      }
    }
    
    // FAQ block
    if (block.block_type === 'faq') {
      if (!block.content?.typography?.title?.fontSize?.includes('clamp')) {
        updatedContent.typography = {
          title: {
            fontSize: 'clamp(2rem, 3vw, 2.5rem)',
            fontWeight: '700',
            color: '#2C2C2C'
          },
          subtitle: {
            fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
            fontWeight: '400',
            color: '#666666'
          },
          question: {
            fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)',
            fontWeight: '600',
            color: '#2C2C2C'
          },
          answer: {
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            fontWeight: '400',
            color: '#666666'
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
      updatedBlocks++
    }
  }
  
  console.log(`  ✅ ${updatedBlocks} block responsive typography ile güncellendi\n`)
  
  // ==========================================
  // 2. RENK UYUMLULUĞU İYİLEŞTİRME
  // ==========================================
  console.log('2️⃣  Renk uyumluluğu iyileştiriliyor...')
  
  // Text blocks - accent color
  const textBlocks = blocks?.filter(b => b.block_type === 'text')
  for (const textBlock of textBlocks || []) {
    const updatedContent = {
      ...textBlock.content,
      typography: {
        ...textBlock.content.typography,
        title: {
          ...textBlock.content.typography?.title,
          color: '#2C2C2C' // Accent color
        }
      },
      background: {
        type: 'solid',
        color: '#F7F5F3' // Background color
      }
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedContent })
      .eq('id', textBlock.id)
  }
  
  // Features blocks - background color
  const featuresBlocks = blocks?.filter(b => b.block_type === 'features')
  for (const featuresBlock of featuresBlocks || []) {
    const updatedContent = {
      ...featuresBlock.content,
      background: {
        type: 'solid',
        color: '#F7F5F3' // Background color
      },
      typography: {
        ...featuresBlock.content.typography,
        sectionTitle: {
          ...featuresBlock.content.typography?.sectionTitle,
          color: '#2C2C2C' // Accent color
        },
        featureTitle: {
          ...featuresBlock.content.typography?.featureTitle,
          color: '#2C2C2C' // Accent color
        }
      }
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedContent })
      .eq('id', featuresBlock.id)
  }
  
  console.log('  ✅ Renk uyumluluğu iyileştirildi (accent & background colors)\n')
  
  // ==========================================
  // 3. PRICING BLOCK EKLE (Services'den sonra)
  // ==========================================
  console.log('3️⃣  Pricing Block ekleniyor...')
  
  const servicesBlock = blocks?.find(b => b.block_type === 'services')
  const servicesPosition = servicesBlock?.position || 5
  const pricingPosition = servicesPosition + 1
  
  // Sonraki block'ları kaydır
  const blocksAfterServices = blocks?.filter(b => b.position > servicesPosition) || []
  for (const block of blocksAfterServices) {
    await supabase
      .from('page_blocks')
      .update({ position: block.position + 1 })
      .eq('id', block.id)
  }
  
  const pricingBlock = {
    page_id: page.id,
    block_type: 'pricing',
    position: pricingPosition,
    visible: true,
    content: {
      title: 'Unsere Headspa-Pakete',
      subtitle: 'Wählen Sie das perfekte Paket für Ihre Bedürfnisse',
      packages: [
        {
          id: 'pkg-1',
          name: 'Headspa Basic',
          price: '89',
          currency: '€',
          period: '',
          description: '45 Minuten pure Entspannung',
          features: [
            'Kopf-, Nacken- und Dekolleté-Massage',
            'Bedampfung',
            'Haarreinigung und Pflege',
            'Peeling',
            'Kérastase Premiere Haaraufbau',
            'Babor Gesichtspflege',
            'inkl. Geld-zurück-Garantie'
          ],
          ctaText: 'Jetzt buchen',
          ctaLink: '#booking',
          popular: false,
          guarantee: 'inkl. Geld-zurück-Garantie'
        },
        {
          id: 'pkg-2',
          name: 'Headspa Beauty',
          price: '119',
          currency: '€',
          period: '',
          description: '60 Minuten pure Entspannung',
          features: [
            'Kopf-, Nacken- und Dekolleté-Massage',
            'Bedampfung',
            'Haarreinigung und Pflege',
            'Peeling',
            'Kérastase Premiere Haaraufbau',
            'Babor Gesichtspflege',
            'Erweiterte Gesichtsbehandlung',
            'inkl. Geld-zurück-Garantie'
          ],
          ctaText: 'Jetzt buchen',
          ctaLink: '#booking',
          popular: true,
          guarantee: 'inkl. Geld-zurück-Garantie'
        },
        {
          id: 'pkg-3',
          name: 'Headspa Deluxe',
          price: '149',
          currency: '€',
          period: '',
          description: '90 Minuten pure Entspannung',
          features: [
            'Kopf-, Nacken- und Dekolleté-Massage',
            'Bedampfung',
            'Haarreinigung und Pflege',
            'Peeling: Babor',
            'Kérastase Premiere Haaraufbau',
            'Babor Gesichtspflege',
            'Premium Gesichtsbehandlung',
            'Erweiterte Massage',
            'inkl. Geld-zurück-Garantie'
          ],
          ctaText: 'Jetzt buchen',
          ctaLink: '#booking',
          popular: false,
          guarantee: 'inkl. Geld-zurück-Garantie'
        }
      ],
      layout: 'grid',
      columns: 3,
      showGuarantee: true,
      guaranteeText: '100% Zufriedenheitsgarantie - Nicht zufrieden? Geld zurück!',
      background: {
        type: 'solid',
        color: '#ffffff'
      },
      padding: {
        top: '5rem',
        bottom: '5rem',
        left: '2rem',
        right: '2rem'
      },
      typography: {
        title: {
          fontSize: 'clamp(2rem, 3vw, 2.5rem)',
          fontWeight: '700',
          color: '#2C2C2C'
        },
        subtitle: {
          fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
          fontWeight: '400',
          color: '#666666'
        }
      }
    }
  }
  
  await supabase.from('page_blocks').insert(pricingBlock)
  console.log('  ✅ Pricing block eklendi (Position: ' + pricingPosition + ')\n')
  
  // ==========================================
  // 4. SERVICES BLOCK'A GUARANTEE EKLE
  // ==========================================
  console.log('4️⃣  Services Block\'a guarantee ekleniyor...')
  if (servicesBlock) {
    const services = servicesBlock.content?.services || []
    const updatedServices = services.map(service => ({
      ...service,
      guarantee: service.guarantee || 'inkl. Geld-zurück-Garantie',
      features: [
        ...(service.features || []),
        ...(service.features?.some(f => {
          if (typeof f === 'string') return f.includes('Garantie')
          return false
        }) ? [] : ['inkl. Geld-zurück-Garantie'])
      ]
    }))
    
    const updatedContent = {
      ...servicesBlock.content,
      services: updatedServices,
      showGuarantee: true,
      guaranteeText: '100% Zufriedenheitsgarantie'
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedContent })
      .eq('id', servicesBlock.id)
    
    console.log('  ✅ Services block\'a guarantee eklendi\n')
  }
  
  // ==========================================
  // 5. HERO BLOCK RENK İYİLEŞTİRME
  // ==========================================
  console.log('5️⃣  Hero Block renk iyileştiriliyor...')
  const heroBlock = blocks?.find(b => b.block_type === 'hero')
  if (heroBlock) {
    const updatedContent = {
      ...heroBlock.content,
      backgroundType: 'gradient',
      gradientFrom: '#9CAF88',
      gradientTo: '#637554',
      styles: {
        ...heroBlock.content.styles,
        title: {
          ...heroBlock.content.styles?.title,
          color: '#FFFFFF' // White on gradient
        },
        titleHighlight: {
          color: '#FFFFFF'
        },
        subtitle: {
          ...heroBlock.content.styles?.subtitle,
          color: 'rgba(255, 255, 255, 0.95)'
        }
      }
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedContent })
      .eq('id', heroBlock.id)
    
    console.log('  ✅ Hero block renk iyileştirildi (gradient background)\n')
  }
  
  console.log('='.repeat(70))
  console.log('✅ Landing Page Enterprise İyileştirmeleri Tamamlandı!')
  console.log('\n📊 Yapılan İyileştirmeler:')
  console.log('  ✅ Tüm block\'lara responsive typography eklendi')
  console.log('  ✅ Renk uyumluluğu iyileştirildi (accent & background)')
  console.log('  ✅ Pricing block eklendi')
  console.log('  ✅ Services block\'a guarantee eklendi')
  console.log('  ✅ Hero block gradient background')
  console.log('\n🎯 Beklenen Skor Artışı:')
  console.log('  Yazılar & İçerik: 89/100 → 95+/100')
  console.log('  Font Uyumluluğu: 100/100 → 100/100 ✅')
  console.log('  Renk Uyumluluğu: 60/100 → 90+/100')
  console.log('  Layout & Spacing: 100/100 → 100/100 ✅')
  console.log('  Responsive: 50/100 → 90+/100')
  console.log('  Enterprise: 83/100 → 95+/100')
  console.log('  Genel Skor: 80/100 → 95+/100\n')
}

fixLandingPage().catch(console.error)

