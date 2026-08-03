#!/usr/bin/env node
/**
 * Pre-index SEO audit: robots.txt, noindex meta/header, canonical self-reference.
 * Run: node scripts/google-indexing/audit-seo.mjs
 * Optional: URLS_FILE=./urls.txt node scripts/google-indexing/audit-seo.mjs
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const DIR = dirname(fileURLToPath(import.meta.url))
const URLS_FILE = process.env.URLS_FILE ?? join(DIR, 'urls.txt')
const SITE_ORIGIN = process.env.SITE_URL ?? 'https://www.wellnesstal.de'
const CONCURRENCY = Number(process.env.AUDIT_CONCURRENCY ?? 8)
const FETCH_TIMEOUT_MS = Number(process.env.FETCH_TIMEOUT_MS ?? 15000)

function loadUrls() {
  return readFileSync(URLS_FILE, 'utf8')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('#'))
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchWithTimeout(url, opts = {}) {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS)
  try {
    return await fetch(url, { ...opts, signal: ctrl.signal, redirect: 'follow' })
  } finally {
    clearTimeout(t)
  }
}

function parseRobotsDisallow(robotsTxt, path) {
  const lines = robotsTxt.split('\n').map((l) => l.trim())
  let applies = false
  const disallows = []
  for (const line of lines) {
    if (/^user-agent:\s*\*/i.test(line)) applies = true
    if (/^user-agent:/i.test(line) && !/\*/.test(line)) applies = false
    const m = line.match(/^disallow:\s*(.*)$/i)
    if (applies && m) disallows.push(m[1].trim())
  }
  for (const rule of disallows) {
    if (!rule) continue
    if (rule === '/') return true
    if (path.startsWith(rule)) return true
  }
  return false
}

function extractMetaRobots(html) {
  const m = html.match(/<meta[^>]+name=["']robots["'][^>]*>/i)
  if (!m) return null
  const content = m[0].match(/content=["']([^"']+)["']/i)
  return content ? content[1].toLowerCase() : null
}

function extractCanonical(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)
  if (!m) return null
  const href = m[0].match(/href=["']([^"']+)["']/i)
  return href ? href[1] : null
}

function normalizeUrl(u) {
  try {
    const url = new URL(u)
    url.hash = ''
    if (url.pathname !== '/' && url.pathname.endsWith('/')) {
      url.pathname = url.pathname.slice(0, -1)
    }
    return url.href
  } catch {
    return u
  }
}

async function auditUrl(url) {
  const issues = []
  const res = await fetchWithTimeout(url, {
    headers: { 'User-Agent': 'Wellnesstal-SEO-Audit/1.0' },
  })
  const xRobots = (res.headers.get('x-robots-tag') ?? '').toLowerCase()
  if (xRobots.includes('noindex')) {
    issues.push(`X-Robots-Tag: ${xRobots}`)
  }
  const html = await res.text()
  const metaRobots = extractMetaRobots(html)
  if (metaRobots?.includes('noindex')) {
    issues.push(`meta robots: ${metaRobots}`)
  }
  const canonical = extractCanonical(html)
  if (!canonical) {
    issues.push('canonical missing')
  } else if (normalizeUrl(canonical) !== normalizeUrl(url)) {
    issues.push(`canonical mismatch: ${canonical}`)
  }
  if (res.status >= 400) {
    issues.push(`HTTP ${res.status}`)
  }
  return { url, status: res.status, issues }
}

async function runPool(items, worker) {
  const results = []
  let i = 0
  async function next() {
    while (i < items.length) {
      const idx = i++
      results[idx] = await worker(items[idx], idx)
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, items.length) }, next))
  return results
}

async function main() {
  console.log('=== Wellnesstal SEO Pre-Index Audit ===\n')

  const robotsUrl = `${SITE_ORIGIN}/robots.txt`
  console.log(`Fetching ${robotsUrl} ...`)
  const robotsRes = await fetchWithTimeout(robotsUrl)
  const robotsTxt = await robotsRes.text()
  console.log(robotsTxt)
  console.log('---\n')

  const urls = loadUrls()
  console.log(`Auditing ${urls.length} URLs from ${URLS_FILE} (concurrency ${CONCURRENCY})...\n`)

  const blockedByRobots = urls.filter((u) => {
    try {
      return parseRobotsDisallow(robotsTxt, new URL(u).pathname)
    } catch {
      return false
    }
  })

  const results = await runPool(urls, async (url, idx) => {
    process.stdout.write(`\r[${idx + 1}/${urls.length}] ${url.slice(0, 60)}...`)
    try {
      return await auditUrl(url)
    } catch (err) {
      return { url, status: 0, issues: [`fetch error: ${err.message}`] }
    }
  })
  console.log('\n')

  const withIssues = results.filter((r) => r.issues.length > 0)
  console.log('=== Summary ===')
  console.log(`Total URLs:     ${urls.length}`)
  console.log(`Clean:          ${results.length - withIssues.length}`)
  console.log(`With issues:    ${withIssues.length}`)
  console.log(`robots.txt block: ${blockedByRobots.length}`)

  if (blockedByRobots.length) {
    console.log('\nBlocked by robots.txt:')
    blockedByRobots.forEach((u) => console.log(`  - ${u}`))
  }
  if (withIssues.length) {
    console.log('\nURLs with issues:')
    withIssues.forEach((r) => {
      console.log(`  ${r.url}`)
      r.issues.forEach((i) => console.log(`    · ${i}`))
    })
    process.exitCode = 1
  } else {
    console.log('\nAll checks passed.')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
