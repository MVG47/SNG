# Technical Implementation Plan: Stakeholder-Network Globe

## 🎯 Project Overview
Frontend-only proof of concept showcasing an interactive 3D globe with stakeholder network visualization, built with modern web technologies.

## 🛠 Technology Stack

### Core Framework
- **Next.js 14** (App Router)
  - TypeScript for type safety
  - App directory structure
  - Server components where applicable

### UI & Styling
- **ShadCN/UI** for component library
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **Radix UI** primitives (via ShadCN)

### 3D Globe & Mapping
- **Mapbox GL JS** for globe rendering
- **React Map GL** for React integration
- **Three.js** (optional) for enhanced 3D effects

### Animations
- **Framer Motion** for all animations
  - Page transitions
  - Component animations
  - Gesture handling
  - Collaboration line animations

### State Management
- **Zustand** for global state management
- **React Hook Form** for form handling
- **Zod** for validation schemas

### Data & Utilities
- **Mock data generators** for stakeholder profiles
- **Date-fns** for date handling
- **clsx/cn** for conditional styling

## 📁 Project Structure

```
src/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   └── loading.tsx
├── components/
│   ├── ui/           # ShadCN components
│   ├── globe/        # Globe-related components
│   ├── onboarding/   # Onboarding flow
│   ├── profile/      # Profile panels
│   ├── feed/         # Feed components
│   └── layout/       # Layout components
├── lib/
│   ├── utils.ts
│   ├── validations.ts
│   ├── mock-data.ts
│   └── constants.ts
├── stores/
│   ├── onboarding-store.ts
│   ├── globe-store.ts
│   └── ui-store.ts
├── types/
│   └── index.ts
├── hooks/
│   ├── use-globe.ts
│   └── use-stakeholder.ts
└── data/
    ├── stakeholders.json
    ├── regions.json
    └── mock-feed.json
```

## 🎨 Component Architecture

### 1. Main Application Layout
```typescript
// app/layout.tsx
- Root layout with providers
- Global styles and fonts
- Motion config
- Zustand providers

// app/page.tsx
- Main application entry point
- Conditional rendering based on onboarding state
- Globe or onboarding component
```

### 2. Core Components

#### Globe Component (`components/globe/`)
```typescript
// GlobeContainer.tsx
- Mapbox integration
- 3D globe setup
- Stakeholder dot rendering
- Click event handling

// StakeholderDot.tsx
- Individual stakeholder markers
- Color coding by type
- Hover states
- Click animations

// CollaborationLines.tsx
- Animated connection lines
- Dynamic path calculation
- Framer Motion path animations
```

#### Onboarding Flow (`components/onboarding/`)
```typescript
// OnboardingWizard.tsx
- Multi-step form container
- Progress indicator
- Navigation controls

// StepOne.tsx - Stakeholder Type Selection
// StepTwo.tsx - Organization Details
// StepThree.tsx - Region & Location
// StepFour.tsx - Impact Metrics
// StepFive.tsx - Interests & Initiatives
```

#### Profile Panel (`components/profile/`)
```typescript
// ProfilePanel.tsx
- Sliding panel container
- Tab navigation
- Close functionality

// ProfileTab.tsx - Stakeholder details
// FeedTab.tsx - Activity feed
// AITab.tsx - AI recommendations
```

## 📊 Data Models

### Stakeholder Interface
```typescript
interface Stakeholder {
  id: string;
  type: 'entrepreneur' | 'university' | 'investor' | 'government' | 'corporate';
  name: string;
  organization: string;
  region: string;
  coordinates: [number, number]; // [lng, lat]
  impactMetrics: {
    funding?: number;
    employees?: number;
    studentsReached?: number;
    projectsCompleted?: number;
  };
  interests: string[];
  currentInitiatives: string[];
  connections: string[]; // Array of stakeholder IDs
  avatar?: string;
  description: string;
  contactInfo: {
    email?: string;
    linkedin?: string;
    website?: string;
  };
}
```

