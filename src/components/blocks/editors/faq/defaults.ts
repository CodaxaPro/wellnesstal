import { FAQContent } from '../../types'

// Layout Options
export const FAQ_LAYOUT_OPTIONS = [
  { id: 'accordion', label: 'Accordion', icon: 'A', description: 'Klasik accordion' },
  { id: 'accordion-multi', label: 'Multi Accordion', icon: 'AM', description: 'Coklu acik' },
  { id: 'grid', label: 'Grid', icon: 'G', description: 'Kart grid' },
  { id: 'cards', label: 'Cards', icon: 'C', description: 'Kart layoutu' },
  { id: 'minimal', label: 'Minimal', icon: 'M', description: 'Temiz liste' },
  { id: 'timeline', label: 'Timeline', icon: 'T', description: 'Zaman cizelgesi' }
]

// Expand Icon Options
export const EXPAND_ICON_OPTIONS = [
  { id: 'chevron', label: 'Chevron' },
  { id: 'plus', label: 'Plus/Minus' },
  { id: 'arrow', label: 'Arrow' },
  { id: 'caret', label: 'Caret' },
  { id: 'none', label: 'Yok' }
]

// Shadow Options
export const SHADOW_OPTIONS = [
  { id: 'none', label: 'Yok' },
  { id: 'sm', label: 'Kucuk' },
  { id: 'md', label: 'Orta' },
  { id: 'lg', label: 'Buyuk' }
]

// Hover Effect Options
export const HOVER_EFFECT_OPTIONS = [
  { id: 'none', label: 'Yok' },
  { id: 'lift', label: 'Lift' },
  { id: 'scale', label: 'Scale' },
  { id: 'glow', label: 'Glow' },
  { id: 'border', label: 'Border' }
]

// Category Style Options
export const CATEGORY_STYLE_OPTIONS = [
  { id: 'tabs', label: 'Tabs' },
  { id: 'pills', label: 'Pills' },
  { id: 'buttons', label: 'Buttons' },
  { id: 'dropdown', label: 'Dropdown' }
]

// Animation Type Options
export const ANIMATION_TYPE_OPTIONS = [
  { id: 'fade', label: 'Fade' },
  { id: 'slide-up', label: 'Slide Up' },
  { id: 'slide-left', label: 'Slide Left' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'none', label: 'Yok' }
]

// Expand Animation Options
export const EXPAND_ANIMATION_OPTIONS = [
  { id: 'smooth', label: 'Smooth' },
  { id: 'spring', label: 'Spring' },
  { id: 'instant', label: 'Instant' }
]

// Background Type Options
export const BACKGROUND_TYPE_OPTIONS = [
  { id: 'solid', label: 'Duz Renk', icon: 'S' },
  { id: 'gradient', label: 'Gradient', icon: 'G' },
  { id: 'image', label: 'Resim', icon: 'I' },
  { id: 'pattern', label: 'Pattern', icon: 'P' },
  { id: 'none', label: 'Yok', icon: 'X' }
]

// Gradient Direction Options
export const GRADIENT_DIRECTION_OPTIONS = [
  { id: 'to-r', label: 'Saga' },
  { id: 'to-l', label: 'Sola' },
  { id: 'to-t', label: 'Yukari' },
  { id: 'to-b', label: 'Asagi' },
  { id: 'to-br', label: 'Sag Alt' },
  { id: 'to-bl', label: 'Sol Alt' },
  { id: 'to-tr', label: 'Sag Ust' },
  { id: 'to-tl', label: 'Sol Ust' }
]

// Pattern Options
export const PATTERN_OPTIONS = [
  { id: 'dots', label: 'Noktalar' },
  { id: 'grid', label: 'Grid' },
  { id: 'lines', label: 'Cizgiler' },
  { id: 'waves', label: 'Dalgalar' }
]

