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

// ============================================
// ENTERPRISE TEXT BLOCK TYPES
// ============================================

// Text Block Layout Types
export type TextLayoutType = 'default' | 'narrow' | 'wide' | 'full' | 'split' | 'sidebar-left' | 'sidebar-right'

// Text Block Style Presets
export type TextStylePreset = 'article' | 'quote' | 'feature' | 'minimal' | 'card' | 'highlight' | 'custom'

// Rich Text Format Element
export interface TextFormatElement {
  type: 'bold' | 'italic' | 'underline' | 'strikethrough' | 'code' | 'link' | 'highlight'
  start: number
  end: number
  data?: Record<string, string>
}

// Text Block List Item
export interface TextListItem {
  id: string
  content: string
  checked?: boolean // for checklist
}

// Text Block CTA Button
export interface TextCTAButton {
  enabled: boolean
  text: string
  link: string
  style: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link'
  size: 'sm' | 'md' | 'lg'
  icon?: string
  iconPosition?: 'left' | 'right'
  backgroundColor?: string
  textColor?: string
  borderRadius?: string
  alignment?: 'left' | 'center' | 'right'
}

// Text Block Divider
export interface TextDivider {
  enabled: boolean
  style: 'solid' | 'dashed' | 'dotted' | 'gradient' | 'icon'
  color: string
  width: string // e.g., '50%', '100px'
  thickness: number
  marginTop: string
  marginBottom: string
  icon?: string
}

// Text Block Quote Styles
export interface TextQuoteStyles {
  style: 'simple' | 'bordered' | 'background' | 'large' | 'icon'
  borderColor: string
  backgroundColor: string
  iconColor: string
  authorColor: string
  quoteIcon: 'quotes' | 'chat' | 'none'
}

// Text Block Typography Settings
export interface TextTypography {
  // Title
  title: {
    enabled: boolean
    fontSize: string
    fontWeight: string
    lineHeight: string
    letterSpacing: string
    color: string
    marginBottom: string
  }
  // Subtitle
  subtitle: {
    enabled: boolean
    fontSize: string
    fontWeight: string
    lineHeight: string
    color: string
    marginBottom: string
  }
  // Body Text
  body: {
    fontSize: string
    fontWeight: string
    lineHeight: string
    letterSpacing: string
    color: string
    paragraphSpacing: string
  }
  // Drop Cap
  dropCap: {
    enabled: boolean
    lines: 2 | 3 | 4
    fontSize: string
    fontWeight: string
    color: string
    marginRight: string
  }
  // Links
  links: {
    color: string
    hoverColor: string
    decoration: 'none' | 'underline' | 'dotted'
    hoverDecoration: 'none' | 'underline' | 'dotted'
  }
}

// Text Block Background Settings
export interface TextBackground {
  type: 'none' | 'solid' | 'gradient' | 'image' | 'pattern'
  color?: string
  gradientFrom?: string
  gradientVia?: string
  gradientTo?: string
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
  imageUrl?: string
  imageOverlayOpacity?: number
  imageOverlayColor?: string
  pattern?: 'dots' | 'grid' | 'lines' | 'waves'
  patternOpacity?: number
}

// Text Block Border Settings
export interface TextBorderSettings {
  enabled: boolean
  style: 'solid' | 'dashed' | 'dotted' | 'double'
  width: number
  color: string
  radius: string
  sides: {
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean
  }
}

// Text Block Animation Settings
export interface TextAnimations {
  enabled: boolean
  type: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'zoom' | 'typewriter' | 'none'
  duration: number
  delay: number
  triggerOnScroll: boolean
  staggerParagraphs: boolean
  staggerDelay: number
}

// Text Block Responsive Settings
export interface TextResponsive {
  // Font sizes per breakpoint
  desktop: {
    titleSize: string
    bodySize: string
  }
  tablet: {
    titleSize: string
    bodySize: string
  }
  mobile: {
    titleSize: string
    bodySize: string
  }
  // Layout changes
  mobileColumns: 1
  mobileAlignment: 'left' | 'center' | 'right'
  mobilePadding: string
}

// Enterprise Text Content - Main Interface
export interface TextContent {
  // Basic Content
  title?: string
  subtitle?: string
  content: string

  // Content Type
  contentType: 'paragraph' | 'quote' | 'callout' | 'list' | 'code'

  // Quote specific
  quoteAuthor?: string
  quoteRole?: string
  quoteStyles?: TextQuoteStyles

  // List specific
  listType?: 'bullet' | 'numbered' | 'check' | 'icon'
  listItems?: TextListItem[]
  listIconColor?: string

  // Code specific
  codeLanguage?: string
  codeTheme?: 'light' | 'dark'

  // Layout Settings
  layout: TextLayoutType
  alignment: 'left' | 'center' | 'right' | 'justify'
  columns: 1 | 2 | 3
  columnGap: string

  // Container Settings
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'custom'
  customMaxWidth?: string
  padding: {
    top: string
    bottom: string
    left: string
    right: string
  }
  margin: {
    top: string
    bottom: string
  }

  // Typography
  typography: TextTypography

  // Background
  background: TextBackground

  // Border
  border: TextBorderSettings

  // Dividers
  topDivider?: TextDivider
  bottomDivider?: TextDivider

  // CTA Button
  ctaButton?: TextCTAButton

  // Animations
  animations: TextAnimations

  // Responsive
  responsive: TextResponsive

  // Style Preset
  stylePreset: TextStylePreset

  // Custom CSS Class
  customClass?: string

  // Visibility Controls
  showTitle: boolean
  showSubtitle: boolean

  // Legacy support
  columns_legacy?: 1 | 2 | 3
}

// ============================================
// ENTERPRISE FEATURES BLOCK TYPES
// ============================================

// Feature Icon Configuration
export interface FeatureIconConfig {
  type: 'preset' | 'emoji' | 'image' | 'lucide' | 'none'
  value: string // icon name, emoji, or image URL
  backgroundColor?: string
  iconColor?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  shape?: 'circle' | 'square' | 'rounded' | 'none'
  borderColor?: string
  borderWidth?: number
  shadow?: 'none' | 'sm' | 'md' | 'lg'
}

