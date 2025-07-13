# 07 - Mock Data Setup

## 🎯 Goal
Create comprehensive mock data generators for stakeholders, feed posts, and AI recommendations.

## 📋 Steps

### 1. Create Mock Data Generator Library
```typescript
// src/lib/mock-data.ts
import { Stakeholder, FeedPost } from '@/types';
import { nanoid } from 'nanoid';

// Sample data arrays
const firstNames = [
  'Alex', 'Sarah', 'Michael', 'Emma', 'James', 'Lisa', 'David', 'Anna',
  'Robert', 'Maria', 'John', 'Jennifer', 'William', 'Patricia', 'Richard',
  'Linda', 'Thomas', 'Elizabeth', 'Christopher', 'Barbara', 'Daniel', 'Susan'
];

const lastNames = [
  'Johnson', 'Smith', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor',
  'Anderson', 'Thomas', 'Jackson', 'White', 'Harris', 'Martin', 'Thompson',
  'Garcia', 'Martinez', 'Robinson', 'Clark', 'Rodriguez', 'Lewis', 'Lee'
];

const organizations = {
  entrepreneur: [
    'TechStart Inc', 'InnovateCorp', 'NextGen Solutions', 'FutureBuilders',
    'Digital Pioneers', 'Smart Ventures', 'EcoTech Labs', 'AIFirst Inc',
    'HealthTech Innovations', 'FinTech Solutions', 'EdTech Builders'
  ],
  university: [
    'MIT', 'Stanford University', 'Harvard University', 'Oxford University',
    'Cambridge University', 'ETH Zurich', 'UC Berkeley', 'Caltech',
    'Imperial College London', 'University of Toronto', 'NUS Singapore'
  ],
  investor: [
    'Venture Capital Partners', 'Angel Investments Fund', 'Growth Equity LLC',
    'Seed Stage Ventures', 'Series A Capital', 'Tech Investment Group',
    'Innovation Fund Partners', 'Future Capital', 'Impact Investors'
  ],
  government: [
    'Department of Innovation', 'Economic Development Agency', 'Ministry of Technology',
    'Innovation Council', 'Smart City Initiative', 'Digital Government Office',
    'Research Funding Agency', 'Technology Policy Department'
  ],
  corporate: [
    'Google', 'Microsoft', 'Apple', 'Amazon', 'Tesla', 'Meta', 'IBM',
    'Salesforce', 'Adobe', 'Intel', 'NVIDIA', 'Cisco', 'Oracle'
  ]
};

const interests = [
  'AI/Machine Learning', 'Sustainability', 'FinTech', 'HealthTech', 'EdTech',
  'Climate Change', 'Social Impact', 'Blockchain', 'IoT', 'Renewable Energy',
  'Cybersecurity', 'Data Science', 'Robotics', 'Biotechnology', 'Clean Energy',
  'Smart Cities', 'Digital Health', 'Space Technology', 'Quantum Computing'
];

const regions = [
  { name: 'North America', coords: [-100, 45], countries: ['USA', 'Canada', 'Mexico'] },
  { name: 'Europe', coords: [10, 50], countries: ['UK', 'Germany', 'France', 'Netherlands', 'Switzerland'] },
  { name: 'Asia', coords: [100, 30], countries: ['China', 'Japan', 'Singapore', 'India', 'South Korea'] },
  { name: 'Africa', coords: [20, 0], countries: ['South Africa', 'Nigeria', 'Kenya', 'Egypt'] },
  { name: 'South America', coords: [-60, -15], countries: ['Brazil', 'Argentina', 'Chile', 'Colombia'] },
  { name: 'Australia/Oceania', coords: [140, -25], countries: ['Australia', 'New Zealand'] }
];

// Utility functions
function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function getRandomElements<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generateCoordinates(baseCoords: [number, number]): [number, number] {
  return [
    baseCoords[0] + (Math.random() - 0.5) * 60,
    baseCoords[1] + (Math.random() - 0.5) * 40
  ];
}

function generateName(): string {
  return `${getRandomElement(firstNames)} ${getRandomElement(lastNames)}`;
}

function generateEmail(name: string): string {
  return name.toLowerCase().replace(' ', '.') + '@' + 
    getRandomElement(['gmail.com', 'outlook.com', 'company.com', 'university.edu']);
}
```

