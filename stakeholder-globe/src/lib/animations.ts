export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

export const slideInRight = {
  initial: { x: '100%', opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 }
};

export const scaleIn = {
  initial: { scale: 0, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0, opacity: 0 }
};

export const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

export const staggerItem = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export const globeDotPulse = {
  scale: [1, 1.2, 1],
  transition: {
    duration: 2,
    repeat: Infinity,
    repeatType: "reverse" as const
  }
};

export const connectionLineGrow = {
  pathLength: [0, 1],
  opacity: [0, 1],
  transition: {
    duration: 1.5,
    ease: "easeInOut"
  }
};

export const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
    y: 10
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: {
    opacity: 0,
    scale: 1.02,
    y: -10,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

export const controlVariants = {
  initial: { opacity: 0, scale: 0.8, y: -10 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0
  },
  hover: { 
    scale: 1.05
  },
  tap: { 
    scale: 0.95
  }
};

export const markerVariants = {
  initial: { 
    scale: 0, 
    opacity: 0,
    rotate: -180
  },
  animate: { 
    scale: 1, 
    opacity: 1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
      mass: 0.8
    }
  },
  hover: {
    scale: 1.4,
    transition: { duration: 0.2 }
  },
  selected: {
    scale: 1.6,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 20
    }
  },
  pulse: {
    scale: [1, 1.2, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      repeatType: "reverse" as const
    }
  }
}; 