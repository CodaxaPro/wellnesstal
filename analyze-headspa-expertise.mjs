#!/usr/bin/env node

/**
 * Headspa Sayfası - Uzmanlık Dalı Analizi
 * Webmaster, Marketing, UX/UI, SEO, Conversion Optimization
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

async function analyzeHeadspaPage() {
  console.log('🔍 Headspa Sayfası - Uzmanlık Dalı Analizi\n')
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
  // 1. WEBMASTER / TECHNICAL EXPERTISE
  // ==========================================
  console.log('🔧 1. WEBMASTER / TECHNICAL EXPERTISE')
  console.log('-'.repeat(70))
  
  const technicalChecks = {
    seo: {
      metaTitle: !!page.meta_title,
      metaDescription: !!page.meta_description,
      metaKeywords: !!page.meta_keywords,
      ogImage: !!page.og_image,
      canonicalUrl: !!page.canonical_url
    },
    structure: {
      totalBlocks: blocks?.length || 0,
      visibleBlocks: blocks?.filter(b => b.visible).length || 0,
      blockOrder: blocks?.every((b, i) => b.position === i) || false
    },
    performance: {
      hasHero: blocks?.some(b => b.block_type === 'hero'),
      hasSEO: blocks?.some(b => b.block_type === 'seo'),
      hasFooter: blocks?.some(b => b.block_type === 'footer')
    }
  }
  
  console.log('✅ SEO:')
  console.log('  Meta Title:', technicalChecks.seo.metaTitle ? '✅ Var' : '❌ Yok')
  console.log('  Meta Description:', technicalChecks.seo.metaDescription ? '✅ Var' : '❌ Yok')
  console.log('  Meta Keywords:', technicalChecks.seo.metaKeywords ? '✅ Var' : '❌ Yok')
  console.log('  OG Image:', technicalChecks.seo.ogImage ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Structure:')
  console.log('  Total Blocks:', technicalChecks.structure.totalBlocks)
  console.log('  Visible Blocks:', technicalChecks.structure.visibleBlocks)
  console.log('  Block Order:', technicalChecks.structure.blockOrder ? '✅ Doğru' : '❌ Hatalı')
  
  console.log('\n✅ Performance:')
  console.log('  Hero Block:', technicalChecks.performance.hasHero ? '✅ Var' : '❌ Yok')
  console.log('  SEO Block:', technicalChecks.performance.hasSEO ? '✅ Var' : '❌ Yok')
  console.log('  Footer Block:', technicalChecks.performance.hasFooter ? '✅ Var' : '❌ Yok')
  
  const technicalScore = (
    (technicalChecks.seo.metaTitle ? 1 : 0) +
    (technicalChecks.seo.metaDescription ? 1 : 0) +
    (technicalChecks.structure.blockOrder ? 1 : 0) +
    (technicalChecks.performance.hasHero ? 1 : 0) +
    (technicalChecks.performance.hasSEO ? 1 : 0) +
    (technicalChecks.performance.hasFooter ? 1 : 0)
  ) / 6 * 100
  
  console.log(`\n📊 Technical Score: ${technicalScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 2. MARKETING EXPERTISE
  // ==========================================
  console.log('📢 2. MARKETING EXPERTISE')
  console.log('-'.repeat(70))
  
  const heroBlock = blocks?.find(b => b.block_type === 'hero')
  const ctaBlocks = blocks?.filter(b => b.block_type === 'cta')
  const pricingBlock = blocks?.find(b => b.block_type === 'pricing')
  const testimonialsBlock = blocks?.find(b => b.block_type === 'testimonials')
  const faqBlock = blocks?.find(b => b.block_type === 'faq')
  
  const marketingChecks = {
    hero: {
      hasTitle: !!heroBlock?.content?.title,
      hasSubtitle: !!heroBlock?.content?.subtitle,
      hasCTA: !!heroBlock?.content?.ctaText,
      hasSocialProof: !!heroBlock?.content?.badge
    },
    ctas: {
      count: ctaBlocks?.length || 0,
      aboveFold: blocks?.findIndex(b => b.block_type === 'cta') < 5,
      multiple: (ctaBlocks?.length || 0) > 1
    },
    pricing: {
      hasPricing: !!pricingBlock,
      hasPackages: (pricingBlock?.content?.packages?.length || 0) > 0,
      hasGuarantee: pricingBlock?.content?.packages?.some(p => p.guarantee)
    },
    socialProof: {
      hasTestimonials: !!testimonialsBlock,
      testimonialCount: testimonialsBlock?.content?.testimonials?.length || 0,
      hasRatings: testimonialsBlock?.content?.testimonials?.some(t => t.rating)
    },
    trust: {
      hasFAQ: !!faqBlock,
      faqCount: faqBlock?.content?.faqs?.length || 0,
      hasGuarantee: pricingBlock?.content?.packages?.some(p => p.guarantee)
    }
  }
  
  console.log('✅ Hero Section:')
  console.log('  Title:', marketingChecks.hero.hasTitle ? '✅ Var' : '❌ Yok')
  console.log('  Subtitle:', marketingChecks.hero.hasSubtitle ? '✅ Var' : '❌ Yok')
  console.log('  CTA:', marketingChecks.hero.hasCTA ? '✅ Var' : '❌ Yok')
  console.log('  Social Proof:', marketingChecks.hero.hasSocialProof ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ CTAs:')
  console.log('  CTA Count:', marketingChecks.ctas.count)
  console.log('  Above Fold:', marketingChecks.ctas.aboveFold ? '✅ Var' : '❌ Yok')
  console.log('  Multiple CTAs:', marketingChecks.ctas.multiple ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Pricing:')
  console.log('  Pricing Block:', marketingChecks.pricing.hasPricing ? '✅ Var' : '❌ Yok')
  console.log('  Packages:', marketingChecks.pricing.hasPackages ? '✅ Var' : '❌ Yok')
  console.log('  Guarantee:', marketingChecks.pricing.hasGuarantee ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Social Proof:')
  console.log('  Testimonials:', marketingChecks.socialProof.hasTestimonials ? '✅ Var' : '❌ Yok')
  console.log('  Testimonial Count:', marketingChecks.socialProof.testimonialCount)
  console.log('  Ratings:', marketingChecks.socialProof.hasRatings ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Trust Elements:')
  console.log('  FAQ:', marketingChecks.trust.hasFAQ ? '✅ Var' : '❌ Yok')
  console.log('  FAQ Count:', marketingChecks.trust.faqCount)
  console.log('  Guarantee:', marketingChecks.trust.hasGuarantee ? '✅ Var' : '❌ Yok')
  
  const marketingScore = (
    (marketingChecks.hero.hasTitle ? 1 : 0) +
    (marketingChecks.hero.hasCTA ? 1 : 0) +
    (marketingChecks.ctas.count > 0 ? 1 : 0) +
    (marketingChecks.pricing.hasPricing ? 1 : 0) +
    (marketingChecks.socialProof.hasTestimonials ? 1 : 0) +
    (marketingChecks.trust.hasFAQ ? 1 : 0)
  ) / 6 * 100
  
  console.log(`\n📊 Marketing Score: ${marketingScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 3. UX/UI EXPERTISE
  // ==========================================
  console.log('🎨 3. UX/UI EXPERTISE')
  console.log('-'.repeat(70))
  
  const featuresBlock = blocks?.find(b => b.block_type === 'features')
  const galleryBlock = blocks?.find(b => b.block_type === 'gallery')
  const textBlocks = blocks?.filter(b => b.block_type === 'text')
  
  const uxChecks = {
    hierarchy: {
      hasHero: !!heroBlock,
      hasContent: textBlocks?.length > 0,
      hasVisual: !!galleryBlock,
      hasFeatures: !!featuresBlock
    },
    navigation: {
      hasCTAs: ctaBlocks?.length > 0,
      hasBooking: blocks?.some(b => b.block_type === 'embed' && b.content?.sectionId === 'booking'),
      hasContact: blocks?.some(b => b.block_type === 'contact')
    },
    content: {
      hasProblem: textBlocks?.some(b => b.content?.title?.includes('Problem') || b.content?.title?.includes('Gedanken')),
      hasSolution: textBlocks?.some(b => b.content?.title?.includes('Solution') || b.content?.title?.includes('Entspannung')),
      hasFeatures: !!featuresBlock
    },
    visual: {
      hasGallery: !!galleryBlock,
      hasImages: galleryBlock?.content?.images?.length > 0,
      hasHeroImage: !!heroBlock?.content?.image?.url
    }
  }
  
  console.log('✅ Information Hierarchy:')
  console.log('  Hero:', uxChecks.hierarchy.hasHero ? '✅ Var' : '❌ Yok')
  console.log('  Content:', uxChecks.hierarchy.hasContent ? '✅ Var' : '❌ Yok')
  console.log('  Visual:', uxChecks.hierarchy.hasVisual ? '✅ Var' : '❌ Yok')
  console.log('  Features:', uxChecks.hierarchy.hasFeatures ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Navigation:')
  console.log('  CTAs:', uxChecks.navigation.hasCTAs ? '✅ Var' : '❌ Yok')
  console.log('  Booking:', uxChecks.navigation.hasBooking ? '✅ Var' : '❌ Yok')
  console.log('  Contact:', uxChecks.navigation.hasContact ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Content Flow:')
  console.log('  Problem:', uxChecks.content.hasProblem ? '✅ Var' : '❌ Yok')
  console.log('  Solution:', uxChecks.content.hasSolution ? '✅ Var' : '❌ Yok')
  console.log('  Features:', uxChecks.content.hasFeatures ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Visual Elements:')
  console.log('  Gallery:', uxChecks.visual.hasGallery ? '✅ Var' : '❌ Yok')
  console.log('  Images:', uxChecks.visual.hasImages ? '✅ Var' : '❌ Yok')
  console.log('  Hero Image:', uxChecks.visual.hasHeroImage ? '✅ Var' : '⚠️  Eklenebilir')
  
  const uxScore = (
    (uxChecks.hierarchy.hasHero ? 1 : 0) +
    (uxChecks.hierarchy.hasContent ? 1 : 0) +
    (uxChecks.navigation.hasCTAs ? 1 : 0) +
    (uxChecks.navigation.hasBooking ? 1 : 0) +
    (uxChecks.content.hasProblem ? 1 : 0) +
    (uxChecks.content.hasSolution ? 1 : 0)
  ) / 6 * 100
  
  console.log(`\n📊 UX/UI Score: ${uxScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 4. CONVERSION OPTIMIZATION
  // ==========================================
  console.log('💰 4. CONVERSION OPTIMIZATION')
  console.log('-'.repeat(70))
  
  const conversionChecks = {
    aboveFold: {
      hasHeroCTA: !!heroBlock?.content?.ctaText,
      hasSocialProof: !!heroBlock?.content?.badge,
      hasValueProp: textBlocks?.some(b => b.position < 3)
    },
    midPage: {
      hasPricing: !!pricingBlock,
      hasTestimonials: !!testimonialsBlock,
      hasBooking: blocks?.some(b => b.block_type === 'embed' && b.content?.sectionId === 'booking')
    },
    bottom: {
      hasFinalCTA: ctaBlocks?.some(b => b.position > 8),
      hasFAQ: !!faqBlock,
      hasContact: blocks?.some(b => b.block_type === 'contact')
    },
    trust: {
      hasGuarantee: pricingBlock?.content?.packages?.some(p => p.guarantee),
      hasTestimonials: !!testimonialsBlock,
      hasFAQ: !!faqBlock
    }
  }
  
  console.log('✅ Above Fold:')
  console.log('  Hero CTA:', conversionChecks.aboveFold.hasHeroCTA ? '✅ Var' : '❌ Yok')
  console.log('  Social Proof:', conversionChecks.aboveFold.hasSocialProof ? '✅ Var' : '❌ Yok')
  console.log('  Value Prop:', conversionChecks.aboveFold.hasValueProp ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Mid-Page:')
  console.log('  Pricing:', conversionChecks.midPage.hasPricing ? '✅ Var' : '❌ Yok')
  console.log('  Testimonials:', conversionChecks.midPage.hasTestimonials ? '✅ Var' : '❌ Yok')
  console.log('  Booking:', conversionChecks.midPage.hasBooking ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Bottom:')
  console.log('  Final CTA:', conversionChecks.bottom.hasFinalCTA ? '✅ Var' : '❌ Yok')
  console.log('  FAQ:', conversionChecks.bottom.hasFAQ ? '✅ Var' : '❌ Yok')
  console.log('  Contact:', conversionChecks.bottom.hasContact ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Trust Elements:')
  console.log('  Guarantee:', conversionChecks.trust.hasGuarantee ? '✅ Var' : '❌ Yok')
  console.log('  Testimonials:', conversionChecks.trust.hasTestimonials ? '✅ Var' : '❌ Yok')
  console.log('  FAQ:', conversionChecks.trust.hasFAQ ? '✅ Var' : '❌ Yok')
  
  const conversionScore = (
    (conversionChecks.aboveFold.hasHeroCTA ? 1 : 0) +
    (conversionChecks.midPage.hasPricing ? 1 : 0) +
    (conversionChecks.midPage.hasBooking ? 1 : 0) +
    (conversionChecks.bottom.hasFinalCTA ? 1 : 0) +
    (conversionChecks.trust.hasGuarantee ? 1 : 0) +
    (conversionChecks.trust.hasTestimonials ? 1 : 0)
  ) / 6 * 100
  
  console.log(`\n📊 Conversion Score: ${conversionScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // 5. CONTENT QUALITY
  // ==========================================
  console.log('📝 5. CONTENT QUALITY')
  console.log('-'.repeat(70))
  
  const contentChecks = {
    completeness: {
      hasHero: !!heroBlock?.content?.title,
      hasDescription: !!heroBlock?.content?.description,
      hasFeatures: featuresBlock?.content?.features?.length > 0,
      hasPricing: pricingBlock?.content?.packages?.length > 0
    },
    clarity: {
      hasProblem: textBlocks?.some(b => b.content?.title?.includes('Problem') || b.content?.title?.includes('Gedanken')),
      hasSolution: textBlocks?.some(b => b.content?.title?.includes('Solution') || b.content?.title?.includes('Entspannung')),
      hasBenefits: featuresBlock?.content?.features?.length > 0
    },
    engagement: {
      hasTestimonials: testimonialsBlock?.content?.testimonials?.length > 0,
      hasFAQ: faqBlock?.content?.faqs?.length > 0,
      hasGallery: !!galleryBlock
    }
  }
  
  console.log('✅ Completeness:')
  console.log('  Hero Title:', contentChecks.completeness.hasHero ? '✅ Var' : '❌ Yok')
  console.log('  Description:', contentChecks.completeness.hasDescription ? '✅ Var' : '❌ Yok')
  console.log('  Features:', contentChecks.completeness.hasFeatures ? '✅ Var' : '❌ Yok')
  console.log('  Pricing:', contentChecks.completeness.hasPricing ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Clarity:')
  console.log('  Problem:', contentChecks.clarity.hasProblem ? '✅ Var' : '❌ Yok')
  console.log('  Solution:', contentChecks.clarity.hasSolution ? '✅ Var' : '❌ Yok')
  console.log('  Benefits:', contentChecks.clarity.hasBenefits ? '✅ Var' : '❌ Yok')
  
  console.log('\n✅ Engagement:')
  console.log('  Testimonials:', contentChecks.engagement.hasTestimonials ? '✅ Var' : '❌ Yok')
  console.log('  FAQ:', contentChecks.engagement.hasFAQ ? '✅ Var' : '❌ Yok')
  console.log('  Gallery:', contentChecks.engagement.hasGallery ? '✅ Var' : '❌ Yok')
  
  const contentScore = (
    (contentChecks.completeness.hasHero ? 1 : 0) +
    (contentChecks.completeness.hasFeatures ? 1 : 0) +
    (contentChecks.clarity.hasProblem ? 1 : 0) +
    (contentChecks.clarity.hasSolution ? 1 : 0) +
    (contentChecks.engagement.hasTestimonials ? 1 : 0) +
    (contentChecks.engagement.hasFAQ ? 1 : 0)
  ) / 6 * 100
  
  console.log(`\n📊 Content Score: ${contentScore.toFixed(0)}/100\n`)
  
  // ==========================================
  // GENEL SKOR
  // ==========================================
  console.log('='.repeat(70))
  console.log('📊 GENEL SKOR ÖZETİ')
  console.log('='.repeat(70))
  console.log(`\n1. Technical (Webmaster):     ${technicalScore.toFixed(0)}/100`)
  console.log(`2. Marketing:                 ${marketingScore.toFixed(0)}/100`)
  console.log(`3. UX/UI:                     ${uxScore.toFixed(0)}/100`)
  console.log(`4. Conversion Optimization:  ${conversionScore.toFixed(0)}/100`)
  console.log(`5. Content Quality:           ${contentScore.toFixed(0)}/100`)
  
  const overallScore = (technicalScore + marketingScore + uxScore + conversionScore + contentScore) / 5
  
  console.log(`\n🎯 GENEL SKOR: ${overallScore.toFixed(0)}/100`)
  
  console.log('\n' + '='.repeat(70))
  console.log('💡 ÖNERİLER:')
  console.log('='.repeat(70))
  
  if (technicalScore < 80) {
    console.log('⚠️  Technical: SEO meta tags ve structured data iyileştirilebilir')
  }
  if (marketingScore < 80) {
    console.log('⚠️  Marketing: Daha fazla CTA ve urgency element eklenebilir')
  }
  if (uxScore < 80) {
    console.log('⚠️  UX/UI: Visual hierarchy ve content flow iyileştirilebilir')
  }
  if (conversionScore < 80) {
    console.log('⚠️  Conversion: Booking widget ve trust signals güçlendirilebilir')
  }
  if (contentScore < 80) {
    console.log('⚠️  Content: İçerik zenginleştirilebilir ve daha engaging hale getirilebilir')
  }
  
  if (overallScore >= 90) {
    console.log('\n✅ Sayfa enterprise seviyede! Tüm uzmanlık alanlarında başarılı.')
  } else if (overallScore >= 70) {
    console.log('\n✅ Sayfa iyi durumda, bazı iyileştirmeler yapılabilir.')
  } else {
    console.log('\n⚠️  Sayfa iyileştirme gerektiriyor.')
  }
  
  console.log()
}

analyzeHeadspaPage().catch(console.error)

