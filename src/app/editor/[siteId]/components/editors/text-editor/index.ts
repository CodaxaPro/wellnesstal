// Main Component
export { default as TextEditorPopup } from './TextEditorPopup';

// Types
export * from './types/textConfig.types';
export * from './types/animationPresets';

// Hooks
export { useTextConfig } from './hooks/useTextConfig';
export { useTiptapEditor } from './hooks/useTiptapEditor';
export { useAnimations } from './hooks/useAnimations';
export { useDraggable } from './hooks/useDraggable';

// Utils
export * from './utils/textHelpers';
export * from './utils/styleHelpers';
export * from './utils/animationHelpers';

// Components - Header
export { default as TextEditorHeader } from './components/Header/TextEditorHeader';
export { default as HeaderStats } from './components/Header/HeaderStats';

// Components - Toolbar
export { default as TextEditorToolbar } from './components/Toolbar/TextEditorToolbar';
export { default as FormatButtons } from './components/Toolbar/FormatButtons';
export { default as FontSelector } from './components/Toolbar/FontSelector';
export { default as ColorPicker } from './components/Toolbar/ColorPicker';
export { default as SizeSlider } from './components/Toolbar/SizeSlider';

// Components - Tabs
export { default as FormatTab } from './components/Tabs/FormatTab';
export { default as StyleTab } from './components/Tabs/StyleTab';
export { default as AdvancedTab } from './components/Tabs/AdvancedTab';
export { default as SettingsTab } from './components/Tabs/SettingsTab';

// Components - Content
export { default as TextEditorContent } from './components/Content/TextEditorContent';

// Components - Footer
export { default as TextEditorFooter } from './components/Footer/TextEditorFooter';
export { default as StatsBar } from './components/Footer/StatsBar';