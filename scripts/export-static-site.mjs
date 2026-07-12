#!/usr/bin/env node
/**
 * Export all site content from Supabase → content/ directory (static site source).
 *
 * Run from project root (requires .env.local with Supabase keys):
 *   node scripts/export-static-site.mjs
 *
 * Output:
 *   content/sections.json
 *   content/homepage-sections.json
 *   content/services.json
 *   content/pages/{slug}.json
 */

import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.join(__dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content')
const PAGES_DIR = path.join(CONTENT_DIR, 'pages')

function loadEnv() {
  const envPath = path.join(ROOT, '.env.local')
  const env = {}
  for (const line of fs.readFileSync(envPath, 'utf-8').split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    env[key] = val
  }
  return env
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true })
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8')
  console.log(`  ✅ ${path.relative(ROOT, filePath)}`)
}

async function main() {
  console.log('📦 Exporting Wellnesstal site content to content/\n')

  const env = loadEnv()
  const url = env.NEXT_PUBLIC_SUPABASE_URL
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
    process.exit(1)
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } })

  // --- content sections ---
  console.log('📝 content table…')
  const { data: contentRows, error: contentErr } = await supabase.from('content').select('*')
  if (contentErr) {
    console.error('❌ content:', contentErr.message)
  } else if (!contentRows?.length) {
    console.warn('⚠️  content table is empty — copying data/content.json if present')
    const fallback = path.join(ROOT, 'data', 'content.json')
    if (fs.existsSync(fallback)) {
      fs.copyFileSync(fallback, path.join(CONTENT_DIR, 'sections.json'))
      console.log('  ✅ content/sections.json (from data/content.json)')
    }
  } else {
    const sections = contentRows.map((c) => ({
      id: c.id,
      section: c.section,
      title: c.title,
      description: c.description,
      content: typeof c.content === 'string' ? JSON.parse(c.content) : c.content,
      defaults: typeof c.defaults === 'string' ? JSON.parse(c.defaults) : c.defaults,
      lastUpdated: c.last_updated,
      updatedBy: c.updated_by,
    }))
    writeJson(path.join(CONTENT_DIR, 'sections.json'), sections)
  }

  // --- homepage sections ---
  console.log('\n🏠 homepage_sections…')
  const { data: hpSections, error: hpErr } = await supabase
    .from('homepage_sections')
    .select('*')
    .order('position', { ascending: true })
  if (hpErr) {
    console.error('❌ homepage_sections:', hpErr.message)
  } else if (!hpSections?.length) {
    console.warn('⚠️  homepage_sections empty — keep existing content/homepage-sections.json')
  } else {
    writeJson(path.join(CONTENT_DIR, 'homepage-sections.json'), hpSections)
  }

  // --- services ---
  console.log('\n💆 services…')
  const { data: services, error: svcErr } = await supabase
    .from('services')
    .select('*')
    .eq('active', true)
    .order('order_num', { ascending: true })
  if (svcErr) {
    console.error('❌ services:', svcErr.message)
  } else if (services?.length) {
    writeJson(path.join(CONTENT_DIR, 'services.json'), services)
  } else {
    console.warn('⚠️  services table empty')
  }

  // --- pages + blocks ---
  console.log('\n📄 pages + page_blocks…')
  const { data: pages, error: pagesErr } = await supabase
    .from('pages')
    .select('*')
    .eq('status', 'published')
  if (pagesErr) {
    console.error('❌ pages:', pagesErr.message)
    process.exit(1)
  }
  if (!pages?.length) {
    console.error('\n❌ CRITICAL: pages table is EMPTY — nothing to export.')
    console.error('   Restore Supabase backup (Dashboard → Database → Backups) then re-run.')
    console.error('   Without a backup, headspa/gutschein block JSON cannot be recovered 100%.')
    process.exit(1)
  }

  fs.mkdirSync(PAGES_DIR, { recursive: true })
  for (const page of pages) {
    const { data: blocks } = await supabase
      .from('page_blocks')
      .select('*')
      .eq('page_id', page.id)
      .order('position', { ascending: true })

    const exportPage = {
      slug: page.slug,
      title: page.title,
      status: page.status,
      meta_title: page.meta_title,
      meta_description: page.meta_description,
      meta_keywords: page.meta_keywords,
      og_image: page.og_image,
      active: page.active ?? true,
      blocks: (blocks ?? []).map((b, i) => ({
        id: b.id,
        block_type: b.block_type,
        content: typeof b.content === 'string' ? JSON.parse(b.content) : b.content,
        position: b.position ?? i,
        visible: b.visible !== false,
      })),
    }
    writeJson(path.join(PAGES_DIR, `${page.slug}.json`), exportPage)
  }

  console.log(`\n✅ Export complete — ${pages.length} page(s) written to content/pages/`)
  console.log('\nNext: set STATIC_CONTENT=true in Vercel env and redeploy.')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
