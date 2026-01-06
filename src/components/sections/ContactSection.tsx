'use client'

import { useState, useEffect } from 'react'

// Style interfaces
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
  phoneCardTitle?: ContactSectionTextStyle
  phoneCardDescription?: ContactSectionTextStyle
  whatsappCardTitle?: ContactSectionTextStyle
  whatsappCardDescription?: ContactSectionTextStyle
  whatsappCardLink?: ContactSectionTextStyle
  emailCardTitle?: ContactSectionTextStyle
  emailCardDescription?: ContactSectionTextStyle
  phoneCardIcon?: { backgroundColor?: string; iconColor?: string }
  whatsappCardIcon?: { backgroundColor?: string; iconColor?: string }
  emailCardIcon?: { backgroundColor?: string; iconColor?: string }
  cardIcon?: { backgroundColor?: string }
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

// Contact content interface for actual contact data
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

// Default styles - HeroSection ile aynı renkler
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

const defaultContactContent: ContactContent = {
  businessName: 'Wellnesstal',
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

interface ContactSectionProps {
  brandName?: string
}

export default function ContactSection({ brandName = 'Wellnesstal Studio' }: ContactSectionProps) {
  const [contactSectionContent, setContactSectionContent] = useState<ContactSectionContent>(defaultContactSectionContent)
  const [contactSectionLoading, setContactSectionLoading] = useState(true)
  const [contactContent, setContactContent] = useState<ContactContent>(defaultContactContent)
  const [contactLoading, setContactLoading] = useState(true)
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>('')

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
            cards: {
              ...defaultContactSectionContent.cards,
              ...apiContent.cards,
              phone: { ...defaultContactSectionContent.cards.phone, ...apiContent.cards?.phone },
              whatsapp: { ...defaultContactSectionContent.cards.whatsapp, ...apiContent.cards?.whatsapp },
              email: { ...defaultContactSectionContent.cards.email, ...apiContent.cards?.email },
            },
            map: { ...defaultContactSectionContent.map, ...apiContent.map },
            openingHours: { ...defaultContactSectionContent.openingHours, ...apiContent.openingHours },
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

  return (
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
                    {brandName}
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
                    // getDay() returns: 0=Sunday, 1=Monday, 2=Tuesday, ..., 6=Saturday
                    // dayMapping index: 0=Monday, 1=Tuesday, ..., 5=Saturday, 6=Sunday
                    const todayIndex = new Date().getDay()
                    // Convert: Sunday(0) -> 6, Monday(1) -> 0, Tuesday(2) -> 1, etc.
                    const adjustedTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1
                    return dayMapping.map((dayInfo, index) => {
                      const dayData = contactContent.openingHours[dayInfo.key]
                      const hours = dayData?.closed ? contactSectionContent.openingHours.closedLabel : `${dayData?.open || '09:00'} - ${dayData?.close || '19:00'}`
                      const isToday = index === adjustedTodayIndex
                      return { day: dayInfo.label, hours, today: isToday, closed: dayData?.closed }
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
                            {' '}{contactSectionContent.openingHours.todayLabel}
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
  )
}
