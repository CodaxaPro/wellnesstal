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
  hoverEffect?: 'scale' | 'glow' | 'slide' | 'lift' | 'shrink' | 'rotate' | 'pulse' | 'shake' | 'bounce' | 'gradient' | 'none'
  hoverBackgroundColor?: string
  hoverTextColor?: string
  animation?: 'none' | 'pulse' | 'bounce' | 'shake' | 'wiggle' | 'float' | 'glow-pulse'
  animationDuration?: number // milliseconds
  animationDelay?: number // milliseconds
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
  hoverShadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl'
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
  title: ContentAlignment
  buttons: ContentAlignment
  trustIndicator: ContentAlignment
}

// Hero Text Style
export interface HeroTextStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
}

// Hero Styles
export interface HeroStyles {
  badge?: HeroTextStyle
  mainTitle?: HeroTextStyle
  highlightedText?: HeroTextStyle
  subtitle?: HeroTextStyle
  description?: HeroTextStyle
  primaryButton?: HeroTextStyle
  secondaryButton?: HeroTextStyle
  trustIndicator?: HeroTextStyle
}

// Hero Image
export interface HeroImage {
  url: string
  alt: string
}

// Hero Image Styles (simplified from HeroImageStyles)
export interface HeroImageStyles {
  borderRadius?: string
  boxShadow?: string
  opacity?: string
  hoverScale?: string
  brightness?: string
  contrast?: string
  saturation?: string
  overlayOpacity?: string
  overlayColor?: string
}

// Enterprise Hero Content (based on /admin/content HeroEditor)
export interface HeroContent {
  // Content Fields
  badge?: string
  badgeEnabled?: boolean // Badge'in gösterilip gösterilmeyeceği
  mainTitle: string
  highlightedWordIndices?: number[] // Hangi kelime indekslerinin vurgulanacağı (0-based)
  subtitle?: string
  description?: string // Açıklama metni
  primaryButton?: string
  primaryButtonLink?: string
  primaryButtonIcon?: string
  primaryButtonIconPosition?: 'left' | 'right'
  secondaryButton?: string
  secondaryButtonLink?: string
  secondaryButtonIcon?: string
  secondaryButtonIconPosition?: 'left' | 'right'
  trustIndicator?: string
  trustIndicatorSubtext?: string // "⭐ 4.9/5 Bewertungen" gibi alt metin
  trustIndicatorSecondary?: string // "Kostenlose Beratung" gibi ikinci trust indicator
  trustIndicatorSecondarySubtext?: string // "Unverbindlich & persönlich" gibi ikinci alt metin
  
  // Scroll Indicator
  scrollIndicator?: {
    enabled?: boolean
    text?: string
    position?: {
      vertical: 'top' | 'center' | 'bottom'
      horizontal: 'left' | 'center' | 'right'
    }
  }
  
  // Image Floating Elements
  imageFloatingElements?: {
    // Status Badge (Jetzt geöffnet)
    statusBadge?: {
      enabled?: boolean
      text?: string
      position?: {
        vertical: 'top' | 'center' | 'bottom'
        horizontal: 'left' | 'center' | 'right'
      }
    }
    // Premium Card
    premiumCard?: {
      enabled?: boolean
      emoji?: string
      title?: string
      subtitle?: string
      position?: {
        vertical: 'top' | 'center' | 'bottom'
        horizontal: 'left' | 'center' | 'right'
      }
    }
    // Reviews Badge
    reviewsBadge?: {
      enabled?: boolean
      rating?: string
      text?: string
      position?: {
        vertical: 'top' | 'center' | 'bottom'
        horizontal: 'left' | 'center' | 'right'
      }
    }
  }
  
  // Image
  image?: HeroImage
  imageStyles?: HeroImageStyles
  
  // Styles
  styles?: HeroStyles
}

// ============================================
// ENTERPRISE TEXT BLOCK TYPES
// ============================================

// Text Block Layout Types
export type TextLayoutType = 'default' | 'narrow' | 'wide' | 'full' | 'split' | 'sidebar-left' | 'sidebar-right'

// Text Block Style Presets - 'about' is priority/default for brand consistency
export type TextStylePreset = 'about' | 'article' | 'quote' | 'feature' | 'minimal' | 'card' | 'highlight' | 'problem' | 'solution' | 'custom'

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

