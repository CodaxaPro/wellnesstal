#!/usr/bin/env node

/**
 * Enterprise-Level Landing Page Oluşturucu
 * Dünyanın en iyi landing page standartlarında
 * Conversion-optimized, booking-integrated, marketing-focused
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

async function createEnterpriseLandingPage() {
  console.log('🚀 Enterprise-Level Landing Page Oluşturuluyor...\n')
  console.log('='.repeat(70))
  
  const envVars = loadEnvFile()
  if (!envVars) {
    console.error('❌ .env.local dosyası bulunamadı')
    return
  }
  
  const supabase = createClient(envVars['NEXT_PUBLIC_SUPABASE_URL'], envVars['SUPABASE_SERVICE_ROLE_KEY'])
  
  // Ana sayfa oluştur veya bul
  let { data: page } = await supabase.from('pages').select('id').eq('slug', 'home').single()
  
  if (!page) {
    const { data: newPage, error: insertError } = await supabase
      .from('pages')
      .insert({
        slug: 'home',
        title: 'Wellnesstal - Premium Wellness & Headspa',
        status: 'published',
        meta_title: 'Wellnesstal - Premium Wellness & Headspa in Baesweiler | Jetzt Termin buchen',
        meta_description: 'Entspannung und Wellness in Baesweiler. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden. Jetzt Termin vereinbaren!',
        template: 'default',
        published_at: new Date().toISOString()
      })
      .select('id')
      .single()
    
    if (insertError) {
      console.error('❌ Ana sayfa oluşturma hatası:', insertError.message)
      return
    }
    
    if (newPage) {
      page = newPage
      console.log('✅ Ana sayfa oluşturuldu')
    } else {
      console.error('❌ Ana sayfa oluşturulamadı')
      return
    }
  } else {
    console.log('✅ Mevcut ana sayfa bulundu')
  }
  
  // Mevcut block'ları temizle
  await supabase.from('page_blocks').delete().eq('page_id', page.id)
  console.log('🧹 Eski block\'lar temizlendi\n')
  
  let position = 0
  
  // ==========================================
  // 1. HERO BLOCK - Conversion-Optimized
  // ==========================================
  console.log('📝 1. Hero Block oluşturuluyor...')
  const heroBlock = {
    page_id: page.id,
    block_type: 'hero',
    position: position++,
    visible: true,
    content: {
      badge: '⭐ 4.8/5 Sterne | Über 500 zufriedene Kunden',
      title: 'Ihre Wellness-Oase für',
      titleHighlight: 'Körper & Seele',
      subtitle: 'Professionelle Headspa-Behandlungen in entspannter Atmosphäre',
      description: 'Erleben Sie tiefgehende Entspannung und Regeneration. Unsere exklusiven Wellness-Behandlungen bringen Körper und Geist in Einklang.',
      ctaText: 'Jetzt Termin buchen',
      ctaLink: '#booking', // Scroll to booking section
      secondaryCtaText: 'Mehr erfahren',
      secondaryCtaLink: '#services',
      image: {
        url: '', // Admin panelden eklenebilir
        alt: 'Wellnesstal Studio - Premium Wellness & Headspa'
      },
      backgroundType: 'gradient',
      gradientFrom: '#9CAF88',
      gradientTo: '#637554',
      styles: {
        badge: {
          fontFamily: 'system-ui',
          fontSize: '14px',
          fontWeight: '600',
          color: '#637554',
          backgroundColor: '#eef1ea'
        },
        title: {
          fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
          fontWeight: '700',
          color: '#2C2C2C',
          lineHeight: '1.1'
        },
        titleHighlight: {
          color: '#9CAF88'
        },
        ctaButton: {
          backgroundColor: '#9CAF88',
          textColor: '#FFFFFF',
          fontSize: '18px',
          fontWeight: '600',
          borderRadius: '12px',
          padding: '16px 32px',
          hoverEffect: 'scale'
        }
      }
    }
  }
  
  await supabase.from('page_blocks').insert(heroBlock)
  console.log('  ✅ Hero block eklendi (conversion-optimized)\n')
  
  // ==========================================
  // 2. TRUST SIGNALS BLOCK - Social Proof
  // ==========================================
  console.log('📝 2. Trust Signals Block oluşturuluyor...')
  const trustBlock = {
    page_id: page.id,
    block_type: 'features',
    position: position++,
    visible: true,
    content: {
      title: '',
      subtitle: '',
      showTitle: false,
      showSubtitle: false,
      layout: 'grid',
      columns: 4,
      features: [
        {
          id: 'trust-1',
          title: '4.8/5',
          description: 'Beste Bewertungen',
          icon: 'star',
          iconConfig: {
            type: 'preset',
            value: 'star',
            backgroundColor: '#fbbf24',
            iconColor: '#ffffff'
          }
        },
        {
          id: 'trust-2',
          title: '500+',
          description: 'Zufriedene Kunden',
          icon: 'users',
          iconConfig: {
            type: 'preset',
            value: 'users',
            backgroundColor: '#9CAF88',
            iconColor: '#ffffff'
          }
        },
        {
          id: 'trust-3',
          title: '5 Jahre',
          description: 'Erfahrung',
          icon: 'award',
          iconConfig: {
            type: 'preset',
            value: 'award',
            backgroundColor: '#637554',
            iconColor: '#ffffff'
          }
        },
        {
          id: 'trust-4',
          title: '100%',
          description: 'Zufriedenheit',
          icon: 'heart',
          iconConfig: {
            type: 'preset',
            value: 'heart',
            backgroundColor: '#ef4444',
            iconColor: '#ffffff'
          }
        }
      ],
      cardStyles: {
        backgroundColor: '#ffffff',
        borderStyle: 'none',
        borderWidth: 0,
        borderColor: 'transparent',
        borderRadius: '16px',
        shadow: 'md',
        paddingX: '1.5rem',
        paddingY: '2rem',
        contentGap: '1rem'
      },
      iconStyles: {
        showIcons: true,
        position: 'top',
        size: 'lg',
        shape: 'circle',
        backgroundColor: '#9CAF88',
        iconColor: '#ffffff',
        shadow: 'md',
        borderWidth: 0,
        borderColor: 'transparent'
      },
      typography: {
        sectionTitle: {
          fontSize: '2rem',
          fontWeight: '700',
          color: '#2C2C2C',
          alignment: 'center',
          marginBottom: '1rem'
        },
        featureTitle: {
          fontSize: '2rem',
          fontWeight: '700',
          color: '#2C2C2C',
          lineHeight: '1.2'
        },
        featureDescription: {
          fontSize: '1rem',
          fontWeight: '400',
          color: '#666666',
          lineHeight: '1.5'
        }
      },
      background: {
        type: 'solid',
        color: '#f7f5f3'
      },
      padding: {
        top: '3rem',
        bottom: '3rem',
        left: '2rem',
        right: '2rem'
      },
      maxWidth: 'xl',
      animations: {
        enabled: true,
        type: 'fade',
        stagger: true,
        staggerDelay: 100,
        duration: 600,
        triggerOnScroll: true
      },
      responsive: {
        desktop: 4,
        tablet: 2,
        mobile: 1,
        desktopGap: '2rem',
        tabletGap: '1.5rem',
        mobileGap: '1rem'
      },
      showIcons: true,
      showDescriptions: true,
      showLinks: false
    }
  }
  
  await supabase.from('page_blocks').insert(trustBlock)
  console.log('  ✅ Trust signals block eklendi\n')
  
  // ==========================================
  // 3. VALUE PROPOSITION BLOCK
  // ==========================================
  console.log('📝 3. Value Proposition Block oluşturuluyor...')
  const valuePropBlock = {
    page_id: page.id,
    block_type: 'text',
    position: position++,
    visible: true,
    content: {
      title: 'Warum Wellnesstal?',
      subtitle: 'Ihre Vorteile auf einen Blick',
      content: '<p>Bei Wellnesstal erwartet Sie mehr als nur eine Behandlung – wir bieten Ihnen ein ganzheitliches Wellness-Erlebnis, das Körper und Seele in Einklang bringt.</p>',
      alignment: 'center',
      maxWidth: 'xl',
      background: {
        type: 'solid',
        color: '#ffffff'
      },
      padding: {
        top: '4rem',
        bottom: '4rem'
      },
      stylePreset: 'default'
    }
  }
  
  await supabase.from('page_blocks').insert(valuePropBlock)
  console.log('  ✅ Value proposition block eklendi\n')
  
  // ==========================================
  // 4. BENEFITS/FEATURES BLOCK
  // ==========================================
  console.log('📝 4. Benefits Block oluşturuluyor...')
  const benefitsBlock = {
    page_id: page.id,
    block_type: 'features',
    position: position++,
    visible: true,
    content: {
      title: 'Was macht uns besonders?',
      subtitle: 'Ihre Vorteile bei Wellnesstal',
      showTitle: true,
      showSubtitle: true,
      layout: 'grid',
      columns: 3,
      features: [
        {
          id: 'benefit-1',
          title: 'Professionelle Expertise',
          description: 'Über 5 Jahre Erfahrung in der Wellness-Branche. Unsere Therapeuten sind zertifiziert und spezialisiert.',
          icon: 'award',
          iconConfig: {
            type: 'preset',
            value: 'award',
            backgroundColor: '#9CAF88',
            iconColor: '#ffffff'
          }
        },
        {
          id: 'benefit-2',
          title: 'Premium Produkte',
          description: 'Wir verwenden ausschließlich hochwertige, professionelle Pflegeprodukte von renommierten Marken.',
          icon: 'sparkles',
          iconConfig: {
            type: 'preset',
            value: 'sparkles',
            backgroundColor: '#9CAF88',
            iconColor: '#ffffff'
          }
        },
        {
          id: 'benefit-3',
          title: 'Entspannte Atmosphäre',
          description: 'Unser Studio bietet eine ruhige, beruhigende Umgebung, in der Sie vollkommen abschalten können.',
          icon: 'heart',
          iconConfig: {
            type: 'preset',
            value: 'heart',
            backgroundColor: '#9CAF88',
            iconColor: '#ffffff'
          }
        },
        {
          id: 'benefit-4',
          title: 'Individuelle Betreuung',
          description: 'Jede Behandlung wird auf Ihre persönlichen Bedürfnisse und Wünsche abgestimmt.',
          icon: 'user',
          iconConfig: {
            type: 'preset',
            value: 'user',
            backgroundColor: '#9CAF88',
            iconColor: '#ffffff'
          }
        },
        {
          id: 'benefit-5',
          title: 'Flexible Termine',
          description: 'Wir bieten flexible Buchungsmöglichkeiten, die sich Ihrem Zeitplan anpassen.',
          icon: 'calendar',
          iconConfig: {
            type: 'preset',
            value: 'calendar',
            backgroundColor: '#9CAF88',
            iconColor: '#ffffff'
          }
        },
        {
          id: 'benefit-6',
          title: 'Geld-zurück-Garantie',
          description: 'Nicht zufrieden? Wir bieten eine 100%ige Zufriedenheitsgarantie auf alle Behandlungen.',
          icon: 'shield',
          iconConfig: {
            type: 'preset',
            value: 'shield',
            backgroundColor: '#9CAF88',
            iconColor: '#ffffff'
          }
        }
      ],
      cardStyles: {
        backgroundColor: '#ffffff',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: '16px',
        shadow: 'sm',
        paddingX: '2rem',
        paddingY: '2.5rem',
        contentGap: '1.5rem',
        hoverEffect: 'lift'
      },
      iconStyles: {
        showIcons: true,
        position: 'top',
        size: 'lg',
        shape: 'circle',
        backgroundColor: '#9CAF88',
        iconColor: '#ffffff',
        shadow: 'md',
        borderWidth: 0
      },
      typography: {
        sectionTitle: {
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#2C2C2C',
          alignment: 'center',
          marginBottom: '1rem'
        },
        sectionSubtitle: {
          fontSize: '1.25rem',
          fontWeight: '400',
          color: '#666666',
          maxWidth: '600px'
        },
        featureTitle: {
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#2C2C2C',
          lineHeight: '1.3'
        },
        featureDescription: {
          fontSize: '1rem',
          fontWeight: '400',
          color: '#666666',
          lineHeight: '1.6'
        }
      },
      background: {
        type: 'solid',
        color: '#f7f5f3'
      },
      padding: {
        top: '5rem',
        bottom: '5rem',
        left: '2rem',
        right: '2rem'
      },
      maxWidth: 'xl',
      animations: {
        enabled: true,
        type: 'fade',
        stagger: true,
        staggerDelay: 100,
        duration: 600,
        triggerOnScroll: true
      },
      responsive: {
        desktop: 3,
        tablet: 2,
        mobile: 1,
        desktopGap: '2rem',
        tabletGap: '1.5rem',
        mobileGap: '1rem'
      },
      showIcons: true,
      showDescriptions: true,
      showLinks: false
    }
  }
  
  await supabase.from('page_blocks').insert(benefitsBlock)
  console.log('  ✅ Benefits block eklendi\n')
  
  // ==========================================
  // 5. BOOKING CTA BLOCK - Above the fold
  // ==========================================
  console.log('📝 5. Booking CTA Block oluşturuluyor...')
  const bookingCtaBlock = {
    page_id: page.id,
    block_type: 'cta',
    position: position++,
    visible: true,
    content: {
      layout: 'centered',
      alignment: 'center',
      verticalAlignment: 'center',
      minHeight: '400px',
      maxWidth: 'xl',
      padding: {
        top: '5rem',
        bottom: '5rem',
        left: '2rem',
        right: '2rem'
      },
      title: 'Bereit für Ihre Wellness-Reise?',
      titleHighlight: {
        enabled: true,
        words: ['Wellness-Reise'],
        color: '#9CAF88',
        style: 'color'
      },
      subtitle: 'Buchen Sie noch heute Ihren Termin und erleben Sie pure Entspannung',
      description: 'Wählen Sie aus unseren exklusiven Headspa-Paketen und finden Sie den perfekten Termin für sich.',
      primaryButton: {
        text: 'Jetzt Termin buchen',
        link: '#booking', // Scroll to booking section
        style: 'primary',
        size: 'lg',
        backgroundColor: '#9CAF88',
        textColor: '#FFFFFF',
        borderRadius: '12px',
        shadow: 'lg',
        hoverEffect: 'scale',
        icon: 'calendar',
        iconPosition: 'left'
      },
      secondaryButton: {
        enabled: true,
        text: 'Mehr über unsere Services',
        link: '#services',
        style: 'outline',
        textColor: '#9CAF88',
        borderColor: '#9CAF88'
      },
      buttonLayout: 'horizontal',
      buttonGap: '1.5rem',
      buttonAlignment: 'center',
      background: {
        type: 'gradient',
        gradientFrom: '#9CAF88',
        gradientTo: '#637554',
        gradientDirection: 'to-br'
      },
      typography: {
        title: {
          fontSize: 'clamp(2rem, 4vw, 3.5rem)',
          fontWeight: '700',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          color: '#FFFFFF'
        },
        subtitle: {
          fontSize: '1.25rem',
          fontWeight: '400',
          lineHeight: '1.6',
          color: 'rgba(255, 255, 255, 0.95)',
          maxWidth: '600px'
        }
      },
      animations: {
        enabled: true,
        titleAnimation: 'fade',
        subtitleAnimation: 'fade',
        buttonAnimation: 'slide-up',
        duration: 600,
        triggerOnScroll: true
      },
      urgency: {
        enabled: true,
        type: 'badge',
        text: '🔥 Begrenzte Termine verfügbar',
        badgeColor: '#ef4444'
      },
      trustElements: {
        enabled: true,
        items: [
          { type: 'text', content: '✓ Keine Kreditkarte erforderlich' },
          { type: 'text', content: '✓ Kostenlose Stornierung' },
          { type: 'text', content: '✓ 100% Zufriedenheitsgarantie' }
        ],
        layout: 'inline'
      },
      showBadge: false,
      showSubtitle: true,
      showDescription: true,
      showSecondaryButton: true
    }
  }
  
  await supabase.from('page_blocks').insert(bookingCtaBlock)
  console.log('  ✅ Booking CTA block eklendi\n')
  
  // ==========================================
  // 6. SERVICES/PRODUCTS BLOCK
  // ==========================================
  console.log('📝 6. Services Block oluşturuluyor...')
  const servicesBlock = {
    page_id: page.id,
    block_type: 'services',
    position: position++,
    visible: true,
    content: {
      title: 'Unsere Headspa-Pakete',
      subtitle: 'Wählen Sie das perfekte Paket für Ihre Bedürfnisse',
      showPrices: true,
      showDescriptions: true,
      layout: 'grid',
      columns: 3,
      services: [
        {
          id: 'service-1',
          title: 'Headspa Basic',
          description: '45 Minuten pure Entspannung',
          price: '89',
          currency: '€',
          features: [
            'Kopf-, Nacken- und Dekolleté-Massage',
            'Bedampfung',
            'Haarreinigung und Pflege',
            'Peeling',
            'Kérastase Premiere Haaraufbau',
            'Babor Gesichtspflege'
          ],
          ctaText: 'Jetzt buchen',
          ctaLink: '#booking',
          popular: false
        },
        {
          id: 'service-2',
          title: 'Headspa Beauty',
          description: '60 Minuten pure Entspannung',
          price: '119',
          currency: '€',
          features: [
            'Kopf-, Nacken- und Dekolleté-Massage',
            'Bedampfung',
            'Haarreinigung und Pflege',
            'Peeling',
            'Kérastase Premiere Haaraufbau',
            'Babor Gesichtspflege',
            'Erweiterte Gesichtsbehandlung'
          ],
          ctaText: 'Jetzt buchen',
          ctaLink: '#booking',
          popular: true
        },
        {
          id: 'service-3',
          title: 'Headspa Deluxe',
          description: '90 Minuten pure Entspannung',
          price: '149',
          currency: '€',
          features: [
            'Kopf-, Nacken- und Dekolleté-Massage',
            'Bedampfung',
            'Haarreinigung und Pflege',
            'Peeling: Babor',
            'Kérastase Premiere Haaraufbau',
            'Babor Gesichtspflege',
            'Premium Gesichtsbehandlung',
            'Erweiterte Massage'
          ],
          ctaText: 'Jetzt buchen',
          ctaLink: '#booking',
          popular: false
        }
      ],
      background: {
        type: 'solid',
        color: '#ffffff'
      },
      padding: {
        top: '5rem',
        bottom: '5rem'
      }
    }
  }
  
  await supabase.from('page_blocks').insert(servicesBlock)
  console.log('  ✅ Services block eklendi\n')
  
  // ==========================================
  // 7. BOOKING WIDGET/EMBED BLOCK
  // ==========================================
  console.log('📝 7. Booking Widget Block oluşturuluyor...')
  const bookingWidgetBlock = {
    page_id: page.id,
    block_type: 'embed',
    position: position++,
    visible: true,
    content: {
      title: 'Termin buchen',
      subtitle: 'Wählen Sie Ihren Wunschtermin',
      provider: 'calendly', // veya 'custom' ile iframe
      embedUrl: '', // Admin panelden Calendly URL'i eklenebilir
      container: {
        maxWidth: 'xl',
        padding: {
          top: '2rem',
          bottom: '2rem',
          left: '1rem',
          right: '1rem'
        }
      },
      frame: {
        aspectRatio: '16:9',
        allowFullScreen: true,
        scrolling: 'auto'
      },
      background: {
        type: 'solid',
        color: '#f7f5f3'
      },
      sectionId: 'booking' // Anchor for scroll
    }
  }
  
  await supabase.from('page_blocks').insert(bookingWidgetBlock)
  console.log('  ✅ Booking widget block eklendi\n')
  
  // ==========================================
  // 8. TESTIMONIALS BLOCK
  // ==========================================
  console.log('📝 8. Testimonials Block oluşturuluyor...')
  const testimonialsBlock = {
    page_id: page.id,
    block_type: 'testimonials',
    position: position++,
    visible: true,
    content: {
      title: 'Was unsere Kunden sagen',
      subtitle: 'Echte Erfahrungen. Wahre Begeisterung.',
      testimonials: [
        {
          id: 'testimonial-1',
          name: 'Sarah M.',
          role: 'Stammkundin',
          content: 'Die Headspa-Behandlung war absolut traumhaft! Ich konnte vollkommen entspannen und fühlte mich danach wie neu geboren. Das Personal ist sehr kompetent und freundlich.',
          rating: 5,
          image: ''
        },
        {
          id: 'testimonial-2',
          name: 'Michael K.',
          role: 'Erstbesuch',
          content: 'Ich war das erste Mal zum Headspa und bin begeistert. Die 90 Minuten waren pure Verwöhnung. Das Studio ist wunderschön eingerichtet und die Atmosphäre ist sehr beruhigend.',
          rating: 5,
          image: ''
        },
        {
          id: 'testimonial-3',
          name: 'Lisa W.',
          role: 'Wiederkehrende Kundin',
          content: 'Ich komme regelmäßig zum Headspa und bin jedes Mal aufs Neue begeistert. Die Qualität der Behandlung ist konstant hoch und das Team geht auf individuelle Wünsche ein.',
          rating: 5,
          image: ''
        }
      ],
      layout: 'carousel',
      background: {
        type: 'solid',
        color: '#ffffff'
      },
      padding: {
        top: '5rem',
        bottom: '5rem'
      }
    }
  }
  
  await supabase.from('page_blocks').insert(testimonialsBlock)
  console.log('  ✅ Testimonials block eklendi\n')
  
  // ==========================================
  // 9. FAQ BLOCK
  // ==========================================
  console.log('📝 9. FAQ Block oluşturuluyor...')
  const faqBlock = {
    page_id: page.id,
    block_type: 'faq',
    position: position++,
    visible: true,
    content: {
      title: 'Häufig gestellte Fragen',
      subtitle: 'Antworten auf einen Blick',
      faqs: [
        {
          id: 'faq-1',
          question: 'Wie lange dauert eine Headspa-Behandlung?',
          answer: 'Eine Headspa-Behandlung dauert je nach Paket 45 bis 90 Minuten. Sie haben genügend Zeit, sich zu entspannen und die Pflege in vollen Zügen zu genießen.',
          category: 'allgemein',
          order: 1
        },
        {
          id: 'faq-2',
          question: 'Kann ich meinen Termin stornieren?',
          answer: 'Ja, Sie können Ihren Termin kostenlos bis zu 24 Stunden vorher stornieren. Bei kurzfristigeren Stornierungen kontaktieren Sie uns bitte telefonisch.',
          category: 'buchung',
          order: 2
        },
        {
          id: 'faq-3',
          question: 'Welche Zahlungsmethoden werden akzeptiert?',
          answer: 'Wir akzeptieren Barzahlung, EC-Karte und alle gängigen Kreditkarten. Die Zahlung erfolgt direkt im Studio nach der Behandlung.',
          category: 'zahlung',
          order: 3
        },
        {
          id: 'faq-4',
          question: 'Ist die Behandlung auch für empfindliche Kopfhaut geeignet?',
          answer: 'Absolut! Unsere Produkte und Techniken sind speziell darauf abgestimmt, auch empfindliche Kopfhaut zu beruhigen und zu pflegen. Bitte informieren Sie uns vor der Behandlung über besondere Bedürfnisse.',
          category: 'behandlung',
          order: 4
        },
        {
          id: 'faq-5',
          question: 'Gibt es eine Zufriedenheitsgarantie?',
          answer: 'Ja, wir bieten eine 100%ige Zufriedenheitsgarantie. Sollten Sie mit Ihrer Behandlung nicht zufrieden sein, erstatten wir Ihnen den vollen Betrag zurück.',
          category: 'garantie',
          order: 5
        }
      ],
      layout: 'accordion',
      background: {
        type: 'solid',
        color: '#f7f5f3'
      },
      padding: {
        top: '5rem',
        bottom: '5rem'
      }
    }
  }
  
  await supabase.from('page_blocks').insert(faqBlock)
  console.log('  ✅ FAQ block eklendi\n')
  
  // ==========================================
  // 10. FINAL CTA BLOCK
  // ==========================================
  console.log('📝 10. Final CTA Block oluşturuluyor...')
  const finalCtaBlock = {
    page_id: page.id,
    block_type: 'cta',
    position: position++,
    visible: true,
    content: {
      layout: 'centered',
      alignment: 'center',
      minHeight: '300px',
      maxWidth: 'xl',
      padding: {
        top: '4rem',
        bottom: '4rem'
      },
      title: 'Bereit, Ihre Wellness-Reise zu beginnen?',
      subtitle: 'Buchen Sie jetzt Ihren Termin und erleben Sie pure Entspannung',
      primaryButton: {
        text: 'Jetzt Termin buchen',
        link: '#booking',
        style: 'primary',
        size: 'lg',
        backgroundColor: '#9CAF88',
        textColor: '#FFFFFF',
        borderRadius: '12px',
        shadow: 'lg',
        hoverEffect: 'scale'
      },
      background: {
        type: 'gradient',
        gradientFrom: '#637554',
        gradientTo: '#9CAF88',
        gradientDirection: 'to-r'
      },
      typography: {
        title: {
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#FFFFFF'
        },
        subtitle: {
          fontSize: '1.25rem',
          fontWeight: '400',
          color: 'rgba(255, 255, 255, 0.9)'
        }
      },
      animations: {
        enabled: true,
        titleAnimation: 'fade',
        buttonAnimation: 'slide-up',
        duration: 600
      },
      showSubtitle: true,
      showSecondaryButton: false
    }
  }
  
  await supabase.from('page_blocks').insert(finalCtaBlock)
  console.log('  ✅ Final CTA block eklendi\n')
  
  // ==========================================
  // 11. CONTACT BLOCK
  // ==========================================
  console.log('📝 11. Contact Block oluşturuluyor...')
  const contactBlock = {
    page_id: page.id,
    block_type: 'contact',
    position: position++,
    visible: true,
    content: {
      useGlobalContact: true,
      badge: 'Kontakt',
      sectionTitle: 'Besuchen Sie uns',
      highlightedText: 'in unserem Studio',
      description: 'Wir freuen uns darauf, Sie in unserem neuen Wellnesstal-Studio begrüßen zu dürfen.',
      contact: {
        businessName: 'Wellnesstal',
        phone: '+49 173 3828581',
        email: 'info@wellnesstal.de',
        address: {
          street: 'Reyplatz 10',
          city: 'Baesweiler',
          postalCode: '52499',
          country: 'Deutschland'
        },
        openingHours: {
          monday: { open: '09:00', close: '18:00', closed: false },
          tuesday: { open: '09:00', close: '18:00', closed: false },
          wednesday: { open: '09:00', close: '18:00', closed: false },
          thursday: { open: '09:00', close: '18:00', closed: false },
          friday: { open: '09:00', close: '18:00', closed: false },
          saturday: { open: '10:00', close: '16:00', closed: false },
          sunday: { closed: true }
        }
      },
      background: {
        type: 'solid',
        color: '#ffffff'
      },
      padding: {
        top: '5rem',
        bottom: '5rem'
      }
    }
  }
  
  await supabase.from('page_blocks').insert(contactBlock)
  console.log('  ✅ Contact block eklendi\n')
  
  // ==========================================
  // 12. FOOTER BLOCK
  // ==========================================
  console.log('📝 12. Footer Block oluşturuluyor...')
  const footerBlock = {
    page_id: page.id,
    block_type: 'footer',
    position: position++,
    visible: true,
    content: {
      columns: [
        {
          title: 'Wellnesstal',
          links: [
            { text: 'Über uns', url: '/about' },
            { text: 'Services', url: '/services' },
            { text: 'Preise', url: '/pricing' },
            { text: 'Kontakt', url: '/contact' }
          ]
        },
        {
          title: 'Rechtliches',
          links: [
            { text: 'Impressum', url: '/impressum' },
            { text: 'Datenschutz', url: '/datenschutz' },
            { text: 'AGB', url: '/agb' }
          ]
        },
        {
          title: 'Kontakt',
          links: [
            { text: 'Reyplatz 10, 52499 Baesweiler', url: '#' },
            { text: '+49 173 3828581', url: 'tel:+491733828581' },
            { text: 'info@wellnesstal.de', url: 'mailto:info@wellnesstal.de' }
          ]
        }
      ],
      copyright: '© 2026 Wellnesstal. Alle Rechte vorbehalten.',
      socialLinks: [
        { platform: 'facebook', url: '#' },
        { platform: 'instagram', url: '#' }
      ],
      backgroundColor: '#2C2C2C',
      textColor: '#FFFFFF'
    }
  }
  
  await supabase.from('page_blocks').insert(footerBlock)
  console.log('  ✅ Footer block eklendi\n')
  
  // ==========================================
  // 13. SEO BLOCK
  // ==========================================
  console.log('📝 13. SEO Block oluşturuluyor...')
  const seoBlock = {
    page_id: page.id,
    block_type: 'seo',
    position: position++,
    visible: true,
    content: {
      metaTitle: 'Wellnesstal - Premium Wellness & Headspa in Baesweiler | Jetzt Termin buchen',
      metaDescription: 'Entspannung und Wellness in Baesweiler. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden. Jetzt Termin vereinbaren!',
      keywords: 'wellness, headspa, massage, baesweiler, entspannung, aromatherapie, kopfmassage, wellness-studio',
      ogImage: '/images/og-wellnesstal.jpg',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'BeautySalon',
        name: 'Wellnesstal',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Reyplatz 10',
          addressLocality: 'Baesweiler',
          postalCode: '52499',
          addressCountry: 'DE'
        },
        telephone: '+491733828581',
        priceRange: '€€',
        image: '/images/og-wellnesstal.jpg'
      }
    }
  }
  
  await supabase.from('page_blocks').insert(seoBlock)
  console.log('  ✅ SEO block eklendi\n')
  
  console.log('='.repeat(70))
  console.log('✅ Enterprise-Level Landing Page Oluşturuldu!')
  console.log(`\n📊 Toplam Block: ${position}`)
  console.log('\n🎯 Özellikler:')
  console.log('  ✅ Conversion-optimized hero section')
  console.log('  ✅ Trust signals & social proof')
  console.log('  ✅ Value proposition')
  console.log('  ✅ Benefits/features section')
  console.log('  ✅ Multiple CTA placements')
  console.log('  ✅ Booking widget integration')
  console.log('  ✅ Testimonials & reviews')
  console.log('  ✅ FAQ section')
  console.log('  ✅ Contact information')
  console.log('  ✅ SEO optimized')
  console.log('\n📝 Sonraki Adımlar:')
  console.log('  1. Admin panelden booking widget URL\'ini ekle (Embed block)')
  console.log('  2. Hero image ekle (admin panelden)')
  console.log('  3. Testimonials\'a müşteri fotoğrafları ekle')
  console.log('  4. Calendly veya başka booking sistemi entegre et')
  console.log('\n🌐 Sayfa URL: http://localhost:3001/')
  console.log('📱 Admin Panel: /admin/pages → Home sayfasını düzenle\n')
}

createEnterpriseLandingPage().catch(console.error)

