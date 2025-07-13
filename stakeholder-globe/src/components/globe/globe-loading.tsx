'use client';

import { motion } from 'framer-motion';

export default function GlobeLoading() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Spinning globe placeholder */}
      <motion.div
        className="relative"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-32 h-32 rounded-full border-4 border-blue-300 border-t-blue-600 shadow-lg"></div>
      </motion.div>
      
      {/* Orbiting particles */}
      <motion.div
        className="absolute"
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      >
        <div className="w-48 h-48 relative">
          <div className="absolute top-0 left-1/2 w-2 h-2 bg-white rounded-full shadow-md transform -translate-x-1/2"></div>
          <div className="absolute bottom-0 left-1/2 w-1.5 h-1.5 bg-blue-400 rounded-full shadow-md transform -translate-x-1/2"></div>
          <div className="absolute top-1/2 left-0 w-1 h-1 bg-blue-200 rounded-full shadow-md transform -translate-y-1/2"></div>
          <div className="absolute top-1/2 right-0 w-1 h-1 bg-blue-200 rounded-full shadow-md transform -translate-y-1/2"></div>
        </div>
      </motion.div>
      
      {/* Loading text */}
      <motion.div
        className="absolute top-3/4 text-white text-center"
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
      >
        <p className="text-lg font-medium">Loading Globe</p>
        <p className="text-sm opacity-70">Powered by three-globe</p>
      </motion.div>
      
      {/* Background stars effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-60"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ 
              opacity: [0.3, 1, 0.3],
              scale: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2 + Math.random() * 3, 
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>
    </div>
  );
}