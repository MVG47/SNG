'use client';

import { useStakeholder } from '@/hooks/use-stakeholder';
import { useGlobe } from '@/hooks/use-globe';
import { Suspense, useState } from 'react';
import dynamic from 'next/dynamic';
import GlobeControls from './globe-controls';
import ProfilePanel from '@/components/profile/profile-panel';
import GlobeLoading from './globe-loading';
import StakeholderNavigator from '@/components/navigation/stakeholder-navigator';

// Dynamically import the Canvas-based globe to avoid SSR issues
const DynamicCanvasGlobe = dynamic(() => import('./canvas-globe'), {
  ssr: false,
  loading: () => <GlobeLoading />,
});

export default function GlobeContainer() {
  const { stakeholders } = useStakeholder();
  const { globeSettings } = useGlobe();
  const [isNavigatorOpen, setIsNavigatorOpen] = useState(false);
  
  const toggleNavigator = () => {
    setIsNavigatorOpen(!isNavigatorOpen);
  };
  
  return (
    <div className="relative w-full h-full bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Dynamic Canvas Globe */}
      <DynamicCanvasGlobe />
      
      {/* Stakeholder Navigator */}
      <StakeholderNavigator 
        isOpen={isNavigatorOpen}
        onToggle={toggleNavigator}
      />
      
      {/* Globe Controls */}
      <GlobeControls onToggleNavigator={toggleNavigator} />
      
      {/* Profile Panel */}
      <ProfilePanel />
      
      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 text-white text-xs opacity-70 z-20 bg-black/30 rounded px-2 py-1">
        <p>🌍 {stakeholders.length} Stakeholders</p>
        <p>✨ Mode: {globeSettings.visualizationMode}</p>
        <p>🚀 Powered by three-globe</p>
      </div>

      {/* Instructions overlay */}
      <div className="absolute bottom-4 right-4 text-white text-xs opacity-60 z-20 bg-black/30 rounded px-2 py-1">
        <p>Click points to select • Use navigator to browse • Drag to rotate • Scroll to zoom</p>
      </div>
    </div>
  );
} 