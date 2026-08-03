import { LOCATION_SLUGS } from './seo-config'

type EmotionItem = { word: string; headline: string; text: string }
type JourneyStep = { num: string; title: string; text: string }

export type BuiltGiftPage = {
  slug: string
  path: string
  seo: { title: string; description: string }
  hero: { eyebrow: string; headline: string; subline: string; trust: string }
  essence: { eyebrow: string; headline: string; paragraphs: string[] }
  emotions: { eyebrow: string; headline: string; items: EmotionItem[] }
  recipients?: { eyebrow: string; headline: string; items: { title: string; text: string }[] }
  journey: { eyebrow: string; headline: string; steps: JourneyStep[] }
  faq: { q: string; a: string }[]
  closing: { headline: string; text: string; cta: string }
}

const DEFAULT_EMOTIONS: EmotionItem[] = [
  { word: 'Berührung', headline: 'Sanft. Bewusst.', text: 'Kopf- und Nackenmassage — Verspannungen weichen.' },
  { word: 'Stille', headline: 'Kopf leise.', text: '45–90 Min. abschalten — Gäste beschreiben tiefe Entspannung.' },
  { word: 'Ruhe', headline: 'Endlich nichts leisten.', text: 'Ein Raum ohne Erwartung — nur Ritual.' },
  { word: 'Reinheit', headline: 'Frisch. Leicht.', text: 'Kopfhaut und Geist — erfrischt von innen.' },
  { word: 'Wertschätzung', headline: 'Du siehst sie.', text: 'Ein Geschenk, das ankommt — nicht im Schrank landet.' },
  { word: 'Erinnerung', headline: 'Bleibt.', text: 'Monate später: „Das war das schönste Geschenk.“' },
]

const DEFAULT_JOURNEY: JourneyStep[] = [
  { num: '01', title: 'Wählen', text: 'Basic (89€), Beauty (119€) oder Deluxe (149€) — je nach Tiefe.' },
  { num: '02', title: 'Bestellen', text: 'Sofort per E-Mail — Print@Home oder digital versenden.' },
  { num: '03', title: 'Überreichen', text: 'Mit wenigen Worten — das Geschenk sagt den Rest.' },
  { num: '04', title: 'Erleben', text: 'Termin in Baesweiler — Region Aachen & NRW.' },
]

function page(
  slug: string,
  seo: { title: string; description: string },
  hero: BuiltGiftPage['hero'],
  essence: BuiltGiftPage['essence'],
  opts?: {
    emotions?: EmotionItem[]
    recipients?: BuiltGiftPage['recipients']
    faq?: BuiltGiftPage['faq']
    closing?: Partial<BuiltGiftPage['closing']>
    journey?: JourneyStep[]
  },
): BuiltGiftPage {
  return {
    slug,
    path: `/gutschein/${slug}`,
    seo,
    hero,
    essence,
    emotions: {
      eyebrow: 'Sechs Worte des Geschenks',
      headline: 'Stille — auf eine leise Art',
      items: opts?.emotions ?? DEFAULT_EMOTIONS,
    },
    recipients: opts?.recipients,
    journey: {
      eyebrow: 'Gutschein schenken',
      headline: 'In Minuten bestellt — lange erinnert',
      steps: opts?.journey ?? DEFAULT_JOURNEY,
    },
    faq: opts?.faq ?? [
      { q: 'Sofort verfügbar?', a: 'Ja — Gutschein sofort per E-Mail. Print@Home oder digital.' },
      { q: 'Preise?', a: 'Basic 89€, Beauty 119€ (Beliebt), Deluxe 149€. Partner ab 178€.' },
      { q: 'Wo einlösbar?', a: 'Wellnesstal, Reyplatz 10, Baesweiler — Region Aachen & NRW.' },
      { q: 'Welches Paket?', a: 'Beauty (119€) ist der sichere Allrounder für die meisten Geschenke.' },
    ],
    closing: {
      headline: opts?.closing?.headline ?? 'Stille, die ankommt — nicht verstaubt.',
      text: opts?.closing?.text ?? 'Head Spa Gutschein für Berührung, Ruhe und echte Wertschätzung. Jetzt bestellen.',
      cta: opts?.closing?.cta ?? 'Gutschein bestellen',
    },
  }
}