// Text Block Image
export interface TextImage {
  id: string
  url: string
  alt: string
  caption?: string
  width?: string // e.g., '100%', '300px', '50%'
  alignment?: 'left' | 'center' | 'right'
  borderRadius?: string
  shadow?: boolean
  link?: string
}

// Text Block Container Style
export type TextContainerStyle = 'none' | 'box' | 'card' | 'bordered' | 'shadow' | 'outlined'

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
    fontFamily?: string
  }
  // Subtitle
  subtitle: {
    enabled: boolean
    fontSize: string
    fontWeight: string
    lineHeight: string
    color: string
    marginBottom: string
    fontFamily?: string
  }
  // Body Text
  body: {
    fontSize: string
    fontWeight: string
    lineHeight: string
    letterSpacing: string
    color: string
    paragraphSpacing: string
    fontFamily?: string
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
  highlightedText?: string // Vurgulanacak kelime (title'ın son kelimesi otomatik, override edilebilir)
  useAutoHighlight?: boolean // Otomatik son kelime vurgulama (default: true)

  // Content Type
  contentType: 'paragraph' | 'quote' | 'callout' | 'list' | 'code'

  // Images/Media
  images?: TextImage[]
  imagePosition?: 'none' | 'left' | 'right' | 'top' | 'bottom' | 'full-width' | 'inline-left' | 'inline-right' | 'inline-center'
  imageSpacing?: string // spacing between image and text
  titlePosition?: 'top' | 'left' | 'right' | 'center' // Başlık konumu
  layoutType?: 'default' | 'split-left' | 'split-right' | 'image-left' | 'image-right' // Enterprise layout options

  // Container Style
  containerStyle?: TextContainerStyle
  containerPadding?: string
  containerBackground?: string
  containerBorderRadius?: string
  
  // Content Wrapper (center-content-wrapper / center-block)
  contentWrapper?: 'none' | 'center-content-wrapper' | 'center-block'
  wrapperMaxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'custom'
  wrapperCustomWidth?: string
  wrapperPadding?: string
  wrapperBackground?: string

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

// Feature List Item (for checkmark lists)
export interface FeatureListItem {
  id?: string
  text: string
  enabled?: boolean
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

  // Feature List (checkmark list)
  featuresList?: FeatureListItem[]
  showFeaturesList?: boolean

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
  // Partner/Double Package
  isPartner?: boolean
  partnerLabel?: string // e.g., "2x", "Partnertermin"
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

  // Tab System (Einzeltermin/Partnertermin)
  tabs?: {
    enabled?: boolean
    defaultTab?: 'einzeltermin' | 'partnertermin'
    labels?: {
      einzeltermin?: string
      partnertermin?: string
    }
    style?: 'pills' | 'tabs' | 'buttons'
  }

  // Show all features (including missing ones with X mark)
  showAllFeatures?: boolean

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
  readMoreLink?: {
    enabled?: boolean
    text?: string
    url?: string
  }
}

export interface StatItem {
  value: string
  label: string
}

export interface TestimonialsBlockStyles {
  badge?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    color?: string
    backgroundColor?: string
  }
  sectionTitle?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    color?: string
  }
  highlightedText?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    color?: string
  }
  description?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    color?: string
  }
  statsValue?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    color?: string
  }
  statsLabel?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    color?: string
  }
}

export interface TestimonialsContent {
  title?: string
  subtitle?: string
  // Ana sayfadaki gibi yeni alanlar
  badge?: string
  sectionTitle?: string
  highlightedText?: string
  description?: string
  autoSlideDelay?: number
  autoPlay?: boolean
  showRatings?: boolean
  maxDisplayCount?: number
  stats?: StatItem[]
  styles?: TestimonialsBlockStyles
  background?: {
    color?: string
    image?: string
  }
  cardStyles?: {
    mainCardBackground?: string
    mainCardRadius?: string
    smallCardBackground?: string
    smallCardRadius?: string
  }
  // Orijinal alanlar
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
// ABOUT BLOCK TYPES
// ============================================

export interface AboutImage {
  url: string
  alt: string
}

export interface AboutStat {
  label: string
  value: string
}

export interface AboutButtonStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
  backgroundColor?: string
  borderColor?: string
}

