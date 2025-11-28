import { useState, useEffect } from 'react';
import { ImageConfig, DEFAULT_IMAGE_CONFIG } from '../types/imageConfig.types';
import toast from 'react-hot-toast';

interface UseImageConfigProps {
  initialUrl: string;
  existingConfig?: ImageConfig;
}

export function useImageConfig({ initialUrl, existingConfig }: UseImageConfigProps) {
  const [config, setConfig] = useState<ImageConfig>({
    ...DEFAULT_IMAGE_CONFIG,
    url: initialUrl || '',
  });

  // Load existing config on mount
  useEffect(() => {
    if (existingConfig) {
      console.log('📥 Loading existing config:', existingConfig);
      setConfig(existingConfig);
      toast.success('⚙️ Previous settings loaded!', { duration: 2000 });
    }
  }, [existingConfig]);

  // Update URL if changed
  useEffect(() => {
    if (initialUrl && !existingConfig) {
      setConfig(prev => ({ ...prev, url: initialUrl }));
    }
  }, [initialUrl, existingConfig]);

  const updateConfig = <K extends keyof ImageConfig>(key: K, value: ImageConfig[K]) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const resetConfig = () => {
    setConfig({
      ...config,
      rotate: 0,
      flipH: false,
      flipV: false,
      brightness: 0,
      contrast: 0,
      saturation: 0,
      blur: 0,
      sharpness: 0,
      hue: 0,
      opacity: 100,
      grayscale: false,
      sepia: false,
      invert: false,
      filter: 'none',
      shadowX: 0,
      shadowY: 4,
      shadowBlur: 8,
      overlayOpacity: 0,
      vignette: 0,
    });
    toast.success('Settings reset!');
  };

  return {
    config,
    updateConfig,
    resetConfig,
    setConfig,
  };
}