export interface WhatsAppSettings {
  basic: {
    enabled: boolean
    phoneNumber: string
    useOriginalStyle: boolean
    position: 'bottom-right' | 'bottom-left'
  }
  appearance: {
    buttonColor: string
    buttonHoverColor: string
    iconColor: string
    size: 'small' | 'medium' | 'large'
    shadow: boolean
    pulseAnimation: boolean
    borderRadius: 'full' | 'rounded' | 'square'
  }
  message: {
    defaultMessage: string
    tooltipText: string
    tooltipDelay: number
    showTooltipOnLoad: boolean
    autoShowTooltipAfter: number
  }
  display: {
    showOnMobile: boolean
    showOnDesktop: boolean
    showOnAllPages: boolean
    excludedPages: string[]
    showAfterDelay: number
    showAfterScroll: number
  }
  availability: {
    mode: 'always-online' | 'always-offline' | 'based-on-hours' | 'manual'
    manualStatus: boolean
    showIndicator: boolean
    onlineColor: string
    offlineColor: string
    offlineMessage: string
  }
  ctaBubble: {
    enabled: boolean
    title: string
    message: string
    backgroundColor: string
    textColor: string
    titleColor: string
    showAfterDelay: number
    dismissable: boolean
  }
}

export interface TabItem {
  id: string
  label: string
  icon: string
}
