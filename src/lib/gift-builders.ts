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

/** Fallback only — every BUILDERS entry should pass its own emotions. */
const DEFAULT_EMOTIONS: EmotionItem[] = [
  { word: 'Berührung', headline: 'Sanft. Bewusst.', text: 'Kopf- und Nackenmassage — Verspannungen weichen.' },
  { word: 'Stille', headline: 'Kopf leise.', text: '45–90 Min. abschalten — Gäste beschreiben tiefe Entspannung.' },
  { word: 'Ruhe', headline: 'Endlich nichts leisten.', text: 'Ein Raum ohne Erwartung — nur Ritual.' },
  { word: 'Reinheit', headline: 'Frisch. Leicht.', text: 'Kopfhaut und Geist — erfrischt von innen.' },
  { word: 'Wertschätzung', headline: 'Du siehst sie.', text: 'Ein Geschenk, das ankommt — nicht im Schrank landet.' },
  { word: 'Erinnerung', headline: 'Bleibt.', text: 'Monate später: „Das war das schönste Geschenk.“' },
]

/** Fallback only — every BUILDERS entry should pass its own journey. */
const DEFAULT_JOURNEY: JourneyStep[] = [
  { num: '01', title: 'Wählen', text: 'Basic (89€), Beauty (119€) oder Deluxe (149€) — je nach Tiefe.' },
  { num: '02', title: 'Bestellen', text: 'Sofort per E-Mail — Print@Home oder digital versenden.' },
  { num: '03', title: 'Überreichen', text: 'Mit wenigen Worten — das Geschenk sagt den Rest.' },
  { num: '04', title: 'Erleben', text: 'Termin in Baesweiler — Region Aachen & NRW.' },
]

const EMOTIONS_DIGITAL: EmotionItem[] = [
  { word: 'Sofort', headline: 'In Minuten da.', text: 'E-Gutschein per E-Mail — kein Versand, kein Warten.' },
  { word: 'Flexibilität', headline: 'Du wählst den Weg.', text: 'PDF, Print@Home oder digital weiterleiten — wie es passt.' },
  { word: 'Stille', headline: 'Digital bestellt. Analog gespürt.', text: 'Online kaufen — vor Ort 45–90 Min. wirklich abschalten.' },
  { word: 'Klarheit', headline: 'Kein Paket-Stress.', text: 'Bestellen, öffnen, verschenken — fertig.' },
  { word: 'Wertschätzung', headline: 'Trotz Tempo: echt.', text: 'Last minute, aber kein Standard — ein Ritual statt Ding.' },
  { word: 'Erinnerung', headline: 'Der Link bleibt.', text: 'Monate später: nicht die Mail — das Gefühl im Studio.' },
]

const EMOTIONS_KOPF: EmotionItem[] = [
  { word: 'Fokus', headline: 'Kopf im Zentrum.', text: 'Kein 5-Min.-Add-on — 45–90 Min. echte Kopfmassage.' },
  { word: 'Nacken', headline: 'Dort, wo Stress sitzt.', text: 'Kopfhaut, Nacken, Dekolleté — gezielt und ruhig.' },
  { word: 'Wasser', headline: 'Strömung statt Eile.', text: 'Wasserstrahl und Bedampfung tragen die Massage.' },
  { word: 'Stille', headline: 'Gedanken leise.', text: 'Der Raum hält — du musst nichts leisten.' },
  { word: 'Unterschied', headline: 'Studio, nicht Friseur.', text: 'Head Spa als Hauptgeschehen — nicht Anhang nach dem Waschen.' },
  { word: 'Erinnerung', headline: 'Spürbar danach.', text: 'Viele gehen leichter — und erzählen es monatelang.' },
]

const EMOTIONS_MASSAGE: EmotionItem[] = [
  { word: 'Berührung', headline: 'Hände mit Zeit.', text: 'Kopf und Nacken — bewusst, nicht hastig.' },
  { word: 'Tiefe', headline: 'Ritual, nicht Routine.', text: 'Massage plus Wasser und Dampf — mehr als Öl und Liege.' },
  { word: 'Wärme', headline: 'Körper kommt an.', text: 'Schultern lösen sich — ohne Sportstudio-Feeling.' },
  { word: 'Ruhe', headline: 'Kein Therapeuten-Jargon.', text: 'Einfach berührt werden — klar und wohltuend.' },
  { word: 'Überraschung', headline: 'Anders als erwartet.', text: 'Wer „Massage“ kennt, spürt hier eine neue Qualität.' },
  { word: 'Nachhall', headline: 'Bleibt im Körper.', text: 'Nicht nur „schön war’s“ — spürbar leichter gehen.' },
]

const EMOTIONS_ENTSPANNUNG: EmotionItem[] = [
  { word: 'Erlaubnis', headline: 'Nichts leisten.', text: 'Entspannung ohne Programm, ohne Smalltalk-Pflicht.' },
  { word: 'Nervensystem', headline: 'Runterfahren erlaubt.', text: '45–90 Min. — der Alltag darf draußen bleiben.' },
  { word: 'Stille', headline: 'Ohne Therme-Lärm.', text: 'Ruhiges Studio statt Massenbetrieb.' },
  { word: 'Atem', headline: 'Langsamer werden.', text: 'Berührung, Wasser, Dampf — der Körper folgt.' },
  { word: 'Leichtigkeit', headline: 'Danach anders.', text: 'Viele beschreiben: Kopf klarer, Schultern weicher.' },
  { word: 'Wertschätzung', headline: 'Ruhe statt Dinge.', text: 'Das Geschenk, das nicht im Regal landet.' },
]

