'use client'

import { usePathname } from 'next/navigation'

import { getBookingUrl } from '@/lib/content'

/** Global mobile bar — skipped on /headspa (StickyBookCta owns that LP). */
export default function MobileBookBar() {
  const pathname = usePathname()
  const bookHref = getBookingUrl({ channel: 'floating' })

  if (pathname === '/headspa') return null

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <a href={bookHref} className="btn-luxury-primary w-full flex justify-center" rel="noopener noreferrer">
        <span>Wunschtermin finden</span>
      </a>
    </div>
  )
}
