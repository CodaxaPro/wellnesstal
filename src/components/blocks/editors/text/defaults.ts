import { TextContent } from '../../types'

export const getDefaultTextContent = (): TextContent => ({
  // Basic Content
  title: '',
  subtitle: '',
  content: 'Metninizi buraya yazın...',
  highlightedText: '', // Vurgulu metin (otomatik son kelime)
  useAutoHighlight: true, // Otomatik son kelime vurgulama

  // Content Type
  contentType: 'paragraph',

  // Images/Media
  images: [],
  imagePosition: 'none',
  imageSpacing: '2rem',
  titlePosition: 'top',
  layoutType: 'default',

  // Container Style
  containerStyle: 'none',
  containerPadding: '2rem',
  containerBackground: '#ffffff',
  containerBorderRadius: '0.75rem',

  // Quote specific
  quoteAuthor: '',
  quoteRole: '',
  quoteStyles: {
    style: 'bordered',
    borderColor: '#10b981',
    backgroundColor: '#f0fdf4',
    iconColor: '#10b981',
    authorColor: '#64748b',
    quoteIcon: 'quotes'
  },

  // List specific
  listType: 'bullet',
  listItems: [],
  listIconColor: '#10b981',

  // Code specific
  codeLanguage: 'javascript',
  codeTheme: 'dark',

  // Layout Settings
  layout: 'default',
  alignment: 'left',
  columns: 1,
  columnGap: '2rem',

  // Container Settings
  maxWidth: 'lg',
  contentWrapper: 'none' as const,
  wrapperMaxWidth: 'lg' as const,
  wrapperPadding: '2rem',
  wrapperBackground: '#ffffff',
  padding: {
    top: '3rem',
    bottom: '3rem',
    left: '1.5rem',
    right: '1.5rem'
  },
  margin: {
    top: '0',
    bottom: '0'
  },

  // Typography - About style as default (WellnessTal brand)
  typography: {
    title: {
      enabled: true,
      fontSize: '2rem', // Will be overridden by stylePreset if 'about' is selected
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
      color: '#2C2C2C', // charcoal (About style)
      marginBottom: '1rem',
      fontFamily: "'Poppins', sans-serif" // About style
    },
    subtitle: {
      enabled: true,
      fontSize: '1.25rem',
      fontWeight: '400',
      lineHeight: '1.5',
      color: '#64748b',
      marginBottom: '1.5rem',
      fontFamily: "'Poppins', sans-serif"
    },
    body: {
      fontSize: '1.125rem', // About style: 20px equivalent
      fontWeight: '400',
      lineHeight: '1.75',
      letterSpacing: '0',
      color: '#666666', // gray-custom (About style)
      paragraphSpacing: '1.5rem',
      fontFamily: "'Poppins', sans-serif" // About style
    },
    dropCap: {
      enabled: false,
      lines: 3,
      fontSize: '4rem',
      fontWeight: '700',
      color: '#10b981',
      marginRight: '0.5rem'
    },
    links: {
      color: '#10b981',
      hoverColor: '#059669',
      decoration: 'underline',
      hoverDecoration: 'none'
    },
    highlightedText: {
      fontFamily: "'Poppins', sans-serif",
      fontSize: '2rem',
      fontWeight: '700',
      color: '#9CAF88' // sage-500 (About style)
    }
  },

  // Background
  background: {
    type: 'none'
  },

  // Border
  border: {
    enabled: false,
    style: 'solid',
    width: 1,
    color: '#e2e8f0',
    radius: '0.75rem',
    sides: {
      top: true,
      right: true,
      bottom: true,
      left: true
    }
  },

  // Dividers
  topDivider: {
    enabled: false,
    style: 'solid',
    color: '#e2e8f0',
    width: '100%',
    thickness: 1,
    marginTop: '0',
    marginBottom: '2rem'
  },
  bottomDivider: {
    enabled: false,
    style: 'solid',
    color: '#e2e8f0',
    width: '100%',
    thickness: 1,
    marginTop: '2rem',
    marginBottom: '0'
  },

  // CTA Button
  ctaButton: {
    enabled: false,
    text: 'Daha Fazla',
    link: '#',
    style: 'primary',
    size: 'md',
    backgroundColor: '#10b981',
    textColor: '#ffffff',
    borderRadius: '0.5rem',
    alignment: 'left'
  },

  // Animations
  animations: {
    enabled: true,
    type: 'fade',
    duration: 500,
    delay: 0,
    triggerOnScroll: true,
    staggerParagraphs: false,
    staggerDelay: 100
  },

  // Responsive
  responsive: {
    desktop: {
      titleSize: '2rem',
      bodySize: '1.125rem'
    },
    tablet: {
      titleSize: '1.75rem',
      bodySize: '1rem'
    },
    mobile: {
      titleSize: '1.5rem',
      bodySize: '1rem'
    },
    mobileColumns: 1,
    mobileAlignment: 'left',
    mobilePadding: '1rem'
  },

  // Style Preset - About style as default for brand consistency
  stylePreset: 'about',

  // Visibility Controls
  showTitle: true,
  showSubtitle: false
})

