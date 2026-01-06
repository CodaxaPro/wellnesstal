// Page Types for Wellnesstal CMS
export interface Page {
  id: string
  slug: string
  title: string
  metaDescription: string
  metaTitle: string
  status: 'draft' | 'published'
  templateType: 'service' | 'about' | 'landing' | 'custom'
  content: PageContent
  seo: SEOSettings
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface PageContent {
  hero?: HeroBlock
  sections?: ContentSection[]
}

export interface HeroBlock {
  title: string
  subtitle: string
  image: string
  ctaText?: string
  ctaLink?: string
  backgroundType: 'image' | 'gradient' | 'color'
  backgroundColor?: string
}

export interface ContentSection {
  id: string
  type: 'text' | 'services' | 'gallery' | 'contact' | 'testimonials' | 'features'
  title: string
  content: any
  orderIndex: number
  visible: boolean
}

export interface TextSection {
  content: string
  layout: 'single' | 'two-column' | 'three-column'
  alignment: 'left' | 'center' | 'right'
}

export interface ServicesSection {
  services: ServiceItem[]
  displayType: 'grid' | 'list' | 'carousel'
  showPrices: boolean
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  price: string
  duration: string
  image: string
  featured: boolean
}

export interface GallerySection {
  images: GalleryImage[]
  layout: 'grid' | 'masonry' | 'carousel'
  columns: 2 | 3 | 4
}

export interface GalleryImage {
  id: string
  url: string
  alt: string
  caption?: string
}

export interface ContactSection {
  showForm: boolean
  showMap: boolean
  showHours: boolean
  customText?: string
}

export interface SEOSettings {
  metaTitle: string
  metaDescription: string
  keywords: string[]
  ogImage?: string
  canonicalUrl?: string
  noIndex: boolean
  noFollow: boolean
}

// Page Template Definitions
export interface PageTemplate {
  id: string
  name: string
  description: string
  preview: string
  defaultContent: PageContent
  availableSections: string[]
}

export const pageTemplates: PageTemplate[] = [
  {
    id: 'service',
    name: 'Service Detail',
    description: 'Einzelne Service-Seite mit Details, Preisen und Buchung',
    preview: '/templates/service-preview.jpg',
    defaultContent: {
      hero: {
        title: 'Service Name',
        subtitle: 'Service Beschreibung',
        image: '',
        ctaText: 'Jetzt buchen',
        ctaLink: 'tel:+491733828581',
        backgroundType: 'image'
      },
      sections: [
        {
          id: '1',
          type: 'text',
          title: 'Über diese Behandlung',
          content: {
            content: 'Detaillierte Beschreibung der Behandlung...',
            layout: 'single',
            alignment: 'left'
          },
          orderIndex: 1,
          visible: true
        },
        {
          id: '2',
          type: 'features',
          title: 'Vorteile',
          content: {
            features: [
              { title: 'Stressabbau', description: 'Tiefe Entspannung' },
              { title: 'Wellness', description: 'Körperliches Wohlbefinden' }
            ]
          },
          orderIndex: 2,
          visible: true
        }
      ]
    },
    availableSections: ['text', 'features', 'gallery', 'contact', 'testimonials']
  },
  {
    id: 'about',
    name: 'Über Uns',
    description: 'Unternehmens-Story, Team und Werte',
    preview: '/templates/about-preview.jpg',
    defaultContent: {
      hero: {
        title: 'Über Wellnesstal',
        subtitle: 'Unsere Geschichte und Mission',
        image: '',
        backgroundType: 'gradient',
        backgroundColor: '#9CAF88'
      },
      sections: [
        {
          id: '1',
          type: 'text',
          title: 'Unsere Geschichte',
          content: {
            content: 'Seit 2019 widmen wir uns...',
            layout: 'single',
            alignment: 'left'
          },
          orderIndex: 1,
          visible: true
        }
      ]
    },
    availableSections: ['text', 'gallery', 'contact']
  },
  {
    id: 'landing',
    name: 'Landing Page',
    description: 'Conversion-optimierte Seite für Marketing',
    preview: '/templates/landing-preview.jpg',
    defaultContent: {
      hero: {
        title: 'Spezial Angebot',
        subtitle: 'Nur für kurze Zeit',
        image: '',
        ctaText: 'Jetzt Termin buchen',
        backgroundType: 'image'
      },
      sections: [
        {
          id: '1',
          type: 'services',
          title: 'Unsere Services',
          content: {
            services: [],
            displayType: 'grid',
            showPrices: true
          },
          orderIndex: 1,
          visible: true
        },
        {
          id: '2',
          type: 'testimonials',
          title: 'Kundenstimmen',
          content: {},
          orderIndex: 2,
          visible: true
        }
      ]
    },
    availableSections: ['services', 'testimonials', 'contact', 'gallery', 'text']
  }
]

// Form Types for Page Creation/Editing
export interface CreatePageForm {
  title: string
  slug: string
  templateType: string
  metaDescription: string
  status: 'draft' | 'published'
}

export interface UpdatePageForm {
  title?: string
  slug?: string
  metaDescription?: string
  metaTitle?: string
  status?: 'draft' | 'published'
  content?: PageContent
  seo?: Partial<SEOSettings>
}

// API Response Types
export interface PagesResponse {
  pages: Page[]
  total: number
  page: number
  limit: number
}

export interface PageResponse {
  page: Page
}

// Utility Types
export type PageStatus = 'draft' | 'published'
export type TemplateType = 'service' | 'about' | 'landing' | 'custom'
export type SectionType = 'text' | 'services' | 'gallery' | 'contact' | 'testimonials' | 'features'