'use client';

import { ImageConfig } from './types/imageConfig.types';

interface ImageEditorFooterProps {
  config: ImageConfig;
  onReset: () => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function ImageEditorFooter({ 
  config, 
  onReset, 
  onCancel, 
  onSave 
}: ImageEditorFooterProps) {
  return (
    <div className="flex gap-4 px-8 py-6 bg-gray-50 border-t flex-shrink-0">
      <button
        onClick={onReset}
        className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-all"
      >
        🔄 Reset All
      </button>
      <div className="flex-1" />
      <button
        onClick={onCancel}
        className="px-8 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-all"
      >
        Cancel
      </button>
      <button
        onClick={onSave}
        disabled={!config.url}
        className="px-12 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ✅ Apply Image
      </button>
    </div>
  );
}