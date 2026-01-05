import { AboutContent } from '../../types'

export const getDefaultAboutContent = (): AboutContent => ({
  badge: '✨ Über WellnessTal Studio',
  title: 'Ihre Wellness-Oase im Herzen von Baesweiler',
  description: 'Seit über 5 Jahren widmen wir uns mit Leidenschaft Ihrem Wohlbefinden. Unser erfahrenes Team aus zertifizierten Wellness-Therapeuten bietet Ihnen individuelle Behandlungen in entspannter Atmosphäre.',
  stats: [
    { label: 'Zufriedene Kunden', value: '500+' },
    { label: 'Jahre Erfahrung', value: '5+' }
  ],
  primaryButton: 'Persönliche Beratung',
  primaryButtonLink: '#contact',
  secondaryButton: 'Mehr erfahren',
  secondaryButtonLink: '#contact',
  images: [
    { url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Wellness Studio Innenbereich' },
    { url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Entspannende Behandlung' },
    { url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Wellness Produkte' },
    { url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80', alt: 'Entspannte Kundin' }
  ]
})

