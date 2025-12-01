'use client'

import { useState, useMemo } from 'react'
import { ChevronDown, ChevronRight, Plus, Minus, Search, ThumbsUp, ThumbsDown, MessageCircle, HelpCircle, X } from 'lucide-react'
import {
  BlockProps,
  FAQContent,
  FAQItem,
  FAQCategory,
  FAQAccordionStyle,
  FAQCardStyle,
  FAQBackground,
  FAQAnimations
} from './types'

// Deep merge utility
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge<T>(target: T, source: Partial<T>): T {
  const output = { ...target } as any
  for (const key in source) {
    if (source[key] !== undefined) {
      const sourceValue = source[key]
      if (typeof sourceValue === 'object' && sourceValue !== null && !Array.isArray(sourceValue)) {
        output[key] = deepMerge(target[key as keyof T] || ({} as any), sourceValue as any)
      } else {
        output[key] = sourceValue
      }
    }
  }
  return output
}

// Default values
const defaultContent: FAQContent = {
  layout: 'accordion',
  maxWidth: 'lg',
  header: {
    title: 'Sıkça Sorulan Sorular',
    subtitle: 'Merak ettiğiniz her şeyin cevabı burada',
    alignment: 'center'
  },
  items: [],
  padding: { top: '4rem', bottom: '4rem' },
  itemGap: '1rem',
  accordionSettings: {
    allowMultipleOpen: false,
    collapseOthersOnOpen: true
  },
  animations: {
    enabled: true,
    type: 'fade',
    expandAnimation: 'smooth',
    expandDuration: 300,
    hoverEffects: true
  }
}

const defaultAccordionStyle: FAQAccordionStyle = {
  backgroundColor: '#ffffff',
  borderColor: '#e2e8f0',
  borderWidth: 1,
  borderRadius: '0.75rem',
  shadow: 'sm',
  gap: '0.75rem',
  padding: '1rem 1.25rem',
  questionBackgroundColor: 'transparent',
  questionHoverBackgroundColor: '#f8fafc',
  questionPadding: '1rem 1.25rem',
  questionBorderRadius: '0.75rem',
  answerBackgroundColor: 'transparent',
  answerPadding: '0 1.25rem 1rem',
  expandIcon: 'chevron',
  expandIconPosition: 'right',
  expandIconColor: '#64748b',
  expandIconSize: '1.25rem',
  openBackgroundColor: '#ffffff',
  openBorderColor: '#86a789',
  openShadow: 'md'
}

const defaultCardStyle: FAQCardStyle = {
  backgroundColor: '#ffffff',
  borderColor: '#e2e8f0',
  borderWidth: 1,
  borderRadius: '1rem',
  shadow: 'md',
  padding: '1.5rem',
  hoverEffect: 'lift',
  hoverBorderColor: '#86a789'
}

const defaultBackground: FAQBackground = {
  type: 'solid',
  color: '#f8fafc'
}

// Expand Icon Component
function ExpandIcon({
  iconType,
  isOpen,
  color,
  size
}: {
  iconType: string
  isOpen: boolean
  color?: string
  size?: string
}) {
  const iconStyle = { color, width: size, height: size }

  switch (iconType) {
    case 'plus':
      return isOpen ? <Minus style={iconStyle} /> : <Plus style={iconStyle} />
    case 'arrow':
      return (
        <ChevronRight
          className={`transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`}
          style={iconStyle}
        />
      )
    case 'caret':
    case 'chevron':
    default:
      return (
        <ChevronDown
          className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          style={iconStyle}
        />
      )
  }
}

