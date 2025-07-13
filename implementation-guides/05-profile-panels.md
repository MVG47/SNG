# 05 - Profile Panel System

## 🎯 Goal
Create sliding profile panels with tabbed content for stakeholder details, feed, and AI recommendations.

## 📋 Steps

### 1. Create Main Profile Panel Container
```typescript
// src/components/profile/profile-panel.tsx
'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useGlobe } from '@/hooks/use-globe';
import { useStakeholder } from '@/hooks/use-stakeholder';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { X } from 'lucide-react';
import ProfileTab from './profile-tab';
import FeedTab from './feed-tab';
import AITab from './ai-tab';

const panelVariants = {
  hidden: { 
    x: '100%', 
    opacity: 0,
    transition: { duration: 0.3, ease: 'easeInOut' }
  },
  visible: { 
    x: 0, 
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeInOut' }
  }
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 }
};

export default function ProfilePanel() {
  const { isPanelOpen, activeTab, closePanel, setActiveTab } = useGlobe();
  const { selectedStakeholder } = useStakeholder();
  
  if (!selectedStakeholder) return null;
  
  return (
    <AnimatePresence>
      {isPanelOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
            onClick={closePanel}
          />
          
          {/* Panel */}
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed right-0 top-0 h-full w-full lg:w-96 bg-white shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-900">
                Stakeholder Profile
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={closePanel}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
              <TabsList className="w-full grid grid-cols-3 rounded-none border-b">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="feed">Feed</TabsTrigger> 
                <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
              </TabsList>
              
              <div className="flex-1 overflow-y-auto">
                <TabsContent value="profile" className="mt-0 h-full">
                  <ProfileTab stakeholder={selectedStakeholder} />
                </TabsContent>
                
                <TabsContent value="feed" className="mt-0 h-full">
                  <FeedTab stakeholder={selectedStakeholder} />
                </TabsContent>
                
                <TabsContent value="ai" className="mt-0 h-full">
                  <AITab stakeholder={selectedStakeholder} />
                </TabsContent>
              </div>
            </Tabs>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
```

