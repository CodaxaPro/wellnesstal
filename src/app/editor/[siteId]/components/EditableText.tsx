'use client';

import { useState, useEffect, useRef } from 'react';

import { useContentStore } from '../store/useContentStore';

interface EditableTextProps {
  path: string;
  defaultValue: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  style?: React.CSSProperties;
}

export default function EditableText({ 
  path, 
  defaultValue, 
  as = 'p',
  className = '',
  style = {}
}: EditableTextProps) {
  const { isEditMode, activeField, setActiveField, updateContent } = useContentStore();
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const inputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isActive = activeField === path;
  const isMultiline = as === 'p';

  useEffect(() => {
    if (isActive && isEditMode) {
      setIsEditing(true);
      setTimeout(() => {
        if (isMultiline) {
          textareaRef.current?.focus();
          textareaRef.current?.select();
        } else {
          inputRef.current?.focus();
          inputRef.current?.select();
        }
      }, 0);
    } else {
      setIsEditing(false);
    }
  }, [isActive, isEditMode, isMultiline]);

  const handleClick = () => {
    if (isEditMode) {
      setActiveField(path);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const handleBlur = () => {
    updateContent(path, value);
    setActiveField(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isMultiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setValue(defaultValue);
      setActiveField(null);
    }
  };

  const Tag = as;

  const editableStyle = isEditMode ? {
    cursor: 'pointer',
    outline: isActive ? '2px solid #9333ea' : 'none',
    outlineOffset: '2px',
    backgroundColor: isActive ? '#9333ea11' : 'transparent',
    transition: 'all 0.2s',
  } : {};

  if (isEditing && isEditMode) {
    if (isMultiline) {
      return (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`${className} w-full resize-none`}
          style={{
            ...style,
            minHeight: '60px',
            padding: '8px',
            border: '2px solid #9333ea',
            borderRadius: '4px',
            fontSize: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            lineHeight: 'inherit',
            color: 'inherit',
          }}
          rows={3}
        />
      );
    }

    return (
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={className}
        style={{
          ...style,
          padding: '8px',
          border: '2px solid #9333ea',
          borderRadius: '4px',
          fontSize: 'inherit',
          fontFamily: 'inherit',
          fontWeight: 'inherit',
          lineHeight: 'inherit',
          color: 'inherit',
          width: '100%',
        }}
      />
    );
  }

  return (
    <Tag
      onClick={handleClick}
      className={className}
      style={{ ...style, ...editableStyle }}
      title={isEditMode ? 'Düzenlemek için tıkla' : ''}
    >
      {value}
    </Tag>
  );
}