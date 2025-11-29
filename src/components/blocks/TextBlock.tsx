'use client'

import { BlockProps, TextContent } from './types'

export default function TextBlock({ block }: BlockProps) {
  const content = block.content as TextContent

  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[content.alignment || 'left']

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {content.title && (
            <h2 className={`text-3xl lg:text-4xl font-bold text-charcoal mb-8 ${alignmentClass}`}>
              {content.title}
            </h2>
          )}

          <div className={`prose prose-lg max-w-none ${alignmentClass}`}>
            {content.columns === 2 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <p className="text-gray-600 leading-relaxed text-lg">
                  {content.content}
                </p>
              </div>
            ) : content.columns === 3 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <p className="text-gray-600 leading-relaxed col-span-3">
                  {content.content}
                </p>
              </div>
            ) : (
              <p className="text-gray-600 leading-relaxed text-lg">
                {content.content}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