// Accordion Item Component
function AccordionItem({
  item,
  isOpen,
  onToggle,
  style,
  typography,
  animations,
  showHelpful,
  helpfulConfig,
  index
}: {
  item: FAQItem
  isOpen: boolean
  onToggle: () => void
  style: FAQAccordionStyle
  typography?: FAQContent['typography']
  animations?: FAQAnimations
  showHelpful?: boolean
  helpfulConfig?: FAQContent['helpfulVotes']
  index: number
}) {
  const animationDelay = animations?.stagger ? (index * (animations.staggerDelay || 100)) : 0

  return (
    <div
      className={`overflow-hidden transition-all duration-300 ${
        isOpen ? 'shadow-md' : 'shadow-sm hover:shadow-md'
      }`}
      style={{
        backgroundColor: isOpen ? style.openBackgroundColor : style.backgroundColor,
        borderColor: isOpen ? style.openBorderColor : style.borderColor,
        borderWidth: style.borderWidth,
        borderStyle: 'solid',
        borderRadius: style.borderRadius,
        animationDelay: `${animationDelay}ms`
      }}
    >
      {/* Question */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between text-left transition-colors duration-200 ${
          animations?.hoverEffects ? 'hover:bg-slate-50' : ''
        }`}
        style={{
          padding: style.questionPadding,
          borderRadius: style.questionBorderRadius
        }}
      >
        <span
          className="font-medium pr-4"
          style={{
            fontSize: typography?.question?.fontSize || '1rem',
            fontWeight: typography?.question?.fontWeight || '500',
            lineHeight: typography?.question?.lineHeight || '1.5',
            color: typography?.question?.color || '#1e293b'
          }}
        >
          {item.question}
        </span>
        {style.expandIcon !== 'none' && (
          <span className="flex-shrink-0">
            <ExpandIcon
              iconType={style.expandIcon || 'chevron'}
              isOpen={isOpen}
              color={style.expandIconColor}
              size={style.expandIconSize}
            />
          </span>
        )}
      </button>

      {/* Answer */}
      <div
        className={`overflow-hidden transition-all ${
          animations?.expandAnimation === 'smooth' ? 'duration-300 ease-in-out' :
          animations?.expandAnimation === 'spring' ? 'duration-500 ease-out' :
          'duration-0'
        }`}
        style={{
          maxHeight: isOpen ? '500px' : '0',
          opacity: isOpen ? 1 : 0
        }}
      >
        <div
          style={{
            padding: style.answerPadding,
            backgroundColor: style.answerBackgroundColor
          }}
        >
          <p
            style={{
              fontSize: typography?.answer?.fontSize || '0.95rem',
              fontWeight: typography?.answer?.fontWeight || '400',
              lineHeight: typography?.answer?.lineHeight || '1.7',
              color: typography?.answer?.color || '#64748b'
            }}
          >
            {item.answer}
          </p>

          {/* Related Links */}
          {item.relatedLinks && item.relatedLinks.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.relatedLinks.map((link, i) => (
                <a
                  key={i}
                  href={link.url}
                  className="text-sm text-sage-600 hover:text-sage-700 underline"
                >
                  {link.text}
                </a>
              ))}
            </div>
          )}

          {/* Helpful Votes */}
          {showHelpful && helpfulConfig?.enabled && (
            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
              <span className="text-sm text-slate-500">{helpfulConfig.text || 'Bu cevap faydalı oldu mu?'}</span>
              <div className="flex gap-2">
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-green-100 text-slate-600 hover:text-green-600 text-sm transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                  {helpfulConfig.yesText || 'Evet'}
                  {helpfulConfig.showCounts && item.helpful && <span className="text-xs">({item.helpful.yes})</span>}
                </button>
                <button className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-red-100 text-slate-600 hover:text-red-600 text-sm transition-colors">
                  <ThumbsDown className="w-4 h-4" />
                  {helpfulConfig.noText || 'Hayır'}
                  {helpfulConfig.showCounts && item.helpful && <span className="text-xs">({item.helpful.no})</span>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Card Item Component
function CardItem({
  item,
  style,
  typography,
  onClick,
  index,
  animations
}: {
  item: FAQItem
  style: FAQCardStyle
  typography?: FAQContent['typography']
  onClick?: () => void
  index: number
  animations?: FAQAnimations
}) {
  const hoverClasses = {
    'lift': 'hover:-translate-y-1 hover:shadow-lg',
    'scale': 'hover:scale-[1.02]',
    'glow': 'hover:ring-2 hover:ring-sage-400/30',
    'border': '',
    'none': ''
  }

  const animationDelay = animations?.stagger ? (index * (animations.staggerDelay || 100)) : 0

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer transition-all duration-300 ${hoverClasses[style.hoverEffect || 'lift']}`}
      style={{
        backgroundColor: style.backgroundColor,
        borderColor: style.borderColor,
        borderWidth: style.borderWidth,
        borderStyle: 'solid',
        borderRadius: style.borderRadius,
        padding: style.padding,
        boxShadow: style.shadow === 'none' ? 'none' :
          style.shadow === 'sm' ? '0 1px 2px rgba(0,0,0,0.05)' :
          style.shadow === 'md' ? '0 4px 6px -1px rgba(0,0,0,0.1)' :
          style.shadow === 'lg' ? '0 10px 15px -3px rgba(0,0,0,0.1)' :
          '0 25px 50px -12px rgba(0,0,0,0.25)',
        animationDelay: `${animationDelay}ms`
      }}
    >
      {/* Question Icon */}
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-sage-100 flex items-center justify-center flex-shrink-0">
          <HelpCircle className="w-4 h-4 text-sage-600" />
        </div>
        <div className="flex-1">
          <h3
            className="font-medium mb-2"
            style={{
              fontSize: typography?.question?.fontSize || '1rem',
              color: typography?.question?.color || '#1e293b'
            }}
          >
            {item.question}
          </h3>
          <p
            className="line-clamp-3"
            style={{
              fontSize: typography?.answer?.fontSize || '0.875rem',
              color: typography?.answer?.color || '#64748b'
            }}
          >
            {item.answer}
          </p>
        </div>
      </div>

      {/* Featured Badge */}
      {item.featured && (
        <div className="mt-3">
          <span className="text-xs font-medium px-2 py-1 bg-amber-100 text-amber-700 rounded-full">
            Popüler Soru
          </span>
        </div>
      )}
    </div>
  )
}

