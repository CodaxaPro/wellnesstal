// Image Editor Configuration Types

export type TabType = 'source' | 'crop' | 'adjust' | 'effects' | 'position' | 'animate' | 'performance' | 'seo';

export interface ImageConfig {
  url: string;
  
  // Crop & Transform
  rotate: number;
  flipH: boolean;
  flipV: boolean;
  
  // Adjustments
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sharpness: number;
  hue: number;
  opacity: number;
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;
  
  // Effects
  filter: 'none' | 'vibrant' | 'warm' | 'cool' | 'bw' | 'vintage' | 'cinematic' | 'dramatic' | 'soft';
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowColor: string;
  overlayColor: string;
  overlayOpacity: number;
  vignette: number;
  
  // Position
  objectFit: 'cover' | 'contain' | 'fill' | 'none';
  objectPosition: string;
  
  // Animation
  entrance: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'bounce';
  hover: 'none' | 'zoom' | 'tilt' | 'lift' | 'glow' | 'brightness';
  duration: number;
  easing: 'ease' | 'linear' | 'ease-in-out' | 'spring';
  
  // Performance
  lazyLoad: boolean;
  quality: number;
  
  // SEO
  alt: string;
  title: string;
}

export interface UnsplashImage {
  id: string;
  urls: { regular: string; small: string; thumb: string };
  user: { name: string; username: string };
  alt_description: string | null;
}

export const DEFAULT_IMAGE_CONFIG: ImageConfig = {
  url: '',
  rotate: 0,
  flipH: false,
  flipV: false,
  brightness: 0,
  contrast: 0,
  saturation: 0,
  blur: 0,
  sharpness: 0,
  hue: 0,
  opacity: 100,
  grayscale: false,
  sepia: false,
  invert: false,
  filter: 'none',
  shadowX: 0,
  shadowY: 4,
  shadowBlur: 8,
  shadowColor: '#000000',
  overlayColor: '#000000',
  overlayOpacity: 0,
  vignette: 0,
  objectFit: 'cover',
  objectPosition: 'center',
  entrance: 'fade',
  hover: 'zoom',
  duration: 0.6,
  easing: 'ease',
  lazyLoad: true,
  quality: 85,
  alt: '',
  title: '',
};

export const TRENDING_IMAGES: UnsplashImage[] = [
  {
    id: '1',
    urls: {
      regular: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1080&q=80',
      small: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
      thumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80',
    },
    user: { name: 'Bench Accounting', username: 'benchaccounting' },
    alt_description: 'modern office workspace',
  },
  {
    id: '2',
    urls: {
      regular: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1080&q=80',
      small: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80',
      thumb: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&q=80',
    },
    user: { name: 'Clément H', username: 'clemhlrdt' },
    alt_description: 'laptop on desk',
  },
  {
    id: '3',
    urls: {
      regular: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1080&q=80',
      small: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80',
      thumb: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200&q=80',
    },
    user: { name: 'Marvin Meyer', username: 'marvelous' },
    alt_description: 'team collaboration',
  },
  {
    id: '4',
    urls: {
      regular: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1080&q=80',
      small: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80',
      thumb: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&q=80',
    },
    user: { name: 'Chris Montgomery', username: 'cwmonty' },
    alt_description: 'business meeting',
  },
  {
    id: '5',
    urls: {
      regular: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&q=80',
      small: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
      thumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&q=80',
    },
    user: { name: 'Annie Spratt', username: 'anniespratt' },
    alt_description: 'technology startup',
  },
  {
    id: '6',
    urls: {
      regular: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1080&q=80',
      small: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
      thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=80',
    },
    user: { name: 'You X Ventures', username: 'youxventures' },
    alt_description: 'team celebrating',
  },
];