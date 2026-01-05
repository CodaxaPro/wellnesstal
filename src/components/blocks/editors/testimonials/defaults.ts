import { TestimonialsContent, Testimonial } from '../../types'

export const getDefaultTestimonial = (): Testimonial => ({
  id: `testimonial-${Date.now()}`,
  name: 'Kundenname',
  role: '',
  company: '',
  content: 'Tolles Erlebnis!',
  rating: 5,
  readMoreLink: {
    enabled: false,
    text: 'Weiter lesen',
    url: '#'
  }
})

export const getDefaultTestimonialsContent = (): TestimonialsContent => ({
  title: 'Was unsere Kunden sagen',
  badge: '💬 Kundenstimmen',
  sectionTitle: 'Was unsere Kunden',
  highlightedText: 'sagen',
  description: 'Echte Bewertungen von zufriedenen Kunden - Ihre Meinung ist uns wichtig',
  autoSlideDelay: 5000,
  autoPlay: true,
  showRatings: true,
  maxDisplayCount: 5,
  layout: 'carousel',
  stats: [
    { value: '500+', label: 'Zufriedene Kunden' },
    { value: '4.9', label: '⭐ Google Bewertung' },
    { value: '98%', label: 'Weiterempfehlung' },
    { value: '5J', label: 'Erfahrung' }
  ],
  testimonials: [
    {
      id: 'testimonial-1',
      name: 'Sarah M.',
      role: '',
      company: '',
      content: 'Die Headspa-Behandlung war absolut entspannend! Ich habe mich wie neu geboren gefühlt. Die Kopfhautpflege ist intensiv und die Massage einfach himmlisch. Kann ich nur weiterempfehlen!',
      rating: 5,
      readMoreLink: {
        enabled: true,
        text: 'Weiter lesen',
        url: '#testimonial-1'
      }
    },
    {
      id: 'testimonial-2',
      name: 'Michael K.',
      role: '',
      company: '',
      content: 'Als Mann war ich zunächst skeptisch, aber die Behandlung hat mich überzeugt. Meine Kopfhaut fühlt sich viel gesünder an und die Entspannung war genau das, was ich nach einem stressigen Tag brauchte.',
      rating: 5,
      readMoreLink: {
        enabled: true,
        text: 'Weiter lesen',
        url: '#testimonial-2'
      }
    },
    {
      id: 'testimonial-3',
      name: 'Lisa T.',
      role: '',
      company: '',
      content: 'Das Premium-Paket ist jeden Cent wert! Die Behandlung dauert lange genug, um wirklich abzuschalten, und die Ergebnisse sind bereits nach der ersten Sitzung sichtbar. Meine Haare sehen gesünder aus.',
      rating: 5,
      readMoreLink: {
        enabled: true,
        text: 'Weiter lesen',
        url: '#testimonial-3'
      }
    },
    {
      id: 'testimonial-4',
      name: 'Anna B.',
      role: '',
      company: '',
      content: 'Ich war mit meiner Freundin beim Partnertermin. Es war ein wundervolles gemeinsames Erlebnis! Die Atmosphäre ist sehr entspannend und das Personal sehr professionell.',
      rating: 5,
      readMoreLink: {
        enabled: true,
        text: 'Weiter lesen',
        url: '#testimonial-4'
      }
    }
  ]
})

