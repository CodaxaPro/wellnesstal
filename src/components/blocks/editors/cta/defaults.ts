import { CTAContent } from '../../types'

export const getDefaultCTAContent = (): CTAContent => ({
  // Layout
  layout: 'centered',
  alignment: 'center',
  verticalAlignment: 'center',

  // Container Settings
  minHeight: '300px',
  maxWidth: 'xl',
  padding: {
    top: '4rem',
    bottom: '4rem',
    left: '2rem',
    right: '2rem'
  },
  margin: {
    top: '0',
    bottom: '0'
  },

  // Content
  badge: {
    enabled: false,
    text: 'Yeni',
    backgroundColor: '#ffffff',
    textColor: '#059669',
    borderColor: '#059669',
    borderRadius: '9999px',
    animation: 'none',
    icon: ''
  },
  title: 'Harekete Gecin',
  titleHighlight: {
    enabled: false,
    words: [],
    color: '#059669',
    style: 'color'
  },
  subtitle: 'Sizin icin en uygun cozumu sunuyoruz',
  description: '',

  // Buttons
  primaryButton: {
    text: 'Hemen Baslayın',
    link: '/iletisim',
    style: 'primary',
    size: 'lg',
    backgroundColor: '#ffffff',
    textColor: '#059669',
    borderColor: '#ffffff',
    hoverBackgroundColor: '#f0fdf4',
    hoverTextColor: '#047857',
    borderRadius: '0.75rem',
    borderWidth: 0,
    shadow: 'lg',
    hoverEffect: 'scale',
    icon: '',
    iconPosition: 'right',
    animation: 'none'
  },
  secondaryButton: {
    enabled: false,
    text: 'Daha Fazla Bilgi',
    link: '#',
    style: 'outline',
    textColor: '#ffffff',
    borderColor: '#ffffff',
    hoverColor: '#f0fdf4',
    icon: '',
    iconPosition: 'right'
  },
  buttonLayout: 'horizontal',
  buttonGap: '1rem',
  buttonAlignment: 'center',

  // Visual
  decoration: {
    enabled: false,
    type: 'shape',
    shape: 'circle',
    shapeColor: 'rgba(255, 255, 255, 0.1)',
    shapeSize: '300px',
    position: 'right',
    opacity: 100,
    blur: 0,
    animation: 'float'
  },

  // Typography
  typography: {
    title: {
      fontSize: '2.5rem',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
      color: '#ffffff',
      textTransform: 'none'
    },
    subtitle: {
      fontSize: '1.25rem',
      fontWeight: '400',
      lineHeight: '1.6',
      color: 'rgba(255, 255, 255, 0.9)',
      maxWidth: '600px'
    },
    description: {
      fontSize: '1rem',
      fontWeight: '400',
      lineHeight: '1.6',
      color: 'rgba(255, 255, 255, 0.8)',
      maxWidth: '500px'
    }
  },

  // Background
  background: {
    type: 'gradient',
    color: '#059669',
    gradientFrom: '#059669',
    gradientVia: '#047857',
    gradientTo: '#065f46',
    gradientDirection: 'to-br',
    gradientType: 'linear',
    overlayEnabled: false,
    overlayColor: '#000000',
    overlayOpacity: 20,
    overlayBlendMode: 'normal',
    pattern: 'dots',
    patternColor: '#ffffff',
    patternOpacity: 5,
    patternSize: 'md'
  },

  // Border
  border: {
    enabled: false,
    style: 'solid',
    width: 1,
    color: '#e5e7eb',
    radius: '1rem',
    sides: {
      top: true,
      right: true,
      bottom: true,
      left: true
    }
  },

  // Shadow
  boxShadow: 'none',

  // Animations
  animations: {
    enabled: true,
    titleAnimation: 'fade',
    subtitleAnimation: 'fade',
    buttonAnimation: 'slide-up',
    decorationAnimation: 'fade',
    staggerDelay: 100,
    duration: 600,
    delay: 0,
    triggerOnScroll: true,
    backgroundAnimation: 'none'
  },

  // Responsive
  responsive: {
    desktop: {
      titleSize: '2.5rem',
      subtitleSize: '1.25rem',
      buttonSize: 'lg',
      padding: '4rem'
    },
    tablet: {
      titleSize: '2rem',
      subtitleSize: '1.125rem',
      buttonSize: 'md',
      layout: 'original',
      padding: '3rem'
    },
    mobile: {
      titleSize: '1.75rem',
      subtitleSize: '1rem',
      buttonSize: 'md',
      layout: 'stacked',
      textAlign: 'center',
      hideDecoration: true,
      padding: '2rem'
    }
  },

  // Visibility Controls
  showBadge: false,
  showSubtitle: true,
  showDescription: false,
  showSecondaryButton: false,
  showDecoration: false,

  // Custom CSS
  customClass: '',

  // Urgency
  urgency: {
    enabled: false,
    type: 'badge',
    text: 'Sınırlı Teklif',
    badgeColor: '#ef4444'
  },

  // Trust Elements
  trustElements: {
    enabled: false,
    items: [],
    layout: 'inline'
  }
})

