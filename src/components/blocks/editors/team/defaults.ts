import { TeamContent } from '../../types'

// Layout Options
export const TEAM_LAYOUT_OPTIONS = [
  { id: 'grid', label: 'Grid', icon: 'G', description: 'Standart grid' },
  { id: 'cards', label: 'Kartlar', icon: 'C', description: 'Kart hover' },
  { id: 'carousel', label: 'Carousel', icon: 'CR', description: 'Kaydirmali' },
  { id: 'list', label: 'Liste', icon: 'L', description: 'Dikey liste' },
  { id: 'featured', label: 'Featured', icon: 'F', description: 'One cikan' },
  { id: 'minimal', label: 'Minimal', icon: 'M', description: 'Sade tasarim' },
  { id: 'masonry', label: 'Masonry', icon: 'MA', description: 'Masonry grid' },
  { id: 'hexagon', label: 'Altigen', icon: 'HX', description: 'Altigen desen' }
]

// Image Shape Options
export const IMAGE_SHAPE_OPTIONS = [
  { id: 'circle', label: 'Yuvarlak' },
  { id: 'square', label: 'Kare' },
  { id: 'rounded', label: 'Yuvarlatilmis' },
  { id: 'hexagon', label: 'Altigen' }
]

// Image Size Options
export const IMAGE_SIZE_OPTIONS = [
  { id: 'sm', label: 'Kucuk' },
  { id: 'md', label: 'Orta' },
  { id: 'lg', label: 'Buyuk' },
  { id: 'xl', label: 'Ekstra Buyuk' },
  { id: 'full', label: 'Tam' }
]

// Shadow Options
export const SHADOW_OPTIONS = [
  { id: 'none', label: 'Yok' },
  { id: 'sm', label: 'Kucuk' },
  { id: 'md', label: 'Orta' },
  { id: 'lg', label: 'Buyuk' },
  { id: 'xl', label: 'Ekstra Buyuk' },
  { id: '2xl', label: '2XL' }
]

// Hover Effect Options
export const HOVER_EFFECT_OPTIONS = [
  { id: 'none', label: 'Yok' },
  { id: 'lift', label: 'Yukari Kaldir' },
  { id: 'scale', label: 'Buyut' },
  { id: 'glow', label: 'Isilt' },
  { id: 'border-color', label: 'Border Rengi' },
  { id: 'bg-color', label: 'Arkaplan' },
  { id: 'flip', label: 'Cevir' }
]

// Social Position Options
export const SOCIAL_POSITION_OPTIONS = [
  { id: 'below-info', label: 'Bilgi Altinda' },
  { id: 'overlay', label: 'Resim Uzerinde' },
  { id: 'on-hover', label: 'Hover\'da' },
  { id: 'beside-name', label: 'Isim Yaninda' }
]

