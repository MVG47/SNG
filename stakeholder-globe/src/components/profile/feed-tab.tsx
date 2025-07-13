'use client';

import { motion } from 'framer-motion';
import { Stakeholder } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageCircle, Share2, TrendingUp, Users, Calendar, Award } from 'lucide-react';

interface FeedTabProps {
  stakeholder: Stakeholder;
}

interface FeedPost {
  id: string;
  type: 'update' | 'opportunity' | 'achievement' | 'collaboration';
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
}

// Mock feed data generator
const generateFeedPosts = (stakeholder: Stakeholder): FeedPost[] => {
  const posts: FeedPost[] = [
    {
      id: '1',
      type: 'achievement',
      content: `Excited to announce that ${stakeholder.organization} has reached a major milestone in our ${stakeholder.interests[0]} initiative!`,
      timestamp: '2 hours ago',
      likes: 24,
      comments: 8,
      shares: 3
    },
    {
      id: '2', 
      type: 'opportunity',
      content: `Looking for partners in ${stakeholder.region} to collaborate on ${stakeholder.currentInitiatives[0]}. Let's drive innovation together!`,
      timestamp: '1 day ago',
      likes: 12,
      comments: 5,
      shares: 7
    },
    {
      id: '3',
      type: 'update',
      content: `Just completed an insightful discussion about ${stakeholder.interests[1] || stakeholder.interests[0]} trends. The future looks promising!`,
      timestamp: '3 days ago', 
      likes: 18,
      comments: 12,
      shares: 2
    },
    {
      id: '4',
      type: 'collaboration',
      content: `Thrilled to be working with amazing partners on our latest ${stakeholder.type === 'university' ? 'research' : 'project'}. Innovation happens through collaboration!`,
      timestamp: '1 week ago',
      likes: 31,
      comments: 15,
      shares: 9
    }
  ];
  
  return posts;
};

const getPostIcon = (type: FeedPost['type']) => {
  switch (type) {
    case 'achievement':
      return <Award className="h-4 w-4 text-yellow-500" />;
    case 'opportunity':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'collaboration':
      return <Users className="h-4 w-4 text-blue-500" />;
    default:
      return <Calendar className="h-4 w-4 text-gray-500" />;
  }
};

const getPostBadgeColor = (type: FeedPost['type']) => {
  switch (type) {
    case 'achievement':
      return 'bg-yellow-100 text-yellow-800';
    case 'opportunity':
      return 'bg-green-100 text-green-800';
    case 'collaboration':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function FeedTab({ stakeholder }: FeedTabProps) {
  const feedPosts = generateFeedPosts(stakeholder);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 space-y-4"
    >
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Activity Feed</h3>
        <p className="text-sm text-gray-600">Recent updates and activities from {stakeholder.name}</p>
      </div>
      
      {feedPosts.map((post, index) => (
        <motion.div
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getPostIcon(post.type)}
                  <Badge 
                    variant="secondary" 
                    className={`text-xs capitalize ${getPostBadgeColor(post.type)}`}
                  >
                    {post.type}
                  </Badge>
                </div>
                <span className="text-xs text-gray-500">{post.timestamp}</span>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-700 mb-4">{post.content}</p>
              
              <div className="flex items-center justify-between pt-3 border-t">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-red-500">
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-blue-500">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.comments}
                  </Button>
                  
                  <Button variant="ghost" size="sm" className="h-8 px-2 text-gray-500 hover:text-green-500">
                    <Share2 className="h-4 w-4 mr-1" />
                    {post.shares}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      <div className="text-center pt-4">
        <Button variant="outline" className="w-full">
          Load More Posts
        </Button>
      </div>
    </motion.div>
  );
} 