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
    opacity: 0
  },
  visible: { 
    x: 0, 
    opacity: 1
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
  
  const handleTabChange = (value: string) => {
    if (value === 'profile' || value === 'feed' || value === 'ai') {
      setActiveTab(value);
    }
  };
  
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
            transition={{ duration: 0.3, ease: 'easeInOut' }}
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
            <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
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