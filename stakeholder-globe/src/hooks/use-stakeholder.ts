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