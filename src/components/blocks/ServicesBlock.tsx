'use client'

import Image from 'next/image'

import { BlockProps, ServicesContent } from './types'

export default function ServicesBlock({ block }: BlockProps) {
  const content = block.content as ServicesContent
  const services = content.services || []
  const showPrices = content.showPrices !== false
  const layout = content.layout || 'grid'

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-12 text-center">
            {content.title}
          </h2>
        )}

        {services.length > 0 ? (
          layout === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-cream rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {service.image && (
                    <div className="relative h-48">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-charcoal mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex justify-between items-center">
                      {showPrices && service.price && (
                        <div>
                          <div className="text-2xl font-bold text-sage-600">
                            {service.price}
                          </div>
                          {service.duration && (
                            <div className="text-sm text-gray-500">
                              {service.duration}
                            </div>
                          )}
                        </div>
                      )}
                      <button className="bg-sage-500 hover:bg-forest-600 text-white px-6 py-2 rounded-lg transition-colors">
                        Buchen
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="bg-cream rounded-xl p-6 flex flex-col md:flex-row gap-6 hover:shadow-lg transition-all duration-300"
                >
                  {service.image && (
                    <div className="relative w-full md:w-48 h-48 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-charcoal mb-2">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {service.description}
                    </p>
                    <div className="flex justify-between items-center">
                      {showPrices && service.price && (
                        <div>
                          <div className="text-xl font-bold text-sage-600">
                            {service.price}
                          </div>
                          {service.duration && (
                            <div className="text-sm text-gray-500">
                              {service.duration}
                            </div>
                          )}
                        </div>
                      )}
                      <button className="bg-sage-500 hover:bg-forest-600 text-white px-6 py-3 rounded-lg transition-colors">
                        Jetzt buchen
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-xl">
            <p className="text-gray-400">Henüz hizmet eklenmedi</p>
          </div>
        )}
      </div>
    </section>
  )
}
