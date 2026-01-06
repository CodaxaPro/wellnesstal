import { WhatsAppSettings, TabItem } from './types'

export const defaultSettings: WhatsAppSettings = {
  basic: {
    enabled: true,
    phoneNumber: '+49 1733828581',
    useOriginalStyle: false,
    position: 'bottom-right'
  },
  appearance: {
    buttonColor: '#25D366',
    buttonHoverColor: '#128C7E',
    iconColor: '#FFFFFF',
    size: 'medium',
    shadow: true,
    pulseAnimation: true,
    borderRadius: 'full'
  },
  message: {
    defaultMessage: 'Hallo, ich interessiere mich für eine Wellness-Behandlung bei Wellnesstal.',
    tooltipText: 'WhatsApp Nachricht senden',
    tooltipDelay: 0,
    showTooltipOnLoad: false,
    autoShowTooltipAfter: 0
  },
  display: {
    showOnMobile: true,
    showOnDesktop: true,
    showOnAllPages: true,
    excludedPages: [],
    showAfterDelay: 0,
    showAfterScroll: 0
  },
  availability: {
    mode: 'always-online',
    manualStatus: true,
    showIndicator: true,
    onlineColor: '#22C55E',
    offlineColor: '#EF4444',
    offlineMessage: 'Derzeit offline - Wir antworten so schnell wie möglich.'
  },
  ctaBubble: {
    enabled: false,
    title: 'Haben Sie Fragen?',
    message: 'Schreiben Sie uns auf WhatsApp - wir helfen Ihnen gerne!',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    titleColor: '#25D366',
    showAfterDelay: 3000,
    dismissable: true
  }
}

export const tabs: TabItem[] = [
  { id: 'basic', label: 'Grundeinstellungen', icon: '⚙️' },
  { id: 'appearance', label: 'Erscheinungsbild', icon: '🎨' },
  { id: 'message', label: 'Nachrichten', icon: '💬' },
  { id: 'display', label: 'Anzeige', icon: '👁️' },
  { id: 'availability', label: 'Verfügbarkeit', icon: '🟢' },
  { id: 'cta', label: 'CTA Bubble', icon: '💭' }
]

export const sizeClasses = {
  small: 'w-10 h-10',
  medium: 'w-14 h-14',
  large: 'w-16 h-16'
}

export const iconSizes = {
  small: 'w-5 h-5',
  medium: 'w-7 h-7',
  large: 'w-8 h-8'
}

export const borderRadiusClasses = {
  full: 'rounded-full',
  rounded: 'rounded-xl',
  square: 'rounded-lg'
}
