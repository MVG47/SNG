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
  
  const getMetricValue = (key: string): string => {
    const metrics = formData.impactMetrics;
    if (!metrics) return '';
    
    switch (key) {
      case 'funding':
        return metrics.funding?.toString() || '';
      case 'employees':
        return metrics.employees?.toString() || '';
      case 'studentsReached':
        return metrics.studentsReached?.toString() || '';
      case 'projectsCompleted':
        return metrics.projectsCompleted?.toString() || '';
      default:
        return '';
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
              value={getMetricValue(metric.key)}
              onChange={(e) => handleMetricChange(metric.key, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
} 