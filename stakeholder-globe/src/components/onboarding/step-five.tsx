'use client';

import { useState } from 'react';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const commonInterests = [
  'AI/Machine Learning',
  'Sustainability',
  'FinTech',
  'HealthTech',
  'EdTech',
  'Climate Change',
  'Social Impact',
  'Blockchain',
  'IoT',
  'Renewable Energy'
];

export default function StepFive() {
  const { formData, updateFormData } = useOnboardingStore();
  const [customInterest, setCustomInterest] = useState('');
  
  const selectedInterests = formData.interests || [];
  
  const toggleInterest = (interest: string) => {
    const updated = selectedInterests.includes(interest)
      ? selectedInterests.filter(i => i !== interest)
      : [...selectedInterests, interest];
    
    updateFormData({ interests: updated });
  };
  
  const addCustomInterest = () => {
    if (customInterest.trim() && !selectedInterests.includes(customInterest.trim())) {
      updateFormData({ 
        interests: [...selectedInterests, customInterest.trim()] 
      });
      setCustomInterest('');
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addCustomInterest();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">What are your interests?</h2>
        <p className="text-gray-600">Select areas you&apos;re passionate about</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label>Common interests</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {commonInterests.map((interest) => (
              <Badge
                key={interest}
                variant={selectedInterests.includes(interest) ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => toggleInterest(interest)}
              >
                {interest}
              </Badge>
            ))}
          </div>
        </div>
        
        <div>
          <Label>Add custom interest</Label>
          <div className="flex gap-2 mt-2">
            <Input
              value={customInterest}
              onChange={(e) => setCustomInterest(e.target.value)}
              placeholder="Enter custom interest"
              onKeyPress={handleKeyPress}
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="initiatives">Current Initiatives</Label>
          <Textarea
            id="initiatives"
            placeholder="Describe your current projects or initiatives"
            value={formData.currentInitiatives?.join('\n') || ''}
            onChange={(e) => updateFormData({ 
              currentInitiatives: e.target.value.split('\n').filter(Boolean) 
            })}
            rows={4}
          />
        </div>
      </div>
    </div>
  );
} 