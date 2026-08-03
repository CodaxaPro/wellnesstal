#!/usr/bin/env node
/**
 * Generates urls.txt from the same URL set as src/app/sitemap.ts
 * Run: node scripts/google-indexing/generate-urls.mjs
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..')
const BASE = process.env.SITE_URL ?? 'https://www.wellnesstal.de'

const LOCATION_SLUGS = [
  'aachen', 'baesweiler', 'wurselen', 'herzogenrath', 'eschweiler',
  'alsdorf', 'stolberg', 'ubach-palenberg', 'geilenkirchen', 'heinsberg',
]
const INTENT_TYPES = ['kopfmassage', 'wellness', 'entspannung', 'geschenk']
const PACKAGE_SLUGS = ['basic', 'beauty', 'deluxe']
const GUIDE_SLUGS = [
  'was-ist-head-spa', 'head-spa-vs-massage', 'erster-besuch', 'stress-kopf',
  'kopfhaut-pflege', 'kerastase-head-spa', 'bildschirm-stress', 'partner-head-spa',
  'schlaf-stress', 'geschenk-tipps', 'head-spa-kosten', 'head-spa-haltbarkeit',
  'head-spa-maenner', 'wellness-zuhause',
]
const GIFT_SLUGS = [
  'head-spa', 'wellness-geschenk', 'muttertag', 'weihnachten', 'valentinstag',
  'paar', 'geburtstag', 'freundin', 'vatertag', 'ostern', 'last-minute', 'danke',
  'hochzeit', 'jubilaeum', 'abschied', 'firmen-geschenk', 'ruhestand', 'team-geschenk',
  'online', 'kopfmassage', 'massage', 'entspannung', 'geschenkidee', 'zeit-schenken',
  'selbstfuersorge', 'luxus', 'wellness-nrw', 'fuer-mama', 'fuer-papa', 'fuer-oma',
  'fuer-opa', 'fuer-freund', 'silberhochzeit', 'nikolaus', 'verlobung', 'ueberraschung',
]

const CUSTOM_MONEY_SLUGS = [
  'deluxe-beauty-baesweiler',
  'deluxe-hair-beauty',
  'geschichte',
]

const urls = [
  BASE,
  `${BASE}/headspa`,
  ...PACKAGE_SLUGS.map((s) => `${BASE}/headspa/${s}`),
  `${BASE}/gutschein`,
  ...GIFT_SLUGS.map((s) => `${BASE}/gutschein/${s}`),
  ...LOCATION_SLUGS.map((s) => `${BASE}/head-spa-${s}`),
  `${BASE}/ratgeber`,
  ...GUIDE_SLUGS.map((s) => `${BASE}/ratgeber/${s}`),
  ...INTENT_TYPES.flatMap((t) => LOCATION_SLUGS.map((c) => `${BASE}/${t}-${c}`)),
  ...CUSTOM_MONEY_SLUGS.map((s) => `${BASE}/${s}`),
  `${BASE}/impressum`,
  `${BASE}/datenschutz`,
]

const out = join(dirname(fileURLToPath(import.meta.url)), 'urls.txt')
const body = `# Wellnesstal sitemap URLs (${urls.length} total)\n# Generated ${new Date().toISOString()}\n${urls.join('\n')}\n`
writeFileSync(out, body, 'utf8')
console.log(`Wrote ${urls.length} URLs to ${out}`)
