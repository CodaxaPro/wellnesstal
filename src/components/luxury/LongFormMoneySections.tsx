'use client'

import type { LongFormOverlay } from '@/lib/money-page-types'

import DualCtaStrip from './DualCtaStrip'
import EeatBlock from './EeatBlock'
import InternalLinksBlock from './InternalLinksBlock'
import MoneyPageArticle from './MoneyPageArticle'
import { Reveal } from './Reveal'

type Props = {
  longForm: LongFormOverlay
  bookingUrl: string
  gutscheinUrl: string
  sectionId?: string
}

export default function LongFormMoneySections({
  longForm,
  bookingUrl,
  gutscheinUrl,
  sectionId = 'ritual',
}: Props) {
  return (
    <>
      <section id={sectionId} className="section-space bg-ivory">
        <div className="container-luxury max-w-3xl mx-auto">
          <MoneyPageArticle article={longForm.article} />
          <Reveal className="mt-14 pt-10 border-t border-stone/60">
            <DualCtaStrip bookingUrl={bookingUrl} gutscheinUrl={gutscheinUrl} className="justify-center" />
          </Reveal>
        </div>
      </section>
      <EeatBlock block={longForm.eeat} />
      <InternalLinksBlock block={longForm.internalLinks} />
    </>
  )
}
