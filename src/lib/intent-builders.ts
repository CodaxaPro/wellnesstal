import type { IntentType, LocationSlug } from './seo-config'

type LocationContext = {
  slug: string
  city: string
  region: string
  distance: string
  nearby: string[]
}

type EmotionItem = { word: string; headline: string; text: string }
type JourneyStep = { num: string; title: string; text: string }

export type BuiltIntentPage = {
  slug: string
  path: string
  seo: { title: string; description: string }
  city: string
  region: string
  distance: string
  nearby: string[]
  hero: { eyebrow: string; headline: string; subline: string; trust: string }
  essence: { eyebrow: string; headline: string; paragraphs: string[] }
  emotions: { eyebrow: string; headline: string; items: EmotionItem[] }
  localProof: {
    eyebrow: string
    headline: string
    quotes: { text: string; name: string; location: string }[]
  }
  journey: { eyebrow: string; headline: string; steps: JourneyStep[] }
  faq: { q: string; a: string }[]
  closing: { headline: string; text: string; cta: string }
}

const SHARED_QUOTES = [
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
]

function isHomeCity(slug: LocationSlug): boolean {
  return slug === 'baesweiler'
}

function travelFrom(loc: LocationContext): string {
  return isHomeCity(loc.slug as LocationSlug) ? 'direkt vor Ort, Reyplatz 10' : loc.distance
}

function buildKopfmassage(type: IntentType, loc: LocationContext): BuiltIntentPage {
  const slug = `${type}-${loc.slug}`
  const home = isHomeCity(loc.slug as LocationSlug)

  return {
    slug,
    path: `/${slug}`,
    seo: {
      title: `Kopfmassage ${loc.city} | Head Spa Ritual — 45–90 Min. Wellnesstal`,
      description: home
        ? `Kopfmassage in ${loc.city}: Kein 5-Min.-Add-on — 45–90 Min. japanisches Head Spa mit Nacken, Wasserstrahl und Bedampfung. Basic ab 89€. 4,6★ · Reyplatz 10.`
        : `Kopfmassage nahe ${loc.city}: Nicht 5 Min. beim Friseur — 45–90 Min. japanisches Head Spa. ${loc.distance}. Basic ab 89€. 4,6★ · Wellnesstal Baesweiler.`,
    },
    city: loc.city,
    region: loc.region,
    distance: home ? 'Reyplatz 10 — dediziertes Kopfmassage-Ritual-Studio' : `${loc.distance} — dediziertes Ritual-Studio`,
    nearby: loc.nearby,
    hero: {
      eyebrow: `Kopfmassage · ${loc.city}`,
      headline: home
        ? 'Kopfmassage, die länger wirkt als der Friseurbesuch.'
        : `Kopfmassage nahe ${loc.city} — tiefer als erwartet.`,
      subline: home
        ? 'Du suchst Kopfmassage in Baesweiler? Bei uns bekommst du kein Add-on — sondern 45 bis 90 Minuten Ritual: Kopf, Nacken, Wasserstrahl, Bedampfung und Stille.'
        : `Du suchst Kopfmassage in ${loc.city}? ${travelFrom(loc)} bei uns: 45 bis 90 Minuten Ritual — Kopf, Nacken, Wasserstrahl, Bedampfung. Kein Friseur-Add-on.`,
      trust: '4,6★ bei Google · Japanisches Head Spa · Reyplatz 10, Baesweiler',
    },
    essence: {
      eyebrow: 'Der Unterschied',
      headline: home ? 'Kopfmassage vs. Head Spa — was du wirklich suchst.' : `Kopfmassage ${loc.city} — nicht 5 Minuten unter dem Waschbecken.`,
      paragraphs: home
        ? [
            'Viele suchen „Kopfmassage Baesweiler“ und finden kurze Behandlungen beim Friseur. Das ist nicht, was dein Nervensystem braucht.',
            'Wellnesstal ist ein dediziertes Head Spa Studio: Kopf-, Nacken- und Dekolleté-Massage — langsam, bewusst, 45 bis 90 Minuten. Plus Tiefenreinigung, Wasserstrahl und Bedampfung.',
            'Gäste sagen: tiefe Entspannung, Verspannungen lösen sich, der Kopf wird leise. Das ist Kopfmassage, die wirkt — direkt vor Ort.',
          ]
        : [
            `Viele suchen „Kopfmassage ${loc.city}“ und finden fünf Minuten beim Friseur oder Massage-Ketten. Das ist nicht, was dein Nervensystem braucht.`,
            `Wellnesstal in Baesweiler ist ein dediziertes Head Spa Studio — ${travelFrom(loc)}: Kopf-, Nacken- und Dekolleté-Massage, 45 bis 90 Minuten, plus Wasserstrahl und Bedampfung.`,
            `Gäste aus ${loc.city} und der Region sagen: tiefe Entspannung, Verspannungen lösen sich, der Kopf wird leise.`,
          ],
    },
    emotions: {
      eyebrow: 'Was unsere Kopfmassage ausmacht',
      headline: home ? 'Sechs Gründe für Kopfmassage bei Wellnesstal' : `Sechs Gründe — Kopfmassage nahe ${loc.city}`,
      items: [
        { word: 'Dauer', headline: '45–90 Min. — nicht 5.', text: 'Zeit für echte Berührung — ohne Eile, ohne Abfriss.' },
        { word: 'Berührung', headline: 'Kopf, Nacken, Dekolleté.', text: 'Verspannungen lösen sich — oft spürbar in den ersten Minuten.' },
        { word: 'Wasser', headline: 'Sanfter Wasserstrahl.', text: 'Beruhigend — tiefe Entspannung ab Minute eins.' },
        { word: 'Reinheit', headline: 'Kopfhaut atmet.', text: 'Bedampfung und Pflege — frisch, sauber, leicht.' },
        { word: 'Stille', headline: '100% abschalten.', text: 'Kein Salon-Trubel — ein Raum nur für Ritual.' },
        { word: 'Leichtigkeit', headline: home ? 'Leichter nach Hause.' : `Zurück nach ${loc.city} — leichter.`, text: 'Entspannung, die nachhallt — nicht nur eine Stunde.' },
      ],
    },
    localProof: { eyebrow: 'Stimmen', headline: 'Was Gäste über die Kopfmassage sagen', quotes: SHARED_QUOTES },
    journey: {
      eyebrow: 'Dein Besuch',
      headline: home ? 'Kopfmassage Baesweiler — bei uns' : `Kopfmassage ${loc.city} — bei Wellnesstal`,
      steps: [
        { num: '01', title: home ? 'Ankommen' : 'Anfahrt', text: home ? 'Reyplatz 10 — Kaffee, Stille, Empfang.' : `${loc.distance} — Reyplatz 10, Baesweiler.` },
        { num: '02', title: 'Massage', text: 'Kopf, Nacken, Dekolleté — langsam, präzise, lösend.' },
        { num: '03', title: 'Ritual', text: 'Reinigung, Wasserstrahl, Bedampfung — Kopfhaut und Geist.' },
        { num: '04', title: 'Abschluss', text: home ? 'Leichter nach Hause — entspannter im Kopf.' : `Leichter zurück nach ${loc.city}.` },
      ],
    },
    faq: [
      { q: 'Ist das nur Kopfmassage?', a: 'Massage ist Kern — Head Spa ergänzt Reinigung, Wasserstrahl und Bedampfung. Ganzheitlich, nicht nur 5 Minuten.' },
      { q: 'Hilft bei Nackenverspannung?', a: 'Viele Gäste berichten spürbare Linderung — individuell unterschiedlich.' },
      { q: 'Preise?', a: 'Basic 89€ (45 Min.), Beauty 119€ (60 Min.), Deluxe 149€ (90 Min.).' },
      { q: 'Termin online?', a: 'Ja — Wunschtermin finden, Verfügbarkeit sofort sichtbar.' },
    ],
    closing: {
      headline: home ? 'Kopfmassage Baesweiler — die du spürst, nicht nur buchst.' : `Kopfmassage ${loc.city} — 45–90 Min. Stille bei Wellnesstal.`,
      text: home ? '45–90 Min. Stille. Direkt vor Ort. Wunschtermin online.' : `${travelFrom(loc)}. Wunschtermin online.`,
      cta: 'Wunschtermin finden',
    },
  }
}

