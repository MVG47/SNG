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
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: formData.name || '',
      organization: formData.organization || '',
      description: formData.description || '',
    }
  });
  
  const handleFieldChange = (field: string, value: string) => {
    updateFormData({ [field]: value });
  };
  
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
            onChange={(e) => handleFieldChange('name', e.target.value)}
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
            onChange={(e) => handleFieldChange('organization', e.target.value)}
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
            onChange={(e) => handleFieldChange('description', e.target.value)}
          />
          {errors.description && (
            <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
          )}
        </div>
      </div>
    </div>
  );
} 