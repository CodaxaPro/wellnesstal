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
  partnerPackages?: {
    name: string
    price: number
    duration: string
    tagline: string
    featured?: boolean
  }[]
  faq: { q: string; a: string }[]
  closing: { headline: string; text: string; cta: string }
  secondaryCta?: { href: string; label: string; text?: string }
  relatedLinks?: { href: string; label: string; hint: string }[]
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

const PARTNER_PACKAGES = [
  { name: '2× Headspa Basic', price: 178, duration: '45 Min. pro Person', tagline: 'Einstieg zu zweit' },
  { name: '2× Headspa Beauty', price: 238, duration: '60 Min. pro Person', tagline: 'Beliebt für Paare', featured: true },
  { name: '2× Headspa Deluxe', price: 298, duration: '90 Min. pro Person', tagline: 'Volles Ritual zu zweit' },
]

const SECONDARY_PARTNER = {
  href: '/headspa/partner',
  label: 'Selbst Termin buchen',
  text: 'Ihr kommt selbst zu zweit? Partner-Termin per WhatsApp.',
}

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
    partnerPackages?: BuiltGiftPage['partnerPackages']
    secondaryCta?: BuiltGiftPage['secondaryCta']
    relatedLinks?: BuiltGiftPage['relatedLinks']
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
    partnerPackages: opts?.partnerPackages,
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
    secondaryCta: opts?.secondaryCta,
    relatedLinks: opts?.relatedLinks,
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
        trust: '4,7★ · Sofort per E-Mail · Digital & Print@Home',
      },
      {
        eyebrow: 'Digital schenken',
        headline: 'E-Gutschein — sofort da, lange erinnert.',
        paragraphs: [
          'Gutschein online bestellen bedeutet: in Minuten bestellt, sofort per E-Mail. Ausdrucken, weiterleiten, überraschen — ohne Wartezeit und ohne Paketverfolgung.',
          'Digitaler Gutschein, PDF zum Ausdrucken, Print@Home — du wählst, wie du schenkst. Die Beschenkte bucht selbst den Wunschtermin in Baesweiler, wenn es für sie passt.',
          'Head Spa ist das Geschenk: Berührung, Stille, Entspannung — kein Produkt fürs Regal, sondern ein Gefühl fürs Nervensystem. Basic ab 89€, Beauty 119€, Partner ab 178€.',
        ],
      },
      {
        faq: [
          { q: 'Gutschein online kaufen — wie schnell?', a: 'Sofort nach Bestellung per E-Mail — ideal auch last minute.' },
          { q: 'PDF oder Print@Home?', a: 'Ja — beides möglich. Digital weiterleiten oder ausdrucken.' },
          { q: 'E-Gutschein gültig?', a: 'Ja — Beschenkte wählt Paket und Termin selbst bei Wellnesstal Baesweiler.' },
          { q: 'Preise?', a: 'Basic 89€, Beauty 119€ (Beliebt), Deluxe 149€. Partner ab 178€.' },
          { q: 'Gutschein bestellen ohne Account?', a: 'Online über Treuepay — schnell und sicher.' },
        ],
        closing: { cta: 'Gutschein online bestellen' },
        relatedLinks: [
          { href: '/gutschein/last-minute', label: 'Last Minute', hint: 'Sofort verschenken' },
          { href: '/gutschein/geschenkidee', label: 'Geschenkidee', hint: 'Was wirklich ankommt' },
          { href: '/gutschein/kopfmassage', label: 'Kopfmassage Gutschein', hint: '45–90 Min. Ritual' },
        ],
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
        trust: '4,7★ · 45–90 Min. Ritual · Sofort online',
      },
      {
        eyebrow: 'Mehr als Friseur-Add-on',
        headline: 'Kopfmassage Gutschein — der klare Unterschied.',
        paragraphs: [
          'Viele „Kopfmassage-Gutscheine“ meinen fünf Minuten beim Friseur nach dem Waschen. Dein Geschenk ist etwas anderes: ein dediziertes Head Spa Studio, in dem Kopfmassage das Hauptgeschehen ist — 45, 60 oder 90 Minuten, nicht ein Anhang.',
          'Verschenke gezielte Arbeit an Kopfhaut, Nacken und Dekolleté, ergänzt um Wasserstrahl und Bedampfung. Wer Verspannungen im Nacken kennt oder den Kopf nie abschalten kann, spürt den Unterschied oft schon in der ersten Viertelstunde.',
          'Einlösbar in Baesweiler, gut erreichbar aus Aachen und der Region. Gutschein online bestellen — sofort per E-Mail, digital oder Print@Home. Beauty (119€) ist der sichere Allrounder; Basic (89€) der klare Einstieg.',
        ],
      },
      {
        recipients: REGION_RECIPIENTS,
        faq: [
          { q: 'Ist das eine echte Kopfmassage — oder Friseur-Zusatz?', a: 'Echtes Head Spa Ritual: 45–90 Min. fokussiert auf Kopf, Nacken und Stille — kein 5-Minuten-Add-on.' },
          { q: 'Welches Paket für Kopfmassage?', a: 'Basic 89€ (45 Min.), Beauty 119€ (60 Min., Beliebt), Deluxe 149€ (90 Min.). Partner ab 178€.' },
          { q: 'Sofort verfügbar?', a: 'Ja — Gutschein sofort per E-Mail. Print@Home oder digital.' },
          { q: 'Wo einlösbar?', a: 'Wellnesstal, Reyplatz 10, Baesweiler — Region Aachen & NRW.' },
        ],
        relatedLinks: [
          { href: '/gutschein/massage', label: 'Massage Gutschein', hint: 'Ritual mit Berührung' },
          { href: '/gutschein/entspannung', label: 'Entspannung Gutschein', hint: 'Ruhe verschenken' },
          { href: '/kopfmassage-aachen', label: 'Kopfmassage Aachen', hint: 'Lokal informieren' },
        ],
      },
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
        trust: '4,7★ · Kopf & Nacken · Sofort per E-Mail',
      },
      {
        eyebrow: 'Massage neu gedacht',
        headline: 'Nicht irgendeine Massage — ein Ritual mit Tiefe.',
        paragraphs: [
          'Klassische Massage-Gutscheine denken oft an Rückenliege und Öl. Head Spa geht einen anderen Weg: die Massage sitzt an Kopf, Nacken und Schultern — dort, wo Stress sich am häufigsten festsetzt — und wird von Wasserstrahl, Bedampfung und ruhiger Atmosphäre getragen.',
          'Du schenkst also nicht „noch eine Massage“, sondern Berührung plus Ritual. Viele, die schon alles kennen, sind überrascht, wie tief genau diese Kombination wirkt — ohne Sportstudio-Feeling, ohne Therapeuten-Jargon.',
          'Ideal, wenn du Entspannung schenken willst, aber etwas Greifbares suchst: Hände, Wärme, Pflege. Basic ab 89€, Beauty 119€ als sicherer Favorit, Deluxe 149€ für maximale Tiefe. Gutschein sofort digital.',
        ],
      },
      {
        recipients: REGION_RECIPIENTS,
        faq: [
          { q: 'Welche Art Massage ist das?', a: 'Head Spa: achtsame Kopf- und Nackenmassage mit Wasser und Dampf — 45–90 Min. Ritual, kein klassisches Rücken-Öl-Setting.' },
          { q: 'Massage Gutschein Preise?', a: 'Basic 89€, Beauty 119€ (Beliebt), Deluxe 149€. Partner ab 178€.' },
          { q: 'Für Wen geeignet?', a: 'Für alle, die Verspannung im Nacken kennen oder einfach echte Auszeit brauchen — geschlechtsneutral.' },
          { q: 'Sofort online?', a: 'Ja — Gutschein sofort per E-Mail, Print@Home oder digital weiterleiten.' },
        ],
        relatedLinks: [
          { href: '/gutschein/kopfmassage', label: 'Kopfmassage Gutschein', hint: 'Fokus Kopf & Nacken' },
          { href: '/gutschein/entspannung', label: 'Entspannung Gutschein', hint: 'Ruhe statt Dinge' },
          { href: '/gutschein/luxus', label: 'Luxus Geschenk', hint: 'Deluxe 90 Min.' },
        ],
      },
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
        trust: '4,7★ · Pure Entspannung · Sofort online',
      },
      {
        eyebrow: 'Erholung verschenken',
        headline: 'Relax, Erholung, Auszeit — ein Gutschein fürs Nervensystem.',
        paragraphs: [
          'Entspannung Gutschein, Relax Gutschein, Erholung schenken — dahinter steckt oft dasselbe Bedürfnis: jemandem Ruhe geben, die wirklich ankommt. Kein weiteres Produkt, keine weitere Verpflichtung — sondern Erlaubnis, nichts zu leisten.',
          'Head Spa ist Entspannung ohne Therme-Lärm und ohne Massenbetrieb. 45 bis 90 Minuten in einem ruhigen Studio in Baesweiler: Berührung, Wasser, Dampf — der Kopf darf leise werden, ohne Programm und ohne Smalltalk-Pflicht.',
          'Besonders stark für Gestresste, Vielbeschäftigte und alle, die „eigentlich alles haben“ — aber keine echte Pause. Beauty (119€) trifft die meisten; Partner ab 178€, wenn ihr gemeinsam runterfahren wollt.',
        ],
      },
      {
        recipients: REGION_RECIPIENTS,
        faq: [
          { q: 'Was genau schenke ich mit einem Entspannung Gutschein?', a: '45–90 Min. Head Spa Ritual: Stille, Massage, Wasser und Dampf — echte Erholung statt Ding.' },
          { q: 'Preise?', a: 'Basic 89€, Beauty 119€ (Beliebt), Deluxe 149€. Partner ab 178€.' },
          { q: 'Unterschied zu Massage-Gutschein?', a: 'Hier steht die Auszeit im Vordergrund — Massage ist Teil des Rituals, nicht der einzige Fokus.' },
          { q: 'Wo einlösbar?', a: 'Wellnesstal, Reyplatz 10, Baesweiler — Region Aachen & NRW.' },
        ],
        relatedLinks: [
          { href: '/gutschein/zeit-schenken', label: 'Zeit schenken', hint: 'Me Time & Auszeit' },
          { href: '/gutschein/selbstfuersorge', label: 'Selbstfürsorge', hint: 'Self Care Geschenk' },
          { href: '/gutschein/kopfmassage', label: 'Kopfmassage Gutschein', hint: '45–90 Min. Ritual' },
        ],
      },
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
        trust: '4,7★ · Einzigartig · Sofort online',
      },
      {
        eyebrow: 'Die bessere Idee',
        headline: 'Geschenkideen gibt es viele. Echte Ruhe ist selten.',
        paragraphs: [
          'Du kennst die Liste: Parfum, Schokolade, Kerze, noch ein Schal. Schön gemeint — und oft vergessen. Eine Geschenkidee, die bleibt, schenkt ein Erlebnis: Stille, Berührung, das Gefühl, gesehen zu werden.',
          'Head Spa trifft genau die Menschen, die „alles haben“, aber keine Zeit für sich. Japanisches Ritual, 45 bis 90 Minuten, kein lautes Spa-Programm — sondern ein Moment, der sich wie Wertschätzung anfühlt.',
          'Premium und persönlich, ohne Protz: Studio in Baesweiler, Region Aachen. Gutschein sofort per E-Mail — Beauty (119€) als sicherer Favorit, Deluxe (149€) wenn du wirklich beeindrucken willst, Partner ab 178€ zu zweit.',
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
        faq: [
          { q: 'Ist Head Spa eine gute Geschenkidee?', a: 'Ja — originell, einlösbar und emotional stark. Viele sagen später: das schönste Geschenk.' },
          { q: 'Welches Paket wählen?', a: 'Beauty 119€ ist der sichere Allrounder. Basic 89€ zum Einstieg, Deluxe 149€ für Premium. Partner ab 178€.' },
          { q: 'Sofort bestellbar?', a: 'Ja — Gutschein sofort per E-Mail, digital oder Print@Home.' },
          { q: 'Für welchen Anlass?', a: 'Geburtstag, Danke, Jahrestag, Weihnachten — oder einfach so, wenn Worte fehlen.' },
        ],
        relatedLinks: [
          { href: '/gutschein/ueberraschung', label: 'Überraschungsgeschenk', hint: 'Unerwartet & stark' },
          { href: '/gutschein/fuer-mama', label: 'Geschenk für Mama', hint: 'Alltag, nicht nur Feiertag' },
          { href: '/gutschein/online', label: 'Gutschein online', hint: 'Sofort per E-Mail' },
        ],
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
        trust: '4,7★ · Zeit fürs Nervensystem · Sofort online',
      },
      {
        eyebrow: 'Mehr als Kalenderzeit',
        headline: 'Zeit zu zweit — oder Zeit nur für sie.',
        paragraphs: [
          'Zeit schenken klingt einfach — und ist selten. Kalender voll, Handy laut, Kopf nie leer. Ein Head Spa Gutschein blockt echte Auszeit: 45 bis 90 Minuten, in denen niemand etwas von der Beschenkten will.',
          'Me Time solo ab 89€ — oder gemeinsame Zeit mit Partner-Paketen ab 178€. Du entscheidest, ob du „endlich mal nur für dich“ schenkst oder „endlich mal zu zweit ohne Ablenkung“.',
          'Selfcare und Achtsamkeit brauchen keinen Vortrag — sie brauchen einen Raum. Berührung, Wasser, Dampf, Stille. Gutschein sofort online, Termin später in Baesweiler, wenn der Alltag es zulässt.',
        ],
      },
      {
        faq: [
          { q: 'Solo oder zu zweit Zeit schenken?', a: 'Solo ab 89€. Partner-Pakete ab 178€ — Beauty zu zweit 238€ ist besonders beliebt.' },
          { q: 'Welches Paket für Me Time?', a: 'Beauty 119€ (60 Min.) trifft die meisten. Deluxe 149€ für tiefe Auszeit.' },
          { q: 'Sofort verfügbar?', a: 'Ja — Gutschein sofort per E-Mail.' },
          { q: 'Wo einlösen?', a: 'Wellnesstal, Reyplatz 10, Baesweiler — Region Aachen & NRW.' },
        ],
        relatedLinks: [
          { href: '/gutschein/selbstfuersorge', label: 'Selbstfürsorge', hint: 'Self Care Geschenk' },
          { href: '/gutschein/paar', label: 'Gutschein zu zweit', hint: 'Partner ab 178€' },
          { href: '/gutschein/entspannung', label: 'Entspannung Gutschein', hint: 'Ruhe verschenken' },
        ],
      },
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
        trust: '4,7★ · Me Time · Sofort online',
      },
      {
        eyebrow: 'Für dich — oder für jemanden, der immer gibt',
        headline: 'Du gibst immer. Diesmal: empfangen.',
        paragraphs: [
          'Selbstfürsorge bleibt oft Theorie: „Ich müsste mal …“ Ein Gutschein macht daraus einen Termin. Du verschenkst Self Care — oder buchst ihn für dich selbst — und gibst dem Nervensystem endlich eine klare Pause.',
          'Head Spa ist Self Care ohne Produktivitätsdruck: nichts leisten, nichts optimieren, nur ankommen. Kopf und Nacken werden berührt, der Atem wird langsamer, der Alltag darf draußen bleiben.',
          'Ideal für Mütter, Pflegeberufe, Gründerinnen, Studierende in Prüfungsphasen — und alle, die für andere da sind. Beauty (119€) ist der Allrounder; Deluxe (149€), wenn die Erschöpfung tiefer sitzt. Sofort per E-Mail.',
        ],
      },
      {
        faq: [
          { q: 'Selbstfürsorge Gutschein — für wen?', a: 'Für alle, die ständig geben — und selten empfangen. Auch als Geschenk an dich selbst.' },
          { q: 'Welches Paket?', a: 'Beauty 119€ ist der sichere Favorit. Basic 89€ zum Einstieg, Deluxe 149€ für tiefe Pause. Partner ab 178€.' },
          { q: 'Muss ich den Termin sofort buchen?', a: 'Nein — Gutschein sofort, Termin später, wenn es passt.' },
          { q: 'Wo?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
        relatedLinks: [
          { href: '/gutschein/zeit-schenken', label: 'Zeit schenken', hint: 'Me Time & Auszeit' },
          { href: '/gutschein/fuer-mama', label: 'Geschenk für Mama', hint: 'Ruhe im Alltag' },
          { href: '/gutschein/entspannung', label: 'Entspannung', hint: 'Relax verschenken' },
        ],
      },
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
        trust: '4,7★ · Deluxe 149€ · 90 Min.',
      },
      {
        eyebrow: 'Premium verschenken',
        headline: 'Hochwertig — ohne Protz und ohne Crowds.',
        paragraphs: [
          'Echter Luxus muss nicht glitzern. Er darf leise sein: 90 Minuten Deluxe mit Kérastase & Babor, maximale Tiefe, volle Aufmerksamkeit — in einem Studio, das nicht überbucht und laut wirkt.',
          'Du schenkst Premium-Wellness ohne Hotelkomplex und ohne „Spa-Wochenende“-Druck. Ein klarer Moment: Pflege, Berührung, Stille. Für Menschen, die Qualität spüren — und billige Geschenke peinlich finden.',
          'Solo Deluxe 149€. Zu zweit Partner Deluxe 298€. Wer unsicher ist, liegt mit Beauty (119€) selten falsch — für den besonderen Anlass bleibt Deluxe die klare Premium-Wahl. Gutschein sofort online.',
        ],
      },
      {
        faq: [
          { q: 'Luxus Gutschein — welches Paket?', a: 'Deluxe 149€ (90 Min.) mit Kérastase & Babor. Partner Deluxe 298€ zu zweit.' },
          { q: 'Premium Geschenk ohne Deluxe?', a: 'Beauty 119€ ist starker Allrounder — Deluxe, wenn du maximale Tiefe willst.' },
          { q: 'Partner-Pakete?', a: 'Partner ab 178€ — Beauty zu zweit 238€, Deluxe zu zweit 298€.' },
          { q: 'Sofort online?', a: 'Ja — sofort per E-Mail.' },
          { q: 'Wo?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
        relatedLinks: [
          { href: '/gutschein/paar', label: 'Gutschein zu zweit', hint: 'Partner Deluxe 298€' },
          { href: '/gutschein/geschenkidee', label: 'Geschenkidee', hint: 'Was wirklich bleibt' },
          { href: '/headspa/deluxe', label: 'Deluxe Paket', hint: '90 Min. Ritual' },
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
        trust: '4,7★ · Region Aachen & Heinsberg · Sofort online',
      },
      {
        eyebrow: 'Regional verschenken',
        headline: 'Ein Studio. Die ganze Region.',
        paragraphs: [
          'Wellness Gutschein NRW heißt bei uns: bundesweit digital verschenkbar, einlösbar vor Ort in Baesweiler — ohne Therme-Gedränge und ohne anonyme Spa-Landschaft. Persönliches Ritual statt Massenbetrieb.',
          'Aus Aachen bist du in etwa 15 Minuten da; aus Würselen, Herzogenrath, Eschweiler, Alsdorf, Stolberg, Übach-Palenberg, Geilenkirchen oder Heinsberg ist der Weg kurz und klar. Ideal, wenn du regional schenkst und Qualität willst.',
          '45 bis 90 Minuten Berührung und Stille — Basic ab 89€, Beauty 119€, Partner ab 178€. Gutschein sofort per E-Mail; die Beschenkte wählt den Termin, wenn der Alltag es zulässt.',
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
          { q: 'Wellness Gutschein Deutschland?', a: 'Bundesweit verschenkbar — Ritual vor Ort in Baesweiler.' },
          { q: 'Welche Städte?', a: 'Aachen, Baesweiler, Würselen, Herzogenrath, Eschweiler, Alsdorf, Stolberg, Übach-Palenberg, Geilenkirchen, Heinsberg.' },
          { q: 'Preise?', a: 'Basic 89€, Beauty 119€ (Beliebt), Deluxe 149€. Partner ab 178€.' },
          { q: 'Online bestellen?', a: 'Ja — sofort per E-Mail.' },
        ],
        relatedLinks: [
          { href: '/geschenk-aachen', label: 'Geschenk Aachen', hint: 'Head Spa für Aachen' },
          { href: '/geschenk-baesweiler', label: 'Geschenk Baesweiler', hint: 'Direkt vor Ort' },
          { href: '/geschenk-wurselen', label: 'Geschenk Würselen', hint: 'Kurz erreichbar' },
          { href: '/geschenk-eschweiler', label: 'Geschenk Eschweiler', hint: 'Regional schenken' },
          { href: '/geschenk-heinsberg', label: 'Geschenk Heinsberg', hint: 'Kreis Heinsberg' },
          { href: '/geschenk-herzogenrath', label: 'Geschenk Herzogenrath', hint: 'Für die Nachbarstadt' },
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
        subline: 'Geschenk für Mama — 45 bis 90 Minuten nur für sie. Im Alltag, nicht nur am Feiertag.',
        trust: '4,7★ · Für Mama · Sofort online',
      },
      {
        eyebrow: 'Alltag, nicht nur Muttertag',
        headline: 'Ein Danke, das man einlösen kann — an jedem Tag.',
        paragraphs: [
          'Mama braucht nicht nur am Muttertag ein Zeichen. Oft fehlt im Alltag genau das: Zeit ohne Kinderlärm, ohne Einkaufsliste, ohne „Kannst du kurz …?“. Ein Head Spa Gutschein sagt: Heute bist du dran — ohne schlechtes Gewissen.',
          'Du schenkst keine weitere Haushaltshelferin und keinen weiteren Schal. Du schenkst Berührung an Kopf und Nacken, Wasser, Dampf und einen Raum, in dem sie nichts organisieren muss. Viele Mütter kommen danach leichter nach Hause — und fühlen sich endlich gesehen.',
          'Geburtstag, „einfach so“, nach einer harten Phase oder als kleines Danke zwischen den Feiertagen: Beauty (119€) ist der Favorit. Für besondere Momente Deluxe (149€). Zum Muttertag selbst findest du eine eigene Seite — hier geht es um Mama im echten Leben.',
        ],
      },
      {
        recipients: {
          eyebrow: 'Welche Mama?',
          headline: 'Geschenk für Mama — im echten Alltag',
          items: [
            { title: 'Die Alltagsorganisatorin', text: 'Immer für alle da — diesmal nur für sich.' },
            { title: 'Die berufstätige Mama', text: 'Zwischen Job und Familie: echte Pause statt Kerze.' },
            { title: 'Die neue Mama', text: 'Schlafmangel und Verantwortung — Stille als Geschenk.' },
            { title: 'Die Mama, die nichts will', text: '„Ich brauche nichts“ — außer Ruhe, die ankommt.' },
          ],
        },
        faq: [
          { q: 'Geschenk für Mama — welches Paket?', a: 'Beauty 119€ ist der sichere Favorit. Basic 89€ zum Einstieg, Deluxe 149€ für besondere Wertschätzung. Partner ab 178€.' },
          { q: 'Auch außerhalb vom Muttertag?', a: 'Genau dafür ist diese Seite da — Alltag, Geburtstag, Danke. Für den Feiertag siehe /gutschein/muttertag.' },
          { q: 'Sofort verfügbar?', a: 'Ja — Gutschein sofort per E-Mail.' },
          { q: 'Wo einlösbar?', a: 'Wellnesstal, Reyplatz 10, Baesweiler — Region Aachen & NRW.' },
        ],
        relatedLinks: [
          { href: '/gutschein/muttertag', label: 'Muttertag Gutschein', hint: 'Für den Feiertag' },
          { href: '/gutschein/selbstfuersorge', label: 'Selbstfürsorge', hint: 'Me Time schenken' },
          { href: '/gutschein/fuer-oma', label: 'Geschenk für Oma', hint: 'Sanfte Wertschätzung' },
        ],
      },
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
        subline: 'Geschenk für Papa — geschlechtsneutral, Nacken und Kopf, Abschalten. Sofort per E-Mail.',
        trust: '4,7★ · Für Papa · Sofort online',
      },
      {
        eyebrow: 'Ruhe statt Werkzeugkasten',
        headline: 'Keine weitere Krawatte. Kein Grillzubehör.',
        paragraphs: [
          'Papas bekommen oft Dinge, die sie nicht brauchen. Was sie selten bekommen: Erlaubnis, wirklich abzuschalten. Head Spa ist geschlechtsneutral — Nacken, Kopfhaut, Stille — und überrascht genau die Väter, die „Wellness“ vorher abgewinkt hätten.',
          '45 bis 90 Minuten ohne Pflicht und ohne Smalltalk-Zwang. Viele Papas kommen mit Skepsis und gehen mit dem Satz: „Das hätte ich nicht erwartet.“ Genau das macht den Gutschein stark — nicht peinlich, sondern klar und wohltuend.',
          'Geburtstag, Danke nach einer anstrengenden Zeit oder einfach so. Basic (89€) als sicherer Einstieg, Beauty (119€) wenn du tiefer gehen willst. Zum Vatertag gibt es eine eigene Seite — hier geht es um Papa im Alltag.',
        ],
      },
      {
        faq: [
          { q: 'Nehmen Papas Head Spa an?', a: 'Ja — viele kommen überrascht und kommen wieder. Geschlechtsneutral, Fokus Nacken und Kopf.' },
          { q: 'Welches Paket für Papa?', a: 'Basic 89€ oder Beauty 119€. Deluxe 149€ für besondere Anlässe. Partner ab 178€.' },
          { q: 'Vatertag oder Alltag?', a: 'Hier: Alltag & Geburtstag. Für den Feiertag siehe /gutschein/vatertag.' },
          { q: 'Sofort online?', a: 'Ja — Gutschein sofort per E-Mail.' },
        ],
        relatedLinks: [
          { href: '/gutschein/vatertag', label: 'Vatertag Gutschein', hint: 'Für den Feiertag' },
          { href: '/gutschein/fuer-freund', label: 'Geschenk für Freund', hint: 'Auch für Männer' },
          { href: '/ratgeber/head-spa-maenner', label: 'Head Spa für Männer', hint: 'Ratgeber lesen' },
        ],
      },
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
        subline: 'Geschenk für Oma — sanft, ruhig, respektvoll. 45–90 Min. Ritual.',
        trust: '4,7★ · Sanft & ruhig · Sofort online',
      },
      {
        eyebrow: 'Generationen',
        headline: 'Von der ganzen Familie — spürbare Wertschätzung.',
        paragraphs: [
          'Oma hat Jahrzehnte gegeben. Ein Geschenk für sie darf warm und klar sein: sanfte Berührung, ruhiger Raum, herzlicher Empfang — ohne Hektik und ohne übertriebene Show.',
          'Head Spa eignet sich wunderbar als ganzheitliches „Danke“ von Kindern und Enkeln: Basic (89€) oder Beauty (119€), je nachdem, wie tief die Auszeit sein soll. Viele Omas genießen besonders die Stille und die Aufmerksamkeit.',
          'Geburtstag, Weihnachten, Genesung oder einfach ein Zeichen zwischen den Festen. Studio in Baesweiler, Region Aachen — gut erreichbar, familiär, respektvoll. Gutschein sofort per E-Mail.',
        ],
      },
      {
        faq: [
          { q: 'Ist Head Spa für Oma geeignet?', a: 'Ja — sanft, ruhig, angepasst. Basic 89€ oder Beauty 119€ sind oft ideal.' },
          { q: 'Preise?', a: 'Basic 89€, Beauty 119€ (Beliebt), Deluxe 149€. Partner ab 178€ — z. B. mit Tochter oder Enkelin.' },
          { q: 'Sofort verfügbar?', a: 'Ja — Gutschein sofort per E-Mail.' },
          { q: 'Wo?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
        relatedLinks: [
          { href: '/gutschein/fuer-mama', label: 'Geschenk für Mama', hint: 'Alltag & Danke' },
          { href: '/gutschein/fuer-opa', label: 'Geschenk für Opa', hint: 'Ruhe für Opa' },
          { href: '/gutschein/paar', label: 'Gutschein zu zweit', hint: 'Mit Tochter / Enkelin' },
        ],
      },
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
        subline: 'Geschenk für Opa — echtes Ritual, keine Quick-Massage. Sofort online.',
        trust: '4,7★ · Für Opa · Sofort online',
      },
      {
        eyebrow: 'Respekt, der ankommt',
        headline: 'Wertschätzung — spürbar, nicht nur gesagt.',
        paragraphs: [
          'Opa freut sich über echte Aufmerksamkeit mehr als über noch ein praktisches Geschenk. Head Spa bietet genau das: 45 Minuten (oder länger) Fokus auf Kopf und Nacken — klar, würdevoll, ohne peinlichen Wellness-Klischee-Druck.',
          'Viele Großväter sind überrascht, wie gut die Kombination aus Massage, Wasser und Ruhe tut. Basic (89€) ist der sichere Einstieg; Beauty (119€), wenn du mehr Tiefe schenken willst.',
          'Geburtstag, Danke, Genesung oder gemeinsame Idee der Enkel. Einlösbar in Baesweiler, Region Aachen — Gutschein sofort per E-Mail, Termin später in Ruhe wählen.',
        ],
      },
      {
        faq: [
          { q: 'Nehmen Opas so ein Geschenk an?', a: 'Sehr oft ja — besonders, wenn es als echte Auszeit und nicht als „Wellness-Kram“ gerahmt wird.' },
          { q: 'Welches Paket?', a: 'Basic 89€ als Einstieg, Beauty 119€ für mehr Tiefe. Partner ab 178€.' },
          { q: 'Sofort online?', a: 'Ja — Gutschein sofort per E-Mail.' },
          { q: 'Wo einlösen?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
        relatedLinks: [
          { href: '/gutschein/fuer-papa', label: 'Geschenk für Papa', hint: 'Auch für Väter' },
          { href: '/gutschein/fuer-oma', label: 'Geschenk für Oma', hint: 'Für die Großeltern' },
          { href: '/gutschein/kopfmassage', label: 'Kopfmassage Gutschein', hint: 'Nacken & Kopf' },
        ],
      },
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
        subline: 'Geschenk für Freund — Nacken, Kopf, Abschalten. Geschlechtsneutral und klar.',
        trust: '4,7★ · Geschlechtsneutral · Sofort online',
      },
      {
        eyebrow: 'Freundschaft, die sieht',
        headline: 'Du kennst ihn. Er braucht Stille — nicht noch ein Gadget.',
        paragraphs: [
          'Für Freunde ist Schenken oft schwierig: zu praktisch, zu witzig, zu austauschbar. Head Spa trifft einen anderen Ton — du schenkst Erholung für jemanden, der viel trägt und selten pausiert.',
          'Geburtstag, Danke nach einer schweren Phase, „du hast mir den Rücken freigehalten“: Basic (89€) ist der sichere Einstieg, Beauty (119€) wenn du klar zeigen willst, dass du hinschaust. Geschlechtsneutral, ohne peinliche Verpackung.',
          'Viele Männer entdecken Head Spa erst durch so einen Gutschein — und kommen freiwillig wieder. Mehr Kontext findest du auch im Ratgeber zu Head Spa für Männer. Bestellen geht sofort online.',
        ],
      },
      {
        faq: [
          { q: 'Geschenk für Freund — kommt das an?', a: 'Ja — klar, modern, ohne Kitsch. Fokus Nacken, Kopf, Abschalten.' },
          { q: 'Welches Paket?', a: 'Basic 89€ oder Beauty 119€. Partner ab 178€, wenn ihr zu zweit kommt.' },
          { q: 'Sofort verfügbar?', a: 'Ja — Gutschein sofort per E-Mail.' },
          { q: 'Mehr Infos für Männer?', a: 'Siehe /ratgeber/head-spa-maenner.' },
        ],
        relatedLinks: [
          { href: '/ratgeber/head-spa-maenner', label: 'Head Spa für Männer', hint: 'Ratgeber' },
          { href: '/gutschein/fuer-papa', label: 'Geschenk für Papa', hint: 'Ähnliche Richtung' },
          { href: '/gutschein/massage', label: 'Massage Gutschein', hint: 'Berührung schenken' },
        ],
      },
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
        subline: 'Silberhochzeit: Partner-Ritual — nebeneinander entspannen. Partner ab 178€, Beauty 238€.',
        trust: '4,7★ · Partner ab 178€ · Sofort online',
      },
      {
        eyebrow: 'Silberne Hochzeit',
        headline: 'Nicht Porzellan. Ein Gefühl, das ihr teilt.',
        paragraphs: [
          '25 Jahre verdienen mehr als ein Ding für die Vitrine. Ein Partner-Gutschein zur Silberhochzeit schenkt gemeinsame Zeit ohne Programm: zwei Rituale nebeneinander, Nähe in der Stille, Erinnerung statt Staub.',
          'Partner Beauty (238€) ist der Favorit für Silberhochzeit — 60 Minuten pro Person, genug Tiefe, klar premium. Partner Basic (178€) als Einstieg, Partner Deluxe (298€) wenn ihr das volle Ritual wollt.',
          'Ideal als Geschenk von Familie und Freunden — oder als Geschenk an euch selbst. Gutschein sofort per E-Mail; Termin später in Baesweiler buchen. Wer selbst zu zweit kommen will, findet den Partner-Termin auch direkt über WhatsApp.',
        ],
      },
      {
        partnerPackages: PARTNER_PACKAGES,
        secondaryCta: SECONDARY_PARTNER,
        faq: [
          { q: 'Welches Partner-Paket zur Silberhochzeit?', a: 'Partner Beauty 238€ ist besonders beliebt. Einstieg ab 178€, Deluxe zu zweit 298€.' },
          { q: 'Solo oder zu zweit?', a: 'Zur Silberhochzeit passt Partner. Solo Beauty 119€, wenn nur eine Person beschenkt wird.' },
          { q: 'Sofort verfügbar?', a: 'Ja — Gutschein sofort per E-Mail.' },
          { q: 'Wo einlösen?', a: 'Wellnesstal, Reyplatz 10, Baesweiler — Region Aachen & NRW.' },
        ],
        relatedLinks: [
          { href: '/gutschein/paar', label: 'Gutschein zu zweit', hint: 'Partner ab 178€' },
          { href: '/gutschein/hochzeit', label: 'Hochzeit Gutschein', hint: 'Für Brautpaare' },
          { href: '/gutschein/jubilaeum', label: 'Jubiläum Gutschein', hint: 'Jahre feiern' },
        ],
        closing: {
          headline: '25 Jahre Nähe — schenke gemeinsame Stille.',
          text: 'Partner-Gutschein zur Silberhochzeit: nebeneinander loslassen, lange erinnern. Ab 178€, sofort online.',
          cta: 'Partner-Gutschein bestellen',
        },
      },
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
        subline: 'Nikolaus Geschenk — originell, sofort per E-Mail. Stille statt nur Süßes.',
        trust: '4,7★ · Last Minute · Sofort online',
      },
      {
        eyebrow: 'Anders als Süßes',
        headline: 'Schokolade schmilzt. Stille bleibt.',
        paragraphs: [
          'Am 6. Dezember landet oft wieder dasselbe im Stiefel. Ein Head Spa Gutschein bricht die Routine: Nikolaus bringt diesmal keine Kalorien, sondern eine Auszeit — für Mama, Papa, Partner oder die beste Freundin.',
          'Last Minute ist hier kein Stress: Gutschein am 5. Dezember noch bestellen, sofort per E-Mail, ausdrucken oder digital überreichen. Basic (89€) als clevere Überraschung, Beauty (119€) wenn du mehr Tiefe schenken willst.',
          'Region Aachen & NRW — einlösbar in Baesweiler, wenn der Dezember-Trubel vorbei ist. Genau richtig für alle, die im Advent schon wieder alles geben und selbst kaum Pause haben.',
        ],
      },
      {
        faq: [
          { q: 'Noch rechtzeitig zum Nikolaus?', a: 'Ja — Gutschein sofort per E-Mail. Ideal am 5./6. Dezember.' },
          { q: 'Welches Paket?', a: 'Basic 89€ oder Beauty 119€. Partner ab 178€ zu zweit.' },
          { q: 'Für wen?', a: 'Mama, Papa, Partner, Freundin — alle, die Ruhe statt Süßes verdienen.' },
          { q: 'Wo einlösen?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
        relatedLinks: [
          { href: '/gutschein/ueberraschung', label: 'Überraschungsgeschenk', hint: 'Wow-Moment' },
          { href: '/gutschein/last-minute', label: 'Last Minute', hint: 'Sofort verschenken' },
          { href: '/gutschein/fuer-mama', label: 'Geschenk für Mama', hint: 'Ruhe schenken' },
        ],
      },
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
        subline: 'Verlobungsgeschenk: Partner-Ritual vor der Hochzeitsplanung. Partner ab 178€.',
        trust: '4,7★ · Partner ab 178€ · Sofort online',
      },
      {
        eyebrow: 'Glückwunsch',
        headline: 'Euer Ja verdient Ruhe — nicht nur Planung.',
        paragraphs: [
          'Nach dem Ja beginnt oft der Trubel: Listen, Termine, Erwartungen. Ein Partner-Gutschein zur Verlobung schenkt das Gegenteil — Zeit zu zweit, bevor die Hochzeitsmaschine richtig anläuft.',
          'Partner Beauty (238€) oder Partner Deluxe (298€) fühlen sich nach echtem Glückwunsch an: zwei Rituale nebeneinander, Nähe ohne Restaurant-Lärm. Partner Basic (178€) bleibt der klare Einstieg.',
          'Schön als Geschenk von Freunden und Familie — oder als Geschenk an euch selbst. Sofort per E-Mail bestellen; Termin in Baesweiler später wählen. Wer direkt buchen will, findet den Partner-Weg über WhatsApp.',
        ],
      },
      {
        partnerPackages: PARTNER_PACKAGES,
        secondaryCta: SECONDARY_PARTNER,
        faq: [
          { q: 'Welches Paket zur Verlobung?', a: 'Partner Beauty 238€ oder Deluxe 298€. Einstieg Partner Basic ab 178€. Solo Beauty 119€ möglich.' },
          { q: 'Passt das vor der Hochzeit?', a: 'Genau dafür: gemeinsame Stille, bevor Planung alles füllt.' },
          { q: 'Sofort verfügbar?', a: 'Ja — Gutschein sofort per E-Mail.' },
          { q: 'Wo?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
        relatedLinks: [
          { href: '/gutschein/paar', label: 'Gutschein zu zweit', hint: 'Partner ab 178€' },
          { href: '/gutschein/hochzeit', label: 'Hochzeit Gutschein', hint: 'Für den großen Tag' },
          { href: '/gutschein/jubilaeum', label: 'Jubiläum Gutschein', hint: 'Jahre feiern' },
        ],
        closing: {
          headline: 'Zum Ja: Stille zu zweit schenken.',
          text: 'Partner-Gutschein zur Verlobung — Nähe ohne Trubel. Ab 178€, sofort online.',
          cta: 'Partner-Gutschein bestellen',
        },
      },
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
        subline: 'Überraschungsgeschenk — Head Spa statt Standard. Sofort digital.',
        trust: '4,7★ · Einzigartig · Sofort online',
      },
      {
        eyebrow: 'Das unerwartete Geschenk',
        headline: 'Sie erwartet Blumen. Sie bekommt Stille.',
        paragraphs: [
          'Die besten Überraschungen sind nicht laut — sie sind treffsicher. Head Spa kennen viele noch nicht persönlich; genau deshalb wirkt der Gutschein so stark: neu, emotional, sofort verständlich als „Wow, das ist für mich.“',
          'In zwei Minuten online bestellt, digital oder ausgedruckt überreicht — ideal, wenn du spontan überraschen willst. Beauty (119€) trifft die meisten; Deluxe (149€) für den großen Moment; Partner ab 178€, wenn die Überraschung für zwei gilt.',
          'Geburtstag, Jahrestag, „weil du es brauchst“ oder last minute: kein Standard-Blumenstrauß, sondern ein Erlebnis, das Monate später noch nachklingt. Termin später in Baesweiler — die Überraschung bleibt, der Druck nicht.',
        ],
      },
      {
        faq: [
          { q: 'Gute Überraschung — wirklich?', a: 'Ja — Head Spa ist für viele neu und bleibt im Gedächtnis. Emotional starker Wow-Effekt.' },
          { q: 'Welches Paket?', a: 'Beauty 119€ als Favorit. Basic 89€, Deluxe 149€, Partner ab 178€.' },
          { q: 'Wie schnell?', a: 'Sofort per E-Mail — ideal last minute. Siehe auch /gutschein/last-minute.' },
          { q: 'Wo einlösen?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
        relatedLinks: [
          { href: '/gutschein/last-minute', label: 'Last Minute', hint: 'Sofort verschenken' },
          { href: '/gutschein/geschenkidee', label: 'Geschenkidee', hint: 'Ideen, die ankommen' },
          { href: '/gutschein/online', label: 'Gutschein online', hint: 'Digital in Minuten' },
        ],
      },
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
