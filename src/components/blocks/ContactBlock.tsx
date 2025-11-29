'use client'

import { BlockProps, ContactContent } from './types'

export default function ContactBlock({ block }: BlockProps) {
  const content = block.content as ContactContent

  return (
    <section className="py-16 bg-charcoal">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center">
            {content.title}
          </h2>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {content.showForm !== false && (
            <div className="bg-white rounded-xl p-8">
              <h3 className="text-2xl font-semibold text-charcoal mb-6">
                Kontakt aufnehmen
              </h3>
              <form className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Ihr Name"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    placeholder="Ihre E-Mail"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    placeholder="Ihre Telefonnummer"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <textarea
                    rows={4}
                    placeholder="Ihre Nachricht"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent"
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="w-full bg-sage-500 hover:bg-forest-600 text-white py-3 rounded-lg transition-colors font-medium"
                >
                  Nachricht senden
                </button>
              </form>
            </div>
          )}

          {content.showInfo !== false && (
            <div className="text-white">
              <h3 className="text-2xl font-semibold mb-6">
                Besuchen Sie uns
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-sage-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Musterstraße 123, 50667 Köln</span>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-sage-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <a href="tel:+4922112345678" className="hover:text-sage-400 transition-colors">
                    +49 221 12345678
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-sage-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <a href="mailto:info@wellnesstal.de" className="hover:text-sage-400 transition-colors">
                    info@wellnesstal.de
                  </a>
                </div>
              </div>

              {content.customText && (
                <div className="mt-6 p-4 bg-sage-500/20 rounded-lg">
                  <p className="text-sage-100">{content.customText}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
