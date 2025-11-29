'use client'

import { BlockProps, CtaContent } from './types'

export default function CtaBlock({ block }: BlockProps) {
  const content = block.content as CtaContent

  const bgColorClass = {
    sage: 'bg-gradient-to-r from-sage-500 to-sage-600',
    forest: 'bg-gradient-to-r from-forest-600 to-forest-700',
    charcoal: 'bg-charcoal',
  }[content.backgroundColor || 'sage'] || 'bg-gradient-to-r from-sage-500 to-sage-600'

  return (
    <section className={`py-16 ${bgColorClass}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
          {content.title}
        </h2>

        {content.subtitle && (
          <p className="text-xl text-white/90 mb-8">
            {content.subtitle}
          </p>
        )}

        <a
          href={content.buttonLink || '#'}
          className="inline-block bg-white text-sage-600 hover:bg-gray-100 px-8 py-4 rounded-xl font-medium transition-all duration-300 hover:transform hover:scale-105 text-lg shadow-lg hover:shadow-xl"
        >
          {content.buttonText || 'Jetzt starten'}
        </a>
      </div>
    </section>
  )
}
