'use client'

import { useState, useEffect } from 'react'
import { BlockProps } from './types'

// Style interfaces - exact copy from ContactSection.tsx
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

interface ContactDataContent {
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

export interface ContactBlockContent {
  useGlobalContact?: boolean  // true = use homepage contact, false = use custom content
  brandName?: string
  // Section content (texts, labels)
  badge?: string
  sectionTitle?: string
  highlightedText?: string
  description?: string
  cards?: {
    phone?: { title?: string; description?: string }
    whatsapp?: { title?: string; description?: string; linkText?: string }
    email?: { title?: string; description?: string }
  }
  map?: { buttonText?: string }
  openingHoursLabels?: { title?: string; todayLabel?: string; closedLabel?: string }
  styles?: ContactSectionStyles
  // Contact data (actual info)
  contact?: ContactDataContent
  googleMapsUrl?: string
}

// Default styles - exact copy from ContactSection.tsx
const defaultStyles: ContactSectionStyles = {
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

const defaultSectionContent: ContactSectionContent = {
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
  styles: defaultStyles
}

const defaultContactData: ContactDataContent = {
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

export default function ContactBlock({ block }: BlockProps) {
  const [globalSectionData, setGlobalSectionData] = useState<ContactSectionContent | null>(null)
  const [globalContactData, setGlobalContactData] = useState<ContactDataContent | null>(null)
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  // Check if we should use global contact
  const useGlobalContact = block.content?.useGlobalContact !== false // default: true
  const brandName = block.content?.brandName || 'Wellnesstal Studio'

  // Fetch global contact data when useGlobalContact is true
  useEffect(() => {
    if (useGlobalContact) {
      setIsLoading(true)
      Promise.all([
        fetch('/api/content?section=contact-section').then(r => r.json()),
        fetch('/api/content?section=contact').then(r => r.json()),
        fetch('/api/content?section=contact-settings').then(r => r.json())
      ])
        .then(([sectionRes, contactRes, settingsRes]) => {
          // API returns: { success: true, data: { content: {...} } }
          if (sectionRes.success && sectionRes.data?.content) {
            const apiContent = sectionRes.data.content
            setGlobalSectionData({
              ...defaultSectionContent,
              ...apiContent,
              cards: {
                ...defaultSectionContent.cards,
                ...apiContent.cards,
                phone: { ...defaultSectionContent.cards.phone, ...apiContent.cards?.phone },
                whatsapp: { ...defaultSectionContent.cards.whatsapp, ...apiContent.cards?.whatsapp },
                email: { ...defaultSectionContent.cards.email, ...apiContent.cards?.email },
              },
              map: { ...defaultSectionContent.map, ...apiContent.map },
              openingHours: { ...defaultSectionContent.openingHours, ...apiContent.openingHours },
              styles: {
                ...defaultStyles,
                ...apiContent.styles,
                badge: { ...defaultStyles.badge, ...apiContent.styles?.badge },
                sectionTitle: { ...defaultStyles.sectionTitle, ...apiContent.styles?.sectionTitle },
                highlightedText: { ...defaultStyles.highlightedText, ...apiContent.styles?.highlightedText },
                description: { ...defaultStyles.description, ...apiContent.styles?.description },
                phoneCardTitle: { ...defaultStyles.phoneCardTitle, ...apiContent.styles?.phoneCardTitle },
                phoneCardDescription: { ...defaultStyles.phoneCardDescription, ...apiContent.styles?.phoneCardDescription },
                whatsappCardTitle: { ...defaultStyles.whatsappCardTitle, ...apiContent.styles?.whatsappCardTitle },
                whatsappCardDescription: { ...defaultStyles.whatsappCardDescription, ...apiContent.styles?.whatsappCardDescription },
                whatsappCardLink: { ...defaultStyles.whatsappCardLink, ...apiContent.styles?.whatsappCardLink },
                emailCardTitle: { ...defaultStyles.emailCardTitle, ...apiContent.styles?.emailCardTitle },
                emailCardDescription: { ...defaultStyles.emailCardDescription, ...apiContent.styles?.emailCardDescription },
                phoneCardIcon: { ...defaultStyles.phoneCardIcon, ...apiContent.styles?.phoneCardIcon },
                whatsappCardIcon: { ...defaultStyles.whatsappCardIcon, ...apiContent.styles?.whatsappCardIcon },
                emailCardIcon: { ...defaultStyles.emailCardIcon, ...apiContent.styles?.emailCardIcon },
                cardIcon: { ...defaultStyles.cardIcon, ...apiContent.styles?.cardIcon },
                mapTitle: { ...defaultStyles.mapTitle, ...apiContent.styles?.mapTitle },
                mapAddress: { ...defaultStyles.mapAddress, ...apiContent.styles?.mapAddress },
                mapButton: { ...defaultStyles.mapButton, ...apiContent.styles?.mapButton },
                openingHoursTitle: { ...defaultStyles.openingHoursTitle, ...apiContent.styles?.openingHoursTitle },
                dayLabel: { ...defaultStyles.dayLabel, ...apiContent.styles?.dayLabel },
                timeLabel: { ...defaultStyles.timeLabel, ...apiContent.styles?.timeLabel },
                todayBadge: { ...defaultStyles.todayBadge, ...apiContent.styles?.todayBadge },
                todayHighlight: { ...defaultStyles.todayHighlight, ...apiContent.styles?.todayHighlight },
              }
            })
          }
          if (contactRes.success && contactRes.data?.content) {
            const apiContact = contactRes.data.content
            setGlobalContactData({
              ...defaultContactData,
              ...apiContact,
              // Ensure address structure
              address: {
                ...defaultContactData.address,
                ...apiContact.address
              },
              // Ensure openingHours structure
              openingHours: {
                ...defaultContactData.openingHours,
                ...apiContact.openingHours
              }
            })
          } else {
            console.error('❌ Failed to load global contact:', contactRes)
            // Fallback to default if API fails
            setGlobalContactData(defaultContactData)
          }
          if (settingsRes.success && settingsRes.data?.content?.address?.googleMapsUrl) {
            setGoogleMapsUrl(settingsRes.data.content.address.googleMapsUrl)
          }
        })
        .catch(console.error)
        .finally(() => setIsLoading(false))
    }
  }, [useGlobalContact])

  // Get section content
  const sectionContent: ContactSectionContent = useGlobalContact && globalSectionData
    ? globalSectionData
    : {
        badge: block.content?.badge || defaultSectionContent.badge,
        sectionTitle: block.content?.sectionTitle || defaultSectionContent.sectionTitle,
        highlightedText: block.content?.highlightedText || defaultSectionContent.highlightedText,
        description: block.content?.description || defaultSectionContent.description,
        cards: {
          phone: { ...defaultSectionContent.cards.phone, ...block.content?.cards?.phone },
          whatsapp: { ...defaultSectionContent.cards.whatsapp, ...block.content?.cards?.whatsapp },
          email: { ...defaultSectionContent.cards.email, ...block.content?.cards?.email },
        },
        map: { ...defaultSectionContent.map, ...block.content?.map },
        openingHours: { ...defaultSectionContent.openingHours, ...block.content?.openingHoursLabels },
        styles: {
          ...defaultStyles,
          ...block.content?.styles,
        }
      }

  // Get contact data
  // Global mode: use API data if available, otherwise fallback to default
  // Custom mode: use block content, otherwise fallback to default
  const contactData: ContactDataContent = useGlobalContact
    ? (globalContactData || defaultContactData)
    : (block.content?.contact || defaultContactData)

  // Get maps URL
  const mapsUrl = useGlobalContact ? googleMapsUrl : (block.content?.googleMapsUrl || '')

  // Show loading state when fetching global data
  if (useGlobalContact && isLoading) {
    return (
      <section id="contact" className="py-20 lg:py-32 bg-cream">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-pulse">
            <div className="lg:col-span-1 space-y-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white p-8 rounded-2xl shadow-soft">
                  <div className="w-12 h-12 bg-sage-200 rounded-full mb-4"></div>
                  <div className="h-6 bg-sage-200 rounded w-32 mb-2"></div>
                  <div className="h-4 bg-sage-100 rounded w-full mb-4"></div>
                  <div className="h-5 bg-sage-300 rounded w-40"></div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-soft overflow-hidden h-full">
                <div className="h-64 lg:h-80 bg-sage-100"></div>
                <div className="p-8">
                  <div className="h-6 bg-sage-200 rounded w-40 mb-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="contact" className="py-20 lg:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          {/* Badge */}
          <div
            className="inline-block px-4 py-2 rounded-full mb-4"
            style={{
              fontFamily: sectionContent.styles?.badge?.fontFamily || defaultStyles.badge?.fontFamily,
              fontSize: sectionContent.styles?.badge?.fontSize || defaultStyles.badge?.fontSize,
              fontWeight: sectionContent.styles?.badge?.fontWeight || defaultStyles.badge?.fontWeight,
              color: sectionContent.styles?.badge?.color || defaultStyles.badge?.color,
              backgroundColor: sectionContent.styles?.badge?.backgroundColor || defaultStyles.badge?.backgroundColor,
            }}
          >
            {sectionContent.badge}
          </div>
          {/* Section Title */}
          <h2 className="mb-6">
            <span
              style={{
                fontFamily: sectionContent.styles?.sectionTitle?.fontFamily || defaultStyles.sectionTitle?.fontFamily,
                fontSize: sectionContent.styles?.sectionTitle?.fontSize || defaultStyles.sectionTitle?.fontSize,
                fontWeight: sectionContent.styles?.sectionTitle?.fontWeight || defaultStyles.sectionTitle?.fontWeight,
                color: sectionContent.styles?.sectionTitle?.color || defaultStyles.sectionTitle?.color,
              }}
            >
              {sectionContent.sectionTitle}{' '}
            </span>
            <span
              style={{
                fontFamily: sectionContent.styles?.highlightedText?.fontFamily || defaultStyles.highlightedText?.fontFamily,
                fontSize: sectionContent.styles?.highlightedText?.fontSize || defaultStyles.highlightedText?.fontSize,
                fontWeight: sectionContent.styles?.highlightedText?.fontWeight || defaultStyles.highlightedText?.fontWeight,
                color: sectionContent.styles?.highlightedText?.color || defaultStyles.highlightedText?.color,
              }}
            >
              {sectionContent.highlightedText}
            </span>
            <span
              style={{
                fontFamily: sectionContent.styles?.sectionTitle?.fontFamily || defaultStyles.sectionTitle?.fontFamily,
                fontSize: sectionContent.styles?.sectionTitle?.fontSize || defaultStyles.sectionTitle?.fontSize,
                fontWeight: sectionContent.styles?.sectionTitle?.fontWeight || defaultStyles.sectionTitle?.fontWeight,
                color: sectionContent.styles?.sectionTitle?.color || defaultStyles.sectionTitle?.color,
              }}
            >
              ?
            </span>
          </h2>
          {/* Description */}
          <p
            className="max-w-3xl mx-auto"
            style={{
              fontFamily: sectionContent.styles?.description?.fontFamily || defaultStyles.description?.fontFamily,
              fontSize: sectionContent.styles?.description?.fontSize || defaultStyles.description?.fontSize,
              fontWeight: sectionContent.styles?.description?.fontWeight || defaultStyles.description?.fontWeight,
              color: sectionContent.styles?.description?.color || defaultStyles.description?.color,
            }}
          >
            {sectionContent.description}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Methods */}
          <div className="lg:col-span-1 space-y-6">
            {/* Phone Card */}
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: sectionContent.styles?.phoneCardIcon?.backgroundColor || defaultStyles.phoneCardIcon?.backgroundColor }}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: sectionContent.styles?.phoneCardIcon?.iconColor || defaultStyles.phoneCardIcon?.iconColor }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3
                className="mb-2"
                style={{
                  fontFamily: sectionContent.styles?.phoneCardTitle?.fontFamily || defaultStyles.phoneCardTitle?.fontFamily,
                  fontSize: sectionContent.styles?.phoneCardTitle?.fontSize || defaultStyles.phoneCardTitle?.fontSize,
                  fontWeight: sectionContent.styles?.phoneCardTitle?.fontWeight || defaultStyles.phoneCardTitle?.fontWeight,
                  color: sectionContent.styles?.phoneCardTitle?.color || defaultStyles.phoneCardTitle?.color,
                }}
              >
                {sectionContent.cards.phone.title}
              </h3>
              <p
                className="mb-4"
                style={{
                  fontFamily: sectionContent.styles?.phoneCardDescription?.fontFamily || defaultStyles.phoneCardDescription?.fontFamily,
                  fontSize: sectionContent.styles?.phoneCardDescription?.fontSize || defaultStyles.phoneCardDescription?.fontSize,
                  fontWeight: sectionContent.styles?.phoneCardDescription?.fontWeight || defaultStyles.phoneCardDescription?.fontWeight,
                  color: sectionContent.styles?.phoneCardDescription?.color || defaultStyles.phoneCardDescription?.color,
                }}
              >
                {sectionContent.cards.phone.description}
              </p>
              <a
                href={`tel:${contactData.phone.replace(/\s/g, '')}`}
                className="hover:opacity-80 transition-colors"
                style={{
                  fontFamily: sectionContent.styles?.phoneCardDescription?.fontFamily || defaultStyles.phoneCardDescription?.fontFamily,
                  fontSize: sectionContent.styles?.phoneCardDescription?.fontSize || defaultStyles.phoneCardDescription?.fontSize,
                  fontWeight: sectionContent.styles?.phoneCardDescription?.fontWeight || defaultStyles.phoneCardDescription?.fontWeight,
                  color: sectionContent.styles?.phoneCardTitle?.color || defaultStyles.phoneCardTitle?.color,
                }}
              >
                {contactData.phone}
              </a>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: sectionContent.styles?.whatsappCardIcon?.backgroundColor || defaultStyles.whatsappCardIcon?.backgroundColor }}
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  style={{ color: sectionContent.styles?.whatsappCardIcon?.iconColor || defaultStyles.whatsappCardIcon?.iconColor }}
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </div>
              <h3
                className="mb-2"
                style={{
                  fontFamily: sectionContent.styles?.whatsappCardTitle?.fontFamily || defaultStyles.whatsappCardTitle?.fontFamily,
                  fontSize: sectionContent.styles?.whatsappCardTitle?.fontSize || defaultStyles.whatsappCardTitle?.fontSize,
                  fontWeight: sectionContent.styles?.whatsappCardTitle?.fontWeight || defaultStyles.whatsappCardTitle?.fontWeight,
                  color: sectionContent.styles?.whatsappCardTitle?.color || defaultStyles.whatsappCardTitle?.color,
                }}
              >
                {sectionContent.cards.whatsapp.title}
              </h3>
              <p
                className="mb-4"
                style={{
                  fontFamily: sectionContent.styles?.whatsappCardDescription?.fontFamily || defaultStyles.whatsappCardDescription?.fontFamily,
                  fontSize: sectionContent.styles?.whatsappCardDescription?.fontSize || defaultStyles.whatsappCardDescription?.fontSize,
                  fontWeight: sectionContent.styles?.whatsappCardDescription?.fontWeight || defaultStyles.whatsappCardDescription?.fontWeight,
                  color: sectionContent.styles?.whatsappCardDescription?.color || defaultStyles.whatsappCardDescription?.color,
                }}
              >
                {sectionContent.cards.whatsapp.description}
              </p>
              <a
                href={`https://wa.me/${contactData.phone.replace(/[\s+\-]/g, '')}?text=Hallo,%20ich%20interessiere%20mich%20für%20eine%20Wellness-Behandlung`}
                className="text-green-600 hover:text-green-700 transition-colors"
                style={{
                  fontFamily: sectionContent.styles?.whatsappCardLink?.fontFamily || defaultStyles.whatsappCardLink?.fontFamily,
                  fontSize: sectionContent.styles?.whatsappCardLink?.fontSize || defaultStyles.whatsappCardLink?.fontSize,
                  fontWeight: sectionContent.styles?.whatsappCardLink?.fontWeight || defaultStyles.whatsappCardLink?.fontWeight,
                  color: sectionContent.styles?.whatsappCardLink?.color || defaultStyles.whatsappCardLink?.color,
                }}
              >
                {sectionContent.cards.whatsapp.linkText}
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-white p-8 rounded-2xl shadow-soft hover:shadow-medium transition-all duration-300">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: sectionContent.styles?.emailCardIcon?.backgroundColor || defaultStyles.emailCardIcon?.backgroundColor }}
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{ color: sectionContent.styles?.emailCardIcon?.iconColor || defaultStyles.emailCardIcon?.iconColor }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3
                className="mb-2"
                style={{
                  fontFamily: sectionContent.styles?.emailCardTitle?.fontFamily || defaultStyles.emailCardTitle?.fontFamily,
                  fontSize: sectionContent.styles?.emailCardTitle?.fontSize || defaultStyles.emailCardTitle?.fontSize,
                  fontWeight: sectionContent.styles?.emailCardTitle?.fontWeight || defaultStyles.emailCardTitle?.fontWeight,
                  color: sectionContent.styles?.emailCardTitle?.color || defaultStyles.emailCardTitle?.color,
                }}
              >
                {sectionContent.cards.email.title}
              </h3>
              <p
                className="mb-4"
                style={{
                  fontFamily: sectionContent.styles?.emailCardDescription?.fontFamily || defaultStyles.emailCardDescription?.fontFamily,
                  fontSize: sectionContent.styles?.emailCardDescription?.fontSize || defaultStyles.emailCardDescription?.fontSize,
                  fontWeight: sectionContent.styles?.emailCardDescription?.fontWeight || defaultStyles.emailCardDescription?.fontWeight,
                  color: sectionContent.styles?.emailCardDescription?.color || defaultStyles.emailCardDescription?.color,
                }}
              >
                {sectionContent.cards.email.description}
              </p>
              <a
                href={`mailto:${contactData.email}`}
                className="hover:opacity-80 transition-colors"
                style={{
                  fontFamily: sectionContent.styles?.emailCardDescription?.fontFamily || defaultStyles.emailCardDescription?.fontFamily,
                  fontSize: sectionContent.styles?.emailCardDescription?.fontSize || defaultStyles.emailCardDescription?.fontSize,
                  fontWeight: sectionContent.styles?.emailCardDescription?.fontWeight || defaultStyles.emailCardDescription?.fontWeight,
                  color: sectionContent.styles?.phoneCardTitle?.color || defaultStyles.phoneCardTitle?.color,
                }}
              >
                {contactData.email}
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
                    style={{ backgroundColor: sectionContent.styles?.cardIcon?.backgroundColor || defaultStyles.cardIcon?.backgroundColor }}
                  >
                    <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3
                    className="mb-2"
                    style={{
                      fontFamily: sectionContent.styles?.mapTitle?.fontFamily || defaultStyles.mapTitle?.fontFamily,
                      fontSize: sectionContent.styles?.mapTitle?.fontSize || defaultStyles.mapTitle?.fontSize,
                      fontWeight: sectionContent.styles?.mapTitle?.fontWeight || defaultStyles.mapTitle?.fontWeight,
                      color: sectionContent.styles?.mapTitle?.color || defaultStyles.mapTitle?.color,
                    }}
                  >
                    {brandName}
                  </h3>
                  <p
                    style={{
                      fontFamily: sectionContent.styles?.mapAddress?.fontFamily || defaultStyles.mapAddress?.fontFamily,
                      fontSize: sectionContent.styles?.mapAddress?.fontSize || defaultStyles.mapAddress?.fontSize,
                      fontWeight: sectionContent.styles?.mapAddress?.fontWeight || defaultStyles.mapAddress?.fontWeight,
                      color: sectionContent.styles?.mapAddress?.color || defaultStyles.mapAddress?.color,
                    }}
                  >
                    {contactData.address.street}, {contactData.address.postalCode} {contactData.address.city}
                  </p>
                </div>

                {/* Interactive Map Button */}
                {mapsUrl && (
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-4 right-4 hover:opacity-90 px-4 py-2 rounded-lg transition-colors"
                    style={{
                      fontFamily: sectionContent.styles?.mapButton?.fontFamily || defaultStyles.mapButton?.fontFamily,
                      fontSize: sectionContent.styles?.mapButton?.fontSize || defaultStyles.mapButton?.fontSize,
                      fontWeight: sectionContent.styles?.mapButton?.fontWeight || defaultStyles.mapButton?.fontWeight,
                      color: sectionContent.styles?.mapButton?.color || defaultStyles.mapButton?.color,
                      backgroundColor: sectionContent.styles?.mapButton?.backgroundColor || defaultStyles.mapButton?.backgroundColor,
                    }}
                  >
                    {sectionContent.map.buttonText}
                  </a>
                )}
              </div>

              {/* Opening Hours */}
              <div className="p-8">
                <h3
                  className="mb-6"
                  style={{
                    fontFamily: sectionContent.styles?.openingHoursTitle?.fontFamily || defaultStyles.openingHoursTitle?.fontFamily,
                    fontSize: sectionContent.styles?.openingHoursTitle?.fontSize || defaultStyles.openingHoursTitle?.fontSize,
                    fontWeight: sectionContent.styles?.openingHoursTitle?.fontWeight || defaultStyles.openingHoursTitle?.fontWeight,
                    color: sectionContent.styles?.openingHoursTitle?.color || defaultStyles.openingHoursTitle?.color,
                  }}
                >
                  {sectionContent.openingHours.title}
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
                    const now = new Date()
                    const todayIndex = now.getDay()
                    // Convert JavaScript day index to our dayMapping index:
                    // Sunday(0) -> 6, Monday(1) -> 0, Tuesday(2) -> 1, Wednesday(3) -> 2, etc.
                    const adjustedTodayIndex = todayIndex === 0 ? 6 : todayIndex - 1
                    return dayMapping.map((dayInfo, index) => {
                      const dayData = contactData.openingHours[dayInfo.key]
                      const hours = dayData?.closed ? sectionContent.openingHours.closedLabel : `${dayData?.open || '09:00'} - ${dayData?.close || '19:00'}`
                      const isToday = index === adjustedTodayIndex
                      return { day: dayInfo.label, hours, today: isToday, closed: dayData?.closed }
                    })
                  })().map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between py-2 px-4 rounded-lg"
                      style={schedule.today ? {
                        backgroundColor: sectionContent.styles?.todayHighlight?.backgroundColor || defaultStyles.todayHighlight?.backgroundColor,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        borderColor: sectionContent.styles?.todayHighlight?.borderColor || defaultStyles.todayHighlight?.borderColor
                      } : {}}
                    >
                      <span
                        style={{
                          fontFamily: sectionContent.styles?.dayLabel?.fontFamily || defaultStyles.dayLabel?.fontFamily,
                          fontSize: sectionContent.styles?.dayLabel?.fontSize || defaultStyles.dayLabel?.fontSize,
                          fontWeight: sectionContent.styles?.dayLabel?.fontWeight || defaultStyles.dayLabel?.fontWeight,
                          color: sectionContent.styles?.dayLabel?.color || defaultStyles.dayLabel?.color,
                        }}
                      >
                        {schedule.day}
                        {schedule.today && (
                          <span
                            className="ml-2 px-2 py-1 rounded-full"
                            style={{
                              fontFamily: sectionContent.styles?.todayBadge?.fontFamily || defaultStyles.todayBadge?.fontFamily,
                              fontSize: sectionContent.styles?.todayBadge?.fontSize || defaultStyles.todayBadge?.fontSize,
                              fontWeight: sectionContent.styles?.todayBadge?.fontWeight || defaultStyles.todayBadge?.fontWeight,
                              color: sectionContent.styles?.todayBadge?.color || defaultStyles.todayBadge?.color,
                              backgroundColor: sectionContent.styles?.todayBadge?.backgroundColor || defaultStyles.todayBadge?.backgroundColor,
                            }}
                          >
                            {' '}{sectionContent.openingHours.todayLabel}
                          </span>
                        )}
                      </span>
                      <span
                        style={{
                          fontFamily: sectionContent.styles?.timeLabel?.fontFamily || defaultStyles.timeLabel?.fontFamily,
                          fontSize: sectionContent.styles?.timeLabel?.fontSize || defaultStyles.timeLabel?.fontSize,
                          fontWeight: schedule.today ? '600' : (sectionContent.styles?.timeLabel?.fontWeight || defaultStyles.timeLabel?.fontWeight),
                          color: schedule.closed ? '#9CA3AF' : (sectionContent.styles?.timeLabel?.color || defaultStyles.timeLabel?.color),
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
      </div>
    </section>
  )
}