### 2. Create Profile Tab Component
```typescript
// src/components/profile/profile-tab.tsx
'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Stakeholder } from '@/types';
import { 
  MapPin, 
  Building, 
  Mail, 
  Linkedin, 
  Users,
  DollarSign,
  GraduationCap,
  Target
} from 'lucide-react';
import { stakeholderColors } from '@/lib/utils';

interface ProfileTabProps {
  stakeholder: Stakeholder;
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5 }
  })
};

export default function ProfileTab({ stakeholder }: ProfileTabProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };
  
  const formatMetric = (value: number) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toString();
  };
  
  return (
    <div className="p-6 space-y-6">
      {/* Profile Header */}
      <motion.div
        custom={0}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="text-center"
      >
        <Avatar className="w-20 h-20 mx-auto mb-4">
          <AvatarImage src={stakeholder.avatar} />
          <AvatarFallback 
            className="text-lg font-semibold"
            style={{ backgroundColor: stakeholderColors[stakeholder.type] + '20' }}
          >
            {getInitials(stakeholder.name)}
          </AvatarFallback>
        </Avatar>
        
        <h3 className="text-xl font-bold text-gray-900 mb-1">
          {stakeholder.name}
        </h3>
        
        <p className="text-gray-600 mb-3">{stakeholder.organization}</p>
        
        <Badge 
          className="capitalize"
          style={{ 
            backgroundColor: stakeholderColors[stakeholder.type],
            color: 'white'
          }}
        >
          {stakeholder.type}
        </Badge>
      </motion.div>
      
      {/* Location & Basic Info */}
      <motion.div
        custom={1}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <MapPin className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{stakeholder.region}</span>
            </div>
            <div className="flex items-center gap-3">
              <Building className="w-4 h-4 text-gray-500" />
              <span className="text-sm">{stakeholder.organization}</span>
            </div>
          </div>
        </Card>
      </motion.div>
      
      {/* Description */}
      <motion.div
        custom={2}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="p-4">
          <h4 className="font-semibold mb-2">About</h4>
          <p className="text-sm text-gray-600">{stakeholder.description}</p>
        </Card>
      </motion.div>
      
      {/* Impact Metrics */}
      <motion.div
        custom={3}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Impact Metrics</h4>
          <div className="grid grid-cols-2 gap-4">
            {stakeholder.impactMetrics.funding && (
              <div className="text-center">
                <DollarSign className="w-6 h-6 mx-auto mb-1 text-green-600" />
                <div className="text-lg font-bold text-gray-900">
                  ${formatMetric(stakeholder.impactMetrics.funding)}
                </div>
                <div className="text-xs text-gray-500">Funding</div>
              </div>
            )}
            
            {stakeholder.impactMetrics.employees && (
              <div className="text-center">
                <Users className="w-6 h-6 mx-auto mb-1 text-blue-600" />
                <div className="text-lg font-bold text-gray-900">
                  {formatMetric(stakeholder.impactMetrics.employees)}
                </div>
                <div className="text-xs text-gray-500">Employees</div>
              </div>
            )}
            
            {stakeholder.impactMetrics.studentsReached && (
              <div className="text-center">
                <GraduationCap className="w-6 h-6 mx-auto mb-1 text-purple-600" />
                <div className="text-lg font-bold text-gray-900">
                  {formatMetric(stakeholder.impactMetrics.studentsReached)}
                </div>
                <div className="text-xs text-gray-500">Students</div>
              </div>
            )}
            
            {stakeholder.impactMetrics.projectsCompleted && (
              <div className="text-center">
                <Target className="w-6 h-6 mx-auto mb-1 text-orange-600" />
                <div className="text-lg font-bold text-gray-900">
                  {stakeholder.impactMetrics.projectsCompleted}
                </div>
                <div className="text-xs text-gray-500">Projects</div>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
      
      {/* Interests */}
      <motion.div
        custom={4}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Interests</h4>
          <div className="flex flex-wrap gap-2">
            {stakeholder.interests.map((interest, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </Card>
      </motion.div>
      
      {/* Current Initiatives */}
      <motion.div
        custom={5}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="p-4">
          <h4 className="font-semibold mb-3">Current Initiatives</h4>
          <ul className="space-y-2">
            {stakeholder.currentInitiatives.map((initiative, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
                {initiative}
              </li>
            ))}
          </ul>
        </Card>
      </motion.div>
      
      {/* Contact Actions */}
      <motion.div
        custom={6}
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {stakeholder.contactInfo.email && (
          <Button className="w-full" variant="outline">
            <Mail className="w-4 h-4 mr-2" />
            Send Email
          </Button>
        )}
        
        {stakeholder.contactInfo.linkedin && (
          <Button className="w-full" variant="outline">
            <Linkedin className="w-4 h-4 mr-2" />
            Connect on LinkedIn
          </Button>
        )}
        
        <Button className="w-full">
          Request Introduction
        </Button>
      </motion.div>
    </div>
  );
}
```