### 2. Stakeholder Data Generator
```typescript
// Continue in src/lib/mock-data.ts

export function generateMockStakeholder(type?: Stakeholder['type']): Stakeholder {
  const stakeholderType = type || getRandomElement([
    'entrepreneur', 'university', 'investor', 'government', 'corporate'
  ] as const);
  
  const name = generateName();
  const region = getRandomElement(regions);
  const selectedInterests = getRandomElements(interests, Math.floor(Math.random() * 5) + 2);
  
  // Generate type-specific metrics
  const generateMetrics = () => {
    switch (stakeholderType) {
      case 'entrepreneur':
        return {
          funding: Math.floor(Math.random() * 50000000) + 100000,
          employees: Math.floor(Math.random() * 500) + 5,
          projectsCompleted: Math.floor(Math.random() * 20) + 1
        };
      case 'university':
        return {
          studentsReached: Math.floor(Math.random() * 100000) + 1000,
          projectsCompleted: Math.floor(Math.random() * 50) + 5,
          employees: Math.floor(Math.random() * 1000) + 100
        };
      case 'investor':
        return {
          funding: Math.floor(Math.random() * 500000000) + 1000000,
          projectsCompleted: Math.floor(Math.random() * 100) + 10
        };
      case 'government':
        return {
          projectsCompleted: Math.floor(Math.random() * 30) + 5,
          employees: Math.floor(Math.random() * 2000) + 50
        };
      case 'corporate':
        return {
          employees: Math.floor(Math.random() * 100000) + 1000,
          funding: Math.floor(Math.random() * 1000000000) + 10000000,
          projectsCompleted: Math.floor(Math.random() * 100) + 20
        };
      default:
        return {};
    }
  };
  
  return {
    id: nanoid(),
    type: stakeholderType,
    name,
    organization: getRandomElement(organizations[stakeholderType]),
    region: region.name,
    coordinates: generateCoordinates(region.coords as [number, number]),
    impactMetrics: generateMetrics(),
    interests: selectedInterests,
    currentInitiatives: [
      'Expanding global partnerships',
      'Developing innovative solutions',
      'Building sustainable practices',
      'Fostering community engagement'
    ].slice(0, Math.floor(Math.random() * 3) + 1),
    connections: [], // Will be populated after generation
    description: `Experienced ${stakeholderType} focused on ${selectedInterests[0].toLowerCase()} and ${selectedInterests[1]?.toLowerCase() || 'innovation'}. Committed to driving positive impact through technology and collaboration.`,
    contactInfo: {
      email: generateEmail(name),
      linkedin: `linkedin.com/in/${name.toLowerCase().replace(' ', '-')}`,
      website: stakeholderType === 'corporate' ? `${name.toLowerCase().replace(' ', '')}.com` : undefined
    }
  };
}

export function generateMockStakeholders(count: number): Stakeholder[] {
  const stakeholders: Stakeholder[] = [];
  const types: Stakeholder['type'][] = ['entrepreneur', 'university', 'investor', 'government', 'corporate'];
  
  // Ensure balanced distribution
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length];
    stakeholders.push(generateMockStakeholder(type));
  }
  
  // Create realistic connections
  stakeholders.forEach((stakeholder, index) => {
    const connectionCount = Math.floor(Math.random() * 8) + 2;
    const potentialConnections = stakeholders
      .filter((s, i) => i !== index)
      .sort(() => 0.5 - Math.random())
      .slice(0, connectionCount);
    
    stakeholder.connections = potentialConnections.map(c => c.id);
  });
  
  return stakeholders;
}
```

