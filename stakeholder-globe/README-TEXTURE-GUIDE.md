# Globe Texture Implementation Guide

This guide explains how to add texture to your Globe component that aligns with stakeholder nodes.

## Overview

The texture system creates a dynamic Earth-like texture that highlights areas where stakeholders are located. Each stakeholder type gets a unique color glow on the globe surface.

## Implementation

### 1. Texture Generator (`src/lib/globe-texture.ts`)

The `GlobeTextureGenerator` class creates a canvas-based texture that:
- Draws a base Earth-like gradient
- Adds simplified continent shapes
- Highlights stakeholder locations with colored glows
- Converts lat/lng coordinates to texture UV coordinates

### 2. Key Features

- **Dynamic Updates**: Texture regenerates when stakeholders change
- **Type-based Coloring**: Different stakeholder types get different colors
- **Proper Coordinate Mapping**: Geographic coordinates align with 3D globe
- **Performance Optimized**: Uses canvas for efficient texture generation

### 3. How to Use

```typescript
import { generateGlobeTexture } from '@/lib/globe-texture';
import { Stakeholder } from '@/types';

// Generate texture
const texture = generateGlobeTexture(stakeholders, {
  width: 1024,
  height: 512,
  highlightRadius: 25,
  continentColor: '#059669',
  baseColor: '#1e40af'
});

// Apply to globe material
<meshStandardMaterial
  map={texture}
  transparent
  opacity={0.9}
  roughness={0.4}
  metalness={0.1}
  emissive="#001122"
  emissiveIntensity={0.1}
/>
```

### 4. Coordinate System

The texture uses equirectangular projection:
- **U coordinate**: `(longitude + 180) / 360`
- **V coordinate**: `(90 - latitude) / 180`

This ensures proper alignment with the 3D sphere geometry.

### 5. Color Mapping

```typescript
const colors = {
  entrepreneur: '#10B981',  // Green
  university: '#3B82F6',    // Blue
  investor: '#F59E0B',      // Orange
  government: '#EF4444',    // Red
  corporate: '#8B5CF6'      // Purple
};
```

### 6. Integration with Existing Globe

To integrate with your existing `simple-globe.tsx`:

1. Import the texture generator
2. Add texture state to your Globe component
3. Generate texture when stakeholders change
4. Apply texture to the sphere material

### 7. Performance Considerations

- Texture generation is expensive, so it's cached until stakeholders change
- Use reasonable canvas dimensions (1024x512 is good balance)
- Dispose of old textures to prevent memory leaks

### 8. Customization Options

- **Highlight Radius**: Controls glow size around stakeholders
- **Colors**: Customize per stakeholder type
- **Continent Shapes**: Add more detailed land masses
- **Base Texture**: Use real Earth texture as base

### 9. Alternative Approaches

1. **Real Earth Texture**: Use actual satellite imagery as base
2. **Shader-based**: Use custom shaders for more complex effects
3. **Multiple Textures**: Layer different textures for more detail
4. **Animation**: Animate highlight pulses or color changes

## Example Usage

```typescript
// In your Globe component
const [texture, setTexture] = useState<THREE.CanvasTexture | null>(null);

useEffect(() => {
  if (stakeholders.length > 0) {
    const newTexture = generateGlobeTexture(stakeholders, {
      width: 1024,
      height: 512,
      highlightRadius: 25,
    });
    setTexture(newTexture);
  }
}, [stakeholders]);

// In your render
<Sphere ref={meshRef} args={[1.5, 64, 64]}>
  <meshStandardMaterial
    map={texture}
    transparent
    opacity={0.9}
    roughness={0.4}
    metalness={0.1}
    emissive="#001122"
    emissiveIntensity={0.1}
  />
</Sphere>
```

## Troubleshooting

- **Type Errors**: If you encounter Three.js type conflicts, you can use `@ts-ignore` comments as a temporary solution
- **Performance**: Reduce texture dimensions if updates are slow
- **Alignment**: Verify coordinate conversion matches your 3D positioning logic

This system provides a solid foundation for creating visually appealing, data-driven globe textures that enhance the stakeholder visualization experience. 