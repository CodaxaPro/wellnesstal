import { PricingContent, PricingPackage, PricingPackageStyle } from '../../types'

// Default Package Style
export const getDefaultPackageStyle = (): PricingPackageStyle => ({
  backgroundColor: '#ffffff',
  borderColor: '#e2e8f0',
  borderWidth: 1,
  borderRadius: '1rem',
  shadowSize: 'md',
  hoverEffect: 'lift',
  headerBackgroundColor: 'transparent',
  headerTextColor: '#1e293b',
  priceColor: '#059669',
  priceFontSize: '3rem',
  periodColor: '#64748b',
  featureTextColor: '#475569',
  featureIconColor: '#059669',
  checkmarkColor: '#059669'
})

// Default Package
export const getDefaultPackage = (id?: string): PricingPackage => ({
  id: id || `pkg-${Date.now()}`,
  name: 'Paket Adı',
  price: '€99',
  period: 'ay',
  billingCycle: 'monthly',
  subtitle: '',
  description: 'Paket açıklaması buraya gelecek.',
  features: ['Özellik 1', 'Özellik 2', 'Özellik 3'],
  highlighted: false,
  popular: false,
  recommended: false,
  ctaText: 'Seç',
  ctaLink: '#',
  style: getDefaultPackageStyle()
})

// Default Pricing Content
export const getDefaultPricingContent = (): PricingContent => ({
  // Layout
  layout: 'grid',
  maxWidth: 'xl',

  // Section Header
  header: {
    title: 'Fiyatlandırma',
    subtitle: 'Size uygun paketi seçin',
    description: '',
    alignment: 'center',
    titleFontSize: '2.5rem',
    titleFontWeight: '700',
    titleColor: '#1e293b',
    subtitleFontSize: '1.125rem',
    subtitleColor: '#64748b'
  },

  // Legacy support
  title: 'Fiyatlandırma',
  subtitle: 'Size uygun paketi seçin',

  // Packages
  packages: [
    {
      ...getDefaultPackage('pkg-1'),
      name: 'Başlangıç',
      price: '€49',
      features: ['5 Seans', 'Temel Danışmanlık', 'E-posta Desteği']
    },
    {
      ...getDefaultPackage('pkg-2'),
      name: 'Profesyonel',
      price: '€99',
      highlighted: true,
      popular: true,
      badge: {
        enabled: true,
        text: 'En Popüler',
        backgroundColor: '#059669',
        textColor: '#ffffff',
        position: 'top-center',
        animation: 'pulse'
      },
      features: ['10 Seans', 'Gelişmiş Danışmanlık', '7/24 Destek', 'Özel Program']
    },
    {
      ...getDefaultPackage('pkg-3'),
      name: 'Premium',
      price: '€199',
      features: ['Sınırsız Seans', 'VIP Danışmanlık', 'Öncelikli Destek', 'Özel Program', 'Ev Ziyareti']
    }
  ],

  // Billing Toggle
  billingToggle: {
    enabled: false,
    options: [
      { id: 'monthly', label: 'Aylık' },
      { id: 'yearly', label: 'Yıllık', discount: '%20 Tasarruf' }
    ],
    defaultOption: 'monthly',
    style: 'pills',
    backgroundColor: '#f1f5f9',
    activeBackgroundColor: '#059669',
    textColor: '#64748b',
    activeTextColor: '#ffffff'
  },

  // Background
  background: {
    type: 'solid',
    color: '#ffffff'
  },

  // Spacing
  padding: {
    top: '4rem',
    bottom: '4rem'
  },
  packageGap: '2rem',

  // Animations
  animations: {
    enabled: true,
    headerAnimation: 'fade',
    packageAnimation: 'slide-up',
    staggerDelay: 100,
    duration: 500,
    triggerOnScroll: true
  },

  // Responsive
  responsive: {
    desktop: {
      columns: 3,
      gap: '2rem',
      padding: '4rem'
    },
    tablet: {
      columns: 2,
      gap: '1.5rem',
      padding: '3rem'
    },
    mobile: {
      columns: 1,
      gap: '1rem',
      padding: '2rem',
      stackPackages: true
    }
  },

  // Trust Element
  trustElement: {
    enabled: false,
    type: 'money-back',
    text: '30 Gün Para İade Garantisi',
    icon: '🛡️',
    duration: '30 gün',
    position: 'below-packages'
  },

  // Default Package Style
  defaultPackageStyle: getDefaultPackageStyle()
})

