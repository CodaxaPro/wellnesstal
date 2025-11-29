'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'
import LandingHeroSection from '@/components/sections/LandingHeroSection'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

// Template Engine imports
import { templateEngine } from '@/lib/template-engine'
import { TemplateConfig } from '@/types/templates'

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

export default function Home() {
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig | null>(null)
  const [templateLoading, setTemplateLoading] = useState(true)
  const [metaContent, setMetaContent] = useState<MetaContent>(defaultMetaContent)

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
              ]
            },
            secondary: [
              {
                name: "Categories",
                singular: "Category",
                plural: "Categories",
                icon: "Tag",
                color: "#F59E0B",
                fields: [
                  {
                    key: "name",
                    label: "Category Name",
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
                  }
                ]
              },
              {
                name: "Testimonials",
                singular: "Testimonial",
                plural: "Testimonials",
                icon: "MessageCircle",
                color: "#EC4899",
                fields: [
                  {
                    key: "name",
                    label: "Customer Name",
                    type: "text" as const,
                    required: true,
                    order: 1
                  },
                  {
                    key: "rating",
                    label: "Rating",
                    type: "number" as const,
                    required: true,
                    order: 2
                  },
                  {
                    key: "text",
                    label: "Review Text",
                    type: "textarea" as const,
                    required: true,
                    order: 3
                  }
                ]
              },
              {
                name: "Therapists",
                singular: "Therapist",
                plural: "Therapists",
                icon: "Users",
                color: "#8B5CF6",
                fields: [
                  {
                    key: "name",
                    label: "Name",
                    type: "text" as const,
                    required: true,
                    order: 1
                  },
                  {
                    key: "specialization",
                    label: "Specialization",
                    type: "text" as const,
                    required: false,
                    order: 2
                  },
                  {
                    key: "bio",
                    label: "Bio",
                    type: "textarea" as const,
                    required: false,
                    order: 3
                  }
                ]
              }
            ]
          },

          ui: {
            theme: {
              primaryColor: "#9CAF88",
              secondaryColor: "#637554",
              accentColor: "#2C2C2C",
              brandName: "Wellnesstal Studio"
            },
            navigation: [
              { label: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard" },
              { label: "Services", href: "/admin/services", icon: "Sparkles" },
              { label: "Categories", href: "/admin/categories", icon: "Tag" },
              { label: "Testimonials", href: "/admin/testimonials", icon: "MessageCircle" },
              { label: "Therapists", href: "/admin/therapists", icon: "Users" },
              { label: "Content", href: "/admin/content", icon: "FileText" },
              { label: "Media", href: "/admin/media", icon: "Image" }
            ],
            features: {
              booking: true,
              payments: false,
              analytics: true,
              notifications: true
            }
          },

          workflows: {
            booking: {
              enabled: true,
              steps: ["select_service", "select_therapist", "select_time", "confirm"],
              notifications: ["email", "sms"]
            }
          }
        }

        // Initialize template engine
        templateEngine.setConfig(config)
        setTemplateConfig(config)
      } catch (error) {
        console.error('Failed to initialize template:', error)
      } finally {
        setTemplateLoading(false)
      }
    }

    initializeTemplate()
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
        {/* Landing Hero Section */}
        <LandingHeroSection />

        {/* Hero, Services & Testimonials Sections */}
        <HeroSection />
        <ServicesSection />
        <TestimonialsSection />

        {/* About Section */}
        <AboutSection />

        {/* Contact Section */}
        <ContactSection brandName={templateConfig?.ui.theme.brandName || 'Wellnesstal Studio'} />
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
