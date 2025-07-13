# 06 - Framer Motion Animations

## 🎯 Goal
Implement smooth, performant animations throughout the application using Framer Motion.

## 📋 Steps

### 1. Configure Framer Motion Provider
```typescript
// src/components/providers/motion-provider.tsx
'use client';

import { MotionConfig } from 'framer-motion';

export function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 30
      }}
    >
      {children}
    </MotionConfig>
  );
}
```

### 2. Create Animation Variants Library
```typescript
// src/lib/animations.ts
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
```

### 3. Create Page Transition Component
```typescript
// src/components/layout/page-transition.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';

const pageVariants = {
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

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### 4. Animated Globe Controls
```typescript
// src/components/globe/animated-controls.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const controlVariants = {
  initial: { opacity: 0, scale: 0.8, y: -10 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  hover: { 
    scale: 1.05,
    transition: { duration: 0.2 }
  },
  tap: { 
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

const containerVariants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export function AnimatedGlobeControls({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="space-y-2"
    >
      {children}
    </motion.div>
  );
}

export function AnimatedControlButton({ 
  children, 
  onClick,
  ...props 
}: React.ComponentProps<typeof Button>) {
  return (
    <motion.div
      variants={controlVariants}
      whileHover="hover"
      whileTap="tap"
    >
      <Button onClick={onClick} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
```

### 5. Stakeholder Marker Animations
```typescript
// src/components/globe/animated-marker.tsx
'use client';

import { motion } from 'framer-motion';
import { Stakeholder } from '@/types';
import { stakeholderColors } from '@/lib/utils';

interface AnimatedMarkerProps {
  stakeholder: Stakeholder;
  isSelected: boolean;
  onHover: () => void;
  onLeave: () => void;
  onClick: () => void;
}

const markerVariants = {
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
      repeatType: "reverse"
    }
  }
};

const glowVariants = {
  initial: { scale: 0, opacity: 0 },
  animate: { 
    scale: 2, 
    opacity: 0.3,
    transition: {
      duration: 0.8,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

export default function AnimatedMarker({
  stakeholder,
  isSelected,
  onHover,
  onLeave,
  onClick
}: AnimatedMarkerProps) {
  const color = stakeholderColors[stakeholder.type];
  
  return (
    <motion.div
      className="relative cursor-pointer"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      onClick={onClick}
    >
      {/* Glow effect */}
      {isSelected && (
        <motion.div
          variants={glowVariants}
          initial="initial"
          animate="animate"
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      
      {/* Main marker */}
      <motion.div
        variants={markerVariants}
        initial="initial"
        animate={isSelected ? "selected" : "animate"}
        whileHover="hover"
        className="w-3 h-3 rounded-full border-2 border-white shadow-lg relative z-10"
        style={{ backgroundColor: color }}
      />
      
      {/* Pulse ring */}
      <motion.div
        variants={markerVariants}
        animate={isSelected ? "pulse" : ""}
        className="absolute inset-0 rounded-full border-2 border-white"
        style={{ borderColor: color }}
      />
    </motion.div>
  );
}
```

### 6. Connection Line Animations
```typescript
// src/components/globe/animated-lines.tsx
'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedConnectionProps {
  startCoord: [number, number];
  endCoord: [number, number];
  delay?: number;
}

const pathVariants = {
  initial: { 
    pathLength: 0, 
    opacity: 0 
  },
  animate: { 
    pathLength: 1, 
    opacity: 0.8,
    transition: {
      pathLength: { duration: 1.5, ease: "easeInOut" },
      opacity: { duration: 0.5 }
    }
  },
  exit: {
    pathLength: 0,
    opacity: 0,
    transition: { duration: 0.5 }
  }
};

function createCurvedPath(start: [number, number], end: [number, number]) {
  const [startX, startY] = start;
  const [endX, endY] = end;
  
  // Create a curved path for great circle effect
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2 - 20; // Arc upward
  
  return `M ${startX},${startY} Q ${midX},${midY} ${endX},${endY}`;
}

export default function AnimatedConnection({
  startCoord,
  endCoord,
  delay = 0
}: AnimatedConnectionProps) {
  const [path, setPath] = useState('');
  
  useEffect(() => {
    // Convert geographic coordinates to screen coordinates
    // This would need proper projection math in real implementation
    const screenStart: [number, number] = [startCoord[0] * 5 + 400, startCoord[1] * 3 + 300];
    const screenEnd: [number, number] = [endCoord[0] * 5 + 400, endCoord[1] * 3 + 300];
    
    setPath(createCurvedPath(screenStart, screenEnd));
  }, [startCoord, endCoord]);
  
  return (
    <motion.path
      d={path}
      stroke="#3B82F6"
      strokeWidth="2"
      fill="none"
      strokeDasharray="5,5"
      variants={pathVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ delay }}
    />
  );
}
```

### 7. Onboarding Step Transitions
```typescript
// src/components/onboarding/animated-step.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';

const stepVariants = {
  initial: { 
    opacity: 0, 
    x: 50,
    scale: 0.95 
  },
  animate: { 
    opacity: 1, 
    x: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  },
  exit: { 
    opacity: 0, 
    x: -50,
    scale: 0.95,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

interface AnimatedStepProps {
  children: React.ReactNode;
  stepKey: string | number;
}

export default function AnimatedStep({ children, stepKey }: AnimatedStepProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={stepKey}
        variants={stepVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### 8. Feed Post Animations
```typescript
// src/components/feed/animated-post.tsx
'use client';

import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';

const postVariants = {
  initial: { 
    opacity: 0, 
    y: 30,
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  hover: {
    scale: 1.02,
    y: -2,
    transition: { duration: 0.2 }
  }
};

const likeButtonVariants = {
  tap: {
    scale: 0.8,
    transition: { duration: 0.1 }
  },
  liked: {
    scale: [1, 1.3, 1],
    transition: { duration: 0.3 }
  }
};

interface AnimatedPostProps {
  children: React.ReactNode;
  delay?: number;
}

export default function AnimatedPost({ children, delay = 0 }: AnimatedPostProps) {
  return (
    <motion.div
      variants={postVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
      transition={{ delay }}
    >
      <Card className="overflow-hidden">
        {children}
      </Card>
    </motion.div>
  );
}

export function AnimatedLikeButton({ 
  isLiked, 
  onClick 
}: { 
  isLiked: boolean; 
  onClick: () => void; 
}) {
  return (
    <motion.button
      variants={likeButtonVariants}
      whileTap="tap" 
      animate={isLiked ? "liked" : ""}
      onClick={onClick}
      className="p-2 rounded-full hover:bg-gray-100"
    >
      <motion.div
        animate={{ 
          color: isLiked ? "#EF4444" : "#6B7280",
          scale: isLiked ? 1.1 : 1
        }}
      >
        ❤️
      </motion.div>
    </motion.button>
  );
}
```

## ✅ Verification
- [ ] Page transitions are smooth and consistent
- [ ] Globe markers animate in with spring physics
- [ ] Connection lines draw smoothly
- [ ] Onboarding steps transition properly
- [ ] Hover effects are responsive
- [ ] No animation performance issues
- [ ] Mobile animations work well 