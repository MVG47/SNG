'use client';

import { motion } from 'framer-motion';
import { Stakeholder } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Building, Globe, Users, TrendingUp, Target } from 'lucide-react';
import { getStakeholderColor } from '@/lib/utils';

interface ProfileTabProps {
  stakeholder: Stakeholder;
}

export default function ProfileTab({ stakeholder }: ProfileTabProps) {
  const stakeholderColor = getStakeholderColor(stakeholder.type);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 space-y-4"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <div 
          className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white font-bold text-xl"
          style={{ backgroundColor: stakeholderColor }}
        >
          {stakeholder.name.charAt(0)}
        </div>
        <h3 className="text-xl font-bold text-gray-900">{stakeholder.name}</h3>
        <p className="text-gray-600">{stakeholder.organization}</p>
        <Badge variant="secondary" className="capitalize">
          {stakeholder.type}
        </Badge>
      </div>

      {/* Location */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{stakeholder.region}</p>
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Building className="h-4 w-4" />
            About
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">{stakeholder.description}</p>
        </CardContent>
      </Card>

      {/* Impact Metrics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Impact Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            {stakeholder.impactMetrics.funding && (
              <div>
                <p className="text-sm text-gray-500">Funding</p>
                <p className="font-semibold">${stakeholder.impactMetrics.funding.toLocaleString()}</p>
              </div>
            )}
            {stakeholder.impactMetrics.employees && (
              <div>
                <p className="text-sm text-gray-500">Employees</p>
                <p className="font-semibold">{stakeholder.impactMetrics.employees.toLocaleString()}</p>
              </div>
            )}
            {stakeholder.impactMetrics.studentsReached && (
              <div>
                <p className="text-sm text-gray-500">Students Reached</p>
                <p className="font-semibold">{stakeholder.impactMetrics.studentsReached.toLocaleString()}</p>
              </div>
            )}
            {stakeholder.impactMetrics.projectsCompleted && (
              <div>
                <p className="text-sm text-gray-500">Projects</p>
                <p className="font-semibold">{stakeholder.impactMetrics.projectsCompleted}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Interests */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Target className="h-4 w-4" />
            Interests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {stakeholder.interests.map((interest, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {interest}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Current Initiatives */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Current Initiatives
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {stakeholder.currentInitiatives.map((initiative, index) => (
              <li key={index} className="text-sm text-gray-700 flex items-start gap-2">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                {initiative}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Contact Info */}
      {(stakeholder.contactInfo.email || stakeholder.contactInfo.linkedin || stakeholder.contactInfo.website) && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Contact Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {stakeholder.contactInfo.email && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Email:</span> {stakeholder.contactInfo.email}
              </p>
            )}
            {stakeholder.contactInfo.linkedin && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">LinkedIn:</span> {stakeholder.contactInfo.linkedin}
              </p>
            )}
            {stakeholder.contactInfo.website && (
              <p className="text-sm text-gray-700">
                <span className="font-medium">Website:</span> {stakeholder.contactInfo.website}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
} 