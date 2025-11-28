import { useState, useCallback } from 'react';
import { ENTRANCE_ANIMATIONS, HOVER_ANIMATIONS } from '../types/animationPresets';
import { TextConfig } from '../types/textConfig.types';

export function useAnimations(config: TextConfig) {
  const [isAnimating, setIsAnimating] = useState(false);

  const getEntranceAnimation = useCallback(() => {
    return ENTRANCE_ANIMATIONS[config.entrance] || ENTRANCE_ANIMATIONS.none;
  }, [config.entrance]);

  const getHoverAnimation = useCallback(() => {
    return HOVER_ANIMATIONS[config.hover] || HOVER_ANIMATIONS.none;
  }, [config.hover]);

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), config.duration * 1000);
  }, [config.duration]);

  const getTransitionConfig = useCallback(() => {
    return {
      duration: config.duration,
      ease: [0.25, 0.1, 0.25, 1],
    };
  }, [config.duration]);

  return {
    isAnimating,
    getEntranceAnimation,
    getHoverAnimation,
    triggerAnimation,
    getTransitionConfig,
  };
}