import longformWellnessAachen from '../../content/longform/intent/wellness-aachen.json'
import longformWellnessBaesweiler from '../../content/longform/intent/wellness-baesweiler.json'
import longformDeluxeBeauty from '../../content/longform/intent/deluxe-beauty-baesweiler.json'
import longformDeluxeHair from '../../content/longform/intent/deluxe-hair-beauty.json'
import longformGeschichte from '../../content/longform/intent/geschichte.json'

import type { LongFormOverlay } from './money-page-types'

/** Long-form overlays apply only to dedicated SEO intent / brand money pages — not conversion landings. */
const intentLongForm: Partial<Record<string, LongFormOverlay>> = {
  'wellness-baesweiler': longformWellnessBaesweiler as LongFormOverlay,
  'wellness-aachen': longformWellnessAachen as LongFormOverlay,
  'deluxe-beauty-baesweiler': longformDeluxeBeauty as LongFormOverlay,
  'deluxe-hair-beauty': longformDeluxeHair as LongFormOverlay,
  geschichte: longformGeschichte as LongFormOverlay,
}

export function getIntentLongForm(slug: string): LongFormOverlay | undefined {
  return intentLongForm[slug]
}

/** Intent SEO pages validated at build time */
export const LONGFORM_MONEY_PAGE_SLUGS = [...Object.keys(intentLongForm)] as const

export { intentLongForm }