// Feature Badge (optional tag/label)
export interface FeatureBadge {
  text: string
  backgroundColor?: string
  textColor?: string
  position?: 'top-left' | 'top-right' | 'inline'
}

// Feature Link/CTA
export interface FeatureLink {
  enabled: boolean
  text?: string
  url: string
  style?: 'link' | 'button' | 'arrow'
  openInNewTab?: boolean
}

// Feature Image (for image-based features)
export interface FeatureImage {
  url: string
  alt?: string
  aspectRatio?: '16:9' | '4:3' | '1:1' | '3:2' | 'auto'
  objectFit?: 'cover' | 'contain' | 'fill'
  borderRadius?: string
}

// Individual Feature Item Styles
export interface FeatureItemStyles {
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: string
  padding?: string
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hoverEffect?: 'none' | 'lift' | 'scale' | 'glow' | 'border-color'
}

// Enterprise Feature Item
export interface FeatureItem {
  id?: string
  title: string
  description: string

  // Icon Configuration
  icon?: string // Legacy support
  iconConfig?: FeatureIconConfig

  // Optional Image
  image?: FeatureImage

  // Badge/Tag
  badge?: FeatureBadge

  // Link/CTA
  link?: FeatureLink

  // Individual Styles (overrides global)
  styles?: FeatureItemStyles

  // Visibility
  visible?: boolean
}

// Features Layout Types
export type FeaturesLayoutType =
  | 'grid'
  | 'list'
  | 'carousel'
  | 'masonry'
  | 'zigzag'
  | 'centered-stack'
  | 'icon-left'
  | 'icon-top'

// Global Card Styles
export interface FeaturesCardStyles {
  // Background
  backgroundColor: string
  backgroundHover?: string

  // Border
  borderStyle: 'none' | 'solid' | 'dashed'
  borderWidth: number
  borderColor: string
  borderRadius: string

  // Shadow
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shadowHover?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  // Hover Effects
  hoverEffect: 'none' | 'lift' | 'scale' | 'glow' | 'border-color' | 'bg-color'
  hoverTransitionDuration: number // in ms

  // Padding
  paddingX: string
  paddingY: string

  // Gap between elements inside card
  contentGap: string
}

// Global Icon Styles
export interface FeaturesIconStyles {
  // Visibility
  showIcons: boolean

  // Positioning
  position: 'top' | 'left' | 'right' | 'inline-title'

  // Size & Shape
  size: 'sm' | 'md' | 'lg' | 'xl' | 'custom'
  customSize?: string
  shape: 'circle' | 'square' | 'rounded' | 'none'

  // Colors
  backgroundColor: string
  iconColor: string

  // Effects
  shadow: 'none' | 'sm' | 'md' | 'lg'
  borderWidth: number
  borderColor: string

  // Animation on hover
  hoverAnimation: 'none' | 'bounce' | 'rotate' | 'scale' | 'shake'
}

// Typography Settings
export interface FeaturesTypography {
  // Section Title
  sectionTitle: {
    fontSize: string
    fontWeight: string
    color: string
    alignment: 'left' | 'center' | 'right'
    marginBottom: string
  }

  // Section Subtitle
  sectionSubtitle: {
    fontSize: string
    fontWeight: string
    color: string
    maxWidth: string
  }

  // Feature Title
  featureTitle: {
    fontSize: string
    fontWeight: string
    color: string
    lineHeight: string
  }

  // Feature Description
  featureDescription: {
    fontSize: string
    fontWeight: string
    color: string
    lineHeight: string
  }
}

// Features Background Settings
export interface FeaturesBackground {
  type: 'solid' | 'gradient' | 'image' | 'pattern' | 'none'
  color?: string
  gradientFrom?: string
  gradientVia?: string
  gradientTo?: string
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
  imageUrl?: string
  imageOverlayOpacity?: number
  pattern?: 'dots' | 'grid' | 'waves' | 'geometric'
}

// Features Animation Settings
export interface FeaturesAnimations {
  enabled: boolean
  type: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'zoom' | 'flip' | 'none'
  stagger: boolean
  staggerDelay: number // in ms
  duration: number // in ms
  triggerOnScroll: boolean
  // Icon animations
  iconAnimation: 'none' | 'bounce' | 'pulse' | 'spin' | 'wiggle'
}

// Features Responsive Settings
export interface FeaturesResponsive {
  // Columns per breakpoint
  desktop: 1 | 2 | 3 | 4 | 5 | 6
  tablet: 1 | 2 | 3 | 4
  mobile: 1 | 2

  // Gap per breakpoint
  desktopGap: string
  tabletGap: string
  mobileGap: string

  // Stack behavior on mobile
  mobileStackIcons: boolean
  mobileHideIcons: boolean
  mobileCardStyle: 'full' | 'compact' | 'minimal'
}

// Enterprise Features Content
export interface FeaturesContent {
  // Section Header
  title?: string
  subtitle?: string
  headerAlignment?: 'left' | 'center' | 'right'
  showDivider?: boolean
  dividerColor?: string

  // Features Data
  features: FeatureItem[]

  // Layout
  layout: FeaturesLayoutType
  columns?: 2 | 3 | 4 | 5 | 6  // Legacy support

  // Grid Settings
  gridGap: string
  alignItems: 'start' | 'center' | 'end' | 'stretch'

  // Carousel Settings (when layout = 'carousel')
  carousel?: {
    autoPlay: boolean
    autoPlayInterval: number
    showDots: boolean
    showArrows: boolean
    slidesPerView: number
    loop: boolean
  }

  // Global Styles
  cardStyles: FeaturesCardStyles
  iconStyles: FeaturesIconStyles
  typography: FeaturesTypography

  // Background
  background: FeaturesBackground

  // Section Padding
  padding: {
    top: string
    bottom: string
    left: string
    right: string
  }

  // Container
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'custom'
  customMaxWidth?: string

  // Animations
  animations: FeaturesAnimations

  // Responsive
  responsive: FeaturesResponsive

