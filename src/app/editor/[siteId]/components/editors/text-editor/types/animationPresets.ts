// Animation Presets for Text Editor

export const ENTRANCE_ANIMATIONS = {
  none: {
    initial: {},
    animate: {},
  },
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  'slide-up': {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
  },
  'slide-down': {
    initial: { opacity: 0, y: -30 },
    animate: { opacity: 1, y: 0 },
  },
  typewriter: {
    initial: { width: 0, opacity: 0 },
    animate: { width: 'auto', opacity: 1 },
  },
  bounce: {
    initial: { opacity: 0, scale: 0.3, y: -50 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: {
        type: 'spring',
        damping: 10,
        stiffness: 100,
      }
    },
  },
};

export const HOVER_ANIMATIONS = {
  none: {},
  glow: {
    filter: 'brightness(1.2) drop-shadow(0 0 8px currentColor)',
    transition: { duration: 0.3 },
  },
  lift: {
    y: -4,
    scale: 1.02,
    transition: { duration: 0.2 },
  },
  'color-shift': {
    color: '#9333EA',
    transition: { duration: 0.3 },
  },
  scale: {
    scale: 1.05,
    transition: { duration: 0.2 },
  },
};

export const BUTTON_ANIMATIONS = {
  hover: {
    scale: 1.05,
    boxShadow: '0 4px 12px rgba(147, 51, 234, 0.3)',
    transition: { duration: 0.2 },
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 },
  },
  disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};

export const POPUP_ANIMATIONS = {
  backdrop: {
    initial: { opacity: 0, backdropFilter: 'blur(0px)' },
    animate: { opacity: 1, backdropFilter: 'blur(8px)' },
    exit: { opacity: 0, backdropFilter: 'blur(0px)' },
    transition: { duration: 0.3 },
  },
  popup: {
    initial: { opacity: 0, scale: 0.9, y: 50, rotateX: -15 },
    animate: { opacity: 1, scale: 1, y: 0, rotateX: 0 },
    exit: { opacity: 0, scale: 0.9, y: 50 },
    transition: { 
      type: 'spring',
      damping: 25,
      stiffness: 300,
    },
  },
  header: {
    initial: { y: -20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.1, duration: 0.4 },
  },
  toolbar: {
    initial: { y: -10, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.2, duration: 0.3 },
  },
  content: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.3, duration: 0.3 },
  },
  footer: {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { delay: 0.4, duration: 0.3 },
  },
};

export const STAGGER_CHILDREN = {
  animate: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

export const TOOL_BUTTON_STAGGER = {
  hidden: { opacity: 0, scale: 0.8, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      type: 'spring',
      damping: 15,
      stiffness: 200,
    },
  }),
};

export const COLOR_GRID_ANIMATION = {
  hidden: { opacity: 0, scale: 0 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.02,
      type: 'spring',
      damping: 15,
      stiffness: 300,
    },
  }),
};

export const RIPPLE_EFFECT = {
  initial: { scale: 0, opacity: 0.5 },
  animate: { scale: 2, opacity: 0 },
  transition: { duration: 0.6 },
};

export const SUCCESS_ANIMATION = {
  initial: { scale: 0, rotate: -180 },
  animate: { scale: 1, rotate: 0 },
  transition: {
    type: 'spring',
    damping: 10,
    stiffness: 200,
  },
};

export const SHIMMER_GRADIENT = {
  backgroundImage: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 2s infinite',
};

// Easing curves
export const EASING = {
  smooth: [0.25, 0.1, 0.25, 1],
  snappy: [0.4, 0, 0.2, 1],
  elastic: [0.68, -0.55, 0.265, 1.55],
  bounce: [0.68, -0.6, 0.32, 1.6],
};