#!/usr/bin/env node

/**
 * SEO & Landing Page Uzmanı - İçerik Analizi
 * Yazılar, Başlıklar, İçerikler, Anlam, İfadeler
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

async function analyzeContentSEO() {
  console.log('🔍 SEO & Landing Page Uzmanı - İçerik Analizi\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) return
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  // Landing Page
  const { data: landingPage } = await supabase.from('pages').select('*').eq('slug', 'home').single()
  const { data: landingBlocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', landingPage?.id)
    .order('position', { ascending: true })
  
  // Headspa Page
  const { data: headspaPage } = await supabase.from('pages').select('*').eq('slug', 'headspa').single()
  const { data: headspaBlocks } = await supabase
    .from('page_blocks')
    .select('*')
    .eq('page_id', headspaPage?.id)
    .order('position', { ascending: true })
  
  console.log('📄 Analiz Edilen Sayfalar:')
  console.log('  1. Landing Page (Home)')
  console.log('  2. Headspa Page\n')
  
  // ==========================================
  // 1. SEO - BAŞLIK YAPISI & KEYWORDS
  // ==========================================
  console.log('🔍 1. SEO - BAŞLIK YAPISI & KEYWORDS')
  console.log('-'.repeat(70))
  
  const seoAnalysis = {
    landing: {
      h1: [],
      h2: [],
      h3: [],
      keywords: [],
      metaTitle: landingPage?.meta_title || '',
      metaDescription: landingPage?.meta_description || ''
    },
    headspa: {
      h1: [],
      h2: [],
      h3: [],
      keywords: [],
      metaTitle: headspaPage?.meta_title || '',
      metaDescription: headspaPage?.meta_description || ''
    }
  }
  
  // Landing Page başlıklar
  const landingHero = landingBlocks?.find(b => b.block_type === 'hero')
  if (landingHero?.content?.title) {
    seoAnalysis.landing.h1.push(landingHero.content.title)
  }
  
  landingBlocks?.forEach(block => {
    if (block.content?.title && block.block_type !== 'hero') {
      seoAnalysis.landing.h2.push(block.content.title)
    }
    if (block.block_type === 'features' && block.content?.features) {
      block.content.features.forEach(f => {
        if (f.title) seoAnalysis.landing.h3.push(f.title)
      })
    }
  })
  
  // Headspa Page başlıklar
  const headspaHero = headspaBlocks?.find(b => b.block_type === 'hero')
  if (headspaHero?.content?.title) {
    seoAnalysis.headspa.h1.push(headspaHero.content.title)
  }
  
  headspaBlocks?.forEach(block => {
    if (block.content?.title && block.block_type !== 'hero') {
      seoAnalysis.headspa.h2.push(block.content.title)
    }
    if (block.block_type === 'features' && block.content?.features) {
      block.content.features.forEach(f => {
        if (f.title) seoAnalysis.headspa.h3.push(f.title)
      })
    }
  })
  
  // Keywords extraction
  const extractKeywords = (text) => {
    if (!text) return []
    const keywords = ['headspa', 'wellness', 'massage', 'entspannung', 'baesweiler', 'köln', 'kopfmassage', 'wellness-studio']
    const found = keywords.filter(kw => text.toLowerCase().includes(kw.toLowerCase()))
    return found
  }
  
  seoAnalysis.landing.keywords = extractKeywords(seoAnalysis.landing.metaTitle + ' ' + seoAnalysis.landing.metaDescription)
  seoAnalysis.headspa.keywords = extractKeywords(seoAnalysis.headspa.metaTitle + ' ' + seoAnalysis.headspa.metaDescription)
  
  console.log('✅ Landing Page SEO:')
  console.log('  H1 Count:', seoAnalysis.landing.h1.length, seoAnalysis.landing.h1.length === 1 ? '✅' : '❌ (1 olmalı)')
  console.log('  H1 Text:', seoAnalysis.landing.h1[0] || 'Yok')
  console.log('  H2 Count:', seoAnalysis.landing.h2.length)
  console.log('  H3 Count:', seoAnalysis.landing.h3.length)
  console.log('  Meta Title:', seoAnalysis.landing.metaTitle || '❌ Yok')
  console.log('  Meta Description:', seoAnalysis.landing.metaDescription ? '✅ Var (' + seoAnalysis.landing.metaDescription.length + ' char)' : '❌ Yok')
  console.log('  Keywords:', seoAnalysis.landing.keywords.join(', ') || 'N/A')
  
  console.log('\n✅ Headspa Page SEO:')
  console.log('  H1 Count:', seoAnalysis.headspa.h1.length, seoAnalysis.headspa.h1.length === 1 ? '✅' : '❌ (1 olmalı)')
  console.log('  H1 Text:', seoAnalysis.headspa.h1[0] || 'Yok')
  console.log('  H2 Count:', seoAnalysis.headspa.h2.length)
  console.log('  H3 Count:', seoAnalysis.headspa.h3.length)
  console.log('  Meta Title:', seoAnalysis.headspa.metaTitle || '❌ Yok')
  console.log('  Meta Description:', seoAnalysis.headspa.metaDescription ? '✅ Var (' + seoAnalysis.headspa.metaDescription.length + ' char)' : '❌ Yok')
  console.log('  Keywords:', seoAnalysis.headspa.keywords.join(', ') || 'N/A')
  
  const seoScore = (
    (seoAnalysis.landing.h1.length === 1 ? 1 : 0) +
    (seoAnalysis.headspa.h1.length === 1 ? 1 : 0) +
    (seoAnalysis.landing.metaTitle ? 1 : 0) +
    (seoAnalysis.headspa.metaTitle ? 1 : 0) +
    (seoAnalysis.landing.metaDescription ? 1 : 0) +
    (seoAnalysis.headspa.metaDescription ? 1 : 0) +
    (seoAnalysis.landing.keywords.length > 0 ? 1 : 0) +
    (seoAnalysis.headspa.keywords.length > 0 ? 1 : 0)
  ) / 8 * 100
  
  console.log(`\n📊 SEO Score: ${seoScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 2. İÇERİK KALİTESİ & ANLAM
  // ==========================================
  console.log('📝 2. İÇERİK KALİTESİ & ANLAM')
  console.log('-'.repeat(70))
  
  const contentQuality = {
    landing: {
      hero: {
        title: landingHero?.content?.title || '',
        subtitle: landingHero?.content?.subtitle || '',
        description: landingHero?.content?.description || '',
        cta: landingHero?.content?.ctaText || ''
      },
      valueProp: '',
      benefits: [],
      issues: []
    },
    headspa: {
      hero: {
        title: headspaHero?.content?.title || '',
        subtitle: headspaHero?.content?.subtitle || '',
        description: headspaHero?.content?.description || '',
        cta: headspaHero?.content?.ctaText || ''
      },
      problem: '',
      solution: '',
      features: [],
      issues: []
    }
  }
  
  // Landing Page içerik analizi
  const landingTextBlocks = landingBlocks?.filter(b => b.block_type === 'text')
  landingTextBlocks?.forEach(tb => {
    if (tb.content?.title?.toLowerCase().includes('warum') || tb.content?.title?.toLowerCase().includes('vorteil')) {
      contentQuality.landing.valueProp = tb.content.content || tb.content.description || ''
    }
  })
  
  const landingFeatures = landingBlocks?.filter(b => b.block_type === 'features')
  landingFeatures?.forEach(fb => {
    if (fb.content?.features) {
      fb.content.features.forEach(f => {
        if (f.title && f.description) {
          contentQuality.landing.benefits.push({
            title: f.title,
            description: f.description
          })
        }
      })
    }
  })
  
  // Headspa Page içerik analizi
  const headspaTextBlocks = headspaBlocks?.filter(b => b.block_type === 'text')
  headspaTextBlocks?.forEach(tb => {
    const title = tb.content?.title?.toLowerCase() || ''
    if (title.includes('gedanken') || title.includes('gestresst') || title.includes('problem')) {
      contentQuality.headspa.problem = tb.content.content || tb.content.description || ''
    }
    if (title.includes('entspannung') || title.includes('lösung') || title.includes('solution')) {
      contentQuality.headspa.solution = tb.content.content || tb.content.description || ''
    }
  })
  
  const headspaFeatures = headspaBlocks?.filter(b => b.block_type === 'features')
  headspaFeatures?.forEach(fb => {
    if (fb.content?.features) {
      fb.content.features.forEach(f => {
        if (f.title && f.description) {
          contentQuality.headspa.features.push({
            title: f.title,
            description: f.description
          })
        }
      })
    }
  })
  
  // İçerik kalitesi kontrolü
  const checkContentQuality = (content) => {
    const issues = []
    
    // Boş içerik
    if (!content || content.trim().length === 0) {
      issues.push('Boş içerik')
    }
    
    // Çok kısa içerik
    if (content && content.length < 50) {
      issues.push('İçerik çok kısa (< 50 karakter)')
    }
    
    // Çok uzun içerik
    if (content && content.length > 500) {
      issues.push('İçerik çok uzun (> 500 karakter)')
    }
    
    // Türkçe karakter kontrolü (Almanca olmalı)
    const turkishChars = ['ç', 'ğ', 'ı', 'ö', 'ş', 'ü', 'Ç', 'Ğ', 'İ', 'Ö', 'Ş', 'Ü']
    if (content && turkishChars.some(char => content.includes(char))) {
      issues.push('Türkçe karakter tespit edildi (Almanca olmalı)')
    }
    
    // Profesyonellik kontrolü
    const unprofessional = ['slang', '!!!', '???']
    if (content && unprofessional.some(term => content.toLowerCase().includes(term))) {
      issues.push('Profesyonel olmayan ifade')
    }
    
    return issues
  }
  
  // Landing Page içerik kalitesi
  console.log('✅ Landing Page İçerik:')
  console.log('  Hero Title:', contentQuality.landing.hero.title || '❌ Yok')
  console.log('  Hero Subtitle:', contentQuality.landing.hero.subtitle || '❌ Yok')
  console.log('  Hero Description:', contentQuality.landing.hero.description ? '✅ Var' : '❌ Yok')
  console.log('  Value Prop:', contentQuality.landing.valueProp ? '✅ Var' : '❌ Yok')
  console.log('  Benefits:', contentQuality.landing.benefits.length, 'adet')
  
  const landingHeroIssues = checkContentQuality(contentQuality.landing.hero.title)
  if (landingHeroIssues.length > 0) {
    contentQuality.landing.issues.push(...landingHeroIssues.map(i => 'Hero: ' + i))
  }
  
  // Headspa Page içerik kalitesi
  console.log('\n✅ Headspa Page İçerik:')
  console.log('  Hero Title:', contentQuality.headspa.hero.title || '❌ Yok')
  console.log('  Hero Subtitle:', contentQuality.headspa.hero.subtitle || '❌ Yok')
  console.log('  Hero Description:', contentQuality.headspa.hero.description ? '✅ Var' : '❌ Yok')
  console.log('  Problem:', contentQuality.headspa.problem ? '✅ Var' : '❌ Yok')
  console.log('  Solution:', contentQuality.headspa.solution ? '✅ Var' : '❌ Yok')
  console.log('  Features:', contentQuality.headspa.features.length, 'adet')
  
  const headspaHeroIssues = checkContentQuality(contentQuality.headspa.hero.title)
  if (headspaHeroIssues.length > 0) {
    contentQuality.headspa.issues.push(...headspaHeroIssues.map(i => 'Hero: ' + i))
  }
  
  if (contentQuality.landing.issues.length > 0) {
    console.log('\n⚠️  Landing Page İçerik Sorunları:')
    contentQuality.landing.issues.forEach(issue => console.log('  -', issue))
  }
  
  if (contentQuality.headspa.issues.length > 0) {
    console.log('\n⚠️  Headspa Page İçerik Sorunları:')
    contentQuality.headspa.issues.forEach(issue => console.log('  -', issue))
  }
  
  const contentQualityScore = (
    (contentQuality.landing.hero.title ? 1 : 0) +
    (contentQuality.landing.hero.subtitle ? 1 : 0) +
    (contentQuality.landing.valueProp ? 1 : 0) +
    (contentQuality.landing.benefits.length > 0 ? 1 : 0) +
    (contentQuality.headspa.hero.title ? 1 : 0) +
    (contentQuality.headspa.problem ? 1 : 0) +
    (contentQuality.headspa.solution ? 1 : 0) +
    (contentQuality.headspa.features.length > 0 ? 1 : 0) +
    (contentQuality.landing.issues.length === 0 ? 1 : 0) +
    (contentQuality.headspa.issues.length === 0 ? 1 : 0)
  ) / 10 * 100
  
  console.log(`\n📊 Content Quality Score: ${contentQualityScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 3. İFADE KALİTESİ & İKNA EDİCİLİK
  // ==========================================
  console.log('💬 3. İFADE KALİTESİ & İKNA EDİCİLİK')
  console.log('-'.repeat(70))
  
  const expressionAnalysis = {
    landing: {
      clarity: 0,
      persuasiveness: 0,
      professionalism: 0,
      urgency: 0,
      trust: 0,
      issues: []
    },
    headspa: {
      clarity: 0,
      persuasiveness: 0,
      professionalism: 0,
      urgency: 0,
      trust: 0,
      issues: []
    }
  }
  
  // Clarity kontrolü
  const checkClarity = (text) => {
    if (!text) return 0
    let score = 0
    
    // Açık ve net ifadeler
    const clearIndicators = ['professionell', 'exklusiv', 'premium', 'erfahren', 'zertifiziert']
    clearIndicators.forEach(ind => {
      if (text.toLowerCase().includes(ind)) score += 1
    })
    
    // Belirsiz ifadeler
    const unclearIndicators = ['vielleicht', 'möglicherweise', 'eventuell']
    unclearIndicators.forEach(ind => {
      if (text.toLowerCase().includes(ind)) score -= 1
    })
    
    return Math.max(0, Math.min(5, score))
  }
  
  // Persuasiveness kontrolü
  const checkPersuasiveness = (text) => {
    if (!text) return 0
    let score = 0
    
    // İkna edici kelimeler
    const persuasiveWords = ['jetzt', 'sofort', 'exklusiv', 'begrenzt', 'garantiert', 'erfahren', 'professionell']
    persuasiveWords.forEach(word => {
      if (text.toLowerCase().includes(word)) score += 1
    })
    
    // CTA ifadeleri
    if (text.toLowerCase().includes('jetzt') || text.toLowerCase().includes('buchen')) {
      score += 2
    }
    
    return Math.max(0, Math.min(5, score))
  }
  
  // Professionalism kontrolü
  const checkProfessionalism = (text) => {
    if (!text) return 0
    let score = 5
    
    // Profesyonel olmayan ifadeler
    const unprofessional = ['super', 'mega', 'geil', 'cool', '!!!', '???']
    unprofessional.forEach(term => {
      if (text.toLowerCase().includes(term)) score -= 2
    })
    
    // Resmi dil
    const formal = ['Sie', 'Ihre', 'Ihnen']
    formal.forEach(term => {
      if (text.includes(term)) score += 1
    })
    
    return Math.max(0, Math.min(5, score))
  }
  
  // Urgency kontrolü
  const checkUrgency = (text) => {
    if (!text) return 0
    const urgencyWords = ['jetzt', 'sofort', 'begrenzt', 'nur noch', 'schnell']
    return urgencyWords.filter(word => text.toLowerCase().includes(word)).length
  }
  
  // Trust kontrolü
  const checkTrust = (text) => {
    if (!text) return 0
    const trustWords = ['garantiert', 'zertifiziert', 'erfahren', 'professionell', 'bewährt', 'vertrauen']
    return trustWords.filter(word => text.toLowerCase().includes(word)).length
  }
  
  // Landing Page ifade analizi
  const landingHeroText = contentQuality.landing.hero.title + ' ' + contentQuality.landing.hero.subtitle + ' ' + contentQuality.landing.hero.description
  expressionAnalysis.landing.clarity = checkClarity(landingHeroText)
  expressionAnalysis.landing.persuasiveness = checkPersuasiveness(landingHeroText)
  expressionAnalysis.landing.professionalism = checkProfessionalism(landingHeroText)
  expressionAnalysis.landing.urgency = checkUrgency(landingHeroText)
  expressionAnalysis.landing.trust = checkTrust(landingHeroText)
  
  // Headspa Page ifade analizi
  const headspaHeroText = contentQuality.headspa.hero.title + ' ' + contentQuality.headspa.hero.subtitle + ' ' + contentQuality.headspa.hero.description
  expressionAnalysis.headspa.clarity = checkClarity(headspaHeroText)
  expressionAnalysis.headspa.persuasiveness = checkPersuasiveness(headspaHeroText)
  expressionAnalysis.headspa.professionalism = checkProfessionalism(headspaHeroText)
  expressionAnalysis.headspa.urgency = checkUrgency(headspaHeroText)
  expressionAnalysis.headspa.trust = checkTrust(headspaHeroText)
  
  console.log('✅ Landing Page İfade Kalitesi:')
  console.log('  Clarity (Açıklık):', expressionAnalysis.landing.clarity + '/5')
  console.log('  Persuasiveness (İkna):', expressionAnalysis.landing.persuasiveness + '/5')
  console.log('  Professionalism (Profesyonellik):', expressionAnalysis.landing.professionalism + '/5')
  console.log('  Urgency (Aciliyet):', expressionAnalysis.landing.urgency + '/5')
  console.log('  Trust (Güven):', expressionAnalysis.landing.trust + '/5')
  
  console.log('\n✅ Headspa Page İfade Kalitesi:')
  console.log('  Clarity (Açıklık):', expressionAnalysis.headspa.clarity + '/5')
  console.log('  Persuasiveness (İkna):', expressionAnalysis.headspa.persuasiveness + '/5')
  console.log('  Professionalism (Profesyonellik):', expressionAnalysis.headspa.professionalism + '/5')
  console.log('  Urgency (Aciliyet):', expressionAnalysis.headspa.urgency + '/5')
  console.log('  Trust (Güven):', expressionAnalysis.headspa.trust + '/5')
  
  const expressionScore = (
    (expressionAnalysis.landing.clarity + expressionAnalysis.headspa.clarity) / 2 * 20 +
    (expressionAnalysis.landing.persuasiveness + expressionAnalysis.headspa.persuasiveness) / 2 * 20 +
    (expressionAnalysis.landing.professionalism + expressionAnalysis.headspa.professionalism) / 2 * 20 +
    (expressionAnalysis.landing.urgency + expressionAnalysis.headspa.urgency) / 2 * 20 +
    (expressionAnalysis.landing.trust + expressionAnalysis.headspa.trust) / 2 * 20
  ) / 5
  
  console.log(`\n📊 Expression Score: ${expressionScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 4. LANDING PAGE BEST PRACTICES
  // ==========================================
  console.log('🎯 4. LANDING PAGE BEST PRACTICES')
  console.log('-'.repeat(70))
  
  const landingPageBestPractices = {
    valueProposition: {
      hasValueProp: !!contentQuality.landing.valueProp,
      clarity: 0,
      uniqueness: 0
    },
    cta: {
      count: 0,
      clarity: [],
      placement: []
    },
    socialProof: {
      hasTestimonials: !!landingBlocks?.find(b => b.block_type === 'testimonials'),
      hasRatings: false,
      hasNumbers: false
    },
    trust: {
      hasGuarantee: false,
      hasFAQ: !!landingBlocks?.find(b => b.block_type === 'faq'),
      hasContact: !!landingBlocks?.find(b => b.block_type === 'contact')
    }
  }
  
  // CTA analizi
  const landingCTAs = landingBlocks?.filter(b => b.block_type === 'cta')
  landingPageBestPractices.cta.count = landingCTAs?.length || 0
  landingCTAs?.forEach(cta => {
    const ctaText = cta.content?.primaryButton?.text || ''
    landingPageBestPractices.cta.clarity.push(ctaText.includes('Jetzt') || ctaText.includes('buchen') ? 'Clear' : 'Unclear')
    landingPageBestPractices.cta.placement.push(cta.position < 5 ? 'Above Fold' : 'Below Fold')
  })
  
  // Social proof
  const landingTestimonials = landingBlocks?.find(b => b.block_type === 'testimonials')
  if (landingTestimonials?.content?.testimonials) {
    landingPageBestPractices.socialProof.hasRatings = landingTestimonials.content.testimonials.some(t => t.rating)
    landingPageBestPractices.socialProof.hasNumbers = landingTestimonials.content.testimonials.length >= 3
  }
  
  // Trust
  const landingPricing = landingBlocks?.find(b => b.block_type === 'pricing')
  if (landingPricing?.content?.packages) {
    landingPageBestPractices.trust.hasGuarantee = landingPricing.content.packages.some(p => 
      p.guarantee || (p.features && p.features.some(f => {
        if (typeof f === 'string') return f.includes('Garantie')
        return false
      }))
    )
  }
  
  // Value proposition clarity
  if (contentQuality.landing.valueProp) {
    landingPageBestPractices.valueProposition.clarity = contentQuality.landing.valueProp.length > 100 ? 5 : 3
    landingPageBestPractices.valueProposition.uniqueness = contentQuality.landing.valueProp.toLowerCase().includes('exklusiv') || 
                                                           contentQuality.landing.valueProp.toLowerCase().includes('premium') ? 5 : 3
  }
  
  console.log('✅ Value Proposition:')
  console.log('  Has Value Prop:', landingPageBestPractices.valueProposition.hasValueProp ? '✅' : '❌')
  console.log('  Clarity:', landingPageBestPractices.valueProposition.clarity + '/5')
  console.log('  Uniqueness:', landingPageBestPractices.valueProposition.uniqueness + '/5')
  
  console.log('\n✅ CTAs:')
  console.log('  CTA Count:', landingPageBestPractices.cta.count)
  console.log('  Above Fold:', landingPageBestPractices.cta.placement.filter(p => p === 'Above Fold').length)
  console.log('  Clarity:', landingPageBestPractices.cta.clarity.filter(c => c === 'Clear').length + '/' + landingPageBestPractices.cta.clarity.length)
  
  console.log('\n✅ Social Proof:')
  console.log('  Testimonials:', landingPageBestPractices.socialProof.hasTestimonials ? '✅' : '❌')
  console.log('  Ratings:', landingPageBestPractices.socialProof.hasRatings ? '✅' : '❌')
  console.log('  Numbers (3+):', landingPageBestPractices.socialProof.hasNumbers ? '✅' : '❌')
  
  console.log('\n✅ Trust Elements:')
  console.log('  Guarantee:', landingPageBestPractices.trust.hasGuarantee ? '✅' : '❌')
  console.log('  FAQ:', landingPageBestPractices.trust.hasFAQ ? '✅' : '❌')
  console.log('  Contact:', landingPageBestPractices.trust.hasContact ? '✅' : '❌')
  
  const bestPracticesScore = (
    (landingPageBestPractices.valueProposition.hasValueProp ? 1 : 0) +
    (landingPageBestPractices.cta.count >= 2 ? 1 : 0) +
    (landingPageBestPractices.socialProof.hasTestimonials ? 1 : 0) +
    (landingPageBestPractices.trust.hasGuarantee ? 1 : 0) +
    (landingPageBestPractices.trust.hasFAQ ? 1 : 0) +
    (landingPageBestPractices.trust.hasContact ? 1 : 0) +
    (landingPageBestPractices.valueProposition.clarity >= 4 ? 1 : 0) +
    (landingPageBestPractices.cta.clarity.filter(c => c === 'Clear').length === landingPageBestPractices.cta.clarity.length ? 1 : 0)
  ) / 8 * 100
  
  console.log(`\n📊 Best Practices Score: ${bestPracticesScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 5. DETAYLI İÇERİK ANALİZİ
  // ==========================================
  console.log('📋 5. DETAYLI İÇERİK ANALİZİ')
  console.log('-'.repeat(70))
  
  console.log('\n📄 LANDING PAGE İÇERİKLERİ:')
  console.log('\n🔹 Hero Section:')
  console.log('  Title:', contentQuality.landing.hero.title)
  console.log('  Subtitle:', contentQuality.landing.hero.subtitle)
  console.log('  Description:', contentQuality.landing.hero.description?.substring(0, 100) + '...' || 'Yok')
  console.log('  CTA:', contentQuality.landing.hero.cta)
  
  console.log('\n🔹 Value Proposition:')
  console.log('  Text:', contentQuality.landing.valueProp?.substring(0, 150) + '...' || 'Yok')
  
  console.log('\n🔹 Benefits:')
  contentQuality.landing.benefits.slice(0, 3).forEach((b, i) => {
    console.log(`  ${i+1}. ${b.title}: ${b.description?.substring(0, 80)}...`)
  })
  
  console.log('\n📄 HEADSPA PAGE İÇERİKLERİ:')
  console.log('\n🔹 Hero Section:')
  console.log('  Title:', contentQuality.headspa.hero.title)
  console.log('  Subtitle:', contentQuality.headspa.hero.subtitle)
  console.log('  Description:', contentQuality.headspa.hero.description?.substring(0, 100) + '...' || 'Yok')
  console.log('  CTA:', contentQuality.headspa.hero.cta)
  
  console.log('\n🔹 Problem:')
  console.log('  Text:', contentQuality.headspa.problem?.substring(0, 150) + '...' || 'Yok')
  
  console.log('\n🔹 Solution:')
  console.log('  Text:', contentQuality.headspa.solution?.substring(0, 150) + '...' || 'Yok')
  
  console.log('\n🔹 Features:')
  contentQuality.headspa.features.slice(0, 3).forEach((f, i) => {
    console.log(`  ${i+1}. ${f.title}: ${f.description?.substring(0, 80)}...`)
  })
  
  // ==========================================
  // GENEL SKOR
  // ==========================================
  console.log('\n' + '='.repeat(70))
  console.log('📊 SEO & LANDING PAGE İÇERİK SKOR ÖZETİ')
  console.log('='.repeat(70))
  console.log(`\n1. SEO (Başlıklar & Keywords):  ${seoScore.toFixed(0)}/100`)
  console.log(`2. İçerik Kalitesi:               ${contentQualityScore.toFixed(0)}/100`)
  console.log(`3. İfade Kalitesi:               ${expressionScore.toFixed(0)}/100`)
  console.log(`4. Landing Page Best Practices:   ${bestPracticesScore.toFixed(0)}/100`)
  
  const overallContentScore = (
    seoScore +
    contentQualityScore +
    expressionScore +
    bestPracticesScore
  ) / 4
  
  console.log(`\n🎯 GENEL İÇERİK SKORU: ${overallContentScore.toFixed(0)}/100`)
  
  console.log('\n' + '='.repeat(70))
  console.log('💡 İYİLEŞTİRME ÖNERİLERİ:')
  console.log('='.repeat(70))
  
  if (seoScore < 90) {
    console.log('⚠️  SEO: Meta descriptions optimize edilebilir, keyword density artırılabilir')
  }
  if (contentQualityScore < 90) {
    console.log('⚠️  İçerik: Bazı section\'larda içerik eksik veya yetersiz')
  }
  if (expressionScore < 80) {
    console.log('⚠️  İfade: Daha ikna edici ve profesyonel ifadeler kullanılabilir')
  }
  if (bestPracticesScore < 90) {
    console.log('⚠️  Best Practices: Value proposition güçlendirilebilir, CTA\'lar optimize edilebilir')
  }
  
  if (overallContentScore >= 90) {
    console.log('\n✅ İçerikler enterprise seviyede!')
    console.log('   Tüm yazılar, başlıklar, içerikler ve ifadeler optimize.')
  } else if (overallContentScore >= 75) {
    console.log('\n✅ İçerikler iyi durumda, bazı iyileştirmeler yapılabilir.')
  } else {
    console.log('\n⚠️  İçerikler iyileştirme gerektiriyor.')
  }
  
  console.log()
}

analyzeContentSEO().catch(console.error)

