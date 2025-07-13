'use client';

import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { useGlobeStore } from '@/stores/globe-store';
import dynamic from 'next/dynamic';
import GlobeLoading from './globe-loading';

// Dynamically import the globe wrapper to avoid SSR issues
const DynamicGlobeWrapper = dynamic(() => import('./dynamic-globe-wrapper'), {
  ssr: false,
});

export default function CanvasGlobe() {
  const { isLoading, stakeholders, globeSettings } = useGlobeStore();

  // Show loading outside of Canvas context
  if (isLoading) {
    return <GlobeLoading />;
  }

  return (
    <Canvas
      style={{
        width: '100%',
        height: '100%',
        background: 'transparent',
      }}
      camera={{ 
        position: [0, 0, 150], 
        fov: 60,
        near: 0.1,
        far: 1000 
      }}
      shadows
      dpr={[1, 2]}
      performance={{ min: 0.5 }}
    >
      <color attach="background" args={['#0a0a0a']} />
      <fog attach="fog" args={['#0a0a0a', 100, 500]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight 
        position={[50, 50, 50]} 
        intensity={0.8} 
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <pointLight position={[-50, -50, -50]} intensity={0.5} />
      
      {/* Camera Controls */}
      <PerspectiveCamera makeDefault position={[0, 0, 150]} />
      <OrbitControls 
        enableDamping 
        dampingFactor={0.05}
        minDistance={80}
        maxDistance={300}
        enablePan={false}
      />
      
      {/* Globe Components */}
      <Suspense fallback={null}>
        <DynamicGlobeWrapper 
          stakeholders={stakeholders}
          visualizationMode={globeSettings.visualizationMode}
        />
      </Suspense>
    </Canvas>
  );
} 