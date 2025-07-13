# 04 - Globe Implementation with Mapbox & Three.js

## 🎯 Goal
Create an interactive 3D globe using Mapbox GL JS with stakeholder dots, hover effects, and connection lines.

## 📋 Steps

### 1. Create Globe Container Component
```typescript
// src/components/globe/globe-container.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import Map, { Marker, Source, Layer } from 'react-map-gl';
import mapboxgl from 'mapbox-gl';
import { motion } from 'framer-motion';
import { useGlobeStore } from '@/stores/globe-store';
import { useStakeholder } from '@/hooks/use-stakeholder';
import StakeholderMarker from './stakeholder-marker';
import ConnectionLines from './connection-lines';
import GlobeControls from './globe-controls';

// Ensure Mapbox token is available
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN!;

const INITIAL_VIEW_STATE = {
  longitude: 0,
  latitude: 20,
  zoom: 1.5,
  pitch: 0,
  bearing: 0
};

export default function GlobeContainer() {
  const mapRef = useRef<any>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  const { globeSettings } = useGlobeStore();
  const { getFilteredStakeholders } = useStakeholder();
  
  const stakeholders = getFilteredStakeholders();
  
  // Auto-rotation effect
  useEffect(() => {
    if (!globeSettings.autoRotate || !mapRef.current) return;
    
    const interval = setInterval(() => {
      setViewState(prev => ({
        ...prev,
        bearing: (prev.bearing + 0.5) % 360
      }));
    }, 100);
    
    return () => clearInterval(interval);
  }, [globeSettings.autoRotate]);
  
  const handleMapLoad = () => {
    setMapLoaded(true);
    
    // Set globe projection
    if (mapRef.current) {
      mapRef.current.getMap().setProjection('globe');
    }
  };
  
  return (
    <div className="relative w-full h-screen bg-slate-900">
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        onLoad={handleMapLoad}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        projection={{ name: 'globe' }}
        fog={{
          'range': [0.5, 10],
          'color': 'white',
          'horizon-blend': 0.3,
          'star-intensity': 0.15
        }}
        style={{ width: '100%', height: '100%' }}
        maxZoom={8}
        minZoom={1}
        dragRotate={true}
        touchZoomRotate={true}
      >
        {/* Render stakeholder markers */}
        {mapLoaded && stakeholders.map((stakeholder) => (
          <StakeholderMarker
            key={stakeholder.id}
            stakeholder={stakeholder}
          />
        ))}
        
        {/* Render connection lines */}
        {mapLoaded && globeSettings.showConnections && (
          <ConnectionLines />
        )}
      </Map>
      
      {/* Globe controls overlay */}
      <GlobeControls />
      
      {/* Loading state */}
      {!mapLoaded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-slate-900"
        >
          <div className="text-white text-center">
            <div className="animate-spin w-8 h-8 border-2 border-white border-t-transparent rounded-full mx-auto mb-4" />
            <p>Loading Globe...</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}
```

### 2. Create Stakeholder Marker Component
```typescript
// src/components/globe/stakeholder-marker.tsx
'use client';

import { motion } from 'framer-motion';
import { Marker } from 'react-map-gl';
import { useGlobeStore } from '@/stores/globe-store';
import { Stakeholder } from '@/types';
import { stakeholderColors } from '@/lib/utils';

interface StakeholderMarkerProps {
  stakeholder: Stakeholder;
}

export default function StakeholderMarker({ stakeholder }: StakeholderMarkerProps) {
  const { selectedStakeholder, selectStakeholder } = useGlobeStore();
  
  const isSelected = selectedStakeholder?.id === stakeholder.id;
  const color = stakeholderColors[stakeholder.type];
  
  const handleClick = () => {
    selectStakeholder(stakeholder);
  };
  
  return (
    <Marker
      longitude={stakeholder.coordinates[0]}
      latitude={stakeholder.coordinates[1]}
      anchor="center"
      onClick={handleClick}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ 
          scale: isSelected ? 1.5 : 1, 
          opacity: 1 
        }}
        whileHover={{ 
          scale: isSelected ? 1.8 : 1.3,
          transition: { duration: 0.2 }
        }}
        className="relative cursor-pointer"
      >
        {/* Main dot */}
        <div
          className={`w-3 h-3 rounded-full border-2 border-white shadow-lg transition-all duration-200`}
          style={{ backgroundColor: color }}
        />
        
        {/* Glow effect for selected/hovered */}
        {isSelected && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.3 }}
            className="absolute inset-0 rounded-full animate-ping"
            style={{ backgroundColor: color }}
          />
        )}
        
        {/* Tooltip on hover */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileHover={{ opacity: 1, y: -5 }}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black bg-opacity-75 text-white text-xs rounded whitespace-nowrap pointer-events-none"
        >
          {stakeholder.name}
          <br />
          <span className="text-gray-300">{stakeholder.organization}</span>
        </motion.div>
      </motion.div>
    </Marker>
  );
}
```