const EMOTIONS_IDEE: EmotionItem[] = [
  { word: 'Idee', headline: 'Endlich etwas Neues.', text: 'Nicht Kerze, nicht Schal — ein Erlebnis mit Tiefe.' },
  { word: 'Überraschung', headline: 'Sie kennt das noch nicht.', text: 'Head Spa trifft genau die, die „alles haben“.' },
  { word: 'Persönlich', headline: 'Du hast hingeschaut.', text: 'Stille statt Standard — Wertschätzung ohne Protz.' },
  { word: 'Originalität', headline: 'Außergewöhnlich, klar.', text: 'Japanisches Ritual — 45 bis 90 Minuten.' },
  { word: 'Sicherheit', headline: 'Beauty trifft meist.', text: '119€ als Allrounder — Deluxe, wenn du beeindrucken willst.' },
  { word: 'Nachhall', headline: 'Monate später erzählt.', text: '„Das schönste Geschenk“ — oft genau diese Worte.' },
]

const EMOTIONS_ZEIT: EmotionItem[] = [
  { word: 'Zeit', headline: 'Geblockt. Geschützt.', text: '45–90 Min., in denen niemand etwas von ihr will.' },
  { word: 'Me Time', headline: 'Nur für sie.', text: 'Solo ab 89€ — echte Auszeit statt Kalenderlücke.' },
  { word: 'Zu zweit', headline: 'Gemeinsam ohne Ablenkung.', text: 'Partner ab 178€ — Zeit teilen, nicht teilen müssen.' },
  { word: 'Stille', headline: 'Kalender voll. Kopf leer.', text: 'Ein Termin gegen den Dauerbetrieb.' },
  { word: 'Achtsamkeit', headline: 'Ohne Vortrag.', text: 'Raum, Berührung, Atem — Selfcare, die greifbar ist.' },
  { word: 'Erinnerung', headline: 'Die Stunde, die zählt.', text: 'Nicht die Uhr — das Gefühl danach.' },
]

const EMOTIONS_SELF: EmotionItem[] = [
  { word: 'Empfangen', headline: 'Diesmal du.', text: 'Für Menschen, die immer geben — und selten Pause machen.' },
  { word: 'Self Care', headline: 'Kein Trend. Notwendigkeit.', text: 'Termin statt Vorsatz — der Körper merkt den Unterschied.' },
  { word: 'Pause', headline: 'Ohne Optimieren.', text: 'Nichts leisten, nichts performen — nur ankommen.' },
  { word: 'Nacken', headline: 'Last absetzen.', text: 'Kopf und Schultern dürfen weich werden.' },
  { word: 'Erlaubnis', headline: 'Schuldgefühle aus.', text: 'Self Care ohne Rechtfertigung — 45 bis 90 Minuten.' },
  { word: 'Nachhaltigkeit', headline: 'Wirkung bleibt.', text: 'Viele kommen leichter zurück in den Alltag.' },
]

const EMOTIONS_LUXUS: EmotionItem[] = [
  { word: 'Stille', headline: 'Luxus ohne Lautstärke.', text: '90 Min. Deluxe — keine Show, volle Aufmerksamkeit.' },
  { word: 'Pflege', headline: 'Kérastase & Babor.', text: 'Markenpflege, die du spürst — nicht nur liest.' },
  { word: 'Tiefe', headline: 'Maximale Volumenruhe.', text: 'Premium ohne Hotelkomplex und Crowds.' },
  { word: 'Qualität', headline: 'Billig fühlt sich falsch an.', text: 'Für Menschen, die echte Substanz erkennen.' },
  { word: 'Exklusivität', headline: 'Ein klarer Moment.', text: 'Solo 149€ — Partner Deluxe 298€ zu zweit.' },
  { word: 'Erinnerung', headline: 'Bleibt hochwertig.', text: 'Nicht Glitzer — ein Gefühl, das man behält.' },
]

const EMOTIONS_NRW: EmotionItem[] = [
  { word: 'Nähe', headline: 'Region statt Anonymität.', text: 'Baesweiler — gut erreichbar aus Aachen & Umgebung.' },
  { word: 'Lokal', headline: 'NRW, persönlich.', text: 'Kein Therme-Gedränge — ein Studio mit Gesicht.' },
  { word: 'Reichweite', headline: 'Digital überall.', text: 'Bundesweit verschenkbar — Ritual vor Ort.' },
  { word: 'Städte', headline: 'Kurz der Weg.', text: 'Würselen, Eschweiler, Heinsberg & mehr — nah genug.' },
  { word: 'Ruhe', headline: 'Gegen Massen-Wellness.', text: '45–90 Min. Berührung und Stille.' },
  { word: 'Heimatgefühl', headline: 'Schenken, das passt.', text: 'Regional gedacht — emotional klar.' },
]