// Style Presets
export const CTA_STYLE_PRESETS: Record<string, {
  label: string
  description: string
  settings: Partial<CTAContent>
}> = {
  'gradient-modern': {
    label: 'Modern Gradient',
    description: 'Yumusak gradient arkaplan',
    settings: {
      layout: 'centered',
      background: {
        type: 'gradient',
        gradientFrom: '#059669',
        gradientTo: '#065f46',
        gradientDirection: 'to-br',
        gradientType: 'linear'
      },
      typography: {
        title: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2', letterSpacing: '-0.02em', color: '#ffffff' },
        subtitle: { fontSize: '1.25rem', fontWeight: '400', lineHeight: '1.6', color: 'rgba(255,255,255,0.9)', maxWidth: '600px' }
      }
    }
  },
  'dark-elegant': {
    label: 'Dark Elegant',
    description: 'Zarif koyu tasarim',
    settings: {
      layout: 'centered',
      background: {
        type: 'solid',
        color: '#1f2937'
      },
      typography: {
        title: { fontSize: '2.5rem', fontWeight: '700', lineHeight: '1.2', letterSpacing: '-0.02em', color: '#ffffff' },
        subtitle: { fontSize: '1.25rem', fontWeight: '400', lineHeight: '1.6', color: 'rgba(255,255,255,0.8)', maxWidth: '600px' }
      },
      primaryButton: {
        text: 'Baslayın',
        link: '#',
        style: 'primary',
        size: 'lg',
        backgroundColor: '#059669',
        textColor: '#ffffff',
        borderRadius: '0.5rem',
        hoverEffect: 'glow'
      }
    }
  },
  'light-minimal': {
    label: 'Light Minimal',
    description: 'Sade acık tasarim',
    settings: {
      layout: 'centered',
      background: {
        type: 'solid',
        color: '#f9fafb'
      },
      typography: {
        title: { fontSize: '2rem', fontWeight: '600', lineHeight: '1.3', letterSpacing: '-0.01em', color: '#111827' },
        subtitle: { fontSize: '1.125rem', fontWeight: '400', lineHeight: '1.6', color: '#6b7280', maxWidth: '500px' }
      },
      primaryButton: {
        text: 'Baslayın',
        link: '#',
        style: 'primary',
        size: 'md',
        backgroundColor: '#059669',
        textColor: '#ffffff',
        borderRadius: '0.5rem',
        hoverEffect: 'lift'
      }
    }
  },
  'split-image': {
    label: 'Split Image',
    description: 'Icerik ve gorsel yan yana',
    settings: {
      layout: 'split-left',
      showDecoration: true,
      decoration: {
        enabled: true,
        type: 'image',
        position: 'right',
        opacity: 100
      }
    }
  },
  'card-style': {
    label: 'Card Style',
    description: 'Kart seklinde CTA',
    settings: {
      layout: 'card',
      boxShadow: 'xl',
      border: {
        enabled: true,
        style: 'solid',
        width: 1,
        color: '#e5e7eb',
        radius: '1.5rem',
        sides: { top: true, right: true, bottom: true, left: true }
      },
      background: {
        type: 'solid',
        color: '#ffffff'
      },
      typography: {
        title: { fontSize: '2rem', fontWeight: '700', lineHeight: '1.2', letterSpacing: '-0.02em', color: '#111827' },
        subtitle: { fontSize: '1.125rem', fontWeight: '400', lineHeight: '1.6', color: '#6b7280', maxWidth: '500px' }
      }
    }
  },
  'urgency-banner': {
    label: 'Urgency Banner',
    description: 'Aciliyet vurgulu banner',
    settings: {
      layout: 'banner',
      showBadge: true,
      badge: {
        enabled: true,
        text: 'Sınırlı Teklif',
        backgroundColor: '#fef2f2',
        textColor: '#dc2626',
        animation: 'pulse'
      },
      urgency: {
        enabled: true,
        type: 'badge',
        text: 'Son 24 Saat!',
        badgeColor: '#ef4444'
      }
    }
  }
}

