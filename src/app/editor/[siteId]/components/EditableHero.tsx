'use client';

import { useContentStore } from '../store/useContentStore';

interface EditableHeroProps {
  HeroComponent: any;
  primaryColor: string;
}

export default function EditableHero({ HeroComponent, primaryColor }: EditableHeroProps) {
  const { content } = useContentStore();
  
  // Hero section'ı bul
  const heroSection = content.sections.find(s => s.type === 'hero');
  
  if (!heroSection) {
    return null;
  }

  return (
    <HeroComponent 
      title={heroSection.content.title || 'Welcome'}
      subtitle={heroSection.content.subtitle || ''}
      ctaText={heroSection.content.ctaText || 'Get Started'}
      primaryColor={primaryColor}
    />
  );
}