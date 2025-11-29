'use client'

import { BlockProps, VideoContent } from './types'

export default function VideoBlock({ block }: BlockProps) {
  const content = block.content as VideoContent

  // Extract video ID from URL
  const getEmbedUrl = () => {
    const url = content.videoUrl || ''

    if (content.provider === 'youtube' || url.includes('youtube.com') || url.includes('youtu.be')) {
      const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&\s]+)/)
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}${content.autoplay ? '?autoplay=1' : ''}`
      }
    }

    if (content.provider === 'vimeo' || url.includes('vimeo.com')) {
      const match = url.match(/vimeo\.com\/(\d+)/)
      if (match) {
        return `https://player.vimeo.com/video/${match[1]}${content.autoplay ? '?autoplay=1' : ''}`
      }
    }

    return url
  }

  return (
    <section className="py-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.title && (
          <h2 className="text-3xl lg:text-4xl font-bold text-charcoal mb-8 text-center">
            {content.title}
          </h2>
        )}

        <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl bg-gray-900">
          {content.videoUrl ? (
            <iframe
              src={getEmbedUrl()}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-400">Video URL eklenmedi</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
