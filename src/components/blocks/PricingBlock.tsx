'use client'

import { BlockProps, PricingContent } from './types'

export default function PricingBlock({ block }: BlockProps) {
  const content = block.content as PricingContent
  const packages = content.packages || []

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-4 text-center">
            {content.title}
          </h2>
        )}

        {content.subtitle && (
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            {content.subtitle}
          </p>
        )}

        {packages.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl p-8 transition-all duration-300 hover:-translate-y-2 ${
                  pkg.highlighted
                    ? 'bg-gradient-to-br from-sage-500 to-forest-600 text-white shadow-xl scale-105'
                    : 'bg-cream hover:shadow-lg'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${pkg.highlighted ? 'text-white' : 'text-charcoal'}`}>
                  {pkg.name}
                </h3>

                <div className="mb-6">
                  <span className={`text-4xl font-bold ${pkg.highlighted ? 'text-white' : 'text-sage-600'}`}>
                    {pkg.price}
                  </span>
                  {pkg.period && (
                    <span className={`text-sm ${pkg.highlighted ? 'text-white/80' : 'text-gray-500'}`}>
                      /{pkg.period}
                    </span>
                  )}
                </div>

                {pkg.description && (
                  <p className={`mb-6 ${pkg.highlighted ? 'text-white/90' : 'text-gray-600'}`}>
                    {pkg.description}
                  </p>
                )}

                <ul className="space-y-3 mb-8">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <svg
                        className={`w-5 h-5 flex-shrink-0 ${pkg.highlighted ? 'text-white' : 'text-sage-500'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={pkg.highlighted ? 'text-white/90' : 'text-gray-600'}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href={pkg.ctaLink || '#'}
                  className={`block w-full py-3 rounded-xl font-medium text-center transition-all ${
                    pkg.highlighted
                      ? 'bg-white text-sage-600 hover:bg-gray-100'
                      : 'bg-sage-500 text-white hover:bg-forest-600'
                  }`}
                >
                  {pkg.ctaText || 'Auswählen'}
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-400">Henüz paket eklenmedi</p>
          </div>
        )}
      </div>
    </section>
  )
}
