import { Stakeholder } from '@/types';
import { nanoid } from 'nanoid';

const names = [
  'Alex Johnson', 'Sarah Chen', 'Michael Brown', 'Emma Davis',
  'James Wilson', 'Lisa Garcia', 'David Miller', 'Anna Martinez',
  'Robert Taylor', 'Maria Rodriguez', 'John Anderson', 'Jennifer Lee'
];

const organizations = {
  entrepreneur: ['TechStart Inc', 'InnovateCorp', 'NextGen Solutions', 'FutureBuilders'],
  university: ['MIT', 'Stanford University', 'Oxford University', 'ETH Zurich'],
  investor: ['Venture Capital Partners', 'Angel Investments', 'Growth Fund LLC'],
  government: ['Department of Innovation', 'Economic Development Agency'],
  corporate: ['Google', 'Microsoft', 'Apple', 'Amazon', 'Tesla']
};

const interests = [
  'AI/Machine Learning', 'Sustainability', 'FinTech', 'HealthTech',
  'EdTech', 'Climate Change', 'Social Impact', 'Blockchain'
];

interface Region {
  name: string;
  cities: Array<{
    name: string;
    coords: [number, number];
  }>;
}

const regions: Region[] = [
  { 
    name: 'North America', 
    cities: [
      { name: 'New York', coords: [-74.0060, 40.7128] },
      { name: 'Los Angeles', coords: [-118.2437, 34.0522] },
      { name: 'Chicago', coords: [-87.6298, 41.8781] },
      { name: 'Toronto', coords: [-79.3832, 43.6532] },
      { name: 'San Francisco', coords: [-122.4194, 37.7749] },
      { name: 'Boston', coords: [-71.0588, 42.3601] },
      { name: 'Seattle', coords: [-122.3321, 47.6062] },
      { name: 'Vancouver', coords: [-123.1207, 49.2827] },
      { name: 'Dallas', coords: [-96.7969, 32.7767] },
      { name: 'Denver', coords: [-104.9903, 39.7392] },
      { name: 'Atlanta', coords: [-84.3880, 33.7490] },
      { name: 'Miami', coords: [-80.1918, 25.7617] },
      { name: 'Montreal', coords: [-73.5673, 45.5017] },
      { name: 'Phoenix', coords: [-112.0740, 33.4484] },
      { name: 'Austin', coords: [-97.7431, 30.2672] }
    ]
  },
  { 
    name: 'Europe', 
    cities: [
      { name: 'London', coords: [-0.1278, 51.5074] },
      { name: 'Paris', coords: [2.3522, 48.8566] },
      { name: 'Berlin', coords: [13.4050, 52.5200] },
      { name: 'Madrid', coords: [-3.7038, 40.4168] },
      { name: 'Rome', coords: [12.4964, 41.9028] },
      { name: 'Amsterdam', coords: [4.9041, 52.3676] },
      { name: 'Zurich', coords: [8.5417, 47.3769] },
      { name: 'Stockholm', coords: [18.0686, 59.3293] },
      { name: 'Vienna', coords: [16.3738, 48.2082] },
      { name: 'Barcelona', coords: [2.1734, 41.3851] },
      { name: 'Munich', coords: [11.5820, 48.1351] },
      { name: 'Copenhagen', coords: [12.5683, 55.6761] },
      { name: 'Dublin', coords: [-6.2603, 53.3498] },
      { name: 'Brussels', coords: [4.3517, 50.8503] },
      { name: 'Prague', coords: [14.4378, 50.0755] }
    ]
  },
  { 
    name: 'Asia', 
    cities: [
      { name: 'Tokyo', coords: [139.6917, 35.6895] },
      { name: 'Shanghai', coords: [121.4737, 31.2304] },
      { name: 'Beijing', coords: [116.4074, 39.9042] },
      { name: 'Mumbai', coords: [72.8777, 19.0760] },
      { name: 'Delhi', coords: [77.1025, 28.7041] },
      { name: 'Seoul', coords: [126.9780, 37.5665] },
      { name: 'Singapore', coords: [103.8198, 1.3521] },
      { name: 'Hong Kong', coords: [114.1694, 22.3193] },
      { name: 'Bangkok', coords: [100.5018, 13.7563] },
      { name: 'Jakarta', coords: [106.8650, -6.2088] },
      { name: 'Kuala Lumpur', coords: [101.6869, 3.1390] },
      { name: 'Manila', coords: [120.9842, 14.5995] },
      { name: 'Bangalore', coords: [77.5946, 12.9716] },
      { name: 'Tel Aviv', coords: [34.7818, 32.0853] },
      { name: 'Dubai', coords: [55.2708, 25.2048] }
    ]
  },
  { 
    name: 'Africa', 
    cities: [
      { name: 'Cairo', coords: [31.2357, 30.0444] },
      { name: 'Lagos', coords: [3.3792, 6.5244] },
      { name: 'Johannesburg', coords: [28.0473, -26.2041] },
      { name: 'Nairobi', coords: [36.8219, -1.2921] },
      { name: 'Cape Town', coords: [18.4241, -33.9249] },
      { name: 'Casablanca', coords: [-7.5898, 33.5731] },
      { name: 'Addis Ababa', coords: [38.7469, 9.1450] },
      { name: 'Accra', coords: [-0.1870, 5.6037] },
      { name: 'Tunis', coords: [10.1815, 36.8065] },
      { name: 'Dakar', coords: [-17.4441, 14.6928] },
      { name: 'Khartoum', coords: [32.5599, 15.5007] },
      { name: 'Kampala', coords: [32.5825, 0.3476] },
      { name: 'Dar es Salaam', coords: [39.2083, -6.7924] },
      { name: 'Abidjan', coords: [-4.0435, 5.3600] },
      { name: 'Algiers', coords: [3.0588, 36.7538] }
    ]
  },
  { 
    name: 'South America', 
    cities: [
      { name: 'São Paulo', coords: [-46.6333, -23.5505] },
      { name: 'Buenos Aires', coords: [-58.3816, -34.6037] },
      { name: 'Rio de Janeiro', coords: [-43.1729, -22.9068] },
      { name: 'Lima', coords: [-77.0428, -12.0464] },
      { name: 'Bogotá', coords: [-74.0721, 4.7110] },
      { name: 'Santiago', coords: [-70.6693, -33.4489] },
      { name: 'Caracas', coords: [-66.9036, 10.4806] },
      { name: 'Montevideo', coords: [-56.1645, -34.9011] },
      { name: 'Quito', coords: [-78.4678, -0.1807] },
      { name: 'La Paz', coords: [-68.1193, -16.4897] },
      { name: 'Brasília', coords: [-47.8825, -15.7975] },
      { name: 'Medellín', coords: [-75.5812, 6.2442] },
      { name: 'Recife', coords: [-34.8813, -8.0476] },
      { name: 'Fortaleza', coords: [-38.5434, -3.7319] },
      { name: 'Curitiba', coords: [-49.2731, -25.4284] }
    ]
  },
  { 
    name: 'Australia/Oceania', 
    cities: [
      { name: 'Sydney', coords: [151.2093, -33.8688] },
      { name: 'Melbourne', coords: [144.9631, -37.8136] },
      { name: 'Brisbane', coords: [153.0251, -27.4698] },
      { name: 'Perth', coords: [115.8605, -31.9505] },
      { name: 'Auckland', coords: [174.7633, -36.8485] },
      { name: 'Adelaide', coords: [138.6007, -34.9285] },
      { name: 'Wellington', coords: [174.7762, -41.2865] },
      { name: 'Canberra', coords: [149.1300, -35.2809] },
      { name: 'Gold Coast', coords: [153.4000, -28.0167] },
      { name: 'Christchurch', coords: [172.6362, -43.5321] },
      { name: 'Darwin', coords: [130.8456, -12.4634] },
      { name: 'Hobart', coords: [147.3257, -42.8821] },
      { name: 'Suva', coords: [178.4419, -18.1248] },
      { name: 'Port Moresby', coords: [147.1925, -9.4438] },
      { name: 'Noumea', coords: [166.4572, -22.2758] }
    ]
  }
];

function getRandomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

function generateCoordinates(region: Region): [number, number] {
  const randomCity = getRandomElement(region.cities);
  return randomCity.coords;
}

export function generateMockStakeholders(count: number): Stakeholder[] {
  const stakeholders: Stakeholder[] = [];
  const types: Stakeholder['type'][] = ['entrepreneur', 'university', 'investor', 'government', 'corporate'];
  
  for (let i = 0; i < count; i++) {
    const type = getRandomElement(types);
    const region = getRandomElement(regions);
    const stakeholder: Stakeholder = {
      id: nanoid(),
      type,
      name: getRandomElement(names),
      organization: getRandomElement(organizations[type]),
      region: region.name,
      coordinates: generateCoordinates(region),
      impactMetrics: {
        funding: type === 'entrepreneur' || type === 'investor' ? Math.floor(Math.random() * 10000000) : undefined,
        employees: type === 'entrepreneur' || type === 'corporate' ? Math.floor(Math.random() * 1000) : undefined,
        studentsReached: type === 'university' ? Math.floor(Math.random() * 50000) : undefined,
        projectsCompleted: Math.floor(Math.random() * 50),
      },
      interests: Array.from(new Set([
        getRandomElement(interests),
        getRandomElement(interests),
        getRandomElement(interests)
      ])),
      currentInitiatives: [
        'Working on innovative solutions',
        'Building partnerships globally',
        'Scaling operations'
      ],
      connections: [], // Will be populated after all stakeholders are created
      description: `Experienced ${type} focused on driving innovation and creating positive impact through technology and collaboration.`,
      contactInfo: {
        email: `${getRandomElement(names).toLowerCase().replace(' ', '.')}@example.com`,
        linkedin: `linkedin.com/in/${getRandomElement(names).toLowerCase().replace(' ', '-')}`,
      }
    };
    
    stakeholders.push(stakeholder);
  }
  
  // Create random connections
  stakeholders.forEach(stakeholder => {
    const connectionCount = Math.floor(Math.random() * 5) + 1;
    const potentialConnections = stakeholders
      .filter(s => s.id !== stakeholder.id)
      .sort(() => 0.5 - Math.random())
      .slice(0, connectionCount);
    
    stakeholder.connections = potentialConnections.map(c => c.id);
  });
  
  return stakeholders;
} 