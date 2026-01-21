'use client';

import type { ComponentType } from 'react';

import { useContentStore } from '../store/useContentStore';

interface HeroComponentProps {
  title: string;
  subtitle: string;
  ctaText: string;
  primaryColor: string;
}

interface EditableHeroProps {
  HeroComponent: ComponentType<HeroComponentProps>;
  primaryColor: string;
}

export default function EditableHero({ HeroComponent, primaryColor }: EditableHeroProps) {
  const { content } = useContentStore();

  // Hero section'ı bul
  const heroSection = content.sections.find(s => s.type === 'hero');

  if (!heroSection) {
    return null;
  }

  const contentData = heroSection.content as Record<string, unknown>

  return (
    <HeroComponent
      title={(contentData['title'] as string) || 'Welcome'}
      subtitle={(contentData['subtitle'] as string) || ''}
      ctaText={(contentData['ctaText'] as string) || 'Get Started'}
      primaryColor={primaryColor}
    />
  );
}
