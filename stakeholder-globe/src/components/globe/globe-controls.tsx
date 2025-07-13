'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGlobe } from '@/hooks/use-globe';
import { 
  Eye, 
  EyeOff, 
  Filter,
  Play,
  Pause,
  Layers,
  Menu,
  Globe,
  Sun
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { controlVariants, staggerContainer } from '@/lib/animations';

const stakeholderTypes = [
  { value: null, label: 'All Types' },
  { value: 'entrepreneur', label: 'Entrepreneurs' },
  { value: 'university', label: 'Universities' },
  { value: 'investor', label: 'Investors' },
  { value: 'government', label: 'Government' },
  { value: 'corporate', label: 'Corporate' }
];

const visualizationModes = [
  { value: 'enhanced', label: 'Enhanced Globe' },
  { value: 'satellite', label: 'Satellite View' },
  { value: 'heatmap', label: 'Heat Map' },
  { value: 'points', label: 'Simple Points' }
];

function AnimatedControlButton({ 
  children, 
  onClick,
  title,
  ...props 
}: React.ComponentProps<typeof Button> & { title?: string }) {
  return (
    <motion.div
      variants={controlVariants}
      whileHover="hover"
      whileTap="tap"
    >
      <Button 
        onClick={onClick} 
        title={title}
        className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
        {...props}
      >
        {children}
      </Button>
    </motion.div>
  );
}

interface GlobeControlsProps {
  onToggleNavigator?: () => void;
}

export default function GlobeControls({ onToggleNavigator }: GlobeControlsProps) {
  const {
    globeSettings,
    toggleAutoRotate,
    toggleConnections,
    setFilter,
    setVisualizationMode,
    toggleCountries,
    toggleDayNightCycle
  } = useGlobe();
  
  return (
    <motion.div
      variants={staggerContainer}
      initial="initial"
      animate="animate"
      className="absolute top-4 right-4 flex flex-col gap-2 z-20"
    >
      {/* Navigator toggle */}
      {onToggleNavigator && (
        <AnimatedControlButton
          variant="secondary"
          size="icon"
          onClick={onToggleNavigator}
          title="Toggle Stakeholder Navigator"
        >
          <Menu className="w-4 h-4" />
        </AnimatedControlButton>
      )}
      
      {/* Auto-rotate toggle */}
      <AnimatedControlButton
        variant="secondary"
        size="icon"
        onClick={toggleAutoRotate}
        title={globeSettings.autoRotate ? 'Pause Rotation' : 'Start Rotation'}
      >
        {globeSettings.autoRotate ? (
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <Pause className="w-4 h-4" />
          </motion.div>
        ) : (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <Play className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatedControlButton>
      
      {/* Connection lines toggle */}
      <AnimatedControlButton
        variant="secondary"
        size="icon"
        onClick={toggleConnections}
        title={globeSettings.showConnections ? 'Hide Connections' : 'Show Connections'}
      >
        <motion.div
          animate={{ 
            scale: globeSettings.showConnections ? 1.1 : 1,
            color: globeSettings.showConnections ? '#3B82F6' : '#6B7280'
          }}
          transition={{ duration: 0.2 }}
        >
          {globeSettings.showConnections ? (
            <Eye className="w-4 h-4" />
          ) : (
            <EyeOff className="w-4 h-4" />
          )}
        </motion.div>
      </AnimatedControlButton>
      
      {/* Countries toggle */}
      <AnimatedControlButton
        variant="secondary"
        size="icon"
        onClick={toggleCountries}
        title={globeSettings.showCountries ? 'Hide Countries' : 'Show Countries'}
      >
        <motion.div
          animate={{ 
            scale: globeSettings.showCountries ? 1.1 : 1,
            color: globeSettings.showCountries ? '#3B82F6' : '#6B7280'
          }}
          transition={{ duration: 0.2 }}
        >
          <Globe className="w-4 h-4" />
        </motion.div>
      </AnimatedControlButton>
      
      {/* Day/Night Cycle toggle */}
      <AnimatedControlButton
        variant="secondary"
        size="icon"
        onClick={toggleDayNightCycle}
        title={globeSettings.showDayNightCycle ? 'Disable Day/Night Cycle' : 'Enable Day/Night Cycle'}
      >
        <motion.div
          animate={{ 
            scale: globeSettings.showDayNightCycle ? 1.1 : 1,
            color: globeSettings.showDayNightCycle ? '#3B82F6' : '#6B7280',
            rotate: globeSettings.showDayNightCycle ? 360 : 0
          }}
          transition={{ duration: 0.5 }}
        >
          <Sun className="w-4 h-4" />
        </motion.div>
      </AnimatedControlButton>
      
      {/* Filter dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            variants={controlVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
              title="Filter Stakeholders"
            >
              <motion.div
                animate={{ 
                  rotate: globeSettings.filterType ? 180 : 0,
                  color: globeSettings.filterType ? '#3B82F6' : '#6B7280'
                }}
                transition={{ duration: 0.3 }}
              >
                <Filter className="w-4 h-4" />
              </motion.div>
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="backdrop-blur-sm bg-white/95">
          {stakeholderTypes.map((type, index) => (
            <motion.div
              key={type.value || 'all'}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DropdownMenuItem
                onClick={() => setFilter(type.value)}
                className={
                  globeSettings.filterType === type.value
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }
              >
                <motion.span
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.1 }}
                >
                  {type.label}
                </motion.span>
              </DropdownMenuItem>
            </motion.div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Visualization mode dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <motion.div
            variants={controlVariants}
            whileHover="hover"
            whileTap="tap"
          >
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/90 hover:bg-white shadow-lg backdrop-blur-sm"
              title="Visualization Mode"
            >
              <motion.div
                animate={{ 
                  rotate: globeSettings.visualizationMode === 'enhanced' ? 0 : 180,
                  color: globeSettings.visualizationMode === 'enhanced' ? '#6B7280' : '#3B82F6'
                }}
                transition={{ duration: 0.3 }}
              >
                <Layers className="w-4 h-4" />
              </motion.div>
            </Button>
          </motion.div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="backdrop-blur-sm bg-white/95">
          {visualizationModes.map((mode, index) => (
            <motion.div
              key={mode.value}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <DropdownMenuItem
                onClick={() => setVisualizationMode(mode.value as 'enhanced' | 'heatmap' | 'points' | 'satellite')}
                className={
                  globeSettings.visualizationMode === mode.value
                    ? 'bg-blue-50 text-blue-700'
                    : 'hover:bg-gray-50'
                }
              >
                <motion.span
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.1 }}
                >
                  {mode.label}
                </motion.span>
              </DropdownMenuItem>
            </motion.div>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
      
      {/* Filter indicator */}
      {globeSettings.filterType && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: -10 }}
          className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-xs font-medium shadow-sm"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {stakeholderTypes.find(t => t.value === globeSettings.filterType)?.label}
          </motion.span>
        </motion.div>
      )}
      
      {/* Visualization mode indicator */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-green-100 text-green-800 px-2 py-1 rounded-md text-xs font-medium shadow-sm"
      >
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {visualizationModes.find(m => m.value === globeSettings.visualizationMode)?.label}
        </motion.span>
      </motion.div>
    </motion.div>
  );
} 