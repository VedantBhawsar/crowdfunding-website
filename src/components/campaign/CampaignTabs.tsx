'use client';
import React from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CheckCircle2, Circle, Clock, Truck, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import getSupportersByCampaignSlug from '@/lib/prismadb';

interface Campaign {
  id: string;
  slug: string;
  title: string;
  description: string;
  goal: number;
  durationDays: number;
  ipfsHash?: string | null;
  images: string[];
  category: string;
  creatorName: string;
  creatorAvatar: string;
  raisedAmount: number;
  daysLeft: number;
  backers: number;
  story: { title: string; content: string }[];
  updates: { date: string; title: string; content: string }[];
  rewards: any[]; // Leaving as any for now, refine later
  milestones: any[]; // Leaving as any for now, refine later
}

interface Supporter {
  id: string;
  name: string | null;
  image: string | null;
}

interface Activity {
  id: string;
  createdAt: Date;
  description: string;
}

const CampaignTabs = ({ campaign }: { campaign: Campaign }) => {
  // Fetch supporters and activity feed
  const [supporters, setSupporters] = React.useState<Supporter[]>([]);
  const [activityFeed, setActivityFeed] = React.useState<Activity[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Handle error appropriately (e.g., show a toast)
      setIsLoading(false);
    };

    fetchData();
  }, [campaign.slug]);

  return (
    <Tabs defaultValue="story" className="w-full">
      <TabsList>
        <TabsTrigger value="story">Story</TabsTrigger>
        <TabsTrigger value="updates">Updates</TabsTrigger>
        <TabsTrigger value="community">Community</TabsTrigger>
        <TabsTrigger value="rewards">Rewards</TabsTrigger>
        <TabsTrigger value="milestones">Milestones</TabsTrigger>
      </TabsList>
      <TabsContent value="story" className="mt-6">
        <motion.div
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
          }}
          className="prose max-w-none"
        >
          {campaign.story?.map((item: { title: string; content: string }, index: number) => (
            <div className="mb-8" key={item.title}>
              <h1 className="font-bold text-lg mb-1 tracking-wide ">{item.title}</h1>
              <p className="leading-relaxed text-base text-muted-foreground tracking-wide">
                {item.content}
              </p>
            </div>
          ))}
        </motion.div>
      </TabsContent>
      <TabsContent value="updates" className="mt-6">
        <motion.div
          initial={{
            y: 20,
            opacity: 0,
          }}
          animate={{
            y: 0,
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
          }}
        >
          {campaign.updates?.map(
            (update: { date: string; title: string; content: string }, index: number) => (
              <Card
                key={update.title}
                className="mb-4 hover:bg-foreground/5 transition-all cursor-pointer"
              >
                <CardContent className="pt-6">
                  <p className="text-sm text-primary">{update.date}</p>
                  <h3 className="text-lg font-semibold mt-2">{update.title}</h3>
                  <p className="mt-2 text-foreground">{update.content}</p>
                </CardContent>
              </Card>
            )
          )}
        </motion.div>
      </TabsContent>
      <TabsContent value="community" className="mt-6">
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Community</h2>
          {isLoading ? (
            <div>Loading community data...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Supporters List */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Supporters</h3>
                <div className="space-y-4">
                  {supporters.map((supporter: Supporter) => (
                    <Card key={supporter.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start space-x-4">
                          <Avatar>
                            <AvatarImage src={supporter.image || '/api/placeholder/40/40'} />
                            <AvatarFallback>{supporter.name?.charAt(0) || 'U'}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{supporter.name || 'Unknown User'}</p>
                            {/* Display other supporter information if available */}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Activity Feed */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Activity Feed</h3>
                <div className="space-y-4">
                  {activityFeed.map((activity: Activity) => (
                    <Card key={activity.id}>
                      <CardContent className="pt-6">
                        <p className="text-sm text-muted-foreground">
                          {activity.createdAt.toLocaleDateString()}
                        </p>
                        <p className="font-medium">{activity.description}</p>
                        {/* Display other activity information if available */}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </TabsContent>
      <TabsContent value="rewards" className="mt-6">
        <div className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {campaign.rewards?.map((reward: any, index: number) => (
              <Card key={reward.id} className={`${reward.featured ? 'ring-2 ring-primary' : ''}`}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">${reward.amount}</CardTitle>
                      <CardDescription className="text-lg font-medium mt-1">
                        {reward.title}
                      </CardDescription>
                    </div>
                    {reward.featured && <Badge variant="default">Popular</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600 dark:text-gray-400">{reward.description}</p>

                  <div className="space-y-2">
                    <p className="font-medium">Includes:</p>
                    <ul className="list-disc pl-4 space-y-1">
                      {reward.items.map((item: any, index: number) => (
                        <li key={item} className="text-gray-600 dark:text-gray-300">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2 pt-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                      <Users className="h-4 w-4 mr-2" />
                      <span>
                        {reward.claimed} out of {reward.maxAvailable} claimed
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                      <Truck className="h-4 w-4 mr-2" />
                      <span>{reward.shipping}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-300">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>Estimated delivery: {reward.estimatedDelivery}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full" variant={reward.featured ? 'default' : 'outline'}>
                    Select Reward
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </TabsContent>
      <TabsContent value="milestones" className="mt-6">
        <div className="space-y-8">
          {/* Overall Progress */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">Campaign Progress</h3>
              <Progress
                value={(campaign.raisedAmount / campaign.goal) * 100}
                className="h-2 mb-2"
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>$0</span>
                <span>${campaign.goal.toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          {/* Milestones Timeline */}
          <div className="relative space-y-8">
            {campaign.milestones.map((milestone: any, index: number) => (
              <div key={milestone.id} className="relative">
                {index !== campaign.milestones.length - 1 && (
                  <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200" />
                )}

                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      {/* Status Icon */}
                      <div className="mt-1">
                        {milestone.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-gray-300" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-lg font-semibold">{milestone.title}</h3>
                            <p className="text-muted-foreground">{milestone.date}</p>
                          </div>
                          <Badge variant={milestone.completed ? 'default' : 'secondary'}>
                            ${milestone.targetAmount.toLocaleString()}
                          </Badge>
                        </div>

                        <p className="text-muted-foreground mb-4">{milestone.description}</p>

                        {/* Achievements */}
                        <div className="space-y-2">
                          <h4 className="font-medium">Key Achievements:</h4>
                          <ul className="list-disc pl-4 space-y-1">
                            {milestone.achievements.map((achievement: string, index: number) => (
                              <li key={achievement} className="text-muted-foreground">
                                {achievement}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
export default CampaignTabs;
