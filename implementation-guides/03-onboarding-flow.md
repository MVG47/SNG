# 03 - Onboarding Flow Implementation

## 🎯 Goal
Create a multi-step onboarding wizard with smooth animations and form validation.

## 📋 Steps

### 1. Create Onboarding Wizard Container
```typescript
// src/components/onboarding/onboarding-wizard.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';

import StepOne from './step-one';
import StepTwo from './step-two';
import StepThree from './step-three';
import StepFour from './step-four';
import StepFive from './step-five';

const steps = [
  { id: 1, title: 'Stakeholder Type', component: StepOne },
  { id: 2, title: 'Organization', component: StepTwo },
  { id: 3, title: 'Location', component: StepThree },
  { id: 4, title: 'Impact Metrics', component: StepFour },
  { id: 5, title: 'Interests', component: StepFive },
];

export default function OnboardingWizard() {
  const { currentStep, nextStep, prevStep, completeOnboarding } = useOnboardingStore();
  
  const progress = (currentStep / steps.length) * 100;
  const CurrentStepComponent = steps[currentStep - 1].component;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-8"
      >
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Join the Network
            </h1>
            <span className="text-sm text-gray-500">
              Step {currentStep} of {steps.length}
            </span>
          </div>
          
          <Progress value={progress} className="h-2" />
          
          <p className="text-gray-600 mt-2">
            {steps[currentStep - 1].title}
          </p>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-8"
          >
            <CurrentStepComponent />
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            Previous
          </Button>
          
          {currentStep === steps.length ? (
            <Button onClick={completeOnboarding}>
              Complete Setup
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
```

### 2. Create Step Components

#### Step 1: Stakeholder Type Selection
```typescript
// src/components/onboarding/step-one.tsx
'use client';

import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { Card } from '@/components/ui/card';
import { Building, GraduationCap, DollarSign, Landmark, Users } from 'lucide-react';

const stakeholderTypes = [
  {
    type: 'entrepreneur' as const,
    label: 'Entrepreneur',
    description: 'Startup founder or business owner',
    icon: Users,
    color: 'bg-green-100 text-green-700'
  },
  {
    type: 'university' as const,
    label: 'University',
    description: 'Academic institution or researcher',
    icon: GraduationCap,
    color: 'bg-blue-100 text-blue-700'
  },
  {
    type: 'investor' as const,
    label: 'Investor',
    description: 'Angel investor or VC fund',
    icon: DollarSign,
    color: 'bg-yellow-100 text-yellow-700'
  },
  {
    type: 'government' as const,
    label: 'Government',
    description: 'Government agency or official',
    icon: Landmark,
    color: 'bg-red-100 text-red-700'
  },
  {
    type: 'corporate' as const,
    label: 'Corporate',
    description: 'Large enterprise or corporation',
    icon: Building,
    color: 'bg-purple-100 text-purple-700'
  }
];

export default function StepOne() {
  const { formData, updateFormData } = useOnboardingStore();
  
  const handleSelect = (type: string) => {
    updateFormData({ type: type as any });
  };
  
  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">What type of stakeholder are you?</h2>
        <p className="text-gray-600">This helps us connect you with the right people</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stakeholderTypes.map((item, index) => {
          const Icon = item.icon;
          const isSelected = formData.type === item.type;
          
          return (
            <motion.div
              key={item.type}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
                onClick={() => handleSelect(item.type)}
              >
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.label}</h3>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
```

#### Step 2: Organization Details
```typescript
// src/components/onboarding/step-two.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboardingStore } from '@/stores/onboarding-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  organization: z.string().min(2, 'Organization name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
});

type FormData = z.infer<typeof schema>;

export default function StepTwo() {
  const { formData, updateFormData } = useOnboardingStore();
  
  const {
    register,
    formState: { errors },
    watch
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: formData.name || '',
      organization: formData.organization || '',
      description: formData.description || '',
    }
  });
  
  const watchedValues = watch();
  
  // Update store on form changes
  React.useEffect(() => {
    updateFormData(watchedValues);
  }, [watchedValues, updateFormData]);
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Tell us about yourself</h2>
        <p className="text-gray-600">Help others understand who you are</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Your Name</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="organization">Organization</Label>
          <Input
            id="organization"  
            {...register('organization')}
            placeholder="Company, university, or institution name"
          />
          {errors.organization && (
            <p className="text-sm text-red-600 mt-1">{errors.organization.message}</p>
          )}
        </div>
        
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Brief description of your work and goals"
            rows={4}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>
    </div>
  );
}
```

### 3. Create Location Step (Step Three)
```typescript
// src/components/onboarding/step-three.tsx
'use client';

import { useState, useEffect } from 'react';
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
```

### 4. Create Impact Metrics Step (Step Four)
```typescript
// src/components/onboarding/step-four.tsx
'use client';

import { useOnboardingStore } from '@/stores/onboarding-store';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function StepFour() {
  const { formData, updateFormData } = useOnboardingStore();
  
  const handleMetricChange = (key: string, value: string) => {
    const numValue = parseInt(value) || 0;
    updateFormData({
      impactMetrics: {
        ...formData.impactMetrics,
        [key]: numValue
      }
    });
  };
  
  const getMetricsForType = () => {
    switch (formData.type) {
      case 'entrepreneur':
        return [
          { key: 'funding', label: 'Funding Raised ($)', placeholder: '100000' },
          { key: 'employees', label: 'Team Size', placeholder: '10' }
        ];
      case 'university':
        return [
          { key: 'studentsReached', label: 'Students Reached', placeholder: '1000' },
          { key: 'projectsCompleted', label: 'Research Projects', placeholder: '5' }
        ];
      case 'investor':
        return [
          { key: 'funding', label: 'Portfolio Value ($)', placeholder: '1000000' },
          { key: 'projectsCompleted', label: 'Investments Made', placeholder: '20' }
        ];
      default:
        return [
          { key: 'projectsCompleted', label: 'Projects Completed', placeholder: '10' },
          { key: 'employees', label: 'Team Size', placeholder: '50' }
        ];
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">Share your impact</h2>
        <p className="text-gray-600">Help others understand your scale and experience</p>
      </div>
      
      <div className="space-y-4">
        {getMetricsForType().map((metric) => (
          <div key={metric.key}>
            <Label htmlFor={metric.key}>{metric.label}</Label>
            <Input
              id={metric.key}
              type="number"
              placeholder={metric.placeholder}
              value={formData.impactMetrics?.[metric.key] || ''}
              onChange={(e) => handleMetricChange(metric.key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
```

### 5. Create Interests Step (Step Five)
```typescript
// src/components/onboarding/step-five.tsx
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
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold mb-2">What are your interests?</h2>
        <p className="text-gray-600">Select areas you're passionate about</p>
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
              onKeyPress={(e) => e.key === 'Enter' && addCustomInterest()}
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
```

## ✅ Verification
- [ ] Onboarding wizard displays correctly
- [ ] Step navigation works smoothly  
- [ ] Form validation prevents invalid submissions
- [ ] Data persists between steps
- [ ] Animations are smooth and performant
- [ ] Responsive design works on mobile 