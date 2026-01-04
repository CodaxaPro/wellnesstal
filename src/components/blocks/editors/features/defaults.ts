import { FeaturesContent, FeatureItem } from '../../types'

export const getDefaultFeatureItem = (): FeatureItem => ({
  id: `feature-${Date.now()}`,
  title: 'Yeni Özellik',
  description: 'Özellik açıklamasını buraya yazın.',
  icon: 'star',
  iconConfig: {
    type: 'preset',
    value: 'star',
    backgroundColor: '#10b981',
    iconColor: '#ffffff',
    size: 'md',
    shape: 'circle',
    shadow: 'none'
  },
  showFeaturesList: false,
  featuresList: [],
  visible: true
})

export const getDefaultFeaturesContent = (): FeaturesContent => ({
  // Section Header
  title: 'Was macht Headspa so besonders?',
  subtitle: 'Entdecke die vielfältigen Vorteile dieser einzigartigen Behandlung.',
  headerAlignment: 'center',
  showDivider: false,
  dividerColor: '#e2e8f0',

  // Features Data
  features: [
    {
      id: 'feature-1',
      title: 'Tiefenentspannung',
      description: 'Lass den Alltagsstress hinter dir und tauche ein in eine Welt der Ruhe und Entspannung.',
      icon: 'spa',
      iconConfig: {
        type: 'preset',
        value: 'spa',
        backgroundColor: '#9CAF88',
        iconColor: '#ffffff',
        size: 'md',
        shape: 'circle',
        shadow: 'none'
      },
      showFeaturesList: true,
      featuresList: [
        { id: '1', text: 'Sanfte Kopfhautmassage', enabled: true },
        { id: '2', text: 'Entspannung für Körper und Geist', enabled: true },
        { id: '3', text: 'Reduzierung von Stress und Verspannungen', enabled: true }
      ],
      visible: true
    },
    {
      id: 'feature-2',
      title: 'Intensive Kopfhautpflege',
      description: 'Deine Kopfhaut wird mit hochwertigen Produkten verwöhnt und gepflegt.',
      icon: 'leaf',
      iconConfig: {
        type: 'preset',
        value: 'leaf',
        backgroundColor: '#9CAF88',
        iconColor: '#ffffff',
        size: 'md',
        shape: 'circle',
        shadow: 'none'
      },
      showFeaturesList: true,
      featuresList: [
        { id: '1', text: 'Reinigung und Peeling der Kopfhaut', enabled: true },
        { id: '2', text: 'Nährstoffreiche Masken', enabled: true },
        { id: '3', text: 'Verbesserte Durchblutung', enabled: true }
      ],
      visible: true
    },
    {
      id: 'feature-3',
      title: 'Gesunder Haarwuchs',
      description: 'Fördere das natürliche Haarwachstum und stärke deine Haare von der Wurzel an.',
      icon: 'heart',
      iconConfig: {
        type: 'preset',
        value: 'heart',
        backgroundColor: '#9CAF88',
        iconColor: '#ffffff',
        size: 'md',
        shape: 'circle',
        shadow: 'none'
      },
      showFeaturesList: true,
      featuresList: [
        { id: '1', text: 'Stärkung der Haarwurzeln', enabled: true },
        { id: '2', text: 'Verbesserte Haarstruktur', enabled: true },
        { id: '3', text: 'Mehr Glanz und Volumen', enabled: true }
      ],
      visible: true
    }
  ],

  // Layout
  layout: 'grid',
  columns: 3,

  // Grid Settings
  gridGap: '2rem',
  alignItems: 'stretch',

  // Carousel Settings
  carousel: {
    autoPlay: false,
    autoPlayInterval: 5000,
    showDots: true,
    showArrows: true,
    slidesPerView: 3,
    loop: true
  },

  // Global Card Styles
  cardStyles: {
    backgroundColor: '#ffffff',
    backgroundHover: '#f8fafc',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: '1rem',
    shadow: 'sm',
    shadowHover: 'md',
    hoverEffect: 'lift',
    hoverTransitionDuration: 300,
    paddingX: '1.5rem',
    paddingY: '2rem',
    contentGap: '1rem'
  },

  // Global Icon Styles
  iconStyles: {
    showIcons: true,
    position: 'top',
    size: 'md',
    shape: 'circle',
    backgroundColor: '#10b981',
    iconColor: '#ffffff',
    shadow: 'none',
    borderWidth: 0,
    borderColor: 'transparent',
    hoverAnimation: 'none'
  },

  // Typography
  typography: {
    sectionTitle: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#1e293b',
      alignment: 'center',
      marginBottom: '1rem'
    },
    sectionSubtitle: {
      fontSize: '1.125rem',
      fontWeight: '400',
      color: '#64748b',
      maxWidth: '600px'
    },
    featureTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#1e293b',
      lineHeight: '1.4'
    },
    featureDescription: {
      fontSize: '1rem',
      fontWeight: '400',
      color: '#64748b',
      lineHeight: '1.6'
    }
  },

  // Background
  background: {
    type: 'solid',
    color: '#ffffff'
  },

  // Section Padding
  padding: {
    top: '5rem',
    bottom: '5rem',
    left: '1.5rem',
    right: '1.5rem'
  },

  // Container
  maxWidth: 'xl',

  // Animations
  animations: {
    enabled: true,
    type: 'fade',
    stagger: true,
    staggerDelay: 100,
    duration: 500,
    triggerOnScroll: true,
    iconAnimation: 'none'
  },

  // Responsive
  responsive: {
    desktop: 3,
    tablet: 2,
    mobile: 1,
    desktopGap: '2rem',
    tabletGap: '1.5rem',
    mobileGap: '1rem',
    mobileStackIcons: false,
    mobileHideIcons: false,
    mobileCardStyle: 'full'
  },

  // Visibility Controls
  showTitle: true,
  showSubtitle: true,
  showDescriptions: true,
  showIcons: true,
  showLinks: false
})

