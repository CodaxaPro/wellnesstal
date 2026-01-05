'use client'

import { useState, useMemo } from 'react'
import { BlockProps, EmbedContent } from './types'

// Default content for new embed blocks
export const getDefaultEmbedContent = (): EmbedContent => ({
  provider: 'custom',
  embedCode: '',
  embedUrl: '',
  title: '',
  subtitle: '',
  container: {
    maxWidth: 'xl',
    alignment: 'center',
    padding: { top: '64px', bottom: '64px', left: '16px', right: '16px' },
    margin: { top: '0px', bottom: '0px' }
  },
  frame: {
    aspectRatio: '16:9',
    borderEnabled: false,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: '12px',
    shadow: 'md',
    overflow: 'hidden'
  },
  security: {
    sandboxEnabled: false,
    allowScripts: true,
    allowSameOrigin: true,
    allowForms: true,
    allowPopups: true,
    lazyLoad: true
  },
  loading: {
    showLoadingSpinner: true,
    spinnerColor: '#9CAF88',
    placeholderText: 'İçerik yükleniyor...',
    placeholderBackgroundColor: '#f9fafb',
    fallbackEnabled: true,
    fallbackText: 'İçerik yüklenemedi'
  },
  clickToLoad: false,
  clickToLoadText: 'Görüntülemek için tıklayın'
})

