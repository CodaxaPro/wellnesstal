import { WhatsAppContent } from '../../types'

// Tab definitions
export const WHATSAPP_TABS = [
  { id: 'basic', label: 'Temel', icon: 'S' },
  { id: 'appearance', label: 'Gorunum', icon: 'G' },
  { id: 'message', label: 'Mesaj', icon: 'M' },
  { id: 'display', label: 'Gosterim', icon: 'D' },
  { id: 'availability', label: 'Durum', icon: 'A' },
  { id: 'cta', label: 'CTA Balonu', icon: 'C' }
]

// Size options
export const SIZE_OPTIONS = [
  { id: 'small', label: 'Kucuk' },
  { id: 'medium', label: 'Orta' },
  { id: 'large', label: 'Buyuk' }
]

// Border radius options
export const BORDER_RADIUS_OPTIONS = [
  { id: 'full', label: 'Tam Yuvarlak' },
  { id: 'rounded', label: 'Yuvarlatilmis' },
  { id: 'square', label: 'Kose' }
]

// Position options
export const POSITION_OPTIONS = [
  { id: 'bottom-right', label: 'Sag Alt', icon: '↘' },
  { id: 'bottom-left', label: 'Sol Alt', icon: '↙' }
]

// Availability mode options
export const AVAILABILITY_MODE_OPTIONS = [
  { id: 'always-online', label: 'Her Zaman Cevrimici' },
  { id: 'always-offline', label: 'Her Zaman Cevrimdisi' },
  { id: 'manual', label: 'Manuel' }
]

// Default content
export const defaultWhatsAppContent: WhatsAppContent = {
  basic: {
    enabled: true,
    phoneNumber: '+90 555 123 4567',
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
    defaultMessage: 'Merhaba, web sitenizden ulasiyorum.',
    tooltipText: 'WhatsApp ile yazin',
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
    offlineMessage: 'Su anda cevrimdisi - En kisa surede donecegiz.'
  },
  ctaBubble: {
    enabled: false,
    title: 'Sorulariniz mi var?',
    message: 'WhatsApp uzerinden bize yazin - yardimci olmaktan mutluluk duyariz!',
    backgroundColor: '#FFFFFF',
    textColor: '#1F2937',
    titleColor: '#25D366',
    showAfterDelay: 3000,
    dismissable: true
  }
}
