'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
// @ts-ignore - three-globe doesn't have TypeScript definitions
import ThreeGlobe from 'three-globe';
import { useGlobe } from '@/hooks/use-globe';
import { useStakeholder } from '@/hooks/use-stakeholder';
import { Stakeholder } from '@/types';

interface HeatMapGlobeProps {
  stakeholders: Stakeholder[];
}

interface HeatMapPoint {
  lat: number;
  lng: number;
  weight: number;
}

export default function HeatMapGlobe({ stakeholders }: HeatMapGlobeProps) {
  const globeRef = useRef<any>(null);
  const { globeSettings } = useGlobe();
  const { gl, camera } = useThree();
  const [globeInstance, setGlobeInstance] = useState<any>(null);
  const [autoRotation, setAutoRotation] = useState(0);

  // Initialize three-globe instance for heatmap
  useEffect(() => {
    if (!globeRef.current) return;

    const globe = new ThreeGlobe()
      // Globe appearance
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .showAtmosphere(true)
      .atmosphereColor('#4FC3F7')
      .atmosphereAltitude(0.15)
      .showGraticules(false)
      
      // Heatmap layer configuration
      .heatmapsData([])
      .heatmapPoints((d: any) => d.points)
      .heatmapPointLat((d: any) => d.lat)
      .heatmapPointLng((d: any) => d.lng)
      .heatmapPointWeight((d: any) => d.weight)
      .heatmapBandwidth(4)
      .heatmapColorSaturation(1.2)
      .heatmapBaseAltitude(0.01)
      .heatmapTopAltitude(0.08)
      .heatmapsTransitionDuration(2000);

    // Scale the globe appropriately
    globe.scale.set(1.5, 1.5, 1.5);

    globeRef.current.add(globe);
    setGlobeInstance(globe);

    return () => {
      if (globeRef.current) {
        globeRef.current.remove(globe);
      }
    };
  }, [gl]);

  // Update heatmap data when stakeholders change
  useEffect(() => {
    if (!globeInstance || !stakeholders.length) return;

    const visibleStakeholders = globeSettings.filterType 
      ? stakeholders.filter(s => s.type === globeSettings.filterType)
      : stakeholders;

    // Convert stakeholders to heatmap points
    const heatmapPoints: HeatMapPoint[] = visibleStakeholders.map(stakeholder => ({
      lat: stakeholder.coordinates[1],
      lng: stakeholder.coordinates[0],
      weight: 1, // Each stakeholder contributes equally to the heatmap
    }));

    // Group heatmap by type for multiple heatmap layers
    const heatmapsByType = visibleStakeholders.reduce((acc, stakeholder) => {
      if (!acc[stakeholder.type]) {
        acc[stakeholder.type] = [];
      }
      acc[stakeholder.type].push({
        lat: stakeholder.coordinates[1],
        lng: stakeholder.coordinates[0],
        weight: 1,
      });
      return acc;
    }, {} as Record<string, HeatMapPoint[]>);

    // Create heatmap datasets
    const heatmapData = Object.entries(heatmapsByType).map(([type, points]) => ({
      id: type,
      points: points,
    }));

    // If no filter is applied, show overall heatmap
    if (!globeSettings.filterType) {
      globeInstance.heatmapsData([{
        id: 'all',
        points: heatmapPoints,
      }]);
    } else {
      globeInstance.heatmapsData(heatmapData);
    }
  }, [globeInstance, stakeholders, globeSettings.filterType]);

  // Handle auto-rotation
  useFrame((state, delta) => {
    if (!globeRef.current) return;

    if (globeSettings.autoRotate) {
      setAutoRotation(prev => prev + delta * 0.1);
      globeRef.current.rotation.y = autoRotation;
    }
  });

  // Update camera position for three-globe
  useEffect(() => {
    if (!globeInstance) return;

    const handleCameraChange = () => {
      if (globeInstance.setPointOfView) {
        globeInstance.setPointOfView(camera);
      }
    };

    handleCameraChange();
  }, [globeInstance, camera]);

  return (
    <group ref={globeRef}>
      {/* Three-globe heatmap will be added here programmatically */}
    </group>
  );
} 