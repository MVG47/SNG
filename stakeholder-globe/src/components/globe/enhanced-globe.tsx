'use client';

import { useEffect, useRef, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
// @ts-ignore - three-globe doesn't have TypeScript definitions
import ThreeGlobe from 'three-globe';
import { useGlobe } from '@/hooks/use-globe';
import { useStakeholder } from '@/hooks/use-stakeholder';
import { Stakeholder } from '@/types';
import { getStakeholderColor } from '@/lib/utils';

interface EnhancedGlobeProps {
  stakeholders: Stakeholder[];
}

interface GlobePoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: string;
  color: string;
  size: number;
  altitude: number;
  stakeholder?: Stakeholder;
}

interface GlobeArc {
  id: string;
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string[];
  stroke: number;
}

interface GlobeLabel {
  id: string;
  lat: number;
  lng: number;
  text: string;
  color: string;
  altitude: number;
  size: number;
}

export default function EnhancedGlobe({ stakeholders }: EnhancedGlobeProps) {
  const globeRef = useRef<any>(null);
  const { selectedStakeholder, selectStakeholder } = useStakeholder();
  const { globeSettings } = useGlobe();
  const { gl, camera, scene } = useThree();
  const [globeInstance, setGlobeInstance] = useState<any>(null);
  const [autoRotation, setAutoRotation] = useState(0);
  const [countriesData, setCountriesData] = useState<any[]>([]);
  const [dayNightTime, setDayNightTime] = useState(0); // 0 = day, 1 = night



  // Initialize three-globe instance
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
      
      // Points layer configuration
      .pointsData([])
      .pointLat((d: any) => d.lat)
      .pointLng((d: any) => d.lng)
      .pointColor((d: any) => d.color)
      .pointAltitude((d: any) => d.altitude)
      .pointRadius((d: any) => d.size)
      .pointResolution(12)
      .pointsTransitionDuration(1000)
      
      
      // Arcs layer configuration
      .arcsData([])
      .arcStartLat((d: any) => d.startLat)
      .arcStartLng((d: any) => d.startLng)
      .arcEndLat((d: any) => d.endLat)
      .arcEndLng((d: any) => d.endLng)
      .arcColor((d: any) => d.color)
      .arcStroke((d: any) => d.stroke)
      .arcAltitude(0.3)
      .arcCurveResolution(64)
      .arcDashLength(0.5)
      .arcDashGap(0.1)
      .arcDashAnimateTime(3000)
      .arcsTransitionDuration(1000)
      

      
      // Labels layer configuration
      .labelsData([])
      .labelLat((d: any) => d.lat)
      .labelLng((d: any) => d.lng)
      .labelText((d: any) => d.text)
      .labelColor((d: any) => d.color)
      .labelAltitude((d: any) => d.altitude)
      .labelSize((d: any) => d.size)
      .labelIncludeDot(true)
      .labelDotRadius(0.3)
      .labelsTransitionDuration(1000)
      
      // Polygons layer configuration for country boundaries
      .polygonsData([])
      .polygonCapColor(() => 'rgba(200, 200, 200, 0.2)')
      .polygonSideColor(() => 'rgba(200, 200, 200, 0.1)')
      .polygonStrokeColor(() => 'rgba(255, 255, 255, 0.4)')
      .polygonAltitude(0.001)
      .polygonsTransitionDuration(1000)
      
;

    // Scale the globe appropriately
    globe.scale.set(1.5, 1.5, 1.5);

    globeRef.current.add(globe);
    setGlobeInstance(globe);

    // Add click detection for stakeholder selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleClick = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera as any);
      
      // Get all point objects from the globe
      const pointObjects: THREE.Object3D[] = [];
      globe.traverse((child: any) => {
        if (child.userData && child.userData.isPoint) {
          pointObjects.push(child);
        }
      });

      const intersects = raycaster.intersectObjects(pointObjects);
      
      if (intersects.length > 0) {
        const intersection = intersects[0];
        const userData = intersection.object.userData;
        
        if (userData && userData.stakeholderId) {
          const stakeholder = stakeholders.find(s => s.id === userData.stakeholderId);
          if (stakeholder) {
            console.log('Point clicked:', stakeholder.name);
            selectStakeholder(stakeholder);
          }
        }
      }
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera as any);
      
      const pointObjects: THREE.Object3D[] = [];
      globe.traverse((child: any) => {
        if (child.userData && child.userData.isPoint) {
          pointObjects.push(child);
        }
      });

      const intersects = raycaster.intersectObjects(pointObjects);
      
      if (intersects.length > 0) {
        gl.domElement.style.cursor = 'pointer';
      } else {
        gl.domElement.style.cursor = 'default';
      }
    };

    gl.domElement.addEventListener('click', handleClick);
    gl.domElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (globeRef.current) {
        globeRef.current.remove(globe);
      }
      gl.domElement.removeEventListener('click', handleClick);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl, selectStakeholder, camera, stakeholders]);

  // Load country data for polygons
  useEffect(() => {
    if (!globeInstance) return;
    
    // Load country geojson data
    fetch('https://raw.githubusercontent.com/vasturiano/three-globe/master/example/datasets/ne_110m_admin_0_countries.geojson')
      .then(response => response.json())
      .then(data => {
        setCountriesData(data.features);
        if (globeSettings.showCountries) {
          globeInstance.polygonsData(data.features);
        }
      })
      .catch(error => {
        console.warn('Could not load country data:', error);
      });
  }, [globeInstance, globeSettings.showCountries]);

  // Update polygons when showCountries setting changes
  useEffect(() => {
    if (!globeInstance || !countriesData.length) return;
    
    if (globeSettings.showCountries) {
      globeInstance.polygonsData(countriesData);
    } else {
      globeInstance.polygonsData([]);
    }
  }, [globeInstance, countriesData, globeSettings.showCountries]);



  // Update points data when stakeholders change
  useEffect(() => {
    if (!globeInstance || !stakeholders.length) return;

    const visibleStakeholders = globeSettings.filterType 
      ? stakeholders.filter(s => s.type === globeSettings.filterType)
      : stakeholders;

    // Use regular points only (custom markers not supported in this version)
    const pointsData: GlobePoint[] = visibleStakeholders.map(stakeholder => ({
      id: stakeholder.id,
      lat: stakeholder.coordinates[1],
      lng: stakeholder.coordinates[0],
      name: stakeholder.name,
      type: stakeholder.type,
      color: getStakeholderColor(stakeholder.type),
      size: selectedStakeholder?.id === stakeholder.id ? 0.8 : 0.5,
      altitude: selectedStakeholder?.id === stakeholder.id ? 0.05 : 0.02,
      stakeholder: stakeholder, // Include full stakeholder object for click handling
    }));

    globeInstance.pointsData(pointsData);
  }, [globeInstance, stakeholders, selectedStakeholder, globeSettings.filterType]);

  // Update arcs data when connections need to be shown
  useEffect(() => {
    if (!globeInstance || !selectedStakeholder || !globeSettings.showConnections) {
      if (globeInstance) {
        globeInstance.arcsData([]);
      }
      return;
    }

    const connectedStakeholders = selectedStakeholder.connections
      .map(id => stakeholders.find(s => s.id === id))
      .filter(Boolean) as Stakeholder[];

    const arcsData: GlobeArc[] = connectedStakeholders.map(connected => ({
      id: `${selectedStakeholder.id}-${connected.id}`,
      startLat: selectedStakeholder.coordinates[1],
      startLng: selectedStakeholder.coordinates[0],
      endLat: connected.coordinates[1],
      endLng: connected.coordinates[0],
      color: ['#60A5FA', '#3B82F6', '#2563EB'],
      stroke: 2,
    }));

    globeInstance.arcsData(arcsData);
  }, [globeInstance, selectedStakeholder, stakeholders, globeSettings.showConnections]);

  // Update labels data for selected stakeholder
  useEffect(() => {
    if (!globeInstance) return;

    const labelsData: GlobeLabel[] = [];
    
    if (selectedStakeholder) {
      labelsData.push({
        id: selectedStakeholder.id,
        lat: selectedStakeholder.coordinates[1],
        lng: selectedStakeholder.coordinates[0],
        text: selectedStakeholder.name,
        color: '#FFFFFF',
        altitude: 0.08,
        size: 0.8,
      });
    }

    globeInstance.labelsData(labelsData);
  }, [globeInstance, selectedStakeholder]);



  // Handle auto-rotation and day/night cycle
  useFrame((state, delta) => {
    if (!globeRef.current) return;

    if (globeSettings.autoRotate) {
      setAutoRotation(prev => prev + delta * 0.1);
      globeRef.current.rotation.y = autoRotation;
    }

    // Animate day/night cycle
    if (globeSettings.showDayNightCycle && globeInstance) {
      setDayNightTime(prev => {
        const newTime = (prev + delta * 0.1) % (Math.PI * 2); // Complete cycle every ~60 seconds
        const dayNightRatio = (Math.sin(newTime) + 1) / 2; // 0 to 1
        
        // Switch between day and night textures based on time
        if (dayNightRatio > 0.5) {
          // Day time
          globeInstance.globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg');
          globeInstance.atmosphereColor('#4FC3F7');
        } else {
          // Night time
          globeInstance.globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg');
          globeInstance.atmosphereColor('#1a1a2e');
        }
        
        return newTime;
      });
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

    // Set initial camera position
    handleCameraChange();

    // Update on camera changes
    const controls = gl.domElement.parentElement?.querySelector('[data-controls]');
    if (controls) {
      controls.addEventListener('change', handleCameraChange);
      return () => controls.removeEventListener('change', handleCameraChange);
    }
  }, [globeInstance, camera, gl]);

  return (
    <group ref={globeRef}>
      {/* Three-globe will be added here programmatically */}
    </group>
  );
} 