const REGION_RECIPIENTS = {
  eyebrow: 'Region',
  headline: 'Gutschein verschenken — in deiner Stadt',
  items: [
    { title: 'Aachen & Region', text: '15 Min. von Aachen — /geschenk-aachen' },
    { title: 'Baesweiler', text: 'Direkt vor Ort — Reyplatz 10' },
    { title: 'NRW West', text: 'Würselen, Eschweiler, Stolberg, Heinsberg & mehr' },
    { title: 'Überall digital', text: 'Gutschein sofort per E-Mail — bundesweit verschenkbar' },
  ],
}

const BUILDERS: Record<string, () => BuiltGiftPage> = {
  online: () =>
    page(
      'online',
      {
        title: 'Gutschein online kaufen | E-Gutschein sofort per E-Mail — Wellnesstal',
        description:
          'Gutschein online kaufen: Head Spa E-Gutschein sofort per E-Mail, Print@Home, PDF. Digital bestellen, sofort verschenken. Basic ab 89€ · Wellnesstal Baesweiler.',
      },
      {
        eyebrow: 'Gutschein online · Digital',
        headline: 'Bestellen. Drucken. Verschenken. In Minuten.',
        subline:
          'Gutschein online kaufen — kein Warten, kein Versandstress. Sofort per E-Mail: E-Gutschein, PDF, Print@Home. Head Spa Ritual ab 89€.',
        trust: '4,6★ · Sofort per E-Mail · Digital & Print@Home',
      },
      {
        eyebrow: 'Digital schenken',
        headline: 'E-Gutschein — sofort da, lange erinnert.',
        paragraphs: [
          'Gutschein online bestellen bedeutet: in Minuten bestellt, sofort per E-Mail. Ausdrucken, weiterleiten, überraschen — ohne Wartezeit.',
          'Digitaler Gutschein, PDF zum Ausdrucken, Print@Home — du wählst, wie du schenkst. Beschenkte bucht selbst den Wunschtermin in Baesweiler.',
          'Head Spa ist das Geschenk: Berührung, Stille, Entspannung — kein Produkt fürs Regal, sondern ein Gefühl fürs Nervensystem.',
        ],
      },
      {
        faq: [
          { q: 'Gutschein online kaufen — wie schnell?', a: 'Sofort nach Bestellung per E-Mail — ideal auch last minute.' },
          { q: 'PDF oder Print@Home?', a: 'Ja — beides möglich. Digital weiterleiten oder ausdrucken.' },
          { q: 'E-Gutschein gültig?', a: 'Ja — Beschenkte wählt Paket und Termin selbst bei Wellnesstal Baesweiler.' },
          { q: 'Gutschein bestellen ohne Account?', a: 'Online über Treuepay — schnell und sicher.' },
        ],
        closing: { cta: 'Gutschein online bestellen' },
      },
    ),

  kopfmassage: () =>
    page(
      'kopfmassage',
      {
        title: 'Kopfmassage Gutschein | Head Spa Geschenk — 45–90 Min. — Wellnesstal',
        description:
          'Kopfmassage Gutschein verschenken: Kein 5-Min.-Add-on — 45–90 Min. japanisches Head Spa Ritual. Ab 89€, sofort online · Baesweiler & Region Aachen.',
      },
      {
        eyebrow: 'Kopfmassage · Gutschein',
        headline: 'Kopfmassage schenken — nicht 5 Minuten, sondern 45.',
        subline:
          'Kopfmassage Gutschein für echtes Ritual: Kopf, Nacken, Wasserstrahl, Bedampfung — 45 bis 90 Minuten Stille. Sofort per E-Mail.',
        trust: '4,6★ · 45–90 Min. Ritual · Sofort online',
      },
      {
        eyebrow: 'Mehr als Massage',
        headline: 'Kopfmassage Gutschein — der Unterschied.',
        paragraphs: [
          'Viele „Kopfmassage Gutscheine“ sind fünf Minuten beim Friseur. Dein Geschenk ist anders: dediziertes Head Spa Studio, 45 bis 90 Minuten.',
          'Verschenke Berührung, die wirkt — Nacken, Kopf, Dekolleté, Wasserstrahl, Dampf. Beschenkte spürt den Unterschied sofort.',
          'Region Aachen, Baesweiler, NRW — gut erreichbar. Gutschein online, sofort per E-Mail.',
        ],
      },
      { recipients: REGION_RECIPIENTS },
    ),

  massage: () =>
    page(
      'massage',
      {
        title: 'Massage Gutschein & Massage Geschenk | Head Spa — Wellnesstal',
        description:
          'Massage Gutschein verschenken: Head Spa mit Kopf- und Nackenmassage, 45–90 Min. Ritual. Ab 89€ · Sofort online · Region Aachen.',
      },
      {
        eyebrow: 'Massage · Geschenk',
        headline: 'Massage schenken — die wirklich ankommt.',
        subline:
          'Massage Gutschein für Head Spa Ritual: bewusste Berührung, Wasser, Dampf — 45 bis 90 Minuten Stille.',
        trust: '4,6★ · Kopf & Nacken · Sofort per E-Mail',
      },
      {
        eyebrow: 'Massage neu gedacht',
        headline: 'Nicht irgendeine Massage — ein Ritual.',
        paragraphs: [
          'Massage Geschenke gibt es überall. Head Spa ist Massage plus Ritual — Kopfhaut, Wasserstrahl, Bedampfung, Stille.',
          'Schenke Entspannung, die nachhallt — nicht nur oberflächliche Lockerung.',
          'Basic ab 89€ — Gutschein sofort digital oder Print@Home.',
        ],
      },
      { recipients: REGION_RECIPIENTS },
    ),

  entspannung: () =>
    page(
      'entspannung',
      {
        title: 'Entspannung Gutschein | Relax & Erholung schenken — Wellnesstal',
        description:
          'Entspannung Gutschein verschenken: Head Spa Ritual mit Massage, Wasser und Dampf. 45–90 Min. Ab 89€, sofort online · Region Aachen & NRW.',
      },
      {
        eyebrow: 'Entspannung · Gutschein',
        headline: 'Entspannung schenken — nicht Dinge.',
        subline:
          'Entspannung Gutschein für 45 bis 90 Minuten Stille: Berührung, Wasser, Dampf — der Kopf wird leise.',
        trust: '4,6★ · Pure Entspannung · Sofort online',
      },
      {
        eyebrow: 'Erholung verschenken',
        headline: 'Relax, Erholung, Auszeit — ein Gutschein.',
        paragraphs: [
          'Entspannung Gutschein, Relax Gutschein, Erholung schenken — gleiches Bedürfnis: Ruhe geben, die ankommt.',
          'Head Spa: kein Therme-Lärm, kein Massenbetrieb — 45 bis 90 Minuten Stille in Baesweiler.',
          'Ideal für Gestresste und alle die „alles haben“ — aber Ruhe brauchen.',
        ],
      },
      { recipients: REGION_RECIPIENTS },
    ),

  geschenkidee: () =>
    page(
      'geschenkidee',
      {
        title: 'Geschenkidee Wellness & Head Spa | Besondere Geschenkideen — Wellnesstal',
        description:
          'Geschenkidee gesucht? Besondere Wellness-Geschenkidee: Head Spa Gutschein — Stille statt Staub. Ab 89€, sofort online · Region Aachen & NRW.',
      },
      {
        eyebrow: 'Geschenkidee · Wellness',
        headline: 'Endlich eine Geschenkidee, die ankommt.',
        subline:
          'Besondere, außergewöhnliche, originelle Geschenkidee — Head Spa überrascht und bleibt im Gedächtnis.',
        trust: '4,6★ · Einzigartig · Sofort online',
      },
      {
        eyebrow: 'Die bessere Idee',
        headline: 'Geschenkideen gibt es viele. Ruhe ist selten.',
        paragraphs: [
          'Parfum, Schokolade, Dinge — vergessen. Was bleibt: Stille, Berührung, Leichtigkeit.',
          'Head Spa Gutschein für Menschen, die alles haben — aber keine Zeit für sich.',
          'Premium und persönlich — Ritual-Studio in Baesweiler, Region Aachen.',
        ],
      },
      {
        recipients: {
          eyebrow: 'Für wen?',
          headline: 'Geschenkidee für …',
          items: [
            { title: 'Sie, die alles hat', text: 'Kein weiteres Ding — ein Erlebnis.' },
            { title: 'Den Entdecker', text: 'Head Spa überrascht — japanisches Ritual.' },
            { title: 'Den Gestressten', text: '45–90 Min. nur für sie.' },
            { title: 'Dich', text: 'Selbstfürsorge als Geschenkidee.' },
          ],
        },
      },
    ),

  'zeit-schenken': () =>
    page(
      'zeit-schenken',
      {
        title: 'Zeit schenken | Head Spa Gutschein — Me Time & Auszeit — Wellnesstal',
        description:
          'Zeit schenken statt Dinge: Head Spa Gutschein für Me Time und Auszeit zu zweit. Ab 89€, sofort online · Baesweiler & Region Aachen.',
      },
      {
        eyebrow: 'Zeit schenken · Me Time',
        headline: 'Du schenkst keine Stunde. Du schenkst Stille.',
        subline:
          'Zeit schenken, Auszeit schenken, Me Time verschenken — 45 bis 90 Minuten ohne Pflicht.',
        trust: '4,6★ · Zeit fürs Nervensystem · Sofort online',
      },
      {
        eyebrow: 'Mehr als Zeit',
        headline: 'Zeit zu zweit — oder Zeit nur für sie.',
        paragraphs: [
          'Gemeinsame Zeit? Partner-Pakete ab 178€. Me Time? Solo ab 89€.',
          'Selfcare Geschenk, Achtsamkeit verschenken — du darfst ankommen.',
          'Berührung, Wasser, Dampf, Stille — kein lautes Erlebnis.',
        ],
      },
      {},
    ),

  selbstfuersorge: () =>
    page(
      'selbstfuersorge',
      {
        title: 'Selbstfürsorge Geschenk | Self Care Gutschein — Wellnesstal',
        description:
          'Selbstfürsorge Geschenk: Head Spa Gutschein für Self Care und Me Time. Ab 89€, sofort online · Baesweiler.',
      },
      {
        eyebrow: 'Selbstfürsorge · Self Care',
        headline: 'Self Care ist kein Luxus. Es ist Notwendigkeit.',
        subline: 'Selbstfürsorge Geschenk — 45 bis 90 Minuten, in denen der Kopf leise wird.',
        trust: '4,6★ · Me Time · Sofort online',
      },
      {
        eyebrow: 'Für dich',
        headline: 'Du gibst immer. Diesmal: empfangen.',
        paragraphs: [
          'Selfcare verschenken — oder selbst buchen. Nichts leisten, nur ankommen.',
          'Kopf, Nacken, Nervensystem — runterfahren und abschalten.',
          'Gutschein online — sofort per E-Mail.',
        ],
      },
      {},
    ),

  luxus: () =>
    page(
      'luxus',
      {
        title: 'Luxus Geschenk & Premium Wellness Gutschein | Deluxe — Wellnesstal',
        description:
          'Luxus Geschenk: Head Spa Deluxe 90 Min. mit Kérastase & Babor. Premium Ritual ab 149€ · Sofort online.',
      },
      {
        eyebrow: 'Luxus · Premium · Deluxe',
        headline: 'Luxus ist nicht laut. Luxus ist Stille.',
        subline: 'Premium Geschenk: Deluxe 90 Min. mit Kérastase & Babor Markenpflege.',
        trust: '4,6★ · Deluxe 149€ · 90 Min.',
      },
      {
        eyebrow: 'Premium verschenken',
        headline: 'Hochwertig — ohne Protz.',
        paragraphs: [
          'Luxus Gutschein — Deluxe (149€): Markenpflege, maximale Tiefe, 90 Minuten.',
          'Kein überfülltes Spa — dediziertes Studio nur für Stille.',
          'Partner Deluxe 298€ — Luxus zu zweit.',
        ],
      },
      {
        faq: [
          { q: 'Luxus Gutschein — welches Paket?', a: 'Deluxe 149€ (90 Min.) mit Kérastase & Babor.' },
          { q: 'Premium Geschenk?', a: 'Deluxe oder Beauty (119€).' },
          { q: 'Sofort online?', a: 'Ja — sofort per E-Mail.' },
          { q: 'Wo?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
      },
    ),

  'wellness-nrw': () =>
    page(
      'wellness-nrw',
      {
        title: 'Wellness Gutschein NRW | Head Spa Geschenk Region Aachen — Wellnesstal',
        description:
          'Wellness Gutschein NRW: Head Spa für Städteregion Aachen & Kreis Heinsberg. Aachen, Baesweiler, Würselen & mehr. Ab 89€ · Sofort online.',
      },
      {
        eyebrow: 'Wellness Gutschein · NRW',
        headline: 'NRW schenken — Stille statt Therme.',
        subline: 'Wellness Gutschein NRW — einlösbar in Baesweiler, gut erreichbar aus der ganzen Region.',
        trust: '4,6★ · Region Aachen & Heinsberg · Sofort online',
      },
      {
        eyebrow: 'Regional verschenken',
        headline: 'Ein Studio. Die ganze Region.',
        paragraphs: [
          'Wellness Gutschein Deutschland — bundesweit verschenkbar, einlösbar bei uns in Baesweiler.',
          'Aachen, Baesweiler, Würselen, Herzogenrath, Eschweiler, Alsdorf, Stolberg, Übach-Palenberg, Geilenkirchen, Heinsberg.',
          'Persönliches Ritual — 45 bis 90 Minuten Berührung und Stille.',
        ],
      },
      {
        recipients: {
          eyebrow: 'Städte',
          headline: 'Wellness Gutschein — deine Stadt',
          items: [
            { title: 'Aachen', text: '/geschenk-aachen · /wellness-gutschein-aachen' },
            { title: 'Baesweiler', text: '/geschenk-baesweiler · direkt vor Ort' },
            { title: 'Würselen', text: '/geschenk-wurselen' },
            { title: 'Weitere Städte', text: 'Eschweiler, Stolberg, Heinsberg, Alsdorf & mehr' },
          ],
        },
        faq: [
          { q: 'Wellness Gutschein NRW?', a: 'Ja — einlösbar in Baesweiler, Region Aachen & Heinsberg.' },
          { q: 'Wellness Gutschein Deutschland?', a: 'Bundesweit verschenkbar — Ritual vor Ort.' },
          { q: 'Welche Städte?', a: '10 Städte in der Region — siehe Geschenk-Seiten pro Stadt.' },
          { q: 'Online bestellen?', a: 'Ja — sofort per E-Mail.' },
        ],
      },
    ),

  'fuer-mama': () =>
    page(
      'fuer-mama',
      {
        title: 'Geschenk für Mama | Head Spa Gutschein — Wellnesstal',
        description: 'Geschenk für Mama & Mutter: Head Spa Gutschein — Ruhe und Stille. Ab 89€ · Sofort online.',
      },
      {
        eyebrow: 'Geschenk · Mama',
        headline: 'Mama gibt immer. Diesmal: empfangen.',
        subline: 'Geschenk für Mama — 45 bis 90 Minuten nur für sie.',
        trust: '4,6★ · Für Mama · Sofort online',
      },
      {
        eyebrow: 'Danke, Mama',
        headline: 'Blumen welken. Stille bleibt.',
        paragraphs: [
          'Mama verdient Ruhe — Head Spa statt Standard-Geschenk.',
          'Auch /gutschein/muttertag — Beauty (119€) am beliebtesten.',
          'Region Aachen — gut erreichbar.',
        ],
      },
      {},
    ),

  'fuer-papa': () =>
    page(
      'fuer-papa',
      {
        title: 'Geschenk für Papa | Head Spa Gutschein — Wellnesstal',
        description: 'Geschenk für Papa & Vater: Head Spa — Ruhe statt Krawatte. Ab 89€ · Sofort online.',
      },
      {
        eyebrow: 'Geschenk · Papa',
        headline: 'Papa trägt viel. Schenke ihm Stille.',
        subline: 'Geschenk für Papa — geschlechtsneutral, Nacken und Kopf, Abschalten.',
        trust: '4,6★ · Für Papa · Sofort online',
      },
      {
        eyebrow: 'Ruhe statt Werkzeug',
        headline: 'Keine weitere Krawatte.',
        paragraphs: [
          '45 Minuten ohne Pflicht — Papa wird überrascht sein.',
          'Auch /gutschein/vatertag — Basic (89€) oder Beauty (119€).',
          'Viele Papas kommen wieder.',
        ],
      },
      {},
    ),

  'fuer-oma': () =>
    page(
      'fuer-oma',
      {
        title: 'Geschenk für Oma | Head Spa Gutschein — Wellnesstal',
        description: 'Geschenk für Oma: sanfte Berührung und Ruhe. Ab 89€ · Sofort online.',
      },
      {
        eyebrow: 'Geschenk · Oma',
        headline: 'Oma hat so viel gegeben. Jetzt: empfangen.',
        subline: 'Geschenk für Oma — sanft, ruhig, respektvoll.',
        trust: '4,6★ · Sanft & ruhig · Sofort online',
      },
      {
        eyebrow: 'Generationen',
        headline: 'Von der ganzen Familie.',
        paragraphs: [
          'Wertschätzung spürbar — Head Spa als Oma-Geschenk.',
          'Basic (89€) oder Beauty (119€).',
          'Herzlicher Empfang in Baesweiler.',
        ],
      },
      {},
    ),

  'fuer-opa': () =>
    page(
      'fuer-opa',
      {
        title: 'Geschenk für Opa | Head Spa Gutschein — Wellnesstal',
        description: 'Geschenk für Opa: Entspannung für Kopf und Nacken. Ab 89€ · Sofort online.',
      },
      {
        eyebrow: 'Geschenk · Opa',
        headline: 'Opa verdient Ruhe.',
        subline: 'Geschenk für Opa — echtes Ritual, keine Quick-Massage.',
        trust: '4,6★ · Für Opa · Sofort online',
      },
      {
        eyebrow: 'Respekt',
        headline: 'Wertschätzung — spürbar.',
        paragraphs: [
          'Opa freut sich über echte Aufmerksamkeit.',
          'Basic (89€) — 45 Minuten Überraschung.',
          'Region Aachen.',
        ],
      },
      {},
    ),

  'fuer-freund': () =>
    page(
      'fuer-freund',
      {
        title: 'Geschenk für Freund | Head Spa Gutschein — Wellnesstal',
        description: 'Geschenk für Freund: Head Spa — Entspannung für Männer. Ab 89€ · Sofort online.',
      },
      {
        eyebrow: 'Geschenk · Freund',
        headline: 'Für den Freund, der alles mitträgt.',
        subline: 'Geschenk für Freund — Nacken, Kopf, Abschalten.',
        trust: '4,6★ · Geschlechtsneutral · Sofort online',
      },
      {
        eyebrow: 'Freundschaft',
        headline: 'Du kennst ihn. Er braucht Stille.',
        paragraphs: [
          'Geburtstag, Danke, Überraschung — passt immer.',
          'Basic (89€) — sicherer Einstieg.',
          'Siehe /ratgeber/head-spa-maenner.',
        ],
      },
      {},
    ),

  silberhochzeit: () =>
    page(
      'silberhochzeit',
      {
        title: 'Silberhochzeit Geschenk | Head Spa Partner-Gutschein — Wellnesstal',
        description: 'Geschenk zur Silberhochzeit: Partner-Gutschein ab 178€ · Sofort online.',
      },
      {
        eyebrow: 'Silberhochzeit · 25 Jahre',
        headline: '25 Jahre — schenke Stille zu zweit.',
        subline: 'Silberhochzeit: Partner-Ritual — nebeneinander entspannen.',
        trust: '4,6★ · Partner ab 178€ · Sofort online',
      },
      {
        eyebrow: 'Silberne Hochzeit',
        headline: 'Nicht Porzellan. Ein Gefühl.',
        paragraphs: [
          'Partner Beauty (238€) — beliebt für Silberhochzeit.',
          'Gemeinsame Zeit ohne Programm.',
          'Siehe /gutschein/jubilaeum und /gutschein/hochzeit.',
        ],
      },
      {},
    ),

  nikolaus: () =>
    page(
      'nikolaus',
      {
        title: 'Nikolaus Geschenk | Head Spa Gutschein — Wellnesstal',
        description: 'Nikolaus Geschenk: Stille statt Süßigkeiten. Sofort per E-Mail · Ab 89€.',
      },
      {
        eyebrow: 'Nikolaus · Überraschung',
        headline: 'Nikolaus bringt Stille.',
        subline: 'Nikolaus Geschenk — originell, sofort per E-Mail.',
        trust: '4,6★ · Last Minute · Sofort online',
      },
      {
        eyebrow: 'Anders als Süßes',
        headline: 'Schokolade schmilzt. Stille bleibt.',
        paragraphs: [
          'Für Mama, Papa, Partner — Basic (89€).',
          'Sofort am 5. Dezember bestellbar.',
          'Region Aachen & NRW.',
        ],
      },
      {},
    ),

  verlobung: () =>
    page(
      'verlobung',
      {
        title: 'Verlobung Geschenk | Head Spa Partner-Gutschein — Wellnesstal',
        description: 'Geschenk zur Verlobung: Partner-Gutschein ab 178€ · Sofort online.',
      },
      {
        eyebrow: 'Verlobung · Ja',
        headline: 'Vor dem Trubel — Stille zu zweit.',
        subline: 'Verlobungsgeschenk: Partner-Ritual vor der Hochzeitsplanung.',
        trust: '4,6★ · Partner ab 178€ · Sofort online',
      },
      {
        eyebrow: 'Glückwunsch',
        headline: 'Euer Ja verdient Ruhe.',
        paragraphs: [
          'Partner Beauty (238€) oder Deluxe (298€).',
          'Zeit zu zweit schenken.',
          'Siehe /gutschein/hochzeit.',
        ],
      },
      {},
    ),

  ueberraschung: () =>
    page(
      'ueberraschung',
      {
        title: 'Überraschungsgeschenk | Head Spa Gutschein — Wellnesstal',
        description: 'Überraschungsgeschenk: Head Spa — unerwartet und unvergesslich. Ab 89€ · Sofort online.',
      },
      {
        eyebrow: 'Überraschung · Wow',
        headline: 'Nicht erwartet. Nicht vergessen.',
        subline: 'Überraschungsgeschenk — Head Spa statt Standard.',
        trust: '4,6★ · Einzigartig · Sofort online',
      },
      {
        eyebrow: 'Das unerwartete Geschenk',
        headline: 'Sie erwartet Blumen. Sie bekommt Stille.',
        paragraphs: [
          'Digital in 2 Minuten — Überraschung garantiert.',
          'Head Spa ist für viele neu — perfektes Wow-Geschenk.',
          'Siehe /gutschein/last-minute.',
        ],
      },
      {},
    ),
}

export const BUILT_GIFT_SLUGS = [
  'online',
  'kopfmassage',
  'massage',
  'entspannung',
  'geschenkidee',
  'zeit-schenken',
  'selbstfuersorge',
  'luxus',
  'wellness-nrw',
  'fuer-mama',
  'fuer-papa',
  'fuer-oma',
  'fuer-opa',
  'fuer-freund',
  'silberhochzeit',
  'nikolaus',
  'verlobung',
  'ueberraschung',
] as const

export type BuiltGiftSlug = (typeof BUILT_GIFT_SLUGS)[number]

export function buildGiftPage(slug: string): BuiltGiftPage | null {
  const builder = BUILDERS[slug]
  if (!builder) return null
  return builder()
}