### 3. Feed Posts Generator
```typescript
// Continue in src/lib/mock-data.ts

const postTemplates = {
  update: [
    "Just completed our quarterly review. Excited about the progress on {project}!",
    "Working hard on {initiative}. The team is making great strides!",
    "Milestone achieved! Our {project} is now in the next phase.",
    "Reflecting on our journey with {initiative}. Proud of what we've accomplished."
  ],
  opportunity: [
    "Looking for passionate {type}s interested in {interest}. Let's connect!",
    "Seeking partnerships in {interest}. Great opportunities ahead!",
    "Open to collaborations on {project}. Reach out if interested!",
    "Exciting opportunities in {interest}. Who wants to build the future together?"
  ],
  achievement: [
    "Thrilled to announce our latest partnership in {interest}! 🎉",
    "Proud to share that we've reached {metric} milestone!",
    "Celebrating our success with {project}. Thank you to everyone involved!",
    "Major achievement unlocked! Our work in {interest} is paying off."
  ],
  collaboration: [
    "Starting a new collaboration with {organization}. Exciting times ahead!",
    "Partnering with amazing {type}s to drive innovation in {interest}.",
    "New alliance formed! Working together on {project}.",
    "Collaboration announcement: joining forces to tackle {interest}."
  ]
};

export function generateMockFeedPost(authorId: string, stakeholder: Stakeholder): FeedPost {
  const postType = getRandomElement(['update', 'opportunity', 'achievement', 'collaboration'] as const);
  const template = getRandomElement(postTemplates[postType]);
  
  // Replace placeholders
  let content = template
    .replace('{project}', getRandomElement(['AI platform', 'sustainability initiative', 'research project', 'innovation lab']))
    .replace('{initiative}', getRandomElement(['green technology', 'digital transformation', 'community outreach', 'research program']))
    .replace('{type}', getRandomElement(['entrepreneur', 'researcher', 'investor', 'innovator']))
    .replace('{interest}', getRandomElement(stakeholder.interests))
    .replace('{organization}', getRandomElement(organizations[stakeholder.type]))
    .replace('{metric}', getRandomElement(['1M users', '10K students', '$5M funding', '100 projects']));
  
  return {
    id: nanoid(),
    authorId,
    content,
    timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Within last 30 days
    type: postType,
    likes: Math.floor(Math.random() * 100) + 1,
    comments: Array.from({ length: Math.floor(Math.random() * 10) }, () => ({
      id: nanoid(),
      authorId: nanoid(),
      content: getRandomElement([
        'Great work!', 'Congratulations!', 'Excited to see this!',
        'Love the initiative!', 'Keep it up!', 'Amazing progress!'
      ]),
      timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000)
    }))
  };
}

export function generateMockFeedPosts(stakeholders: Stakeholder[], count: number): FeedPost[] {
  const posts: FeedPost[] = [];
  
  for (let i = 0; i < count; i++) {
    const author = getRandomElement(stakeholders);
    posts.push(generateMockFeedPost(author.id, author));
  }
  
  return posts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}
```

### 4. AI Recommendations Generator
```typescript
// Continue in src/lib/mock-data.ts

export function generateAIRecommendations(
  currentStakeholder: Stakeholder,
  allStakeholders: Stakeholder[]
): Stakeholder[] {
  const recommendations = allStakeholders
    .filter(s => s.id !== currentStakeholder.id)
    .map(stakeholder => {
      let score = 0;
      
      // Interest overlap scoring
      const commonInterests = stakeholder.interests.filter(interest =>
        currentStakeholder.interests.includes(interest)
      );
      score += commonInterests.length * 20;
      
      // Type compatibility scoring
      const typeCompatibility = {
        entrepreneur: ['investor', 'university', 'government'],
        investor: ['entrepreneur', 'corporate'],
        university: ['entrepreneur', 'government', 'corporate'],
        government: ['entrepreneur', 'university', 'corporate'],
        corporate: ['entrepreneur', 'university', 'investor']
      };
      
      if (typeCompatibility[currentStakeholder.type]?.includes(stakeholder.type)) {
        score += 30;
      }
      
      // Regional bonus
      if (stakeholder.region === currentStakeholder.region) {
        score += 15;
      }
      
      // Random factor for variety
      score += Math.random() * 20;
      
      return {
        ...stakeholder,
        matchScore: Math.min(Math.round(score), 100)
      };
    })
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
    .slice(0, 5);
  
  return recommendations;
}
```

