// Block Types for Enterprise Page System

export interface PageBlock {
  id: string
  page_id: string
  block_type: string
  content: Record<string, any>
  position: number
  visible: boolean
  custom_styles?: Record<string, any>
  created_at?: string
  updated_at?: string
}

export interface BlockProps {
  block: PageBlock
  isEditing?: boolean
  onUpdate?: (content: Record<string, any>) => void
}

// Individual Block Content Types

// Enterprise Hero Button Interface
export interface HeroButton {
  text: string
  link: string
  style: 'primary' | 'secondary' | 'outline' | 'ghost'
  size: 'sm' | 'md' | 'lg'
  icon?: string
  iconPosition?: 'left' | 'right'
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderRadius?: string
  hoverEffect?: 'scale' | 'glow' | 'slide' | 'none'
}

// Enterprise Hero Badge Interface
export interface HeroBadge {
  text: string
  icon?: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  animation?: 'pulse' | 'bounce' | 'none'
  // Typography
  fontSize?: string
  fontWeight?: string
  borderRadius?: string
  paddingX?: string
  paddingY?: string
}

// Enterprise Hero Trust Item
export interface HeroTrustItem {
  type: 'text' | 'icon' | 'image'
  content: string
  link?: string
}

// Enterprise Hero Image Styles
export interface HeroImageStyles {
  // Visual Effects
  borderRadius: string
  boxShadow: string
  opacity: number
  hoverScale: number
  brightness: number
  contrast: number
  saturation: number
  blur: number
  overlayOpacity: number
  overlayColor: string

  // Object Fit & Position
  objectFit: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  objectPosition: string

  // Dimension Controls
  sizeMode: 'auto' | 'fixed' | 'responsive' | 'aspect-ratio'
  width: string
  height: string
  maxWidth: string
  maxHeight: string
  minWidth: string
  minHeight: string
  aspectRatio: '16:9' | '4:3' | '3:2' | '1:1' | '2:3' | '3:4' | '9:16' | 'auto' | 'custom'
  customAspectRatio: string

  // Container Settings
  containerWidth: 'full' | 'max-w-lg' | 'max-w-xl' | 'max-w-2xl' | 'max-w-3xl' | 'max-w-4xl' | 'max-w-5xl' | 'max-w-6xl' | 'max-w-7xl' | 'custom'
  customContainerWidth: string
  containerHeight: 'auto' | 'screen' | 'fixed' | 'custom'
  customContainerHeight: string

  // Responsive Overrides
  mobileWidth: string
  mobileHeight: string
  tabletWidth: string
  tabletHeight: string
}

// Enterprise Hero Video Settings
export interface HeroVideoSettings {
  url: string
  provider: 'youtube' | 'vimeo' | 'custom' | 'upload'
  autoplay: boolean
  muted: boolean
  loop: boolean
  controls: boolean
  poster?: string
}

// Enterprise Hero Animation Settings
export interface HeroAnimationSettings {
  enabled: boolean
  titleAnimation: 'fade' | 'slide-up' | 'slide-down' | 'zoom' | 'typewriter' | 'none'
  subtitleAnimation: 'fade' | 'slide-up' | 'slide-down' | 'zoom' | 'none'
  imageAnimation: 'fade' | 'slide-left' | 'slide-right' | 'zoom' | 'parallax' | 'none'
  buttonAnimation: 'fade' | 'slide-up' | 'bounce' | 'none'
  staggerDelay: number
  duration: number
}

// Enterprise Hero Responsive Settings
export interface HeroResponsiveSettings {
  mobileLayout: 'stacked' | 'overlay' | 'image-only' | 'content-only'
  mobileTextAlign: 'left' | 'center' | 'right'
  mobileImagePosition: 'top' | 'bottom' | 'hidden'
  tabletLayout: 'split' | 'stacked' | 'overlay'
  hideOnMobile: string[] // array of element keys to hide
  mobileMinHeight: string
}

// Enterprise Content Element Alignment
export type ContentAlignment = 'left' | 'center' | 'right'

// Enterprise Hero Element Alignments
export interface HeroElementAlignments {
  badge: ContentAlignment
  title: ContentAlignment
  subtitle: ContentAlignment
  description: ContentAlignment
  buttons: ContentAlignment
  trustIndicator: ContentAlignment
}

// Enterprise Hero Content
export interface HeroContent {
  // Layout Settings
  layout: 'full-width' | 'split-left' | 'split-right' | 'centered' | 'overlay' | 'minimal'
  contentAlignment: 'left' | 'center' | 'right'
  verticalAlignment: 'top' | 'center' | 'bottom'
  minHeight: string
  maxWidth: string
  padding: {
    top: string
    bottom: string
    left: string
    right: string
  }

