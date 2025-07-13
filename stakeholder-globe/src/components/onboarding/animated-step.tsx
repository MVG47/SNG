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
    scale: 1
  },
  exit: { 
    opacity: 0, 
    x: -50,
    scale: 0.95
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