### Feed Post Interface
```typescript
interface FeedPost {
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

## 🚀 Implementation Phases

### Phase 1: Project Setup & Core Infrastructure (Week 1)

#### Day 1-2: Initial Setup
```bash
# Project initialization
npx create-next-app@latest stakeholder-globe --typescript --tailwind --app
cd stakeholder-globe

# Install dependencies
npm install @radix-ui/react-* lucide-react framer-motion
npm install mapbox-gl react-map-gl zustand react-hook-form zod
npm install date-fns clsx tailwind-merge

# ShadCN setup
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label select tabs
```

#### Day 3-4: Project Structure
- Set up folder structure
- Configure TypeScript paths
- Create base layouts and providers
- Set up Zustand stores
- Create type definitions

#### Day 5-7: Mock Data & Constants
- Generate stakeholder data (500+ entries)
- Create region mapping data
- Set up color schemes for stakeholder types
- Mock feed data generation
- AI recommendation algorithms (static)

### Phase 2: Onboarding Flow (Week 2)

#### Components to Build:
1. **OnboardingWizard** - Main container with stepper
2. **StepComponents** - Individual form steps
3. **Form Validation** - Zod schemas
4. **Progress Animation** - Framer Motion transitions

#### Key Features:
- Multi-step form with validation
- Smooth transitions between steps
- Data persistence in Zustand store
- Form state management with React Hook Form
- Responsive design for mobile/desktop

### Phase 3: Globe Implementation (Week 3-4)

#### Mapbox Integration:
```typescript
// Key configurations
const mapboxConfig = {
  style: 'mapbox://styles/mapbox/satellite-v9',
  projection: 'globe',
  center: [0, 20],
  zoom: 1.5,
  pitch: 0,
  bearing: 0
};
```

#### Globe Features:
1. **3D Globe Rendering**
   - Satellite or custom style
   - Smooth rotation and zoom
   - Responsive viewport handling

2. **Stakeholder Dots**
   - Color-coded by type (5 different colors)
   - Hover effects with Framer Motion
   - Click handling for profile panels
   - Clustering for high-density areas

3. **Interactive Controls**
   - Mouse/touch navigation
   - Zoom limits and constraints
   - Auto-rotation toggle

### Phase 4: Profile Panel System (Week 5)

#### Panel Architecture:
```typescript
// Animation configuration
const panelVariants = {
  hidden: { x: '100%', opacity: 0 },
  visible: { x: 0, opacity: 1 },
  exit: { x: '100%', opacity: 0 }
};
```

#### Features:
1. **Sliding Panel Animation**
   - Smooth slide-in from right
   - Backdrop blur effect
   - Mobile-responsive behavior

2. **Tab System**
   - Profile, Feed, AI Suggestions tabs
   - Smooth tab transitions
   - Content lazy loading

3. **Connection Lines**
   - Animated SVG paths to connected stakeholders
   - Dynamic path calculation
   - Staggered animation timing

### Phase 5: Feed & AI Recommendations (Week 6)

#### Feed Component:
- Infinite scroll simulation
- Post type variations
- Interactive elements (like, comment)
- Real-time timestamp formatting

#### AI Suggestions:
- Recommendation algorithm based on:
  - Stakeholder type compatibility
  - Geographic proximity
  - Interest overlap
  - Initiative alignment
- Confidence scoring
- Contact initiation flow

## 🎨 Animation Strategy

### Page Transitions
```typescript
// Framer Motion page variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};
```

### Globe Interactions
- **Dot Hover**: Scale + glow effect
- **Dot Click**: Pulse animation + panel slide
- **Connection Lines**: Path drawing animation
- **Auto-rotation**: Continuous transform

### UI Micro-interactions
- Button hover states
- Form field focus effects
- Loading states
- Success/error feedback

## 🎛 State Management Strategy

### Zustand Stores

#### OnboardingStore
```typescript
interface OnboardingState {
  currentStep: number;
  formData: Partial<Stakeholder>;
  isCompleted: boolean;
  actions: {
    nextStep: () => void;
    prevStep: () => void;
    updateFormData: (data: Partial<Stakeholder>) => void;
    completeOnboarding: () => void;
  };
}
```

#### GlobeStore
```typescript
interface GlobeState {
  stakeholders: Stakeholder[];
  selectedStakeholder: Stakeholder | null;
  isPanelOpen: boolean;
  activeTab: 'profile' | 'feed' | 'ai';
  globeSettings: {
    autoRotate: boolean;
    showConnections: boolean;
  };
  actions: {
    selectStakeholder: (id: string) => void;
    closePanel: () => void;
    setActiveTab: (tab: string) => void;
  };
}
```

## 📱 Responsive Design Strategy

### Breakpoints
- **Mobile**: 320px - 768px
- **Tablet**: 768px - 1024px
- **Desktop**: 1024px+

### Mobile Adaptations
1. **Globe**: Touch gestures, reduced dots for performance
2. **Panel**: Full-screen overlay instead of sidebar
3. **Onboarding**: Single-column layout
4. **Navigation**: Bottom tab bar

## ⚡ Performance Optimizations

### Globe Performance
- **Dot Clustering**: Reduce markers at low zoom levels
- **Level of Detail**: Simplified rendering for distant markers
- **Viewport Culling**: Only render visible stakeholders
- **Debounced Interactions**: Throttle hover/click events

### React Optimizations
- **Code Splitting**: Dynamic imports for heavy components
- **Memoization**: React.memo for expensive renders
- **Virtual Scrolling**: For feed component
- **Image Optimization**: Next.js Image component

## 🧪 Testing Strategy

### Unit Tests
- Component rendering
- Store actions and state updates
- Utility functions
- Form validation

### Integration Tests
- Onboarding flow completion
- Globe interaction workflows
- Panel opening/closing
- Data fetching and display

### E2E Tests
- Complete user journey
- Mobile responsiveness
- Performance benchmarks

## 🚀 Deployment Considerations

### Build Optimization
```javascript
// next.config.js
module.exports = {
  images: {
    domains: ['api.mapbox.com'],
  },
  env: {
    MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN,
  },
  experimental: {
    optimizeCss: true,
  },
};
```

### Environment Variables
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`
- `NEXT_PUBLIC_APP_URL`

