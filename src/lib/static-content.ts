import fs from 'fs'
import path from 'path'

const CONTENT_DIR = path.join(process.cwd(), 'content')
const DATA_CONTENT_PATH = path.join(process.cwd(), 'data', 'content.json')

export interface StaticContentSection {
  id?: string
  section: string
  title?: string
  description?: string
  content?: Record<string, unknown>
  defaults?: Record<string, unknown>
  lastUpdated?: string
  updatedBy?: string
}

export interface StaticHomepageSection {
  section_key: string
  section_name: string
  section_icon?: string | null
  position: number
  enabled: boolean
}

export interface StaticPageBlock {
  id: string
  block_type: string
  content: Record<string, unknown>
  position: number
  visible: boolean
}

export interface StaticPage {
  slug: string
  title: string
  status: 'draft' | 'published' | 'archived'
  meta_title?: string
  meta_description?: string
  meta_keywords?: string[]
  og_image?: string
  active?: boolean
  blocks: StaticPageBlock[]
}

function readJsonFile<T>(filePath: string): T | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T
  } catch (error) {
    console.error(`Failed to read ${filePath}:`, error)
    return null
  }
}

/** All CMS section content (header, hero, footer, meta, …) */
export function getStaticContentSections(): StaticContentSection[] {
  const fromContentDir = readJsonFile<StaticContentSection[]>(
    path.join(CONTENT_DIR, 'sections.json')
  )
  if (fromContentDir?.length) {
    return fromContentDir
  }

  const fromData = readJsonFile<StaticContentSection[]>(DATA_CONTENT_PATH)
  return fromData ?? []
}

export function getStaticContentSection(section: string): StaticContentSection | null {
  return getStaticContentSections().find((item) => item.section === section) ?? null
}

/** Homepage section order */
export function getStaticHomepageSections(): StaticHomepageSection[] {
  const sections = readJsonFile<StaticHomepageSection[]>(
    path.join(CONTENT_DIR, 'homepage-sections.json')
  )
  if (!sections?.length) {
    return []
  }
  return sections
    .filter((s) => s.enabled)
    .sort((a, b) => a.position - b.position)
}

/** Dynamic pages (headspa, gutschein, …) */
export function getStaticPageSlugs(): string[] {
  const pagesDir = path.join(CONTENT_DIR, 'pages')
  if (!fs.existsSync(pagesDir)) {
    return []
  }
  return fs
    .readdirSync(pagesDir)
    .filter((name) => name.endsWith('.json'))
    .map((name) => name.replace(/\.json$/, ''))
}

export function getStaticPageBySlug(slug: string): StaticPage | null {
  const page = readJsonFile<StaticPage>(path.join(CONTENT_DIR, 'pages', `${slug}.json`))
  if (!page || page.status !== 'published' || page.active === false) {
    return null
  }
  return {
    ...page,
    blocks: (page.blocks ?? [])
      .filter((b) => b.visible !== false)
      .sort((a, b) => a.position - b.position)
      .map((b) => ({
        ...b,
        page_id: page.slug,
      })),
  }
}

/** Services catalog for homepage */
export function getStaticServices(): Record<string, unknown>[] {
  const services = readJsonFile<Record<string, unknown>[]>(
    path.join(CONTENT_DIR, 'services.json')
  )
  return services ?? []
}

export function useStaticContentOnly(): boolean {
  return process.env.STATIC_CONTENT === 'true' || process.env.NEXT_PUBLIC_STATIC_CONTENT === 'true'
}