export default function EmbedBlock({ block }: BlockProps) {
  const content = block.content as EmbedContent
  const [isLoaded, setIsLoaded] = useState(!content.clickToLoad)
  const [hasError, setHasError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Get max width class
  const getMaxWidthClass = () => {
    const widthMap: Record<string, string> = {
      'sm': 'max-w-sm',
      'md': 'max-w-md',
      'lg': 'max-w-lg',
      'xl': 'max-w-xl',
      '2xl': 'max-w-2xl',
      '3xl': 'max-w-3xl',
      'full': 'max-w-full',
      'custom': ''
    }
    return widthMap[content.container?.maxWidth || 'xl'] || 'max-w-xl'
  }

  // Get alignment class
  const getAlignmentClass = () => {
    const alignMap: Record<string, string> = {
      'left': 'mr-auto',
      'center': 'mx-auto',
      'right': 'ml-auto'
    }
    return alignMap[content.container?.alignment || 'center'] || 'mx-auto'
  }

  // Get aspect ratio class or style
  const getAspectRatioStyle = () => {
    const ratioMap: Record<string, string> = {
      '16:9': '56.25%',
      '4:3': '75%',
      '1:1': '100%',
      '9:16': '177.78%',
      '21:9': '42.86%',
      'auto': '0',
      'custom': content.frame?.customAspectRatio || '56.25%'
    }
    return ratioMap[content.frame?.aspectRatio || '16:9'] || '56.25%'
  }

  // Get shadow class
  const getShadowClass = () => {
    const shadowMap: Record<string, string> = {
      'none': '',
      'sm': 'shadow-sm',
      'md': 'shadow-md',
      'lg': 'shadow-lg',
      'xl': 'shadow-xl',
      '2xl': 'shadow-2xl'
    }
    return shadowMap[content.frame?.shadow || 'md'] || 'shadow-md'
  }

  // Get background style
  const getBackgroundStyle = (): React.CSSProperties => {
    const bg = content.background
    if (!bg || bg.type === 'none') return {}

    if (bg.type === 'solid' && bg.color) {
      return { backgroundColor: bg.color }
    }

    if (bg.type === 'gradient' && bg.gradientFrom && bg.gradientTo) {
      const direction = bg.gradientDirection || 'to-b'
      const dirMap: Record<string, string> = {
        'to-r': 'to right',
        'to-l': 'to left',
        'to-t': 'to top',
        'to-b': 'to bottom',
        'to-br': 'to bottom right',
        'to-bl': 'to bottom left',
        'to-tr': 'to top right',
        'to-tl': 'to top left'
      }
      return {
        background: `linear-gradient(${dirMap[direction]}, ${bg.gradientFrom}, ${bg.gradientTo})`
      }
    }

    return {}
  }

  // Build sandbox attribute
  const getSandboxAttribute = () => {
    if (!content.security?.sandboxEnabled) return undefined

    const permissions: string[] = []
    if (content.security.allowScripts) permissions.push('allow-scripts')
    if (content.security.allowSameOrigin) permissions.push('allow-same-origin')
    if (content.security.allowForms) permissions.push('allow-forms')
    if (content.security.allowPopups) permissions.push('allow-popups')

    return permissions.join(' ')
  }

  // Generate embed URL for known providers
  const getEmbedUrl = useMemo(() => {
    const provider = content.provider
    const url = content.embedUrl || ''
    const settings = content.providerSettings

    switch (provider) {
      case 'youtube': {
        // Extract video ID from various YouTube URL formats
        const match = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/|v\/)|youtu\.be\/)([^&\s?]+)/)
        const videoId = match?.[1] || settings?.youtube?.videoId
        if (!videoId) return url

        const params = new URLSearchParams()
        if (settings?.youtube?.autoplay) params.set('autoplay', '1')
        if (settings?.youtube?.muted) params.set('mute', '1')
        if (settings?.youtube?.loop) params.set('loop', '1')
        if (settings?.youtube?.controls === false) params.set('controls', '0')
        if (settings?.youtube?.startTime) params.set('start', String(settings.youtube.startTime))
        if (settings?.youtube?.showRelated === false) params.set('rel', '0')

        const domain = settings?.youtube?.enablePrivacyMode ? 'www.youtube-nocookie.com' : 'www.youtube.com'
        const queryString = params.toString()
        return `https://${domain}/embed/${videoId}${queryString ? '?' + queryString : ''}`
      }

      case 'vimeo': {
        const match = url.match(/vimeo\.com\/(\d+)/)
        if (match) {
          return `https://player.vimeo.com/video/${match[1]}`
        }
        return url
      }

      case 'google-maps':
        return settings?.googleMaps?.embedUrl || url

      case 'spotify': {
        // Convert spotify URLs to embed format
        if (url.includes('open.spotify.com')) {
          return url.replace('open.spotify.com', 'open.spotify.com/embed')
        }
        return url
      }

      case 'iframe':
        return url

      default:
        return url
    }
  }, [content.provider, content.embedUrl, content.providerSettings])

  // Render frame border style
  const getFrameStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      borderRadius: content.frame?.borderRadius || '12px',
      overflow: content.frame?.overflow || 'hidden'
    }

    if (content.frame?.borderEnabled) {
      style.borderWidth = content.frame.borderWidth || 1
      style.borderColor = content.frame.borderColor || '#e5e7eb'
      style.borderStyle = content.frame.borderStyle || 'solid'
    }

    return style
  }

  // Handle click to load
  const handleClickToLoad = () => {
    setIsLoaded(true)
  }

  // Render loading placeholder
  const renderLoading = () => (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{ backgroundColor: content.loading?.placeholderBackgroundColor || '#f9fafb' }}
    >
      {content.loading?.showLoadingSpinner && (
        <div
          className="w-8 h-8 border-3 border-t-transparent rounded-full animate-spin mb-3"
          style={{ borderColor: content.loading?.spinnerColor || '#9CAF88' }}
        />
      )}
      {content.loading?.placeholderText && (
        <p className="text-sm text-gray-500">{content.loading.placeholderText}</p>
      )}
    </div>
  )

  // Render error fallback
  const renderError = () => (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100"
    >
      <svg className="w-12 h-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className="text-sm text-gray-500">{content.loading?.fallbackText || 'İçerik yüklenemedi'}</p>
    </div>
  )

  // Render click to load placeholder
  const renderClickToLoad = () => (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors"
      onClick={handleClickToLoad}
    >
      <div className="bg-white rounded-full p-4 shadow-lg mb-4">
        <svg className="w-8 h-8 text-sage-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <p className="text-sm font-medium text-gray-700">
        {content.clickToLoadText || 'Görüntülemek için tıklayın'}
      </p>
    </div>
  )

  // Render the embed content
  const renderEmbed = () => {
    // Custom HTML/JS embed
    if (content.provider === 'custom' && content.embedCode) {
      return (
        <div
          className="absolute inset-0"
          dangerouslySetInnerHTML={{ __html: content.embedCode }}
        />
      )
    }

    // URL-based embed (iframe)
    const embedSrc = getEmbedUrl
    if (!embedSrc) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <p className="text-gray-400">Embed URL veya kod eklenmedi</p>
        </div>
      )
    }

    return (
      <iframe
        src={embedSrc}
        className="absolute inset-0 w-full h-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading={content.security?.lazyLoad ? 'lazy' : 'eager'}
        sandbox={getSandboxAttribute()}
        referrerPolicy={content.security?.referrerPolicy || 'no-referrer-when-downgrade'}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false)
          setHasError(true)
        }}
      />
    )
  }

  // Container padding style
  const containerStyle: React.CSSProperties = {
    paddingTop: content.container?.padding?.top || '64px',
    paddingBottom: content.container?.padding?.bottom || '64px',
    paddingLeft: content.container?.padding?.left || '16px',
    paddingRight: content.container?.padding?.right || '16px',
    marginTop: content.container?.margin?.top || '0px',
    marginBottom: content.container?.margin?.bottom || '0px',
    ...(content.container?.maxWidth === 'custom' && content.container?.customMaxWidth
      ? { maxWidth: content.container.customMaxWidth }
      : {}),
    ...getBackgroundStyle()
  }

  return (
    <section
      id={content.sectionId || 'booking'}
      data-booking-section
      className={content.customClass || ''}
      id={content.sectionId}
      style={getBackgroundStyle()}
    >
      <div
        className={`${getMaxWidthClass()} ${getAlignmentClass()} px-4 sm:px-6 lg:px-8`}
        style={containerStyle}
      >
        {/* Section Header */}
        {(content.header?.enabled || content.title) && (
          <div
            className={`mb-8 ${
              content.header?.alignment === 'center' ? 'text-center' :
              content.header?.alignment === 'right' ? 'text-right' : 'text-left'
            }`}
          >
            {/* Badge */}
            {content.header?.badge?.enabled && content.header.badge.text && (
              <span
                className="inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4"
                style={{
                  backgroundColor: content.header.badge.backgroundColor || '#9CAF88',
                  color: content.header.badge.textColor || '#ffffff'
                }}
              >
                {content.header.badge.text}
              </span>
            )}

            {/* Title */}
            {(content.header?.title || content.title) && (
              <h2
                className="text-3xl lg:text-4xl font-bold text-charcoal mb-4"
                style={{
                  fontSize: content.header?.typography?.titleSize,
                  fontWeight: content.header?.typography?.titleWeight,
                  color: content.header?.typography?.titleColor
                }}
              >
                {content.header?.title || content.title}
              </h2>
            )}

            {/* Subtitle */}
            {(content.header?.subtitle || content.subtitle) && (
              <p
                className="text-lg text-gray-600 max-w-2xl mx-auto"
                style={{
                  fontSize: content.header?.typography?.subtitleSize,
                  color: content.header?.typography?.subtitleColor
                }}
              >
                {content.header?.subtitle || content.subtitle}
              </p>
            )}
          </div>
        )}

        {/* Embed Frame */}
        <div
          className={`relative ${getShadowClass()} bg-gray-900`}
          style={{
            ...getFrameStyle(),
            paddingBottom: content.frame?.aspectRatio === 'auto'
              ? undefined
              : getAspectRatioStyle(),
            height: content.frame?.aspectRatio === 'auto'
              ? (content.frame?.height || '400px')
              : 0,
            minHeight: content.frame?.minHeight,
            maxHeight: content.frame?.maxHeight
          }}
        >
          {/* Click to load overlay */}
          {content.clickToLoad && !isLoaded && renderClickToLoad()}

          {/* Loading state */}
          {isLoaded && isLoading && !hasError && renderLoading()}

          {/* Error state */}
          {isLoaded && hasError && content.loading?.fallbackEnabled && renderError()}

          {/* Actual embed content */}
          {isLoaded && !hasError && renderEmbed()}
        </div>

        {/* Caption */}
        {content.caption?.enabled && content.caption.text && (
          <p
            className={`mt-4 text-sm ${
              content.caption.alignment === 'center' ? 'text-center' :
              content.caption.alignment === 'right' ? 'text-right' : 'text-left'
            }`}
            style={{
              fontSize: content.caption.fontSize || '14px',
              color: content.caption.color || '#6b7280'
            }}
          >
            {content.caption.text}
          </p>
        )}
      </div>
    </section>
  )
}
