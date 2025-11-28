'use client';

import { useContentStore } from '../store/useContentStore';
import TextEditor from './editors/TextEditor';
import ImageEditor from './editors/ImageEditor';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

export default function InlineEditor() {
  const { activeField, content, updateContent, setActiveField } = useContentStore();
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Calculate position based on overlay
  const updatePosition = () => {
    if (!activeField) return;
    
    const overlay = document.querySelector(`[data-path="${activeField}"]`);
    if (overlay) {
      const rect = overlay.getBoundingClientRect();
      
      // Determine popup width based on editor type
      const isImageEditor = activeField.includes('image');
      const popupWidth = isImageEditor ? 1200 : 900; // Text editor büyüdü
      
      // Center horizontally, adjust if out of bounds
      const popupLeft = Math.max(20, Math.min(
        rect.left + (rect.width / 2) - (popupWidth / 2),
        window.innerWidth - popupWidth - 20
      ));
      
      // Position below element, or above if no space
      let popupTop = rect.bottom + 10;
      const popupHeight = isImageEditor ? 700 : 650; // Text editor height
      
      if (popupTop + popupHeight > window.innerHeight) {
        popupTop = rect.top - popupHeight - 10;
      }
      
      setPosition({
        top: Math.max(10, popupTop),
        left: popupLeft,
      });
    }
  };

  useEffect(() => {
    if (activeField) {
      setTimeout(updatePosition, 50);
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);

      return () => {
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }
  }, [activeField]);

  // Get current value from store
  const getCurrentValue = (): string => {
    if (!activeField) return '';
    
    const keys = activeField.split('.');
    
    if (keys[0] === 'businessName') {
      return content.businessName || '';
    }
    
    const [sectionType, fieldName] = keys;
    const section = content.sections?.find(s => s.type === sectionType);
    
    if (section) {
      return section.content[fieldName] || '';
    }
    
    return '';
  };

  // Get current imageConfig from store
  const getCurrentImageConfig = () => {
    if (!activeField || !activeField.includes('image')) return undefined;
    
    const [sectionType] = activeField.split('.');
    const section = content.sections?.find(s => s.type === sectionType);
    
    if (section && section.content.imageConfig) {
      console.log('📦 Found existing imageConfig:', section.content.imageConfig);
      return section.content.imageConfig;
    }
    
    console.log('⚠️ No existing imageConfig found');
    return undefined;
  };

  // Get current textConfig from store
  const getCurrentTextConfig = () => {
    if (!activeField || activeField.includes('image')) return undefined;
    
    const configPath = `${activeField}Config`;
    const [sectionType, fieldName] = activeField.split('.');
    const section = content.sections?.find(s => s.type === sectionType);
    
    if (section) {
      const configFieldName = `${fieldName}Config`;
      if (section.content[configFieldName]) {
        console.log('📝 Found existing textConfig:', section.content[configFieldName]);
        return section.content[configFieldName];
      }
    }
    
    console.log('⚠️ No existing textConfig found');
    return undefined;
  };

  // Save handler - FIXED IMAGE & TEXT CONFIG SUPPORT
  const handleSave = (newValue: string, config?: any) => {
    if (!activeField) return;

    console.log('💾 InlineEditor Save:', { 
      activeField, 
      newValue, 
      config,
      hasConfig: !!config 
    });

    // Update the main field (image URL or text content)
    updateContent(activeField, newValue);
    console.log('✅ Main field saved:', activeField);

    // If we have a config object, determine type and save
    if (config) {
      const isImageConfig = activeField.includes('image');
      const isTextConfig = !isImageConfig;

      if (isImageConfig) {
        // IMAGE CONFIG: hero.image → hero.imageConfig
        const [sectionType] = activeField.split('.');
        const configPath = `${sectionType}.imageConfig`;
        
        console.log('📦 Saving imageConfig to:', configPath);
        updateContent(configPath, config);
        toast.success('🎉 Image updated with all effects!');
        
      } else if (isTextConfig) {
        // TEXT CONFIG: hero.title → hero.titleConfig
        const configPath = `${activeField}Config`;
        
        console.log('📝 Saving textConfig to:', configPath);
        console.log('📝 Config data:', config);
        updateContent(configPath, config);
        toast.success('✨ Text style updated!');
      }
    } else {
      toast.success('✅ Changes saved!');
    }
    
    setActiveField(null);
  };

  // Cancel handler
  const handleCancel = () => {
    setActiveField(null);
  };

  // Determine editor type based on field path
  const getEditorType = (): 'text' | 'image' => {
    if (!activeField) return 'text';
    
    // Image fields
    if (activeField.includes('image') || 
        activeField.includes('background') ||
        activeField.includes('photo') ||
        activeField.includes('picture')) {
      return 'image';
    }
    
    // Everything else is text
    return 'text';
  };

  if (!activeField) return null;

  const editorType = getEditorType();
  const currentValue = getCurrentValue();

  // Render appropriate editor
  if (editorType === 'image') {
    return (
      <ImageEditor
        value={currentValue}
        fieldPath={activeField}
        onSave={handleSave}
        onCancel={handleCancel}
        position={position}
        existingConfig={getCurrentImageConfig()}
      />
    );
  }

  return (
    <TextEditor
      value={currentValue}
      fieldPath={activeField}
      onSave={handleSave}
      onCancel={handleCancel}
      position={position}
      existingConfig={getCurrentTextConfig()} // 🆕 YENİ PROP
    />
  );
}