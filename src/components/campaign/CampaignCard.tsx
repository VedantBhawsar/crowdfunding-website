'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Campaign as PrismaCampaign, CampaignCategory } from '@prisma/client'; // Import Prisma types
import { motion } from 'framer-motion';
import { ArrowUpRight, Users, Clock } from 'lucide-react';

// Helper function to format Prisma CampaignCategory enum to a display string
const formatCampaignCategory = (category?: CampaignCategory): string => {
  if (!category) return 'General';
  // Capitalize first letter, lowercase rest. Replace underscores with spaces.
  const formatted = category
    .toLowerCase()
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
  return formatted;
};

// Helper function to format due date (from Prisma schema: endDate)
const formatDateRelativeToToday = (dateInput?: Date | string | null): string => {
  if (!dateInput) return 'No Due Date';

  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

  if (isNaN(date.getTime())) {
    return typeof dateInput === 'string' ? dateInput : 'Invalid Date';
  }

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const dateNormalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowNormalized = new Date(
    tomorrow.getFullYear(),
    tomorrow.getMonth(),
    tomorrow.getDate()
  );

  if (dateNormalized.getTime() === todayNormalized.getTime()) {
    return 'Today';
  }
  if (dateNormalized.getTime() === tomorrowNormalized.getTime()) {
    return 'Tomorrow';
  }
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
};

// Define the expected shape of the campaign prop, potentially including Prisma's _count for relations
interface ExtendedCampaign extends PrismaCampaign {
  comments?: { id: string }[]; // If you fetch comments directly for length
  _count?: {
    comments?: number;
    backers?: number; // Add backers count
  };
  // attachmentsCount is not in the schema for Campaign directly.
  // We will simulate it or use a placeholder.
  attachmentsCountPlaceholder?: number;
  // Add missing properties from the component usage
  goal: number;
  raisedAmount: number;
}

interface CampaignCardProps {
  campaign: ExtendedCampaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const fallbackAvatar = campaign.creatorName ? campaign.creatorName.charAt(0).toUpperCase() : 'U';

  const tagToDisplay = formatCampaignCategory(campaign.category);

  // Determine comments count:
  // 1. Prefer _count.comments if available (Prisma's aggregation)
  // 2. Fallback to campaign.comments.length if the full array is passed
  // 3. Default to 0
  const commentsCount = campaign._count?.comments ?? campaign.comments?.length ?? 0;

  // Attachments: Placeholder as it's not in the schema for Campaign directly.
  // If campaign.images should represent attachments, you can use campaign.images.length
  const attachmentsDisplayCount =
    campaign.attachmentsCountPlaceholder ??
    (campaign.images?.length > 1 ? campaign.images.length - 1 : 0); // Example: using images count or a placeholder.

  const dueDateDisplay = formatDateRelativeToToday(campaign.endDate);
  const backersCount = campaign._count?.backers ?? 0;

  const mainImage =
    campaign.images?.[0] ||
    'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3'; // Default placeholder

  return (
    <Link href={`/campaign/${campaign.slug}`} passHref legacyBehavior>
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="block w-full cursor-pointer group h-full"
      >
        <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full flex flex-col border-slate-200 overflow-hidden group relative">
          {/* Image Preview with gradient overlay */}
          <div className="relative w-full h-48 overflow-hidden">
            <Image
              src={mainImage}
              alt={`${campaign.title} cover image`}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              priority
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>

            {/* Campaign category badge positioned on the image */}
            <div className="absolute top-4 left-4 z-10">
              <Badge
                variant="secondary"
                className="bg-white/90 backdrop-blur-sm text-teal-600 border border-teal-100/50 px-2.5 py-1 text-xs font-medium rounded-md shadow-sm"
              >
                {tagToDisplay}
              </Badge>
            </div>

            {/* Creator positioned on the image */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
              <div className="flex items-center space-x-2">
                <Avatar className="w-7 h-7 border-2 border-white/80">
                  <AvatarImage
                    src={campaign.creatorAvatar} // Use the field from your schema
                    alt={campaign.creatorName || 'Creator'}
                  />
                  <AvatarFallback className="bg-teal-500 text-white text-xs">
                    {fallbackAvatar}
                  </AvatarFallback>
                </Avatar>
                <span className="text-xs font-medium text-white/90 line-clamp-1">
                  {campaign.creatorName || 'Anonymous'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex-grow p-5">
            <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-teal-700 transition-colors duration-200 mb-2 line-clamp-2">
              {campaign.title}
            </CardTitle>
            <p className="text-sm text-slate-600 mb-4 leading-relaxed line-clamp-2 min-h-[40px]">
              {campaign.shortDescription}
            </p>

            {/* Progress Bar */}
            {campaign.goal > 0 && (
              <div className="mb-4">
                <div className="flex justify-between items-center mb-1.5 text-xs text-slate-600">
                  <span className="font-medium">
                    {Math.round((campaign.raisedAmount / campaign.goal) * 100)}% Funded
                  </span>
                  <span>
                    {campaign.raisedAmount} / {campaign.goal} ETH
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-400 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{
                      width: `${Math.min(Math.round((campaign.raisedAmount / campaign.goal) * 100), 100)}%`,
                    }}
                    transition={{ duration: 1, delay: 0.2 }}
                  ></motion.div>
                </div>
              </div>
            )}

            {/* Stats row */}
            <div className="flex items-center justify-between text-xs text-slate-600 mt-4">
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                <span>{backersCount} backers</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{dueDateDisplay}</span>
              </div>
            </div>
          </div>

          <CardFooter className="border-t border-slate-100 p-3 bg-slate-50/50">
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-medium text-slate-500">View details</span>
              <motion.div
                className="h-7 w-7 rounded-full flex items-center justify-center bg-teal-100/50 group-hover:bg-teal-100 transition-colors"
                whileHover={{ rotate: 45 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowUpRight className="h-3.5 w-3.5 text-teal-600" />
              </motion.div>
            </div>
          </CardFooter>
        </Card>
      </motion.a>
    </Link>
  );
};

export default CampaignCard;