const EMOTIONS_MAMA: EmotionItem[] = [
  { word: 'Danke', headline: 'Im Alltag gesagt.', text: 'Nicht nur am Feiertag — ein Zeichen zwischen den Tagen.' },
  { word: 'Pause', headline: 'Ohne „Kannst du kurz …?“', text: 'Zeit ohne Kinderlärm und Einkaufsliste.' },
  { word: 'Berührung', headline: 'Kopf darf weich werden.', text: 'Nacken, Wasser, Dampf — sie organisiert nichts.' },
  { word: 'Gesehen', headline: 'Mama ist dran.', text: 'Wertschätzung, die man einlösen kann.' },
  { word: 'Leichtigkeit', headline: 'Leichter nach Hause.', text: 'Viele Mütter kommen ruhiger zurück.' },
  { word: 'Erinnerung', headline: 'Sie behält es.', text: 'Nicht der Schal — die Stunde für sich.' },
]

const EMOTIONS_PAPA: EmotionItem[] = [
  { word: 'Überraschung', headline: 'Er erwartet es nicht.', text: 'Keine Krawatte — Erlaubnis abzuschalten.' },
  { word: 'Nacken', headline: 'Dort trägt er viel.', text: 'Kopf und Schultern — klar, ohne Kitsch.' },
  { word: 'Stille', headline: 'Ohne Smalltalk-Zwang.', text: '45–90 Min. — geschlechtsneutral und wohltuend.' },
  { word: 'Respekt', headline: 'Nicht peinlich.', text: 'Modernes Ritual — viele Papas kommen skeptisch, gehen ruhig.' },
  { word: 'Klarheit', headline: 'Geschenk mit Haltung.', text: 'Basic oder Beauty — treffsicher statt Werkzeugkasten.' },
  { word: 'Nachhall', headline: '„Hätte ich nicht erwartet.“', text: 'Genau dieser Satz macht den Gutschein stark.' },
]

const EMOTIONS_OMA: EmotionItem[] = [
  { word: 'Wärme', headline: 'Sanft und klar.', text: 'Herzlicher Empfang — ohne Hektik und Show.' },
  { word: 'Respekt', headline: 'Jahrzehnte gewürdigt.', text: 'Ein Danke von Kindern und Enkeln — spürbar.' },
  { word: 'Ruhe', headline: 'Raum zum Ankommen.', text: 'Basic oder Beauty — Tiefe, die passt.' },
  { word: 'Aufmerksamkeit', headline: 'Ganz bei ihr.', text: 'Viele Omas genießen besonders die Stille.' },
  { word: 'Leichtigkeit', headline: 'Weicher Abschnitt.', text: 'Geburtstag, Genesung oder einfach so.' },
  { word: 'Erinnerung', headline: 'Familienmoment.', text: 'Später erzählt man vom Gefühl — nicht vom Ding.' },
]

const EMOTIONS_OPA: EmotionItem[] = [
  { word: 'Würde', headline: 'Klar, nicht kitschig.', text: 'Auszeit ohne Wellness-Klischee-Druck.' },
  { word: 'Nacken', headline: 'Kopf im Fokus.', text: '45 Min. oder länger — echte Aufmerksamkeit.' },
  { word: 'Überraschung', headline: 'Oft skeptisch. Dann dankbar.', text: 'Massage, Wasser, Ruhe — wirkt stärker als erwartet.' },
  { word: 'Respekt', headline: 'Gesagt und gespürt.', text: 'Wertschätzung, die ankommt — nicht nur geschrieben.' },
  { word: 'Einfachheit', headline: 'Basic reicht oft.', text: '89€ Einstieg — Beauty, wenn du mehr Tiefe willst.' },
  { word: 'Erinnerung', headline: 'Die Enkel haben recht.', text: 'Ein Moment, den Opa behält.' },
]

const EMOTIONS_FREUND: EmotionItem[] = [
  { word: 'Freundschaft', headline: 'Du kennst ihn.', text: 'Nicht noch ein Gadget — Erholung für jemanden, der trägt.' },
  { word: 'Klarheit', headline: 'Modern, ohne Peinlichkeit.', text: 'Nacken, Kopf, Abschalten — geschlechtsneutral.' },
  { word: 'Danke', headline: 'Rücken freigehalten.', text: 'Für die Phase, in der er da war — jetzt Pause für ihn.' },
  { word: 'Entdeckung', headline: 'Viele kommen wieder.', text: 'Männer entdecken Head Spa oft erst durch den Gutschein.' },
  { word: 'Ruhe', headline: 'Endlich nichts müssen.', text: 'Basic oder Beauty — treffsicher und klar.' },
  { word: 'Bindung', headline: 'Du hast hingesehen.', text: 'Das Geschenk sagt: Ich merke, was du trägst.' },
]

const EMOTIONS_COUPLE: EmotionItem[] = [
  { word: 'Nähe', headline: 'Nebeneinander loslassen.', text: 'Zwei Rituale — Stille teilen, ohne Programm.' },
  { word: 'Zeit', headline: 'Endlich nur ihr.', text: 'Partner ab 178€ — Beauty 238€ als Favorit.' },
  { word: 'Stille', headline: 'Köpfe gemeinsam leise.', text: 'Keine Restaurant-Lautstärke — echte Pause zu zweit.' },
  { word: 'Verbindung', headline: 'Ohne Worte stark.', text: 'Erinnerung statt Vitrine — ein Gefühl, das bleibt.' },
  { word: 'Wertschätzung', headline: 'Jahre oder Ja.', text: 'Silberhochzeit, Verlobung, Jubiläum — Nähe schenken.' },
  { word: 'Tiefe', headline: 'Deluxe zu zweit.', text: 'Partner Deluxe 298€ — volles Ritual nebeneinander.' },
]

