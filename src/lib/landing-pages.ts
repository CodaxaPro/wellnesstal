import giftAbschied from '../../content/gift/abschied.json'
import giftDanke from '../../content/gift/danke.json'
import giftFirmenGeschenk from '../../content/gift/firmen-geschenk.json'
import giftFreundin from '../../content/gift/freundin.json'
import giftGeburtstag from '../../content/gift/geburtstag.json'
import giftHeadSpa from '../../content/gift/head-spa.json'
import giftHochzeit from '../../content/gift/hochzeit.json'
import giftHub from '../../content/gift/hub.json'
import giftJubilaeum from '../../content/gift/jubilaeum.json'
import giftLastMinute from '../../content/gift/last-minute.json'
import giftMuttertag from '../../content/gift/muttertag.json'
import giftOstern from '../../content/gift/ostern.json'
import giftPaar from '../../content/gift/paar.json'
import giftRuhestand from '../../content/gift/ruhestand.json'
import giftTeamGeschenk from '../../content/gift/team-geschenk.json'
import giftValentinstag from '../../content/gift/valentinstag.json'
import giftVatertag from '../../content/gift/vatertag.json'
import giftWeihnachten from '../../content/gift/weihnachten.json'
import giftWellness from '../../content/gift/wellness-geschenk.json'
import guideBildschirmStress from '../../content/guide/bildschirm-stress.json'
import guideErsterBesuch from '../../content/guide/erster-besuch.json'
import guideGeschenkTipps from '../../content/guide/geschenk-tipps.json'
import guideHeadSpaHaltbarkeit from '../../content/guide/head-spa-haltbarkeit.json'
import guideHeadSpaKosten from '../../content/guide/head-spa-kosten.json'
import guideHeadSpaMaenner from '../../content/guide/head-spa-maenner.json'
import guideHeadSpaVsMassage from '../../content/guide/head-spa-vs-massage.json'
import guideHub from '../../content/guide/hub.json'
import guideKerastase from '../../content/guide/kerastase-head-spa.json'
import guideKopfhautPflege from '../../content/guide/kopfhaut-pflege.json'
import guidePartnerHeadSpa from '../../content/guide/partner-head-spa.json'
import guideSchlafStress from '../../content/guide/schlaf-stress.json'
import guideStressKopf from '../../content/guide/stress-kopf.json'
import guideWasIstHeadSpa from '../../content/guide/was-ist-head-spa.json'
import guideWellnessZuhause from '../../content/guide/wellness-zuhause.json'
import locationAachen from '../../content/locations/aachen.json'
import locationAlsdorf from '../../content/locations/alsdorf.json'
import locationBaesweiler from '../../content/locations/baesweiler.json'
import locationEschweiler from '../../content/locations/eschweiler.json'
import locationGeilenkirchen from '../../content/locations/geilenkirchen.json'
import locationHeinsberg from '../../content/locations/heinsberg.json'
import locationHerzogenrath from '../../content/locations/herzogenrath.json'
import locationStolberg from '../../content/locations/stolberg.json'
import locationUbachPalenberg from '../../content/locations/ubach-palenberg.json'
import locationWurselen from '../../content/locations/wurselen.json'
import packageBasic from '../../content/packages/basic.json'
import packageBeauty from '../../content/packages/beauty.json'
import packageDeluxe from '../../content/packages/deluxe.json'
import partnerPage from '../../content/partner.json'

import { buildGiftPage, BUILT_GIFT_SLUGS } from './gift-builders'
import { buildIntentPage } from './intent-builders'
import {
  getAllIntentSlugs,
  INTENT_TYPE_HINTS,
  INTENT_TYPE_LABELS,
  INTENT_TYPES,
  parseIntentSlug,
  type IntentSlug,
  type IntentType,
  type LocationSlug,
  LOCATION_SLUGS,
} from './seo-config'

export {
  getAllIntentSlugs,
  INTENT_TYPES,
  INTENT_TYPE_LABELS,
  INTENT_TYPE_HINTS,
  LOCATION_SLUGS,
  type IntentSlug,
  type IntentType,
  type LocationSlug,
} from './seo-config'

export const INTENT_SLUGS = getAllIntentSlugs()

export type EmotionItem = {
  word: string
  headline: string
  text: string
}

export type JourneyStep = {
  num: string
  title: string
  text: string
}

export type GiftPageContent = {
  slug: string
  path: string
  seo: { title: string; description: string }
  hero: { eyebrow: string; headline: string; subline: string; trust: string }
  essence: { eyebrow: string; headline: string; paragraphs: string[] }
  emotions: { eyebrow: string; headline: string; items: EmotionItem[] }
  recipients?: { eyebrow: string; headline: string; items: { title: string; text: string }[] }
  occasions?: {
    eyebrow: string
    headline: string
    intro: string
    items: { slug: string; label: string; hint: string }[]
  }
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
}

