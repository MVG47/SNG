import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Stakeholder } from '@/types';

interface GlobeState {
  stakeholders: Stakeholder[];
  selectedStakeholder: Stakeholder | null;
  isPanelOpen: boolean;
  activeTab: 'profile' | 'feed' | 'ai';
  isLoading: boolean;
  globeSettings: {
    autoRotate: boolean;
    showConnections: boolean;
    filterType: string | null;
    visualizationMode: 'points' | 'heatmap' | 'enhanced' | 'satellite';
    showCountries: boolean;
    show3DBars: boolean;
    showDayNightCycle: boolean;
    useCustomMarkers: boolean;
    showParticleEffects: boolean;
  };
  
  // Actions
  setStakeholders: (stakeholders: Stakeholder[]) => void;
  selectStakeholder: (stakeholder: Stakeholder | null) => void;
  closePanel: () => void;
  setActiveTab: (tab: 'profile' | 'feed' | 'ai') => void;
  setLoading: (loading: boolean) => void;
  toggleAutoRotate: () => void;
  toggleConnections: () => void;
  setFilter: (type: string | null) => void;
  setVisualizationMode: (mode: 'points' | 'heatmap' | 'enhanced' | 'satellite') => void;
  toggleCountries: () => void;
  toggle3DBars: () => void;
  toggleDayNightCycle: () => void;
  toggleCustomMarkers: () => void;
  toggleParticleEffects: () => void;
}

export const useGlobeStore = create<GlobeState>()(
  subscribeWithSelector((set) => ({
    stakeholders: [],
    selectedStakeholder: null,
    isPanelOpen: false,
    activeTab: 'profile',
    isLoading: false,
    globeSettings: {
      autoRotate: true,
      showConnections: true,
      filterType: null,
      visualizationMode: 'enhanced',
      showCountries: true,
      show3DBars: false,
      showDayNightCycle: false,
      useCustomMarkers: false,
      showParticleEffects: true,
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
    
    setLoading: (loading) => {
      set({ isLoading: loading });
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
    },
    
    setVisualizationMode: (mode) => {
      set((state) => ({
        globeSettings: {
          ...state.globeSettings,
          visualizationMode: mode
        }
      }));
    },
    
    toggleCountries: () => {
      set((state) => ({
        globeSettings: {
          ...state.globeSettings,
          showCountries: !state.globeSettings.showCountries
        }
      }));
    },
    
    toggle3DBars: () => {
      set((state) => ({
        globeSettings: {
          ...state.globeSettings,
          show3DBars: !state.globeSettings.show3DBars
        }
      }));
    },
    
    toggleDayNightCycle: () => {
      set((state) => ({
        globeSettings: {
          ...state.globeSettings,
          showDayNightCycle: !state.globeSettings.showDayNightCycle
        }
      }));
    },
    
    toggleCustomMarkers: () => {
      set((state) => ({
        globeSettings: {
          ...state.globeSettings,
          useCustomMarkers: !state.globeSettings.useCustomMarkers
        }
      }));
    },
    
    toggleParticleEffects: () => {
      set((state) => ({
        globeSettings: {
          ...state.globeSettings,
          showParticleEffects: !state.globeSettings.showParticleEffects
        }
      }));
    }
  }))
); 