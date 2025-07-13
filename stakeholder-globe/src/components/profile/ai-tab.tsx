'use client';

import { motion } from 'framer-motion';
import { Stakeholder } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  Users, 
  MapPin, 
  Mail, 
  ExternalLink,
  Sparkles,
  Target,
  Lightbulb
} from 'lucide-react';
import { getStakeholderColor } from '@/lib/utils';

interface AITabProps {
  stakeholder: Stakeholder;
}

interface AIRecommendation {
  id: string;
  type: 'collaboration' | 'opportunity' | 'connection' | 'insight';
  title: string;
  description: string;
  confidence: number;
  actionable: boolean;
  relatedStakeholder?: {
    name: string;
    organization: string;
    type: Stakeholder['type'];
    region: string;
  };
}

// Mock AI recommendations generator
const generateAIRecommendations = (stakeholder: Stakeholder): AIRecommendation[] => {
  const recommendations: AIRecommendation[] = [
    {
      id: '1',
      type: 'collaboration',
      title: 'High-Potential Partnership Opportunity',
      description: `Based on shared interests in ${stakeholder.interests[0]} and complementary expertise, we recommend connecting with tech innovators in ${stakeholder.region}.`,
      confidence: 92,
      actionable: true,
      relatedStakeholder: {
        name: 'Dr. Sarah Chen',
        organization: 'Innovation Institute',
        type: stakeholder.type === 'university' ? 'entrepreneur' : 'university',
        region: stakeholder.region
      }
    },
    {
      id: '2',
      type: 'opportunity',
      title: 'Funding Opportunity Match',
      description: `A new grant program for ${stakeholder.interests[1] || stakeholder.interests[0]} initiatives has opened. Your profile shows 87% alignment with their criteria.`,
      confidence: 87,
      actionable: true
    },
    {
      id: '3',
      type: 'connection',
      title: 'Strategic Network Expansion',
      description: `Consider connecting with ${stakeholder.type === 'investor' ? 'entrepreneurs' : 'investors'} in emerging markets. Your expertise could provide significant value.`,
      confidence: 78,
      actionable: true,
      relatedStakeholder: {
        name: 'Marcus Rodriguez',
        organization: 'Global Ventures',
        type: stakeholder.type === 'investor' ? 'entrepreneur' : 'investor',
        region: 'Latin America'
      }
    },
    {
      id: '4',
      type: 'insight',
      title: 'Market Trend Analysis',
      description: `Recent data shows 34% growth in ${stakeholder.interests[0]} sector. Consider positioning your ${stakeholder.currentInitiatives[0]} to capitalize on this trend.`,
      confidence: 85,
      actionable: false
    }
  ];
  
  return recommendations;
};

const getRecommendationIcon = (type: AIRecommendation['type']) => {
  switch (type) {
    case 'collaboration':
      return <Users className="h-4 w-4 text-blue-500" />;
    case 'opportunity':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'connection':
      return <Target className="h-4 w-4 text-purple-500" />;
    case 'insight':
      return <Lightbulb className="h-4 w-4 text-yellow-500" />;
    default:
      return <Brain className="h-4 w-4 text-gray-500" />;
  }
};

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 90) return 'text-green-600 bg-green-100';
  if (confidence >= 75) return 'text-blue-600 bg-blue-100';
  if (confidence >= 60) return 'text-yellow-600 bg-yellow-100';
  return 'text-gray-600 bg-gray-100';
};

export default function AITab({ stakeholder }: AITabProps) {
  const recommendations = generateAIRecommendations(stakeholder);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 space-y-4"
    >
      <div className="text-center mb-6">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Brain className="h-5 w-5 text-purple-500" />
          <h3 className="text-lg font-semibold text-gray-900">AI Recommendations</h3>
        </div>
        <p className="text-sm text-gray-600">Personalized insights and opportunities powered by AI</p>
      </div>
      
      {recommendations.map((recommendation, index) => (
        <motion.div
          key={recommendation.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {getRecommendationIcon(recommendation.type)}
                  <CardTitle className="text-sm font-medium">{recommendation.title}</CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs ${getConfidenceColor(recommendation.confidence)}`}>
                    {recommendation.confidence}% match
                  </Badge>
                  {recommendation.actionable && (
                    <Sparkles className="h-4 w-4 text-purple-500" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <p className="text-gray-700 mb-4 text-sm">{recommendation.description}</p>
              
              {recommendation.relatedStakeholder && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: getStakeholderColor(recommendation.relatedStakeholder.type) }}
                    >
                      {recommendation.relatedStakeholder.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{recommendation.relatedStakeholder.name}</p>
                      <p className="text-xs text-gray-600">{recommendation.relatedStakeholder.organization}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs capitalize">
                        {recommendation.relatedStakeholder.type}
                      </Badge>
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {recommendation.relatedStakeholder.region}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-2 pt-3 border-t">
                {recommendation.actionable && (
                  <>
                    <Button size="sm" className="flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      Connect
                    </Button>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <ExternalLink className="h-3 w-3" />
                      Learn More
                    </Button>
                  </>
                )}
                {!recommendation.actionable && (
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    View Insights
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardContent className="p-4 text-center">
          <Brain className="h-8 w-8 text-purple-500 mx-auto mb-2" />
          <h4 className="font-medium text-gray-900 mb-1">Want More Personalized Recommendations?</h4>
          <p className="text-sm text-gray-600 mb-3">
            Our AI learns from your interactions to provide better suggestions
          </p>
          <Button variant="outline" size="sm">
            Enhance AI Profile
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
} 