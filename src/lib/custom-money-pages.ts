import type { LocationPageContent } from './landing-pages'

/** Brand-shield & story money pages — not part of the city×intent matrix */
export const CUSTOM_MONEY_SLUGS = [
  'deluxe-beauty-baesweiler',
  'deluxe-hair-beauty',
  'geschichte',
] as const

export type CustomMoneySlug = (typeof CUSTOM_MONEY_SLUGS)[number]

export function isCustomMoneySlug(slug: string): slug is CustomMoneySlug {
  return (CUSTOM_MONEY_SLUGS as readonly string[]).includes(slug)
}

const NEARBY = [
  'Aachen',
  'Würselen',
  'Alsdorf',
  'Herzogenrath',
  'Eschweiler',
  'Geilenkirchen',
  'Heinsberg',
]

function brandShell(input: {
  slug: CustomMoneySlug
  path: string
  seo: { title: string; description: string }
  hero: LocationPageContent['hero']
  essence: LocationPageContent['essence']
  journey: LocationPageContent['journey']
  faq: LocationPageContent['faq']
  closing: LocationPageContent['closing']
  localProofHeadline: string
}): LocationPageContent {
  return {
    slug: input.slug,
    path: input.path,
    seo: input.seo,
    city: 'Baesweiler',
    region: 'Städteregion Aachen',
    distance: 'Reyplatz 10 — unser Studio',
    nearby: NEARBY,
    hero: input.hero,
    essence: input.essence,
    emotions: {
      eyebrow: 'Heute',
      headline: 'Was Wellnesstal ausmacht',
      items: [
        {
          word: 'Fokus',
          headline: 'Nur Head Spa.',
          text: 'Kein Salon-Menü — ein Ritual für Kopf, Kopfhaut und Nervensystem.',
        },
        {
          word: 'Klarheit',
          headline: 'Ehrlich kommuniziert.',
          text: 'Was wir früher anboten und was wir heute bewusst nicht mehr machen — transparent.',
        },
        {
          word: 'Ort',
          headline: 'Reyplatz 10.',
          text: 'Baesweiler-Mitte — erreichbar aus der Region Aachen und dem Kreis Heinsberg.',
        },
        {
          word: 'Ritual',
          headline: '45–90 Minuten.',
          text: 'Basic, Beauty oder Deluxe — klare Dauer, klare Preise, online buchbar.',
        },
        {
          word: 'Marken',
          headline: 'Kérastase & Babor.',
          text: 'Im Deluxe-Paket: professionelle Haar- und Gesichtspflege im Ritual.',
        },
        {
          word: 'Vertrauen',
          headline: '4,6★ bei Google.',
          text: 'Echte Stimmen aus Baesweiler und der Region — Termin oder Gutschein online.',
        },
      ],
    },
    localProof: {
      eyebrow: 'Stimmen',
      headline: input.localProofHeadline,
      quotes: [
        {
          text: 'Die Massage von Nacken und Kopf versetzte mich in einen Zustand tiefer Entspannung.',
          name: 'Joanna K.',
          location: 'Baesweiler',
        },
        {
          text: 'Bei der Behandlung konnte ich zu 100% entspannen — in Ruhe, ohne Hektik.',
          name: 'Lea W.',
          location: 'Region Aachen',
        },
      ],
    },
    journey: input.journey,
    faq: input.faq,
    closing: input.closing,
  }
}

