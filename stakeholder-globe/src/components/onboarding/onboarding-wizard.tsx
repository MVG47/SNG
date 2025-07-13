'use client';

import { useOnboardingStore } from '@/stores/onboarding-store';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import AnimatedStep from './animated-step';
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
  const { 
    currentStep, 
    nextStep, 
    prevStep, 
    completeOnboarding,
    formData 
  } = useOnboardingStore();
  
  const currentStepData = steps[currentStep - 1];
  const StepComponent = currentStepData.component;
  const progress = (currentStep / steps.length) * 100;
  
  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!formData.type;
      case 2: return !!(formData.name && formData.organization);
      case 3: return !!formData.region;
      case 4: return true; // Impact metrics are optional
      case 5: return true; // Interests are optional
      default: return false;
    }
  };
  
  const handleNext = () => {
    if (currentStep === steps.length) {
      completeOnboarding();
    } else {
      nextStep();
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-4">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <CardTitle className="text-3xl font-bold text-gray-900 mb-2">
                Welcome to Stakeholder Network Globe
              </CardTitle>
            </motion.div>
            <motion.p 
              className="text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Let's set up your profile to connect with the right stakeholders
            </motion.p>
            
            {/* Progress indicator */}
            <motion.div 
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Step {currentStep} of {steps.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </motion.div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step indicator */}
            <motion.div 
              className="flex justify-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <div className="flex space-x-2">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.id}
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                      index + 1 <= currentStep
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                    whileHover={{ scale: 1.1 }}
                    animate={index + 1 === currentStep ? { 
                      scale: [1, 1.1, 1],
                      transition: { duration: 0.5 }
                    } : {}}
                  >
                    {index + 1}
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Current step title */}
            <motion.div 
              key={currentStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-6">
                {currentStepData.title}
              </h3>
            </motion.div>
            
            {/* Step content with animation */}
            <AnimatedStep stepKey={currentStep}>
              <StepComponent />
            </AnimatedStep>
            
            {/* Navigation buttons */}
            <motion.div 
              className="flex justify-between pt-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="min-w-[100px]"
              >
                Previous
              </Button>
              
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="min-w-[100px] bg-blue-500 hover:bg-blue-600"
                >
                  {currentStep === steps.length ? (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center gap-2"
                    >
                      Complete Setup ✨
                    </motion.span>
                  ) : (
                    'Next'
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 