// Layout Options
export const CTA_LAYOUT_OPTIONS = [
  { id: 'centered', label: 'Ortalı', description: 'Klasik ortalı düzen', icon: '⬜' },
  { id: 'split-left', label: 'Sol İçerik', description: 'İçerik solda, görsel sağda', icon: '◧' },
  { id: 'split-right', label: 'Sağ İçerik', description: 'Görsel solda, içerik sağda', icon: '◨' },
  { id: 'full-width', label: 'Tam Genişlik', description: 'Kenardan kenara', icon: '▬' },
  { id: 'minimal', label: 'Minimal', description: 'Sade ve temiz', icon: '◯' },
  { id: 'card', label: 'Kart', description: 'Kart stili gölgeli', icon: '▢' },
  { id: 'banner', label: 'Banner', description: 'Yatay banner stili', icon: '▭' }
]

// Button Style Options
export const BUTTON_STYLE_OPTIONS = [
  { id: 'primary', label: 'Primary', description: 'Ana buton stili' },
  { id: 'secondary', label: 'Secondary', description: 'İkincil buton stili' },
  { id: 'outline', label: 'Outline', description: 'Çerçeveli buton' },
  { id: 'ghost', label: 'Ghost', description: 'Transparan buton' },
  { id: 'gradient', label: 'Gradient', description: 'Gradient buton' }
]

// Button Size Options
export const BUTTON_SIZE_OPTIONS = [
  { id: 'sm', label: 'Küçük', px: '16px', py: '8px', fontSize: '0.875rem' },
  { id: 'md', label: 'Orta', px: '24px', py: '12px', fontSize: '1rem' },
  { id: 'lg', label: 'Büyük', px: '32px', py: '16px', fontSize: '1.125rem' },
  { id: 'xl', label: 'Çok Büyük', px: '40px', py: '20px', fontSize: '1.25rem' }
]

// Hover Effect Options
export const HOVER_EFFECT_OPTIONS = [
  { id: 'none', label: 'Yok' },
  { id: 'scale', label: 'Büyüme' },
  { id: 'glow', label: 'Parlama' },
  { id: 'lift', label: 'Yükselme' },
  { id: 'slide', label: 'Kayma' }
]

// Animation Options
export const ANIMATION_OPTIONS = [
  { id: 'none', label: 'Yok' },
  { id: 'fade', label: 'Fade' },
  { id: 'slide-up', label: 'Yukarı Kayma' },
  { id: 'slide-down', label: 'Aşağı Kayma' },
  { id: 'slide-left', label: 'Soldan Kayma' },
  { id: 'slide-right', label: 'Sağdan Kayma' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'typewriter', label: 'Daktilo' }
]

// Background Type Options
export const BACKGROUND_TYPE_OPTIONS = [
  { id: 'solid', label: 'Düz Renk', icon: '■' },
  { id: 'gradient', label: 'Gradient', icon: '◐' },
  { id: 'image', label: 'Görsel', icon: '🖼' },
  { id: 'pattern', label: 'Desen', icon: '▦' },
  { id: 'video', label: 'Video', icon: '▶' }
]

// Pattern Options
export const PATTERN_OPTIONS = [
  { id: 'dots', label: 'Noktalar' },
  { id: 'grid', label: 'Grid' },
  { id: 'lines', label: 'Çizgiler' },
  { id: 'waves', label: 'Dalgalar' },
  { id: 'geometric', label: 'Geometrik' },
  { id: 'diagonal', label: 'Diagonal' }
]

// Gradient Direction Options
export const GRADIENT_DIRECTION_OPTIONS = [
  { id: 'to-r', label: '→', title: 'Sağa' },
  { id: 'to-l', label: '←', title: 'Sola' },
  { id: 'to-t', label: '↑', title: 'Yukarı' },
  { id: 'to-b', label: '↓', title: 'Aşağı' },
  { id: 'to-br', label: '↘', title: 'Sağ Alt' },
  { id: 'to-bl', label: '↙', title: 'Sol Alt' },
  { id: 'to-tr', label: '↗', title: 'Sağ Üst' },
  { id: 'to-tl', label: '↖', title: 'Sol Üst' },
  { id: 'radial', label: '◉', title: 'Radial' }
]
