// Main Component
export { default as ImageEditorPopup } from './ImageEditorPopup';

// Types
export * from './types/imageConfig.types';

// Hooks
export { useImageConfig } from './hooks/useImageConfig';
export { useDraggable } from './hooks/useDraggable';

// Utils
export { getFilterStyle, FILTER_PRESETS } from './utils/filterHelpers';
export { 
  getEasingCurve, 
  getEntranceAnimation, 
  getHoverAnimation,
  TAB_DEFINITIONS 
} from './utils/animationHelpers';

// Components
export { default as ImageEditorHeader } from './ImageEditorHeader';
export { default as ImageEditorTabs } from './ImageEditorTabs';
export { default as ImageEditorPreview } from './ImageEditorPreview';
export { default as ImageEditorFooter } from './ImageEditorFooter';

// Tab Components
export { default as SourceTab } from './tabs/SourceTab';
export { default as TransformTab } from './tabs/TransformTab';
export { default as AdjustTab } from './tabs/AdjustTab';
export { default as EffectsTab } from './tabs/EffectsTab';
export { default as PositionTab } from './tabs/PositionTab';
export { default as AnimateTab } from './tabs/AnimateTab';
export { default as PerformanceTab } from './tabs/PerformanceTab';
export { default as SEOTab } from './tabs/SEOTab';