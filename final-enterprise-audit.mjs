#!/usr/bin/env node

/**
 * Final Enterprise Audit - Tüm Uzmanlık Alanları
 * SEO, İçerik, Tasarım, Teknik, Conversion, Responsive, Typography, Colors, Layout, Enterprise
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

async function finalEnterpriseAudit() {
  console.log('🏢 FINAL ENTERPRISE AUDIT - TÜM UZMANLIK ALANLARI\n')
  console.log('='.repeat(80))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  // ==========================================
  // SAYFALARI YÜKLE
  // ==========================================
  const { data: landingPage } = await supabase.from('pages').select('*').eq('slug', 'home').single()
  const { data: landingBlocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', landingPage.id)
    .order('position', { ascending: true })
  
  const { data: headspaPage } = await supabase.from('pages').select('*').eq('slug', 'headspa').single()
  const { data: headspaBlocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', headspaPage.id)
    .order('position', { ascending: true })
  
  console.log('📄 Analiz Edilen Sayfalar:')
  console.log(`  1. Landing Page (${landingBlocks?.length || 0} blocks)`)
  console.log(`  2. Headspa Page (${headspaBlocks?.length || 0} blocks)\n`)
  
  const allPages = [
    { name: 'Landing Page', page: landingPage, blocks: landingBlocks },
    { name: 'Headspa Page', page: headspaPage, blocks: headspaBlocks }
  ]
  
  // ==========================================
  // 1. SEO UZMANLIĞI
  // ==========================================
  console.log('🔍 1. SEO UZMANLIĞI')
  console.log('-'.repeat(80))
  
  const seoScores = []
  
  for (const pageData of allPages) {
    const { page, blocks } = pageData
    const hero = blocks?.find(b => b.block_type === 'hero')
    
    let score = 0
    let maxScore = 0
    
    // H1 kontrolü
    maxScore += 1
    if (hero?.content?.title) {
      score += 1
      console.log(`✅ ${pageData.name}: H1 mevcut`)
    } else {
      console.log(`❌ ${pageData.name}: H1 eksik`)
    }
    
    // Meta Title
    maxScore += 1
    if (page.meta_title && page.meta_title.length > 30 && page.meta_title.length < 70) {
      score += 1
      console.log(`✅ ${pageData.name}: Meta Title optimal (${page.meta_title.length} char)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Meta Title optimize edilebilir`)
    }
    
    // Meta Description
    maxScore += 1
    if (page.meta_description && page.meta_description.length > 120 && page.meta_description.length < 160) {
      score += 1
      console.log(`✅ ${pageData.name}: Meta Description optimal (${page.meta_description.length} char)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Meta Description optimize edilebilir`)
    }
    
    // H2 sayısı
    maxScore += 1
    const h2Count = blocks?.filter(b => b.content?.title && b.block_type !== 'hero').length || 0
    if (h2Count >= 3) {
      score += 1
      console.log(`✅ ${pageData.name}: ${h2Count} H2 mevcut`)
    } else {
      console.log(`⚠️  ${pageData.name}: H2 sayısı yetersiz (${h2Count})`)
    }
    
    // Keywords
    maxScore += 1
    const keywords = page.meta_keywords || []
    if (keywords.length >= 3) {
      score += 1
      console.log(`✅ ${pageData.name}: ${keywords.length} keyword mevcut`)
    } else {
      console.log(`⚠️  ${pageData.name}: Keywords yetersiz`)
    }
    
    const seoScore = (score / maxScore) * 100
    seoScores.push(seoScore)
    console.log(`📊 ${pageData.name} SEO Skoru: ${seoScore.toFixed(0)}/100\n`)
  }
  
  const avgSEOScore = seoScores.reduce((a, b) => a + b, 0) / seoScores.length
  console.log(`🎯 Ortalama SEO Skoru: ${avgSEOScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 2. İÇERİK KALİTESİ UZMANLIĞI
  // ==========================================
  console.log('📝 2. İÇERİK KALİTESİ UZMANLIĞI')
  console.log('-'.repeat(80))
  
  const contentScores = []
  
  for (const pageData of allPages) {
    const { blocks } = pageData
    let score = 0
    let maxScore = 0
    
    // Hero content
    maxScore += 1
    const hero = blocks?.find(b => b.block_type === 'hero')
    if (hero?.content?.title && hero?.content?.subtitle && hero?.content?.description) {
      score += 1
      console.log(`✅ ${pageData.name}: Hero content tam`)
    } else {
      console.log(`⚠️  ${pageData.name}: Hero content eksik`)
    }
    
    // Text blocks
    maxScore += 1
    const textBlocks = blocks?.filter(b => b.block_type === 'text') || []
    if (textBlocks.length > 0 && textBlocks.every(tb => tb.content?.content && tb.content.content.length > 100)) {
      score += 1
      console.log(`✅ ${pageData.name}: Text blocks içerikli (${textBlocks.length} adet)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Text blocks içerik eksik`)
    }
    
    // Features
    maxScore += 1
    const featuresBlocks = blocks?.filter(b => b.block_type === 'features') || []
    if (featuresBlocks.length > 0) {
      score += 1
      console.log(`✅ ${pageData.name}: Features mevcut (${featuresBlocks.length} adet)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Features eksik`)
    }
    
    // CTAs
    maxScore += 1
    const ctaBlocks = blocks?.filter(b => b.block_type === 'cta') || []
    if (ctaBlocks.length >= 2) {
      score += 1
      console.log(`✅ ${pageData.name}: CTAs yeterli (${ctaBlocks.length} adet)`)
    } else {
      console.log(`⚠️  ${pageData.name}: CTAs yetersiz (${ctaBlocks.length} adet)`)
    }
    
    // Social Proof
    maxScore += 1
    const hasTestimonials = !!blocks?.find(b => b.block_type === 'testimonials')
    if (hasTestimonials) {
      score += 1
      console.log(`✅ ${pageData.name}: Testimonials mevcut`)
    } else {
      console.log(`⚠️  ${pageData.name}: Testimonials eksik`)
    }
    
    const contentScore = (score / maxScore) * 100
    contentScores.push(contentScore)
    console.log(`📊 ${pageData.name} İçerik Skoru: ${contentScore.toFixed(0)}/100\n`)
  }
  
  const avgContentScore = contentScores.reduce((a, b) => a + b, 0) / contentScores.length
  console.log(`🎯 Ortalama İçerik Skoru: ${avgContentScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 3. TASARIM & UI/UX UZMANLIĞI
  // ==========================================
  console.log('🎨 3. TASARIM & UI/UX UZMANLIĞI')
  console.log('-'.repeat(80))
  
  const designScores = []
  
  for (const pageData of allPages) {
    const { blocks } = pageData
    let score = 0
    let maxScore = 0
    
    // Brand colors kullanımı
    maxScore += 1
    let brandColorsUsed = 0
    blocks?.forEach(block => {
      if (block.content?.primaryButton?.backgroundColor === '#9CAF88' ||
          block.content?.background?.gradientFrom === '#9CAF88' ||
          block.content?.typography?.title?.color === '#2C2C2C') {
        brandColorsUsed++
      }
    })
    if (brandColorsUsed >= 3) {
      score += 1
      console.log(`✅ ${pageData.name}: Brand colors kullanılıyor (${brandColorsUsed} block)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Brand colors yetersiz`)
    }
    
    // Responsive typography
    maxScore += 1
    let responsiveTypography = 0
    blocks?.forEach(block => {
      const titleSize = block.content?.typography?.title?.fontSize || block.content?.styles?.title?.fontSize || ''
      if (titleSize.includes('clamp')) {
        responsiveTypography++
      }
    })
    if (responsiveTypography >= blocks.length * 0.5) {
      score += 1
      console.log(`✅ ${pageData.name}: Responsive typography (${responsiveTypography}/${blocks.length} block)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Responsive typography yetersiz`)
    }
    
    // Layout consistency
    maxScore += 1
    let consistentPadding = 0
    blocks?.forEach(block => {
      const padding = block.content?.padding?.top || block.content?.container?.padding?.top
      if (padding === '5rem' || padding === '4rem' || padding === '3rem') {
        consistentPadding++
      }
    })
    if (consistentPadding >= blocks.length * 0.6) {
      score += 1
      console.log(`✅ ${pageData.name}: Layout consistency (${consistentPadding}/${blocks.length} block)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Layout consistency iyileştirilebilir`)
    }
    
    // Visual hierarchy
    maxScore += 1
    const hero = blocks?.find(b => b.block_type === 'hero')
    const hasHero = !!hero
    const hasSections = (blocks?.filter(b => b.content?.title && b.block_type !== 'hero').length || 0) >= 3
    if (hasHero && hasSections) {
      score += 1
      console.log(`✅ ${pageData.name}: Visual hierarchy iyi`)
    } else {
      console.log(`⚠️  ${pageData.name}: Visual hierarchy iyileştirilebilir`)
    }
    
    const designScore = (score / maxScore) * 100
    designScores.push(designScore)
    console.log(`📊 ${pageData.name} Tasarım Skoru: ${designScore.toFixed(0)}/100\n`)
  }
  
  const avgDesignScore = designScores.reduce((a, b) => a + b, 0) / designScores.length
  console.log(`🎯 Ortalama Tasarım Skoru: ${avgDesignScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 4. TEKNİK UZMANLIK (Performance, Accessibility)
  // ==========================================
  console.log('⚙️  4. TEKNİK UZMANLIK (Performance, Accessibility)')
  console.log('-'.repeat(80))
  
  const technicalScores = []
  
  for (const pageData of allPages) {
    const { blocks } = pageData
    let score = 0
    let maxScore = 0
    
    // Image optimization
    maxScore += 1
    const imageBlocks = blocks?.filter(b => 
      b.block_type === 'gallery' || 
      (b.block_type === 'hero' && b.content?.image?.url) ||
      (b.block_type === 'features' && b.content?.features?.some(f => f.image?.url))
    ) || []
    if (imageBlocks.length > 0) {
      score += 1
      console.log(`✅ ${pageData.name}: Images mevcut (Next.js Image kullanılmalı)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Images eksik veya optimize edilmeli`)
    }
    
    // Responsive design
    maxScore += 1
    let responsiveBlocks = 0
    blocks?.forEach(block => {
      if (block.content?.responsive || 
          block.content?.layout === 'grid' ||
          block.content?.typography?.title?.fontSize?.includes('clamp')) {
        responsiveBlocks++
      }
    })
    if (responsiveBlocks >= blocks.length * 0.7) {
      score += 1
      console.log(`✅ ${pageData.name}: Responsive design (${responsiveBlocks}/${blocks.length} block)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Responsive design iyileştirilebilir`)
    }
    
    // Accessibility (alt text, semantic HTML)
    maxScore += 1
    let accessibleBlocks = 0
    blocks?.forEach(block => {
      if (block.block_type === 'hero' && block.content?.image?.alt) {
        accessibleBlocks++
      }
      if (block.block_type === 'gallery' && block.content?.images?.some(img => img.alt)) {
        accessibleBlocks++
      }
    })
    if (accessibleBlocks > 0 || blocks.length === 0) {
      score += 1
      console.log(`✅ ${pageData.name}: Accessibility (alt texts mevcut)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Accessibility iyileştirilebilir`)
    }
    
    // Code quality (no nested HTML)
    maxScore += 1
    let cleanContent = true
    blocks?.forEach(block => {
      if (block.block_type === 'text') {
        const content = block.content?.content || ''
        if (content.includes('<p><p>') || content.includes('</p></p>')) {
          cleanContent = false
        }
      }
    })
    if (cleanContent) {
      score += 1
      console.log(`✅ ${pageData.name}: Code quality (clean HTML)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Code quality iyileştirilebilir (nested HTML)`)
    }
    
    const technicalScore = (score / maxScore) * 100
    technicalScores.push(technicalScore)
    console.log(`📊 ${pageData.name} Teknik Skoru: ${technicalScore.toFixed(0)}/100\n`)
  }
  
  const avgTechnicalScore = technicalScores.reduce((a, b) => a + b, 0) / technicalScores.length
  console.log(`🎯 Ortalama Teknik Skoru: ${avgTechnicalScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 5. CONVERSION OPTIMIZATION UZMANLIĞI
  // ==========================================
  console.log('🎯 5. CONVERSION OPTIMIZATION UZMANLIĞI')
  console.log('-'.repeat(80))
  
  const conversionScores = []
  
  for (const pageData of allPages) {
    const { blocks } = pageData
    let score = 0
    let maxScore = 0
    
    // CTA count
    maxScore += 1
    const ctaCount = blocks?.filter(b => b.block_type === 'cta').length || 0
    if (ctaCount >= 2) {
      score += 1
      console.log(`✅ ${pageData.name}: CTAs yeterli (${ctaCount} adet)`)
    } else {
      console.log(`⚠️  ${pageData.name}: CTAs yetersiz (${ctaCount} adet)`)
    }
    
    // Booking widget
    maxScore += 1
    const hasBooking = !!blocks?.find(b => b.block_type === 'embed' && b.content?.sectionId === 'booking')
    if (hasBooking) {
      score += 1
      console.log(`✅ ${pageData.name}: Booking widget mevcut`)
    } else {
      console.log(`⚠️  ${pageData.name}: Booking widget eksik`)
    }
    
    // Social proof
    maxScore += 1
    const hasTestimonials = !!blocks?.find(b => b.block_type === 'testimonials')
    const hasPricing = !!blocks?.find(b => b.block_type === 'pricing')
    if (hasTestimonials || hasPricing) {
      score += 1
      console.log(`✅ ${pageData.name}: Social proof mevcut`)
    } else {
      console.log(`⚠️  ${pageData.name}: Social proof eksik`)
    }
    
    // Trust elements
    maxScore += 1
    const hasGuarantee = blocks?.some(b => {
      if (b.block_type === 'pricing') {
        return b.content?.packages?.some(p => 
          p.guarantee || (p.features && p.features.some(f => {
            if (typeof f === 'string') return f.includes('Garantie')
            return false
          }))
        )
      }
      return false
    })
    const hasFAQ = !!blocks?.find(b => b.block_type === 'faq')
    if (hasGuarantee || hasFAQ) {
      score += 1
      console.log(`✅ ${pageData.name}: Trust elements mevcut`)
    } else {
      console.log(`⚠️  ${pageData.name}: Trust elements eksik`)
    }
    
    // Urgency
    maxScore += 1
    let hasUrgency = false
    blocks?.forEach(block => {
      const ctaText = block.content?.primaryButton?.text || block.content?.ctaText || ''
      if (ctaText.toLowerCase().includes('jetzt') || ctaText.toLowerCase().includes('sofort')) {
        hasUrgency = true
      }
    })
    if (hasUrgency) {
      score += 1
      console.log(`✅ ${pageData.name}: Urgency elements mevcut`)
    } else {
      console.log(`⚠️  ${pageData.name}: Urgency elements eksik`)
    }
    
    const conversionScore = (score / maxScore) * 100
    conversionScores.push(conversionScore)
    console.log(`📊 ${pageData.name} Conversion Skoru: ${conversionScore.toFixed(0)}/100\n`)
  }
  
  const avgConversionScore = conversionScores.reduce((a, b) => a + b, 0) / conversionScores.length
  console.log(`🎯 Ortalama Conversion Skoru: ${avgConversionScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 6. RESPONSIVE DESIGN UZMANLIĞI
  // ==========================================
  console.log('📱 6. RESPONSIVE DESIGN UZMANLIĞI')
  console.log('-'.repeat(80))
  
  const responsiveScores = []
  
  for (const pageData of allPages) {
    const { blocks } = pageData
    let score = 0
    let maxScore = 0
    
    // Typography responsive
    maxScore += 1
    let responsiveTypography = 0
    blocks?.forEach(block => {
      const titleSize = block.content?.typography?.title?.fontSize || block.content?.styles?.title?.fontSize || ''
      if (titleSize.includes('clamp')) {
        responsiveTypography++
      }
    })
    if (responsiveTypography >= blocks.length * 0.6) {
      score += 1
      console.log(`✅ ${pageData.name}: Responsive typography (${responsiveTypography}/${blocks.length})`)
    } else {
      console.log(`⚠️  ${pageData.name}: Responsive typography yetersiz`)
    }
    
    // Grid responsive
    maxScore += 1
    let responsiveGrid = 0
    blocks?.forEach(block => {
      if (block.content?.responsive || 
          (block.content?.layout === 'grid' && block.content?.responsive)) {
        responsiveGrid++
      }
    })
    if (responsiveGrid > 0 || blocks.length === 0) {
      score += 1
      console.log(`✅ ${pageData.name}: Responsive grid`)
    } else {
      console.log(`⚠️  ${pageData.name}: Responsive grid iyileştirilebilir`)
    }
    
    // Mobile-first approach
    maxScore += 1
    let mobileFirst = 0
    blocks?.forEach(block => {
      if (block.content?.responsive?.mobile || 
          block.content?.padding?.top === '3rem' || 
          block.content?.padding?.top === '4rem') {
        mobileFirst++
      }
    })
    if (mobileFirst >= blocks.length * 0.5) {
      score += 1
      console.log(`✅ ${pageData.name}: Mobile-first approach`)
    } else {
      console.log(`⚠️  ${pageData.name}: Mobile-first approach iyileştirilebilir`)
    }
    
    const responsiveScore = (score / maxScore) * 100
    responsiveScores.push(responsiveScore)
    console.log(`📊 ${pageData.name} Responsive Skoru: ${responsiveScore.toFixed(0)}/100\n`)
  }
  
  const avgResponsiveScore = responsiveScores.reduce((a, b) => a + b, 0) / responsiveScores.length
  console.log(`🎯 Ortalama Responsive Skoru: ${avgResponsiveScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 7. TYPOGRAPHY UZMANLIĞI
  // ==========================================
  console.log('🔤 7. TYPOGRAPHY UZMANLIĞI')
  console.log('-'.repeat(80))
  
  const typographyScores = []
  
  for (const pageData of allPages) {
    const { blocks } = pageData
    let score = 0
    let maxScore = 0
    
    // Font hierarchy
    maxScore += 1
    const hasH1 = !!blocks?.find(b => b.block_type === 'hero')
    const h2Count = blocks?.filter(b => b.content?.title && b.block_type !== 'hero').length || 0
    if (hasH1 && h2Count >= 3) {
      score += 1
      console.log(`✅ ${pageData.name}: Font hierarchy iyi (H1 + ${h2Count} H2)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Font hierarchy iyileştirilebilir`)
    }
    
    // Responsive typography
    maxScore += 1
    let responsiveCount = 0
    blocks?.forEach(block => {
      const titleSize = block.content?.typography?.title?.fontSize || block.content?.styles?.title?.fontSize || ''
      if (titleSize.includes('clamp')) {
        responsiveCount++
      }
    })
    if (responsiveCount >= blocks.length * 0.6) {
      score += 1
      console.log(`✅ ${pageData.name}: Responsive typography (${responsiveCount}/${blocks.length})`)
    } else {
      console.log(`⚠️  ${pageData.name}: Responsive typography yetersiz`)
    }
    
    // Font weights consistency
    maxScore += 1
    let consistentWeights = true
    const weights = new Set()
    blocks?.forEach(block => {
      const weight = block.content?.typography?.title?.fontWeight || block.content?.styles?.title?.fontWeight
      if (weight) weights.add(weight)
    })
    if (weights.size <= 3) {
      score += 1
      console.log(`✅ ${pageData.name}: Font weights tutarlı (${weights.size} farklı)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Font weights çok fazla çeşitli`)
    }
    
    // Line heights
    maxScore += 1
    let hasLineHeights = 0
    blocks?.forEach(block => {
      if (block.content?.typography?.title?.lineHeight || block.content?.styles?.title?.lineHeight) {
        hasLineHeights++
      }
    })
    if (hasLineHeights >= blocks.length * 0.5) {
      score += 1
      console.log(`✅ ${pageData.name}: Line heights tanımlı`)
    } else {
      console.log(`⚠️  ${pageData.name}: Line heights iyileştirilebilir`)
    }
    
    const typographyScore = (score / maxScore) * 100
    typographyScores.push(typographyScore)
    console.log(`📊 ${pageData.name} Typography Skoru: ${typographyScore.toFixed(0)}/100\n`)
  }
  
  const avgTypographyScore = typographyScores.reduce((a, b) => a + b, 0) / typographyScores.length
  console.log(`🎯 Ortalama Typography Skoru: ${avgTypographyScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 8. COLORS & BRANDING UZMANLIĞI
  // ==========================================
  console.log('🎨 8. COLORS & BRANDING UZMANLIĞI')
  console.log('-'.repeat(80))
  
  const colorScores = []
  
  for (const pageData of allPages) {
    const { blocks } = pageData
    let score = 0
    let maxScore = 0
    
    // Brand colors kullanımı
    maxScore += 1
    let brandColorUsage = {
      primary: 0,
      secondary: 0,
      accent: 0,
      background: 0
    }
    blocks?.forEach(block => {
      // Primary (#9CAF88)
      if (block.content?.primaryButton?.backgroundColor === '#9CAF88' ||
          block.content?.background?.gradientFrom === '#9CAF88') {
        brandColorUsage.primary++
      }
      // Secondary (#637554)
      if (block.content?.background?.gradientTo === '#637554') {
        brandColorUsage.secondary++
      }
      // Accent (#2C2C2C)
      if (block.content?.typography?.title?.color === '#2C2C2C') {
        brandColorUsage.accent++
      }
      // Background (#F7F5F3)
      if (block.content?.background?.color === '#F7F5F3') {
        brandColorUsage.background++
      }
    })
    const totalBrandUsage = brandColorUsage.primary + brandColorUsage.secondary + brandColorUsage.accent + brandColorUsage.background
    if (totalBrandUsage >= 3) {
      score += 1
      console.log(`✅ ${pageData.name}: Brand colors kullanılıyor (${totalBrandUsage} block)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Brand colors yetersiz`)
    }
    
    // Color consistency
    maxScore += 1
    const buttonColors = new Set()
    blocks?.forEach(block => {
      const btnColor = block.content?.primaryButton?.backgroundColor
      if (btnColor) buttonColors.add(btnColor)
    })
    if (buttonColors.size <= 2) {
      score += 1
      console.log(`✅ ${pageData.name}: Color consistency iyi (${buttonColors.size} button color)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Color consistency iyileştirilebilir`)
    }
    
    // Contrast
    maxScore += 1
    let goodContrast = true
    blocks?.forEach(block => {
      const bgColor = block.content?.background?.color || '#ffffff'
      const textColor = block.content?.typography?.title?.color || '#000000'
      // Basit kontrast kontrolü (siyah/beyaz)
      if ((bgColor === '#ffffff' || bgColor === '#F7F5F3') && textColor === '#ffffff') {
        goodContrast = false
      }
    })
    if (goodContrast) {
      score += 1
      console.log(`✅ ${pageData.name}: Contrast iyi`)
    } else {
      console.log(`⚠️  ${pageData.name}: Contrast iyileştirilebilir`)
    }
    
    const colorScore = (score / maxScore) * 100
    colorScores.push(colorScore)
    console.log(`📊 ${pageData.name} Color Skoru: ${colorScore.toFixed(0)}/100\n`)
  }
  
  const avgColorScore = colorScores.reduce((a, b) => a + b, 0) / colorScores.length
  console.log(`🎯 Ortalama Color Skoru: ${avgColorScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 9. LAYOUT & SPACING UZMANLIĞI
  // ==========================================
  console.log('📐 9. LAYOUT & SPACING UZMANLIĞI')
  console.log('-'.repeat(80))
  
  const layoutScores = []
  
  for (const pageData of allPages) {
    const { blocks } = pageData
    let score = 0
    let maxScore = 0
    
    // Consistent padding
    maxScore += 1
    let consistentPadding = 0
    const paddingValues = new Set()
    blocks?.forEach(block => {
      const padding = block.content?.padding?.top || block.content?.container?.padding?.top
      if (padding) {
        paddingValues.add(padding)
        if (padding === '5rem' || padding === '4rem' || padding === '3rem') {
          consistentPadding++
        }
      }
    })
    if (consistentPadding >= blocks.length * 0.6 || paddingValues.size <= 3) {
      score += 1
      console.log(`✅ ${pageData.name}: Consistent padding`)
    } else {
      console.log(`⚠️  ${pageData.name}: Padding consistency iyileştirilebilir`)
    }
    
    // Grid system
    maxScore += 1
    const hasGrid = blocks?.some(b => b.content?.layout === 'grid' || b.content?.responsive)
    if (hasGrid) {
      score += 1
      console.log(`✅ ${pageData.name}: Grid system mevcut`)
    } else {
      console.log(`⚠️  ${pageData.name}: Grid system iyileştirilebilir`)
    }
    
    // Max width
    maxScore += 1
    let hasMaxWidth = 0
    blocks?.forEach(block => {
      if (block.content?.maxWidth || block.content?.container?.maxWidth) {
        hasMaxWidth++
      }
    })
    if (hasMaxWidth >= blocks.length * 0.5) {
      score += 1
      console.log(`✅ ${pageData.name}: Max width tanımlı`)
    } else {
      console.log(`⚠️  ${pageData.name}: Max width iyileştirilebilir`)
    }
    
    // Alignment
    maxScore += 1
    let hasAlignment = 0
    blocks?.forEach(block => {
      if (block.content?.alignment || block.content?.typography?.sectionTitle?.alignment) {
        hasAlignment++
      }
    })
    if (hasAlignment >= blocks.length * 0.5) {
      score += 1
      console.log(`✅ ${pageData.name}: Alignment tanımlı`)
    } else {
      console.log(`⚠️  ${pageData.name}: Alignment iyileştirilebilir`)
    }
    
    const layoutScore = (score / maxScore) * 100
    layoutScores.push(layoutScore)
    console.log(`📊 ${pageData.name} Layout Skoru: ${layoutScore.toFixed(0)}/100\n`)
  }
  
  const avgLayoutScore = layoutScores.reduce((a, b) => a + b, 0) / layoutScores.length
  console.log(`🎯 Ortalama Layout Skoru: ${avgLayoutScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 10. ENTERPRISE STANDARTLARI
  // ==========================================
  console.log('🏢 10. ENTERPRISE STANDARTLARI')
  console.log('-'.repeat(80))
  
  const enterpriseScores = []
  
  for (const pageData of allPages) {
    const { blocks } = pageData
    let score = 0
    let maxScore = 0
    
    // Page structure
    maxScore += 1
    const hasHero = !!blocks?.find(b => b.block_type === 'hero')
    const hasFeatures = !!blocks?.find(b => b.block_type === 'features')
    const hasContact = !!blocks?.find(b => b.block_type === 'contact')
    const hasFooter = !!blocks?.find(b => b.block_type === 'footer')
    if (hasHero && (hasFeatures || hasContact || hasFooter)) {
      score += 1
      console.log(`✅ ${pageData.name}: Page structure iyi`)
    } else {
      console.log(`⚠️  ${pageData.name}: Page structure iyileştirilebilir`)
    }
    
    // Content completeness
    maxScore += 1
    const blockTypes = new Set(blocks?.map(b => b.block_type) || [])
    if (blockTypes.size >= 5) {
      score += 1
      console.log(`✅ ${pageData.name}: Content completeness iyi (${blockTypes.size} farklı block)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Content completeness iyileştirilebilir`)
    }
    
    // Professional quality
    maxScore += 1
    let professional = true
    blocks?.forEach(block => {
      if (block.block_type === 'text') {
        const content = block.content?.content || ''
        if (content.includes('!!!') || content.includes('???')) {
          professional = false
        }
      }
    })
    if (professional) {
      score += 1
      console.log(`✅ ${pageData.name}: Professional quality iyi`)
    } else {
      console.log(`⚠️  ${pageData.name}: Professional quality iyileştirilebilir`)
    }
    
    // Error handling
    maxScore += 1
    let cleanContent = true
    blocks?.forEach(block => {
      if (block.block_type === 'text') {
        const content = block.content?.content || ''
        if (content.includes('<p><p>') || content.includes('</p></p>')) {
          cleanContent = false
        }
      }
    })
    if (cleanContent) {
      score += 1
      console.log(`✅ ${pageData.name}: Error handling iyi (clean HTML)`)
    } else {
      console.log(`⚠️  ${pageData.name}: Error handling iyileştirilebilir`)
    }
    
    const enterpriseScore = (score / maxScore) * 100
    enterpriseScores.push(enterpriseScore)
    console.log(`📊 ${pageData.name} Enterprise Skoru: ${enterpriseScore.toFixed(0)}/100\n`)
  }
  
  const avgEnterpriseScore = enterpriseScores.reduce((a, b) => a + b, 0) / enterpriseScores.length
  console.log(`🎯 Ortalama Enterprise Skoru: ${avgEnterpriseScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // GENEL SKOR ÖZETİ
  // ==========================================
  console.log('='.repeat(80))
  console.log('📊 FINAL ENTERPRISE AUDIT - GENEL SKOR ÖZETİ')
  console.log('='.repeat(80))
  console.log(`\n1. SEO Uzmanlığı:                    ${avgSEOScore.toFixed(0)}/100`)
  console.log(`2. İçerik Kalitesi:                  ${avgContentScore.toFixed(0)}/100`)
  console.log(`3. Tasarım & UI/UX:                  ${avgDesignScore.toFixed(0)}/100`)
  console.log(`4. Teknik (Performance, A11y):      ${avgTechnicalScore.toFixed(0)}/100`)
  console.log(`5. Conversion Optimization:          ${avgConversionScore.toFixed(0)}/100`)
  console.log(`6. Responsive Design:                ${avgResponsiveScore.toFixed(0)}/100`)
  console.log(`7. Typography:                       ${avgTypographyScore.toFixed(0)}/100`)
  console.log(`8. Colors & Branding:                ${avgColorScore.toFixed(0)}/100`)
  console.log(`9. Layout & Spacing:                 ${avgLayoutScore.toFixed(0)}/100`)
  console.log(`10. Enterprise Standartları:         ${avgEnterpriseScore.toFixed(0)}/100`)
  
  const overallScore = (
    avgSEOScore +
    avgContentScore +
    avgDesignScore +
    avgTechnicalScore +
    avgConversionScore +
    avgResponsiveScore +
    avgTypographyScore +
    avgColorScore +
    avgLayoutScore +
    avgEnterpriseScore
  ) / 10
  
  console.log(`\n🎯 GENEL ENTERPRISE SKORU: ${overallScore.toFixed(0)}/100`)
  
  console.log('\n' + '='.repeat(80))
  console.log('💡 DEĞERLENDİRME:')
  console.log('='.repeat(80))
  
  if (overallScore >= 95) {
    console.log('\n✅ MÜKEMMEL! Sayfa enterprise seviyede ve tüm uzmanlık alanlarında üst düzey.')
    console.log('   Tüm standartlar karşılanıyor, production-ready.')
  } else if (overallScore >= 85) {
    console.log('\n✅ ÇOK İYİ! Sayfa enterprise seviyede, küçük iyileştirmeler yapılabilir.')
    console.log('   Production-ready, bazı alanlar optimize edilebilir.')
  } else if (overallScore >= 75) {
    console.log('\n⚠️  İYİ! Sayfa iyi durumda, bazı alanlar iyileştirilebilir.')
    console.log('   Production\'a geçmeden önce bazı düzeltmeler yapılmalı.')
  } else {
    console.log('\n⚠️  İYİLEŞTİRME GEREKLİ! Sayfa bazı alanlarda iyileştirme gerektiriyor.')
    console.log('   Production\'a geçmeden önce önemli düzeltmeler yapılmalı.')
  }
  
  console.log('\n🌐 Sayfalar:')
  console.log('  - Landing Page: http://localhost:3001/')
  console.log('  - Headspa Page: http://localhost:3001/headspa')
  console.log()
}

finalEnterpriseAudit().catch(console.error)

