'use client'

import { useState } from 'react'
import { BlockProps, FaqContent } from './types'

export default function FaqBlock({ block }: BlockProps) {
  const content = block.content as FaqContent
  const items = content.items || []
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section className="py-16 bg-cream">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-12 text-center">
            {content.title}
          </h2>
        )}

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-soft"
            >
              <button
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="font-medium text-charcoal pr-4">
                  {item.question}
                </span>
                <svg
                  className={`w-5 h-5 text-sage-600 transition-transform flex-shrink-0 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {items.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-400">Henüz soru eklenmedi</p>
          </div>
        )}
      </div>
    </section>
  )
}
