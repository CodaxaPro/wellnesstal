// Text style interface
export interface TextStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
}

// Contact Settings Styles
export interface ContactStyles {
  pageTitle?: TextStyle
  sectionTitle?: TextStyle
  tabActive?: TextStyle
  tabInactive?: TextStyle
  label?: TextStyle
  input?: TextStyle
  saveButton?: TextStyle
  helpText?: TextStyle
  businessName?: TextStyle
  tagline?: TextStyle
  description?: TextStyle
}

export interface ContactSettings {
  businessInfo: {
    name: string
    tagline: string
    description: string
  }
  contact: {
    phone: string
    email: string
    whatsapp: string
  }
  address: {
    street: string
    city: string
    postalCode: string
    country: string
    googleMapsUrl: string
  }
  openingHours: {
    [key: string]: {
      open: string
      close: string
      closed: boolean
    }
  }
  socialMedia: {
    instagram: string
    facebook: string
    whatsapp: string
    website: string
  }
  seo: {
    metaTitle: string
    metaDescription: string
    keywords: string[]
  }
  notifications: {
    emailNotifications: boolean
    smsNotifications: boolean
    bookingConfirmations: boolean
  }
  styles?: ContactStyles
}

export interface TabItem {
  id: string
  label: string
  icon: string
}

export interface DayName {
  key: string
  label: string
}

// Common props for tab components
export interface TabCommonProps {
  settings: ContactSettings
  handleInputChange: (section: keyof ContactSettings, field: string, value: any) => void
}
