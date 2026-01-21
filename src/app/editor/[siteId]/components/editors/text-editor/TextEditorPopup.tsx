// src/app/editor/[siteId]/components/editors/text-editor/TextEditorPopup.tsx

'use client';

import { useEffect, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import TextEditorContent from './components/Content/TextEditorContent';
import TextEditorFooter from './components/Footer/TextEditorFooter';
import TextEditorHeader from './components/Header/TextEditorHeader';
import AdvancedTab from './components/Tabs/AdvancedTab';
import FormatTab from './components/Tabs/FormatTab';
import SettingsTab from './components/Tabs/SettingsTab';
import StyleTab from './components/Tabs/StyleTab';
import TextEditorToolbar from './components/Toolbar/TextEditorToolbar';
import { useDraggable } from './hooks/useDraggable';
import { useTextConfig } from './hooks/useTextConfig';
import { useTiptapEditor } from './hooks/useTiptapEditor';
import { POPUP_ANIMATIONS } from './types/animationPresets';
import { TabType, TextConfig } from './types/textConfig.types';
import { calculateTextStats } from './utils/textHelpers';

interface TextEditorPopupProps {
  initialValue: string;
  fieldPath: string;
  initialPosition: { top: number; left: number };
  existingConfig?: Partial<TextConfig>;
  onSave: (value: string, config: TextConfig) => void;
  onCancel: () => void;
}

export default function TextEditorPopup({
  initialValue,
  fieldPath,
  initialPosition,
  existingConfig,
  onSave,
  onCancel,
}: TextEditorPopupProps) {
  const [activeTab, setActiveTab] = useState<TabType>('format');

  const { config, updateConfig, updateMultipleConfigs, resetConfig, applyPreset } = useTextConfig({
    initialValue,
    ...(existingConfig ? { existingConfig } : {}),
  });

  const { position, isDragging, handleMouseDown } = useDraggable({
    initialPosition,
  });

  // Handle content updates from Tiptap
  const handleContentUpdate = (html: string, text: string) => {
    updateMultipleConfigs({ html, content: text });
  };

  const editor = useTiptapEditor({
    content: initialValue,
    onUpdate: handleContentUpdate,
  });

  // Load initial content into editor
  useEffect(() => {
    if (editor && initialValue) {
      editor.commands.setContent(initialValue);
    }
  }, [initialValue, editor]);

  const stats = calculateTextStats(config.content, config.html);

  const handleSave = () => {
    onSave(config.html, config);
  };

  const tabs = [
    { id: 'format' as TabType, label: 'Format', icon: '📝' },
    { id: 'style' as TabType, label: 'Style', icon: '🎨' },
    { id: 'advanced' as TabType, label: 'Advanced', icon: '⚡' },
    { id: 'settings' as TabType, label: 'Settings', icon: '⚙️' },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'format':
        return <FormatTab editor={editor} />;
      case 'style':
        return <StyleTab config={config} updateConfig={updateConfig} />;
      case 'advanced':
        return <AdvancedTab config={config} updateConfig={updateConfig} />;
      case 'settings':
        return <SettingsTab config={config} updateConfig={updateConfig} applyPreset={applyPreset} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      {/* Backdrop */}
      <motion.div
        {...POPUP_ANIMATIONS.backdrop}
        className="fixed inset-0 bg-black/40 z-[998]"
        onClick={onCancel}
      />

      {/* Main Popup */}
      <motion.div
        initial={POPUP_ANIMATIONS.popup.initial}
        animate={POPUP_ANIMATIONS.popup.animate}
        exit={POPUP_ANIMATIONS.popup.exit}
        transition={{ type: 'spring' as const, damping: 25, stiffness: 300 }}
        className="fixed bg-white rounded-3xl shadow-2xl z-[999] flex flex-col"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: '900px',
          height: 'calc(85vh)',
          cursor: isDragging ? 'grabbing' : 'default',
        }}
        onMouseDown={handleMouseDown}
      >
        <TextEditorHeader fieldPath={fieldPath} stats={stats} onCancel={onCancel} />

        <TextEditorToolbar editor={editor} config={config} updateConfig={updateConfig} />

        {/* Tabs Navigation */}
        <div className="flex gap-1 px-6 py-3 bg-gray-50 border-b flex-shrink-0">
          {tabs.map((tab, index) => (
            <motion.button
              key={tab.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all
                ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Tab Content */}
          <div className="w-80 border-r p-6 overflow-y-auto custom-scrollbar bg-gray-50">
            <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
          </div>

          {/* Right Panel - Editor */}
          <TextEditorContent editor={editor} config={config} />
        </div>

        <TextEditorFooter
          stats={stats}
          config={config}
          onReset={resetConfig}
          onCancel={onCancel}
          onSave={handleSave}
        />
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #F3F4F6;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #9333EA, #EC4899);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #7C3AED, #DB2777);
        }
      `}</style>
    </>
  );
}
