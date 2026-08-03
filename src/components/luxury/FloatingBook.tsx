'use client'

import { motion, useReducedMotion } from 'framer-motion'

import { getBookingUrl } from '@/lib/content'

export default function FloatingBook() {
  const reduce = useReducedMotion()
  const bookHref = getBookingUrl({ channel: 'floating' })

  return (
    <motion.div
      className="fixed bottom-6 right-6 z-50 hidden md:block"
      initial={reduce ? false : { opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 2, duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={bookHref}
        className="group flex items-center gap-3 glass px-6 py-4 shadow-lg hover:shadow-xl transition-shadow duration-700"
        rel="noopener noreferrer"
      >
        <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
        <span className="eyebrow-luxury !text-ink group-hover:text-gold transition-colors">Wunschtermin</span>
      </a>
    </motion.div>
  )
}
