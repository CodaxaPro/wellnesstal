import { HeroContent } from '../../types'

// Default hero content
export const getDefaultContent = (): HeroContent => ({
  layout: 'split-right',
  contentAlignment: 'left',
  verticalAlignment: 'center',
  minHeight: '600px',
  maxWidth: '1400px',
  padding: { top: '80px', bottom: '80px', left: '24px', right: '24px' },
  title: 'Başlığınızı Buraya Yazın',
  subtitle: 'Alt başlık metni buraya gelecek',
  buttons: [
    { text: 'Başla', link: '#', style: 'primary', size: 'lg', hoverEffect: 'scale' }
  ],
  mediaType: 'image',
  imageStyles: {
    borderRadius: '16px',
    boxShadow: 'none',
    opacity: 100,
    hoverScale: 105,
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    overlayOpacity: 0,
    overlayColor: '#000000',
    objectFit: 'cover',
    objectPosition: 'center',
    sizeMode: 'auto',
    width: '100%',
    height: 'auto',
    maxWidth: '100%',
    maxHeight: 'none',
    minWidth: '',
    minHeight: '',
    aspectRatio: 'auto',
    customAspectRatio: '16/9',
    containerWidth: 'full',
    customContainerWidth: '800px',
    containerHeight: 'auto',
    customContainerHeight: '',
    mobileWidth: '100%',
    mobileHeight: 'auto',
    tabletWidth: '100%',
    tabletHeight: 'auto'
  },
  backgroundType: 'solid',
  backgroundColor: '#f8fafc',
  animations: {
    enabled: true,
    titleAnimation: 'slide-up',
    subtitleAnimation: 'fade',
    imageAnimation: 'fade',
    buttonAnimation: 'slide-up',
    staggerDelay: 100,
    duration: 600
  },
  responsive: {
    mobileLayout: 'stacked',
    mobileTextAlign: 'center',
    mobileImagePosition: 'top',
    tabletLayout: 'stacked',
    hideOnMobile: [],
    mobileMinHeight: '500px'
  },
  // Enterprise Element-Level Alignments
  elementAlignments: {
    badge: 'left',
    title: 'left',
    subtitle: 'left',
    description: 'left',
    buttons: 'left',
    trustIndicator: 'left'
  }
})
