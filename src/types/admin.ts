// Admin User Types
export interface AdminUser {
  id: string
  username: string
  email: string
  role: 'admin' | 'editor'
  createdAt: string
  lastLogin: string
}

// Service Types
export interface Service {
  id: string
  title: string
  shortDescription: string
  longDescription: string
  duration: string
  price: string
  image: string
  benefits: string[]
  popular: boolean
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
}

// Testimonial Types
export interface Testimonial {
  id: string
  name: string
  location: string
  avatar: string
  rating: number
  service: string
  text: string
  verified: boolean
  source: 'Google' | 'Facebook' | 'Direct'
  date: string
  active: boolean
  order: number
  createdAt: string
  updatedAt: string
}

// Contact Info Types
export interface ContactInfo {
  id: string
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
  socialMedia: {
    instagram?: string
    facebook?: string
    whatsapp?: string
  }
  updatedAt: string
}

// Content Types
export interface Content {
  id: string
  section: 'hero' | 'about' | 'footer' | 'meta'
  key: string
  value: string | object
  type: 'text' | 'rich_text' | 'image' | 'json'
  updatedAt: string
}

// Media Types
export interface Media {
  id: string
  filename: string
  originalName: string
  mimeType: string
  size: number
  width?: number
  height?: number
  alt: string
  url: string
  uploadedAt: string
  usedIn: string[] // Where this media is being used
}

// Analytics Types
export interface Analytics {
  pageViews: number
  uniqueVisitors: number
  bounceRate: number
  avgSessionDuration: number
  topPages: Array<{
    page: string
    views: number
  }>
  contactRequests: number
  period: 'day' | 'week' | 'month'
  date: string
}

// Admin Panel State
export interface AdminState {
  user: AdminUser | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

// Form Types
export interface LoginForm {
  username: string
  password: string
}

export interface ServiceForm {
  title: string
  shortDescription: string
  longDescription: string
  duration: string
  price: string
  benefits: string[]
  popular: boolean
  active: boolean
  image?: File
}

export interface TestimonialForm {
  name: string
  location: string
  service: string
  text: string
  rating: number
  verified: boolean
  source: 'Google' | 'Facebook' | 'Direct'
  active: boolean
}