const EMOTIONS_SEASON: EmotionItem[] = [
  { word: 'Anders', headline: 'Nicht nur Süßes.', text: 'Nikolaus bringt Stille — statt nur Kalorien.' },
  { word: 'Sofort', headline: 'Noch am 5. da.', text: 'Last Minute per E-Mail — ausdrucken oder digital.' },
  { word: 'Advent', headline: 'Gegen den Trubel.', text: 'Für alle, die im Dezember alles geben.' },
  { word: 'Überraschung', headline: 'Stiefel neu gedacht.', text: 'Mama, Papa, Partner, Freundin — Ruhe statt Routine.' },
  { word: 'Pause', headline: 'Nach dem Fest einlösen.', text: 'Termin in Baesweiler, wenn der Lärm vorbei ist.' },
  { word: 'Wärme', headline: 'Dezember braucht Stille.', text: 'Basic 89€ oder Beauty 119€ — klar und herzlich.' },
]

const EMOTIONS_SURPRISE: EmotionItem[] = [
  { word: 'Wow', headline: 'Nicht erwartet.', text: 'Head Spa kennen viele noch nicht persönlich — genau deshalb stark.' },
  { word: 'Treffsicher', headline: 'Leise, aber klar.', text: 'Keine laute Show — ein „Das ist für mich.“' },
  { word: 'Tempo', headline: 'In zwei Minuten bestellt.', text: 'Digital oder Print — spontan überraschen.' },
  { word: 'Tiefe', headline: 'Beauty trifft meist.', text: '119€ Favorit — Deluxe für den großen Moment.' },
  { word: 'Zu zweit', headline: 'Überraschung für zwei.', text: 'Partner ab 178€ — wenn der Wow-Moment geteilt wird.' },
  { word: 'Nachhall', headline: 'Monate später noch da.', text: 'Nicht der Strauß — das Erlebnis, das nachklingt.' },
]

const JOURNEY_DIGITAL: JourneyStep[] = [
  { num: '01', title: 'Paket wählen', text: 'Basic 89€, Beauty 119€ oder Deluxe 149€ — online in Sekunden.' },
  { num: '02', title: 'Sofort erhalten', text: 'E-Gutschein per E-Mail — PDF & Print@Home inklusive.' },
  { num: '03', title: 'Digital überreichen', text: 'Weiterleiten, ausdrucken oder am Screen zeigen.' },
  { num: '04', title: 'Termin selbst wählen', text: 'Beschenkte bucht in Baesweiler — Region Aachen & NRW.' },
]

const JOURNEY_RITUAL: JourneyStep[] = [
  { num: '01', title: 'Tiefe wählen', text: '45, 60 oder 90 Min. — Basic, Beauty oder Deluxe.' },
  { num: '02', title: 'Gutschein sichern', text: 'Sofort online — digital oder zum Ausdrucken.' },
  { num: '03', title: 'Mit Sinn überreichen', text: 'Wenige Worte reichen — das Ritual spricht.' },
  { num: '04', title: 'Im Studio erleben', text: 'Reyplatz 10, Baesweiler — Kopf, Wasser, Stille.' },
]

const JOURNEY_RECIPIENT: JourneyStep[] = [
  { num: '01', title: 'Für wen entscheiden', text: 'Solo ab 89€ — oder Partner ab 178€, wenn es zu zweit sein soll.' },
  { num: '02', title: 'In Minuten bestellen', text: 'Per E-Mail da — ideal auch kurz vor dem Anlass.' },
  { num: '03', title: 'Persönlich übergeben', text: 'Mit einer Zeile Danke — der Rest ist Berührung.' },
  { num: '04', title: 'Ruhe einlösen', text: 'Termin in Baesweiler — wenn der Alltag es zulässt.' },
]

const JOURNEY_COUPLE: JourneyStep[] = [
  { num: '01', title: 'Partner-Paket wählen', text: '2× Basic 178€, Beauty 238€ (Beliebt) oder Deluxe 298€.' },
  { num: '02', title: 'Gemeinsam bestellen', text: 'Gutschein sofort per E-Mail — für euch oder als Geschenk.' },
  { num: '03', title: 'Zu zweit überreichen', text: 'Ein Moment vor dem Ritual — Nähe ohne Programm.' },
  { num: '04', title: 'Nebeneinander erleben', text: 'Zwei Plätze in Baesweiler — Stille teilen.' },
]

const JOURNEY_SELF: JourneyStep[] = [
  { num: '01', title: 'Dir (oder ihr) gönnen', text: 'Beauty 119€ als Allrounder — Deluxe 149€ bei tiefer Erschöpfung.' },
  { num: '02', title: 'Sofort klären', text: 'Gutschein online — Termin muss nicht heute sein.' },
  { num: '03', title: 'Termin schützen', text: 'Im Kalender blocken — Self Care wird verbindlich.' },
  { num: '04', title: 'Ankommen lassen', text: 'Reyplatz 10 — empfangen, nicht abgefertigt.' },
]

const JOURNEY_SEASON: JourneyStep[] = [
  { num: '01', title: 'Schnell wählen', text: 'Basic 89€ oder Beauty 119€ — klar und last-minute-tauglich.' },
  { num: '02', title: 'Heute bestellen', text: 'Sofort per E-Mail — auch am Vorabend noch rechtzeitig.' },
  { num: '03', title: 'Überraschend überreichen', text: 'Stiefel, Chat oder ausgedruckt — Stille statt nur Süßes.' },
  { num: '04', title: 'Später einlösen', text: 'Nach dem Trubel in Baesweiler — Region Aachen.' },
]

