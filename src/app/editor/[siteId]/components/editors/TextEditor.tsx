'use client';

import { TextConfig, TextEditorPopup } from './text-editor';

interface TextEditorProps {
  value: string;
  fieldPath: string;
  onSave: (value: string, config?: Partial<TextConfig>) => void;
  onCancel: () => void;
  position: { top: number; left: number };
  existingConfig?: Partial<TextConfig>; // 🆕 YENİ
}

export default function TextEditor({
  value,
  fieldPath,
  onSave,
  onCancel,
  position,
  existingConfig, // 🆕 YENİ
}: TextEditorProps) {
  return (
    <TextEditorPopup
      initialValue={value}
      fieldPath={fieldPath}
      initialPosition={position}
      {...(existingConfig ? { existingConfig } : {})}
      onSave={onSave}
      onCancel={onCancel}
    />
  );
}
