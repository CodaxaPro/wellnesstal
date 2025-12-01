import { GalleryContent } from '../../types'

// Tab definitions
export const GALLERY_TABS = [
  { id: 'images', label: 'Gorseller', icon: 'G' },
  { id: 'layout', label: 'Duzenleme', icon: 'D' },
  { id: 'style', label: 'Stil', icon: 'S' },
  { id: 'lightbox', label: 'Lightbox', icon: 'L' }
]

// Layout type options
export const LAYOUT_TYPE_OPTIONS = [
  { id: 'grid', label: 'Grid', icon: '⊞' },
  { id: 'masonry', label: 'Masonry', icon: '⊟' },
  { id: 'slider', label: 'Slider', icon: '⊡' },
  { id: 'justified', label: 'Justified', icon: '☰' }
]

// Column options
export const COLUMN_OPTIONS = [
  { id: 2, label: '2 Kolon' },
  { id: 3, label: '3 Kolon' },
  { id: 4, label: '4 Kolon' },
  { id: 5, label: '5 Kolon' },
  { id: 6, label: '6 Kolon' }
]

// Mobile column options
export const MOBILE_COLUMN_OPTIONS = [
  { id: 1, label: '1 Kolon' },
  { id: 2, label: '2 Kolon' }
]

// Aspect ratio options
export const ASPECT_RATIO_OPTIONS = [
  { id: 'square', label: 'Kare (1:1)' },
  { id: '4:3', label: '4:3' },
  { id: '16:9', label: '16:9' },
  { id: '3:2', label: '3:2' },
  { id: 'original', label: 'Orijinal' }
]

// Gap options
export const GAP_OPTIONS = [
  { id: 0, label: 'Yok' },
  { id: 4, label: 'Kucuk (4px)' },
  { id: 8, label: 'Normal (8px)' },
  { id: 12, label: 'Orta (12px)' },
  { id: 16, label: 'Genis (16px)' },
  { id: 24, label: 'Cok Genis (24px)' }
]

// Shadow options
export const SHADOW_OPTIONS = [
  { id: 'none', label: 'Yok' },
  { id: 'sm', label: 'Kucuk' },
  { id: 'md', label: 'Orta' },
  { id: 'lg', label: 'Buyuk' },
  { id: 'xl', label: 'Cok Buyuk' }
]

// Hover effect options
export const HOVER_EFFECT_OPTIONS = [
  { id: 'none', label: 'Yok' },
  { id: 'zoom', label: 'Zoom' },
  { id: 'fade', label: 'Fade' },
  { id: 'slide-up', label: 'Yukari Kaydir' },
  { id: 'overlay', label: 'Overlay' }
]

// Caption position options
export const CAPTION_POSITION_OPTIONS = [
  { id: 'overlay', label: 'Overlay' },
  { id: 'below', label: 'Altta' }
]

// Border radius options
export const BORDER_RADIUS_OPTIONS = [
  { id: 0, label: 'Yok' },
  { id: 4, label: 'Kucuk (4px)' },
  { id: 8, label: 'Orta (8px)' },
  { id: 12, label: 'Buyuk (12px)' },
  { id: 16, label: 'Cok Buyuk (16px)' },
  { id: 24, label: 'Ekstra (24px)' }
]

// Default content
export const defaultGalleryContent: GalleryContent = {
  title: '',
  subtitle: '',
  images: [],
  layout: {
    type: 'grid',
    columns: 3,
    gap: 16,
    aspectRatio: 'square',
    mobileColumns: 2
  },
  style: {
    borderRadius: 12,
    shadow: 'md',
    hoverEffect: 'zoom',
    showCaption: true,
    captionPosition: 'overlay',
    overlayColor: '#000000',
    overlayOpacity: 50
  },
  lightbox: {
    enabled: true,
    showThumbnails: true,
    showCounter: true,
    showCaption: true,
    backgroundColor: 'rgba(0,0,0,0.9)',
    closeOnOverlayClick: true
  },
  filter: {
    enabled: false,
    categories: [],
    showAllButton: true,
    allButtonText: 'Tumu'
  },
  backgroundColor: '#ffffff'
}
