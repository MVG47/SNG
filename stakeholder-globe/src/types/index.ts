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

export interface Comment {
  id: string;
  authorId: string;
  content: string;
  timestamp: Date;
} 