export type LocationPageContent = {
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

export type PackagePageContent = {
  slug: string
  path: string
  serviceId: string
  price: number
  duration: string
  seo: { title: string; description: string }
  hero: { eyebrow: string; headline: string; subline: string; trust: string }
  essence: { eyebrow: string; headline: string; paragraphs: string[] }
  emotions: { eyebrow: string; headline: string; items: EmotionItem[] }
  includes: { eyebrow: string; headline: string; items: string[] }
  forWhom: { eyebrow: string; headline: string; items: { title: string; text: string }[] }
  journey: { eyebrow: string; headline: string; steps: JourneyStep[] }
  faq: { q: string; a: string }[]
  closing: { headline: string; text: string; cta: string }
}

export type GuidePageContent = {
  slug: string
  path: string
  seo: { title: string; description: string }
  hero: { eyebrow: string; headline: string; subline: string }
  sections: { title: string; paragraphs: string[]; bullets?: string[] }[]
  keyTakeaways?: { headline: string; items: string[] }
  relatedLinks: { href: string; label: string; hint: string }[]
  faq: { q: string; a: string }[]
  closing: {
    headline: string
    text: string
    cta: string
    href?: string
    secondaryCta?: string
    secondaryHref?: string
  }
}

export type PartnerPageContent = {
  slug: string
  path: string
  seo: { title: string; description: string }
  hero: { eyebrow: string; headline: string; subline: string; trust: string }
  essence: { eyebrow: string; headline: string; paragraphs: string[] }
  emotions: { eyebrow: string; headline: string; items: EmotionItem[] }
  recipients?: { eyebrow: string; headline: string; items: { title: string; text: string }[] }
  journey: { eyebrow: string; headline: string; steps: JourneyStep[] }
  partnerPackages: {
    name: string
    price: number
    duration: string
    tagline: string
    featured?: boolean
  }[]
  faq: { q: string; a: string }[]
  closing: { headline: string; text: string; cta: string }
  whatsapp: string
  secondaryCta?: { href: string; label: string; text?: string }
  relatedLinks?: { href: string; label: string; hint: string }[]
}

export type GuideHubContent = {
  slug: string
  path: string
  seo: { title: string; description: string }
  hero: { eyebrow: string; headline: string; subline: string }
  articles: {
    eyebrow: string
    headline: string
    intro: string
    items: { slug: string; label: string; hint: string }[]
  }
  closing: { headline: string; text: string; cta: string }
}

const STATIC_GIFT_SLUGS = [
  'head-spa',
  'wellness-geschenk',
  'muttertag',
  'weihnachten',
  'valentinstag',
  'paar',
  'geburtstag',
  'freundin',
  'vatertag',
  'ostern',
  'last-minute',
  'danke',
  'hochzeit',
  'jubilaeum',
  'abschied',
  'firmen-geschenk',
  'ruhestand',
  'team-geschenk',
] as const

export const GIFT_SLUGS = [...STATIC_GIFT_SLUGS, ...BUILT_GIFT_SLUGS] as const

export const PACKAGE_SLUGS = ['basic', 'beauty', 'deluxe'] as const

export const GUIDE_SLUGS = [
  'was-ist-head-spa',
  'head-spa-vs-massage',
  'erster-besuch',
  'stress-kopf',
  'kopfhaut-pflege',
  'kerastase-head-spa',
  'bildschirm-stress',
  'partner-head-spa',
  'schlaf-stress',
  'geschenk-tipps',
  'head-spa-kosten',
  'head-spa-haltbarkeit',
  'head-spa-maenner',
  'wellness-zuhause',
] as const

export type GiftSlug = (typeof GIFT_SLUGS)[number]
export type StaticGiftSlug = (typeof STATIC_GIFT_SLUGS)[number]
export type PackageSlug = (typeof PACKAGE_SLUGS)[number]
export type GuideSlug = (typeof GUIDE_SLUGS)[number]

const giftPages: Record<StaticGiftSlug, GiftPageContent> = {
  'head-spa': giftHeadSpa as GiftPageContent,
  'wellness-geschenk': giftWellness as GiftPageContent,
  muttertag: giftMuttertag as GiftPageContent,
  weihnachten: giftWeihnachten as GiftPageContent,
  valentinstag: giftValentinstag as GiftPageContent,
  paar: giftPaar as GiftPageContent,
  geburtstag: giftGeburtstag as GiftPageContent,
  freundin: giftFreundin as GiftPageContent,
  vatertag: giftVatertag as GiftPageContent,
  ostern: giftOstern as GiftPageContent,
  'last-minute': giftLastMinute as GiftPageContent,
  danke: giftDanke as GiftPageContent,
  hochzeit: giftHochzeit as GiftPageContent,
  jubilaeum: giftJubilaeum as GiftPageContent,
  abschied: giftAbschied as GiftPageContent,
  'firmen-geschenk': giftFirmenGeschenk as GiftPageContent,
  ruhestand: giftRuhestand as GiftPageContent,
  'team-geschenk': giftTeamGeschenk as GiftPageContent,
}

const packagePages: Record<PackageSlug, PackagePageContent> = {
  basic: packageBasic as PackagePageContent,
  beauty: packageBeauty as PackagePageContent,
  deluxe: packageDeluxe as PackagePageContent,
}

const locationPages: Record<LocationSlug, LocationPageContent> = {
  aachen: locationAachen as LocationPageContent,
  baesweiler: locationBaesweiler as LocationPageContent,
  wurselen: locationWurselen as LocationPageContent,
  herzogenrath: locationHerzogenrath as LocationPageContent,
  eschweiler: locationEschweiler as LocationPageContent,
  alsdorf: locationAlsdorf as LocationPageContent,
  stolberg: locationStolberg as LocationPageContent,
  'ubach-palenberg': locationUbachPalenberg as LocationPageContent,
  geilenkirchen: locationGeilenkirchen as LocationPageContent,
  heinsberg: locationHeinsberg as LocationPageContent,
}

const guidePages: Record<GuideSlug, GuidePageContent> = {
  'was-ist-head-spa': guideWasIstHeadSpa as GuidePageContent,
  'head-spa-vs-massage': guideHeadSpaVsMassage as GuidePageContent,
  'erster-besuch': guideErsterBesuch as GuidePageContent,
  'stress-kopf': guideStressKopf as GuidePageContent,
  'kopfhaut-pflege': guideKopfhautPflege as GuidePageContent,
  'kerastase-head-spa': guideKerastase as GuidePageContent,
  'bildschirm-stress': guideBildschirmStress as GuidePageContent,
  'partner-head-spa': guidePartnerHeadSpa as GuidePageContent,
  'schlaf-stress': guideSchlafStress as GuidePageContent,
  'geschenk-tipps': guideGeschenkTipps as GuidePageContent,
  'head-spa-kosten': guideHeadSpaKosten as GuidePageContent,
  'head-spa-haltbarkeit': guideHeadSpaHaltbarkeit as GuidePageContent,
  'head-spa-maenner': guideHeadSpaMaenner as GuidePageContent,
  'wellness-zuhause': guideWellnessZuhause as GuidePageContent,
}

export function getGiftHub(): GiftPageContent {
  return giftHub as GiftPageContent
}

export function getGiftPage(slug: string): GiftPageContent | null {
  if (slug in giftPages) {
    return giftPages[slug as StaticGiftSlug]
  }
  const built = buildGiftPage(slug)
  return built ? (built as GiftPageContent) : null
}

export function getAllGiftPages(): GiftPageContent[] {
  return GIFT_SLUGS.map((slug) => getGiftPage(slug)!)
}

export function getPackagePage(slug: string): PackagePageContent | null {
  if (!(slug in packagePages)) return null
  return packagePages[slug as PackageSlug]
}

export function getAllPackagePages(): PackagePageContent[] {
  return PACKAGE_SLUGS.map((slug) => packagePages[slug])
}

export function getPartnerPage(): PartnerPageContent {
  return partnerPage as PartnerPageContent
}

export function getLocationPage(slug: string): LocationPageContent | null {
  if (!(slug in locationPages)) return null
  return locationPages[slug as LocationSlug]
}

export function getAllLocationPages(): LocationPageContent[] {
  return LOCATION_SLUGS.map((slug) => locationPages[slug])
}

export function getGuideHub(): GuideHubContent {
  return guideHub as GuideHubContent
}

export function getGuidePage(slug: string): GuidePageContent | null {
  if (!(slug in guidePages)) return null
  return guidePages[slug as GuideSlug]
}

export function getAllGuidePages(): GuidePageContent[] {
  return GUIDE_SLUGS.map((slug) => guidePages[slug])
}

export function getIntentPage(slug: string): LocationPageContent | null {
  const parsed = parseIntentSlug(slug)
  if (!parsed) return null
  const loc = locationPages[parsed.citySlug]
  if (!loc) return null
  return buildIntentPage(parsed.type, {
    slug: loc.slug,
    city: loc.city,
    region: loc.region,
    distance: loc.distance,
    nearby: loc.nearby,
  }) as LocationPageContent
}

export function getAllIntentPages(): LocationPageContent[] {
  return getAllIntentSlugs().map((slug) => getIntentPage(slug)!)
}

function cityLabel(slug: LocationSlug): string {
  return locationPages[slug].city
}

/** All intent SEO pages — 4 types × 10 cities */
export const INTENT_SEO_LINKS = getAllIntentSlugs().map((slug) => {
  const parsed = parseIntentSlug(slug)!
  return {
    slug,
    path: `/${slug}`,
    label: `${INTENT_TYPE_LABELS[parsed.type]} ${cityLabel(parsed.citySlug)}`,
    type: parsed.type,
    citySlug: parsed.citySlug,
  }
})

/** Intent links grouped by type — for footer & navigation */
export const INTENT_BY_TYPE = INTENT_TYPES.map((type) => ({
  type,
  label: INTENT_TYPE_LABELS[type],
  hint: INTENT_TYPE_HINTS[type],
  links: LOCATION_SLUGS.map((citySlug) => ({
    slug: `${type}-${citySlug}` as IntentSlug,
    path: `/${type}-${citySlug}`,
    label: cityLabel(citySlug),
    citySlug,
  })),
}))

export type RelatedLink = { href: string; label: string; hint: string }

/** Cross-links for city location pages — all 4 intent types per city */
export function getLocationRelatedLinks(slug: LocationSlug): RelatedLink[] {
  const city = locationPages[slug].city
  const cityIntents: RelatedLink[] = INTENT_TYPES.map((type) => ({
    href: `/${type}-${slug}`,
    label: `${INTENT_TYPE_LABELS[type]} ${city}`,
    hint: INTENT_TYPE_HINTS[type],
  }))

  const regional: RelatedLink[] = [
    { href: '/ratgeber/was-ist-head-spa', label: 'Was ist Head Spa?', hint: 'Ritual erklärt' },
    { href: '/ratgeber/head-spa-kosten', label: 'Head Spa Preise', hint: 'Basic · Beauty · Deluxe' },
    { href: '/gutschein', label: 'Gutschein verschenken', hint: 'Stille schenken' },
  ]

  if (slug === 'aachen') {
    return [
      {
        href: '/headspa-aachen',
        label: 'Head Spa Aachen — Ratgeber',
        hint: 'Anfahrt, Therme, Friseur-Vergleich',
      },
      { href: '/headspa/partner', label: 'Zu zweit', hint: 'Partner-Termin' },
      ...cityIntents,
      ...regional,
    ]
  }

  return [...cityIntents, ...regional]
}

/** Cross-links for intent SEO pages */
export function getIntentRelatedLinks(slug: IntentSlug): RelatedLink[] {
  const parsed = parseIntentSlug(slug)
  if (!parsed) {
    return [
      { href: '/headspa', label: 'Head Spa entdecken', hint: 'Ritual' },
      { href: '/gutschein', label: 'Gutschein verschenken', hint: 'Stille schenken' },
    ]
  }

  const { type, citySlug } = parsed
  const city = locationPages[citySlug].city
  const otherTypes = INTENT_TYPES.filter((t) => t !== type)

  const sameCity: RelatedLink[] = [
    { href: `/head-spa-${citySlug}`, label: `Head Spa ${city}`, hint: 'Stadtseite' },
    ...otherTypes.map((t) => ({
      href: `/${t}-${citySlug}`,
      label: `${INTENT_TYPE_LABELS[t]} ${city}`,
      hint: INTENT_TYPE_HINTS[t],
    })),
  ]

  if (citySlug === 'aachen') {
    sameCity.unshift({
      href: '/headspa-aachen',
      label: 'Head Spa Aachen Guide',
      hint: 'Longform · Anfahrt & Vergleich',
    })
  }

  const extras: RelatedLink[] =
    type === 'geschenk'
      ? [
          { href: '/gutschein', label: 'Gutschein Hub', hint: 'Alle Anlässe' },
          { href: '/ratgeber/geschenk-tipps', label: 'Geschenk Tipps', hint: 'Paket wählen' },
        ]
      : type === 'entspannung'
        ? [{ href: '/ratgeber/stress-kopf', label: 'Stress & Kopf', hint: 'Ratgeber' }]
        : []

  return [...sameCity, ...extras]
}

/** Primary city pages linked from homepage local SEO strip */
export const LOCAL_SEO_LINKS = [
  { slug: 'baesweiler', label: 'Baesweiler' },
  { slug: 'aachen', label: 'Aachen' },
  { slug: 'wurselen', label: 'Würselen' },
  { slug: 'alsdorf', label: 'Alsdorf' },
  { slug: 'eschweiler', label: 'Eschweiler' },
  { slug: 'stolberg', label: 'Stolberg' },
  { slug: 'herzogenrath', label: 'Herzogenrath' },
  { slug: 'ubach-palenberg', label: 'Übach-Palenberg' },
  { slug: 'geilenkirchen', label: 'Geilenkirchen' },
  { slug: 'heinsberg', label: 'Heinsberg' },
] as const