// Animation Type Options
export const ANIMATION_TYPE_OPTIONS = [
  { id: 'fade', label: 'Fade' },
  { id: 'slide-up', label: 'Yukari Kaydir' },
  { id: 'slide-left', label: 'Sola Kaydir' },
  { id: 'slide-right', label: 'Saga Kaydir' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'flip', label: 'Flip' },
  { id: 'none', label: 'Yok' }
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
  { id: 'waves', label: 'Dalgalar' },
  { id: 'geometric', label: 'Geometrik' }
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

// Icon Size Options
export const ICON_SIZE_OPTIONS = [
  { id: 'sm', label: 'Kucuk' },
  { id: 'md', label: 'Orta' },
  { id: 'lg', label: 'Buyuk' }
]

// Social Icons List
export const SOCIAL_ICONS = [
  { id: 'linkedin', label: 'LinkedIn', icon: 'in' },
  { id: 'twitter', label: 'Twitter/X', icon: 'x' },
  { id: 'instagram', label: 'Instagram', icon: 'ig' },
  { id: 'facebook', label: 'Facebook', icon: 'fb' },
  { id: 'github', label: 'GitHub', icon: 'gh' },
  { id: 'youtube', label: 'YouTube', icon: 'yt' },
  { id: 'tiktok', label: 'TikTok', icon: 'tt' },
  { id: 'website', label: 'Website', icon: 'www' },
  { id: 'email', label: 'E-posta', icon: '@' },
  { id: 'phone', label: 'Telefon', icon: 'tel' }
]

// CTA Button Style Options
export const CTA_BUTTON_STYLE_OPTIONS = [
  { id: 'primary', label: 'Primary' },
  { id: 'secondary', label: 'Secondary' },
  { id: 'outline', label: 'Outline' }
]

// Style Presets
export const TEAM_STYLE_PRESETS: { id: string; name: string; icon: string; description: string; value: Partial<TeamContent> }[] = [
  {
    id: 'classic',
    name: 'Klasik',
    icon: 'CL',
    description: 'Temiz ve profesyonel',
    value: {
      layout: 'grid',
      cardStyle: {
        backgroundColor: '#ffffff',
        borderColor: '#e2e8f0',
        borderWidth: 1,
        borderRadius: '1rem',
        shadow: 'md',
        hoverEffect: 'lift'
      },
      imageStyle: {
        shape: 'circle',
        size: 'lg'
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
      layout: 'cards',
      cardStyle: {
        backgroundColor: '#ffffff',
        borderWidth: 0,
        borderRadius: '1.5rem',
        shadow: 'lg',
        hoverEffect: 'scale'
      },
      imageStyle: {
        shape: 'rounded',
        size: 'full',
        grayscale: true,
        grayscaleHover: false
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
      cardStyle: {
        backgroundColor: 'transparent',
        borderWidth: 0,
        shadow: 'none',
        hoverEffect: 'none'
      },
      imageStyle: {
        shape: 'circle',
        size: 'md'
      },
      background: {
        type: 'solid',
        color: '#ffffff'
      }
    }
  },
  {
    id: 'dark',
    name: 'Dark Mode',
    icon: 'DK',
    description: 'Koyu tema',
    value: {
      layout: 'grid',
      cardStyle: {
        backgroundColor: '#1e293b',
        borderColor: '#334155',
        borderWidth: 1,
        borderRadius: '1rem',
        shadow: 'lg',
        hoverEffect: 'glow'
      },
      imageStyle: {
        shape: 'rounded',
        size: 'lg',
        borderWidth: 2,
        borderColor: '#475569'
      },
      typography: {
        name: { color: '#f1f5f9' },
        role: { color: '#94a3b8' },
        bio: { color: '#94a3b8' },
        quote: { color: '#cbd5e1', borderColor: '#475569' }
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
      layout: 'cards',
      cardStyle: {
        backgroundColor: '#ffffff',
        borderColor: '#86a789',
        borderWidth: 2,
        borderRadius: '1.5rem',
        shadow: 'md',
        hoverEffect: 'border-color'
      },
      imageStyle: {
        shape: 'hexagon',
        size: 'lg',
        borderWidth: 3,
        borderColor: '#86a789'
      },
      background: {
        type: 'gradient',
        gradientFrom: '#f0fdf4',
        gradientVia: '#f8fafc',
        gradientTo: '#fef3c7',
        gradientDirection: 'to-br'
      }
    }
  },
  {
    id: 'corporate',
    name: 'Kurumsal',
    icon: 'KU',
    description: 'Is profesyoneli',
    value: {
      layout: 'grid',
      cardStyle: {
        backgroundColor: '#ffffff',
        borderColor: '#d1d5db',
        borderWidth: 1,
        borderRadius: '0.5rem',
        shadow: 'sm',
        hoverEffect: 'lift'
      },
      imageStyle: {
        shape: 'square',
        size: 'lg'
      },
      showDepartment: true,
      background: {
        type: 'solid',
        color: '#f9fafb'
      }
    }
  }
]

// Default Team Content
export const defaultTeamContent: TeamContent = {
  layout: 'grid',
  maxWidth: 'xl',
  header: {
    title: 'Ekibimiz',
    subtitle: 'Sizin icin calisan profesyonel ekibimizle tanisin',
    alignment: 'center'
  },
  members: [],
  cardStyle: {
    backgroundColor: '#ffffff',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: '1rem',
    shadow: 'md',
    hoverEffect: 'lift',
    hoverTransitionDuration: 300,
    padding: '1.5rem',
    contentAlignment: 'center'
  },
  imageStyle: {
    shape: 'circle',
    size: 'lg',
    aspectRatio: '1:1',
    borderWidth: 0,
    grayscale: false,
    grayscaleHover: false,
    brightness: 100,
    contrast: 100,
    hoverScale: 1.05,
    objectFit: 'cover',
    showInitials: true,
    initialsBackgroundColor: '#86a789',
    initialsTextColor: '#ffffff'
  },
  socialStyle: {
    showSocial: true,
    position: 'below-info',
    iconSize: 'md',
    iconShape: 'circle',
    iconColor: '#64748b',
    iconHoverColor: '#86a789',
    gap: '0.75rem',
    animation: 'scale'
  },
  typography: {
    name: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      lineHeight: '1.4'
    },
    role: {
      fontSize: '0.95rem',
      fontWeight: '500',
      color: '#86a789',
      textTransform: 'none',
      lineHeight: '1.5'
    },
    bio: {
      fontSize: '0.875rem',
      fontWeight: '400',
      color: '#64748b',
      lineHeight: '1.6',
      maxLines: 3
    },
    quote: {
      fontSize: '0.875rem',
      fontWeight: '400',
      fontStyle: 'italic',
      color: '#64748b',
      lineHeight: '1.5',
      borderColor: '#86a789',
      borderWidth: '2px'
    }
  },
  background: {
    type: 'solid',
    color: '#f8fafc'
  },
  padding: {
    top: '4rem',
    bottom: '4rem'
  },
  memberGap: '2rem',
  animations: {
    enabled: true,
    type: 'fade',
    stagger: true,
    staggerDelay: 100,
    duration: 500,
    hoverEffects: true
  },
  responsive: {
    desktop: { columns: 3, gap: '2rem', padding: '4rem' },
    tablet: { columns: 2, gap: '1.5rem', padding: '3rem' },
    mobile: { columns: 1, gap: '1rem', padding: '2rem', stackCards: true }
  },
  showBio: true,
  showSocial: true,
  showDepartment: false,
  showSkills: false,
  showQuote: false
}
