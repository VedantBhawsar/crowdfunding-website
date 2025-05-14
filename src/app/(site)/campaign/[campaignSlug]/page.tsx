'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, differenceInDays, addDays, isPast } from 'date-fns';
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  Calendar,
  Users,
  Clock,
  Github,
  Twitter,
  Linkedin,
  Globe,
  Instagram,
  Coins,
  Vote,
} from 'lucide-react';
import Image from 'next/image';

import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Campaign, Milestone, Reward, Backers, Transaction } from '@prisma/client';
import Link from 'next/link';
import { PledgeModal } from '@/components/campaign/PledgeModal'; // Adjust path
import { useAccount } from 'wagmi'; //
import { toast } from 'sonner';
import { useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Extend the Campaign interface to include related models
// In CampaignPage.tsx
interface CampaignWithRelations extends Campaign {
  milestones: Milestone[];
  rewards: Reward[];
  backers: (Backers & {
    user?: { name: string | null; image: string | null };
  })[];
  transactions: (Transaction & {
    user?: { name: string | null; image: string | null };
  })[];
  creator?: {
    id: string;
    name: string | null;
    image: string | null;
    wallet: { address: string } | null; // Include wallet address
  } | null;
  creatorWalletAddress?: string | null; // Denormalized address added by API
}

export default function CampaignPage() {
  const params = useParams();
  const router = useRouter();
  const [campaign, setCampaign] = useState<CampaignWithRelations | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isPledgeModalOpen, setIsPledgeModalOpen] = useState(false);
  const [selectedRewardForPledge, setSelectedRewardForPledge] = useState<Reward | null>(null);
  const [claimingReward, setClaimingReward] = useState(false);
  const [claimSuccess, setClaimSuccess] = useState(false);
  const { isConnected } = useAccount();
  const campaignSlug = params.campaignSlug as string;
  const searchParams = useSearchParams();
  const claimRewardId = searchParams.get('claim');
  const {data: session} = useSession()
  const [claimAttempted, setClaimAttempted] = useState(false);

  // Function to handle pledge success
  function handlePledgeSuccess() {
    setCampaign((prevCampaign) => {
      if (!prevCampaign) return null;
      return {
        ...prevCampaign,
        raisedAmount: prevCampaign.raisedAmount + (selectedRewardForPledge?.amount || 0),
      };
    });
    toast.success('Thank you for your pledge!');
    setTimeout(() => window.location.reload(), 1500); // Reload to get updated data
  }

  // Function to open the pledge modal
  function openPledgeModal(reward: Reward | null = null) {
    setSelectedRewardForPledge(reward);
    setIsPledgeModalOpen(true);
  }

  // Handle reward claiming
  const handleClaimReward = async (reward: Reward) => {
    if (!isConnected) {
      toast.error('Please connect your wallet to claim this reward.');
      return;
    }

    try {
      setClaimingReward(true);

      // Call API to mark reward as claimed by user
      const response = await fetch(`/api/rewards/claim/${reward.id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to claim reward (${response.status})`);
      }

      const data = await response.json();

      if (data.success) {
        setClaimSuccess(true);
        toast.success('Reward claimed successfully!');
        // Refresh campaign data
        window.location.reload();
      } else {
        throw new Error(data.message || 'Failed to claim reward');
      }
    } catch (err) {
      console.error('Error claiming reward:', err);
      toast.error(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setClaimingReward(false);
    }
  };

  useEffect(() => {
    if (!campaignSlug) {
      setError('Campaign slug not found.');
      setIsLoading(false);
      return;
    }

    const fetchCampaign = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch the campaign
        const res = await fetch(`/api/campaigns/${campaignSlug}`);
        
        if (!res.ok) {
          throw new Error(`Error fetching campaign: ${res.status}`);
        }
        
        const data = await res.json();
        setCampaign(data);
        
        // Handle "?claim=xxx" parameter in URL
        if (claimRewardId && !claimAttempted && data.rewards) {
          setClaimAttempted(true);
          const rewardToClaim = data.rewards.find((r: Reward) => r.id === claimRewardId);
          if (rewardToClaim) {
            handleClaimReward(rewardToClaim);
          } else {
            toast.error("The reward you're trying to claim was not found");
          }
        }
      } catch (err) {
        console.error('Error loading campaign:', err);
        setError(err instanceof Error ? err.message : 'Failed to load campaign details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCampaign();
  }, [campaignSlug, claimRewardId, handleClaimReward, claimAttempted]); // Add claimAttempted dependency

  async function handleVote() {

  }

  // --- Derived Data Calculations ---
  const calculateDaysLeft = (createdAt: Date | string, durationDays: number): number => {
    try {
      const startDate = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
      const endDate = addDays(startDate, durationDays);
      if (isPast(endDate)) return 0; // Campaign ended
      return differenceInDays(endDate, new Date());
    } catch {
      return 0; // Handle invalid date format
    }
  };

  const progressPercentage = campaign
    ? Math.min(100, Math.round((campaign.raisedAmount / campaign.goal) * 100))
    : 0;

  // TODO: Add logic for campaigns with a target date
  const daysLeft = campaign ? calculateDaysLeft(campaign.createdAt, 0) : 0;

  // --- Render Logic ---
  if (isLoading) {
    return (
      <div className="flex h-[70vh] w-full items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error Loading Campaign</h2>
          <p className="mt-2 text-muted-foreground">{error}</p>
        </div>
        <Button onClick={() => router.push('/campaigns')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="flex h-[70vh] w-full flex-col items-center justify-center space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Campaign Not Found</h2>
          <p className="mt-2 text-muted-foreground">The campaign you&apos;re looking for doesn&apos;t exist.</p>
        </div>
        <Button onClick={() => router.push('/campaigns')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Campaigns
        </Button>
      </div>
    );
  }

  // --- Main Campaign Display ---
  return (
    <div className="container mx-auto py-8">
      {/* Optional Back Button */}
      <Button onClick={() => router.back()} variant="outline" size="sm" className="mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Campaigns
      </Button>

      {/* Pledge Modal - place it at the component level, not inside each card */}
      {campaign && (
        <PledgeModal
          isOpen={isPledgeModalOpen}
          onOpenChange={setIsPledgeModalOpen}
          campaignId={campaign.id}
          campaignTitle={campaign.title}
          creatorWalletAddress={campaign.creatorWalletAddress || null}
          selectedReward={selectedRewardForPledge}
          onSuccess={handlePledgeSuccess}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Title & Short Description */}
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
            {campaign.title}
          </h1>
          <p className="text-lg text-muted-foreground">{campaign.shortDescription}</p>

          {/* Creator Info (Mobile View) */}
          <div className="flex lg:hidden items-center gap-3 pt-2 pb-4 border-b">
            <Avatar className="h-10 w-10">
              <AvatarImage src={campaign.creatorAvatar || undefined} alt={campaign.creatorName} />
              <AvatarFallback>{campaign.creatorName?.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium text-foreground">{campaign.creatorName}</p>
              <p className="text-xs text-muted-foreground">Campaign Creator</p>
            </div>
          </div>

          {/* Main Image/Video */}
          {campaign.images && campaign.images.length > 0 && (
            <div className="aspect-video w-full rounded-lg overflow-hidden bg-muted border">
              {/* Replace img with Next.js Image component */}
              <div className="relative w-full h-full">
                <Image 
                  src={campaign.images[0]} 
                  alt={`${campaign.title} main visual`}
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                />
              </div>
            </div>
          )}

          {/* Tabs for Details */}
          <Tabs defaultValue="story" className="w-full">
            <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 mb-4">
              {' '}
              {/* Adjust grid cols */}
              <TabsTrigger value="story">Story</TabsTrigger>
              {/* Add Updates tab later if needed */}
              {/* <TabsTrigger value="updates">Updates</TabsTrigger> */}
              {campaign.milestones && campaign.milestones.length > 0 && (
                <TabsTrigger value="milestones">Milestones</TabsTrigger>
              )}
              {/* TODO: Add rewards tab later if needed */}
              {campaign.rewards && campaign.rewards.length > 0 && (
                <TabsTrigger value="rewards_tab">Rewards</TabsTrigger>
              )}
              {/* Add Backers tab later if needed */}
              <TabsTrigger value="backers">Backers</TabsTrigger>
            </TabsList>

            {/* Story Content */}
            <TabsContent
              value="story"
              className="prose prose-lg dark:prose-invert max-w-none space-y-4"
            >
              {/* Use markdown renderer here if description is markdown */}
              <p>{campaign.description}</p>

              {campaign.riskAssessment && (
                <>
                  <Separator className="my-6" />
                  <h3 className="text-xl font-semibold !mb-3">Risks and Challenges</h3>
                  <p className="text-base text-muted-foreground">{campaign.riskAssessment}</p>
                </>
              )}
            </TabsContent>

            <TabsContent value="backers">
              <h3 className="text-xl font-semibold mb-4">
                Project Backers ({campaign.backers?.length || 0})
              </h3>
              {campaign.backers && campaign.backers.length > 0 ? (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                  {' '}
                  {campaign.backers
                    .sort(
                      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    ) // Sort newest first
                    .map(backer => (
                      <div
                        key={backer.id}
                        className="flex items-center justify-between p-3 bg-card/30 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        {/* Left side: Avatar and Name/Date */}
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            {/* Use optional chaining for user and image */}
                            <AvatarImage
                              src={backer.user?.image || undefined}
                              alt={backer.user?.name || 'Backer'}
                            />
                            <AvatarFallback>
                              {/* Fallback: First letter of name or 'B' */}
                              {backer.user?.name ? backer.user.name.charAt(0).toUpperCase() : 'B'}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {/* Handle anonymous backers */}
                              {backer.user?.name || 'Anonymous Backer'}
                            </p>
                            {backer.createdAt && (
                              <p className="text-xs text-muted-foreground">
                                Backed on {format(new Date(backer.createdAt), 'PP')}{' '}
                                {/* Format date */}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Right side: Amount Pledged */}
                        <Badge variant="secondary" className="text-sm font-semibold px-2.5 py-1">
                          {/* Format ETH amount */}
                          {backer.amount.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 4,
                          })}{' '}
                          ETH
                        </Badge>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">
                  Be the first to back this project!
                </p>
              )}
            </TabsContent>

            {/* Milestones Content */}
            {campaign.milestones && campaign.milestones.length > 0 && (
              <TabsContent value="milestones" className="space-y-4">
                <h3 className="text-xl font-semibold">Project Milestones</h3>
                {campaign.milestones.map((milestone: Milestone, index) => (
                  <Card
                    key={milestone.id || index}
                    className={cn(
                      'bg-card/50 hover:bg-card/80 transition-all border-l-4',
                      milestone?.status === 'COMPLETED'
                        ? 'border-l-green-500'
                        : 'border-l-yellow-500'
                    )}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <span>{milestone.title}</span>
                          {milestone?.status === 'COMPLETED' ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <Clock className="h-5 w-5 text-yellow-500" />
                          )}
                        </CardTitle>
                        <Badge
                          variant={milestone.completionPercentage === 100 ? 'default' : 'secondary'}
                          className="ml-2"
                        >
                          {milestone.completionPercentage}% Complete
                        </Badge>
                      </div>
                      {milestone.targetDate && (
                        <CardDescription className="text-xs flex items-center gap-2 pt-1">
                          <Calendar className="h-3 w-3" />
                          <span>Target: {format(new Date(milestone.targetDate), 'PPP')}</span>
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-muted-foreground mb-2">{milestone.description}</p>
                      {milestone.fundingAmount && (
                        <div className="flex items-center justify-between text-xs mt-4 pt-3 border-t border-border/50">
                          <div className="flex items-center gap-2">
                            <Coins className="h-3 w-3 text-primary" />
                            <span>Funding: {milestone.fundingAmount} ETH</span>
                          </div>
                          {milestone?.status !== 'COMPLETED' && campaign.backers?.some(backer => backer.userId === session?.user.id) && (
                            <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleVote}>
                              <Vote className="h-3 w-3 mr-1" />
                              Vote to Release
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                    {milestone.completionPercentage > 0 && milestone.completionPercentage < 100 && (
                      <CardFooter className="px-6 pt-0 pb-4">
                        <div className="w-full">
                          <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full transition-all duration-500 ease-in-out"
                              style={{
                                width: `${milestone.completionPercentage}%`,
                              }}
                            />
                          </div>
                        </div>
                      </CardFooter>
                    )}
                  </Card>
                ))}
              </TabsContent>
            )}

            {/* Rewards Content (Redundant with sidebar, but can be an alternative view) */}
            {campaign.rewards && campaign.rewards.length > 0 && (
              <TabsContent value="rewards_tab" className="space-y-4">
                <h3 className="text-xl font-semibold">Available Rewards</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaign.rewards.map((reward, index) => renderRewardCard(reward, index))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>

        {/* Sidebar Area */}
        <div className="lg:col-span-1 space-y-6">
          {/* Progress & Stats Card */}
          <Card className="overflow-hidden shadow-md">
            <CardContent className="p-4 space-y-4">
              <Progress value={progressPercentage} className="h-3 w-full" />
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">
                  {campaign.raisedAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 4,
                  })}{' '}
                  ETH
                </p>
                <p className="text-sm text-muted-foreground">
                  pledged of {campaign.goal.toLocaleString()} ETH goal ({progressPercentage}%)
                </p>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1.5 text-foreground">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  {campaign.backers?.length || 0} backers
                </div>
                <div className="flex items-center gap-1.5 text-foreground">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{daysLeft}</span> days left
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-4">
              {/* Pledge button */}
              <Button
                size="lg"
                className="w-full font-semibold"
                onClick={() => {
                  if (!isConnected) {
                    toast.error('Please connect your wallet to back this project.');
                    return;
                  }
                  setSelectedRewardForPledge(null);
                  setIsPledgeModalOpen(true);
                }}
                disabled={!isConnected || campaign?.status !== 'ACTIVE'} // Disable if not connected or campaign inactive
              >
                {isConnected ? 'Back This Project' : 'Connect Wallet to Back'}
              </Button>
            </CardFooter>
          </Card>

          <div className="flex flex-row items-center gap-3 space-y-0 pb-3">
            <Link href={`/account?id=${campaign?.creatorId}`}>
              <Avatar className="h-10 w-10">
                <AvatarImage src={campaign.creatorAvatar || undefined} alt={campaign.creatorName} />
                <AvatarFallback>{campaign.creatorName?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <h1 className="text-base font-bold">{campaign.creatorName}</h1>
              <p className="text-xs text-muted-foreground">Campaign Creator</p>
            </div>
          </div>

          {/* Rewards List (Sidebar) */}
          {campaign.rewards && campaign.rewards.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Rewards</h3>
              {campaign.rewards.map((reward, index) => renderRewardCard(reward, index))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Helper function to render reward cards
  function renderRewardCard(reward: Reward, index: number) {
    // Check if the reward is ready to be claimed (claimed status is 1)
    const isClaimable = reward.claimed === 1;
    // Check if the reward has been fully claimed (claimed status is 2)
    const isClaimed = reward.claimed === 2;

    return (
      <Card key={reward.id || index} className="overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{reward.title}</CardTitle>
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="font-normal">
              {new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
              }).format(reward.amount)}
            </Badge>
            {isClaimable && (
              <Badge className="bg-green-500 text-white">
                Ready to Claim
              </Badge>
            )}
            {isClaimed && (
              <Badge className="bg-blue-500 text-white">
                Claimed
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pb-3">
          <p className="text-sm text-muted-foreground">{reward.description}</p>
          {reward.deliveryDate && (
            <div className="mt-2 flex items-center text-xs text-muted-foreground">
              <Calendar className="mr-1 h-3 w-3" />
              Estimated delivery: {format(new Date(reward.deliveryDate), 'MMMM yyyy')}
            </div>
          )}
        </CardContent>
        <CardFooter className="pt-0">
          {isClaimable ? (
            <Button
              onClick={() => handleClaimReward(reward)}
              className="w-full"
              disabled={claimingReward}
            >
              {claimingReward ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Claiming...
                </>
              ) : (
                'Claim Reward'
              )}
            </Button>
          ) : isClaimed ? (
            <Button variant="outline" className="w-full" disabled>
              <CheckCircle className="mr-2 h-4 w-4" />
              Claimed
            </Button>
          ) : (
            <Button
              onClick={() => openPledgeModal(reward)}
              variant="outline"
              className="w-full"
            >
              Select
            </Button>
          )}
        </CardFooter>
      </Card>
    );
  }
}