### 3. Create Feed Tab Component
```typescript
// src/components/profile/feed-tab.tsx
'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stakeholder } from '@/types';
import { Heart, MessageCircle, Share, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface FeedTabProps {
  stakeholder: Stakeholder;
}

// Mock feed data
const mockPosts = [
  {
    id: '1',
    content: 'Excited to announce our latest partnership with local universities to promote innovation in sustainable technology! 🌱',
    type: 'achievement' as const,
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    likes: 24,
    comments: 5
  },
  {
    id: '2', 
    content: 'Looking for passionate entrepreneurs interested in climate tech solutions. Let\'s connect and build the future together!',
    type: 'opportunity' as const,
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    likes: 18,
    comments: 12
  },
  {
    id: '3',
    content: 'Just completed our quarterly review. Proud of the team\'s progress on our AI-driven sustainability platform.',
    type: 'update' as const,
    timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    likes: 31,
    comments: 8
  }
];

const postTypeColors = {
  update: 'bg-blue-100 text-blue-800',
  opportunity: 'bg-green-100 text-green-800', 
  achievement: 'bg-purple-100 text-purple-800',
  collaboration: 'bg-orange-100 text-orange-800'
};

export default function FeedTab({ stakeholder }: FeedTabProps) {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };
  
  return (
    <div className="p-6">
      <div className="space-y-4">
        {mockPosts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="text-sm font-semibold">
                    {getInitials(stakeholder.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm">{stakeholder.name}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${postTypeColors[post.type]}`}>
                      {post.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Clock className="w-3 h-3" />
                    {formatDistanceToNow(post.timestamp, { addSuffix: true })}
                  </div>
                </div>
              </div>
              
              {/* Post Content */}
              <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                {post.content}
              </p>
              
              {/* Post Actions */}
              <div className="flex items-center gap-4 pt-3 border-t">
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <Heart className="w-4 h-4" />
                  <span className="text-xs">{post.likes}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-xs">{post.comments}</span>
                </Button>
                
                <Button variant="ghost" size="sm" className="flex items-center gap-1 ml-auto">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
        
        {/* Load More */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center pt-4"
        >
          <Button variant="outline" className="w-full">
            Load More Posts
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
```

### 4. Create AI Suggestions Tab
```typescript
// src/components/profile/ai-tab.tsx
'use client';

import { motion } from 'framer-motion';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stakeholder } from '@/types';
import { Brain, Star, TrendingUp, Users } from 'lucide-react';

interface AITabProps {
  stakeholder: Stakeholder;
}

// Mock AI suggestions based on stakeholder type and interests
const generateAISuggestions = (stakeholder: Stakeholder) => {
  const suggestions = [
    {
      id: '1',
      name: 'Dr. Sarah Chen',
      organization: 'MIT Climate Lab',
      type: 'university' as const,
      matchScore: 92,
      reason: 'Shared interest in AI/Machine Learning and Sustainability',
      mutualConnections: 3,
      recentActivity: 'Published research on AI-driven carbon reduction'
    },
    {
      id: '2', 
      name: 'Michael Torres',
      organization: 'GreenTech Ventures',
      type: 'investor' as const,
      matchScore: 88,
      reason: 'Active investor in FinTech and Climate Change solutions',
      mutualConnections: 5,
      recentActivity: 'Led $2M seed round in sustainable energy startup'
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      organization: 'Innovation Department',
      type: 'government' as const,
      matchScore: 85,
      reason: 'Leading government initiatives in Social Impact technology',
      mutualConnections: 2,
      recentActivity: 'Launched new public-private partnership program'
    }
  ];
  
  return suggestions;
};

export default function AITab({ stakeholder }: AITabProps) {
  const suggestions = generateAISuggestions(stakeholder);
  
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };
  
  const getTypeColor = (type: string) => {
    const colors = {
      entrepreneur: 'bg-green-100 text-green-800',
      university: 'bg-blue-100 text-blue-800',
      investor: 'bg-yellow-100 text-yellow-800',
      government: 'bg-red-100 text-red-800',
      corporate: 'bg-purple-100 text-purple-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="p-6">
      {/* AI Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6"
      >
        <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border mb-3">
          <Brain className="w-5 h-5 text-blue-600" />
          <span className="text-sm font-medium text-gray-700">AI-Powered Recommendations</span>
        </div>
        
        <p className="text-xs text-gray-600">
          Based on your interests, type, and network activity
        </p>
      </motion.div>
      
      {/* Suggestions List */}
      <div className="space-y-4">
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4 hover:shadow-md transition-shadow">
              {/* Suggestion Header */}
              <div className="flex items-start gap-3 mb-3">
                <Avatar className="w-12 h-12">
                  <AvatarFallback className="text-sm font-semibold">
                    {getInitials(suggestion.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-sm">{suggestion.name}</h4>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500 fill-current" />
                      <span className="text-xs font-medium text-gray-700">
                        {suggestion.matchScore}%
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">{suggestion.organization}</p>
                  
                  <Badge className={`text-xs ${getTypeColor(suggestion.type)}`}>
                    {suggestion.type}
                  </Badge>
                </div>
              </div>
              
              {/* Match Reason */}
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <p className="text-xs text-gray-700 mb-2">
                  <strong>Why this match:</strong> {suggestion.reason}
                </p>
                
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {suggestion.mutualConnections} mutual connections
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    Recently active
                  </div>
                </div>
              </div>
              
              {/* Recent Activity */}
              <p className="text-xs text-gray-600 mb-4">
                <strong>Recent:</strong> {suggestion.recentActivity}
              </p>
              
              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  Connect
                </Button>
                <Button size="sm" variant="outline" className="flex-1">
                  Learn More
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
      
      {/* Refresh Suggestions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-6"
      >
        <Button variant="outline" className="w-full">
          <Brain className="w-4 h-4 mr-2" />
          Refresh Suggestions
        </Button>
      </motion.div>
    </div>
  );
}
```

## ✅ Verification
- [ ] Profile panel slides in smoothly from right
- [ ] Tabs switch without layout shift
- [ ] Profile information displays correctly
- [ ] Feed posts render with proper formatting
- [ ] AI suggestions show match scores
- [ ] Mobile responsive behavior works
- [ ] Close button and backdrop dismiss panel 