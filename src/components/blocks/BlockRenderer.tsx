'use client'

import { PageBlock, BlockProps } from './types'
import TextBlock from './TextBlock'
import FeaturesBlock from './FeaturesBlock'
import GalleryBlock from './GalleryBlock'
import ServicesBlock from './ServicesBlock'
import PricingBlock from './PricingBlock'
import TestimonialsBlock from './TestimonialsBlock'
import AboutBlock from './AboutBlock'
import ContactBlock from './ContactBlock'
import CtaBlock from './CtaBlock'
import FaqBlock from './FaqBlock'
import VideoBlock from './VideoBlock'
import TeamBlock from './TeamBlock'
import StatsBlock from './StatsBlock'
import DividerBlock from './DividerBlock'
import WhatsAppBlock from './WhatsAppBlock'
import EmbedBlock from './EmbedBlock'
import HeaderBlock from './HeaderBlock'
import FooterBlock from './FooterBlock'
import SEOBlock from './SEOBlock'
import HeroBlock from './HeroBlock'
import StickyButtonBlock from './StickyButtonBlock'

interface BlockRendererProps {
  blocks: PageBlock[]
  isEditing?: boolean
  onBlockUpdate?: (blockId: string, content: Record<string, any>) => void
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
        if (!block.visible && !isEditing) return null

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
            <BlockComponent
              block={block}
              isEditing={isEditing}
              onUpdate={onBlockUpdate ? (content) => onBlockUpdate(block.id, content) : undefined}
            />
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