// Preset icon definitions with SVG paths
export const PRESET_ICONS: Record<string, string> = {
  // Essential
  star: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  check: 'M20 6L9 17l-5-5',
  checkCircle: 'M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3',
  x: 'M18 6L6 18M6 6l12 12',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',

  // Nature
  leaf: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
  sun: 'M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41M12 6a6 6 0 1 0 0 12 6 6 0 0 0 0-12Z',
  moon: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z',
  flower: 'M12 7.5a4.5 4.5 0 1 1 4.5 4.5M12 7.5A4.5 4.5 0 1 0 7.5 12M12 7.5V9m-4.5 3a4.5 4.5 0 1 0 4.5 4.5M7.5 12H9m7.5 0a4.5 4.5 0 1 1-4.5 4.5m4.5-4.5H15m-3 7.5V15',
  tree: 'M12 22v-7m0 0l-3-3 3-4 3 4-3 3zm6-10a6 6 0 1 0-12 0c0 3.31 2.69 6 6 6s6-2.69 6-6z',

  // Health & Wellness
  heart: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  heartPulse: 'M19.5 12.572l-7.5 7.428-7.5-7.428A5 5 0 1 1 12 6.006a5 5 0 1 1 7.5 6.572M12 6l1 4h2l-3 3.5 1 2.5-3-2.5L7 16l1-2.5L5 10h2l1-4',
  spa: 'M12 22c-4.97 0-9-1.79-9-4s4.03-4 9-4 9 1.79 9 4-4.03 4-9 4ZM8 14v-2c0-2.21 1.79-4 4-4s4 1.79 4 4v2M12 2v4',
  activity: 'M22 12h-4l-3 9L9 3l-3 9H2',
  thermometer: 'M14 14.76V3.5a2.5 2.5 0 0 0-5 0v11.26a4.5 4.5 0 1 0 5 0z',

  // Time
  clock: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
  calendar: 'M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM16 2v4M8 2v4M3 10h18',
  timer: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 6v6M16 2l2 2M8 2l-2 2',
  hourglass: 'M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2',

  // Buildings & Places
  home: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  building: 'M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2 M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2 M10 6h4 M10 10h4 M10 14h4 M10 18h4',
  store: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10M10 2l-1 7M14 2l1 7',
  mapPin: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',

  // Security & Trust
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  shieldCheck: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z M9 12l2 2 4-4',
  lock: 'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2zM7 11V7a5 5 0 0 1 10 0v4',
  key: 'M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',

  // Communication
  phone: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
  mail: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zM22 6l-10 7L2 6',
  messageCircle: 'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z',

  // User & People
  user: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  users: 'M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',
  userCheck: 'M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM17 11l2 2 4-4',
  smile: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',

  // Money & Business
  creditCard: 'M21 4H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM1 10h22',
  dollarSign: 'M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  percent: 'M19 5L5 19M6.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5zM17.5 20a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z',
  gift: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  tag: 'M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82zM7 7h.01',

  // Tools & Settings
  settings: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  tool: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  wrench: 'M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z',
  zap: 'M13 2L3 14h9l-1 8 10-12h-9l1-8z',

  // Media & Content
  image: 'M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21',
  video: 'M23 7l-7 5 7 5V7zM14 5H3a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z',
  music: 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  file: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z M13 2v7h7',
  folder: 'M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z',

  // Arrows & Navigation
  arrowRight: 'M5 12h14M12 5l7 7-7 7',
  arrowLeft: 'M19 12H5M12 19l-7-7 7-7',
  arrowUp: 'M12 19V5M5 12l7-7 7 7',
  arrowDown: 'M12 5v14M19 12l-7 7-7-7',
  chevronRight: 'M9 18l6-6-6-6',
  chevronLeft: 'M15 18l-6-6 6-6',
  externalLink: 'M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3',

  // Status & Feedback
  info: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 16v-4M12 8h.01',
  alertCircle: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 8v4M12 16h.01',
  helpCircle: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01',
  award: 'M12 15l-3 9 3-2 3 2-3-9zM12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z',
  trophy: 'M6 9H4.5a2.5 2.5 0 0 1 0-5H6M18 9h1.5a2.5 2.5 0 0 0 0-5H18M4 22h16M10 22v-4h4v4M6 2h12v7a6 6 0 0 1-12 0V2z',

  // Misc
  globe: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z',
  compass: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM16.24 7.76l-2.12 6.36-6.36 2.12 2.12-6.36 6.36-2.12z',
  target: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  coffee: 'M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1v3M10 1v3M14 1v3',
  umbrella: 'M23 12a11.05 11.05 0 0 0-22 0zM12 12v9',
  feather: 'M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5zM16 8L2 22M17.5 15H9',
  package: 'M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
  layers: 'M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  box: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM3.27 6.96L12 12.01l8.73-5.05M12 22.08V12',
  infinity: 'M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.267-8-5.096 0-5.096 8 0 8 5.096 0 7.133-8 12.267-8z',
  sparkles: 'M12 3v2M19.07 4.93l-1.41 1.41M21 12h-2M19.07 19.07l-1.41-1.41M12 19v2M4.93 19.07l1.41-1.41M3 12h2M4.93 4.93l1.41 1.41M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z'
}