### 3. Create Connection Lines Component
```typescript
// src/components/globe/connection-lines.tsx
'use client';

import { useMemo } from 'react';
import { Source, Layer } from 'react-map-gl';
import { useGlobeStore } from '@/stores/globe-store';
import { useStakeholder } from '@/hooks/use-stakeholder';

export default function ConnectionLines() {
  const { selectedStakeholder } = useGlobeStore();
  const { getConnectedStakeholders } = useStakeholder();
  
  const connectionData = useMemo(() => {
    if (!selectedStakeholder) return null;
    
    const connectedStakeholders = getConnectedStakeholders(selectedStakeholder);
    
    const features = connectedStakeholders.map(connected => ({
      type: 'Feature' as const,
      geometry: {
        type: 'LineString' as const,
        coordinates: [
          selectedStakeholder.coordinates,
          connected.coordinates
        ]
      },
      properties: {
        id: `${selectedStakeholder.id}-${connected.id}`
      }
    }));
    
    return {
      type: 'FeatureCollection' as const,
      features
    };
  }, [selectedStakeholder, getConnectedStakeholders]);
  
  if (!connectionData || connectionData.features.length === 0) {
    return null;
  }
  
  return (
    <Source id="connections" type="geojson" data={connectionData}>
      <Layer
        id="connections-layer"
        type="line"
        paint={{
          'line-color': '#3B82F6',
          'line-width': 2,
          'line-opacity': 0.8,
          'line-dasharray': [2, 3]
        }}
        layout={{
          'line-cap': 'round',
          'line-join': 'round'
        }}
      />
    </Source>
  );
}
```

### 4. Create Globe Controls
```typescript
// src/components/globe/globe-controls.tsx
'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useGlobe } from '@/hooks/use-globe';
import { 
  RotateCcw, 
  Eye, 
  EyeOff, 
  Filter,
  Play,
  Pause
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const stakeholderTypes = [
  { value: null, label: 'All Types' },
  { value: 'entrepreneur', label: 'Entrepreneurs' },
  { value: 'university', label: 'Universities' },
  { value: 'investor', label: 'Investors' },
  { value: 'government', label: 'Government' },
  { value: 'corporate', label: 'Corporate' }
];

export default function GlobeControls() {
  const {
    globeSettings,
    toggleAutoRotate,
    toggleConnections,
    setFilter
  } = useGlobe();
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="absolute top-4 right-4 flex flex-col gap-2"
    >
      {/* Auto-rotate toggle */}
      <Button
        variant="secondary"
        size="icon"
        onClick={toggleAutoRotate}
        className="bg-white/90 hover:bg-white shadow-lg"
      >
        {globeSettings.autoRotate ? (
          <Pause className="w-4 h-4" />
        ) : (
          <Play className="w-4 h-4" />
        )}
      </Button>
      
      {/* Connection lines toggle */}
      <Button
        variant="secondary"
        size="icon"
        onClick={toggleConnections}
        className="bg-white/90 hover:bg-white shadow-lg"
      >
        {globeSettings.showConnections ? (
          <Eye className="w-4 h-4" />
        ) : (
          <EyeOff className="w-4 h-4" />
        )}
      </Button>
      
      {/* Filter dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="bg-white/90 hover:bg-white shadow-lg"
          >
            <Filter className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {stakeholderTypes.map((type) => (
            <DropdownMenuItem
              key={type.value || 'all'}
              onClick={() => setFilter(type.value)}
              className={
                globeSettings.filterType === type.value
                  ? 'bg-blue-50 text-blue-700'
                  : ''
              }
            >
              {type.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
}
```

### 5. Add Three.js Enhanced Effects (Optional)
```typescript
// src/components/globe/three-effects.tsx
'use client';

import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, Stars } from '@react-three/drei';
import * as THREE from 'three';

function GlobeEffects() {
  const sphereRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (sphereRef.current) {
      sphereRef.current.rotation.y += 0.001;
    }
  });
  
  return (
    <>
      {/* Background stars */}
      <Stars
        radius={300}
        depth={60}
        count={1000}
        factor={7}
        saturation={0}
        fade
      />
      
      {/* Atmospheric glow */}
      <Sphere ref={sphereRef} args={[1.01, 64, 64]} position={[0, 0, 0]}>
        <meshBasicMaterial
          color="#4299e1"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>
    </>
  );
}

export default function ThreeEffectsOverlay() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        style={{ background: 'transparent' }}
      >
        <GlobeEffects />
      </Canvas>
    </div>
  );
}
```

