'use client'

import { Page, ContentSection } from '@/types/pages'
import Link from 'next/link'
import Image from 'next/image'

interface PageRendererProps {
  page: Page
}

interface SectionRendererProps {
  section: ContentSection
}

// Hero Section Component
function HeroSection({ hero }: { hero: any }) {
  if (!hero) return null

  return (
    <div className={`relative py-20 lg:py-32 ${
      hero.backgroundType === 'image' 
        ? 'bg-cover bg-center bg-no-repeat' 
        : hero.backgroundType === 'gradient'
        ? 'bg-gradient-to-br from-sage-400 to-forest-600'
        : 'bg-sage-50'
    }`} 
    style={{
      backgroundImage: hero.backgroundType === 'image' && hero.image 
        ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${hero.image})`
        : undefined,
      backgroundColor: hero.backgroundType === 'color' ? hero.backgroundColor : undefined
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className={`text-4xl lg:text-6xl font-bold mb-6 ${
            hero.backgroundType === 'image' ? 'text-white' : 'text-charcoal'
          }`}>
            {hero.title}
          </h1>
          <p className={`text-xl mb-8 max-w-3xl mx-auto ${
            hero.backgroundType === 'image' ? 'text-gray-100' : 'text-gray-600'
          }`}>
            {hero.subtitle}
          </p>
          {hero.ctaText && (
            <a
              href={hero.ctaLink || '#kontakt'}
              className="inline-block bg-sage-500 hover:bg-forest-600 text-white px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105 text-lg shadow-lg hover:shadow-xl"
            >
              {hero.ctaText}
            </a>
          )}
        </div>
      </div>
    </div>
  )
}

// Text Section Component
function TextSectionRenderer({ section }: SectionRendererProps) {
  const content = section.content

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-8 text-center">
            {section.title}
          </h2>
          <div className={`prose prose-lg max-w-none ${
            content.alignment === 'center' ? 'text-center' : 
            content.alignment === 'right' ? 'text-right' : 'text-left'
          }`}>
            {content.layout === 'single' ? (
              <p className="text-gray-600 leading-relaxed text-lg">
                {content.content}
              </p>
            ) : content.layout === 'two-column' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="text-gray-600 leading-relaxed">
                  {content.content}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-gray-600 leading-relaxed col-span-3">
                  {content.content}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Features Section Component
function FeaturesSectionRenderer({ section }: SectionRendererProps) {
  const features = section.content.features || []

  return (
    <div className="py-16 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-12 text-center">
          {section.title}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature: any, index: number) => (
            <div 
              key={index} 
              className="bg-white rounded-xl p-6 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-2 text-center group"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-forest-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-charcoal mb-3 group-hover:text-sage-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Services Section Component
function ServicesSectionRenderer({ section }: SectionRendererProps) {
  const services = section.content.services || []
  const displayType = section.content.displayType || 'grid'
  const showPrices = section.content.showPrices !== false

  return (
    <div className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-12 text-center">
          {section.title}
        </h2>
        
        {displayType === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service: any) => (
              <div key={service.id} className="bg-cream rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                {service.image && (
                  <div className="relative h-48 rounded-lg overflow-hidden mb-4">
                    <Image 
                      src={service.image} 
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <h3 className="text-xl font-semibold text-charcoal mb-2">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {service.description}
                </p>
                <div className="flex justify-between items-center">
                  {showPrices && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-sage-600">
                        {service.price}
                      </div>
                      <div className="text-sm text-gray-500">
                        {service.duration}
                      </div>
                    </div>
                  )}
                  <button className="bg-sage-500 hover:bg-forest-600 text-white px-6 py-2 rounded-lg transition-colors">
                    Buchen
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {services.map((service: any) => (
              <div key={service.id} className="bg-cream rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all duration-300">
                {service.image && (
                  <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                    <Image 
                      src={service.image} 
                      alt={service.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-2xl font-semibold text-charcoal mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {service.description}
                  </p>
                  <div className="flex justify-between items-center">
                    {showPrices && (
                      <div>
                        <div className="text-xl font-bold text-sage-600">
                          {service.price}
                        </div>
                        <div className="text-sm text-gray-500">
                          {service.duration}
                        </div>
                      </div>
                    )}
                    <button className="bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-lg transition-colors">
                      Jetzt buchen
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// Contact Section Component
function ContactSectionRenderer({ section }: SectionRendererProps) {
  const content = section.content

  return (
    <div className="py-16 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center">
          {section.title}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {content.showForm && (
            <div className="bg-white rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-charcoal mb-6">
                Kontakt aufnehmen
              </h3>
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Ihr Name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Ihre E-Mail"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Ihre Nachricht"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-sage-500 hover:bg-forest-600 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  Nachricht senden
                </button>
              </form>
            </div>
          )}
          
          <div className="text-white">
            <h3 className="text-2xl font-semibold mb-6">
              Besuchen Sie uns
            </h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-sage-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>Reyplatz 10, 52499 Baesweiler</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-sage-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                <a href="tel:+491733828581" className="hover:text-sage-400 transition-colors">
                  +49 1733828581
                </a>
              </div>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-sage-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <a href="mailto:info@wellnesstal.de" className="hover:text-sage-400 transition-colors">
                  info@wellnesstal.de
                </a>
              </div>
            </div>
            
            {content.customText && (
              <div className="mt-6 p-4 bg-sage-500 bg-opacity-20 rounded-lg">
                <p className="text-sage-100">{content.customText}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Section Renderer - Routes to appropriate component
function SectionRenderer({ section }: SectionRendererProps) {
  if (!section.visible) return null

  switch (section.type) {
    case 'text':
      return <TextSectionRenderer section={section} />
    case 'features':
      return <FeaturesSectionRenderer section={section} />
    case 'services':
      return <ServicesSectionRenderer section={section} />
    case 'contact':
      return <ContactSectionRenderer section={section} />
    case 'testimonials':
      return (
        <div className="py-16 bg-sage-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-charcoal mb-8">{section.title}</h2>
            <p className="text-gray-600">Testimonials component coming soon...</p>
          </div>
        </div>
      )
    case 'gallery':
      return (
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-charcoal mb-8">{section.title}</h2>
            <p className="text-gray-600">Gallery component coming soon...</p>
          </div>
        </div>
      )
    default:
      return (
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-2xl font-bold text-charcoal mb-4">{section.title}</h2>
            <p className="text-gray-600">Section type "{section.type}" not implemented yet.</p>
          </div>
        </div>
      )
  }
}

// Main PageRenderer Component
export default function PageRenderer({ page }: PageRendererProps) {
  // Sort sections by orderIndex
  const sortedSections = page.content.sections?.sort((a, b) => a.orderIndex - b.orderIndex) || []

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection hero={page.content.hero} />
      
      {/* Content Sections */}
      {sortedSections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
      
      {/* Template-specific footer */}
      {page.templateType === 'landing' && (
        <div className="bg-sage-600 py-12">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Bereit für Ihre Wellness-Reise?
            </h3>
            <p className="text-sage-100 mb-8">
              Buchen Sie noch heute Ihren Termin und erleben Sie pure Entspannung.
            </p>
            <a
              href="tel:+491733828581"
              className="inline-block bg-white text-sage-600 px-8 py-4 rounded-xl font-medium hover:bg-gray-100 transition-colors text-lg"
            >
              Jetzt anrufen: +49 1733828581
            </a>
          </div>
        </div>
      )}
    </div>
  )
}