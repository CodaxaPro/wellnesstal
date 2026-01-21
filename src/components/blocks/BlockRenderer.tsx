'use client'

import AboutBlock from './AboutBlock'
import ContactBlock from './ContactBlock'
import CtaBlock from './CtaBlock'
import DividerBlock from './DividerBlock'
import EmbedBlock from './EmbedBlock'
import FaqBlock from './FaqBlock'
import FeaturesBlock from './FeaturesBlock'
import FooterBlock from './FooterBlock'
import GalleryBlock from './GalleryBlock'
import HeaderBlock from './HeaderBlock'
import HeroBlock from './HeroBlock'
import PricingBlock from './PricingBlock'
import SEOBlock from './SEOBlock'
import ServicesBlock from './ServicesBlock'
import StatsBlock from './StatsBlock'
import StickyButtonBlock from './StickyButtonBlock'
import TeamBlock from './TeamBlock'
import TestimonialsBlock from './TestimonialsBlock'
import TextBlock from './TextBlock'
import { PageBlock, BlockProps } from './types'
import VideoBlock from './VideoBlock'
import WhatsAppBlock from './WhatsAppBlock'

interface BlockRendererProps {
  blocks: PageBlock[]
  isEditing?: boolean
  onBlockUpdate?: (blockId: string, content: Record<string, any>) => void
  pageSlug?: string // Add page slug to help with hash scrolling
}

// Component mapping
const blockComponents: Record<string, React.ComponentType<BlockProps>> = {
  hero: HeroBlock,
  text: TextBlock,
  features: FeaturesBlock,
  gallery: GalleryBlock,
  services: ServicesBlock,
  pricing: PricingBlock,
  testimonials: TestimonialsBlock,
  about: AboutBlock,
  contact: ContactBlock,
  cta: CtaBlock,
  faq: FaqBlock,
  video: VideoBlock,
  team: TeamBlock,
  stats: StatsBlock,
  divider: DividerBlock,
  whatsapp: WhatsAppBlock,
  embed: EmbedBlock,
  header: HeaderBlock,
  footer: FooterBlock,
  seo: SEOBlock,
  'sticky-button': StickyButtonBlock,
}

export default function BlockRenderer({ blocks, isEditing, onBlockUpdate }: BlockRendererProps) {
  // Sort blocks by position
  const sortedBlocks = [...blocks].sort((a, b) => a.position - b.position)

  return (
    <div className="block-renderer">
      {sortedBlocks.map((block) => {
        if (!block.visible && !isEditing) {
return null
}

        const BlockComponent = blockComponents[block.block_type]

        if (!BlockComponent) {
          // Fallback for unknown block types
          return (
            <div key={block.id} className="py-8 bg-gray-100 text-center">
              <p className="text-gray-500">
                Block type "{block.block_type}" is not implemented yet.
              </p>
            </div>
          )
        }

        return (
          <div
            key={block.id}
            className={`block-wrapper w-full ${!block.visible ? 'opacity-50' : ''}`}
            data-block-id={block.id}
            data-block-type={block.block_type}
          >
            {onBlockUpdate ? (
              <BlockComponent
                block={block}
                isEditing={isEditing ?? false}
                onUpdate={(content) => onBlockUpdate(block.id, content)}
              />
            ) : (
              <BlockComponent
                block={block}
                isEditing={isEditing ?? false}
              />
            )}
          </div>
        )
      })}

      {blocks.length === 0 && (
        <div className="py-20 text-center bg-gray-50">
          <p className="text-gray-400 text-lg">
            Bu sayfa henüz içerik eklenmedi.
          </p>
        </div>
      )}
    </div>
  )
}
