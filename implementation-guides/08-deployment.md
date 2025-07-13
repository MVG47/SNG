# 08 - Deployment & Optimization

## 🎯 Goal
Optimize the application for production deployment with performance enhancements and deploy to Vercel.

## 📋 Steps

### 1. Build Optimization
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react', 'framer-motion']
  },
  
  // Image optimization
  images: {
    domains: ['api.mapbox.com', 'images.unsplash.com'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Environment variables
  env: {
    MAPBOX_ACCESS_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN,
  },
  
  // Bundle analyzer (for development)
  ...(process.env.ANALYZE === 'true' && {
    bundleAnalyzerEnabled: true,
  }),
  
  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Mapbox GL JS optimization
    config.resolve.alias = {
      ...config.resolve.alias,
      'mapbox-gl': 'mapbox-gl/dist/mapbox-gl.js',
    };
    
    // Reduce bundle size
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    
    return config;
  },
  
  // Compression
  compress: true,
  
  // PoweredBy header removal
  poweredByHeader: false,
  
  // Trailing slash handling
  trailingSlash: false,
  
  // Generate static pages
  output: 'standalone',
};

module.exports = nextConfig;
```

### 2. Environment Configuration
```bash
# .env.local (development)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_development_token
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# .env.production (production - add to Vercel dashboard)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_production_token
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
NODE_ENV=production
```

### 3. Performance Optimizations
```typescript
// src/components/performance/lazy-loading.tsx
import { lazy, Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load heavy components
const GlobeContainer = lazy(() => import('@/components/globe/globe-container'));
const ProfilePanel = lazy(() => import('@/components/profile/profile-panel'));
const OnboardingWizard = lazy(() => import('@/components/onboarding/onboarding-wizard'));

// Loading skeletons
export const GlobeSkeleton = () => (
  <div className="w-full h-screen bg-slate-900 flex items-center justify-center">
    <div className="text-white">Loading Globe...</div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="w-96 h-full bg-white p-6 space-y-4">
    <Skeleton className="h-8 w-3/4" />
    <Skeleton className="h-20 w-20 rounded-full mx-auto" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

// Optimized lazy components
export const LazyGlobeContainer = () => (
  <Suspense fallback={<GlobeSkeleton />}>
    <GlobeContainer />
  </Suspense>
);

export const LazyProfilePanel = () => (
  <Suspense fallback={<ProfileSkeleton />}>
    <ProfilePanel />
  </Suspense>
);

export const LazyOnboardingWizard = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <OnboardingWizard />
  </Suspense>
);
```

### 4. Bundle Analysis Setup
```bash
# Install bundle analyzer
npm install --save-dev @next/bundle-analyzer

# Add to package.json scripts
"analyze": "ANALYZE=true npm run build",
"analyze:server": "BUNDLE_ANALYZE=server npm run build",
"analyze:browser": "BUNDLE_ANALYZE=browser npm run build"
```

### 5. Caching Strategy
```typescript
// src/lib/cache.ts
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export class CacheManager {
  private static instance: CacheManager;
  private cache: Map<string, { data: any; timestamp: number }> = new Map();
  
  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }
  
  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }
  
  get(key: string): any | null {
    const cached = this.cache.get(key);
    if (!cached) return null;
    
    if (Date.now() - cached.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.data;
  }
  
  clear(): void {
    this.cache.clear();
  }
}

// Usage in components
export function useCachedData(key: string, fetcher: () => any) {
  const cache = CacheManager.getInstance();
  
  const cachedData = cache.get(key);
  if (cachedData) {
    return cachedData;
  }
  
  const data = fetcher();
  cache.set(key, data);
  return data;
}
```

### 6. Error Boundary Implementation
```typescript
// src/components/error-boundary.tsx
'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }
  
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. Please try refreshing the page.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Page
            </Button>
          </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### 7. SEO and Meta Tags
```typescript
// src/app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Stakeholder Network Globe',
  description: 'Interactive 3D globe showcasing global stakeholder networks and connections',
  keywords: ['stakeholders', 'network', 'globe', 'innovation', 'collaboration'],
  authors: [{ name: 'Your Name' }],
  creator: 'Your Name',
  publisher: 'Your Company',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: 'Stakeholder Network Globe',
    description: 'Interactive 3D globe showcasing global stakeholder networks',
    siteName: 'Stakeholder Network Globe',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stakeholder Network Globe',
    description: 'Interactive 3D globe showcasing global stakeholder networks',
    creator: '@yourhandle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};
```

### 8. Vercel Deployment
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "functions": {
    "app/**/*.{js,ts,tsx}": {
      "maxDuration": 30
    }
  },
  "crons": [],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### 9. Performance Monitoring
```typescript
// src/lib/analytics.ts
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', 'GA_MEASUREMENT_ID', {
      page_location: url,
    });
  }
}

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}

// Web Vitals tracking
export function trackWebVitals({ id, name, value }: any) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', name, {
      event_category: 'Web Vitals',
      event_label: id,
      value: Math.round(name === 'CLS' ? value * 1000 : value),
      non_interaction: true,
    });
  }
}
```

### 10. Deployment Checklist
```bash
# Pre-deployment checks
npm run lint
npm run type-check
npm run build
npm run analyze

# Environment variables to set in Vercel:
# NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
# NEXT_PUBLIC_APP_URL

# Deployment commands
npx vercel --prod
# or
git push origin main  # if connected to GitHub
```

### 11. Health Check Endpoint
```typescript
// src/app/api/health/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV
  });
}
```

### 12. Progressive Web App (PWA) Setup
```json
// public/manifest.json
{
  "name": "Stakeholder Network Globe",
  "short_name": "SNG",
  "description": "Interactive 3D globe showcasing global stakeholder networks",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3B82F6",
  "icons": [
    {
      "src": "/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## ✅ Deployment Verification
- [ ] Build completes without errors
- [ ] Bundle size is optimized (< 2MB)
- [ ] Environment variables are set correctly
- [ ] Mapbox integration works in production
- [ ] All animations perform smoothly
- [ ] Error boundaries handle failures gracefully
- [ ] SEO meta tags are properly set
- [ ] Health check endpoint responds
- [ ] PWA manifest is valid
- [ ] Lighthouse score > 90 across all metrics 