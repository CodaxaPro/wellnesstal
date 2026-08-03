#!/usr/bin/env node
/**
 * Validates long-form SEO intent pages meet minimum word count (2.500+).
 * Conversion landing pages (/headspa, /gutschein, /locations, packages) are excluded.
 * Run: node scripts/validate-longform.mjs
 */
import { readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const MIN_WORDS = 2500

const files = [
  'content/longform/intent/wellness-baesweiler.json',
  'content/longform/intent/wellness-aachen.json',
  'content/longform/intent/deluxe-beauty-baesweiler.json',
  'content/longform/intent/deluxe-hair-beauty.json',
  'content/longform/intent/geschichte.json',
]

function countWords(text) {
  return text
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}

function countLongform(filePath) {
  const raw = readFileSync(join(ROOT, filePath), 'utf8')
  const data = JSON.parse(raw)
  const chunks = []
  if (data.seo) chunks.push(data.seo.title, data.seo.description)
  if (data.article?.intro) chunks.push(data.article.intro)
  for (const s of data.article?.sections ?? []) {
    chunks.push(s.heading.text, ...s.paragraphs, ...(s.bullets ?? []))
    for (const sub of s.subsections ?? []) {
      chunks.push(sub.heading.text, ...sub.paragraphs, ...(sub.bullets ?? []))
    }
  }
  for (const p of data.eeat?.paragraphs ?? []) chunks.push(p)
  for (const c of data.eeat?.credentials ?? []) chunks.push(c.label, c.text)
  for (const f of data.faqExtensions ?? []) chunks.push(f.q, f.a)
  return countWords(chunks.join(' '))
}

let failed = false
for (const file of files) {
  const words = countLongform(file)
  const ok = words >= MIN_WORDS
  console.log(`${ok ? '✓' : '✗'} ${file}: ${words} Wörter (min. ${MIN_WORDS})`)
  if (!ok) failed = true
}

if (failed) {
  console.error('\nLong-form validation failed.')
  process.exit(1)
}

console.log('\nLong-form validation passed.')
