import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Stakeholder } from '@/types';

interface OnboardingState {
  currentStep: number;
  formData: Partial<Stakeholder>;
  isCompleted: boolean;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<Stakeholder>) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
}

export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set, get) => ({
      currentStep: 1,
      formData: {},
      isCompleted: false,
      
      nextStep: () => {
        const { currentStep } = get();
        if (currentStep < 5) {
          set({ currentStep: currentStep + 1 });
        }
      },
      
      prevStep: () => {
        const { currentStep } = get();
        if (currentStep > 1) {
          set({ currentStep: currentStep - 1 });
        }
      },
      
      updateFormData: (data) => {
        set((state) => ({
          formData: { ...state.formData, ...data }
        }));
      },
      
      completeOnboarding: () => {
        set({ isCompleted: true });
      },
      
      resetOnboarding: () => {
        set({
          currentStep: 1,
          formData: {},
          isCompleted: false
        });
      }
    }),
    {
      name: 'onboarding-storage',
      partialize: (state) => ({
        formData: state.formData,
        isCompleted: state.isCompleted
      })
    }
  )
); 