// Search Component
function FAQSearch({
  config,
  value,
  onChange
}: {
  config: FAQContent['search']
  value: string
  onChange: (value: string) => void
}) {
  if (!config?.enabled) return null

  return (
    <div
      className="relative mb-6"
      style={{
        position: config.position === 'sticky' ? 'sticky' : 'relative',
        top: config.position === 'sticky' ? '1rem' : 'auto',
        zIndex: 10
      }}
    >
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
          style={{ color: config.iconColor || '#94a3b8' }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={config.placeholder || 'Soru ara...'}
          className="w-full pl-12 pr-10 py-3 rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-sage-500/20"
          style={{
            backgroundColor: config.backgroundColor || '#ffffff',
            borderColor: config.borderColor || '#e2e8f0',
            borderRadius: config.borderRadius || '0.75rem'
          }}
        />
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  )
}

// Category Tabs Component
function CategoryTabs({
  categories,
  activeCategory,
  onSelect,
  style
}: {
  categories: FAQCategory[]
  activeCategory: string | null
  onSelect: (id: string | null) => void
  style?: 'tabs' | 'pills' | 'buttons' | 'dropdown'
}) {
  if (style === 'dropdown') {
    return (
      <div className="mb-6">
        <select
          value={activeCategory || ''}
          onChange={(e) => onSelect(e.target.value || null)}
          className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sage-500/20"
        >
          <option value="">Tüm Kategoriler</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
      </div>
    )
  }

  const styleClasses = {
    tabs: 'border-b border-slate-200',
    pills: 'bg-slate-100 p-1 rounded-xl',
    buttons: 'gap-2'
  }

  const itemClasses = {
    tabs: (active: boolean) => `px-4 py-2 border-b-2 transition-colors ${active ? 'border-sage-500 text-sage-600' : 'border-transparent text-slate-600 hover:text-slate-800'}`,
    pills: (active: boolean) => `px-4 py-2 rounded-lg transition-colors ${active ? 'bg-white text-sage-600 shadow-sm' : 'text-slate-600 hover:text-slate-800'}`,
    buttons: (active: boolean) => `px-4 py-2 rounded-lg border transition-colors ${active ? 'bg-sage-500 text-white border-sage-500' : 'bg-white text-slate-600 border-slate-200 hover:border-sage-300'}`
  }

  return (
    <div className={`flex flex-wrap mb-6 ${styleClasses[style || 'tabs']}`}>
      <button
        onClick={() => onSelect(null)}
        className={itemClasses[style || 'tabs'](!activeCategory)}
      >
        Tümü
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.id)}
          className={itemClasses[style || 'tabs'](activeCategory === cat.id)}
        >
          {cat.name}
        </button>
      ))}
    </div>
  )
}

