'use client'

import { BlockProps, StatsContent } from './types'

export default function StatsBlock({ block }: BlockProps) {
  const content = block.content as StatsContent
  const stats = content.stats || []

  return (
    <section className="py-16 bg-gradient-to-r from-sage-500 to-forest-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-12 text-center">
            {content.title}
          </h2>
        )}

        <div className={`grid grid-cols-2 md:grid-cols-${Math.min(stats.length, 4)} gap-8`}>
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-bold text-white mb-2">
                {stat.value}
              </div>
              <div className="text-sage-100 text-lg">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {stats.length === 0 && (
          <div className="text-center py-8">
            <p className="text-white/60">Henüz istatistik eklenmedi</p>
          </div>
        )}
      </div>
    </section>
  )
}
