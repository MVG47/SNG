# Integration Example: Adding Texture to Existing Globe

This example shows how to modify your existing `simple-globe.tsx` to include the texture system.

## Step 1: Modify the Globe Component

Add these imports and state to your existing Globe component:

```typescript
// Add these imports at the top
import { generateGlobeTexture } from '@/lib/globe-texture';

// Modify the Globe component function
function Globe({ rotation, stakeholders }: { 
  rotation: number; 
  stakeholders: Stakeholder[]; 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [globeTexture, setGlobeTexture] = useState<any>(null); // Using 'any' to avoid type conflicts
  
  // Generate texture when stakeholders change
  useEffect(() => {
    if (stakeholders.length > 0) {
      const newTexture = generateGlobeTexture(stakeholders, {
        width: 1024,
        height: 512,
        highlightRadius: 25,
        continentColor: '#059669',
        baseColor: '#1e40af'
      });
      
      setGlobeTexture(newTexture);
      
      // Cleanup previous texture
      return () => {
        if (newTexture) {
          newTexture.dispose();
        }
      };
    }
  }, [stakeholders]);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation * (Math.PI / 180);
    }
  });

  return (
    <Sphere ref={meshRef} args={[1.5, 64, 64]}>
      <meshStandardMaterial
        // @ts-ignore - Temporarily ignore texture type conflicts
        map={globeTexture}
        transparent
        opacity={0.9}
        roughness={0.4}
        metalness={0.1}
        emissive="#001122"
        emissiveIntensity={0.1}
      />
    </Sphere>
  );
}
```

## Step 2: Update the Globe Component Call

In your main component, pass the stakeholders to the Globe:

```typescript
// In your SimpleGlobe component's render method
<Globe rotation={rotation} stakeholders={visibleStakeholders} />
```

## Step 3: Alternative Implementation (Without Type Issues)

If you prefer to avoid the type conflicts entirely, you can use the native Three.js approach:

```typescript
// Alternative Globe component using native Three.js
function Globe({ rotation, stakeholders }: { 
  rotation: number; 
  stakeholders: Stakeholder[]; 
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  
  useEffect(() => {
    if (stakeholders.length > 0 && materialRef.current) {
      const texture = generateGlobeTexture(stakeholders, {
        width: 1024,
        height: 512,
        highlightRadius: 25,
      });
      
      materialRef.current.map = texture;
      materialRef.current.needsUpdate = true;
      
      return () => {
        if (texture) {
          texture.dispose();
        }
      };
    }
  }, [stakeholders]);
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y = rotation * (Math.PI / 180);
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.5, 64, 64]} />
      <meshStandardMaterial
        ref={materialRef}
        transparent
        opacity={0.9}
        roughness={0.4}
        metalness={0.1}
        emissive="#001122"
        emissiveIntensity={0.1}
      />
    </mesh>
  );
}
```

## Step 4: Test the Implementation

Your globe should now display:
- A base Earth-like texture with blue oceans and green continents
- Colored glows around stakeholder locations
- Dynamic updates when stakeholders change
- Proper alignment between texture highlights and 3D markers

## Visual Result

The texture will create:
- **Blue ocean base** with gradient from poles to equator
- **Green continent shapes** as simplified land masses
- **Colored glows** at stakeholder locations:
  - 🟢 Green for entrepreneurs
  - 🔵 Blue for universities  
  - 🟠 Orange for investors
  - 🔴 Red for government
  - 🟣 Purple for corporate

## Performance Tips

1. **Texture Caching**: The texture only regenerates when stakeholders change
2. **Reasonable Dimensions**: 1024x512 is a good balance of quality vs performance
3. **Cleanup**: Always dispose of old textures to prevent memory leaks
4. **Debouncing**: Consider debouncing texture updates if stakeholders change frequently

This implementation provides a solid foundation for your textured globe while working around the TypeScript type system complexities. 