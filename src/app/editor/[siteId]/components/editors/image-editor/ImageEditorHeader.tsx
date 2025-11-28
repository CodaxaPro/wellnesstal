'use client';

interface ImageEditorHeaderProps {
  fieldPath: string;
  onCancel: () => void;
}

export default function ImageEditorHeader({ fieldPath, onCancel }: ImageEditorHeaderProps) {
  return (
    <div className="drag-handle bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white px-8 py-5 flex justify-between items-center cursor-grab active:cursor-grabbing select-none flex-shrink-0">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur">
          <span className="text-2xl">🎨</span>
        </div>
        <div>
          <div className="font-bold text-lg">Enterprise Image Studio</div>
          <div className="text-sm opacity-90">{fieldPath}</div>
        </div>
      </div>
      <button
        onClick={onCancel}
        className="w-10 h-10 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-2xl transition-all"
      >
        ×
      </button>
    </div>
  );
}