function buildWellness(_type: IntentType, loc: LocationContext): BuiltIntentPage {
  const slug = `wellness-${loc.slug}`
  const home = isHomeCity(loc.slug as LocationSlug)

  return {
    slug,
    path: `/${slug}`,
    seo: {
      title: `Wellness ${loc.city} | Head Spa Ritual — Ruhe ohne Therme — Wellnesstal`,
      description: home
        ? `Wellness in ${loc.city}: Kein Therme, kein Massenbetrieb — japanisches Head Spa Ritual. Basic 89€, Beauty 119€, Deluxe 149€. 4,6★ · Reyplatz 10.`
        : `Wellness nahe ${loc.city}: Kein Therme-Trubel — Head Spa Ritual mit Berührung und Stille. ${loc.distance}. 4,6★ · Wellnesstal Baesweiler.`,
    },
    city: loc.city,
    region: loc.region,
    distance: home ? 'Reyplatz 10 — Wellness, das nur Stille kennt' : loc.distance,
    nearby: loc.nearby,
    hero: {
      eyebrow: `Wellness · ${loc.city}`,
      headline: home ? 'Wellness ohne Hektik. Ruhe ohne Therme.' : `Wellness nahe ${loc.city} — ohne Therme, ohne Warteschlange.`,
      subline: home
        ? 'Du suchst Wellness in Baesweiler? Bei uns findest du kein Schwimmbad — sondern ein Ritual-Studio: Head Spa mit Berührung, Wasser, Dampf und Stille.'
        : `Du suchst Wellness in ${loc.city}? ${travelFrom(loc)} bei Wellnesstal: Head Spa Ritual — Berührung, Wasser, Dampf, kein Massenbetrieb.`,
      trust: '4,6★ bei Google · Dediziertes Head Spa Studio',
    },
    essence: {
      eyebrow: 'Wellness neu gedacht',
      headline: 'Nicht mehr Angebote — ein Gefühl.',
      paragraphs: home
        ? [
            'Wellness in Baesweiler bedeutet für viele: weit fahren, Therme, Massen, Lärm. Was fehlt, ist Stille — persönlich, tief, ohne Warteschlange.',
            'Wellnesstal ist kein Wellness-Center im klassischen Sinn. Es ist ein japanisches Head Spa Studio: 45 bis 90 Minuten bewusste Berührung, Kopfhautpflege, Bedampfung.',
            'Gäste sagen: abschalten, Geborgenheit, Leichtigkeit. Das ist Wellness, das ankommt.',
          ]
        : [
            `Wellness in ${loc.city} bedeutet oft: Therme, Massage-Kette, Massen, Lärm. Was fehlt, ist Stille — persönlich, tief, ohne Hektik.`,
            `Wellnesstal in Baesweiler — ${travelFrom(loc)}: japanisches Head Spa Studio, 45 bis 90 Minuten Ritual, kein Massenbetrieb.`,
            `Gäste aus ${loc.city} sagen nicht „schöne Behandlung“ — sie sagen: abschalten, Geborgenheit, Leichtigkeit.`,
          ],
    },
    emotions: {
      eyebrow: 'Was Wellness hier bedeutet',
      headline: 'Sechs Momente echter Ruhe',
      items: [
        { word: 'Ruhe', headline: 'Kein Massenbetrieb.', text: 'Ein Studio. Ein Ritual. Keine Therme-Hektik.' },
        { word: 'Berührung', headline: 'Bewusst. Langsam.', text: 'Kopf-, Nacken- und Dekolleté-Massage — heilend, nicht hastig.' },
        { word: 'Reinheit', headline: 'Kopfhaut atmet.', text: 'Tiefenreinigung und Dampf — frisch von innen.' },
        { word: 'Entspannung', headline: 'Tiefer als oberflächlich.', text: '100% präsent — 0% Pflicht.' },
        { word: 'Verwöhnung', headline: 'Deluxe: Kérastase & Babor.', text: '90 Minuten — das volle Ritual.' },
        { word: 'Leichtigkeit', headline: home ? 'Leichter gehen.' : `Zurück nach ${loc.city} — leichter.`, text: 'Wellness, das Tage nachwirkt.' },
      ],
    },
    localProof: {
      eyebrow: home ? 'Stimmen aus Baesweiler' : 'Stimmen aus der Region',
      headline: 'Was Gäste über ihr Wellness-Erlebnis sagen',
      quotes: [
        { text: 'Man wird mit offenen Armen empfangen — 90 Minuten pure Verwöhnung.', name: 'Jacqueline G.', location: 'Baesweiler' },
        { text: 'So entspannt war ich schon lange nicht mehr.', name: 'Jenny T.', location: loc.city },
      ],
    },
    journey: {
      eyebrow: 'Dein Wellness-Tag',
      headline: home ? 'So läuft Wellness bei Wellnesstal' : `Von ${loc.city} zur Stille`,
      steps: [
        { num: '01', title: home ? 'Ankommen' : 'Anfahrt', text: home ? 'Reyplatz 10 — Kaffee, Stille, Empfang.' : `${loc.distance} — Reyplatz 10, Baesweiler.` },
        { num: '02', title: 'Einschätzung', text: 'Individuell — Kopfhaut, Spannung, Bedarf.' },
        { num: '03', title: 'Ritual', text: 'Massage, Wasser, Dampf — 45–90 Min.' },
        { num: '04', title: 'Loslassen', text: home ? 'Leichter nach Hause — Wellness, das bleibt.' : `Leichter zurück nach ${loc.city}.` },
      ],
    },
    faq: [
      { q: 'Gibt es Sauna oder Pool?', a: 'Nein — wir sind spezialisiert auf Head Spa. Fokussiertes Ritual statt Therme.' },
      { q: 'Wellness Gutschein?', a: 'Ja — /gutschein oder /gutschein/wellness-geschenk. Stille verschenken.' },
      { q: 'Welche Pakete?', a: 'Basic 89€, Beauty 119€ (Beliebt), Deluxe 149€ mit Kérastase & Babor.' },
      { q: `Aus ${loc.city}?`, a: `${travelFrom(loc)} — gut erreichbar aus der gesamten Region.` },
    ],
    closing: {
      headline: home ? 'Wellness Baesweiler — Stille, die du spürst.' : `Wellness ${loc.city} — bei Wellnesstal in Baesweiler.`,
      text: 'Kein Therme. Kein Trubel. Nur Berührung, Reinheit, Entspannung. Wunschtermin online.',
      cta: 'Wunschtermin finden',
    },
  }
}