// Style Presets
export const FAQ_STYLE_PRESETS: { id: string; name: string; icon: string; description: string; value: Partial<FAQContent> }[] = [
  {
    id: 'classic',
    name: 'Klasik',
    icon: 'CL',
    description: 'Temiz ve profesyonel',
    value: {
      layout: 'accordion',
      accordionStyle: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: '0.75rem',
        shadow: 'sm',
        expandIcon: 'chevron',
        openBorderColor: '#86a789'
      },
      background: {
        type: 'solid',
        color: '#f8fafc'
      }
    }
  },
  {
    id: 'modern',
    name: 'Modern',
    icon: 'MO',
    description: 'Sik ve cagdas',
    value: {
      layout: 'accordion',
      accordionStyle: {
        backgroundColor: '#ffffff',
        borderColor: 'transparent',
        borderWidth: 0,
        borderRadius: '1rem',
        shadow: 'md',
        expandIcon: 'plus',
        openBackgroundColor: '#f0fdf4',
        openShadow: 'lg'
      },
      background: {
        type: 'gradient',
        gradientFrom: '#f8fafc',
        gradientTo: '#f1f5f9',
        gradientDirection: 'to-b'
      }
    }
  },
  {
    id: 'minimal',
    name: 'Minimal',
    icon: 'MI',
    description: 'Sade ve temiz',
    value: {
      layout: 'minimal',
      background: {
        type: 'solid',
        color: '#ffffff'
      },
      typography: {
        question: {
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#1e293b'
        },
        answer: {
          fontSize: '0.95rem',
          color: '#64748b'
        }
      }
    }
  },
  {
    id: 'cards',
    name: 'Kartlar',
    icon: 'CA',
    description: 'Kart tabanli grid',
    value: {
      layout: 'cards',
      cardStyle: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: '1rem',
        shadow: 'md',
        padding: '1.5rem',
        hoverEffect: 'lift'
      },
      responsive: {
        desktop: { columns: 2, gap: '1.5rem', padding: '4rem' },
        tablet: { columns: 2, gap: '1rem', padding: '3rem' },
        mobile: { columns: 1, gap: '1rem', padding: '2rem' }
      }
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    icon: 'DK',
    description: 'Koyu tema',
    value: {
      layout: 'accordion',
      accordionStyle: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1,
        borderRadius: '0.75rem',
        shadow: 'md',
        expandIconColor: '#94a3b8',
        openBackgroundColor: '#334155',
        openBorderColor: '#86a789'
      },
      typography: {
        question: {
          color: '#f1f5f9'
        },
        answer: {
          color: '#94a3b8'
        }
      },
      background: {
        type: 'solid',
        color: '#0f172a'
      }
    }
  },
  {
    id: 'colorful',
    name: 'Renkli',
    icon: 'RF',
    description: 'Canli renkler',
    value: {
      layout: 'accordion',
      accordionStyle: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 2,
        borderRadius: '1rem',
        shadow: 'sm',
        expandIconColor: '#86a789',
        openBorderColor: '#86a789',
        openBackgroundColor: '#f0fdf4'
      },
      background: {
        type: 'gradient',
        gradientFrom: '#f0fdf4',
        gradientVia: '#f8fafc',
        gradientTo: '#fef3c7',
        gradientDirection: 'to-br'
      }
    }
  }
]

// Max Width Options
export const MAX_WIDTH_OPTIONS = [
  { id: 'sm', label: 'SM (672px)' },
  { id: 'md', label: 'MD (768px)' },
  { id: 'lg', label: 'LG (1024px)' },
  { id: 'xl', label: 'XL (1280px)' },
  { id: '2xl', label: '2XL (1536px)' },
  { id: 'full', label: 'Full Width' }
]

// Helpful Vote Style Options
export const HELPFUL_STYLE_OPTIONS = [
  { id: 'buttons', label: 'Butonlar' },
  { id: 'thumbs', label: 'Thumbs' },
  { id: 'stars', label: 'Yildizlar' }
]

// CTA Button Style Options
export const CTA_BUTTON_STYLE_OPTIONS = [
  { id: 'primary', label: 'Primary' },
  { id: 'secondary', label: 'Secondary' },
  { id: 'outline', label: 'Outline' }
]
