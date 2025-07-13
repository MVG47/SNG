'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const regions = [
  'North America',
  'South America', 
  'Europe',
  'Africa',
  'Asia',
  'Australia/Oceania'
];

const coordinates = {
  'North America': [-100, 45],
  'South America': [-60, -15],
  'Europe': [10, 50],
  'Africa': [20, 0],
  'Asia': [100, 30],
  'Australia/Oceania': [140, -25]
};

export default function StepThree() {
  const { formData, updateFormData } = useOnboardingStore();
  const [selectedRegion, setSelectedRegion] = useState(formData.region || '');
  
  const handleRegionSelect = (region: string) => {
    setSelectedRegion(region);
    updateFormData({
      region,
      coordinates: coordinates[region as keyof typeof coordinates] as [number, number]
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Where are you located?</h2>
        <p className="text-gray-600">This helps us show regional connections</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label>Select your region</Label>
          <Select value={selectedRegion} onValueChange={handleRegionSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your region" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region} value={region}>
                  {region}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
} 