// Style Presets - About style is first/priority for brand consistency
export const TEXT_STYLE_PRESETS = {
  about: {
    label: 'About Stili (WellnessTal)',
    description: 'About bölümü ile uyumlu stil - Öncelikli',
    settings: {
      layout: 'default' as const,
      alignment: 'left' as const,
      background: { type: 'solid' as const, color: '#ffffff' },
      typography: {
        title: { fontSize: '2rem', fontWeight: '700', color: '#2C2C2C', fontFamily: "'Poppins', sans-serif" },
        subtitle: { fontSize: '1.25rem', fontWeight: '400', color: '#64748b', fontFamily: "'Poppins', sans-serif" },
        body: { fontSize: '1.125rem', lineHeight: '1.75', color: '#666666', fontFamily: "'Poppins', sans-serif" }
      },
      padding: { top: '3rem', bottom: '3rem', left: '1.5rem', right: '1.5rem' }
    }
  },
  article: {
    label: 'Makale',
    description: 'Blog ve makale içerikleri için',
    settings: {
      layout: 'narrow' as const,
      maxWidth: 'lg' as const,
      alignment: 'left' as const,
      typography: {
        title: { fontSize: '2.5rem', fontWeight: '700' },
        body: { fontSize: '1.125rem', lineHeight: '1.8' }
      }
    }
  },
  quote: {
    label: 'Alıntı',
    description: 'Öne çıkan alıntılar için',
    settings: {
      contentType: 'quote' as const,
      layout: 'narrow' as const,
      alignment: 'center' as const,
      typography: {
        body: { fontSize: '1.5rem', fontWeight: '500', lineHeight: '1.6' }
      },
      quoteStyles: {
        style: 'large' as const,
        borderColor: '#10b981',
        iconColor: '#10b981'
      }
    }
  },
  feature: {
    label: 'Özellik',
    description: 'Özellik açıklamaları için',
    settings: {
      layout: 'default' as const,
      alignment: 'center' as const,
      maxWidth: 'md' as const,
      typography: {
        title: { fontSize: '1.75rem', fontWeight: '600' },
        body: { fontSize: '1rem', lineHeight: '1.6', color: '#64748b' }
      }
    }
  },
  minimal: {
    label: 'Minimal',
    description: 'Sade ve temiz görünüm',
    settings: {
      layout: 'default' as const,
      alignment: 'left' as const,
      typography: {
        title: { fontSize: '1.5rem', fontWeight: '500' },
        body: { fontSize: '1rem', lineHeight: '1.7' }
      },
      border: { enabled: false },
      background: { type: 'none' as const }
    }
  },
  card: {
    label: 'Kart',
    description: 'Kart içinde görünüm',
    settings: {
      layout: 'default' as const,
      background: { type: 'solid' as const, color: '#ffffff' },
      border: {
        enabled: true,
        style: 'solid' as const,
        width: 1,
        color: '#e2e8f0',
        radius: '1rem'
      },
      padding: { top: '2rem', bottom: '2rem', left: '2rem', right: '2rem' }
    }
  },
  highlight: {
    label: 'Vurgulu',
    description: 'Dikkat çeken içerik',
    settings: {
      layout: 'default' as const,
      background: { type: 'solid' as const, color: '#f0fdf4' },
      border: {
        enabled: true,
        style: 'solid' as const,
        width: 0,
        color: 'transparent',
        radius: '1rem',
        sides: { top: false, right: false, bottom: false, left: true }
      },
      padding: { top: '1.5rem', bottom: '1.5rem', left: '1.5rem', right: '1.5rem' }
    }
  },
  problem: {
    label: 'Problem Tanımlama',
    description: 'Sorun tanımlama bölümü için (gri arka plan)',
    settings: {
      layout: 'default' as const,
      alignment: 'left' as const,
      background: { type: 'solid' as const, color: '#f7f5f3' },
      typography: {
        title: { fontSize: '2.5rem', fontWeight: '700', color: '#2C2C2C' },
        body: { fontSize: '1.125rem', lineHeight: '1.75', color: '#666666' }
      },
      padding: { top: '4rem', bottom: '4rem', left: '1.5rem', right: '1.5rem' }
    }
  },
  solution: {
    label: 'Çözüm Açıklama',
    description: 'Çözüm açıklama bölümü için (vurgulu)',
    settings: {
      layout: 'default' as const,
      alignment: 'left' as const,
      background: { type: 'solid' as const, color: '#ffffff' },
      typography: {
        title: { fontSize: '2.5rem', fontWeight: '700', color: '#2C2C2C', fontFamily: "'Poppins', sans-serif" },
        body: { fontSize: '1.125rem', lineHeight: '1.75', color: '#666666', fontFamily: "'Poppins', sans-serif" }
      },
      padding: { top: '4rem', bottom: '4rem', left: '1.5rem', right: '1.5rem' }
    }
  },
  about: {
    label: 'About Stili (WellnessTal)',
    description: 'About bölümü ile uyumlu stil - Öncelikli',
    settings: {
      layout: 'default' as const,
      alignment: 'left' as const,
      background: { type: 'solid' as const, color: '#ffffff' },
      typography: {
        title: { fontSize: '2rem', fontWeight: '700', color: '#2C2C2C', fontFamily: "'Poppins', sans-serif" },
        subtitle: { fontSize: '1.25rem', fontWeight: '400', color: '#64748b', fontFamily: "'Poppins', sans-serif" },
        body: { fontSize: '1.125rem', lineHeight: '1.75', color: '#666666', fontFamily: "'Poppins', sans-serif" }
      },
      padding: { top: '3rem', bottom: '3rem', left: '1.5rem', right: '1.5rem' }
    }
  }
}