  // Visibility Controls
  showTitle: boolean
  showSubtitle: boolean
  showDescriptions: boolean
  showIcons: boolean
  showLinks: boolean

  // Custom CSS Class
  customClass?: string
}

// ==========================================
// Enterprise Gallery Block Types
// ==========================================

export interface GalleryImage {
  id: string
  url: string
  alt?: string
  caption?: string
  category?: string
}

export type GalleryLayoutType = 'grid' | 'masonry' | 'slider' | 'justified'
export type GalleryAspectRatio = 'square' | '4:3' | '16:9' | '3:2' | 'original'
export type GalleryHoverEffect = 'zoom' | 'fade' | 'slide-up' | 'overlay' | 'none'

export interface GalleryLayoutSettings {
  type: GalleryLayoutType
  columns: 2 | 3 | 4 | 5 | 6
  gap: number
  aspectRatio: GalleryAspectRatio
  mobileColumns: 1 | 2
}

export interface GalleryStyleSettings {
  borderRadius: number
  shadow: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hoverEffect: GalleryHoverEffect
  showCaption: boolean
  captionPosition: 'overlay' | 'below'
  overlayColor: string
  overlayOpacity: number
}

export interface GalleryLightboxSettings {
  enabled: boolean
  showThumbnails: boolean
  showCounter: boolean
  showCaption: boolean
  backgroundColor: string
  closeOnOverlayClick: boolean
}

export interface GalleryFilterSettings {
  enabled: boolean
  categories: string[]
  showAllButton: boolean
  allButtonText: string
}

export interface GalleryContent {
  // Header
  title?: string
  subtitle?: string

  // Images
  images: GalleryImage[]

  // Layout
  layout: GalleryLayoutSettings

  // Style
  style: GalleryStyleSettings

  // Lightbox
  lightbox: GalleryLightboxSettings

  // Filter
  filter: GalleryFilterSettings

  // Legacy support
  columns?: 2 | 3 | 4
  showLightbox?: boolean

  // Background
  backgroundColor?: string
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

// ============================================
// ENTERPRISE PRICING BLOCK TYPES
// ============================================

// Pricing Layout Types
export type PricingLayoutType =
  | 'grid'           // Standard grid layout
  | 'horizontal'     // Horizontal comparison
  | 'cards'          // Card style with shadows
  | 'minimal'        // Clean minimal design
  | 'featured'       // Featured package prominent
  | 'comparison'     // Full comparison table

// Pricing Period/Billing Cycle
export type PricingBillingCycle = 'monthly' | 'yearly' | 'weekly' | 'one-time' | 'custom'

// Feature Item (for packages)
export interface PricingFeatureItem {
  id: string
  text: string
  included: boolean
  tooltip?: string
  icon?: string
  highlight?: boolean
}

// Package Badge
export interface PricingBadge {
  enabled: boolean
  text: string
  backgroundColor?: string
  textColor?: string
  position?: 'top-left' | 'top-right' | 'top-center'
  animation?: 'none' | 'pulse' | 'bounce' | 'glow'
}

// Package CTA Button
export interface PricingCTA {
  text: string
  link: string
  style: 'primary' | 'secondary' | 'filled' | 'outline' | 'ghost' | 'gradient'
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  hoverBackgroundColor?: string
  borderRadius?: string
  fullWidth?: boolean
  icon?: string
  iconPosition?: 'left' | 'right'
}

// Package Styling
export interface PricingPackageStyle {
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: string
  shadowSize?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hoverEffect?: 'none' | 'lift' | 'scale' | 'glow' | 'border'
  // Header styling
  headerBackgroundColor?: string
  headerTextColor?: string
  // Price styling
  priceColor?: string
  priceFontSize?: string
  periodColor?: string
  // Feature styling
  featureTextColor?: string
  featureIconColor?: string
  checkmarkColor?: string
}

// Enterprise Pricing Package
export interface PricingPackage {
  id: string
  name: string
  // Pricing
  price: string
  yearlyPrice?: string    // For billing toggle
  originalPrice?: string  // For showing discounts
  period?: string
  billingCycle?: PricingBillingCycle
  customPeriodText?: string
  // Content
  subtitle?: string
  description?: string
  features: (string | PricingFeatureItem)[]
  // Highlighting
  highlighted?: boolean
  popular?: boolean
  recommended?: boolean
  // Badge
  badge?: PricingBadge
  // CTA
  ctaText?: string
  ctaLink?: string
  cta?: PricingCTA
  // Icon/Image
  icon?: string
  image?: string
  // Styling
  style?: PricingPackageStyle
  // Order
  order?: number
}

// Billing Toggle Settings
export interface PricingBillingToggle {
  enabled: boolean
  // Simple labels
  monthlyLabel?: string
  yearlyLabel?: string
  yearlySavings?: string  // e.g., "20% tasarruf"
  // Advanced options
  options?: {
    id: string
    label: string
    discount?: string  // e.g., "Save 20%"
  }[]
  defaultOption?: string
  style?: 'pills' | 'toggle' | 'tabs' | 'buttons'
  backgroundColor?: string
  activeBackgroundColor?: string
  textColor?: string
  activeTextColor?: string
}

// Section Header
export interface PricingSectionHeader {
  title?: string
  titleHighlight?: {
    enabled: boolean
    words: number[]
    color: string
    style: 'color' | 'background' | 'underline' | 'gradient'
  }
  subtitle?: string
  description?: string
  alignment?: 'left' | 'center' | 'right'
  // Typography object (new)
  typography?: {
    titleSize?: string
    titleWeight?: number
    titleLineHeight?: number
    subtitleSize?: string
    subtitleColor?: string
  }
  // Legacy Typography
  titleFontSize?: string
  titleFontWeight?: string
  titleColor?: string
  subtitleFontSize?: string
  subtitleColor?: string
  descriptionColor?: string
  // Badge above title
  badge?: {
    enabled?: boolean
    text: string
    backgroundColor?: string
    textColor?: string
  }
}

// Background Settings
export interface PricingBackground {
  type: 'solid' | 'gradient' | 'image' | 'pattern'
  color?: string
  gradientFrom?: string
  gradientVia?: string
  gradientTo?: string
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
  imageUrl?: string
  imagePosition?: string
  imageSize?: 'cover' | 'contain' | 'auto'
  overlayEnabled?: boolean
  overlayColor?: string
  overlayOpacity?: number
  pattern?: 'dots' | 'grid' | 'lines' | 'waves'
  patternColor?: string
  patternOpacity?: number
}

// Animation Settings
export interface PricingAnimations {
  enabled: boolean
  type?: 'fadeUp' | 'fadeIn' | 'slideIn' | 'scale' | 'none'
  headerAnimation?: 'none' | 'fade' | 'slide-up' | 'slide-down'
  packageAnimation?: 'none' | 'fade' | 'slide-up' | 'zoom' | 'flip'
  stagger?: number
  staggerDelay?: number
  delay?: number
  duration?: number
  triggerOnScroll?: boolean
  hoverEffects?: boolean
}

// Responsive Settings
export interface PricingResponsive {
  desktop: {
    columns: 1 | 2 | 3 | 4
    gap: string
    padding: string
  }
  tablet: {
    columns: 1 | 2 | 3
    gap: string
    padding: string
  }
  mobile: {
    columns: 1 | 2
    gap: string
    padding: string
    stackPackages: boolean
  }
}

// Comparison Table Settings
export interface PricingComparisonTable {
  enabled: boolean
  title?: string
  showIcons?: boolean
  showFeatureLabels?: boolean
  featureCategories?: {
    id: string
    name: string
    features: string[]
  }[]
  headerSticky?: boolean
  stripedRows?: boolean
  highlightDifferences?: boolean
}

// Money Back Guarantee / Trust Element
export interface PricingTrustElement {
  enabled: boolean
  type: 'money-back' | 'free-trial' | 'custom'
  text: string
  icon?: string
  duration?: string  // e.g., "30 days"
  position: 'above-packages' | 'below-packages' | 'in-footer'
}

// FAQ Section (optional in pricing)
export interface PricingFAQ {
  enabled?: boolean
  title?: string
  items?: {
    question: string
    answer: string
  }[]
  layout?: 'accordion' | 'grid' | 'list'
}

// Enterprise Pricing Content - Main Interface
export interface PricingContent {
  // Layout
  layout?: PricingLayoutType
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