  // Enterprise Element-Level Alignments
  elementAlignments?: HeroElementAlignments

  // Content
  badge?: HeroBadge
  title: string
  titleHighlight?: {
    words: number[] // indices of words to highlight
    color: string
    style: 'color' | 'background' | 'underline' | 'gradient'
  }
  subtitle?: string
  description?: string

  // Buttons (multiple support)
  buttons: HeroButton[]

  // Trust Elements
  trustIndicator?: {
    enabled: boolean
    items: HeroTrustItem[]
    layout: 'inline' | 'stacked'
  }

  // Media
  mediaType: 'image' | 'video' | 'gradient' | 'pattern' | 'none'
  image?: {
    url: string
    alt: string
    focalPoint?: { x: number, y: number }
  }
  video?: HeroVideoSettings
  imageStyles: HeroImageStyles

  // Background
  backgroundType: 'solid' | 'gradient' | 'image' | 'video' | 'pattern'
  backgroundColor?: string
  gradientColors?: {
    from: string
    via?: string
    to: string
    direction: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
  }
  backgroundImage?: string
  backgroundOverlay?: {
    enabled: boolean
    color: string
    opacity: number
    blendMode: 'normal' | 'multiply' | 'overlay' | 'darken' | 'lighten'
  }
  backgroundPattern?: 'dots' | 'grid' | 'waves' | 'geometric' | 'none'

  // Typography Styles
  titleStyles?: {
    fontSize: string
    fontWeight: string
    lineHeight: string
    letterSpacing: string
    color: string
  }
  subtitleStyles?: {
    fontSize: string
    fontWeight: string
    lineHeight: string
    color: string
  }
  descriptionStyles?: {
    fontSize: string
    fontWeight: string
    lineHeight: string
    color: string
    maxWidth?: string
  }

  // Animations
  animations: HeroAnimationSettings

  // Responsive
  responsive: HeroResponsiveSettings

  // Legacy support
  ctaText?: string
  ctaLink?: string
  textColor?: string
  overlay?: boolean
}

export interface TextContent {
  title?: string
  content: string
  alignment?: 'left' | 'center' | 'right'
  columns?: 1 | 2 | 3
}

export interface FeatureItem {
  title: string
  description: string
  icon?: string
}

export interface FeaturesContent {
  title?: string
  subtitle?: string
  features: FeatureItem[]
  columns?: 2 | 3 | 4
}

export interface GalleryImage {
  id: string
  url: string
  alt?: string
  caption?: string
}

export interface GalleryContent {
  title?: string
  images: GalleryImage[]
  columns?: 2 | 3 | 4
  showLightbox?: boolean
}

export interface ServiceItem {
  id: string
  title: string
  description: string
  price?: string
  duration?: string
  image?: string
}

export interface ServicesContent {
  title?: string
  services: ServiceItem[]
  showPrices?: boolean
  layout?: 'grid' | 'list'
}

export interface PricingPackage {
  id: string
  name: string
  price: string
  period?: string
  description?: string
  features: string[]
  highlighted?: boolean
  ctaText?: string
  ctaLink?: string
}

export interface PricingContent {
  title?: string
  subtitle?: string
  packages: PricingPackage[]
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  company?: string
  content: string
  avatar?: string
  rating?: number
}

export interface TestimonialsContent {
  title?: string
  testimonials: Testimonial[]
  layout?: 'carousel' | 'grid'
}

export interface ContactContent {
  title?: string
  showForm?: boolean
  showMap?: boolean
  showInfo?: boolean
  mapUrl?: string
  customText?: string
}

export interface CtaContent {
  title: string
  subtitle?: string
  buttonText: string
  buttonLink: string
  backgroundColor?: 'sage' | 'forest' | 'charcoal' | 'custom'
  customBgColor?: string
}

export interface FaqItem {
  question: string
  answer: string
}

export interface FaqContent {
  title?: string
  items: FaqItem[]
}

export interface VideoContent {
  title?: string
  videoUrl: string
  provider?: 'youtube' | 'vimeo' | 'custom'
  autoplay?: boolean
  showControls?: boolean
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  image?: string
  social?: {
    linkedin?: string
    twitter?: string
    email?: string
  }
}

export interface TeamContent {
  title?: string
  subtitle?: string
  members: TeamMember[]
}

export interface StatItem {
  value: string
  label: string
  icon?: string
}

export interface StatsContent {
  title?: string
  stats: StatItem[]
  backgroundColor?: string
}

export interface DividerContent {
  height?: number
  showLine?: boolean
  lineColor?: string
}