// Icon categories for UI organization
export const ICON_CATEGORIES = [
  {
    name: 'Temel',
    icons: ['star', 'check', 'checkCircle', 'x', 'plus', 'minus']
  },
  {
    name: 'Doğa',
    icons: ['leaf', 'sun', 'moon', 'flower', 'tree']
  },
  {
    name: 'Sağlık',
    icons: ['heart', 'heartPulse', 'spa', 'activity', 'thermometer']
  },
  {
    name: 'Zaman',
    icons: ['clock', 'calendar', 'timer', 'hourglass']
  },
  {
    name: 'Mekanlar',
    icons: ['home', 'building', 'store', 'mapPin']
  },
  {
    name: 'Güvenlik',
    icons: ['shield', 'shieldCheck', 'lock', 'key', 'eye']
  },
  {
    name: 'İletişim',
    icons: ['phone', 'mail', 'messageCircle', 'send']
  },
  {
    name: 'Kullanıcı',
    icons: ['user', 'users', 'userCheck', 'smile']
  },
  {
    name: 'İş',
    icons: ['creditCard', 'dollarSign', 'percent', 'gift', 'tag']
  },
  {
    name: 'Araçlar',
    icons: ['settings', 'tool', 'wrench', 'zap']
  },
  {
    name: 'Medya',
    icons: ['image', 'video', 'music', 'file', 'folder']
  },
  {
    name: 'Yönler',
    icons: ['arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'chevronRight', 'chevronLeft', 'externalLink']
  },
  {
    name: 'Durum',
    icons: ['info', 'alertCircle', 'helpCircle', 'award', 'trophy']
  },
  {
    name: 'Diğer',
    icons: ['globe', 'compass', 'target', 'coffee', 'umbrella', 'feather', 'package', 'layers', 'box', 'infinity', 'sparkles']
  }
]
