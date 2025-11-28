'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

// Template Engine imports
import { templateEngine } from '@/lib/template-engine'
import { TemplateConfig } from '@/types/templates'

// Contact content interface
interface ContactContent {
  businessName: string
  phone: string
  email: string
  address: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  openingHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
}

const defaultContactContent: ContactContent = {
  businessName: 'Wellnesstal',
  phone: '+49 221 12345678',
  email: 'info@wellnesstal.de',
  address: {
    street: 'Musterstraße 123',
    city: 'Köln',
    postalCode: '50667',
    country: 'Deutschland'
  },
  openingHours: {
    monday: { open: '09:00', close: '19:00', closed: false },
    tuesday: { open: '09:00', close: '19:00', closed: false },
    wednesday: { open: '09:00', close: '19:00', closed: false },
    thursday: { open: '09:00', close: '19:00', closed: false },
    friday: { open: '09:00', close: '19:00', closed: false },
    saturday: { open: '10:00', close: '16:00', closed: false },
    sunday: { open: '', close: '', closed: true }
  }
}

// About content interface
interface AboutTextStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
}

interface AboutStyles {
  badge?: AboutTextStyle
  title?: AboutTextStyle
  highlightedText?: AboutTextStyle
  description?: AboutTextStyle
  statsValue?: AboutTextStyle
  statsLabel?: AboutTextStyle
  primaryButton?: AboutTextStyle
  secondaryButton?: AboutTextStyle
}

interface AboutImage {
  url: string
  alt: string
}

interface AboutContent {
  badge: string
  title: string
  description: string
  stats: Array<{ label: string; value: string }>
  primaryButton: string
  primaryButtonLink: string
  secondaryButton: string
  secondaryButtonLink: string
  images: AboutImage[]
  styles?: AboutStyles
}

// About section default styles - Tailwind config'den exact renkler
const defaultAboutStyles: AboutStyles = {
  badge: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '500',
    color: '#637554',      // sage-700
    backgroundColor: '#eef1ea'  // sage-100
  },
  title: {
    fontFamily: 'system-ui',
    fontSize: '48px',
    fontWeight: '700',
    color: '#2C2C2C'       // charcoal
  },
  highlightedText: {
    fontFamily: 'system-ui',
    fontSize: '48px',
    fontWeight: '700',
    color: '#9CAF88'       // sage-500
  },
  description: {
    fontFamily: 'system-ui',
    fontSize: '20px',
    fontWeight: '400',
    color: '#666666'       // gray-custom
  },
  statsValue: {
    fontFamily: 'system-ui',
    fontSize: '30px',
    fontWeight: '700',
    color: '#9CAF88'       // sage-500
  },
  statsLabel: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#666666'       // gray-custom
  },
  primaryButton: {
    fontFamily: 'system-ui',
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#9CAF88'  // sage-500
  },
  secondaryButton: {
    fontFamily: 'system-ui',
    fontSize: '18px',
    fontWeight: '600',
    color: '#9CAF88',      // sage-500
    borderColor: '#9CAF88' // sage-500
  }
}

const defaultAboutContent: AboutContent = {
  badge: 'Über Wellnesstal Studio',
  title: 'Ihre Wellness-Oase im Herzen von Baesweiler',
  description: 'Seit über 5 Jahren widmen wir uns mit Leidenschaft Ihrem Wohlbefinden. Unser erfahrenes Team aus zertifizierten Wellness-Therapeuten bietet Ihnen individuelle Behandlungen in entspannter Atmosphäre.',
  stats: [
    { label: 'Zufriedene Kunden', value: '500+' },
    { label: 'Jahre Erfahrung', value: '5+' }
  ],
  primaryButton: 'Persönliche Beratung',
  primaryButtonLink: 'tel:+491733828581',
  secondaryButton: 'Mehr erfahren',
  secondaryButtonLink: '#contact',
  images: [
    { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Wellness Studio Innenbereich' },
    { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Entspannende Behandlung' },
    { url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Wellness Produkte' },
    { url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Entspannte Kundin' }
  ],
  styles: defaultAboutStyles
}

// Meta content interface
interface MetaContent {
  siteTitle: string
  siteDescription: string
  keywords: string
  ogImage: string
}

const defaultMetaContent: MetaContent = {
  siteTitle: 'Wellnesstal - Premium Wellness & Headspa in Köln',
  siteDescription: 'Entspannung und Wellness in Köln. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden. Jetzt Termin vereinbaren!',
  keywords: 'wellness, headspa, massage, köln, entspannung, aromatherapie',
  ogImage: '/images/og-wellnesstal.jpg'
}

// Landing Hero content interface
interface TextStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
}

interface LandingHeroStyles {
  badge?: TextStyle
  mainTitle?: TextStyle
  highlightedText?: TextStyle
  description?: TextStyle
  primaryButton?: TextStyle
  secondaryButton?: TextStyle
}

interface LandingHeroContent {
  badge: string
  mainTitle: string
  highlightedText: string
  description: string
  primaryButton: string
  primaryButtonLink: string
  secondaryButton: string
  secondaryButtonLink: string
  styles?: LandingHeroStyles
}

// HeroSection ile AYNI renkler - Tailwind config'den
const defaultLandingHeroStyles: LandingHeroStyles = {
  badge: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '500',
    color: '#637554',      // sage-700
    backgroundColor: '#eef1ea'  // sage-100
  },
  mainTitle: {
    fontFamily: 'system-ui',
    fontSize: '72px',
    fontWeight: '700',
    color: '#2C2C2C'       // charcoal
  },
  highlightedText: {
    fontFamily: 'system-ui',
    fontSize: '72px',
    fontWeight: '700',
    color: '#9CAF88'       // sage-500
  },
  description: {
    fontFamily: 'system-ui',
    fontSize: '24px',
    fontWeight: '400',
    color: '#666666'       // gray-custom
  },
  primaryButton: {
    fontFamily: 'system-ui',
    fontSize: '18px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#9CAF88'  // sage-500
  },
  secondaryButton: {
    fontFamily: 'system-ui',
    fontSize: '18px',
    fontWeight: '600',
    color: '#9CAF88',      // sage-500
    borderColor: '#9CAF88' // sage-500
  }
}

const defaultLandingHeroContent: LandingHeroContent = {
  badge: 'Wellnesstal Studio',
  mainTitle: 'Ihre Wellness-Oase für',
  highlightedText: 'Körper & Seele',
  description: 'Entdecken Sie unsere exklusiven Wellness-Behandlungen und finden Sie Ihre innere Balance in entspannter Atmosphäre.',
  primaryButton: 'Services entdecken',
  primaryButtonLink: '#services',
  secondaryButton: 'Termin buchen',
  secondaryButtonLink: '#contact',
  styles: defaultLandingHeroStyles
}

// Contact Section Styles Interface
interface ContactSectionTextStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
}

interface ContactSectionStyles {
  badge?: ContactSectionTextStyle
  sectionTitle?: ContactSectionTextStyle
  highlightedText?: ContactSectionTextStyle
  description?: ContactSectionTextStyle
  // Individual card styles
  phoneCardTitle?: ContactSectionTextStyle
  phoneCardDescription?: ContactSectionTextStyle
  whatsappCardTitle?: ContactSectionTextStyle
  whatsappCardDescription?: ContactSectionTextStyle
  whatsappCardLink?: ContactSectionTextStyle
  emailCardTitle?: ContactSectionTextStyle
  emailCardDescription?: ContactSectionTextStyle
  // Individual icon styles for each card
  phoneCardIcon?: { backgroundColor?: string; iconColor?: string }
  whatsappCardIcon?: { backgroundColor?: string; iconColor?: string }
  emailCardIcon?: { backgroundColor?: string; iconColor?: string }
  cardIcon?: { backgroundColor?: string }  // Legacy - kept for backward compatibility
  mapTitle?: ContactSectionTextStyle
  mapAddress?: ContactSectionTextStyle
  mapButton?: ContactSectionTextStyle
  openingHoursTitle?: ContactSectionTextStyle
  dayLabel?: ContactSectionTextStyle
  timeLabel?: ContactSectionTextStyle
  todayBadge?: ContactSectionTextStyle
  todayHighlight?: { backgroundColor?: string; borderColor?: string }
}

interface ContactSectionContent {
  badge: string
  sectionTitle: string
  highlightedText: string
  description: string
  cards: {
    phone: { title: string; description: string }
    whatsapp: { title: string; description: string; linkText: string }
    email: { title: string; description: string }
  }
  map: { buttonText: string }
  openingHours: { title: string; todayLabel: string; closedLabel: string }
  styles?: ContactSectionStyles
}

// Contact Section default styles - HeroSection ile aynı renkler
const defaultContactSectionStyles: ContactSectionStyles = {
  badge: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '500',
    color: '#637554',
    backgroundColor: '#eef1ea'
  },
  sectionTitle: {
    fontFamily: 'system-ui',
    fontSize: '48px',
    fontWeight: '700',
    color: '#2C2C2C'
  },
  highlightedText: {
    fontFamily: 'system-ui',
    fontSize: '48px',
    fontWeight: '700',
    color: '#9CAF88'
  },
  description: {
    fontFamily: 'system-ui',
    fontSize: '20px',
    fontWeight: '400',
    color: '#666666'
  },
  phoneCardTitle: {
    fontFamily: 'system-ui',
    fontSize: '20px',
    fontWeight: '600',
    color: '#2C2C2C'
  },
  phoneCardDescription: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#666666'
  },
  whatsappCardTitle: {
    fontFamily: 'system-ui',
    fontSize: '20px',
    fontWeight: '600',
    color: '#2C2C2C'
  },
  whatsappCardDescription: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#666666'
  },
  whatsappCardLink: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '600',
    color: '#9CAF88'
  },
  emailCardTitle: {
    fontFamily: 'system-ui',
    fontSize: '20px',
    fontWeight: '600',
    color: '#2C2C2C'
  },
  emailCardDescription: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#666666'
  },
  // Individual icon styles for each card
  phoneCardIcon: {
    backgroundColor: '#9CAF88',
    iconColor: '#FFFFFF'
  },
  whatsappCardIcon: {
    backgroundColor: '#25D366',
    iconColor: '#FFFFFF'
  },
  emailCardIcon: {
    backgroundColor: '#9CAF88',
    iconColor: '#FFFFFF'
  },
  cardIcon: {
    backgroundColor: '#9CAF88'
  },
  mapTitle: {
    fontFamily: 'system-ui',
    fontSize: '20px',
    fontWeight: '600',
    color: '#2C2C2C'
  },
  mapAddress: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#666666'
  },
  mapButton: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '500',
    color: '#FFFFFF',
    backgroundColor: '#9CAF88'
  },
  openingHoursTitle: {
    fontFamily: 'system-ui',
    fontSize: '20px',
    fontWeight: '600',
    color: '#2C2C2C'
  },
  dayLabel: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '500',
    color: '#2C2C2C'
  },
  timeLabel: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#666666'
  },
  todayBadge: {
    fontFamily: 'system-ui',
    fontSize: '12px',
    fontWeight: '500',
    color: '#FFFFFF',
    backgroundColor: '#9CAF88'
  },
  todayHighlight: {
    backgroundColor: '#eef1ea',
    borderColor: '#d4ddd0'
  }
}

