// index.ts
// PageBuilder Exports

// Components
export { PageBuilder } from './PageBuilder';
export { PageRenderer } from './PageRenderer';

// Main Hook
export { usePageBuilder } from './usePageBuilder';

// Types
export type { PageSection, LibraryContext } from './types';
export type { ElementType } from './hooks/usePageSelection';
export type { SaveStatus } from './hooks/usePageStorage';

// Template Registry (for external use)
export { TEMPLATE_REGISTRY, DEFAULT_TEMPLATE_ID, getTemplateById, getTemplatesByCategory, filterTemplates } from './templates/registry';
export type { Template, TemplateMetadata, TemplateCategory, TemplateFilters } from './templates/types';