## 📋 Development Checklist

### Week 1 ✅
- [ ] Project setup and configuration
- [ ] Folder structure and TypeScript setup
- [ ] Mock data generation
- [ ] Zustand stores implementation
- [ ] ShadCN component installation

### Week 2 ✅
- [ ] Onboarding wizard component
- [ ] Multi-step form with validation
- [ ] Form state management
- [ ] Smooth step transitions
- [ ] Mobile responsive forms

### Week 3 ✅
- [ ] Mapbox integration and globe setup
- [ ] Stakeholder dot rendering
- [ ] Color coding system
- [ ] Basic globe interactions
- [ ] Responsive globe viewport

### Week 4 ✅
- [ ] Click event handling
- [ ] Profile panel sliding animation
- [ ] Connection lines animation
- [ ] Globe auto-rotation feature
- [ ] Performance optimization

### Week 5 ✅
- [ ] Profile panel tabs system
- [ ] Feed component with mock data
- [ ] AI recommendations logic
- [ ] Contact interaction flows
- [ ] Mobile panel adaptations

### Week 6 ✅
- [ ] Final polish and animations
- [ ] Cross-browser testing
- [ ] Performance auditing
- [ ] Documentation completion
- [ ] Deployment preparation

## 🎯 Success Metrics

### Technical KPIs
- **Load Time**: < 3 seconds initial load
- **Globe FPS**: 60fps on desktop, 30fps mobile
- **Bundle Size**: < 2MB total JavaScript
- **Lighthouse Score**: 90+ across all metrics

### User Experience KPIs
- **Onboarding Completion**: > 80% completion rate
- **Globe Interaction**: Average 5+ dot clicks per session
- **Panel Engagement**: Average 30+ seconds in profile panels
- **Mobile Usage**: Smooth experience on devices 320px+

This implementation plan provides a comprehensive roadmap for building the Stakeholder-Network Globe with the specified technology stack, ensuring a polished and performant user experience. 