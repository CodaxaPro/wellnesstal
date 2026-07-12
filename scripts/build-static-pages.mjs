#!/usr/bin/env node
/**
 * Rebuild content/pages/*.json from repo sources (no Supabase backup required).
 * Run: node scripts/build-static-pages.mjs
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const PAGES_DIR = path.join(ROOT, 'content', 'pages')

function block(id, block_type, position, content, visible = true) {
  return { id, block_type, content, position, visible }
}

const headerContent = {
  logoText: 'Wellnesstal',
  logoEmoji: '🌿',
  navItems: [
    { href: '/', label: 'Start' },
    { href: '/headspa', label: 'Headspa' },
    { href: '/gutschein', label: 'Gutschein' },
    { href: '#contact', label: 'Kontakt' },
  ],
  ctaButtonText: 'Termin vereinbaren',
  ctaButtonType: 'phone',
  ctaButtonLink: '+49 1733828581',
  ctaButtonVisible: true,
}

const textPreset = (stylePreset, title, contentText, bg = '#f7f5f3') => ({
  stylePreset,
  title,
  content: contentText,
  showTitle: true,
  showSubtitle: false,
  maxWidth: 'xl',
  padding: { top: '4rem', bottom: '4rem', left: '1.5rem', right: '1.5rem' },
  typography: {
    title: {
      enabled: true,
      fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
      fontWeight: '700',
      lineHeight: '1.2',
      color: '#2C2C2C',
      marginBottom: '1.5rem',
    },
    body: {
      fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
      fontWeight: '400',
      lineHeight: '1.75',
      color: '#666666',
    },
  },
  background: { type: 'solid', color: bg },
})

const treatmentFeatures = {
  title: 'Was macht Headspa so besonders?',
  subtitle: 'Entdecke die einzelnen Schritte unserer Headspa-Behandlung',
  headerAlignment: 'center',
  layout: 'grid',
  columns: 2,
  features: [
    {
      id: 'treatment-1',
      title: 'Sanfte Kopf, Nacken und Schultermassage',
      description:
        'Zu Beginn der Behandlung genießt du eine entspannende Massage für Kopf, Nacken und Schultern. Diese Massage löst Verspannungen, fördert die Durchblutung und lindert stressbedingte Kopfschmerzen. Spüre, wie die Anspannung des Alltags nachlässt und sich tiefe Entspannung ausbreitet.',
      icon: 'spa',
      showFeaturesList: true,
      featuresList: [
        { id: '1', text: 'Löst Verspannungen und lindert Beschwerden', enabled: true },
        { id: '2', text: 'Fördert die Durchblutung für mehr Klarheit', enabled: true },
        { id: '3', text: 'Reduziert stressbedingte Kopfschmerzen', enabled: true },
      ],
      visible: true,
    },
    {
      id: 'treatment-2',
      title: 'Tiefenreinigung der Kopfhaut',
      description:
        'Anschließend wird deine Kopfhaut mit warmem Wasser und speziellen Pflegeprodukten gründlich gereinigt. Dies entfernt überschüssiges Fett und abgestorbene Hautzellen, wodurch deine Kopfhaut wieder atmen kann. Die Reinigung fördert die Gesundheit der Haarwurzeln und sorgt für ein frisches, sauberes Gefühl.',
      icon: 'leaf',
      showFeaturesList: true,
      featuresList: [
        { id: '1', text: 'Entfernt abgestorbene Hautzellen und überschüssiges Fett', enabled: true },
        { id: '2', text: 'Fördert die Sauerstoffzufuhr zur Kopfhaut', enabled: true },
        { id: '3', text: 'Hinterlässt ein frisches und sauberes Gefühl', enabled: true },
      ],
      visible: true,
    },
    {
      id: 'treatment-3',
      title: 'Bedampfung für intensive Pflege',
      description:
        'Danach folgt die Bedampfung, bei der warmer Dampf sanft auf deine Kopfhaut einwirkt. Der Dampf öffnet die Poren, verbessert die Aufnahme von Nährstoffen und fördert die Durchblutung der Kopfhaut. Das Ergebnis ist eine tiefe Pflege, die deine Kopfhaut beruhigt und die Effekte der nachfolgenden Haarpflege verstärkt.',
      icon: 'heart',
      showFeaturesList: true,
      featuresList: [
        { id: '1', text: 'Öffnet die Poren für bessere Nährstoffaufnahme', enabled: true },
        { id: '2', text: 'Beruhigt und revitalisiert die Kopfhaut', enabled: true },
        { id: '3', text: 'Verbessert die Durchblutung für gesünderes Haar', enabled: true },
      ],
      visible: true,
    },
    {
      id: 'treatment-4',
      title: 'Tiefenwirksame Pflege für Gesicht und Dekolleté',
      description:
        'Die Gesichts- und Dekolleté-Maske spendet intensive Feuchtigkeit, beruhigt die Haut und versorgt sie mit wertvollen Nährstoffen. Sie hilft, die Haut zu regenerieren, verleiht ihr frische Ausstrahlung und hinterlässt Gesicht und Dekolleté geschmeidig und revitalisiert. Gönn dir eine wohltuende Auszeit und spüre den Unterschied.',
      icon: 'star',
      showFeaturesList: true,
      featuresList: [
        { id: '1', text: 'Spendet tiefenwirksame Feuchtigkeit und nährt die Haut', enabled: true },
        { id: '2', text: 'Beruhigt irritierte Haut und fördert die Regeneration', enabled: true },
        { id: '3', text: 'Verleiht einen frischen, strahlenden Teint', enabled: true },
      ],
      visible: true,
    },
  ],
  background: { type: 'solid', color: '#ffffff' },
  padding: { top: '5rem', bottom: '5rem', left: '1.5rem', right: '1.5rem' },
  maxWidth: 'xl',
  showTitle: true,
  showSubtitle: true,
}

const generalFeatures = {
  title: 'Was macht Headspa so besonders?',
  subtitle: 'Entdecke die vielfältigen Vorteile dieser einzigartigen Behandlung.',
  headerAlignment: 'center',
  layout: 'grid',
  columns: 3,
  features: [
    {
      id: 'feature-1',
      title: 'Tiefenentspannung',
      description: 'Lass den Alltagsstress hinter dir und tauche ein in eine Welt der Ruhe und Entspannung.',
      icon: 'spa',
      showFeaturesList: true,
      featuresList: [
        { id: '1', text: 'Sanfte Kopfhautmassage', enabled: true },
        { id: '2', text: 'Entspannung für Körper und Geist', enabled: true },
        { id: '3', text: 'Reduzierung von Stress und Verspannungen', enabled: true },
      ],
      visible: true,
    },
    {
      id: 'feature-2',
      title: 'Intensive Kopfhautpflege',
      description: 'Deine Kopfhaut wird mit hochwertigen Produkten verwöhnt und gepflegt.',
      icon: 'leaf',
      showFeaturesList: true,
      featuresList: [
        { id: '1', text: 'Reinigung und Peeling der Kopfhaut', enabled: true },
        { id: '2', text: 'Nährstoffreiche Masken', enabled: true },
        { id: '3', text: 'Verbesserte Durchblutung', enabled: true },
      ],
      visible: true,
    },
    {
      id: 'feature-3',
      title: 'Gesunder Haarwuchs',
      description: 'Fördere das natürliche Haarwachstum und stärke deine Haare von der Wurzel an.',
      icon: 'heart',
      showFeaturesList: true,
      featuresList: [
        { id: '1', text: 'Stärkung der Haarwurzeln', enabled: true },
        { id: '2', text: 'Verbesserte Haarstruktur', enabled: true },
        { id: '3', text: 'Mehr Glanz und Volumen', enabled: true },
      ],
      visible: true,
    },
  ],
  background: { type: 'solid', color: '#f7f5f3' },
  padding: { top: '5rem', bottom: '5rem', left: '1.5rem', right: '1.5rem' },
  maxWidth: 'xl',
  showTitle: true,
  showSubtitle: true,
}

const headspaPricingPackages = [
  {
    id: 'pkg-basic',
    name: 'Headspa Basic',
    price: '89',
    currency: '€',
    period: '',
    subtitle: 'Perfekt für den Einstieg',
    description: '45 Minuten pure Entspannung',
    features: [
      '45 Minuten pure Entspannung',
      'Kopf-, Nacken- und Dekolleté-Massage - Verspannungen lösen sich bereits nach 10 Minuten spürbar',
      'Bedampfung',
      'Haarreinigung und Pflege',
      'Peeling',
      'Kérastase Premiere Haaraufbau',
      'Babor Gesichtspflege: Maske, Wirkstoff-Ampulle und Tagespflege',
      'inkl. Geld-zurück-Garantie - 100% Geld zurück bei Unzufriedenheit',
    ],
    ctaText: 'Jetzt Basic buchen',
    ctaLink: '#booking',
    highlighted: false,
    popular: false,
    isPartner: false,
    guarantee: 'inkl. Geld-zurück-Garantie',
  },
  {
    id: 'pkg-beauty',
    name: 'Headspa Beauty',
    price: '119',
    currency: '€',
    period: '',
    subtitle: 'Unser Bestseller',
    description: '60 Minuten pure Entspannung',
    features: [
      '60 Minuten pure Entspannung',
      'Kopf-, Nacken- und Dekolleté-Massage - Verspannungen lösen sich bereits nach 10 Minuten spürbar',
      'Bedampfung',
      'Haarreinigung und Pflege - Pflegestoffe dringen 3x tiefer ein',
      'Peeling',
      'Kérastase Premiere Haaraufbau',
      'Babor Gesichtspflege: Maske, Wirkstoff-Ampulle und Tagespflege',
      'inkl. Geld-zurück-Garantie - 100% Geld zurück bei Unzufriedenheit',
    ],
    ctaText: 'Jetzt Beauty buchen',
    ctaLink: '#booking',
    highlighted: false,
    popular: false,
    isPartner: false,
    guarantee: 'inkl. Geld-zurück-Garantie',
  },
  {
    id: 'pkg-deluxe',
    name: 'Headspa Deluxe',
    price: '149',
    currency: '€',
    period: '',
    subtitle: 'Das ultimative Erlebnis',
    description: '90 Minuten pure Entspannung',
    features: [
      '90 Minuten pure Entspannung',
      'Kopf-, Nacken- und Dekolleté-Massage - Verspannungen lösen sich bereits nach 10 Minuten spürbar',
      'Bedampfung',
      'Haarreinigung und Pflege',
      'Peeling: Babor',
      'Kérastase Premiere Haaraufbau',
      'Babor Gesichtspflege: Maske, Wirkstoff-Ampulle und Tagespflege',
      'inkl. Geld-zurück-Garantie - 100% Geld zurück bei Unzufriedenheit',
    ],
    ctaText: 'Jetzt Deluxe buchen',
    ctaLink: '#booking',
    highlighted: true,
    popular: true,
    badge: {
      enabled: true,
      text: 'Beliebteste',
      backgroundColor: '#9CAF88',
      textColor: '#ffffff',
      position: 'top-center',
    },
    isPartner: false,
    guarantee: 'inkl. Geld-zurück-Garantie',
  },
]

const headspaFaqItems = [
  {
    id: 'faq-1',
    question: 'Ist Headspa für alle Haartypen geeignet?',
    answer:
      'Ja, unsere Headspa-Behandlung ist für alle Haartypen geeignet. Wir verwenden hochwertige Premium-Produkte von Kérastase und Babor, die individuell auf Ihren Haartyp abgestimmt werden.',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'Wie oft sollte ich eine Headspa-Behandlung machen lassen?',
    answer:
      'Wir empfehlen eine Headspa-Behandlung alle 4-6 Wochen für optimale Ergebnisse. Bei starkem Stress oder Verspannungen können auch häufigere Behandlungen sinnvoll sein.',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'Kann ich Headspa auch als Geschenk verschenken?',
    answer:
      'Ja, gerne! Wir bieten Gutscheine für alle Headspa-Pakete an. Diese können Sie direkt bei uns im Studio erwerben oder online bestellen.',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'Wie lange dauert eine Headspa-Behandlung?',
    answer:
      'Eine Headspa-Behandlung dauert in der Regel 45 bis 90 Minuten, je nach individuellem Bedarf und den gewünschten Extras. Du hast genügend Zeit, dich zu entspannen und die Pflege in vollen Zügen zu genießen.',
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'Hilft die Behandlung bei stressbedingten Kopfschmerzen?',
    answer:
      'Ja, die Kombination aus Massage und Kopfhautpflege kann effektiv dabei helfen, stressbedingte Kopfschmerzen zu lindern, Verspannungen zu lösen und die Durchblutung zu fördern.',
    order: 5,
  },
  {
    id: 'faq-6',
    question: 'Ist die Headspa-Behandlung auch für empfindliche Kopfhaut geeignet?',
    answer:
      'Absolut! Unsere Produkte und Techniken sind speziell darauf abgestimmt, auch empfindliche Kopfhaut zu beruhigen und zu pflegen. Du kannst sicher sein, dass wir auf deine individuellen Bedürfnisse eingehen.',
    order: 6,
  },
  {
    id: 'faq-7',
    question: 'Was sind die langfristigen Vorteile einer Headspa-Behandlung?',
    answer:
      'Regelmäßige Headspa-Behandlungen fördern die Gesundheit deiner Kopfhaut, stärken dein Haar und können sogar das Haarwachstum anregen. Zusätzlich hilft die Massage, Stress abzubauen und das allgemeine Wohlbefinden zu steigern.',
    order: 7,
  },
  {
    id: 'faq-8',
    question: 'Welche Produkte werden bei der Behandlung verwendet?',
    answer:
      'Wir verwenden nur hochwertige, professionelle Pflegeprodukte, die deine Kopfhaut und Haare optimal nähren und pflegen. Unsere Produkte sind sanft und frei von schädlichen Inhaltsstoffen.',
    order: 8,
  },
]

const headspa = {
  slug: 'headspa',
  title: 'Headspa',
  status: 'published',
  active: true,
  meta_title: 'Head Spa Aachen & Baesweiler – Japanese Head Spa',
  meta_description:
    'Erleben Sie professionelle Headspa-Behandlungen in Baesweiler. Tiefenentspannung für Kopf, Körper & Seele. Jetzt Termin buchen!',
  meta_keywords: [
    'headspa',
    'headspa baesweiler',
    'headspa aachen',
    'kopfmassage',
    'japanese head spa',
    'wellness baesweiler',
  ],
  blocks: [
    block('headspa-header', 'header', 0, headerContent),
    block('headspa-hero', 'hero', 1, {
      sectionId: 'headspa',
      badge:
        'Ab dem 15.01.2026 finden alle Headspa-Termine in unserem neuen Wellnesstal-Studio unter der Adresse Reyplatz 10, 52499 Baesweiler statt. Wir freuen uns darauf, Sie in unserer neuen und beruhigenden Atmosphäre begrüßen zu dürfen.',
      badgeEnabled: true,
      mainTitle: 'Headspa: Mehr als Entspannung für Kopf und Seele',
      subtitle:
        'Erlebe tiefgehende Regeneration und lass die Gedanken los. Gönn dir ein einzigartiges Headspa-Erlebnis, das Kopf und Seele in Einklang bringt',
      primaryButton: 'Termin Buchen',
      primaryButtonLink: '#booking',
      secondaryButton: 'Wunschtermin finden',
      secondaryButtonLink: '#booking',
      trustIndicator: '⭐ 4,7 von 5 Sternen',
      trustIndicatorSubtext: '✨ Bereits zahlreiche zufriedene Kund:innen',
      trustIndicatorSecondary: 'Headspa Behandlungen ab 89 €',
      trustIndicatorSecondarySubtext: 'Beste Kundenbewertungen',
      image: {
        url: '/uploads/hero/1764360287833-d9vohe.jpeg',
        alt: 'Headspa Behandlung bei Wellnesstal',
      },
      imageFloatingElements: {
        statusBadge: {
          enabled: true,
          text: 'Jetzt geöffnet',
          position: { vertical: 'top', horizontal: 'left' },
        },
        premiumCard: {
          enabled: true,
          emoji: '💆🏻‍♀️',
          title: 'Headspa Behandlungen ab',
          subtitle: '89 €',
          position: { vertical: 'bottom', horizontal: 'left' },
        },
        reviewsBadge: {
          enabled: true,
          rating: '4,7 von 5*',
          text: 'Beste Kundenbewertungen',
          position: { vertical: 'bottom', horizontal: 'right' },
        },
      },
    }),
    block(
      'headspa-problem',
      'text',
      2,
      textPreset(
        'problem',
        'Kopf voller Gedanken, gestresst und erschöpft?',
        'In der Hektik des Alltags verlieren wir oft die Verbindung zu uns selbst. Unser Kopf ist ständig aktiv, unser Geist nie zur Ruhe. Die Folge? Stress, Erschöpfung und ein Gefühl der Überforderung. Doch es gibt einen Ausweg.',
        '#f7f5f3'
      )
    ),
    block(
      'headspa-solution',
      'text',
      3,
      textPreset(
        'solution',
        'Mehr als nur Entspannung – wahre Erholung für deinen Kopf und Geist',
        'Unsere Headspa-Behandlung geht über oberflächliche Entspannung hinaus. Mit speziell entwickelten Techniken und einer Kombination aus wohltuenden Massagegriffen regenerieren wir nicht nur deine Kopfhaut, sondern bringen auch deinen Geist in Balance. Erlebe, wie Stress und Anspannung verschwinden und dein Kopf wieder frei wird.',
        '#ffffff'
      )
    ),
    block('headspa-treatment-features', 'features', 4, treatmentFeatures),
    block('headspa-general-features', 'features', 5, generalFeatures),
    block('headspa-pricing', 'pricing', 6, {
      sectionId: 'pricing',
      layout: 'grid',
      maxWidth: 'xl',
      title: 'Unsere Headspa-Pakete',
      subtitle: 'Wähle das perfekte Paket für dich',
      header: {
        title: 'Unsere Headspa-Pakete',
        subtitle: 'Wähle das perfekte Paket für dich',
        alignment: 'center',
      },
      packages: headspaPricingPackages,
      tabs: { enabled: false },
      showGuarantee: true,
      guaranteeText: '100% Zufriedenheitsgarantie - Nicht zufrieden? Geld zurück!',
      trustElement: {
        enabled: true,
        type: 'money-back',
        text: 'inkl. Geld-zurück-Garantie',
        icon: '🛡️',
        position: 'below-packages',
      },
      background: { type: 'solid', color: '#ffffff' },
      padding: { top: '4rem', bottom: '4rem' },
    }),
    block('headspa-gallery', 'gallery', 7, {
      title: 'Erlebe das Headspa-Gefühl hautnah',
      subtitle:
        'Tauche ein in das beruhigende und revitalisierende Erlebnis unserer Headspa-Behandlung. Sieh dir an, wie sanfte Massagen, hochwertige Pflegeprodukte und wohltuende Rituale deinen Kopf und deine Seele verwöhnen. Lehne dich zurück und lass dich inspirieren!',
      images: [],
      layout: { type: 'grid', columns: 3, gap: '1rem', aspectRatio: '16:9' },
      background: { type: 'solid', color: '#ffffff' },
      padding: { top: '4rem', bottom: '4rem' },
    }),
    block('headspa-testimonials', 'testimonials', 8, {
      title: 'Stimmen, die begeistern',
      subtitle:
        '4,8 von 5* Sternen bei GOOGLE und Co. Echte Erlebnisse. Wahre Begeisterung. Erfahre, wie WellnessTal den Unterschied macht.',
      layout: 'grid',
      columns: 3,
      testimonials: [
        {
          id: 't-1',
          name: 'Joanna Koscielna',
          content:
            'Ich hatte die Gelegenheit, eine Behandlung im Salon in der Kückstr. 17 in Baesweiler zu erleben, und ich bin beeindruckt von der Qualität der Dienstleistungen sowie der Professionalität des Personals. Die Behandlung begann mit einer gründlichen Haarwäsche, kombiniert mit einer entspannenden Kopfmassage. Der sanfte Wasserstrahl, der aus einer halbrunden Düse floss, schuf eine äußerst beruhigende Atmosphäre, und die anschließende Massage des Nackens, der Hinter- und Vorderseite des Kopfes versetzte mich in einen Zustand tiefer Entspannung.',
          rating: 5,
          readMoreLink: { enabled: true, text: 'Weiter lesen', url: '#testimonial-1' },
        },
        {
          id: 't-2',
          name: 'Melia Lang',
          content:
            'Absolute Empfehlung! Die Headspa-Behandlung war pure Entspannung. Meine Kopfhaut fühlt sich sauber und revitalisiert an – ich komme definitiv wieder!',
          rating: 5,
          readMoreLink: { enabled: true, text: 'Weiter lesen', url: '#testimonial-2' },
        },
        {
          id: 't-3',
          name: 'Janina Pandorf',
          content:
            'Ich hatte heute mein Head Spa Erlebnis und was soll ich sagen – es war perfekt! Der Empfang war sehr herzlich, die Behandlung unglaublich entspannend. Vielen Dank!',
          rating: 5,
          readMoreLink: { enabled: true, text: 'Weiter lesen', url: '#testimonial-3' },
        },
        {
          id: 't-4',
          name: 'Nastjenka Busch',
          content:
            'Wir hatten heute eine wundervolle Auszeit bei einer Head-Spa Behandlung. Wir wurden überaus freundlich empfangen und haben uns vom ersten Moment an wohlgefühlt. Absolute Empfehlung!',
          rating: 5,
          readMoreLink: { enabled: true, text: 'Weiter lesen', url: '#testimonial-4' },
        },
      ],
      background: { type: 'solid', color: '#f7f5f3' },
      padding: { top: '5rem', bottom: '5rem' },
    }),
    block('headspa-booking', 'embed', 9, {
      title: 'Termin buchen',
      subtitle: 'Wählen Sie Ihren Wunschtermin',
      provider: 'custom',
      embedUrl: '',
      sectionId: 'booking',
      container: {
        maxWidth: 'xl',
        alignment: 'center',
        padding: { top: '4rem', bottom: '4rem', left: '2rem', right: '2rem' },
      },
      frame: { aspectRatio: 'auto', borderEnabled: false, borderRadius: '16px', shadow: 'lg' },
      loading: {
        showLoadingSpinner: true,
        spinnerColor: '#9CAF88',
        placeholderText: 'Buchungssystem wird geladen...',
        placeholderBackgroundColor: '#f7f5f3',
      },
      background: { type: 'solid', color: '#f7f5f3' },
    }),
    block('headspa-about', 'about', 10, {
      badge: '✨ Über WellnessTal Studio',
      title: 'Gönn dir jetzt die Erholung, die du verdienst!',
      description:
        'Verpasse nicht die Chance auf dein exklusives Headspa-Erlebnis. Lass Stress und Anspannung hinter dir und genieße vollkommene Entspannung und Pflege. Buche deinen Termin noch heute und fühle dich erfrischt und revitalisiert!',
      primaryButton: 'Jetzt Termin buchen',
      primaryButtonLink: '#booking',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          alt: 'Wellness Studio Innenbereich',
        },
        {
          url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          alt: 'Entspannende Behandlung',
        },
        {
          url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          alt: 'Wellness Produkte',
        },
        {
          url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          alt: 'Entspannte Kundin',
        },
      ],
      background: { color: '#ffffff' },
    }),
    block('headspa-faq', 'faq', 11, {
      layout: 'accordion',
      maxWidth: 'xl',
      header: {
        title: 'Häufig gestellte Fragen',
        subtitle: 'Antworten auf einen Blick. Finde hier alles, was Du über Headspa wissen musst.',
        alignment: 'center',
      },
      items: headspaFaqItems,
      accordionSettings: { allowMultipleOpen: false, defaultOpenIndex: 0, collapseOthersOnOpen: true },
      background: { type: 'solid', color: '#ffffff' },
      padding: { top: '5rem', bottom: '5rem' },
    }),
    block('headspa-contact', 'contact', 12, {
      useGlobalContact: true,
      sectionId: 'contact',
    }),
    block('headspa-footer', 'footer', 13, {
      useGlobalFooter: true,
    }),
    block('headspa-seo', 'seo', 14, {
      useGlobalSEO: false,
      title: 'Head Spa Aachen & Baesweiler – Japanese Head Spa',
      description:
        'Erleben Sie professionelle Headspa-Behandlungen in Baesweiler. Tiefenentspannung für Kopf, Körper & Seele. Jetzt Termin buchen!',
      keywords: ['headspa', 'headspa baesweiler', 'japanese head spa', 'kopfmassage', 'wellness'],
      robots: { index: true, follow: true },
      openGraph: {
        enabled: true,
        title: 'Head Spa Aachen & Baesweiler – Japanese Head Spa',
        description: 'Professionelle Headspa-Behandlungen in Baesweiler. Jetzt Termin buchen!',
      },
    }),
  ],
}

const gutschein = {
  slug: 'gutschein',
  title: 'Gutschein',
  status: 'published',
  active: true,
  meta_title: 'Wellness-Gutschein | Wellnesstal Baesweiler',
  meta_description:
    'Verschenken Sie Entspannung – Wellness-Gutscheine für Headspa-Behandlungen bei Wellnesstal in Baesweiler. Online bestellen.',
  blocks: [
    block('gutschein-header', 'header', 0, headerContent),
    block('gutschein-hero', 'hero', 1, {
      sectionId: 'gutschein',
      mainTitle: 'Wellness-Gutschein verschenken',
      subtitle:
        'Überraschen Sie Ihre Liebsten mit einem Gutschein für unsere Headspa-Behandlungen – das perfekte Geschenk für Entspannung und Wohlbefinden.',
      primaryButton: 'Gutschein bestellen',
      primaryButtonLink: '#gutschein-embed',
      secondaryButton: 'Headspa entdecken',
      secondaryButtonLink: '/headspa',
      trustIndicator: '⭐ 4,7 von 5 Sternen',
      trustIndicatorSubtext: 'Bereits zahlreiche zufriedene Kund:innen',
      image: {
        url: '/uploads/hero/1764360287833-d9vohe.jpeg',
        alt: 'Wellness-Gutschein Wellnesstal',
      },
    }),
    block('gutschein-embed', 'embed', 2, {
      title: '',
      subtitle: '',
      provider: 'custom',
      embedUrl: 'https://treuepay.de/wellnesstal/gutschein',
      sectionId: 'gutschein-embed',
      container: {
        maxWidth: 'xl',
        alignment: 'center',
        padding: { top: '2rem', bottom: '4rem', left: '1rem', right: '1rem' },
      },
      frame: { aspectRatio: 'auto', borderEnabled: false, borderRadius: '0', shadow: 'none' },
      loading: {
        showLoadingSpinner: true,
        spinnerColor: '#9CAF88',
        placeholderText: 'Gutschein-Shop wird geladen...',
        placeholderBackgroundColor: '#f7f5f3',
      },
      background: { type: 'solid', color: '#ffffff' },
    }),
    block('gutschein-contact', 'contact', 3, { useGlobalContact: true, sectionId: 'contact' }),
    block('gutschein-footer', 'footer', 4, { useGlobalFooter: true }),
  ],
}

function legalPage(slug, title, metaDescription, sections) {
  return {
    slug,
    title,
    status: 'published',
    active: true,
    meta_title: `${title} | Wellnesstal`,
    meta_description: metaDescription,
    blocks: [
      block(`${slug}-header`, 'header', 0, headerContent),
      block(`${slug}-hero`, 'hero', 1, {
        sectionId: slug,
        mainTitle: title,
        subtitle: metaDescription,
        badgeEnabled: false,
      }),
      ...sections.map((section, index) =>
        block(`${slug}-text-${index}`, 'text', index + 2, {
          title: section.title,
          content: section.content,
          showTitle: true,
          maxWidth: 'xl',
          padding: { top: '2rem', bottom: '2rem', left: '1.5rem', right: '1.5rem' },
          typography: {
            title: { fontSize: '1.5rem', fontWeight: '700', color: '#2C2C2C', marginBottom: '1rem' },
            body: { fontSize: '1rem', lineHeight: '1.75', color: '#666666' },
          },
          background: { type: 'solid', color: '#ffffff' },
        })
      ),
      block(`${slug}-footer`, 'footer', sections.length + 2, { useGlobalFooter: true }),
    ],
  }
}

const impressum = legalPage('impressum', 'Impressum', 'Impressum und Anbieterkennzeichnung von Wellnesstal.', [
  {
    title: 'Angaben gemäß § 5 TMG',
    content: `<p><strong>Wellnesstal</strong><br>Reyplatz 10<br>52499 Baesweiler<br>Deutschland</p>`,
  },
  {
    title: 'Kontakt',
    content: `<p>Telefon: <a href="tel:+491733828581">+49 173 3828581</a><br>E-Mail: <a href="mailto:info@wellnesstal.de">info@wellnesstal.de</a></p>`,
  },
  {
    title: 'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV',
    content: `<p>Wellnesstal<br>Reyplatz 10<br>52499 Baesweiler</p>`,
  },
  {
    title: 'Haftungsausschluss',
    content: `<p>Die Inhalte unserer Seiten wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte können wir jedoch keine Gewähr übernehmen.</p>`,
  },
])

const datenschutz = legalPage(
  'datenschutz',
  'Datenschutz',
  'Datenschutzerklärung von Wellnesstal – Informationen zur Verarbeitung personenbezogener Daten.',
  [
    {
      title: '1. Verantwortlicher',
      content: `<p>Verantwortlich für die Datenverarbeitung auf dieser Website ist:</p><p><strong>Wellnesstal</strong><br>Reyplatz 10<br>52499 Baesweiler<br>E-Mail: info@wellnesstal.de<br>Telefon: +49 173 3828581</p>`,
    },
    {
      title: '2. Erhebung und Speicherung personenbezogener Daten',
      content: `<p>Beim Besuch unserer Website werden automatisch Informationen allgemeiner Natur erfasst (Server-Logfiles). Diese umfassen z. B. Browsertyp, verwendetes Betriebssystem, Referrer URL, Hostname des zugreifenden Rechners und Uhrzeit der Serveranfrage.</p>`,
    },
    {
      title: '3. Kontaktformular und Terminbuchung',
      content: `<p>Wenn Sie uns per Kontaktformular, E-Mail, Telefon oder über unser Buchungssystem (Treuepay) Anfragen zukommen lassen, werden Ihre Angaben zur Bearbeitung der Anfrage und für den Fall von Anschlussfragen bei uns gespeichert.</p>`,
    },
    {
      title: '4. Cookies',
      content: `<p>Unsere Website kann Cookies verwenden. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Sie dienen dazu, unser Angebot nutzerfreundlicher und sicherer zu machen.</p>`,
    },
    {
      title: '5. Ihre Rechte',
      content: `<p>Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Ihre gespeicherten personenbezogenen Daten, deren Herkunft und Empfänger sowie den Zweck der Datenverarbeitung. Außerdem haben Sie ein Recht auf Berichtigung, Sperrung oder Löschung dieser Daten.</p>`,
    },
  ]
)

const pages = [headspa, gutschein, impressum, datenschutz]

fs.mkdirSync(PAGES_DIR, { recursive: true })

for (const page of pages) {
  const filePath = path.join(PAGES_DIR, `${page.slug}.json`)
  fs.writeFileSync(filePath, JSON.stringify(page, null, 2) + '\n', 'utf-8')
  console.log(`✅ ${path.relative(ROOT, filePath)} (${page.blocks.length} blocks)`)
}

console.log(`\n🎉 ${pages.length} static pages written to content/pages/`)
