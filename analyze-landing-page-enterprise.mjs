#!/usr/bin/env node

/**
 * Landing Page - Enterprise Seviye Kontrolü
 * Yazılar, Font Uyumluluğu, Tüm Alanlar
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

async function analyzeLandingPage() {
  console.log('🔍 Landing Page - Enterprise Seviye Kontrolü\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  const { data: page } = await supabase.from('pages').select('*').eq('slug', 'home').single()
  if (!page) {
    console.log('❌ Landing page (home) bulunamadı')
    return
  }
  
  const { data: blocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', page.id)
    .order('position', { ascending: true })
  
  console.log('📄 Sayfa: ' + page.title)
  console.log(`📦 Toplam Block: ${blocks?.length || 0}\n`)
  
  // ==========================================
  // 1. YAZILAR & İÇERİK KALİTESİ
  // ==========================================
  console.log('📝 1. YAZILAR & İÇERİK KALİTESİ')
  console.log('-'.repeat(70))
  
  const contentAnalysis = {
    hero: {
      hasTitle: false,
      hasSubtitle: false,
      hasDescription: false,
      titleLength: 0,
      subtitleLength: 0
    },
    sections: {
      hasTitles: false,
      titleCount: 0,
      hasDescriptions: false,
      descriptionCount: 0
    },
    cta: {
      hasCTAText: false,
      ctaCount: 0,
      ctaTexts: []
    },
    completeness: {
      hasHero: false,
      hasFeatures: false,
      hasPricing: false,
      hasTestimonials: false,
      hasFAQ: false,
      hasContact: false
    }
  }
  
  const heroBlock = blocks?.find(b => b.block_type === 'hero')
  if (heroBlock) {
    contentAnalysis.hero.hasTitle = !!heroBlock.content?.title
    contentAnalysis.hero.hasSubtitle = !!heroBlock.content?.subtitle
    contentAnalysis.hero.hasDescription = !!heroBlock.content?.description
    contentAnalysis.hero.titleLength = heroBlock.content?.title?.length || 0
    contentAnalysis.hero.subtitleLength = heroBlock.content?.subtitle?.length || 0
    contentAnalysis.completeness.hasHero = true
  }
  
  const textBlocks = blocks?.filter(b => b.block_type === 'text')
  textBlocks?.forEach(tb => {
    if (tb.content?.title) {
      contentAnalysis.sections.hasTitles = true
      contentAnalysis.sections.titleCount++
    }
    if (tb.content?.content || tb.content?.description) {
      contentAnalysis.sections.hasDescriptions = true
      contentAnalysis.sections.descriptionCount++
    }
  })
  
  const ctaBlocks = blocks?.filter(b => b.block_type === 'cta')
  ctaBlocks?.forEach(cta => {
    if (cta.content?.primaryButton?.text) {
      contentAnalysis.cta.hasCTAText = true
      contentAnalysis.cta.ctaCount++
      contentAnalysis.cta.ctaTexts.push(cta.content.primaryButton.text)
    }
  })
  
  contentAnalysis.completeness.hasFeatures = !!blocks?.find(b => b.block_type === 'features')
  contentAnalysis.completeness.hasPricing = !!blocks?.find(b => b.block_type === 'pricing')
  contentAnalysis.completeness.hasTestimonials = !!blocks?.find(b => b.block_type === 'testimonials')
  contentAnalysis.completeness.hasFAQ = !!blocks?.find(b => b.block_type === 'faq')
  contentAnalysis.completeness.hasContact = !!blocks?.find(b => b.block_type === 'contact')
  
  console.log('✅ Hero Section:')
  console.log('  Title:', contentAnalysis.hero.hasTitle ? '✅ Var (' + contentAnalysis.hero.titleLength + ' char)' : '❌ Yok')
  console.log('  Subtitle:', contentAnalysis.hero.hasSubtitle ? '✅ Var (' + contentAnalysis.hero.subtitleLength + ' char)' : '❌ Yok')
  console.log('  Description:', contentAnalysis.hero.hasDescription ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Section Content:')
  console.log('  Section Titles:', contentAnalysis.sections.titleCount)
  console.log('  Descriptions:', contentAnalysis.sections.descriptionCount)
  
  console.log('\n✅ CTAs:')
  console.log('  CTA Count:', contentAnalysis.cta.ctaCount)
  console.log('  CTA Texts:', contentAnalysis.cta.ctaTexts.join(', ') || 'N/A')
  
  console.log('\n✅ Content Completeness:')
  console.log('  Hero:', contentAnalysis.completeness.hasHero ? '✅' : '❌')
  console.log('  Features:', contentAnalysis.completeness.hasFeatures ? '✅' : '❌')
  console.log('  Pricing:', contentAnalysis.completeness.hasPricing ? '✅' : '❌')
  console.log('  Testimonials:', contentAnalysis.completeness.hasTestimonials ? '✅' : '❌')
  console.log('  FAQ:', contentAnalysis.completeness.hasFAQ ? '✅' : '❌')
  console.log('  Contact:', contentAnalysis.completeness.hasContact ? '✅' : '❌')
  
  const contentScore = (
    (contentAnalysis.hero.hasTitle ? 1 : 0) +
    (contentAnalysis.hero.hasSubtitle ? 1 : 0) +
    (contentAnalysis.sections.hasTitles ? 1 : 0) +
    (contentAnalysis.cta.hasCTAText ? 1 : 0) +
    (contentAnalysis.completeness.hasFeatures ? 1 : 0) +
    (contentAnalysis.completeness.hasPricing ? 1 : 0) +
    (contentAnalysis.completeness.hasTestimonials ? 1 : 0) +
    (contentAnalysis.completeness.hasFAQ ? 1 : 0) +
    (contentAnalysis.completeness.hasContact ? 1 : 0)
  ) / 9 * 100
  
  console.log(`\n📊 Content Score: ${contentScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 2. FONT UYUMLULUĞU & TİPOGRAFİ
  // ==========================================
  console.log('🔤 2. FONT UYUMLULUĞU & TİPOGRAFİ')
  console.log('-'.repeat(70))
  
  const typographyAnalysis = {
    consistency: {
      fontFamily: [],
      fontSizes: [],
      fontWeights: [],
      lineHeights: []
    },
    responsive: {
      hasClamp: false,
      clampCount: 0,
      responsiveBlocks: 0
    },
    hierarchy: {
      hasH1: false,
      hasH2: false,
      hasH3: false,
      h1Count: 0,
      h2Count: 0,
      h3Count: 0
    }
  }
  
  // Font family kontrolü
  blocks?.forEach(block => {
    if (block.content?.styles?.title?.fontFamily) {
      typographyAnalysis.consistency.fontFamily.push(block.content.styles.title.fontFamily)
    }
    if (block.content?.typography?.title?.fontFamily) {
      typographyAnalysis.consistency.fontFamily.push(block.content.typography.title.fontFamily)
    }
    
    // Font size kontrolü
    const titleSize = block.content?.styles?.title?.fontSize || block.content?.typography?.title?.fontSize
    if (titleSize) {
      typographyAnalysis.consistency.fontSizes.push(titleSize)
      if (titleSize.includes('clamp')) {
        typographyAnalysis.responsive.hasClamp = true
        typographyAnalysis.responsive.clampCount++
      }
    }
    
    // Font weight kontrolü
    const fontWeight = block.content?.styles?.title?.fontWeight || block.content?.typography?.title?.fontWeight
    if (fontWeight) {
      typographyAnalysis.consistency.fontWeights.push(fontWeight)
    }
  })
  
  // Hierarchy kontrolü
  if (heroBlock?.content?.title) {
    typographyAnalysis.hierarchy.hasH1 = true
    typographyAnalysis.hierarchy.h1Count = 1
  }
  
  const sectionTitles = blocks?.filter(b => b.content?.title && b.block_type !== 'hero')
  typographyAnalysis.hierarchy.hasH2 = sectionTitles?.length > 0
  typographyAnalysis.hierarchy.h2Count = sectionTitles?.length || 0
  
  const featureTitles = blocks?.filter(b => b.block_type === 'features')
  featureTitles?.forEach(ft => {
    if (ft.content?.features?.length > 0) {
      typographyAnalysis.hierarchy.h3Count += ft.content.features.length
    }
  })
  
  console.log('✅ Font Consistency:')
  const uniqueFonts = [...new Set(typographyAnalysis.consistency.fontFamily)]
  console.log('  Font Families:', uniqueFonts.length > 0 ? uniqueFonts.join(', ') : 'N/A')
  console.log('  Font Sizes:', typographyAnalysis.consistency.fontSizes.length, 'different sizes')
  console.log('  Font Weights:', [...new Set(typographyAnalysis.consistency.fontWeights)].join(', ') || 'N/A')
  
  console.log('\n✅ Responsive Typography:')
  console.log('  Clamp Used:', typographyAnalysis.responsive.hasClamp ? '✅ Var' : '❌ Yok')
  console.log('  Clamp Count:', typographyAnalysis.responsive.clampCount)
  
  console.log('\n✅ Typography Hierarchy:')
  console.log('  H1 (Hero):', typographyAnalysis.hierarchy.hasH1 ? '✅ Var (' + typographyAnalysis.hierarchy.h1Count + ')' : '❌ Yok')
  console.log('  H2 (Sections):', typographyAnalysis.hierarchy.hasH2 ? '✅ Var (' + typographyAnalysis.hierarchy.h2Count + ')' : '❌ Yok')
  console.log('  H3 (Features):', typographyAnalysis.hierarchy.h3Count > 0 ? '✅ Var (' + typographyAnalysis.hierarchy.h3Count + ')' : '❌ Yok')
  
  const typographyScore = (
    (uniqueFonts.length <= 2 ? 1 : 0) + // Max 2 font family
    (typographyAnalysis.responsive.hasClamp ? 1 : 0) +
    (typographyAnalysis.hierarchy.hasH1 ? 1 : 0) +
    (typographyAnalysis.hierarchy.hasH2 ? 1 : 0) +
    (typographyAnalysis.hierarchy.h3Count > 0 ? 1 : 0) +
    (typographyAnalysis.consistency.fontWeights.length > 0 ? 1 : 0)
  ) / 6 * 100
  
  console.log(`\n📊 Typography Score: ${typographyScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 3. RENK UYUMLULUĞU
  // ==========================================
  console.log('🎨 3. RENK UYUMLULUĞU')
  console.log('-'.repeat(70))
  
  const colorAnalysis = {
    brandColors: {
      primary: '#9CAF88',
      secondary: '#637554',
      accent: '#2C2C2C',
      background: '#F7F5F3'
    },
    usage: {
      primaryUsed: false,
      secondaryUsed: false,
      accentUsed: false,
      backgroundUsed: false
    },
    consistency: {
      buttonColors: [],
      backgroundColors: [],
      textColors: []
    }
  }
  
  // Color usage kontrolü
  blocks?.forEach(block => {
    // Button colors
    if (block.content?.primaryButton?.backgroundColor) {
      const bgColor = block.content.primaryButton.backgroundColor
      colorAnalysis.consistency.buttonColors.push(bgColor)
      if (bgColor === colorAnalysis.brandColors.primary) {
        colorAnalysis.usage.primaryUsed = true
      }
    }
    
    // Background colors
    if (block.content?.background?.color) {
      const bgColor = block.content.background.color
      colorAnalysis.consistency.backgroundColors.push(bgColor)
      if (bgColor === colorAnalysis.brandColors.background) {
        colorAnalysis.usage.backgroundUsed = true
      }
    }
    
    if (block.content?.background?.gradientFrom) {
      if (block.content.background.gradientFrom === colorAnalysis.brandColors.primary) {
        colorAnalysis.usage.primaryUsed = true
      }
      if (block.content.background.gradientTo === colorAnalysis.brandColors.secondary) {
        colorAnalysis.usage.secondaryUsed = true
      }
    }
    
    // Text colors
    if (block.content?.typography?.title?.color) {
      const textColor = block.content.typography.title.color
      colorAnalysis.consistency.textColors.push(textColor)
      if (textColor === colorAnalysis.brandColors.accent) {
        colorAnalysis.usage.accentUsed = true
      }
    }
  })
  
  console.log('✅ Brand Colors:')
  console.log('  Primary (#9CAF88):', colorAnalysis.usage.primaryUsed ? '✅ Kullanılıyor' : '❌ Kullanılmıyor')
  console.log('  Secondary (#637554):', colorAnalysis.usage.secondaryUsed ? '✅ Kullanılıyor' : '❌ Kullanılmıyor')
  console.log('  Accent (#2C2C2C):', colorAnalysis.usage.accentUsed ? '✅ Kullanılıyor' : '❌ Kullanılmıyor')
  console.log('  Background (#F7F5F3):', colorAnalysis.usage.backgroundUsed ? '✅ Kullanılıyor' : '❌ Kullanılmıyor')
  
  console.log('\n✅ Color Consistency:')
  const uniqueButtonColors = [...new Set(colorAnalysis.consistency.buttonColors)]
  console.log('  Button Colors:', uniqueButtonColors.length, 'different')
  const uniqueBgColors = [...new Set(colorAnalysis.consistency.backgroundColors)]
  console.log('  Background Colors:', uniqueBgColors.length, 'different')
  
  const colorScore = (
    (colorAnalysis.usage.primaryUsed ? 1 : 0) +
    (colorAnalysis.usage.secondaryUsed ? 1 : 0) +
    (colorAnalysis.usage.accentUsed ? 1 : 0) +
    (colorAnalysis.usage.backgroundUsed ? 1 : 0) +
    (uniqueButtonColors.length <= 2 ? 1 : 0) // Max 2 button colors
  ) / 5 * 100
  
  console.log(`\n📊 Color Score: ${colorScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 4. LAYOUT & SPACING UYUMLULUĞU
  // ==========================================
  console.log('📐 4. LAYOUT & SPACING UYUMLULUĞU')
  console.log('-'.repeat(70))
  
  const layoutAnalysis = {
    spacing: {
      paddings: [],
      margins: [],
      consistentPadding: false,
      consistentMargin: false
    },
    grid: {
      hasGrid: false,
      responsive: false,
      columnCounts: []
    },
    alignment: {
      alignments: [],
      consistentAlignment: false
    }
  }
  
  blocks?.forEach(block => {
    if (block.content?.padding) {
      const padding = block.content.padding
      layoutAnalysis.spacing.paddings.push({
        top: padding.top,
        bottom: padding.bottom
      })
    }
    if (block.content?.margin) {
      const margin = block.content.margin
      layoutAnalysis.spacing.margins.push({
        top: margin.top,
        bottom: margin.bottom
      })
    }
    if (block.content?.alignment) {
      layoutAnalysis.alignment.alignments.push(block.content.alignment)
    }
    if (block.content?.layout === 'grid' || block.content?.layout === 'grid') {
      layoutAnalysis.grid.hasGrid = true
      if (block.content?.responsive) {
        layoutAnalysis.grid.responsive = true
        layoutAnalysis.grid.columnCounts.push({
          desktop: block.content.responsive.desktop,
          tablet: block.content.responsive.tablet,
          mobile: block.content.responsive.mobile
        })
      }
    }
  })
  
  // Consistent padding kontrolü (5rem veya 4rem)
  const commonPadding = layoutAnalysis.spacing.paddings.filter(p => 
    p.top === '5rem' || p.top === '4rem' || p.top === '3rem'
  )
  layoutAnalysis.spacing.consistentPadding = commonPadding.length > layoutAnalysis.spacing.paddings.length * 0.7
  
  console.log('✅ Spacing:')
  console.log('  Padding Blocks:', layoutAnalysis.spacing.paddings.length)
  console.log('  Consistent Padding:', layoutAnalysis.spacing.consistentPadding ? '✅ Var' : '⚠️  İyileştirilebilir')
  console.log('  Margin Blocks:', layoutAnalysis.spacing.margins.length)
  
  console.log('\n✅ Grid System:')
  console.log('  Grid Layout:', layoutAnalysis.grid.hasGrid ? '✅ Var' : '❌ Yok')
  console.log('  Responsive:', layoutAnalysis.grid.responsive ? '✅ Var' : '❌ Yok')
  console.log('  Column Configs:', layoutAnalysis.grid.columnCounts.length)
  
  console.log('\n✅ Alignment:')
  const uniqueAlignments = [...new Set(layoutAnalysis.alignment.alignments)]
  console.log('  Alignments:', uniqueAlignments.join(', ') || 'N/A')
  layoutAnalysis.alignment.consistentAlignment = uniqueAlignments.length <= 2
  
  const layoutScore = (
    (layoutAnalysis.spacing.paddings.length > 0 ? 1 : 0) +
    (layoutAnalysis.spacing.consistentPadding ? 1 : 0) +
    (layoutAnalysis.grid.hasGrid ? 1 : 0) +
    (layoutAnalysis.grid.responsive ? 1 : 0) +
    (layoutAnalysis.alignment.consistentAlignment ? 1 : 0)
  ) / 5 * 100
  
  console.log(`\n📊 Layout Score: ${layoutScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 5. RESPONSIVE UYUMLULUK
  // ==========================================
  console.log('📱 5. RESPONSIVE UYUMLULUK')
  console.log('-'.repeat(70))
  
  const responsiveAnalysis = {
    typography: {
      responsive: typographyAnalysis.responsive.hasClamp,
      clampCount: typographyAnalysis.responsive.clampCount
    },
    layout: {
      responsive: layoutAnalysis.grid.responsive,
      breakpoints: layoutAnalysis.grid.columnCounts.length
    },
    images: {
      hasImages: blocks?.some(b => b.content?.image?.url || b.block_type === 'gallery'),
      responsive: false // Next.js Image component kullanılıyor mu?
    }
  }
  
  console.log('✅ Typography:')
  console.log('  Responsive (clamp):', responsiveAnalysis.typography.responsive ? '✅ Var' : '❌ Yok')
  console.log('  Clamp Usage:', responsiveAnalysis.typography.clampCount, 'blocks')
  
  console.log('\n✅ Layout:')
  console.log('  Responsive Grid:', responsiveAnalysis.layout.responsive ? '✅ Var' : '❌ Yok')
  console.log('  Breakpoints:', responsiveAnalysis.layout.breakpoints, 'blocks')
  
  console.log('\n✅ Images:')
  console.log('  Has Images:', responsiveAnalysis.images.hasImages ? '✅ Var' : '❌ Yok')
  console.log('  Responsive:', responsiveAnalysis.images.responsive ? '✅ Var' : '⚠️  Next.js Image kullanılmalı')
  
  const responsiveScore = (
    (responsiveAnalysis.typography.responsive ? 1 : 0) +
    (responsiveAnalysis.layout.responsive ? 1 : 0) +
    (responsiveAnalysis.images.hasImages ? 1 : 0) +
    (responsiveAnalysis.typography.clampCount > 3 ? 1 : 0)
  ) / 4 * 100
  
  console.log(`\n📊 Responsive Score: ${responsiveScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 6. ENTERPRISE STANDARTLARI
  // ==========================================
  console.log('🏢 6. ENTERPRISE STANDARTLARI')
  console.log('-'.repeat(70))
  
  const enterpriseChecks = {
    structure: {
      hasHero: contentAnalysis.completeness.hasHero,
      hasFeatures: contentAnalysis.completeness.hasFeatures,
      hasPricing: contentAnalysis.completeness.hasPricing,
      hasTestimonials: contentAnalysis.completeness.hasTestimonials,
      hasFAQ: contentAnalysis.completeness.hasFAQ,
      hasContact: contentAnalysis.completeness.hasContact,
      hasFooter: !!blocks?.find(b => b.block_type === 'footer'),
      hasSEO: !!blocks?.find(b => b.block_type === 'seo')
    },
    conversion: {
      ctaCount: contentAnalysis.cta.ctaCount,
      hasBooking: !!blocks?.find(b => b.block_type === 'embed' && b.content?.sectionId === 'booking'),
      hasContact: contentAnalysis.completeness.hasContact
    },
    quality: {
      hasSocialProof: contentAnalysis.completeness.hasTestimonials,
      hasGuarantee: false,
      hasFAQ: contentAnalysis.completeness.hasFAQ
    }
  }
  
  // Guarantee kontrolü
  const pricingBlock = blocks?.find(b => b.block_type === 'pricing')
  if (pricingBlock?.content?.packages) {
    enterpriseChecks.quality.hasGuarantee = pricingBlock.content.packages.some(p => 
      p.guarantee || (p.features && p.features.some(f => {
        if (typeof f === 'string') return f.includes('Garantie')
        if (typeof f === 'object' && f.text) return f.text.includes('Garantie')
        return false
      }))
    )
  }
  
  console.log('✅ Page Structure:')
  console.log('  Hero:', enterpriseChecks.structure.hasHero ? '✅' : '❌')
  console.log('  Features:', enterpriseChecks.structure.hasFeatures ? '✅' : '❌')
  console.log('  Pricing:', enterpriseChecks.structure.hasPricing ? '✅' : '❌')
  console.log('  Testimonials:', enterpriseChecks.structure.hasTestimonials ? '✅' : '❌')
  console.log('  FAQ:', enterpriseChecks.structure.hasFAQ ? '✅' : '❌')
  console.log('  Contact:', enterpriseChecks.structure.hasContact ? '✅' : '❌')
  console.log('  Footer:', enterpriseChecks.structure.hasFooter ? '✅' : '❌')
  console.log('  SEO:', enterpriseChecks.structure.hasSEO ? '✅' : '❌')
  
  console.log('\n✅ Conversion Elements:')
  console.log('  CTA Count:', enterpriseChecks.conversion.ctaCount)
  console.log('  Booking Widget:', enterpriseChecks.conversion.hasBooking ? '✅' : '❌')
  console.log('  Contact Info:', enterpriseChecks.conversion.hasContact ? '✅' : '❌')
  
  console.log('\n✅ Trust & Quality:')
  console.log('  Social Proof:', enterpriseChecks.quality.hasSocialProof ? '✅' : '❌')
  console.log('  Guarantee:', enterpriseChecks.quality.hasGuarantee ? '✅' : '❌')
  console.log('  FAQ:', enterpriseChecks.quality.hasFAQ ? '✅' : '❌')
  
  const enterpriseScore = (
    (enterpriseChecks.structure.hasHero ? 1 : 0) +
    (enterpriseChecks.structure.hasFeatures ? 1 : 0) +
    (enterpriseChecks.structure.hasPricing ? 1 : 0) +
    (enterpriseChecks.structure.hasTestimonials ? 1 : 0) +
    (enterpriseChecks.structure.hasFAQ ? 1 : 0) +
    (enterpriseChecks.structure.hasContact ? 1 : 0) +
    (enterpriseChecks.structure.hasFooter ? 1 : 0) +
    (enterpriseChecks.structure.hasSEO ? 1 : 0) +
    (enterpriseChecks.conversion.ctaCount >= 2 ? 1 : 0) +
    (enterpriseChecks.conversion.hasBooking ? 1 : 0) +
    (enterpriseChecks.quality.hasSocialProof ? 1 : 0) +
    (enterpriseChecks.quality.hasGuarantee ? 1 : 0)
  ) / 12 * 100
  
  console.log(`\n📊 Enterprise Score: ${enterpriseScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // GENEL SKOR
  // ==========================================
  console.log('='.repeat(70))
  console.log('📊 LANDING PAGE ENTERPRISE SKOR ÖZETİ')
  console.log('='.repeat(70))
  console.log(`\n1. Yazılar & İçerik:          ${contentScore.toFixed(0)}/100`)
  console.log(`2. Font Uyumluluğu:           ${typographyScore.toFixed(0)}/100`)
  console.log(`3. Renk Uyumluluğu:           ${colorScore.toFixed(0)}/100`)
  console.log(`4. Layout & Spacing:          ${layoutScore.toFixed(0)}/100`)
  console.log(`5. Responsive Uyumluluk:      ${responsiveScore.toFixed(0)}/100`)
  console.log(`6. Enterprise Standartları:   ${enterpriseScore.toFixed(0)}/100`)
  
  const overallScore = (
    contentScore +
    typographyScore +
    colorScore +
    layoutScore +
    responsiveScore +
    enterpriseScore
  ) / 6
  
  console.log(`\n🎯 GENEL ENTERPRISE SKORU: ${overallScore.toFixed(0)}/100`)
  
  console.log('\n' + '='.repeat(70))
  console.log('💡 İYİLEŞTİRME ÖNERİLERİ:')
  console.log('='.repeat(70))
  
  if (contentScore < 90) {
    console.log('⚠️  İçerik: Bazı section\'larda içerik eksik veya yetersiz')
  }
  if (typographyScore < 90) {
    console.log('⚠️  Tipografi: Font uyumluluğu ve responsive typography iyileştirilebilir')
  }
  if (colorScore < 90) {
    console.log('⚠️  Renkler: Brand colors daha tutarlı kullanılabilir')
  }
  if (layoutScore < 90) {
    console.log('⚠️  Layout: Spacing ve grid system daha tutarlı olabilir')
  }
  if (responsiveScore < 90) {
    console.log('⚠️  Responsive: Typography ve image optimization iyileştirilebilir')
  }
  if (enterpriseScore < 90) {
    console.log('⚠️  Enterprise: Bazı standart elementler eksik veya iyileştirilebilir')
  }
  
  if (overallScore >= 90) {
    console.log('\n✅ Landing page ENTERPRISE seviyede!')
    console.log('   Tüm yazılar, fontlar, renkler ve diğer alanlar uyumlu ve optimize.')
  } else if (overallScore >= 75) {
    console.log('\n✅ Landing page iyi durumda, bazı iyileştirmeler yapılabilir.')
  } else {
    console.log('\n⚠️  Landing page iyileştirme gerektiriyor.')
  }
  
  console.log()
}

analyzeLandingPage().catch(console.error)

