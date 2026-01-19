// templates/registry.ts
// Template Registry - Tüm template'lerin merkezi yönetimi

import { blankTemplate } from './blank';
import { headspaTemplate } from './themes/headspa';
import type { Template, TemplateCategory, TemplateFilters } from './types';

/**
 * Template Registry
 * Buraya yeni template'ler eklenir
 */
export const TEMPLATE_REGISTRY: Template[] = [
  blankTemplate,
  headspaTemplate,
  // Gelecekte eklenecek template'ler:
  // restaurantTemplate,
  // gymTemplate,
  // portfolioTemplate,
  // ...
];

/**
 * Default template ID
 * İlk yüklemede bu template kullanılır
 */
export const DEFAULT_TEMPLATE_ID = 'headspa-premium';

/**
 * ID'ye göre template bul
 */
export function getTemplateById(id: string): Template | undefined {
  return TEMPLATE_REGISTRY.find((template) => template.metadata.id === id);
}

/**
 * Kategoriye göre template'leri filtrele
 */
export function getTemplatesByCategory(category: TemplateCategory): Template[] {
  return TEMPLATE_REGISTRY.filter((template) => template.metadata.category === category);
}

/**
 * Tag'e göre template'leri bul
 */
export function getTemplatesByTag(tag: string): Template[] {
  return TEMPLATE_REGISTRY.filter((template) => 
    template.metadata.tags.includes(tag.toLowerCase())
  );
}

/**
 * Gelişmiş filtreleme
 */
export function filterTemplates(filters: TemplateFilters): Template[] {
  let results = [...TEMPLATE_REGISTRY];

  // Kategori filtresi
  if (filters.category) {
    results = results.filter((t) => t.metadata.category === filters.category);
  }

  // Tag filtresi
  if (filters.tags && filters.tags.length > 0) {
    results = results.filter((t) =>
      filters.tags!.some((tag) => t.metadata.tags.includes(tag.toLowerCase()))
    );
  }

  // Premium filtresi
  if (filters.isPremium !== undefined) {
    results = results.filter((t) => t.metadata.isPremium === filters.isPremium);
  }

  // Arama filtresi
  if (filters.searchQuery) {
    const query = filters.searchQuery.toLowerCase();
    results = results.filter((t) =>
      t.metadata.name.toLowerCase().includes(query) ||
      t.metadata.description.toLowerCase().includes(query) ||
      t.metadata.tags.some((tag) => tag.includes(query))
    );
  }

  return results;
}

/**
 * Tüm kategorileri listele
 */
export function getAllCategories(): TemplateCategory[] {
  const categories = new Set<TemplateCategory>();
  TEMPLATE_REGISTRY.forEach((template) => {
    categories.add(template.metadata.category);
  });
  return Array.from(categories);
}

/**
 * Tüm tag'leri listele
 */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  TEMPLATE_REGISTRY.forEach((template) => {
    template.metadata.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
}

/**
 * Template istatistikleri
 */
export function getTemplateStats() {
  return {
    total: TEMPLATE_REGISTRY.length,
    published: TEMPLATE_REGISTRY.filter((t) => t.metadata.isPublished).length,
    premium: TEMPLATE_REGISTRY.filter((t) => t.metadata.isPremium).length,
    free: TEMPLATE_REGISTRY.filter((t) => !t.metadata.isPremium).length,
    byCategory: getAllCategories().reduce((acc, category) => {
      acc[category] = getTemplatesByCategory(category).length;
      return acc;
    }, {} as Record<TemplateCategory, number>),
  };
}