  // Section Header
  header?: PricingSectionHeader

  // Legacy support
  title?: string
  subtitle?: string

  // Packages
  packages?: PricingPackage[]

  // Billing Toggle
  billingToggle?: PricingBillingToggle

  // Comparison Table
  comparisonTable?: PricingComparisonTable

  // Background
  background?: PricingBackground

  // Spacing
  padding?: {
    top: string
    bottom: string
  }
  packageGap?: string

  // Animations
  animations?: PricingAnimations

  // Responsive
  responsive?: PricingResponsive

  // Trust Elements
  trustElement?: PricingTrustElement

  // FAQ
  faq?: PricingFAQ

  // Footer CTA
  footerCta?: {
    enabled?: boolean
    text?: string
    subtext?: string
    buttonText?: string
    buttonLink?: string
    buttonStyle?: 'primary' | 'secondary' | 'outline'
  }

  // Custom CSS
  customClass?: string

  // Section ID for navigation
  sectionId?: string

  // Global Package Styling (applies to all if not overridden)
  defaultPackageStyle?: PricingPackageStyle
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

// ============================================
// ENTERPRISE CTA BLOCK TYPES
// ============================================

// CTA Layout Types
export type CTALayoutType =
  | 'centered'      // Classic centered layout
  | 'split-left'    // Content left, decoration right
  | 'split-right'   // Decoration left, content right
  | 'full-width'    // Edge-to-edge with content overlay
  | 'minimal'       // Clean minimal design
  | 'card'          // Card-style with shadow
  | 'banner'        // Horizontal banner style

// CTA Button Style
export interface CTAButton {
  text: string
  link: string
  style: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient'
  size: 'sm' | 'md' | 'lg' | 'xl'
  // Colors
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  hoverBackgroundColor?: string
  hoverTextColor?: string
  // Shape
  borderRadius?: string
  borderWidth?: number
  // Effects
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hoverEffect?: 'none' | 'scale' | 'glow' | 'lift' | 'slide'
  // Icon
  icon?: string
  iconPosition?: 'left' | 'right'
  // Animation
  animation?: 'none' | 'pulse' | 'bounce' | 'shake'
}

// CTA Secondary Button (optional)
export interface CTASecondaryButton {
  enabled: boolean
  text: string
  link: string
  style: 'outline' | 'ghost' | 'link' | 'text'
  textColor?: string
  borderColor?: string
  hoverColor?: string
  icon?: string
  iconPosition?: 'left' | 'right'
}

// CTA Badge/Label
export interface CTABadge {
  enabled: boolean
  text: string
  backgroundColor?: string
  textColor?: string
  borderColor?: string
  borderRadius?: string
  animation?: 'none' | 'pulse' | 'bounce' | 'glow'
  icon?: string
}

// CTA Typography Settings
export interface CTATypography {
  // Title
  title: {
    fontSize: string
    fontWeight: string
    lineHeight: string
    letterSpacing: string
    color: string
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
  }
  // Subtitle
  subtitle: {
    fontSize: string
    fontWeight: string
    lineHeight: string
    color: string
    maxWidth: string
  }
  // Description
  description?: {
    fontSize: string
    fontWeight: string
    lineHeight: string
    color: string
    maxWidth: string
  }
}

// CTA Title Highlight
export interface CTATitleHighlight {
  enabled: boolean
  words: number[] // indices of words to highlight
  color: string
  style: 'color' | 'background' | 'underline' | 'gradient'
  gradientFrom?: string
  gradientTo?: string
}

// CTA Background Settings
export interface CTABackground {
  type: 'solid' | 'gradient' | 'image' | 'pattern' | 'video'
  // Solid
  color?: string
  // Gradient
  gradientFrom?: string
  gradientVia?: string
  gradientTo?: string
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl' | 'radial'
  gradientType?: 'linear' | 'radial' | 'conic'
  // Image
  imageUrl?: string
  imagePosition?: string
  imageSize?: 'cover' | 'contain' | 'auto'
  imageRepeat?: boolean
  // Overlay
  overlayEnabled?: boolean
  overlayColor?: string
  overlayOpacity?: number
  overlayBlendMode?: 'normal' | 'multiply' | 'overlay' | 'darken' | 'lighten' | 'screen'
  // Pattern
  pattern?: 'dots' | 'grid' | 'lines' | 'waves' | 'geometric' | 'diagonal'
  patternColor?: string
  patternOpacity?: number
  patternSize?: 'sm' | 'md' | 'lg'
}

// CTA Decoration Element
export interface CTADecoration {
  enabled: boolean
  type: 'image' | 'icon' | 'shape' | 'illustration'
  // Image
  imageUrl?: string
  imageAlt?: string
  // Icon
  icon?: string
  iconSize?: string
  iconColor?: string
  // Shape
  shape?: 'circle' | 'square' | 'blob' | 'triangle'
  shapeColor?: string
  shapeSize?: string
  // Position & Effects
  position?: 'left' | 'right' | 'background'
  opacity?: number
  blur?: number
  animation?: 'none' | 'float' | 'pulse' | 'rotate' | 'bounce'
}

// CTA Animation Settings
export interface CTAAnimations {
  enabled: boolean
  // Entry animations
  titleAnimation: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'typewriter'
  subtitleAnimation: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'zoom'
  buttonAnimation: 'none' | 'fade' | 'slide-up' | 'bounce' | 'scale'
  decorationAnimation: 'none' | 'fade' | 'slide' | 'zoom' | 'parallax'
  // Timing
  staggerDelay: number
  duration: number
  delay: number
  // Scroll trigger
  triggerOnScroll: boolean
  // Background effects
  backgroundAnimation?: 'none' | 'gradient-shift' | 'parallax' | 'pulse'
}

// CTA Responsive Settings
export interface CTAResponsive {
  // Desktop settings
  desktop: {
    titleSize: string
    subtitleSize: string
    buttonSize: 'sm' | 'md' | 'lg' | 'xl'
    padding: string
  }
  // Tablet settings
  tablet: {
    titleSize: string
    subtitleSize: string
    buttonSize: 'sm' | 'md' | 'lg'
    layout?: 'stacked' | 'original'
    padding: string
  }
  // Mobile settings
  mobile: {
    titleSize: string
    subtitleSize: string
    buttonSize: 'sm' | 'md' | 'lg'
    layout: 'stacked' | 'original'
    textAlign: 'left' | 'center' | 'right'
    hideDecoration: boolean
    padding: string
  }
}

// CTA Border Settings
export interface CTABorderSettings {
  enabled: boolean
  style: 'solid' | 'dashed' | 'dotted' | 'double'
  width: number
  color: string
  radius: string
  sides: {
    top: boolean
    right: boolean
    bottom: boolean
    left: boolean
  }
}

// Enterprise CTA Content - Main Interface
export interface CTAContent {
  // Layout
  layout: CTALayoutType
  alignment: 'left' | 'center' | 'right'
  verticalAlignment: 'top' | 'center' | 'bottom'

