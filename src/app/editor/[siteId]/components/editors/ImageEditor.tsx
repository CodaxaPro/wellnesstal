'use client';

import { ImageEditorPopup, ImageConfig } from './image-editor';

interface ImageEditorProps {
  value: string;
  fieldPath: string;
  onSave: (value: string, config: ImageConfig) => void;
  onCancel: () => void;
  position: { top: number; left: number };
  existingConfig?: ImageConfig;
}

export default function ImageEditor({
  value,
  fieldPath,
  onSave,
  onCancel,
  position,
  existingConfig,
}: ImageEditorProps) {
  return (
    <ImageEditorPopup
      initialUrl={value}
      fieldPath={fieldPath}
      initialPosition={position}
      existingConfig={existingConfig}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}