// Layout Options
export const PRICING_LAYOUT_OPTIONS = [
  { id: 'grid', label: 'Grid', icon: '⬚', description: 'Standart grid düzeni' },
  { id: 'horizontal', label: 'Yatay', icon: '↔️', description: 'Yatay karşılaştırma' },
  { id: 'cards', label: 'Kartlar', icon: '🃏', description: 'Gölgeli kart tasarımı' },
  { id: 'minimal', label: 'Minimal', icon: '◻️', description: 'Sade minimal tasarım' },
  { id: 'featured', label: 'Öne Çıkan', icon: '⭐', description: 'Popüler paket vurgulu' },
  { id: 'comparison', label: 'Karşılaştırma', icon: '📊', description: 'Tablo karşılaştırma' }
]

// Billing Toggle Styles
export const BILLING_TOGGLE_STYLES = [
  { id: 'pills', label: 'Pills' },
  { id: 'toggle', label: 'Toggle' },
  { id: 'tabs', label: 'Tabs' },
  { id: 'buttons', label: 'Butonlar' }
]

// Animation Options
export const ANIMATION_OPTIONS = [
  { id: 'none', label: 'Yok' },
  { id: 'fade', label: 'Fade' },
  { id: 'slide-up', label: 'Yukarı Kayma' },
  { id: 'slide-down', label: 'Aşağı Kayma' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'flip', label: 'Flip' }
]

// Shadow Options
export const SHADOW_OPTIONS = [
  { id: 'none', label: 'Yok' },
  { id: 'sm', label: 'Küçük' },
  { id: 'md', label: 'Orta' },
  { id: 'lg', label: 'Büyük' },
  { id: 'xl', label: 'Ekstra Büyük' }
]

// Hover Effect Options
export const HOVER_EFFECT_OPTIONS = [
  { id: 'none', label: 'Yok' },
  { id: 'lift', label: 'Kaldır' },
  { id: 'scale', label: 'Büyüt' },
  { id: 'glow', label: 'Işıltı' },
  { id: 'border', label: 'Kenarlık' }
]

// Style Presets
export const PRICING_STYLE_PRESETS = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Temiz ve modern görünüm',
    icon: '🎨',
    value: {
      layout: 'grid' as const,
      background: { type: 'solid' as const, color: '#ffffff' },
      defaultPackageStyle: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderRadius: '1rem',
        shadowSize: 'md' as const,
        hoverEffect: 'lift' as const
      }
    }
  },
  {
    id: 'gradient',
    name: 'Gradient',
    description: 'Gradient arka plan',
    icon: '🌈',
    value: {
      layout: 'cards' as const,
      background: {
        type: 'gradient' as const,
        gradientFrom: '#f0fdf4',
        gradientTo: '#ecfeff',
        gradientDirection: 'to-br' as const
      }
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Koyu tema',
    icon: '🌙',
    value: {
      layout: 'grid' as const,
      background: { type: 'solid' as const, color: '#1e293b' },
      header: {
        titleColor: '#ffffff',
        subtitleColor: '#94a3b8'
      },
      defaultPackageStyle: {
        backgroundColor: '#334155',
        borderColor: '#475569',
        headerTextColor: '#ffffff',
        featureTextColor: '#cbd5e1',
        priceColor: '#34d399'
      }
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Sade ve minimal',
    icon: '◻️',
    value: {
      layout: 'minimal' as const,
      background: { type: 'solid' as const, color: '#fafafa' },
      defaultPackageStyle: {
        backgroundColor: 'transparent',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        shadowSize: 'none' as const,
        hoverEffect: 'border' as const
      }
    }
  },
  {
    id: 'corporate',
    name: 'Kurumsal',
    description: 'Profesyonel kurumsal',
    icon: '🏢',
    value: {
      layout: 'featured' as const,
      background: { type: 'solid' as const, color: '#f8fafc' },
      defaultPackageStyle: {
        backgroundColor: '#ffffff',
        borderRadius: '0.5rem',
        shadowSize: 'lg' as const,
        priceColor: '#0f766e'
      }
    }
  }
]
