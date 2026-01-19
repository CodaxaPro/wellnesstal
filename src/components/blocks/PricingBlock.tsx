'use client'

import { useState, useEffect } from 'react'

import { BlockProps, PricingContent, PricingPackage, PricingFeatureItem, PricingResponsive, PricingSectionHeader, PricingBackground, PricingAnimations, PricingPackageStyle } from './types'

const defaultResponsive: PricingResponsive = {
  desktop: { columns: 3, gap: '2rem', padding: '4rem' },
  tablet: { columns: 2, gap: '1.5rem', padding: '3rem' },
  mobile: { columns: 1, gap: '1rem', padding: '2rem', stackPackages: true }
}

const defaultHeader: PricingSectionHeader = {}
const defaultBackground: PricingBackground = { type: 'solid', color: '#ffffff' }
const defaultAnimations: PricingAnimations = { enabled: true, type: 'fadeUp' }
const defaultPackageStyleObj: PricingPackageStyle = {}

export default function PricingBlock({ block }: BlockProps) {
  const content = block.content as PricingContent
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
  // Always start with 'einzeltermin' as default
  const [activeTab, setActiveTab] = useState<'einzeltermin' | 'partnertermin'>('einzeltermin')

  // Update active tab if defaultTab changes in content (only on mount or when defaultTab changes)
  useEffect(() => {
    if (content.tabs?.defaultTab) {
      setActiveTab(content.tabs.defaultTab)
    }
  }, [content.tabs?.defaultTab])

  // Safe access with defaults
  const packages = content.packages || []
  const layout = content.layout || 'grid'
  const maxWidth = content.maxWidth || 'xl'
  const header = content.header || defaultHeader
  const background = content.background || defaultBackground
  const animations = content.animations || defaultAnimations
  const billingToggle = content.billingToggle
  const tabs = content.tabs
  const trustElement = content.trustElement
  const faq = content.faq
  const comparisonTable = content.comparisonTable
  const responsive = content.responsive || defaultResponsive
  const defaultPackageStyle = content.defaultPackageStyle || defaultPackageStyleObj

  // Filter packages by tab
  let filteredPackages = tabs?.enabled
    ? packages.filter(pkg => {
        if (activeTab === 'einzeltermin') {
          return !pkg.isPartner
        } else {
          return pkg.isPartner === true
        }
      })
    : packages

  // Create a map of original indices from the original packages array
  const originalIndices = new Map<string, number>()
  packages.forEach((pkg, idx) => {
    originalIndices.set(pkg.id, idx)
  })

  // Sort: use order if available, otherwise use original array index
  filteredPackages = [...filteredPackages].sort((a, b) => {
    // If both have order, sort by order
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order
    }
    
    // If only one has order, it comes first
    if (a.order !== undefined) {
return -1
}
    if (b.order !== undefined) {
return 1
}
    
    // Neither has order - use original array index
    const aIdx = originalIndices.get(a.id) ?? Infinity
    const bIdx = originalIndices.get(b.id) ?? Infinity
    return aIdx - bIdx
  })

  // Background styles
  const getBackgroundStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {}

    if (background.type === 'solid') {
      style.backgroundColor = background.color || '#ffffff'
    } else if (background.type === 'gradient') {
      const direction = background.gradientDirection?.replace('to-', 'to ') || 'to bottom right'
      const from = background.gradientFrom || '#f0fdf4'
      const via = background.gradientVia ? `, ${background.gradientVia}` : ''
      const to = background.gradientTo || '#ecfeff'
      style.background = `linear-gradient(${direction}, ${from}${via}, ${to})`
    } else if (background.type === 'image' && background.imageUrl) {
      style.backgroundImage = `url(${background.imageUrl})`
      style.backgroundPosition = background.imagePosition || 'center'
      style.backgroundSize = background.imageSize || 'cover'
      style.backgroundRepeat = 'no-repeat'
    }

    return style
  }

  // Pattern overlay for background type 'pattern'
  const getPatternStyle = (): React.CSSProperties | null => {
    if (background.type !== 'pattern') {
return null
}
    const patternColor = background.patternColor || '#e2e8f0'
    const opacity = (background.patternOpacity || 10) / 100

    const patterns: Record<string, string> = {
      dots: `radial-gradient(${patternColor} 1px, transparent 1px)`,
      grid: `linear-gradient(${patternColor} 1px, transparent 1px), linear-gradient(90deg, ${patternColor} 1px, transparent 1px)`,
      lines: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${patternColor} 10px, ${patternColor} 11px)`,
      waves: `url("data:image/svg+xml,%3Csvg width='100' height='20' viewBox='0 0 100 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21.184 20c.357-.13.72-.264 1.088-.402l1.768-.661C33.64 15.347 39.647 14 50 14c10.271 0 15.362 1.222 24.629 4.928.955.383 1.869.74 2.75 1.072h6.225c-2.51-.73-5.139-1.691-8.233-2.928C65.888 13.278 60.562 12 50 12c-10.626 0-16.855 1.397-26.66 5.063l-1.767.662c-2.475.923-4.66 1.674-6.724 2.275h6.335zm0-20C13.258 2.892 8.077 4 0 4V2c5.744 0 9.951-.574 14.85-2h6.334zM77.38 0C85.239 2.966 90.502 4 100 4V2c-6.842 0-11.386-.542-16.396-2h-6.225zM0 14c8.44 0 13.718-1.21 22.272-4.402l1.768-.661C33.64 5.347 39.647 4 50 4c10.271 0 15.362 1.222 24.629 4.928C84.112 12.722 89.438 14 100 14v-2c-10.271 0-15.362-1.222-24.629-4.928C65.888 3.278 60.562 2 50 2 39.374 2 33.145 3.397 23.34 7.063l-1.767.662C13.223 10.84 8.163 12 0 12v2z' fill='${encodeURIComponent(patternColor)}' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`
    }

    return {
      position: 'absolute' as const,
      inset: 0,
      backgroundImage: patterns[background.pattern || 'dots'],
      backgroundSize: background.pattern === 'dots' ? '20px 20px' : background.pattern === 'grid' ? '20px 20px' : 'auto',
      opacity,
      pointerEvents: 'none' as const
    }
  }

  // Container width class
  const getMaxWidthClass = () => {
    const widths: Record<string, string> = {
      sm: 'max-w-3xl',
      md: 'max-w-4xl',
      lg: 'max-w-5xl',
      xl: 'max-w-6xl',
      '2xl': 'max-w-7xl',
      full: 'max-w-full'
    }
    return widths[maxWidth] || 'max-w-6xl'
  }

  // Layout classes (gap is applied via inline style)
  const getLayoutClasses = () => {
    switch (layout) {
      case 'horizontal':
        return 'flex flex-col lg:flex-row'
      case 'cards':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 'minimal':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
      case 'featured':
        return 'grid grid-cols-1 lg:grid-cols-3 items-center'
      case 'comparison':
        return 'overflow-x-auto'
      case 'grid':
      default:
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
    }
  }

  // Animation styles
  const getAnimationStyle = (index: number): React.CSSProperties => {
    if (!animations.enabled || animations.type === 'none') {
return {}
}

    const baseDelay = animations.delay || 0
    const staggerDelay = (animations.stagger || 100) * index
    const totalDelay = baseDelay + staggerDelay
    const duration = animations.duration || 500

    // Get animation name based on type
    const animationNames: Record<string, string> = {
      fadeUp: 'pricing-fadeUp',
      fadeIn: 'pricing-fadeIn',
      slideIn: 'pricing-slideIn',
      scale: 'pricing-scale'
    }

    const animationName = animationNames[animations.type || 'fadeUp'] || 'pricing-fadeUp'

    return {
      opacity: 0,
      animation: `${animationName} ${duration}ms ease-out ${totalDelay}ms forwards`
    }
  }

  // Animation keyframes CSS
  const getAnimationKeyframes = () => {
    if (!animations.enabled || animations.type === 'none') {
return ''
}

    return `
      @keyframes pricing-fadeUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes pricing-fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      @keyframes pricing-slideIn {
        from { opacity: 0; transform: translateX(-30px); }
        to { opacity: 1; transform: translateX(0); }
      }
      @keyframes pricing-scale {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
    `
  }

  // Render feature item (string or object) - Improved alignment and negative item styling
  const renderFeature = (feature: string | PricingFeatureItem, index: number, highlighted: boolean, pkgStyle?: PricingPackageStyle) => {
    const isString = typeof feature === 'string'
    const text = isString ? feature : feature.text
    const included = isString ? true : feature.included === true
    const tooltip = isString ? undefined : feature.tooltip

    // Use package style checkmarkColor or default style checkmarkColor
    // If checkmarkColor is the old green color, use the new sage color
    let checkmarkColor = pkgStyle?.checkmarkColor || defaultPackageStyle.checkmarkColor
    if (checkmarkColor === '#059669' || !checkmarkColor) {
      checkmarkColor = '#9CAF88'
    }
    const featureTextColor = pkgStyle?.featureTextColor || defaultPackageStyle.featureTextColor

    // Negative items (X icons) - lower opacity and different color
    const negativeIconColor = highlighted ? 'rgba(255, 255, 255, 0.4)' : '#d1d5db' // Light grey
    const negativeTextOpacity = highlighted ? 0.6 : 0.6

    return (
      <li 
        key={index} 
        className="flex items-start gap-3"
        title={tooltip}
      >
        {/* Icon - Perfect alignment with first line of text */}
        <svg
          className="w-5 h-5 flex-shrink-0 mt-0.5"
          style={{
            color: included
              ? (highlighted ? '#ffffff' : (checkmarkColor || '#9CAF88'))
              : negativeIconColor
          }}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={included ? 2.5 : 2}
        >
          {included ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          )}
        </svg>
        {/* Text - Aligned with icon */}
        <span
          className="flex-1 leading-relaxed"
          style={{ 
            color: highlighted 
              ? (included ? 'rgba(255, 255, 255, 0.95)' : `rgba(255, 255, 255, ${negativeTextOpacity})`)
              : (included ? (featureTextColor || '#4b5563') : `rgba(75, 85, 99, ${negativeTextOpacity})`)
          }}
        >
          {text}
        </span>
      </li>
    )
  }

  // Get package price based on billing cycle
  const getPrice = (pkg: PricingPackage) => {
    if (billingToggle?.enabled && billingCycle === 'yearly' && pkg.yearlyPrice) {
      return pkg.yearlyPrice
    }
    return pkg.price
  }

  // Get shadow class from size
  const getShadowClass = (size?: string) => {
    const shadows: Record<string, string> = {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    }
    return shadows[size || 'md'] || 'shadow-md'
  }

  // Package card style
  const getPackageStyle = (pkg: PricingPackage): React.CSSProperties => {
    const style = pkg.style || defaultPackageStyle
    const cardStyle: React.CSSProperties = {}

    if (style.backgroundColor) {
cardStyle.backgroundColor = style.backgroundColor
}
    if (style.borderColor) {
cardStyle.borderColor = style.borderColor
}
    if (style.borderWidth !== undefined) {
cardStyle.borderWidth = `${style.borderWidth}px`
}
    // borderRadius can be a string like '1rem' or a number
    if (style.borderRadius) {
      cardStyle.borderRadius = typeof style.borderRadius === 'number'
        ? `${style.borderRadius}px`
        : style.borderRadius
    }

    return cardStyle
  }

  // Get price color
  const getPriceColor = (pkg: PricingPackage) => {
    if (pkg.highlighted) {
return '#ffffff'
}
    const style = pkg.style || defaultPackageStyle
    // If priceColor is the old green color, use the new sage color
    const priceColor = style.priceColor || defaultPackageStyle.priceColor
    if (priceColor === '#059669' || !priceColor) {
      return '#9CAF88'
    }
    return priceColor
  }

  // CTA button style
  const getCtaButtonClasses = (pkg: PricingPackage) => {
    const cta = pkg.cta
    const style = cta?.style || 'filled'
    const highlighted = pkg.highlighted

    const baseClasses = 'block w-full py-3 rounded-xl font-medium text-center transition-all duration-300 hover:scale-105 hover:shadow-lg'

    if (style === 'outline') {
      return `${baseClasses} border-2 ${highlighted ? 'border-white text-white hover:bg-white/20 hover:border-white/80' : 'border-sage-500 text-sage-600 hover:bg-sage-100 hover:border-forest-600'}`
    }
    if (style === 'ghost') {
      return `${baseClasses} ${highlighted ? 'text-white hover:bg-white/20' : 'text-sage-600 hover:bg-sage-100'}`
    }
    if (style === 'gradient') {
      return `${baseClasses} bg-gradient-to-r from-sage-500 to-forest-600 text-white hover:from-forest-600 hover:to-sage-500 hover:shadow-xl`
    }

    // Default: filled - Enhanced hover effects
    return `${baseClasses} ${highlighted ? 'bg-white text-sage-600 hover:bg-gray-50 hover:shadow-xl' : 'bg-sage-500 text-white hover:bg-forest-600 hover:shadow-xl'}`
  }

  // Get hover effect class based on settings
  const getHoverEffectClass = (pkgStyle?: PricingPackageStyle) => {
    if (animations.hoverEffects === false) {
return ''
}

    const effect = pkgStyle?.hoverEffect || defaultPackageStyle.hoverEffect || 'lift'

    switch (effect) {
      case 'lift':
        return 'hover:-translate-y-2'
      case 'scale':
        return 'hover:scale-105'
      case 'glow':
        return 'hover:shadow-xl hover:shadow-sage-200/50'
      case 'border':
        return 'hover:border-sage-400'
      case 'none':
      default:
        return ''
    }
  }

  // Get features for a package - show all features (both included and not included)
  const getPackageFeatures = (pkg: PricingPackage): (string | PricingFeatureItem)[] => {
    // Return all features - included ones will show ✓, not included ones will show ✗
    return pkg.features
  }

  // Render package card
  const renderPackageCard = (pkg: PricingPackage, index: number) => {
    const animationStyle = getAnimationStyle(index)
    const packageStyle = getPackageStyle(pkg)
    const isFeatured = layout === 'featured' && pkg.highlighted
    const hoverClass = getHoverEffectClass(pkg.style)
    const pkgStyleDef = pkg.style || defaultPackageStyle
    const shadowClass = pkg.highlighted ? 'shadow-xl' : getShadowClass(pkgStyleDef.shadowSize)
    const packageFeatures = getPackageFeatures(pkg)

    return (
      <div
        key={pkg.id}
        className={`rounded-2xl p-6 md:p-8 transition-all duration-300 ${hoverClass} ${shadowClass} ${
          pkg.highlighted
            ? 'bg-gradient-to-br from-sage-500 to-forest-600 text-white'
            : 'bg-white hover:shadow-lg border border-slate-200'
        } ${isFeatured ? 'lg:scale-110 z-10' : ''} ${(pkg.popular || pkg.recommended) ? 'relative' : ''}`}
        style={{ 
          ...packageStyle, 
          ...animationStyle,
          borderRadius: '16px',
          boxShadow: pkg.highlighted 
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            : '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)'
        }}
      >
        {/* Popular Badge */}
        {pkg.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Beliebteste
            </span>
          </div>
        )}

        {/* Recommended Badge */}
        {pkg.recommended && !pkg.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <span className="bg-sage-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              Önerilen
            </span>
          </div>
        )}

        {/* Header Area - Flexbox layout for consistent spacing */}
        <div className="flex flex-col gap-3 mb-4">
          {/* Badge and Partner Badge - Top Left */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Custom Badge */}
            {pkg.badge?.enabled && pkg.badge?.text && (
              <span
                className="inline-block text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full"
                style={{
                  backgroundColor: pkg.badge.backgroundColor || '#f0fdf4',
                  color: pkg.badge.textColor || '#166534',
                  letterSpacing: '0.05em'
                }}
              >
                {pkg.badge.text}
              </span>
            )}

            {/* Partner/Double Package Badge */}
            {pkg.isPartner && (
              <span
                className="inline-block text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full text-white"
                style={{ 
                  letterSpacing: '0.05em',
                  backgroundColor: pkg.style?.partnerBadgeColor || '#9CAF88', // Ana renk (sage)
                  borderColor: pkg.style?.partnerBadgeColor || '#9CAF88'
                }}
              >
                {pkg.partnerLabel || 'PARTNER-PACKAGE'}
              </span>
            )}
          </div>

          {/* Title - Improved line-height to prevent overlapping */}
          <h3 
            className={`text-3xl md:text-4xl font-bold leading-tight ${pkg.highlighted ? 'text-white' : 'text-charcoal'}`}
            style={{ 
              lineHeight: '1.2',
              wordBreak: 'break-word'
            }}
          >
            {pkg.name}
          </h3>

          {/* Package Subtitle - Distinct muted grey color */}
          {pkg.subtitle && (
            <p className={`text-sm md:text-base leading-relaxed ${pkg.highlighted ? 'text-white/70' : 'text-gray-500'}`}>
              {pkg.subtitle}
            </p>
          )}
        </div>

        {/* Pricing Section - Prominent with € symbol styling */}
        <div className="mb-6">
          {/* Original Price (strikethrough) */}
          {pkg.originalPrice && (
            <div className="mb-1">
              <span className={`text-lg line-through ${pkg.highlighted ? 'text-white/60' : 'text-gray-400'}`}>
                {pkg.originalPrice}
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-1 flex-wrap">
            {(() => {
              const priceString = getPrice(pkg)
              const hasEuro = priceString.includes('€')
              const numPart = priceString.replace(/€/g, '').trim()
              const euroPart = hasEuro ? '€' : ''
              return (
                <>
                  <span
                    className="text-4xl md:text-5xl font-bold leading-none"
                    style={{ color: getPriceColor(pkg) }}
                  >
                    {numPart}
                  </span>
                  {euroPart && (
                    <span 
                      className="text-2xl md:text-3xl font-semibold"
                      style={{ color: getPriceColor(pkg) }}
                    >
                      {euroPart}
                    </span>
                  )}
                </>
              )
            })()}
            {pkg.period && (
              <span className={`text-base md:text-lg ${pkg.highlighted ? 'text-white/80' : 'text-gray-500'}`}>
                /{pkg.period}
              </span>
            )}
          </div>
          {/* Partner Package Label */}
          {pkg.isPartner && (
            <div className="mt-2">
              <span className={`text-sm ${pkg.highlighted ? 'text-white/90' : 'text-gray-600'}`}>
                für 2 Personen / Gesamtpreis
              </span>
            </div>
          )}
        </div>

        {pkg.description && (
          <p className={`mb-6 ${pkg.highlighted ? 'text-white/90' : 'text-gray-600'}`}>
            {pkg.description}
          </p>
        )}

        {/* Features List - Improved spacing and alignment */}
        <ul className="space-y-4 mb-8">
          {packageFeatures.map((feature, idx) => renderFeature(feature, idx, pkg.highlighted || false, pkg.style))}
        </ul>

        <a
          href={pkg.cta?.link || pkg.ctaLink || '#'}
          className={getCtaButtonClasses(pkg)}
        >
          {pkg.cta?.text || pkg.ctaText || 'Auswählen'}
        </a>
      </div>
    )
  }

  // Render comparison table layout
  const renderComparisonTable = () => {
    if (!comparisonTable?.enabled && layout !== 'comparison') {
return null
}

    // Collect all unique features
    const allFeatures = new Set<string>()
    packages.forEach(pkg => {
      pkg.features.forEach(f => {
        const text = typeof f === 'string' ? f : f.text
        allFeatures.add(text)
      })
    })

    // Check if feature has differences across packages
    const hasFeatureDifference = (featureText: string) => {
      const results = packages.map(pkg =>
        pkg.features.some(f => {
          const text = typeof f === 'string' ? f : f.text
          const included = typeof f === 'string' ? true : f.included !== false
          return text === featureText && included
        })
      )
      return !results.every(r => r === results[0])
    }

    const showIcons = comparisonTable?.showIcons !== false
    const highlightDifferences = comparisonTable?.highlightDifferences === true

    return (
      <div className="overflow-x-auto mt-12">
        {comparisonTable?.title && (
          <h3 className="text-2xl font-bold text-center mb-8">{comparisonTable.title}</h3>
        )}
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-4 border-b-2 border-slate-200">Özellikler</th>
              {packages.map(pkg => (
                <th key={pkg.id} className={`p-4 border-b-2 border-slate-200 text-center ${pkg.highlighted ? 'bg-sage-50' : ''}`}>
                  <div className="font-bold text-lg">{pkg.name}</div>
                  <div className="text-sage-600 font-bold">{getPrice(pkg)}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from(allFeatures).map((featureText, idx) => {
              const hasDiff = hasFeatureDifference(featureText)
              const rowHighlight = highlightDifferences && hasDiff ? 'bg-amber-50' : (idx % 2 === 0 ? 'bg-slate-50' : '')

              return (
                <tr key={idx} className={rowHighlight}>
                  <td className="p-4 border-b border-slate-200">{featureText}</td>
                  {packages.map(pkg => {
                    const hasFeature = pkg.features.some(f => {
                      const text = typeof f === 'string' ? f : f.text
                      const included = typeof f === 'string' ? true : f.included !== false
                      return text === featureText && included
                    })
                    return (
                      <td key={pkg.id} className={`p-4 border-b border-slate-200 text-center ${pkg.highlighted ? 'bg-sage-50' : ''}`}>
                        {showIcons ? (
                          hasFeature ? (
                            <svg className="w-5 h-5 text-sage-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )
                        ) : (
                          <span className={hasFeature ? 'text-sage-600 font-medium' : 'text-gray-400'}>
                            {hasFeature ? 'Evet' : 'Hayır'}
                          </span>
                        )}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  // Render FAQ section
  const renderFAQ = () => {
    if (!faq?.enabled || !faq.items?.length) {
return null
}

    const faqLayout = faq.layout || 'accordion'

    return (
      <div className="mt-16 max-w-3xl mx-auto">
        {faq.title && (
          <h3 className="text-2xl font-bold text-center mb-8">{faq.title}</h3>
        )}
        {faqLayout === 'list' ? (
          // List layout - questions and answers displayed openly
          <div className="space-y-6">
            {faq.items.map((item, index) => (
              <div key={index} className="bg-white rounded-xl border border-slate-200 p-5">
                <h4 className="font-semibold text-slate-800 mb-2 flex items-start gap-3">
                  <span className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center text-sage-600 text-sm font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  {item.question}
                </h4>
                <p className="text-slate-600 pl-9">{item.answer}</p>
              </div>
            ))}
          </div>
        ) : (
          // Accordion layout - collapsible
          <div className="space-y-4">
            {faq.items.map((item, index) => (
              <details key={index} className="group bg-white rounded-xl border border-slate-200 overflow-hidden">
                <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-slate-50">
                  <span className="font-medium text-slate-800">{item.question}</span>
                  <svg className="w-5 h-5 text-slate-500 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-4 pb-4 text-slate-600">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        )}
      </div>
    )
  }

  // Responsive CSS
  const getResponsiveStyles = () => {
    const styles: string[] = []
    const sectionId = content.sectionId ? `#${content.sectionId}` : '.pricing-section'

    // Mobile
    if (responsive.mobile) {
      const mobileStyles: string[] = []
      if (responsive.mobile.padding) {
        mobileStyles.push(`${sectionId} { padding: ${responsive.mobile.padding}; }`)
      }
      if (responsive.mobile.columns) {
        mobileStyles.push(`${sectionId} .pricing-packages { grid-template-columns: repeat(${responsive.mobile.columns}, minmax(0, 1fr)); }`)
      }
      if (responsive.mobile.gap) {
        mobileStyles.push(`${sectionId} .pricing-packages { gap: ${responsive.mobile.gap}; }`)
      }
      if (mobileStyles.length) {
        styles.push(`@media (max-width: 640px) { ${mobileStyles.join(' ')} }`)
      }
    }

    // Tablet
    if (responsive.tablet) {
      const tabletStyles: string[] = []
      if (responsive.tablet.padding) {
        tabletStyles.push(`${sectionId} { padding: ${responsive.tablet.padding}; }`)
      }
      if (responsive.tablet.columns) {
        tabletStyles.push(`${sectionId} .pricing-packages { grid-template-columns: repeat(${responsive.tablet.columns}, minmax(0, 1fr)); }`)
      }
      if (responsive.tablet.gap) {
        tabletStyles.push(`${sectionId} .pricing-packages { gap: ${responsive.tablet.gap}; }`)
      }
      if (tabletStyles.length) {
        styles.push(`@media (min-width: 641px) and (max-width: 1024px) { ${tabletStyles.join(' ')} }`)
      }
    }

    // Desktop
    if (responsive.desktop) {
      const desktopStyles: string[] = []
      if (responsive.desktop.padding) {
        desktopStyles.push(`${sectionId} { padding: ${responsive.desktop.padding}; }`)
      }
      if (responsive.desktop.columns) {
        desktopStyles.push(`${sectionId} .pricing-packages { grid-template-columns: repeat(${responsive.desktop.columns}, minmax(0, 1fr)); }`)
      }
      if (responsive.desktop.gap) {
        desktopStyles.push(`${sectionId} .pricing-packages { gap: ${responsive.desktop.gap}; }`)
      }
      if (desktopStyles.length) {
        styles.push(`@media (min-width: 1025px) { ${desktopStyles.join(' ')} }`)
      }
    }

    return styles.join('\n')
  }

  // Combine all dynamic styles
  const dynamicStyles = `${getResponsiveStyles()}${getAnimationKeyframes()}`

  return (
    <>
      {dynamicStyles && (
        <style
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: dynamicStyles }}
        />
      )}
      <section
        id={content.sectionId}
        className={`pricing-section relative ${content.customClass || ''}`}
        style={{
          ...getBackgroundStyle(),
          paddingTop: content.padding?.top || '4rem',
          paddingBottom: content.padding?.bottom || '4rem'
        }}
      >
        {/* Pattern Overlay */}
        {background.type === 'pattern' && <div style={getPatternStyle() || undefined} />}

        {/* Color Overlay */}
        {background.overlayEnabled && (
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundColor: background.overlayColor || '#000000',
              opacity: (background.overlayOpacity || 20) / 100
            }}
          />
        )}

        <div className={`${getMaxWidthClass()} mx-auto px-4 sm:px-6 lg:px-8 relative z-10`}>
          {/* Header Section */}
          <div className={`mb-12 ${header.alignment === 'left' ? 'text-left' : header.alignment === 'right' ? 'text-right' : 'text-center'}`}>
            {/* Header Badge */}
            {header.badge?.text && (
              <div className="mb-4">
                <span
                  className="inline-block text-xs font-bold px-4 py-1.5 rounded-full"
                  style={{
                    backgroundColor: header.badge.backgroundColor || '#f0fdf4',
                    color: header.badge.textColor || '#166534'
                  }}
                >
                  {header.badge.text}
                </span>
              </div>
            )}

            {/* Legacy title support + new header.title */}
            {(header.title || content.title) && (
              <h2
                className="font-bold text-charcoal mb-4"
                style={{
                  fontSize: header.titleFontSize || header.typography?.titleSize || '2.25rem',
                  fontWeight: header.typography?.titleWeight || 700,
                  lineHeight: header.typography?.titleLineHeight || 1.2,
                  color: header.titleColor || header.typography?.subtitleColor || '#1e293b'
                }}
              >
                {header.title || content.title}
              </h2>
            )}

            {/* Legacy subtitle support + new header.subtitle */}
            {(header.subtitle || content.subtitle) && (
              <p
                className={`${header.alignment === 'center' ? 'max-w-2xl mx-auto' : ''}`}
                style={{
                  fontSize: header.subtitleFontSize || header.typography?.subtitleSize || '1.125rem',
                  color: header.subtitleColor || header.typography?.subtitleColor || '#64748b'
                }}
              >
                {header.subtitle || content.subtitle}
              </p>
            )}

            {header.description && (
              <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
                {header.description}
              </p>
            )}
          </div>

          {/* Tabs (Einzeltermin/Partnertermin) */}
          {tabs?.enabled && (
            <div className="flex items-center justify-center mb-12">
              <div 
                className="inline-flex rounded-lg p-1 bg-white border border-gray-200 shadow-sm"
                data-current={activeTab}
                data-easing="ease"
                data-duration-in="300"
                data-duration-out="100"
              >
                <button
                  onClick={() => setActiveTab('einzeltermin')}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === 'einzeltermin'
                      ? 'bg-sage-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  role="tab"
                  aria-selected={activeTab === 'einzeltermin'}
                >
                  {tabs.labels?.einzeltermin || 'Einzeltermin'}
                </button>
                <button
                  onClick={() => setActiveTab('partnertermin')}
                  className={`px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                    activeTab === 'partnertermin'
                      ? 'bg-sage-500 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                  role="tab"
                  aria-selected={activeTab === 'partnertermin'}
                >
                  {tabs.labels?.partnertermin || 'Partnertermin'}
                </button>
              </div>
            </div>
          )}

          {/* Billing Toggle */}
          {billingToggle?.enabled && (
            <div className="flex items-center justify-center mb-12">
              {billingToggle.style === 'pills' ? (
                // Pills style
                <div
                  className="inline-flex rounded-full p-1"
                  style={{ backgroundColor: billingToggle.backgroundColor || '#f1f5f9' }}
                >
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: billingCycle === 'monthly' ? (billingToggle.activeBackgroundColor || '#059669') : 'transparent',
                      color: billingCycle === 'monthly' ? (billingToggle.activeTextColor || '#ffffff') : (billingToggle.textColor || '#64748b')
                    }}
                  >
                    {billingToggle.monthlyLabel || 'Aylık'}
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                    style={{
                      backgroundColor: billingCycle === 'yearly' ? (billingToggle.activeBackgroundColor || '#059669') : 'transparent',
                      color: billingCycle === 'yearly' ? (billingToggle.activeTextColor || '#ffffff') : (billingToggle.textColor || '#64748b')
                    }}
                  >
                    {billingToggle.yearlyLabel || 'Yıllık'}
                    {billingToggle.yearlySavings && (
                      <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        {billingToggle.yearlySavings}
                      </span>
                    )}
                  </button>
                </div>
              ) : billingToggle.style === 'tabs' ? (
                // Tabs style
                <div className="inline-flex border-b-2" style={{ borderColor: billingToggle.backgroundColor || '#e2e8f0' }}>
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className="px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-[2px]"
                    style={{
                      borderColor: billingCycle === 'monthly' ? (billingToggle.activeBackgroundColor || '#059669') : 'transparent',
                      color: billingCycle === 'monthly' ? (billingToggle.activeBackgroundColor || '#059669') : (billingToggle.textColor || '#64748b')
                    }}
                  >
                    {billingToggle.monthlyLabel || 'Aylık'}
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className="px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-[2px]"
                    style={{
                      borderColor: billingCycle === 'yearly' ? (billingToggle.activeBackgroundColor || '#059669') : 'transparent',
                      color: billingCycle === 'yearly' ? (billingToggle.activeBackgroundColor || '#059669') : (billingToggle.textColor || '#64748b')
                    }}
                  >
                    {billingToggle.yearlyLabel || 'Yıllık'}
                    {billingToggle.yearlySavings && (
                      <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {billingToggle.yearlySavings}
                      </span>
                    )}
                  </button>
                </div>
              ) : billingToggle.style === 'buttons' ? (
                // Buttons style
                <div className="inline-flex gap-2">
                  <button
                    onClick={() => setBillingCycle('monthly')}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: billingCycle === 'monthly' ? (billingToggle.activeBackgroundColor || '#059669') : (billingToggle.backgroundColor || '#f1f5f9'),
                      color: billingCycle === 'monthly' ? (billingToggle.activeTextColor || '#ffffff') : (billingToggle.textColor || '#64748b')
                    }}
                  >
                    {billingToggle.monthlyLabel || 'Aylık'}
                  </button>
                  <button
                    onClick={() => setBillingCycle('yearly')}
                    className="px-5 py-2.5 rounded-lg text-sm font-medium transition-all"
                    style={{
                      backgroundColor: billingCycle === 'yearly' ? (billingToggle.activeBackgroundColor || '#059669') : (billingToggle.backgroundColor || '#f1f5f9'),
                      color: billingCycle === 'yearly' ? (billingToggle.activeTextColor || '#ffffff') : (billingToggle.textColor || '#64748b')
                    }}
                  >
                    {billingToggle.yearlyLabel || 'Yıllık'}
                    {billingToggle.yearlySavings && (
                      <span className="ml-1 text-xs bg-white/20 px-2 py-0.5 rounded-full">
                        {billingToggle.yearlySavings}
                      </span>
                    )}
                  </button>
                </div>
              ) : (
                // Toggle style (default)
                <div className="flex items-center gap-4">
                  <span
                    className="text-sm font-medium cursor-pointer transition-colors"
                    style={{
                      color: billingCycle === 'monthly'
                        ? (billingToggle.activeBackgroundColor || '#059669')
                        : (billingToggle.textColor || '#64748b')
                    }}
                    onClick={() => setBillingCycle('monthly')}
                  >
                    {billingToggle.monthlyLabel || 'Aylık'}
                  </span>
                  <button
                    onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                    className="relative w-14 h-7 rounded-full transition-colors"
                    style={{
                      backgroundColor: billingCycle === 'yearly'
                        ? (billingToggle.activeBackgroundColor || '#059669')
                        : (billingToggle.backgroundColor || '#e2e8f0')
                    }}
                  >
                    <span
                      className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${
                        billingCycle === 'yearly' ? 'translate-x-8' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span
                    className="text-sm font-medium cursor-pointer transition-colors"
                    style={{
                      color: billingCycle === 'yearly'
                        ? (billingToggle.activeBackgroundColor || '#059669')
                        : (billingToggle.textColor || '#64748b')
                    }}
                    onClick={() => setBillingCycle('yearly')}
                  >
                    {billingToggle.yearlyLabel || 'Yıllık'}
                    {billingToggle.yearlySavings && (
                      <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {billingToggle.yearlySavings}
                      </span>
                    )}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Trust Element (above-packages) */}
          {trustElement?.enabled && trustElement.text && trustElement.position === 'above-packages' && (
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                {trustElement.icon && <span className="text-lg">{trustElement.icon}</span>}
                <span>{trustElement.text}</span>
              </div>
            </div>
          )}

          {/* Packages */}
          {packages.length > 0 ? (
            <div className={`pricing-packages ${getLayoutClasses()}`} style={{ gap: content.packageGap || '2rem' }}>
              {layout === 'comparison' ? renderComparisonTable() : filteredPackages.map((pkg, index) => renderPackageCard(pkg, index))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <p className="text-gray-400">Henüz paket eklenmedi</p>
            </div>
          )}

          {/* Comparison Table (for non-comparison layouts) */}
          {layout !== 'comparison' && comparisonTable?.enabled && renderComparisonTable()}

          {/* Trust Element (below-packages or default) */}
          {trustElement?.enabled && trustElement.text && trustElement.position !== 'in-footer' && trustElement.position !== 'above-packages' && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                {trustElement.icon && <span className="text-lg">{trustElement.icon}</span>}
                <span>{trustElement.text}</span>
              </div>
            </div>
          )}

          {/* Footer CTA */}
          {content.footerCta?.enabled && (
            <div className="mt-16 text-center">
              {content.footerCta.text && (
                <p className="text-xl font-semibold text-gray-800 mb-2">{content.footerCta.text}</p>
              )}
              {content.footerCta.subtext && (
                <p className="text-gray-600 mb-4">{content.footerCta.subtext}</p>
              )}
              {content.footerCta.buttonText && (
                <a
                  href={content.footerCta.buttonLink || '#'}
                  className={`inline-block px-8 py-3 rounded-xl font-medium transition-colors ${
                    content.footerCta.buttonStyle === 'outline'
                      ? 'border-2 border-sage-500 text-sage-600 hover:bg-sage-50'
                      : content.footerCta.buttonStyle === 'secondary'
                        ? 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                        : 'bg-sage-500 text-white hover:bg-forest-600'
                  }`}
                >
                  {content.footerCta.buttonText}
                </a>
              )}
            </div>
          )}

          {/* FAQ Section */}
          {renderFAQ()}

          {/* Trust Element (in-footer) */}
          {trustElement?.enabled && trustElement.text && trustElement.position === 'in-footer' && (
            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
                {trustElement.icon && <span className="text-lg">{trustElement.icon}</span>}
                <span>{trustElement.text}</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  )
}
