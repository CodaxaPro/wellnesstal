#!/usr/bin/env node

/**
 * Headspa Sayfası - Tasarım İyileştirmeleri
 * Grafik & Web Tasarımı Uzmanı Perspektifi
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

async function fixDesign() {
  console.log('🎨 Headspa Sayfası - Tasarım İyileştirmeleri\n')
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
  
  console.log('📄 Sayfa: Headspa\n')
  
  // ==========================================
  // 1. HERO BLOCK - RENK & TİPOGRAFİ İYİLEŞTİRME
  // ==========================================
  console.log('1️⃣  Hero Block - Renk & Tipografi iyileştiriliyor...')
  const heroBlock = blocks?.find(b => b.block_type === 'hero')
  if (heroBlock) {
    const updatedHeroContent = {
      ...heroBlock.content,
      backgroundType: 'gradient',
      gradientFrom: '#9CAF88', // Primary brand color
      gradientTo: '#637554',   // Secondary brand color
      styles: {
        ...heroBlock.content.styles,
        title: {
          ...heroBlock.content.styles?.title,
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', // Responsive typography
          fontWeight: '700', // Bold
          color: '#2C2C2C', // Charcoal
          lineHeight: '1.1'
        },
        titleHighlight: {
          color: '#FFFFFF' // White for contrast on gradient
        },
        subtitle: {
          fontSize: 'clamp(1.125rem, 2vw, 1.5rem)', // Responsive
          fontWeight: '400',
          color: 'rgba(255, 255, 255, 0.95)',
          lineHeight: '1.6'
        },
        ctaButton: {
          ...heroBlock.content.styles?.ctaButton,
          backgroundColor: '#FFFFFF',
          textColor: '#9CAF88',
          fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
          fontWeight: '600',
          borderRadius: '12px',
          padding: '16px 32px',
          hoverEffect: 'scale',
          shadow: 'lg'
        }
      }
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedHeroContent })
      .eq('id', heroBlock.id)
    
    console.log('  ✅ Hero renk paleti ve tipografi iyileştirildi\n')
  }
  
  // ==========================================
  // 2. CTA BLOCKS - RENK TUTARLILIĞI
  // ==========================================
  console.log('2️⃣  CTA Blocks - Renk tutarlılığı sağlanıyor...')
  const ctaBlocks = blocks?.filter(b => b.block_type === 'cta')
  
  for (const cta of ctaBlocks || []) {
    const updatedCtaContent = {
      ...cta.content,
      primaryButton: {
        ...cta.content.primaryButton,
        backgroundColor: '#9CAF88', // Primary brand color
        textColor: '#FFFFFF',
        hoverBackgroundColor: '#637554', // Secondary on hover
        borderRadius: '12px',
        shadow: 'lg',
        hoverEffect: 'scale'
      },
      background: {
        type: 'gradient',
        gradientFrom: '#9CAF88',
        gradientTo: '#637554',
        gradientDirection: 'to-br'
      },
      typography: {
        ...cta.content.typography,
        title: {
          ...cta.content.typography?.title,
          fontSize: 'clamp(2rem, 4vw, 3rem)', // Responsive
          fontWeight: '700',
          color: '#FFFFFF'
        },
        subtitle: {
          ...cta.content.typography?.subtitle,
          fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', // Responsive
          color: 'rgba(255, 255, 255, 0.9)'
        }
      }
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedCtaContent })
      .eq('id', cta.id)
  }
  
  console.log(`  ✅ ${ctaBlocks?.length || 0} CTA block renk tutarlılığı sağlandı\n`)
  
  // ==========================================
  // 3. TEXT BLOCKS - TİPOGRAFİ İYİLEŞTİRME
  // ==========================================
  console.log('3️⃣  Text Blocks - Tipografi iyileştiriliyor...')
  const textBlocks = blocks?.filter(b => b.block_type === 'text')
  
  for (const textBlock of textBlocks || []) {
    const updatedTextContent = {
      ...textBlock.content,
      typography: {
        title: {
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', // Responsive
          fontWeight: '700',
          color: '#2C2C2C',
          lineHeight: '1.2'
        },
        content: {
          fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', // Responsive
          fontWeight: '400',
          color: '#666666',
          lineHeight: '1.6'
        }
      },
      padding: {
        top: '4rem',
        bottom: '4rem',
        left: '2rem',
        right: '2rem'
      },
      margin: {
        top: '0',
        bottom: '0'
      }
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedTextContent })
      .eq('id', textBlock.id)
  }
  
  console.log(`  ✅ ${textBlocks?.length || 0} text block tipografi iyileştirildi\n`)
  
  // ==========================================
  // 4. FEATURES BLOCKS - LAYOUT & SPACING
  // ==========================================
  console.log('4️⃣  Features Blocks - Layout & spacing iyileştiriliyor...')
  const featuresBlocks = blocks?.filter(b => b.block_type === 'features')
  
  for (const featuresBlock of featuresBlocks || []) {
    const updatedFeaturesContent = {
      ...featuresBlock.content,
      padding: {
        top: '5rem',
        bottom: '5rem',
        left: '2rem',
        right: '2rem'
      },
      margin: {
        top: '0',
        bottom: '0'
      },
      gridGap: '2rem',
      typography: {
        ...featuresBlock.content.typography,
        sectionTitle: {
          ...featuresBlock.content.typography?.sectionTitle,
          fontSize: 'clamp(2rem, 3vw, 2.5rem)', // Responsive
          fontWeight: '700',
          color: '#2C2C2C',
          alignment: 'center',
          marginBottom: '2rem'
        },
        featureTitle: {
          ...featuresBlock.content.typography?.featureTitle,
          fontSize: 'clamp(1.25rem, 2vw, 1.5rem)', // Responsive
          fontWeight: '600',
          color: '#2C2C2C'
        },
        featureDescription: {
          ...featuresBlock.content.typography?.featureDescription,
          fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', // Responsive
          fontWeight: '400',
          color: '#666666'
        }
      },
      cardStyles: {
        ...featuresBlock.content.cardStyles,
        borderRadius: '16px',
        shadow: 'md',
        paddingX: '2rem',
        paddingY: '2.5rem',
        hoverEffect: 'lift'
      }
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedFeaturesContent })
      .eq('id', featuresBlock.id)
  }
  
  console.log(`  ✅ ${featuresBlocks?.length || 0} features block layout iyileştirildi\n`)
  
  // ==========================================
  // 5. PRICING BLOCK - RENK & TİPOGRAFİ
  // ==========================================
  console.log('5️⃣  Pricing Block - Renk & tipografi iyileştiriliyor...')
  const pricingBlock = blocks?.find(b => b.block_type === 'pricing')
  if (pricingBlock) {
    const updatedPricingContent = {
      ...pricingBlock.content,
      typography: {
        title: {
          fontSize: 'clamp(2rem, 3vw, 2.5rem)', // Responsive
          fontWeight: '700',
          color: '#2C2C2C'
        },
        subtitle: {
          fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', // Responsive
          fontWeight: '400',
          color: '#666666'
        }
      },
      padding: {
        top: '5rem',
        bottom: '5rem',
        left: '2rem',
        right: '2rem'
      }
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedPricingContent })
      .eq('id', pricingBlock.id)
    
    console.log('  ✅ Pricing block renk & tipografi iyileştirildi\n')
  }
  
  // ==========================================
  // 6. GALLERY BLOCK - RESPONSIVE İYİLEŞTİRME
  // ==========================================
  console.log('6️⃣  Gallery Block - Responsive iyileştiriliyor...')
  const galleryBlock = blocks?.find(b => b.block_type === 'gallery')
  if (galleryBlock) {
    const updatedGalleryContent = {
      ...galleryBlock.content,
      layout: {
        ...galleryBlock.content.layout,
        columns: 3,
        gap: '1.5rem'
      },
      responsive: {
        desktop: 3,
        tablet: 2,
        mobile: 1
      },
      padding: {
        top: '5rem',
        bottom: '5rem',
        left: '2rem',
        right: '2rem'
      }
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedGalleryContent })
      .eq('id', galleryBlock.id)
    
    console.log('  ✅ Gallery block responsive iyileştirildi\n')
  }
  
  // ==========================================
  // 7. TESTIMONIALS BLOCK - TİPOGRAFİ
  // ==========================================
  console.log('7️⃣  Testimonials Block - Tipografi iyileştiriliyor...')
  const testimonialsBlock = blocks?.find(b => b.block_type === 'testimonials')
  if (testimonialsBlock) {
    const updatedTestimonialsContent = {
      ...testimonialsBlock.content,
      typography: {
        title: {
          fontSize: 'clamp(2rem, 3vw, 2.5rem)', // Responsive
          fontWeight: '700',
          color: '#2C2C2C'
        },
        subtitle: {
          fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', // Responsive
          fontWeight: '400',
          color: '#666666'
        }
      },
      padding: {
        top: '5rem',
        bottom: '5rem',
        left: '2rem',
        right: '2rem'
      }
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedTestimonialsContent })
      .eq('id', testimonialsBlock.id)
    
    console.log('  ✅ Testimonials block tipografi iyileştirildi\n')
  }
  
  // ==========================================
  // 8. FAQ BLOCK - TİPOGRAFİ & SPACING
  // ==========================================
  console.log('8️⃣  FAQ Block - Tipografi & spacing iyileştiriliyor...')
  const faqBlock = blocks?.find(b => b.block_type === 'faq')
  if (faqBlock) {
    const updatedFaqContent = {
      ...faqBlock.content,
      typography: {
        title: {
          fontSize: 'clamp(2rem, 3vw, 2.5rem)', // Responsive
          fontWeight: '700',
          color: '#2C2C2C'
        },
        subtitle: {
          fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', // Responsive
          fontWeight: '400',
          color: '#666666'
        },
        question: {
          fontSize: 'clamp(1.125rem, 1.5vw, 1.25rem)', // Responsive
          fontWeight: '600',
          color: '#2C2C2C'
        },
        answer: {
          fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', // Responsive
          fontWeight: '400',
          color: '#666666'
        }
      },
      padding: {
        top: '5rem',
        bottom: '5rem',
        left: '2rem',
        right: '2rem'
      }
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedFaqContent })
      .eq('id', faqBlock.id)
    
    console.log('  ✅ FAQ block tipografi & spacing iyileştirildi\n')
  }
  
  // ==========================================
  // 9. CONTACT BLOCK - RENK & TİPOGRAFİ
  // ==========================================
  console.log('9️⃣  Contact Block - Renk & tipografi iyileştiriliyor...')
  const contactBlock = blocks?.find(b => b.block_type === 'contact')
  if (contactBlock) {
    const updatedContactContent = {
      ...contactBlock.content,
      styles: {
        ...contactBlock.content.styles,
        sectionTitle: {
          fontSize: 'clamp(2rem, 3vw, 2.5rem)', // Responsive
          fontWeight: '700',
          color: '#2C2C2C'
        },
        highlightedText: {
          fontSize: 'clamp(2rem, 3vw, 2.5rem)', // Responsive
          fontWeight: '700',
          color: '#9CAF88' // Primary brand color
        }
      },
      padding: {
        top: '5rem',
        bottom: '5rem',
        left: '2rem',
        right: '2rem'
      }
    }
    
    await supabase
      .from('page_blocks')
      .update({ content: updatedContactContent })
      .eq('id', contactBlock.id)
    
    console.log('  ✅ Contact block renk & tipografi iyileştirildi\n')
  }
  
  console.log('='.repeat(70))
  console.log('✅ Tasarım İyileştirmeleri Tamamlandı!')
  console.log('\n📊 Yapılan İyileştirmeler:')
  console.log('  ✅ Hero: Gradient background (brand colors)')
  console.log('  ✅ Hero: Responsive typography (clamp)')
  console.log('  ✅ Hero: Bold font weights (700)')
  console.log('  ✅ CTA Blocks: Brand color consistency')
  console.log('  ✅ Text Blocks: Responsive typography')
  console.log('  ✅ Features: Improved spacing & layout')
  console.log('  ✅ Pricing: Responsive typography')
  console.log('  ✅ Gallery: Responsive grid')
  console.log('  ✅ Testimonials: Responsive typography')
  console.log('  ✅ FAQ: Responsive typography & spacing')
  console.log('  ✅ Contact: Brand color usage')
  console.log('\n🎯 Beklenen Skor Artışı:')
  console.log('  Renk Paleti: 67/100 → 90+/100')
  console.log('  Tipografi: 60/100 → 90+/100')
  console.log('  Layout: 75/100 → 90+/100')
  console.log('  Responsive: 67/100 → 90+/100')
  console.log('  Genel Tasarım: 81/100 → 95+/100\n')
}

fixDesign().catch(console.error)