### 6. Create Mock Data Generator
```typescript
// src/lib/mock-data.ts
import { Stakeholder } from '@/types';
import { nanoid } from 'nanoid';

const names = [
  'Alex Johnson', 'Sarah Chen', 'Michael Brown', 'Emma Davis',
  'James Wilson', 'Lisa Garcia', 'David Miller', 'Anna Martinez'
];

const organizations = {
  entrepreneur: ['TechStart Inc', 'InnovateCorp', 'NextGen Solutions', 'FutureBuilders'],
  university: ['MIT', 'Stanford University', 'Oxford University', 'ETH Zurich'],
  investor: ['Venture Capital Partners', 'Angel Investments', 'Growth Fund LLC'],
  government: ['Department of Innovation', 'Economic Development Agency'],
  corporate: ['Google', 'Microsoft', 'Apple', 'Amazon', 'Tesla']
};

const interests = [
  'AI/Machine Learning', 'Sustainability', 'FinTech', 'HealthTech',
  'EdTech', 'Climate Change', 'Social Impact', 'Blockchain'
];

const regions = [
  { name: 'North America', coords: [-100, 45] },
  { name: 'Europe', coords: [10, 50] },
  { name: 'Asia', coords: [100, 30] },
  { name: 'Africa', coords: [20, 0] },
  { name: 'South America', coords: [-60, -15] },
  { name: 'Australia/Oceania', coords: [140, -25] }
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateCoordinates(baseCoords: [number, number]): [number, number] {
  return [
    baseCoords[0] + (Math.random() - 0.5) * 60,
    baseCoords[1] + (Math.random() - 0.5) * 40
  ];
}

export function generateMockStakeholders(count: number): Stakeholder[] {
  const stakeholders: Stakeholder[] = [];
  const types: Stakeholder['type'][] = ['entrepreneur', 'university', 'investor', 'government', 'corporate'];
  
  for (let i = 0; i < count; i++) {
    const type = getRandomElement(types);
    const region = getRandomElement(regions);
    const stakeholder: Stakeholder = {
      id: nanoid(),
      type,
      name: getRandomElement(names),
      organization: getRandomElement(organizations[type]),
      region: region.name,
      coordinates: generateCoordinates(region.coords as [number, number]),
      impactMetrics: {
        funding: type === 'entrepreneur' || type === 'investor' ? Math.floor(Math.random() * 10000000) : undefined,
        employees: type === 'entrepreneur' || type === 'corporate' ? Math.floor(Math.random() * 1000) : undefined,
        studentsReached: type === 'university' ? Math.floor(Math.random() * 50000) : undefined,
        projectsCompleted: Math.floor(Math.random() * 50),
      },
      interests: Array.from(new Set([
        getRandomElement(interests),
        getRandomElement(interests),
        getRandomElement(interests)
      ])),
      currentInitiatives: [
        'Working on innovative solutions',
        'Building partnerships globally',
        'Scaling operations'
      ],
      connections: [], // Will be populated after all stakeholders are created
      description: `Experienced ${type} focused on driving innovation and creating positive impact through technology and collaboration.`,
      contactInfo: {
        email: `${getRandomElement(names).toLowerCase().replace(' ', '.')}@example.com`,
        linkedin: `linkedin.com/in/${getRandomElement(names).toLowerCase().replace(' ', '-')}`,
      }
    };
    
    stakeholders.push(stakeholder);
  }
  
  // Create random connections
  stakeholders.forEach(stakeholder => {
    const connectionCount = Math.floor(Math.random() * 5) + 1;
    const potentialConnections = stakeholders
      .filter(s => s.id !== stakeholder.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, connectionCount);
    
    stakeholder.connections = potentialConnections.map(c => c.id);
  });
  
  return stakeholders;
}
```

### 7. Update Main Application
```typescript
// src/app/page.tsx
'use client';

import { useOnboardingStore } from '@/stores/onboarding-store';
import OnboardingWizard from '@/components/onboarding/onboarding-wizard';
import GlobeContainer from '@/components/globe/globe-container';
import ProfilePanel from '@/components/profile/profile-panel';

export default function HomePage() {
  const { isCompleted } = useOnboardingStore();
  
  if (!isCompleted) {
    return <OnboardingWizard />;
  }
  
  return (
    <div className="relative">
      <GlobeContainer />
      <ProfilePanel />
    </div>
  );
}
```

## ✅ Verification
- [ ] Globe renders with satellite imagery
- [ ] Stakeholder dots appear with correct colors
- [ ] Hover effects work smoothly
- [ ] Click events open profile panels
- [ ] Connection lines animate properly
- [ ] Auto-rotation can be toggled
- [ ] Filter controls work correctly
- [ ] Performance is smooth (30+ FPS) 