const defaultContactSectionContent: ContactSectionContent = {
  badge: '📞 Kontakt',
  sectionTitle: 'Bereit für Ihre',
  highlightedText: 'Auszeit',
  description: 'Vereinbaren Sie noch heute Ihren Termin oder lassen Sie sich unverbindlich beraten.',
  cards: {
    phone: {
      title: 'Telefonisch',
      description: 'Rufen Sie uns direkt an für eine schnelle Terminbuchung'
    },
    whatsapp: {
      title: 'WhatsApp',
      description: 'Schreiben Sie uns eine Nachricht - wir antworten schnell',
      linkText: 'Nachricht senden'
    },
    email: {
      title: 'E-Mail',
      description: 'Senden Sie uns Ihre Anfrage per E-Mail'
    }
  },
  map: { buttonText: 'In Google Maps öffnen' },
  openingHours: { title: 'Öffnungszeiten', todayLabel: 'Heute', closedLabel: 'Geschlossen' },
  styles: defaultContactSectionStyles
}

export default function Home() {
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig | null>(null)
  const [templateLoading, setTemplateLoading] = useState(true)
  const [contactContent, setContactContent] = useState<ContactContent>(defaultContactContent)
  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAboutContent)
  const [metaContent, setMetaContent] = useState<MetaContent>(defaultMetaContent)
  const [aboutLoading, setAboutLoading] = useState(true)
  const [contactLoading, setContactLoading] = useState(true)
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>('')
  const [landingHeroContent, setLandingHeroContent] = useState<LandingHeroContent>(defaultLandingHeroContent)
  const [landingHeroLoading, setLandingHeroLoading] = useState(true)
  const [primaryBtnHover, setPrimaryBtnHover] = useState(false)
  const [secondaryBtnHover, setSecondaryBtnHover] = useState(false)
  const [aboutPrimaryBtnHover, setAboutPrimaryBtnHover] = useState(false)
  const [aboutSecondaryBtnHover, setAboutSecondaryBtnHover] = useState(false)
  const [contactSectionContent, setContactSectionContent] = useState<ContactSectionContent>(defaultContactSectionContent)
  const [contactSectionLoading, setContactSectionLoading] = useState(true)

  // Initialize Template Engine
  useEffect(() => {
    const initializeTemplate = async () => {
      try {
        // Same wellness config as in services page
        const config: TemplateConfig = {
          id: "wellness-basic",
          name: "Wellness & Spa Management",
          industry: "wellness" as const,
          version: "1.0.0",
          description: "Complete wellness and spa management system",
          
          entities: {
            primary: {
              name: "Services",
              singular: "Service",
              plural: "Services",
              icon: "Sparkles",
              color: "#10B981",
              fields: [
                {
                  key: "name",
                  label: "Service Name",
                  type: "text" as const,
                  required: true,
                  order: 1
                },
                {
                  key: "description",
                  label: "Description", 
                  type: "textarea" as const,
                  required: false,
                  order: 2
                },
                {
                  key: "price",
                  label: "Price",
                  type: "currency" as const,
                  required: true,
                  order: 3
                },
                {
                  key: "duration",
                  label: "Duration (minutes)",
                  type: "number" as const,
                  required: true,
                  order: 4
                }
              ],
              permissions: {
                create: true,
                read: true,
                update: true,
                delete: true,
                bulk: true
              }
            }
          },
          
          ui: {
            theme: {
              primaryColor: "#10B981",
              secondaryColor: "#6B7280",
              accentColor: "#8B5CF6",
              fontFamily: "Inter, sans-serif",
              fontSize: {
                sm: "0.875rem",
                base: "1rem",
                lg: "1.125rem", 
                xl: "1.25rem"
              },
              borderRadius: "0.75rem",
              spacing: "comfortable" as const,
              darkMode: false,
              brandName: "Wellnesstal Studio"
            },
            components: {},
            layout: {
              sidebar: {
                position: "left" as const,
                collapsible: true,
                defaultCollapsed: false
              },
              navigation: {
                style: "sidebar" as const,
                items: []
              },
              dashboard: {
                widgets: [],
                layout: "grid" as const
              }
            }
          },
          
          business: {
            workflows: [],
            validations: {},
            automations: []
          },
          
          features: {
            enabled: ["crud", "search", "filters", "bulk-actions", "online-booking", "customer-portal"],
            disabled: []
          }
        }
        
        templateEngine.registerTemplate(config as any)
        templateEngine.setActiveTemplate('wellness-basic')
        setTemplateConfig(config)
        
      } catch (err) {
        console.error('Frontend template initialization failed:', err)
      } finally {
        setTemplateLoading(false)
      }
    }
    
    initializeTemplate()
  }, [])

  // Fetch contact content from API
  useEffect(() => {
    const fetchContactContent = async () => {
      try {
        const response = await fetch('/api/content?section=contact')
        const data = await response.json()
        if (data.success && data.data?.content) {
          setContactContent({
            ...defaultContactContent,
            ...data.data.content
          })
        }
      } catch (error) {
        console.error('Failed to fetch contact content:', error)
      } finally {
        setContactLoading(false)
      }
    }

    fetchContactContent()
  }, [])

  // Fetch about content from API
  useEffect(() => {
    const fetchAboutContent = async () => {
      try {
        const response = await fetch('/api/content?section=about')
        const data = await response.json()
        if (data.success && data.data?.content) {
          const apiContent = data.data.content
          setAboutContent({
            ...defaultAboutContent,
            ...apiContent,
            // Ensure images array exists
            images: apiContent.images || defaultAboutContent.images,
            // Deep merge styles
            styles: {
              ...defaultAboutStyles,
              ...apiContent.styles,
              badge: { ...defaultAboutStyles.badge, ...apiContent.styles?.badge },
              title: { ...defaultAboutStyles.title, ...apiContent.styles?.title },
              highlightedText: { ...defaultAboutStyles.highlightedText, ...apiContent.styles?.highlightedText },
              description: { ...defaultAboutStyles.description, ...apiContent.styles?.description },
              statsValue: { ...defaultAboutStyles.statsValue, ...apiContent.styles?.statsValue },
              statsLabel: { ...defaultAboutStyles.statsLabel, ...apiContent.styles?.statsLabel },
              primaryButton: { ...defaultAboutStyles.primaryButton, ...apiContent.styles?.primaryButton },
              secondaryButton: { ...defaultAboutStyles.secondaryButton, ...apiContent.styles?.secondaryButton },
            }
          })
        }
      } catch (error) {
        console.error('Failed to fetch about content:', error)
      } finally {
        setAboutLoading(false)
      }
    }

    fetchAboutContent()
  }, [])

  // Fetch meta content from API and update document title
  useEffect(() => {
    const fetchMetaContent = async () => {
      try {
        const response = await fetch('/api/content?section=meta')
        const data = await response.json()
        if (data.success && data.data?.content) {
          const meta = {
            ...defaultMetaContent,
            ...data.data.content
          }
          setMetaContent(meta)
          // Update document title dynamically
          document.title = meta.siteTitle
        }
      } catch (error) {
        console.error('Failed to fetch meta content:', error)
      }
    }

    fetchMetaContent()
  }, [])

  // Fetch contact-settings for Google Maps URL
  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        const response = await fetch('/api/content?section=contact-settings')
        const data = await response.json()
        if (data.success && data.data?.content?.address?.googleMapsUrl) {
          setGoogleMapsUrl(data.data.content.address.googleMapsUrl)
        }
      } catch (error) {
        console.error('Failed to fetch contact settings:', error)
      }
    }

    fetchContactSettings()
  }, [])

  // Fetch landing-hero content from API
  useEffect(() => {
    const fetchLandingHeroContent = async () => {
      try {
        const response = await fetch('/api/content?section=landing-hero')
        const data = await response.json()
        if (data.success && data.data?.content) {
          const apiContent = data.data.content
          setLandingHeroContent({
            ...defaultLandingHeroContent,
            ...apiContent,
            // Deep merge styles
            styles: {
              ...defaultLandingHeroStyles,
              ...apiContent.styles,
              badge: { ...defaultLandingHeroStyles.badge, ...apiContent.styles?.badge },
              mainTitle: { ...defaultLandingHeroStyles.mainTitle, ...apiContent.styles?.mainTitle },
              highlightedText: { ...defaultLandingHeroStyles.highlightedText, ...apiContent.styles?.highlightedText },
              description: { ...defaultLandingHeroStyles.description, ...apiContent.styles?.description },
              primaryButton: { ...defaultLandingHeroStyles.primaryButton, ...apiContent.styles?.primaryButton },
              secondaryButton: { ...defaultLandingHeroStyles.secondaryButton, ...apiContent.styles?.secondaryButton },
            }
          })
        }
      } catch (error) {
        console.error('Failed to fetch landing hero content:', error)
      } finally {
        setLandingHeroLoading(false)
      }
    }

    fetchLandingHeroContent()
  }, [])

  // Fetch contact-section content from API
  useEffect(() => {
    const fetchContactSectionContent = async () => {
      try {
        const response = await fetch('/api/content?section=contact-section')
        const data = await response.json()
        if (data.success && data.data?.content) {
          const apiContent = data.data.content
          setContactSectionContent({
            ...defaultContactSectionContent,
            ...apiContent,
            // Deep merge cards
            cards: {
              ...defaultContactSectionContent.cards,
              ...apiContent.cards,
              phone: { ...defaultContactSectionContent.cards.phone, ...apiContent.cards?.phone },
              whatsapp: { ...defaultContactSectionContent.cards.whatsapp, ...apiContent.cards?.whatsapp },
              email: { ...defaultContactSectionContent.cards.email, ...apiContent.cards?.email },
            },
            // Deep merge map
            map: { ...defaultContactSectionContent.map, ...apiContent.map },
            // Deep merge openingHours
            openingHours: { ...defaultContactSectionContent.openingHours, ...apiContent.openingHours },
            // Deep merge styles
            styles: {
              ...defaultContactSectionStyles,
              ...apiContent.styles,
              badge: { ...defaultContactSectionStyles.badge, ...apiContent.styles?.badge },
              sectionTitle: { ...defaultContactSectionStyles.sectionTitle, ...apiContent.styles?.sectionTitle },
              highlightedText: { ...defaultContactSectionStyles.highlightedText, ...apiContent.styles?.highlightedText },
              description: { ...defaultContactSectionStyles.description, ...apiContent.styles?.description },
              phoneCardTitle: { ...defaultContactSectionStyles.phoneCardTitle, ...apiContent.styles?.phoneCardTitle },
              phoneCardDescription: { ...defaultContactSectionStyles.phoneCardDescription, ...apiContent.styles?.phoneCardDescription },
              whatsappCardTitle: { ...defaultContactSectionStyles.whatsappCardTitle, ...apiContent.styles?.whatsappCardTitle },
              whatsappCardDescription: { ...defaultContactSectionStyles.whatsappCardDescription, ...apiContent.styles?.whatsappCardDescription },
              whatsappCardLink: { ...defaultContactSectionStyles.whatsappCardLink, ...apiContent.styles?.whatsappCardLink },
              emailCardTitle: { ...defaultContactSectionStyles.emailCardTitle, ...apiContent.styles?.emailCardTitle },
              emailCardDescription: { ...defaultContactSectionStyles.emailCardDescription, ...apiContent.styles?.emailCardDescription },
              // Individual icon styles
              phoneCardIcon: { ...defaultContactSectionStyles.phoneCardIcon, ...apiContent.styles?.phoneCardIcon },
              whatsappCardIcon: { ...defaultContactSectionStyles.whatsappCardIcon, ...apiContent.styles?.whatsappCardIcon },
              emailCardIcon: { ...defaultContactSectionStyles.emailCardIcon, ...apiContent.styles?.emailCardIcon },
              cardIcon: { ...defaultContactSectionStyles.cardIcon, ...apiContent.styles?.cardIcon },
              mapTitle: { ...defaultContactSectionStyles.mapTitle, ...apiContent.styles?.mapTitle },
              mapAddress: { ...defaultContactSectionStyles.mapAddress, ...apiContent.styles?.mapAddress },
              mapButton: { ...defaultContactSectionStyles.mapButton, ...apiContent.styles?.mapButton },
              openingHoursTitle: { ...defaultContactSectionStyles.openingHoursTitle, ...apiContent.styles?.openingHoursTitle },
              dayLabel: { ...defaultContactSectionStyles.dayLabel, ...apiContent.styles?.dayLabel },
              timeLabel: { ...defaultContactSectionStyles.timeLabel, ...apiContent.styles?.timeLabel },
              todayBadge: { ...defaultContactSectionStyles.todayBadge, ...apiContent.styles?.todayBadge },
              todayHighlight: { ...defaultContactSectionStyles.todayHighlight, ...apiContent.styles?.todayHighlight },
            }
          })
        }
      } catch (error) {
        console.error('Failed to fetch contact section content:', error)
      } finally {
        setContactSectionLoading(false)
      }
    }

    fetchContactSectionContent()
  }, [])

  // Template-driven theme variables
  const themeVars = templateConfig?.ui.theme ? {
    '--primary-color': templateConfig.ui.theme.primaryColor,
    '--secondary-color': templateConfig.ui.theme.secondaryColor,
    '--accent-color': templateConfig.ui.theme.accentColor,
    '--brand-name': templateConfig.ui.theme.brandName || 'Wellnesstal Studio'
  } : {}

  return (
    <div className="min-h-screen bg-cream" style={themeVars as any}>
      {templateLoading && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Template wird geladen...
        </div>
      )}

      {/* Header */}
      <Header />

      {/* Main Content */}
      <main>
        {/* Hero Section - Template Enhanced */}
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {landingHeroLoading ? (
              <div className="text-center animate-pulse">
                <div className="h-8 bg-sage-200 rounded-full w-48 mx-auto mb-6"></div>
                <div className="h-16 bg-sage-200 rounded w-3/4 mx-auto mb-4"></div>
                <div className="h-16 bg-sage-300 rounded w-1/2 mx-auto mb-8"></div>
                <div className="h-6 bg-sage-200 rounded w-2/3 mx-auto mb-12"></div>
                <div className="flex justify-center gap-6 mb-16">
                  <div className="h-14 bg-sage-300 rounded-xl w-48"></div>
                  <div className="h-14 bg-sage-200 rounded-xl w-40"></div>
                </div>
              </div>
            ) : (
              <div className="text-center">
                {/* Badge with dynamic styles */}
                <div
                  className="inline-block px-4 py-2 rounded-full mb-6"
                  style={{
                    fontFamily: landingHeroContent.styles?.badge?.fontFamily || defaultLandingHeroStyles.badge?.fontFamily,
                    fontSize: landingHeroContent.styles?.badge?.fontSize || defaultLandingHeroStyles.badge?.fontSize,
                    fontWeight: landingHeroContent.styles?.badge?.fontWeight || defaultLandingHeroStyles.badge?.fontWeight,
                    color: landingHeroContent.styles?.badge?.color || defaultLandingHeroStyles.badge?.color,
                    backgroundColor: landingHeroContent.styles?.badge?.backgroundColor || defaultLandingHeroStyles.badge?.backgroundColor,
                  }}
                >
                  ✨ {landingHeroContent.badge}
                </div>

                {/* Main Title with dynamic styles */}
                <h1 className="mb-8 leading-tight">
                  <span
                    style={{
                      fontFamily: landingHeroContent.styles?.mainTitle?.fontFamily || defaultLandingHeroStyles.mainTitle?.fontFamily,
                      fontSize: landingHeroContent.styles?.mainTitle?.fontSize || defaultLandingHeroStyles.mainTitle?.fontSize,
                      fontWeight: landingHeroContent.styles?.mainTitle?.fontWeight || defaultLandingHeroStyles.mainTitle?.fontWeight,
                      color: landingHeroContent.styles?.mainTitle?.color || defaultLandingHeroStyles.mainTitle?.color,
                    }}
                  >
                    {landingHeroContent.mainTitle}
                  </span>
                  <span
                    className="block"
                    style={{
                      fontFamily: landingHeroContent.styles?.highlightedText?.fontFamily || defaultLandingHeroStyles.highlightedText?.fontFamily,
                      fontSize: landingHeroContent.styles?.highlightedText?.fontSize || defaultLandingHeroStyles.highlightedText?.fontSize,
                      fontWeight: landingHeroContent.styles?.highlightedText?.fontWeight || defaultLandingHeroStyles.highlightedText?.fontWeight,
                      color: landingHeroContent.styles?.highlightedText?.color || defaultLandingHeroStyles.highlightedText?.color,
                    }}
                  >
                    {landingHeroContent.highlightedText}
                  </span>
                </h1>

                {/* Description with dynamic styles */}
                <p
                  className="max-w-4xl mx-auto mb-12 leading-relaxed"
                  style={{
                    fontFamily: landingHeroContent.styles?.description?.fontFamily || defaultLandingHeroStyles.description?.fontFamily,
                    fontSize: landingHeroContent.styles?.description?.fontSize || defaultLandingHeroStyles.description?.fontSize,
                    fontWeight: landingHeroContent.styles?.description?.fontWeight || defaultLandingHeroStyles.description?.fontWeight,
                    color: landingHeroContent.styles?.description?.color || defaultLandingHeroStyles.description?.color,
                  }}
                >
                  {landingHeroContent.description}
                </p>

                {/* Buttons with dynamic styles */}
                <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                  <a
                    href={landingHeroContent.primaryButtonLink}
                    className={`px-8 py-4 rounded-xl transition-all duration-300 ${primaryBtnHover ? 'shadow-medium -translate-y-2' : ''}`}
                    onMouseEnter={() => setPrimaryBtnHover(true)}
                    onMouseLeave={() => setPrimaryBtnHover(false)}
                    style={{
                      fontFamily: landingHeroContent.styles?.primaryButton?.fontFamily || defaultLandingHeroStyles.primaryButton?.fontFamily,
                      fontSize: landingHeroContent.styles?.primaryButton?.fontSize || defaultLandingHeroStyles.primaryButton?.fontSize,
                      fontWeight: landingHeroContent.styles?.primaryButton?.fontWeight || defaultLandingHeroStyles.primaryButton?.fontWeight,
                      color: landingHeroContent.styles?.primaryButton?.color || defaultLandingHeroStyles.primaryButton?.color,
                      backgroundColor: primaryBtnHover
                        ? '#6B8A3A' // forest-600 hover color
                        : (landingHeroContent.styles?.primaryButton?.backgroundColor || defaultLandingHeroStyles.primaryButton?.backgroundColor),
                    }}
                  >
                    {landingHeroContent.primaryButton}
                  </a>
                  <a
                    href={landingHeroContent.secondaryButtonLink}
                    className={`border-2 px-8 py-4 rounded-xl transition-all duration-300 ${secondaryBtnHover ? 'shadow-medium -translate-y-2' : ''}`}
                    onMouseEnter={() => setSecondaryBtnHover(true)}
                    onMouseLeave={() => setSecondaryBtnHover(false)}
                    style={{
                      fontFamily: landingHeroContent.styles?.secondaryButton?.fontFamily || defaultLandingHeroStyles.secondaryButton?.fontFamily,
                      fontSize: landingHeroContent.styles?.secondaryButton?.fontSize || defaultLandingHeroStyles.secondaryButton?.fontSize,
                      fontWeight: landingHeroContent.styles?.secondaryButton?.fontWeight || defaultLandingHeroStyles.secondaryButton?.fontWeight,
                      color: secondaryBtnHover
                        ? '#FFFFFF'
                        : (landingHeroContent.styles?.secondaryButton?.color || defaultLandingHeroStyles.secondaryButton?.color),
                      borderColor: landingHeroContent.styles?.secondaryButton?.borderColor || defaultLandingHeroStyles.secondaryButton?.borderColor,
                      backgroundColor: secondaryBtnHover
                        ? (landingHeroContent.styles?.secondaryButton?.borderColor || defaultLandingHeroStyles.secondaryButton?.borderColor)
                        : 'transparent',
                    }}
                  >
                    {landingHeroContent.secondaryButton}
                  </a>
                </div>

              </div>
            )}
          </div>
        </section>

        {/* Services Section - Template Driven */}
        <HeroSection />
        <ServicesSection />
        <TestimonialsSection />

        {/* About Section - Dynamic Styles from API */}
        <section id="about" className="py-20 lg:py-32 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {aboutLoading ? (
                <div className="animate-pulse">
                  <div className="h-8 bg-sage-200 rounded-full w-48 mb-6"></div>
                  <div className="h-12 bg-sage-200 rounded w-full mb-4"></div>
                  <div className="h-12 bg-sage-200 rounded w-3/4 mb-6"></div>
                  <div className="h-6 bg-sage-200 rounded w-full mb-2"></div>
                  <div className="h-6 bg-sage-200 rounded w-full mb-2"></div>
                  <div className="h-6 bg-sage-200 rounded w-2/3 mb-8"></div>
                  <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="h-28 bg-sage-100 rounded-2xl"></div>
                    <div className="h-28 bg-sage-100 rounded-2xl"></div>
                  </div>
                  <div className="flex gap-4">
                    <div className="h-14 bg-sage-300 rounded-xl w-40"></div>
                    <div className="h-14 bg-sage-200 rounded-xl w-40"></div>
                  </div>
                </div>
              ) : (
              <div>
                {/* Badge with dynamic styles */}
                <div
                  className="inline-block px-4 py-2 rounded-full mb-6"
                  style={{
                    fontFamily: aboutContent.styles?.badge?.fontFamily || defaultAboutStyles.badge?.fontFamily,
                    fontSize: aboutContent.styles?.badge?.fontSize || defaultAboutStyles.badge?.fontSize,
                    fontWeight: aboutContent.styles?.badge?.fontWeight || defaultAboutStyles.badge?.fontWeight,
                    color: aboutContent.styles?.badge?.color || defaultAboutStyles.badge?.color,
                    backgroundColor: aboutContent.styles?.badge?.backgroundColor || defaultAboutStyles.badge?.backgroundColor,
                  }}
                >
                  ✨ {aboutContent.badge}
                </div>

                {/* Title with dynamic styles */}
                <h2 className="mb-6 leading-tight">
                  <span
                    style={{
                      fontFamily: aboutContent.styles?.title?.fontFamily || defaultAboutStyles.title?.fontFamily,
                      fontSize: aboutContent.styles?.title?.fontSize || defaultAboutStyles.title?.fontSize,
                      fontWeight: aboutContent.styles?.title?.fontWeight || defaultAboutStyles.title?.fontWeight,
                      color: aboutContent.styles?.title?.color || defaultAboutStyles.title?.color,
                    }}
                  >
                    {aboutContent.title.split(' ').slice(0, -1).join(' ')}{' '}
                  </span>
                  <span
                    style={{
                      fontFamily: aboutContent.styles?.highlightedText?.fontFamily || defaultAboutStyles.highlightedText?.fontFamily,
                      fontSize: aboutContent.styles?.highlightedText?.fontSize || defaultAboutStyles.highlightedText?.fontSize,
                      fontWeight: aboutContent.styles?.highlightedText?.fontWeight || defaultAboutStyles.highlightedText?.fontWeight,
                      color: aboutContent.styles?.highlightedText?.color || defaultAboutStyles.highlightedText?.color,
                    }}
                  >
                    {aboutContent.title.split(' ').slice(-1)[0]}
                  </span>
                </h2>

                {/* Description with dynamic styles */}
                <p
                  className="leading-relaxed mb-8"
                  style={{
                    fontFamily: aboutContent.styles?.description?.fontFamily || defaultAboutStyles.description?.fontFamily,
                    fontSize: aboutContent.styles?.description?.fontSize || defaultAboutStyles.description?.fontSize,
                    fontWeight: aboutContent.styles?.description?.fontWeight || defaultAboutStyles.description?.fontWeight,
                    color: aboutContent.styles?.description?.color || defaultAboutStyles.description?.color,
                  }}
                >
                  {aboutContent.description}
                </p>

                {/* Stats with dynamic styles */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div
                    className="text-center p-6 rounded-2xl"
                    style={{ backgroundColor: `${aboutContent.styles?.statsValue?.color || defaultAboutStyles.statsValue?.color}10` }}
                  >
                    <div
                      className="mb-2"
                      style={{
                        fontFamily: aboutContent.styles?.statsValue?.fontFamily || defaultAboutStyles.statsValue?.fontFamily,
                        fontSize: aboutContent.styles?.statsValue?.fontSize || defaultAboutStyles.statsValue?.fontSize,
                        fontWeight: aboutContent.styles?.statsValue?.fontWeight || defaultAboutStyles.statsValue?.fontWeight,
                        color: aboutContent.styles?.statsValue?.color || defaultAboutStyles.statsValue?.color,
                      }}
                    >
                      {aboutContent.stats[0]?.value || '500+'}
                    </div>
                    <div
                      style={{
                        fontFamily: aboutContent.styles?.statsLabel?.fontFamily || defaultAboutStyles.statsLabel?.fontFamily,
                        fontSize: aboutContent.styles?.statsLabel?.fontSize || defaultAboutStyles.statsLabel?.fontSize,
                        fontWeight: aboutContent.styles?.statsLabel?.fontWeight || defaultAboutStyles.statsLabel?.fontWeight,
                        color: aboutContent.styles?.statsLabel?.color || defaultAboutStyles.statsLabel?.color,
                      }}
                    >
                      {aboutContent.stats[0]?.label || 'Zufriedene Kunden'}
                    </div>
                  </div>
                  <div
                    className="text-center p-6 rounded-2xl"
                    style={{ backgroundColor: `${aboutContent.styles?.statsValue?.color || defaultAboutStyles.statsValue?.color}10` }}
                  >
                    <div
                      className="mb-2"
                      style={{
                        fontFamily: aboutContent.styles?.statsValue?.fontFamily || defaultAboutStyles.statsValue?.fontFamily,
                        fontSize: aboutContent.styles?.statsValue?.fontSize || defaultAboutStyles.statsValue?.fontSize,
                        fontWeight: aboutContent.styles?.statsValue?.fontWeight || defaultAboutStyles.statsValue?.fontWeight,
                        color: aboutContent.styles?.statsValue?.color || defaultAboutStyles.statsValue?.color,
                      }}
                    >
                      {aboutContent.stats[1]?.value || '5+'}
                    </div>
                    <div
                      style={{
                        fontFamily: aboutContent.styles?.statsLabel?.fontFamily || defaultAboutStyles.statsLabel?.fontFamily,
                        fontSize: aboutContent.styles?.statsLabel?.fontSize || defaultAboutStyles.statsLabel?.fontSize,
                        fontWeight: aboutContent.styles?.statsLabel?.fontWeight || defaultAboutStyles.statsLabel?.fontWeight,
                        color: aboutContent.styles?.statsLabel?.color || defaultAboutStyles.statsLabel?.color,
                      }}
                    >
                      {aboutContent.stats[1]?.label || 'Jahre Erfahrung'}
                    </div>
                  </div>
                </div>

                {/* Buttons with dynamic styles and hover */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href={aboutContent.primaryButtonLink || `tel:${contactContent.phone.replace(/\s/g, '')}`}
                    className={`px-8 py-4 rounded-xl transition-all duration-300 text-center ${aboutPrimaryBtnHover ? 'shadow-medium -translate-y-1' : ''}`}
                    onMouseEnter={() => setAboutPrimaryBtnHover(true)}
                    onMouseLeave={() => setAboutPrimaryBtnHover(false)}
                    style={{
                      fontFamily: aboutContent.styles?.primaryButton?.fontFamily || defaultAboutStyles.primaryButton?.fontFamily,
                      fontSize: aboutContent.styles?.primaryButton?.fontSize || defaultAboutStyles.primaryButton?.fontSize,
                      fontWeight: aboutContent.styles?.primaryButton?.fontWeight || defaultAboutStyles.primaryButton?.fontWeight,
                      color: aboutContent.styles?.primaryButton?.color || defaultAboutStyles.primaryButton?.color,
                      backgroundColor: aboutPrimaryBtnHover
                        ? '#6B8A3A' // forest-600 hover color
                        : (aboutContent.styles?.primaryButton?.backgroundColor || defaultAboutStyles.primaryButton?.backgroundColor),
                    }}
                  >
                    {aboutContent.primaryButton}
                  </a>
                  <a
                    href={aboutContent.secondaryButtonLink || '#contact'}
                    className={`border-2 px-8 py-4 rounded-xl transition-all duration-300 text-center ${aboutSecondaryBtnHover ? 'shadow-medium -translate-y-1' : ''}`}
                    onMouseEnter={() => setAboutSecondaryBtnHover(true)}
                    onMouseLeave={() => setAboutSecondaryBtnHover(false)}
                    style={{
                      fontFamily: aboutContent.styles?.secondaryButton?.fontFamily || defaultAboutStyles.secondaryButton?.fontFamily,
                      fontSize: aboutContent.styles?.secondaryButton?.fontSize || defaultAboutStyles.secondaryButton?.fontSize,
                      fontWeight: aboutContent.styles?.secondaryButton?.fontWeight || defaultAboutStyles.secondaryButton?.fontWeight,
                      color: aboutSecondaryBtnHover
                        ? '#FFFFFF'
                        : (aboutContent.styles?.secondaryButton?.color || defaultAboutStyles.secondaryButton?.color),
                      borderColor: aboutContent.styles?.secondaryButton?.borderColor || defaultAboutStyles.secondaryButton?.borderColor,
                      backgroundColor: aboutSecondaryBtnHover
                        ? (aboutContent.styles?.secondaryButton?.borderColor || defaultAboutStyles.secondaryButton?.borderColor)
                        : 'transparent',
                    }}
                  >
                    {aboutContent.secondaryButton}
                  </a>
                </div>
              </div>
              )}

              {/* Images from API */}
              <div className="relative">
                <div className="grid grid-cols-2 gap-4">
                  <img
                    src={aboutContent.images?.[0]?.url || defaultAboutContent.images[0].url}
                    alt={aboutContent.images?.[0]?.alt || defaultAboutContent.images[0].alt}
                    className="rounded-2xl shadow-medium h-48 w-full object-cover"
                  />
                  <img
                    src={aboutContent.images?.[1]?.url || defaultAboutContent.images[1].url}
                    alt={aboutContent.images?.[1]?.alt || defaultAboutContent.images[1].alt}
                    className="rounded-2xl shadow-medium h-48 w-full object-cover mt-8"
                  />
                  <img
                    src={aboutContent.images?.[2]?.url || defaultAboutContent.images[2].url}
                    alt={aboutContent.images?.[2]?.alt || defaultAboutContent.images[2].alt}
                    className="rounded-2xl shadow-medium h-48 w-full object-cover -mt-8"
                  />
                  <img
                    src={aboutContent.images?.[3]?.url || defaultAboutContent.images[3].url}
                    alt={aboutContent.images?.[3]?.alt || defaultAboutContent.images[3].alt}
                    className="rounded-2xl shadow-medium h-48 w-full object-cover"
                  />
                </div>

                {/* Decorative Elements */}
                <div
                  className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-20"
                  style={{ backgroundColor: `${aboutContent.styles?.statsValue?.color || defaultAboutStyles.statsValue?.color}30` }}
                ></div>
                <div
                  className="absolute -bottom-4 -left-4 w-32 h-32 rounded-full opacity-20"
                  style={{ backgroundColor: `${aboutContent.styles?.highlightedText?.color || defaultAboutStyles.highlightedText?.color}30` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section - Template Enhanced */}
        <section id="contact" className="py-20 lg:py-32 bg-cream">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              {/* Badge with dynamic styles */}
              <div
                className="inline-block px-4 py-2 rounded-full mb-4"
                style={{
                  fontFamily: contactSectionContent.styles?.badge?.fontFamily || defaultContactSectionStyles.badge?.fontFamily,
                  fontSize: contactSectionContent.styles?.badge?.fontSize || defaultContactSectionStyles.badge?.fontSize,
                  fontWeight: contactSectionContent.styles?.badge?.fontWeight || defaultContactSectionStyles.badge?.fontWeight,
                  color: contactSectionContent.styles?.badge?.color || defaultContactSectionStyles.badge?.color,
                  backgroundColor: contactSectionContent.styles?.badge?.backgroundColor || defaultContactSectionStyles.badge?.backgroundColor,
                }}
              >
                {contactSectionContent.badge}
              </div>
              {/* Section Title with dynamic styles */}
              <h2 className="mb-6">
                <span
                  style={{
                    fontFamily: contactSectionContent.styles?.sectionTitle?.fontFamily || defaultContactSectionStyles.sectionTitle?.fontFamily,
                    fontSize: contactSectionContent.styles?.sectionTitle?.fontSize || defaultContactSectionStyles.sectionTitle?.fontSize,
                    fontWeight: contactSectionContent.styles?.sectionTitle?.fontWeight || defaultContactSectionStyles.sectionTitle?.fontWeight,
                    color: contactSectionContent.styles?.sectionTitle?.color || defaultContactSectionStyles.sectionTitle?.color,
                  }}
                >
                  {contactSectionContent.sectionTitle}{' '}
                </span>
                <span
                  style={{
                    fontFamily: contactSectionContent.styles?.highlightedText?.fontFamily || defaultContactSectionStyles.highlightedText?.fontFamily,
                    fontSize: contactSectionContent.styles?.highlightedText?.fontSize || defaultContactSectionStyles.highlightedText?.fontSize,
                    fontWeight: contactSectionContent.styles?.highlightedText?.fontWeight || defaultContactSectionStyles.highlightedText?.fontWeight,
                    color: contactSectionContent.styles?.highlightedText?.color || defaultContactSectionStyles.highlightedText?.color,
                  }}
                >
                  {contactSectionContent.highlightedText}
                </span>
                <span
                  style={{
                    fontFamily: contactSectionContent.styles?.sectionTitle?.fontFamily || defaultContactSectionStyles.sectionTitle?.fontFamily,
                    fontSize: contactSectionContent.styles?.sectionTitle?.fontSize || defaultContactSectionStyles.sectionTitle?.fontSize,
                    fontWeight: contactSectionContent.styles?.sectionTitle?.fontWeight || defaultContactSectionStyles.sectionTitle?.fontWeight,
                    color: contactSectionContent.styles?.sectionTitle?.color || defaultContactSectionStyles.sectionTitle?.color,
                  }}
                >
                  ?
                </span>
              </h2>
              {/* Description with dynamic styles */}
              <p
                className="max-w-3xl mx-auto"
                style={{
                  fontFamily: contactSectionContent.styles?.description?.fontFamily || defaultContactSectionStyles.description?.fontFamily,
                  fontSize: contactSectionContent.styles?.description?.fontSize || defaultContactSectionStyles.description?.fontSize,
                  fontWeight: contactSectionContent.styles?.description?.fontWeight || defaultContactSectionStyles.description?.fontWeight,
                  color: contactSectionContent.styles?.description?.color || defaultContactSectionStyles.description?.color,
                }}
              >
                {contactSectionContent.description}
              </p>
            </div>

            {contactLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white p-8 rounded-2xl shadow-soft">
                    <div className="w-12 h-12 bg-sage-200 rounded-full mb-4"></div>
                    <div className="h-6 bg-sage-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-sage-100 rounded w-full mb-2"></div>
                    <div className="h-4 bg-sage-100 rounded w-3/4 mb-4"></div>
                    <div className="h-5 bg-sage-300 rounded w-40"></div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-soft">
                    <div className="w-12 h-12 bg-sage-200 rounded-full mb-4"></div>
                    <div className="h-6 bg-sage-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-sage-100 rounded w-full mb-4"></div>
                    <div className="h-5 bg-sage-300 rounded w-40"></div>
                  </div>
                  <div className="bg-white p-8 rounded-2xl shadow-soft">
                    <div className="w-12 h-12 bg-sage-200 rounded-full mb-4"></div>
                    <div className="h-6 bg-sage-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-sage-100 rounded w-full mb-4"></div>
                    <div className="h-5 bg-sage-300 rounded w-40"></div>
                  </div>
                </div>
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-2xl shadow-soft overflow-hidden h-full">
                    <div className="h-64 lg:h-80 bg-sage-100"></div>
                    <div className="p-8">
                      <div className="h-6 bg-sage-200 rounded w-40 mb-6"></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[...Array(7)].map((_, i) => (
                          <div key={i} className="flex justify-between py-2 px-4">
                            <div className="h-5 bg-sage-100 rounded w-24"></div>
                            <div className="h-5 bg-sage-100 rounded w-28"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Methods */}
              <div className="lg:col-span-1 space-y-6">
                {/* Phone Card */}
                <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: contactSectionContent.styles?.phoneCardIcon?.backgroundColor || defaultContactSectionStyles.phoneCardIcon?.backgroundColor }}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: contactSectionContent.styles?.phoneCardIcon?.iconColor || defaultContactSectionStyles.phoneCardIcon?.iconColor }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: contactSectionContent.styles?.phoneCardTitle?.fontFamily || defaultContactSectionStyles.phoneCardTitle?.fontFamily,
                      fontSize: contactSectionContent.styles?.phoneCardTitle?.fontSize || defaultContactSectionStyles.phoneCardTitle?.fontSize,
                      fontWeight: contactSectionContent.styles?.phoneCardTitle?.fontWeight || defaultContactSectionStyles.phoneCardTitle?.fontWeight,
                      color: contactSectionContent.styles?.phoneCardTitle?.color || defaultContactSectionStyles.phoneCardTitle?.color,
                    }}
                  >
                    {contactSectionContent.cards.phone.title}
                  </h3>
                  <p
                    className="mb-4"
                    style={{
                      fontFamily: contactSectionContent.styles?.phoneCardDescription?.fontFamily || defaultContactSectionStyles.phoneCardDescription?.fontFamily,
                      fontSize: contactSectionContent.styles?.phoneCardDescription?.fontSize || defaultContactSectionStyles.phoneCardDescription?.fontSize,
                      fontWeight: contactSectionContent.styles?.phoneCardDescription?.fontWeight || defaultContactSectionStyles.phoneCardDescription?.fontWeight,
                      color: contactSectionContent.styles?.phoneCardDescription?.color || defaultContactSectionStyles.phoneCardDescription?.color,
                    }}
                  >
                    {contactSectionContent.cards.phone.description}
                  </p>
                  <a
                    href={`tel:${contactContent.phone.replace(/\s/g, '')}`}
                    className="hover:opacity-80 transition-colors"
                    style={{
                      fontFamily: contactSectionContent.styles?.phoneCardDescription?.fontFamily || defaultContactSectionStyles.phoneCardDescription?.fontFamily,
                      fontSize: contactSectionContent.styles?.phoneCardDescription?.fontSize || defaultContactSectionStyles.phoneCardDescription?.fontSize,
                      fontWeight: contactSectionContent.styles?.phoneCardDescription?.fontWeight || defaultContactSectionStyles.phoneCardDescription?.fontWeight,
                      color: contactSectionContent.styles?.phoneCardTitle?.color || defaultContactSectionStyles.phoneCardTitle?.color,
                    }}
                  >
                    {contactContent.phone}
                  </a>
                </div>

                {/* WhatsApp Card */}
                <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: contactSectionContent.styles?.whatsappCardIcon?.backgroundColor || defaultContactSectionStyles.whatsappCardIcon?.backgroundColor }}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                      style={{ color: contactSectionContent.styles?.whatsappCardIcon?.iconColor || defaultContactSectionStyles.whatsappCardIcon?.iconColor }}
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                  </div>
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: contactSectionContent.styles?.whatsappCardTitle?.fontFamily || defaultContactSectionStyles.whatsappCardTitle?.fontFamily,
                      fontSize: contactSectionContent.styles?.whatsappCardTitle?.fontSize || defaultContactSectionStyles.whatsappCardTitle?.fontSize,
                      fontWeight: contactSectionContent.styles?.whatsappCardTitle?.fontWeight || defaultContactSectionStyles.whatsappCardTitle?.fontWeight,
                      color: contactSectionContent.styles?.whatsappCardTitle?.color || defaultContactSectionStyles.whatsappCardTitle?.color,
                    }}
                  >
                    {contactSectionContent.cards.whatsapp.title}
                  </h3>
                  <p
                    className="mb-4"
                    style={{
                      fontFamily: contactSectionContent.styles?.whatsappCardDescription?.fontFamily || defaultContactSectionStyles.whatsappCardDescription?.fontFamily,
                      fontSize: contactSectionContent.styles?.whatsappCardDescription?.fontSize || defaultContactSectionStyles.whatsappCardDescription?.fontSize,
                      fontWeight: contactSectionContent.styles?.whatsappCardDescription?.fontWeight || defaultContactSectionStyles.whatsappCardDescription?.fontWeight,
                      color: contactSectionContent.styles?.whatsappCardDescription?.color || defaultContactSectionStyles.whatsappCardDescription?.color,
                    }}
                  >
                    {contactSectionContent.cards.whatsapp.description}
                  </p>
                  <a
                    href={`https://wa.me/${contactContent.phone.replace(/[\s+\-]/g, '')}?text=Hallo,%20ich%20interessiere%20mich%20für%20eine%20Wellness-Behandlung`}
                    className="text-green-600 hover:text-green-700 transition-colors"
                    style={{
                      fontFamily: contactSectionContent.styles?.whatsappCardLink?.fontFamily || defaultContactSectionStyles.whatsappCardLink?.fontFamily,
                      fontSize: contactSectionContent.styles?.whatsappCardLink?.fontSize || defaultContactSectionStyles.whatsappCardLink?.fontSize,
                      fontWeight: contactSectionContent.styles?.whatsappCardLink?.fontWeight || defaultContactSectionStyles.whatsappCardLink?.fontWeight,
                      color: contactSectionContent.styles?.whatsappCardLink?.color || defaultContactSectionStyles.whatsappCardLink?.color,
                    }}
                  >
                    {contactSectionContent.cards.whatsapp.linkText}
                  </a>
                </div>

                {/* Email Card */}
                <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                    style={{ backgroundColor: contactSectionContent.styles?.emailCardIcon?.backgroundColor || defaultContactSectionStyles.emailCardIcon?.backgroundColor }}
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      style={{ color: contactSectionContent.styles?.emailCardIcon?.iconColor || defaultContactSectionStyles.emailCardIcon?.iconColor }}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: contactSectionContent.styles?.emailCardTitle?.fontFamily || defaultContactSectionStyles.emailCardTitle?.fontFamily,
                      fontSize: contactSectionContent.styles?.emailCardTitle?.fontSize || defaultContactSectionStyles.emailCardTitle?.fontSize,
                      fontWeight: contactSectionContent.styles?.emailCardTitle?.fontWeight || defaultContactSectionStyles.emailCardTitle?.fontWeight,
                      color: contactSectionContent.styles?.emailCardTitle?.color || defaultContactSectionStyles.emailCardTitle?.color,
                    }}
                  >
                    {contactSectionContent.cards.email.title}
                  </h3>
                  <p
                    className="mb-4"
                    style={{
                      fontFamily: contactSectionContent.styles?.emailCardDescription?.fontFamily || defaultContactSectionStyles.emailCardDescription?.fontFamily,
                      fontSize: contactSectionContent.styles?.emailCardDescription?.fontSize || defaultContactSectionStyles.emailCardDescription?.fontSize,
                      fontWeight: contactSectionContent.styles?.emailCardDescription?.fontWeight || defaultContactSectionStyles.emailCardDescription?.fontWeight,
                      color: contactSectionContent.styles?.emailCardDescription?.color || defaultContactSectionStyles.emailCardDescription?.color,
                    }}
                  >
                    {contactSectionContent.cards.email.description}
                  </p>
                  <a
                    href={`mailto:${contactContent.email}`}
                    className="hover:opacity-80 transition-colors"
                    style={{
                      fontFamily: contactSectionContent.styles?.emailCardDescription?.fontFamily || defaultContactSectionStyles.emailCardDescription?.fontFamily,
                      fontSize: contactSectionContent.styles?.emailCardDescription?.fontSize || defaultContactSectionStyles.emailCardDescription?.fontSize,
                      fontWeight: contactSectionContent.styles?.emailCardDescription?.fontWeight || defaultContactSectionStyles.emailCardDescription?.fontWeight,
                      color: contactSectionContent.styles?.phoneCardTitle?.color || defaultContactSectionStyles.phoneCardTitle?.color,
                    }}
                  >
                    {contactContent.email}
                  </a>
                </div>
              </div>

              {/* Map & Info */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-soft overflow-hidden h-full">
                  {/* Map Placeholder */}
                  <div className="h-64 lg:h-80 bg-sage-100 flex items-center justify-center relative">
                    <div className="text-center">
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center text-white mx-auto mb-4"
                        style={{ backgroundColor: contactSectionContent.styles?.cardIcon?.backgroundColor || defaultContactSectionStyles.cardIcon?.backgroundColor }}
                      >
                        <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <h3
                        className="mb-2"
                        style={{
                          fontFamily: contactSectionContent.styles?.mapTitle?.fontFamily || defaultContactSectionStyles.mapTitle?.fontFamily,
                          fontSize: contactSectionContent.styles?.mapTitle?.fontSize || defaultContactSectionStyles.mapTitle?.fontSize,
                          fontWeight: contactSectionContent.styles?.mapTitle?.fontWeight || defaultContactSectionStyles.mapTitle?.fontWeight,
                          color: contactSectionContent.styles?.mapTitle?.color || defaultContactSectionStyles.mapTitle?.color,
                        }}
                      >
                        {templateConfig?.ui.theme.brandName || 'Wellnesstal Studio'}
                      </h3>
                      <p
                        style={{
                          fontFamily: contactSectionContent.styles?.mapAddress?.fontFamily || defaultContactSectionStyles.mapAddress?.fontFamily,
                          fontSize: contactSectionContent.styles?.mapAddress?.fontSize || defaultContactSectionStyles.mapAddress?.fontSize,
                          fontWeight: contactSectionContent.styles?.mapAddress?.fontWeight || defaultContactSectionStyles.mapAddress?.fontWeight,
                          color: contactSectionContent.styles?.mapAddress?.color || defaultContactSectionStyles.mapAddress?.color,
                        }}
                      >
                        {contactContent.address.street}, {contactContent.address.postalCode} {contactContent.address.city}
                      </p>
                    </div>

                    {/* Interactive Map Button */}
                    {googleMapsUrl && (
                      <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute bottom-4 right-4 hover:opacity-90 px-4 py-2 rounded-lg transition-colors"
                        style={{
                          fontFamily: contactSectionContent.styles?.mapButton?.fontFamily || defaultContactSectionStyles.mapButton?.fontFamily,
                          fontSize: contactSectionContent.styles?.mapButton?.fontSize || defaultContactSectionStyles.mapButton?.fontSize,
                          fontWeight: contactSectionContent.styles?.mapButton?.fontWeight || defaultContactSectionStyles.mapButton?.fontWeight,
                          color: contactSectionContent.styles?.mapButton?.color || defaultContactSectionStyles.mapButton?.color,
                          backgroundColor: contactSectionContent.styles?.mapButton?.backgroundColor || defaultContactSectionStyles.mapButton?.backgroundColor,
                        }}
                      >
                        {contactSectionContent.map.buttonText}
                      </a>
                    )}
                  </div>

                  {/* Opening Hours */}
                  <div className="p-8">
                    <h3
                      className="mb-6"
                      style={{
                        fontFamily: contactSectionContent.styles?.openingHoursTitle?.fontFamily || defaultContactSectionStyles.openingHoursTitle?.fontFamily,
                        fontSize: contactSectionContent.styles?.openingHoursTitle?.fontSize || defaultContactSectionStyles.openingHoursTitle?.fontSize,
                        fontWeight: contactSectionContent.styles?.openingHoursTitle?.fontWeight || defaultContactSectionStyles.openingHoursTitle?.fontWeight,
                        color: contactSectionContent.styles?.openingHoursTitle?.color || defaultContactSectionStyles.openingHoursTitle?.color,
                      }}
                    >
                      {contactSectionContent.openingHours.title}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(() => {
                        const dayMapping = [
                          { key: 'monday', label: 'Montag' },
                          { key: 'tuesday', label: 'Dienstag' },
                          { key: 'wednesday', label: 'Mittwoch' },
                          { key: 'thursday', label: 'Donnerstag' },
                          { key: 'friday', label: 'Freitag' },
                          { key: 'saturday', label: 'Samstag' },
                          { key: 'sunday', label: 'Sonntag' }
                        ]
                        const todayIndex = new Date().getDay()
                        const adjustedTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1
                        return dayMapping.map((dayInfo, index) => {
                          const dayData = contactContent.openingHours[dayInfo.key]
                          const hours = dayData?.closed ? contactSectionContent.openingHours.closedLabel : `${dayData?.open || '09:00'} - ${dayData?.close || '19:00'}`
                          return { day: dayInfo.label, hours, today: index === adjustedTodayIndex, closed: dayData?.closed }
                        })
                      })().map((schedule, index) => (
                        <div
                          key={index}
                          className="flex justify-between py-2 px-4 rounded-lg"
                          style={schedule.today ? {
                            backgroundColor: contactSectionContent.styles?.todayHighlight?.backgroundColor || defaultContactSectionStyles.todayHighlight?.backgroundColor,
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderColor: contactSectionContent.styles?.todayHighlight?.borderColor || defaultContactSectionStyles.todayHighlight?.borderColor
                          } : {}}
                        >
                          <span
                            style={{
                              fontFamily: contactSectionContent.styles?.dayLabel?.fontFamily || defaultContactSectionStyles.dayLabel?.fontFamily,
                              fontSize: contactSectionContent.styles?.dayLabel?.fontSize || defaultContactSectionStyles.dayLabel?.fontSize,
                              fontWeight: contactSectionContent.styles?.dayLabel?.fontWeight || defaultContactSectionStyles.dayLabel?.fontWeight,
                              color: contactSectionContent.styles?.dayLabel?.color || defaultContactSectionStyles.dayLabel?.color,
                            }}
                          >
                            {schedule.day}
                            {schedule.today && (
                              <span
                                className="ml-2 px-2 py-1 rounded-full"
                                style={{
                                  fontFamily: contactSectionContent.styles?.todayBadge?.fontFamily || defaultContactSectionStyles.todayBadge?.fontFamily,
                                  fontSize: contactSectionContent.styles?.todayBadge?.fontSize || defaultContactSectionStyles.todayBadge?.fontSize,
                                  fontWeight: contactSectionContent.styles?.todayBadge?.fontWeight || defaultContactSectionStyles.todayBadge?.fontWeight,
                                  color: contactSectionContent.styles?.todayBadge?.color || defaultContactSectionStyles.todayBadge?.color,
                                  backgroundColor: contactSectionContent.styles?.todayBadge?.backgroundColor || defaultContactSectionStyles.todayBadge?.backgroundColor,
                                }}
                              >
                                {contactSectionContent.openingHours.todayLabel}
                              </span>
                            )}
                          </span>
                          <span
                            style={{
                              fontFamily: contactSectionContent.styles?.timeLabel?.fontFamily || defaultContactSectionStyles.timeLabel?.fontFamily,
                              fontSize: contactSectionContent.styles?.timeLabel?.fontSize || defaultContactSectionStyles.timeLabel?.fontSize,
                              fontWeight: schedule.today ? '600' : (contactSectionContent.styles?.timeLabel?.fontWeight || defaultContactSectionStyles.timeLabel?.fontWeight),
                              color: schedule.closed ? '#9CA3AF' : (contactSectionContent.styles?.timeLabel?.color || defaultContactSectionStyles.timeLabel?.color),
                            }}
                          >
                            {schedule.hours}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Template Engine Status */}
      {templateConfig && (
        <div className="fixed bottom-4 left-4 bg-white border border-gray-200 rounded-lg px-4 py-2 shadow-lg text-xs text-gray-600 z-40">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>
              Frontend Template: <strong>{templateConfig.name}</strong> v{templateConfig.version}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}