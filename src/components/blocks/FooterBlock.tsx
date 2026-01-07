'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { BlockProps } from './types'

// Style interface - exact copy from layout/Footer.tsx
interface TextStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
}

interface FooterStyles {
  brandName?: TextStyle
  description?: TextStyle
  sectionTitle?: TextStyle
  link?: TextStyle
  newsletterTitle?: TextStyle
  copyright?: TextStyle
}

interface NewsletterContent {
  enabled: boolean
  title: string
  subtitle: string
  placeholder: string
  buttonText: string
  disclaimer: string
}

interface LinkItem {
  label: string
  href: string
}

interface ServiceItem {
  label: string
  href: string
}

export interface FooterBlockContent {
  useGlobalFooter?: boolean  // true = use homepage footer, false = use custom content
  brandName: string
  brandEmoji: string
  description: string
  socialMedia: {
    instagram: string
    facebook: string
    whatsapp: string
  }
  newsletter: NewsletterContent
  quickLinks: LinkItem[]
  legalLinks: LinkItem[]
  services: ServiceItem[]
  copyright: string
  styles?: FooterStyles
  // Contact info
  contact: {
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
      monday: { open: string; close: string; closed: boolean }
      tuesday: { open: string; close: string; closed: boolean }
      wednesday: { open: string; close: string; closed: boolean }
      thursday: { open: string; close: string; closed: boolean }
      friday: { open: string; close: string; closed: boolean }
      saturday: { open: string; close: string; closed: boolean }
      sunday: { open: string; close: string; closed: boolean }
    }
  }
}

// Default styles - original footer colors
const defaultStyles: FooterStyles = {
  brandName: {
    fontFamily: 'system-ui',
    fontSize: '30px',
    fontWeight: '700',
    color: '#9CAF88'  // sage-400
  },
  description: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#D1D5DB'  // gray-300
  },
  sectionTitle: {
    fontFamily: 'system-ui',
    fontSize: '18px',
    fontWeight: '600',
    color: '#9CAF88'  // sage-400
  },
  link: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#D1D5DB'  // gray-300
  },
  newsletterTitle: {
    fontFamily: 'system-ui',
    fontSize: '20px',
    fontWeight: '600',
    color: '#FFFFFF'
  },
  copyright: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '400',
    color: '#9CA3AF'  // gray-400
  }
}

