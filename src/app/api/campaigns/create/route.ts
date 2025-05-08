import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/config/auth';
import prismaClient from '@/lib/prismadb';
import { z } from 'zod';
import { Milestone, Reward, CampaignStatus } from '@prisma/client';

// Campaign validation schema
const campaignSchema = z.object({
  title: z.string().min(5).max(100),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/),
  shortDescription: z.string().min(10).max(200),
  description: z.string().min(50),
  goal: z.number().positive(),
  durationDays: z.number().int().positive().lte(90),
  scheduledStartDate: z.string().optional(),
  launchNow: z.boolean().optional(),
  category: z.string(),
  tags: z.string().optional(),
  riskAssessment: z.string().optional(),
  socialLinks: z
    .object({
      website: z.string().url().optional(),
      twitter: z.string().optional(),
      instagram: z.string().optional(),
      linkedin: z.string().optional(),
      github: z.string().optional(),
    })
    .optional(),
  milestones: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        targetDate: z.string().optional(),
        completionPercentage: z.number().int().min(0).max(100).default(0),
      })
    )
    .optional(),
  rewards: z
    .array(
      z.object({
        title: z.string(),
        description: z.string(),
        amount: z.number().positive(),
        deliveryDate: z.string().optional(),
      })
    )
    .optional(),
});

// Util to parse file from formData
async function parseFormData(req: Request) {
  const formData = await req.formData();
  const campaignDataString = formData.get('campaignData') as string;
  const campaignData = JSON.parse(campaignDataString);

  // Get images
  const images: string[] = formData.getAll('images') as string[];
  return { campaignData, images };
}

export async function POST(req: Request) {
  try {
    // Verify user authentication
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is a creator
    const user = await prismaClient.user.findUnique({
      where: {
        email: session.user.email,
      },
    });

    if (!user || user.role !== 'CREATOR') {
      return NextResponse.json({ error: 'Only creators can create campaigns' }, { status: 403 });
    }

    // Parse form data with images
    const campaignData = await req.json();

    // Validate campaign data
    try {
      campaignSchema.parse(campaignData);
    } catch (validationError) {
      console.error('Validation error:', validationError);
      return NextResponse.json(
        { error: 'Invalid campaign data', details: validationError },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCampaign = await prismaClient.campaign.findUnique({
      where: {
        slug: campaignData.slug,
      },
    });

    if (existingCampaign) {
      return NextResponse.json({ error: 'Campaign URL already exists' }, { status: 400 });
    }

    // Prepare social links
    const socialLinks = campaignData.socialLinks || {};

    // Determine campaign status and start date based on launchNow and scheduledStartDate
    const now = new Date();
    let startDate = now;
    let status: CampaignStatus = CampaignStatus.DRAFT;
    
    // If launchNow is true or not provided, set status to ACTIVE and start date to now
    if (campaignData.launchNow === true || campaignData.launchNow === undefined) {
      status = CampaignStatus.ACTIVE;
      startDate = now;
    } 
    // If scheduledStartDate is provided and it's in the future, set status to DRAFT
    else if (campaignData.scheduledStartDate) {
      const scheduledDate = new Date(campaignData.scheduledStartDate);
      startDate = scheduledDate;
      
      // If scheduled date is today or in the past, set status to ACTIVE
      if (scheduledDate <= now) {
        status = CampaignStatus.ACTIVE;
      }
    }
    
    // Calculate end date based on start date and duration
    const endDate = new Date(startDate.getTime() + campaignData.durationDays * 24 * 60 * 60 * 1000);

    // Create campaign without milestones and rewards first
    const campaign = await prismaClient.campaign.create({
      data: {
        slug: campaignData.slug,
        title: campaignData.title,
        shortDescription: campaignData.shortDescription,
        description: campaignData.description,
        goal: campaignData.goal,
        category: campaignData.category,
        images: campaignData.images,
        tags: campaignData.tags ? campaignData.tags.split(',') : [],
        riskAssessment: campaignData.riskAssessment || '',
        website: socialLinks.website || '',
        twitter: socialLinks.twitter || '',
        instagram: socialLinks.instagram || '',
        linkedin: socialLinks.linkedin || '',
        github: socialLinks.github || '',
        creatorName: user.displayName || user.name || 'Anonymous Creator',
        creatorAvatar: user.image || '/api/placeholder/150/150',
        raisedAmount: 0,
        startDate: startDate,
        endDate: endDate,
        creatorId: user.id,
        status: status,
      },
    });

    // Create milestones if provided
    if (campaignData.milestones && campaignData.milestones.length > 0) {
      await prismaClient.milestone.createMany({
        data: campaignData.milestones.map((milestone: any) => {
          // Process targetDate - convert to proper Date object or null
          let targetDate = null;
          if (milestone.targetDate && milestone.targetDate.trim() !== '') {
            try {
              // Try to create a valid date
              targetDate = new Date(milestone.targetDate).toISOString();
            } catch (e) {
              console.error('Invalid date format for milestone:', e);
              // Keep as null if invalid
            }
          }
          
          return {
            title: milestone.title,
            description: milestone.description,
            targetDate: targetDate,
            completionPercentage: milestone.completionPercentage || 0,
            campaignId: campaign.id,
            status: 'PENDING',
            fundingAmount: 0,
          };
        }),
      });
    }

    // Create rewards if provided
    if (campaignData.rewards && campaignData.rewards.length > 0) {
      await prismaClient.reward.createMany({
        data: campaignData.rewards.map((reward: any) => {
          // Process deliveryDate - convert to proper Date object or null
          let deliveryDate = null;
          if (reward.deliveryDate && reward.deliveryDate.trim() !== '') {
            try {
              // Try to create a valid date
              deliveryDate = new Date(reward.deliveryDate).toISOString();
            } catch (e) {
              console.error('Invalid date format for reward:', e);
              // Keep as null if invalid
            }
          }
          
          return {
            title: reward.title,
            description: reward.description,
            amount: reward.amount,
            deliveryDate: deliveryDate,
            campaignId: campaign.id,
          };
        }),
      });
    }

    // Create activity entry for campaign creation
    await prismaClient.activity.create({
      data: {
        type: 'CAMPAIGN_CREATED',
        description: `Campaign "${campaign.title}" was created`,
        campaignId: campaign.id,
        userId: user.id,
        metadata: {
          status: campaign.status,
          startDate: campaign.startDate,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Campaign created successfully',
      slug: campaign.slug,
      id: campaign.id,
      status: campaign.status,
      startDate: campaign.startDate,
    });
  } catch (error) {
    console.error('Error creating campaign:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
