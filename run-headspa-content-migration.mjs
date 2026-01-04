import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables
const envFile = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8')
const envVars = {}
envFile.split('\n').forEach(line => {
  const trimmed = line.trim()
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=')
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '')
    }
  }
})

const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'] || 'https://rtudfkccbzbblfmeoyop.supabase.co'
const supabaseServiceKey = envVars['SUPABASE_SERVICE_ROLE_KEY']

if (!supabaseServiceKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY environment variable is not set!')
  console.error('Please set it in your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false }
})

async function runMigration() {
  console.log('🚀 Running Headspa Example Content Migration (015_headspa_example_content.sql)...\n')

  try {
    // Read migration file
    const migrationPath = path.join(__dirname, 'supabase', 'migrations', '015_headspa_example_content.sql')
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8')

    console.log('📄 Migration file loaded')
    console.log('📦 Executing migration...\n')

    // Split SQL into individual UPDATE statements
    const statements = migrationSQL
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('='))

    let successCount = 0
    let errorCount = 0

    // Direct updates using Supabase client
    console.log('📝 Updating Features block...')
    const featuresContent = {
      title: "Was macht Headspa so besonders?",
      subtitle: "Entdecke die vielfältigen Vorteile dieser einzigartigen Behandlung.",
      headerAlignment: "center",
      showDivider: false,
      dividerColor: "#e2e8f0",
      features: [
        {
          id: "feature-1",
          title: "Tiefenentspannung",
          description: "Lass den Alltagsstress hinter dir und tauche ein in eine Welt der Ruhe und Entspannung.",
          icon: "spa",
          iconConfig: {
            type: "preset",
            value: "spa",
            backgroundColor: "#9CAF88",
            iconColor: "#ffffff",
            size: "md",
            shape: "circle",
            shadow: "none"
          },
          showFeaturesList: true,
          featuresList: [
            { id: "1", text: "Sanfte Kopfhautmassage", enabled: true },
            { id: "2", text: "Entspannung für Körper und Geist", enabled: true },
            { id: "3", text: "Reduzierung von Stress und Verspannungen", enabled: true }
          ],
          visible: true
        },
        {
          id: "feature-2",
          title: "Intensive Kopfhautpflege",
          description: "Deine Kopfhaut wird mit hochwertigen Produkten verwöhnt und gepflegt.",
          icon: "leaf",
          iconConfig: {
            type: "preset",
            value: "leaf",
            backgroundColor: "#9CAF88",
            iconColor: "#ffffff",
            size: "md",
            shape: "circle",
            shadow: "none"
          },
          showFeaturesList: true,
          featuresList: [
            { id: "1", text: "Reinigung und Peeling der Kopfhaut", enabled: true },
            { id: "2", text: "Nährstoffreiche Masken", enabled: true },
            { id: "3", text: "Verbesserte Durchblutung", enabled: true }
          ],
          visible: true
        },
        {
          id: "feature-3",
          title: "Gesunder Haarwuchs",
          description: "Fördere das natürliche Haarwachstum und stärke deine Haare von der Wurzel an.",
          icon: "heart",
          iconConfig: {
            type: "preset",
            value: "heart",
            backgroundColor: "#9CAF88",
            iconColor: "#ffffff",
            size: "md",
            shape: "circle",
            shadow: "none"
          },
          showFeaturesList: true,
          featuresList: [
            { id: "1", text: "Stärkung der Haarwurzeln", enabled: true },
            { id: "2", text: "Verbesserte Haarstruktur", enabled: true },
            { id: "3", text: "Mehr Glanz und Volumen", enabled: true }
          ],
          visible: true
        }
      ],
      layout: "grid",
      columns: 3,
      gridGap: "2rem",
      alignItems: "stretch",
      carousel: {
        autoPlay: false,
        autoPlayInterval: 5000,
        showDots: true,
        showArrows: true,
        slidesPerView: 3,
        loop: true
      },
      cardStyles: {
        backgroundColor: "#ffffff",
        backgroundHover: "#f8fafc",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#e2e8f0",
        borderRadius: "1rem",
        shadow: "sm",
        shadowHover: "md",
        hoverEffect: "lift",
        hoverTransitionDuration: 300,
        paddingX: "1.5rem",
        paddingY: "2rem",
        contentGap: "1rem"
      },
      iconStyles: {
        showIcons: true,
        position: "top",
        size: "md",
        shape: "circle",
        backgroundColor: "#9CAF88",
        iconColor: "#ffffff",
        shadow: "none",
        borderWidth: 0,
        borderColor: "transparent",
        hoverAnimation: "none"
      },
      typography: {
        sectionTitle: {
          fontSize: "2.5rem",
          fontWeight: "700",
          color: "#2C2C2C",
          alignment: "center",
          marginBottom: "1rem"
        },
        sectionSubtitle: {
          fontSize: "1.125rem",
          fontWeight: "400",
          color: "#666666",
          maxWidth: "600px"
        },
        featureTitle: {
          fontSize: "1.25rem",
          fontWeight: "600",
          color: "#2C2C2C",
          lineHeight: "1.4"
        },
        featureDescription: {
          fontSize: "1rem",
          fontWeight: "400",
          color: "#666666",
          lineHeight: "1.6"
        }
      },
      background: {
        type: "solid",
        color: "#ffffff"
      },
      padding: {
        top: "5rem",
        bottom: "5rem",
        left: "1.5rem",
        right: "1.5rem"
      },
      maxWidth: "xl",
      animations: {
        enabled: true,
        type: "fade",
        stagger: true,
        staggerDelay: 100,
        duration: 500,
        triggerOnScroll: true,
        iconAnimation: "none"
      },
      responsive: {
        desktop: 3,
        tablet: 2,
        mobile: 1,
        desktopGap: "2rem",
        tabletGap: "1.5rem",
        mobileGap: "1rem",
        mobileStackIcons: false,
        mobileHideIcons: false,
        mobileCardStyle: "full"
      },
      showTitle: true,
      showSubtitle: true,
      showDescriptions: true,
      showIcons: true,
      showLinks: false
    }

    const { error: featuresError } = await supabase
      .from('block_types')
      .update({ default_content: featuresContent })
      .eq('id', 'features')

    if (featuresError) {
      console.log(`   ❌ Features update error: ${featuresError.message}`)
      errorCount++
    } else {
      console.log(`   ✅ Features block updated`)
      successCount++
    }

    // Update Pricing block
    console.log('📝 Updating Pricing block...')
    const pricingContent = {
      layout: "grid",
      maxWidth: "xl",
      header: {
        title: "Unsere Headspa-Pakete",
        subtitle: "Wähle das perfekte Paket für dich",
        description: "",
        alignment: "center",
        titleFontSize: "2.5rem",
        titleFontWeight: "700",
        titleColor: "#2C2C2C",
        subtitleFontSize: "1.125rem",
        subtitleColor: "#666666"
      },
      title: "Unsere Headspa-Pakete",
      subtitle: "Wähle das perfekte Paket für dich",
      tabs: {
        enabled: true,
        defaultTab: "einzeltermin",
        labels: {
          einzeltermin: "Einzeltermin",
          partnertermin: "Partnertermin"
        },
        style: "tabs"
      },
      packages: [
        {
          id: "pkg-1",
          name: "Basic",
          price: "€89",
          period: "",
          billingCycle: "monthly",
          subtitle: "Perfekt für den Einstieg",
          description: "Ideal für alle, die Headspa zum ersten Mal erleben möchten.",
          features: [
            "60 Minuten Headspa-Behandlung",
            "Kopfhautanalyse",
            "Reinigung & Peeling",
            "Entspannende Massage",
            "Pflegende Maske"
          ],
          highlighted: false,
          popular: false,
          recommended: false,
          isPartner: false,
          ctaText: "Jetzt buchen",
          ctaLink: "#contact",
          style: {
            backgroundColor: "#ffffff",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            borderRadius: "1rem",
            shadowSize: "md",
            hoverEffect: "lift",
            headerBackgroundColor: "transparent",
            headerTextColor: "#2C2C2C",
            priceColor: "#9CAF88",
            priceFontSize: "3rem",
            periodColor: "#666666",
            featureTextColor: "#666666",
            featureIconColor: "#9CAF88",
            checkmarkColor: "#9CAF88"
          }
        },
        {
          id: "pkg-2",
          name: "Beauty",
          price: "€159",
          period: "",
          billingCycle: "monthly",
          subtitle: "Unser Bestseller",
          description: "Die perfekte Balance aus Entspannung und intensiver Pflege.",
          features: [
            "90 Minuten Headspa-Behandlung",
            "Detaillierte Kopfhautanalyse",
            "Tiefenreinigung & Peeling",
            "Intensive Massage",
            "Nährstoffreiche Maske",
            "Haarstyling"
          ],
          highlighted: true,
          popular: true,
          recommended: false,
          isPartner: false,
          badge: {
            enabled: true,
            text: "Bestseller",
            backgroundColor: "#9CAF88",
            textColor: "#ffffff",
            position: "top-center",
            animation: "pulse"
          },
          ctaText: "Jetzt buchen",
          ctaLink: "#contact",
          style: {
            backgroundColor: "#ffffff",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            borderRadius: "1rem",
            shadowSize: "md",
            hoverEffect: "lift",
            headerBackgroundColor: "transparent",
            headerTextColor: "#2C2C2C",
            priceColor: "#9CAF88",
            priceFontSize: "3rem",
            periodColor: "#666666",
            featureTextColor: "#666666",
            featureIconColor: "#9CAF88",
            checkmarkColor: "#9CAF88"
          }
        },
        {
          id: "pkg-3",
          name: "Premium",
          price: "€229",
          period: "",
          billingCycle: "monthly",
          subtitle: "Das ultimative Erlebnis",
          description: "Die luxuriöseste Headspa-Erfahrung mit allen Extras.",
          features: [
            "120 Minuten Headspa-Behandlung",
            "Umfassende Kopfhautanalyse",
            "Premium Reinigung & Peeling",
            "Luxus-Massage",
            "Premium Maske & Behandlung",
            "Haarstyling & Finishing",
            "Wellness-Getränk inklusive"
          ],
          highlighted: false,
          popular: false,
          recommended: false,
          isPartner: false,
          ctaText: "Jetzt buchen",
          ctaLink: "#contact",
          style: {
            backgroundColor: "#ffffff",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            borderRadius: "1rem",
            shadowSize: "md",
            hoverEffect: "lift",
            headerBackgroundColor: "transparent",
            headerTextColor: "#2C2C2C",
            priceColor: "#9CAF88",
            priceFontSize: "3rem",
            periodColor: "#666666",
            featureTextColor: "#666666",
            featureIconColor: "#9CAF88",
            checkmarkColor: "#9CAF88"
          }
        },
        {
          id: "pkg-4",
          name: "Basic",
          price: "€159",
          period: "",
          billingCycle: "monthly",
          subtitle: "Partnertermin",
          description: "Genieße die Basic-Behandlung zu zweit.",
          features: [
            "2x 60 Minuten Headspa-Behandlung",
            "Kopfhautanalyse für beide",
            "Reinigung & Peeling",
            "Entspannende Massage",
            "Pflegende Maske"
          ],
          highlighted: false,
          popular: false,
          recommended: false,
          isPartner: true,
          partnerLabel: "2x",
          ctaText: "Jetzt buchen",
          ctaLink: "#contact",
          style: {
            backgroundColor: "#ffffff",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            borderRadius: "1rem",
            shadowSize: "md",
            hoverEffect: "lift",
            headerBackgroundColor: "transparent",
            headerTextColor: "#2C2C2C",
            priceColor: "#9CAF88",
            priceFontSize: "3rem",
            periodColor: "#666666",
            featureTextColor: "#666666",
            featureIconColor: "#9CAF88",
            checkmarkColor: "#9CAF88"
          }
        },
        {
          id: "pkg-5",
          name: "Beauty",
          price: "€289",
          period: "",
          billingCycle: "monthly",
          subtitle: "Partnertermin",
          description: "Das Beauty-Erlebnis zu zweit genießen.",
          features: [
            "2x 90 Minuten Headspa-Behandlung",
            "Detaillierte Kopfhautanalyse",
            "Tiefenreinigung & Peeling",
            "Intensive Massage",
            "Nährstoffreiche Maske",
            "Haarstyling"
          ],
          highlighted: false,
          popular: false,
          recommended: false,
          isPartner: true,
          partnerLabel: "2x",
          ctaText: "Jetzt buchen",
          ctaLink: "#contact",
          style: {
            backgroundColor: "#ffffff",
            borderColor: "#e2e8f0",
            borderWidth: 1,
            borderRadius: "1rem",
            shadowSize: "md",
            hoverEffect: "lift",
            headerBackgroundColor: "transparent",
            headerTextColor: "#2C2C2C",
            priceColor: "#9CAF88",
            priceFontSize: "3rem",
            periodColor: "#666666",
            featureTextColor: "#666666",
            featureIconColor: "#9CAF88",
            checkmarkColor: "#9CAF88"
          }
        }
      ],
      tabs: {
        enabled: true,
        defaultTab: "einzeltermin",
        labels: {
          einzeltermin: "Einzeltermin",
          partnertermin: "Partnertermin"
        },
        style: "tabs"
      },
      billingToggle: {
        enabled: false,
        options: [
          { id: "monthly", label: "Aylık" },
          { id: "yearly", label: "Yıllık", discount: "%20 Tasarruf" }
        ],
        defaultOption: "monthly",
        style: "pills",
        backgroundColor: "#f1f5f9",
        activeBackgroundColor: "#9CAF88",
        textColor: "#64748b",
        activeTextColor: "#ffffff"
      },
      background: {
        type: "solid",
        color: "#ffffff"
      },
      padding: {
        top: "4rem",
        bottom: "4rem"
      },
      packageGap: "2rem",
      animations: {
        enabled: true,
        headerAnimation: "fade",
        packageAnimation: "slide-up",
        staggerDelay: 100,
        duration: 500,
        triggerOnScroll: true
      },
      responsive: {
        desktop: {
          columns: 3,
          gap: "2rem",
          padding: "4rem"
        },
        tablet: {
          columns: 2,
          gap: "1.5rem",
          padding: "3rem"
        },
        mobile: {
          columns: 1,
          gap: "1rem",
          padding: "2rem",
          stackPackages: true
        }
      },
      trustElement: {
        enabled: false,
        type: "money-back",
        text: "30 Gün Para İade Garantisi",
        icon: "🛡️",
        duration: "30 gün",
        position: "below-packages"
      },
      defaultPackageStyle: {
        backgroundColor: "#ffffff",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        borderRadius: "1rem",
        shadowSize: "md",
        hoverEffect: "lift",
        headerBackgroundColor: "transparent",
        headerTextColor: "#2C2C2C",
        priceColor: "#9CAF88",
        priceFontSize: "3rem",
        periodColor: "#666666",
        featureTextColor: "#666666",
        featureIconColor: "#9CAF88",
        checkmarkColor: "#9CAF88"
      }
    }

    const { error: pricingError } = await supabase
      .from('block_types')
      .update({ default_content: pricingContent })
      .eq('id', 'pricing')

    if (pricingError) {
      console.log(`   ❌ Pricing update error: ${pricingError.message}`)
      errorCount++
    } else {
      console.log(`   ✅ Pricing block updated`)
      successCount++
    }

    // Update Testimonials block
    console.log('📝 Updating Testimonials block...')
    const testimonialsContent = {
      title: "Was unsere Kunden sagen",
      layout: "grid",
      testimonials: [
        {
          id: "testimonial-1",
          name: "Sarah M.",
          role: "",
          company: "",
          content: "Die Headspa-Behandlung war absolut entspannend! Ich habe mich wie neu geboren gefühlt. Die Kopfhautpflege ist intensiv und die Massage einfach himmlisch. Kann ich nur weiterempfehlen!",
          rating: 5,
          readMoreLink: {
            enabled: true,
            text: "Weiter lesen",
            url: "#testimonial-1"
          }
        },
        {
          id: "testimonial-2",
          name: "Michael K.",
          role: "",
          company: "",
          content: "Als Mann war ich zunächst skeptisch, aber die Behandlung hat mich überzeugt. Meine Kopfhaut fühlt sich viel gesünder an und die Entspannung war genau das, was ich nach einem stressigen Tag brauchte.",
          rating: 5,
          readMoreLink: {
            enabled: true,
            text: "Weiter lesen",
            url: "#testimonial-2"
          }
        },
        {
          id: "testimonial-3",
          name: "Lisa T.",
          role: "",
          company: "",
          content: "Das Premium-Paket ist jeden Cent wert! Die Behandlung dauert lange genug, um wirklich abzuschalten, und die Ergebnisse sind bereits nach der ersten Sitzung sichtbar. Meine Haare sehen gesünder aus.",
          rating: 5,
          readMoreLink: {
            enabled: true,
            text: "Weiter lesen",
            url: "#testimonial-3"
          }
        },
        {
          id: "testimonial-4",
          name: "Anna B.",
          role: "",
          company: "",
          content: "Ich war mit meiner Freundin beim Partnertermin. Es war ein wundervolles gemeinsames Erlebnis! Die Atmosphäre ist sehr entspannend und das Personal sehr professionell.",
          rating: 5,
          readMoreLink: {
            enabled: true,
            text: "Weiter lesen",
            url: "#testimonial-4"
          }
        }
      ]
    }

    const { error: testimonialsError } = await supabase
      .from('block_types')
      .update({ default_content: testimonialsContent })
      .eq('id', 'testimonials')

    if (testimonialsError) {
      console.log(`   ❌ Testimonials update error: ${testimonialsError.message}`)
      errorCount++
    } else {
      console.log(`   ✅ Testimonials block updated`)
      successCount++
    }

    console.log(`\n✅ Migration completed!`)
    console.log(`   Success: ${successCount}`)
    console.log(`   Errors: ${errorCount}`)
    
    if (errorCount === 0) {
      console.log(`\n🎉 All example content has been loaded!`)
      console.log(`   Now when you create new blocks in admin panel, they will have Headspa content.`)
    } else {
      console.log(`\n⚠️  Some updates failed. You may need to run the migration manually via Supabase SQL Editor.`)
      console.log(`   File: supabase/migrations/015_headspa_example_content.sql`)
    }

  } catch (error) {
    console.error('❌ Migration failed:', error)
    console.error('\n💡 Alternative: Run the migration manually via Supabase SQL Editor:')
    console.error('   1. Go to Supabase Dashboard > SQL Editor')
    console.error('   2. Open: supabase/migrations/015_headspa_example_content.sql')
    console.error('   3. Copy and paste the content')
    console.error('   4. Click Run')
    process.exit(1)
  }
}

runMigration()