export interface AboutStyles {
  badge?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    color?: string
    backgroundColor?: string
  }
  title?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    color?: string
  }
  highlightedText?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    color?: string
  }
  description?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    color?: string
  }
  statsValue?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    color?: string
  }
  statsLabel?: {
    fontFamily?: string
    fontSize?: string
    fontWeight?: string
    color?: string
  }
  primaryButton?: AboutButtonStyle
  secondaryButton?: AboutButtonStyle
}

export interface AboutContent {
  badge?: string
  title?: string
  highlightedText?: string
  description?: string
  stats?: AboutStat[]
  primaryButton?: string
  primaryButtonLink?: string
  secondaryButton?: string
  secondaryButtonLink?: string
  images?: AboutImage[]
  styles?: AboutStyles
  background?: {
    color?: string
    image?: string
  }
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

// ==========================================
// Enterprise Embed Block Types
// ==========================================

// Embed Provider Types
export type EmbedProviderType =
  | 'custom'      // Custom HTML/iframe code
  | 'youtube'     // YouTube video
  | 'vimeo'       // Vimeo video
  | 'google-maps' // Google Maps embed
  | 'instagram'   // Instagram post/reel
  | 'twitter'     // Twitter/X post
  | 'facebook'    // Facebook post/video
  | 'tiktok'      // TikTok video
  | 'spotify'     // Spotify embed
  | 'soundcloud'  // SoundCloud embed
  | 'calendly'    // Calendly scheduler
  | 'typeform'    // Typeform embed
  | 'codepen'     // CodePen embed
  | 'figma'       // Figma embed
  | 'loom'        // Loom video
  | 'iframe'      // Generic iframe URL

// Embed Aspect Ratio Presets
export type EmbedAspectRatio =
  | '16:9'        // Standard video
  | '4:3'         // Classic
  | '1:1'         // Square
  | '9:16'        // Vertical/mobile video
  | '21:9'        // Ultrawide
  | 'auto'        // Auto based on content
  | 'custom'      // Custom ratio

// Embed Section Header
export interface EmbedSectionHeader {
  enabled?: boolean
  title?: string
  titleHighlight?: {
    enabled?: boolean
    words?: number[]
    color?: string
    style?: 'color' | 'background' | 'underline' | 'gradient'
  }
  subtitle?: string
  description?: string
  alignment?: 'left' | 'center' | 'right'
  badge?: {
    enabled?: boolean
    text?: string
    backgroundColor?: string
    textColor?: string
  }
  typography?: {
    titleSize?: string
    titleWeight?: string
    titleColor?: string
    subtitleSize?: string
    subtitleColor?: string
    marginBottom?: string
  }
}

// Embed Container Settings
export interface EmbedContainerSettings {
  maxWidth: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full' | 'custom'
  customMaxWidth?: string
  alignment: 'left' | 'center' | 'right'
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
}

// Embed Frame Settings
export interface EmbedFrameSettings {
  aspectRatio: EmbedAspectRatio
  customAspectRatio?: string
  minHeight?: string
  maxHeight?: string
  height?: string
  borderEnabled: boolean
  borderWidth?: number
  borderColor?: string
  borderStyle?: 'solid' | 'dashed' | 'dotted'
  borderRadius?: string
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  overflow?: 'hidden' | 'visible' | 'auto' | 'scroll'
}

// Embed Background Settings
export interface EmbedBackground {
  type?: 'none' | 'solid' | 'gradient' | 'pattern'
  color?: string
  gradientFrom?: string
  gradientTo?: string
  gradientDirection?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-br' | 'to-bl' | 'to-tr' | 'to-tl'
  pattern?: 'dots' | 'grid' | 'lines'
  patternColor?: string
  patternOpacity?: number
}

// Embed Security/Sandbox Settings
export interface EmbedSecuritySettings {
  sandboxEnabled: boolean
  allowScripts?: boolean
  allowSameOrigin?: boolean
  allowForms?: boolean
  allowPopups?: boolean
  lazyLoad: boolean
  referrerPolicy?: 'no-referrer' | 'no-referrer-when-downgrade' | 'origin' | 'strict-origin' | 'same-origin'
}

// Embed Loading Settings
export interface EmbedLoadingSettings {
  showLoadingSpinner: boolean
  spinnerColor?: string
  placeholderText?: string
  placeholderBackgroundColor?: string
  fallbackEnabled: boolean
  fallbackText?: string
}

// Embed Responsive Settings
export interface EmbedResponsive {
  desktop: {
    visible: boolean
    aspectRatio?: EmbedAspectRatio
    maxWidth?: string
  }
  tablet: {
    visible: boolean
    aspectRatio?: EmbedAspectRatio
    maxWidth?: string
  }
  mobile: {
    visible: boolean
    aspectRatio?: EmbedAspectRatio
    maxWidth?: string
  }
}

// Provider-specific Settings
export interface EmbedProviderSettings {
  youtube?: {
    videoId?: string
    autoplay?: boolean
    muted?: boolean
    loop?: boolean
    controls?: boolean
    startTime?: number
    showRelated?: boolean
    enablePrivacyMode?: boolean
  }
  googleMaps?: {
    embedUrl?: string
    zoom?: number
    mapType?: 'roadmap' | 'satellite' | 'hybrid' | 'terrain'
  }
  social?: {
    postUrl?: string
    theme?: 'light' | 'dark'
  }
}

// Enterprise Embed Content - Main Interface
export interface EmbedContent {
  // Provider Selection
  provider: EmbedProviderType

