'use client'

import { getBookingUrl } from '@/lib/content'

export default function MobileBookBar() {
  const bookHref = getBookingUrl({ channel: 'floating' })

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 md:hidden p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <a href={bookHref} className="btn-luxury-primary w-full flex justify-center" rel="noopener noreferrer">
        <span>Wunschtermin finden</span>
      </a>
    </div>
  )
}
