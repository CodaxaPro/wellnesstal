'use client'

import Image from 'next/image'
import { BlockProps, TeamContent } from './types'

export default function TeamBlock({ block }: BlockProps) {
  const content = block.content as TeamContent
  const members = content.members || []

  return (
    <section className="py-16 bg-cream">
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

        {members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl overflow-hidden shadow-soft hover:shadow-medium transition-all duration-300 group"
              >
                <div className="relative h-64 bg-gradient-to-br from-sage-100 to-sage-200">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-24 h-24 bg-gradient-to-br from-sage-400 to-forest-600 rounded-full flex items-center justify-center">
                        <span className="text-3xl text-white font-bold">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-charcoal mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sage-600 font-medium mb-3">
                    {member.role}
                  </p>
                  {member.bio && (
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {member.bio}
                    </p>
                  )}

                  {member.social && (
                    <div className="flex justify-center gap-3">
                      {member.social.linkedin && (
                        <a
                          href={member.social.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gray-400 hover:text-sage-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                          </svg>
                        </a>
                      )}
                      {member.social.email && (
                        <a
                          href={`mailto:${member.social.email}`}
                          className="text-gray-400 hover:text-sage-600 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-xl">
            <p className="text-gray-400">Henüz ekip üyesi eklenmedi</p>
          </div>
        )}
      </div>
    </section>
  )
}
