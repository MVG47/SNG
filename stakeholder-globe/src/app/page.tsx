'use client';

import { useEffect } from 'react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { useGlobeStore } from '@/stores/globe-store';
import { generateMockStakeholders } from '@/lib/mock-data';
import OnboardingWizard from '@/components/onboarding/onboarding-wizard';
import GlobeContainer from '@/components/globe/globe-container';

export default function HomePage() {
  const { isCompleted } = useOnboardingStore();
  const { stakeholders, setStakeholders } = useGlobeStore();
  
  useEffect(() => {
    // Initialize with mock data when component mounts
    if (stakeholders.length === 0) {
      const mockStakeholders = generateMockStakeholders(50);
      setStakeholders(mockStakeholders);
    }
  }, [stakeholders.length, setStakeholders]);
  
  // Show onboarding wizard if not completed
  if (!isCompleted) {
    return <OnboardingWizard />;
  }
  
  // Main application interface - Globe-centered layout per PRD
  return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden">
      {/* Main Globe Interface */}
      <GlobeContainer />
      
      {/* Optional: Subtle branding header */}
      <div className="absolute top-4 left-4 z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2">
          <h1 className="text-white font-semibold text-lg">
            Stakeholder Network Globe
          </h1>
          <p className="text-white/70 text-sm">
            {stakeholders.length} stakeholders connected
          </p>
        </div>
      </div>
    </div>
  );
}
