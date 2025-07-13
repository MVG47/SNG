'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useStakeholder } from '@/hooks/use-stakeholder';
import { useGlobe } from '@/hooks/use-globe';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Search, 
  X, 
  MapPin, 
  Building, 
  Users, 
  Filter,
  ChevronRight,
  Menu
} from 'lucide-react';
import { Stakeholder } from '@/types';
import { getStakeholderColor } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface StakeholderNavigatorProps {
  isOpen: boolean;
  onToggle: () => void;
}

const stakeholderTypes = [
  { value: null, label: 'All Types', icon: Users },
  { value: 'entrepreneur', label: 'Entrepreneurs', icon: Users },
  { value: 'university', label: 'Universities', icon: Building },
  { value: 'investor', label: 'Investors', icon: Building },
  { value: 'government', label: 'Government', icon: Building },
  { value: 'corporate', label: 'Corporate', icon: Building }
];

const panelVariants = {
  hidden: { 
    x: '-100%', 
    opacity: 0 
  },
  visible: { 
    x: 0, 
    opacity: 1 
  }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

function StakeholderCard({ 
  stakeholder, 
  isSelected, 
  onClick 
}: { 
  stakeholder: Stakeholder;
  isSelected: boolean;
  onClick: () => void;
}) {
  const stakeholderColor = getStakeholderColor(stakeholder.type);
  
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-blue-500 bg-blue-50' : ''
        }`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ backgroundColor: stakeholderColor }}
              >
                {stakeholder.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {stakeholder.name}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {stakeholder.organization}
                </p>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="secondary" className="text-xs capitalize">
                    {stakeholder.type}
                  </Badge>
                  <div className="flex items-center text-xs text-gray-500">
                    <MapPin className="w-3 h-3 mr-1" />
                    {stakeholder.region}
                  </div>
                </div>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function StakeholderNavigator({ isOpen, onToggle }: StakeholderNavigatorProps) {
  const { stakeholders, selectedStakeholder, selectStakeholder } = useStakeholder();
  const { globeSettings, setFilter } = useGlobe();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);

  // Filter and search stakeholders
  const filteredStakeholders = useMemo(() => {
    let filtered = stakeholders;

    // Apply type filter
    if (filterType) {
      filtered = filtered.filter(s => s.type === filterType);
    }

    // Apply search filter
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(searchLower) ||
        s.organization.toLowerCase().includes(searchLower) ||
        s.region.toLowerCase().includes(searchLower) ||
        s.interests.some(interest => interest.toLowerCase().includes(searchLower))
      );
    }

    return filtered;
  }, [stakeholders, searchTerm, filterType]);

  const handleStakeholderClick = (stakeholder: Stakeholder) => {
    selectStakeholder(stakeholder);
    // Close navigator on mobile after selection
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  const handleFilterChange = (type: string | null) => {
    setFilterType(type);
    setFilter(type);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilterType(null);
    setFilter(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
            onClick={onToggle}
          />
          
          {/* Navigator Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-40 overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <div className="flex items-center space-x-2">
                <Menu className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Stakeholders
                </h2>
                <Badge variant="outline" className="text-xs">
                  {filteredStakeholders.length}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Search and Filter */}
            <div className="p-4 border-b space-y-3">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search stakeholders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}
              </div>

              {/* Filter Dropdown */}
              <div className="flex items-center justify-between">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8">
                      <Filter className="w-3 h-3 mr-2" />
                      {filterType ? stakeholderTypes.find(t => t.value === filterType)?.label : 'All Types'}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-40">
                    {stakeholderTypes.map(type => (
                      <DropdownMenuItem
                        key={type.value || 'all'}
                        onClick={() => handleFilterChange(type.value)}
                        className={filterType === type.value ? 'bg-blue-50 text-blue-700' : ''}
                      >
                        {type.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                
                {(searchTerm || filterType) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="h-8 text-xs"
                  >
                    Clear
                  </Button>
                )}
              </div>
            </div>

            {/* Stakeholder List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {filteredStakeholders.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Search className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-sm">No stakeholders found</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Try adjusting your search or filter
                  </p>
                </div>
              ) : (
                filteredStakeholders.map((stakeholder, index) => (
                  <motion.div
                    key={stakeholder.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <StakeholderCard
                      stakeholder={stakeholder}
                      isSelected={selectedStakeholder?.id === stakeholder.id}
                      onClick={() => handleStakeholderClick(stakeholder)}
                    />
                  </motion.div>
                ))
              )}
            </div>

            {/* Quick Stats */}
            <div className="p-4 border-t bg-gray-50">
              <div className="text-xs text-gray-600 space-y-1">
                <div className="flex justify-between">
                  <span>Total Stakeholders:</span>
                  <span className="font-medium">{stakeholders.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Filtered Results:</span>
                  <span className="font-medium">{filteredStakeholders.length}</span>
                </div>
                {selectedStakeholder && (
                  <div className="flex justify-between">
                    <span>Selected:</span>
                    <span className="font-medium truncate ml-2">
                      {selectedStakeholder.name}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
} 