function buildEntspannung(_type: IntentType, loc: LocationContext): BuiltIntentPage {
  const slug = `entspannung-${loc.slug}`
  const home = isHomeCity(loc.slug as LocationSlug)

  return {
    slug,
    path: `/${slug}`,
    seo: {
      title: `Entspannung ${loc.city} | Head Spa Ritual — Wellnesstal Baesweiler`,
      description: home
        ? `Entspannung in ${loc.city}: Head Spa mit Massage, Wasser und Dampf. Kein Massenbetrieb — 45–90 Min. Stille. 4,6★ · Basic ab 89€.`
        : `Entspannung nahe ${loc.city}: Head Spa Ritual mit Massage, Wasser und Dampf. ${loc.distance}. Basic ab 89€. 4,6★ · Wellnesstal.`,
    },
    city: loc.city,
    region: loc.region,
    distance: home ? 'Reyplatz 10 — dein Studio für echte Ruhe' : loc.distance,
    nearby: loc.nearby,
    hero: {
      eyebrow: `Entspannung · ${loc.city}`,
      headline: home ? 'Entspannung, die du nicht teilen musst.' : `${loc.city} ist laut. Hier wird es still.`,
      subline: home
        ? 'Kein überfülltes Spa, kein Therme-Lärm — 45 bis 90 Minuten Head Spa Ritual: Berührung, Wasser, Dampf und Stille nur für dich.'
        : `Du suchst Entspannung in ${loc.city}? ${travelFrom(loc)} bei uns: 45 bis 90 Minuten Ritual — Berührung, Wasser, Dampf und ein Kopf, der endlich leise wird.`,
      trust: '4,6★ bei Google · Dediziertes Head Spa Studio',
    },
    essence: {
      eyebrow: home ? 'Entspannung in Baesweiler' : 'Entspannung neu definiert',
      headline: home ? 'Ein Ort. Ein Ritual. Eine Tiefe.' : 'Nicht oberflächlich — tiefer als erwartet.',
      paragraphs: home
        ? [
            'Entspannung ist kein Luxus — sie ist Notwendigkeit. Reyplatz 10: ein Studio, das nur Head Spa kennt.',
            'Kopfmassage, Bedampfung, Wasserstrahl — Gäste sagen: tiefe Entspannung ab der ersten Minute, der Kopf wird leise.',
            'Ob nach Feierabend, am Wochenende oder als Geschenk — hier darfst du ankommen, ohne zu leisten.',
          ]
        : [
            `Entspannung in ${loc.city} bedeutet oft: Therme, Massage-Kette, Warteschlange. Was fehlt: Stille ohne Hektik.`,
            `Wellnesstal in Baesweiler — ${travelFrom(loc)}: japanisches Ritual mit Kopfmassage, Bedampfung, Wasserstrahl.`,
            `Gäste aus ${loc.city} beschreiben: abschalten wie seit Monaten nicht — Leichtigkeit, die nachhallt.`,
          ],
    },
    emotions: {
      eyebrow: 'Was Entspannung hier bedeutet',
      headline: home ? 'Sechs Ebenen der Entspannung' : 'Sechs Momente der Ruhe',
      items: [
        { word: 'Abschalten', headline: '100% präsent.', text: 'Kein Bildschirm, kein Termin danach — nur Ritual.' },
        { word: 'Berührung', headline: 'Langsam. Tief.', text: 'Kopf, Nacken, Dekolleté — Verspannungen weichen.' },
        { word: 'Wasser', headline: 'Sanfter Strahl.', text: 'Beruhigend — Nervensystem runterfahren.' },
        { word: 'Stille', headline: 'Kopf leise.', text: 'Ein Raum, der Stille schützt — nicht nur verspricht.' },
        { word: 'Reinheit', headline: 'Kopfhaut atmet.', text: 'Tiefenreinigung und Dampf — frisch und leicht.' },
        { word: 'Leichtigkeit', headline: home ? 'Leichter gehen.' : `Zurück nach ${loc.city} — leichter.`, text: 'Entspannung, die nachhallt — Tage, nicht Minuten.' },
      ],
    },
    localProof: {
      eyebrow: 'Stimmen aus der Region',
      headline: 'Was Gäste über die Entspannung sagen',
      quotes: SHARED_QUOTES,
    },
    journey: {
      eyebrow: home ? 'Dein Ritual' : 'Dein Ausweg aus dem Trubel',
      headline: home ? 'Entspannung Baesweiler — bei uns' : `Von ${loc.city} zur Stille`,
      steps: [
        { num: '01', title: home ? 'Ankommen' : 'Anfahrt', text: home ? 'Reyplatz 10 — Kaffee, Stille.' : `${loc.distance} — Reyplatz 10, Baesweiler.` },
        { num: '02', title: 'Ankommen', text: home ? 'Empfangen werden — der Alltag bleibt draußen.' : 'Kaffee, Stille — der Alltag bleibt in der Stadt.' },
        { num: '03', title: 'Ritual', text: 'Massage, Wasser, Dampf — 45–90 Min.' },
        { num: '04', title: home ? 'Loslassen' : 'Rückkehr', text: home ? 'Leichter nach Hause.' : `Leichter zurück nach ${loc.city}.` },
      ],
    },
    faq: [
      { q: `Entspannung in ${loc.city} selbst?`, a: home ? 'Wellnesstal ist das spezialisierte Ritual-Studio in Baesweiler — ohne Therme-Hektik.' : `Wellnesstal in Baesweiler — ${travelFrom(loc)}, ohne Therme-Hektik.` },
      { q: 'Wie lange dauert es?', a: '45 Min. (Basic), 60 Min. (Beauty), 90 Min. (Deluxe).' },
      { q: 'Nach Feierabend?', a: 'Ja — Mo–Fr bis 19:00, Sa bis 16:00.' },
      { q: 'Gutschein für Entspannung?', a: 'Ja — /gutschein oder /gutschein/wellness-geschenk.' },
    ],
    closing: {
      headline: home ? 'Entspannung Baesweiler — Stille, die du spürst.' : `Entspannung ${loc.city} — bei Wellnesstal.`,
      text: 'Berührung, Stille, Reinheit. Wunschtermin online — du wirst den Unterschied spüren.',
      cta: 'Wunschtermin finden',
    },
  }
}