const defaultContent: FooterBlockContent = {
  brandName: 'Wellnesstal',
  brandEmoji: '🌿',
  description: 'Ihre Oase der Entspannung im Herzen von Baesweiler. Professionelle Wellness-Behandlungen für Körper und Seele.',
  socialMedia: {
    instagram: 'https://instagram.com/wellnesstal',
    facebook: 'https://facebook.com/wellnesstal',
    whatsapp: 'https://wa.me/491733828581'
  },
  newsletter: {
    enabled: true,
    title: 'Newsletter abonnieren',
    subtitle: 'Bleiben Sie auf dem Laufenden über neue Behandlungen, Angebote und Wellness-Tipps.',
    placeholder: 'Ihre E-Mail-Adresse',
    buttonText: 'Anmelden',
    disclaimer: 'Kein Spam. Jederzeit abmeldbar.'
  },
  quickLinks: [
    { label: 'Start', href: '#home' },
    { label: 'Leistungen', href: '#services' },
    { label: 'Über uns', href: '#about' },
    { label: 'Kontakt', href: '#contact' }
  ],
  legalLinks: [
    { label: 'Impressum', href: '/impressum' },
    { label: 'Datenschutz', href: '/datenschutz' },
    { label: 'AGB', href: '/agb' },
    { label: 'Widerrufsrecht', href: '/widerruf' }
  ],
  services: [
    { label: 'Premium Headspa', href: '/services/headspa' },
    { label: 'Aromatherapie', href: '/services/aromatherapie' },
    { label: 'Wellness Massage', href: '/services/massage' },
    { label: 'Gesichtspflege', href: '/services/gesichtspflege' }
  ],
  copyright: '© 2024 Wellnesstal. Alle Rechte vorbehalten.',
  styles: defaultStyles,
  contact: {
    businessName: 'WellnessTal Studio',
    phone: '+49 1733828581',
    email: 'info@wellnesstal.de',
    address: {
      street: 'Reyplatz 10',
      city: 'Baesweiler',
      postalCode: '52499',
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
}

export default function FooterBlock({ block }: BlockProps) {
  const currentYear = new Date().getFullYear()
  const [globalFooterData, setGlobalFooterData] = useState<any>(null)
  const [globalContactData, setGlobalContactData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check if we should use global footer
  const useGlobalFooter = block.content?.useGlobalFooter !== false // default: true

  // Fetch global footer data when useGlobalFooter is true
  // Uses same API format as homepage Footer.tsx
  useEffect(() => {
    if (useGlobalFooter) {
      setIsLoading(true)
      Promise.all([
        fetch('/api/content?section=footer').then(r => r.json()),
        fetch('/api/content?section=contact').then(r => r.json())
      ])
        .then(([footerRes, contactRes]) => {
          // API returns: { success: true, data: { content: {...} } }
          if (footerRes.success && footerRes.data?.content) {
            setGlobalFooterData(footerRes.data.content)
          }
          if (contactRes.success && contactRes.data?.content) {
            setGlobalContactData(contactRes.data.content)
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false))
    }
  }, [useGlobalFooter])

  // Determine content source
  const getContent = (): FooterBlockContent => {
    if (useGlobalFooter && globalFooterData) {
      // Use global footer data (same as homepage Footer.tsx)
      // Deep merge exactly like homepage does
      return {
        useGlobalFooter: true,
        brandName: globalFooterData.brandName || defaultContent.brandName,
        brandEmoji: globalFooterData.brandEmoji || defaultContent.brandEmoji,
        description: globalFooterData.description || defaultContent.description,
        socialMedia: globalFooterData.socialMedia || defaultContent.socialMedia,
        newsletter: {
          ...defaultContent.newsletter,
          ...globalFooterData.newsletter,
        },
        quickLinks: globalFooterData.quickLinks || defaultContent.quickLinks,
        legalLinks: globalFooterData.legalLinks || defaultContent.legalLinks,
        services: globalFooterData.services || defaultContent.services,
        copyright: globalFooterData.copyright || defaultContent.copyright,
        // Deep merge styles exactly like homepage Footer.tsx
        styles: {
          ...defaultStyles,
          ...globalFooterData.styles,
          brandName: { ...defaultStyles.brandName, ...globalFooterData.styles?.brandName },
          description: { ...defaultStyles.description, ...globalFooterData.styles?.description },
          sectionTitle: { ...defaultStyles.sectionTitle, ...globalFooterData.styles?.sectionTitle },
          link: { ...defaultStyles.link, ...globalFooterData.styles?.link },
          newsletterTitle: { ...defaultStyles.newsletterTitle, ...globalFooterData.styles?.newsletterTitle },
          copyright: { ...defaultStyles.copyright, ...globalFooterData.styles?.copyright },
        },
        contact: globalContactData ? {
          ...defaultContent.contact,
          ...globalContactData,
        } : defaultContent.contact
      }
    }

    // Use custom block content
    return {
      ...defaultContent,
      ...block.content,
      socialMedia: { ...defaultContent.socialMedia, ...block.content?.socialMedia },
      newsletter: { ...defaultContent.newsletter, ...block.content?.newsletter },
      contact: {
        ...defaultContent.contact,
        ...block.content?.contact,
        address: { ...defaultContent.contact.address, ...block.content?.contact?.address },
        openingHours: { ...defaultContent.contact.openingHours, ...block.content?.contact?.openingHours }
      },
      styles: {
        ...defaultStyles,
        ...block.content?.styles,
        brandName: { ...defaultStyles.brandName, ...block.content?.styles?.brandName },
        description: { ...defaultStyles.description, ...block.content?.styles?.description },
        sectionTitle: { ...defaultStyles.sectionTitle, ...block.content?.styles?.sectionTitle },
        link: { ...defaultStyles.link, ...block.content?.styles?.link },
        newsletterTitle: { ...defaultStyles.newsletterTitle, ...block.content?.styles?.newsletterTitle },
        copyright: { ...defaultStyles.copyright, ...block.content?.styles?.copyright },
      }
    }
  }

  const content = getContent()
  const quickLinks = content.quickLinks || defaultContent.quickLinks
  const legalLinks = content.legalLinks || defaultContent.legalLinks
  const services = content.services || defaultContent.services

  // Show loading state when fetching global footer
  if (useGlobalFooter && isLoading) {
    return (
      <footer className="bg-charcoal text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-700 rounded mx-auto mb-4"></div>
            <div className="h-4 w-96 bg-gray-700 rounded mx-auto"></div>
          </div>
        </div>
      </footer>
    )
  }

  const socialLinks = [
    {
      name: 'Instagram',
      href: content.socialMedia.instagram,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.004 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.33-1.297C4.198 14.81 3.708 13.658 3.708 12.36s.49-2.45 1.297-3.331C5.886 8.147 7.038 7.657 8.336 7.657c1.297 0 2.45.49 3.331 1.297.881.881 1.372 2.033 1.372 3.331s-.49 2.45-1.297 3.331c-.881.881-2.033 1.372-3.33 1.372zm7.705-6.331c-.393-.975-.975-1.8-1.683-2.508-.708-.708-1.533-1.29-2.508-1.683-.975-.393-2.033-.588-3.091-.588s-2.116.195-3.091.588c-.975.393-1.8.975-2.508 1.683-.708.708-1.29 1.533-1.683 2.508-.393.975-.588 2.033-.588 3.091s.195 2.116.588 3.091c.393.975.975 1.8 1.683 2.508.708.708 1.533 1.29 2.508 1.683.975.393 2.033.588 3.091.588s2.116-.195 3.091-.588c.975-.393 1.8-.975 2.508-1.683.708-.708 1.29-1.533 1.683-2.508.393-.975.588-2.033.588-3.091s-.195-2.116-.588-3.091z"/>
        </svg>
      ),
    },
    {
      name: 'Facebook',
      href: content.socialMedia.facebook,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      name: 'WhatsApp',
      href: content.socialMedia.whatsapp,
      icon: (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
        </svg>
      ),
    },
  ]

  return (
    <footer className="bg-charcoal text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <Link
                href="/"
                className="mb-6 block"
                style={{
                  fontFamily: content.styles?.brandName?.fontFamily || defaultStyles.brandName?.fontFamily,
                  fontSize: content.styles?.brandName?.fontSize || defaultStyles.brandName?.fontSize,
                  fontWeight: content.styles?.brandName?.fontWeight || defaultStyles.brandName?.fontWeight,
                  color: content.styles?.brandName?.color || defaultStyles.brandName?.color,
                }}
              >
                {content.brandEmoji || '🌿'} {content.brandName || 'Wellnesstal'}
              </Link>
              <p
                className="leading-relaxed mb-6"
                style={{
                  fontFamily: content.styles?.description?.fontFamily || defaultStyles.description?.fontFamily,
                  fontSize: content.styles?.description?.fontSize || defaultStyles.description?.fontSize,
                  fontWeight: content.styles?.description?.fontWeight || defaultStyles.description?.fontWeight,
                  color: content.styles?.description?.color || defaultStyles.description?.color,
                }}
              >
                {content.description}
              </p>

              {/* Social Links */}
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <Link
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-sage-500 hover:bg-sage-400 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                    aria-label={`${social.name} folgen`}
                  >
                    {social.icon}
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3
                className="mb-6"
                style={{
                  fontFamily: content.styles?.sectionTitle?.fontFamily || defaultStyles.sectionTitle?.fontFamily,
                  fontSize: content.styles?.sectionTitle?.fontSize || defaultStyles.sectionTitle?.fontSize,
                  fontWeight: content.styles?.sectionTitle?.fontWeight || defaultStyles.sectionTitle?.fontWeight,
                  color: content.styles?.sectionTitle?.color || defaultStyles.sectionTitle?.color,
                }}
              >
                Navigation
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="hover:opacity-80 transition-colors duration-300 flex items-center group"
                      style={{
                        fontFamily: content.styles?.link?.fontFamily || defaultStyles.link?.fontFamily,
                        fontSize: content.styles?.link?.fontSize || defaultStyles.link?.fontSize,
                        fontWeight: content.styles?.link?.fontWeight || defaultStyles.link?.fontWeight,
                        color: content.styles?.link?.color || defaultStyles.link?.color,
                      }}
                    >
                      <span className="w-2 h-2 bg-sage-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h3
                className="mb-6"
                style={{
                  fontFamily: content.styles?.sectionTitle?.fontFamily || defaultStyles.sectionTitle?.fontFamily,
                  fontSize: content.styles?.sectionTitle?.fontSize || defaultStyles.sectionTitle?.fontSize,
                  fontWeight: content.styles?.sectionTitle?.fontWeight || defaultStyles.sectionTitle?.fontWeight,
                  color: content.styles?.sectionTitle?.color || defaultStyles.sectionTitle?.color,
                }}
              >
                Leistungen
              </h3>
              <ul className="space-y-3">
                {services.map((service) => (
                  <li key={service.href}>
                    <Link
                      href={service.href}
                      className="hover:opacity-80 transition-colors duration-300 flex items-center group"
                      style={{
                        fontFamily: content.styles?.link?.fontFamily || defaultStyles.link?.fontFamily,
                        fontSize: content.styles?.link?.fontSize || defaultStyles.link?.fontSize,
                        fontWeight: content.styles?.link?.fontWeight || defaultStyles.link?.fontWeight,
                        color: content.styles?.link?.color || defaultStyles.link?.color,
                      }}
                    >
                      <span className="w-2 h-2 bg-sage-500 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {service.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h3
                className="mb-6"
                style={{
                  fontFamily: content.styles?.sectionTitle?.fontFamily || defaultStyles.sectionTitle?.fontFamily,
                  fontSize: content.styles?.sectionTitle?.fontSize || defaultStyles.sectionTitle?.fontSize,
                  fontWeight: content.styles?.sectionTitle?.fontWeight || defaultStyles.sectionTitle?.fontWeight,
                  color: content.styles?.sectionTitle?.color || defaultStyles.sectionTitle?.color,
                }}
              >
                Kontakt
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-sage-400 mt-1 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div className="text-gray-300">
                    <div className="font-medium">{content.contact.businessName}</div>
                    <div>{content.contact.address.street}</div>
                    <div>{content.contact.address.postalCode} {content.contact.address.city}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-sage-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <Link
                    href={`tel:${content.contact.phone.replace(/\s/g, '')}`}
                    className="text-gray-300 hover:text-sage-400 transition-colors"
                  >
                    {content.contact.phone}
                  </Link>
                </div>

                <div className="flex items-center gap-3">
                  <svg className="h-5 w-5 text-sage-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <Link
                    href={`mailto:${content.contact.email}`}
                    className="text-gray-300 hover:text-sage-400 transition-colors"
                  >
                    {content.contact.email}
                  </Link>
                </div>

                {/* Opening Hours */}
                <div className="mt-6">
                  <h4 className="font-semibold text-sage-400 mb-3">Öffnungszeiten</h4>
                  <div className="space-y-1 text-sm text-gray-300">
                    <div className="flex justify-between">
                      <span>Mo - Fr:</span>
                      <span>
                        {content.contact.openingHours.monday.closed
                          ? 'Geschlossen'
                          : `${content.contact.openingHours.monday.open} - ${content.contact.openingHours.monday.close}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Samstag:</span>
                      <span>
                        {content.contact.openingHours.saturday.closed
                          ? 'Geschlossen'
                          : `${content.contact.openingHours.saturday.open} - ${content.contact.openingHours.saturday.close}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sonntag:</span>
                      <span className={content.contact.openingHours.sunday.closed ? 'text-gray-400' : ''}>
                        {content.contact.openingHours.sunday.closed
                          ? 'Geschlossen'
                          : `${content.contact.openingHours.sunday.open} - ${content.contact.openingHours.sunday.close}`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        {content.newsletter?.enabled !== false && (
          <div className="border-t border-gray-700 py-8">
            <div className="max-w-2xl mx-auto text-center">
              <h3
                className="mb-4"
                style={{
                  fontFamily: content.styles?.newsletterTitle?.fontFamily || defaultStyles.newsletterTitle?.fontFamily,
                  fontSize: content.styles?.newsletterTitle?.fontSize || defaultStyles.newsletterTitle?.fontSize,
                  fontWeight: content.styles?.newsletterTitle?.fontWeight || defaultStyles.newsletterTitle?.fontWeight,
                  color: content.styles?.newsletterTitle?.color || defaultStyles.newsletterTitle?.color,
                }}
              >
                {content.newsletter?.title || defaultContent.newsletter.title}
              </h3>
              <p
                className="mb-6"
                style={{
                  fontFamily: content.styles?.description?.fontFamily || defaultStyles.description?.fontFamily,
                  fontSize: content.styles?.description?.fontSize || defaultStyles.description?.fontSize,
                  fontWeight: content.styles?.description?.fontWeight || defaultStyles.description?.fontWeight,
                  color: content.styles?.description?.color || defaultStyles.description?.color,
                }}
              >
                {content.newsletter?.subtitle || defaultContent.newsletter.subtitle}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={content.newsletter?.placeholder || defaultContent.newsletter.placeholder}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:border-sage-400 focus:outline-none focus:ring-2 focus:ring-sage-400/20 transition-all duration-300"
                />
                <button className="bg-sage-500 hover:bg-sage-400 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 whitespace-nowrap">
                  {content.newsletter?.buttonText || defaultContent.newsletter.buttonText}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-3">
                {content.newsletter?.disclaimer || defaultContent.newsletter.disclaimer}
              </p>
            </div>
          </div>
        )}

        {/* Bottom Footer */}
        <div className="border-t border-gray-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div
              style={{
                fontFamily: content.styles?.copyright?.fontFamily || defaultStyles.copyright?.fontFamily,
                fontSize: content.styles?.copyright?.fontSize || defaultStyles.copyright?.fontSize,
                fontWeight: content.styles?.copyright?.fontWeight || defaultStyles.copyright?.fontWeight,
                color: content.styles?.copyright?.color || defaultStyles.copyright?.color,
              }}
            >
              © {currentYear} {content.brandName || content.contact.businessName}. Alle Rechte vorbehalten.
            </div>

            <div className="flex flex-wrap gap-6">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:opacity-80 transition-colors duration-300"
                  style={{
                    fontFamily: content.styles?.copyright?.fontFamily || defaultStyles.copyright?.fontFamily,
                    fontSize: content.styles?.copyright?.fontSize || defaultStyles.copyright?.fontSize,
                    fontWeight: content.styles?.copyright?.fontWeight || defaultStyles.copyright?.fontWeight,
                    color: content.styles?.copyright?.color || defaultStyles.copyright?.color,
                  }}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
