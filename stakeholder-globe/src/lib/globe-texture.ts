import { Stakeholder } from '@/types';
import * as THREE from 'three';

interface TextureOptions {
  width?: number;
  height?: number;
  baseColor?: string;
  continentColor?: string;
  highlightRadius?: number;
}

export class GlobeTextureGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private width: number;
  private height: number;
  private options: Required<TextureOptions>;

  constructor(options: TextureOptions = {}) {
    this.width = options.width || 1024;
    this.height = options.height || 512;
    this.options = {
      width: this.width,
      height: this.height,
      baseColor: options.baseColor || '#1e40af',
      continentColor: options.continentColor || '#059669',
      highlightRadius: options.highlightRadius || 20,
    };

    this.canvas = document.createElement('canvas');
    this.canvas.width = this.width;
    this.canvas.height = this.height;
    this.ctx = this.canvas.getContext('2d')!;
  }

  generateTexture(stakeholders: Stakeholder[]): THREE.CanvasTexture {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Create base earth-like texture
    this.drawBaseTexture();
    
    // Draw continent outlines
    this.drawContinents();
    
    // Add stakeholder highlights
    this.drawStakeholderHighlights(stakeholders);
    
    // Create and return Three.js texture
    const texture = new THREE.CanvasTexture(this.canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.needsUpdate = true;
    
    return texture;
  }

  private drawBaseTexture() {
    // Create gradient from north to south pole
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#1e3a8a');    // Deep blue (north pole)
    gradient.addColorStop(0.2, '#1e40af');  // Blue
    gradient.addColorStop(0.4, '#0369a1');  // Ocean blue
    gradient.addColorStop(0.6, '#0369a1');  // Ocean blue
    gradient.addColorStop(0.8, '#1e40af');  // Blue
    gradient.addColorStop(1, '#1e3a8a');    // Deep blue (south pole)
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);
  }

  private drawContinents() {
    this.ctx.fillStyle = this.options.continentColor;
    this.ctx.globalAlpha = 0.6;
    
    // Simplified continent shapes (approximate)
    const continents = [
      // North America
      { x: 0.12, y: 0.25, w: 0.18, h: 0.35 },
      // South America
      { x: 0.18, y: 0.45, w: 0.12, h: 0.35 },
      // Europe
      { x: 0.45, y: 0.2, w: 0.1, h: 0.15 },
      // Africa
      { x: 0.48, y: 0.35, w: 0.12, h: 0.4 },
      // Asia
      { x: 0.65, y: 0.15, w: 0.25, h: 0.45 },
      // Australia
      { x: 0.8, y: 0.65, w: 0.08, h: 0.12 },
    ];
    
    continents.forEach(continent => {
      this.ctx.fillRect(
        continent.x * this.width,
        continent.y * this.height,
        continent.w * this.width,
        continent.h * this.height
      );
    });
    
    this.ctx.globalAlpha = 1;
  }

  private drawStakeholderHighlights(stakeholders: Stakeholder[]) {
    // Color mapping for stakeholder types
    const colors = {
      entrepreneur: '#10B981',  // Green
      university: '#3B82F6',    // Blue
      investor: '#F59E0B',      // Orange
      government: '#EF4444',    // Red
      corporate: '#8B5CF6'      // Purple
    };

    stakeholders.forEach(stakeholder => {
      const [lng, lat] = stakeholder.coordinates;
      
      // Convert lat/lng to texture coordinates
      const u = (lng + 180) / 360;  // Convert longitude to 0-1
      const v = (90 - lat) / 180;   // Convert latitude to 0-1
      
      const x = u * this.width;
      const y = v * this.height;
      
      // Create multiple layers for better visibility
      this.drawStakeholderGlow(x, y, colors[stakeholder.type], this.options.highlightRadius);
    });
  }

  private drawStakeholderGlow(x: number, y: number, color: string, radius: number) {
    // Outer glow
    let glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 1.5);
    glowGradient.addColorStop(0, color + '60');  // 40% opacity
    glowGradient.addColorStop(0.3, color + '40'); // 25% opacity
    glowGradient.addColorStop(0.6, color + '20'); // 12% opacity
    glowGradient.addColorStop(1, color + '00');   // 0% opacity
    
    this.ctx.fillStyle = glowGradient;
    this.ctx.fillRect(x - radius * 1.5, y - radius * 1.5, radius * 3, radius * 3);
    
    // Inner bright spot
    glowGradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius * 0.5);
    glowGradient.addColorStop(0, color + 'FF');  // 100% opacity
    glowGradient.addColorStop(0.5, color + '80'); // 50% opacity
    glowGradient.addColorStop(1, color + '00');   // 0% opacity
    
    this.ctx.fillStyle = glowGradient;
    this.ctx.fillRect(x - radius * 0.5, y - radius * 0.5, radius, radius);
  }

  // Method to get a preview of the texture as a data URL
  getPreviewDataURL(): string {
    return this.canvas.toDataURL();
  }

  // Method to dispose of resources
  dispose() {
    // Canvas cleanup happens automatically when references are removed
  }
}

// Convenience function for quick texture generation
export function generateGlobeTexture(
  stakeholders: Stakeholder[], 
  options?: TextureOptions
): THREE.CanvasTexture {
  const generator = new GlobeTextureGenerator(options);
  return generator.generateTexture(stakeholders);
} 