function buildGeschenk(_type: IntentType, loc: LocationContext): BuiltIntentPage {
  const slug = `geschenk-${loc.slug}`
  const home = isHomeCity(loc.slug as LocationSlug)

  return {
    slug,
    path: `/${slug}`,
    seo: {
      title: `Wellness Geschenk ${loc.city} | Head Spa Gutschein — Stille verschenken`,
      description: home
        ? `Wellness Geschenk ${loc.city}: Head Spa Gutschein — Berührung, Stille und echte Entspannung. Ab 89€, sofort online · Reyplatz 10.`
        : `Wellness Geschenk für ${loc.city}: Head Spa Gutschein — Stille verschenken statt Standard-Geschenk. ${loc.distance}. Ab 89€ · Wellnesstal.`,
    },
    city: loc.city,
    region: loc.region,
    distance: home ? 'Gutschein sofort per E-Mail — Reyplatz 10, Baesweiler' : `${loc.distance} — Gutschein sofort per E-Mail`,
    nearby: loc.nearby,
    hero: {
      eyebrow: `Geschenk · ${loc.city}`,
      headline: 'Kein Ding fürs Regal. Ein Gefühl fürs Nervensystem.',
      subline: home
        ? `Du suchst ein Wellness Geschenk in ${loc.city}? Head Spa Gutschein — 45 bis 90 Minuten Stille, Berührung und Ruhe. Sofort online.`
        : `Du suchst ein Wellness Geschenk in ${loc.city}? Schenke Head Spa — sofort online, ${travelFrom(loc)} erreichbar.`,
      trust: '4,6★ · Sofort per E-Mail · Print@Home · Das Geschenk, das bleibt',
    },
    essence: {
      eyebrow: 'Mehr als ein Gutschein',
      headline: 'Du schenkst Stille — nicht noch ein Produkt.',
      paragraphs: [
        'Parfum, Schokolade, Standard-Gutscheine — schön, aber vergessen. Was wirklich ankommt: ein Moment, in dem der Kopf leise wird.',
        `Head Spa Gutschein ist das perfekte Wellness Geschenk für ${loc.city} und Region: Berührung ohne Erwartung, Ruhe ohne schlechtes Gewissen.`,
        home
          ? 'Ob Geburtstag, Danke, Muttertag oder einfach so — du schenkst Zeit, in der niemand etwas leisten muss.'
          : `Beschenkte aus ${loc.city} fährt ${travelFrom(loc)} — und erlebt Stille, die bleibt.`,
      ],
    },
    emotions: {
      eyebrow: 'Sechs Worte des Geschenks',
      headline: 'Wellness Geschenk — auf eine leise Art',
      items: [
        { word: 'Wertschätzung', headline: 'Du siehst sie. Wirklich.', text: 'Nicht Pflichtgeschenk — ein Gefühl, das bleibt.' },
        { word: 'Berührung', headline: 'Sanft. Bewusst.', text: 'Kopf- und Nackenmassage — Verspannungen weichen.' },
        { word: 'Ruhe', headline: 'Endlich nichts leisten.', text: '45–90 Min. nur für die Beschenkte — oder den Beschenkten.' },
        { word: 'Stille', headline: 'Kopf leise.', text: '100% abschalten — Gäste beschreiben tiefe Entspannung.' },
        { word: 'Reinheit', headline: 'Frisch. Leicht.', text: 'Kopfhaut und Geist — erfrischt von innen.' },
        { word: 'Erinnerung', headline: 'Bleibt.', text: 'Monate später: „Das war das schönste Geschenk.“' },
      ],
    },
    localProof: {
      eyebrow: 'Stimmen',
      headline: 'Was Beschenkte sagen',
      quotes: [
        { text: 'Man wird mit offenen Armen empfangen — 90 Minuten pure Verwöhnung.', name: 'Jacqueline G.', location: 'Baesweiler' },
        { text: 'Bei der Behandlung konnte ich zu 100% entspannen — in Ruhe, ohne Hektik.', name: 'Lea W.', location: loc.city },
      ],
    },
    journey: {
      eyebrow: 'Geschenk schenken',
      headline: 'In Minuten bestellt — lange erinnert',
      steps: [
        { num: '01', title: 'Wählen', text: 'Basic, Beauty oder Deluxe — je nach Tiefe deines Geschenks.' },
        { num: '02', title: 'Bestellen', text: 'Sofort per E-Mail — ausdrucken oder digital senden.' },
        { num: '03', title: 'Überreichen', text: 'Mit wenigen Worten — das Geschenk sagt den Rest.' },
        { num: '04', title: 'Erleben', text: home ? 'Ritual in Baesweiler — Stille, Berührung, Ruhe.' : `${travelFrom(loc)} — Ritual bei Wellnesstal.` },
      ],
    },
    faq: [
      { q: `Wellness Geschenk für ${loc.city}?`, a: `Ja — Head Spa Gutschein online bestellen. ${home ? 'Direkt vor Ort in Baesweiler.' : `Beschenkte fährt ${travelFrom(loc)}.`}` },
      { q: 'Sofort verfügbar?', a: 'Ja — ideal auch last minute. Print@Home oder digital versenden.' },
      { q: 'Welches Paket schenken?', a: 'Beauty (119€) am beliebtesten — Deluxe (149€) für volles Ritual mit Kérastase & Babor.' },
      { q: 'Mehr Anlässe?', a: 'Ja — /gutschein mit Muttertag, Geburtstag, Hochzeit und mehr.' },
    ],
    closing: {
      headline: `Wellness Geschenk ${loc.city} — Stille, die ankommt.`,
      text: 'Head Spa Gutschein für Berührung, Ruhe und echte Wertschätzung. Jetzt bestellen.',
      cta: 'Gutschein bestellen',
    },
  }
}