  // Container Settings
  minHeight: string
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'custom'
  customMaxWidth?: string
  padding: {
    top: string
    bottom: string
    left: string
    right: string
  }
  margin: {
    top: string
    bottom: string
  }

  // Content
  badge?: CTABadge
  title: string
  titleHighlight?: CTATitleHighlight
  subtitle?: string
  description?: string

  // Buttons
  primaryButton: CTAButton
  secondaryButton?: CTASecondaryButton
  buttonLayout: 'horizontal' | 'vertical' | 'stacked'
  buttonGap: string
  buttonAlignment: 'left' | 'center' | 'right'

  // Visual
  decoration?: CTADecoration

  // Typography
  typography: CTATypography

  // Background
  background: CTABackground

  // Border
  border?: CTABorderSettings

  // Shadow
  boxShadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'

  // Animations
  animations: CTAAnimations

  // Responsive
  responsive: CTAResponsive

  // Visibility Controls
  showBadge: boolean
  showSubtitle: boolean
  showDescription: boolean
  showSecondaryButton: boolean
  showDecoration: boolean

  // Custom CSS
  customClass?: string

  // Urgency/Scarcity Elements
  urgency?: {
    enabled: boolean
    type: 'countdown' | 'limited' | 'badge'
    text?: string
    endDate?: string
    badgeColor?: string
  }

  // Trust Elements
  trustElements?: {
    enabled: boolean
    items: Array<{
      type: 'icon' | 'text' | 'image'
      content: string
    }>
    layout: 'inline' | 'stacked'
  }

