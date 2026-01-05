"use client"

import React, { useState, useEffect } from 'react'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import { PageBlock } from '@/components/blocks/types'
import WhatsAppButton from '@/components/ui/WhatsAppButton'

// Content Sections
import LandingHeroSection from '@/components/sections/LandingHeroSection'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import AboutSection from '@/components/sections/AboutSection'
import ContactSection from '@/components/sections/ContactSection'
import TestimonialsSection from '@/components/sections/TestimonialsSection'

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
  siteTitle: 'Wellnesstal - Premium Wellness & Headspa in Baesweiler | Massage & Entspannung',
  siteDescription: 'Professionelle Wellness & Headspa-Behandlungen in Baesweiler. Japanische Kopfmassage, Entspannung & Massage für Ihr Wohlbefinden. Jetzt Termin vereinbaren!',
  keywords: 'wellness baesweiler, headspa baesweiler, massage baesweiler, japanische kopfmassage, entspannung baesweiler, wellness studio, spa baesweiler',
  ogImage: '/images/og-wellnesstal.jpg'
}

export default function Home() {
  const [templateConfig, setTemplateConfig] = useState<TemplateConfig | null>(null)
  const [templateLoading, setTemplateLoading] = useState(true)
  const [metaContent, setMetaContent] = useState<MetaContent>(defaultMetaContent)

  const [blocks, setBlocks] = useState<PageBlock[]>([])
  const [blocksLoading, setBlocksLoading] = useState(true)
  const [homepageSections, setHomepageSections] = useState<Array<{section_key: string, position: number, enabled: boolean}>>([])
  const [sectionsLoading, setSectionsLoading] = useState(true)

  // Initialize Template Engine (keeps previous behavior)
  useEffect(() => {
    const initializeTemplate = async () => {
      try {
        const config: TemplateConfig = {
          id: 'wellness-basic',
          name: 'Wellness & Spa Management',
          industry: 'wellness' as const,
          version: '1.0.0',
          description: 'Complete wellness and spa management system',
          entities: {
            primary: {
              name: 'Services', singular: 'Service', plural: 'Services', icon: 'Sparkles', color: '#10B981',
              fields: [
                { key: 'name', label: 'Service Name', type: 'text' as const, required: true, order: 1 },
                { key: 'description', label: 'Description', type: 'textarea' as const, required: false, order: 2 }
              ],
              permissions: { create: true, read: true, update: true, delete: true, bulk: false }
            }
          },
          ui: {
            theme: {
              primaryColor: '#9CAF88', secondaryColor: '#637554', accentColor: '#2C2C2C',
              fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
              fontSize: { sm: '0.875rem', base: '1rem', lg: '1.125rem', xl: '1.25rem' },
              borderRadius: '8px', spacing: 'comfortable', darkMode: false
            },
            components: {},
            layout: {
              sidebar: { position: 'left', collapsible: true, defaultCollapsed: false },
              navigation: { style: 'sidebar', items: [] },
              dashboard: { widgets: [], layout: 'grid' }
            }
          },
          business: { workflows: [], validations: {}, automations: [] },
          features: { enabled: [], disabled: [], premium: [] }
        }

        templateEngine.registerTemplate(config as any)
        templateEngine.setActiveTemplate(config.id)
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
          const meta = { ...defaultMetaContent, ...data.data.content }
          setMetaContent(meta)
          document.title = meta.siteTitle
        }
      } catch (error) {
        console.error('Failed to fetch meta content:', error)
      }
    }

    fetchMetaContent()
  }, [])

  // Fetch homepage sections order (from /admin/content)
  useEffect(() => {
    const fetchSections = async () => {
      try {
        setSectionsLoading(true)
        const response = await fetch('/api/sections')
        const data = await response.json()
        if (data.success && data.data) {
          // Sort by position and filter enabled
          const enabledSections = data.data
            .filter((s: any) => s.enabled)
            .sort((a: any, b: any) => a.position - b.position)
          setHomepageSections(enabledSections)
        }
      } catch (error) {
        console.error('Failed to fetch homepage sections:', error)
      } finally {
        setSectionsLoading(false)
      }
    }

    fetchSections()
  }, [])

  // Fetch homepage blocks (from /admin/pages)
  useEffect(() => {
    const fetchBlocks = async () => {
      try {
        setBlocksLoading(true)
        // Try home slug first, fallback to index
        const res = await fetch('/api/pages?slug=home')
        if (res.ok) {
          const json = await res.json()
          if (json.success && json.data?.blocks) {
            setBlocks(json.data.blocks)
          }
        } else {
          // fallback attempt
          const r2 = await fetch('/api/pages?slug=index')
          if (r2.ok) {
            const j2 = await r2.json()
            if (j2.success && j2.data?.blocks) setBlocks(j2.data.blocks)
          }
        }
      } catch (error) {
        console.error('Failed to fetch blocks:', error)
      } finally {
        setBlocksLoading(false)
      }
    }

    fetchBlocks()
  }, [])

  // Template-driven theme variables
  const themeVars = templateConfig?.ui.theme ? {
    '--primary-color': templateConfig.ui.theme.primaryColor,
    '--secondary-color': templateConfig.ui.theme.secondaryColor,
    '--accent-color': templateConfig.ui.theme.accentColor,
    '--brand-name': (templateConfig.ui.theme as any).brandName || 'Wellnesstal Studio'
  } : {}

  if (blocksLoading || sectionsLoading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sage-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Sayfa yükleniyor...</p>
        </div>
      </div>
    )
  }

  // Render section component based on section_key
  const renderContentSection = (sectionKey: string) => {
    switch (sectionKey) {
      case 'landing-hero':
        return <LandingHeroSection key={sectionKey} />
      case 'hero':
        return <HeroSection key={sectionKey} />
      case 'services':
      case 'services-section':
        return <ServicesSection key={sectionKey} />
      case 'about':
        return <AboutSection key={sectionKey} />
      case 'contact':
      case 'contact-section':
        return <ContactSection key={sectionKey} brandName={metaContent.siteTitle} />
      case 'testimonials':
      case 'testimonials-section':
        return <TestimonialsSection key={sectionKey} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-cream" style={themeVars as any}>
      {templateLoading && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Template wird geladen...
        </div>
      )}

      <Header />

      <main>
        {/* Render Content Sections (from /admin/content) */}
        {homepageSections.length > 0 && (
          <>
            {homepageSections.map((section) => renderContentSection(section.section_key))}
          </>
        )}

        {/* Render Blocks (from /admin/pages) */}
        {blocks.length > 0 && (
          <BlockRenderer blocks={blocks} />
        )}

        {/* Empty State - Show only if both are empty */}
        {homepageSections.length === 0 && blocks.length === 0 && (
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-8">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-slate-800 mb-2">Ana Sayfa Henüz Oluşturulmamış</h2>
              <p className="text-slate-600 mb-4">
                İçerik eklemek için:
              </p>
              <div className="flex flex-col gap-3 items-center">
                <a href="/admin/content" className="inline-flex items-center gap-2 bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  📝 İçerik Yönetimi
                </a>
                <span className="text-sm text-gray-500">veya</span>
                <a href="/admin/pages" className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">
                  🧩 Sayfa Blokları
                </a>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <WhatsAppButton />

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