const shells: Record<CustomMoneySlug, LocationPageContent> = {
  'deluxe-beauty-baesweiler': brandShell({
    slug: 'deluxe-beauty-baesweiler',
    path: '/deluxe-beauty-baesweiler',
    seo: {
      title: 'Deluxe Beauty Baesweiler → Wellnesstal Head Spa | Reyplatz 10',
      description:
        'Früher Deluxe Beauty (& Spa) in Baesweiler — heute Wellnesstal: japanisches Head Spa am Reyplatz 10. Kein Friseur mehr. Termin & Gutschein online · 4,6★.',
    },
    hero: {
      eyebrow: 'Deluxe Beauty Baesweiler',
      headline: 'Früher Deluxe Beauty. Heute Wellnesstal Head Spa.',
      subline:
        'Du suchst Deluxe Beauty in Baesweiler? Hier findest du die Fortsetzung am Reyplatz 10 — spezialisiert auf japanisches Head Spa. Klassischen Haarschnitt, Fußpflege und Salon-Kosmetik bieten wir bewusst nicht mehr an.',
      trust: 'Reyplatz 10 · 4,6★ bei Google · Wunschtermin online',
    },
    essence: {
      eyebrow: 'Markenkontinuität',
      headline: 'Dieselbe Adresse. Ein klarer Fokus.',
      paragraphs: [
        'Viele Gäste kennen uns noch als Deluxe Beauty oder Deluxe Beauty & Spa — mit einem breiteren Beauty-Angebot.',
        'Heute heißt das Studio Wellnesstal und konzentriert sich auf Head Spa: 45 bis 90 Minuten Ritual für Kopfhaut, Nacken und tiefe Entspannung.',
        'Wenn du den alten Namen suchst, bist du richtig — und erfährst ehrlich, was sich geändert hat und was du buchen kannst.',
      ],
    },
    journey: {
      eyebrow: 'Dein Weg',
      headline: 'Von der Suche zum Termin',
      steps: [
        {
          num: '01',
          title: 'Ankommen',
          text: 'Reyplatz 10, 52499 Baesweiler — dasselbe Studio, neuer klarer Fokus.',
        },
        {
          num: '02',
          title: 'Ritual wählen',
          text: 'Basic 89 € · Beauty 119 € · Deluxe 149 € — online Verfügbarkeit prüfen.',
        },
        {
          num: '03',
          title: 'Loslassen',
          text: 'Wasserstrahl, Massage, Bedampfung — ohne Salon-Hektik.',
        },
        {
          num: '04',
          title: 'Wiederkommen',
          text: 'Stammgäste planen Head Spa als regelmäßige Auszeit — nicht als Einmal-Event.',
        },
      ],
    },
    faq: [
      {
        q: 'Ist Wellnesstal dasselbe wie Deluxe Beauty Baesweiler?',
        a: 'Ja — dieselbe Studioadresse am Reyplatz 10. Die Marke heißt heute Wellnesstal und ist auf Head Spa spezialisiert.',
      },
      {
        q: 'Kann ich bei euch noch Haare schneiden lassen?',
        a: 'Nein. Haarschnitt, Farbe und klassische Friseurleistungen bieten wir nicht mehr an. Dafür ein dediziertes Head Spa Ritual.',
      },
      {
        q: 'Macht ihr noch Fußpflege oder klassische Kosmetik?',
        a: 'Nein. Diese Leistungen gehören nicht mehr zum Angebot. Im Deluxe-Paket gibt es Gesichtspflege-Elemente mit Babor im Ritual-Kontext — kein klassisches Kosmetikstudio-Menü.',
      },
    ],
    closing: {
      headline: 'Deluxe Beauty gesucht — Head Spa gefunden.',
      text: 'Buche dein Ritual online oder verschenke einen Gutschein. Reyplatz 10, Baesweiler.',
      cta: 'Wunschtermin finden',
    },
    localProofHeadline: 'Was Gäste über das Ritual sagen',
  }),

  'deluxe-hair-beauty': brandShell({
    slug: 'deluxe-hair-beauty',
    path: '/deluxe-hair-beauty',
    seo: {
      title: 'Deluxe Hair Beauty → Wellnesstal Head Spa Baesweiler | Marke & Adresse',
      description:
        'Deluxe Hair Beauty gesucht? Die Fortsetzung ist Wellnesstal am Reyplatz 10 in Baesweiler — japanisches Head Spa, kein Friseursalon. Termin & Gutschein · 4,6★.',
    },
    hero: {
      eyebrow: 'Deluxe Hair Beauty',
      headline: 'Deluxe Hair Beauty — die Marke hat sich weiterentwickelt.',
      subline:
        'Wer nach Deluxe Hair Beauty sucht, landet hier richtig: Wellnesstal am Reyplatz 10 in Baesweiler. Heute ausschließlich Head Spa — klar, ruhig, spezialisiert.',
      trust: 'Baesweiler · 4,6★ · Online buchbar',
    },
    essence: {
      eyebrow: 'Klarstellung',
      headline: 'Vom Salon-Namen zum Head Spa Studio.',
      paragraphs: [
        'Deluxe Hair Beauty steht für viele noch für Haar und Beauty im klassischen Sinn.',
        'Unser Studio hat sich bewusst spezialisiert: japanisches Head Spa statt Schnitt, Farbe und Salon-Routine.',
        'Diese Seite erklärt die Brücke — damit du nicht falsch buchst und weißt, was dich erwartet.',
      ],
    },
    journey: {
      eyebrow: 'Ablauf',
      headline: 'So funktioniert dein Besuch heute',
      steps: [
        { num: '01', title: 'Orientierung', text: 'Kein Friseur-Termin — Head Spa Ritual wählen.' },
        { num: '02', title: 'Online buchen', text: 'Basic, Beauty oder Deluxe — Live-Verfügbarkeit.' },
        { num: '03', title: 'Studio', text: 'Reyplatz 10 — ruhiger Empfang, kein Salon-Trubel.' },
        { num: '04', title: 'Danach', text: 'Leichter im Kopf — optional Gutschein für Freunde.' },
      ],
    },
    faq: [
      {
        q: 'Ist Deluxe Hair Beauty noch geöffnet?',
        a: 'Unter dem Namen Wellnesstal ja — am Reyplatz 10 in Baesweiler, spezialisiert auf Head Spa.',
      },
      {
        q: 'Bietet ihr Haarschnitte wie früher?',
        a: 'Nein. Wir sind kein Friseursalon mehr. Unser Angebot ist Head Spa Basic, Beauty und Deluxe.',
      },
      {
        q: 'Wo finde ich euch?',
        a: 'Reyplatz 10, 52499 Baesweiler. Termin online oder telefonisch unter +49 173 3828581.',
      },
    ],
    closing: {
      headline: 'Ready für Head Spa statt Salon-Routine?',
      text: 'Wenn du Deluxe Hair Beauty gesucht hast und tiefe Entspannung willst — buche dein Ritual.',
      cta: 'Wunschtermin finden',
    },
    localProofHeadline: 'Erfahrungen aus dem Studio',
  }),

  geschichte: brandShell({
    slug: 'geschichte',
    path: '/geschichte',
    seo: {
      title: 'Unsere Geschichte | Deluxe Beauty → Wellnesstal Head Spa Baesweiler',
      description:
        'Von Deluxe Beauty & Spa / Deluxe Hair Beauty zu Wellnesstal: warum wir nur noch Head Spa machen — Reyplatz 10, Baesweiler. E-E-A-T, klar & ehrlich.',
    },
    hero: {
      eyebrow: 'Unsere Geschichte',
      headline: 'Warum Wellnesstal nur noch Head Spa macht.',
      subline:
        'Wir kommen aus dem klassischen Beauty-Umfeld — und haben uns bewusst auf japanisches Head Spa spezialisiert. Diese Seite erzählt den Weg: ehrlich, ohne Heilsversprechen.',
      trust: 'Wellnesstal · Reyplatz 10 · Baesweiler',
    },
    essence: {
      eyebrow: 'E-E-A-T',
      headline: 'Erfahrung, die du nachvollziehen kannst.',
      paragraphs: [
        'Bevor Wellnesstal nur Head Spa anbot, arbeiteten wir unter Namen wie Deluxe Beauty und Deluxe Hair Beauty mit einem breiteren Angebot.',
        'Die Spezialisierung war eine Entscheidung für Qualität und Tiefe — nicht für mehr Menüpunkte.',
        'Heute kennst du uns an klaren Paketen, ruhiger Atmosphäre und einem Ritual, das Kopf und Nervensystem in den Mittelpunkt stellt.',
      ],
    },
    journey: {
      eyebrow: 'Heute',
      headline: 'Was dich im Studio erwartet',
      steps: [
        { num: '01', title: 'Empfang', text: 'Ankommen ohne Hektik — Kaffee, Stille, Orientierung.' },
        { num: '02', title: 'Einschätzung', text: 'Kurzes Gespräch zu Kopfhaut, Intensität, Paket.' },
        { num: '03', title: 'Ritual', text: 'Reinigung, Wasserstrahl, Massage, Bedampfung, Pflege.' },
        { num: '04', title: 'Abschluss', text: 'Trockenföhnen inklusive — du gehst leichter raus.' },
      ],
    },
    faq: [
      {
        q: 'Warum nur noch Head Spa?',
        a: 'Weil Fokus Qualität schafft. Statt vieler kurzer Beauty-Leistungen ein Ritual mit klarer Dauer und Wirkung für Kopf und Entspannung.',
      },
      {
        q: 'Seid ihr umgezogen?',
        a: 'Nein — Reyplatz 10 in Baesweiler bleibt unsere Adresse. Geändert hat sich der Fokus und der Markenname Wellnesstal.',
      },
      {
        q: 'Kann ich Gutscheine kaufen?',
        a: 'Ja — online über Treuepay, oft sofort per E-Mail. Ideal, wenn jemand noch den alten Namen kennt und Head Spa entdecken soll.',
      },
    ],
    closing: {
      headline: 'Teil der Geschichte werden — mit einem Termin.',
      text: 'Ob Erstbesuch oder Rückkehr: Basic, Beauty oder Deluxe online buchen.',
      cta: 'Wunschtermin finden',
    },
    localProofHeadline: 'Was Gäste erleben',
  }),
}

export function getCustomMoneyShell(slug: string): LocationPageContent | null {
  if (!isCustomMoneySlug(slug)) return null
  return shells[slug]
}

export function getCustomMoneyRewrites() {
  return CUSTOM_MONEY_SLUGS.map((slug) => ({
    source: `/${slug}`,
    destination: `/intent/${slug}`,
  }))
}

export const CUSTOM_MONEY_SEO_LINKS = CUSTOM_MONEY_SLUGS.map((slug) => ({
  slug,
  path: shells[slug].path,
  label: shells[slug].hero.eyebrow,
}))
