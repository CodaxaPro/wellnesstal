// templates/types.ts
// Template Type Definitions

import type { PageSection } from '../usePageBuilder';

/**
 * Template kategorileri
 */
export type TemplateCategory = 
  | 'wellness'      // Spa, massage, yoga
  | 'food'          // Restaurant, cafe, bar
  | 'fitness'       // Gym, sports, training
  | 'business'      // Agency, consulting, corporate
  | 'ecommerce'     // Shop, store, product
  | 'portfolio'     // Personal, creative, showcase
  | 'education'     // Course, school, training
  | 'health'        // Medical, clinic, healthcare
  | 'entertainment' // Events, music, cinema
  | 'other';        // Diğer

/**
 * Template metadata - Her temanın bilgileri
 */
export interface TemplateMetadata {
  id: string;                    // Unique ID: 'headspa-premium'
  name: string;                  // Display name: 'Premium Headspa'
  category: TemplateCategory;    // Kategori
  description: string;           // Kısa açıklama
  thumbnail?: string;            // Preview image URL
  author: string;                // Yaratıcı
  tags: string[];                // Arama için: ['spa', 'wellness', 'massage']
  colors: {
    primary: string;             // Ana renk
    secondary: string;           // İkincil renk
    accent: string;              // Vurgu rengi
  };
  createdAt?: Date;              // Oluşturulma tarihi
  updatedAt?: Date;              // Güncellenme tarihi
  isPremium?: boolean;           // Ücretli mi?
  isPublished?: boolean;         // Yayında mı?
}

/**
 * Template - Tam template yapısı
 */
export interface Template {
  metadata: TemplateMetadata;
  sections: PageSection[];
}

/**
 * Template filtreleme için
 */
export interface TemplateFilters {
  category?: TemplateCategory;
  tags?: string[];
  isPremium?: boolean;
  searchQuery?: string;
}