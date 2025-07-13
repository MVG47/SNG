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
    updateFormData({ type: type as 'entrepreneur' | 'university' | 'investor' | 'government' | 'corporate' });
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