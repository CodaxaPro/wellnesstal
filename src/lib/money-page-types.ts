/** Long-form money page content — unique per URL, no shared body copy across pages */

export type HeadingLevel = 2 | 3 | 4 | 5 | 6

export type MoneyPageHeading = {
  level: HeadingLevel
  text: string
}

export type MoneyPageSubsection = {
  heading: MoneyPageHeading
  paragraphs: string[]
  bullets?: string[]
}

export type MoneyPageSection = {
  id: string
  heading: MoneyPageHeading
  paragraphs: string[]
  bullets?: string[]
  subsections?: MoneyPageSubsection[]
}

export type MoneyPageArticle = {
  intro?: string
  sections: MoneyPageSection[]
}

export type EeatBlock = {
  heading: string
  paragraphs: string[]
  credentials: { label: string; text: string }[]
}

export type InternalLinkBlock = {
  heading: string
  links: { href: string; label: string; hint: string }[]
}

export type LongFormOverlay = {
  /** Replaces or extends SEO when present */
  seo?: { title: string; description: string }
  article: MoneyPageArticle
  eeat: EeatBlock
  internalLinks: InternalLinkBlock
  /** Appended to page FAQ — must be unique to this page */
  faqExtensions?: { q: string; a: string }[]
}

export function countGermanWords(text: string): number {
  return text
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}

export function countArticleWords(article: MoneyPageArticle): number {
  const chunks: string[] = []
  if (article.intro) chunks.push(article.intro)
  for (const section of article.sections) {
    chunks.push(section.heading.text, ...section.paragraphs, ...(section.bullets ?? []))
    for (const sub of section.subsections ?? []) {
      chunks.push(sub.heading.text, ...sub.paragraphs, ...(sub.bullets ?? []))
    }
  }
  return countGermanWords(chunks.join(' '))
}