  // Content based on provider
  embedCode?: string          // For 'custom' provider - raw HTML/JS
  embedUrl?: string           // For URL-based providers

  // Provider-specific settings
  providerSettings?: EmbedProviderSettings

  // Section Header
  header?: EmbedSectionHeader

  // Legacy title support
  title?: string
  subtitle?: string

  // Container Settings
  container: EmbedContainerSettings

  // Frame/Embed Settings
  frame: EmbedFrameSettings

  // Background
  background?: EmbedBackground

  // Security
  security: EmbedSecuritySettings

  // Loading/Placeholder
  loading: EmbedLoadingSettings

  // Responsive
  responsive?: EmbedResponsive

  // Caption
  caption?: {
    enabled?: boolean
    text?: string
    alignment?: 'left' | 'center' | 'right'
    fontSize?: string
    color?: string
  }

  // Interaction
  clickToLoad?: boolean
  clickToLoadText?: string

  // Custom CSS
  customClass?: string

  // Section ID for navigation
  sectionId?: string
}

// ==========================================
// Enterprise Header Block Types
// ==========================================

// Header Navigation Item
export interface HeaderNavItem {
  id?: string
  href: string
  label: string
  icon?: string
  iconColor?: string
  color?: string
  hoverColor?: string
  fontSize?: string
  fontWeight?: string
  badge?: string
  badgeColor?: string
  visible?: boolean
}

// Header Logo Settings
export interface HeaderLogoSettings {
  text: string
  emoji?: string
  imageUrl?: string
  imageAlt?: string
  useImage?: boolean
  fontSize?: string
  fontWeight?: string
  textColor?: string
  hoverColor?: string
}

// Header CTA Button Settings
export interface HeaderCTASettings {
  visible: boolean
  text: string
  type: 'phone' | 'whatsapp' | 'url' | 'email'
  link: string
  icon?: string
  iconColor?: string
  backgroundColor?: string
  textColor?: string
  hoverBackgroundColor?: string
  borderRadius?: string
  size?: 'sm' | 'md' | 'lg'
}

// Header Style Settings
export interface HeaderStyleSettings {
  backgroundColor?: string
  backgroundBlur?: boolean
  shadowOnScroll?: boolean
  height?: string
  maxWidth?: 'full' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
  sticky?: boolean
  borderBottom?: boolean
  borderColor?: string
}

// Header Mobile Settings
export interface HeaderMobileSettings {
  menuBackgroundColor?: string
  showCTAInMenu?: boolean
  menuAnimation?: 'slide' | 'fade' | 'none'
}

// Enterprise Header Content - Main Interface
export interface HeaderContent {
  // Logo
  logo: HeaderLogoSettings

  // Navigation Items
  navItems: HeaderNavItem[]

  // CTA Button
  cta: HeaderCTASettings