  // Legacy support
  backgroundColor?: 'sage' | 'forest' | 'charcoal' | 'custom'
  customBgColor?: string
  buttonText?: string
  buttonLink?: string
}

// ============================================
// ENTERPRISE FAQ BLOCK TYPES
// ============================================

// FAQ Layout Types
export type FAQLayoutType =
  | 'accordion'       // Classic accordion (one open at a time)
  | 'accordion-multi' // Accordion with multiple open
  | 'grid'            // Grid cards layout
  | 'tabs'            // Tabbed categories
  | 'search'          // With search functionality
  | 'timeline'        // Timeline style
  | 'minimal'         // Clean minimal list
  | 'cards'           // Card-based layout

// FAQ Item Icon Configuration
export interface FAQIconConfig {
  type: 'preset' | 'emoji' | 'lucide' | 'none'
  value: string
  backgroundColor?: string
  iconColor?: string
  size?: 'sm' | 'md' | 'lg'
}

// FAQ Category (for grouping)
export interface FAQCategory {
  id: string
  name: string
  icon?: FAQIconConfig
  description?: string
  order?: number
}

// Enterprise FAQ Item
export interface FAQItem {
  id: string
  question: string
  answer: string
  // Categorization
  categoryId?: string
  tags?: string[]
  // Visual
  icon?: FAQIconConfig
  // Featured/Important
  featured?: boolean
  pinned?: boolean
  // Meta
  order?: number
  views?: number
  helpful?: {
    yes: number
    no: number
  }
  // Rich Content
  answerFormat?: 'text' | 'markdown' | 'html'
  media?: {
    type: 'image' | 'video' | 'link'
    url: string
    caption?: string
  }
  // Links
  relatedLinks?: {
    text: string
    url: string
  }[]
}

// FAQ Section Header
export interface FAQSectionHeader {
  title?: string
  titleHighlight?: {
    enabled: boolean
    words: number[]
    color: string
    style: 'color' | 'background' | 'underline' | 'gradient'
  }
  subtitle?: string
  description?: string
  alignment?: 'left' | 'center' | 'right'
  // Badge
  badge?: {
    enabled: boolean
    text: string
    backgroundColor?: string
    textColor?: string
  }
  // Typography
  typography?: {
    titleSize?: string
    titleWeight?: string
    titleColor?: string
    subtitleSize?: string
    subtitleColor?: string
    descriptionSize?: string
    descriptionColor?: string
  }
}

// FAQ Search Settings
export interface FAQSearchConfig {
  enabled: boolean
  placeholder?: string
  position?: 'above-items' | 'in-header' | 'sticky'
  // Search behavior
  searchInAnswers?: boolean
  highlightMatches?: boolean
  minCharacters?: number
  // Styling
  backgroundColor?: string
  borderColor?: string
  borderRadius?: string
  iconColor?: string
  // No results
  noResultsText?: string
  noResultsIcon?: string
}

// FAQ Accordion Styles
export interface FAQAccordionStyle {
  // Container
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: string
  shadow?: 'none' | 'sm' | 'md' | 'lg'
  // Spacing
  gap?: string
  padding?: string
  // Question Row
  questionBackgroundColor?: string
  questionHoverBackgroundColor?: string
  questionPadding?: string
  questionBorderRadius?: string
  // Answer
  answerBackgroundColor?: string
  answerPadding?: string
  // Icon
  expandIcon?: 'chevron' | 'plus' | 'arrow' | 'caret' | 'none'
  expandIconPosition?: 'left' | 'right'
  expandIconColor?: string
  expandIconSize?: string
  // Open state
  openBackgroundColor?: string
  openBorderColor?: string
  openShadow?: 'none' | 'sm' | 'md' | 'lg'
}

// FAQ Card Styles
export interface FAQCardStyle {
  backgroundColor?: string
  borderColor?: string
  borderWidth?: number
  borderRadius?: string
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  padding?: string
  hoverEffect?: 'none' | 'lift' | 'scale' | 'glow' | 'border'
  hoverBorderColor?: string
  hoverBackgroundColor?: string
}

// FAQ Typography Settings
export interface FAQTypography {
  // Question
  question: {
    fontSize?: string
    fontWeight?: string
    lineHeight?: string
    color?: string
    hoverColor?: string
  }
  // Answer
  answer: {
    fontSize?: string
    fontWeight?: string
    lineHeight?: string
    color?: string
  }
  // Category
  category?: {
    fontSize?: string
    fontWeight?: string
    color?: string
  }
}

// FAQ Background Settings
export interface FAQBackground {
  type: 'solid' | 'gradient' | 'image' | 'pattern' | 'none'
  color?: string
  gradientFrom?: string
  gradientVia?: string
  gradientTo?: string
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
  imageUrl?: string
  imagePosition?: string
  imageSize?: 'cover' | 'contain' | 'auto'
  overlayEnabled?: boolean
  overlayColor?: string
  overlayOpacity?: number
  pattern?: 'dots' | 'grid' | 'lines' | 'waves'
  patternColor?: string
  patternOpacity?: number
}

// FAQ Animation Settings
export interface FAQAnimations {
  enabled: boolean
  // Entry animations
  type?: 'fade' | 'slide-up' | 'slide-left' | 'zoom' | 'none'
  // Accordion animations
  expandAnimation?: 'smooth' | 'spring' | 'instant'
  expandDuration?: number
  // Stagger
  stagger?: boolean
  staggerDelay?: number
  duration?: number
  delay?: number
  // Scroll trigger
  triggerOnScroll?: boolean
  // Hover effects
  hoverEffects?: boolean
}

// FAQ Responsive Settings
export interface FAQResponsive {
  desktop: {
    columns: 1 | 2 | 3
    gap: string
    padding: string
  }
  tablet: {
    columns: 1 | 2
    gap: string
    padding: string
  }
  mobile: {
    columns: 1
    gap: string
    padding: string
    compactMode?: boolean
  }
}

// FAQ Helpful Votes Settings
export interface FAQHelpfulVotes {
  enabled: boolean
  position?: 'bottom' | 'inline'
  text?: string // "Was this helpful?"
  yesText?: string
  noText?: string
  showCounts?: boolean
  style?: 'buttons' | 'thumbs' | 'stars'
}

// FAQ Contact CTA (at bottom of FAQ section)
export interface FAQContactCTA {
  enabled: boolean
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  buttonStyle?: 'primary' | 'secondary' | 'outline'
  icon?: string
  backgroundColor?: string
  borderRadius?: string
}

// FAQ Schema Markup Settings
export interface FAQSchemaMarkup {
  enabled: boolean
  includeInHead?: boolean
}

// Enterprise FAQ Content - Main Interface
export interface FAQContent {
  // Layout
  layout: FAQLayoutType
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

  // Section Header
  header?: FAQSectionHeader

  // Legacy support
  title?: string
  subtitle?: string

  // Categories (for tabs/grouped layout)
  categories?: FAQCategory[]
  showCategories?: boolean
  categoryStyle?: 'tabs' | 'pills' | 'buttons' | 'dropdown'

  // FAQ Items
  items: FAQItem[]

  // Search
  search?: FAQSearchConfig

  // Accordion Settings
  accordionSettings?: {
    allowMultipleOpen?: boolean
    defaultOpenIndex?: number | number[]
    collapseOthersOnOpen?: boolean
  }

  // Styles
  accordionStyle?: FAQAccordionStyle
  cardStyle?: FAQCardStyle
  typography?: FAQTypography

