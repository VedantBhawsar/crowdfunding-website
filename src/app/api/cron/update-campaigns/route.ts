import { NextResponse } from 'next/server';
import prismaClient from '@/lib/prismadb';
import { CampaignStatus } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds max execution time for Hobby plan

/**
 * Updates campaign statuses based on dates and funding goals
 * This endpoint is meant to be called by a cron job
 */
export async function GET(request: Request) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('Authorization');
    if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const now = new Date();
    const results = {
      activatedCampaigns: 0,
      completedCampaigns: 0,
      fundedCampaigns: 0,
    };

    // 1. Update DRAFT campaigns to ACTIVE if their startDate has passed
    const activatedCampaigns = await prismaClient.campaign.updateMany({
      where: {
        status: CampaignStatus.DRAFT,
        startDate: { lte: now },
        isDeleted: false,
      },
      data: {
        status: CampaignStatus.ACTIVE,
      },
    });
    results.activatedCampaigns = activatedCampaigns.count;

    // 2. Update ACTIVE campaigns to COMPLETED if their endDate has passed
    const completedCampaigns = await prismaClient.campaign.updateMany({
      where: {
        status: CampaignStatus.ACTIVE,
        endDate: { lte: now },
        isDeleted: false,
      },
      data: {
        status: CampaignStatus.COMPLETED,
      },
    });
    results.completedCampaigns = completedCampaigns.count;

    // 3. Update ACTIVE campaigns to FUNDED if they've reached their goal
    const fundedCampaigns = await prismaClient.campaign.updateMany({
      where: {
        status: CampaignStatus.ACTIVE,
        raisedAmount: {
          gte: prismaClient.campaign.fields.goal,
        },
        isDeleted: false,
      },
      data: {
        status: CampaignStatus.FUNDED,
      },
    });
    results.fundedCampaigns = fundedCampaigns.count;

    // 4. Create activity entries for status changes
    if (
      results.activatedCampaigns > 0 ||
      results.completedCampaigns > 0 ||
      results.fundedCampaigns > 0
    ) {
      // Get all campaigns that were just updated
      const updatedCampaigns = await prismaClient.campaign.findMany({
        where: {
          OR: [
            { status: CampaignStatus.ACTIVE, updatedAt: { gte: new Date(Date.now() - 60000) } },
            { status: CampaignStatus.COMPLETED, updatedAt: { gte: new Date(Date.now() - 60000) } },
            { status: CampaignStatus.FUNDED, updatedAt: { gte: new Date(Date.now() - 60000) } },
          ],
        },
        select: {
          id: true,
          status: true,
        },
      });

      // Create activity entries for each updated campaign
      for (const campaign of updatedCampaigns) {
        await prismaClient.activity.create({
          data: {
            type: 'STATUS_CHANGED',
            description: `Campaign status changed to ${campaign.status}`,
            campaignId: campaign.id,
            metadata: {
              newStatus: campaign.status,
            },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Campaign statuses updated successfully',
      results,
    });
  } catch (error) {
    console.error('Error updating campaign statuses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
