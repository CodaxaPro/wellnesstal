// templates/blank.ts
// Blank Template - Boş başlangıç şablonu

import type { Template } from './types';

/**
 * Boş Template
 * Kullanıcı sıfırdan başlamak isterse bu yüklenir
 */
export const blankTemplate: Template = {
  metadata: {
    id: 'blank',
    name: 'Blank Page',
    category: 'other',
    description: 'Start from scratch with an empty page',
    author: 'System',
    tags: ['blank', 'empty', 'scratch'],
    colors: {
      primary: '#000000',
      secondary: '#ffffff',
      accent: '#666666',
    },
    isPremium: false,
    isPublished: true,
  },
  sections: [
    // Tek bir boş section ile başla
    {
      section: {
        id: 'blank-section-1',
        type: 'section',
        width: '100%',
        paddingTop: 80,
        paddingBottom: 80,
        background: {
          type: 'color',
          color: '#ffffff',
        },
        children: [],
      },
      container: {
        id: 'blank-container-1',
        type: 'container',
        variant: 'standard',
        maxWidth: 1200,
        paddingX: 24,
        margin: 'auto',
        children: [],
      },
      stacks: [
        {
          id: 'blank-stack-1',
          type: 'stack',
          direction: 'vertical',
          gap: 24,
          align: 'center',
          justify: 'center',
          width: 'fill',
          children: [
            {
              id: 'blank-heading-1',
              type: 'heading',
              text: 'Start Building Your Page',
              level: 'h1',
              fontSize: 48,
              fontWeight: 700,
              color: '#1f2937',
              textAlign: 'center',
            },
            {
              id: 'blank-text-1',
              type: 'text',
              text: 'Click on any element to edit, or add new sections from the left panel.',
              fontSize: 18,
              fontWeight: 400,
              color: '#6b7280',
              textAlign: 'center',
              lineHeight: 1.6,
            },
          ],
        },
      ],
      grids: [],
    },
  ],
};