const BUILDERS: Record<IntentType, (type: IntentType, loc: LocationContext) => BuiltIntentPage> = {
  kopfmassage: buildKopfmassage,
  wellness: buildWellness,
  entspannung: buildEntspannung,
  geschenk: buildGeschenk,
}

export function buildIntentPage(type: IntentType, loc: LocationContext): BuiltIntentPage {
  const base = BUILDERS[type](type, loc)
  return applyTopPageEnrichment(base)
}

/** Hand-crafted depth for highest-value SEO pages */
const TOP_PAGE_ENRICHMENTS: Partial<
  Record<
    string,
    {
      hero?: Partial<BuiltIntentPage['hero']>
      essence?: { extraParagraph?: string }
      faq?: BuiltIntentPage['faq']
    }
  >
> = {
  'kopfmassage-aachen': {
    hero: {
      trust: '4,6★ bei Google · 15 Min. von Aachen · Japanisches Head Spa Ritual',
    },
    essence: {
      extraParagraph:
        'Viele Gäste aus Aachen-Mitte, Burtscheid und Laurensberg buchen freitags nach Feierabend — der Übergang vom Stadttrubel zur Stille.',
    },
    faq: [
      {
        q: 'Kopfmassage Aachen Innenstadt — wie weit?',
        a: 'Ca. 15 Min. mit dem Auto von Aachen-Mitte. Reyplatz 10, 52499 Baesweiler — Parkplatz in der Nähe.',
      },
    ],
  },
  'wellness-aachen': {
    essence: {
      extraParagraph:
        'Im Gegensatz zur Carolus Therme oder Massage-Ketten: bei uns nur Head Spa — kein Massenbetrieb, kein Pool, keine Warteschlange. Nur Ritual.',
    },
    faq: [
      {
        q: 'Wellness Geschenk aus Aachen verschenken?',
        a: 'Ja — Gutschein online unter /geschenk-aachen oder /gutschein. Beschenkte fährt 15 Min. nach Baesweiler.',
      },
    ],
  },
  'entspannung-aachen': {
    faq: [
      {
        q: 'Entspannung nach Uni oder Klinik-Alltag in Aachen?',
        a: 'Ja — viele Gäste aus Aachen kommen gezielt zum Abschalten nach intensivem Alltag. Mo–Fr bis 19:00.',
      },
    ],
  },
  'kopfmassage-baesweiler': {
    hero: {
      trust: '4,6★ · Reyplatz 10 · Dein Kopfmassage-Studio vor der Haustür',
    },
    essence: {
      extraParagraph:
        'Parkplätze in der Nähe von Reyplatz — viele Gäste kommen zu Fuß aus Baesweiler-Mitte oder fahren kurz hin.',
    },
    faq: [
      {
        q: 'Kopfmassage direkt in Baesweiler?',
        a: 'Ja — Wellnesstal ist das dedizierte Head Spa Studio in Baesweiler, Reyplatz 10. Kein Friseur-Add-on, sondern 45–90 Min. Ritual.',
      },
      {
        q: 'Wo genau in Baesweiler?',
        a: 'Reyplatz 10, 52499 Baesweiler — im Herzen der Stadt. Termin online oder telefonisch.',
      },
    ],
  },
  'wellness-baesweiler': {
    hero: {
      trust: '4,6★ · Reyplatz 10 · Wellness ohne Therme — direkt in Baesweiler',
    },
    essence: {
      extraParagraph:
        'Kein Wellness-Hotel, keine Sauna-Kette — ein Ritual-Studio nur für Head Spa. Das unterscheidet uns von „Wellness Baesweiler“-Suchen, die oft Therme meinen.',
    },
    faq: [
      {
        q: 'Wellness in Baesweiler — Therme oder Head Spa?',
        a: 'Bei uns: japanisches Head Spa Ritual, 45–90 Min. Kein Pool, kein Massenbetrieb — nur Berührung, Wasser und Stille in Reyplatz 10.',
      },
    ],
  },
  'entspannung-baesweiler': {
    faq: [
      {
        q: 'Entspannung nach Feierabend in Baesweiler?',
        a: 'Ja — Mo–Fr bis 19:00. Viele Gäste aus Baesweiler buchen den Feierabend-Termin zum Abschalten.',
      },
    ],
  },
  'geschenk-baesweiler': {
    essence: {
      extraParagraph:
        'Ideal für Nachbarn, Familie und Freunde aus Baesweiler — Gutschein sofort per E-Mail, Beschenkte bucht selbst den Termin in Reyplatz 10.',
    },
    faq: [
      {
        q: 'Wellness Gutschein Baesweiler — vor Ort abholen?',
        a: 'Gutschein digital per E-Mail — Print@Home. Einlösung im Studio Reyplatz 10, direkt in Baesweiler.',
      },
    ],
  },
  'kopfmassage-wurselen': {
    hero: {
      trust: '4,6★ · ca. 10 Min. von Würselen · Dediziertes Head Spa Studio',
    },
    faq: [
      {
        q: 'Kopfmassage Würselen — wie weit nach Baesweiler?',
        a: 'Ca. 10 Min. mit dem Auto von Würselen nach Reyplatz 10, Baesweiler. Parkplatz in der Nähe.',
      },
    ],
  },
  'wellness-wurselen': {
    essence: {
      extraParagraph:
        'Von Würselen in wenigen Minuten — kein Therme-Trubel in Aachen nötig. Head Spa Ritual: persönlich, ruhig, ohne Warteschlange.',
    },
    faq: [
      {
        q: 'Wellness nahe Würselen ohne Therme?',
        a: 'Ja — Wellnesstal in Baesweiler: nur Head Spa, kein Massenbetrieb. Ca. 10 Min. Anfahrt von Würselen.',
      },
    ],
  },
  'entspannung-wurselen': {
    faq: [
      {
        q: 'Nach dem Alltag in Würselen abschalten?',
        a: 'Viele Gäste aus Würselen kommen gezielt nach Feierabend — ca. 10 Min. Anfahrt, dann 45–90 Min. Stille.',
      },
    ],
  },
  'geschenk-wurselen': {
    faq: [
      {
        q: 'Gutschein für jemanden aus Würselen?',
        a: 'Ja — online bestellen, sofort per E-Mail. Beschenkte fährt ca. 10 Min. nach Baesweiler, Reyplatz 10.',
      },
    ],
  },
  'kopfmassage-eschweiler': {
    hero: {
      trust: '4,6★ · ca. 12 Min. von Eschweiler · Japanisches Head Spa Ritual',
    },
    essence: {
      extraParagraph:
        'Viele Gäste aus Eschweiler kommen nach Schicht oder Büroalltag — der kurze Weg nach Baesweiler lohnt sich für echte Entspannung statt 5 Min. beim Friseur.',
    },
    faq: [
      {
        q: 'Kopfmassage Eschweiler — Anfahrt?',
        a: 'Ca. 12 Min. mit dem Auto von Eschweiler nach Reyplatz 10, Baesweiler.',
      },
    ],
  },
  'wellness-eschweiler': {
    faq: [
      {
        q: 'Wellness Eschweiler — Alternative zur Therme?',
        a: 'Head Spa bei Wellnesstal: persönlich, 45–90 Min., kein Massenbetrieb. Ca. 12 Min. von Eschweiler.',
      },
    ],
  },
  'entspannung-eschweiler': {
    faq: [
      {
        q: 'Entspannung nach Schicht in Eschweiler?',
        a: 'Ja — viele Gäste aus Eschweiler buchen gezielt zum Abschalten. Ca. 12 Min. Anfahrt, Mo–Fr bis 19:00.',
      },
    ],
  },
  'geschenk-eschweiler': {
    faq: [
      {
        q: 'Wellness Gutschein für Eschweiler verschenken?',
        a: 'Ja — Gutschein online, sofort per E-Mail. Beschenkte aus Eschweiler: ca. 12 Min. nach Baesweiler.',
      },
    ],
  },
  'kopfmassage-heinsberg': {
    hero: {
      trust: '4,6★ · ca. 25 Min. von Heinsberg · Regionales Head Spa Studio',
    },
    faq: [
      {
        q: 'Kopfmassage Heinsberg — lohnt sich die Anfahrt?',
        a: 'Ca. 25 Min. von Heinsberg nach Baesweiler — viele Gäste aus dem Kreis Heinsberg buchen bewusst das dedizierte Ritual-Studio statt kurzer Friseur-Massage.',
      },
    ],
  },
  'wellness-heinsberg': {
    essence: {
      extraParagraph:
        'Im Kreis Heinsberg fehlt oft echtes Wellness ohne Therme-Hotel — Wellnesstal in Baesweiler ist das nächste dedizierte Head Spa Studio der Region.',
    },
    faq: [
      {
        q: 'Wellness Kreis Heinsberg — wo Head Spa?',
        a: 'Wellnesstal, Reyplatz 10, Baesweiler — ca. 25 Min. von Heinsberg. Japanisches Ritual, kein Massenbetrieb.',
      },
    ],
  },
  'entspannung-heinsberg': {
    faq: [
      {
        q: 'Entspannung für Gäste aus Heinsberg?',
        a: 'Ja — ca. 25 Min. Anfahrt. Viele aus dem Kreis Heinsberg planen bewusst einen halben Tag Ruhe bei uns.',
      },
    ],
  },
  'geschenk-heinsberg': {
    faq: [
      {
        q: 'Gutschein für jemanden aus Heinsberg?',
        a: 'Ja — online bestellen, Print@Home. Beschenkte aus Heinsberg fährt ca. 25 Min. nach Baesweiler — ideal als Erlebnis-Geschenk.',
      },
    ],
  },
  'kopfmassage-herzogenrath': {
    hero: {
      trust: '4,6★ · ca. 15 Min. von Herzogenrath · Dediziertes Head Spa Studio',
    },
    faq: [
      {
        q: 'Kopfmassage Herzogenrath — Anfahrt nach Baesweiler?',
        a: 'Ca. 15 Min. mit dem Auto von Herzogenrath nach Reyplatz 10, Baesweiler. Parkplatz in der Nähe.',
      },
    ],
  },
  'wellness-herzogenrath': {
    essence: {
      extraParagraph:
        'Herzogenrath liegt an der Grenze zu NL und BE — viele Gäste schätzen bei uns die ruhige Alternative ohne Therme-Trubel: persönliches Head Spa Ritual in Baesweiler.',
    },
    faq: [
      {
        q: 'Wellness Herzogenrath — Head Spa statt Therme?',
        a: 'Ja — Wellnesstal in Baesweiler: 45–90 Min. Ritual, kein Massenbetrieb. Ca. 15 Min. von Herzogenrath.',
      },
    ],
  },
  'entspannung-herzogenrath': {
    faq: [
      {
        q: 'Entspannung für Gäste aus Herzogenrath?',
        a: 'Ja — ca. 15 Min. Anfahrt. Viele aus Herzogenrath und der Grenzregion buchen Feierabend-Termine zum Abschalten.',
      },
    ],
  },
  'geschenk-herzogenrath': {
    faq: [
      {
        q: 'Wellness Gutschein für Herzogenrath verschenken?',
        a: 'Ja — Gutschein online, sofort per E-Mail. Beschenkte aus Herzogenrath: ca. 15 Min. nach Baesweiler, Reyplatz 10.',
      },
    ],
  },
  'kopfmassage-alsdorf': {
    hero: {
      trust: '4,6★ · ca. 12 Min. von Alsdorf · Japanisches Head Spa Ritual',
    },
    faq: [
      {
        q: 'Kopfmassage Alsdorf — wie weit nach Baesweiler?',
        a: 'Ca. 12 Min. mit dem Auto von Alsdorf nach Reyplatz 10, Baesweiler.',
      },
    ],
  },
  'wellness-alsdorf': {
    faq: [
      {
        q: 'Wellness nahe Alsdorf ohne Massenbetrieb?',
        a: 'Head Spa bei Wellnesstal: persönlich, ruhig, 45–90 Min. Ca. 12 Min. von Alsdorf — kein Therme, kein Friseur-Add-on.',
      },
    ],
  },
  'entspannung-alsdorf': {
    faq: [
      {
        q: 'Nach Feierabend aus Alsdorf abschalten?',
        a: 'Ja — Mo–Fr bis 19:00. Ca. 12 Min. Anfahrt von Alsdorf, dann 45–90 Min. Stille bei uns.',
      },
    ],
  },
  'geschenk-alsdorf': {
    faq: [
      {
        q: 'Gutschein für jemanden aus Alsdorf?',
        a: 'Ja — online bestellen, Print@Home. Beschenkte aus Alsdorf fährt ca. 12 Min. nach Baesweiler.',
      },
    ],
  },
  'kopfmassage-stolberg': {
    hero: {
      trust: '4,6★ · ca. 15 Min. von Stolberg · Dediziertes Ritual-Studio',
    },
    essence: {
      extraParagraph:
        'Stolberg und Umgebung — viele Gäste fahren bewusst nach Baesweiler, weil hier Kopfmassage kein 5-Minuten-Add-on ist, sondern 45–90 Min. ganzheitliches Ritual.',
    },
    faq: [
      {
        q: 'Kopfmassage Stolberg — Anfahrt?',
        a: 'Ca. 15 Min. mit dem Auto von Stolberg nach Reyplatz 10, Baesweiler.',
      },
    ],
  },
  'wellness-stolberg': {
    faq: [
      {
        q: 'Wellness Stolberg — Alternative zur Therme?',
        a: 'Head Spa bei Wellnesstal in Baesweiler: persönlich, ohne Warteschlange. Ca. 15 Min. von Stolberg.',
      },
    ],
  },
  'entspannung-stolberg': {
    faq: [
      {
        q: 'Entspannung nach dem Alltag in Stolberg?',
        a: 'Viele Gäste aus Stolberg kommen gezielt zum Abschalten — ca. 15 Min. Anfahrt, Mo–Fr bis 19:00.',
      },
    ],
  },
  'geschenk-stolberg': {
    faq: [
      {
        q: 'Wellness Gutschein für Stolberg verschenken?',
        a: 'Ja — Gutschein sofort per E-Mail. Beschenkte aus Stolberg: ca. 15 Min. nach Baesweiler.',
      },
    ],
  },
  'kopfmassage-ubach-palenberg': {
    hero: {
      trust: '4,6★ · ca. 18 Min. von Übach-Palenberg · Regionales Head Spa',
    },
    faq: [
      {
        q: 'Kopfmassage Übach-Palenberg — Anfahrt?',
        a: 'Ca. 18 Min. mit dem Auto von Übach-Palenberg nach Reyplatz 10, Baesweiler.',
      },
    ],
  },
  'wellness-ubach-palenberg': {
    essence: {
      extraParagraph:
        'Zwischen Kreis Heinsberg und Städteregion Aachen — Wellnesstal in Baesweiler ist für Übach-Palenberg das nächste dedizierte Head Spa Studio ohne Therme-Hotel.',
    },
    faq: [
      {
        q: 'Wellness Übach-Palenberg — wo Head Spa?',
        a: 'Wellnesstal, Reyplatz 10, Baesweiler — ca. 18 Min. Japanisches Ritual, kein Massenbetrieb.',
      },
    ],
  },
  'entspannung-ubach-palenberg': {
    faq: [
      {
        q: 'Entspannung für Gäste aus Übach-Palenberg?',
        a: 'Ja — ca. 18 Min. Anfahrt. Ideal für einen halben Tag Ruhe abseits des Alltags.',
      },
    ],
  },
  'geschenk-ubach-palenberg': {
    faq: [
      {
        q: 'Gutschein für jemanden aus Übach-Palenberg?',
        a: 'Ja — online bestellen, Print@Home. Beschenkte fährt ca. 18 Min. nach Baesweiler.',
      },
    ],
  },
  'kopfmassage-geilenkirchen': {
    hero: {
      trust: '4,6★ · ca. 20 Min. von Geilenkirchen · Head Spa Studio Baesweiler',
    },
    faq: [
      {
        q: 'Kopfmassage Geilenkirchen — lohnt sich die Anfahrt?',
        a: 'Ca. 20 Min. von Geilenkirchen nach Baesweiler — viele Gäste aus dem Kreis Heinsberg buchen bewusst das dedizierte Ritual-Studio.',
      },
    ],
  },
  'wellness-geilenkirchen': {
    essence: {
      extraParagraph:
        'Im Kreis Heinsberg suchen viele „Wellness Geilenkirchen“ und finden Therme oder Hotel — bei uns: persönliches Head Spa Ritual, 45–90 Min., in Baesweiler.',
    },
    faq: [
      {
        q: 'Wellness Geilenkirchen — Head Spa in der Nähe?',
        a: 'Wellnesstal, Reyplatz 10, Baesweiler — ca. 20 Min. Kein Massenbetrieb, nur japanisches Kopfhaut-Ritual.',
      },
    ],
  },
  'entspannung-geilenkirchen': {
    faq: [
      {
        q: 'Entspannung für Gäste aus Geilenkirchen?',
        a: 'Ja — ca. 20 Min. Anfahrt. Viele planen bewusst einen Ruhetag bei uns statt oberflächlicher Massage.',
      },
    ],
  },
  'geschenk-geilenkirchen': {
    faq: [
      {
        q: 'Wellness Gutschein für Geilenkirchen verschenken?',
        a: 'Ja — Gutschein online, sofort per E-Mail. Beschenkte aus Geilenkirchen: ca. 20 Min. nach Baesweiler.',
      },
    ],
  },
  'geschenk-aachen': {
    essence: {
      extraParagraph:
        'Ideal für Kolleginnen, Freundinnen, Mama oder Partner — Gutschein sofort per E-Mail, Beschenkte bucht selbst den Wunschtermin.',
    },
    faq: [
      {
        q: 'Firmengeschenk für Team aus Aachen?',
        a: 'Ja — mehrere Gutscheine bestellen. Siehe auch /gutschein/firmen-geschenk und /gutschein/team-geschenk.',
      },
    ],
  },
}

function applyTopPageEnrichment(page: BuiltIntentPage): BuiltIntentPage {
  const enrichment = TOP_PAGE_ENRICHMENTS[page.slug]
  if (!enrichment) return page

  return {
    ...page,
    hero: enrichment.hero ? { ...page.hero, ...enrichment.hero } : page.hero,
    essence: enrichment.essence?.extraParagraph
      ? {
          ...page.essence,
          paragraphs: [...page.essence.paragraphs, enrichment.essence.extraParagraph],
        }
      : page.essence,
    faq: enrichment.faq ? [...page.faq, ...enrichment.faq] : page.faq,
  }
}
