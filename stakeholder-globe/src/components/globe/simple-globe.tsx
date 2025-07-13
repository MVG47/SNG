'use client';

import { useEffect, useRef, useState, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, OrbitControls, Stars } from '@react-three/drei';
import { useGlobe } from '@/hooks/use-globe';
import { useStakeholder } from '@/hooks/use-stakeholder';
import { Stakeholder } from '@/types';
import { getStakeholderColor } from '@/lib/utils';
import * as THREE from 'three';

interface SimpleGlobeProps {
  stakeholders: Stakeholder[];
}

interface Position3D {
  x: number;
  y: number;
  z: number;
  visible: boolean;
}

interface ScreenPosition {
  x: number;
  y: number;
}

// Component to handle 3D to 2D projection for connection lines
function ConnectionLinesHandler({ 
  selectedStakeholder, 
  connectedStakeholders, 
  positions,
  onScreenPositionsUpdate 
}: {
  selectedStakeholder: Stakeholder;
  connectedStakeholders: Stakeholder[];
  positions: Map<string, Position3D>;
  onScreenPositionsUpdate: (positions: Map<string, ScreenPosition>) => void;
}) {
  const { camera, size } = useThree();
  
  useFrame(() => {
    const screenPositions = new Map<string, ScreenPosition>();
    
    // Convert selected stakeholder position
    const selectedPos = positions.get(selectedStakeholder.id);
    if (selectedPos && selectedPos.visible) {
      const vector = new THREE.Vector3(selectedPos.x, selectedPos.y, selectedPos.z);
      vector.project(camera);
      
      const x = (vector.x + 1) * size.width / 2;
      const y = (-vector.y + 1) * size.height / 2;
      
      screenPositions.set(selectedStakeholder.id, { x, y });
    }
    
    // Convert connected stakeholders positions
    connectedStakeholders.forEach(stakeholder => {
      const pos = positions.get(stakeholder.id);
      if (pos && pos.visible) {
        const vector = new THREE.Vector3(pos.x, pos.y, pos.z);
        vector.project(camera);
        
        const x = (vector.x + 1) * size.width / 2;
        const y = (-vector.y + 1) * size.height / 2;
        
        screenPositions.set(stakeholder.id, { x, y });
      }
    });
    
    onScreenPositionsUpdate(screenPositions);
  });
  
  return null;
}

// Globe component for Three.js
function Globe({ rotation }: { rotation: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation * (Math.PI / 180);
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 64, 64]}>
      <meshStandardMaterial
        color="#1e40af"
        transparent
        opacity={0.6}
        roughness={0.8}
        metalness={0.2}
      />
    </Sphere>
  );
}

// Stakeholder marker component for Three.js
function StakeholderMarker({ 
  stakeholder, 
  position, 
  isSelected, 
  isConnected, 
  onClick 
}: {
  stakeholder: Stakeholder;
  position: Position3D;
  isSelected: boolean;
  isConnected: boolean;
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.set(position.x, position.y, position.z);
      const baseScale = 0.05;
      const scale = isSelected ? baseScale * 1.5 : hovered ? baseScale * 1.2 : baseScale;
      meshRef.current.scale.setScalar(scale);
    }
  });

  if (!position.visible) return null;

  return (
    <Sphere
      ref={meshRef}
      args={[1, 16, 16]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={getStakeholderColor(stakeholder.type)}
        emissive={isSelected ? getStakeholderColor(stakeholder.type) : '#000000'}
        emissiveIntensity={isSelected ? 0.4 : hovered ? 0.2 : 0}
      />
    </Sphere>
  );
}

export default function SimpleGlobe({ stakeholders }: SimpleGlobeProps) {
  const { selectedStakeholder, selectStakeholder } = useStakeholder();
  const { globeSettings, isPanelOpen } = useGlobe();
  const [rotation, setRotation] = useState(0);
  const [positions, setPositions] = useState<Map<string, Position3D>>(new Map());
  const [screenPositions, setScreenPositions] = useState<Map<string, ScreenPosition>>(new Map());

  // Auto-rotation effect
  useEffect(() => {
    if (!globeSettings.autoRotate) return;
    
    const interval = setInterval(() => {
      setRotation(prev => (prev + 0.2) % 360);
    }, 50);
    
    return () => clearInterval(interval);
  }, [globeSettings.autoRotate]);

  // Calculate 3D positions for stakeholders on sphere
  useEffect(() => {
    if (stakeholders.length === 0) return;
    
    const radius = 1.6; // Slightly larger than globe radius
    const newPositions = new Map<string, Position3D>();
    
    stakeholders.forEach((stakeholder) => {
      const [lng, lat] = stakeholder.coordinates;
      
      // Convert lat/lng to spherical coordinates
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + rotation) * (Math.PI / 180);
      
      // Convert to 3D Cartesian coordinates
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      // Determine visibility (front-facing)
      const visible = z > -0.8;
      
      newPositions.set(stakeholder.id, { x, y, z, visible });
    });
    
    setPositions(newPositions);
  }, [stakeholders, rotation]);

  const handleStakeholderClick = (stakeholder: Stakeholder) => {
    console.log('Stakeholder clicked:', stakeholder.name);
    selectStakeholder(stakeholder);
  };

  // Get connected stakeholders
  const getConnectedStakeholders = (stakeholder: Stakeholder) => {
    return stakeholder.connections
      .map(id => stakeholders.find(s => s.id === id))
      .filter(Boolean) as Stakeholder[];
  };

  const connectedStakeholders = selectedStakeholder ? getConnectedStakeholders(selectedStakeholder) : [];
  
  // Filter stakeholders if filter is active
  const visibleStakeholders = globeSettings.filterType 
    ? stakeholders.filter(s => s.type === globeSettings.filterType)
    : stakeholders;

  return (
    <group>
      {/* Stars background */}
      <Stars
        radius={50}
        depth={20}
        count={500}
        factor={2}
        saturation={0}
        fade
      />
      
      {/* Globe */}
      <Globe rotation={rotation} />
    
      {/* Stakeholder markers */}
      {visibleStakeholders.map((stakeholder) => {
        const position = positions.get(stakeholder.id);
        if (!position) return null;

        const isSelected = selectedStakeholder?.id === stakeholder.id;
        const isConnected = Boolean(selectedStakeholder && 
          connectedStakeholders.some(c => c.id === stakeholder.id));

        return (
          <StakeholderMarker
            key={stakeholder.id}
            stakeholder={stakeholder}
            position={position}
            isSelected={isSelected}
            isConnected={isConnected}
            onClick={() => handleStakeholderClick(stakeholder)}
          />
        );
      })}
      
      {/* Connection lines handler */}
      {selectedStakeholder && globeSettings.showConnections && (
        <ConnectionLinesHandler
          selectedStakeholder={selectedStakeholder}
          connectedStakeholders={connectedStakeholders}
          positions={positions}
          onScreenPositionsUpdate={setScreenPositions}
        />
      )}
    </group>
  );
} 