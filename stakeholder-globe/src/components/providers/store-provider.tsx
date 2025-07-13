'use client';

import { useEffect } from 'react';
import { useGlobeStore } from '@/stores/globe-store';
import { generateMockStakeholders } from '@/lib/mock-data';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const setStakeholders = useGlobeStore((state) => state.setStakeholders);
  
  useEffect(() => {
    // Initialize with mock data
    const mockStakeholders = generateMockStakeholders(100);
    setStakeholders(mockStakeholders);
  }, [setStakeholders]);
  
  return <>{children}</>;
} 