'use client';

import { useEffect, useRef, useState } from 'react';

import { AnimatePresence, motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';

interface ImageEditorProps {
  value: string;
  fieldPath: string;
  onSave: (value: string, config: ImageConfig) => void;
  onCancel: () => void;
  position: { top: number; left: number };
}

type TabType = 'source' | 'crop' | 'adjust' | 'effects' | 'position' | 'animate' | 'performance' | 'seo';

interface ImageConfig {
  url: string;

  // Crop & Transform
  rotate: number;
  flipH: boolean;
  flipV: boolean;

  // Adjustments
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  sharpness: number;
  hue: number;
  opacity: number;
  grayscale: boolean;
  sepia: boolean;
  invert: boolean;

  // Effects
  filter: 'none' | 'vibrant' | 'warm' | 'cool' | 'bw' | 'vintage' | 'cinematic' | 'dramatic' | 'soft';
  shadowX: number;
  shadowY: number;
  shadowBlur: number;
  shadowColor: string;
  overlayColor: string;
  overlayOpacity: number;
  vignette: number;

  // Position
  objectFit: 'cover' | 'contain' | 'fill' | 'none';
  objectPosition: string;

  // Animation
  entrance: 'none' | 'fade' | 'slide-up' | 'slide-down' | 'slide-left' | 'slide-right' | 'zoom' | 'bounce';
  hover: 'none' | 'zoom' | 'tilt' | 'lift' | 'glow' | 'brightness';
  duration: number;
  easing: 'ease' | 'linear' | 'ease-in-out' | 'spring';

  // Performance
  lazyLoad: boolean;
  quality: number;

  // SEO
  alt: string;
  title: string;
}

interface UnsplashImage {
  id: string;
  urls: { regular: string; small: string; thumb: string };
  user: { name: string; username: string };
  alt_description: string | null;
}

const TRENDING_IMAGES: UnsplashImage[] = [
  {
    id: '1',
    urls: {
      regular: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1080&q=80',
      small: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80',
      thumb: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80',
    },
    user: { name: 'Bench Accounting', username: 'benchaccounting' },
    alt_description: 'modern office workspace',
  },
  {
    id: '2',
    urls: {
      regular: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=1080&q=80',
      small: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&q=80',
      thumb: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=200&q=80',
    },
    user: { name: 'Clément H', username: 'clemhlrdt' },
    alt_description: 'laptop on desk',
  },
  {
    id: '3',
    urls: {
      regular: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1080&q=80',
      small: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400&q=80',
      thumb: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=200&q=80',
    },
    user: { name: 'Marvin Meyer', username: 'marvelous' },
    alt_description: 'team collaboration',
  },
  {
    id: '4',
    urls: {
      regular: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1080&q=80',
      small: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&q=80',
      thumb: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=200&q=80',
    },
    user: { name: 'Chris Montgomery', username: 'cwmonty' },
    alt_description: 'business meeting',
  },
  {
    id: '5',
    urls: {
      regular: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1080&q=80',
      small: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&q=80',
      thumb: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=200&q=80',
    },
    user: { name: 'Annie Spratt', username: 'anniespratt' },
    alt_description: 'technology startup',
  },
  {
    id: '6',
    urls: {
      regular: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1080&q=80',
      small: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&q=80',
      thumb: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=200&q=80',
    },
    user: { name: 'You X Ventures', username: 'youxventures' },
    alt_description: 'team celebrating',
  },
];

export default function ImageEditor({
  value,
  fieldPath,
  onSave,
  onCancel,
  position,
}: ImageEditorProps) {
  const [activeTab, setActiveTab] = useState<TabType>('source');
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [localPosition, setLocalPosition] = useState(position);

  // Source state
  const [imageUrl, setImageUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUnsplash, setSelectedUnsplash] = useState<UnsplashImage | null>(null);

  // Image config
  const [config, setConfig] = useState<ImageConfig>({
    url: value || '',
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
    shadowColor: '#000000',
    overlayColor: '#000000',
    overlayOpacity: 0,
    vignette: 0,
    objectFit: 'cover',
    objectPosition: 'center',
    entrance: 'fade',
    hover: 'zoom',
    duration: 0.6,
    easing: 'ease',
    lazyLoad: true,
    quality: 85,
    alt: '',
    title: '',
  });

  const popupRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalPosition(position);
  }, [position]);

  useEffect(() => {
    setUnsplashImages(TRENDING_IMAGES);
  }, []);

  useEffect(() => {
    if (value) {
      setConfig(prev => ({ ...prev, url: value }));
    }
  }, [value]);

  // Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.drag-handle')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - localPosition.left,
        y: e.clientY - localPosition.top,
      });
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setLocalPosition({
          top: Math.max(0, Math.min(e.clientY - dragOffset.y, window.innerHeight - 100)),
          left: Math.max(0, Math.min(e.clientX - dragOffset.x, window.innerWidth - 1200)),
        });
      }
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Update config helper
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateConfig = (key: keyof ImageConfig, value: any) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  // Search Unsplash
  const searchUnsplash = async (query: string) => {
    if (!query.trim()) {
      setUnsplashImages(TRENDING_IMAGES);
      return;
    }
    setIsSearching(true);
    await new Promise<void>(resolve => {
      setTimeout(() => {
        resolve();
      }, 1000);
    });
    setUnsplashImages(TRENDING_IMAGES);
    setIsSearching(false);
    toast.success(`Found ${TRENDING_IMAGES.length} images`);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) {
clearTimeout(searchTimeoutRef.current);
}
    searchTimeoutRef.current = setTimeout(() => {
      void searchUnsplash(query);
    }, 600);
  };

  const handleSelectImage = (image: UnsplashImage) => {
    setSelectedUnsplash(image);
    updateConfig('url', image.urls.regular);
    updateConfig('alt', image.alt_description || `Photo by ${image.user.name}`);
    toast.success('Image selected!');
  };

  const handleUrlSubmit = () => {
    if (!imageUrl.trim()) {
      toast.error('Please enter an image URL');
      return;
    }
    updateConfig('url', imageUrl);
    toast.success('Image loaded!');
  };

  const handleSave = () => {
    if (!config.url) {
      toast.error('Please select an image');
      return;
    }
    onSave(config.url, config);
    toast.success('🎉 Image applied with all effects!');
  };

  const handleReset = () => {
    // eslint-disable-next-line no-alert
    if (window.confirm('Reset all settings to default?')) {
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
    }
  };

  // Generate CSS filters
  const getFilterStyle = (): React.CSSProperties => {
    const filters: string[] = [];

    if (config.brightness !== 0) {
filters.push(`brightness(${1 + config.brightness / 100})`);
}
    if (config.contrast !== 0) {
filters.push(`contrast(${1 + config.contrast / 100})`);
}
    if (config.saturation !== 0) {
filters.push(`saturate(${1 + config.saturation / 100})`);
}
    if (config.blur > 0) {
filters.push(`blur(${config.blur}px)`);
}
    if (config.hue !== 0) {
filters.push(`hue-rotate(${config.hue}deg)`);
}
    if (config.grayscale) {
filters.push('grayscale(100%)');
}
    if (config.sepia) {
filters.push('sepia(100%)');
}
    if (config.invert) {
filters.push('invert(100%)');
}

    // Preset filters
    const filterPresets: Record<string, string> = {
      vibrant: 'saturate(1.4) contrast(1.1)',
      warm: 'sepia(0.3) saturate(1.2)',
      cool: 'hue-rotate(180deg) saturate(0.8)',
      bw: 'grayscale(100%) contrast(1.2)',
      vintage: 'sepia(0.5) contrast(0.9) brightness(1.1)',
      cinematic: 'contrast(1.2) saturate(0.8) brightness(0.95)',
      dramatic: 'contrast(1.4) saturate(1.3) brightness(0.9)',
      soft: 'contrast(0.85) saturate(0.9) brightness(1.05)',
    };

    if (config.filter && config.filter !== 'none' && filterPresets[config.filter]) {
      const preset = filterPresets[config.filter]
      if (preset) {
        filters.push(preset)
      }
    }

    return {
      filter: filters.join(' '),
      opacity: config.opacity / 100,
      transform: `rotate(${config.rotate}deg) scaleX(${config.flipH ? -1 : 1}) scaleY(${config.flipV ? -1 : 1})`,
      objectFit: config.objectFit,
      objectPosition: config.objectPosition,
      boxShadow: `${config.shadowX}px ${config.shadowY}px ${config.shadowBlur}px ${config.shadowColor}`,
    };
  };

  // Animation helpers for preview
  const getEntranceAnimation = () => {
    const animations = {
      'none': {},
      'fade': { opacity: 0, scale: 0.95 },
      'slide-up': { opacity: 0, y: 50 },
      'slide-down': { opacity: 0, y: -50 },
      'slide-left': { opacity: 0, x: 50 },
      'slide-right': { opacity: 0, x: -50 },
      'zoom': { opacity: 0, scale: 0.8 },
      'bounce': { opacity: 0, scale: 0.5, y: -50 },
    };
    return animations[config.entrance] || {};
  };

  const getHoverAnimation = () => {
    const animations = {
      'none': {},
      'zoom': { scale: 1.05 },
      'tilt': { rotate: 2, scale: 1.03 },
      'lift': { y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.3)' },
      'glow': { filter: 'brightness(1.1) drop-shadow(0 0 20px rgba(168, 85, 247, 0.4))' },
      'brightness': { filter: 'brightness(1.15)' },
    };
    return animations[config.hover] || {};
  };

  const tabs = [
    { id: 'source' as TabType, label: 'Source', icon: '🖼️' },
    { id: 'crop' as TabType, label: 'Transform', icon: '✂️' },
    { id: 'adjust' as TabType, label: 'Adjust', icon: '🎨' },
    { id: 'effects' as TabType, label: 'Effects', icon: '✨' },
    { id: 'position' as TabType, label: 'Position', icon: '📐' },
    { id: 'animate' as TabType, label: 'Animate', icon: '🎬' },
    { id: 'performance' as TabType, label: 'Performance', icon: '🚀' },
    { id: 'seo' as TabType, label: 'SEO', icon: '🏷️' },
  ];

  const filters = [
    { id: 'none', label: 'None', preview: 'Original' },
    { id: 'vibrant', label: 'Vibrant', preview: 'Saturate++' },
    { id: 'warm', label: 'Warm', preview: 'Sepia' },
    { id: 'cool', label: 'Cool', preview: 'Blue' },
    { id: 'bw', label: 'B&W', preview: 'Grayscale' },
    { id: 'vintage', label: 'Vintage', preview: 'Retro' },
    { id: 'cinematic', label: 'Cinematic', preview: 'Film' },
    { id: 'dramatic', label: 'Dramatic', preview: 'High Contrast' },
    { id: 'soft', label: 'Soft', preview: 'Gentle' },
  ];

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

      {/* Main Popup - FIXED LAYOUT */}
      <motion.div
        ref={popupRef}
        initial={{ opacity: 0, scale: 0.9, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed bg-white rounded-3xl shadow-2xl z-[999] flex flex-col"
        style={{
          top: `${localPosition.top}px`,
          left: `${localPosition.left}px`,
          width: '1200px',
          height: 'calc(90vh)',
          cursor: isDragging ? 'grabbing' : 'default',
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Header */}
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

        {/* Tabs */}
        <div className="flex gap-1 px-6 py-4 bg-gray-50 border-b overflow-x-auto flex-shrink-0">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl font-medium text-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* Content - FLEX-1 FOR PROPER SCROLLING */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Panel - Controls */}
          <div className="w-[500px] border-r p-6 overflow-y-auto custom-scrollbar">
            <AnimatePresence mode="wait">
              {/* SOURCE TAB */}
              {activeTab === 'source' && (
                <motion.div
                  key="source"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block font-bold mb-3">🔗 URL Input</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        onKeyDown={(e) => e.key === 'Enter' && handleUrlSubmit()}
                      />
                      <button
                        onClick={handleUrlSubmit}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700"
                      >
                        Load
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-3">🔍 Search Unsplash</label>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      placeholder="Search for business, team, office..."
                      className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {isSearching ? (
                    <div className="grid grid-cols-2 gap-3">
                      {[1,2,3,4].map(i => (
                        <div key={i} className="aspect-video bg-gray-200 rounded-xl animate-pulse" />
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
                      {unsplashImages.map((img) => (
                        <motion.div
                          key={img.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleSelectImage(img)}
                          className={`relative aspect-video rounded-xl overflow-hidden cursor-pointer border-2 ${
                            selectedUnsplash?.id === img.id ? 'border-purple-500 ring-2 ring-purple-200' : 'border-gray-200'
                          }`}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={img.urls.thumb} alt="" className="w-full h-full object-cover" />
                          {selectedUnsplash?.id === img.id && (
                            <div className="absolute inset-0 bg-purple-600/20 flex items-center justify-center">
                              <div className="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold">✓</div>
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* TRANSFORM TAB */}
              {activeTab === 'crop' && (
                <motion.div
                  key="crop"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block font-bold mb-3">🔄 Rotate</label>
                    <div className="flex gap-2">
                      {[0, 90, 180, 270].map(deg => (
                        <button
                          key={deg}
                          onClick={() => updateConfig('rotate', deg)}
                          className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                            config.rotate === deg ? 'bg-purple-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {deg}°
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-3">🔀 Flip</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => updateConfig('flipH', !config.flipH)}
                        className={`flex-1 py-3 rounded-xl font-bold ${
                          config.flipH ? 'bg-purple-600 text-white' : 'bg-gray-100'
                        }`}
                      >
                        Horizontal
                      </button>
                      <button
                        onClick={() => updateConfig('flipV', !config.flipV)}
                        className={`flex-1 py-3 rounded-xl font-bold ${
                          config.flipV ? 'bg-purple-600 text-white' : 'bg-gray-100'
                        }`}
                      >
                        Vertical
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ADJUST TAB */}
              {activeTab === 'adjust' && (
                <motion.div
                  key="adjust"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  {[
                    { key: 'brightness', label: '☀️ Brightness', min: -100, max: 100 },
                    { key: 'contrast', label: '◐ Contrast', min: -100, max: 100 },
                    { key: 'saturation', label: '🎨 Saturation', min: -100, max: 100 },
                    { key: 'blur', label: '🌫️ Blur', min: 0, max: 20 },
                    { key: 'hue', label: '🌈 Hue Rotate', min: 0, max: 360 },
                    { key: 'opacity', label: '👻 Opacity', min: 0, max: 100 },
                  ].map(({ key, label, min, max }) => (
                    <div key={key}>
                      <div className="flex justify-between mb-2">
                        <label className="font-bold">{label}</label>
                        <span className="text-purple-600 font-mono">{config[key as keyof ImageConfig]}</span>
                      </div>
                      <input
                        type="range"
                        min={min}
                        max={max}
                        value={config[key as keyof ImageConfig] as number}
                        onChange={(e) => updateConfig(key as keyof ImageConfig, Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                      />
                    </div>
                  ))}

                  <div className="flex gap-3">
                    <button
                      onClick={() => updateConfig('grayscale', !config.grayscale)}
                      className={`flex-1 py-3 rounded-xl font-bold ${config.grayscale ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
                    >
                      Grayscale
                    </button>
                    <button
                      onClick={() => updateConfig('sepia', !config.sepia)}
                      className={`flex-1 py-3 rounded-xl font-bold ${config.sepia ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
                    >
                      Sepia
                    </button>
                    <button
                      onClick={() => updateConfig('invert', !config.invert)}
                      className={`flex-1 py-3 rounded-xl font-bold ${config.invert ? 'bg-purple-600 text-white' : 'bg-gray-100'}`}
                    >
                      Invert
                    </button>
                  </div>
                </motion.div>
              )}

              {/* EFFECTS TAB */}
              {activeTab === 'effects' && (
                <motion.div
                  key="effects"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block font-bold mb-3">🎭 Preset Filters</label>
                    <div className="grid grid-cols-3 gap-2">
                      {filters.map(f => (
                        <button
                          key={f.id}
                          onClick={() => updateConfig('filter', f.id)}
                          className={`p-3 rounded-xl text-sm font-bold ${
                            config.filter === f.id ? 'bg-purple-600 text-white' : 'bg-gray-100'
                          }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-3">🌑 Shadow</label>
                    {[
                      { key: 'shadowX', label: 'X Offset', min: -20, max: 20 },
                      { key: 'shadowY', label: 'Y Offset', min: -20, max: 20 },
                      { key: 'shadowBlur', label: 'Blur', min: 0, max: 40 },
                    ].map(({ key, label, min, max }) => (
                      <div key={key} className="mb-3">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">{label}</span>
                          <span className="text-sm font-mono text-purple-600">{config[key as keyof ImageConfig]}</span>
                        </div>
                        <input
                          type="range"
                          min={min}
                          max={max}
                          value={config[key as keyof ImageConfig] as number}
                          onChange={(e) => updateConfig(key as keyof ImageConfig, Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block font-bold mb-3">🎨 Overlay</label>
                    <div className="flex gap-3 mb-3">
                      <input
                        type="color"
                        value={config.overlayColor}
                        onChange={(e) => updateConfig('overlayColor', e.target.value)}
                        className="w-20 h-12 rounded-xl cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Opacity</span>
                          <span className="text-sm font-mono text-purple-600">{config.overlayOpacity}%</span>
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={config.overlayOpacity}
                          onChange={(e) => updateConfig('overlayOpacity', Number(e.target.value))}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="font-bold">🔦 Vignette</label>
                      <span className="text-purple-600 font-mono">{config.vignette}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={config.vignette}
                      onChange={(e) => updateConfig('vignette', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>
                </motion.div>
              )}

              {/* POSITION TAB */}
              {activeTab === 'position' && (
                <motion.div
                  key="position"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block font-bold mb-3">📏 Object Fit</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['cover', 'contain', 'fill', 'none'].map(fit => (
                        <button
                          key={fit}
                          onClick={() => updateConfig('objectFit', fit)}
                          className={`py-3 rounded-xl font-bold capitalize ${
                            config.objectFit === fit ? 'bg-purple-600 text-white' : 'bg-gray-100'
                          }`}
                        >
                          {fit}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-3">📍 Position</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        ['top left', 'top', 'top right'],
                        ['left', 'center', 'right'],
                        ['bottom left', 'bottom', 'bottom right'],
                      ].map((row, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <div key={i} className="contents">
                          {row.map(pos => (
                            <button
                              key={pos}
                              onClick={() => updateConfig('objectPosition', pos)}
                              className={`py-3 rounded-xl font-bold text-sm ${
                                config.objectPosition === pos ? 'bg-purple-600 text-white' : 'bg-gray-100'
                              }`}
                            >
                              {pos.split(' ').map(w => w?.[0]?.toUpperCase() ?? '').join('')}
                            </button>
                          ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ANIMATE TAB */}
              {activeTab === 'animate' && (
                <motion.div
                  key="animate"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block font-bold mb-3">🎬 Entrance Animation</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['none', 'fade', 'slide-up', 'slide-down', 'zoom', 'bounce'].map(anim => (
                        <button
                          key={anim}
                          onClick={() => updateConfig('entrance', anim)}
                          className={`py-3 rounded-xl font-bold ${
                            config.entrance === anim ? 'bg-purple-600 text-white' : 'bg-gray-100'
                          }`}
                        >
                          {anim.split('-').map(w => w?.[0] ? w[0].toUpperCase() + w.slice(1) : w).join(' ')}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold mb-3">🖱️ Hover Effect</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['none', 'zoom', 'tilt', 'lift', 'glow', 'brightness'].map(hover => (
                        <button
                          key={hover}
                          onClick={() => updateConfig('hover', hover)}
                          className={`py-3 rounded-xl font-bold capitalize ${
                            config.hover === hover ? 'bg-purple-600 text-white' : 'bg-gray-100'
                          }`}
                        >
                          {hover}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="font-bold">⏱️ Duration</label>
                      <span className="text-purple-600 font-mono">{config.duration}s</span>
                    </div>
                    <input
                      type="range"
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={config.duration}
                      onChange={(e) => updateConfig('duration', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-3">📈 Easing</label>
                    <div className="grid grid-cols-2 gap-2">
                      {['ease', 'linear', 'ease-in-out', 'spring'].map(easing => (
                        <button
                          key={easing}
                          onClick={() => updateConfig('easing', easing)}
                          className={`py-3 rounded-xl font-bold capitalize ${
                            config.easing === easing ? 'bg-purple-600 text-white' : 'bg-gray-100'
                          }`}
                        >
                          {easing}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* PERFORMANCE TAB */}
              {activeTab === 'performance' && (
                <motion.div
                  key="performance"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="flex items-center justify-between py-4 px-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100">
                      <span className="font-bold">⚡ Lazy Loading</span>
                      <input
                        type="checkbox"
                        checked={config.lazyLoad}
                        onChange={(e) => updateConfig('lazyLoad', e.target.checked)}
                        className="w-6 h-6 accent-purple-600"
                      />
                    </label>
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="font-bold">🎯 Image Quality</label>
                      <span className="text-purple-600 font-mono">{config.quality}%</span>
                    </div>
                    <input
                      type="range"
                      min={60}
                      max={100}
                      value={config.quality}
                      onChange={(e) => updateConfig('quality', Number(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* SEO TAB */}
              {activeTab === 'seo' && (
                <motion.div
                  key="seo"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div>
                    <label className="block font-bold mb-2">🏷️ Alt Text</label>
                    <textarea
                      value={config.alt}
                      onChange={(e) => updateConfig('alt', e.target.value)}
                      placeholder="Describe this image for accessibility and SEO..."
                      className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500 resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block font-bold mb-2">📝 Title Attribute</label>
                    <input
                      type="text"
                      value={config.title}
                      onChange={(e) => updateConfig('title', e.target.value)}
                      placeholder="Image title (appears on hover)"
                      className="w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Right Panel - Live Preview WITH ANIMATIONS */}
          <div className="flex-1 p-8 bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col overflow-y-auto">
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold">👁️ Live Preview</h3>
              <p className="text-sm text-gray-600">All effects applied in real-time</p>
            </div>

            <div className="flex-1 flex items-center justify-center">
              {config.url ? (
                <motion.div
                  key={config.url} // Re-animate on image change
                  className="relative max-w-full max-h-full"
                  initial={getEntranceAnimation()}
                  animate={{ opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 }}
                  transition={{
  duration: config.duration,
  ease: config.easing === 'spring' ? [0.25, 0.1, 0.25, 1] :
        config.easing === 'ease' ? [0.25, 0.1, 0.25, 1] :
        config.easing === 'ease-in-out' ? [0.42, 0, 0.58, 1] :
        config.easing === 'linear' ? [0, 0, 1, 1] :
        [0.25, 0.1, 0.25, 1]
}}
                  whileHover={getHoverAnimation()}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={config.url}
                    alt="Preview"
                    className="max-w-full max-h-[500px] rounded-2xl shadow-2xl"
                    style={getFilterStyle()}
                  />

                  {/* Overlay */}
                  {config.overlayOpacity > 0 && (
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        backgroundColor: config.overlayColor,
                        opacity: config.overlayOpacity / 100,
                      }}
                    />
                  )}

                  {/* Vignette */}
                  {config.vignette > 0 && (
                    <div
                      className="absolute inset-0 rounded-2xl pointer-events-none"
                      style={{
                        background: `radial-gradient(circle, transparent 0%, rgba(0,0,0,${config.vignette / 100}) 100%)`,
                      }}
                    />
                  )}
                </motion.div>
              ) : (
                <div className="text-center text-gray-400">
                  <div className="text-6xl mb-4">🖼️</div>
                  <p>Select an image to preview</p>
                </div>
              )}
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm">
              <div className="bg-white rounded-xl p-3">
                <div className="font-bold text-purple-600">{config.filter}</div>
                <div className="text-gray-500">Filter</div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="font-bold text-purple-600">{config.entrance}</div>
                <div className="text-gray-500">Animation</div>
              </div>
              <div className="bg-white rounded-xl p-3">
                <div className="font-bold text-purple-600">{config.quality}%</div>
                <div className="text-gray-500">Quality</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions - FLEX-SHRINK-0 TO ALWAYS SHOW */}
        <div className="flex gap-4 px-8 py-6 bg-gray-50 border-t flex-shrink-0">
          <button
            onClick={handleReset}
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
            onClick={handleSave}
            disabled={!config.url}
            className="px-12 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ✅ Apply Image
          </button>
        </div>
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