// Layout Options
export const LAYOUT_OPTIONS = [
  { id: 'default', label: 'Varsayılan', icon: '▣', description: 'Standart düzen' },
  { id: 'narrow', label: 'Dar', icon: '▢', description: 'Dar içerik alanı' },
  { id: 'wide', label: 'Geniş', icon: '▬', description: 'Geniş içerik alanı' },
  { id: 'full', label: 'Tam Genişlik', icon: '▭', description: 'Ekran genişliği' },
  { id: 'split', label: 'Bölünmüş', icon: '⬓', description: 'İki sütunlu' },
  { id: 'sidebar-left', label: 'Sol Kenar', icon: '◧', description: 'Sol kenar çubuğu' },
  { id: 'sidebar-right', label: 'Sağ Kenar', icon: '◨', description: 'Sağ kenar çubuğu' }
]

// Content Type Options
export const CONTENT_TYPE_OPTIONS = [
  { id: 'paragraph', label: 'Paragraf', icon: '¶', description: 'Normal metin' },
  { id: 'quote', label: 'Alıntı', icon: '"', description: 'Alıntı bloğu' },
  { id: 'callout', label: 'Bilgi Kutusu', icon: '💡', description: 'Dikkat çekici bilgi' },
  { id: 'list', label: 'Liste', icon: '•', description: 'Madde listesi' },
  { id: 'code', label: 'Kod', icon: '</>', description: 'Kod bloğu' }
]