### 5. Data Initialization Hook
```typescript
// src/hooks/use-mock-data.ts
import { useEffect } from 'react';
import { useGlobeStore } from '@/stores/globe-store';
import { generateMockStakeholders, generateMockFeedPosts } from '@/lib/mock-data';

export function useMockData() {
  const { setStakeholders } = useGlobeStore();
  
  useEffect(() => {
    // Generate stakeholders
    const stakeholders = generateMockStakeholders(500);
    setStakeholders(stakeholders);
    
    // Generate feed posts
    const feedPosts = generateMockFeedPosts(stakeholders, 100);
    
    // Store in localStorage for persistence
    localStorage.setItem('mock-stakeholders', JSON.stringify(stakeholders));
    localStorage.setItem('mock-feed-posts', JSON.stringify(feedPosts));
  }, [setStakeholders]);
}
```

### 6. Data Export for Development
```typescript
// src/lib/export-mock-data.ts
import { generateMockStakeholders, generateMockFeedPosts } from './mock-data';
import fs from 'fs';
import path from 'path';

export function exportMockDataToFiles() {
  const stakeholders = generateMockStakeholders(500);
  const feedPosts = generateMockFeedPosts(stakeholders, 200);
  
  // Export to JSON files for development
  const dataDir = path.join(process.cwd(), 'src/data');
  
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(dataDir, 'stakeholders.json'),
    JSON.stringify(stakeholders, null, 2)
  );
  
  fs.writeFileSync(
    path.join(dataDir, 'feed-posts.json'),
    JSON.stringify(feedPosts, null, 2)
  );
  
  console.log('Mock data exported successfully!');
}

// Run this during development: node -e "require('./src/lib/export-mock-data').exportMockDataToFiles()"
```

### 7. Regional Data Configuration
```typescript
// src/lib/regional-data.ts
export const regionMapping = {
  'North America': {
    countries: ['United States', 'Canada', 'Mexico'],
    timezones: ['EST', 'PST', 'CST', 'MST'],
    coordinates: [-100, 45],
    color: '#3B82F6'
  },
  'Europe': {
    countries: ['United Kingdom', 'Germany', 'France', 'Netherlands', 'Switzerland'],
    timezones: ['GMT', 'CET'],
    coordinates: [10, 50],
    color: '#10B981'
  },
  'Asia': {
    countries: ['China', 'Japan', 'Singapore', 'India', 'South Korea'],
    timezones: ['JST', 'CST', 'IST'],
    coordinates: [100, 30],
    color: '#F59E0B'
  },
  'Africa': {
    countries: ['South Africa', 'Nigeria', 'Kenya', 'Egypt'],
    timezones: ['SAST', 'WAT', 'EAT'],
    coordinates: [20, 0],
    color: '#EF4444'
  },
  'South America': {
    countries: ['Brazil', 'Argentina', 'Chile', 'Colombia'],
    timezones: ['BRT', 'ART'],
    coordinates: [-60, -15],
    color: '#8B5CF6'
  },
  'Australia/Oceania': {
    countries: ['Australia', 'New Zealand'],
    timezones: ['AEST', 'NZST'],
    coordinates: [140, -25],
    color: '#EC4899'
  }
};

export function getRegionData(regionName: string) {
  return regionMapping[regionName as keyof typeof regionMapping];
}
```

## ✅ Verification
- [ ] Mock stakeholders generate with realistic data
- [ ] Feed posts have varied content and timestamps
- [ ] AI recommendations score appropriately
- [ ] Regional distribution is balanced
- [ ] Data persists across sessions
- [ ] Export functionality works for development
- [ ] Performance is acceptable with 500+ stakeholders 