  // Style Settings
  style: HeaderStyleSettings

  // Mobile Settings
  mobile: HeaderMobileSettings

  // Visibility Controls
  showLogo?: boolean
  showNav?: boolean
  showCTA?: boolean

  // Custom CSS Class
  customClass?: string

  // Section ID
  sectionId?: string
}

// ==========================================
// Enterprise Footer Block Types
// ==========================================

// Footer Text Style
export interface FooterTextStyle {
  fontFamily?: string
  fontSize?: string
  fontWeight?: string
  color?: string
}

// Footer Styles
export interface FooterStyles {
  brandName?: FooterTextStyle
  description?: FooterTextStyle
  sectionTitle?: FooterTextStyle
  link?: FooterTextStyle
  newsletterTitle?: FooterTextStyle
  copyright?: FooterTextStyle
}

// Footer Newsletter Content
export interface FooterNewsletterContent {
  enabled: boolean
  title: string
  subtitle: string
  placeholder: string
  buttonText: string
  disclaimer: string
}

// Footer Link Item
export interface FooterLinkItem {
  label: string
  href: string
}

// Footer Service Item
export interface FooterServiceItem {
  label: string
  href: string
}

// Footer Contact Info
export interface FooterContactInfo {
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

// Enterprise Footer Content - Main Interface
export interface FooterContent {
  // Brand
  brandName: string
  brandEmoji: string
  description: string

  // Social Media
  socialMedia: {
    instagram: string
    facebook: string
    whatsapp: string
  }

  // Newsletter
  newsletter: FooterNewsletterContent

  // Links
  quickLinks: FooterLinkItem[]
  legalLinks: FooterLinkItem[]
  services: FooterServiceItem[]

  // Copyright
  copyright: string

  // Styles
  styles?: FooterStyles

  // Contact
  contact: FooterContactInfo

  // Custom CSS Class
  customClass?: string

