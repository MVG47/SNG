# 02 - State Management with Zustand

## 🎯 Goal
Set up Zustand stores for onboarding, globe interactions, and UI state management.

## 📋 Steps

### 1. Create Onboarding Store
```typescript
// src/stores/onboarding-store.ts
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
```

### 2. Create Globe Store
```typescript
// src/stores/globe-store.ts
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Stakeholder } from '@/types';

interface GlobeState {
  stakeholders: Stakeholder[];
  selectedStakeholder: Stakeholder | null;
  isPanelOpen: boolean;
  activeTab: 'profile' | 'feed' | 'ai';
  globeSettings: {
    autoRotate: boolean;
    showConnections: boolean;
    filterType: string | null;
  };
  
  // Actions
  setStakeholders: (stakeholders: Stakeholder[]) => void;
  selectStakeholder: (stakeholder: Stakeholder | null) => void;
  closePanel: () => void;
  setActiveTab: (tab: 'profile' | 'feed' | 'ai') => void;
  toggleAutoRotate: () => void;
  toggleConnections: () => void;
  setFilter: (type: string | null) => void;
}

export const useGlobeStore = create<GlobeState>()(
  subscribeWithSelector((set, get) => ({
    stakeholders: [],
    selectedStakeholder: null,
    isPanelOpen: false,
    activeTab: 'profile',
    globeSettings: {
      autoRotate: true,
      showConnections: true,
      filterType: null,
    },
    
    setStakeholders: (stakeholders) => {
      set({ stakeholders });
    },
    
    selectStakeholder: (stakeholder) => {
      set({
        selectedStakeholder: stakeholder,
        isPanelOpen: !!stakeholder,
        activeTab: 'profile'
      });
    },
    
    closePanel: () => {
      set({
        selectedStakeholder: null,
        isPanelOpen: false
      });
    },
    
    setActiveTab: (tab) => {
      set({ activeTab: tab });
    },
    
    toggleAutoRotate: () => {
      set((state) => ({
        globeSettings: {
          ...state.globeSettings,
          autoRotate: !state.globeSettings.autoRotate
        }
      }));
    },
    
    toggleConnections: () => {
      set((state) => ({
        globeSettings: {
          ...state.globeSettings,
          showConnections: !state.globeSettings.showConnections
        }
      }));
    },
    
    setFilter: (type) => {
      set((state) => ({
        globeSettings: {
          ...state.globeSettings,
          filterType: type
        }
      }));
    }
  }))
);
```

### 3. Create UI Store
```typescript
// src/stores/ui-store.ts
import { create } from 'zustand';

interface UIState {
  isLoading: boolean;
  notifications: Notification[];
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  
  // Actions
  setLoading: (loading: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

interface Notification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message?: string;
  duration?: number;
}

export const useUIStore = create<UIState>((set, get) => ({
  isLoading: false,
  notifications: [],
  sidebarOpen: false,
  theme: 'light',
  
  setLoading: (loading) => {
    set({ isLoading: loading });
  },
  
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(7);
    const newNotification = { ...notification, id };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification]
    }));
    
    // Auto remove after duration
    setTimeout(() => {
      get().removeNotification(id);
    }, notification.duration || 5000);
  },
  
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter(n => n.id !== id)
    }));
  },
  
  toggleSidebar: () => {
    set((state) => ({
      sidebarOpen: !state.sidebarOpen
    }));
  },
  
  setTheme: (theme) => {
    set({ theme });
  }
}));
```

### 4. Create Store Provider
```typescript
// src/components/providers/store-provider.tsx
'use client';

import { useEffect } from 'react';
import { useGlobeStore } from '@/stores/globe-store';
import { generateMockStakeholders } from '@/lib/mock-data';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const setStakeholders = useGlobeStore((state) => state.setStakeholders);
  
  useEffect(() => {
    // Initialize with mock data
    const mockStakeholders = generateMockStakeholders(500);
    setStakeholders(mockStakeholders);
  }, [setStakeholders]);
  
  return <>{children}</>;
}
```

### 5. Create Custom Hooks
```typescript
// src/hooks/use-stakeholder.ts
import { useGlobeStore } from '@/stores/globe-store';
import { Stakeholder } from '@/types';

export function useStakeholder() {
  const {
    stakeholders,
    selectedStakeholder,
    selectStakeholder,
    globeSettings
  } = useGlobeStore();
  
  const getStakeholdersByType = (type: Stakeholder['type']) => {
    return stakeholders.filter(s => s.type === type);
  };
  
  const getConnectedStakeholders = (stakeholder: Stakeholder) => {
    return stakeholders.filter(s => 
      stakeholder.connections.includes(s.id)
    );
  };
  
  const getFilteredStakeholders = () => {
    if (!globeSettings.filterType) return stakeholders;
    return stakeholders.filter(s => s.type === globeSettings.filterType);
  };
  
  return {
    stakeholders,
    selectedStakeholder,
    selectStakeholder,
    getStakeholdersByType,
    getConnectedStakeholders,
    getFilteredStakeholders
  };
}
```

```typescript
// src/hooks/use-globe.ts
import { useGlobeStore } from '@/stores/globe-store';

export function useGlobe() {
  const {
    isPanelOpen,
    activeTab,
    globeSettings,
    closePanel,
    setActiveTab,
    toggleAutoRotate,
    toggleConnections,
    setFilter
  } = useGlobeStore();
  
  return {
    isPanelOpen,
    activeTab,
    globeSettings,
    closePanel,
    setActiveTab,
    toggleAutoRotate,
    toggleConnections,
    setFilter
  };
}
```

### 6. Add Provider to Layout
```typescript
// src/app/layout.tsx
import { StoreProvider } from '@/components/providers/store-provider';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>
          {children}
        </StoreProvider>
      </body>
    </html>
  );
}
```

## ✅ Verification
- [ ] All stores compile without TypeScript errors
- [ ] Onboarding store persists data in localStorage
- [ ] Globe store updates trigger re-renders
- [ ] Custom hooks work with store selectors
- [ ] Provider initializes mock data correctly 