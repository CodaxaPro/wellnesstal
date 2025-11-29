'use client'

import { BlockProps, DividerContent } from './types'

export default function DividerBlock({ block }: BlockProps) {
  const content = block.content as DividerContent
  const height = content.height || 60

  return (
    <div
      className="relative"
      style={{ height: `${height}px` }}
    >
      {content.showLine && (
        <div
          className="absolute inset-x-0 top-1/2 transform -translate-y-1/2 h-px max-w-4xl mx-auto"
          style={{ backgroundColor: content.lineColor || '#e5e7eb' }}
        />
      )}
    </div>
  )
}
