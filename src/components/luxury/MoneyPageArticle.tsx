'use client'

import type { MoneyPageArticle as Article, MoneyPageHeading } from '@/lib/money-page-types'

import { Reveal } from './Reveal'

function HeadingTag({ heading }: { heading: MoneyPageHeading }) {
  const className =
    heading.level === 2
      ? 'headline-lg mb-6'
      : heading.level === 3
        ? 'font-display text-2xl text-ink mb-4 mt-10'
        : heading.level === 4
          ? 'font-display text-xl text-ink mb-3 mt-8'
          : 'font-medium text-ink mb-2 mt-6'

  switch (heading.level) {
    case 2:
      return <h2 className={className}>{heading.text}</h2>
    case 3:
      return <h3 className={className}>{heading.text}</h3>
    case 4:
      return <h4 className={className}>{heading.text}</h4>
    case 5:
      return <h5 className={className}>{heading.text}</h5>
    default:
      return <h6 className={className}>{heading.text}</h6>
  }
}

type Props = {
  article: Article
  sectionIdPrefix?: string
}

export default function MoneyPageArticle({ article, sectionIdPrefix = 'art' }: Props) {
  return (
    <article className="money-page-article">
      {article.intro && (
        <Reveal>
          <p className="body-luxury text-lg md:text-xl leading-relaxed mb-12">{article.intro}</p>
        </Reveal>
      )}
      {article.sections.map((section, si) => (
        <section
          key={section.id}
          id={`${sectionIdPrefix}-${section.id}`}
          className="mb-16 last:mb-0 scroll-mt-28"
        >
          <Reveal delay={si * 0.04}>
            <HeadingTag heading={section.heading} />
            <div className="space-y-5">
              {section.paragraphs.map((p) => (
                <p key={p.slice(0, 48)} className="body-luxury text-base md:text-lg leading-relaxed">
                  {p}
                </p>
              ))}
            </div>
            {section.bullets && section.bullets.length > 0 && (
              <ul className="mt-6 space-y-3 body-luxury text-base md:text-lg list-disc pl-6 marker:text-gold">
                {section.bullets.map((b) => (
                  <li key={b.slice(0, 40)}>{b}</li>
                ))}
              </ul>
            )}
            {section.subsections?.map((sub) => (
              <div key={sub.heading.text} className="mt-8">
                <HeadingTag heading={sub.heading} />
                <div className="space-y-4">
                  {sub.paragraphs.map((p) => (
                    <p key={p.slice(0, 48)} className="body-luxury text-base md:text-lg leading-relaxed">
                      {p}
                    </p>
                  ))}
                </div>
                {sub.bullets && sub.bullets.length > 0 && (
                  <ul className="mt-4 space-y-2 body-luxury list-disc pl-6 marker:text-gold">
                    {sub.bullets.map((b) => (
                      <li key={b.slice(0, 40)}>{b}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Reveal>
        </section>
      ))}
    </article>
  )
}
