#!/usr/bin/env node

/**
 * Headspa Sayfasına Eksik İçerikleri Ekle
 * Referans: https://www.deluxe-beauty-spa.de/head-spa
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load environment variables
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

async function addHeadspaContent() {
  console.log('🚀 Headspa Sayfasına İçerik Ekleme\n')
  console.log('='.repeat(60))
  
  const envVars = loadEnvFile()
  if (!envVars) {
    return
  }
  
  const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL']
  const supabaseKey = envVars['SUPABASE_SERVICE_ROLE_KEY'] || envVars['NEXT_PUBLIC_SUPABASE_ANON_KEY']
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Supabase URL veya Key bulunamadı!')
    return
  }
  
  console.log(`✅ Supabase URL: ${supabaseUrl}\n`)
  
  const supabase = createClient(supabaseUrl, supabaseKey)
  
  // Headspa sayfasını bul
  console.log('📄 Headspa sayfasını buluyorum...')
  const { data: page, error: pageError } = await supabase
    .from('pages')
    .select('id, title, slug')
    .eq('slug', 'headspa')
    .single()
  
  if (pageError || !page) {
    console.error(`❌ Headspa sayfası bulunamadı: ${pageError?.message}`)
    return
  }
  
  console.log(`✅ Sayfa bulundu: ${page.title} (${page.slug})\n`)
  
  // Mevcut blockları al
  console.log('📦 Mevcut blockları kontrol ediyorum...')
  const { data: existingBlocks, error: blocksError } = await supabase
    .from('page_blocks')
    .select('id, block_type, position, content')
    .eq('page_id', page.id)
    .order('position', { ascending: true })
  
  if (blocksError) {
    console.error(`❌ Block'lar alınamadı: ${blocksError.message}`)
    return
  }
  
  console.log(`✅ ${existingBlocks?.length || 0} mevcut block bulundu\n`)
  
  // Mevcut block tiplerini kontrol et
  const blockTypes = existingBlocks?.map(b => b.block_type) || []
  console.log('Mevcut block tipleri:', blockTypes.join(', '), '\n')
  
  // En yüksek position'ı bul
  const maxPosition = existingBlocks?.length > 0 
    ? Math.max(...existingBlocks.map(b => b.position || 0))
    : -1
  
  let currentPosition = maxPosition + 1
  
  // 1. Hero Block'a yeni adres bilgisi ekle
  console.log('📍 Hero block\'a yeni adres bilgisi ekleniyor...')
  const heroBlock = existingBlocks?.find(b => b.block_type === 'hero')
  if (heroBlock) {
    const heroContent = heroBlock.content || {}
    const updatedContent = {
      ...heroContent,
      badge: heroContent.badge || "Ab dem 15.01.2026 finden alle Headspa-Termine in unserem neuen Wellnesstal-Studio unter der Adresse Reyplatz 10, 52499 Baesweiler statt. Wir freuen uns darauf, Sie in unserer neuen und beruhigenden Atmosphäre begrüßen zu dürfen.",
      subtitle: heroContent.subtitle || "Erlebe tiefgehende Regeneration und lass die Gedanken los. Gönn dir ein einzigartiges Headspa-Erlebnis, das Kopf und Seele in Einklang bringt"
    }
    
    const { error: updateError } = await supabase
      .from('page_blocks')
      .update({ content: updatedContent })
      .eq('id', heroBlock.id)
    
    if (updateError) {
      console.error(`❌ Hero block güncellenemedi: ${updateError.message}`)
    } else {
      console.log('✅ Hero block güncellendi\n')
    }
  } else {
    console.log('⚠️  Hero block bulunamadı, atlanıyor\n')
  }
  
  // 2. Problem Text Block ekle
  console.log('📝 Problem Text Block ekleniyor...')
  const problemBlock = {
    page_id: page.id,
    block_type: 'text',
    position: currentPosition++,
    visible: true,
    content: {
      stylePreset: 'problem',
      title: 'Kopf voller Gedanken, gestresst und erschöpft?',
      content: `In der Hektik des Alltags verlieren wir oft die Verbindung zu uns selbst. Unser Kopf ist ständig aktiv, unser Geist nie zur Ruhe. Die Folge? Stress, Erschöpfung und ein Gefühl der Überforderung. Doch es gibt einen Ausweg.`,
      showTitle: true,
      showSubtitle: false,
      maxWidth: 'xl',
      padding: {
        top: '4rem',
        bottom: '4rem',
        left: '1.5rem',
        right: '1.5rem'
      },
      typography: {
        title: {
          enabled: true,
          fontSize: '2.5rem',
          fontWeight: '700',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          color: '#2C2C2C',
          marginBottom: '1.5rem'
        },
        body: {
          fontSize: '1.125rem',
          fontWeight: '400',
          lineHeight: '1.75',
          letterSpacing: '0',
          color: '#666666',
          paragraphSpacing: '1.5rem'
        }
      },
      background: {
        type: 'solid',
        color: '#f7f5f3'
      }
    }
  }
  
  const { error: problemError } = await supabase
    .from('page_blocks')
    .insert(problemBlock)
  
  if (problemError) {
    console.error(`❌ Problem block eklenemedi: ${problemError.message}`)
  } else {
    console.log('✅ Problem block eklendi\n')
  }
  
  // 3. Solution Text Block ekle
  console.log('💡 Solution Text Block ekleniyor...')
  const solutionBlock = {
    page_id: page.id,
    block_type: 'text',
    position: currentPosition++,
    visible: true,
    content: {
      stylePreset: 'solution',
      title: 'Mehr als nur Entspannung – wahre Erholung für deinen Kopf und Geist',
      content: `Unsere Headspa-Behandlung geht über oberflächliche Entspannung hinaus. Mit speziell entwickelten Techniken und einer Kombination aus wohltuenden Massagegriffen regenerieren wir nicht nur deine Kopfhaut, sondern bringen auch deinen Geist in Balance. Erlebe, wie Stress und Anspannung verschwinden und dein Kopf wieder frei wird.`,
      showTitle: true,
      showSubtitle: false,
      maxWidth: 'xl',
      padding: {
        top: '4rem',
        bottom: '4rem',
        left: '1.5rem',
        right: '1.5rem'
      },
      typography: {
        title: {
          enabled: true,
          fontSize: '2.5rem',
          fontWeight: '700',
          lineHeight: '1.2',
          letterSpacing: '-0.02em',
          color: '#2C2C2C',
          marginBottom: '1.5rem'
        },
        body: {
          fontSize: '1.125rem',
          fontWeight: '400',
          lineHeight: '1.75',
          letterSpacing: '0',
          color: '#666666',
          paragraphSpacing: '1.5rem'
        }
      },
      background: {
        type: 'solid',
        color: '#ffffff'
      }
    }
  }
  
  const { error: solutionError } = await supabase
    .from('page_blocks')
    .insert(solutionBlock)
  
  if (solutionError) {
    console.error(`❌ Solution block eklenemedi: ${solutionError.message}`)
  } else {
    console.log('✅ Solution block eklendi\n')
  }
  
  // 4. Detaylı İşlem Açıklamaları - Features Block olarak ekle
  console.log('🔧 Detaylı İşlem Açıklamaları ekleniyor...')
  
  const treatmentFeatures = {
    page_id: page.id,
    block_type: 'features',
    position: currentPosition++,
    visible: true,
    content: {
      title: 'Was macht Headspa so besonders?',
      subtitle: 'Entdecke die einzelnen Schritte unserer Headspa-Behandlung',
      headerAlignment: 'center',
      showDivider: false,
      features: [
        {
          id: 'treatment-1',
          title: 'Sanfte Kopf, Nacken und Schultermassage',
          description: 'Zu Beginn der Behandlung genießt du eine entspannende Massage für Kopf, Nacken und Schultern. Diese Massage löst Verspannungen, fördert die Durchblutung und lindert stressbedingte Kopfschmerzen. Spüre, wie die Anspannung des Alltags nachlässt und sich tiefe Entspannung ausbreitet.',
          icon: 'spa',
          iconConfig: {
            type: 'preset',
            value: 'spa',
            backgroundColor: '#9CAF88',
            iconColor: '#ffffff',
            size: 'md',
            shape: 'circle',
            shadow: 'none'
          },
          showFeaturesList: true,
          featuresList: [
            { id: '1', text: 'Löst Verspannungen und lindert Beschwerden', enabled: true },
            { id: '2', text: 'Fördert die Durchblutung für mehr Klarheit', enabled: true },
            { id: '3', text: 'Reduziert stressbedingte Kopfschmerzen', enabled: true }
          ],
          visible: true
        },
        {
          id: 'treatment-2',
          title: 'Tiefenreinigung der Kopfhaut',
          description: 'Anschließend wird deine Kopfhaut mit warmem Wasser und speziellen Pflegeprodukten gründlich gereinigt. Dies entfernt überschüssiges Fett und abgestorbene Hautzellen, wodurch deine Kopfhaut wieder atmen kann. Die Reinigung fördert die Gesundheit der Haarwurzeln und sorgt für ein frisches, sauberes Gefühl.',
          icon: 'leaf',
          iconConfig: {
            type: 'preset',
            value: 'leaf',
            backgroundColor: '#9CAF88',
            iconColor: '#ffffff',
            size: 'md',
            shape: 'circle',
            shadow: 'none'
          },
          showFeaturesList: true,
          featuresList: [
            { id: '1', text: 'Entfernt abgestorbene Hautzellen und überschüssiges Fett', enabled: true },
            { id: '2', text: 'Fördert die Sauerstoffzufuhr zur Kopfhaut', enabled: true },
            { id: '3', text: 'Hinterlässt ein frisches und sauberes Gefühl', enabled: true }
          ],
          visible: true
        },
        {
          id: 'treatment-3',
          title: 'Bedampfung für intensive Pflege',
          description: 'Danach folgt die Bedampfung, bei der warmer Dampf sanft auf deine Kopfhaut einwirkt. Der Dampf öffnet die Poren, verbessert die Aufnahme von Nährstoffen und fördert die Durchblutung der Kopfhaut. Das Ergebnis ist eine tiefe Pflege, die deine Kopfhaut beruhigt und die Effekte der nachfolgenden Haarpflege verstärkt.',
          icon: 'heart',
          iconConfig: {
            type: 'preset',
            value: 'heart',
            backgroundColor: '#9CAF88',
            iconColor: '#ffffff',
            size: 'md',
            shape: 'circle',
            shadow: 'none'
          },
          showFeaturesList: true,
          featuresList: [
            { id: '1', text: 'Öffnet die Poren für bessere Nährstoffaufnahme', enabled: true },
            { id: '2', text: 'Beruhigt und revitalisiert die Kopfhaut', enabled: true },
            { id: '3', text: 'Verbessert die Durchblutung für gesünderes Haar', enabled: true }
          ],
          visible: true
        },
        {
          id: 'treatment-4',
          title: 'Tiefenwirksame Pflege für Gesicht und Dekolleté',
          description: 'Die Gesichts- und Dekolleté-Maske spendet intensive Feuchtigkeit, beruhigt die Haut und versorgt sie mit wertvollen Nährstoffen. Sie hilft, die Haut zu regenerieren, verleiht ihr frische Ausstrahlung und hinterlässt Gesicht und Dekolleté geschmeidig und revitalisiert. Gönn dir eine wohltuende Auszeit und spüre den Unterschied.',
          icon: 'star',
          iconConfig: {
            type: 'preset',
            value: 'star',
            backgroundColor: '#9CAF88',
            iconColor: '#ffffff',
            size: 'md',
            shape: 'circle',
            shadow: 'none'
          },
          showFeaturesList: true,
          featuresList: [
            { id: '1', text: 'Spendet tiefenwirksame Feuchtigkeit und nährt die Haut', enabled: true },
            { id: '2', text: 'Beruhigt irritierte Haut und fördert die Regeneration', enabled: true },
            { id: '3', text: 'Verleiht einen frischen, strahlenden Teint', enabled: true }
          ],
          visible: true
        }
      ],
      layout: 'grid',
      columns: 2,
      gridGap: '2rem',
      alignItems: 'stretch',
      cardStyles: {
        backgroundColor: '#ffffff',
        backgroundHover: '#f8fafc',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderRadius: '1rem',
        shadow: 'sm',
        shadowHover: 'md',
        hoverEffect: 'lift',
        hoverTransitionDuration: 300,
        paddingX: '1.5rem',
        paddingY: '2rem',
        contentGap: '1rem'
      },
      iconStyles: {
        showIcons: true,
        position: 'top',
        size: 'md',
        shape: 'circle',
        backgroundColor: '#9CAF88',
        iconColor: '#ffffff',
        shadow: 'none',
        borderWidth: 0,
        borderColor: 'transparent',
        hoverAnimation: 'none'
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
          fontSize: '1.125rem',
          fontWeight: '400',
          color: '#666666',
          maxWidth: '600px'
        },
        featureTitle: {
          fontSize: '1.25rem',
          fontWeight: '600',
          color: '#2C2C2C',
          lineHeight: '1.4'
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
        color: '#ffffff'
      },
      padding: {
        top: '5rem',
        bottom: '5rem',
        left: '1.5rem',
        right: '1.5rem'
      },
      maxWidth: 'xl',
      animations: {
        enabled: true,
        type: 'fade',
        stagger: true,
        staggerDelay: 100,
        duration: 500,
        triggerOnScroll: true,
        iconAnimation: 'none'
      },
      responsive: {
        desktop: 2,
        tablet: 2,
        mobile: 1,
        desktopGap: '2rem',
        tabletGap: '1.5rem',
        mobileGap: '1rem',
        mobileStackIcons: false,
        mobileHideIcons: false,
        mobileCardStyle: 'full'
      },
      showTitle: true,
      showSubtitle: true,
      showDescriptions: true,
      showIcons: true,
      showLinks: false
    }
  }
  
  const { error: treatmentError } = await supabase
    .from('page_blocks')
    .insert(treatmentFeatures)
  
  if (treatmentError) {
    console.error(`❌ Treatment features block eklenemedi: ${treatmentError.message}`)
  } else {
    console.log('✅ Treatment features block eklendi\n')
  }
  
  // 5. FAQ Block ekle
  console.log('❓ FAQ Block ekleniyor...')
  const faqBlock = {
    page_id: page.id,
    block_type: 'faq',
    position: currentPosition++,
    visible: true,
    content: {
      layout: 'accordion',
      maxWidth: 'xl',
      header: {
        title: 'Häufig gestellte Fragen',
        subtitle: 'Antworten auf einen Blick. Finde hier alles, was Du über Headspa wissen musst.',
        alignment: 'center'
      },
      items: [
        {
          id: 'faq-1',
          question: 'Wie lange dauert eine Headspa-Behandlung?',
          answer: 'Eine Headspa-Behandlung dauert in der Regel 45 bis 90 Minuten, je nach individuellem Bedarf und den gewünschten Extras. Du hast genügend Zeit, dich zu entspannen und die Pflege in vollen Zügen zu genießen.',
          featured: false,
          pinned: false,
          order: 1
        },
        {
          id: 'faq-2',
          question: 'Hilft die Behandlung bei stressbedingten Kopfschmerzen?',
          answer: 'Ja, die Kombination aus Massage und Kopfhautpflege kann effektiv dabei helfen, stressbedingte Kopfschmerzen zu lindern, Verspannungen zu lösen und die Durchblutung zu fördern.',
          featured: false,
          pinned: false,
          order: 2
        },
        {
          id: 'faq-3',
          question: 'Ist die Headspa-Behandlung auch für empfindliche Kopfhaut geeignet?',
          answer: 'Absolut! Unsere Produkte und Techniken sind speziell darauf abgestimmt, auch empfindliche Kopfhaut zu beruhigen und zu pflegen. Du kannst sicher sein, dass wir auf deine individuellen Bedürfnisse eingehen.',
          featured: false,
          pinned: false,
          order: 3
        },
        {
          id: 'faq-4',
          question: 'Was sind die langfristigen Vorteile einer Headspa-Behandlung?',
          answer: 'Regelmäßige Headspa-Behandlungen fördern die Gesundheit deiner Kopfhaut, stärken dein Haar und können sogar das Haarwachstum anregen. Zusätzlich hilft die Massage, Stress abzubauen und das allgemeine Wohlbefinden zu steigern.',
          featured: false,
          pinned: false,
          order: 4
        },
        {
          id: 'faq-5',
          question: 'Welche Produkte werden bei der Behandlung verwendet?',
          answer: 'Wir verwenden nur hochwertige, professionelle Pflegeprodukte, die deine Kopfhaut und Haare optimal nähren und pflegen. Unsere Produkte sind sanft und frei von schädlichen Inhaltsstoffen.',
          featured: false,
          pinned: false,
          order: 5
        }
      ],
      accordionSettings: {
        allowMultipleOpen: false,
        defaultOpenIndex: 0,
        collapseOthersOnOpen: true
      },
      accordionStyle: 'default',
      typography: {
        question: {
          fontSize: '1.125rem',
          fontWeight: '600',
          color: '#2C2C2C'
        },
        answer: {
          fontSize: '1rem',
          fontWeight: '400',
          color: '#666666',
          lineHeight: '1.6'
        }
      },
      background: {
        type: 'solid',
        color: '#ffffff'
      },
      padding: {
        top: '5rem',
        bottom: '5rem'
      },
      itemGap: '1rem',
      animations: {
        enabled: true,
        type: 'fade',
        duration: 300
      },
      responsive: {
        mobile: {
          padding: '2rem'
        },
        tablet: {
          padding: '3rem'
        },
        desktop: {
          padding: '4rem'
        }
      },
      schemaMarkup: {
        enabled: true,
        includeInHead: true
      }
    }
  }
  
  const { error: faqError } = await supabase
    .from('page_blocks')
    .insert(faqBlock)
  
  if (faqError) {
    console.error(`❌ FAQ block eklenemedi: ${faqError.message}`)
  } else {
    console.log('✅ FAQ block eklendi\n')
  }
  
  // 6. Pricing Block'a "Geld-zurück-Garantie" ekle
  console.log('💰 Pricing Block\'a Geld-zurück-Garantie ekleniyor...')
  const pricingBlock = existingBlocks?.find(b => b.block_type === 'pricing')
  if (pricingBlock) {
    const pricingContent = pricingBlock.content || {}
    const updatedPricing = {
      ...pricingContent,
      trustElement: {
        enabled: true,
        type: 'money-back',
        text: 'inkl. Geld-zurück-Garantie',
        icon: '🛡️',
        duration: '',
        position: 'below-packages'
      }
    }
    
    const { error: pricingUpdateError } = await supabase
      .from('page_blocks')
      .update({ content: updatedPricing })
      .eq('id', pricingBlock.id)
    
    if (pricingUpdateError) {
      console.error(`❌ Pricing block güncellenemedi: ${pricingUpdateError.message}`)
    } else {
      console.log('✅ Pricing block güncellendi (Geld-zurück-Garantie eklendi)\n')
    }
  } else {
    console.log('⚠️  Pricing block bulunamadı, atlanıyor\n')
  }
  
  // 7. Testimonials Block ekle/güncelle
  console.log('⭐ Testimonials Block ekleniyor...')
  const testimonialsBlock = {
    page_id: page.id,
    block_type: 'testimonials',
    position: currentPosition++,
    visible: true,
    content: {
      title: 'Stimmen, die begeistern',
      subtitle: '4,8 von 5* Sternen bei GOOGLE und Co. Echte Erlebnisse. Wahre Begeisterung.',
      layout: 'grid',
      testimonials: [
        {
          id: 'testimonial-1',
          name: 'Joanna Koscielna',
          role: '',
          company: '',
          content: 'Ich hatte die Gelegenheit, eine Behandlung im Salon in der Kückstr. 17 in Baesweiler zu erleben, und ich bin beeindruckt von der Qualität der Dienstleistungen sowie der Professionalität des Personals. Die Behandlung begann mit einer gründlichen Haarwäsche, kombiniert mit einer entspannenden Kopfmassage. Der sanfte Wasserstrahl, der aus einer halbrunden Düse floss, schuf eine äußerst beruhigende Atmosphäre, und die anschließende Massage des Nackens, der Hinter- und Vorderseite des Kopfes versetzte mich in einen Zustand tiefer Entspannung.',
          rating: 5,
          readMoreLink: {
            enabled: true,
            text: 'Weiter lesen',
            url: '#testimonial-1'
          }
        },
        {
          id: 'testimonial-2',
          name: 'Lea Wiegand',
          role: '',
          company: '',
          content: 'Ich bin Neukundin bei Deluxe Hair und Beauty und habe die Behandlung beim Head- Spa erhalten. Es war wirklich traumhaft. Bei der Behandlung konnte ich zu 100% entspannen und in vollen Zügen genießen. Eine sehr liebe und kompetente Dame hat sich sehr viel Zeit für mich genommen und die Behandlung in Ruhe durchgeführt. Ich freu mich auf die nächste Behandlung und kann es jedem weiter empfehlen. ☺️',
          rating: 5,
          readMoreLink: {
            enabled: false,
            text: '',
            url: ''
          }
        },
        {
          id: 'testimonial-3',
          name: 'Jacqueline G.',
          role: '',
          company: '',
          content: 'Ich war das erste Mal zum Head Spa und es war unglaublich. Es waren 90 Minuten pure Verwöhnung. Das Personal ist super nett und freundlich, man wird direkt mit offenen Armen empfangen. Es gab leckeren Kaffee. Die Behandlung dauerte etwa. 90 Min mit Waschen, Peeling, Massage, Bedampfung etc. also das rundum sorglos Paket, man kann vom Alltag abschalten und sich wirklich komplett frei fühlen. Jeder der sich etwas gutes tun möchte sollte das auf jeden Fall ausprobieren! 😍😍😍',
          rating: 5,
          readMoreLink: {
            enabled: false,
            text: '',
            url: ''
          }
        }
      ],
      layout: 'grid',
      columns: 3,
      maxWidth: 'xl',
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
  
  const { error: testimonialsError } = await supabase
    .from('page_blocks')
    .insert(testimonialsBlock)
  
  if (testimonialsError) {
    console.error(`❌ Testimonials block eklenemedi: ${testimonialsError.message}`)
  } else {
    console.log('✅ Testimonials block eklendi\n')
  }
  
  console.log('='.repeat(60))
  console.log('✅ Tüm içerikler başarıyla eklendi!')
  console.log(`📄 Sayfa: ${page.title}`)
  console.log(`📦 Toplam block sayısı: ${(existingBlocks?.length || 0) + 6}`)
  console.log('\n🎉 İşlem tamamlandı!')
}

addHeadspaContent().catch(console.error)

