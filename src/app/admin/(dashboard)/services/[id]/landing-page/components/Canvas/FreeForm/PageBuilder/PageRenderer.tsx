// PageRenderer.tsx
// Pure Render Component - Canvas rendering logic

'use client';

import React from 'react';

import { ContentHeading, ContentText, ContentButton, ContentImage } from '../content.index';
import { Section, Container, Stack, Grid } from '../primitives.index';
import type { StackConfig, ContentComponent } from '../primitives.types';
import { SelectableBlockWrapper } from '../SelectableBlockWrapper';

import type { PageSection } from './types';

interface PageRendererProps {
  sections: PageSection[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function PageRenderer({ sections, selectedId, onSelect }: PageRendererProps) {
  // ============================================================================
  // RENDERING HELPERS
  // ============================================================================

  const renderContent = (content: ContentComponent) => {
    const isSelected = selectedId === content.id;

    if (content.type === 'heading') {
      return <ContentHeading config={content} isSelected={isSelected} onSelect={onSelect} />;
    }
    if (content.type === 'text') {
      return <ContentText config={content} isSelected={isSelected} onSelect={onSelect} />;
    }
    if (content.type === 'button') {
      return <ContentButton config={content} isSelected={isSelected} onSelect={onSelect} />;
    }
    if (content.type === 'image') {
      return <ContentImage config={content} isSelected={isSelected} onSelect={onSelect} />;
    }
    return null;
  };

  const renderStackChildren = (children: (StackConfig | ContentComponent)[]): React.ReactNode => {
    return children.map((child) => {
      if (child.type === 'stack') {
        return (
          <SelectableBlockWrapper
            key={child.id}
            element={child}
            selectedId={selectedId}
            onSelect={onSelect}
          >
            <Stack config={child}>
              {child.children.length === 0 ? (
                <div className="text-center py-6 text-gray-400 border-2 border-dashed border-purple-300 rounded-lg">
                  Empty nested stack - click "+ Add Content"
                </div>
              ) : (
                renderStackChildren(child.children)
              )}
            </Stack>
          </SelectableBlockWrapper>
        );
      }
      return <React.Fragment key={child.id}>{renderContent(child)}</React.Fragment>;
    });
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (!sections) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // ============================================================================
  // EMPTY STATE
  // ============================================================================

  if (sections.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 mt-16">
        <p className="text-xl mb-4">No sections yet</p>
        <p className="text-sm">Click "+ Add Section" to get started</p>
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <div className="space-y-8 mt-16">
      {sections.map((pageSection) => (
        <div key={pageSection.section.id} className="relative group">
          <SelectableBlockWrapper
            element={pageSection.section}
            selectedId={selectedId}
            onSelect={onSelect}
          >
            <Section config={pageSection.section}>
              <SelectableBlockWrapper
                element={pageSection.container}
                selectedId={selectedId}
                onSelect={onSelect}
              >
                <Container config={pageSection.container}>
                  <div className="space-y-4">
                    {pageSection.stacks.map((stack) => (
                      <SelectableBlockWrapper
                        key={stack.id}
                        element={stack}
                        selectedId={selectedId}
                        onSelect={onSelect}
                      >
                        <Stack config={stack}>
                          {stack.children.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-gray-300 rounded-lg">
                              Empty stack - click "+ Add Content" to add elements
                            </div>
                          ) : (
                            renderStackChildren(stack.children)
                          )}
                        </Stack>
                      </SelectableBlockWrapper>
                    ))}

                    {pageSection.grids.map((grid) => (
                      <SelectableBlockWrapper
                        key={grid.id}
                        element={grid}
                        selectedId={selectedId}
                        onSelect={onSelect}
                      >
                        <Grid config={grid}>
                          {grid.children.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 border-2 border-dashed border-orange-300 rounded-lg col-span-full">
                              Empty grid - click "+ Add Content" to add elements
                            </div>
                          ) : (
                            grid.children.map((content: ContentComponent) => (
                              <React.Fragment key={content.id}>{renderContent(content)}</React.Fragment>
                            ))
                          )}
                        </Grid>
                      </SelectableBlockWrapper>
                    ))}
                  </div>
                </Container>
              </SelectableBlockWrapper>
            </Section>
          </SelectableBlockWrapper>
        </div>
      ))}
    </div>
  );
}