import { NextResponse } from 'next/server';
import prismaClient from '@/lib/prismadb';

export const dynamic = 'force-dynamic';
export const maxDuration = 300; // 5 minutes max execution time

/**
 * Updates reward statuses and checks if they're ready to be claimed
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
      rewardsReadyForClaim: 0,
    };

    // Update rewards that are ready to be claimed based on deliveryDate
    const readyRewards = await prismaClient.reward.updateMany({
      where: {
        deliveryDate: { lte: now },
        readyForClaimAt: null,
      },
      data: {
        readyForClaimAt: now,
      },
    });
    results.rewardsReadyForClaim = readyRewards.count;

    // If any rewards were updated, create activity entries
    if (results.rewardsReadyForClaim > 0) {
      // Get all rewards that were just marked as ready
      const updatedRewards = await prismaClient.reward.findMany({
        where: {
          readyForClaimAt: { gte: new Date(Date.now() - 60000) },
        },
        select: {
          id: true,
          title: true,
          campaignId: true,
        },
      });

      // Create activity entries for each updated reward
      for (const reward of updatedRewards) {
        await prismaClient.activity.create({
          data: {
            type: 'REWARD_CLAIMED',
            description: `Reward "${reward.title}" is now ready to be claimed`,
            campaignId: reward.campaignId,
            metadata: {
              rewardId: reward.id,
              rewardTitle: reward.title,
            },
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Reward statuses updated successfully',
      results,
    });
  } catch (error) {
    console.error('Error updating reward statuses:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