const JOURNEY_LUXUS: JourneyStep[] = [
  { num: '01', title: 'Premium wählen', text: 'Deluxe 149€ solo — oder Partner Deluxe 298€.' },
  { num: '02', title: 'Elegant bestellen', text: 'Sofort digital — wirkt hochwertig, ohne Versanddrama.' },
  { num: '03', title: 'Still überreichen', text: 'Wenige Worte, klare Haltung — Luxus darf leise sein.' },
  { num: '04', title: '90 Min. erleben', text: 'Kérastase & Babor — volle Tiefe in Baesweiler.' },
]

const JOURNEY_REGION: JourneyStep[] = [
  { num: '01', title: 'Regional schenken', text: 'Paket wählen — bundesweit digital verschenkbar.' },
  { num: '02', title: 'Online abschließen', text: 'Sofort per E-Mail — Print@Home oder weiterleiten.' },
  { num: '03', title: 'Lokal überreichen', text: 'Für Aachen, Baesweiler, Würselen & die Region.' },
  { num: '04', title: 'Vor Ort einlösen', text: 'Wellnesstal, Reyplatz 10 — nah aus ganz NRW West.' },
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
    emotionsEyebrow?: string
    emotionsHeadline?: string
    recipients?: BuiltGiftPage['recipients']
    faq?: BuiltGiftPage['faq']
    closing?: Partial<BuiltGiftPage['closing']>
    journey?: JourneyStep[]
    journeyEyebrow?: string
    journeyHeadline?: string
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
      eyebrow: opts?.emotionsEyebrow ?? 'Sechs Worte des Geschenks',
      headline: opts?.emotionsHeadline ?? 'Stille — auf eine leise Art',
      items: opts?.emotions ?? DEFAULT_EMOTIONS,
    },
    recipients: opts?.recipients,
    journey: {
      eyebrow: opts?.journeyEyebrow ?? 'Gutschein schenken',
      headline: opts?.journeyHeadline ?? 'In Minuten bestellt — lange erinnert',
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
        emotions: EMOTIONS_DIGITAL,
        emotionsEyebrow: 'Digital schenken in sechs Worten',
        emotionsHeadline: 'Online bestellt — spürbar erlebt',
        journey: JOURNEY_DIGITAL,
        journeyEyebrow: 'E-Gutschein Weg',
        journeyHeadline: 'Vom Klick zur Stille',
        faq: [
          { q: 'Gutschein online kaufen — wie schnell?', a: 'Sofort nach Bestellung per E-Mail — ideal auch last minute.' },
          { q: 'PDF oder Print@Home?', a: 'Ja — beides möglich. Digital weiterleiten oder ausdrucken.' },
          { q: 'E-Gutschein gültig?', a: 'Ja — Beschenkte wählt Paket und Termin selbst bei Wellnesstal Baesweiler.' },
          { q: 'Preise?', a: 'Basic 89€, Beauty 119€ (Beliebt), Deluxe 149€. Partner ab 178€.' },
          { q: 'Gutschein bestellen ohne Account?', a: 'Online über Treuepay — schnell und sicher.' },
        ],
        closing: {
          headline: 'Digital bestellt — analog gespürt.',
          text: 'E-Gutschein für Head Spa: sofort per E-Mail, einlösbar in Baesweiler. Ab 89€ — jetzt online sichern.',
          cta: 'Gutschein online bestellen',
        },
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
        emotions: EMOTIONS_KOPF,
        emotionsEyebrow: 'Was echte Kopfmassage meint',
        emotionsHeadline: 'Kein Add-on — ein eigenes Ritual',
        journey: JOURNEY_RITUAL,
        journeyEyebrow: 'Kopfmassage schenken',
        journeyHeadline: 'Von der Wahl bis zum Wasserstrahl',
        recipients: REGION_RECIPIENTS,
        faq: [
          { q: 'Ist das eine echte Kopfmassage — oder Friseur-Zusatz?', a: 'Echtes Head Spa Ritual: 45–90 Min. fokussiert auf Kopf, Nacken und Stille — kein 5-Minuten-Add-on.' },
          { q: 'Welches Paket für Kopfmassage?', a: 'Basic 89€ (45 Min.), Beauty 119€ (60 Min., Beliebt), Deluxe 149€ (90 Min.). Partner ab 178€.' },
          { q: 'Sofort verfügbar?', a: 'Ja — Gutschein sofort per E-Mail. Print@Home oder digital.' },
          { q: 'Wo einlösbar?', a: 'Wellnesstal, Reyplatz 10, Baesweiler — Region Aachen & NRW.' },
        ],
        closing: {
          headline: 'Kopfmassage, die den Namen verdient.',
          text: 'Gutschein für 45–90 Min. Head Spa — kein Friseur-Anhang. Ab 89€, sofort online, einlösbar in Baesweiler.',
        },
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
        emotions: EMOTIONS_MASSAGE,
        emotionsEyebrow: 'Massage, die anders ankommt',
        emotionsHeadline: 'Berührung mit Ritual — nicht nur Liege',
        journey: JOURNEY_RITUAL,
        journeyEyebrow: 'Massage-Gutschein Weg',
        journeyHeadline: 'Wählen, schenken, spüren',
        recipients: REGION_RECIPIENTS,
        faq: [
          { q: 'Welche Art Massage ist das?', a: 'Head Spa: achtsame Kopf- und Nackenmassage mit Wasser und Dampf — 45–90 Min. Ritual, kein klassisches Rücken-Öl-Setting.' },
          { q: 'Massage Gutschein Preise?', a: 'Basic 89€, Beauty 119€ (Beliebt), Deluxe 149€. Partner ab 178€.' },
          { q: 'Für Wen geeignet?', a: 'Für alle, die Verspannung im Nacken kennen oder einfach echte Auszeit brauchen — geschlechtsneutral.' },
          { q: 'Sofort online?', a: 'Ja — Gutschein sofort per E-Mail, Print@Home oder digital weiterleiten.' },
        ],
        closing: {
          headline: 'Massage schenken — mit Tiefe.',
          text: 'Head Spa Massage-Gutschein für Kopf und Nacken: ab 89€, Beauty 119€ als Favorit. Sofort digital, Reyplatz 10 Baesweiler.',
        },
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
        emotions: EMOTIONS_ENTSPANNUNG,
        emotionsEyebrow: 'Was Entspannung hier heißt',
        emotionsHeadline: 'Erlaubnis fürs Nervensystem',
        journey: JOURNEY_RITUAL,
        journeyEyebrow: 'Relax verschenken',
        journeyHeadline: 'Von der Idee zur echten Pause',
        recipients: REGION_RECIPIENTS,
        faq: [
          { q: 'Was genau schenke ich mit einem Entspannung Gutschein?', a: '45–90 Min. Head Spa Ritual: Stille, Massage, Wasser und Dampf — echte Erholung statt Ding.' },
          { q: 'Preise?', a: 'Basic 89€, Beauty 119€ (Beliebt), Deluxe 149€. Partner ab 178€.' },
          { q: 'Unterschied zu Massage-Gutschein?', a: 'Hier steht die Auszeit im Vordergrund — Massage ist Teil des Rituals, nicht der einzige Fokus.' },
          { q: 'Wo einlösbar?', a: 'Wellnesstal, Reyplatz 10, Baesweiler — Region Aachen & NRW.' },
        ],
        closing: {
          headline: 'Entspannung, die man einlösen kann.',
          text: 'Relax-Gutschein für Head Spa in Baesweiler: 45–90 Min. Stille statt Dinge. Ab 89€, Beauty 119€ — sofort online.',
        },
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
        emotions: EMOTIONS_IDEE,
        emotionsEyebrow: 'Warum diese Idee trägt',
        emotionsHeadline: 'Originell — ohne Umwege',
        journey: JOURNEY_RECIPIENT,
        journeyEyebrow: 'Idee umsetzen',
        journeyHeadline: 'In Minuten von Idee zu Geschenk',
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
        closing: {
          headline: 'Die Idee, die bleibt.',
          text: 'Besondere Geschenkidee: Head Spa Gutschein statt Kerze und Schal. Ab 89€, Beauty 119€ — sofort per E-Mail.',
        },
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
        emotions: EMOTIONS_ZEIT,
        emotionsEyebrow: 'Zeit in sechs Formen',
        emotionsHeadline: 'Mehr als Minuten auf der Uhr',
        journey: JOURNEY_SELF,
        journeyEyebrow: 'Auszeit schenken',
        journeyHeadline: 'Zeit blocken — Stille ermöglichen',
        faq: [
          { q: 'Solo oder zu zweit Zeit schenken?', a: 'Solo ab 89€. Partner-Pakete ab 178€ — Beauty zu zweit 238€ ist besonders beliebt.' },
          { q: 'Welches Paket für Me Time?', a: 'Beauty 119€ (60 Min.) trifft die meisten. Deluxe 149€ für tiefe Auszeit.' },
          { q: 'Sofort verfügbar?', a: 'Ja — Gutschein sofort per E-Mail.' },
          { q: 'Wo einlösen?', a: 'Wellnesstal, Reyplatz 10, Baesweiler — Region Aachen & NRW.' },
        ],
        closing: {
          headline: 'Zeit, die man wirklich spürt.',
          text: 'Me-Time-Gutschein: 45–90 Min. Head Spa — solo ab 89€, zu zweit ab 178€. Sofort online, Termin in Baesweiler.',
        },
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
        emotions: EMOTIONS_SELF,
        emotionsEyebrow: 'Self Care ohne Floskeln',
        emotionsHeadline: 'Empfangen — nicht nur funktionieren',
        journey: JOURNEY_SELF,
        journeyEyebrow: 'Selbstfürsorge greifbar',
        journeyHeadline: 'Vom Vorsatz zum Termin',
        faq: [
          { q: 'Selbstfürsorge Gutschein — für wen?', a: 'Für alle, die ständig geben — und selten empfangen. Auch als Geschenk an dich selbst.' },
          { q: 'Welches Paket?', a: 'Beauty 119€ ist der sichere Favorit. Basic 89€ zum Einstieg, Deluxe 149€ für tiefe Pause. Partner ab 178€.' },
          { q: 'Muss ich den Termin sofort buchen?', a: 'Nein — Gutschein sofort, Termin später, wenn es passt.' },
          { q: 'Wo?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
        closing: {
          headline: 'Self Care, die einen Termin hat.',
          text: 'Selbstfürsorge-Gutschein für Head Spa: Pause ohne Optimierungsdruck. Beauty 119€ — oder Deluxe 149€, wenn es tiefer sitzt.',
        },
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
        emotions: EMOTIONS_LUXUS,
        emotionsEyebrow: 'Quiet Luxury in sechs Worten',
        emotionsHeadline: 'Premium, das leise bleibt',
        journey: JOURNEY_LUXUS,
        journeyEyebrow: 'Deluxe schenken',
        journeyHeadline: 'Von der Wahl zu 90 Minuten Tiefe',
        faq: [
          { q: 'Luxus Gutschein — welches Paket?', a: 'Deluxe 149€ (90 Min.) mit Kérastase & Babor. Partner Deluxe 298€ zu zweit.' },
          { q: 'Premium Geschenk ohne Deluxe?', a: 'Beauty 119€ ist starker Allrounder — Deluxe, wenn du maximale Tiefe willst.' },
          { q: 'Partner-Pakete?', a: 'Partner ab 178€ — Beauty zu zweit 238€, Deluxe zu zweit 298€.' },
          { q: 'Sofort online?', a: 'Ja — sofort per E-Mail.' },
          { q: 'Wo?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
        closing: {
          headline: 'Luxus ohne Lautstärke.',
          text: 'Deluxe-Gutschein: 90 Min. mit Kérastase & Babor — solo 149€, zu zweit 298€. Sofort online, Studio Baesweiler.',
        },
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
        emotions: EMOTIONS_NRW,
        emotionsEyebrow: 'NRW — nah und persönlich',
        emotionsHeadline: 'Region schenken, nicht Anonymität',
        journey: JOURNEY_REGION,
        journeyEyebrow: 'Regionaler Gutschein-Weg',
        journeyHeadline: 'Digital bestellt — lokal erlebt',
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
        closing: {
          headline: 'Wellness für die Region — ohne Therme-Gedränge.',
          text: 'NRW-Gutschein für Head Spa in Baesweiler: nah aus Aachen & Umgebung. Ab 89€, sofort online verschenkbar.',
        },
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
        emotions: EMOTIONS_MAMA,
        emotionsEyebrow: 'Was Mama wirklich spürt',
        emotionsHeadline: 'Danke — einlösbar im Alltag',
        journey: JOURNEY_RECIPIENT,
        journeyEyebrow: 'Mama beschenken',
        journeyHeadline: 'Kurz bestellt — lange gespürt',
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
        closing: {
          headline: 'Für Mama — die gerade wieder alles trägt.',
          text: 'Head Spa Gutschein für Mama im Alltag: Beauty 119€ als Favorit. Sofort per E-Mail — einlösbar in Baesweiler.',
        },
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
        emotions: EMOTIONS_PAPA,
        emotionsEyebrow: 'Für Papa — ohne Kitsch',
        emotionsHeadline: 'Ruhe statt Werkzeug und Krawatte',
        journey: JOURNEY_RECIPIENT,
        journeyEyebrow: 'Papa beschenken',
        journeyHeadline: 'Klar wählen — überraschend ankommen',
        faq: [
          { q: 'Nehmen Papas Head Spa an?', a: 'Ja — viele kommen überrascht und kommen wieder. Geschlechtsneutral, Fokus Nacken und Kopf.' },
          { q: 'Welches Paket für Papa?', a: 'Basic 89€ oder Beauty 119€. Deluxe 149€ für besondere Anlässe. Partner ab 178€.' },
          { q: 'Vatertag oder Alltag?', a: 'Hier: Alltag & Geburtstag. Für den Feiertag siehe /gutschein/vatertag.' },
          { q: 'Sofort online?', a: 'Ja — Gutschein sofort per E-Mail.' },
        ],
        closing: {
          headline: 'Papa verdient Abschalten — nicht noch Dinge.',
          text: 'Gutschein für Papa: Head Spa mit Fokus Nacken und Kopf. Basic 89€ oder Beauty 119€ — sofort online.',
        },
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
        emotions: EMOTIONS_OMA,
        emotionsEyebrow: 'Für Oma — warm und klar',
        emotionsHeadline: 'Wertschätzung über Generationen',
        journey: JOURNEY_RECIPIENT,
        journeyEyebrow: 'Oma beschenken',
        journeyHeadline: 'Sanft bestellt — respektvoll erlebt',
        faq: [
          { q: 'Ist Head Spa für Oma geeignet?', a: 'Ja — sanft, ruhig, angepasst. Basic 89€ oder Beauty 119€ sind oft ideal.' },
          { q: 'Preise?', a: 'Basic 89€, Beauty 119€ (Beliebt), Deluxe 149€. Partner ab 178€ — z. B. mit Tochter oder Enkelin.' },
          { q: 'Sofort verfügbar?', a: 'Ja — Gutschein sofort per E-Mail.' },
          { q: 'Wo?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
        closing: {
          headline: 'Für Oma — ein Danke, das man spürt.',
          text: 'Sanfter Head Spa Gutschein für Oma: Basic 89€ oder Beauty 119€. Sofort per E-Mail, Studio Baesweiler.',
        },
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
        emotions: EMOTIONS_OPA,
        emotionsEyebrow: 'Für Opa — würdevoll klar',
        emotionsHeadline: 'Aufmerksamkeit statt praktischem Ding',
        journey: JOURNEY_RECIPIENT,
        journeyEyebrow: 'Opa beschenken',
        journeyHeadline: 'Einfach wählen — stark ankommen',
        faq: [
          { q: 'Nehmen Opas so ein Geschenk an?', a: 'Sehr oft ja — besonders, wenn es als echte Auszeit und nicht als „Wellness-Kram“ gerahmt wird.' },
          { q: 'Welches Paket?', a: 'Basic 89€ als Einstieg, Beauty 119€ für mehr Tiefe. Partner ab 178€.' },
          { q: 'Sofort online?', a: 'Ja — Gutschein sofort per E-Mail.' },
          { q: 'Wo einlösen?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
        closing: {
          headline: 'Für Opa — Ruhe mit Haltung.',
          text: 'Head Spa Gutschein für Opa: Fokus Kopf und Nacken. Basic 89€ als Einstieg — sofort online, Baesweiler.',
        },
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
        emotions: EMOTIONS_FREUND,
        emotionsEyebrow: 'Freundschaft in sechs Worten',
        emotionsHeadline: 'Klar schenken — ohne Gadget-Falle',
        journey: JOURNEY_RECIPIENT,
        journeyEyebrow: 'Freund beschenken',
        journeyHeadline: 'Modern wählen — echt ankommen',
        faq: [
          { q: 'Geschenk für Freund — kommt das an?', a: 'Ja — klar, modern, ohne Kitsch. Fokus Nacken, Kopf, Abschalten.' },
          { q: 'Welches Paket?', a: 'Basic 89€ oder Beauty 119€. Partner ab 178€, wenn ihr zu zweit kommt.' },
          { q: 'Sofort verfügbar?', a: 'Ja — Gutschein sofort per E-Mail.' },
          { q: 'Mehr Infos für Männer?', a: 'Siehe /ratgeber/head-spa-maenner.' },
        ],
        closing: {
          headline: 'Für den Freund, der selten pausiert.',
          text: 'Head Spa Gutschein für Freunde: modern, ohne Kitsch. Basic 89€ oder Beauty 119€ — sofort per E-Mail.',
        },
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
        emotions: EMOTIONS_COUPLE,
        emotionsEyebrow: '25 Jahre in sechs Gefühlen',
        emotionsHeadline: 'Silber — geteilte Stille',
        journey: JOURNEY_COUPLE,
        journeyEyebrow: 'Partner-Geschenk Weg',
        journeyHeadline: 'Gemeinsam wählen — nebeneinander loslassen',
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
          text: 'Partner-Gutschein zur Silberhochzeit: nebeneinander loslassen, lange erinnern. Ab 178€, Beauty 238€ — sofort online.',
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
        emotions: EMOTIONS_SEASON,
        emotionsEyebrow: 'Nikolaus — anders gedacht',
        emotionsHeadline: 'Stiefel mit Stille statt nur Süßem',
        journey: JOURNEY_SEASON,
        journeyEyebrow: 'Nikolaus last minute',
        journeyHeadline: 'Heute bestellt — morgen überrascht',
        faq: [
          { q: 'Noch rechtzeitig zum Nikolaus?', a: 'Ja — Gutschein sofort per E-Mail. Ideal am 5./6. Dezember.' },
          { q: 'Welches Paket?', a: 'Basic 89€ oder Beauty 119€. Partner ab 178€ zu zweit.' },
          { q: 'Für wen?', a: 'Mama, Papa, Partner, Freundin — alle, die Ruhe statt Süßes verdienen.' },
          { q: 'Wo einlösen?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
        closing: {
          headline: 'Nikolaus: Stille statt nur Schokolade.',
          text: 'Originelles Nikolaus-Geschenk — Head Spa Gutschein sofort per E-Mail. Ab 89€, einlösbar in Baesweiler nach dem Trubel.',
        },
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
        emotions: EMOTIONS_COUPLE,
        emotionsEyebrow: 'Zum Ja — sechs Gefühle',
        emotionsHeadline: 'Nähe vor dem Planungsrauschen',
        journey: JOURNEY_COUPLE,
        journeyEyebrow: 'Verlobungsgeschenk Weg',
        journeyHeadline: 'Partner wählen — gemeinsam ankommen',
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
          text: 'Partner-Gutschein zur Verlobung — Nähe ohne Trubel. Ab 178€, Beauty 238€ oder Deluxe 298€ — sofort online.',
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
        emotions: EMOTIONS_SURPRISE,
        emotionsEyebrow: 'Wow in sechs Worten',
        emotionsHeadline: 'Unerwartet — und lange erinnert',
        journey: JOURNEY_DIGITAL,
        journeyEyebrow: 'Überraschung in Minuten',
        journeyHeadline: 'Schnell bestellt — tief ankommend',
        faq: [
          { q: 'Gute Überraschung — wirklich?', a: 'Ja — Head Spa ist für viele neu und bleibt im Gedächtnis. Emotional starker Wow-Effekt.' },
          { q: 'Welches Paket?', a: 'Beauty 119€ als Favorit. Basic 89€, Deluxe 149€, Partner ab 178€.' },
          { q: 'Wie schnell?', a: 'Sofort per E-Mail — ideal last minute. Siehe auch /gutschein/last-minute.' },
          { q: 'Wo einlösen?', a: 'Wellnesstal, Reyplatz 10, Baesweiler.' },
        ],
        closing: {
          headline: 'Die Überraschung, die nachklingt.',
          text: 'Wow-Geschenk ohne Standard: Head Spa Gutschein ab 89€, Beauty 119€ als Favorit. Sofort digital — Termin später in Baesweiler.',
        },
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
