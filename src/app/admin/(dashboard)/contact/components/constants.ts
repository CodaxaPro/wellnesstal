import { ContactStyles, ContactSettings, TabItem, DayName } from './types'

// Default styles
export const defaultStyles: ContactStyles = {
  pageTitle: {
    fontFamily: 'system-ui',
    fontSize: '24px',
    fontWeight: '700',
    color: '#2C2C2C'
  },
  sectionTitle: {
    fontFamily: 'system-ui',
    fontSize: '18px',
    fontWeight: '600',
    color: '#2C2C2C'
  },
  tabActive: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '500',
    color: '#637554',
    backgroundColor: '#eef1ea'
  },
  tabInactive: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '400',
    color: '#6B7280'
  },
  label: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '500',
    color: '#2C2C2C'
  },
  input: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#2C2C2C',
    borderColor: '#E5E7EB'
  },
  saveButton: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: '#9CAF88'
  },
  helpText: {
    fontFamily: 'system-ui',
    fontSize: '14px',
    fontWeight: '400',
    color: '#6B7280'
  },
  businessName: {
    fontFamily: 'system-ui',
    fontSize: '20px',
    fontWeight: '700',
    color: '#9CAF88'
  },
  tagline: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '500',
    color: '#2C2C2C'
  },
  description: {
    fontFamily: 'system-ui',
    fontSize: '16px',
    fontWeight: '400',
    color: '#666666'
  }
}

// Default content
export const defaultContent: ContactSettings = {
  businessInfo: {
    name: 'Wellnesstal',
    tagline: 'Premium Wellness & Headspa in Baesweiler',
    description: 'Ihre Oase der Entspannung im Herzen von Köln. Professionelle Wellness-Behandlungen für Körper und Seele.'
  },
  contact: {
    phone: '+49 1733828581',
    email: 'info@wellnesstal.de',
    whatsapp: '+49 1733828581'
  },
  address: {
    street: 'Reyplatz 10',
    city: 'Baesweiler',
    postalCode: '52499',
    country: 'Almanya',
    googleMapsUrl: 'https://maps.google.com/?q=Wellnesstal+Baesweiler'
  },
  openingHours: {
    monday: { open: '09:00', close: '19:00', closed: false },
    tuesday: { open: '09:00', close: '19:00', closed: false },
    wednesday: { open: '09:00', close: '19:00', closed: false },
    thursday: { open: '09:00', close: '19:00', closed: false },
    friday: { open: '09:00', close: '19:00', closed: false },
    saturday: { open: '10:00', close: '16:00', closed: false },
    sunday: { open: '', close: '', closed: true }
  },
  socialMedia: {
    instagram: 'https://instagram.com/wellnesstal',
    facebook: 'https://facebook.com/wellnesstal',
    whatsapp: 'https://wa.me/491733828581',
    website: 'https://wellnesstal.de'
  },
  seo: {
    metaTitle: 'Wellnesstal - Premium Wellness & Headspa in Baesweiler',
    metaDescription: 'Entspannung und Wellness in Köln. Professionelle Headspa-Behandlungen für Ihr Wohlbefinden. Jetzt Termin vereinbaren!',
    keywords: ['wellness', 'headspa', 'massage', 'köln', 'entspannung', 'aromatherapie', 'spa']
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    bookingConfirmations: true
  },
  styles: defaultStyles
}

export const tabs: TabItem[] = [
  { id: 'business', label: 'Geschäftsinformationen', icon: '🏢' },
  { id: 'contact', label: 'Kontaktdaten', icon: '📞' },
  { id: 'address', label: 'Adresse & Standort', icon: '📍' },
  { id: 'hours', label: 'Öffnungszeiten', icon: '🕐' },
  { id: 'social', label: 'Social Media', icon: '📱' },
  { id: 'seo', label: 'SEO Einstellungen', icon: '🔍' },
  { id: 'notifications', label: 'Benachrichtigungen', icon: '🔔' },
  { id: 'styles', label: 'Design Einstellungen', icon: '🎨' }
]

export const dayNames: DayName[] = [
  { key: 'monday', label: 'Montag' },
  { key: 'tuesday', label: 'Dienstag' },
  { key: 'wednesday', label: 'Mittwoch' },
  { key: 'thursday', label: 'Donnerstag' },
  { key: 'friday', label: 'Freitag' },
  { key: 'saturday', label: 'Samstag' },
  { key: 'sunday', label: 'Sonntag' }
]