  // Background
  background?: FAQBackground

  // Spacing
  padding?: {
    top: string
    bottom: string
  }
  itemGap?: string

  // Animations
  animations?: FAQAnimations

  // Responsive
  responsive?: FAQResponsive

  // Helpful Votes
  helpfulVotes?: FAQHelpfulVotes

  // Contact CTA
  contactCTA?: FAQContactCTA

  // Schema Markup (SEO)
  schemaMarkup?: FAQSchemaMarkup

  // Footer text
  footerText?: string

  // Custom CSS
  customClass?: string

  // Section ID for navigation
  sectionId?: string

  // View mode toggle (for users)
  allowViewToggle?: boolean
  defaultView?: 'accordion' | 'grid'
}

// Legacy support interfaces (keep backward compatibility)
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

// ============================================
// ENTERPRISE TEAM BLOCK TYPES
// ============================================

// Team Layout Types
export type TeamLayoutType =
  | 'grid'           // Standard grid layout
  | 'carousel'       // Carousel slider
  | 'masonry'        // Masonry layout
  | 'list'           // Vertical list
  | 'featured'       // Featured member prominent
  | 'cards'          // Card-based with hover effects
  | 'minimal'        // Clean minimal design
  | 'hexagon'        // Hexagon grid pattern

// Team Member Social Links
export interface TeamMemberSocial {
  linkedin?: string
  twitter?: string
  instagram?: string
  facebook?: string
  github?: string
  youtube?: string
  tiktok?: string
  website?: string
  email?: string
  phone?: string
}

// Team Member Badge
export interface TeamMemberBadge {
  enabled: boolean
  text: string
  backgroundColor?: string
  textColor?: string
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
}

// Team Member Skills
export interface TeamMemberSkill {
  id: string
  name: string
  level?: number // 0-100
  color?: string
}

// Enterprise Team Member
export interface TeamMember {
  id: string
  name: string
  role: string
  bio?: string
  image?: string
  // Extended fields
  department?: string
  location?: string
  joinDate?: string
  // Social Links
  social?: TeamMemberSocial
  // Badge
  badge?: TeamMemberBadge
  // Skills
  skills?: TeamMemberSkill[]
  // Featured
  featured?: boolean
  // Order
  order?: number
  // Quote
  quote?: string
  // Individual Styling
  style?: {
    cardBackgroundColor?: string
    nameColor?: string
    roleColor?: string
  }
  // Per-member image settings
  imageSettings?: {
    objectFit?: 'cover' | 'contain' | 'fill'
    position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
    scale?: number // 1 = 100%, 1.2 = 120%
    grayscale?: boolean
    brightness?: number // 0-200, 100 = normal
    contrast?: number // 0-200, 100 = normal
  }
}

// Team Section Header
export interface TeamSectionHeader {
  title?: string
  titleHighlight?: {
    enabled: boolean
    words: number[]
    color: string
    style: 'color' | 'background' | 'underline' | 'gradient'
  }
  subtitle?: string
  description?: string
  alignment?: 'left' | 'center' | 'right'
  // Badge
  badge?: {
    enabled: boolean
    text: string
    backgroundColor?: string
    textColor?: string
  }
  // Typography
  typography?: {
    titleSize?: string
    titleWeight?: string
    titleColor?: string
    subtitleSize?: string
    subtitleColor?: string
    descriptionSize?: string
    descriptionColor?: string
  }
}

// Team Card Style
export interface TeamCardStyle {
  // Background
  backgroundColor?: string
  backgroundHover?: string
  // Border
  borderStyle?: 'none' | 'solid' | 'dashed'
  borderWidth?: number
  borderColor?: string
  borderRadius?: string
  // Shadow
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  shadowHover?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  // Hover Effects
  hoverEffect?: 'none' | 'lift' | 'scale' | 'glow' | 'border-color' | 'bg-color' | 'flip'
  hoverTransitionDuration?: number
  // Padding
  padding?: string
  // Content Alignment
  contentAlignment?: 'left' | 'center' | 'right'
}

// Team Image Style
export interface TeamImageStyle {
  // Shape
  shape?: 'circle' | 'square' | 'rounded' | 'hexagon'
  // Size
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full' | 'custom'
  customSize?: string
  // Aspect Ratio
  aspectRatio?: '1:1' | '3:4' | '4:3' | '16:9' | 'auto'
  // Border
  borderWidth?: number
  borderColor?: string
  // Effects
  grayscale?: boolean
  grayscaleHover?: boolean
  brightness?: number
  contrast?: number
  // Overlay
  overlayColor?: string
  overlayOpacity?: number
  overlayOnHover?: boolean
  // Hover
  hoverScale?: number
  // Object Fit
  objectFit?: 'cover' | 'contain' | 'fill'
  objectPosition?: string
  // Placeholder
  showInitials?: boolean
  initialsBackgroundColor?: string
  initialsTextColor?: string
}

// Team Social Style
export interface TeamSocialStyle {
  // Visibility
  showSocial?: boolean
  position?: 'below-info' | 'overlay' | 'on-hover' | 'beside-name'
  // Icon Style
  iconSize?: 'sm' | 'md' | 'lg'
  iconShape?: 'circle' | 'square' | 'rounded' | 'none'
  iconColor?: string
  iconBackgroundColor?: string
  iconHoverColor?: string
  iconHoverBackgroundColor?: string
  // Spacing
  gap?: string
  // Animation
  animation?: 'none' | 'fade' | 'slide-up' | 'scale'
}

// Team Typography Settings
export interface TeamTypography {
  // Name
  name: {
    fontSize?: string
    fontWeight?: string
    color?: string
    hoverColor?: string
    lineHeight?: string
  }
  // Role
  role: {
    fontSize?: string
    fontWeight?: string
    color?: string
    textTransform?: 'none' | 'uppercase' | 'lowercase' | 'capitalize'
    lineHeight?: string
  }
  // Bio
  bio: {
    fontSize?: string
    fontWeight?: string
    color?: string
    lineHeight?: string
    maxLines?: number
  }
  // Department
  department?: {
    fontSize?: string
    fontWeight?: string
    color?: string
  }
  // Quote
  quote?: {
    fontSize?: string
    fontWeight?: string
    fontStyle?: 'normal' | 'italic'
    color?: string
    lineHeight?: string
    borderColor?: string
    borderWidth?: string
  }
}

// Team Background Settings
export interface TeamBackground {
  type: 'solid' | 'gradient' | 'image' | 'pattern' | 'none'
  color?: string
  gradientFrom?: string
  gradientVia?: string
  gradientTo?: string
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
  imageUrl?: string
  imagePosition?: string
  imageSize?: 'cover' | 'contain' | 'auto'
  overlayEnabled?: boolean
  overlayColor?: string
  overlayOpacity?: number
  pattern?: 'dots' | 'grid' | 'lines' | 'waves' | 'geometric'
  patternColor?: string
  patternOpacity?: number
}

// Team Animation Settings
export interface TeamAnimations {
  enabled: boolean
  type?: 'fade' | 'slide-up' | 'slide-left' | 'slide-right' | 'zoom' | 'flip' | 'none'
  stagger?: boolean
  staggerDelay?: number
  duration?: number
  delay?: number
  triggerOnScroll?: boolean
  hoverEffects?: boolean
  // Card animations
  cardAnimation?: 'none' | 'fade' | 'slide-up' | 'zoom' | 'flip'
  // Image animations
  imageAnimation?: 'none' | 'zoom' | 'rotate' | 'parallax'
}

// Team Responsive Settings
export interface TeamResponsive {
  desktop: {
    columns: 1 | 2 | 3 | 4 | 5 | 6
    gap: string
    padding: string
  }
  tablet: {
    columns: 1 | 2 | 3 | 4
    gap: string
    padding: string
  }
  mobile: {
    columns: 1 | 2
    gap: string
    padding: string
    stackCards?: boolean
  }
}

// Team Carousel Settings
export interface TeamCarouselSettings {
  autoPlay?: boolean
  autoPlayInterval?: number
  showDots?: boolean
  showArrows?: boolean
  slidesPerView?: number
  loop?: boolean
  pauseOnHover?: boolean
  arrowStyle?: 'circle' | 'square' | 'minimal'
  arrowColor?: string
  dotStyle?: 'dots' | 'lines' | 'numbers'
  dotColor?: string
  dotActiveColor?: string
}

// Team Filter/Search Settings
export interface TeamFilterSettings {
  enabled: boolean
  filterBy?: 'department' | 'role' | 'skills' | 'custom'
  showSearch?: boolean
  searchPlaceholder?: string
  filterStyle?: 'tabs' | 'pills' | 'dropdown' | 'buttons'
  filterPosition?: 'above-grid' | 'sidebar'
}

// Team CTA (Join Our Team)
export interface TeamCTA {
  enabled: boolean
  title?: string
  subtitle?: string
  buttonText?: string
  buttonLink?: string
  buttonStyle?: 'primary' | 'secondary' | 'outline'
  backgroundColor?: string
  position?: 'below-grid' | 'as-card' | 'floating'
}

// Enterprise Team Content - Main Interface
export interface TeamContent {
  // Layout
  layout?: TeamLayoutType
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'

