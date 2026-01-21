// src/app/wizard/templates/variants/heroes/SplitHero.tsx

'use client';

import { useState, useEffect } from 'react';

import { motion, AnimatePresence } from 'framer-motion';

interface SplitHeroProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  image?: string;
  imageConfig?: any;
  titleConfig?: any;
  subtitleConfig?: any;
  ctaTextConfig?: any;
  primaryColor?: string;
}

export default function SplitHero(props: SplitHeroProps) {
  const title = props.title || "Welcome to Your Business";
  const subtitle = props.subtitle || "Premium services designed for you";
  const ctaText = props.ctaText || "Get Started";
  const image = props.image || "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800";
  const primaryColor = props.primaryColor || "#9333ea";
  const imageConfig = props.imageConfig || {};
  const titleConfig = props.titleConfig || {};
  const subtitleConfig = props.subtitleConfig || {};
  const ctaTextConfig = props.ctaTextConfig || {};

  console.log('🎯 SplitHero props:', { titleConfig, title });
  console.log('🎯 titleConfig.html:', titleConfig.html);
  console.log('🎯 Will render:', titleConfig.html || title);

  // Helper function to add inline styles to HTML
  const getStyledHTML = (html: string, config: any, defaultStyle: any) => {
    if (!html) {
return html;
}

    const styleAttributes: string[] = [];

    styleAttributes.push(`font-family: ${config.fontFamily || defaultStyle.fontFamily || 'inherit'}`);
    styleAttributes.push(`font-size: ${config.fontSize ? `${config.fontSize}px` : defaultStyle.fontSize}`);
    styleAttributes.push(`font-weight: ${config.fontWeight || defaultStyle.fontWeight}`);
    styleAttributes.push(`color: ${config.textColor || defaultStyle.color}`);
    styleAttributes.push(`line-height: ${config.lineHeight || defaultStyle.lineHeight || 'normal'}`);

    if (config.letterSpacing !== undefined) {
      styleAttributes.push(`letter-spacing: ${config.letterSpacing}px`);
    }

    if (config.textAlign) {
      styleAttributes.push(`text-align: ${config.textAlign}`);
    }

    if (config.textTransform) {
      styleAttributes.push(`text-transform: ${config.textTransform}`);
    }

    const styleString = styleAttributes.join('; ');

    // Add style to first tag in HTML
    return html.replace(/^<(\w+)([^>]*)>/, `<$1$2 style="${styleString}">`);
  };

  const styledTitle = getStyledHTML(
    titleConfig.html || title,
    titleConfig,
    { fontSize: '3rem', fontWeight: 700, color: '#111827', fontFamily: 'inherit', lineHeight: '1.2' }
  );

  const styledSubtitle = getStyledHTML(
    subtitleConfig.html || subtitle,
    subtitleConfig,
    { fontSize: '1.25rem', fontWeight: 400, color: '#4B5563', fontFamily: 'inherit', lineHeight: '1.5' }
  );

  const styledCtaText = getStyledHTML(
    ctaTextConfig.html || ctaText,
    ctaTextConfig,
    { fontSize: '1.125rem', fontWeight: 600, color: 'inherit', fontFamily: 'inherit', lineHeight: '1.5' }
  );

  const [currentImage, setCurrentImage] = useState(image);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (image !== currentImage) {
      setIsLoading(true);

      const img = new Image();
      img.onload = () => {
        setTimeout(() => {
          setCurrentImage(image);
          setIsLoading(false);
        }, 300);
      };
      img.onerror = () => {
        console.error('Failed to load image:', image);
        setIsLoading(false);
      };
      img.src = image;
    }
  }, [image, currentImage]);

  const getImageStyle = (): React.CSSProperties => {
    const filters: string[] = [];

    if (imageConfig.brightness) {
filters.push(`brightness(${1 + imageConfig.brightness / 100})`);
}
    if (imageConfig.contrast) {
filters.push(`contrast(${1 + imageConfig.contrast / 100})`);
}
    if (imageConfig.saturation) {
filters.push(`saturate(${1 + imageConfig.saturation / 100})`);
}
    if (imageConfig.blur) {
filters.push(`blur(${imageConfig.blur}px)`);
}
    if (imageConfig.hue) {
filters.push(`hue-rotate(${imageConfig.hue}deg)`);
}
    if (imageConfig.grayscale) {
filters.push('grayscale(100%)');
}
    if (imageConfig.sepia) {
filters.push('sepia(100%)');
}
    if (imageConfig.invert) {
filters.push('invert(100%)');
}

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

    if (imageConfig.filter && imageConfig.filter !== 'none') {
      const filterKey = imageConfig.filter as keyof typeof filterPresets
      if (filterPresets[filterKey]) {
        filters.push(filterPresets[filterKey]);
      }
    }

    return {
      filter: filters.join(' ') || 'none',
      opacity: imageConfig.opacity ? imageConfig.opacity / 100 : 1,
      transform: `rotate(${imageConfig.rotate || 0}deg) scaleX(${imageConfig.flipH ? -1 : 1}) scaleY(${imageConfig.flipV ? -1 : 1})`,
      objectFit: imageConfig.objectFit || 'cover',
      objectPosition: imageConfig.objectPosition || 'center',
      boxShadow: imageConfig.shadowX !== undefined
        ? `${imageConfig.shadowX}px ${imageConfig.shadowY}px ${imageConfig.shadowBlur}px ${imageConfig.shadowColor || '#000000'}`
        : '0 4px 8px rgba(0,0,0,0.1)',
    };
  };

  const getEntranceAnimation = () => {
    const animations: Record<string, any> = {
      fade: { opacity: 0, scale: 0.95 },
      'slide-up': { opacity: 0, y: 50 },
      'slide-down': { opacity: 0, y: -50 },
      'slide-left': { opacity: 0, x: 50 },
      'slide-right': { opacity: 0, x: -50 },
      zoom: { opacity: 0, scale: 0.8 },
      bounce: { opacity: 0, scale: 0.5, y: -50 },
    };
    return animations[imageConfig.entrance || 'fade'] || { opacity: 0, scale: 0.95 };
  };

  const getHoverAnimation = () => {
    const hovers: Record<string, any> = {
      zoom: { scale: 1.05 },
      tilt: { rotate: 2, scale: 1.03 },
      lift: { y: -10, boxShadow: '0 20px 40px rgba(0,0,0,0.2)' },
      glow: { filter: 'brightness(1.1)' },
      brightness: { filter: 'brightness(1.15)' },
    };
    return hovers[imageConfig.hover || 'zoom'] || { scale: 1.05 };
  };

  const duration = imageConfig.duration || 0.6;
  const easing = imageConfig.easing || 'ease';

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left - Text */}
          <div>
            <div
              className="mb-6 leading-tight"
              data-editable-hero-title
              dangerouslySetInnerHTML={{ __html: styledTitle }}
            />
            <div
              className="mb-8"
              data-editable-hero-subtitle
              dangerouslySetInnerHTML={{ __html: styledSubtitle }}
            />
            <div className="flex gap-4">
              <button
                className="px-8 py-4 rounded-lg font-semibold shadow-lg hover:opacity-90 transition-all"
                style={{
                  backgroundColor: primaryColor,
                  color: 'white',
                }}
                data-editable-hero-cta
                dangerouslySetInnerHTML={{ __html: styledCtaText }}
              />
              <button className="px-8 py-4 rounded-lg font-semibold text-gray-700 bg-white border-2 border-gray-300 hover:border-gray-400 transition-all">
                Learn More
              </button>
            </div>
          </div>

          {/* Right - Animated Image */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImage}
                initial={getEntranceAnimation()}
                animate={{ opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{
                  duration,
                  ...(easing === 'linear' && { ease: 'linear' as const }),
                  ...(easing === 'ease-in-out' && { ease: 'easeInOut' as const }),
                  ...(easing !== 'linear' && easing !== 'ease-in-out' && { ease: 'easeOut' as const }),
                }}
                className="relative"
              >
                <motion.div
                  className="rounded-2xl overflow-hidden shadow-2xl relative"
                  data-editable-hero-image
                  whileHover={imageConfig.hover !== 'none' ? getHoverAnimation() : {}}
                  transition={{ duration: 0.3 }}
                >
                  <img
                    src={currentImage}
                    alt={imageConfig.alt || "Hero"}
                    title={imageConfig.title || ""}
                    className="w-full h-[500px] object-cover"
                    style={getImageStyle()}
                    loading={imageConfig.lazyLoad === false ? 'eager' : 'lazy'}
                  />

                  {imageConfig.overlayOpacity > 0 && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundColor: imageConfig.overlayColor || '#000000',
                        opacity: imageConfig.overlayOpacity / 100,
                      }}
                    />
                  )}

                  {imageConfig.vignette > 0 && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        backgroundImage: `radial-gradient(circle, transparent 0%, rgba(0,0,0,${imageConfig.vignette / 100}) 100%)`,
                      }}
                    />
                  )}
                </motion.div>

                <AnimatePresence>
                  {isLoading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </AnimatePresence>

            <motion.div
              animate={{
                y: [0, -20, 0],
                rotate: [0, 5, 0]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute -top-4 -right-4 w-24 h-24 bg-purple-600 rounded-full opacity-20 blur-2xl pointer-events-none"
            />
            <motion.div
              animate={{
                y: [0, 20, 0],
                rotate: [0, -5, 0]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
              className="absolute -bottom-4 -left-4 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-2xl pointer-events-none"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
