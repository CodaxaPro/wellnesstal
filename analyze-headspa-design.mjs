#!/usr/bin/env node

/**
 * Headspa Sayfası - Grafik & Web Tasarımı Analizi
 * Kurumsal Tasarım Uzmanı Perspektifi
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

async function analyzeDesign() {
  console.log('🎨 Headspa Sayfası - Grafik & Web Tasarımı Analizi\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  const { data: page } = await supabase.from('pages').select('*').eq('slug', 'headspa').single()
  const { data: blocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', page.id)
    .order('position', { ascending: true })
  
  console.log('📄 Sayfa: Headspa\n')
  
  // ==========================================
  // 1. RENK PALETİ ANALİZİ
  // ==========================================
  console.log('🎨 1. RENK PALETİ & BRANDING')
  console.log('-'.repeat(70))
  
  const colorAnalysis = {
    primary: {
      sage: '#9CAF88',
      forest: '#637554',
      charcoal: '#2C2C2C',
      cream: '#F7F5F3'
    },
    usage: {
      hero: null,
      cta: null,
      background: null,
      text: null
    },
    consistency: {
      primaryUsed: false,
      secondaryUsed: false,
      accentUsed: false
    }
  }
  
  // Hero block renk analizi
  const heroBlock = blocks?.find(b => b.block_type === 'hero')
  if (heroBlock) {
    const bgType = heroBlock.content?.backgroundType
    const gradientFrom = heroBlock.content?.gradientFrom
    const gradientTo = heroBlock.content?.gradientTo
    
    colorAnalysis.usage.hero = {
      type: bgType,
      gradientFrom: gradientFrom,
      gradientTo: gradientTo
    }
    
    if (gradientFrom === '#9CAF88' || gradientTo === '#9CAF88') {
      colorAnalysis.consistency.primaryUsed = true
    }
    if (gradientFrom === '#637554' || gradientTo === '#637554') {
      colorAnalysis.consistency.secondaryUsed = true
    }
  }
  
  // CTA block renk analizi
  const ctaBlocks = blocks?.filter(b => b.block_type === 'cta')
  ctaBlocks?.forEach(cta => {
    const bgColor = cta.content?.primaryButton?.backgroundColor
    if (bgColor === '#9CAF88') {
      colorAnalysis.consistency.primaryUsed = true
    }
  })
  
  console.log('✅ Brand Colors:')
  console.log('  Primary (Sage):', colorAnalysis.primary.sage)
  console.log('  Secondary (Forest):', colorAnalysis.primary.forest)
  console.log('  Accent (Charcoal):', colorAnalysis.primary.charcoal)
  console.log('  Background (Cream):', colorAnalysis.primary.cream)
  
  console.log('\n✅ Color Usage:')
  console.log('  Hero Background:', colorAnalysis.usage.hero?.type || 'N/A')
  if (colorAnalysis.usage.hero?.gradientFrom) {
    console.log('    Gradient From:', colorAnalysis.usage.hero.gradientFrom)
    console.log('    Gradient To:', colorAnalysis.usage.hero.gradientTo)
  }
  
  console.log('\n✅ Color Consistency:')
  console.log('  Primary Used:', colorAnalysis.consistency.primaryUsed ? '✅' : '❌')
  console.log('  Secondary Used:', colorAnalysis.consistency.secondaryUsed ? '✅' : '❌')
  
  const colorScore = (
    (colorAnalysis.consistency.primaryUsed ? 1 : 0) +
    (colorAnalysis.consistency.secondaryUsed ? 1 : 0) +
    (colorAnalysis.usage.hero ? 1 : 0)
  ) / 3 * 100
  
  console.log(`\n📊 Color Score: ${colorScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 2. TİPOGRAFİ ANALİZİ
  // ==========================================
  console.log('📝 2. TİPOGRAFİ & TYPOGRAPHY')
  console.log('-'.repeat(70))
  
  const typographyAnalysis = {
    hierarchy: {
      hasH1: !!heroBlock?.content?.title,
      hasH2: blocks?.some(b => b.content?.title && b.block_type !== 'hero'),
      hasH3: false,
      hasSubtitle: !!heroBlock?.content?.subtitle
    },
    sizing: {
      heroTitle: heroBlock?.content?.styles?.title?.fontSize || 'N/A',
      heroSubtitle: heroBlock?.content?.styles?.subtitle?.fontSize || 'N/A',
      responsive: heroBlock?.content?.styles?.title?.fontSize?.includes('clamp') || false
    },
    weights: {
      bold: false,
      semibold: false,
      regular: false
    }
  }
  
  // Typography weights kontrolü
  if (heroBlock?.content?.styles?.title?.fontWeight) {
    const weight = heroBlock.content.styles.title.fontWeight
    if (weight >= 700) typographyAnalysis.weights.bold = true
    if (weight >= 600) typographyAnalysis.weights.semibold = true
  }
  
  console.log('✅ Typography Hierarchy:')
  console.log('  H1 (Hero Title):', typographyAnalysis.hierarchy.hasH1 ? '✅ Var' : '❌ Yok')
  console.log('  H2 (Section Titles):', typographyAnalysis.hierarchy.hasH2 ? '✅ Var' : '❌ Yok')
  console.log('  Subtitle:', typographyAnalysis.hierarchy.hasSubtitle ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Font Sizing:')
  console.log('  Hero Title:', typographyAnalysis.sizing.heroTitle)
  console.log('  Hero Subtitle:', typographyAnalysis.sizing.heroSubtitle)
  console.log('  Responsive (clamp):', typographyAnalysis.sizing.responsive ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Font Weights:')
  console.log('  Bold (700+):', typographyAnalysis.weights.bold ? '✅ Var' : '❌ Yok')
  console.log('  Semibold (600):', typographyAnalysis.weights.semibold ? '✅ Var' : '❌ Yok')
  
  const typographyScore = (
    (typographyAnalysis.hierarchy.hasH1 ? 1 : 0) +
    (typographyAnalysis.hierarchy.hasH2 ? 1 : 0) +
    (typographyAnalysis.hierarchy.hasSubtitle ? 1 : 0) +
    (typographyAnalysis.sizing.responsive ? 1 : 0) +
    (typographyAnalysis.weights.bold ? 1 : 0)
  ) / 5 * 100
  
  console.log(`\n📊 Typography Score: ${typographyScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 3. LAYOUT & SPACING
  // ==========================================
  console.log('📐 3. LAYOUT & SPACING')
  console.log('-'.repeat(70))
  
  const layoutAnalysis = {
    spacing: {
      hasPadding: false,
      hasMargin: false,
      consistentSpacing: false
    },
    grid: {
      hasGrid: false,
      responsive: false,
      columns: []
    },
    alignment: {
      centered: false,
      leftAligned: false,
      mixed: false
    }
  }
  
  // Features block grid analizi
  const featuresBlocks = blocks?.filter(b => b.block_type === 'features')
  featuresBlocks?.forEach(fb => {
    if (fb.content?.layout === 'grid') {
      layoutAnalysis.grid.hasGrid = true
      if (fb.content?.responsive) {
        layoutAnalysis.grid.responsive = true
        layoutAnalysis.grid.columns.push({
          desktop: fb.content.responsive.desktop,
          tablet: fb.content.responsive.tablet,
          mobile: fb.content.responsive.mobile
        })
      }
    }
  })
  
  // Padding kontrolü
  blocks?.forEach(block => {
    if (block.content?.padding) {
      layoutAnalysis.spacing.hasPadding = true
    }
    if (block.content?.margin) {
      layoutAnalysis.spacing.hasMargin = true
    }
  })
  
  // Alignment kontrolü
  const textBlocks = blocks?.filter(b => b.block_type === 'text')
  const centeredBlocks = textBlocks?.filter(b => b.content?.alignment === 'center')
  if (centeredBlocks?.length > 0) {
    layoutAnalysis.alignment.centered = true
  }
  
  console.log('✅ Spacing:')
  console.log('  Padding:', layoutAnalysis.spacing.hasPadding ? '✅ Var' : '❌ Yok')
  console.log('  Margin:', layoutAnalysis.spacing.hasMargin ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Grid System:')
  console.log('  Grid Layout:', layoutAnalysis.grid.hasGrid ? '✅ Var' : '❌ Yok')
  console.log('  Responsive:', layoutAnalysis.grid.responsive ? '✅ Var' : '❌ Yok')
  if (layoutAnalysis.grid.columns.length > 0) {
    console.log('  Columns:', layoutAnalysis.grid.columns.map(c => `${c.desktop}/${c.tablet}/${c.mobile}`).join(', '))
  }
  
  console.log('\n✅ Alignment:')
  console.log('  Centered:', layoutAnalysis.alignment.centered ? '✅ Var' : '❌ Yok')
  
  const layoutScore = (
    (layoutAnalysis.spacing.hasPadding ? 1 : 0) +
    (layoutAnalysis.grid.hasGrid ? 1 : 0) +
    (layoutAnalysis.grid.responsive ? 1 : 0) +
    (layoutAnalysis.alignment.centered ? 1 : 0)
  ) / 4 * 100
  
  console.log(`\n📊 Layout Score: ${layoutScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 4. VISUAL HIERARCHY
  // ==========================================
  console.log('👁️  4. VISUAL HIERARCHY')
  console.log('-'.repeat(70))
  
  const hierarchyAnalysis = {
    hero: {
      hasTitle: !!heroBlock?.content?.title,
      hasSubtitle: !!heroBlock?.content?.subtitle,
      hasCTA: !!heroBlock?.content?.ctaText,
      hasImage: !!heroBlock?.content?.image?.url
    },
    sections: {
      hasSectionTitles: blocks?.filter(b => b.content?.title && b.block_type !== 'hero').length > 0,
      sectionCount: blocks?.filter(b => b.content?.title && b.block_type !== 'hero').length || 0,
      hasDividers: false
    },
    visual: {
      hasImages: blocks?.some(b => b.block_type === 'gallery' || b.content?.image?.url),
      hasIcons: blocks?.some(b => b.block_type === 'features'),
      hasGraphics: blocks?.some(b => b.block_type === 'gallery')
    }
  }
  
  console.log('✅ Hero Section:')
  console.log('  Title:', hierarchyAnalysis.hero.hasTitle ? '✅ Var' : '❌ Yok')
  console.log('  Subtitle:', hierarchyAnalysis.hero.hasSubtitle ? '✅ Var' : '❌ Yok')
  console.log('  CTA:', hierarchyAnalysis.hero.hasCTA ? '✅ Var' : '❌ Yok')
  console.log('  Image:', hierarchyAnalysis.hero.hasImage ? '✅ Var' : '⚠️  Eklenebilir')
  
  console.log('\n✅ Section Structure:')
  console.log('  Section Titles:', hierarchyAnalysis.sections.hasSectionTitles ? '✅ Var' : '❌ Yok')
  console.log('  Section Count:', hierarchyAnalysis.sections.sectionCount)
  
  console.log('\n✅ Visual Elements:')
  console.log('  Images:', hierarchyAnalysis.visual.hasImages ? '✅ Var' : '⚠️  Eklenebilir')
  console.log('  Icons:', hierarchyAnalysis.visual.hasIcons ? '✅ Var' : '❌ Yok')
  console.log('  Graphics:', hierarchyAnalysis.visual.hasGraphics ? '✅ Var' : '❌ Yok')
  
  const hierarchyScore = (
    (hierarchyAnalysis.hero.hasTitle ? 1 : 0) +
    (hierarchyAnalysis.hero.hasSubtitle ? 1 : 0) +
    (hierarchyAnalysis.hero.hasCTA ? 1 : 0) +
    (hierarchyAnalysis.sections.hasSectionTitles ? 1 : 0) +
    (hierarchyAnalysis.visual.hasImages ? 1 : 0) +
    (hierarchyAnalysis.visual.hasIcons ? 1 : 0)
  ) / 6 * 100
  
  console.log(`\n📊 Hierarchy Score: ${hierarchyScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 5. UI COMPONENTS & BUTTONS
  // ==========================================
  console.log('🔘 5. UI COMPONENTS & BUTTONS')
  console.log('-'.repeat(70))
  
  const uiAnalysis = {
    buttons: {
      count: 0,
      styles: [],
      sizes: [],
      hasHover: false
    },
    cards: {
      count: 0,
      hasShadow: false,
      hasBorder: false,
      hasHover: false
    },
    forms: {
      hasForm: blocks?.some(b => b.block_type === 'contact' && b.content?.showForm),
      hasInputs: false
    }
  }
  
  // CTA buttons analizi
  ctaBlocks?.forEach(cta => {
    uiAnalysis.buttons.count++
    if (cta.content?.primaryButton?.style) {
      uiAnalysis.buttons.styles.push(cta.content.primaryButton.style)
    }
    if (cta.content?.primaryButton?.size) {
      uiAnalysis.buttons.sizes.push(cta.content.primaryButton.size)
    }
    if (cta.content?.primaryButton?.hoverEffect) {
      uiAnalysis.buttons.hasHover = true
    }
  })
  
  // Hero button
  if (heroBlock?.content?.ctaText) {
    uiAnalysis.buttons.count++
  }
  
  // Pricing buttons
  const pricingBlock = blocks?.find(b => b.block_type === 'pricing')
  if (pricingBlock?.content?.packages) {
    pricingBlock.content.packages.forEach(() => {
      uiAnalysis.buttons.count++
    })
  }
  
  // Features cards analizi
  featuresBlocks?.forEach(fb => {
    if (fb.content?.features?.length > 0) {
      uiAnalysis.cards.count += fb.content.features.length
    }
    if (fb.content?.cardStyles?.shadow) {
      uiAnalysis.cards.hasShadow = true
    }
    if (fb.content?.cardStyles?.borderWidth > 0) {
      uiAnalysis.cards.hasBorder = true
    }
    if (fb.content?.cardStyles?.hoverEffect) {
      uiAnalysis.cards.hasHover = true
    }
  })
  
  console.log('✅ Buttons:')
  console.log('  Button Count:', uiAnalysis.buttons.count)
  console.log('  Styles:', [...new Set(uiAnalysis.buttons.styles)].join(', ') || 'N/A')
  console.log('  Sizes:', [...new Set(uiAnalysis.buttons.sizes)].join(', ') || 'N/A')
  console.log('  Hover Effects:', uiAnalysis.buttons.hasHover ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Cards:')
  console.log('  Card Count:', uiAnalysis.cards.count)
  console.log('  Shadow:', uiAnalysis.cards.hasShadow ? '✅ Var' : '❌ Yok')
  console.log('  Border:', uiAnalysis.cards.hasBorder ? '✅ Var' : '❌ Yok')
  console.log('  Hover Effects:', uiAnalysis.cards.hasHover ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Forms:')
  console.log('  Contact Form:', uiAnalysis.forms.hasForm ? '✅ Var' : '❌ Yok')
  
  const uiScore = (
    (uiAnalysis.buttons.count > 0 ? 1 : 0) +
    (uiAnalysis.buttons.hasHover ? 1 : 0) +
    (uiAnalysis.cards.count > 0 ? 1 : 0) +
    (uiAnalysis.cards.hasShadow ? 1 : 0) +
    (uiAnalysis.cards.hasHover ? 1 : 0)
  ) / 5 * 100
  
  console.log(`\n📊 UI Components Score: ${uiScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 6. RESPONSIVE DESIGN
  // ==========================================
  console.log('📱 6. RESPONSIVE DESIGN')
  console.log('-'.repeat(70))
  
  const responsiveAnalysis = {
    typography: {
      responsive: typographyAnalysis.sizing.responsive,
      clampUsed: false
    },
    layout: {
      grid: layoutAnalysis.grid.responsive,
      breakpoints: []
    },
    images: {
      responsive: false,
      lazyLoad: false
    }
  }
  
  // Clamp kontrolü
  if (heroBlock?.content?.styles?.title?.fontSize?.includes('clamp')) {
    responsiveAnalysis.typography.clampUsed = true
  }
  
  // Breakpoints kontrolü
  featuresBlocks?.forEach(fb => {
    if (fb.content?.responsive) {
      responsiveAnalysis.layout.breakpoints.push({
        desktop: fb.content.responsive.desktop,
        tablet: fb.content.responsive.tablet,
        mobile: fb.content.responsive.mobile
      })
    }
  })
  
  console.log('✅ Typography:')
  console.log('  Responsive:', responsiveAnalysis.typography.responsive ? '✅ Var' : '❌ Yok')
  console.log('  Clamp Used:', responsiveAnalysis.typography.clampUsed ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Layout:')
  console.log('  Responsive Grid:', responsiveAnalysis.layout.grid ? '✅ Var' : '❌ Yok')
  if (responsiveAnalysis.layout.breakpoints.length > 0) {
    console.log('  Breakpoints:', responsiveAnalysis.layout.breakpoints.length, 'blocks')
  }
  
  console.log('\n✅ Images:')
  console.log('  Responsive:', responsiveAnalysis.images.responsive ? '✅ Var' : '⚠️  İyileştirilebilir')
  console.log('  Lazy Load:', responsiveAnalysis.images.lazyLoad ? '✅ Var' : '⚠️  İyileştirilebilir')
  
  const responsiveScore = (
    (responsiveAnalysis.typography.responsive ? 1 : 0) +
    (responsiveAnalysis.layout.grid ? 1 : 0) +
    (responsiveAnalysis.layout.breakpoints.length > 0 ? 1 : 0)
  ) / 3 * 100
  
  console.log(`\n📊 Responsive Score: ${responsiveScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 7. ANIMATIONS & INTERACTIONS
  // ==========================================
  console.log('✨ 7. ANIMATIONS & INTERACTIONS')
  console.log('-'.repeat(70))
  
  const animationAnalysis = {
    scroll: {
      hasScrollAnimations: false,
      triggerOnScroll: false
    },
    hover: {
      hasHover: uiAnalysis.buttons.hasHover || uiAnalysis.cards.hasHover,
      buttonHover: uiAnalysis.buttons.hasHover,
      cardHover: uiAnalysis.cards.hasHover
    },
    transitions: {
      hasTransitions: false
    }
  }
  
  // Scroll animations kontrolü
  blocks?.forEach(block => {
    if (block.content?.animations?.enabled) {
      animationAnalysis.scroll.hasScrollAnimations = true
      if (block.content.animations.triggerOnScroll) {
        animationAnalysis.scroll.triggerOnScroll = true
      }
    }
  })
  
  console.log('✅ Scroll Animations:')
  console.log('  Enabled:', animationAnalysis.scroll.hasScrollAnimations ? '✅ Var' : '❌ Yok')
  console.log('  Trigger on Scroll:', animationAnalysis.scroll.triggerOnScroll ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Hover Effects:')
  console.log('  Buttons:', animationAnalysis.hover.buttonHover ? '✅ Var' : '❌ Yok')
  console.log('  Cards:', animationAnalysis.hover.cardHover ? '✅ Var' : '❌ Yok')
  
  const animationScore = (
    (animationAnalysis.scroll.hasScrollAnimations ? 1 : 0) +
    (animationAnalysis.hover.hasHover ? 1 : 0) +
    (animationAnalysis.scroll.triggerOnScroll ? 1 : 0)
  ) / 3 * 100
  
  console.log(`\n📊 Animation Score: ${animationScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // GENEL SKOR
  // ==========================================
  console.log('='.repeat(70))
  console.log('📊 GRAFİK & WEB TASARIMI SKOR ÖZETİ')
  console.log('='.repeat(70))
  console.log(`\n1. Renk Paleti & Branding:     ${colorScore.toFixed(0)}/100`)
  console.log(`2. Tipografi:                   ${typographyScore.toFixed(0)}/100`)
  console.log(`3. Layout & Spacing:            ${layoutScore.toFixed(0)}/100`)
  console.log(`4. Visual Hierarchy:            ${hierarchyScore.toFixed(0)}/100`)
  console.log(`5. UI Components & Buttons:      ${uiScore.toFixed(0)}/100`)
  console.log(`6. Responsive Design:           ${responsiveScore.toFixed(0)}/100`)
  console.log(`7. Animations & Interactions:   ${animationScore.toFixed(0)}/100`)
  
  const overallDesignScore = (
    colorScore +
    typographyScore +
    layoutScore +
    hierarchyScore +
    uiScore +
    responsiveScore +
    animationScore
  ) / 7
  
  console.log(`\n🎯 GENEL TASARIM SKORU: ${overallDesignScore.toFixed(0)}/100`)
  
  console.log('\n' + '='.repeat(70))
  console.log('💡 TASARIM ÖNERİLERİ:')
  console.log('='.repeat(70))
  
  if (colorScore < 80) {
    console.log('⚠️  Renk Paleti: Brand colors daha tutarlı kullanılabilir')
  }
  if (typographyScore < 80) {
    console.log('⚠️  Tipografi: Font hierarchy ve responsive sizing iyileştirilebilir')
  }
  if (layoutScore < 80) {
    console.log('⚠️  Layout: Spacing ve grid system daha tutarlı olabilir')
  }
  if (hierarchyScore < 80) {
    console.log('⚠️  Visual Hierarchy: Hero image ve görsel elementler eklenebilir')
  }
  if (uiScore < 80) {
    console.log('⚠️  UI Components: Button styles ve card designs standardize edilebilir')
  }
  if (responsiveScore < 80) {
    console.log('⚠️  Responsive: Mobile-first approach ve breakpoints optimize edilebilir')
  }
  if (animationScore < 80) {
    console.log('⚠️  Animations: Scroll animations ve micro-interactions eklenebilir')
  }
  
  if (overallDesignScore >= 90) {
    console.log('\n✅ Sayfa tasarım açısından enterprise seviyede!')
  } else if (overallDesignScore >= 75) {
    console.log('\n✅ Sayfa tasarım açısından iyi durumda, bazı iyileştirmeler yapılabilir.')
  } else {
    console.log('\n⚠️  Sayfa tasarım açısından iyileştirme gerektiriyor.')
  }
  
  console.log()
}

analyzeDesign().catch(console.error)