  // Section Header
  header?: TeamSectionHeader

  // Legacy support
  title?: string
  subtitle?: string

  // Members
  members: TeamMember[]

  // Filtering
  filter?: TeamFilterSettings

  // Carousel (when layout = 'carousel')
  carousel?: TeamCarouselSettings

  // Styles
  cardStyle?: TeamCardStyle
  imageStyle?: TeamImageStyle
  socialStyle?: TeamSocialStyle
  typography?: TeamTypography

  // Background
  background?: TeamBackground

  // Spacing
  padding?: {
    top: string
    bottom: string
  }
  memberGap?: string

  // Animations
  animations?: TeamAnimations

  // Responsive
  responsive?: TeamResponsive

  // CTA
  cta?: TeamCTA

  // Visibility Controls
  showBio?: boolean
  showDepartment?: boolean
  showSkills?: boolean
  showQuote?: boolean
  showSocial?: boolean

  // Custom CSS
  customClass?: string

  // Section ID
  sectionId?: string

  // Grid settings for legacy
  columns?: 2 | 3 | 4 | 5 | 6
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

// ==========================================
// WhatsApp Block Types
// ==========================================

export interface WhatsAppBasicSettings {
  enabled: boolean
  phoneNumber: string
  useOriginalStyle: boolean
  position: 'bottom-right' | 'bottom-left'
}

export interface WhatsAppAppearanceSettings {
  buttonColor: string
  buttonHoverColor: string
  iconColor: string
  size: 'small' | 'medium' | 'large'
  shadow: boolean
  pulseAnimation: boolean
  borderRadius: 'full' | 'rounded' | 'square'
}

export interface WhatsAppMessageSettings {
  defaultMessage: string
  tooltipText: string
  tooltipDelay: number
  showTooltipOnLoad: boolean
  autoShowTooltipAfter: number
}

export interface WhatsAppDisplaySettings {
  showOnMobile: boolean
  showOnDesktop: boolean
  showOnAllPages: boolean
  excludedPages: string[]
  showAfterDelay: number
  showAfterScroll: number
}

export interface WhatsAppAvailabilitySettings {
  mode: 'always-online' | 'always-offline' | 'based-on-hours' | 'manual'
  manualStatus: boolean
  showIndicator: boolean
  onlineColor: string
  offlineColor: string
  offlineMessage: string
}

export interface WhatsAppCtaBubbleSettings {
  enabled: boolean
  title: string
  message: string
  backgroundColor: string
  textColor: string
  titleColor: string
  showAfterDelay: number
  dismissable: boolean
}

export interface WhatsAppContent {
  basic: WhatsAppBasicSettings
  appearance: WhatsAppAppearanceSettings
  message: WhatsAppMessageSettings
  display: WhatsAppDisplaySettings
  availability: WhatsAppAvailabilitySettings
  ctaBubble: WhatsAppCtaBubbleSettings
}

