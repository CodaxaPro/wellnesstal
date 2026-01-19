import SimpleCTA from './variants/cta/SimpleCTA';
import Grid3Features from './variants/features/Grid3Features';
import FourColumnFooter from './variants/footers/FourColumnFooter';
import ThreeColumnFooter from './variants/footers/ThreeColumnFooter';
import ClassicHeader from './variants/headers/ClassicHeader';
import MinimalHeader from './variants/headers/MinimalHeader';
import ModernHeader from './variants/headers/ModernHeader';
import CenteredHero from './variants/heroes/CenteredHero';
import FullBGHero from './variants/heroes/FullBGHero';
import SplitHero from './variants/heroes/SplitHero';
import CardsServices from './variants/services/CardsServices';

export const variantRegistry = {
  headers: {
    classic: {
      id: 'classic',
      name: 'Classic',
      component: ClassicHeader,
      thumbnail: '/thumbnails/header-classic.png',
      description: 'Traditional header with logo and navigation'
    },
    modern: {
      id: 'modern',
      name: 'Modern',
      component: ModernHeader,
      thumbnail: '/thumbnails/header-modern.png',
      description: 'Dark gradient header with modern styling'
    },
    minimal: {
      id: 'minimal',
      name: 'Minimal',
      component: MinimalHeader,
      thumbnail: '/thumbnails/header-minimal.png',
      description: 'Clean and minimal header design'
    },
  },

  heroes: {
    split: {
      id: 'split',
      name: 'Split',
      component: SplitHero,
      thumbnail: '/thumbnails/hero-split.png',
      description: 'Two-column layout with image'
    },
    centered: {
      id: 'centered',
      name: 'Centered',
      component: CenteredHero,
      thumbnail: '/thumbnails/hero-centered.png',
      description: 'Centered hero with gradient background'
    },
    fullbg: {
      id: 'fullbg',
      name: 'Full BG',
      component: FullBGHero,
      thumbnail: '/thumbnails/hero-fullbg.png',
      description: 'Full background image hero'
    },
  },

  features: {
    'grid-3': {
      id: 'grid-3',
      name: 'Grid 3',
      component: Grid3Features,
      thumbnail: '/thumbnails/features-grid3.png',
      description: '3-column feature grid'
    },
  },

  services: {
    cards: {
      id: 'cards',
      name: 'Cards',
      component: CardsServices,
      thumbnail: '/thumbnails/services-cards.png',
      description: 'Service pricing cards'
    },
  },

  cta: {
    simple: {
      id: 'simple',
      name: 'Simple',
      component: SimpleCTA,
      thumbnail: '/thumbnails/cta-simple.png',
      description: 'Simple call-to-action'
    },
  },

  footers: {
    '4-col': {
      id: '4-col',
      name: '4 Column',
      component: FourColumnFooter,
      thumbnail: '/thumbnails/footer-4col.png',
      description: 'Four column footer layout'
    },
    '3-col': {
      id: '3-col',
      name: '3 Column',
      component: ThreeColumnFooter,
      thumbnail: '/thumbnails/footer-3col.png',
      description: 'Three column footer layout'
    },
  }
};

// Helper function to get component
export function getVariantComponent(section: string, variantId: string) {
  const registry = variantRegistry as any;
  return registry[section]?.[variantId]?.component || null;
}

// Helper to get all variants for a section
export function getSectionVariants(section: string) {
  const registry = variantRegistry as any;
  return registry[section] || {};
}