import { TextContent } from '../../types'

export const getDefaultTextContent = (): TextContent => ({
  // Basic Content
  title: '',
  subtitle: '',
  content: 'Metninizi buraya yazın...',

  // Content Type
  contentType: 'paragraph',

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

  // Typography
  typography: {
    title: {
      enabled: true,
      fontSize: '2rem',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.02em',
      color: '#1e293b',
      marginBottom: '1rem'
    },
    subtitle: {
      enabled: true,
      fontSize: '1.25rem',
      fontWeight: '400',
      lineHeight: '1.5',
      color: '#64748b',
      marginBottom: '1.5rem'
    },
    body: {
      fontSize: '1.125rem',
      fontWeight: '400',
      lineHeight: '1.75',
      letterSpacing: '0',
      color: '#374151',
      paragraphSpacing: '1.5rem'
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

  // Style Preset
  stylePreset: 'custom',

  // Visibility Controls
  showTitle: true,
  showSubtitle: false
})

// Style Presets
export const TEXT_STYLE_PRESETS = {
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
