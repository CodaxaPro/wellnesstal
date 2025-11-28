import { Variants } from 'framer-motion';

/**
 * Get stagger animation for toolbar buttons
 */
export function getStaggerAnimation(delay: number = 0.05): Variants {
  return {
    hidden: { opacity: 0, scale: 0.8, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * delay,
        type: 'spring',
        damping: 15,
        stiffness: 200,
      },
    }),
  };
}

/**
 * Get ripple effect animation
 */
export function getRippleAnimation() {
  return {
    initial: { scale: 0, opacity: 0.5 },
    animate: { scale: 2, opacity: 0 },
    transition: { duration: 0.6 },
  };
}

/**
 * Get button hover/tap animations
 */
export function getButtonAnimations() {
  return {
    whileHover: { scale: 1.05, boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)' },
    whileTap: { scale: 0.95 },
    transition: { duration: 0.2 },
  };
}

/**
 * Get slide-in animation
 */
export function getSlideInAnimation(direction: 'up' | 'down' | 'left' | 'right' = 'up') {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  return {
    initial: { opacity: 0, ...directions[direction] },
    animate: { opacity: 1, y: 0, x: 0 },
    exit: { opacity: 0, ...directions[direction] },
    transition: { duration: 0.3 },
  };
}

/**
 * Get fade animation
 */
export function getFadeAnimation(delay: number = 0) {
  return {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.3, delay },
  };
}

/**
 * Get scale animation
 */
export function getScaleAnimation() {
  return {
    initial: { scale: 0.9, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.9, opacity: 0 },
    transition: { type: 'spring', damping: 20, stiffness: 300 },
  };
}

/**
 * Get shimmer animation keyframes
 */
export function getShimmerKeyframes() {
  return `
    @keyframes shimmer {
      0% { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
  `;
}

/**
 * Get pulse animation
 */
export function getPulseAnimation() {
  return {
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.8, 1],
    },
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  };
}

/**
 * Get bounce animation
 */
export function getBounceAnimation() {
  return {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: {
      type: 'spring',
      damping: 10,
      stiffness: 100,
    },
  };
}

/**
 * Get rotate animation
 */
export function getRotateAnimation(degrees: number = 360) {
  return {
    animate: { rotate: degrees },
    transition: { duration: 0.5, ease: 'easeInOut' },
  };
}

/**
 * Get flip animation
 */
export function getFlipAnimation() {
  return {
    initial: { rotateY: 0 },
    animate: { rotateY: 180 },
    transition: { duration: 0.4 },
  };
}

/**
 * Tab switch animation
 */
export function getTabSwitchAnimation() {
  return {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
    transition: { duration: 0.2 },
  };
}

/**
 * Color picker grid animation
 */
export function getColorGridAnimation(index: number) {
  return {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    transition: {
      delay: index * 0.02,
      type: 'spring',
      damping: 15,
      stiffness: 300,
    },
  };
}

/**
 * Success checkmark animation
 */
export function getSuccessAnimation() {
  return {
    initial: { scale: 0, rotate: -180 },
    animate: { scale: 1, rotate: 0 },
    transition: {
      type: 'spring',
      damping: 10,
      stiffness: 200,
    },
  };
}