  // Section ID
  sectionId?: string
}

// ==========================================
// Enterprise SEO Block Types
// The Ultimate SEO Solution
// ==========================================

// SEO Robots Directives
export interface SEORobotsDirectives {
  index: boolean
  follow: boolean
  noarchive?: boolean
  nosnippet?: boolean
  noimageindex?: boolean
  notranslate?: boolean
  maxSnippet?: number // -1 = no limit, 0 = none
  maxImagePreview?: 'none' | 'standard' | 'large'
  maxVideoPreview?: number // seconds, -1 = no limit
}

// Open Graph Settings
export interface SEOOpenGraph {
  enabled: boolean
  type: 'website' | 'article' | 'product' | 'business.business' | 'place' | 'profile'
  title?: string // Falls back to meta title
  description?: string // Falls back to meta description
  image?: {
    url: string
    width?: number
    height?: number
    alt?: string
    type?: string
  }
  url?: string // Falls back to canonical
  siteName?: string
  locale?: string
  localeAlternates?: string[]
  // Article specific
  article?: {
    publishedTime?: string
    modifiedTime?: string
    expirationTime?: string
    author?: string
    section?: string
    tags?: string[]
  }
  // Business specific
  business?: {
    contactData?: {
      streetAddress?: string
      locality?: string
      region?: string
      postalCode?: string
      country?: string
      email?: string
      phone?: string
      website?: string
    }
    hours?: {
      day: string
      open: string
      close: string
    }[]
  }
}

// Twitter Card Settings
export interface SEOTwitterCard {
  enabled: boolean
  cardType: 'summary' | 'summary_large_image' | 'app' | 'player'
  site?: string // @username of website
  creator?: string // @username of content creator
  title?: string // Falls back to OG or meta title
  description?: string // Falls back to OG or meta description
  image?: {
    url: string
    alt?: string
  }
  // Player card specific
  player?: {
    url?: string
    width?: number
    height?: number
    stream?: string
  }
}

// JSON-LD Schema Types
export type SchemaType =
  | 'LocalBusiness'
  | 'Organization'
  | 'WebPage'
  | 'WebSite'
  | 'Article'
  | 'BlogPosting'
  | 'Product'
  | 'Service'
  | 'FAQPage'
  | 'HowTo'
  | 'Event'
  | 'BreadcrumbList'
  | 'Review'
  | 'AggregateRating'
  | 'Person'
  | 'Place'
  | 'ItemList'

// LocalBusiness Schema (Critical for Wellness/Spa)
export interface SchemaLocalBusiness {
  enabled: boolean
  '@type': 'LocalBusiness' | 'HealthAndBeautyBusiness' | 'DaySpa' | 'BeautySalon' | 'HealthClub' | 'MedicalSpa'
  name: string
  description?: string
  url?: string
  telephone?: string
  email?: string
  logo?: string
  image?: string[]
  priceRange?: string // e.g., "€€", "$$$"
  currenciesAccepted?: string
  paymentAccepted?: string[]
  address?: {
    streetAddress: string
    addressLocality: string
    addressRegion?: string
    postalCode: string
    addressCountry: string
  }
  geo?: {
    latitude: number
    longitude: number
  }
  openingHoursSpecification?: {
    dayOfWeek: string | string[]
    opens: string
    closes: string
    validFrom?: string
    validThrough?: string
  }[]
  aggregateRating?: {
    ratingValue: number
    reviewCount: number
    bestRating?: number
    worstRating?: number
  }
  review?: {
    author: string
    datePublished: string
    reviewBody: string
    reviewRating: {
      ratingValue: number
      bestRating?: number
      worstRating?: number
    }
  }[]
  sameAs?: string[] // Social profiles
  hasMap?: string // Google Maps URL
  amenityFeature?: {
    name: string
    value: boolean
  }[]
  // Wellness specific
  availableService?: {
    '@type': 'Service'
    name: string
    description?: string
    offers?: {
      price: string
      priceCurrency: string
    }
  }[]
}

// Organization Schema
export interface SchemaOrganization {
  enabled: boolean
  '@type': 'Organization' | 'Corporation' | 'LocalBusiness'
  name: string
  legalName?: string
  description?: string
  url?: string
  logo?: string
  foundingDate?: string
  founder?: {
    '@type': 'Person'
    name: string
  }
  address?: {
    streetAddress: string
    addressLocality: string
    postalCode: string
    addressCountry: string
  }
  contactPoint?: {
    '@type': 'ContactPoint'
    telephone: string
    contactType: string
    areaServed?: string
    availableLanguage?: string[]
  }[]
  sameAs?: string[]
}

// WebPage Schema
export interface SchemaWebPage {
  enabled: boolean
  '@type': 'WebPage' | 'AboutPage' | 'ContactPage' | 'FAQPage' | 'CollectionPage' | 'ItemPage' | 'ProfilePage' | 'SearchResultsPage'
  name?: string
  description?: string
  url?: string
  datePublished?: string
  dateModified?: string
  author?: {
    '@type': 'Person' | 'Organization'
    name: string
    url?: string
  }
  publisher?: {
    '@type': 'Organization'
    name: string
    logo?: string
  }
  mainEntity?: string // Reference to main schema
  breadcrumb?: boolean // Generate BreadcrumbList
  speakable?: {
    cssSelector?: string[]
    xpath?: string[]
  }
}

// Service Schema (for wellness services)
export interface SchemaService {
  enabled: boolean
  services: {
    '@type': 'Service'
    name: string
    description?: string
    provider?: string
    serviceType?: string
    areaServed?: string
    audience?: string
    availableChannel?: {
      serviceUrl?: string
      servicePhone?: string
      serviceSmsNumber?: string
    }
    offers?: {
      '@type': 'Offer'
      price: string
      priceCurrency: string
      availability?: 'InStock' | 'OutOfStock' | 'PreOrder' | 'LimitedAvailability'
      validFrom?: string
      validThrough?: string
    }
    termsOfService?: string
    aggregateRating?: {
      ratingValue: number
      reviewCount: number
    }
  }[]
}

// FAQ Schema
export interface SchemaFAQ {
  enabled: boolean
  questions: {
    question: string
    answer: string
  }[]
}

// BreadcrumbList Schema
export interface SchemaBreadcrumb {
  enabled: boolean
  autoGenerate: boolean // Generate from URL structure
  items?: {
    name: string
    url: string
  }[]
}

// Event Schema
export interface SchemaEvent {
  enabled: boolean
  events: {
    '@type': 'Event' | 'BusinessEvent' | 'SocialEvent'
    name: string
    description?: string
    startDate: string
    endDate?: string
    location?: {
      name: string
      address: string
    }
    organizer?: {
      name: string
      url?: string
    }
    offers?: {
      price: string
      priceCurrency: string
      availability: 'InStock' | 'SoldOut' | 'PreOrder'
      validFrom?: string
      url?: string
    }
    performer?: {
      name: string
    }
    image?: string
    eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled'
    eventAttendanceMode?: 'OfflineEventAttendanceMode' | 'OnlineEventAttendanceMode' | 'MixedEventAttendanceMode'
  }[]
}

// All Schema Settings Combined
export interface SEOSchemaSettings {
  localBusiness?: SchemaLocalBusiness
  organization?: SchemaOrganization
  webPage?: SchemaWebPage
  service?: SchemaService
  faq?: SchemaFAQ
  breadcrumb?: SchemaBreadcrumb
  event?: SchemaEvent
}

// Sitemap Settings
export interface SEOSitemapSettings {
  include: boolean
  priority: number // 0.0 - 1.0
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never'
  lastModified?: string
}

// Hreflang Settings (Multilingual)
export interface SEOHreflang {
  enabled: boolean
  defaultLanguage: string
  alternates: {
    hreflang: string // e.g., 'de', 'en-US', 'x-default'
    href: string
  }[]
}

// Advanced SEO Settings
export interface SEOAdvancedSettings {
  // Preload/Prefetch
  preload?: {
    enabled: boolean
    resources: {
      href: string
      as: 'script' | 'style' | 'image' | 'font' | 'fetch'
      type?: string
      crossorigin?: 'anonymous' | 'use-credentials'
    }[]
  }
  // DNS Prefetch
  dnsPrefetch?: {
    enabled: boolean
    domains: string[]
  }
  // Preconnect
  preconnect?: {
    enabled: boolean
    origins: string[]
  }
  // Custom Meta Tags
  customMeta?: {
    name?: string
    property?: string
    content: string
  }[]
  // Custom Link Tags
  customLinks?: {
    rel: string
    href: string
    hreflang?: string
    type?: string
  }[]
}

// SEO Analysis/Score (computed, not stored)
export interface SEOAnalysis {
  score: number // 0-100
  issues: {
    type: 'error' | 'warning' | 'info'
    category: 'meta' | 'content' | 'technical' | 'social'
    message: string
    suggestion?: string
  }[]
  // Individual scores
  titleScore: number
  descriptionScore: number
  keywordScore: number
  technicalScore: number
  socialScore: number
  schemaScore: number
}

// Global SEO Settings (site-wide defaults)
export interface SEOGlobalSettings {
  siteName: string
  siteUrl: string
  defaultLanguage: string
  separator: string // e.g., ' | ', ' - ', ' — '
  defaultImage?: string
  twitterHandle?: string
  facebookAppId?: string
  googleSiteVerification?: string
  bingSiteVerification?: string
  pinterestVerification?: string
  yandexVerification?: string
  defaultSchemaOrg?: SchemaOrganization
  defaultLocalBusiness?: SchemaLocalBusiness
}

// Enterprise SEO Content - Main Interface
export interface SEOContent {
  // Use Global Settings Toggle
  useGlobalSEO?: boolean

  // Basic Meta Tags
  title: string
  titleTemplate?: string // e.g., "%s | Wellnesstal"
  description: string
  keywords?: string[]
  author?: string

  // URLs
  canonicalUrl?: string
  alternateUrls?: {
    media?: string // e.g., 'only screen and (max-width: 640px)'
    href: string
  }[]

  // Robots
  robots: SEORobotsDirectives

  // Open Graph
  openGraph: SEOOpenGraph

  // Twitter Cards
  twitter: SEOTwitterCard

  // Structured Data (JSON-LD)
  schema: SEOSchemaSettings

  // Sitemap
  sitemap: SEOSitemapSettings

  // Hreflang (Multilingual)
  hreflang?: SEOHreflang

  // Advanced Settings
  advanced?: SEOAdvancedSettings

  // Preview URLs for editor
  previewUrl?: string

  // Custom CSS
  customClass?: string

  // Section ID
  sectionId?: string
}

