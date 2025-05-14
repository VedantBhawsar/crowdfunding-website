'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardFooter, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Campaign as PrismaCampaign, CampaignCategory } from '@prisma/client'; // Import Prisma types
import { motion } from 'framer-motion';
import { MessageCircle, Paperclip, CalendarDays } from 'lucide-react';

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
  const tomorrowNormalized = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

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
}

interface CampaignCardProps {
  campaign: ExtendedCampaign;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ campaign }) => {
  const fallbackAvatar = campaign.creatorName ? campaign.creatorName.charAt(0).toUpperCase() : 'U';

  console.log(campaign.creatorAvatar)
  const tagToDisplay = formatCampaignCategory(campaign.category);
  
  // Determine comments count:
  // 1. Prefer _count.comments if available (Prisma's aggregation)
  // 2. Fallback to campaign.comments.length if the full array is passed
  // 3. Default to 0
  const commentsCount = campaign._count?.comments ?? campaign.comments?.length ?? 0;

  // Attachments: Placeholder as it's not in the schema for Campaign directly.
  // If campaign.images should represent attachments, you can use campaign.images.length
  const attachmentsDisplayCount = campaign.attachmentsCountPlaceholder ?? (campaign.images?.length > 1 ? campaign.images.length -1 : 0) ; // Example: using images count or a placeholder.

  const dueDateDisplay = formatDateRelativeToToday(campaign.endDate);

  const mainImage = campaign.images?.[0] || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3'; // Default placeholder

  return (
    <Link href={`/campaign/${campaign.slug}`} passHref legacyBehavior>
      <motion.a
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="block w-full cursor-pointer group"
      >
        <Card className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col p-5 md:p-6">
          {/* Optional: Image Preview - uncomment if you want an image here */}
          {/* <div className="relative w-full h-32 mb-4 rounded-md overflow-hidden">
            <Image
              src={mainImage}
              alt={`${campaign.title} cover image`}
              fill
              style={{ objectFit: 'cover' }}
              className="group-hover:scale-105 transition-transform duration-300"
            />
          </div> */}

          <div className="flex-grow">
            <CardTitle className="text-xl font-bold text-teal-700 group-hover:text-teal-800 transition-colors duration-200 mb-1.5">
              {campaign.title}
            </CardTitle>
            <p className="text-sm text-slate-500 mb-5 leading-relaxed line-clamp-2 min-h-[40px]">
              {campaign.shortDescription}
            </p>

            <div className="flex items-center justify-between">
              <Badge
                variant="secondary"
                className="bg-teal-50 text-teal-600 border border-teal-100 px-3.5 py-1.5 text-xs font-medium rounded-md hover:bg-teal-100 transition-colors"
              >
                {tagToDisplay}
              </Badge>
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src={campaign.creatorAvatar} // Use the field from your schema
                  alt={campaign.creatorName || 'Creator'}
                />
              </Avatar>
            </div>
          </div>

          <CardFooter className="border-t border-slate-200 pt-4 pb-0 px-0 mt-6">
            <div className="flex items-center justify-between w-full text-sm text-slate-600">
              {/* <div className="flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-slate-400" />
                <span>{commentsCount}</span>
              </div> */}
              <div className="flex items-center gap-1.5">
                <Paperclip className="w-4 h-4 text-slate-400" />
                <span>{attachmentsDisplayCount}</span> {/* Using the placeholder or image count */}
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4 text-slate-400" />
                <span>{dueDateDisplay}</span>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.a>
    </Link>
  );
};

export default CampaignCard;