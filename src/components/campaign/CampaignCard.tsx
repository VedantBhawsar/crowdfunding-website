import React from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Using Next.js Image for optimization
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock, Target } from 'lucide-react';
import { Campaign, CampaignStatus } from '@prisma/client';
import { useSession } from 'next-auth/react';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const getStatusVariant = (
  status: CampaignStatus
): 'default' | 'secondary' | 'destructive' | 'outline' => {
  switch (status) {
    case CampaignStatus.ACTIVE:
      return 'default';
    case CampaignStatus.COMPLETED:
      return 'secondary';
    case CampaignStatus.CANCELLED:
      return 'outline';
    case CampaignStatus.FUNDED:
      return 'destructive';
    default:
      return 'default';
  }
};

interface CampaignCardProps {
  campaign: Campaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  // Calculate progress percentage
  const progressPercentage =
    campaign.goal > 0 ? Math.min((campaign.raisedAmount / campaign.goal) * 100, 100) : 0;

  // Determine display for time left or status
  const timeDisplay =
    campaign.status === CampaignStatus.ACTIVE &&
      campaign.daysLeft !== null &&
      campaign.daysLeft >= 0 ? (
      `${campaign.daysLeft} days left`
    ) : (
      <Badge variant={getStatusVariant(campaign.status)} className="capitalize">
        {campaign.status.toLowerCase()}
      </Badge>
    );

  const fallbackAvatar = campaign.creatorName ? campaign.creatorName.charAt(0).toUpperCase() : 'C';

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/campaigns/${campaign.slug}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        toast.error('Failed to delete campaign');
        return;
      }

      toast.success('Campaign deleted successfully');
      router.refresh();
    } catch (error) {
      console.error('Error deleting campaign:', error);
      toast.error('Failed to delete campaign');
    }
  };

  return (
    <Link href={`/campaign/${campaign.slug}`} passHref legacyBehavior>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <a className="block group">
          {' '}
          {/* Wrap in <a> for clickability */}
          <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-primary/30 flex flex-col">
            {/* Image Section */}
            <div className="relative w-full aspect-video overflow-hidden">
              <Image
                src={campaign.images?.[0] || '/placeholder-image.png'} // Use first image or a placeholder
                alt={campaign.title}
                fill // Use fill for responsive aspect ratio defined by parent
                style={{ objectFit: 'cover' }} // Crop image to cover area
                className="transition-transform duration-300 group-hover:scale-105"
              />
              {/* Optional: Category Badge on Image */}
              <Badge variant="secondary" className="absolute top-2 left-2">
                {campaign.category}
              </Badge>
            </div>

            {/* Content Section */}
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-semibold leading-tight group-hover:text-primary transition-colors truncate">
                {campaign.title}
              </CardTitle>
              <p className="text-sm text-muted-foreground line-clamp-2 h-[40px]">
                {' '}
                {/* Limit description lines */}
                {campaign.shortDescription}
              </p>
            </CardHeader>

            <CardContent className="pt-0 pb-4 flex-grow">
              <div className="mb-3">
                <Progress value={progressPercentage} className="h-2" />
                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                  <span className="font-medium text-primary/90">
                    {formatCurrency(campaign.raisedAmount)} raised
                  </span>
                  <span className="flex items-center gap-1">
                    <Target className="h-3 w-3" /> {formatCurrency(campaign.goal)}
                  </span>
                </div>
              </div>
              {/* Days Left / Status */}
              <div className="flex items-center text-xs text-muted-foreground gap-1">
                <Clock className="h-3 w-3" />
                {timeDisplay}
              </div>
            </CardContent>

            {/* Footer Section (Creator Info) */}
            <CardFooter className="pt-2 pb-4 border-t bg-muted/30">
              {pathname === '/account' && session?.user.id === campaign.creatorId && (
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              )}

              {pathname !== `/account` && (
                <Link
                  href={`/account?id=${campaign.creatorId}`}
                  className="flex items-center space-x-2 w-full"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={campaign.creatorAvatar || undefined}
                      alt={campaign.creatorName || 'Creator'}
                    />
                    <AvatarFallback>{fallbackAvatar}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs text-muted-foreground truncate">
                    by {campaign.creatorName || 'Anonymous'}
                  </span>
                </Link>
              )}
            </CardFooter>
          </Card>
        </a>
      </motion.div>
    </Link>
  );
};

export default CampaignCard;
