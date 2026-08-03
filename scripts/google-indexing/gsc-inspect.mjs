#!/usr/bin/env node
/**
 * Google Search Console URL Inspection + sitemap status.
 *
 * Requires Search Console API enabled on the GCP project:
 *   https://console.developers.google.com/apis/api/searchconsole.googleapis.com/overview?project=1091329953734
 *
 * Service account must be Owner/Full on the GSC property.
 *
 * Usage:
 *   node gsc-inspect.mjs
 *   node gsc-inspect.mjs https://www.wellnesstal.de/headspa
 *   URLS_FILE=./urls.txt node gsc-inspect.mjs --all
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { google } from 'googleapis'

const DIR = dirname(fileURLToPath(import.meta.url))
const KEY_FILE = process.env.GOOGLE_SERVICE_ACCOUNT_KEY ?? join(DIR, 'service-account.json')
const SITE_URL = process.env.GSC_SITE_URL ?? 'https://www.wellnesstal.de/'
const URLS_FILE = process.env.URLS_FILE ?? join(DIR, 'urls.txt')
const DELAY_MS = Number(process.env.REQUEST_DELAY_MS ?? 400)

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function loadUrlsFromFile() {
  return readFileSync(URLS_FILE, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
}

function printStatus(url, r) {
  console.log(`\n${url}`)
  console.log(`  verdict:         ${r?.verdict ?? '—'}`)
  console.log(`  coverage:        ${r?.coverageState ?? '—'}`)
  console.log(`  robotsTxt:       ${r?.robotsTxtState ?? '—'}`)
  console.log(`  indexing:        ${r?.indexingState ?? '—'}`)
  console.log(`  pageFetch:       ${r?.pageFetchState ?? '—'}`)
  console.log(`  lastCrawl:       ${r?.lastCrawlTime ?? '—'}`)
  console.log(`  userCanonical:   ${r?.userCanonical ?? '—'}`)
  console.log(`  googleCanonical: ${r?.googleCanonical ?? '—'}`)
  if (r?.sitemap?.length) console.log(`  sitemap:         ${r.sitemap.join(', ')}`)
}

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--all')
  const inspectAll = process.argv.includes('--all')

  if (!existsSync(KEY_FILE)) {
    console.error(`Missing key: ${KEY_FILE}`)
    process.exit(1)
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE,
    scopes: [
      'https://www.googleapis.com/auth/webmasters.readonly',
      'https://www.googleapis.com/auth/webmasters',
    ],
  })
  const searchconsole = google.searchconsole({ version: 'v1', auth })

  console.log('=== Google Search Console Inspect ===\n')
  console.log(`Property: ${SITE_URL}`)

  try {
    const sites = await searchconsole.sites.list()
    const list = sites.data.siteEntry ?? []
    console.log(`Accessible properties: ${list.length}`)
    list.forEach((s) => console.log(`  · ${s.siteUrl} (${s.permissionLevel})`))
  } catch (e) {
    const msg = e.response?.data?.error?.message ?? e.message
    console.error('\n✗ sites.list failed:', msg)
    if (String(msg).includes('has not been used') || String(msg).includes('disabled')) {
      console.error('\nEnable Search Console API:')
      console.error(
        '  https://console.developers.google.com/apis/api/searchconsole.googleapis.com/overview?project=1091329953734',
      )
    }
    process.exit(1)
  }

  try {
    const sm = await searchconsole.sitemaps.list({ siteUrl: SITE_URL })
    console.log('\n=== Sitemaps ===')
    for (const s of sm.data.sitemap ?? []) {
      console.log(`  ${s.path}`)
      console.log(`    lastSubmitted: ${s.lastSubmitted ?? '—'}`)
      console.log(`    lastDownloaded: ${s.lastDownloaded ?? '—'}`)
      console.log(`    warnings: ${s.warnings ?? 0}  errors: ${s.errors ?? 0}`)
      console.log(`    isPending: ${s.isPending ?? false}`)
    }
  } catch (e) {
    console.error('sitemaps.list:', e.response?.data?.error?.message ?? e.message)
  }

  let urls = args.filter((a) => a.startsWith('http'))
  if (inspectAll) urls = loadUrlsFromFile()
  if (!urls.length) {
    urls = [
      'https://www.wellnesstal.de/',
      'https://www.wellnesstal.de/headspa',
      'https://www.wellnesstal.de/gutschein',
      'https://www.wellnesstal.de/ratgeber',
      'https://www.wellnesstal.de/wellness-aachen',
      'https://www.wellnesstal.de/wellness-baesweiler',
      'https://www.wellnesstal.de/kopfmassage-aachen',
      'https://www.wellnesstal.de/head-spa-aachen',
    ]
  }

  console.log(`\n=== URL Inspection (${urls.length}) ===`)
  const summary = { indexed: 0, notIndexed: 0, error: 0 }
  const notIndexed = []

  for (let i = 0; i < urls.length; i++) {
    const inspectionUrl = urls[i]
    try {
      const res = await searchconsole.urlInspection.index.inspect({
        requestBody: { inspectionUrl, siteUrl: SITE_URL, languageCode: 'de' },
      })
      const r = res.data.inspectionResult?.indexStatusResult
      printStatus(inspectionUrl, r)
      const cov = r?.coverageState ?? ''
      const c = cov.toLowerCase()
      const isIndexed =
        /gesendet und indexiert|submitted and indexed/i.test(cov) ||
        (c.includes('indexiert') && !c.includes('nicht')) ||
        (c.includes('indexed') && !c.includes('not'))
      if (isIndexed) summary.indexed++
      else {
        summary.notIndexed++
        notIndexed.push({ url: inspectionUrl, coverage: r?.coverageState })
      }
    } catch (e) {
      summary.error++
      console.error(`\n${inspectionUrl}`)
      console.error(`  ERROR: ${e.response?.data?.error?.message ?? e.message}`)
    }
    if (i < urls.length - 1) await sleep(DELAY_MS)
  }

  console.log('\n=== Summary ===')
  console.log(`Indexed:     ${summary.indexed}`)
  console.log(`Not indexed: ${summary.notIndexed}`)
  console.log(`Errors:      ${summary.error}`)
  if (notIndexed.length) {
    console.log('\nNot indexed URLs:')
    notIndexed.forEach((n) => console.log(`  · ${n.coverage}: ${n.url}`))
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
