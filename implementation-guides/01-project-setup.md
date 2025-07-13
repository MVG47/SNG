# 01 - Project Setup & Core Infrastructure

## 🎯 Goal
Set up Next.js 14 project with TypeScript, Tailwind, and all required dependencies.

## 📋 Steps

### 1. Initialize Next.js Project
```bash
npx create-next-app@latest stakeholder-globe --typescript --tailwind --app
cd stakeholder-globe
```

### 2. Install Core Dependencies
```bash
# UI and Styling
npm install @radix-ui/react-* lucide-react class-variance-authority clsx tailwind-merge

# Maps and 3D
npm install mapbox-gl react-map-gl three @react-three/fiber @react-three/drei

# Animations
npm install framer-motion

# State Management & Forms
npm install zustand react-hook-form @hookform/resolvers zod

# Utilities
npm install date-fns nanoid

# Development
npm install -D @types/mapbox-gl
```

### 3. Setup ShadCN/UI
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label select tabs progress badge avatar
```

### 4. Configure TypeScript Paths
```typescript
// tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/types/*": ["./src/types/*"],
      "@/hooks/*": ["./src/hooks/*"]
    }
  }
}
```

### 5. Setup Environment Variables
```bash
# .env.local
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

### 6. Create Folder Structure
```bash
mkdir -p src/{components/{ui,globe,onboarding,profile,feed,layout},lib,stores,types,hooks,data}
```

### 7. Configure Tailwind CSS
```javascript
// tailwind.config.js
module.exports = {
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        entrepreneur: '#10B981',
        university: '#3B82F6', 
        investor: '#F59E0B',
        government: '#EF4444',
        corporate: '#8B5CF6',
      },
      animation: {
        'spin-slow': 'spin 20s linear infinite',
        'pulse-glow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
```

### 8. Setup Next.js Configuration
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['api.mapbox.com', 'images.unsplash.com'],
  },
  env: {
    MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  },
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      'mapbox-gl': 'mapbox-gl/dist/mapbox-gl.js',
    };
    return config;
  },
};

module.exports = nextConfig;
```

### 9. Create Type Definitions
```typescript
// src/types/index.ts
export interface Stakeholder {
  id: string;
  type: 'entrepreneur' | 'university' | 'investor' | 'government' | 'corporate';
  name: string;
  organization: string;
  region: string;
  coordinates: [number, number];
  impactMetrics: {
    funding?: number;
    employees?: number;
    studentsReached?: number;
    projectsCompleted?: number;
  };
  interests: string[];
  currentInitiatives: string[];
  connections: string[];
  avatar?: string;
  description: string;
  contactInfo: {
    email?: string;
    linkedin?: string;
    website?: string;
  };
}

export interface FeedPost {
  id: string;
  authorId: string;
  content: string;
  timestamp: Date;
  type: 'update' | 'opportunity' | 'achievement' | 'collaboration';
  attachments?: {
    images?: string[];
    documents?: string[];
  };
  likes: number;
  comments: Comment[];
}
```

### 10. Create Utils File
```typescript
// src/lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const stakeholderColors = {
  entrepreneur: '#10B981',
  university: '#3B82F6',
  investor: '#F59E0B', 
  government: '#EF4444',
  corporate: '#8B5CF6',
} as const;
```

## ✅ Verification
- [ ] Project builds without errors: `npm run build`
- [ ] Development server starts: `npm run dev`
- [ ] TypeScript paths resolve correctly
- [ ] Tailwind classes work in components
- [ ] ShadCN components can be imported 