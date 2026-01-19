'use client';

import { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import { useDraggable } from './hooks/useDraggable';
import { useImageConfig } from './hooks/useImageConfig';
import ImageEditorFooter from './ImageEditorFooter';
import ImageEditorHeader from './ImageEditorHeader';
import ImageEditorPreview from './ImageEditorPreview';
import ImageEditorTabs from './ImageEditorTabs';
import AdjustTab from './tabs/AdjustTab';
import AnimateTab from './tabs/AnimateTab';
import EffectsTab from './tabs/EffectsTab';
import PerformanceTab from './tabs/PerformanceTab';
import PositionTab from './tabs/PositionTab';
import SEOTab from './tabs/SEOTab';
import SourceTab from './tabs/SourceTab';
import TransformTab from './tabs/TransformTab';
import { TabType, ImageConfig } from './types/imageConfig.types';

interface ImageEditorPopupProps {
  initialUrl: string;
  fieldPath: string;
  initialPosition: { top: number; left: number };
  existingConfig?: ImageConfig;
  onSave: (url: string, config: ImageConfig) => void;
  onCancel: () => void;
}

export default function ImageEditorPopup({
  initialUrl,
  fieldPath,
  initialPosition,
  existingConfig,
  onSave,
  onCancel,
}: ImageEditorPopupProps) {
  const [activeTab, setActiveTab] = useState<TabType>('source');
  
  const { config, updateConfig, resetConfig } = useImageConfig({
    initialUrl,
    existingConfig,
  });

  const { position, isDragging, handleMouseDown } = useDraggable({
    initialPosition,
  });

  const handleSave = () => {
    onSave(config.url, config);
  };

  const renderTabContent = () => {
    const tabProps = { config, updateConfig };

    switch (activeTab) {
      case 'source':
        return <SourceTab {...tabProps} />;
      case 'crop':
        return <TransformTab {...tabProps} />;
      case 'adjust':
        return <AdjustTab {...tabProps} />;
      case 'effects':
        return <EffectsTab {...tabProps} />;
      case 'position':
        return <PositionTab {...tabProps} />;
      case 'animate':
        return <AnimateTab {...tabProps} />;
      case 'performance':
        return <PerformanceTab {...tabProps} />;
      case 'seo':
        return <SEOTab {...tabProps} />;
      default:
        return null;
    }
  };

  return (
    <>
      <Toaster position="top-center" />

      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        animate={{ opacity: 1, backdropFilter: 'blur(6px)' }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/30 z-[998]"
        onClick={onCancel}
      />

      {/* Main Popup */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bg-white rounded-3xl shadow-2xl z-[999] flex flex-col"
        style={{
          top: `${position.top}px`,
          left: `${position.left}px`,
          width: '1200px',
          height: 'calc(90vh)',
          cursor: isDragging ? 'grabbing' : 'default',
        }}
        onMouseDown={handleMouseDown}
      >
        <ImageEditorHeader fieldPath={fieldPath} onCancel={onCancel} />

        <ImageEditorTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Controls */}
          <div className="w-[500px] border-r p-6 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">{renderTabContent()}</AnimatePresence>
          </div>

          {/* Right Panel - Preview */}
          <ImageEditorPreview config={config} />
        </div>

        <ImageEditorFooter
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
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #9333ea, #ec4899);
          border-radius: 10px;
        }
      `}</style>
    </>
  );
}