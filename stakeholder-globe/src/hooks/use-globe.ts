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
    setFilter,
    setVisualizationMode,
    toggleCountries,
    toggle3DBars,
    toggleDayNightCycle,
    toggleCustomMarkers,
    toggleParticleEffects
  } = useGlobeStore();
  
  return {
    isPanelOpen,
    activeTab,
    globeSettings,
    closePanel,
    setActiveTab,
    toggleAutoRotate,
    toggleConnections,
    setFilter,
    setVisualizationMode,
    toggleCountries,
    toggle3DBars,
    toggleDayNightCycle,
    toggleCustomMarkers,
    toggleParticleEffects
  };
} 