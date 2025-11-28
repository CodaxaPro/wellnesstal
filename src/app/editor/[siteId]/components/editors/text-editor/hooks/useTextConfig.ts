import { useState, useEffect } from 'react';
import { TextConfig, DEFAULT_TEXT_CONFIG } from '../types/textConfig.types';
import toast from 'react-hot-toast';

interface UseTextConfigProps {
  initialValue: string;
  existingConfig?: Partial<TextConfig>;
}

export function useTextConfig({ initialValue, existingConfig }: UseTextConfigProps) {
  const [config, setConfig] = useState<TextConfig>({
    ...DEFAULT_TEXT_CONFIG,
    content: initialValue || '',
    html: initialValue || '',
    ...existingConfig,
  });

  // Load existing config on mount
  useEffect(() => {
    if (existingConfig) {
      console.log('📥 Loading existing text config:', existingConfig);
      setConfig(prev => ({ ...prev, ...existingConfig }));
      toast.success('⚙️ Previous settings loaded!', { duration: 2000 });
    }
  }, []);

  // Update content
  useEffect(() => {
    if (initialValue && !existingConfig) {
      setConfig(prev => ({ 
        ...prev, 
        content: initialValue,
        html: initialValue,
      }));
    }
  }, [initialValue]);

  const updateConfig = <K extends keyof TextConfig>(key: K, value: TextConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateMultipleConfigs = (updates: Partial<TextConfig>) => {
    setConfig(prev => ({ ...prev, ...updates }));
  };

  const resetConfig = () => {
    setConfig({
      ...DEFAULT_TEXT_CONFIG,
      content: config.content,
      html: config.html,
    });
    toast.success('Settings reset!');
  };

  const applyPreset = (preset: 'hero' | 'subheading' | 'body' | 'caption') => {
    const presets = {
      hero: {
        fontSize: 48,
        fontWeight: 700,
        lineHeight: 1.2,
        letterSpacing: -1,
        textColor: '#000000',
      },
      subheading: {
        fontSize: 24,
        fontWeight: 600,
        lineHeight: 1.4,
        letterSpacing: -0.5,
        textColor: '#374151',
      },
      body: {
        fontSize: 16,
        fontWeight: 400,
        lineHeight: 1.6,
        letterSpacing: 0,
        textColor: '#6B7280',
      },
      caption: {
        fontSize: 14,
        fontWeight: 400,
        lineHeight: 1.5,
        letterSpacing: 0,
        textColor: '#9CA3AF',
      },
    };

    updateMultipleConfigs(presets[preset]);
    toast.success(`✨ ${preset.charAt(0).toUpperCase() + preset.slice(1)} style applied!`);
  };

  return {
    config,
    updateConfig,
    updateMultipleConfigs,
    resetConfig,
    applyPreset,
    setConfig,
  };
}