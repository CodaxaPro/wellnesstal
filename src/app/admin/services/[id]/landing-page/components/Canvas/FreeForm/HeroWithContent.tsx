// HeroWithContent.tsx
// Complete Hero example using Section > Container > Stack > Content components

import React, { useState } from 'react';
import { Section, Container, Stack } from './primitives.index';
import { ContentHeading, ContentText, ContentButton } from './content.index';
import { SelectableBlockWrapper } from './SelectableBlockWrapper';
import { PrimitivePropertiesPanel } from './PrimitivePropertiesPanel';
import type { SectionConfig, ContainerConfig, StackConfig, LayoutElement } from './primitives.types';
import type { HeadingConfig, TextConfig, ButtonConfig } from './content.types';

export function HeroWithContent() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  
  const [heroSection, setHeroSection] = useState<SectionConfig>({
    id: 'hero-section',
    type: 'section',
    width: '100%',
    paddingTop: 80,
    paddingBottom: 80,
    background: {
      type: 'gradient',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    },
    children: [],
  });

  const [heroContainer, setHeroContainer] = useState<ContainerConfig>({
    id: 'hero-container',
    type: 'container',
    maxWidth: 1200,
    paddingX: 24,
    margin: 'auto',
    children: [],
  });

  const [mainStack, setMainStack] = useState<StackConfig>({
    id: 'hero-stack-main',
    type: 'stack',
    direction: 'vertical',
    gap: 24,
    align: 'center',
    justify: 'center',
    width: 'fill',
    children: [],
  });

  const [buttonStack, setButtonStack] = useState<StackConfig>({
    id: 'hero-stack-buttons',
    type: 'stack',
    direction: 'horizontal',
    gap: 16,
    align: 'center',
    justify: 'center',
    children: [],
  });

  const [heading, setHeading] = useState<HeadingConfig>({
    id: 'hero-heading',
    type: 'heading',
    text: 'Professional Landing Page Builder',
    level: 'h1',
    fontSize: 48,
    fontWeight: 700,
    color: '#ffffff',
    textAlign: 'center',
  });

  const [subtext, setSubtext] = useState<TextConfig>({
    id: 'hero-subtext',
    type: 'text',
    text: 'Build beautiful, responsive landing pages with our intuitive drag-and-drop builder',
    fontSize: 20,
    fontWeight: 400,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    maxWidth: 700,
  });

  const [primaryButton, setPrimaryButton] = useState<ButtonConfig>({
    id: 'hero-button-primary',
    type: 'button',
    text: 'Get Started',
    variant: 'primary',
    size: 'lg',
    backgroundColor: '#ffffff',
    textColor: '#764ba2',
    fontSize: 18,
    fontWeight: 600,
    paddingX: 32,
    paddingY: 14,
    borderRadius: 8,
  });

  const [secondaryButton, setSecondaryButton] = useState<ButtonConfig>({
    id: 'hero-button-secondary',
    type: 'button',
    text: 'Learn More',
    variant: 'outline',
    size: 'lg',
    backgroundColor: 'transparent',
    textColor: '#ffffff',
    borderColor: '#ffffff',
    fontSize: 18,
    fontWeight: 600,
    paddingX: 32,
    paddingY: 14,
    borderRadius: 8,
  });

  const allElements: Record<string, LayoutElement | HeadingConfig | TextConfig | ButtonConfig> = {
    'hero-section': heroSection,
    'hero-container': heroContainer,
    'hero-stack-main': mainStack,
    'hero-stack-buttons': buttonStack,
    'hero-heading': heading,
    'hero-subtext': subtext,
    'hero-button-primary': primaryButton,
    'hero-button-secondary': secondaryButton,
  };

  const selectedElement = selectedId ? allElements[selectedId] || null : null;

  const handleUpdate = (updated: any) => {
    if (updated.id === 'hero-section') setHeroSection(updated as SectionConfig);
    if (updated.id === 'hero-container') setHeroContainer(updated as ContainerConfig);
    if (updated.id === 'hero-stack-main') setMainStack(updated as StackConfig);
    if (updated.id === 'hero-stack-buttons') setButtonStack(updated as StackConfig);
    if (updated.id === 'hero-heading') setHeading(updated as HeadingConfig);
    if (updated.id === 'hero-subtext') setSubtext(updated as TextConfig);
    if (updated.id === 'hero-button-primary') setPrimaryButton(updated as ButtonConfig);
    if (updated.id === 'hero-button-secondary') setSecondaryButton(updated as ButtonConfig);
  };

  return (
    <div className="flex gap-4">
      <div className="flex-1 relative">
        {selectedId && (
          <div className="absolute top-4 right-4 bg-black text-white px-4 py-2 rounded-lg z-50 text-sm font-mono">
            {selectedId}
          </div>
        )}

        <SelectableBlockWrapper element={heroSection} selectedId={selectedId} onSelect={setSelectedId}>
          <SelectableBlockWrapper element={heroContainer} selectedId={selectedId} onSelect={setSelectedId}>
            <SelectableBlockWrapper element={mainStack} selectedId={selectedId} onSelect={setSelectedId}>
              
              <ContentHeading 
                config={heading}
                isSelected={selectedId === 'hero-heading'}
                onSelect={setSelectedId}
              />
              
              <ContentText 
                config={subtext}
                isSelected={selectedId === 'hero-subtext'}
                onSelect={setSelectedId}
              />
              
              <SelectableBlockWrapper element={buttonStack} selectedId={selectedId} onSelect={setSelectedId}>
                <ContentButton 
                  config={primaryButton}
                  isSelected={selectedId === 'hero-button-primary'}
                  onSelect={setSelectedId}
                />
                <ContentButton 
                  config={secondaryButton}
                  isSelected={selectedId === 'hero-button-secondary'}
                  onSelect={setSelectedId}
                />
              </SelectableBlockWrapper>

            </SelectableBlockWrapper>
          </SelectableBlockWrapper>
        </SelectableBlockWrapper>
      </div>

      <div className="w-80 bg-white border-l border-gray-200 overflow-auto">
        <PrimitivePropertiesPanel selectedElement={selectedElement} onUpdate={handleUpdate} />
      </div>
    </div>
  );
}