// Contact CTA Component
function ContactCTA({ config }: { config: FAQContent['contactCTA'] }) {
  if (!config?.enabled) return null

  return (
    <div
      className="mt-8 p-6 rounded-2xl text-center"
      style={{
        backgroundColor: config.backgroundColor || '#f0fdf4',
        borderRadius: config.borderRadius || '1rem'
      }}
    >
      <div className="flex items-center justify-center gap-2 mb-2">
        <MessageCircle className="w-5 h-5 text-sage-600" />
        <h3 className="font-semibold text-slate-800">
          {config.title || 'Sorunuz mu var?'}
        </h3>
      </div>
      {config.subtitle && (
        <p className="text-slate-600 text-sm mb-4">{config.subtitle}</p>
      )}
      {config.buttonText && config.buttonLink && (
        <a
          href={config.buttonLink}
          className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-medium transition-colors ${
            config.buttonStyle === 'primary' ? 'bg-sage-500 text-white hover:bg-sage-600' :
            config.buttonStyle === 'secondary' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200' :
            'border border-sage-500 text-sage-600 hover:bg-sage-50'
          }`}
        >
          {config.buttonText}
        </a>
      )}
    </div>
  )
}

// Background Renderer
function renderBackground(bg: FAQBackground): React.CSSProperties {
  const styles: React.CSSProperties = {}

  switch (bg.type) {
    case 'solid':
      styles.backgroundColor = bg.color || '#f8fafc'
      break
    case 'gradient':
      const dir = bg.gradientDirection?.replace('to-', 'to ').replace('-', ' ') || 'to bottom'
      if (bg.gradientVia) {
        styles.background = `linear-gradient(${dir}, ${bg.gradientFrom}, ${bg.gradientVia}, ${bg.gradientTo})`
      } else {
        styles.background = `linear-gradient(${dir}, ${bg.gradientFrom}, ${bg.gradientTo})`
      }
      break
    case 'image':
      styles.backgroundImage = `url(${bg.imageUrl})`
      styles.backgroundPosition = bg.imagePosition || 'center'
      styles.backgroundSize = bg.imageSize || 'cover'
      break
    case 'pattern':
      styles.backgroundColor = bg.color || '#f8fafc'
      break
  }

  return styles
}

// Max Width Classes
const maxWidthClasses = {
  sm: 'max-w-2xl',
  md: 'max-w-3xl',
  lg: 'max-w-4xl',
  xl: 'max-w-5xl',
  '2xl': 'max-w-6xl',
  full: 'max-w-full'
}

// Main Component
export default function FAQBlock({ block }: BlockProps) {
  const content = deepMerge(defaultContent, (block.content || {}) as Partial<FAQContent>)
  const accordionStyle = deepMerge(defaultAccordionStyle, content.accordionStyle || {})
  const cardStyle = deepMerge(defaultCardStyle, content.cardStyle || {})
  const background = deepMerge(defaultBackground, content.background || {})

  // State
  const [openIndices, setOpenIndices] = useState<number[]>(() => {
    const defaultOpen = content.accordionSettings?.defaultOpenIndex
    if (Array.isArray(defaultOpen)) return defaultOpen
    if (typeof defaultOpen === 'number') return [defaultOpen]
    return []
  })
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [selectedCard, setSelectedCard] = useState<FAQItem | null>(null)

  // Filter items
  const filteredItems = useMemo(() => {
    let items = content.items || []

    // Filter by category
    if (activeCategory) {
      items = items.filter(item => item.categoryId === activeCategory)
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      items = items.filter(item => {
        const matchQuestion = item.question.toLowerCase().includes(query)
        const matchAnswer = content.search?.searchInAnswers !== false &&
          item.answer.toLowerCase().includes(query)
        return matchQuestion || matchAnswer
      })
    }

    // Sort: pinned first, then featured, then by order
    return [...items].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1
      if (!a.pinned && b.pinned) return 1
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      return (a.order || 0) - (b.order || 0)
    })
  }, [content.items, activeCategory, searchQuery, content.search?.searchInAnswers])

  // Toggle accordion
  const toggleAccordion = (index: number) => {
    setOpenIndices(prev => {
      const isOpen = prev.includes(index)
      if (isOpen) {
        return prev.filter(i => i !== index)
      }
      if (content.accordionSettings?.allowMultipleOpen) {
        return [...prev, index]
      }
      return [index]
    })
  }

  // Grid layout for cards/grid
  const getGridCols = () => {
    const responsive = content.responsive
    if (!responsive) return 'grid-cols-1 md:grid-cols-2'
    return `grid-cols-1 md:grid-cols-${responsive.tablet?.columns || 2} lg:grid-cols-${responsive.desktop?.columns || 2}`
  }

  // Header Component
  const header = content.header
  const title = header?.title || content.title

  return (
    <section
      id={content.sectionId}
      className={`relative ${content.customClass || ''}`}
      style={{
        ...renderBackground(background),
        paddingTop: content.padding?.top,
        paddingBottom: content.padding?.bottom
      }}
    >
      {/* Overlay for image backgrounds */}
      {background.type === 'image' && background.overlayEnabled && (
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundColor: background.overlayColor,
            opacity: background.overlayOpacity
          }}
        />
      )}

      <div className={`relative z-10 mx-auto px-4 ${maxWidthClasses[content.maxWidth || 'lg']}`}>
        {/* Header */}
        {(title || header?.subtitle || header?.description) && (
          <div
            className="mb-10"
            style={{ textAlign: header?.alignment || 'center' }}
          >
            {header?.badge?.enabled && (
              <span
                className="inline-block px-3 py-1 rounded-full text-sm font-medium mb-4"
                style={{
                  backgroundColor: header.badge.backgroundColor || '#f0fdf4',
                  color: header.badge.textColor || '#15803d'
                }}
              >
                {header.badge.text}
              </span>
            )}
            {title && (
              <h2
                className="font-bold mb-4"
                style={{
                  fontSize: header?.typography?.titleSize || '2.25rem',
                  fontWeight: header?.typography?.titleWeight || '700',
                  color: header?.typography?.titleColor || '#1e293b'
                }}
              >
                {title}
              </h2>
            )}
            {header?.subtitle && (
              <p
                className="max-w-2xl mx-auto"
                style={{
                  fontSize: header?.typography?.subtitleSize || '1.125rem',
                  color: header?.typography?.subtitleColor || '#64748b'
                }}
              >
                {header.subtitle}
              </p>
            )}
            {header?.description && (
              <p
                className="mt-2 max-w-3xl mx-auto"
                style={{
                  fontSize: header?.typography?.descriptionSize || '1rem',
                  color: header?.typography?.descriptionColor || '#94a3b8'
                }}
              >
                {header.description}
              </p>
            )}
          </div>
        )}

        {/* Search */}
        <FAQSearch
          config={content.search}
          value={searchQuery}
          onChange={setSearchQuery}
        />

        {/* Category Tabs */}
        {content.showCategories && content.categories && content.categories.length > 0 && (
          <CategoryTabs
            categories={content.categories}
            activeCategory={activeCategory}
            onSelect={setActiveCategory}
            style={content.categoryStyle}
          />
        )}

        {/* No Results */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <HelpCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">
              {content.search?.noResultsText || 'Aradığınız kriterlere uygun soru bulunamadı.'}
            </p>
          </div>
        )}

        {/* Accordion Layout */}
        {(content.layout === 'accordion' || content.layout === 'accordion-multi') && (
          <div
            className="space-y-3"
            style={{ gap: content.itemGap }}
          >
            {filteredItems.map((item, index) => (
              <AccordionItem
                key={item.id || index}
                item={item}
                isOpen={openIndices.includes(index)}
                onToggle={() => toggleAccordion(index)}
                style={accordionStyle}
                typography={content.typography}
                animations={content.animations}
                showHelpful={content.helpfulVotes?.enabled}
                helpfulConfig={content.helpfulVotes}
                index={index}
              />
            ))}
          </div>
        )}

        {/* Grid/Cards Layout */}
        {(content.layout === 'grid' || content.layout === 'cards') && (
          <>
            <div
              className={`grid gap-4 ${getGridCols()}`}
              style={{ gap: content.itemGap }}
            >
              {filteredItems.map((item, index) => (
                <CardItem
                  key={item.id || index}
                  item={item}
                  style={cardStyle}
                  typography={content.typography}
                  onClick={() => setSelectedCard(item)}
                  index={index}
                  animations={content.animations}
                />
              ))}
            </div>

            {/* Card Modal */}
            {selectedCard && (
              <div
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
                onClick={() => setSelectedCard(null)}
              >
                <div
                  className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-auto"
                  onClick={e => e.stopPropagation()}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-lg font-semibold text-slate-800 pr-4">
                        {selectedCard.question}
                      </h3>
                      <button
                        onClick={() => setSelectedCard(null)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-slate-600 leading-relaxed">
                      {selectedCard.answer}
                    </p>
                    {selectedCard.relatedLinks && selectedCard.relatedLinks.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100">
                        <p className="text-sm font-medium text-slate-700 mb-2">İlgili Bağlantılar:</p>
                        <div className="flex flex-wrap gap-2">
                          {selectedCard.relatedLinks.map((link, i) => (
                            <a
                              key={i}
                              href={link.url}
                              className="text-sm text-sage-600 hover:text-sage-700 underline"
                            >
                              {link.text}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Minimal Layout */}
        {content.layout === 'minimal' && (
          <div className="divide-y divide-slate-200">
            {filteredItems.map((item, index) => (
              <div
                key={item.id || index}
                className="py-5"
              >
                <h3
                  className="font-medium text-slate-800 mb-2"
                  style={{ fontSize: content.typography?.question?.fontSize }}
                >
                  {item.question}
                </h3>
                <p
                  className="text-slate-600"
                  style={{ fontSize: content.typography?.answer?.fontSize }}
                >
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Timeline Layout */}
        {content.layout === 'timeline' && (
          <div className="relative pl-8 border-l-2 border-sage-200">
            {filteredItems.map((item, index) => (
              <div
                key={item.id || index}
                className="relative pb-8 last:pb-0"
              >
                <div className="absolute -left-[calc(1rem+1px)] top-0 w-4 h-4 rounded-full bg-sage-500 border-4 border-white shadow" />
                <div className="ml-4">
                  <h3
                    className="font-medium text-slate-800 mb-2"
                    style={{ fontSize: content.typography?.question?.fontSize }}
                  >
                    {item.question}
                  </h3>
                  <p
                    className="text-slate-600"
                    style={{ fontSize: content.typography?.answer?.fontSize }}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Text */}
        {content.footerText && (
          <p className="text-center text-slate-500 text-sm mt-8">
            {content.footerText}
          </p>
        )}

        {/* Contact CTA */}
        <ContactCTA config={content.contactCTA} />

        {/* Schema Markup for SEO */}
        {content.schemaMarkup?.enabled && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                '@context': 'https://schema.org',
                '@type': 'FAQPage',
                mainEntity: filteredItems.map(item => ({
                  '@type': 'Question',
                  name: item.question,
                  acceptedAnswer: {
                    '@type': 'Answer',
                    text: item.answer
                  }
                }))
              })
            }}
          />
        )}
      </div>
    </section>
  )
}

// Also export with old name for backward compatibility
export { FAQBlock as FaqBlock }
