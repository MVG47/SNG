'use client';

import dynamic from 'next/dynamic';
import { Stakeholder } from '@/types';
import { useEffect, useState } from 'react';

// Dynamic imports with no SSR to avoid window/browser API issues
// Note: loading components can't be HTML elements inside Canvas
const EnhancedGlobe = dynamic(() => import('./enhanced-globe'), {
  ssr: false,
});

const HeatMapGlobe = dynamic(() => import('./heat-map-globe'), {
  ssr: false,
});

const SimpleGlobe = dynamic(() => import('./simple-globe'), {
  ssr: false,
});

const SatelliteGlobe = dynamic(() => import('./satellite-globe'), {
  ssr: false,
});

interface DynamicGlobeWrapperProps {
  stakeholders: Stakeholder[];
  visualizationMode: 'points' | 'heatmap' | 'enhanced' | 'satellite';
}

export default function DynamicGlobeWrapper({ 
  stakeholders, 
  visualizationMode 
}: DynamicGlobeWrapperProps) {
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side before rendering three-globe components
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Show loading state until client-side rendering is ready
  // Note: return null instead of HTML elements inside Canvas context
  if (!isClient) {
    return null;
  }

  // Render appropriate globe component based on visualization mode
  switch (visualizationMode) {
    case 'enhanced':
      return <EnhancedGlobe stakeholders={stakeholders} />;
    case 'satellite':
      return <SatelliteGlobe stakeholders={stakeholders} />;
    case 'heatmap':
      return <HeatMapGlobe stakeholders={stakeholders} />;
    case 'points':
      return <SimpleGlobe stakeholders={stakeholders} />;
    default:
      return <EnhancedGlobe stakeholders={stakeholders} />;
  }
} 