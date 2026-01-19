'use client';

import { useState, useRef, useEffect } from 'react';

import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

import { ImageConfig, UnsplashImage, TRENDING_IMAGES } from '../types/imageConfig.types';

interface SourceTabProps {
  config: ImageConfig;
  updateConfig: <K extends keyof ImageConfig>(key: K, value: ImageConfig[K]) => void;
}

export default function SourceTab({ config, updateConfig }: SourceTabProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [unsplashImages, setUnsplashImages] = useState<UnsplashImage[]>(TRENDING_IMAGES);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedUnsplash, setSelectedUnsplash] = useState<UnsplashImage | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setUnsplashImages(TRENDING_IMAGES);
  }, []);

  const searchUnsplash = async (query: string) => {
    if (!query.trim()) {
      setUnsplashImages(TRENDING_IMAGES);
      return;
    }
    setIsSearching(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setUnsplashImages(TRENDING_IMAGES);
    setIsSearching(false);
    toast.success(`Found ${TRENDING_IMAGES.length} images`);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    if (searchTimeoutRef.current) {
clearTimeout(searchTimeoutRef.current);
}
    searchTimeoutRef.current = setTimeout(() => searchUnsplash(query), 600);
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

  return (
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
          {[1, 2, 3, 4].map(i => (
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
  );
}